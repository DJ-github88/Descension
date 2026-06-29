import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartyHUD from '../PartyHUD';

// Mock all required Zustand stores
jest.mock('../../../store/partyStore', () => {
  const store = {
    partyMembers: [
      {
        id: 'current-player',
        userId: 'user-123',
        name: 'Legolas',
        isConnected: true,
        isGM: false,
        character: {
          name: 'Legolas',
          class: 'Hunter',
          level: 5,
          health: { current: 45, max: 50 },
          mana: { current: 10, max: 20 },
          actionPoints: { current: 2, max: 3 }
        }
      },
      {
        id: 'member-2',
        userId: 'user-456',
        name: 'Gimli',
        isConnected: true,
        isGM: false,
        character: {
          name: 'Gimli',
          class: 'Warrior',
          level: 5,
          health: { current: 60, max: 70 },
          mana: { current: 0, max: 0 },
          actionPoints: { current: 1, max: 3 }
        }
      }
    ],
    isInParty: true,
    removePartyMember: jest.fn(),
    updatePartyMember: jest.fn(),
    getMemberPosition: () => ({ x: 10, y: 10 }),
    setMemberPosition: jest.fn(),
    currentParty: { id: 'party-123', name: 'Fellowship' },
    leaderId: 'user-123'
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/targetingStore', () => {
  const store = {
    setTarget: jest.fn(),
    currentTarget: null,
    clearTarget: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterStore', () => {
  const store = {
    name: 'Legolas',
    baseName: 'Legolas',
    race: 'Elf',
    class: 'Hunter',
    level: 5,
    health: { current: 45, max: 50 },
    mana: { current: 10, max: 20 },
    actionPoints: { current: 2, max: 3 },
    alignment: 'Neutral Good',
    exhaustionLevel: 0
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
    setGMMode: jest.fn(),
    isGMMode: false,
    toggleGMMode: jest.fn(),
    isInMultiplayer: false,
    multiplayerRoom: null,
    currentPlayer: { id: 'user-123', name: 'Legolas' },
    multiplayerSocket: { id: 'socket-123' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/settingsStore', () => {
  const store = {
    windowScale: 1
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/conditionStore', () => {
  const store = {
    removeCondition: jest.fn(),
    updateConditionDuration: jest.fn(),
    getRemainingTime: () => 10,
    getConditionsForTarget: () => [],
    activeBuffs: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/chatStore', () => {
  const store = {
    addNotification: jest.fn(),
    addCombatNotification: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/presenceStore', () => {
  const store = {
    currentUserPresence: { status: 'online' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/authStore', () => {
  const store = {
    user: { uid: 'user-123' }
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterTokenStore', () => {
  const store = {
    characterTokens: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

// Mock external subcomponents that are complex or pull extra dependencies
jest.mock('../ClassResourceBar', () => {
  return function MockClassResourceBar() {
    return <div data-testid="class-resource-bar" />;
  };
});

jest.mock('../SummonTokenBar', () => {
  return function MockSummonTokenBar() {
    return <div data-testid="summon-token-bar" />;
  };
});

describe('PartyHUD Component', () => {
  it('renders party member frames with names and levels', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    expect(screen.getByText(/Legolas/)).toBeInTheDocument();
    expect(screen.getByText(/Gimli/)).toBeInTheDocument();
  });

  it('displays correct resource status bars', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas health is 45/50
    expect(screen.getByText('45/50')).toBeInTheDocument();
    // Gimli health is 60/70
    expect(screen.getByText('60/70')).toBeInTheDocument();
  });
});
