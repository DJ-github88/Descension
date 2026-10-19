import {
  CHAOS_WEAVER_ACTIVE_COUNTS,
  CHAOS_WEAVER_ACTIVE_SPELLS,
  CHAOS_WEAVER_CORE_SPELLS,
  CHAOS_WEAVER_NATIVE_VARIANTS,
  CHAOS_WEAVER_OPTIONAL_SLOTS,
  CHAOS_WEAVER_OPTIONAL_SPELLS,
  CHAOS_WEAVER_PROGRESSION,
  CHAOS_WEAVER_RULESET,
  CHAOS_WEAVER_SPELLS_BY_ID,
  CHAOS_WEAVER_TALENT_ACTIVE_SPELLS
} from '../chaosWeaverData';
import { validateContentPackage, validateRecordProfile } from '../chaosWeaverRules';
import {
  CHAOS_WEAVER_MIN_LEVEL_FOR_GATE,
  CHAOS_WEAVER_PASSIVE_SPELLS,
  CHAOS_WEAVER_TALENT_CAPACITY,
  CHAOS_WEAVER_TALENT_NODES,
  CHAOS_WEAVER_TALENT_NODES_BY_ID,
  CHAOS_WEAVER_TREES
} from '../../talentTrees/chaosWeaver';

const dealsDamage = (record) => {
  if (record.damage) return true;
  if (record.branchRule) {
    return Object.values(record.branchRule.outcomes).some((outcome) => outcome.damage);
  }
  return false;
};

test('the certified package has 97 unique records in the authored proportions', () => {
  expect(CHAOS_WEAVER_OPTIONAL_SPELLS).toHaveLength(40);
  expect(CHAOS_WEAVER_CORE_SPELLS).toHaveLength(3);
  expect(CHAOS_WEAVER_TALENT_ACTIVE_SPELLS).toHaveLength(6);
  expect(CHAOS_WEAVER_PASSIVE_SPELLS).toHaveLength(48);
  expect(CHAOS_WEAVER_ACTIVE_SPELLS).toHaveLength(49);
  const ids = [...CHAOS_WEAVER_ACTIVE_SPELLS, ...CHAOS_WEAVER_PASSIVE_SPELLS].map((record) => record.id);
  expect(ids).toHaveLength(97);
  expect(new Set(ids).size).toBe(97);
  const check = validateContentPackage();
  expect(check.errors).toEqual([]);
  expect(check.ok).toBe(true);
  expect(check.counts).toEqual({
    optional: 40,
    core: 3,
    talentActives: 6,
    passives: 48,
    total: 97,
    nodes: 54,
    trees: 3
  });
  expect(CHAOS_WEAVER_ACTIVE_COUNTS).toEqual({ optional: 40, core: 3, talentActives: 6, total: 49 });
});

test('every level offers four optional records with at least two nondamage', () => {
  for (let level = 1; level <= 10; level += 1) {
    const records = CHAOS_WEAVER_OPTIONAL_SPELLS.filter((record) => record.level === level);
    expect(records).toHaveLength(4);
    const nondamage = records.filter((record) => !dealsDamage(record));
    expect(nondamage.length).toBeGreaterThanOrEqual(2);
  }
});

test('optional slot 07 keeps the R1 stable ID and no cw1_07 payload exists', () => {
  expect(CHAOS_WEAVER_OPTIONAL_SLOTS).toHaveLength(40);
  expect(CHAOS_WEAVER_OPTIONAL_SLOTS.find((slot) => slot.slot === '07').id).toBe(
    'cr1_chaos_weaver_read_instability'
  );
  expect(CHAOS_WEAVER_SPELLS_BY_ID.cr1_chaos_weaver_read_instability).toBeTruthy();
  expect(CHAOS_WEAVER_SPELLS_BY_ID.cw1_07).toBeUndefined();
  CHAOS_WEAVER_OPTIONAL_SLOTS.forEach((slot) => {
    const record = CHAOS_WEAVER_SPELLS_BY_ID[slot.id];
    expect(record).toBeTruthy();
    if (slot.slot !== '07') expect(record.id).toBe(`cw1_${slot.slot}`);
  });
  expect(CHAOS_WEAVER_PROGRESSION[1].newChoiceIds).toContain('cr1_chaos_weaver_read_instability');
});

test('every record is a closed authored-only manual profile', () => {
  const all = [...CHAOS_WEAVER_ACTIVE_SPELLS, ...CHAOS_WEAVER_PASSIVE_SPELLS];
  all.forEach((record) => {
    expect(validateRecordProfile(record).ok).toBe(true);
    expect(record.authoredOnly).toBe(true);
    expect(record.executionEnabled).toBe(false);
    expect(record.applicationMode).toBe('manual-tabletop');
    expect(record.automatedCapabilities).toEqual([]);
    expect(record.classId).toBe('chaos-weaver');
    expect(record.rulesetVersion).toBe('cr-cw-1');
  });
  CHAOS_WEAVER_ACTIVE_SPELLS.forEach((record) => {
    expect(Number.isInteger(record.resourceCost.actionPoints)).toBe(true);
    expect(record.resourceCost.actionPoints).toBeGreaterThanOrEqual(1);
    expect(record.resourceCost.mana).toBe(0);
  });
});

test('talents: 18 nodes and 50 max ranks per tree, 54 nodes, 150 rank capacity', () => {
  expect(CHAOS_WEAVER_TREES).toHaveLength(3);
  CHAOS_WEAVER_TREES.forEach((tree) => {
    expect(tree.nodes).toHaveLength(18);
    expect(tree.nodes.reduce((sum, node) => sum + node.maxRanks, 0)).toBe(50);
  });
  expect(CHAOS_WEAVER_TALENT_CAPACITY.nodes).toBe(54);
  expect(CHAOS_WEAVER_TALENT_CAPACITY.trees).toBe(3);
  expect(CHAOS_WEAVER_TALENT_CAPACITY.totalRankCapacity).toBe(150);
  CHAOS_WEAVER_TALENT_CAPACITY.perTreeRanks.forEach((entry) => expect(entry.maxRanks).toBe(50));
});

test('gate levels follow the 5-point schedule, references resolve and no cycles exist', () => {
  CHAOS_WEAVER_TALENT_NODES.forEach((node) => {
    expect(node.minLevel).toBe(CHAOS_WEAVER_MIN_LEVEL_FOR_GATE(node.requiresPoints));
    node.requires.forEach((predecessorId) => {
      expect(CHAOS_WEAVER_TALENT_NODES_BY_ID[predecessorId]).toBeTruthy();
    });
    let frontier = [...node.requires];
    let steps = 0;
    while (frontier.length > 0) {
      steps += 1;
      expect(steps).toBeLessThanOrEqual(CHAOS_WEAVER_TALENT_NODES.length);
      frontier = frontier.flatMap((id) => CHAOS_WEAVER_TALENT_NODES_BY_ID[id].requires);
    }
  });
  const signature = CHAOS_WEAVER_TALENT_NODES_BY_ID.cw1_ps_n05;
  expect(signature.requiresPoints).toBe(10);
  expect(signature.minLevel).toBe(3);
  ['cw1_ps_n18', 'cw1_ab_n18', 'cw1_ca_n18'].forEach((id) => {
    const node = CHAOS_WEAVER_TALENT_NODES_BY_ID[id];
    expect(node.requiresPoints).toBe(45);
    expect(node.minLevel).toBe(10);
    expect(node.requires).toHaveLength(3);
  });
});

test('exactly six grant nodes resolve to the six talent actives', () => {
  const grantNodes = CHAOS_WEAVER_TALENT_NODES.filter((node) => node.grantId);
  expect(grantNodes).toHaveLength(6);
  grantNodes.forEach((node) => {
    const record = CHAOS_WEAVER_SPELLS_BY_ID[node.grantId];
    expect(record).toBeTruthy();
    expect(record.source).toBe('talent');
    expect(record.requires.nodeId).toBe(node.id);
  });
});

test('every authored Fracture branch keeps an explicit movement downside', () => {
  const fracturing = CHAOS_WEAVER_ACTIVE_SPELLS.filter(
    (record) => record.branchRule && record.branchRule.outcomes.F
  );
  expect(fracturing.length).toBeGreaterThan(0);
  fracturing.forEach((record) => expect(record.branchRule.outcomes.F.movement).toBeTruthy());
  expect(CHAOS_WEAVER_SPELLS_BY_ID.cw1_01.effectText).toMatch(/movement.5ft/);
});

test('the native variant stays proposed, free and non-automatic', () => {
  expect(CHAOS_WEAVER_NATIVE_VARIANTS).toHaveLength(1);
  const variant = CHAOS_WEAVER_NATIVE_VARIANTS[0];
  expect(variant.id).toBe('drall_fexric');
  expect(variant.status).toBe('proposed');
  expect(variant.edge.cost).toEqual({ actionPoints: 0, mana: 0 });
  expect(variant.edge.manualNote).toMatch(/normal class play works without this edge/);
  expect(CHAOS_WEAVER_RULESET.nativeRule).toMatch(/Prepared Exchange/);
});
