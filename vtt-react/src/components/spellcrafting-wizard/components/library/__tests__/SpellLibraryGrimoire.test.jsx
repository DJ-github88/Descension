import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellLibrary from '../SpellLibrary';
import { SpellLibraryProvider } from '../../../context/SpellLibraryContext';

// Mock stores and services
jest.mock('../../../../../services/firebase/userSpellService', () => ({
  loadUserSpells: jest.fn(() => Promise.resolve([]))
}));

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadCustomSpells: jest.fn(() => []),
  saveCustomSpells: jest.fn(),
  loadDeletedSpellIds: jest.fn(() => []),
  saveDeletedSpellIds: jest.fn()
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getAbilityIconUrl: jest.fn(() => 'test-icon.png'),
  getCustomIconUrl: jest.fn(() => 'fallback-icon.png')
}));

jest.mock('../../../../../hooks/useClassSpellLibrary', () => ({
  useClassSpellLibrary: () => ({
    spellCategories: ['Class Spells'],
    classSpells: [
      {
        id: 'arc_projection_lantern',
        name: 'Aetheric Projection Lantern',
        description: 'Focus aetheric energy through your mechanical lens to project a detailed blueprint.',
        spellType: 'ACTION',
        typeConfig: { school: 'arcane' },
        targetingConfig: { rangeDistance: 30 },
        resourceCost: { actionPoints: 1, resourceValues: { mana: 4 } }
      }
    ],
    classSpellsLoading: false,
    classSpellsError: null,
    getAllSpells: () => [
      {
        id: 'arc_projection_lantern',
        name: 'Aetheric Projection Lantern',
        description: 'Focus aetheric energy through your mechanical lens to project a detailed blueprint.',
        spellType: 'ACTION',
        typeConfig: { school: 'arcane' },
        targetingConfig: { rangeDistance: 30 },
        resourceCost: { actionPoints: 1, resourceValues: { mana: 4 } }
      }
    ],
    getSpellsByCategory: () => [
      {
        id: 'arc_projection_lantern',
        name: 'Aetheric Projection Lantern',
        description: 'Focus aetheric energy through your mechanical lens to project a detailed blueprint.',
        spellType: 'ACTION',
        typeConfig: { school: 'arcane' },
        targetingConfig: { rangeDistance: 30 },
        resourceCost: { actionPoints: 1, resourceValues: { mana: 4 } }
      }
    ],
    getCategoryInfo: () => ({ name: 'Class Spells', count: 1 }),
    removeCustomSpell: jest.fn(),
    hasActiveCharacter: true,
    hasClassSpells: true
  })
}));

jest.mock('../../../../../hooks/useWeaponEnhancedSpells', () => ({
  useWeaponEnhancedSpells: () => ({ enhancedSpells: [], rawSpells: [] })
}));

jest.mock('../../../../../store/characterStore', () => {
  const state = {
    characters: [{
      id: 'char_1',
      name: 'Test Character',
      customClass: 'arcanoneer',
      level: 1,
      class_spells: { known_spells: ['arc_projection_lantern'] }
    }],
    currentCharacterId: 'char_1',
    activeCharacterId: 'char_1',
    currentCharacter: {
      id: 'char_1',
      name: 'Test Character',
      customClass: 'arcanoneer',
      level: 1,
      class_spells: { known_spells: ['arc_projection_lantern'] }
    },
    level: 1,
    race: null,
    subrace: null,
    path: null,
    class_spells: { known_spells: ['arc_projection_lantern'] },
    talents: {}
  };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  return {
    __esModule: true,
    default: useCharacterStore
  };
});

jest.mock('../../../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: { uid: 'user_1' } })
}));

describe('SpellLibrary Grimoire Compact Layout', () => {
  it('renders occupied spell cards with header cadence, running statline, and empty slots', () => {
    render(
      <SpellLibraryProvider>
        <SpellLibrary initialViewMode="compact" />
      </SpellLibraryProvider>
    );

    // Verify spell name rendered with grimoire classes
    expect(screen.getByText('Aetheric Projection Lantern')).toBeInTheDocument();

    // Verify cadence
    expect(screen.getByText('1 AP')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();

    // Verify statline items (School, Range, Cost)
    expect(screen.getByText('Arcane')).toBeInTheDocument();
    expect(screen.getByText('30 ft')).toBeInTheDocument();
    expect(screen.getByText('4 Mana')).toBeInTheDocument();

    // Verify description snippet
    expect(screen.getByText(/Focus aetheric energy through your mechanical lens/i)).toBeInTheDocument();

    // Verify empty placeholder slots are rendered to fill the grimoire page spread
    const container = document.querySelector('.wow-spell-list-container');
    expect(container).toBeInTheDocument();
    const emptySlots = container.querySelectorAll('.wow-spell-row.empty');
    expect(emptySlots.length).toBeGreaterThan(0);
  });
});
