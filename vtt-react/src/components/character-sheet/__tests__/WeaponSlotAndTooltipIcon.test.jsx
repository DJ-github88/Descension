import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ItemTooltip from '../../item-generation/ItemTooltip';
import SpellActionBar from '../SpellActionBar';

jest.mock('../../../store/characterStore', () => {
  const mockState = {
    character: { id: 'char-test-1', name: 'Lyra', class: 'Minstrel' },
    classResource: { notes: [3, 2, 2, 1, 1, 0, 0] },
    class: 'Minstrel',
    updateClassResourceField: jest.fn(),
    useItem: jest.fn(),
    inventory: [],
    equipment: {
      mainHand: {
        id: 'test-dagger',
        name: 'Bog-Iron Shank',
        type: 'weapon',
        slots: ['mainHand'],
        icon: 'Armor/Neck/magical-sword-pendant'
      }
    },
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

describe('Weapon Slot and ItemTooltip Icon Resolution', () => {
  test('ItemTooltip resolves item.icon to the correct URL and does not show question mark book', () => {
    const itemWithIcon = {
      name: 'Bog-Iron Shank',
      type: 'weapon',
      slots: ['mainHand'],
      icon: 'Armor/Neck/magical-sword-pendant'
    };

    const { container } = render(<ItemTooltip item={itemWithIcon} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('magical-sword-pendant');
    expect(img.src).not.toContain('book-brown');
  });

  test('ItemTooltip falls back to appropriate weapon icon for weapons without explicit iconId', () => {
    const swordWeapon = {
      name: 'Rusty Shortsword',
      type: 'weapon',
      slots: ['mainHand']
    };

    const { container: swordContainer } = render(<ItemTooltip item={swordWeapon} />);
    const swordImg = swordContainer.querySelector('img');
    expect(swordImg).toBeInTheDocument();
    expect(swordImg.src).toContain('sword-basic-straight-beige-blade-brown-hilt');
    expect(swordImg.src).not.toContain('book-brown');

    const genericWeapon = {
      name: 'Ancient Artifact',
      type: 'weapon',
      slots: ['mainHand']
    };
    const { container: genericContainer } = render(<ItemTooltip item={genericWeapon} />);
    const genericImg = genericContainer.querySelector('img');
    expect(genericImg).toBeInTheDocument();
    expect(genericImg.src).toContain('magical-sword-pendant');
    expect(genericImg.src).not.toContain('book-brown');
  });

  test('Griefwood Staff resolves legacy Weapons/Staves iconId to valid staff icon instead of placeholder book', () => {
    const griefwoodStaff = {
      id: 'griefwood-staff',
      name: 'Griefwood Staff',
      type: 'weapon',
      subtype: 'STAFF',
      quality: 'common',
      weaponSlot: 'TWO_HANDED',
      slots: ['mainHand'],
      hand: 'MAIN_HAND',
      iconId: 'Weapons/Staves/staff-basic-gnarled-dark-brown'
    };

    const { container } = render(<ItemTooltip item={griefwoodStaff} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('staff-wooden-curved-head-bone-tip-red-orange-details');
    expect(img.src).not.toContain('book-brown');
  });

  test('SpellActionBar displays weapon in mainHand and displays tooltip on hover without crash', () => {
    const { container } = render(<SpellActionBar characterId="char-test-1" />);

    const mhSlot = container.querySelector('.slot-mainHand .equipment-action-slot');
    expect(mhSlot).toBeInTheDocument();

    const img = mhSlot.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('magical-sword-pendant');

    // Trigger mouse enter
    fireEvent.mouseEnter(mhSlot);

    // Floating tooltip should be portaled
    const tooltip = document.querySelector('.equipment-slot-floating-tooltip');
    expect(tooltip).toBeInTheDocument();
  });
});
