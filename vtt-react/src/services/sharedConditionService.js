/** One P7 condition controller. Active views are canonical room state, never pending drafts. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { getBootstrapGateState, isPrivateProjectionIsolated } from '../persistence/bootstrapPrivacyGate';
import { conditionContext, loadConditionCustody, retainConditionCommand } from './sharedConditionCustody';
import { refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, findActor, refOf } from './actorConsequenceService';
import { DEFENDING, STUNNED, canonical, sameRef, recordsFor, makeDefendingRecord, makeStunnedRecord, stunnedRecordsFor, sameStunnedSource } from './sharedConditionProfile';
import { onRoomRejoined } from './roomRejoinBus';

const game = () => getStore('gameStore')?.getState() || {};
const characterId = () => getStore('characterStore')?.getState().currentCharacterId;
export const conditionPrincipal = () => canonical([getStore('authStore')?.getState().user?.uid, getBootstrapGateState().accountGeneration,
  characterId(), game().multiplayerRoom?.id, game().isGMMode === true]);
const initial = () => ({ principal: null, views: {}, saved: null });
export const useSharedConditionStore = create(initial);
const locks = new Set(), queries = new Map();
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
export async function refreshConditionActor(ref) {
  const s = scope(), key = conditionKey(ref), order = (queries.get(key) || 0) + 1; queries.set(key, order);
  if (!live(s)) return { success: false, code: 'condition_context_unavailable' };
  message(key, { ref, phase: 'refreshing' });
  const result = await refreshActorSnapshot();
  if (!live(s) || queries.get(key) !== order) return;
  message(key, { phase: result.success && resolveConditionActor({ targetRef: ref }) ? 'ready' : 'unavailable', ref }); restore(s.context);
  return result;
}
function accepted(result, s = scope()) {
  if (!live(s) || result?.receipt?.roomId !== s.context.roomId || result.receipt.submitterUid !== s.context.uid) return;
  const saved = loadConditionCustody(s.context), receipt = result.receipt;
  for (const [key, entry] of Object.entries(saved?.entries || {})) {
    if (entry.command.commandId !== receipt.commandId || !receipt.actors.some(actor => sameRef(actor.ref, entry.ref))) continue;
    const summary = Object.fromEntries(['success', 'receipt', 'status', 'durability'].filter(k => result[k] !== undefined).map(k => [k, result[k]]));
    retainConditionCommand(s.context, key, { ...entry, phase: 'accepted', result: summary }); restore(s.context);
    message(key, { outcome: 'Accepted condition command. Current state below comes from the room, not this historical receipt.' });
  }
}
export async function checkConditionCommand(ref) {
  const s = scope(), key = conditionKey(ref), entry = loadConditionCustody(s.context)?.entries?.[key];
  if (!live(s)) throw Error('Current connected condition principal/room unavailable. Retained command unchanged.');
  if (!entry?.command) return refreshConditionActor(ref);
  const result = await submitPreparedActorCommand(entry.command);
  if (!live(s)) return;
  if (loadConditionCustody(s.context)?.entries?.[key]?.command?.commandId !== entry.command.commandId) return result;
  if (result.success && result.receipt) accepted(result, s);
  else if (loadConditionCustody(s.context)?.entries?.[key]?.phase !== 'accepted') {
    const definitive = ['stale_actor_revision', 'condition_already_active', 'condition_not_found', 'invalid_condition', 'invalid_shared_condition', 'invalid_consequence', 'invalid_resources', 'actor_binding_conflict', 'secondary_attachment'].includes(result.code);
    const unknown = !definitive;
    retainConditionCommand(s.context, key, { ...entry, phase: unknown ? 'unknown' : 'failed', result: { success: false, code: result.code } }); restore(s.context);
    message(key, { outcome: unknown ? `Current request unavailable/refused (${result.code}); original outcome unconfirmed. Check the same retained command; no replacement/replay.` : `Not applied: ${result.code}. Current permissions/state are unchanged.` });
  }
  await refreshConditionActor(ref); return result;
}
export async function editDefending(ref, operation, { recordId, sourceMode = 'manual' } = {}) {
  return editSharedCondition(ref, operation, { recordId, sourceMode, profile: 'defending' });
}
export async function editSharedCondition(ref, operation, { recordId, sourceMode = 'manual', profile = 'stunned', sourceOccurrence, timing = 'manual', sourceActor } = {}) {
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
    if (!['stunned', 'defending'].includes(profile) || (profile === 'defending' && ref.kind !== 'character')) throw Error('Unsupported condition profile/actor.');
    const definition = profile === 'stunned' ? STUNNED : DEFENDING;
    const token = findActor(ref), active = profile === 'stunned' ? stunnedRecordsFor(token) : recordsFor(token);
    const candidate = profile === 'stunned' && operation === 'add' ? makeStunnedRecord(ref, crypto.randomUUID(), { sourceOccurrence, timing, sourceActor }) : null;
    if (operation === 'add' && (profile === 'defending' ? active.length : active.some(r => sameStunnedSource(r, candidate)))) { message(key, { outcome: 'Already active in accepted room state — no new instance, refresh or payment.' }); return { success: true, code: 'already_active' }; }
    const old = active.find(r => (r.recordId || r.id) === recordId);
    if (operation === 'remove' && !old) { message(key, { outcome: 'That exact instance is already absent — nothing removed.' }); return { success: true, code: 'already_absent' }; }
    if (!['add', 'remove', ...(profile === 'stunned' ? ['update'] : [])].includes(operation)) throw Error('Unsupported condition operation.');
    if (operation === 'update' && !old) throw Error('Exact condition instance unavailable. Refresh before correcting timing.');
    const id = operation === 'add' ? candidate?.recordId || crypto.randomUUID() : recordId;
    const record = profile === 'stunned' ? operation === 'remove' ? null : candidate || makeStunnedRecord(ref, id, {
      sourceOccurrence: old.sourceEntityId, sourceActor: old.sourceActor, timing
    }) : makeDefendingRecord(ref, id, sourceMode);
    const op = operation === 'remove' ? { op: 'remove', recordId: id } : { op: operation, recordId: id, record };
    const command = prepareActorCommand([{ ref, expectedRevision: token.state.actorContract.revision, conditions: [op] }], {
      target: ref, adjudication: { definitionId: definition.definitionId, definitionVersionOrHash: definition.origin,
        chosenResult: JSON.stringify({ conditionKey: definition.conditionKey, operation, recordId: id, manualStateCorrection: true }), adjustmentReason: 'Manual shared condition correction; no action payment, save or expiry execution.' }
    });
    retainConditionCommand(s.context, key, { ref, operation, recordId: id, command, phase: 'unknown' }); restore(s.context);
    message(key, { outcome: 'Pending condition command — no local/optimistic activation.' });
    return checkConditionCommand(ref);
  } finally { locks.delete(lock); }
}
export function bindSharedConditions(socket) {
  const generation = ++binding, principal = conditionPrincipal(), registration = captureActorDelivery(socket);
  queries.clear(); useSharedConditionStore.setState({ ...initial(), principal }); restore();
  const current = roomId => generation === binding && principal === conditionPrincipal() && !isPrivateProjectionIsolated() &&
    currentActorDelivery({ ...registration, room: game().multiplayerRoom, roomId: game().multiplayerRoom?.id }, roomId);
  const receipt = result => { if (current(result?.receipt?.roomId)) accepted(result); };
  const disconnect = () => { if (current(game().multiplayerRoom?.id)) useSharedConditionStore.setState(s => ({ views: Object.fromEntries(Object.entries(s.views).map(([key, v]) => [key, { ...v, phase: 'unavailable' }])) })); };
  const off = onRoomRejoined(event => {
    if (event.socket !== socket || !current(event.roomId)) return;
    restore(); for (const view of Object.values(useSharedConditionStore.getState().views)) refreshConditionActor(view.ref);
  });
  socket.on('actor_consequence_accepted', receipt); socket.on('disconnect', disconnect);
  return () => { socket.off('actor_consequence_accepted', receipt); socket.off('disconnect', disconnect); off(); if (generation === binding) { binding += 1; useSharedConditionStore.setState(initial()); } };
}
