/** Ordinary follow-up trigger custody: one exact offer at a time, never an implicit selection. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { requestActorEvent, refOf, refreshActorSnapshot } from './actorConsequenceService';
import { FOLLOWUP_HEALING_TRIGGER } from './authoredAbility';

export const FOLLOWUP_PREDICATE = Object.freeze({ occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' });
export const HEALING_FOLLOWUP_PREDICATE = Object.freeze({ occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' });
/** The event an admitted ability listens for as a follow-up. Its authored trigger chooses the event; an ability
 * without one is a damage follow-up. A healing-authored ability is never sent to the server as a damage follow-up. */
export function followUpPredicateFor(entry) {
  const marker = entry?.canonicalDefinition?.followUp ?? entry?.descriptor?.followUp;
  return marker === FOLLOWUP_HEALING_TRIGGER ? HEALING_FOLLOWUP_PREDICATE : FOLLOWUP_PREDICATE;
}
const gameState = () => getStore('gameStore')?.getState() || {};
const roomId = () => gameState().multiplayerRoom?.id;

export const useTriggerOfferStore = create(() => ({ projection: null, roomId: null, loading: false, error: null, declined: [], message: '', setupRequest: null }));

export function openTriggerRegistrationSetup({ mode, definitionRef, spellName = '', componentId } = {}) {
  if ((mode !== 'follow-up' && mode !== 'component-watch') || !definitionRef?.definitionId) return false;
  useTriggerOfferStore.setState({
    setupRequest: {
      mode,
      definitionRef,
      spellName: String(spellName || ''),
      ...(componentId ? { componentId: String(componentId) } : {}),
      nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }
  });
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent('mythrill:open-trigger-registration'));
  }
  const current = useTriggerOfferStore.getState();
  const id = roomId();
  if (id && (!current.projection || current.projection.roomId !== id) && !current.loading) {
    refreshTriggerLedger();
  }
  return true;
}

export function clearTriggerRegistrationSetup() {
  useTriggerOfferStore.setState({ setupRequest: null });
}

const fail = (code, message = '') => {
  useTriggerOfferStore.setState({ loading: false, error: code, message: message || code.replace(/_/g, ' ') });
  return { success: false, code, error: message || code.replace(/_/g, ' ') };
};

export async function refreshTriggerLedger() {
  const id = roomId();
  if (!id) return { success: false, code: 'room_unavailable' };
  useTriggerOfferStore.setState({ loading: true, error: null });
  const result = await requestActorEvent('actor_trigger_list', { roomId: id });
  if (gameState().multiplayerRoom?.id !== id) {
    useTriggerOfferStore.setState({ setupRequest: null });
    return { success: false, code: 'retired_principal' };
  }
  if (!result.success) return fail(result.code || 'trigger_list_refused', result.error);
  useTriggerOfferStore.setState(state => ({
    projection: result,
    roomId: id,
    loading: false,
    error: null,
    message: '',
    setupRequest: state.setupRequest?.definitionRef?.roomId && state.setupRequest.definitionRef.roomId !== id ? null : state.setupRequest
  }));
  return result;
}

export function primaryPcSources() {
  const tokens = getStore('characterTokenStore')?.getState().characterTokens || [];
  return tokens.filter(token => token?.state?.actorContract?.primary === true && refOf(token))
    .map(token => ({ ref: refOf(token), label: token.character?.name || token.name || token.id, mapId: token.mapId || token.state?.actorContract?.mapId }));
}

export async function registerFollowUp({ source, definitionRef, on = FOLLOWUP_PREDICATE }) {
  const id = roomId();
  if (!id || !source || !definitionRef) return fail('invalid_trigger_listener');
  const current = useTriggerOfferStore.getState().projection;
  const revision = current?.roomId === id ? current.revision : (await refreshTriggerLedger()).revision;
  if (!Number.isSafeInteger(revision)) return fail('trigger_list_refused');
  const result = await requestActorEvent('actor_trigger_register', {
    roomId: id, requestId: crypto.randomUUID(), expectedRevision: revision,
    source, definitionRef, on, mode: 'follow-up'
  });
  if (result.success) await refreshTriggerLedger();
  return result.success ? result : fail(result.code || 'trigger_register_refused', result.error);
}

/** Component watch (D1 = a, creator approval 14 November 2026). The GM pairs ONE admitted originating spell part (the watched
 * spell's own Direct Damage part, as admitted) with ONE separate admitted follow-up B for one exact primary PC source. Every
 * value is the server's own exact ref ({definitionId, version, hash} and the admitted part id); names are never sent. */
export async function registerComponentWatch({ source, definitionRef, watch }) {
  const id = roomId();
  if (!id || !source || !definitionRef || !watch?.definitionRef || typeof watch.componentId !== 'string') return fail('invalid_trigger_listener');
  const current = useTriggerOfferStore.getState().projection;
  const revision = current?.roomId === id ? current.revision : (await refreshTriggerLedger()).revision;
  if (!Number.isSafeInteger(revision)) return fail('trigger_list_refused');
  const result = await requestActorEvent('actor_trigger_register', {
    roomId: id, requestId: crypto.randomUUID(), expectedRevision: revision,
    source, definitionRef, on: FOLLOWUP_PREDICATE, mode: 'component-follow-up',
    watch: { definitionRef: watch.definitionRef, componentId: watch.componentId }
  });
  if (result.success) await refreshTriggerLedger();
  return result.success ? result : fail(result.code || 'trigger_register_refused', result.error);
}

export async function revokeTriggerListener(listenerId) {
  const id = roomId(), current = useTriggerOfferStore.getState().projection;
  if (!id || current?.roomId !== id) return fail('trigger_list_refused');
  const result = await requestActorEvent('actor_trigger_revoke', {
    roomId: id, requestId: crypto.randomUUID(), expectedRevision: current.revision, listenerId
  });
  if (result.success) await refreshTriggerLedger();
  return result.success ? result : fail(result.code || 'trigger_revoke_refused', result.error);
}

export async function dismissTriggerOffer(obligationId, reason) {
  const id = roomId();
  if (!id) return fail('room_unavailable');
  const written = String(reason || '').trim();
  if (!written || written.length > 500) return fail('invalid_trigger_dismissal', 'Enter the GM reason (up to 500 characters).');
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return fail(snapshot.code || 'snapshot_required');
  const result = await requestActorEvent('actor_trigger_dismiss', {
    version: 1, roomId: id, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch,
    baseCommitSequence: snapshot.commitSequence, obligationId, reason: written
  });
  if (result.success) await refreshTriggerLedger();
  return result.success ? result : fail(result.code || 'trigger_dismiss_refused', result.error);
}

export function declineTriggerOffer(obligationId) {
  useTriggerOfferStore.setState(current => ({ declined: current.declined.includes(obligationId) ? current.declined : [...current.declined, obligationId] }));
}

export function isDeclined(obligationId) {
  return useTriggerOfferStore.getState().declined.includes(obligationId);
}

export function registerTriggerOfferHandlers({ socket }) {
  if (!socket) return () => {};
  const changed = value => {
    const eventRoomId = value?.roomId ?? value?.actorSnapshot?.roomId;
    if (eventRoomId !== gameState().multiplayerRoom?.id) return;
    refreshTriggerLedger();
  };
  socket.on('actor_trigger_changed', changed);
  socket.on('actor_consequence_accepted', changed);
  return () => {
    socket.off('actor_trigger_changed', changed);
    socket.off('actor_consequence_accepted', changed);
  };
}