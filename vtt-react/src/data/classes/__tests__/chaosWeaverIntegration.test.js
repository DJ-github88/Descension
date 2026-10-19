import {
  CHAOS_WEAVER_DATA,
  CHAOS_WEAVER_SPELL_POOLS,
  CHAOS_WEAVER_PROGRESSION_POLICY,
  CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID
} from '../chaosWeaverIntegration';
import { CHAOS_WEAVER_ACTIVE_COUNTS, CHAOS_WEAVER_CORE_SPELLS } from '../chaosWeaverData';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_PROVENANCE, CLASS_COMPATIBILITY_ALIASES } from '../../classHeritageRegistry';
import {
  LEGACY_RECONSTRUCTION_KEYS,
  hasAutomaticConversion
} from '../classReconstructionCompatibility';
import { getClassResourceConfig } from '../../classResources';
import { CHAOS_WEAVER_TILE_RESOURCE_ID } from '../../classResourceContracts';

describe('Chaos Weaver integration data', () => {
  it('exposes a development-status class identity that is manually gated', () => {
    expect(CHAOS_WEAVER_DATA.id).toBe('chaos-weaver');
    expect(CHAOS_WEAVER_DATA.name).toBe('Chaos Weaver');
    expect(CHAOS_WEAVER_DATA.developmentStatus).toBe('development');
    expect(CHAOS_WEAVER_DATA.manualOnly).toBe(true);
  });

  it('projects exactly the optional, core and talent-actives spell records', () => {
    expect(CHAOS_WEAVER_ACTIVE_COUNTS.total).toBe(49);
    expect(CHAOS_WEAVER_DATA.spells).toHaveLength(CHAOS_WEAVER_ACTIVE_COUNTS.total);

    CHAOS_WEAVER_CORE_SPELLS.forEach((record) => {
      expect(CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID[record.id]).toBeTruthy();
    });
  });

  it('declares the explicit progression policy (one optional pick, no auto assignment)', () => {
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.randomizeStartingSpells).toBe(false);
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.autoTopUpOnLoad).toBe(false);
    expect(CHAOS_WEAVER_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual(
      CHAOS_WEAVER_CORE_SPELLS.map((record) => record.id)
    );
  });

  it('keeps every level pool resolvable and leveled, with four options per level', () => {
    const poolLevels = Object.keys(CHAOS_WEAVER_SPELL_POOLS).map(Number);
    expect(Math.min(...poolLevels)).toBe(1);
    expect(Math.max(...poolLevels)).toBe(CHAOS_WEAVER_PROGRESSION_POLICY.levelCap);

    poolLevels.forEach((level) => {
      const pool = CHAOS_WEAVER_SPELL_POOLS[level];
      expect(pool).toHaveLength(4);
      pool.forEach((spellId) => {
        const spell = CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID[spellId];
        expect(spell).toBeTruthy();
        expect(spell.level).toBe(level);
      });
    });
  });

  it('wires the three talent trees and resolves every grant node to an authored spell', () => {
    const trees = TALENT_TREES['Chaos Weaver'];
    expect(Object.keys(trees).sort()).toEqual(['anomaly-binder', 'cascade-weaver', 'probability-sculptor']);

    Object.values(trees).forEach((tree) => {
      tree.forEach((node) => {
        if (!node.grantId) return;
        expect(CHAOS_WEAVER_PROJECTED_SPELLS_BY_ID[node.grantId]).toBeTruthy();
      });
    });
  });

  it('registers the heritage rows without advertising numeric effects', () => {
    const provenance = CLASS_PROVENANCE['Chaos Weaver'];
    expect(provenance).toBeTruthy();
    expect(provenance.heritageEffectsImplemented).toBe(false);
    expect(provenance.requirements).toEqual([
      'anomaly_encounter',
      'containment_training',
      'stabilizing_interface'
    ]);
  });

  it('never appears in the legacy alias or reconstruction compatibility tables', () => {
    expect(Object.values(CLASS_COMPATIBILITY_ALIASES)).not.toContain('Chaos Weaver');
    expect(LEGACY_RECONSTRUCTION_KEYS).not.toContain('Chaos Weaver');
    expect(hasAutomaticConversion('Chaos Weaver')).toBe(false);
  });

  it('registers the uninitialized tile resource contract', () => {
    const config = getClassResourceConfig('Chaos Weaver');
    expect(config).toBeTruthy();
    expect(config.visual.type).toBe('chaos-weaver-tiles');
    expect(config.visual.type).toBe(CHAOS_WEAVER_TILE_RESOURCE_ID);
    expect(config.mechanics.initialized).toBe(false);
  });
});
