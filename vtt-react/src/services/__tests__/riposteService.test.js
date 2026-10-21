import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { approveRiposte, checkRiposteApproval, checkRiposteCommand, withdrawRiposte, retainRiposteRoll, refreshRiposte, bindRiposte, useRiposteStore, executeRiposte } from '../riposteService';
import { requestActorEvent, refreshActorSnapshot, findActor, prepareActorCommand, submitPreparedActorCommand } from '../actorConsequenceService';
jest.mock('../riposteCustody', () => {
  const box = { value: null }; return { __box: box, riposteContext: () => ({ uid: 'u', roomId: 'r', current: () => true }),
    loadRiposteCustody: () => box.value, retainRiposteCustody: (_c, patch) => { box.value = JSON.parse(JSON.stringify({ owner: {}, gm: {}, offers: {}, ...box.value, ...patch })); } };
});
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn(), refreshActorSnapshot: jest.fn(), findActor: jest.fn(), prepareActorCommand: jest.fn(), submitPreparedActorCommand: jest.fn() }));
jest.mock('../actorProjectionOrder', () => ({ captureActorDelivery: () => ({}), currentActorDelivery: () => true }));
jest.mock('../spellConsequenceService', () => ({ ownerSource: () => ({ ref: mockSource }) }));
jest.mock('../../persistence/bootstrapPrivacyGate', () => ({ isPrivateProjectionIsolated: () => false }));
jest.mock('../reactionWindowService', () => ({ reactionPrincipal: () => {
  const get = require('../../store/storeRegistry').getStore;
  return JSON.stringify([get('authStore').getState().user.uid, get('gameStore').getState().isGMMode]);
} }));
const box = jest.requireMock('../riposteCustody').__box;
const mockSource = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'p1', ownerUid: 'u', characterId: 'c' };
const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'f1' };
const opportunity = { id: 'opp', source: mockSource, target, proof: 'private-proof', status: 'ready' };
let game, cleanup;
const flush = async() => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
beforeEach(async() => {
  global.crypto = { randomUUID: require('crypto').randomUUID }; box.value = null; jest.clearAllMocks();
  game = create(() => ({ isGMMode: false, multiplayerRoom: { id: 'r' } })); registerStore('gameStore', game);
  registerStore('authStore', create(() => ({ user: { uid: 'u' } })));
  registerStore('characterStore', create(() => ({ stats: { strength: 10, agility: 10 }, equipment: {} })));
  findActor.mockReturnValue({}); refreshActorSnapshot.mockResolvedValue({ success: true, actionEpoch: 'e', commitSequence: 0 });
  requestActorEvent.mockImplementation(event => Promise.resolve(event === 'actor_riposte_list' ? { success: true, viewerRole: 'owner', opportunities: [opportunity] } : { success: true, pending: [] }));
  cleanup = bindRiposte({ on: jest.fn(), off: jest.fn() }); await flush();
});
afterEach(() => cleanup());
test('C2 authoritative Stunned refusal retains command and roll as refused, allowing explicit GM revalidation', async() => {
  const command = { commandId: 'original-c2-command', actors: [] };
  box.value = { gm: { opp: { command, phase: 'unknown' } }, owner: { opp: { roll: { mode: 'physical', faces: [3] } } } };
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'actor_stunned' });
  await checkRiposteCommand('opp');
  expect(box.value.gm.opp.phase).toBe('refused'); expect(box.value.gm.opp.command).toEqual(command);
  expect(box.value.owner.opp.roll).toEqual({ mode: 'physical', faces: [3] });
});
test('recorded physical faces survive unknown ACK, exact retry and consent withdrawal; no replacement roll/approval', async() => {
  retainRiposteRoll(opportunity, { slot: 'mainHand', mode: 'physical', faces: [3] });
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  await approveRiposte(opportunity); const original = box.value.owner.opp.approval;
  expect(original.price).toEqual({ ap: 1 }); expect(original.target).toEqual(target);
  expect(() => retainRiposteRoll(opportunity, { slot: 'mainHand', mode: 'digital', faces: [2] })).toThrow(/retained/);
  await expect(approveRiposte(opportunity)).rejects.toThrow(/existing approval/);
  requestActorEvent.mockResolvedValueOnce({ success: false, code: 'awaiting_gm' }); await checkRiposteApproval('opp');
  const calls = requestActorEvent.mock.calls.filter(([event]) => event === 'actor_strike_approve');
  expect(calls[1][1]).toEqual(original);
  requestActorEvent.mockResolvedValueOnce({ success: true, code: 'withdrawn' }); await withdrawRiposte('opp');
  expect(box.value.owner.opp.roll).toEqual({ mode: 'physical', faces: [3] });
});
test('older failures and old bindings cannot erase a newer projection', async() => {
  let old; requestActorEvent.mockImplementationOnce(() => new Promise(resolve => { old = resolve; }));
  const pending = refreshRiposte(); await flush();
  requestActorEvent.mockImplementation(event => Promise.resolve(event === 'actor_riposte_list' ? { success: true, viewerRole: 'owner', opportunities: [{ ...opportunity, status: 'consumed' }] } : { success: true, pending: [] }));
  await refreshRiposte(); old({ success: false, code: 'unavailable' }); await pending;
  expect(useRiposteStore.getState().opportunities[0].status).toBe('consumed');
});
test('concurrent owner preparations cannot allocate/emit two approval IDs across snapshot awaits', async() => {
  retainRiposteRoll(opportunity, { slot: 'mainHand', mode: 'physical', faces: [3] });
  let snapshot; refreshActorSnapshot.mockReturnValueOnce(new Promise(resolve => { snapshot = resolve; }));
  const first = approveRiposte(opportunity);
  await expect(approveRiposte(opportunity)).rejects.toThrow(/preparation is already pending/);
  snapshot({ success: true, actionEpoch: 'e', commitSequence: 0 }); await first;
  expect(requestActorEvent.mock.calls.filter(([event]) => event === 'actor_strike_approve')).toHaveLength(1);
});
test('concurrent GM preparations cannot replace exact unknown command custody', async() => {
  game.setState({ isGMMode: true });
  const p = { ...opportunity, parentKeys: { attack: 'a', parry: 'p' }, offerHash: 'h' };
  useRiposteStore.setState({ opportunities: [p] });
  const pc = { id: 'pc', mapId: 'm', ownerUserId: 'u', position: { x: 25, y: 25 }, character: { id: 'c', actionPoints: { current: 2 }, tempActionPoints: 1 }, state: { actorContract: { version: 1, primary: true, revision: 0, ...mockSource } } };
  const foe = { id: 'foe', mapId: 'm', position: { x: 75, y: 25 }, state: { currentHp: 20, tempHealth: 0, actorContract: { version: 1, revision: 0, ...target } } };
  registerStore('characterTokenStore', create(() => ({ characterTokens: [pc] }))); registerStore('creatureStore', create(() => ({ creatureTokens: [foe] })));
  findActor.mockImplementation(ref => ref.kind === 'character' ? pc : foe);
  const entry = { contentHash: 'approved', approval: { roomId: 'r', opportunityId: 'opp', approvalId: 'a', source: mockSource, target, weapon: {}, roll: { mode: 'physical', faces: [3] } } };
  let snapshot; refreshActorSnapshot.mockReturnValueOnce(new Promise(resolve => { snapshot = resolve; }));
  prepareActorCommand.mockImplementation((actors, extra) => ({ commandId: crypto.randomUUID(), actors, ...extra }));
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'outcome_unknown' });
  const first = executeRiposte(entry, { outcome: 'hit', amount: 3, confirmed: true });
  await expect(executeRiposte(entry, { outcome: 'hit', amount: 4, confirmed: true })).rejects.toThrow(/preparation is already pending/);
  snapshot({ success: true }); await first;
  expect(submitPreparedActorCommand).toHaveBeenCalledTimes(1);
  expect(box.value.gm.opp.command).toEqual(submitPreparedActorCommand.mock.calls[0][0]);
});
