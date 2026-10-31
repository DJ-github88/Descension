import {
  EXORCIST_CORE_RECORDS,
  EXORCIST_OPTIONAL_RECORDS,
  EXORCIST_TALENT_ACTIVE_RECORDS,
  EXORCIST_PASSIVE_RECORDS,
  EXORCIST_ALL_RECORDS,
  EXORCIST_PROJECTED_SPELLS,
  EXORCIST_SPELL_POOLS,
  pruneExorcistTalents,
  validateExorcistState
} from '../exorcistData';
import {
  EXORCIST_TREE_META,
  EXORCIST_TREES,
  EXORCIST_TALENT_NODES,
  EXORCIST_TALENT_CAPACITY
} from '../../talentTrees/exorcist';
import { INQUISITOR_DATA } from '../inquisitorData';
import { COVENBANE_ALL_RECORDS } from '../covenbaneData';

describe('Exorcist Class Integration & Content Lock Verification', () => {
  test('satisfies the complete 96-record contract with exact distribution', () => {
    expect(EXORCIST_CORE_RECORDS).toHaveLength(2);
    expect(EXORCIST_OPTIONAL_RECORDS).toHaveLength(40);
    expect(EXORCIST_TALENT_ACTIVE_RECORDS).toHaveLength(6);
    expect(EXORCIST_PASSIVE_RECORDS).toHaveLength(48);
    expect(EXORCIST_ALL_RECORDS).toHaveLength(96);
    expect(EXORCIST_PROJECTED_SPELLS).toHaveLength(96);

    const recordIds = new Set(EXORCIST_ALL_RECORDS.map(r => r.id));
    expect(recordIds.size).toBe(96);
  });

  test('stratifies optional spells with exactly 4 options per level (levels 1-10) and >= 2 non-damage per level', () => {
    for (let level = 1; level <= 10; level++) {
      const levelSpells = EXORCIST_OPTIONAL_RECORDS.filter(s => s.level === level);
      expect(levelSpells).toHaveLength(4);
      expect(EXORCIST_SPELL_POOLS[level]).toHaveLength(4);

      // Verify at least 2 non-damage spells per level
      const nonDamageSpells = levelSpells.filter(s => !s.effectTypes?.includes('damage') || s.damageConfig === null);
      expect(nonDamageSpells.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('talent trees have 3 trees, 18 nodes per tree, 54 nodes total, and 50 rank capacity per tree', () => {
    expect(EXORCIST_TREE_META).toHaveLength(3);
    expect(EXORCIST_TREES).toHaveLength(3);
    expect(EXORCIST_TALENT_NODES).toHaveLength(54);
    expect(EXORCIST_TALENT_CAPACITY.totalRankCapacity).toBe(150);
    expect(EXORCIST_TALENT_CAPACITY.characterPointCap).toBe(50);

    EXORCIST_TREES.forEach(tree => {
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

  test('zero namespace or ID collisions with legacy Inquisitor and Covenbane', () => {
    const exorcistIds = new Set(EXORCIST_ALL_RECORDS.map(r => r.id));
    const covenbaneIds = new Set(COVENBANE_ALL_RECORDS.map(r => r.id));
    const inquisitorSpells = INQUISITOR_DATA.spells || INQUISITOR_DATA.exampleSpells || [];

    inquisitorSpells.forEach(spell => {
      expect(exorcistIds.has(spell.id)).toBe(false);
      expect(spell.id.startsWith('exo_')).toBe(false);
      expect(spell.id.startsWith('cr1_exorcist_')).toBe(false);
    });

    covenbaneIds.forEach(id => {
      expect(exorcistIds.has(id)).toBe(false);
    });

    EXORCIST_ALL_RECORDS.forEach(record => {
      expect(record.id.startsWith('exo_') || record.id.startsWith('cr1_exorcist_')).toBe(true);
    });
  });

  test('enforces manual-tabletop flags across all 96 records', () => {
    EXORCIST_ALL_RECORDS.forEach(record => {
      expect(record.manualOnly).toBe(true);
      expect(record.executionEnabled).toBe(false);
      expect(record.applicationMode).toBe('manual-tabletop');
      expect(record.rulesetVersion).toBe('cr-review-r1');
    });
  });

  test('validates Purification Sanctity economy boundaries (0 to 10 scale)', () => {
    expect(validateExorcistState({ sanctity: 0 }).valid).toBe(true);
    expect(validateExorcistState({ sanctity: 3 }).valid).toBe(true);
    expect(validateExorcistState({ sanctity: 10 }).valid).toBe(true);
    expect(validateExorcistState({ current: 5 }).valid).toBe(true);

    expect(validateExorcistState({ sanctity: -1 }).valid).toBe(false);
    expect(validateExorcistState({ sanctity: 11 }).valid).toBe(false);
    expect(validateExorcistState({ sanctity: 'invalid' }).valid).toBe(false);
    expect(validateExorcistState(null).valid).toBe(false);
  });

  test('prunes talents properly on level changes and maintains structural integrity', () => {
    const initialTalents = {
      cr1_exorcist_liturgist_p01: 3,
      cr1_exorcist_liturgist_p02: 3,
      cr1_exorcist_liturgist_p03: 3,
      cr1_exorcist_liturgist_p04: 1,
      cr1_exorcist_liturgist_signature: 1
    };

    // Valid at level 3
    const prunedL3 = pruneExorcistTalents(initialTalents, 3);
    expect(prunedL3.cr1_exorcist_liturgist_p01).toBe(3);
    expect(prunedL3.cr1_exorcist_liturgist_signature).toBe(1);

    // Pruned at level 2 (signature requires level 3)
    const prunedL2 = pruneExorcistTalents(initialTalents, 2);
    expect(prunedL2.cr1_exorcist_liturgist_signature).toBeUndefined();
  });
});
