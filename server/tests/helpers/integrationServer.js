/**
 * Integration test server factory.
 *
 * Spins up a REAL socket.io server bound to an ephemeral port and registers the
 * REAL production socket handlers (registerSocketHandlers + every sub-handler:
 * room lifecycle, tokens, combat, chat, sync, etc.). Only the external I/O
 * boundaries are stubbed:
 *   - Firebase auth is replaced by a test-only io.use middleware that marks
 *     sockets authenticated (so requireAuth passes) unless a client opts into
 *     guest mode via handshake.auth.guest = true.
 *   - helpers.createRoom / validateRoomMembership operate on the real in-memory
 *     Maps so room/token flows are exercised faithfully.
 *   - services (firebase batcher, movement debouncer, event batcher) are no-ops.
 *
 * This lets multiplayer behavior (event routing, auth gating, room broadcasts,
 * token convergence) be tested against production handler code over a real
 * socket.io transport — without Firebase, network, or tautological mocks.
 */

const http = require('http');
const socketIo = require('socket.io');
const { io: ioClient } = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');
const { registerSocketHandlers } = require('../../handlers/socketHandlers');

function createIntegrationServer() {
  const httpServer = http.createServer((req, res) => res.end('ok'));
  const io = socketIo(httpServer, { cors: { origin: '*' } });

  const rooms = new Map();
  const players = new Map();
  const parties = new Map();
  const userToParty = new Map();
  const partyInvitations = new Map();
  const onlineSocialUsers = new Map();
  const pendingPartyCreations = new Map();

  // Test-only auth middleware. Replaces Firebase token verification so handler
  // logic (and requireAuth gating) can be exercised without credentials.
  io.use((socket, next) => {
    const wantGuest = socket.handshake && socket.handshake.auth && socket.handshake.auth.guest === true;
    socket.data.authenticated = !wantGuest;
    socket.data.userId = null;
    socket.data.isGuest = !!wantGuest;
    next();
  });

  const helpers = {
    createRoom: async (roomName, gmName, socketId, password, color, isPermanent) => {
      const roomId = `room-${uuidv4()}`;
      const gmId = socketId;
      const gmPlayer = {
        id: gmId,
        name: gmName || 'GM',
        socketId,
        roomId,
        isGM: true,
        color: color || '#4a90e2',
        character: null,
        currentMapId: 'default'
      };
      const room = {
        id: roomId,
        name: roomName,
        gm: gmPlayer,
        gmId: null,
        players: new Map(),
        settings: {},
        gameState: {
          defaultMapId: 'default',
          maps: {
            default: {
              id: 'default',
              name: 'Default Map',
              tokens: {},
              characterTokens: {},
              gridItems: {},
              terrainData: {},
              wallData: {},
              drawingPaths: [],
              fogOfWarData: [],
              dndElements: [],
              lightSources: {},
              environmentalObjects: []
            }
          },
          tokens: {}
        },
        persistentRoomId: undefined,
        isPermanent: !!isPermanent,
        createdAt: Date.now(),
        isActive: true
      };
      rooms.set(roomId, room);
      players.set(socketId, gmPlayer);
      return room;
    },
    hashPassword: async (pw) => pw || '',
    verifyPassword: async () => true,
    getPublicRooms: () => [],
    validateRoomMembership: (socket, roomId, requireGM = false) => {
      const player = players.get(socket.id);
      if (!player || player.roomId !== roomId) {
        return { valid: false, error: 'Not a member of room' };
      }
      const room = rooms.get(roomId);
      if (!room) return { valid: false, error: 'Room not found' };
      if (requireGM && !player.isGM) return { valid: false, error: 'GM permission required' };
      return { valid: true, player, room };
    },
    mergeRoomGameStateForResume: (existing) => existing
  };

  const noopAsync = async () => {};
  const services = {
    firebaseBatchWriter: { queueWrite: () => {}, flush: noopAsync },
    movementDebouncer: { queueMove: () => {}, flush: () => {}, flushCallback: null },
    eventBatcher: { addEvent: () => {}, queue: () => {}, flush: noopAsync },
    realtimeSync: { sync: noopAsync, processCategorySync: noopAsync }
  };

  registerSocketHandlers(
    io, rooms, players, parties, userToParty,
    partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services
  );

  let port = null;

  return {
    io,
    httpServer,
    rooms,
    players,
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
      if (port === null) throw new Error('Server not started');
      return `http://localhost:${port}`;
    },
    connect(opts = {}) {
      return ioClient(this.url(), {
        transports: ['websocket'],
        forceNew: true,
        auth: { guest: !!opts.guest }
      });
    },
    async stop() {
      for (const s of io.sockets.sockets.values()) s.disconnect(true);
      await new Promise((resolve) => { io.close(resolve); });
      await new Promise((resolve) => { httpServer.close(() => resolve()); });
    }
  };
}

module.exports = { createIntegrationServer };
