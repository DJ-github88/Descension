import {
  ARCANONEER_DATA, ARCANONEER_MANIFEST, ARCANONEER_PROGRESSION_POLICY
} from '../arcanoneerData';
import {
  ARCANONEER_PRISM_MAGE, ARCANONEER_ENTROPY_WEAVER, ARCANONEER_SPHERE_ARCHITECT
} from '../../talentTrees/arcanoneer';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { arcanoneerResourceGuide } from '../../resourceSystems/arcanoneerResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const treeArrays = {
  prism_mage: ARCANONEER_PRISM_MAGE,
  entropy_weaver: ARCANONEER_ENTROPY_WEAVER,
  sphere_architect: ARCANONEER_SPHERE_ARCHITECT
};

describe('Arcanoneer RI-6 legacy-roster integration lock', () => {
  test('preserves the full authored spell library and ten non-empty level pools', () => {
    expect(ARCANONEER_DATA.spells).toHaveLength(43);
    expect(new Set(ARCANONEER_DATA.spells.map(spell => spell.id)).size).toBe(43);
    expect(ARCANONEER_MANIFEST.authoredSpells).toBe(43);
    expect(ARCANONEER_DATA.spellPools[1]).toHaveLength(6);
    for (let level = 2; level <= 10; level += 1) {
      expect(ARCANONEER_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      const pool = ARCANONEER_DATA.spellPools[level];
      expect(pool.length).toBeGreaterThan(0);
      pool.forEach(id => {
        expect(ARCANONEER_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees with full rank data', () => {
    expect(Object.keys(treeArrays)).toHaveLength(3);
    let nodeTotal = 0;
    Object.values(treeArrays).forEach(nodes => {
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(Array.isArray(node.rankUpgrades)).toBe(true);
        expect(node.rankUpgrades).toHaveLength((node.maxRanks || 1) - 1);
      });
      nodeTotal += nodes.length;
    });
    expect(nodeTotal).toBe(57);
    expect(ARCANONEER_MANIFEST.treeIds).toEqual(['prism_mage', 'entropy_weaver', 'sphere_architect']);
  });

  test('authors an explicit three-pick creation policy with one optional pick per level', () => {
    expect(ARCANONEER_PROGRESSION_POLICY).toMatchObject({
      classId: 'arcanoneer', levelCap: 10, startingSpellPicks: 3,
      optionalPicksPerLevel: 1, allowEarlierUnchosen: true,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(ARCANONEER_DATA.progression.policy).toBe(ARCANONEER_PROGRESSION_POLICY);
    expect(ARCANONEER_DATA.progression.levels).toHaveLength(10);
    ARCANONEER_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(ARCANONEER_DATA.spellPools[index + 1]);
      expect(entry.optionalPicks).toBe(1);
    });
  });

  test('registers catalogue, generated spells, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Arcanoneer).toMatchObject({ id: 'arcanoneer', name: 'Arcanoneer' });
    expect(ALL_CLASS_SPELLS.Arcanoneer.length).toBeGreaterThanOrEqual(43);
    ARCANONEER_DATA.spells.forEach(spell => expect(ALL_CLASS_SPELLS.Arcanoneer.some(entry => entry.id === spell.id)).toBe(true));
    expect(Object.keys(TALENT_TREES.Arcanoneer)).toEqual(['prism_mage', 'entropy_weaver', 'sphere_architect']);
    expect(CLASS_SPECIALIZATIONS.Arcanoneer.specializations.map(spec => spec.id))
      .toEqual(['prism_mage', 'entropy_weaver', 'sphere_architect']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Arcanoneer')).toMatchObject({
      resource: 'Spheres'
    });
    expect(getResourceSystemGuide('arcanoneer')).toBe(arcanoneerResourceGuide);
  });

  test('initializes the sphere bank without inventing a rolled hand', () => {
    const fresh = initializeClassResource('Arcanoneer', {});
    expect(fresh).toMatchObject({ type: 'elementalSpheres', current: 0, max: 12 });
    expect(fresh.spheres).toEqual([]);
  });

  test('preserves the existing native subrace list and retained class identity', () => {
    expect(ARCANONEER_DATA.restrictions.allowedSubraces).toEqual([
      'velun_neth', 'kethrin_fexric', 'drall_fexric', 'vashir_astril'
    ]);
    expect(getClassNativeHeritageIds('Arcanoneer')).toEqual(expect.arrayContaining([
      'velun_neth', 'kethrin_fexric', 'drall_fexric', 'vashir_astril'
    ]));
    expect(ARCANONEER_DATA.id).toBe('arcanoneer');
    expect(ARCANONEER_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(ARCANONEER_MANIFEST.automaticConversion).toBe(false);
  });
});
