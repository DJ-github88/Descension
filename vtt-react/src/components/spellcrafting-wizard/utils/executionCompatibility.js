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
import { definitionFromWizard, definitionSummary, AREA_ROLL_UNAPPROVED_REASON, AREA_CAPABILITY, FLOW_CAPABILITY, PASSIVE_ENTRY_CAPABILITY, PASSIVE_TURN_CAPABILITY, OUTCOME_CAPABILITY, CHANNELED_CAPABILITY, creatureSourceRefusal } from '../../../services/authoredAbility';
import { authoredScopes } from '../../../services/executionPlan';
import { manualText as saveManualText } from '../../../services/saveBranch';
import { describe as describeDirectSave } from '../../../services/directSave';
import { UNAPPROVED_REASON as DIRECT_SAVE_UNAPPROVED } from '../../../services/directSavePolicy';
import { policyText } from '../../../services/authoredEffect';
import { WEIGHTED_COIN_REFUSAL, CARD_UNSETTLED_REASON } from '../../../services/randomOutcome';
import { extractFlowAuthoringFromRecord } from '../../../services/hunterFlow';
import { getP9MinstrelPairSpec } from '../../../data/classes/minstrel/p9MinstrelPair';
import {
  DRAFT_EXCLUDED_KEYS,
  LIBRARY_METADATA_KEYS,
  TRANSIENT_WIZARD_KEYS,
  finalizeTargetingConfig,
  buildAuthoredDraft
} from './canonicalSpellSave';

export const STATES = Object.freeze({ EXECUTABLE: 'executable', PARTIAL: 'partial', BLOCKED: 'blocked', UNSUPPORTED: 'unsupported' });

/**
 * Keys the live Wizard state holds that the canonical save path removes before storing the executable authoredDraft.
 * The draft check must not hand them to the validator: they are not part of the spell, and the saved draft never contains them.
 */
export const WIZARD_ONLY_KEYS = DRAFT_EXCLUDED_KEYS;
export { LIBRARY_METADATA_KEYS, TRANSIENT_WIZARD_KEYS, finalizeTargetingConfig };

/**
 * Wraps an unsaved Wizard state identically to the canonical save path: transient/library keys are excluded,
 * targetingConfig is finalized with the canonical 11-field shape preserving explicit zeroes, authoredDraft is a clean
 * copy, and serializedData is regenerated from that copy. Nothing about what the validator accepts changes; a field
 * the validator refuses is still refused.
 */
export function draftSubject(draft) {
  if (!draft || typeof draft !== 'object') return null;
  const authoredDraft = buildAuthoredDraft(draft);
  const outer = JSON.parse(JSON.stringify(authoredDraft));
  if (draft.authoredDefinitionId !== undefined) outer.authoredDefinitionId = draft.authoredDefinitionId;
  if (draft.id !== undefined) outer.id = draft.id;
  return { ...outer, authoredDraft, serializedData: JSON.stringify(authoredDraft, null, 2) };
}

export const STATE_TITLE = Object.freeze({
  [STATES.EXECUTABLE]: 'Structurally compatible with a Prism route',
  [STATES.PARTIAL]: 'Partially automated',
  [STATES.BLOCKED]: 'Blocked pending a recorded decision',
  [STATES.UNSUPPORTED]: 'Manual play: Prism cannot run this ability'
});

/** Distinguishes creature actor references from character/party references without guessing. */
export const isCreatureRef = ref => Boolean(ref && (ref.kind === 'creature' || (ref.tokenId && !ref.characterId && ref.kind !== 'character')));
const isCreatureRoute = ctx => ctx.route === 'creature' || ctx.sourceKind === 'creature' || isCreatureRef(ctx.sourceRef);

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
  else if (d.controlConfig?.authoredCondition?.save) add('save', 'Saving throw (negates the composed effect)');
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
  if (d.propagation && ((d.propagation.method !== 'none' && !isEmpty(d.propagation.method)) || d.propagation.behavior)) add('propagation', 'Propagation');
  if (nonDefaultTriggers(d.triggerConfig)) add('triggers', 'Triggers and conditions');
  if (nonDefaultMechanics(d.mechanicsConfig)) add('mechanics', 'Class mechanics');
  if (hasContent(d.persistentConfig)) add('persistent', 'Persistent effect');
  if (hasContent(d.combinedEffects)) add('combined', 'Combined effects');
  if (hasContent(d.statusEffectsConfig)) add('status', 'Status effects');
  if (d.durationConfig && !isEmpty(d.durationConfig) && d.durationConfig.durationType !== 'instant') add('duration', 'Duration');
  if (d.cooldownConfig && ((d.cooldownConfig.cooldownType && d.cooldownConfig.cooldownType !== 'none') || d.cooldownConfig.cooldownValue)) add('cooldown', 'Cooldown');
  const t = d.targetingConfig || {};
  if (t.targetingType && t.targetingType !== 'single') add('targeting', `Targeting: ${t.targetingType}`);
  else if (t.maxTargets > 1) add('targeting', 'Several targets');
  if (d.spellType && d.spellType !== 'ACTION') add('spellType', `Spell type: ${d.spellType}`);
  const cost = d.resourceCost || {};
  const hasComp = !isEmpty(cost.components) || cost.materialComponents || cost.materialText || cost.verbalText || cost.somaticText ||
    !isEmpty(d.components) || d.materialComponents || d.materialText || d.verbalText || d.somaticText;
  if (hasComp || !isEmpty(cost.resourceFormulas)) add('components', 'Spell components or resource formulas');
  return items;
}

const shared = (ctx = {}) => ctx.shared === true;

const SHARED_MANUAL = 'In a shared room an action Prism does not route posts a manual notice in chat and applies nothing itself: no AP, mana, class resource, HP, cooldown or target change. You pay costs with your resource controls and resolve the effect at the table.';
const LOCAL_CAST = 'Outside a shared room Prism does not route casts. The existing local cast runs as it always has and may spend your local AP and mana. This view changes nothing.';

const TRIGGER_PART_NAMES = {
  'effectTriggers:damage_direct': 'Direct Damage part',
  'effectTriggers:control': 'Control part'
};

function formatTriggerPartName(componentId) {
  if (!componentId) return 'part';
  if (TRIGGER_PART_NAMES[componentId]) return TRIGGER_PART_NAMES[componentId];
  const rawKey = String(componentId).includes(':')
    ? String(componentId).slice(String(componentId).indexOf(':') + 1)
    : String(componentId);
  return `${rawKey.replace(/_/g, ' ')} part`;
}

const TRIGGER_REFUSAL_LABELS = {
  requiredConditions: 'required casting conditions',
  buffDebuffTriggers: 'effect-attached triggers',
  conditionalEffects: 'conditional effect formulas',
  triggerRole: 'trigger role',
  'effectTriggers.targetingOverride': 'targeting override'
};

const TRIGGER_GM_TASKS = [
  'Trigger checks & follow-ups: the GM checks trigger conditions and adjudicates any follow-up at the table (none of the stored triggers are registered or fired by Prism).',
  'Cast, price & resolution: Prism applies no AP, mana, HP, condition, or cooldown changes for an unsupported card. Pay AP and mana with your resource controls; the GM confirms the roll and final damage/healing, records any saving throw outcome and rider, and tracks later-turn expiry or cooldown by hand.'
];

const WEIGHTED_COIN_GM_TASKS = [
  'Weighted coin flip & branch selection: the GM resolves the weighted coin odds, determines the flip result, and selects the matching outcome branch at the table.',
  'Cast, price & resolution: Prism applies no AP, mana, HP, condition, or cooldown changes for an unsupported card. Pay AP and mana with your resource controls; the GM confirms the roll and final damage/healing at the table.'
];

const CARD_OUTCOME_GM_TASKS = [
  'Card draws & deck rules: the GM manages the deck, reshuffling, face-down reveals, and picking the matching table branch at the table.',
  'Cast, price & resolution: Prism applies no AP, mana, HP, condition, or cooldown changes for an unsupported card. Pay AP and mana with your resource controls; the GM confirms the roll and final damage/healing at the table.'
];

const ROLLABLE_TABLE_GM_TASKS = [
  'Outcome table & branch selection: the GM resolves the table roll or draw and adjudicates the matching branch at the table.',
  'Cast, price & resolution: Prism applies no AP, mana, HP, condition, or cooldown changes for an unsupported card. Pay AP and mana with your resource controls; the GM confirms the roll and final damage/healing at the table.'
];

function mixedTriggerBlockerInfo(record, result) {
  if (!result || result.ok || !/^triggers?\b/i.test(String(result.reason || ''))) return null;
  let scopes;
  try {
    scopes = authoredScopes(record);
  } catch (_) {
    return null;
  }
  const entries = (scopes && scopes.entries) || [];
  const triggerRefusals = ((scopes && scopes.refusals) || []).filter((refusal) => refusal && refusal.section !== 'spellType');
  const hasWhole = entries.some((entry) => Boolean(entry && entry.scope && entry.scope.kind === 'whole-spell')) || triggerRefusals.some((refusal) => Boolean(refusal && refusal.scope && refusal.scope.kind === 'whole-spell'));
  const hasPart = entries.some((entry) => Boolean(entry && entry.scope && entry.scope.kind === 'component')) || triggerRefusals.some((refusal) => Boolean(refusal && refusal.scope && refusal.scope.kind === 'component'));
  if (!((hasWhole && hasPart) || (entries.length + triggerRefusals.length > 1))) return null;

  const summaryItems = [];
  entries.forEach((entry) => {
    const triggerName = `"${entry.name || entry.triggerId || 'Trigger'}"`;
    const scopeName = entry.scope && entry.scope.kind === 'whole-spell' ? 'whole spell' : formatTriggerPartName(entry.scope && entry.scope.componentId);
    summaryItems.push(`${triggerName} (${scopeName})`);
  });
  triggerRefusals.forEach((refusal) => {
    summaryItems.push(TRIGGER_REFUSAL_LABELS[refusal.section] || refusal.section);
  });
  const summaryList = summaryItems.join(' + ');
  const onlyGlobalPlusRequired = !hasPart && entries.length <= 1 && triggerRefusals.length === 1 && triggerRefusals[0].section === 'requiredConditions';

  return {
    kind: 'mixed-triggers',
    controlId: onlyGlobalPlusRequired ? 'required-state' : 'triggers',
    reasonText: `Mixed triggers stay GM-manual (${summaryList}): Prism runs at most one single approved trigger scope per spell (one whole-spell follow-up, one watched Direct Damage part, or one critical-hit rider gate) with no combined or extra trigger rules. Because this combination is refused whole, Prism does not automate part of the spell.`,
    summary: 'Mixed trigger combinations stay GM-manual: Prism cannot run combined or multi-scope triggers as authored, and never runs only part of a refused spell, so the whole ability is played by hand. Nothing was removed from the saved spell.',
    alternative: onlyGlobalPlusRequired
      ? 'Switch Trigger Mode from Required State back to Triggers (and remove any Required Conditions) so only the single supported trigger remains.'
      : 'Keep at most one supported trigger scope in Triggers (one Global follow-up with ALL CONDITIONS, one Effect-Specific Direct Damage watch, or one Control Critical Hit gate) with Required State off and no conditional effect overrides.',
    gmTasks: TRIGGER_GM_TASKS
  };
}

function singleTriggerBlockerInfo(record, result) {
  if (!result || result.ok) return null;
  const draft = record?.authoredDraft && typeof record.authoredDraft === 'object' ? record.authoredDraft : record;
  if (draft?.spellType === 'TRAP') return null;
  const rawReason = String(result.reason || '');
  const isOutcomeTriggerConflict = /^rollableTable\b/i.test(rawReason) && /without cooldowns, triggers/i.test(rawReason) && nonDefaultTriggers(draft?.triggerConfig);
  if (!/^(triggers?|triggerConfig)\b/i.test(rawReason) && !isOutcomeTriggerConflict) return null;

  const tc = draft?.triggerConfig || {};
  if (isOutcomeTriggerConflict) {
    return {
      kind: 'trigger-conflict',
      controlId: 'triggers',
      reasonText: readableReason(rawReason),
      summary: 'Outcome-branched spells do not support triggers yet, so the whole ability stays GM-manual. Nothing was removed from the saved spell.',
      alternative: 'Remove triggers in Triggers (and turn off Required State) so the Outcome Table spell can run, or disable Rollable Table.',
      gmTasks: TRIGGER_GM_TASKS
    };
  }

  const reqEnabled = tc?.requiredConditions?.enabled === true ||
    (tc?.requiredConditions?.conditions || []).length > 0 ||
    (tc?.requiredConditions?.logicType && tc.requiredConditions.logicType !== 'AND');
  if (reqEnabled) {
    return {
      kind: 'trigger-conflict',
      controlId: 'required-state',
      reasonText: 'Required casting conditions stay GM-manual: Prism does not check Required State preconditions before casting. Because this rule is refused whole, the entire ability is played by hand.',
      summary: 'Required casting conditions stay GM-manual, so the whole ability is played by hand. Nothing was removed from the saved spell.',
      alternative: 'Switch Trigger Mode from Required State back to Triggers, remove any Required Conditions, and keep ALL CONDITIONS selected.',
      gmTasks: [
        'Required conditions: the GM checks the required casting conditions at the table before resolving the spell.',
        TRIGGER_GM_TASKS[1]
      ]
    };
  }

  if (!isEmpty(tc?.conditionalEffects)) {
    return {
      kind: 'trigger-conflict',
      controlId: 'triggers',
      reasonText: 'Conditional effect formulas stay GM-manual: Prism does not evaluate conditional effect overrides. Because this rule is refused whole, the entire ability is played by hand.',
      summary: 'Conditional effect formulas stay GM-manual, so the whole ability is played by hand. Nothing was removed from the saved spell.',
      alternative: 'Turn off Enable Conditional Activation on effect triggers in Triggers.',
      gmTasks: TRIGGER_GM_TASKS
    };
  }

  const hasOrLogic = tc?.global?.logicType === 'OR' || Object.values(tc?.effectTriggers || {}).some(g => g?.logicType === 'OR');
  if (hasOrLogic) {
    return {
      kind: 'trigger-conflict',
      controlId: 'trigger-logic',
      reasonText: 'ANY CONDITION (OR) trigger logic stays GM-manual: supported Action triggers require ALL CONDITIONS (AND) with one single approved trigger. Because this setting is refused whole, the entire ability is played by hand.',
      summary: 'ANY CONDITION (OR) trigger logic stays GM-manual for Action triggers, so the whole ability is played by hand. Nothing was removed from the saved spell.',
      alternative: 'Switch Trigger Logic from ANY CONDITION back to ALL CONDITIONS (AND) in Triggers.',
      gmTasks: TRIGGER_GM_TASKS
    };
  }

  if (/^triggers\s*\(/i.test(rawReason)) {
    let alternative = 'Adjust the trigger or conflicting spell setting in Triggers so only a supported trigger combination remains, or remove the trigger.';
    if (/area spell/i.test(rawReason)) {
      alternative = 'Switch Targeting from Area back to Single Target, or remove the watched Direct Damage trigger.';
    } else if (/saving throw on the same effect/i.test(rawReason)) {
      alternative = 'Remove the Critical Hit trigger on Control, or remove the Saving Throw from the composed Control effect.';
    } else if (/single-die Direct Damage/i.test(rawReason)) {
      alternative = 'Use a single-die Direct Damage formula in Effects (such as 1d8 or 1d6+2), or remove the Critical Hit trigger on Control.';
    } else if (/authored-effect:v1/i.test(rawReason)) {
      alternative = 'Use the composed Control effect profile alongside Direct Damage in Effects, or remove the Critical Hit trigger on Control.';
    } else if (/Direct Damage part/i.test(rawReason)) {
      alternative = 'Move "Follow-up After My Damage" onto Global Triggers or the Direct Damage part only, or remove it from the non-damage part.';
    }
    return {
      kind: 'trigger-conflict',
      controlId: 'triggers',
      reasonText: readableReason(rawReason),
      summary: 'This trigger combination stays GM-manual: Prism cannot run this trigger with the current spell settings, so the whole ability is played by hand. Nothing was removed from the saved spell.',
      alternative,
      gmTasks: TRIGGER_GM_TASKS
    };
  }

  const isChanneled = draft?.spellType === 'CHANNELED';
  return {
    kind: 'trigger-conflict',
    controlId: 'triggers',
    reasonText: isChanneled
      ? 'Channeled spells run scheduled turn ticks without triggers; stored triggers keep the whole channeled spell GM-manual.'
      : 'This trigger configuration stays GM-manual: for Immediate Action spells, Prism supports one single approved trigger (Global "Follow-up After My Damage" / "Follow-up After My Healing", Effect-Specific Direct Damage "Follow-up After My Damage", or Control "Critical Hit") with ALL CONDITIONS.',
    summary: 'This trigger configuration stays GM-manual, so the whole ability is played by hand. Nothing was removed from the saved spell.',
    alternative: isChanneled
      ? 'Remove all triggers in Triggers so the Channeled spell can run its scheduled ticks.'
      : 'Remove unsupported triggers in Triggers or replace them with one supported trigger ("Follow-up After My Damage", "Follow-up After My Healing", or Control "Critical Hit" with a single-die Direct Damage + composed Control effect).',
    gmTasks: TRIGGER_GM_TASKS
  };
}

function rollableTableBlockerInfo(record, result) {
  if (!result || result.ok) return null;
  const rawReason = String(result.reason || '');
  if (rawReason === WEIGHTED_COIN_REFUSAL) {
    return {
      kind: 'weighted-coin',
      controlId: 'coin-type',
      reasonText: 'Weighted coins require GM adjudication: weighted coin odds and outcomes are not settled for automated execution. Switch Coin Type to fair standard coins (50/50) in Rollable Table, or keep this spell manual.',
      summary: 'Weighted coins require GM adjudication, so Prism cannot run this ability automatically as authored. All of it is played by hand, and nothing was removed from the saved spell.',
      alternative: 'Switch Coin Type from Weighted to Standard (Heads/Tails) in Rollable Table for automated fair coin resolution.',
      gmTasks: WEIGHTED_COIN_GM_TASKS
    };
  }
  if (rawReason === CARD_UNSETTLED_REASON) {
    return {
      kind: 'card-outcome',
      controlId: 'resolution-method',
      reasonText: CARD_UNSETTLED_REASON,
      summary: 'Card draw outcome tables stay GM-manual because deck persistence, reshuffle, and face-down reveal rules are not settled. All of it is played by hand, and nothing was removed from the saved spell.',
      alternative: 'Switch Resolution Method from Cards to Dice or Coins (with Coin Type set to Standard (Heads/Tails)) for automated outcome resolution.',
      gmTasks: CARD_OUTCOME_GM_TASKS
    };
  }
  if (!/^rollableTable\b/i.test(rawReason)) return null;

  let controlId = 'resolution-method';
  if (/branch|range|coverage|pattern|between 2/i.test(rawReason)) controlId = 'entries';
  else if (/table name/i.test(rawReason)) controlId = 'table-details';

  let alternative = 'Update the Rollable Table settings to use a supported single die (d4–d100) or 1–10 fair Standard coins covering all outcomes with Damage or Healing branches.';
  if (/author their effects inside the Rollable Table only/i.test(rawReason)) {
    alternative = 'Deselect separate Effect cards (such as Damage or Healing) in Effects so effects are authored inside the Rollable Table only, or turn off the Rollable Table.';
  } else if (/without cooldowns, triggers/i.test(rawReason)) {
    alternative = 'Use Single Target manual targeting, set Cooldown to No Cooldown, remove triggers, and clear class mechanics so the Rollable Table can run.';
  } else if (/table name/i.test(rawReason)) {
    alternative = 'Enter a non-empty Table Name (1–120 characters) under Table Details.';
  } else if (/supported single die/i.test(rawReason)) {
    alternative = 'Choose a supported single die type (d4, d6, d8, d10, d12, d20, or d100) under Dice Configuration.';
  } else if (/coinCount/i.test(rawReason)) {
    alternative = 'Set Number of Coins to a whole number from 1 to 10.';
  } else if (/Damage and Healing branch effects|modifiesBaseSpell|linked spell|area damage|ignoreArmor|critical multipliers|heal-over-time|area healing|overheal|branch formula|damageType required|missing effect configuration/i.test(rawReason)) {
    alternative = 'Edit the Rollable Table entries so every branch uses plain Damage or Healing with an NdM±K or fixed integer formula and no area, DoT/HoT, or spell-link modifiers.';
  } else if (/cover every|overlap|within 1\.\.|settled fair-coin pattern|between 2/i.test(rawReason)) {
    alternative = 'Adjust the Table Entries so 2+ non-overlapping branches cover every die face (or every coin heads count) without gaps.';
  }

  return {
    kind: 'rollable-table',
    controlId,
    reasonText: readableReason(rawReason),
    summary: 'This Rollable Table combination stays GM-manual, so the whole ability is played by hand. Nothing was removed from the saved spell.',
    alternative,
    gmTasks: ROLLABLE_TABLE_GM_TASKS
  };
}

export function blockerTargetFor(record, result) {
  if (!result || result.ok) return null;
  if (result.reason === WEIGHTED_COIN_REFUSAL) {
    return {
      stepId: 'rollable-table',
      stepName: 'Rollable Table',
      settingLabel: 'Coin settings',
      actionLabel: 'Go to Coin Settings (Rollable Table)'
    };
  }
  if (result.reason === CARD_UNSETTLED_REASON) {
    return {
      stepId: 'rollable-table',
      stepName: 'Rollable Table',
      settingLabel: 'Resolution Method',
      actionLabel: 'Go to Resolution Method (Rollable Table)'
    };
  }
  if (mixedTriggerBlockerInfo(record, result) || singleTriggerBlockerInfo(record, result)) {
    return {
      stepId: 'triggers',
      stepName: 'Triggers',
      settingLabel: 'Trigger Conditions',
      actionLabel: 'Go to Trigger Conditions (Triggers)'
    };
  }
  if (/^rollableTable\b/i.test(String(result.reason || ''))) {
    return {
      stepId: 'rollable-table',
      stepName: 'Rollable Table',
      settingLabel: 'Rollable Table',
      actionLabel: 'Go to Rollable Table'
    };
  }
  return null;
}

function nextSteps(state, ctx, routeRefusal = null, definition = null, blockerKind = null, alternative = null) {
  const gm = ctx.gm === true;
  const isCreature = isCreatureRoute(ctx);
  if (routeRefusal) {
    return [
      shared(ctx) ? 'Keep playing it by hand. This ability shape is not currently executable by a creature source. ' + SHARED_MANUAL : 'Keep playing it by hand. This ability shape is not currently executable by a creature source. ' + LOCAL_CAST,
      'To make it executable by a creature source, change what the route restriction above names (it needs a primary owner PC source, which can still run this saved spell as authored). The saved spell stays exactly as authored until you do.'
    ];
  }
  if ((definition?.capability === PASSIVE_ENTRY_CAPABILITY || definition?.capability === PASSIVE_TURN_CAPABILITY) && (state === STATES.EXECUTABLE || state === STATES.PARTIAL)) {
    if (!shared(ctx)) return [LOCAL_CAST];
    return gm
      ? ['Use "Admit this saved version" below, then explicitly activate it for a primary PC in Passive ability activation. Updating the spell later needs a new admission and reactivation.']
      : ['Ask the GM to admit this saved passive and activate it in Passive ability activation.'];
  }
  if (state === STATES.EXECUTABLE || state === STATES.PARTIAL) {
    if (!shared(ctx)) return [LOCAL_CAST];
    if (isCreature) {
      return gm
        ? ['Use "Admit for this creature" below. Once admitted, inspect the placed creature to use this ability. Changing the ability later needs a new admission.']
        : ['Ask the GM to admit this version for this creature. Until it is admitted, casting it here is manual. ' + SHARED_MANUAL];
    }
    if (definition?.componentWatch) {
      return gm
        ? ['Use "Admit this saved version" below, then pair this exact admitted version\'s Direct Damage watch with one primary character and a separate follow-up spell. Editing the spell later creates a new version that needs a new admission and new watch registration.']
        : ['Ask the GM to admit this saved version and pair this exact admitted version\'s Direct Damage watch with your primary character, then use "Refresh room admission". Editing the spell later creates a new version that is not watched until admitted and registered separately. Until it is admitted, casting it here is manual. ' + SHARED_MANUAL];
    }
    return gm
      ? ['Use "Admit this saved version" below, then cast from the action bar. Changing the spell later needs a new admission.']
      : ['Ask the GM to admit this saved version, then use "Refresh room admission". Until it is admitted, casting it here is manual. ' + SHARED_MANUAL];
  }
  if (state === STATES.BLOCKED) return [shared(ctx) ? 'Keep playing it by hand. Nothing needs to change in the spell; admission opens once the decision is recorded. ' + SHARED_MANUAL : 'Keep playing it by hand. Nothing needs to change in the spell; admission opens once the decision is recorded. ' + LOCAL_CAST];
  if (blockerKind === 'weighted-coin') {
    return [
      shared(ctx) ? 'Cast it from the action bar as usual. ' + SHARED_MANUAL : LOCAL_CAST,
      'To enable automated coin resolution, open Rollable Table and switch Coin Type to Standard (Heads/Tails). The saved spell stays exactly as authored until you do.'
    ];
  }
  if (blockerKind === 'card-outcome') {
    return [
      shared(ctx) ? 'Play and resolve this card table by hand with the GM. ' + SHARED_MANUAL : LOCAL_CAST,
      (alternative || 'Switch Resolution Method from Cards to Dice or Coins (with Coin Type set to Standard (Heads/Tails)) for automated outcome resolution.') + ' The saved spell stays exactly as authored until you do.'
    ];
  }
  if (blockerKind === 'trap-spell-type') {
    return [
      shared(ctx) ? 'Track and resolve this trap by hand with the GM. ' + SHARED_MANUAL : LOCAL_CAST,
      'The whole Trap spell type is GM-managed, so no single setting makes a Trap automated. Keep the draft intact for manual GM-managed play.'
    ];
  }
  if (blockerKind === 'mixed-triggers') {
    return [
      shared(ctx) ? 'Play and resolve this ability by hand with the GM. ' + SHARED_MANUAL : 'Play and resolve this ability by hand with the GM (Prism does not auto-fire triggers, record saves, or track later-turn expiry). ' + LOCAL_CAST,
      'To make it compatible, keep at most one supported trigger scope in Triggers (whole-spell follow-up, watched Direct Damage part, or critical-hit rider gate) with no extra trigger rules. The saved spell stays exactly as authored until you do.'
    ];
  }
  if (blockerKind === 'trigger-conflict') {
    return [
      shared(ctx) ? 'Play and resolve this ability by hand with the GM. ' + SHARED_MANUAL : LOCAL_CAST,
      (alternative || 'Update the trigger settings in Triggers.') + ' The saved spell stays exactly as authored until you do.'
    ];
  }
  if (blockerKind === 'rollable-table') {
    return [
      shared(ctx) ? 'Play and resolve this outcome table by hand with the GM. ' + SHARED_MANUAL : LOCAL_CAST,
      (alternative || 'Update the Rollable Table settings in the Wizard.') + ' The saved spell stays exactly as authored until you do.'
    ];
  }
  return [shared(ctx) ? 'Cast it from the action bar as usual. ' + SHARED_MANUAL : LOCAL_CAST,
    'To make it compatible, edit the blocking mechanic in the Wizard. The saved spell stays exactly as authored until you do.'];
}

/** What the validated definition itself declares as not automated. Nothing here is inferred from the record. */
function responsibilities(def) {
  const manual = [];
  const timing = def.timing;
  if (def.capability === CHANNELED_CAPABILITY) {
    const ch = def.channel;
    const bound = ch.tickFrequency === 'START_OF_TURN' ? 'start' : 'end';
    const n = ch.maxChannelDuration;
    manual.push(`Resolving channeled ticks: ${n} tick${n === 1 ? '' : 's'} recorded automatically at the ${bound} of the caster's upcoming turn${n === 1 ? '' : 's'} (while target stays within ${ch.rangeFeet} ft and caster is unstunned and conscious); HP changes only when the GM resolves each tick with its separate roll. The final tick recorded at natural completion remains available for GM resolution.`);
    if (ch.concentrationDC && ch.dcType) {
      manual.push(`Concentration checks: damage to the caster while channeling attaches a read-only ${ch.dcType} DC ${ch.concentrationDC} concentration check hint; the GM interrupts the channel manually by removing its condition.`);
    }
    manual.push(`Ending the channel early: automatically ends before ticking if the target moves beyond ${ch.rangeFeet} ft or if the caster becomes Stunned or reaches 0 HP (zero extra ticks fire after channel end). Requires active authenticated turn tracking with the caster in the combat roster.`);
  } else if (def.effects?.condition?.kind === 'periodic') {
    const boundary = (timing?.expiryPolicy === 'target-start-count' || timing?.expiryPolicy === 'target-next-start' ||
      timing?.expiryPolicy === 'authored-target-start-count' || timing?.expiryPolicy === 'authored-target-next-start') ? 'start' : 'end';
    const ticks = timing?.occurrences || 1;
    manual.push(`Resolving periodic ticks: ${ticks} tick${ticks === 1 ? '' : 's'} recorded automatically at target turn ${boundary}; HP changes only when the GM resolves each tick with its separate roll. The final tick recorded at natural expiry remains available for GM resolution.`);
  } else if (timing) {
    const duration = timing.durationText ? ` (authored duration: ${timing.durationText})` : '';
    if (timing.expiryPolicy === 'gm-manual') manual.push(`Ending the effect: the GM removes it${duration}.`);
    else if (timing.expiryPolicy) manual.push(`Ending the effect: ${policyText(timing.expiryPolicy, timing.occurrences)}${duration}. This needs active authenticated turn tracking with the target in the combat roster; without it the GM's confirmation of the cast is refused and nothing is spent (it never falls back to GM removal).`);
  }
  if (def.capability === AREA_CAPABILITY) manual.push('Per-target final amounts: the GM adjudicates each target. Up to ' + (def.targeting?.maxTargets ?? 8) + ' creatures; larger areas are not truncated.');
  // Shared GM-recorded save branch: the table rolls the save; the VTT only applies the recorded, owner-approved outcome.
  if (def.effects?.save) manual.push(`Rolling the save: ${saveManualText(def.effects.save)}`);
  // Direct-damage save: same GM-recorded procedure; the outcome changes only the Direct Damage part.
  if (def.save) manual.push(`Rolling the save: ${saveManualText(def.save)} The GM's final amount is entered before the save is applied.`);
  if (def.capability === PASSIVE_ENTRY_CAPABILITY) {
    manual.push('Activating the passive: GM explicitly activates the admitted passive in Passive ability activation.');
    manual.push('Teleport, forced movement, and re-entry behavior remain unsettled/open.');
  }
  if (def.capability === PASSIVE_TURN_CAPABILITY) {
    manual.push('Activating the passive: GM explicitly activates the admitted passive in Passive ability activation (requires active authenticated combat turn tracking).');
  }
  if (def.catalogueSource) manual.push('Anything else on the catalogue card (riders, secondary text, effects beyond the formula, target and class price) is played at the table. The whole record is preserved.');
  return manual;
}

/** People who still decide, as the existing admission panel states for every admitted route. Never implies full automation. */
function confirmations(def, isCreature = false) {
  if (def.capability === PASSIVE_ENTRY_CAPABILITY || def.capability === PASSIVE_TURN_CAPABILITY) {
    return [
      'The GM admits this saved version and explicitly activates it on a primary player character in Passive ability activation.',
      'No cast-time AP or mana price is spent; exact GM removal clears the applied effect.'
    ];
  }
  if (isCreature) {
    const list = ['The GM confirms success and any final amount.'];
    if (def.capability === CHANNELED_CAPABILITY) return [
      'The GM confirms channel start and target selection.',
      'The GM resolves each recorded due tick with its separate roll and handles any concentration interruption manually.'
    ];
    if (def.effects?.condition?.kind === 'periodic') list.push('The GM resolves each recorded periodic tick with its separate roll.');
    if (def.effects?.save || def.save) list.push('The GM records the saving throw outcome (target saves / target fails).');
    return list;
  }
  if (def.capability === CHANNELED_CAPABILITY) {
    return [
      'The owner approves the upfront AP/mana price, target, and channel terms before channel start.',
      'The GM confirms channel start, resolves each recorded due tick with its separate roll, and handles any concentration interruption manually.'
    ];
  }
  const list = ['The owner approves the exact price, target and roll before anything is applied.', 'The GM confirms success and any final amount.'];
  if (def.capability === OUTCOME_CAPABILITY) list.push(`The owner resolves the outcome once via the existing ${def.outcomeTable?.mechanic === 'coin' ? 'fair coin flip' : 'die roll'} source and approves the selected branch before confirmation; cast AP and mana price is paid once.`);
  if (def.capability === FLOW_CAPABILITY) list.push('The owner rolls 2d6 for the Flow check; the GM records hit or miss and final damage.');
  if (def.effects?.condition?.kind === 'periodic') list.push('The GM resolves each recorded periodic tick with its separate roll.');
  if (def.effects?.save || def.save) list.push('The owner approves both outcomes (target saves / target fails); the GM records which one happened and cannot substitute other terms.');
  if (def.componentWatch) list.push('Saving or admitting never activates the watch: the GM pairs this exact admitted version\'s Direct Damage part with one primary character and one separate follow-up spell (other or edited versions are not watched unless admitted and registered separately).');
  if (def.targetRoute === 'primary-pc-healing') list.push('The target\'s owner accepts the exact healing amount.');
  return list;
}

function automatedParts(def) {
  const parts = [definitionSummary(def)];
  if (def.componentWatch) {
    parts.push('Watched part trigger: watches only this exact admitted version\'s Direct Damage part (≥ 1 base HP removed after temp HP) to offer a separate GM-paired follow-up spell (one offer per cast; lapses at the caster\'s next authenticated turn start).');
  }
  if (def.capability === FLOW_CAPABILITY) {
    parts.push('Flow check: 2d6 per committed action (Quick Draw: +2 stabbing damage on a hit when natural doubles or |d1 - d2| <= pre-roll Flow; miss deals 0 damage; Flow stays 1..4).');
  }
  if (def.save) parts.push(describeDirectSave(def.save));
  if (def.cooldown) parts.push(require('../../../services/authoredCooldown').procedure(def.cooldown.cooldownValue));
  if (def.capability === CHANNELED_CAPABILITY) {
    parts.push('Upfront AP/mana paid once at channel start; scheduled ticks have no extra cost.');
    parts.push(`Range (${def.channel.rangeFeet} ft) verified at channel start and on every turn boundary advance (broken channels end permanently with no extra ticks).`);
  }
  if (def.effects?.condition?.kind === 'periodic') {
    parts.push('Cost paid once at cast; scheduled ticks have no additional cost.');
  }
  const price = def.resourceCost ? `Price: ${def.resourceCost.actionPoints} AP, ${def.resourceCost.mana} mana` : null;
  if (price) parts.push(price);
  if (def.classPayment?.domain) parts.push(`Typed class price (${def.classPayment.domain})`);
  const t = def.targeting;
  if (t?.kind === 'self_centered_radius') {
    parts.push(`Target: self-centered ${t.radiusFeet} ft radius (${t.restriction} moves into radius)`);
  } else if (t?.kind === 'self') {
    const boundaryText = def.trigger?.kind === 'turn_start' ? 'turn start' : 'turn end';
    parts.push(`Target: self (on ${def.trigger?.whoseTurn || 'self'} ${boundaryText})`);
  } else if (t?.kind === 'area') {
    parts.push(t.aoeShape === 'line'
      ? `Target: line from the caster, ${t.lengthFeet}×${t.widthFeet} ft (you aim the direction)`
      : `Target: placed circle, ${t.radiusFeet} ft, range ${t.rangeFeet} ft`);
  }
  else if (t) parts.push(t.selectionMethod === 'lowest_health'
    ? `Target: lowest-HP creature in range, ${t.rangeFeet} ft (${t.restriction})`
    : `Target: one creature, range ${t.rangeFeet} ft (${t.restriction})`);
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
/**
 * The class route a Review/Library check uses. A draft has no class binding of its own (GM admission binds it),
 * so an explicit class wins; otherwise a draft that authors Hunter Flow is checked on the Hunter route, because
 * Hunter Flow exists under no other class; anything else keeps the historical default.
 */
export function reviewClassId(record, ctx = {}) {
  if (ctx?.classId) return ctx.classId;
  if (record?.classId) return record.classId;
  return extractFlowAuthoringFromRecord(record) ? 'hunter' : 'arcanoneer';
}

export function explainExecution(record, ctx = {}) {
  const preserved = authoredInventory(record);
  const p9Minstrel = getP9MinstrelPairSpec(record);
  if (p9Minstrel && !isCreatureRoute(ctx)) {
    const notes = ['This is a reviewed Minstrel P9 ability pair (Opening Chord → Resolving Strike). It does not grant admission and does not say you can cast it now: your current resources, Musical Notes bank, ownership, and chosen target are checked when you cast.'];
    return {
      state: STATES.EXECUTABLE,
      title: STATE_TITLE[STATES.EXECUTABLE],
      automated: [
        `${p9Minstrel.kind} · ${p9Minstrel.formula} ${p9Minstrel.damageTypes.join('/')}`,
        `Price: ${p9Minstrel.ap} AP, ${p9Minstrel.mana} mana`,
        `Typed class price (musicalNotes): ${p9Minstrel.classPriceLabel}`,
        `Target: one creature, range ${p9Minstrel.rangeFeet} ft (any)`
      ],
      manual: [],
      confirm: [
        'The owner approves the exact price, target and roll before anything is applied.',
        'The GM confirms success and any final amount.'
      ],
      reasons: [],
      blockerTarget: null,
      stepGuidance: null,
      outcomeSummary: null,
      preserved,
      summary: 'This reviewed Minstrel pair runs through Prism P9. People still confirm each step, as listed below.',
      notes,
      next: ctx.shared === true
        ? ['Cast from the Action Bar or Character Sheet in a shared room to open owner approval and GM confirmation.']
        : [LOCAL_CAST]
    };
  }
  const result = definitionFromWizard(record, { roomId: ctx.roomId, classId: reviewClassId(record, ctx), definitionVersion: ctx.definitionVersion || 1 });
  const notes = ['This is a structural check only, against the same rules the server applies. It does not grant admission and does not say you can cast it now: the GM\'s room admission, your ownership, your current resources and the chosen target are checked when you cast.'];
  if (!result.ok) {
    const draft = record?.authoredDraft && typeof record.authoredDraft === 'object' ? record.authoredDraft : record;
    const flowAuthoring = extractFlowAuthoringFromRecord(record);
    const mc = record?.authoredDraft?.mechanicsConfig || record?.mechanicsConfig;
    const hasOtherMechanics = Boolean(mc && typeof mc === 'object' && Object.entries(mc).some(([k, v]) => {
      if (k === 'hunterFlow') return false;
      if (k === 'stateRequirements') return (v || []).length > 0;
      if (k === 'stateOptions') return (v?.thresholds || []).length > 0;
      return hasContent(v);
    }));
    const flowRefusal = Boolean(flowAuthoring) && !hasOtherMechanics && /^mechanicsConfig\b/.test(String(result.reason || ''));
    // Two different reasons share one refusal: another class route (a genuine eligibility gate) versus a Hunter Flow ability the creator has not approved.
    const routeClass = reviewClassId(record, ctx);
    const flowClassGated = flowRefusal && routeClass !== 'hunter';
    const blockedByHunterFlow = flowRefusal && !flowClassGated;
    const weightedCoinBlocker = result.reason === WEIGHTED_COIN_REFUSAL;
    const trapSpellType = draft?.spellType === 'TRAP' && /^Immediate ACTION required\b/.test(String(result.reason || ''));
    const mixedTriggerInfo = (!flowRefusal && !weightedCoinBlocker && !trapSpellType) ? mixedTriggerBlockerInfo(record, result) : null;
    const singleTriggerInfo = (!flowRefusal && !weightedCoinBlocker && !trapSpellType && !mixedTriggerInfo) ? singleTriggerBlockerInfo(record, result) : null;
    const triggerInfo = mixedTriggerInfo || singleTriggerInfo;
    const outcomeInfo = (!flowRefusal && !trapSpellType && !triggerInfo) ? rollableTableBlockerInfo(record, result) : null;
    const blockerInfo = triggerInfo || outcomeInfo;
    const blockerTarget = blockerTargetFor(record, result);
    const blockerKind = trapSpellType ? 'trap-spell-type' : (blockerInfo ? blockerInfo.kind : null);
    const stepGuidance = blockerTarget && blockerInfo
      ? { stepId: blockerTarget.stepId, controlId: blockerInfo.controlId, alternative: blockerInfo.alternative }
      : null;
    const blocked = blockedByHunterFlow || result.reason === AREA_ROLL_UNAPPROVED_REASON || Object.values(DIRECT_SAVE_UNAPPROVED).includes(result.reason);
    const state = blocked ? STATES.BLOCKED : STATES.UNSUPPORTED;
    const reasonText = flowClassGated
      ? `Hunter Flow runs only under a Hunter class binding. This check used the ${routeClass} route, so Prism cannot run it there; this is a class-route limit, not an unapproved ability. Bind it to Hunter at admission to check it as a Hunter ability.`
      : blockedByHunterFlow
        ? 'Only the approved Quick Draw (1 AP, 0 mana, one enemy within 30 ft, 1d6 stabbing) runs through Prism. Other Hunter Flow abilities (preparation, companion, multi-target, periodic) stay manual until the creator approves them; keep this ability manual and preserve all authored Flow fields whole.'
        : trapSpellType
          ? 'Whole spell type is GM-managed: Trap spells are not automated by Prism (no single trap setting enables automation). Resolve placement, detection, disarming, and triggering with the GM at the table.'
          : blockerInfo
            ? blockerInfo.reasonText
            : readableReason(result.reason);
    const summary = blockedByHunterFlow
      ? 'This Hunter Flow ability is outside the approved executable slice; all of it is played by hand, and nothing was removed from the saved spell.'
      : blocked
        ? 'The first blocker the validator detected is not an approved executable shape; the whole ability stays manual and nothing was removed from the saved spell.'
        : trapSpellType
          ? 'Trap is a GM-managed spell type as a whole: Prism does not automatically place, arm, detect, disarm, or trigger traps, so the whole spell is played by hand. Nothing was removed from the saved spell.'
          : blockerInfo
            ? blockerInfo.summary
            : 'Prism cannot run this ability as authored, and it cannot run part of it, so all of it is played by hand. Nothing was removed from the saved spell.';
    return { state, title: STATE_TITLE[state], automated: [], manual: blockerInfo?.gmTasks || [], confirm: [], preserved,
      summary,
      reasons: [{ label: 'First detected blocker', text: reasonText }],
      blockerTarget,
      stepGuidance,
      outcomeSummary: null,
      notes: ['This is the first blocker the validator detected, not a full diagnosis. Other mechanics in this spell may also block it; they were not checked one by one.', ...notes],
      next: nextSteps(state, ctx, null, null, blockerKind, blockerInfo?.alternative || null) };
  }
  const isCreature = isCreatureRoute(ctx);
  const routeRefusal = isCreature ? creatureSourceRefusal(result.definition) : null;
  if (routeRefusal) {
    const state = STATES.UNSUPPORTED;
    return {
      state,
      title: STATE_TITLE[state],
      automated: [],
      manual: [routeRefusal.reason, ...responsibilities(result.definition)],
      confirm: [],
      preserved,
      summary: `Structurally compatible with a Prism route, but not executable through this creature source: ${routeRefusal.reason} All of it is played by hand; the whole record is preserved.`,
      reasons: [{ label: 'Route restriction', text: routeRefusal.reason }],
      blockerTarget: null,
      stepGuidance: null,
      outcomeSummary: null,
      notes: ['The saved definition is structurally compatible with Prism, but the creature source route cannot execute it.', ...notes],
      next: nextSteps(state, ctx, routeRefusal)
    };
  }
  const manual = responsibilities(result.definition);
  const state = manual.length ? STATES.PARTIAL : STATES.EXECUTABLE;
  const outcomeSummary = result.definition.capability === OUTCOME_CAPABILITY && result.definition.outcomeTable
    ? `Executable outcome table ready (${result.definition.outcomeTable.branches.length} branches covering ${result.definition.outcomeTable.mechanic === 'dice' ? `1d${result.definition.outcomeTable.spec.sides}` : `${result.definition.outcomeTable.spec.count} fair coin(s)`}).`
    : null;
  return { state, title: STATE_TITLE[state], automated: automatedParts(result.definition), manual, confirm: confirmations(result.definition, isCreature), reasons: [], blockerTarget: null, stepGuidance: null, outcomeSummary, preserved,
    summary: state === STATES.PARTIAL ? 'Prism runs the parts listed below. The rest is yours or the GM\'s to play.' : 'The saved record fits a supported Prism route. That is not full automation: people still confirm each step, as listed below.',
    notes, next: nextSteps(state, ctx, null, result.definition) };
}
