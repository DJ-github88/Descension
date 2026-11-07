/** M5 client resolution custody: retired ticks are dismiss-only; apply reads the target revision from a fresh snapshot. */
import { resolvePeriodicTick } from '../sharedConditionService';
import { refreshActorSnapshot, requestActorEvent, findActor } from '../actorConsequenceService';

jest.mock('../../store/storeRegistry', () => ({ getStore: name => ({ getState: () => name === 'gameStore'
  ? { multiplayerRoom: { id: 'r' }, isGMMode: true, isInMultiplayer: true }
  : name === 'authStore' ? { user: { uid: 'gm' } } : name === 'characterStore' ? { currentCharacterId: null } : {} }) }));
jest.mock('../actorProjectionOrder', () => ({ captureActorDelivery: () => ({ socket: { connected: true } }), currentActorDelivery: () => true }));
jest.mock('../../persistence/bootstrapPrivacyGate', () => ({ getBootstrapGateState: () => ({ accountGeneration: 1 }), isPrivateProjectionIsolated: () => false }));
jest.mock('../sharedConditionCustody', () => { const box = { entries: {} }; return { __box: box, conditionContext: () => ({ roomId: 'r', uid: 'gm', current: () => true }),
  loadConditionCustody: () => ({ entries: box.entries }), retainConditionCommand: (_c, key, value) => { box.entries[key] = value; } }; });
jest.mock('../actorConsequenceService', () => ({ refreshActorSnapshot: jest.fn(), requestActorEvent: jest.fn(), prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(), findActor: jest.fn(), refOf: token => token?.state?.actorContract }));
jest.mock('../silentRoomHydration', () => ({ hydrateCombatSnapshot: () => {} }));
jest.mock('../roomRejoinBus', () => ({ onRoomRejoined: () => () => {} }));
jest.mock('../shieldBashResult', () => ({}));

const box = jest.requireMock('../sharedConditionCustody').__box;
const ref = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'b', instanceId: 'i' };
const tick = { tickId: 't1', recordId: 'rec', ref, tick: { formula: '1d6' } };
const snap = combat => ({ success: true, actionEpoch: 'e', commitSequence: 4, combat, actorSnapshot: { actorProjection: { epoch: 'e', cut: 4 } } });
beforeEach(() => { box.entries = {}; refreshActorSnapshot.mockReset(); requestActorEvent.mockReset(); findActor.mockReset(); global.crypto = { randomUUID: require('crypto').randomUUID }; });

test('a retired tick (combat ended/restarted) cannot be applied from the client; dismissal is sent once with no HP fields', async () => {
  refreshActorSnapshot.mockResolvedValue(snap({ retiredPeriodicTicks: { t1: { tickId: 't1' } }, effectLifecycle: null }));
  await expect(resolvePeriodicTick(tick, { mode: 'apply', roll: {}, finalAmount: 3 })).rejects.toThrow(/Resolve it by hand and dismiss it/);
  expect(requestActorEvent).not.toHaveBeenCalled();
  requestActorEvent.mockResolvedValue({ success: true, receipt: { commandId: 'x', roomId: 'r', actors: [] } });
  await resolvePeriodicTick(tick, { mode: 'dismiss', adjustmentReason: 'resolved by hand' });
  expect(requestActorEvent).toHaveBeenCalledTimes(1);
  const [event, command] = requestActorEvent.mock.calls[0];
  expect(event).toBe('actor_periodic_resolve');
  expect(command).toMatchObject({ tickId: 't1', mode: 'dismiss', adjustmentReason: 'resolved by hand' });
  expect(command).not.toHaveProperty('finalAmount'); expect(command).not.toHaveProperty('expectedRevision');
});

test('apply reads the expected revision after a fresh target snapshot, and sends nothing when that refresh fails', async () => {
  let revision = 7;
  refreshActorSnapshot.mockResolvedValue(snap({ effectLifecycle: { dueTicks: {} } }));
  findActor.mockImplementation(() => ({ state: { actorContract: { ...ref, revision } } }));
  refreshActorSnapshot.mockResolvedValueOnce(snap({ effectLifecycle: { dueTicks: { t1: { tickId: 't1' } } } }))
    .mockImplementationOnce(async () => { revision = 9; return snap({ effectLifecycle: { dueTicks: { t1: { tickId: 't1' } } } }); });
  requestActorEvent.mockResolvedValue({ success: true, receipt: { commandId: 'x', roomId: 'r', actors: [] } });
  await resolvePeriodicTick(tick, { mode: 'apply', roll: { mode: 'physical' }, finalAmount: 4 });
  expect(requestActorEvent.mock.calls[0][1]).toMatchObject({ mode: 'apply', expectedRevision: 9, finalAmount: 4 });

  box.entries = {}; requestActorEvent.mockReset();
  refreshActorSnapshot.mockResolvedValueOnce(snap({ effectLifecycle: { dueTicks: { t1: { tickId: 't1' } } } })).mockResolvedValueOnce({ success: false, code: 'socket_unavailable' });
  await expect(resolvePeriodicTick(tick, { mode: 'apply', roll: {}, finalAmount: 4 })).rejects.toThrow(/could not be refreshed/);
  expect(requestActorEvent).not.toHaveBeenCalled();
});

// Recovery-UI repair: the retained entry outlives the due-tick row and is checked with the exact original bytes.
const { checkPeriodicTick, retainedTickCommands, useSharedConditionStore } = require('../sharedConditionService');
test('dropped ACK: the retained command survives the tick leaving the room, is resent byte-identical (no new id, no reroll) and recovers one original receipt', async () => {
  findActor.mockImplementation(() => ({ state: { actorContract: { ...ref, revision: 3 } } }));
  const open = snap({ effectLifecycle: { dueTicks: { t1: { tickId: 't1' } } } }), gone = snap({ effectLifecycle: { dueTicks: {} } });
  refreshActorSnapshot.mockResolvedValueOnce(open).mockResolvedValueOnce(open).mockResolvedValue(gone);
  const roll = { mode: 'physical', dice: [{ sides: 6, faces: [3] }], constant: 0, reading: '1d6', total: 3 };
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'request_timeout' });
  await resolvePeriodicTick({ ...tick, occurrence: 2, of: 3, label: 'Gloomrot', tick: { kind: 'damage', formula: '1d6' } }, { mode: 'apply', roll, finalAmount: 3 });
  const sent = requestActorEvent.mock.calls[0][1];
  let [item] = retainedTickCommands(useSharedConditionStore.getState().saved);
  expect(item).toMatchObject({ tickId: 't1', commandId: sent.commandId, outcome: 'unknown', finalAmount: 3, tick: { occurrence: 2, of: 3, label: 'Gloomrot' } });
  // The tick is no longer due (server consumed it); a fresh resolve attempt is refused locally and sends nothing.
  await expect(resolvePeriodicTick(tick, { mode: 'apply', roll, finalAmount: 3 })).rejects.toThrow(/Check the original command/);
  expect(requestActorEvent).toHaveBeenCalledTimes(1);
  // GM-reload equivalent: in-memory view cleared; only device custody remains (restored by the next server refresh).
  useSharedConditionStore.setState({ saved: null, views: {} });
  expect(retainedTickCommands(useSharedConditionStore.getState().saved)).toEqual([]);
  // Checking replays the same bytes; the server returns the original receipt.
  const uuid = jest.spyOn(global.crypto, 'randomUUID');
  requestActorEvent.mockResolvedValueOnce({ success: true, receipt: { commandId: sent.commandId, roomId: 'r', submitterUid: 'gm', actors: [] } });
  await checkPeriodicTick('t1');
  expect(uuid).not.toHaveBeenCalled(); uuid.mockRestore();
  expect(requestActorEvent).toHaveBeenCalledTimes(2);
  expect(requestActorEvent.mock.calls[1]).toEqual(['actor_periodic_resolve', sent]);
  [item] = retainedTickCommands(useSharedConditionStore.getState().saved);
  expect(item).toMatchObject({ commandId: sent.commandId, outcome: 'applied', receiptCommandId: sent.commandId });
});
test('retained outcomes: refused, dismissed and other-room entries are distinguished and filtered', () => {
  const entry = (tickId, phase, mode, room = 'r', code) => ({ kind: 'periodic-tick', ref: ['periodic-tick', room, tickId], phase, command: { roomId: room, commandId: `c-${tickId}`, tickId, mode }, ...(code ? { result: { success: false, code } } : {}) });
  const saved = { entries: { a: entry('a', 'failed', 'apply', 'r', 'periodic_tick_stale'), b: entry('b', 'accepted', 'dismiss'), c: entry('c', 'unknown', 'apply'), d: entry('d', 'unknown', 'apply', 'other-room'), e: { kind: 'turn-boundary', ref: ['turn-lifecycle', 'r'], command: { roomId: 'r', commandId: 'x' }, phase: 'unknown' } } };
  const list = retainedTickCommands(saved);
  expect(list.map(i => [i.tickId, i.outcome, i.code])).toEqual([['c', 'unknown', null], ['a', 'refused', 'periodic_tick_stale'], ['b', 'dismissed', null]]);
});

test('review F1: a resent uncertain tick command answered "already resolved" stays unconfirmed (possibly this command), never "refused"; a later check can still confirm it', async () => {
  findActor.mockImplementation(() => ({ state: { actorContract: { ...ref, revision: 3 } } }));
  const open = snap({ effectLifecycle: { dueTicks: { t1: { tickId: 't1' } } } });
  refreshActorSnapshot.mockResolvedValueOnce(open).mockResolvedValueOnce(open).mockResolvedValue(snap({ effectLifecycle: { dueTicks: {} } }));
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'request_timeout' });
  await resolvePeriodicTick({ ...tick, occurrence: 1, of: 2, label: 'Rot', tick: { kind: 'damage', formula: '1d6' } }, { mode: 'apply', roll: { mode: 'physical', dice: [{ sides: 6, faces: [2] }], constant: 0, reading: '1d6', total: 2 }, finalAmount: 2 });
  const sent = requestActorEvent.mock.calls[0][1];
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'tick_already_resolved' });
  await checkPeriodicTick('t1');
  let [item] = retainedTickCommands(useSharedConditionStore.getState().saved);
  expect(item).toMatchObject({ commandId: sent.commandId, outcome: 'consumed', code: 'tick_already_resolved' });
  requestActorEvent.mockResolvedValueOnce({ success: true, receipt: { commandId: sent.commandId, roomId: 'r', submitterUid: 'gm', actors: [] } });
  await checkPeriodicTick('t1');
  expect(requestActorEvent.mock.calls.slice(1).map(c => c[1])).toEqual([sent, sent]);
  [item] = retainedTickCommands(useSharedConditionStore.getState().saved);
  expect(item.outcome).toBe('applied');
});
