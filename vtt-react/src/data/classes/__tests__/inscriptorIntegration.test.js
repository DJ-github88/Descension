import {
  INSCRIPTOR_DATA,
  INSCRIPTOR_CORE_RECORDS,
  INSCRIPTOR_OPTIONAL_RECORDS,
  INSCRIPTOR_TALENT_ACTIVE_RECORDS,
  INSCRIPTOR_PASSIVE_RECORDS,
  INSCRIPTOR_ALL_RECORDS,
  INSCRIPTOR_PROJECTED_SPELLS,
  INSCRIPTOR_PROJECTED_SPELLS_BY_ID,
  INSCRIPTOR_SPELL_POOLS,
  INSCRIPTOR_PROGRESSION_POLICY,
  pruneInscriptorTalents,
  validateInscriptorState
} from '../inscriptorData';
import {
  INSCRIPTOR_TREE_META,
  INSCRIPTOR_TREES,
  INSCRIPTOR_TALENT_NODES,
  INSCRIPTOR_TALENT_CAPACITY
} from '../../talentTrees/inscriptor';

describe('Inscriptor Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(INSCRIPTOR_CORE_RECORDS).toHaveLength(2);
    expect(INSCRIPTOR_OPTIONAL_RECORDS).toHaveLength(40);
    expect(INSCRIPTOR_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(INSCRIPTOR_PASSIVE_RECORDS).toHaveLength(48);
    expect(INSCRIPTOR_ALL_RECORDS).toHaveLength(96);
    expect(INSCRIPTOR_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(INSCRIPTOR_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = INSCRIPTOR_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(INSCRIPTOR_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(INSCRIPTOR_TREE_META).toHaveLength(3);
    expect(INSCRIPTOR_TREES).toHaveLength(3);
    expect(INSCRIPTOR_TALENT_NODES).toHaveLength(54);
    expect(INSCRIPTOR_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(INSCRIPTOR_TALENT_CAPACITY.characterPointCap).toBe(50);

    INSCRIPTOR_TREES.forEach(tree => {
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
    INSCRIPTOR_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('insc_') || record.id.startsWith('cr1_inscriptor_')).toBe(true);
    });
  });

  test('progression policy adheres to standard 1 starting pick and 2 granted core features', () => {
    expect(INSCRIPTOR_PROGRESSION_POLICY.startingSpellPicks).toBe(1);
    expect(INSCRIPTOR_PROGRESSION_POLICY.optionalPicksPerLevel).toBe(1);
    expect(INSCRIPTOR_PROGRESSION_POLICY.grantedCoreSpellIds).toEqual([
      'cr1_inscriptor_etch_glyph',
      'cr1_inscriptor_discharge_rune'
    ]);
    expect(INSCRIPTOR_PROGRESSION_POLICY.allowEarlierUnchosen).toBe(true);
    expect(INSCRIPTOR_PROGRESSION_POLICY.manualOnly).toBe(true);
  });

  test('prunes talents correctly on level down without affecting unrelated state', () => {
    const fullAllocation = {
      cr1_inscriptor_rnb_p01: 3,
      cr1_inscriptor_rnb_p02: 3,
      cr1_inscriptor_rnb_signature: 1,
      cr1_inscriptor_rnb_capstone: 1
    };

    const prunedL1 = pruneInscriptorTalents(fullAllocation, 1);
    expect(prunedL1.cr1_inscriptor_rnb_capstone).toBeUndefined();
    expect(prunedL1.cr1_inscriptor_rnb_signature).toBeUndefined();
    expect(prunedL1.cr1_inscriptor_rnb_p01).toBeDefined();

    const totalPointsL1 = Object.values(prunedL1).reduce((sum, v) => sum + v, 0);
    expect(totalPointsL1).toBeLessThanOrEqual(5);
  });

  test('validates Runic Resonance resource state correctly within 0-10 range', () => {
    expect(validateInscriptorState({ resonance: 0 }).valid).toBe(true);
    expect(validateInscriptorState({ resonance: 5 }).valid).toBe(true);
    expect(validateInscriptorState({ resonance: 10 }).valid).toBe(true);
    expect(validateInscriptorState({ resonance: -1 }).valid).toBe(false);
    expect(validateInscriptorState({ resonance: 11 }).valid).toBe(false);
  });
});
