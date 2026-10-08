import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import {
  coordinateAuthPrincipalChange,
  resetHandoffCoordinatorForTests
} from '../handoff/accountHandoffCoordinator';
import { resetBootstrapGateForTests } from '../bootstrapPrivacyGate';
import { resetStorageInvalidationForTests } from '../storageInvalidation';
import {
  retireSocketPrincipal,
  isSocketRetired,
  clearPendingJoinState
} from '../handoff/socketPrincipalRetirement';
import {
  clearGuestSessionState,
  isGuestAuthoredKey,
  GUEST_AUTHORED_RETAINED_KEYS
} from '../guestRetention';

jest.mock('../../services/authService', () => ({
  __esModule: true,
  default: {
    isConfigured: false,
    signInAsAnonymous: jest.fn(),
    generateFriendId: jest.fn(() => 'FRIEND-TEST'),
    onAuthStateChange: jest.fn(() => () => {}),
    signOut: jest.fn(async () => ({ success: true })),
    getCurrentUser: jest.fn(() => null),
    getUserData: jest.fn(async () => null)
  }
}));

const ROOMS_RAW = '[{"id":"room_local_1","name":"Guest Keep"}]';
const ROOM_STATE_RAW = '{"tokens":[{"id":"t1"}]}';
const GUEST_CHARS_RAW = '[{"id":"char_1","name":"Guest Hero"}]';

function seedGuestAuthored() {
  localStorage.setItem('mythrill_local_rooms', ROOMS_RAW);
  localStorage.setItem('mythrill_local_room_state_room_local_1', ROOM_STATE_RAW);
  localStorage.setItem('mythrill-guest-characters', GUEST_CHARS_RAW);
}

function assertGuestAuthoredIntact() {
  expect(localStorage.getItem('mythrill_local_rooms')).toBe(ROOMS_RAW);
  expect(localStorage.getItem('mythrill_local_room_state_room_local_1')).toBe(ROOM_STATE_RAW);
  expect(localStorage.getItem('mythrill-guest-characters')).toBe(GUEST_CHARS_RAW);
}

describe('Wave A E — guest retention', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
    resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests();
    resetStorageInvalidationForTests();
  });

  it('WA-16 guest sign-in failure leaves authored drafts byte-for-byte unchanged', async () => {
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: false, error: 'anonymous auth down' });
    seedGuestAuthored();
    localStorage.setItem('mythrill-guest-user', '{"uid":"old-guest"}');

    const result = await useAuthStore.getState().signInAsGuest();

    expect(result.success).toBe(false);
    expect(authService.signInAsAnonymous).toHaveBeenCalledTimes(1);
    assertGuestAuthoredIntact();
    // No pre-auth destructive clearing: identity marker is untouched too.
    expect(localStorage.getItem('mythrill-guest-user')).toBe('{"uid":"old-guest"}');
  });

  it('WA-17 guest logout retains authored drafts and clears only session/transient state', async () => {
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: { uid: 'anon-1' } });
    seedGuestAuthored();
    localStorage.setItem('mythrill-guest-user', '{"uid":"old-guest"}');
    localStorage.setItem('mythrill-active-character', 'char_1');
    localStorage.setItem('mythrill-guest-joined-room', '{"id":"room_x"}');
    sessionStorage.setItem('selectedRoomPassword', 'pw');
    sessionStorage.setItem('pendingGMSessionInvitation', '{"id":"inv"}');

    const signIn = await useAuthStore.getState().signInAsGuest();
    expect(signIn.success).toBe(true);
    assertGuestAuthoredIntact();
    expect(sessionStorage.getItem('selectedRoomPassword')).toBeNull();
    expect(sessionStorage.getItem('pendingGMSessionInvitation')).toBeNull();
    expect(localStorage.getItem('mythrill-active-character')).toBeNull();

    const signOut = await useAuthStore.getState().signOut();
    expect(signOut.success).toBe(true);
    assertGuestAuthoredIntact();
    expect(localStorage.getItem('mythrill-guest-user')).toBeNull();
    expect(localStorage.getItem('mythrill-guest-user-data')).toBeNull();
    expect(localStorage.getItem('mythrill-guest-joined-room')).toBeNull();
    expect(localStorage.getItem('mythrill-active-character')).toBeNull();
  });

  it('WA-18 anonymous UID rotation never creates a user scope or a new guest domain', () => {
    const first = coordinateAuthPrincipalChange({ user: { uid: 'anon-X', isAnonymous: true } });
    const second = coordinateAuthPrincipalChange({ user: { uid: 'anon-Y', isAnonymous: true } });
    expect(first.gate.scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });
    expect(second.gate.scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });
    expect(second.changed).toBe(false);
    expect(Object.keys(localStorage).some((key) => key.includes('anon-'))).toBe(false);
  });

  it('WA-19 guest→real-user activation never copies, merges or uploads guest drafts', () => {
    seedGuestAuthored();
    coordinateAuthPrincipalChange({ user: { uid: 'anon-1', isAnonymous: true } });
    const handoff = coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });

    expect(handoff.gate.scope).toEqual({ scopeKind: 'user', scopeId: 'user-a' });
    assertGuestAuthoredIntact();
    const adopted = Object.keys(localStorage).filter((key) => key.startsWith('mythrill:p5:user:user-a:'));
    expect(adopted).toEqual([]);
  });

  it('guestRetention helper protects authored keys even against a malicious key list', () => {
    seedGuestAuthored();
    const result = clearGuestSessionState();
    expect(isGuestAuthoredKey('mythrill_local_rooms')).toBe(true);
    expect(isGuestAuthoredKey('mythrill_local_room_state_any')).toBe(true);
    expect(isGuestAuthoredKey('mythrill-player-state-r_c')).toBe(true);
    expect(GUEST_AUTHORED_RETAINED_KEYS).toContain('mythrill-guest-characters');
    for (const key of result.retainedAuthored) {
      expect(isGuestAuthoredKey(key)).toBe(true);
    }
    assertGuestAuthoredIntact();
  });
});

describe('Wave A F — socket principal retirement', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('WA-20/WA-21/WA-22 retirement disconnects old socket, drops listeners/refs, clears pending join, emits no membership revocation', () => {
    const socket = {
      removeAllListeners: jest.fn(),
      disconnect: jest.fn(),
      emit: jest.fn()
    };
    const refs = {
      currentRoomRef: { current: { id: 'room-a' } },
      roomPasswordRef: { current: 'pw' },
      currentPlayerRef: { current: { id: 'player-a' } }
    };
    localStorage.setItem('selectedRoomId', 'room-a');
    localStorage.setItem('isGMResume', 'true');
    localStorage.setItem('resumeRoomName', 'A Room');
    sessionStorage.setItem('selectedRoomPassword', 'pw');
    sessionStorage.setItem('pendingGMSessionInvitation', '{"invitationId":"i1"}');
    sessionStorage.setItem('invitationRetryCount', '2');

    const result = retireSocketPrincipal({ socket, refs });

    expect(result.socketRetired).toBe(true);
    expect(result.listenersDetached).toBe(true);
    expect(result.disconnected).toBe(true);
    expect(isSocketRetired(socket)).toBe(true);
    expect(socket.removeAllListeners).toHaveBeenCalledTimes(1);
    expect(socket.disconnect).toHaveBeenCalledTimes(1);

    // Late A packets: the retired socket emits nothing at all, and specifically
    // never a membership revocation/kick (P4 H1 remains server-controlled).
    expect(socket.emit).not.toHaveBeenCalled();
    expect(JSON.stringify(socket.emit.mock.calls)).not.toMatch(/membership|kick|remove_room_member/);

    expect(refs.currentRoomRef.current).toBeNull();
    expect(refs.roomPasswordRef.current).toBeNull();
    expect(refs.currentPlayerRef.current).toBeNull();

    expect(localStorage.getItem('selectedRoomId')).toBeNull();
    expect(localStorage.getItem('isGMResume')).toBeNull();
    expect(localStorage.getItem('resumeRoomName')).toBeNull();
    expect(sessionStorage.getItem('selectedRoomPassword')).toBeNull();
    expect(sessionStorage.getItem('pendingGMSessionInvitation')).toBeNull();
    expect(sessionStorage.getItem('invitationRetryCount')).toBeNull();
  });

  it('retirement is idempotent and clearPendingJoinState reports removed keys', () => {
    const socket = { removeAllListeners: jest.fn(), disconnect: jest.fn() };
    retireSocketPrincipal({ socket });
    expect(() => retireSocketPrincipal({ socket })).not.toThrow();

    sessionStorage.setItem('enteringMultiplayer', 'true');
    const cleared = clearPendingJoinState();
    expect(cleared.removed).toContain('enteringMultiplayer');
    expect(sessionStorage.getItem('enteringMultiplayer')).toBeNull();
  });

  it('principalKeyOfAuthState distinguishes signed-out / user / guest', () => {
    const { principalKeyOfAuthState } = require('../handoff/socketPrincipalRetirement');
    expect(principalKeyOfAuthState({ user: null })).toBe('public:none');
    expect(principalKeyOfAuthState({ user: { uid: 'user-a' } })).toBe('user:user-a');
    expect(principalKeyOfAuthState({ user: { uid: 'anon-9', isAnonymous: true } })).toBe('guest:local-guest');
  });
});
