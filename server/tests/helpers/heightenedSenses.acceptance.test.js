/**
 * First-playable passive readiness - PENDING acceptance rows.
 *
 * Every row below is PENDING until the creator answers CREATOR_CARD.md and the
 * healing takeover owner implements the one approved passive contract. A
 * skipped row is never a pass.
 *
 * Run through run-passive-readiness.cjs. The runner sets PASSIVE_APPROVED=1
 * only when `--approved` is passed.
 */
const assert = require('assert/strict');
const { createPassiveHarness } = require('./passiveReadinessHarness');
const profile = require('./profiles');

const HEIGHTENED_SENSES = profile.readFixture('heightened-senses.record.json');
const clone = value => JSON.parse(JSON.stringify(value));
const PENDING = 'PENDING - creator answer + one-passive implementation required (run with --approved).';

function skipUnlessApproved(ctx) {
  if (!profile.APPROVED) { ctx.skip(PENDING); }
}
const listOf = async(h, socket = h.gm) => {
  const result = await h.list(socket);
  assert.equal(result.success, true, JSON.stringify(result));
  return result;
};
const active = result => (result.activations || []).filter(item => item.state === 'active');
const expectedBonus = () => (profile.STACKING === 'both-copies' ? 4 : 2);

describe('First playable passive - ACCEPTANCE (PENDING)', function() {
  this.timeout(30000);
  let h;
  beforeEach(async() => { h = await createPassiveHarness(); });
  afterEach(async() => { await h.stop(); });

  it('STORED IS NOT ACTIVE: saving/admitting the record alone creates no activation and no initiative bonus', async function() {
    skipUnlessApproved(this);
    h.storeRecord(HEIGHTENED_SENSES);
    const before = await listOf(h);
    assert.deepEqual(active(before), []);
    assert.equal(before.status, 'stored');

    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiative, 10);
    assert.equal(entry.initiativeMod, 0);
    assert.equal(h.live().gameState.passiveLedger, undefined);
  });

  it('ACTIVATION AUTHORITY: only the current GM can switch it on for one exact character; owner, observer, wrong target and wrong source are refused', async function() {
    skipUnlessApproved(this);
    const byOwner = await h.ack(h.owner, 'actor_passive_activate', h.activationPayload(h.pc));
    assert.equal(byOwner.success, false, JSON.stringify(byOwner));
    assert.equal(byOwner.code, 'forbidden');
    const byObserver = await h.ack(h.observer, 'actor_passive_activate', h.activationPayload(h.pc));
    assert.equal(byObserver.success, false, JSON.stringify(byObserver));
    assert.equal(byObserver.code, 'forbidden');

    const wrongTarget = await h.activate(h.foe);
    assert.equal(wrongTarget.success, false, JSON.stringify(wrongTarget));
    assert.ok(['unsupported_passive_target', 'secondary_attachment'].includes(wrongTarget.code), JSON.stringify(wrongTarget));

    const wrongSource = await h.activate(h.pc, { sourceRecordId: 'not-heightened-senses' });
    assert.equal(wrongSource.success, false, JSON.stringify(wrongSource));
    assert.equal(wrongSource.code, 'unsupported_passive');

    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true, JSON.stringify(activated));
    assert.equal(activated.activation.passiveId, 'heightened-senses');
    assert.equal(activated.activation.target.characterId, 'c');
    const listed = await listOf(h);
    assert.equal(active(listed).length, 1);
    assert.equal(listed.status, 'active');
  });

  it('DUPLICATE ACTIVATION: a second activation for the same character/passive is refused; an exact replay returns the same activation', async function() {
    skipUnlessApproved(this);
    const payload = h.activationPayload(h.pc);
    const first = await h.ack(h.gm, 'actor_passive_activate', payload);
    assert.equal(first.success, true, JSON.stringify(first));

    const duplicate = await h.activate(h.pc);
    assert.equal(duplicate.success, false, JSON.stringify(duplicate));
    assert.equal(duplicate.code, 'passive_already_active');

    const replay = await h.ack(h.gm, 'actor_passive_activate', payload);
    assert.equal(replay.success, true, JSON.stringify(replay));
    assert.equal(replay.activation.activationId, first.activation.activationId);
    assert.equal(active(await listOf(h)).length, 1);
  });

  it('OWNERSHIP/INCARNATION CHANGE: a replaced source or changed owner makes the activation ineligible; no stale bonus survives', async function() {
    skipUnlessApproved(this);
    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    await h.startCombat({ pc: 10, foe: 8 });

    // The exact incarnation is part of the activation binding. A sheet/contract
    // revision change is the smallest non-destructive proof of ineligibility.
    h.token(h.pc).state.actorContract.revision += 1;
    const listed = await listOf(h);
    assert.equal(active(listed).length, 0, JSON.stringify(listed));
    assert.ok((listed.activations || []).some(item => item.state === 'stale' || item.state === 'inactive'));

    const next = await h.activate(h.pc);
    assert.equal(next.success, false, JSON.stringify(next));
    assert.ok(['stale_actor_revision', 'passive_activation_stale', 'passive_already_active'].includes(next.code), JSON.stringify(next));
  });

  it('REVOCATION/DEACTIVATION: revoking stops future rolls, leaves an already-rolled initiative unchanged, and an exact replay revokes once', async function() {
    skipUnlessApproved(this);
    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    const beforeRoll = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(beforeRoll.initiativeMod, expectedBonus());

    const revokePayload = h.revokePayload(first.activation.activationId);
    const revoked = await h.ack(h.gm, 'actor_passive_revoke', revokePayload);
    assert.equal(revoked.success, true, JSON.stringify(revoked));
    const afterRevoke = await h.list();
    assert.deepEqual(active(afterRevoke), []);
    assert.equal(h.entry(h.pc).initiative, beforeRoll.initiative, 'the already-rolled total is not rewritten');

    const replay = await h.ack(h.gm, 'actor_passive_revoke', revokePayload);
    assert.equal(replay.success, true, JSON.stringify(replay));

    await h.endCombat();
    const afterRestart = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(afterRestart.initiativeMod, 0);
    assert.equal(afterRestart.initiative, 10);
  });

  it('WRITER REFUSAL AND REPLAY: a refused install changes nothing; the exact retry installs exactly one activation', async function() {
    skipUnlessApproved(this);
    const before = clone(h.live().gameState);
    const payload = h.activationPayload(h.pc);
    const real = h.writer.admitConsequence.bind(h.writer);
    let refuse = true;
    h.writer.admitConsequence = (...args) => (refuse ? { queued: false, code: 'writer_admission_refused' } : real(...args));

    const refused = await h.ack(h.gm, 'actor_passive_activate', payload);
    assert.equal(refused.success, false, JSON.stringify(refused));
    assert.equal(refused.code, 'writer_admission_refused');
    assert.deepEqual(h.live().gameState, before);

    refuse = false;
    const retried = await h.ack(h.gm, 'actor_passive_activate', payload);
    assert.equal(retried.success, true, JSON.stringify(retried));
    assert.equal(active(await listOf(h)).length, 1);
  });

  it('CHECKPOINT RECOVERY: an activation survives rebuild, applies once, and can still be revoked afterwards', async function() {
    skipUnlessApproved(this);
    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    h.rebuild();

    const restored = await listOf(h);
    assert.equal(active(restored).length, 1);
    assert.equal(active(restored)[0].activationId, first.activation.activationId);

    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiativeMod, expectedBonus());
    assert.equal(entry.initiative, 10 + expectedBonus());

    const revoked = await h.revoke(first.activation.activationId);
    assert.equal(revoked.success, true, JSON.stringify(revoked));
    assert.deepEqual(active(await listOf(h)), []);
  });

  it('STACKING one-copy-additive (RECOMMENDED): one copy, additive with another initiative modifier, duplicate refused', async function() {
    if (profile.STACKING !== 'one-copy-additive') { this.skip(); }
    skipUnlessApproved(this);
    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    const duplicate = await h.activate(h.pc);
    assert.equal(duplicate.success, false, JSON.stringify(duplicate));

    h.token(h.pc).character.stats.initiativeMod = 3;
    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiativeMod, 5, 'base 3 + passive 2');
    assert.equal(entry.initiative, 15);
  });

  it('STACKING exclusive: one copy; no combination with another passive initiative modifier (a non-passive sheet base still applies)', async function() {
    if (profile.STACKING !== 'exclusive') { this.skip(); }
    skipUnlessApproved(this);
    assert.equal((await h.activate(h.pc)).success, true);
    const duplicate = await h.activate(h.pc);
    assert.equal(duplicate.success, false, JSON.stringify(duplicate));

    h.token(h.pc).character.stats.initiativeMod = 3;
    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiativeMod, 5, 'base 3 + passive 2; only a second passive would be excluded');
    assert.equal(entry.initiative, 15);
  });

  it('STACKING both-copies: two copies of the same passive both apply', async function() {
    if (profile.STACKING !== 'both-copies') { this.skip(); }
    skipUnlessApproved(this);
    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    const second = await h.activate(h.pc);
    assert.equal(second.success, true, JSON.stringify(second));
    assert.notEqual(second.activation.activationId, first.activation.activationId);

    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiativeMod, 4);
    assert.equal(entry.initiative, 14);
  });

  it('TRUTHFUL CARD/REVIEW STATUS: stored, active and inactive are distinct; the +2 line appears only while active', async function() {
    skipUnlessApproved(this);
    const stored = await listOf(h);
    assert.equal(stored.status, 'stored');
    assert.equal(stored.effectText, null);
    assert.equal(stored.executableClaim, false);

    const first = await h.activate(h.pc);
    assert.equal(first.success, true, JSON.stringify(first));
    const activeStatus = await listOf(h);
    assert.equal(activeStatus.status, 'active');
    assert.equal(activeStatus.effectText, '+2 initiative');
    assert.equal(activeStatus.executableClaim, false, 'a passive modifier is not an executable cast');

    const revoked = await h.revoke(first.activation.activationId);
    assert.equal(revoked.success, true, JSON.stringify(revoked));
    const inactive = await listOf(h);
    assert.equal(inactive.status, 'stored', 'the record is still stored after revocation');
    assert.equal(inactive.effectText, null);
  });

  it('PF-6: this passive contract has no authored trigger, so activation must not require one', async function() {
    skipUnlessApproved(this);
    assert.equal(HEIGHTENED_SENSES.triggerConfig, undefined, 'the real record has no trigger section');
    const activated = await h.activate(h.pc);
    assert.equal(activated.success, true, JSON.stringify(activated));
    const listed = await listOf(h);
    assert.equal(listed.status, 'active');

    const entry = await h.startCombat({ pc: 10, foe: 8 });
    assert.equal(entry.initiativeMod, expectedBonus());
  });
});
