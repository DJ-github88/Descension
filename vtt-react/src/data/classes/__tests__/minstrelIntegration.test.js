import {
  MINSTREL_DATA, MINSTREL_MANIFEST, MINSTREL_PROGRESSION_POLICY
} from '../minstrelData';
import {
  MINSTREL_HARMONIC_WEAVING, MINSTREL_CHORD_COMBINATIONS, MINSTREL_MUSICAL_MAGIC
} from '../../talentTrees/minstrel';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { minstrelResourceGuide } from '../../resourceSystems/minstrelResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const treeArrays = [MINSTREL_HARMONIC_WEAVING, MINSTREL_CHORD_COMBINATIONS, MINSTREL_MUSICAL_MAGIC];

describe('Minstrel RI-6 legacy-roster integration lock', () => {
  test('preserves the full authored spell library and ten non-empty level pools', () => {
    expect(MINSTREL_DATA.spells).toHaveLength(51);
    expect(new Set(MINSTREL_DATA.spells.map(spell => spell.id)).size).toBe(51);
    expect(MINSTREL_MANIFEST.authoredSpells).toBe(51);
    expect(MINSTREL_DATA.spellPools[1]).toHaveLength(9);
    expect(MINSTREL_DATA.spellPools[2]).toHaveLength(5);
    expect(MINSTREL_DATA.spellPools[3]).toHaveLength(6);
    for (let level = 4; level <= 10; level += 1) {
      expect(MINSTREL_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      const pool = MINSTREL_DATA.spellPools[level];
      expect(pool.length).toBeGreaterThan(0);
      pool.forEach(id => {
        expect(MINSTREL_DATA.spells.some(spell => spell.id === id)).toBe(true);
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
    expect(MINSTREL_MANIFEST.treeIds).toEqual(['harmonic_weaving', 'chord_combinations', 'musical_magic']);
  });

  test('authors an explicit three-pick creation policy with one optional pick per level', () => {
    expect(MINSTREL_PROGRESSION_POLICY).toMatchObject({
      classId: 'minstrel', levelCap: 10, startingSpellPicks: 3,
      optionalPicksPerLevel: 1, allowEarlierUnchosen: true,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(MINSTREL_DATA.progression.policy).toBe(MINSTREL_PROGRESSION_POLICY);
    expect(MINSTREL_DATA.progression.levels).toHaveLength(10);
    MINSTREL_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(MINSTREL_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, generated spells, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Minstrel).toMatchObject({ id: 'minstrel', name: 'Minstrel' });
    expect(ALL_CLASS_SPELLS.Minstrel.length).toBeGreaterThanOrEqual(51);
    MINSTREL_DATA.spells.forEach(spell => expect(ALL_CLASS_SPELLS.Minstrel.some(entry => entry.id === spell.id)).toBe(true));
    expect(Object.keys(TALENT_TREES.Minstrel)).toEqual(['soulsinger', 'battlechoir', 'dissonance']);
    expect(CLASS_SPECIALIZATIONS.Minstrel.specializations.map(spec => spec.id))
      .toEqual(['battlechoir', 'soulsinger', 'dissonance']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Minstrel')).toMatchObject({
      resource: 'Notes'
    });
    expect(getResourceSystemGuide('minstrel')).toBe(minstrelResourceGuide);
  });

  test('initializes a seven-pitch note bank without inventing notes', () => {
    const fresh = initializeClassResource('Minstrel', {});
    expect(fresh).toMatchObject({ type: 'musicalNotes', current: 0, max: 35 });
    expect(fresh.notes).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  test('preserves the existing native subrace list and retained class identity', () => {
    expect(MINSTREL_DATA.restrictions.allowedSubraces).toEqual([
      'merryn_human', 'shoreling_myrathil', 'riverling_myrathil', 'deepling_myrathil', 'clean_vreken'
    ]);
    expect(getClassNativeHeritageIds('Minstrel')).toEqual(expect.arrayContaining([
      'merryn_human', 'shoreling_myrathil', 'riverling_myrathil', 'deepling_myrathil'
    ]));
    expect(MINSTREL_DATA.id).toBe('minstrel');
    expect(MINSTREL_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(MINSTREL_MANIFEST.automaticConversion).toBe(false);
  });
});
