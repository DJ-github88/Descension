import {
  SPELLGUARD_DATA, SPELLGUARD_MANIFEST, SPELLGUARD_PROGRESSION_POLICY
} from '../spellguardData';
import {
  SPELLGUARD_ARCANE_WARDEN, SPELLGUARD_SPELL_BREAKER, SPELLGUARD_MANA_REAVER
} from '../../talentTrees/spellguard';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { getResourceSystemGuide } from '../../resourceSystems';
import { spellguardResourceGuide } from '../../resourceSystems/spellguardResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getClassNativeHeritageIds } from '../../classHeritageRegistry';

const trees = [SPELLGUARD_ARCANE_WARDEN, SPELLGUARD_SPELL_BREAKER, SPELLGUARD_MANA_REAVER];

describe('Spellguard RI-8 legacy-roster integration lock', () => {
  test('preserves the authored spell library and ten non-empty level pools', () => {
    expect(SPELLGUARD_DATA.spells).toHaveLength(48);
    expect(new Set(SPELLGUARD_DATA.spells.map(spell => spell.id)).size).toBe(48);
    expect(SPELLGUARD_MANIFEST.authoredSpells).toBe(48);
    expect(SPELLGUARD_DATA.spellPools[1]).toHaveLength(8);
    expect(SPELLGUARD_DATA.spellPools[2]).toHaveLength(6);
    for (let level = 3; level <= 10; level += 1) {
      expect(SPELLGUARD_DATA.spellPools[level]).toHaveLength(4);
    }
    for (let level = 1; level <= 10; level += 1) {
      SPELLGUARD_DATA.spellPools[level].forEach(id => {
        expect(SPELLGUARD_DATA.spells.some(spell => spell.id === id)).toBe(true);
      });
    }
  });

  test('keeps three complete fifty-point trees', () => {
    expect(Object.keys(TALENT_TREES.Spellguard)).toEqual(['arcane_warden', 'spell_breaker', 'mana_reaver']);
    expect(trees.map(nodes => nodes.length)).toEqual([20, 19, 19]);
    trees.forEach(nodes => {
      expect(nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
      nodes.forEach(node => {
        expect(node.spell).toBeTruthy();
        expect(node.rankUpgrades || []).toHaveLength((node.maxRanks || 1) - 1);
      });
    });
    expect(trees.reduce((sum, nodes) => sum + nodes.length, 0)).toBe(58);
    expect(SPELLGUARD_MANIFEST.treeIds).toEqual(['arcane_warden', 'spell_breaker', 'mana_reaver']);
  });

  test('authors explicit three-pick creation and one optional per level', () => {
    expect(SPELLGUARD_PROGRESSION_POLICY).toMatchObject({
      classId: 'spellguard', startingSpellPicks: 3, optionalPicksPerLevel: 1,
      grantedCoreSpellIds: [], randomizeStartingSpells: false, autoTopUpOnLoad: false
    });
    expect(SPELLGUARD_DATA.progression.policy).toBe(SPELLGUARD_PROGRESSION_POLICY);
    expect(SPELLGUARD_DATA.progression.levels).toHaveLength(10);
    SPELLGUARD_DATA.progression.levels.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
      expect(entry.newChoiceIds).toEqual(SPELLGUARD_DATA.spellPools[index + 1]);
    });
  });

  test('keeps the two weakness passives as catalogue-only records', () => {
    const poolIds = new Set(Object.values(SPELLGUARD_DATA.spellPools).flat());
    expect(SPELLGUARD_DATA.spells.map(spell => spell.id).filter(id => !poolIds.has(id))).toEqual([
      'spellguard_arcane_radiation', 'spellguard_kinetic_fragility'
    ]);
  });

  test('keeps the finite AEP intake contract separate from the authored library', () => {
    expect(SPELLGUARD_DATA.classResource).toMatchObject({ type: 'aep', base: 0, max: 100 });
    expect(SPELLGUARD_DATA.classResource.criticalThresholds).toEqual({ meltdown: 100 });
    const initial = initializeClassResource('Spellguard', {});
    expect(initial).toMatchObject({ type: 'arcaneEnergyPoints', current: 0, max: 100 });
    expect(initial.spellguardIntake.receipts).toEqual([]);
  });

  test('registers catalogue, spells, trees, specializations, display and guide', () => {
    expect(ALL_CLASSES_DATA.Spellguard).toMatchObject({ id: 'spellguard', name: 'Spellguard' });
    expect(ALL_CLASS_SPELLS.Spellguard.length).toBeGreaterThanOrEqual(48);
    expect(CLASS_SPECIALIZATIONS.Spellguard.specializations.map(spec => spec.id))
      .toEqual(['arcane_warden', 'spell_breaker', 'mana_reaver']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Spellguard')).toMatchObject({ resource: 'Resonance' });
    expect(getResourceSystemGuide('spellguard')).toBe(spellguardResourceGuide);
  });

  test('preserves native subrace data and retained identity', () => {
    expect(SPELLGUARD_DATA.restrictions.allowedSubraces).toEqual([
      'velun_neth', 'thalren_human', 'korr_solari', 'thrask_solari'
    ]);
    expect(getClassNativeHeritageIds('Spellguard')).toEqual(expect.arrayContaining([
      'velun_neth', 'thalren_human', 'korr_solari', 'thrask_solari'
    ]));
    expect(SPELLGUARD_MANIFEST.legacyIdsPreserved).toBe(true);
    expect(SPELLGUARD_MANIFEST.automaticConversion).toBe(false);
  });
});
