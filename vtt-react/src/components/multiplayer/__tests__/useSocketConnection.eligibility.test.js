/**
 * P5-38 focused regression (2026-10-10 mounted-integration correction).
 *
 * Reproduced defect: the mounted MultiplayerApp created its socket in an
 * effect that depended only on SOCKET_URL. An A→B handoff correctly retired
 * A's socket, but nothing re-established B's connection; the lobby socket
 * stayed null through ordinary parent rerenders.
 *
 * Contract under test: the production socket lifecycle re-evaluates the
 * eligible principal from the verified auth state and the live gate, and
 * establishes exactly one fresh setup per eligible principal transition — and
 * never while a handoff is pending or failed closed.
 */
import React from 'react';
import { render, act, waitFor } from '@testing-library/react/pure';
import { cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useEligibleSocketPrincipal, computeEligibleSocketPrincipal } from '../useSocketConnection';
import MultiplayerApp from '../MultiplayerApp';
import useAuthStore from '../../../store/authStore';
import { io } from 'socket.io-client';
import usePresenceStore from '../../../store/presenceStore';
import { initStoreRegistry } from '../../../store/initStoreRegistry';
import { isSocketRetired } from '../../../persistence/handoff/socketPrincipalRetirement';
import {
  resetBootstrapGateForTests,
  activatePrivateScope
} from '../../../persistence/bootstrapPrivacyGate';
import {
  registerDefaultHandoffParticipants,
  registerHandoffParticipant,
  unregisterHandoffParticipant,
  resetHandoffCoordinatorForTests,
  coordinateAuthPrincipalChange,
  whenHandoffIdle
} from '../../../persistence/handoff/accountHandoffCoordinator';

const mockWindow = window;

jest.mock('../../../config/firebase', () => ({
  db: {},
  isFirebaseConfigured: false,
  isDemoMode: true,
  auth: {
    currentUser: null,
    onAuthStateChanged: (cb) => { cb(null); return () => {}; }
  }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => args.slice(1).join('/')),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(() => () => {})
}));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(() => () => {}),
  getAuth: jest.fn(() => ({ currentUser: null }))
}));

// Observe setup calls without replacing lifecycle/auth/handler logic. Only
// Socket.IO's external transport is simulated; the harness never creates B.
jest.mock('../useSocketConnection', () => {
  const actual = jest.requireActual('../useSocketConnection');
  return {
    ...actual,
    setupSocketConnection: jest.fn(actual.setupSocketConnection)
  };
});
jest.mock('socket.io-client', () => ({ io: jest.fn() }));

// Visual/heavy children are inert; all MultiplayerApp state, effects, stores
// and the production socket lifecycle remain real.
jest.mock('../RoomLobby', () => ({
  __esModule: true,
  default: (props) => { mockWindow.__P5MountedLobby = props; return null; }
}));
jest.mock('../GameSessionInvitation', () => ({ __esModule: true, default: () => null }));
jest.mock('../CursorTracker', () => ({ __esModule: true, default: () => null }));
jest.mock('../UnifiedTransitionOverlay', () => ({
  __esModule: true,
  default: () => null,
  TRANSITION_TIMINGS: {}
}));
jest.mock('../ConnectionStatusIndicator', () => ({ __esModule: true, default: () => null }));
jest.mock('../GameSurface', () => ({
  __esModule: true,
  default: (props) => { mockWindow.__P5MountedScene = props; return null; }
}));
jest.mock('../../Grid', () => ({ __esModule: true, default: () => null }));
jest.mock('../../Navigation', () => ({ __esModule: true, default: () => null }));
jest.mock('../../grid/GridItemsManager', () => ({ __esModule: true, default: () => null }));
jest.mock('../../level-editor/DynamicFogManager', () => ({ __esModule: true, default: () => null }));
jest.mock('../../level-editor/DynamicLightingManager', () => ({ __esModule: true, default: () => null }));
jest.mock('../../level-editor/AtmosphericEffectsManager', () => ({ __esModule: true, default: () => null }));
jest.mock('../../level-editor/MemorySnapshotManager', () => ({ __esModule: true, default: () => null }));
jest.mock('../../ui/ActionBar', () => ({ __esModule: true, default: () => null }));
jest.mock('../../combat/CombatSelectionOverlay', () => ({ __esModule: true, default: () => null }));
jest.mock('../../combat/CombatTimeline', () => ({ __esModule: true, default: () => null }));
jest.mock('../../combat/FloatingCombatText', () => ({ __esModule: true, FloatingCombatTextManager: () => null }));
jest.mock('../../dialogue/DialogueSystem', () => ({ __esModule: true, default: () => null }));
jest.mock('../../dialogue/DialogueControls', () => ({ __esModule: true, default: () => null }));
jest.mock('../../jukebox/AudioPlayerWidget', () => ({ __esModule: true, default: () => null }));
jest.mock('../../hud/HUDContainer', () => ({ __esModule: true, default: () => null }));
jest.mock('../../quest-log/QuestShareDialog', () => ({ __esModule: true, default: () => null }));
jest.mock('../../quest-log/QuestRewardDeliveryDialog', () => ({ __esModule: true, default: () => null }));

const { setupSocketConnection } = jest.requireMock('../useSocketConnection');

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };

function transport(_url, options) {
  const listeners = new Map();
  const socket = {
    id: `socket-${io.mock.calls.length}`,
    auth: options.auth,
    connected: false,
    io: { opts: options },
    on(event, callback) {
      listeners.set(event, [...(listeners.get(event) || []), callback]);
      return socket;
    },
    off(event, callback) {
      if (!callback) listeners.delete(event);
      else listeners.set(event, (listeners.get(event) || []).filter(fn => fn !== callback));
      return socket;
    },
    removeAllListeners() { listeners.clear(); return socket; },
    emit: jest.fn(),
    connect: jest.fn(() => { socket.connected = true; socket.fire('connect'); return socket; }),
    disconnect: jest.fn(() => {
      const connected = socket.connected;
      socket.connected = false;
      if (connected) socket.fire('disconnect', 'io client disconnect');
      return socket;
    }),
    fire(event, data) { [...(listeners.get(event) || [])].forEach(fn => fn(data)); },
    listenerCount(event) { return (listeners.get(event) || []).length; },
    totalListeners() { return [...listeners.values()].reduce((sum, fns) => sum + fns.length, 0); }
  };
  return socket;
}

const flush = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

function LifecycleProbe({ log }) {
  const eligible = useEligibleSocketPrincipal();
  React.useEffect(() => {
    if (!eligible) return undefined;
    log.push(`setup:${eligible}`);
    return () => { log.push(`teardown:${eligible}`); };
  }, [eligible, log]);
  return null;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  registerDefaultHandoffParticipants();
  initStoreRegistry();
  setupSocketConnection.mockClear();
  setupSocketConnection.mockImplementation(jest.requireActual('../useSocketConnection').setupSocketConnection);
  io.mockReset();
  io.mockImplementation(transport);
  delete window.__P5MountedLobby;
  delete window.__P5MountedScene;
  useAuthStore.setState({
    user: null,
    isAuthInitialized: true,
    isAuthenticated: false
  });
});

afterEach(() => {
  cleanup();
});

test('P5-38 computeEligibleSocketPrincipal requires an active matching scope with no pending handoff', () => {
  const authA = { user: { uid: 'owner-a' } };
  expect(computeEligibleSocketPrincipal(authA, {
    phase: 'boot', scope: null, handoffPending: false, holdReason: null
  })).toBeNull();
  expect(computeEligibleSocketPrincipal(authA, {
    phase: 'active',
    scope: { scopeKind: 'user', scopeId: 'owner-a' },
    handoffPending: true,
    holdReason: null
  })).toBeNull();
  expect(computeEligibleSocketPrincipal(authA, {
    phase: 'loading',
    scope: null,
    handoffPending: false,
    holdReason: 'handoff-retirement-failed'
  })).toBeNull();
  expect(computeEligibleSocketPrincipal(authA, {
    phase: 'active',
    scope: { scopeKind: 'user', scopeId: 'owner-b' },
    handoffPending: false,
    holdReason: null
  })).toBeNull();
  expect(computeEligibleSocketPrincipal(authA, {
    phase: 'active',
    scope: { scopeKind: 'user', scopeId: 'owner-a' },
    handoffPending: false,
    holdReason: null
  })).toBe('user:owner-a');
});

test('P5-38 the mounted lifecycle establishes a fresh setup for the destination principal after handoff', async () => {
  useAuthStore.setState({ user: { uid: 'owner-a' }, isAuthenticated: true });
  activatePrivateScope(ownerA);

  const log = [];
  render(React.createElement(LifecycleProbe, { log }));
  await flush();
  expect(log).toEqual(['setup:user:owner-a']);

  // A→B through the production coordinator.
  await act(async () => {
    useAuthStore.setState({ user: { uid: 'owner-b' }, isAuthenticated: true });
    coordinateAuthPrincipalChange({ user: { uid: 'owner-b' } });
    await whenHandoffIdle();
  });
  await flush();

  // A's lifecycle is torn down before B's setup, and exactly one fresh setup
  // exists for the destination principal.
  const aTeardown = log.indexOf('teardown:user:owner-a');
  const bSetup = log.indexOf('setup:user:owner-b');
  expect(aTeardown).toBeGreaterThanOrEqual(0);
  expect(bSetup).toBeGreaterThan(aTeardown);
  expect(log.filter((entry) => entry === 'setup:user:owner-b')).toHaveLength(1);
});

test('P5-38 no destination setup is created while the handoff preservation window is held', async () => {
  useAuthStore.setState({ user: { uid: 'owner-a' }, isAuthenticated: true });
  activatePrivateScope(ownerA);

  const log = [];
  render(React.createElement(LifecycleProbe, { log }));
  await flush();
  expect(log).toEqual(['setup:user:owner-a']);

  let release;
  const hold = new Promise((resolve) => { release = resolve; });
  registerHandoffParticipant({
    id: 'held-socket-preservation',
    stopNewWork: () => hold.then(() => ({ ok: true }))
  });

  await act(async () => {
    useAuthStore.setState({ user: { uid: 'owner-b' }, isAuthenticated: true });
    coordinateAuthPrincipalChange({ user: { uid: 'owner-b' } });
  });
  await flush();
  expect(log).not.toContain('setup:user:owner-b');

  release();
  await act(async () => {
    await whenHandoffIdle();
  });
  await flush();
  expect(log).toContain('setup:user:owner-b');
});

test('P5-38 the mounted MultiplayerApp re-runs the production socket setup for the destination principal', async () => {
  useAuthStore.setState({ user: { uid: 'owner-a' }, isAuthenticated: true });
  activatePrivateScope(ownerA);

  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(MultiplayerApp, { onReturnToSinglePlayer: () => {} })
    )
  );
  await flush();
  expect(setupSocketConnection).toHaveBeenCalledTimes(1);

  // A→B through the production coordinator: the mounted lifecycle must
  // dispose A's setup and create exactly one fresh setup for B.
  await act(async () => {
    useAuthStore.setState({ user: { uid: 'owner-b' }, isAuthenticated: true });
    coordinateAuthPrincipalChange({ user: { uid: 'owner-b' } });
    await whenHandoffIdle();
  });
  await flush();
  expect(setupSocketConnection).toHaveBeenCalledTimes(2);
});

test('P5-38 real mounted lifecycle retires A, automatically connects B and admits B with production handlers', async () => {
  const user = uid => ({ uid, getIdToken: async () => `id-token-${uid}` });
  useAuthStore.setState({ user: user('owner-a'), isAuthenticated: true });
  activatePrivateScope(ownerA);
  await whenHandoffIdle();
  const element = React.createElement(MemoryRouter, null, React.createElement(MultiplayerApp));
  const mounted = render(element);
  await waitFor(() => expect(window.__P5MountedLobby?.socket?.connected).toBe(true));
  const a = window.__P5MountedLobby.socket;
  expect(a.listenerCount('room_joined')).toBe(1);

  let release;
  const hold = new Promise(resolve => { release = resolve; });
  registerHandoffParticipant({ id: 'mounted-socket-hold', stopNewWork: () => hold });
  await act(async () => {
    useAuthStore.setState({ user: user('owner-b'), isAuthenticated: true });
    coordinateAuthPrincipalChange(useAuthStore.getState());
  });
  await flush();
  expect(isSocketRetired(a)).toBe(true);
  expect(a.connected).toBe(false);
  expect(a.totalListeners()).toBe(0);
  expect(io).toHaveBeenCalledTimes(1);
  expect(window.__P5MountedLobby.socket).toBeNull();

  await act(async () => { release(); await whenHandoffIdle(); });
  unregisterHandoffParticipant('mounted-socket-hold');
  mounted.rerender(React.createElement(MemoryRouter, null, React.createElement(MultiplayerApp)));
  await waitFor(() => expect(window.__P5MountedLobby?.socket?.connected).toBe(true));
  const b = window.__P5MountedLobby.socket;
  expect(b).not.toBe(a);
  expect(b.auth.token).toBe('id-token-owner-b');
  expect(io).toHaveBeenCalledTimes(2);
  expect(b.listenerCount('room_joined')).toBe(1);
  expect(b.listenerCount('character_updated')).toBe(1);
  await waitFor(() => expect(usePresenceStore.getState().socket).toBe(b));

  // Start normal lobby admission; room_joined and the parent's timed
  // auto-continue execute the real handleJoinRoom, never a harness callback.
  const packet = {
    room: { id: 'room-b', persistentRoomId: 'room-b', name: 'Room B', gm: { id: 'gm', userId: 'gm' }, players: [], gameState: {} },
    player: { id: 'player-b', name: 'Player B' }, isGM: false, playerCount: 1
  };
  await act(async () => { window.__P5MountedLobby.onJoinAttempt('room-b'); });
  await act(async () => { b.fire('room_joined', packet); });
  await waitFor(() => expect(window.__P5MountedScene?.currentRoom?.id).toBe('room-b'), { timeout: 5000 });
  await act(async () => { a.fire('room_joined', { ...packet, room: { ...packet.room, id: 'late-a' } }); });
  expect(window.__P5MountedScene.currentRoom.id).toBe('room-b');
  mounted.rerender(React.createElement(MemoryRouter, null, React.createElement(MultiplayerApp)));
  await flush();
  expect(io).toHaveBeenCalledTimes(2);
  expect(b.listenerCount('room_joined')).toBe(1);
  expect(a.emit.mock.calls.filter(([event]) => /leave_room|leave_party|revoke|kick/.test(event))).toEqual([]);
}, 10000);

test('P5-38 delayed A token refresh cannot reconnect its retired transport under B', async () => {
  let releaseToken;
  const pending = new Promise(resolve => { releaseToken = resolve; });
  const token = jest.fn().mockResolvedValueOnce('id-token-owner-a').mockReturnValueOnce(pending);
  useAuthStore.setState({ user: { uid: 'owner-a', getIdToken: token }, isAuthenticated: true });
  activatePrivateScope(ownerA);
  await whenHandoffIdle();
  render(React.createElement(MemoryRouter, null, React.createElement(MultiplayerApp)));
  await waitFor(() => expect(window.__P5MountedLobby?.socket?.connected).toBe(true));
  const a = window.__P5MountedLobby.socket;
  await act(async () => { useAuthStore.setState({ isAuthInitialized: true }); });
  expect(token).toHaveBeenLastCalledWith(true);
  expect(a.connected).toBe(false);
  await act(async () => {
    useAuthStore.setState({ user: { uid: 'owner-b', getIdToken: async () => 'id-token-owner-b' }, isAuthenticated: true });
    coordinateAuthPrincipalChange(useAuthStore.getState());
    await whenHandoffIdle();
    releaseToken('late-a-token');
  });
  await waitFor(() => expect(window.__P5MountedLobby?.socket?.auth.token).toBe('id-token-owner-b'));
  expect(a.connected).toBe(false);
  expect(a.totalListeners()).toBe(0);
  expect(io).toHaveBeenCalledTimes(2);
});
