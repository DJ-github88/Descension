/**
 * Campaign socket handshake callback — failure settlement.
 *
 * socket.io-client calls a function-form `auth` once per (re)connection
 * attempt and waits for its callback before sending CONNECT. A callback that
 * throws synchronously or never calls back leaves that attempt stuck (socket
 * `active` but never connected, no connect_error). Every failure must settle
 * exactly once with this socket's own last token: never another principal's,
 * never a retry loop. A refused stale token then ends normally at the server
 * (connect_error; socket.io stops on middleware refusal).
 *
 * Real authStore + real createReconnectAuth; Firebase user is a stand-in.
 */
import { createReconnectAuth } from '../useSocketConnection';
import useAuthStore from '../../../store/authStore';

jest.mock('../../../config/firebase', () => ({
  db: {}, isFirebaseConfigured: false, isDemoMode: true,
  auth: { currentUser: null, onAuthStateChanged: (cb) => { cb(null); return () => {}; } }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(), getDoc: jest.fn(), setDoc: jest.fn(), collection: jest.fn(), addDoc: jest.fn(),
  getDocs: jest.fn(), query: jest.fn(), where: jest.fn(), orderBy: jest.fn(), limit: jest.fn(),
  deleteDoc: jest.fn(), onSnapshot: jest.fn(() => () => {})
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}), getAuth: jest.fn(() => ({ currentUser: null })) }));
jest.mock('socket.io-client', () => ({ io: jest.fn() }));

var mockProduction = true; // var: hoisted above imports that read isProduction at load
jest.mock('../../../config/env', () => {
  const actual = jest.requireActual('../../../config/env');
  return { ...actual, isProduction: () => mockProduction };
});

const flush = async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); };

// Invoke the handshake callback exactly as socket.io-client does; record every
// callback and any synchronous throw.
function attempt(auth) {
  const calls = [];
  let thrown = null;
  try {
    auth((payload) => calls.push(payload ? payload.token : undefined));
  } catch (error) {
    thrown = error;
  }
  return { calls, thrown };
}

beforeEach(() => {
  mockProduction = true;
  jest.useRealTimers();
  useAuthStore.setState({ user: null, isAuthenticated: false, isAdminBypass: false, isDevelopmentBypass: false });
});

describe('handshake callback settles exactly once on failure', () => {
  it('a synchronous throw from the currency check settles with this socket\'s own last token', async () => {
    const getIdToken = jest.fn(async () => 'acct-A-v2');
    useAuthStore.setState({ user: { uid: 'acct-A', getIdToken }, isAuthenticated: true });
    const auth = createReconnectAuth({ initialToken: 'acct-A-v1', isCurrent: () => { throw new Error('gate unavailable'); } });
    const result = attempt(auth);
    await flush();
    expect(result.thrown).toBeNull();
    expect(result.calls).toEqual(['acct-A-v1']);
    expect(getIdToken).not.toHaveBeenCalled();
  });

  it('a rejected token refresh settles once with the last token and is not retried', async () => {
    const getIdToken = jest.fn(async () => { throw new Error('network-request-failed'); });
    useAuthStore.setState({ user: { uid: 'acct-A', getIdToken }, isAuthenticated: true });
    const auth = createReconnectAuth({ initialToken: 'acct-A-v1', isCurrent: () => true });
    const result = attempt(auth);
    await flush();
    expect(result.thrown).toBeNull();
    expect(result.calls).toEqual(['acct-A-v1']);
    expect(getIdToken).toHaveBeenCalledTimes(1);
  });

  it('a synchronous throw from token retrieval settles with the last token', async () => {
    const getIdToken = jest.fn(() => { throw new Error('auth/internal-error'); });
    useAuthStore.setState({ user: { uid: 'acct-A', getIdToken }, isAuthenticated: true });
    const auth = createReconnectAuth({ initialToken: 'acct-A-v1', isCurrent: () => true });
    const result = attempt(auth);
    await flush();
    expect(result.thrown).toBeNull();
    expect(result.calls).toEqual(['acct-A-v1']);
  });

  it('a token retrieval that never settles is bounded: the attempt settles with the last token, and a late token never calls back twice', async () => {
    jest.useFakeTimers();
    let release;
    const getIdToken = jest.fn(() => new Promise((resolve) => { release = resolve; }));
    useAuthStore.setState({ user: { uid: 'acct-A', getIdToken }, isAuthenticated: true });
    const auth = createReconnectAuth({ initialToken: 'acct-A-v1', isCurrent: () => true });
    const result = attempt(auth);
    await flush();
    expect(result.calls).toEqual([]);
    jest.advanceTimersByTime(15000);
    await flush();
    expect(result.calls).toEqual(['acct-A-v1']);
    release('acct-A-v2');
    await flush();
    expect(result.calls).toEqual(['acct-A-v1']);
    jest.useRealTimers();
  });

  it('a token that resolves after the principal changed is not used, even if the check then throws', async () => {
    let release;
    const getIdToken = jest.fn(() => new Promise((resolve) => { release = resolve; }));
    useAuthStore.setState({ user: { uid: 'acct-A', getIdToken }, isAuthenticated: true });
    let current = true;
    const auth = createReconnectAuth({ initialToken: 'acct-A-v1', isCurrent: () => { if (!current) throw new Error('retired'); return true; } });
    const result = attempt(auth);
    current = false;
    release('acct-A-v2');
    await flush();
    expect(result.thrown).toBeNull();
    expect(result.calls).toEqual(['acct-A-v1']);
  });
});
