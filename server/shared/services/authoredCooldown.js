/** Approved Wizard-only availability procedure. No timers, payment or effect duration. */
const { canonical, sha256Hex } = require('./canonicalHash');
const timing = require('./sharedEffectTiming');
const TYPE = 'authenticated_caster_start';
const APPROVAL = 'handoff/wizard-cooldowns/APPROVAL.md';
const valid = c => !!c && Object.keys(c).sort().join() === 'cooldownType,cooldownValue' && c.cooldownType === TYPE && Number.isSafeInteger(c.cooldownValue) && c.cooldownValue >= 1 && c.cooldownValue <= 10;
const key = (ref, definitionId) => sha256Hex(canonical([ref, definitionId]));
const procedure = n => `Cooldown: ${n} strictly upcoming caster-turn start${n === 1 ? '' : 's'}. Starts with the accepted cast; the ongoing turn does not count. Copies and versions of this definition share it for this exact actor. Combat end/restart never resets it.`;
function status(token, combat, ref, definitionId) {
  const item = token?.state?.authoredCooldowns?.[key(ref, definitionId)];
  if (!item) return { blocked: false, label: 'Cooldown ready.' };
  const current = timing.clock(combat);
  if (!current || current.id !== item.combatId || combat.turnOrder.length !== item.period)
    return { blocked: true, code: 'cooldown_clock_retired', label: 'Cooldown blocked: its authenticated clock is retired or unavailable. Combat end/restart does not reset it; GM manual adjudication is required.' };
  const remaining = timing.remaining(item, current.sequence);
  return { blocked: true, code: 'ability_on_cooldown', remaining, dueSequence: item.dueSequence,
    label: `Cooldown active: ${remaining} of ${item.occurrences} caster-turn starts remaining; releases at authenticated boundary ${item.dueSequence} (combat ${item.combatId}).` };
}
module.exports = { TYPE, APPROVAL, valid, key, procedure, status };
