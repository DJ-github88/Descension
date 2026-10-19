/** P9 S8: the mounted sheet producer (spell slots and equipment weapon actions)
 * never pre-spends a supported spell in a shared room. */
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';
import { registerStore } from '../../../store/storeRegistry';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';

let mockState;
const mockGame = { isInMultiplayer: true, multiplayerRoom: { id: 'room-p9' }, multiplayerSocket: { emit: jest.fn(), connected: true } };
jest.mock('../../../store/characterStore', () => {
  const hook = selector => selector ? selector(mockState) : mockState;
  hook.getState = () => mockState;
  return { __esModule: true, default: hook };
});
jest.mock('../../../store/inventoryStore', () => { const hook = s => s ? s({ items: [] }) : { items: [] }; hook.getState = () => ({ items: [] }); return { __esModule: true, default: hook }; });
jest.mock('../../../store/diceStore', () => { const hook = () => ({}); hook.getState = () => ({ rollDiceDirectly: jest.fn() }); return { __esModule: true, default: hook }; });
jest.mock('../../../store/chatStore', () => ({ __esModule: true, default: { getState: () => ({ addCombatNotification: jest.fn(), notifications: { combat: [] }, addNotification: jest.fn() }) } }));
jest.mock('../../../store/conditionStore', () => ({ __esModule: true, default: () => ({}) }));
jest.mock('../../../hooks/useCharacterSpells', () => ({ useCharacterSpells: () => ({ allSpells: [], consumables: [], counts: { all: 0, consumable: 0 } }) }));
jest.mock('../../spellcrafting-wizard/components/common/UnifiedSpellCard', () => ({ __esModule: true, default: () => null }));

const chord = MINSTREL_DATA.spells.find(entry => entry.id === 'minstrel_opening_chord');
const resolving = MINSTREL_DATA.spells.find(entry => entry.id === 'minstrel_resolving_strike');
const gameHook = () => { const hook = s => (s ? s(mockGame) : mockGame); hook.getState = () => mockGame; hook.setState = () => {}; return hook; };
const setup = (inRoom = true) => {
  localStorage.clear();
  mockGame.isInMultiplayer = inRoom;
  mockState = {
    class: 'Minstrel', name: 'Wren', currentCharacterId: 'wren', classResource: { type: 'musicalNotes', notes: [4, 0, 0, 0, 0, 0, 0] },
    stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 13, charisma: 10 },
    health: { current: 100, max: 100 }, mana: { current: 50, max: 50 }, actionPoints: { current: 3, max: 3 }, tempMana: 0, tempActionPoints: 0,
    preparedSpells: [], spells: [], inventory: [], equippedItems: {}, equipment: {},
    consumeClassResource: jest.fn(), gainClassResource: jest.fn(), updateClassResource: jest.fn(), updateResource: jest.fn()
  };
  registerStore('characterStore', require('../../../store/characterStore').default);
  registerStore('gameStore', gameHook());
  useSpellConsequenceStore.setState({ owner: null, ownerStatus: null });
};
const cast = spell => {
  render(<SpellActionBar characterId={`p9-${spell.id}`} allSpells={[spell]} />);
  act(() => window.dispatchEvent(new CustomEvent('spell-action-bar-assign-item', { detail: { spell, autoFindSlot: true } })));
  fireEvent.click(screen.getByAltText(spell.name));
  fireEvent.click(screen.getByRole('button', { name: /Cast Spell/ }));
};

test('supported Opening Chord in a shared room opens owner approval and spends nothing locally', () => {
  setup(true);
  cast(chord);
  expect(useSpellConsequenceStore.getState().owner).toEqual({ spellId: 'minstrel_opening_chord', origin: { producer: 'sheet', slotIndex: null } });
  expect(screen.queryByRole('button', { name: /Confirm & Cast/ })).toBeNull();
  for (const fn of [mockState.updateResource, mockState.updateClassResource, mockState.consumeClassResource, mockState.gainClassResource]) expect(fn).not.toHaveBeenCalled();
  expect(mockGame.multiplayerSocket.emit).not.toHaveBeenCalled();
});

test('unsupported spells keep the sheet manual confirmation and say why', () => {
  setup(true);
  cast(resolving);
  expect(useSpellConsequenceStore.getState().owner).toBeNull();
  expect(screen.getByRole('note').textContent).toMatch(/Manual — the VTT applies nothing in this room.*Reason: .*resolvesCadence/);
  // P12C-B1 §3: confirming a manual action in a shared room posts a notice and spends nothing.
  fireEvent.click(screen.getByRole('button', { name: /Post manual notice/ }));
  expect(mockState.updateResource).not.toHaveBeenCalled();
});

test('offline the sheet keeps its existing local cast path for the same spell', () => {
  setup(false);
  cast(chord);
  expect(useSpellConsequenceStore.getState().owner).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Confirm & Cast/ }));
  expect(mockState.updateResource).toHaveBeenCalledWith('mana', 46);
});
