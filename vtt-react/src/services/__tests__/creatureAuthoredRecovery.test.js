import { prepareCreatureAbility, cancelCreatureAbility, revalidateCreatureContext, useSpellConsequenceStore, gmCheckSpellCommand, refreshSpellApprovals } from '../spellConsequenceService';
import { requestActorEvent, refreshActorSnapshot, submitPreparedActorCommand } from '../actorConsequenceService';
import { newItemAbility } from '../itemAuthoredAbility';
import { definitionFromWizard, actionId } from '../authoredAbility';

jest.mock('../../store/storeRegistry', () => ({ getStore: name => ({ getState: () => name === 'gameStore' ? { multiplayerRoom: { id: 'r' }, multiplayerSocket: 'socket', isGMMode: true } : {} }) }));
jest.mock('../spellConsequenceCustody', () => {
  const box = { latest: null };
  return { spellContext: () => ({ uid: 'gm', roomId: 'r', current: () => true }), loadLatestSpell: () => box.latest, unresolvedSpell: r => !!r?.approval && ['awaiting', 'unknown', 'prepared', 'unresolved'].includes(r.phase),
    retainLatestSpell: (_c, value) => { box.latest = JSON.parse(JSON.stringify({ ...value, custody: 'Device retained' })); return box.latest; }, __box: box };
});
jest.mock('../sharedConditionCustody', () => {
  const box = { entries: {} };
  return { conditionContext: () => ({ uid: 'gm', roomId: 'r', current: () => true }), loadConditionCustody: () => box, retainConditionCommand: (_c, k, v) => { box.entries[k] = { ...box.entries[k], ...v }; }, __box: box };
});
jest.mock('../actorConsequenceService', () => ({ requestActorEvent: jest.fn(), refreshActorSnapshot: jest.fn(), submitPreparedActorCommand: jest.fn(), findActor: () => ({ state: { actorContract: { revision: 3 } } }) }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
jest.mock('../blockingService', () => {
  const box = { gm: {} };
  return { __box: box, loadBlockingCustody: () => box, gmOfferAuthoredAbility: jest.fn(), gmCancelOffer: jest.fn() };
});
const box = jest.requireMock('../spellConsequenceCustody').__box, commands = jest.requireMock('../sharedConditionCustody').__box;
let entry, grant, source, target, roll, association;
beforeEach(() => {
  jest.clearAllMocks(); commands.entries = {}; useSpellConsequenceStore.setState({ gmPending: {}, gmStatus: {} });
  const blocking = jest.requireMock('../blockingService'); blocking.__box.gm = {}; blocking.gmOfferAuthoredAbility.mockResolvedValue({ commandId: 'attempt-original' }); blocking.gmCancelOffer.mockResolvedValue({ success: true });
  source = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'source', instanceId: 'source-incarnation' }; target = { ...source, tokenId: 'target', instanceId: 'target-incarnation' };
  association = newItemAbility('33333333-3333-4333-8333-333333333333');
  entry = { canonicalDefinition: definitionFromWizard(association.record, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' }).definition,
    definitionRef: { roomId: 'r', definitionId: association.record.authoredDefinitionId, definitionVersion: 1, definitionHash: 'a'.repeat(64) }, descriptor: { price: { ap: 1, mana: 0 }, effect: { damageTypes: ['arcane'] } } };
  grant = { requestId: 'old-admission', gmUid: 'gm', associationHash: 'b'.repeat(64), definitionRef: entry.definitionRef };
  roll = { mode: 'physical', dice: [{ sides: 6, faces: [4] }], constant: 0, total: 4, reading: '1d6' };
  box.latest = { route: 'creature', phase: 'draft', creature: { source, target, entry, grant, roll, attemptId: 'attempt-original', actionEpoch: 'epoch', baseCommitSequence: 0 }, draft: { roll }, custody: 'Device retained' };
  global.crypto = { randomUUID: () => 'fresh-validation-id' };
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r', actionEpoch: 'epoch', commitSequence: 2 });
  requestActorEvent.mockImplementation(async e => e === 'actor_authored_list' ? { success: true, revision: 1, entries: [entry], creatureSources: [{ source, admission: { ...grant, requestId: 'fresh-admission' }, association }] } : e === 'actor_spell_withdraw' ? { success: true, code: 'withdrawn' } : { success: false, code: 'awaiting_gm', contentHash: 'hash' });
});
test('physical evidence and attempt bytes persist before emission and explicit repeated validation keeps faces/identity', async () => {
  await prepareCreatureAbility(); const original = JSON.parse(JSON.stringify(box.latest.approval));
  expect(box.latest.phase).toBe('awaiting'); expect(original.roll).toEqual(roll); expect(original.source.kind).toBe('creature');
  await prepareCreatureAbility(); expect(requestActorEvent.mock.calls.filter(([e]) => e === 'actor_spell_prepare_creature').map(([, a]) => a)).toEqual([original, original]);
});
test('pruned attempt is unresolved, blocks cancellation/material replacement and retains original faces', async () => {
  requestActorEvent.mockResolvedValue({ success: false, code: 'retry_window_expired' }); await prepareCreatureAbility();
  expect(box.latest.phase).toBe('unresolved'); await expect(cancelCreatureAbility()).rejects.toThrow(/unknown|unavailable/); await expect(revalidateCreatureContext()).rejects.toThrow(/Resolve/); expect(box.latest.creature.roll).toEqual(roll);
});
test('failed withdrawal never implies reconciliation or permits a replacement roll', async () => {
  await prepareCreatureAbility(); box.latest.phase = 'refused'; requestActorEvent.mockResolvedValue({ success: false, code: 'approval_consumed' });
  await expect(cancelCreatureAbility()).rejects.toThrow(/Cannot prove cancellation/); expect(box.latest.phase).toBe('refused'); expect(box.latest.creature.roll).toEqual(roll);
});
test('explicit material revalidation positively closes old approval and retains its bytes, target and faces under new identity', async () => {
  await prepareCreatureAbility(); const prior = JSON.parse(JSON.stringify(box.latest.approval)); await revalidateCreatureContext();
  expect(box.latest.phase).toBe('draft'); expect(box.latest.creature.roll).toEqual(roll); expect(box.latest.creature.target).toEqual(target); expect(box.latest.creature.grant.requestId).toBe('fresh-admission'); expect(box.latest.attemptHistory[0].approval).toEqual(prior);
  await prepareCreatureAbility(); expect(box.latest.approval.approvalId).toBe('fresh-validation-id'); expect(box.latest.approval.sourceAuthority.admissionId).toBe('fresh-admission'); expect(box.latest.approval.roll).toEqual(prior.roll);
});
test('reload retains pruned command as unresolved and exact checking never prepares another command', async () => {
  await prepareCreatureAbility(); const id = box.latest.approval.approvalId;
  const command = { commandId: 'original-command', approval: { approvalId: id }, source, adjudication: { definitionId: actionId(entry.definitionRef) } };
  commands.entries[`authored-spell:${id}`] = { kind: 'authored-execution', phase: 'failed', command, result: { success: false, code: 'retry_window_expired' } };
  requestActorEvent.mockResolvedValueOnce({ success: true, pending: [] }); await refreshSpellApprovals(); expect(useSpellConsequenceStore.getState().gmStatus[id].phase).toBe('unresolved');
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'retry_window_expired' }); await gmCheckSpellCommand(id);
  expect(commands.entries[`authored-spell:${id}`].phase).toBe('unresolved'); expect(submitPreparedActorCommand).toHaveBeenCalledWith(command); await expect(revalidateCreatureContext()).rejects.toThrow(/cannot be replaced/);
});
test('A5 compatible material refresh closes the old offer then adopts current A4 admission with the same faces', async () => {
  target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'pc-incarnation', ownerUid: 'owner', characterId: 'pc-character' };
  box.latest.creature.target = target;
  await prepareCreatureAbility({ proposedAmount: 4, blockApplicable: true, ruling: 'GM rules blocking applicable' });
  const prior = JSON.parse(JSON.stringify(box.latest.approval)), blocking = jest.requireMock('../blockingService'); blocking.__box.gm['attempt-original'] = { phase: 'offered' };
  await revalidateCreatureContext();
  expect(blocking.gmCancelOffer).toHaveBeenCalledWith('attempt-original'); expect(box.latest.creature.grant.requestId).toBe('fresh-admission'); expect(box.latest.creature.roll).toEqual(roll);
  expect(box.latest.attemptHistory[0].approval).toEqual(prior); expect(box.latest.pcOffer).toBeUndefined();
  await prepareCreatureAbility({ proposedAmount: 5, blockApplicable: false, ruling: 'Revised proposal requires new owner acceptance' });
  expect(blocking.gmOfferAuthoredAbility.mock.calls[1][0]).toMatchObject({ approvalId: 'fresh-validation-id', sourceAuthority: { admissionId: 'fresh-admission' }, roll });
});
test('A5 pre-emission failure restores same-face draft, but retained unknown offer cannot be replaced', async () => {
  box.latest.creature.target = { ...target, kind: 'character', ownerUid: 'owner', characterId: 'pc-character' };
  const blocking = jest.requireMock('../blockingService'); blocking.gmOfferAuthoredAbility.mockRejectedValue(Error('snapshot unavailable before custody'));
  await expect(prepareCreatureAbility({ proposedAmount: 4, ruling: 'GM ruling' })).rejects.toThrow(/snapshot/);
  expect(box.latest.approval).toBeUndefined(); expect(box.latest.creature.roll).toEqual(roll);
  blocking.gmOfferAuthoredAbility.mockImplementation(async a => { blocking.__box.gm[a.approvalId] = { phase: 'unknown' }; throw Error('lost offer ACK'); });
  await expect(prepareCreatureAbility({ proposedAmount: 4, ruling: 'GM ruling' })).rejects.toThrow(/lost/);
  await expect(revalidateCreatureContext()).rejects.toThrow(/cannot be replaced/); expect(box.latest.creature.roll).toEqual(roll);
});
