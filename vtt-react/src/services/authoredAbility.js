/** P14-A1 pure whole-Wizard adapter. Shared by server admission and authoring diagnostics.
 * No RNG, storage, authority or execution. Unknown mechanics refuse instead of being stripped. */
const CAPABILITY = 'authored-immediate:v1';
const ADAPTER_VERSION = 'p14-a1-wizard-1';
const CLASS_IDS = ['arcanoneer', 'berserker', 'shaper', 'harbinger', 'chronarch', 'inquisitor', 'revenant', 'false_prophet', 'gambit', 'apex', 'animist', 'lunarch', 'martyr', 'minstrel', 'plaguebringer', 'pyrofiend', 'spellguard', 'toxicologist', 'warden', 'augur', 'crusader'];
const FORMULA = /^([1-9][0-9]?)d([1-9][0-9]{0,2})(?:([+-])([1-9][0-9]{0,4}))?$/;
const canonical = value => JSON.stringify(value && typeof value === 'object' ? Array.isArray(value) ? value.map(v => JSON.parse(canonical(v))) : Object.fromEntries(Object.keys(value).sort().map(k => [k, JSON.parse(canonical(value[k]))])) : value);
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
const effective = (key, value) => empty(value) || (key === 'triggerConfig' && canonical(value) === canonical(defaultTriggers)) ? null : value;
function definitionFromWizard(record, { roomId, definitionVersion, classId }) {
  try {
    const d = record?.authoredDraft;
    if (!d || typeof d !== 'object') refuse('Whole Wizard draft unavailable; reopen, review and save it in the Wizard');
    const fields = ['name', 'description', 'level', 'school', 'icon', 'spellType', 'typeConfig', 'effectTypes', 'effectsMap', 'damageConfig', 'healingConfig', 'buffConfig', 'debuffConfig', 'utilityConfig', 'controlConfig', 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', 'rollableTable', 'effectResolutions', 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'targetingConfig', 'targetingMode', 'targetingTags', 'effectTargeting', 'durationConfig', 'persistentConfig', 'propagation', 'resourceCost', 'mechanicsConfig', 'prophecyOptions', 'cooldownConfig', 'triggerConfig', 'trapConfig', 'channelingConfig', 'errors', 'warnings', 'currentStep', 'completedSteps', 'wizardFlow', 'lastModified', 'isValid', 'validation', 'tags', 'id', 'dateCreated', 'serializedData', 'humanReadable', 'gameCode', 'authoredDraft', 'authoredDefinitionId', 'effectType', 'damageTypes', 'statusEffectsConfig'];
    only(d, fields, 'draft fields');
    only(record, [...fields, 'categoryIds', 'categories', 'source', 'isCustom', 'isUserCreated', 'createdAt', 'updatedAt', 'userId', 'lastSaved'], 'library fields');
    for (const key of new Set([...Object.keys(d), ...Object.keys(record)])) {
      if (key === 'targetingConfig' || !(/Config$|^effectsMap$|^effectTypes$|^effectResolutions$|^effectTargeting$|^effectMechanicsConfigs$|^mechanics|^combined|^propagation$|^resourceCost$|^rollableTable$|^prophecyOptions$|^spellType$|^name$|^description$|^targetingMode$|^targetingTags$|^statusEffectsConfig$/.test(key))) continue;
      if (canonical(effective(key, record[key])) !== canonical(effective(key, d[key]))) refuse(`library/draft ${key}`);
    }
    if (record.serializedData !== undefined) {
      const serialized = JSON.parse(record.serializedData);
      delete serialized.authoredDraft;
      if (canonical(serialized) !== canonical(d)) refuse('serializedData/draft');
    }
    if (d.spellType !== 'ACTION' || d.typeConfig?.castTimeType !== 'IMMEDIATE') refuse('Immediate ACTION required');
    only(d.typeConfig, ['school', 'secondaryElement', 'icon', 'tags', 'castTime', 'castTimeType', 'element'], 'typeConfig');
    if (d.typeConfig.secondaryElement) refuse('secondaryElement');
    if (d.typeConfig.castTime !== undefined && d.typeConfig.castTime !== 0) refuse('conflicting cast time');
    const kind = canonical(d.effectTypes) === '["damage"]' ? 'damage' : canonical(d.effectTypes) === '["healing"]' ? 'healing' : null;
    if (!kind) refuse('Exactly one damage or healing effect required');
    if (!empty(d.effectsMap) && (Object.entries(d.effectsMap).some(([k, v]) => typeof v !== 'boolean' || v !== (k === kind)) || d.effectsMap[kind] !== true)) refuse('effectsMap');
    for (const key of ['buffConfig', 'debuffConfig', 'utilityConfig', 'controlConfig', 'summoningConfig', 'transformationConfig', 'purificationConfig', 'restorationConfig', 'rollableTable', 'effectMechanicsConfigs', 'mechanicsAvailableEffects', 'combinedEffects', 'mechanicsAvailableCombinedEffects', 'effectTargeting', 'targetingTags', 'persistentConfig', 'prophecyOptions', 'trapConfig', 'channelingConfig', 'statusEffectsConfig']) if (!empty(d[key])) refuse(key);
    if (!empty(d.propagation)) {
      only(d.propagation, ['method', 'behavior', 'parameters'], 'propagation');
      if (d.propagation.method !== 'none' || d.propagation.behavior !== '') refuse('propagation');
      only(d.propagation.parameters, ['count', 'range', 'decay', 'secondaryRadius', 'spreadRate', 'forkCount'], 'inactive propagation parameters');
      if (Object.values(d.propagation.parameters).some(v => !int(v, 10000))) refuse('inactive propagation parameters');
    }
    if (!empty(d[kind === 'damage' ? 'healingConfig' : 'damageConfig'])) refuse('mixed effect configuration');
    if (d.targetingMode !== undefined && d.targetingMode !== 'unified') refuse('targetingMode');
    if (!empty(d.durationConfig) && canonical(d.durationConfig) !== '{"durationType":"instant"}') refuse('durationConfig');
    const mech = d.mechanicsConfig;
    if (!empty(mech) && canonical(mech) !== canonical({ cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } })) refuse('mechanicsConfig');
    if (!empty(d.triggerConfig)) {
      const t = d.triggerConfig;
      only(t, ['global', 'effectTriggers', 'conditionalEffects', 'buffDebuffTriggers', 'requiredConditions', 'triggerRole'], 'triggerConfig');
      if (canonical(t.global) !== canonical({ logicType: 'AND', compoundTriggers: [] }) || !empty(t.effectTriggers) || !empty(t.conditionalEffects) || !empty(t.buffDebuffTriggers) || canonical(t.requiredConditions) !== canonical({ enabled: false, logicType: 'AND', conditions: [] }) || canonical(t.triggerRole) !== canonical({ mode: 'CONDITIONAL' })) refuse('triggers');
    }
    const cd = d.cooldownConfig;
    if (!empty(cd)) {
      only(cd, ['cooldownType', 'cooldownValue'], 'cooldownConfig');
      if (cd.cooldownType !== 'none' || cd.cooldownValue !== 0) refuse('cooldownConfig');
    }
    const cost = d.resourceCost;
    only(cost, ['actionPoints', 'actionPointsSelected', 'mana', 'components', 'materialComponents', 'resourceTypes', 'resourceValues', 'resourceFormulas', 'useFormulas', 'primaryResourceType'], 'resourceCost');
    for (const k of ['resourceValues', 'useFormulas']) if (cost[k] !== undefined) only(cost[k], ['mana', 'actionPoints'], `resourceCost.${k}`);
    if (!int(cost.actionPoints, 20) || !empty(cost.components) || (cost.materialComponents !== undefined && cost.materialComponents !== '') || !empty(cost.resourceFormulas) || Object.values(cost.useFormulas || {}).some(v => v !== false)) refuse('Explicit AP price / components / formulas');
    if ((cost.resourceTypes || []).some(t => !['mana', 'actionPoints'].includes(t)) || Object.keys(cost.resourceValues || {}).some(k => !['mana', 'actionPoints'].includes(k)) || (cost.primaryResourceType !== undefined && !['mana', 'actionPoints'].includes(cost.primaryResourceType))) refuse('resource types');
    if (cost.resourceValues?.actionPoints !== undefined && cost.resourceValues.actionPoints !== cost.actionPoints) refuse('conflicting AP encodings');
    const manaValues = [cost.mana, cost.resourceValues?.mana].filter(v => v !== undefined);
    if (!manaValues.length || manaValues.some(v => !int(v, 10000)) || new Set(manaValues).size !== 1) refuse('Explicit mana price');
    const t = d.targetingConfig;
    only(t, ['targetingType', 'rangeType', 'rangeDistance', 'maxTargets', 'targetRestrictions', 'targetRestriction', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior', 'aoeShape', 'aoeType', 'aoeParameters'], 'targetingConfig');
    if (t.targetingType !== 'single' || t.maxTargets !== 1 || !int(t.rangeDistance, 300) || !['ranged', 'melee', 'self', 'touch'].includes(t.rangeType) || !empty(t.aoeParameters) || (t.movementBehavior && t.movementBehavior !== 'static')) refuse('single target / explicit range / count');
    if (record.targetingConfig?.rangeDistance !== t.rangeDistance || record.targetingConfig?.maxTargets !== t.maxTargets) refuse('library/draft targeting');
    only(record.targetingConfig, Object.keys(t).concat(['aoeType', 'aoeShape', 'aoeParameters', 'selectionMethod', 'targetSelectionMethod', 'movementBehavior']), 'outer targeting');
    for (const config of [t, record.targetingConfig]) {
      if (!empty(config.aoeParameters) || (config.movementBehavior !== undefined && config.movementBehavior !== 'static') || (config.aoeShape !== undefined && !['', 'circle'].includes(config.aoeShape)) || (config.aoeType !== undefined && !['', 'sphere', 'circle'].includes(config.aoeType))) refuse('inactive area / movement configuration');
    }
    for (const k of Object.keys(t)) if (canonical(record.targetingConfig[k]) !== canonical(t[k]) && !(['aoeShape', 'aoeType'].includes(k) && t[k] === '')) refuse(`library/draft targeting.${k}`);
    for (const k of ['selectionMethod', 'targetSelectionMethod']) if ((t[k] !== undefined && t[k] !== 'manual') || (record.targetingConfig[k] !== undefined && record.targetingConfig[k] !== 'manual')) refuse(k);
    const restrictions = t.targetRestrictions;
    if (!Array.isArray(restrictions) || restrictions.length !== 1 || !['self', 'ally', 'enemy', 'any'].includes(restrictions[0]) || (t.targetRestriction && t.targetRestriction !== restrictions[0])) refuse('targetRestrictions');
    const e = d[kind === 'damage' ? 'damageConfig' : 'healingConfig'];
    const allowed = ['formula', 'resolution', 'globalResolution', 'description', 'criticalConfig', 'canCrit', 'critMultiplier', 'critDiceOnly', 'chanceOnHitConfig', 'savingThrowConfig', 'savingThrow', 'difficultyClass', 'partialEffect', 'partialEffectFormula'];
    only(e, [...allowed, ...(kind === 'damage' ? ['damageType', 'elementType', 'secondaryElementType', 'damageTypes', 'hasDotEffect', 'dotConfig'] : ['healingType', 'targetType', 'shieldType', 'shieldDuration', 'duration', 'tickFrequency', 'scalingType', 'specialEffects', 'hasHotEffect', 'hasShieldEffect', 'hotFormula', 'shieldFormula'])], `${kind}Config`);
    if (e.resolution !== 'DICE' || (e.globalResolution !== undefined && e.globalResolution !== e.resolution) || e.canCrit || e.savingThrow || e.partialEffect) refuse('resolution / critical / save');
    for (const k of ['canCrit', 'partialEffect', 'hasDotEffect', 'hasHotEffect', 'hasShieldEffect']) if (e[k] !== undefined && e[k] !== false) refuse(k);
    for (const k of ['criticalConfig', 'chanceOnHitConfig', 'savingThrowConfig']) disabled(e[k], k);
    if (kind === 'damage' ? e.damageType !== 'direct' || e.hasDotEffect || e.secondaryElementType : e.healingType !== 'direct' || e.hasHotEffect || e.hasShieldEffect || !empty(e.specialEffects)) refuse('direct effect required');
    if (!empty(d.effectResolutions) && canonical(d.effectResolutions) !== canonical({ [kind]: 'DICE' })) refuse('effectResolutions');
    readFormula(e.formula);
    const damageTypes = kind === 'damage' ? e.damageTypes || [e.elementType] : [];
    if (kind === 'damage' && e.elementType && canonical(damageTypes) !== canonical([e.elementType])) refuse('damageTypes');
    if (kind === 'damage' && d.typeConfig.school && canonical(damageTypes) !== canonical([d.typeConfig.school])) refuse('school / damage type conflict');
    if (kind === 'damage' && record.damageTypes !== undefined && canonical(record.damageTypes) !== canonical(damageTypes)) refuse('outer damageTypes');
    return { ok: true, definition: { schemaVersion: 1, scope: { roomId }, definitionId: record.authoredDefinitionId, definitionVersion,
      name: d.name, description: d.description, binding: { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId }, spellType: 'ACTION', castTimeType: 'IMMEDIATE',
      targeting: { kind: 'single', maxTargets: 1, rangeFeet: t.rangeDistance, restriction: restrictions[0] }, resourceCost: { actionPoints: cost.actionPoints, mana: manaValues[0] },
      effect: kind === 'damage' ? { kind, formula: e.formula, damageTypes } : { kind, formula: e.formula } } };
  } catch (error) { return { ok: false, code: 'unsupported_wizard_record', reason: error.message }; }
}
const actionId = ref => `authored:${ref.definitionId}:${ref.definitionVersion}:${ref.definitionHash}`;
const isAuthored = spell => String(spell?.definitionId || spell?.id || '').startsWith('authored:');
module.exports = { CAPABILITY, ADAPTER_VERSION, CLASS_IDS, readFormula, definitionFromWizard, actionId, isAuthored };
