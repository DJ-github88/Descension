/**
 * Project 2 senior-review correction pass — blocker regression tests (B1–B6).
 *
 * B1  a delayed split fragment from an older snapshot cannot overtake a newer
 *     confirmed snapshot; every started operation settles before ordering
 *     advances.
 * B2  retention/admission and explicit-save waiters are genuinely bounded and
 *     any lost recoverability is explicitly visible.
 * B3  shutdown quiesces admission, is deadline-bounded, and never claims
 *     all-saved while unresolved work remains.
 * B4  room save status cannot cross authoritative room boundaries.
 * B5  trusted loaded permanent rooms remain persistence-eligible without a
 *     stored schema migration.
 * B6  confirmedRevision records every successful confirmed snapshot while
 *     newer pending state is tracked separately.
 *
 * Persistence is stubbed/fault-injected at its external boundary only; the
 * room-writer contract itself is exercised for real.
 */

const { expect } = require('chai');
const sinon = require('sinon');
const Module = require('module');

const firebaseService = require('../services/firebaseService');
const {
  FirebaseBatchWriter,
  ROOM_SAVE_STATUS,
  createSyncServices,
  performGracefulShutdown
} = require('../services/syncService');
const roomHandlers = require('../handlers/roomHandlers');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async(predicate, timeoutMs = 4000, intervalMs = 10) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) {return true;}
    await wait(intervalMs);
  }
  return predicate();
};

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

const tick = async() => {
  for (let i = 0; i < 15; i++) {await Promise.resolve();}
};

const once = (socket, event, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});

const collect = (socket, event, ms) => new Promise((resolve) => {
  const events = [];
  const handler = (payload) => events.push(payload);
  socket.on(event, handler);
  setTimeout(() => {
    socket.off(event, handler);
    resolve(events);
  }, ms);
});

const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});

const fakeIo = () => ({ to: () => ({ emit: () => {} }) });

/**
 * Load a fresh firebaseService instance backed by an injected in-memory
 * Firestore double. No real cloud is contacted. Returns { service, restore }.
 */
function loadFirebaseServiceWithFakeDb(db) {
  const admin = {
    initializeApp: () => {},
    firestore: () => db,
    credential: { cert: () => ({}) },
    apps: []
  };
  admin.firestore.FieldValue = { serverTimestamp: () => ({ __serverTimestamp: true }) };
  const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

  const servicePath = require.resolve('../services/firebaseService');
  const loggerPath = require.resolve('../services/logger');
  const hadService = require.cache[servicePath];
  const hadLogger = require.cache[loggerPath];

  const originalLoad = Module._load;
  const originalEmulator = process.env.FIRESTORE_EMULATOR_HOST;
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:1'; // force the emulator init branch

  delete require.cache[servicePath];
  delete require.cache[loggerPath];
  Module._load = function(request, parent) {
    if (request === 'firebase-admin') {return admin;}
    if (request === './logger' && parent && parent.filename === servicePath) {return silentLogger;}
    return originalLoad.apply(this, arguments);
  };

  try {
    const service = require('../services/firebaseService');
    return {
      service,
      restore: () => {
        Module._load = originalLoad;
        delete require.cache[servicePath];
        delete require.cache[loggerPath];
        if (hadService) {require.cache[servicePath] = hadService;}
        if (hadLogger) {require.cache[loggerPath] = hadLogger;}
        if (originalEmulator === undefined) {delete process.env.FIRESTORE_EMULATOR_HOST;}
        else {process.env.FIRESTORE_EMULATOR_HOST = originalEmulator;}
      }
    };
  } catch (error) {
    Module._load = originalLoad;
    throw error;
  }
}

/**
 * Minimal chainable Firestore double with a controllable per-path behavior.
 * Supports the P3 atomic contract: one batch() commit per room snapshot plus a
 * read-only transaction read for head/completeness checks.
 */
function makeFakeDb() {
  const calls = [];
  const stored = new Map();
  const batchCommits = [];
  let behavior = () => null;

  const applyOps = (ops) => {
    for (const op of ops) {
      if (op.type === 'delete') {stored.delete(op.path);}
      else if (op.type === 'update') {stored.set(op.path, { ...(stored.get(op.path) || {}), ...op.data });}
      else {stored.set(op.path, op.data);}
    }
  };

  const makeRef = (path) => ({
    path,
    update: (data) => { stored.set(path, data); return Promise.resolve(); },
    set: (data) => { stored.set(path, data); return Promise.resolve(); },
    delete: () => { stored.delete(path); return Promise.resolve(); },
    get: async() => {
      let data = stored.get(path);
      if (data === undefined && path.startsWith('roomAuthorities/')) {
        data = { authorityInstanceId: 'test-instance', authorityGeneration: 1, state: 'held', expiresAt: 9_000_000_000_000 };
        stored.set(path, data);
      }
      return {
        exists: data !== undefined,
        data: () => data || {},
        updateTime: data !== undefined ? 'ts-1' : null,
        readTime: { toMillis: () => 0 }
      };
    },
    collection: (name) => makeCollection(`${path}/${name}`),
    doc: (id) => makeRef(`${path}/${id}`)
  });
  const makeCollection = (path) => {
    const collection = {
      path,
      __isQuery: true,
      doc: (id) => makeRef(`${path}/${id}`),
      get: async() => {
        const docs = Array.from(stored.entries())
          .filter(([storedPath]) => storedPath.startsWith(`${path}/`))
          .map(([storedPath, data]) => ({ id: storedPath.slice(path.length + 1), data: () => data }));
        return { docs, empty: docs.length === 0 };
      },
      listDocuments: async() => [],
      where: () => collection
    };
    return collection;
  };

  const db = {
    collection: (name) => makeCollection(name),
    batch: () => {
      const ops = [];
      return {
        set: (ref, data) => { ops.push({ type: 'set', path: ref.path, data }); },
        create: (ref, data) => { ops.push({ type: 'create', path: ref.path, data }); },
        update: (ref, data, precondition) => { ops.push({ type: 'update', path: ref.path, data, precondition }); },
        delete: (ref) => { ops.push({ type: 'delete', path: ref.path }); },
        commit: () => {
          batchCommits.push({ ops: ops.slice() });
          const result = behavior(ops);
          if (result && typeof result.then === 'function') {
            return result.then((value) => {
              if (value === 'reject') {throw Object.assign(new Error('batch rejected'), { code: 'unavailable' });}
              applyOps(ops);
              return [];
            });
          }
          if (result === 'reject') {
            return Promise.reject(Object.assign(new Error('batch rejected'), { code: 'unavailable' }));
          }
          applyOps(ops);
          return Promise.resolve([]);
        }
      };
    },
    runTransaction: async(fn) => fn({
      get: async(refOrQuery) => {
        if (refOrQuery && refOrQuery.__isQuery) {
          const docs = Array.from(stored.entries())
            .filter(([storedPath]) => storedPath.startsWith(`${refOrQuery.path}/`))
            .map(([storedPath, data]) => ({ id: storedPath.slice(refOrQuery.path.length + 1), data: () => data, updateTime: null }));
          return { docs, empty: docs.length === 0 };
        }
        const data = stored.get(refOrQuery.path);
        return {
          exists: data !== undefined,
          data: () => data || {},
          updateTime: data !== undefined ? 'ts-1' : null,
          readTime: { toMillis: () => 0 }
        };
      }
    })
  };

  return {
    db,
    calls,
    stored,
    batchCommits,
    setBehavior: (fn) => { behavior = fn; }
  };
}

describe('P2 blocker corrections (B1–B6)', function() {
  this.timeout(20000);

  const writers = [];

  afterEach(() => {
    for (const writer of writers.splice(0)) {writer.stop();}
    sinon.restore();
  });

  describe('B1 — atomic checkpoint publication ordering', () => {
    it('a delayed atomic commit from an older snapshot cannot overwrite a newer confirmed snapshot', async() => {
      const fake = makeFakeDb();
      const delayed = deferred();
      const commitStarts = [];
      fake.setBehavior((ops) => {
        const mapA = ops.find(op => op.path.endsWith('/gameState/map-a'));
        const isOld = !!(mapA && typeof mapA.data.snapshotJson === 'string' && mapA.data.snapshotJson.includes('"marker":"old"'));
        if (isOld) {
          commitStarts.push('old');
          return delayed.promise.then(() => 'reject');
        }
        commitStarts.push('new');
        return null;
      });

      const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist: (roomId, snapshot, ctx) => service.updateRoomGameState(roomId, snapshot, { ...ctx, authority: { roomId, authorityInstanceId: 'test-instance', authorityGeneration: 1 } }),
        baseRetryDelayMs: 60000
      });
      try {
        const padding = 'p'.repeat(110000);
        const oldSnapshot = {
          padding,
          maps: {
            'map-a': { marker: 'old', tokens: { X: { id: 'X' } }, fogOfWarPaths: ['A'] },
            'map-b': { marker: 'old' }
          }
        };
        const newSnapshot = {
          padding,
          maps: {
            'map-a': { marker: 'new', tokens: {}, fogOfWarPaths: ['A', 'B'] },
            'map-b': { marker: 'new' }
          }
        };

        const oldSave = writer.saveNow('room', oldSnapshot);
        await waitFor(() => commitStarts.length === 1);
        const newRevision = writer.queueWrite('room', newSnapshot, true);

        // While the old atomic commit is unsettled, no newer same-room
        // publication may start.
        await wait(40);
        expect(commitStarts).to.deep.equal(['old']);
        expect(writer.getOperationalStats().inFlight).to.equal(1);

        delayed.resolve();
        const oldResult = await oldSave;
        expect(oldResult.outcome).to.equal('retryable');

        await waitFor(() => writer.getStatus('room').cloudSaved === true, 6000);
        expect(commitStarts).to.deep.equal(['old', 'new']);

        // The old rejected batch published nothing; only the newer complete
        // checkpoint is durable.
        expect(fake.stored.has('rooms/room')).to.equal(true);
        const persistedMapA = JSON.parse(fake.stored.get('rooms/room/gameState/map-a').snapshotJson);
        expect(persistedMapA.marker).to.equal('new');
        expect(persistedMapA.tokens).to.deep.equal({});
        expect(persistedMapA.fogOfWarPaths).to.deep.equal(['A', 'B']);
        expect(writer.getStatus('room').confirmedRevision).to.equal(newRevision);
      } finally {
        writer.stop();
        restore();
      }
    });

    it('an in-flight atomic commit settles before ordering advances and a rejected batch publishes nothing', async() => {
      const fake = makeFakeDb();
      const delayed = deferred();
      let commitStarted = false;
      fake.setBehavior(() => {
        if (!commitStarted) {
          commitStarted = true;
          return delayed.promise.then(() => 'reject');
        }
        return null;
      });

      const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist: (roomId, snapshot, ctx) => service.updateRoomGameState(roomId, snapshot, { ...ctx, authority: { roomId, authorityInstanceId: 'test-instance', authorityGeneration: 1 } }),
        baseRetryDelayMs: 60000
      });
      try {
        const snapshot = {
          maps: {
            'map-a': { marker: 'old', tokens: { X: { id: 'X' } } },
            'map-b': { marker: 'old' }
          }
        };

        let settled = false;
        const save = writer.saveNow('room', snapshot).then((result) => { settled = true; return result; });
        await waitFor(() => commitStarted);
        await wait(40);
        expect(settled).to.equal(false, 'attempt must not settle while the atomic commit is unsettled');

        delayed.resolve();
        const result = await save;
        expect(result.outcome).to.equal('retryable');
        expect(fake.stored.has('rooms/room/gameState/current')).to.equal(false);
        expect(fake.stored.has('rooms/room/gameState/map-a')).to.equal(false);
        expect(writer.getStatus('room').cloudSaved).to.equal(false);
      } finally {
        writer.stop();
        restore();
      }
    });
  });

  describe('B2 — capacity / waiters', () => {
    it('evicts an idle exhausted snapshot with explicit pressure status and no false saved', () => {
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist: () => false,
        maxRetainedRooms: 1,
        maxTrackedRooms: 1
      });
      const events = [];
      writer.setStatusSink((roomId, payload) => events.push({ roomId, ...payload }));
      try {
        writer.queueWrite('room-a', { tokens: { a: { id: 'a' } } });
        expect(writer.getStatus('room-a').status).to.equal(ROOM_SAVE_STATUS.PENDING);

        writer.queueWrite('room-b', { tokens: { b: { id: 'b' } } });

        const pressure = events.find(e => e.roomId === 'room-a' && e.reason === 'retention_pressure');
        expect(pressure).to.exist;
        expect(pressure.status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
        expect(pressure.cloudSaved).to.equal(false);
        expect(pressure.recoveryNeeded).to.equal(true);
        expect(writer.getStatus('room-a').cloudSaved).to.equal(false);

        const stats = writer.getOperationalStats();
        expect(stats.droppedSnapshots).to.equal(1);
        expect(stats.retainedRooms).to.equal(1);
        expect(stats.trackedRooms).to.be.at.most(1);
        expect(stats.rejectedAdmissions).to.equal(0);
      } finally {
        writer.stop();
      }
    });

    it('refuses admission instead of exceeding the retained bound when everything is in flight', async() => {
      const held = deferred();
      const persist = sinon.stub().returns(held.promise);
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist,
        maxRetainedRooms: 1,
        maxTrackedRooms: 2
      });
      const events = [];
      writer.setStatusSink((roomId, payload) => events.push({ roomId, ...payload }));
      try {
        expect(writer.queueWrite('room-a', { n: 1 }, true)).to.be.a('number');
        await tick();
        expect(persist.callCount).to.equal(1);

        expect(writer.queueWrite('room-b', { n: 2 }, true)).to.equal(null);
        for (let i = 0; i < 4; i++) {
          expect(writer.queueWrite(`room-x${i}`, { n: i }, true)).to.equal(null);
        }

        const stats = writer.getOperationalStats();
        expect(stats.retainedRooms).to.equal(1);
        expect(stats.trackedRooms).to.be.at.most(2);
        expect(stats.rejectedAdmissions).to.equal(5);
        expect(events.some(e => e.roomId === 'room-b' &&
          e.reason === 'retention_capacity' && e.cloudSaved === false)).to.equal(true);

        held.resolve(false);
        await tick();
      } finally {
        writer.stop();
      }
    });

    it('bounds outstanding explicit-save waiters per room', async() => {
      const held = deferred();
      const persist = sinon.stub().returns(held.promise);
      const writer = new FirebaseBatchWriter(60000, 50, { persist, maxWaitersPerRoom: 2 });
      try {
        const first = writer.saveNow('room', { n: 1 });
        await tick();
        const second = writer.saveNow('room', { n: 2 });
        await tick();
        expect(writer.roomStates.get('room').waiters.length).to.equal(2);

        const excess = await writer.saveNow('room', { n: 3 });
        expect(excess.reason).to.equal('waiter_capacity');
        expect(excess.outcome).to.equal('retryable');
        expect(writer.roomStates.get('room').waiters.length).to.equal(2);

        held.resolve(false);
        const firstResult = await first;
        const secondResult = await second;
        expect(firstResult.outcome).to.equal('retryable');
        expect(secondResult.outcome).to.equal('retryable');
        expect(writer.roomStates.get('room').waiters.length).to.equal(0);
      } finally {
        writer.stop();
      }
    });

    it('resolves an evicted room waiter as a bounded failure, never success (defensive)', () => {
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist: () => Promise.resolve(false),
        maxRetainedRooms: 1,
        maxTrackedRooms: 1
      });
      try {
        writer.queueWrite('room-a', { n: 1 });
        let result = null;
        writer.roomStates.get('room-a').waiters.push({
          revision: 1,
          resolve: (value) => { result = value; }
        });

        writer.queueWrite('room-b', { n: 2 });

        expect(result).to.not.equal(null);
        expect(result.outcome).to.equal('unavailable');
        expect(result.retriable).to.equal(false);
        expect(result.pressure).to.equal(true);
      } finally {
        writer.stop();
      }
    });
  });

  describe('B3 — shutdown / drain', () => {
    it('makes a final bounded attempt for retry-exhausted work', async() => {
      let fail = true;
      const persist = sinon.stub().callsFake(() => (fail ? false : { outcome: 'confirmed' }));
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist,
        maxAttempts: 1,
        baseRetryDelayMs: 60000,
        shutdownDeadlineMs: 500
      });
      try {
        await writer.saveNow('room', { n: 1 });
        expect(writer.getStatus('room').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
        const attemptsBefore = persist.callCount;

        fail = false;
        const result = await writer.drain();
        expect(persist.callCount).to.equal(attemptsBefore + 1);
        expect(result.attempted).to.equal(1);
        expect(result.confirmed).to.equal(1);
        expect(result.unsaved).to.equal(0);
        expect(result.timedOut).to.equal(false);
      } finally {
        writer.stop();
      }
    });

    it('does not retry a permanently rejected snapshot', async() => {
      const persist = sinon.stub().resolves({ outcome: 'permanent', reason: 'permission denied' });
      const writer = new FirebaseBatchWriter(60000, 50, {
        persist,
        baseRetryDelayMs: 60000,
        shutdownDeadlineMs: 500
      });
      try {
        await writer.saveNow('room', { n: 1 });
        const attemptsBefore = persist.callCount;

        const result = await writer.drain();
        expect(persist.callCount).to.equal(attemptsBefore);
        expect(result.attempted).to.equal(1);
        expect(result.unsaved).to.equal(1);
        expect(result.unsavedRooms).to.deep.equal(['room']);
      } finally {
        writer.stop();
      }
    });

    it('drain freezes admission and explicitly rejects new work', async() => {
      const held = deferred();
      const persist = sinon.stub().returns(held.promise);
      const writer = new FirebaseBatchWriter(60000, 50, { persist, shutdownDeadlineMs: 500 });
      const events = [];
      writer.setStatusSink((roomId, payload) => events.push({ roomId, ...payload }));
      try {
        writer.saveNow('room-a', { n: 1 });
        await tick();

        const drainPromise = writer.drain();
        await tick();

        expect(writer.queueWrite('room-b', { n: 2 }, true)).to.equal(null);
        expect(events.some(e => e.roomId === 'room-b' &&
          e.reason === 'shutdown_in_progress' && e.cloudSaved === false)).to.equal(true);

        held.resolve({ outcome: 'confirmed' });
        const result = await drainPromise;
        expect(result.attempted).to.equal(1);
        expect(result.confirmed).to.equal(1);
        expect(result.rejectedDuringDrain).to.equal(1);
        expect(result.unsaved).to.equal(0);
      } finally {
        writer.stop();
      }
    });

    it('is deadline-bounded when persistence never settles', async() => {
      const never = new Promise(() => {});
      const persist = sinon.stub().returns(never);
      const writer = new FirebaseBatchWriter(60000, 50, { persist, shutdownDeadlineMs: 60 });
      try {
        writer.saveNow('room-a', { n: 1 });
        await tick();

        const startedAt = Date.now();
        const result = await writer.drain();
        expect(Date.now() - startedAt).to.be.lessThan(2000);
        expect(result.timedOut).to.equal(true);
        expect(result.attempted).to.equal(1);
        expect(result.unsaved).to.equal(1);
        expect(result.unsavedRooms).to.deep.equal(['room-a']);
      } finally {
        writer.stop();
      }
    });

    it('never logs all-saved while unresolved work remains', async() => {
      const logger = require('../services/logger');
      const errorSpy = sinon.stub(logger, 'error');
      const infoSpy = sinon.stub(logger, 'info');

      const writer = new FirebaseBatchWriter(60000, 50, {
        persist: () => false,
        maxAttempts: 1,
        baseRetryDelayMs: 60000,
        shutdownDeadlineMs: 300
      });
      try {
        await writer.saveNow('room', { n: 1 });
        const result = await performGracefulShutdown({
          firebaseBatchWriter: writer,
          movementDebouncer: { stop: sinon.stub() }
        });
        expect(result.unsaved).to.equal(1);
        expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
          .to.equal(false);
        expect(errorSpy.calledWith(sinon.match('unsaved snapshots will be lost'), sinon.match.any))
          .to.equal(true);
      } finally {
        writer.stop();
      }
    });

    it('stops retrying after shutdown completes', async() => {
      const persist = sinon.stub().resolves(false);
      const writer = new FirebaseBatchWriter(20, 50, {
        persist,
        maxAttempts: 5,
        baseRetryDelayMs: 5,
        maxRetryDelayMs: 10,
        shutdownDeadlineMs: 100
      });
      writer.queueWrite('room', { n: 1 });
      await wait(40);
      expect(persist.callCount).to.be.greaterThan(0);

      writer.stop();
      const countAfterStop = persist.callCount;
      await wait(80);
      expect(persist.callCount).to.equal(countAfterStop);
    });
  });

  describe('B4 — room status isolation (server)', function() {
    this.timeout(20000);

    let server;
    let clients;

    const openVerified = async() => {
      const userId = server.nextUserId();
      const token = `test-token:${userId}`;
      server.registerAuthToken(token, userId);
      const client = server.connect({ token });
      clients.push(client);
      await connected(client);
      return { client, userId };
    };

    const join = async(client, roomId) => {
      const joined = once(client, 'room_joined');
      client.emit('join_room', { roomId, playerName: 'Player', password: '' });
      return joined;
    };

    beforeEach(async() => {
      clients = [];
      server = createProductionStackServer({ debounceMs: 80 });
      await server.start();
    });

    afterEach(async() => {
      for (const client of clients) {
        try { client.disconnect(); } catch (_) { /* noop */ }
      }
      clients = [];
      try { await server.stop(); } catch (_) { /* noop */ }
    });

    it('does not deliver a room status to a socket now in another room', async() => {
      const gm = await openVerified();
      const observer = await openVerified();
      const roomA = await server.seedRoom(gm.client.id, {
        gmUserId: gm.userId,
        persistentRoomId: 'status-room-a'
      });
      await join(observer.client, roomA.id);

      const gmB = await openVerified();
      const roomB = await server.seedRoom(gmB.client.id, {
        gmUserId: gmB.userId,
        persistentRoomId: 'status-room-b'
      });
      await join(observer.client, roomB.id);

      const observerServerSocket = server.io.sockets.sockets.get(observer.client.id);
      expect(observerServerSocket.rooms.has(roomA.id)).to.equal(true, 'stale channel remains');
      expect(server.players.get(observer.client.id).roomId).to.equal(roomB.id);

      const services = createSyncServices(server.io, server.rooms, server.players);
      services.firebaseBatchWriter.persist = () => ({ outcome: 'confirmed' });
      try {
        const observerEvents = collect(observer.client, 'room_save_status', 300);
        const gmEvents = collect(gm.client, 'room_save_status', 300);

        services.firebaseBatchWriter.queueWrite(roomA.id, { n: 1 }, true);

        const observerSeen = await observerEvents;
        const gmSeen = await gmEvents;
        expect(observerSeen).to.have.length(0);
        expect(gmSeen.length).to.be.greaterThan(0);
      } finally {
        services.firebaseBatchWriter.stop();
        services.movementDebouncer.stop();
      }
    });
  });

  describe('B5 — permanent room eligibility', () => {
    it('keeps freshly created permanent rooms persistence-eligible', async() => {
      const rooms = new Map();
      const players = new Map();
      const room = await roomHandlers.createRoom(
        'Permanent', 'GM', 'gm-eligibility', '', '#fff',
        false, 'eligible-room-1', null, 'uid-1', ['uid-1'], rooms, players
      );
      expect(room.isPermanent).to.equal(true);

      const services = createSyncServices(fakeIo(), rooms, new Map());
      try {
        expect(services.firebaseBatchWriter.queueWrite(room.id, { n: 1 })).to.be.a('number');
        expect(services.firebaseBatchWriter.getStatus(room.id).status).to.not.equal(null);
      } finally {
        services.firebaseBatchWriter.stop();
        services.movementDebouncer.stop();
      }
    });

    it('reconstructs eligibility for loaded cloud rooms without stored migration', async() => {
      const rooms = new Map();
      sinon.stub(firebaseService, 'loadPersistentRooms').resolves([
        // Older split core metadata omits isPermanent/persistentRoomId.
        { id: 'legacy-large-room', isSplitStorage: true, players: {} }
      ]);

      await roomHandlers.initializePersistentRooms(rooms);
      const loaded = rooms.get('legacy-large-room');
      expect(loaded.isPermanent).to.equal(true);
      expect(loaded.persistentRoomId).to.equal('legacy-large-room');

      const services = createSyncServices(fakeIo(), rooms, new Map());
      try {
        expect(services.firebaseBatchWriter.queueWrite('legacy-large-room', { n: 1 })).to.be.a('number');
        expect(services.firebaseBatchWriter.getRetainedSnapshot('legacy-large-room')).to.not.equal(null);
      } finally {
        services.firebaseBatchWriter.stop();
        services.movementDebouncer.stop();
      }
    });

    it('keeps temporary rooms local-only', async() => {
      const rooms = new Map();
      const players = new Map();
      const room = await roomHandlers.createRoom(
        'Temporary', 'GM', 'gm-temp', '', '#fff',
        false, undefined, null, 'uid-temp', ['uid-temp'], rooms, players
      );
      expect(room.isPermanent).to.equal(false);

      const services = createSyncServices(fakeIo(), rooms, players);
      try {
        expect(services.firebaseBatchWriter.queueWrite(room.id, { n: 1 }, true)).to.equal(null);
        expect(services.firebaseBatchWriter.getStatus(room.id).reason).to.equal('room_not_persistent');
        expect(services.firebaseBatchWriter.getStatus(room.id).cloudSaved).to.equal(false);
      } finally {
        services.firebaseBatchWriter.stop();
        services.movementDebouncer.stop();
      }
    });
  });

  describe('B6 — confirmed revision accounting', () => {
    it('advances confirmedRevision when an older attempt succeeds while newer work is pending', async() => {
      const held = deferred();
      const persist = sinon.stub().callsFake((roomId, snapshot) => {
        if (snapshot.n === 2) {return held.promise;}
        if (snapshot.n === 3) {return false;}
        return { outcome: 'confirmed' };
      });
      const writer = new FirebaseBatchWriter(60000, 50, { persist, baseRetryDelayMs: 60000 });
      try {
        const r1 = writer.queueWrite('room', { n: 1 }, true);
        await waitFor(() => writer.getStatus('room').cloudSaved === true);
        expect(writer.getStatus('room').confirmedRevision).to.equal(r1);

        const r2 = writer.queueWrite('room', { n: 2 }, true);
        await tick();
        const r3 = writer.queueWrite('room', { n: 3 }, true);
        expect(r3).to.be.greaterThan(r2);

        held.resolve({ outcome: 'confirmed' });
        await waitFor(() => writer.getStatus('room').confirmedRevision === r2);

        let status = writer.getStatus('room');
        expect(status.confirmedRevision).to.equal(r2);
        expect(status.pendingRevision).to.equal(r3);
        expect(status.cloudSaved).to.equal(false);

        await writer.flush();
        await tick();
        status = writer.getStatus('room');
        expect(status.confirmedRevision).to.equal(r2, 'failed newer work must not erase confirmed checkpoint');
        expect(status.pendingRevision).to.equal(r3);
        expect(status.cloudSaved).to.equal(false);

        writer.persist = () => ({ outcome: 'confirmed' });
        const r4 = writer.queueWrite('room', { n: 4 }, true);
        await waitFor(() => writer.getStatus('room').confirmedRevision === r4);
        expect(writer.getStatus('room').cloudSaved).to.equal(true);
      } finally {
        writer.stop();
      }
    });

    it('reports the revision the explicit attempt actually confirmed', async() => {
      const held = deferred();
      const persist = sinon.stub().callsFake((roomId, snapshot) => {
        if (snapshot.n === 2) {return held.promise;}
        return { outcome: 'confirmed' };
      });
      const writer = new FirebaseBatchWriter(60000, 50, { persist, baseRetryDelayMs: 60000 });
      try {
        const expectedConfirmed = writer.revisionCounter + 1;
        const explicit = writer.saveNow('room', { n: 2 });
        await tick();
        const newRevision = writer.queueWrite('room', { n: 3 }, true);

        held.resolve({ outcome: 'confirmed' });
        const result = await explicit;

        expect(result.outcome).to.equal('confirmed');
        expect(result.revision).to.equal(expectedConfirmed);
        expect(result.confirmedRevision).to.equal(expectedConfirmed);
        expect(newRevision).to.equal(expectedConfirmed + 1);

        const status = writer.getStatus('room');
        expect(status.confirmedRevision).to.equal(expectedConfirmed);
        expect(status.pendingRevision).to.equal(newRevision);

        // The explicit acknowledgement must report the actual confirmed
        // revision, not a stale pre-attempt value.
        expect(Math.max(result.confirmedRevision, result.revision)).to.equal(expectedConfirmed);
      } finally {
        writer.stop();
      }
    });

    it('a confirmed attempt cannot lower a higher confirmed revision', async() => {
      const persist = sinon.stub().resolves({ outcome: 'confirmed' });
      const writer = new FirebaseBatchWriter(60000, 50, { persist });
      try {
        const r1 = writer.queueWrite('room', { n: 1 }, true);
        await waitFor(() => writer.getStatus('room').confirmedRevision === r1);
        const r2 = writer.queueWrite('room', { n: 2 }, true);
        await waitFor(() => writer.getStatus('room').confirmedRevision === r2);
        expect(writer.getStatus('room').confirmedRevision).to.equal(r2);
        expect(r2).to.be.greaterThan(r1);
      } finally {
        writer.stop();
      }
    });
  });

  describe('B6 — explicit save via real socket path', function() {
    this.timeout(20000);

    let server;
    let clients;
    let writer;

    beforeEach(async() => {
      clients = [];
    });

    afterEach(async() => {
      for (const client of clients) {
        try { client.disconnect(); } catch (_) { /* noop */ }
      }
      clients = [];
      try { await server.stop(); } catch (_) { /* noop */ }
    });

    it('acknowledges the revision its attempt confirmed, not a stale one', async() => {
      const held = deferred();
      let calls = 0;
      writer = new FirebaseBatchWriter(60000, 50, {
        persist: async() => {
          calls += 1;
          if (calls === 1) {return held.promise;}
          return { outcome: 'confirmed' };
        },
        baseRetryDelayMs: 60000
      });
      server = createProductionStackServer({ debounceMs: 80, firebaseBatchWriter: writer });
      await server.start();

      const userId = server.nextUserId();
      const token = `test-token:${userId}`;
      server.registerAuthToken(token, userId);
      const gm = server.connect({ token });
      clients.push(gm);
      await connected(gm);

      const room = await server.seedRoom(gm.id, {
        gmUserId: userId,
        persistentRoomId: 'ack-revision-room'
      });

      gm.emit('save_room_state_request', { roomId: room.id, reason: 'revision_ack' });
      await waitFor(() => writer.roomStates.get(room.id) && writer.roomStates.get(room.id).inFlight === true);
      const attemptedRevision = writer.roomStates.get(room.id).revision;

      // A newer edit arrives while the explicit attempt is still in flight.
      writer.queueWrite(room.id, { ...room.gameState, reviewMarker: 'newer' }, true);

      const savedPromise = once(gm, 'room_state_saved');
      held.resolve({ outcome: 'confirmed' });
      const saved = await savedPromise;

      expect(saved.confirmedRevision).to.equal(attemptedRevision);
      expect(saved.cloudSaved).to.equal(true);
      expect(writer.getStatus(room.id).confirmedRevision).to.be.at.least(attemptedRevision);
    });
  });
});
