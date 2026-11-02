import { readScaledFormula, readFormula, definitionFromWizard, FORMULA_CAPABILITY, actionId } from '../authoredAbility';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { recordRoll, buildApproval } from '../spellConsequence';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';

test('real catalogue formulas calculate full scores and preserve unsupported whole mechanics', () => {
  const { CLASS_DATA_MAP } = require('../../data/classSpellGenerator');
  const examples = [['Berserker', 'bsk_unstoppable_onslaught', 6, 8, 'strength'], ['Lunarch', 'lunarch_apogee_cataclysm', 6, 8, 'intelligence']];
  for (const [className, id, count, sides, attr] of examples) {
    const spell = CLASS_DATA_MAP[className].spells.find(s => s.id === id), before = JSON.stringify(spell);
    const reading = readScaledFormula(spell.damageConfig.formula, { [attr]: 18 });
    expect(reading).toMatchObject({ supported: true, dice: [{ count, sides }], constant: 36 });
    expect(recordRoll('physical', reading, [Array(count).fill(1)]).total).toBe(count + 36);
    expect(require('../spellConsequence').supportSpell(spell, { class: className }).supported).toBe(false);
    expect(JSON.stringify(spell)).toBe(before);
  }
  const shield = CLASS_DATA_MAP.Martyr.spells.find(s => s.id === 'martyr_shield_of_faith');
  expect(readScaledFormula(shield.buffConfig.effects[0].shieldValue.formula, { spirit: 18 }).constant).toBe(36);
  expect(require('../spellConsequence').supportSpell(shield, { class: 'Martyr' }).supported).toBe(false);
});
test('closed syntax, explicit modifier/floor, bounds and invalid inputs', () => {
  expect(readScaledFormula('1d8 + (intelligence * 2) - intelligence_modifier + intelligence/4', { intelligence: 19 })).toMatchObject({ supported: true, constant: 38 });
  for (const formula of ['1d8 + intelligence * 1.5', '(maxHealth - currentHealth)/4', '1d8/2', '1d8 + target.strength', '1d8 + str*2', '1d8 + intelligence*0', '1d8 + intelligence*11', '1d8 + (intelligence+2)', '1d8;alert(1)', '25d6+26d6', '1d8+10001', '1d8++2']) expect(readScaledFormula(formula, { intelligence: 18 }).supported).toBe(false);
  for (const value of [undefined, null, '18', NaN, Infinity, -1, 18.5, 1001]) expect(readScaledFormula('1d8 + intelligence * 2', { intelligence: value }).supported).toBe(false);
  expect(() => readFormula('1d8+intelligence*2')).toThrow();
});
test('whole Wizard roundtrip selects immutable v2, installed client calculation agrees with server and approval captures source state', () => {
  const d = { name: 'Authored Scaling', description: 'Direct healing', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['healing'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } }, healingConfig: { healingType: 'direct', resolution: 'DICE', formula: '1d8 + intelligence * 2' } };
  const reopened = deserializeSpell(serializeSpell(d));
  const record = { ...reopened, authoredDefinitionId: '11111111-1111-4111-8111-111111111111', authoredDraft: reopened };
  const mapped = definitionFromWizard(record, { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 });
  expect(mapped).toMatchObject({ ok: true, definition: { schemaVersion: 4, capability: FORMULA_CAPABILITY } });
  const compiled = require('../../../../server/services/installedDefinitionRegistry').compileDefinition(mapped.definition);
  expect(compiled.ok).toBe(true); const ref = compiled.descriptor.definitionRef;
  replaceAuthoredRegistry('r', [{ definitionRef: ref, canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor }]);
  const support = authoredSupport(actionId(ref), 'r', 'Arcanoneer', { intelligence: 18 });
  expect(support.reading).toEqual(require('../../../../server/shared/services/authoredAbility').readScaledFormula(d.healingConfig.formula, { intelligence: 18 }));
  const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' }, target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
  const pc = { id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', actionPoints: { current: 4 }, mana: { current: 10 } }, state: { actorContract: { version: 1, ...source, revision: 3, primary: true } } }, foe = { id: 'foe', mapId: 'm', state: { actorContract: { version: 1, ...target, revision: 0 } } };
  const approval = buildApproval({ support, tokens: [pc, foe], sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll: recordRoll('physical', support.reading, [[4]]), approvalId: 'a' });
  expect(approval).toMatchObject({ formulaSourceRevision: 3, rollAttributes: { intelligence: 18 }, roll: { total: 40 } });
  expect(approval.formulaSourceHash).toMatch(/^[a-f0-9]{64}$/);
});
