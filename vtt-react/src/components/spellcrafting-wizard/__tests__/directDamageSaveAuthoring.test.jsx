/**
 * Direct-Damage Save Authoring & Preservation — Mounted Wizard Controls
 *
 * Authors four representative records from scratch through actual mounted Wizard controls:
 *   1. Direct damage with a damage-local save (Agility DC 14, no partial effect)
 *   2. Direct damage with save-for-half using the existing authored option (Partial Effect -> damage/2)
 *   3. Supported rider-local save as an unchanged control (authored-effect:v1 movement + Constitution DC 12 negates)
 *   4. Unsupported combination (damage-local save-for-half + rider-local save) that must preserve/refuse whole
 *
 * Verifies save -> reopen -> Update -> duplicate -> cancel preservation, records rawDraft,
 * savedOuterRecord, serializedData, and fixtureOrigin (no silent hand-injected repair),
 * and captures the genuine Wizard-authored records into fixtures/directDamageSaveFixtures.json.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';

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
  default: () => ({ user: { uid: 'direct-damage-save-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'directDamageSaveFixtures.json');

let libraryApi = null;
let latestWizardState = null;

function Probes() {
  const libState = useSpellLibrary();
  const libDispatch = useSpellLibraryDispatch();
  const wizState = useSpellWizardState();
  libraryApi = { state: libState, dispatch: libDispatch };
  latestWizardState = wizState;
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

async function clickStep(_stepNumber, stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

async function fillBasicInfo({ name, description, elementLabel }) {
  const nameInput = screen.getByPlaceholderText('Enter a name for your spell');
  const descInput = screen.getByPlaceholderText('Describe what your spell does and how it appears');
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(descInput, { target: { value: description } });
  });
  if (elementLabel) {
    const elBtn = screen.getByText(elementLabel);
    await act(async () => { fireEvent.click(elBtn); });
  }
}

async function configureImmediateActionType() {
  await clickStep(2, 'Spell Type');
  const timingSelect = document.getElementById('authoredActionTiming') || await (async () => {
    const actionCard = await screen.findByText(/^Action$/i);
    await act(async () => { fireEvent.click(actionCard); });
    return await screen.findByLabelText(/Action timing/i);
  })();
  await act(async () => { fireEvent.change(timingSelect, { target: { value: 'IMMEDIATE' } }); });
}

async function selectEffectCard(titleText) {
  const heading = screen.getByText(titleText, { selector: '.selection-card-title, h4, h3, span, div' });
  await act(async () => { fireEvent.click(heading); });
}

async function configureDamageWithSave({ formula, saveAbility, dc, partialHalf }) {
  const formulaInput = await screen.findByLabelText('Damage formula');
  await act(async () => { fireEvent.change(formulaInput, { target: { value: formula } }); });

  const saveBtn = screen.getByRole('button', { name: /Saving Throw/i });
  await act(async () => { fireEvent.click(saveBtn); });

  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  const modalRoot = dialogs.find((d) => /Saving Throw Configuration/i.test(d.getAttribute('aria-label') || d.textContent || ''));
  if (!modalRoot) {
    throw new Error(`Saving Throw dialog not found. saveBtn=${saveBtn.className}, dialogs=${dialogs.length}, bodyHasText=${/Saving Throw Configuration/i.test(document.body.textContent || '')}`);
  }

  const enableCheckbox = within(modalRoot).getByLabelText(/Enable Saving Throw/i);
  if (!enableCheckbox.checked) {
    await act(async () => { fireEvent.click(enableCheckbox); });
  }

  const saveTypeSelect = within(modalRoot).getByRole('combobox');
  await act(async () => { fireEvent.change(saveTypeSelect, { target: { value: saveAbility } }); });

  // Default DC in SavingThrowConfig is 15; adjust via real - / + buttons
  let currentDc = Number(modalRoot.querySelector('.multiplier-display')?.textContent || '15');
  const minusBtn = within(modalRoot).getByRole('button', { name: '-' });
  const plusBtn = within(modalRoot).getByRole('button', { name: '+' });
  while (currentDc > dc) {
    await act(async () => { fireEvent.click(minusBtn); });
    currentDc -= 1;
  }
  while (currentDc < dc) {
    await act(async () => { fireEvent.click(plusBtn); });
    currentDc += 1;
  }

  if (partialHalf) {
    const partialCheckbox = within(modalRoot).getByLabelText(/Partial Effect on Successful Save/i);
    if (!partialCheckbox.checked) {
      await act(async () => { fireEvent.click(partialCheckbox); });
    }
    const halfCard = await within(modalRoot).findByText('Half Damage');
    await act(async () => { fireEvent.click(halfCard); });
  }

  const closeBtn = within(modalRoot).getByRole('button', { name: 'Close' });
  await act(async () => { fireEvent.click(closeBtn); });
}

async function configureRiderMovementSave({ label, movementFeet, ability, dc, durationText, gmNote }) {
  // Switch to Control tab if both Damage and Control are selected
  const controlTab = document.querySelectorAll('.effect-type-tab');
  const tabBtn = Array.from(controlTab).find((el) => /Control/i.test(el.textContent || ''));
  if (tabBtn) {
    await act(async () => { fireEvent.click(tabBtn); });
  }

  const profileBtn = await screen.findByRole('button', {
    name: /Use composed effect profile/i
  });
  await act(async () => { fireEvent.click(profileBtn); });

  const effectSelect = await screen.findByLabelText(/Canonical effect/i);
  await act(async () => { fireEvent.change(effectSelect, { target: { value: 'movement' } }); });

  const nameInput = await screen.findByLabelText(/Effect name shown on the target/i);
  const feetInput = await screen.findByLabelText(/Movement change/i);
  const expirySelect = await screen.findByLabelText(/Expiry/i);
  const saveCheck = await screen.findByLabelText(/The target may save to negate this effect/i);
  const durationInput = await screen.findByLabelText(/Source-authored duration text/i);
  const gmNoteInput = await screen.findByLabelText(/Required GM adjudication note/i);

  await act(async () => {
    fireEvent.change(nameInput, { target: { value: label } });
    fireEvent.change(feetInput, { target: { value: String(movementFeet) } });
    fireEvent.change(expirySelect, { target: { value: 'gm-manual' } });
    if (!saveCheck.checked) fireEvent.click(saveCheck);
  });

  const abilitySelect = await screen.findByLabelText(/Saving ability/i);
  const dcInput = await screen.findByLabelText(/Difficulty \(DC/i);
  await act(async () => {
    fireEvent.change(abilitySelect, { target: { value: ability } });
    fireEvent.change(dcInput, { target: { value: String(dc) } });
    fireEvent.change(durationInput, { target: { value: durationText } });
    fireEvent.change(gmNoteInput, { target: { value: gmNote } });
  });
}

async function configureSingleRangedTargeting() {
  await clickStep(5, 'Targeting');
  const singleCard = await screen.findByText('Single Target');
  await act(async () => { fireEvent.click(singleCard); });
  const rangedCard = await screen.findByText('Ranged');
  await act(async () => { fireEvent.click(rangedCard); });
}

async function configureExplicitResources(manaValue = 2) {
  await clickStep(6, 'Resources');
  if (!document.querySelector('.resource-cost-config input')) {
    const manaCard = await screen.findByText('Mana', { selector: '.resource-type-name, h4, span, div' });
    await act(async () => { fireEvent.click(manaCard); });
  }
  await waitFor(() => expect(document.querySelector('.resource-cost-config input')).toBeTruthy());
  const manaInput = document.querySelector('.resource-cost-config input');
  await act(async () => { fireEvent.change(manaInput, { target: { value: String(manaValue) } }); });
}

async function finalizeNewSpell() {
  const prevCount = mockPersisted.data.spells.length;
  const finalizeBtn = screen.getByRole('button', { name: /^Finalize$/i });
  await act(async () => { fireEvent.click(finalizeBtn); });
  await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

async function reopenUpdateDuplicateCancel(savedRecord, updatedDescription) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => { window.handleLoadSpell(clone(savedRecord), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(`Editing Spell: ${savedRecord.name}`));

  // Edit description in Step 1 Basic Info
  await clickStep(1, 'Basic Info');
  const descInput = screen.getByPlaceholderText('Describe what your spell does and how it appears');
  await act(async () => { fireEvent.change(descInput, { target: { value: updatedDescription } }); });

  const prevModified = savedRecord.lastModified;
  const updateBtn = screen.getByRole('button', { name: /^Update$/i });
  await act(async () => { fireEvent.click(updateBtn); });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === savedRecord.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });

  const updated = clone(mockPersisted.data.spells.find((s) => s.id === savedRecord.id));
  expect(updated.id).toBe(savedRecord.id);
  expect(updated.dateCreated).toBe(savedRecord.dateCreated);
  expect(updated.authoredDefinitionId).toBe(savedRecord.authoredDefinitionId);
  expect(updated.description).toBe(updatedDescription);
  expect(updated.authoredDraft.description).toBe(updatedDescription);
  expect(JSON.parse(updated.serializedData).description).toBe(updatedDescription);

  // Duplicate in library
  const beforeDupCount = libraryApi.state.spells.length;
  act(() => { libraryApi.dispatch(libraryActionCreators.duplicateSpell(updated.id)); });
  await waitFor(() => expect(libraryApi.state.spells.length).toBe(beforeDupCount + 1));
  const copy = clone(libraryApi.state.spells.find((s) => s.name === `${updated.name} (Copy)`));
  expect(copy).toBeTruthy();
  expect(copy.id).not.toBe(updated.id);
  expect(copy.authoredDefinitionId).toBe(updated.authoredDefinitionId);

  // Reopen & Cancel Edit leaves saved record unmodified
  showConfirm.mockResolvedValueOnce(true);
  await act(async () => { window.handleLoadSpell(clone(updated), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(`Editing Spell: ${updated.name}`));
  await clickStep(1, 'Basic Info');
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
      target: { value: 'DISCARDED_CANCEL_EDIT' }
    });
  });
  const cancelBtn = screen.getByRole('button', { name: /^Cancel Edit$/i });
  await act(async () => { fireEvent.click(cancelBtn); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')).toBeNull());
  const afterCancel = clone(mockPersisted.data.spells.find((s) => s.id === updated.id));
  expect(afterCancel).toEqual(updated);

  return { updated, copy };
}

beforeEach(() => {
  mockPersisted = null;
  libraryApi = null;
  latestWizardState = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Direct-damage save mounted Wizard authoring, preservation, and fixture capture', () => {
  jest.setTimeout(30000);

  test('authors 4 representative records through real mounted Wizard controls, verifies lifecycle, and captures genuine fixtures', async () => {
    const captured = {};

    // 1. Direct damage with a damage-local save (Agility DC 14, no partial effect)
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Ember Bolt (Direct Save)',
      description: 'Direct ember damage with a damage-local Agility save.',
      elementLabel: 'Ember'
    });
    await configureImmediateActionType();
    await clickStep(3, 'Effects');
    await selectEffectCard('Damage');
    await configureDamageWithSave({ formula: '1d8+3', saveAbility: 'agility', dc: 14, partialHalf: false });
    await configureSingleRangedTargeting();
    await configureExplicitResources(2);
    const rawDraft1 = clone(latestWizardState);
    const saved1 = await finalizeNewSpell();
    expect(saved1.damageConfig.savingThrow).toBe('agility');
    expect(saved1.damageConfig.difficultyClass).toBe(14);
    expect(saved1.damageConfig.partialEffect).toBe(false);
    expect(saved1.damageConfig.savingThrowConfig).toMatchObject({ enabled: true, savingThrowType: 'agility', difficultyClass: 14, partialEffect: false });
    expect(definitionFromWizard(clone(saved1)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 14, outcome: "negates" });
    const lifecycle1 = await reopenUpdateDuplicateCancel(saved1, 'Updated direct save description.');
    expect(lifecycle1.updated.damageConfig).toEqual(saved1.damageConfig); expect(definitionFromWizard(clone(lifecycle1.updated)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 14, outcome: "negates" }); expect(definitionFromWizard(clone(lifecycle1.copy)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 14, outcome: "negates" });
    expect(lifecycle1.copy.damageConfig).toEqual(saved1.damageConfig);
    captured['direct-damage-local-save'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> Step1BasicInfo -> Step3Effects -> DamageEffects -> SavingThrowConfig -> Finalize',
      rawDraft: rawDraft1,
      savedOuterRecord: saved1,
      serializedData: saved1.serializedData
    };
    cleanup();

    // 2. Direct damage with save-for-half using existing authored option
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Scorching Ray (Save for Half)',
      description: 'Direct ember damage with Partial Effect on Successful Save (damage/2).',
      elementLabel: 'Ember'
    });
    await configureImmediateActionType();
    await clickStep(3, 'Effects');
    await selectEffectCard('Damage');
    await configureDamageWithSave({ formula: '2d6+3', saveAbility: 'agility', dc: 15, partialHalf: true });
    await configureSingleRangedTargeting();
    await configureExplicitResources(3);
    const rawDraft2 = clone(latestWizardState);
    const saved2 = await finalizeNewSpell();
    expect(saved2.damageConfig.savingThrow).toBe('agility');
    expect(saved2.damageConfig.difficultyClass).toBe(15);
    expect(saved2.damageConfig.partialEffect).toBe(true);
    expect(saved2.damageConfig.partialEffectFormula).toBe('damage/2');
    expect(definitionFromWizard(clone(saved2)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 15, outcome: "halves" });
    const lifecycle2 = await reopenUpdateDuplicateCancel(saved2, 'Updated save-for-half description.');
    expect(lifecycle2.updated.damageConfig).toEqual(saved2.damageConfig); expect(definitionFromWizard(clone(lifecycle2.updated)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 15, outcome: "halves" }); expect(definitionFromWizard(clone(lifecycle2.copy)).definition.save).toEqual({ scope: "direct", ability: "agility", dc: 15, outcome: "halves" });
    expect(lifecycle2.copy.damageConfig).toEqual(saved2.damageConfig);
    captured['direct-damage-save-for-half'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> Step1BasicInfo -> Step3Effects -> DamageEffects -> SavingThrowConfig (Partial Effect + Half Damage card) -> Finalize',
      rawDraft: rawDraft2,
      savedOuterRecord: saved2,
      serializedData: saved2.serializedData
    };
    cleanup();

    // 3. Supported rider-local save as an unchanged control
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Rime Snare (Rider Save Control)',
      description: 'Direct rime damage with a supported rider-local Constitution negates save.',
      elementLabel: 'Rime'
    });
    await configureImmediateActionType();
    await clickStep(3, 'Effects');
    await selectEffectCard('Damage');
    const formulaInput3 = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(formulaInput3, { target: { value: '1d8+3' } }); });
    await selectEffectCard('Control');
    await configureRiderMovementSave({
      label: 'Hobbled',
      movementFeet: -10,
      ability: 'constitution',
      dc: 12,
      durationText: 'for 1 round',
      gmNote: 'Table resolves the save.'
    });
    await configureSingleRangedTargeting();
    await configureExplicitResources(2);
    const rawDraft3 = clone(latestWizardState);
    const saved3 = await finalizeNewSpell();
    expect(saved3.controlConfig.authoredCondition.save).toEqual({ ability: 'constitution', dc: 12, outcome: 'negates' });
    const compiled3 = definitionFromWizard(clone(saved3));
    expect(compiled3).toEqual({ ok: true, definition: expect.any(Object) });
    const lifecycle3 = await reopenUpdateDuplicateCancel(saved3, 'Updated rider-local save control description.');
    expect(lifecycle3.updated.controlConfig).toEqual(saved3.controlConfig);
    expect(lifecycle3.copy.controlConfig).toEqual(saved3.controlConfig);
    expect(definitionFromWizard(clone(lifecycle3.updated)).ok).toBe(true);
    captured['rider-local-save-control'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> Step1BasicInfo -> Step3Effects -> DamageEffects + AuthoredConditionFields (movement + save) -> Finalize',
      rawDraft: rawDraft3,
      savedOuterRecord: saved3,
      serializedData: saved3.serializedData
    };
    cleanup();

    // 4. Unsupported combination (damage-local save-for-half + rider-local save) -> preserve whole & refuse whole
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Frostfire Paradox (Unsupported Combo)',
      description: 'Direct damage with a damage-local save AND a rider-local save.',
      elementLabel: 'Rime'
    });
    await configureImmediateActionType();
    await clickStep(3, 'Effects');
    await selectEffectCard('Damage');
    await configureDamageWithSave({ formula: '1d8+3', saveAbility: 'agility', dc: 14, partialHalf: true });
    await selectEffectCard('Control');
    await configureRiderMovementSave({
      label: 'Frostbitten',
      movementFeet: -10,
      ability: 'constitution',
      dc: 12,
      durationText: 'for 1 round',
      gmNote: 'Both saves stay manual.'
    });
    await configureSingleRangedTargeting();
    await configureExplicitResources(2);
    const rawDraft4 = clone(latestWizardState);
    const saved4 = await finalizeNewSpell();
    expect(saved4.damageConfig.savingThrow).toBe('agility');
    expect(saved4.damageConfig.partialEffect).toBe(true);
    expect(saved4.controlConfig.authoredCondition.save).toEqual({ ability: 'constitution', dc: 12, outcome: 'negates' });
    expect(definitionFromWizard(clone(saved4)).ok).toBe(false);
    const lifecycle4 = await reopenUpdateDuplicateCancel(saved4, 'Updated unsupported combo description.');
    expect(lifecycle4.updated.damageConfig).toEqual(saved4.damageConfig);
    expect(lifecycle4.updated.controlConfig).toEqual(saved4.controlConfig);
    expect(definitionFromWizard(clone(lifecycle4.updated)).ok).toBe(false);
    captured['unsupported-combination-both-saves'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> Step1BasicInfo -> Step3Effects -> DamageEffects (SavingThrowConfig) + AuthoredConditionFields (rider save) -> Finalize',
      rawDraft: rawDraft4,
      savedOuterRecord: saved4,
      serializedData: saved4.serializedData
    };

    fs.writeFileSync(FIXTURE_PATH, JSON.stringify(captured, null, 2) + '\n', 'utf8');
    expect(fs.existsSync(FIXTURE_PATH)).toBe(true);
  });
});
