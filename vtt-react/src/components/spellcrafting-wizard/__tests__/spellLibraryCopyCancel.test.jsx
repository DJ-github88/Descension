/**
 * A copied library record is independent of its source: cancelling an edit of the copy
 * leaves both the source and the copy byte-identical in library storage.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellWizardWrapper from '../SpellWizardWrapper';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../context/SpellLibraryContext';
import { SpellWizardProvider } from '../context/spellWizardContext';
import useSpellbookStore from '../../../store/spellbookStore';
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

const clone = (value) => JSON.parse(JSON.stringify(value));

const SOURCE = {
  id: 'fixture-copy-cancel-source',
  name: 'Cinder Lash',
  description: 'Immediate fire damage with a periodic burn.',
  level: 2,
  spellType: 'ACTION',
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  typeConfig: { school: 'ember', icon: 'spell_fire_fireball', tags: ['ember'] },
  damageConfig: { damageType: 'direct', formula: '2d6', elementType: 'ember', resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicFormula: '1d4',
      periodicDamageType: 'ember',
      tickRoll: 'each-tick',
      expiryPolicy: 'target-start-count',
      occurrences: 2,
      label: 'Smoulder'
    }
  },
  cooldownConfig: { cooldownType: 'authenticated_caster_start', cooldownValue: 2 },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['any'], maxTargets: 1 },
  resourceCost: { actionPoints: 1, mana: 2, components: ['verbal'] },
  categoryIds: ['offensive'],
  dateCreated: '2026-11-01T00:00:00.000Z',
  lastModified: '2026-11-01T00:00:00.000Z',
  authoredDefinitionId: '33333333-3333-4333-8333-333333333333'
};

const seed = () => {
  mockPersisted = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: { spells: [clone(SOURCE)], categories: [], collections: [], selectedSpell: null }
  };
};

let api;
function Probe() {
  api = { state: useSpellLibrary(), dispatch: useSpellLibraryDispatch() };
  return null;
}

describe('Copied spell cancellation', () => {
  beforeEach(() => {
    seed();
    showConfirm.mockReset();
  });

  afterEach(() => {
    useSpellbookStore.setState({ wizardEditRequest: null });
  });

  test('cancelling an edit of the copy leaves the source and copy unchanged', async () => {
    // Create the copy through the real library duplicate action first.
    const first = render(
      <SpellLibraryProvider>
        <Probe />
      </SpellLibraryProvider>
    );
    const source = api.state.spells[0];
    act(() => {
      api.dispatch(libraryActionCreators.duplicateSpell(source.id));
    });
    const copy = api.state.spells.find(spell => spell.name === `${source.name} (Copy)`);
    expect(copy).toBeTruthy();
    first.unmount();

    useSpellbookStore.setState({
      activeTab: 'wizard',
      wizardEditRequest: { spell: clone(copy), guard: { isCurrent: () => true }, editMode: true }
    });

    render(
      <SpellLibraryProvider>
        <SpellWizardProvider>
          <SpellWizardWrapper hideHeader={true} />
        </SpellWizardProvider>
      </SpellLibraryProvider>
    );

    const description = await screen.findByRole('textbox', { name: /Description/i });
    // Library hydration normalizes category metadata; capture the committed records before the edit.
    const before = clone(mockPersisted.data.spells);
    fireEvent.change(description, { target: { value: 'MUTATED COPY TEXT THAT MUST BE DISCARDED' } });

    showConfirm.mockResolvedValueOnce(true);
    const cancel = await screen.findByRole('button', { name: /Cancel Edit/i });
    await act(async () => {
      fireEvent.click(cancel);
    });

    await waitFor(() => {
      expect(showConfirm).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Cancel Editing',
        confirmText: 'Discard Changes',
        isDestructive: true
      }));
    });

    expect(mockPersisted.data.spells).toEqual(before);
  });
});
