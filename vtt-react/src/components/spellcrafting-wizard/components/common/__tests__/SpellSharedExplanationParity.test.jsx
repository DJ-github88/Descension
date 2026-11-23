import React from 'react';
import { render, fireEvent, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Step10Review from '../../steps/Step10Review';
import SpellLibrary from '../../library/SpellLibrary';
import SpellCardWithProcs from '../SpellCardWithProcs';
import UnifiedSpellCard from '../UnifiedSpellCard';
import { saveDisclosureForRecord } from '../spellSavePresentation';
import { triggerDisclosureForRecord } from '../spellTriggerPresentation';
import { SpellLibraryProvider } from '../../../context/SpellLibraryContext';
import { getDefaultLibrary } from '../../../core/utils/libraryManager';
import { draftSubject, explainExecution, STATES } from '../../../utils/executionCompatibility';
import { definitionFromWizard, EFFECT_CAPABILITY, FOLLOWUP_TRIGGER_ID, CRIT_GATE_TRIGGER_ID } from '../../../../../services/authoredAbility';
import { buildSpellBehaviorModel } from '../spellBehaviorPresentation';
import useGameStore from '../../../../../store/gameStore';
import useSpellbookStore from '../../../../../store/spellbookStore';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => null;
}

let mockWizardState = null;
let mockPersisted = null;

jest.mock('../../../context/spellWizardContext', () => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  return {
    ...actual,
    useSpellWizardState: () => mockWizardState || {},
    useSpellWizardDispatch: () => jest.fn(),
    validateStepCompletion: () => true
  };
});

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => { mockPersisted = JSON.parse(JSON.stringify(data)); },
  loadCustomSpells: jest.fn(() => []),
  saveCustomSpells: jest.fn(),
  loadDeletedSpellIds: jest.fn(() => []),
  saveDeletedSpellIds: jest.fn()
}));

jest.mock('../../../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([]),
  saveUserSpell: () => Promise.resolve({ success: true })
}));

jest.mock('../../../../../hooks/useClassSpellLibrary', () => ({
  useClassSpellLibrary: () => ({
    spellCategories: [],
    characterClass: 'arcanoneer',
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

jest.mock('../../../../../store/characterStore', () => {
  const state = {
    characters: [],
    currentCharacterId: null,
    activeCharacterId: null,
    currentCharacter: { stats: { intelligence: 16 } }
  };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  useCharacterStore.subscribe = () => () => {};
  return { __esModule: true, default: useCharacterStore };
});

jest.mock('../../../../../store/authStore', () => {
  const state = { user: { uid: 'parity-user', displayName: 'Player' } };
  const useAuthStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useAuthStore.getState = () => state;
  return { __esModule: true, default: useAuthStore };
});

jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: (i) => `m/${i}.png`,
  getAbilityIconUrl: (i) => `m/${i}.png`,
  getCustomIconUrl: (i) => `m/${i}.png`
}));

jest.mock('../SpellTooltip', () => () => <div />);
jest.mock('../../../../../services/effectProcessingService', () => ({
  processOverTimeEffectsForTarget: jest.fn()
}));

const clone = (v) => JSON.parse(JSON.stringify(v));
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const DEF_ID = '33333333-3333-4333-8333-333333333333';

function wrapSaved(draft, id) {
  const cleanDraft = clone(draft);
  return {
    ...cleanDraft,
    id,
    source: 'wizard',
    isCustom: true,
    authoredDefinitionId: DEF_ID,
    authoredDraft: cleanDraft,
    serializedData: JSON.stringify(cleanDraft, null, 2)
  };
}

const FROSTBITE_TETHER_DRAFT = {
  name: 'Frostbite Tether',
  description: 'Deals direct rime damage and slows the target unless it makes a Constitution save.',
  spellType: 'ACTION',
  typeConfig: { school: 'rime', castTimeType: 'IMMEDIATE', icon: 'Frost/Dripping Ice' },
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d8+3', resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: EFFECT_CAPABILITY,
      effect: 'movement',
      movementFeet: -10,
      label: 'Frostbind',
      expiryPolicy: 'target-next-end',
      durationText: "Until the end of the target's next turn",
      gmNote: 'Table rolls Constitution DC 12 save; GM records saved or failed.',
      save: { ability: 'constitution', dc: 12, outcome: 'negates' }
    }
  },
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
    actionPointsSelected: true,
    resourceTypes: ['mana', 'actionPoints'],
    resourceValues: { mana: 2, actionPoints: 1 }
  },
  durationConfig: { durationType: 'instant' },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
};

const RIME_TETHER_WATCH_DRAFT = {
  name: 'Rime Tether Watch',
  description: 'Direct rime damage watched on its exact part to offer a follow-up, plus Frostbind slow.',
  spellType: 'ACTION',
  typeConfig: { school: 'rime', castTimeType: 'IMMEDIATE', icon: 'Frost/Dripping Ice' },
  effectTypes: ['damage', 'control'],
  effectsMap: { damage: true, control: true },
  damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d6+2', resolution: 'DICE' },
  controlConfig: {
    authoredCondition: {
      profile: EFFECT_CAPABILITY,
      effect: 'movement',
      movementFeet: -10,
      label: 'Frostbind',
      expiryPolicy: 'target-next-end',
      durationText: "Until the end of the target's next turn",
      gmNote: 'GM confirms direct damage and Frostbind slow.'
    }
  },
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
    actionPointsSelected: true,
    resourceTypes: ['mana', 'actionPoints'],
    resourceValues: { mana: 2, actionPoints: 1 }
  },
  durationConfig: { durationType: 'instant' },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {
      damage_direct: {
        logicType: 'AND',
        targetingOverride: null,
        compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      }
    },
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  }
};

const ONE_PART_WATCH_DRAFT = {
  name: 'Ember Needle Watch',
  description: 'One-part direct damage watched for follow-up.',
  spellType: 'ACTION',
  typeConfig: { school: 'ember', castTimeType: 'IMMEDIATE', icon: 'Fire/Flame Bolt' },
  effectTypes: ['damage'],
  effectsMap: { damage: true },
  damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' },
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
    actionPointsSelected: true,
    resourceTypes: ['mana', 'actionPoints'],
    resourceValues: { mana: 2, actionPoints: 1 }
  },
  durationConfig: { durationType: 'instant' },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {
      damage_direct: {
        logicType: 'AND',
        targetingOverride: null,
        compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      }
    },
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  }
};

const MIXED_TRIGGER_DRAFT = {
  ...clone(FROSTBITE_TETHER_DRAFT),
  name: 'Frostbite Tether (Mixed Triggers)',
  description: 'Deliberately unsupported draft combining whole-spell and direct-part follow-up triggers.',
  triggerConfig: {
    global: {
      logicType: 'AND',
      compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
    },
    effectTriggers: {
      damage_direct: {
        logicType: 'AND',
        targetingOverride: null,
        compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      }
    },
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  }
};

const MIXED_WATCH_AND_CRIT_DRAFT = {
  ...clone(RIME_TETHER_WATCH_DRAFT),
  name: 'Frostbite Tether (Watch + Crit)',
  triggerConfig: {
    global: { logicType: 'AND', compoundTriggers: [] },
    effectTriggers: {
      damage_direct: {
        logicType: 'AND',
        targetingOverride: null,
        compoundTriggers: [{ id: FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      },
      control: {
        logicType: 'AND',
        targetingOverride: null,
        compoundTriggers: [{ id: CRIT_GATE_TRIGGER_ID, category: 'combat', name: 'Critical Hit', parameters: {} }]
      }
    },
    conditionalEffects: {},
    buffDebuffTriggers: {},
    requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
    triggerRole: { mode: 'CONDITIONAL' }
  }
};

let initialWizardState;
beforeAll(() => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  const Capture = () => { initialWizardState = actual.useSpellWizardState(); return null; };
  render(<actual.SpellWizardProvider><Capture /></actual.SpellWizardProvider>);
});

beforeEach(() => {
  mockPersisted = null;
  mockWizardState = null;
  useGameStore.setState({ isInMultiplayer: true, isGMMode: false, multiplayerRoom: { id: 'room-parity' } });
  useSpellbookStore.setState({ activeTab: 'library' });
});

afterEach(() => {
  cleanup();
  mockWizardState = null;
  mockPersisted = null;
  useGameStore.setState({ isInMultiplayer: false, isGMMode: false, multiplayerRoom: null });
});

function seedLibrary(spells) {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-22T12:00:00.000Z',
    data: { ...defaults, spells }
  };
}

function renderAllSurfaces(draft, savedRecord, { gm = false } = {}) {
  useGameStore.setState({ isInMultiplayer: true, isGMMode: gm, multiplayerRoom: { id: 'room-parity' } });

  // 1. Wizard Review
  mockWizardState = { ...initialWizardState, ...clone(draft) };
  useSpellbookStore.setState({ activeTab: 'wizard' });
  const rev = render(<SpellLibraryProvider><Step10Review stepNumber={10} totalSteps={10} onNext={jest.fn()} onPrevious={jest.fn()} /></SpellLibraryProvider>);
  const reviewCardText = clean(rev.container.querySelector('.review-spell-preview .pf-spell-card')?.textContent);
  const reviewCompatText = clean(rev.container.querySelector('.exec-compat')?.textContent);
  const reviewCompatState = rev.container.querySelector('.exec-compat')?.getAttribute('data-state');
  rev.unmount();

  // 2. Saved Card
  const card = render(
    <SpellLibraryProvider>
      <UnifiedSpellCard spell={clone(savedRecord)} variant="wizard" showDescription showStats showTags />
    </SpellLibraryProvider>
  );
  const savedCardText = clean(card.container.querySelector('.pf-spell-card')?.textContent);
  card.unmount();

  // 3. Grid/List SpellCardWithProcs path (mapped summary without authoredDraft + raw behaviorRecord={savedRecord})
  const mappedSummary = {
    ...clone(savedRecord),
    authoredDraft: undefined,
    serializedData: undefined,
    authoredSaveDisclosure: saveDisclosureForRecord(savedRecord),
    authoredTriggerDisclosure: triggerDisclosureForRecord(savedRecord)
  };
  const grid = render(
    <SpellLibraryProvider>
      <SpellCardWithProcs spell={mappedSummary} behaviorRecord={clone(savedRecord)} variant="wizard" showDescription showStats showTags />
    </SpellLibraryProvider>
  );
  const gridCardEl = grid.container.querySelector('.pf-spell-card');
  const gridCardText = clean(gridCardEl?.textContent);
  const gridFlowStatus = gridCardEl?.querySelector('.spell-behavior-flow')?.getAttribute('data-behavior-status');
  grid.unmount();

  // 4. Library Detail Overlay
  useSpellbookStore.setState({ activeTab: 'library' });
  seedLibrary([clone(savedRecord)]);
  const lib = render(<SpellLibraryProvider><SpellLibrary /></SpellLibraryProvider>);
  fireEvent.keyDown(lib.getByRole('button', { name: `${savedRecord.name} details` }), { key: 'Enter' });
  const overlay = document.querySelector('.spell-detail-overlay');
  const detailCardText = clean(overlay?.querySelector('.pf-spell-card')?.textContent);
  const detailAdmissionText = clean(overlay?.querySelector('.p9-admission')?.textContent);
  lib.unmount();

  return {
    reviewCardText,
    reviewCompatText,
    reviewCompatState,
    savedCardText,
    gridCardText,
    gridFlowStatus,
    detailCardText,
    detailAdmissionText
  };
}

describe('Shared explanation parity across Wizard Review, saved card, and Library detail', () => {
  test('Control 1 (Frostbite Tether): clearly states damage on save, GM-recorded save, cast-time payment, later-turn expiry, and omits bogus non-executable disclaimer', () => {
    const saved = wrapSaved(FROSTBITE_TETHER_DRAFT, 'spell-frostbite-tether');
    const before = JSON.stringify(saved);

    const surfaces = renderAllSurfaces(FROSTBITE_TETHER_DRAFT, saved, { gm: false });

    expect(surfaces.reviewCompatState).toBe(STATES.PARTIAL);
    expect(surfaces.gridFlowStatus).toBe('partial');

    for (const [label, text] of [
      ['Review Card', surfaces.reviewCardText],
      ['Review Compat', surfaces.reviewCompatText],
      ['Saved Card', surfaces.savedCardText],
      ['Grid Card', surfaces.gridCardText],
      ['Library Detail Card', surfaces.detailCardText],
      ['Library Admission', surfaces.detailAdmissionText]
    ]) {
      expect({ label, ok: text.includes('Applies on both save outcomes.') }).toEqual({ label, ok: true });
      expect({ label, ok: /On save:\s*Direct damage still applies; only Frostbind is negated\./.test(text) }).toEqual({ label, ok: true });
      expect({ label, ok: /Table rolls Constitution DC 12; GM records outcome\./.test(text) }).toEqual({ label, ok: true });
      expect({ label, ok: /VTT never rolls or validates the save; cast AP and mana price is paid once at cast on either outcome\./.test(text) }).toEqual({ label, ok: true });
      expect({ label, ok: /expires at the end of the target's next turn/.test(text) }).toEqual({ label, ok: true });
      expect({ label, bad: text.includes('Having a supported component does not make the whole record executable.') }).toEqual({ label, bad: false });
    }

    expect(surfaces.savedCardText).toContain('only the rider "Frostbind" is negated; the direct damage part still applies on both outcomes.');
    expect(surfaces.detailCardText).toBe(surfaces.reviewCardText);
    expect(surfaces.gridCardText).toBe(surfaces.reviewCardText);

    // Compiler and draft data remain untouched
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-parity', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.effects.save).toEqual({ scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' });
    expect(JSON.stringify(saved)).toBe(before);
  });

  test('Control 2 (Exact watched-component ability): explains exact part, exact admitted version binding, GM pairing setup, and later-turn lapse across all 3 surfaces for player & GM', () => {
    const saved = wrapSaved(RIME_TETHER_WATCH_DRAFT, 'spell-rime-watch');
    const before = JSON.stringify(saved);

    for (const gm of [false, true]) {
      const surfaces = renderAllSurfaces(RIME_TETHER_WATCH_DRAFT, saved, { gm });
      expect(surfaces.reviewCompatState).toBe(STATES.PARTIAL);
      expect(surfaces.gridFlowStatus).toBe('partial');

      for (const [label, text] of [
        [`Review Card (gm=${gm})`, surfaces.reviewCardText],
        [`Review Compat (gm=${gm})`, surfaces.reviewCompatText],
        [`Saved Card (gm=${gm})`, surfaces.savedCardText],
        [`Grid Card (gm=${gm})`, surfaces.gridCardText],
        [`Library Detail Card (gm=${gm})`, surfaces.detailCardText],
        [`Library Admission (gm=${gm})`, surfaces.detailAdmissionText]
      ]) {
        expect({ label, ok: text.includes('WATCH → OFFER') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Watches 1 exact part of this admitted version → offers a separate spell') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('only the direct damage part counts (other parts, saves, temp HP absorbed, and GM corrections never trigger it)') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes("binds only to this exact admitted version's Direct Damage part, never the whole spell or another part") }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Saving or admitting alone never activates the watch — the GM pairs this exact admitted version with one primary character and one separate follow-up spell; other or edited versions are not watched unless admitted and registered separately.') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes("one offer per cast, lapsing at the caster's next authenticated turn start") }).toEqual({ label, ok: true });
        expect({ label, bad: text.includes('Having a supported component does not make the whole record executable.') }).toEqual({ label, bad: false });
      }

      expect(surfaces.reviewCompatText).toContain('Watched part trigger: watches only this exact admitted version');
      expect(surfaces.detailAdmissionText).toContain('Editing the spell later creates a new version');
    }

    // 1-part watched direct damage control stays EXECUTABLE and states exact part/version + later-turn lapse
    const onePartSaved = wrapSaved(ONE_PART_WATCH_DRAFT, 'spell-one-part-watch');
    const onePartCompat = explainExecution(clone(onePartSaved), { roomId: 'room-parity', classId: 'arcanoneer', shared: true, gm: false });
    expect(onePartCompat.state).toBe(STATES.EXECUTABLE);
    expect(onePartCompat.automated.join(' ')).toContain('exact admitted version');
    const onePartFlow = buildSpellBehaviorModel(clone(onePartSaved));
    expect(onePartFlow.supportBadge.status).toBe('supported');
    expect(onePartFlow.steps.find(s => s.id === 'followup').details.join(' ')).toContain('other or edited versions are not watched unless admitted and registered separately');

    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-parity', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(true);
    expect(compiled.definition.componentWatch).toMatchObject({ componentId: 'effects:direct', wizardKey: 'damage_direct' });
    expect(JSON.stringify(saved)).toBe(before);
  });

  test('Draft 3 (Deliberately unsupported mixed-trigger draft): explains why mixed triggers stay GM-manual without false placement blame, and specifies what the GM still does across all surfaces', () => {
    const saved = wrapSaved(MIXED_TRIGGER_DRAFT, 'spell-mixed-triggers');
    const before = JSON.stringify(saved);

    for (const gm of [false, true]) {
      const surfaces = renderAllSurfaces(MIXED_TRIGGER_DRAFT, saved, { gm });
      expect(surfaces.reviewCompatState).toBe(STATES.UNSUPPORTED);
      expect(surfaces.gridFlowStatus).toBe('manual');

      for (const [label, text] of [
        [`Review Card (gm=${gm})`, surfaces.reviewCardText],
        [`Review Compat (gm=${gm})`, surfaces.reviewCompatText],
        [`Saved Card (gm=${gm})`, surfaces.savedCardText],
        [`Grid Card (gm=${gm})`, surfaces.gridCardText],
        [`Library Detail Card (gm=${gm})`, surfaces.detailCardText],
        [`Library Admission (gm=${gm})`, surfaces.detailAdmissionText]
      ]) {
        expect({ label, ok: text.includes('Mixed triggers stay GM-manual') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('"Follow-up After My Damage" (whole spell) + "Follow-up After My Damage" (Direct Damage part)') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Prism runs at most one single approved trigger scope per spell') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('UNTIL (MANUAL)') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('not auto-tracked while whole ability is manual; GM tracks and removes at the table') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Trigger checks & follow-ups: the GM checks trigger conditions and adjudicates any follow-up at the table') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Cast, price & resolution: Prism applies no AP, mana, HP, condition, or cooldown changes for an unsupported card') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Single target (enemy), 30 ft') }).toEqual({ label, ok: true });
        expect({ label, ok: text.includes('Having a supported component does not make the whole record executable.') }).toEqual({ label, ok: true });
        expect({ label, bad: text.includes('This card is not in such a place') }).toEqual({ label, bad: false });
      }
    }

    // Secondary mixed-trigger combination (watched damage_direct + control crit_gate) also explains why it stays manual without false placement blame
    const watchCritSaved = wrapSaved(MIXED_WATCH_AND_CRIT_DRAFT, 'spell-watch-crit-mixed');
    const watchCritCompat = explainExecution(clone(watchCritSaved), { roomId: 'room-parity', classId: 'arcanoneer', shared: false, gm: false });
    expect(watchCritCompat.state).toBe(STATES.UNSUPPORTED);
    expect(watchCritCompat.reasons[0].text).toContain('Mixed triggers stay GM-manual');
    expect(watchCritCompat.reasons[0].text).toContain('Direct Damage part');
    expect(watchCritCompat.reasons[0].text).toContain('Control part');
    expect(watchCritCompat.next.join(' ')).toContain('Play and resolve this ability by hand with the GM');

    // Compiler support rules and draft data are completely untouched
    const compiled = definitionFromWizard(clone(saved), { roomId: 'room-parity', classId: 'arcanoneer', definitionVersion: 1 });
    expect(compiled.ok).toBe(false);
    expect(compiled.reason).toMatch(/triggers/);
    expect(JSON.stringify(saved)).toBe(before);
  });

  test('Preservation checks: weighted-coin settings jump and Trap wording remain intact', () => {
    const weightedCoin = wrapSaved({
      name: 'Weighted Coin Test',
      description: 'Weighted coin flip.',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
      effectTypes: [],
      rollableTable: {
        enabled: true,
        name: 'Weighted Fate',
        resolutionType: 'COINS',
        resolutionConfig: { coinCount: 1, coinType: 'weighted' },
        entries: [
          { id: 'h', coinPattern: 'Heads', name: 'Hit', effectType: 'damage', effectConfig: { damageFormula: '1d6', damageType: 'arcane' } },
          { id: 't', coinPattern: 'Tails', name: 'Heal', effectType: 'healing', effectConfig: { healingFormula: '1d6' } }
        ]
      },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
      resourceCost: { actionPoints: 1, mana: 2 }
    }, 'spell-weighted-coin');

    const coinCompat = explainExecution(clone(weightedCoin), { shared: true, gm: false });
    expect(coinCompat.state).toBe(STATES.UNSUPPORTED);
    expect(coinCompat.reasons[0].text).toMatch(/Weighted coins require GM adjudication/);
    expect(coinCompat.blockerTarget).toEqual({
      stepId: 'rollable-table',
      stepName: 'Rollable Table',
      settingLabel: 'Coin settings',
      actionLabel: 'Go to Coin Settings (Rollable Table)'
    });

    const trap = wrapSaved({
      name: 'Frost Trap Test',
      description: 'Hidden frost trap.',
      spellType: 'TRAP',
      typeConfig: { placementTime: 1, visibility: 'hidden', maxTriggers: 1, school: 'rime' },
      effectTypes: ['damage'],
      damageConfig: { damageType: 'direct', elementType: 'rime', formula: '2d6', resolution: 'DICE' },
      trapConfig: { placementRadius: 10, detectionDC: 15, disarmDC: 14 },
      targetingConfig: { targetingType: 'location', maxTargets: 0, rangeDistance: 0, rangeType: 'self', targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, mana: 2 }
    }, 'spell-trap');

    const trapCompat = explainExecution(clone(trap), { shared: true, gm: false });
    expect(trapCompat.state).toBe(STATES.UNSUPPORTED);
    expect(trapCompat.blockerTarget).toBeNull();
    expect(trapCompat.reasons[0].text).toMatch(/Whole spell type is GM-managed/);
    expect(trapCompat.summary).toMatch(/Trap is a GM-managed spell type as a whole/);
    const trapFlow = buildSpellBehaviorModel(clone(trap));
    expect(trapFlow.steps.find(s => s.id === 'activation').summary).toMatch(/TRAP spell type — whole spell type is GM-managed/);
  });
});
