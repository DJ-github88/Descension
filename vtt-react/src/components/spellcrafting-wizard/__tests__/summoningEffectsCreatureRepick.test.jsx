/**
 * Summoning effect editor: creature re-picking, switching, manual guard, and Wizard round-trip.
 *
 * Covers:
 *   1. Re-picking the SAME creature keeps configured summon details (direct confirm, deselect+reselect, adding another creature).
 *   2. Picking a DIFFERENT creature does NOT transfer configured edits from the previous creature (uses clean defaults).
 *   3. Custom summon edits survive opening Creature Selection and adding a library creature.
 *   4. Cancelling Creature Selection discards uncommitted modal toggles and preserves edits.
 *   5. Summoning stays manual (refused by client & server definitionFromWizard, UNSUPPORTED in explainExecution),
 *      remains editable and usable as GM reference, and survives save + reopen in the Spell Wizard.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act, within, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: require('crypto').webcrypto,
    configurable: true
  });
}

let mockPersisted = null;

// Plain functions (not jest.fn) so CRA's resetMocks does not wipe implementations before each test.
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
  getCustomIconUrl: () => 'fallback-icon.png',
  getCreatureTokenIconUrl: () => 'test-token.png'
}));

import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, actionCreators } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import SummoningEffects from '../data/effects/SummoningEffects';
import useSpellbookStore from '../../../store/spellbookStore';
import useCreatureStore from '../../../store/creatureStore';
import { explainExecution, STATES } from '../utils/executionCompatibility';
import { definitionFromWizard as clientDefinitionFromWizard } from '../../../services/authoredAbility';

const {
  definitionFromWizard: serverDefinitionFromWizard
} = require('../../../../../server/shared/services/authoredAbility');

const WOLF_CREATURE = {
  id: 'timber-wolf',
  name: 'Timber Wolf',
  description: 'A swift pack hunter.',
  size: 'medium',
  type: 'beast',
  tokenIcon: 'ability_hunter_pet_wolf',
  tags: ['wolf', 'beast'],
  stats: { maxHp: 32, maxMana: 0, maxAp: 6, initiative: 2 }
};

const GOLEM_CREATURE = {
  id: 'stone-golem',
  name: 'Stone Golem',
  description: 'A heavy animated guardian.',
  size: 'large',
  type: 'construct',
  tokenIcon: 'spell_nature_earthelemental_totem',
  tags: ['golem', 'construct'],
  stats: { maxHp: 90, maxMana: 10, maxAp: 4, initiative: -1 }
};

const seedCreatures = () => {
  useCreatureStore.setState({
    creatures: [
      JSON.parse(JSON.stringify(WOLF_CREATURE)),
      JSON.parse(JSON.stringify(GOLEM_CREATURE))
    ]
  });
};

const getLatestSummonPayload = (dispatch) => {
  const calls = dispatch.mock.calls
    .map(([action]) => action)
    .filter((action) => /SUMM/i.test(action?.type || ''));
  return calls[calls.length - 1]?.payload;
};

const clickCreatureInModal = (creatureName) => {
  const modal = document.querySelector('.creature-selection-inner');
  expect(modal).toBeTruthy();
  const cardHeading = within(modal).getByText(creatureName);
  const wrapper = cardHeading.closest('.creature-card-wrapper');
  expect(wrapper).toBeTruthy();
  fireEvent.click(wrapper);
};

const confirmCreatureModal = () => {
  const modal = document.querySelector('.creature-selection-inner');
  expect(modal).toBeTruthy();
  fireEvent.click(within(modal).getByRole('button', { name: /Confirm Selection/i }));
};

const cancelCreatureModal = () => {
  const modal = document.querySelector('.creature-selection-inner');
  expect(modal).toBeTruthy();
  fireEvent.click(within(modal).getByRole('button', { name: /Cancel/i }));
};

const mountSummoningEditor = (initialSummoningConfig = null, dispatch = jest.fn()) => {
  const view = render(
    <CreatureLibraryProvider>
      <SpellLibraryProvider>
        <SummoningEffects
          state={{ summoningConfig: initialSummoningConfig }}
          dispatch={dispatch}
          actionCreators={actionCreators}
          getDefaultFormula={() => '1d6'}
        />
      </SpellLibraryProvider>
    </CreatureLibraryProvider>
  );
  return { view, dispatch };
};

const configureWolfEdits = () => {
  const card = document.querySelector('.creature-selection-item');
  expect(card).toBeTruthy();

  fireEvent.change(within(card).getByLabelText('Quantity'), { target: { value: '3' } });
  fireEvent.change(within(card).getByLabelText('Duration'), { target: { value: '25' } });
  fireEvent.change(within(card).getByLabelText('Duration Unit'), { target: { value: 'rounds' } });
  fireEvent.click(within(card).getByLabelText('Concentration'));
  fireEvent.change(within(card).getByLabelText('Control Type'), { target: { value: 'mental' } });
  fireEvent.change(within(card).getByLabelText('Control Range'), { target: { value: '0' } });

  fireEvent.click(within(card).getByRole('button', { name: /Damage Aura/i }));
  const attachedItem = card.querySelector('.attached-effect-item');
  expect(attachedItem).toBeTruthy();

  const textInput = attachedItem.querySelector('input[type="text"]');
  const selectInput = attachedItem.querySelector('select');
  const numberInput = attachedItem.querySelector('input[type="number"]');
  fireEvent.change(textInput, { target: { value: '4d6' } });
  fireEvent.change(selectInput, { target: { value: 'ember' } });
  fireEvent.change(numberInput, { target: { value: '20' } });
};

const assertWolfEditsPreserved = (wolfEntry) => {
  expect(wolfEntry).toBeTruthy();
  expect(wolfEntry.id).toBe('timber-wolf');
  expect(wolfEntry.config.quantity).toBe(3);
  expect(wolfEntry.config.duration).toBe(25);
  expect(wolfEntry.config.durationUnit).toBe('rounds');
  expect(wolfEntry.config.concentration).toBe(true);
  expect(wolfEntry.config.controlType).toBe('mental');
  expect(wolfEntry.config.controlRange).toBe(0);

  const auraEntries = Object.values(wolfEntry.config.attachedEffects || {});
  expect(auraEntries).toHaveLength(1);
  expect(auraEntries[0]).toMatchObject({
    effectType: 'damage',
    formula: '4d6',
    elementType: 'ember',
    areaRadius: 20
  });
};

const assertCleanDefaults = (creatureEntry, expectedId) => {
  expect(creatureEntry).toBeTruthy();
  expect(creatureEntry.id).toBe(expectedId);
  expect(creatureEntry.config).toEqual({
    quantity: 1,
    duration: 10,
    durationUnit: 'minutes',
    hasDuration: true,
    concentration: false,
    controlType: 'verbal',
    controlRange: 60,
    attachedEffects: {},
    abilities: []
  });
};

describe('SummoningEffects creature re-picking & switching', () => {
  beforeEach(() => {
    mockPersisted = null;
    seedCreatures();
  });

  afterEach(() => {
    cleanup();
    useSpellbookStore.setState({ wizardEditRequest: null });
    useCreatureStore.setState({ creatures: [] });
  });

  it('keeps configured summon details when re-picking the SAME creature (confirm, toggle off/on, and adding another creature)', () => {
    const { dispatch } = mountSummoningEditor();

    // Initial selection: pick Timber Wolf
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    confirmCreatureModal();

    // Configure custom summon details + attached aura on Timber Wolf
    configureWolfEdits();
    assertWolfEditsPreserved(getLatestSummonPayload(dispatch).creatures[0]);

    // Re-pick path 1: reopen Creature Library and confirm the same creature directly
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    confirmCreatureModal();
    assertWolfEditsPreserved(getLatestSummonPayload(dispatch).creatures[0]);

    // Re-pick path 2: reopen Creature Library, deselect Timber Wolf, re-pick Timber Wolf, confirm
    fireEvent.click(screen.getByRole('button', { name: /Select from Creature Library/i }));
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Timber Wolf');
    confirmCreatureModal();

    const afterToggleRepick = getLatestSummonPayload(dispatch);
    expect(afterToggleRepick.creatures).toHaveLength(1);
    assertWolfEditsPreserved(afterToggleRepick.creatures[0]);

    // Verify rendered inputs still display Timber Wolf's edits
    const wolfCard = document.querySelector('.creature-selection-item');
    expect(within(wolfCard).getByLabelText('Quantity')).toHaveValue(3);
    expect(within(wolfCard).getByLabelText('Duration')).toHaveValue(25);
    expect(within(wolfCard).getByLabelText('Duration Unit')).toHaveValue('rounds');
    expect(within(wolfCard).getByLabelText('Concentration')).toBeChecked();
    expect(within(wolfCard).getByLabelText('Control Type')).toHaveValue('mental');
    expect(within(wolfCard).getByLabelText('Control Range')).toHaveValue('0');

    // Re-pick path 3: keep Timber Wolf and add Stone Golem alongside it
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Stone Golem');
    confirmCreatureModal();

    const withTwoCreatures = getLatestSummonPayload(dispatch);
    expect(withTwoCreatures.creatures).toHaveLength(2);
    assertWolfEditsPreserved(withTwoCreatures.creatures.find((c) => c.id === 'timber-wolf'));
    assertCleanDefaults(withTwoCreatures.creatures.find((c) => c.id === 'stone-golem'), 'stone-golem');
  });

  it('does NOT transfer configured edits when switching to a DIFFERENT creature', () => {
    const { dispatch } = mountSummoningEditor();

    // Pick Timber Wolf and configure non-default summon details + attached aura
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    confirmCreatureModal();
    configureWolfEdits();
    assertWolfEditsPreserved(getLatestSummonPayload(dispatch).creatures[0]);

    // Switch from Timber Wolf to Stone Golem (different creature)
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf'); // deselect Wolf
    clickCreatureInModal('Stone Golem'); // select Golem
    confirmCreatureModal();

    const switched = getLatestSummonPayload(dispatch);
    expect(switched.creatures).toHaveLength(1);
    assertCleanDefaults(switched.creatures[0], 'stone-golem');

    // Top-level summary fields must also match the newly picked creature's defaults, not Wolf's edits
    expect(switched.creatureId).toBe('stone-golem');
    expect(switched.quantity).toBe(1);
    expect(switched.duration).toBe(10);
    expect(switched.durationUnit).toBe('minutes');
    expect(switched.hasDuration).toBe(true);
    expect(switched.concentration).toBe(false);
    expect(switched.controlType).toBe('verbal');
    expect(switched.controlRange).toBe(60);

    // UI controls show Stone Golem's clean defaults and no leftover aura
    const golemCard = document.querySelector('.creature-selection-item');
    expect(within(golemCard).getByText('Stone Golem')).toBeInTheDocument();
    expect(within(golemCard).getByLabelText('Quantity')).toHaveValue(1);
    expect(within(golemCard).getByLabelText('Duration')).toHaveValue(10);
    expect(within(golemCard).getByLabelText('Duration Unit')).toHaveValue('minutes');
    expect(within(golemCard).getByLabelText('Concentration')).not.toBeChecked();
    expect(within(golemCard).getByLabelText('Control Type')).toHaveValue('verbal');
    expect(within(golemCard).getByLabelText('Control Range')).toHaveValue('60');
    expect(golemCard.querySelectorAll('.attached-effect-item')).toHaveLength(0);
  });

  it('preserves custom summon edits when opening Creature Selection and adding a library creature', () => {
    const { dispatch } = mountSummoningEditor();

    fireEvent.click(screen.getByRole('button', { name: /Create Custom/i }));
    const customCard = document.querySelector('.creature-selection-item');
    expect(customCard).toBeTruthy();

    fireEvent.change(within(customCard).getByPlaceholderText('Entity Name'), {
      target: { value: 'Chronal Wisp' }
    });
    fireEvent.change(within(customCard).getByPlaceholderText('Describe your temporal entity...'), {
      target: { value: 'GM tracks wisp positioning manually.' }
    });
    fireEvent.change(within(customCard).getByLabelText('Quantity'), { target: { value: '2' } });
    fireEvent.change(within(customCard).getByLabelText('Control Type'), { target: { value: 'empathic' } });
    fireEvent.change(within(customCard).getByLabelText('Control Range'), { target: { value: '0' } });
    fireEvent.click(within(customCard).getByRole('button', { name: /Healing Aura/i }));

    // Open Creature Selection and add Stone Golem alongside the custom summon
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Stone Golem');
    confirmCreatureModal();

    const payload = getLatestSummonPayload(dispatch);
    expect(payload.creatures).toHaveLength(2);

    const customEntry = payload.creatures.find((c) => c.id.startsWith('custom-summon'));
    expect(customEntry).toMatchObject({
      name: 'Chronal Wisp',
      description: 'GM tracks wisp positioning manually.'
    });
    expect(customEntry.config.quantity).toBe(2);
    expect(customEntry.config.controlType).toBe('empathic');
    expect(customEntry.config.controlRange).toBe(0);
    expect(Object.values(customEntry.config.attachedEffects)).toHaveLength(1);

    assertCleanDefaults(payload.creatures.find((c) => c.id === 'stone-golem'), 'stone-golem');
  });

  it('discards uncommitted toggles when Creature Selection is cancelled', () => {
    const { dispatch } = mountSummoningEditor();

    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    confirmCreatureModal();
    configureWolfEdits();

    // Open modal, toggle Wolf off and Golem on, then Cancel
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Stone Golem');
    cancelCreatureModal();

    // Reopen modal and Confirm immediately: Wolf + all edits must still be selected (not cancelled Golem)
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    confirmCreatureModal();

    const payload = getLatestSummonPayload(dispatch);
    expect(payload.creatures).toHaveLength(1);
    assertWolfEditsPreserved(payload.creatures[0]);
  });

  it('preserves explicit false/0 config values on same-creature re-pick and isolates attachedEffects across creatures', () => {
    const { dispatch } = mountSummoningEditor({
      creatures: [
        {
          ...WOLF_CREATURE,
          config: {
            quantity: 2,
            duration: 12,
            durationUnit: 'rounds',
            hasDuration: false,
            concentration: false,
            controlType: 'mental',
            controlRange: 0,
            attachedEffects: {},
            abilities: []
          }
        }
      ],
      quantity: 2,
      duration: 12,
      durationUnit: 'rounds',
      hasDuration: false,
      concentration: false,
      controlType: 'mental',
      controlRange: 0
    });

    // Re-pick Timber Wolf and add Stone Golem at the same time
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Stone Golem');
    confirmCreatureModal();

    const afterAdd = getLatestSummonPayload(dispatch);
    const wolf = afterAdd.creatures.find((c) => c.id === 'timber-wolf');
    const golem = afterAdd.creatures.find((c) => c.id === 'stone-golem');

    expect(wolf.config.hasDuration).toBe(false);
    expect(wolf.config.concentration).toBe(false);
    expect(wolf.config.controlRange).toBe(0);
    expect(wolf.config.quantity).toBe(2);
    assertCleanDefaults(golem, 'stone-golem');

    // Adding an attached effect to Stone Golem must not leak into Timber Wolf
    const cards = document.querySelectorAll('.creature-selection-item');
    const golemCard = Array.from(cards).find((el) => within(el).queryByText('Stone Golem'));
    expect(golemCard).toBeTruthy();
    fireEvent.click(within(golemCard).getByRole('button', { name: /^Buff Aura$/i }));

    const afterGolemAura = getLatestSummonPayload(dispatch);
    expect(Object.keys(afterGolemAura.creatures.find((c) => c.id === 'stone-golem').config.attachedEffects)).toHaveLength(1);
    expect(Object.keys(afterGolemAura.creatures.find((c) => c.id === 'timber-wolf').config.attachedEffects)).toHaveLength(0);
  });
});

describe('Summoning spell Wizard save, reopen, manual guard, and GM reference', () => {
  jest.setTimeout(30000);

  const initialSummonSpell = {
    id: 'fx-summon-repick',
    name: 'Call Pack Guardian',
    description: 'Manual GM-adjudicated pack summon.',
    level: 2,
    spellType: 'ACTION',
    effectTypes: ['summoning'],
    effectsMap: { summoning: true },
    typeConfig: { school: 'arcane', castTimeType: 'IMMEDIATE', icon: 'spell_holy_holybolt', tags: [] },
    summoningConfig: {
      creatures: [
        {
          ...WOLF_CREATURE,
          config: {
            quantity: 1,
            duration: 10,
            durationUnit: 'minutes',
            hasDuration: true,
            concentration: false,
            controlType: 'verbal',
            controlRange: 60,
            attachedEffects: {},
            abilities: []
          }
        }
      ],
      duration: 10,
      durationUnit: 'minutes',
      hasDuration: true,
      concentration: false,
      quantity: 1,
      maxQuantity: 4,
      controlRange: 60,
      controlType: 'verbal',
      difficultyLevel: 'easy',
      waitForTrigger: false,
      creatureId: 'timber-wolf',
      formula: '1d6'
    },
    dateCreated: '2026-01-01T00:00:00.000Z',
    lastModified: '2026-01-01T00:00:00.000Z',
    categoryIds: ['uncategorized']
  };

  beforeEach(() => {
    seedCreatures();
    mockPersisted = {
      version: 1,
      timestamp: '2026-01-01T00:00:00.000Z',
      data: {
        spells: [JSON.parse(JSON.stringify(initialSummonSpell))],
        categories: [],
        collections: [],
        selectedSpell: null
      }
    };
  });

  afterEach(() => {
    cleanup();
    useSpellbookStore.setState({ wizardEditRequest: null });
    useCreatureStore.setState({ creatures: [] });
  });

  const mountFullWizard = (spell) => {
    useSpellbookStore.setState({
      wizardEditRequest: {
        spell: JSON.parse(JSON.stringify(spell)),
        guard: { isCurrent: () => true }
      }
    });
    return render(
      <CreatureLibraryProvider>
        <SpellLibraryProvider>
          <SpellWizardProvider>
            <SpellWizardWrapper />
          </SpellWizardProvider>
        </SpellLibraryProvider>
      </CreatureLibraryProvider>
    );
  };

  const openEffectsStep = async () => {
    const nav = await screen.findByRole('navigation', { name: /Spell wizard steps/i });
    const effectsBtn = Array.from(nav.querySelectorAll('button')).find((el) =>
      /Effects/i.test(el.getAttribute('aria-label') || el.textContent || '')
    );
    expect(effectsBtn).toBeTruthy();
    await act(async () => {
      fireEvent.click(effectsBtn);
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Select Creatures/i })).toBeInTheDocument();
    });
  };

  const finalizeWizard = async () => {
    const before = JSON.stringify(mockPersisted);
    await act(async () => {
      fireEvent.click(screen.getByTitle(/Finalize/i));
    });
    await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(before));
    return mockPersisted.data.spells[0];
  };

  it('preserves edits across same-creature re-pick, stays manual, survives Wizard save & reopen, and stays editable as GM reference', async () => {
    const view1 = mountFullWizard(initialSummonSpell);
    await openEffectsStep();

    // Edit Timber Wolf's summon details
    configureWolfEdits();

    // Re-pick the SAME creature (deselect + reselect + confirm)
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Timber Wolf');
    confirmCreatureModal();

    // Save via real Wizard Finalize
    const saved = await finalizeWizard();
    expect(saved.id).toBe(initialSummonSpell.id);
    expect(saved.effectTypes).toEqual(['summoning']);
    assertWolfEditsPreserved(saved.summoningConfig.creatures[0]);
    assertWolfEditsPreserved(saved.authoredDraft.summoningConfig.creatures[0]);

    // Manual summoning preserved on both client and server admission validators
    const clientVerdict = clientDefinitionFromWizard(saved, { roomId: 'room-1' });
    const serverVerdict = serverDefinitionFromWizard(saved, { roomId: 'room-1' });
    expect(clientVerdict.ok).toBe(false);
    expect(serverVerdict.ok).toBe(false);

    // Unsupported ability stays usable as GM reference without stripping anything
    const savedSnapshot = JSON.stringify(saved);
    const compat = explainExecution(saved, { roomId: 'room-1', shared: true, gm: false });
    expect(compat.state).toBe(STATES.UNSUPPORTED);
    expect(compat.automated).toEqual([]);
    expect(compat.preserved.map((item) => item.label)).toContain('Summoning');
    expect(compat.next.join(' ')).toMatch(/manual notice in chat/i);
    expect(JSON.stringify(saved)).toBe(savedSnapshot);

    // Reopen saved spell in a fresh Wizard mount and verify summon edits survive
    view1.unmount();
    const view2 = mountFullWizard(saved);
    await openEffectsStep();

    const reopenedCard = document.querySelector('.creature-selection-item');
    expect(within(reopenedCard).getByText('Timber Wolf')).toBeInTheDocument();
    expect(within(reopenedCard).getByLabelText('Quantity')).toHaveValue(3);
    expect(within(reopenedCard).getByLabelText('Duration')).toHaveValue(25);
    expect(within(reopenedCard).getByLabelText('Duration Unit')).toHaveValue('rounds');
    expect(within(reopenedCard).getByLabelText('Concentration')).toBeChecked();
    expect(within(reopenedCard).getByLabelText('Control Type')).toHaveValue('mental');
    expect(within(reopenedCard).getByLabelText('Control Range')).toHaveValue('0');
    expect(reopenedCard.querySelector('.attached-effect-item input[type="text"]')).toHaveValue('4d6');

    // Unsupported ability remains editable after reopen: switching to a DIFFERENT creature resets to defaults
    fireEvent.click(screen.getByRole('button', { name: /Select Creatures/i }));
    clickCreatureInModal('Timber Wolf');
    clickCreatureInModal('Stone Golem');
    confirmCreatureModal();

    const savedAfterSwitch = await finalizeWizard();
    expect(savedAfterSwitch.summoningConfig.creatures).toHaveLength(1);
    assertCleanDefaults(savedAfterSwitch.summoningConfig.creatures[0], 'stone-golem');
    expect(savedAfterSwitch.summoningConfig.creatureId).toBe('stone-golem');
    expect(savedAfterSwitch.summoningConfig.quantity).toBe(1);
    expect(savedAfterSwitch.summoningConfig.controlType).toBe('verbal');
    expect(savedAfterSwitch.summoningConfig.controlRange).toBe(60);

    // Still manual after edit + switch
    expect(clientDefinitionFromWizard(savedAfterSwitch, { roomId: 'room-1' }).ok).toBe(false);
    expect(serverDefinitionFromWizard(savedAfterSwitch, { roomId: 'room-1' }).ok).toBe(false);

    // Displays cleanly as GM reference in the Spell Library card
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Spell Library/i }));
    });
    await act(async () => {
      fireEvent.keyDown(
        screen.getByRole('button', { name: `${initialSummonSpell.name} details` }),
        { key: 'Enter' }
      );
    });
    await waitFor(() => expect(screen.queryAllByText(/Stone Golem/).length).toBeGreaterThan(0));
    expect(screen.queryAllByText(/Timber Wolf/)).toHaveLength(0);

    view2.unmount();
  });
});
