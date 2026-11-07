/**
 * Guest identity vs. the global social/presence socket — focused regressions.
 *
 * REAL code: authStore (signInAsGuest / setUser / signOut), guestRetention,
 * the P5 bootstrap gate + principal retirement helpers, presenceStore
 * (initializeGlobalSocket token construction).
 * FIXTURE boundaries (not live services): authService (controlled deferred
 * promises), socket.io-client `io` (captures the handshake auth option; no
 * network), presenceService, and config/env.isProduction (toggled).
 *
 * Server-side half of the same contract (production handshake rejects
 * dev-token-*, guests connect tokenless, register_presence ignores client
 * uids) is in server/tests/guestPresenceIdentity.test.js.
 */

import authService from '../../services/authService';
import useAuthStore from '../../store/authStore';
import usePresenceStore from '../../store/presenceStore';
import { registerStore } from '../../store/storeRegistry';
import { resetBootstrapGateForTests, clearToSignedOut } from '../bootstrapPrivacyGate';
import {
  registerDefaultHandoffParticipants,
  resetHandoffCoordinatorForTests,
  whenHandoffIdle
} from '../handoff/accountHandoffCoordinator';
import { resetStorageInvalidationForTests } from '../storageInvalidation';
import { io } from 'socket.io-client';

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

jest.mock('../../services/firebase/presenceService', () => ({
  __esModule: true,
  default: { cleanup: jest.fn(), initialize: jest.fn() }
}));

var mockProduction = false; // var: imports are hoisted above this line (authStore reads isProduction at load)
jest.mock('../../config/env', () => {
  const actual = jest.requireActual('../../config/env');
  return { ...actual, isProduction: () => mockProduction };
});

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

const makeFakeSocket = () => {
  const handlers = {};
  return {
    connected: false,
    handlers,
    on: jest.fn((evt, cb) => { handlers[evt] = cb; }),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn()
  };
};

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};
const flush = async () => {
  for (let i = 0; i < 8; i += 1) await Promise.resolve();
  await whenHandoffIdle();
};

const ROOMS_RAW = '[{"id":"room_local_1","name":"Guest Keep"}]';
const CHARS_RAW = '[{"id":"char_1","name":"Guest Hero"}]';
const EXPLICIT = 'mythrill-guest-explicit-login';
const fbAnon = (uid) => ({ uid, isAnonymous: true });
// socket.io-client's handshake rule: a function is called per attempt, an object reused.
const resolveHandshake = (auth) => new Promise((resolve) => {
  if (typeof auth === 'function') auth((payload) => resolve(payload ? payload.token : undefined));
  else resolve(auth ? auth.token : undefined);
});
const handshakeTokens = () => Promise.all(io.mock.calls.map((c) => resolveHandshake(c[1]?.auth)));

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  mockProduction = false;
  authService.isConfigured = true;
  authService.getCurrentUser.mockReturnValue(null);
  authService.getUserData.mockImplementation(async () => null);
  authService.signOut.mockImplementation(async () => ({ success: true }));
  io.mockImplementation(() => makeFakeSocket());
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  resetStorageInvalidationForTests();
  useAuthStore.setState({
    user: null, userData: null, isAuthenticated: false, isLoading: false,
    error: null, isAdminBypass: false, isDevelopmentBypass: false
  });
  usePresenceStore.setState({ socket: null, isConnected: false });
  registerStore('authStore', useAuthStore);
  registerStore('presenceStore', usePresenceStore);
  await flush();
});

async function guestLogin(uid) {
  authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: fbAnon(uid) });
  const result = await useAuthStore.getState().signInAsGuest();
  expect(result).toEqual({ success: true });
  return result;
}

describe('presence socket token — guest', () => {
  it('PRODUCTION: a guest never sends a fabricated dev-token (guests connect tokenless; the server rejects dev-token-* in production)', async () => {
    mockProduction = true;
    await guestLogin('anon-1');
    await usePresenceStore.getState().initializeGlobalSocket();
    expect(io).toHaveBeenCalledTimes(1);
    expect(await handshakeTokens()).toEqual([null]);
  });

  it('DEVELOPMENT: a local guest is tokenless too (dev/prod parity; no dev-token impersonation), whatever Firebase holds', async () => {
    await guestLogin('anon-1');
    authService.getCurrentUser.mockReturnValue(fbAnon('firebase-other'));
    await usePresenceStore.getState().initializeGlobalSocket();
    expect(await handshakeTokens()).toEqual([null]);
  });

  it('DEVELOPMENT: a non-guest dev user keeps its dev token (legitimate developer path preserved)', async () => {
    useAuthStore.setState({ user: { uid: 'dev-7', email: 'dev@test.local', isAnonymous: false }, isAuthenticated: true });
    await usePresenceStore.getState().initializeGlobalSocket();
    expect(await handshakeTokens()).toEqual(['dev-token-dev-7']);
  });

  it('failed second guest attempt: store identity, token and local data stay with the first guest (Firebase holds a different uid)', async () => {
    mockProduction = true;
    localStorage.setItem('mythrill_local_rooms', ROOMS_RAW);
    localStorage.setItem('mythrill-guest-characters', CHARS_RAW);
    await guestLogin('anon-1');

    // Second attempt: Firebase hands out a NEW anonymous uid, then storage fails.
    authService.signInAsAnonymous.mockResolvedValueOnce({ success: true, user: fbAnon('anon-2') });
    authService.getCurrentUser.mockReturnValue(fbAnon('anon-2'));
    const realSetItem = Storage.prototype.setItem;
    let failed = false; // one-shot: the rollback must be able to write the old markers back
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (k, v) {
      if (k === 'mythrill-guest-user-data' && !failed) { failed = true; throw new Error('quota'); }
      return realSetItem.call(this, k, v);
    });
    const second = await useAuthStore.getState().signInAsGuest();
    spy.mockRestore();
    expect(second.success).toBe(false);

    const s = useAuthStore.getState();
    expect(s.user).toMatchObject({ uid: 'anon-1', isGuest: true });
    expect(localStorage.getItem(EXPLICIT)).toBe('true');
    expect(JSON.parse(localStorage.getItem('mythrill-guest-user')).uid).toBe('anon-1');
    expect(localStorage.getItem('mythrill_local_rooms')).toBe(ROOMS_RAW);
    expect(localStorage.getItem('mythrill-guest-characters')).toBe(CHARS_RAW);

    await usePresenceStore.getState().initializeGlobalSocket();
    expect(await handshakeTokens()).toEqual([null]); // production: tokenless guest, no uid on the wire
  });
});

describe('presence socket token — delayed callbacks and superseding work', () => {
  const acct = (uid, tokenPromise) => ({
    uid, email: `${uid}@test.local`, isAnonymous: false,
    getIdToken: () => tokenPromise
  });

  it('a registered token that resolves after sign-out must not open a socket for the old account', async () => {
    mockProduction = true;
    const tokenA = deferred();
    useAuthStore.getState().setUser(acct('acct-A', tokenA.promise));
    await flush();

    const pending = usePresenceStore.getState().initializeGlobalSocket();
    await flush();
    useAuthStore.getState().setUser(null); // logout while the token is in flight
    await flush();
    tokenA.resolve('verified-token-A');
    await pending;
    await flush();

    expect(await handshakeTokens()).not.toContain('verified-token-A');
    expect(usePresenceStore.getState().socket).toBeNull();
  });

  it('a registered token that resolves after A→guest supersedes: no socket carries account A\'s token', async () => {
    mockProduction = true;
    const tokenA = deferred();
    useAuthStore.getState().setUser(acct('acct-A', tokenA.promise));
    await flush();
    const pending = usePresenceStore.getState().initializeGlobalSocket();
    await flush();

    useAuthStore.getState().setUser(null);
    await guestLogin('anon-9');
    tokenA.resolve('verified-token-A');
    await pending;
    await flush();

    expect(await handshakeTokens()).not.toContain('verified-token-A');
    expect(useAuthStore.getState().user).toMatchObject({ uid: 'anon-9', isGuest: true });
  });

  it('control: an unchanged registered principal still connects with its verified token', async () => {
    mockProduction = true;
    useAuthStore.getState().setUser(acct('acct-A', Promise.resolve('verified-token-A')));
    await flush();
    await usePresenceStore.getState().initializeGlobalSocket();
    expect(await handshakeTokens()).toEqual(['verified-token-A']);
  });

  it('a pending guest sign-in superseded by logout never applies, and drafts stay', async () => {
    localStorage.setItem('mythrill_local_rooms', ROOMS_RAW);
    const anon = deferred();
    authService.signInAsAnonymous.mockReturnValueOnce(anon.promise);
    const attempt = useAuthStore.getState().signInAsGuest();
    await useAuthStore.getState().signOut();
    anon.resolve({ success: true, user: fbAnon('late-anon') });
    const result = await attempt;
    expect(result.superseded).toBe(true);
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem(EXPLICIT)).toBeNull();
    expect(localStorage.getItem('mythrill_local_rooms')).toBe(ROOMS_RAW);
  });
});

describe('connect_error fallback and ineligible principal', () => {
  const failFirstSocket = () => {
    const first = io.mock.results[0].value;
    first.handlers.connect_error(new Error('localhost unreachable'));
    return first;
  };

  it('control: with an unchanged guest the fallback URL is tried once, still tokenless', async () => {
    await guestLogin('anon-1');
    await usePresenceStore.getState().initializeGlobalSocket();
    failFirstSocket();
    expect(io).toHaveBeenCalledTimes(2);
    expect(await handshakeTokens()).toEqual([null, null]);
  });

  it('logout before connect_error: no fallback socket is created and no socket is left installed', async () => {
    await guestLogin('anon-1');
    await usePresenceStore.getState().initializeGlobalSocket();
    useAuthStore.getState().setUser(null);
    await flush();
    failFirstSocket();
    expect(io).toHaveBeenCalledTimes(1);
    expect(usePresenceStore.getState().socket).toBeNull();
  });

  it('account-generation change with the same principal key: fallback is refused', async () => {
    await guestLogin('anon-1');
    await usePresenceStore.getState().initializeGlobalSocket();
    clearToSignedOut(); // advances accountGeneration only
    failFirstSocket();
    expect(io).toHaveBeenCalledTimes(1);
  });

  it('guest A replaced by guest B before connect_error: fallback does not reuse A\'s token', async () => {
    await guestLogin('anon-1');
    await usePresenceStore.getState().initializeGlobalSocket();
    useAuthStore.getState().setUser(null);
    await guestLogin('anon-2');
    failFirstSocket();
    expect(io).toHaveBeenCalledTimes(1);
  });

  it('unregistered auth store: no socket is opened, even tokenless', async () => {
    registerStore('authStore', undefined);
    const result = await usePresenceStore.getState().initializeGlobalSocket();
    expect(result).toBeNull();
    expect(io).not.toHaveBeenCalled();
    expect(usePresenceStore.getState().socket).toBeNull();
  });

  it('a live presence socket is retired (disconnected, listeners removed, store cleared) when the principal logs out, so socket.io reconnection cannot resend the old token', async () => {
    registerDefaultHandoffParticipants(); // the app registers these at startup
    await guestLogin('anon-1');
    const socket = await usePresenceStore.getState().initializeGlobalSocket();
    expect(usePresenceStore.getState().socket).toBe(socket);
    await useAuthStore.getState().signOut();
    await flush();
    expect(socket.disconnect).toHaveBeenCalled();
    expect(socket.removeAllListeners).toHaveBeenCalled();
    expect(usePresenceStore.getState().socket).toBeNull();
  });
});
