/**
 * Composed Spell Definition Preservation Production Tests
 *
 * Production path under test:
 *   library record -> spellbookStore.wizardEditRequest -> SpellwizardApp.handleLoadSpell -> Wizard state
 *   -> "Finalize" (handleSaveSpell) -> SpellLibraryContext UPDATE_SPELL / ADD_SPELL -> libraryManager save
 *   -> reopen -> Edit name or description only -> Finalize again -> reopen again.
 *
 * Covers already-installed interaction classes:
 *   1. Immediate + periodic + authenticated cooldown
 *   2. Direct effect + rider-local save + explicit timed expiry
 *
 * Explicitly asserts:
 *   - Immediate and periodic formulas and damage types
 *   - Effect kind and rider amount
 *   - Target restrictions and count
 *   - Tick boundary/count and roll policy
 *   - Cooldown type/value
 *   - Save ability/DC/outcome and expiry
 *   - AP/mana, including explicit zero where valid
 *   - Component requirement selections and text
 *   - Preserving unknown/manual authored sections
 *   - Cancelling an edit leaves the library record unmodified
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import { normalizeSpell } from '../core/utils/spellNormalizer';
import { showConfirm } from '../../../utils/dialogService';

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

// Interaction Class 1: Immediate + periodic + authenticated cooldown
const FIXTURE_COMPOSED_COOLDOWN = {
  id: 'fixture-astral-conflagration',
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
    formula: '2d8 + intelligence/3',
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
  categoryIds: ['uncategorized'],
  unrelatedManualSection: { notes: 'tabletop GM reminder', customFlag: true }
};

// Interaction Class 2: Direct effect + rider-local save + explicit timed expiry
const FIXTURE_TIMED_SAVE_RIDER = {
  id: 'fixture-frost-shackle',
  name: 'Frost Shackle',
  description: 'Chilling frost slows target unless constitution save succeeds.',
  level: 2,
  spellType: 'ACTION',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: {
    school: 'frost',
    icon: 'spell_frost_frostbolt',
    tags: ['frost', 'movement']
  },
  damageConfig: {
    damageType: 'direct',
    formula: '1d8 + 2',
    elementType: 'frost',
    resolution: 'DICE'
  },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'movement',
      movementFeet: -10,
      label: 'Chilled Stride',
      expiryPolicy: 'target-next-end',
      durationText: 'Until end of next turn',
      gmNote: 'GM adjudicates terrain.',
      save: {
        ability: 'constitution',
        dc: 14,
        outcome: 'negates'
      }
    }
  },
  cooldownConfig: {
    cooldownType: 'turn_based',
    cooldownValue: 0
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['any'],
    maxTargets: 1
  },
  resourceCost: {
    actionPoints: 0, // Valid explicit zero AP
    mana: 3,
    components: ['verbal', 'somatic', 'material'],
    verbalText: 'Glacies Vinculum',
    somaticText: 'Pinch index and thumb in downward snap',
    materialText: 'A drop of melted glacier water',
    materialComponents: 'glacier_water'
  },
  dateCreated: '2026-11-08T00:00:00.000Z',
  lastModified: '2026-11-08T00:00:00.000Z',
  categoryIds: ['uncategorized'],
  unrelatedManualSection: { customRiderNotes: 'Manual tabletop adjudicated' }
};

const seedLibrary = (spell) => {
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-08T00:00:00.000Z',
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

/**
 * Extracts semantic executable fields for comparison (normalized meaning).
 */
function extractExecutableSemantics(spell) {
  const norm = normalizeSpell(spell);
  const condition = norm.controlConfig?.authoredCondition || {};
  return {
    // Immediate formulas and damage types
    immediateFormula: norm.damageConfig?.formula || norm.healingConfig?.formula || null,
    immediateType: norm.damageConfig?.elementType || norm.healingConfig?.healingType || norm.typeConfig?.school || null,
    immediateDamageTypes: norm.damageTypes || [],

    // Periodic formulas and damage types
    periodicKind: condition.periodicKind || null,
    periodicFormula: condition.periodicFormula || null,
    periodicDamageType: condition.periodicDamageType || null,

    // Effect kind and rider amount
    effectKind: condition.effect || null,
    movementFeet: condition.movementFeet !== undefined ? condition.movementFeet : null,
    attribute: condition.attribute || null,
    attributeAmount: condition.attributeAmount !== undefined ? condition.attributeAmount : null,
    drAmount: condition.drAmount !== undefined ? condition.drAmount : null,

    // Target restrictions and count
    targetingType: norm.targetingConfig?.targetingType,
    rangeType: norm.targetingConfig?.rangeType,
    rangeDistance: norm.targetingConfig?.rangeDistance,
    targetRestrictions: norm.targetingConfig?.targetRestrictions,
    maxTargets: norm.targetingConfig?.maxTargets,

    // Tick boundary/count and roll policy
    tickExpiryPolicy: condition.expiryPolicy || null,
    tickOccurrences: condition.occurrences !== undefined ? condition.occurrences : null,
    tickRoll: condition.tickRoll || null,

    // Cooldown type/value
    cooldownType: norm.cooldownConfig?.cooldownType,
    cooldownValue: norm.cooldownConfig?.cooldownValue,

    // Save ability/DC/outcome and expiry
    saveAbility: condition.save?.ability || null,
    saveDc: condition.save?.dc !== undefined ? condition.save.dc : null,
    saveOutcome: condition.save?.outcome || null,
    durationText: condition.durationText || null,

    // AP / mana, including explicit zero
    actionPoints: norm.resourceCost?.actionPoints,
    mana: norm.resourceCost?.mana,

    // Component requirement selections and text
    components: norm.resourceCost?.components,
    verbalText: norm.resourceCost?.verbalText || null,
    somaticText: norm.resourceCost?.somaticText || null,
    materialText: norm.resourceCost?.materialText || null,
    materialComponents: norm.resourceCost?.materialComponents || null
  };
}

describe('Composed Spell Definition Preservation: Production Roundtrip', () => {
  beforeEach(() => {
    mockPersisted = null;
    showConfirm.mockReset();
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  const reopen = (prevInstance, savedRecord) => {
    prevInstance.unmount();
    useSpellbookStore.setState({
      wizardEditRequest: { spell: clone(savedRecord), guard: { isCurrent: () => true } }
    });
    return mountProductionRaw();
  };

  test('Class 1: Immediate + periodic + authenticated cooldown survives save -> reopen -> edit name -> save -> reopen', async () => {
    // Stage 1: Initial author/save through production path
    const v1 = mountProduction(FIXTURE_COMPOSED_COOLDOWN);
    const firstSaved = await finalize();

    expect(firstSaved.id).toBe(FIXTURE_COMPOSED_COOLDOWN.id);
    expect(firstSaved.unrelatedManualSection).toEqual(FIXTURE_COMPOSED_COOLDOWN.unrelatedManualSection);

    const initialSemantics = extractExecutableSemantics(firstSaved);
    expect(initialSemantics.immediateFormula).toBe('2d8 + intelligence/3');
    expect(initialSemantics.immediateType).toBe('arcane');
    expect(initialSemantics.periodicKind).toBe('damage');
    expect(initialSemantics.periodicFormula).toBe('1d6');
    expect(initialSemantics.periodicDamageType).toBe('arcane');
    expect(initialSemantics.effectKind).toBe('periodic');
    expect(initialSemantics.tickExpiryPolicy).toBe('target-start-count');
    expect(initialSemantics.tickOccurrences).toBe(3);
    expect(initialSemantics.tickRoll).toBe('each-tick');
    expect(initialSemantics.cooldownType).toBe('authenticated_caster_start');
    expect(initialSemantics.cooldownValue).toBe(3);
    expect(initialSemantics.actionPoints).toBe(1);
    expect(initialSemantics.mana).toBe(2);
    expect(initialSemantics.components).toEqual(['verbal', 'somatic']);
    expect(initialSemantics.verbalText).toBe('Ignis Astralis');
    expect(initialSemantics.somaticText).toBe('Thrust palms forward');

    // Stage 2: Reopen
    const v2 = reopen(v1, firstSaved);

    // Stage 3: Change ONLY the name
    const nameInput = screen.getByLabelText(/Spell Name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Astral Conflagration (Renamed)' } });
    });

    // Stage 4: Save again
    const secondSaved = await finalize();
    expect(secondSaved.name).toBe('Astral Conflagration (Renamed)');
    expect(secondSaved.description).toBe(FIXTURE_COMPOSED_COOLDOWN.description);

    // Stage 5: Reopen again
    const v3 = reopen(v2, secondSaved);

    // Stage 6: Assert all executable fields remain semantically identical
    const finalSemantics = extractExecutableSemantics(secondSaved);
    expect(finalSemantics).toEqual(initialSemantics);
    expect(secondSaved.unrelatedManualSection).toEqual(FIXTURE_COMPOSED_COOLDOWN.unrelatedManualSection);
    v3.unmount();
  });

  test('Class 2: Direct effect + rider-local save + explicit timed expiry survives save -> reopen -> edit description -> save -> reopen', async () => {
    // Stage 1: Initial author/save through production path
    const v1 = mountProduction(FIXTURE_TIMED_SAVE_RIDER);
    const firstSaved = await finalize();

    expect(firstSaved.id).toBe(FIXTURE_TIMED_SAVE_RIDER.id);
    expect(firstSaved.unrelatedManualSection).toEqual(FIXTURE_TIMED_SAVE_RIDER.unrelatedManualSection);

    const initialSemantics = extractExecutableSemantics(firstSaved);
    expect(initialSemantics.immediateFormula).toBe('1d8 + 2');
    expect(initialSemantics.immediateType).toBe('frost');
    expect(initialSemantics.effectKind).toBe('movement');
    expect(initialSemantics.movementFeet).toBe(-10);
    expect(initialSemantics.saveAbility).toBe('constitution');
    expect(initialSemantics.saveDc).toBe(14);
    expect(initialSemantics.saveOutcome).toBe('negates');
    expect(initialSemantics.tickExpiryPolicy).toBe('target-next-end');
    expect(initialSemantics.durationText).toBe('Until end of next turn');
    expect(initialSemantics.actionPoints).toBe(0); // Valid explicit zero
    expect(initialSemantics.mana).toBe(3);
    expect(initialSemantics.components).toEqual(['verbal', 'somatic', 'material']);
    expect(initialSemantics.verbalText).toBe('Glacies Vinculum');
    expect(initialSemantics.somaticText).toBe('Pinch index and thumb in downward snap');
    expect(initialSemantics.materialText).toBe('A drop of melted glacier water');
    expect(initialSemantics.materialComponents).toBe('glacier_water');

    // Stage 2: Reopen
    const v2 = reopen(v1, firstSaved);

    // Stage 3: Change ONLY the description
    const descInput = screen.getByLabelText(/Description/i);
    await act(async () => {
      fireEvent.change(descInput, { target: { value: 'Updated description: bitter rime binds movement.' } });
    });

    // Stage 4: Save again
    const secondSaved = await finalize();
    expect(secondSaved.name).toBe(FIXTURE_TIMED_SAVE_RIDER.name);
    expect(secondSaved.description).toBe('Updated description: bitter rime binds movement.');

    // Stage 5: Reopen again
    const v3 = reopen(v2, secondSaved);

    // Stage 6: Assert all executable fields remain semantically identical
    const finalSemantics = extractExecutableSemantics(secondSaved);
    expect(finalSemantics).toEqual(initialSemantics);
    expect(secondSaved.unrelatedManualSection).toEqual(FIXTURE_TIMED_SAVE_RIDER.unrelatedManualSection);
    v3.unmount();
  });

  test('Cancelling an edit does not modify the saved library record', async () => {
    seedLibrary(FIXTURE_COMPOSED_COOLDOWN);
    const originalRecord = clone(FIXTURE_COMPOSED_COOLDOWN);

    // Mount for editing
    useSpellbookStore.setState({
      wizardEditRequest: { spell: clone(originalRecord), guard: { isCurrent: () => true } }
    });
    const v1 = mountProductionRaw();

    // Mutate the name input in the UI
    const nameInput = screen.getByLabelText(/Spell Name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'MUTATED NAME THAT SHOULD BE DISCARDED' } });
    });

    // Configure confirmation mock to confirm discard
    showConfirm.mockResolvedValueOnce(true);

    // Click "Cancel Edit"
    const cancelBtn = screen.getByTitle(/Cancel Edit/i);
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    // Verify dialog was triggered
    expect(showConfirm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cancel Editing',
      confirmText: 'Discard Changes'
    }));

    // Verify saved record in library storage was NOT modified
    expect(mockPersisted.data.spells[0].name).toBe(originalRecord.name);
    expect(mockPersisted.data.spells[0].description).toBe(originalRecord.description);
    expect(mockPersisted.data.spells[0]).toEqual(originalRecord);
    v1.unmount();
  });
});
