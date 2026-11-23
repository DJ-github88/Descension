import crypto from 'crypto';
import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellLibrary from '../../spellcrafting-wizard/components/library/SpellLibrary';
import { SpellLibraryProvider } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getDefaultLibrary } from '../../spellcrafting-wizard/core/utils/libraryManager';
import ActorConsequenceLayer from '../ActorConsequenceLayer';
import SpellConsequenceHost from '../SpellConsequencePanel';
import useGameStore from '../../../store/gameStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import { registerStore } from '../../../store/storeRegistry';
import { actionId, definitionFromWizard } from '../../../services/authoredAbility';
import { canonical } from '../../../services/featherSlash';
import { useSpellConsequenceStore, changeAuthoredAdmission, refreshAuthoredAbilities } from '../../../services/spellConsequenceService';
import {
  useTriggerOfferStore,
  refreshTriggerLedger,
  registerFollowUp,
  registerComponentWatch,
  revokeTriggerListener,
  clearTriggerRegistrationSetup,
  openTriggerRegistrationSetup
} from '../../../services/triggerOfferService';

const committedTriggers = require('../../../../../server/services/committedTriggers');

const sha256Hex = text => crypto.createHash('sha256').update(text).digest('hex');

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

let mockPersisted = null;

jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => { mockPersisted = JSON.parse(JSON.stringify(data)); },
  loadCustomSpells: jest.fn(() => []),
  saveCustomSpells: jest.fn(),
  loadDeletedSpellIds: jest.fn(() => []),
  saveDeletedSpellIds: jest.fn()
}));

jest.mock('../../../services/firebase/userSpellService', () => ({
  loadUserSpells: jest.fn(() => Promise.resolve([]))
}));

jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: jest.fn(() => 'test-icon.png'),
  getAbilityIconUrl: jest.fn(() => 'test-icon.png'),
  getCustomIconUrl: jest.fn(() => 'fallback-icon.png')
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
    currentCharacter: null,
    level: 1,
    race: null,
    subrace: null,
    path: null,
    class_spells: { known_spells: [] },
    talents: {}
  };
  const useCharacterStore = (selector) => (typeof selector === 'function' ? selector(state) : state);
  useCharacterStore.getState = () => state;
  useCharacterStore.subscribe = () => () => {};
  return { __esModule: true, default: useCharacterStore };
});

jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: null })
}));

jest.mock('../../../services/spellConsequenceService', () => {
  const actual = jest.requireActual('../../../services/spellConsequenceService');
  return {
    ...actual,
    changeAuthoredAdmission: jest.fn(),
    refreshAuthoredAbilities: jest.fn(),
    restoreOwnerStatus: jest.fn(),
    refreshSpellApprovals: jest.fn(),
    retainedTargetResponses: jest.fn(() => []),
    routeSpellCast: jest.fn(() => true),
    ownerSource: jest.fn()
  };
});

jest.mock('../../../services/triggerOfferService', () => {
  const actual = jest.requireActual('../../../services/triggerOfferService');
  return {
    ...actual,
    refreshTriggerLedger: jest.fn(),
    registerTriggerOfferHandlers: jest.fn(() => () => {}),
    registerFollowUp: jest.fn(),
    registerComponentWatch: jest.fn(),
    revokeTriggerListener: jest.fn()
  };
});

const { ownerSource, retainedTargetResponses } = jest.requireMock('../../../services/spellConsequenceService');

const ROOM_ID = 'room-1';
const WATCH_DEF_ID = '11111111-1111-4111-8111-111111111111';
const ONEPART_DEF_ID = '22222222-2222-4222-8222-222222222222';
const FOLLOWUP_DEF_ID = '33333333-3333-4333-8333-333333333333';

const source1 = {
  kind: 'character',
  roomId: ROOM_ID,
  mapId: 'm',
  tokenId: 'pc1',
  instanceId: 'i-pc1',
  ownerUid: 'u-owner',
  characterId: 'c1'
};
const source2 = {
  kind: 'character',
  roomId: ROOM_ID,
  mapId: 'm',
  tokenId: 'pc2',
  instanceId: 'i-pc2',
  ownerUid: 'u-other',
  characterId: 'c2'
};

function makeBundleWatchSpell({
  id,
  name,
  formula = '1d6+2',
  movementFeet = -10,
  label = 'Frostbind',
  authoredDefinitionId = WATCH_DEF_ID,
  lastModified = '2026-11-21T12:00:00.000Z'
}) {
  const authoredCondition = {
    profile: 'authored-effect:v1',
    effect: 'movement',
    label,
    movementFeet,
    expiryPolicy: 'target-next-end',
    durationText: "Until the end of the target's next turn",
    gmNote: 'GM confirms direct damage and movement rider.'
  };
  const draft = {
    name,
    description: 'Deals frost damage and binds enemy movement.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    effectsMap: { damage: true, control: true },
    typeConfig: {
      school: 'rime',
      icon: 'Frost/Dripping Ice',
      castTimeType: 'IMMEDIATE',
      tags: ['attack']
    },
    damageConfig: {
      damageType: 'direct',
      formula,
      elementType: 'rime',
      damageTypes: ['rime'],
      resolution: 'DICE'
    },
    controlConfig: { authoredCondition },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: 'circle',
      aoeType: 'sphere',
      aoeParameters: {},
      movementBehavior: 'static'
    },
    resourceCost: {
      actionPoints: 1,
      actionPointsSelected: true,
      mana: 2,
      components: [],
      resourceTypes: ['mana', 'actionPoints'],
      resourceValues: { mana: 2, actionPoints: 1 },
      resourceFormulas: {},
      useFormulas: { mana: false, actionPoints: false }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {
        damage_direct: {
          logicType: 'AND',
          targetingOverride: null,
          compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
        }
      },
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return {
    id,
    authoredDefinitionId,
    ...JSON.parse(JSON.stringify(draft)),
    authoredDraft: JSON.parse(JSON.stringify(draft)),
    serializedData: JSON.stringify(draft),
    dateCreated: '2026-11-21T10:00:00.000Z',
    lastModified,
    source: 'wizard',
    isCustom: true
  };
}

function makeOnePartWatchSpell({
  id,
  name,
  formula = '1d6+2',
  authoredDefinitionId = ONEPART_DEF_ID,
  lastModified = '2026-11-21T12:00:00.000Z'
}) {
  const draft = {
    name,
    description: 'Single-part direct damage watch.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage'],
    effectsMap: { damage: true },
    typeConfig: { school: 'ember', icon: 'Fire/Flame', castTimeType: 'IMMEDIATE', tags: ['attack'] },
    damageConfig: { damageType: 'direct', formula, elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: 1, mana: 2 },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {
        damage_direct: {
          logicType: 'AND',
          targetingOverride: null,
          compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
        }
      },
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return {
    id,
    authoredDefinitionId,
    ...JSON.parse(JSON.stringify(draft)),
    authoredDraft: JSON.parse(JSON.stringify(draft)),
    serializedData: JSON.stringify(draft),
    dateCreated: '2026-11-21T10:00:00.000Z',
    lastModified,
    source: 'wizard',
    isCustom: true
  };
}

function makeFollowUpSpell({
  id = 'local-echo-fang',
  name = 'Echo Fang',
  authoredDefinitionId = FOLLOWUP_DEF_ID,
  lastModified = '2026-11-21T11:55:00.000Z'
} = {}) {
  const draft = {
    name,
    description: 'Follow-up arcane strike.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage'],
    effectsMap: { damage: true },
    typeConfig: { school: 'arcane', icon: 'Arcane/Bolt', castTimeType: 'IMMEDIATE', tags: ['attack'] },
    damageConfig: { damageType: 'direct', formula: '1d6+1', elementType: 'arcane', damageTypes: ['arcane'], resolution: 'DICE' },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: 1, mana: 3 },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    durationConfig: { durationType: 'instant' },
    triggerConfig: {
      global: {
        logicType: 'AND',
        compoundTriggers: [{ id: 'follow_up_after_damage', category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      },
      effectTriggers: {},
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return {
    id,
    authoredDefinitionId,
    ...JSON.parse(JSON.stringify(draft)),
    authoredDraft: JSON.parse(JSON.stringify(draft)),
    serializedData: JSON.stringify(draft),
    dateCreated: '2026-11-21T10:00:00.000Z',
    lastModified,
    source: 'wizard',
    isCustom: true
  };
}

function makeRegistryEntry(spell, { roomId = ROOM_ID, classId = 'arcanoneer', version = 1, revoked = false } = {}) {
  const compiled = definitionFromWizard(spell, { roomId, classId, definitionVersion: version });
  expect(compiled.ok).toBe(true);
  const capabilityId = compiled.definition.capability || 'authored-immediate:v1';
  const domainPrefix = capabilityId === 'authored-effect:v1' ? 'mythrill:authored-effect:v1' : 'mythrill:authored-definition:v1';
  const definitionHash = sha256Hex(`${domainPrefix}\n${canonical(compiled.definition)}`);
  const definitionRef = {
    roomId,
    definitionId: compiled.definition.definitionId,
    definitionVersion: version,
    definitionHash
  };
  return {
    definitionRef,
    canonicalDefinition: compiled.definition,
    compilerVersion: 'p14-test-1',
    descriptor: {
      schemaVersion: compiled.definition.schemaVersion || 1,
      capabilityId,
      compilerVersion: 'p14-test-1',
      definitionRef,
      binding: compiled.definition.binding,
      price: { ap: compiled.definition.resourceCost.actionPoints, mana: compiled.definition.resourceCost.mana },
      targeting: compiled.definition.targeting,
      ...(compiled.definition.followUp ? { followUp: compiled.definition.followUp } : {}),
      ...(compiled.definition.componentWatch ? { componentWatch: compiled.definition.componentWatch } : {}),
      executionEnabled: false
    },
    revoked,
    creatureOnly: false
  };
}

function makeRoom({ listeners = [], entries = [], obligations = {} } = {}) {
  const makePcToken = (s, name) => ({
    id: s.tokenId,
    name,
    mapId: s.mapId,
    ownerUserId: s.ownerUid,
    character: { id: s.characterId, name },
    state: { actorContract: { version: 1, primary: true, ...s } }
  });
  return {
    id: ROOM_ID,
    gmId: 'u-gm',
    gameState: {
      maps: { m: { characterTokens: { pc1: makePcToken(source1, 'Ilse'), pc2: makePcToken(source2, 'Brannoc') }, tokens: {} } },
      installedAuthoredAbilities: {
        entries: Object.fromEntries(entries.map(e => [actionId(e.definitionRef), e]))
      },
      actorConsequences: { version: 1, commitSequence: 1, replayFloor: 0, receipts: [] },
      triggerLedger: { version: 1, revision: 1, listeners, obligations, closed: [], requests: [] }
    }
  };
}

function projectFor(room, viewer) {
  return {
    success: true,
    roomId: room.id,
    viewerRole: viewer.gm ? 'gm' : 'member',
    ...committedTriggers.project(room, viewer, 0, true)
  };
}

function seedLibrary(spells) {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-21T12:00:00.000Z',
    data: { ...defaults, spells }
  };
}

function setPcTokens(sources) {
  useCharacterTokenStore.setState({
    characterTokens: sources.map((s, idx) => ({
      id: s.tokenId,
      name: idx === 0 ? 'Ilse' : 'Brannoc',
      mapId: s.mapId,
      ownerUserId: s.ownerUid,
      character: { id: s.characterId, name: idx === 0 ? 'Ilse' : 'Brannoc' },
      state: { actorContract: { version: 1, primary: true, ...s } }
    }))
  });
}

function openLibrarySpellOverlay(spellName) {
  const row = screen.getByRole('button', { name: `${spellName} details` });
  fireEvent.mouseDown(row, { button: 0, clientX: 10, clientY: 10 });
  fireEvent.mouseUp(row, { button: 0, clientX: 10, clientY: 10 });
  const overlay = document.querySelector('.spell-detail-overlay');
  expect(overlay).toBeTruthy();
  return {
    overlay,
    region: within(overlay).getByRole('region', { name: `Room admission for ${spellName}` }),
    close: () => fireEvent.click(within(overlay).getByRole('button', { name: 'Close' }))
  };
}

describe('Exact-version component watch registration & selection UI flow', () => {
  let simRoom;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPersisted = null;
    localStorage.clear();
    registerStore('gameStore', useGameStore);
    registerStore('characterTokenStore', useCharacterTokenStore);
    clearTriggerRegistrationSetup();

    simRoom = makeRoom({ listeners: [], entries: [] });
    ownerSource.mockReturnValue({ ref: source1, token: null, error: null });
    retainedTargetResponses.mockReturnValue([]);
    setPcTokens([source1, source2]);

    useGameStore.setState({
      isInMultiplayer: true,
      isGMMode: true,
      multiplayerRoom: { id: ROOM_ID },
      multiplayerSocket: null
    });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [],
      creatureSources: []
    });
    useTriggerOfferStore.setState({
      projection: projectFor(simRoom, { uid: 'u-gm', gm: true }),
      roomId: ROOM_ID,
      loading: false,
      error: null,
      message: '',
      declined: [],
      setupRequest: null
    });

    changeAuthoredAdmission.mockImplementation(async (operation, recordOrRef, classId) => {
      if (operation !== 'admit') return { success: true };
      const currentEntries = useSpellConsequenceStore.getState().authoredEntries || [];
      const nextVersion = 1 + Math.max(
        0,
        ...currentEntries
          .filter(e => e.definitionRef.definitionId === recordOrRef.authoredDefinitionId)
          .map(e => e.definitionRef.definitionVersion)
      );
      const entry = makeRegistryEntry(recordOrRef, { roomId: ROOM_ID, classId, version: nextVersion });
      const nextEntries = [...currentEntries, entry];
      simRoom.gameState.installedAuthoredAbilities.entries[actionId(entry.definitionRef)] = entry;
      useSpellConsequenceStore.setState({ authoredRoomId: ROOM_ID, authoredEntries: nextEntries });
      return { success: true, status: 'accepted live', definitionRef: entry.definitionRef };
    });

    refreshAuthoredAbilities.mockImplementation(async () => ({
      success: true,
      entries: useSpellConsequenceStore.getState().authoredEntries || []
    }));

    refreshTriggerLedger.mockImplementation(async () => {
      const proj = projectFor(simRoom, { uid: 'u-gm', gm: true });
      useTriggerOfferStore.setState({ projection: proj, roomId: ROOM_ID, loading: false, error: null });
      return proj;
    });

    registerFollowUp.mockResolvedValue({ success: true, mode: 'follow-up' });

    registerComponentWatch.mockImplementation(async ({ source, definitionRef, watch }) => {
      const listener = {
        listenerId: `00000000-0000-4000-8000-${String(simRoom.gameState.triggerLedger.listeners.length + 1).padStart(12, '0')}`,
        mode: 'component-follow-up',
        gmUid: 'u-gm',
        source,
        definitionRef,
        on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
        watch,
        eligibility: { ok: true }
      };
      simRoom.gameState.triggerLedger.listeners = [...simRoom.gameState.triggerLedger.listeners, listener];
      simRoom.gameState.triggerLedger.revision += 1;
      const proj = projectFor(simRoom, { uid: 'u-gm', gm: true });
      useTriggerOfferStore.setState({ projection: proj, roomId: ROOM_ID });
      return { success: true, mode: 'component-follow-up', listener };
    });

    revokeTriggerListener.mockImplementation(async (listenerId) => {
      const removed = simRoom.gameState.triggerLedger.listeners.find(l => l.listenerId === listenerId);
      simRoom.gameState.triggerLedger.listeners = simRoom.gameState.triggerLedger.listeners.filter(l => l.listenerId !== listenerId);
      simRoom.gameState.triggerLedger.revision += 1;
      const proj = projectFor(simRoom, { uid: 'u-gm', gm: true });
      useTriggerOfferStore.setState({ projection: proj, roomId: ROOM_ID });
      return { success: true, mode: removed?.mode || 'component-follow-up', listenerId };
    });
  });

  test('1. Library UI admits v1 and edited v2, registers watch on v1 Direct Damage part, and clearly identifies watched version/component', async () => {
    const v1Spell = makeBundleWatchSpell({ id: 'lib-v1', name: 'Rime Tether' });
    const v2Spell = makeBundleWatchSpell({
      id: 'lib-v2',
      name: 'Rime Tether (Glacial Grip)',
      formula: '2d6+2',
      movementFeet: -15,
      label: 'Glacial Grip',
      lastModified: '2026-11-21T11:59:00.000Z'
    });
    const followUpSpell = makeFollowUpSpell();

    seedLibrary([v1Spell, v2Spell, followUpSpell]);
    localStorage.setItem('mythrill.actorConsequenceLayer.collapsed', '1');

    const view = render(
      <div>
        <SpellLibraryProvider>
          <SpellLibrary />
        </SpellLibraryProvider>
        <ActorConsequenceLayer>
          <SpellConsequenceHost />
        </ActorConsequenceLayer>
      </div>
    );

    // Admit v1 through the actual Library overlay
    const overlayV1 = openLibrarySpellOverlay(v1Spell.name);
    fireEvent.click(within(overlayV1.region).getByRole('button', { name: 'Admit this saved version' }));
    await waitFor(() => expect(within(overlayV1.region).getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument());
    overlayV1.close();

    // Edited v2 initially shows changed-since-v1 and cannot set up until explicitly admitted
    const overlayV2Before = openLibrarySpellOverlay(v2Spell.name);
    expect(within(overlayV2Before.region).getByText(/Changed since admitted version 1\./)).toBeInTheDocument();
    expect(within(overlayV2Before.region).getByText(/Trigger setup unavailable: This library copy changed since admission\./)).toBeInTheDocument();
    fireEvent.click(within(overlayV2Before.region).getByRole('button', { name: 'Admit this saved version' }));
    await waitFor(() => expect(within(overlayV2Before.region).getByText(/Admitted for .* · version 2\. The installed version is immutable\./)).toBeInTheDocument());
    overlayV2Before.close();

    // Admit follow-up B
    const overlayB = openLibrarySpellOverlay(followUpSpell.name);
    fireEvent.click(within(overlayB.region).getByRole('button', { name: 'Admit this saved version' }));
    await waitFor(() => expect(within(overlayB.region).getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument());
    overlayB.close();

    const entries = useSpellConsequenceStore.getState().authoredEntries;
    const entryV1 = entries.find(e => e.definitionRef.definitionId === WATCH_DEF_ID && e.definitionRef.definitionVersion === 1);
    const entryV2 = entries.find(e => e.definitionRef.definitionId === WATCH_DEF_ID && e.definitionRef.definitionVersion === 2);
    const entryB = entries.find(e => e.definitionRef.definitionId === FOLLOWUP_DEF_ID);
    expect(entryV1).toBeTruthy();
    expect(entryV2).toBeTruthy();
    expect(entryB).toBeTruthy();

    // Re-open v1 in Library and launch guided component-watch registration for v1
    const overlayV1Setup = openLibrarySpellOverlay(v1Spell.name);
    expect(within(overlayV1Setup.region).getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument();
    fireEvent.click(within(overlayV1Setup.region).getByRole('button', { name: 'Set up component watch' }));
    overlayV1Setup.close();

    // Layer expands and setup clearly identifies v1 + Direct Damage part
    await waitFor(() => expect(view.container.querySelector('.actor-consequence-layer.acl-collapsed')).toBeNull());
    const guided = view.container.querySelector('[data-guided-trigger-setup="component-watch"]');
    expect(guided).toBeTruthy();
    expect(guided).toHaveAttribute('data-guided-watch-version', '1');
    expect(guided).toHaveAttribute('data-guided-watch-component', 'effects:direct');
    expect(guided.textContent).toMatch(/Rime Tether \(v1\) — Direct Damage part/);

    const watchSelect = screen.getByLabelText(/Watched spell part \(origin\)/);
    expect(watchSelect.value).toBe(actionId(entryV1.definitionRef));

    const selectionNote = view.container.querySelector('[data-selected-component-watch="1:effects:direct"]');
    expect(selectionNote).toBeTruthy();
    expect(selectionNote.textContent).toMatch(/Watching exact version Rime Tether \(v1\) — Direct Damage part/);
    expect(selectionNote.textContent).toMatch(/Other versions of this spell are not watched unless registered separately/);

    fireEvent.change(screen.getByLabelText(/Follow-up spell B \(offered\)/), { target: { value: actionId(entryB.definitionRef) } });
    fireEvent.click(screen.getByRole('button', { name: 'Register component watch' }));

    await waitFor(() => expect(registerComponentWatch).toHaveBeenCalledWith({
      source: source1,
      definitionRef: entryB.definitionRef,
      watch: { definitionRef: entryV1.definitionRef, componentId: 'effects:direct' }
    }));

    // Guided setup banner closes once registration succeeds, and Registered pairings + conflict alert name v1 and component
    await waitFor(() => expect(view.container.querySelector('[data-guided-trigger-setup]')).toBeNull());
    const row = view.container.querySelector('[data-watch-pairing="effects:direct"][data-watch-version="1"]');
    expect(row).toBeTruthy();
    expect(row.textContent).toMatch(/Echo Fang \(authored follow-up trigger\) — offered only after the direct damage part of Rime Tether removes base HP \(v1 · Direct Damage part\)/);

    const conflict = view.container.querySelector('[data-pairing-conflict="component-watch"]');
    expect(conflict).toBeTruthy();
    expect(conflict.textContent).toMatch(/component watch offering Echo Fang \(v1\) after Rime Tether \(v1 · Direct Damage part\)/);
  });

  test('2. One-part Direct Damage spell (componentId "effect"): setup screen clarifies v1 and "Direct Damage part (its only part)"', async () => {
    const v1OnePart = makeOnePartWatchSpell({ id: 'one-v1', name: 'Ember Needle', formula: '1d6+2' });
    const v2OnePart = makeOnePartWatchSpell({ id: 'one-v2', name: 'Ember Needle (White-Hot)', formula: '1d8+3', lastModified: '2026-11-21T11:59:00.000Z' });
    const followUpSpell = makeFollowUpSpell();

    const eV1 = makeRegistryEntry(v1OnePart, { version: 1 });
    const eV2 = makeRegistryEntry(v2OnePart, { version: 2 });
    const eB = makeRegistryEntry(followUpSpell, { version: 1 });
    useSpellConsequenceStore.setState({ authoredRoomId: ROOM_ID, authoredEntries: [eV2, eV1, eB] });
    seedLibrary([v1OnePart, v2OnePart, followUpSpell]);

    const view = render(
      <div>
        <SpellLibraryProvider>
          <SpellLibrary />
        </SpellLibraryProvider>
        <ActorConsequenceLayer>
          <SpellConsequenceHost />
        </ActorConsequenceLayer>
      </div>
    );

    const overlayV1 = openLibrarySpellOverlay(v1OnePart.name);
    fireEvent.click(within(overlayV1.region).getByRole('button', { name: 'Set up component watch' }));
    overlayV1.close();

    const guided = await waitFor(() => view.container.querySelector('[data-guided-trigger-setup="component-watch"]'));
    expect(guided).toHaveAttribute('data-guided-watch-version', '1');
    expect(guided).toHaveAttribute('data-guided-watch-component', 'effect');
    expect(guided.textContent).toMatch(/Ember Needle \(v1\) — Direct Damage part \(its only part\)/);
    expect(screen.getByLabelText(/Watched spell part \(origin\)/).value).toBe(actionId(eV1.definitionRef));

    const selectionNote = view.container.querySelector('[data-selected-component-watch="1:effect"]');
    expect(selectionNote.textContent).toMatch(/Watching exact version Ember Needle \(v1\) — Direct Damage part \(its only part\)/);

    fireEvent.click(screen.getByRole('button', { name: 'Register component watch' }));
    await waitFor(() => expect(registerComponentWatch).toHaveBeenCalledWith({
      source: source1,
      definitionRef: eB.definitionRef,
      watch: { definitionRef: eV1.definitionRef, componentId: 'effect' }
    }));
  });

  test('3. Selection UI fixes: late mount/authority never clobbers v1 with v2, manual switch does not snap back, revoke keeps v2 guided setup, canonical key-order refs and room scoping work', async () => {
    const v1Spell = makeBundleWatchSpell({ id: 'lib-v1', name: 'Rime Tether' });
    const v2Spell = makeBundleWatchSpell({ id: 'lib-v2', name: 'Rime Tether (Glacial Grip)', formula: '2d6+2' });
    const followUpSpell = makeFollowUpSpell();

    const eV1 = makeRegistryEntry(v1Spell, { version: 1 });
    const eV2 = makeRegistryEntry(v2Spell, { version: 2 });
    const eB = makeRegistryEntry(followUpSpell, { version: 1 });
    const otherRoomEntry = makeRegistryEntry(makeOnePartWatchSpell({ id: 'other', name: 'Foreign Spell' }), { roomId: 'other-room', version: 1 });

    // v2 appears BEFORE v1 in authoredEntries, and foreign entry is present while authoredRoomId is unset
    useGameStore.setState({ isGMMode: false });
    useSpellConsequenceStore.setState({ authoredRoomId: null, authoredEntries: [eV2, eV1, eB, otherRoomEntry] });
    useTriggerOfferStore.setState({
      projection: projectFor(simRoom, { uid: 'u-gm', gm: true }),
      roomId: ROOM_ID,
      loading: false,
      error: null,
      message: '',
      declined: []
    });

    // Launch guided setup BEFORE TriggerOfferPanel mounts and while GM authority is not yet active
    openTriggerRegistrationSetup({
      mode: 'component-watch',
      definitionRef: { definitionHash: eV1.definitionRef.definitionHash, definitionId: eV1.definitionRef.definitionId, definitionVersion: 1, roomId: ROOM_ID },
      spellName: v1Spell.name,
      componentId: 'effects:direct'
    });

    const view = render(<SpellConsequenceHost />);
    act(() => {
      useGameStore.setState({ isGMMode: true });
    });

    const watchSelect = await waitFor(() => screen.getByLabelText(/Watched spell part \(origin\)/));
    expect(watchSelect.value).toBe(actionId(eV1.definitionRef));
    expect(view.container.querySelector('[data-selected-component-watch="1:effects:direct"]')).toBeTruthy();

    // Foreign room entries are excluded from dropdown options
    const watchOptionTexts = Array.from(watchSelect.querySelectorAll('option')).map(o => o.textContent);
    expect(watchOptionTexts.some(t => t.includes('Foreign Spell'))).toBe(false);

    // Manually switching the origin dropdown to v2 does NOT snap back to v1 and clears the stale v1 banner
    fireEvent.change(watchSelect, { target: { value: actionId(eV2.definitionRef) } });
    await waitFor(() => expect(view.container.querySelector('[data-guided-trigger-setup]')).toBeNull());
    expect(watchSelect.value).toBe(actionId(eV2.definitionRef));
    expect(view.container.querySelector('[data-selected-component-watch="2:effects:direct"]')).toBeTruthy();

    // Register v1, then open guided setup for v2 and revoke v1 -> v2 guided setup stays intact so v2 can register immediately
    await act(async () => {
      await registerComponentWatch({
        source: source1,
        definitionRef: eB.definitionRef,
        watch: { definitionRef: eV1.definitionRef, componentId: 'effects:direct' }
      });
      openTriggerRegistrationSetup({
        mode: 'component-watch',
        definitionRef: eV2.definitionRef,
        spellName: v2Spell.name,
        componentId: 'effects:direct'
      });
    });

    await waitFor(() => expect(view.container.querySelector('[data-guided-trigger-setup="component-watch"]')).toHaveAttribute('data-guided-watch-version', '2'));
    fireEvent.click(screen.getByRole('button', { name: 'Revoke pairing' }));
    await waitFor(() => expect(view.container.querySelector('[data-watch-pairing]')).toBeNull());
    expect(view.container.querySelector('[data-guided-trigger-setup="component-watch"]')).toHaveAttribute('data-guided-watch-version', '2');
    expect(screen.getByLabelText(/Watched spell part \(origin\)/).value).toBe(actionId(eV2.definitionRef));

    fireEvent.click(screen.getByRole('button', { name: 'Register component watch' }));
    await waitFor(() => expect(registerComponentWatch).toHaveBeenLastCalledWith({
      source: source1,
      definitionRef: eB.definitionRef,
      watch: { definitionRef: eV2.definitionRef, componentId: 'effects:direct' }
    }));
  });

  test('4. Non-GM owner offer projection shows offered ability B only and leaks no watched spell/version/component details', () => {
    const v1Spell = makeBundleWatchSpell({ id: 'lib-v1', name: 'Rime Tether' });
    const followUpSpell = makeFollowUpSpell();
    const eV1 = makeRegistryEntry(v1Spell, { version: 1 });
    const eB = makeRegistryEntry(followUpSpell, { version: 1 });

    const listener = {
      listenerId: '00000000-0000-4000-8000-000000000001',
      mode: 'component-follow-up',
      gmUid: 'u-gm',
      source: source1,
      definitionRef: eB.definitionRef,
      on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
      watch: { definitionRef: eV1.definitionRef, componentId: 'effects:direct' }
    };
    const obligationId = 'a'.repeat(64);
    const offer = {
      obligationId,
      state: 'pending-offer',
      mode: 'follow-up',
      occurrence: { kind: 'immediate-damage' },
      listener: { ...listener },
      matched: { role: 'source', evidence: 'baseHpLost', value: 4 },
      origin: { submitterUid: 'u-owner', commandId: '00000000-0000-4000-8000-000000000002', commitSequence: 2 },
      lapse: { capability: 'authenticated-source-next-turn:v1', clockId: '00000000-0000-4000-8000-000000000003', startSequence: 1, dueSequence: 3, rosterHash: 'b'.repeat(64) }
    };
    const room = makeRoom({ listeners: [listener], entries: [eV1, eB], obligations: { [obligationId]: offer } });
    const memberProj = projectFor(room, { uid: 'u-owner', gm: false });

    useGameStore.setState({ isGMMode: false });
    useSpellConsequenceStore.setState({ authoredRoomId: ROOM_ID, authoredEntries: [eV1, eB] });
    useTriggerOfferStore.setState({ projection: memberProj, roomId: ROOM_ID, loading: false, error: null, message: '', declined: [] });

    const view = render(<SpellConsequenceHost />);
    const triggerSection = view.container.querySelector('[aria-label="Follow-up trigger offers"]');
    expect(triggerSection).toBeTruthy();
    expect(triggerSection.textContent).toMatch(/Follow-up offers \(1\)/);
    expect(triggerSection.textContent).toMatch(/Echo Fang/);
    expect(triggerSection.textContent).not.toMatch(/Rime Tether|Direct Damage part|v1/);
    expect(view.container.querySelector('[data-component-watch-registration]')).toBeNull();
    expect(view.container.querySelector('[data-guided-trigger-setup]')).toBeNull();
  });
});
