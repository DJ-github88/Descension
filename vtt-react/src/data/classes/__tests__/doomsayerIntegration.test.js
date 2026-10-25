import {
  DOOMSAYER_DATA, DOOMSAYER_MANIFEST, DOOMSAYER_AUTHORED_RECORDS,
  DOOMSAYER_OPTIONAL_RECORDS, DOOMSAYER_CORE_RECORDS, DOOMSAYER_TALENT_ACTIVES,
  DOOMSAYER_PROJECTED_SPELLS_BY_ID, DOOMSAYER_RESOURCE_RULES,
  validateDoomsayerState, projectDoomsayerResource
} from '../doomsayerData';
import { DOOMSAYER_TREES, DOOMSAYER_TALENT_NODES } from '../../talentTrees/doomsayer';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { getReconstructionCompatibility } from '../classReconstructionCompatibility';
import { HARBINGER_RECORD_DISPOSITIONS } from '../harbingerDispositions';
import { getResourceSystemGuide } from '../../resourceSystems';
import { doomsayerResourceGuide } from '../../resourceSystems/doomsayerResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getManagedResourceId, normalizeManagedClassResource } from '../../classResourceContracts';

describe('Doomsayer complete content lock', () => {
  test('has the locked record, tree and node shape', () => {
    expect(DOOMSAYER_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_doomsayer_plant_calamity', 'cr1_doomsayer_dismantle_calamity'
    ]);
    expect(DOOMSAYER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(DOOMSAYER_TALENT_ACTIVES).toHaveLength(6);
    expect(DOOMSAYER_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(DOOMSAYER_AUTHORED_RECORDS.map(record => record.id)).size).toBe(96);
    expect(DOOMSAYER_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(48);
    expect(DOOMSAYER_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(DOOMSAYER_TREES).toHaveLength(3);
    expect(DOOMSAYER_TALENT_NODES).toHaveLength(54);
    DOOMSAYER_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(DOOMSAYER_MANIFEST).toMatchObject({
      uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: []
    });
    expect(DOOMSAYER_DATA.spells).toHaveLength(96);
  });

  test('keeps four optional picks per level and at least two non-damage choices', () => {
    for (let level = 1; level <= 10; level += 1) {
      const records = DOOMSAYER_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(DOOMSAYER_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = DOOMSAYER_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('marks every record and node manual-only and never imports Mayhem or Fate links', () => {
    [...DOOMSAYER_AUTHORED_RECORDS, ...DOOMSAYER_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({
        rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false,
        applicationMode: 'manual-tabletop', automatedCapabilities: []
      });
    });
    expect(DOOMSAYER_RESOURCE_RULES).toMatchObject({
      calamityMax: 2, clockMin: 1, clockMax: 3, havocMin: 0, havocMax: 15,
      havocOnTrigger: 3, havocOnExpiry: 1, havocOnDismantle: 0,
      refreshOnReconnect: false, refreshOnInitiative: false,
      automaticResolution: false, automaticClockAdvance: false, manualOnly: true
    });
    expect(DOOMSAYER_DATA.resourceSystem.id).toBe('doom-calamities');
    expect(DOOMSAYER_DATA.resource).toBe('Calamities & Havoc');
    expect(JSON.stringify(DOOMSAYER_DATA)).not.toContain('fate-links');
    expect(JSON.stringify(DOOMSAYER_DATA)).not.toContain('omenDebt');
    expect(JSON.stringify(DOOMSAYER_DATA)).not.toContain('mayhemGauge');
  });

  test('registers in catalogue, generator, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Doomsayer).toMatchObject({ id: 'doomsayer', name: 'Doomsayer' });
    expect(Boolean(ALL_CLASSES_DATA.Doomsayer.isCompatibilityAlias)).toBe(false);
    expect(ALL_CLASS_SPELLS.Doomsayer.filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(new Set(ALL_CLASS_SPELLS.Doomsayer.map(spell => spell.id)).size).toBe(ALL_CLASS_SPELLS.Doomsayer.length);
    expect(TALENT_TREES.Doomsayer).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS.Doomsayer.specializations.map(spec => spec.id)).toEqual(['requiem', 'endbringer', 'forewarner']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Doomsayer')).toMatchObject({
      role: 'Doom Caster / Control', resource: 'Calamities & Havoc', developmentStatus: 'development'
    });
    expect(getResourceSystemGuide('doomsayer')).toBe(doomsayerResourceGuide);
  });

  test('authors exact same-tree signature and capstone gates', () => {
    const points = (treeId, talents) => DOOMSAYER_TALENT_NODES
      .filter(node => node.treeId === treeId)
      .reduce((total, node) => total + (talents[node.id] || 0), 0);
    const canUnlock = (node, talents, level) => level >= node.minLevel
      && points(node.treeId, talents) >= node.requiresPoints
      && node.requires.every(id => (talents[id] || 0) >= node.maxRanks);

    DOOMSAYER_TREES.forEach(tree => {
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const capstone = tree.nodes.find(node => node.id === tree.meta.capstoneNode);
      const justShort = { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3 };
      const atThreshold = { ...justShort, [tree.nodes[3].id]: 1 };
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      const otherTree = Object.fromEntries(DOOMSAYER_TALENT_NODES.filter(node => node.treeId !== tree.id).map(node => [node.id, node.maxRanks]));

      expect(signature).toMatchObject({ minLevel: 3, requiresPoints: 10, requiresAll: true, maxRanks: 1 });
      expect(capstone).toMatchObject({ minLevel: 10, requiresPoints: 45, requiresAll: true, maxRanks: 1 });
      expect(canUnlock(signature, justShort, 3)).toBe(false);
      expect(canUnlock(signature, otherTree, 10)).toBe(false);
      expect(canUnlock(signature, justShort, 2)).toBe(false);
      expect(canUnlock(signature, atThreshold, 3)).toBe(true);
      expect(canUnlock(capstone, fullTree, 9)).toBe(false);
      expect(canUnlock(capstone, { ...fullTree, [signature.id]: 0 }, 10)).toBe(false);
      expect(canUnlock(capstone, fullTree, 10)).toBe(true);
    });
  });

  test('validates and projects only recorded public calamities', () => {
    const state = {
      havoc: 4,
      maxCalamities: 2,
      calamities: [
        { id: 'c1', subject: 'Gate guard', trigger: 'target-attacks', clock: 2, effect: '2d4 wyrd on trigger', disruption: 'break line of sight', status: 'active' },
        { id: 'c2', subject: 'East stair', trigger: 'area-entered', clock: 1, effect: '1d6 blight', disruption: 'visible salt line', status: 'resolved' }
      ]
    };
    expect(validateDoomsayerState(state)).toEqual({ valid: true, errors: [] });
    expect(projectDoomsayerResource({ state }, true)).toMatchObject({
      initialized: true, valid: true, havoc: 4, havocMax: 15, activeCount: 1, maxCalamities: 2
    });
    expect(projectDoomsayerResource({ state }, false).calamities[0]).toMatchObject({
      subject: 'Gate guard', trigger: 'target-attacks', clock: 2, status: 'active'
    });
    expect(projectDoomsayerResource(null)).toMatchObject({ initialized: false, havoc: 0, activeCount: 0, calamities: [] });
  });

  test('rejects a third active calamity, invalid clocks and duplicate IDs without repairing state', () => {
    const base = {
      havoc: 0,
      calamities: [
        { id: 'c1', subject: 'A', trigger: 'target-attacks', clock: 1, effect: 'E', disruption: 'D', status: 'active' },
        { id: 'c2', subject: 'B', trigger: 'target-moves', clock: 2, effect: 'E', disruption: 'D', status: 'active' }
      ]
    };
    const before = JSON.stringify(base);
    expect(validateDoomsayerState(base).valid).toBe(true);
    expect(validateDoomsayerState({ ...base, calamities: [...base.calamities, { ...base.calamities[0], id: 'c3' }] }).valid).toBe(false);
    expect(validateDoomsayerState({ ...base, calamities: [{ ...base.calamities[0], clock: 0 }] }).valid).toBe(false);
    expect(validateDoomsayerState({ ...base, calamities: [{ ...base.calamities[0] }, { ...base.calamities[0] }] }).valid).toBe(false);
    expect(validateDoomsayerState({ ...base, havoc: 16 }).valid).toBe(false);
    expect(JSON.stringify(base)).toBe(before);
  });

  test('fresh resource never invents a calamity or Havoc', () => {
    const fresh = initializeClassResource('Doomsayer', {});
    expect(fresh).toMatchObject({ type: 'doom-calamities', current: 0, max: 2, havoc: 0, havocMax: 15, initialized: false, state: null });
    expect(getManagedResourceId(fresh, 'Doomsayer')).toBe('doom-calamities');
    const normalized = normalizeManagedClassResource({ type: 'doom_calamities', state: { havoc: 3, calamities: [] } }, 'Doomsayer');
    expect(normalized).toMatchObject({ type: 'doom-calamities', initialized: true, havoc: 3, current: 0, max: 2, stateValid: true });
  });

  test('keeps heritage recommendation-only and preserves legacy Harbinger exactly', () => {
    expect(getClassNativeHeritageIds('Doomsayer')).toEqual([]);
    expect(CLASS_PROVENANCE.Doomsayer).toBeUndefined();
    expect(DOOMSAYER_DATA.heritageRecommendation).toEqual(['skald_human', 'thrask_solari', 'tessen_human']);
    expect(DOOMSAYER_DATA.heritageEffectsImplemented).toBe(false);
    expect(DOOMSAYER_DATA.nativeAccess).toEqual([]);

    const compatibility = getReconstructionCompatibility('harbinger');
    expect(compatibility).toMatchObject({
      relationship: 'successor-name', legacyResolutionRetained: true, automaticConversion: false
    });
    expect(compatibility.successors).toEqual([{ id: 'doomsayer', name: 'Doomsayer', relationship: 'successor-name' }]);
    expect(compatibility.recordDispositions).toBe(HARBINGER_RECORD_DISPOSITIONS);
    expect(HARBINGER_RECORD_DISPOSITIONS.length).toBeGreaterThan(100);
    HARBINGER_RECORD_DISPOSITIONS.forEach(disposition => {
      expect(disposition).toMatchObject({
        sourceClassId: 'harbinger', destinationClassId: 'harbinger', destinationId: null,
        disposition: 'keep', automaticConversion: false
      });
    });
    expect(ALL_CLASSES_DATA.Harbinger).toMatchObject({ id: 'harbinger', name: 'Harbinger' });
    expect(ALL_CLASSES_DATA.Harbinger.classResource).toMatchObject({ type: 'mayhem', max: 100 });
    expect(DOOMSAYER_PROJECTED_SPELLS_BY_ID.cr1_doomsayer_plant_calamity).toBeTruthy();
    expect(DOOMSAYER_AUTHORED_RECORDS.some(record => record.id.startsWith('harbinger'))).toBe(false);
  });
});
