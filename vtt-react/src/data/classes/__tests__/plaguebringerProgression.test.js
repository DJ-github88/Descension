import {
  PLAGUEBRINGER_DATA,
  PLAGUEBRINGER_CORE_SPELL_IDS,
  PLAGUEBRINGER_OPTIONAL_RECORDS,
  PLAGUEBRINGER_SPELL_POOLS,
  PLAGUEBRINGER_TALENT_NODES,
  prunePlaguebringerTalents
} from '../plaguebringerData';
import { TALENT_TREES } from '../../talentTreeData';
import { derivedTalentGrantIds, pruneTalentsForChange } from '../../../store/characterSlices/progressionSlice';
import { initializeClassResource } from '../../classResources';

describe('Plaguebringer progression policy', () => {
  test('uses two core grants and one optional level-1 pick', () => {
    expect(PLAGUEBRINGER_CORE_SPELL_IDS).toEqual([
      'pb_curse_of_agony',
      'pb_whisper_of_decay'
    ]);
    expect(PLAGUEBRINGER_DATA.progression.policy).toMatchObject({
      startingSpellPicks: 1,
      optionalPicksPerLevel: 1,
      allowEarlierUnchosen: true,
      grantedCoreSpellIds: PLAGUEBRINGER_CORE_SPELL_IDS,
      randomizeStartingSpells: false,
      autoTopUpOnLoad: false,
      manualOnly: true
    });
    expect(PLAGUEBRINGER_SPELL_POOLS[1]).toHaveLength(5);
    PLAGUEBRINGER_CORE_SPELL_IDS.forEach(id => {
      expect(PLAGUEBRINGER_SPELL_POOLS[1]).not.toContain(id);
    });
  });

  test('keeps optional records resolvable and excludes core grants', () => {
    const authoredIds = new Set(PLAGUEBRINGER_DATA.spells.map(spell => spell.id));
    const optionalIds = new Set(PLAGUEBRINGER_OPTIONAL_RECORDS.map(spell => spell.id));

    expect(PLAGUEBRINGER_OPTIONAL_RECORDS).toHaveLength(46);
    PLAGUEBRINGER_OPTIONAL_RECORDS.forEach(record => {
      expect(authoredIds.has(record.id)).toBe(true);
      expect(record.level).toBeGreaterThanOrEqual(1);
      expect(record.level).toBeLessThanOrEqual(10);
    });
    PLAGUEBRINGER_CORE_SPELL_IDS.forEach(id => {
      expect(optionalIds.has(id)).toBe(false);
    });
  });

  test('exposes every talent node as a derivable grant', () => {
    const nodes = Object.values(TALENT_TREES.Plaguebringer).flat();

    expect(nodes).toHaveLength(57);
    expect(PLAGUEBRINGER_TALENT_NODES).toHaveLength(57);
    nodes.forEach(node => {
      expect(node.grantId).toBe(`talent-spell-${node.id}`);
    });
    expect(derivedTalentGrantIds(
      { vs_t1_spore_volley: 1 },
      'Plaguebringer'
    )).toEqual(['talent-spell-vs_t1_spore_volley']);
  });

  test('prunes tier-two ranks when the level budget is too low', () => {
    const talents = {
      vs_t1_spore_volley: 3,
      vs_t1_rapid_contagion: 2,
      vs_t2_vector_detonation: 1
    };

    expect(prunePlaguebringerTalents(talents, 1)).toEqual({
      vs_t1_spore_volley: 3,
      vs_t1_rapid_contagion: 2
    });
    expect(prunePlaguebringerTalents(talents, 2)).toEqual(talents);
  });

  test('gates capstones at level 10 and 45 tree points', () => {
    const nodes = PLAGUEBRINGER_TALENT_NODES.filter(node => node.treeId === 'virulent_spreader');
    const maxed = Object.fromEntries(nodes.map(node => [node.id, node.maxRanks]));

    expect(prunePlaguebringerTalents(maxed, 9)).not.toHaveProperty('vs_t7_patient_zero');
    expect(prunePlaguebringerTalents(maxed, 10).vs_t7_patient_zero).toBe(1);

    const belowGate = { ...maxed };
    delete belowGate.vs_t7_waste_spore_doctrine;
    expect(prunePlaguebringerTalents(belowGate, 10)).not.toHaveProperty('vs_t7_patient_zero');
  });

  test('routes Plaguebringer through the shared policy pruner', () => {
    const talents = {
      vs_t1_spore_volley: 3,
      vs_t1_rapid_contagion: 2,
      vs_t2_vector_detonation: 1
    };

    expect(pruneTalentsForChange(talents, {
      previousClass: 'Plaguebringer',
      nextClass: 'Plaguebringer',
      level: 1
    })).toEqual({
      vs_t1_spore_volley: 3,
      vs_t1_rapid_contagion: 2
    });
  });

  test('initializes Virulence at its authored 0/100 range', () => {
    const resource = initializeClassResource('Plaguebringer', {
      level: 1,
      intelligence: 10,
      charisma: 10,
      spirit: 10
    });

    expect(resource.current).toBe(0);
    expect(resource.max).toBe(100);
    expect(resource.virulence).toBe(0);
    expect(resource.maxVirulence).toBe(100);
    expect(resource.afflictions).toBe(0);
    expect(resource.maxAfflictions).toBe(10);
  });
});
