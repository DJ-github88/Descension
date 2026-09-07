import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';

jest.mock('../../../store/characterStore', () => {
  const mockState = {
    character: { id: 'char-test-1', name: 'Lyra', class: 'Minstrel' },
    classResource: { notes: [3, 2, 2, 1, 1, 0, 0] },
    class: 'Minstrel',
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

jest.mock('../../../hooks/useCharacterSpells', () => ({
  useCharacterSpells: () => ({
    allSpells: [],
    consumables: [],
    counts: { all: 0, consumable: 0 }
  })
}));

describe('SpellActionBar Assignment', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('assigns spell to first available slot when receiving spell-action-bar-assign-item event', () => {
    render(<SpellActionBar characterId="char-test-1" />);

    const testSpell = {
      id: 'cadence_perfect',
      name: 'Perfect Cadence',
      description: 'Test harmonic wave',
      spellType: 'ACTION',
      _cadenceNotes: { I: 2, V: 1 }
    };

    act(() => {
      window.dispatchEvent(
        new CustomEvent('spell-action-bar-assign-item', {
          detail: { spell: testSpell, autoFindSlot: true }
        })
      );
    });

    expect(screen.getByAltText('Perfect Cadence')).toBeInTheDocument();
  });
});