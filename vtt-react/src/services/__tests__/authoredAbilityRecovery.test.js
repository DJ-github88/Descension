import { useSpellConsequenceStore, changeAuthoredAdmission, checkAuthoredAdmission, gmAcceptSpell, gmCheckSpellCommand, refreshSpellApprovals } from '../spellConsequenceService';
import { requestActorEvent, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand } from '../actorConsequenceService';

jest.mock('../../store/storeRegistry', () => ({ getStore: name => ({ getState: () => name === 'gameStore' ? { multiplayerRoom: { id: 'r' }, multiplayerSocket: 'socket' } : name === 'characterStore' ? { currentCharacterId: 'c' } : {} }) }));
jest.mock('../spellConsequenceCustody', () => ({ spellContext: () => ({ uid: 'u', roomId: 'r', current: () => true }), loadLatestSpell: () => null, unresolvedSpell: () => false }));
jest.mock('../sharedConditionCustody', () => {
  const box = { entries: {} };
  return { conditionContext: () => ({ uid: 'u', roomId: 'r', current: () => true }), loadConditionCustody: () => box,
    retainConditionCommand: (_c, key, v) => { const old = box.entries[key]; if (old?.command && v.command.commandId !== old.command.commandId && !['failed', 'accepted'].includes(old.phase)) throw Error('Unknown cannot be replaced'); box.entries[key] = { ...old, ...JSON.parse(JSON.stringify(v)) }; return box; }, __box: box };
});
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn(), refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(), submitPreparedActorCommand: jest.fn(), retryActorCommand: jest.fn() }));
jest.mock('../spellConsequence', () => ({ planSpellCommand: () => ({ entries: [], extra: {} }), spellReceipt: () => null, gmRefusal: () => ({ phase: 'refused' }) }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
const box = jest.requireMock('../sharedConditionCustody').__box;
const approval = { approvalId: 'a', source: { mapId: 'm' }, spell: { definitionId: 'authored:exact' } };
beforeEach(() => { box.entries = {}; jest.clearAllMocks(); useSpellConsequenceStore.setState({ gmStatus: {}, gmPending: { a: { approval, contentHash: 'hash' } } });
  requestActorEvent.mockImplementation(async event => event === 'actor_authored_list' ? { success: true, entries: [], revision: 0 } : { success: false, code: 'outcome_unknown' });
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r' }); prepareActorCommand.mockReturnValue({ version: 1, roomId: 'r', commandId: 'original-command', approval: { approvalId: 'a' }, adjudication: { chosenResult: 'original bytes' } });
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'outcome_unknown' });
  global.crypto = { randomUUID: () => 'original-request' };
});
test('unknown admission blocks replacement and original check retains exact request ID/bytes', async() => {
  await changeAuthoredAdmission('admit', { authoredDefinitionId: 'd' }, 'arcanoneer');
  const emitted = requestActorEvent.mock.calls.find(([e]) => e === 'actor_authored_admit')[1];
  expect(box.entries['authored-registry'].phase).toBe('unknown');
  await expect(changeAuthoredAdmission('admit', { authoredDefinitionId: 'other' }, 'arcanoneer')).rejects.toThrow(/unknown/i);
  await checkAuthoredAdmission();
  expect(requestActorEvent.mock.calls.filter(([e]) => e === 'actor_authored_admit').map(([, bytes]) => bytes)).toEqual([emitted, emitted]);
});
test('repeated GM confirmation of unknown cannot prepare/reroll/pay a replacement', async() => {
  const input = { finalAmount: 3, adjudicated: true };
  await gmAcceptSpell('a', input); await gmAcceptSpell('a', { ...input, finalAmount: 99 });
  expect(prepareActorCommand).toHaveBeenCalledTimes(1); expect(submitPreparedActorCommand).toHaveBeenCalledTimes(1);
  expect(box.entries['authored-spell:a'].phase).toBe('unknown');
});
test('reload restores unknown original command from device custody; exact check recovers acceptance', async() => {
  await gmAcceptSpell('a', { finalAmount: 3, adjudicated: true });
  const original = JSON.parse(JSON.stringify(box.entries['authored-spell:a'].command));
  useSpellConsequenceStore.setState({ gmStatus: {}, gmPending: {} });
  requestActorEvent.mockResolvedValueOnce({ success: true, pending: [{ approval, contentHash: 'hash' }] });
  await refreshSpellApprovals(); expect(useSpellConsequenceStore.getState().gmStatus.a.phase).toBe('unknown');
  submitPreparedActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted-live' });
  await gmCheckSpellCommand('a'); expect(submitPreparedActorCommand.mock.calls.at(-1)[0]).toEqual(original);
  expect(box.entries['authored-spell:a'].phase).toBe('accepted'); expect(prepareActorCommand).toHaveBeenCalledTimes(1);
});
test('known refusal permits explicit revalidation, with old command retained in custody owner', async() => {
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'stale_actor_revision' });
  await gmAcceptSpell('a', { finalAmount: 3, adjudicated: true });
  expect(box.entries['authored-spell:a'].phase).toBe('failed');
  await gmAcceptSpell('a', { finalAmount: 3, adjudicated: true }); expect(prepareActorCommand).toHaveBeenCalledTimes(2);
});
