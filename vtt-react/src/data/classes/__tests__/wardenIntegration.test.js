import {
  WARDEN_DATA, WARDEN_MANIFEST, WARDEN_PROGRESSION_POLICY
} from '../wardenData';
import {
  WARDEN_SHADOWBLADE, WARDEN_JAILER, WARDEN_VENGEANCE_SEEKER, WARDEN_MONOLITH
} from '../../talentTrees/warden';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { wardenResourceGuide } from '../../resourceSystems/wardenResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [WARDEN_SHADOWBLADE, WARDEN_JAILER, WARDEN_VENGEANCE_SEEKER, WARDEN_MONOLITH];

describe('Warden RI-7 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(WARDEN_DATA.spells).toHaveLength(46);
    expect(new Set(WARDEN_DATA.spells.map(spell => spell.id)).size).toBe(46);
    expect(WARDEN_MANIFEST.authoredSpells).toBe(46);
    expect(WARDEN_DATA.spellPools[1]).toHaveLength(5);
    expect(WARDEN_DATA.spellPools[2]).toHaveLength(8);
    for (let level = 3; level <= 10; level += 1) {
      expect(WARDEN_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      WARDEN_DATA.spellPools[level].forEach(id => {
        expect(WARDEN_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps four complete fifty-point trees, including the Jailer tree', () => {
    expect(Object.keys(TALENT_TREES.Warden)).toEqual(['shadowblade', 'jailer', 'vengeance-seeker', 'monolith']);
    trees.forEach(nodes => {
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(77);
    expect(WARDEN_MANIFEST.treeIds).toEqual(['shadowblade', 'jailer', 'vengeance-seeker', 'monolith']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(WARDEN_PROGRESSION_POLICY).toMatchObject({
      classId: 'warden', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(WARDEN_DATA.progression.policy).toBe(WARDEN_PROGRESSION_POLICY);
    WARDEN_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(WARDEN_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Warden).toMatchObject({ id: 'warden', name: 'Warden' });
    expect(ALL_CLASS_SPELLS.Warden.length).toBeGreaterThanOrEqual(46);
    expect(CLASS_SPECIALIZATIONS.Warden.specializations.map(spec => spec.id))
      .toEqual(['shadowblade', 'jailer', 'vengeance-seeker', 'monolith']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Warden')).toMatchObject({ resource: 'Tension' });
    expect(getResourceSystemGuide('warden')).toBe(wardenResourceGuide);
    expect(initializeClassResource('Warden', {})).toMatchObject({ type: 'vengeance-points', current: 0, max: 10 });
  });

  test('preserves native subrace data and retained identity', () => {
    expect(WARDEN_DATA.restrictions.allowedSubraces).toEqual([
      'morgh_groven', 'ithran_groven', 'drall_fexric', 'kethrin_fexric', 'skald_human', 'clean_vreken', 'marked_vreken'
    ]);
    expect(getClassNativeHeritageIds('Warden')).toEqual(expect.arrayContaining([
      'morgh_groven', 'ithran_groven', 'drall_fexric', 'kethrin_fexric', 'skald_human'
    ]));
    expect(WARDEN_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(WARDEN_MANIFEST.automaticConversion).toBe(false);
  });
});
