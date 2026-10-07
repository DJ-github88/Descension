/**
 * Project 2 last accounting fix — lost-durability accounting.
 *
 * Evicting a bounded detailed room tombstone under maxTrackedRooms pressure
 * must never turn a known unresolved durability loss into an affirmative
 * "everything saved" shutdown result. A small bounded aggregate (retained ID
 * set + overflow uncertainty count) preserves that truth without retaining
 * tombstones forever, a WAL or crash recovery.
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

const logger = require('../services/logger');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('P2 lost-durability accounting', function() {
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

  it('exact senior repro: evicted unresolved tombstone still blocks all-saved', async() => {
    const infoSpy = sinon.stub(logger, 'info');
    const errorSpy = sinon.stub(logger, 'error');

    const writer = createWriter(() => ({ outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 2
    });

    // A: unconfirmed snapshot. B: confirms and takes the retained slot via
    // capacity pressure, leaving A as an unsaved tombstone.
    writer.queueWrite('A', { edit: 'unconfirmed' });
    await writer.saveNow('B', { edit: 'confirmed' });
    expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);
    expect(writer.getStatus('A').error).to.equal('retention_pressure');
    expect(writer.getStatus('A').cloudSaved).to.equal(false);
    expect(writer.getRetainedSnapshot('A')).to.equal(null);

    // C confirms. Tracked-record pressure evicts A's detailed tombstone.
    await wait(2);
    await writer.saveNow('C', { edit: 'confirmed' });
    expect(writer.roomStates.has('A')).to.equal(false);
    expect(writer.roomStates.size).to.be.at.most(2);

    const stats = writer.getOperationalStats();
    expect(stats.evictedUnresolvedTracked).to.equal(1);
    expect(stats.evictedUnresolvedOverflow).to.equal(0);

    const result = await performGracefulShutdown({
      firebaseBatchWriter: writer,
      movementDebouncer: { stop: sinon.stub() }
    });

    expect(result.unsaved).to.be.greaterThan(0);
    expect(result.unsavedRooms).to.include('A');
    expect(result.evictedUnresolvedLosses).to.equal(0);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(false);
    expect(errorSpy.calledWith(sinon.match('unsaved snapshots will be lost'), sinon.match.any))
      .to.equal(true);
  });

  it('saved tombstone eviction creates no unresolved-loss evidence', async() => {
    const infoSpy = sinon.stub(logger, 'info');

    const writer = createWriter(() => ({ outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 2
    });

    await writer.saveNow('r0', { n: 0 });
    await writer.saveNow('r1', { n: 1 });
    await wait(2);
    await writer.saveNow('r2', { n: 2 }); // evicts saved r0

    expect(writer.roomStates.has('r0')).to.equal(false);
    expect(writer.roomStates.size).to.be.at.most(2);
    expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(0);
    expect(writer.getOperationalStats().evictedUnresolvedOverflow).to.equal(0);

    const result = await performGracefulShutdown({
      firebaseBatchWriter: writer,
      movementDebouncer: { stop: sinon.stub() }
    });

    expect(result.unsaved).to.equal(0);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(true);
  });

  it('an earlier failure that later confirmed leaves no false loss evidence', async() => {
    const infoSpy = sinon.stub(logger, 'info');

    let failing = true;
    const writer = createWriter(() => (failing ? false : { outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 2,
      maxAttempts: 1,
      baseRetryDelayMs: 100000
    });

    // A fails, exhausts, then confirms on a new edit: its old unsaved state
    // was repaired, so no loss evidence may survive its tombstone eviction.
    writer.queueWrite('A', { n: 1 });
    await writer.saveNow('A', { n: 1 });
    expect(writer.getStatus('A').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

    failing = false;
    await writer.saveNow('A', { n: 2 });
    expect(writer.getStatus('A').cloudSaved).to.equal(true);

    await wait(2);
    await writer.saveNow('B', { n: 3 });
    await wait(2);
    await writer.saveNow('C', { n: 4 }); // evicts saved A tombstone

    expect(writer.roomStates.has('A')).to.equal(false);
    expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(0);
    expect(writer.getOperationalStats().evictedUnresolvedOverflow).to.equal(0);

    const result = await performGracefulShutdown({
      firebaseBatchWriter: writer,
      movementDebouncer: { stop: sinon.stub() }
    });
    expect(result.unsaved).to.equal(0);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(true);
  });

  it('multiple evicted unresolved tombstones stay accounted', async() => {
    const errorSpy = sinon.stub(logger, 'error');
    const infoSpy = sinon.stub(logger, 'info');

    const writer = createWriter(() => ({ outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 4
    });

    writer.queueWrite('loss1', { n: 1 });
    await wait(2);
    await writer.saveNow('w1', { n: 2 }); // loss1 becomes a tombstone
    expect(writer.getStatus('loss1').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

    await wait(2);
    writer.queueWrite('loss2', { n: 3 });
    await wait(2);
    await writer.saveNow('w2', { n: 4 }); // loss2 becomes a tombstone
    expect(writer.getStatus('loss2').status).to.equal(ROOM_SAVE_STATUS.UNSAVED);

    await wait(2);
    await writer.saveNow('w3', { n: 5 }); // evicts loss1
    await wait(2);
    await writer.saveNow('w4', { n: 6 }); // evicts w1 (saved)
    await wait(2);
    await writer.saveNow('w5', { n: 7 }); // evicts loss2

    expect(writer.roomStates.has('loss1')).to.equal(false);
    expect(writer.roomStates.has('loss2')).to.equal(false);
    expect(writer.roomStates.size).to.be.at.most(4);
    expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(2);

    const result = await writer.drain();
    expect(result.unsaved).to.equal(2);
    expect(result.unsavedRooms).to.have.members(['loss1', 'loss2']);
    expect(result.evictedUnresolvedLosses).to.equal(0);

    errorSpy.resetHistory();
    await performGracefulShutdown({
      firebaseBatchWriter: writer,
      movementDebouncer: { stop: sinon.stub() }
    });
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(false);
  });

  it('a reliable same-room confirmation clears its aggregated loss evidence', async() => {
    const infoSpy = sinon.stub(logger, 'info');

    const writer = createWriter(() => ({ outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 2
    });

    writer.queueWrite('A', { edit: 'unconfirmed' });
    await writer.saveNow('B', { edit: 'confirmed' });
    await wait(2);
    await writer.saveNow('C', { edit: 'confirmed' });
    expect(writer.roomStates.has('A')).to.equal(false);
    expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(1);

    // A later confirmed save for the SAME room is a reliable repair.
    const recovered = await writer.saveNow('A', { edit: 'recovered' });
    expect(recovered.outcome).to.equal('confirmed');
    expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(0);
    expect(writer.getStatus('A').cloudSaved).to.equal(true);

    const result = await performGracefulShutdown({
      firebaseBatchWriter: writer,
      movementDebouncer: { stop: sinon.stub() }
    });
    expect(result.unsaved).to.equal(0);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(true);
  });

  it('overflow uncertainty is conserved when evicted identity can no longer be retained', async() => {
    const infoSpy = sinon.stub(logger, 'info');

    const options = {
      maxRetainedRooms: 1,
      maxTrackedRooms: 2,
      maxEvictedUnresolvedTracked: 1
    };

    // Builds: set{loss1} retained identity, overflow uncertainty 1,
    // loss3 still a retryable pending snapshot, within maxTrackedRooms 2.
    const buildOverflowState = async() => {
      const writer = createWriter(() => ({ outcome: 'confirmed' }), options);
      writer.queueWrite('loss1', { n: 1 });
      await wait(2);
      await writer.saveNow('w1', { n: 2 });
      await wait(2);
      writer.queueWrite('loss2', { n: 3 });
      await wait(2);
      await writer.saveNow('w2', { n: 4 }); // evicts loss1 identity-set full
      await wait(2);
      writer.queueWrite('loss3', { n: 5 }); // evicts loss2 -> overflow uncertainty
      expect(writer.roomStates.size).to.be.at.most(2);
      expect(writer.getOperationalStats().evictedUnresolvedTracked).to.equal(1);
      expect(writer.getOperationalStats().evictedUnresolvedOverflow).to.equal(1);
      return writer;
    };

    // Shutdown accounting keeps both the named loss and the uncertainty.
    const first = await buildOverflowState();
    const result = await performGracefulShutdown({
      firebaseBatchWriter: first,
      movementDebouncer: { stop: sinon.stub() }
    });
    expect(result.unsaved).to.equal(2); // loss1 identity + 1 uncertainty
    expect(result.unsavedRooms).to.deep.equal(['loss1']);
    expect(result.evictedUnresolvedLosses).to.equal(1);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(false);

    // Repairing the named loss clears only its retained identity; the
    // discarded-identity uncertainty conservatively remains.
    const second = await buildOverflowState();
    await second.flush(); // confirms the retryable loss3
    expect(second.getStatus('loss3').cloudSaved).to.equal(true);

    const repaired = await second.saveNow('loss1', { n: 8 });
    expect(repaired.outcome).to.equal('confirmed');
    expect(second.getOperationalStats().evictedUnresolvedTracked).to.equal(0);
    expect(second.getOperationalStats().evictedUnresolvedOverflow).to.equal(1);

    infoSpy.resetHistory();
    const after = await performGracefulShutdown({
      firebaseBatchWriter: second,
      movementDebouncer: { stop: sinon.stub() }
    });
    expect(after.unsaved).to.equal(1);
    expect(after.unsavedRooms).to.deep.equal([]);
    expect(after.evictedUnresolvedLosses).to.equal(1);
    expect(infoSpy.calledWith(sinon.match('All pending room state confirmed saved'), sinon.match.any))
      .to.equal(false);
  });

  it('existing snapshot-loss accounting still works before eviction', async() => {
    const writer = createWriter(() => ({ outcome: 'confirmed' }), {
      maxRetainedRooms: 1,
      maxTrackedRooms: 3
    });

    writer.queueWrite('A', { n: 1 });
    await writer.saveNow('B', { n: 2 });

    expect(writer.roomStates.has('A')).to.equal(true);
    const result = await writer.drain();
    expect(result.attempted).to.equal(0);
    expect(result.unsaved).to.equal(1);
    expect(result.unsavedRooms).to.deep.equal(['A']);
    expect(result.evictedUnresolvedLosses).to.equal(0);
  });
});
