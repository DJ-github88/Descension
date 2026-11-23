import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import Step10Review from '../components/steps/Step10Review';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { installTooltipShim } from '../../../utils/tooltipShim';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
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

const clone = (v) => JSON.parse(JSON.stringify(v));

const SAVED_SPELL = {
  id: 'spell-a11y-1',
  name: 'Arcane Bolt',
  description: 'A bounded test spell.',
  spellType: 'ACTION',
  icon: 'inv_misc_orb_01',
  typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
  effectTypes: ['damage'],
  targetingMode: 'unified',
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
  resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 2 } },
  damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' },
  dateCreated: '2026-01-01T00:00:00.000Z',
  lastModified: '2026-01-01T00:00:00.000Z',
  categoryIds: ['uncategorized'],
  categories: ['all']
};

function mountWizard({ hideHeader = false } = {}) {
  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper hideHeader={hideHeader} />
        <Step10Review stepNumber={10} totalSteps={10} isActive={true} />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
}

describe('Wizard action-label reconciliation & tooltip shim', () => {
  let uninstall;

  beforeEach(() => {
    uninstall = installTooltipShim(window);
    mockPersisted = { version: 1, lastSaved: '2026-01-01T00:00:00.000Z', data: { categories: [], spells: [clone(SAVED_SPELL)] } };
    useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
    showConfirm.mockReset();
  });

  afterEach(() => {
    uninstall();
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  test('1-3 & 6: create mode Reset/Finalize/Save and edit mode Cancel Edit/Update have truthful accessible names across hover & mode switches', async () => {
    mountWizard();

    // 1. New spell -> Reset & Finalize have truthful names
    const resetBtn = screen.getByRole('button', { name: /^Reset$/i });
    expect(resetBtn).toHaveAttribute('title', 'Reset Wizard');
    const finalizeBtn = screen.getByRole('button', { name: /^Finalize$/i });
    expect(finalizeBtn).toHaveAttribute('title', 'Finalize & Save Spell');

    // Hover and unhover Reset & Finalize before switching to edit mode
    fireEvent.mouseOver(resetBtn);
    expect(resetBtn).not.toHaveAttribute('title');
    expect(resetBtn).toHaveAttribute('data-original-title', 'Reset Wizard');
    fireEvent.mouseOut(resetBtn);
    expect(resetBtn).toHaveAttribute('title', 'Reset Wizard');
    expect(resetBtn).not.toHaveAttribute('aria-label');

    fireEvent.mouseOver(finalizeBtn);
    fireEvent.mouseOut(finalizeBtn);

    // 2-3. Switch to edit mode -> Cancel Edit & Update have truthful names (no frozen Reset Wizard / Finalize)
    act(() => {
      window.dispatchEvent(new CustomEvent('loadSpellIntoWizard', {
        detail: { spell: clone(SAVED_SPELL), editMode: true }
      }));
    });

    const cancelBtn = await screen.findByRole('button', { name: /^Cancel Edit$/i });
    expect(cancelBtn).toHaveAttribute('title', 'Cancel Edit');
    expect(screen.queryByRole('button', { name: /Reset Wizard/i })).toBeNull();

    const updateBtn = screen.getByRole('button', { name: /^Update$/i });
    expect(updateBtn).toHaveAttribute('title', 'Finalize & Update Spell');

    // Switch back to create mode via Cancel Edit confirmation
    showConfirm.mockResolvedValueOnce(true);
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /^Reset$/i })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /^Finalize$/i })).toHaveAttribute('title', 'Finalize & Save Spell');
  });

  test('4. Cancel Edit leaves the stored source byte-identical', async () => {
    mountWizard();
    const beforeSpellJson = JSON.stringify(mockPersisted.data.spells[0]);

    act(() => {
      window.dispatchEvent(new CustomEvent('loadSpellIntoWizard', {
        detail: { spell: clone(SAVED_SPELL), editMode: true }
      }));
    });

    const cancelBtn = await screen.findByRole('button', { name: /^Cancel Edit$/i });
    showConfirm.mockResolvedValueOnce(true);
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /^Reset$/i })).toBeInTheDocument());
    expect(JSON.stringify(mockPersisted.data.spells[0])).toBe(beforeSpellJson);
  });

  test('5. Reset retains its existing confirmation and behavior', async () => {
    mountWizard();
    const resetBtn = screen.getByRole('button', { name: /^Reset$/i });
    showConfirm.mockResolvedValueOnce(false);

    await act(async () => {
      fireEvent.click(resetBtn);
    });

    expect(showConfirm).toHaveBeenCalledWith(expect.objectContaining({
      confirmText: 'Reset Wizard',
      title: 'Reset Spell Wizard'
    }));
  });

  test('7-9 & 11: explicit aria-label survives, icon-only button stays labelled while hovered, tooltip open/close & keyboard focus work, no unsafe HTML', () => {
    const { container } = render(
      <div>
        <button type="button" aria-label="Explicit Accessible Name" title="Hover Tooltip">
          Visible Text
        </button>
        <button type="button" title="Icon Only Action">
          <i className="fas fa-bolt" aria-hidden="true" />
        </button>
      </div>
    );

    const explicitBtn = screen.getByRole('button', { name: 'Explicit Accessible Name' });
    fireEvent.mouseOver(explicitBtn);
    expect(explicitBtn).toHaveAttribute('aria-label', 'Explicit Accessible Name');
    expect(explicitBtn).toHaveAttribute('data-original-title', 'Hover Tooltip');
    fireEvent.mouseOut(explicitBtn);
    expect(explicitBtn).toHaveAttribute('aria-label', 'Explicit Accessible Name');
    expect(explicitBtn).toHaveAttribute('title', 'Hover Tooltip');

    const iconBtn = screen.getByRole('button', { name: 'Icon Only Action' });
    fireEvent.mouseOver(iconBtn);
    // While title is suppressed, icon-only button retains its accessible name via temporary aria-label
    expect(iconBtn).not.toHaveAttribute('title');
    expect(screen.getByRole('button', { name: 'Icon Only Action' })).toBe(iconBtn);
    fireEvent.mouseOut(iconBtn);
    // On mouseout, title is restored and temporary aria-label is removed
    expect(iconBtn).toHaveAttribute('title', 'Icon Only Action');
    expect(iconBtn).not.toHaveAttribute('aria-label');

    // Keyboard focus remains functional
    iconBtn.focus();
    expect(document.activeElement).toBe(iconBtn);

    // No unsafe HTML introduced
    expect(container.innerHTML).not.toMatch(/<script|onerror=/i);
  });

  test('10. repeated install/uninstall cycles do not accumulate duplicate listeners', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    // Already installed in beforeEach -> calling again is a no-op
    const sameUninstall = installTooltipShim(window);
    expect(sameUninstall).toBe(uninstall);
    expect(addSpy).not.toHaveBeenCalled();

    // Uninstall then reinstall cleanly adds/removes exactly 2 listeners (mouseover, mouseout)
    uninstall();
    expect(removeSpy).toHaveBeenCalledTimes(2);
    const u2 = installTooltipShim(window);
    expect(addSpy).toHaveBeenCalledTimes(2);
    u2();
    expect(removeSpy).toHaveBeenCalledTimes(4);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
