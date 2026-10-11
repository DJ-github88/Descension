/**
 * P5-01 focused regression (2026-10-10 mounted-integration correction).
 *
 * Reproduced defect: during the coordinator's held stopNewWork preservation
 * window the live principal was already B while the retained scope was still
 * A's, and the real character working selectors still exposed A's roster
 * (`characters` = ['A HERO'], `getActiveCharacter()` = A HERO,
 * `currentCharacterId` = 'c-a').
 *
 * Contract under test: at isolation start (handoff pending) pending unsent
 * work is flushed to the retained owner's scoped record, the public working
 * projection is cleared, and the selectors expose nothing until the
 * destination owner activates. A's scoped data stays recoverable and is
 * restored when A returns.
 */
import useCharacterStore from '../../store/characterStore';
import { registerStore } from '../../store/storeRegistry';
import {
  resetBootstrapGateForTests,
  activatePrivateScope,
  getBootstrapGateState
} from '../bootstrapPrivacyGate';
import {
  registerCharacterHandoff,
  resetCharacterProjectionIsolationForTests
} from '../scopedStoreHandoffs';
import {
  registerHandoffParticipant,
  resetHandoffCoordinatorForTests,
  coordinateAuthPrincipalChange,
  whenHandoffIdle
} from '../handoff/accountHandoffCoordinator';
import {
  saveRoster,
  loadRoster,
  saveActivePointer,
  resetCharacterScopedStorageState
} from '../characterScopedStorage';

jest.mock('../../config/firebase', () => ({
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
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}) }));

const ownerA = { scopeKind: 'user', scopeId: 'owner-a' };

const ticks = async () => {
  for (let i = 0; i < 24; i += 1) await Promise.resolve();
};

function installLocksShim() {
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, options, callback) {
        const run = (tails.get(name) || Promise.resolve())
          .then(() => (typeof options === 'function' ? options : callback)({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
}

function setAuth(user) {
  registerStore('authStore', {
    getState: () => ({
      user,
      isAuthInitialized: true,
      isDevelopmentBypass: false,
      isAdminBypass: false
    }),
    subscribe: () => () => {}
  });
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  installLocksShim();
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  resetCharacterProjectionIsolationForTests();
  resetCharacterScopedStorageState();
  useCharacterStore.setState({
    characters: [],
    currentCharacterId: null,
    isLoading: false,
    error: null,
    name: ''
  });
});

test('P5-01 character working selectors expose no retained roster during a held handoff and restore on return', async () => {
  setAuth({ uid: 'owner-a' });
  activatePrivateScope(ownerA);
  registerCharacterHandoff();

  // A authors a roster and active selection through the real scoped store.
  useCharacterStore.setState({
    characters: [{ id: 'c-a', name: 'A HERO' }],
    currentCharacterId: 'c-a',
    name: 'A HERO'
  });
  await saveRoster(false, [{ id: 'c-a', name: 'A HERO' }]);
  saveActivePointer('c-a');

  // A production preservation participant holds the transition after the
  // character handoff's own stopNewWork has completed.
  let release;
  const hold = new Promise((resolve) => { release = resolve; });
  registerHandoffParticipant({
    id: 'held-preservation',
    stopNewWork: () => hold.then(() => ({ ok: true }))
  });

  // Live principal becomes B while the old scope is retained.
  setAuth({ uid: 'owner-b' });
  coordinateAuthPrincipalChange({ user: { uid: 'owner-b' } });
  await ticks();

  // Prohibited interval: live B, handoff pending, A's scope retained.
  expect(getBootstrapGateState().handoffPending).toBe(true);
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().currentCharacterId).toBeNull();
  expect(useCharacterStore.getState().getActiveCharacter()).toBeNull();

  // A's authored scoped record is retained and recoverable (the isolation
  // flush preserves the full working character).
  const retained = loadRoster(false);
  expect(retained).toHaveLength(1);
  expect(retained[0]).toEqual(expect.objectContaining({ id: 'c-a', name: 'A HERO' }));

  // Release: B activates and receives B-owned data only.
  release();
  await whenHandoffIdle();
  await ticks();
  expect(getBootstrapGateState().scope.scopeId).toBe('owner-b');
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().currentCharacterId).toBeNull();

  // Returning to A restores A's retained roster through the real activation.
  setAuth({ uid: 'owner-a' });
  coordinateAuthPrincipalChange({ user: { uid: 'owner-a' } });
  await whenHandoffIdle();
  await ticks();
  expect(useCharacterStore.getState().characters.map((c) => c.name)).toEqual(['A HERO']);
  expect(useCharacterStore.getState().getActiveCharacter()?.name).toBe('A HERO');
});

test('P5-01 same-UID logout/login keeps the retained roster hidden until re-activation', async () => {
  setAuth({ uid: 'owner-a' });
  activatePrivateScope(ownerA);
  registerCharacterHandoff();
  useCharacterStore.setState({
    characters: [{ id: 'c-a', name: 'A HERO' }],
    currentCharacterId: 'c-a',
    name: 'A HERO'
  });
  await saveRoster(false, [{ id: 'c-a', name: 'A HERO' }]);
  saveActivePointer('c-a');

  setAuth(null);
  coordinateAuthPrincipalChange({ user: null });
  await whenHandoffIdle();
  await ticks();
  expect(getBootstrapGateState().phase).toBe('signed-out');
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().currentCharacterId).toBeNull();

  setAuth({ uid: 'owner-a' });
  coordinateAuthPrincipalChange({ user: { uid: 'owner-a' } });
  await whenHandoffIdle();
  await ticks();
  expect(useCharacterStore.getState().characters.map((c) => c.name)).toEqual(['A HERO']);
});
