import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { bindSharedConditions, editDefending, editSharedCondition, checkConditionCommand, resolveConditionActor } from '../sharedConditionService';
import { conditionContext, loadConditionCustody, retainConditionCommand } from '../sharedConditionCustody';
import { canonical, makeDefendingRecord, makeStunnedRecord } from '../sharedConditionProfile';
import { refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand } from '../actorConsequenceService';

jest.mock('../actorConsequenceService', () => ({ refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(), submitPreparedActorCommand: jest.fn(),
  findActor: ref => require('../../store/storeRegistry').getStore('characterTokenStore').getState().characterTokens.find(t => t.id === ref?.tokenId),
  refOf: token => token?.state?.actorContract ? Object.fromEntries(['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'].map(k => [k, token.state.actorContract[k]])) : null }));
const ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
let game, tokens, cleanup;
beforeEach(() => {
  global.crypto = { randomUUID: require('crypto').randomUUID }; localStorage.clear(); resetBootstrapGateForTests();
  activatePrivateScope({ scopeKind: 'user', scopeId: 'u' }); jest.clearAllMocks();
  registerStore('authStore', create(() => ({ user: { uid: 'u' } })));
  registerStore('characterStore', create(() => ({ currentCharacterId: 'c' })));
  const socket = { connected: true, on: jest.fn(), off: jest.fn() };
  game = create(() => ({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, multiplayerSocket: socket })); registerStore('gameStore', game);
  tokens = create(() => ({ characterTokens: [{ id: 'pc', state: { actorContract: { version: 1, primary: true, revision: 0, ...ref }, conditions: [] } }] }));
  registerStore('characterTokenStore', tokens);
  refreshActorSnapshot.mockResolvedValue({ success: true });
  prepareActorCommand.mockImplementation((actors, extra) => ({ commandId: crypto.randomUUID(), actors, ...extra }));
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'outcome_unknown' }); cleanup = bindSharedConditions(socket);
});
afterEach(() => cleanup());
test('C2 Stunned uses same custody/accepted actor, independent source identity and exact timing edits/removal', async() => {
  const id = crypto.randomUUID(), first = makeStunnedRecord(ref, id, { sourceOccurrence: 'critical-1', timing: 'critical-one-round' });
  tokens.getState().characterTokens[0].state.conditions.push(first);
  expect((await editSharedCondition(ref, 'add', { sourceOccurrence: 'critical-1', timing: 'manual' })).code).toBe('already_active');
  expect(prepareActorCommand).not.toHaveBeenCalled();
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'stale_actor_revision' });
  await editSharedCondition(ref, 'add', { sourceOccurrence: 'bash-2', timing: 'shield-bash-target-end' });
  const command = prepareActorCommand.mock.results[0].value, newRecord = command.actors[0].conditions[0].record;
  expect(newRecord.recordId).not.toBe(id); expect(newRecord.clockBoundary).toBe('shield-bash-target-end');
  expect(tokens.getState().characterTokens[0].state.conditions).toEqual([first]);
  await editSharedCondition(ref, 'update', { recordId: id, timing: 'manual' });
  const update = prepareActorCommand.mock.results[1].value.actors[0].conditions[0];
  expect(update.op).toBe('update'); expect(update.record.sourceEntityId).toBe('critical-1'); expect(update.record.recordId).toBe(id);
  await editSharedCondition(ref, 'remove', { recordId: id });
  expect(prepareActorCommand.mock.results[2].value.actors[0].conditions).toEqual([{ op: 'remove', recordId: id }]);
});
test('C2 unknown Stunned command survives duplicate, disconnected and foreign-account recovery without activation', async() => {
  await editSharedCondition(ref, 'add', { sourceOccurrence: 'critical-1' });
  const original = loadConditionCustody().entries[canonical(ref)].command;
  await expect(editSharedCondition(ref, 'add', { sourceOccurrence: 'other' })).rejects.toThrow(/unknown/);
  await checkConditionCommand(ref); expect(submitPreparedActorCommand.mock.calls[1][0]).toEqual(original);
  expect(tokens.getState().characterTokens[0].state.conditions).toEqual([]);
  game.getState().multiplayerSocket.connected = false; await expect(checkConditionCommand(ref)).rejects.toThrow(/connected/);
  activatePrivateScope({ scopeKind: 'user', scopeId: 'other' }); expect(loadConditionCustody()).toBeNull();
});
test('exact inspection identity never falls back; accepted active records make repeated Apply a no-op', async() => {
  expect(resolveConditionActor({ identity: { ownerUid: 'else', characterId: 'c' } })).toBeNull();
  expect(resolveConditionActor({ targetRef: { ...ref, instanceId: 'retired' } })).toBeNull();
  tokens.getState().characterTokens[0].state.conditions.push(makeDefendingRecord(ref, crypto.randomUUID()));
  expect((await editDefending(ref, 'add')).code).toBe('already_active'); expect(prepareActorCommand).not.toHaveBeenCalled();
});
test('persist-before-emit unknown command is immutable, exact retry only, and never activates locally', async() => {
  submitPreparedActorCommand.mockImplementation(async command => {
    expect(loadConditionCustody().entries[canonical(ref)].command).toEqual(command);
    return { success: false, code: 'outcome_unknown' };
  });
  await editDefending(ref, 'add'); const original = loadConditionCustody().entries[canonical(ref)].command;
  expect(tokens.getState().characterTokens[0].state.conditions).toEqual([]);
  await expect(editDefending(ref, 'add')).rejects.toThrow(/unknown/); await checkConditionCommand(ref);
  expect(submitPreparedActorCommand.mock.calls.map(([c]) => c)).toEqual([original, original]);
  expect(() => retainConditionCommand(conditionContext(), canonical(ref), { command: { ...original, commandId: crypto.randomUUID() }, phase: 'unknown' })).toThrow(/cannot be replaced/);
});
test('concurrent preparation and role change across the snapshot await cannot emit duplicate or stale commands', async() => {
  let resolve; refreshActorSnapshot.mockReturnValueOnce(new Promise(r => { resolve = r; }));
  const pending = editDefending(ref, 'add'); await expect(editDefending(ref, 'add')).rejects.toThrow(/already pending/);
  game.setState({ isGMMode: true }); resolve({ success: true }); await pending;
  expect(submitPreparedActorCommand).not.toHaveBeenCalled();
});
test('disconnected checks preserve unknown custody; accepted history cannot be erased or rebound', async() => {
  await editDefending(ref, 'add'); const entry = loadConditionCustody().entries[canonical(ref)];
  game.getState().multiplayerSocket.connected = false; await expect(checkConditionCommand(ref)).rejects.toThrow(/connected/);
  expect(submitPreparedActorCommand).toHaveBeenCalledTimes(1);
  retainConditionCommand(conditionContext(), canonical(ref), { ...entry, phase: 'accepted' });
  retainConditionCommand(conditionContext(), canonical(ref), { command: { commandId: 'second' }, phase: 'unknown' });
  expect(loadConditionCustody().entries[canonical(ref)].history[0].command).toEqual(entry.command);
  expect(() => retainConditionCommand(conditionContext(), canonical(ref), { command: { commandId: 'second' }, phase: 'unknown', history: [] })).toThrow(/immutable/);
  activatePrivateScope({ scopeKind: 'user', scopeId: 'other' }); expect(loadConditionCustody()).toBeNull();
});
