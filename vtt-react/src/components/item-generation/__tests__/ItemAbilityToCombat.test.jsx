/**
 * Item ability authoring -> combat route (handoff/item-ability-combat).
 * A2 scope: the item panel lists items from the LOCAL store; that is not server possession authorization. These tests prove UI wiring and
 * admission matching (definition id + room + canonical bytes), not exact-item enforcement or foreign-item security.
 * Real: ItemWizard + ItemAbilityEditor, ItemAbilityAccess, itemAuthoredAbility adapter, inventoryStore,
 *       the spellConsequenceService store, definitionFromWizard.
 * Mocked explicitly: routeSpellCast / refreshAuthoredAbilities (the shared P9 cast route is spied, not replaced
 *       by a store write), AuthoredAdmission (GM admission panel, owned by another suite).
 */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemWizard from '../ItemWizard';
import ItemAbilityAccess from '../ItemAbilityAccess';
import { newItemAbility, itemAbilitySupport, editItemAbility, clone, ownedAbilityItems } from '../../../services/itemAuthoredAbility';
import { definitionFromWizard, actionId } from '../../../services/authoredAbility';
import useInventoryStore from '../../../store/inventoryStore';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import { registerStore, getStore } from '../../../store/storeRegistry';
import * as service from '../../../services/spellConsequenceService';

jest.mock('../../../services/spellConsequenceService', () => {
  const actual = jest.requireActual('../../../services/spellConsequenceService');
  return { ...actual, routeSpellCast: jest.fn(() => true), refreshAuthoredAbilities: jest.fn(async () => ({ success: true })) };
});
jest.mock('../../spellcrafting-wizard/components/library/AuthoredAdmission', () => () => <div data-testid="admission" />);
beforeAll(() => { Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true }); });

const ID = 'd2398809-d3cf-4931-b8f6-24e5a382e1a5', ROOM = 'room-1';
const healValues = { name: 'Item Mending', description: 'witness', kind: 'healing', formula: '1d8+1', damageType: 'arcane', ap: 1, mana: 2, range: 30, restriction: 'ally' };
function admitted(association, revoked = false) {
  const mapped = definitionFromWizard(association.record, { roomId: ROOM, definitionVersion: 1, classId: 'arcanoneer' });
  return { canonicalDefinition: mapped.definition, revoked, definitionRef: { roomId: ROOM, definitionId: association.record.authoredDefinitionId, definitionVersion: 1, definitionHash: 'h' } };
}
function seed(entries) {
  useGameStore.setState({ multiplayerRoom: { id: ROOM } });
  service.useSpellConsequenceStore.setState({ authoredRoomId: ROOM, authoredEntries: entries });
}
beforeEach(() => { service.routeSpellCast.mockClear(); });
const useButton = () => screen.queryByRole('button', { name: 'Use item ability' });
const open = () => fireEvent.click(screen.getByText(/Item Mending|New activated ability/));

test('owned item with exact admitted version: Use routes the admitted id once, labelled with the item', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), entry = admitted(association);
  seed([entry]);
  render(<ItemAbilityAccess item={{ id: 'inv-1', name: 'Wand', authoredAbility: association }} />);
  fireEvent.change(screen.getByLabelText('Saved ability version'), { target: { value: actionId(entry.definitionRef) } });
  fireEvent.click(useButton());
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(service.routeSpellCast).toHaveBeenCalledWith({ id: actionId(entry.definitionRef) }, { producer: 'item: Wand' });
});

test('DEFECT 1: an unowned library template must not offer the Use control (association alone grants no casting)', () => {
  const association = editItemAbility(newItemAbility(ID), healValues);
  seed([admitted(association)]);
  render(<ItemAbilityAccess template item={{ id: 'library-1', name: 'Wand', authoredAbility: association }} />);
  open();
  expect(screen.getByTestId('admission')).toBeInTheDocument();   // GM admission of the template stays available
  expect(screen.queryByLabelText('Saved ability version')).toBeNull();
  expect(useButton()).toBeNull();
  expect(service.routeSpellCast).not.toHaveBeenCalled();
});

test('unsupported association stays visible and manual; no admission, no Use, nothing routed', () => {
  const association = newItemAbility(ID); association.record.authoredDraft.effectTypes.push('debuff'); association.record.effectTypes.push('debuff');
  association.record.authoredDraft.debuffConfig = association.record.debuffConfig = { enabled: true, custom: { keep: 'all' } };
  seed([]);
  render(<ItemAbilityAccess item={{ id: 'inv-2', name: 'Odd Wand', authoredAbility: association }} />);
  fireEvent.click(screen.getByText(/Odd Wand/));
  expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument();
  expect(screen.queryByTestId('admission')).toBeNull(); expect(useButton()).toBeNull();
  expect(service.routeSpellCast).not.toHaveBeenCalled();
});

test('a library/template edit after admission never silently reuses the admitted version', () => {
  const approved = editItemAbility(newItemAbility(ID), healValues), entry = admitted(approved);
  seed([entry]);
  const changed = editItemAbility(approved, { ...healValues, formula: '4d8' });
  render(<ItemAbilityAccess item={{ id: 'inv-3', name: 'Wand', authoredAbility: changed }} />);
  expect(screen.queryByLabelText('Saved ability version')).toBeNull(); expect(useButton()).toBeNull();
});

test('revoked admission cannot be selected for use', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), entry = admitted(association, true);
  seed([entry]);
  render(<ItemAbilityAccess item={{ id: 'inv-4', name: 'Wand', authoredAbility: association }} />);
  fireEvent.change(screen.getByLabelText('Saved ability version'), { target: { value: actionId(entry.definitionRef) } });
  expect(useButton()).toBeDisabled();
});

function openWizard(initial, onComplete) {
  render(<ItemWizard initialData={initial} onComplete={onComplete} isEditing />);
  fireEvent.click(screen.getByRole('button', { name: /Basic/ }));
}
const finish = () => { fireEvent.click(screen.getByRole('button', { name: /Appearance/ })); fireEvent.click(screen.getByRole('button', { name: /Create Item|Save|Update/ })); };

test('DEFECT 2: the Item Wizard can remove an association; unrelated item data survives; removal is explicit', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), onComplete = jest.fn();
  const initial = { id: 'item-lib', type: 'accessory', name: 'Wand', customStorage: { keep: [1, 2] }, combatStats: { onHitEffects: { enabled: true, customEffects: [{ manual: true }] } }, authoredAbility: association };
  openWizard(initial, onComplete);
  fireEvent.click(screen.getByRole('button', { name: 'Remove activated ability' }));
  finish();   // first click only asks for confirmation: saving now must keep the association
  expect(onComplete.mock.calls[0][0].authoredAbility).toEqual(association); cleanup(); onComplete.mockClear();
  openWizard(initial, onComplete);
  fireEvent.click(screen.getByRole('button', { name: 'Remove activated ability' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm remove activated ability' }));
  finish();
  const saved = onComplete.mock.calls[0][0];
  expect(saved.authoredAbility).toBeNull();   // null (not undefined) is what the library merge persists
  expect(saved.customStorage).toEqual(initial.customStorage); expect(saved.combatStats.onHitEffects).toEqual(initial.combatStats.onHitEffects);
});

test('unrelated save preserves a supported and an unsupported association byte-for-byte', () => {
  const supported = editItemAbility(newItemAbility(ID), healValues);
  const unsupported = newItemAbility(ID); unsupported.record.authoredDraft.effectTypes.push('debuff'); unsupported.record.effectTypes.push('debuff');
  for (const association of [supported, unsupported]) {
    const onComplete = jest.fn();
    openWizard({ id: 'i', type: 'accessory', name: 'Wand', authoredAbility: clone(association) }, onComplete);
    fireEvent.change(screen.getByPlaceholderText('Enter item name...'), { target: { value: 'Renamed' } });
    finish();
    expect(onComplete.mock.calls[0][0].authoredAbility).toEqual(association);
    cleanup();
  }
});

test('inventory copy is detached from the template; later template edits do not change an owned instance', () => {
  useInventoryStore.setState({ items: [] });
  const template = { id: 'tmpl', name: 'Wand', type: 'accessory', width: 1, height: 1, authoredAbility: editItemAbility(newItemAbility(ID), healValues) };
  useInventoryStore.getState().addItemFromLibrary(template);
  const owned = clone(useInventoryStore.getState().items[0]);
  template.authoredAbility = editItemAbility(template.authoredAbility, { ...healValues, formula: '9d9' });
  expect(useInventoryStore.getState().items[0]).toEqual(owned);
  expect(itemAbilitySupport(owned.authoredAbility).definition.effect.formula).toBe('1d8+1');
});

// ---- Continuation: instance identity, equipment reach, staleness, immutability ----
const ID2 = '5b0e3d4a-1111-4222-8333-944455556666';
const dmgValues = { name: 'Item Spark', description: 'w', kind: 'damage', formula: '1d6+2', damageType: 'arcane', ap: 1, mana: 3, range: 30, restriction: 'enemy' };

test('two same-named items each list only admitted versions of their own definition; Use routes that admitted id (UI/admission match, not a possession check)', () => {
  const a = editItemAbility(newItemAbility(ID), healValues), b = editItemAbility(newItemAbility(ID2), dmgValues);
  const ea = admitted(a), eb = admitted(b);
  seed([ea, eb]);
  render(<><ItemAbilityAccess item={{ id: 'inv-a', name: 'Wand', authoredAbility: a }} /><ItemAbilityAccess item={{ id: 'inv-b', name: 'Wand', authoredAbility: b }} /></>);
  const selects = screen.getAllByLabelText('Saved ability version');
  expect(selects).toHaveLength(2);
  expect(selects[1].querySelectorAll('option')).toHaveLength(2);        // placeholder + only b's own version
  fireEvent.change(selects[1], { target: { value: actionId(eb.definitionRef) } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Use item ability' })[1]);
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(service.routeSpellCast).toHaveBeenCalledWith({ id: actionId(eb.definitionRef) }, { producer: 'item: Wand' });
});

test('a definition never admitted in this room (or admitted only in another room) offers no Use: admission matching, NOT foreign-item security', () => {
  const mine = editItemAbility(newItemAbility(ID), healValues), foreign = editItemAbility(newItemAbility(ID2), dmgValues);
  const otherRoom = admitted(foreign); otherRoom.definitionRef = { ...otherRoom.definitionRef, roomId: 'room-2' };
  seed([admitted(mine), otherRoom]);
  render(<ItemAbilityAccess item={{ id: 'foreign', name: 'Borrowed Wand', authoredAbility: foreign }} />);
  expect(screen.queryByLabelText('Saved ability version')).toBeNull(); expect(useButton()).toBeNull();
  expect(service.routeSpellCast).not.toHaveBeenCalled();
});

test('stale approved terms: a selected version that is revoked or changed afterwards cannot be used', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), entry = admitted(association);
  seed([entry]);
  const { rerender } = render(<ItemAbilityAccess item={{ id: 'i', name: 'Wand', authoredAbility: association }} />);
  fireEvent.change(screen.getByLabelText('Saved ability version'), { target: { value: actionId(entry.definitionRef) } });
  expect(useButton()).toBeEnabled();
  React.act(() => { seed([admitted(association, true)]); });                       // GM revokes after selection
  rerender(<ItemAbilityAccess item={{ id: 'i', name: 'Wand', authoredAbility: association }} />);
  expect(useButton()).toBeDisabled();
  React.act(() => { seed([entry]); });
  rerender(<ItemAbilityAccess item={{ id: 'i', name: 'Wand', authoredAbility: editItemAbility(association, { ...healValues, formula: '9d9' }) }} />);
  expect(useButton()).toBeNull();                                                  // edited terms no longer match
  fireEvent.click(screen.getByText(/Item Mending/));
  expect(service.routeSpellCast).not.toHaveBeenCalled();
});

test('refused route reports nothing spent; the source association is byte-identical after use', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), entry = admitted(association), before = JSON.stringify(association);
  seed([entry]); service.routeSpellCast.mockReturnValueOnce(false);
  render(<ItemAbilityAccess item={{ id: 'i', name: 'Wand', authoredAbility: association }} />);
  fireEvent.change(screen.getByLabelText('Saved ability version'), { target: { value: actionId(entry.definitionRef) } });
  fireEvent.click(useButton());
  expect(screen.getByRole('status')).toHaveTextContent(/Nothing was spent/);
  expect(JSON.stringify(association)).toBe(before);
});

test('save then reopen: the saved association feeds back unchanged into the editor and the support check', () => {
  const association = editItemAbility(newItemAbility(ID), healValues), onComplete = jest.fn();
  openWizard({ id: 'i', type: 'accessory', name: 'Wand', authoredAbility: clone(association) }, onComplete);
  finish();
  const saved = onComplete.mock.calls[0][0]; cleanup();
  const reopened = jest.fn();
  openWizard(clone(saved), reopened); finish();
  expect(reopened.mock.calls[0][0].authoredAbility).toEqual(association);
  expect(itemAbilitySupport(reopened.mock.calls[0][0].authoredAbility).ok).toBe(true);
});

test('equipment reach: worn instances are listed once with the same association; unassociated items are not', () => {
  const association = editItemAbility(newItemAbility(ID), healValues);
  const worn = { id: 'w1', name: 'Ring', authoredAbility: association, isEquipped: true };
  const bag = { id: 'b1', name: 'Wand', authoredAbility: association }, plain = { id: 'p1', name: 'Stick' };
  expect(ownedAbilityItems([bag, plain, worn], { ring1: worn, mainHand: null, chest: { id: 'x', name: 'Mail' } }).map(i => i.id)).toEqual(['b1', 'w1']);
  expect(ownedAbilityItems(undefined, undefined)).toEqual([]);
});

test('existing equip/unequip keeps the instance and its association intact (no gameplay change)', () => {
  const association = editItemAbility(newItemAbility(ID), healValues);
  useInventoryStore.setState({ items: [] });
  useInventoryStore.getState().addItemFromLibrary({ id: 'tmpl', name: 'Ring', type: 'accessory', subtype: 'ring', width: 1, height: 1, authoredAbility: association });
  const owned = useInventoryStore.getState().items[0];
  const previous = getStore('conditionStore');   // equip recomputes derived stats; stub only the condition lookup (no effects)
  registerStore('conditionStore', { getState: () => ({ getActiveEffects: () => [] }) });
  try {
    useCharacterStore.getState().equipItem(owned, 'ring1');
    const worn = useCharacterStore.getState().equipment.ring1;
    expect(worn.id).toBe(owned.id); expect(worn.authoredAbility).toEqual(association);
    expect(ownedAbilityItems([], useCharacterStore.getState().equipment).map(i => i.id)).toEqual([owned.id]);
    const back = useCharacterStore.getState().unequipItem('ring1');
    expect(back.id).toBe(owned.id); expect(back.authoredAbility).toEqual(association);
  } finally { registerStore('conditionStore', previous); }
});
