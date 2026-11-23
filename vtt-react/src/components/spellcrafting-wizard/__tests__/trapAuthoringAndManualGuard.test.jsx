import React, { useEffect } from 'react';
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
  useSpellWizardState
} from '../context/spellWizardContext';
import { exportLibrary, importLibrary, getDefaultLibrary } from '../core/utils/libraryManager';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import AuthoredAdmission from '../components/library/AuthoredAdmission';
import SpellActionBar from '../../character-sheet/SpellActionBar';
import SpellCastConfirmation from '../../ui/SpellCastConfirmation';
import { definitionFromWizard as clientDefinitionFromWizard } from '../../../services/authoredAbility';
import { explain as explainPlan } from '../../../services/executionPlan';
import {
  routeSpellCast,
  isP9Routed,
  useSpellConsequenceStore
} from '../../../services/spellConsequenceService';
import { useTriggerOfferStore } from '../../../services/triggerOfferService';
import { postManualNotice, manualSharedReason, MANUAL_NOTE } from '../../../services/manualActionGate';
import { registerStore } from '../../../store/storeRegistry';
import useGameStore from '../../../store/gameStore';
import useCharacterStore from '../../../store/characterStore';
import useSpellbookStore from '../../../store/spellbookStore';
import useChatStore from '../../../store/chatStore';
import useDiceStore from '../../../store/diceStore';

const {
  definitionFromWizard: serverDefinitionFromWizard
} = require('../../../../../server/shared/services/authoredAbility');

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: require('crypto').webcrypto,
    configurable: true
  });
}

// Stub canvas 2D context for TrapPlacementStep preview grid under jsdom
HTMLCanvasElement.prototype.getContext = function getContext(type) {
  if (type !== '2d') return null;
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    rect: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    setLineDash: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 10 })
  };
};

let mockPersisted = null;

const mockResourceCalls = {
  updateResource: [],
  updateClassResource: [],
  consumeClassResource: [],
  gainClassResource: []
};

jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => {
    mockPersisted = JSON.parse(JSON.stringify(data));
  },
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
  getCustomIconUrl: () => 'fallback-icon.png'
}));

jest.mock('../../../utils/dialogService', () => ({
  showConfirm: () => Promise.resolve(true),
  showAlert: () => Promise.resolve(true),
  showPrompt: () => Promise.resolve(null)
}));

jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: { uid: 'trap-test-author' } })
}));

jest.mock('../../../hooks/useClassSpellLibrary', () => ({
  useClassSpellLibrary: () => ({
    spellCategories: [],
    classSpells: [],
    classSpellsLoading: false,
    classSpellsError: null,
    getAllSpells: () => [],
    getSpellsByCategory: () => [],
    getCategoryInfo: () => null,
    removeCustomSpell: () => {},
    hasActiveCharacter: false,
    hasClassSpells: false
  })
}));

jest.mock('../../../hooks/useWeaponEnhancedSpells', () => ({
  useWeaponEnhancedSpells: () => ({ enhancedSpells: [], rawSpells: [] })
}));

// Use real zustand store without side-effect persistence slices; plain mutators survive CRA resetMocks
jest.mock('../../../store/characterStore', () => {
  const { create } = require('zustand');
  const useMockCharacterStore = create(() => ({
    characters: [],
    currentCharacterId: 'char-1',
    activeCharacterId: 'char-1',
    currentCharacter: null,
    id: 'char-1',
    name: 'Aldric',
    class: 'Wizard',
    level: 3,
    classResource: null,
    stats: { intelligence: 16 },
    attributes: { intelligence: { value: 16 } },
    health: { current: 24, max: 24 },
    mana: { current: 20, max: 20 },
    actionPoints: { current: 4, max: 4 },
    tempMana: 0,
    tempActionPoints: 0,
    preparedSpells: [],
    spells: [],
    customSpells: [],
    inventory: [],
    equippedItems: {},
    equipment: {},
    class_spells: { known_spells: [] },
    talents: {},
    updateResource: () => {},
    updateClassResource: () => {},
    consumeClassResource: () => {},
    gainClassResource: () => {}
  }));
  return { __esModule: true, default: useMockCharacterStore };
});

const clone = (value) => JSON.parse(JSON.stringify(value));

let libraryStateRef = null;
let libraryDispatchRef = null;
let wizardStateRef = null;

function Probes() {
  const library = useSpellLibrary();
  const libraryDispatch = useSpellLibraryDispatch();
  const wizardState = useSpellWizardState();

  useEffect(() => {
    libraryStateRef = library;
    libraryDispatchRef = libraryDispatch;
  }, [library, libraryDispatch]);

  useEffect(() => {
    wizardStateRef = wizardState;
  }, [wizardState]);

  return null;
}

function seedEmptyLibrary() {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-21T12:00:00.000Z',
    data: {
      ...defaults,
      spells: []
    }
  };
}

function mountWizard() {
  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellwizardApp hideHeader />
        <Probes />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
}

async function clickStep(stepPattern) {
  const nav = await screen.findByRole('navigation', { name: /Spell wizard steps/i });
  const btn = Array.from(nav.querySelectorAll('button')).find((el) =>
    stepPattern.test(el.getAttribute('aria-label') || el.textContent || '')
  );
  if (!btn) {
    throw new Error(
      `Missing step ${stepPattern}; buttons=[${Array.from(nav.querySelectorAll('button'))
        .map((el) => el.getAttribute('aria-label'))
        .join(', ')}]; spellType=${wizardStateRef?.spellType}`
    );
  }
  await act(async () => {
    fireEvent.click(btn);
    await new Promise((resolve) => setTimeout(resolve, 250));
  });
  await waitFor(() => {
    const active = Array.from(
      screen.getByRole('navigation', { name: /Spell wizard steps/i }).querySelectorAll('button')
    ).find((el) => el.getAttribute('aria-current') === 'step');
    expect(active).toBeTruthy();
    expect(stepPattern.test(active.getAttribute('aria-label') || active.textContent || '')).toBe(true);
  });
}

async function authorEditExportImportTrapViaUI() {
  seedEmptyLibrary();
  const firstMount = mountWizard();

  // Step 1: Basic Info
  const nameInput = await screen.findByPlaceholderText(/Enter a name for your spell/i);
  const descInput = await screen.findByPlaceholderText(/Describe what your spell does/i);
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: 'Ember Snare Trap' } });
    fireEvent.change(descInput, { target: { value: 'A glowing rune snare etched into the floor.' } });
  });

  // Step 2: Spell Type -> TRAP + verify GM-managed copy
  await clickStep(/Spell Type/i);
  const trapTitle = await screen.findByText(/^TRAP$/i, { selector: '.spell-type-title' });
  await act(async () => {
    fireEvent.click(trapTitle);
  });
  await waitFor(() => {
    expect(screen.getByText(/Trap spells are saved as GM-managed reference notes only/i)).toBeInTheDocument();
  });

  // Step 3: Effects -> Damage 2d6
  await clickStep(/Effects/i);
  const damageCard = await screen.findByText(/^Damage$/i, { selector: '.selection-card-title, h4, h3, span, div' });
  await act(async () => {
    fireEvent.click(damageCard);
  });
  const damageFormulaInput = await screen.findByLabelText(/Damage formula/i);
  await act(async () => {
    fireEvent.change(damageFormulaInput, { target: { value: '2d6' } });
  });

  // Triggers: Trap Triggers -> Proximity -> enemy
  await clickStep(/Triggers/i);
  const trapCatBtn = await screen.findByRole('button', { name: /Trap Triggers/i });
  await act(async () => {
    fireEvent.click(trapCatBtn);
  });
  await waitFor(() => {
    expect(screen.getByText(/Prism does not automatically arm or fire trap triggers/i)).toBeInTheDocument();
  });
  const proximityOption = await screen.findByText(/^Proximity$/i, {
    selector: '.wow-trigger-option-title'
  });
  await act(async () => {
    fireEvent.click(proximityOption);
  });
  const creatureSelect = await waitFor(() => {
    const selected = document.querySelector('.pf-selected-trigger select.pf-select');
    expect(selected).toBeTruthy();
    return selected;
  });
  expect(creatureSelect.value).toBe('any');
  await act(async () => {
    fireEvent.change(creatureSelect, { target: { value: 'enemy' } });
  });
  await waitFor(() => {
    const summaryEl = document.querySelector('.pf-selected-trigger .pf-trigger-summary');
    expect(summaryEl?.textContent || '').toMatch(/an enemy/i);
    expect(summaryEl?.textContent || '').not.toMatch(/anyone comes within 30 ft/i);
  });

  // Trap Placement: radius 10, Timed 10 turns
  await clickStep(/Trap Placement/i);
  const radiusInput = await waitFor(() => {
    const el = document.querySelector('#placementRadius');
    expect(el).toBeTruthy();
    return el;
  });
  expect(
    screen.getByText(/Prism does not automatically place, arm, trigger, or expire traps/i)
  ).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(radiusInput, { target: { value: '10', name: 'placementRadius', type: 'number' } });
  });
  const timedOption = screen.getByText(/^Timed$/i).closest('.icon-selection-item');
  expect(timedOption).toBeTruthy();
  await act(async () => {
    fireEvent.click(timedOption);
  });
  const durationValInput = await waitFor(() => {
    const el = document.querySelector('#durationValue');
    expect(el).toBeTruthy();
    return el;
  });
  const durationUnitSelect = document.querySelector('#durationUnit');
  expect(durationUnitSelect).toBeTruthy();
  expect(durationUnitSelect.value).toBe('turns');

  await act(async () => {
    fireEvent.change(durationValInput, { target: { value: '10', name: 'durationValue', type: 'number' } });
  });
  await waitFor(() => {
    const preview = document.querySelector('.trap-preview');
    expect(preview?.textContent || '').toMatch(/10 ft/i);
    expect(preview?.textContent || '').toMatch(/10 turns/i);
    expect(preview?.textContent || '').not.toMatch(/undefined/i);
  });

  // Step 5: Resources -> 1 AP + 4 Mana
  await clickStep(/Resources/i);
  const manaCard = await screen.findByText(/^Mana$/i, { selector: '.resource-type-name' });
  const existingManaBlock = Array.from(document.querySelectorAll('.resource-cost-config')).find((el) =>
    /Mana/i.test(el.querySelector('.resource-type-name')?.textContent || '')
  );
  if (!existingManaBlock) {
    await act(async () => {
      fireEvent.click(manaCard);
    });
  }
  const manaInput = await waitFor(() => {
    const block = Array.from(document.querySelectorAll('.resource-cost-config')).find((el) =>
      /Mana/i.test(el.querySelector('.resource-type-name')?.textContent || '')
    );
    const input = block?.querySelector('input.resource-input');
    expect(input).toBeTruthy();
    return input;
  });
  await act(async () => {
    fireEvent.change(manaInput, { target: { value: '4' } });
  });

  // Step 10: Review -> verify manual disclosures + preview card + Save
  await clickStep(/Review/i);
  await waitFor(() => {
    expect(screen.getByText(/Manual play: Prism cannot run this ability/i)).toBeInTheDocument();
  });
  expect(screen.getAllByText(/Manual \/ stored only/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/not auto-activated by Prism/i).length).toBeGreaterThan(0);

  const reviewText = document.querySelector('.spell-review-container, .review-spell-preview, main')?.textContent
    || document.body.textContent;
  expect(reviewText).toMatch(/GM-managed/i);
  expect(reviewText).toMatch(/10\s*ft(?:\s+radius)?/i);
  expect(reviewText).toMatch(/10\s+turns/i);
  expect(reviewText).toMatch(/enemy comes within 10 ft/i);

  const prevCount = mockPersisted.data.spells.length;
  const saveBtn = await screen.findByRole('button', { name: /Save to Library/i });
  await act(async () => {
    fireEvent.click(saveBtn);
  });
  await waitFor(() => expect(mockPersisted.data.spells.length).toBe(prevCount + 1));

  const saved = clone(mockPersisted.data.spells[mockPersisted.data.spells.length - 1]);
  for (const subject of [saved, saved.authoredDraft, JSON.parse(saved.serializedData)]) {
    expect(subject.name).toBe('Ember Snare Trap');
    expect(subject.spellType).toBe('TRAP');
    expect(subject.trapConfig.placementRadius).toBe(10);
    expect(subject.trapConfig.trapDuration).toBe('timed');
    expect(subject.trapConfig.durationValue).toBe(10);
    expect(subject.trapConfig.durationUnit).toBe('turns');
    expect(subject.targetingConfig.targetingType).toBe('location');
    expect(subject.targetingConfig.aoeParameters.radius).toBe(10);
    expect(subject.targetingConfig.selectionMethod).toBe('manual');
    expect(subject.triggerConfig.global.compoundTriggers[0]).toMatchObject({
      id: 'proximity',
      category: 'trap',
      parameters: { creature_type: 'enemy' }
    });
    expect(subject.damageConfig.formula).toBe('2d6');
    expect(subject.resourceCost.actionPoints).toBe(1);
    expect(subject.resourceCost.resourceValues?.mana).toBe(4);
  }

  // Reopen via wizardEditRequest -> inspect restored controls -> edit -> update
  firstMount.unmount();
  useSpellbookStore.setState({
    wizardEditRequest: { spell: clone(saved), guard: { isCurrent: () => true } }
  });
  const editMount = mountWizard();
  const reopenedName = await screen.findByPlaceholderText(/Enter a name for your spell/i);
  await waitFor(() => {
    expect(reopenedName.value).toBe('Ember Snare Trap');
  });

  await clickStep(/Effects/i);
  const restoredFormula = await screen.findByLabelText(/Damage formula/i);
  expect(restoredFormula.value).toBe('2d6');
  await act(async () => {
    fireEvent.change(restoredFormula, { target: { value: '3d6' } });
  });

  await clickStep(/Triggers/i);
  const restoredSelect = await waitFor(() => {
    const sel = document.querySelector('.pf-selected-trigger select.pf-select');
    expect(sel).toBeTruthy();
    return sel;
  });
  expect(restoredSelect.value).toBe('enemy');
  expect(document.querySelector('.pf-selected-trigger .pf-trigger-summary')?.textContent || '').toMatch(
    /an enemy comes within 10 ft/i
  );

  await clickStep(/Trap Placement/i);
  const restoredRadius = await waitFor(() => {
    const el = document.querySelector('#placementRadius');
    expect(el).toBeTruthy();
    return el;
  });
  expect(restoredRadius.value).toBe('10');
  expect(document.querySelector('#durationValue')?.value).toBe('10');
  expect(document.querySelector('#durationUnit')?.value).toBe('turns');

  await act(async () => {
    fireEvent.change(restoredRadius, { target: { value: '15' } });
    fireEvent.change(document.querySelector('#durationValue'), { target: { value: '5' } });
    fireEvent.change(document.querySelector('#durationUnit'), { target: { value: 'rounds' } });
  });

  await clickStep(/Review/i);
  await waitFor(() => {
    const text = document.body.textContent || '';
    expect(text).toMatch(/15\s*ft(?:\s+radius)?/i);
    expect(text).toMatch(/5\s+rounds/i);
    expect(text).toMatch(/enemy comes within 15 ft/i);
  });

  const prevModified = saved.lastModified;
  const updateBtn = await screen.findByRole('button', { name: /Update Spell/i });
  await act(async () => {
    fireEvent.click(updateBtn);
  });
  await waitFor(() => {
    const found = mockPersisted.data.spells.find((s) => s.id === saved.id);
    expect(found).toBeTruthy();
    expect(found.lastModified).not.toBe(prevModified);
  });

  const edited = clone(mockPersisted.data.spells.find((s) => s.id === saved.id));
  expect(edited.id).toBe(saved.id);
  for (const subject of [edited, edited.authoredDraft, JSON.parse(edited.serializedData)]) {
    expect(subject.damageConfig.formula).toBe('3d6');
    expect(subject.trapConfig.placementRadius).toBe(15);
    expect(subject.trapConfig.durationValue).toBe(5);
    expect(subject.trapConfig.durationUnit).toBe('rounds');
    expect(subject.targetingConfig.aoeParameters.radius).toBe(15);
    expect(subject.targetingConfig.selectionMethod).toBe('manual');
  }

  // Export library JSON -> parse -> import with collision AND into fresh library
  const exportedJson = exportLibrary(libraryStateRef, 'json');
  expect(exportedJson).toContain('Ember Snare Trap');
  const importedLib = importLibrary(exportedJson);
  expect(importedLib.spells.some((s) => s.id === edited.id)).toBe(true);

  const countBeforeCollision = libraryStateRef.spells.length;
  await act(async () => {
    libraryDispatchRef(
      libraryActionCreators.importLibrary({
        spells: importedLib.spells,
        categories: importedLib.categories
      })
    );
  });
  await waitFor(() => expect(libraryStateRef.spells.length).toBe(countBeforeCollision + 1));
  const collidedCopy = libraryStateRef.spells.find((s) => s.name === 'Ember Snare Trap (Imported)');
  expect(collidedCopy).toBeTruthy();

  editMount.unmount();

  // Reimport into a clean library and reopen in SpellwizardApp
  seedEmptyLibrary();
  const cleanMount = mountWizard();
  await waitFor(() => expect(libraryDispatchRef).toBeTruthy());
  await act(async () => {
    libraryDispatchRef(
      libraryActionCreators.importLibrary({
        spells: importedLib.spells,
        categories: importedLib.categories
      })
    );
  });
  await waitFor(() => expect(mockPersisted.data.spells.some((s) => s.id === edited.id)).toBe(true));
  const importedRecord = clone(mockPersisted.data.spells.find((s) => s.id === edited.id));
  cleanMount.unmount();

  useSpellbookStore.setState({
    wizardEditRequest: { spell: clone(importedRecord), guard: { isCurrent: () => true } }
  });
  const reopenedImportMount = mountWizard();
  const reimportedName = await screen.findByPlaceholderText(/Enter a name for your spell/i);
  await waitFor(() => {
    expect(reimportedName.value).toBe('Ember Snare Trap');
  });

  await clickStep(/Effects/i);
  expect((await screen.findByLabelText(/Damage formula/i)).value).toBe('3d6');

  await clickStep(/Triggers/i);
  const reimportedSelect = await waitFor(() => {
    const sel = document.querySelector('.pf-selected-trigger select.pf-select');
    expect(sel).toBeTruthy();
    return sel;
  });
  expect(reimportedSelect.value).toBe('enemy');
  expect(document.querySelector('.pf-selected-trigger .pf-trigger-summary')?.textContent || '').toMatch(
    /an enemy comes within 15 ft/i
  );

  await clickStep(/Trap Placement/i);
  const reimportedRadius = await waitFor(() => {
    const el = document.querySelector('#placementRadius');
    expect(el).toBeTruthy();
    return el;
  });
  expect(reimportedRadius.value).toBe('15');
  expect(document.querySelector('#durationValue')?.value).toBe('5');
  expect(document.querySelector('#durationUnit')?.value).toBe('rounds');
  expect(wizardStateRef?.targetingConfig?.selectionMethod).toBe('manual');
  expect(importedRecord.targetingConfig.selectionMethod).toBe('manual');

  reopenedImportMount.unmount();
  return importedRecord;
}

let cachedImportedTrap = null;

describe('Wizard TRAP authoring preservation and GM-managed manual refusal', () => {
  jest.setTimeout(40000);

  beforeEach(() => {
    mockPersisted = null;
    libraryStateRef = null;
    libraryDispatchRef = null;
    wizardStateRef = null;

    mockResourceCalls.updateResource = [];
    mockResourceCalls.updateClassResource = [];
    mockResourceCalls.consumeClassResource = [];
    mockResourceCalls.gainClassResource = [];

    useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
    useSpellConsequenceStore.setState({
      owner: null,
      authoredRoomId: null,
      authoredEntries: [],
      creatureSources: []
    });
    useTriggerOfferStore.setState({
      projection: null,
      roomId: null,
      loading: false,
      error: null,
      setupRequest: null
    });
    useGameStore.setState({
      isInMultiplayer: false,
      isGMMode: false,
      multiplayerRoom: null,
      multiplayerSocket: null
    });
    useCharacterStore.setState({
      name: 'Aldric',
      currentCharacterId: 'char-1',
      activeCharacterId: 'char-1',
      mana: { current: 20, max: 20 },
      actionPoints: { current: 4, max: 4 },
      tempMana: 0,
      tempActionPoints: 0,
      updateResource: (...args) => mockResourceCalls.updateResource.push(args),
      updateClassResource: (...args) => mockResourceCalls.updateClassResource.push(args),
      consumeClassResource: (...args) => mockResourceCalls.consumeClassResource.push(args),
      gainClassResource: (...args) => mockResourceCalls.gainClassResource.push(args)
    });

    registerStore('characterStore', useCharacterStore);
    registerStore('gameStore', useGameStore);
    registerStore('chatStore', useChatStore);
  });

  afterEach(() => {
    cleanup();
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  test('author fresh Wizard TRAP -> save -> reopen -> edit -> export/import -> reopen preserves all settings and GM-managed labels', async () => {
    cachedImportedTrap = await authorEditExportImportTrapViaUI();
  });

  test('unsupported TRAP stays strictly GM-managed and cannot charge resources or apply effects through automatic paths', async () => {
    const trap = clone(cachedImportedTrap || (await authorEditExportImportTrapViaUI()));

    // 1. Client & server compiler validators refuse TRAP
    const clientCompiled = clientDefinitionFromWizard(trap);
    const serverCompiled = serverDefinitionFromWizard(trap);
    expect(clientCompiled).toMatchObject({ ok: false, code: 'unsupported_wizard_record' });
    expect(clientCompiled.reason).toContain('Immediate ACTION required');
    expect(serverCompiled).toEqual(clientCompiled);

    const passiveEntryTrap = clone(trap);
    passiveEntryTrap.triggerConfig.global.compoundTriggers = [
      { id: 'moves_into_radius', category: 'trap', name: 'Moves into radius', parameters: { perspective: 'enemy' } }
    ];
    expect(clientDefinitionFromWizard(passiveEntryTrap).ok).toBe(false);
    expect(serverDefinitionFromWizard(passiveEntryTrap).ok).toBe(false);

    // 2. Execution compatibility and execution plan classify TRAP as manual / non-executable
    expect(explainExecution(trap).state).toBe(STATES.UNSUPPORTED);
    const plan = explainPlan(trap);
    expect(plan.wholeExecutable).toBe(false);
    expect(plan.executableClaim).toBe(false);

    // 3. Shared room setup with spies on dice, chat notifications, and socket emit
    const socketEmits = [];
    const diceCalls = [];
    const chatMessages = [];
    useDiceStore.setState({
      rollDiceDirectly: async (...args) => {
        diceCalls.push(args);
        return [];
      }
    });
    useChatStore.setState({
      addNotification: (tab, notification) => {
        chatMessages.push({ tab, notification });
      }
    });
    useGameStore.setState({
      isInMultiplayer: true,
      isGMMode: true,
      multiplayerRoom: { id: 'room-1' },
      multiplayerSocket: {
        connected: true,
        emit: (...args) => socketEmits.push(args)
      }
    });
    useSpellConsequenceStore.setState({
      owner: null,
      authoredRoomId: 'room-1',
      authoredEntries: [],
      creatureSources: []
    });
    useTriggerOfferStore.setState({
      projection: { roomId: 'room-1', viewerRole: 'gm' },
      roomId: 'room-1',
      loading: false,
      error: null,
      setupRequest: null
    });

    // 4. AuthoredAdmission in GM shared room refuses admission
    const admissionView = render(<AuthoredAdmission spell={trap} />);
    const admitBtn = screen.getByRole('button', { name: 'Admit this saved version' });
    expect(admitBtn).toBeDisabled();
    expect(screen.getByText(/Trigger setup unavailable/i)).toBeInTheDocument();
    admissionView.unmount();

    // 5. Direct routing & manual gate checks
    expect(isP9Routed(trap)).toBe(false);
    expect(routeSpellCast(trap, { producer: 'sheet' })).toBe(false);
    expect(manualSharedReason(trap)).toContain('Immediate ACTION required');
    expect(useSpellConsequenceStore.getState().owner).toBeNull();

    // 6. Mounted SpellActionBar: cast click refuses execution, keeps resources untouched, and allows manual notice
    const actionBarView = render(
      <SpellLibraryProvider>
        <SpellActionBar characterId="trap-char-1" allSpells={[trap]} />
      </SpellLibraryProvider>
    );
    act(() => {
      window.dispatchEvent(
        new CustomEvent('spell-action-bar-assign-item', { detail: { spell: trap, autoFindSlot: true } })
      );
    });
    const spellIcon = await screen.findByAltText(trap.name);
    await act(async () => {
      fireEvent.click(spellIcon);
    });

    const castConfirmBtn = await screen.findByRole('button', { name: /Cast Spell/i });
    await act(async () => {
      fireEvent.click(castConfirmBtn);
    });

    expect(useSpellConsequenceStore.getState().owner).toBeNull();
    const sheetNote = screen.getByRole('note');
    expect(sheetNote.textContent).toContain(MANUAL_NOTE);
    expect(sheetNote.textContent).toMatch(/Immediate ACTION required/i);
    const postNoticeBtn = screen.getByRole('button', { name: /Post manual notice/i });
    await act(async () => {
      fireEvent.click(postNoticeBtn);
    });

    expect(chatMessages.length).toBeGreaterThan(0);
    expect(chatMessages[chatMessages.length - 1].notification?.message || JSON.stringify(chatMessages)).toMatch(
      /Ember Snare Trap/i
    );
    expect(useCharacterStore.getState().mana.current).toBe(20);
    expect(useCharacterStore.getState().actionPoints.current).toBe(4);
    expect(mockResourceCalls.updateResource).toHaveLength(0);
    expect(mockResourceCalls.updateClassResource).toHaveLength(0);
    expect(mockResourceCalls.consumeClassResource).toHaveLength(0);
    expect(mockResourceCalls.gainClassResource).toHaveLength(0);
    expect(diceCalls).toHaveLength(0);
    expect(socketEmits).toHaveLength(0);
    actionBarView.unmount();

    // 7. Mounted SpellCastConfirmation (HUD ActionBar path)
    const countBeforeConfirm = chatMessages.length;
    const confirmView = render(
      <SpellCastConfirmation
        spell={trap}
        onConfirm={() => postManualNotice(trap, 'Aldric')}
        onCancel={() => {}}
      />
    );
    const hudNote = screen.getByRole('note');
    expect(hudNote.textContent).toContain(MANUAL_NOTE);
    expect(hudNote.textContent).toMatch(/Immediate ACTION required/i);
    const hudPostBtn = screen.getByRole('button', { name: /Post manual notice/i });
    await act(async () => {
      fireEvent.click(hudPostBtn);
    });

    expect(chatMessages.length).toBe(countBeforeConfirm + 1);
    expect(mockResourceCalls.updateResource).toHaveLength(0);
    expect(mockResourceCalls.updateClassResource).toHaveLength(0);
    expect(mockResourceCalls.consumeClassResource).toHaveLength(0);
    expect(mockResourceCalls.gainClassResource).toHaveLength(0);
    expect(diceCalls).toHaveLength(0);
    expect(socketEmits).toHaveLength(0);
    confirmView.unmount();
  });
});
