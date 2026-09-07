import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';

jest.mock('../../../store/characterStore', () => {
  const mockState = {
    character: { id: 'char-test-1', name: 'Bram', class: 'False Prophet' },
    classResource: {},
    class: 'False Prophet',
    updateClassResourceField: jest.fn(),
    useItem: jest.fn(),
    inventory: [],
    equippedItems: {},
    spells: [],
    preparedSpells: []
  };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return store;
});

jest.mock('../../../store/inventoryStore', () => {
  const mockState = { items: [] };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return store;
});

jest.mock('../../../store/diceStore', () => ({
  __esModule: true,
  default: () => ({}),
  useDiceStore: () => ({})
}));

jest.mock('../../../store/chatStore', () => ({
  __esModule: true,
  default: {
    getState: () => ({ addCombatNotification: jest.fn() })
  },
  useChatStore: {
    getState: () => ({ addCombatNotification: jest.fn() })
  }
}));

jest.mock('../../../store/conditionStore', () => ({
  __esModule: true,
  default: () => ({}),
  useConditionStore: () => ({})
}));

const classSpell = { id: 's1', name: 'Silence Whisper', description: 'whispers', category: 'class', spellType: 'PASSIVE' };
const classSpell2 = { id: 's2', name: 'Halo of Static', description: 'halo', category: 'class', spellType: 'ACTION' };
const racialSpell = { id: 's3', name: 'Marked Howl', description: 'howl', category: 'racial', spellType: 'ACTION' };
const tonic = { id: 'c1', name: 'Blood Tonic', description: 'heals', type: 'consumable' };

jest.mock('../../../hooks/useCharacterSpells', () => ({
  useCharacterSpells: () => ({
    allSpells: [classSpell, classSpell2, racialSpell],
    consumables: [tonic],
    counts: { all: 3, class: 2, talent: 0, racial: 1, skill: 0, general: 0, custom: 0, consumable: 1 }
  })
}));

describe('SpellActionBar quick-assign icon tabs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const openModal = (container) => {
    const emptySlot = container.querySelector('.spell-action-slot:not(.has-spell)');
    expect(emptySlot).toBeInTheDocument();
    fireEvent.click(emptySlot);
  };

  it('renders icon-only tabs with count badges and accessible names', () => {
    const { container } = render(<SpellActionBar characterId="char-test-1" />);
    openModal(container);

    const tabs = container.querySelectorAll('.spell-quick-assign-tab');
    // All, Class, Racial, Consumables (talent/skill/general are empty)
    expect(tabs.length).toBe(4);

    // Icon + count badge only — no text labels crowding the row
    tabs.forEach((tab) => {
      expect(tab.querySelector('i')).toBeInTheDocument();
      expect(tab.querySelector('.spell-quick-assign-tab-count')).toBeInTheDocument();
      expect(tab.textContent).toMatch(/^\d+$/);
    });

    expect(screen.getByRole('tab', { name: 'All (4)' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'False Prophet (2)' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Racial & Path (1)' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Consumables (1)' })).toBeInTheDocument();
  });

  it('filters the list when an icon tab is clicked', () => {
    const { container } = render(<SpellActionBar characterId="char-test-1" />);
    openModal(container);

    expect(screen.getByText('Silence Whisper')).toBeInTheDocument();
    expect(screen.getByText('Marked Howl')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Racial & Path (1)' }));
    expect(screen.queryByText('Silence Whisper')).toBeNull();
    expect(screen.getByText('Marked Howl')).toBeInTheDocument();
  });
});
