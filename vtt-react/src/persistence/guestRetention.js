/**
 * Project 5 Wave A (E) — guest retention helper.
 *
 * Guest sign-in / sign-out / anonymous-UID rotation must never delete authored
 * guest/local drafts. Only session credentials, identity markers and transient
 * navigation state may be cleared.
 *
 * Authored keys retained: local rooms + room snapshots, guest character
 * roster, guest character legacy key, room/player state snapshots.
 */

export const GUEST_SESSION_IDENTITY_KEYS = Object.freeze([
  'mythrill-guest-user',
  'mythrill-guest-user-data',
  'mythrill-guest-initialized',
  'mythrill-guest-explicit-login'
]);

export const GUEST_TRANSIENT_LOCAL_KEYS = Object.freeze([
  'mythrill-active-character',
  'mythrill-guest-joined-room',
  'mythrill-guest-joined-rooms'
]);

export const GUEST_TRANSIENT_SESSION_KEYS = Object.freeze([
  'selectedRoomPassword',
  'pendingGMSessionInvitation',
  'lastEmittedInvitationId',
  'invitationRetryCount',
  'enteringMultiplayer'
]);

/** Authored drafts that must survive any guest transition. */
export const GUEST_AUTHORED_RETAINED_KEYS = Object.freeze([
  'mythrill_local_rooms',
  'mythrill-guest-characters',
  'mythrill-guest-character'
]);

export function isGuestAuthoredKey(key) {
  if (typeof key !== 'string' || key.length === 0) return false;
  if (GUEST_AUTHORED_RETAINED_KEYS.includes(key)) return true;
  if (key.startsWith('mythrill_local_room_state_')) return true;
  if (key.startsWith('mythrill-room-state-')) return true;
  if (key.startsWith('mythrill-player-state_') || key.startsWith('mythrill-player-state-')) return true;
  return false;
}

function safeGet(storage) {
  if (storage) return storage;
  try {
    if (typeof window === 'undefined') return null;
    return typeof window.localStorage !== 'undefined' ? window.localStorage : null;
  } catch (_error) {
    return null;
  }
}

function safeSession(storage) {
  if (storage) return storage;
  try {
    if (typeof window === 'undefined') return null;
    return typeof window.sessionStorage !== 'undefined' ? window.sessionStorage : null;
  } catch (_error) {
    return null;
  }
}

/**
 * Clear guest session identity + transient navigation state.
 * Authored drafts are explicitly retained, even if a caller passes an
 * overlapping key list: authored keys are filtered out before removal.
 *
 * @returns {{ removed: string[], retainedAuthored: string[] }}
 */
export function clearGuestSessionState({ localStorage: local = null, sessionStorage: session = null } = {}) {
  const localStore = safeGet(local);
  const sessionStore = safeSession(session);
  const removed = [];
  const retainedAuthored = [];

  const candidateLocalKeys = [...GUEST_SESSION_IDENTITY_KEYS, ...GUEST_TRANSIENT_LOCAL_KEYS];
  for (const key of candidateLocalKeys) {
    if (isGuestAuthoredKey(key)) {
      retainedAuthored.push(key);
      continue;
    }
    if (!localStore) continue;
    try {
      if (localStore.getItem(key) !== null) {
        localStore.removeItem(key);
        removed.push(key);
      }
    } catch (_error) {
      // fail safe: leave the key in place
    }
  }

  if (sessionStore) {
    for (const key of GUEST_TRANSIENT_SESSION_KEYS) {
      try {
        if (sessionStore.getItem(key) !== null) {
          sessionStore.removeItem(key);
          removed.push(key);
        }
      } catch (_error) {
        // fail safe
      }
    }
  }

  return { removed, retainedAuthored };
}
