import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { notifyRoomRejoined } from '../roomRejoinBus';
import { requestActorEvent } from '../actorConsequenceService';
import { bindReactionWindows, refreshReactionWindows, changeReactionIntent, retryWindowRequest, useReactionWindowStore, resetReactionWindows } from '../reactionWindowService';
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn() }));
let game, auth, listeners, socket, cleanup;
const reactor = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' };
const view = () => ({ windowId: 'window1', epoch: 'epoch1', moment: 'after_roll', openedAt: 1000, deadlineAt: 9000,
  remainingMs: 7000, status: 'open', viewRevision: 0, reactor, intents: [] });
const response = (sequence, windows = [view()], epoch = 'epoch1') => ({ success: true, roomId: 'r', viewerRole: 'owner', epoch, sequence, windows });
const flush = async() => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
beforeEach(() => {
  global.crypto = { randomUUID: require('crypto').randomUUID };
  resetBootstrapGateForTests(); activatePrivateScope({ scopeKind: 'user', scopeId: 'u' }); resetReactionWindows();
  listeners = {}; socket = { connected: true, on: (event, fn) => { listeners[event] = fn; }, off: event => { delete listeners[event]; } };
  game = create(() => ({ multiplayerRoom: { id: 'r' }, multiplayerSocket: socket, isGMMode: false }));
  auth = create(() => ({ user: { uid: 'u' } }));
  registerStore('gameStore', game); registerStore('authStore', auth); registerStore('characterStore', create(() => ({ currentCharacterId: 'c' })));
  requestActorEvent.mockReset().mockResolvedValue(response(1)); cleanup = bindReactionWindows(socket);
});
afterEach(() => cleanup());
test('rejoin recovers the same deadline/current intent without replaying unknown submission', async() => {
  await flush();
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  await changeReactionIntent(useReactionWindowStore.getState().windows[0], { cardKey: 'parry', label: 'Parry', note: 'private' });
  const requestId = useReactionWindowStore.getState().pending.payload.requestId;
  const known = { ...view(), intents: [{ cardKey: 'parry', revision: 1, history: [{ requestId, revision: 1, withdrawn: false, note: 'private' }] }] };
  requestActorEvent.mockResolvedValue(response(3, [known]));
  // Correct same-room rejoin may replace the room object. Registration is scoped by socket/account/room ID.
  game.setState({ multiplayerRoom: { id: 'r' } }); notifyRoomRejoined({ socket, roomId: 'r' }); await flush();
  expect(useReactionWindowStore.getState().windows[0].deadlineAt).toBe(9000);
  expect(useReactionWindowStore.getState().windows[0].intents[0].revision).toBe(1);
  expect(useReactionWindowStore.getState().pending).toBeNull();
  expect(requestActorEvent.mock.calls.filter(([event]) => event === 'reaction_window_change')).toHaveLength(1);
  expect(Object.keys(listeners)).not.toContain('room_joined');
});
test('out-of-order replies cannot revert private revision or closed status', async() => {
  await flush(); let resolveOld;
  requestActorEvent.mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve; }));
  const old = refreshReactionWindows();
  requestActorEvent.mockResolvedValueOnce(response(4, [{ ...view(), status: 'closed', remainingMs: 0 }]));
  await refreshReactionWindows(); resolveOld(response(2)); await old;
  expect(useReactionWindowStore.getState().windows[0].status).toBe('closed');
  expect(useReactionWindowStore.getState().sequence).toBe(4);
});
test('retired account, wrong-room notifications and role-mismatched payloads never display private choices', async() => {
  await flush(); const before = requestActorEvent.mock.calls.length;
  notifyRoomRejoined({ socket, roomId: 'other' }); expect(requestActorEvent.mock.calls.length).toBe(before);
  requestActorEvent.mockResolvedValueOnce({ ...response(2), viewerRole: 'gm', windows: [{ ...view(), gmCommit: { note: 'GM_SECRET' } }] });
  await refreshReactionWindows(); expect(useReactionWindowStore.getState().windows).toEqual([]);
  let resolve; requestActorEvent.mockReturnValueOnce(new Promise(r => { resolve = r; }));
  const pending = refreshReactionWindows(); auth.setState({ user: { uid: 'other' } }); resolve(response(3)); await pending;
  expect(useReactionWindowStore.getState().windows).toEqual([]);
  notifyRoomRejoined({ socket, roomId: 'r' }); expect(requestActorEvent.mock.calls.length).toBe(before + 2);
});
test('runtime epoch change drops old collection/pending state, never restores it from a stale reply', async() => {
  await flush(); requestActorEvent.mockResolvedValueOnce(response(2, [], 'epoch2')); await refreshReactionWindows();
  requestActorEvent.mockResolvedValueOnce(response(100, [view()], 'epoch1')); await refreshReactionWindows();
  expect(useReactionWindowStore.getState().epoch).toBe('epoch2'); expect(useReactionWindowStore.getState().windows).toEqual([]);
  expect(useReactionWindowStore.getState().status).toMatch(/unavailable/);
});
test('a first-seen delayed old epoch cannot retire a newer epoch, and rebind fences old continuations', async() => {
  await flush(); let oldReply;
  requestActorEvent.mockReturnValueOnce(new Promise(resolve => { oldReply = resolve; }));
  const old = refreshReactionWindows();
  requestActorEvent.mockResolvedValueOnce(response(1, [], 'new-epoch')); await refreshReactionWindows();
  oldReply(response(100, [view()], 'never-previously-seen')); await old;
  expect(useReactionWindowStore.getState().epoch).toBe('new-epoch');
  let beforeRebind; requestActorEvent.mockReturnValueOnce(new Promise(resolve => { beforeRebind = resolve; }));
  const stale = refreshReactionWindows(); cleanup();
  requestActorEvent.mockResolvedValue(response(2, [], 'new-epoch')); cleanup = bindReactionWindows(socket); await flush();
  beforeRebind(response(200, [view()], 'never-previously-seen')); await stale;
  expect(useReactionWindowStore.getState().epoch).toBe('new-epoch');
});
test('unknown custody survives same-principal socket/host rebind and manual retry uses identical bytes', async() => {
  await flush(); requestActorEvent.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  await changeReactionIntent(useReactionWindowStore.getState().windows[0], { cardKey: 'parry', label: 'Parry', note: 'keep exact bytes' });
  const payload = useReactionWindowStore.getState().pending.payload;
  cleanup(); listeners = {};
  socket = { connected: true, on: (e, fn) => { listeners[e] = fn; }, off: e => { delete listeners[e]; } };
  game.setState({ multiplayerSocket: socket }); requestActorEvent.mockResolvedValue(response(3));
  cleanup = bindReactionWindows(socket); await flush();
  expect(useReactionWindowStore.getState().pending.payload).toEqual(payload);
  expect(requestActorEvent.mock.calls.filter(([event]) => event === 'reaction_window_change')).toHaveLength(1);
  requestActorEvent.mockResolvedValueOnce(response(4, [{ ...view(), intents: [{ cardKey: 'parry', revision: 1, history: [{ requestId: payload.requestId }] }] }]));
  await retryWindowRequest();
  const submissions = requestActorEvent.mock.calls.filter(([event]) => event === 'reaction_window_change');
  expect(submissions).toHaveLength(2); expect(submissions[1][1]).toEqual(payload); expect(useReactionWindowStore.getState().pending).toBeNull();
});
test('late snapshot transit consumes the display estimate, never enables an expired-looking countdown', async() => {
  await flush();
  requestActorEvent.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve(response(8, [{ ...view(), remainingMs: 1 }])), 25)));
  await refreshReactionWindows();
  expect(useReactionWindowStore.getState().windows[0].remainingMs).toBe(0);
  expect(useReactionWindowStore.getState().windows[0].deadlineAt).toBe(9000);
});
test('an old failed read cannot erase a newer authoritative projection', async() => {
  await flush(); let failOld;
  requestActorEvent.mockReturnValueOnce(new Promise(resolve => { failOld = resolve; }));
  const old = refreshReactionWindows();
  requestActorEvent.mockResolvedValueOnce(response(9, [{ ...view(), status: 'closed' }])); await refreshReactionWindows();
  failOld({ success: false, code: 'room_connection_unavailable' }); await old;
  expect(useReactionWindowStore.getState().windows[0].status).toBe('closed');
});
test('verified retired epoch archives exact private evidence and releases the active request slot', async() => {
  await flush(); requestActorEvent.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  await changeReactionIntent(useReactionWindowStore.getState().windows[0], { cardKey: 'parry', label: 'Parry', note: 'retained' });
  const old = useReactionWindowStore.getState().pending;
  requestActorEvent.mockResolvedValueOnce(response(1, [{ ...view(), epoch: 'new-epoch', windowId: 'new-window' }], 'new-epoch'));
  await refreshReactionWindows();
  expect(useReactionWindowStore.getState().pending).toBeNull();
  expect(useReactionWindowStore.getState().interrupted[0].request).toEqual(old);
  requestActorEvent.mockResolvedValueOnce(response(2, [{ ...view(), epoch: 'new-epoch', windowId: 'new-window' }], 'new-epoch'));
  await changeReactionIntent(useReactionWindowStore.getState().windows[0], { cardKey: 'parry', label: 'Parry', note: 'new manual opportunity' });
  expect(requestActorEvent.mock.calls.filter(([event]) => event === 'reaction_window_change')).toHaveLength(2);
});
test('late ACK timeout cannot overwrite a request already reconciled by rejoin status', async() => {
  await flush(); let timeout;
  requestActorEvent.mockReturnValueOnce(new Promise(resolve => { timeout = resolve; }));
  const submitting = changeReactionIntent(useReactionWindowStore.getState().windows[0], { cardKey: 'parry', label: 'Parry', note: 'in flight' });
  const id = useReactionWindowStore.getState().pending.payload.requestId;
  requestActorEvent.mockResolvedValueOnce(response(10, [{ ...view(), intents: [{ cardKey: 'parry', history: [{ requestId: id }] }] }]));
  notifyRoomRejoined({ socket, roomId: 'r' }); await flush();
  expect(useReactionWindowStore.getState().pending).toBeNull();
  timeout({ success: false, code: 'outcome_unknown' }); await submitting;
  expect(useReactionWindowStore.getState().status).not.toMatch(/acknowledgement unknown/);
});
