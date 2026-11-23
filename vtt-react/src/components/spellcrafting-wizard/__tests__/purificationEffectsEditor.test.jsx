/**
 * Purification effect editor tests (`PurificationEffects.jsx`).
 *
 * Covers:
 *   1) Selected effects display renders cleanly when effects are selected and hides when empty.
 *   2) Selecting and removing purification effects via the UI updates both DOM and wizard state
 *      (without effect feedback loops or duplicate-key React warnings).
 *   3) Dispel and resurrection rules remain unchanged (options, type switching clears effects,
 *      re-clicking active type preserves effects, dispel specific types & count clamping,
 *      resurrection resolution methods/formulas/examples, and Prism manual-play refusal).
 *   4) Legacy/unsupported purification abilities remain editable and preserved as GM reference.
 *   5) Authored Dispel and Resurrection spells survive save and reopen through the real
 *      Spell Wizard (`SpellWizardWrapper` / `SpellwizardApp` + `SpellLibraryProvider`).
 */
import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: require('crypto').webcrypto,
    configurable: true
  });
}

// Stub canvas 2D/webgl context for jsdom (hardwareDetector / settingsStore)
HTMLCanvasElement.prototype.getContext = function getContext() {
  return null;
};

let mockPersisted = null;

// Plain functions (not jest.fn) survive CRA resetMocks before each test.
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

import PurificationEffects, { PURIFICATION_TYPES } from '../data/effects/PurificationEffects';
import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators
} from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import { getDefaultLibrary } from '../core/utils/libraryManager';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { explainExecution, STATES } from '../utils/executionCompatibility';

const seedEmptyLibrary = () => {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-23T12:00:00.000Z',
    data: {
      ...defaults,
      spells: []
    }
  };
};

const seedLibraryWithSpell = (spell) => {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-23T12:00:00.000Z',
    data: {
      ...defaults,
      spells: [JSON.parse(JSON.stringify(spell))]
    }
  };
};

let latestWizardState = null;

function ConnectedPurificationHarness({ initialConfig = null }) {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  useEffect(() => {
    if (initialConfig) {
      dispatch(actionCreators.updatePurificationConfig(initialConfig));
    }
    // Run once on mount for test seeding
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    latestWizardState = state;
  }, [state]);

  return (
    <PurificationEffects
      state={state}
      dispatch={dispatch}
      actionCreators={actionCreators}
    />
  );
}

function renderConnectedPurification(initialConfig = null) {
  latestWizardState = null;
  return render(
    <SpellWizardProvider>
      <ConnectedPurificationHarness initialConfig={initialConfig} />
    </SpellWizardProvider>
  );
}

function mountProductionWizard() {
  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
}

async function clickWizardStep(stepPattern) {
  const nav = await screen.findByRole('navigation', { name: /Spell wizard steps/i });
  const btn = Array.from(nav.querySelectorAll('button')).find((el) =>
    stepPattern.test(el.getAttribute('aria-label') || el.textContent || '')
  );
  if (!btn) {
    throw new Error(`Missing wizard step matching ${stepPattern}`);
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

async function finalizeAndReadSavedSpell(expectedCount = 1) {
  const before = JSON.stringify(mockPersisted);
  await act(async () => {
    fireEvent.click(screen.getByTitle(/Finalize|Update/i));
  });
  await waitFor(() => {
    expect(JSON.stringify(mockPersisted)).not.toBe(before);
    expect(mockPersisted.data.spells.length).toBeGreaterThanOrEqual(expectedCount);
  });
  return mockPersisted.data.spells[mockPersisted.data.spells.length - 1];
}

describe('PurificationEffects editor — selected effects display, selection, removal, and rules', () => {
  beforeEach(() => {
    mockPersisted = null;
    latestWizardState = null;
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  it('renders selected effects display when dispel effects are selected and removes them cleanly via UI', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { container } = renderConnectedPurification();

      // Initially no effects selected -> Selected Effects section should not render
      expect(screen.queryByRole('heading', { name: /^Selected Effects$/i })).not.toBeInTheDocument();

      // Dispel exposes all 6 dispel effect cards
      const effectSelection = container.querySelector('.effect-selection');
      expect(effectSelection).toBeTruthy();
      ['Magic', 'Physical', 'Curse', 'Beneficial', 'Harmful', 'All Effects'].forEach((label) => {
        expect(within(effectSelection).getByText(label)).toBeInTheDocument();
      });

      // Select Magic and Physical
      fireEvent.click(within(effectSelection).getByText('Magic'));
      fireEvent.click(within(effectSelection).getByText('Physical'));

      // Selected Effects display renders cleanly with both effects
      const selectedSection = container.querySelector('.selected-effects');
      expect(selectedSection).toBeInTheDocument();
      expect(within(selectedSection).getByRole('heading', { name: /^Selected Effects$/i })).toBeInTheDocument();
      expect(within(selectedSection).getByText('Magic')).toBeInTheDocument();
      expect(within(selectedSection).getByText('Physical')).toBeInTheDocument();
      expect(within(selectedSection).getByText(/Remove magical effects from a target \(1 effect\)/i)).toBeInTheDocument();
      expect(within(selectedSection).getByText(/Remove physical effects from a target \(1 effect\)/i)).toBeInTheDocument();
      expect(within(selectedSection).getByText(/Specific Magical Effects:/i)).toBeInTheDocument();
      expect(within(selectedSection).getByText(/Specific Physical Effects:/i)).toBeInTheDocument();

      // Wizard context state updated cleanly
      await waitFor(() => {
        expect(latestWizardState?.purificationConfig?.selectedEffects?.map((e) => e.id)).toEqual(['magic', 'physical']);
      });

      // Configure specific physical & magical effects and dispel count
      const physicalCard = within(selectedSection).getByText('Physical').closest('.selected-effect');
      fireEvent.click(within(physicalCard).getByText('Disease'));
      fireEvent.click(within(physicalCard).getByText('Bleed'));

      expect(
        within(physicalCard).getByText(/Remove disease and bleed effects from a target \(1 effect\)/i)
      ).toBeInTheDocument();

      const magicCard = within(selectedSection).getByText('Magic').closest('.selected-effect');
      const rimeOption = within(magicCard).getByText('rime').closest('.specific-type-option');
      fireEvent.click(rimeOption);
      expect(rimeOption).toHaveClass('selected');
      fireEvent.click(rimeOption);
      expect(rimeOption).not.toHaveClass('selected');

      const plusBtn = within(magicCard).getByRole('button', { name: '+' });
      const minusBtn = within(magicCard).getByRole('button', { name: '-' });
      const countInput = magicCard.querySelector('.custom-number-input');
      fireEvent.click(plusBtn);
      fireEvent.click(plusBtn);
      expect(countInput).toHaveValue(3);
      expect(within(magicCard).getByText(/\(3 effects\)/i)).toBeInTheDocument();

      // Direct numeric edit + empty/NaN input guard
      fireEvent.change(countInput, { target: { value: '4' } });
      expect(countInput).toHaveValue(4);
      fireEvent.change(countInput, { target: { value: '' } });
      expect(countInput).toHaveValue(4);

      fireEvent.click(minusBtn);
      expect(countInput).toHaveValue(3);

      // Existing dispel clamping rule unchanged: count cannot go below 1
      fireEvent.click(minusBtn);
      fireEvent.click(minusBtn);
      fireEvent.click(minusBtn);
      expect(countInput).toHaveValue(1);

      await waitFor(() => {
        const phys = latestWizardState.purificationConfig.selectedEffects.find((e) => e.id === 'physical');
        const mag = latestWizardState.purificationConfig.selectedEffects.find((e) => e.id === 'magic');
        expect(phys.specificEffectTypes).toEqual(['disease', 'bleed']);
        expect(mag.specificEffectTypes).toEqual([]);
        expect(mag.customEffects).toBe(1);
      });

      // Remove Magic via the Selected Effects remove button
      fireEvent.click(within(selectedSection).getByRole('button', { name: /Remove Magic/i }));
      expect(within(selectedSection).queryByText('Magic')).not.toBeInTheDocument();
      expect(within(selectedSection).getByText('Physical')).toBeInTheDocument();
      expect(within(effectSelection).getByText('Magic').closest('.stat-card')).not.toHaveClass('selected');
      await waitFor(() => {
        expect(latestWizardState.purificationConfig.selectedEffects.map((e) => e.id)).toEqual(['physical']);
      });

      // Toggle Curse on and remove it via clicking its card again in Effect Selection
      fireEvent.click(within(effectSelection).getByText('Curse'));
      expect(within(selectedSection).getByText('Curse')).toBeInTheDocument();
      fireEvent.click(within(effectSelection).getByText('Curse'));
      expect(within(selectedSection).queryByText('Curse')).not.toBeInTheDocument();

      // Remove remaining Physical effect -> Selected Effects section disappears and state clears
      fireEvent.click(within(selectedSection).getByRole('button', { name: /Remove Physical/i }));
      expect(screen.queryByRole('heading', { name: /^Selected Effects$/i })).not.toBeInTheDocument();
      await waitFor(() => {
        expect(latestWizardState.purificationConfig.selectedEffects).toEqual([]);
      });

      // Zero React duplicate-key or maximum-update-depth errors
      const reactWarnings = errorSpy.mock.calls
        .map((args) => args.join(' '))
        .filter((msg) => /same key|Maximum update depth/i.test(msg));
      expect(reactWarnings).toEqual([]);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('keeps dispel and resurrection rules unchanged, including type switching and resurrection resolution/formulas', async () => {
    expect(Object.keys(PURIFICATION_TYPES)).toEqual(['DISPEL', 'RESURRECTION']);

    const { container } = renderConnectedPurification();
    const typeSection = container.querySelector('.purification-type-selection');
    const effectSelection = container.querySelector('.effect-selection');

    // Select a dispel effect first
    fireEvent.click(within(effectSelection).getByText('Curse'));
    expect(container.querySelector('.selected-effects')).toBeInTheDocument();

    // Clicking the already-active Dispel type does NOT wipe selected effects
    fireEvent.click(within(typeSection).getByText('Dispel'));
    await waitFor(() => {
      expect(latestWizardState.purificationConfig.selectedEffects.map((e) => e.id)).toEqual(['curse']);
    });

    // Switching from Dispel to Resurrection clears type-specific selected effects
    fireEvent.click(within(typeSection).getByText('Resurrection'));
    await waitFor(() => {
      expect(latestWizardState.purificationConfig.purificationType).toBe('resurrection');
      expect(latestWizardState.purificationConfig.selectedEffects).toEqual([]);
    });
    expect(screen.queryByRole('heading', { name: /^Selected Effects$/i })).not.toBeInTheDocument();

    // Select Resurrection effect -> Selected Effects display shows Dice/Cards/Coins + default formula + examples
    fireEvent.click(within(effectSelection).getByText('Resurrection'));
    const selectedSection = container.querySelector('.selected-effects');
    expect(selectedSection).toBeInTheDocument();
    expect(within(selectedSection).getByText(/Bring dead targets back to life \(2d8 \+ SPI\)/i)).toBeInTheDocument();

    const formulaInput = selectedSection.querySelector('.formula-input');
    expect(formulaInput).toHaveValue('2d8 + SPI');

    // Switch resolution method to Cards -> default CARDS formula & examples
    fireEvent.click(within(selectedSection).getByRole('button', { name: /Cards/i }));
    expect(formulaInput).toHaveValue('CARD_VALUE + SPI');
    expect(within(selectedSection).getByText(/Royal Revival/i)).toBeInTheDocument();

    // Click a formula example
    fireEvent.click(within(selectedSection).getByText(/Royal Revival/i));
    expect(formulaInput).toHaveValue('CARD_VALUE + (FACE_CARD ? SPI * 3 : SPI)');

    // Switch resolution method to Coins -> default COINS formula & examples
    fireEvent.click(within(selectedSection).getByRole('button', { name: /Coins/i }));
    expect(formulaInput).toHaveValue('HEADS_COUNT * 10 + SPI');
    expect(within(selectedSection).getByText(/Sacred Blessing/i)).toBeInTheDocument();

    // Custom formula typing updates config
    fireEvent.change(formulaInput, { target: { value: 'HEADS_COUNT * 12 + SPI' } });
    await waitFor(() => {
      expect(latestWizardState.purificationConfig.resolution).toBe('COINS');
      expect(latestWizardState.purificationConfig.resurrectionFormula).toBe('HEADS_COUNT * 12 + SPI');
      expect(latestWizardState.purificationConfig.selectedEffects[0]).toMatchObject({
        id: 'resurrection',
        purificationType: 'resurrection',
        resolution: 'COINS',
        resurrectionFormula: 'HEADS_COUNT * 12 + SPI'
      });
    });

    // Remove Resurrection effect via UI button
    fireEvent.click(within(selectedSection).getByRole('button', { name: /Remove Resurrection/i }));
    expect(screen.queryByRole('heading', { name: /^Selected Effects$/i })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(latestWizardState.purificationConfig.selectedEffects).toEqual([]);
    });

    // Re-select Resurrection, then switch back to Dispel -> clears type-specific selected effects
    fireEvent.click(within(effectSelection).getByText('Resurrection'));
    expect(container.querySelector('.selected-effects')).toBeInTheDocument();
    fireEvent.click(within(typeSection).getByText('Dispel'));
    await waitFor(() => {
      expect(latestWizardState.purificationConfig.purificationType).toBe('dispel');
      expect(latestWizardState.purificationConfig.selectedEffects).toEqual([]);
    });
    expect(screen.queryByRole('heading', { name: /^Selected Effects$/i })).not.toBeInTheDocument();
  });

  it('preserves legacy/unsupported purification configs without mutating on mount and keeps them editable as GM reference', async () => {
    const legacyConfig = {
      purificationType: 'cleanse_all',
      targetEffects: ['poison', 'disease', 'curse', 'magic'],
      strength: 'major'
    };
    const dispatch = jest.fn();

    const { container } = render(
      <PurificationEffects
        state={{ purificationConfig: legacyConfig }}
        dispatch={dispatch}
        actionCreators={actionCreators}
      />
    );

    // Mounting an already-populated legacy config does not clobber or dispatch spurious updates
    expect(dispatch).not.toHaveBeenCalled();

    // User can still switch to Dispel and select an effect while keeping unsupported fields editable
    const typeSection = container.querySelector('.purification-type-selection');
    fireEvent.click(within(typeSection).getByText('Dispel'));

    const effectSelection = container.querySelector('.effect-selection');
    fireEvent.click(within(effectSelection).getByText('Curse'));

    expect(container.querySelector('.selected-effects')).toBeInTheDocument();
    expect(dispatch).toHaveBeenCalled();
    const lastPayload = dispatch.mock.calls[dispatch.mock.calls.length - 1][0].payload;
    expect(lastPayload.purificationType).toBe('dispel');
    expect(lastPayload.selectedEffects.map((e) => e.id)).toEqual(['curse']);
    // Legacy sentinel metadata retained on the object unless overwritten
    expect(lastPayload.targetEffects).toEqual(['poison', 'disease', 'curse', 'magic']);
  });
});

describe('Purification spell end-to-end save, reopen, and manual GM-reference compatibility', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    mockPersisted = null;
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  it('authors a Dispel spell through the Wizard UI, saves, remains manual GM reference, reopens with selected effects rendered, and persists removal', async () => {
    seedEmptyLibrary();
    const firstMount = mountProductionWizard();

    // Step 1: Basic Info
    const nameInput = await screen.findByPlaceholderText(/Enter a name for your spell/i);
    const descInput = await screen.findByPlaceholderText(/Describe what your spell does/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Sanctified Purge' } });
      fireEvent.change(descInput, { target: { value: 'Strips arcane hexes and virulent diseases from an ally.' } });
    });

    // Step 3: Effects -> Purification
    await clickWizardStep(/Effects/i);
    const purificationCard = await screen.findByText(/^Purification$/i, {
      selector: '.selection-card-title, h4, h3, span, div'
    });
    await act(async () => {
      fireEvent.click(purificationCard);
    });

    // Wait for PurificationEffects to mount
    const purificationRoot = await waitFor(() => {
      const el = document.querySelector('.purification-effects-container');
      expect(el).toBeTruthy();
      return el;
    });

    const effectSelection = purificationRoot.querySelector('.effect-selection');
    await act(async () => {
      fireEvent.click(within(effectSelection).getByText('Magic'));
      fireEvent.click(within(effectSelection).getByText('Physical'));
      fireEvent.click(within(effectSelection).getByText('Curse'));
    });

    // Selected Effects display renders inside the real Wizard
    const selectedSection = purificationRoot.querySelector('.selected-effects');
    expect(selectedSection).toBeInTheDocument();

    // Configure Magic count = 2, Physical specific type = disease, and remove Curse via UI button
    const magicCard = within(selectedSection).getByText('Magic').closest('.selected-effect');
    const physicalCard = within(selectedSection).getByText('Physical').closest('.selected-effect');
    await act(async () => {
      fireEvent.click(within(magicCard).getByRole('button', { name: '+' }));
      fireEvent.click(within(physicalCard).getByText('Disease'));
      fireEvent.click(within(selectedSection).getByRole('button', { name: /Remove Curse/i }));
    });

    expect(within(selectedSection).queryByText('Curse')).not.toBeInTheDocument();

    // Save via Header Finalize
    const saved = await finalizeAndReadSavedSpell(1);
    expect(saved.name).toBe('Sanctified Purge');
    expect(saved.effectTypes).toContain('purification');
    expect(saved.purificationConfig.purificationType).toBe('dispel');
    expect(saved.purificationConfig.selectedEffects.map((e) => e.id)).toEqual(['magic', 'physical']);
    expect(saved.purificationConfig.selectedEffects.find((e) => e.id === 'magic').customEffects).toBe(2);
    expect(saved.purificationConfig.selectedEffects.find((e) => e.id === 'physical').specificEffectTypes).toEqual(['disease']);
    expect(saved.authoredDraft.purificationConfig).toEqual(saved.purificationConfig);

    // Dispel remains manual GM reference in Prism
    const compiled = definitionFromWizard(saved, { roomId: 'room-1' });
    expect(compiled.ok).toBe(false);
    const explained = explainExecution(saved, { shared: true });
    expect(explained.state).toBe(STATES.UNSUPPORTED);

    // Unmount and reopen the saved spell in a fresh Wizard
    firstMount.unmount();
    useSpellbookStore.setState({
      wizardEditRequest: { spell: JSON.parse(JSON.stringify(saved)), guard: { isCurrent: () => true } }
    });
    const reopenedMount = mountProductionWizard();

    await clickWizardStep(/Effects/i);
    const reopenedRoot = await waitFor(() => {
      const el = document.querySelector('.purification-effects-container');
      expect(el).toBeTruthy();
      return el;
    });

    // Restored Selected Effects display shows saved Magic (2) and Physical (disease), without Curse
    const reopenedSelected = reopenedRoot.querySelector('.selected-effects');
    expect(reopenedSelected).toBeInTheDocument();
    expect(within(reopenedSelected).getByText('Magic')).toBeInTheDocument();
    expect(within(reopenedSelected).getByText('Physical')).toBeInTheDocument();
    expect(within(reopenedSelected).queryByText('Curse')).not.toBeInTheDocument();

    const reopenedMagic = within(reopenedSelected).getByText('Magic').closest('.selected-effect');
    expect(within(reopenedMagic).getByDisplayValue('2')).toBeInTheDocument();
    const reopenedPhysical = within(reopenedSelected).getByText('Physical').closest('.selected-effect');
    expect(within(reopenedPhysical).getByText(/Remove disease effects from a target/i)).toBeInTheDocument();

    // Remove Physical after reopen, save again, and verify persistence
    await act(async () => {
      fireEvent.click(within(reopenedSelected).getByRole('button', { name: /Remove Physical/i }));
    });
    const updated = await finalizeAndReadSavedSpell(1);
    expect(updated.id).toBe(saved.id);
    expect(updated.purificationConfig.selectedEffects.map((e) => e.id)).toEqual(['magic']);
    expect(updated.authoredDraft.purificationConfig.selectedEffects.map((e) => e.id)).toEqual(['magic']);

    reopenedMount.unmount();
  });

  it('authors a Resurrection spell through the Wizard UI, saves, remains manual GM reference, and reopens with resolution and formula intact', async () => {
    seedEmptyLibrary();
    const firstMount = mountProductionWizard();

    const nameInput = await screen.findByPlaceholderText(/Enter a name for your spell/i);
    const descInput = await screen.findByPlaceholderText(/Describe what your spell does/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Breath of Dawn' } });
      fireEvent.change(descInput, { target: { value: 'Calls a fallen companion back from death.' } });
    });

    await clickWizardStep(/Effects/i);
    const purificationCard = await screen.findByText(/^Purification$/i, {
      selector: '.selection-card-title, h4, h3, span, div'
    });
    await act(async () => {
      fireEvent.click(purificationCard);
    });

    const purificationRoot = await waitFor(() => {
      const el = document.querySelector('.purification-effects-container');
      expect(el).toBeTruthy();
      return el;
    });

    // Switch Purification Type to Resurrection and select the Resurrection effect
    await act(async () => {
      fireEvent.click(within(purificationRoot.querySelector('.purification-type-selection')).getByText('Resurrection'));
    });
    await act(async () => {
      fireEvent.click(within(purificationRoot.querySelector('.effect-selection')).getByText('Resurrection'));
    });

    const selectedSection = purificationRoot.querySelector('.selected-effects');
    expect(selectedSection).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(within(selectedSection).getByRole('button', { name: /Cards/i }));
    });
    await act(async () => {
      fireEvent.click(within(selectedSection).getByText(/Royal Revival/i));
    });

    const saved = await finalizeAndReadSavedSpell(1);
    expect(saved.name).toBe('Breath of Dawn');
    expect(saved.purificationConfig.purificationType).toBe('resurrection');
    expect(saved.purificationConfig.resolution).toBe('CARDS');
    expect(saved.purificationConfig.resurrectionFormula).toBe('CARD_VALUE + (FACE_CARD ? SPI * 3 : SPI)');
    expect(saved.purificationConfig.selectedEffects).toHaveLength(1);
    expect(saved.purificationConfig.selectedEffects[0]).toMatchObject({
      id: 'resurrection',
      purificationType: 'resurrection',
      resolution: 'CARDS',
      resurrectionFormula: 'CARD_VALUE + (FACE_CARD ? SPI * 3 : SPI)'
    });

    // Resurrection remains manual GM reference in Prism
    const compiled = definitionFromWizard(saved, { roomId: 'room-1' });
    expect(compiled.ok).toBe(false);
    expect(explainExecution(saved, { shared: true }).state).toBe(STATES.UNSUPPORTED);

    // Reopen in a fresh Wizard and verify UI restoration
    firstMount.unmount();
    useSpellbookStore.setState({
      wizardEditRequest: { spell: JSON.parse(JSON.stringify(saved)), guard: { isCurrent: () => true } }
    });
    const reopenedMount = mountProductionWizard();

    await clickWizardStep(/Effects/i);
    const reopenedRoot = await waitFor(() => {
      const el = document.querySelector('.purification-effects-container');
      expect(el).toBeTruthy();
      return el;
    });

    const reopenedSelected = reopenedRoot.querySelector('.selected-effects');
    expect(reopenedSelected).toBeInTheDocument();
    expect(within(reopenedSelected).getByRole('button', { name: /Cards/i })).toHaveClass('active');
    expect(reopenedSelected.querySelector('.formula-input')).toHaveValue(
      'CARD_VALUE + (FACE_CARD ? SPI * 3 : SPI)'
    );

    reopenedMount.unmount();
  });

  it('reopens an unsupported legacy purification GM-reference spell and preserves it on no-op save', async () => {
    const legacySpell = {
      id: 'legacy-purify-1',
      name: 'Legacy Cleanse All',
      description: 'Legacy GM reference purification spell',
      level: 3,
      spellType: 'ACTION',
      effectTypes: ['purification'],
      effectsMap: { purification: true },
      typeConfig: { school: 'radiant', icon: 'Healing/Cure Within', tags: [] },
      purificationConfig: {
        purificationType: 'cleanse_all',
        targetEffects: ['poison', 'disease', 'curse', 'magic'],
        strength: 'major'
      },
      dateCreated: '2026-01-01T00:00:00.000Z',
      lastModified: '2026-01-01T00:00:00.000Z',
      categoryIds: ['uncategorized']
    };

    seedLibraryWithSpell(legacySpell);
    useSpellbookStore.setState({
      wizardEditRequest: { spell: JSON.parse(JSON.stringify(legacySpell)), guard: { isCurrent: () => true } }
    });
    const view = mountProductionWizard();

    await clickWizardStep(/Effects/i);
    await waitFor(() => {
      expect(document.querySelector('.purification-effects-container')).toBeTruthy();
    });

    const saved = await finalizeAndReadSavedSpell(1);
    expect(saved.id).toBe('legacy-purify-1');
    expect(saved.purificationConfig).toEqual(legacySpell.purificationConfig);
    expect(definitionFromWizard(saved, { roomId: 'room-1' }).ok).toBe(false);

    view.unmount();
  });
});
