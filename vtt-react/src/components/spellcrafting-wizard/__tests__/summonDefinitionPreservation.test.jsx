/**
 * Summon-definition preservation (summoningConfig / summonConfig).
 *
 * Production path under test (no hand-written serializer, no direct store insertion of the result):
 *   library record -> spellbookStore.wizardEditRequest (the real library->Wizard handoff)
 *   -> SpellwizardApp.handleLoadSpell -> Wizard state -> "Finalize" (real handleSaveSpell)
 *   -> SpellLibraryContext UPDATE_SPELL -> libraryManager save -> reopen -> Finalize again
 *   -> real SpellLibrary projection (mapSpellToUnifiedFormat) -> real UnifiedSpellCard.
 *
 * Only persistence (in-memory stand-in for scoped storage), Firebase and icon assets are replaced.
 * All records are disposable fixtures; nothing touches a real user library.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// jsdom lacks the browser Web Crypto global the production save uses for authored-draft ids.
if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

let mockPersisted = null;
// Plain functions (not jest.fn): CRA's resetMocks would wipe jest.fn implementations before each test.
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

import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import SummoningEffects from '../data/effects/SummoningEffects';
import { actionCreators } from '../context/spellWizardContext';

// A rich definition containing the fields the Summoning controls genuinely emit
// (SummoningEffects.jsx: creatures[] with per-creature config, duration/concentration/quantity/control fields).
const richConfig = (creatureName, creatureId, extra = {}) => ({
  creatures: [{
    id: creatureId,
    name: creatureName,
    size: 'Medium',
    type: 'Spirit',
    description: `${creatureName} fixture creature`,
    stats: { maxHp: 31, maxMana: 7, maxAp: 5 },
    config: {
      quantity: 2, duration: 15, durationUnit: 'rounds', hasDuration: true,
      concentration: true, controlType: 'mental', controlRange: 30
    }
  }],
  duration: 15, durationUnit: 'rounds', hasDuration: true, concentration: true,
  quantity: 2, maxQuantity: 4, controlRange: 30, controlType: 'mental',
  difficultyLevel: 'hard', waitForTrigger: true, creatureId, formula: '1d6',
  ...extra
});

const base = (id, name) => ({
  id, name, description: 'Disposable summon fixture', level: 2, spellType: 'ACTION',
  effectTypes: ['summoning'], effectsMap: { summoning: true },
  typeConfig: { school: 'arcane', icon: 'spell_holy_holybolt', tags: [] },
  dateCreated: '2026-01-01T00:00:00.000Z', lastModified: '2026-01-01T00:00:00.000Z',
  categoryIds: ['uncategorized'],
  unrelatedSentinel: { keep: 'me' }
});

const WOLF = richConfig('Spirit Wolf', 'spirit-wolf');
const GOLEM_OLD = richConfig('Stone Golem', 'stone-golem');

const FIXTURES = {
  modern: { ...base('fx-modern', 'Fixture Modern'), summoningConfig: WOLF },
  legacy: { ...base('fx-legacy', 'Fixture Legacy'), summonConfig: WOLF },
  // Both names, different payloads: summoningConfig is the established winner
  // (SpellwizardApp reopen, spellNormalizer, UnifiedSpellCard, Step10Review).
  conflict: { ...base('fx-conflict', 'Fixture Conflict'), summoningConfig: WOLF, summonConfig: GOLEM_OLD }
};

const seedLibrary = (spell) => {
  mockPersisted = {
    version: 1,
    timestamp: '2026-01-01T00:00:00.000Z',
    data: { spells: [JSON.parse(JSON.stringify(spell))], categories: [], collections: [], selectedSpell: null }
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
  useSpellbookStore.setState({ wizardEditRequest: { spell: JSON.parse(JSON.stringify(spell)), guard: { isCurrent: () => true } } });
  return mountProductionRaw();
};

const finalize = async () => {
  const before = JSON.stringify(mockPersisted);
  await act(async () => { fireEvent.click(screen.getByTitle(/Finalize/i)); });
  await waitFor(() => expect(JSON.stringify(mockPersisted)).not.toBe(before));
  return mockPersisted.data.spells[0];
};

describe.each(Object.keys(FIXTURES))('summon definition preservation: %s record', (kind) => {
  const fixture = FIXTURES[kind];
  beforeEach(() => { mockPersisted = null; });
  afterEach(() => { useSpellbookStore.setState({ wizardEditRequest: null }); });

  // Timestamps legitimately move on every save; everything else must be identical.
  const strip = (v) => JSON.parse(JSON.stringify(v, (k, x) => (k === 'lastModified' || k === 'lastSaved' ? undefined : x)));
  const summonView = (r) => ({ id: r.id, name: r.name, unrelatedSentinel: r.unrelatedSentinel, summoningConfig: r.summoningConfig, summonConfig: r.summonConfig });

  const reopenAndFinalize = async (view) => {
    view.unmount();
    const reopened = JSON.parse(JSON.stringify(mockPersisted.data.spells[0]));
    useSpellbookStore.setState({ wizardEditRequest: { spell: reopened, guard: { isCurrent: () => true } } });
    const next = mountProductionRaw();
    return { view: next, saved: await finalize() };
  };

  it('save keeps the payload, stable id and unrelated fields; repeated no-op saves change nothing', async () => {
    const view1 = mountProduction(fixture);
    const first = await finalize();

    expect(first.id).toBe(fixture.id);
    expect(first.unrelatedSentinel).toEqual({ keep: 'me' });
    // The Wizard restores the payload under the name it owns.
    expect(first.summoningConfig).toEqual(fixture.summoningConfig || fixture.summonConfig);
    // The alternate-name payload is preserved exactly (never merged, replaced or dropped).
    expect(first.summonConfig).toEqual(fixture.summonConfig);

    const { view: view2, saved: second } = await reopenAndFinalize(view1);
    const { saved: third } = await reopenAndFinalize(view2);
    // Summon-relevant fields never move across repeated no-op saves ...
    expect(summonView(second)).toEqual(summonView(first));
    expect(summonView(third)).toEqual(summonView(first));
    // ... and once the first save has normalised unrelated Wizard defaults, a further no-op save is byte-stable.
    expect(strip(third)).toEqual(strip(second));
  });

  it('library card shows the established-precedence payload', async () => {
    mountProduction(fixture);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /Spell Library/i })); });
    // Select the library row: the detail view renders the real UnifiedSpellCard from the library projection.
    await act(async () => { fireEvent.keyDown(screen.getByRole('button', { name: `${fixture.name} details` }), { key: 'Enter' }); });
    await waitFor(() => expect(screen.queryAllByText(/Spirit Wolf/).length).toBeGreaterThan(0));
    expect(screen.queryAllByText(/Stone Golem/)).toHaveLength(0);
  });
});

describe('real Summoning controls restore a rich definition without altering it', () => {
  it('mounting the production control on a saved summoningConfig re-emits an identical payload', () => {
    const dispatch = jest.fn();
    render(
      <CreatureLibraryProvider><SpellLibraryProvider>
        <SummoningEffects
          state={{ summoningConfig: JSON.parse(JSON.stringify(WOLF)) }}
          dispatch={dispatch}
          actionCreators={actionCreators}
          getDefaultFormula={() => '1d6'}
        />
      </SpellLibraryProvider></CreatureLibraryProvider>
    );
    const emitted = dispatch.mock.calls.map(([a]) => a).filter(a => /SUMM/i.test(a.type));
    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[emitted.length - 1].payload).toEqual(WOLF);
  });
});
