import {
  ORACLE_DATA, ORACLE_MANIFEST, ORACLE_AUTHORED_RECORDS,
  ORACLE_OPTIONAL_RECORDS, ORACLE_CORE_RECORDS, ORACLE_TALENT_ACTIVES,
  ORACLE_PROJECTED_SPELLS_BY_ID, ORACLE_RESOURCE_RULES, ORACLE_FORECAST_CATEGORIES,
  validateOracleState, projectOracleResource
} from '../oracleData';
import { ORACLE_TREES, ORACLE_TALENT_NODES } from '../../talentTrees/oracle';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { getReconstructionCompatibility } from '../classReconstructionCompatibility';
import { ORACLE_RECORD_DISPOSITIONS } from '../oracleDispositions';
import { getResourceSystemGuide } from '../../resourceSystems';
import { oracleResourceGuide } from '../../resourceSystems/oracleResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getManagedResourceId, normalizeManagedClassResource } from '../../classResourceContracts';

describe('Oracle complete content lock', () => {
  test('has the locked record, tree and node shape', () => {
    expect(ORACLE_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_oracle_commit_forecast', 'cr1_oracle_release_forecast'
    ]);
    expect(ORACLE_OPTIONAL_RECORDS).toHaveLength(40);
    expect(ORACLE_TALENT_ACTIVES).toHaveLength(6);
    expect(ORACLE_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set(ORACLE_AUTHORED_RECORDS.map(record => record.id)).size).toBe(96);
    expect(ORACLE_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(48);
    expect(ORACLE_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(ORACLE_TREES).toHaveLength(3);
    expect(ORACLE_TALENT_NODES).toHaveLength(54);
    ORACLE_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(ORACLE_MANIFEST).toMatchObject({
      uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: []
    });
    expect(ORACLE_DATA.spells).toHaveLength(96);
  });

  test('keeps four optional picks per level and at least two non-damage choices', () => {
    for (let level = 1; level <= 10; level += 1) {
      const records = ORACLE_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(ORACLE_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = ORACLE_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('marks every record and node manual-only and keeps debt, dice and link economies out', () => {
    [...ORACLE_AUTHORED_RECORDS, ...ORACLE_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({
        rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false,
        applicationMode: 'manual-tabletop', automatedCapabilities: []
      });
    });
    expect(ORACLE_RESOURCE_RULES).toMatchObject({
      slotMax: 2, expiryMinOwnTurns: 1, expiryMaxOwnTurns: 2,
      noDebt: true, noDiceReplacement: true, noOmniscience: true,
      hiddenInformation: false, automaticFulfillment: false,
      refreshOnReconnect: false, refreshOnInitiative: false, manualOnly: true
    });
    expect(ORACLE_DATA.resourceSystem.id).toBe('oracle-forecasts');
    expect(ORACLE_DATA.resource).toBe('Forecasts');
    expect(ORACLE_DATA.classResource.type).toBe('oracle-forecasts');
    expect(JSON.stringify(ORACLE_DATA)).not.toContain('fate-links');
    expect(JSON.stringify(ORACLE_DATA)).not.toContain('benediction-malediction');
  });

  test('registers in catalogue, generator, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Oracle).toMatchObject({ id: 'oracle', name: 'Oracle' });
    expect(Boolean(ALL_CLASSES_DATA.Oracle.isCompatibilityAlias)).toBe(false);
    expect(ALL_CLASS_SPELLS.Oracle.filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(new Set(ALL_CLASS_SPELLS.Oracle.map(spell => spell.id)).size).toBe(ALL_CLASS_SPELLS.Oracle.length);
    expect(TALENT_TREES.Oracle).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS.Oracle.specializations.map(spec => spec.id)).toEqual(['seer', 'witness', 'pathfinder']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Oracle')).toMatchObject({
      role: 'Support / Insight', resource: 'Forecasts', developmentStatus: 'development'
    });
    expect(getResourceSystemGuide('oracle')).toBe(oracleResourceGuide);
  });

  test('authors exact same-tree signature and capstone gates', () => {
    const points = (treeId, talents) => ORACLE_TALENT_NODES
      .filter(node => node.treeId === treeId)
      .reduce((total, node) => total + (talents[node.id] || 0), 0);
    const canUnlock = (node, talents, level) => level >= node.minLevel
      && points(node.treeId, talents) >= node.requiresPoints
      && node.requires.every(id => (talents[id] || 0) >= node.maxRanks);

    ORACLE_TREES.forEach(tree => {
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const capstone = tree.nodes.find(node => node.id === tree.meta.capstoneNode);
      const justShort = { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3 };
      const atThreshold = { ...justShort, [tree.nodes[3].id]: 1 };
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      const otherTree = Object.fromEntries(ORACLE_TALENT_NODES.filter(node => node.treeId !== tree.id).map(node => [node.id, node.maxRanks]));

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

  test('validates and projects only recorded forecasts without inventing benefits', () => {
    const state = {
      maxSlots: 2,
      slots: [
        { id: 'f1', subject: 'A', category: 'attack-roll', benefit: 'reduce 5 damage once', expiresInOwnTurns: 1, status: 'prepared' },
        { id: 'f2', subject: 'East gate', category: 'movement', benefit: 'ignore 10 ft difficult terrain', expiresInOwnTurns: 2, status: 'expired' }
      ]
    };
    expect(validateOracleState(state)).toEqual({ valid: true, errors: [] });
    expect(projectOracleResource({ state }, true)).toMatchObject({
      initialized: true, valid: true, preparedCount: 1, maxSlots: 2
    });
    expect(projectOracleResource({ state }, false).forecasts[0]).toMatchObject({
      subject: 'A', category: 'attack-roll', benefit: 'reduce 5 damage once', status: 'prepared'
    });
    expect(projectOracleResource(null)).toMatchObject({ initialized: false, preparedCount: 0, forecasts: [] });
  });

  test('rejects a third prepared forecast, invalid category or expiry and die replacement', () => {
    const base = {
      slots: [
        { id: 'f1', subject: 'A', category: 'attack-roll', benefit: 'B', expiresInOwnTurns: 1, status: 'prepared' },
        { id: 'f2', subject: 'B', category: 'save', benefit: 'B', expiresInOwnTurns: 2, status: 'prepared' }
      ]
    };
    const before = JSON.stringify(base);
    expect(validateOracleState(base).valid).toBe(true);
    expect(validateOracleState({ ...base, slots: [...base.slots, { ...base.slots[0], id: 'f3' }] }).valid).toBe(false);
    expect(validateOracleState({ ...base, slots: [{ ...base.slots[0], category: 'future-certainty' }] }).valid).toBe(false);
    expect(validateOracleState({ ...base, slots: [{ ...base.slots[0], expiresInOwnTurns: 3 }] }).valid).toBe(false);
    expect(validateOracleState({ ...base, slots: [{ ...base.slots[0], diceReplacement: true }] }).valid).toBe(false);
    expect(ORACLE_FORECAST_CATEGORIES).toContain('attack-roll');
    expect(JSON.stringify(base)).toBe(before);
  });

  test('fresh resource never invents a forecast or a benefit', () => {
    const fresh = initializeClassResource('Oracle', {});
    expect(fresh).toMatchObject({ type: 'oracle-forecasts', current: 0, max: 2, initialized: false, state: null });
    expect(getManagedResourceId(fresh, 'Oracle')).toBe('oracle-forecasts');
    const normalized = normalizeManagedClassResource({ type: 'oracle_forecasts', state: { slots: [] } }, 'Oracle');
    expect(normalized).toMatchObject({ type: 'oracle-forecasts', initialized: true, current: 0, max: 2, stateValid: true });
  });

  test('keeps heritage recommendation-only and preserves historical Oracle as legacy evidence', () => {
    expect(getClassNativeHeritageIds('Oracle')).toEqual([]);
    expect(CLASS_PROVENANCE.Oracle?.heritageEffectsImplemented).toBe(false);
    expect(ORACLE_DATA.heritageRecommendation).toEqual(['vashir_astril', 'ordan_human']);
    expect(ORACLE_DATA.heritageEffectsImplemented).toBe(false);
    expect(ORACLE_DATA.nativeAccess).toEqual([]);

    const compatibility = getReconstructionCompatibility('oracle');
    expect(compatibility).toMatchObject({
      relationship: 'independent', legacyResolutionRetained: true, automaticConversion: false
    });
    expect(compatibility.successors).toEqual([]);
    expect(compatibility.recordDispositions).toBe(ORACLE_RECORD_DISPOSITIONS);
    expect(ORACLE_RECORD_DISPOSITIONS.length).toBeGreaterThan(70);
    ORACLE_RECORD_DISPOSITIONS.forEach(disposition => {
      expect(disposition).toMatchObject({
        sourceClassId: 'oracle', destinationClassId: null, destinationId: null,
        disposition: 'legacy-only', automaticConversion: false
      });
    });
    expect(ORACLE_RECORD_DISPOSITIONS.some(disposition => disposition.sourceId === 'omenDebt')).toBe(true);
    expect(ORACLE_PROJECTED_SPELLS_BY_ID.cr1_oracle_commit_forecast).toBeTruthy();
    expect(ORACLE_AUTHORED_RECORDS.some(record => record.id.startsWith('oracle_'))).toBe(false);
  });
});
