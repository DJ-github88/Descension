import fs from 'fs';
import path from 'path';
import {
  DEATHCALLER_DATA, DEATHCALLER_MANIFEST, DEATHCALLER_AUTHORED_RECORDS,
  DEATHCALLER_OPTIONAL_RECORDS, DEATHCALLER_TALENT_ACTIVES,
  DEATHCALLER_PROJECTED_SPELLS_BY_ID, DEATHCALLER_RESOURCE_RULES,
  DEATHCALLER_TREES, DEATHCALLER_TALENT_NODES,
  validateDeathcallerState, projectDeathcallerResource
} from '../deathcallerData';
import {
  LICHBORNE_DATA, LICHBORNE_MANIFEST, LICHBORNE_AUTHORED_RECORDS,
  LICHBORNE_OPTIONAL_RECORDS, LICHBORNE_TALENT_ACTIVES,
  LICHBORNE_PROJECTED_SPELLS_BY_ID, LICHBORNE_RESOURCE_RULES,
  LICHBORNE_TREES, LICHBORNE_TALENT_NODES,
  validateLichborneState, projectLichborneResource
} from '../lichborneData';
import { ALL_CLASSES_DATA } from '..';
import { ALL_CLASS_SPELLS } from '../../classSpellGenerator';
import { TALENT_TREES } from '../../talentTreeData';
import { CLASS_SPECIALIZATIONS } from '../../classSpellCategories';
import { CLASS_DISPLAY_DATA } from '../classDisplayData';
import { CLASS_PROVENANCE, getClassNativeHeritageIds } from '../../classHeritageRegistry';
import { initializeClassResource } from '../../classResources';
import {
  getManagedResourceId, normalizeManagedClassResource, updateManagedClassResource,
  changeManagedClassResource
} from '../../classResourceContracts';
import { getResourceSystemGuide } from '../../resourceSystems';
import { deathcallerResourceGuide } from '../../resourceSystems/deathcallerResourceGuide';
import { lichborneResourceGuide } from '../../resourceSystems/lichborneResourceGuide';

const readManifest = name => JSON.parse(fs.readFileSync(path.resolve(
  process.cwd(), `../docs/plans/mythrill-class-reconstruction/classes/manifests/${name}-review-r1.json`
), 'utf8'));

const deathcallerState = () => ({
  initialized: true,
  capacityMax: 2,
  preparedPatterns: [{ id: 'pattern-1', name: 'Bone Watch' }],
  manifestations: [{ id: 'manifestation-1', name: 'Bone Watch' }],
  ordersUsed: 1,
  questionsUsed: 0,
  questionRestId: null,
  exhaustedUntilRest: []
});

const lichborneState = () => ({
  initialized: true,
  anchor: { id: 'vessel-1', status: 'intact', location: 'Cinder Vault', ward: { kind: 'rime' } },
  integrity: 7,
  undeathStage: 1,
  preparedTraits: [{ id: 'trait-1', name: 'Rime Step' }, { id: 'trait-2', name: 'Cold Ledger' }],
  activeTraits: [{ id: 'trait-1', name: 'Rime Step' }],
  lifeState: 'active',
  suppressedUntilOwnTurn: null
});

describe('Deathcaller and Lichborne complete content lock', () => {
  test('both packages keep the locked record, tree and node shape', () => {
    expect(DEATHCALLER_OPTIONAL_RECORDS).toHaveLength(40);
    expect(DEATHCALLER_TALENT_ACTIVES).toHaveLength(6);
    expect(DEATHCALLER_AUTHORED_RECORDS).toHaveLength(96);
    expect(LICHBORNE_OPTIONAL_RECORDS).toHaveLength(40);
    expect(LICHBORNE_TALENT_ACTIVES).toHaveLength(6);
    expect(LICHBORNE_AUTHORED_RECORDS).toHaveLength(96);
    expect(new Set([...DEATHCALLER_AUTHORED_RECORDS, ...LICHBORNE_AUTHORED_RECORDS].map(record => record.id)).size).toBe(192);
    expect(DEATHCALLER_TREES).toHaveLength(3);
    expect(LICHBORNE_TREES).toHaveLength(3);
    expect(DEATHCALLER_TALENT_NODES).toHaveLength(54);
    expect(LICHBORNE_TALENT_NODES).toHaveLength(54);
    [DEATHCALLER_TREES, LICHBORNE_TREES].forEach(trees => trees.forEach(tree => {
      expect(tree.nodes).toHaveLength(18);
      expect(tree.nodes.reduce((total, node) => total + node.maxRanks, 0)).toBe(50);
      expect(tree.nodes.filter(node => node.passiveSpellId)).toHaveLength(16);
    }));
    expect(DEATHCALLER_MANIFEST).toMatchObject({ uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: [] });
    expect(LICHBORNE_MANIFEST).toMatchObject({ uniqueRecords: 96, activeRecords: 48, passiveRecords: 48, talentNodes: 54, nativeAccess: [] });
  });

  test('all six preserved R1 payloads per class deep-equal the reviewed source', () => {
    [['deathcaller', DEATHCALLER_PROJECTED_SPELLS_BY_ID, 'deathcaller'],
      ['lichborne', LICHBORNE_PROJECTED_SPELLS_BY_ID, 'lichborne']].forEach(([name, byId, key]) => {
      readManifest(name).abilities.forEach(({ spell }) => {
        expect(byId[spell.id].specialMechanics[key].authoredSpell).toEqual(spell);
      });
    });
  });

  test('keeps four optional picks per level and no duplicate grant IDs', () => {
    [[DEATHCALLER_OPTIONAL_RECORDS, DEATHCALLER_DATA], [LICHBORNE_OPTIONAL_RECORDS, LICHBORNE_DATA]].forEach(([records, data]) => {
      for (let level = 1; level <= 10; level++) {
        const levelRecords = records.filter(record => record.level === level);
        expect(levelRecords).toHaveLength(4);
        expect(data.spellPools[level]).toEqual(levelRecords.map(record => record.id));
      }
      expect(records.filter(record => !record.effectTypes.includes('damage')).length).toBeGreaterThanOrEqual(2);
    });
    [DEATHCALLER_TALENT_NODES, LICHBORNE_TALENT_NODES].forEach(nodes => {
      const grantIds = nodes.filter(node => node.grantId).map(node => node.grantId);
      expect(grantIds).toHaveLength(6);
      expect(new Set(grantIds).size).toBe(6);
    });
  });

  test('marks every record and node manual-only and keeps resources bounded', () => {
    [...DEATHCALLER_AUTHORED_RECORDS, ...DEATHCALLER_TALENT_NODES,
      ...LICHBORNE_AUTHORED_RECORDS, ...LICHBORNE_TALENT_NODES].forEach(entry => {
      expect(entry).toMatchObject({ rulesetVersion: 'cr-review-r1', authoredOnly: true, executionEnabled: false, applicationMode: 'manual-tabletop', automatedCapabilities: [] });
    });
    expect(DEATHCALLER_RESOURCE_RULES).toMatchObject({
      preparedMax: 3, capacityMax: 2, ordersPerOwnTurn: 2, manifestationsMax: 2,
      actorActionMaxPerCasterOwnTurn: 1, questionsMax: 2, vitalityMax: 10, manualOnly: true
    });
    expect(LICHBORNE_RESOURCE_RULES).toMatchObject({
      integrityMax: 12, stageMax: 2, preparedTraitCount: 2, manualOnly: true,
      anchorStatuses: ['intact', 'destroyed'], lifeStates: ['active', 'dormant', 'dead']
    });
    expect(DEATHCALLER_DATA.resourceSystem.resourceDefinition.id).toBe('dead-muster');
    expect(LICHBORNE_DATA.resourceSystem.resourceDefinition.id).toBe('lich-anchor');
  });

  test('registers both classes in catalogue, generator, trees, display and guides', () => {
    expect(ALL_CLASSES_DATA.Deathcaller).toMatchObject({ id: 'deathcaller', name: 'Deathcaller' });
    expect(ALL_CLASSES_DATA.Lichborne).toMatchObject({ id: 'lichborne', name: 'Lichborne' });
    expect(ALL_CLASS_SPELLS.Deathcaller.filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(ALL_CLASS_SPELLS.Lichborne.filter(spell => spell.source !== 'general')).toHaveLength(96);
    expect(TALENT_TREES.Deathcaller).toBeTruthy();
    expect(TALENT_TREES.Lichborne).toBeTruthy();
    expect(CLASS_SPECIALIZATIONS.Deathcaller.specializations.map(spec => spec.id)).toEqual(['grave-marshal', 'soul-shepherd', 'ossuary-architect']);
    expect(CLASS_SPECIALIZATIONS.Lichborne.specializations.map(spec => spec.id)).toEqual(['rime-sovereign', 'phylactery-keeper', 'veil-scholar']);
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Deathcaller').role).toBe('Summoner / Commander');
    expect(CLASS_DISPLAY_DATA.find(entry => entry.name === 'Lichborne').role).toBe('Anchor Mage / Controller');
    expect(getResourceSystemGuide('deathcaller')).toBe(deathcallerResourceGuide);
    expect(getResourceSystemGuide('lichborne')).toBe(lichborneResourceGuide);
  });

  test('keeps heritage recommendation-only and coverage unchanged', () => {
    expect(getClassNativeHeritageIds('Deathcaller')).toEqual([]);
    expect(getClassNativeHeritageIds('Lichborne')).toEqual([]);
    expect(CLASS_PROVENANCE.Deathcaller?.heritageEffectsImplemented).toBe(false);
    expect(CLASS_PROVENANCE.Lichborne?.heritageEffectsImplemented).toBe(false);
    expect(DEATHCALLER_DATA.heritageRecommendation).toEqual(['clean_vreken', 'velun_neth']);
    expect(LICHBORNE_DATA.heritageRecommendation).toEqual(['velun_neth', 'tessen_human']);
    expect(DEATHCALLER_DATA.heritageEffectsImplemented).toBe(false);
    expect(LICHBORNE_DATA.heritageEffectsImplemented).toBe(false);
  });
});

describe('manual class resources', () => {
  test('fresh Deathcaller and Lichborne resources never invent a manifestation or anchor', () => {
    const deathcaller = initializeClassResource('Deathcaller', {});
    expect(deathcaller).toMatchObject({ type: 'dead-muster', current: 0, max: 2, initialized: false, state: null });
    expect(getManagedResourceId(deathcaller, 'Deathcaller')).toBe('dead-muster');
    const lichborne = initializeClassResource('Lichborne', {});
    expect(lichborne).toMatchObject({ type: 'lich-anchor', current: 0, max: 12, initialized: false, state: null });
    expect(getManagedResourceId(lichborne, 'Lichborne')).toBe('lich-anchor');
  });

  test('normalization derives display counts from the recorded state only', () => {
    const state = deathcallerState();
    const normalized = normalizeManagedClassResource({ type: 'dead_muster', state }, 'Deathcaller');
    expect(normalized).toMatchObject({ type: 'dead-muster', initialized: true, current: 1, max: 2, stateValid: true });
    expect(projectDeathcallerResource(normalized, true)).toMatchObject({
      initialized: true, valid: true, preparedCount: 1, manifestationCount: 1, ordersUsed: 1
    });
    expect(validateDeathcallerState(state).valid).toBe(true);
    const lichborne = normalizeManagedClassResource({ type: 'lich_anchor', state: lichborneState() }, 'Lichborne');
    expect(lichborne).toMatchObject({ type: 'lich-anchor', initialized: true, current: 7, max: 12, stateValid: true });
    expect(projectLichborneResource(lichborne, true)).toMatchObject({ initialized: true, valid: true, integrity: 7, undeathStage: 1 });
    expect(validateLichborneState(lichborneState()).valid).toBe(true);
  });

  test('invalid state is reported and generic writes cannot repair it', () => {
    const [first] = lichborneState().preparedTraits;
    const invalid = { ...lichborneState(), undeathStage: 0, activeTraits: [first] };
    const normalized = normalizeManagedClassResource({ type: 'lich-anchor', state: invalid }, 'Lichborne');
    expect(normalized).toMatchObject({ stateValid: false, initialized: true, current: 0 });
    expect(projectLichborneResource(normalized, true).valid).toBe(false);
    const before = JSON.stringify(normalized);
    expect(updateManagedClassResource(normalized, 'Lichborne', 'current', 12).current).toBe(0);
    expect(changeManagedClassResource(normalized, 'Lichborne', 5).current).toBe(0);
    expect(JSON.stringify(normalized)).toBe(before);
  });

  test('observer projections hide the anchor location and owner-only trait records', () => {
    const state = lichborneState();
    const observer = projectLichborneResource({ type: 'lich-anchor', initialized: true, state }, false);
    expect(observer.anchor).toEqual({ status: 'intact' });
    expect(observer).not.toHaveProperty('preparedTraits');
    expect(observer).not.toHaveProperty('activeTraits');
    expect(JSON.stringify(observer)).not.toContain('Cinder Vault');
    expect(JSON.stringify(observer)).not.toContain('Rime Step');
    expect(projectLichborneResource({ type: 'lich-anchor', initialized: true, state }, true).anchor.location).toBe('Cinder Vault');
  });

  test('invalid prepared pattern counts stay visible as review state', () => {
    const state = { ...deathcallerState(), preparedPatterns: [{}, {}, {}, {}] };
    const normalized = normalizeManagedClassResource({ type: 'dead_muster', state }, 'Deathcaller');
    expect(normalized.stateValid).toBe(false);
    expect(projectDeathcallerResource(normalized, true).valid).toBe(false);
    expect(normalized.current).toBe(0);
  });
});

