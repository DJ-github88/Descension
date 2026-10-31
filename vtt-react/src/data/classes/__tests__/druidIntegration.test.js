import {
  DRUID_DATA, DRUID_MANIFEST, DRUID_AUTHORED_RECORDS,
  DRUID_OPTIONAL_RECORDS, DRUID_CORE_RECORDS, DRUID_TALENT_ACTIVES,
  DRUID_PROJECTED_SPELLS_BY_ID, DRUID_RESOURCE_RULES,
  validateDruidState, projectDruidResource
} from '../druidData';
import { DRUID_TREES, DRUID_TALENT_NODES } from '../../talentTrees/druid';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { getReconstructionCompatibility } from '../classReconstructionCompatibility';
import { getResourceSystemGuide } from '../../resourceSystems';
import { druidResourceGuide } from '../../resourceSystems/druidResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getManagedResourceId, normalizeManagedClassResource } from '../../classResourceContracts';

describe('Druid complete content lock', () => {
  test('has the locked record, tree and node shape', () => {
    expect(DRUID_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_druid_adopt_loadout', 'cr1_druid_recover_self'
    ]);
    expect(DRUID_OPTIONAL_RECORDS).toHaveLength(40);
    expect(DRUID_TALENT_ACTIVES).toHaveLength(6);
    expect(DRUID_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(DRUID_AUTHORED_RECORDS.map(record => record.id)).size).toBe(96);
    expect(DRUID_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(48);
    expect(DRUID_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(DRUID_TREES).toHaveLength(3);
    expect(DRUID_TALENT_NODES).toHaveLength(54);
    DRUID_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(DRUID_MANIFEST).toMatchObject({
      uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: []
    });
    expect(DRUID_DATA.spells).toHaveLength(96);
  });

  test('keeps four optional picks per level and at least two non-damage choices', () => {
    for (let level = 1; level <= 10; level += 1) {
      const records = DRUID_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(DRUID_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = DRUID_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('marks every record and node manual-only and never imports Shaper Flux or Body Toll', () => {
    [...DRUID_AUTHORED_RECORDS, ...DRUID_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({
        rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false,
        applicationMode: 'manual-tabletop', automatedCapabilities: []
      });
    });
    expect(DRUID_RESOURCE_RULES).toMatchObject({
      activeTraitMax: 2, transitionMax: 3, preparedLoadoutMax: 3,
      platePrevention: 2, bracePrevention: 4,
      refreshOnReconnect: false, refreshOnInitiative: false,
      automaticTransformation: false, automaticRecovery: false, manualOnly: true
    });
    expect(DRUID_DATA.resourceSystem.id).toBe('druid-body');
    expect(DRUID_DATA.resource).toBe('Anatomical Loadout');
    expect(JSON.stringify(DRUID_DATA)).not.toContain('kineticFluxBodyToll');
    expect(JSON.stringify(DRUID_DATA)).not.toContain('bodyToll');
    expect(JSON.stringify(DRUID_DATA)).not.toContain('fate-links');
  });

  test('registers in catalogue, generator, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Druid).toMatchObject({ id: 'druid', name: 'Druid' });
    expect(Boolean(ALL_CLASSES_DATA.Druid.isCompatibilityAlias)).toBe(false);
    expect(ALL_CLASS_SPELLS.Druid.filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(new Set(ALL_CLASS_SPELLS.Druid.map(spell => spell.id)).size).toBe(ALL_CLASS_SPELLS.Druid.length);
    expect(TALENT_TREES.Druid).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS.Druid.specializations.map(spec => spec.id)).toEqual(['predator', 'adaptive-bastion', 'mimic']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Druid')).toMatchObject({
      role: 'Adaptive Hybrid / Explorer', resource: 'Anatomical Loadout', developmentStatus: 'development'
    });
    expect(getResourceSystemGuide('druid')).toBe(druidResourceGuide);
  });

  test('authors exact same-tree signature and capstone gates', () => {
    const points = (treeId, talents) => DRUID_TALENT_NODES
      .filter(node => node.treeId === treeId)
      .reduce((total, node) => total + (talents[node.id] || 0), 0);
    const canUnlock = (node, talents, level) => level >= node.minLevel
      && points(node.treeId, talents) >= node.requiresPoints
      && node.requires.every(id => (talents[id] || 0) >= node.maxRanks);

    DRUID_TREES.forEach(tree => {
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const capstone = tree.nodes.find(node => node.id === tree.meta.capstoneNode);
      const justShort = { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3 };
      const atThreshold = { ...justShort, [tree.nodes[3].id]: 1 };
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      const otherTree = Object.fromEntries(DRUID_TALENT_NODES.filter(node => node.treeId !== tree.id).map(node => [node.id, node.maxRanks]));

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

  test('validates and projects a recorded anatomical loadout without inventing a trait', () => {
    const state = {
      activeLoadout: 'predator',
      activeTraits: [
        { id: 'climbing_pads', slot: 'locomotion' },
        { id: 'natural_blade', slot: 'offense' }
      ],
      unrecoveredTransitions: 1,
      preparedLoadouts: ['predator', 'bastion', 'mimic'],
      suspendedTraits: [],
      plateWindowUsed: false,
      brace: null,
      mimicPattern: null
    };
    expect(validateDruidState(state)).toEqual({ valid: true, errors: [] });
    expect(projectDruidResource({ state }, true)).toMatchObject({
      initialized: true, valid: true, activeLoadout: 'predator', activeCount: 2, transitions: 1, transitionMax: 3
    });
    expect(projectDruidResource(null)).toMatchObject({ initialized: false, activeCount: 0, transitions: 0 });
  });

  test('rejects a third trait, duplicate slots, invalid transitions, active brace without bastion and invalid mimicry', () => {
    const base = {
      activeLoadout: 'predator',
      activeTraits: [{ id: 'climbing_pads', slot: 'locomotion' }, { id: 'natural_blade', slot: 'offense' }],
      unrecoveredTransitions: 0,
      preparedLoadouts: ['predator', 'bastion', 'mimic'],
      suspendedTraits: [],
      plateWindowUsed: false,
      brace: null,
      mimicPattern: null
    };
    const before = JSON.stringify(base);
    expect(validateDruidState(base).valid).toBe(true);
    expect(validateDruidState({ ...base, activeTraits: [...base.activeTraits, { id: 'third', slot: 'defense' }] }).valid).toBe(false);
    expect(validateDruidState({ ...base, activeTraits: [{ id: 'a', slot: 'offense' }, { id: 'b', slot: 'offense' }] }).valid).toBe(false);
    expect(validateDruidState({ ...base, unrecoveredTransitions: 4 }).valid).toBe(false);
    expect(validateDruidState({ ...base, brace: { active: true, prevention: 4 } }).valid).toBe(false);
    expect(validateDruidState({ ...base, mimicPattern: { label: 'Outline', studiedMinutes: 1, sizeDeltaPercent: 10 } }).valid).toBe(false);
    expect(JSON.stringify(base)).toBe(before);
  });

  test('fresh resource never invents a prepared body or transition', () => {
    const fresh = initializeClassResource('Druid', {});
    expect(fresh).toMatchObject({
      type: 'druid-body', current: 0, max: 2, transitionMax: 3, preparedLoadoutMax: 3, initialized: false, state: null
    });
    expect(getManagedResourceId(fresh, 'Druid')).toBe('druid-body');
    const normalized = normalizeManagedClassResource({
      type: 'druid_body', state: { activeLoadout: 'predator', activeTraits: [{ id: 'a', slot: 'offense' }], unrecoveredTransitions: 1 }
    }, 'Druid');
    expect(normalized).toMatchObject({
      type: 'druid-body', initialized: true, current: 1, max: 2, transitions: 1, stateValid: true
    });
  });

  test('keeps heritage recommendation-only and preserves legacy Shaper exactly', () => {
    expect(getClassNativeHeritageIds('Druid')).toEqual([]);
    expect(CLASS_PROVENANCE.Druid?.heritageEffectsImplemented).toBe(false);
    expect(DRUID_DATA.heritageRecommendation).toEqual(['morgh_groven', 'ithran_groven', 'veiled_mimir', 'tethered_mimir']);
    expect(DRUID_DATA.heritageEffectsImplemented).toBe(false);
    expect(DRUID_DATA.nativeAccess).toEqual([]);

    const compatibility = getReconstructionCompatibility('shaper');
    expect(compatibility).toMatchObject({
      relationship: 'successor-name', legacyResolutionRetained: true, automaticConversion: false
    });
    expect(compatibility.successors).toEqual([{ id: 'druid', name: 'Druid', relationship: 'successor-name' }]);
    expect(ALL_CLASSES_DATA.Shaper).toMatchObject({ id: 'shaper', name: 'Shaper' });
    expect(ALL_CLASSES_DATA.Shaper.classResource).toMatchObject({ type: 'flux' });
    expect(DRUID_PROJECTED_SPELLS_BY_ID.cr1_druid_adopt_loadout).toBeTruthy();
    expect(DRUID_AUTHORED_RECORDS.some(record => record.id.startsWith('shaper_'))).toBe(false);
  });
});
