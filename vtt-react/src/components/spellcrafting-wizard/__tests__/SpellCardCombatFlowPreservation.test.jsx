/**
 * Combined preservation regression for the spell-card combat-flow repair packet.
 *
 * Proves the ordinary Wizard save/reopen/Review-Update/cancel paths keep a whole-spell
 * trigger and an effect-attached trigger together, while the record remains refused whole
 * by the shared compiler.
 */
import React from 'react';
import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellwizardApp from '../SpellwizardApp';
import { SpellLibraryProvider } from '../context/SpellLibraryContext';
import { SpellWizardProvider, useSpellWizardDispatch } from '../context/spellWizardContext';
import { CreatureLibraryProvider } from '../../creature-wizard/context/CreatureLibraryContext.js';
import useSpellbookStore from '../../../store/spellbookStore';
import { showConfirm } from '../../../utils/dialogService';
import { definitionFromWizard } from '../../../services/authoredAbility';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

let mockPersisted = null;
jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: data => { mockPersisted = JSON.parse(JSON.stringify(data)); },
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

const FIXTURES = path.resolve(__dirname, 'fixtures');
const COMBINED = JSON.parse(fs.readFileSync(`${FIXTURES}/combined-whole-and-component-trigger.json`, 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));

const DispatchProbe = () => {
  const dispatch = useSpellWizardDispatch();
  React.useEffect(() => {
    window.__flowTestDispatch = dispatch;
    return () => { delete window.__flowTestDispatch; };
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

const seed = spells => {
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

const loadForEdit = async fixture => {
  await waitFor(() => expect(typeof window.handleLoadSpell).toBe('function'));
  await act(async () => {
    window.handleLoadSpell(clone(fixture), true);
  });
  await waitFor(() => expect(document.querySelector('.edit-mode-text')?.textContent?.trim()).toBe(`Editing Spell: ${fixture.name}`));
};

const goTo = async step => {
  await act(async () => {
    window.__flowTestDispatch({ type: 'SET_CURRENT_STEP', payload: step });
  });
};

const updateFromReview = async fixture => {
  const reviewSave = await screen.findByRole('button', { name: /Update Spell/i });
  await act(async () => { fireEvent.click(reviewSave); });
  await waitFor(() => expect(storedById(fixture.id).lastModified).not.toBe(fixture.lastModified));
};

const storedById = id => mockPersisted.data.spells.find(spell => spell.id === id);

beforeEach(() => {
  mockPersisted = null;
  showConfirm.mockReset();
  useSpellbookStore.setState({ activeTab: 'wizard', wizardEditRequest: null });
});

afterEach(() => {
  cleanup();
  useSpellbookStore.setState({ wizardEditRequest: null });
});

describe('combined trigger preservation through the ordinary Review path', () => {
  test('Review Update keeps the whole-spell and component-attached sections together', async () => {
    seed([COMBINED]);
    const snapshot = clone(COMBINED);
    const before = definitionFromWizard(clone(COMBINED));
    expect(before.ok).toBe(false);

    mountWizard();
    await loadForEdit(COMBINED);
    await goTo('review');
    await updateFromReview(COMBINED);

    const saved = storedById(COMBINED.id);
    expect(saved.triggerConfig.global.compoundTriggers).toHaveLength(1);
    expect(saved.triggerConfig.buffDebuffTriggers).toEqual(COMBINED.triggerConfig.buffDebuffTriggers);
    expect(saved.authoredDraft.triggerConfig.global.compoundTriggers).toHaveLength(1);
    expect(saved.authoredDraft.triggerConfig.buffDebuffTriggers).toEqual(COMBINED.triggerConfig.buffDebuffTriggers);
    expect(JSON.parse(saved.serializedData).triggerConfig.buffDebuffTriggers).toEqual(COMBINED.triggerConfig.buffDebuffTriggers);
    expect(saved.id).toBe(COMBINED.id);
    expect(saved.dateCreated).toBe(COMBINED.dateCreated);
    expect(saved.authoredDefinitionId).toBe(COMBINED.authoredDefinitionId);
    expect(definitionFromWizard(saved).ok).toBe(false);
    expect(definitionFromWizard(saved).reason).toMatch(/triggers/);
    expect(COMBINED).toEqual(snapshot);
  });

  test('save then reopen still shows both trigger sections in the Review preview', async () => {
    seed([COMBINED]);
    mountWizard();
    await loadForEdit(COMBINED);
    await goTo('review');
    await updateFromReview(COMBINED);

    const saved = storedById(COMBINED.id);
    await loadForEdit(saved);
    await goTo('review');

    await waitFor(() => expect(document.querySelector('.pf-spell-card')?.textContent).toContain('Spell Triggers'));
    const text = document.querySelector('.pf-spell-card').textContent;
    expect(text).toContain('Whole spell');
    expect(text).toContain('If my health is below 50%');
    expect(text).toContain('Trigger Chain');
    expect(text).toContain('Damage component → restoration');
    expect(text).toContain('If I take 5 pts of damage');
    expect(document.querySelectorAll('[data-trigger-disclosure="manual"]').length).toBeGreaterThanOrEqual(2);
  });

  test('Cancel Edit leaves the combined stored source byte-identical', async () => {
    seed([COMBINED]);
    const beforeSnapshot = JSON.stringify(mockPersisted.data.spells[0]);

    mountWizard();
    await loadForEdit(COMBINED);
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
