import {
  TOXICOLOGIST_DATA, TOXICOLOGIST_MANIFEST, TOXICOLOGIST_PROGRESSION_POLICY
} from '../toxicologistData';
import {
  TOXICOLOGIST_VENOMANCER, TOXICOLOGIST_GADGETEER, TOXICOLOGIST_SABOTEUR
} from '../../talentTrees/toxicologist';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { toxicologistResourceGuide } from '../../resourceSystems/toxicologistResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [TOXICOLOGIST_VENOMANCER, TOXICOLOGIST_GADGETEER, TOXICOLOGIST_SABOTEUR];

describe('Toxicologist RI-8 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(TOXICOLOGIST_DATA.spells).toHaveLength(50);
    expect(new Set(TOXICOLOGIST_DATA.spells.map(spell => spell.id)).size).toBe(50);
    expect(TOXICOLOGIST_MANIFEST.authoredSpells).toBe(50);
    expect(TOXICOLOGIST_DATA.spellPools[1]).toHaveLength(8);
    expect(TOXICOLOGIST_DATA.spellPools[2]).toHaveLength(5);
    expect(TOXICOLOGIST_DATA.spellPools[3]).toHaveLength(6);
    for (let level = 4; level <= 10; level += 1) {
      expect(TOXICOLOGIST_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      TOXICOLOGIST_DATA.spellPools[level].forEach(id => {
        expect(TOXICOLOGIST_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees', () => {
    expect(Object.keys(TALENT_TREES.Toxicologist)).toEqual(['venomancer', 'gadgeteer', 'saboteur']);
    trees.forEach(nodes => {
      expect(nodes).toHaveLength(18);
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(54);
    expect(TOXICOLOGIST_MANIFEST.treeIds).toEqual(['venomancer', 'gadgeteer', 'saboteur']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(TOXICOLOGIST_PROGRESSION_POLICY).toMatchObject({
      classId: 'toxicologist', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(TOXICOLOGIST_DATA.progression.policy).toBe(TOXICOLOGIST_PROGRESSION_POLICY);
    expect(TOXICOLOGIST_DATA.progression.levels).toHaveLength(10);
    TOXICOLOGIST_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(TOXICOLOGIST_DATA.spellPools[index + 1]);
    });
  });

  test('keeps the three weakness records as catalogue-only entries', () => {
    const poolIds = new Set(Object.values(TOXICOLOGIST_DATA.spellPools).flat());
    expect(TOXICOLOGIST_DATA.spells.map(spell => spell.id).filter(id => !poolIds.has(id)).sort()).toEqual([
      'tox_vial_dependency', 'tox_no_hard_cc', 'tox_concoction_instability'
    ].sort());
  });

  test('keeps prepared vials and contraption parts as the initialized resource', () => {
    expect(TOXICOLOGIST_DATA.classResource).toMatchObject({
      type: 'vials', base: 4, max: 10,
      secondaryResource: { type: 'contraption_parts', max: 5 }
    });
    expect(initializeClassResource('Toxicologist', {})).toMatchObject({
      type: 'toxinVialsContraptions', current: 4, max: 4,
      toxinVials: 4, toxinVialsMax: 4, contraptionParts: 5, contraptionPartsMax: 5
    });
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Toxicologist).toMatchObject({ id: 'toxicologist', name: 'Toxicologist' });
    expect(ALL_CLASS_SPELLS.Toxicologist.length).toBeGreaterThanOrEqual(50);
    expect(CLASS_SPECIALIZATIONS.Toxicologist.specializations.map(spec => spec.id))
      .toEqual(['venomancer', 'gadgeteer', 'saboteur']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Toxicologist')).toMatchObject({ resource: 'Vials' });
    expect(getResourceSystemGuide('toxicologist')).toBe(toxicologistResourceGuide);
  });

  test('preserves native subrace data and prepared-chemistry identity', () => {
    expect(TOXICOLOGIST_DATA.restrictions.allowedSubraces).toEqual([
      'thalren_human', 'tethered_mimir', 'viridian_florae', 'florae_unified', 'drun_neth'
    ]);
    expect(getClassNativeHeritageIds('Toxicologist')).toEqual(expect.arrayContaining([
      'thalren_human', 'tethered_mimir', 'viridian_florae', 'florae_unified', 'drun_neth'
    ]));
    expect(TOXICOLOGIST_DATA.spells.map(spell => spell.id)).toContain('tox_alchemical_outbreak');
    expect(TOXICOLOGIST_DATA.spells.map(spell => spell.id)).not.toContain('tox_pandemic');
    expect(TOXICOLOGIST_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(TOXICOLOGIST_MANIFEST.automaticConversion).toBe(false);
  });
});
