/**
 * Ordinary Spell Wizard Round-Trip Audit, Loss Reproduction & Fixture Capture
 *
 * Traces real UI-authored spells and legacy/non-approved drafts across:
 *   Wizard UI -> Header Finalize & Step 10 Review Save -> Library -> Reopen -> Edit -> Update/Save
 *   plus Duplicate (DUPLICATE_SPELL), Library Import (IMPORT_LIBRARY), spellNormalizer,
 *   spellSerializer, and libraryManager.
 *
 * Links every fixture and reproduced finding to the master capability inventory:
 *   - docs/CAPABILITY_MAP.md
 *   - server/tests/fixtures/capabilityMap.json
 *
 * Compares both raw saved records (record / authoredDraft / serializedData) AND combat
 * meaning (definitionFromWizard + explainExecution).
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  libraryActionCreators
} from '../context/SpellLibraryContext';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch
} from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { CARD_UNSETTLED_REASON } from '../../../services/randomOutcome';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import { normalizeSpell } from '../core/utils/spellNormalizer';
import {
  serializeSpell,
  deserializeSpell,
  generateHumanReadable,
  generateGameCode
} from '../core/utils/spellSerializer';
import { validateLibraryIntegrity, migrateSpellVersion } from '../core/utils/libraryManager';

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
  default: () => ({ user: { uid: 'round-trip-audit-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'wizardRoundTripFixtures.json');

const capturedFixtures = {
  schemaVersion: 1,
  masterInventoryRef: {
    doc: 'docs/CAPABILITY_MAP.md',
    json: 'server/tests/fixtures/capabilityMap.json'
  },
  cases: {}
};

function recordFixture(key, entry) {
  capturedFixtures.cases[key] = clone(entry);
}

function writeFixturesToDisk() {
  fs.mkdirSync(path.dirname(FIXTURE_PATH), { recursive: true });
  fs.writeFileSync(FIXTURE_PATH, JSON.stringify(capturedFixtures, null, 2), 'utf8');
}

let libraryApi = null;
let latestWizardState = null;
let wizardDispatch = null;

function Probes() {
  const libState = useSpellLibrary();
  const libDispatch = useSpellLibraryDispatch();
  const wizState = useSpellWizardState();
  const wizDispatch = useSpellWizardDispatch();
  libraryApi = { state: libState, dispatch: libDispatch };
  latestWizardState = wizState;
  wizardDispatch = wizDispatch;
  return null;
}

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

const seedEmpty = () => {
  mockPersisted = {
    version: 1,
    lastSaved: new Date().toISOString(),
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: [],
      collections: [],
      selectedSpell: null
    }
  };
};

function summarizeCombat(record) {
  const compiled = definitionFromWizard(record, {
    roomId: 'room-audit',
    definitionVersion: 1,
    classId: 'arcanoneer',
    allowProposedAreaRoll: false
  });
  const plan = explainExecution(record, {
    roomId: 'room-audit',
    definitionVersion: 1,
    classId: 'arcanoneer'
  });
  return {
    compiledOk: compiled.ok,
    compiledReason: compiled.ok ? null : compiled.reason,
    capability: compiled.ok ? (compiled.definition.capability || 'authored-immediate:v1') : null,
    executionState: plan.state,
    planReason: plan.reasons?.[0]?.text || null,
    targeting: compiled.ok ? compiled.definition.targeting : null,
    resourceCost: compiled.ok ? compiled.definition.resourceCost : null,
    effect: compiled.ok ? (compiled.definition.effect || compiled.definition.tickEffect || null) : null
  };
}

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function fillBasicInfo({ name, description, elementLabel, tagLabel, selectFirstIcon = false }) {
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
  if (selectFirstIcon) {
    const preview = document.querySelector('.spell-icon-preview');
    expect(preview).toBeTruthy();
    await act(async () => { fireEvent.click(preview); });
    const iconItem = await waitFor(() => {
      const found = document.querySelector('.icon-selector-item');
      expect(found).toBeTruthy();
      return found;
    });
    await act(async () => { fireEvent.click(iconItem); });
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

async function configureChanneledType({
  maxChannelDuration = 3,
  durationUnit = 'TURNS',
  tickFrequency = 'START_OF_TURN',
  concentrationDC = 12,
  dcType = 'CONSTITUTION'
} = {}) {
  await clickStep('Spell Type');
  const channeledHeading = await screen.findByText(/^CHANNELED$/i, { selector: '.spell-type-title' });
  await act(async () => { fireEvent.click(channeledHeading); });
  const durInput = await screen.findByLabelText(/Max Channel Duration/i);
  const unitSelect = await screen.findByLabelText(/Duration Unit/i);
  const freqSelect = await screen.findByLabelText(/Effect Frequency/i);
  const dcInput = await screen.findByLabelText(/Base Concentration DC/i);
  const dcTypeSelect = await screen.findByLabelText(/DC Type/i);
  await act(async () => {
    fireEvent.change(durInput, { target: { value: String(maxChannelDuration) } });
    fireEvent.change(unitSelect, { target: { value: durationUnit } });
    fireEvent.change(freqSelect, { target: { value: tickFrequency } });
    fireEvent.change(dcInput, { target: { value: String(concentrationDC) } });
    fireEvent.change(dcTypeSelect, { target: { value: dcType } });
  });
}

async function configureReactionType() {
  await clickStep('Spell Type');
  const reactionCard = await screen.findByText(/^REACTION$/i, { selector: '.spell-type-title' });
  await act(async () => { fireEvent.click(reactionCard); });
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
    .find(el => headerRegex.test(el.querySelector('.resource-type-name')?.textContent || ''));
  if (!block) {
    const card = await screen.findByText(cardTitle, { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(card); });
    await waitFor(() => {
      block = Array.from(document.querySelectorAll('.resource-cost-config'))
        .find(el => headerRegex.test(el.querySelector('.resource-type-name')?.textContent || ''));
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

async function saveViaReviewStep(expectedButtonRegex = /Save to Library|Update Spell/i) {
  await clickStep('Review');
  const prevCount = mockPersisted.data.spells.length;
  const btn = await screen.findByRole('button', { name: expectedButtonRegex });
  await act(async () => { fireEvent.click(btn); });
  if (/Save to Library/i.test(btn.textContent || '')) {
    await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));
    return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
  }
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

async function loadIntoWizardForEdit(record) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => { window.handleLoadSpell(clone(record), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeTruthy());
}

async function clickHeaderUpdateAndWait(savedRecord) {
  const prevModified = savedRecord.lastModified;
  const updateBtn = screen.getByRole('button', { name: /^Update$/i });
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
  latestWizardState = null;
  wizardDispatch = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

afterAll(() => {
  writeFixturesToDisk();
});

describe('Wizard Round-Trip Audit: UI -> Save -> Library -> Reopen -> Edit -> Save + Duplicate + Legacy Import', () => {
  jest.setTimeout(40000);

  test('1. emberBoltExecutable: Header vs Review save divergences, missing->empty injections, edit round-trip, Duplicate & IMPORT_LIBRARY collision', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Ember Bolt',
      description: 'Hurls a focused shard of ember at one enemy.',
      elementLabel: 'Ember',
      tagLabel: 'Attack',
      selectFirstIcon: true
    });
    const chosenTypeConfigIcon = latestWizardState.typeConfig.icon;
    expect(chosenTypeConfigIcon).toBeTruthy();

    await configureImmediateActionType();

    await clickStep('Effects');
    await selectEffectCard('Damage');
    const dmgInput = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(dmgInput, { target: { value: '2d6 + 1' } }); });

    await clickStep('Targeting');
    const singleCard = await screen.findByText('Single Target', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(singleCard); });
    const rangedCard = await screen.findByText('Ranged', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(rangedCard); });
    const rangeSlider = document.querySelector('input[type="range"]');
    await act(async () => { fireEvent.change(rangeSlider, { target: { value: '30' } }); });
    const enemiesCard = await screen.findByText('Enemies', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(enemiesCard); });

    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    await clickStep('Cooldown');
    const noCdBtn = await screen.findByRole('button', { name: /No Cooldown/i });
    await act(async () => { fireEvent.click(noCdBtn); });

    // Save #1 via Header "Finalize" (SpellwizardApp.handleSaveSpell)
    const savedViaHeader = await finalizeNewSpell();
    const combatHeader = summarizeCombat(savedViaHeader);
    expect(combatHeader.compiledOk).toBe(true);
    expect(combatHeader.executionState).toBe(STATES.EXECUTABLE);
    expect(combatHeader.resourceCost).toEqual({ actionPoints: 1, mana: 0 });

    // Observe missing -> injected dotConfig even on a pure direct-damage spell
    const injectedDotOnDirect = savedViaHeader.damageConfig?.dotConfig;
    expect(injectedDotOnDirect).toBeTruthy();
    // Canonical icon preservation across Header Finalize
    const headerTopLevelIconLoss = {
      chosenTypeConfigIcon,
      headerRecordIcon: savedViaHeader.icon
    };
    expect(savedViaHeader.icon).toBe(chosenTypeConfigIcon);

    // Compare against Step 10 Review Save on a duplicate fresh save
    const savedViaReview = await saveViaReviewStep(/Save to Library/i);
    const combatReview = summarizeCombat(savedViaReview);
    expect(combatReview.compiledOk).toBe(true);
    expect(combatReview.executionState).toBe(STATES.EXECUTABLE);
    expect(savedViaReview.icon).toBe(chosenTypeConfigIcon);
    // Unified canonical save keeps lastModified out of authoredDraft across all paths
    const reviewDraftHasLastModified = Object.prototype.hasOwnProperty.call(savedViaReview.authoredDraft, 'lastModified');
    const headerDraftHasLastModified = Object.prototype.hasOwnProperty.call(savedViaHeader.authoredDraft, 'lastModified');
    expect(reviewDraftHasLastModified).toBe(false);
    expect(headerDraftHasLastModified).toBe(false);

    // Reopen savedViaHeader -> edit formula & description -> Update -> Reopen
    await loadIntoWizardForEdit(savedViaHeader);
    const loadedTagsCountBeforeSave = latestWizardState.tags?.length || 0;
    const descInputReopen = screen.getByPlaceholderText('Describe what your spell does and how it appears');
    await act(async () => {
      fireEvent.change(descInputReopen, { target: { value: 'Hurls a hotter shard of ember at one enemy.' } });
    });
    await clickStep('Effects');
    const dmgInputReopen = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(dmgInputReopen, { target: { value: '2d6 + 2' } }); });

    const updatedRecord = await clickHeaderUpdateAndWait(savedViaHeader);
    const combatAfterEdit = summarizeCombat(updatedRecord);
    expect(combatAfterEdit.compiledOk).toBe(true);
    expect(combatAfterEdit.executionState).toBe(STATES.EXECUTABLE);
    expect(combatAfterEdit.effect.formula).toBe('2d6 + 2');
    expect(combatAfterEdit.resourceCost).toEqual({ actionPoints: 1, mana: 0 });
    // Deduplicated tags do not duplicate across repeated saves
    expect(updatedRecord.tags.length).toBe(loadedTagsCountBeforeSave);

    // Duplicate path: DUPLICATE_SPELL preserves executable meaning and definition identity
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.duplicateSpell(updatedRecord.id));
    });
    const dupRecord = clone(mockPersisted.data.spells.find((s) => s.name === 'Ember Bolt (Copy)'));
    expect(dupRecord).toBeTruthy();
    expect(dupRecord.id).not.toBe(updatedRecord.id);
    expect(dupRecord.authoredDefinitionId).toBe(updatedRecord.authoredDefinitionId);
    const combatDuplicate = summarizeCombat(dupRecord);
    expect(combatDuplicate.compiledOk).toBe(true);
    expect(combatDuplicate.executionState).toBe(STATES.EXECUTABLE);

    // Export -> Import on colliding ID (IMPORT_LIBRARY)
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary({
        spells: [clone(updatedRecord)],
        categories: []
      }));
    });
    const importedColliding = clone(
      mockPersisted.data.spells.find((s) => s.name === 'Ember Bolt (Imported)')
    );
    expect(importedColliding).toBeTruthy();
    const combatImportedCollision = summarizeCombat(importedColliding);
    // Fixed in SpellLibraryContext.js IMPORT_LIBRARY: name, authoredDraft.name, and serializedData stay aligned.
    expect(importedColliding.name).toBe('Ember Bolt (Imported)');
    expect(importedColliding.authoredDraft.name).toBe('Ember Bolt (Imported)');
    expect(JSON.parse(importedColliding.serializedData).name).toBe('Ember Bolt (Imported)');
    expect(combatImportedCollision.compiledOk).toBe(true);
    expect(combatImportedCollision.executionState).toBe(STATES.EXECUTABLE);
    expect(combatImportedCollision).toEqual(combatAfterEdit);

    recordFixture('emberBoltExecutable', {
      capabilityMapFamily: 'damage-formulas',
      capabilityMapCheck: 'supported-immediate-damage',
      alsoCoversChecks: ['refused-arbitrary-resource-formula'],
      savedViaHeader,
      savedViaReview,
      updatedRecord,
      duplicatedRecord: dupRecord,
      importedCollidingRecord: importedColliding,
      findings: {
        headerTopLevelIconLoss,
        reviewDraftHasLastModified,
        headerDraftHasLastModified,
        injectedDotOnDirect,
        tagDuplicationAfterUpdate: {
          beforeCount: loadedTagsCountBeforeSave,
          afterTags: updatedRecord.tags
        },
        importCollisionCombatLoss: {
          before: combatAfterEdit,
          after: combatImportedCollision
        }
      }
    });
  });

  test('2. perEffectStrikeAndMend (PRIMARY FIX TARGET): Effect-Specific Targeting must survive Save -> Reopen -> Edit without leaking into global targetingConfig or targetingTags', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Strike and Mend',
      description: 'Scorches one enemy at range while mending one ally by touch.',
      elementLabel: 'Ember'
    });
    await configureImmediateActionType();

    // Select both Damage and Healing effects
    await clickStep('Effects');
    await selectEffectCard('Damage');
    const dmgInput = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(dmgInput, { target: { value: '1d8' } }); });

    await selectEffectCard('Healing');
    await switchEffectTab('Healing');
    const healInput = await screen.findByLabelText('Healing formula');
    await act(async () => { fireEvent.change(healInput, { target: { value: '1d6' } }); });

    // Configure clear Unified global baseline first (Single, Ranged, 30 ft, Any)
    await clickStep('Targeting');
    const singleCard = await screen.findByText('Single Target', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(singleCard); });
    const rangedCard = await screen.findByText('Ranged', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(rangedCard); });
    const initialRangeSlider = document.querySelector('input[type="range"]');
    await act(async () => { fireEvent.change(initialRangeSlider, { target: { value: '30' } }); });

    const baselineGlobalBeforeSwitch = clone(latestWizardState.targetingConfig);
    expect(baselineGlobalBeforeSwitch.rangeDistance).toBe(30);
    expect(baselineGlobalBeforeSwitch.rangeType).toBe('ranged');

    // Switch to Effect-Specific Targeting
    const effectModeCard = await screen.findByText('Effect-Specific Targeting');
    await act(async () => { fireEvent.click(effectModeCard); });

    // Damage is auto-selected on click; configure Ranged 45 ft, Enemies
    await waitFor(() => {
      const selected = document.querySelector('.effect-selector-item.selected');
      expect(selected?.textContent).toMatch(/Damage/i);
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

    // Switch to Healing; configure Touch (5 ft), Allies
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

    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    const saved = await finalizeNewSpell();
    const combatBefore = summarizeCombat(saved);
    expect(saved.targetingMode).toBe('effect');
    expect(saved.effectTargeting.damage.rangeDistance).toBe(45);
    expect(saved.effectTargeting.healing.rangeDistance).toBe(5);
    expect(saved.targetingConfig.rangeDistance).toBe(30);

    // Reopen saved spell in Edit mode -> click Targeting
    await loadIntoWizardForEdit(saved);
    await clickStep('Targeting');

    // PRIMARY LOSS ASSERTIONS (RED BEFORE FIX, GREEN AFTER FIX):
    // 1) Reopening in effect mode MUST restore the first effect selection instead of selectedEffect === null
    const selectedOnReopen = document.querySelector('.effect-selector-item.selected');
    expect(selectedOnReopen).toBeTruthy();
    expect(selectedOnReopen.textContent).toMatch(/Damage/i);

    // 2) Immediately editing the Range slider in Step 4 after reopen MUST update effectTargeting.damage,
    // NOT overwrite global targetingConfig.rangeDistance!
    const reopenSlider = document.querySelector('input[type="range"]');
    expect(reopenSlider).toBeTruthy();
    expect(Number(reopenSlider.value)).toBe(45);
    await act(async () => {
      fireEvent.change(reopenSlider, { target: { value: '60' } });
    });

    const updated = await clickHeaderUpdateAndWait(saved);
    expect(updated.targetingMode).toBe('effect');
    expect(updated.effectTargeting.damage.rangeDistance).toBe(60);
    expect(updated.effectTargeting.healing.rangeDistance).toBe(5);
    expect(updated.targetingConfig.rangeDistance).toBe(30);
    expect(updated.targetingTags || {}).toEqual({});

    recordFixture('perEffectStrikeAndMend', {
      capabilityMapFamily: 'targeting-single',
      capabilityMapCheck: 'supported-immediate-damage',
      savedBeforeEdit: saved,
      savedAfterEdit: updated,
      combatBefore,
      combatAfter: summarizeCombat(updated)
    });
  });

  test('3. zeroDefaultsAndUnifiedSubmit: Reopening replaces 0 values (level:0, propagation decay:0, area maxTargets) with defaults', async () => {
    seedEmpty();
    mountWizard();

    // Seed a valid executable self-heal record with explicit level: 0 & rangeDistance: 0
    const selfHealRecord = {
      id: 'audit-self-heal-zero',
      name: 'Mending Breath',
      description: 'Restores health to self at zero range.',
      level: 0,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['healing'],
      effectsMap: { healing: true },
      typeConfig: { school: 'sacred', icon: 'Radiant/Divine Blessing', castTimeType: 'IMMEDIATE', tags: [] },
      healingConfig: { healingType: 'direct', formula: '1d8 + 2', resolution: 'DICE' },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'self',
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
      resourceCost: { actionPoints: 1, mana: 0, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      propagation: {
        method: 'chain',
        behavior: 'nearest',
        parameters: { count: 2, range: 15, decay: 0, secondaryRadius: 10, spreadRate: 5, forkCount: 2 }
      },
      authoredDefinitionId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      dateCreated: '2026-11-18T00:00:00.000Z',
      lastModified: '2026-11-18T00:00:00.000Z'
    };
    const { propagation: _unusedProp, ...executableDraftBase } = clone(selfHealRecord);
    // Keep one clean executable baseline (no propagation) for level:0 observation
    const cleanSelfHeal = {
      ...executableDraftBase,
      authoredDraft: clone(executableDraftBase),
      serializedData: JSON.stringify(executableDraftBase, null, 2)
    };
    const combatBefore = summarizeCombat(cleanSelfHeal);
    expect(combatBefore.compiledOk).toBe(true);
    expect(combatBefore.targeting.rangeFeet).toBe(0);

    // Load cleanSelfHeal (level: 0) into Wizard -> canonical handleLoadSpell preserves explicit 0
    await loadIntoWizardForEdit(cleanSelfHeal);
    const loadedLevelFromZero = latestWizardState.level;
    expect(loadedLevelFromZero).toBe(0);

    // Also test propagation.parameters.decay === 0 clobbered to 20 on Step 4 mount (Step4Targeting.jsx:239, 336)
    await loadIntoWizardForEdit(selfHealRecord);
    await clickStep('Targeting');
    const decayLabel = await screen.findByText(/Effect Decay/i);
    const decaySlider = decayLabel.closest('.param-group')?.querySelector('input[type="range"]');
    expect(decaySlider).toBeTruthy();
    const observedDecayOnReopen = Number(decaySlider.value);
    expect(observedDecayOnReopen).toBe(20);

    // Also test area maxTargets: 4 clobbered to 1 when re-clicking Area card in Step 4 (Step4Targeting.jsx:2594)
    const areaRecord = {
      id: 'audit-area-max-targets',
      name: 'Ember Nova',
      description: 'Scorches up to 4 enemies in a 15 ft circle.',
      level: 2,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      typeConfig: { school: 'ember', icon: 'Fire/Flame Burst', castTimeType: 'IMMEDIATE', tags: [] },
      damageConfig: { damageType: 'direct', formula: '2d6', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy'],
        maxTargets: 4,
        selectionMethod: 'manual',
        targetSelectionMethod: 'manual',
        aoeShape: 'circle',
        aoeType: 'sphere',
        aoeParameters: { radius: 15 },
        movementBehavior: 'static'
      },
      resourceCost: { actionPoints: 1, mana: 2, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      dateCreated: '2026-11-18T00:00:00.000Z',
      lastModified: '2026-11-18T00:00:00.000Z'
    };
    const areaDraft = clone(areaRecord);
    areaRecord.authoredDraft = areaDraft;
    areaRecord.serializedData = JSON.stringify(areaDraft, null, 2);

    const combatAreaBefore = definitionFromWizard(areaRecord, {
      roomId: 'room-audit',
      definitionVersion: 1,
      classId: 'arcanoneer',
      allowProposedAreaRoll: true
    });
    expect(combatAreaBefore.ok).toBe(true);
    expect(combatAreaBefore.definition.targeting.maxTargets).toBe(4);

    await loadIntoWizardForEdit(areaRecord);
    await clickStep('Targeting');
    // Re-selecting Area card triggers Step4Targeting.jsx:2594 `maxTargets: type.id === 'multi' ? maxTargets : 1`
    const areaCard = await screen.findByText('Area of Effect', { selector: '.targeting-option-name' });
    await act(async () => { fireEvent.click(areaCard); });
    const observedAreaMaxTargetsAfterClick = latestWizardState.targetingConfig.maxTargets;
    expect(observedAreaMaxTargetsAfterClick).toBe(1);

    recordFixture('zeroDefaultsAndUnifiedSubmit', {
      capabilityMapFamily: 'healing-immediate-and-self',
      capabilityMapCheck: 'supported-self-healing',
      alsoCoversChecks: ['supported-area-circle'],
      findings: {
        levelZeroReplacedWithDefaultOne: {
          before: 0,
          afterLoad: loadedLevelFromZero,
          rootCause: 'SpellwizardApp.jsx:556 (`spellCopy.level || 1`)'
        },
        propagationDecayZeroReplacedWithTwenty: {
          before: 0,
          afterStep4Mount: observedDecayOnReopen,
          rootCause: 'Step4Targeting.jsx:239,336 (`parameters.decay || 20`)'
        },
        areaMaxTargetsReplacedWithOne: {
          before: 4,
          afterStep4AreaClick: observedAreaMaxTargetsAfterClick,
          combatMaxTargetsBefore: combatAreaBefore.definition.targeting.maxTargets,
          combatMaxTargetsIfSavedAtOne: 8,
          rootCause: 'Step4Targeting.jsx:456,2594 (`maxTargets: ... : 1`)'
        }
      }
    });
  });

  test('4. falseToTrueAndProcs: savingThrow:false flipped to true in Damage modal & per-effect Chance on Hit popup mutates state on mount', async () => {
    seedEmpty();
    mountWizard();

    // Part A: false -> true in DamageEffects.jsx:1580
    const noSaveDamageRecord = {
      id: 'audit-false-save',
      name: 'Plain Ember Bolt',
      description: 'Direct damage with savingThrow explicitly false.',
      level: 1,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      typeConfig: { school: 'ember', icon: 'Fire/Fire Bolt', castTimeType: 'IMMEDIATE', tags: [] },
      damageConfig: {
        damageType: 'direct',
        formula: '1d8',
        elementType: 'ember',
        damageTypes: ['ember'],
        resolution: 'DICE',
        savingThrow: false
      },
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
      resourceCost: { actionPoints: 1, mana: 0, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      dateCreated: '2026-11-18T00:00:00.000Z',
      lastModified: '2026-11-18T00:00:00.000Z'
    };
    const draft = clone(noSaveDamageRecord);
    noSaveDamageRecord.authoredDraft = draft;
    noSaveDamageRecord.serializedData = JSON.stringify(draft, null, 2);

    const combatBefore = summarizeCombat(noSaveDamageRecord);
    expect(combatBefore.compiledOk).toBe(true);
    expect(combatBefore.executionState).toBe(STATES.EXECUTABLE);

    await loadIntoWizardForEdit(noSaveDamageRecord);
    await clickStep('Effects');
    const saveBtn = screen.getByRole('button', { name: /Saving Throw/i });
    await act(async () => { fireEvent.click(saveBtn); });

    const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
    const saveDialog = dialogs.find((d) => /Saving Throw Configuration/i.test(d.textContent || ''));
    expect(saveDialog).toBeTruthy();
    const enableSaveCheckbox = within(saveDialog).getByLabelText(/Enable Saving Throw/i);
    // Real bug (DamageEffects.jsx:1580): `savingThrow !== null && savingThrow !== undefined` evaluates `false !== null` => TRUE!
    const checkboxCheckedForExplicitFalse = enableSaveCheckbox.checked;
    expect(checkboxCheckedForExplicitFalse).toBe(true);

    // Changing Save Ability in the opened dialog immediately saves a synthetic Agility Save spell!
    const saveAbilitySelect = within(saveDialog).getByRole('combobox');
    await act(async () => { fireEvent.change(saveAbilitySelect, { target: { value: 'constitution' } }); });
    const mutatedDamageConfig = clone(latestWizardState.damageConfig);
    expect(mutatedDamageConfig.savingThrow).toBe('constitution');
    expect(mutatedDamageConfig.difficultyClass).toBe(15);

    const closeBtn = within(saveDialog).getByRole('button', { name: 'Close' });
    await act(async () => { fireEvent.click(closeBtn); });

    // Part B: Procs stay attached per-effect in saved data, AND ChanceOnHitConfig mutates on popup mount
    cleanup();
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Spark and Salve',
      description: 'Deals damage with a hit proc and heals with a heal proc.',
      elementLabel: 'Ember'
    });
    await configureImmediateActionType();
    await clickStep('Effects');
    await selectEffectCard('Damage');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d8' } });
    });
    // Configure Chance on Hit on Damage
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Chance on Hit/i }));
    });
    const procDialog1 = Array.from(document.querySelectorAll('[role="dialog"]'))
      .find((d) => /Chance on Hit Configuration/i.test(d.textContent || ''));
    expect(procDialog1).toBeTruthy();
    await act(async () => {
      fireEvent.click(within(procDialog1).getByLabelText(/Enable Chance on Hit Effects/i));
    });
    const dmgThresholdInput = within(procDialog1).getByDisplayValue('18');
    await act(async () => { fireEvent.change(dmgThresholdInput, { target: { value: '16' } }); });
    await act(async () => {
      fireEvent.click(within(procDialog1).getByRole('button', { name: 'Close' }));
    });

    // Configure Chance on Heal on Healing
    await selectEffectCard('Healing');
    await switchEffectTab('Healing');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Healing formula'), { target: { value: '1d6' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Chance on Heal/i }));
    });
    const procDialog2 = Array.from(document.querySelectorAll('[role="dialog"]'))
      .find((d) => /Chance on Heal Configuration/i.test(d.textContent || ''));
    expect(procDialog2).toBeTruthy();
    await act(async () => {
      fireEvent.click(within(procDialog2).getByLabelText(/Enable Chance on Hit Effects/i));
    });
    const healThresholdInput = within(procDialog2).getByDisplayValue('18');
    await act(async () => { fireEvent.change(healThresholdInput, { target: { value: '13' } }); });
    await act(async () => {
      fireEvent.click(within(procDialog2).getByRole('button', { name: 'Close' }));
    });

    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    const savedProcs = await finalizeNewSpell();
    expect(savedProcs.damageConfig.chanceOnHitConfig.enabled).toBe(true);
    expect(savedProcs.damageConfig.chanceOnHitConfig.diceThreshold).toBe(16);
    expect(savedProcs.healingConfig.chanceOnHitConfig.enabled).toBe(true);
    expect(savedProcs.healingConfig.chanceOnHitConfig.diceThreshold).toBe(13);

    recordFixture('falseToTrueAndProcs', {
      capabilityMapFamily: 'saves',
      capabilityMapCheck: 'supported-direct-save-halves',
      alsoCoversChecks: ['refused-crit-damage'],
      findings: {
        falseSaveFlippedToTrue: {
          beforeSavingThrow: false,
          checkboxCheckedOnModalOpen: checkboxCheckedForExplicitFalse,
          afterSelectingSaveAbility: {
            savingThrow: mutatedDamageConfig.savingThrow,
            difficultyClass: mutatedDamageConfig.difficultyClass
          },
          rootCause: 'DamageEffects.jsx:1580 (`damageConfig.savingThrow !== null && damageConfig.savingThrow !== undefined`)'
        },
        perEffectProcsSavedRecord: {
          damageProcThreshold: savedProcs.damageConfig.chanceOnHitConfig.diceThreshold,
          healingProcThreshold: savedProcs.healingConfig.chanceOnHitConfig.diceThreshold,
          note: 'Both procs stay attached on their own effectConfig in saved records; ChanceOnHitConfig.jsx:55-59 fires onConfigChange on popup mount even without user edits; Step10Review.jsx:535-566 & spellCardTransformer.js:349-373 flatten/detach procs for display (formatter owner).'
        }
      },
      savedProcsRecord: savedProcs
    });
  });

  test('5. resourceFormulasAndLegacyMana: Step 5 parseInt turns rage_state string into 0, truncates formulas, and conflicts legacy mana on edit', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Rage Test',
      description: 'Tests Step 5 resource input coercion.'
    });
    await configureImmediateActionType();
    await clickStep('Effects');
    await selectEffectCard('Damage');
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });

    // Open Step 5 and expand Rage States -> State (rage_state)
    await clickStep('Resources');
    const rageCategory = await screen.findByText('Rage States', { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(rageCategory); });
    const rageStateSub = await screen.findByText('State', { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(rageStateSub); });

    const rageSelect = await waitFor(() => {
      const sel = document.querySelector('.rage-state-selector select');
      expect(sel).toBeTruthy();
      return sel;
    });
    await act(async () => { fireEvent.change(rageSelect, { target: { value: 'Smoldering' } }); });
    // Real bug (Step5Resources.jsx:534): `parseInt('Smoldering', 10) || 0` turns `'Smoldering'` into `0`!
    const savedRageStateValue = latestWizardState.resourceCost?.resourceValues?.rage_state;
    expect(savedRageStateValue).toBe(0);

    // Check health cost: fixed numeric input rejects dice formula text unless Using Formula toggle is enabled
    const necroticCategory = await screen.findByText('Necrotic Ascension', { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(necroticCategory); });
    const healthSub = await screen.findByText('Health', { selector: '.resource-type-name' });
    await act(async () => { fireEvent.click(healthSub); });
    const healthBlock = Array.from(document.querySelectorAll('.resource-cost-config'))
      .find((el) => /Health Cost/i.test(el.querySelector('.resource-type-name')?.textContent || ''));
    expect(healthBlock).toBeTruthy();
    const healthNumericInput = healthBlock.querySelector('input.resource-input');
    expect(healthNumericInput.type).toBe('number');
    const formulaToggleBtn = within(healthBlock).getByRole('button', { name: /Fixed Value/i });
    await act(async () => { fireEvent.click(formulaToggleBtn); });
    const formulaTextInput = healthBlock.querySelector('input.formula-input');
    expect(formulaTextInput).toBeTruthy();
    await act(async () => { fireEvent.change(formulaTextInput, { target: { value: '2d4' } }); });
    const savedHealthFormula = latestWizardState.resourceCost?.resourceFormulas?.health;
    expect(savedHealthFormula).toBe('2d4');

    // Part B: Reopen a legacy executable record with resourceCost: { actionPoints: 1, mana: 10 } (no resourceValues)
    const legacyManaRecord = {
      id: 'audit-legacy-mana',
      name: 'Legacy Mana Bolt',
      description: 'Legacy shape with flat mana instead of resourceValues.mana.',
      level: 1,
      spellType: 'ACTION',
      resolution: 'DICE',
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      typeConfig: { school: 'arcane', icon: 'Arcane/Missile', castTimeType: 'IMMEDIATE', tags: [] },
      damageConfig: { damageType: 'direct', formula: '2d6', elementType: 'arcane', damageTypes: ['arcane'], resolution: 'DICE' },
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
      resourceCost: { actionPoints: 1, mana: 10, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      durationConfig: { durationType: 'instant' },
      authoredDefinitionId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
      dateCreated: '2026-11-18T00:00:00.000Z',
      lastModified: '2026-11-18T00:00:00.000Z'
    };
    const legacyDraft = clone(legacyManaRecord);
    legacyManaRecord.authoredDraft = legacyDraft;
    legacyManaRecord.serializedData = JSON.stringify(legacyDraft, null, 2);

    const combatLegacyBefore = summarizeCombat(legacyManaRecord);
    expect(combatLegacyBefore.compiledOk).toBe(true);
    expect(combatLegacyBefore.resourceCost).toEqual({ actionPoints: 1, mana: 10 });

    cleanup();
    seedEmpty();
    mockPersisted.data.spells.push(clone(legacyManaRecord));
    mountWizard();
    await loadIntoWizardForEdit(legacyManaRecord);
    await clickStep('Resources');

    // Step5Resources auto-selects ['mana'] when resourceTypes is absent, rendering Mana input at 0 instead of 10
    const manaBlock = Array.from(document.querySelectorAll('.resource-cost-config'))
      .find((el) => /Mana/i.test(el.querySelector('.resource-type-name')?.textContent || ''));
    expect(manaBlock).toBeTruthy();
    const manaInput = manaBlock.querySelector('input.resource-input');
    const observedManaInputOnReopen = Number(manaInput.value);
    expect(observedManaInputOnReopen).toBe(0);

    // Edit mana to 12 in UI -> Step5 sets resourceValues.mana = 12 while top-level resourceCost.mana remains 10!
    await act(async () => { fireEvent.change(manaInput, { target: { value: '12' } }); });
    const updatedLegacyMana = await clickHeaderUpdateAndWait(legacyManaRecord);
    const combatLegacyAfterEdit = summarizeCombat(updatedLegacyMana);
    // authoredAbility.js:716 sees both cost.mana === 10 and cost.resourceValues.mana === 12 and refuses!
    expect(combatLegacyAfterEdit.compiledOk).toBe(false);
    expect(combatLegacyAfterEdit.compiledReason).toMatch(/Explicit mana price/i);

    recordFixture('resourceFormulasAndLegacyMana', {
      capabilityMapFamily: 'resource-terms',
      capabilityMapCheck: 'refused-arbitrary-resource-formula',
      findings: {
        rageStateCoercedToZero: {
          selectedOption: 'Smoldering',
          savedValue: savedRageStateValue,
          rootCause: 'Step5Resources.jsx:534 (`parseInt(value, 10) || 0`)'
        },
        healthNumericInputVsFormulaToggle: {
          numericInputType: 'number',
          formulaModeSavedFormula: savedHealthFormula,
          note: 'Step5Resources.jsx:984 renders <input type="number"> rejecting dice formula strings unless Formula toggle is switched to resourceFormulas (which authoredAbility refuses).'
        },
        legacyManaConflictOnEdit: {
          beforeResourceCost: legacyManaRecord.resourceCost,
          observedManaInputValueAfterToggle: observedManaInputOnReopen,
          afterEditResourceCost: updatedLegacyMana.resourceCost,
          combatBefore: combatLegacyBefore,
          combatAfterEdit: combatLegacyAfterEdit,
          rootCause: 'Step5Resources.jsx:73,499,987 + authoredAbility.js:715-716'
        }
      }
    });
  });

  test('6. triggerAndOrSwitch: Ordinary Reaction OR preserves, but Legacy flat OR and paired Required Conditions lose switch/enabled state', async () => {
    seedEmpty();
    mountWizard();

    // Part A: Author real UI REACTION with Global OR + 2 triggers -> Save -> Reopen -> Update
    await fillBasicInfo({
      name: 'Reactive OR Guard',
      description: 'Triggers when damage taken OR critical hit occurs.',
      elementLabel: 'Arcane'
    });
    await configureReactionType();
    await clickStep('Effects');
    await selectEffectCard('Damage');
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 0);

    await clickStep('Triggers');
    const anyConditionBtn = await screen.findByRole('button', { name: /ANY CONDITION/i });
    await act(async () => { fireEvent.click(anyConditionBtn); });
    const dmgTakenOpt = await screen.findByText('Damage Taken', { selector: '.wow-trigger-option-title' });
    await act(async () => { fireEvent.click(dmgTakenOpt); });
    const critHitOpt = await screen.findByText('Critical Hit', { selector: '.wow-trigger-option-title' });
    await act(async () => { fireEvent.click(critHitOpt); });

    const savedReaction = await finalizeNewSpell();
    expect(savedReaction.triggerConfig.global.logicType).toBe('OR');
    expect(savedReaction.triggerConfig.global.compoundTriggers.length).toBe(2);

    await loadIntoWizardForEdit(savedReaction);
    const updatedReaction = await clickHeaderUpdateAndWait(savedReaction);
    expect(updatedReaction.triggerConfig.global.logicType).toBe('OR');
    expect(updatedReaction.triggerConfig.global.compoundTriggers.length).toBe(2);

    // Part B: Legacy flat triggerConfig `{ logicType: 'OR', compoundTriggers: [...] }` loses 'OR' on Step 7 visit
    const legacyFlatOrRecord = {
      id: 'audit-legacy-flat-or',
      name: 'Legacy Flat OR Reaction',
      description: 'Legacy trigger shape without nested global.',
      level: 1,
      spellType: 'REACTION',
      resolution: 'DICE',
      effectTypes: ['damage'],
      effectsMap: { damage: true },
      typeConfig: { school: 'arcane', icon: 'Arcane/Orb Manipulation', tags: [] },
      damageConfig: { damageType: 'direct', formula: '1d8', elementType: 'arcane', damageTypes: ['arcane'], resolution: 'DICE' },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 1 },
      resourceCost: { actionPoints: 1, mana: 0, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      triggerConfig: {
        logicType: 'OR',
        compoundTriggers: [
          { id: 'damage_dealt', category: 'combat', name: 'Damage Dealt', parameters: { perspective: 'self' } }
        ]
      },
      dateCreated: '2026-11-18T00:00:00.000Z',
      lastModified: '2026-11-18T00:00:00.000Z'
    };
    const flatDraft = clone(legacyFlatOrRecord);
    legacyFlatOrRecord.authoredDraft = flatDraft;
    legacyFlatOrRecord.serializedData = JSON.stringify(flatDraft, null, 2);

    cleanup();
    seedEmpty();
    mockPersisted.data.spells.push(clone(legacyFlatOrRecord));
    mountWizard();
    await loadIntoWizardForEdit(legacyFlatOrRecord);
    await clickStep('Triggers');
    await screen.findByText(/No trigger conditions selected/i);
    const allCondBtn = screen.getByRole('button', { name: /ALL CONDITIONS/i });
    const anyCondBtn = screen.getByRole('button', { name: /ANY CONDITION/i });
    const observedAndActive = allCondBtn.classList.contains('active');
    const observedOrActive = anyCondBtn.classList.contains('active');
    expect(observedAndActive).toBe(true);
    expect(observedOrActive).toBe(false);

    // Adding a trigger and updating overwrites the legacy flat OR trigger with nested AND
    await act(async () => {
      fireEvent.click(await screen.findByText('Critical Hit', { selector: '.wow-trigger-option-title' }));
    });
    const updatedLegacyFlatTrigger = await clickHeaderUpdateAndWait(legacyFlatOrRecord);
    expect(updatedLegacyFlatTrigger.triggerConfig.global.logicType).toBe('AND');
    expect(updatedLegacyFlatTrigger.triggerConfig.global.compoundTriggers.map(t => t.id)).toEqual(['critical_hit']);

    recordFixture('triggerAndOrSwitch', {
      capabilityMapFamily: 'triggers-whole-and-component',
      capabilityMapCheck: 'refused-whole-trigger-predicate',
      ordinaryUiReactionOrSaved: savedReaction,
      ordinaryUiReactionOrUpdated: updatedReaction,
      findings: {
        legacyFlatOrLostOnStep7Visit: {
          beforeTriggerConfig: legacyFlatOrRecord.triggerConfig,
          afterStep7MountUI: {
            allConditionsActive: observedAndActive,
            anyConditionActive: observedOrActive,
            emptyNoticeShown: true
          },
          afterUpdateTriggerConfig: updatedLegacyFlatTrigger.triggerConfig.global,
          rootCause: 'useTriggerConfig.js:14-20 (expects nested triggerConfig.global, resets missing global to AND/[])'
        }
      }
    });
  });

  test('7. nonApprovedDraftsAndChannelTable: Card Draw draft preserves exact choices & reason; Channeled Area ROUNDS draft preserves ROUNDS and Step 5 AP/Mana across an unedited Step 8 visit', async () => {
    seedEmpty();
    mountWizard();

    // Non-approved Draft #1 (Valid to keep, NOT approved for combat): Card Draw Outcome Spell
    await fillBasicInfo({
      name: 'Tarot Fate',
      description: 'Draws one standard card to deal damage or heal.',
      elementLabel: 'Wyrd'
    });
    await configureImmediateActionType();
    await clickStep('Effects');
    await act(async () => {
      fireEvent.click(await screen.findByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i));
    });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 1);
    await setResourceCostInput('Mana', /Mana/i, 2);

    await clickStep('Rollable Table');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Cards$/i }));
    });
    const cardTableSaved = await finalizeNewSpell();
    const cardCombatBefore = summarizeCombat(cardTableSaved);
    expect(cardCombatBefore.compiledOk).toBe(false);
    expect(cardCombatBefore.executionState).toBe(STATES.UNSUPPORTED);
    expect(cardCombatBefore.planReason).toBe(CARD_UNSETTLED_REASON);

    // Reopen -> edit description -> Update -> verify BOTH card table & exact refusal reason preserved!
    await loadIntoWizardForEdit(cardTableSaved);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
        target: { value: 'Draws one card from a standard deck; GM resolves reveal manually.' }
      });
    });
    const cardTableUpdated = await clickHeaderUpdateAndWait(cardTableSaved);
    const cardCombatAfter = summarizeCombat(cardTableUpdated);
    expect(cardTableUpdated.rollableTable.resolutionType).toBe('CARDS');
    expect(cardTableUpdated.rollableTable.entries).toEqual(cardTableSaved.rollableTable.entries);
    expect(cardCombatAfter.executionState).toBe(STATES.UNSUPPORTED);
    expect(cardCombatAfter.planReason).toBe(CARD_UNSETTLED_REASON);

    // Non-approved Draft #2: Executable 1d6 Dice Rollable Table reopened & entry edited in TableEntryEditor
    await loadIntoWizardForEdit(cardTableSaved);
    await clickStep('Rollable Table');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Dice$/i })); });
    const diceTableSaved = await clickHeaderUpdateAndWait(cardTableSaved);
    const diceCombatBeforeEdit = summarizeCombat(diceTableSaved);
    expect(diceCombatBeforeEdit.compiledOk).toBe(true);

    await loadIntoWizardForEdit(diceTableSaved);
    await clickStep('Rollable Table');
    const editButtons = screen.getAllByRole('button', { name: /Edit entry/i });
    await act(async () => { fireEvent.click(editButtons[0]); });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Edited Ember Lash' } });
    });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Save Entry/i })); });
    const diceTableAfterEntryEdit = await clickHeaderUpdateAndWait(diceTableSaved);
    const editedEntryEffectConfig = diceTableAfterEntryEdit.rollableTable.entries[0].effectConfig;
    const diceCombatAfterEntryEdit = summarizeCombat(diceTableAfterEntryEdit);
    expect(diceCombatAfterEntryEdit.compiledOk).toBe(true);

    // Non-approved Draft #3 (PRESERVED ON REOPEN STEP 8 since step8-channeling-preservation-20261120): Channeled Area with ROUNDS & 2 AP / 10 Mana
    cleanup();
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Tempest Channel',
      description: 'Channels storm energy across an area over 3 rounds.',
      elementLabel: 'Storm'
    });
    await configureChanneledType({
      maxChannelDuration: 3,
      durationUnit: 'ROUNDS',
      tickFrequency: 'START_OF_TURN',
      concentrationDC: 12,
      dcType: 'CONSTITUTION'
    });
    await clickStep('Effects');
    await selectEffectCard('Damage');
    await act(async () => {
      fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d6' } });
    });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Area of Effect', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 2);
    await setResourceCostInput('Mana', /Mana/i, 10);

    // Save BEFORE visiting Step 8 Channeling to capture uncorrupted draft + refusal reason
    const channeledRoundsSaved = await finalizeNewSpell();
    const channeledCombatBeforeStep8 = summarizeCombat(channeledRoundsSaved);
    expect(channeledRoundsSaved.typeConfig.durationUnit).toBe('ROUNDS');
    expect(channeledRoundsSaved.resourceCost.actionPoints).toBe(2);
    expect(channeledRoundsSaved.resourceCost.resourceValues.mana).toBe(10);
    expect(channeledCombatBeforeStep8.compiledOk).toBe(false);
    expect(channeledCombatBeforeStep8.compiledReason).toMatch(/durationUnit/i);

    // Reopen and visit Step 8 Channeling without editing -> ROUNDS, Step 5 AP & mana, empty channelingConfig and the refusal reason are preserved
    await loadIntoWizardForEdit(channeledRoundsSaved);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);
    const channeledAfterStep8 = await clickHeaderUpdateAndWait(channeledRoundsSaved);
    const channeledCombatAfterStep8 = summarizeCombat(channeledAfterStep8);

    expect(channeledAfterStep8.typeConfig.durationUnit).toBe('ROUNDS');
    expect(channeledAfterStep8.resourceCost.actionPoints).toBe(2);
    expect(channeledAfterStep8.resourceCost.resourceTypes).toEqual(channeledRoundsSaved.resourceCost.resourceTypes);
    expect(channeledAfterStep8.resourceCost.resourceValues).toEqual(channeledRoundsSaved.resourceCost.resourceValues);
    expect(channeledAfterStep8.resourceCost.resourceValues.mana).toBe(10);
    expect(channeledAfterStep8.channelingConfig || {}).toEqual(channeledRoundsSaved.channelingConfig || {});
    expect(channeledCombatAfterStep8.compiledOk).toBe(false);
    expect(channeledCombatAfterStep8.compiledReason).toBe(channeledCombatBeforeStep8.compiledReason);
    expect(channeledCombatAfterStep8.planReason).toBe(channeledCombatBeforeStep8.planReason);

    recordFixture('nonApprovedDraftsAndChannelTable', {
      capabilityMapFamily: 'durations-ticks-expiry',
      capabilityMapCheck: 'refused-wizard-duration-rounds',
      alsoCoversChecks: ['refused-area-cone', 'supported-area-circle'],
      cardDraftPreserved: {
        saved: cardTableSaved,
        updated: cardTableUpdated,
        combatBefore: cardCombatBefore,
        combatAfter: cardCombatAfter
      },
      diceEntryEditCrossPollination: {
        editedEntryEffectConfig,
        combatAfterEntryEdit: diceCombatAfterEntryEdit,
        rootCause: 'TableEntryEditor.jsx:62-83 injects summoning/buff default keys into damage entry.effectConfig'
      },
      channeledRoundsCorruptedOnStep8: {
        beforeStep8: {
          durationUnit: channeledRoundsSaved.typeConfig.durationUnit,
          resourceCost: channeledRoundsSaved.resourceCost,
          combat: channeledCombatBeforeStep8
        },
        afterStep8: {
          durationUnit: channeledAfterStep8.typeConfig.durationUnit,
          resourceCost: channeledAfterStep8.resourceCost,
          channelingConfig: channeledAfterStep8.channelingConfig,
          combat: channeledCombatAfterStep8
        },
        fixedBy: 'handoff/step8-channeling-preservation-20261120 (Step8Channeling.jsx preserves reopened empty channelingConfig until an explicit edit)'
      }
    });
  });

  test('8. legacyImportNormalizerSerializer: Documents legacy alias drops, normalizer coercions, category overwrites, and migration regressions', async () => {
    seedEmpty();
    mountWizard();

    // A. handleLoadSpell drops legacy rollTable alias & flat OR triggerConfig verified above
    const legacyRollTableSpell = {
      id: 'audit-legacy-rolltable-alias',
      name: 'Legacy Roll Table Alias',
      description: 'Uses rollTable instead of rollableTable.',
      level: 1,
      spellType: 'ACTION',
      effectTypes: [],
      rollTable: {
        enabled: true,
        name: 'Legacy Fate',
        resolutionType: 'DICE',
        resolutionConfig: { diceType: 'd6' },
        entries: []
      }
    };
    await loadIntoWizardForEdit(legacyRollTableSpell);
    const loadedRollableTable = latestWizardState.rollableTable;
    expect(loadedRollableTable).toBeNull();

    // B. spellNormalizer coercions: canCrit -> true, rangeDistance 0 -> 30, resistance 0 -> 50, durationUnit hours -> rounds
    const normalizedLegacy = normalizeSpell({
      id: 'audit-norm-legacy',
      name: 'Legacy Effects Input',
      effects: {
        damage: { formula: '2d6', elementType: 'ember' },
        buff: { resistance: { type: 'ember', value: 0, durationUnit: 'hours' } },
        debuff: { duration: 2, durationUnit: 'hours', statModifiers: { strength: 2 } }
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'self',
        rangeDistance: 0,
        targetRestrictions: ['self']
      }
    });
    expect(normalizedLegacy.damageConfig.canCrit).toBe(true);
    expect(normalizedLegacy.targetingConfig.rangeDistance).toBe(30);
    expect(normalizedLegacy.buffConfig.statModifiers[0].magnitude).toBe(50);
    expect(normalizedLegacy.buffConfig.durationType).toBe('rounds');
    expect(normalizedLegacy.debuffConfig.durationUnit).toBe('rounds');

    // C. libraryManager.validateLibraryIntegrity overwrites user categories (e.g. 'favorites')
    const validatedLib = validateLibraryIntegrity({
      version: 1,
      spells: [{
        id: 'audit-fav',
        name: 'Favorite Fireball',
        effectTypes: ['damage'],
        categoryIds: ['favorites', 'custom_user_cat'],
        dateCreated: '2026-11-18T00:00:00.000Z',
        lastModified: '2026-11-18T00:00:00.000Z'
      }],
      categories: [
        { id: 'uncategorized', name: 'Uncategorized' },
        { id: 'favorites', name: 'Favorites' },
        { id: 'offensive', name: 'Offensive Magic' },
        { id: 'custom_user_cat', name: 'My Custom Cat' }
      ]
    });
    expect(validatedLib.spells[0].categoryIds).not.toContain('favorites');
    expect(validatedLib.categories.some((c) => c.id === 'custom_user_cat')).toBe(false);

    // D. libraryManager.migrateSpellVersion rewrites modern damageType: 'direct' -> damageTypes: ['direct']
    const migratedSpell = migrateSpellVersion({
      id: 'audit-migrate',
      name: 'Migrate Direct Damage',
      damageConfig: {
        damageType: 'direct',
        formula: '2d6',
        elementType: 'ember',
        resolution: 'DICE'
      }
    });
    expect(migratedSpell.damageConfig.damageType).toBeUndefined();
    expect(migratedSpell.damageConfig.damageTypes).toEqual(['direct']);

    // E. spellSerializer serializeSpell/deserializeSpell & effectTargeting blindspot in humanReadable/gameCode
    const serialized = serializeSpell({
      name: 'Effect Target Summary Check',
      targetingMode: 'effect',
      effectTypes: ['damage'],
      effectTargeting: { damage: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 45, targetRestrictions: ['enemy'] } },
      damageConfig: { damageType: 'direct', formula: '2d6', elementType: 'ember' }
    });
    const deserialized = deserializeSpell(serialized);
    const humanReadable = generateHumanReadable(deserialized);
    const gameCode = generateGameCode(deserialized);
    expect(deserialized.effectTargeting.damage.rangeDistance).toBe(45);
    expect(humanReadable).not.toMatch(/45/);

    recordFixture('legacyImportNormalizerSerializer', {
      capabilityMapFamily: 'targeting-single',
      capabilityMapCheck: 'supported-immediate-damage',
      findings: {
        rollTableAliasDroppedToNull: {
          before: legacyRollTableSpell.rollTable,
          afterLoad: loadedRollableTable,
          rootCause: 'SpellwizardApp.jsx:579'
        },
        normalizerCoercions: {
          damageCanCrit: normalizedLegacy.damageConfig.canCrit,
          selfHealRangeDistance: normalizedLegacy.targetingConfig.rangeDistance,
          buffZeroResistanceMagnitude: normalizedLegacy.buffConfig.statModifiers[0].magnitude,
          buffHoursDurationType: normalizedLegacy.buffConfig.durationType,
          debuffHoursDurationUnit: normalizedLegacy.debuffConfig.durationUnit,
          rootCause: 'spellNormalizer.js:362,392,437,451,622'
        },
        libraryIntegrityOverwritesFavoritesAndCustomCategories: {
          afterCategoryIds: validatedLib.spells[0].categoryIds,
          remainingCategoryIds: validatedLib.categories.map((c) => c.id),
          rootCause: 'libraryManager.js:428-437'
        },
        migrateSpellVersionRewritesDirectDamageType: {
          afterDamageConfig: migratedSpell.damageConfig,
          rootCause: 'libraryManager.js:678-681'
        },
        serializerHumanReadableEffectTargetingGap: {
          humanReadable,
          gameCode,
          rootCause: 'spellSerializer.js:766,875'
        }
      }
    });
  });
});
