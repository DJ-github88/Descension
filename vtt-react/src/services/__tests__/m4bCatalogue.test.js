import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CLASS_DATA_MAP, ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import useCharacterStore from '../../store/characterStore';
import useSpellbookStore from '../../store/spellbookStore';
import CataloguePreparation from '../../components/spellcrafting-wizard/components/library/CataloguePreparation';
import { catalogueDraft, classPaymentFor, verifyDefinition } from '../catalogueAbility.cjs';
import { canonical, sha256Hex } from '../canonicalHash';
import { definitionFromWizard, actionId } from '../authoredAbility';
import { replaceAuthoredRegistry } from '../authoredAbilityRegistry';
import { registerStore } from '../../store/storeRegistry';
import { supportSpell, recordRoll, buildApproval } from '../spellConsequence';
import { serializeSpell, deserializeSpell } from '../../components/spellcrafting-wizard/core/utils/spellSerializer';
import useGameStore from '../../store/gameStore';

jest.mock('../../persistence/scopedConsumer', () => ({ ...jest.requireActual('../../persistence/scopedConsumer'), captureOwnerGuard: () => ({ ok: true, isCurrent: () => true }) }));

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

test('the normal Spellbook library hands the prepared draft to the Wizard tab', () => {
  const card = ALL_CLASS_SPELLS.Martyr.find(spell => spell.id === 'martyr_restorative_prayer');
  const original = CLASS_DATA_MAP.Martyr.spells.find(spell => spell.id === 'martyr_restorative_prayer');
  useCharacterStore.setState({ class: 'Martyr' });
  useSpellbookStore.setState({ wizardEditRequest: null, activeTab: 'library' });
  render(<CataloguePreparation spell={card} />);
  fireEvent.click(screen.getByRole('button', { name: 'Prepare this catalogue ability in the Wizard', exact: true }));
  const request = useSpellbookStore.getState().wizardEditRequest;
  expect(request.editMode).toBe(false);
  expect(request.spell.catalogueSource.record).toEqual(original);
  expect(useSpellbookStore.getState().activeTab).toBe('wizard');
});

test('inactive Wizard load defaults do not break the pinned catalogue binding', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const triggerConfig = { global: { logicType: 'AND', compoundTriggers: [] }, effectTriggers: {}, conditionalEffects: {} };
  const mechanicsConfig = { cards: null, combos: null, coins: null, stateRequirements: [], stateOptions: { thresholds: [] } };
  const saved = {
    ...prepared.draft, triggerConfig, mechanicsConfig,
    authoredDraft: { ...prepared.draft.authoredDraft, triggerConfig, mechanicsConfig }
  };
  expect(definitionFromWizard(saved, options).ok).toBe(true);
  const changedMechanics = { ...mechanicsConfig, cards: { count: 1 } };
  expect(definitionFromWizard({ ...saved, mechanicsConfig: changedMechanics, authoredDraft: { ...saved.authoredDraft, mechanicsConfig: changedMechanics } }, options).ok).toBe(false);
  const changedTriggers = { ...triggerConfig, effectTriggers: { onCast: { enabled: true } } };
  expect(definitionFromWizard({ ...saved, triggerConfig: changedTriggers, authoredDraft: { ...saved.authoredDraft, triggerConfig: changedTriggers } }, options).ok).toBe(false);
});

test('the normal class-card projection prepares the unmodified whole catalogue record', () => {
  const card = ALL_CLASS_SPELLS.Martyr.find(spell => spell.id === 'martyr_restorative_prayer');
  const original = CLASS_DATA_MAP.Martyr.spells.find(spell => spell.id === 'martyr_restorative_prayer');
  expect(card.specialization).toBeDefined();
  expect(original.specialization).toBeUndefined();
  useCharacterStore.setState({ class: 'Martyr' });
  const onLoadSpell = jest.fn();
  render(<CataloguePreparation spell={card} onLoadSpell={onLoadSpell} />);
  fireEvent.click(screen.getByRole('button', { name: 'Prepare this catalogue ability in the Wizard', exact: true }));
  const prepared = onLoadSpell.mock.calls[0][0];
  expect(prepared.catalogueSource.record).toEqual(original);
  expect(prepared.catalogueSource.recordHash).toBe(catalogueDraft(original, 'martyr', { authoredDefinitionId: prepared.authoredDefinitionId }).definition.catalogueSource.recordHash);
});

test('editing an executable catalogue field refuses the source binding and names the whole record', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const changed = deserializeSpell(serializeSpell(prepared.draft));
  changed.healingConfig.formula = '1d6 + spirit';
  expect(definitionFromWizard(changed, options).ok).toBe(false);
  expect(definitionFromWizard({ ...prepared.draft, catalogueSource: { ...prepared.draft.catalogueSource, recordHash: 'a'.repeat(64) } }, options).ok).toBe(false);
});

test('a doctored self-consistent catalogue record is refused by the reviewed pin', () => {
  const doctored = JSON.parse(JSON.stringify(record()));
  doctored.healingConfig.formula = '4d4 + spirit';
  doctored.resourceCost.mana = 0;
  doctored.resourceCost.resourceValues.mana = 0;
  doctored.devotionGain = 6;
  doctored.resourceCost.resourceValues.classResource.gain = 6;
  expect(catalogueDraft(doctored, 'martyr', { authoredDefinitionId: definitionId }).ok).toBe(false);
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const forged = deserializeSpell(serializeSpell(prepared.draft));
  const source = { spellId: doctored.id, classId: 'martyr', recordHash: sha256Hex(canonical(doctored)), record: doctored };
  forged.catalogueSource = source;
  forged.authoredDraft.catalogueSource = source;
  for (const draft of [forged, forged.authoredDraft]) {
    draft.healingConfig.formula = doctored.healingConfig.formula;
    draft.resourceCost.mana = doctored.resourceCost.mana;
    draft.resourceCost.resourceValues.mana = doctored.resourceCost.resourceValues.mana;
  }
  expect(definitionFromWizard(forged, options).ok).toBe(false);
});

test('wrong or missing trusted catalogue identity refuses admission and cast', () => {
  const prepared = catalogueDraft(record(), 'martyr', { authoredDefinitionId: definitionId, id: 'catalogue-martyr' });
  const mapped = definitionFromWizard(prepared.draft, options);
  expect(mapped.ok).toBe(true);
  expect(verifyDefinition(mapped.definition).ok).toBe(true);
  const wrongClass = { ...prepared.draft, catalogueSource: { ...prepared.draft.catalogueSource, classId: 'minstrel' },
    authoredDraft: { ...prepared.draft.authoredDraft, catalogueSource: { ...prepared.draft.authoredDraft.catalogueSource, classId: 'minstrel' } } };
  expect(definitionFromWizard(wrongClass, options).ok).toBe(false);
  const unknownHash = JSON.parse(JSON.stringify(mapped.definition));
  unknownHash.catalogueSource.recordHash = 'a'.repeat(64);
  expect(verifyDefinition(unknownHash).ok).toBe(false);
  const missing = JSON.parse(JSON.stringify(mapped.definition));
  delete missing.catalogueSource;
  expect(verifyDefinition(missing).ok).toBe(false);
});

test('conflicting supported resource encodings refuse instead of choosing one', () => {
  expect(classPaymentFor({ devotionGain: 1, resourceCost: { resourceValues: { classResource: { type: 'devotion', gain: 3 } } } }, 'martyr').ok).toBe(false);
  expect(classPaymentFor({ devotionCost: 2, resourceCost: { resourceValues: { devotion_cost: 3 } } }, 'martyr').ok).toBe(false);
  expect(classPaymentFor({ devotionGain: 1, resourceCost: { resourceValues: { classResource: { type: 'devotion', gain: 1 } } } }, 'martyr').ok).toBe(true);
});







