/**
 * Project 4 bounded correction regressions.
 *
 * Focused counterexamples from the senior adversarial review: durable identity
 * gating, orphan-state draft refusal, admission rollback/reauthorization,
 * multi-device revocation, password/access policy, invitation isolation and
 * lifetime, token authority bypasses, outbound privacy projection, inventory
 * consent termination, and deletion truthfulness/writer suppression.
 */

const { expect } = require('chai');
const sinon = require('sinon');

const roomAccess = require('../services/roomAccessService');
const firebaseService = require('../services/firebaseService');
const roomHandlers = require('../handlers/roomHandlers');
const roomCheckpoint = require('../services/roomCheckpoint');
const { FirebaseBatchWriter } = require('../services/syncService');
const { registerSessionHandlers } = require('../handlers/sessionHandlers');
const { registerPartyHandlers } = require('../handlers/partyHandlers');
const { registerCharacterHandlers } = require('../handlers/characterHandlers');
const { registerEnvironmentHandlers } = require('../handlers/environmentHandlers');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const testAuthority = { currentToken: (roomId) => ({ roomId, authorityInstanceId: 'test-instance', authorityGeneration: 1, localSafeDeadline: Number.MAX_SAFE_INTEGER }) };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});
const once = (socket, event, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});
const emitAck = (socket, event, payload, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout for "${event}"`)), timeoutMs);
  socket.emit(event, payload, (response) => { clearTimeout(timer); resolve(response); });
});

function fakeSocket(uid, id = `socket-${Math.random().toString(36).slice(2, 8)}`, provider = 'password') {
  return {
    id,
    data: { userId: uid, authenticated: true, signInProvider: provider },
    rooms: new Set(),
    disconnected: false,
    join(roomId) { this.rooms.add(roomId); },
    leave(roomId) { this.rooms.delete(roomId); },
    emit: sinon.stub(),
    on: sinon.stub()
  };
}

function fakeRoom(overrides = {}) {
  return {
    id: 'room-1',
    gmId: 'gm',
    members: ['gm'],
    isPermanent: true,
    players: new Map(),
    settings: { maxPlayers: 4, isPrivate: true },
    gameState: { defaultMapId: 'a', playerMapAssignments: {}, maps: { a: { tokens: {}, characterTokens: {} } }, tokens: {}, characterTokens: {} },
    ...overrides
  };
}

describe('Project 4 bounded corrections', function() {
  this.timeout(20000);

  describe('durable identity gate', () => {
    it('denies missing provider, unknown provider, anonymous and synthetic guests; accepts password', () => {
      const password = fakeSocket('u1');
      expect(roomAccess.checkDurableRoomIdentity(password).allowed).to.equal(true);

      const missing = fakeSocket('u2');
      missing.data.signInProvider = null;
      expect(roomAccess.checkDurableRoomIdentity(missing).code).to.equal('account_required');

      const unknown = fakeSocket('u3');
      unknown.data.signInProvider = 'unknown';
      expect(roomAccess.checkDurableRoomIdentity(unknown).code).to.equal('account_required');

      const anonymous = fakeSocket('u4', 'socket-anon', 'anonymous');
      expect(roomAccess.checkDurableRoomIdentity(anonymous).code).to.equal('account_required');

      const guest = fakeSocket('guest-123');
      guest.data.isGuest = true;
      expect(roomAccess.checkDurableRoomIdentity(guest).code).to.equal('account_required');
    });
  });

  describe('safe draft eligibility (orphan state)', () => {
    it('refuses any pre-existing root or orphaned fragments', () => {
      const orphan = firebaseService.evaluateDraftEligibility({
        rootExists: false, rootData: null, hasFragments: true, userId: 'attacker'
      });
      expect(orphan.ok).to.equal(false);
      expect(orphan.reason).to.equal('owner_recovery_required');

      const foreignRoot = firebaseService.evaluateDraftEligibility({
        rootExists: true, rootData: { gmId: 'previous-owner', checkpoint: null, isActive: false }, hasFragments: false, userId: 'attacker'
      });
      expect(foreignRoot.ok).to.equal(false);

      const ownDraftWithFragments = firebaseService.evaluateDraftEligibility({
        rootExists: true, rootData: { gmId: 'owner', checkpoint: null, isActive: false }, hasFragments: true, userId: 'owner'
      });
      expect(ownDraftWithFragments.ok).to.equal(false);

      const ownEmptyDraft = firebaseService.evaluateDraftEligibility({
        rootExists: true, rootData: { gmId: 'owner', checkpoint: null, isActive: false }, hasFragments: false, userId: 'owner'
      });
      expect(ownEmptyDraft.ok).to.equal(true);
      expect(ownEmptyDraft.existing).to.equal(true);

      const empty = firebaseService.evaluateDraftEligibility({
        rootExists: false, rootData: null, hasFragments: false, userId: 'owner'
      });
      expect(empty.ok).to.equal(true);
      expect(empty.existing).to.equal(false);
    });

    it('legacy split classification is unchanged and still requires P4 custody rules', () => {
      const classification = roomCheckpoint.classifyRoomDocuments({
        roomId: 'orphan-room',
        root: { exists: true, data: { id: 'orphan-room', gmId: 'claimant', members: ['claimant'], checkpoint: null, isActive: false } },
        gameStateDocs: [
          { id: 'current', data: { defaultMapId: 'a', playerMapAssignments: {}, characters: {}, combat: { isActive: false, currentTurnIndex: 0, round: 0, turnOrder: [] } } },
          { id: 'a', data: { id: 'a', name: 'Old', tokens: {}, characterTokens: {}, gridItems: {}, terrainData: {}, wallData: {}, drawingPaths: [], drawingLayers: [], fogOfWarData: {}, fogOfWarPaths: [], fogErasePaths: [], dndElements: [], lightSources: {}, environmentalObjects: [], exploredAreas: {}, gridSettings: {}, elevationData: {}, rampData: {} } }
        ]
      });
      // P3 selection semantics intentionally untouched.
      expect(classification.kind).to.equal('LEGACY_SPLIT_ONLY_COMPLETE');
    });
  });

  describe('admission rollback and reauthorization', () => {
    it('rolls back a newly created grant when a ban lands during the grant await', async() => {
      const room = fakeRoom({ settings: { maxPlayers: 4, isPrivate: true } });
      const rooms = new Map([[room.id, room]]);
      const players = new Map();
      const cloud = {
        addRoomMember: async() => { room.bannedUsers = ['u1']; return { ok: true }; },
        removeRoomMember: sinon.stub().resolves({ ok: true })
      };
      const result = await roomAccess.admitVerifiedMember({
        socket: fakeSocket('u1'), rooms, players, firebaseService: cloud, authorityService: testAuthority,
        uuidv4: () => 'p1', room, userId: 'u1', playerName: 'U1'
      });
      expect(result.ok).to.equal(false);
      expect(players.size).to.equal(0);
      expect(room.players.size).to.equal(0);
      expect(cloud.removeRoomMember.calledOnce).to.equal(true);
    });

    it('rolls back when a revocation generation lands during the grant await', async() => {
      const room = fakeRoom();
      const rooms = new Map([[room.id, room]]);
      const players = new Map();
      const cloud = {
        addRoomMember: async() => { roomAccess.bumpAccessGeneration(room); return { ok: true }; },
        removeRoomMember: sinon.stub().resolves({ ok: true })
      };
      const result = await roomAccess.admitVerifiedMember({
        socket: fakeSocket('u1'), rooms, players, firebaseService: cloud, authorityService: testAuthority,
        uuidv4: () => 'p1', room, userId: 'u1', playerName: 'U1'
      });
      expect(result.ok).to.equal(false);
      expect(players.size).to.equal(0);
      expect(cloud.removeRoomMember.calledOnce).to.equal(true);
    });

    it('does not roll back a pre-existing entitlement on denial', async() => {
      const room = fakeRoom({ members: ['gm', 'u1'], bannedUsers: ['u1'] });
      const rooms = new Map([[room.id, room]]);
      const cloud = {
        addRoomMember: sinon.stub().resolves({ ok: true }),
        removeRoomMember: sinon.stub().resolves({ ok: true })
      };
      const result = await roomAccess.admitVerifiedMember({
        socket: fakeSocket('u1'), rooms, players: new Map(), firebaseService: cloud, authorityService: testAuthority,
        uuidv4: () => 'p1', room, userId: 'u1', playerName: 'U1'
      });
      expect(result.ok).to.equal(false);
      expect(cloud.removeRoomMember.called).to.equal(false);
      expect(room.members).to.include('u1');
    });

    it('tracks every same-UID device separately and detaches all on revocation', async() => {
      const room = fakeRoom();
      const rooms = new Map([[room.id, room]]);
      const players = new Map();
      const cloud = { addRoomMember: async() => ({ ok: true }) };
      const s1 = fakeSocket('u1', 'dev-1');
      const s2 = fakeSocket('u1', 'dev-2');
      expect((await roomAccess.admitVerifiedMember({ socket: s1, rooms, players, firebaseService: cloud, authorityService: testAuthority, uuidv4: () => 'p1', room, userId: 'u1', playerName: 'A' })).ok).to.equal(true);
      expect((await roomAccess.admitVerifiedMember({ socket: s2, rooms, players, firebaseService: cloud, authorityService: testAuthority, uuidv4: () => 'p2', room, userId: 'u1', playerName: 'B' })).ok).to.equal(true);
      expect(room.players.size).to.equal(2);
      expect(roomAccess.countActiveMemberSlots(room)).to.equal(1);

      const detached = roomAccess.detachMemberDevices({
        room, players, userId: 'u1',
        io: { sockets: { sockets: new Map([[s1.id, s1], [s2.id, s2]]) } }
      });
      expect(detached.length).to.equal(2);
      expect(players.size).to.equal(0);
      expect(room.players.size).to.equal(0);
      expect(s1.rooms.has(room.id)).to.equal(false);
      expect(s2.rooms.has(room.id)).to.equal(false);
      expect(roomHandlers.validateRoomMembership(s1, room.id, false, players, rooms).valid).to.equal(false);
    });
  });

  describe('password / access policy', () => {
    it('preserves a stored open policy and never applies the request password', async() => {
      const server = createProductionStackServer({ debounceMs: 20 });
      await server.start();
      const uid = server.nextUserId();
      const token = `test-token:${uid}`;
      server.registerAuthToken(token, uid);
      const client = server.connect({ token });
      await connected(client);
      const original = firebaseService.readRoomCheckpoint;
      firebaseService.readRoomCheckpoint = async() => ({
        kind: 'CANONICAL_COMPLETE_CHECKPOINT',
        roomId: 'persist-open-policy',
        readOnly: true,
        diagnostics: [],
        revision: 1,
        checkpoint: { schemaVersion: 1, revision: 1, mapIds: [], committed: true, contentHash: 'a'.repeat(64), provenance: {} },
        selectedCandidateId: 'split',
        selectedSnapshot: { global: { defaultMapId: 'default' }, maps: {}, mapIds: [] },
        migrationRequired: false,
        roomMetadata: {
          name: 'Open Room', description: null, settings: { maxPlayers: 4 },
          gmId: uid, members: [uid], passwordHash: null, bannedUsers: [],
          isPermanent: true, persistentRoomId: 'persist-open-policy'
        },
        candidates: { inline: null, split: null },
        selection: null
      });
      try {
        const joined = once(client, 'room_joined');
        client.emit('create_room', { gmName: 'GM', persistentRoomId: 'persist-open-policy', roomName: 'Open Room', password: 'attacker-password' });
        await joined;
        const room = server.rooms.get('persist-open-policy');
        expect(room.passwordHash).to.equal(null);
      } finally {
        firebaseService.readRoomCheckpoint = original;
        client.disconnect();
        await server.stop();
      }
    });
  });

  describe('invitation isolation and lifetime', () => {
    function sessionFixture({ status = 'pending', expiresAt = Date.now() + 60000, toUserId = 'intended' } = {}) {
      const room = fakeRoom({ gmId: 'gm', members: ['gm'] });
      const invitation = {
        version: 1, kind: 'room', id: 'inv-1', roomId: room.id,
        fromUserId: 'gm', toUserId, role: 'member', status, expiresAt
      };
      const socket = fakeSocket(toUserId, 'invited-socket');
      const handlers = {};
      socket.on = (event, handler) => { handlers[event] = handler; };
      socket.emit = sinon.stub();
      socket.to = () => ({ emit: sinon.stub() });
      registerSessionHandlers({
        socket,
        io: { emit: sinon.stub() },
        rooms: new Map([[room.id, room]]),
        players: new Map(),
        partyInvitations: new Map([['inv-1', invitation]]),
        logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
        uuidv4: () => 'new-player',
        sanitizePlayerName: (name) => name,
        firebaseService: { addRoomMember: async() => ({ ok: true }) },
        getPublicRooms: () => []
      });
      return { room, invitation, socket, handlers };
    }

    const joinErrorCode = (socket) => {
      const call = socket.emit.withArgs('join_error').firstCall;
      return call && call.args[1] ? call.args[1].code : undefined;
    };

    it('rejects a revoked invitation at acceptance', async() => {
      const f = sessionFixture({ status: 'revoked' });
      await f.handlers.respond_to_room_invitation({ invitationId: 'inv-1', roomId: f.room.id, accepted: true });
      expect(joinErrorCode(f.socket)).to.equal('invitation_revoked');
    });

    it('rejects at the exact expiry boundary', async() => {
      const f = sessionFixture({ expiresAt: Date.now() });
      await f.handlers.respond_to_room_invitation({ invitationId: 'inv-1', roomId: f.room.id, accepted: true });
      expect(joinErrorCode(f.socket)).to.equal('invitation_expired');
    });

    it('wrong recipient cannot consume', async() => {
      const f = sessionFixture({ toUserId: 'intended' });
      f.socket.data.userId = 'wrong';
      await f.handlers.respond_to_room_invitation({ invitationId: 'inv-1', roomId: f.room.id, accepted: true });
      expect(joinErrorCode(f.socket)).to.equal('invitation_wrong_recipient');
      expect(f.invitation.status).to.equal('pending');
    });

    it('social decline cannot consume a room invitation', () => {
      const invitations = new Map([['room-invite', {
        version: 1, kind: 'room', id: 'room-invite', roomId: 'r',
        fromUserId: 'gm', toUserId: 'intended', role: 'member', status: 'pending', expiresAt: Date.now() + 10000
      }]]);
      const socket = fakeSocket('wrong');
      socket.on = (event, handler) => { if (event === 'decline_party_invite') {socket._decline = handler;} };
      registerPartyHandlers({
        socket,
        players: new Map(),
        parties: new Map(),
        userToParty: new Map(),
        partyInvitations: invitations,
        onlineSocialUsers: new Map(),
        logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
        uuidv4: () => 'x',
        sanitizeChatMessage: (m) => m,
        handlePartyLeave: sinon.stub(),
        getSocketsByUserId: () => [],
        buildPartyMemberData: () => ({})
      });
      socket._decline({ invitationId: 'room-invite' });
      expect(invitations.has('room-invite')).to.equal(true);
      expect(invitations.get('room-invite').status).to.equal('pending');
    });
  });

  describe('token authority', () => {
    function tokenFixture(room, player) {
      const handlers = {};
      const socket = fakeSocket(player.userId, 'token-socket');
      socket.on = (event, handler) => { handlers[event] = handler; };
      socket.to = () => ({ emit: sinon.stub() });
      const players = new Map([[socket.id, player]]);
      const rooms = new Map([[room.id, room]]);
      registerCharacterHandlers({
        io: { to: () => ({ emit: sinon.stub() }) },
        socket,
        rooms,
        logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
        validateRoomMembership: (caller, roomId, requireGM = false) =>
          roomHandlers.validateRoomMembership(caller, roomId, requireGM, players, rooms),
        firebaseBatchWriter: { queueWrite: sinon.stub() }
      });
      return { handlers, socket };
    }

    it('foreign character_moved target is denied', async() => {
      const room = fakeRoom({ players: new Map() });
      const player = { id: 'p1', userId: 'u1', roomId: room.id, isGM: false, currentMapId: 'a' };
      room.players.set('p1', player);
      room.members.push('u1');
      room.gameState.maps.a.characterTokens.foreign = { id: 'foreign', ownerUserId: 'other' };
      const { handlers } = tokenFixture(room, player);
      // The denial path returns before emitting or queuing state.
      await handlers.character_moved({ roomId: room.id, mapId: 'a', tokenId: 'foreign', position: { x: 1, y: 1 } });
      expect(room.gameState.maps.a.characterTokens.foreign.position).to.equal(undefined);
    });

    it('environment creature_updated cannot patch ownership', async() => {
      const room = fakeRoom({ players: new Map() });
      const player = { id: 'p1', userId: 'u1', roomId: room.id, isGM: false, currentMapId: 'a' };
      room.players.set('p1', player);
      room.members.push('u1');
      room.gameState.maps.a.creatures = { c1: { id: 'c1', ownerUserId: 'gm' } };
      const handlers = {};
      const socket = fakeSocket('u1', 'env-socket');
      socket.on = (event, handler) => { handlers[event] = handler; };
      const players = new Map([[socket.id, player]]);
      const rooms = new Map([[room.id, room]]);
      registerEnvironmentHandlers({
        io: { to: () => ({ emit: sinon.stub() }) },
        socket,
        rooms,
        players,
        logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
        uuidv4: () => 'x',
        validateRoomMembership: (caller, roomId, requireGM = false) =>
          roomHandlers.validateRoomMembership(caller, roomId, requireGM, players, rooms),
        validateMapExists: (_room, mapId) => room.gameState.maps[mapId],
        firebaseBatchWriter: { queueWrite: sinon.stub() },
        stripUndefined: (value) => value
      });
      await handlers.creature_updated({ roomId: room.id, mapId: 'a', creatureId: 'c1', updates: { ownerUserId: 'u1' } });
      expect(room.gameState.maps.a.creatures.c1.ownerUserId).to.equal('gm');
    });
  });

  describe('outbound privacy projection', () => {
    it('strips nested inventory/currency/private art markers from characters and tokens', () => {
      const secret = 'SECRET-MARKER-123';
      const raw = {
        id: 'c1', name: 'Hero', health: { current: 1, max: 2 },
        inventory: { items: [{ id: secret }] },
        currency: { gold: secret },
        nested: { inventory: { items: [secret] } },
        tokenSettings: { customIcon: `https://firebasestorage.googleapis.com/v0/b/x/o/users%2Fu%2Fportraits%2F${secret}.webp?alt=media&token=${secret}` },
        state: { inventory: { items: [secret] } }
      };
      const projected = roomAccess.projectCharacterForClient(raw);
      expect(JSON.stringify(projected).includes(secret)).to.equal(false);
      // Raw data is untouched.
      expect(JSON.stringify(raw).includes(secret)).to.equal(true);

      const token = roomAccess.projectTokenForClient({
        id: 't1', ownerUserId: 'u1',
        state: { inventory: { items: [secret] }, hp: 5 },
        character: { inventory: { items: [secret] }, name: 'Hero' }
      });
      expect(JSON.stringify(token).includes(secret)).to.equal(false);
      expect(token.state.hp).to.equal(5);
    });

    it('projectGameStateForClient strips nested private markers across maps and tokens', () => {
      const secret = 'SECRET-MARKER-456';
      const gs = {
        characters: { c1: { id: 'c1', inventory: { items: [secret] } } },
        tokens: { t1: { id: 't1', state: { currency: { gold: secret } } } },
        maps: { a: { id: 'a', characterTokens: { ct: { id: 'ct', character: { inventory: { items: [secret] } } } } } }
      };
      const projected = roomAccess.projectGameStateForClient(gs);
      expect(JSON.stringify(projected).includes(secret)).to.equal(false);
    });
  });

  describe('deletion and writer coordination', () => {
    it('writer suppression prevents retained/retried resurrection after deletion', async() => {
      const persist = sinon.stub().resolves({ outcome: 'confirmed' });
      const writer = new FirebaseBatchWriter(60000, 50, { persist });
      try {
        writer.queueWrite('room-x', { tokens: {} });
        writer.forgetRoom('room-x');
        expect(writer.queueWrite('room-x', { tokens: {} })).to.equal(null);
        await writer.drain();
        expect(persist.called).to.equal(false);
      } finally {
        writer.stop();
      }
    });

    it('reports failure and keeps runtime when durable deletion is not confirmed', async() => {
      const server = createProductionStackServer({ debounceMs: 20 });
      await server.start();
      const gmUid = server.nextUserId();
      const token = `test-token:${gmUid}`;
      server.registerAuthToken(token, gmUid);
      const client = server.connect({ token });
      await connected(client);
      const room = await server.seedRoom(client.id, { gmUserId: gmUid, persistentRoomId: 'delete-false-room' });
      const originalDelete = firebaseService.deleteRoom;
      firebaseService.deleteRoom = async() => false;
      try {
        const response = await emitAck(client, 'delete_room', { roomId: room.id });
        expect(response.success).to.equal(false);
        expect(server.rooms.has(room.id)).to.equal(true);
        expect(room.deleting).to.not.equal(true);
      } finally {
        firebaseService.deleteRoom = originalDelete;
        client.disconnect();
        await server.stop();
      }
    });

    it('allows a verified owner to delete an inactive cloud room', async() => {
      const server = createProductionStackServer({ debounceMs: 20 });
      await server.start();
      const ownerUid = server.nextUserId();
      const token = `test-token:${ownerUid}`;
      server.registerAuthToken(token, ownerUid);
      const client = server.connect({ token });
      await connected(client);
      const originalRoot = firebaseService.getRoomRootMetadata;
      const originalDelete = firebaseService.deleteRoom;
      firebaseService.getRoomRootMetadata = async() => ({
        id: 'cloud-only-room', name: 'Cloud', gmId: ownerUid, members: [ownerUid],
        passwordHash: null, bannedUsers: [], isPermanent: true, persistentRoomId: 'cloud-only-room'
      });
      firebaseService.deleteRoom = async() => true;
      try {
        const response = await emitAck(client, 'delete_room', { roomId: 'cloud-only-room' });
        expect(response.success).to.equal(true);
      } finally {
        firebaseService.getRoomRootMetadata = originalRoot;
        firebaseService.deleteRoom = originalDelete;
        client.disconnect();
        await server.stop();
      }
    });
  });

  describe('inventory consent termination', () => {
    it('owner disconnect ends that owner consent', async() => {
      const server = createProductionStackServer({ debounceMs: 20 });
      await server.start();
      const gmUid = server.nextUserId();
      const gmToken = `test-token:${gmUid}`;
      server.registerAuthToken(gmToken, gmUid);
      const gmClient = server.connect({ token: gmToken });
      await connected(gmClient);
      const room = await server.seedRoom(gmClient.id, { gmUserId: gmUid, persistentRoomId: 'consent-owner-leave' });
      const ownerUid = server.nextUserId();
      const ownerToken = `test-token:${ownerUid}`;
      server.registerAuthToken(ownerToken, ownerUid);
      const ownerClient = server.connect({ token: ownerToken });
      await connected(ownerClient);
      const joined = once(ownerClient, 'room_joined');
      ownerClient.emit('join_room', { roomId: room.id, playerName: 'Owner', password: '' });
      await joined;
      server.setCharacterOwner('char-consent', ownerUid);
      const grant = await emitAck(ownerClient, 'inventory_share_grant', { roomId: room.id, characterId: 'char-consent' });
      expect(grant.success).to.equal(true);
      expect(room.inventoryShares['char-consent']).to.exist;

      ownerClient.emit('leave_room');
      await wait(150);
      expect(room.inventoryShares['char-consent']).to.equal(undefined);

      gmClient.disconnect();
      ownerClient.disconnect();
      await server.stop();
    });
  });
});
