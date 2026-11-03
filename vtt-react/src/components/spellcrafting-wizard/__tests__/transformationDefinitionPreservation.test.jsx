/**
 * Transformation-definition preservation (transformationConfig / legacy transformConfig).
 *
 * Production path under test (no hand-written serializer, no direct store insertion of the result):
 *   library record -> spellbookStore.wizardEditRequest -> SpellwizardApp.handleLoadSpell -> Wizard state
 *   -> "Finalize" (real handleSaveSpell) -> SpellLibraryContext UPDATE_SPELL -> libraryManager save
 *   -> reopen -> Finalize again -> real SpellLibrary projection -> real UnifiedSpellCard.
 * The production TransformationEffects control is mounted inside the real SpellWizardProvider reducer.
 *
 * Only persistence (in-memory stand-in for scoped storage), Firebase and icon assets are replaced.
 * All records are disposable fixtures; nothing touches a real user library.
 * Transformation is authoring/display only: no stats, equipment, HP, token or duration execution is exercised.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import {
  SpellWizardProvider, useSpellWizardState, useSpellWizardDispatch, actionCreators
} from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import useCreatureStore from '../../../store/creatureStore';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import TransformationEffects from '../data/effects/TransformationEffects';

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

const clone = (v) => JSON.parse(JSON.stringify(v));

// Fields the Transformation controls genuinely emit (TransformationEffects.jsx), plus a manual
// field the controls never touch (must survive untouched).
const CUSTOM = {
  isCustom: true, transformType: 'beast_form', transformationType: 'physical',
  newForm: 'Dire Bear Aspect', description: 'Fur, claws and a roar.', power: 'strong',
  targetType: 'unwilling', saveType: 'con', difficultyClass: 18, difficultyCr: 'hard',
  duration: 3, durationUnit: 'rounds', concentration: false, maintainEquipment: false,
  grantedAbilities: [{ id: 'custom_ability_1', name: 'Rend', description: 'Rake for extra harm.', icon: 'Nature/Transform Bear' }],
  formula: '1d6', manualNote: { gmAdjudicates: 'size and gear effects' }
};
const OLD_CUSTOM = { ...CUSTOM, newForm: 'Old Stag Form', power: 'weak', grantedAbilities: [] };
const CREATURE = {
  isCustom: false, transformType: 'beast_form', formId: 'moon-wolf',
  selectedCreature: { id: 'moon-wolf', name: 'Moon Wolf', size: 'Medium', type: 'Beast', description: 'Silver-furred hunter.', stats: { maxHp: 31, maxMana: 7, maxAp: 5 } },
  targetType: 'willing', duration: 2, durationUnit: 'hours', concentration: true,
  maintainEquipment: true, retainsAbilities: false, difficultyClass: 15, difficultyCr: 'moderate',
  saveType: 'spirit', grantedAbilities: [], formula: '1d6', manualNote: { keep: 'me' }
};
// Legitimate older shape: no transformType key at all.
const LEGACY_NO_TYPE = (() => {
  const c = clone(CREATURE); delete c.transformType;
  c.grantedAbilities = [{ id: 'g1', name: 'Night Eyes', description: 'See in the dark.' }];
  return c;
})();

const base = (id, name) => ({
  id, name, description: 'Disposable transformation fixture', level: 2, spellType: 'ACTION',
  effectTypes: ['transformation'], effectsMap: { transformation: true },
  typeConfig: { school: 'arcane', icon: 'spell_holy_holybolt', tags: [] },
  dateCreated: '2026-01-01T00:00:00.000Z', lastModified: '2026-01-01T00:00:00.000Z',
  categoryIds: ['uncategorized'], unrelatedSentinel: { keep: 'me' }
});

const FIXTURES = {
  modern: { ...base('fx-modern', 'Fixture Modern'), transformationConfig: CUSTOM },
  creature: { ...base('fx-creature', 'Fixture Creature'), transformationConfig: CREATURE },
  legacy: { ...base('fx-legacy', 'Fixture Legacy'), transformConfig: CUSTOM },
  // Both names, different payloads: transformationConfig is the established winner
  // (SpellwizardApp reopen, spellNormalizer, UnifiedSpellCard).
  conflict: { ...base('fx-conflict', 'Fixture Conflict'), transformationConfig: CUSTOM, transformConfig: OLD_CUSTOM }
};
const CARD_TEXT = { modern: /Dire Bear Aspect/, creature: /Transform into Moon Wolf/, legacy: /Dire Bear Aspect/, conflict: /Dire Bear Aspect/ };

const seedLibrary = (spell) => {
  mockPersisted = { version: 1, timestamp: '2026-01-01T00:00:00.000Z',
    data: { spells: [clone(spell)], categories: [], collections: [], selectedSpell: null } };
};
const mountProductionRaw = () => render(
  <SpellLibraryProvider><SpellWizardProvider><SpellWizardWrapper /></SpellWizardProvider></SpellLibraryProvider>
);
const mountProduction = (spell) => {
  seedLibrary(spell);
  useSpellbookStore.setState({ wizardEditRequest: { spell: clone(spell), guard: { isCurrent: () => true } } });
  return mountProductionRaw();
};
const finalize = async () => {
  const before = JSON.stringify(mockPersisted);
  await act(async () => { fireEvent.click(screen.getByTitle(/Finalize/i)); });
  await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(before));
  return mockPersisted.data.spells[0];
};

describe.each(Object.keys(FIXTURES))('transformation definition preservation: %s record', (kind) => {
  const fixture = FIXTURES[kind];
  beforeEach(() => { mockPersisted = null; });
  afterEach(() => { useSpellbookStore.setState({ wizardEditRequest: null }); });

  const strip = (v) => JSON.parse(JSON.stringify(v, (k, x) => (k === 'lastModified' || k === 'lastSaved' ? undefined : x)));
  const view = (r) => ({ id: r.id, name: r.name, unrelatedSentinel: r.unrelatedSentinel,
    transformationConfig: r.transformationConfig, transformConfig: r.transformConfig });

  const reopenAndFinalize = async (prev) => {
    prev.unmount();
    useSpellbookStore.setState({ wizardEditRequest: { spell: clone(mockPersisted.data.spells[0]), guard: { isCurrent: () => true } } });
    const next = mountProductionRaw();
    return { next, saved: await finalize() };
  };

  it('save keeps payload, stable id and unrelated fields; repeated no-op saves change nothing', async () => {
    const v1 = mountProduction(fixture);
    const first = await finalize();
    expect(first.id).toBe(fixture.id);
    expect(first.unrelatedSentinel).toEqual({ keep: 'me' });
    expect(first.transformationConfig).toEqual(fixture.transformationConfig || fixture.transformConfig);
    // The alternate-name payload is preserved exactly (never merged, replaced or dropped).
    expect(first.transformConfig).toEqual(fixture.transformConfig);

    const { next: v2, saved: second } = await reopenAndFinalize(v1);
    const { saved: third } = await reopenAndFinalize(v2);
    expect(view(second)).toEqual(view(first));
    expect(view(third)).toEqual(view(first));
    expect(strip(third)).toEqual(strip(second));
  });

  it('library card shows the established-precedence payload', async () => {
    mountProduction(fixture);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Spell Library/i })); });
    await act(async () => { fireEvent.keyDown(screen.getByRole('button', { name: `${fixture.name} details` }), { key: 'Enter' }); });
    await waitFor(() => expect(screen.queryAllByText(CARD_TEXT[kind]).length).toBeGreaterThan(0));
    expect(screen.queryAllByText(/Old Stag Form/)).toHaveLength(0);
  });
});

describe('legacy record carrying only transformConfig (no effectTypes) still shows on the library card', () => {
  beforeEach(() => { mockPersisted = null; });
  afterEach(() => { useSpellbookStore.setState({ wizardEditRequest: null }); });
  it('library projection falls back to transformConfig', async () => {
    const bare = { ...base('fx-bare', 'Fixture Bare Legacy'), transformConfig: CUSTOM };
    delete bare.effectTypes; delete bare.effectsMap;
    mountProduction(bare);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Spell Library/i })); });
    await act(async () => { fireEvent.keyDown(screen.getByRole('button', { name: 'Fixture Bare Legacy details' }), { key: 'Enter' }); });
    await waitFor(() => expect(screen.queryAllByText(/Dire Bear Aspect/).length).toBeGreaterThan(0));
    expect(mockPersisted.data.spells[0].transformConfig).toEqual(CUSTOM);
  });
});

// Production control inside the real reducer.
let probe;
const Harness = ({ initial }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => { dispatch(actionCreators.loadSpell({ effectTypes: ['transformation'], transformationConfig: clone(initial) })); setReady(true); }, []); // eslint-disable-line
  probe = state;
  return ready ? (
    <TransformationEffects state={state} dispatch={dispatch} actionCreators={actionCreators} getDefaultFormula={() => '1d6'} />
  ) : null;
};
const mountControl = async (cfg) => {
  let r;
  await act(async () => {
    r = render(<CreatureLibraryProvider><SpellLibraryProvider><SpellWizardProvider><Harness initial={cfg} /></SpellWizardProvider></SpellLibraryProvider></CreatureLibraryProvider>);
  });
  return r;
};

describe('real Transformation controls restore a saved definition without altering it', () => {
  it.each([['custom', CUSTOM], ['creature', CREATURE]])('mounting on a %s definition leaves the payload identical', async (_n, cfg) => {
    await mountControl(cfg);
    expect(probe.transformationConfig).toEqual(cfg);
  });

  it('a legacy definition without transformType keeps its form and granted abilities on mount', async () => {
    await mountControl(LEGACY_NO_TYPE);
    expect(probe.transformationConfig.formId).toBe(LEGACY_NO_TYPE.formId);
    expect(probe.transformationConfig.selectedCreature).toEqual(LEGACY_NO_TYPE.selectedCreature);
    expect(probe.transformationConfig.grantedAbilities).toEqual(LEGACY_NO_TYPE.grantedAbilities);
    expect(probe.transformationConfig.manualNote).toEqual(LEGACY_NO_TYPE.manualNote);
  });

  it('controls show the saved custom values and editing one field changes only that field', async () => {
    await mountControl(CUSTOM);
    expect(screen.getByDisplayValue('Dire Bear Aspect')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fur, claws and a roar.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18')).toBeInTheDocument();
    const target = screen.getByDisplayValue('Unwilling Creature');
    await act(async () => { fireEvent.change(target, { target: { value: 'willing' } }); });
    expect(probe.transformationConfig).toEqual({ ...CUSTOM, targetType: 'willing' });
  });

  it('valid false/zero-like values are not replaced by control defaults when another field is edited', async () => {
    await mountControl(CREATURE);
    const unit = screen.getByDisplayValue('Hours');
    await act(async () => { fireEvent.change(unit, { target: { value: 'rounds' } }); });
    const next = probe.transformationConfig;
    expect(next.durationUnit).toBe('rounds');
    expect(next.maintainEquipment).toBe(true);
    expect(next.retainsAbilities).toBe(false);
    expect(next.concentration).toBe(true);
    expect(next.selectedCreature).toEqual(CREATURE.selectedCreature);
    expect(next.formId).toBe('moon-wolf');
  });

  it('choosing a creature through the control sets both formId and selectedCreature without overwriting formId', async () => {
    const testCreature = {
      id: 'dire-wolf',
      name: 'Dire Wolf',
      size: 'large',
      type: 'beast',
      description: 'A large wolf.',
      tags: [],
      stats: { maxHp: 45, maxMana: 0, maxAp: 4 }
    };
    useCreatureStore.setState({ creatures: [testCreature] });
    await mountControl({
      isCustom: false,
      transformType: 'beast_form',
      formId: null,
      selectedCreature: null
    });
    // Open creature selection window
    const selectBtn = screen.getByRole('button', { name: /Select from Creature Library/i });
    await act(async () => {
      fireEvent.click(selectBtn);
    });
    // Click on the creature
    const creatureCard = screen.getByText('Dire Wolf');
    await act(async () => {
      fireEvent.click(creatureCard);
    });
    // Verify probe.transformationConfig
    expect(probe.transformationConfig.selectedCreature.id).toBe('dire-wolf');
    expect(probe.transformationConfig.formId).toBe('dire-wolf');

    // Removing the creature clears both formId and selectedCreature atomically
    const removeBtn = screen.getByTitle('Remove transformation target');
    await act(async () => {
      fireEvent.click(removeBtn);
    });
    expect(probe.transformationConfig.formId).toBeNull();
    expect(probe.transformationConfig.selectedCreature).toBeNull();
  });
});
