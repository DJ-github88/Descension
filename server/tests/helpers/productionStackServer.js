/**
 * Production middleware-stack test fixture.
 *
 * Unlike helpers/integrationServer.js (which bypasses the socket middleware so
 * handler logic can be tested in isolation), this fixture boots a REAL
 * socket.io server and installs the REAL production middleware composition in
 * the same order as server.js:
 *
 *   sanitization -> validation -> rate limit -> auth
 *
 * followed by the REAL registerSocketHandlers registration and the real
 * movement coalescer. Only true external boundaries are stubbed:
 *   - Firebase token verification (createSocketAuthMiddleware is real; only
 *     firebaseService.verifyIdToken is replaced by an in-memory token map).
 *   - Persistence/cloud writes (firebaseBatchWriter, movement persistence and
 *     realtime sync are no-ops).
 *
 * Tests connect with `auth: { token: 'test-token:<uid>' }` for a verified
 * identity, or no token for a guest.
 */

const http = require('http');
const socketIo = require('socket.io');
const { io: ioClient } = require('socket.io-client');

const { createSanitizationMiddleware } = require('../../services/sanitizationService');
const { createValidationMiddleware } = require('../../services/validationService');
const rateLimitService = require('../../services/rateLimitService');
const { createSocketAuthMiddleware } = require('../../services/socketAuthMiddleware');
const { MovementDebouncer } = require('../../services/syncService');
const { registerSocketHandlers } = require('../../handlers/socketHandlers');
const roomHandlers = require('../../handlers/roomHandlers');
const firebaseService = require('../../services/firebaseService');
const roomAuthority = require('../../services/roomAuthorityService');

// Same skip list as server.js so the test exercises the production sanitizer.
const FIELDS_TO_SKIP = [
  'password', 'passwordHash', 'token', 'id', 'roomId', 'socketId', 'playerId',
  'characterId', 'tokenId', 'description', 'notes', 'lore', 'backstory',
  'gmNotes', 'content', 'text', 'gridItems', 'terrainData', 'drawnLines', 'wallData'
];

const silentLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
};

function createProductionStackServer(options = {}) {
  const httpServer = http.createServer((req, res) => res.end('ok'));
  const io = socketIo(httpServer, { cors: { origin: '*' } });

  const rooms = new Map();
  const players = new Map();
  const parties = new Map();
  const userToParty = new Map();
  const partyInvitations = new Map();
  const onlineSocialUsers = new Map();
  const pendingPartyCreations = new Map();

  // The rate-limit middleware checks `global.players` for GM status, exactly
  // like the production server.
  global.players = players;

  // --- External boundary stubs -------------------------------------------------
  const authTokens = new Map();
  const firebaseServiceStub = {
    verifyIdToken: async(token) => {
      if (typeof token === 'string' && authTokens.has(token)) {
        const entry = authTokens.get(token);
        const uid = entry.uid;
        return {
          uid,
          email: `${uid}@example.com`,
          firebase: { sign_in_provider: entry.provider || 'password' }
        };
      }
      return null;
    }
  };
  const firebaseBatchWriter = options.firebaseBatchWriter || { queueWrite: () => {}, flush: async() => {} };
  const realtimeSync = { forceSyncAll: async() => {}, sync: async() => {}, processCategorySync: async() => {} };

  // C5 authority boundary: the REAL service with an in-memory backend. Existing
  // suites get automatic grants; C5 integration tests can fence or inspect the
  // lifecycle deterministically.
  const authorityDocs = new Map();
  let authorityGenerationCounter = 0;
  const authorityBackend = {
    acquire: async({ roomId }) => {
      authorityGenerationCounter += 1;
      authorityDocs.set(roomId, { generation: authorityGenerationCounter, state: 'held' });
      return { ok: true, generation: authorityGenerationCounter };
    },
    renew: async({ roomId, generation }) => {
      const doc = authorityDocs.get(roomId);
      if (!doc || doc.state !== 'held' || doc.generation !== generation) {
        return { ok: false, code: 'room_authority_lost' };
      }
      return { ok: true };
    },
    release: async({ roomId, generation }) => {
      const doc = authorityDocs.get(roomId);
      if (!doc || doc.state !== 'held' || doc.generation !== generation) {
        return { ok: false, code: 'room_authority_lost' };
      }
      doc.state = 'released';
      return { ok: true };
    },
    validate: async({ roomId, generation }) => {
      const doc = authorityDocs.get(roomId);
      if (!doc || doc.state !== 'held' || doc.generation !== generation) {
        return { ok: false, code: 'room_authority_lost' };
      }
      return { ok: true };
    }
  };
  const authorityService = roomAuthority.createRoomAuthorityService({
    backend: authorityBackend,
    instanceId: `fixture-${Math.random().toString(36).slice(2, 10)}`,
    logger: silentLogger
  });

  // Project 4 external persistence boundary stubs. Real handlers run; only the
  // cloud durability of durable membership / character ownership is stubbed so
  // the locked P1-P3 suites and P4 tests can exercise admission without a real
  // Firebase project. Restored on stop().
  const characterOwners = new Map(Object.entries(options.characterOwners || {}));
  const originalRoomAccessBoundary = {
    addRoomMember: firebaseService.addRoomMember,
    removeRoomMember: firebaseService.removeRoomMember,
    getCharacterOwner: firebaseService.getCharacterOwner,
    deleteRoom: firebaseService.deleteRoom,
    listEntitledRoomMetadata: firebaseService.listEntitledRoomMetadata,
    getRoomRootMetadata: firebaseService.getRoomRootMetadata,
    createRoomDraft: firebaseService.createRoomDraft,
    recordMembershipCompensation: firebaseService.recordMembershipCompensation,
    listMembershipCompensations: firebaseService.listMembershipCompensations,
    clearMembershipCompensation: firebaseService.clearMembershipCompensation
  };
  if (options.stubRoomAccessPersistence !== false) {
    firebaseService.addRoomMember = async() => ({ ok: true });
    firebaseService.removeRoomMember = async() => ({ ok: true });
    firebaseService.getCharacterOwner = async(characterId) => {
      const owner = characterOwners.get(characterId);
      return owner ? { ok: true, userId: owner } : { ok: false, reason: 'character_not_found' };
    };
    firebaseService.deleteRoom = async() => true;
    // Cloud metadata listing/root reads are external boundaries in tests.
    firebaseService.listEntitledRoomMetadata = async() => [];
    firebaseService.getRoomRootMetadata = async() => null;
    firebaseService.createRoomDraft = async({ roomId, userId: _userId }) => ({ ok: true, roomId: roomId || 'draft-room', existing: false });
    // C3 durable compensation boundary: default to an empty durable store so
    // tests never reach a real Firestore. C3 regressions override these.
    firebaseService.recordMembershipCompensation = async() => ({ ok: true });
    firebaseService.listMembershipCompensations = async() => [];
    firebaseService.clearMembershipCompensation = async() => ({ ok: true });
  }

  // --- Real middleware composition (same order as server.js) -------------------
  io.use(createSanitizationMiddleware({
    logSanitization: false,
    fieldsToSkip: FIELDS_TO_SKIP
  }));
  io.use(createValidationMiddleware({
    logErrors: false,
    strictMode: false,
    maxErrorsPerMinute: 1000
  }));
  io.use(rateLimitService.createMiddleware({
    logViolations: false,
    disconnectOnViolation: false,
    violationThreshold: 1000
  }));
  io.use(createSocketAuthMiddleware({ firebaseService: firebaseServiceStub, logger: silentLogger }));

  // --- Real movement coalescer with a no-op persistence boundary --------------
  const movementDebouncer = new MovementDebouncer(options.debounceMs || 80, firebaseBatchWriter);

  const helpers = {
    createRoom: async(...args) => roomHandlers.createRoom(...args, rooms, players),
    buildRoomCandidate: roomHandlers.buildRoomCandidate,
    installRoomCandidate: (args) => roomHandlers.installRoomCandidate({ ...args, rooms, players }),
    hashPassword: roomHandlers.hashPassword,
    verifyPassword: roomHandlers.verifyPassword,
    getPublicRooms: () => roomHandlers.getPublicRooms(rooms),
    validateRoomMembership: (socket, roomId, requireGM = false) => (
      roomHandlers.validateRoomMembership(socket, roomId, requireGM, players, rooms, authorityService)
    ),
    mergeRoomGameStateForResume: roomHandlers.mergeRoomGameStateForResume
  };
  if (options.omitReconstructionHooks) {
    // C2 decisive harness: simulate a degraded deployment without the
    // two-phase construction/install hooks.
    delete helpers.buildRoomCandidate;
    delete helpers.installRoomCandidate;
  }

  const services = {
    firebaseBatchWriter,
    movementDebouncer,
    eventBatcher: { addEvent: () => {}, queue: () => {}, flush: async() => {} },
    realtimeSync,
    authorityService
  };

  registerSocketHandlers(
    io, rooms, players, parties, userToParty,
    partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services
  );

  let port = null;
  let uidCounter = 0;
  const savedLimits = new Map();

  return {
    io,
    httpServer,
    rooms,
    players,
    movementDebouncer,
    firebaseBatchWriter,
    rateLimitService,
    authorityService,

    /** Unique verified user id so rate-limit counters never leak across tests. */
    nextUserId(prefix = 'user') {
      uidCounter += 1;
      return `${prefix}-${Date.now().toString(36)}-${uidCounter}-${Math.random().toString(36).slice(2, 7)}`;
    },

    /** Register a token -> uid mapping for the stubbed Firebase boundary. */
    registerAuthToken(token, uid, provider = 'password') {
      authTokens.set(token, { uid, provider });
    },

    /** In-memory room invitation registry (for recipient/expiry tests). */
    partyInvitations,

    /** Register a character -> verified owner mapping for the P4 stub. */
    setCharacterOwner(characterId, userId) {
      characterOwners.set(characterId, userId);
    },

    /**
     * Seed a room with the real roomHandlers.createRoom shape (real maps +
     * default map) and put the GM socket in the room channel. No persistence.
     */
    async seedRoom(gmSocketId, opts = {}) {
      const room = await roomHandlers.createRoom(
        opts.name || 'Test Room',
        opts.gmName || 'GM',
        gmSocketId,
        opts.password || '',
        '#4a90e2',
        false,
        opts.persistentRoomId,
        opts.initialGameState || null,
        opts.gmUserId || null,
        opts.members || [],
        rooms,
        players
      );
      const serverSocket = io.sockets.sockets.get(gmSocketId);
      if (serverSocket) {serverSocket.join(room.id);}
      if (opts.disconnectedPlayers) {room.disconnectedPlayers = opts.disconnectedPlayers;}
      // C5: seeded rooms hold current fixture authority.
      await authorityService.acquire(room.id);
      authorityService.attachRoom(room);
      // Fixture GM session so H14 consent binding has a current session id.
      room.isActive = true;
      room.gmSessionId = room.gmSessionId || 'fixture-gm-session';
      return room;
    },

    /** Temporarily override a rate limit (restored by stop()). */
    setEventLimits(event, limits) {
      if (!savedLimits.has(event)) {
        savedLimits.set(event, rateLimitService.rateLimits[event]);
      }
      rateLimitService.rateLimits[event] = limits;
    },

    async start() {
      await new Promise((resolve) => {
        httpServer.listen(0, () => {
          port = httpServer.address().port;
          resolve(port);
        });
      });
      return port;
    },

    url() {
      if (port === null) {throw new Error('Server not started');}
      return `http://localhost:${port}`;
    },

    connect(opts = {}) {
      const auth = {};
      if (opts.token) {auth.token = opts.token;}
      if (opts.guest) {auth.guest = true;}
      return ioClient(this.url(), { transports: ['websocket'], forceNew: true, auth });
    },

    async stop() {
      for (const [event, limits] of savedLimits.entries()) {
        if (limits === undefined) {
          delete rateLimitService.rateLimits[event];
        } else {
          rateLimitService.rateLimits[event] = limits;
        }
      }
      savedLimits.clear();
      movementDebouncer.stop();
      authorityService.stopAll();
      if (typeof firebaseBatchWriter.stop === 'function') {firebaseBatchWriter.stop();}
      firebaseService.addRoomMember = originalRoomAccessBoundary.addRoomMember;
      firebaseService.removeRoomMember = originalRoomAccessBoundary.removeRoomMember;
      firebaseService.getCharacterOwner = originalRoomAccessBoundary.getCharacterOwner;
      firebaseService.deleteRoom = originalRoomAccessBoundary.deleteRoom;
      firebaseService.listEntitledRoomMetadata = originalRoomAccessBoundary.listEntitledRoomMetadata;
      firebaseService.getRoomRootMetadata = originalRoomAccessBoundary.getRoomRootMetadata;
      firebaseService.createRoomDraft = originalRoomAccessBoundary.createRoomDraft;
      firebaseService.recordMembershipCompensation = originalRoomAccessBoundary.recordMembershipCompensation;
      firebaseService.listMembershipCompensations = originalRoomAccessBoundary.listMembershipCompensations;
      firebaseService.clearMembershipCompensation = originalRoomAccessBoundary.clearMembershipCompensation;
      for (const s of io.sockets.sockets.values()) {s.disconnect(true);}
      await new Promise((resolve) => {io.close(resolve);});
      await new Promise((resolve) => {httpServer.close(() => resolve());});
    }
  };
}

module.exports = { createProductionStackServer };
