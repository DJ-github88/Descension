/**
 * Registered-player reconnect after Firebase ID-token expiry.
 *
 * socket.io-client re-sends `auth` on every (re)connection handshake: a plain
 * object is reused verbatim, a function is called again for each attempt
 * (`typeof auth == "function" ? auth(cb) : cb(auth)` in Socket.onopen). A
 * Firebase ID token expires after about an hour; the production middleware
 * then refuses the handshake with a middleware error, after which socket.io
 * does not retry. So a registered player whose session outlives the token
 * and then drops (sleep, Wi-Fi) must present a freshly obtained token for the
 * SAME verified principal, and never a token for a different principal.
 *
 * Real authStore + real setupSocketConnection / setupAuthChangeHandler; only
 * socket.io's transport, Firebase config and isProduction() are fixtures. The
 * user's getIdToken is a stand-in (no real Firebase verification here).
 */
import { setupSocketConnection, setupAuthChangeHandler } from '../useSocketConnection';
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

var mockProduction = true; // var: hoisted above imports that read isProduction at load
jest.mock('../../../config/env', () => {
  const actual = jest.requireActual('../../../config/env');
  return { ...actual, isProduction: () => mockProduction };
});

const flush = async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); };
// Exactly how socket.io-client obtains the handshake payload for each attempt.
const handshakeToken = (auth) => new Promise((resolve) => {
  if (typeof auth === 'function') auth((payload) => resolve(payload ? payload.token : undefined));
  else resolve(auth ? auth.token : undefined);
});

function registeredUser(uid) {
  const user = { uid, email: `${uid}@test.local`, isAnonymous: false, issued: 1, calls: [] };
  user.getIdToken = async (force) => { user.calls.push(force === true); return `${uid}-idtoken-v${user.issued}`; };
  return user;
}

function startSocket() {
  io.mockClear();
  io.mockImplementation(() => ({ on: jest.fn(), off: jest.fn(), emit: jest.fn(), connect: jest.fn(), disconnect: jest.fn(), connected: false, io: { on: jest.fn() } }));
  const noop = () => {};
  const cleanup = setupSocketConnection({
    SOCKET_URL: 'http://localhost:3001', setSocket: noop, setIsConnecting: noop, setIsJoiningRoom: noop,
    setConnectionStatus: noop, currentRoomRef: { current: null }, currentPlayerRef: { current: null },
    roomPasswordRef: { current: null }, addNotificationRef: { current: noop }, getActiveCharacter: () => null
  });
  return cleanup;
}

beforeEach(() => {
  mockProduction = true;
  resetBootstrapGateForTests();
  useAuthStore.setState({ user: null, isAuthenticated: false, isAdminBypass: false, isDevelopmentBypass: false });
});

describe('campaign socket handshake after ID-token expiry', () => {
  it('first handshake carries the verified token; a reconnect after expiry carries a fresh one for the same account', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const cleanup = startSocket();
    await flush();
    expect(io).toHaveBeenCalledTimes(1);
    const auth = io.mock.calls[0][1].auth;
    expect(await handshakeToken(auth)).toBe('acct-A-idtoken-v1');

    userA.issued = 2; // an hour later Firebase issues a new token on getIdToken()
    expect(await handshakeToken(auth)).toBe('acct-A-idtoken-v2');
    cleanup();
  });

  it('a reconnect handshake never carries another principal\'s token', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const cleanup = startSocket();
    await flush();
    const auth = io.mock.calls[0][1].auth;
    expect(await handshakeToken(auth)).toBe('acct-A-idtoken-v1');

    const userB = registeredUser('acct-B');
    useAuthStore.setState({ user: userB, isAuthenticated: true }); // account switch on the same page
    const token = await handshakeToken(auth);
    expect(token).not.toBe('acct-B-idtoken-v1');
    expect(userB.calls).toHaveLength(0);
    cleanup();
  });

  it('local guests stay tokenless on every handshake', async () => {
    useAuthStore.setState({ user: { uid: 'anon-1', isGuest: true }, isAuthenticated: true });
    const cleanup = startSocket();
    await flush();
    const auth = io.mock.calls[0][1].auth;
    expect(await handshakeToken(auth)).toBeNull();
    expect(await handshakeToken(auth)).toBeNull();
    cleanup();
  });
});

describe('same-principal refresh path keeps later reconnects fresh', () => {
  it('after the lobby refresh, a later reconnect still obtains a current token', async () => {
    const userA = registeredUser('acct-A');
    useAuthStore.setState({ user: userA, isAuthenticated: true });
    const socket = { connected: false, auth: undefined, connect: jest.fn(), disconnect: jest.fn(), emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    const unsubscribe = setupAuthChangeHandler({
      socket, isJoiningRoomRef: { current: false }, isAutoJoinSequenceRef: { current: false },
      currentRoomRef: { current: null }, roomPasswordRef: { current: null }, currentPlayerRef: { current: null },
      pendingRoomDataRef: { current: null }, activeJoinIdRef: { current: null }, autoJoinAttemptedRef: { current: false }
    });
    useAuthStore.setState({ userData: { touched: Date.now() } });
    await flush();
    expect(socket.connect).toHaveBeenCalledTimes(1);
    expect(await handshakeToken(socket.auth)).toBe('acct-A-idtoken-v1');

    userA.issued = 2;
    expect(await handshakeToken(socket.auth)).toBe('acct-A-idtoken-v2');
    unsubscribe();
  });
});
