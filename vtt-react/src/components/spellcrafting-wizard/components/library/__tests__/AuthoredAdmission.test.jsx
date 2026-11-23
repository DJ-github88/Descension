import crypto from 'crypto';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpellLibrary from '../SpellLibrary';
import AuthoredAdmission from '../AuthoredAdmission';
import { SpellLibraryProvider } from '../../../context/SpellLibraryContext';
import { getDefaultLibrary } from '../../../core/utils/libraryManager';
import { definitionFromWizard, EFFECT_CAPABILITY } from '../../../../../services/authoredAbility';
import { canonical } from '../../../../../services/featherSlash';
import { useSpellConsequenceStore } from '../../../../../services/spellConsequenceService';
import { useTriggerOfferStore } from '../../../../../services/triggerOfferService';
import useGameStore from '../../../../../store/gameStore';

const sha256Hex = text => crypto.createHash('sha256').update(text).digest('hex');

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

let mockPersisted = null;

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => { mockPersisted = JSON.parse(JSON.stringify(data)); },
  loadCustomSpells: jest.fn(() => []),
  saveCustomSpells: jest.fn(),
  loadDeletedSpellIds: jest.fn(() => []),
  saveDeletedSpellIds: jest.fn()
}));

jest.mock('../../../../../services/firebase/userSpellService', () => ({
  loadUserSpells: jest.fn(() => Promise.resolve([]))
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: jest.fn(() => 'test-icon.png'),
  getAbilityIconUrl: jest.fn(() => 'test-icon.png'),
  getCustomIconUrl: jest.fn(() => 'fallback-icon.png')
}));

jest.mock('../../../../../hooks/useClassSpellLibrary', () => ({
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

jest.mock('../../../../../hooks/useWeaponEnhancedSpells', () => ({
  useWeaponEnhancedSpells: () => ({ enhancedSpells: [], rawSpells: [] })
}));

jest.mock('../../../../../store/characterStore', () => {
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
  return { __esModule: true, default: useCharacterStore };
});

jest.mock('../../../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: null })
}));

const ROOM_ID = 'room-1';
const DEF_ID = '11111111-1111-4111-8111-111111111111';

function makeSpellRecord({
  id,
  name,
  formula = '1d6+2',
  movementFeet = -10,
  label = 'Frostbind',
  expiryPolicy = 'target-next-end',
  occurrences,
  durationText = "Until the end of the target's next turn",
  lastModified = '2026-11-21T12:00:00.000Z'
}) {
  const authoredCondition = {
    profile: 'authored-effect:v1',
    effect: 'movement',
    label,
    movementFeet,
    expiryPolicy,
    durationText,
    gmNote: 'GM confirms direct damage and movement rider.',
    ...(occurrences !== undefined ? { occurrences } : {})
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
    durationConfig: { durationType: 'instant' }
  };

  return {
    id,
    name: draft.name,
    description: draft.description,
    icon: 'Frost/Dripping Ice',
    level: draft.level,
    spellType: draft.spellType,
    resolution: draft.resolution,
    effectTypes: draft.effectTypes,
    effectsMap: draft.effectsMap,
    typeConfig: draft.typeConfig,
    damageConfig: draft.damageConfig,
    controlConfig: draft.controlConfig,
    targetingConfig: draft.targetingConfig,
    resourceCost: draft.resourceCost,
    cooldownConfig: draft.cooldownConfig,
    durationConfig: draft.durationConfig,
    authoredDefinitionId: DEF_ID,
    authoredDraft: draft,
    serializedData: JSON.stringify(draft),
    dateCreated: '2026-11-21T10:00:00.000Z',
    lastModified,
    source: 'community',
    isCustom: true
  };
}

function makeRegistryEntry(spell, { roomId = ROOM_ID, classId = 'arcanoneer', version = 1, revoked = false, creatureOnly = false } = {}) {
  const compiled = definitionFromWizard(spell, { roomId, classId, definitionVersion: version });
  expect(compiled.ok).toBe(true);
  const definitionHash = sha256Hex(`mythrill:${EFFECT_CAPABILITY}\n${canonical(compiled.definition)}`);
  const definitionRef = {
    roomId,
    definitionId: compiled.definition.definitionId,
    definitionVersion: version,
    definitionHash
  };
  return {
    definitionRef,
    canonicalDefinition: compiled.definition,
    compilerVersion: 'p14-authored-effect-1',
    descriptor: {
      schemaVersion: 3,
      capabilityId: EFFECT_CAPABILITY,
      compilerVersion: 'p14-authored-effect-1',
      definitionRef,
      binding: compiled.definition.binding,
      price: { ap: compiled.definition.resourceCost.actionPoints, mana: compiled.definition.resourceCost.mana },
      targeting: compiled.definition.targeting,
      executionEnabled: false
    },
    revoked,
    creatureOnly
  };
}

const v1Spell = makeSpellRecord({
  id: 'community-rime-v1',
  name: 'Rime Tether',
  lastModified: '2026-11-21T12:03:00.000Z'
});

const v2Spell = makeSpellRecord({
  id: 'local-rime-v2',
  name: 'Rime Tether (Glacial Grip)',
  movementFeet: -15,
  label: 'Glacial Grip',
  expiryPolicy: 'target-end-count',
  occurrences: 2,
  durationText: 'For 2 target turn ends',
  lastModified: '2026-11-21T12:02:00.000Z'
});

const v3UnapprovedSpell = makeSpellRecord({
  id: 'local-rime-v3-unapproved',
  name: 'Rime Tether (Permafrost)',
  formula: '2d6+2',
  movementFeet: -20,
  label: 'Permafrost',
  lastModified: '2026-11-21T12:01:00.000Z'
});

function seedLibrary(spells) {
  const defaults = getDefaultLibrary();
  mockPersisted = {
    version: 1,
    timestamp: '2026-11-21T12:00:00.000Z',
    data: { ...defaults, spells }
  };
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

describe('AuthoredAdmission version matching in Spell Library', () => {
  beforeEach(() => {
    mockPersisted = null;
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
      projection: { roomId: ROOM_ID, viewerRole: 'gm' },
      roomId: ROOM_ID,
      loading: false,
      error: null,
      setupRequest: null
    });
  });

  test('Library with admitted v1, admitted v2, and unapproved v3: each copy displays its exact version or pending approval', () => {
    const entryV1 = makeRegistryEntry(v1Spell, { version: 1 });
    const entryV2 = makeRegistryEntry(v2Spell, { version: 2 });
    seedLibrary([v1Spell, v2Spell, v3UnapprovedSpell]);
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1, entryV2],
      creatureSources: []
    });

    render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const viewV1 = openLibrarySpellOverlay(v1Spell.name);
    expect(within(viewV1.region).getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument();
    expect(within(viewV1.region).queryByText(/Changed since admitted version/)).not.toBeInTheDocument();
    fireEvent.click(within(viewV1.region).getByRole('button', { name: 'Set up follow-up' }));
    expect(useTriggerOfferStore.getState().setupRequest.definitionRef).toEqual(entryV1.definitionRef);
    viewV1.close();

    const viewV2 = openLibrarySpellOverlay(v2Spell.name);
    expect(within(viewV2.region).getByText(/Admitted for .* · version 2\. The installed version is immutable\./)).toBeInTheDocument();
    expect(within(viewV2.region).queryByText(/Changed since admitted version/)).not.toBeInTheDocument();
    fireEvent.click(within(viewV2.region).getByRole('button', { name: 'Set up follow-up' }));
    expect(useTriggerOfferStore.getState().setupRequest.definitionRef).toEqual(entryV2.definitionRef);
    viewV2.close();

    const viewV3 = openLibrarySpellOverlay(v3UnapprovedSpell.name);
    expect(within(viewV3.region).getByText(/Changed since admitted version 2\. The installed version remains unchanged; admit this changed copy explicitly\./)).toBeInTheDocument();
    expect(within(viewV3.region).queryByText(/Admitted for /)).not.toBeInTheDocument();
    expect(within(viewV3.region).getByText(/Trigger setup unavailable: This library copy changed since admission\./)).toBeInTheDocument();
    expect(within(viewV3.region).queryByRole('button', { name: 'Set up follow-up' })).not.toBeInTheDocument();
    expect(within(viewV3.region).getByRole('button', { name: 'Admit this saved version' })).toBeEnabled();
    viewV3.close();
  });

  test('Library with revoked v1 and active v2: revoked v1 never shows as usable while active v2 remains usable', () => {
    const entryV1Revoked = makeRegistryEntry(v1Spell, { version: 1, revoked: true });
    const entryV2Active = makeRegistryEntry(v2Spell, { version: 2, revoked: false });
    seedLibrary([v1Spell, v2Spell]);
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1Revoked, entryV2Active],
      creatureSources: []
    });

    render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const viewV1 = openLibrarySpellOverlay(v1Spell.name);
    expect(within(viewV1.region).getByText('Revoked — this version cannot be accepted. History is retained.')).toBeInTheDocument();
    expect(within(viewV1.region).queryByText(/Admitted for /)).not.toBeInTheDocument();
    expect(within(viewV1.region).getByText(/Trigger setup unavailable: This admitted version was revoked\./)).toBeInTheDocument();
    expect(within(viewV1.region).queryByRole('button', { name: 'Set up follow-up' })).not.toBeInTheDocument();
    viewV1.close();

    const viewV2 = openLibrarySpellOverlay(v2Spell.name);
    expect(within(viewV2.region).getByText(/Admitted for .* · version 2\. The installed version is immutable\./)).toBeInTheDocument();
    expect(within(viewV2.region).getByRole('button', { name: 'Set up follow-up' })).toBeEnabled();
    viewV2.close();
  });

  test('Library with active v1 and revoked v2: v1 stays usable, v2 shows revoked, and unapproved v3 still says it needs approval', () => {
    const entryV1Active = makeRegistryEntry(v1Spell, { version: 1, revoked: false });
    const entryV2Revoked = makeRegistryEntry(v2Spell, { version: 2, revoked: true });
    seedLibrary([v1Spell, v2Spell, v3UnapprovedSpell]);
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1Active, entryV2Revoked],
      creatureSources: []
    });

    render(
      <SpellLibraryProvider>
        <SpellLibrary />
      </SpellLibraryProvider>
    );

    const viewV1 = openLibrarySpellOverlay(v1Spell.name);
    expect(within(viewV1.region).getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument();
    expect(within(viewV1.region).getByRole('button', { name: 'Set up follow-up' })).toBeEnabled();
    viewV1.close();

    const viewV2 = openLibrarySpellOverlay(v2Spell.name);
    expect(within(viewV2.region).getByText('Revoked — this version cannot be accepted. History is retained.')).toBeInTheDocument();
    expect(within(viewV2.region).queryByText(/Admitted for /)).not.toBeInTheDocument();
    expect(within(viewV2.region).queryByRole('button', { name: 'Set up follow-up' })).not.toBeInTheDocument();
    viewV2.close();

    const viewV3 = openLibrarySpellOverlay(v3UnapprovedSpell.name);
    expect(within(viewV3.region).getByText(/Changed since admitted version 2\. The installed version remains unchanged; admit this changed copy explicitly\./)).toBeInTheDocument();
    expect(within(viewV3.region).queryByText(/Revoked —/)).not.toBeInTheDocument();
    viewV3.close();
  });

  test('only v1 exists and is revoked: v1 never shows as usable and unapproved edit says it needs approval', () => {
    const entryV1Revoked = makeRegistryEntry(v1Spell, { version: 1, revoked: true });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1Revoked],
      creatureSources: []
    });

    const v1View = render(<AuthoredAdmission spell={v1Spell} />);
    expect(screen.getByText('Revoked — this version cannot be accepted. History is retained.')).toBeInTheDocument();
    expect(screen.queryByText(/Admitted for /)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Set up follow-up' })).not.toBeInTheDocument();
    v1View.unmount();

    render(<AuthoredAdmission spell={v3UnapprovedSpell} />);
    expect(screen.getByText(/Changed since admitted version 1\. The installed version remains unchanged; admit this changed copy explicitly\./)).toBeInTheDocument();
    expect(screen.queryByText(/Revoked —/)).not.toBeInTheDocument();
  });

  test('revoked v1 re-admitted with identical content as active v2 matches active version 2', () => {
    const entryV1Revoked = makeRegistryEntry(v1Spell, { version: 1, revoked: true });
    const entryV2ReAdmitted = makeRegistryEntry(v1Spell, { version: 2, revoked: false });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1Revoked, entryV2ReAdmitted],
      creatureSources: []
    });

    render(<AuthoredAdmission spell={v1Spell} />);
    expect(screen.getByText(/Admitted for .* · version 2\. The installed version is immutable\./)).toBeInTheDocument();
    expect(screen.queryByText(/Revoked —/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set up follow-up' })).toBeEnabled();
  });

  test('entries from a different roomId never match as admitted or changed-since-admitted', () => {
    const otherRoomEntry = makeRegistryEntry(v1Spell, { roomId: 'other-room', version: 1 });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [otherRoomEntry],
      creatureSources: []
    });

    render(<AuthoredAdmission spell={v1Spell} />);
    expect(screen.getByText('Saved locally — refresh room admission to check its current status.')).toBeInTheDocument();
    expect(screen.queryByText(/Admitted for /)).not.toBeInTheDocument();
    expect(screen.queryByText(/Changed since admitted version/)).not.toBeInTheDocument();
  });

  test('non-GM player sees exact version, changed, and revoked status text without GM admit or trigger controls', () => {
    useGameStore.setState({
      isInMultiplayer: true,
      isGMMode: false,
      multiplayerRoom: { id: ROOM_ID },
      multiplayerSocket: null
    });
    useTriggerOfferStore.setState({
      projection: { roomId: ROOM_ID, viewerRole: 'player' },
      roomId: ROOM_ID,
      loading: false,
      error: null,
      setupRequest: null
    });

    const entryV1 = makeRegistryEntry(v1Spell, { version: 1 });
    const entryV2Revoked = makeRegistryEntry(v2Spell, { version: 2, revoked: true });
    useSpellConsequenceStore.setState({
      authoredRoomId: ROOM_ID,
      authoredEntries: [entryV1, entryV2Revoked],
      creatureSources: []
    });

    const r1 = render(<AuthoredAdmission spell={v1Spell} />);
    expect(screen.getByText(/Admitted for .* · version 1\. The installed version is immutable\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Admit this saved version' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Set up follow-up' })).not.toBeInTheDocument();
    r1.unmount();

    const r2 = render(<AuthoredAdmission spell={v2Spell} />);
    expect(screen.getByText('Revoked — this version cannot be accepted. History is retained.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Admit this saved version' })).not.toBeInTheDocument();
    r2.unmount();

    render(<AuthoredAdmission spell={v3UnapprovedSpell} />);
    expect(screen.getByText(/Changed since admitted version 2\. The installed version remains unchanged; admit this changed copy explicitly\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Admit this saved version' })).not.toBeInTheDocument();
  });
});
