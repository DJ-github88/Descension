/**
 * Spell Library IMPORT_LIBRARY ID-Collision Identity Regression Suite
 *
 * Contract under test:
 *   - Importing the same playable spell twice (ID collision on IMPORT_LIBRARY):
 *       1. Leaves the original library record untouched in state and persisted storage.
 *       2. Gives the colliding copy a new unique library id, deep-cloned nested objects, and
 *          synchronized name / authoredDraft.name / serializedData ("<Name> (Imported)").
 *       3. Keeps authoredDefinitionId intact (so cooldown identity is never silently reset).
 *       4. Both records remain admittable in AuthoredAdmission and compile via definitionFromWizard
 *          to the exact same combat rules apart from identity (name).
 *       5. Reopening the renamed copy in SpellwizardApp loads the renamed identity (not stale
 *          original name) and updating/saving keeps both the original untouched and combat parity.
 *   - Same-batch ID collisions ([spell, spell] in a single IMPORT_LIBRARY payload) yield unique
 *     IDs, aligned draft/serialized names, and independent clones.
 *   - Manual-only spells (unsupported secondaryElement, Card Draw rollableTable, legacy record
 *     without authoredDraft) preserve their exact refusal reason when copied via colliding
 *     IMPORT_LIBRARY or DUPLICATE_SPELL.
 *   - Catalogue-bound records (catalogueSource) keep their pinned name/draft/projection on
 *     colliding IMPORT_LIBRARY while still receiving a new unique library id and deep clone.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import AuthoredAdmission from '../components/library/AuthoredAdmission';
import {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  libraryActionCreators
} from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import useGameStore from '../../../store/gameStore';
import { definitionFromWizard, EFFECT_CAPABILITY } from '../../../services/authoredAbility';
import { CARD_UNSETTLED_REASON } from '../../../services/randomOutcome';
import { CLASS_DATA_MAP } from '../../../data/classSpellGenerator';
import { catalogueDraft } from '../../../services/catalogueAbility.cjs';
import { buildCanonicalSpellRecord } from '../utils/canonicalSpellSave';
import { explainExecution, draftSubject, STATES } from '../utils/executionCompatibility';

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
  const auth = { user: { uid: 'import-identity-test-user', isGuest: true } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(auth) : auth);
  useAuthStore.getState = () => auth;
  return { __esModule: true, default: useAuthStore };
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const COMPILE_OPTS = {
  roomId: 'room-import-test',
  definitionVersion: 1,
  classId: 'arcanoneer'
};
const COMPAT_CTX = {
  ...COMPILE_OPTS,
  shared: true,
  gm: true
};

let libraryApi = null;
let latestWizardState = null;

function Probes() {
  libraryApi = {
    state: useSpellLibrary(),
    dispatch: useSpellLibraryDispatch()
  };
  latestWizardState = useSpellWizardState();
  return null;
}

function mountLibraryAndWizard() {
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-20T00:00:00.000Z',
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: [],
      collections: [],
      selectedSpell: null
    }
  };
  return render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <SpellwizardApp hideHeader={true} />
          <Probes />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
}

function buildImmediateDamageExport() {
  return buildCanonicalSpellRecord({
    wizardState: {
      name: 'Ember Bolt',
      description: 'Hurls a focused shard of ember at one enemy.',
      level: 1,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      typeConfig: { school: 'ember', icon: 'Fire/Fire Bolt', castTimeType: 'IMMEDIATE', tags: ['ember'] },
      damageConfig: { damageType: 'direct', formula: '2d6 + 2', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
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
      authoredDefinitionId: 'aaaa1111-1111-4111-8111-111111111111',
      categoryIds: ['offensive'],
      categories: ['all'],
      source: 'wizard',
      isCustom: true
    },
    now: '2026-11-20T00:00:00.000Z'
  });
}

function buildPeriodicCooldownExport() {
  return buildCanonicalSpellRecord({
    wizardState: {
      name: 'Solar Flare',
      description: 'Immediate ember blast, lingering cinders, and an authenticated caster cooldown.',
      level: 3,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage', 'control'],
      effectsMap: { damage: true, control: true },
      typeConfig: { school: 'ember', icon: 'spell_fire_fireball', castTimeType: 'IMMEDIATE', tags: ['ember', 'periodic'] },
      damageConfig: { damageType: 'direct', formula: '2d8 + spirit/3', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
      controlConfig: {
        authoredCondition: {
          profile: EFFECT_CAPABILITY,
          effect: 'periodic',
          periodicKind: 'damage',
          periodicFormula: '1d6',
          periodicDamageType: 'ember',
          tickRoll: 'each-tick',
          expiryPolicy: 'target-start-count',
          occurrences: 3,
          label: 'Cinders',
          durationText: 'While the cinders burn',
          gmNote: 'GM confirms line of sight.'
        }
      },
      effectResolutions: { control: 'MANUAL', damage: 'DICE' },
      cooldownConfig: { cooldownType: 'authenticated_caster_start', cooldownValue: 2 },
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
        mana: 3,
        components: [],
        resourceTypes: ['mana', 'actionPoints'],
        resourceValues: { mana: 3, actionPoints: 1 },
        resourceFormulas: {},
        useFormulas: { mana: false, actionPoints: false }
      },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'bbbb2222-2222-4222-8222-222222222222',
      categoryIds: ['offensive'],
      categories: ['all'],
      source: 'wizard',
      isCustom: true
    },
    now: '2026-11-20T00:00:00.000Z'
  });
}

function buildManualSecondaryElementExport() {
  return buildCanonicalSpellRecord({
    wizardState: {
      name: 'Twin Element Ward',
      description: 'Manual spell combining two schools and a buff.',
      level: 1,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage', 'buff'],
      effectsMap: { damage: true, buff: true },
      typeConfig: { school: 'ember', secondaryElement: 'sacred', icon: 'Fire/Flame Shield', castTimeType: 'IMMEDIATE', tags: ['ward'] },
      damageConfig: { damageType: 'direct', formula: '2d6', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
      buffConfig: { durationValue: 2, durationType: 'rounds', statModifiers: [{ stat: 'armor', value: 2 }] },
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
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'cccc3333-3333-4333-8333-333333333333',
      categoryIds: ['defensive'],
      categories: ['all'],
      source: 'wizard',
      isCustom: true
    },
    now: '2026-11-20T00:00:00.000Z'
  });
}

function buildManualCardDrawExport() {
  return buildCanonicalSpellRecord({
    wizardState: {
      name: 'Deck of Omens',
      description: 'Draws a card for flame or ward.',
      level: 2,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: [],
      effectsMap: {},
      typeConfig: { school: 'arcane', icon: 'inv_misc_ticket_tarot_01', castTimeType: 'IMMEDIATE', tags: ['cards'] },
      rollableTable: {
        enabled: true,
        name: 'Omen Draw',
        resolutionType: 'CARDS',
        resolutionConfig: { cardCount: 1 },
        entries: [
          { id: 'c1', name: 'Crimson Flare', cardPattern: 'Red', effectType: 'damage', effectConfig: { damageFormula: '2d6', damageType: 'ember' } },
          { id: 'c2', name: 'Velvet Ward', cardPattern: 'Black', effectType: 'healing', effectConfig: { healingFormula: '1d8' } }
        ]
      },
      effectResolutions: {},
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
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'dddd4444-4444-4444-8444-444444444444',
      categoryIds: ['utility'],
      categories: ['all'],
      source: 'wizard',
      isCustom: true
    },
    now: '2026-11-20T00:00:00.000Z'
  });
}

function buildLegacyManualWithoutDraft() {
  return {
    id: 'legacy-no-draft-1',
    name: 'Old Table Hex',
    description: 'Legacy record saved before authoredDraft existed.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['debuff'],
    categoryIds: ['offensive'],
    dateCreated: '2026-10-01T00:00:00.000Z',
    lastModified: '2026-10-01T00:00:00.000Z'
  };
}

function stripIdentityFromDefinition(definition) {
  const copy = clone(definition);
  delete copy.name;
  return copy;
}

beforeEach(() => {
  mockPersisted = null;
  libraryApi = null;
  latestWizardState = null;
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
  useGameStore.setState({ isGMMode: false, isInMultiplayer: false, multiplayerRoom: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
  useGameStore.setState({ isGMMode: false, isInMultiplayer: false, multiplayerRoom: null });
});

describe('Spell Library IMPORT_LIBRARY ID-collision identity', () => {
  jest.setTimeout(30000);

  test.each([
    ['immediate damage playable spell', buildImmediateDamageExport, STATES.EXECUTABLE],
    ['composed immediate + periodic + caster-start cooldown playable spell', buildPeriodicCooldownExport, STATES.PARTIAL]
  ])('%s: importing twice leaves original untouched, keeps copy admittable, reopens renamed copy cleanly, and preserves identical combat rules', async (_label, buildExport, expectedCompatState) => {
    mountLibraryAndWizard();
    const exportedPayload = buildExport();

    // First import: establishes the original record in the library.
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(exportedPayload)],
        categories: []
      }));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const original = clone(libraryApi.state.spells[0]);
    const originalSnapshot = clone(original);
    expect(original.id).toBe(exportedPayload.id);
    const origCompiled = definitionFromWizard(clone(original), COMPILE_OPTS);
    expect(origCompiled.ok).toBe(true);

    // Second import of the same exported payload: collides on original.id.
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(exportedPayload)],
        categories: []
      }));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    expect(libraryApi.state.spells).toHaveLength(2);
    const originalAfter = libraryApi.state.spells.find((s) => s.id === original.id);
    expect(originalAfter).toEqual(originalSnapshot);
    expect(mockPersisted.data.spells.find((s) => s.id === original.id)).toEqual(originalSnapshot);

    const renamedCopy = libraryApi.state.spells.find((s) => s.id !== original.id);
    expect(renamedCopy).toBeTruthy();
    expect(renamedCopy.id).not.toBe(original.id);
    expect(renamedCopy.name).toBe(`${original.name} (Imported)`);
    expect(renamedCopy.authoredDraft.name).toBe(renamedCopy.name);
    expect(JSON.parse(renamedCopy.serializedData).name).toBe(renamedCopy.name);
    expect(renamedCopy.authoredDefinitionId).toBe(original.authoredDefinitionId);

    // Reference isolation between original and colliding imported copy.
    expect(renamedCopy.authoredDraft).not.toBe(originalAfter.authoredDraft);
    expect(renamedCopy.damageConfig).not.toBe(originalAfter.damageConfig);
    expect(renamedCopy.targetingConfig).not.toBe(originalAfter.targetingConfig);
    expect(renamedCopy.resourceCost).not.toBe(originalAfter.resourceCost);

    // Combat compilation parity apart from identity (name).
    const copyCompiled = definitionFromWizard(clone(renamedCopy), COMPILE_OPTS);
    expect(copyCompiled.ok).toBe(true);
    expect(copyCompiled.definition.name).toBe(`${original.name} (Imported)`);
    expect(stripIdentityFromDefinition(copyCompiled.definition)).toEqual(
      stripIdentityFromDefinition(origCompiled.definition)
    );

    const origPlan = explainExecution(clone(originalAfter), COMPAT_CTX);
    const copyPlan = explainExecution(clone(renamedCopy), COMPAT_CTX);
    expect(origPlan.state).toBe(expectedCompatState);
    expect(copyPlan.state).toBe(expectedCompatState);
    expect(copyPlan.automated).toEqual(origPlan.automated);
    expect(copyPlan.manual).toEqual(origPlan.manual);

    // AuthoredAdmission keeps "Admit this saved version" enabled for the renamed copy.
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: COMPILE_OPTS.roomId } });
    const admissionView = render(<AuthoredAdmission spell={clone(renamedCopy)} />);
    expect(screen.getByRole('button', { name: 'Admit this saved version' })).toBeEnabled();
    admissionView.unmount();
    useGameStore.setState({ isGMMode: false, isInMultiplayer: false, multiplayerRoom: null });

    // Reopen the renamed copy in SpellwizardApp: Wizard loads renamed identity, not stale original name.
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => {
      window.handleLoadSpell(clone(renamedCopy), true);
    });
    await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeTruthy());
    await waitFor(() => expect(latestWizardState?.editingSpellId).toBe(renamedCopy.id));

    expect(latestWizardState.name).toBe(renamedCopy.name);
    expect(latestWizardState.editMode).toBe(true);
    expect(latestWizardState.editingSpellId).toBe(renamedCopy.id);
    expect(latestWizardState.authoredDefinitionId).toBe(original.authoredDefinitionId);

    const reopenedSubjectCompiled = definitionFromWizard(draftSubject(latestWizardState), COMPILE_OPTS);
    expect(reopenedSubjectCompiled.ok).toBe(true);
    expect(reopenedSubjectCompiled.definition.name).toBe(renamedCopy.name);
    expect(stripIdentityFromDefinition(reopenedSubjectCompiled.definition)).toEqual(
      stripIdentityFromDefinition(origCompiled.definition)
    );

    // Save/Update the reopened copy and verify original stays untouched + combat rules still match.
    const prevModified = renamedCopy.lastModified;
    await new Promise((resolve) => setTimeout(resolve, 5));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Update$/i }));
    });
    await waitFor(() => {
      const persistedCopy = mockPersisted.data.spells.find((s) => s.id === renamedCopy.id);
      expect(persistedCopy).toBeTruthy();
      expect(persistedCopy.lastModified).not.toBe(prevModified);
    });

    expect(mockPersisted.data.spells).toHaveLength(2);
    expect(mockPersisted.data.spells.find((s) => s.id === original.id)).toEqual(originalSnapshot);
    expect(libraryApi.state.spells.find((s) => s.id === original.id)).toEqual(originalSnapshot);

    const updatedCopy = clone(mockPersisted.data.spells.find((s) => s.id === renamedCopy.id));
    expect(updatedCopy.id).toBe(renamedCopy.id);
    expect(updatedCopy.name).toBe(renamedCopy.name);
    expect(updatedCopy.authoredDraft.name).toBe(renamedCopy.name);
    expect(JSON.parse(updatedCopy.serializedData).name).toBe(renamedCopy.name);

    const updatedCompiled = definitionFromWizard(clone(updatedCopy), COMPILE_OPTS);
    expect(updatedCompiled.ok).toBe(true);
    expect(updatedCompiled.definition.name).toBe(renamedCopy.name);
    expect(stripIdentityFromDefinition(updatedCompiled.definition)).toEqual(
      stripIdentityFromDefinition(origCompiled.definition)
    );
  });

  test('same-batch duplicate ID collision in one IMPORT_LIBRARY call produces distinct IDs, aligned draft names, and combat parity', async () => {
    mountLibraryAndWizard();
    const exportedPayload = buildImmediateDamageExport();
    const origCompiled = definitionFromWizard(clone(exportedPayload), COMPILE_OPTS);
    expect(origCompiled.ok).toBe(true);

    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(exportedPayload), clone(exportedPayload)],
        categories: []
      }));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    const [first, second] = libraryApi.state.spells;
    expect(first.id).toBe(exportedPayload.id);
    expect(first.name).toBe(exportedPayload.name);
    expect(second.id).not.toBe(first.id);
    expect(second.name).toBe(`${exportedPayload.name} (Imported)`);
    expect(second.authoredDraft.name).toBe(second.name);
    expect(JSON.parse(second.serializedData).name).toBe(second.name);
    expect(second.authoredDraft).not.toBe(first.authoredDraft);
    expect(second.damageConfig).not.toBe(first.damageConfig);

    const firstCompiled = definitionFromWizard(clone(first), COMPILE_OPTS);
    const secondCompiled = definitionFromWizard(clone(second), COMPILE_OPTS);
    expect(firstCompiled.ok).toBe(true);
    expect(secondCompiled.ok).toBe(true);
    expect(stripIdentityFromDefinition(secondCompiled.definition)).toEqual(
      stripIdentityFromDefinition(firstCompiled.definition)
    );
  });

  test.each([
    ['manual secondaryElement spell', buildManualSecondaryElementExport, /secondaryElement/i, true],
    ['manual Card Draw rollableTable spell', buildManualCardDrawExport, new RegExp(CARD_UNSETTLED_REASON.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), true],
    ['legacy manual spell without authoredDraft', buildLegacyManualWithoutDraft, /Whole Wizard draft unavailable/i, false]
  ])('%s keeps its exact refusal reason when copied via colliding IMPORT_LIBRARY or DUPLICATE_SPELL', async (_label, buildManual, reasonPattern, hasDraft) => {
    mountLibraryAndWizard();
    const exportedManual = buildManual();
    const baseline = definitionFromWizard(clone(exportedManual), COMPILE_OPTS);
    const baselinePlan = explainExecution(clone(exportedManual), COMPAT_CTX);
    expect(baseline.ok).toBe(false);
    expect(baseline.reason).toMatch(reasonPattern);
    expect(baseline.reason).not.toMatch(/library\/draft name/i);
    expect(baselinePlan.state).toBe(STATES.UNSUPPORTED);

    // 1. Import once, then import again with colliding ID.
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(exportedManual)],
        categories: []
      }));
    });
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(exportedManual)],
        categories: []
      }));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    const original = libraryApi.state.spells.find((s) => s.id === exportedManual.id);
    const importedCopy = libraryApi.state.spells.find((s) => s.id !== exportedManual.id);
    expect(importedCopy.name).toBe(`${exportedManual.name} (Imported)`);

    // 2. Also copy via DUPLICATE_SPELL.
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.duplicateSpell(original.id));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(3));
    const duplicatedCopy = libraryApi.state.spells.find((s) => s.name === `${exportedManual.name} (Copy)`);
    expect(duplicatedCopy).toBeTruthy();

    for (const copy of [importedCopy, duplicatedCopy]) {
      expect(definitionFromWizard(clone(copy), COMPILE_OPTS)).toEqual(baseline);
      const copyPlan = explainExecution(clone(copy), COMPAT_CTX);
      expect(copyPlan.state).toBe(STATES.UNSUPPORTED);
      expect(copyPlan.reasons).toEqual(baselinePlan.reasons);

      if (hasDraft) {
        expect(copy.authoredDraft.name).toBe(copy.name);
        expect(JSON.parse(copy.serializedData).name).toBe(copy.name);
        useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: COMPILE_OPTS.roomId } });
        const admissionView = render(<AuthoredAdmission spell={clone(copy)} />);
        expect(screen.getByRole('button', { name: 'Admit this saved version' })).toBeDisabled();
        admissionView.unmount();
        useGameStore.setState({ isGMMode: false, isInMultiplayer: false, multiplayerRoom: null });
      } else {
        expect(copy.authoredDraft).toBeUndefined();
      }
    }
  });

  test('catalogue-bound spell on colliding IMPORT_LIBRARY keeps pinned projection name while receiving a new unique id and deep clone', async () => {
    mountLibraryAndWizard();
    const martyrPrayer = CLASS_DATA_MAP.Martyr.spells.find((s) => s.id === 'martyr_restorative_prayer');
    const prepared = catalogueDraft(martyrPrayer, 'martyr', {
      authoredDefinitionId: 'eeee5555-5555-4555-8555-555555555555',
      id: 'catalogue-martyr-import-1'
    });
    expect(prepared.ok).toBe(true);
    const catalogueExport = clone(prepared.draft);
    const martyrCompileOpts = { roomId: 'room-import-test', definitionVersion: 1, classId: 'martyr' };
    const baseline = definitionFromWizard(clone(catalogueExport), martyrCompileOpts);
    expect(baseline.ok).toBe(true);

    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(catalogueExport)],
        categories: []
      }));
    });
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(catalogueExport)],
        categories: []
      }));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    const original = libraryApi.state.spells.find((s) => s.id === catalogueExport.id);
    const importedCopy = libraryApi.state.spells.find((s) => s.id !== catalogueExport.id);

    expect(importedCopy).toBeTruthy();
    expect(importedCopy.id).not.toBe(original.id);
    expect(importedCopy.name).toBe(original.name);
    expect(importedCopy.authoredDraft.name).toBe(original.authoredDraft.name);
    expect(importedCopy.serializedData).toBe(original.serializedData);
    expect(importedCopy.catalogueSource).toEqual(original.catalogueSource);
    expect(importedCopy.catalogueSource).not.toBe(original.catalogueSource);
    expect(importedCopy.authoredDefinitionId).toBe(original.authoredDefinitionId);

    const copyCompiled = definitionFromWizard(clone(importedCopy), martyrCompileOpts);
    expect(copyCompiled).toEqual(baseline);
  });
});
