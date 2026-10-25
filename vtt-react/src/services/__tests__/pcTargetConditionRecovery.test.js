import { respondToVoluntaryCondition, registerSpellConsequenceHandlers, useSpellConsequenceStore } from '../spellConsequenceService';
import { requestActorEvent, applyAcceptedConsequence } from '../actorConsequenceService';
jest.mock('../../store/storeRegistry', () => { const state = { character: 'target', room: 'r', socket: null }; return { __state: state, getStore: name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: state.character } : name === 'gameStore' ? { multiplayerRoom: { id: state.room }, multiplayerSocket: state.socket } : {} }) }; });
jest.mock('../spellConsequenceCustody', () => ({ spellContext: () => { const s = jest.requireMock('../../store/storeRegistry').__state, room = s.room; return { uid: 'owner', roomId: room, current: () => s.room === room, accountCurrent: () => true }; }, loadLatestSpell: () => null }));
jest.mock('../sharedConditionCustody', () => { const box = { entries: {} }; return { __box: box, conditionContext: () => jest.requireMock('../spellConsequenceCustody').spellContext(), loadConditionCustody: () => box,
  retainConditionCommand: (_c, key, next) => { box.entries[key] = { ...box.entries[key], ...next }; return box; } }; });
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn(), captureActorDelivery: () => 'captured-delivery', applyAcceptedConsequence: jest.fn(() => true) }));
jest.mock('../actorProjectionOrder', () => ({ captureActorDelivery: () => 'captured-delivery' }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
const state = jest.requireMock('../../store/storeRegistry').__state, box = jest.requireMock('../sharedConditionCustody').__box;
const p = { proposalId: 'proposal', approvalId: 'approval', termsHash: 'exact-terms', target: { kind: 'character', ownerUid: 'owner', characterId: 'target' } };
beforeEach(() => { global.crypto = { randomUUID: () => 'immutable-response-id' }; applyAcceptedConsequence.mockReturnValue(true); state.character = 'target'; state.room = 'r'; box.entries = {}; requestActorEvent.mockReset(); useSpellConsequenceStore.setState({ targetProposals: [p], gmPending: {} }); });
test('lost target acceptance ACK checks original exact bytes; withdrawal is separate and never spending consent', async() => {
  requestActorEvent.mockImplementation(async e => e === 'actor_spell_list' ? { success: true, pending: [], targetProposals: [p] } : { success: false, code: 'room_connection_unavailable' });
  await expect(respondToVoluntaryCondition(p, true)).rejects.toThrow(/unconfirmed/);
  const original = requestActorEvent.mock.calls.find(([e]) => e === 'actor_spell_target_respond')[1];
  requestActorEvent.mockImplementation(async e => e === 'actor_spell_list' ? { success: true, pending: [], targetProposals: [p] } : { success: true });
  await respondToVoluntaryCondition(p, true); expect(requestActorEvent.mock.calls.filter(([e]) => e === 'actor_spell_target_respond').at(-1)[1]).toEqual(original);
  await respondToVoluntaryCondition(p, false); expect(requestActorEvent.mock.calls.filter(([e]) => e === 'actor_spell_target_respond').at(-1)[1]).toEqual({ ...original, accept: false });
  expect(requestActorEvent.mock.calls.some(([e]) => ['actor_consequence', 'actor_spell_approve'].includes(e))).toBe(false);
});
test('old character cannot adopt target consent; stale-room result cannot update custody', async() => {
  state.character = 'other'; await expect(respondToVoluntaryCondition(p, true)).rejects.toThrow(/exact target character/); expect(requestActorEvent).not.toHaveBeenCalled();
  state.character = 'target'; requestActorEvent.mockImplementation(async() => { state.room = 'other'; return { success: true }; }); await respondToVoluntaryCondition(p, true);
  expect(Object.values(box.entries)[0].phase).toBe('prepared');
});
test('closed delivery retires target proposal; retired socket cannot process it; no room_joined registration', () => {
  const handlers = {}, socket = { on: (e, f) => { handlers[e] = f; }, off: jest.fn() }; state.socket = socket;
  const cleanup = registerSpellConsequenceHandlers({ socket }); expect(handlers.room_joined).toBeUndefined();
  state.socket = {}; handlers.actor_spell_closed({ roomId: 'r', approvalId: p.approvalId }); expect(useSpellConsequenceStore.getState().targetProposals).toEqual([p]);
  state.socket = socket; handlers.actor_spell_closed({ roomId: 'r', approvalId: p.approvalId }); expect(useSpellConsequenceStore.getState().targetProposals).toEqual([]); cleanup();
});
test('consumed target response uses authoritative silent receipt reconciliation before clearing recovery work', async() => {
  const receipt = { version: 1, roomId: 'r', actors: [] };
  requestActorEvent.mockImplementation(async e => e === 'actor_spell_list' ? { success: true, pending: [], targetProposals: [] } : { success: true, receipt, actorSnapshot: { maps: {} } });
  await respondToVoluntaryCondition(p, true);
  expect(applyAcceptedConsequence).toHaveBeenLastCalledWith({ success: true, receipt, actorSnapshot: { maps: {} } }, 'captured-delivery', { live: false });
  expect(useSpellConsequenceStore.getState().targetProposals).toEqual([]); expect(Object.values(box.entries)[0].phase).toBe('accepted');
});
