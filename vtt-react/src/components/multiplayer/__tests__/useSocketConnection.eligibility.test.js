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

import React from 'react';
import { render, act } from '@testing-library/react/pure';
import { cleanup } from '@testing-library/react';
import { useEligibleSocketPrincipal, computeEligibleSocketPrincipal } from '../useSocketConnection';
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
