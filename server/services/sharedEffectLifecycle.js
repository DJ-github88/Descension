/** Bounded C4: one authenticated next-roster transition, using P7's receipt/admission owner. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const timing = require('../../vtt-react/src/services/sharedEffectTiming');
const bash = require('../../vtt-react/src/services/shieldBashResult');
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
function roster(room) {
  const combat = room.gameState.combat, order = combat?.turnOrder;
  if (!combat?.isActive || !Array.isArray(order) || !order.length || order.length > 64 ||
      !Number.isInteger(combat.currentTurnIndex) || combat.currentTurnIndex < 0 || combat.currentTurnIndex >= order.length ||
      !Number.isSafeInteger(combat.round) || combat.round < 1) actors.fail('turn_state_unavailable');
  const seen = new Set();
  for (const entry of order) {
    if (!entry.actorRef || entry.tokenId !== entry.actorRef.tokenId || seen.has(entry.tokenId)) actors.fail('turn_roster_unbound');
    actors.locate(room, entry.actorRef); seen.add(entry.tokenId);
  }
  return combat;
}
function application(room, next, ref, operation) {
  const lifecycle = next.combat?.effectLifecycle;
  if (!lifecycle?.schedules) return;
  const key = timing.instanceKey(ref, operation.recordId);
  // An explicit correction cancels timing, even when a newer GM writes identical record fields.
  delete lifecycle.schedules[key];
  if (operation.op !== 'add' || !timing.clock(room.gameState.combat)) return;
  try { roster(room); } catch (_) { return; } // unsupported combat never prevents manual result entry
  const record = operation.record, order = next.combat.turnOrder, index = next.combat.currentTurnIndex;
  if (!profile.validManagedRecord(record, ref)) return;
  const targetIndex = order.findIndex(entry => profile.sameRef(entry.actorRef, ref));
  if (targetIndex < 0) return;
  const defending = ref.kind === 'character' && profile.isDefending(record) && targetIndex === index;
  const shieldBash = profile.isStunned(record) && bash.namedRecord(record) && record.clockBoundary === bash.TIMING;
  if (!defending && !shieldBash) return;
  const distance = (targetIndex - index + order.length) % order.length || order.length;
  const dueSequence = lifecycle.sequence + distance + (shieldBash ? 1 : 0);
  if (!Number.isSafeInteger(dueSequence) || Object.keys(lifecycle.schedules).length >= 256 ||
      Object.values(lifecycle.schedules).filter(item => item.dueSequence === dueSequence).length >= 32) return; // P7 atomic capacity; extra instances remain visible/manual
  lifecycle.schedules[key] = { combatId: lifecycle.id, ref: actors.clone(ref), recordId: record.recordId,
    recordHash: actors.hash(record), recordKey: profile.canonical(record), dueSequence, boundary: shieldBash ? 'end' : 'start' };
}
function validate(request) {
  actors.keys(request, ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'mode', 'combatHash', 'expectedClock']);
  if (request.version !== 1 || !uuid(request.commandId) || !['adopt', 'advance'].includes(request.mode) ||
      typeof request.roomId !== 'string' || typeof request.actionEpoch !== 'string' || !Number.isSafeInteger(request.baseCommitSequence) || request.baseCommitSequence < 0 ||
      !/^[a-f0-9]{64}$/.test(request.combatHash || '') || actors.bytes(request) > 4096) actors.fail('invalid_turn_boundary');
  if (request.mode === 'advance') {
    actors.keys(request.expectedClock, ['id', 'sequence']);
    if (!uuid(request.expectedClock.id) || !Number.isSafeInteger(request.expectedClock.sequence) || request.expectedClock.sequence < 0) actors.fail('invalid_turn_boundary');
  } else if (request.expectedClock !== null) actors.fail('invalid_turn_boundary');
}
function stage(room, player, uid, request, confirmedRevision) {
  validate(request);
  if (!player.isGM) actors.fail('turn_gm_required');
  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) actors.fail('outcome_unknown');
  if (request.baseCommitSequence < prior.replayFloor) actors.fail('retry_window_expired');
  if (request.baseCommitSequence > prior.commitSequence) actors.fail('invalid_turn_boundary');
  const combat = roster(room);
  if (actors.hash(combat) !== request.combatHash) actors.fail('stale_turn_state');
  const current = timing.clock(combat), nextIndex = (combat.currentTurnIndex + 1) % combat.turnOrder.length;
  let staged, expired = [];
  if (request.mode === 'adopt') {
    if (current) actors.fail('turn_clock_already_active');
    const next = actors.clone(room.gameState);
    next.combat.effectLifecycle = { version: 1, id: crypto.randomUUID(), sequence: 0, positionKey: timing.positionKey(combat), schedules: {} };
    staged = actors.finishStage(room, uid, request, { kind: 'gm', authorizerUid: uid }, confirmedRevision, next, []);
  } else {
    if (!current || current.id !== request.expectedClock.id || current.sequence !== request.expectedClock.sequence) actors.fail('stale_turn_occurrence');
    const sequence = current.sequence + 1;
    if (!Number.isSafeInteger(sequence)) actors.fail('turn_clock_exhausted');
    const entries = new Map();
    for (const item of Object.values(current.schedules || {})) {
      if (item.combatId !== current.id || item.dueSequence !== sequence) continue;
      const resolved = actors.locate(room, item.ref), record = resolved.token.state.conditions?.find(r => r.recordId === item.recordId);
      if (!record || actors.hash(record) !== item.recordHash) actors.fail('stale_effect_schedule');
      const boundaryRef = combat.turnOrder[item.boundary === 'start' ? nextIndex : combat.currentTurnIndex].actorRef;
      if (!profile.sameRef(boundaryRef, item.ref)) actors.fail('stale_turn_occurrence');
      const key = actors.hash(item.ref);
      if (!entries.has(key)) entries.set(key, { ref: item.ref, expectedRevision: resolved.contract.revision, conditions: [] });
      entries.get(key).conditions.push({ op: 'remove', recordId: item.recordId }); expired.push(item.recordId);
    }
    const list = [...entries.values()];
    if (list.length > 2) actors.fail('turn_expiry_capacity');
    if (list.length) {
      const inner = { version: 1, roomId: room.id, commandId: request.commandId, actionEpoch: request.actionEpoch, baseCommitSequence: request.baseCommitSequence, actors: list };
      if (list.length === 2) { inner.source = list[0].ref; inner.target = list[1].ref; }
      staged = actors.stage(room, player, uid, inner, { kind: 'gm', authorizerUid: uid }, confirmedRevision);
      staged.receipt.contentHash = actors.hash(request);
    } else staged = actors.finishStage(room, uid, request, { kind: 'gm', authorizerUid: uid }, confirmedRevision, actors.clone(room.gameState), []);
    const next = staged.next.combat;
    next.currentTurnIndex = nextIndex;
    next.round = combat.round + (nextIndex === 0 ? 1 : 0);
    if (!Number.isSafeInteger(next.round)) actors.fail('turn_clock_exhausted');
    next.currentTurnStartTime = Date.now(); // presentation only, never an expiry input
    next.effectLifecycle.sequence = sequence;
    next.effectLifecycle.positionKey = timing.positionKey(next);
  }
  staged.receipt.adjudication = { definitionId: timing.DEFINITION_ID, definitionVersionOrHash: timing.DEFINITION_ID,
    chosenResult: JSON.stringify({ mode: request.mode, combatId: staged.next.combat.effectLifecycle.id, sequence: staged.next.combat.effectLifecycle.sequence, expired }),
    adjustmentReason: 'Authenticated turn boundary and exact-instance expiry only; no AP restoration, regeneration, payment or recurring effects.' };
  return staged;
}
module.exports = { roster, application, validate, stage };
