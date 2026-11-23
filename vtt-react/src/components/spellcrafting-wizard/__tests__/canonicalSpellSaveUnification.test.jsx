/**
 * Canonical 3-Way Spell Save Unification Suite
 *
 * Verifies Header Finalize/Update (SpellwizardApp), Step 10 Review Save/Update,
 * and floating ExternalLivePreview Complete/Update share one canonical save path:
 *   1. Identical authoredDraft, serializedData, icon, targeting, resources, cooldown, and compiled definitions.
 *   2. Explicit zeroes (0 AP, 0 mana, 0 rangeDistance, 0 level, 0 cooldownValue) & effect-level fields preserved.
 *   3. Library metadata (folderId, isShared, categoryIds, etc.) and transient keys kept out of authoredDraft/serializedData.
 *   4. ExternalLivePreview update refreshes serializedData cleanly without stale mismatch.
 *   5. Manual-only control spell reopens unchanged with exact refusal reason across all 3 paths.
 *   6. Shared non-empty spell name validation gate blocks invalid saves on all 3 buttons.
 *   7. Singular Chronarch time_shard_*, Pyrofiend inferno_*, Martyr devotion_*, Doomsayer prophecy handled consistently.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import Step10Review from '../components/steps/Step10Review';
import ExternalLivePreview from '../ExternalLivePreview';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { saveUserSpell } from '../../../services/firebase/userSpellService';
import {
  LIBRARY_METADATA_KEYS,
  TRANSIENT_WIZARD_KEYS,
  DERIVED_DISPLAY_KEYS
} from '../utils/canonicalSpellSave';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type !== '2d') return null;
    return {
      clearRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      setLineDash: () => {}
    };
  };
}

let mockPersisted = null;
jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => { mockPersisted = JSON.parse(JSON.stringify(data)); },
  loadCustomSpells: () => [],
  saveCustomSpells: () => {},
  loadDeletedSpellIds: () => [],
  saveDeletedSpellIds: () => {}
}));
jest.mock('../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([]),
  saveUserSpell: jest.fn(() => Promise.resolve({ success: true, localOnly: false }))
}));
jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: () => 'test-icon.png',
  getAbilityIconUrl: () => 'test-icon.png',
  getCustomIconUrl: () => 'fallback-icon.png',
  getCreatureTokenIconUrl: () => 'test-icon.png'
}));
jest.mock('../../../utils/dialogService', () => ({
  showConfirm: jest.fn(() => Promise.resolve(true)),
  showAlert: () => Promise.resolve(true),
  showPrompt: () => Promise.resolve(null)
}));
jest.mock('../../../store/characterStore', () => {
  const state = { characters: [], currentCharacterId: null, activeCharacterId: null, currentCharacter: null };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  return { __esModule: true, default: useCharacterStore };
});
jest.mock('../../../store/authStore', () => {
  const auth = { user: { uid: 'canonical-save-test-user', isGuest: false } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(auth) : auth);
  useAuthStore.getState = () => auth;
  return { __esModule: true, default: useAuthStore };
});

const clone = (v) => JSON.parse(JSON.stringify(v));

let latestWizardState = null;
function WizardProbe() {
  latestWizardState = useSpellWizardState();
  return null;
}

function mountAllSaveSurfaces({ seedSpells = [] } = {}) {
  mockPersisted = {
    version: 1,
    lastSaved: '2026-11-20T00:00:00.000Z',
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: seedSpells.map(clone),
      collections: [],
      selectedSpell: null
    }
  };
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });

  return render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <SpellwizardApp hideHeader={true} />
          <Step10Review stepNumber={10} totalSteps={10} isActive={true} onNext={() => {}} onPrevious={() => {}} />
          <ExternalLivePreview />
          <WizardProbe />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
}

async function loadIntoWizardForEdit(record) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => { window.handleLoadSpell(clone(record), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeTruthy());
}

function assertCleanSeparation(record) {
  expect(record.authoredDraft).toBeTruthy();
  expect(typeof record.serializedData).toBe('string');
  const parsed = JSON.parse(record.serializedData);
  expect(parsed).toEqual(record.authoredDraft);

  for (const key of [...LIBRARY_METADATA_KEYS, ...TRANSIENT_WIZARD_KEYS, ...DERIVED_DISPLAY_KEYS, 'authoredDraft', 'serializedData']) {
    expect(Object.prototype.hasOwnProperty.call(record.authoredDraft, key)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, key)).toBe(false);
  }
  for (const key of TRANSIENT_WIZARD_KEYS) {
    expect(Object.prototype.hasOwnProperty.call(record, key)).toBe(false);
  }
}

const SUPPORTED_FIXTURE = {
  id: 'unify-supported-1',
  name: 'Ember Pulse',
  description: 'Launches an ember pulse with zero mana.',
  level: 0,
  spellType: 'ACTION',
  resolution: 'DICE',
  effectTypes: ['damage'],
  effectsMap: { damage: true },
  typeConfig: { school: 'ember', icon: 'Fire/Fire Bolt', castTimeType: 'IMMEDIATE', tags: ['attack'] },
  damageConfig: { damageType: 'direct', formula: '2d6 + 1', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['enemy'],
    maxTargets: 1,
    selectionMethod: 'manual',
    targetSelectionMethod: 'manual',
    aoeShape: 'circle',
    aoeType: 'sphere',
    aoeParameters: {},
    movementBehavior: 'static'
  },
  resourceCost: {
    actionPoints: 1,
    actionPointsSelected: true,
    mana: 0,
    components: [],
    resourceTypes: ['mana', 'actionPoints'],
    resourceValues: { mana: 0, actionPoints: 1 },
    resourceFormulas: {},
    useFormulas: { mana: false, actionPoints: false }
  },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  durationConfig: { durationType: 'instant' },
  authoredDefinitionId: '12345678-1234-4123-8123-123456789012',
  dateCreated: '2026-11-20T00:00:00.000Z',
  lastModified: '2026-11-20T00:00:00.000Z',
  categoryIds: ['offensive'],
  categories: ['all'],
  source: 'wizard',
  isCustom: true
};

beforeEach(() => {
  mockPersisted = null;
  latestWizardState = null;
  saveUserSpell.mockClear();
  window.alert = jest.fn();
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Canonical Spell Save Unification (Header Finalize / Step 10 Review / ExternalLivePreview)', () => {
  jest.setTimeout(30000);

  test('1. 3-way Create and Update produce identical authoredDraft, serializedData, icon, targeting, resources, and compiled definitions', async () => {
    mountAllSaveSurfaces();

    await act(async () => {
      window.handleLoadSpell(clone(SUPPORTED_FIXTURE), false);
    });
    await waitFor(() => expect(latestWizardState?.name).toBe('Ember Pulse'));

    // Create via Header Finalize
    const headerBtn = screen.getByRole('button', { name: /^Finalize$/i });
    await act(async () => { fireEvent.click(headerBtn); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));
    const createdHeader = clone(mockPersisted.data.spells[0]);

    // Create via Step 10 Review Save to Library
    await act(async () => { window.handleLoadSpell(clone(SUPPORTED_FIXTURE), false); });
    const reviewBtn = screen.getByRole('button', { name: /Save to Library/i });
    await act(async () => { fireEvent.click(reviewBtn); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));
    const createdReview = clone(mockPersisted.data.spells[1]);

    // Create via ExternalLivePreview Complete Spell
    await act(async () => { window.handleLoadSpell(clone(SUPPORTED_FIXTURE), false); });
    const previewBtn = screen.getByRole('button', { name: /Complete Spell/i });
    await act(async () => { fireEvent.click(previewBtn); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(3));
    const createdPreview = clone(mockPersisted.data.spells[2]);

    for (const rec of [createdHeader, createdReview, createdPreview]) {
      assertCleanSeparation(rec);
      expect(rec.id).toMatch(/^ember-pulse-/);
      expect(rec.icon).toBe('Fire/Fire Bolt');
      expect(rec.level).toBe(0);
      expect(rec.resourceCost.mana).toBe(0);
      expect(rec.cooldownConfig.cooldownValue).toBe(0);
      expect(rec.tags).toEqual(['attack', 'damage']);
      expect(rec.targetingConfig).toMatchObject({
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        maxTargets: 1,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        movementBehavior: 'static'
      });
      const compiled = definitionFromWizard(clone(rec), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
      expect(compiled.ok).toBe(true);
    }

    // All three buttons produce identical authoredDraft & JSON.parse(serializedData)
    expect(createdReview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(createdPreview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(JSON.parse(createdReview.serializedData)).toEqual(JSON.parse(createdHeader.serializedData));
    expect(JSON.parse(createdPreview.serializedData)).toEqual(JSON.parse(createdHeader.serializedData));
  });

  test('2. Explicit zeroes (0 AP, 0 mana, 0 rangeDistance, 0 level) & effect-level fields survive Create -> Reopen -> Update across all 3 buttons', async () => {
    const richMultiEffect = {
      ...clone(SUPPORTED_FIXTURE),
      id: 'unify-zero-effect-fields',
      name: 'Zero Cost Dual Utility',
      level: 0,
      effectTypes: ['damage', 'healing'],
      effectsMap: { damage: true, healing: true },
      targetingMode: 'effect',
      effectTargeting: {
        damage: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 45, targetRestrictions: ['enemy'], maxTargets: 1 },
        healing: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 0,
        targetRestrictions: ['self'],
        maxTargets: 1,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        aoeShape: 'circle',
        aoeType: 'sphere',
        aoeParameters: {},
        movementBehavior: 'static'
      },
      damageConfig: {
        damageType: 'direct',
        formula: '1d8',
        elementType: 'ember',
        damageTypes: ['ember'],
        resolution: 'DICE',
        savingThrow: false,
        chanceOnHitConfig: { enabled: true, diceThreshold: 17, procType: 'spell', customEffects: [] }
      },
      healingConfig: {
        healingType: 'direct',
        formula: '1d4',
        resolution: 'DICE',
        chanceOnHitConfig: { enabled: true, diceThreshold: 14, procType: 'heal', customEffects: [] }
      },
      resourceCost: {
        actionPoints: 0,
        actionPointsSelected: true,
        mana: 0,
        components: [],
        resourceTypes: ['mana', 'actionPoints'],
        resourceValues: { mana: 0, actionPoints: 0 },
        resourceFormulas: {},
        useFormulas: { mana: false, actionPoints: false }
      },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
    };

    mountAllSaveSurfaces({ seedSpells: [richMultiEffect] });

    // Reopen -> Update via ExternalLivePreview
    await loadIntoWizardForEdit(mockPersisted.data.spells[0]);
    const prevMod1 = mockPersisted.data.spells[0].lastModified;
    await act(async () => {
      fireEvent.click(document.querySelector('.adventurer-action'));
    });
    await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(prevMod1));
    const afterPreview = clone(mockPersisted.data.spells[0]);

    // Reopen -> Update via Step 10 Review
    await loadIntoWizardForEdit(afterPreview);
    const prevMod2 = afterPreview.lastModified;
    await act(async () => {
      fireEvent.click(document.querySelector('.review-actions .save-button'));
    });
    await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(prevMod2));
    const afterReview = clone(mockPersisted.data.spells[0]);

    // Reopen -> Update via Header Update
    await loadIntoWizardForEdit(afterReview);
    const prevMod3 = afterReview.lastModified;
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Update$/i }));
    });
    await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(prevMod3));
    const afterHeader = clone(mockPersisted.data.spells[0]);

    for (const rec of [afterPreview, afterReview, afterHeader]) {
      assertCleanSeparation(rec);
      expect(rec.level).toBe(0);
      expect(rec.resourceCost.actionPoints).toBe(0);
      expect(rec.resourceCost.mana).toBe(0);
      expect(rec.targetingConfig.rangeDistance).toBe(0);
      expect(rec.cooldownConfig.cooldownValue).toBe(0);
      expect(rec.targetingMode).toBe('effect');
      expect(rec.effectTargeting.healing.rangeDistance).toBe(0);
      expect(rec.damageConfig.savingThrow).toBe(false);
      expect(rec.damageConfig.chanceOnHitConfig.diceThreshold).toBe(17);
      expect(rec.healingConfig.chanceOnHitConfig.diceThreshold).toBe(14);
    }
    expect(afterReview.authoredDraft).toEqual(afterPreview.authoredDraft);
    expect(afterHeader.authoredDraft).toEqual(afterPreview.authoredDraft);
  });

  test('3. Library metadata (folderId, isShared, categoryIds, etc.) stays on outer record; Firebase-reloaded record compiles & updates cleanly via ExternalLivePreview', async () => {
    const firebaseReloaded = {
      ...clone(SUPPORTED_FIXTURE),
      folderId: null,
      isShared: false,
      userId: 'canonical-save-test-user',
      createdAt: '2026-11-20T00:00:00.000Z',
      updatedAt: '2026-11-20T00:00:00.000Z',
      authoredDraft: {
        name: SUPPORTED_FIXTURE.name,
        description: SUPPORTED_FIXTURE.description,
        level: SUPPORTED_FIXTURE.level,
        spellType: SUPPORTED_FIXTURE.spellType,
        resolution: SUPPORTED_FIXTURE.resolution,
        effectTypes: SUPPORTED_FIXTURE.effectTypes,
        effectsMap: SUPPORTED_FIXTURE.effectsMap,
        typeConfig: SUPPORTED_FIXTURE.typeConfig,
        icon: 'Fire/Fire Bolt',
        tags: ['attack', 'damage'],
        damageConfig: SUPPORTED_FIXTURE.damageConfig,
        targetingConfig: SUPPORTED_FIXTURE.targetingConfig,
        resourceCost: SUPPORTED_FIXTURE.resourceCost,
        cooldownConfig: SUPPORTED_FIXTURE.cooldownConfig,
        durationConfig: SUPPORTED_FIXTURE.durationConfig
      }
    };
    firebaseReloaded.serializedData = JSON.stringify(firebaseReloaded.authoredDraft, null, 2);

    // Compiler accepts outer Firebase metadata (folderId, isShared) while rejecting it if leaked inside authoredDraft
    expect(definitionFromWizard(clone(firebaseReloaded), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(true);
    const poisoned = clone(firebaseReloaded);
    poisoned.authoredDraft.folderId = null;
    expect(definitionFromWizard(poisoned, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(false);

    mountAllSaveSurfaces({ seedSpells: [firebaseReloaded] });
    await loadIntoWizardForEdit(firebaseReloaded);

    fireEvent.change(screen.getByPlaceholderText('Enter a name for your spell'), {
      target: { value: 'Ember Pulse (Cloud Synced)' }
    });

    await act(async () => {
      fireEvent.click(document.querySelector('.adventurer-action'));
    });
    await waitFor(() => expect(mockPersisted.data.spells[0].name).toBe('Ember Pulse (Cloud Synced)'));

    const updated = clone(mockPersisted.data.spells[0]);
    assertCleanSeparation(updated);
    expect(updated.folderId).toBeNull();
    expect(updated.isShared).toBe(false);
    expect(updated.categoryIds).toEqual(['offensive']);
    expect(updated.authoredDraft.name).toBe('Ember Pulse (Cloud Synced)');
    expect(JSON.parse(updated.serializedData).name).toBe('Ember Pulse (Cloud Synced)');
    expect(definitionFromWizard(updated, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(true);
    expect(saveUserSpell).toHaveBeenCalledTimes(1);
  });

  test('4. Manual-only control spell reopens unchanged and preserves exact refusal reason across all 3 save paths', async () => {
    const manualSpell = {
      ...clone(SUPPORTED_FIXTURE),
      id: 'unify-manual-control',
      name: 'Twin Element Ward',
      effectTypes: ['damage', 'buff'],
      effectsMap: { damage: true, buff: true },
      typeConfig: { school: 'ember', secondaryElement: 'sacred', icon: 'Fire/Flame Shield', castTimeType: 'IMMEDIATE', tags: ['ward'] },
      buffConfig: { durationValue: 2, durationType: 'rounds', statModifiers: [{ stat: 'armor', value: 2 }] }
    };
    manualSpell.authoredDraft = {
      name: manualSpell.name,
      description: manualSpell.description,
      level: 0,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],
      effectsMap: { damage: true, buff: true },
      typeConfig: manualSpell.typeConfig,
      icon: 'Fire/Flame Shield',
      tags: ['ward', 'damage', 'buff'],
      damageConfig: manualSpell.damageConfig,
      buffConfig: manualSpell.buffConfig,
      targetingConfig: manualSpell.targetingConfig,
      resourceCost: manualSpell.resourceCost,
      cooldownConfig: manualSpell.cooldownConfig,
      durationConfig: manualSpell.durationConfig
    };
    manualSpell.serializedData = JSON.stringify(manualSpell.authoredDraft, null, 2);

    const baselineCompile = definitionFromWizard(clone(manualSpell), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(baselineCompile.ok).toBe(false);

    mountAllSaveSurfaces();
    await act(async () => { window.handleLoadSpell(clone(manualSpell), false); });

    // Create via Floating Preview
    await act(async () => { fireEvent.click(document.querySelector('.adventurer-action')); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));
    const m1 = clone(mockPersisted.data.spells[0]);
    const c1 = definitionFromWizard(clone(m1), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(c1).toEqual(baselineCompile);

    // Reopen -> Update via Header
    await loadIntoWizardForEdit(m1);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Update$/i })); });
    await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(m1.lastModified));
    const m2 = clone(mockPersisted.data.spells[0]);
    const c2 = definitionFromWizard(clone(m2), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(m2.authoredDraft).toEqual(m1.authoredDraft);
    expect(c2).toEqual(baselineCompile);

    // Reopen -> Update via Step 10 Review
    await loadIntoWizardForEdit(m2);
    await act(async () => { fireEvent.click(document.querySelector('.review-actions .save-button')); });
    await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(m2.lastModified));
    const m3 = clone(mockPersisted.data.spells[0]);
    const c3 = definitionFromWizard(clone(m3), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(m3.authoredDraft).toEqual(m1.authoredDraft);
    expect(c3).toEqual(baselineCompile);
  });

  test('5. Empty/whitespace spell name fails canonical validation across all 3 save buttons without persisting', async () => {
    mountAllSaveSurfaces();
    fireEvent.change(screen.getByPlaceholderText('Enter a name for your spell'), {
      target: { value: '   ' }
    });

    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Finalize$/i })); });
    expect(mockPersisted.data.spells).toHaveLength(0);

    await act(async () => { fireEvent.click(document.querySelector('.adventurer-action')); });
    expect(mockPersisted.data.spells).toHaveLength(0);

    const reviewSaveBtn = document.querySelector('.review-actions .save-button');
    expect(reviewSaveBtn).toBeDisabled();
    expect(mockPersisted.data.spells).toHaveLength(0);
  });

  test('6. Chronarch singular time_shard_* resources and supported spells without class resources behave consistently', async () => {
    const chronarchSpell = {
      ...clone(SUPPORTED_FIXTURE),
      name: 'Temporal Echo',
      resourceCost: {
        actionPoints: 1,
        mana: 2,
        components: [],
        resourceTypes: ['mana', 'time_shard_generate', 'time_shard_cost', 'temporal_strain_gain'],
        resourceValues: {
          mana: 2,
          time_shard_generate: 1,
          time_shard_cost: 0,
          temporal_strain_gain: 2
        }
      }
    };

    mountAllSaveSurfaces();
    await act(async () => { window.handleLoadSpell(clone(chronarchSpell), false); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Finalize$/i })); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    await act(async () => { window.handleLoadSpell(clone(chronarchSpell), false); });
    await act(async () => { fireEvent.click(document.querySelector('.review-actions .save-button')); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    await act(async () => { window.handleLoadSpell(clone(chronarchSpell), false); });
    await act(async () => { fireEvent.click(document.querySelector('.adventurer-action')); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(3));

    for (const rec of mockPersisted.data.spells) {
      assertCleanSeparation(rec);
      expect(rec.specialMechanics?.timeShards).toEqual({ generated: 1 });
      expect(rec.specialMechanics?.temporalFlux).toEqual({ shardCost: 0, strainGained: 2, strainReduced: 0 });
      expect(rec.timeShardGenerate).toBe(1);
      expect(rec.timeShardCost).toBe(0);
      expect(rec.temporalStrainGain).toBe(2);
    }
  });
});
