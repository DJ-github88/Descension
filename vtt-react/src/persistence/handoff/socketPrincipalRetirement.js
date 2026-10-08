/**
 * Project 5 Wave A (S4/F) — multiplayer socket principal retirement.
 *
 * If the verified account principal changes, the old socket belongs to the
 * OLD principal. It is retired (listeners detached, disconnected, marked
 * retired) and never transferred to the new principal. Late events from a
 * retired socket are dropped and cannot reinstall old state.
 *
 * This is client session retirement ONLY. It never emits server membership
 * revocation, kick, or leave-membership semantics — P4 H1 remains controlling.
 */

import { getStore } from '../../store/storeRegistry';
import { deriveScopeFromAuthUser, scopeKeyOf } from '../scopeModel';

const retiredSockets = new WeakSet();

export function markSocketRetired(socket) {
  if (socket && typeof socket === 'object') retiredSockets.add(socket);
}

export function isSocketRetired(socket) {
  return !!socket && typeof socket === 'object' && retiredSockets.has(socket);
}

export function principalKeyOfAuthState(authState = {}) {
  try {
    const scope = deriveScopeFromAuthUser(authState);
    return scope ? scopeKeyOf(scope) : 'public:none';
  } catch (_error) {
    return 'public:none';
  }
}

/**
 * Lifetime fence for an async socket/auth continuation. Captures the exact
 * socket instance, principal and (when supplied) account generation at
 * operation creation; every post-await side effect must revalidate through it.
 *
 * @param {{
 *   socket?: object|null,
 *   principalKey: string,
 *   accountGeneration?: number|null,
 *   getAuthState: () => object,
 *   getAccountGeneration?: () => { accountGeneration: number }
 * }} input
 */
export function createSocketLifetimeGuard({
  socket = null,
  principalKey,
  accountGeneration = null,
  getAuthState,
  getAccountGeneration = null
}) {
  const generationMatches = () => {
    if (accountGeneration === null || accountGeneration === undefined) return true;
    try {
      const gateState = typeof getAccountGeneration === 'function' ? getAccountGeneration() : null;
      return !!gateState && gateState.accountGeneration === accountGeneration;
    } catch (_error) {
      return false;
    }
  };
  const isValid = () => {
    if (!principalKey) return false;
    if (socket && isSocketRetired(socket)) return false;
    if (!generationMatches()) return false;
    let authState = null;
    try {
      authState = typeof getAuthState === 'function' ? getAuthState() : null;
    } catch (_error) {
      authState = null;
    }
    return principalKeyOfAuthState(authState || {}) === principalKey;
  };
  return {
    principalKey,
    isValid,
    isSocketRetired: () => !!socket && isSocketRetired(socket)
  };
}

/** Clear pending join/admission state for the retired principal. */
export function clearPendingJoinState() {
  const removed = [];
  const sessionKeys = [
    'selectedRoomPassword',
    'pendingGMSessionInvitation',
    'lastEmittedInvitationId',
    'invitationRetryCount',
    'enteringMultiplayer'
  ];
  const localSelectorKeys = [
    'selectedRoomId',
    'isGMResume',
    'resumeRoomName',
    'isTestRoom',
    // Wave B closure: transient per-principal navigation/preference hints.
    // A must never hand these to B; they are recreated by B's own actions.
    'isWorldBuilderMode',
    'autoCreateTestRoom',
    'lastJoinedRoom',
    'lastCreatedRoom',
    'roomDataChanged',
    // Device-local room mode/selection: the authored local rooms are retained,
    // but the previous principal's active selection is never inherited.
    'isLocalRoom',
    'selectedLocalRoomId'
  ];

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      for (const key of sessionKeys) {
        if (window.sessionStorage.getItem(key) !== null) {
          window.sessionStorage.removeItem(key);
          removed.push(key);
        }
      }
    }
  } catch (_error) {
    // fail safe
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      for (const key of localSelectorKeys) {
        if (window.localStorage.getItem(key) !== null) {
          window.localStorage.removeItem(key);
          removed.push(key);
        }
      }
    }
  } catch (_error) {
    // fail safe
  }
  return { removed };
}

function clearMultiplayerRuntime(socket) {
  let cleared = false;
  try {
    const gameStore = getStore('gameStore');
    if (gameStore && typeof gameStore.setState === 'function') {
      gameStore.setState({ isInMultiplayer: false, multiplayerSocket: null });
      cleared = true;
    }
  } catch (_error) {
    // fail safe
  }
  try {
    const presenceStore = getStore('presenceStore');
    const presenceState = presenceStore?.getState?.();
    if (presenceState && presenceState.socket && (!socket || presenceState.socket === socket)) {
      presenceStore.getState().setSocket?.(null);
      cleared = true;
    }
  } catch (_error) {
    // fail safe
  }
  return cleared;
}

/**
 * Retire an old-principal socket.
 *
 * @param {{
 *   socket?: object|null,
 *   refs?: Record<string, { current: unknown }>|null,
 *   clearRuntime?: boolean,
 *   clearPendingJoin?: boolean
 * }} [options]
 */
export function retireSocketPrincipal(options = {}) {
  const {
    socket = null,
    refs = null,
    clearRuntime = true,
    clearPendingJoin = true
  } = options;

  const result = {
    socketRetired: false,
    listenersDetached: false,
    disconnected: false,
    refsCleared: [],
    runtimeCleared: false,
    pendingJoinCleared: false,
    errors: []
  };

  if (socket && typeof socket === 'object') {
    markSocketRetired(socket);
    result.socketRetired = true;
    try {
      if (typeof socket.removeAllListeners === 'function') {
        socket.removeAllListeners();
        result.listenersDetached = true;
      }
    } catch (error) {
      result.errors.push(`detach-listeners:${error?.message || 'failed'}`);
    }
    try {
      if (typeof socket.disconnect === 'function') {
        socket.disconnect();
        result.disconnected = true;
      }
    } catch (error) {
      result.errors.push(`disconnect:${error?.message || 'failed'}`);
    }
  }

  if (refs && typeof refs === 'object') {
    for (const [name, ref] of Object.entries(refs)) {
      if (ref && typeof ref === 'object' && 'current' in ref) {
        ref.current = null;
        result.refsCleared.push(name);
      }
    }
  }

  if (clearRuntime) {
    result.runtimeCleared = clearMultiplayerRuntime(socket);
  }
  if (clearPendingJoin) {
    const cleared = clearPendingJoinState();
    result.pendingJoinCleared = true;
    result.pendingJoinRemoved = cleared.removed;
  }
  return result;
}

/** Retire whatever socket the presence store currently holds. */
export function retireActiveSocketPrincipal(options = {}) {
  let socket = null;
  try {
    const presenceStore = getStore('presenceStore');
    socket = presenceStore?.getState?.().socket || null;
  } catch (_error) {
    socket = null;
  }
  return retireSocketPrincipal({ socket, ...options });
}

export function createSocketRetirementParticipant() {
  return {
    id: 'socket-principal-retirement',
    stopNewWork: () => ({ ok: true }),
    preservePendingWork: () => ({ ok: true }),
    retire: () => retireActiveSocketPrincipal({}),
    resetProjection: () => ({ ok: true }),
    activate: () => ({ ok: true }),
    dispose: () => ({ ok: true })
  };
}
