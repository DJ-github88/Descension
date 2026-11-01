import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';
import CharacterPanel from '../CharacterPanel';
import { SpellLibraryProvider } from '../../spellcrafting-wizard/context/SpellLibraryContext';

// Mock stores for SpellActionBar & CharacterPanel
const mockCharacterState = {
  character: { id: 'char-test-1', name: 'Lyra', class: 'Minstrel' },
  currentCharacterId: 'char-test-1',
  name: 'Lyra',
  class: 'Minstrel',
  race: 'human',
  subrace: 'highlander',
  path: '',
  level: 3,
  stats: { strength: 12, agility: 14, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
  equipmentBonuses: {},
  derivedStats: {},
  resistances: {},
  spellPower: {},
  health: { current: 40, max: 40 },
  mana: { current: 30, max: 30 },
  actionPoints: { current: 3, max: 3 },
  classResource: { notes: [3, 2, 2, 1, 1, 0, 0] },
  skillRanks: {
    weaponMastery_dagger: 'NOVICE',
    weaponMastery_sword: 'ADEPT',
    weaponMastery_bow: 'TRAINED'
  },
  skillProgress: {},
  equipment: {
    mainHand: {
      id: 'test-dagger',
      name: 'Bog-Iron Shank',
      subtype: 'DAGGER',
      type: 'weapon',
      slots: ['mainHand'],
      icon: 'Armor/Neck/magical-sword-pendant',
      weaponStats: {
        baseDamage: { diceCount: 1, diceType: 4, damageType: 'Piercing' }
      }
    },
    offHand: {
      id: 'test-shield',
      name: 'Wooden Heater Shield',
      subtype: 'SHIELD',
      slots: ['offHand'],
      icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
      blockingDice: '1d4'
    }
  },
  inventory: [],
  spells: [],
  preparedSpells: [],
  updateCharacterInfo: jest.fn(),
  updateEquipment: jest.fn(),
  unequipItem: jest.fn(),
  useItem: jest.fn()
};

jest.mock('../../../store/characterStore', () => {
  const store = (selector) => (selector ? selector(mockCharacterState) : mockCharacterState);
  store.getState = () => mockCharacterState;
  return store;
});

jest.mock('../../../store/inventoryStore', () => {
  const mockState = { items: [] };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return store;
});

jest.mock('../../../store/partyStore', () => {
  const mockState = { party: null, partyMembers: [] };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return store;
});

jest.mock('../../../store/gameStore', () => {
  const mockState = { isGMMode: false };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return store;
});

jest.mock('../../../store/diceStore', () => ({
  __esModule: true,
  default: () => ({}),
  useDiceStore: () => ({})
}));

jest.mock('../../../store/chatStore', () => {
  const mockState = { addCombatNotification: jest.fn() };
  const store = (selector) => (selector ? selector(mockState) : mockState);
  store.getState = () => mockState;
  return {
    __esModule: true,
    default: store,
    useChatStore: store
  };
});

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

const renderWithProvider = (ui) => render(
  <SpellLibraryProvider>
    {ui}
  </SpellLibraryProvider>
);

describe('Weapon Skill Tooltip and Action-Bar Companion Table Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCharacterState.equipment = {
      mainHand: {
        id: 'test-dagger',
        name: 'Bog-Iron Shank',
        subtype: 'DAGGER',
        type: 'weapon',
        slots: ['mainHand'],
        icon: 'Armor/Neck/magical-sword-pendant',
        weaponStats: {
          baseDamage: { diceCount: 1, diceType: 4, damageType: 'Piercing' }
        }
      },
      offHand: {
        id: 'test-shield',
        name: 'Wooden Heater Shield',
        subtype: 'SHIELD',
        slots: ['offHand'],
        icon: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
        blockingDice: '1d4'
      }
    };
  });

  describe('Action Bar MH/OH Fan and Companion Table', () => {
    test('clicking MH opens bubble fan; hovering action bubble opens spellcard and MH dagger table', () => {
      const { container } = renderWithProvider(<SpellActionBar characterId="char-test-1" />);

      const mhSlot = container.querySelector('.slot-mainHand .equipment-action-slot');
      expect(mhSlot).toBeInTheDocument();

      // Click MH slot to expand the ability fan
      fireEvent.click(mhSlot);

      const fanOverlay = container.querySelector('.slot-mainHand .action-fanout-overlay');
      expect(fanOverlay).toBeInTheDocument();

      const bubbles = fanOverlay.querySelectorAll('.action-fan-bubble');
      expect(bubbles.length).toBeGreaterThan(0);

      // Hover the first action bubble (Attack)
      fireEvent.mouseEnter(bubbles[0]);

      // Companion overlay should be rendered in portal
      const companion = document.querySelector('[data-testid="fan-action-companion"]');
      expect(companion).toBeInTheDocument();

      // Check UnifiedSpellCard inside companion
      expect(within(companion).getByText(/Attack/)).toBeInTheDocument();

      // Check WeaponSkillTable inside companion (exact MH item: Bog-Iron Shank, Dagger, Novice d6)
      expect(within(companion).getByTestId('weapon-skill-table')).toBeInTheDocument();
      expect(within(companion).getByTestId('weapon-skill-pill')).toHaveTextContent('Weapon Mastery: Dagger');
      expect(within(companion).getByTestId('weapon-rank-pill')).toHaveTextContent('Novice (d6)');
      expect(within(companion).getByTestId('wst-skill-die')).toHaveTextContent('d6');
      expect(within(companion).getByTestId('wst-damage-die')).toHaveTextContent('1d4 Piercing');
    });

    test('clicking OH with shield opens OH fan; hovering action bubble honestly shows shield defense note', () => {
      const { container } = renderWithProvider(<SpellActionBar characterId="char-test-1" />);

      const ohSlot = container.querySelector('.slot-offHand .equipment-action-slot');
      expect(ohSlot).toBeInTheDocument();

      fireEvent.click(ohSlot);

      const fanOverlay = container.querySelector('.slot-offHand .action-fanout-overlay');
      expect(fanOverlay).toBeInTheDocument();

      const bubbles = fanOverlay.querySelectorAll('.action-fan-bubble');
      expect(bubbles.length).toBeGreaterThan(0);

      // Hover an offhand action bubble
      fireEvent.mouseEnter(bubbles[0]);

      const companion = document.querySelector('[data-testid="fan-action-companion"]');
      expect(companion).toBeInTheDocument();

      // Shows honest shield defense note instead of a fake table
      expect(within(companion).getByTestId('weapon-skill-table-unavailable')).toBeInTheDocument();
      expect(within(companion).getByText('Defensive Equipment (Shield)')).toBeInTheDocument();
      expect(within(companion).getByTestId('equipment-blocking-dice')).toHaveTextContent('Equipment Blocking: 1d4');
    });

    test('dual-wielding: OH weapon uses exact equipped off-hand weapon and rank, not main-hand weapon', () => {
      // Set dual-wielding: MH Dagger (Novice d6), OH Sword (Adept d12)
      mockCharacterState.equipment = {
        mainHand: {
          id: 'test-dagger',
          name: 'Bog-Iron Shank',
          subtype: 'DAGGER',
          type: 'weapon',
          slots: ['mainHand'],
          weaponStats: { baseDamage: { diceCount: 1, diceType: 4, damageType: 'Piercing' } }
        },
        offHand: {
          id: 'test-sword',
          name: 'Silver Rapier',
          subtype: 'SWORD',
          type: 'weapon',
          slots: ['offHand'],
          weaponStats: { baseDamage: { diceCount: 1, diceType: 8, damageType: 'Slashing' } }
        }
      };

      const { container } = renderWithProvider(<SpellActionBar characterId="char-test-1" />);

      // Open OH fan
      const ohSlot = container.querySelector('.slot-offHand .equipment-action-slot');
      fireEvent.click(ohSlot);

      const bubbles = container.querySelectorAll('.slot-offHand .action-fan-bubble');
      expect(bubbles.length).toBeGreaterThan(0);

      // Hover OH action
      fireEvent.mouseEnter(bubbles[0]);

      const companion = document.querySelector('[data-testid="fan-action-companion"]');
      expect(companion).toBeInTheDocument();

      // MUST use exact OH weapon (Silver Rapier / Sword, Adept d12)
      expect(within(companion).getByTestId('weapon-skill-table')).toBeInTheDocument();
      expect(within(companion).getByTestId('weapon-slot-pill')).toHaveTextContent('Off Hand');
      expect(within(companion).getByTestId('weapon-skill-pill')).toHaveTextContent('Weapon Mastery: Sword');
      expect(within(companion).getByTestId('weapon-rank-pill')).toHaveTextContent('Adept (d12)');
      expect(within(companion).getByTestId('wst-skill-die')).toHaveTextContent('d12');
      expect(within(companion).getByTestId('wst-damage-die')).toHaveTextContent('1d8 Slashing');
    });

    test('supports keyboard focus and pinning on action bubbles', () => {
      const { container } = renderWithProvider(<SpellActionBar characterId="char-test-1" />);

      const mhSlot = container.querySelector('.slot-mainHand .equipment-action-slot');
      fireEvent.click(mhSlot);

      const bubbles = container.querySelectorAll('.slot-mainHand .action-fan-bubble');
      expect(bubbles.length).toBeGreaterThan(0);

      // Trigger focus on keyboard
      fireEvent.focus(bubbles[0]);

      const companion = document.querySelector('[data-testid="fan-action-companion"]');
      expect(companion).toBeInTheDocument();

      // Pin button toggle
      const pinBtn = within(companion).getByTestId('weapon-pin-btn');
      fireEvent.click(pinBtn);
      expect(pinBtn).toHaveClass('pinned');
    });
  });

  describe('Character Sheet MH/OH Tooltip Extension', () => {
    test('renders MH weapon slot with canonical skill, rank, skill die and toggleable weapon table', () => {
      const { container } = renderWithProvider(<CharacterPanel activeSubSection="equipment" />);

      const mhSlot = container.querySelector('.weapon-slot');
      expect(mhSlot).toBeInTheDocument();

      // Hover MH slot
      fireEvent.mouseEnter(mhSlot);

      const extension = document.querySelector('[data-testid="sheet-weapon-tooltip-extension"]');
      expect(extension).toBeInTheDocument();

      expect(within(extension).getByText('Weapon Mastery: Dagger')).toBeInTheDocument();
      expect(within(extension).getByText('Novice (d6)')).toBeInTheDocument();
      expect(within(extension).getByText('🎲 Skill Die:')).toBeInTheDocument();

      // Toggle button to view 1-20 table
      const toggleBtn = within(extension).getByTestId('toggle-weapon-table-btn');
      expect(toggleBtn).toHaveTextContent('View Weapon Table (1–20)');

      // Table is not expanded initially
      expect(document.querySelector('[data-testid="sheet-expanded-weapon-table"]')).not.toBeInTheDocument();

      // Click to expand weapon table
      fireEvent.click(toggleBtn);
      expect(document.querySelector('[data-testid="sheet-expanded-weapon-table"]')).toBeInTheDocument();
      expect(toggleBtn).toHaveTextContent('Hide Weapon Table');

      // Check rows in the expanded table
      expect(document.querySelector('[data-testid="wst-row-1"]')).toBeInTheDocument();
      expect(document.querySelector('[data-testid="wst-row-6"]')).toBeInTheDocument();

      // Click again to collapse
      fireEvent.click(toggleBtn);
      expect(document.querySelector('[data-testid="sheet-expanded-weapon-table"]')).not.toBeInTheDocument();
    });

    test('renders OH shield slot with defensive blocking and honest unavailable table message', () => {
      const { container } = renderWithProvider(<CharacterPanel activeSubSection="equipment" />);

      const slots = container.querySelectorAll('.weapon-slot');
      expect(slots.length).toBeGreaterThan(1);
      const ohSlot = slots[1]; // offHand slot

      fireEvent.mouseEnter(ohSlot);

      const extension = document.querySelector('[data-testid="sheet-weapon-tooltip-extension"]');
      expect(extension).toBeInTheDocument();

      // Shield blocking shown
      expect(within(extension).getByText('🛡️ Block:')).toBeInTheDocument();
      expect(within(extension).getAllByText('1d4').length).toBeGreaterThanOrEqual(1);

      // Honest unavailable note shown
      const note = within(extension).getByTestId('sheet-wte-unavailable-note');
      expect(note).toHaveTextContent(/Shields provide defensive equipment guard/i);
      expect(within(extension).queryByTestId('toggle-weapon-table-btn')).not.toBeInTheDocument();
    });
  });
});
