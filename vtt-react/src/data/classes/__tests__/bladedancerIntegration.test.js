import {
  BLADEDANCER_DATA,
  BLADEDANCER_CORE_RECORDS,
  BLADEDANCER_OPTIONAL_RECORDS,
  BLADEDANCER_TALENT_ACTIVE_RECORDS,
  BLADEDANCER_PASSIVE_RECORDS,
  BLADEDANCER_ALL_RECORDS,
  BLADEDANCER_PROJECTED_SPELLS,
  BLADEDANCER_PROJECTED_SPELLS_BY_ID,
  BLADEDANCER_SPELL_POOLS,
  BLADEDANCER_PROGRESSION_POLICY,
  pruneBladedancerTalents,
  validateBladedancerState
} from '../bladedancerData';
import {
  BLADEDANCER_TREE_META,
  BLADEDANCER_TREES,
  BLADEDANCER_TALENT_NODES,
  BLADEDANCER_TALENT_CAPACITY
} from '../../talentTrees/bladedancer';

describe('Bladedancer Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(BLADEDANCER_CORE_RECORDS).toHaveLength(2);
    expect(BLADEDANCER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(BLADEDANCER_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(BLADEDANCER_PASSIVE_RECORDS).toHaveLength(48);
    expect(BLADEDANCER_ALL_RECORDS).toHaveLength(96);
    expect(BLADEDANCER_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(BLADEDANCER_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = BLADEDANCER_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(BLADEDANCER_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(BLADEDANCER_TREE_META).toHaveLength(3);
    expect(BLADEDANCER_TREES).toHaveLength(3);
    expect(BLADEDANCER_TALENT_NODES).toHaveLength(54);
    expect(BLADEDANCER_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(BLADEDANCER_TALENT_CAPACITY.characterPointCap).toBe(50);

    BLADEDANCER_TREES.forEach(tree => {
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

  test('namespacing prefix consistency across all records', () => {
    BLADEDANCER_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('bd_') || record.id.startsWith('cr1_bladedancer_')).toBe(true);
    });
  });

  test('progression policy adheres to standard 1 starting pick and 2 granted core features', () => {
    expect(BLADEDANCER_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(BLADEDANCER_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(BLADEDANCER_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual([
      'cr1_bladedancer_kinetic_strike',
      'cr1_bladedancer_fluid_pivot'
    ]);
    expect(BLADEDANCER_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(BLADEDANCER_PROGRESSION_POLICY.manualOnly).toBe(true);
  });

  test('prunes talents correctly on level down without affecting unrelated state', () => {
    const fullAllocation = {
      cr1_bladedancer_flm_p01: 3,
      cr1_bladedancer_flm_p02: 3,
      cr1_bladedancer_flm_signature: 1,
      cr1_bladedancer_flm_capstone: 1
    };

    const prunedL1 = pruneBladedancerTalents(fullAllocation, 1);
    expect(prunedL1.cr1_bladedancer_flm_capstone).toBeUndefined();
    expect(prunedL1.cr1_bladedancer_flm_signature).toBeUndefined();
    expect(prunedL1.cr1_bladedancer_flm_p01).toBeDefined();

    const totalPointsL1 = Object.values(prunedL1).reduce((sum, v) => sum + v, 0);
    expect(totalPointsL1).toBeLessThanOrEqual(5);
  });

  test('validates Kinetic Momentum resource state correctly within 0-10 range', () => {
    expect(validateBladedancerState({ momentum: 0 }).valid).toBe(true);
    expect(validateBladedancerState({ momentum: 5 }).valid).toBe(true);
    expect(validateBladedancerState({ momentum: 10 }).valid).toBe(true);
    expect(validateBladedancerState({ momentum: -1 }).valid).toBe(false);
    expect(validateBladedancerState({ momentum: 11 }).valid).toBe(false);
  });
});
