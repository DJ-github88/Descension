/**
 * Guest-login correction — focused regressions on the ACTUAL authStore.
 *
 * Only the auth-service boundary is replaced (controlled, deferred promises and a
 * captured Firebase auth-state listener). authStore, guestRetention, the P5
 * bootstrap gate binding and the handoff coordinator are all production code.
 *
 * Defects covered:
 *  1. initializeAuth called a nonexistent setIsAuthenticated action.
 *  2. Firebase anonymous callbacks (isAnonymous, no isGuest) were adopted as
 *     registered identities, advanced the auth intent and cancelled the very
 *     guest sign-in that produced them.
 *
 * This file does not claim real Firebase behaviour: the listener is driven by
 * hand, in the orders the SDK can produce.
 */

import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import {
  getBootstrapGateState,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import {
  resetHandoffCoordinatorForTests,
  whenHandoffIdle
} from '../handoff/accountHandoffCoordinator';
import { resetStorageInvalidationForTests } from '../storageInvalidation';

jest.mock('../../services/authService', () => ({
  __esModule: true,
  default: {
    isConfigured: true,
    signInAsAnonymous: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithGoogle: jest.fn(),
    generateFriendId: jest.fn(() => 'FRIEND-TEST'),
    onAuthStateChange: jest.fn(() => () => {}),
    signOut: jest.fn(async () => ({ success: true })),
    getCurrentUser: jest.fn(() => null),
    getUserData: jest.fn(async () => null)
  }
}));

const ROOMS_RAW = '[{"id":"room_local_1","name":"Guest Keep"}]';
const GUEST_CHARS_RAW = '[{"id":"char_1","name":"Guest Hero"}]';
const EXPLICIT = 'mythrill-guest-explicit-login';

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};
const flush = async () => {
  for (let i = 0; i < 6; i += 1) await Promise.resolve();
  await whenHandoffIdle();
};
const rawAnon = (uid) => ({ uid, isAnonymous: true });
const rawRegistered = (uid) => ({ uid, isAnonymous: false, email: `${uid}@test.local` });

function seedAuthored() {
  localStorage.setItem('mythrill_local_rooms', ROOMS_RAW);
  localStorage.setItem('mythrill-guest-characters', GUEST_CHARS_RAW);
}
function expectAuthoredIntact() {
  expect(localStorage.getItem('mythrill_local_rooms')).toBe(ROOMS_RAW);
  expect(localStorage.getItem('mythrill-guest-characters')).toBe(GUEST_CHARS_RAW);
}
function expectNoGuestIdentity() {
  expect(localStorage.getItem(EXPLICIT)).toBeNull();
  expect(localStorage.getItem('mythrill-guest-user')).toBeNull();
  expect(localStorage.getItem('mythrill-guest-user-data')).toBeNull();
}

let listener;
let unsubscribe;

function resetStore() {
  useAuthStore.setState({
    user: null,
    userData: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAdminBypass: false,
    isDevelopmentBypass: false
  });
}

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  authService.isConfigured = true;
  authService.getCurrentUser.mockReturnValue(null);
  authService.getUserData.mockImplementation(async () => null);
  authService.signOut.mockImplementation(async () => ({ success: true }));
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  resetStorageInvalidationForTests();
  resetStore();
  listener = undefined;
  authService.onAuthStateChange.mockImplementation((cb) => {
    listener = cb;
    return () => { listener = undefined; };
  });
  unsubscribe = useAuthStore.getState().initializeAuth();
  await flush();
});

afterEach(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
  unsubscribe = undefined;
});

describe('defect 1 — initializeAuth guest restore', () => {
  const restart = async () => {
    resetStore();
    if (typeof unsubscribe === 'function') unsubscribe();
    unsubscribe = useAuthStore.getState().initializeAuth();
    await flush();
  };

  it('restores an explicitly-logged-in guest without throwing and keeps the local profile', async () => {
    seedAuthored();
    localStorage.setItem('mythrill-guest-user', JSON.stringify({ uid: 'guest-1', isGuest: true, displayName: 'Guest1' }));
    localStorage.setItem('mythrill-guest-user-data', JSON.stringify({ displayName: 'Guest1', isGuest: true, characters: [] }));
    localStorage.setItem(EXPLICIT, 'true');

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    resetStore();
    expect(() => { unsubscribe = useAuthStore.getState().initializeAuth(); }).not.toThrow();
    await flush();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toMatchObject({ uid: 'guest-1', isGuest: true });
    // getUserData resolves null: a guest has no Firestore profile and must keep the local one.
    expect(state.userData).toMatchObject({ displayName: 'Guest1', isGuest: true });
    expect(authService.getUserData).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });
    expectAuthoredIntact();
  });

  it('does not restore a guest without the explicit flag, and retains authored drafts', async () => {
    seedAuthored();
    localStorage.setItem('mythrill-guest-user', JSON.stringify({ uid: 'guest-1', isGuest: true }));
    localStorage.setItem('mythrill-guest-user-data', JSON.stringify({ isGuest: true }));
    await restart();
    expect(useAuthStore.getState().user).toBeNull();
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('re-initialisation never replaces an already-active principal with stored guest markers', async () => {
    localStorage.setItem('mythrill-guest-user', JSON.stringify({ uid: 'guest-1', isGuest: true }));
    localStorage.setItem('mythrill-guest-user-data', JSON.stringify({ isGuest: true }));
    localStorage.setItem(EXPLICIT, 'true');
    useAuthStore.setState({ user: rawRegistered('acct-A'), isAuthenticated: true });
    useAuthStore.getState().initializeAuth();
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('acct-A');
    // Still-valid markers are neither consumed nor cleared by a no-op re-init.
    expect(localStorage.getItem(EXPLICIT)).toBe('true');
  });
});

describe('defect 2 — anonymous callbacks vs explicit guest login', () => {
  it('guest login completes when Firebase fires the anonymous callback DURING the sign-in', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockImplementation(async () => {
      listener(rawAnon('anon-1')); // SDK emits before the promise settles
      return { success: true, user: rawAnon('anon-1') };
    });

    const result = await useAuthStore.getState().signInAsGuest();
    await flush();

    expect(result).toEqual({ success: true });
    const state = useAuthStore.getState();
    expect(state.user).toMatchObject({ uid: 'anon-1', isGuest: true });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem(EXPLICIT)).toBe('true');
    expect(authService.getUserData).not.toHaveBeenCalled();
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'guest', scopeId: 'local-guest' });
    expectAuthoredIntact();
  });

  it('guest login completes when the anonymous callback arrives AFTER the promise settles', async () => {
    const d = deferred();
    authService.signInAsAnonymous.mockImplementation(() => d.promise);
    const pending = useAuthStore.getState().signInAsGuest();
    d.resolve({ success: true, user: rawAnon('anon-2') });
    const result = await pending;
    listener(rawAnon('anon-2'));
    await flush();
    expect(result.success).toBe(true);
    expect(useAuthStore.getState().user).toMatchObject({ uid: 'anon-2', isGuest: true });
    expect(authService.getUserData).not.toHaveBeenCalled();
  });

  it('an anonymous callback outside any guest login does not create an identity or touch storage', async () => {
    seedAuthored();
    listener(rawAnon('anon-orphan'));
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(authService.getUserData).not.toHaveBeenCalled();
    expect(getBootstrapGateState().scope).toBeNull();
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('an anonymous callback does not advance the auth intent (a pending guest login still commits)', async () => {
    const d = deferred();
    authService.signInAsAnonymous.mockImplementation(() => d.promise);
    const pending = useAuthStore.getState().signInAsGuest();
    listener(rawAnon('anon-3'));
    listener(rawAnon('anon-3-rotated'));
    d.resolve({ success: true, user: rawAnon('anon-3') });
    expect((await pending).superseded).toBeUndefined();
    expect(useAuthStore.getState().user.uid).toBe('anon-3');
  });
});

describe('supersession of a pending guest login', () => {
  const startPendingGuest = () => {
    const d = deferred();
    authService.signInAsAnonymous.mockImplementation(() => d.promise);
    return { d, pending: useAuthStore.getState().signInAsGuest() };
  };

  it('logout supersedes it: late completion writes nothing and stays signed out', async () => {
    seedAuthored();
    const { d, pending } = startPendingGuest();
    await useAuthStore.getState().signOut();
    d.resolve({ success: true, user: rawAnon('anon-late') });
    const result = await pending;
    await flush();

    expect(result).toMatchObject({ success: false, superseded: true, error: 'superseded-by-newer-auth' });
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('an account login supersedes it: the registered principal and its scope win', async () => {
    seedAuthored();
    const { d, pending } = startPendingGuest();
    authService.signIn.mockResolvedValueOnce({ success: true });
    await useAuthStore.getState().signIn('a@test.local', 'pw');
    listener(rawRegistered('acct-A')); // provider adopts the account
    d.resolve({ success: true, user: rawAnon('anon-late') });
    const result = await pending;
    await flush();

    expect(result.superseded).toBe(true);
    expect(useAuthStore.getState().user.uid).toBe('acct-A');
    expect(useAuthStore.getState().user.isGuest).toBeUndefined();
    expectNoGuestIdentity();
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'acct-A' });
    expectAuthoredIntact();
  });

  it('a registered provider callback alone (no explicit action) supersedes it', async () => {
    const { d, pending } = startPendingGuest();
    listener(rawRegistered('acct-B'));
    expect(useAuthStore.getState().isLoading).toBe(false);
    d.resolve({ success: true, user: rawAnon('anon-late') });
    expect((await pending).superseded).toBe(true);
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('acct-B');
    expectNoGuestIdentity();
  });

  it('overlapping guest attempts: only the newest commits, flag written once for it', async () => {
    const first = deferred();
    const second = deferred();
    authService.signInAsAnonymous
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const p1 = useAuthStore.getState().signInAsGuest();
    const p2 = useAuthStore.getState().signInAsGuest();
    second.resolve({ success: true, user: rawAnon('anon-second') });
    expect((await p2).success).toBe(true);
    first.resolve({ success: true, user: rawAnon('anon-first') });
    expect((await p1).superseded).toBe(true);
    await flush();

    expect(useAuthStore.getState().user.uid).toBe('anon-second');
    expect(JSON.parse(localStorage.getItem('mythrill-guest-user')).uid).toBe('anon-second');
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});

describe('delayed callbacks after newer identity transitions', () => {
  it('a delayed anonymous callback cannot clobber a registered identity', async () => {
    listener(rawRegistered('acct-A'));
    await flush();
    listener(rawAnon('anon-stale'));
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('acct-A');
    expect(getBootstrapGateState().scope).toEqual({ scopeKind: 'user', scopeId: 'acct-A' });
  });

  it('a delayed anonymous callback after logout does not resurrect a session', async () => {
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
    await useAuthStore.getState().signOut();
    listener(rawAnon('anon-1'));
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('a late getUserData for a previous account never lands on the current identity', async () => {
    const dataA = deferred();
    authService.getUserData.mockImplementation((uid) => (uid === 'acct-A' ? dataA.promise : Promise.resolve({ id: uid, displayName: 'B profile' })));
    listener(rawRegistered('acct-A'));
    listener(rawRegistered('acct-B'));
    await flush();
    dataA.resolve({ id: 'acct-A', displayName: 'A profile' });
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('acct-B');
    expect(useAuthStore.getState().userData).toMatchObject({ id: 'acct-B' });
  });

  it('a late getUserData for an account cannot repopulate userData after logout', async () => {
    const dataA = deferred();
    authService.getUserData.mockImplementation(() => dataA.promise);
    listener(rawRegistered('acct-A'));
    listener(null);
    await flush();
    dataA.resolve({ id: 'acct-A', displayName: 'A profile' });
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().userData).toBeNull();
  });
});

describe('Firebase null callbacks', () => {
  it('preserve a valid guest session', async () => {
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
    listener(null);
    await flush();
    const state = useAuthStore.getState();
    expect(state.user).toMatchObject({ uid: 'anon-1', isGuest: true });
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem(EXPLICIT)).toBe('true');
  });

  it('do not undo a guest logout, and a logged-out reload does not restore the guest', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
    await useAuthStore.getState().signOut();
    listener(null);
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expectNoGuestIdentity();
    expectAuthoredIntact();

    resetStore();
    useAuthStore.getState().initializeAuth();
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('still sign a registered user out', async () => {
    listener(rawRegistered('acct-A'));
    await flush();
    listener(null);
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expect(getBootstrapGateState().scope).toBeNull();
  });

  it('still respect the admin bypass', async () => {
    useAuthStore.setState({ user: { uid: 'admin-dev-user', isAdmin: true }, isAdminBypass: true, isAuthenticated: true });
    listener(null);
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('admin-dev-user');
  });
});

describe('explicit-login flag lifetime and cleanup', () => {
  it('guest -> account: markers retire, authored drafts stay, reload after account logout does not resurrect the guest', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
    const guestGen = getBootstrapGateState().accountGeneration;
    expect(localStorage.getItem(EXPLICIT)).toBe('true');

    listener(rawRegistered('acct-A'));
    await flush();
    expectNoGuestIdentity();
    expectAuthoredIntact();
    const gate = getBootstrapGateState();
    expect(gate.scope).toEqual({ scopeKind: 'user', scopeId: 'acct-A' });
    expect(gate.accountGeneration).toBeGreaterThan(guestGen);
    expect(Object.keys(localStorage).filter((k) => k.startsWith('mythrill:p5:user:acct-A:'))).toEqual([]);

    listener(null);
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    resetStore();
    useAuthStore.getState().initializeAuth();
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
    expectAuthoredIntact();
  });

  it('account -> guest -> account keeps scopes separate and drafts untouched', async () => {
    seedAuthored();
    listener(rawRegistered('acct-A'));
    await flush();
    const scopes = [getBootstrapGateState()];
    await useAuthStore.getState().signOut();
    listener(null);
    await flush();

    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
    await flush();
    scopes.push(getBootstrapGateState());

    listener(rawRegistered('acct-C'));
    await flush();
    scopes.push(getBootstrapGateState());

    expect(scopes.map((g) => `${g.scope?.scopeKind}:${g.scope?.scopeId}`)).toEqual([
      'user:acct-A', 'guest:local-guest', 'user:acct-C'
    ]);
    expect(scopes[1].accountGeneration).toBeGreaterThan(scopes[0].accountGeneration);
    expect(scopes[2].accountGeneration).toBeGreaterThan(scopes[1].accountGeneration);
    expectAuthoredIntact();
  });
});

describe('failure cleanup', () => {
  it('service failure result leaves no guest identity, no flag, authored drafts intact, loading cleared', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValue({ success: false, error: 'anonymous auth down' });
    const result = await useAuthStore.getState().signInAsGuest();
    expect(result).toEqual({ success: false, error: 'anonymous auth down' });
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoading).toBe(false);
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('service rejection behaves the same', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockRejectedValue(new Error('network'));
    const result = await useAuthStore.getState().signInAsGuest();
    expect(result).toMatchObject({ success: false, error: 'network' });
    expect(useAuthStore.getState().isLoading).toBe(false);
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('a storage write failure part-way rolls back the half-written identity and does not authenticate', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    const realSetItem = Storage.prototype.setItem;
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === EXPLICIT) throw new Error('QuotaExceededError');
      return realSetItem.call(this, key, value);
    });
    const result = await useAuthStore.getState().signInAsGuest();
    spy.mockRestore();

    expect(result).toMatchObject({ success: false, error: 'QuotaExceededError' });
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expectNoGuestIdentity();
    expectAuthoredIntact();
  });

  it('a superseded failure does not clobber the newer attempt state', async () => {
    const first = deferred();
    authService.signInAsAnonymous
      .mockImplementationOnce(() => first.promise)
      .mockResolvedValueOnce({ success: true, user: rawAnon('anon-second') });
    const p1 = useAuthStore.getState().signInAsGuest();
    const p2 = useAuthStore.getState().signInAsGuest();
    expect((await p2).success).toBe(true);
    first.reject(new Error('late failure'));
    await p1;
    expect(useAuthStore.getState().error).toBeNull();
    expect(useAuthStore.getState().user.uid).toBe('anon-second');
  });
});

describe('refreshAuthState (App.jsx calls it after init)', () => {
  const guestActive = async () => {
    authService.signInAsAnonymous.mockResolvedValue({ success: true, user: rawAnon('anon-1') });
    await useAuthStore.getState().signInAsGuest();
  };

  it('does not replace an active guest with the raw anonymous Firebase user', async () => {
    await guestActive();
    authService.getCurrentUser.mockReturnValue(rawAnon('anon-1'));
    await useAuthStore.getState().refreshAuthState();
    await flush();
    expect(useAuthStore.getState().user).toMatchObject({ uid: 'anon-1', isGuest: true });
    expect(useAuthStore.getState().userData).toMatchObject({ isGuest: true });
    expect(authService.getUserData).not.toHaveBeenCalled();
  });

  it('does not wipe an active guest when Firebase reports no current user', async () => {
    await guestActive();
    authService.getCurrentUser.mockReturnValue(null);
    await useAuthStore.getState().refreshAuthState();
    expect(useAuthStore.getState().user).toMatchObject({ isGuest: true });
    expect(localStorage.getItem(EXPLICIT)).toBe('true');
  });

  it('ignores an anonymous user when signed out, but still adopts a registered one', async () => {
    authService.getCurrentUser.mockReturnValue(rawAnon('anon-x'));
    await useAuthStore.getState().refreshAuthState();
    expect(useAuthStore.getState().user).toBeNull();
    authService.getCurrentUser.mockReturnValue(rawRegistered('acct-A'));
    await useAuthStore.getState().refreshAuthState();
    expect(useAuthStore.getState().user.uid).toBe('acct-A');
  });
});

describe('a failed second guest attempt vs an already-active guest', () => {
  const failWriteOf = (target) => {
    const realSetItem = Storage.prototype.setItem;
    let failed = false; // fail only the attempt's own write; the rollback restore must succeed
    return jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === target && !failed) { failed = true; throw new Error('QuotaExceededError'); }
      return realSetItem.call(this, key, value);
    });
  };
  const KEYS = ['mythrill-guest-user', 'mythrill-guest-user-data', 'mythrill-guest-initialized', EXPLICIT];

  it('storage failure restores the active guest markers byte-for-byte and keeps its scope', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: rawAnon('anon-A') });
    await useAuthStore.getState().signInAsGuest();
    await flush();
    const before = Object.fromEntries(KEYS.map((k) => [k, localStorage.getItem(k)]));
    const gateBefore = getBootstrapGateState();

    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: rawAnon('anon-B') });
    const spy = failWriteOf(EXPLICIT);
    const result = await useAuthStore.getState().signInAsGuest();
    spy.mockRestore();
    await flush();

    expect(result).toMatchObject({ success: false, error: 'QuotaExceededError' });
    expect(Object.fromEntries(KEYS.map((k) => [k, localStorage.getItem(k)]))).toEqual(before);
    expect(useAuthStore.getState().user).toMatchObject({ uid: 'anon-A', isGuest: true });
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(getBootstrapGateState().scope).toEqual(gateBefore.scope);
    expect(getBootstrapGateState().accountGeneration).toBe(gateBefore.accountGeneration);
    expectAuthoredIntact();
    // and a reload still restores guest A
    resetStore();
    useAuthStore.getState().initializeAuth();
    await flush();
    expect(useAuthStore.getState().user.uid).toBe('anon-A');
  });

  it('service failure of the second attempt never touches the active guest markers', async () => {
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: rawAnon('anon-A') });
    await useAuthStore.getState().signInAsGuest();
    const before = Object.fromEntries(KEYS.map((k) => [k, localStorage.getItem(k)]));
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: false, error: 'down' });
    await useAuthStore.getState().signInAsGuest();
    expect(Object.fromEntries(KEYS.map((k) => [k, localStorage.getItem(k)]))).toEqual(before);
    expect(useAuthStore.getState().user.uid).toBe('anon-A');
  });
});

describe('admin bypass taking over from a guest', () => {
  it('retires guest markers, keeps authored drafts, and a reload after admin logout does not resurrect the guest', async () => {
    seedAuthored();
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: rawAnon('anon-A') });
    await useAuthStore.getState().signInAsGuest();
    const result = await useAuthStore.getState().signInAsAdmin();
    if (!result.success) return; // admin login disabled in production builds
    expectNoGuestIdentity();
    expectAuthoredIntact();
    useAuthStore.getState().disableAdminBypass();
    resetStore();
    useAuthStore.getState().initializeAuth();
    await flush();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
