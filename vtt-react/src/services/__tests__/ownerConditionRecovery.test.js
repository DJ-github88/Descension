import { checkSpellApproval, withdrawSpellApproval, registerSpellConsequenceHandlers, useSpellConsequenceStore } from '../spellConsequenceService';
import { requestActorEvent } from '../actorConsequenceService';
import { notifyRoomRejoined, roomRejoinSubscriberCount } from '../roomRejoinBus';

jest.mock('../../store/storeRegistry', () => { const state = { character: 'c', uid: 'owner', socket: 'socket', room: 'r' }; return { __state: state, getStore: name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: state.character } : name === 'gameStore' ? { multiplayerRoom: state.room ? { id: state.room } : null, multiplayerSocket: state.socket, isGMMode: true } : {} }) }; });
jest.mock('../spellConsequenceCustody', () => { const box = { latest: null }; return { __box: box, spellContext: () => { const state = jest.requireMock('../../store/storeRegistry').__state, roomId = state.room; return { uid: 'owner', roomId, accountCurrent: () => true, current: () => state.room === roomId }; }, loadLatestSpell: () => box.latest, retainLatestSpell: (_c, v) => { box.latest = { ...v, custody: 'Device retained' }; return box.latest; }, unresolvedSpell: v => !!v?.approval }; });
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn() }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
jest.mock('../sharedConditionCustody', () => ({ loadConditionCustody: () => null }));
const box = jest.requireMock('../spellConsequenceCustody').__box, state = jest.requireMock('../../store/storeRegistry').__state;
beforeEach(() => { state.character = 'c'; state.room = 'r'; requestActorEvent.mockReset(); box.latest = { phase: 'unknown', sent: true, custody: 'Device retained', approval: { roomId: 'r', approvalId: 'original', source: { kind: 'character', ownerUid: 'owner', characterId: 'c' }, spell: { kind: 'condition', definitionId: 'authored:original' }, conditionTerms: { conditionKey: 'stunned', timing: { durationText: 'Authored boundary' } }, roll: null } }; });
test('lost owner ACK checks original condition bytes; positive withdrawal retry retains terms without dummy roll', async () => {
  const original = JSON.parse(JSON.stringify(box.latest.approval)); requestActorEvent.mockResolvedValueOnce({ success: false, code: 'awaiting_gm', contentHash: 'h' }); await checkSpellApproval(); expect(requestActorEvent).toHaveBeenLastCalledWith('actor_spell_approve', original); expect(box.latest.phase).toBe('awaiting');
  requestActorEvent.mockResolvedValueOnce({ success: true, code: 'withdrawn', contentHash: 'h' }); await withdrawSpellApproval(); expect(requestActorEvent).toHaveBeenLastCalledWith('actor_spell_withdraw', { roomId: 'r', approvalId: 'original', approval: original }); expect(box.latest.phase).toBe('withdrawn'); expect(box.latest.draft).toBeNull(); expect(box.latest.approval).toEqual(original);
});
test('another character cannot adopt, resend or withdraw original condition consent', async () => {
  state.character = 'other'; await checkSpellApproval(); expect(requestActorEvent).not.toHaveBeenCalled(); await expect(withdrawSpellApproval()).rejects.toThrow(/original character/); expect(box.latest.phase).toBe('unknown');
});
test('same-room bus refreshes pending work and admission, never approval/consequence; unrelated socket ignored, cleanup unsubscribes', async () => {
  const handlers = {}, socket = { on: (e, f) => { handlers[e] = f; }, off: jest.fn() }; state.socket = socket;
  requestActorEvent.mockImplementation(async e => e === 'actor_spell_list' ? { success: true, pending: [{ approval: box.latest.approval, contentHash: 'h' }] } : { success: true, entries: [], revision: 0 });
  const before = roomRejoinSubscriberCount(), cleanup = registerSpellConsequenceHandlers({ socket }); expect(roomRejoinSubscriberCount()).toBe(before + 1);
  notifyRoomRejoined({ socket: {}, roomId: 'r' }); expect(requestActorEvent).not.toHaveBeenCalled(); notifyRoomRejoined({ socket, roomId: 'r' }); await Promise.resolve(); await Promise.resolve();
  expect(requestActorEvent.mock.calls.map(([e]) => e).sort()).toEqual(['actor_authored_list', 'actor_spell_list']); expect(useSpellConsequenceStore.getState().gmPending.original).toBeDefined(); expect(handlers.room_joined).toBeUndefined(); cleanup(); expect(roomRejoinSubscriberCount()).toBe(before);
});
test('handlers registered before initial join accept current-room pending events and subsequent rejoin', async () => {
  const handlers = {}, socket = { on: (e, f) => { handlers[e] = f; }, off: jest.fn() }; state.socket = socket; state.room = null;
  const cleanup = registerSpellConsequenceHandlers({ socket }); state.room = 'r'; useSpellConsequenceStore.setState({ gmPending: {} });
  handlers.actor_spell_pending({ roomId: 'r', approval: box.latest.approval, contentHash: 'h' }); expect(useSpellConsequenceStore.getState().gmPending.original).toBeDefined();
  requestActorEvent.mockResolvedValue({ success: true, entries: [], revision: 0, pending: [] }); notifyRoomRejoined({ socket, roomId: 'r' }); await Promise.resolve(); await Promise.resolve(); expect(requestActorEvent.mock.calls.map(([e]) => e).sort()).toEqual(['actor_authored_list', 'actor_spell_list']); cleanup();
});
