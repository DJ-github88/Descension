/**
 * Trigger authoring preservation — ordinary Wizard + Spell Library paths.
 *
 * Existing authored trigger/reaction/passive sections must survive:
 *   Wizard state -> saved library record -> reopen -> edit/update -> duplicate -> cancel.
 *
 * Storage preservation is not an execution claim. `definitionFromWizard` remains the only
 * admission authority and still refuses unsupported trigger shapes exactly as before.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import SpellLibrary from '../components/library/SpellLibrary';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardDispatch } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { catalogueDraft } from '../../../services/catalogueAbility.cjs';
import { CLASS_DATA_MAP } from '../../../data/classSpellGenerator';

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

const BASE = {
  level: 2,
  spellType: 'ACTION',
  resolution: 'DICE',
  effectTypes: ['damage'],
  effectsMap: { damage: true },
  typeConfig: { school: 'ember', icon: 'spell_fire_fireball', castTimeType: 'IMMEDIATE', tags: ['ember'] },
  damageConfig: { damageType: 'direct', formula: '1d8+2', elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 1, mana: 2, components: [] },
  durationConfig: { durationType: 'instant' },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  tags: ['damage'],
  source: 'wizard',
  isCustom: true,
  categoryIds: ['offensive'],
  categories: ['all'],
  dateCreated: '2026-11-01T00:00:00.000Z',
  lastModified: '2026-11-01T00:00:00.000Z'
};

const DEFAULT_TRIGGERS = {
  global: { logicType: 'AND', compoundTriggers: [] },
  effectTriggers: {},
  conditionalEffects: {},
  buffDebuffTriggers: {},
  requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
  triggerRole: { mode: 'CONDITIONAL' }
};

const DEFAULT_RECORD = withDraft({
  ...BASE,
  id: 'trigger-preserve-default',
  name: 'Trigger Preserve Default',
  description: 'Executable record with the established default trigger shape.',
  triggerConfig: DEFAULT_TRIGGERS,
  authoredDefinitionId: '11111111-1111-4111-8111-111111111111'
});

const REACTION_RECORD = withDraft({
  ...BASE,
  id: 'trigger-preserve-reaction',
  name: 'Trigger Preserve Reaction',
  description: 'Reaction with global and effect-specific trigger sections.',
  spellType: 'REACTION',
  typeConfig: { ...BASE.typeConfig, castTimeType: 'REACTION' },
  triggerConfig: {
    global: {
      logicType: 'OR',
      compoundTriggers: [
        { id: 'damage_taken', category: 'combat', name: 'Damage Taken', parameters: { threshold_value: 5, comparison: 'greater_than' } }
      ]
    },
    effectTriggers: {
      damage: {
        logicType: 'AND',
        compoundTriggers: [
          { id: 'critical_hit', category: 'combat', name: 'Critical Hit', parameters: { perspective: 'self' } }
        ],
        targetingOverride: 'nearest'
      }
    },
    conditionalEffects: {
      damage: {
        isConditional: true,
        defaultEnabled: true,
        baseFormula: '1d8+2',
        baseSettings: { damageType: 'direct', elementType: 'ember' },
        conditionalFormulas: { damage_taken: '2d6+2' },
        conditionalSettings: {}
      }
    },
    buffDebuffTriggers: {},
    requiredConditions: {
      enabled: true,
      logicType: 'AND',
      conditions: [{ id: 'resource_threshold', category: 'resource', name: 'Resource Threshold', parameters: { percentage: 50 } }]
    },
    triggerRole: { mode: 'CONDITIONAL' }
  },
  authoredDefinitionId: '22222222-2222-4222-8222-222222222222'
});

const BUFF_DEBUFF_RECORD = withDraft({
  ...BASE,
  id: 'trigger-preserve-buff-debuff',
  name: 'Trigger Preserve Buff Debuff',
  description: 'Effect-attached trigger section with no trigger-step editor.',
  triggerConfig: {
    ...DEFAULT_TRIGGERS,
    buffDebuffTriggers: {
      restoration: {
        triggers: [{ id: 'on_damage_taken', category: 'combat', name: 'Damage Taken', parameters: { perspective: 'self' } }],
        triggersEffect: 'restoration'
      }
    }
  },
  authoredDefinitionId: '33333333-3333-4333-8333-333333333333'
});

const UNSUPPORTED_RECORD = withDraft({
  ...BASE,
  id: 'trigger-preserve-unsupported',
  name: 'Trigger Preserve Unsupported',
  description: 'Composed spell carrying an unknown manual trigger section.',
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {},
    conditionalEffects: {},
    manualTriggers: { onHit: 'Table adjudicates the follow-up.' }
  },
  authoredDefinitionId: '44444444-4444-4444-8444-444444444444'
});

const NULL_RECORD_TRIGGER = {
  ...withDraft({
    ...BASE,
    id: 'trigger-preserve-null-record-field',
    name: 'Trigger Preserve Null Record Field',
    description: 'Legacy record whose top-level triggerConfig is absent but whose draft keeps it.',
    triggerConfig: null,
    authoredDefinitionId: '55555555-5555-4555-8555-555555555555'
  })
};
NULL_RECORD_TRIGGER.authoredDraft.triggerConfig = {
  global: { logicType: 'AND', compoundTriggers: [] },
  effectTriggers: {},
  conditionalEffects: {},
  manualTriggers: { onHit: 'Draft-only manual section.' }
};
NULL_RECORD_TRIGGER.serializedData = JSON.stringify(NULL_RECORD_TRIGGER.authoredDraft, null, 2);

const EMPTY_RECORD_TRIGGER = {
  ...withDraft({
    ...BASE,
    id: 'trigger-preserve-empty-record-field',
    name: 'Trigger Preserve Empty Record Field',
    description: 'Legacy record whose top-level triggerConfig is an empty object but whose draft keeps it.',
    triggerConfig: {},
    authoredDefinitionId: '88888888-8888-4888-8888-888888888888'
  })
};
EMPTY_RECORD_TRIGGER.authoredDraft.triggerConfig = {
  global: { logicType: 'AND', compoundTriggers: [] },
  effectTriggers: {},
  conditionalEffects: {},
  manualTriggers: { onHit: 'Empty-record draft-only manual section.' }
};
EMPTY_RECORD_TRIGGER.serializedData = JSON.stringify(EMPTY_RECORD_TRIGGER.authoredDraft, null, 2);

const CATALOGUE_RECORD = withDraft({
  ...BASE,
  id: 'trigger-preserve-catalogue',
  name: 'Trigger Preserve Catalogue',
  description: 'Catalogue-bound record; the binding must not change.',
  triggerConfig: DEFAULT_TRIGGERS,
  catalogueSource: {
    spellId: 'trigger-preserve-catalogue',
    classId: 'arcanoneer',
    recordHash: 'a'.repeat(64),
    record: { id: 'trigger-preserve-catalogue', name: 'Trigger Preserve Catalogue' }
  },
  authoredDefinitionId: '66666666-6666-4666-8666-666666666666',
  cooldownConfig: { cooldownType: 'authenticated_caster_start', cooldownValue: 2 }
});

const DispatchProbe = () => {
  const dispatch = useSpellWizardDispatch();
  React.useEffect(() => {
    window.__triggerTestDispatch = dispatch;
    return () => { delete window.__triggerTestDispatch; };
  }, [dispatch]);
  return null;
};

const mountWizard = () => render(
  <CreatureLibraryProvider>
    <SpellLibraryProvider>
      <SpellWizardProvider>
        <SpellwizardApp hideHeader={true} />
        <DispatchProbe />
      </SpellWizardProvider>
    </SpellLibraryProvider>
  </CreatureLibraryProvider>
);

const mountLibrary = () => render(
  <SpellLibraryProvider>
    <SpellLibrary />
  </SpellLibraryProvider>
);

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

const loadForEdit = async (fixture) => {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => {
    window.handleLoadSpell(clone(fixture), true);
  });
  const label = `Editing Spell: ${fixture.name}`;
  await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(label));
};

const goTo = async (stepId) => {
  await act(async () => {
    window.__triggerTestDispatch({ type: 'SET_CURRENT_STEP', payload: stepId });
  });
};

const updateFromHeader = async (fixture) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /^Update$/ }));
  });
  await waitFor(() => expect(mockPersisted.data.spells[0].lastModified).not.toBe(fixture.lastModified));
};

const storedById = (id) => mockPersisted.data.spells.find((spell) => spell.id === id);

beforeEach(() => {
  mockPersisted = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('Wizard edit preserves authored trigger configuration', () => {
  test('default trigger shape stays admission-neutral after visiting the trigger step', async () => {
    seed([DEFAULT_RECORD]);
    const sourceSnapshot = clone(DEFAULT_RECORD);
    expect(definitionFromWizard(clone(DEFAULT_RECORD)).ok).toBe(true);

    mountWizard();
    await loadForEdit(DEFAULT_RECORD);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    await updateFromHeader(DEFAULT_RECORD);

    const saved = storedById(DEFAULT_RECORD.id);
    expect(saved.triggerConfig).toEqual(DEFAULT_TRIGGERS);
    expect(saved.authoredDraft.triggerConfig).toEqual(DEFAULT_TRIGGERS);
    expect(definitionFromWizard(saved).ok).toBe(true);
    expect(DEFAULT_RECORD).toEqual(sourceSnapshot);
  });

  test.each([
    ['reaction global + effect triggers', REACTION_RECORD],
    ['effect-attached buff/debuff triggers', BUFF_DEBUFF_RECORD]
  ])('%s survive trigger-step visit + Update', async (_label, fixture) => {
    seed([fixture]);
    const sourceSnapshot = clone(fixture);

    mountWizard();
    await loadForEdit(fixture);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    await updateFromHeader(fixture);

    const saved = storedById(fixture.id);
    expect(saved.triggerConfig).toEqual(fixture.triggerConfig);
    expect(saved.authoredDraft.triggerConfig).toEqual(fixture.triggerConfig);
    expect(JSON.parse(saved.serializedData).triggerConfig).toEqual(fixture.triggerConfig);
    expect(saved.id).toBe(fixture.id);
    expect(saved.dateCreated).toBe(fixture.dateCreated);
    expect(saved.authoredDefinitionId).toBe(fixture.authoredDefinitionId);
    expect(saved.cooldownConfig).toEqual(fixture.cooldownConfig);
    expect(fixture).toEqual(sourceSnapshot);
  });

  test('authoring a new trigger still writes through after the trigger step mounts', async () => {
    seed([DEFAULT_RECORD]);

    mountWizard();
    await loadForEdit(DEFAULT_RECORD);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    const option = document.querySelector('.wow-trigger-option');
    expect(option).toBeTruthy();
    await act(async () => { fireEvent.click(option); });
    await updateFromHeader(DEFAULT_RECORD);

    const saved = storedById(DEFAULT_RECORD.id);
    expect(saved.triggerConfig.global.compoundTriggers).toHaveLength(1);
    expect(saved.triggerConfig.global.enabled).toBeUndefined();
    expect(saved.triggerConfig.buffDebuffTriggers).toEqual({});
  });

  test('unknown manual trigger section survives Review Update and remains refused by admission', async () => {
    seed([UNSUPPORTED_RECORD]);
    const sourceSnapshot = clone(UNSUPPORTED_RECORD);
    const before = definitionFromWizard(clone(UNSUPPORTED_RECORD));
    expect(before.ok).toBe(false);

    mountWizard();
    await loadForEdit(UNSUPPORTED_RECORD);
    await goTo('review');
    const reviewSave = await screen.findByRole('button', { name: /Update Spell/i });
    await act(async () => { fireEvent.click(reviewSave); });
    await waitFor(() => expect(storedById(UNSUPPORTED_RECORD.id).lastModified).not.toBe(UNSUPPORTED_RECORD.lastModified));

    const saved = storedById(UNSUPPORTED_RECORD.id);
    expect(saved.triggerConfig).toEqual(UNSUPPORTED_RECORD.triggerConfig);
    expect(saved.authoredDraft.triggerConfig).toEqual(UNSUPPORTED_RECORD.triggerConfig);
    expect(JSON.parse(saved.serializedData).triggerConfig).toEqual(UNSUPPORTED_RECORD.triggerConfig);
    expect(saved.authoredDefinitionId).toBe(UNSUPPORTED_RECORD.authoredDefinitionId);
    expect(definitionFromWizard(saved).ok).toBe(false);
    expect(UNSUPPORTED_RECORD).toEqual(sourceSnapshot);
  });

  test.each([
    ['null', NULL_RECORD_TRIGGER],
    ['empty object', EMPTY_RECORD_TRIGGER]
  ])('reopen falls back to the draft trigger section when the record field is %s', async (_label, fixture) => {
    seed([fixture]);

    mountWizard();
    await loadForEdit(fixture);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    await updateFromHeader(fixture);

    const saved = storedById(fixture.id);
    expect(saved.triggerConfig).toEqual(fixture.authoredDraft.triggerConfig);
    expect(saved.authoredDraft.triggerConfig).toEqual(fixture.authoredDraft.triggerConfig);
    expect(definitionFromWizard(saved).ok).toBe(false);
  });

  test('prepared catalogue draft still saves and admits after the trigger fallback is applied', async () => {
    const record = CLASS_DATA_MAP.Martyr.spells.find((spell) => spell.id === 'martyr_restorative_prayer');
    const prepared = catalogueDraft(record, 'martyr', {
      authoredDefinitionId: '77777777-7777-4777-8777-777777777777',
      id: 'catalogue-martyr-trigger-preserve'
    });
    expect(prepared.ok).toBe(true);

    seed([]);
    mountWizard();
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => {
      window.handleLoadSpell(clone(prepared.draft), false);
    });

    const finalize = await screen.findByRole('button', { name: /^Finalize$/ });
    await act(async () => { fireEvent.click(finalize); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const saved = mockPersisted.data.spells[0];
    expect(saved.catalogueSource).toEqual(prepared.draft.catalogueSource);
    expect(saved.triggerConfig).toEqual({
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {},
      conditionalEffects: {}
    });
    expect(definitionFromWizard(saved, { roomId: 'r', classId: 'martyr', definitionVersion: 1 }).ok).toBe(true);
  });

  test('visiting the trigger step on a prepared catalogue draft keeps the inert trigger shape', async () => {
    const record = CLASS_DATA_MAP.Martyr.spells.find((spell) => spell.id === 'martyr_restorative_prayer');
    const prepared = catalogueDraft(record, 'martyr', {
      authoredDefinitionId: '99999999-9999-4999-8999-999999999999',
      id: 'catalogue-martyr-trigger-step'
    });
    expect(prepared.ok).toBe(true);

    seed([]);
    mountWizard();
    await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
    await act(async () => {
      window.handleLoadSpell(clone(prepared.draft), false);
    });
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();

    const finalize = screen.getByRole('button', { name: /^Finalize$/ });
    await act(async () => { fireEvent.click(finalize); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(1));

    const saved = mockPersisted.data.spells[0];
    expect(saved.triggerConfig).toEqual({
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {},
      conditionalEffects: {}
    });
    expect(definitionFromWizard(saved, { roomId: 'r', classId: 'martyr', definitionVersion: 1 }).ok).toBe(true);
  });

  test('catalogue binding and definition/cooldown identity survive edit', async () => {
    seed([CATALOGUE_RECORD]);

    mountWizard();
    await loadForEdit(CATALOGUE_RECORD);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    await updateFromHeader(CATALOGUE_RECORD);

    const saved = storedById(CATALOGUE_RECORD.id);
    expect(saved.catalogueSource).toEqual(CATALOGUE_RECORD.catalogueSource);
    expect(saved.authoredDefinitionId).toBe(CATALOGUE_RECORD.authoredDefinitionId);
    expect(saved.cooldownConfig).toEqual(CATALOGUE_RECORD.cooldownConfig);
    expect(saved.triggerConfig).toEqual(CATALOGUE_RECORD.triggerConfig);
    expect(saved.id).toBe(CATALOGUE_RECORD.id);
    expect(saved.dateCreated).toBe(CATALOGUE_RECORD.dateCreated);
  });

  test('Cancel Edit leaves the source byte-identical after the trigger step mutates editor state', async () => {
    seed([BUFF_DEBUFF_RECORD]);
    const beforeSnapshot = JSON.stringify(mockPersisted.data.spells[0]);

    mountWizard();
    await loadForEdit(BUFF_DEBUFF_RECORD);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();

    showConfirm.mockResolvedValueOnce(true);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Cancel Edit/i }));
    });

    expect(mockPersisted.data.spells).toHaveLength(1);
    expect(JSON.stringify(mockPersisted.data.spells[0])).toBe(beforeSnapshot);
  });
});

describe('Duplicate preserves trigger configuration and copy identity', () => {
  const duplicateFromLibrary = async (fixture) => {
    const sourceRow = (await screen.findByText(fixture.name)).closest('.wow-spell-row');
    expect(sourceRow).toBeTruthy();
    fireEvent.contextMenu(sourceRow, { clientX: 12, clientY: 16 });
    const duplicateItem = await screen.findByText('Duplicate Spell');
    await act(async () => { fireEvent.click(duplicateItem); });
    await waitFor(() => expect(mockPersisted.data.spells).toHaveLength(2));
  };

  test('copy deep-clones trigger sections and keeps definition/cooldown identity', async () => {
    seed([BUFF_DEBUFF_RECORD]);
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);

    const libraryView = mountLibrary();
    await duplicateFromLibrary(BUFF_DEBUFF_RECORD);
    libraryView.unmount();

    const sourceAfter = storedById(sourceSnapshot.id);
    const copy = mockPersisted.data.spells.find((spell) => spell.id !== sourceSnapshot.id);
    expect(sourceAfter).toEqual(sourceSnapshot);
    expect(copy.id).not.toBe(sourceSnapshot.id);
    expect(copy.dateCreated).not.toBe(sourceSnapshot.dateCreated);
    expect(copy.name).toBe(`${sourceSnapshot.name} (Copy)`);
    expect(copy.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
    expect(copy.cooldownConfig).toEqual(sourceSnapshot.cooldownConfig);
    expect(copy.categoryIds).toEqual(sourceSnapshot.categoryIds);
    expect(copy.triggerConfig).toEqual(sourceSnapshot.triggerConfig);
    expect(copy.triggerConfig).not.toBe(sourceSnapshot.triggerConfig);
    expect(copy.authoredDraft.triggerConfig).toEqual(sourceSnapshot.triggerConfig);
    expect(JSON.parse(copy.serializedData).triggerConfig).toEqual(sourceSnapshot.triggerConfig);
  });

  test('nested edits to the copy cannot mutate the source trigger configuration', async () => {
    seed([BUFF_DEBUFF_RECORD]);
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);

    const libraryView = mountLibrary();
    await duplicateFromLibrary(BUFF_DEBUFF_RECORD);
    libraryView.unmount();

    const copy = mockPersisted.data.spells.find((spell) => spell.id !== sourceSnapshot.id);
    mountWizard();
    await loadForEdit(copy);
    await goTo('triggers');
    expect(await screen.findByText('Trigger Mode')).toBeInTheDocument();
    const option = document.querySelector('.wow-trigger-option');
    expect(option).toBeTruthy();
    await act(async () => { fireEvent.click(option); });
    await updateFromHeader(copy);

    const savedSource = storedById(sourceSnapshot.id);
    const savedCopy = storedById(copy.id);
    expect(savedSource).toEqual(sourceSnapshot);
    expect(savedCopy.triggerConfig.global.compoundTriggers).toHaveLength(1);
    expect(savedCopy.triggerConfig.buffDebuffTriggers).toEqual(sourceSnapshot.triggerConfig.buffDebuffTriggers);
    expect(savedCopy.authoredDraft.triggerConfig).toEqual(savedCopy.triggerConfig);
    expect(savedCopy.triggerConfig).not.toBe(savedSource.triggerConfig);
    expect(savedCopy.id).toBe(copy.id);
    expect(savedCopy.dateCreated).toBe(copy.dateCreated);
    expect(savedCopy.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
  });

  test('catalogue-bound copy keeps the exact source binding and name', async () => {
    seed([CATALOGUE_RECORD]);
    const sourceSnapshot = clone(mockPersisted.data.spells[0]);

    const libraryView = mountLibrary();
    await duplicateFromLibrary(CATALOGUE_RECORD);
    libraryView.unmount();

    const copy = mockPersisted.data.spells.find((spell) => spell.id !== sourceSnapshot.id);
    expect(copy.name).toBe(sourceSnapshot.name);
    expect(copy.catalogueSource).toEqual(sourceSnapshot.catalogueSource);
    expect(copy.authoredDefinitionId).toBe(sourceSnapshot.authoredDefinitionId);
    expect(copy.cooldownConfig).toEqual(sourceSnapshot.cooldownConfig);
    expect(copy.triggerConfig).toEqual(sourceSnapshot.triggerConfig);
    expect(copy.triggerConfig).not.toBe(sourceSnapshot.triggerConfig);
  });
});
