import React from 'react';
import { render } from '@testing-library/react';
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

describe('SpellActionBar Wing & Tools Separation', () => {
  test('cog and trash bin are not in the same box as offHand and ranged', () => {
    const { container } = render(<SpellActionBar characterId="char-test-1" />);

    const rightWing = container.querySelector('.action-bar-wing-right');
    expect(rightWing).toBeInTheDocument();

    // The right wing should contain offHand and ranged slots
    expect(rightWing.querySelector('[data-slot="offHand"], .equipment-action-slot')).toBeInTheDocument();

    // The cog and trash buttons must NOT be inside .action-bar-wing-right
    expect(rightWing.querySelector('.spell-action-cog-btn')).toBeNull();
    expect(rightWing.querySelector('.spell-bar-clear-inline-btn')).toBeNull();
    expect(rightWing.querySelector('.spell-action-tools-cluster')).toBeNull();

    // The tools cluster exists outside the wing as a sibling within the assembly
    const toolsCluster = container.querySelector('.spell-action-tools-cluster');
    expect(toolsCluster).toBeInTheDocument();
    expect(toolsCluster.querySelector('.spell-action-cog-btn')).toBeInTheDocument();
    expect(toolsCluster.querySelector('.spell-bar-clear-inline-btn')).toBeInTheDocument();
    expect(toolsCluster.parentElement).toHaveClass('spell-action-bar-assembly');
  });
});
