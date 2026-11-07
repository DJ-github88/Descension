import { readHealthFormula, readScaledFormula, HEALTH_CAPABILITY, FORMULA_CAPABILITY, definitionFromWizard } from '../authoredAbility';
import { authoredSupport, replaceAuthoredRegistry } from '../authoredAbilityRegistry';

const formula = '1d8 + caster_missing_health/4';
test('closed shared grammar: clamp, floor, temp exclusion and aggregate result bounds', () => {
  for (const [current, max, constant] of [[23, 40, 4], [40, 40, 0], [0, 40, 10], [41, 40, 0], [0, 0, 0], [0, 40001, 10000]]) {
    const reading = readHealthFormula(formula, {}, { current, max });
    expect(reading.supported).toBe(true); expect(reading.constant).toBe(constant); expect(reading.dice).toEqual([{ count: 1, sides: 8 }]);
  }
  expect(readHealthFormula(formula, {}, { current: 0, max: 40004 }).supported).toBe(false);
  expect(readHealthFormula('1d8 - caster_missing_health/4 - 1', {}, { current: 0, max: 40000 }).supported).toBe(false);
  expect(readHealthFormula('1d8 - caster_missing_health/4', {}, { current: 0, max: 40000 }).constant).toBe(-10000);
  for (const value of [null, [], { current: 1.5, max: 40 }, { current: -1, max: 40 }, { current: 0, max: Infinity }, { current: 23, max: 40, temp: 9 }]) {
    expect(readHealthFormula(formula, {}, value).supported).toBe(false);
  }
  for (const bad of ['caster_missing_health/4', '1d8+caster_missing_health/0', '1d8+target_missing_health', '1d8+caster_missing_health/1.5', '1d8+(maxHealth-currentHealth)/4', '1d8+caster_missing_health()']) {
    expect(readHealthFormula(bad, {}, { current: 23, max: 40 }).supported).toBe(false);
  }
  expect(readScaledFormula(formula, {}).supported).toBe(false);
  expect(readHealthFormula('1d8 + spirit/4 + caster_missing_health/4', { spirit: 18 }, { current: 23, max: 40 }).constant).toBe(8);
});

test('whole Wizard chooses v3 only for the new route and cached support needs room HP, not sheet stats', () => {
  const d = { name: 'Prism Wound Measure', description: 'One direct healing effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: ['healing'], healingConfig: { healingType: 'direct', formula, resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 3 } };
  const record = { ...d, authoredDraft: d, authoredDefinitionId: '00000000-0000-4000-8000-000000000001' };
  const mapped = definitionFromWizard(record, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
  expect(mapped.ok).toBe(true); expect(mapped.definition.capability).toBe(HEALTH_CAPABILITY);
  replaceAuthoredRegistry('r', [{ canonicalDefinition: mapped.definition, definitionRef: { definitionId: record.authoredDefinitionId, definitionVersion: 1, definitionHash: 'a'.repeat(64) },
    descriptor: { capabilityId: HEALTH_CAPABILITY, price: { ap: 1, mana: 3 } } }]);
  const id = `authored:${record.authoredDefinitionId}:1:${'a'.repeat(64)}`;
  expect(authoredSupport(id, 'r', 'Arcanoneer', { currentHealth: 0, maxHealth: 100 }).supported).toBe(false);
  const support = authoredSupport(id, 'r', 'Arcanoneer', {}, { current: 23, max: 40 });
  expect(support.reading.constant).toBe(4); expect(support.rollHealth).toEqual({ current: 23, max: 40 });
  expect(support.definitionHash.startsWith(HEALTH_CAPABILITY)).toBe(true);
  const area = { ...d, targetingConfig: { ...d.targetingConfig, targetingType: 'area', aoeShape: 'circle', aoeParameters: { radius: 10 } } };
  expect(definitionFromWizard({ ...area, authoredDraft: area }, { roomId: 'r', classId: 'arcanoneer', allowProposedAreaRoll: true }).ok).toBe(false);
  const old = { ...d, healingConfig: { ...d.healingConfig, formula: '1d8 + spirit/4' } };
  expect(definitionFromWizard({ ...old, authoredDraft: old }, { roomId: 'r', classId: 'arcanoneer' }).definition.capability).toBe(FORMULA_CAPABILITY);
});
