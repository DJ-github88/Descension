import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureAbilityEditor, { CreatureAbilityDetails } from '../CreatureAuthoredAbility';
import { CreatureWizardProvider, useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators as a, retainedCreatureDraft } from '../../../context/CreatureWizardContext';
import { SpellLibraryStateContext } from '../../../../spellcrafting-wizard/context/SpellLibraryContext';
import { newItemAbility, itemAbilitySupport } from '../../../../../services/itemAuthoredAbility';
import useCreatureStore from '../../../../../store/creatureStore';
import { normalizeCreatureForWizard } from '../../../CreatureWizardApp';

jest.mock('../../../../books/BookTtrpgBlocks', () => ({ normalizeDangerLevel: () => 'Medium', CREATURE_PRESETS: [] }));
jest.mock('../ExternalCreaturePreview', () => () => null);
beforeAll(() => { Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true }); });
let current, send;
function Harness() {
  current = useCreatureWizard(); const dispatch = useCreatureWizardDispatch(); send = dispatch;
  return <><button onClick={() => dispatch(a.resetWizard())}>Reset test</button><button onClick={() => dispatch(a.nextStep())}>Next test</button><CreatureAbilityEditor /></>;
}
const mount = spells => render(<SpellLibraryStateContext.Provider value={{ spells: spells || [] }}><CreatureWizardProvider><Harness /></CreatureWizardProvider></SpellLibraryStateContext.Provider>);
afterEach(cleanup);
test('shared compact form authors damage and healing, zeros; unfinished values survive provider remount and navigation is gated', () => {
  let ui = mount(); fireEvent.click(screen.getByText('Reset test'));
  fireEvent.click(screen.getByText('Add activated ability'));
  fireEvent.change(screen.getByLabelText('Ability name'), { target: { value: 'Creature ember' } });
  fireEvent.click(screen.getByText('Next test')); expect(current.currentStep).toBe(1);
  ui.unmount(); ui = mount(); expect(screen.getByLabelText('Ability name')).toHaveValue('Creature ember');
  fireEvent.click(screen.getByText('Keep ability on creature'));
  const damage = current.authoredAbility; expect(itemAbilitySupport(damage).definition.effect.kind).toBe('damage');
  fireEvent.click(screen.getByText('Edit activated ability'));
  fireEvent.change(screen.getByLabelText('Effect'), { target: { value: 'healing' } });
  for (const label of ['AP price', 'Mana price', 'Range (ft)']) fireEvent.change(screen.getByLabelText(label), { target: { value: '0' } });
  fireEvent.click(screen.getByText('Keep ability on creature'));
  expect(itemAbilitySupport(current.authoredAbility).definition).toMatchObject({ effect: { kind: 'healing' }, resourceCost: { actionPoints: 0, mana: 0 }, targeting: { rangeFeet: 0 } });
  expect(current.authoredAbility.record.authoredDefinitionId).toBe(damage.record.authoredDefinitionId);
  expect(itemAbilitySupport(damage).definition.effect.kind).toBe('damage');
});
test('library selection is exact, detached, inspected before Keep; missing/duplicate IDs are visible and unselectable', () => {
  const record = { ...newItemAbility('d2398809-d3cf-4931-b8f6-24e5a382e1a5').record, id: 'unique' };
  mount([record, { ...record, id: 'duplicate' }, { ...record, id: 'duplicate' }, { ...record, id: undefined }]); fireEvent.click(screen.getByText('Reset test'));
  expect(screen.getByText(/missing or duplicate IDs/)).toBeInTheDocument();
  const select = screen.getByLabelText('Compatible Spell Library definition'); expect(select.options).toHaveLength(2);
  fireEvent.change(select, { target: { value: 'unique' } }); expect(current.authoredAbility).toBeUndefined();
  fireEvent.click(screen.getByText('Keep ability on creature'));
  const saved = JSON.parse(JSON.stringify(current.authoredAbility)); record.authoredDraft.name = 'library changed';
  expect(current.authoredAbility).toEqual(saved); expect(current.authoredAbility.librarySpellId).toBe('unique');
});
test('normal wizard reopen preserves whole legacy/rich records and association, including unknown/null/missing/zero fields', () => {
  const raw = { id: 'template', custom: { intact: true }, abilities: [{ name: 'Legacy', range: 0, manaCost: null, targetingConfig: { maxTargets: 0 }, periodic: { unknown: true }, formula: '2d6+STR', triggerCondition: null }, { name: 'Rich', effects: { complex: true } }], authoredAbility: newItemAbility('d2398809-d3cf-4931-b8f6-24e5a382e1a5') };
  const opened = normalizeCreatureForWizard(raw); expect(opened.abilities).toEqual(raw.abilities); expect(opened.custom).toEqual(raw.custom); expect(opened.authoredAbility).toEqual(raw.authoredAbility);
  opened.authoredAbility.record.name = 'edited copy'; opened.abilities[0].periodic.unknown = false;
  expect(raw.authoredAbility.record.name).not.toBe('edited copy'); expect(raw.abilities[0].periodic.unknown).toBe(true);
  for (const value of [null, { malformed: true }, [null]]) expect(normalizeCreatureForWizard({ abilities: value }).abilities).toEqual(value);
});
test('production creature placement and template propagation preserve detached instance association and token identity', () => {
  const association = newItemAbility('d2398809-d3cf-4931-b8f6-24e5a382e1a5');
  useCreatureStore.setState({ creatures: [{ id: 'template', name: 'Template', authoredAbility: association }], creatureTokens: [], tokens: [] });
  useCreatureStore.getState().addCreatureToken('template', { x: 100, y: 100 }, false, 'placed');
  useCreatureStore.getState().addCreatureToken('template', { x: 200, y: 100 }, false, 'other');
  const original = JSON.parse(JSON.stringify(useCreatureStore.getState().creatureTokens[0].authoredAbility));
  association.record.name = 'mutable input';
  useCreatureStore.getState().updateCreature('template', { id: 'template', name: 'Updated', authoredAbility: { schemaVersion: 99 } });
  expect(useCreatureStore.getState().creatureTokens.map(t => t.id)).toEqual(['placed', 'other']);
  for (const t of useCreatureStore.getState().creatureTokens) { expect(t.authoredAbility).toEqual(original); expect(t.name).toBe('Updated'); }
  expect(useCreatureStore.getState().creatureTokens[0].authoredAbility).not.toBe(useCreatureStore.getState().creatureTokens[1].authoredAbility);
});
test('unsupported whole content stays inspectable and exposes no casting or admission control', () => {
  const association = newItemAbility('d2398809-d3cf-4931-b8f6-24e5a382e1a5'); association.record.authoredDraft.effectTypes.push('debuff');
  render(<CreatureAbilityDetails association={association} saved />);
  expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument(); expect(screen.getByText(/Library admission alone does not authorize/)).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument(); expect(screen.getByText(/"debuff"/)).toBeInTheDocument();
});
test('session drafts are keyed by exact creature identity, never substituted for a different edit', () => {
  mount(); fireEvent.click(screen.getByText('Reset test'));
  act(() => send(a.loadCreature({ id: 'creature-A', name: 'A', abilities: [] })));
  fireEvent.click(screen.getByText('Add activated ability'));
  fireEvent.change(screen.getByLabelText('Ability name'), { target: { value: 'A unfinished' } });
  const pending = retainedCreatureDraft('edit_creature-A');
  act(() => send(a.loadCreature({ id: 'creature-B', name: 'B', abilities: [] })));
  expect(current.originalCreatureId).toBe('creature-B'); expect(current.abilityEdit).toBeNull();
  expect(retainedCreatureDraft('edit_creature-A').abilityEdit.values.name).toBe('A unfinished');
  act(() => send(a.resumeDraft(pending))); expect(screen.getByLabelText('Ability name')).toHaveValue('A unfinished');
  expect(current.originalCreatureId).toBe('creature-A');
  fireEvent.click(screen.getByText('Cancel ability edit'));
  expect(retainedCreatureDraft('edit_creature-A')).toBeUndefined();
});
