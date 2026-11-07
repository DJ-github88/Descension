/** Bounded C4: one authenticated next-roster transition, using P7's receipt/admission owner. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const profile = require('../shared/services/sharedConditionProfile');
const timing = require('../shared/services/sharedEffectTiming');
const bash = require('../shared/services/shieldBashResult');
// M5 (C4 v2): bounded due-tick obligations. Technical capacity limits, never game rules.
const MAX_TICKS_PER_BOUNDARY = 32, MAX_OPEN_TICKS = 64, MAX_RESOLVED_TICKS = 256;
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
  if (!lifecycle?.schedules) return false;
  const key = timing.instanceKey(ref, operation.recordId);
  // An explicit correction cancels timing, even when a newer GM writes identical record fields.
  delete lifecycle.schedules[key];
  if (operation.op !== 'add' || !timing.clock(room.gameState.combat)) return false;
  try { roster(room); } catch (_) { return false; } // unsupported combat never prevents manual result entry
  const record = operation.record, order = next.combat.turnOrder, index = next.combat.currentTurnIndex;
  if (!profile.validManagedRecord(record, ref)) return false;
  const targetIndex = order.findIndex(entry => profile.sameRef(entry.actorRef, ref));
  if (targetIndex < 0) return false;
  const defending = ref.kind === 'character' && profile.isDefending(record) && targetIndex === index;
  const shieldBash = profile.isStunned(record) && bash.namedRecord(record) && record.clockBoundary === bash.TIMING;
  // A10: authored-effect records name their own structured boundary (start/end of the target's strictly next turn).
  const authored = profile.structuredBoundary(record);
  if (!defending && !shieldBash && !authored) return false;
  const endBoundary = shieldBash || authored === 'end';
  const distance = (targetIndex - index + order.length) % order.length || order.length;
  // M2A: the first occurrence is the existing strictly-next boundary; each further counted occurrence is one roster cycle later.
  const occurrences = profile.structuredOccurrences(record) || 1;
  const dueSequence = lifecycle.sequence + distance + (endBoundary ? 1 : 0) + (occurrences - 1) * order.length;
  if (!Number.isSafeInteger(dueSequence) || Object.keys(lifecycle.schedules).length >= 256 ||
      Object.values(lifecycle.schedules).filter(item => item.dueSequence === dueSequence).length >= 32) return false; // P7 atomic capacity; extra instances remain visible/manual
  lifecycle.schedules[key] = { combatId: lifecycle.id, ref: actors.clone(ref), recordId: record.recordId,
    recordHash: actors.hash(record), recordKey: profile.canonical(record), dueSequence, boundary: endBoundary ? 'end' : 'start' };
  if (occurrences > 1) Object.assign(lifecycle.schedules[key], { occurrences, period: order.length });
  return true;
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
  let staged;
  const expired = [], counted = [], ticks = [];
  if (request.mode === 'adopt') {
    if (current) actors.fail('turn_clock_already_active');
    const next = actors.clone(room.gameState);
    const retained = retainOpenTicks(combat);
    next.combat.effectLifecycle = { version: 1, id: crypto.randomUUID(), sequence: 0, positionKey: timing.positionKey(combat), schedules: {} };
    if (retained) next.combat.retiredPeriodicTicks = retained;
    staged = actors.finishStage(room, uid, request, { kind: 'gm', authorizerUid: uid }, confirmedRevision, next, []);
  } else {
    if (!current || current.id !== request.expectedClock.id || current.sequence !== request.expectedClock.sequence) actors.fail('stale_turn_occurrence');
    const sequence = current.sequence + 1;
    if (!Number.isSafeInteger(sequence)) actors.fail('turn_clock_exhausted');
    const entries = new Map();
    for (const item of Object.values(current.schedules || {})) {
      const hit = item.combatId === current.id ? timing.occurrenceAt(item, sequence) : null;
      if (!hit) continue;
      // M2A: a counted schedule is bound to the roster it was made for; any other length means the clock should already have retired.
      if (item.occurrences > 1 && item.period !== combat.turnOrder.length) { actors.fail('stale_effect_schedule'); }
      const resolved = actors.locate(room, item.ref), record = resolved.token.state.conditions?.find(r => r.recordId === item.recordId);
      if (!record || actors.hash(record) !== item.recordHash) actors.fail('stale_effect_schedule');
      if ((profile.structuredOccurrences(record) || 1) !== (item.occurrences || 1)) { actors.fail('stale_effect_schedule'); } // review note C: the schedule must match the record's own count
      const boundaryRef = combat.turnOrder[item.boundary === 'start' ? nextIndex : combat.currentTurnIndex].actorRef;
      if (!profile.sameRef(boundaryRef, item.ref)) actors.fail('stale_turn_occurrence');
      // M5: every scheduled boundary of a periodic instance — its last one included — records ONE due tick. No HP changes here.
      if (profile.isPeriodicTick(record)) ticks.push(obligation(item, record, hit, sequence));
      if (!hit.final) { counted.push({ recordId: item.recordId, occurrence: hit.occurrence, of: hit.of }); continue; } // counted, still active
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
    require('./authoredCooldowns').release(room, staged.next, sequence);
    if (ticks.length) {
      const open = Object.assign({}, next.effectLifecycle.dueTicks || {});
      if (ticks.length > MAX_TICKS_PER_BOUNDARY || Object.keys(open).length + ticks.length > MAX_OPEN_TICKS)
        actors.fail('periodic_tick_capacity', `Too many periodic ticks are waiting (${Object.keys(open).length} open). Resolve or dismiss due ticks before advancing the turn; nothing changed.`);
      for (const tick of ticks) {
        if (open[tick.tickId] || (next.effectLifecycle.resolvedTicks || []).includes(tick.tickId)) actors.fail('stale_turn_occurrence');
        open[tick.tickId] = tick;
      }
      next.effectLifecycle.dueTicks = open;
      // Instances that ended by delivering their own last tick: their earlier open ticks stay resolvable (GM removal is not this).
      const ended = ticks.filter(t => t.final).map(t => t.recordId);
      if (ended.length) next.effectLifecycle.endedPeriodic = [...(next.effectLifecycle.endedPeriodic || []), ...ended].slice(-MAX_RESOLVED_TICKS);
    }
  }
  staged.receipt.adjudication = { definitionId: timing.DEFINITION_ID, definitionVersionOrHash: timing.DEFINITION_ID,
    chosenResult: JSON.stringify(Object.assign({ mode: request.mode, combatId: staged.next.combat.effectLifecycle.id, sequence: staged.next.combat.effectLifecycle.sequence, expired }, counted.length ? { counted } : {},
      ticks.length ? { ticks: ticks.map(t => ({ tickId: t.tickId, recordId: t.recordId, occurrence: t.occurrence, of: t.of, final: t.final })) } : {})),
    adjustmentReason: ticks.length
      ? `Authenticated turn boundary and exact-instance expiry; periodic tick obligations recorded: ${ticks.length} (no HP applied — each waits for GM resolution). No AP restoration, regeneration or payment.`
      : 'Authenticated turn boundary and exact-instance expiry only; no AP restoration, regeneration, payment or recurring effects.' };
  return staged;
}
/**
 * M5 review F1: open ticks are never silently erased. Whenever a combat object or clock is replaced (end, restart, reset,
 * re-adoption) every open or already-retired tick is carried into `combat.retiredPeriodicTicks`: visible, never applied
 * automatically, closable only by GM dismissal. Returns null when there is nothing to carry. Throws past the technical cap.
 */
const MAX_RETIRED_TICKS = 128;
function retainOpenTicks(combat) {
  const out = Object.assign({}, combat?.retiredPeriodicTicks || {}, combat?.effectLifecycle?.dueTicks || {});
  const keys = Object.keys(out);
  if (!keys.length) return null;
  if (keys.length > MAX_RETIRED_TICKS) actors.fail('periodic_ticks_open', `Too many unresolved periodic ticks (${keys.length}); dismiss some before ending or restarting combat. Nothing changed.`);
  return actors.clone(out);
}
/** M5: one due tick, bound to its exact instance and the authenticated boundary that recorded it (pure function of both). */
function obligation(item, record, hit, sequence) {
  const p = profile.periodicOf(record);
  return { tickId: actors.hash(timing.tickKey(item, sequence)), combatId: item.combatId, sequence, occurrence: hit.occurrence, of: hit.of, final: hit.final,
    ref: actors.clone(item.ref), recordId: item.recordId, recordHash: item.recordHash, effectDefinition: record.effectDefinition, label: p.label,
    tick: Object.assign({ kind: p.kind, formula: p.formula }, p.kind === 'damage' ? { damageType: p.damageType } : {}), rollPolicy: 'each-tick' };
}
const RESOLVE_KEYS = ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'tickId', 'mode', 'expectedRevision', 'roll', 'finalAmount', 'adjustmentReason'];
function validateResolve(request) {
  actors.keys(request, RESOLVE_KEYS);
  if (request.version !== 1 || !uuid(request.commandId) || !['apply', 'dismiss'].includes(request.mode) || typeof request.roomId !== 'string' || typeof request.actionEpoch !== 'string' ||
      !Number.isSafeInteger(request.baseCommitSequence) || request.baseCommitSequence < 0 || !/^[a-f0-9]{64}$/.test(request.tickId || '') ||
      typeof request.adjustmentReason !== 'string' || request.adjustmentReason.length > 2000 || actors.bytes(request) > 8192) actors.fail('invalid_periodic_resolution');
  if (request.mode === 'apply') {
    if (!Number.isSafeInteger(request.expectedRevision) || request.expectedRevision < 0 || !Number.isSafeInteger(request.finalAmount) || request.finalAmount < 0 || request.finalAmount > 100000) actors.fail('invalid_periodic_resolution');
    require('./spellPayments').validateRoll(request.roll);
  } else if (request.expectedRevision !== undefined || request.roll !== undefined || request.finalAmount !== undefined || !request.adjustmentReason.trim()) actors.fail('invalid_periodic_resolution');
}
/**
 * M5: GM resolution of ONE due tick. `apply` changes the one target's HP by the GM's final amount (temp first for damage,
 * capped at max for healing) with the retained physical/digital roll; `dismiss` closes it with no HP change (resolved by hand).
 * Either consumes the obligation in the same P7 stage, so a tick can never apply twice; a lost ACK replays the receipt.
 */
function resolveTick(room, player, uid, request, confirmedRevision) {
  validateResolve(request);
  if (!player.isGM) actors.fail('turn_gm_required');
  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) actors.fail('outcome_unknown');
  if (request.baseCommitSequence < prior.replayFloor) actors.fail('retry_window_expired');
  if (request.baseCommitSequence > prior.commitSequence) actors.fail('invalid_periodic_resolution');
  const lifecycle = room.gameState.combat?.effectLifecycle, retired = room.gameState.combat?.retiredPeriodicTicks?.[request.tickId];
  const tick = lifecycle?.dueTicks?.[request.tickId] || retired;
  if (!tick) actors.fail((lifecycle?.resolvedTicks || []).includes(request.tickId) ? 'tick_already_resolved' : 'tick_not_found', 'This tick is not waiting for resolution (already resolved, dismissed, or its combat was reset). Nothing changed.');
  const authorization = { kind: 'gm', authorizerUid: uid };
  let staged;
  const chosen = { capability: timing.PERIODIC_DEFINITION_ID, mode: request.mode, tickId: tick.tickId, combatId: tick.combatId, sequence: tick.sequence, occurrence: tick.occurrence, of: tick.of, final: tick.final,
    recordId: tick.recordId, label: tick.label, tick: actors.clone(tick.tick) };
  if (retired && request.mode === 'apply') actors.fail('periodic_tick_retired', 'This tick was recorded before combat ended, restarted or its clock was replaced. Resolve it by hand and dismiss it; nothing changed.');
  if (request.mode === 'dismiss') {
    staged = actors.finishStage(room, uid, request, authorization, confirmedRevision, actors.clone(room.gameState), []);
    staged.receipt.adjudication = { definitionId: timing.PERIODIC_DEFINITION_ID, definitionVersionOrHash: timing.PERIODIC_DEFINITION_ID, chosenResult: JSON.stringify(chosen), finalAmount: 0,
      adjustmentReason: `Dismissed without an HP change (resolved by hand): ${request.adjustmentReason}` };
  } else {
    const live = timing.clock(room.gameState.combat);
    if (!live || live.id !== tick.combatId) actors.fail('periodic_tick_retired', 'The turn clock that recorded this tick is no longer active (combat or roster changed). Resolve it by hand and dismiss it; nothing changed.');
    let located;
    try { located = actors.locate(room, tick.ref); } catch (_) { actors.fail('periodic_tick_stale', 'The target of this tick no longer exists as the same creature. Resolve it by hand and dismiss it; nothing changed.'); }
    const record = (located.token.state?.conditions || []).find(r => r?.recordId === tick.recordId);
    // The last tick's boundary ended its instance; any earlier tick needs the exact unchanged instance, or that same ending
    // (its last tick recorded by this clock). Removed by the GM or changed before resolution → stale.
    const endedByLastTick = (lifecycle.endedPeriodic || []).includes(tick.recordId);
    if (record ? tick.final || actors.hash(record) !== tick.recordHash : !(tick.final || endedByLastTick))
      actors.fail('periodic_tick_stale', 'The periodic effect behind this tick was removed or changed before it was resolved. Resolve it by hand and dismiss it; nothing changed.');
    const reading = require('../shared/services/authoredAbility').readFormula(tick.tick.formula), roll = request.roll;
    if (roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 || roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count)
      actors.fail('periodic_roll_mismatch', `The roll must be exactly ${tick.tick.formula}. Nothing changed.`);
    const amount = request.finalAmount;
    if (amount !== roll.total && !request.adjustmentReason.trim()) actors.fail('adjustment_reason_required');
    const hp = actors.resources(located.token, tick.ref.kind).hp;
    if (![hp.current, hp.temp, hp.max].every(v => Number.isSafeInteger(v) && v >= 0) || hp.current > hp.max) actors.fail('invalid_resources');
    if (hp.current === 0) actors.fail('periodic_target_down', 'The target is at 0 HP. Whether a periodic tick still applies at 0 HP is not decided; resolve it by hand and dismiss it. Nothing changed.');
    const fromTemp = Math.min(hp.temp, amount);
    const finalHp = tick.tick.kind === 'damage' ? { current: Math.max(0, hp.current - (amount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + amount), temp: hp.temp };
    chosen.roll = actors.clone(roll); chosen.before = { current: hp.current, temp: hp.temp }; chosen.after = finalHp;
    const inner = { version: 1, roomId: room.id, commandId: request.commandId, actionEpoch: request.actionEpoch, baseCommitSequence: request.baseCommitSequence,
      actors: [{ ref: actors.clone(tick.ref), expectedRevision: request.expectedRevision, finalResources: { hp: finalHp } }],
      adjudication: { definitionId: timing.PERIODIC_DEFINITION_ID, definitionVersionOrHash: timing.PERIODIC_DEFINITION_ID, chosenResult: JSON.stringify(chosen), finalAmount: amount, adjustmentReason: request.adjustmentReason } };
    staged = actors.stage(room, player, uid, inner, authorization, confirmedRevision, actors.PERIODIC_STAGE);
    if (staged.existing) actors.fail('command_id_conflict');
    staged.receipt.contentHash = actors.hash(request);
  }
  if (retired) {
    const rest = Object.assign({}, staged.next.combat.retiredPeriodicTicks); delete rest[tick.tickId];
    if (Object.keys(rest).length) staged.next.combat.retiredPeriodicTicks = rest; else delete staged.next.combat.retiredPeriodicTicks;
    return staged;
  }
  const next = staged.next.combat.effectLifecycle;
  delete next.dueTicks[tick.tickId];
  next.resolvedTicks = [...(next.resolvedTicks || []), tick.tickId].slice(-MAX_RESOLVED_TICKS);
  return staged;
}
module.exports = { roster, application, validate, stage, validateResolve, resolveTick, retainOpenTicks, MAX_OPEN_TICKS, MAX_TICKS_PER_BOUNDARY };
