/**
 * Execution-compatibility explanation (presentation model only).
 *
 * This is NOT a capability classifier. Every verdict comes from the existing shared validator
 * `definitionFromWizard` (the same function server admission uses). This module only:
 *   - maps that single result to one of four plain-language states,
 *   - lists what the saved record contains (an inventory by section name, never a support verdict),
 *   - restates responsibilities that the already-validated definition itself declares.
 * It has no side effects: no store, no network, no payment, no cast, no mutation of the record.
 *
 * Known limit (see handoff): the shared validator throws at its FIRST blocker, so only that one reason is
 * exact. Other mechanics are listed as "preserved", never individually declared supported or unsupported.
 */
import { definitionFromWizard, definitionSummary, AREA_ROLL_UNAPPROVED_REASON, AREA_CAPABILITY } from '../../../services/authoredAbility';
import { policyText } from '../../../services/authoredEffect';

export const STATES = Object.freeze({ EXECUTABLE: 'executable', PARTIAL: 'partial', BLOCKED: 'blocked', UNSUPPORTED: 'unsupported' });

export const STATE_TITLE = Object.freeze({
  [STATES.EXECUTABLE]: 'Structurally compatible with a Prism route',
  [STATES.PARTIAL]: 'Partially automated',
  [STATES.BLOCKED]: 'Blocked pending a recorded decision',
  [STATES.UNSUPPORTED]: 'Manual play: Prism cannot run this ability'
});

const isEmpty = value => value === undefined || value === null || value === false || (typeof value === 'object' && Object.keys(value).length === 0);
const hasContent = value => !isEmpty(value) && !(typeof value === 'object' && value.enabled === false);
const nonDefaultTriggers = value => hasContent(value) && !(
  !(value.global?.compoundTriggers || []).length && isEmpty(value.effectTriggers) && isEmpty(value.conditionalEffects) && isEmpty(value.buffDebuffTriggers) &&
  !value.requiredConditions?.enabled);
const nonDefaultMechanics = value => hasContent(value) && Object.entries(value).some(([k, v]) =>
  k === 'stateRequirements' ? (v || []).length > 0 : k === 'stateOptions' ? (v?.thresholds || []).length > 0 : !isEmpty(v));

/** Sections present in the authored record. Descriptive only: presence is not unsupported and absence is not supported. */
export function authoredInventory(record) {
  const d = record?.authoredDraft && typeof record.authoredDraft === 'object' ? record.authoredDraft : null;
  if (!d) return [];
  const items = [];
  const add = (key, label) => items.push({ key, label });
  const types = Array.isArray(d.effectTypes) ? d.effectTypes : [];
  if (hasContent(d.damageConfig) || types.includes('damage')) add('damage', 'Damage');
  if (hasContent(d.healingConfig) || types.includes('healing')) add('healing', 'Healing');
  const dmg = d.damageConfig || {}, heal = d.healingConfig || {};
  if (dmg.hasDotEffect || dmg.damageType === 'dot' || dmg.dotConfig?.enabled) add('dot', 'Damage over time (periodic)');
  if (heal.hasHotEffect || heal.healingType === 'hot') add('hot', 'Healing over time (periodic)');
  if (heal.hasShieldEffect || heal.healingType === 'shield') add('shield', 'Shield');
  if (dmg.canCrit || heal.canCrit) add('crit', 'Critical hits');
  if (dmg.savingThrow || heal.savingThrow || dmg.savingThrowConfig?.enabled || heal.savingThrowConfig?.enabled) add('save', 'Saving throw');
  if (dmg.partialEffect || heal.partialEffect) add('partial', 'Partial effect on success');
  if (hasContent(d.buffConfig) || types.includes('buff')) add('buff', 'Buff');
  if (hasContent(d.debuffConfig) || types.includes('debuff')) add('debuff', 'Debuff');
  if (hasContent(d.utilityConfig) || types.includes('utility')) add('utility', 'Utility');
  if (hasContent(d.controlConfig) || types.includes('control')) add('control', d.controlConfig?.authoredCondition ? 'Condition or movement effect' : 'Control');
  if (hasContent(d.summoningConfig) || types.includes('summoning')) add('summoning', 'Summoning');
  if (hasContent(d.transformationConfig) || hasContent(d.transformConfig) || types.includes('transformation')) add('transformation', 'Transformation');
  if (hasContent(d.purificationConfig) || types.includes('purification')) add('purification', 'Purification');
  if (hasContent(d.restorationConfig) || types.includes('restoration')) add('restoration', 'Restoration');
  if (hasContent(d.rollableTable)) add('rollableTable', 'Rollable table');
  if (hasContent(d.prophecyOptions)) add('prophecy', 'Prophecy options');
  if (hasContent(d.trapConfig)) add('trap', 'Trap placement');
  if (hasContent(d.channelingConfig)) add('channeling', 'Channeling');
  if (d.propagation && (d.propagation.method !== 'none' && !isEmpty(d.propagation.method) || d.propagation.behavior)) add('propagation', 'Propagation');
  if (nonDefaultTriggers(d.triggerConfig)) add('triggers', 'Triggers and conditions');
  if (nonDefaultMechanics(d.mechanicsConfig)) add('mechanics', 'Class mechanics');
  if (hasContent(d.persistentConfig)) add('persistent', 'Persistent effect');
  if (hasContent(d.combinedEffects)) add('combined', 'Combined effects');
  if (hasContent(d.statusEffectsConfig)) add('status', 'Status effects');
  if (d.durationConfig && !isEmpty(d.durationConfig) && d.durationConfig.durationType !== 'instant') add('duration', 'Duration');
  if (d.cooldownConfig && (d.cooldownConfig.cooldownType && d.cooldownConfig.cooldownType !== 'none' || d.cooldownConfig.cooldownValue)) add('cooldown', 'Cooldown');
  const t = d.targetingConfig || {};
  if (t.targetingType && t.targetingType !== 'single') add('targeting', `Targeting: ${t.targetingType}`);
  else if (t.maxTargets > 1) add('targeting', 'Several targets');
  if (d.spellType && d.spellType !== 'ACTION') add('spellType', `Spell type: ${d.spellType}`);
  const cost = d.resourceCost || {};
  if (!isEmpty(cost.components) || cost.materialComponents || !isEmpty(cost.resourceFormulas)) add('components', 'Spell components or resource formulas');
  return items;
}

const shared = (ctx = {}) => ctx.shared === true;

const SHARED_MANUAL = 'In a shared room an action Prism does not route posts a manual notice in chat and applies nothing itself: no AP, mana, class resource, HP, cooldown or target change. You pay costs with your resource controls and resolve the effect at the table.';
const LOCAL_CAST = 'Outside a shared room Prism does not route casts. The existing local cast runs as it always has and may spend your local AP and mana. This view changes nothing.';

function nextSteps(state, ctx) {
  const gm = ctx.gm === true;
  if (state === STATES.EXECUTABLE || state === STATES.PARTIAL) {
    if (!shared(ctx)) return [LOCAL_CAST];
    return gm
      ? ['Use "Admit this saved version" below, then cast from the action bar. Changing the spell later needs a new admission.']
      : ['Ask the GM to admit this saved version, then use "Refresh room admission". Until it is admitted, casting it here is manual. ' + SHARED_MANUAL];
  }
  if (state === STATES.BLOCKED) return [shared(ctx) ? 'Keep playing it by hand. Nothing needs to change in the spell; admission opens once the decision is recorded. ' + SHARED_MANUAL : 'Keep playing it by hand. Nothing needs to change in the spell; admission opens once the decision is recorded. ' + LOCAL_CAST];
  return [shared(ctx) ? 'Cast it from the action bar as usual. ' + SHARED_MANUAL : LOCAL_CAST,
    'To make it compatible, edit the blocking mechanic in the Wizard. The saved spell stays exactly as authored until you do.'];
}

/** What the validated definition itself declares as not automated. Nothing here is inferred from the record. */
function responsibilities(def) {
  const manual = [];
  const timing = def.timing;
  if (timing) {
    const duration = timing.durationText ? ` (authored duration: ${timing.durationText})` : '';
    if (timing.expiryPolicy === 'gm-manual') manual.push(`Ending the effect: the GM removes it${duration}.`);
    else if (timing.expiryPolicy) manual.push(`Ending the effect: ${policyText(timing.expiryPolicy, timing.occurrences)}${duration}. This needs active authenticated turn tracking; otherwise the GM removes it.`);
  }
  if (def.capability === AREA_CAPABILITY) manual.push('Per-target final amounts: the GM adjudicates each target. Up to ' + (def.targeting?.maxTargets ?? 8) + ' creatures; larger areas are not truncated.');
  if (def.catalogueSource) manual.push('Anything else on the catalogue card (riders, secondary text, effects beyond the formula, target and class price) is played at the table. The whole record is preserved.');
  return manual;
}

/** People who still decide, as the existing admission panel states for every admitted route. Never implies full automation. */
function confirmations(def) {
  const list = ['The owner approves the exact price, target and roll before anything is applied.', 'The GM confirms success and any final amount.'];
  if (def.targetRoute === 'primary-pc-healing') list.push('The target\'s owner accepts the exact healing amount.');
  return list;
}

function automatedParts(def) {
  const parts = [definitionSummary(def)];
  if (def.cooldown) parts.push(require('../../../services/authoredCooldown').procedure(def.cooldown.cooldownValue));
  const price = def.resourceCost ? `Price: ${def.resourceCost.actionPoints} AP, ${def.resourceCost.mana} mana` : null;
  if (price) parts.push(price);
  if (def.classPayment?.domain) parts.push(`Typed class price (${def.classPayment.domain})`);
  const t = def.targeting;
  if (t?.kind === 'area') parts.push(`Target: placed circle, ${t.radiusFeet} ft, range ${t.rangeFeet} ft`);
  else if (t) parts.push(`Target: one creature, range ${t.rangeFeet} ft (${t.restriction})`);
  return parts.filter(Boolean);
}

const BOILERPLATE = /^(.*): unsupported or conflicting mechanics; keep this ability manual\.$/;
/** Display only: the validator's own words, with its fixed suffix turned into plain language. The verdict is untouched. */
export function readableReason(reason) {
  const m = BOILERPLATE.exec(String(reason || ''));
  return m ? `Stopped at "${m[1]}": Prism cannot run this as authored.` : String(reason || 'The validator gave no reason.');
}

/**
 * @param record  saved library record (or a draft wrapped as `{...draft, authoredDraft}`), unchanged
 * @param ctx     { roomId, classId, shared, gm, definitionVersion } — display context only
 * @returns view model: { state, title, summary, automated[], manual[], reasons[], preserved[], notes[], next[] }
 */
export function explainExecution(record, ctx = {}) {
  const preserved = authoredInventory(record);
  const result = definitionFromWizard(record, { roomId: ctx.roomId, classId: ctx.classId || 'arcanoneer', definitionVersion: ctx.definitionVersion || 1 });
  const notes = ['This is a structural check only, against the same rules the server applies. It does not grant admission and does not say you can cast it now: the GM\'s room admission, your ownership, your current resources and the chosen target are checked when you cast.'];
  if (!result.ok) {
    const blocked = result.reason === AREA_ROLL_UNAPPROVED_REASON;
    const state = blocked ? STATES.BLOCKED : STATES.UNSUPPORTED;
    return { state, title: STATE_TITLE[state], automated: [], manual: [], confirm: [], preserved,
      summary: blocked ? 'The first blocker the validator detected is a creator decision that is not recorded yet.' : 'Prism cannot run this ability as authored, and it cannot run part of it, so all of it is played by hand. Nothing was removed from the saved spell.',
      reasons: [{ label: 'First detected blocker', text: readableReason(result.reason) }],
      notes: ['This is the first blocker the validator detected, not a full diagnosis. Other mechanics in this spell may also block it; they were not checked one by one.', ...notes],
      next: nextSteps(state, ctx) };
  }
  const manual = responsibilities(result.definition);
  const state = manual.length ? STATES.PARTIAL : STATES.EXECUTABLE;
  return { state, title: STATE_TITLE[state], automated: automatedParts(result.definition), manual, confirm: confirmations(result.definition), reasons: [], preserved,
    summary: state === STATES.PARTIAL ? 'Prism runs the parts listed below. The rest is yours or the GM\'s to play.' : 'The saved record fits a supported Prism route. That is not full automation: people still confirm each step, as listed below.',
    notes, next: nextSteps(state, ctx) };
}
