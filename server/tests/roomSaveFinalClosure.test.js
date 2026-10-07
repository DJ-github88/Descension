/**
 * Project 2 final closure pass — remaining B2/B3 corrections.
 *
 * B2  retained-slot admission applies to existing saved/pressure records too;
 *     a tracked record without a snapshot cannot silently attach retained
 *     work beyond maxRetainedRooms.
 * B3  shutdown accounting includes status-only unresolved retention/admission
 *     loss records, and each room finalizes independently under one global
 *     deadline so a hung room cannot starve another room's final attempt.
 *
 * Persistence is stubbed at its external boundary only; the writer contract
 * itself is exercised for real.
 */

const { expect } = require('chai');
const sinon = require('sinon');

const {
  FirebaseBatchWriter,
  ROOM_SAVE_STATUS,
  performGracefulShutdown
} = require('../services/syncService');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const deferred = () => {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
};

const tick = async() => {
  for (let i = 0; i < 20; i++) {await Promise.resolve();}
};

describe('P2 final closure (remaining B2/B3)', function() {
  this.timeout(20000);

  const writers = [];
  const createWriter = (persist, options = {}) => {
    const writer = new FirebaseBatchWriter(60000, 50, { persist, ...options });
    writers.push(writer);
    return writer;
  };

  afterEach(() => {
    for (const writer of writers.splice(0)) {writer.stop();}
    sinon.restore();
  });

  describe('B2 — reactivation capacity', () => {
    it('exact senior repro: an existing saved record cannot bypass the retained bound', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });
      const events = [];
      writer.setStatusSink((roomId, payload) => events.push({ roomId, ...payload }));

      await writer.saveNow('A', { n: 1 });
      expect(writer.getStatus('A').cloudSaved).to.equal(true);
      expect(writer.pendingWrites.has('A')).to.equal(false);

      const held = deferred();
      writer.persist = () => held.promise;
      writer.queueWrite('B', { n: 2 }, true);
      await tick();
      expect(writer.pendingWrites.size).to.equal(1);
      expect(writer.getOperationalStats().inFlight).to.equal(1);

      const rejected = writer.queueWrite('A', { n: 3 }, true);

      expect(rejected).to.equal(null);
      expect(writer.pendingWrites.size).to.equal(1);
      expect(writer.getOperationalStats().rejectedAdmissions).to.equal(1);
      expect(writer.getOperationalStats().droppedSnapshots).to.equal(0);
      expect(writer.getRetainedSnapshot('A')).to.equal(null);

      const status = writer.getStatus('A');
      expect(status.status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(status.cloudSaved).to.equal(false);
      expect(status.error).to.equal('retention_capacity');

      const pressure = events.find(e => e.roomId === 'A' && e.reason === 'retention_capacity');
      expect(pressure).to.exist;
      expect(pressure.cloudSaved).to.equal(false);
      expect(pressure.recoveryNeeded).to.equal(true);

      held.resolve({ outcome: 'confirmed' });
      await tick();
    });

    it('saved tombstone reactivates normally when capacity is free', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      await writer.saveNow('A', { n: 1 });
      const revision = writer.queueWrite('A', { n: 2 });

      expect(revision).to.be.a('number');
      expect(writer.pendingWrites.size).to.equal(1);
      expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.PENDING);
      expect(writer.getRetainedSnapshot('A').n).to.equal(2);
    });

    it('retention-loss tombstone reapplies the capacity policy on the next edit', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      // A holds the retained slot, then B (in-flight, non-evictable) takes it
      // via explicit pressure.
      const held = deferred();
      writer.queueWrite('A', { n: 1 });
      const heldPersist = () => held.promise;
      writer.persist = heldPersist;
      writer.queueWrite('B', { n: 2 }, true);
      await tick();

      expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(writer.getStatus('A').error).to.equal('retention_pressure');
      expect(writer.pendingWrites.size).to.equal(1);

      const before = writer.getOperationalStats().rejectedAdmissions;
      const rejected = writer.queueWrite('A', { n: 3 }, true);

      expect(rejected).to.equal(null);
      expect(writer.getOperationalStats().rejectedAdmissions).to.equal(before + 1);
      expect(writer.pendingWrites.size).to.equal(1);
      expect(writer.getStatus('A').cloudSaved).to.equal(false);

      held.resolve({ outcome: 'confirmed' });
      await tick();
    });

    it('already-retained replacement reuses the same slot', () => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      writer.queueWrite('A', { n: 1 });
      expect(writer.pendingWrites.size).to.equal(1);

      const revision = writer.queueWrite('A', { n: 2 });
      expect(revision).to.be.a('number');
      expect(writer.pendingWrites.size).to.equal(1);
      expect(writer.getRetainedSnapshot('A').n).to.equal(2);
      expect(writer.getOperationalStats().rejectedAdmissions).to.equal(0);
      expect(writer.getOperationalStats().droppedSnapshots).to.equal(0);
    });

    it('reactivation churn cannot exceed the tracked-room bound', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 2,
        maxTrackedRooms: 3
      });

      for (let i = 0; i < 12; i++) {
        await writer.saveNow(`room${i}`, { n: i });
        expect(writer.roomStates.size).to.be.at.most(3);
      }

      const survivor = `room${11}`;
      expect(writer.roomStates.has(survivor)).to.equal(true);
      writer.queueWrite(survivor, { n: 99 });
      expect(writer.roomStates.size).to.be.at.most(3);
    });
  });

  describe('B3 — shutdown accounting', () => {
    it('exact senior repro: retention-loss record appears in unsaved accounting', async() => {
      const logger = require('../services/logger');
      const infoSpy = sinon.stub(logger, 'info');
      const errorSpy = sinon.stub(logger, 'error');

      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      writer.queueWrite('A', { n: 1 });
      await writer.saveNow('B', { n: 2 });

      expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(writer.getStatus('A').error).to.equal('retention_pressure');
      expect(writer.getRetainedSnapshot('A')).to.equal(null);

      const result = await performGracefulShutdown({
        firebaseBatchWriter: writer,
        movementDebouncer: { stop: sinon.stub() }
      });

      expect(result.attempted).to.equal(0);
      expect(result.confirmed).to.equal(0);
      expect(result.unsaved).to.equal(1);
      expect(result.unsavedRooms).to.deep.equal(['A']);
      expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
        .to.equal(false);
      expect(errorSpy.calledWith(sinon.match('unsaved snapshots will be lost'), sinon.match.any))
        .to.equal(true);
    });

    it('pressure loss cleared by a later confirmed save is not reported unresolved', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      writer.queueWrite('A', { n: 1 });
      await writer.saveNow('B', { n: 2 });
      expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

      const recovered = await writer.saveNow('A', { n: 3 });
      expect(recovered.outcome).to.equal('confirmed');
      expect(writer.getStatus('A').cloudSaved).to.equal(true);

      const result = await writer.drain();
      expect(result.attempted).to.equal(0);
      expect(result.unsaved).to.equal(0);
      expect(result.unsavedRooms).to.deep.equal([]);
    });

    it('lists every status-only unresolved room', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 4
      });

      writer.queueWrite('lost-a', { n: 1 });
      await writer.saveNow('winner', { n: 2 });
      writer.queueWrite('lost-c', { n: 3 });
      writer.queueWrite('holder', { n: 4 });

      const result = await writer.drain();
      expect(result.attempted).to.equal(1); // holder can retry; losses cannot
      expect(result.confirmed).to.equal(1); // holder confirms
      expect(result.unsaved).to.equal(2);
      expect(result.unsavedRooms).to.have.members(['lost-a', 'lost-c']);
      expect(result.unsavedRooms).to.not.include('holder');
    });

    it('a saved tombstone does not count as unsaved', async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), {
        maxRetainedRooms: 1,
        maxTrackedRooms: 3
      });

      await writer.saveNow('A', { n: 1 });
      const result = await writer.drain();
      expect(result.attempted).to.equal(0);
      expect(result.unsaved).to.equal(0);
      expect(result.unsavedRooms).to.deep.equal([]);
    });
  });

  describe('B3 — independent final attempts', () => {
    it('exact senior repro: hung A does not starve exhausted B final attempt', async() => {
      const hung = deferred();
      const calls = { A: 0, B: 0 };
      let recovered = false;
      const writer = createWriter((roomId) => {
        calls[roomId] += 1;
        if (roomId === 'A') {return hung.promise;}
        return recovered ? { outcome: 'confirmed' } : false;
      }, {
        maxAttempts: 1,
        shutdownDeadlineMs: 60
      });

      await writer.saveNow('B', { n: 2 });
      expect(writer.getStatus('B').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

      writer.queueWrite('A', { n: 1 }, true);
      await tick();
      expect(calls.A).to.equal(1);

      recovered = true;
      const result = await writer.drain();

      expect(calls.B).to.equal(2, 'room B must receive its final attempt');
      expect(calls.A).to.equal(1, 'no second same-room attempt for hung A');
      expect(result.attempted).to.equal(2);
      expect(result.confirmed).to.equal(1);
      expect(result.timedOut).to.equal(true);
      expect(result.unsavedRooms).to.deep.equal(['A']);

      writer.stop();
      hung.resolve({ outcome: 'retryable', reason: 'late' });
      await wait(20);
      expect(calls.A).to.equal(1, 'no new same-room attempt after stop');
    });

    it('two independent exhausted rooms both get a final attempt', async() => {
      let firstA = true;
      let firstB = true;
      const writer = createWriter((roomId) => {
        if (roomId === 'A' && firstA) {firstA = false; return false;}
        if (roomId === 'B' && firstB) {firstB = false; return false;}
        return { outcome: 'confirmed' };
      }, {
        maxAttempts: 1,
        shutdownDeadlineMs: 300
      });

      await writer.saveNow('A', { n: 1 });
      await writer.saveNow('B', { n: 2 });
      expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
      expect(writer.getStatus('B').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

      const result = await writer.drain();
      expect(result.attempted).to.equal(2);
      expect(result.confirmed).to.equal(2);
      expect(result.unsaved).to.equal(0);
      expect(result.timedOut).to.equal(false);
    });

    it('hung A plus permanent B: B is not retried but is accounted unresolved', async() => {
      const hung = deferred();
      const calls = { A: 0, B: 0 };
      const writer = createWriter((roomId) => {
        calls[roomId] += 1;
        if (roomId === 'A') {return hung.promise;}
        return { outcome: 'permanent', reason: 'permission denied' };
      }, {
        shutdownDeadlineMs: 60
      });

      await writer.saveNow('B', { n: 2 });
      writer.queueWrite('A', { n: 1 }, true);
      await tick();

      const result = await writer.drain();
      expect(calls.B).to.equal(1, 'permanent rejection must not be retried');
      expect(result.unsavedRooms).to.include('A');
      expect(result.unsavedRooms).to.include('B');
      expect(result.timedOut).to.equal(true);

      writer.stop();
      hung.resolve(false);
      await tick();
    });

    it('hung A plus status-only retention loss B: B accounted, not retried', async() => {
      const hung = deferred();
      const calls = { A: 0, lost: 0 };
      let aHangs = false;
      const writer = createWriter((roomId) => {
        if (roomId === 'lost') {
          calls.lost += 1;
          return { outcome: 'confirmed' };
        }
        calls.A += 1;
        return aHangs ? hung.promise : { outcome: 'confirmed' };
      }, {
        maxRetainedRooms: 1,
        maxTrackedRooms: 4,
        shutdownDeadlineMs: 60
      });

      writer.queueWrite('lost', { n: 1 });
      await writer.saveNow('A', { n: 2 });
      expect(writer.getStatus('lost').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

      aHangs = true;
      writer.queueWrite('A', { n: 3 }, true);
      await tick();

      const result = await writer.drain();
      expect(calls.lost).to.equal(0, 'status-only loss has no retry copy and must not be retried');
      expect(calls.A).to.equal(2, 'no second same-room attempt while A is in flight');
      expect(result.unsavedRooms).to.have.members(['A', 'lost']);
      expect(result.timedOut).to.equal(true);

      writer.stop();
      hung.resolve(false);
      await tick();
    });

    it('several final attempts stay within one global deadline', async() => {
      const blockers = [deferred(), deferred(), deferred()];
      const started = { A: false, B: false, C: false };
      const writer = createWriter((roomId) => {
        if (!started[roomId]) {
          started[roomId] = true;
          return false;
        }
        return blockers[['A', 'B', 'C'].indexOf(roomId)].promise;
      }, {
        maxAttempts: 1,
        shutdownDeadlineMs: 80
      });

      await writer.saveNow('A', { n: 1 });
      await writer.saveNow('B', { n: 2 });
      await writer.saveNow('C', { n: 3 });

      const begin = Date.now();
      const result = await writer.drain();
      const elapsed = Date.now() - begin;

      expect(elapsed).to.be.lessThan(600, 'drain must not extend the global deadline per room');
      expect(result.timedOut).to.equal(true);
      expect(result.unsaved).to.equal(3);

      writer.stop();
      blockers.forEach(blocker => blocker.resolve({ outcome: 'confirmed' }));
      await tick();
    });
  });
});
