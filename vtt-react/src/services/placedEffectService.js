/**
 * Client state and socket integration for placed map effects (`placed-effect:v1`).
 *
 * Production remains unarmed until creator approval of PE1-PE4 in `placedEffectPolicy.js`.
 * Only server-projected placements from `actor_placed_effect_list` are shown or acted upon.
 */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { requestActorEvent, refOf } from './actorConsequenceService';
import { onRoomRejoined } from './roomRejoinBus';
import {
  CONTRACT,
  FAMILIES,
  POLICY,
  armedApproved,
  activeRules
} from './placedEffectPolicy';

const gameState = () => getStore('gameStore')?.getState() || {};
const roomId = () => gameState().multiplayerRoom?.id;
const currentMapId = () => getStore('mapStore')?.getState()?.currentMapId || gameState().currentMapId || 'default';

export const usePlacedEffectStore = create(() => ({
  projection: null,
  roomId: null,
  loading: false,
  error: null,
  message: '',
  placementDraft: null
}));

const fail = (code, message = '') => {
  const text = message || String(code || 'placed_effect_error').replace(/_/g, ' ');
  usePlacedEffectStore.setState({ loading: false, error: code, message: text });
  return { success: false, code, error: text };
};

export async function refreshPlacedEffects() {
  const id = roomId();
  if (!id) return { success: false, code: 'room_unavailable' };
  usePlacedEffectStore.setState({ loading: true, error: null });
  const result = await requestActorEvent('actor_placed_effect_list', { roomId: id });
  if (gameState().multiplayerRoom?.id !== id) {
    usePlacedEffectStore.setState({ loading: false });
    return { success: false, code: 'retired_principal' };
  }
  if (!result || typeof result !== 'object') {
    usePlacedEffectStore.setState({ loading: false });
    return { success: false, code: 'placed_list_unavailable' };
  }
  if (!result.success) {
    return fail(result.code || 'placed_list_refused', result.error);
  }
  usePlacedEffectStore.setState({
    projection: result,
    roomId: id,
    loading: false,
    error: null,
    message: ''
  });
  return result;
}

export function primaryPcOwners() {
  const tokens = getStore('characterTokenStore')?.getState().characterTokens || [];
  return tokens
    .filter(token => token?.state?.actorContract?.primary === true && refOf(token))
    .map(token => {
      const ref = refOf(token);
      const character = token.character || {};
      return {
        ref,
        label: character.name || token.name || token.id,
        mapId: token.mapId || ref.mapId || 'default'
      };
    });
}

export function startMapPlacement(draft) {
  if (!draft || !draft.owner || !draft.definitionRef) return;
  usePlacedEffectStore.setState({
    placementDraft: {
      owner: draft.owner,
      ownerLabel: draft.ownerLabel || '',
      definitionRef: draft.definitionRef,
      abilityName: draft.abilityName || 'Ability',
      family: FAMILIES.includes(draft.family) ? draft.family : 'placed',
      radiusFeet: Number.isSafeInteger(draft.radiusFeet) ? draft.radiusFeet : 10,
      mapId: draft.mapId || currentMapId()
    },
    error: null,
    message: ''
  });
}

export function cancelMapPlacement() {
  usePlacedEffectStore.setState({ placementDraft: null });
}

export async function placeEffectAt({
  owner,
  definitionRef,
  family = 'placed',
  mapId,
  position,
  radiusFeet = 10,
  armed = false
} = {}) {
  const id = roomId();
  if (!id || !owner || !definitionRef || !mapId || !position ||
      !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    return fail('invalid_placed_effect', 'Select an owner, admitted ability, and valid map coordinates.');
  }
  const current = usePlacedEffectStore.getState().projection;
  const revision = current?.roomId === id
    ? current.revision
    : (await refreshPlacedEffects())?.revision;
  if (!Number.isSafeInteger(revision)) {
    return fail('placed_list_unavailable', 'Could not read current placed-effect ledger revision.');
  }
  const result = await requestActorEvent('actor_placed_effect_place', {
    version: 1,
    roomId: id,
    requestId: crypto.randomUUID(),
    expectedRevision: revision,
    owner,
    definitionRef,
    family: FAMILIES.includes(family) ? family : 'placed',
    armed: Boolean(armed),
    location: {
      mapId,
      position: { x: position.x, y: position.y },
      radiusFeet
    }
  });
  if (!result || typeof result !== 'object') {
    return fail('placed_place_unavailable');
  }
  if (result.success) {
    usePlacedEffectStore.setState({ placementDraft: null, error: null, message: '' });
    await refreshPlacedEffects();
    return result;
  }
  return fail(result.code || 'placed_place_refused', result.error);
}

export async function removePlacedEffect(placementId) {
  const id = roomId();
  if (!id || !placementId) return fail('invalid_placed_effect');
  const current = usePlacedEffectStore.getState().projection;
  const revision = current?.roomId === id
    ? current.revision
    : (await refreshPlacedEffects())?.revision;
  if (!Number.isSafeInteger(revision)) {
    return fail('placed_list_unavailable', 'Could not read current placed-effect ledger revision.');
  }
  const result = await requestActorEvent('actor_placed_effect_remove', {
    version: 1,
    roomId: id,
    requestId: crypto.randomUUID(),
    expectedRevision: revision,
    placementId
  });
  if (!result || typeof result !== 'object') {
    return fail('placed_remove_unavailable');
  }
  if (result.success) {
    await refreshPlacedEffects();
    return result;
  }
  return fail(result.code || 'placed_remove_refused', result.error);
}

const registrations = new WeakMap();

export function registerPlacedEffectHandlers({ socket } = {}) {
  if (!socket || typeof socket.on !== 'function') return () => {};
  const existing = registrations.get(socket);
  if (existing) {
    existing.refs += 1;
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      existing.refs -= 1;
      if (existing.refs <= 0) {
        existing.teardown();
        registrations.delete(socket);
      }
    };
  }

  const changed = value => {
    if (value?.roomId && value.roomId !== gameState().multiplayerRoom?.id) return;
    refreshPlacedEffects();
  };
  const offRejoin = onRoomRejoined(({ socket: s }) => {
    if (s === socket) refreshPlacedEffects();
  });
  socket.on('actor_placed_effect_changed', changed);

  const entry = {
    refs: 1,
    teardown() {
      socket.off?.('actor_placed_effect_changed', changed);
      offRejoin();
    }
  };
  registrations.set(socket, entry);

  let active = true;
  return () => {
    if (!active) return;
    active = false;
    entry.refs -= 1;
    if (entry.refs <= 0) {
      entry.teardown();
      registrations.delete(socket);
    }
  };
}

export { CONTRACT, FAMILIES, POLICY, armedApproved, activeRules };
