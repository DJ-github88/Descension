import {
  INQUISITOR_DATA, INQUISITOR_MANIFEST, INQUISITOR_PROGRESSION_POLICY
} from '../inquisitorData';
import {
  INQUISITOR_WITCH_HAMMER, INQUISITOR_IRON_VERDICT, INQUISITOR_HOLLOW_SAINT
} from '../../talentTrees/inquisitor';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { inquisitorResourceGuide } from '../../resourceSystems/inquisitorResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [INQUISITOR_WITCH_HAMMER, INQUISITOR_IRON_VERDICT, INQUISITOR_HOLLOW_SAINT];

describe('Inquisitor RI-8 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(INQUISITOR_DATA.spells).toHaveLength(46);
    expect(new Set(INQUISITOR_DATA.spells.map(spell => spell.id)).size).toBe(46);
    expect(INQUISITOR_MANIFEST.authoredSpells).toBe(46);
    expect(INQUISITOR_DATA.spellPools[1]).toHaveLength(8);
    expect(INQUISITOR_DATA.spellPools[2]).toHaveLength(6);
    for (let level = 3; level <= 10; level += 1) {
      expect(INQUISITOR_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      INQUISITOR_DATA.spellPools[level].forEach(id => {
        expect(INQUISITOR_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees', () => {
    expect(Object.keys(TALENT_TREES.Inquisitor)).toEqual(['witch_hammer', 'iron_verdict', 'hollow_saint']);
    trees.forEach(nodes => {
      expect(nodes).toHaveLength(19);
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(57);
    expect(INQUISITOR_MANIFEST.treeIds).toEqual(['witch_hammer', 'iron_verdict', 'hollow_saint']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(INQUISITOR_PROGRESSION_POLICY).toMatchObject({
      classId: 'inquisitor', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(INQUISITOR_DATA.progression.policy).toBe(INQUISITOR_PROGRESSION_POLICY);
    expect(INQUISITOR_DATA.progression.levels).toHaveLength(10);
    INQUISITOR_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(INQUISITOR_DATA.spellPools[index + 1]);
    });
  });

  test('keeps every authored spell reachable from an authored pool', () => {
    const poolIds = new Set(Object.values(INQUISITOR_DATA.spellPools).flat());
    expect(INQUISITOR_DATA.spells.map(spell => spell.id).filter(id => !poolIds.has(id))).toEqual([]);
  });

  test('leaves the Covenbane and Exorcist records preserved by the retained IDs', () => {
    const ids = INQUISITOR_DATA.spells.map(spell => spell.id);
    expect(ids).toContain('inq_exorcise_place');
    expect(ids).toContain('inq_iron_interrogation');
    expect(ids).toContain('inq_silver_hex');
    expect(INQUISITOR_DATA.name).toBe('Inquisitor');
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Inquisitor).toMatchObject({ id: 'inquisitor', name: 'Inquisitor' });
    expect(ALL_CLASS_SPELLS.Inquisitor.length).toBeGreaterThanOrEqual(46);
    expect(CLASS_SPECIALIZATIONS.Inquisitor.specializations.map(spec => spec.id))
      .toEqual(['witch_hammer', 'iron_verdict', 'hollow_saint']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Inquisitor')).toMatchObject({ resource: 'Authority' });
    expect(getResourceSystemGuide('inquisitor')).toBe(inquisitorResourceGuide);
    expect(initializeClassResource('Inquisitor', {})).toMatchObject({ type: 'authority', current: 0, max: 8 });
  });

  test('preserves native subrace data and retained identity', () => {
    expect(INQUISITOR_DATA.restrictions.allowedSubraces).toEqual([
      'marked_vreken', 'clean_vreken', 'thalren_human', 'tethered_mimir'
    ]);
    expect(getClassNativeHeritageIds('Inquisitor')).toEqual(expect.arrayContaining([
      'marked_vreken', 'thalren_human', 'tethered_mimir'
    ]));
    expect(INQUISITOR_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(INQUISITOR_MANIFEST.automaticConversion).toBe(false);
  });
});
