/**
 * M5 Periodic Recovery History: Capacity Management and Safe Pruning Tests.
 *
 * Verifies:
 * 1. Near/full capacity (64 entries) demonstrates the original capacity limitation.
 * 2. Safe clearing of confirmed entries makes room for another retained command.
 * 3. Pending and unconfirmed entries remain byte-identical (never cleared).
 * 4. Room and principal isolation (cross-room and cross-user boundaries preserved).
 * 5. Reload persistence (cleared entries remain cleared, preserved remain intact).
 * 6. No network request, no new command, no reroll, no HP or payment change during clear.
 * 7. Existing lost-ACK recovery flow continues to work after clearing.
 */
import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import {
  bindSharedConditions,
  checkPeriodicTick,
  retainedTickCommands,
  clearRetainedPeriodicTick,
  clearConfirmedPeriodicHistory,
  useSharedConditionStore,
  tickRef,
  isRetainedTickEligible
} from '../sharedConditionService';
import {
  conditionContext,
  loadConditionCustody,
  retainConditionCommand,
  clearRetainedPeriodicEntries
} from '../sharedConditionCustody';
import { canonical } from '../sharedConditionProfile';
import { refreshActorSnapshot, requestActorEvent } from '../actorConsequenceService';

jest.mock('../actorConsequenceService', () => ({
  refreshActorSnapshot: jest.fn(),
  prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(),
  requestActorEvent: jest.fn(),
  reconcileActorMirrors: jest.fn(),
  hydrateActorConditions: jest.fn(),
  findActor: ref => require('../../store/storeRegistry').getStore('characterTokenStore').getState().characterTokens.find(t => t.id === ref?.tokenId),
  refOf: token => token?.state?.actorContract ? Object.fromEntries(['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'].map(k => [k, token.state.actorContract[k]])) : null
}));
jest.mock('../silentRoomHydration', () => ({ hydrateCombatSnapshot: () => {} }));
jest.mock('../roomRejoinBus', () => ({ onRoomRejoined: () => () => {} }));
jest.mock('../shieldBashResult', () => ({}));

const targetRef = { kind: 'creature', roomId: 'room-1', mapId: 'm1', tokenId: 'tok1', instanceId: 'inst1', revision: 1 };
const snap = (combat = {}) => ({
  success: true,
  actionEpoch: 'ep-1',
  commitSequence: 10,
  roomId: 'room-1',
  combat: {
    isActive: true,
    currentTurnIndex: 0,
    round: 1,
    turnOrder: [{ tokenId: 'tok1', actorRef: targetRef }],
    effectLifecycle: { dueTicks: {} },
    ...combat
  },
  actorSnapshot: { actorProjection: { version: 1, roomId: 'room-1', epoch: 'ep-1', cut: 10 } }
});

let game, tokens, cleanup;

function setupEnvironment({ uid = 'gm-user', roomId = 'room-1', isGM = true } = {}) {
  if (cleanup) cleanup();
  localStorage.clear();
  resetBootstrapGateForTests();
  activatePrivateScope({ scopeKind: 'user', scopeId: uid });
  jest.clearAllMocks();

  global.crypto = {
    randomUUID: require('crypto').randomUUID,
    getRandomValues: arr => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    }
  };

  registerStore('authStore', create(() => ({ user: { uid } })));
  registerStore('characterStore', create(() => ({ currentCharacterId: null })));

  const socket = { connected: true, on: jest.fn(), off: jest.fn(), emit: jest.fn() };
  game = create(() => ({
    isInMultiplayer: true,
    isGMMode: isGM,
    multiplayerRoom: { id: roomId },
    multiplayerSocket: socket
  }));
  registerStore('gameStore', game);

  tokens = create(() => ({
    characterTokens: [{
      id: 'tok1',
      state: {
        actorContract: { version: 1, primary: true, revision: 1, ...targetRef },
        conditions: [],
        hp: 30,
        resources: { mana: 10 }
      }
    }]
  }));
  registerStore('characterTokenStore', tokens);

  refreshActorSnapshot.mockResolvedValue(snap());
  cleanup = bindSharedConditions(socket);
}

beforeEach(() => {
  setupEnvironment();
});

afterEach(() => {
  if (cleanup) cleanup();
});

function makeTickEntry(tickId, { phase = 'accepted', mode = 'apply', roomId = 'room-1', code = null, finalAmount = 3 } = {}) {
  const ref = tickRef(tickId);
  const command = {
    version: 1,
    roomId,
    commandId: `cmd-${tickId}-0000-0000-0000-000000000000`.slice(0, 36),
    tickId,
    mode,
    actionEpoch: 'ep-1',
    baseCommitSequence: 10,
    ...(mode === 'apply' ? { expectedRevision: 1, roll: { mode: 'physical', dice: [{ sides: 6, faces: [3] }], total: 3 }, finalAmount } : {})
  };
  const result = phase === 'accepted'
    ? { success: true, receipt: { commandId: command.commandId, roomId, submitterUid: 'gm-user', actors: [] } }
    : code ? { success: false, code } : null;
  return {
    kind: 'periodic-tick',
    ref,
    command,
    operation: mode,
    recordId: `rec-${tickId}`,
    phase,
    result,
    tick: { tickId, occurrence: 1, of: 3, label: 'Burning', kind: 'damage', formula: '1d6', target: targetRef }
  };
}

describe('M5 Periodic Command History Capacity Management', () => {
  test('1. demonstrates original capacity problem: custody rejects 65th command when 64 completed entries exist', () => {
    const ctx = conditionContext();
    expect(ctx.current()).toBe(true);

    // Populate exactly 64 accepted periodic tick entries in device custody
    for (let i = 1; i <= 64; i++) {
      const id = `tick-${String(i).padStart(3, '0')}`;
      const key = canonical(tickRef(id));
      const entry = makeTickEntry(id, { phase: 'accepted', mode: 'apply' });
      retainConditionCommand(ctx, key, entry);
    }

    const savedBefore = loadConditionCustody(ctx);
    expect(Object.keys(savedBefore.entries)).toHaveLength(64);

    // Attempting to retain a 65th entry throws "Condition custody capacity — no new command emitted."
    const id65 = 'tick-065';
    const key65 = canonical(tickRef(id65));
    const entry65 = makeTickEntry(id65, { phase: 'unknown', mode: 'apply' });

    expect(() => retainConditionCommand(ctx, key65, entry65)).toThrow(/Condition custody capacity — no new command emitted/);

    // Verify custody entries count did not exceed 64
    const savedAfter = loadConditionCustody(ctx);
    expect(Object.keys(savedAfter.entries)).toHaveLength(64);
    expect(savedAfter.entries[key65]).toBeUndefined();
  });

  test('2. safe clearing makes room for another retained command', () => {
    const ctx = conditionContext();

    // Populate 64 confirmed entries
    for (let i = 1; i <= 64; i++) {
      const id = `tick-${String(i).padStart(3, '0')}`;
      retainConditionCommand(ctx, canonical(tickRef(id)), makeTickEntry(id, { phase: 'accepted', mode: i % 2 === 0 ? 'dismiss' : 'apply' }));
    }
    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });

    expect(Object.keys(loadConditionCustody(ctx).entries)).toHaveLength(64);

    // Clear confirmed periodic history
    const clearedCount = clearConfirmedPeriodicHistory();
    expect(clearedCount).toBe(64);

    const savedAfterClear = loadConditionCustody(ctx);
    expect(Object.keys(savedAfterClear.entries)).toHaveLength(0);

    // Now retaining a new command succeeds without throwing capacity error
    const newId = 'tick-new-01';
    const newKey = canonical(tickRef(newId));
    const newEntry = makeTickEntry(newId, { phase: 'unknown', mode: 'apply' });
    expect(() => retainConditionCommand(ctx, newKey, newEntry)).not.toThrow();

    const savedFinal = loadConditionCustody(ctx);
    expect(savedFinal.entries[newKey]).toBeDefined();
    expect(savedFinal.entries[newKey].command.commandId).toBe(newEntry.command.commandId);
  });

  test('3. pending, unconfirmed, and refused entries remain byte-identical; only confirmed entries are cleared', () => {
    const ctx = conditionContext();

    // Create 1 pending/unknown entry
    const pending = makeTickEntry('pending-1', { phase: 'unknown', mode: 'apply' });
    const pendingKey = canonical(tickRef('pending-1'));
    retainConditionCommand(ctx, pendingKey, pending);

    // Create 1 unconfirmed consumed entry (F1: tick_already_resolved)
    const consumed = makeTickEntry('consumed-1', { phase: 'unknown', mode: 'apply', code: 'tick_already_resolved' });
    const consumedKey = canonical(tickRef('consumed-1'));
    retainConditionCommand(ctx, consumedKey, consumed);

    // Create 1 definitive refusal entry
    const refused = makeTickEntry('refused-1', { phase: 'failed', mode: 'apply', code: 'periodic_tick_stale' });
    const refusedKey = canonical(tickRef('refused-1'));
    retainConditionCommand(ctx, refusedKey, refused);

    // Create 1 non-periodic entry (turn boundary)
    const turnKey = canonical(['turn-lifecycle', 'room-1']);
    const turnEntry = {
      kind: 'turn-boundary',
      ref: ['turn-lifecycle', 'room-1'],
      command: { roomId: 'room-1', commandId: 'turn-cmd-1', mode: 'advance' },
      phase: 'accepted'
    };
    retainConditionCommand(ctx, turnKey, turnEntry);

    // Create 3 confirmed periodic tick entries (eligible)
    const conf1 = makeTickEntry('conf-1', { phase: 'accepted', mode: 'apply' });
    const conf2 = makeTickEntry('conf-2', { phase: 'accepted', mode: 'dismiss' });
    const conf3 = makeTickEntry('conf-3', { phase: 'accepted', mode: 'apply' });
    retainConditionCommand(ctx, canonical(tickRef('conf-1')), conf1);
    retainConditionCommand(ctx, canonical(tickRef('conf-2')), conf2);
    retainConditionCommand(ctx, canonical(tickRef('conf-3')), conf3);

    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });
    const storedBefore = loadConditionCustody(ctx).entries;
    expect(Object.keys(storedBefore)).toHaveLength(7);

    // Capture exact retained bytes in custody before clear
    const expectedPending = storedBefore[pendingKey];
    const expectedConsumed = storedBefore[consumedKey];
    const expectedRefused = storedBefore[refusedKey];
    const expectedTurn = storedBefore[turnKey];

    // Verify eligibility classifications
    expect(isRetainedTickEligible(conf1)).toBe(true);
    expect(isRetainedTickEligible(conf2)).toBe(true);
    expect(isRetainedTickEligible(conf3)).toBe(true);
    expect(isRetainedTickEligible(pending)).toBe(false);
    expect(isRetainedTickEligible(consumed)).toBe(false);
    expect(isRetainedTickEligible(refused)).toBe(false);
    expect(isRetainedTickEligible(turnEntry)).toBe(false);

    // Attempting to clear an ineligible entry individually throws an error
    expect(() => clearRetainedPeriodicTick('pending-1')).toThrow(/Only definitively confirmed periodic tick history/);
    expect(() => clearRetainedPeriodicTick('consumed-1')).toThrow(/Only definitively confirmed periodic tick history/);
    expect(() => clearRetainedPeriodicTick('refused-1')).toThrow(/Only definitively confirmed periodic tick history/);

    // Also verify direct custody helper throws if an unconfirmed or non-periodic key is passed
    expect(() => clearRetainedPeriodicEntries(ctx, [pendingKey])).toThrow(/Unconfirmed or pending periodic tick cannot be cleared/);
    expect(() => clearRetainedPeriodicEntries(ctx, [consumedKey])).toThrow(/Unconfirmed or pending periodic tick cannot be cleared/);
    expect(() => clearRetainedPeriodicEntries(ctx, [refusedKey])).toThrow(/Unconfirmed or pending periodic tick cannot be cleared/);
    expect(() => clearRetainedPeriodicEntries(ctx, [turnKey])).toThrow(/Only periodic tick recovery history can be cleared/);

    // Clear confirmed entries
    const cleared = clearConfirmedPeriodicHistory();
    expect(cleared).toBe(3);

    // Verify the remaining entries are EXACTLY byte-identical to pre-clear custody bytes
    const remaining = loadConditionCustody(ctx).entries;
    expect(Object.keys(remaining)).toHaveLength(4);

    expect(canonical(remaining[pendingKey])).toBe(canonical(expectedPending));
    expect(canonical(remaining[consumedKey])).toBe(canonical(expectedConsumed));
    expect(canonical(remaining[refusedKey])).toBe(canonical(expectedRefused));
    expect(canonical(remaining[turnKey])).toBe(canonical(expectedTurn));

    // Confirm individual clear works on an eligible entry
    retainConditionCommand(ctx, canonical(tickRef('conf-single')), makeTickEntry('conf-single', { phase: 'accepted', mode: 'apply' }));
    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });
    expect(loadConditionCustody(ctx).entries[canonical(tickRef('conf-single'))]).toBeDefined();

    clearRetainedPeriodicTick('conf-single');
    expect(loadConditionCustody(ctx).entries[canonical(tickRef('conf-single'))]).toBeUndefined();
  });

  test('4. account and room isolation: cross-room and cross-principal boundaries are strictly preserved', () => {
    const ctxRoom1 = conditionContext();

    // Seed 2 confirmed entries in Room 1 for gm-user
    retainConditionCommand(ctxRoom1, canonical(tickRef('r1-tick1')), makeTickEntry('r1-tick1', { phase: 'accepted', roomId: 'room-1' }));
    retainConditionCommand(ctxRoom1, canonical(tickRef('r1-tick2')), makeTickEntry('r1-tick2', { phase: 'accepted', roomId: 'room-1' }));

    // Switch to Room 2 without wiping localStorage
    game.setState({ multiplayerRoom: { id: 'room-2' } });
    bindSharedConditions(game.getState().multiplayerSocket);
    const ctxRoom2 = conditionContext();
    retainConditionCommand(ctxRoom2, canonical(tickRef('r2-tick1')), makeTickEntry('r2-tick1', { phase: 'accepted', roomId: 'room-2' }));

    // In Room 2, clearing clears Room 2 entries only
    expect(clearConfirmedPeriodicHistory()).toBe(1);
    expect(Object.keys(loadConditionCustody(ctxRoom2).entries)).toHaveLength(0);

    // Switch back to Room 1: Room 1 entries are completely intact
    game.setState({ multiplayerRoom: { id: 'room-1' } });
    bindSharedConditions(game.getState().multiplayerSocket);
    const reloadedRoom1 = loadConditionCustody(conditionContext());
    expect(Object.keys(reloadedRoom1.entries)).toHaveLength(2);

    // Cross-room clear attempt through custody helper throws
    const fakeCrossRoomEntry = {
      ...makeTickEntry('fake-cross', { phase: 'accepted', roomId: 'room-2' }),
      ref: ['periodic-tick', 'room-2', 'fake-cross']
    };
    const fakeKey = canonical(['periodic-tick', 'room-1', 'fake-cross']);
    const record = { ...reloadedRoom1, entries: { ...reloadedRoom1.entries, [fakeKey]: fakeCrossRoomEntry } };
    require('../../persistence/scopedNativeFamily').createScopedNativeFamily({ familyId: 'room.sharedConditionLatest.v1' }).save(record, ['room-1']);
    expect(() => clearRetainedPeriodicEntries(conditionContext(), [fakeKey])).toThrow(/Cannot clear periodic tick history from another room/);

    // Non-GM user cannot clear periodic tick history
    game.setState({ isGMMode: false });
    expect(() => clearConfirmedPeriodicHistory()).toThrow(/Current GM required/);
    expect(() => clearRetainedPeriodicTick('r1-tick1')).toThrow(/Current GM required/);
  });

  test('5. reload persistence: cleared entries remain absent; preserved entries survive store resets and reloads', () => {
    const ctx = conditionContext();
    const tickA = makeTickEntry('tick-confirmed', { phase: 'accepted', mode: 'apply' });
    const tickB = makeTickEntry('tick-pending', { phase: 'unknown', mode: 'apply' });

    retainConditionCommand(ctx, canonical(tickRef('tick-confirmed')), tickA);
    retainConditionCommand(ctx, canonical(tickRef('tick-pending')), tickB);
    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });
    const pendingCustodyBefore = loadConditionCustody(ctx).entries[canonical(tickRef('tick-pending'))];

    // Clear confirmed
    clearConfirmedPeriodicHistory();

    // Verify in-memory store
    expect(retainedTickCommands(useSharedConditionStore.getState().saved)).toHaveLength(1);
    expect(retainedTickCommands(useSharedConditionStore.getState().saved)[0].tickId).toBe('tick-pending');

    // Simulate full page reload: wipe in-memory Zustand store completely
    useSharedConditionStore.setState({ principal: null, views: {}, saved: null, combat: null, combatHash: null, clockProjection: null, clockPhase: 'unavailable' });
    expect(useSharedConditionStore.getState().saved).toBeNull();

    // Re-bind / restore from disk storage
    const restored = loadConditionCustody(conditionContext());
    expect(restored.entries[canonical(tickRef('tick-confirmed'))]).toBeUndefined();
    expect(restored.entries[canonical(tickRef('tick-pending'))]).toBeDefined();
    expect(restored.entries[canonical(tickRef('tick-pending'))].command.commandId).toBe(tickB.command.commandId);
    expect(canonical(restored.entries[canonical(tickRef('tick-pending'))])).toBe(canonical(pendingCustodyBefore));
  });

  test('6. no network request, new command, reroll, HP or payment change occurs during clearing', () => {
    const ctx = conditionContext();
    retainConditionCommand(ctx, canonical(tickRef('t1')), makeTickEntry('t1', { phase: 'accepted', mode: 'apply', finalAmount: 5 }));
    retainConditionCommand(ctx, canonical(tickRef('t2')), makeTickEntry('t2', { phase: 'accepted', mode: 'dismiss' }));
    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });

    const socket = game.getState().multiplayerSocket;
    const initialHP = tokens.getState().characterTokens[0].state.hp;
    const initialMana = tokens.getState().characterTokens[0].state.resources.mana;
    const initialRevision = tokens.getState().characterTokens[0].state.actorContract.revision;

    const uuidSpy = jest.spyOn(global.crypto, 'randomUUID');
    socket.emit.mockClear();
    requestActorEvent.mockClear();

    // Perform clear
    clearConfirmedPeriodicHistory();

    // Assert zero side effects
    expect(socket.emit).not.toHaveBeenCalled();
    expect(requestActorEvent).not.toHaveBeenCalled();
    expect(uuidSpy).not.toHaveBeenCalled();

    const tokenAfter = tokens.getState().characterTokens[0];
    expect(tokenAfter.state.hp).toBe(initialHP);
    expect(tokenAfter.state.resources.mana).toBe(initialMana);
    expect(tokenAfter.state.actorContract.revision).toBe(initialRevision);

    uuidSpy.mockRestore();
  });

  test('7. lost-ACK recovery flow continues to work seamlessly after capacity clearing', async () => {
    const ctx = conditionContext();

    // Seed 10 confirmed entries + 1 uncertain entry (dropped ACK)
    for (let i = 1; i <= 10; i++) {
      const id = `old-${i}`;
      retainConditionCommand(ctx, canonical(tickRef(id)), makeTickEntry(id, { phase: 'accepted', mode: 'apply' }));
    }

    const uncertainId = 'lost-ack-tick';
    const uncertainEntry = makeTickEntry(uncertainId, { phase: 'unknown', mode: 'apply', finalAmount: 4 });
    retainConditionCommand(ctx, canonical(tickRef(uncertainId)), uncertainEntry);
    useSharedConditionStore.setState({ saved: loadConditionCustody(ctx) });

    // GM clears confirmed periodic history
    clearConfirmedPeriodicHistory();

    // The uncertain entry is still there
    const items = retainedTickCommands(useSharedConditionStore.getState().saved);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ tickId: uncertainId, commandId: uncertainEntry.command.commandId, outcome: 'unknown' });

    // Server recovers receipt upon checkPeriodicTick
    requestActorEvent.mockResolvedValueOnce({
      success: true,
      receipt: {
        commandId: uncertainEntry.command.commandId,
        roomId: 'room-1',
        submitterUid: 'gm-user',
        actors: []
      }
    });

    const uuidSpy = jest.spyOn(global.crypto, 'randomUUID');
    await checkPeriodicTick(uncertainId);

    // Verify:
    // - Same exact command bytes resent (no new UUID, no new command)
    expect(uuidSpy).not.toHaveBeenCalled();
    expect(requestActorEvent).toHaveBeenCalledTimes(1);
    expect(requestActorEvent.mock.calls[0]).toEqual(['actor_periodic_resolve', uncertainEntry.command]);

    // Outcome transitions to 'applied' with original receipt
    const itemsAfter = retainedTickCommands(useSharedConditionStore.getState().saved);
    expect(itemsAfter).toHaveLength(1);
    expect(itemsAfter[0]).toMatchObject({
      tickId: uncertainId,
      commandId: uncertainEntry.command.commandId,
      outcome: 'applied',
      receiptCommandId: uncertainEntry.command.commandId
    });

    uuidSpy.mockRestore();
  });
});
