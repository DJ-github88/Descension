import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DRUID_PROJECTED_SPELLS_BY_ID } from '../druidData';
import { HUNTER_PROJECTED_SPELLS_BY_ID } from '../hunterData';
import { DRUID_TREES, DRUID_TALENT_NODES } from '../../talentTrees/druid';
import { HUNTER_TREES, HUNTER_TALENT_NODES } from '../../talentTrees/hunter';
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

const stateFor = (config, overrides) => useCharacterStore.setState({
  class: config.name, characterClass: config.name, level: 3, currentCharacterId: null,
  race: config.race, subrace: config.subrace,
  characters: [], talents: {}, primarySpecialization: '', levelUpHistory: {},
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: config.core },
  ...overrides
});

const classCases = [
  {
    name: 'Druid', race: 'groven', subrace: 'morgh_groven',
    core: ['cr1_druid_adopt_loadout', 'cr1_druid_recover_self'],
    resource: 'druid-body', max: 2, legacy: 'Shaper', legacyResource: 'kineticFluxBodyToll',
    trees: DRUID_TREES, nodes: DRUID_TALENT_NODES, projected: DRUID_PROJECTED_SPELLS_BY_ID,
    optionalName: 'Rending Claw', coreNames: ['Adopt Loadout', 'Recover the Self'],
    signatureBlockedName: 'Apex of the Hunt'
  },
  {
    name: 'Hunter', race: 'human', subrace: 'skald_human',
    core: ['cr1_hunter_mark_quarry', 'cr1_hunter_take_angle', 'cr1_hunter_press_quarry'],
    resource: 'hunter-evidence', max: 3, legacy: 'Apex', legacyResource: 'quarryMarksCompanion',
    trees: HUNTER_TREES, nodes: HUNTER_TALENT_NODES, projected: HUNTER_PROJECTED_SPELLS_BY_ID,
    optionalName: "Hunter's Snare", coreNames: ['Mark Quarry', 'Take an Angle', 'Press the Quarry'],
    signatureBlockedName: 'The Perfect Pack'
  }
];

describe('Druid and Hunter normal consumers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    __setLibrary({ spells: [] });
    useSpellbookStore.setState({ spells: [] });
  });

  test.each(classCases)('$name class selection grants only its cores and leaves the manual resource uninitialized', config => {
    const legacyRoster = {
      id: `legacy-${config.legacy.toLowerCase()}`, class: config.legacy,
      class_spells: { known_spells: [`${config.legacy.toLowerCase()}_legacy_spell`] },
      classResource: { type: config.legacyResource, current: 2 }
    };
    const before = JSON.stringify(legacyRoster);
    stateFor(config, {
      class: config.legacy, characterClass: config.legacy,
      characters: [legacyRoster], class_spells: { known_spells: [`${config.legacy.toLowerCase()}_legacy_spell`] }
    });
    useCharacterStore.getState().updateCharacterInfo('class', config.name);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual(config.core);
    expect(useCharacterStore.getState().classResource).toMatchObject({
      type: config.resource, initialized: false, state: null, current: 0, max: config.max
    });
    expect(JSON.stringify(legacyRoster)).toBe(before);
    expect(ALL_CLASSES_DATA[config.legacy]).toBeTruthy();
  });

  test.each(classCases)('$name starter and level-up assignment never grant optional or talent records', async config => {
    stateFor(config, { class: config.name, characterClass: config.name, class_spells: { known_spells: config.core } });
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
    config.coreNames.forEach(coreName => {
      expect(names).not.toContain(coreName);
    });
    expect(names).not.toContain(config.signatureBlockedName);
  });

  test.each(classCases)('$name signature grants its canonical ACTION once and never a talent-spell duplicate', config => {
    const tree = config.trees[0];
    const signature = tree.nodes.find(node => node.grantId === `cr1_${config.name.toLowerCase()}_${tree.meta.signature}`);
    stateFor(config, { class: config.name, characterClass: config.name, level: 3, talents: allocation(tree, true) });
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

    stateFor(config, { class: config.name, characterClass: config.name, level: 9, talents: ranks });
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
    stateFor(config, { class: config.name, characterClass: config.name, level: 10 });
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
    stateFor(config, { class: config.name, characterClass: config.name, level: 10, talents: allocation(tree) });
    const pruned = pruneTalentsForChange(allocation(tree), {
      previousClass: config.name, nextClass: config.name, level: 1
    });
    expect(Object.values(pruned).reduce((total, rank) => total + rank, 0)).toBeLessThanOrEqual(5);
    expect(pruned[signature.id]).toBeUndefined();
    const switched = pruneTalentsForChange(allocation(tree), {
      previousClass: config.name, nextClass: config.legacy, level: 10
    });
    expect(switched).toEqual({});
    expect(ALL_CLASSES_DATA[config.legacy].classResource).toBeTruthy();
  });

  test.each(classCases)('$name actual updateLevel(1) prunes the stored allocation', config => {
    const tree = config.trees[0];
    stateFor(config, {
      class: config.name, characterClass: config.name, level: 10,
      talents: allocation(tree), class_spells: { known_spells: config.core }
    });
    useCharacterStore.getState().updateLevel(1);
    const total = Object.values(useCharacterStore.getState().talents)
      .reduce((sum, rank) => sum + rank, 0);
    expect(total).toBeLessThanOrEqual(5);
    expect(useCharacterStore.getState().level).toBe(1);
  });

  test.each(classCases)('$name actual class switch to its legacy identity clears new-class talents and preserves legacy state', config => {
    const tree = config.trees[0];
    stateFor(config, {
      class: config.name, characterClass: config.name, level: 10,
      talents: allocation(tree), class_spells: { known_spells: config.core }
    });
    useCharacterStore.getState().updateCharacterInfo('class', config.legacy);
    expect(useCharacterStore.getState().talents).toEqual({});
    expect(useCharacterStore.getState().classResource).toMatchObject({ type: config.legacyResource });
    expect(ALL_CLASSES_DATA[config.legacy]).toBeTruthy();
  });
});
