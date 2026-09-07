import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartyHUD from '../PartyHUD';
import useCharacterStore from '../../../store/characterStore';

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
          race: 'Dwarf',
          class: 'Warrior',
          background: 'Soldier',
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
    memberPositions: {},
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
    background: 'Urchin',
    backgroundDisplayName: 'Urchin',
    level: 5,
    health: { current: 45, max: 50 },
    mana: { current: 10, max: 20 },
    actionPoints: { current: 2, max: 3 },
    alignment: 'Neutral Good',
    exhaustionLevel: 0,
    updateResource: jest.fn(),
    updateTempResource: jest.fn()
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

  it('mounts corner vials with exact values on hover readouts, no numeric plaques', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas health is 45/50, Gimli health is 60/70 — exact values live on hover readouts
    expect(screen.getByLabelText('Legolas Health: 45 of 50')).toBeInTheDocument();
    expect(screen.getByLabelText('Gimli Health: 60 of 70')).toBeInTheDocument();
    // Numbers are hover-only: nothing numeric painted on the frame itself
    expect(screen.queryByText('45/50')).toBeNull();
    expect(screen.queryByText('60/70')).toBeNull();

    // Corner mounts: Legolas gets health + mana + AP, Gimli gets health + AP (no mana pool)
    expect(container.querySelectorAll('.party-corner-mount')).toHaveLength(5);
    expect(container.querySelectorAll('.mount-ap')).toHaveLength(2);
    expect(container.querySelectorAll('.mount-mana')).toHaveLength(1);
    expect(container.querySelectorAll('.mount-health')).toHaveLength(2);
  });

  it('opens a quick-adjust menu on left-click with the right-click step options', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    expect(screen.getByText('Health 45/50')).toBeInTheDocument();
    expect(screen.getByText('-5')).toBeInTheDocument();
    expect(screen.getByText('-1')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('applies mount adjustments through the shared resource handler', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Health: 45 of 50'));
    fireEvent.click(screen.getByText('-1'));
    expect(useCharacterStore.getState().updateResource).toHaveBeenCalledWith('health', 44, 50, undefined, true);
  });

  it('offers single-step options on the AP boot', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Legolas Action Points: 2 of 3'));
    expect(screen.getByText('Action Points 2/3')).toBeInTheDocument();
    const menu = document.body.querySelector('.mount-adjust-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.textContent).not.toContain('-5');
  });

  it('does not open adjust menus for other members when not GM', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    fireEvent.click(screen.getByLabelText('Gimli Health: 60 of 70'));
    expect(document.body.querySelector('.mount-adjust-menu')).toBeNull();
  });

  it('displays character background (e.g. Urchin) in the archetype line', () => {
    render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas has Urchin background
    expect(screen.getByText('Urchin')).toBeInTheDocument();
    // Gimli has Soldier background
    expect(screen.getByText('Soldier')).toBeInTheDocument();
  });

  it('uses stable draggable frame keys for persistent positioning', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Current player uses stable key 'current-player'
    expect(container.querySelector('.party-frame-current-player')).toBeInTheDocument();
    // Other member uses stable userId key 'user-456'
    expect(container.querySelector('.party-frame-user-456')).toBeInTheDocument();
  });

  it('displays alignment tag in the top header row without truncating archetype line', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Legolas alignment tag is Neutral Good in top row
    const alignmentTags = container.querySelectorAll('.member-alignment-tag');
    expect(alignmentTags.length).toBeGreaterThan(0);
    expect(screen.getByText('Neutral Good')).toBeInTheDocument();

    // Archetype lines exist and contain clean parts
    const archetypeLines = container.querySelectorAll('.member-archetype-line');
    expect(archetypeLines.length).toBe(2);
  });

  it('renders golden portrait level orb with correct level number', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    const levelOrbs = container.querySelectorAll('.portrait-level-orb');
    expect(levelOrbs.length).toBe(2);
    expect(levelOrbs[0]).toHaveAttribute('title', 'Level 5');
    expect(levelOrbs[0].querySelector('.level-number')).toHaveTextContent('5');
  });

  it('renders exhaustion plaque on frame bottom border decoupled from member name header', () => {
    const { container } = render(<PartyHUD onOpenCharacterSheet={jest.fn()} onCreateToken={jest.fn()} />);

    // Exhaustion plaque is mounted on the member frame (bottom border), not in .member-header
    const memberFrames = container.querySelectorAll('.party-member-frame');
    expect(memberFrames.length).toBe(2);

    const exhaustionBadge = memberFrames[0].querySelector('.party-exhaustion-badge');
    expect(exhaustionBadge).toBeInTheDocument();
    expect(exhaustionBadge.querySelector('.party-exhaustion-select')).toBeInTheDocument();
    expect(exhaustionBadge.querySelector('.exhaustion-label')).toHaveTextContent('Exhaustion');
    expect(exhaustionBadge.querySelector('.exhaustion-value')).toHaveTextContent('0');

    // Member header top row contains only the name and alignment
    const topRow = container.querySelector('.member-header-top-row');
    expect(topRow.querySelector('.party-exhaustion-badge')).toBeNull();
    expect(topRow.querySelector('.member-level-text')).toBeNull();
    expect(topRow.querySelector('.member-name-text')).toHaveTextContent('Legolas');
  });
});
