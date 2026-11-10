/**
 * Wizard Load resolution — ordinary Wizard + Spell Library actions.
 *
 * Contract under test (product-confirmed 2026-11-09):
 *   - Wizard "Load" opens the selected saved record for editing. Save updates that record.
 *   - The wizard modal states the meaning and points at Duplicate Spell for copies.
 *   - Edit keeps library identity (id/dateCreated), definition identity and category metadata,
 *     and never lets editor-only fields or a stale secondary serialization contaminate the
 *     executable draft.
 *   - Explicit Duplicate Spell remains the only copy action: new library id/dateCreated,
 *     independent nested data, category preserved, authoredDefinitionId/cooldown retained.
 *   - Source stays unchanged after copy, edit cancellation and abandoned loading.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import SpellLibrary from '../components/library/SpellLibrary';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
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

const clone = (value) => JSON.parse(JSON.stringify(value));

const draftOf = (record) => {
  const {
    id, dateCreated, lastModified, categoryIds, categories, source, isCustom, isUserCreated,
    createdAt, updatedAt, userId, lastSaved, authoredDraft, serializedData, humanReadable,
    gameCode, catalogueSource, ...draft
  } = record;
  return clone(draft);
};

const withDraft = (record) => {
  const authoredDraft = draftOf(record);
  return {
    ...record,
    authoredDraft,
    serializedData: JSON.stringify(authoredDraft, null, 2)
  };
};

// 1. Immediate + periodic rider + authenticated caster-start cooldown.
const IMMEDIATE_PERIODIC_COOLDOWN = withDraft({
  id: 'load-fixture-solar-flare',
  name: 'Load Solar Flare',
  description: 'Immediate ember blast, lingering cinders, authenticated caster cooldown.',
  level: 3,
  spellType: 'ACTION',
  resolution: 'DICE',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: { school: 'ember', icon: 'spell_fire_fireball', castTimeType: 'IMMEDIATE', tags: ['ember', 'periodic'] },
  damageConfig: { damageType: 'direct', formula: '2d8 + spirit/3', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicFormula: '1d6',
      periodicDamageType: 'ember',
      tickRoll: 'each-tick',
      expiryPolicy: 'target-start-count',
      occurrences: 3,
      label: 'Cinders',
      durationText: 'While the cinders burn',
      gmNote: 'GM confirms line of sight.'
    }
  },
  cooldownConfig: { cooldownType: 'authenticated_caster_start', cooldownValue: 2 },
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {},
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 1, mana: 3, components: [] },
  durationConfig: { durationType: 'instant' },
  tags: ['damage'],
  source: 'wizard',
  isCustom: true,
  categoryIds: ['offensive'],
  categories: ['all'],
  dateCreated: '2026-11-01T00:00:00.000Z',
  lastModified: '2026-11-01T00:00:00.000Z',
  authoredDefinitionId: '44444444-4444-4444-8444-444444444444'
});

// 2. Formula direct part + movement rider + rider-local save + explicit expiry.
const FORMULA_RIDER_SAVE_EXPIRY = withDraft({
  id: 'load-fixture-frost-shackle',
  name: 'Load Frost Shackle',
  description: 'Chilling frost slows the target unless a saving throw succeeds.',
  level: 2,
  spellType: 'ACTION',
  resolution: 'DICE',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: { school: 'frost', icon: 'spell_frost_frostbolt', castTimeType: 'IMMEDIATE', tags: ['frost', 'movement'] },
  damageConfig: { damageType: 'direct', formula: '1d8+2', elementType: 'frost', damageTypes: ['frost'], resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'movement',
      movementFeet: -10,
      label: 'Chilled Stride',
      expiryPolicy: 'target-next-end',
      durationText: 'Until end of next turn',
      gmNote: 'GM adjudicates terrain.',
      save: { ability: 'constitution', dc: 14, outcome: 'negates' }
    }
  },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {},
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 0, mana: 3, components: [] },
  durationConfig: { durationType: 'instant' },
  tags: ['damage'],
  source: 'wizard',
  isCustom: true,
  categoryIds: ['offensive'],
  categories: ['all'],
  dateCreated: '2026-11-02T00:00:00.000Z',
  lastModified: '2026-11-02T00:00:00.000Z',
  authoredDefinitionId: '55555555-5555-4555-8555-555555555555'
});

const FIXTURES = [
  ['immediate + periodic + cooldown', IMMEDIATE_PERIODIC_COOLDOWN],
  ['formula + movement rider + save + expiry', FORMULA_RIDER_SAVE_EXPIRY]
];

const seed = (spells) => {
  mockPersisted = {
    version: 1,
    lastSaved: new Date().toISOString(),
    data: {
      categories: [{ id: 'uncategorized', name: 'Uncategorized', spellIds: [] }],
      spells: spells.map(clone),
      collections: [],
      selectedSpell: null
    }
  };
};

const mountWizard = () => render(
  <SpellLibraryProvider>
    <SpellWizardProvider>
      <SpellWizardWrapper hideHeader={true} />
    </SpellWizardProvider>
  </SpellLibraryProvider>
);

const openLoadModal = async () => {
  fireEvent.click(screen.getByTitle('Open a saved spell for editing'));
  expect(await screen.findByText('Open Saved Spell')).toBeInTheDocument();
  expect(screen.getByText(/To create an independent copy/i)).toBeInTheDocument();
};

const loadRowForEdit = async (name) => {
  const label = await screen.findByText(name);
  const row = label.closest('.spell-list-item');
  expect(row).toBeTruthy();
  await act(async () => {
    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }));
  });
};

beforeEach(() => {
  mockPersisted = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Wizard Load opens the saved record for editing', () => {
  test.each(FIXTURES)('%s: Update keeps library/definition identity and full metadata', async (_label, fixture) => {
    seed([fixture]);
    const sourceSnapshot = clone(fixture);
    expect(definitionFromWizard(clone(fixture)).ok).toBe(true);

    mountWizard();
    await openLoadModal();
    await loadRowForEdit(fixture.name);

    // Edit-mode UI, not a new/spell-copy draft.
    expect(await screen.findByText(new RegExp(`Editing Spell: ${fixture.name}`))).toBeInTheDocument();
    const updateBtn = screen.getByRole('button', { name: /^Update$/ });
    expect(updateBtn).toHaveAttribute('title', 'Finalize & Update Spell');

    const nameInput = screen.getByRole('textbox', { name: /Spell Name/i });
    const updatedName = `${fixture.name} (Updated)`;
    fireEvent.change(nameInput, { target: { value: updatedName } });

    await act(async () => {
      fireEvent.click(updateBtn);
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(1);
      expect(mockPersisted.data.spells[0].name).toBe(updatedName);
    });

    const saved = mockPersisted.data.spells[0];
    expect(saved.id).toBe(fixture.id);
    expect(saved.dateCreated).toBe(fixture.dateCreated);
    expect(saved.authoredDefinitionId).toBe(fixture.authoredDefinitionId);
    expect(saved.categoryIds).toEqual(fixture.categoryIds);
    expect(saved.categories).toEqual(fixture.categories);
    expect(saved.categoryIds).not.toBe(sourceSnapshot.categoryIds);

    // Executable content and its nested objects survive; the source snapshot is not mutated.
    expect(saved.damageConfig).toEqual(fixture.damageConfig);
    expect(saved.controlConfig).toEqual(fixture.controlConfig);
    expect(saved.cooldownConfig).toEqual(fixture.cooldownConfig);
    expect(saved.resourceCost).toEqual(fixture.resourceCost);
    expect(saved.damageConfig).not.toBe(fixture.damageConfig);
    expect(saved.controlConfig).not.toBe(fixture.controlConfig);
    expect(fixture).toEqual(sourceSnapshot);

    // Editor/library metadata never enters the executable draft; the secondary serialization
    // follows the same draft so admission cannot see a stale copy.
    expect(saved.authoredDraft.editMode).toBeUndefined();
    expect(saved.authoredDraft.editingSpellId).toBeUndefined();
    expect(saved.authoredDraft.categoryIds).toBeUndefined();
    expect(saved.authoredDraft.serializedData).toBeUndefined();
    expect(JSON.parse(saved.serializedData).name).toBe(updatedName);
    const savedVerdict = definitionFromWizard(saved);
    expect(savedVerdict.ok ? 'ok' : savedVerdict.reason).toBe('ok');
  });

  test('Cancel Edit discards the loaded draft and leaves the stored record byte-identical', async () => {
    seed([IMMEDIATE_PERIODIC_COOLDOWN]);

    mountWizard();
    const beforeSnapshot = JSON.stringify(mockPersisted.data.spells[0]);
    await openLoadModal();
    await loadRowForEdit(IMMEDIATE_PERIODIC_COOLDOWN.name);

    const description = await screen.findByRole('textbox', { name: /Description/i });
    fireEvent.change(description, { target: { value: 'MUTATED DRAFT THAT MUST BE DISCARDED' } });

    showConfirm.mockResolvedValueOnce(true);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Cancel Edit/i }));
    });

    expect(showConfirm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cancel Editing',
      confirmText: 'Discard Changes',
      isDestructive: true
    }));
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(JSON.stringify(mockPersisted.data.spells[0])).toBe(beforeSnapshot);
  });

  test('abandoned loading never writes to the source record', async () => {
    seed([IMMEDIATE_PERIODIC_COOLDOWN]);

    const view = mountWizard();
    const beforeSnapshot = JSON.stringify(mockPersisted.data.spells[0]);
    await openLoadModal();
    await loadRowForEdit(IMMEDIATE_PERIODIC_COOLDOWN.name);

    const nameInput = await screen.findByRole('textbox', { name: /Spell Name/i });
    fireEvent.change(nameInput, { target: { value: 'ABANDONED RENAME' } });
    view.unmount();

    await act(async () => { await Promise.resolve(); });
    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(JSON.stringify(mockPersisted.data.spells[0])).toBe(beforeSnapshot);
  });
});

describe('Explicit Duplicate Spell is still the only copy action', () => {
  test('duplicate creates an independent record; editing that copy leaves the source untouched', async () => {
    seed([IMMEDIATE_PERIODIC_COOLDOWN]);

    const libraryView = render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const sourceRow = (await screen.findByText(IMMEDIATE_PERIODIC_COOLDOWN.name)).closest('.wow-spell-row');
    expect(sourceRow).toBeTruthy();
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);
    fireEvent.contextMenu(sourceRow, { clientX: 12, clientY: 16 });
    const duplicateItem = await screen.findByText('Duplicate Spell');
    await act(async () => { fireEvent.click(duplicateItem); });

    await screen.findByText(`${IMMEDIATE_PERIODIC_COOLDOWN.name} (Copy)`);
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));

    const sourceAfterCopy = mockPersisted.data.spells.find((spell) => spell.id === sourceSnapshot.id);
    const copy = mockPersisted.data.spells.find((spell) => spell.name === `${sourceSnapshot.name} (Copy)`);
    expect(sourceAfterCopy).toEqual(sourceSnapshot);
    expect(copy.id).not.toBe(sourceSnapshot.id);
    expect(copy.dateCreated).not.toBe(sourceSnapshot.dateCreated);
    expect(copy.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
    expect(copy.cooldownConfig).toEqual(sourceSnapshot.cooldownConfig);
    expect(copy.categoryIds).toEqual(sourceSnapshot.categoryIds);
    expect(copy.categoryIds).not.toBe(sourceSnapshot.categoryIds);
    expect(copy.authoredDraft.name).toBe(copy.name);
    expect(JSON.parse(copy.serializedData).name).toBe(copy.name);

    libraryView.unmount();

    // The copied record is still opened through the same Load -> Edit action, and only the copy
    // is updated; the original source stays byte-identical.
    mountWizard();
    await openLoadModal();
    await loadRowForEdit(copy.name);

    expect(await screen.findByText(/Editing Spell:/)).toBeInTheDocument();
    const copyNameInput = screen.getByRole('textbox', { name: /Spell Name/i });
    expect(copyNameInput).toHaveValue(copy.name);
    fireEvent.change(copyNameInput, { target: { value: `${copy.name} (Edited)` } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Update$/ }));
    });

    await waitFor(() => {
      expect(mockPersisted.data.spells.find((spell) => spell.id === copy.id).name)
        .toBe(`${copy.name} (Edited)`);
    });
    expect(mockPersisted.data.spells).toHaveLength(2);
    expect(mockPersisted.data.spells.find((spell) => spell.id === sourceSnapshot.id)).toEqual(sourceSnapshot);
    const editedCopy = mockPersisted.data.spells.find((spell) => spell.id === copy.id);
    expect(editedCopy.dateCreated).toBe(copy.dateCreated);
    expect(editedCopy.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
    expect(editedCopy.categoryIds).toEqual(sourceSnapshot.categoryIds);
  });
});

describe('Non-library create path remains available to programmatic callers', () => {
  test('handleLoadSpell(record, false) still creates a separate record without touching the source', async () => {
    seed([FORMULA_RIDER_SAVE_EXPIRY]);

    mountWizard();
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => {
      window.handleLoadSpell(clone(FORMULA_RIDER_SAVE_EXPIRY), false);
    });

    expect(screen.getByRole('button', { name: /^Finalize$/ })).toHaveAttribute('title', 'Finalize & Save Spell');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Finalize$/ }));
    });

    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));
    const created = mockPersisted.data.spells.find((spell) => spell.id !== sourceSnapshot.id);
    expect(created.dateCreated).not.toBe(sourceSnapshot.dateCreated);
    expect(created.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
    expect(mockPersisted.data.spells.find((spell) => spell.id === sourceSnapshot.id)).toEqual(sourceSnapshot);
  });
});
