import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { SharedDefendingEditor } from '../SharedDefendingEditor';
import { makeAttributeRecord, makeMovementRecord, makeStunnedRecord, makePeriodicRecord } from '../../../services/sharedConditionProfile';
import { canonical, sha256Hex } from '../../../services/canonicalHash';
import { useSharedConditionStore, conditionKey, conditionPrincipal } from '../../../services/sharedConditionService';
import useAuthStore from '../../../store/authStore';
import useCharacterStore from '../../../store/characterStore';
import useGameStore from '../../../store/gameStore';
import { registerStore } from '../../../store/storeRegistry';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';

const ROOM_ID = 'test-room-1';
const MAP_ID = 'arena';
const CID = 'c0000000-0000-4000-8000-000000000001';

const pcRef = {
  kind: 'character',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'pc-tok-1',
  instanceId: 'pc-inc-1',
  characterId: 'char-1',
  ownerUid: 'user-1'
};

const creatureRef = {
  kind: 'creature',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'wolf-tok-1',
  instanceId: 'wolf-inc-1'
};

const sourceRef = {
  kind: 'creature',
  roomId: ROOM_ID,
  mapId: MAP_ID,
  tokenId: 'caster-tok-1',
  instanceId: 'caster-inc-1'
};

function setupStores({ gm = true, combat = null } = {}) {
  registerStore('gameStore', useGameStore);
  registerStore('characterStore', useCharacterStore);
  registerStore('authStore', useAuthStore);
  registerStore('creatureStore', useCreatureStore);
  registerStore('characterTokenStore', useCharacterTokenStore);

  useAuthStore.setState({ user: { uid: pcRef.ownerUid } });
  useCharacterStore.setState({ currentCharacterId: pcRef.characterId });

  useGameStore.setState({
    isInMultiplayer: true,
    isGMMode: gm,
    multiplayerRoom: { id: ROOM_ID }
  });

  const pcToken = {
    id: pcRef.tokenId,
    mapId: MAP_ID,
    name: 'Lyra',
    character: { id: pcRef.characterId, name: 'Lyra' },
    ownerUserId: pcRef.ownerUid,
    state: {
      actorContract: { ...pcRef, primary: true, version: 1 },
      conditions: []
    }
  };

  const creatureToken = {
    id: creatureRef.tokenId,
    mapId: MAP_ID,
    name: 'Dire Wolf',
    state: {
      actorContract: { ...creatureRef, version: 1 },
      conditions: []
    }
  };

  useCharacterTokenStore.setState({
    characterTokens: [pcToken]
  });

  useCreatureStore.setState({
    creatureTokens: [creatureToken],
    creatures: []
  });

  useSharedConditionStore.setState({
    principal: conditionPrincipal(),
    combat: combat || { isActive: false },
    views: {
      [conditionKey(pcRef)]: { phase: 'ready' },
      [conditionKey(creatureRef)]: { phase: 'ready' }
    },
    saved: { entries: {} }
  });

  return { pcToken, creatureToken };
}

describe('SharedDefendingEditor — Readable active-effect state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('PC with shared attribute modifier: displays name, stat, numeric change, manual timing, and base stats protection outside Stunned section', () => {
    const { pcToken } = setupStores({ gm: true });
    const attrRecord = makeAttributeRecord(pcRef, '11111111-1111-4111-8111-111111111111', {
      sourceOccurrence: 'authored-effect:11111111-1111-4111-8111-111111111111',
      timing: 'manual',
      authoredDuration: 'Until morning',
      attribute: 'spirit',
      amount: 2,
      label: 'Iron Will',
      sourceActor: sourceRef,
      effectDefinition: 'authored:11111111-1111-4111-8111-111111111111:1:1111111111111111111111111111111111111111111111111111111111111111'
    });
    pcToken.state.conditions = [attrRecord];

    render(<SharedDefendingEditor targetRef={pcRef} />);

    // Section exists with proper label and is sibling, not inside Stunned
    const attrSection = screen.getByRole('region', { name: 'Active attribute changes' });
    expect(attrSection).toBeInTheDocument();

    const stunnedSection = screen.getByRole('region', { name: 'Shared Stunned' });
    expect(stunnedSection).not.toContainElement(attrSection);

    // Effect name, attribute, and numeric change
    expect(within(attrSection).getByText(/Iron Will · Spirit \+2/)).toBeInTheDocument();
    expect(within(attrSection).getByText(/Total authored change: Spirit \+2/)).toBeInTheDocument();

    // Timing
    expect(within(attrSection).getByText(/Until morning — GM removes\./)).toBeInTheDocument();

    // Base stats not presented as permanently changed
    expect(within(attrSection).getByText(/base, level-up, heritage, origin and equipment values are not edited/)).toBeInTheDocument();

    // GM removal button
    expect(within(attrSection).getByRole('button', { name: /Remove Iron Will instance/ })).toBeInTheDocument();
  });

  test('PC with shared movement modifier: displays name, speed change, resulting speed, and manual timing', () => {
    const { pcToken } = setupStores({ gm: true });
    const moveRecord = makeMovementRecord(pcRef, '22222222-2222-4222-8222-222222222222', {
      sourceOccurrence: 'authored-effect:22222222-2222-4222-8222-222222222222',
      timing: 'manual',
      authoredDuration: 'Until dusk',
      feet: -10,
      label: 'Hobbled',
      sourceActor: sourceRef,
      effectDefinition: 'authored:22222222-2222-4222-8222-222222222222:1:2222222222222222222222222222222222222222222222222222222222222222'
    });
    pcToken.state.conditions = [moveRecord];

    render(<SharedDefendingEditor targetRef={pcRef} />);

    const moveSection = screen.getByRole('region', { name: 'Active movement effects' });
    expect(moveSection).toBeInTheDocument();
    expect(within(moveSection).getByText(/Hobbled · movement −10 ft/)).toBeInTheDocument();
    expect(within(moveSection).getByText(/Until dusk — GM removes\./)).toBeInTheDocument();
    expect(within(moveSection).getByText(/Resulting speed:/)).toBeInTheDocument();
  });

  test('Creature inspect view: uses creature conditions label and distinguishes active periodic effect without due tick', () => {
    const { creatureToken } = setupStores({ gm: true });
    const periodicRecord = makePeriodicRecord(creatureRef, '33333333-3333-4333-8333-333333333333', {
      sourceOccurrence: 'authored-effect:33333333-3333-4333-8333-333333333333',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: 'While the cinders glow',
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' },
      label: 'Smoulder',
      sourceActor: sourceRef,
      effectDefinition: 'authored:33333333-3333-4333-8333-333333333333:1:3333333333333333333333333333333333333333333333333333333333333333'
    });
    creatureToken.state.conditions = [periodicRecord];

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    // Container aria-label reflects creature, not PC Defending
    const root = screen.getByRole('region', { name: 'Shared creature conditions' });
    expect(root).toBeInTheDocument();

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(periodicSection).toBeInTheDocument();
    expect(within(periodicSection).getByText(/Smoulder · blight damage 1d6 per tick/)).toBeInTheDocument();

    // No tick currently awaiting resolution
    expect(within(periodicSection).getByText('Active — no tick currently awaiting resolution.')).toBeInTheDocument();
  });

  test('Creature with active periodic effect AND due tick: communicates tick awaiting GM resolution and renders GM row', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });

    const periodicRecord = makePeriodicRecord(creatureRef, '44444444-4444-4444-8444-444444444444', {
      sourceOccurrence: 'authored-effect:44444444-4444-4444-8444-444444444444',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: 'While the cinders glow',
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' },
      label: 'Smoulder',
      sourceActor: sourceRef,
      effectDefinition: 'authored:44444444-4444-4444-8444-444444444444:1:4444444444444444444444444444444444444444444444444444444444444444'
    });
    creatureToken.state.conditions = [periodicRecord];

    const dueTick = {
      tickId: 'tick-live-1',
      combatId: CID,
      sequence: 1,
      occurrence: 1,
      of: 3,
      final: false,
      ref: creatureRef,
      recordId: periodicRecord.recordId,
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 1,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-live-1': dueTick }
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(periodicSection).getByText('Periodic tick awaiting GM resolution.')).toBeInTheDocument();
    expect(within(periodicSection).getByRole('heading', { level: 5, name: 'Due periodic ticks (1)' })).toBeInTheDocument();

    // GM resolution row is present
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Periodic effect naturally expired with final due tick: distinguishes expired effect from resolvable final tick', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 2,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });

    // Target conditions are empty: the periodic effect naturally expired upon reaching final occurrence!
    creatureToken.state.conditions = [];

    const finalDueTick = {
      tickId: 'tick-final-3',
      combatId: CID,
      sequence: 5,
      occurrence: 3,
      of: 3,
      final: true,
      ref: creatureRef,
      recordId: '55555555-5555-4555-8555-555555555555',
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 5,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-final-3': finalDueTick }
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    // Section stays visible and explicitly states natural expiry
    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(periodicSection).getByText(/Periodic effect naturally expired\. Final due tick awaiting GM resolution:/)).toBeInTheDocument();
    expect(within(periodicSection).getByText(/last tick; the effect has ended/)).toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Periodic effect removed while due tick remains: does not label as naturally expired, shows removal notice, and retains dismiss-only controls', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });

    // Target conditions are empty: periodic effect was removed while tick 1 remains due!
    creatureToken.state.conditions = [];

    const nonFinalDueTick = {
      tickId: 'tick-live-1',
      combatId: CID,
      sequence: 2,
      occurrence: 1,
      of: 3,
      final: false,
      ref: creatureRef,
      recordId: '55555555-5555-4555-8555-555555555555',
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 2,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-live-1': nonFinalDueTick },
      endedPeriodic: []
    };

    useSharedConditionStore.setState({ combat });

    const { unmount } = render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    // Must NOT label as naturally expired
    expect(within(periodicSection).queryByText(/naturally expired/i)).not.toBeInTheDocument();
    // Must use removed notice
    expect(within(periodicSection).getByText(/Periodic effect removed while due tick remains\. Resolve it by hand and dismiss it:/)).toBeInTheDocument();
    expect(within(periodicSection).getByText(/The periodic effect behind this tick was removed before it was resolved: it cannot be applied automatically\. Resolve it by hand, then dismiss it\./)).toBeInTheDocument();

    // Roll and apply controls must NOT be rendered (dismiss-only!)
    expect(within(periodicSection).queryByRole('button', { name: /Apply tick/ })).not.toBeInTheDocument();
    expect(within(periodicSection).queryByRole('button', { name: /Roll .* in the app/ })).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();

    unmount();

    // Non-GM player view shows neutral / removed notice
    setupStores({ gm: false, combat });
    render(<SharedDefendingEditor targetRef={creatureRef} />);
    const nonGmSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(nonGmSection).getByText('Effect removed — GM resolves by hand')).toBeInTheDocument();
    expect(within(nonGmSection).queryByText(/naturally expired/i)).not.toBeInTheDocument();
  });

  test('Absent periodic effect record with unknown reason: uses neutral wording and retains dismiss-only controls', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });
    creatureToken.state.conditions = [];

    const unknownDueTick = {
      tickId: 'tick-live-unk',
      combatId: CID,
      sequence: 2,
      occurrence: 1,
      of: 3,
      final: false,
      ref: creatureRef,
      recordId: '99999999-9999-4999-8999-999999999999',
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    // effectLifecycle has dueTicks, but endedPeriodic is undefined (no authoritative ending/removal fact)
    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 2,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-live-unk': unknownDueTick }
    };
    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    // Must NOT label as naturally expired
    expect(within(periodicSection).queryByText(/naturally expired/i)).not.toBeInTheDocument();
    // Uses neutral wording
    expect(within(periodicSection).getByText(/Periodic effect record absent\. Due tick awaiting GM resolution:/)).toBeInTheDocument();
    expect(within(periodicSection).getByText(/Periodic effect record absent: it cannot be applied automatically\. Resolve it by hand, then dismiss it\./)).toBeInTheDocument();
    // Dismiss-only
    expect(within(periodicSection).queryByRole('button', { name: /Apply tick/ })).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Retired tick from inactive clock is NOT shown as normally executable', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 0,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });
    creatureToken.state.conditions = [];

    // Retired tick carried over after combat reset (live: false)
    const retiredTick = {
      tickId: 'tick-retired-1',
      combatId: 'old-combat-id',
      sequence: 2,
      occurrence: 1,
      of: 3,
      final: false,
      ref: creatureRef,
      recordId: '66666666-6666-4666-8666-666666666666',
      label: 'Smoulder',
      live: false,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.retiredPeriodicTicks = { 'tick-retired-1': retiredTick };
    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 0,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: {}
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(periodicSection).getByText(/Recorded by a turn clock that is no longer active: it cannot be applied automatically/)).toBeInTheDocument();

    // Roll and apply buttons are hidden; only manual dismissal exists
    expect(within(periodicSection).queryByText(/Roll .* in the app/)).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Non-GM player view enforces read-only authority and preserves privacy', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: pcRef }]
    };
    const { pcToken } = setupStores({ gm: false, combat });

    const stunnedRecord = makeStunnedRecord(pcRef, '77777777-7777-4777-8777-777777777777', {
      sourceOccurrence: 'authored-effect:77777777-7777-4777-8777-777777777777',
      timing: 'authored-target-next-start',
      authoredDuration: '1 round',
      sourceActor: sourceRef
    });

    const attrRecord = makeAttributeRecord(pcRef, '88888888-8888-4888-8888-888888888888', {
      sourceOccurrence: 'authored-effect:88888888-8888-4888-8888-888888888888',
      timing: 'manual',
      authoredDuration: 'Until morning',
      attribute: 'spirit',
      amount: 2,
      label: 'Iron Will'
    });

    pcToken.state.conditions = [stunnedRecord, attrRecord];

    render(<SharedDefendingEditor targetRef={pcRef} />);

    // Non-GM player cannot remove Stunned or apply Stunned
    expect(screen.queryByRole('button', { name: /Apply Stunned source/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Remove Stunned instance/ })).not.toBeInTheDocument();

    // Non-GM player cannot remove Attribute modifier
    expect(screen.queryByRole('button', { name: /Remove Bull Might instance/ })).not.toBeInTheDocument();

    // Private source actor details are NOT rendered
    expect(screen.queryByText(/Source actor:/)).not.toBeInTheDocument();
  });

  test('Final flag on retired tick does not override retired-clock restriction; retains dismiss-only', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 0,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });
    creatureToken.state.conditions = [];

    // Retired tick carried over after combat reset with final: true
    const retiredFinalTick = {
      tickId: 'tick-retired-final',
      combatId: 'old-combat-id',
      sequence: 5,
      occurrence: 3,
      of: 3,
      final: true, // Has final flag!
      ref: creatureRef,
      recordId: '66666666-6666-4666-8666-666666666666',
      label: 'Smoulder',
      live: false, // Turn clock inactive!
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.retiredPeriodicTicks = { 'tick-retired-final': retiredFinalTick };
    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 0,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: {}
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    // Inactive clock banner rendered, final flag does NOT override retired clock
    expect(within(periodicSection).getByText(/Turn clock inactive\. Due tick awaiting GM resolution:/)).toBeInTheDocument();
    expect(within(periodicSection).getByText(/Recorded by a turn clock that is no longer active: it cannot be applied automatically/)).toBeInTheDocument();

    // Roll and apply controls hidden; dismiss-only retained
    expect(within(periodicSection).queryByRole('button', { name: /Apply tick/ })).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Final flag on missing/stale actor does not override stale actor restriction; retains dismiss-only', () => {
    const missingRef = { kind: 'creature', roomId: ROOM_ID, mapId: MAP_ID, tokenId: 'missing-wolf-99' };
    const combat = {
      isActive: true,
      currentTurnIndex: 0,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: missingRef }]
    };
    setupStores({ gm: true, combat }); // missingRef is NOT in creatureTokens!

    const tickForMissingActor = {
      tickId: 'tick-missing-actor-1',
      combatId: CID,
      sequence: 5,
      occurrence: 3,
      of: 3,
      final: true, // Has final flag!
      ref: missingRef,
      recordId: '77777777-7777-4777-8777-777777777777',
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 5,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-missing-actor-1': tickForMissingActor }
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={missingRef} />);

    // Target cannot be located:
    expect(screen.getByText(/No exact room creature for this view/)).toBeInTheDocument();
  });

  test('Replaced or modified periodic effect record does not allow automatic apply; shows changed notice and retains dismiss-only', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });

    const originalRecord = makePeriodicRecord(creatureRef, '99999999-9999-4999-8999-999999999999', {
      sourceOccurrence: 'authored-effect:99999999-9999-4999-8999-999999999999',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: 'While the cinders glow',
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' },
      label: 'Smoulder',
      sourceActor: sourceRef,
      effectDefinition: 'authored:99999999-9999-4999-8999-999999999999:1:9999999999999999999999999999999999999999999999999999999999999999'
    });
    const expectedHash = sha256Hex(canonical(originalRecord));

    // Tampered/modified record with altered formula on the creature token:
    const modifiedRecord = {
      ...originalRecord,
      effects: {
        ...originalRecord.effects,
        periodicFormula: '2d6' // Modified!
      }
    };
    creatureToken.state.conditions = [modifiedRecord];

    const dueTickWithExpectedHash = {
      tickId: 'tick-tampered-1',
      combatId: CID,
      sequence: 3,
      occurrence: 1,
      of: 3,
      final: false,
      ref: creatureRef,
      recordId: originalRecord.recordId,
      recordHash: expectedHash, // Pinned to original hash!
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 3,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-tampered-1': dueTickWithExpectedHash }
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(periodicSection).getByText(/The periodic effect behind this tick was changed or replaced before it was resolved: it cannot be applied automatically\. Resolve it by hand, then dismiss it\./)).toBeInTheDocument();

    // Roll and apply controls hidden; dismiss-only retained
    expect(within(periodicSection).queryByRole('button', { name: /Apply tick/ })).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });

  test('Final flag with lingering condition record on actor is detected as stale; retains dismiss-only', () => {
    const combat = {
      isActive: true,
      currentTurnIndex: 1,
      round: 1,
      turnOrder: [{ actorRef: sourceRef }, { actorRef: creatureRef }]
    };
    const { creatureToken } = setupStores({ gm: true, combat });

    const periodicRecord = makePeriodicRecord(creatureRef, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', {
      sourceOccurrence: 'authored-effect:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      timing: 'authored-target-start-count',
      occurrences: 3,
      authoredDuration: 'While the cinders glow',
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' },
      label: 'Smoulder',
      sourceActor: sourceRef,
      effectDefinition: 'authored:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    });
    // Record still lingering on creatureToken despite final tick:
    creatureToken.state.conditions = [periodicRecord];

    const finalDueTick = {
      tickId: 'tick-final-lingering-1',
      combatId: CID,
      sequence: 5,
      occurrence: 3,
      of: 3,
      final: true, // final tick!
      ref: creatureRef,
      recordId: periodicRecord.recordId,
      recordHash: sha256Hex(canonical(periodicRecord)),
      label: 'Smoulder',
      live: true,
      tick: { kind: 'damage', formula: '1d6', damageType: 'blight' }
    };

    combat.effectLifecycle = {
      version: 1,
      id: CID,
      sequence: 5,
      positionKey: require('../../../services/sharedEffectTiming').positionKey(combat),
      schedules: {},
      dueTicks: { 'tick-final-lingering-1': finalDueTick }
    };

    useSharedConditionStore.setState({ combat });

    render(<SharedDefendingEditor targetRef={creatureRef} />);

    const periodicSection = screen.getByRole('region', { name: 'Active periodic effects' });
    expect(within(periodicSection).getByText(/The periodic effect behind this tick was changed or replaced before it was resolved: it cannot be applied automatically\. Resolve it by hand, then dismiss it\./)).toBeInTheDocument();

    // Roll and apply controls hidden; dismiss-only retained
    expect(within(periodicSection).queryByRole('button', { name: /Apply tick/ })).not.toBeInTheDocument();
    expect(within(periodicSection).getByRole('button', { name: 'Dismiss tick (resolved by hand, no HP change)' })).toBeInTheDocument();
  });
});
