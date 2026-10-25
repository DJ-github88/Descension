/** One P7 condition controller. Active views are canonical room state, never pending drafts. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { getBootstrapGateState, isPrivateProjectionIsolated } from '../persistence/bootstrapPrivacyGate';
import { conditionContext, loadConditionCustody, retainConditionCommand } from './sharedConditionCustody';
import { refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent, findActor, refOf } from './actorConsequenceService';
import { DEFENDING, STUNNED, canonical, sameRef, recordsFor, makeDefendingRecord, makeStunnedRecord, stunnedRecordsFor, sameStunnedSource } from './sharedConditionProfile';
import { onRoomRejoined } from './roomRejoinBus';
import * as shieldBash from './shieldBashResult';
import * as timing from './sharedEffectTiming';

const game = () => getStore('gameStore')?.getState() || {};
const characterId = () => getStore('characterStore')?.getState().currentCharacterId;
export const conditionPrincipal = () => canonical([getStore('authStore')?.getState().user?.uid, getBootstrapGateState().accountGeneration,
  characterId(), game().multiplayerRoom?.id, game().isGMMode === true]);
const initial = () => ({ principal: null, views: {}, saved: null, combat: null, combatHash: null, clockProjection: null, clockPhase: 'unavailable' });
export const useSharedConditionStore = create(initial);
const locks = new Set(), queries = new Map();
const retiredClocks = new Set();
let binding = 0;
export const conditionKey = ref => canonical(ref);
export function resolveConditionActor({ targetRef, identity } = {}) {
  const roomId = game().multiplayerRoom?.id;
  if (!game().isInMultiplayer || !roomId) return null;
  if (targetRef) {
    const token = findActor(targetRef), ref = refOf(token);
    return ref && ref.roomId === roomId && (ref.kind === 'creature' || token.state.actorContract.primary) && sameRef(ref, targetRef) ? ref : null;
  }
  if (!identity?.ownerUid || !identity.characterId) return null; // Inspection never falls back to the open character.
  const tokens = getStore('characterTokenStore')?.getState().characterTokens || [];
  const matches = tokens.filter(token => { const ref = refOf(token); return ref?.kind === 'character' && ref.roomId === roomId &&
    ref.ownerUid === identity.ownerUid && ref.characterId === identity.characterId && token.state.actorContract.primary; });
  return matches.length === 1 ? refOf(matches[0]) : null;
}
const scope = () => ({ context: conditionContext(), delivery: captureActorDelivery(), principal: conditionPrincipal(), binding });
const live = s => s.binding === binding && s.principal === conditionPrincipal() && s.delivery.socket?.connected === true && !isPrivateProjectionIsolated() && s.context.current() && currentActorDelivery(s.delivery, s.context.roomId);
function message(key, value) { useSharedConditionStore.setState(s => ({ views: { ...s.views, [key]: { ...s.views[key], ...value } } })); }
function restore(context = conditionContext()) { if (context.current()) useSharedConditionStore.setState({ saved: loadConditionCustody(context) }); }
function captureCombat(result, fresh = false) {
  if (!Object.prototype.hasOwnProperty.call(result || {}, 'combat')) return;
  const projection = result.actorSnapshot?.actorProjection || result.actorProjection, previous = useSharedConditionStore.getState().clockProjection;
  if (!projection || (previous && (previous.epoch === projection.epoch ? previous.cut > projection.cut : !fresh))) return;
  if (retiredClocks.has(result.combat?.effectLifecycle?.id) && previous?.epoch === projection.epoch) return;
  require('./silentRoomHydration').hydrateCombatSnapshot(result.combat);
  useSharedConditionStore.setState({ combat: result.combat, combatHash: result.combatHash, clockProjection: projection, clockPhase: 'ready' });
}
const turnRef = () => ['turn-lifecycle', game().multiplayerRoom?.id];
export async function refreshEffectLifecycle() {
  const s = scope(), key = conditionKey(turnRef()), order = (queries.get(key) || 0) + 1; queries.set(key, order);
  if (!live(s)) return { success: false, code: 'condition_context_unavailable' };
  useSharedConditionStore.setState({ clockPhase: 'refreshing' });
  const result = await refreshActorSnapshot();
  if (!live(s) || queries.get(key) !== order) return;
  if (result.success) captureCombat(result, true); else useSharedConditionStore.setState({ clockPhase: 'unavailable' });
  restore(s.context); return result;
}
export async function refreshConditionActor(ref) {
  const s = scope(), key = conditionKey(ref), order = (queries.get(key) || 0) + 1; queries.set(key, order);
  if (!live(s)) return { success: false, code: 'condition_context_unavailable' };
  message(key, { ref, phase: 'refreshing' });
  const result = await refreshActorSnapshot();
  if (!live(s) || queries.get(key) !== order) return;
  if (result.success) captureCombat(result, true);
  message(key, { phase: result.success && resolveConditionActor({ targetRef: ref }) ? 'ready' : 'unavailable', ref }); restore(s.context);
  return result;
}
function accepted(result, s = scope()) {
  if (!live(s) || result?.receipt?.roomId !== s.context.roomId) return;
  captureCombat(result);
  if (result.receipt.submitterUid !== s.context.uid) return;
  const saved = loadConditionCustody(s.context), receipt = result.receipt;
  for (const [key, entry] of Object.entries(saved?.entries || {})) {
    if (entry.command.commandId !== receipt.commandId || (entry.kind !== 'turn-boundary' && !receipt.actors.some(actor => sameRef(actor.ref, entry.ref)))) continue;
    const summary = Object.fromEntries(['success', 'receipt', 'status', 'durability'].filter(k => result[k] !== undefined).map(k => [k, result[k]]));
    retainConditionCommand(s.context, key, { ...entry, phase: 'accepted', result: summary }); restore(s.context);
    message(key, { outcome: 'Accepted condition command. Current state below comes from the room, not this historical receipt.' });
  }
}
export async function checkConditionCommand(ref) {
  const s = scope(), key = conditionKey(ref), entry = loadConditionCustody(s.context)?.entries?.[key];
  if (!live(s)) throw Error('Current connected condition principal/room unavailable. Retained command unchanged.');
  const turn = Array.isArray(ref) && ref[0] === 'turn-lifecycle';
  if (!entry?.command) return turn ? refreshEffectLifecycle() : refreshConditionActor(ref);
  const result = entry.kind === 'turn-boundary' ? await requestActorEvent('actor_turn_boundary', entry.command) : await submitPreparedActorCommand(entry.command);
  if (!live(s)) return;
  if (loadConditionCustody(s.context)?.entries?.[key]?.command?.commandId !== entry.command.commandId) return result;
  if (result.success && result.receipt) accepted(result, s);
  else if (loadConditionCustody(s.context)?.entries?.[key]?.phase !== 'accepted') {
    const definitive = ['stale_turn_state', 'stale_turn_occurrence', 'turn_state_unavailable', 'turn_roster_unbound', 'turn_clock_already_active', 'turn_gm_required', 'invalid_turn_boundary', 'stale_effect_schedule', 'turn_expiry_capacity', 'condition_operation_limit', 'shield_bash_gm_required', 'invalid_shield_bash_result', 'shield_bash_already_recorded', 'stale_actor_revision', 'condition_already_active', 'condition_not_found', 'invalid_condition', 'invalid_shared_condition', 'invalid_consequence', 'invalid_resources', 'actor_binding_conflict', 'secondary_attachment'].includes(result.code);
    const unknown = !definitive;
    retainConditionCommand(s.context, key, { ...entry, phase: unknown ? 'unknown' : 'failed', result: { success: false, code: result.code } }); restore(s.context);
    message(key, { outcome: unknown ? `Current request unavailable/refused (${result.code}); original outcome unconfirmed. Check the same retained command; no replacement/replay.` : `Not applied: ${result.code}. Current permissions/state are unchanged.` });
  }
  if (turn) await refreshEffectLifecycle(); else await refreshConditionActor(ref); return result;
}
export const checkTurnBoundary = () => checkConditionCommand(turnRef());
export async function submitTurnBoundary(mode = 'advance') {
  const s = scope(), ref = turnRef(), key = conditionKey(ref), lock = `${s.principal}:${key}`;
  if (locks.has(lock)) throw Error('Turn boundary preparation already pending. Check the original command.');
  locks.add(lock);
  try {
    const prior = loadConditionCustody(s.context)?.entries?.[key];
    if (prior?.command && !['accepted', 'failed'].includes(prior.phase)) throw Error('Turn outcome unknown. Check the original turn command; no replacement.');
    const snapshot = await refreshEffectLifecycle();
    if (!live(s)) return;
    if (!game().isGMMode || !snapshot?.success || !snapshot.combat?.isActive || !snapshot.combatHash) throw Error('Current GM and exact active server combat required.');
    const current = timing.clock(snapshot.combat), latest = loadConditionCustody(s.context)?.entries?.[key];
    if (latest?.command && !['accepted', 'failed'].includes(latest.phase)) throw Error('Another unknown turn command owns this lane.');
    if (mode === 'advance' && !current) throw Error('Authenticated combat occurrence unavailable; GM re-adopts the corrected roster.');
    const command = { version: 1, roomId: s.context.roomId, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch,
      baseCommitSequence: snapshot.commitSequence, mode, combatHash: snapshot.combatHash,
      expectedClock: mode === 'advance' ? { id: current.id, sequence: current.sequence } : null };
    retainConditionCommand(s.context, key, { kind: 'turn-boundary', ref, command, operation: mode, recordId: command.commandId, phase: 'unknown' }); restore(s.context);
    message(key, { outcome: 'Pending authenticated turn command — no optimistic turn change or expiry.' });
    return checkTurnBoundary();
  } finally { locks.delete(lock); }
}
export async function editDefending(ref, operation, { recordId, sourceMode = 'manual' } = {}) {
  return editSharedCondition(ref, operation, { recordId, sourceMode, profile: 'defending' });
}
export async function editSharedCondition(ref, operation, { recordId, sourceMode = 'manual', profile = 'stunned', sourceOccurrence, timing = 'manual', sourceActor, shieldBashResult } = {}) {
  const s = scope(), key = conditionKey(ref), lock = `${s.principal}:${key}`;
  if (locks.has(lock)) throw Error('Condition preparation already pending. No duplicate command created.');
  locks.add(lock);
  try {
    const before = loadConditionCustody(s.context)?.entries?.[key];
    if (before?.command && !['accepted', 'failed'].includes(before.phase)) throw Error('Check the retained unknown condition command before another edit.');
    const snapshot = await refreshConditionActor(ref);
    if (!live(s)) return;
    if (!snapshot?.success || !resolveConditionActor({ targetRef: ref })) throw Error('Exact current primary PC unavailable; no fallback target.');
    const latest = loadConditionCustody(s.context)?.entries?.[key];
    if (latest?.command && !['accepted', 'failed'].includes(latest.phase)) throw Error('Another unknown command owns this condition lane.');
    if (shieldBashResult) {
      if (!game().isGMMode || profile !== 'stunned' || operation !== 'add' || shieldBashResult.stunnedConfirmed !== true) throw Error('Current GM and manually confirmed Shield Bash Stunned result required.');
      if ((latest?.command?.commandId || null) !== shieldBashResult.previousCommandId) throw Error('Condition lane changed. Refresh and recover the recorded result before preparing another.');
      if (!resolveConditionActor({ targetRef: sourceActor })) throw Error('Exact Shield Bash source unavailable; no replacement incarnation or sheet fallback.');
      if (shieldBashResults().some(r => !['accepted', 'failed'].includes(r.phase))) throw Error('Check the retained unknown Shield Bash result before another result.');
    }
    if (!['stunned', 'defending'].includes(profile) || (profile === 'defending' && ref.kind !== 'character')) throw Error('Unsupported condition profile/actor.');
    const definition = profile === 'stunned' ? STUNNED : DEFENDING;
    const token = findActor(ref), active = profile === 'stunned' ? stunnedRecordsFor(token) : recordsFor(token);
    const candidate = shieldBashResult ? shieldBash.makeRecord(sourceActor, ref, crypto.randomUUID()) : profile === 'stunned' && operation === 'add' ? makeStunnedRecord(ref, crypto.randomUUID(), { sourceOccurrence, timing, sourceActor }) : null;
    if (operation === 'add' && (profile === 'defending' ? active.length : active.some(r => sameStunnedSource(r, candidate)))) { message(key, { outcome: 'Already active in accepted room state — no new instance, refresh or payment.' }); return { success: true, code: 'already_active' }; }
    const old = active.find(r => (r.recordId || r.id) === recordId);
    if (operation === 'remove' && !old) { message(key, { outcome: 'That exact instance is already absent — nothing removed.' }); return { success: true, code: 'already_absent' }; }
    if (!['add', 'remove', ...(profile === 'stunned' ? ['update'] : [])].includes(operation)) throw Error('Unsupported condition operation.');
    if (operation === 'update' && !old) throw Error('Exact condition instance unavailable. Refresh before correcting timing.');
    const id = operation === 'add' ? candidate?.recordId || crypto.randomUUID() : recordId;
    const record = profile === 'stunned' ? operation === 'remove' ? null : candidate || makeStunnedRecord(ref, id, {
      sourceOccurrence: old.sourceEntityId, sourceActor: old.sourceActor, timing, authoredDuration: old.authoredDuration
    }) : makeDefendingRecord(ref, id, sourceMode);
    const op = operation === 'remove' ? { op: 'remove', recordId: id } : { op: operation, recordId: id, record };
    const command = prepareActorCommand([{ ref, expectedRevision: token.state.actorContract.revision, conditions: [op] }], {
      target: ref, adjudication: { definitionId: definition.definitionId, definitionVersionOrHash: definition.origin,
        chosenResult: JSON.stringify({ conditionKey: definition.conditionKey, operation, recordId: id, manualStateCorrection: true,
          ...(shieldBashResult ? { manualResult: shieldBash.metadata(sourceActor, ref, id) } : {}) }), adjustmentReason: shieldBashResult ? shieldBash.BOUNDARY : 'Manual shared condition correction; no action payment, save or expiry execution.' }
    }, shieldBashResult ? { commandId: id } : {});
    retainConditionCommand(s.context, key, { ref, operation, recordId: id, command, phase: 'unknown' }); restore(s.context);
    message(key, { outcome: 'Pending condition command — no local/optimistic activation.' });
    return checkConditionCommand(ref);
  } finally { locks.delete(lock); }
}
/** Named results are a view of existing condition custody/history, never a second store. */
export function shieldBashResults() {
  const saved = loadConditionCustody(), seen = new Set(), results = [];
  for (const entry of Object.values(saved?.entries || {})) {
    for (const value of [entry, ...(entry.history || []).slice().reverse()]) {
      const result = shieldBash.readResult(value.command);
      if (!result || result.definitionId !== shieldBash.DEFINITION_ID || seen.has(result.resultId)) continue;
      seen.add(result.resultId); results.push({ ...result, command: value.command, phase: value.phase, result: value.result });
    }
  }
  return results;
}
export async function recordShieldBashResult(source, target, { stunnedConfirmed, previousCommandId } = {}) {
  return editSharedCondition(target, 'add', { sourceActor: source, shieldBashResult: { stunnedConfirmed, previousCommandId } });
}
export async function checkShieldBashResult(resultId) {
  const result = shieldBashResults().find(r => r.resultId === resultId);
  if (!result || !game().isGMMode) throw Error('Retained current-GM Shield Bash result required.');
  const latest = loadConditionCustody()?.entries?.[conditionKey(result.target)];
  // Accepted history can be refreshed, never copied into a fresh command after removal/correction.
  return latest?.command?.commandId === result.command.commandId ? checkConditionCommand(result.target) : refreshConditionActor(result.target);
}
export function bindSharedConditions(socket) {
  const generation = ++binding, principal = conditionPrincipal(), registration = captureActorDelivery(socket);
  retiredClocks.clear();
  queries.clear(); useSharedConditionStore.setState({ ...initial(), principal }); restore();
  const current = roomId => generation === binding && principal === conditionPrincipal() && !isPrivateProjectionIsolated() &&
    currentActorDelivery({ ...registration, room: game().multiplayerRoom, roomId: game().multiplayerRoom?.id }, roomId);
  const receipt = result => { if (current(result?.receipt?.roomId)) accepted(result); };
  const disconnect = () => { if (current(game().multiplayerRoom?.id)) useSharedConditionStore.setState(s => ({ combat: null, combatHash: null, clockPhase: 'unavailable', views: Object.fromEntries(Object.entries(s.views).map(([key, v]) => [key, { ...v, phase: 'unavailable' }])) })); };
  const retire = () => {
    if (!current(game().multiplayerRoom?.id)) return;
    const id = useSharedConditionStore.getState().combat?.effectLifecycle?.id;
    if (id) retiredClocks.add(id);
    useSharedConditionStore.setState({ combat: null, combatHash: null, clockPhase: 'unavailable' });
    getStore('combatStore')?.setState({ effectLifecycle: null });
    refreshEffectLifecycle();
  };
  const reset = data => { if ((data?.action || data?.type) === 'reset_combat') retire(); };
  const off = onRoomRejoined(event => {
    if (event.socket !== socket || !current(event.roomId)) return;
    restore(); refreshEffectLifecycle(); for (const view of Object.values(useSharedConditionStore.getState().views)) if (view.ref) refreshConditionActor(view.ref);
  });
  socket.on('actor_consequence_accepted', receipt); socket.on('disconnect', disconnect);
  socket.on('combat_started', retire); socket.on('combat_ended', retire); socket.on('gm_action', reset);
  refreshEffectLifecycle();
  return () => { socket.off('actor_consequence_accepted', receipt); socket.off('disconnect', disconnect); socket.off('combat_started', retire); socket.off('combat_ended', retire); socket.off('gm_action', reset); off(); if (generation === binding) { binding += 1; useSharedConditionStore.setState(initial()); } };
}
