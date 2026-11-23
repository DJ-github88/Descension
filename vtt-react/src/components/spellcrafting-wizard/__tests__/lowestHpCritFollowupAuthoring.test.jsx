/**
 * Lowest-HP Filtering + Critical-Hit Gated Follow-up Authoring — Mounted Wizard Controls
 *
 * Authors through actual mounted Wizard controls:
 *   1. Immediate Action bolt ("Blight Bolt"):
 *      - Step 3: Direct Damage 1d8 + Composed Control Stunned (gm-manual)
 *      - Step 5: Single Target, Lowest Health, Ranged 30 ft, Enemies only
 *      - Step 6: 1 AP, 3 Mana
 *      - Step 7: Effect-Specific Triggers -> Control -> Combat -> Critical Hit
 *   2. Reopens the saved spell and swaps ONLY Step 3's Control follow-up
 *      from Stunned to Movement (-15 ft, "Crippling Chill") -> Update,
 *      proving the compiled definition, execution explanation, and behavior summary
 *      update cleanly with zero code edits.
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
import { definitionFromWizard } from '../../../services/authoredAbility';
import { explain as explainTriggerPlan } from '../../../services/executionPlan';
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
  default: () => ({ user: { uid: 'lowest-hp-crit-author' } })
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

async function clickStep(stepNameRegex) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: stepNameRegex });
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
  await clickStep(/Spell Type/i);
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

async function switchToControlTab() {
  const tabs = document.querySelectorAll('.effect-type-tab');
  const controlTab = Array.from(tabs).find((el) => /Control/i.test(el.textContent || ''));
  if (controlTab) {
    await act(async () => { fireEvent.click(controlTab); });
  }
}

async function configureExplicitResources(manaValue = 3) {
  await clickStep(/Resources/i);
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

describe('Mounted Wizard authoring for lowest-HP bolt + crit-gated follow-up', () => {
  jest.setTimeout(30000);

  test('authors reusable settings from scratch and swaps follow-up effect in Wizard without code edit', async () => {
    seedEmpty();
    mountWizard();

    // Step 1: Basic Info
    await fillBasicInfo({
      name: 'Blight Bolt',
      description: 'Fire a bolt at the eligible enemy with the lowest HP in range; on a crit, apply the configured follow-up.',
      elementLabel: 'Arcane'
    });

    // Step 2: Spell Type -> Immediate Action
    await configureImmediateActionType();

    // Step 3: Effects -> Direct Damage (1d8) + Composed Control (Stunned, gm-manual)
    await clickStep(/Effects/i);
    await selectEffectCard('Damage');
    const formulaInput = await screen.findByLabelText('Damage formula');
    await act(async () => { fireEvent.change(formulaInput, { target: { value: '1d8' } }); });

    await selectEffectCard('Control');
    await switchToControlTab();
    const profileBtn = await screen.findByRole('button', { name: /Use composed effect profile/i });
    await act(async () => { fireEvent.click(profileBtn); });

    const effectSelect = await screen.findByLabelText(/Canonical effect/i);
    const expirySelect = await screen.findByLabelText(/Expiry/i);
    const durationInput = await screen.findByLabelText(/Source-authored duration text/i);
    const gmNoteInput = await screen.findByLabelText(/Required GM adjudication note/i);
    await act(async () => {
      fireEvent.change(effectSelect, { target: { value: 'stunned' } });
      fireEvent.change(expirySelect, { target: { value: 'gm-manual' } });
      fireEvent.change(durationInput, { target: { value: 'Until dispelled' } });
      fireEvent.change(gmNoteInput, { target: { value: 'GM resolves crit follow-up.' } });
    });

    // Step 5: Targeting -> Single Target + Lowest Health + Ranged 30 ft + Enemies
    await clickStep(/Targeting/i);
    const singleCard = await screen.findByText('Single Target');
    await act(async () => { fireEvent.click(singleCard); });
    const lowestHealthCard = await screen.findByText('Lowest Health');
    await act(async () => { fireEvent.click(lowestHealthCard); });
    const rangedCard = await screen.findByText('Ranged');
    await act(async () => { fireEvent.click(rangedCard); });
    const rangeSlider = document.querySelector('.targeting-params input[type="range"]');
    expect(rangeSlider).toBeTruthy();
    await act(async () => { fireEvent.change(rangeSlider, { target: { value: '30' } }); });
    const enemiesCard = await screen.findByText('Enemies');
    await act(async () => { fireEvent.click(enemiesCard); });

    // Step 6: Resources -> 3 Mana (1 AP default)
    await configureExplicitResources(3);

    // Step 7: Triggers -> Effect-Specific Triggers -> Control -> Combat -> Critical Hit
    await clickStep(/Triggers/i);
    const effectTriggersBtn = screen.getByRole('button', { name: /Effect-Specific Triggers/i });
    await act(async () => { fireEvent.click(effectTriggersBtn); });

    const controlEffectCard = Array.from(document.querySelectorAll('.wow-effect-card-button'))
      .find((btn) => /Control/i.test(btn.textContent || ''));
    expect(controlEffectCard).toBeTruthy();
    await act(async () => { fireEvent.click(controlEffectCard); });

    const critOptionTitle = Array.from(document.querySelectorAll('.wow-trigger-option-title'))
      .find((el) => el.textContent?.trim() === 'Critical Hit');
    expect(critOptionTitle).toBeTruthy();
    await act(async () => { fireEvent.click(critOptionTitle.closest('.wow-trigger-option')); });

    await waitFor(() => {
      expect(latestWizardState.triggerConfig?.effectTriggers?.control?.compoundTriggers?.map((t) => t.id)).toEqual(['critical_hit']);
    });

    // Finalize and verify compiled definition, compatibility explanation, and behavior model
    const saved = await finalizeNewSpell();
    expect(saved.targetingConfig.selectionMethod).toBe('lowest_health');
    expect(saved.targetingConfig.targetRestrictions).toEqual(['enemy']);
    expect(saved.targetingConfig.rangeDistance).toBe(30);

    const compiled = definitionFromWizard(clone(saved), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.targeting).toEqual({
      kind: 'single',
      maxTargets: 1,
      rangeFeet: 30,
      restriction: 'enemy',
      selectionMethod: 'lowest_health'
    });
    expect(compiled.definition.effects.direct).toMatchObject({ kind: 'damage', formula: '1d8' });
    expect(compiled.definition.effects.condition).toEqual({ kind: 'stunned' });
    expect(compiled.definition.effects.critGate).toEqual({
      trigger: 'critical_hit',
      source: 'effects:direct',
      rule: 'max-die-face'
    });

    const compat = explainExecution(clone(saved));
    expect(compat.state).toBe(STATES.PARTIAL);
    expect(compat.reasons).toEqual([]);
    expect(compat.automated.some((line) => /lowest-hp/i.test(line))).toBe(true);
    const plan1 = explainTriggerPlan(clone(saved), compiled);
    expect(plan1.wholeExecutable).toBe(true);
    expect(plan1.executableClaim).toBe(true);
    expect(plan1.triggers[0].executable).toBe(true);
    expect(plan1.heading).toBe('Critical-hit follow-up trigger');

    const behavior = buildSpellBehaviorModel(clone(saved));
    expect(behavior).toBeTruthy();
    const activateStep = behavior.steps.find((s) => s.id === 'activation');
    expect(activateStep.summary).toMatch(/1 creature \(lowest HP, enemy\), 30 ft/i);
    const critStep = behavior.steps.find((s) => s.id === 'persistent');
    expect(critStep.label).toBe('ON CRIT');
    expect(critStep.summary).toMatch(/Stunned/i);

    // Reopen the saved spell in the Wizard and swap ONLY the Control follow-up (no code edit)
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => { window.handleLoadSpell(clone(saved), true); });
    await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(`Editing Spell: ${saved.name}`));

    await clickStep(/Effects/i);
    await switchToControlTab();

    const editEffectSelect = await screen.findByLabelText(/Canonical effect/i);
    await act(async () => { fireEvent.change(editEffectSelect, { target: { value: 'movement' } }); });

    const editLabelInput = await screen.findByLabelText(/Effect name shown on the target/i);
    const editFeetInput = await screen.findByLabelText(/Movement change/i);
    await act(async () => {
      fireEvent.change(editLabelInput, { target: { value: 'Crippling Chill' } });
      fireEvent.change(editFeetInput, { target: { value: '-15' } });
    });

    const prevModified = saved.lastModified;
    const updateBtn = screen.getByRole('button', { name: /^Update$/i });
    await act(async () => { fireEvent.click(updateBtn); });
    await waitFor(() => {
      const found = mockPersisted.data.spells.find((s) => s.id === saved.id);
      expect(found).toBeTruthy();
      expect(found.lastModified).not.toBe(prevModified);
    });

    const updated = clone(mockPersisted.data.spells.find((s) => s.id === saved.id));
    const recompiled = definitionFromWizard(clone(updated), { roomId: 'r', definitionVersion: 2, classId: 'arcanoneer' });
    expect(recompiled.ok).toBe(true);
    expect(recompiled.definition.targeting).toEqual(compiled.definition.targeting);
    expect(recompiled.definition.effects.critGate).toEqual(compiled.definition.effects.critGate);
    expect(recompiled.definition.effects.condition).toEqual({
      kind: 'movement',
      feet: -15,
      label: 'Crippling Chill'
    });

    const updatedCompat = explainExecution(clone(updated));
    expect(updatedCompat.state).toBe(STATES.PARTIAL);
    expect(updatedCompat.reasons).toEqual([]);
    const plan2 = explainTriggerPlan(clone(updated), recompiled);
    expect(plan2.wholeExecutable).toBe(true);
    expect(plan2.executableClaim).toBe(true);
    expect(plan2.triggers[0].executable).toBe(true);
    expect(plan2.heading).toBe('Critical-hit follow-up trigger');
    const updatedBehavior = buildSpellBehaviorModel(clone(updated));
    const updatedCritStep = updatedBehavior.steps.find((s) => s.id === 'persistent');
    expect(updatedCritStep.label).toBe('ON CRIT');
    expect(updatedCritStep.summary).toMatch(/Crippling Chill.*[−-]15 ft/i);
    expect(updatedCritStep.summary).not.toMatch(/Stunned/i);
  });
});
