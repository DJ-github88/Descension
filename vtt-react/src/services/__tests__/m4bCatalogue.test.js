import { CLASS_DATA_MAP } from '../../data/classSpellGenerator';
import { catalogueDraft, classPaymentFor } from '../catalogueAbility.cjs';
import { definitionFromWizard, actionId } from '../authoredAbility';
import { replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { registerStore } from '../../store/storeRegistry';
import { supportSpell, recordRoll, buildApproval } from '../spellConsequence';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import useGameStore from '../../store/gameStore';

const record = () => CLASS_DATA_MAP.Martyr.spells.find(spell => spell.id === 'martyr_restorative_prayer');
const definitionId = '11111111-1111-4111-8111-111111111111';
const options = { roomId: 'r', classId: 'martyr', definitionVersion: 1 };
const character = () => ({ class: 'Martyr', stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 18, charisma: 10 },
  classResource: { type: 'devotion', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 },
  health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } });

test('the adapter reads the three existing typed class domains without inventing another payer', () => {
  expect(classPaymentFor({ resourceCost: { spheres: ['Arcane', 'Ember'] } }, 'arcanoneer')).toEqual({ ok: true, payment: { domain: 'elementalSpheres', price: { costs: ['arcane', 'ember'], gains: [] } } });
  expect(classPaymentFor({ musicalCombo: { requires: [{ note: 'I', count: 1 }, { note: 'V', count: 1 }] } }, 'minstrel')).toEqual({ ok: true, payment: { domain: 'musicalNotes', price: { costs: ['I', 'V'], gains: [] } } });
  expect(classPaymentFor({ devotionGain: 1 }, 'martyr').payment.price).toEqual({ cost: 0, gain: 1, required: 0 });
});

test('whole Martyr record prepares a v2 definition with the existing devotion price and primary-PC healing route', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  expect(prepared.ok).toBe(true);
  expect(prepared.definition).toMatchObject({ schemaVersion: 4, capability: 'authored-immediate:v2', targetRoute: 'primary-pc-healing',
    classPayment: { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } }, effect: { kind: 'healing', formula: '1d4 + spirit' } });
  const mapped = definitionFromWizard(prepared.draft, options);
  expect(mapped.ok).toBe(true);
  expect(mapped.definition.classPayment).toEqual(prepared.definition.classPayment);
  expect(mapped.definition.catalogueSource).toEqual(prepared.definition.catalogueSource);
  expect(deserializeSpell(serializeSpell(prepared.draft)).catalogueSource.recordHash).toBe(prepared.definition.catalogueSource.recordHash);
});

registerStore('gameStore', useGameStore);
test('the class card uses the admitted formula version, attaches the existing bank plan and retains the exact roll', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const compiled = require('../../../../server/services/installedDefinitionRegistry').compileDefinition(definitionFromWizard(prepared.draft, options).definition);
  expect(compiled.ok).toBe(true);
  replaceAuthoredRegistry('r', [{ definitionRef: compiled.descriptor.definitionRef, canonicalDefinition: compiled.canonicalDefinition, descriptor: compiled.descriptor }]);
  useGameStore.setState({ multiplayerRoom: { id: 'r' }, multiplayerSocket: null });
  const support = supportSpell(record(), character());
  expect(support).toMatchObject({ supported: true, kind: 'healing', targetRoute: 'primary-pc-healing', payment: { domain: 'devotionGauge', affordable: true,
    classPayment: { domain: 'devotionGauge', price: { cost: 0, gain: 1, required: 0 } } }, reading: { supported: true, constant: 18 } });
  const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc1', ownerUid: 'u', characterId: 'c' };
  const target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: 'pc2', ownerUid: 't', characterId: 'c2' };
  const tokens = [{ id: 'pc', mapId: 'm', ownerUserId: 'u', character: { id: 'c', ...character() }, state: { actorContract: { version: 1, ...source, primary: true, revision: 2 }, conditions: [] } },
    { id: 'pc2', mapId: 'm', ownerUserId: 't', character: { id: 'c2', health: { current: 20, max: 30 }, tempHealth: 3 }, state: { actorContract: { version: 1, ...target, primary: true, revision: 0 }, conditions: [] } }];
  const roll = recordRoll('physical', support.reading, [[4]]);
  const approval = buildApproval({ support, tokens, sourceRef: source, targetRef: target, roomId: 'r', mapId: 'm', actionEpoch: 'e', baseCommitSequence: 0, roll, approvalId: 'a' });
  expect(approval).toMatchObject({ target, spell: { definitionId: actionId(compiled.descriptor.definitionRef), definitionHash: `authored-immediate:v2/${compiled.descriptor.definitionRef.definitionHash}` },
    roll: { total: 22 }, classPayment: { domain: 'devotionGauge' } });
  expect(approval.roll.dice[0].faces).toEqual([4]);
  expect(approval.formulaSourceHash).toMatch(/^[a-f0-9]{64}$/);
});

test('editing an executable catalogue field refuses the source binding and names the whole record', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const changed = deserializeSpell(serializeSpell(prepared.draft));
  changed.healingConfig.formula = '1d6 + spirit';
  expect(definitionFromWizard(changed, options).ok).toBe(false);
  expect(definitionFromWizard({ ...prepared.draft, catalogueSource: { ...prepared.draft.catalogueSource, recordHash: 'a'.repeat(64) } }, options).ok).toBe(false);
});







