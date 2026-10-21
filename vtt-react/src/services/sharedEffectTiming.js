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
function label(record, combat) {
  const item = scheduleFor(record, combat);
  if (!item) return null;
  return `Automatic at ${item.boundary === 'start' ? 'start of your next turn' : "end of target's next turn"} — authenticated combat ${item.combatId}, boundary ${item.dueSequence}. GM correction/removal remains available.`;
}
exports.DEFINITION_ID = DEFINITION_ID;
exports.positionKey = positionKey;
exports.instanceKey = instanceKey;
exports.clock = clock;
exports.scheduleFor = scheduleFor;
exports.label = label;
