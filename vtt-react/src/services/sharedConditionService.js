/** One P7 condition controller. Active views are canonical room state, never pending drafts. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { getBootstrapGateState, isPrivateProjectionIsolated } from '../persistence/bootstrapPrivacyGate';
import { conditionContext, loadConditionCustody, retainConditionCommand } from './sharedConditionCustody';
import { refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent, findActor, refOf } from './actorConsequenceService';
import { DEFENDING, STUNNED, MOVEMENT, ATTRIBUTE, PERIODIC, isPeriodicTick, canonical, sameRef, recordsFor, makeDefendingRecord, makeStunnedRecord, stunnedRecordsFor, sameStunnedSource, movementRecordsFor, attributeRecordsFor } from './sharedConditionProfile';
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
    if (entry.command.commandId !== receipt.commandId || (!['turn-boundary', 'periodic-tick'].includes(entry.kind) && !receipt.actors.some(actor => sameRef(actor.ref, entry.ref)))) continue;
    const summary = Object.fromEntries(['success', 'receipt', 'status', 'durability'].filter(k => result[k] !== undefined).map(k => [k, result[k]]));
    retainConditionCommand(s.context, key, { ...entry, phase: 'accepted', result: summary }); restore(s.context);
    message(key, { outcome: 'Accepted condition command. Current state below comes from the room, not this historical receipt.' });
  }
}
export async function checkConditionCommand(ref) {
  const s = scope(), key = conditionKey(ref), entry = loadConditionCustody(s.context)?.entries?.[key];
  if (!live(s)) throw Error('Current connected condition principal/room unavailable. Retained command unchanged.');
  const turn = Array.isArray(ref) && ['turn-lifecycle', 'periodic-tick'].includes(ref[0]);
  if (!entry?.command) return turn ? refreshEffectLifecycle() : refreshConditionActor(ref);
  const result = entry.kind === 'turn-boundary' ? await requestActorEvent('actor_turn_boundary', entry.command)
    : entry.kind === 'periodic-tick' ? await requestActorEvent('actor_periodic_resolve', entry.command) : await submitPreparedActorCommand(entry.command);
  if (!live(s)) return;
  if (loadConditionCustody(s.context)?.entries?.[key]?.command?.commandId !== entry.command.commandId) return result;
  if (result.success && result.receipt) accepted(result, s);
  else if (loadConditionCustody(s.context)?.entries?.[key]?.phase !== 'accepted') {
    const definitive = ['authored_effect_correction_is_removal', 'authored_effect_gm_removal_required', 'authored_effect_approval_required', 'stale_turn_state', 'stale_turn_occurrence', 'turn_state_unavailable', 'turn_roster_unbound', 'turn_clock_already_active', 'turn_gm_required', 'invalid_turn_boundary', 'stale_effect_schedule', 'turn_expiry_capacity', 'condition_operation_limit', 'shield_bash_gm_required', 'invalid_shield_bash_result', 'shield_bash_already_recorded', 'stale_actor_revision', 'condition_already_active', 'condition_not_found', 'invalid_condition', 'invalid_shared_condition', 'invalid_consequence', 'invalid_resources', 'actor_binding_conflict', 'secondary_attachment',
      'tick_already_resolved', 'tick_not_found', 'periodic_tick_stale', 'periodic_tick_retired', 'periodic_roll_mismatch', 'periodic_target_down', 'periodic_tick_capacity', 'invalid_periodic_resolution', 'adjustment_reason_required', 'invalid_spell_approval'].includes(result.code);
    // M5 recovery review F1: for a tick command whose outcome was already uncertain, "already resolved"/"not found" can mean this
    // very command was admitted (its first copy still in flight or its ACK lost). That is never shown as a refusal.
    const consumed = entry.kind === 'periodic-tick' && entry.phase === 'unknown' && ['tick_already_resolved', 'tick_not_found'].includes(result.code);
    const unknown = !definitive || consumed;
    retainConditionCommand(s.context, key, { ...entry, phase: unknown ? 'unknown' : 'failed', result: { success: false, code: result.code } }); restore(s.context);
    message(key, { outcome: unknown ? `Current request unavailable/refused (${result.code}); original outcome unconfirmed. Check the same retained command; no replacement/replay.` : `Not applied: ${result.code}. Current permissions/state are unchanged.` });
  }
  if (turn) await refreshEffectLifecycle(); else await refreshConditionActor(ref); return result;
}
export const checkTurnBoundary = () => checkConditionCommand(turnRef());
// M5: one retained GM command per due tick (apply with its retained roll, or dismiss). Same custody/recovery as the turn boundary.
export const tickRef = tickId => ['periodic-tick', game().multiplayerRoom?.id, tickId];
/**
 * M5 recovery: every retained tick command in this GM's device custody for the current room, independent of the live due-tick
 * row (which disappears once the server consumes the tick). Read-only view; checking resends the exact retained bytes.
 * outcome: 'unknown' (sent, outcome unconfirmed) | 'consumed' (tick gone on the server, possibly by this command; unconfirmed) |
 * 'applied' | 'dismissed' (accepted receipt) | 'refused' (definitive refusal).
 */
export function retainedTickOutcome(entry) {
  if (!entry?.command) return null;
  if (entry.phase === 'accepted') return entry.command.mode === 'dismiss' ? 'dismissed' : 'applied';
  if (entry.phase === 'failed') return 'refused';
  if (['tick_already_resolved', 'tick_not_found'].includes(entry.result?.code)) return 'consumed';
  return 'unknown';
}
export function retainedTickCommands(saved) {
  const roomId = game().multiplayerRoom?.id;
  return Object.values(saved?.entries || {}).filter(entry => entry?.kind === 'periodic-tick' && entry.command?.roomId === roomId && Array.isArray(entry.ref) && entry.ref[1] === roomId)
    .map(entry => ({ tickId: entry.ref[2], commandId: entry.command.commandId, mode: entry.command.mode, finalAmount: entry.command.finalAmount, roll: entry.command.roll || null,
      adjustmentReason: entry.command.adjustmentReason, outcome: retainedTickOutcome(entry), code: entry.result?.code || null,
      receiptCommandId: entry.result?.receipt?.commandId || null, tick: entry.tick || null }))
    .sort((a, b) => (['unknown', 'consumed'].includes(a.outcome) ? 0 : 1) - (['unknown', 'consumed'].includes(b.outcome) ? 0 : 1) || String(a.tickId).localeCompare(String(b.tickId)));
}
export const checkPeriodicTick = tickId => checkConditionCommand(tickRef(tickId));
export async function resolvePeriodicTick(tick, { mode = 'apply', roll, finalAmount, adjustmentReason = '' } = {}) {
  const s = scope(), ref = tickRef(tick.tickId), key = conditionKey(ref), lock = `${s.principal}:${key}`;
  if (locks.has(lock)) throw Error('This tick is already being resolved. Check the original command.');
  locks.add(lock);
  try {
    const prior = loadConditionCustody(s.context)?.entries?.[key];
    if (prior?.command && !['failed'].includes(prior.phase)) throw Error(prior.phase === 'accepted' ? 'This tick was already resolved.' : 'Tick outcome unknown. Check the original command; no replacement.');
    const snapshot = await refreshEffectLifecycle();
    if (!live(s)) return;
    if (!game().isGMMode || !snapshot?.success) throw Error('Current GM and hydrated shared room required.');
    const open = snapshot.combat?.effectLifecycle?.dueTicks?.[tick.tickId], retired = snapshot.combat?.retiredPeriodicTicks?.[tick.tickId];
    if (!open && !retired) throw Error('This tick is no longer waiting for resolution. Refresh the server turn state.');
    if (retired && mode !== 'dismiss') throw Error('This tick was recorded before combat ended, restarted or its clock was replaced. Resolve it by hand and dismiss it.');
    const command = { version: 1, roomId: s.context.roomId, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
      tickId: tick.tickId, mode, adjustmentReason: String(adjustmentReason || '') };
    if (mode === 'apply') {
      // M5 review F5: read the target revision from a fresh authoritative snapshot, not a possibly lagging local store.
      const fresh = await refreshConditionActor(tick.ref);
      if (!live(s)) return;
      if (!fresh?.success) throw Error('The exact target of this tick could not be refreshed. Nothing was sent; try again.');
      const token = findActor(tick.ref);
      if (!token?.state?.actorContract) throw Error('The exact target of this tick is unavailable. Resolve it by hand and dismiss it.');
      Object.assign(command, { expectedRevision: token.state.actorContract.revision, roll, finalAmount });
    }
    // Recovery summary (GM device custody only): lets the retained command be found and checked after the due-tick row is gone.
    const summary = { tickId: tick.tickId, occurrence: tick.occurrence, of: tick.of, label: tick.label, kind: tick.tick?.kind, formula: tick.tick?.formula, target: tick.ref };
    retainConditionCommand(s.context, key, { kind: 'periodic-tick', ref, command, operation: mode, recordId: tick.recordId, phase: 'unknown', tick: summary }); restore(s.context);
    message(key, { outcome: 'Pending tick resolution — no optimistic HP change.' });
    return checkPeriodicTick(tick.tickId);
  } finally { locks.delete(lock); }
}
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
    if (!['stunned', 'defending', 'movement', 'attribute', 'periodic'].includes(profile) || (profile === 'defending' && ref.kind !== 'character')) throw Error('Unsupported condition profile/actor.');
    // M5: an accepted periodic instance has exactly one correction — exact GM removal (later ticks are then never recorded).
    if (profile === 'periodic' && (operation !== 'remove' || !game().isGMMode)) throw Error('Periodic effects are removed by the current GM only (exact instance).');
    // A10 review finding 2: an accepted authored movement change has exactly one correction — exact GM removal.
    if (profile === 'movement' && (operation !== 'remove' || !game().isGMMode)) throw Error('Authored movement changes are removed by the current GM only (exact instance).');
    // Attribute family: the same single correction — exact GM removal; base attributes are never edited here.
    if (profile === 'attribute' && (operation !== 'remove' || !game().isGMMode)) throw Error('Authored attribute changes are removed by the current GM only (exact instance).');
    const definition = profile === 'stunned' ? STUNNED : profile === 'movement' ? MOVEMENT : profile === 'attribute' ? ATTRIBUTE : profile === 'periodic' ? PERIODIC : DEFENDING;
    const token = findActor(ref), active = profile === 'stunned' ? stunnedRecordsFor(token) : profile === 'movement' ? movementRecordsFor(token) : profile === 'attribute' ? attributeRecordsFor(token)
      : profile === 'periodic' ? (token?.state?.conditions || []).filter(r => isPeriodicTick(r) && sameRef(r.target, token.state?.actorContract)) : recordsFor(token);
    const candidate = shieldBashResult ? shieldBash.makeRecord(sourceActor, ref, crypto.randomUUID()) : profile === 'stunned' && operation === 'add' ? makeStunnedRecord(ref, crypto.randomUUID(), { sourceOccurrence, timing, sourceActor }) : null;
    if (operation === 'add' && (profile === 'defending' ? active.length : active.some(r => sameStunnedSource(r, candidate)))) { message(key, { outcome: 'Already active in accepted room state — no new instance, refresh or payment.' }); return { success: true, code: 'already_active' }; }
    const old = active.find(r => (r.recordId || r.id) === recordId);
    if (operation === 'remove' && !old) { message(key, { outcome: 'That exact instance is already absent — nothing removed.' }); return { success: true, code: 'already_absent' }; }
    if (!['add', 'remove', ...(profile === 'stunned' ? ['update'] : [])].includes(operation)) throw Error('Unsupported condition operation.');
    if (operation === 'update' && !old) throw Error('Exact condition instance unavailable. Refresh before correcting timing.');
    const id = operation === 'add' ? candidate?.recordId || crypto.randomUUID() : recordId;
    const record = operation === 'remove' ? null : profile === 'stunned' ? candidate || makeStunnedRecord(ref, id, {
      sourceOccurrence: old.sourceEntityId, sourceActor: old.sourceActor, timing, authoredDuration: old.authoredDuration
    }) : makeDefendingRecord(ref, id, sourceMode); // remove (any profile, incl. A10 movement) carries no record
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
