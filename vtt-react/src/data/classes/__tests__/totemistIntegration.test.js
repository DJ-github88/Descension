import {
  TOTEMIST_DATA,
  TOTEMIST_CORE_RECORDS,
  TOTEMIST_OPTIONAL_RECORDS,
  TOTEMIST_TALENT_ACTIVE_RECORDS,
  TOTEMIST_PASSIVE_RECORDS,
  TOTEMIST_ALL_RECORDS,
  TOTEMIST_PROJECTED_SPELLS,
  TOTEMIST_PROJECTED_SPELLS_BY_ID,
  TOTEMIST_SPELL_POOLS,
  TOTEMIST_PROGRESSION_POLICY,
  pruneTotemistTalents,
  validateTotemistState
} from '../totemistData';
import {
  TOTEMIST_TREE_META,
  TOTEMIST_TREES,
  TOTEMIST_TALENT_NODES,
  TOTEMIST_TALENT_CAPACITY
} from '../../talentTrees/totemist';

describe('Totemist Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(TOTEMIST_CORE_RECORDS).toHaveLength(2);
    expect(TOTEMIST_OPTIONAL_RECORDS).toHaveLength(40);
    expect(TOTEMIST_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(TOTEMIST_PASSIVE_RECORDS).toHaveLength(48);
    expect(TOTEMIST_ALL_RECORDS).toHaveLength(96);
    expect(TOTEMIST_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(TOTEMIST_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = TOTEMIST_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(TOTEMIST_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(TOTEMIST_TREE_META).toHaveLength(3);
    expect(TOTEMIST_TREES).toHaveLength(3);
    expect(TOTEMIST_TALENT_NODES).toHaveLength(54);
    expect(TOTEMIST_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(TOTEMIST_TALENT_CAPACITY.characterPointCap).toBe(50);

    TOTEMIST_TREES.forEach(tree => {
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
    TOTEMIST_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('tot_') || record.id.startsWith('cr1_totemist_')).toBe(true);
    });
  });

  test('progression policy adheres to standard 1 starting pick and 2 granted core features', () => {
    expect(TOTEMIST_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(TOTEMIST_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(TOTEMIST_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual([
      'cr1_totemist_place_conduit',
      'cr1_totemist_reclaim_conduit'
    ]);
    expect(TOTEMIST_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(TOTEMIST_PROGRESSION_POLICY.manualOnly).toBe(true);
  });

  test('prunes talents correctly on level down without affecting unrelated state', () => {
    const fullAllocation = {
      cr1_totemist_hrk_p01: 3,
      cr1_totemist_hrk_p02: 3,
      cr1_totemist_hrk_signature: 1,
      cr1_totemist_hrk_capstone: 1
    };

    const prunedL1 = pruneTotemistTalents(fullAllocation, 1);
    expect(prunedL1.cr1_totemist_hrk_capstone).toBeUndefined();
    expect(prunedL1.cr1_totemist_hrk_signature).toBeUndefined();
    expect(prunedL1.cr1_totemist_hrk_p01).toBeDefined();

    const totalPointsL1 = Object.values(prunedL1).reduce((sum, v) => sum + v, 0);
    expect(totalPointsL1).toBeLessThanOrEqual(5);
  });

  test('validates Conduit Attunement resource state correctly within bounds', () => {
    expect(validateTotemistState({ attunement: 0, activePylons: 0 }).valid).toBe(true);
    expect(validateTotemistState({ attunement: 5, activePylons: 2 }).valid).toBe(true);
    expect(validateTotemistState({ attunement: 10, activePylons: 3 }).valid).toBe(true);
    expect(validateTotemistState({ attunement: -1, activePylons: 1 }).valid).toBe(false);
    expect(validateTotemistState({ attunement: 11, activePylons: 1 }).valid).toBe(false);
    expect(validateTotemistState({ attunement: 5, activePylons: 4 }).valid).toBe(false);
  });
});
