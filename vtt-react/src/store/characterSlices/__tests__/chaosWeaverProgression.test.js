import useCharacterStore from '../../characterStore';
import useSpellbookStore from '../../spellbookStore';
import {
  __getLibrary,
  __setLibrary
} from '../../../components/spellcrafting-wizard/core/utils/libraryManager';

jest.mock('../../../components/spellcrafting-wizard/core/utils/libraryManager', () => {
  let library = { spells: [] };
  return {
    __setLibrary: (next) => { library = next; },
    __getLibrary: () => library,
    getDefaultLibrary: () => library,
    loadLibraryFromStorage: () => library,
    saveLibraryToStorage: (next) => { library = next; return true; }
  };
});

const setChaosWeaverState = (overrides = {}) =>
  useCharacterStore.setState({
    level: 1,
    characterClass: 'Chaos Weaver',
    currentCharacterId: null,
    class_spells: { known_spells: [] },
    ...overrides
  });

describe('Chaos Weaver progression policy', () => {
  it('refuses automatic starter spell top-up for policy classes', async () => {
    setChaosWeaverState();

    const result = await useCharacterStore.getState().ensureClassStarterSpells('Chaos Weaver');

    expect(result).toBe(false);
    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([]);
  });

  it('refuses random level-up spell assignment for policy classes', () => {
    setChaosWeaverState({
      level: 4,
      class_spells: { known_spells: ['cr1_chaos_weaver_fold_odds'] }
    });

    useCharacterStore.getState().assignSpellsForLevel(4, 'Chaos Weaver');

    expect(useCharacterStore.getState().class_spells.known_spells).toEqual([
      'cr1_chaos_weaver_fold_odds'
    ]);
  });

  it('keeps automatic assignment for legacy classes without a policy', async () => {
    useCharacterStore.setState({
      level: 1,
      characterClass: 'Minstrel',
      currentCharacterId: null,
      class_spells: { known_spells: [] }
    });

    const result = await useCharacterStore.getState().ensureClassStarterSpells('Minstrel');

    expect(result).toBe(true);
    expect(useCharacterStore.getState().class_spells.known_spells.length).toBe(3);
  });

  it('reconciles a reduced level allocation and removes only its derived grants', () => {
    useCharacterStore.setState({
      level: 10,
      class: 'Chaos Weaver',
      currentCharacterId: null,
      characters: [],
      primarySpecialization: 'probability-sculptor',
      talents: {
        cw1_ps_n01: 3,
        cw1_ps_n02: 3,
        cw1_ps_n03: 3,
        cw1_ps_n04: 1,
        cw1_ps_n05: 1,
        cw1_ps_n18: 1
      }
    });

    const derived = {
      id: 'cr1_chaos_weaver_bias_draw',
      source: 'talent',
      talentId: 'cw1_ps_n05'
    };
    const authored = {
      id: 'cr1_chaos_weaver_fold_odds',
      source: 'chaos-weaver-core',
      name: 'Fold Odds'
    };
    useSpellbookStore.setState({ spells: [derived, authored] });
    __setLibrary({ spells: [derived, authored] });

    useCharacterStore.getState().updateLevel(1);

    const talents = useCharacterStore.getState().talents;
    expect(talents.cw1_ps_n05).toBeUndefined();
    expect(talents.cw1_ps_n18).toBeUndefined();
    expect(Object.values(talents).reduce((total, rank) => total + rank, 0)).toBeLessThanOrEqual(5);

    const spellIds = useSpellbookStore.getState().spells.map(spell => spell.id);
    expect(spellIds).not.toContain('cr1_chaos_weaver_bias_draw');
    expect(spellIds).toContain('cr1_chaos_weaver_fold_odds');

    const libraryIds = __getLibrary().spells.map(spell => spell.id);
    expect(libraryIds).not.toContain('cr1_chaos_weaver_bias_draw');
    expect(libraryIds).toContain('cr1_chaos_weaver_fold_odds');
  });

  it('clears old-class allocation and grants on a class switch unless another character needs them', () => {
    useCharacterStore.setState({
      level: 10,
      class: 'Chaos Weaver',
      currentCharacterId: null,
      characters: [
        { id: 'other', class: 'Chaos Weaver', talents: { cw1_ps_n18: 1 } }
      ],
      primarySpecialization: 'probability-sculptor',
      talents: {
        cw1_ps_n01: 3,
        cw1_ps_n02: 3,
        cw1_ps_n03: 3,
        cw1_ps_n04: 1,
        cw1_ps_n05: 1
      }
    });
    useSpellbookStore.setState({
      spells: [
        { id: 'cr1_chaos_weaver_bias_draw', source: 'talent', talentId: 'cw1_ps_n05' },
        { id: 'cw1_closed_distribution', source: 'talent', talentId: 'cw1_ps_n18' }
      ]
    });

    useCharacterStore.getState().updateCharacterInfo('class', 'Berserker');

    expect(useCharacterStore.getState().talents).toEqual({});
    const spellIds = useSpellbookStore.getState().spells.map(spell => spell.id);
    expect(spellIds).not.toContain('cr1_chaos_weaver_bias_draw');
    expect(spellIds).toContain('cw1_closed_distribution');
  });
});
