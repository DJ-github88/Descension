import {
  WITCH_DOCTOR_DATA,
  WITCH_DOCTOR_CORE_RECORDS,
  WITCH_DOCTOR_OPTIONAL_RECORDS,
  WITCH_DOCTOR_TALENT_ACTIVE_RECORDS,
  WITCH_DOCTOR_PASSIVE_RECORDS,
  WITCH_DOCTOR_ALL_RECORDS,
  WITCH_DOCTOR_PROJECTED_SPELLS,
  WITCH_DOCTOR_PROJECTED_SPELLS_BY_ID,
  WITCH_DOCTOR_SPELL_POOLS,
  WITCH_DOCTOR_PROGRESSION_POLICY,
  pruneWitchDoctorTalents,
  validateWitchDoctorState
} from '../witchDoctorData';
import {
  WITCH_DOCTOR_TREE_META,
  WITCH_DOCTOR_TREES,
  WITCH_DOCTOR_TALENT_NODES,
  WITCH_DOCTOR_TALENT_CAPACITY
} from '../../talentTrees/witchdoctor';

describe('Witch Doctor Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(WITCH_DOCTOR_CORE_RECORDS).toHaveLength(2);
    expect(WITCH_DOCTOR_OPTIONAL_RECORDS).toHaveLength(40);
    expect(WITCH_DOCTOR_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(WITCH_DOCTOR_PASSIVE_RECORDS).toHaveLength(48);
    expect(WITCH_DOCTOR_ALL_RECORDS).toHaveLength(96);
    expect(WITCH_DOCTOR_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(WITCH_DOCTOR_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = WITCH_DOCTOR_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(WITCH_DOCTOR_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(WITCH_DOCTOR_TREE_META).toHaveLength(3);
    expect(WITCH_DOCTOR_TREES).toHaveLength(3);
    expect(WITCH_DOCTOR_TALENT_NODES).toHaveLength(54);
    expect(WITCH_DOCTOR_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(WITCH_DOCTOR_TALENT_CAPACITY.characterPointCap).toBe(50);

    WITCH_DOCTOR_TREES.forEach(tree => {
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
    WITCH_DOCTOR_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('wd_') || record.id.startsWith('cr1_witch_doctor_')).toBe(true);
    });
  });

  test('progression policy adheres to standard 1 starting pick and 2 granted core features', () => {
    expect(WITCH_DOCTOR_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(WITCH_DOCTOR_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(WITCH_DOCTOR_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual([
      'cr1_witch_doctor_bog_hex',
      'cr1_witch_doctor_render_tallow'
    ]);
    expect(WITCH_DOCTOR_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(WITCH_DOCTOR_PROGRESSION_POLICY.manualOnly).toBe(true);
  });

  test('prunes talents correctly on level down without affecting unrelated state', () => {
    const fullAllocation = {
      cr1_witch_doctor_hxb_p01: 3,
      cr1_witch_doctor_hxb_p02: 3,
      cr1_witch_doctor_hxb_signature: 1,
      cr1_witch_doctor_hxb_capstone: 1
    };

    const prunedL1 = pruneWitchDoctorTalents(fullAllocation, 1);
    expect(prunedL1.cr1_witch_doctor_hxb_capstone).toBeUndefined();
    expect(prunedL1.cr1_witch_doctor_hxb_signature).toBeUndefined();
    expect(prunedL1.cr1_witch_doctor_hxb_p01).toBeDefined();

    const totalPointsL1 = Object.values(prunedL1).reduce((sum, v) => sum + v, 0);
    expect(totalPointsL1).toBeLessThanOrEqual(5);
  });

  test('validates Bog Tallow resource state correctly within 0-100 range', () => {
    expect(validateWitchDoctorState({ tallow: 0 }).valid).toBe(true);
    expect(validateWitchDoctorState({ tallow: 50 }).valid).toBe(true);
    expect(validateWitchDoctorState({ tallow: 100 }).valid).toBe(true);
    expect(validateWitchDoctorState({ tallow: -1 }).valid).toBe(false);
    expect(validateWitchDoctorState({ tallow: 101 }).valid).toBe(false);
  });
});
