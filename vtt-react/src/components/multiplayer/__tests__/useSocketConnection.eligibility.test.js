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
import { render, act } from '@testing-library/react/pure';
import { cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useEligibleSocketPrincipal, computeEligibleSocketPrincipal } from '../useSocketConnection';
import MultiplayerApp from '../MultiplayerApp';
import useAuthStore from '../../../store/authStore';
import {
  resetBootstrapGateForTests,
  activatePrivateScope
} from '../../../persistence/bootstrapPrivacyGate';
import {
  registerDefaultHandoffParticipants,
  registerHandoffParticipant,
  resetHandoffCoordinatorForTests,
  coordinateAuthPrincipalChange,
  whenHandoffIdle
} from '../../../persistence/handoff/accountHandoffCoordinator';

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

// Keep the real eligibility hook; only the transport setup is observed. This
// still exercises the mounted MultiplayerApp effect dependency contract.
jest.mock('../useSocketConnection', () => {
  const actual = jest.requireActual('../useSocketConnection');
  return {
    ...actual,
    setupSocketConnection: jest.fn(() => () => {}),
    setupAuthChangeHandler: jest.fn(() => () => {}),
    setupCursorTracking: jest.fn(() => () => {})
  };
});

// Visual/heavy children are inert; all MultiplayerApp state, effects, stores
// and the production socket lifecycle remain real.
jest.mock('../RoomLobby', () => ({ __esModule: true, default: () => null }));
jest.mock('../GameSessionInvitation', () => ({ __esModule: true, default: () => null }));
jest.mock('../CursorTracker', () => ({ __esModule: true, default: () => null }));
jest.mock('../UnifiedTransitionOverlay', () => ({
  __esModule: true,
  default: () => null,
  TRANSITION_TIMINGS: {}
}));
jest.mock('../ConnectionStatusIndicator', () => ({ __esModule: true, default: () => null }));
jest.mock('../GameSurface', () => ({ __esModule: true, default: () => null }));
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
jest.mock('../socketHandlers/registerAllHandlers', () => ({
  __esModule: true,
  registerAllSocketHandlers: jest.fn(() => () => {})
}));
jest.mock('../roomJoinHandler', () => ({
  __esModule: true,
  handleJoinRoom: jest.fn()
}));
jest.mock('../../../services/gameStateManager', () => ({ __esModule: true, default: {} }));
jest.mock('../../../services/optimisticUpdatesService', () => ({ __esModule: true, default: {} }));

const { setupSocketConnection } = jest.requireMock('../useSocketConnection');

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };

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
  setupSocketConnection.mockClear();
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
