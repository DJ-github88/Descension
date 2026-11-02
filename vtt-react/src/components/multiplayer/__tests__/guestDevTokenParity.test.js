/**
 * Dev/prod parity for local guests at the multiplayer socket handshake.
 *
 * A local guest must never acquire campaign access through the development
 * `dev-token-<uid>` fallback; legitimate developer/test authentication (a
 * non-guest dev user, the admin/dev bypass without a guest user, a verified
 * registered token) keeps working. Real authStore + real setupSocketConnection;
 * only socket.io's transport and isProduction() are fixtures.
 * The same-principal refresh path (setupAuthChangeHandler) is covered by the last describe block;
 * it uses the same token-selection condition as the initial handshake.
 */
import { setupSocketConnection } from '../useSocketConnection';
import useAuthStore from '../../../store/authStore';
import { io } from 'socket.io-client';
import { resetBootstrapGateForTests } from '../../../persistence/bootstrapPrivacyGate';

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

var mockProduction = false; // var: hoisted above imports that read isProduction at load
jest.mock('../../../config/env', () => {
  const actual = jest.requireActual('../../../config/env');
  return { ...actual, isProduction: () => mockProduction };
});

const fakeSocket = () => ({ on: jest.fn(), off: jest.fn(), emit: jest.fn(), connect: jest.fn(), disconnect: jest.fn(), connected: false, io: { on: jest.fn() } });
const flush = async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); };

async function handshakeToken(authPatch) {
  useAuthStore.setState({ user: null, isAuthenticated: false, isAdminBypass: false, isDevelopmentBypass: false, ...authPatch });
  io.mockClear();
  io.mockImplementation(() => fakeSocket());
  const noop = () => {};
  const cleanup = setupSocketConnection({
    SOCKET_URL: 'http://localhost:3001', setSocket: noop, setIsConnecting: noop, setIsJoiningRoom: noop,
    setConnectionStatus: noop, currentRoomRef: { current: null }, currentPlayerRef: { current: null },
    roomPasswordRef: { current: null }, addNotificationRef: { current: noop }, getActiveCharacter: () => null
  });
  await flush();
  const call = io.mock.calls[0];
  cleanup();
  return call ? call[1].auth.token : 'NO-SOCKET';
}

const guest = { uid: 'anon-1', isGuest: true };
const dev = { uid: 'dev-7', email: 'dev@test.local', isAnonymous: false };
const registered = { uid: 'acct-1', email: 'a@test.local', getIdToken: async () => 'verified-A' };

beforeEach(() => { mockProduction = false; resetBootstrapGateForTests(); });

describe('local guest never receives a dev token', () => {
  it('development: guest handshake is tokenless (parity with production)', async () => {
    expect(await handshakeToken({ user: guest, isAuthenticated: true })).toBeNull();
  });
  it('production: guest handshake is tokenless', async () => {
    mockProduction = true;
    expect(await handshakeToken({ user: guest, isAuthenticated: true })).toBeNull();
  });
  it('development: a guest cannot borrow the bypass flags', async () => {
    expect(await handshakeToken({ user: guest, isAuthenticated: true, isAdminBypass: true, isDevelopmentBypass: true })).toBeNull();
  });
});

describe('legitimate developer/test and registered authentication is preserved', () => {
  it('development: non-guest dev user keeps its dev token', async () => {
    expect(await handshakeToken({ user: dev, isAuthenticated: true })).toBe('dev-token-dev-7');
  });
  it('development: admin/dev bypass without a guest user keeps the admin dev token', async () => {
    expect(await handshakeToken({ user: null, isAuthenticated: true, isAdminBypass: true })).toBe('dev-token-admin-dev-user');
  });
  it('production: the same dev user and bypass send no dev token', async () => {
    mockProduction = true;
    expect(await handshakeToken({ user: dev, isAuthenticated: true })).toBeNull();
    expect(await handshakeToken({ user: null, isAuthenticated: true, isAdminBypass: true })).toBeNull();
  });
  it('registered account: verified token in both environments', async () => {
    expect(await handshakeToken({ user: registered, isAuthenticated: true })).toBe('verified-A');
    mockProduction = true;
    expect(await handshakeToken({ user: registered, isAuthenticated: true })).toBe('verified-A');
  });
});

describe('same-principal refresh path (setupAuthChangeHandler)', () => {
  const { setupAuthChangeHandler } = require('../useSocketConnection');

  async function refreshToken(authPatch) {
    useAuthStore.setState({ user: null, isAuthenticated: false, isAdminBypass: false, isDevelopmentBypass: false, ...authPatch });
    const socket = { connected: false, auth: undefined, connect: jest.fn(), disconnect: jest.fn(), emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    const unsubscribe = setupAuthChangeHandler({
      socket, isJoiningRoomRef: { current: false }, isAutoJoinSequenceRef: { current: false },
      currentRoomRef: { current: null }, roomPasswordRef: { current: null }, currentPlayerRef: { current: null },
      pendingRoomDataRef: { current: null }, activeJoinIdRef: { current: null }, autoJoinAttemptedRef: { current: false }
    });
    useAuthStore.setState({ userData: { touched: Date.now() } }); // same principal: triggers the token-refresh branch
    await flush();
    unsubscribe();
    return socket.auth === undefined ? 'NO-REFRESH' : socket.auth.token;
  }

  it('development: a local guest is never given a dev token on refresh', async () => {
    expect(await refreshToken({ user: guest, isAuthenticated: true })).toBeNull();
  });
  it('development: a guest cannot borrow the bypass flags on refresh', async () => {
    expect(await refreshToken({ user: guest, isAuthenticated: true, isAdminBypass: true, isDevelopmentBypass: true })).toBeNull();
  });
  it('development: non-guest dev user and admin bypass keep their dev tokens on refresh', async () => {
    expect(await refreshToken({ user: dev, isAuthenticated: true })).toBe('dev-token-dev-7');
    expect(await refreshToken({ user: null, isAuthenticated: true, isAdminBypass: true })).toBe('dev-token-admin-dev-user');
  });
  it('registered account: verified refreshed token (both environments); production sends no dev token', async () => {
    expect(await refreshToken({ user: registered, isAuthenticated: true })).toBe('verified-A');
    mockProduction = true;
    expect(await refreshToken({ user: registered, isAuthenticated: true })).toBe('verified-A');
    expect(await refreshToken({ user: dev, isAuthenticated: true })).toBeNull();
  });
});
