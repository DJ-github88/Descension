/** P14-A2 producer only. Stored content is the same whole Wizard record consumed by A1. */
import { definitionFromWizard } from './authoredAbility';
const clone = value => JSON.parse(JSON.stringify(value));
const ordered = value => value && typeof value === 'object' ? Array.isArray(value) ? value.map(ordered) : Object.fromEntries(Object.keys(value).sort().map(k => [k, ordered(value[k])])) : value;
const context = { roomId: 'item-preview', definitionVersion: 1, classId: 'arcanoneer' };
function itemAbilitySupport(association) {
  if (association?.schemaVersion !== 1 || !association.record) return { ok: false, reason: 'Missing preserved ability content or unsupported association version. Keep the original data for GM review.' };
  return definitionFromWizard(association.record, context);
}
function snapshotAbility(record, librarySpellId = null) {
  return { schemaVersion: 1, record: clone(record), librarySpellId };
}
function newItemAbility(id) {
  const draft = { name: 'New activated ability', description: '', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
    effectTypes: ['damage'], damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6', resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: 1, mana: 0 } };
  return snapshotAbility({ ...clone(draft), authoredDefinitionId: id, authoredDraft: draft });
}
function editItemAbility(association, values) {
   const support = itemAbilitySupport(association);
   if (!support.ok) throw Error('This whole definition stays manual. Use the advanced Spell Wizard to author a separate supported definition.');
   if (support.definition.effect.kind === 'condition' && values.kind === 'condition' &&
       values.name === support.definition.name && values.description === support.definition.description &&
       values.ap === support.definition.resourceCost.actionPoints && values.mana === support.definition.resourceCost.mana &&
       values.range === support.definition.targeting.rangeFeet && values.restriction === support.definition.targeting.restriction &&
       JSON.stringify(ordered(values.authoredCondition)) === JSON.stringify(ordered(association.record.authoredDraft.controlConfig.authoredCondition))) return clone(association);
  const next = clone(association), r = next.record, d = r.authoredDraft, kind = values.kind;
   if (!['damage', 'healing', ...(support.definition.effect.kind === 'condition' ? ['condition'] : [])].includes(kind)) throw Error('Choose a compatible effect.');
  d.name = values.name; d.description = values.description;
   d.effectTypes = [kind === 'condition' ? 'control' : kind];
   if (kind === 'condition') d.controlConfig = { authoredCondition: clone(values.authoredCondition) };
   else {
  const configKey = kind === 'damage' ? 'damageConfig' : 'healingConfig';
  d[configKey] = { ...(d[configKey] || {}), formula: values.formula, resolution: 'DICE' };
  if (d[configKey].globalResolution !== undefined) d[configKey].globalResolution = 'DICE';
  if (kind === 'damage') {
    Object.assign(d.damageConfig, { damageType: 'direct', elementType: values.damageType });
    if (d.damageConfig.damageTypes) d.damageConfig.damageTypes = [values.damageType];
    d.typeConfig.school = values.damageType;
    delete d.healingConfig;
    if (r.damageTypes !== undefined) r.damageTypes = [values.damageType];
  } else { d.healingConfig.healingType = 'direct'; delete d.damageConfig; delete r.damageTypes; }
  if (d.effectsMap) d.effectsMap = Object.fromEntries(Object.keys(d.effectsMap).concat(kind).map(k => [k, k === kind]));
   if (d.effectResolutions) d.effectResolutions = { [kind]: 'DICE' };
   }
  d.resourceCost = { ...d.resourceCost, actionPoints: values.ap, mana: values.mana };
  if (d.resourceCost.resourceValues) d.resourceCost.resourceValues = { ...d.resourceCost.resourceValues, actionPoints: values.ap, mana: values.mana };
  d.targetingConfig = { ...d.targetingConfig, rangeDistance: values.range, targetRestrictions: [values.restriction] };
  if (d.targetingConfig.targetRestriction) d.targetingConfig.targetRestriction = values.restriction;
   for (const key of ['name', 'description', 'effectTypes', 'effectsMap', 'effectResolutions', 'damageConfig', 'healingConfig', 'controlConfig', 'resourceCost', 'targetingConfig', 'typeConfig']) {
    if (d[key] === undefined) delete r[key]; else r[key] = clone(d[key]);
  }
  if (r.serializedData !== undefined) r.serializedData = JSON.stringify(d);
  const checked = itemAbilitySupport(next);
  if (!checked.ok) throw Error(checked.reason);
  if (!values.name.trim() || values.name.length > 120 || values.description.length > 4000) throw Error('Enter an ability name (up to 120 characters) and description (up to 4000).');
  return next;
}
function matchingItemVersions(association, entries, roomId) {
  if (!itemAbilitySupport(association).ok) return [];
  return entries.filter(e => {
    if (e.definitionRef.definitionId !== association.record.authoredDefinitionId || e.definitionRef.roomId !== roomId) return false;
    const mapped = definitionFromWizard(association.record, { roomId, definitionVersion: e.definitionRef.definitionVersion, classId: e.canonicalDefinition.binding.classId });
    return mapped.ok && JSON.stringify(ordered(mapped.definition)) === JSON.stringify(ordered(e.canonicalDefinition));
  });
}
export { clone, snapshotAbility, newItemAbility, editItemAbility, itemAbilitySupport, matchingItemVersions };
