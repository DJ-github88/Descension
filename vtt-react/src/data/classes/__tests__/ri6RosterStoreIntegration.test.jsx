import React from 'react';
import { render } from '@testing-library/react';
import { ARCANONEER_DATA, ARCANONEER_PROGRESSION_POLICY } from '../arcanoneerData';
import { MINSTREL_DATA, MINSTREL_PROGRESSION_POLICY } from '../minstrelData';
import { CHRONARCH_DATA, CHRONARCH_PROGRESSION_POLICY } from '../chronarchData';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import LevelUpChoiceModal from '../../../components/modals/LevelUpChoiceModal';
import { SpellLibraryProvider } from '../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { __setLibrary } from '../../../components/spellcrafting-wizard/core/utils/libraryManager';

jest.mock('../../../store/authStore', () => {
  const state = { user: null };
  const useAuth = selector => selector ? selector(state) : state;
  useAuth.getState = () => state;
  return { __esModule: true, default: useAuth };
});

jest.mock('../../../components/spellcrafting-wizard/core/utils/libraryManager', () => {
  const actual = jest.requireActual('../../../components/spellcrafting-wizard/core/utils/libraryManager');
  let library = { spells: [] };
  return {
    ...actual,
    __setLibrary: value => { library = value; },
    __getLibrary: () => library,
    loadLibraryFromStorage: () => library,
    saveLibraryToStorage: value => { library = value; return true; }
  };
});

const cases = [
  { name: 'Arcanoneer', data: ARCANONEER_DATA, policy: ARCANONEER_PROGRESSION_POLICY, race: 'human', subrace: 'velun_neth', level3Pool: ARCANONEER_DATA.spellPools[3] },
  { name: 'Minstrel', data: MINSTREL_DATA, policy: MINSTREL_PROGRESSION_POLICY, race: 'human', subrace: 'merryn_human', level3Pool: MINSTREL_DATA.spellPools[3] },
  { name: 'Chronarch', data: CHRONARCH_DATA, policy: CHRONARCH_PROGRESSION_POLICY, race: 'human', subrace: 'velun_neth', level3Pool: CHRONARCH_DATA.spellPools[3] }
];

const stateFor = (config, overrides = {}) => useCharacterStore.setState({
  class: config.name, characterClass: config.name, level: 3, currentCharacterId: null,
  race: config.race || 'human', subrace: config.subrace || 'velun_neth', characters: [], talents: {},
  primarySpecialization: '', levelUpHistory: {},
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: config.data.spellPools[1].slice(0, 3) },
  ...overrides
});

describe.each(cases)('$name RI-6 progression integration', ({ name, data, policy, level3Pool }) => {
  beforeEach(() => {
    window.localStorage.clear();
    __setLibrary({ spells: [] });
    useSpellbookStore.setState({ spells: [] });
  });

  test('explicit policy blocks random starter assignment and automatic top-up', async () => {
    stateFor({ name, data });
    const before = [...useCharacterStore.getState().class_spells.known_spells];
    expect(await useCharacterStore.getState().ensureClassStarterSpells(name)).toBe(false);
    useCharacterStore.getState().assignSpellsForLevel(3, name);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual(before);
    expect(policy).toMatchObject({
      startingSpellPicks: 3, optionalPicksPerLevel: 1,
      autoTopUpOnLoad: false, randomizeStartingSpells: false
    });
  });

  test('level-up modal exposes the authored pools up to the current level', () => {
    const poolNames = [1, 2, 3].map(level => data.spellPools[level]
      .map(id => data.spells.find(spell => spell.id === id)?.name)
      .filter(Boolean));
    const { baseElement } = render(
      <SpellLibraryProvider>
        <LevelUpChoiceModal
          isOpen
          characterClass={name}
          currentLevel={3}
          knownSpells={data.spellPools[1].slice(0, 3)}
          onChoiceSelected={jest.fn()}
          onClose={jest.fn()}
        />
      </SpellLibraryProvider>
    );
    const images = [...baseElement.querySelectorAll('.spell-icons-row img')];
    expect(images.length).toBeGreaterThanOrEqual(3);
    const names = images.map(image => image.alt);
    poolNames.forEach(namesAtLevel => {
      expect(namesAtLevel.some(levelName => names.includes(levelName))).toBe(true);
    });
  });

  test('class selection resets picks to the explicit empty core list', () => {
    stateFor({ name, data }, {
      class: 'Fighter', characterClass: 'Fighter',
      class_spells: { known_spells: ['fighter_old_pick'] }
    });
    useCharacterStore.getState().updateCharacterInfo('class', name);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([]);
    expect(useCharacterStore.getState().class).toBe(name);
  });
});
