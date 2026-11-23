/**
 * Pre-Review Step Compatibility & Dual-Journey Tests
 *
 * Proves that Step 4 (Triggers) and Step 8 (Rollable Table) surface the exact shared
 * `explainExecution(draftSubject(state), ctx)` result beside the relevant control,
 * with zero second set of support rules in the UI:
 *   1. Journey 1 (Trigger conflict -> fixed before Review -> ready for GM review):
 *      - Authoring conflicting triggers surfaces exact reason, supported alternative, and GM tasks in Step 4.
 *      - Removing the conflicting effect-specific trigger clears the blocker immediately before Review.
 *      - OR logic and Required State also surface beside the Trigger Mode/Logic controls and clear when fixed.
 *      - Step 4, Step 10 Review, UnifiedSpellCard, and AuthoredAdmission agree on executable status.
 *   2. Journey 2 (Unsupported outcome method -> kept manual -> save, reopen, export, import unchanged):
 *      - Weighted coin surfaces beside #coin-type; Cards (Tarot, 2 cards) surfaces beside Resolution Method.
 *      - Rollable Table + separate Damage effect refuses with exact compiler reason rather than claiming ready.
 *      - Keeping Cards manual saves intact, shows identical compiler result across Step 8, Review, and Saved Card,
 *        and preserves all authored choices across reopen, export, and import.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import UnifiedSpellCard from '../components/common/UnifiedSpellCard';
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
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard, OUTCOME_CAPABILITY } from '../../../services/authoredAbility';
import { CARD_UNSETTLED_REASON, WEIGHTED_COIN_REFUSAL } from '../../../services/randomOutcome';
import { draftSubject, explainExecution, STATES } from '../utils/executionCompatibility';

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
jest.mock('../../../store/authStore', () => {
  const auth = { user: { uid: 'pre-review-compat-user', isGuest: false } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(auth) : auth);
  useAuthStore.getState = () => auth;
  return { __esModule: true, default: useAuthStore };
});

const clone = (value) => JSON.parse(JSON.stringify(value));
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

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function fillBasicInfo({ name, description, school = 'Ember' }) {
  const nameInput = screen.getByPlaceholderText('Enter a name for your spell');
  const descInput = screen.getByPlaceholderText('Describe what your spell does and how it appears');
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(descInput, { target: { value: description } });
  });
  const schoolNode = screen.getByText(school, { exact: true });
  await act(async () => { fireEvent.click(schoolNode); });
}

async function configureImmediateActionType() {
  await clickStep('Spell Type');
  const timingSelect = document.getElementById('authoredActionTiming') || await (async () => {
    const actionCard = await screen.findByText(/^Action$/i);
    await act(async () => { fireEvent.click(actionCard); });
    return await screen.findByLabelText(/Action timing/i);
  })();
  await act(async () => { fireEvent.change(timingSelect, { target: { value: 'IMMEDIATE' } }); });
}

async function configureSingleRangedEnemies() {
  await clickStep('Targeting');
  const singleCard = await screen.findByText('Single Target');
  await act(async () => { fireEvent.click(singleCard); });
  const rangedCard = await screen.findByText('Ranged');
  await act(async () => { fireEvent.click(rangedCard); });
  const enemiesCard = await screen.findByText('Enemies');
  await act(async () => { fireEvent.click(enemiesCard); });
}

async function configureResources(apValue, manaValue) {
  await clickStep('Resources');
  if (!document.querySelector('.resource-cost-config input')) {
    const manaCard = await screen.findByText('Mana', { selector: '.resource-type-name, h4, span, div' });
    await act(async () => { fireEvent.click(manaCard); });
  }
  await waitFor(() => expect(document.querySelector('.resource-cost-config input')).toBeTruthy());
  const manaInput = document.querySelector('.resource-cost-config input');
  await act(async () => { fireEvent.change(manaInput, { target: { value: String(manaValue) } }); });
  if (apValue !== undefined) {
    const apCard = screen.queryByTitle('Basic action economy');
    if (apCard && document.querySelectorAll('.resource-cost-config input').length < 2) {
      await act(async () => { fireEvent.click(apCard); });
    }
    const apInput = document.querySelector('.resource-cost-config input[type="number"]');
    if (apInput && apValue !== 1) {
      await act(async () => { fireEvent.change(apInput, { target: { value: String(apValue) } }); });
    }
  }
}

async function configureNoCooldown() {
  await clickStep('Cooldown');
  const noCdBtn = await screen.findByRole('button', { name: /No Cooldown/i });
  await act(async () => { fireEvent.click(noCdBtn); });
}

async function finalizeNewSpell() {
  const prevCount = mockPersisted.data.spells.length;
  const finalizeBtn = screen.getByRole('button', { name: /^Finalize$/i });
  await act(async () => { fireEvent.click(finalizeBtn); });
  await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

beforeEach(() => {
  mockPersisted = null;
  latestWizardState = null;
  libraryApi = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
  useGameStore.setState({ isInMultiplayer: false, isGMMode: false, multiplayerRoom: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
  useGameStore.setState({ isInMultiplayer: false, isGMMode: false, multiplayerRoom: null });
});

describe('Pre-Review Spell Wizard compatibility & dual journeys', () => {
  jest.setTimeout(40000);

  test('Journey 1: trigger conflict surfaces beside Trigger controls, fixing before Review clears blocker and prepares spell for GM review', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Searing Follow-Up',
      description: 'An immediate ember strike offered after my damage.',
      school: 'Ember'
    });
    await configureImmediateActionType();

    await clickStep('Effects');
    const damageCard = await screen.findByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' });
    await act(async () => { fireEvent.click(damageCard); });
    const formulaInput = await screen.findByLabelText(/Damage formula/i);
    await act(async () => { fireEvent.change(formulaInput, { target: { value: '1d8' } }); });

    await clickStep('Triggers');

    // 1. Add Global "Follow-up After My Damage"
    const globalFollowUp = await screen.findByText('Follow-up After My Damage');
    await act(async () => { fireEvent.click(globalFollowUp.closest('.wow-trigger-option')); });

    // 2. Switch to Effect-Specific Triggers -> Direct Damage -> add "Follow-up After My Damage"
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Effect-Specific Triggers/i }));
    });
    const directCard = await screen.findByRole('button', { name: /Direct/i });
    await act(async () => { fireEvent.click(directCard); });
    const effectFollowUp = await screen.findByText('Follow-up After My Damage');
    await act(async () => { fireEvent.click(effectFollowUp.closest('.wow-trigger-option')); });

    // Verify Step 4 surfaces exact shared explainExecution result beside Selected Trigger Conditions
    const expectedConflictView = explainExecution(draftSubject(latestWizardState), { shared: false, gm: false });
    expect(expectedConflictView.state).toBe(STATES.UNSUPPORTED);
    expect(expectedConflictView.stepGuidance).toMatchObject({ stepId: 'triggers', controlId: 'triggers' });

    const inlineConflict = document.querySelector('.exec-compat-inline[data-state="unsupported"]');
    expect(inlineConflict).toBeTruthy();
    expect(inlineConflict).toHaveAttribute('data-compat-control', 'triggers');
    expect(inlineConflict.textContent).toContain(expectedConflictView.reasons[0].text);
    expect(inlineConflict.textContent).toContain(expectedConflictView.stepGuidance.alternative);
    expectedConflictView.manual.forEach((task) => {
      expect(inlineConflict.textContent).toContain(task);
    });

    // 3. Remove the conflicting effect-specific trigger before Review -> conflict clears immediately
    const removeEffectTriggerBtn = document.querySelector('.pf-selected-triggers .pf-remove-trigger');
    expect(removeEffectTriggerBtn).toBeTruthy();
    await act(async () => { fireEvent.click(removeEffectTriggerBtn); });

    await waitFor(() => {
      expect(latestWizardState.triggerConfig.effectTriggers).toEqual({});
      expect(document.querySelector('.exec-compat-inline[data-state="unsupported"]')).toBeNull();
    });

    // 4. Verify ANY CONDITION (OR) logic and Required State surface beside Trigger Mode / Logic controls
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Global Triggers/i }));
    });
    const anyConditionBtn = screen.getByRole('button', { name: /ANY CONDITION/i });
    await act(async () => { fireEvent.click(anyConditionBtn); });

    const logicNotice = document.querySelector('.exec-compat-inline[data-compat-control="trigger-logic"]');
    expect(logicNotice).toBeTruthy();
    expect(logicNotice).toHaveAttribute('data-state', 'unsupported');
    expect(logicNotice.textContent).toMatch(/ANY CONDITION \(OR\) trigger logic stays GM-manual/i);
    expect(logicNotice.textContent).toMatch(/ALL CONDITIONS \(AND\)/i);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ALL CONDITIONS/i }));
    });
    await waitFor(() => {
      expect(document.querySelector('.exec-compat-inline[data-compat-control="trigger-logic"]')).toBeNull();
    });

    const requiredStateBtn = screen.getByRole('button', { name: /Required State/i });
    await act(async () => { fireEvent.click(requiredStateBtn); });
    const reqNotice = document.querySelector('.exec-compat-inline[data-compat-control="required-state"]');
    expect(reqNotice).toBeTruthy();
    expect(reqNotice).toHaveAttribute('data-state', 'unsupported');
    expect(reqNotice.textContent).toMatch(/required casting conditions/i);
    expect(reqNotice.textContent).toMatch(/Switch Trigger Mode from Required State back to Triggers/i);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Triggers\s+When trigger is met/i }));
    });
    await waitFor(() => {
      expect(document.querySelector('.exec-compat-inline[data-compat-control="required-state"]')).toBeNull();
    });

    // 5. Complete Targeting, Resources, and Cooldown -> revisit Step 4 and verify ready state
    await configureSingleRangedEnemies();
    await configureResources(1, 2);
    await configureNoCooldown();

    await clickStep('Triggers');
    const step4Ready = document.querySelector('.exec-compat-inline[data-state="executable"]');
    expect(step4Ready).toBeTruthy();
    expect(step4Ready.textContent).toMatch(/Structurally compatible with a Prism route/i);

    // 6. Verify Review, Saved Card, and AuthoredAdmission all show exact shared executable verdict
    await clickStep('Review');
    const reviewCompat = document.querySelector('.exec-compat[data-state="executable"]');
    expect(reviewCompat).toBeTruthy();
    expect(reviewCompat.textContent).toMatch(/Structurally compatible with a Prism route/i);

    const saved = await finalizeNewSpell();
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.followUp).toBe('authored-followup-trigger:v1');

    const cardView = render(
      <SpellLibraryProvider>
        <UnifiedSpellCard spell={clone(saved)} variant="wizard" showDescription showStats showTags />
      </SpellLibraryProvider>
    );
    expect(cardView.container.querySelector('[data-behavior-status="supported"]')).toBeInTheDocument();
    expect(cardView.container.textContent).toContain('OFFERED WHEN');
    cardView.unmount();

    await act(async () => {
      useGameStore.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: 'room-1' } });
    });
    const admissionView = render(<AuthoredAdmission spell={clone(saved)} />);
    expect(admissionView.container.querySelector('.exec-compat[data-state="executable"]')).toBeTruthy();
    expect(within(admissionView.container).getByRole('button', { name: 'Admit this saved version' })).toBeEnabled();
  });

  test('Journey 2: unsupported outcome method (Cards / Weighted coin / table conflict) surfaces beside control, stays intact across save, reopen, export, and import', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Tarot of Cinders',
      description: 'Draws a Tarot card to scorch or mend.',
      school: 'Ember'
    });
    await configureImmediateActionType();

    await clickStep('Effects');
    const outcomeCard = await screen.findByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i);
    await act(async () => { fireEvent.click(outcomeCard); });

    await configureSingleRangedEnemies();
    await configureResources(1, 2);
    await configureNoCooldown();

    await clickStep('Rollable Table');
    await act(async () => {
      fireEvent.change(document.getElementById('table-name'), { target: { value: 'Cinder Tarot' } });
      fireEvent.change(document.getElementById('table-description'), { target: { value: 'Tarot draw outcomes.' } });
    });

    // Check Weighted Coin surfaces right inside the Coin Type field beside #coin-type
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Coins$/i })); });
    const coinTypeSelect = await screen.findByLabelText(/Coin Type/i);
    await act(async () => { fireEvent.change(coinTypeSelect, { target: { value: 'weighted' } }); });

    const expectedWeightedView = explainExecution(draftSubject(latestWizardState), { shared: false, gm: false });
    const coinFieldGroup = coinTypeSelect.closest('.form-group');
    const weightedInline = coinFieldGroup.querySelector('.exec-compat-inline[data-compat-control="coin-type"]');
    expect(weightedInline).toBeTruthy();
    expect(weightedInline).toHaveAttribute('data-state', 'unsupported');
    expect(weightedInline.textContent).toContain(expectedWeightedView.reasons[0].text);
    expect(weightedInline.textContent).toContain(expectedWeightedView.stepGuidance.alternative);
    expect(WEIGHTED_COIN_REFUSAL).toMatch(/Weighted coins/i);

    // Check Cards (Tarot, 2 cards) surfaces exact shared explainExecution beside Resolution Method
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Cards$/i })); });
    const deckSelect = await screen.findByLabelText(/Deck Type/i);
    const cardCountInput = await screen.findByLabelText(/Number of Cards/i);
    await act(async () => {
      fireEvent.change(deckSelect, { target: { value: 'tarot' } });
      fireEvent.change(cardCountInput, { target: { value: '2' } });
    });

    const expectedCardsView = explainExecution(draftSubject(latestWizardState), { shared: false, gm: false });
    expect(expectedCardsView.state).toBe(STATES.UNSUPPORTED);
    expect(expectedCardsView.reasons[0].text).toBe(CARD_UNSETTLED_REASON);
    expect(expectedCardsView.stepGuidance).toMatchObject({ stepId: 'rollable-table', controlId: 'resolution-method' });

    const step8Statuses = screen.getAllByRole('status');
    expect(step8Statuses).toHaveLength(1);
    const step8Notice = step8Statuses[0];
    expect(step8Notice).toHaveAttribute('data-state', 'unsupported');
    expect(step8Notice).toHaveAttribute('data-compat-control', 'resolution-method');
    expect(step8Notice.textContent).toContain(expectedCardsView.reasons[0].text);
    expect(step8Notice.textContent).toContain(expectedCardsView.stepGuidance.alternative);
    expectedCardsView.manual.forEach((task) => {
      expect(step8Notice.textContent).toContain(task);
    });

    // Keep Cards manual and proceed to Review -> verify exact same compiler result
    await clickStep('Review');
    const reviewCompat = document.querySelector('.exec-compat[data-state="unsupported"]');
    expect(reviewCompat).toBeTruthy();
    expect(reviewCompat.textContent).toContain(expectedCardsView.reasons[0].text);
    expectedCardsView.manual.forEach((task) => {
      expect(reviewCompat.textContent).toContain(task);
    });
    expect(within(reviewCompat).getByRole('button', { name: /Go to Resolution Method \(Rollable Table\)/i })).toBeInTheDocument();

    // Save draft intact
    const saved = await finalizeNewSpell();
    expect(saved.rollableTable).toMatchObject({
      enabled: true,
      name: 'Cinder Tarot',
      description: 'Tarot draw outcomes.',
      resolutionType: 'CARDS',
      resolutionConfig: expect.objectContaining({
        cardCount: 2,
        deckType: 'tarot'
      })
    });
    expect(saved.rollableTable.entries).toHaveLength(2);
    expect(definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 }).ok).toBe(false);

    // Saved Card + AuthoredAdmission show exact same compiler result
    const savedCard = render(
      <SpellLibraryProvider>
        <UnifiedSpellCard spell={clone(saved)} variant="wizard" showDescription showStats showTags />
      </SpellLibraryProvider>
    );
    expect(savedCard.container.querySelector('[data-behavior-status="manual"]')).toBeInTheDocument();
    expect(savedCard.container.textContent).toContain(CARD_UNSETTLED_REASON);
    savedCard.unmount();

    await act(async () => {
      useGameStore.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: 'room-1' } });
    });
    const admission = render(<AuthoredAdmission spell={clone(saved)} />);
    const admissionCompat = admission.container.querySelector('.exec-compat[data-state="unsupported"]');
    expect(admissionCompat).toBeTruthy();
    expect(admissionCompat.textContent).toContain(expectedCardsView.reasons[0].text);
    expectedCardsView.manual.forEach((task) => {
      expect(admissionCompat.textContent).toContain(task);
    });
    expect(within(admission.container).getByRole('button', { name: 'Admit this saved version' })).toBeDisabled();
    admission.unmount();
    await act(async () => {
      useGameStore.setState({ isInMultiplayer: false, isGMMode: false, multiplayerRoom: null });
    });

    // Reopen saved spell in Wizard -> authored choices & Step 8 notice stay identical
    await act(async () => { window.handleLoadSpell(clone(saved), true); });
    await waitFor(() => expect(latestWizardState?.editMode).toBe(true));
    await clickStep('Rollable Table');
    expect(document.getElementById('table-name').value).toBe('Cinder Tarot');
    expect(document.getElementById('deck-type').value).toBe('tarot');
    expect(document.getElementById('card-count').value).toBe('2');
    expect(screen.getByRole('button', { name: /^Cards$/i })).toHaveClass('active');
    const reopenedNotice = screen.getByRole('status');
    expect(reopenedNotice.textContent).toContain(expectedCardsView.reasons[0].text);
    expectedCardsView.manual.forEach((task) => {
      expect(reopenedNotice.textContent).toContain(task);
    });

    // Export payload -> Import back into library -> verify imported copy keeps all authored choices & compiler result
    const exportedJson = JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        spells: [clone(saved)],
        categories: mockPersisted.data.categories
      }
    });
    const parsedImport = JSON.parse(exportedJson);
    await act(async () => {
      libraryApi.dispatch(libraryActionCreators.importLibrary(parsedImport.data));
    });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    const importedCopy = mockPersisted.data.spells.find((s) => s.id !== saved.id);
    expect(importedCopy).toBeTruthy();
    expect(importedCopy.name).toBe('Tarot of Cinders (Imported)');
    expect(importedCopy.rollableTable).toEqual(saved.rollableTable);
    expect(importedCopy.authoredDraft.rollableTable).toEqual(saved.authoredDraft.rollableTable);

    const importedExplain = explainExecution(clone(importedCopy), { shared: false, gm: false });
    expect(importedExplain.state).toBe(expectedCardsView.state);
    expect(importedExplain.reasons).toEqual(expectedCardsView.reasons);
    expect(importedExplain.manual).toEqual(expectedCardsView.manual);

    // Reopen imported copy in Wizard -> verify identical Rollable Table settings & inline notice
    await act(async () => { window.handleLoadSpell(clone(importedCopy), true); });
    await waitFor(() => expect(latestWizardState?.editingSpellId).toBe(importedCopy.id));
    await clickStep('Rollable Table');
    expect(document.getElementById('table-name').value).toBe('Cinder Tarot');
    expect(document.getElementById('deck-type').value).toBe('tarot');
    expect(document.getElementById('card-count').value).toBe('2');
    expect(screen.getByRole('status').textContent).toContain(expectedCardsView.reasons[0].text);

    // Extra check: Rollable Table + separate Damage effect refuses rather than falsely saying ready
    await clickStep('Effects');
    const dmgCard = await screen.findByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' });
    await act(async () => { fireEvent.click(dmgCard); });
    await clickStep('Rollable Table');
    const diceBtn = screen.getByRole('button', { name: /^Dice$/i });
    await act(async () => { fireEvent.click(diceBtn); });
    const conflictStatus = screen.getByRole('status');
    expect(conflictStatus).toHaveAttribute('data-state', 'unsupported');
    expect(conflictStatus.textContent).toMatch(/author their effects inside the Rollable Table only/i);
    expect(conflictStatus.textContent).not.toMatch(/Executable outcome table ready/i);
  });
});
