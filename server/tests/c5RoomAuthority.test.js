/**
 * Project 4 C5 â€” bounded room-authority lease regressions.
 *
 * Two independent process contexts (separate services, clocks, rooms maps and
 * admission locks) share one deterministic atomic backend. The backend
 * enforces transactions, backend readTime, generations, holder identity and
 * updateTime CAS preconditions; no JS mutex is shared between "processes".
 */

const { execFile } = require('child_process');
const path = require('path');
const { expect } = require('chai');
const sinon = require('sinon');

const roomAuthority = require('../services/roomAuthorityService');
const roomAccess = require('../services/roomAccessService');
const firebaseService = require('../services/firebaseService');
const roomHandlers = require('../handlers/roomHandlers');
const roomCheckpoint = require('../services/roomCheckpoint');
const roomCheckpointExport = require('../services/roomCheckpointExport');
const { FirebaseBatchWriter, MovementDebouncer, performGracefulShutdown } = require('../services/syncService');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { createFakeAuthorityBackend, makeCasFakeDb } = require('./helpers/fakeAuthorityBackend');
const { loadFirebaseServiceWithFakeDb, buildGameState } = require('./helpers/fakeCheckpointFirestore');

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

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function fakeSocket(uid, id = `socket-${Math.random().toString(36).slice(2, 8)}`) {
  return {
    id,
    data: { userId: uid, authenticated: true, signInProvider: 'password' },
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
    isPermanent: false,
    players: new Map(),
    settings: { maxPlayers: 4, isPrivate: true },
    gameState: {
      defaultMapId: 'a',
      playerMapAssignments: {},
      maps: { a: { tokens: {}, characterTokens: {} } },
      tokens: {},
      characterTokens: {}
    },
    ...overrides
  };
}

function canonicalClassification(roomId, gmUserId, gameState = buildGameState()) {
  const canonical = roomCheckpoint.buildCheckpointDocuments({
    roomId,
    gameState,
    revision: 5,
    serverTimestamp: () => 'TS'
  });
  return roomCheckpoint.classifyRoomDocuments({
    roomId,
    root: {
      exists: true,
      data: { id: roomId, checkpoint: canonical.manifest, gmId: gmUserId, members: [gmUserId], checkpointSelection: null }
    },
    gameStateDocs: [
      { id: 'current', data: canonical.global.data },
      ...canonical.maps.map((doc) => ({ id: doc.mapId, data: doc.data }))
    ]
  });
}

describe('Project 4 C5 room authority', function() {
  this.timeout(30000);

  let clock;
  let uidCounter;

  beforeEach(() => {
    clock = { value: 0 };
    uidCounter = 0;
    // C3 durable compensation boundary: never reach a real Firestore from the
    // direct-admission tests. Regression tests override these explicitly.
    sinon.stub(firebaseService, 'listMembershipCompensations').resolves([]);
    sinon.stub(firebaseService, 'recordMembershipCompensation').resolves({ ok: true });
    sinon.stub(firebaseService, 'clearMembershipCompensation').resolves({ ok: true });
  });

  afterEach(() => {
    sinon.restore();
  });

  const now = () => clock.value;
  const nextPlayerId = () => `player-${++uidCounter}`;
  const makeService = (backend, instanceId) => roomAuthority.createRoomAuthorityService({
    backend,
    instanceId,
    now,
    logger: silentLogger,
    setIntervalFn: () => ({ unref() {} }),
    clearIntervalFn: () => {}
  });
  const heldAuthorityDoc = (instanceId, generation, expiresAtMs = 30000) => ({
    authorityInstanceId: instanceId,
    authorityGeneration: generation,
    state: 'held',
    expiresAt: { toMillis: () => expiresAtMs }
  });
  const tokenFor = (roomId, instanceId, generation, deadline = 25000) => Object.freeze({
    roomId,
    authorityInstanceId: instanceId,
    authorityGeneration: generation,
    localSafeDeadline: deadline
  });

  async function admit({ service, room, userId, socketId }) {
    const socket = fakeSocket(userId, socketId);
    const rooms = new Map([[room.id, room]]);
    const players = new Map();
    if (service && typeof service.attachRoom === 'function') {service.attachRoom(room);}
    const result = await roomAccess.admitVerifiedMember({
      socket,
      rooms,
      players,
      firebaseService,
      uuidv4: nextPlayerId,
      room,
      userId,
      playerName: userId,
      playerColor: '#ffffff',
      character: null,
      sanitizePlayerName: (name) => name,
      authorityService: service
    });
    return { result, socket, players, rooms };
  }

  describe('lease acquisition and identity', () => {
    it('1: process A acquires room authority with a fresh generation', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const claim = await a.acquire('r1');
      expect(claim.ok).to.equal(true);
      expect(claim.token.roomId).to.equal('r1');
      expect(claim.token.authorityInstanceId).to.equal('instance-A');
      expect(claim.token.authorityGeneration).to.equal(1);
      expect(claim.token.localSafeDeadline).to.equal(25000);
      expect(a.isRoomAuthoritative('r1').ok).to.equal(true);
      expect(fake.getDoc('r1').state).to.equal('held');
    });

    it('2: process B cannot acquire while A lease is live; may take over after expiry', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const b = makeService(fake.backend, 'instance-B');
      await a.acquire('r2');

      const busy = await b.acquire('r2');
      expect(busy.ok).to.equal(false);
      expect(busy.code).to.equal('room_authority_busy');
      expect(b.currentToken('r2')).to.equal(null);

      fake.expire('r2');
      const takeover = await b.acquire('r2');
      expect(takeover.ok).to.equal(true);
      expect(takeover.token.authorityGeneration).to.equal(2);
      expect(fake.getDoc('r2').instanceId).to.equal('instance-B');
    });

    it('3: cross-process final-slot admission allows at most one winner', async() => {
      // Native coordination: two independent process contexts share ONLY a
      // Firestore-shaped CAS backend. Authority acquisition resolves through
      // real transactions with version conflict/retry; the winner is never
      // manually sequenced.
      const cas = makeCasFakeDb();
      const loadedA = loadFirebaseServiceWithFakeDb(cas.db);
      const loadedB = loadFirebaseServiceWithFakeDb(cas.db);
      const clockA = { value: 0 };
      const clockB = { value: 0 };
      const svcWith = (service, id, clock) => roomAuthority.createRoomAuthorityService({
        backend: roomAuthority.createFirestoreAuthorityBackend(service),
        instanceId: id,
        now: () => clock.value,
        logger: silentLogger,
        setIntervalFn: () => ({ unref() {} }),
        clearIntervalFn: () => {}
      });
      try {
        const a = svcWith(loadedA.service, 'instance-A', clockA);
        const b = svcWith(loadedB.service, 'instance-B', clockB);

        // Fully independent runtime contexts: separate room objects, registries,
        // clocks and local admission locks. Only the backend is shared.
        const roomA = fakeRoom({ id: 'cap-room', settings: { maxPlayers: 1, isPrivate: true } });
        const roomB = fakeRoom({ id: 'cap-room', settings: { maxPlayers: 1, isPrivate: true } });

        const [claimA, claimB] = await Promise.all([a.acquire('cap-room'), b.acquire('cap-room')]);
        expect(claimA.ok !== claimB.ok).to.equal(true);
        const winnerService = claimA.ok ? a : b;
        const winnerRoom = claimA.ok ? roomA : roomB;
        const loserService = claimA.ok ? b : a;
        const loserRoom = claimA.ok ? roomB : roomA;
        expect(loserService.currentToken('cap-room')).to.equal(null);
        // The winning process has the room attached (as install would).
        winnerService.attachRoom(winnerRoom);

        // Both processes attempt the final slot concurrently with independent
        // local admission locks (lockHeld models per-process locks).
        const socketWin = fakeSocket('u1', 's1');
        const socketLose = fakeSocket('u2', 's2');
        const [winner, loser] = await Promise.all([
          roomAccess.admitVerifiedMember({
            socket: socketWin,
            rooms: new Map([[winnerRoom.id, winnerRoom]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room: winnerRoom,
            userId: 'u1',
            playerName: 'u1',
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            lockHeld: true,
            authorityService: winnerService
          }),
          roomAccess.admitVerifiedMember({
            socket: socketLose,
            rooms: new Map([[loserRoom.id, loserRoom]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room: loserRoom,
            userId: 'u2',
            playerName: 'u2',
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            lockHeld: true,
            authorityService: loserService
          })
        ]);
        expect(winner.ok).to.equal(true);
        expect(loser.ok).to.equal(false);
        expect(loser.code).to.equal('room_authority_lost');
        expect(winnerRoom.players.size).to.equal(1);
        expect(loserRoom.players.size).to.equal(0);
        expect(roomAccess.countActiveMemberSlots(winnerRoom)).to.equal(1);
      } finally {
        loadedB.restore();
        loadedA.restore();
      }
    });

    it('4: same-UID multi-device remains valid and consumes one capacity slot', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('multi-room');

      const room = fakeRoom({ id: 'multi-room', settings: { maxPlayers: 2, isPrivate: true } });
      const first = await admit({ service: a, room, userId: 'u1', socketId: 's1' });
      const second = await admit({ service: a, room, userId: 'u1', socketId: 's2' });
      expect(first.result.ok).to.equal(true);
      expect(second.result.ok).to.equal(true);
      expect(first.result.player.id).to.not.equal(second.result.player.id);
      expect(room.players.size).to.equal(2);
      expect(roomAccess.countActiveMemberSlots(room)).to.equal(1);
    });

    it('4b: buffered movement under a stale generation is discarded at flush', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('move-room');
      const tokenA = a.currentToken('move-room');

      const room = fakeRoom({ id: 'move-room' });
      room.gameState.tokens.t1 = { id: 't1', position: { x: 0, y: 0 } };
      const rooms = new Map([[room.id, room]]);
      const players = new Map([['sock-1', { id: 'p1', roomId: room.id }]]);
      const emitted = [];
      const io = { to: (roomId) => ({ emit: (event, payload) => emitted.push({ roomId, event, payload }) }) };

      const debouncer = new MovementDebouncer(60000, null, {
        authoritySettleValid: async(token) => (await a.assertSettle(token, { backendCheck: true })).ok
      });
      try {
        debouncer.queueMove(
          room.id,
          't1',
          { position: { x: 5, y: 5 }, playerId: 'sock-1', mapId: 'default' },
          tokenA
        );

        // B takes authority while A's LOCAL deadline is still valid: only the
        // fresh backend check can reject the buffered movement.
        fake.advance(30000);
        const b = makeService(fake.backend, 'instance-B');
        expect((await b.acquire('move-room')).ok).to.equal(true);
        expect(a.isRoomAuthoritative('move-room').ok).to.equal(true);

        await debouncer.flush(io, rooms, players);

        expect(room.gameState.tokens.t1.position).to.deep.equal({ x: 0, y: 0 });
        expect(emitted.length).to.equal(0);
      } finally {
        debouncer.stop();
      }
    });

    it('5: stopped renewal makes authority unavailable to A and lets B take over after expiry', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r5');

      clock.value = 26000; // local budget elapsed without renewal
      expect(a.isRoomAuthoritative('r5').ok).to.equal(false);
      const room = fakeRoom({ id: 'r5' });
      const denied = await admit({ service: a, room, userId: 'u1', socketId: 's1' });
      expect(denied.result.ok).to.equal(false);
      expect(denied.result.code).to.equal('room_authority_lost');
      expect(room.players.size).to.equal(0);

      fake.setTime(30001); // backend expiry
      const b = makeService(fake.backend, 'instance-B');
      const takeover = await b.acquire('r5');
      expect(takeover.ok).to.equal(true);
      expect(takeover.token.authorityGeneration).to.equal(2);
    });

    it('6: B acquires only after confirmed release or backend expiry', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const b = makeService(fake.backend, 'instance-B');

      await a.acquire('released-room');
      const releaseClaim = a.currentToken('released-room');
      const released = await a.release(releaseClaim);
      expect(released.ok).to.equal(true);
      const afterRelease = await b.acquire('released-room');
      expect(afterRelease.ok).to.equal(true);
      // Release itself advanced the generation; acquisition advances again.
      expect(afterRelease.token.authorityGeneration).to.equal(3);

      await a.acquire('expired-room');
      const early = await b.acquire('expired-room');
      expect(early.ok).to.equal(false);
      expect(early.code).to.equal('room_authority_busy');
      fake.setTime(30001);
      const afterExpiry = await b.acquire('expired-room');
      expect(afterExpiry.ok).to.equal(true);
    });

    it('12: different rooms may have different authorities', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const b = makeService(fake.backend, 'instance-B');
      const x = await a.acquire('room-X');
      const y = await b.acquire('room-Y');
      expect(x.ok).to.equal(true);
      expect(y.ok).to.equal(true);
      expect((await a.acquire('room-Y')).code).to.equal('room_authority_busy');
      expect((await b.acquire('room-X')).code).to.equal('room_authority_busy');
    });

    it('15: exact lease expiry boundary is inclusive of takeover at expiresAt', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const b = makeService(fake.backend, 'instance-B');
      await a.acquire('boundary-room');

      fake.setTime(29999);
      expect((await b.acquire('boundary-room')).code).to.equal('room_authority_busy');
      fake.setTime(30000);
      expect((await b.acquire('boundary-room')).ok).to.equal(true);
    });
  });

  describe('local timing, fencing and backend checks', () => {
    it('7: after B takeover a late A socket mutation is rejected with no side effects', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r7');

      // B takes over after expiry; A's local budget has also elapsed.
      fake.setTime(30001);
      clock.value = 30001;
      const b = makeService(fake.backend, 'instance-B');
      await b.acquire('r7');

      const room = fakeRoom({ id: 'r7' });
      const denied = await admit({ service: a, room, userId: 'u1', socketId: 's1' });
      expect(denied.result.ok).to.equal(false);
      expect(denied.result.code).to.equal('room_authority_lost');
      expect(room.players.size).to.equal(0);
      expect(room.gameState.playerMapAssignments).to.deep.equal({});
    });

    it('7b: production join_room refuses a fenced lifecycle with a bounded error', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, uid));
        const gm = server.connect({ token: `tok-${uid}` });
        await connected(gm);
        const created = once(gm, 'room_joined');
        gm.emit('create_room', { gmName: 'GM', persistentRoomId: 'fenced-room', password: '' });
        const payload = await created;
        const roomId = payload.room.id;

        server.authorityService.fenceLocal(roomId);

        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const errorPromise = once(player, 'room_error');
        player.emit('join_room', { roomId, playerName: 'Player', password: '' });
        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');
        expect(server.rooms.get(roomId).players.size).to.equal(0);
      } finally {
        await server.stop();
      }
    });

    it('16: a late acquisition response beyond the local safe deadline is not adopted', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      fake.setBeforeOp(async({ op }) => {
        if (op === 'acquire') {clock.value = 26000;}
      });
      const claim = await a.acquire('late-room');
      expect(claim.ok).to.equal(false);
      expect(claim.late).to.equal(true);
      expect(a.currentToken('late-room')).to.equal(null);
      expect(a.isRoomAuthoritative('late-room').ok).to.equal(false);
      // The unadopted backend claim expires on its own; no runtime exists.
      expect(fake.getDoc('late-room').state).to.equal('held');
    });

    it('17: a late successful renewal cannot revive a fenced lifecycle', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r17');

      let releaseRenew;
      const renewGate = new Promise((resolve) => { releaseRenew = resolve; });
      fake.setBeforeOp(({ op }) => (op === 'renew' ? renewGate : undefined));

      const renewPromise = a.renew('r17');
      await wait(10);
      a.fenceLocal('r17');
      releaseRenew();
      const outcome = await renewPromise;
      expect(outcome.ok).to.equal(false);
      expect(a.isRoomAuthoritative('r17').ok).to.equal(false);
      expect(a.currentToken('r17')).to.equal(null);
    });

    it('17b: a renewal response after the previous safe deadline cannot revive authority', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r17b');
      // Acquired at local 0 with a 25s safe deadline.
      clock.value = 10000;
      fake.setBeforeOp(async({ op }) => {
        if (op === 'renew') {clock.value = 26000;} // response after the OLD deadline
      });
      const renew = await a.renew('r17b');
      expect(renew.ok).to.equal(false);
      expect(a.currentToken('r17b')).to.equal(null);
      expect(a.isRoomAuthoritative('r17b').ok).to.equal(false);
    });

    it('18: wall-clock jumps do not affect local authority validity', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r18');
      const wallClock = sinon.stub(Date, 'now').returns(9_999_999_999_999);
      try {
        expect(a.isRoomAuthoritative('r18').ok).to.equal(true);
        expect(a.validateCurrent(a.currentToken('r18'))).to.equal(true);
      } finally {
        wallClock.restore();
      }
      clock.value = 26000;
      expect(a.isRoomAuthoritative('r18').ok).to.equal(false);
    });

    it('19: monotonic local deadline expiration fences the lifecycle', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('r19');
      clock.value = 26000;
      const check = await a.assertRoomAuthoritative('r19');
      expect(check.ok).to.equal(false);
      expect(check.code).to.equal('room_authority_lost');
      expect(a.isRoomAuthoritative('r19').ok).to.equal(false);
      const renew = await a.renew('r19');
      expect(renew.ok).to.equal(false);
    });

    it('11: backend unavailability refuses acquisition, admission and durable publication', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      fake.setUnavailable(true);
      const claim = await a.acquire('r11');
      expect(claim.ok).to.equal(false);
      expect(claim.code).to.equal('room_authority_unavailable');

      const room = fakeRoom({ id: 'r11' });
      const denied = await admit({ service: a, room, userId: 'u1', socketId: 's1' });
      expect(denied.result.ok).to.equal(false);
      expect(denied.result.code).to.equal('room_authority_lost');
      expect(room.players.size).to.equal(0);

      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => null,
        authorityRequired: true,
        authorityCurrent: () => false,
        persist: async() => ({ outcome: 'confirmed', revision: 1 }),
        getRoomRevision: () => 0
      });
      try {
        expect(writer.queueWrite('r11', { tokens: {} }, true)).to.equal(null);
      } finally {
        writer.stop();
      }

      const cas = makeCasFakeDb();
      cas.setPathReadFailure('roomAuthorities/r11');
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        const result = await loaded.service.publishRoomCheckpoint('r11', buildGameState(), {
          revision: 1,
          authority: tokenFor('r11', 'instance-A', 1)
        });
        expect(result.outcome).to.not.equal('confirmed');
        expect(result.code).to.equal('room_authority_unavailable');
        expect(cas.hasDocument('rooms/r11')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('11b: backend outage while a lifecycle is held fences on the next authoritative action', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('held-outage');
      fake.setUnavailable(true);

      const room = fakeRoom({ id: 'held-outage' });
      const denied = await admit({ service: a, room, userId: 'u1', socketId: 's1' });
      expect(denied.result.ok).to.equal(false);
      expect(denied.result.code).to.equal('room_authority_unavailable');
      expect(a.isRoomAuthoritative('held-outage').ok).to.equal(false);
      expect(room.players.size).to.equal(0);
    });

    it('31: failed deletion cannot reactivate on expired local budget or backend change', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('del-proof');
      const token = a.currentToken('del-proof');

      // Delete started, then the local safe budget elapsed: backend proof alone
      // must not revive a quiesced lifecycle.
      a.beginQuiesce(token);
      clock.value = 26000;
      expect((await a.assertBackendHeld(token)).ok).to.equal(false);
      expect(a.validateSettle(token)).to.equal(false);

      // Backend authority changed to B during the ambiguous delete: the old
      // lifecycle must not reactivate.
      const fake2 = createFakeAuthorityBackend();
      const a2 = makeService(fake2.backend, 'instance-A');
      await a2.acquire('del-proof2');
      const token2 = a2.currentToken('del-proof2');
      a2.beginQuiesce(token2);
      fake2.advance(30000);
      const b = makeService(fake2.backend, 'instance-B');
      expect((await b.acquire('del-proof2')).ok).to.equal(true);
      const proof = await a2.assertBackendHeld(token2);
      expect(proof.ok).to.equal(false);
      // The old lifecycle is not reactivated to ACTIVE.
      expect(a2.isRoomAuthoritative('del-proof2').ok).to.equal(false);
    });

    it('31b: a failed live deletion cannot reactivate or resume the stale runtime', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);
        const room = await server.seedRoom(client.id, { name: 'Delete Fail', gmName: 'GM', gmUserId: uid });
        let deletedEvents = 0;
        client.on('room_deleted', () => { deletedEvents += 1; });
        const queueSpy = sinon.spy(server.firebaseBatchWriter, 'queueWrite');

        const originalDelete = firebaseService.deleteRoom;
        firebaseService.deleteRoom = async() => {
          // Authority moves while the delete is in flight.
          server.authorityService.fenceLocal(room.id);
          return { ok: false, code: 'room_authority_unavailable' };
        };
        try {
          const response = await emitAck(client, 'delete_room', { roomId: room.id });
          expect(response.success).to.equal(false);
        } finally {
          firebaseService.deleteRoom = originalDelete;
        }

        expect(deletedEvents).to.equal(0);
        expect(queueSpy.calledWith(room.id)).to.equal(false);
        expect(server.authorityService.isRoomAuthoritative(room.id).ok).to.equal(false);
        const live = server.rooms.get(room.id);
        expect(!live || live.lifecycleState !== 'active').to.equal(true);

        // The stale lifecycle cannot resume mutation.
        const errorPromise = once(client, 'room_error');
        client.emit('token_updated', { roomId: room.id, mapId: 'default', tokenId: 't1', updates: { currentHp: 9 } });
        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');
      } finally {
        await server.stop();
      }
    });

    it('20: same-generation renewal CAS contention is resolved by real version conflict', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/r20', heldAuthorityDoc('instance-A', 1));
        let bumped = false;
        cas.setTransactionCommitHook(async() => {
          if (!bumped) {
            bumped = true;
            cas.setDocument('roomAuthorities/r20', heldAuthorityDoc('instance-A', 1, 60000));
          }
        });
        const renew = await loaded.service.renewRoomAuthority({
          roomId: 'r20',
          instanceId: 'instance-A',
          generation: 1,
          leaseDurationMs: 30000
        });
        expect(renew.ok).to.equal(true);
        expect(bumped).to.equal(true);
      } finally {
        loaded.restore();
      }
    });
  });

  describe('durable commit fence (P3 publication)', () => {
    it('9: an old A checkpoint batch cannot commit after B takeover', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/p3-room', heldAuthorityDoc('instance-A', 1));
        // B takeover
        cas.setDocument('roomAuthorities/p3-room', heldAuthorityDoc('instance-B', 2, 60000));
        const result = await loaded.service.publishRoomCheckpoint('p3-room', buildGameState(), {
          revision: 1,
          authority: tokenFor('p3-room', 'instance-A', 1)
        });
        expect(result.outcome).to.not.equal('confirmed');
        expect(result.code).to.equal('room_authority_lost');
        expect(cas.hasDocument('rooms/p3-room')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('21: takeover between the authority read and batch commit fails the whole batch', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/r21', heldAuthorityDoc('instance-A', 1));
        cas.setBeforeCommit(() => {
          cas.setBeforeCommit(null);
          cas.setDocument('roomAuthorities/r21', heldAuthorityDoc('instance-B', 2, 60000));
        });
        const result = await loaded.service.publishRoomCheckpoint('r21', buildGameState(), {
          revision: 1,
          authority: tokenFor('r21', 'instance-A', 1)
        });
        expect(result.outcome).to.not.equal('confirmed');
        expect(cas.hasDocument('rooms/r21')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('23: the verified-identical confirmation branch cannot confirm after takeover', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/r23', heldAuthorityDoc('instance-A', 1));
        const first = await loaded.service.publishRoomCheckpoint('r23', buildGameState(), {
          revision: 1,
          authority: tokenFor('r23', 'instance-A', 1)
        });
        expect(first.outcome).to.equal('confirmed');

        // B takeover, then A retries the identical revision. The takeover lands
        // during A's checkpoint verification read, so the post-verification
        // authority validation is the boundary that refuses CONFIRMED.
        let takenOver = false;
        cas.setTransactionCommitHook(async() => {
          if (!takenOver) {
            takenOver = true;
            cas.setDocument('roomAuthorities/r23', heldAuthorityDoc('instance-B', 2, 60000));
          }
        });
        const retry = await loaded.service.publishRoomCheckpoint('r23', buildGameState(), {
          revision: 1,
          authority: tokenFor('r23', 'instance-A', 1)
        });
        expect(retry.outcome).to.not.equal('confirmed');
        expect(retry.code).to.equal('room_authority_lost');
      } finally {
        loaded.restore();
      }
    });

    it('24: publication preflight includes the authority fence write at the operation boundary', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/r24', heldAuthorityDoc('instance-A', 1));
        cas.setDocument('roomAuthorities/r24b', heldAuthorityDoc('instance-A', 1));
        const tooMany = await loaded.service.publishRoomCheckpoint('r24', buildGameState({ mapCount: 498 }), {
          revision: 1,
          authority: tokenFor('r24', 'instance-A', 1)
        });
        expect(tooMany.code).to.equal('CHECKPOINT_TOO_LARGE');
        expect(cas.hasDocument('rooms/r24')).to.equal(false);
        // Rejected before ANY write: no root, no fragment, no authority fence.
        expect(Array.from(cas.stored.keys()).some((key) => key.startsWith('rooms/r24/'))).to.equal(false);
        expect(cas.getDocument('roomAuthorities/r24').fencedAt).to.equal(undefined);

        const boundary = await loaded.service.publishRoomCheckpoint('r24b', buildGameState({ mapCount: 497 }), {
          revision: 1,
          authority: tokenFor('r24b', 'instance-A', 1)
        });
        expect(boundary.outcome).to.equal('confirmed');
      } finally {
        loaded.restore();
      }
    });

    it('13: the deletion tombstone blocks stale publication and root recreation', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/del-room', heldAuthorityDoc('instance-A', 1));
        const deleted = await loaded.service.deleteRoom('del-room', {
          authority: tokenFor('del-room', 'instance-A', 1)
        });
        expect(deleted.ok).to.equal(true);
        const authority = cas.getDocument('roomAuthorities/del-room');
        expect(authority.state).to.equal('deleted');
        expect(authority.authorityGeneration).to.equal(2);
        expect(authority.authorityInstanceId).to.equal(null);
        expect(cas.hasDocument('rooms/del-room')).to.equal(false);

        const stale = await loaded.service.publishRoomCheckpoint('del-room', buildGameState(), {
          revision: 1,
          authority: tokenFor('del-room', 'instance-A', 1)
        });
        expect(stale.outcome).to.not.equal('confirmed');
        expect(stale.code).to.equal('room_deleted');
        expect(cas.hasDocument('rooms/del-room')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('29: concurrent deletion and checkpoint never resurrect a deleted room', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/order-del', heldAuthorityDoc('instance-A', 1));
        const committed = await loaded.service.publishRoomCheckpoint('order-del', buildGameState(), {
          revision: 1,
          authority: tokenFor('order-del', 'instance-A', 1)
        });
        expect(committed.outcome).to.equal('confirmed');

        const deleted = await loaded.service.deleteRoom('order-del', {
          authority: tokenFor('order-del', 'instance-A', 1)
        });
        expect(deleted.ok).to.equal(true);

        const resurrection = await loaded.service.publishRoomCheckpoint('order-del', buildGameState(), {
          revision: 2,
          authority: tokenFor('order-del', 'instance-A', 1)
        });
        expect(resurrection.outcome).to.not.equal('confirmed');
        expect(cas.hasDocument('rooms/order-del')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });
    it('29b: concurrent deletion during a staged checkpoint commit prevents resurrection', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        cas.setDocument('roomAuthorities/race-del', heldAuthorityDoc('instance-A', 1));
        let deleted = false;
        cas.setBeforeCommit(async() => {
          if (!deleted) {
            deleted = true;
            // Deletion wins the race while the checkpoint batch is staged.
            await loaded.service.deleteRoom('race-del', {
              authority: tokenFor('race-del', 'instance-A', 1)
            });
          }
        });
        const result = await loaded.service.publishRoomCheckpoint('race-del', buildGameState(), {
          revision: 1,
          authority: tokenFor('race-del', 'instance-A', 1)
        });
        expect(result.outcome).to.not.equal('confirmed');
        expect(cas.hasDocument('rooms/race-del')).to.equal(false);
        expect(cas.getDocument('roomAuthorities/race-del').state).to.equal('deleted');
      } finally {
        loaded.restore();
      }
    });
  });

  describe('P2 writer integration', () => {
    it('8: old A retained work cannot enqueue, start or confirm under B generation', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('p2-room');

      const persisted = [];
      let releasePersist;
      const gate = new Promise((resolve) => { releasePersist = resolve; });
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('p2-room'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        authorityConfirm: async(token) => (await a.assertSettle(token, { backendCheck: true })).ok,
        persist: async(roomId, snapshot, context) => {
          persisted.push(context.authority);
          await gate;
          return { outcome: 'confirmed', revision: context.revision };
        },
        getRoomRevision: () => 0
      });
      try {
        const saving = writer.saveNow('p2-room', { tokens: {} });
        await wait(20);
        expect(persisted.length).to.equal(1);
        expect(persisted[0].authorityGeneration).to.equal(1);
        expect(persisted[0].authorityInstanceId).to.equal('instance-A');

        // REAL backend takeover while the attempt is genuinely in flight: the
        // lease expires and B acquires generation 2. A's LOCAL safe deadline
        // stays valid, so only the fresh backend check can refuse the stale
        // confirmation.
        fake.advance(30000);
        const b = makeService(fake.backend, 'instance-B');
        const takeover = await b.acquire('p2-room');
        expect(takeover.ok).to.equal(true);
        expect(takeover.token.authorityGeneration).to.equal(2);
        expect(a.isRoomAuthoritative('p2-room').ok).to.equal(true);

        releasePersist();
        const outcome = await saving;
        expect(outcome.outcome).to.equal('permanent');
        expect(outcome.code).to.equal('room_authority_lost');
        const status = writer.getStatus('p2-room');
        expect(status.cloudSaved).to.equal(false);
        expect(status.exhausted).to.equal(true);

        // No later work under the stale generation can ever be confirmed.
        let confirmedEvents = 0;
        writer.onConfirmed = () => { confirmedEvents += 1; };
        writer.queueWrite('p2-room', { tokens: { x: {} } }, true);
        await wait(40);
        expect(confirmedEvents).to.equal(0);
        expect(writer.getStatus('p2-room').cloudSaved).to.equal(false);
      } finally {
        writer.stop();
      }
    });

    it('22: a confirmation whose commit preceded takeover cannot acknowledge the current save', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('p2-late');

      let releasePersist;
      let commitObserved = false;
      const gate = new Promise((resolve) => { releasePersist = resolve; });
      let confirmedCount = 0;
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('p2-late'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        authorityConfirm: async(token) => (await a.assertSettle(token, { backendCheck: true })).ok,
        persist: async() => {
          commitObserved = true;
          await gate;
          return { outcome: 'confirmed', revision: 1 };
        },
        getRoomRevision: () => 0
      });
      writer.onConfirmed = () => { confirmedCount += 1; };
      try {
        writer.queueWrite('p2-late', { tokens: {} }, true);
        await wait(20);
        expect(commitObserved).to.equal(true);

        // The durable commit landed under A, then B takes over at the BACKEND
        // before A's completion callback runs. A's LOCAL deadline stays valid,
        // so the fresh backend check is the decisive boundary.
        fake.advance(30000);
        const b = makeService(fake.backend, 'instance-B');
        expect((await b.acquire('p2-late')).ok).to.equal(true);
        expect(a.isRoomAuthoritative('p2-late').ok).to.equal(true);
        releasePersist();
        await wait(30);

        expect(confirmedCount).to.equal(0);
        const status = writer.getStatus('p2-late');
        expect(status.cloudSaved).to.equal(false);
        expect(status.error).to.equal('room_authority_lost');
      } finally {
        writer.stop();
      }
    });

    it('30: shutdown quiesces producers, drains captured work and settles a pending waiter', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('shut-room');

      const order = [];
      let persistCalls = 0;
      let releasePersist;
      const persistGate = new Promise((resolve) => { releasePersist = resolve; });
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('shut-room'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        authorityConfirm: async(token) => (await a.assertSettle(token, { backendCheck: true })).ok,
        persist: async() => {
          persistCalls += 1;
          order.push(`persist-${persistCalls}`);
          if (persistCalls === 1) {await persistGate;}
          return { outcome: 'confirmed', revision: 1 };
        },
        getRoomRevision: () => 0
      });

      // Explicit save waiter pending on the genuinely in-flight attempt.
      const saving = writer.saveNow('shut-room', { tokens: { a: {} } });
      await wait(20);
      expect(persistCalls).to.equal(1);

      // REAL lifecycle transition to QUIESCING.
      const token = a.currentToken('shut-room');
      expect(a.beginQuiesce(token)).to.equal(true);
      expect(a.validateCurrent(token)).to.equal(false);
      expect(a.validateSettle(token)).to.equal(true);

      // A producer attempting NEW work during quiescing is refused.
      expect(writer.queueWrite('shut-room', { tokens: { x: {} } }, true)).to.equal(null);
      await wait(10);
      expect(persistCalls).to.equal(1);

      const services = {
        firebaseBatchWriter: writer,
        movementDebouncer: { stop() {order.push('producer-stopped');} }
      };
      order.length = 0;
      const shutdownPromise = performGracefulShutdown(services, { authorityService: a });
      await wait(10);
      // The captured in-flight attempt completes while QUIESCING and the
      // pending waiter settles through the drain under the SAME lease.
      releasePersist();
      const result = await shutdownPromise;

      expect(order[0]).to.equal('producer-stopped');
      expect(persistCalls).to.equal(1);
      expect((await saving).outcome).to.equal('confirmed');
      expect(result.confirmed).to.equal(1);
      expect(result.unsaved).to.equal(0);
      expect(writer.getStatus('shut-room').cloudSaved).to.equal(true);
      const doc = fake.getDoc('shut-room');
      expect(doc.state).to.equal('released');
      expect(doc.generation).to.equal(2);
    });

    it('30c: a hung authority release cannot block shutdown beyond the bound', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'hung-release');
      await a.acquire('hung-release');
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('hung-release'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        persist: async() => ({ outcome: 'confirmed', revision: 1 }),
        getRoomRevision: () => 0
      });
      try {
        sinon.stub(a, 'release').callsFake(() => new Promise(() => {}));
        const started = Date.now();
        await performGracefulShutdown(
          { firebaseBatchWriter: writer, movementDebouncer: { stop() {} } },
          { authorityService: a, releaseDeadlineMs: 50 }
        );
        expect(Date.now() - started).to.be.lessThan(2000);
      } finally {
        writer.stop();
      }
    });

    it('6b: authority loss preserves retained snapshot evidence and accounts it unresolved', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('retain-room');
      let persistCalls = 0;
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('retain-room'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        persist: async() => { persistCalls += 1; return { outcome: 'confirmed', revision: 1 }; },
        getRoomRevision: () => 0
      });
      try {
        writer.queueWrite('retain-room', { tokens: { keep: {} } });
        // Authority is lost before the attempt starts.
        a.fenceLocal('retain-room');
        await writer.flush();

        // The retained snapshot is NOT silently discarded: evidence survives,
        // no false saved state, and no retry/persist occurs under the stale
        // lifecycle.
        expect(persistCalls).to.equal(0);
        expect(writer.getRetainedSnapshot('retain-room')).to.not.equal(null);
        const status = writer.getStatus('retain-room');
        expect(status.cloudSaved).to.equal(false);
        expect(status.exhausted).to.equal(true);

        // The unresolved work is accounted by the existing drain machinery.
        const drain = await writer.drain({ deadlineMs: 50 });
        expect(drain.unsaved).to.be.greaterThan(0);
      } finally {
        writer.stop();
      }
    });

    it('30b: a fenced lifecycle during the drain cannot confirm captured work', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      await a.acquire('shut-fence');

      let releasePersist;
      const gate = new Promise((resolve) => { releasePersist = resolve; });
      const writer = new FirebaseBatchWriter(60000, 50, {
        shouldPersist: () => true,
        captureAuthority: () => a.currentToken('shut-fence'),
        authorityRequired: true,
        authorityCurrent: (token) => a.validateSettle(token),
        authorityAccept: (token) => a.validateCurrent(token),
        authorityConfirm: async(token) => (await a.assertSettle(token, { backendCheck: true })).ok,
        persist: async() => {await gate; return { outcome: 'confirmed', revision: 1 };},
        getRoomRevision: () => 0
      });
      try {
        const saving = writer.saveNow('shut-fence', { tokens: {} });
        await wait(20);
        a.beginQuiesce(a.currentToken('shut-fence'));
        // Permanent loss lands while the drain attempt is in flight.
        a.fenceLocal('shut-fence');
        releasePersist();
        const outcome = await saving;
        expect(outcome.outcome).to.equal('permanent');
        expect(outcome.code).to.equal('room_authority_lost');
        const status = writer.getStatus('shut-fence');
        expect(status.cloudSaved).to.equal(false);
        expect(status.exhausted).to.equal(true);
      } finally {
        writer.stop();
      }
    });
  });

  describe('startup and reconstruction', () => {
    it('10: overlapping deployments install only one runtime per room', async() => {
      const fake = createFakeAuthorityBackend();
      const a = makeService(fake.backend, 'instance-A');
      const b = makeService(fake.backend, 'instance-B');
      const discoverStub = sinon.stub(firebaseService, 'discoverPersistentRoomIds')
        .resolves(['overlap-x', 'overlap-y']);
      const loadStub = sinon.stub(firebaseService, 'loadRoomAfterAuthorityClaim').callsFake(async(roomId) => ({
        id: roomId,
        players: new Map(),
        gameState: { maps: {}, defaultMapId: null },
        checkpointRevision: 0
      }));
      const legacyStub = sinon.stub(firebaseService, 'loadPersistentRooms').resolves([]);
      try {
        const roomsA = new Map();
        await roomHandlers.initializePersistentRooms(roomsA, { authorityService: a });
        expect(roomsA.size).to.equal(2);
        expect(roomsA.get('overlap-x').authorityToken).to.exist;
        expect(loadStub.callCount).to.equal(2);
        // No pre-claim full load may ever run.
        expect(legacyStub.called).to.equal(false);

        // Replacement deployment starts while A is still live: it installs no
        // competing runtime and never reads state for a room it cannot claim.
        const roomsB = new Map();
        await roomHandlers.initializePersistentRooms(roomsB, { authorityService: b });
        expect(roomsB.size).to.equal(0);
        expect(loadStub.callCount).to.equal(2);
      } finally {
        discoverStub.restore();
        loadStub.restore();
        legacyStub.restore();
      }
    });

    it('10b: the REAL post-claim loader installs NEW durable state, never pre-claim state', async() => {
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const roomId = 'startup-real';
      const seedRoomState = (meta) => {
        const canonical = roomCheckpoint.buildCheckpointDocuments({
          roomId,
          gameState: buildGameState({ globalExtra: { marker: meta.marker } }),
          revision: meta.revision,
          serverTimestamp: () => 'TS'
        });
        cas.setDocument(`rooms/${roomId}`, {
          id: roomId,
          isActive: true,
          checkpoint: canonical.manifest,
          gmId: meta.gmId,
          members: meta.members,
          passwordHash: meta.passwordHash,
          bannedUsers: meta.bannedUsers,
          name: meta.name,
          settings: meta.settings
        });
        cas.setDocument(`rooms/${roomId}/gameState/current`, canonical.global.data);
        for (const doc of canonical.maps) {
          cas.setDocument(`rooms/${roomId}/gameState/${doc.mapId}`, doc.data);
        }
      };
      seedRoomState({
        revision: 5,
        gmId: 'owner',
        members: ['owner', 'oldMember'],
        passwordHash: 'old-hash',
        bannedUsers: [],
        name: 'OLD',
        settings: { maxPlayers: 4, isPrivate: true },
        marker: 'OLD_GAME_STATE'
      });

      const authorityService = roomAuthority.createRoomAuthorityService({
        backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
        instanceId: 'instance-A',
        now,
        logger: silentLogger,
        setIntervalFn: () => ({ unref() {} }),
        clearIntervalFn: () => {}
      });
      const discoverStub = sinon.stub(firebaseService, 'discoverPersistentRoomIds').resolves([roomId]);
      // Execute the REAL loader against the fake backend (not a stub).
      const originalLoader = firebaseService.loadRoomAfterAuthorityClaim;
      firebaseService.loadRoomAfterAuthorityClaim = loaded.service.loadRoomAfterAuthorityClaim;
      const originalAcquire = authorityService.acquire.bind(authorityService);
      sinon.stub(authorityService, 'acquire').callsFake(async(id) => {
        // Durable state changes between discovery and the post-claim read.
        seedRoomState({
          revision: 6,
          gmId: 'owner',
          members: ['owner'],
          passwordHash: 'new-hash',
          bannedUsers: ['oldMember'],
          name: 'NEW',
          settings: { maxPlayers: 8, isPrivate: false },
          marker: 'NEW_GAME_STATE'
        });
        return originalAcquire(id);
      });
      try {
        const rooms = new Map();
        await roomHandlers.initializePersistentRooms(rooms, { authorityService });
        const installed = rooms.get(roomId);
        expect(installed).to.exist;
        expect(installed.checkpointRevision).to.equal(6);
        expect(installed.members).to.deep.equal(['owner']);
        expect(installed.passwordHash).to.equal('new-hash');
        expect(installed.bannedUsers).to.deep.equal(['oldMember']);
        expect(installed.name).to.equal('NEW');
        expect(installed.settings.maxPlayers).to.equal(8);
        expect(installed.gameState.marker).to.equal('NEW_GAME_STATE');
      } finally {
        firebaseService.loadRoomAfterAuthorityClaim = originalLoader;
        discoverStub.restore();
        loaded.restore();
      }
    });

    it('14: reconstruction acquires authority before installing runtime state', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        const order = [];
        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => {
          order.push('read');
          return canonicalClassification(roomId, uid);
        });
        const originalAcquire = server.authorityService.acquire.bind(server.authorityService);
        const acquireStub = sinon.stub(server.authorityService, 'acquire').callsFake(async(roomId) => {
          order.push('acquire');
          return originalAcquire(roomId);
        });

        const joined = once(client, 'room_joined');
        client.emit('create_room', { gmName: 'GM', persistentRoomId: 'order-room', password: '' });
        await joined;
        expect(order).to.deep.equal(['read', 'acquire', 'read']);
        expect(server.rooms.has('order-room')).to.equal(true);

        // Failed acquisition installs nothing and performs no second read.
        server.rooms.delete('order-room');
        server.authorityService.fenceLocal('order-room');
        acquireStub.callsFake(async(_roomId) => {
          order.push('acquire');
          return { ok: false, code: 'room_authority_lost' };
        });
        order.length = 0;
        await wait(1100); // clear the per-second event rate limit
        const errorPromise = once(client, 'room_error');
        client.emit('create_room', { gmName: 'GM', persistentRoomId: 'order-room', password: '' });
        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');
        expect(order).to.deep.equal(['read', 'acquire']);
        expect(server.rooms.has('order-room')).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('14b: reconstruction uses ONLY the post-claim OLD/NEW metadata read', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        const buildClassification = (roomId, meta) => {
          const canonical = roomCheckpoint.buildCheckpointDocuments({
            roomId,
            gameState: buildGameState({ globalExtra: { marker: meta.marker } }),
            revision: meta.revision,
            serverTimestamp: () => 'TS'
          });
          return roomCheckpoint.classifyRoomDocuments({
            roomId,
            root: {
              exists: true,
              data: {
                id: roomId,
                checkpoint: canonical.manifest,
                gmId: meta.gmId,
                members: meta.members,
                passwordHash: meta.passwordHash,
                bannedUsers: meta.bannedUsers,
                name: meta.name,
                settings: meta.settings
              }
            },
            gameStateDocs: [
              { id: 'current', data: canonical.global.data },
              ...canonical.maps.map((doc) => ({ id: doc.mapId, data: doc.data }))
            ]
          });
        };
        const oldMeta = {
          revision: 5,
          gmId: uid,
          members: [uid, 'oldMember'],
          passwordHash: 'old-hash',
          bannedUsers: [],
          name: 'OLD',
          settings: { maxPlayers: 4, isPrivate: true },
          marker: 'OLD_GAME_STATE'
        };
        const newMeta = {
          revision: 6,
          gmId: uid,
          members: [uid],
          passwordHash: 'new-hash',
          bannedUsers: ['oldMember'],
          name: 'NEW',
          settings: { maxPlayers: 8, isPrivate: false },
          marker: 'NEW_GAME_STATE'
        };
        let readCount = 0;
        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => {
          readCount += 1;
          return buildClassification(roomId, readCount === 1 ? oldMeta : newMeta);
        });

        const joined = once(client, 'room_joined');
        client.emit('create_room', { gmName: 'GM', persistentRoomId: 'meta-room', password: '' });
        await joined;
        expect(readCount).to.equal(2);
        const installed = server.rooms.get('meta-room');
        expect(installed).to.exist;
        // Every administrative field AND the gameplay snapshot come from
        // READ 2 (NEW) exclusively.
        expect(installed.gmId).to.equal(uid);
        expect(installed.members).to.deep.equal([uid]);
        expect(installed.passwordHash).to.equal('new-hash');
        expect(installed.bannedUsers).to.deep.equal(['oldMember']);
        expect(installed.name).to.equal('NEW');
        expect(installed.settings.maxPlayers).to.equal(8);
        expect(installed.settings.isPrivate).to.equal(false);
        expect(installed.checkpointRevision).to.equal(6);
        expect(installed.gameState.marker).to.equal('NEW_GAME_STATE');
      } finally {
        await server.stop();
      }
    });

    it('14c: an owner change between reconstruction reads denies the old requester', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        const buildClassification = (roomId, meta) => {
          const canonical = roomCheckpoint.buildCheckpointDocuments({
            roomId,
            gameState: buildGameState(),
            revision: meta.revision,
            serverTimestamp: () => 'TS'
          });
          return roomCheckpoint.classifyRoomDocuments({
            roomId,
            root: {
              exists: true,
              data: {
                id: roomId,
                checkpoint: canonical.manifest,
                gmId: meta.gmId,
                members: meta.members,
                passwordHash: meta.passwordHash,
                bannedUsers: [],
                name: meta.name,
                settings: {}
              }
            },
            gameStateDocs: [
              { id: 'current', data: canonical.global.data },
              ...canonical.maps.map((doc) => ({ id: doc.mapId, data: doc.data }))
            ]
          });
        };
        let readCount = 0;
        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => {
          readCount += 1;
          return buildClassification(roomId, readCount === 1
            ? { revision: 5, gmId: uid, members: [uid], passwordHash: 'old-hash', name: 'OLD' }
            : { revision: 6, gmId: 'other-owner', members: ['other-owner'], passwordHash: 'new-hash', name: 'NEW' });
        });

        const errorPromise = once(client, 'room_error');
        client.emit('create_room', { gmName: 'GM', persistentRoomId: 'owner-change', password: '' });
        const error = await errorPromise;
        expect(error.code).to.equal(roomAccess.DENIAL_CODES.OWNER_REQUIRED);
        expect(readCount).to.equal(2);
        expect(server.rooms.has('owner-change')).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('33: an authoritative event after authority loss is refused before any effect', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        const room = await server.seedRoom(client.id, { name: 'Fence Room', gmName: 'GM', gmUserId: uid });
        room.gameState.maps.default.tokens.t1 = { id: 't1', name: 'Target', state: { currentHp: 1 } };
        const before = JSON.stringify(room.gameState.maps.default.tokens.t1);
        // Authority is lost (another instance released / took over).
        server.authorityService.fenceLocal(room.id);

        const errorPromise = once(client, 'room_error');
        client.emit('token_updated', {
          roomId: room.id,
          mapId: 'default',
          tokenId: 't1',
          updates: { currentHp: 99 }
        });
        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');
        // The shared async guard refused the event before any mutation.
        expect(JSON.stringify(room.gameState.maps.default.tokens.t1)).to.equal(before);
      } finally {
        await server.stop();
      }
    });

    it('33b: a client room id cannot redirect authority around the actual session room', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);
        const room = await server.seedRoom(client.id, { name: 'Weather Room', gmName: 'GM', gmUserId: uid });
        room.gameState.weather = { rain: false };

        // The actual target is the session room; a bogus client room id must
        // not skip validation.
        const mismatchPromise = once(client, 'room_error');
        client.emit('weather_update', { roomId: 'nonexistent-room', rain: true });
        const mismatch = await mismatchPromise;
        expect(mismatch.code).to.equal('room_target_mismatch');
        expect(room.gameState.weather.rain).to.equal(false);

        // Even with the matching client room id, the stale lifecycle refuses.
        server.authorityService.beginQuiesce(room.id);
        const stalePromise = once(client, 'room_error');
        client.emit('weather_update', { roomId: room.id, rain: true });
        const stale = await stalePromise;
        expect(stale.code).to.equal('room_authority_lost');
        expect(room.gameState.weather.rain).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('33c: a fresh backend failure denies an authoritative event while local authority looks valid', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);
        const room = await server.seedRoom(client.id, { name: 'Backend Room', gmName: 'GM', gmUserId: uid });
        room.gameState.maps.default.tokens.t1 = { id: 't1', name: 'Target', state: { currentHp: 1 } };
        const before = JSON.stringify(room.gameState.maps.default.tokens.t1);

        // Local lifecycle still ACTIVE, but the backend holder changed.
        const original = server.authorityService.assertCurrent.bind(server.authorityService);
        sinon.stub(server.authorityService, 'assertCurrent').callsFake(async(token, options) => {
          if (options && options.backendCheck) {
            return { ok: false, code: 'room_authority_lost' };
          }
          return original(token, options);
        });
        const errorPromise = once(client, 'room_error');
        client.emit('token_updated', { roomId: room.id, mapId: 'default', tokenId: 't1', updates: { currentHp: 9 } });
        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');
        expect(JSON.stringify(room.gameState.maps.default.tokens.t1)).to.equal(before);
      } finally {
        await server.stop();
      }
    });

    it('33d: a scheduled token delta under a lost lifecycle is dropped without broadcast', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);
        const room = await server.seedRoom(client.id, { name: 'Delta Fence', gmName: 'GM', gmUserId: uid });
        room.gameState.maps.default.tokens.t1 = { id: 't1', name: 'T1' };
        room.gameState.tokens.t1 = { id: 't1', name: 'T1' };

        const originalEnv = process.env.ENABLE_TOKENS_DELTA;
        process.env.ENABLE_TOKENS_DELTA = 'true';
        try {
          // Fence the lifecycle during the delta flush's fresh-authority await.
          const originalAssert = server.authorityService.assertSettle.bind(server.authorityService);
          sinon.stub(server.authorityService, 'assertSettle').callsFake(async(token, options) => {
            server.authorityService.fenceLocal(room.id);
            return originalAssert(token, options);
          });
          let deltas = 0;
          client.on('tokens_delta', () => { deltas += 1; });
          client.emit('token_updated', { roomId: room.id, mapId: 'default', tokenId: 't1', updates: { currentHp: 3 } });
          await wait(200);
          // The handler ran (state was updated) but the stale delta was dropped.
          expect(room.gameState.maps.default.tokens.t1.updatedAt).to.be.a('number');
          expect(deltas).to.equal(0);
        } finally {
          if (originalEnv === undefined) {delete process.env.ENABLE_TOKENS_DELTA;}
          else {process.env.ENABLE_TOKENS_DELTA = originalEnv;}
        }
      } finally {
        await server.stop();
      }
    });

    it('34: an invitation expiring during admission leaves zero net admission effects', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);

        const room = await server.seedRoom(gm.id, {
          name: 'Invite Room', gmName: 'GM', gmUserId: gmUid, members: [gmUid]
        });
        // Permanent room so durable membership is actually exercised.
        room.isPermanent = true;

        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);

        const invitation = {
          id: 'inv-expiring',
          kind: 'room',
          version: 1,
          roomId: room.id,
          fromUserId: gmUid,
          toUserId: playerUid,
          status: 'pending',
          expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        const memberCalls = [];
        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async(roomId, userId) => {
          memberCalls.push(['add', roomId, userId]);
          // The invitation expires DURING the durable grant await.
          invitation.expiresAt = Date.now() - 1;
          await wait(20);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async(roomId, userId) => {
          memberCalls.push(['remove', roomId, userId]);
          return { ok: true };
        };
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('invitation_expired');

          // ZERO net new admission effects: no runtime player, no socket
          // channel, no durable membership, no consumed invitation.
          expect(room.players.size).to.equal(0);
          expect(server.players.has(player.id)).to.equal(false);
          expect(room.members).to.deep.equal([gmUid]);
          expect(memberCalls).to.deep.equal([
            ['add', room.id, playerUid],
            ['remove', room.id, playerUid]
          ]);
          expect(invitation.status).to.equal('pending');
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }
      } finally {
        await server.stop();
      }
    });

    it('34b: a failed invitation rollback reports compensation-required with no runtime effects', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, { name: 'Comp Room', gmName: 'GM', gmUserId: gmUid, members: [gmUid] });
        room.isPermanent = true;
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const invitation = {
          id: 'inv-comp', kind: 'room', version: 1, roomId: room.id,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending',
          expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async() => {
          // The invitation expires DURING the durable grant await and the
          // compensating revoke then fails.
          invitation.expiresAt = Date.now() - 1;
          await wait(20);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async() => ({ ok: false, reason: 'unavailable' });
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('membership_compensation_required');
          expect(room.players.size).to.equal(0);
          expect(server.players.has(player.id)).to.equal(false);
          // The un-rolled-back grant is retained and ACCOUNTED, not forgotten.
          expect(room.members).to.include(playerUid);
          expect(roomAccess.getMembershipCompensationStats().pending).to.be.greaterThan(0);
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }
      } finally {
        await server.stop();
      }
    });

    it('34c: the duplicate-attached branch does not consume an invitation expiring during its await', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, { name: 'Dup Room', gmName: 'GM', gmUserId: gmUid, members: [gmUid] });
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        // Attach the player as an existing device so the duplicate branch runs.
        const record = {
          id: 'pl-dup', socketId: player.id, roomId: room.id,
          userId: playerUid, isGM: false, name: 'P', currentMapId: 'default'
        };
        room.players.set(record.id, record);
        server.players.set(player.id, record);
        server.io.sockets.sockets.get(player.id).join(room.id);
        const invitation = {
          id: 'inv-dup', kind: 'room', version: 1, roomId: room.id,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending',
          expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        // Expire the invitation during the duplicate branch's fresh-authority
        // await (the first backend check is the entry wrapper).
        let calls = 0;
        const original = server.authorityService.assertCurrent.bind(server.authorityService);
        sinon.stub(server.authorityService, 'assertCurrent').callsFake(async(token, options) => {
          calls += 1;
          if (calls === 2) {invitation.expiresAt = Date.now() - 1;}
          return original(token, options);
        });
        const errorPromise = once(player, 'join_error');
        player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
        const error = await errorPromise;
        expect(error.code).to.equal('invitation_expired');
        expect(invitation.status).to.equal('pending');
        expect(calls).to.be.greaterThan(1);
      } finally {
        await server.stop();
      }
    });

    it('34d: an invitation replaced during admission is not consumed by the stale acceptance', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, { name: 'Replace Room', gmName: 'GM', gmUserId: gmUid, members: [gmUid] });
        room.isPermanent = true;
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const invitation = {
          id: 'inv-replace', kind: 'room', version: 1, roomId: room.id,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending',
          expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        const replacement = {
          id: invitation.id, kind: 'room', version: 1, roomId: room.id,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending',
          expiresAt: Date.now() + 60000, replaced: true
        };
        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async() => {
          server.partyInvitations.set(invitation.id, replacement);
          await wait(20);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async() => ({ ok: true });
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('invitation_reissue_required');
          expect(room.players.size).to.equal(0);
          expect(server.players.has(player.id)).to.equal(false);
          expect(room.members).to.deep.equal([gmUid]);
          expect(replacement.status).to.equal('pending');
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }
      } finally {
        await server.stop();
      }
    });

    it('34e: an invitation revoked during admission is rolled back and never consumed', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, { name: 'Revoke Room', gmName: 'GM', gmUserId: gmUid, members: [gmUid] });
        room.isPermanent = true;
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const invitation = {
          id: 'inv-revoke', kind: 'room', version: 1, roomId: room.id,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending',
          expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async() => {
          invitation.status = 'revoked';
          await wait(20);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async() => ({ ok: true });
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('invitation_revoked');
          expect(room.players.size).to.equal(0);
          expect(room.members).to.deep.equal([gmUid]);
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }
      } finally {
        await server.stop();
      }
    });
  });

  describe('account-level room operations', () => {
    it('25: an inactive account metadata edit acquires target authority and releases it', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, uid));
        // External durability boundary: the republish is confirmed without a
        // real cloud write.
        sinon.stub(firebaseService, 'updateRoomGameState').resolves({ outcome: 'confirmed', revision: 6 });
        const acquireSpy = sinon.spy(server.authorityService, 'acquire');
        const releaseSpy = sinon.spy(server.authorityService, 'release');

        const response = await emitAck(client, 'update_room_metadata', { roomId: 'cloud-room', name: 'Renamed' });
        expect(acquireSpy.calledWith('cloud-room')).to.equal(true);
        expect(releaseSpy.calledWith(sinon.match({ roomId: 'cloud-room' }))).to.equal(true);
        // No gameplay runtime was created for the account-level operation.
        expect(server.rooms.has('cloud-room')).to.equal(false);
        expect(response.success).to.equal(true);
      } finally {
        await server.stop();
      }
    });

    it('26: draft creation acquires target authority and releases it', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        // External account boundary: no Firebase project in tests. Removing the
        // default admin app makes the tier lookup fail closed to the free tier
        // without a network call; it is restored afterwards.
        const admin = require('firebase-admin');
        const hadApp = admin.apps.length > 0;
        const appOptions = hadApp ? admin.app().options : null;
        if (hadApp) {await admin.app().delete();}
        const acquireSpy = sinon.spy(server.authorityService, 'acquire');
        const releaseSpy = sinon.spy(server.authorityService, 'release');
        let response;
        try {
          response = await emitAck(client, 'create_room_draft', { roomId: 'draft-26', name: 'Draft' });
        } finally {
          if (hadApp && admin.apps.length === 0) {admin.initializeApp(appOptions);}
        }
        expect(response.success).to.equal(true);
        expect(acquireSpy.calledWith('draft-26')).to.equal(true);
        expect(releaseSpy.calledWith(sinon.match({ roomId: 'draft-26' }))).to.equal(true);
        expect(server.rooms.has('draft-26')).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('27: CLI scratch restore acquires target authority before reading the artifact', async() => {
      const cliPath = path.resolve(__dirname, '..', 'services', 'roomCheckpointExport.js');
      const output = await new Promise((resolve, reject) => {
        const env = { ...process.env, NODE_ENV: 'test' };
        delete env.FIRESTORE_EMULATOR_HOST;
        delete env.FIREBASE_AUTH_EMULATOR_HOST;
        execFile(process.execPath, [cliPath, 'restore', 'does-not-exist.json', 'scratch-27'], {
          cwd: path.resolve(__dirname, '..'),
          timeout: 10000,
          env
        }, (error, stdout) => {
          if (error && !stdout) {reject(error); return;}
          resolve(stdout);
        });
      });
      const lines = String(output).trim().split(/\r?\n/).filter(Boolean);
      const parsed = JSON.parse(lines[lines.length - 1]);
      expect(parsed.ok).to.equal(false);
      // Acquisition ran first and failed closed; the artifact was never read.
      expect(parsed.reason).to.equal('room_authority_unavailable');

      // The scratch publication boundary itself is mandatory: no token means
      // no durable publication (independent of the CLI acquisition path).
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      try {
        const denied = await loaded.service.publishRoomCheckpoint('scratch-27b', buildGameState(), { revision: 1 });
        expect(denied.outcome).to.equal('permanent');
        expect(denied.code).to.equal('room_authority_lost');
        expect(cas.hasDocument('rooms/scratch-27b')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('27b: successful scratch restore acquires, fences, verifies and revalidates authority', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-restore-'));
      const previousDir = process.env.ROOM_EXPORT_DIR;
      process.env.ROOM_EXPORT_DIR = dir;
      try {
        const classification = canonicalClassification('source-27c', 'gm-27c');
        const artifact = roomCheckpointExport.buildArtifact('source-27c', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        expect(written.ok).to.equal(true);

        const authorityService = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-instance',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await authorityService.acquire('scratch_27c');
        expect(claim.ok).to.equal(true);
        const result = await roomCheckpointExport.restoreArtifactToScratch({
          artifactPath: written.path,
          scratchRoomId: 'scratch_27c',
          firebaseService: loaded.service,
          authority: claim.token,
          authorityService
        });
        expect(result.ok).to.equal(true);
        expect(result.alreadyVerified).to.equal(false);
        expect(result.revision).to.be.greaterThan(0);
        expect(cas.hasDocument('rooms/scratch_27c')).to.equal(true);
      } finally {
        if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
        else {process.env.ROOM_EXPORT_DIR = previousDir;}
        loaded.restore();
      }
    });

    it('27c: a QUIESCING lifecycle rejects a NEW scratch publication before any write', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-quiesce-'));
      try {
        const classification = canonicalClassification('source-27d', 'gm-27d');
        const artifact = roomCheckpointExport.buildArtifact('source-27d', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        const authorityService = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-instance',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await authorityService.acquire('scratch_27d');
        expect(claim.ok).to.equal(true);
        authorityService.beginQuiesce(claim.token);

        const result = await roomCheckpointExport.restoreArtifactToScratch({
          artifactPath: written.path,
          scratchRoomId: 'scratch_27d',
          firebaseService: loaded.service,
          authority: claim.token,
          authorityService
        });
        expect(result.ok).to.equal(false);
        expect(result.reason).to.contain('room_authority_lost');
        expect(cas.hasDocument('rooms/scratch_27d')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('27d: a FENCED lifecycle rejects scratch publication', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-fenced-'));
      try {
        const classification = canonicalClassification('source-27e', 'gm-27e');
        const artifact = roomCheckpointExport.buildArtifact('source-27e', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        const authorityService = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-instance',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await authorityService.acquire('scratch_27e');
        expect(claim.ok).to.equal(true);
        authorityService.fenceLocal('scratch_27e');

        const result = await roomCheckpointExport.restoreArtifactToScratch({
          artifactPath: written.path,
          scratchRoomId: 'scratch_27e',
          firebaseService: loaded.service,
          authority: claim.token,
          authorityService
        });
        expect(result.ok).to.equal(false);
        expect(result.reason).to.contain('room_authority_lost');
        expect(cas.hasDocument('rooms/scratch_27e')).to.equal(false);
      } finally {
        loaded.restore();
      }
    });

    it('27e: the alreadyVerified receipt cannot succeed without originating authority', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-receipt-'));
      try {
        const classification = canonicalClassification('source-27f', 'gm-27f');
        const artifact = roomCheckpointExport.buildArtifact('source-27f', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        const authorityService = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-instance',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await authorityService.acquire('scratch_27f');
        const first = await roomCheckpointExport.restoreArtifactToScratch({
          artifactPath: written.path,
          scratchRoomId: 'scratch_27f',
          firebaseService: loaded.service,
          authority: claim.token,
          authorityService
        });
        expect(first.ok).to.equal(true);

        const missing = await roomCheckpointExport.restoreArtifactToScratch({
          artifactPath: written.path,
          scratchRoomId: 'scratch_27f',
          firebaseService: loaded.service,
          authority: null,
          authorityService
        });
        expect(missing.ok).to.equal(false);
        expect(missing.reason).to.contain('scratch_authority_lost');
      } finally {
        loaded.restore();
      }
    });

    it('27f: a takeover during checkpoint verification rejects a stale success', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-takeover-'));
      try {
        const classification = canonicalClassification('source-27g', 'gm-27g');
        const artifact = roomCheckpointExport.buildArtifact('source-27g', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        const authorityService = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-instance',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await authorityService.acquire('scratch_27g');

        // The verification read is the second scratch read; fence the
        // originating lifecycle during it.
        const originalRead = loaded.service.readRoomCheckpoint;
        let reads = 0;
        loaded.service.readRoomCheckpoint = async(roomId, options) => {
          reads += 1;
          if (reads === 2) {authorityService.fenceLocal('scratch_27g');}
          return originalRead(roomId, options);
        };
        try {
          const result = await roomCheckpointExport.restoreArtifactToScratch({
            artifactPath: written.path,
            scratchRoomId: 'scratch_27g',
            firebaseService: loaded.service,
            authority: claim.token,
            authorityService
          });
          expect(result.ok).to.equal(false);
          expect(result.reason).to.contain('scratch_authority_lost');
        } finally {
          loaded.service.readRoomCheckpoint = originalRead;
        }
      } finally {
        loaded.restore();
      }
    });

    it('28: pure listings and entitled reads do not acquire room authority', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, uid));
        const acquireSpy = sinon.spy(server.authorityService, 'acquire');

        const listing = await emitAck(client, 'request_my_rooms', {});
        expect(listing.success).to.equal(true);
        const checkpoint = await emitAck(client, 'request_room_checkpoint', { roomId: 'cloud-room' });
        expect(checkpoint.success).to.equal(true);
        expect(acquireSpy.called).to.equal(false);
      } finally {
        await server.stop();
      }
    });
  });

  describe('transactional test backend fidelity', () => {
    it('32: create/update existence, merge, query reads and zero-write aborts', async() => {
      const cas = makeCasFakeDb();
      cas.setDocument('rooms/f/gameState/current', { keep: 1 });
      const rootRef = cas.db.collection('rooms').doc('f');

      // create over an existing document fails with ZERO writes.
      let err = null;
      const b1 = cas.db.batch();
      b1.set(rootRef.collection('gameState').doc('added'), { first: 1 });
      b1.create(rootRef.collection('gameState').doc('current'), { nope: 1 });
      try {await b1.commit();} catch (error) {err = error;}
      expect(err && err.code).to.equal('already-exists');
      expect(cas.hasDocument('rooms/f/gameState/added')).to.equal(false);

      // update of a missing document fails with ZERO writes.
      const b2 = cas.db.batch();
      b2.set(rootRef.collection('gameState').doc('newdoc'), { ok: 1 });
      b2.update(rootRef.collection('gameState').doc('missing'), { x: 1 });
      err = null;
      try {await b2.commit();} catch (error) {err = error;}
      expect(err && err.code).to.equal('not-found');
      expect(cas.hasDocument('rooms/f/gameState/newdoc')).to.equal(false);

      // set with merge keeps existing keys.
      await rootRef.collection('gameState').doc('current').set({ added: 2 }, { merge: true });
      expect(cas.getDocument('rooms/f/gameState/current')).to.deep.equal({ keep: 1, added: 2 });

      // query reflects stored documents instead of an empty collection.
      const snap = await rootRef.collection('gameState').get();
      expect(snap.docs.map((doc) => doc.id)).to.deep.equal(['current']);

      // transaction read-set conflict aborts, retries with a fresh read-set and
      // leaves zero writes from the aborted attempt.
      let attempts = 0;
      cas.setTransactionCommitHook(async() => {
        attempts += 1;
        if (attempts === 1) {
          cas.setDocument('rooms/f/gameState/current', { keep: 1, added: 3 });
        }
      });
      const result = await cas.db.runTransaction(async(tx) => {
        const docSnap = await tx.get(rootRef.collection('gameState').doc('current'));
        tx.update(rootRef.collection('gameState').doc('current'), { txSaw: docSnap.exists });
        return 'done';
      });
      expect(result).to.equal('done');
      expect(attempts).to.equal(2);
      expect(cas.getDocument('rooms/f/gameState/current').txSaw).to.equal(true);

      // Read values never alias the stored document.
      const readSnap = await rootRef.collection('gameState').doc('current').get();
      const readData = readSnap.data();
      readData.keep = 999;
      expect(cas.getDocument('rooms/f/gameState/current').keep).to.equal(1);
    });

    it('32b: fake fidelity — deep merge, direct-children queries, duplicate create, retry, aliases', async() => {
      const cas = makeCasFakeDb();
      cas.setDocument('rooms/g', { nested: { a: 1, b: 2 }, keep: true });
      const rootRef = cas.db.collection('rooms').doc('g');

      // Deep merge preserves nested siblings.
      await rootRef.set({ nested: { b: 3 } }, { merge: true });
      expect(cas.getDocument('rooms/g').nested).to.deep.equal({ a: 1, b: 3 });
      expect(cas.getDocument('rooms/g').keep).to.equal(true);

      // Collection query returns direct children only (never descendants).
      cas.setDocument('rooms/g/gameState/current', { v: 1 });
      cas.setDocument('rooms/g/gameState/nested/deep', { v: 2 });
      const snap = await rootRef.collection('gameState').get();
      expect(snap.docs.map((doc) => doc.id)).to.deep.equal(['current']);

      // Filters and limit are honored.
      cas.setDocument('rooms/one', { tag: 'x' });
      cas.setDocument('rooms/two', { tag: 'y' });
      const filtered = await cas.db.collection('rooms').where('tag', '==', 'x').get();
      expect(filtered.docs.map((doc) => doc.id)).to.deep.equal(['one']);
      const limited = await cas.db.collection('rooms').limit(1).get();
      expect(limited.docs.length).to.equal(1);

      // Duplicate creates in ONE batch fail the whole batch with zero writes.
      const batch = cas.db.batch();
      batch.create(cas.db.collection('rooms').doc('dup'), { a: 1 });
      batch.create(cas.db.collection('rooms').doc('dup'), { a: 2 });
      let err = null;
      try {await batch.commit();} catch (error) {err = error;}
      expect(err && err.code).to.equal('already-exists');
      expect(cas.hasDocument('rooms/dup')).to.equal(false);

      // Injected contention is retried inside the retry machinery.
      let attempts = 0;
      cas.setTransactionContention(1);
      const exists = await cas.db.runTransaction(async(tx) => {
        attempts += 1;
        const docSnap = await tx.get(cas.db.collection('rooms').doc('g'));
        return docSnap.exists;
      });
      expect(exists).to.equal(true);
      expect(attempts).to.equal(1);
      expect(cas.getLastTransactionAttempts()).to.equal(2);

      // Transaction readTime is coherent and finite per attempt.
      const txReadTime = await cas.db.runTransaction(async(tx) => {
        const docSnap = await tx.get(cas.db.collection('rooms').doc('g'));
        return docSnap.readTime.toMillis();
      });
      expect(Number.isFinite(txReadTime)).to.equal(true);

      // Stored values never alias the caller.
      const external = { nested: { a: 9 } };
      cas.setDocument('rooms/g2', external);
      external.nested.a = 1000;
      expect(cas.getDocument('rooms/g2').nested.a).to.equal(9);
      const fetched = cas.getDocument('rooms/g2');
      fetched.nested.a = 777;
      expect(cas.getDocument('rooms/g2').nested.a).to.equal(9);
    });
  });

  describe('C1-C6 final bounded corrections', () => {
    // C3: durable compensation boundary used by the decisive regressions. The
    // store outlives a server/runtime restart (simulated by a second server).
    // `install()` must run AFTER each production-stack creation because the
    // fixture replaces these boundary functions with its own defaults.
    const createDurableCompensationStore = () => {
      const store = new Map();
      let idCounter = 0;
      const install = () => {
        firebaseService.listMembershipCompensations = async(roomId) => Array.from(store.values())
          .filter((entry) => !roomId || entry.roomId === roomId)
          .map((entry) => ({ ...entry }));
        firebaseService.recordMembershipCompensation = async(roomId, userId, details = {}) => {
          const key = `${roomId}\u0000${userId}`;
          const existing = store.get(key);
          idCounter += 1;
          const compensationId = `comp-${idCounter}`;
          store.set(key, {
            roomId,
            userId,
            compensationId,
            reason: details.reason || 'membership_rollback_failed',
            attempts: (existing ? existing.attempts : 0) + 1
          });
          return { ok: true, compensationId };
        };
        firebaseService.clearMembershipCompensation = async(roomId, userId, options = {}) => {
          if (!options.compensationId) {
            return { ok: false, code: 'compensation_identity_missing', cleared: false };
          }
          const key = `${roomId}\u0000${userId}`;
          const current = store.get(key);
          if (!current) {return { ok: true, cleared: false };}
          if (current.compensationId !== options.compensationId) {
            return { ok: false, code: 'compensation_replaced', cleared: false };
          }
          store.delete(key);
          return { ok: true, cleared: true };
        };
      };
      return { store, install };
    };

    it('C1: a socket binding change during the authority await cannot mutate the replacement room', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);

        const roomA = await server.seedRoom(gm.id, { name: 'Room A', gmName: 'GM', gmUserId: gmUid });
        roomA.gameState.weather = { condition: 'clear' };

        const queueSpy = sinon.spy(server.firebaseBatchWriter, 'queueWrite');
        const originalAssert = server.authorityService.assertCurrent.bind(server.authorityService);
        let releaseGate = null;
        const gate = new Promise((resolve) => { releaseGate = resolve; });
        let enteredResolve = null;
        const entered = new Promise((resolve) => { enteredResolve = resolve; });
        let calls = 0;
        sinon.stub(server.authorityService, 'assertCurrent').callsFake(async(token, options) => {
          calls += 1;
          if (calls === 1) {
            enteredResolve();
            await gate;
          }
          return originalAssert(token, options);
        });

        const errorPromise = once(gm, 'room_error');
        gm.emit('weather_update', { condition: 'storm' });
        await entered;

        // While A's fresh backend check is paused, the same socket is rebound
        // to a different room.
        const roomB = await server.seedRoom(gm.id, { name: 'Room B', gmName: 'GM', gmUserId: gmUid });
        expect(server.players.get(gm.id).roomId).to.equal(roomB.id);

        releaseGate();
        const error = await errorPromise;
        expect(error.code).to.equal('room_binding_changed');

        // NO mutation to A (validated but stale) or B (the new binding), no
        // broadcast and no checkpoint enqueue.
        expect(roomA.gameState.weather).to.deep.equal({ condition: 'clear' });
        expect(roomB.gameState.weather).to.equal(undefined);
        expect(queueSpy.called).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('C2: a claim loss during reconstruction installs no runtime, player, channel or enqueue', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);

        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, gmUid));
        const queueSpy = sinon.spy(server.firebaseBatchWriter, 'queueWrite');

        const originalAssert = server.authorityService.assertCurrent.bind(server.authorityService);
        let releaseGate = null;
        const gate = new Promise((resolve) => { releaseGate = resolve; });
        let enteredResolve = null;
        const entered = new Promise((resolve) => { enteredResolve = resolve; });
        sinon.stub(server.authorityService, 'assertCurrent').callsFake(async(token, options) => {
          enteredResolve();
          await gate;
          return originalAssert(token, options);
        });

        const errorPromise = once(gm, 'room_error');
        gm.emit('create_room', { gmName: 'GM', persistentRoomId: 'recon-c2', roomName: 'Recon' });
        await entered;

        // The candidate has been constructed; authority is lost before the
        // final exact-claim acceptance.
        server.authorityService.fenceLocal('recon-c2', 'room_authority_lost');
        releaseGate();

        const error = await errorPromise;
        expect(error.code).to.equal('room_authority_lost');

        // No operation-owned installation effect survives.
        expect(server.rooms.has('recon-c2')).to.equal(false);
        expect(server.players.has(gm.id)).to.equal(false);
        const gmSocket = server.io.sockets.sockets.get(gm.id);
        expect(gmSocket.rooms.has('recon-c2')).to.equal(false);
        expect(queueSpy.calledWith('recon-c2')).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('C3a: a failed rollback survives a restart and is retried by the current holder', async() => {
      const durable = createDurableCompensationStore();
      const roomId = 'c3-durable-room';
      let server1 = null;
      let server2 = null;
      try {
        // Phase 1: durable grant, invitation abort, failed compensating revoke.
        server1 = createProductionStackServer();
        await server1.start();
        durable.install();
        const gmUid = server1.nextUserId('gm');
        server1.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server1.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server1.seedRoom(gm.id, {
          name: 'C3', gmName: 'GM', gmUserId: gmUid, members: [gmUid], persistentRoomId: roomId
        });
        room.isPermanent = true;
        const playerUid = server1.nextUserId('player');
        server1.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server1.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const invitation = {
          id: 'c3-inv', kind: 'room', version: 1, roomId,
          fromUserId: gmUid, toUserId: playerUid, status: 'pending', expiresAt: Date.now() + 60000
        };
        server1.partyInvitations.set(invitation.id, invitation);

        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async() => {
          invitation.expiresAt = Date.now() - 1;
          await wait(10);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async() => ({ ok: false, reason: 'unavailable' });
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('membership_compensation_required');
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }

        const key = `${roomId}\u0000${playerUid}`;
        expect(durable.store.has(key)).to.equal(true);
        await server1.stop();
        server1 = null;

        // Phase 2: a NEW process/runtime discovers the obligation from the
        // durable store. The current holder retries and reconciles both the
        // durable membership and the live room.members cache.
        server2 = createProductionStackServer();
        await server2.start();
        durable.install();
        const gm2Uid = server2.nextUserId('gm');
        server2.registerAuthToken(`tok-${gm2Uid}`, gm2Uid);
        const gm2 = server2.connect({ token: `tok-${gm2Uid}` });
        await connected(gm2);
        const room2 = await server2.seedRoom(gm2.id, {
          name: 'C3', gmName: 'GM', gmUserId: gm2Uid,
          members: [gm2Uid, playerUid], persistentRoomId: roomId
        });
        room2.isPermanent = true;

        const removeCalls = [];
        const originalRemove2 = firebaseService.removeRoomMember;
        firebaseService.removeRoomMember = async(rid, uid, options = {}) => {
          removeCalls.push({ rid, uid, hasAuthority: !!options.authority });
          return { ok: true };
        };
        try {
          const retry = await roomAccess.retryMembershipCompensations(
            firebaseService, server2.authorityService, roomId, server2.rooms
          );
          expect(retry.cleared).to.equal(1);
        } finally {
          firebaseService.removeRoomMember = originalRemove2;
        }
        expect(removeCalls.length).to.equal(1);
        expect(removeCalls[0]).to.deep.equal({ rid: roomId, uid: playerUid, hasAuthority: true });
        expect(durable.store.has(key)).to.equal(false);
        expect(room2.members).to.deep.equal([gm2Uid]);
        expect(room2.accessGeneration).to.be.greaterThan(0);

        // Future admission performs the durable regrant instead of skipping it
        // because of stale local membership.
        const addCalls = [];
        const originalAdd2 = firebaseService.addRoomMember;
        firebaseService.addRoomMember = async(rid, uid) => {
          addCalls.push(uid);
          return { ok: true };
        };
        try {
          const admission = await roomAccess.admitVerifiedMember({
            socket: fakeSocket(playerUid, 'c3-socket-2'),
            rooms: new Map([[room2.id, room2]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room: room2,
            userId: playerUid,
            playerName: playerUid,
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            authorityService: server2.authorityService
          });
          expect(admission.ok).to.equal(true);
        } finally {
          firebaseService.addRoomMember = originalAdd2;
        }
        expect(addCalls).to.deep.equal([playerUid]);
      } finally {
        if (server1) {await server1.stop();}
        if (server2) {await server2.stop();}
      }
    });

    it('C3b: a compensation backlog refuses new admission instead of evicting unresolved obligations', async() => {
      const durable = createDurableCompensationStore();
      process.env.MEMBERSHIP_COMPENSATION_LIMIT = '1';
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, {
          name: 'C3 backlog', gmName: 'GM', gmUserId: gmUid, members: [gmUid], persistentRoomId: 'c3-cap-room'
        });
        room.isPermanent = true;
        durable.store.set('c3-cap-room\u0000existing-user', {
          roomId: 'c3-cap-room', userId: 'existing-user', reason: 'postgrant_abort', attempts: 1
        });

        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.removeRoomMember = async() => ({ ok: false, reason: 'unavailable' });
        let result;
        try {
          result = await roomAccess.admitVerifiedMember({
            socket: fakeSocket('new-user', 'c3-cap-socket'),
            rooms: new Map([[room.id, room]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room,
            userId: 'new-user',
            playerName: 'new-user',
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            authorityService: server.authorityService
          });
        } finally {
          firebaseService.removeRoomMember = originalRemove;
        }
        expect(result.ok).to.equal(false);
        expect(result.code).to.equal('membership_compensation_required');
        // The unresolved obligation was NOT silently evicted.
        expect(durable.store.has('c3-cap-room\u0000existing-user')).to.equal(true);
      } finally {
        delete process.env.MEMBERSHIP_COMPENSATION_LIMIT;
        await server.stop();
      }
    });

    it('C3c: pre-existing membership never creates a revoke or compensation obligation', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const existingUid = server.nextUserId('member');
        const room = await server.seedRoom(gm.id, {
          name: 'C3 pre-existing', gmName: 'GM', gmUserId: gmUid,
          members: [gmUid, existingUid], persistentRoomId: 'c3-preexisting-room'
        });
        room.isPermanent = true;

        let removeCalls = 0;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.removeRoomMember = async() => {
          removeCalls += 1;
          return { ok: true };
        };
        let checks = 0;
        let result;
        try {
          result = await roomAccess.admitVerifiedMember({
            socket: fakeSocket(existingUid, 'c3-existing-socket'),
            rooms: new Map([[room.id, room]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room,
            userId: existingUid,
            playerName: existingUid,
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            authorityService: server.authorityService,
            validateBeforeSideEffects: () => {
              checks += 1;
              return checks >= 2 ? { ok: false, code: 'invitation_invalid' } : { ok: true };
            }
          });
        } finally {
          firebaseService.removeRoomMember = originalRemove;
        }
        expect(result.ok).to.equal(false);
        expect(result.code).to.equal('invitation_invalid');
        expect(removeCalls).to.equal(0);
        expect(durable.store.size).to.equal(0);
      } finally {
        await server.stop();
      }
    });

    it('C5a: account metadata release loss reports durable-but-authority-lost, never current success', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, uid));
        const writeStub = sinon.stub(firebaseService, 'updateRoomGameState').resolves({ outcome: 'confirmed', revision: 6 });
        sinon.stub(server.authorityService, 'release').resolves({ ok: false, code: 'room_authority_lost', released: false });
        let broadcasts = 0;
        client.on('room_metadata_updated', () => { broadcasts += 1; });

        const response = await emitAck(client, 'update_room_metadata', { roomId: 'cloud-c5a', name: 'Renamed' });
        expect(writeStub.called).to.equal(true);
        expect(response.success).to.equal(false);
        expect(response.outcome).to.equal('authority_lost');
        expect(response.durable).to.equal(true);
        expect(broadcasts).to.equal(0);
      } finally {
        await server.stop();
      }
    });

    it('C5b: draft release loss reports durable-but-authority-lost, never live creation success', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const uid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${uid}`, uid);
        const client = server.connect({ token: `tok-${uid}` });
        await connected(client);

        // External account boundary: tier lookup fails closed without network.
        const admin = require('firebase-admin');
        const hadApp = admin.apps.length > 0;
        const appOptions = hadApp ? admin.app().options : null;
        if (hadApp) {await admin.app().delete();}
        sinon.stub(server.authorityService, 'release').resolves({ ok: false, code: 'room_authority_lost', released: false });
        let response;
        try {
          response = await emitAck(client, 'create_room_draft', { roomId: 'draft-c5b', name: 'Draft' });
        } finally {
          if (hadApp && admin.apps.length === 0) {admin.initializeApp(appOptions);}
        }
        expect(response.success).to.equal(false);
        expect(response.outcome).to.equal('authority_lost');
        expect(response.durable).to.equal(true);
        expect(response.roomId).to.equal('draft-c5b');
      } finally {
        await server.stop();
      }
    });

    it('C5c: CLI restore never prints clean success when release loses authority after a durable commit', async() => {
      const fs = require('fs');
      const os = require('os');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p4-c5cli-'));
      try {
        const classification = canonicalClassification('source-c5c', 'gm-c5c');
        const artifact = roomCheckpointExport.buildArtifact('source-c5c', classification);
        const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
        expect(written.ok).to.equal(true);

        const service = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'cli-c5c',
          now,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        sinon.stub(roomAuthority, 'createRoomAuthorityService').returns(service);
        sinon.stub(service, 'release').resolves({ ok: false, code: 'room_authority_lost', released: false });
        const writeSpy = sinon.stub(process.stdout, 'write');
        const previousExitCode = process.exitCode;
        try {
          await roomCheckpointExport.runCli(['restore', written.path, 'scratch_c5c']);
        } finally {
          process.exitCode = previousExitCode;
        }
        const lines = writeSpy.getCalls()
          .map((call) => String(call.args[0] || ''))
          .join('')
          .trim()
          .split(/\r?\n/)
          .filter(Boolean);
        const parsed = JSON.parse(lines[lines.length - 1]);
        expect(parsed.ok).to.equal(false);
        expect(parsed.durable).to.equal(true);
        expect(parsed.reason).to.contain('scratch_authority_lost_during_release');
        // The durable publication did commit before the release loss.
        expect(cas.hasDocument('rooms/scratch_c5c')).to.equal(true);
      } finally {
        loaded.restore();
      }
    });

    it('C6: a movement flush cannot schedule a successor save after the runtime is replaced', async() => {
      const tokenA = tokenFor('move-c6', 'instance-A', 1);
      const tokenB = tokenFor('move-c6', 'instance-B', 2);
      const roomA = {
        id: 'move-c6',
        authorityToken: tokenA,
        gameState: {
          defaultMapId: 'default',
          tokens: {
            t1: { id: 't1', position: { x: 0, y: 0 } },
            t2: { id: 't2', position: { x: 0, y: 0 } }
          },
          maps: { default: { id: 'default', tokens: {} } }
        }
      };
      const roomB = {
        id: 'move-c6',
        authorityToken: tokenB,
        gameState: {
          defaultMapId: 'default',
          tokens: {
            t2: { id: 't2', position: { x: 99, y: 99 } }
          },
          maps: { default: { id: 'default', tokens: {} } }
        }
      };
      const rooms = new Map([[roomA.id, roomA]]);
      const players = new Map([['sock-1', { id: 'sock-1', roomId: roomA.id }]]);
      const emitted = [];
      const io = { to: (roomId) => ({ emit: (event, payload) => emitted.push({ roomId, event, payload }) }) };
      const queued = [];
      const writer = {
        queueWrite: (roomId, gameState, isCritical, options) => {
          queued.push({ roomId, gameState, isCritical, options });
          return 1;
        }
      };

      let releaseGate = null;
      const gate = new Promise((resolve) => { releaseGate = resolve; });
      let enteredResolve = null;
      const entered = new Promise((resolve) => { enteredResolve = resolve; });
      let checks = 0;
      const debouncer = new MovementDebouncer(60000, writer, {
        authoritySettleValid: async() => {
          checks += 1;
          if (checks === 2) {
            enteredResolve();
            await gate;
          }
          return true;
        }
      });
      try {
        debouncer.queueMove(roomA.id, 't1', { position: { x: 5, y: 5 }, playerId: 'sock-1', mapId: 'default' }, tokenA);
        debouncer.queueMove(roomA.id, 't2', { position: { x: 6, y: 6 }, playerId: 'sock-1', mapId: 'default' }, tokenA);

        const flushPromise = debouncer.flush(io, rooms, players);
        await entered;

        // A retires while M2's authority check is in flight; B installs a
        // successor runtime at the same room id. The old flush then resumes
        // with a stale (worst-case) validation success.
        rooms.set(roomA.id, roomB);
        releaseGate();
        await flushPromise;

        // The old flush never enqueues a successor save and never confirms or
        // rebinds to the replacement generation.
        expect(queued.length).to.equal(0);
        // B's runtime is untouched by A's predecessor work.
        expect(roomB.gameState.tokens.t2.position).to.deep.equal({ x: 99, y: 99 });
        // A's own runtime received only M1 (validated before the replacement);
        // M2 is dropped by the post-await binding check.
        expect(roomA.gameState.tokens.t1.position).to.deep.equal({ x: 5, y: 5 });
        expect(roomA.gameState.tokens.t2.position).to.deep.equal({ x: 0, y: 0 });
        expect(emitted.filter((entry) => entry.event === 'token_moved').length).to.equal(1);
      } finally {
        debouncer.stop();
      }
    });

    it('C1 movement: a player binding change during the authority await drops the old move', async() => {
      const tokenA = tokenFor('move-c1', 'instance-A', 1);
      const roomA = {
        id: 'move-c1',
        authorityToken: tokenA,
        gameState: {
          defaultMapId: 'default',
          tokens: { t1: { id: 't1', position: { x: 0, y: 0 } } },
          maps: { default: { id: 'default', tokens: {} } }
        }
      };
      const playerA = { id: 'p1', roomId: 'move-c1' };
      const playerB = { id: 'p2', roomId: 'other-room' };
      const rooms = new Map([[roomA.id, roomA]]);
      const players = new Map([['sock-1', playerA]]);
      const emitted = [];
      const io = { to: (roomId) => ({ emit: (event, payload) => emitted.push({ roomId, event, payload }) }) };
      const queued = [];
      const writer = { queueWrite: (roomId, gameState, critical, options) => { queued.push({ roomId, options }); return 1; } };

      let releaseGate = null;
      const gate = new Promise((resolve) => { releaseGate = resolve; });
      let enteredResolve = null;
      const entered = new Promise((resolve) => { enteredResolve = resolve; });
      const debouncer = new MovementDebouncer(60000, writer, {
        authoritySettleValid: async() => {
          enteredResolve();
          await gate;
          return true;
        }
      });
      try {
        debouncer.queueMove(roomA.id, 't1', { position: { x: 7, y: 7 }, playerId: 'sock-1', mapId: 'default' }, tokenA);
        const flushPromise = debouncer.flush(io, rooms, players);
        await entered;

        // The player binding is replaced while A authority remains valid.
        players.set('sock-1', playerB);
        releaseGate();
        await flushPromise;

        expect(roomA.gameState.tokens.t1.position).to.deep.equal({ x: 0, y: 0 });
        expect(emitted.length).to.equal(0);
        expect(queued.length).to.equal(0);
      } finally {
        debouncer.stop();
      }
    });

    it('C1 inventory: a player binding change during the handler authority await blocks the consent effect', async() => {
      const server = createProductionStackServer();
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(gm);
        await connected(player);

        const roomA = await server.seedRoom(gm.id, {
          name: 'C1 Inv A', gmName: 'GM', gmUserId: gmUid, members: [gmUid, playerUid]
        });
        const playerRecord = {
          id: 'pl-c1', socketId: player.id, roomId: roomA.id,
          userId: playerUid, isGM: false, name: 'Player', currentMapId: 'default'
        };
        roomA.players.set(playerRecord.id, playerRecord);
        server.players.set(player.id, playerRecord);
        server.io.sockets.sockets.get(player.id).join(roomA.id);
        server.setCharacterOwner('hero-c1', playerUid);

        // Pause the HANDLER's fresh authority await (the wrapper check is first).
        const originalAssert = server.authorityService.assertCurrent.bind(server.authorityService);
        let releaseGate = null;
        const gate = new Promise((resolve) => { releaseGate = resolve; });
        let enteredResolve = null;
        const entered = new Promise((resolve) => { enteredResolve = resolve; });
        let calls = 0;
        sinon.stub(server.authorityService, 'assertCurrent').callsFake(async(token, options) => {
          calls += 1;
          if (calls === 2) {
            enteredResolve();
            await gate;
          }
          return originalAssert(token, options);
        });

        const ackPromise = emitAck(player, 'inventory_share_grant', { roomId: roomA.id, characterId: 'hero-c1' });
        await entered;

        // Rebind the player socket to a different room while A stays valid.
        const roomB = await server.seedRoom(player.id, {
          name: 'C1 Inv B', gmName: 'Player', gmUserId: playerUid
        });
        expect(server.players.get(player.id).roomId).to.equal(roomB.id);

        releaseGate();
        const ack = await ackPromise;
        expect(ack.success).to.equal(false);
        expect(ack.code).to.equal('room_authority_lost');
        // No consent effect in either runtime.
        expect(roomA.inventoryShares).to.equal(undefined);
        expect(roomB.inventoryShares).to.equal(undefined);
      } finally {
        await server.stop();
      }
    });

    it('C2 fallback: missing two-phase hooks fail closed before any install', async() => {
      const server = createProductionStackServer({ omitReconstructionHooks: true });
      try {
        await server.start();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);

        sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => canonicalClassification(roomId, gmUid));
        const queueSpy = sinon.spy(server.firebaseBatchWriter, 'queueWrite');

        const errorPromise = once(gm, 'room_error');
        gm.emit('create_room', { gmName: 'GM', persistentRoomId: 'recon-c2-fallback', roomName: 'Recon' });
        const error = await errorPromise;
        expect(error.code).to.equal('room_unavailable');

        expect(server.rooms.has('recon-c2-fallback')).to.equal(false);
        expect(server.players.has(gm.id)).to.equal(false);
        expect(server.io.sockets.sockets.get(gm.id).rooms.has('recon-c2-fallback')).to.equal(false);
        expect(queueSpy.calledWith('recon-c2-fallback')).to.equal(false);
      } finally {
        await server.stop();
      }
    });

    it('C3-A: a failed compensation journal write is a distinct severe outcome and blocks unsafe admission', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        // Journal persistence fails: the obligation exists only in memory.
        firebaseService.recordMembershipCompensation = async() => ({ ok: false, reason: 'unavailable' });

        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, {
          name: 'C3A', gmName: 'GM', gmUserId: gmUid, members: [gmUid], persistentRoomId: 'c3a-room'
        });
        room.isPermanent = true;
        const playerUid = server.nextUserId('player');
        server.registerAuthToken(`tok-${playerUid}`, playerUid);
        const player = server.connect({ token: `tok-${playerUid}` });
        await connected(player);
        const invitation = {
          id: 'c3a-inv', kind: 'room', version: 1, roomId: 'c3a-room',
          fromUserId: gmUid, toUserId: playerUid, status: 'pending', expiresAt: Date.now() + 60000
        };
        server.partyInvitations.set(invitation.id, invitation);

        const originalAdd = firebaseService.addRoomMember;
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.addRoomMember = async() => {
          invitation.expiresAt = Date.now() - 1;
          await wait(10);
          return { ok: true };
        };
        firebaseService.removeRoomMember = async() => ({ ok: false, reason: 'unavailable' });
        try {
          const errorPromise = once(player, 'join_error');
          player.emit('respond_to_room_invitation', { invitationId: invitation.id, accepted: true });
          const error = await errorPromise;
          expect(error.code).to.equal('membership_compensation_persistence_failed');
        } finally {
          firebaseService.addRoomMember = originalAdd;
          firebaseService.removeRoomMember = originalRemove;
        }
        expect(room.players.size).to.equal(0);
        expect(server.players.has(player.id)).to.equal(false);
        // The durable store never received an obligation; the in-memory mirror
        // blocks the unsafe subsequent admission for this room.
        expect(durable.store.size).to.equal(0);
        const retry = await roomAccess.admitVerifiedMember({
          socket: fakeSocket(playerUid, 'c3a-socket'),
          rooms: new Map([[room.id, room]]),
          players: new Map(),
          firebaseService,
          uuidv4: nextPlayerId,
          room,
          userId: playerUid,
          playerName: playerUid,
          playerColor: '#ffffff',
          character: null,
          sanitizePlayerName: (name) => name,
          authorityService: server.authorityService
        });
        expect(retry.ok).to.equal(false);
        expect(retry.code).to.equal('membership_compensation_required');
      } finally {
        await server.stop();
      }
    });

    it('C3-B: compensation discovery failure fails closed instead of meaning "no obligations"', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        firebaseService.listMembershipCompensations = async() => { throw new Error('backend down'); };

        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, {
          name: 'C3B', gmName: 'GM', gmUserId: gmUid, members: [gmUid], persistentRoomId: 'c3b-room'
        });
        room.isPermanent = true;

        const addCalls = [];
        const originalAdd = firebaseService.addRoomMember;
        firebaseService.addRoomMember = async(rid, uid) => { addCalls.push(uid); return { ok: true }; };
        let result;
        try {
          result = await roomAccess.admitVerifiedMember({
            socket: fakeSocket('c3b-user', 'c3b-socket'),
            rooms: new Map([[room.id, room]]),
            players: new Map(),
            firebaseService,
            uuidv4: nextPlayerId,
            room,
            userId: 'c3b-user',
            playerName: 'c3b-user',
            playerColor: '#ffffff',
            character: null,
            sanitizePlayerName: (name) => name,
            authorityService: server.authorityService
          });
        } finally {
          firebaseService.addRoomMember = originalAdd;
        }
        expect(result.ok).to.equal(false);
        expect(result.code).to.equal('membership_compensation_unavailable');
        expect(addCalls.length).to.equal(0);
      } finally {
        await server.stop();
      }
    });

    it('C3-C: a failed compensation clear retains the obligation and is not counted as cleared', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, {
          name: 'C3C', gmName: 'GM', gmUserId: gmUid, members: [gmUid, 'c3c-user'], persistentRoomId: 'c3c-room'
        });
        room.isPermanent = true;
        const key = 'c3c-room\u0000c3c-user';
        durable.store.set(key, {
          roomId: 'c3c-room', userId: 'c3c-user', compensationId: 'v1', reason: 'postgrant_abort', attempts: 1
        });

        const originalRemove = firebaseService.removeRoomMember;
        const originalClear = firebaseService.clearMembershipCompensation;
        firebaseService.removeRoomMember = async() => ({ ok: true });
        firebaseService.clearMembershipCompensation = async() => ({ ok: false, reason: 'unavailable' });
        let retry;
        try {
          retry = await roomAccess.retryMembershipCompensations(
            firebaseService, server.authorityService, 'c3c-room', server.rooms
          );
        } finally {
          firebaseService.removeRoomMember = originalRemove;
          firebaseService.clearMembershipCompensation = originalClear;
        }
        expect(retry.ok).to.equal(true);
        expect(retry.cleared).to.equal(0);
        expect(durable.store.has(key)).to.equal(true);
        expect(roomAccess.getMembershipCompensationStats().pending).to.be.greaterThan(0);
        // The durable membership was corrected even though the journal remains.
        expect(room.members).to.deep.equal([gmUid]);
      } finally {
        await server.stop();
      }
    });

    it('C3-D: a stale retry cannot clear a newer obligation at the same key', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const room = await server.seedRoom(gm.id, {
          name: 'C3D', gmName: 'GM', gmUserId: gmUid, members: [gmUid], persistentRoomId: 'c3d-room'
        });
        room.isPermanent = true;
        const key = 'c3d-room\u0000c3d-user';
        durable.store.set(key, {
          roomId: 'c3d-room', userId: 'c3d-user', compensationId: 'v1', reason: 'postgrant_abort', attempts: 1
        });

        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.removeRoomMember = async() => {
          // A newer obligation replaces V1 while the retry awaits removal.
          durable.store.set(key, {
            roomId: 'c3d-room', userId: 'c3d-user', compensationId: 'v2', reason: 'postgrant_abort', attempts: 1
          });
          return { ok: true };
        };
        let retry;
        try {
          retry = await roomAccess.retryMembershipCompensations(
            firebaseService, server.authorityService, 'c3d-room', server.rooms
          );
        } finally {
          firebaseService.removeRoomMember = originalRemove;
        }
        expect(retry.ok).to.equal(true);
        expect(retry.cleared).to.equal(0);
        expect(durable.store.get(key).compensationId).to.equal('v2');
      } finally {
        await server.stop();
      }
    });

    it('C3-E: a runtime replacement during retry is never reconciled through the stale continuation', async() => {
      const durable = createDurableCompensationStore();
      const server = createProductionStackServer();
      try {
        await server.start();
        durable.install();
        const gmUid = server.nextUserId('gm');
        server.registerAuthToken(`tok-${gmUid}`, gmUid);
        const gm = server.connect({ token: `tok-${gmUid}` });
        await connected(gm);
        const roomA = await server.seedRoom(gm.id, {
          name: 'C3E', gmName: 'GM', gmUserId: gmUid, members: [gmUid, 'c3e-user'], persistentRoomId: 'c3e-room'
        });
        roomA.isPermanent = true;
        const key = 'c3e-room\u0000c3e-user';
        durable.store.set(key, {
          roomId: 'c3e-room', userId: 'c3e-user', compensationId: 'v1', reason: 'postgrant_abort', attempts: 1
        });

        const roomB = {
          id: 'c3e-room',
          isPermanent: true,
          authorityToken: roomA.authorityToken,
          members: [gmUid, 'c3e-user'],
          players: new Map(),
          gameState: { defaultMapId: 'default', maps: {}, tokens: {}, characterTokens: {}, gridItems: {} },
          settings: { maxPlayers: 6 }
        };
        const originalRemove = firebaseService.removeRoomMember;
        firebaseService.removeRoomMember = async() => {
          // A successor runtime replaces A while the durable revoke awaits.
          server.rooms.set('c3e-room', roomB);
          return { ok: true };
        };
        let retry;
        try {
          retry = await roomAccess.retryMembershipCompensations(
            firebaseService, server.authorityService, 'c3e-room', server.rooms
          );
        } finally {
          firebaseService.removeRoomMember = originalRemove;
        }
        expect(retry.ok).to.equal(true);
        // The durable truth was corrected and the fulfilled obligation cleared,
        // but the replacement runtime was NOT mutated through the stale A ref.
        expect(durable.store.has(key)).to.equal(false);
        expect(roomB.members).to.deep.equal([gmUid, 'c3e-user']);
      } finally {
        await server.stop();
      }
    });

    it('C1 movement: a queued move whose mover is removed before flush is dropped', async() => {
      const fake = createFakeAuthorityBackend();
      const service = makeService(fake.backend, 'instance-A');
      await service.acquire('move-c1b');
      const tokenA = service.currentToken('move-c1b');

      const roomA = {
        id: 'move-c1b',
        authorityToken: tokenA,
        gameState: {
          defaultMapId: 'default',
          tokens: { t1: { id: 't1', position: { x: 0, y: 0 } } },
          maps: { default: { id: 'default', tokens: {} } }
        }
      };
      const playerA = { id: 'p1', roomId: 'move-c1b', userId: 'u1' };
      const rooms = new Map([[roomA.id, roomA]]);
      const players = new Map([['sock-1', playerA]]);
      const emitted = [];
      const io = { to: (roomId) => ({ emit: (event, payload) => emitted.push({ roomId, event, payload }) }) };
      const queued = [];
      const writer = { queueWrite: (roomId, gameState, critical, options) => { queued.push({ roomId, options }); return 1; } };
      let authorityChecks = 0;
      const debouncer = new MovementDebouncer(60000, writer, {
        authoritySettleValid: async(token) => {
          authorityChecks += 1;
          return (await service.assertSettle(token, { backendCheck: true })).ok;
        }
      });
      try {
        const queuedOk = debouncer.queueMove(
          roomA.id, 't1',
          { position: { x: 9, y: 9 }, playerId: 'sock-1', mapId: 'default' },
          tokenA,
          { playerRef: playerA, userId: 'u1', roomRef: roomA }
        );
        expect(queuedOk).to.equal(true);
        // Equivalent of leave_room removing the mover before flush.
        players.delete('sock-1');

        await debouncer.flush(io, rooms, players);

        expect(roomA.gameState.tokens.t1.position).to.deep.equal({ x: 0, y: 0 });
        expect(emitted.length).to.equal(0);
        expect(queued.length).to.equal(0);
        // The move was dropped because the mover binding was missing, BEFORE
        // the authority await; authority itself was never the failure.
        expect(authorityChecks).to.equal(0);
        expect((await service.assertSettle(tokenA, { backendCheck: true })).ok).to.equal(true);
      } finally {
        debouncer.stop();
      }
    });

    it('C3-1: an unfinished admission recovery intent survives a process restart and is reconciled by the next holder', async() => {
      const crypto = require('crypto');
      const cas = makeCasFakeDb();
      cas.setDocument('rooms/c3r1', { members: [], isActive: true });
      const loadedA = loadFirebaseServiceWithFakeDb(cas.db);
      const clockA = { value: 0 };
      let grant = null;
      try {
        const serviceA = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loadedA.service),
          instanceId: 'instance-A',
          now: () => clockA.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claimA = await serviceA.acquire('c3r1');
        expect(claimA.ok).to.equal(true);
        // Atomic grant + durable pending recovery intent, then "crash" before
        // admission finalization.
        grant = await loadedA.service.addRoomMember('c3r1', 'uid-1', {
          authority: claimA.token, recoveryIntent: true
        });
        expect(grant.ok).to.equal(true);
        expect(grant.compensationId).to.be.a('string');
      } finally {
        loadedA.restore();
      }

      // Durable truth after the crash: membership AND pending recovery intent.
      expect(cas.getDocument('rooms/c3r1').members).to.deep.equal(['uid-1']);
      const docId = crypto.createHash('sha256').update('c3r1\u0000uid-1', 'utf8').digest('hex');
      expect(cas.getDocument(`membershipCompensations/${docId}`).state).to.equal('pending_admission');
      expect(cas.getDocument(`membershipCompensations/${docId}`).compensationId).to.equal(grant.compensationId);

      // Process B: fresh module instance, no shared process memory.
      const loadedB = loadFirebaseServiceWithFakeDb(cas.db);
      const clockB = { value: 0 };
      try {
        cas.setBackendTime(40000); // A's crashed lease has expired
        const serviceB = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loadedB.service),
          instanceId: 'instance-B',
          now: () => clockB.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claimB = await serviceB.acquire('c3r1');
        expect(claimB.ok).to.equal(true);
        const roomB = {
          id: 'c3r1',
          isPermanent: true,
          authorityToken: claimB.token,
          members: ['uid-1'],
          players: new Map(),
          gameState: { defaultMapId: 'default', maps: {}, tokens: {}, characterTokens: {}, gridItems: {} },
          settings: { maxPlayers: 6 }
        };
        serviceB.attachRoom(roomB);

        const listed = await loadedB.service.listMembershipCompensations('c3r1');
        expect(listed.ok).to.equal(true);
        expect(listed.entries.length).to.equal(1);
        expect(listed.entries[0].state).to.equal('pending_admission');

        const retry = await roomAccess.retryMembershipCompensations(
          loadedB.service, serviceB, 'c3r1', new Map([['c3r1', roomB]])
        );
        expect(retry.cleared).to.equal(1);
        expect(cas.getDocument('rooms/c3r1').members).to.deep.equal([]);
        expect(cas.getDocument(`membershipCompensations/${docId}`)).to.equal(undefined);
        expect(roomB.members).to.deep.equal([]);
      } finally {
        loadedB.restore();
      }
    });

    it('C3-2: a failed atomic grant+intent batch commits neither membership nor intent', async() => {
      const crypto = require('crypto');
      const cas = makeCasFakeDb();
      cas.setDocument('rooms/c3r2', { members: [], isActive: true });
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const clock = { value: 0 };
      try {
        const service = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'instance-A',
          now: () => clock.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await service.acquire('c3r2');
        const docId = crypto.createHash('sha256').update('c3r2\u0000uid-2', 'utf8').digest('hex');
        // A record already occupies the deterministic intent key, so the intent
        // portion of the atomic batch fails; the membership update must not
        // commit either.
        cas.setDocument(`membershipCompensations/${docId}`, {
          roomId: 'c3r2', userId: 'uid-2', compensationId: 'stale', state: 'pending_admission'
        });
        const grant = await loaded.service.addRoomMember('c3r2', 'uid-2', {
          authority: claim.token, recoveryIntent: true
        });
        expect(grant.ok).to.equal(false);
        expect(cas.getDocument('rooms/c3r2').members).to.deep.equal([]);
        expect(cas.getDocument(`membershipCompensations/${docId}`).compensationId).to.equal('stale');
      } finally {
        loaded.restore();
      }
    });

    it('C3-3: a legitimate admission clears its pending recovery record only at finalization', async() => {
      const store = { members: ['gm'], compensation: null };
      const fakeFirebase = {
        addRoomMember: async(roomId, uid) => {
          store.members = Array.from(new Set([...store.members, uid]));
          store.compensation = {
            roomId, userId: uid, compensationId: 'comp-final', state: 'pending_admission'
          };
          return { ok: true, compensationId: 'comp-final' };
        },
        removeRoomMember: async(roomId, uid) => {
          store.members = store.members.filter((memberId) => memberId !== uid);
          return { ok: true };
        },
        listMembershipCompensations: async() => ({
          ok: true,
          entries: store.compensation ? [store.compensation] : []
        }),
        clearMembershipCompensation: async(roomId, uid, options = {}) => {
          if (!options.compensationId || !store.compensation ||
            store.compensation.compensationId !== options.compensationId) {
            return { ok: false, code: 'compensation_replaced' };
          }
          store.compensation = null;
          return { ok: true, cleared: true };
        }
      };
      const fake = createFakeAuthorityBackend();
      const service = makeService(fake.backend, 'instance-A');
      await service.acquire('admit-c3');
      const room = fakeRoom({ id: 'admit-c3', gmId: 'gm', members: ['gm'] });
      room.isPermanent = true;
      service.attachRoom(room);

      const result = await roomAccess.admitVerifiedMember({
        socket: fakeSocket('u1', 'admit-s'),
        rooms: new Map([[room.id, room]]),
        players: new Map(),
        firebaseService: fakeFirebase,
        uuidv4: () => 'p1',
        room,
        userId: 'u1',
        playerName: 'u1',
        playerColor: '#ffffff',
        character: null,
        sanitizePlayerName: (name) => name,
        authorityService: service
      });
      expect(result.ok).to.equal(true);
      expect(store.members).to.deep.equal(['gm', 'u1']);
      expect(store.compensation).to.equal(null);
      expect(room.players.has('p1')).to.equal(true);
    });

    it('C3-4: an abort with a failed revoke keeps the durable intent and later idempotent recovery reconciles it', async() => {
      const store = { members: ['gm'], compensation: null };
      let revokeOk = false;
      const fakeFirebase = {
        addRoomMember: async(roomId, uid) => {
          store.members = Array.from(new Set([...store.members, uid]));
          store.compensation = {
            roomId, userId: uid, compensationId: 'comp-abort', state: 'pending_admission'
          };
          return { ok: true, compensationId: 'comp-abort' };
        },
        removeRoomMember: async(roomId, uid) => {
          if (!revokeOk) {return { ok: false, reason: 'unavailable' };}
          store.members = store.members.filter((memberId) => memberId !== uid);
          return { ok: true };
        },
        listMembershipCompensations: async() => ({
          ok: true,
          entries: store.compensation ? [store.compensation] : []
        }),
        clearMembershipCompensation: async(roomId, uid, options = {}) => {
          if (!options.compensationId || !store.compensation ||
            store.compensation.compensationId !== options.compensationId) {
            return { ok: false, code: 'compensation_replaced' };
          }
          store.compensation = null;
          return { ok: true, cleared: true };
        }
      };
      const fake = createFakeAuthorityBackend();
      const service = makeService(fake.backend, 'instance-A');
      await service.acquire('abort-c3');
      const room = fakeRoom({ id: 'abort-c3', gmId: 'gm', members: ['gm'] });
      room.isPermanent = true;
      service.attachRoom(room);

      let checks = 0;
      const result = await roomAccess.admitVerifiedMember({
        socket: fakeSocket('u1', 'abort-s'),
        rooms: new Map([[room.id, room]]),
        players: new Map(),
        firebaseService: fakeFirebase,
        uuidv4: () => 'p1',
        room,
        userId: 'u1',
        playerName: 'u1',
        playerColor: '#ffffff',
        character: null,
        sanitizePlayerName: (name) => name,
        authorityService: service,
        validateBeforeSideEffects: () => {
          checks += 1;
          return checks >= 2 ? { ok: false, code: 'invitation_invalid' } : { ok: true };
        }
      });
      expect(result.ok).to.equal(false);
      expect(result.code).to.equal('membership_compensation_required');
      expect(store.compensation).to.not.equal(null);
      expect(store.members).to.deep.equal(['gm', 'u1']);
      expect(room.players.size).to.equal(0);

      // Current holder retries later; the obligation already exists durably.
      revokeOk = true;
      const retry = await roomAccess.retryMembershipCompensations(
        fakeFirebase, service, room.id, new Map([[room.id, room]])
      );
      expect(retry.cleared).to.equal(1);
      expect(store.compensation).to.equal(null);
      expect(store.members).to.deep.equal(['gm']);
      expect(room.members).to.deep.equal(['gm']);
    });

    it('C3-5: a stale production clear cannot delete a newer obligation written after its read', async() => {
      const crypto = require('crypto');
      const cas = makeCasFakeDb();
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const clock = { value: 0 };
      try {
        const service = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'instance-A',
          now: () => clock.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claim = await service.acquire('c3r5');
        const docId = crypto.createHash('sha256').update('c3r5\u0000uid-5', 'utf8').digest('hex');
        cas.setDocument(`membershipCompensations/${docId}`, {
          roomId: 'c3r5', userId: 'uid-5', compensationId: 'v1', state: 'pending_admission'
        });
        // Replace V1 with V2 after the clear transaction's read but before its
        // commit: the transaction must conflict/retry and refuse.
        cas.setTransactionCommitHook(async({ attempt }) => {
          if (attempt === 1) {
            cas.setDocument(`membershipCompensations/${docId}`, {
              roomId: 'c3r5', userId: 'uid-5', compensationId: 'v2', state: 'pending_admission'
            });
          }
        });
        const stale = await loaded.service.clearMembershipCompensation('c3r5', 'uid-5', {
          compensationId: 'v1', authority: claim.token
        });
        expect(stale.ok).to.equal(false);
        expect(stale.code).to.equal('compensation_replaced');
        expect(cas.getDocument(`membershipCompensations/${docId}`).compensationId).to.equal('v2');

        // A stale holder cannot clear after a backend takeover either.
        cas.setBackendTime(40000);
        const serviceB = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'instance-B',
          now: () => clock.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claimB = await serviceB.acquire('c3r5');
        expect(claimB.ok).to.equal(true);
        const denied = await loaded.service.clearMembershipCompensation('c3r5', 'uid-5', {
          compensationId: 'v2', authority: claim.token
        });
        expect(denied.ok).to.equal(false);
        expect(denied.code).to.equal('room_authority_lost');
        expect(cas.getDocument(`membershipCompensations/${docId}`).compensationId).to.equal('v2');
      } finally {
        loaded.restore();
      }
    });

    it('C3-6: a backend takeover during retry leaves the obligation for the successor', async() => {
      const crypto = require('crypto');
      const cas = makeCasFakeDb();
      cas.setDocument('rooms/c3r6', { members: ['uid-6'], isActive: true });
      const loaded = loadFirebaseServiceWithFakeDb(cas.db);
      const clock = { value: 0 };
      try {
        const serviceA = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'instance-A',
          now: () => clock.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const claimA = await serviceA.acquire('c3r6');
        const docId = crypto.createHash('sha256').update('c3r6\u0000uid-6', 'utf8').digest('hex');
        cas.setDocument(`membershipCompensations/${docId}`, {
          roomId: 'c3r6', userId: 'uid-6', compensationId: 'v1', state: 'pending_admission'
        });
        const roomA = {
          id: 'c3r6', isPermanent: true, authorityToken: claimA.token, members: ['uid-6'],
          players: new Map(), gameState: { defaultMapId: 'default', maps: {}, tokens: {}, characterTokens: {}, gridItems: {} },
          settings: { maxPlayers: 6 }
        };
        const roomB = {
          id: 'c3r6', isPermanent: true, members: ['uid-6'],
          players: new Map(), gameState: { defaultMapId: 'default', maps: {}, tokens: {}, characterTokens: {}, gridItems: {} },
          settings: { maxPlayers: 6 }
        };
        const rooms = new Map([['c3r6', roomA]]);
        const serviceB = roomAuthority.createRoomAuthorityService({
          backend: roomAuthority.createFirestoreAuthorityBackend(loaded.service),
          instanceId: 'instance-B',
          now: () => clock.value,
          logger: silentLogger,
          setIntervalFn: () => ({ unref() {} }),
          clearIntervalFn: () => {}
        });
        const wrapper = {
          listMembershipCompensations: (...args) => loaded.service.listMembershipCompensations(...args),
          removeRoomMember: async(...args) => {
            const result = await loaded.service.removeRoomMember(...args);
            // B takes over after A's durable revoke, before A's fresh proof.
            cas.setBackendTime(40000);
            const claimB = await serviceB.acquire('c3r6');
            expect(claimB.ok).to.equal(true);
            roomB.authorityToken = claimB.token;
            serviceB.attachRoom(roomB);
            rooms.set('c3r6', roomB);
            return result;
          },
          clearMembershipCompensation: (...args) => loaded.service.clearMembershipCompensation(...args)
        };

        const retryA = await roomAccess.retryMembershipCompensations(wrapper, serviceA, 'c3r6', rooms);
        expect(retryA.ok).to.equal(true);
        expect(retryA.cleared).to.equal(0);
        expect(cas.getDocument(`membershipCompensations/${docId}`).compensationId).to.equal('v1');
        // A's stale continuation never reconciled either runtime; durable truth
        // was corrected by the fenced revoke.
        expect(roomA.members).to.deep.equal(['uid-6']);
        expect(roomB.members).to.deep.equal(['uid-6']);
        expect(cas.getDocument('rooms/c3r6').members).to.deep.equal([]);

        // The successor completes idempotent recovery under its own authority.
        const retryB = await roomAccess.retryMembershipCompensations(loaded.service, serviceB, 'c3r6', rooms);
        expect(retryB.cleared).to.equal(1);
        expect(roomB.members).to.deep.equal([]);
        expect(cas.getDocument(`membershipCompensations/${docId}`)).to.equal(undefined);
      } finally {
        loaded.restore();
      }
    });
  });
});

