import useCharacterStore from '../../../store/characterStore';
import {
  DEATHCALLER_CORE_RECORDS, DEATHCALLER_OPTIONAL_RECORDS, DEATHCALLER_TREES,
  pruneDeathcallerTalents
} from '../deathcallerData';
import {
  LICHBORNE_CORE_RECORDS, LICHBORNE_OPTIONAL_RECORDS, LICHBORNE_TREES,
  pruneLichborneTalents
} from '../lichborneData';

jest.mock('../../../store/authStore', () => {
  const state = { user: null };
  const useAuth = selector => selector ? selector(state) : state;
  useAuth.getState = () => state;
  return { __esModule: true, default: useAuth };
});

const cases = [
  ['Deathcaller', DEATHCALLER_CORE_RECORDS, DEATHCALLER_OPTIONAL_RECORDS, DEATHCALLER_TREES, pruneDeathcallerTalents],
  ['Lichborne', LICHBORNE_CORE_RECORDS, LICHBORNE_OPTIONAL_RECORDS, LICHBORNE_TREES, pruneLichborneTalents]
];

const stateFor = (className, coreRecords, overrides = {}) => useCharacterStore.setState({
  class: className, characterClass: className, level: 2, currentCharacterId: null,
  characters: [], talents: {}, primarySpecialization: '', levelUpHistory: {},
  pendingLevelUpInfo: { newLevel: 3, oldLevel: 2 },
  stats: { body: 10, agility: 10, mind: 10, spirit: 10 },
  syncWithMultiplayer: jest.fn(), debouncedSave: jest.fn(), recordCharacterChange: jest.fn(),
  class_spells: { known_spells: coreRecords.map(record => record.id) },
  ...overrides
});

describe('CR-1 progression policy', () => {
  test.each(cases)('%s takes one legal optional per level and rejects a second claim', (
    className, coreRecords, optionalRecords
  ) => {
    const levelThree = optionalRecords.filter(record => record.level === 3);
    const levelFour = optionalRecords.find(record => record.level === 4).id;
    const coreKnown = coreRecords.map(record => record.id);
    stateFor(className, coreRecords);

    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelFour });
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual(coreKnown);

    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelThree[0].id });
    const afterFirst = useCharacterStore.getState();
    expect(afterFirst.class_spells.known_spells).toContain(levelThree[0].id);
    expect(afterFirst.levelUpHistory[3].spellId).toBe(levelThree[0].id);
    const snapshot = JSON.stringify({
      known: afterFirst.class_spells.known_spells,
      history: afterFirst.levelUpHistory
    });

    useCharacterStore.getState().handleLevelUpChoice({ spellId: levelThree[1].id });
    const afterSecond = useCharacterStore.getState();
    expect(JSON.stringify({
      known: afterSecond.class_spells.known_spells,
      history: afterSecond.levelUpHistory
    })).toBe(snapshot);
  });

  test.each(cases)('%s preserves a legal level-10 tree and gates an early signature', (
    className, coreRecords, optionalRecords, trees, prune
  ) => {
    expect(optionalRecords).toHaveLength(40);
    expect(coreRecords).toHaveLength(2);
    trees.forEach(tree => {
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      expect(prune(fullTree, 10)).toEqual(fullTree);

      const roots = Object.fromEntries(tree.nodes.slice(0, 3).map(node => [node.id, 3]));
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const signatureReady = {
        ...roots,
        [tree.nodes[3].id]: 1,
        [signature.id]: 1
      };
      expect(prune(signatureReady, 3)[signature.id]).toBe(1);
      expect(prune(signatureReady, 2)[signature.id]).toBeUndefined();
      expect(prune({ ...signatureReady, [tree.nodes[0].id]: 2 }, 3)[signature.id]).toBeUndefined();
    });
  });
});
