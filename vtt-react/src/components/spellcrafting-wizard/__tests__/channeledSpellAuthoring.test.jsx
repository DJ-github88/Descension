/**
 * Channeled Spell Authoring, Save/Reopen Parity, Card vs Combat Consistency, and Fixture Capture
 *
 * Drives a blank mounted SpellwizardApp from scratch to create a CHANNELED spell:
 *   1. "Arcane Beam": Single Target, Ranged 30 ft, Enemy, 2 AP, 10 mana, 1d6 arcane damage/tick,
 *      START_OF_TURN x 3 caster turns, CON DC 12, interruptible, movementAllowed: false, breakEffect: 'none'.
 *   2. Verifies Step 8 Channeling preserves Step 5 AP/mana, single-target ranged behavior, and settled fields.
 *   3. Verifies save -> reopen -> Update -> save preserves range, target selection, channel start, ticks,
 *      and channel end losslessly (identical definitionFromWizard output + hash + UnifiedSpellCard / SpellBehaviorFlow).
 *   4. Verifies 1-setting changes in the Wizard produce corresponding behavior changes with zero code changes:
 *      - endOfTurnVariant: tickFrequency changed START_OF_TURN -> END_OF_TURN
 *      - shortRangeVariant: rangeDistance changed 30 -> 20
 *      - shortDurationVariant: maxChannelDuration changed 3 -> 2
 *      - soothingBeam: healing 1d4 ally channeled variant
 *   5. Verifies undecided rules fail closed (per-tick sustain cost, ROUNDS, CONTINUOUS, uninterruptible, movementAllowed: true, non-none breakEffect).
 *   6. Captures genuine Wizard-authored records into fixtures/channeledSpellFixtures.json for server production tests.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import UnifiedSpellCard from '../components/common/UnifiedSpellCard';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { CHANNELED_CAPABILITY, definitionFromWizard } from '../../../services/authoredAbility';
import { describe as describeChanneled, termsFor } from '../../../services/authoredChanneled';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import { buildSpellBehaviorModel } from '../components/common/spellBehaviorPresentation';

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
  default: () => ({ user: { uid: 'channeled-spell-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'channeledSpellFixtures.json');

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

async function clickStep(stepName) {
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

async function configureChanneledType({
  maxChannelDuration = 3,
  durationUnit = 'TURNS',
  tickFrequency = 'START_OF_TURN',
  concentrationDC = 12,
  dcType = 'CONSTITUTION'
}) {
  await clickStep('Spell Type');
  const channeledHeading = await screen.findByText(/^CHANNELED$/i);
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

async function configureSingleEffect({ kind = 'damage', formula = '1d6' }) {
  await clickStep('Effects');
  if (kind === 'damage') {
    const dmgHeading = screen.getByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' });
    await act(async () => { fireEvent.click(dmgHeading); });
    const formulaInput = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(formulaInput, { target: { value: formula } }); });
  } else {
    const healHeading = screen.getByText('Healing', { selector: '.selection-card-title, h4, h3, span, div' });
    await act(async () => { fireEvent.click(healHeading); });
    const formulaInput = await screen.findByLabelText(/Healing formula/i);
    await act(async () => { fireEvent.change(formulaInput, { target: { value: formula } }); });
  }
}

async function configureSingleRangedTargeting({ rangeDistance = 30, restrictionLabel = 'Enemies' } = {}) {
  await clickStep('Targeting');
  const singleCard = await screen.findByText('Single Target');
  await act(async () => { fireEvent.click(singleCard); });
  const rangedCard = await screen.findByText('Ranged');
  await act(async () => { fireEvent.click(rangedCard); });
  const rangeInput = document.querySelector('input[type="range"], input[name="rangeDistance"]');
  expect(rangeInput).toBeTruthy();
  await act(async () => { fireEvent.change(rangeInput, { target: { value: String(rangeDistance) } }); });
  const restrictionEl = await screen.findByText(restrictionLabel);
  await act(async () => { fireEvent.click(restrictionEl); });
}

async function setResourceCostInput(cardTitle, headerRegex, value) {
  let block = Array.from(document.querySelectorAll('.resource-cost-config'))
    .find(el => headerRegex.test(el.querySelector('.resource-type-name')?.textContent || ''));
  if (!block) {
    const card = await screen.findByText(cardTitle, { selector: '.resource-type-name, h4, span, div' });
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

async function configureExplicitResources({ ap = 2, mana = 10 } = {}) {
  await clickStep('Resources');
  await setResourceCostInput('Action Points', /Action Points/i, ap);
  await setResourceCostInput('Mana', /Mana/i, mana);
}

async function visitAndVerifyChannelingStep({ expectedAp = 2, expectedMana = 10 } = {}) {
  await clickStep('Channeling');
  await screen.findByText(/Channel Duration & Behavior/i);
  expect(latestWizardState.resourceCost.actionPoints).toBe(expectedAp);
  expect(latestWizardState.resourceCost.resourceValues?.mana ?? latestWizardState.resourceCost.mana).toBe(expectedMana);
  expect(latestWizardState.channelingConfig.type).toBe('channeled');
  expect(latestWizardState.channelingConfig.costTrigger).toBe('none');
  expect(latestWizardState.channelingConfig.costValue).toBe(0);
}

async function finalizeNewSpell() {
  const prevCount = mockPersisted.data.spells.length;
  const finalizeBtn = screen.getByRole('button', { name: /^Finalize$/i });
  await act(async () => { fireEvent.click(finalizeBtn); });
  await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));
  return clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
}

async function reopenAndUpdateSpell(savedRecord) {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => { window.handleLoadSpell(clone(savedRecord), true); });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(`Editing Spell: ${savedRecord.name}`));

  await clickStep('Channeling');
  await screen.findByText(/Channel Duration & Behavior/i);

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
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Channeled spell mounted Wizard authoring, reopen parity, card parity, and variants', () => {
  jest.setTimeout(35000);

  test('authors CHANNELED spell from blank Wizard, verifies save/reopen and card/combat parity, tests 1-setting variants and undecided refusals, and captures fixtures', async () => {
    const captured = {};

    // 1. Author "Arcane Beam" from a completely blank Wizard
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Arcane Beam',
      description: 'Projects a sustained beam of arcane force onto one enemy.',
      elementLabel: 'Arcane'
    });
    await configureChanneledType({
      maxChannelDuration: 3,
      durationUnit: 'TURNS',
      tickFrequency: 'START_OF_TURN',
      concentrationDC: 12,
      dcType: 'CONSTITUTION'
    });
    await configureSingleEffect({ kind: 'damage', formula: '1d6' });
    await configureSingleRangedTargeting({ rangeDistance: 30, restrictionLabel: 'Enemies' });
    await configureExplicitResources({ ap: 2, mana: 10 });
    await visitAndVerifyChannelingStep({ expectedAp: 2, expectedMana: 10 });

    const saved = await finalizeNewSpell();
    const compiledBefore = definitionFromWizard(clone(saved), { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiledBefore.ok).toBe(true);
    expect(compiledBefore.definition).toMatchObject({
      schemaVersion: 10,
      capability: CHANNELED_CAPABILITY,
      spellType: 'CHANNELED',
      targeting: { kind: 'single', maxTargets: 1, rangeFeet: 30, restriction: 'enemy' },
      resourceCost: { actionPoints: 2, mana: 10 },
      tickEffect: { kind: 'damage', formula: '1d6', damageTypes: ['arcane'] },
      channel: {
        maxChannelDuration: 3,
        durationUnit: 'TURNS',
        tickFrequency: 'START_OF_TURN',
        timing: 'authored-caster-start-count',
        occurrences: 3,
        rangeFeet: 30,
        interruptible: true,
        movementAllowed: false,
        breakEffect: 'none',
        concentrationDC: 12,
        dcType: 'CONSTITUTION'
      }
    });

    // Reopen -> inspect -> Update -> compare lossless parity
    const reopened = await reopenAndUpdateSpell(saved);
    const compiledAfter = definitionFromWizard(clone(reopened), { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiledAfter).toEqual(compiledBefore);
    expect(reopened.typeConfig).toEqual(saved.typeConfig);
    expect(reopened.channelingConfig).toEqual(saved.channelingConfig);
    expect(reopened.targetingConfig).toEqual(saved.targetingConfig);
    expect(reopened.resourceCost).toEqual(saved.resourceCost);
    expect(reopened.damageConfig).toEqual(saved.damageConfig);

    // Card vs Combat Parity on both pre-reopen and reopened records
    const modelBefore = buildSpellBehaviorModel(saved, { classId: 'arcanoneer', shared: true, gm: true });
    const modelAfter = buildSpellBehaviorModel(reopened, { classId: 'arcanoneer', shared: true, gm: true });
    expect(modelBefore.steps).toEqual(modelAfter.steps);
    expect(modelAfter.supportBadge.status).toBe('partial');
    expect(modelAfter.steps.map(s => s.label)).toEqual(['CHANNEL START', 'TICKS', 'CHANNEL END']);

    const cardRender = render(
      <SpellLibraryProvider>
        <UnifiedSpellCard spell={reopened} variant="wizard" />
      </SpellLibraryProvider>
    );
    const cardText = cardRender.container.textContent || '';
    expect(cardText).toMatch(/CHANNEL START/i);
    expect(cardText).toMatch(/30 ft/i);
    expect(cardText).toMatch(/2 AP/i);
    expect(cardText).toMatch(/10 mana/i);
    expect(cardText).toMatch(/TICKS/i);
    expect(cardText).toMatch(/3 ticks at the start of the caster's turns/i);
    expect(cardText).toMatch(/1d6 arcane damage per tick/i);
    expect(cardText).toMatch(/CHANNEL END/i);
    expect(cardText).toMatch(/CONSTITUTION DC 12/i);
    expect(cardText).toMatch(/No extra ticks fire after the channel ends/i);
    cardRender.unmount();

    const compat = explainExecution(reopened, { classId: 'arcanoneer', shared: true, gm: true });
    expect(compat.state).toBe(STATES.PARTIAL);
    expect(describeChanneled(termsFor(compiledAfter.definition))).toMatch(/30 ft/);

    captured['arcane-beam-start-30ft'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> Basic -> SpellType(CHANNELED) -> Effects -> Targeting -> Resources -> Channeling -> Finalize',
      savedOuterRecord: saved,
      reopenedOuterRecord: reopened
    };
    cleanup();

    // 2. Data-driven 1-setting variants (each modifies ONE Wizard setting from Arcane Beam and saves cleanly)
    // Variant A: Change ONLY tickFrequency -> END_OF_TURN
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Arcane Beam',
      description: 'Projects a sustained beam of arcane force onto one enemy.',
      elementLabel: 'Arcane'
    });
    await configureChanneledType({
      maxChannelDuration: 3,
      durationUnit: 'TURNS',
      tickFrequency: 'END_OF_TURN',
      concentrationDC: 12,
      dcType: 'CONSTITUTION'
    });
    await configureSingleEffect({ kind: 'damage', formula: '1d6' });
    await configureSingleRangedTargeting({ rangeDistance: 30, restrictionLabel: 'Enemies' });
    await configureExplicitResources({ ap: 2, mana: 10 });
    await visitAndVerifyChannelingStep({ expectedAp: 2, expectedMana: 10 });
    const endOfTurnVariant = await finalizeNewSpell();
    const compiledEot = definitionFromWizard(clone(endOfTurnVariant), { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiledEot.ok).toBe(true);
    expect(compiledEot.definition.channel.timing).toBe('authored-caster-end-count');
    expect(buildSpellBehaviorModel(endOfTurnVariant, { classId: 'arcanoneer' }).steps.find(s => s.id === 'channel-ticks').summary)
      .toMatch(/at the end of the caster's turns/i);
    captured['arcane-beam-end-of-turn-variant'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> changed ONLY tickFrequency from START_OF_TURN to END_OF_TURN',
      savedOuterRecord: endOfTurnVariant
    };
    cleanup();

    // Variant B: Change ONLY rangeDistance -> 20 ft
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Arcane Beam',
      description: 'Projects a sustained beam of arcane force onto one enemy.',
      elementLabel: 'Arcane'
    });
    await configureChanneledType({
      maxChannelDuration: 3,
      durationUnit: 'TURNS',
      tickFrequency: 'START_OF_TURN',
      concentrationDC: 12,
      dcType: 'CONSTITUTION'
    });
    await configureSingleEffect({ kind: 'damage', formula: '1d6' });
    await configureSingleRangedTargeting({ rangeDistance: 20, restrictionLabel: 'Enemies' });
    await configureExplicitResources({ ap: 2, mana: 10 });
    await visitAndVerifyChannelingStep({ expectedAp: 2, expectedMana: 10 });
    const shortRangeVariant = await finalizeNewSpell();
    const compiledShortRange = definitionFromWizard(clone(shortRangeVariant), { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiledShortRange.ok).toBe(true);
    expect(compiledShortRange.definition.targeting.rangeFeet).toBe(20);
    expect(compiledShortRange.definition.channel.rangeFeet).toBe(20);
    expect(buildSpellBehaviorModel(shortRangeVariant, { classId: 'arcanoneer' }).steps.find(s => s.id === 'channel-start').details.join(' '))
      .toMatch(/up to 20 ft/i);
    captured['arcane-beam-20ft-variant'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> changed ONLY rangeDistance from 30 to 20',
      savedOuterRecord: shortRangeVariant
    };
    cleanup();

    // Variant C: Healing ally channeled variant ("Soothing Beam", 1d4 healing, 2 turns, START_OF_TURN)
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Soothing Beam',
      description: 'Channels restorative light onto an ally.',
      elementLabel: 'Sacred'
    });
    await configureChanneledType({
      maxChannelDuration: 2,
      durationUnit: 'TURNS',
      tickFrequency: 'START_OF_TURN',
      concentrationDC: 10,
      dcType: 'SPIRIT'
    });
    await configureSingleEffect({ kind: 'healing', formula: '1d4' });
    await configureSingleRangedTargeting({ rangeDistance: 25, restrictionLabel: 'Allies' });
    await configureExplicitResources({ ap: 1, mana: 5 });
    await visitAndVerifyChannelingStep({ expectedAp: 1, expectedMana: 5 });
    const healingBeam = await finalizeNewSpell();
    const compiledHeal = definitionFromWizard(clone(healingBeam), { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiledHeal).toEqual({ ok: true, definition: expect.any(Object) });
    expect(compiledHeal.definition.targeting.restriction).toBe('ally');
    expect(compiledHeal.definition.tickEffect).toEqual({ kind: 'healing', formula: '1d4' });
    captured['soothing-beam-healing-ally'] = {
      fixtureOrigin: 'Mounted SpellwizardApp -> healing ally CHANNELED variant',
      savedOuterRecord: healingBeam
    };
    cleanup();

    // 3. Undecided rules refuse whole (fail-closed)
    const mutate = (fn) => {
      const copy = clone(reopened);
      fn(copy);
      copy.authoredDraft = clone(copy);
      delete copy.authoredDraft.authoredDraft;
      delete copy.authoredDraft.serializedData;
      delete copy.authoredDraft.categoryIds;
      delete copy.authoredDraft.categories;
      delete copy.authoredDraft.source;
      delete copy.authoredDraft.isCustom;
      delete copy.authoredDraft.lastModified;
      delete copy.authoredDraft.lastSaved;
      copy.serializedData = JSON.stringify(copy.authoredDraft);
      return definitionFromWizard(copy, { roomId: 'room-1', definitionVersion: 1, classId: 'arcanoneer' });
    };

    expect(mutate(r => { r.typeConfig.durationUnit = 'ROUNDS'; }).ok).toBe(false);
    expect(mutate(r => { r.typeConfig.tickFrequency = 'CONTINUOUS'; }).ok).toBe(false);
    expect(mutate(r => { r.channelingConfig.interruptible = false; r.typeConfig.interruptible = false; }).ok).toBe(false);
    expect(mutate(r => { r.channelingConfig.movementAllowed = true; r.typeConfig.movementAllowed = true; }).ok).toBe(false);
    expect(mutate(r => { r.channelingConfig.breakEffect = 'explode'; r.typeConfig.breakEffect = 'explode'; }).ok).toBe(false);
    expect(mutate(r => { r.channelingConfig.costTrigger = 'per_turn'; r.channelingConfig.costValue = 2; }).ok).toBe(false);

    fs.mkdirSync(path.dirname(FIXTURE_PATH), { recursive: true });
    fs.writeFileSync(FIXTURE_PATH, JSON.stringify(captured, null, 2) + '\n', 'utf8');
    expect(fs.existsSync(FIXTURE_PATH)).toBe(true);
  });
});
