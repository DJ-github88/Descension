import {
  BERSERKER_DATA, BERSERKER_MANIFEST, BERSERKER_PROGRESSION_POLICY
} from '../berserkerData';
import { BERSERKER_SAVAGE, BERSERKER_JUGGERNAUT, BERSERKER_WARLORD } from '../../talentTrees/berserker';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { berserkerResourceGuide } from '../../resourceSystems/berserkerResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [BERSERKER_SAVAGE, BERSERKER_JUGGERNAUT, BERSERKER_WARLORD];

describe('Berserker RI-7 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(BERSERKER_DATA.spells).toHaveLength(47);
    expect(new Set(BERSERKER_DATA.spells.map(spell => spell.id)).size).toBe(47);
    expect(BERSERKER_MANIFEST.authoredSpells).toBe(47);
    expect(BERSERKER_DATA.spellPools[1]).toHaveLength(9);
    for (let level = 2; level <= 10; level += 1) {
      expect(BERSERKER_DATA.spellPools[level]).toHaveLength(4);
      const pool = BERSERKER_DATA.spellPools[level];
      pool.forEach(id => expect(BERSERKER_DATA.spells.some(spell => spell.id === id)).toBe(true));
    }
  });

  test('keeps three complete fifty-point trees', () => {
    expect(Object.keys(TALENT_TREES.Berserker)).toEqual(['savage', 'juggernaut', 'warlord']);
    trees.forEach(nodes => {
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(54);
    expect(BERSERKER_MANIFEST.treeIds).toEqual(['savage', 'juggernaut', 'warlord']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(BERSERKER_PROGRESSION_POLICY).toMatchObject({
      classId: 'berserker', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(BERSERKER_DATA.progression.policy).toBe(BERSERKER_PROGRESSION_POLICY);
    expect(BERSERKER_DATA.progression.levels).toHaveLength(10);
    BERSERKER_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(BERSERKER_DATA.spellPools[index + 1]);
    });
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Berserker).toMatchObject({ id: 'berserker', name: 'Berserker' });
    expect(ALL_CLASS_SPELLS.Berserker.length).toBeGreaterThanOrEqual(47);
    expect(CLASS_SPECIALIZATIONS.Berserker.specializations.map(spec => spec.id)).toEqual(['savage', 'juggernaut', 'warlord']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Berserker')).toMatchObject({ resource: 'Rage' });
    expect(getResourceSystemGuide('berserker')).toBe(berserkerResourceGuide);
    expect(initializeClassResource('Berserker', {})).toMatchObject({ type: 'bloodHeat', current: 0, max: 100 });
  });

  test('preserves native subrace data and retained identity', () => {
    expect(BERSERKER_DATA.restrictions.allowedSubraces).toEqual(['skald_human', 'thrask_solari', 'morgh_groven']);
    expect(getClassNativeHeritageIds('Berserker')).toEqual(expect.arrayContaining(['skald_human', 'morgh_groven']));
    expect(BERSERKER_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(BERSERKER_MANIFEST.automaticConversion).toBe(false);
  });
});
