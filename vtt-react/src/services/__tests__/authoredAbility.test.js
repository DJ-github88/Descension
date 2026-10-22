import { definitionFromWizard, readFormula, actionId } from '../authoredAbility';
import { replaceAuthoredRegistry, authoredSupport } from '../authoredAbilityRegistry';
import { serializeSpell, deserializeSpell, createSpellTemplate, generateSpellFromTemplate } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import { recordRoll, digitalRoll, planSpellCommand, spellReceipt } from '../spellConsequence';

const draft = () => ({ name: 'Stillwater Thread', description: 'A direct healing ability.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['healing'],
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 0, maxTargets: 1, targetRestrictions: ['any'] },
  resourceCost: { actionPoints: 0, resourceTypes: ['mana', 'actionPoints'], primaryResourceType: 'mana', resourceValues: { mana: 0, actionPoints: 0 } }, healingConfig: { healingType: 'direct', resolution: 'DICE', globalResolution: 'DICE', formula: '1d8+1' } });
const record = d => ({ ...d, authoredDefinitionId: '11111111-1111-4111-8111-111111111111', authoredDraft: JSON.parse(JSON.stringify(d)), serializedData: serializeSpell(d) });
const options = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
const ref = { roomId: 'r', definitionId: record(draft()).authoredDefinitionId, definitionVersion: 1, definitionHash: 'a'.repeat(64) };
const entry = () => ({ definitionRef: ref, canonicalDefinition: definitionFromWizard(record(draft()), options).definition,
  descriptor: { price: { ap: 0, mana: 0 }, effect: { damageTypes: [] } }, revoked: false });

test('whole JSON and accepted template paths preserve AP0, mana0, range0 without mutating source', () => {
  const d = draft(), before = JSON.stringify(d), reopened = deserializeSpell(serializeSpell(d));
  expect(reopened.resourceCost).toEqual(d.resourceCost); expect(reopened.targetingConfig.rangeDistance).toBe(0);
  const template = createSpellTemplate(d), generated = generateSpellFromTemplate(template, { name: 'Second Thread' });
  expect(generated.resourceCost).toEqual(d.resourceCost); expect(template.name).toBe(d.name); expect(JSON.stringify(d)).toBe(before);
  expect(definitionFromWizard(record(reopened), options)).toMatchObject({ ok: true, definition: { resourceCost: { actionPoints: 0, mana: 0 }, targeting: { rangeFeet: 0 } } });
});
test.each([undefined, null, -1, '0', 0.5])('range %p is not repaired into executable range0', value => {
  const d = draft(); d.targetingConfig.rangeDistance = value;
  expect(definitionFromWizard(record(d), options).ok).toBe(false);
});
test('mixed mechanics and conflicting outer/serialized records stay intact and manual', () => {
  for (const alter of [r => { r.authoredDraft.effectTypes.push('debuff'); }, r => { r.cooldownConfig = { cooldownType: 'rounds', cooldownValue: 2 }; }, r => { r.targetingConfig = { ...r.targetingConfig, targetRestrictions: ['self'] }; }, r => { r.serializedData = JSON.stringify({ ...draft(), effectTypes: ['healing', 'buff'] }); }]) {
    const r = record(draft()); alter(r); const before = JSON.stringify(r);
    expect(definitionFromWizard(r, options).ok).toBe(false); expect(JSON.stringify(r)).toBe(before);
  }
});
test('installed support is room scoped, version exact and revoked copies refuse', () => {
  replaceAuthoredRegistry('r', [entry()]); const id = actionId(ref);
  expect(authoredSupport(id, 'r', 'Arcanoneer')).toMatchObject({ supported: true, price: { ap: 0, mana: 0 }, reading: { constant: 1 } });
  expect(authoredSupport(id, 'other-room', 'Arcanoneer').supported).toBe(false);
  expect(authoredSupport(id, 'r', 'Chaos Weaver').supported).toBe(false);
  expect(authoredSupport(actionId({ ...ref, definitionVersion: 2 }), 'r', 'Arcanoneer').supported).toBe(false);
  replaceAuthoredRegistry('r', [{ ...entry(), revoked: true }]); expect(authoredSupport(id, 'r', 'Arcanoneer').supported).toBe(false);
});
test('physical and digital faces use the same pure grammar and existing record/calc path', () => {
  const reading = readFormula('2d6-2');
  expect(recordRoll('physical', reading, [[1, 6]])).toMatchObject({ total: 5, dice: [{ sides: 6, faces: [1, 6] }] });
  expect(digitalRoll(reading, () => 0.5)).toMatchObject({ total: 6, dice: [{ sides: 6, faces: [4, 4] }] });
  expect(() => readFormula('1d6+intelligence')).toThrow(); expect(() => readFormula('1d6;alert(1)')).toThrow();
});
test('existing GM planner/receipt consumer carry authored identity without another arithmetic implementation', () => {
  const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc1', ownerUid: 'u', characterId: 'c' };
  const token = { id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', health: { current: 20, max: 21 }, tempHealth: 3 }, state: { actorContract: { version: 1, ...source, primary: true, revision: 0 } } };
  const a = { approvalId: 'a', source, target: source, spell: { definitionId: actionId(ref), definitionHash: `authored-immediate:v1/${ref.definitionHash}`, name: 'Stillwater Thread', kind: 'healing', damageTypes: [] }, price: { ap: 0, mana: 0 }, classPayment: null, roll: recordRoll('physical', readFormula('1d8+1'), [[8]]) };
  const plan = planSpellCommand({ approval: a, contentHash: 'h', tokens: [token], roomId: 'r', mapId: 'm', finalAmount: 9, adjudicated: true });
  expect(plan.entries).toHaveLength(1); expect(plan.entries[0].finalResources.hp).toEqual({ current: 21, temp: 3 });
  const receipt = { version: 1, authorization: { kind: 'owner-approval-gm', proposalId: 'a' }, actors: [{ ref: source }], source, target: source, adjudication: plan.extra.adjudication };
  expect(spellReceipt({ success: true, receipt }).recorded.capability).toBe('authored-immediate:v1');
});
