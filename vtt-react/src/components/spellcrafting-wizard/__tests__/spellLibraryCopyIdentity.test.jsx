/**
 * Ordinary Spell Library copy identity (real provider + real reducer + real library UI).
 *
 * Contract under test:
 *   - Duplicate creates a new library record (new id/dateCreated, "(Copy)" name).
 *   - The source record is never mutated and the copy owns independent nested data.
 *   - Category metadata follows the source.
 *   - authoredDefinitionId is preserved: the approved cooldown identity is exact actor +
 *     authoredDefinitionId, so copies/versions retaining that ID share admission/cooldown
 *     instead of silently becoming a fresh ability (which would reset an existing cooldown).
 *   - Editing the copy through UPDATE_SPELL keeps copy identity and leaves the source alone;
 *     an edited definition therefore needs its own explicit admission/version.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellLibrary from '../components/library/SpellLibrary';
import SpellContextMenu from '../components/library/SpellContextMenu';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../context/SpellLibraryContext';
import { canonical } from '../../../services/featherSlash';
import authoredCooldown from '../../../services/authoredCooldown';
import { definitionFromWizard } from '../../../services/authoredAbility';

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
jest.mock('../../../hooks/useClassSpellLibrary', () => ({
  useClassSpellLibrary: () => ({
    spellCategories: [],
    classSpells: [],
    classSpellsLoading: false,
    classSpellsError: null,
    getAllSpells: () => [],
    getSpellsByCategory: () => [],
    getCategoryInfo: () => null,
    removeCustomSpell: jest.fn(),
    hasActiveCharacter: false,
    hasClassSpells: false
  })
}));
jest.mock('../../../hooks/useWeaponEnhancedSpells', () => ({
  useWeaponEnhancedSpells: () => ({ enhancedSpells: [], rawSpells: [] })
}));
jest.mock('../../../store/characterStore', () => {
  const state = {
    characters: [],
    currentCharacterId: null,
    activeCharacterId: null,
    currentCharacter: null
  };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  return { __esModule: true, default: useCharacterStore };
});
jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: { uid: 'copy-test-user' } })
}));

const clone = (value) => JSON.parse(JSON.stringify(value));

const draftOf = (spell) => {
  const {
    id, dateCreated, lastModified, categoryIds, categories, source, isCustom, isUserCreated,
    createdAt, updatedAt, userId, lastSaved, authoredDraft, serializedData, humanReadable,
    gameCode, catalogueSource, ...draft
  } = spell;
  return clone(draft);
};

const withDraft = (spell) => {
  const authoredDraft = draftOf(spell);
  return {
    ...spell,
    authoredDraft,
    serializedData: JSON.stringify(authoredDraft, null, 2)
  };
};

// Immediate + periodic + authenticated caster-start cooldown.
const SOURCE_IMMEDIATE_PERIODIC_COOLDOWN = withDraft({
  id: 'fixture-copy-solar-flare',
  name: 'Solar Flare',
  description: 'Immediate ember blast, lingering cinders, and an authenticated caster cooldown.',
  level: 3,
  spellType: 'ACTION',
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
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 1, mana: 3, components: ['verbal', 'somatic'], verbalText: 'Ignis Solaris', somaticText: 'Open palm skyward' },
  durationConfig: { durationType: 'instant' },
  source: 'wizard',
  isCustom: true,
  categoryIds: ['offensive'],
  dateCreated: '2026-11-01T00:00:00.000Z',
  lastModified: '2026-11-01T00:00:00.000Z',
  authoredDefinitionId: '11111111-1111-4111-8111-111111111111'
});

// Formula + rider-local save + explicit expiry.
const SOURCE_FORMULA_RIDER_SAVE_EXPIRY = withDraft({
  id: 'fixture-copy-frost-shackle',
  name: 'Frost Shackle',
  description: 'Chilling frost slows the target unless a saving throw succeeds.',
  level: 2,
  spellType: 'ACTION',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: { school: 'frost', icon: 'spell_frost_frostbolt', castTimeType: 'IMMEDIATE', tags: ['frost', 'movement'] },
  damageConfig: { damageType: 'direct', formula: '1d8 + 2', elementType: 'frost', damageTypes: ['frost'], resolution: 'DICE' },
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
  cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 0, mana: 3, components: ['verbal', 'somatic', 'material'], verbalText: 'Glacies Vinculum', somaticText: 'Pinch and snap downward', materialText: 'A drop of glacier water', materialComponents: 'glacier_water' },
  source: 'wizard',
  isCustom: true,
  categoryIds: ['defensive'],
  dateCreated: '2026-11-02T00:00:00.000Z',
  lastModified: '2026-11-02T00:00:00.000Z',
  authoredDefinitionId: '22222222-2222-4222-8222-222222222222',
  unrelatedManualSection: { customRiderNotes: 'Manual tabletop adjudication retained.' }
});

const ADMITTABLE_IMMEDIATE_PERIODIC_COOLDOWN = withDraft({
  ...SOURCE_IMMEDIATE_PERIODIC_COOLDOWN,
  resourceCost: { actionPoints: 1, mana: 3, components: [] }
});

const seed = (spells) => {
  mockPersisted = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: { spells: spells.map(clone), categories: [], collections: [], selectedSpell: null }
  };
};

let api;
function Probe() {
  api = { state: useSpellLibrary(), dispatch: useSpellLibraryDispatch() };
  return null;
}

const mountProvider = () => render(
  <SpellLibraryProvider>
    <Probe />
  </SpellLibraryProvider>
);

const sourceById = (id) => api.state.spells.find((spell) => spell.id === id);

beforeEach(() => {
  mockPersisted = null;
});

afterEach(() => {
  cleanup();
});

describe('Spell Library copy identity (real reducer)', () => {
  test.each([
    ['immediate + periodic + cooldown', SOURCE_IMMEDIATE_PERIODIC_COOLDOWN],
    ['formula + rider + save + expiry', SOURCE_FORMULA_RIDER_SAVE_EXPIRY]
  ])('%s: duplicate creates a new independent library record and preserves definition/authority identity', async (_label, fixture) => {
    seed([fixture]);
    mountProvider();

    const source = sourceById(fixture.id);
    expect(source).toBeTruthy();
    const sourceSnapshot = clone(source);

    act(() => {
      api.dispatch(libraryActionCreators.duplicateSpell(source.id));
    });

    const copy = api.state.spells.find((spell) => spell.name === `${source.name} (Copy)`);
    expect(copy).toBeTruthy();
    expect(api.state.spells).toHaveLength(2);

    // New library identity, source untouched.
    expect(copy.id).not.toBe(source.id);
    expect(copy.dateCreated).not.toBe(source.dateCreated);
    expect(copy.lastModified).toBeTruthy();
    expect(api.state.spells.find((spell) => spell.id === source.id)).toEqual(sourceSnapshot);
    expect(api.state.selectedSpell).toBe(copy.id);

    // Category metadata and complete definition content preserved; the copy is named in both
    // the record and its draft so the usual record/draft admission invariant stays satisfied.
    expect(copy.categoryIds).toEqual(source.categoryIds);
    expect(copy.categoryIds).not.toBe(source.categoryIds);
    expect(copy.name).toBe(`${source.name} (Copy)`);
    expect(copy.authoredDraft.name).toBe(copy.name);
    expect(JSON.parse(copy.serializedData).name).toBe(copy.name);
    expect({ ...copy.damageConfig }).toEqual(source.damageConfig);
    expect(copy.controlConfig).toEqual(source.controlConfig);
    expect(copy.cooldownConfig).toEqual(source.cooldownConfig);
    expect({ ...copy.authoredDraft, name: source.authoredDraft.name }).toEqual(source.authoredDraft);
    if (source.unrelatedManualSection) expect(copy.unrelatedManualSection).toEqual(source.unrelatedManualSection);

    // The copy owns its nested data; mutating one record cannot mutate the other.
    expect(copy.damageConfig).not.toBe(source.damageConfig);
    expect(copy.controlConfig).not.toBe(source.controlConfig);
    expect(copy.cooldownConfig).not.toBe(source.cooldownConfig);
    expect(copy.authoredDraft).not.toBe(source.authoredDraft);
    if (source.unrelatedManualSection) expect(copy.unrelatedManualSection).not.toBe(source.unrelatedManualSection);

    // Exact actor + authoredDefinitionId is the approved cooldown identity.
    // A copy retaining that ID shares the existing cooldown; it is not reset.
    expect(copy.authoredDefinitionId).toBe(source.authoredDefinitionId);
    const exactActorRef = { kind: 'character', characterId: 'copy-test-character', instanceId: 'copy-test-instance' };
    expect(authoredCooldown.key(exactActorRef, copy.authoredDefinitionId))
      .toBe(authoredCooldown.key(exactActorRef, source.authoredDefinitionId));

    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(2);
      expect(mockPersisted.data.spells.find((spell) => spell.id === source.id)).toEqual(sourceSnapshot);
    });
  });

  test('editing the copy keeps its identity and never mutates the source; edited definition is a new explicit version candidate', () => {
    seed([SOURCE_IMMEDIATE_PERIODIC_COOLDOWN]);
    mountProvider();

    const source = sourceById(SOURCE_IMMEDIATE_PERIODIC_COOLDOWN.id);
    const sourceSnapshot = clone(source);
    const sourceDraftCanonical = canonical(source.authoredDraft);

    act(() => {
      api.dispatch(libraryActionCreators.duplicateSpell(source.id));
    });

    const copy = api.state.spells.find((spell) => spell.name === `${source.name} (Copy)`);
    const copyId = copy.id;
    const copyDateCreated = copy.dateCreated;
    const copyDefinitionId = copy.authoredDefinitionId;

    const editedDraft = clone(copy.authoredDraft);
    editedDraft.name = 'Solar Flare (Edited Copy)';
    editedDraft.damageConfig = { ...editedDraft.damageConfig, formula: '3d8' };

    act(() => {
      api.dispatch(libraryActionCreators.updateSpell(copy.id, {
        name: editedDraft.name,
        damageConfig: editedDraft.damageConfig,
        authoredDraft: editedDraft,
        serializedData: JSON.stringify(editedDraft, null, 2)
      }));
    });

    const editedCopy = sourceById(copyId);
    expect(editedCopy.id).toBe(copyId);
    expect(editedCopy.dateCreated).toBe(copyDateCreated);
    expect(editedCopy.name).toBe('Solar Flare (Edited Copy)');
    expect(editedCopy.damageConfig.formula).toBe('3d8');

    // The source is untouched by the copy edit.
    expect(sourceById(source.id)).toEqual(sourceSnapshot);

    // Same definition identity is retained (cooldown is not reset) but the executable
    // content changed, so the admitted version/hash no longer silently applies.
    expect(editedCopy.authoredDefinitionId).toBe(copyDefinitionId);
    expect(canonical(editedCopy.authoredDraft)).not.toBe(sourceDraftCanonical);
  });

  test('the renamed copy remains admittable as a new explicit version under the same definition identity', () => {
    seed([ADMITTABLE_IMMEDIATE_PERIODIC_COOLDOWN]);
    mountProvider();

    const source = sourceById(ADMITTABLE_IMMEDIATE_PERIODIC_COOLDOWN.id);
    const sourceDefinition = definitionFromWizard(source);
    expect(sourceDefinition.ok).toBe(true);

    act(() => { api.dispatch(libraryActionCreators.duplicateSpell(source.id)); });
    const copy = api.state.spells.find((spell) => spell.name === `${source.name} (Copy)`);
    const copyDefinition = definitionFromWizard(copy);

    // The copy is not silently mistaken for the already-admitted source version...
    expect(copyDefinition.ok).toBe(true);
    expect(copyDefinition.definition.definitionId).toBe(sourceDefinition.definition.definitionId);
    expect(canonical(copyDefinition.definition)).not.toBe(canonical(sourceDefinition.definition));

    // ...but it keeps the same definition identity and cooldown config, so it is a version of
    // the same ability rather than a fresh ability with a reset cooldown.
    expect(copy.authoredDefinitionId).toBe(source.authoredDefinitionId);
    expect(copy.cooldownConfig).toEqual(source.cooldownConfig);
  });

  test('duplicating a copy again creates another library identity without inventing a new definition/cooldown identity', () => {
    seed([SOURCE_FORMULA_RIDER_SAVE_EXPIRY]);
    mountProvider();

    const source = sourceById(SOURCE_FORMULA_RIDER_SAVE_EXPIRY.id);
    act(() => { api.dispatch(libraryActionCreators.duplicateSpell(source.id)); });
    const firstCopy = api.state.spells.find((spell) => spell.name === `${source.name} (Copy)`);

    act(() => { api.dispatch(libraryActionCreators.duplicateSpell(firstCopy.id)); });
    const secondCopy = api.state.spells.find((spell) => spell.name === `${source.name} (Copy) (Copy)`);

    expect(secondCopy).toBeTruthy();
    expect(secondCopy.id).not.toBe(firstCopy.id);
    expect(secondCopy.authoredDefinitionId).toBe(source.authoredDefinitionId);
    expect(secondCopy.cooldownConfig).toEqual(source.cooldownConfig);
    expect(sourceById(firstCopy.id).authoredDefinitionId).toBe(source.authoredDefinitionId);
  });

  test('catalogue-bound records keep their exact source binding and definition identity (no invented rebinding)', () => {
    const catalogueSource = {
      spellId: 'catalogue-frost-shackle',
      classId: 'arcanoneer',
      recordHash: 'a'.repeat(64),
      record: { id: 'catalogue-frost-shackle', name: 'Frost Shackle' }
    };
    seed([{ ...SOURCE_FORMULA_RIDER_SAVE_EXPIRY, catalogueSource }]);
    mountProvider();

    const source = sourceById(SOURCE_FORMULA_RIDER_SAVE_EXPIRY.id);
    act(() => { api.dispatch(libraryActionCreators.duplicateSpell(source.id)); });
    const copy = api.state.spells.find((spell) => spell.id !== source.id);

    // The pinned catalogue projection includes name; keep record/draft/source names equal so
    // the copy stays inside the existing catalogue admission rules (no invented unbinding).
    expect(copy.name).toBe(source.name);
    expect(copy.authoredDraft.name).toBe(source.authoredDraft.name);
    expect(copy.catalogueSource).toEqual(catalogueSource);
    expect(copy.catalogueSource).not.toBe(source.catalogueSource);
    expect(copy.authoredDefinitionId).toBe(source.authoredDefinitionId);
    expect(copy.cooldownConfig).toEqual(source.cooldownConfig);
  });

  test('duplicate of a missing id is a no-op', () => {
    seed([SOURCE_IMMEDIATE_PERIODIC_COOLDOWN]);
    mountProvider();
    const before = clone(api.state.spells);

    act(() => { api.dispatch(libraryActionCreators.duplicateSpell('missing-spell-id')); });

    expect(api.state.spells).toEqual(before);
  });
});

describe('SpellContextMenu duplicate gating', () => {
  test('only custom spells expose Duplicate Spell', async () => {
    const onDuplicate = jest.fn();
    const onClose = jest.fn();
    const spell = { id: 'class-spell-1', name: 'Class Spell' };
    const menu = (isCustomSpell) => (
      <SpellContextMenu x={10} y={10} spell={spell} onClose={onClose} isCustomSpell={isCustomSpell} onDuplicate={onDuplicate} />
    );

    const { rerender } = render(menu(false));
    expect(screen.queryByText('Duplicate Spell')).not.toBeInTheDocument();

    rerender(menu(true));
    await act(async () => {
      fireEvent.click(screen.getByText('Duplicate Spell'));
      await new Promise(resolve => setTimeout(resolve, 120));
    });
    expect(onDuplicate).toHaveBeenCalledWith('class-spell-1');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Spell Library copy action is reachable in the ordinary library UI', () => {
  test('right-clicking a custom spell exposes Duplicate Spell and creates one independent copy', async () => {
    seed([SOURCE_IMMEDIATE_PERIODIC_COOLDOWN]);
    render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const sourceRow = (await screen.findByText('Solar Flare')).closest('.wow-spell-row');
    expect(sourceRow).toBeTruthy();
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);

    fireEvent.contextMenu(sourceRow, { clientX: 12, clientY: 16 });
    const duplicateItem = await screen.findByText('Duplicate Spell');
    expect(duplicateItem).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(duplicateItem);
    });

    await screen.findByText('Solar Flare (Copy)');
    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(2);
    });

    expect(mockPersisted.data.spells.find((spell) => spell.id === sourceSnapshot.id)).toEqual(sourceSnapshot);
    const copy = mockPersisted.data.spells.find((spell) => spell.name === 'Solar Flare (Copy)');
    expect(copy.id).not.toBe(sourceSnapshot.id);
    expect(copy.dateCreated).not.toBe(sourceSnapshot.dateCreated);
  });

  test('the selected-spell overlay also exposes Duplicate', async () => {
    seed([SOURCE_IMMEDIATE_PERIODIC_COOLDOWN]);
    render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const sourceRow = (await screen.findByText('Solar Flare')).closest('.wow-spell-row');
    fireEvent.mouseDown(sourceRow, { button: 0, clientX: 10, clientY: 10 });
    fireEvent.mouseUp(sourceRow, { button: 0, clientX: 10, clientY: 10 });

    const duplicate = await screen.findByRole('button', { name: /Duplicate/i });
    await act(async () => {
      fireEvent.click(duplicate);
    });

    await screen.findByText('Solar Flare (Copy)');
    await waitFor(() => {
      expect(mockPersisted.data.spells).toHaveLength(2);
    });
  });
});
