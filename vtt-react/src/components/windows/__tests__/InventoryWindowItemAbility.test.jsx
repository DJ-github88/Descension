/**
 * Item-ability wiring in the REAL InventoryWindow (handoff/item-ability-combat).
 * Real: InventoryWindow, ItemAbilityAccess, itemAuthoredAbility adapter, inventoryStore, characterStore equipItem/unequipItem,
 *       the InventoryWindow context-menu "Equip" control, spellConsequenceService store, definitionFromWizard.
 * Mocked explicitly: routeSpellCast / refreshAuthoredAbilities (the shared cast route is a spy and nothing is paid or applied),
 *       AuthoredAdmission (GM panel), conditionStore (empty stub so equip can recompute derived stats).
 * Fixture setup (not proof of a user flow): the owned item is placed in inventoryStore with a position; the room/admission entries are seeded.
 * Unequip: the equipment panel's handler (CharacterPanel.handleUnequipItem) is exactly unequipItem(slot) + addItem(result); the test performs
 *       those two store calls because CharacterPanel is not mounted here.
 * Scope (A2): local item listing is a UI convenience, NOT server possession authorization. This test proves display/wiring only.
 */
import React from 'react';
import { render, screen, fireEvent, within, act, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import InventoryWindow from '../InventoryWindow';
import useInventoryStore from '../../../store/inventoryStore';
import useCharacterStore from '../../../store/characterStore';
import useGameStore from '../../../store/gameStore';
import { registerStore, getStore } from '../../../store/storeRegistry';
import * as service from '../../../services/spellConsequenceService';
import { newItemAbility, editItemAbility } from '../../../services/itemAuthoredAbility';
import { definitionFromWizard, actionId } from '../../../services/authoredAbility';

jest.mock('../../../services/spellConsequenceService', () => {
  const actual = jest.requireActual('../../../services/spellConsequenceService');
  return { ...actual, routeSpellCast: jest.fn(() => true), refreshAuthoredAbilities: jest.fn(async () => ({ success: true })) };
});
jest.mock('../../spellcrafting-wizard/components/library/AuthoredAdmission', () => () => <div data-testid="admission" />);
beforeAll(() => { Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true }); });

const ROOM = 'room-1', DEF = 'd2398809-d3cf-4931-b8f6-24e5a382e1a5';
const values = { name: 'Amulet Mending', description: 'w', kind: 'healing', formula: '1d8+1', damageType: 'arcane', ap: 1, mana: 2, range: 30, restriction: 'ally' };
const association = editItemAbility(newItemAbility(DEF), values);
const mapped = definitionFromWizard(association.record, { roomId: ROOM, definitionVersion: 1, classId: 'arcanoneer' });
const entry = { canonicalDefinition: mapped.definition, revoked: false, definitionRef: { roomId: ROOM, definitionId: DEF, definitionVersion: 1, definitionHash: 'h' } };
const AMULET = { id: 'inv-amulet', name: 'Ward Amulet', type: 'accessory', subtype: 'amulet', width: 1, height: 1, quantity: 1, position: { row: 0, col: 0 }, authoredAbility: association };

const DEF2 = '5b0e3d4a-1111-4222-8333-944455556666';
const values2 = { name: 'Item Spark', description: 'w', kind: 'damage', formula: '1d6+2', damageType: 'arcane', ap: 1, mana: 3, range: 30, restriction: 'enemy' };
const association2 = editItemAbility(newItemAbility(DEF2), values2);
const mapped2 = definitionFromWizard(association2.record, { roomId: ROOM, definitionVersion: 1, classId: 'arcanoneer' });
const entry2 = { canonicalDefinition: mapped2.definition, revoked: false, definitionRef: { roomId: ROOM, definitionId: DEF2, definitionVersion: 1, definitionHash: 'h2' } };
const cards = () => document.querySelectorAll('.item-ability');
let previousCondition;

beforeEach(() => {
  service.routeSpellCast.mockClear();
  previousCondition = getStore('conditionStore');
  registerStore('conditionStore', { getState: () => ({ getActiveEffects: () => [] }) });
  useGameStore.setState({ multiplayerRoom: { id: ROOM } });
  service.useSpellConsequenceStore.setState({ authoredRoomId: ROOM, authoredEntries: [entry] });
  useCharacterStore.setState({ equipment: { ...useCharacterStore.getState().equipment, neck: null } });
  useInventoryStore.setState({ items: [JSON.parse(JSON.stringify(AMULET))] });
});
afterEach(() => registerStore('conditionStore', previousCondition));

function useFromCard(name) {
  const card = screen.getByText(new RegExp(`${name} —`)).closest('details');
  fireEvent.click(within(card).getByText(new RegExp(`${name} —`)));
  fireEvent.change(within(card).getByLabelText('Saved ability version'), { target: { value: actionId(entry.definitionRef) } });
  fireEvent.click(within(card).getByRole('button', { name: 'Use item ability' }));
}
async function equipThroughContextMenu() {   // the shared context menu runs its item handler after an 80 ms press animation
  fireEvent.contextMenu(document.querySelector('[draggable="true"]'));
  fireEvent.click(screen.getByText('Equip'));
  await waitFor(() => expect(useCharacterStore.getState().equipment.neck).toBeTruthy());
}

test('backpack item with an ability is listed once; Use routes the admitted definition with the item as producer', () => {
  render(<InventoryWindow />);
  expect(screen.getByRole('region', { name: 'Inventory item abilities' })).toBeInTheDocument();
  expect(cards()).toHaveLength(1);
  useFromCard('Ward Amulet');
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(service.routeSpellCast).toHaveBeenCalledWith({ id: actionId(entry.definitionRef) }, { producer: 'item: Ward Amulet' });
});

test('equip through the real context-menu control: the item leaves the backpack but its action stays, once, and still routes', async () => {
  render(<InventoryWindow />);
  await equipThroughContextMenu();
  const st = useCharacterStore.getState();
  expect(st.equipment.neck?.id).toBe('inv-amulet');
  expect(useInventoryStore.getState().items.find(i => i.id === 'inv-amulet')).toBeUndefined();
  expect(screen.getByRole('region', { name: 'Inventory item abilities' })).toBeInTheDocument();
  expect(cards()).toHaveLength(1);                                   // no duplicate entry for the worn instance
  expect(st.equipment.neck.authoredAbility).toEqual(association);    // same association bytes
  useFromCard('Ward Amulet');
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(service.routeSpellCast).toHaveBeenCalledWith({ id: actionId(entry.definitionRef) }, { producer: 'item: Ward Amulet' });
});

test('unequip (the equipment panel handler: unequipItem + addItem) keeps exactly one action entry', async () => {
  render(<InventoryWindow />);
  await equipThroughContextMenu();
  act(() => { const back = useCharacterStore.getState().unequipItem('neck'); useInventoryStore.getState().addItem(back); });
  expect(useCharacterStore.getState().equipment.neck).toBeNull();
  expect(useInventoryStore.getState().items.filter(i => i.id === 'inv-amulet')).toHaveLength(1);
  expect(cards()).toHaveLength(1);
  useFromCard('Ward Amulet');
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
});

test('no associated item anywhere: no section is rendered and nothing can route', () => {
  useInventoryStore.setState({ items: [{ ...AMULET, authoredAbility: undefined }] });
  render(<InventoryWindow />);
  expect(screen.queryByRole('region', { name: 'Inventory item abilities' })).toBeNull();
  expect(service.routeSpellCast).not.toHaveBeenCalled();
});

test('two same-named items with different associated records do not select each other’s record', () => {
  const amulet1 = { ...AMULET, id: 'amulet-1', position: { row: 0, col: 0 } };
  const amulet2 = { ...AMULET, id: 'amulet-2', position: { row: 1, col: 0 }, authoredAbility: association2 };
  service.useSpellConsequenceStore.setState({ authoredRoomId: ROOM, authoredEntries: [entry, entry2] });
  useInventoryStore.setState({ items: [amulet1, amulet2] });

  render(<InventoryWindow />);
  expect(screen.getByRole('region', { name: 'Inventory item abilities' })).toBeInTheDocument();
  expect(cards()).toHaveLength(2);

  const card1 = screen.getByText(/Ward Amulet — Amulet Mending/).closest('details');
  const card2 = screen.getByText(/Ward Amulet — Item Spark/).closest('details');

  fireEvent.click(within(card1).getByText(/Ward Amulet — Amulet Mending/));
  fireEvent.click(within(card2).getByText(/Ward Amulet — Item Spark/));

  const select1 = within(card1).getByLabelText('Saved ability version');
  const select2 = within(card2).getByLabelText('Saved ability version');

  const options1 = Array.from(select1.querySelectorAll('option')).map(o => o.value);
  expect(options1).toContain(actionId(entry.definitionRef));
  expect(options1).not.toContain(actionId(entry2.definitionRef));

  const options2 = Array.from(select2.querySelectorAll('option')).map(o => o.value);
  expect(options2).toContain(actionId(entry2.definitionRef));
  expect(options2).not.toContain(actionId(entry.definitionRef));

  fireEvent.change(select2, { target: { value: actionId(entry2.definitionRef) } });
  fireEvent.click(within(card2).getByRole('button', { name: 'Use item ability' }));

  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(service.routeSpellCast).toHaveBeenCalledWith(
    { id: actionId(entry2.definitionRef) },
    { producer: 'item: Ward Amulet' }
  );
});

test('an unsupported or unavailable route shows the existing explanation and cannot bypass admission', () => {
  const unsuppAssoc = newItemAbility('unsupported-def');
  unsuppAssoc.record.authoredDraft.effectTypes.push('debuff');
  unsuppAssoc.record.effectTypes.push('debuff');
  unsuppAssoc.record.authoredDraft.debuffConfig = unsuppAssoc.record.debuffConfig = { enabled: true, custom: { keep: 'all' } };
  const unsuppItem = { ...AMULET, id: 'unsupp-item', name: 'Curious Relic', position: { row: 0, col: 0 }, authoredAbility: unsuppAssoc };

  const unadmittedAssoc = editItemAbility(newItemAbility(DEF2), values2);
  const unadmittedItem = { ...AMULET, id: 'unadmitted-item', name: 'Silent Bell', position: { row: 1, col: 0 }, authoredAbility: unadmittedAssoc };

  service.useSpellConsequenceStore.setState({ authoredRoomId: ROOM, authoredEntries: [entry] });
  useInventoryStore.setState({ items: [unsuppItem, unadmittedItem] });

  render(<InventoryWindow />);
  expect(cards()).toHaveLength(2);

  const unsuppCard = screen.getByText(/Curious Relic —/).closest('details');
  fireEvent.click(within(unsuppCard).getByText(/Curious Relic —/));
  expect(within(unsuppCard).getByText(/Unsupported\/manual/)).toBeInTheDocument();
  expect(within(unsuppCard).queryByLabelText('Saved ability version')).toBeNull();
  expect(within(unsuppCard).queryByRole('button', { name: 'Use item ability' })).toBeNull();

  const unadmittedCard = screen.getByText(/Silent Bell —/).closest('details');
  fireEvent.click(within(unadmittedCard).getByText(/Silent Bell —/));
  expect(within(unadmittedCard).getByText(/Not loaded or changed since admission/)).toBeInTheDocument();
  expect(within(unadmittedCard).queryByRole('button', { name: 'Use item ability' })).toBeNull();

  service.routeSpellCast.mockReturnValueOnce(false);
  const admittedItem = { ...AMULET, id: 'admitted-item', position: { row: 2, col: 0 } };
  useInventoryStore.setState({ items: [admittedItem] });

  cleanup();
  render(<InventoryWindow />);
  useFromCard('Ward Amulet');
  expect(service.routeSpellCast).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('status')).toHaveTextContent(
    /Unavailable for your current owner PC\/class binding\. Select your primary attachment and check admission\. Nothing was spent\./
  );
});
