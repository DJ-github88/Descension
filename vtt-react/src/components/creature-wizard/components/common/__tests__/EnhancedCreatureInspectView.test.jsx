import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedCreatureInspectView from '../EnhancedCreatureInspectView';
import useTabOverflow from '../../../../common/useTabOverflow';

// Mock Zustand stores to avoid Firebase/Socket connections during testing
jest.mock('../../../../../store/windowManagerStore', () => {
  const store = {
    registerWindow: jest.fn(),
    bringToFront: jest.fn(),
    unregisterWindow: jest.fn(),
    layoutVersion: 1,
    getCascadeOffset: () => ({ x: 0, y: 0 })
  };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../../../store/settingsStore', () => {
  const store = { windowScale: 1 };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../../../store/gameStore', () => {
  const store = { currentRoomId: 'room-test' };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../../../store/creatureStore', () => {
  const store = { tokens: [] };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../../../store/gridItemStore', () => {
  const store = { addItemToGrid: jest.fn() };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../../../store/itemStore', () => {
  const store = { items: [] };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../../../store/diceStore', () => {
  const store = { roll: jest.fn() };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../../../utils/InfiniteGridSystem', () => ({
  getGridSystem: jest.fn(() => ({
    worldToGrid: jest.fn(() => ({ x: 0, y: 0 })),
    gridToWorld: jest.fn(() => ({ x: 0, y: 0 }))
  })),
  createGridSystem: jest.fn()
}));

jest.mock('../../../../common/useTabOverflow');

jest.mock('../../../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    getSpellById: () => null
  })
}));

describe('EnhancedCreatureInspectView TTRPG Theme & Tab Overflow', () => {
  const mockCreature = {
    id: 'creature-dire-wolf',
    name: 'Frostfang Dire Wolf',
    description: 'A predatory dire wolf native to the frozen peaks.',
    habitat: 'Frozen Tundra',
    stats: {
      level: 4,
      challengeRating: 4,
      health: 68,
      maxHealth: 68,
      actionPoints: 3,
      maxActionPoints: 3,
      physicalDefense: 15,
      magicalDefense: 12,
      strength: 18,
      agility: 14,
      vitality: 16,
      intelligence: 6,
      wisdom: 12,
      charisma: 8,
      skillRanks: {
        athletics: 'ADEPT',
        perception: 'ADEPT',
        stealth: 'NOVICE'
      }
    },
    lootTable: [
      { itemId: 'wolf-pelt', name: 'Frostfang Pelt', dropChance: 100, quantity: 1 }
    ]
  };

  beforeEach(() => {
    // Re-apply mock implementation each time because CRA sets resetMocks: true
    useTabOverflow.mockImplementation(({ itemIds = [] }) => ({
      containerRef: { current: null },
      containerWidth: 900,
      visibleCount: itemIds.length,
      visibleIds: itemIds,
      hiddenIds: []
    }));
  });

  test('renders creature name as window title instead of default WINDOW', () => {
    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // Title should display creature's name
    expect(screen.getByText('Frostfang Dire Wolf')).toBeInTheDocument();
    expect(screen.queryByText(/^WINDOW$/i)).not.toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={false}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText('Frostfang Dire Wolf')).not.toBeInTheDocument();
  });

  test('renders adventurer tabs and stat rows in statistics section', () => {
    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // Adventurer tab strip container
    const tabTrack = document.querySelector('.character-sheet-tabs');
    expect(tabTrack).toBeInTheDocument();

    // Standard adventurer tabs
    expect(screen.getByRole('button', { name: 'Statistics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abilities & Spells' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tactics & Behavior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Loot Table' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Description & Lore' })).toBeInTheDocument();

    // Stat rows rendered with enhanced adventurer class
    const statRows = document.querySelectorAll('.enhanced-stat-row');
    expect(statRows.length).toBeGreaterThan(0);
  });

  test('displays tab overflow trigger button when tabs exceed available width', () => {
    useTabOverflow.mockImplementation(({ itemIds = [] }) => ({
      containerRef: { current: null },
      containerWidth: 400,
      visibleCount: 3,
      visibleIds: itemIds.slice(0, 3),
      hiddenIds: itemIds.slice(3)
    }));

    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // The overflow button (⋮) should be visible
    const overflowTrigger = screen.getByLabelText('More sections');
    expect(overflowTrigger).toBeInTheDocument();
    expect(overflowTrigger).toHaveClass('tab-overflow-trigger');

    // Clicking the overflow trigger opens the portaled adventurer overflow menu
    fireEvent.click(overflowTrigger);

    const overflowMenu = document.querySelector('.tab-overflow-menu.adventurer-menu');
    expect(overflowMenu).toBeInTheDocument();

    // The hidden tabs should be in the overflow menu
    const hiddenTabButtons = overflowMenu.querySelectorAll('.tab-dropdown-item');
    expect(hiddenTabButtons.length).toBe(3);
  });

  test('allows navigating to Description & Lore and renders lore content with header', () => {
    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    const loreTab = screen.getByRole('button', { name: 'Description & Lore' });
    fireEvent.click(loreTab);

    // Check lore section header and description content
    expect(screen.getByRole('heading', { level: 2, name: 'Description & Lore' })).toBeInTheDocument();
    expect(screen.getByText('A predatory dire wolf native to the frozen peaks.')).toBeInTheDocument();
    expect(screen.getByText('Frozen Tundra')).toBeInTheDocument();
  });

  test('opens adventurer-styled skills dropdown and suppresses native tooltip', () => {
    render(
      <EnhancedCreatureInspectView
        creature={mockCreature}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    const skillsTab = screen.getByRole('button', { name: 'Skills' });
    // Title is present when closed
    expect(skillsTab).toHaveAttribute('title', 'Skills');

    // Click to open dropdown
    fireEvent.click(skillsTab);

    // Native title tooltip should be cleared while dropdown is open
    expect(skillsTab).not.toHaveAttribute('title');

    // Portaled adventurer menu exists
    const menu = document.querySelector('.tab-dropdown-menu.adventurer-menu');
    expect(menu).toBeInTheDocument();

    // Section headers use the tab-dropdown-section-header class
    const sectionHeaders = menu.querySelectorAll('.tab-dropdown-section-header');
    expect(sectionHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText('Combat Mastery')).toBeInTheDocument();
  });

  test('navigates to Abilities & Spells and renders ability selector bar and card without crashing', () => {
    const creatureWithAbilities = {
      ...mockCreature,
      abilities: [
        {
          id: 'bite-1',
          name: 'Frostfang Bite',
          description: 'A vicious bite dealing cold damage.',
          damage: { diceCount: 2, diceType: 6, bonus: 3, damageType: 'frost' },
          priorityRange: { min: 1, max: 20, resolution: 'DICE' }
        }
      ]
    };

    render(
      <EnhancedCreatureInspectView
        creature={creatureWithAbilities}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    const abilitiesTab = screen.getByRole('button', { name: 'Abilities & Spells' });
    fireEvent.click(abilitiesTab);

    // Section header should be present
    expect(screen.getByRole('heading', { level: 2, name: 'Abilities & Spells' })).toBeInTheDocument();
    // Selector bar and ability title
    expect(screen.getByRole('tablist', { name: 'Creature abilities' })).toBeInTheDocument();
    expect(screen.getByText('Frostfang Bite', { selector: '.selected-ability-name' })).toBeInTheDocument();
  });
});
