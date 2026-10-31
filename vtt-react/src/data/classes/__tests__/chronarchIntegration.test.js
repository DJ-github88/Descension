import {
  CHRONARCH_DATA, CHRONARCH_MANIFEST, CHRONARCH_PROGRESSION_POLICY
} from '../chronarchData';
import {
  CHRONARCH_STASIS_TREE, CHRONARCH_DISPLACEMENT_TREE, CHRONARCH_REWINDING_TREE
} from '../../talentTrees/chronarch';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { chronarchResourceGuide } from '../../resourceSystems/chronarchResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const treeArrays = [CHRONARCH_STASIS_TREE, CHRONARCH_DISPLACEMENT_TREE, CHRONARCH_REWINDING_TREE];

describe('Chronarch RI-6 legacy-roster integration lock', () => {
  test('preserves the full authored spell library and ten non-empty level pools', () => {
    expect(CHRONARCH_DATA.spells).toHaveLength(49);
    expect(new Set(CHRONARCH_DATA.spells.map(spell => spell.id)).size).toBe(49);
    expect(CHRONARCH_MANIFEST.authoredSpells).toBe(49);
    expect(CHRONARCH_DATA.spellPools[1]).toHaveLength(7);
    expect(CHRONARCH_DATA.spellPools[2]).toHaveLength(6);
    for (let level = 3; level <= 10; level += 1) {
      expect(CHRONARCH_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      const pool = CHRONARCH_DATA.spellPools[level];
      expect(pool.length).toBeGreaterThan(0);
      pool.forEach(id => {
        expect(CHRONARCH_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees with full rank data', () => {
    let nodeTotal = 0;
    treeArrays.forEach(nodes => {
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades).toHaveLength((node.maxRanks || 1) - 1);
      });
      nodeTotal += nodes.length;
    });
    expect(nodeTotal).toBe(57);
    expect(CHRONARCH_MANIFEST.treeIds).toEqual(['displacement', 'rewinding', 'stasis']);
  });

  test('authors an explicit three-pick creation policy with one optional pick per level', () => {
    expect(CHRONARCH_PROGRESSION_POLICY).toMatchObject({
      classId: 'chronarch', levelCap: 10, startingSpellPicks: 3,
      optionalPicksPerLevel: 1, allowEarlierUnchosen: true,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(CHRONARCH_DATA.progression.policy).toBe(CHRONARCH_PROGRESSION_POLICY);
    expect(CHRONARCH_DATA.progression.levels).toHaveLength(10);
    CHRONARCH_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(CHRONARCH_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, generated spells, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Chronarch).toMatchObject({ id: 'chronarch', name: 'Chronarch' });
    expect(ALL_CLASS_SPELLS.Chronarch.length).toBeGreaterThanOrEqual(49);
    CHRONARCH_DATA.spells.forEach(spell => expect(ALL_CLASS_SPELLS.Chronarch.some(entry => entry.id === spell.id)).toBe(true));
    expect(Object.keys(TALENT_TREES.Chronarch)).toEqual(['stasis', 'displacement', 'rewinding']);
    expect(CLASS_SPECIALIZATIONS.Chronarch.specializations.map(spec => spec.id))
      .toEqual(['stasis', 'displacement', 'rewinding']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Chronarch')).toMatchObject({
      resource: 'Shards'
    });
    expect(getResourceSystemGuide('chronarch')).toBe(chronarchResourceGuide);
  });

  test('initializes time shards and strain at zero without inventing a temporal state', () => {
    const fresh = initializeClassResource('Chronarch', {});
    expect(fresh.timeShards).toEqual({ current: 0, max: 10 });
    expect(fresh.temporalStrain).toEqual({ current: 0, max: 10 });
  });

  test('preserves the existing native subrace list and retained class identity', () => {
    expect(CHRONARCH_DATA.restrictions.allowedSubraces).toEqual([
      'kethrin_fexric', 'ithran_groven', 'tessen_human', 'velun_neth'
    ]);
    expect(getClassNativeHeritageIds('Chronarch')).toEqual(expect.arrayContaining([
      'kethrin_fexric', 'ithran_groven', 'tessen_human', 'velun_neth'
    ]));
    expect(CHRONARCH_DATA.id).toBe('chronarch');
    expect(CHRONARCH_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(CHRONARCH_MANIFEST.automaticConversion).toBe(false);
  });
});
