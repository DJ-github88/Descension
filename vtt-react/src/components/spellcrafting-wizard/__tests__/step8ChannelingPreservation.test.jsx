/**
 * Regression suite for Step 8 Channeling data loss preservation.
 *
 * Reproduces the audit bug from fixtures/wizardRoundTripFixtures.json
 * (Tempest Channel — ROUNDS Area channel with Step 5 2 AP / 10 Mana):
 * reopening the saved spell, visiting Step 8 without editing, saving,
 * and reopening must preserve typeConfig.durationUnit, resourceCost,
 * empty channelingConfig, and the exact combat refusal reason.
 *
 * Also verifies:
 * - Genuinely new drafts keep expected Step 8 defaults without corrupting Step 5 AP/Mana
 * - Deliberate edits to supported TURNS channels still compile and round-trip cleanly
 * - Deliberate duration edits on ROUNDS channels preserve ROUNDS, Step 5 costs, and refusal reason
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard, CHANNELED_CAPABILITY } from '../../../services/authoredAbility';
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
  default: () => ({ user: { uid: 'step8-preservation-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const AUDIT_FIXTURE_PATH = path.join(__dirname, 'fixtures', 'wizardRoundTripFixtures.json');

let latestWizardState = null;
function Probes() {
  latestWizardState = useSpellWizardState();
  return null;
}

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
  const compiled = definitionFromWizard(clone(record), {
    roomId: 'room-step8',
    definitionVersion: 1,
    classId: 'arcanoneer',
    allowProposedAreaRoll: false
  });
  const plan = explainExecution(clone(record), {
    roomId: 'room-step8',
    definitionVersion: 1,
    classId: 'arcanoneer'
  });
  return {
    compiledOk: compiled.ok,
    compiledReason: compiled.ok ? null : compiled.reason,
    planState: plan.state,
    planReason: plan.reasons?.[0]?.text || null,
    definition: compiled.ok ? compiled.definition : null
  };
}

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function fillBasicInfo({ name, description, elementLabel }) {
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Enter a name for your spell'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), { target: { value: description } });
  });
  if (elementLabel) {
    await act(async () => { fireEvent.click(screen.getByText(elementLabel, { selector: '.element-name' })); });
  }
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
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Finalize$/i })); });
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
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Update$/i })); });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === savedRecord.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });
  return clone(mockPersisted.data.spells.find((s) => s.id === savedRecord.id));
}

async function saveViaReviewUpdateAndWait(savedRecord) {
  const prevModified = savedRecord.lastModified;
  await clickStep('Review');
  const updateBtn = await screen.findByRole('button', { name: /^Update Spell$/i });
  await act(async () => { fireEvent.click(updateBtn); });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === savedRecord.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });
  return clone(mockPersisted.data.spells.find((s) => s.id === savedRecord.id));
}

function getStep8Card(titleRegex) {
  const cards = Array.from(document.querySelectorAll('.channeling-container .pf-card'));
  const card = cards.find((el) => titleRegex.test(el.textContent || ''));
  expect(card).toBeTruthy();
  return card;
}

async function authorTempestChannelBeforeStep8() {
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
  await act(async () => { fireEvent.click(screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' })); });
  await act(async () => { fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d6' } }); });

  await clickStep('Targeting');
  await act(async () => { fireEvent.click(screen.getByText('Area of Effect', { selector: '.targeting-option-name' })); });
  await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });

  await clickStep('Resources');
  await setResourceCostInput('Action Points', /Action Points/i, 2);
  await setResourceCostInput('Mana', /Mana/i, 10);

  return finalizeNewSpell();
}

beforeEach(() => {
  mockPersisted = null;
  latestWizardState = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Step 8 Channeling Preservation Regression Suite', () => {
  jest.setTimeout(35000);

  test('1. Reproduces audit fixture ROUNDS channel bug and preserves durationUnit, Step 5 AP/Mana, empty channelingConfig, and refusal reason on Step 8 visit without editing', async () => {
    const auditFixtures = JSON.parse(fs.readFileSync(AUDIT_FIXTURE_PATH, 'utf8'));
    const fixtureBeforeStep8 = auditFixtures.cases.nonApprovedDraftsAndChannelTable.channeledRoundsCorruptedOnStep8.beforeStep8;
    expect(fixtureBeforeStep8.durationUnit).toBe('ROUNDS');
    expect(fixtureBeforeStep8.resourceCost.actionPoints).toBe(2);
    expect(fixtureBeforeStep8.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });

    seedEmpty();
    mountWizard();
    const saved = await authorTempestChannelBeforeStep8();
    const combatBefore = summarizeCombat(saved);

    expect(saved.typeConfig.durationUnit).toBe(fixtureBeforeStep8.durationUnit);
    expect(saved.resourceCost.actionPoints).toBe(fixtureBeforeStep8.resourceCost.actionPoints);
    expect(saved.resourceCost.resourceTypes).toEqual(fixtureBeforeStep8.resourceCost.resourceTypes);
    expect(saved.resourceCost.resourceValues).toEqual(fixtureBeforeStep8.resourceCost.resourceValues);
    expect(combatBefore.compiledOk).toBe(false);
    expect(combatBefore.compiledReason).toBe(fixtureBeforeStep8.combat.compiledReason);
    expect(combatBefore.planReason).toBe(fixtureBeforeStep8.combat.planReason);

    // Reopen saved ROUNDS channel -> visit Step 8 without editing -> inspect UI -> Update -> Reopen
    await loadIntoWizardForEdit(saved);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);

    const durationCard = getStep8Card(/Duration/i);
    const durationInput = durationCard.querySelector('input[type="number"]');
    expect(Number(durationInput.value)).toBe(3);
    expect(within(durationCard).getByText('Rounds')).toHaveClass('pf-button-selected');
    expect(within(durationCard).getByText('Turns')).not.toHaveClass('pf-button-selected');

    const costCard = getStep8Card(/Cost Amount/i);
    const costInput = costCard.querySelector('input[type="number"]');
    expect(Number(costInput.value)).toBe(0);

    const updatedViaHeader = await clickHeaderUpdateAndWait(saved);
    const combatAfterHeader = summarizeCombat(updatedViaHeader);

    expect(updatedViaHeader.typeConfig.durationUnit).toBe('ROUNDS');
    expect(updatedViaHeader.typeConfig.maxChannelDuration).toBe(3);
    expect(updatedViaHeader.typeConfig.tickFrequency).toBe('START_OF_TURN');
    expect(updatedViaHeader.typeConfig.concentrationDC).toBe(12);
    expect(updatedViaHeader.typeConfig.dcType).toBe('CONSTITUTION');
    expect(updatedViaHeader.resourceCost.actionPoints).toBe(2);
    expect(updatedViaHeader.resourceCost.resourceTypes).toEqual(['actionPoints', 'mana']);
    expect(updatedViaHeader.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });
    expect(updatedViaHeader.channelingConfig).toEqual({});
    expect(combatAfterHeader.compiledOk).toBe(false);
    expect(combatAfterHeader.compiledReason).toBe(fixtureBeforeStep8.combat.compiledReason);
    expect(combatAfterHeader.planReason).toBe(fixtureBeforeStep8.combat.planReason);

    // Reopen again, visit Step 8 without editing, and save via Step 10 Review Update Spell too
    await loadIntoWizardForEdit(updatedViaHeader);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);
    const updatedViaReview = await saveViaReviewUpdateAndWait(updatedViaHeader);
    const combatAfterReview = summarizeCombat(updatedViaReview);

    expect(updatedViaReview.typeConfig.durationUnit).toBe('ROUNDS');
    expect(updatedViaReview.resourceCost.actionPoints).toBe(2);
    expect(updatedViaReview.resourceCost.resourceTypes).toEqual(['actionPoints', 'mana']);
    expect(updatedViaReview.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });
    expect(updatedViaReview.channelingConfig).toEqual({});
    expect(combatAfterReview.compiledReason).toBe(fixtureBeforeStep8.combat.compiledReason);
    expect(combatAfterReview.planReason).toBe(fixtureBeforeStep8.combat.planReason);

    // Final reopen check verifies Wizard controls still reflect the saved ROUNDS / Step 5 values
    await loadIntoWizardForEdit(updatedViaReview);
    await clickStep('Spell Type');
    expect((await screen.findByLabelText(/Duration Unit/i)).value).toBe('ROUNDS');
    await clickStep('Resources');
    const apBlock = Array.from(document.querySelectorAll('.resource-cost-config'))
      .find((el) => /Action Points/i.test(el.querySelector('.resource-type-name')?.textContent || ''));
    const manaBlock = Array.from(document.querySelectorAll('.resource-cost-config'))
      .find((el) => /^Mana/i.test(el.querySelector('.resource-type-name')?.textContent?.trim() || ''));
    expect(Number(apBlock.querySelector('input.resource-input').value)).toBe(2);
    expect(Number(manaBlock.querySelector('input.resource-input').value)).toBe(10);
  });

  test('2. Genuinely new drafts keep expected Step 8 defaults without corrupting Step 5 AP/Mana', async () => {
    // 2a. New single-target CHANNELED draft gets flat 'channeled' defaults and keeps Step 5 2 AP / 10 Mana
    seedEmpty();
    mountWizard();
    await fillBasicInfo({ name: 'New Single Channel', description: 'Single target beam.', elementLabel: 'Arcane' });
    await configureChanneledType({ maxChannelDuration: 3, durationUnit: 'TURNS', tickFrequency: 'START_OF_TURN', concentrationDC: 12, dcType: 'CONSTITUTION' });
    await clickStep('Effects');
    await act(async () => { fireEvent.click(screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' })); });
    await act(async () => { fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d6' } }); });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 2);
    await setResourceCostInput('Mana', /Mana/i, 10);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);

    expect(latestWizardState.channelingConfig.type).toBe('channeled');
    expect(latestWizardState.channelingConfig.maxDuration).toBe(3);
    expect(latestWizardState.channelingConfig.durationUnit).toBe('turns');
    expect(latestWizardState.channelingConfig.costValue).toBe(0);
    expect(latestWizardState.channelingConfig.costTrigger).toBe('none');
    expect(latestWizardState.resourceCost.actionPoints).toBe(2);
    expect(latestWizardState.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });
    cleanup();

    // 2b. New Area CHANNELED draft with Step 5 UNTOUCHED initializes legacy area_expand defaults cleanly
    seedEmpty();
    mountWizard();
    await fillBasicInfo({ name: 'New Untouched Area Channel', description: 'Area channel without Step 5.', elementLabel: 'Storm' });
    await configureChanneledType({ maxChannelDuration: 3, durationUnit: 'TURNS', tickFrequency: 'END_OF_TURN', concentrationDC: 10, dcType: 'SPIRIT' });
    await clickStep('Effects');
    await act(async () => { fireEvent.click(screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' })); });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Area of Effect', { selector: '.targeting-option-name' })); });
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);

    expect(latestWizardState.channelingConfig.type).toBe('area_expand');
    expect(latestWizardState.channelingConfig.durationUnit).toBe('turns');
    expect(latestWizardState.channelingConfig.costTrigger).toBe('per_turn');
    expect(latestWizardState.channelingConfig.costType).toBe('mana');
    expect(latestWizardState.channelingConfig.costValue).toBe(5);
    expect(latestWizardState.resourceCost.resourceTypes).toEqual(['mana']);
    expect(latestWizardState.resourceCost.resourceValues).toEqual({ mana: 5 });
    cleanup();

    // 2c. New Area CHANNELED draft with Step 2 ROUNDS + Step 5 2 AP / 10 Mana preserves ROUNDS and AP/Mana
    seedEmpty();
    mountWizard();
    await fillBasicInfo({ name: 'New Rounds Area Channel', description: 'Area channel in rounds.', elementLabel: 'Storm' });
    await configureChanneledType({ maxChannelDuration: 3, durationUnit: 'ROUNDS', tickFrequency: 'START_OF_TURN', concentrationDC: 12, dcType: 'CONSTITUTION' });
    await clickStep('Effects');
    await act(async () => { fireEvent.click(screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' })); });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Area of Effect', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 2);
    await setResourceCostInput('Mana', /Mana/i, 10);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);

    expect(latestWizardState.typeConfig.durationUnit).toBe('ROUNDS');
    expect(latestWizardState.channelingConfig.durationUnit).toBe('rounds');
    expect(latestWizardState.channelingConfig.costType).toBe('mana');
    expect(latestWizardState.resourceCost.actionPoints).toBe(2);
    expect(latestWizardState.resourceCost.resourceTypes).toEqual(['actionPoints', 'mana']);
    expect(latestWizardState.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });
  });

  test('3. Deliberate duration edit to a supported TURNS channel in Step 8 saves, reopens, and compiles cleanly', async () => {
    seedEmpty();
    mountWizard();
    await fillBasicInfo({ name: 'Arcane Beam', description: 'Sustained single-target beam.', elementLabel: 'Arcane' });
    await configureChanneledType({ maxChannelDuration: 3, durationUnit: 'TURNS', tickFrequency: 'START_OF_TURN', concentrationDC: 12, dcType: 'CONSTITUTION' });
    await clickStep('Effects');
    await act(async () => { fireEvent.click(screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' })); });
    await act(async () => { fireEvent.change(await screen.findByLabelText('Damage formula'), { target: { value: '1d6' } }); });
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(screen.getByText('Single Target', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.click(screen.getByText('Ranged', { selector: '.targeting-option-name' })); });
    await act(async () => { fireEvent.change(document.querySelector('input[type="range"]'), { target: { value: '30' } }); });
    await act(async () => { fireEvent.click(screen.getByText('Enemies', { selector: '.targeting-option-name' })); });
    await clickStep('Resources');
    await setResourceCostInput('Action Points', /Action Points/i, 2);
    await setResourceCostInput('Mana', /Mana/i, 10);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);

    const saved = await finalizeNewSpell();
    const combatBefore = summarizeCombat(saved);
    expect(combatBefore.compiledOk).toBe(true);
    expect(combatBefore.definition.capability).toBe(CHANNELED_CAPABILITY);
    expect(combatBefore.definition.channel.maxChannelDuration).toBe(3);
    expect(combatBefore.definition.channel.occurrences).toBe(3);

    await loadIntoWizardForEdit(saved);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);
    const durationCard = getStep8Card(/Duration/i);
    const durationInput = durationCard.querySelector('input[type="number"]');
    expect(Number(durationInput.value)).toBe(3);
    await act(async () => { fireEvent.change(durationInput, { target: { value: '4' } }); });

    const updated = await clickHeaderUpdateAndWait(saved);
    const combatAfter = summarizeCombat(updated);
    expect(updated.typeConfig.maxChannelDuration).toBe(4);
    expect(updated.typeConfig.durationUnit).toBe('TURNS');
    expect(updated.channelingConfig.maxDuration).toBe(4);
    expect(updated.resourceCost.actionPoints).toBe(2);
    expect(updated.resourceCost.resourceValues.mana).toBe(10);
    expect(combatAfter.compiledOk).toBe(true);
    expect(combatAfter.planState).toBe(STATES.PARTIAL);
    expect(combatAfter.definition.channel.maxChannelDuration).toBe(4);
    expect(combatAfter.definition.channel.occurrences).toBe(4);
    expect(combatAfter.definition.channel.durationUnit).toBe('TURNS');
    expect(combatAfter.definition.resourceCost).toEqual({ actionPoints: 2, mana: 10 });
  });

  test('4. Deliberate duration edit on a reopened ROUNDS channel preserves ROUNDS, Step 5 AP/Mana, and exact refusal reason', async () => {
    const auditFixtures = JSON.parse(fs.readFileSync(AUDIT_FIXTURE_PATH, 'utf8'));
    const expectedReason = auditFixtures.cases.nonApprovedDraftsAndChannelTable.channeledRoundsCorruptedOnStep8.beforeStep8.combat.compiledReason;

    seedEmpty();
    mountWizard();
    const saved = await authorTempestChannelBeforeStep8();

    await loadIntoWizardForEdit(saved);
    await clickStep('Channeling');
    await screen.findByText(/Channel Duration & Behavior/i);
    const durationCard = getStep8Card(/Duration/i);
    const durationInput = durationCard.querySelector('input[type="number"]');
    await act(async () => { fireEvent.change(durationInput, { target: { value: '4' } }); });

    const updated = await clickHeaderUpdateAndWait(saved);
    const combatAfter = summarizeCombat(updated);
    expect(updated.typeConfig.maxChannelDuration).toBe(4);
    expect(updated.typeConfig.durationUnit).toBe('ROUNDS');
    expect(updated.resourceCost.actionPoints).toBe(2);
    expect(updated.resourceCost.resourceTypes).toEqual(['actionPoints', 'mana']);
    expect(updated.resourceCost.resourceValues).toEqual({ actionPoints: 2, mana: 10 });
    expect(combatAfter.compiledOk).toBe(false);
    expect(combatAfter.compiledReason).toBe(expectedReason);
  });
});
