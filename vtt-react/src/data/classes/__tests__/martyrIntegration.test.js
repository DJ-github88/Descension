import {
  MARTYR_DATA, MARTYR_MANIFEST, MARTYR_PROGRESSION_POLICY
} from '../martyrData';
import {
  MARTYR_REDEMPTION, MARTYR_ZEALOT, MARTYR_ASCETIC, MARTYR_IRONCLAD
} from '../../talentTrees/martyr';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { martyrResourceGuide } from '../../resourceSystems/martyrResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [MARTYR_REDEMPTION, MARTYR_ZEALOT, MARTYR_ASCETIC, MARTYR_IRONCLAD];

describe('Martyr RI-7 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(MARTYR_DATA.spells).toHaveLength(48);
    expect(new Set(MARTYR_DATA.spells.map(spell => spell.id)).size).toBe(48);
    expect(MARTYR_MANIFEST.authoredSpells).toBe(48);
    expect(MARTYR_DATA.spellPools[1]).toHaveLength(7);
    expect(MARTYR_DATA.spellPools[2]).toHaveLength(8);
    for (let level = 3; level <= 10; level += 1) {
      expect(MARTYR_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      MARTYR_DATA.spellPools[level].forEach(id => {
        expect(MARTYR_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps four complete fifty-point trees, including Ironclad', () => {
    expect(Object.keys(TALENT_TREES.Martyr)).toEqual(['redemption', 'zealot', 'ascetic', 'ironclad']);
    trees.forEach(nodes => {
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(73);
    expect(MARTYR_MANIFEST.treeIds).toEqual(['redemption', 'zealot', 'ascetic', 'ironclad']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(MARTYR_PROGRESSION_POLICY).toMatchObject({
      classId: 'martyr', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(MARTYR_DATA.progression.policy).toBe(MARTYR_PROGRESSION_POLICY);
    MARTYR_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(MARTYR_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Martyr).toMatchObject({ id: 'martyr', name: 'Martyr' });
    expect(ALL_CLASS_SPELLS.Martyr.length).toBeGreaterThanOrEqual(48);
    expect(CLASS_SPECIALIZATIONS.Martyr.specializations.map(spec => spec.id))
      .toEqual(['redemption', 'zealot', 'ascetic', 'ironclad']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Martyr')).toMatchObject({ resource: 'Devotion' });
    expect(getResourceSystemGuide('martyr')).toBe(martyrResourceGuide);
    expect(initializeClassResource('Martyr', {})).toMatchObject({ type: 'devotionGauge', current: 0, max: 6 });
  });

  test('preserves native subrace data and retained identity', () => {
    expect(MARTYR_DATA.restrictions.allowedSubraces).toEqual([
      'korr_solari', 'thrask_solari', 'morgh_groven', 'ithran_groven', 'skald_human'
    ]);
    expect(getClassNativeHeritageIds('Martyr').length).toBeGreaterThan(0);
    expect(MARTYR_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(MARTYR_MANIFEST.automaticConversion).toBe(false);
  });
});
