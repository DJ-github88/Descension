/** Legacy non-bank Arcanoneer sphere check in the mounted HUD cast handler.
 * Separate from P9: ActionBar referenced migrateBlockId without importing it, so a
 * spell carrying an `<element>_sphere` key that the bank planner does not handle threw
 * ReferenceError on Cast. Offline local play; no P9 routing is involved. */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';
import { registerStore } from '../../../store/storeRegistry';

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

// Zero-count sphere key: the bank planner leaves it unhandled, so the legacy branch runs.
const legacy = { type: 'spell', id: 'legacy_zero_sphere', name: 'Legacy Zero Sphere', icon: 'Arcane/Ebon Blaze',
  resourceCost: { actionPoints: 1, resourceValues: { mana: 2, arcane_sphere: 0 } } };

beforeEach(() => {
  registerStore('characterStore', require('../../../store/characterStore').default);
  registerStore('gameStore', require('../../../store/gameStore').default);
  registerStore('chatStore', hookOf({ notifications: { combat: [] }, addNotification: jest.fn() }));
  mockActionSlots = Array(12).fill(null); mockActionSlots[0] = legacy;
  mockGame.isInMultiplayer = false;
  [mockCharacter.updateResource, mockCharacter.updateClassResource, mockSocket.emit].forEach(fn => fn.mockClear());
});

test('legacy Arcanoneer sphere branch completes the local cast without a ReferenceError', () => {
  const errors = [];
  const onError = event => { errors.push(event.error || event.message); event.preventDefault(); };
  window.addEventListener('error', onError);
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const { container } = render(<ActionBar />);
    fireEvent.click(container.querySelectorAll('.action-slot')[0], { button: 0 });
    expect(screen.getByText('Cast Spell')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cast'));
  } finally { window.removeEventListener('error', onError); spy.mockRestore(); }
  expect(errors.map(String)).toEqual([]);
  expect(mockCharacter.updateResource).toHaveBeenCalledWith('mana', 8, undefined);
  expect(mockCharacter.updateResource).toHaveBeenCalledWith('actionPoints', 1, undefined);
});
