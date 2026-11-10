/** A10 shared mapping for the authored-effect:v1 bundle: at most one direct damage OR healing plus one
 * canonical effect (Stunned, one flat movement modifier or one flat attribute modifier) on one exact target. Pure data only:
 * C2 owns Stunned mechanics, P7 owns payment/HP/installation and C4 owns the turn clock. */
const profile = require('./sharedConditionProfile');
const saveBranch = require('./saveBranch');
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
// Shared save branch: an admitted save (rider-local "negates") is part of the exact terms the owner approves; bundles without one keep their A10 terms byte-for-byte.
const termsFor = definition => JSON.parse(JSON.stringify(Object.assign({ direct: definition.effects.direct, condition: definition.effects.condition, timing: definition.timing },
  definition.effects.save !== undefined ? { save: definition.effects.save } : {})));
const saveOf = terms => terms && terms.save !== undefined ? terms.save : null;
/** Outcome branches the owner approves for these terms (saved/failed with a GM-recorded save, otherwise none). */
const branchesFor = terms => saveOf(terms) ? saveBranch.branches(saveOf(terms)) : [];
/** Whether the canonical effect installs on the recorded branch (always, for a bundle without a save). */
const conditionApplies = (terms, branch) => !saveOf(terms) || saveBranch.applies(saveOf(terms), branch, 'condition');
function conditionLabel(condition) {
  if (condition?.kind === 'stunned') return 'canonical Stunned';
  if (condition?.kind === 'periodic') return `${condition.label} (${profile.tickText(periodicTick(condition))} per tick, rolled when each tick is resolved)`;
  if (condition?.kind === 'movement') return `${condition.label} (movement ${condition.feet > 0 ? '+' : '−'}${Math.abs(condition.feet)} ft)`;
  if (condition?.kind === 'attribute') return `${condition.label} (${profile.attributeName(condition.attribute)} ${condition.amount > 0 ? '+' : '−'}${Math.abs(condition.amount)})`;
  if (condition?.kind === 'damageReduction') return `${condition.label} (Flat DR +${condition.amount})`;
  return 'unsupported effect';
}
// M5: the record-level tick of a periodic definition condition ({ kind, formula, damageType? }).
const periodicTick = condition => Object.assign({ kind: condition.tick.kind, formula: condition.tick.formula }, condition.tick.kind === 'damage' ? { damageType: condition.tick.damageTypes[0] } : {});
const isPeriodic = approval => approval?.effectTerms?.condition?.kind === 'periodic';
const directText = terms => terms.direct ? `${terms.direct.kind === 'damage' ? `${terms.direct.damageTypes.join('/')} damage` : 'direct healing'} ${terms.direct.formula}` : null;
/** One line per GM-recordable outcome of a bundle with a save (empty without one). */
const branchLines = terms => saveOf(terms) ? saveBranch.branchLines(saveOf(terms), { direct: directText(terms), effect: conditionLabel(terms.condition), effectName: terms.condition.label || conditionLabel(terms.condition) }) : [];
function describe(terms) {
  const direct = directText(terms);
  if (saveOf(terms)) return `${direct} + ${conditionLabel(terms.condition)} unless the target saves (${saveBranch.saveLabel(saveOf(terms))}, negates ${terms.condition.label || 'the effect'} only; GM records) · ${terms.timing.durationText} — ${policyText(terms.timing.expiryPolicy, terms.timing.occurrences)}`;
  // M5 composition: the immediate part is rolled and applied at cast; every tick keeps its own later roll.
  if (terms.condition?.kind === 'periodic') return `${direct ? `immediate ${direct} (rolled at cast) + ` : ''}${conditionLabel(terms.condition)} · ${terms.timing.durationText} — ${profile.tickScheduleText(TIMINGS[terms.timing.expiryPolicy], terms.timing.occurrences)}; the GM resolves each tick`;
  return `${direct ? `${direct} + ` : ''}${conditionLabel(terms.condition)} · ${terms.timing.durationText} — ${policyText(terms.timing.expiryPolicy, terms.timing.occurrences)}`;
}
function recordFor(approval) {
  const terms = approval.effectTerms, timing = TIMINGS[terms.timing.expiryPolicy];
  const options = { sourceActor: approval.source, sourceOccurrence: occurrence(approval.approvalId), timing, authoredDuration: terms.timing.durationText };
  if (terms.timing.occurrences !== undefined) options.occurrences = terms.timing.occurrences;
  if (terms.condition.kind === 'stunned') return profile.makeStunnedRecord(approval.target, approval.approvalId, options);
  // M5: one periodic component; the exact installed action id is its definition identity (required, as for attributes).
  if (terms.condition.kind === 'periodic') return profile.makePeriodicRecord(approval.target, approval.approvalId, Object.assign(options, { tick: periodicTick(terms.condition), label: terms.condition.label, effectDefinition: approval.spell.definitionId }));
  // A11: the exact installed action id is the stable effect identity used by the combination policy.
  if (terms.condition.kind === 'movement') return profile.makeMovementRecord(approval.target, approval.approvalId, Object.assign(options, { feet: terms.condition.feet, label: terms.condition.label, effectDefinition: approval.spell.definitionId }));
  // Attribute family: the exact installed action id is the record's definition identity (required for this family).
  if (terms.condition.kind === 'attribute') return profile.makeAttributeRecord(approval.target, approval.approvalId, Object.assign(options, { attribute: terms.condition.attribute, amount: terms.condition.amount, label: terms.condition.label, effectDefinition: approval.spell.definitionId }));
  // Flat DR family: the exact installed action id is the record's definition identity (required for this family).
  if (terms.condition.kind === 'damageReduction') return profile.makeDamageReductionRecord(approval.target, approval.approvalId, Object.assign(options, { amount: terms.condition.amount, label: terms.condition.label, effectDefinition: approval.spell.definitionId }));
  throw Error('Unsupported authored effect.');
}
/**
 * A11: the exact condition operations one approved bundle performs against the target's current
 * conditions. Stunned and a first/different movement effect add one instance; the same movement effect
 * from the same exact source refreshes by removing that one instance (and with it its C4 schedule) and
 * adding the new one in the same P7 command. Returns { refused } for combinations the policy leaves open.
 */
function conditionPlan(approval, conditions) {
  // M5 first route: one creature target only (PC tick consent/block semantics are not established).
  if (approval.effectTerms.condition.kind === 'periodic' && approval.target?.kind !== 'creature')
    return { refused: { code: 'periodic_target_unsupported', message: 'A periodic effect can be applied by this route to one creature only; a player character target stays manual. Nothing was applied or charged.' } };
  const record = recordFor(approval), add = { op: 'add', recordId: approval.approvalId, record };
  if (approval.effectTerms.condition.kind === 'periodic') {
    const periodicPlan = profile.periodicCombination(conditions, record);
    if (!periodicPlan.ok) return { refused: { code: periodicPlan.code, message: periodicPlan.message } };
    return { ops: [add], combination: { outcome: 'added', replacesInstanceId: null } };
  }
  if (approval.effectTerms.condition.kind === 'attribute') {
    // No approved attribute stacking rule (D-ATTR-1): one change per attribute per target; anything else refuses whole.
    const attributePlan = profile.attributeCombination(conditions, record);
    if (!attributePlan.ok) return { refused: { code: attributePlan.code, message: attributePlan.message } };
    return { ops: [add], combination: { outcome: 'added', replacesInstanceId: null } };
  }
  if (approval.effectTerms.condition.kind === 'damageReduction') {
    // No approved flat DR stacking rule (D-DR-1): one flat DR effect per target; anything else refuses whole.
    const drPlan = profile.damageReductionCombination(conditions, record);
    if (!drPlan.ok) return { refused: { code: drPlan.code, message: drPlan.message } };
    return { ops: [add], combination: { outcome: 'added', replacesInstanceId: null } };
  }
  if (approval.effectTerms.condition.kind !== 'movement') return { ops: [add], combination: null };
  const plan = profile.movementCombination(conditions, record);
  if (!plan.ok) return { refused: { code: plan.code, message: plan.message } };
  return { ops: plan.replaces ? [{ op: 'remove', recordId: plan.replaces }, add] : [add],
    combination: { outcome: plan.outcome, replacesInstanceId: plan.replaces } };
}
function resultFor(approval, resolution, combination = null, branch) {
  const terms = approval.effectTerms, save = saveOf(terms);
  // Shared save branch: the recorded branch is part of the result; on "saved" the negated effect installs nothing.
  const applied = conditionApplies(terms, branch);
  return Object.assign({ capability: CAPABILITY, approvalId: approval.approvalId, kind: 'effect', gmConfirmed: true, roll: approval.roll,
    direct: terms.direct ? { kind: terms.direct.kind, damageTypes: terms.direct.damageTypes || [] } : null,
    condition: JSON.parse(JSON.stringify(terms.condition)), conditionInstanceId: applied ? approval.approvalId : null, expiryPolicy: terms.timing.expiryPolicy,
    spellName: approval.spell.name, resolution: JSON.parse(JSON.stringify(resolution)) }, terms.timing.occurrences !== undefined ? { occurrences: terms.timing.occurrences } : {},
    save ? { save: JSON.parse(JSON.stringify(save)), branch, conditionApplied: applied } : {},
    combination ? { combination: JSON.parse(JSON.stringify(combination)) } : {});
}
/** Plain-language outcome of an accepted movement combination (narration, panels). */
function combinationText(combination, condition) {
  if (combination && condition?.kind === 'periodic') return `added ${condition.label}: the only periodic effect on this target`;
  if (combination && condition?.kind === 'attribute') return `added ${condition.label}: the only active change to ${profile.attributeName(condition.attribute)} on this target`;
  if (combination && condition?.kind === 'damageReduction') return `added ${condition.label}: the only active flat Damage Reduction effect on this target`;
  if (!combination || condition?.kind !== 'movement') return '';
  return combination.outcome === 'refreshed' ? `refreshed ${condition.label}: its duration restarts; the value is not stacked` : `added ${condition.label}: it stacks with other movement effects`;
}
/**
 * M3A: which existing consent rule governs a bundle aimed at one exact primary PC. Pure classification of already-admitted
 * terms; it adds no rule and no new record. Existing boundaries are reused unchanged:
 *   - A5: a placed-creature direct damage/healing part needs the target owner's own response (block choice, or explicit acceptance of healing);
 *   - A9: Stunned and movement penalties are hostile by default (current GM authority; the GM may designate them voluntary);
 *   - voluntary: a beneficial movement effect, and a healing + beneficial bundle, always need the target owner's affirmative acceptance.
 * Combinations whose consent semantics would conflict are refused here, whole, and are never silently downgraded to a subset.
 */
const PC_REFUSALS = Object.freeze({
  pc_target_consent_conflict: 'Damage needs the target owner\'s block response while a beneficial effect is voluntary, so one acceptance cannot cover both. Refused whole; run the parts as separate actions or by hand.',
  pc_target_consent_conflict_heal: 'Healing needs the target owner\'s explicit acceptance while a hostile effect is applied under GM authority, so one acceptance cannot cover both. Refused whole; run the parts as separate actions or by hand.',
  pc_target_effect_unsupported: 'Only Stunned, one flat movement change, one flat attribute change or one flat damage-reduction change can accompany a direct part on a player character. Refused whole.',
  pc_target_save_unsupported: 'A GM-recorded save branch is supported on one creature target only; a player character target (with its block and consent responses) stays manual. Refused whole.'
});
// A9 polarity, reused: a penalty is hostile by default, a bonus is beneficial and needs the target owner's acceptance.
const hostileRider = condition => condition?.kind === 'stunned' || (condition?.kind === 'movement' && condition.feet < 0) || (condition?.kind === 'attribute' && condition.amount < 0);
const beneficialRider = condition => (condition?.kind === 'movement' && condition.feet > 0) || (condition?.kind === 'attribute' && condition.amount > 0) || (condition?.kind === 'damageReduction' && condition.amount > 0);
function pcConsent(terms, sourceKind) {
  const refuse = code => ({ ok: false, code, message: PC_REFUSALS[code] });
  const direct = terms?.direct || null, condition = terms?.condition;
  if (!['character', 'creature'].includes(sourceKind)) return refuse('pc_target_effect_unsupported');
  if (saveOf(terms)) return refuse('pc_target_save_unsupported');
  const hostile = hostileRider(condition), beneficial = beneficialRider(condition);
  if (hostile === beneficial) return refuse('pc_target_effect_unsupported');
  if (direct?.kind === 'damage' && beneficial) return refuse('pc_target_consent_conflict');
  if (direct?.kind === 'healing' && hostile) return refuse('pc_target_consent_conflict_heal');
  if (direct && !['damage', 'healing'].includes(direct.kind)) return refuse('pc_target_effect_unsupported');
  // A5 owns the owner response whenever a placed creature adds a direct part; otherwise A9's target-acceptance record is the only mechanism.
  const a5 = sourceKind === 'creature' && !!direct;
  return { ok: true, rider: hostile ? 'hostile' : 'beneficial', directKind: direct?.kind || null, a5,
    acceptanceRequired: beneficial && !a5, designatable: hostile && !a5 };
}
/** The direct kind of an approval-like value ('damage' | 'healing' | null) for plain and bundle spells alike. */
const directKindOf = approval => approval?.spell?.kind === 'effect' ? approval.effectTerms?.direct?.kind || null : ['damage', 'healing'].includes(approval?.spell?.kind) ? approval.spell.kind : null;
function consentText(consent) {
  if (!consent?.ok) return consent?.message || '';
  const part = consent.directKind ? `${consent.directKind === 'damage' ? 'damage' : 'healing'} and ` : '';
  if (consent.a5) return consent.directKind === 'damage'
    ? 'The target\'s owner answers first: block with a declared piece or take it without blocking. The effect that follows is hostile and applied under GM authority.'
    : 'The target\'s owner must explicitly accept this healing and its beneficial effect before anything is applied.';
  if (consent.acceptanceRequired) return `The target's owner must explicitly accept ${part}this beneficial effect; silence or a GM proxy never accepts.`;
  return 'Hostile by default: the GM\'s confirmation applies it. The GM may instead ask the target\'s owner for explicit acceptance.';
}
module.exports = { saveOf, branchesFor, conditionApplies, branchLines, directText, isPeriodic, periodicTick, CAPABILITY, TIMINGS, POLICY_TEXT, policyText, isEffect, namedRecord, occurrence, termsFor, conditionLabel, describe, recordFor, conditionPlan, resultFor, combinationText, pcConsent, directKindOf, consentText, PC_REFUSALS };
