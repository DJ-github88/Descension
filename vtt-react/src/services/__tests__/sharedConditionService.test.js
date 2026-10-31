import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import { activatePrivateScope, resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { bindSharedConditions, editDefending, editSharedCondition, checkConditionCommand, resolveConditionActor,
  recordShieldBashResult, checkShieldBashResult, shieldBashResults, submitTurnBoundary, checkTurnBoundary, useSharedConditionStore, refreshEffectLifecycle } from '../sharedConditionService';
import useCombatStore from '../../store/combatStore';
import { registerCombatHandlers } from '../../components/multiplayer/socketHandlers/combatHandlers';
import { positionKey } from '../sharedEffectTiming';
import { conditionContext, loadConditionCustody, retainConditionCommand } from '../sharedConditionCustody';
import { canonical, makeDefendingRecord, makeStunnedRecord } from '../sharedConditionProfile';
import { refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent } from '../actorConsequenceService';

jest.mock('../actorConsequenceService', () => ({ refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(), submitPreparedActorCommand: jest.fn(), requestActorEvent: jest.fn(),
  reconcileActorMirrors: jest.fn(), hydrateActorConditions: jest.fn(),
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
  prepareActorCommand.mockImplementation((actors, extra, options = {}) => ({ commandId: options.commandId || crypto.randomUUID(), actors, ...extra }));
  submitPreparedActorCommand.mockResolvedValue({ success: false, code: 'outcome_unknown' }); cleanup = bindSharedConditions(socket);
});
afterEach(() => cleanup());
const bashSource = { ...ref, tokenId: 'source', instanceId: 'source-incarnation', ownerUid: 'gm-source', characterId: 'source-character' };
function currentGM() {
  cleanup(); game.setState({ isGMMode: true }); cleanup = bindSharedConditions(game.getState().multiplayerSocket);
  tokens.getState().characterTokens.push({ id: 'source', state: { actorContract: { version: 1, primary: true, revision: 0, ...bashSource }, conditions: [] } });
}
test('C4 actual legacy end/start callbacks retire clock and no-clock refresh clears ordinary Next Turn fence without outgoing reset; disconnect is unavailable', async() => {
  currentGM(); registerStore('combatStore', useCombatStore);
  const socket = game.getState().multiplayerSocket; socket.emit = jest.fn();
  const combat = { isActive: true, currentTurnIndex: 0, round: 1, turnOrder: [{ tokenId: 'pc', actorRef: ref }, { tokenId: 'source', actorRef: bashSource }] };
  combat.effectLifecycle = { version: 1, id: crypto.randomUUID(), sequence: 0, positionKey: positionKey(combat), schedules: {} };
  let current = combat;
  refreshActorSnapshot.mockImplementation(async() => ({ success: true, roomId: 'r', combat: current, combatHash: 'a'.repeat(64), actionEpoch: 'e', commitSequence: 0,
    actorProjection: { version: 1, roomId: 'r', epoch: 'e', cut: 1 } }));
  await refreshEffectLifecycle(); expect(useCombatStore.getState().effectLifecycle.id).toBe(combat.effectLifecycle.id);
  const disconnect = socket.on.mock.calls.filter(([name]) => name === 'disconnect').slice(-1)[0][1]; socket.connected = false; disconnect();
  expect(useSharedConditionStore.getState().clockPhase).toBe('unavailable'); socket.connected = true;
  await refreshEffectLifecycle();
  registerCombatHandlers({ socket, currentPlayer: { id: 'u' }, addNotification: jest.fn() });
  current = { isActive: false, currentTurnIndex: null, turnOrder: [], round: 0 };
  socket.on.mock.calls.filter(([name]) => name === 'combat_ended').forEach(([, callback]) => callback());
  await Promise.resolve(); await Promise.resolve(); expect(useCombatStore.getState().effectLifecycle).toBeNull();
  current = { ...combat }; delete current.effectLifecycle;
  socket.on.mock.calls.filter(([name]) => name === 'combat_started').forEach(([, callback]) => callback({ combat: current }));
  await Promise.resolve(); await Promise.resolve(); expect(useCombatStore.getState().effectLifecycle).toBeNull();
  expect(useSharedConditionStore.getState().combat.effectLifecycle).toBeUndefined(); expect(socket.emit).not.toHaveBeenCalled();
  // Refresh alone repairs a stale local guard, even if the legacy event was missed.
  useCombatStore.setState({ effectLifecycle: combat.effectLifecycle }); await refreshEffectLifecycle(); expect(useCombatStore.getState().effectLifecycle).toBeNull();
});
test('C4 boundary uses existing persist-before-emission custody, exact unknown retry and no optimistic cursor; accepted zero-actor receipt settles it', async() => {
  currentGM();
  const combat = { isActive: true, currentTurnIndex: 0, round: 1, turnOrder: [{ tokenId: 'pc', actorRef: ref }] };
  const snapshot = () => ({ success: true, roomId: 'r', combat, combatHash: 'a'.repeat(64), actionEpoch: 'e', commitSequence: 0,
    actorProjection: { version: 1, roomId: 'r', epoch: 'e', cut: 0 } });
  refreshActorSnapshot.mockImplementation(async() => snapshot());
  requestActorEvent.mockImplementation(async(event, command) => {
    expect(event).toBe('actor_turn_boundary');
    expect(loadConditionCustody().entries[canonical(['turn-lifecycle', 'r'])].command).toEqual(command);
    return { success: false, code: 'outcome_unknown' };
  });
  await submitTurnBoundary('adopt'); const entry = loadConditionCustody().entries[canonical(['turn-lifecycle', 'r'])];
  expect(entry.kind).toBe('turn-boundary'); expect(useSharedConditionStore.getState().combat).toEqual(combat);
  await expect(submitTurnBoundary('adopt')).rejects.toThrow(/outcome unknown/);
  await checkTurnBoundary(); expect(requestActorEvent.mock.calls.map(([, command]) => command)).toEqual([entry.command, entry.command]);
  requestActorEvent.mockResolvedValue({ success: true, receipt: { roomId: 'r', submitterUid: 'u', commandId: entry.command.commandId, actors: [] } });
  await checkTurnBoundary(); expect(loadConditionCustody().entries[canonical(['turn-lifecycle', 'r'])].phase).toBe('accepted');
});
test('C4 stale boundary response is failed without removing conditions; role change across snapshot cannot send a new turn request', async() => {
  currentGM();
  const combat = { isActive: true, currentTurnIndex: 0, round: 1, turnOrder: [{ tokenId: 'pc', actorRef: ref }] };
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r', combat, combatHash: 'a'.repeat(64), actionEpoch: 'e', commitSequence: 0,
    actorProjection: { version: 1, roomId: 'r', epoch: 'e', cut: 1 } });
  requestActorEvent.mockResolvedValue({ success: false, code: 'stale_turn_state' });
  const record = makeDefendingRecord(ref, crypto.randomUUID()); tokens.getState().characterTokens[0].state.conditions.push(record);
  await submitTurnBoundary('adopt'); expect(loadConditionCustody().entries[canonical(['turn-lifecycle', 'r'])].phase).toBe('failed');
  expect(tokens.getState().characterTokens[0].state.conditions).toEqual([record]);
  let release; refreshActorSnapshot.mockReturnValueOnce(new Promise(resolve => { release = resolve; }));
  const pending = submitTurnBoundary('adopt'); game.setState({ isGMMode: false }); release({ success: true }); await pending;
  expect(requestActorEvent).toHaveBeenCalledTimes(1);
});
test('C3 one result/record/command ID is retained before emission; unknown/rebind/retry cannot replace it or activate locally', async() => {
  currentGM();
  submitPreparedActorCommand.mockImplementation(async command => {
    expect(loadConditionCustody().entries[canonical(ref)].command).toEqual(command);
    expect(command.commandId).toBe(command.actors[0].conditions[0].recordId);
    return { success: false, code: 'outcome_unknown' };
  });
  await recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null });
  const r = shieldBashResults()[0]; expect(r.definitionId).toBe('universal_shield_bash'); expect(r.source).toEqual(bashSource); expect(r.target).toEqual(ref);
  expect(r.command.actors[0].conditions[0].record.clockBoundary).toBe('shield-bash-target-end');
  expect(tokens.getState().characterTokens[0].state.conditions).toEqual([]);
  await expect(recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null })).rejects.toThrow(/unknown/);
  cleanup(); cleanup = bindSharedConditions(game.getState().multiplayerSocket);
  expect(shieldBashResults()[0].resultId).toBe(r.resultId); await checkShieldBashResult(r.resultId);
  expect(submitPreparedActorCommand.mock.calls.map(([command]) => command)).toEqual([r.command, r.command]);
});
test('C3 accepted history reopens without reapplication after removal; explicit separate later result keeps independent identity; stale tabs refuse', async() => {
  currentGM();
  submitPreparedActorCommand.mockImplementation(async command => ({ success: true, receipt: { commandId: command.commandId, roomId: 'r', submitterUid: 'u', actors: [{ ref }] } }));
  await recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null });
  const first = shieldBashResults()[0];
  await expect(recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null })).rejects.toThrow(/lane changed/);
  tokens.getState().characterTokens[0].state.conditions.push(first.command.actors[0].conditions[0].record);
  await editSharedCondition(ref, 'remove', { recordId: first.resultId }); tokens.getState().characterTokens[0].state.conditions = [];
  const calls = submitPreparedActorCommand.mock.calls.length; await checkShieldBashResult(first.resultId); expect(submitPreparedActorCommand).toHaveBeenCalledTimes(calls);
  expect(shieldBashResults()[0].resultId).toBe(first.resultId);
  await recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: loadConditionCustody().entries[canonical(ref)].command.commandId });
  expect(shieldBashResults()).toHaveLength(2); expect(shieldBashResults()[0].resultId).not.toBe(first.resultId);
});
test('C3 concurrent preparation, stale source, role changes and missing attestation never emit a new result', async() => {
  currentGM();
  await expect(recordShieldBashResult({ ...bashSource, instanceId: 'retired' }, ref, { stunnedConfirmed: true, previousCommandId: null })).rejects.toThrow(/source unavailable/);
  await expect(recordShieldBashResult(bashSource, ref, { stunnedConfirmed: false, previousCommandId: null })).rejects.toThrow(/confirmed/);
  let release; refreshActorSnapshot.mockReturnValueOnce(new Promise(resolve => { release = resolve; }));
  const first = recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null });
  await expect(recordShieldBashResult(bashSource, ref, { stunnedConfirmed: true, previousCommandId: null })).rejects.toThrow(/already pending/);
  game.setState({ isGMMode: false }); release({ success: true }); await first;
  expect(submitPreparedActorCommand).not.toHaveBeenCalled();
});
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
test('A10 review: current GM removes one exact authored movement change on a creature; no record is rebuilt; non-GM and edits refuse', async() => {
  const { makeMovementRecord } = require('../sharedConditionProfile');
  const beast = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'beast', instanceId: 'beast-i' };
  const id = crypto.randomUUID(), mired = makeMovementRecord(beast, id, { sourceActor: ref, sourceOccurrence: `authored-effect:${id}`, timing: 'authored-target-next-start', authoredDuration: 'Until the mud dries', feet: -10, label: 'Mired' });
  tokens.getState().characterTokens.push({ id: 'beast', state: { actorContract: { version: 1, revision: 4, ...beast }, conditions: [mired] } });
  await expect(editSharedCondition(beast, 'remove', { recordId: id, profile: 'movement' })).rejects.toThrow(/current GM/);
  game.setState({ isGMMode: true });
  await expect(editSharedCondition(beast, 'update', { recordId: id, profile: 'movement' })).rejects.toThrow(/removed by the current GM only/);
  await editSharedCondition(beast, 'remove', { recordId: id, profile: 'movement' });
  const command = prepareActorCommand.mock.results.at(-1).value;
  expect(command.actors).toEqual([{ ref: beast, expectedRevision: 4, conditions: [{ op: 'remove', recordId: id }] }]);
});

test.each(['authored_effect_correction_is_removal', 'authored_effect_gm_removal_required', 'authored_effect_approval_required'])('A10 explicit %s closes failed custody without poisoning the next condition edit', async code => {
  const beast = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'beast', instanceId: 'beast-i' };
  const id = crypto.randomUUID(), record = makeStunnedRecord(beast, id, { sourceActor: ref, sourceOccurrence: `authored-effect:${id}`, timing: 'manual', authoredDuration: 'Until the bell' });
  tokens.getState().characterTokens.push({ id: 'beast', state: { actorContract: { version: 1, revision: 4, ...beast }, conditions: [record] } });
  submitPreparedActorCommand.mockResolvedValueOnce({ success: false, code });
  await editSharedCondition(beast, 'remove', { recordId: id });
  const failed = loadConditionCustody().entries[canonical(beast)];
  expect(failed.phase).toBe('failed'); expect(failed.result.code).toBe(code);
  expect(tokens.getState().characterTokens.at(-1).state.conditions).toEqual([record]);
  submitPreparedActorCommand.mockImplementation(async command => ({ success: true, receipt: { commandId: command.commandId, roomId: 'r', submitterUid: 'u', actors: [{ ref: beast }] } }));
  await editSharedCondition(beast, 'add', { sourceOccurrence: 'later-table-ruling' });
  const accepted = loadConditionCustody().entries[canonical(beast)];
  expect(accepted.phase).toBe('accepted'); expect(accepted.command.commandId).not.toBe(failed.command.commandId);
  expect(submitPreparedActorCommand).toHaveBeenCalledTimes(2);
});
