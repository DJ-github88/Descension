/**
 * Project 2 — Honest Room Saves and Retained Retry Work.
 *
 * Unit-level tests drive the REAL FirebaseBatchWriter with only the
 * persistence boundary injected. The real-path tests drive the REAL
 * registered `save_room_state_request` handler through the REAL production
 * middleware composition; only Firebase persistence is stubbed.
 *
 * Closes:
 *   R2 — updateRoomGameState() === false is no longer treated as success and
 *        pending work is retained
 *   R8 — explicit save only reports room_state_saved after a confirmed
 *        durable write; false/unavailable/throw are reported as failure
 */

const { expect } = require('chai');
const sinon = require('sinon');

const firebaseService = require('../services/firebaseService');
const { FirebaseBatchWriter, ROOM_SAVE_STATUS } = require('../services/syncService');
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

describe('Room save persistence (Project 2)', function() {
  this.timeout(20000);

  const writers = [];
  const createWriter = (persist, options = {}) => {
    const { flushIntervalMs = 20, ...writerOptions } = options;
    const writer = new FirebaseBatchWriter(flushIntervalMs, 50, {
      maxAttempts: 3,
      baseRetryDelayMs: 5,
      maxRetryDelayMs: 10,
      persist,
      shouldPersist: () => true,
      ...writerOptions
    });
    writers.push(writer);
    return writer;
  };

  afterEach(() => {
    for (const writer of writers.splice(0)) {writer.stop();}
    sinon.restore();
  });

  describe('bounded outcome contract', () => {
    it('normalizes legacy booleans and undefined without manufacturing success', () => {
      expect(firebaseService.normalizeRoomWriteOutcome(true).outcome).to.equal('confirmed');
      expect(firebaseService.normalizeRoomWriteOutcome(false).outcome).to.equal('retryable');
      expect(firebaseService.normalizeRoomWriteOutcome(undefined).outcome).to.equal('retryable');
      expect(firebaseService.normalizeRoomWriteOutcome(null).outcome).to.equal('retryable');
      const structured = { outcome: 'unavailable', reason: 'firebase_not_initialized' };
      expect(firebaseService.normalizeRoomWriteOutcome(structured)).to.equal(structured);
    });

    it('classifies permission-denied as permanent and unknown errors as retryable', () => {
      expect(firebaseService.classifyRoomWriteError(Object.assign(new Error('denied'), { code: 'permission-denied' })).outcome)
        .to.equal('permanent');
      expect(firebaseService.classifyRoomWriteError(Object.assign(new Error('network'), { code: 'unavailable' })).outcome)
        .to.equal('retryable');
      expect(firebaseService.classifyRoomWriteError(new Error('mystery')).outcome).to.equal('retryable');
    });

    it('updateRoomGameState reports unavailable instead of true when no persistence is configured', async function() {
      if (firebaseService.isPersistenceAvailable()) {this.skip();}
      const result = await firebaseService.updateRoomGameState('room-no-db', { tokens: {} });
      expect(result.outcome).to.equal('unavailable');
    });
  });

  describe('A. false result (R2)', () => {
    it('never reports success, retains the newest snapshot and enters retry', async() => {
      const writer = createWriter(() => false, { baseRetryDelayMs: 100000 });
      writer.queueWrite('room-1', { fogOfWarPaths: ['A'] });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.RETRYING);
      const status = writer.getStatus('room-1');
      expect(status.cloudSaved).to.equal(false);
      expect(status.status).to.equal(ROOM_SAVE_STATUS.RETRYING);
      expect(writer.getRetainedSnapshot('room-1').fogOfWarPaths).to.deep.equal(['A']);
      expect(writer.getOperationalStats().confirmedWrites).to.equal(0);
    });
  });

  describe('B. thrown error', () => {
    it('categorizes failure, retains pending state and retries boundedly', async() => {
      const writer = createWriter(() => {
        throw Object.assign(new Error('network down'), { code: 'unavailable' });
      }, { baseRetryDelayMs: 100000 });

      writer.queueWrite('room-1', { tokens: { X: { id: 'X' } } });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.RETRYING);
      const status = writer.getStatus('room-1');
      expect(status.cloudSaved).to.equal(false);
      expect(status.error).to.equal('network down');
      expect(writer.getRetainedSnapshot('room-1').tokens.X).to.exist;
    });
  });

  describe('C. unavailable / no-DB', () => {
    it('keeps live memory but reports unsaved, never cloud-saved', async() => {
      const writer = createWriter(() => ({ outcome: 'unavailable', reason: 'firebase_not_initialized' }));
      writer.queueWrite('room-1', { tokens: {} });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.UNSAVED);
      const status = writer.getStatus('room-1');
      expect(status.cloudSaved).to.equal(false);
      expect(status.status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(writer.getRetainedSnapshot('room-1')).to.not.equal(null);
    });
  });

  describe('D. later recovery', () => {
    it('saves the newest retained snapshot and advances status to saved', async() => {
      const persisted = [];
      let failures = 2;
      const writer = createWriter((roomId, snapshot) => {
        if (failures > 0) {
          failures -= 1;
          return { outcome: 'retryable', reason: 'flaky cloud' };
        }
        persisted.push(snapshot);
        return { outcome: 'confirmed' };
      });

      writer.queueWrite('room-1', { tokens: { a: { id: 'a' } } });
      writer.queueWrite('room-1', { tokens: { b: { id: 'b' } } });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.SAVED, 6000);
      expect(persisted.length).to.be.greaterThan(0);
      expect(persisted[persisted.length - 1]).to.deep.equal({ tokens: { b: { id: 'b' } } });
      expect(writer.getStatus('room-1').cloudSaved).to.equal(true);
      expect(writer.getRetainedSnapshot('room-1')).to.equal(null);
    });
  });

  describe('E. retry exhaustion', () => {
    it('retains the newest unsaved snapshot and exposes recovery-needed status', async() => {
      const writer = createWriter(() => false);
      writer.queueWrite('room-1', { tokens: { keep: { id: 'keep' } } });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.UNSAVED, 6000);
      const status = writer.getStatus('room-1');
      expect(status.cloudSaved).to.equal(false);
      expect(status.exhausted).to.equal(true);
      expect(writer.getRetainedSnapshot('room-1').tokens.keep.id).to.equal('keep');
      expect(writer.getOperationalStats().retryExhaustions).to.be.greaterThan(0);
    });
  });

  describe('F. new write during failure', () => {
    it('prefers the new snapshot and lets no older attempt overwrite it', async() => {
      const attempts = [];
      let releaseFirstAttempt;
      const writer = createWriter((roomId, snapshot) => {
        attempts.push(snapshot);
        if (attempts.length === 1) {
          return new Promise((resolve) => { releaseFirstAttempt = resolve; });
        }
        return { outcome: 'confirmed' };
      }, { baseRetryDelayMs: 100000, maxRetryDelayMs: 100000 });

      const firstRevision = writer.queueWrite('room-1', { tokens: { old: { id: 'old' } } });
      await waitFor(() => attempts.length === 1);

      const secondRevision = writer.queueWrite('room-1', { tokens: { fresh: { id: 'fresh' } } });
      expect(secondRevision).to.be.greaterThan(firstRevision);

      releaseFirstAttempt({ outcome: 'retryable', reason: 'network' });
      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.SAVED);

      const lastAttempt = attempts[attempts.length - 1];
      expect(lastAttempt.tokens.fresh).to.exist;
      expect(lastAttempt.tokens.old).to.not.exist;
      expect(writer.getStatus('room-1').confirmedRevision).to.equal(secondRevision);
      expect(writer.getRetainedSnapshot('room-1')).to.equal(null);
    });
  });

  describe('G. out-of-order completion', () => {
    it('never runs two writes for one room concurrently and refuses to regress confirmed state', async() => {
      let active = 0;
      let maxActive = 0;
      const releases = [];
      const writer = createWriter(() => {
        active += 1;
        maxActive = Math.max(maxActive, active);
        return new Promise((resolve) => {
          releases.push(() => {
            active -= 1;
            resolve({ outcome: 'confirmed' });
          });
        });
      });

      writer.queueWrite('room-1', { n: 1 });
      await waitFor(() => releases.length === 1);

      const secondRevision = writer.queueWrite('room-1', { n: 2 });
      await wait(60);
      expect(releases.length).to.equal(1, 'second same-room write must wait for the first');

      releases[0]();
      await waitFor(() => releases.length === 2);
      releases[1]();
      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.SAVED);

      expect(maxActive).to.equal(1);
      expect(writer.getStatus('room-1').confirmedRevision).to.equal(secondRevision);
    });
  });

  describe('H. deletion in newer snapshot', () => {
    it('keeps the deletion - no resurrection', async() => {
      const persisted = [];
      let attempts = 0;
      const writer = createWriter((roomId, snapshot) => {
        attempts += 1;
        if (attempts === 1) {return { outcome: 'retryable', reason: 'blip' };}
        persisted.push(snapshot);
        return { outcome: 'confirmed' };
      });

      writer.queueWrite('room-1', { tokens: { X: { id: 'X' } } });
      writer.queueWrite('room-1', { tokens: {} });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.SAVED, 6000);
      expect(persisted[persisted.length - 1].tokens).to.deep.equal({});
    });
  });

  describe('I. fog array snapshot', () => {
    it('replaces array snapshots instead of concatenating them', async() => {
      const persisted = [];
      let attempts = 0;
      const writer = createWriter((roomId, snapshot) => {
        attempts += 1;
        if (attempts === 1) {return { outcome: 'retryable', reason: 'blip' };}
        persisted.push(snapshot);
        return { outcome: 'confirmed' };
      });

      writer.queueWrite('room-1', { fogOfWarPaths: ['A'] });
      writer.queueWrite('room-1', { fogOfWarPaths: ['A', 'B'] });

      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.SAVED, 6000);
      expect(persisted[persisted.length - 1].fogOfWarPaths).to.deep.equal(['A', 'B']);
    });
  });

  describe('M. shutdown drain', () => {
    it('reports the real outcome and does not clear unsaved state on failure', async() => {
      const writer = createWriter(() => ({ outcome: 'retryable', reason: 'cloud down' }), {
        maxAttempts: 1,
        baseRetryDelayMs: 100000,
        flushIntervalMs: 60000
      });
      writer.queueWrite('room-1', { tokens: { keep: { id: 'keep' } } });

      const result = await writer.drain();
      expect(result.attempted).to.equal(1);
      expect(result.confirmed).to.equal(0);
      expect(result.unsaved).to.equal(1);
      expect(result.unsavedRooms).to.deep.equal(['room-1']);
      expect(writer.getStatus('room-1').cloudSaved).to.equal(false);
      expect(writer.getRetainedSnapshot('room-1')).to.not.equal(null);
    });

    it('reports confirmed when the final flush succeeds', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), { maxAttempts: 1, flushIntervalMs: 60000 });
      writer.queueWrite('room-1', { tokens: {} });

      const result = await writer.drain();
      expect(result.attempted).to.equal(1);
      expect(result.confirmed).to.equal(1);
      expect(result.unsaved).to.equal(0);
      expect(writer.getStatus('room-1').cloudSaved).to.equal(true);
    });

    it('waits for an in-flight attempt and reports its real outcome', async() => {
      let release;
      const writer = createWriter(() => new Promise((resolve) => { release = resolve; }), {
        maxAttempts: 1,
        flushIntervalMs: 60000
      });
      writer.queueWrite('room-1', { tokens: {} });

      const flushPromise = writer.flush();
      await waitFor(() => typeof release === 'function');

      const drainPromise = writer.drain();
      release({ outcome: 'confirmed' });

      const result = await drainPromise;
      await flushPromise;
      expect(result.attempted).to.equal(1);
      expect(result.confirmed).to.equal(1);
      expect(result.unsaved).to.equal(0);
    });

    it('shutdown reports unsaved retained state without manufacturing success', async() => {
      const { performGracefulShutdown } = require('../services/syncService');
      const logger = require('../services/logger');
      const errorSpy = sinon.stub(logger, 'error');

      const writer = createWriter(() => false, { maxAttempts: 1, flushIntervalMs: 60000 });
      writer.queueWrite('room-1', { tokens: { keep: { id: 'keep' } } });
      const movementStop = sinon.stub();

      const result = await performGracefulShutdown({
        firebaseBatchWriter: writer,
        movementDebouncer: { stop: movementStop }
      });

      expect(result.unsaved).to.equal(1);
      expect(errorSpy.calledWith(sinon.match('unsaved snapshots will be lost'))).to.equal(true);
      expect(movementStop.calledOnce).to.equal(true);
      expect(writer.stopped).to.equal(true);
      expect(writer.getRetainedSnapshot('room-1')).to.not.equal(null);
    });
  });

  describe('N. multiple rooms', () => {
    it('does not block room B on a slow or failing room A', async() => {
      const released = [];
      const writer = createWriter((roomId, snapshot) => {
        if (roomId === 'room-a') {
          return new Promise((resolve) => { released.push(resolve); });
        }
        return { outcome: 'confirmed' };
      });

      writer.queueWrite('room-a', { tokens: { a: { id: 'a' } } });
      writer.queueWrite('room-b', { tokens: { b: { id: 'b' } } });

      await waitFor(() => writer.getStatus('room-b').status === ROOM_SAVE_STATUS.SAVED);
      expect(writer.getStatus('room-a').cloudSaved).to.equal(false);
      expect(writer.getStatus('room-b').cloudSaved).to.equal(true);

      released.forEach((resolve) => resolve({ outcome: 'confirmed' }));
    });
  });

  describe('production writer wiring (createSyncServices)', () => {
    const { createSyncServices } = require('../services/syncService');

    it('broadcasts bounded room_save_status to current room members and skips non-permanent rooms', async() => {
      sinon.stub(firebaseService, 'updateRoomGameState').resolves(false);
      const emitted = [];
      const io = {
        to: (socketId) => ({
          emit: (event, payload) => emitted.push({ socketId, event, payload })
        })
      };
      const rooms = new Map([
        ['perm-room', {
          id: 'perm-room',
          isPermanent: true,
          players: new Map([['p1', { id: 'p1', socketId: 'sock-perm' }]])
        }],
        ['temp-room', {
          id: 'temp-room',
          isPermanent: false,
          players: new Map([['p2', { id: 'p2', socketId: 'sock-temp' }]])
        }]
      ]);
      const players = new Map([
        ['sock-perm', { id: 'p1', roomId: 'perm-room' }],
        ['sock-temp', { id: 'p2', roomId: 'temp-room' }]
      ]);

      const services = createSyncServices(io, rooms, players);
      try {
        services.firebaseBatchWriter.queueWrite('temp-room', { tokens: {} });
        await wait(60);
        expect(emitted.some(e => e.socketId === 'sock-temp')).to.equal(false);
        expect(services.firebaseBatchWriter.getStatus('temp-room').reason).to.equal('room_not_persistent');

        services.firebaseBatchWriter.queueWrite('perm-room', { tokens: {} });
        await waitFor(() => emitted.some(e => e.socketId === 'sock-perm' &&
          e.event === 'room_save_status' &&
          ['retrying', 'unsaved'].includes(e.payload.status)));
        const statusEvent = emitted.find(e => e.socketId === 'sock-perm' &&
          e.event === 'room_save_status' &&
          ['retrying', 'unsaved'].includes(e.payload.status));
        expect(statusEvent.payload.status).to.be.oneOf(['retrying', 'unsaved']);
        expect(statusEvent.payload.cloudSaved).to.equal(false);
        expect(services.firebaseBatchWriter.getRetainedSnapshot('perm-room')).to.not.equal(null);
      } finally {
        services.firebaseBatchWriter.stop();
        services.movementDebouncer.stop();
      }
    });
  });

  describe('bounded retention capacity', () => {
    it('evicts an exhausted snapshot under pressure with explicit recovery status', async() => {
      const writer = createWriter(() => false, {
        maxAttempts: 1,
        maxRetainedRooms: 2,
        baseRetryDelayMs: 100000
      });
      const events = [];
      writer.setStatusSink((roomId, payload) => events.push({ roomId, ...payload }));

      writer.queueWrite('room-1', { tokens: { one: {} } });
      await waitFor(() => writer.getStatus('room-1').status === ROOM_SAVE_STATUS.UNSAVED);
      writer.queueWrite('room-2', { tokens: { two: {} } });
      await waitFor(() => writer.getStatus('room-2').status === ROOM_SAVE_STATUS.UNSAVED);
      writer.queueWrite('room-3', { tokens: { three: {} } });

      const stats = writer.getOperationalStats();
      expect(stats.droppedSnapshots).to.be.greaterThan(0);
      expect(stats.retainedRooms).to.be.at.most(2);

      const pressure = events.find(e => e.roomId === 'room-1' && e.reason === 'retention_pressure');
      expect(pressure).to.exist;
      expect(pressure.status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(pressure.cloudSaved).to.equal(false);
      expect(writer.getStatus('room-1').cloudSaved).to.equal(false);
    });
  });
});

describe('Explicit GM save via the real production socket path (Project 2)', function() {
  this.timeout(20000);

  let server;
  let clients;
  let writer;
  let persistCalls;
  let nextOutcome;

  const openVerified = async() => {
    const userId = server.nextUserId();
    const token = `test-token:${userId}`;
    server.registerAuthToken(token, userId);
    const client = server.connect({ token });
    clients.push(client);
    await connected(client);
    return { client, userId };
  };

  const startServer = async(outcomeOrFn) => {
    persistCalls = 0;
    nextOutcome = outcomeOrFn;
    writer = new FirebaseBatchWriter(20, 50, {
      shouldPersist: () => true,
      maxAttempts: 4,
      baseRetryDelayMs: 60000,
      maxRetryDelayMs: 60000,
      persist: async() => {
        persistCalls += 1;
        const outcome = typeof nextOutcome === 'function' ? nextOutcome() : nextOutcome;
        if (outcome instanceof Error) {throw outcome;}
        return outcome;
      }
    });
    server = createProductionStackServer({ debounceMs: 80, firebaseBatchWriter: writer });
    await server.start();
    clients = [];
  };

  beforeEach(async() => {
    clients = [];
  });

  afterEach(async() => {
    for (const client of clients) {
      try { client.disconnect(); } catch (_) { /* noop */ }
    }
    clients = [];
    try { await server.stop(); } catch (_) { /* noop */ }
    writer = null;
  });

  const seedPermanentRoom = async(gm) => server.seedRoom(gm.client.id, {
    gmUserId: gm.userId,
    persistentRoomId: `persist-room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  });

  const joinMember = async(client, roomId) => {
    const joined = once(client, 'room_joined');
    client.emit('join_room', { roomId, playerName: 'Member', password: '' });
    return joined;
  };

  it('J: ordinary member explicit save is denied, persists nothing and emits no success', async() => {
    await startServer({ outcome: 'confirmed' });
    const gm = await openVerified();
    const room = await seedPermanentRoom(gm);
    const member = await openVerified();
    await joinMember(member.client, room.id);

    const callsBefore = persistCalls;
    const errorPromise = once(member.client, 'room_state_save_error');
    const savedPromise = collect(member.client, 'room_state_saved', 400);
    member.client.emit('save_room_state_request', { roomId: room.id, reason: 'member_attempt' });

    const error = await errorPromise;
    const saved = await savedPromise;
    expect(error.code).to.equal('gm_required');
    expect(error.retriable).to.equal(false);
    expect(saved).to.have.length(0);
    expect(persistCalls).to.equal(callsBefore);
  });

  it('K/R8: GM explicit save with false persistence reports failure and emits no room_state_saved', async() => {
    await startServer(false);
    const gm = await openVerified();
    const room = await seedPermanentRoom(gm);

    const errorPromise = once(gm.client, 'room_state_save_error');
    const savedPromise = collect(gm.client, 'room_state_saved', 400);
    gm.client.emit('save_room_state_request', { roomId: room.id, reason: 'gm_false' });

    const error = await errorPromise;
    const saved = await savedPromise;
    expect(error.outcome).to.equal('retryable');
    expect(error.retriable).to.equal(true);
    expect(saved).to.have.length(0);
    expect(writer.getRetainedSnapshot(room.id)).to.not.equal(null);
    expect(writer.getStatus(room.id).cloudSaved).to.equal(false);
  });

  it('K/R8: GM explicit save with a thrown persistence error reports failure', async() => {
    await startServer(() => Object.assign(new Error('cloud exploded'), { code: 'unavailable' }));
    const gm = await openVerified();
    const room = await seedPermanentRoom(gm);

    const errorPromise = once(gm.client, 'room_state_save_error');
    const savedPromise = collect(gm.client, 'room_state_saved', 400);
    gm.client.emit('save_room_state_request', { roomId: room.id, reason: 'gm_throw' });

    const error = await errorPromise;
    const saved = await savedPromise;
    expect(error.outcome).to.equal('retryable');
    expect(saved).to.have.length(0);
    expect(writer.getRetainedSnapshot(room.id)).to.not.equal(null);
  });

  it('L: confirmed GM explicit save emits exactly one success result', async() => {
    await startServer({ outcome: 'confirmed' });
    const gm = await openVerified();
    const room = await seedPermanentRoom(gm);

    const savedPromise = collect(gm.client, 'room_state_saved', 400);
    const errorPromise = collect(gm.client, 'room_state_save_error', 400);
    gm.client.emit('save_room_state_request', { roomId: room.id, reason: 'gm_success' });

    const saved = await savedPromise;
    const errors = await errorPromise;
    expect(saved).to.have.length(1);
    expect(saved[0].roomId).to.equal(room.id);
    expect(saved[0].cloudSaved).to.equal(true);
    expect(errors).to.have.length(0);
  });
});
