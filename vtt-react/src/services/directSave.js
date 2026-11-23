/** Direct-part saving throw (handoff/direct-damage-save/CONTRACT.md). One save authored on the ONLY part of a single-target
 * immediate damage spell (the Wizard's Saving Throw Configuration on Direct Damage). The table rolls the save and the GM records
 * "saved" or "failed" (saveBranch.js); the VTT never rolls, compares or validates it. The outcome changes the Direct Damage part only:
 *   - failed: the GM's final amount is applied;
 *   - saved + halves:  the approved halving rule is applied to the GM's final amount (directSavePolicy.js);
 *   - saved + negates: nothing is applied to HP; the price is paid at cast (directSavePolicy.js).
 * Either outcome stays refused while its creator policy is unanswered. A spell with any other part (a rider, a periodic tick, an
 * area) and a damage-part save is not represented here and stays manual; rider-local saves keep their own meaning (saveBranch.js).
 * Pure data/arithmetic: no RNG, storage, authority or execution. No object/array spread (bundled as CommonJS by the client). */
const saveBranch = require('./saveBranch');
const policy = require('./directSavePolicy');
const SCOPE = 'direct';
const OUTCOMES = Object.freeze(['halves', 'negates']);
const BRANCHES = Object.freeze(['saved', 'failed']);
const HALF_FORMULA = 'damage/2';
// Inert echoes the Wizard's SavingThrowConfig keeps beside the real settings; only their defaults are accepted.
const ECHO_DEFAULTS = Object.freeze({ directDamageFormula: 'damage/2', dotDamageFormula: 'dot_damage/2', damageType: 'direct', hasDotEffect: false });
const ECHO_TEXT = Object.freeze(['damageFormula', 'dotFormula']);
const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => isObject(value) && Object.keys(value).sort().join('|') === keys.slice().sort().join('|');
const empty = value => value === undefined || value === null || (isObject(value) && Object.keys(value).length === 0);

/** True for exactly one supported direct-part save term: { scope: 'direct', ability, dc, outcome: 'halves' | 'negates' }. */
function validSave(save) {
  return exact(save, ['scope', 'ability', 'dc', 'outcome']) && save.scope === SCOPE && saveBranch.ABILITIES.includes(save.ability) &&
    Number.isSafeInteger(save.dc) && save.dc >= saveBranch.MIN_DC && save.dc <= saveBranch.MAX_DC && OUTCOMES.includes(save.outcome);
}
/** Whether a Wizard damage/healing configuration authors any save on the part (same test the compiler has always refused on). */
function authored(config) {
  return !!config && (!!config.savingThrow || !!config.partialEffect || (!empty(config.savingThrowConfig) && config.savingThrowConfig.enabled !== false));
}
/** The exact save term a Wizard Direct Damage configuration authors, or a refusal reason (string). Never guesses: both Wizard
 * encodings (savingThrowConfig and the legacy mirror fields) must agree, and only "no partial effect" (negates) or the exact
 * "Half Damage" formula (halves) are read. */
function fromWizard(config) {
  const c = config.savingThrowConfig;
  if (!isObject(c) || c.enabled !== true) return 'save on the direct damage part: the Saving Throw Configuration is incomplete (enable it again in the Wizard)';
  const allowed = ['enabled', 'savingThrowType', 'difficultyClass', 'partialEffect', 'partialEffectFormula'].concat(Object.keys(ECHO_DEFAULTS), ECHO_TEXT);
  if (Object.keys(c).some(key => !allowed.includes(key))) return 'save on the direct damage part: unknown saving-throw settings';
  if (Object.keys(ECHO_DEFAULTS).some(key => c[key] !== undefined && c[key] !== ECHO_DEFAULTS[key]) || ECHO_TEXT.some(key => c[key] !== undefined && typeof c[key] !== 'string')) {
    return 'save on the direct damage part: a separate direct or periodic save formula is not supported';
  }
  const ability = c.savingThrowType, dc = c.difficultyClass, partial = c.partialEffect === true;
  if (typeof c.partialEffect !== 'boolean') return 'save on the direct damage part: choose whether a successful save reduces or negates the damage';
  if (config.savingThrow !== ability || config.difficultyClass !== dc || config.partialEffect !== c.partialEffect) return 'save on the direct damage part: the two saved copies of the save disagree; reopen and save it in the Wizard';
  if (partial && (c.partialEffectFormula !== HALF_FORMULA || config.partialEffectFormula !== HALF_FORMULA)) return `save on the direct damage part: only the "Half Damage" partial effect (${HALF_FORMULA}) is supported`;
  const save = { scope: SCOPE, ability, dc, outcome: partial ? 'halves' : 'negates' };
  if (!validSave(save)) return `save on the direct damage part: choose the saving ability and a whole-number DC from ${saveBranch.MIN_DC} to ${saveBranch.MAX_DC}`;
  return save;
}
/** Refusal reason while the creator policy for this outcome is unanswered, else null. */
const policyRefusal = save => policy.approved(save.outcome) ? null : policy.UNAPPROVED_REASON[save.outcome];
const branches = () => BRANCHES.slice();
/** The damage this branch applies to HP, from the GM's final amount (after their mitigation ruling, before temp HP).
 * Throws when the outcome's rule is unanswered: nothing is applied. */
function appliedAmount(save, branch, finalAmount) {
  if (!validSave(save) || !BRANCHES.includes(branch) || !Number.isSafeInteger(finalAmount) || finalAmount < 0) throw Error('direct_save_unbound');
  const rule = policy.ruleFor(save.outcome);
  if (!rule) throw Error('direct_save_policy_unanswered');
  if (branch === 'failed') return finalAmount;
  if (save.outcome === 'negates') return 0;
  return Math.floor(finalAmount / 2); // rule 'final-round-down' (the only implemented rule): halved exactly once, never below 0
}
const ruleText = save => {
  if (save.outcome === 'negates') return 'no damage';
  const rule = policy.ruleFor('halves');
  return rule === 'final-round-down' ? "half the GM's final amount, rounded down" : 'half damage (rounding not decided)';
};
/** Plain explanation of exactly which component the save changes (Wizard Review, card, owner dialog and GM card). */
function describe(save) {
  return `Saving throw on the Direct Damage part (${saveBranch.saveLabel(save)}; the table rolls, the GM records saved or failed). ` +
    `It changes only this Direct Damage part: on a failed save the GM's final amount applies; on a successful save, ${ruleText(save)}. ` +
    `The price is paid either way.`;
}
/** One line per GM-recordable branch for the direct part's own wording (`direct`, e.g. "ember damage 1d8+3"). */
function branchLines(save, direct) {
  const label = saveBranch.saveLabel(save);
  return [{ branch: 'saved', text: `Target saves (${label}, GM records): ${direct} - ${ruleText(save)}` },
    { branch: 'failed', text: `Target fails (${label}, GM records): ${direct} - full GM final amount` }];
}
const recordedText = (save, branch) => saveBranch.recordedText({ ability: save.ability, dc: save.dc }, branch);
module.exports = { SCOPE, OUTCOMES, BRANCHES, HALF_FORMULA, validSave, authored, fromWizard, policyRefusal, branches, appliedAmount, ruleText, describe, branchLines, recordedText };
