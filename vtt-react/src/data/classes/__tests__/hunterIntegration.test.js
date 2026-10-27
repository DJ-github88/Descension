import {
  HUNTER_DATA, HUNTER_MANIFEST, HUNTER_AUTHORED_RECORDS,
  HUNTER_OPTIONAL_RECORDS, HUNTER_CORE_RECORDS, HUNTER_TALENT_ACTIVES,
  HUNTER_PROJECTED_SPELLS_BY_ID, HUNTER_RESOURCE_RULES,
  validateHunterState, projectHunterResource
} from '../hunterData';
import { HUNTER_TREES, HUNTER_TALENT_NODES } from '../../talentTrees/hunter';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { getReconstructionCompatibility } from '../classReconstructionCompatibility';
import { getResourceSystemGuide } from '../../resourceSystems';
import { hunterResourceGuide } from '../../resourceSystems/hunterResourceGuide';
import { initializeClassResource } from '../../classResources';
import { getManagedResourceId, normalizeManagedClassResource } from '../../classResourceContracts';

describe('Hunter complete content lock', () => {
  test('has the locked record, tree and node shape', () => {
    expect(HUNTER_CORE_RECORDS.map(record => record.id)).toEqual([
      'cr1_hunter_mark_quarry', 'cr1_hunter_take_angle', 'cr1_hunter_press_quarry'
    ]);
    expect(HUNTER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(HUNTER_TALENT_ACTIVES).toHaveLength(6);
    expect(HUNTER_AUTHORED_RECORDS).toHaveLength(97);
    expect(new Set(HUNTER_AUTHORED_RECORDS.map(record => record.id)).size).toBe(97);
    expect(HUNTER_AUTHORED_RECORDS.filter(record => record.spellType === 'ACTION')).toHaveLength(49);
    expect(HUNTER_AUTHORED_RECORDS.filter(record => record.spellType === 'PASSIVE')).toHaveLength(48);
    expect(HUNTER_TREES).toHaveLength(3);
    expect(HUNTER_TALENT_NODES).toHaveLength(54);
    HUNTER_TREES.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    });
    expect(HUNTER_MANIFEST).toMatchObject({
      uniqueRecords: 97, activeRecords: 49, passiveRecords: 48, talentNodes: 54, nativeAccess: []
    });
    expect(HUNTER_DATA.spells).toHaveLength(97);
  });

  test('keeps four optional picks per level and at least two non-damage choices', () => {
    for (let level = 1; level <= 10; level += 1) {
      const records = HUNTER_OPTIONAL_RECORDS.filter(record => record.level === level);
      expect(records).toHaveLength(4);
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
      expect(HUNTER_DATA.spellPools[level]).toEqual(records.map(record => record.id));
    }
    const grantIds = HUNTER_TALENT_NODES.filter(node => node.grantId).map(node => node.grantId);
    expect(grantIds).toHaveLength(6);
    expect(new Set(grantIds).size).toBe(6);
  });

  test('marks every record and node manual-only and never imports Apex marks or companion powers', () => {
    [...HUNTER_AUTHORED_RECORDS, ...HUNTER_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({
        rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false,
        applicationMode: 'manual-tabletop', automatedCapabilities: []
      });
    });
    expect(HUNTER_RESOURCE_RULES).toMatchObject({
      quarryMax: 1, evidenceDistinctMax: 3, newTagsPerOwnTurn: 1,
      lostContactExpiryOwnTurns: 2, companionOptional: true, companionActionMaxPerOwnTurn: 1,
      committedPathMaxFeet: 20, refreshOnReconnect: false, refreshOnInitiative: false,
      automaticTagGeneration: false, automaticCompanionAction: false, manualOnly: true
    });
    expect(HUNTER_DATA.resourceSystem.id).toBe('hunter-evidence');
    expect(HUNTER_DATA.resource).toBe('Quarry & Evidence');
    expect(JSON.stringify(HUNTER_DATA)).not.toContain('quarryMarksCompanion');
    expect(JSON.stringify(HUNTER_DATA)).not.toContain('companionHP');
    expect(JSON.stringify(HUNTER_DATA)).not.toContain('fate-links');
  });

  test('registers in catalogue, generator, trees, specializations, display and guide surfaces', () => {
    expect(ALL_CLASSES_DATA.Hunter).toMatchObject({ id: 'hunter', name: 'Hunter' });
    expect(Boolean(ALL_CLASSES_DATA.Hunter.isCompatibilityAlias)).toBe(false);
    expect(ALL_CLASS_SPELLS.Hunter.filter(spell => spell.source !== 'general')).toHaveLength(97);
    expect(new Set(ALL_CLASS_SPELLS.Hunter.map(spell => spell.id)).size).toBe(ALL_CLASS_SPELLS.Hunter.length);
    expect(TALENT_TREES.Hunter).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS.Hunter.specializations.map(spec => spec.id)).toEqual(['stalker', 'beastmaster', 'trailblade']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Hunter')).toMatchObject({
      role: 'Pursuit / Precision', resource: 'Quarry & Evidence', developmentStatus: 'development'
    });
    expect(getResourceSystemGuide('hunter')).toBe(hunterResourceGuide);
  });

  test('authors exact same-tree signature and capstone gates', () => {
    const points = (treeId, talents) => HUNTER_TALENT_NODES
      .filter(node => node.treeId === treeId)
      .reduce((total, node) => total + (talents[node.id] || 0), 0);
    const canUnlock = (node, talents, level) => level >= node.minLevel
      && points(node.treeId, talents) >= node.requiresPoints
      && node.requires.every(id => (talents[id] || 0) >= node.maxRanks);

    HUNTER_TREES.forEach(tree => {
      const signature = tree.nodes.find(node => node.id === tree.meta.signatureNode);
      const capstone = tree.nodes.find(node => node.id === tree.meta.capstoneNode);
      const justShort = { [tree.nodes[0].id]: 3, [tree.nodes[1].id]: 3, [tree.nodes[2].id]: 3 };
      const atThreshold = { ...justShort, [tree.nodes[3].id]: 1 };
      const fullTree = Object.fromEntries(tree.nodes.map(node => [node.id, node.maxRanks]));
      const otherTree = Object.fromEntries(HUNTER_TALENT_NODES.filter(node => node.treeId !== tree.id).map(node => [node.id, node.maxRanks]));

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

  test('validates and projects a recorded quarry without inventing a tag or companion', () => {
    const state = {
      quarry: { id: 'npc-1', label: 'Ash stag' },
      evidence: [
        { tag: 'read', sourceEventId: 'evt-1', source: 'Mark Quarry', ownTurnId: 1 }
      ],
      generationUsedOwnTurnId: 'turn-1',
      lastContactOwnTurn: 1,
      companion: null,
      committedPath: null
    };
    expect(validateHunterState(state)).toEqual({ valid: true, errors: [] });
    expect(projectHunterResource({ state }, true)).toMatchObject({
      initialized: true, valid: true, quarry: { id: 'npc-1', label: 'Ash stag' }, generationUsedOwnTurnId: 'turn-1'
    });
    expect(projectHunterResource(null)).toMatchObject({ initialized: false, quarry: null, evidence: [] });
  });

  test('rejects a second quarry tag, duplicate evidence, evidence without a quarry and an oversized path', () => {
    const base = {
      quarry: { id: 'npc-1', label: 'Ash stag' },
      evidence: [{ tag: 'read', sourceEventId: 'evt-1', source: 'Mark Quarry', ownTurnId: 1 }],
      generationUsedOwnTurnId: 'turn-1',
      lastContactOwnTurn: 1,
      companion: null,
      committedPath: null
    };
    const before = JSON.stringify(base);
    expect(validateHunterState(base).valid).toBe(true);
    expect(validateHunterState({ ...base, evidence: [...base.evidence, { ...base.evidence[0] }] }).valid).toBe(false);
    expect(validateHunterState({ ...base, evidence: [{ ...base.evidence[0], tag: 'focus' }] }).valid).toBe(false);
    expect(validateHunterState({ ...base, quarry: null }).valid).toBe(false);
    expect(validateHunterState({ ...base, committedPath: { weaponId: 'glaive', pathFeet: 25, expiresAtTurn: 3 } }).valid).toBe(false);
    expect(validateHunterState({ ...base, companion: { id: 'wolf', bonded: false } }).valid).toBe(false);
    expect(JSON.stringify(base)).toBe(before);
  });

  test('fresh resource never invents a quarry, tag or companion', () => {
    const fresh = initializeClassResource('Hunter', {});
    expect(fresh).toMatchObject({
      type: 'hunter-evidence', current: 0, max: 3, quarryMax: 1, evidenceMax: 3, initialized: false, state: null
    });
    expect(getManagedResourceId(fresh, 'Hunter')).toBe('hunter-evidence');
    const normalized = normalizeManagedClassResource({
      type: 'hunter_evidence', state: { quarry: { id: 'npc-1', label: 'Ash stag' }, evidence: [] }
    }, 'Hunter');
    expect(normalized).toMatchObject({ type: 'hunter-evidence', initialized: true, current: 0, max: 3, stateValid: true });
  });

  test('keeps heritage recommendation-only and preserves legacy Apex exactly', () => {
    expect(getClassNativeHeritageIds('Hunter')).toEqual([]);
    expect(CLASS_PROVENANCE.Hunter).toBeUndefined();
    expect(HUNTER_DATA.heritageRecommendation).toEqual([
      'skald_human', 'ordan_human', 'veiled_mimir', 'tethered_mimir', 'marked_vreken', 'thrask_solari', 'deepling_myrathil'
    ]);
    expect(HUNTER_DATA.heritageEffectsImplemented).toBe(false);
    expect(HUNTER_DATA.nativeAccess).toEqual([]);

    const compatibility = getReconstructionCompatibility('apex');
    expect(compatibility).toMatchObject({
      relationship: 'successor-name', legacyResolutionRetained: true, automaticConversion: false
    });
    expect(compatibility.successors).toEqual([{ id: 'hunter', name: 'Hunter', relationship: 'successor-name' }]);
    expect(ALL_CLASSES_DATA.Apex).toMatchObject({ id: 'apex', name: 'Apex' });
    expect(ALL_CLASSES_DATA.Apex.classResource).toMatchObject({ type: 'marks' });
    expect(HUNTER_PROJECTED_SPELLS_BY_ID.cr1_hunter_mark_quarry).toBeTruthy();
    expect(HUNTER_AUTHORED_RECORDS.some(record => record.id.startsWith('apex_'))).toBe(false);
  });
});
