import {
  CRUSADER_DATA, CRUSADER_MANIFEST, CRUSADER_PROGRESSION_POLICY
} from '../crusaderData';
import {
  CRUSADER_SOLAR_JUSTICIAR, CRUSADER_DAWN_BASTION, CRUSADER_HARMONIC_INQUISITOR
} from '../../talentTrees/crusader';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { crusaderResourceGuide } from '../../resourceSystems/crusaderResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [CRUSADER_SOLAR_JUSTICIAR, CRUSADER_DAWN_BASTION, CRUSADER_HARMONIC_INQUISITOR];

describe('Crusader RI-7 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(CRUSADER_DATA.spells).toHaveLength(41);
    expect(new Set(CRUSADER_DATA.spells.map(spell => spell.id)).size).toBe(41);
    expect(CRUSADER_MANIFEST.authoredSpells).toBe(41);
    expect(CRUSADER_DATA.spellPools[1]).toHaveLength(5);
    for (let level = 2; level <= 10; level += 1) {
      expect(CRUSADER_DATA.spellPools[level]).toHaveLength(4);
      CRUSADER_DATA.spellPools[level].forEach(id => {
        expect(CRUSADER_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees', () => {
    expect(Object.keys(TALENT_TREES.Crusader)).toEqual(['solar_justiciar', 'dawn_bastion', 'harmonic_inquisitor']);
    trees.forEach(nodes => {
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(57);
    expect(CRUSADER_MANIFEST.treeIds).toEqual(['solar_justiciar', 'dawn_bastion', 'harmonic_inquisitor']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(CRUSADER_PROGRESSION_POLICY).toMatchObject({
      classId: 'crusader', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(CRUSADER_DATA.progression.policy).toBe(CRUSADER_PROGRESSION_POLICY);
    CRUSADER_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(CRUSADER_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Crusader).toMatchObject({ id: 'crusader', name: 'Crusader' });
    expect(ALL_CLASS_SPELLS.Crusader.length).toBeGreaterThanOrEqual(41);
    expect(CLASS_SPECIALIZATIONS.Crusader.specializations.map(spec => spec.id))
      .toEqual(['solar_justiciar', 'dawn_bastion', 'harmonic_inquisitor']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Crusader')).toMatchObject({ resource: 'Fervor' });
    expect(getResourceSystemGuide('crusader')).toBe(crusaderResourceGuide);
    expect(initializeClassResource('Crusader', {})).toMatchObject({ type: 'radiantFervor', current: 0, max: 100 });
  });

  test('preserves native subrace data and retained identity', () => {
    expect(CRUSADER_DATA.restrictions.allowedSubraces).toEqual(['skald_human', 'thrask_solari', 'silath_astril']);
    expect(getClassNativeHeritageIds('Crusader').length).toBeGreaterThan(0);
    expect(CRUSADER_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(CRUSADER_MANIFEST.automaticConversion).toBe(false);
  });
});
