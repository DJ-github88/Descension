import {
  COVENBANE_DATA,
  COVENBANE_CORE_RECORDS,
  COVENBANE_OPTIONAL_RECORDS,
  COVENBANE_TALENT_ACTIVE_RECORDS,
  COVENBANE_PASSIVE_RECORDS,
  COVENBANE_ALL_RECORDS,
  COVENBANE_PROJECTED_SPELLS,
  COVENBANE_PROJECTED_SPELLS_BY_ID,
  COVENBANE_SPELL_POOLS,
  COVENBANE_PROGRESSION_POLICY,
  pruneCovenbaneTalents,
  validateCovenbaneState
} from '../covenbaneData';
import {
  COVENBANE_TREE_META,
  COVENBANE_TREES,
  COVENBANE_TALENT_NODES,
  COVENBANE_TALENT_CAPACITY
} from '../../talentTrees/covenbane';
import { INQUISITOR_DATA } from '../inquisitorData';

describe('Covenbane Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(COVENBANE_CORE_RECORDS).toHaveLength(2);
    expect(COVENBANE_OPTIONAL_RECORDS).toHaveLength(40);
    expect(COVENBANE_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(COVENBANE_PASSIVE_RECORDS).toHaveLength(48);
    expect(COVENBANE_ALL_RECORDS).toHaveLength(96);
    expect(COVENBANE_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(COVENBANE_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = COVENBANE_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(COVENBANE_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(COVENBANE_TREE_META).toHaveLength(3);
    expect(COVENBANE_TREES).toHaveLength(3);
    expect(COVENBANE_TALENT_NODES).toHaveLength(54);
    expect(COVENBANE_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(COVENBANE_TALENT_CAPACITY.characterPointCap).toBe(50);

    COVENBANE_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      const passives = tree.nodes.filter(n => n.passiveSpellId);
      const signature = tree.nodes.find(n => n.grantId && n.grantId.includes('_sig_'));
      const capstone = tree.nodes.find(n => n.grantId && n.grantId.includes('_cap_'));

      expect(passives).toHaveLength(16);
      expect(signature).toBeDefined();
      expect(capstone).toBeDefined();

      const rankSum = tree.nodes.reduce((sum, n) => sum + n.maxRanks, 0);
      expect(rankSum).toBe(50); // 16 * 3 + 1 + 1 = 50
    });
  });

  test('zero namespace or ID collisions with legacy Inquisitor', () => {
    const covenbaneIds = new Set(COVENBANE_ALL_RECORDS.map(r => r.id));
    const inquisitorSpells = INQUISITOR_DATA.spells || INQUISITOR_DATA.exampleSpells || [];

    inquisitorSpells.forEach(spell => {
      expect(covenbaneIds.has(spell.id)).toBe(false);
      expect(spell.id.startsWith('cov_')).toBe(false);
      expect(spell.id.startsWith('cr1_covenbane_')).toBe(false);
    });

    COVENBANE_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('cov_') || record.id.startsWith('cr1_covenbane_')).toBe(true);
      expect(record.id.startsWith('inq_')).toBe(false);
    });
  });

  test('progression policy adheres to standard 1 starting pick and 2 granted core features', () => {
    expect(COVENBANE_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(COVENBANE_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(COVENBANE_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual([
      'cr1_covenbane_null_strike',
      'cr1_covenbane_draw_null_salt'
    ]);
    expect(COVENBANE_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(COVENBANE_PROGRESSION_POLICY.manualOnly).toBe(true);
  });

  test('prunes talents correctly on level down without affecting unrelated state', () => {
    // Valid allocations at level 10
    const fullAllocation = {
      cr1_covenbane_shadowbane_p01: 3,
      cr1_covenbane_shadowbane_p02: 3,
      cr1_covenbane_shadowbane_p03: 3,
      cr1_covenbane_shadowbane_p04: 3,
      cr1_covenbane_shadowbane_signature: 1,
      cr1_covenbane_shadowbane_capstone: 1
    };

    // At level 1, capstone (minLevel 10) and signature (minLevel 3) must be pruned
    const prunedL1 = pruneCovenbaneTalents(fullAllocation, 1);
    expect(prunedL1.cr1_covenbane_shadowbane_capstone).toBeUndefined();
    expect(prunedL1.cr1_covenbane_shadowbane_signature).toBeUndefined();
    expect(prunedL1.cr1_covenbane_shadowbane_p01).toBeDefined();

    // Budget at level 1 is 5 points
    const totalPointsL1 = Object.values(prunedL1).reduce((sum, v) => sum + v, 0);
    expect(totalPointsL1).toBeLessThanOrEqual(5);
  });

  test('validates Hexbreaker Charges state correctly within 0-6 range', () => {
    expect(validateCovenbaneState({ charges: 0 }).valid).toBe(true);
    expect(validateCovenbaneState({ charges: 3 }).valid).toBe(true);
    expect(validateCovenbaneState({ charges: 6 }).valid).toBe(true);
    expect(validateCovenbaneState({ current: 4 }).valid).toBe(true);

    expect(validateCovenbaneState({ charges: 7 }).valid).toBe(false);
    expect(validateCovenbaneState({ charges: -1 }).valid).toBe(false);
    expect(validateCovenbaneState('not-an-object').valid).toBe(false);
  });
});
