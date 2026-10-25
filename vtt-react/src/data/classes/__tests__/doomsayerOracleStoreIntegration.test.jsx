import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DOOMSAYER_PROJECTED_SPELLS_BY_ID } from '../doomsayerData';
import { ORACLE_PROJECTED_SPELLS_BY_ID } from '../oracleData';
import { DOOMSAYER_TREES, DOOMSAYER_TALENT_NODES } from '../../talentTrees/doomsayer';
import { ORACLE_TREES, ORACLE_TALENT_NODES } from '../../talentTrees/oracle';
import { ALL_CLASSES_DATA } from '..';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import { pruneTalentsForChange } from '../../../store/characterSlices/progressionSlice';
import { TalentTreeContent } from '../../../components/talent-tree/TalentTreeContent';
import LevelUpChoiceModal from '../../../components/modals/LevelUpChoiceModal';
import { SpellLibraryProvider } from '../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { __getLibrary, __setLibrary } from '../../../components/spellcrafting-wizard/core/utils/libraryManager';

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

const allocation = (tree, pointsBeforeSignature = false) => pointsBeforeSignature
  ? Object.fromEntries(tree.nodes.filter(node => /p0[1-4]$/.test(node.id)).map((node, index) => [node.id, index === 3 ? 1 : 3]))
  : Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));

const stateFor = overrides => useCharacterStore.setState({
  class: 'Doomsayer', characterClass: 'Doomsayer', level: 3, currentCharacterId: null,
  characters: [], talents: {}, primarySpecialization: '', levelUpHistory: {},
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: ['cr1_doomsayer_plant_calamity', 'cr1_doomsayer_dismantle_calamity'] },
  ...overrides
});

const classCases = [
  {
    name: 'Doomsayer', core: ['cr1_doomsayer_plant_calamity', 'cr1_doomsayer_dismantle_calamity'],
    resource: 'doom-calamities', trees: DOOMSAYER_TREES, nodes: DOOMSAYER_TALENT_NODES,
    projected: DOOMSAYER_PROJECTED_SPELLS_BY_ID, optionalName: 'Doom Bolt'
  },
  {
    name: 'Oracle', core: ['cr1_oracle_commit_forecast', 'cr1_oracle_release_forecast'],
    resource: 'oracle-forecasts', trees: ORACLE_TREES, nodes: ORACLE_TALENT_NODES,
    projected: ORACLE_PROJECTED_SPELLS_BY_ID, optionalName: 'Shared Vision'
  }
];

describe('Doomsayer and Oracle normal consumers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __setLibrary({ spells: [] });
    useSpellbookStore.setState({ spells: [] });
  });

  test.each(classCases)('$name class selection grants only its two cores and leaves the manual resource uninitialized', config => {
    const legacyRoster = {
      id: 'legacy-harbinger', class: 'Harbinger',
      class_spells: { known_spells: ['harbinger_universal_doom_bolt'] },
      classResource: { type: 'mayhem', current: 40 }
    };
    const before = JSON.stringify(legacyRoster);
    stateFor({
      class: 'Harbinger', characterClass: 'Harbinger', race: 'human', subrace: 'skald_human',
      characters: [legacyRoster], class_spells: { known_spells: ['harbinger_universal_doom_bolt'] }
    });
    useCharacterStore.getState().updateCharacterInfo('class', config.name);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual(config.core);
    expect(useCharacterStore.getState().classResource).toMatchObject({
      type: config.resource, initialized: false, state: null, current: 0, max: 2
    });
    expect(JSON.stringify(legacyRoster)).toBe(before);
    expect(ALL_CLASSES_DATA.Harbinger).toBeTruthy();
  });

  test.each(classCases)('$name starter and level-up assignment never grant optional or talent records', async config => {
    stateFor({ class: config.name, characterClass: config.name, class_spells: { known_spells: config.core } });
    expect(await useCharacterStore.getState().ensureClassStarterSpells(config.name)).toBe(false);
    useCharacterStore.getState().assignSpellsForLevel(3, config.name);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual(config.core);
  });

  test.each(classCases)('$name level-up modal exposes four legal options per level and no core or talent grants', config => {
    const { baseElement } = render(
      <SpellLibraryProvider>
        <LevelUpChoiceModal
          isOpen
          characterClass={config.name}
          currentLevel={3}
          knownSpells={config.core}
          onChoiceSelected={jest.fn()}
          onClose={jest.fn()}
        />
      </SpellLibraryProvider>
    );
    const images = [...baseElement.querySelectorAll('.spell-icons-row img')];
    expect(images).toHaveLength(12);
    const names = images.map(image => image.alt);
    expect(names).toContain(config.optionalName);
    config.core.forEach(coreName => {
      const coreId = coreName.replace(/^cr1_(doomsayer|oracle)_/, '');
      expect(names.join(' ').toLowerCase()).not.toContain(coreId.replaceAll('_', ' '));
    });
    expect(names).not.toContain('Absolute Requiem');
    expect(names).not.toContain('The Watched Thread');
  });

  test.each(classCases)('$name signature grants its canonical ACTION once and never a talent-spell duplicate', config => {
    const tree = config.trees[0];
    const signature = tree.nodes.find(node => node.grantId === `cr1_${config.name.toLowerCase()}_${tree.meta.signature}`);
    stateFor({ class: config.name, characterClass: config.name, level: 3, talents: allocation(tree, true) });
    render(<TalentTreeContent selectedTreeIndex={0} />);
    fireEvent.click(screen.getByTitle(new RegExp(signature.name)));
    const stored = useSpellbookStore.getState().spells.find(spell => spell.id === signature.grantId);
    expect(stored).toBeDefined();
    expect(stored.spellType).toBe('ACTION');
    expect(stored.executionEnabled).toBe(false);
    expect(stored.specialMechanics[config.name.toLowerCase()].authoredSpell).toEqual(
      config.projected[signature.grantId].specialMechanics[config.name.toLowerCase()].authoredSpell
    );
    fireEvent.click(screen.getByTitle(new RegExp(signature.name)));
    expect(useSpellbookStore.getState().spells.filter(spell => spell.id === signature.grantId)).toHaveLength(1);
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === `talent-spell-${signature.id}`)).toBe(false);
  });

  test.each(classCases)('$name capstone is refused at level nine and grants once at level ten', config => {
    const tree = config.trees[0];
    const passives = tree.nodes.filter(node => node.passiveSpellId);
    const signature = tree.nodes.find(node => node.grantId === `cr1_${config.name.toLowerCase()}_${tree.meta.signature}`);
    const capstone = tree.nodes.find(node => node.grantId === `cr1_${config.name.toLowerCase()}_${tree.meta.capstone}`);
    const ranks = Object.fromEntries(passives.slice(0, 13).map(node => [node.id, 3]));
    ranks[passives[13].id] = 2;
    ranks[passives[14].id] = 3;
    ranks[signature.id] = 1;
    expect(Object.values(ranks).reduce((total, rank) => total + rank, 0)).toBe(45);

    stateFor({ class: config.name, characterClass: config.name, level: 9, talents: ranks });
    render(<TalentTreeContent selectedTreeIndex={0} />);
    fireEvent.click(screen.getByTitle(new RegExp(capstone.name)));
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === capstone.grantId)).toBe(false);

    act(() => useCharacterStore.setState({ level: 10 }));
    fireEvent.click(screen.getByTitle(new RegExp(capstone.name)));
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === capstone.grantId)).toBe(true);
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === `talent-spell-${capstone.id}`)).toBe(false);
  });

  test.each(classCases)('$name Reset All clears talents and exact derived copies only', config => {
    const tree = config.trees[0];
    stateFor({ class: config.name, characterClass: config.name, level: 10 });
    render(<TalentTreeContent selectedTreeIndex={0} />);
    const node = tree.nodes[0];
    const button = screen.getByTitle(new RegExp(node.name));
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(useSpellbookStore.getState().spells.some(spell => spell.id === node.passiveSpellId)).toBe(true);
    fireEvent.click(screen.getByText('Reset All'));
    expect(useSpellbookStore.getState().spells).toEqual([]);
    expect(__getLibrary().spells).toEqual([]);
    expect(useCharacterStore.getState().talents).toEqual({});
  });

  test.each(classCases)('$name level reduction and class switch prune only obsolete derived identities', config => {
    const tree = config.trees[0];
    const signature = tree.nodes.find(node => node.grantId === `cr1_${config.name.toLowerCase()}_${tree.meta.signature}`);
    stateFor({ class: config.name, characterClass: config.name, level: 10, talents: allocation(tree) });
    const pruned = pruneTalentsForChange(allocation(tree), {
      previousClass: config.name, nextClass: config.name, level: 1
    });
    expect(Object.values(pruned).reduce((total, rank) => total + rank, 0)).toBeLessThanOrEqual(5);
    expect(pruned[signature.id]).toBeUndefined();
    const switched = pruneTalentsForChange(allocation(tree), {
      previousClass: config.name, nextClass: 'Harbinger', level: 10
    });
    expect(switched).toEqual({});
    expect(ALL_CLASSES_DATA.Harbinger.classResource).toMatchObject({ type: 'mayhem', max: 100 });
  });

  test.each(classCases)('$name actual updateLevel(1) prunes the stored allocation', config => {
    const tree = config.trees[0];
    stateFor({
      class: config.name, characterClass: config.name, level: 10,
      talents: allocation(tree), class_spells: { known_spells: config.core }
    });
    useCharacterStore.getState().updateLevel(1);
    const total = Object.values(useCharacterStore.getState().talents)
      .reduce((sum, rank) => sum + rank, 0);
    expect(total).toBeLessThanOrEqual(5);
    expect(useCharacterStore.getState().level).toBe(1);
  });

  test.each(classCases)('$name actual class switch to Harbinger clears new-class talents and preserves legacy Harbinger', config => {
    const tree = config.trees[0];
    stateFor({
      class: config.name, characterClass: config.name, level: 10,
      talents: allocation(tree), class_spells: { known_spells: config.core }
    });
    useCharacterStore.getState().updateCharacterInfo('class', 'Harbinger');
    expect(useCharacterStore.getState().talents).toEqual({});
    expect(useCharacterStore.getState().classResource).toMatchObject({ type: 'mayhemGauge', max: 100 });
    expect(ALL_CLASSES_DATA.Harbinger).toBeTruthy();
  });
});
