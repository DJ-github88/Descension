/**
 * Per-Effect Target Restrictions Round-Trip Preservation Suite
 *
 * Regression test for Step4Targeting.jsx per-effect `targetRestrictions` fallback:
 *   - Selecting Single Target on an unconfigured effect in `targetingMode: 'effect'`
 *     must default to `['any']` (never invalid plural `['enemies']`), so choosing
 *     Enemies or Allies stores clean singular IDs (`['enemy']`, `['ally']`) without
 *     leaking `'enemies'` across Save -> Reopen -> Edit -> Update -> Duplicate.
 *   - Untouched draft parts remain strictly equal after reopening and editing one part.
 *   - Supported unified-targeting control compiles with identical mechanics; unsupported
 *     per-effect variant retains authored intent and identical manual refusal reason.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  libraryActionCreators
} from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { explainExecution, STATES } from '../utils/executionCompatibility';

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
  loadUserSpells: () => Promise.resolve([])
}));
jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: () => 'test-icon.png',
  getAbilityIconUrl: () => 'test-icon.png',
  getCustomIconUrl: () => 'fallback-icon.png',
  getCreatureTokenIconUrl: () => 'test-icon.png'
}));
jest.mock('../../../utils/dialogService', () => ({
  showConfirm: jest.fn(),
  showAlert: () => Promise.resolve(true),
  showPrompt: () => Promise.resolve(null)
}));
jest.mock('../../../store/characterStore', () => {
  const state = { characters: [], currentCharacterId: null, activeCharacterId: null, currentCharacter: null };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  return { __esModule: true, default: useCharacterStore };
});
jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: { uid: 'per-effect-targeting-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const COMPILE_OPTS = {
  roomId: 'room-per-effect-audit',
  definitionVersion: 1,
  classId: 'arcanoneer',
  allowProposedAreaRoll: false
};

let libraryApi = null;

function Probes() {
  const libState = useSpellLibrary();
  const libDispatch = useSpellLibraryDispatch();
  libraryApi = { state: libState, dispatch: libDispatch };
  return null;
}

const seedEmpty = (spells = []) => {
  mockPersisted = {
    version: 1,
    lastSaved: '2026-11-22T00:00:00.000Z',
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: spells.map(clone),
      collections: [],
      selectedSpell: null
    }
  };
};

const mountWizard = () => render(
  <CreatureLibraryProvider>
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellwizardApp hideHeader={true} />
        <Probes />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  </CreatureLibraryProvider>
);

function summarizeCombat(record) {
  const compiled = definitionFromWizard(clone(record), COMPILE_OPTS);
  const plan = explainExecution(clone(record), COMPILE_OPTS);
  return {
    compiled,
    planState: plan.state,
    planReasons: plan.reasons
  };
}

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function fillBasicInfo({ name, description, elementLabel, tagLabel }) {
  const nameInput = screen.getByPlaceholderText('Enter a name for your spell');
  const descInput = screen.getByPlaceholderText('Describe what your spell does and how it appears');
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(descInput, { target: { value: description } });
  });
  if (elementLabel) {
    const elBtn = screen.getByText(elementLabel, { selector: '.element-name' });
    await act(async () => { fireEvent.click(elBtn); });
  }
  if (tagLabel) {
    const tagEl = screen.getByText(tagLabel, { selector: '.spell-wizard-tag' });
    await act(async () => { fireEvent.click(tagEl); });
  }
}

async function configureImmediateActionType() {
  await clickStep('Spell Type');
  const timingSelect = document.getElementById('authoredActionTiming') || await (async () => {
    const actionCard = await screen.findByText(/^ACTION$/i, { selector: '.spell-type-title' });
    await act(async () => { fireEvent.click(actionCard); });
    return await screen.findByLabelText(/Action timing/i);
  })();
  await act(async () => { fireEvent.change(timingSelect, { target: { value: 'IMMEDIATE' } }); });
}

async function selectEffectCard(titleText) {
  const cardTitle = screen.getByText(titleText, { selector: '.selection-card-title, h4, h3, span, div' });
  await act(async () => { fireEvent.click(cardTitle); });
}

async function switchEffectTab(tabName) {
  const tabs = Array.from(document.querySelectorAll('.effect-type-tab'));
  const target = tabs.find((el) => new RegExp(tabName, 'i').test(el.textContent || ''));
  expect(target).toBeTruthy();
  await act(async () => { fireEvent.click(target); });
}

async function setResourceCostInput(cardTitle, headerRegex, value) {
  let block = Array.from(document.querySelectorAll('.resource-cost-config'))
    .find((el) => headerRegex.test(el.querySelector('.resource-type-name')?.textContent || ''));
  if (!block) {
    const card = await screen.findByText(cardTitle, { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(card); });
    await waitFor(() => {
      block = Array.from(document.querySelectorAll('.resource-cost-config'))
        .find((el) => headerRegex.test(el.querySelector('.resource-type-name')?.textContent || ''));
      expect(block).toBeTruthy();
    });
  }
  const input = block.querySelector('input.resource-input');
  expect(input).toBeTruthy();
  await act(async () => { fireEvent.change(input, { target: { value: String(value) } }); });
}

async function finalizeNewSpell() {
  const prevCount = mockPersisted.data.spells.length;
  const finalizeBtn = screen.getByRole('button', { name: /^Finalize$/i });
  await act(async () => { fireEvent.click(finalizeBtn); });
  await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

async function loadIntoWizardForEdit(record) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => { window.handleLoadSpell(clone(record), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeTruthy());
}

async function clickHeaderUpdateAndWait(savedRecord) {
  const prevModified = savedRecord.lastModified;
  await new Promise((resolve) => setTimeout(resolve, 5));
  const updateBtn = screen.getByRole('button', { name: /^Update$/i });
  await act(async () => { fireEvent.click(updateBtn); });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === savedRecord.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });
  return clone(mockPersisted.data.spells.find((s) => s.id === savedRecord.id));
}

async function clickReviewUpdateAndWait(savedRecord) {
  const prevModified = savedRecord.lastModified;
  await new Promise((resolve) => setTimeout(resolve, 5));
  const updateBtn = await screen.findByRole('button', { name: /^Update Spell$/i });
  await act(async () => { fireEvent.click(updateBtn); });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === savedRecord.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });
  return clone(mockPersisted.data.spells.find((s) => s.id === savedRecord.id));
}

beforeEach(() => {
  mockPersisted = null;
  libraryApi = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Per-Effect Target Restrictions Round-Trip Preservation', () => {
  jest.setTimeout(30000);

  test('1. unsupported per-effect targeting (Strike and Mend): preserves clean singular targetRestrictions across Save, Reopen, single-part Edit, Review Update, and Duplicate while keeping untouched draft parts equal and manual refusal reason unchanged', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Strike and Mend',
      description: 'Scorches one enemy at range while mending one ally by touch.',
      elementLabel: 'Ember'
    });
    await configureImmediateActionType();

    await clickStep('Effects');
    await selectEffectCard('Damage');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d8' } });
    });
    await selectEffectCard('Healing');
    await switchEffectTab('Healing');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Healing formula'), { target: { value: '1d6' } });
    });

    // Unified global baseline (Single Target, Ranged, 30 ft)
    await clickStep('Targeting');
    await act(async () => {
      fireEvent.click(await screen.findByText('Single Target', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(await screen.findByText('Ranged', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.change(document.querySelector('input[type="range"]'), { target: { value: '30' } });
    });

    // Switch to Effect-Specific Targeting
    await act(async () => {
      fireEvent.click(await screen.findByText('Effect-Specific Targeting'));
    });

    // Damage (auto-selected): Single Target, Ranged, 45 ft, Enemies
    await waitFor(() => {
      expect(document.querySelector('.effect-selector-item.selected')?.textContent).toMatch(/Damage/i);
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.change(document.querySelector('input[type="range"]'), { target: { value: '45' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Enemies', { selector: '.targeting-option-name' }));
    });
    const damageSummaryText = document.querySelector('.targeting-selected-summary')?.textContent || '';

    // Healing: Single Target, Touch, Allies
    const healingSelector = screen.getByText('Healing', { selector: '.effect-selector-name' }).closest('.effect-selector-item');
    await act(async () => { fireEvent.click(healingSelector); });
    await waitFor(() => expect(healingSelector).toHaveClass('selected'));
    await act(async () => {
      fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Touch', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Allies', { selector: '.targeting-option-name' }));
    });
    const healingSummaryText = document.querySelector('.targeting-selected-summary')?.textContent || '';

    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    // Save via Header Finalize
    const saved = await finalizeNewSpell();
    const combatBefore = summarizeCombat(saved);

    // Reopen -> Targeting -> edit ONLY Damage range 45 -> 60 -> Header Update
    await loadIntoWizardForEdit(saved);
    await clickStep('Targeting');
    const selectedOnReopen = document.querySelector('.effect-selector-item.selected');
    expect(selectedOnReopen?.textContent).toMatch(/Damage/i);
    await waitFor(() => {
      const slider = document.querySelector('input[type="range"]');
      expect(slider).toBeTruthy();
      expect(Number(slider.value)).toBe(45);
    });
    const reopenSlider = document.querySelector('input[type="range"]');
    await act(async () => {
      fireEvent.change(reopenSlider, { target: { value: '60' } });
    });
    const updated = await clickHeaderUpdateAndWait(saved);
    const combatAfter = summarizeCombat(updated);

    // Reopen -> Step 10 Review -> Update Spell
    await loadIntoWizardForEdit(updated);
    await clickStep('Review');
    const updatedReview = await clickReviewUpdateAndWait(updated);
    const combatAfterReview = summarizeCombat(updatedReview);

    // Duplicate via DUPLICATE_SPELL
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.duplicateSpell(updatedReview.id));
    });
    const duplicated = clone(mockPersisted.data.spells.find((s) => s.name === 'Strike and Mend (Copy)'));
    expect(duplicated).toBeTruthy();
    const combatDuplicate = summarizeCombat(duplicated);

    // UI summary assertions (no stray leading comma from unresolved 'enemies' id)
    expect(damageSummaryText).toContain('Enemies');
    expect(damageSummaryText).not.toMatch(/Selected Targets:\s*,/);
    expect(healingSummaryText).toContain('Allies');
    expect(healingSummaryText).not.toMatch(/Selected Targets:\s*,/);

    // Saved record assertions
    expect(saved.targetingMode).toBe('effect');
    expect(saved.effectTargeting.damage.targetRestrictions).toEqual(['enemy']);
    expect(saved.effectTargeting.healing.targetRestrictions).toEqual(['ally']);
    expect(saved.authoredDraft.effectTargeting.damage.targetRestrictions).toEqual(['enemy']);
    expect(saved.authoredDraft.effectTargeting.healing.targetRestrictions).toEqual(['ally']);
    expect(JSON.parse(saved.serializedData)).toEqual(saved.authoredDraft);
    expect(combatBefore.compiled.ok).toBe(false);
    expect(combatBefore.planState).toBe(STATES.UNSUPPORTED);

    // Reopen + single-part edit preserves all untouched parts equally
    expect(updated.effectTargeting.damage.rangeDistance).toBe(60);
    expect(updated.effectTargeting.damage.targetRestrictions).toEqual(['enemy']);
    const normalizedUpdatedDraft = clone(updated.authoredDraft);
    normalizedUpdatedDraft.effectTargeting.damage.rangeDistance = 45;
    expect(normalizedUpdatedDraft).toEqual(saved.authoredDraft);
    expect(JSON.parse(updated.serializedData)).toEqual(updated.authoredDraft);
    expect(combatAfter.compiled).toEqual(combatBefore.compiled);
    expect(combatAfter.planState).toBe(STATES.UNSUPPORTED);
    expect(combatAfter.planReasons).toEqual(combatBefore.planReasons);

    // Review save parity & refusal reason preservation
    expect(updatedReview.authoredDraft).toEqual(updated.authoredDraft);
    expect(JSON.parse(updatedReview.serializedData)).toEqual(updatedReview.authoredDraft);
    expect(combatAfterReview.compiled).toEqual(combatBefore.compiled);
    expect(combatAfterReview.planState).toBe(STATES.UNSUPPORTED);
    expect(combatAfterReview.planReasons).toEqual(combatBefore.planReasons);

    // Duplicate preservation
    expect(duplicated.id).not.toBe(updatedReview.id);
    expect(duplicated.authoredDefinitionId).toBe(updatedReview.authoredDefinitionId);
    expect(duplicated.effectTargeting.damage.targetRestrictions).toEqual(['enemy']);
    expect(duplicated.effectTargeting.healing.targetRestrictions).toEqual(['ally']);
    const normalizedDuplicateDraft = clone(duplicated.authoredDraft);
    normalizedDuplicateDraft.name = updatedReview.authoredDraft.name;
    expect(normalizedDuplicateDraft).toEqual(updatedReview.authoredDraft);
    expect(combatDuplicate.compiled).toEqual(combatBefore.compiled);
    expect(combatDuplicate.planState).toBe(STATES.UNSUPPORTED);
    expect(combatDuplicate.planReasons).toEqual(combatBefore.planReasons);
  });

  test('2. reopen and edit configuring an unconfigured effect in effect mode preserves clean targetRestrictions and leaves existing effect untouched', async () => {
    const seededDraft = {
      name: 'Partial Effect Draft',
      description: 'Damage configured first; healing configured on reopen.',
      level: 1,
      school: '',
      icon: 'Fire/Fire Bolt',
      spellType: 'ACTION',
      typeConfig: {
        icon: 'Fire/Fire Bolt',
        school: 'ember',
        tags: [],
        castTimeType: 'IMMEDIATE'
      },
      effectTypes: ['damage', 'healing'],
      effectsMap: { damage: true, healing: true },
      damageConfig: {
        formula: '1d8',
        damageType: 'direct',
        elementType: 'ember',
        resolution: 'DICE',
        savingThrow: null
      },
      healingConfig: {
        formula: '1d6',
        healingType: 'direct',
        resolution: 'DICE'
      },
      buffConfig: null,
      debuffConfig: null,
      utilityConfig: null,
      controlConfig: null,
      summoningConfig: null,
      transformationConfig: null,
      purificationConfig: null,
      restorationConfig: null,
      rollableTable: null,
      effectResolutions: {},
      effectMechanicsConfigs: {},
      mechanicsAvailableEffects: [],
      combinedEffects: [],
      mechanicsAvailableCombinedEffects: [],
      targetingConfig: {
        rangeType: 'ranged',
        rangeDistance: 30,
        targetingType: 'single',
        maxTargets: 1,
        selectionMethod: 'manual',
        aoeShape: 'circle',
        aoeParameters: {},
        movementBehavior: 'static',
        targetSelectionMethod: 'manual',
        targetRestrictions: ['any'],
        aoeType: 'sphere'
      },
      targetingMode: 'effect',
      targetingTags: {},
      effectTargeting: {
        damage: {
          targetingType: 'single',
          maxTargets: 1,
          selectionMethod: 'manual',
          aoeShape: '',
          aoeParameters: {},
          rangeType: 'ranged',
          rangeDistance: 45,
          movementBehavior: 'static',
          targetRestrictions: ['enemy'],
          targetSelectionMethod: 'manual'
        }
      },
      durationConfig: {},
      persistentConfig: {},
      propagation: null,
      resourceCost: {
        components: [],
        materialComponents: '',
        actionPoints: 1,
        actionPointsSelected: true,
        resourceTypes: ['actionPoints', 'mana'],
        resourceValues: { actionPoints: 1, mana: 0 },
        resourceFormulas: {},
        useFormulas: {},
        primaryResourceType: 'actionPoints'
      },
      mechanicsConfig: {
        cards: null,
        combos: null,
        coins: null,
        stateRequirements: [],
        stateOptions: { thresholds: [] }
      },
      prophecyOptions: null,
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      triggerConfig: {},
      trapConfig: {},
      channelingConfig: {},
      tags: ['damage', 'healing']
    };
    const seeded = {
      ...clone(seededDraft),
      effectType: 'damage',
      damageTypes: ['ember'],
      source: 'wizard',
      isCustom: true,
      id: 'partial-effect-draft-1',
      authoredDefinitionId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      categoryIds: ['offensive'],
      categories: ['all'],
      dateCreated: '2026-11-22T00:00:00.000Z',
      lastModified: '2026-11-22T00:00:00.000Z',
      lastSaved: '2026-11-22T00:00:00.000Z',
      authoredDraft: clone(seededDraft),
      serializedData: JSON.stringify(seededDraft, null, 2)
    };

    seedEmpty([seeded]);
    mountWizard();
    const combatBefore = summarizeCombat(seeded);
    expect(combatBefore.compiled.ok).toBe(false);
    expect(combatBefore.planState).toBe(STATES.UNSUPPORTED);

    await loadIntoWizardForEdit(seeded);
    await clickStep('Targeting');

    const healingSelector = screen.getByText('Healing', { selector: '.effect-selector-name' }).closest('.effect-selector-item');
    await act(async () => { fireEvent.click(healingSelector); });
    await waitFor(() => expect(healingSelector).toHaveClass('selected'));

    await act(async () => {
      fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Touch', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Allies', { selector: '.targeting-option-name' }));
    });
    const healingSummaryText = document.querySelector('.targeting-selected-summary')?.textContent || '';

    const updated = await clickHeaderUpdateAndWait(seeded);
    const combatAfter = summarizeCombat(updated);

    expect(healingSummaryText).toContain('Allies');
    expect(healingSummaryText).not.toMatch(/Selected Targets:\s*,/);
    expect(updated.effectTargeting.healing.targetRestrictions).toEqual(['ally']);
    expect(updated.effectTargeting.healing.rangeType).toBe('touch');
    expect(updated.effectTargeting.healing.rangeDistance).toBe(5);
    expect(updated.effectTargeting.damage).toEqual(seeded.effectTargeting.damage);

    // Every untouched authoredDraft field remains strictly equal
    const normalizedAfterDraft = clone(updated.authoredDraft);
    delete normalizedAfterDraft.effectTargeting.healing;
    expect(normalizedAfterDraft).toEqual(seeded.authoredDraft);
    expect(JSON.parse(updated.serializedData)).toEqual(updated.authoredDraft);

    expect(combatAfter.compiled).toEqual(combatBefore.compiled);
    expect(combatAfter.planState).toBe(STATES.UNSUPPORTED);
    expect(combatAfter.planReasons).toEqual(combatBefore.planReasons);
  });

  test('3. supported unified-targeting variant (Ember Bolt): compiles with identical mechanics and keeps untouched draft parts equal across Save, Reopen+Edit, and Duplicate', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Ember Bolt',
      description: 'Hurls a focused shard of ember at one enemy.',
      elementLabel: 'Ember',
      tagLabel: 'Attack'
    });
    await configureImmediateActionType();

    await clickStep('Effects');
    await selectEffectCard('Damage');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '2d6 + 1' } });
    });

    await clickStep('Targeting');
    await act(async () => {
      fireEvent.click(await screen.findByText('Single Target', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.click(await screen.findByText('Ranged', { selector: '.targeting-option-name' }));
    });
    await act(async () => {
      fireEvent.change(document.querySelector('input[type="range"]'), { target: { value: '30' } });
    });
    await act(async () => {
      fireEvent.click(await screen.findByText('Enemies', { selector: '.targeting-option-name' }));
    });

    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    await clickStep('Cooldown');
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: /No Cooldown/i }));
    });

    const saved = await finalizeNewSpell();
    const combatBefore = summarizeCombat(saved);

    await loadIntoWizardForEdit(saved);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
        target: { value: 'Hurls a brighter shard of ember at one enemy.' }
      });
    });
    const updated = await clickHeaderUpdateAndWait(saved);
    const combatAfter = summarizeCombat(updated);

    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.duplicateSpell(updated.id));
    });
    const duplicated = clone(mockPersisted.data.spells.find((s) => s.name === 'Ember Bolt (Copy)'));
    expect(duplicated).toBeTruthy();
    const combatDuplicate = summarizeCombat(duplicated);

    expect(combatBefore.compiled.ok).toBe(true);
    expect(combatBefore.planState).toBe(STATES.EXECUTABLE);
    expect(combatBefore.compiled.definition.targeting).toEqual({
      kind: 'single',
      maxTargets: 1,
      rangeFeet: 30,
      restriction: 'enemy'
    });
    expect(combatBefore.compiled.definition.resourceCost).toEqual({ actionPoints: 1, mana: 0 });
    expect(combatBefore.compiled.definition.effect.formula).toBe('2d6 + 1');

    // Untouched draft parts remain equal
    const normalizedAfterDraft = clone(updated.authoredDraft);
    normalizedAfterDraft.description = saved.authoredDraft.description;
    expect(normalizedAfterDraft).toEqual(saved.authoredDraft);
    expect(JSON.parse(updated.serializedData)).toEqual(updated.authoredDraft);

    // Same compiled mechanics
    expect(combatAfter.compiled.ok).toBe(true);
    expect(combatAfter.planState).toBe(STATES.EXECUTABLE);
    expect(combatAfter.compiled.definition.capability).toBe(combatBefore.compiled.definition.capability);
    expect(combatAfter.compiled.definition.targeting).toEqual(combatBefore.compiled.definition.targeting);
    expect(combatAfter.compiled.definition.resourceCost).toEqual(combatBefore.compiled.definition.resourceCost);
    expect(combatAfter.compiled.definition.effect).toEqual(combatBefore.compiled.definition.effect);

    expect(combatDuplicate.compiled.ok).toBe(true);
    expect(combatDuplicate.planState).toBe(STATES.EXECUTABLE);
    expect(combatDuplicate.compiled.definition.capability).toBe(combatBefore.compiled.definition.capability);
    expect(combatDuplicate.compiled.definition.targeting).toEqual(combatBefore.compiled.definition.targeting);
    expect(combatDuplicate.compiled.definition.resourceCost).toEqual(combatBefore.compiled.definition.resourceCost);
    expect(combatDuplicate.compiled.definition.effect).toEqual(combatBefore.compiled.definition.effect);
  });
});
