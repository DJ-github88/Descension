import {
  FATE_WEAVER_DATA, FATE_WEAVER_MANIFEST, FATE_WEAVER_AUTHORED_RECORDS,
  FATE_WEAVER_OPTIONAL_RECORDS, FATE_WEAVER_CORE_RECORDS, FATE_WEAVER_TALENT_ACTIVES,
  FATE_WEAVER_PROJECTED_SPELLS_BY_ID, FATE_WEAVER_RESOURCE_RULES,
  validateFateWeaverState, projectFateWeaverResource
} from '../fateWeaverData';
import { FATE_WEAVER_TREES, FATE_WEAVER_TALENT_NODES } from '../../talentTrees/fateWeaver';

describe('Fate Weaver Phase 2B package', () => {
  test('has the locked record and node shape', () => {
    expect(FATE_WEAVER_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_fate_weaver_tie_thread', 'cr1_fate_weaver_cut_clean'
    ]);
    expect(FATE_WEAVER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(FATE_WEAVER_TALENT_ACTIVES).toHaveLength(6);
    expect(FATE_WEAVER_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(FATE_WEAVER_AUTHORED_RECORDS.map(record => record.id)).size).toBe(96);
    expect(FATE_WEAVER_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(48);
    expect(FATE_WEAVER_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(FATE_WEAVER_TREES).toHaveLength(3);
    expect(FATE_WEAVER_TALENT_NODES).toHaveLength(54);
    FATE_WEAVER_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(FATE_WEAVER_MANIFEST).toMatchObject({ uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: [] });
    expect(FATE_WEAVER_DATA.spells).toHaveLength(96);
  });

  test('keeps four optional picks per level and no duplicate grant IDs', () => {
    for (let level = 1; level <= 10; level++) {
      const records = FATE_WEAVER_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(FATE_WEAVER_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = FATE_WEAVER_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('preserves the approved R1 identifiers and node IDs', () => {
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_read_bond).toBeTruthy();
    expect(FATE_WEAVER_PROJECTED_SPELLS_BY_ID.cr1_fate_weaver_read_the_bond).toBeUndefined();
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_covenant_weaver_signature')?.grantId).toBe('cr1_fate_weaver_witnessed_covenant');
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_severer_signature')?.grantId).toBe('cr1_fate_weaver_sever_borrowed_crown');
    expect(FATE_WEAVER_TALENT_NODES.find(node => node.id === 'cr1_fate_weaver_tapestry_keeper_signature')?.grantId).toBe('cr1_fate_weaver_reanchor_tapestry');
  });

  test('marks every record and node manual-only and keeps Augur banks out', () => {
    [...FATE_WEAVER_AUTHORED_RECORDS, ...FATE_WEAVER_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({ rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [] });
    });
    expect(FATE_WEAVER_RESOURCE_RULES).toMatchObject({ tokenCount: 3, maxLinks: 3, transferAmountMax: 3, recursiveTransfer: false, refreshOnReconnect: false, refreshOnInitiative: false });
    expect(FATE_WEAVER_DATA.resourceSystem.id).toBe('fate-links');
    expect(FATE_WEAVER_DATA.resource).toBe('Fate Links');
  });

  test('validates tokens, links and the read-only projection', () => {
    const state = { tokens: [{ state: 'free' }, { state: 'reserved' }, { state: 'recovering' }], links: [
      { id: 'link-1', sourceId: 'actor-a', targetId: 'actor-b', sourceName: 'A', targetName: 'B', purpose: 'guard the gate', tokenState: 'free', usesRemaining: 1, amountMax: 2, uses: 1 }
    ] };
    expect(validateFateWeaverState(state).valid).toBe(true);
    expect(validateFateWeaverState({ tokens: [{ state: 'free' }], links: [{ tokenState: 'free', amountMax: 4, uses: 3, recursive: true }] }).valid).toBe(false);
    expect(projectFateWeaverResource({ state }).tokens).toEqual({ free: 1, reserved: 1, recovering: 1 });
    expect(projectFateWeaverResource({ state }, true).links[0]).toMatchObject({ sourceName: 'A', targetName: 'B', purpose: 'guard the gate' });
    expect(projectFateWeaverResource({ state }, false).links[0].sourceName).toBe('Endpoint hidden');
    expect(projectFateWeaverResource(null)).toMatchObject({ initialized: false, links: [] });
  });
});
