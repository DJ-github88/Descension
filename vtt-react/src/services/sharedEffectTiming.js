/** Read-only timing vocabulary. No timer, turn trigger, expiry mutation or ancestry executor. */
const profile = require('./sharedConditionProfile');
const DEFINITION_ID = 'shared-turn-boundary:v1';
const positionKey = combat => profile.canonical({ active: combat?.isActive, index: combat?.currentTurnIndex,
  round: combat?.round, refs: combat?.turnOrder?.map(entry => entry.actorRef || null) });
const instanceKey = (ref, recordId) => profile.canonical([ref, recordId]);
function clock(combat) {
  const value = combat?.effectLifecycle;
  return combat?.isActive === true && value?.version === 1 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.id || '') &&
    Number.isSafeInteger(value.sequence) && value.sequence >= 0 && value.positionKey === positionKey(combat) ? value : null;
}
function scheduleFor(record, combat) {
  const current = clock(combat), item = current?.schedules?.[instanceKey(record?.target, record?.recordId)];
  return item && item.combatId === current.id && item.recordKey === profile.canonical(record) ? item : null;
}
/**
 * M2A counted schedules: `dueSequence` is the FINAL occurrence; `occurrences` = N and `period` = roster length (R) are fixed
 * when the effect is applied. Occurrence k happens at dueSequence − (N − k)·R, so the count is a pure function of the
 * authenticated clock sequence: no stored mutable counter, nothing a duplicate request could decrement twice.
 * Existing next-turn schedules carry neither field and keep their meaning (one occurrence at dueSequence).
 */
function occurrenceAt(item, sequence) {
  const total = item?.occurrences || 1;
  if (total === 1) return item?.dueSequence === sequence ? { occurrence: 1, of: 1, final: true } : null;
  const gap = item.dueSequence - sequence;
  if (!Number.isSafeInteger(item.period) || item.period < 1 || !Number.isSafeInteger(gap) || gap < 0 || gap % item.period !== 0) return null;
  const after = gap / item.period;
  return after < total ? { occurrence: total - after, of: total, final: after === 0 } : null;
}
// Boundaries still to come strictly after `sequence` (counted schedules; capped at N because a turn already in progress is never counted).
function remaining(item, sequence) {
  const total = item?.occurrences || 1;
  if (total === 1) return item.dueSequence > sequence ? 1 : 0;
  return Math.max(0, Math.min(total, Math.ceil((item.dueSequence - sequence) / item.period)));
}
function progress(record, combat) {
  const item = scheduleFor(record, combat), total = profile.structuredOccurrences(record);
  if (!item || !total) return null;
  const left = remaining(item, combat.effectLifecycle.sequence);
  return { boundary: item.boundary, total, remaining: left, counted: total - left, finalSequence: item.dueSequence,
    nextSequence: left ? item.dueSequence - (left - 1) * (item.period || 1) : null, clockSequence: combat.effectLifecycle.sequence, combatId: item.combatId };
}
function label(record, combat) {
  const item = scheduleFor(record, combat);
  if (!item) return null;
  const authored = profile.structuredBoundary(record), total = profile.structuredOccurrences(record) || 1;
  if (total > 1) {
    const info = progress(record, combat), unit = item.boundary === 'start' ? 'starts' : 'ends';
    return `Automatic at the ${profile.occurrenceText(item.boundary, total)} — ${info.remaining} of ${total} target-turn ${unit} still to come (${info.counted} counted); next counted at authenticated boundary ${info.nextSequence}, expires at boundary ${info.finalSequence} (combat ${item.combatId}). GM removal of this exact instance remains available.`;
  }
  const when = authored ? (item.boundary === 'start' ? "start of the target's next turn" : "end of the target's next turn")
    : item.boundary === 'start' ? 'start of your next turn' : "end of target's next turn";
  return `Automatic at ${when} — authenticated combat ${item.combatId}, boundary ${item.dueSequence}. ${authored ? 'GM removal of this exact instance remains available.' : 'GM correction/removal remains available.'}`;
}
exports.DEFINITION_ID = DEFINITION_ID;
exports.positionKey = positionKey;
exports.instanceKey = instanceKey;
exports.clock = clock;
exports.scheduleFor = scheduleFor;
exports.label = label;
exports.occurrenceAt = occurrenceAt;
exports.remaining = remaining;
exports.progress = progress;
