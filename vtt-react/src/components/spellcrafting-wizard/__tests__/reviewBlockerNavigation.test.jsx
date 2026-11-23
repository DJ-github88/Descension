/**
 * Review blocker navigation & draft preservation tests.
 *
 * Verifies in the real mounted SpellwizardApp:
 *   1. Weighted coins: Review explains why weighted coins require GM adjudication, links back
 *      to the Rollable Table Coin Settings step using onJumpToStep, and switching to a
 *      supported fair coin updates Review to compatible without losing any other fields.
 *   2. Traps: Review explains that the whole Trap spell type is GM-managed with no
 *      setting-fix link, preserves the Trap draft intact, and leaves compiler support
 *      rules completely unchanged.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard, OUTCOME_CAPABILITY } from '../../../services/authoredAbility';
import { WEIGHTED_COIN_REFUSAL } from '../../../services/randomOutcome';
import { draftSubject } from '../utils/executionCompatibility';

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
  default: () => ({ user: { uid: 'review-blocker-author' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));
let latestWizardState = null;

function Probes() {
  latestWizardState = useSpellWizardState();
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

async function configureExplicitMana(manaValue) {
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
  latestWizardState = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Review blocker navigation and GM-managed spell types', () => {
  jest.setTimeout(30000);

  test('weighted coins: explains GM adjudication, jumps to Coin Settings, and switching to fair coin updates Review without losing fields', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Loaded Coin Hex',
      description: 'Flips a coin to chill or mend the target.'
    });
    await configureImmediateActionType();

    await clickStep('Effects');
    const outcomeCard = await screen.findByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i);
    await act(async () => { fireEvent.click(outcomeCard); });

    await clickStep('Targeting');
    const singleCard = await screen.findByText('Single Target');
    await act(async () => { fireEvent.click(singleCard); });
    const rangedCard = await screen.findByText('Ranged');
    await act(async () => { fireEvent.click(rangedCard); });

    await configureExplicitMana(4);

    await clickStep('Rollable Table');
    await act(async () => {
      fireEvent.change(document.getElementById('table-name'), { target: { value: 'Loaded Fate' } });
      fireEvent.change(document.getElementById('table-description'), { target: { value: 'Custom weighted table note.' } });
    });

    const coinsBtn = screen.getByRole('button', { name: /^Coins$/i });
    await act(async () => { fireEvent.click(coinsBtn); });

    const coinCountInput = await screen.findByLabelText(/Number of Coins/i);
    const coinTypeSelect = await screen.findByLabelText(/Coin Type/i);
    await act(async () => {
      fireEvent.change(coinCountInput, { target: { value: '1' } });
      fireEvent.change(coinTypeSelect, { target: { value: 'weighted' } });
    });

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
    const compatBox = document.querySelector('.exec-compat');
    expect(compatBox).toBeTruthy();
    expect(compatBox).toHaveAttribute('data-state', 'unsupported');
    expect(compatBox.textContent).toMatch(/Weighted coins require GM adjudication/i);

    const jumpBtn = within(compatBox).getByRole('button', { name: /Go to Coin Settings \(Rollable Table\)/i });
    await act(async () => { fireEvent.click(jumpBtn); });

    const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
    const rollableStepBtn = within(nav).getByRole('button', { name: /Rollable Table/i });
    await waitFor(() => {
      expect(rollableStepBtn).toHaveAttribute('aria-current', 'step');
      expect(document.getElementById('coin-type')).toBeInTheDocument();
    });
    expect(document.getElementById('coin-type').value).toBe('weighted');

    await act(async () => {
      fireEvent.change(document.getElementById('coin-type'), { target: { value: 'standard' } });
    });
    expect(screen.getByRole('status').textContent).toMatch(/Executable outcome table ready/i);

    await clickStep('Review');
    const updatedCompatBox = document.querySelector('.exec-compat');
    expect(updatedCompatBox).toHaveAttribute('data-state', 'executable');
    expect(updatedCompatBox.textContent).toMatch(/Structurally compatible with a Prism route/i);
    expect(within(updatedCompatBox).queryByRole('button', { name: /Go to Coin Settings/i })).toBeNull();

    // Verify all other authored fields stayed intact after jumping and switching Coin Type
    expect(latestWizardState.name).toBe('Loaded Coin Hex');
    expect(latestWizardState.description).toBe('Flips a coin to chill or mend the target.');
    expect(latestWizardState.targetingConfig.targetingType).toBe('single');
    expect(latestWizardState.targetingConfig.rangeType).toBe('ranged');
    expect(latestWizardState.resourceCost.actionPoints).toBe(1);
    expect(latestWizardState.resourceCost.resourceValues.mana).toBe(4);
    expect(latestWizardState.rollableTable.name).toBe('Loaded Fate');
    expect(latestWizardState.rollableTable.description).toBe('Custom weighted table note.');
    expect(latestWizardState.rollableTable.resolutionConfig.coinCount).toBe(1);
    expect(latestWizardState.rollableTable.resolutionConfig.coinType).toBe('standard');
    expect(latestWizardState.rollableTable.entries[0]).toMatchObject({
      coinPattern: 'Heads',
      name: 'Rime Snap',
      effectType: 'damage',
      effectConfig: expect.objectContaining({ damageFormula: '1d8', damageType: 'rime' })
    });
    expect(latestWizardState.rollableTable.entries[1]).toMatchObject({
      coinPattern: 'Tails',
      name: 'Warm Balm',
      effectType: 'healing',
      effectConfig: expect.objectContaining({ healingFormula: '1d6' })
    });

    const saved = await finalizeNewSpell();
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.capability).toBe(OUTCOME_CAPABILITY);
    expect(compiled.definition.outcomeTable.mechanic).toBe('coin');
    expect(compiled.definition.outcomeTable.spec).toEqual({ count: 1, coinType: 'standard' });
    expect(WEIGHTED_COIN_REFUSAL).toMatch(/Weighted coins/i);
  });

  test('trap spell: explains whole spell type is GM-managed, has no setting-fix link, preserves draft intact, and leaves compiler unchanged', async () => {
    seedEmpty();
    mountWizard();

    await fillBasicInfo({
      name: 'Ember Snare',
      description: 'A hidden fiery rune placed on a doorway.'
    });

    await clickStep('Spell Type');
    const trapCard = await screen.findByText(/^TRAP$/i, { selector: '.spell-type-title' });
    await act(async () => { fireEvent.click(trapCard); });

    await clickStep('Effects');
    const damageCard = await screen.findByText('Damage', { selector: '.selection-card-title, h4, h3, span, div' });
    await act(async () => { fireEvent.click(damageCard); });

    await clickStep('Trap Placement');
    const radiusInput = await screen.findByLabelText(/Trap Size \(feet\)/i);
    const detectionInput = await screen.findByLabelText(/Detection DC/i);
    await act(async () => {
      fireEvent.change(radiusInput, { target: { value: '10' } });
      fireEvent.change(detectionInput, { target: { value: '17' } });
    });

    await configureExplicitMana(3);

    await clickStep('Review');
    const draftBefore = clone(draftSubject(latestWizardState));

    const compatBox = document.querySelector('.exec-compat');
    expect(compatBox).toBeTruthy();
    expect(compatBox).toHaveAttribute('data-state', 'unsupported');
    expect(compatBox.textContent).toMatch(/Whole spell type is GM-managed.*Trap/i);
    expect(compatBox.textContent).toMatch(/Trap is a GM-managed spell type as a whole/i);
    expect(compatBox.querySelector('.exec-compat-jump-btn')).toBeNull();
    expect(within(compatBox).queryAllByRole('button')).toHaveLength(0);

    const flowEl = compatBox.querySelector('.spell-behavior-flow');
    expect(flowEl).toBeTruthy();
    expect(flowEl.textContent).toMatch(/TRAP spell type — whole spell type is GM-managed/i);

    // Draft stays completely intact in Wizard state
    expect(latestWizardState.spellType).toBe('TRAP');
    expect(latestWizardState.name).toBe('Ember Snare');
    expect(latestWizardState.trapConfig.placementRadius).toBe(10);
    expect(latestWizardState.trapConfig.detectionDC).toBe(17);
    expect(latestWizardState.effectTypes).toContain('damage');
    expect(latestWizardState.resourceCost.resourceValues.mana).toBe(3);
    expect(draftSubject(latestWizardState)).toEqual(draftBefore);

    // Saved copy preserves Trap fields and compiler support rule remains unchanged
    const saved = await finalizeNewSpell();
    expect(saved.spellType).toBe('TRAP');
    expect(saved.trapConfig.placementRadius).toBe(10);
    expect(saved.trapConfig.detectionDC).toBe(17);

    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(false);
    expect(compiled.reason).toMatch(/Immediate ACTION required/);
  });
});
