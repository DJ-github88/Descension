import {
  FATE_WEAVER_CORE_RECORDS, FATE_WEAVER_OPTIONAL_RECORDS, FATE_WEAVER_PROJECTED_SPELLS_BY_ID,
  FATE_WEAVER_SPELL_POOLS, pruneFateWeaverTalents
} from '../fateWeaverData';
import { FATE_WEAVER_TREES, FATE_WEAVER_TALENT_NODES } from '../../talentTrees/fateWeaver';
import { createSpellLibraryCategoriesForClass } from '../../classSpellCategories';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
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
    __setLibrary: value => { library = value; }, __getLibrary: () => library,
    loadLibraryFromStorage: () => library,
    saveLibraryToStorage: value => { library = value; return true; }
  };
});

const id = suffix => `cr1_fate_weaver_${suffix}`;
const optionalAt = level => FATE_WEAVER_OPTIONAL_RECORDS.filter(record => record.level === level);
const tree = FATE_WEAVER_TREES[0];
const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
const foldedPassive = node => ({
  ...FATE_WEAVER_PROJECTED_SPELLS_BY_ID[node.passiveSpellId],
  source: 'talent', talentId: node.id, talentRank: 3
});
const stateFor = overrides => useCharacterStore.setState({
  class: 'Fate Weaver', characterClass: 'Fate Weaver', level: 5, currentCharacterId: null,
  characters: [], talents: {}, primarySpecialization: '', levelUpHistory: {},
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: FATE_WEAVER_CORE_RECORDS.map(record => record.id) },
  ...overrides
});

describe('Fate Weaver Phase 2B corrections', () => {
  test('prunes to the level budget, preserves the full level-10 tree and gates signatures', () => {
    expect(pruneFateWeaverTalents(fullTree, 10)).toEqual(fullTree);
    const roots = Object.fromEntries(tree.nodes.slice(0, 3).map(node => [node.id, 3]));
    const levelOne = pruneFateWeaverTalents(roots, 1);
    expect(Object.values(levelOne).reduce((total, rank) => total + rank, 0)).toBe(5);
    const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
    const signatureReady = {
      [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3,
      [tree.nodes[3].id]: 1, [signature.id]: 1
    };
    expect(pruneFateWeaverTalents(signatureReady, 3)[signature.id]).toBe(1);
    expect(pruneFateWeaverTalents({ ...signatureReady, [tree.nodes[0].id]: 2 }, 3)[signature.id]).toBeUndefined();
    expect(pruneFateWeaverTalents(signatureReady, 2)[signature.id]).toBeUndefined();
  });

  test.each(['updateLevel', 'adjustLevel', 'updateCharacterInfo'])('%s undoes Fate optional picks, talent ranks and derived passive ranks', method => {
    const changedNode = tree.nodes[3];
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID[changedNode.passiveSpellId]).toBeTruthy();
    const passive = foldedPassive(changedNode);
    const optionalOne = optionalAt(1)[0].id;
    const lostSpells = [id('tie_thread'), optionalOne, optionalAt(3)[0].id, optionalAt(4)[0].id];
    stateFor({
      level: 5,
      talents: { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3, [changedNode.id]: 3 },
      levelUpHistory: {
        3: { spellId: optionalAt(3)[0].id }, 4: { spellId: optionalAt(4)[0].id }, 5: { spellId: optionalAt(5)[0].id }
      },
      class_spells: { known_spells: lostSpells }
    });
    useSpellbookStore.setState({ spells: [passive] });
    __setLibrary({ spells: [passive] });
    if (method === 'adjustLevel') useCharacterStore.getState().adjustLevel(-3);
    else if (method === 'updateCharacterInfo') useCharacterStore.getState().updateCharacterInfo('level', 2);
    else useCharacterStore.getState().updateLevel(2);

    const state = useCharacterStore.getState();
    expect(state.level).toBe(2);
    expect(state.class_spells.known_spells).toEqual([id('tie_thread'), optionalOne]);
    expect(state.levelUpHistory[3]).toBeUndefined();
    expect(state.levelUpHistory[4]).toBeUndefined();
    expect(state.levelUpHistory[5]).toBeUndefined();
    expect(Object.values(state.talents).reduce((total, rank) => total + rank, 0)).toBeLessThanOrEqual(10);
    const rank = state.talents[changedNode.id];
    expect(rank).toBeLessThan(3);
    expect(useSpellbookStore.getState().spells.find(spell => spell.id === changedNode.passiveSpellId).talentRank).toBe(rank);
    expect(__getLibrary().spells.find(spell => spell.id === changedNode.passiveSpellId).talentRank).toBe(rank);
  });

  test('enforces one optional pick per level atomically and rejects illegal pool levels', () => {
    const levelThree = optionalAt(3).map(record => record.id);
    const levelFour = optionalAt(4)[0].id;
    stateFor({ level: 2, pendingLevelUpInfo: { newLevel: 3 }, class_spells: { known_spells: [id('tie_thread'), id('cut_clean')] } });
    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelFour });
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([id('tie_thread'), id('cut_clean')]);

    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelThree[0], healthIncrease: 4, attributes: ['spirit'] });
    const afterFirst = useCharacterStore.getState();
    expect(afterFirst.class_spells.known_spells).toContain(levelThree[0]);
    const snapshot = JSON.stringify({
      known: afterFirst.class_spells.known_spells, stats: afterFirst.stats,
      history: afterFirst.levelUpHistory
    });
    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelThree[1], healthIncrease: 9, attributes: ['body'] });
    const afterSecond = useCharacterStore.getState();
    expect(JSON.stringify({ known: afterSecond.class_spells.known_spells, stats: afterSecond.stats, history: afterSecond.levelUpHistory })).toBe(snapshot);
    expect(afterSecond.levelUpHistory[3].spellId).toBe(levelThree[0]);
  });

  test('fills Fate Weaver level categories 3/5/7/8/9/10 without changing Gambler', () => {
    const fateLevels = createSpellLibraryCategoriesForClass('Fate Weaver')
      .map(category => category.id).filter(categoryId => categoryId.startsWith('fate weaver_level_'));
    expect(fateLevels).toEqual(Array.from({ length: 10 }, (_, index) => `fate weaver_level_${index + 1}`));
    const gamblerLevels = createSpellLibraryCategoriesForClass('Gambler')
      .map(category => category.id).filter(categoryId => categoryId.startsWith('gambler_level_'));
    expect(gamblerLevels).toEqual(Array.from({ length: 10 }, (_, index) => `gambler_level_${index + 1}`));
    expect(FATE_WEAVER_SPELL_POOLS[3]).toHaveLength(4);
  });

  test('re-authors the three ruled passives and removes long-rest token recovery', () => {
    const mechanics = Object.fromEntries(FATE_WEAVER_TALENT_NODES
      .filter(node => node.parameterKeys?.length)
      .map(node => [node.name, node.parameterKeys[0]]));
    expect(mechanics).toMatchObject({
      'Echoed Oath': 'covenant.formationCheckBonus',
      'Broad Shoulders': 'redirected-damage.composureCheckBonus',
      'Broken Crown': 'sever_borrowed_crown.identificationCheckBonus',
      'Throughline Precision': 'sever_throughline.suppressionCheckBonus',
      'Eternal Thread': 'link-audit.recoveringCheckBonus'
    });
  });
});
