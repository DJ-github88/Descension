/**
 * Canonical Save Contract & Export/Import Round-Trip Verification Suite
 *
 * Proves all three Spell Wizard save triggers:
 *   - Header Finalize / Update (SpellwizardApp.jsx)
 *   - Step 10 Review Save to Library / Update Spell (Step10Review.jsx)
 *   - External Live Preview Complete Spell / Update Spell (ExternalLivePreview.jsx)
 * route through one canonical save contract AND that:
 *   1. Per-effect targets (including targetRestrictions), authored expiry, roll table branches,
 *      and manual options survive all 3 save paths (create & update), export/import (libraryManager,
 *      SpellLibrary UI Export/Import, spellSerializer, IMPORT_LIBRARY fresh & colliding), AND
 *      reopen into the Spell Wizard.
 *   2. Existing approval revisions (approvalRevision, approvedRevision, approvalStatus,
 *      approvalMetadata, approvedAt, approvedBy, approvedHash, approvedDefinitionVersion,
 *      revision, localRevision, confirmedRevision, registryRevision) are preserved across
 *      create, update (all 3 save paths + cloud sync payload), export/import, duplicate,
 *      and reopen without ever contaminating authoredDraft or serializedData — and supported
 *      spells carrying them still compile identically on both client & server authoredAbility.
 *   3. Unsupported abilities remain editable across all 3 save paths, export/import, and reopen,
 *      keep exact refusal reasons, and remain usable as GM reference.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import Step10Review from '../components/steps/Step10Review';
import ExternalLivePreview from '../ExternalLivePreview';
import SpellLibrary from '../components/library/SpellLibrary';
import {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  libraryActionCreators
} from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { definitionFromWizard, EFFECT_CAPABILITY } from '../../../services/authoredAbility';
import { CARD_UNSETTLED_REASON } from '../../../services/randomOutcome';
import { saveUserSpell } from '../../../services/firebase/userSpellService';
import {
  APPROVAL_REVISION_METADATA_KEYS,
  LIBRARY_METADATA_KEYS,
  TRANSIENT_WIZARD_KEYS,
  DERIVED_DISPLAY_KEYS
} from '../utils/canonicalSpellSave';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import { exportLibrary, importLibrary } from '../core/utils/libraryManager';
import {
  serializeSpell,
  deserializeSpell,
  generateGameCode
} from '../core/utils/spellSerializer';

const serverAuthoredAbility = require('../../../../../server/shared/services/authoredAbility');

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
  const state = {
    characters: [],
    currentCharacterId: null,
    activeCharacterId: null,
    currentCharacter: null,
    equipment: {},
    stats: {},
    class_mechanics: {}
  };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  return { __esModule: true, default: useCharacterStore };
});
jest.mock('../../../store/authStore', () => {
  const auth = { user: { uid: 'canonical-roundtrip-user', isGuest: false } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(auth) : auth);
  useAuthStore.getState = () => auth;
  return { __esModule: true, default: useAuthStore };
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const COMPILE_OPTS = {
  roomId: 'room-canonical-roundtrip',
  definitionVersion: 1,
  classId: 'arcanoneer'
};

let latestWizardState = null;
let libraryApi = null;

function Probes() {
  latestWizardState = useSpellWizardState();
  libraryApi = {
    state: useSpellLibrary(),
    dispatch: useSpellLibraryDispatch()
  };
  return null;
}

function seedLibrary(spells = []) {
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-23T00:00:00.000Z',
    data: {
      categories: [
        { id: 'uncategorized', name: 'Uncategorized', spellIds: [] },
        { id: 'favorites', name: 'Favorites', spellIds: [] },
        { id: 'offensive', name: 'Offensive', spellIds: [] }
      ],
      spells: spells.map(clone),
      collections: [],
      selectedSpell: null
    }
  };
}

function mountAllThreeSaveSurfaces({ seedSpells = [], includeLibrary = false } = {}) {
  seedLibrary(seedSpells);
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });

  return render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <SpellwizardApp hideHeader={true} />
          <Step10Review stepNumber={10} totalSteps={10} isActive={true} onNext={() => {}} onPrevious={() => {}} />
          <ExternalLivePreview />
          {includeLibrary && <SpellLibrary />}
          <Probes />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
}

async function loadIntoWizard(record, isEditing) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => {
    window.handleLoadSpell(clone(record), isEditing);
  });
  await waitFor(() => expect(latestWizardState?.name).toBe(record.name));
  if (isEditing) {
    await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeTruthy());
  }
}

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function triggerSave(surface) {
  if (surface === 'header') {
    const btn = document.querySelector('.app-control-btn.finalize-btn');
    expect(btn).toBeTruthy();
    await act(async () => { fireEvent.click(btn); });
    return;
  }
  if (surface === 'review') {
    const btn = document.querySelector('.review-actions .save-button');
    expect(btn).toBeTruthy();
    expect(btn).not.toBeDisabled();
    await act(async () => { fireEvent.click(btn); });
    return;
  }
  if (surface === 'preview') {
    const btn = document.querySelector('.adventurer-action');
    expect(btn).toBeTruthy();
    await act(async () => { fireEvent.click(btn); });
    return;
  }
  throw new Error(`Unknown save surface: ${surface}`);
}

async function saveCreateVia(surface, fixture) {
  await loadIntoWizard(fixture, false);
  const prevCount = mockPersisted.data.spells.length;
  await triggerSave(surface);
  await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(prevCount + 1));
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

async function saveUpdateVia(surface, record) {
  await loadIntoWizard(record, true);
  const prevMod = record.lastModified;
  await new Promise((resolve) => setTimeout(resolve, 5));
  await triggerSave(surface);
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === record.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevMod);
  });
  return clone(mockPersisted.data.spells.find((s) => s.id === record.id));
}

function assertCanonicalSeparation(record) {
  expect(record.authoredDraft).toBeTruthy();
  expect(typeof record.serializedData).toBe('string');
  const parsed = JSON.parse(record.serializedData);
  expect(parsed).toEqual(record.authoredDraft);

  const forbiddenDraftKeys = [
    ...LIBRARY_METADATA_KEYS,
    ...APPROVAL_REVISION_METADATA_KEYS,
    ...TRANSIENT_WIZARD_KEYS,
    ...DERIVED_DISPLAY_KEYS,
    'authoredDraft',
    'serializedData'
  ];
  for (const key of forbiddenDraftKeys) {
    expect(Object.prototype.hasOwnProperty.call(record.authoredDraft, key)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, key)).toBe(false);
  }
  for (const key of TRANSIENT_WIZARD_KEYS) {
    expect(Object.prototype.hasOwnProperty.call(record, key)).toBe(false);
  }
}

const APPROVAL_META = {
  approvalRevision: 4,
  approvedRevision: 3,
  approvalStatus: 'approved',
  approvalMetadata: {
    reviewer: 'gm-auditor',
    note: 'Approved for room combat table',
    tags: ['v3', 'verified']
  },
  approvalHistory: [
    { revision: 1, status: 'submitted' },
    { revision: 3, status: 'approved' }
  ],
  approvedAt: '2026-11-22T15:30:00.000Z',
  approvedBy: 'gm-uid-42',
  approvedHash: 'b'.repeat(64),
  approvedDefinitionVersion: 3,
  definitionVersion: 4,
  revision: 4,
  localRevision: 4,
  confirmedRevision: 3,
  registryRevision: 9
};

function makePerEffectManualFixture() {
  return {
    id: 'fixture-per-effect-manual',
    name: 'Split Ember and Balm',
    description: 'Scorches one enemy at 45 ft while touching an ally or self to heal.',
    level: 2,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage', 'healing'],
    effectsMap: { damage: true, healing: true },
    typeConfig: {
      school: 'ember',
      icon: 'Fire/Flame Burst',
      castTimeType: 'MANUAL',
      tags: ['split', 'manual-timing']
    },
    damageConfig: {
      damageType: 'direct',
      formula: '2d6 + 1',
      elementType: 'ember',
      damageTypes: ['ember'],
      resolution: 'DICE',
      savingThrow: false
    },
    healingConfig: {
      healingType: 'direct',
      formula: '1d8',
      resolution: 'DICE'
    },
    effectResolutions: {
      damage: 'DICE',
      healing: 'MANUAL'
    },
    targetingMode: 'effect',
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['any'],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: 'circle',
      aoeType: 'sphere',
      aoeParameters: {},
      movementBehavior: 'static'
    },
    effectTargeting: {
      damage: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 45,
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        aoeShape: '',
        aoeParameters: {},
        movementBehavior: 'static'
      },
      healing: {
        targetingType: 'single',
        rangeType: 'touch',
        rangeDistance: 0,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        aoeShape: '',
        aoeParameters: {},
        movementBehavior: 'static'
      }
    },
    resourceCost: {
      actionPoints: 1,
      actionPointsSelected: true,
      mana: 2,
      components: ['verbal', 'somatic', 'material'],
      verbalText: 'Ignis et Salve',
      somaticText: 'Part hands toward foe and ally',
      materialText: 'A pinch of warm ash',
      materialComponents: 'warm_ash',
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: 2, actionPoints: 1 },
      resourceFormulas: {},
      useFormulas: { mana: false, actionPoints: false }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    manualOptions: { gmAdjudication: 'Confirm sightline for both targets.' },
    gmNotes: 'GM tracks split-target positioning manually.',
    authoredDefinitionId: '1111aaaa-1111-4111-8111-111111111111',
    categoryIds: ['favorites', 'offensive'],
    categories: ['all'],
    source: 'wizard',
    isCustom: true,
    dateCreated: '2026-11-20T00:00:00.000Z',
    lastModified: '2026-11-20T00:00:00.000Z',
    ...clone(APPROVAL_META)
  };
}

function makeAuthoredExpiryFixture(expiryVariant = 'counted') {
  const conditionByVariant = {
    counted: {
      profile: EFFECT_CAPABILITY,
      effect: 'periodic',
      periodicKind: 'damage',
      periodicFormula: '1d6',
      periodicDamageType: 'ember',
      tickRoll: 'each-tick',
      expiryPolicy: 'target-start-count',
      occurrences: 3,
      label: 'Cinder Burn',
      durationText: 'For 3 starts of the target turn',
      gmNote: 'GM confirms each periodic tick roll.'
    },
    nextEndWithSave: {
      profile: EFFECT_CAPABILITY,
      effect: 'movement',
      movementFeet: -15,
      label: 'Rime Bind',
      expiryPolicy: 'target-next-end',
      durationText: "Until the end of the target's next turn",
      gmNote: 'GM records table constitution save result.',
      save: { ability: 'constitution', dc: 14, outcome: 'negates' }
    },
    gmManual: {
      profile: EFFECT_CAPABILITY,
      effect: 'stunned',
      expiryPolicy: 'gm-manual',
      durationText: 'Until cleared by GM ruling',
      gmNote: 'GM removes this exact instance manually.'
    }
  };

  const school = expiryVariant === 'nextEndWithSave' ? 'rime' : 'ember';
  const condition = conditionByVariant[expiryVariant];

  return {
    id: `fixture-authored-expiry-${expiryVariant}`,
    name: `Expiry Spell ${expiryVariant}`,
    description: 'Tests authored expiry preservation across all save paths.',
    level: 2,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    effectsMap: { damage: true, control: true },
    typeConfig: {
      school,
      icon: 'Fire/Fire Bolt',
      castTimeType: 'IMMEDIATE',
      tags: ['expiry']
    },
    damageConfig: {
      damageType: 'direct',
      formula: '2d6',
      elementType: school,
      damageTypes: [school],
      resolution: 'DICE'
    },
    controlConfig: {
      authoredCondition: condition
    },
    effectResolutions: {
      damage: 'DICE',
      control: 'MANUAL'
    },
    targetingMode: 'unified',
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
      mana: 2,
      components: [],
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: 2, actionPoints: 1 },
      resourceFormulas: {},
      useFormulas: { mana: false, actionPoints: false }
    },
    cooldownConfig: expiryVariant === 'counted'
      ? { cooldownType: 'authenticated_caster_start', cooldownValue: 2 }
      : { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    authoredDefinitionId: '2222bbbb-2222-4222-8222-222222222222',
    categoryIds: ['favorites', 'offensive'],
    categories: ['all'],
    folderId: 'folder-authored-1',
    isShared: true,
    userId: 'canonical-roundtrip-user',
    createdAt: '2026-11-20T00:00:00.000Z',
    source: 'wizard',
    isCustom: true,
    dateCreated: '2026-11-20T00:00:00.000Z',
    lastModified: '2026-11-20T00:00:00.000Z',
    ...clone(APPROVAL_META)
  };
}

function makeRollTableFixture(resolutionType = 'DICE') {
  const isCards = resolutionType === 'CARDS';
  const entries = isCards
    ? [
        {
          id: 'branch-red',
          name: 'Crimson Surge',
          description: 'Deals ember damage on red draw.',
          cardPattern: 'Red Cards',
          effectType: 'damage',
          effectConfig: { damageFormula: '2d6', damageType: 'ember' }
        },
        {
          id: 'branch-black',
          name: 'Umbral Mending',
          description: 'Restores health on black draw.',
          cardPattern: 'Black Cards',
          effectType: 'healing',
          effectConfig: { healingFormula: '1d8+2' }
        }
      ]
    : [
        {
          id: 'branch-low',
          range: { min: 1, max: 2 },
          name: 'Ember Spark',
          description: 'Light burn on 1-2.',
          effectType: 'damage',
          effectConfig: { damageFormula: '1d6', damageType: 'ember' }
        },
        {
          id: 'branch-mid',
          range: { min: 3, max: 4 },
          name: 'Mending Flare',
          description: 'Restores HP on 3-4.',
          effectType: 'healing',
          effectConfig: { healingFormula: '1d8' }
        },
        {
          id: 'branch-high',
          range: { min: 5, max: 6 },
          name: 'Solar Burst',
          description: 'Heavy ember blast on 5-6.',
          effectType: 'damage',
          effectConfig: { damageFormula: '2d8+1', damageType: 'ember' }
        }
      ];

  return {
    id: `fixture-rolltable-${resolutionType.toLowerCase()}`,
    name: isCards ? 'Arcane Tarot Draw' : 'Tri-Branch Fate Die',
    description: 'Resolves one of several authored roll table branches.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: [],
    effectsMap: {},
    typeConfig: {
      school: 'ember',
      icon: 'inv_misc_ticket_tarot_01',
      castTimeType: 'IMMEDIATE',
      tags: ['outcome-table']
    },
    rollableTable: {
      enabled: true,
      name: isCards ? 'Tarot Outcomes' : 'Fate Die Branches',
      description: 'Authored multi-branch rollable table.',
      resolutionType,
      resolutionConfig: isCards
        ? { cardCount: 1, deckType: 'standard' }
        : { diceType: 'd6' },
      entries
    },
    effectResolutions: {},
    targetingMode: 'unified',
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
      mana: 1,
      components: [],
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: 1, actionPoints: 1 },
      resourceFormulas: {},
      useFormulas: { mana: false, actionPoints: false }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    authoredDefinitionId: '3333cccc-3333-4333-8333-333333333333',
    categoryIds: ['utility'],
    categories: ['all'],
    source: 'wizard',
    isCustom: true,
    dateCreated: '2026-11-20T00:00:00.000Z',
    lastModified: '2026-11-20T00:00:00.000Z',
    ...clone(APPROVAL_META)
  };
}

beforeEach(() => {
  mockPersisted = null;
  latestWizardState = null;
  libraryApi = null;
  saveUserSpell.mockClear();
  window.alert = jest.fn();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Canonical Save Contract & Export/Import Round-Trip', () => {
  jest.setTimeout(35000);

  test('1. Per-effect targets (including restrictions) & manual options survive ALL THREE save paths, export/import, serializer, and reopen into Wizard', async () => {
    const fixture = makePerEffectManualFixture();
    mountAllThreeSaveSurfaces();

    const createdHeader = await saveCreateVia('header', fixture);
    const createdReview = await saveCreateVia('review', fixture);
    const createdPreview = await saveCreateVia('preview', fixture);

    // All 3 save paths produce identical authoredDraft & serializedData
    expect(createdReview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(createdPreview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(JSON.parse(createdReview.serializedData)).toEqual(JSON.parse(createdHeader.serializedData));
    expect(JSON.parse(createdPreview.serializedData)).toEqual(JSON.parse(createdHeader.serializedData));

    const baselineCompile = definitionFromWizard(clone(createdHeader), COMPILE_OPTS);
    const baselinePlan = explainExecution(clone(createdHeader), COMPILE_OPTS);
    expect(baselineCompile.ok).toBe(false);
    expect(baselinePlan.state).toBe(STATES.UNSUPPORTED);

    for (const rec of [createdHeader, createdReview, createdPreview]) {
      assertCanonicalSeparation(rec);
      expect(rec.targetingMode).toBe('effect');
      expect(rec.effectTargeting.damage.rangeDistance).toBe(45);
      expect(rec.effectTargeting.damage.targetRestrictions).toEqual(['enemy']);
      expect(rec.effectTargeting.healing.rangeType).toBe('touch');
      expect(rec.effectTargeting.healing.rangeDistance).toBe(0);
      expect(rec.effectTargeting.healing.targetRestrictions).toEqual(['ally', 'self']);
      expect(rec.typeConfig.castTimeType).toBe('MANUAL');
      expect(rec.effectResolutions).toEqual({ damage: 'DICE', healing: 'MANUAL' });
      expect(rec.resourceCost.components).toEqual(['verbal', 'somatic', 'material']);
      expect(rec.resourceCost.verbalText).toBe('Ignis et Salve');
      expect(rec.resourceCost.materialText).toBe('A pinch of warm ash');
      expect(rec.manualOptions).toEqual({ gmAdjudication: 'Confirm sightline for both targets.' });
      expect(rec.gmNotes).toBe('GM tracks split-target positioning manually.');
      expect(rec.approvalRevision).toBe(4);
      expect(rec.approvedRevision).toBe(3);
      expect(definitionFromWizard(clone(rec), COMPILE_OPTS)).toEqual(baselineCompile);
    }

    // Serializer + gameCode round-trip preserves effectTargeting & approvalRevision
    const serialized = serializeSpell(createdHeader);
    const deserialized = deserializeSpell(serialized);
    expect(deserialized.effectTargeting).toEqual(createdHeader.effectTargeting);
    expect(deserialized.approvalRevision).toBe(4);
    expect(deserialized.approvedRevision).toBe(3);

    const gameCode = JSON.parse(generateGameCode(createdHeader));
    expect(gameCode.targeting.mode).toBe('effect');
    expect(gameCode.targeting.effectTargets.damage.targetRestrictions).toEqual(['enemy']);
    expect(gameCode.targeting.effectTargets.healing.targetRestrictions).toEqual(['ally', 'self']);
    expect(gameCode.effects.damage.targeting.rangeDistance).toBe(45);
    expect(gameCode.effects.healing.targeting.rangeDistance).toBe(0);
    expect(gameCode.approvalRevision).toBe(4);

    // Export -> Import into a fresh library (with explicit 'favorites' category preserved) & verify reopen into Wizard UI + Update across all 3 paths
    const favoritedHeader = {
      ...clone(createdHeader),
      categoryIds: ['favorites', 'offensive']
    };
    const exportedJson = exportLibrary({ spells: [favoritedHeader], categories: libraryApi.state.categories }, 'json');
    const importedLib = importLibrary(exportedJson);
    expect(importedLib).toBeTruthy();
    expect(importedLib.spells).toHaveLength(1);

    cleanup();
    mountAllThreeSaveSurfaces();
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary(importedLib));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const reimported = clone(mockPersisted.data.spells[0]);
    expect(reimported.effectTargeting).toEqual(createdHeader.effectTargeting);
    expect(reimported.manualOptions).toEqual(createdHeader.manualOptions);
    expect(reimported.gmNotes).toBe(createdHeader.gmNotes);
    expect(reimported.approvalRevision).toBe(4);
    expect(reimported.approvedRevision).toBe(3);
    expect(reimported.categoryIds).toEqual(['favorites', 'offensive']);

    // Reopen imported spell into Spell Wizard and inspect Step 4 UI + edit description + update via all 3 buttons
    await loadIntoWizard(reimported, true);
    await clickStep('Targeting');
    await waitFor(() => {
      expect(document.querySelector('.effect-selector-item.selected')?.textContent).toMatch(/Damage/i);
    });
    expect(Number(document.querySelector('input[type="range"]').value)).toBe(45);
    expect(document.querySelector('.targeting-selected-summary')?.textContent).toContain('Enemies');

    const healingSelector = screen.getByText('Healing', { selector: '.effect-selector-name' }).closest('.effect-selector-item');
    await act(async () => { fireEvent.click(healingSelector); });
    await waitFor(() => expect(healingSelector).toHaveClass('selected'));
    const healingSummary = document.querySelector('.targeting-selected-summary')?.textContent || '';
    expect(healingSummary).toContain('Allies');
    expect(healingSummary).toContain('Self');

    const afterHeaderUpdate = await saveUpdateVia('header', reimported);
    const afterReviewUpdate = await saveUpdateVia('review', afterHeaderUpdate);
    const afterPreviewUpdate = await saveUpdateVia('preview', afterReviewUpdate);

    for (const updated of [afterHeaderUpdate, afterReviewUpdate, afterPreviewUpdate]) {
      assertCanonicalSeparation(updated);
      expect(updated.id).toBe(reimported.id);
      expect(updated.effectTargeting).toEqual(createdHeader.effectTargeting);
      expect(updated.typeConfig.castTimeType).toBe('MANUAL');
      expect(updated.effectResolutions).toEqual({ damage: 'DICE', healing: 'MANUAL' });
      expect(updated.manualOptions).toEqual(createdHeader.manualOptions);
      expect(updated.approvalRevision).toBe(4);
      expect(updated.approvedRevision).toBe(3);
      expect(updated.authoredDraft).toEqual(createdHeader.authoredDraft);
      expect(definitionFromWizard(clone(updated), COMPILE_OPTS)).toEqual(baselineCompile);
      expect(explainExecution(clone(updated), COMPILE_OPTS).state).toBe(STATES.UNSUPPORTED);
    }
  });

  test.each([
    ['counted target-start-count periodic expiry', 'counted'],
    ['target-next-end movement rider with negates save', 'nextEndWithSave'],
    ['gm-manual stunned expiry', 'gmManual']
  ])('2. Authored expiry (%s) survives ALL THREE save paths, export/import, reopen, and compiles identically on client & server', async (_label, variant) => {
    const fixture = makeAuthoredExpiryFixture(variant);
    mountAllThreeSaveSurfaces();

    const createdHeader = await saveCreateVia('header', fixture);
    const createdReview = await saveCreateVia('review', fixture);
    const createdPreview = await saveCreateVia('preview', fixture);

    expect(createdReview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(createdPreview.authoredDraft).toEqual(createdHeader.authoredDraft);

    const expectedClientCompile = definitionFromWizard(clone(createdHeader), COMPILE_OPTS);
    const expectedServerCompile = serverAuthoredAbility.definitionFromWizard(clone(createdHeader), COMPILE_OPTS);
    expect(expectedClientCompile.ok).toBe(true);
    expect(expectedServerCompile).toEqual(expectedClientCompile);

    // Export -> Import -> Reopen -> Update via all 3 paths
    const exportedJson = exportLibrary({ spells: [createdHeader], categories: libraryApi.state.categories }, 'json');
    const importedLib = importLibrary(exportedJson);

    cleanup();
    mountAllThreeSaveSurfaces();
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary(importedLib));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const reimported = clone(mockPersisted.data.spells[0]);
    const uHeader = await saveUpdateVia('header', reimported);
    const uReview = await saveUpdateVia('review', uHeader);
    const uPreview = await saveUpdateVia('preview', uReview);

    for (const rec of [createdHeader, createdReview, createdPreview, reimported, uHeader, uReview, uPreview]) {
      assertCanonicalSeparation(rec);
      expect(rec.controlConfig.authoredCondition).toEqual(fixture.controlConfig.authoredCondition);
      expect(rec.approvalRevision).toBe(4);
      expect(rec.approvedRevision).toBe(3);

      const clientCompiled = definitionFromWizard(clone(rec), COMPILE_OPTS);
      const serverCompiled = serverAuthoredAbility.definitionFromWizard(clone(rec), COMPILE_OPTS);
      expect(clientCompiled).toEqual(expectedClientCompile);
      expect(serverCompiled).toEqual(expectedClientCompile);
      expect(clientCompiled.definition.timing.expiryPolicy).toBe(fixture.controlConfig.authoredCondition.expiryPolicy);
      expect(clientCompiled.definition.timing.durationText).toBe(fixture.controlConfig.authoredCondition.durationText);
      expect(clientCompiled.definition.timing.gmNote).toBe(fixture.controlConfig.authoredCondition.gmNote);
      if (variant === 'counted') {
        expect(clientCompiled.definition.timing.occurrences).toBe(3);
      }
      if (variant === 'nextEndWithSave') {
        expect(clientCompiled.definition.effects.save).toEqual({
          scope: 'condition',
          ability: 'constitution',
          dc: 14,
          outcome: 'negates'
        });
      }
    }
  });

  test.each([
    ['supported DICE 3-branch roll table', 'DICE', true],
    ['manual CARDS roll table (GM reference)', 'CARDS', false]
  ])('3. Roll table branches (%s) survive ALL THREE save paths, export/import, and reopen into Wizard', async (_label, resolutionType, shouldCompile) => {
    const fixture = makeRollTableFixture(resolutionType);
    mountAllThreeSaveSurfaces();

    const createdHeader = await saveCreateVia('header', fixture);
    const createdReview = await saveCreateVia('review', fixture);
    const createdPreview = await saveCreateVia('preview', fixture);

    expect(createdReview.authoredDraft).toEqual(createdHeader.authoredDraft);
    expect(createdPreview.authoredDraft).toEqual(createdHeader.authoredDraft);

    const baselineCompile = definitionFromWizard(clone(createdHeader), COMPILE_OPTS);
    expect(baselineCompile.ok).toBe(shouldCompile);
    if (shouldCompile) {
      expect(baselineCompile.definition.outcomeTable.branches).toHaveLength(3);
    } else {
      expect(baselineCompile.reason).toBe(CARD_UNSETTLED_REASON);
      expect(explainExecution(clone(createdHeader), COMPILE_OPTS).state).toBe(STATES.UNSUPPORTED);
    }

    // Export -> Import -> Reopen into Wizard -> verify Rollable Table step & update across all 3 paths
    const exportedJson = exportLibrary({ spells: [createdHeader], categories: libraryApi.state.categories }, 'json');
    const importedLib = importLibrary(exportedJson);

    cleanup();
    mountAllThreeSaveSurfaces();
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary(importedLib));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const reimported = clone(mockPersisted.data.spells[0]);
    await loadIntoWizard(reimported, true);
    expect(latestWizardState.rollableTable).toEqual(fixture.rollableTable);

    const uHeader = await saveUpdateVia('header', reimported);
    const uReview = await saveUpdateVia('review', uHeader);
    const uPreview = await saveUpdateVia('preview', uReview);

    for (const rec of [createdHeader, createdReview, createdPreview, reimported, uHeader, uReview, uPreview]) {
      assertCanonicalSeparation(rec);
      expect(rec.rollableTable).toEqual(fixture.rollableTable);
      expect(rec.rollableTable.entries).toHaveLength(fixture.rollableTable.entries.length);
      expect(definitionFromWizard(clone(rec), COMPILE_OPTS)).toEqual(baselineCompile);
      expect(serverAuthoredAbility.definitionFromWizard(clone(rec), COMPILE_OPTS)).toEqual(baselineCompile);
    }
  });

  test('4. Existing approval revisions and outer metadata survive create, update (all 3 paths + cloud payload), single/library export/import (fresh & colliding), duplicate, and reopen while staying out of authoredDraft', async () => {
    const fixture = makeAuthoredExpiryFixture('counted');
    mountAllThreeSaveSurfaces();

    // Create via all 3 save triggers
    const cHeader = await saveCreateVia('header', fixture);
    const cReview = await saveCreateVia('review', fixture);
    const cPreview = await saveCreateVia('preview', fixture);

    for (const rec of [cHeader, cReview, cPreview]) {
      assertCanonicalSeparation(rec);
      for (const [k, v] of Object.entries(APPROVAL_META)) {
        expect(rec[k]).toEqual(v);
      }
      expect(definitionFromWizard(clone(rec), COMPILE_OPTS).ok).toBe(true);

      // Poisoning authoredDraft with approvalRevision MUST still be rejected by definitionFromWizard
      const poisoned = clone(rec);
      poisoned.authoredDraft.approvalRevision = 4;
      expect(definitionFromWizard(poisoned, COMPILE_OPTS).ok).toBe(false);
    }

    // Seed an existing cloud-synced library spell with approval revisions + folderId/isShared/favorites,
    // then Reopen -> Edit -> Update across all 3 save triggers and inspect cloud sync payloads too
    const existingCloudSpell = {
      ...clone(cHeader),
      folderId: 'folder-authored-1',
      isShared: true,
      userId: 'canonical-roundtrip-user',
      createdAt: '2026-11-20T00:00:00.000Z',
      categoryIds: ['favorites', 'offensive']
    };
    cleanup();
    mountAllThreeSaveSurfaces({ seedSpells: [existingCloudSpell] });

    saveUserSpell.mockClear();
    const u1 = await saveUpdateVia('header', existingCloudSpell);
    const u2 = await saveUpdateVia('review', u1);
    const u3 = await saveUpdateVia('preview', u2);

    expect(saveUserSpell).toHaveBeenCalledTimes(3);
    for (const call of saveUserSpell.mock.calls) {
      const cloudSpell = call[1];
      assertCanonicalSeparation(cloudSpell);
      for (const [k, v] of Object.entries(APPROVAL_META)) {
        expect(cloudSpell[k]).toEqual(v);
      }
      expect(cloudSpell.folderId).toBe('folder-authored-1');
      expect(cloudSpell.isShared).toBe(true);
      expect(cloudSpell.categoryIds).toEqual(['favorites', 'offensive']);
    }

    // Export -> Import colliding onto existing library + Import single serialized spell JSON
    const exportedEnvelope = exportLibrary({ spells: [u3], categories: libraryApi.state.categories }, 'json');
    const importedFromEnvelope = importLibrary(exportedEnvelope);
    expect(importedFromEnvelope.spells[0].approvalRevision).toBe(4);
    expect(importedFromEnvelope.spells[0].approvedRevision).toBe(3);
    expect(importedFromEnvelope.spells[0].categoryIds).toEqual(['favorites', 'offensive']);

    // Single spell serialized JSON also imports cleanly through importLibrary
    const singleSpellJson = serializeSpell(u3);
    const importedFromSingle = importLibrary(singleSpellJson);
    expect(importedFromSingle).toBeTruthy();
    expect(importedFromSingle.spells).toHaveLength(1);
    expect(importedFromSingle.spells[0].approvalRevision).toBe(4);
    expect(importedFromSingle.spells[0].approvedRevision).toBe(3);

    // Colliding IMPORT_LIBRARY preserves approval revisions & compiles cleanly
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary(importedFromEnvelope));
    });
    const collidedCopy = mockPersisted.data.spells.find((s) => s.name === `${u3.name} (Imported)`);
    expect(collidedCopy).toBeTruthy();
    expect(collidedCopy.id).not.toBe(u3.id);
    expect(collidedCopy.authoredDefinitionId).toBe(u3.authoredDefinitionId);
    for (const [k, v] of Object.entries(APPROVAL_META)) {
      expect(collidedCopy[k]).toEqual(v);
    }
    assertCanonicalSeparation(collidedCopy);
    expect(definitionFromWizard(clone(collidedCopy), COMPILE_OPTS).ok).toBe(true);

    // DUPLICATE_SPELL preserves approval revisions as deep clones
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.duplicateSpell(u3.id));
    });
    const dupCopy = mockPersisted.data.spells.find((s) => s.name === `${u3.name} (Copy)`);
    expect(dupCopy).toBeTruthy();
    for (const [k, v] of Object.entries(APPROVAL_META)) {
      expect(dupCopy[k]).toEqual(v);
    }
    expect(dupCopy.approvalMetadata).not.toBe(u3.approvalMetadata);
    expect(definitionFromWizard(clone(dupCopy), COMPILE_OPTS).ok).toBe(true);

    // Reopen collided imported copy into Wizard: approvalRevision stays loaded in Wizard state & survives Update
    await loadIntoWizard(collidedCopy, true);
    expect(latestWizardState.approvalRevision).toBe(4);
    expect(latestWizardState.approvedRevision).toBe(3);
    const updatedCollided = await saveUpdateVia('preview', collidedCopy);
    for (const [k, v] of Object.entries(APPROVAL_META)) {
      expect(updatedCollided[k]).toEqual(v);
    }
    assertCanonicalSeparation(updatedCollided);
    expect(definitionFromWizard(clone(updatedCollided), COMPILE_OPTS).ok).toBe(true);
  });

  test('5. SpellLibrary UI Export & Import round-trip preserves supported & unsupported GM-reference spells with all fields and approval revisions', async () => {
    const perEffectManual = makePerEffectManualFixture();
    const expirySupported = makeAuthoredExpiryFixture('counted');
    const cardRollTable = makeRollTableFixture('CARDS');

    // Produce canonical records first
    mountAllThreeSaveSurfaces();
    const saved1 = await saveCreateVia('header', perEffectManual);
    const saved2 = await saveCreateVia('review', expirySupported);
    const saved3 = await saveCreateVia('preview', cardRollTable);
    cleanup();

    // Capture Export JSON from real SpellLibrary UI (`spellLibraryExport` event -> handleExport)
    let capturedBlob = null;
    const origCreateObjectURL = URL.createObjectURL;
    const origRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn((blob) => {
      capturedBlob = blob;
      return 'blob:mock-spell-export';
    });
    URL.revokeObjectURL = jest.fn();

    const origCreateElement = document.createElement.bind(document);
    let capturedFileInput = null;
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const el = origCreateElement(tagName, options);
      if (String(tagName).toLowerCase() === 'a') {
        el.click = jest.fn();
      }
      if (String(tagName).toLowerCase() === 'input') {
        el.click = jest.fn();
        capturedFileInput = el;
      }
      return el;
    });

    try {
      const saved2Favorited = {
        ...clone(saved2),
        categoryIds: ['favorites', 'offensive']
      };
      seedLibrary([saved1, saved2Favorited, saved3]);
      render(
        <SpellLibraryProvider>
          <SpellLibrary />
        </SpellLibraryProvider>
      );

      // Export button in SpellLibrary compact header
      const exportBtn = await screen.findByRole('button', { name: /Export/i });
      await act(async () => { fireEvent.click(exportBtn); });
      expect(capturedBlob).toBeTruthy();

      const exportedText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(capturedBlob);
      });

      const parsedExport = JSON.parse(exportedText);
      expect(parsedExport.version).toBe(1);
      expect(parsedExport.data.spells).toHaveLength(3);
      cleanup();

      // Mount a fresh empty SpellLibrary + Wizard and click Import with the exported file
      mountAllThreeSaveSurfaces({ seedSpells: [], includeLibrary: true });
      const importBtn = await screen.findByRole('button', { name: /Import/i });
      await act(async () => { fireEvent.click(importBtn); });
      expect(capturedFileInput).toBeTruthy();

      const mockFile = new File([exportedText], 'spell-library.json', { type: 'application/json' });
      await act(async () => {
        Object.defineProperty(capturedFileInput, 'files', { value: [mockFile], configurable: true });
        capturedFileInput.onchange({ target: { files: [mockFile] } });
      });

      await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(3));

      const imported1 = mockPersisted.data.spells.find((s) => s.id === saved1.id);
      const imported2 = mockPersisted.data.spells.find((s) => s.id === saved2.id);
      const imported3 = mockPersisted.data.spells.find((s) => s.id === saved3.id);

      expect(imported1.effectTargeting).toEqual(saved1.effectTargeting);
      expect(imported1.manualOptions).toEqual(saved1.manualOptions);
      expect(imported1.approvalRevision).toBe(4);
      expect(imported2.controlConfig.authoredCondition).toEqual(saved2.controlConfig.authoredCondition);
      expect(imported2.approvalRevision).toBe(4);
      expect(imported2.categoryIds).toEqual(['favorites', 'offensive']);
      expect(imported3.rollableTable).toEqual(saved3.rollableTable);
      expect(imported3.approvalRevision).toBe(4);

      // Unsupported abilities remain visible in SpellLibrary as GM reference & editable via reopen
      expect(await screen.findByText('Split Ember and Balm')).toBeInTheDocument();
      expect(await screen.findByText('Arcane Tarot Draw')).toBeInTheDocument();

      await loadIntoWizard(imported3, true);
      expect(latestWizardState.rollableTable.resolutionType).toBe('CARDS');
      expect(latestWizardState.rollableTable.entries).toHaveLength(2);
      expect(latestWizardState.approvalRevision).toBe(4);

      // Edit unsupported GM-reference ability and save via Step 10 Review
      fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
        target: { value: 'Updated GM reference note for tarot draw.' }
      });
      await triggerSave('review');
      await waitFor(() => {
        const updated = mockPersisted.data.spells.find((s) => s.id === imported3.id);
        expect(updated.description).toBe('Updated GM reference note for tarot draw.');
      });
      const editedCardSpell = mockPersisted.data.spells.find((s) => s.id === imported3.id);
      expect(editedCardSpell.rollableTable.entries).toEqual(saved3.rollableTable.entries);
      expect(editedCardSpell.approvalRevision).toBe(4);
      expect(definitionFromWizard(clone(editedCardSpell), COMPILE_OPTS).reason).toBe(CARD_UNSETTLED_REASON);
    } finally {
      createElementSpy.mockRestore();
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
    }
  });
});
