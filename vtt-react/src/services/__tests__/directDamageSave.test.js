/** Direct-damage save (handoff/direct-damage-save/CONTRACT.md), client side: GM command planner, card/Review disclosure and the
 * compatibility explanation, read from the genuine mounted-Wizard fixtures (directDamageSaveFixtures.json). The server re-derives
 * everything planned here (server/tests/directDamageSave.production.test.js). */
import fixtures from '../../components/spellcrafting-wizard/__tests__/fixtures/directDamageSaveFixtures.json';
import { planSpellCommand } from '../spellConsequence';
import { definitionFromWizard } from '../authoredAbility';
import { appliedAmount, describe as describeSave } from '../directSave';
import { saveDisclosureForRecord } from '../../components/spellcrafting-wizard/components/common/spellSavePresentation';
import { explainExecution } from '../../components/spellcrafting-wizard/utils/executionCompatibility';
import { buildSpellBehaviorModel } from '../../components/spellcrafting-wizard/components/common/spellBehaviorPresentation';

jest.mock('../effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));
jest.mock('../../components/spellcrafting-wizard/core/mechanics/cooldownSystem', () => ({ processTurnBasedCooldowns: jest.fn() }));

const room = 'r', hash = c => c.repeat(64);
const ref = (tokenId) => ({ kind: 'creature', roomId: room, mapId: 'm', tokenId, instanceId: tokenId });
const tokens = (temp = 4) => [
  { id: 's', mapId: 'm', state: { actorContract: { ...ref('s'), version: 1, revision: 2 }, currentActionPoints: 4, tempActionPoints: 0, currentMana: 10, tempMana: 0, conditions: [] } },
  { id: 't', mapId: 'm', state: { actorContract: { ...ref('t'), version: 1, revision: 5 }, currentHp: 30, tempHealth: temp, maxHp: 40, conditions: [] } }];
const approval = (outcome, faces = [6]) => ({ approvalId: '20000000-0000-4000-8000-000000000001', source: ref('s'), target: ref('t'),
  roll: { mode: 'physical', dice: [{ sides: 8, faces }], constant: 3, total: faces[0] + 3, reading: '1d8+3' }, price: { ap: 1, mana: 3 }, classPayment: null,
  spell: { definitionId: `authored:x:1:${hash('a')}`, definitionHash: `authored-immediate:v1/${hash('b')}`, name: 'Ember Lance', kind: 'damage', damageTypes: ['ember'] },
  saveTerms: { scope: 'direct', ability: 'agility', dc: 14, outcome } });
const plan = (a, branch, finalAmount, reason = '', temp) => planSpellCommand({ approval: a, contentHash: 'h', tokens: tokens(temp), roomId: room, mapId: 'm', finalAmount, reason, adjudicated: true, branch });
const targetHp = p => p.entries[1].finalResources.hp;
const chosen = p => JSON.parse(p.extra.adjudication.chosenResult);

test('planner: GM final is pre-save damage; the save is applied once, then temporary HP, then base HP', () => {
  const half = approval('halves');
  expect(targetHp(plan(half, 'failed', 9))).toEqual({ current: 25, temp: 0 });
  const saved = plan(half, 'saved', 9);
  expect(targetHp(saved)).toEqual({ current: 30, temp: 0 }); // floor(9/2) = 4, all temp HP
  expect(chosen(saved)).toMatchObject({ save: half.saveTerms, branch: 'saved', appliedAmount: 4 });
  expect(saved.extra.adjudication.finalAmount).toBe(9);
  expect(targetHp(plan(half, 'saved', 7, 'Cover -2', 0))).toEqual({ current: 27, temp: 0 });
  expect(targetHp(plan(half, 'saved', 1, 'Cover', 0))).toEqual({ current: 30, temp: 0 });
  const neg = plan(approval('negates'), 'saved', 9);
  expect(targetHp(neg)).toEqual({ current: 30, temp: 4 });
  expect(neg.entries[0].finalResources).toEqual({ ap: { current: 3, temp: 0 }, mana: { current: 7, temp: 0 } }); // price still paid
  expect(() => plan(half, undefined, 9)).toThrow(/saved or failed/);
  expect(() => plan(half, 'partial', 9)).toThrow(/saved or failed/);
  expect([0, 1, 2, 9].map(f => appliedAmount(half.saveTerms, 'saved', f))).toEqual([0, 0, 1, 4]);
});

test('genuine Wizard records: both damage-only saves compile with the exact term; the rider control is unchanged; the combination refuses whole', () => {
  const read = key => definitionFromWizard(JSON.parse(JSON.stringify(fixtures[key].savedOuterRecord)), { roomId: room, definitionVersion: 1, classId: 'arcanoneer' });
  expect(read('direct-damage-local-save').definition.save).toEqual({ scope: 'direct', ability: 'agility', dc: 14, outcome: 'negates' });
  expect(read('direct-damage-save-for-half').definition.save).toEqual({ scope: 'direct', ability: 'agility', dc: 15, outcome: 'halves' });
  expect(read('rider-local-save-control').definition.effects.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' });
  expect(read('unsupported-combination-both-saves').ok).toBe(false);
});

test('card and Review explain exactly which component the save changes', () => {
  const half = saveDisclosureForRecord(fixtures['direct-damage-save-for-half'].savedOuterRecord);
  expect(half).toMatchObject({ executable: true, component: 'direct-damage', label: 'Agility DC 15' });
  expect(half.text).toMatch(/changes only this Direct Damage part/);
  expect(half.text).toMatch(/half the GM's final amount, rounded down/);
  const neg = saveDisclosureForRecord(fixtures['direct-damage-local-save'].savedOuterRecord);
  expect(neg.text).toMatch(/on a successful save, no damage\. The price is paid either way/);
  const combo = saveDisclosureForRecord(fixtures['unsupported-combination-both-saves'].savedOuterRecord);
  expect(combo.executable).toBe(false);
  const review = explainExecution(fixtures['direct-damage-save-for-half'].savedOuterRecord, { classId: 'arcanoneer' });
  expect(review.automated).toContain(describeSave({ scope: 'direct', ability: 'agility', dc: 15, outcome: 'halves' }));
  expect(review.manual.join(' ')).toMatch(/Rolling the save: .*before the save is applied/);
  expect(review.confirm.join(' ')).toMatch(/approves both outcomes/);
});

test('behaviour flow (Review and Library cards) names the Direct Damage part as the one the save changes; rider wording unchanged', () => {
  const steps = record => buildSpellBehaviorModel(record, { classId: 'arcanoneer' }).steps;
  const half = steps(fixtures['direct-damage-save-for-half'].savedOuterRecord);
  const save = half.find(s => s.id === 'save');
  expect(save.summary).toMatch(/changes only the Direct Damage part/);
  expect(save.branches).toEqual([{ outcome: 'On fail', text: "Direct Damage: the GM's final amount." }, { outcome: 'On save', text: "Direct Damage: half the GM's final amount, rounded down." }]);
  expect(half.find(s => s.id === 'immediate').details).not.toContain('Applies on both save outcomes.');
  const neg = steps(fixtures['direct-damage-local-save'].savedOuterRecord).find(s => s.id === 'save');
  expect(neg.branches[1].text).toBe('Direct Damage: none.');
  const rider = steps(fixtures['rider-local-save-control'].savedOuterRecord);
  expect(rider.find(s => s.id === 'save').branches[1].text).toMatch(/is negated\./);
  expect(rider.find(s => s.id === 'immediate').details).toContain('Applies on both save outcomes.');
});
