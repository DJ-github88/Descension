import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';

// Mock RoomContext
jest.mock('../../../contexts/RoomContext', () => ({
  useRoomContext: () => ({ currentRoomId: 'room-1' })
}));

// Mock ActionBar Persistence
jest.mock('../../../hooks/useActionBarPersistence', () => ({
  useActionBarPersistence: () => ({
    actionSlots: Array(12).fill(null),
    updateSlot: jest.fn(),
    clearSlot: jest.fn(),
    updateActionSlots: jest.fn(),
    isLoading: false
  })
}));

// Mock Zustand stores with required mock implementations
jest.mock('../../../store/inventoryStore', () => {
  const store = {
    items: [],
    removeItem: jest.fn()
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/conditionStore', () => {
  const store = {
    addCondition: jest.fn()
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterStore', () => {
  const store = {
    updateResource: jest.fn(),
    gainClassResource: jest.fn(),
    consumeClassResource: jest.fn(),
    health: { current: 30, max: 50 },
    mana: { current: 15, max: 20 },
    actionPoints: { current: 3, max: 3 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,
    experience: 250,
    updateTempResource: jest.fn(),
    currentCharacterId: 'character-123',
    id: 'character-123',
    name: 'Conan'
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/combatStore', () => {
  const store = {
    isInCombat: false,
    getCurrentCombatant: () => null,
    round: 1,
    currentTurnIndex: 0,
    turnOrder: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    setCooldown: jest.fn(),
    clearCooldown: jest.fn(),
    clearAllCooldowns: jest.fn(),
    restoreCooldowns: jest.fn(),
    activeCooldowns: [],
    currentPlayer: { id: 'player-1', name: 'Conan' }
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    spells: []
  })
}));

jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getAbilityIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

// Mock subcomponents
jest.mock('../HotkeyAssignmentPopup', () => {
  return function MockHotkey() { return <div data-testid="hotkey-popup" />; };
});

jest.mock('../SpellCastConfirmation', () => {
  return function MockConfirmation() { return <div data-testid="cast-confirmation" />; };
});

jest.mock('../CooldownAdjustmentMenu', () => {
  return function MockCooldown() { return <div data-testid="cooldown-menu" />; };
});

jest.mock('../ExperienceBar', () => {
  return function MockExpBar() { return <div data-testid="experience-bar" />; };
});

describe('ActionBar Component', () => {
  it('renders all 12 action bar slots', () => {
    const { container } = render(<ActionBar />);

    const slots = container.getElementsByClassName('action-slot');
    expect(slots.length).toBe(12);
  });

  it('renders experience bar inside the container', () => {
    render(<ActionBar />);
    expect(screen.getByTestId('experience-bar')).toBeInTheDocument();
  });
});
