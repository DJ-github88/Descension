/* global globalThis */
/** P14-A1 pure whole-Wizard adapter. Shared by server admission and authoring diagnostics.
 * No RNG, storage, authority or execution. Unknown mechanics refuse instead of being stripped. */
const { canonical, sha256Hex } = require('./canonicalHash');
const { catalogueExecutable } = require('./catalogueAbility.cjs');
const CAPABILITY = 'authored-immediate:v1';
const FORMULA_CAPABILITY = 'authored-immediate:v2';
const FORMULA_COMPILER = 'p14-m4-formula-1';
const HEALTH_CAPABILITY = 'authored-immediate:v3';
const HEALTH_COMPILER = 'p14-m4c-missing-health-1';
const DETERMINISTIC_CAPABILITY = 'authored-immediate:v4';
const DETERMINISTIC_COMPILER = 'p14-m4d-deterministic-1';
const readDeterministicFormula = (formula, stats, health) => {
  const result = formulaContract.readFormula(formula, stats, { integerScaling: true, missingHealth: health, allowZeroDice: true });
  return result.supported && result.dice.length ? { supported: false, reason: 'A deterministic formula must contain no dice.' } : result;
};
const isDeterministic = approval => approval?.spell?.definitionHash?.startsWith(`${DETERMINISTIC_CAPABILITY}/`) === true;
const AREA_CAPABILITY = 'authored-area:v1';
const AREA_COMPILER = 'p14-m6a-area-1';
const MAX_AREA_TARGETS = 8;
const MAX_AREA_ACTORS = 9;
const AREA_ROLL_PROCEDURE = 'shared-area-roll-proposed';
const AREA_ROLL_POLICY = Object.freeze({
  procedure: AREA_ROLL_PROCEDURE,
  creatorApproval: Object.freeze({
    reference: 'creator-approval-20261110-m6a-shared-roll',
    scope: 'first-ranged-circle-creature-targets'
  }),
  request: 'docs/MYTHRILL_COMBAT_CAPABILITY_PLAN.md — M6A area roll procedure (shared roll vs per-target roll)'
});
const AREA_ROLL_UNAPPROVED_REASON = 'Area roll procedure (shared-area-roll-proposed vs independent per-target rolls) awaits creator confirmation; keep this area ability manual until approved.';
let testAreaRollProposalEnabled = false;
let testAreaRollApprovalOverride = undefined;
function setAreaRollProposalForTest(enabled) { testAreaRollProposalEnabled = enabled === true; }
function setAreaRollApprovalForTest(override) { testAreaRollApprovalOverride = override; }
function isAreaRollProcedureApproved(options = {}) {
  if (options && options.allowProposedAreaRoll === true) return true;
  if (options && options.allowProposedAreaRoll === false) return false;
  const approval = testAreaRollApprovalOverride !== undefined ? testAreaRollApprovalOverride : AREA_ROLL_POLICY.creatorApproval;
  if (approval && typeof approval.reference === 'string' && approval.reference.trim()) return true;
  if (typeof globalThis !== 'undefined' && globalThis.__MYTHRILL_ENABLE_PROPOSED_AREA_ROLL__ === true) return true;
  return testAreaRollProposalEnabled === true;
}
// M4 extends the existing shared calculation contract; no arbitrary expression evaluator.
const formulaContract = require('./classEffect');
const saveBranch = require('./saveBranch');
// Direct-damage save (handoff/direct-damage-save/CONTRACT.md): one save on the only part of a single-target immediate damage spell.
const directSave = require('./directSave');
const hunterFlow = require('./hunterFlow');
const randomOutcome = require('./randomOutcome');
const OUTCOME_CAPABILITY = randomOutcome.CAPABILITY;
const OUTCOME_COMPILER = randomOutcome.COMPILER;
const isOutcome = randomOutcome.isOutcome;
const FLOW_CAPABILITY = hunterFlow.FLOW_CAPABILITY;
const FLOW_COMPILER = hunterFlow.FLOW_COMPILER;
const isHunterFlow = approval => approval?.spell?.definitionHash?.startsWith(`${FLOW_CAPABILITY}/`) === true;
const readScaledFormula = (formula, stats) => formulaContract.readFormula(formula, stats, { integerScaling: true });
const readHealthFormula = (formula, stats, health) => formulaContract.readFormula(formula, stats, { integerScaling: true, missingHealth: health });
const formulaAttributes = formulaContract.formulaAttributes;
const isHealth = approval => approval?.spell?.definitionHash?.startsWith(`${HEALTH_CAPABILITY}/`) === true || (isDeterministic(approval) && approval.rollHealth !== undefined);
const isFormula = approval => approval?.spell?.definitionHash?.startsWith(`${FORMULA_CAPABILITY}/`) === true || isHealth(approval) || isDeterministic(approval);
const isArea = approval => approval?.spell?.definitionHash?.startsWith(`${AREA_CAPABILITY}/`) === true;
const ADAPTER_VERSION = 'p14-a1-wizard-1';
const CONDITION_CAPABILITY = 'authored-condition:v1';
const EFFECT_CAPABILITY = 'authored-effect:v1';
const CHANNELED_CAPABILITY = 'authored-channeled:v1';
const CHANNELED_COMPILER = 'p14-channeled-1';
const isChanneled = approval => approval?.spell?.definitionHash?.startsWith(`${CHANNELED_CAPABILITY}/`) === true;
const authoredChanneled = require('./authoredChanneled');
const PASSIVE_ENTRY_CAPABILITY = 'authored-passive-entry:v1';
const PASSIVE_ENTRY_COMPILER = 'p14-passive-entry-1';
const PASSIVE_ENTRY_TRIGGER_ID = 'moves_into_radius';
const PASSIVE_ENTRY_TRIGGER = 'passive-moves-into-radius:v1';
const PASSIVE_ENTRY_OPEN_RULES = Object.freeze(['teleport', 'forced-movement', 're-entry']);
const isPassiveEntry = value => Boolean(value && (
  value.capability === PASSIVE_ENTRY_CAPABILITY ||
  value.capabilityId === PASSIVE_ENTRY_CAPABILITY ||
  (value.spell && value.spell.definitionHash && value.spell.definitionHash.startsWith(PASSIVE_ENTRY_CAPABILITY + '/'))
));
const PASSIVE_TURN_CAPABILITY = 'authored-passive-turn:v1';
const PASSIVE_TURN_COMPILER = 'p14-passive-turn-1';
const PASSIVE_TURN_TRIGGER_IDS = Object.freeze(['turn_start', 'turn_end']);
const PASSIVE_TURN_WHOSE_VALUES = Object.freeze(['self', 'ally', 'enemy', 'any']);
const PASSIVE_TURN_TRIGGER = 'passive-turn-boundary:v1';
const isPassiveTurn = value => Boolean(value && (
  value.capability === PASSIVE_TURN_CAPABILITY ||
  value.capabilityId === PASSIVE_TURN_CAPABILITY ||
  (value.spell && value.spell.definitionHash && value.spell.definitionHash.startsWith(PASSIVE_TURN_CAPABILITY + '/'))
));
const conditionProfile = require('./sharedConditionProfile');
const COUNTED_EXPIRY_POLICIES = Object.freeze(['target-start-count', 'target-end-count']);
const EFFECT_EXPIRY_POLICIES = Object.freeze(['gm-manual', 'target-next-start', 'target-next-end', ...COUNTED_EXPIRY_POLICIES]);
const CLASS_IDS = ['arcanoneer', 'berserker', 'shaper', 'harbinger', 'chronarch', 'inquisitor', 'revenant', 'false_prophet', 'gambit', 'apex', 'animist', 'lunarch', 'martyr', 'minstrel', 'plaguebringer', 'pyrofiend', 'spellguard', 'toxicologist', 'warden', 'augur', 'crusader', 'hunter'];
const FORMULA = /^([1-9][0-9]?)d([1-9][0-9]{0,2})(?:([+-])([1-9][0-9]{0,4}))?$/;
// Match the actual JSON transport: absent optional properties stay absent, never parse undefined.
const int = (v, max) => Number.isSafeInteger(v) && v >= 0 && v <= max;
const empty = v => v === undefined || v === null || (typeof v === 'object' && Object.keys(v).length === 0);
const refuse = path => { throw Error(`${path}: unsupported or conflicting mechanics; keep this ability manual.`); };
const only = (v, allowed, path) => { if (!v || typeof v !== 'object' || Array.isArray(v) || Object.keys(v).some(k => !allowed.includes(k))) refuse(path); };
function readFormula(formula) {
  const m = typeof formula === 'string' && FORMULA.exec(formula);
  if (!m || +m[1] > 50 || +m[2] < 2 || +m[2] > 100 || +(m[4] || 0) > 10000) refuse('effect.formula (use NdM, optionally +K or -K)');
  return { dice: [{ count: +m[1], sides: +m[2] }], constant: (m[3] === '-' ? -1 : 1) * +(m[4] || 0), reading: formula };
}
// A disabled sub-editor's retained settings are inert only behind its explicit false gate.
function disabled(config, path) {
  if (!empty(config) && config.enabled !== false) refuse(path);
}
const defaultTriggers = { global: { logicType: 'AND', compoundTriggers: [] }, effectTriggers: {}, conditionalEffects: {}, buffDebuffTriggers: {}, requiredConditions: { enabled: false, logicType: 'AND', conditions: [] }, triggerRole: { mode: 'CONDITIONAL' } };
const loadedDefaultTriggers = { global: { logicType: 'AND', compoundTriggers: [] }, effectTriggers: {}, conditionalEffects: {} };
const loadedDefaultMechanics = { cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } };
// The first, and only, approved Wizard-authored executable trigger: this ability is the named
// follow-up offered after its primary owner PC's committed immediate damage removes base HP.
const FOLLOWUP_TRIGGER = 'authored-followup-trigger:v1';
const FOLLOWUP_TRIGGER_ID = 'follow_up_after_damage';
// The second approved Wizard-authored executable trigger (creator approval H1-H3, 13 November 2026): this ability is the
// named follow-up offered after its primary owner PC's committed immediate healing actually restores HP to a creature or
// to another primary player character. A separate id, category and marker: the damage shape above is unchanged.
const FOLLOWUP_HEALING_TRIGGER = 'authored-followup-healing-trigger:v1';
const FOLLOWUP_HEALING_TRIGGER_ID = 'follow_up_after_healing';
const FOLLOWUP_MARKERS = Object.freeze([FOLLOWUP_TRIGGER, FOLLOWUP_HEALING_TRIGGER]);
const FOLLOWUP_SHAPES = Object.freeze([Object.freeze({ id: FOLLOWUP_TRIGGER_ID, category: 'combat', marker: FOLLOWUP_TRIGGER }),
  Object.freeze({ id: FOLLOWUP_HEALING_TRIGGER_ID, category: 'health', marker: FOLLOWUP_HEALING_TRIGGER })]);
const exactKeys = (value, names) => !!value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).sort().join('|') === names.slice().sort().join('|');
/** The marker of the one supported authored trigger shape this config is (damage or healing follow-up, global only);
 * null for the established inert defaults. Every other non-default trigger section is refused whole (never stripped
 * or partially compiled). Each id is accepted under exactly one category. */
function followUpTriggerFor(config) {
  if (empty(config)) { return null; }
  only(config, ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'], 'triggerConfig');
  // F1 compatibility: reuse the installed BASE inert-trigger predicate before the supported shape.
  // Every established no-trigger combination keeps its BASE admission behavior, including omitted
  // empty effect/conditional/buff containers and the default global/required/trigger-role set.
  // The catalogue-prepared partial load default is handled by the catalogue branch before this helper
  // and is intentionally not accepted here: BASE refused it on the ordinary path.
  if (canonical(config.global) === canonical({ logicType: 'AND', compoundTriggers: [] }) &&
      empty(config.effectTriggers) && empty(config.conditionalEffects) && empty(config.buffDebuffTriggers) &&
      canonical(config.requiredConditions) === canonical({ enabled: false, logicType: 'AND', conditions: [] }) &&
      canonical(config.triggerRole) === canonical({ mode: 'CONDITIONAL' })) { return null; }
  const triggers = config.global?.compoundTriggers;
  const trigger = Array.isArray(triggers) && triggers.length === 1 ? triggers[0] : null;
  const shape = trigger && typeof trigger === 'object' ? FOLLOWUP_SHAPES.find(item => item.id === trigger.id) : null;
  if (!exactKeys(config.global, ['logicType', 'compoundTriggers']) || config.global.logicType !== 'AND' || !trigger ||
      !exactKeys(trigger, ['id', 'category', 'name', 'parameters']) || !shape ||
      trigger.category !== shape.category || typeof trigger.name !== 'string' || !trigger.name.trim() || trigger.name.length > 120 ||
      !exactKeys(trigger.parameters, []) || !empty(config.effectTriggers) || !empty(config.conditionalEffects) ||
      !empty(config.buffDebuffTriggers) || !exactKeys(config.requiredConditions, ['enabled', 'logicType', 'conditions']) ||
      config.requiredConditions.enabled !== false || config.requiredConditions.logicType !== 'AND' || !Array.isArray(config.requiredConditions.conditions) ||
      config.requiredConditions.conditions.length !== 0 || !exactKeys(config.triggerRole, ['mode']) || config.triggerRole.mode !== 'CONDITIONAL') { refuse('triggers'); }
  return shape.marker;
}
/** Boolean form kept for existing callers: true when the config is one of the supported follow-up shapes. */
function followUpTrigger(config) { return followUpTriggerFor(config) !== null; }
/** Classifier for shared whole-spell passive single-trigger envelopes. Returns null when matchFn finds no target trigger. */
function singleWholeSpellPassiveTrigger(config, matchFn) {
  if (empty(config)) { return null; }
  const triggers = config.global && Array.isArray(config.global.compoundTriggers) ? config.global.compoundTriggers : null;
  if (!triggers || !triggers.some(matchFn)) { return null; }
  only(config, ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'], 'triggerConfig');
  if (!exactKeys(config.global, ['logicType', 'compoundTriggers']) || !['AND', 'OR'].includes(config.global.logicType) || triggers.length !== 1) {
    refuse('triggers');
  }
  const trigger = triggers[0];
  if (!exactKeys(trigger, ['id', 'category', 'name', 'parameters']) ||
      typeof trigger.name !== 'string' || !trigger.name.trim() || trigger.name.length > 120 ||
      !empty(config.effectTriggers) || !empty(config.conditionalEffects) || !empty(config.buffDebuffTriggers) ||
      (config.requiredConditions !== undefined && (!exactKeys(config.requiredConditions, ['enabled', 'logicType', 'conditions']) ||
        config.requiredConditions.enabled !== false || !Array.isArray(config.requiredConditions.conditions) || config.requiredConditions.conditions.length !== 0)) ||
      (config.triggerRole !== undefined && (!exactKeys(config.triggerRole, ['mode']) || config.triggerRole.mode !== 'CONDITIONAL'))) {
    refuse('triggers');
  }
  return trigger;
}
/** Classifier for whole-spell movement-entry passive (`moves_into_radius`). Returns null unless that trigger id is present. */
function passiveEntryTriggerFor(config) {
  const trigger = singleWholeSpellPassiveTrigger(config, function (t) { return Boolean(t && t.id === PASSIVE_ENTRY_TRIGGER_ID); });
  if (!trigger) { return null; }
  if (trigger.id !== PASSIVE_ENTRY_TRIGGER_ID || trigger.category !== 'movement' || !exactKeys(trigger.parameters, [])) {
    refuse('triggers');
  }
  return PASSIVE_ENTRY_TRIGGER;
}
/** Classifier for whole-spell turn-boundary passive (`turn_start` | `turn_end` with `whose_turn`). Returns null unless that trigger id is present. */
function passiveTurnTriggerFor(config) {
  const trigger = singleWholeSpellPassiveTrigger(config, function (t) { return Boolean(t && PASSIVE_TURN_TRIGGER_IDS.includes(t.id)); });
  if (!trigger) { return null; }
  if (!PASSIVE_TURN_TRIGGER_IDS.includes(trigger.id) || trigger.category !== 'time' ||
      !exactKeys(trigger.parameters, ['whose_turn']) || !PASSIVE_TURN_WHOSE_VALUES.includes(trigger.parameters.whose_turn)) {
    refuse('triggers');
  }
  return { kind: trigger.id, whoseTurn: trigger.parameters.whose_turn, contract: PASSIVE_TURN_TRIGGER };
}
// D1 = (a), creator approval 14 November 2026 (componentScopePolicy.js): exactly one
// "Follow-up After My Damage" card placed under Effect-Specific Triggers on ONE part, every other trigger section at its inert
// default. It watches that part's own committed result; it is never read as a whole-spell trigger. The policy decides whether
// it may compile at all; the definition branch decides which part it may sit on. Any other effect-attached shape refuses whole.
const componentScope = require('./componentScopePolicy');
const COMPONENT_WATCH = componentScope.CONTRACT;
const COMPONENT_WATCH_PARTS = Object.freeze({ damage_direct: Object.freeze({ componentId: 'effects:direct', kind: 'damage' }) });
// Family expansion (handoff/component-trigger-family-expansion): the same Wizard card, on the same Direct Damage part, maps to the
// definition's own structural key for each admitted single-target immediate-damage family. A bundle's direct part is 'effects:direct';
// a one-part immediate damage definition's only part is 'effect'. Placement is (wizardKey, definition shape) -> componentId; never a
// label or index. Anything this table does not name refuses whole.
const COMPONENT_WATCH_PLACEMENTS = Object.freeze([
  Object.freeze({ wizardKey: 'damage_direct', shape: 'bundle', componentId: 'effects:direct', kind: 'damage' }),
  Object.freeze({ wizardKey: 'damage_direct', shape: 'immediate', componentId: 'effect', kind: 'damage' })
]);
const componentWatchPlacement = (wizardKey, componentId) => COMPONENT_WATCH_PLACEMENTS.find(p => p.wizardKey === wizardKey && p.componentId === componentId) || null;
// Riders a watched Direct Damage part may sit next to (each already an executable A10 composition). Periodic ticks stay out: a bundle
// with periodic ticks has a second, later damage source, and no aggregation or precedence is defined.
const COMPONENT_WATCH_CONDITIONS = Object.freeze(['movement', 'stunned', 'attribute', 'damageReduction']);
function componentWatchShape(config) {
  if (empty(config) || !exactKeys(config, ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'])) { return null; }
  if (canonical(config.global) !== canonical({ logicType: 'AND', compoundTriggers: [] }) || !empty(config.conditionalEffects) || !empty(config.buffDebuffTriggers) ||
      canonical(config.requiredConditions) !== canonical({ enabled: false, logicType: 'AND', conditions: [] }) ||
      canonical(config.triggerRole) !== canonical({ mode: 'CONDITIONAL' })) { return null; }
  const parts = config.effectTriggers && typeof config.effectTriggers === 'object' && !Array.isArray(config.effectTriggers) ? Object.keys(config.effectTriggers) : [];
  if (parts.length !== 1) { return null; }
  const group = config.effectTriggers[parts[0]];
  if (!exactKeys(group, ['logicType', 'compoundTriggers', 'targetingOverride']) || group.logicType !== 'AND' || group.targetingOverride !== null ||
      !Array.isArray(group.compoundTriggers) || group.compoundTriggers.length !== 1) { return null; }
  const trigger = group.compoundTriggers[0];
  if (!exactKeys(trigger, ['id', 'category', 'name', 'parameters']) || trigger.id !== FOLLOWUP_TRIGGER_ID || trigger.category !== 'combat' ||
      typeof trigger.name !== 'string' || !trigger.name.trim() || trigger.name.length > 120 || !exactKeys(trigger.parameters, [])) { return null; }
  return { wizardKey: parts[0] };
}
const SELECTION_METHODS = Object.freeze(['manual', 'lowest_health']);
const CRIT_GATE_TRIGGER_ID = 'critical_hit';
const CRIT_GATE_SPEC = Object.freeze({ trigger: 'critical_hit', source: 'effects:direct', rule: 'max-die-face' });
function critGateShape(config) {
  if (empty(config) || !exactKeys(config, ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'])) { return null; }
  if (canonical(config.global) !== canonical({ logicType: 'AND', compoundTriggers: [] }) || !empty(config.conditionalEffects) || !empty(config.buffDebuffTriggers) ||
      canonical(config.requiredConditions) !== canonical({ enabled: false, logicType: 'AND', conditions: [] }) ||
      canonical(config.triggerRole) !== canonical({ mode: 'CONDITIONAL' })) { return null; }
  const parts = config.effectTriggers && typeof config.effectTriggers === 'object' && !Array.isArray(config.effectTriggers) ? Object.keys(config.effectTriggers) : [];
  if (parts.length !== 1 || parts[0] !== 'control') { return null; }
  const group = config.effectTriggers.control;
  if (!exactKeys(group, ['logicType', 'compoundTriggers', 'targetingOverride']) || group.logicType !== 'AND' || group.targetingOverride !== null ||
      !Array.isArray(group.compoundTriggers) || group.compoundTriggers.length !== 1) { return null; }
  const trigger = group.compoundTriggers[0];
  if (!exactKeys(trigger, ['id', 'category', 'name', 'parameters']) || trigger.id !== CRIT_GATE_TRIGGER_ID || trigger.category !== 'combat' ||
      typeof trigger.name !== 'string' || !trigger.name.trim() || trigger.name.length > 120 ||
      !trigger.parameters || typeof trigger.parameters !== 'object' || Array.isArray(trigger.parameters)) { return null; }
  const paramOk = exactKeys(trigger.parameters, []) || (exactKeys(trigger.parameters, ['perspective']) && trigger.parameters.perspective === 'self');
  if (!paramOk) { return null; }
  return { wizardKey: 'control', triggerId: CRIT_GATE_TRIGGER_ID };
}
/** Pure filter + base-HP ranking for selectionMethod === 'lowest_health'.
 * Visibility, creature kind, relationship and planar range apply BEFORE ranking by current base HP. */
function evaluateLowestHealthCandidates(params) {
  if (!params || typeof params !== 'object') {
    return { ok: false, code: 'manual_targeting_geometry_required', eligible: [], lowest: [], minHp: null, tied: false };
  }
  const sourcePos = params.sourcePos;
  const rangeFeet = params.rangeFeet;
  const restriction = params.restriction;
  const gridSize = params.gridSize;
  const feetPerTile = params.feetPerTile;
  const candidates = Array.isArray(params.candidates) ? params.candidates : [];
  if (!sourcePos || !Number.isFinite(sourcePos.x) || !Number.isFinite(sourcePos.y) ||
      !Number.isFinite(rangeFeet) || rangeFeet <= 0 ||
      !Number.isFinite(gridSize) || gridSize <= 0 ||
      !Number.isFinite(feetPerTile) || feetPerTile <= 0) {
    return { ok: false, code: 'manual_targeting_geometry_required', eligible: [], lowest: [], minHp: null, tied: false };
  }
  const eligible = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const c = candidates[i];
    if (!c || c.hidden === true || c.kind !== 'creature') continue;
    if (!c.position || !Number.isFinite(c.position.x) || !Number.isFinite(c.position.y)) continue;
    if (!Number.isSafeInteger(c.currentHp) || c.currentHp < 0) continue;
    if ((restriction === 'enemy' || restriction === 'ally') && c.relationship !== restriction) continue;
    const distFeet = (Math.hypot(c.position.x - sourcePos.x, c.position.y - sourcePos.y) / gridSize) * feetPerTile;
    if (distFeet > rangeFeet + 1e-6) continue;
    eligible.push(Object.assign({}, c, { distanceFeet: distFeet }));
  }
  if (!eligible.length) {
    return { ok: false, code: 'no_eligible_target_in_range', eligible: [], lowest: [], minHp: null, tied: false };
  }
  const minHp = eligible.reduce(function (m, c) { return Math.min(m, c.currentHp); }, Infinity);
  const lowest = eligible.filter(function (c) { return c.currentHp === minHp; });
  return { ok: true, eligible: eligible, lowest: lowest, minHp: minHp, tied: lowest.length > 1 };
}
function readAuthoredConditionEffect(c, d, restrictions, direct, { allowPeriodic = true, allowSave = true, manualOnlyLabel = 'Passive movement-entry' } = {}) {
  only(c, ['profile', 'effect', 'movementFeet', 'attribute', 'attributeAmount', 'drAmount', 'label', 'expiryPolicy', 'durationText', 'gmNote', 'occurrences', 'periodicKind', 'periodicFormula', 'periodicDamageType', 'tickRoll', 'save'], 'authoredEffect');
  if (c.effect !== 'periodic' && ['periodicKind', 'periodicFormula', 'periodicDamageType', 'tickRoll'].some(k => c[k] !== undefined)) refuse('Periodic tick fields belong to a periodic effect only');
  if (c.effect !== 'damageReduction' && c.drAmount !== undefined) refuse('A flat DR amount belongs to a flat damage-reduction effect only');
  if (allowPeriodic ? !EFFECT_EXPIRY_POLICIES.includes(c.expiryPolicy) : c.expiryPolicy !== 'gm-manual') {
    refuse(allowPeriodic ? 'Expiry: manual removal, start or end of the target\'s next turn, or a counted start/end of the target\'s upcoming turns' : `${manualOnlyLabel} effects require manual expiry (gm-manual)`);
  }
  if (COUNTED_EXPIRY_POLICIES.includes(c.expiryPolicy) ? !conditionProfile.validOccurrences(c.occurrences) : c.occurrences !== undefined)
    refuse(`Occurrences: counted expiry needs a whole number of target-turn boundaries from 2 to ${conditionProfile.MAX_OCCURRENCES}; other expiry policies carry no count`);
  if (typeof c.durationText !== 'string' || !c.durationText.trim() || c.durationText.length > 300 || typeof c.gmNote !== 'string' || !c.gmNote.trim() || c.gmNote.length > 1000) refuse('Authored duration and GM note required');
  let conditionEffect;
  if (c.effect === 'stunned') {
    if (c.movementFeet !== undefined || c.label !== undefined || c.attribute !== undefined || c.attributeAmount !== undefined) refuse('Stunned has no movement or attribute amount or custom label');
    conditionEffect = { kind: 'stunned' };
  } else if (c.effect === 'movement') {
    if (!Number.isSafeInteger(c.movementFeet) || c.movementFeet === 0 || c.movementFeet < -60 || c.movementFeet > 60 || c.movementFeet % 5 !== 0) refuse('Movement change must be a nonzero multiple of 5 ft from −60 to +60');
    if (typeof c.label !== 'string' || !c.label.trim() || c.label !== c.label.trim() || c.label.length > 60) refuse('Movement effect label (1–60 characters, no outer spaces) required');
    if (c.attribute !== undefined || c.attributeAmount !== undefined) refuse('A movement change carries no attribute amount');
    conditionEffect = { kind: 'movement', feet: c.movementFeet, label: c.label };
  } else if (c.effect === 'attribute') {
    if (c.movementFeet !== undefined) refuse('An attribute change carries no movement amount');
    if (!conditionProfile.supportedAttribute(c.attribute)) refuse(`Attribute change: supported attribute (${conditionProfile.ATTRIBUTE.attributes.join(', ')}) required`);
    if (!conditionProfile.validAttributeAmount(c.attributeAmount)) refuse(`Attribute change must be a nonzero whole number from ${conditionProfile.ATTRIBUTE.minAmount} to +${conditionProfile.ATTRIBUTE.maxAmount}`);
    if (typeof c.label !== 'string' || !c.label.trim() || c.label !== c.label.trim() || c.label.length > 60) refuse('Attribute effect label (1-60 characters, no outer spaces) required');
    conditionEffect = { kind: 'attribute', attribute: c.attribute, amount: c.attributeAmount, label: c.label };
  } else if (c.effect === 'damageReduction') {
    if (c.movementFeet !== undefined || c.attribute !== undefined || c.attributeAmount !== undefined) refuse('A flat damage-reduction effect carries no movement or attribute amount');
    if (!conditionProfile.validDamageReductionAmount(c.drAmount)) refuse(`Flat damage reduction must be a positive whole number from +${conditionProfile.DAMAGE_REDUCTION.minAmount} to +${conditionProfile.DAMAGE_REDUCTION.maxAmount}`);
    if (!conditionProfile.validModifierLabel(c.label)) refuse('Flat damage-reduction effect label (1-60 characters, no outer spaces) required');
    conditionEffect = { kind: 'damageReduction', amount: c.drAmount, label: c.label };
  } else if (c.effect === 'periodic') {
    if (!allowPeriodic) refuse(`Periodic ticks are not supported on ${manualOnlyLabel.toLowerCase()} triggers`);
    if (c.movementFeet !== undefined || c.attribute !== undefined || c.attributeAmount !== undefined) refuse('A periodic effect carries no movement or attribute amount');
    if (c.expiryPolicy === 'gm-manual') refuse('Periodic ticks need an explicit target-turn boundary and tick count (start or end of the target\'s turns)');
    if (!['damage', 'healing'].includes(c.periodicKind)) refuse('Periodic effect: choose damage or healing per tick');
    if (direct && direct !== c.periodicKind) refuse('Immediate and periodic parts: both damage or both healing (an immediate part of the other kind is not supported)');
    readFormula(c.periodicFormula);
    let tick;
    if (c.periodicKind === 'damage') {
      if (!conditionProfile.PERIODIC.damageTypes.includes(c.periodicDamageType)) refuse('Periodic damage type required');
      if (d.typeConfig.school && d.typeConfig.school !== c.periodicDamageType) refuse('school / periodic damage type conflict');
      tick = { kind: 'damage', formula: c.periodicFormula, damageTypes: [c.periodicDamageType] };
    } else {
      if (c.periodicDamageType !== undefined) refuse('Periodic healing has no damage type');
      tick = { kind: 'healing', formula: c.periodicFormula };
    }
    if (c.tickRoll !== 'each-tick') refuse('Tick roll: choose "roll when each tick is resolved" (rolling once at cast is not supported)');
    if (typeof c.label !== 'string' || !c.label.trim() || c.label !== c.label.trim() || c.label.length > 60) refuse('Periodic effect label (1–60 characters, no outer spaces) required');
    if (!['enemy', 'ally', 'any'].includes(restrictions[0])) refuse('Periodic effects target one other creature');
    conditionEffect = { kind: 'periodic', tick, label: c.label, tickRoll: 'each-tick' };
  } else refuse('Effect: canonical Stunned, one movement-speed change, one attribute change, one flat damage-reduction change or one periodic damage/healing tick');
  let save;
  if (c.save !== undefined) {
    if (!allowSave) refuse(`Saving throws on ${manualOnlyLabel.toLowerCase()} triggers remain manual`);
    only(c.save, ['ability', 'dc', 'outcome'], 'authoredEffect.save');
    save = { scope: 'condition', ability: c.save.ability, dc: c.save.dc, outcome: c.save.outcome };
    if (c.save.outcome !== 'negates') refuse(`Save outcome "${c.save.outcome}" (only "negates this effect" is supported; halves/partial outcomes await a creator decision)`);
    if (!saveBranch.validSave(save, ['condition'])) refuse(`Save: choose the saving ability and a whole-number DC from ${saveBranch.MIN_DC} to ${saveBranch.MAX_DC}`);
    if (!direct) refuse('A save that negates the effect currently needs a direct damage or healing part that applies on both outcomes (a rider-only save stays manual)');
    if (c.effect === 'periodic') refuse('A save on a periodic effect stays manual (initial and repeated tick saves are not automated)');
    if (c.effect === 'damageReduction') refuse('A save on a positive flat damage-reduction effect stays manual (saving throws are for hostile effects)');
  }
  return { conditionEffect, save };
}
function validatePassiveCommon(d, record, { creatureSource, familyLabel, errorLabel }) {
  if (creatureSource) refuse(`${familyLabel} abilities require a primary owner PC source`);
  if (typeof d.name !== 'string' || !d.name.trim() || d.name.length > 120 || typeof d.description !== 'string' || d.description.length > 4000) refuse('Spell name and description required');
  only(d.typeConfig || {}, ['school', 'secondaryElement', 'icon', 'tags', 'toggleable', 'castTime', 'castTimeType', 'element'], 'typeConfig');
  if (d.typeConfig?.secondaryElement) refuse('secondaryElement');
  if (d.typeConfig?.castTime !== undefined && d.typeConfig.castTime !== 0) refuse('conflicting cast time');
  const effect = d.controlConfig?.authoredCondition?.profile === EFFECT_CAPABILITY;
  if (!effect || canonical(d.effectTypes) !== '["control"]') refuse(`${errorLabel} triggers support one composed Control effect (authored-effect:v1)`);
  if (!empty(d.effectsMap) && (Object.entries(d.effectsMap).some(([k, v]) => typeof v !== 'boolean' || v !== (k === 'control')) || d.effectsMap.control !== true)) refuse('effectsMap');
  for (const key of ['damageConfig', 'healingConfig', 'buffConfig', 'debuffConfig', 'utilityConfig', 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', 'rollableTable', 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'effectTargeting', 'targetingTags', 'persistentConfig', 'prophecyOptions', 'trapConfig', 'channelingConfig', 'statusEffectsConfig']) if (!empty(d[key])) refuse(key);
  if (!empty(d.propagation)) {
    only(d.propagation, ['method', 'behavior', 'parameters'], 'propagation');
    if (d.propagation.method !== 'none' || d.propagation.behavior !== '') refuse('propagation');
    only(d.propagation.parameters, ['count', 'range', 'decay', 'secondaryRadius', 'spreadRate', 'forkCount'], 'inactive propagation parameters');
    if (Object.values(d.propagation.parameters).some(v => !int(v, 10000))) refuse('inactive propagation parameters');
  }
  if (d.targetingMode !== undefined && d.targetingMode !== 'unified') refuse('targetingMode');
  if (canonical(record.durationConfig ?? null) !== canonical(d.durationConfig ?? null)) refuse('library/draft durationConfig');
  if (!empty(d.durationConfig) && canonical(d.durationConfig) !== '{"durationType":"instant"}') refuse('durationConfig (the explicit expiry policy is the only executed duration)');
  if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== '{"control":"MANUAL"}') refuse('effect resolution');
  const mech = d.mechanicsConfig;
  const defaultMech = { cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } };
  if (!empty(mech) && canonical(mech) !== canonical(defaultMech)) refuse('mechanicsConfig');
  const cd = d.cooldownConfig;
  if (!empty(cd)) {
    only(cd, ['cooldownType', 'cooldownValue'], 'cooldownConfig');
    if (cd.cooldownType !== 'none' || (cd.cooldownValue !== undefined && cd.cooldownValue !== 0)) refuse(`cooldownConfig: ${errorLabel.toLowerCase()} abilities require No Cooldown`);
  }
  const cost = d.resourceCost || {};
  only(cost, ['actionPoints', 'actionPointsSelected', 'mana', 'components', 'materialComponents', 'resourceTypes', 'resourceValues', 'resourceFormulas', 'useFormulas', 'primaryResourceType'], 'resourceCost');
  if (cost.useFormulas !== undefined) only(cost.useFormulas, ['mana', 'actionPoints'], 'resourceCost.useFormulas');
  if (cost.resourceValues !== undefined) only(cost.resourceValues, ['mana', 'actionPoints'], 'resourceCost.resourceValues');
  const ap = cost.actionPoints === undefined ? 0 : cost.actionPoints;
  const rvAp = cost.resourceValues && cost.resourceValues.actionPoints !== undefined ? cost.resourceValues.actionPoints : 0;
  const mana = cost.mana === undefined || cost.mana === '' ? 0 : cost.mana;
  const rvMana = cost.resourceValues && cost.resourceValues.mana !== undefined && cost.resourceValues.mana !== '' ? cost.resourceValues.mana : 0;
  if (ap !== 0 || rvAp !== 0 || mana !== 0 || rvMana !== 0 || !empty(cost.components) || (cost.materialComponents !== undefined && cost.materialComponents !== '') || !empty(cost.resourceFormulas) || Object.values(cost.useFormulas || {}).some(v => v !== false)) refuse(`${errorLabel} abilities cannot charge cast AP, mana, components or formulas`);
  if ((cost.resourceTypes || []).some(rt => !['mana', 'actionPoints'].includes(rt)) || Object.keys(cost.resourceValues || {}).some(k => !['mana', 'actionPoints'].includes(k)) || (cost.primaryResourceType !== undefined && cost.primaryResourceType !== null && !['mana', 'actionPoints'].includes(cost.primaryResourceType))) refuse('resource types');
  const t = d.targetingConfig || {};
  only(t, ['targetingType', 'rangeType', 'rangeDistance', 'maxTargets', 'targetRestrictions', 'targetRestriction', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior', 'aoeShape', 'aoeType', 'aoeParameters'], 'targetingConfig');
  return t;
}
function assertOuterPassiveTargetingParity(t, outer) {
  only(outer, Object.keys(t).concat(['aoeType', 'aoeShape', 'aoeParameters', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior']), 'outer targeting');
  for (const k of Object.keys(t)) if (canonical(outer[k]) !== canonical(t[k]) && !(['aoeShape', 'aoeType'].includes(k) && t[k] === '')) refuse(`library/draft targeting.${k}`);
  for (const k of ['selectionMethod', 'targetSelectionMethod']) if ((t[k] !== undefined && t[k] !== 'manual') || (outer[k] !== undefined && outer[k] !== 'manual')) refuse(k);
}
function passiveEntryFromWizard(d, record, { roomId, definitionVersion, classId, creatureSource } = {}) {
  const t = validatePassiveCommon(d, record, {
    creatureSource,
    familyLabel: 'Authored passive movement-entry',
    errorLabel: 'Passive movement-entry'
  });
  if (t.targetingType !== 'self_centered' || t.aoeShape !== 'circle') refuse('targetingConfig (self_centered circle radius required for passive movement-entry)');
  if (t.aoeType !== undefined && !['', 'circle', 'sphere'].includes(t.aoeType)) refuse('aoeType (circle required)');
  only(t.aoeParameters, ['radius', 'size', 'range', 'angle', 'length', 'width', 'height'], 'aoeParameters');
  if (!int(t.aoeParameters.radius, 60) || t.aoeParameters.radius < 5 || t.aoeParameters.radius % 5 !== 0) refuse('aoeParameters.radius (5..60 ft multiple of 5 required)');
  for (const [k, v] of Object.entries(t.aoeParameters)) if (k !== 'radius' && !int(v, 10000)) refuse(`aoeParameters.${k}`);
  if (t.rangeType !== undefined && !['self_centered', 'self'].includes(t.rangeType)) refuse('rangeType (self_centered required)');
  if (t.rangeDistance !== undefined && t.rangeDistance !== 0) refuse('rangeDistance (0 required for self_centered)');
  if (t.maxTargets !== undefined && t.maxTargets !== 1) refuse('maxTargets');
  if (t.movementBehavior !== undefined && t.movementBehavior !== 'static') refuse('movementBehavior');
  assertOuterPassiveTargetingParity(t, record.targetingConfig);
  const restrictions = t.targetRestrictions;
  if (!Array.isArray(restrictions) || restrictions.length !== 1 || !['enemy', 'ally', 'any'].includes(restrictions[0]) || (t.targetRestriction && t.targetRestriction !== restrictions[0])) refuse('targetRestrictions (choose Enemy, Ally, or Any)');
  only(d.controlConfig, ['authoredCondition'], 'controlConfig (use the explicit authored effect profile)');
  const c = d.controlConfig.authoredCondition;
  const parsed = readAuthoredConditionEffect(c, d, restrictions, null, { allowPeriodic: false, allowSave: false });
  return {
    ok: true,
    definition: {
      schemaVersion: 9,
      capability: PASSIVE_ENTRY_CAPABILITY,
      scope: { roomId },
      definitionId: record.authoredDefinitionId,
      definitionVersion,
      name: d.name,
      description: d.description,
      binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
      spellType: 'PASSIVE',
      targeting: { kind: 'self_centered_radius', aoeShape: 'circle', radiusFeet: t.aoeParameters.radius, restriction: restrictions[0] },
      trigger: { kind: PASSIVE_ENTRY_TRIGGER_ID, contract: PASSIVE_ENTRY_TRIGGER },
      effects: { direct: null, condition: parsed.conditionEffect },
      timing: { expiryPolicy: c.expiryPolicy, durationText: c.durationText, authoredDuration: d.durationConfig ?? null, gmNote: c.gmNote }
    }
  };
}
function passiveTurnFromWizard(d, record, { roomId, definitionVersion, classId, creatureSource } = {}) {
  const turnTrigger = passiveTurnTriggerFor(d.triggerConfig);
  if (!turnTrigger) refuse('triggers');
  const t = validatePassiveCommon(d, record, {
    creatureSource,
    familyLabel: 'Authored passive turn-boundary',
    errorLabel: 'Passive turn-boundary'
  });
  if (!['self', 'single'].includes(t.targetingType)) refuse('targetingConfig (self targeting required for passive turn-boundary abilities)');
  if (t.rangeType !== undefined && t.rangeType !== 'self') refuse('rangeType (self required for passive turn-boundary abilities)');
  if (t.rangeDistance !== undefined && t.rangeDistance !== 0) refuse('rangeDistance (0 required for self targeting)');
  if (t.maxTargets !== undefined && t.maxTargets !== 1) refuse('maxTargets');
  assertOuterPassiveTargetingParity(t, record.targetingConfig);
  for (const cfg of [t, record.targetingConfig]) {
    if (!empty(cfg.aoeParameters) || (cfg.movementBehavior !== undefined && cfg.movementBehavior !== 'static') || (cfg.aoeShape !== undefined && !['', 'circle'].includes(cfg.aoeShape)) || (cfg.aoeType !== undefined && !['', 'sphere', 'circle'].includes(cfg.aoeType))) refuse('inactive area / movement configuration');
  }
  const restrictions = t.targetRestrictions;
  if (!Array.isArray(restrictions) || restrictions.length !== 1 || restrictions[0] !== 'self' || (t.targetRestriction && t.targetRestriction !== 'self')) refuse('targetRestrictions (choose Self for passive turn-boundary abilities)');
  only(d.controlConfig, ['authoredCondition'], 'controlConfig (use the explicit authored effect profile)');
  const c = d.controlConfig.authoredCondition;
  const parsed = readAuthoredConditionEffect(c, d, restrictions, null, { allowPeriodic: false, allowSave: false, manualOnlyLabel: 'Passive turn-boundary' });
  return {
    ok: true,
    definition: {
      schemaVersion: 11,
      capability: PASSIVE_TURN_CAPABILITY,
      scope: { roomId },
      definitionId: record.authoredDefinitionId,
      definitionVersion,
      name: d.name,
      description: d.description,
      binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
      spellType: 'PASSIVE',
      targeting: { kind: 'self', restriction: 'self' },
      trigger: { kind: turnTrigger.kind, whoseTurn: turnTrigger.whoseTurn, contract: PASSIVE_TURN_TRIGGER },
      effects: { direct: null, condition: parsed.conditionEffect },
      timing: { expiryPolicy: c.expiryPolicy, durationText: c.durationText, authoredDuration: d.durationConfig ?? null, gmNote: c.gmNote }
    }
  };
}
function channeledFromWizard(d, record, { roomId, definitionVersion, classId } = {}) {
  if (typeof d.name !== 'string' || !d.name.trim() || d.name.length > 120 || (d.description !== undefined && (typeof d.description !== 'string' || d.description.length > 4000))) {
    refuse('Spell name and description required');
  }
  const tc = d.typeConfig || {};
  only(tc, ['school', 'secondaryElement', 'icon', 'tags', 'element', 'maxChannelDuration', 'durationUnit', 'tickFrequency', 'concentrationDC', 'dcType', 'castTime', 'castTimeType', 'breakEffect', 'movementAllowed', 'interruptible'], 'typeConfig');
  if (tc.secondaryElement) refuse('secondaryElement');
  if (tc.castTime !== undefined && tc.castTime !== 0) refuse('conflicting cast time');
  if (tc.castTimeType !== undefined && !['', 'IMMEDIATE', 'CHANNELED'].includes(tc.castTimeType)) refuse('castTimeType');
  if (tc.durationUnit !== undefined && tc.durationUnit !== 'TURNS') refuse('durationUnit (only TURNS is supported; ROUNDS/MINUTES await a creator decision)');
  const maxChannelDuration = tc.maxChannelDuration;
  if (!Number.isSafeInteger(maxChannelDuration) || maxChannelDuration < 1 || maxChannelDuration > 10) {
    refuse('typeConfig.maxChannelDuration (whole number 1..10 turns required)');
  }
  if (!['START_OF_TURN', 'END_OF_TURN'].includes(tc.tickFrequency)) refuse('typeConfig.tickFrequency (START_OF_TURN or END_OF_TURN required)');
  if (tc.interruptible === false) refuse('typeConfig.interruptible (uninterruptible channels await a creator decision)');
  if (tc.movementAllowed === true) refuse('typeConfig.movementAllowed (moving while channeling awaits a creator decision)');
  if (tc.breakEffect !== undefined && tc.breakEffect !== '' && tc.breakEffect !== 'none') refuse('typeConfig.breakEffect (non-none break effects await a creator decision)');

  const cc = d.channelingConfig;
  const normEmpty = v => (v === undefined || v === null || v === '' ? undefined : v);
  if (!empty(cc)) {
    only(cc, ['type', 'maxDuration', 'durationUnit', 'tickFrequency', 'concentrationDC', 'dcType', 'interruptible', 'movementAllowed', 'breakEffect', 'costValue', 'costType', 'costTrigger', 'resourceCost', 'perRoundFormulas', 'requiresConcentration', 'triggerCondition', 'targetScope', 'scalingType', 'formula', 'description', 'range', 'areaSize'], 'channelingConfig');
    if (cc.interruptible === false) refuse('channelingConfig.interruptible (uninterruptible channels await a creator decision)');
    if (cc.movementAllowed === true) refuse('channelingConfig.movementAllowed (moving while channeling awaits a creator decision)');
    if (cc.breakEffect !== undefined && cc.breakEffect !== '' && cc.breakEffect !== 'none') refuse('channelingConfig.breakEffect (non-none break effects await a creator decision)');
    if (cc.costTrigger !== undefined && cc.costTrigger !== '' && cc.costTrigger !== 'none') refuse('channelingConfig.costTrigger (per-tick sustain cost awaits a creator decision)');
    if (cc.costValue !== undefined && cc.costValue !== 0 && cc.costValue !== '') refuse('channelingConfig.costValue (per-tick sustain cost awaits a creator decision)');
    if (!empty(cc.resourceCost) && Object.values(cc.resourceCost).some(v => v !== undefined && v !== null && v !== '' && v !== 0 && v !== false)) {
      refuse('channelingConfig.resourceCost (per-tick sustain cost awaits a creator decision)');
    }
    if (!empty(cc.perRoundFormulas) && Object.values(cc.perRoundFormulas).some(v => v !== undefined && v !== null && v !== '')) {
      refuse('channelingConfig.perRoundFormulas (per-turn scaling awaits a creator decision)');
    }
    if (cc.type !== undefined && cc.type !== '' && !['channeled', 'sustained', 'drain'].includes(cc.type)) {
      refuse('channelingConfig.type (power_up/persistent/area_expand channeling types await a creator decision)');
    }
    if (cc.durationUnit !== undefined && cc.durationUnit !== '' && !['TURNS', 'turns'].includes(cc.durationUnit)) {
      refuse('channelingConfig.durationUnit (only TURNS is supported)');
    }
    if (normEmpty(cc.maxDuration) !== undefined && cc.maxDuration !== maxChannelDuration) {
      refuse('channelingConfig.maxDuration conflicts with typeConfig.maxChannelDuration');
    }
    if (normEmpty(cc.tickFrequency) !== undefined && cc.tickFrequency !== tc.tickFrequency) {
      refuse('channelingConfig.tickFrequency conflicts with typeConfig.tickFrequency');
    }
    if (cc.scalingType !== undefined && cc.scalingType !== '' && cc.scalingType !== 'none') {
      refuse('channelingConfig.scalingType (channeled scaling awaits a creator decision)');
    }
    if (normEmpty(cc.formula) !== undefined) refuse('channelingConfig.formula (use Damage/Healing effect formula)');
  }

  const tcConc = normEmpty(tc.concentrationDC);
  const ccConc = cc ? normEmpty(cc.concentrationDC) : undefined;
  if (tcConc !== undefined && ccConc !== undefined && tcConc !== ccConc) refuse('concentrationDC conflict between typeConfig and channelingConfig');
  const tcDcType = normEmpty(tc.dcType);
  const ccDcType = cc ? normEmpty(cc.dcType) : undefined;
  if (tcDcType !== undefined && ccDcType !== undefined && tcDcType !== ccDcType) refuse('dcType conflict between typeConfig and channelingConfig');
  const concDC = tcConc !== undefined ? tcConc : ccConc;
  const dcType = tcDcType !== undefined ? tcDcType : ccDcType;
  if ((concDC === undefined) !== (dcType === undefined)) refuse('concentrationDC and dcType must both be specified together or both omitted');
  if (concDC !== undefined) {
    if (!Number.isSafeInteger(concDC) || concDC < 5 || concDC > 20 || !authoredChanneled.DC_ATTRIBUTES.includes(dcType)) {
      refuse('concentrationDC (integer 5..20) and supported dcType required');
    }
    if (cc && cc.requiresConcentration === false) refuse('channelingConfig.requiresConcentration conflicts with concentrationDC');
  }

  const kind = canonical(d.effectTypes) === '["damage"]' ? 'damage' : canonical(d.effectTypes) === '["healing"]' ? 'healing' : null;
  if (!kind) refuse('Channeled spells support one single-target damage or healing effect');
  if (!empty(d.effectsMap) && (Object.entries(d.effectsMap).some(([k, v]) => typeof v !== 'boolean' || v !== (k === kind)) || d.effectsMap[kind] !== true)) refuse('effectsMap');
  const disallowedConfigs = [kind === 'damage' ? 'healingConfig' : 'damageConfig', 'buffConfig', 'debuffConfig', 'utilityConfig', 'controlConfig', 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', 'rollableTable', 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'effectTargeting', 'targetingTags', 'persistentConfig', 'prophecyOptions', 'trapConfig', 'statusEffectsConfig'];
  for (const key of disallowedConfigs) if (!empty(d[key])) refuse(key);
  disabled(d.rollableTable, 'rollableTable');
  if (!empty(d.propagation)) {
    only(d.propagation, ['method', 'behavior', 'parameters'], 'propagation');
    if (d.propagation.method !== 'none' || d.propagation.behavior !== '') refuse('propagation');
    only(d.propagation.parameters, ['count', 'range', 'decay', 'secondaryRadius', 'spreadRate', 'forkCount'], 'inactive propagation parameters');
    if (Object.values(d.propagation.parameters).some(v => !int(v, 10000))) refuse('inactive propagation parameters');
  }
  if (d.targetingMode !== undefined && d.targetingMode !== 'unified') refuse('targetingMode');
  if (!empty(d.durationConfig) && canonical(d.durationConfig) !== '{"durationType":"instant"}') refuse('durationConfig');
  if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== canonical({ [kind]: 'DICE' })) refuse('effectResolutions');
  const mech = d.mechanicsConfig;
  const defaultMech = { cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } };
  if (!empty(mech) && canonical(mech) !== canonical(defaultMech)) refuse('mechanicsConfig');
  if (followUpTriggerFor(d.triggerConfig) || componentWatchShape(d.triggerConfig) || critGateShape(d.triggerConfig) || passiveEntryTriggerFor(d.triggerConfig)) refuse('triggerConfig');
  const cd = d.cooldownConfig;
  if (!empty(cd)) {
    only(cd, ['cooldownType', 'cooldownValue'], 'cooldownConfig');
    if (cd.cooldownType !== 'none' || (cd.cooldownValue !== undefined && cd.cooldownValue !== 0)) refuse('cooldownConfig');
  }

  const cost = d.resourceCost;
  only(cost, ['actionPoints', 'actionPointsSelected', 'mana', 'components', 'materialComponents', 'resourceTypes', 'resourceValues', 'resourceFormulas', 'useFormulas', 'primaryResourceType'], 'resourceCost');
  if (cost.useFormulas !== undefined) only(cost.useFormulas, ['mana', 'actionPoints'], 'resourceCost.useFormulas');
  if (cost.resourceValues !== undefined) only(cost.resourceValues, ['mana', 'actionPoints'], 'resourceCost.resourceValues');
  if (!int(cost.actionPoints, 20) || !empty(cost.components) || (cost.materialComponents !== undefined && cost.materialComponents !== '') || !empty(cost.resourceFormulas) || Object.values(cost.useFormulas || {}).some(v => v !== false)) refuse('Explicit AP price / components / formulas');
  if ((cost.resourceTypes || []).some(rt => !['mana', 'actionPoints'].includes(rt)) || Object.keys(cost.resourceValues || {}).some(k => !['mana', 'actionPoints'].includes(k)) || (cost.primaryResourceType !== undefined && !['mana', 'actionPoints'].includes(cost.primaryResourceType))) refuse('resource types');
  if (cost.resourceValues?.actionPoints !== undefined && cost.resourceValues.actionPoints !== cost.actionPoints) refuse('conflicting AP encodings');
  const manaValues = [cost.mana, cost.resourceValues?.mana].filter(v => v !== undefined && v !== '');
  if (!manaValues.length || manaValues.some(v => !int(v, 10000)) || new Set(manaValues).size !== 1) refuse('Explicit mana price');

  const t = d.targetingConfig;
  only(t, ['targetingType', 'rangeType', 'rangeDistance', 'maxTargets', 'targetRestrictions', 'targetRestriction', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior', 'aoeShape', 'aoeType', 'aoeParameters'], 'targetingConfig');
  if (t.targetingType !== 'single' || t.maxTargets !== 1 || !int(t.rangeDistance, 300) || t.rangeDistance < 1 || !['ranged', 'melee', 'touch'].includes(t.rangeType) || !empty(t.aoeParameters) || (t.movementBehavior && t.movementBehavior !== 'static')) {
    refuse('single distinct target / explicit 1..300 ft range / count required');
  }
  if (record.targetingConfig?.rangeDistance !== t.rangeDistance || record.targetingConfig?.maxTargets !== t.maxTargets) refuse('library/draft targeting');
  only(record.targetingConfig, Object.keys(t).concat(['aoeType', 'aoeShape', 'aoeParameters', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior']), 'outer targeting');
  for (const config of [t, record.targetingConfig]) {
    if (!empty(config.aoeParameters) || (config.movementBehavior !== undefined && config.movementBehavior !== 'static') || (config.aoeShape !== undefined && !['', 'circle'].includes(config.aoeShape)) || (config.aoeType !== undefined && !['', 'sphere', 'circle'].includes(config.aoeType))) refuse('inactive area / movement configuration');
  }
  for (const k of Object.keys(t)) if (canonical(record.targetingConfig[k]) !== canonical(t[k]) && !(['aoeShape', 'aoeType'].includes(k) && t[k] === '')) refuse(`library/draft targeting.${k}`);
  for (const k of ['selectionMethod', 'targetSelectionMethod']) {
    if ((t[k] !== undefined && t[k] !== 'manual') || (record.targetingConfig[k] !== undefined && record.targetingConfig[k] !== 'manual')) refuse(k);
  }
  const restrictions = t.targetRestrictions;
  if (!Array.isArray(restrictions) || restrictions.length !== 1 || !['ally', 'enemy', 'any'].includes(restrictions[0]) || (t.targetRestriction && t.targetRestriction !== restrictions[0])) refuse('targetRestrictions');

  const directEffect = readDirect(d, record, kind, false, false, false, false, false);
  if (kind === 'damage' && (!Array.isArray(directEffect.damageTypes) || directEffect.damageTypes.length !== 1 || !conditionProfile.PERIODIC.damageTypes.includes(directEffect.damageTypes[0]))) {
    refuse('Channeled damage requires one supported elemental/physical damage type');
  }

  const timingKey = authoredChanneled.timingKeyFor(tc.tickFrequency, maxChannelDuration);
  const occurrences = maxChannelDuration >= 2 ? maxChannelDuration : undefined;
  const channel = Object.assign({
    maxChannelDuration,
    durationUnit: 'TURNS',
    tickFrequency: tc.tickFrequency,
    timing: timingKey,
    rangeFeet: t.rangeDistance,
    interruptible: true,
    movementAllowed: false,
    breakEffect: 'none'
  }, occurrences !== undefined ? { occurrences } : {}, concDC !== undefined ? { concentrationDC: concDC, dcType } : {});
  const timing = Object.assign({
    expiryPolicy: timingKey,
    durationText: authoredChanneled.authoredDurationText(channel),
    gmNote: 'GM resolves each due tick with its roll and records manual interruption if concentration breaks.'
  }, occurrences !== undefined ? { occurrences } : {});

  return {
    ok: true,
    definition: {
      schemaVersion: 10,
      capability: CHANNELED_CAPABILITY,
      scope: { roomId },
      definitionId: record.authoredDefinitionId,
      definitionVersion,
      name: d.name,
      description: d.description || '',
      binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
      spellType: 'CHANNELED',
      targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] },
      resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
      tickEffect: kind === 'damage' ? { kind, formula: directEffect.formula, damageTypes: directEffect.damageTypes } : { kind, formula: directEffect.formula },
      channel,
      timing
    }
  };
}
const effective = (key, value) => empty(value) || (key === 'triggerConfig' && canonical(value) === canonical(defaultTriggers)) ? null : value;
const inactiveDefault = (value, fallback) => empty(value) || canonical(value) === canonical(fallback);
function definitionFromWizard(record, { roomId, definitionVersion, classId, allowProposedAreaRoll, creatureSource } = {}) {
  try {
    const d = record?.authoredDraft;
    if (!d || typeof d !== 'object') refuse('Whole Wizard draft unavailable; reopen, review and save it in the Wizard');
    const fields = ['name', 'description', 'level', 'school', 'icon', 'spellType', 'typeConfig', 'effectTypes', 'effectsMap', 'damageConfig', 'healingConfig', 'buffConfig', 'debuffConfig', 'utilityConfig', 'controlConfig', 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', 'rollableTable', 'effectResolutions', 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'targetingConfig', 'targetingMode', 'targetingTags', 'effectTargeting', 'durationConfig', 'persistentConfig', 'propagation', 'resourceCost', 'resolution', 'mechanicsConfig', 'prophecyOptions', 'cooldownConfig', 'triggerConfig', 'trapConfig', 'channelingConfig', 'errors', 'warnings', 'currentStep', 'completedSteps', 'wizardFlow', 'lastModified', 'isValid', 'validation', 'tags', 'id', 'dateCreated', 'serializedData', 'humanReadable', 'gameCode', 'authoredDraft', 'authoredDefinitionId', 'effectType', 'damageTypes', 'statusEffectsConfig', 'catalogueSource'];
    const libraryMetaFields = ['categoryIds', 'categories', 'source', 'isCustom', 'isUserCreated', 'createdAt', 'updatedAt', 'userId', 'lastSaved', 'folderId', 'isShared', 'approvalRevision', 'approvedRevision', 'approvalStatus', 'approvalMetadata', 'approvalHistory', 'approvedAt', 'approvedBy', 'approvedHash', 'approvedDefinitionVersion', 'definitionVersion', 'revision', 'localRevision', 'confirmedRevision', 'registryRevision'];
    only(d, fields, 'draft fields');
    only(record, [...fields, ...libraryMetaFields], 'library fields');
    for (const key of new Set([...Object.keys(d), ...Object.keys(record)])) {
      if (key === 'targetingConfig' || !(/Config$|^effectsMap$|^effectTypes$|^effectResolutions$|^effectTargeting$|^effectMechanicsConfigs$|^mechanics|^combined|^propagation$|^resourceCost$|^rollableTable$|^prophecyOptions$|^spellType$|^name$|^description$|^targetingMode$|^targetingTags$|^statusEffectsConfig$/.test(key))) continue;
      if (canonical(effective(key, record[key])) !== canonical(effective(key, d[key]))) refuse(`library/draft ${key}`);
    }
    if (record.serializedData !== undefined) {
      const serialized = JSON.parse(record.serializedData);
      delete serialized.authoredDraft;
      if (canonical(serialized) !== canonical(d)) refuse('serializedData/draft');
    }
    // M4B: a catalogue-backed record is pinned to its whole source record and only its
    // supported executable projection is admitted. The Wizard may preserve/reopen it;
    // editing an executable field invalidates the source binding.
    if (record.catalogueSource !== undefined) {
      const source = record.catalogueSource;
      if (!source || typeof source !== 'object' || Array.isArray(source) || !source.record || typeof source.record !== 'object' ||
        typeof source.spellId !== 'string' || typeof source.classId !== 'string' || !/^[0-9a-f]{64}$/.test(source.recordHash || '') ||
        (d.catalogueSource !== undefined && canonical(d.catalogueSource) !== canonical(source)) || source.spellId !== source.record.id ||
        source.classId !== classId) refuse('The catalogue source binding is incomplete or changed.');
      if (sha256Hex(canonical(source.record)) !== source.recordHash) refuse('The catalogue source record changed after preparation.');
      if (!record.authoredDefinitionId) refuse('The prepared catalogue record has no definition id; save it in the Wizard first.');
      const executable = catalogueExecutable(source.record, source.classId, { roomId, definitionId: record.authoredDefinitionId, definitionVersion });
      if (!executable.ok) refuse(`Catalogue record: ${executable.reason}`);
      const def = executable.definition, kind = def.effect.kind;
      const isCatalogueArea = def.capability === AREA_CAPABILITY;
      if (isCatalogueArea && !isAreaRollProcedureApproved({ allowProposedAreaRoll })) refuse(AREA_ROLL_UNAPPROVED_REASON);
      const config = d[kind === 'damage' ? 'damageConfig' : 'healingConfig'] || {};
      const other = d[kind === 'damage' ? 'healingConfig' : 'damageConfig'];
      const target = d.targetingConfig || {};
      const price = d.resourceCost || {};
      const draftMana = price.mana ?? price.resourceValues?.mana;
      const validCatalogueTargeting = isCatalogueArea
        ? (target.targetingType === 'area' && target.aoeShape === 'circle' && target.aoeParameters?.radius === def.targeting.radiusFeet &&
           target.rangeDistance === def.targeting.rangeFeet && target.rangeType === 'ranged' &&
           canonical(target.targetRestrictions) === canonical([def.targeting.restriction]))
        : (target.targetingType === 'single' && (target.maxTargets === undefined || target.maxTargets === 1) &&
           target.rangeDistance === source.record.targetingConfig.rangeDistance && target.rangeType === source.record.targetingConfig.rangeType &&
           canonical(target.targetRestrictions) === canonical(source.record.targetingConfig.targetRestrictions));
      if (d.spellType !== 'ACTION' || d.typeConfig?.castTimeType !== 'IMMEDIATE' || canonical(d.effectTypes) !== canonical(source.record.effectTypes) ||
        canonical(d.typeConfig?.school) !== canonical(source.record.typeConfig?.school) ||
        !empty(other) || !empty(d.buffConfig) || !empty(d.debuffConfig) || !empty(d.utilityConfig) || !empty(d.controlConfig) ||
        !empty(d.summoningConfig) || !empty(d.transformationConfig) || !empty(d.purificationConfig) || !empty(d.restorationConfig) ||
        !empty(d.rollableTable) || !empty(d.propagation) || !inactiveDefault(d.triggerConfig, loadedDefaultTriggers) || !empty(d.trapConfig) || !empty(d.channelingConfig) ||
        !inactiveDefault(d.mechanicsConfig, loadedDefaultMechanics) || !empty(d.prophecyOptions) || !empty(d.effectMechanicsConfigs) || !empty(d.mechanicsAvailableEffects) ||
        !empty(d.combinedEffects) || !empty(d.mechanicsAvailableCombinedEffects) || !empty(d.statusEffectsConfig) ||
        canonical(config.formula) !== canonical(def.effect.formula) || (!empty(d.durationConfig) && canonical(d.durationConfig) !== canonical({ durationType: 'instant' })) ||
        (d.cooldownConfig && (d.cooldownConfig.cooldownType !== 'none' || d.cooldownConfig.cooldownValue !== 0)) ||
        !validCatalogueTargeting ||
        d.name !== def.name || d.description !== def.description ||
        price.actionPoints !== def.resourceCost.actionPoints || draftMana !== def.resourceCost.mana) {
        refuse('Catalogue draft fields differ from the pinned whole record; edit it only as a new, unbound spell.');
      }
      return { ok: true, definition: Object.assign({}, def, {
        definitionId: record.authoredDefinitionId, definitionVersion, scope: { roomId }, name: d.name, description: d.description
      }) };
    }
    if (d.spellType === 'PASSIVE' && passiveEntryTriggerFor(d.triggerConfig)) {
      return passiveEntryFromWizard(d, record, { roomId, definitionVersion, classId, creatureSource });
    }
    if (d.spellType === 'PASSIVE' && passiveTurnTriggerFor(d.triggerConfig)) {
      return passiveTurnFromWizard(d, record, { roomId, definitionVersion, classId, creatureSource });
    }
    if (d.spellType === 'CHANNELED') {
      return channeledFromWizard(d, record, { roomId, definitionVersion, classId });
    }
    if (d.spellType !== 'ACTION' || d.typeConfig?.castTimeType !== 'IMMEDIATE') refuse('Immediate ACTION required');
    only(d.typeConfig, ['school', 'secondaryElement', 'icon', 'tags', 'castTime', 'castTimeType', 'element'], 'typeConfig');
    if (d.typeConfig.secondaryElement) refuse('secondaryElement');
    if (d.typeConfig.castTime !== undefined && d.typeConfig.castTime !== 0) refuse('conflicting cast time');
    const condition = d.controlConfig?.authoredCondition?.profile === CONDITION_CAPABILITY;
    // A10: an explicit versioned marker selects the composable bundle; older markers keep their meaning.
    const effect = d.controlConfig?.authoredCondition?.profile === EFFECT_CAPABILITY;
    const hasRollableTable = !empty(d.rollableTable) && d.rollableTable.enabled === true;
    if (hasRollableTable && creatureSource) refuse('rollableTable: outcome-branched abilities currently require a primary owner PC source');
    const sortedTypes = Array.isArray(d.effectTypes) ? canonical([...d.effectTypes].sort()) : '';
    const direct = effect ? (sortedTypes === '["control","damage"]' ? 'damage' : sortedTypes === '["control","healing"]' ? 'healing' : sortedTypes === '["control"]' ? null : refuse('Effect types (one canonical effect, optionally with one direct damage or healing)')) : null;
    const kind = hasRollableTable ? 'outcome' : effect ? 'control' : canonical(d.effectTypes) === '["damage"]' ? 'damage' : canonical(d.effectTypes) === '["healing"]' ? 'healing' : condition && canonical(d.effectTypes) === '["control"]' ? 'control' : null;
    if (!kind) refuse('Exactly one damage or healing effect required');
    if (hasRollableTable && (!empty(d.effectTypes) || !empty(d.effectsMap) || condition || effect || !empty(d.damageConfig) || !empty(d.healingConfig))) {
      refuse('rollableTable (outcome-branched spells author their effects inside the Rollable Table only; remove separate effect types/configs or keep manual)');
    }
    if (condition && kind !== 'control') refuse('Exactly one condition effect required; mixed definitions stay manual');
    if (!hasRollableTable && !empty(d.effectsMap) && (Object.entries(d.effectsMap).some(([k, v]) => typeof v !== 'boolean' || v !== (k === kind || (!!direct && k === direct))) || d.effectsMap[kind] !== true || (direct && d.effectsMap[direct] !== true))) refuse('effectsMap');
    for (const key of ['buffConfig', 'debuffConfig', 'utilityConfig', ...(condition || effect ? [] : ['controlConfig']), 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', ...(hasRollableTable ? [] : ['rollableTable']), 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'effectTargeting', 'targetingTags', 'persistentConfig', 'prophecyOptions', 'trapConfig', 'channelingConfig', 'statusEffectsConfig']) if (!empty(d[key])) refuse(key);
    if (!hasRollableTable) disabled(d.rollableTable, 'rollableTable');
    if (!empty(d.propagation)) {
      only(d.propagation, ['method', 'behavior', 'parameters'], 'propagation');
      if (d.propagation.method !== 'none' || d.propagation.behavior !== '') refuse('propagation');
      only(d.propagation.parameters, ['count', 'range', 'decay', 'secondaryRadius', 'spreadRate', 'forkCount'], 'inactive propagation parameters');
      if (Object.values(d.propagation.parameters).some(v => !int(v, 10000))) refuse('inactive propagation parameters');
    }
    if (!hasRollableTable && (effect ? ['damage', 'healing'].some(k => k !== direct && !empty(d[`${k}Config`])) : (!empty(d[kind === 'damage' ? 'healingConfig' : 'damageConfig']) || (condition && !empty(d.healingConfig))))) refuse('mixed effect configuration');
    if (d.targetingMode !== undefined && d.targetingMode !== 'unified') refuse('targetingMode');
    if (!condition && !effect && !empty(d.durationConfig) && canonical(d.durationConfig) !== '{"durationType":"instant"}') refuse('durationConfig');
    if ((condition || effect) && canonical(record.durationConfig ?? null) !== canonical(d.durationConfig ?? null)) refuse('library/draft durationConfig');
    const mech = d.mechanicsConfig;
    const defaultMech = { cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } };
    let hasHunterFlow = false;
    if (!empty(mech) && canonical(mech) !== canonical(defaultMech)) {
      if (mech && typeof mech === 'object' && !Array.isArray(mech) && mech.hunterFlow !== undefined) {
        only(mech, ['cards', 'combos', 'coins', 'stateRequirements', 'stateOptions', 'hunterFlow'], 'mechanicsConfig');
        const withoutFlow = { cards: mech.cards ?? null, combos: mech.combos ?? null, coins: mech.coins ?? null, stateRequirements: mech.stateRequirements ?? [], stateOptions: mech.stateOptions ?? { thresholds: [] } };
        if (canonical(withoutFlow) !== canonical(defaultMech)) refuse('mechanicsConfig');
        hasHunterFlow = true;
      } else {
        refuse('mechanicsConfig');
      }
    }
    const watchShape = componentWatchShape(d.triggerConfig);
    if (watchShape && !componentScope.approved()) { refuse(`triggers (${componentScope.UNAPPROVED_REASON})`); }
    if (watchShape && (condition || (!effect && kind !== 'damage'))) { refuse('triggers (Follow-up After My Damage is watched only on a Direct Damage part: a single-target immediate damage spell, or a direct damage part next to one supported effect)'); }
    const critGate = critGateShape(d.triggerConfig);
    if (critGate && !effect) { refuse('triggers (Critical Hit on an effect is supported on a composed authored-effect:v1 follow-up with a single-die Direct Damage part only)'); }
    const followUp = (watchShape || critGate) ? null : followUpTriggerFor(d.triggerConfig);
    const cd = d.cooldownConfig;
    const combatCooldown = require('./authoredCooldown').valid(cd);
    if (!empty(cd)) {
      only(cd, ['cooldownType', 'cooldownValue'], 'cooldownConfig');
      if (!combatCooldown && (cd.cooldownType !== 'none' || cd.cooldownValue !== 0)) refuse('cooldownConfig: legacy turns/rounds/rests/charges have no authenticated release procedure; explicitly choose caster-turn starts for a new Wizard ability');
    }
    // Composed cooldowns: the same approved procedure may also govern an immediate + periodic bundle (same kind). The periodic
    // instance's own lifetime stays its explicit expiry policy; the cooldown only controls reuse of this definition by this actor.
    // Effect cooldowns: likewise a standalone periodic effect, and a movement OR Stunned effect with or without its existing plain
    // immediate part. The installed attribute family also takes this cooldown (plain immediate part only, no save).
    // Positive flat DR takes the same cooldown, plain immediate part only and no save; multiple-DR refusal and expiry stay unchanged.
    // Formula-rider cooldowns: the movement OR Stunned immediate part may also use the M4A attribute vocabulary (same scaled reader,
    // owner-attested inputs and retained-face reapproval); the cooldown is checked, started and released by the same machinery.
    // Rider-save cooldowns: a movement OR Stunned bundle may also keep its existing rider-local "negates" save (with a plain or, under the
    // formula-rider save cooldown labels, an attribute-scaled immediate part). The cooldown starts in the one successful cast commit on either recorded outcome; no other save shape.
    const authoredEffect = d.controlConfig?.authoredCondition;
    const effectCooldown = effect && ['periodic', 'movement', 'stunned', 'attribute', 'damageReduction'].includes(authoredEffect?.effect) &&
      (authoredEffect?.save === undefined || ['movement', 'stunned'].includes(authoredEffect?.effect));
    if (combatCooldown && (condition || (effect && !effectCooldown) || d.targetingConfig?.targetingType !== 'single')) refuse('Cooldowns currently require one creature target and one of: immediate damage OR healing; a periodic effect, optionally with an immediate part of the same kind; or a movement, Stunned, supported attribute or positive flat DR effect, optionally with an immediate damage OR healing part (a save only on a movement or Stunned effect, negating that effect)');
    const isAreaTarget = !condition && !effect && !hasRollableTable && d.targetingConfig?.targetingType === 'area';
    if (hasRollableTable && (combatCooldown || followUp || watchShape || critGate || hasHunterFlow || d.targetingConfig?.targetingType === 'area')) {
      refuse('rollableTable (outcome-branched spells currently require single-target creature targeting without cooldowns, triggers, or class mechanics)');
    }
    if (hasHunterFlow && (isAreaTarget || condition || effect)) {
      refuse('mechanicsConfig (Hunter Flow Slice 1 supports plain single-target Quick Draw only)');
    }
    const cost = d.resourceCost;
    // Arbitrary Wizard-authored definitions (single-target or area) cannot grant themselves class payments or class-resource gains;
    // typed class payments require a reviewed, hash-pinned catalogue profile via record.catalogueSource.
    only(cost, ['actionPoints', 'actionPointsSelected', 'mana', 'components', 'materialComponents', 'resourceTypes', 'resourceValues', 'resourceFormulas', 'useFormulas', 'primaryResourceType'], 'resourceCost');
    if (cost.useFormulas !== undefined) only(cost.useFormulas, ['mana', 'actionPoints'], 'resourceCost.useFormulas');
    if (cost.resourceValues !== undefined) only(cost.resourceValues, ['mana', 'actionPoints'], 'resourceCost.resourceValues');
    if (!int(cost.actionPoints, 20) || !empty(cost.components) || (cost.materialComponents !== undefined && cost.materialComponents !== '') || !empty(cost.resourceFormulas) || Object.values(cost.useFormulas || {}).some(v => v !== false)) refuse('Explicit AP price / components / formulas');
    if ((cost.resourceTypes || []).some(t => !['mana', 'actionPoints'].includes(t)) || Object.keys(cost.resourceValues || {}).some(k => !['mana', 'actionPoints'].includes(k)) || (cost.primaryResourceType !== undefined && !['mana', 'actionPoints'].includes(cost.primaryResourceType))) refuse('resource types');
    if (cost.resourceValues?.actionPoints !== undefined && cost.resourceValues.actionPoints !== cost.actionPoints) refuse('conflicting AP encodings');
    // The Step 5 number input stores an authored 0 in resourceValues while a legacy empty field may remain at `mana`.
    // An empty field is unauthored; a real numeric conflict still refuses below.
    const manaValues = [cost.mana, cost.resourceValues?.mana].filter(v => v !== undefined && v !== '');
    if (!manaValues.length || manaValues.some(v => !int(v, 10000)) || new Set(manaValues).size !== 1) refuse('Explicit mana price');
    const t = d.targetingConfig;
    only(t, ['targetingType', 'rangeType', 'rangeDistance', 'maxTargets', 'targetRestrictions', 'targetRestriction', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior', 'aoeShape', 'aoeType', 'aoeParameters'], 'targetingConfig');
    if (isAreaTarget) {
      if (!['circle', 'line'].includes(t.aoeShape)) refuse('area shape (circle required; bounded damage line also supported)');
      if (t.aoeShape === 'circle' && t.aoeType !== undefined && !['', 'sphere', 'circle'].includes(t.aoeType)) refuse('area shape (circle required)');
      if (t.aoeShape === 'line' && t.aoeType !== undefined && !['', 'sphere', 'circle', 'line'].includes(t.aoeType)) refuse('area shape (line aoeType invalid)');
      if (t.aoeShape === 'line') {
        only(t.aoeParameters, ['radius', 'size', 'range', 'angle', 'length', 'width', 'height'], 'aoeParameters');
        if (t.aoeParameters.length === undefined || t.aoeParameters.width === undefined) refuse('area shape (line requires explicit length and width in aoeParameters)');
        if (kind !== 'damage') refuse('area shape (line currently supports immediate damage only; healing stays manual)');
        if (!int(t.aoeParameters.length, 120) || t.aoeParameters.length < 5 || t.aoeParameters.length % 5 !== 0) refuse('aoeParameters.length (5..120 ft multiple of 5 required)');
        if (!int(t.aoeParameters.width, 20) || t.aoeParameters.width < 5 || t.aoeParameters.width % 5 !== 0) refuse('aoeParameters.width (5..20 ft multiple of 5 required)');
        for (const [k, v] of Object.entries(t.aoeParameters)) if (!['length', 'width'].includes(k) && !int(v, 10000)) refuse(`aoeParameters.${k}`);
      } else {
        only(t.aoeParameters, ['radius', 'size', 'range', 'angle', 'length', 'width', 'height'], 'aoeParameters');
        if (!int(t.aoeParameters.radius, 60) || t.aoeParameters.radius < 5 || t.aoeParameters.radius % 5 !== 0) refuse('aoeParameters.radius (5..60 ft multiple of 5 required)');
        for (const [k, v] of Object.entries(t.aoeParameters)) if (k !== 'radius' && !int(v, 10000)) refuse(`aoeParameters.${k}`);
      }
      if (t.rangeType !== 'ranged' || !int(t.rangeDistance, 300) || t.rangeDistance < 1 || (t.movementBehavior !== undefined && t.movementBehavior !== 'static')) refuse('area range (ranged 1..300 ft static required)');
      if (t.maxTargets !== undefined && (!Number.isSafeInteger(t.maxTargets) || t.maxTargets < 1)) refuse('maxTargets');
      if (t.maxTargets !== undefined && t.maxTargets > MAX_AREA_TARGETS) refuse('area_target_capacity_exceeded: technical limit is 8 creature targets (9 actors including source); do not truncate');
      if (record.targetingConfig?.rangeDistance !== t.rangeDistance || record.targetingConfig?.maxTargets !== t.maxTargets) refuse('library/draft targeting');
      only(record.targetingConfig, Object.keys(t).concat(['aoeType', 'aoeShape', 'aoeParameters', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior']), 'outer targeting');
      for (const k of Object.keys(t)) if (canonical(record.targetingConfig[k]) !== canonical(t[k]) && !(['aoeShape', 'aoeType'].includes(k) && t[k] === '')) refuse(`library/draft targeting.${k}`);
      for (const k of ['selectionMethod', 'targetSelectionMethod']) if ((t[k] !== undefined && t[k] !== 'manual') || (record.targetingConfig[k] !== undefined && record.targetingConfig[k] !== 'manual')) refuse(k);
      const restrictions = t.targetRestrictions;
      if (!Array.isArray(restrictions) || restrictions.length !== 1 || !['ally', 'enemy', 'any'].includes(restrictions[0]) || (t.targetRestriction && t.targetRestriction !== restrictions[0])) refuse('targetRestrictions');
      if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== canonical({ [kind]: 'DICE' })) refuse('effectResolutions');
      if (watchShape) { refuse('triggers (a watched part on an area spell is not supported: one cast would produce one damage result per creature, and no aggregation is defined)'); }
      const directEffect = readDirect(d, record, kind, true);
      if (!isAreaRollProcedureApproved({ allowProposedAreaRoll })) {
        throw Error(AREA_ROLL_UNAPPROVED_REASON);
      }
      const maxTargets = t.maxTargets !== undefined && t.maxTargets > 1 ? t.maxTargets : MAX_AREA_TARGETS;
      const areaTargeting = t.aoeShape === 'line'
        ? { kind: 'area', aoeShape: 'line', lengthFeet: t.aoeParameters.length, widthFeet: t.aoeParameters.width, rangeFeet: t.rangeDistance, maxTargets, restriction: restrictions[0] }
        : { kind: 'area', aoeShape: 'circle', radiusFeet: t.aoeParameters.radius, rangeFeet: t.rangeDistance, maxTargets, restriction: restrictions[0] };
      return { ok: true, definition: Object.assign({
        schemaVersion: 5, capability: AREA_CAPABILITY, scope: { roomId }, definitionId: record.authoredDefinitionId, definitionVersion,
        name: d.name, description: d.description, binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
        targeting: areaTargeting,
        resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
        effect: kind === 'damage' ? { kind, formula: directEffect.formula, damageTypes: directEffect.damageTypes } : { kind, formula: directEffect.formula }
      }, followUp ? { followUp: followUp } : {}) };
    }
    if (t.targetingType !== 'single' || t.maxTargets !== 1 || !int(t.rangeDistance, 300) || !['ranged', 'melee', 'self', 'touch'].includes(t.rangeType) || !empty(t.aoeParameters) || (t.movementBehavior && t.movementBehavior !== 'static')) refuse('single target / explicit range / count');
    if (record.targetingConfig?.rangeDistance !== t.rangeDistance || record.targetingConfig?.maxTargets !== t.maxTargets) refuse('library/draft targeting');
    only(record.targetingConfig, Object.keys(t).concat(['aoeType', 'aoeShape', 'aoeParameters', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior']), 'outer targeting');
    for (const config of [t, record.targetingConfig]) {
      if (!empty(config.aoeParameters) || (config.movementBehavior !== undefined && config.movementBehavior !== 'static') || (config.aoeShape !== undefined && !['', 'circle'].includes(config.aoeShape)) || (config.aoeType !== undefined && !['', 'sphere', 'circle'].includes(config.aoeType))) refuse('inactive area / movement configuration');
    }
    for (const k of Object.keys(t)) if (canonical(record.targetingConfig[k]) !== canonical(t[k]) && !(['aoeShape', 'aoeType'].includes(k) && t[k] === '')) refuse(`library/draft targeting.${k}`);
    for (const cfg of [t, record.targetingConfig]) {
      for (const k of ['selectionMethod', 'targetSelectionMethod']) {
        if (cfg[k] !== undefined && !SELECTION_METHODS.includes(cfg[k])) refuse(k);
      }
      if (cfg.selectionMethod !== undefined && cfg.targetSelectionMethod !== undefined && cfg.selectionMethod !== cfg.targetSelectionMethod) refuse('selectionMethod');
    }
    const draftSel = t.selectionMethod || t.targetSelectionMethod || 'manual';
    const outerSel = record.targetingConfig.selectionMethod || record.targetingConfig.targetSelectionMethod || 'manual';
    if (draftSel !== outerSel) refuse('library/draft targeting.selectionMethod');
    const selectionMethod = draftSel;
    const restrictions = t.targetRestrictions;
    if (!Array.isArray(restrictions) || restrictions.length !== 1 || !['self', 'ally', 'enemy', 'any'].includes(restrictions[0]) || (t.targetRestriction && t.targetRestriction !== restrictions[0])) refuse('targetRestrictions');
    if (hasRollableTable) {
      if (selectionMethod !== 'manual') refuse('selectionMethod (outcome-branched spells currently require manual single-target selection)');
      if (restrictions[0] === 'self' || t.rangeDistance === 0) refuse('distinct creature targeting required');
      if (!empty(d.effectResolutions)) refuse('effectResolutions');
      if (typeof d.name !== 'string' || !d.name.trim() || d.name.length > 120) refuse('name');
      if (d.description !== undefined && (typeof d.description !== 'string' || d.description.length > 4000)) refuse('description');
      const compiledTable = randomOutcome.compileOutcomeTable(d.rollableTable);
      if (!compiledTable.ok) throw Error(compiledTable.reason);
      return {
        ok: true,
        definition: {
          schemaVersion: randomOutcome.SCHEMA_VERSION,
          capability: OUTCOME_CAPABILITY,
          scope: { roomId },
          definitionId: record.authoredDefinitionId,
          definitionVersion,
          name: d.name,
          description: d.description || '',
          binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId },
          spellType: 'ACTION',
          castTimeType: 'IMMEDIATE',
          targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] },
          resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
          outcomeTable: compiledTable.outcomeTable
        }
      };
    }
    if (selectionMethod === 'lowest_health' && (creatureSource || condition || hasHunterFlow || restrictions[0] === 'self' || t.rangeDistance < 1)) {
      refuse('selectionMethod (lowest_health requires a primary owner PC, single distinct enemy/ally/any target within >= 1 ft)');
    }
    const singleTargeting = selectionMethod === 'lowest_health'
      ? { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0], selectionMethod: 'lowest_health' }
      : { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] };
    if (effect) {
      only(d.controlConfig, ['authoredCondition'], 'controlConfig (use the explicit authored effect profile)');
      const c = d.controlConfig.authoredCondition;
      const parsed = readAuthoredConditionEffect(c, d, restrictions, direct);
      const conditionEffect = parsed.conditionEffect;
      const save = parsed.save;
      // Review finding 1: a second, structured Wizard duration would contradict the explicit expiry policy.
      if (!empty(d.durationConfig) && canonical(d.durationConfig) !== '{"durationType":"instant"}') refuse('durationConfig (the explicit expiry policy is the only executed duration)');
      const wantResolutions = direct ? { control: 'MANUAL', [direct]: 'DICE' } : { control: 'MANUAL' };
      // Formula riders: next to a movement OR Stunned effect the immediate part may also use the M4A attribute vocabulary (same reader,
      // owner-attested inputs and caster-snapshot binding as the M5 composition). Other rider families keep plain dice; the
      // caster-start cooldown gate above applies unchanged (formula-rider cooldowns).
      // Formula-rider saves: that scaled part may also sit next to the existing rider-local "negates" save (movement OR Stunned only; the
      // save checks above already refuse periodic, flat DR and rider-only shapes). The scaled part and payment apply on both outcomes.
      // Formula-rider save cooldowns: the caster-start cooldown gate above applies unchanged to this shape (it starts in the one successful
      // cast commit on either recorded outcome, as on the plain rider-save route).
      const directPart = direct ? readBundleDirect(d, record, direct, FORMULA_BUNDLE_CONDITIONS.includes(c.effect)) : null;
      if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== canonical(wantResolutions)) refuse('effect resolution');
      if (restrictions[0] === 'self' || t.rangeDistance === 0) refuse('distinct creature targeting required');
      if (critGate) {
        if (direct !== 'damage' || d.damageConfig?.damageType !== 'direct') {
          refuse('triggers (Critical Hit trigger on an effect requires a Direct Damage part on the same spell)');
        }
        if (save) {
          refuse('triggers (Critical Hit follow-up trigger cannot be combined with a saving throw on the same effect)');
        }
        const critStats = Object.fromEntries(formulaContract.ATTRIBUTES.map(function (name) { return [name, 10]; }));
        const critReading = formulaAttributes(directPart.formula).length
          ? readScaledFormula(directPart.formula, critStats)
          : readFormula(directPart.formula);
        if (!critReading.dice || critReading.dice.length !== 1 || critReading.dice[0].count !== 1) {
          refuse('triggers (Critical Hit follow-up trigger currently supports a single-die Direct Damage formula like 1d8 or 1d6+2; multi-die spell crit rules are undecided)');
        }
      }
      let componentWatch = null;
      if (watchShape) {
        const part = Object.prototype.hasOwnProperty.call(COMPONENT_WATCH_PARTS, watchShape.wizardKey) ? COMPONENT_WATCH_PARTS[watchShape.wizardKey] : null;
        if (!part) { refuse(`triggers (Follow-up After My Damage is watched only on the Direct Damage part; the "${watchShape.wizardKey}" part removes no HP of its own)`); }
        if (!directPart || directPart.kind !== part.kind || d.damageConfig?.damageType !== 'direct') { refuse('triggers (the watched Direct Damage part is not this spell\'s direct damage)'); }
        if (conditionEffect.kind === 'periodic') { refuse('triggers (a watched Direct Damage part next to periodic ticks is not supported: the ticks are a second, later damage source and no aggregation is defined)'); }
        if (!COMPONENT_WATCH_CONDITIONS.includes(conditionEffect.kind)) { refuse('triggers (a watched Direct Damage part is supported next to a movement, Stunned, attribute or flat damage-reduction effect only)'); }
        // Family expansion: the spell's own caster-start cooldown and an attribute-scaled direct part (movement/Stunned only, as readBundleDirect
        // already enforces) are existing executable compositions; the watch reads the binder's committed result and changes neither.
        const placement = componentWatchPlacement(watchShape.wizardKey, part.componentId);
        if (!placement || placement.shape !== 'bundle') { refuse('triggers (unsupported watched part)'); }
        componentWatch = { contract: COMPONENT_WATCH, componentId: part.componentId, wizardKey: watchShape.wizardKey };
      }
      return { ok: true, definition: Object.assign({ schemaVersion: 3, capability: EFFECT_CAPABILITY, scope: { roomId }, definitionId: record.authoredDefinitionId, definitionVersion,
        name: d.name, description: d.description, binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
        targeting: singleTargeting, resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
        effects: Object.assign({ direct: directPart, condition: conditionEffect }, save ? { save } : {}, critGate ? { critGate: Object.assign({}, CRIT_GATE_SPEC) } : {}),
        timing: Object.assign({ expiryPolicy: c.expiryPolicy, durationText: c.durationText, authoredDuration: d.durationConfig ?? null, gmNote: c.gmNote }, COUNTED_EXPIRY_POLICIES.includes(c.expiryPolicy) ? { occurrences: c.occurrences } : {}) },
        combatCooldown ? { cooldown: cd } : {}, followUp ? { followUp: followUp } : {}, componentWatch ? { componentWatch: componentWatch } : {}) };
    }
    if (condition) {
      only(d.controlConfig, ['authoredCondition'], 'controlConfig (use the explicit canonical condition profile)');
      const c = d.controlConfig.authoredCondition;
      only(c, ['profile', 'conditionKey', 'expiryPolicy', 'durationText', 'gmNote'], 'authoredCondition');
      if (c.conditionKey !== 'stunned' || c.expiryPolicy !== 'gm-manual' || typeof c.durationText !== 'string' || !c.durationText.trim() || c.durationText.length > 300 || typeof c.gmNote !== 'string' || !c.gmNote.trim() || c.gmNote.length > 1000) refuse('Explicit canonical Stunned, manual expiry, authored duration and GM note required');
      if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== '{"control":"MANUAL"}') refuse('condition resolution');
      if (restrictions[0] === 'self' || t.rangeDistance === 0) refuse('distinct creature targeting required');
      return { ok: true, definition: Object.assign({ schemaVersion: 2, capability: CONDITION_CAPABILITY, scope: { roomId }, definitionId: record.authoredDefinitionId, definitionVersion,
        name: d.name, description: d.description, binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
        targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] }, resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
        effect: { kind: 'condition', conditionKey: c.conditionKey }, timing: { expiryPolicy: c.expiryPolicy, durationText: c.durationText, authoredDuration: d.durationConfig ?? null, gmNote: c.gmNote }
      }, followUp ? { followUp: followUp } : {}) };
    }
    if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== canonical({ [kind]: 'DICE' })) refuse('effectResolutions');
    if (hasHunterFlow && (isAreaTarget || condition || effect)) {
      refuse('mechanicsConfig (Hunter Flow Slice 1 supports plain single-target Quick Draw only)');
    }
    if (hasHunterFlow && (creatureSource || classId !== 'hunter' || kind !== 'damage' || cost.actionPoints !== 1 || manaValues[0] !== 0 || combatCooldown || followUp || watchShape)) {
      refuse('mechanicsConfig (Hunter Flow Slice 1 currently enables Hunter Quick Draw only; other Flow abilities stay manual pending creator decisions.)');
    }
    const directEffect = readDirect(d, record, kind, true, true, true, kind === 'damage', hasHunterFlow);
    const save = directEffect.directSave || null;
    const stats = Object.fromEntries(formulaContract.ATTRIBUTES.map(name => [name, 10]));
    const detReading = readDeterministicFormula(directEffect.formula, stats, { current: 0, max: 0 });
    const deterministic = detReading.supported;
    const health = readHealthFormula(directEffect.formula, stats, { current: 0, max: 0 }).readsHealth === true;
    const readsHealth = health || detReading.readsHealth === true;
    let scaled = false;
    try { readFormula(directEffect.formula); } catch (_) { scaled = true; }
    const selfHeal = kind === 'healing' && restrictions[0] === 'self' && t.rangeDistance === 0 &&
      (d.healingConfig.targetType === undefined || ['self', 'single'].includes(d.healingConfig.targetType)) && !combatCooldown && !readsHealth;
    if (restrictions[0] === 'self' && !selfHeal && (!creatureSource || scaled || deterministic || readsHealth || combatCooldown || kind !== 'healing' || t.rangeDistance !== 0)) {
      refuse('Self targeting currently supports immediate healing at range 0 without cooldowns or missing-health scaling');
    }
    if ((readsHealth || (deterministic && !selfHeal) || (scaled && !selfHeal && t.rangeDistance === 0)) && (restrictions[0] === 'self' || t.rangeDistance === 0)) {
      refuse('This formula requires a distinct creature target');
    }
    // Direct-damage save, first slice: plain NdM+-K dice, a primary owner PC source, one distinct creature target, no cooldown. Every
    // other combination (scaled, missing-health or deterministic formulas, cooldown, self, creature source, catalogue) refuses whole.
    if (save) {
      if (creatureSource) refuse('save on the direct damage part (a GM-recorded save currently requires a primary owner PC source)');
      if (scaled || deterministic || readsHealth) refuse('save on the direct damage part (plain NdM±K dice only in this slice; attribute, missing-health and fixed formulas stay manual with a save)');
      if (combatCooldown) refuse('save on the direct damage part (a caster-start cooldown together with a direct-damage save is not a reviewed combination yet)');
      if (restrictions[0] === 'self' || t.rangeDistance === 0) refuse('save on the direct damage part (needs one distinct creature target)');
    }
    // Family expansion: a one-part immediate DAMAGE spell may carry the card on its only (Direct Damage) part. Every immediate-damage
    // capability the compiler admits for a primary owner PC qualifies (plain dice, attribute-scaled, missing-health, deterministic),
    // with or without its own caster-start cooldown. The target must be another creature (never self).
    let immediateWatch = null;
    if (watchShape) {
      const placement = COMPONENT_WATCH_PLACEMENTS.find(p => p.wizardKey === watchShape.wizardKey && p.shape === 'immediate');
      if (!placement) { refuse(`triggers (Follow-up After My Damage is watched only on the Direct Damage part; the "${watchShape.wizardKey}" part removes no HP of its own)`); }
      if (kind !== placement.kind || d.damageConfig?.damageType !== 'direct') { refuse('triggers (the watched Direct Damage part is not this spell\'s direct damage)'); }
      if (restrictions[0] === 'self' || t.rangeDistance === 0) { refuse('triggers (a watched Direct Damage part needs a distinct creature target)'); }
      immediateWatch = { contract: COMPONENT_WATCH, componentId: placement.componentId, wizardKey: watchShape.wizardKey };
    }
    if (hasHunterFlow) {
      if (creatureSource) refuse('mechanicsConfig (Hunter Flow requires a primary owner PC source)');
      if (kind !== 'damage' || combatCooldown || followUp || watchShape || save) {
        refuse('mechanicsConfig (Hunter Flow Slice 1 supports plain single-target Quick Draw only)');
      }
      const flowCheck = hunterFlow.isQuickDrawFlowSpell({
        classId,
        mechanicsConfig: mech,
        actionPoints: cost.actionPoints,
        mana: manaValues[0],
        directEffect,
        targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] }
      });
      if (!flowCheck.ok) refuse(`mechanicsConfig (${flowCheck.reason})`);
      return {
        ok: true,
        definition: {
          schemaVersion: 8,
          capability: FLOW_CAPABILITY,
          scope: { roomId },
          definitionId: record.authoredDefinitionId,
          definitionVersion,
          name: d.name,
          description: d.description,
          binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'hunter' },
          spellType: 'ACTION',
          castTimeType: 'IMMEDIATE',
          targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] },
          resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
          effect: { kind: 'damage', formula: directEffect.formula, damageTypes: directEffect.damageTypes },
          hunterFlow: {
            version: 1,
            bonusDamageOnHit: hunterFlow.QUICK_DRAW_SLICE_POLICY.bonusDamageOnHit,
            bonusDamageType: hunterFlow.QUICK_DRAW_SLICE_POLICY.bonusDamageType,
            rollDice: { count: 2, sides: 6 },
            updateOnMiss: true,
            encounterResetTo: hunterFlow.FLOW_START,
            approvalRef: hunterFlow.QUICK_DRAW_APPROVAL_REF
          },
          classPayment: { domain: hunterFlow.FLOW_DOMAIN, mode: 'flow-state' }
        }
      };
    }
    // Keep the shared CommonJS module free of object-spread helper imports (CRA marks those as ESM).
    return { ok: true, definition: Object.assign({ schemaVersion: deterministic ? 7 : health ? 6 : scaled || combatCooldown ? 4 : 1, scope: { roomId }, definitionId: record.authoredDefinitionId, definitionVersion,
      name: d.name, description: d.description, binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
      targeting: singleTargeting, resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
       effect: kind === 'damage' ? { kind, formula: directEffect.formula, damageTypes: directEffect.damageTypes } : { kind, formula: directEffect.formula } }, deterministic ? { capability: DETERMINISTIC_CAPABILITY } : health ? { capability: HEALTH_CAPABILITY } : scaled || combatCooldown ? { capability: FORMULA_CAPABILITY } : {}, combatCooldown ? { cooldown: cd } : {}, followUp ? { followUp: followUp } : {}, immediateWatch ? { componentWatch: immediateWatch } : {}, save ? { save: save } : {}) };
  } catch (error) { return { ok: false, code: 'unsupported_wizard_record', reason: error.message }; }
}
// M5 composition: an immediate part next to a periodic tick may use the existing M4A attribute vocabulary (readScaledFormula).
// Formula riders: likewise next to a movement OR Stunned effect (FORMULA_BUNDLE_CONDITIONS).
// Missing-health and deterministic (zero-dice) immediate parts are not admitted here; other bundles keep plain A1 dice.
const FORMULA_BUNDLE_CONDITIONS = Object.freeze(['periodic', 'movement', 'stunned']);
function readBundleDirect(d, record, kind, scaledAllowed) {
  if (!scaledAllowed) return readDirect(d, record, kind);
  const e = readDirect(d, record, kind, true);
  try { readFormula(e.formula); } catch (_) { if (!formulaAttributes(e.formula).length) refuse('effect.formula (plain NdM±K, or the M4A attribute vocabulary naming at least one attribute)'); }
  return e;
}
/** M5 composition / formula riders: an immediate + periodic, movement or Stunned bundle whose immediate part reads owner-attested
 * attribute scores (M4A binding applies). */
const isFormulaBundle = approval => approval?.spell?.definitionHash?.startsWith(`${EFFECT_CAPABILITY}/`) === true && FORMULA_BUNDLE_CONDITIONS.includes(approval?.effectTerms?.condition?.kind) &&
  typeof approval?.effectTerms?.direct?.formula === 'string' && formulaAttributes(approval.effectTerms.direct.formula).length > 0;
// One direct DICE damage or healing configuration (A1 rules, shared by the A10 bundle). Throws to refuse.
function readDirect(d, record, kind, allowScaling = false, allowHealth = false, allowDeterministic = false, allowDirectSave = false, allowHunterFlowSchool = false) {
    const e = d[kind === 'damage' ? 'damageConfig' : 'healingConfig'];
    const allowed = ['formula', 'resolution', 'globalResolution', 'description', 'criticalConfig', 'canCrit', 'critMultiplier', 'critDiceOnly', 'chanceOnHitConfig', 'savingThrowConfig', 'savingThrow', 'difficultyClass', 'partialEffect', 'partialEffectFormula'];
    only(e, [...allowed, ...(kind === 'damage' ? ['damageType', 'elementType', 'secondaryElementType', 'damageTypes', 'hasDotEffect', 'dotConfig'] : ['healingType', 'targetType', 'shieldType', 'shieldDuration', 'duration', 'tickFrequency', 'scalingType', 'specialEffects', 'hasHotEffect', 'hasShieldEffect', 'hotFormula', 'shieldFormula'])], `${kind}Config`);
    // A save authored on the direct damage/healing part (Wizard Saving Throw Configuration). Only the one-part single-target immediate
    // damage route reads it (allowDirectSave, directSave.js); every other shape keeps it manual: next to another part, whether the save
    // also covers that part is not decided (D-SV2), and healing, area and periodic saves have no approved meaning.
    let save = null;
    if (directSave.authored(e)) {
      if (!allowDirectSave) refuse('save on the direct damage/healing part (only a damage-only single-target immediate spell reads it; next to another part, on an area or on healing, its scope awaits a creator decision)');
      const read = directSave.fromWizard(e);
      if (typeof read === 'string') refuse(read);
      const unanswered = directSave.policyRefusal(read);
      if (unanswered) throw Error(unanswered);
      save = read;
    }
    if (e.resolution !== 'DICE' || (e.globalResolution !== undefined && e.globalResolution !== e.resolution) || e.canCrit || (!save && (e.savingThrow || e.partialEffect))) refuse('resolution / critical / save');
    for (const k of ['canCrit', ...(save ? [] : ['partialEffect']), 'hasDotEffect', 'hasHotEffect', 'hasShieldEffect']) if (e[k] !== undefined && e[k] !== false) refuse(k);
    for (const k of ['criticalConfig', 'chanceOnHitConfig', ...(save ? [] : ['savingThrowConfig'])]) disabled(e[k], k);
    if (kind === 'damage' ? e.damageType !== 'direct' || e.hasDotEffect || e.secondaryElementType : e.healingType !== 'direct' || e.hasHotEffect || e.hasShieldEffect || !empty(e.specialEffects)) refuse('direct effect required');
    if (allowScaling) {
      const stats = Object.fromEntries(formulaContract.ATTRIBUTES.map(name => [name, 10]));
      const result = allowDeterministic ? formulaContract.readFormula(e.formula, stats, { integerScaling: true, missingHealth: { current: 0, max: 0 }, allowZeroDice: true }) : allowHealth ? readHealthFormula(e.formula, stats, { current: 0, max: 0 }) : readScaledFormula(e.formula, stats);
      if (!result.supported) refuse(`effect.formula (${result.reason})`);
    } else readFormula(e.formula);
    const damageTypes = kind === 'damage' ? e.damageTypes || [e.elementType] : [];
    if (kind === 'damage' && e.elementType && canonical(damageTypes) !== canonical([e.elementType])) refuse('damageTypes');
    if (kind === 'damage' && d.typeConfig.school && canonical(damageTypes) !== canonical([d.typeConfig.school]) &&
        !(allowHunterFlowSchool && d.typeConfig.school === 'primal' && canonical(damageTypes) === '["stabbing"]')) refuse('school / damage type conflict');
    if (kind === 'damage' && record.damageTypes !== undefined && canonical(record.damageTypes) !== canonical(damageTypes)) refuse('outer damageTypes');
    const read = kind === 'damage' ? { kind, formula: e.formula, damageTypes } : { kind, formula: e.formula };
    // The save is returned beside the part, never inside it, so every existing caller's part shape stays byte-identical.
    if (save) Object.defineProperty(read, 'directSave', { value: save, enumerable: false });
    return read;
}
const actionId = ref => `authored:${ref.definitionId}:${ref.definitionVersion}:${ref.definitionHash}`;
const isAuthored = spell => String(spell?.definitionId || spell?.id || '').startsWith('authored:');
// A6: eligibility is explicit targeting, never an inference from range zero. Ally stays manual.
function creatureSelfHealing(definition, record) {
  const targetType = record?.authoredDraft?.healingConfig?.targetType;
  return definition?.effect?.kind === 'healing' && ['self', 'any'].includes(definition?.targeting?.restriction) &&
    (targetType === undefined || ['self', 'any'].includes(targetType));
}
// Owner-PC self-healing: explicit self restriction at range 0, immediate healing only, existing AP/mana costs, no cooldown or missing-health scaling.
function ownerSelfHealing(definition) {
  if (!definition || definition.effect?.kind !== 'healing' || definition.targeting?.kind !== 'single' ||
      definition.targeting?.restriction !== 'self' || definition.targeting?.rangeFeet !== 0 ||
      definition.cooldown !== undefined || definition.catalogueSource !== undefined ||
      definition.classPayment !== undefined || definition.targetRoute !== undefined) return false;
  if (definition.capability === undefined || definition.capability === FORMULA_CAPABILITY) return true;
  if (definition.capability === DETERMINISTIC_CAPABILITY) {
    const stats = Object.fromEntries(formulaContract.ATTRIBUTES.map(name => [name, 10]));
    const reading = readDeterministicFormula(definition.effect.formula, stats, { current: 0, max: 0 });
    return reading.supported === true && reading.readsHealth !== true;
  }
  return false;
}
// Shared G3/G3a square-grid geometry for client preview and authoritative server resolution.
const CREATURE_SIZE_FOOTPRINTS = Object.freeze({
  tiny: Object.freeze({ width: 1, height: 1 }),
  small: Object.freeze({ width: 1, height: 1 }),
  medium: Object.freeze({ width: 1, height: 1 }),
  large: Object.freeze({ width: 2, height: 2 }),
  huge: Object.freeze({ width: 3, height: 3 }),
  gargantuan: Object.freeze({ width: 4, height: 4 }),
  colossal: Object.freeze({ width: 5, height: 5 })
});
function footprintFromSize(size) {
  if (typeof size !== 'string') return null;
  return CREATURE_SIZE_FOOTPRINTS[size.trim().toLowerCase()] || null;
}
function catalogCreatureForToken(token, creatures) {
  if (!token || !token.creatureId || !creatures) return null;
  if (Array.isArray(creatures)) {
    return creatures.find(function (c) { return c && c.id === token.creatureId; }) || null;
  }
  if (typeof creatures === 'object' && Object.prototype.hasOwnProperty.call(creatures, token.creatureId)) {
    return creatures[token.creatureId] || null;
  }
  return null;
}
function hasKnownTokenFootprint(token, creatures) {
  if (token && token.footprint && Number.isSafeInteger(token.footprint.width) && Number.isSafeInteger(token.footprint.height) &&
      token.footprint.width > 0 && token.footprint.width <= 5 && token.footprint.height > 0 && token.footprint.height <= 5) {
    return true;
  }
  if (footprintFromSize(token && token.size) || footprintFromSize(token && token.stats && token.stats.size)) {
    return true;
  }
  const found = catalogCreatureForToken(token, creatures);
  return Boolean(footprintFromSize(found && found.size));
}
function tokenFootprintForArea(token, creatures) {
  if (token && token.footprint && Number.isSafeInteger(token.footprint.width) && Number.isSafeInteger(token.footprint.height)) {
    return token.footprint;
  }
  const direct = footprintFromSize(token && token.size) || footprintFromSize(token && token.stats && token.stats.size);
  if (direct) return direct;
  const found = catalogCreatureForToken(token, creatures);
  const catSize = footprintFromSize(found && found.size);
  if (catSize) return catSize;
  return CREATURE_SIZE_FOOTPRINTS.medium;
}
function getFootprintTiles(ax, ay, footprint) {
  const f = footprint || { width: 1, height: 1 };
  const width = Math.max(1, Math.floor(typeof f === 'number' ? f : (f.width || 1)));
  const height = Math.max(1, Math.floor(typeof f === 'number' ? f : (f.height || 1)));
  const minDx = -Math.floor(width / 2);
  const minDy = -Math.floor(height / 2);
  const tiles = [];
  for (let dy = 0; dy < height; dy += 1) {
    for (let dx = 0; dx < width; dx += 1) {
      tiles.push({ x: ax + minDx + dx, y: ay + minDy + dy });
    }
  }
  return tiles;
}
function occupiedGridCells(position, footprint, gridSize, offsetX, offsetY) {
  const ox = offsetX === undefined ? 0 : offsetX;
  const oy = offsetY === undefined ? 0 : offsetY;
  if (![position && position.x, position && position.y, gridSize, ox, oy].every(Number.isFinite) || gridSize <= 0 ||
      ![footprint && footprint.width, footprint && footprint.height].every(function (n) { return Number.isSafeInteger(n) && n > 0 && n <= 5; })) {
    return null;
  }
  const x = Math.floor((position.x - ox) / gridSize);
  const y = Math.floor((position.y - oy) / gridSize);
  if (Math.abs(position.x - (ox + (x + 0.5) * gridSize)) > gridSize * 1e-8 ||
      Math.abs(position.y - (oy + (y + 0.5) * gridSize)) > gridSize * 1e-8) {
    return null;
  }
  return getFootprintTiles(x, y, footprint);
}
function circleCellOverlap(origin, radius, cell, gridSize, offsetX, offsetY) {
  const ox = offsetX === undefined ? 0 : offsetX;
  const oy = offsetY === undefined ? 0 : offsetY;
  if (![origin && origin.x, origin && origin.y, radius, cell && cell.x, cell && cell.y, gridSize, ox, oy].every(Number.isFinite) || radius <= 0 || gridSize <= 0) return 'manual';
  const x = ox + cell.x * gridSize;
  const y = oy + cell.y * gridSize;
  const distance = Math.hypot(origin.x - Math.max(x, Math.min(origin.x, x + gridSize)),
    origin.y - Math.max(y, Math.min(origin.y, y + gridSize)));
  const epsilon = gridSize * 1e-8;
  return distance < radius - epsilon ? 'candidate' : distance <= radius + epsilon ? 'edge' : 'outside';
}
/** Analytic 2D rectangle-vs-cell SAT overlap for Line AoE. Boundary/tangent contact alone returns 'edge' (G3/G3a). */
function lineCellOverlap(origin, target, length, width, cell, gridSize, offsetX, offsetY) {
  const ox = offsetX === undefined ? 0 : offsetX;
  const oy = offsetY === undefined ? 0 : offsetY;
  if (![origin && origin.x, origin && origin.y, target && target.x, target && target.y, length, width, cell && cell.x, cell && cell.y, gridSize, ox, oy].every(Number.isFinite) ||
      length <= 0 || width <= 0 || gridSize <= 0) {
    return 'manual';
  }
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dist = Math.hypot(dx, dy);
  const epsilon = gridSize * 1e-8;
  if (dist <= epsilon) return 'manual';
  const ux = dx / dist;
  const uy = dy / dist;
  const vx = -uy;
  const vy = ux;
  const halfW = width / 2;
  const x0 = ox + cell.x * gridSize;
  const y0 = oy + cell.y * gridSize;
  const x1 = x0 + gridSize;
  const y1 = y0 + gridSize;

  // Line rectangle corners in world coordinates
  const l0x = origin.x + vx * halfW, l0y = origin.y + vy * halfW;
  const l1x = origin.x - vx * halfW, l1y = origin.y - vy * halfW;
  const endX = origin.x + ux * length, endY = origin.y + uy * length;
  const l2x = endX - vx * halfW, l2y = endY - vy * halfW;
  const l3x = endX + vx * halfW, l3y = endY + vy * halfW;

  const minLx = Math.min(l0x, l1x, l2x, l3x);
  const maxLx = Math.max(l0x, l1x, l2x, l3x);
  const minLy = Math.min(l0y, l1y, l2y, l3y);
  const maxLy = Math.max(l0y, l1y, l2y, l3y);

  const overlapX = Math.min(maxLx, x1) - Math.max(minLx, x0);
  const overlapY = Math.min(maxLy, y1) - Math.max(minLy, y0);

  // Project cell corners relative to line origin onto (ux, uy) and (vx, vy)
  const c0dx = x0 - origin.x, c0dy = y0 - origin.y;
  const c1dx = x1 - origin.x, c1dy = y0 - origin.y;
  const c2dx = x1 - origin.x, c2dy = y1 - origin.y;
  const c3dx = x0 - origin.x, c3dy = y1 - origin.y;

  const u0 = c0dx * ux + c0dy * uy, u1 = c1dx * ux + c1dy * uy, u2 = c2dx * ux + c2dy * uy, u3 = c3dx * ux + c3dy * uy;
  const v0 = c0dx * vx + c0dy * vy, v1 = c1dx * vx + c1dy * vy, v2 = c2dx * vx + c2dy * vy, v3 = c3dx * vx + c3dy * vy;

  const overlapU = Math.min(length, Math.max(u0, u1, u2, u3)) - Math.max(0, Math.min(u0, u1, u2, u3));
  const overlapV = Math.min(halfW, Math.max(v0, v1, v2, v3)) - Math.max(-halfW, Math.min(v0, v1, v2, v3));

  const minOverlap = Math.min(overlapX, overlapY, overlapU, overlapV);
  if (minOverlap < -epsilon) return 'outside';
  if (minOverlap <= epsilon) return 'edge';
  return 'candidate';
}
// One display summary for every installed/mapped definition shape (immediate, A7 condition, A10 bundle, M6A area, passive entry).
function definitionSummary(d) {
  if (!d) return '';
  if (d.capability === CHANNELED_CAPABILITY) return authoredChanneled.describe(authoredChanneled.termsFor(d));
  if (d.capability === OUTCOME_CAPABILITY) return randomOutcome.describeOutcomeTable(d.outcomeTable);
  if (d.capability === PASSIVE_ENTRY_CAPABILITY) return `Passive (${d.targeting.radiusFeet} ft radius, ${d.targeting.restriction} moves in) · ${require('./authoredEffect').describe({ direct: null, condition: d.effects.condition, timing: d.timing })}`;
  if (d.capability === PASSIVE_TURN_CAPABILITY) return `Passive (${d.trigger.kind === 'turn_start' ? 'Turn Start' : 'Turn End'}, ${d.trigger.whoseTurn}) · ${require('./authoredEffect').describe({ direct: null, condition: d.effects.condition, timing: d.timing })}`;
  if (d.capability === EFFECT_CAPABILITY) return require('./authoredEffect').describe(require('./authoredEffect').termsFor(d));
  if (d.effect?.kind === 'condition') return `canonical Stunned · ${d.timing.durationText} — GM removes`;
  if (d.capability === AREA_CAPABILITY) {
    if (d.targeting?.aoeShape === 'line') {
      return `${d.effect?.kind} · ${d.effect?.formula}${d.effect?.damageTypes?.length ? ` ${d.effect.damageTypes.join('/')}` : ''} · line ${d.targeting?.lengthFeet}×${d.targeting?.widthFeet} ft (up to ${d.targeting?.maxTargets} creatures)`;
    }
    return `${d.effect?.kind} · ${d.effect?.formula}${d.effect?.damageTypes?.length ? ` ${d.effect.damageTypes.join('/')}` : ''} · circle ${d.targeting?.radiusFeet} ft (up to ${d.targeting?.maxTargets} creatures)`;
  }
  return `${d.effect?.kind} · ${d.effect?.formula}${d.effect?.damageTypes?.length ? ` ${d.effect.damageTypes.join('/')}` : ''}`;
}
module.exports = { HEALTH_CAPABILITY, HEALTH_COMPILER, readHealthFormula, isHealth, definitionSummary, CAPABILITY, FORMULA_CAPABILITY, FORMULA_COMPILER, AREA_CAPABILITY, AREA_COMPILER, MAX_AREA_TARGETS, MAX_AREA_ACTORS, AREA_ROLL_PROCEDURE, AREA_ROLL_POLICY, AREA_ROLL_UNAPPROVED_REASON, isAreaRollProcedureApproved, setAreaRollProposalForTest, setAreaRollApprovalForTest, readScaledFormula, formulaAttributes, isFormula, isArea, CONDITION_CAPABILITY, EFFECT_CAPABILITY, EFFECT_EXPIRY_POLICIES, COUNTED_EXPIRY_POLICIES, PASSIVE_ENTRY_CAPABILITY, PASSIVE_ENTRY_COMPILER, PASSIVE_ENTRY_TRIGGER_ID, PASSIVE_ENTRY_TRIGGER, PASSIVE_ENTRY_OPEN_RULES, isPassiveEntry, passiveEntryTriggerFor, PASSIVE_TURN_CAPABILITY, PASSIVE_TURN_COMPILER, PASSIVE_TURN_TRIGGER_IDS, PASSIVE_TURN_WHOSE_VALUES, PASSIVE_TURN_TRIGGER, isPassiveTurn, passiveTurnTriggerFor, ADAPTER_VERSION, CLASS_IDS, FOLLOWUP_TRIGGER, FOLLOWUP_TRIGGER_ID, FOLLOWUP_HEALING_TRIGGER, FOLLOWUP_HEALING_TRIGGER_ID, FOLLOWUP_MARKERS, followUpTrigger, followUpTriggerFor, COMPONENT_WATCH, COMPONENT_WATCH_PARTS, COMPONENT_WATCH_PLACEMENTS, componentWatchPlacement, COMPONENT_WATCH_CONDITIONS, componentWatchShape, SELECTION_METHODS, CRIT_GATE_TRIGGER_ID, CRIT_GATE_SPEC, critGateShape, evaluateLowestHealthCandidates, readFormula, definitionFromWizard, actionId, isAuthored, creatureSelfHealing, ownerSelfHealing };
/** Creature-source eligibility of an already definition-compatible ability: null, or the exact refusal the room server applies at
 * creature admission and at every approval. Single source for server admission and the Bestiary card; the server stays the authority. */
function creatureSourceRefusal(d) {
  if (!d) return null;
  if (d.capability === OUTCOME_CAPABILITY) { return { code: 'unsupported_source_route', reason: 'Outcome-branched spells currently require a primary owner PC source; the whole creature ability remains manual.' }; }
  if (d.capability === PASSIVE_ENTRY_CAPABILITY) { return { code: 'unsupported_source_route', reason: 'Authored passive movement-entry abilities currently require a primary owner PC source.' }; }
  if (d.capability === PASSIVE_TURN_CAPABILITY) { return { code: 'unsupported_source_route', reason: 'Authored passive turn-boundary abilities currently require a primary owner PC source.' }; }
  if (d.targeting && d.targeting.selectionMethod === 'lowest_health') { return { code: 'unsupported_source_route', reason: 'Lowest-health target selection currently requires a primary owner PC source; the whole creature ability remains manual.' }; }
  if (d.capability === EFFECT_CAPABILITY && d.effects && d.effects.critGate !== undefined) { return { code: 'unsupported_source_route', reason: 'A critical-hit gated follow-up currently requires a primary owner PC source; the whole creature ability remains manual.' }; }
  if (d.componentWatch !== undefined) { return { code: 'unsupported_source_route', reason: 'A watched part trigger currently requires a primary owner PC source; the whole creature ability remains manual.' }; }
  if (d.capability === undefined && d.save !== undefined) { return { code: 'unsupported_source_route', reason: 'A GM-recorded save on the Direct Damage part currently requires a primary owner PC source; the whole creature ability remains manual.' }; }
  if (FOLLOWUP_MARKERS.includes(d.followUp)) { return { code: 'unsupported_source_route', reason: 'An authored follow-up trigger currently requires a primary owner PC source; the whole creature ability remains manual.' }; }
  if ([FORMULA_CAPABILITY, HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY, AREA_CAPABILITY].includes(d.capability)) return { code: 'unsupported_source_route', reason: 'This formula version currently requires a primary owner PC source; the whole creature ability remains manual.' };
  if (d.capability === EFFECT_CAPABILITY && d.effects && d.effects.save !== undefined) return { code: 'unsupported_source_route', reason: 'A GM-recorded save branch currently requires a primary owner PC source; the whole creature ability remains manual.' };
  if (d.capability === EFFECT_CAPABILITY && d.effects && d.effects.direct && d.effects.condition && d.effects.condition.kind === 'periodic') return { code: 'unsupported_source_route', reason: 'An immediate + periodic ability currently requires a primary owner PC source; the whole creature ability remains manual.' };
  // Formula riders: owner-attested caster scores exist only for a primary owner PC source.
  if (d.capability === EFFECT_CAPABILITY && d.effects && d.effects.direct && formulaAttributes(d.effects.direct.formula).length) {return { code: 'unsupported_source_route', reason: 'An attribute-scaled immediate part currently requires a primary owner PC source; the whole creature ability remains manual.' };}
  // Effect cooldowns: the caster-start cooldown is keyed and released on a primary owner PC's turn starts only.
  if (d.cooldown !== undefined) {return { code: 'unsupported_source_route', reason: 'A caster-start cooldown currently requires a primary owner PC source; the whole creature ability remains manual.' };}
  return null;
}

/** Direct-damage save: the admitted save term an immediate approval must carry (null for every other definition). */
const directSaveOf = definition => (definition && definition.capability === undefined && definition.save !== undefined ? definition.save : null);
Object.assign(module.exports, { DETERMINISTIC_CAPABILITY, DETERMINISTIC_COMPILER, readDeterministicFormula, isDeterministic, isFormulaBundle, FORMULA_BUNDLE_CONDITIONS, creatureSourceRefusal, directSaveOf, FLOW_CAPABILITY, FLOW_COMPILER, isHunterFlow, OUTCOME_CAPABILITY, OUTCOME_COMPILER, isOutcome, CHANNELED_CAPABILITY, CHANNELED_COMPILER, isChanneled, CREATURE_SIZE_FOOTPRINTS, footprintFromSize, hasKnownTokenFootprint, tokenFootprintForArea, getFootprintTiles, occupiedGridCells, circleCellOverlap, lineCellOverlap });
