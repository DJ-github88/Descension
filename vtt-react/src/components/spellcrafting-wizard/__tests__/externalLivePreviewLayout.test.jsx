/**
 * ExternalLivePreview Layout, Collapse/Docking (1024x768) & Save Entry Regression Suite
 *
 * Verifies:
 * 1. At 1024x768, ExternalLivePreview docks outside the Spellbook footprint and collapses
 *    by default so it does not cover the Spell Wizard editor.
 * 2. Toggling Show Preview / Hide Preview (and Escape inside expanded docked preview)
 *    cleanly expands and collapses the live preview card while keeping it bounded in 1024x768.
 * 3. On larger viewports (e.g. 1920x1080), ExternalLivePreview floats expanded beside the
 *    Spellbook window with zero overlap, still supports manual collapse/expand, and reacts
 *    to live viewport resize transitions (1920x1080 <-> 1024x768).
 * 4. Save Entry dialog (TableEntryEditor MythrillWindow modal) stays strictly above
 *    ExternalLivePreview in z-index and preserves full Add/Edit -> Save Entry -> spell
 *    save -> reopen round-trip behavior at 1024x768.
 * 5. Unsupported GM-reference abilities remain editable at 1024x768, reflect live edits in
 *    the preview, and survive save & reopen intact.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import ExternalLivePreview, {
  computeExternalPreviewLayout,
  DOCK_BAR_HEIGHT,
  PREVIEW_WINDOW_GAP
} from '../ExternalLivePreview';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardState } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import useSettingsStore from '../../../store/settingsStore';
import useWindowManagerStore from '../../../store/windowManagerStore';
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
  showConfirm: jest.fn(() => Promise.resolve(true)),
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
  const auth = { user: { uid: 'preview-layout-user', isGuest: false } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(auth) : auth);
  useAuthStore.getState = () => auth;
  return { __esModule: true, default: useAuthStore };
});

const clone = (v) => JSON.parse(JSON.stringify(v));

let latestWizardState = null;
function WizardProbe() {
  latestWizardState = useSpellWizardState();
  return null;
}

function setViewportSize(width, height) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
}

function dispatchViewportResize(width, height) {
  act(() => {
    setViewportSize(width, height);
    window.dispatchEvent(new Event('resize'));
  });
}

function mountWizardWithPreview({ seedSpells = [], viewport = { width: 1024, height: 768 } } = {}) {
  setViewportSize(viewport.width, viewport.height);
  mockPersisted = {
    version: 1,
    lastSaved: '2026-11-23T00:00:00.000Z',
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: seedSpells.map(clone),
      collections: [],
      selectedSpell: null
    }
  };
  useSpellbookStore.setState({
    activeTab: 'wizard',
    wizardEditRequest: null,
    windowPosition: null,
    windowSize: { width: 1000, height: 700 }
  });

  return render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <SpellwizardApp hideHeader={true} />
          <ExternalLivePreview />
          <WizardProbe />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
}

async function clickStep(stepName) {
  const nav = screen.getByRole('navigation', { name: 'Spell wizard steps' });
  const btn = within(nav).getByRole('button', { name: new RegExp(stepName, 'i') });
  await act(async () => { fireEvent.click(btn); });
  await waitFor(() => expect(btn).toHaveAttribute('aria-current', 'step'));
}

beforeEach(() => {
  mockPersisted = null;
  latestWizardState = null;
  setViewportSize(1024, 768);
  window.alert = jest.fn();
  useWindowManagerStore.setState({
    windows: new Map(),
    nextWindowZ: 1000,
    nextModalZ: 2000
  });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({
    activeTab: 'wizard',
    wizardEditRequest: null,
    windowPosition: null,
    windowSize: { width: 1000, height: 700 }
  });
});

describe('ExternalLivePreview layout geometry helper (computeExternalPreviewLayout)', () => {
  test('docks below the centered 1000x700 Spellbook at 1024x768 with zero vertical overlap', () => {
    const layout = computeExternalPreviewLayout({
      viewportWidth: 1024,
      viewportHeight: 768,
      windowPosition: null,
      windowSize: { width: 1000, height: 700 },
      windowScale: 1
    });

    expect(layout.mode).toBe('docked');
    expect(layout.canFloatBeside).toBe(false);
    expect(layout.dockEdge).toBe('bottom');
    expect(layout.procPosition).toBe('below');
    expect(layout.spellbookRect).toEqual({
      left: 12,
      top: 34,
      right: 1012,
      bottom: 734,
      width: 1000,
      height: 700
    });

    // Collapsed dock bar (30px tall) sits at [736..766], strictly below Spellbook bottom (734).
    const collapsedDockTop = 768 - layout.bottom - 30;
    expect(collapsedDockTop).toBeGreaterThanOrEqual(layout.spellbookRect.bottom);
  });

  test('flips dock to top edge at 1024x768 when Spellbook is dragged to the bottom edge', () => {
    const layout = computeExternalPreviewLayout({
      viewportWidth: 1024,
      viewportHeight: 768,
      windowPosition: { x: 12, y: 68 },
      windowSize: { width: 1000, height: 700 },
      windowScale: 1
    });

    expect(layout.mode).toBe('docked');
    expect(layout.dockEdge).toBe('top');
    const collapsedDockBottom = layout.top + 30;
    expect(collapsedDockBottom).toBeLessThanOrEqual(layout.spellbookRect.top);
  });

  test('respects explicit windowPosition x=0, y=0 without falsy fallback coercion', () => {
    const layout = computeExternalPreviewLayout({
      viewportWidth: 1440,
      viewportHeight: 900,
      windowPosition: { x: 0, y: 0 },
      windowSize: { width: 1000, height: 700 },
      windowScale: 1
    });

    expect(layout.spellbookRect.left).toBe(0);
    expect(layout.spellbookRect.top).toBe(0);
    expect(layout.mode).toBe('floating');
    expect(layout.side).toBe('right');
    expect(layout.left).toBe(1000 + PREVIEW_WINDOW_GAP);
  });

  test('floats cleanly beside the Spellbook on large 1920x1080 viewports with zero overlap', () => {
    const layout = computeExternalPreviewLayout({
      viewportWidth: 1920,
      viewportHeight: 1080,
      windowPosition: null,
      windowSize: { width: 1000, height: 700 },
      windowScale: 1
    });

    expect(layout.mode).toBe('floating');
    expect(layout.canFloatBeside).toBe(true);
    expect(layout.side).toBe('right');
    expect(layout.procPosition).toBe('right');
    expect(layout.left).toBeGreaterThanOrEqual(layout.spellbookRect.right + PREVIEW_WINDOW_GAP);
    expect(layout.left + layout.width).toBeLessThanOrEqual(1920 - 12);
  });

  test('handles default windowScale=0.8 cleanly at both 1024x768 (docked) and 1920x1080 (floating)', () => {
    const compact = computeExternalPreviewLayout({
      viewportWidth: 1024,
      viewportHeight: 768,
      windowPosition: null,
      windowSize: { width: 1000, height: 700 },
      windowScale: 0.8
    });
    expect(compact.mode).toBe('docked');
    expect(compact.canFloatBeside).toBe(false);
    expect(compact.dockEdge).toBe('bottom');
    expect(768 - compact.bottom - 30).toBeGreaterThanOrEqual(compact.spellbookRect.bottom);

    const wide = computeExternalPreviewLayout({
      viewportWidth: 1920,
      viewportHeight: 1080,
      windowPosition: null,
      windowSize: { width: 1000, height: 700 },
      windowScale: 0.8
    });
    expect(wide.mode).toBe('floating');
    expect(wide.canFloatBeside).toBe(true);
    expect(wide.left).toBe(wide.spellbookRect.right + PREVIEW_WINDOW_GAP);
  });
});

describe('ExternalLivePreview 1024x768 layout, toggle, Save Entry dialog & GM reference preservation', () => {
  jest.setTimeout(30000);

  test('at 1024x768, ExternalLivePreview defaults to docked + collapsed and toggles expand/collapse cleanly', async () => {
    mountWizardWithPreview({ viewport: { width: 1024, height: 768 } });

    const preview = document.body.querySelector('.adventurer-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('data-preview-layout', 'docked');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');
    expect(preview).toHaveAttribute('data-preview-dock-edge', 'bottom');
    expect(preview.style.position).toBe('fixed');
    expect(preview.style.bottom).toBe('2px');
    expect(preview.style.right).toBe('12px');
    expect(preview.style.maxHeight).toBe(`${DOCK_BAR_HEIGHT}px`);
    // Z-index stays strictly below MythrillWindow modal backdrop (1999) and modals (2000+)
    expect(Number(preview.style.zIndex)).toBeLessThan(1999);

    // Card body is hidden while collapsed so it never covers the Wizard editor
    const cardRegion = document.getElementById('external-live-preview-card-region');
    expect(cardRegion).toBeInTheDocument();
    expect(cardRegion).toHaveAttribute('hidden');

    // Wizard editor remains interactive while preview is docked/collapsed
    const nameInput = screen.getByPlaceholderText('Enter a name for your spell');
    fireEvent.change(nameInput, { target: { value: 'Frostbite Dart' } });
    const dockBar = preview.querySelector('.external-live-preview-bar');
    expect(within(dockBar).getByText('Frostbite Dart')).toBeInTheDocument();

    // Expand via toggle button
    const showBtn = screen.getByRole('button', { name: /Show Preview/i });
    expect(showBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(showBtn);

    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');
    expect(cardRegion).not.toHaveAttribute('hidden');
    expect(within(cardRegion).getByText('Frostbite Dart')).toBeInTheDocument();

    const hideBtn = screen.getByRole('button', { name: /Hide Preview/i });
    expect(hideBtn).toHaveAttribute('aria-expanded', 'true');

    // Escape inside expanded docked preview collapses it and returns focus to toggle button
    fireEvent.keyDown(preview, { key: 'Escape' });
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');
    expect(cardRegion).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /Show Preview/i }));

    // Re-expand and collapse via Hide Preview click
    fireEvent.click(screen.getByRole('button', { name: /Show Preview/i }));
    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');
    fireEvent.click(screen.getByRole('button', { name: /Hide Preview/i }));
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');
    expect(cardRegion).toHaveAttribute('hidden');
  });

  test('stays floating and expanded on 1920x1080, supports manual collapse, and adapts across live viewport resizes', () => {
    const scale = useSettingsStore.getState().windowScale || 1;
    const expectedMinLeft = ((1920 - 1000) / 2) + (1000 * scale) + PREVIEW_WINDOW_GAP;
    mountWizardWithPreview({ viewport: { width: 1920, height: 1080 } });

    const preview = document.body.querySelector('.adventurer-preview');
    const cardRegion = document.getElementById('external-live-preview-card-region');

    expect(preview).toHaveAttribute('data-preview-layout', 'floating');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');
    expect(preview).toHaveAttribute('data-preview-dock-edge', 'none');
    expect(cardRegion).not.toHaveAttribute('hidden');
    expect(parseInt(preview.style.left, 10)).toBeGreaterThanOrEqual(expectedMinLeft);

    // User can still manually collapse in floating mode
    fireEvent.click(screen.getByRole('button', { name: /Hide Preview/i }));
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');
    expect(cardRegion).toHaveAttribute('hidden');

    // Re-expand in floating mode
    fireEvent.click(screen.getByRole('button', { name: /Show Preview/i }));
    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');

    // Resizing down to 1024x768 automatically docks and collapses out of the Wizard's way
    dispatchViewportResize(1024, 768);
    expect(preview).toHaveAttribute('data-preview-layout', 'docked');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');
    expect(cardRegion).toHaveAttribute('hidden');

    // Resizing back up to 1920x1080 automatically restores floating expanded layout
    dispatchViewportResize(1920, 1080);
    expect(preview).toHaveAttribute('data-preview-layout', 'floating');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');
    expect(cardRegion).not.toHaveAttribute('hidden');
  });

  test('preserves Save Entry dialog behavior (above preview in z-index) and spell save/reopen round-trip at 1024x768', async () => {
    mountWizardWithPreview({ viewport: { width: 1024, height: 768 } });

    // Fill basic info
    fireEvent.change(screen.getByPlaceholderText('Enter a name for your spell'), {
      target: { value: 'Dock Safe Fortune Bolt' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
      target: { value: 'Rolls 1d6 for an ember strike or vital mend.' }
    });

    // Step 2: Immediate action
    await clickStep('Spell Type');
    const wizardMain = document.querySelector('.wizard-main-content');
    const timingSelect = document.getElementById('authoredActionTiming') || await (async () => {
      const actionCard = await within(wizardMain).findByText(/^Action$/i);
      await act(async () => { fireEvent.click(actionCard); });
      return await screen.findByLabelText(/Action timing/i);
    })();
    await act(async () => { fireEvent.change(timingSelect, { target: { value: 'IMMEDIATE' } }); });

    // Step 3: Outcome Table mode
    await clickStep('Effects');
    const outcomeCard = await screen.findByText(/Outcome Table \(Dice \/ Coin \/ Card\)/i);
    await act(async () => { fireEvent.click(outcomeCard); });

    // Step 4: Single ranged
    await clickStep('Targeting');
    await act(async () => { fireEvent.click(await screen.findByText('Single Target')); });
    await act(async () => { fireEvent.click(await screen.findByText('Ranged')); });

    // Step 5: Explicit mana
    await clickStep('Resources');
    if (!document.querySelector('.resource-cost-config input')) {
      const manaCard = await screen.findByText('Mana', { selector: '.resource-type-name, h4, span, div' });
      await act(async () => { fireEvent.click(manaCard); });
    }
    await waitFor(() => expect(document.querySelector('.resource-cost-config input')).toBeTruthy());
    await act(async () => {
      fireEvent.change(document.querySelector('.resource-cost-config input'), { target: { value: '2' } });
    });

    // Rollable Table step -> open Save Entry modal even with preview manually expanded
    await clickStep('Rollable Table');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Dice$/i })); });
    const diceSelect = await screen.findByLabelText(/Dice Type/i);
    await act(async () => { fireEvent.change(diceSelect, { target: { value: 'd6' } }); });

    // Expand ExternalLivePreview to verify modal still stacks strictly above it
    fireEvent.click(screen.getByRole('button', { name: /Show Preview/i }));
    const preview = document.body.querySelector('.adventurer-preview');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'false');

    // Open Edit Table Entry modal
    const editButtons = screen.getAllByRole('button', { name: /Edit entry/i });
    await act(async () => { fireEvent.click(editButtons[0]); });

    const entryDialog = await screen.findByRole('dialog', { name: /Edit Table Entry/i });
    expect(entryDialog).toBeInTheDocument();

    // Modal backdrop and modal dialog MUST stack strictly above ExternalLivePreview
    const modalBackdrop = document.body.querySelector('.wow-window-modal-backdrop');
    expect(modalBackdrop).toBeTruthy();
    const previewZ = Number(preview.style.zIndex);
    const backdropZ = Number(modalBackdrop.style.zIndex);
    expect(previewZ).toBeLessThan(backdropZ);

    // Edit fields inside Save Entry dialog and click Save Entry
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Min Roll/i), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText(/Max Roll/i), { target: { value: '3' } });
      fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Ember Lash' } });
      fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'damage' } });
      fireEvent.change(screen.getByLabelText(/Damage Formula/i), { target: { value: '2d6' } });
      fireEvent.change(screen.getByLabelText(/Damage Type/i), { target: { value: 'ember' } });
    });
    const saveEntryBtn = screen.getByRole('button', { name: /Save Entry/i });
    await act(async () => { fireEvent.click(saveEntryBtn); });

    // Dialog closes and entry is persisted in table state
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Edit Table Entry/i })).not.toBeInTheDocument());
    expect(screen.getByText('Ember Lash')).toBeInTheDocument();

    // Edit second entry via Save Entry dialog too
    const editButtons2 = screen.getAllByRole('button', { name: /Edit entry/i });
    await act(async () => { fireEvent.click(editButtons2[1]); });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Min Roll/i), { target: { value: '4' } });
      fireEvent.change(screen.getByLabelText(/Max Roll/i), { target: { value: '6' } });
      fireEvent.change(screen.getByLabelText(/^Name \*/i), { target: { value: 'Vital Surge' } });
      fireEvent.change(screen.getByLabelText(/Effect Type/i), { target: { value: 'healing' } });
      fireEvent.change(screen.getByLabelText(/Healing Formula/i), { target: { value: '1d8+2' } });
    });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Save Entry/i })); });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /Edit Table Entry/i })).not.toBeInTheDocument());

    // Collapse preview back into dock bar and save via ExternalLivePreview Complete Spell
    fireEvent.click(screen.getByRole('button', { name: /Hide Preview/i }));
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');

    const completeBtn = screen.getByRole('button', { name: /Complete Spell/i });
    await act(async () => { fireEvent.click(completeBtn); });

    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));
    const saved = clone(mockPersisted.data.spells[0]);
    expect(saved.name).toBe('Dock Safe Fortune Bolt');
    expect(saved.rollableTable.entries[0]).toMatchObject({
      name: 'Ember Lash',
      range: { min: 1, max: 3 },
      effectType: 'damage'
    });
    expect(saved.rollableTable.entries[1]).toMatchObject({
      name: 'Vital Surge',
      range: { min: 4, max: 6 },
      effectType: 'healing'
    });

    // Reopen saved spell in edit mode and confirm table entries survive intact
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => { window.handleLoadSpell(clone(saved), true); });
    await waitFor(() => expect(latestWizardState?.editMode).toBe(true));
    expect(latestWizardState.name).toBe('Dock Safe Fortune Bolt');
    expect(latestWizardState.rollableTable.entries).toHaveLength(2);
    expect(latestWizardState.rollableTable.entries[0].name).toBe('Ember Lash');
    expect(latestWizardState.rollableTable.entries[1].name).toBe('Vital Surge');
  });

  test('unsupported GM-reference ability stays editable at 1024x768, updates preview, and survives save/reopen', async () => {
    const unsupportedGmSpell = {
      id: 'gm-ref-unsupported-aura',
      name: 'Veil of Quiet Stars',
      description: 'Narrative ward adjudicated by the GM.',
      level: 1,
      spellType: 'PASSIVE',
      effectTypes: ['buff'],
      effectsMap: { buff: true },
      typeConfig: { school: 'arcane', icon: 'spell_holy_devotion', tags: ['ward', 'gm-note'] },
      buffConfig: {
        durationValue: 3,
        durationType: 'rounds',
        statModifiers: [{ stat: 'armor', value: 2 }]
      },
      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self_centered',
        rangeDistance: 0,
        targetRestrictions: ['self'],
        maxTargets: 1
      },
      resourceCost: { actionPoints: 0, mana: 0, components: [] },
      cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
      dateCreated: '2026-11-23T00:00:00.000Z',
      lastModified: '2026-11-23T00:00:00.000Z',
      categoryIds: ['uncategorized'],
      categories: ['all']
    };

    expect(definitionFromWizard(clone(unsupportedGmSpell), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(false);

    mountWizardWithPreview({ seedSpells: [unsupportedGmSpell], viewport: { width: 1024, height: 768 } });
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => { window.handleLoadSpell(clone(unsupportedGmSpell), true); });
    await waitFor(() => expect(latestWizardState?.editMode).toBe(true));

    const preview = document.body.querySelector('.adventurer-preview');
    expect(preview).toHaveAttribute('data-preview-layout', 'docked');
    expect(preview).toHaveAttribute('data-preview-collapsed', 'true');

    // Edit unsupported GM reference spell while preview is collapsed
    fireEvent.change(screen.getByPlaceholderText('Enter a name for your spell'), {
      target: { value: 'Veil of Quiet Stars (GM Revised)' }
    });
    fireEvent.change(screen.getByPlaceholderText('Describe what your spell does and how it appears'), {
      target: { value: 'Updated GM reference note for table adjudication.' }
    });

    // Expand preview and confirm live card shows updated GM-reference state
    fireEvent.click(screen.getByRole('button', { name: /Show Preview/i }));
    const cardRegion = document.getElementById('external-live-preview-card-region');
    expect(cardRegion).not.toHaveAttribute('hidden');
    expect(cardRegion.textContent).toContain('Veil of Quiet Stars (GM Revised)');
    expect(cardRegion.textContent).toContain('Manual / stored only');

    // Save update via ExternalLivePreview Update Spell button
    const updateBtn = screen.getByRole('button', { name: /Update Spell/i });
    await act(async () => { fireEvent.click(updateBtn); });

    await waitFor(() => expect(mockPersisted.data.spells[0].name).toBe('Veil of Quiet Stars (GM Revised)'));
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(unsupportedGmSpell.id);
    expect(mockPersisted.data.spells[0].description).toBe('Updated GM reference note for table adjudication.');

    // Reopen into Wizard and confirm edits and GM-reference status persist
    await act(async () => { window.handleLoadSpell(clone(mockPersisted.data.spells[0]), true); });
    await waitFor(() => expect(latestWizardState?.name).toBe('Veil of Quiet Stars (GM Revised)'));
    expect(latestWizardState.description).toBe('Updated GM reference note for table adjudication.');
    expect(latestWizardState.spellType).toBe('PASSIVE');
    expect(definitionFromWizard(clone(mockPersisted.data.spells[0]), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).ok).toBe(false);
  });
});
