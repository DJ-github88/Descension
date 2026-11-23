import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { loadLibraryFromStorage } from '../../../core/utils/libraryManager';
import { loadCustomSpells } from '../../../../../persistence/spellLibraryScopedStorage';
import ExternalLivePreview from '../../../ExternalLivePreview';
import Step10Review from '../../steps/Step10Review';
import SpellLibrary from '../../library/SpellLibrary';
import UnifiedSpellCard from '../UnifiedSpellCard';
import { SpellLibraryProvider } from '../../../context/SpellLibraryContext';
import { draftSubject } from '../../../utils/executionCompatibility';
import useSpellbookStore from '../../../../../store/spellbookStore';

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => null;
}

let mockWizardState = null;

jest.mock('../../../context/spellWizardContext', () => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  return {
    ...actual,
    useSpellWizardState: () => mockWizardState || {},
    useSpellWizardDispatch: () => jest.fn(),
    validateStepCompletion: () => true
  };
});

jest.mock('../../../core/utils/libraryManager', () => {
  const actual = jest.requireActual('../../../core/utils/libraryManager');
  const buildDefault = () => ({ ...actual.getDefaultLibrary(), spells: [] });
  return {
    ...actual,
    getDefaultLibrary: jest.fn(buildDefault),
    loadLibraryFromStorage: jest.fn(buildDefault),
    saveLibraryToStorage: jest.fn(() => true),
    generateUniqueId: () => 'id-parity-1'
  };
});

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadCustomSpells: jest.fn(() => []),
  saveCustomSpells: jest.fn(),
  loadDeletedSpellIds: () => [],
  saveDeletedSpellIds: jest.fn()
}));

jest.mock('../../../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([]),
  saveUserSpell: () => Promise.resolve({ success: true })
}));

jest.mock('../../../../../hooks/useClassSpellLibrary', () => ({
  useClassSpellLibrary: () => ({
    spellCategories: [],
    characterClass: 'hunter',
    activeCharacter: null,
    isLoading: false,
    error: null,
    classSpells: [],
    getAllSpells: () => [],
    getSpellsByCategory: () => [],
    getCategoryInfo: () => null,
    removeCustomSpell: jest.fn(),
    addCustomSpell: jest.fn(),
    hasActiveCharacter: false,
    hasClassSpells: false
  })
}));

jest.mock('../../../../../hooks/useWeaponEnhancedSpells', () => ({
  useWeaponEnhancedSpells: () => ({ enhancedSpells: [], rawSpells: [] })
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: i => `m/${i}.png`,
  getAbilityIconUrl: i => `m/${i}.png`,
  getCustomIconUrl: i => `m/${i}.png`
}));

jest.mock('../SpellTooltip', () => () => <div />);
jest.mock('../../../../../services/effectProcessingService', () => ({
  processOverTimeEffectsForTarget: jest.fn()
}));

jest.mock('../../../../../store/authStore', () => {
  const state = { user: { uid: 'parity-user', displayName: 'GM' } };
  const useAuthStore = sel => (typeof sel === 'function' ? sel(state) : state);
  useAuthStore.getState = () => state;
  return { __esModule: true, default: useAuthStore };
});

const clean = s => String(s || '').replace(/\s+/g, ' ').trim();

const QUICK_DRAW_FIELDS = {
  id: 'spell-qd',
  name: 'Quick Draw',
  description: 'Draw and fire one light weapon at an enemy within 30 ft.',
  spellType: 'ACTION',
  typeConfig: { school: 'stabbing', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage'],
  damageConfig: { damageType: 'direct', elementType: 'stabbing', formula: '1d6', resolution: 'DICE' },
  targetingMode: 'unified',
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    maxTargets: 1,
    selectionMethod: 'manual',
    targetSelectionMethod: 'manual',
    targetRestrictions: ['enemy']
  },
  resourceCost: {
    actionPoints: 1,
    resourceTypes: ['mana'],
    resourceValues: { mana: 0 }
  },
  mechanicsConfig: {
    hunterFlow: {
      enabled: true,
      ruleset: 'checkpoint-25-flow',
      abilityKind: 'flow_eligible',
      baseEffectSummary: '1d6 stabbing damage on a hit',
      flowBonusSummary: '+2 stabbing damage on a hit',
      companionShared: true
    }
  }
};

const EMBER_BOLT_FIELDS = {
  id: 'spell-eb',
  name: 'Ember Bolt',
  description: 'Hurl a bolt of ember at an enemy within 30 ft.',
  spellType: 'ACTION',
  typeConfig: { school: 'ember', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage'],
  damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6', resolution: 'DICE' },
  targetingMode: 'unified',
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    maxTargets: 1,
    selectionMethod: 'manual',
    targetSelectionMethod: 'manual',
    targetRestrictions: ['enemy']
  },
  resourceCost: {
    actionPoints: 1,
    resourceTypes: ['mana'],
    resourceValues: { mana: 15 }
  }
};

const LOWEST_HP_FIELDS = {
  id: 'spell-blight',
  name: 'Blight Bolt',
  description: 'Strike the weakest enemy in range.',
  spellType: 'ACTION',
  typeConfig: { school: 'blight', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage', 'control'],
  damageConfig: { damageType: 'direct', elementType: 'blight', formula: '1d8', resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'stunned',
      expiryPolicy: 'gm-manual',
      durationText: 'Until shaken off',
      gmNote: 'GM removes'
    }
  },
  targetingMode: 'unified',
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    maxTargets: 1,
    selectionMethod: 'lowest_health',
    targetSelectionMethod: 'lowest_health',
    targetRestrictions: ['enemy']
  },
  resourceCost: {
    actionPoints: 1,
    resourceTypes: ['mana'],
    resourceValues: { mana: 3 }
  }
};

const UNSUPPORTED_PASSIVE_FIELDS = {
  id: 'spell-passive-generic',
  name: 'Aura of Warmth',
  description: 'Grants warmth.',
  spellType: 'PASSIVE',
  effectTypes: ['buff'],
  buffConfig: { durationValue: 1, durationType: 'rounds', statModifiers: [{ stat: 'armor', value: 2 }] },
  targetingConfig: { targetingType: 'self', rangeType: 'self_centered', rangeDistance: 0 }
};

let initialWizardState;
beforeAll(() => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  const Capture = () => { initialWizardState = actual.useSpellWizardState(); return null; };
  render(<actual.SpellWizardProvider><Capture /></actual.SpellWizardProvider>);
});

afterEach(() => {
  cleanup();
  mockWizardState = null;
  const emptyLib = { ...jest.requireActual('../../../core/utils/libraryManager').getDefaultLibrary(), spells: [] };
  loadLibraryFromStorage.mockReturnValue(emptyLib);
  loadCustomSpells.mockReturnValue([]);
  useSpellbookStore.setState({ activeTab: 'library' });
});

function renderPreviewAndReview(fields) {
  mockWizardState = { ...initialWizardState, ...JSON.parse(JSON.stringify(fields)) };
  useSpellbookStore.setState({ activeTab: 'wizard' });

  const f = render(<SpellLibraryProvider><ExternalLivePreview /></SpellLibraryProvider>);
  const floatingText = clean(document.body.querySelector('.adventurer-preview .pf-spell-card')?.textContent);
  f.unmount();

  const r = render(<SpellLibraryProvider><Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} /></SpellLibraryProvider>);
  const reviewText = clean(r.container.querySelector('.review-spell-preview .pf-spell-card')?.textContent);
  const compatState = r.container.querySelector('.exec-compat')?.getAttribute('data-state');
  r.unmount();

  return { floatingText, reviewText, compatState };
}

describe('Cross-surface spell card parity & manual targeting label clarity', () => {
  test('Quick Draw matches across Floating Preview, Step 10 Review, and Library detail overlay with 0 mana preserved and no Manual badge', () => {
    const { floatingText, reviewText, compatState } = renderPreviewAndReview(QUICK_DRAW_FIELDS);
    const savedQd = { ...draftSubject(QUICK_DRAW_FIELDS), id: 'spell-qd', authoredDefinitionId: '00000000-0000-4000-8000-000000000001' };
    const seededLib = { ...jest.requireActual('../../../core/utils/libraryManager').getDefaultLibrary(), spells: [savedQd] };
    loadLibraryFromStorage.mockReturnValue(seededLib);
    loadCustomSpells.mockReturnValue([savedQd]);
    const lib = render(<SpellLibraryProvider><SpellLibrary /></SpellLibraryProvider>);
    fireEvent.keyDown(lib.getByRole('button', { name: 'Quick Draw details' }), { key: 'Enter' });
    const libraryDetailText = clean(document.body.querySelector('.spell-detail-overlay .pf-spell-card')?.textContent);
    lib.unmount();

    const expectedCardText =
      'Quick DrawStabbing1APACTION30 ftSingle Target - EnemiesDraw and fire one light weapon at an enemy within 30 ft.' +
      'Prism-supportedStructurally compatible with a Prism route.' +
      'Static rule summary: Live room admission, GM pairing, and current resources are checked at cast time.' +
      'ACTIVATE1 AP, 0 mana, hunterFlow class cost · 1 creature (enemy), 30 ft' +
      'DODeal 1d6 stabbing damage' +
      'FLOW CHECK (2d6 · QUICK DRAW)Base: 1d6 stabbing damage on a hit · Flow bonus: +2 stabbing damage on a hit' +
      'Natural doubles (d1 = d2): Activates printed Flow bonus (+2 stabbing damage on a hit) and raises shared Flow +1 (cap 4).' +
      'Difference ≤ pre-roll Flow (non-doubles): Activates printed Flow bonus (+2 stabbing damage on a hit) and maintains shared Flow.' +
      'Difference > pre-roll Flow: Ordinary effect only (1d6 stabbing damage on a hit); lowers shared Flow −1 (floor 1).' +
      'Normal hit, save, and critical resolution still applies (natural doubles do not automatically critical; a miss never deals damage).' +
      'Hunter and bonded companion share Flow (1–4). Damage taken, stun, and movement never lower or reset Flow.' +
      'Approved Quick Draw slice (D-S1–D-S3): one 2d6 check per committed action including misses; resets to 1 at encounter end.' +
      'Instant Damage1d6 Stabbing Damagedamage';

    expect(compatState).toBe('executable');
    expect(floatingText).toBe(expectedCardText);
    expect(reviewText).toBe(expectedCardText);
    expect(libraryDetailText).toBe(expectedCardText);
    expect(floatingText).not.toContain('25Mana');
    expect(floatingText).not.toContain('Single Target (Manual)');
    expect(floatingText).not.toContain('Manual / stored only');
    expect(floatingText).not.toContain('FLOW CHECK (2d6 · MANUAL)');
  });

  test('Ember Bolt (1 AP, 15 mana, default manual targeting) matches across Floating Preview and Step 10 Review with nonzero mana shown once', () => {
    const { floatingText, reviewText, compatState } = renderPreviewAndReview(EMBER_BOLT_FIELDS);

    const expectedCardText =
      'Ember BoltEmber15Mana1APACTION30 ftSingle Target - EnemiesHurl a bolt of ember at an enemy within 30 ft.' +
      'Prism-supportedStructurally compatible with a Prism route.' +
      'Static rule summary: Live room admission, GM pairing, and current resources are checked at cast time.' +
      'ACTIVATE1 AP, 15 mana · 1 creature (enemy), 30 ft' +
      'DODeal 2d6 ember damage' +
      'Instant Damage2d6 Ember Damagedamage';

    expect(compatState).toBe('executable');
    expect(floatingText).toBe(expectedCardText);
    expect(reviewText).toBe(expectedCardText);
    expect(floatingText.match(/15Mana/g)).toHaveLength(1);
    expect(floatingText).not.toContain('25Mana');
    expect(floatingText).not.toContain('Single Target (Manual)');
  });

  test('Unchanged control case: non-manual targeting methods keep their explicit selection qualifier', () => {
    const { floatingText, reviewText, compatState } = renderPreviewAndReview(LOWEST_HP_FIELDS);
    expect(compatState).toBe('partial');
    expect(floatingText).toContain('Single Target (Lowest HP) - Enemies');
    expect(reviewText).toContain('Single Target (Lowest HP) - Enemies');
    expect(floatingText).toContain('Partially automated');
    expect(reviewText).toContain('Partially automated');

    for (const [method, expectedLabel] of [
      ['nearest', 'Single Target (Nearest) - Enemies'],
      ['farthest', 'Single Target (Farthest) - Enemies'],
      ['highest_health', 'Single Target (Highest HP) - Enemies'],
      ['random', 'Single Target (Random) - Enemies']
    ]) {
      const { container, unmount } = render(
        <SpellLibraryProvider>
          <UnifiedSpellCard
            spell={{
              ...EMBER_BOLT_FIELDS,
              targetingConfig: { ...EMBER_BOLT_FIELDS.targetingConfig, selectionMethod: method, targetSelectionMethod: method }
            }}
            variant="wizard"
          />
        </SpellLibraryProvider>
      );
      expect(clean(container.textContent)).toContain(expectedLabel);
      unmount();
    }
  });

  test('Unchanged control case: draft with no working combat path stays Manual / stored only across previews', () => {
    const { floatingText, reviewText, compatState } = renderPreviewAndReview(UNSUPPORTED_PASSIVE_FIELDS);
    expect(compatState).toBe('unsupported');
    expect(floatingText).toContain('Manual / stored only');
    expect(floatingText).toContain('STOREDPASSIVE ability — not auto-activated by Prism');
    expect(reviewText).toContain('Manual / stored only');
    expect(reviewText).toContain('STOREDPASSIVE ability — not auto-activated by Prism');
    expect(floatingText).not.toContain('Prism-supported');
    expect(reviewText).not.toContain('Prism-supported');
  });
});
