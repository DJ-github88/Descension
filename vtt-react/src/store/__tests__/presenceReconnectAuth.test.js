/**
 * Global social/presence socket — registered reconnect after ID-token expiry.
 *
 * socket.io-client re-sends `auth` on every (re)connection: an object is reused
 * verbatim, a function is called per attempt. The presence socket reconnects
 * automatically (reconnection: true); once a Firebase ID token has expired the
 * production middleware refuses that handshake. A reconnect must carry a
 * current token for the SAME principal and generation, never a newer account's,
 * guests stay tokenless, and failures settle exactly once.
 *
 * REAL: authStore, presenceStore.initializeGlobalSocket, bootstrap gate.
 * FIXTURES: socket.io-client `io` (captures options), presenceService,
 * config/env.isProduction, the Firebase user's getIdToken (no real verification).
 */
import useAuthStore from '../authStore';
import usePresenceStore from '../presenceStore';
import { registerStore } from '../storeRegistry';
import { resetBootstrapGateForTests } from '../../persistence/bootstrapPrivacyGate';
import { io } from 'socket.io-client';

jest.mock('../../services/firebase/presenceService', () => ({
  __esModule: true,
  default: { cleanup: jest.fn(), initialize: jest.fn() }
}));

var mockProduction = true; // var: imports are hoisted above this line
jest.mock('../../config/env', () => {
  const actual = jest.requireActual('../../config/env');
  return { ...actual, isProduction: () => mockProduction };
});

jest.mock('socket.io-client', () => ({ io: jest.fn() }));

const makeFakeSocket = () => ({
  connected: false, on: jest.fn(), off: jest.fn(), emit: jest.fn(),
  connect: jest.fn(), disconnect: jest.fn(), removeAllListeners: jest.fn()
});
const flush = async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); };
const handshake = (auth) => new Promise((resolve) => {
  if (typeof auth === 'function') auth((payload) => resolve(payload ? payload.token : undefined));
  else resolve(auth ? auth.token : undefined);
});

function registeredUser(uid) {
  const user = { uid, email: `${uid}@test.local`, isAnonymous: false, issued: 1, calls: 0 };
  user.getIdToken = jest.fn(async () => { user.calls += 1; return `${uid}-idtoken-v${user.issued}`; });
  return user;
}

async function openPresence() {
  await usePresenceStore.getState().initializeGlobalSocket();
  expect(io).toHaveBeenCalledTimes(1);
  return io.mock.calls[0][1].auth;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockProduction = true;
  io.mockImplementation(() => makeFakeSocket());
  resetBootstrapGateForTests();
  useAuthStore.setState({ user: null, userData: null, isAuthenticated: false, isAdminBypass: false, isDevelopmentBypass: false });
  usePresenceStore.setState({ socket: null, isConnected: false });
  registerStore('authStore', useAuthStore);
  registerStore('presenceStore', usePresenceStore);
});

describe('presence socket reconnect handshake', () => {
  it('after expiry a reconnect carries a fresh token for the same registered account', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const auth = await openPresence();
    expect(await handshake(auth)).toBe('acct-A-idtoken-v1');
    userA.issued = 2;
    expect(await handshake(auth)).toBe('acct-A-idtoken-v2');
  });

  it('after an account switch, a reconnect never borrows the newer account\'s token', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const auth = await openPresence();
    expect(await handshake(auth)).toBe('acct-A-idtoken-v1');
    const userB = registeredUser('acct-B');
    useAuthStore.setState({ user: userB, isAuthenticated: true });
    expect(await handshake(auth)).not.toBe('acct-B-idtoken-v1');
    expect(userB.getIdToken).not.toHaveBeenCalled();
  });

  it('local guests stay tokenless on every attempt (production and development)', async () => {
    for (const production of [true, false]) {
      mockProduction = production;
      io.mockClear();
      usePresenceStore.setState({ socket: null, isConnected: false });
      useAuthStore.setState({ user: { uid: 'anon-1', isGuest: true }, isAuthenticated: true });
      const auth = await openPresence();
      expect(await handshake(auth)).toBeNull();
      expect(await handshake(auth)).toBeNull();
    }
  });

  it('a failed refresh on reconnect settles once with this socket\'s own last token', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const auth = await openPresence();
    expect(await handshake(auth)).toBe('acct-A-idtoken-v1');
    userA.getIdToken.mockImplementation(async () => { throw new Error('network-request-failed'); });
    const calls = [];
    auth((payload) => calls.push(payload.token));
    await flush();
    expect(calls).toEqual(['acct-A-idtoken-v1']);
  });
});
