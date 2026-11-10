/**
 * Real-Wrapper Regression: Spellbook Embedded Update & Cancel Controls
 *
 * Demonstrates repair of the finding in handoff/active-effects-integration/HANDOFF.md:
 * "The production Spellbook window mounts the Wizard with hideHeader, so
 * Finalize & Update Spell and Cancel Edit are not mounted in the App window
 * (checks.embeddedControls = {finalizeHeader: 0, cancelEdit: 0}). The reachable
 * ExternalLivePreview Complete Spell always mints a new custom record id."
 *
 * Verifies:
 * 1. Exposing Update and Cancel Edit in embedded context (hideHeader={true}).
 * 2. Editing an existing spell updates that record (identity-preserving, no duplicate).
 * 3. A name-only update preserves identity and conserved composed semantics.
 * 4. Cancelling an edit prompts for discard confirmation and leaves stored record unchanged.
 * 5. Creating a new spell still creates one record.
 * 6. Standalone controls (hideHeader={false}) remain usable.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import ExternalLivePreview from '../ExternalLivePreview';
import Step10Review from '../components/steps/Step10Review';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import { normalizeSpell } from '../core/utils/spellNormalizer';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';

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

const FIXTURE_COMPOSED_SPELL = {
  id: 'fixture-embedded-astral-conflagration',
  name: 'Astral Conflagration',
  description: 'Immediate blast followed by burning embers and caster cooldown.',
  level: 2,
  spellType: 'ACTION',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: {
    school: 'arcane',
    icon: 'spell_fire_fireball',
    tags: ['fire', 'arcane', 'periodic']
  },
  damageConfig: {
    damageType: 'direct',
    formula: '2d8',
    elementType: 'arcane',
    resolution: 'DICE'
  },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicFormula: '1d6',
      periodicDamageType: 'arcane',
      tickRoll: 'each-tick',
      expiryPolicy: 'target-start-count',
      occurrences: 3,
      label: 'Smouldering Embers',
      durationText: 'While the embers smoulder',
      gmNote: 'GM confirms line of sight.'
    }
  },
  cooldownConfig: {
    cooldownType: 'authenticated_caster_start',
    cooldownValue: 3
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['any'],
    maxTargets: 1
  },
  resourceCost: {
    actionPoints: 1,
    mana: 2,
    components: ['verbal', 'somatic'],
    verbalText: 'Ignis Astralis',
    somaticText: 'Thrust palms forward'
  },
  dateCreated: '2026-11-08T00:00:00.000Z',
  lastModified: '2026-11-08T00:00:00.000Z',
  categoryIds: ['uncategorized']
};

const seedLibrary = (spell) => {
  mockPersisted = {
    version: 1,
    lastSaved: new Date().toISOString(),
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [spell.id] }],
      spells: [clone(spell)]
    }
  };
};

const mountEmbedded = (spell, { editMode = true } = {}) => {
  if (spell) {
    seedLibrary(spell);
    useSpellbookStore.setState({
      wizardEditRequest: {
        spell: clone(spell),
        guard: { isCurrent: () => true },
        editMode
      }
    });
  } else {
    mockPersisted = {
      version: 1,
      lastSaved: new Date().toISOString(),
      data: { categories: [], spells: [] }
    };
    useSpellbookStore.setState({ wizardEditRequest: null });
  }

  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper hideHeader={true} />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
};

const mountStandalone = (spell, { editMode = true } = {}) => {
  if (spell) {
    seedLibrary(spell);
    useSpellbookStore.setState({
      wizardEditRequest: {
        spell: clone(spell),
        guard: { isCurrent: () => true },
        editMode
      }
    });
  } else {
    mockPersisted = {
      version: 1,
      lastSaved: new Date().toISOString(),
      data: { categories: [], spells: [] }
    };
    useSpellbookStore.setState({ wizardEditRequest: null });
  }

  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper hideHeader={false} />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
};

const mountEmbeddedWithPreview = (spell, { editMode = true } = {}) => {
  if (spell) {
    seedLibrary(spell);
    useSpellbookStore.setState({
      activeTab: 'wizard',
      wizardEditRequest: {
        spell: clone(spell),
        guard: { isCurrent: () => true },
        editMode
      }
    });
  } else {
    mockPersisted = {
      version: 1,
      lastSaved: new Date().toISOString(),
      data: { categories: [], spells: [] }
    };
    useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
  }

  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper hideHeader={true} />
        <ExternalLivePreview />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
};

const mountReviewStep = (spell, { editMode = true } = {}) => {
  if (spell) {
    seedLibrary(spell);
    useSpellbookStore.setState({
      activeTab: 'wizard',
      wizardEditRequest: {
        spell: clone(spell),
        guard: { isCurrent: () => true },
        editMode
      }
    });
  } else {
    mockPersisted = {
      version: 1,
      lastSaved: new Date().toISOString(),
      data: { categories: [], spells: [] }
    };
    useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
  }

  return render(
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellWizardWrapper hideHeader={true} />
        <Step10Review stepNumber={10} totalSteps={10} isActive={true} />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  );
};

const FIXTURE_SUPPORTED_SPELL = {
  id: 'fixture-supported-arcane-dart',
  name: 'Pilot Arcane Dart',
  description: 'Single-target direct arcane damage.',
  level: 1,
  spellType: 'ACTION',
  resolution: 'DICE',
  effectTypes: ['damage'],
  effectsMap: { damage: true },
  typeConfig: {
    school: 'arcane',
    castTimeType: 'IMMEDIATE',
    icon: 'spell_holy_holybolt',
    tags: []
  },
  damageConfig: {
    damageType: 'direct',
    formula: '2d8',
    elementType: 'arcane',
    damageTypes: ['arcane'],
    resolution: 'DICE'
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['any'],
    maxTargets: 1
  },
  resourceCost: {
    actionPoints: 1,
    mana: 2,
    components: []
  },
  cooldownConfig: {
    cooldownType: 'none',
    cooldownValue: 0
  },
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {},
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  },
  dateCreated: '2026-01-01T00:00:00.000Z',
  lastModified: '2026-01-01T00:00:00.000Z',
  categoryIds: ['uncategorized'],
  categories: ['all']
};

describe('Spellbook Embedded Update & Cancel Controls (Regression)', () => {
  beforeEach(() => {
    mockPersisted = null;
    showConfirm.mockReset();
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  test('embedded Wizard exposes Update and Cancel Edit controls during spell editing', async () => {
    mountEmbedded(FIXTURE_COMPOSED_SPELL, { editMode: true });

    // Under original behavior (hideHeader={true}), these were count 0 / unmounted.
    // In repaired behavior, both controls are mounted and reachable.
    const updateBtn = await screen.findByRole('button', { name: /Update/i });
    expect(updateBtn).toBeInTheDocument();
    expect(updateBtn).toHaveClass('finalize-btn');
    expect(updateBtn).toHaveAttribute('title', 'Finalize & Update Spell');

    const cancelBtn = screen.getByRole('button', { name: /Cancel Edit/i });
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).toHaveAttribute('title', 'Cancel Edit');

    // Edit indicator badge is rendered
    expect(screen.getByText(/Editing Spell:/i)).toBeInTheDocument();
  });

  test('name-only update in embedded context updates existing record (identity preserved, count = 1)', async () => {
    mountEmbedded(FIXTURE_COMPOSED_SPELL, { editMode: true });

    // Verify initial state
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // Change name in Step 1 Basic Info
    const nameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Astral Conflagration (Renamed)' } });

    // Click Update
    const updateBtn = screen.getByRole('button', { name: /Update/i });
    await act(async () => {
      fireEvent.click(updateBtn);
    });

    // Wait for library update
    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Astral Conflagration (Renamed)');
    });

    // CRITICAL: ID is preserved and record count is strictly 1 (no duplicate custom-* record)
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // Conserved composed semantics verified
    const updated = normalizeSpell(mockPersisted.data.spells[0]);
    expect(updated.damageConfig.formula).toBe('2d8');
    expect(updated.controlConfig.authoredCondition.periodicFormula).toBe('1d6');
    expect(updated.controlConfig.authoredCondition.occurrences).toBe(3);
    expect(updated.cooldownConfig.cooldownType).toBe('authenticated_caster_start');
    expect(updated.cooldownConfig.cooldownValue).toBe(3);
    expect(updated.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(updated.resourceCost.verbalText).toBe('Ignis Astralis');
  });

  test('cancelling an edit prompts for discard confirmation and leaves saved record untouched', async () => {
    mountEmbedded(FIXTURE_COMPOSED_SPELL, { editMode: true });

    const beforeSnapshot = JSON.stringify(mockPersisted.data.spells[0]);

    // Mutate description
    const descInput = await screen.findByRole('textbox', { name: /Description/i });
    fireEvent.change(descInput, { target: { value: 'MUTATED DESCRIPTION THAT MUST BE DISCARDED' } });

    // Mock confirmation: user clicks 'Discard Changes'
    showConfirm.mockResolvedValueOnce(true);

    const cancelBtn = screen.getByRole('button', { name: /Cancel Edit/i });
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    // Verify discard confirmation dialog was triggered with destructive intent
    expect(showConfirm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cancel Editing',
      message: expect.stringMatching(/unsaved changes/i),
      confirmText: 'Discard Changes',
      isDestructive: true
    }));

    // Verify persisted record was NOT modified
    expect(JSON.stringify(mockPersisted.data.spells[0])).toBe(beforeSnapshot);
  });

  test('creating a new spell in embedded context saves exactly one record with generated ID', async () => {
    mountEmbedded(null);

    // Initial library is empty
    expect(mockPersisted.data.spells).toHaveLength(0);

    // In author mode, button shows Finalize (not Update)
    const finalizeBtn = await screen.findByRole('button', { name: /Finalize/i });
    expect(finalizeBtn).toHaveAttribute('title', 'Finalize & Save Spell');

    // Fill spell name
    const nameInput = screen.getByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'New Test Spell' } });

    // Save
    await act(async () => {
      fireEvent.click(finalizeBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(1);
    });

    expect(mockPersisted.data.spells[0].name).toBe('New Test Spell');
    expect(mockPersisted.data.spells[0].id).toMatch(/new-test-spell/);
  });

  test('standalone mode (hideHeader={false}) maintains working controls and title/tabs', async () => {
    mountStandalone(FIXTURE_COMPOSED_SPELL, { editMode: true });

    // Standalone app-title and app-tabs are rendered
    expect(screen.getByRole('heading', { name: /Spell Crafting Wizard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spell Library/i })).toBeInTheDocument();

    // Controls remain usable
    const updateBtn = screen.getByRole('button', { name: /Update/i });
    expect(updateBtn).toBeInTheDocument();
    const cancelBtn = screen.getByRole('button', { name: /Cancel Edit/i });
    expect(cancelBtn).toBeInTheDocument();
  });

  test('ExternalLivePreview Complete Spell updates existing record during editing (identity preserved, count = 1)', async () => {
    mountEmbeddedWithPreview(FIXTURE_COMPOSED_SPELL, { editMode: true });

    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // In edit mode, preview button shows '✓ Update Spell'
    const previewBtn = await screen.findByRole('button', { name: /Update Spell/i });
    expect(previewBtn).toBeInTheDocument();
    expect(previewBtn).toHaveAttribute('title', 'Finalize & Update Spell');

    // Mutate spell name
    const nameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Astral Conflagration (Preview Updated)' } });

    // Click preview Update button
    await act(async () => {
      fireEvent.click(previewBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Astral Conflagration (Preview Updated)');
    });

    // Identity preserved, count strictly 1, no duplicate custom-* record
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // Composed semantics preserved
    const updated = normalizeSpell(mockPersisted.data.spells[0]);
    expect(updated.damageConfig.formula).toBe('2d8');
    expect(updated.controlConfig.authoredCondition.periodicFormula).toBe('1d6');
    expect(updated.controlConfig.authoredCondition.occurrences).toBe(3);
    expect(updated.cooldownConfig.cooldownType).toBe('authenticated_caster_start');
    expect(updated.cooldownConfig.cooldownValue).toBe(3);
    expect(updated.resourceCost.components).toEqual(['verbal', 'somatic']);
  });

  test('ExternalLivePreview Complete Spell creates exactly one new record when authoring from scratch', async () => {
    mountEmbeddedWithPreview(null);

    expect(mockPersisted.data.spells).toHaveLength(0);

    // In author mode, preview button shows '✓ Complete Spell'
    const previewBtn = await screen.findByRole('button', { name: /Complete Spell/i });
    expect(previewBtn).toBeInTheDocument();

    // Fill spell name
    const nameInput = screen.getByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Brand New Preview Spell' } });

    // Click Complete Spell
    await act(async () => {
      fireEvent.click(previewBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(1);
    });

    expect(mockPersisted.data.spells[0].name).toBe('Brand New Preview Spell');
    expect(mockPersisted.data.spells[0].id).toMatch(/custom-/);
  });

  test('Review-step completion (Step10Review) updates existing record during editing (identity preserved, count = 1)', async () => {
    mountReviewStep(FIXTURE_COMPOSED_SPELL, { editMode: true });

    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // In edit mode, save button displays 'Update Spell'
    const reviewSaveBtn = await screen.findByRole('button', { name: /Update Spell/i });
    expect(reviewSaveBtn).toBeInTheDocument();
    expect(reviewSaveBtn).toHaveAttribute('title', 'Finalize & Update Spell');

    // Mutate spell name
    const nameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Astral Conflagration (Review Updated)' } });

    // Click Review Update button
    await act(async () => {
      fireEvent.click(reviewSaveBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Astral Conflagration (Review Updated)');
    });

    // Identity preserved, count strictly 1
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_COMPOSED_SPELL.id);

    // Composed semantics preserved
    const updated = normalizeSpell(mockPersisted.data.spells[0]);
    expect(updated.damageConfig.formula).toBe('2d8');
    expect(updated.controlConfig.authoredCondition.periodicFormula).toBe('1d6');
    expect(updated.controlConfig.authoredCondition.occurrences).toBe(3);
    expect(updated.cooldownConfig.cooldownType).toBe('authenticated_caster_start');
    expect(updated.cooldownConfig.cooldownValue).toBe(3);
    expect(updated.resourceCost.components).toEqual(['verbal', 'somatic']);
  });

  test('Review-step completion (Step10Review) creates exactly one new record when authoring from scratch', async () => {
    mountReviewStep(null);

    expect(mockPersisted.data.spells).toHaveLength(0);

    // In author mode, button shows 'Save to Library'
    const reviewSaveBtn = await screen.findByRole('button', { name: /Save to Library/i });
    expect(reviewSaveBtn).toBeInTheDocument();

    // Fill spell name
    const nameInput = screen.getByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Brand New Review Spell' } });

    // Click Save to Library
    await act(async () => {
      fireEvent.click(reviewSaveBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(1);
    });

    expect(mockPersisted.data.spells[0].name).toBe('Brand New Review Spell');
    expect(mockPersisted.data.spells[0].id).toMatch(/brand-new-review-spell/);
  });

  test('supported updated spell via header passes definitionFromWizard without edit-mode metadata contamination', async () => {
    mountEmbedded(FIXTURE_SUPPORTED_SPELL, { editMode: true });
    const nameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'Pilot Arcane Dart (Header Updated)' } });
    const updateBtn = screen.getByRole('button', { name: /Update/i });
    await act(async () => {
      fireEvent.click(updateBtn);
    });
    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Pilot Arcane Dart (Header Updated)');
    });
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_SUPPORTED_SPELL.id);
    expect(mockPersisted.data.spells[0].editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].editingSpellId).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editingSpellId).toBeUndefined();
    const compileResult = definitionFromWizard(mockPersisted.data.spells[0]);
    if (!compileResult.ok) console.log('DEBUG REVIEW STEP COMPILE FAILURE:', compileResult);
    expect(compileResult.ok).toBe(true);
    expect(compileResult.definition.name).toBe('Pilot Arcane Dart (Header Updated)');
  });

  test('supported updated spell via Review-step passes definitionFromWizard without edit-mode metadata contamination', async () => {
    mountReviewStep(FIXTURE_SUPPORTED_SPELL, { editMode: true });
    const reviewNameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(reviewNameInput, { target: { value: 'Pilot Arcane Dart (Review Updated)' } });
    const reviewUpdateBtn = screen.getByRole('button', { name: /Update Spell/i });
    await act(async () => {
      fireEvent.click(reviewUpdateBtn);
    });
    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Pilot Arcane Dart (Review Updated)');
    });
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_SUPPORTED_SPELL.id);
    expect(mockPersisted.data.spells[0].editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].editingSpellId).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editingSpellId).toBeUndefined();
    const compileResult = definitionFromWizard(mockPersisted.data.spells[0]);
    if (!compileResult.ok) console.log('DEBUG REVIEW STEP COMPILE FAILURE:', compileResult);
    expect(compileResult.ok).toBe(true);
    expect(compileResult.definition.name).toBe('Pilot Arcane Dart (Review Updated)');
  });

  test('supported updated spell via ExternalLivePreview passes definitionFromWizard without edit-mode metadata contamination', async () => {
    mountEmbeddedWithPreview(FIXTURE_SUPPORTED_SPELL, { editMode: true });
    const previewNameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(previewNameInput, { target: { value: 'Pilot Arcane Dart (Preview Updated)' } });
    const previewUpdateBtn = screen.getByRole('button', { name: /Update Spell/i });
    await act(async () => {
      fireEvent.click(previewUpdateBtn);
    });
    await waitFor(() => {
      expect(mockPersisted.data.spells[0].name).toBe('Pilot Arcane Dart (Preview Updated)');
    });
    expect(mockPersisted.data.spells[0].id).toBe(FIXTURE_SUPPORTED_SPELL.id);
    expect(mockPersisted.data.spells[0].editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].editingSpellId).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editMode).toBeUndefined();
    expect(mockPersisted.data.spells[0].authoredDraft?.editingSpellId).toBeUndefined();
    const compileResult = definitionFromWizard(mockPersisted.data.spells[0]);
    if (!compileResult.ok) console.log('DEBUG REVIEW STEP COMPILE FAILURE:', compileResult);
    expect(compileResult.ok).toBe(true);
    expect(compileResult.definition.name).toBe('Pilot Arcane Dart (Preview Updated)');
  });
});
