import {
  DREADNAUGHT_CORE_RECORDS,
  DREADNAUGHT_OPTIONAL_RECORDS,
  DREADNAUGHT_TALENT_ACTIVE_RECORDS,
  DREADNAUGHT_PASSIVE_RECORDS,
  DREADNAUGHT_ALL_RECORDS,
  DREADNAUGHT_PROJECTED_SPELLS,
  DREADNAUGHT_SPELL_POOLS,
  pruneDreadnaughtTalents,
  validateDreadnaughtState
} from '../dreadnaughtData';
import {
  DREADNAUGHT_TREE_META,
  DREADNAUGHT_TREES,
  DREADNAUGHT_TALENT_NODES,
  DREADNAUGHT_TALENT_CAPACITY
} from '../../talentTrees/dreadnaught';
import { MARTYR_DATA } from '../martyrData';
import { MARTYR_IRONCLAD } from '../../talentTrees/martyrIronclad';

describe('Dreadnaught Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(DREADNAUGHT_CORE_RECORDS).toHaveLength(2);
    expect(DREADNAUGHT_OPTIONAL_RECORDS).toHaveLength(40);
    expect(DREADNAUGHT_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(DREADNAUGHT_PASSIVE_RECORDS).toHaveLength(48);
    expect(DREADNAUGHT_ALL_RECORDS).toHaveLength(96);
    expect(DREADNAUGHT_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(DREADNAUGHT_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = DREADNAUGHT_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(DREADNAUGHT_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(DREADNAUGHT_TREE_META).toHaveLength(3);
    expect(DREADNAUGHT_TREES).toHaveLength(3);
    expect(DREADNAUGHT_TALENT_NODES).toHaveLength(54);
    expect(DREADNAUGHT_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(DREADNAUGHT_TALENT_CAPACITY.characterPointCap).toBe(50);

    DREADNAUGHT_TREES.forEach(tree => {
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

  test('zero namespace or ID collisions with Martyr and Martyr Ironclad tree', () => {
    const dreadnaughtIds = new Set(DREADNAUGHT_ALL_RECORDS.map(r => r.id));
    const martyrSpells = MARTYR_DATA.spells || MARTYR_DATA.exampleSpells || [];

    martyrSpells.forEach(spell => {
      expect(dreadnaughtIds.has(spell.id)).toBe(false);
      expect(spell.id.startsWith('dread_')).toBe(false);
      expect(spell.id.startsWith('cr1_dreadnaught_')).toBe(false);
    });

    // Check Martyr Ironclad tree nodes (icl_*)
    MARTYR_IRONCLAD.forEach(node => {
      expect(dreadnaughtIds.has(node.id)).toBe(false);
      expect(node.id.startsWith('dread_')).toBe(false);
    });

    DREADNAUGHT_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('dread_') || record.id.startsWith('cr1_dreadnaught_')).toBe(true);
      expect(record.id.startsWith('icl_')).toBe(false);
    });
  });

  test('enforces manual-tabletop flags across all 96 records', () => {
    DREADNAUGHT_ALL_RECORDS.forEach(record => {
      expect(record.manualOnly).toBe(true);
      expect(record.executionEnabled).toBe(false);
      expect(record.applicationMode).toBe('manual-tabletop');
      expect(record.rulesetVersion).toBe('cr-review-r1');
    });
  });

  test('validates Furnace Pressure economy boundaries (0 to 100 scale)', () => {
    expect(validateDreadnaughtState({ psi: 0 }).valid).toBe(true);
    expect(validateDreadnaughtState({ psi: 20 }).valid).toBe(true);
    expect(validateDreadnaughtState({ psi: 50 }).valid).toBe(true);
    expect(validateDreadnaughtState({ psi: 90 }).valid).toBe(true);
    expect(validateDreadnaughtState({ psi: 100 }).valid).toBe(true);

    expect(validateDreadnaughtState({ psi: -1 }).valid).toBe(false);
    expect(validateDreadnaughtState({ psi: 101 }).valid).toBe(false);
    expect(validateDreadnaughtState({ psi: 3.5 }).valid).toBe(false);
    expect(validateDreadnaughtState(null).valid).toBe(false);
  });

  test('prunes talents properly on level changes and maintains structural integrity', () => {
    const initialTalents = {
      cr1_dreadnaught_siegebastion_p01: 3,
      cr1_dreadnaught_siegebastion_p02: 3,
      cr1_dreadnaught_siegebastion_p03: 3,
      cr1_dreadnaught_siegebastion_p04: 1,
      cr1_dreadnaught_siegebastion_signature: 1
    };

    // Valid at level 3 (has 10 tree points and level >= 3)
    const prunedL3 = pruneDreadnaughtTalents(initialTalents, 3);
    expect(prunedL3.cr1_dreadnaught_siegebastion_p01).toBe(3);
    expect(prunedL3.cr1_dreadnaught_siegebastion_signature).toBe(1);

    // Pruned at level 2 (signature requires level 3)
    const prunedL2 = pruneDreadnaughtTalents(initialTalents, 2);
    expect(prunedL2.cr1_dreadnaught_siegebastion_signature).toBeUndefined();
  });
});
