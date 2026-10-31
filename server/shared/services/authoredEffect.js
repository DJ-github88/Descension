/** A10 shared mapping for the authored-effect:v1 bundle: at most one direct damage OR healing plus one
 * canonical effect (Stunned or one flat movement modifier) on one exact target. Pure data only:
 * C2 owns Stunned mechanics, P7 owns payment/HP/installation and C4 owns the turn clock. */
const profile = require('./sharedConditionProfile');
const CAPABILITY = 'authored-effect:v1';
const TIMINGS = Object.freeze({ 'gm-manual': 'manual', 'target-next-start': 'authored-target-next-start', 'target-next-end': 'authored-target-next-end',
  'target-start-count': 'authored-target-start-count', 'target-end-count': 'authored-target-end-count' });
const POLICY_TEXT = Object.freeze({ 'gm-manual': 'GM removes', 'target-next-start': "expires at the start of the target's next turn", 'target-next-end': "expires at the end of the target's next turn",
  'target-start-count': 'expires at the counted start of the target\'s upcoming turns', 'target-end-count': 'expires at the counted end of the target\'s upcoming turns' });
/** Explicit policy wording; counted policies state the boundary and the count (never "rounds"). */
function policyText(policy, occurrences) {
  if (policy === 'target-start-count') return `expires at the ${profile.occurrenceText('start', occurrences)}`;
  if (policy === 'target-end-count') return `expires at the ${profile.occurrenceText('end', occurrences)}`;
  return POLICY_TEXT[policy] || 'GM removes';
}
const isEffect = approval => approval?.spell?.definitionHash?.startsWith(`${CAPABILITY}/`) === true;
const namedRecord = record => String(record?.sourceEntityId || '').startsWith(profile.EFFECT_PREFIX);
const occurrence = approvalId => profile.EFFECT_PREFIX + approvalId;
const termsFor = definition => JSON.parse(JSON.stringify({ direct: definition.effects.direct, condition: definition.effects.condition, timing: definition.timing }));
function conditionLabel(condition) {
  if (condition?.kind === 'stunned') return 'canonical Stunned';
  if (condition?.kind === 'movement') return `${condition.label} (movement ${condition.feet > 0 ? '+' : '−'}${Math.abs(condition.feet)} ft)`;
  return 'unsupported effect';
}
function describe(terms) {
  const direct = terms.direct ? `${terms.direct.kind === 'damage' ? `${terms.direct.damageTypes.join('/')} damage` : 'direct healing'} ${terms.direct.formula}` : null;
  return `${direct ? `${direct} + ` : ''}${conditionLabel(terms.condition)} · ${terms.timing.durationText} — ${policyText(terms.timing.expiryPolicy, terms.timing.occurrences)}`;
}
function recordFor(approval) {
  const terms = approval.effectTerms, timing = TIMINGS[terms.timing.expiryPolicy];
  const options = { sourceActor: approval.source, sourceOccurrence: occurrence(approval.approvalId), timing, authoredDuration: terms.timing.durationText };
  if (terms.timing.occurrences !== undefined) options.occurrences = terms.timing.occurrences;
  if (terms.condition.kind === 'stunned') return profile.makeStunnedRecord(approval.target, approval.approvalId, options);
  // A11: the exact installed action id is the stable effect identity used by the combination policy.
  if (terms.condition.kind === 'movement') return profile.makeMovementRecord(approval.target, approval.approvalId, Object.assign(options, { feet: terms.condition.feet, label: terms.condition.label, effectDefinition: approval.spell.definitionId }));
  throw Error('Unsupported authored effect.');
}
/**
 * A11: the exact condition operations one approved bundle performs against the target's current
 * conditions. Stunned and a first/different movement effect add one instance; the same movement effect
 * from the same exact source refreshes by removing that one instance (and with it its C4 schedule) and
 * adding the new one in the same P7 command. Returns { refused } for combinations the policy leaves open.
 */
function conditionPlan(approval, conditions) {
  const record = recordFor(approval), add = { op: 'add', recordId: approval.approvalId, record };
  if (approval.effectTerms.condition.kind !== 'movement') return { ops: [add], combination: null };
  const plan = profile.movementCombination(conditions, record);
  if (!plan.ok) return { refused: { code: plan.code, message: plan.message } };
  return { ops: plan.replaces ? [{ op: 'remove', recordId: plan.replaces }, add] : [add],
    combination: { outcome: plan.outcome, replacesInstanceId: plan.replaces } };
}
function resultFor(approval, resolution, combination = null) {
  const terms = approval.effectTerms;
  return Object.assign({ capability: CAPABILITY, approvalId: approval.approvalId, kind: 'effect', gmConfirmed: true, roll: approval.roll,
    direct: terms.direct ? { kind: terms.direct.kind, damageTypes: terms.direct.damageTypes || [] } : null,
    condition: JSON.parse(JSON.stringify(terms.condition)), conditionInstanceId: approval.approvalId, expiryPolicy: terms.timing.expiryPolicy,
    spellName: approval.spell.name, resolution: JSON.parse(JSON.stringify(resolution)) }, terms.timing.occurrences !== undefined ? { occurrences: terms.timing.occurrences } : {},
    combination ? { combination: JSON.parse(JSON.stringify(combination)) } : {});
}
/** Plain-language outcome of an accepted movement combination (narration, panels). */
function combinationText(combination, condition) {
  if (!combination || condition?.kind !== 'movement') return '';
  return combination.outcome === 'refreshed' ? `refreshed ${condition.label}: its duration restarts; the value is not stacked` : `added ${condition.label}: it stacks with other movement effects`;
}
module.exports = { CAPABILITY, TIMINGS, POLICY_TEXT, policyText, isEffect, namedRecord, occurrence, termsFor, conditionLabel, describe, recordFor, conditionPlan, resultFor, combinationText };
