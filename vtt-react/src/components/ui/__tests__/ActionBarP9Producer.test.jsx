/** P9 S8: the mounted HUD producer routes supported spells to owner approval with
 * zero local spend, cooldown or empty-target notice; unsupported spells stay manual. */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';
import { registerStore } from '../../../store/storeRegistry';
import { useSpellConsequenceStore } from '../../../services/spellConsequenceService';

let mockActionSlots = Array(12).fill(null);
const mockCharacter = {
  updateResource: jest.fn(), gainClassResource: jest.fn(), consumeClassResource: jest.fn(), updateClassResource: jest.fn(), updateTempResource: jest.fn(),
  class: 'Arcanoneer', name: 'Ilse', currentCharacterId: 'ilse', id: 'ilse', level: 3, experience: 0,
  stats: { strength: 10, agility: 10, constitution: 10, intelligence: 16, spirit: 10, charisma: 10 },
  classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] },
  health: { current: 30, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1
};
const mockSocket = { emit: jest.fn(), connected: true };
const mockGame = { setCooldown: jest.fn(), clearCooldown: jest.fn(), clearAllCooldowns: jest.fn(), restoreCooldowns: jest.fn(), activeCooldowns: [],
  currentPlayer: { id: 'player-1', name: 'Ilse' }, isInMultiplayer: true, multiplayerRoom: { id: 'room-p9' }, multiplayerSocket: mockSocket };
const hookOf = state => { const hook = selector => (selector ? selector(state) : state); hook.getState = () => state; hook.setState = () => {}; hook.subscribe = () => () => {}; return hook; };

jest.mock('../../../contexts/RoomContext', () => ({ useRoomContext: () => ({ currentRoomId: 'room-p9' }) }));
jest.mock('../../../hooks/useActionBarPersistence', () => ({
  useActionBarPersistence: () => ({ actionSlots: mockActionSlots, updateSlot: jest.fn(), clearSlot: jest.fn(), updateActionSlots: jest.fn(), isLoading: false })
}));
jest.mock('../../../store/inventoryStore', () => { const s = { items: [], removeItem: jest.fn() }; const h = sel => sel(s); h.getState = () => s; h.subscribe = () => () => {}; return { __esModule: true, default: h }; });
jest.mock('../../../store/conditionStore', () => { const s = { addCondition: jest.fn() }; const h = sel => sel(s); h.getState = () => s; h.subscribe = () => () => {}; return { __esModule: true, default: h }; });
jest.mock('../../../store/characterStore', () => {
  const h = sel => (sel ? sel(mockCharacter) : mockCharacter); h.getState = () => mockCharacter; h.subscribe = () => () => {};
  return { __esModule: true, default: h };
});
jest.mock('../../../store/combatStore', () => {
  const s = { isInCombat: false, getCurrentCombatant: () => null, round: 1, currentTurnIndex: 0, turnOrder: [] };
  const h = sel => (sel ? sel(s) : s); h.getState = () => s; h.subscribe = () => () => {}; return { __esModule: true, default: h };
});
jest.mock('../../../store/gameStore', () => { const h = sel => (sel ? sel(mockGame) : mockGame); h.getState = () => mockGame; h.subscribe = () => () => {}; return { __esModule: true, default: h }; });
jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({ useSpellLibrary: () => ({ spells: [] }) }));
jest.mock('../../../utils/assetManager', () => ({ getIconUrl: i => `icon:${i}`, getCustomIconUrl: i => `icon:${i}`, getAbilityIconUrl: i => `icon:${i}` }));
jest.mock('../HotkeyAssignmentPopup', () => function MockHotkey() { return null; });
jest.mock('../../../store/partyStore', () => ({ __esModule: true, default: { getState: () => ({ partyMembers: [] }) } }));
jest.mock('../CooldownAdjustmentMenu', () => function MockCooldown() { return null; });
jest.mock('../ExperienceBar', () => function MockExpBar() { return null; });

const slug = { type: 'spell', id: 'arc_spark_bolt', name: 'Marrow-Piercing Slug', icon: 'Arcane/Ebon Blaze', cooldownConfig: { type: 'turn_based', value: 2 } };
const clasp = { type: 'spell', id: 'arc_frost_touch', name: 'Rime-Iron Clasp', icon: 'Frost/Frozen', resourceCost: { actionPoints: 1, resourceValues: { mana: 4 } } };

beforeEach(() => {
  registerStore('characterStore', require('../../../store/characterStore').default);
  registerStore('gameStore', require('../../../store/gameStore').default);
  registerStore('chatStore', hookOf({ notifications: { combat: [] }, addNotification: jest.fn() }));
  mockActionSlots = Array(12).fill(null); mockActionSlots[0] = slug; mockActionSlots[1] = clasp;
  mockGame.isInMultiplayer = true;
  [mockCharacter.updateResource, mockCharacter.consumeClassResource, mockCharacter.updateClassResource, mockSocket.emit, mockGame.setCooldown].forEach(fn => fn.mockClear());
  useSpellConsequenceStore.setState({ owner: null, ownerStatus: null });
});
const slotButton = (container, index) => container.querySelectorAll('.action-slot')[index];

test('supported HUD spell opens owner approval with zero local spend, cooldown or empty-target emit', () => {
  const { container } = render(<ActionBar />);
  fireEvent.click(slotButton(container, 0), { button: 0 });
  expect(useSpellConsequenceStore.getState().owner).toEqual({ spellId: 'arc_spark_bolt', origin: { producer: 'hud', slotIndex: 0 } });
  expect(screen.queryByText('Cast Spell')).toBeNull();
  expect(mockCharacter.updateResource).not.toHaveBeenCalled();
  expect(mockCharacter.updateClassResource).not.toHaveBeenCalled();
  expect(mockSocket.emit).not.toHaveBeenCalled();
  expect(mockGame.setCooldown).not.toHaveBeenCalled();
});

test('the cooldown starts only from the accepted-receipt event for that exact slot and spell', () => {
  render(<ActionBar />);
  act(() => { window.dispatchEvent(new CustomEvent('mythrill:p9-spell-accepted', { detail: { slotIndex: 0, spellId: 'other_spell', cooldown: { type: 'turn_based', value: 2 } } })); });
  expect(mockGame.setCooldown).not.toHaveBeenCalled();
  act(() => { window.dispatchEvent(new CustomEvent('mythrill:p9-spell-accepted', { detail: { slotIndex: 0, spellId: 'arc_spark_bolt', cooldown: { type: 'turn_based', value: 2 } } })); });
  expect(mockGame.setCooldown).toHaveBeenCalledTimes(1);
  expect(mockGame.setCooldown).toHaveBeenCalledWith(0, expect.objectContaining({ cooldownType: 'turn_based', maxCooldown: 2, spellId: 'arc_spark_bolt' }));
});

test('unsupported spells keep the manual confirmation with the P9 diagnostic', () => {
  const { container } = render(<ActionBar />);
  fireEvent.click(slotButton(container, 1), { button: 0 });
  expect(useSpellConsequenceStore.getState().owner).toBeNull();
  expect(screen.getByText(/Manual — not applied to the room:/)).toBeInTheDocument();
});

test('offline play is unchanged: the supported spell uses the existing local confirmation', () => {
  mockGame.isInMultiplayer = false;
  const { container } = render(<ActionBar />);
  fireEvent.click(slotButton(container, 0), { button: 0 });
  expect(useSpellConsequenceStore.getState().owner).toBeNull();
  expect(screen.getByText('Cast Spell')).toBeInTheDocument();
  expect(screen.queryByText(/Manual — not applied/)).toBeNull();
});
