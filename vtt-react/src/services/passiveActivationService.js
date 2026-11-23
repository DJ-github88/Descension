/** First playable passive custody (Heightened Senses: +2 flat initiative).
 *
 * Fail-closed until explicit creator approval of P1-P5 in passiveActivationPolicy.js.
 * Static library or stored records are never treated as active modifiers; only
 * server-confirmed passiveLedger activations projected through actor_passive_list
 * are reported as active.
 */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { requestActorEvent, refOf } from './actorConsequenceService';
import {
  HEIGHTENED_SENSES_PASSIVE,
  approved,
  evaluatePassiveEligibility,
  describePassiveStatus
} from './passiveActivationPolicy';

const gameState = () => getStore('gameStore')?.getState() || {};
const roomId = () => gameState().multiplayerRoom?.id;

export const usePassiveActivationStore = create(() => ({
  projection: null,
  roomId: null,
  loading: false,
  error: null,
  message: ''
}));

const fail = (code, message = '') => {
  const text = message || code.replace(/_/g, ' ');
  usePassiveActivationStore.setState({ loading: false, error: code, message: text });
  return { success: false, code, error: text };
};

export async function refreshPassiveLedger() {
  const id = roomId();
  if (!id) return { success: false, code: 'room_unavailable' };
  usePassiveActivationStore.setState({ loading: true, error: null });
  const result = await requestActorEvent('actor_passive_list', { roomId: id });
  if (gameState().multiplayerRoom?.id !== id) return { success: false, code: 'retired_principal' };
  if (!result.success) return fail(result.code || 'passive_list_refused', result.error);
  usePassiveActivationStore.setState({
    projection: result,
    roomId: id,
    loading: false,
    error: null,
    message: ''
  });
  return result;
}

export function primaryPcTargets() {
  const tokens = getStore('characterTokenStore')?.getState().characterTokens || [];
  return tokens
    .filter(token => token?.state?.actorContract?.primary === true && refOf(token))
    .map(token => {
      const ref = refOf(token);
      const character = token.character || {};
      const eligibility = evaluatePassiveEligibility(character, HEIGHTENED_SENSES_PASSIVE);
      return {
        ref,
        label: character.name || token.name || token.id,
        mapId: token.mapId || token.state?.actorContract?.mapId,
        character,
        eligibility
      };
    });
}

export async function activatePassive({
  target,
  definitionRef,
  passiveId = HEIGHTENED_SENSES_PASSIVE.passiveId,
  sourceRecordId = HEIGHTENED_SENSES_PASSIVE.sourceRecordId
} = {}) {
  const isAuthoredPassive = Boolean(definitionRef);
  if (!isAuthoredPassive && !approved()) {
    return fail('passive_activation_unapproved', 'Creator approval pending: passive activation is disabled.');
  }
  const id = roomId();
  if (!id || !target) return fail('invalid_passive_request');
  const current = usePassiveActivationStore.getState().projection;
  const revision = current?.roomId === id ? current.revision : (await refreshPassiveLedger()).revision;
  if (!Number.isSafeInteger(revision)) return fail('passive_list_refused');
  const payload = isAuthoredPassive
    ? { version: 1, roomId: id, requestId: crypto.randomUUID(), expectedRevision: revision, target, definitionRef }
    : { version: 1, roomId: id, requestId: crypto.randomUUID(), expectedRevision: revision, target, passiveId, sourceRecordId };
  const result = await requestActorEvent('actor_passive_activate', payload);
  if (result.success) await refreshPassiveLedger();
  return result.success ? result : fail(result.code || 'passive_activate_refused', result.error);
}

export async function revokePassive(activationId) {
  const id = roomId();
  const current = usePassiveActivationStore.getState().projection;
  if (!id || !activationId) return fail('invalid_passive_request');
  const revision = current?.roomId === id ? current.revision : (await refreshPassiveLedger()).revision;
  if (!Number.isSafeInteger(revision)) return fail('passive_list_refused');
  const result = await requestActorEvent('actor_passive_revoke', {
    version: 1,
    roomId: id,
    requestId: crypto.randomUUID(),
    expectedRevision: revision,
    activationId
  });
  if (result.success) await refreshPassiveLedger();
  return result.success ? result : fail(result.code || 'passive_revoke_refused', result.error);
}

export function registerPassiveHandlers({ socket }) {
  if (!socket) return () => {};
  const changed = value => {
    if (value?.roomId !== gameState().multiplayerRoom?.id) return;
    refreshPassiveLedger();
  };
  socket.on('actor_passive_changed', changed);
  socket.on('actor_consequence_accepted', changed);
  return () => {
    socket.off('actor_passive_changed', changed);
    socket.off('actor_consequence_accepted', changed);
  };
}

export { HEIGHTENED_SENSES_PASSIVE, evaluatePassiveEligibility, describePassiveStatus };
