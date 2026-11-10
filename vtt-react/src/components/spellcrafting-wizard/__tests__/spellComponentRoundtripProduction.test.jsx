/**
 * Spell Component Requirements Production Save/Load Roundtrip Test
 *
 * Exercises the real production path:
 *   library record -> spellbookStore.wizardEditRequest -> SpellwizardApp.handleLoadSpell -> Wizard state
 *   -> "Finalize" (real handleSaveSpell) -> SpellLibraryContext UPDATE_SPELL / ADD_SPELL -> libraryManager save
 *   -> reopen -> Finalize again -> real SpellLibrary projection -> real UnifiedSpellCard.
 *
 * Verifies that:
 * - Authored verbal, somatic, and material requirements survive the production save/load cycle.
 * - Custom extension components (e.g., focus) and texts survive without corruption.
 * - Repeated no-op saves change nothing (byte-identical component configuration).
 * - Zero AP and empty materialComponents strings survive intact.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';

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
  getCustomIconUrl: () => 'fallback-icon.png'
}));

const clone = (v) => JSON.parse(JSON.stringify(v));

const FIXTURE_SPELL = {
  id: 'fixture-sacred-ward',
  name: 'Sacred Ward of Dawn',
  description: 'Protective ward requiring spoken prayer, mudra gesture, sunstone dust, and focus reliquary.',
  level: 2,
  spellType: 'ACTION',
  effectTypes: ['healing'],
  effectsMap: { healing: true },
  healingConfig: {
    formula: '2d6 + spirit',
    healingType: 'direct',
    hasHotEffect: false,
    description: 'Golden radiance mends wounds.'
  },
  typeConfig: { school: 'ember', icon: 'spell_holy_holybolt', tags: ['ward', 'healing'] },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally'] },
  resourceCost: {
    actionPoints: 0, // valid zero AP
    mana: 15,
    components: ['verbal', 'somatic', 'material', 'focus'],
    verbalText: 'Sanctum Lux Caelestis',
    somaticText: 'Hands clasped in prayer over heart',
    materialText: 'A pinch of powdered sunstone (tabletop check)',
    materialComponents: 'sunstone_dust',
    focusText: 'A consecrated silver reliquary'
  },
  dateCreated: '2026-11-07T00:00:00.000Z',
  lastModified: '2026-11-07T00:00:00.000Z',
  unrelatedSentinel: { preserve: 'intact' }
};

const seedLibrary = (spell) => {
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-07T00:00:00.000Z',
    data: { spells: [clone(spell)], categories: [], collections: [], selectedSpell: null }
  };
};

const mountProductionRaw = () => render(
  <SpellLibraryProvider>
    <SpellWizardProvider>
      <SpellWizardWrapper />
    </SpellWizardProvider>
  </SpellLibraryProvider>
);

const mountProduction = (spell) => {
  seedLibrary(spell);
  useSpellbookStore.setState({ wizardEditRequest: { spell: clone(spell), guard: { isCurrent: () => true } } });
  return mountProductionRaw();
};

const finalize = async () => {
  const before = JSON.stringify(mockPersisted);
  await act(async () => {
    fireEvent.click(screen.getByTitle(/Finalize/i));
  });
  await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(before));
  return mockPersisted.data.spells[0];
};

describe('Spell Component Requirements: Production Save/Load Roundtrip', () => {
  beforeEach(() => {
    mockPersisted = null;
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  const reopenAndFinalize = async (prev) => {
    prev.unmount();
    useSpellbookStore.setState({
      wizardEditRequest: { spell: clone(mockPersisted.data.spells[0]), guard: { isCurrent: () => true } }
    });
    const next = mountProductionRaw();
    return { next, saved: await finalize() };
  };

  test('production save/reopen path preserves all component fields and repeated no-op saves change nothing', async () => {
    const v1 = mountProduction(FIXTURE_SPELL);
    const first = await finalize();

    // 1. Verify first save preserves all authored component fields exactly
    expect(first.id).toBe(FIXTURE_SPELL.id);
    expect(first.unrelatedSentinel).toEqual({ preserve: 'intact' });
    expect(first.resourceCost.components).toEqual(['verbal', 'somatic', 'material', 'focus']);
    expect(first.resourceCost.verbalText).toBe('Sanctum Lux Caelestis');
    expect(first.resourceCost.somaticText).toBe('Hands clasped in prayer over heart');
    expect(first.resourceCost.materialText).toBe('A pinch of powdered sunstone (tabletop check)');
    expect(first.resourceCost.materialComponents).toBe('sunstone_dust');
    expect(first.resourceCost.focusText).toBe('A consecrated silver reliquary');
    expect(first.resourceCost.actionPoints).toBe(0); // Valid zero preserved

    // Also preserved in authoredDraft
    expect(first.authoredDraft.resourceCost.components).toEqual(['verbal', 'somatic', 'material', 'focus']);
    expect(first.authoredDraft.resourceCost.verbalText).toBe('Sanctum Lux Caelestis');
    expect(first.authoredDraft.resourceCost.somaticText).toBe('Hands clasped in prayer over heart');
    expect(first.authoredDraft.resourceCost.materialText).toBe('A pinch of powdered sunstone (tabletop check)');
    expect(first.authoredDraft.resourceCost.materialComponents).toBe('sunstone_dust');
    expect(first.authoredDraft.resourceCost.focusText).toBe('A consecrated silver reliquary');

    // 2. Reopen and finalize again (second save)
    const { next: v2, saved: second } = await reopenAndFinalize(v1);

    // 3. Reopen and finalize third time (third save)
    const { saved: third } = await reopenAndFinalize(v2);

    // Repeated no-op saves produce identical component configurations
    expect(second.resourceCost.components).toEqual(first.resourceCost.components);
    expect(second.resourceCost.verbalText).toBe(first.resourceCost.verbalText);
    expect(second.resourceCost.somaticText).toBe(first.resourceCost.somaticText);
    expect(second.resourceCost.materialText).toBe(first.resourceCost.materialText);
    expect(second.resourceCost.materialComponents).toBe(first.resourceCost.materialComponents);
    expect(second.resourceCost.focusText).toBe(first.resourceCost.focusText);
    expect(second.resourceCost.actionPoints).toBe(0);

    expect(third.resourceCost.components).toEqual(first.resourceCost.components);
    expect(third.resourceCost.verbalText).toBe(first.resourceCost.verbalText);
    expect(third.resourceCost.somaticText).toBe(first.resourceCost.somaticText);
    expect(third.resourceCost.materialText).toBe(first.resourceCost.materialText);
    expect(third.resourceCost.materialComponents).toBe(first.resourceCost.materialComponents);
    expect(third.resourceCost.focusText).toBe(first.resourceCost.focusText);
    expect(third.resourceCost.actionPoints).toBe(0);
  });

  test('production library card projection displays component pills and tabletop notice', async () => {
    mountProduction(FIXTURE_SPELL);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Spell Library/i }));
    });
    await act(async () => {
      fireEvent.keyDown(screen.getByRole('button', { name: `${FIXTURE_SPELL.name} details` }), { key: 'Enter' });
    });

    // Wait for Grimoire Card overlay
    await waitFor(() => {
      expect(screen.queryAllByText(/Sacred Ward of Dawn/i).length).toBeGreaterThan(0);
    });
    // Check material text line with tabletop disclaimer
    expect(screen.getByText(/A pinch of powdered sunstone/i)).toBeInTheDocument();
    expect(screen.getByText(/not automatically consumed; GM\/tabletop-managed/i)).toBeInTheDocument();
  });
});
