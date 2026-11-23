/**
 * Random-Outcome Spells (DICE + COINS + manual CARDS) — Mounted Ordinary Wizard & Card Tests
 *
 * Authors outcome-branched spells from scratch through actual mounted Wizard controls:
 *   1. Die Roll (d6): two disjoint outcomes producing two different authored effects (damage vs healing)
 *   2. Fair Standard Coin Flip (1 coin): Heads (damage) vs Tails (healing)
 *   3. Card Draw (1 standard card): Red Cards (damage) vs Black Cards (healing) -> preserved & described on card,
 *      with honest manual-only refusal citing unsettled deck, reshuffle, and reveal rules (no invented rules)
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard, OUTCOME_CAPABILITY } from '../../../services/authoredAbility';

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
  default: () => ({ user: { uid: 'random-outcome-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
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

async function fillBasicInfo({ name, description }) {
  const nameInput = screen.getByPlaceholderText('Enter a name for your spell');
  const descInput = screen.getByPlaceholderText('Describe what your spell does and how it appears');
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(descInput, { target: { value: description } });
  });
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

async function selectOutcomeTableEffectMode() {
  await clickStep('Effects');
  const card = await screen.findByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i);
  await act(async () => { fireEvent.click(card); });
}

async function configureSingleRangedTargeting() {
  await clickStep('Targeting');
  const singleCard = await screen.findByText('Single Target');
  await act(async () => { fireEvent.click(singleCard); });
  const rangedCard = await screen.findByText('Ranged');
  await act(async () => { fireEvent.click(rangedCard); });
}

async function configureExplicitResources(manaValue = 2) {
  await clickStep('Resources');
  if (!document.querySelector('.resource-cost-config input')) {
    const manaCard = await screen.findByText('Mana', { selector: '.resource-type-name, h4, span, div' });
    await act(async () => { fireEvent.click(manaCard); });
  }
  await waitFor(() => expect(document.querySelector('.resource-cost-config input')).toBeTruthy());
  const manaInput = document.querySelector('.resource-cost-config input');
  await act(async () => { fireEvent.change(manaInput, { target: { value: String(manaValue) } }); });
}

async function editRollableEntry(index, updater) {
  const editButtons = screen.getAllByRole('button', { name: /Edit entry/i });
  await act(async () => { fireEvent.click(editButtons[index]); });
  await updater();
  const saveBtn = screen.getByRole('button', { name: /Save Entry/i });
  await act(async () => { fireEvent.click(saveBtn); });
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
  libraryApi = null;
  latestWizardState = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Random-outcome spells authored in the ordinary Wizard', () => {
  jest.setTimeout(30000);

  test('authors a DICE outcome spell (damage vs healing), shows both outcomes on UnifiedSpellCard, compiles & reloads cleanly', async () => {
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Chaos Die Bolt',
      description: 'Rolls 1d6 to either sear or mend the target.'
    });
    await configureImmediateActionType();
    await selectOutcomeTableEffectMode();
    await configureSingleRangedTargeting();
    await configureExplicitResources(2);

    await clickStep('Rollable Table');
    const diceBtn = screen.getByRole('button', { name: /^Dice$/i });
    await act(async () => { fireEvent.click(diceBtn); });
    const diceSelect = await screen.findByLabelText(/Dice Type/i);
    await act(async () => { fireEvent.change(diceSelect, { target: { value: 'd6' } }); });

    await editRollableEntry(0, async () => {
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/Min Roll/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Max Roll/i), { target: { value: '3' } });
        fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Ember Lash' } });
        fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'damage' } });
        fireEvent.change(screen.getByLabelText(/Damage Formula/i), { target: { value: '2d6' } });
        fireEvent.change(screen.getByLabelText(/Damage Type/i), { target: { value: 'ember' } });
      });
    });

    await editRollableEntry(1, async () => {
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/Min Roll/i), { target: { value: '4' } });
        fireEvent.change(screen.getByLabelText(/Max Roll/i), { target: { value: '6' } });
        fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Vital Surge' } });
        fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'healing' } });
        fireEvent.change(screen.getByLabelText(/Healing Formula/i), { target: { value: '1d8+2' } });
      });
    });

    await clickStep('Review');
    const previewCard = document.querySelector('.review-spell-preview');
    expect(previewCard).toBeTruthy();
    expect(previewCard.textContent).toMatch(/Ember Lash/);
    expect(previewCard.textContent).toMatch(/2d6 ember damage/);
    expect(previewCard.textContent).toMatch(/Vital Surge/);
    expect(previewCard.textContent).toMatch(/1d8\+2 healing/);
    expect(previewCard.textContent).toMatch(/Roll 1–3/);
    expect(previewCard.textContent).toMatch(/Roll 4–6/);

    const saved = await finalizeNewSpell();
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(OUTCOME_CAPABILITY);
    expect(compiled.definition.outcomeTable.mechanic).toBe('dice');
    expect(compiled.definition.outcomeTable.branches).toHaveLength(2);

    // Reopen saved spell into Wizard and ensure both outcomes & compilation stay intact
    await act(async () => { window.handleLoadSpell(clone(saved), true); });
    await clickStep('Rollable Table');
    expect(screen.getByText('Ember Lash')).toBeInTheDocument();
    expect(screen.getByText('Vital Surge')).toBeInTheDocument();
  });

  test('authors a fair COINS outcome spell (Heads vs Tails), shows both outcomes on UnifiedSpellCard, and compiles cleanly', async () => {
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Twin Coin Gale',
      description: 'Flips one fair coin for frostbite or restoration.'
    });
    await configureImmediateActionType();
    await selectOutcomeTableEffectMode();
    await configureSingleRangedTargeting();
    await configureExplicitResources(1);

    await clickStep('Rollable Table');
    const coinsBtn = screen.getByRole('button', { name: /^Coins$/i });
    await act(async () => { fireEvent.click(coinsBtn); });
    const coinCountInput = await screen.findByLabelText(/Number of Coins/i);
    await act(async () => { fireEvent.change(coinCountInput, { target: { value: '1' } }); });

    await editRollableEntry(0, async () => {
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/Coin Pattern/i), { target: { value: 'Heads' } });
        fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Rime Snap' } });
        fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'damage' } });
        fireEvent.change(screen.getByLabelText(/Damage Formula/i), { target: { value: '1d8' } });
        fireEvent.change(screen.getByLabelText(/Damage Type/i), { target: { value: 'rime' } });
      });
    });

    await editRollableEntry(1, async () => {
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/Coin Pattern/i), { target: { value: 'Tails' } });
        fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Warm Balm' } });
        fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'healing' } });
        fireEvent.change(screen.getByLabelText(/Healing Formula/i), { target: { value: '1d6' } });
      });
    });

    await clickStep('Review');
    const previewCard = document.querySelector('.review-spell-preview');
    expect(previewCard.textContent).toMatch(/Heads/);
    expect(previewCard.textContent).toMatch(/Rime Snap/);
    expect(previewCard.textContent).toMatch(/1d8 rime damage/);
    expect(previewCard.textContent).toMatch(/Tails/);
    expect(previewCard.textContent).toMatch(/Warm Balm/);
    expect(previewCard.textContent).toMatch(/1d6 healing/);

    const saved = await finalizeNewSpell();
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(OUTCOME_CAPABILITY);
    expect(compiled.definition.outcomeTable.mechanic).toBe('coin');
    expect(compiled.definition.outcomeTable.spec).toEqual({ count: 1, coinType: 'standard' });
  });

  test('authors a CARDS table in the Wizard, shows both card outcomes on the card, and fails closed without inventing deck/reshuffle/reveal rules', async () => {
    seedEmpty();
    mountWizard();
    await fillBasicInfo({
      name: 'Deck of Omens',
      description: 'Draws a card for flame or ward.'
    });
    await configureImmediateActionType();
    await selectOutcomeTableEffectMode();
    await configureSingleRangedTargeting();
    await configureExplicitResources(2);

    await clickStep('Rollable Table');
    const cardsBtn = screen.getByRole('button', { name: /^Cards$/i });
    await act(async () => { fireEvent.click(cardsBtn); });

    expect(screen.getByRole('status').textContent).toMatch(/deck persistence, reshuffle, and face-down reveal rules/i);

    await clickStep('Review');
    const previewCard = document.querySelector('.review-spell-preview');
    expect(previewCard.textContent).toMatch(/Red Cards/);
    expect(previewCard.textContent).toMatch(/Crimson Flare/);
    expect(previewCard.textContent).toMatch(/Black Cards/);
    expect(previewCard.textContent).toMatch(/Velvet Ward/);

    const saved = await finalizeNewSpell();
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(false);
    expect(compiled.reason).toMatch(/deck persistence, reshuffle, and face-down reveal rules/i);
  });
});
