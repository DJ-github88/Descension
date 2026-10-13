/**
 * P5-01 focused regressions (2026-10-11 final character handoff preservation
 * correction).
 *
 * Reproduced source defects (implementation-agent RED before correction):
 *
 *   F1 — wrong-owner character upload. A authors an unsent lore edit through
 *   the production `updateLore()`; the debounced save is still pending when the
 *   live principal changes to B. The handoff isolation flush ran
 *   `saveCurrentCharacter()` twice (pending flush + unconditional call) and
 *   `updateCharacter` derived the save owner from the live principal, so A's
 *   authored payload was written to `characters/c-a` with
 *   `metadata.userId = u-b`, and B's cloud query then installed A's character
 *   into B's working roster.
 *
 *   F2 — failed preservation destroyed the unsent candidate. When the
 *   owner-scoped roster/offline writes were refused, the isolation callback
 *   ignored the failure, cleared the working projection anyway and the
 *   character handoff `stopNewWork` returned `{ ok: true }`, so the coordinator
 *   activated B. Returning to A restored only the older baseline; no recovery
 *   record retained the unsent edit.
 *
 * Contract under test:
 *   - a pending save's owner is the immutable captured origin owner, never the
 *     newer live principal;
 *   - A-authored content is never submitted with B's authenticated identity
 *     (cloud publication is deferred; the scoped roster is the recovery);
 *   - the authored candidate is captured before destructive clearing, the real
 *     preservation outcome is awaited and inspected, and a failed preservation
 *     fails the handoff closed with an honest failure report and a retry path;
 *   - returning to the correct owner restores the exact unsent edit and normal
 *     same-owner saving resumes;
 *   - ordinary same-owner autosaves still publish to the cloud;
 *   - returning A's exact lore is never produced from B's live authentication.
 */
import useCharacterStore from '../../store/characterStore';
import { resetCharacterSaveOutcomeForTests } from '../characterSaveOutcome';
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
  whenHandoffIdle,
  retryPendingHandoff,
  getHandoffStatus
} from '../handoff/accountHandoffCoordinator';
import { loadRoster, resetCharacterScopedStorageState } from '../characterScopedStorage';
import { CHARACTER_AUTO_SAVE_DELAY, characterAutoSavePending, characterAutoSaveTimer } from '../../store/characterHelpers';
import {
  getRetainedCharacterHandoffCandidate,
  readCharacterDeferredPublication,
  ensureCharacterHandoffPreserved
} from '../characterHandoffPreservation';

jest.mock('../../config/firebase', () => {
  const mockLocal = { currentUser: null };
  return {
    db: { name: 'test-db' },
    isFirebaseConfigured: true,
    isDemoMode: false,
    __setCurrentUser: (user) => { mockLocal.currentUser = user; },
    auth: {
      get currentUser() { return mockLocal.currentUser; }
    }
  };
});

jest.mock('firebase/firestore', () => {
  const state = { docs: new Map(), updates: [] };
  const where = (field, op, value) => ({ kind: 'where', field, op, value });
  const orderBy = (field, dir) => ({ kind: 'orderBy', field, dir });
  const query = (collectionRef, ...constraints) => ({ collectionRef, constraints });
  const getDocs = jest.fn();
  const updateDoc = jest.fn();
  return {
    __state: state,
    collection: (_db, name) => name,
    doc: (_db, collectionName, id) => `${collectionName}/${id}`,
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    addDoc: jest.fn(),
    getDocs,
    query,
    where,
    orderBy,
    limit: jest.fn(),
    deleteDoc: jest.fn(),
    onSnapshot: jest.fn(() => () => {}),
    updateDoc,
    serverTimestamp: () => 'SERVER_TS',
    runTransaction: jest.fn()
  };
});

jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}) }));
jest.mock('../../services/firebase/characterBackupService', () => ({
  __esModule: true,
  default: { autoBackup: jest.fn(async () => true) }
}));

// eslint-disable-next-line import/first
import { __state as fsState, updateDoc } from 'firebase/firestore';
// eslint-disable-next-line import/first
import firebaseConfig from '../../config/firebase';

// CRA's jest config resets mock implementations before every test, so the
// Firestore boundary behavior is (re)installed in beforeEach while the state
// object itself is cleared.
// eslint-disable-next-line import/first
import * as firestore from 'firebase/firestore';

function installFirestoreBehavior() {
  firestore.getDocs.mockImplementation(async (q) => {
    const items = [];
    for (const [path, value] of fsState.docs) {
      let matches = true;
      for (const constraint of (q && q.constraints) || []) {
        if (constraint.kind === 'where' && constraint.field === 'metadata.userId' &&
          value?.metadata?.userId !== constraint.value) {
          matches = false;
        }
      }
      if (matches) items.push({ id: path, data: () => value });
    }
    return { forEach: (cb) => items.forEach(cb), docs: items, size: items.length };
  });
  updateDoc.mockImplementation(async (path, value) => {
    const cloned = JSON.parse(JSON.stringify(value));
    fsState.updates.push({ path, value: cloned });
    const existing = fsState.docs.get(path) || {};
    fsState.docs.set(path, { ...existing, ...cloned });
  });
}

const ownerA = { scopeKind: 'user', scopeId: 'u-a' };

const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const resources = {
  health: { current: 40, max: 50 },
  mana: { current: 40, max: 50 },
  actionPoints: { current: 2, max: 3 }
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

function setLiveFirebaseUser(uid) {
  firebaseConfig.__setCurrentUser(uid
    ? { uid, getIdToken: jest.fn(async () => 'token') }
    : null);
}

function seedCloudCharacter(id, userId, name, notes) {
  fsState.docs.set(`characters/${id}`, {
    metadata: { id, userId, name, version: 1 },
    basicInfo: { race: 'Human', subrace: '', class: 'Martyr', level: 3, classAcquisition: {}, bodyStates: [] },
    stats: { ...stats },
    resources: JSON.parse(JSON.stringify(resources)),
    inventory: { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' },
    equipment: { weapon: null, armor: null, shield: null, accessories: [] },
    spells: [],
    lore: { notes },
    gameState: { experience: 0, sessionData: { pendingChanges: {} } }
  });
}

const settle = async () => {
  for (let i = 0; i < 4; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (let j = 0; j < 24; j += 1) await Promise.resolve();
  }
};

const cloudWrites = () => updateDoc.mock.calls.map(([path, value]) => ({
  path,
  userId: value?.metadata?.userId,
  notes: value?.lore?.notes
}));

function rawRosterNotes(scopeId = 'u-a') {
  const raw = localStorage.getItem(`mythrill:p5:user:${scopeId}:character.roster`);
  if (!raw) return null;
  try {
    const envelope = JSON.parse(raw);
    return envelope?.payload?.[0]?.lore?.notes ?? null;
  } catch (_error) {
    return null;
  }
}

async function setupOwnerAWithActiveCharacter() {
  setAuth({ uid: 'u-a' });
  setLiveFirebaseUser('u-a');
  activatePrivateScope(ownerA);
  registerCharacterHandoff();
  seedCloudCharacter('c-a', 'u-a', 'A HERO', 'A BASELINE');
  await useCharacterStore.getState().loadCharacters();
  await useCharacterStore.getState().setActiveCharacter('c-a');
  expect(useCharacterStore.getState().getActiveCharacter()?.name).toBe('A HERO');
}

beforeEach(() => {
  resetCharacterSaveOutcomeForTests();
  installFirestoreBehavior();
  localStorage.clear();
  sessionStorage.clear();
  fsState.docs.clear();
  fsState.updates.length = 0;
  updateDoc.mockClear();
  setLiveFirebaseUser(null);
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
    name: '',
    lore: {}
  });
});

test('F1: pending unsent A edit is never uploaded under B and is restored for A', async () => {
  await setupOwnerAWithActiveCharacter();
  const marker = 'A UNSENT CHARACTER pending-edit';
  useCharacterStore.getState().updateLore('notes', marker);
  expect(useCharacterStore.getState().lore.notes).toBe(marker);
  expect(useCharacterStore.getState().characters[0].lore.notes).toBe('A BASELINE');
  expect(typeof characterAutoSavePending).toBe('function');
  expect(characterAutoSaveTimer).not.toBeNull();

  updateDoc.mockClear();
  let release;
  const hold = new Promise((resolve) => { release = resolve; });
  registerHandoffParticipant({
    id: 'test-held-preservation',
    stopNewWork: () => hold.then(() => ({ ok: true }))
  });

  setAuth({ uid: 'u-b' });
  setLiveFirebaseUser('u-b');
  coordinateAuthPrincipalChange({ user: { uid: 'u-b' } });
  await settle();

  // Prohibited interval: live B, gate pending, A's retained scope still active.
  const gate = getBootstrapGateState();
  expect(gate.handoffPending).toBe(true);
  expect(gate.scope.scopeId).toBe('u-a');
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().getActiveCharacter()).toBeNull();
  expect(useCharacterStore.getState().currentCharacterId).toBeNull();

  // A's unsent edit is retained owner-scoped, and no A content was submitted
  // under B nor published to the cloud during the handoff.
  const retained = loadRoster(false);
  expect(retained[0].lore.notes).toBe(marker);
  const during = cloudWrites();
  expect(during.filter((write) => write.userId === 'u-b')).toEqual([]);
  expect(during.filter((write) => write.notes === marker)).toEqual([]);

  release();
  await whenHandoffIdle();
  await settle();
  expect(getBootstrapGateState().scope.scopeId).toBe('u-b');

  // B receives nothing of A: no working roster and no A cloud document.
  const bCharacters = await useCharacterStore.getState().loadCharacters();
  expect(bCharacters).toEqual([]);
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(fsState.docs.get('characters/c-a').metadata.userId).toBe('u-a');

  // Returning to A restores the exact unsent lore and resumes publication
  // under A's authenticated identity only.
  setAuth({ uid: 'u-a' });
  setLiveFirebaseUser('u-a');
  coordinateAuthPrincipalChange({ user: { uid: 'u-a' } });
  await whenHandoffIdle();
  await settle();
  const restored = await useCharacterStore.getState().loadActiveCharacter();
  await settle();
  expect(restored?.lore?.notes).toBe(marker);
  expect(useCharacterStore.getState().lore.notes).toBe(marker);

  const resumed = cloudWrites().filter((write) => write.notes === marker);
  expect(resumed.length).toBeGreaterThanOrEqual(1);
  expect(resumed.every((write) => write.userId === 'u-a')).toBe(true);
  expect(fsState.docs.get('characters/c-a').metadata.userId).toBe('u-a');
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe(marker);
});

test('F1 duplicate prevention: the isolation callback does not double-save the pending edit', async () => {
  await setupOwnerAWithActiveCharacter();
  const marker = 'A UNSENT CHARACTER no-double-save';
  useCharacterStore.getState().updateLore('notes', marker);
  updateDoc.mockClear();

  setAuth({ uid: 'u-b' });
  setLiveFirebaseUser('u-b');
  coordinateAuthPrincipalChange({ user: { uid: 'u-b' } });
  await whenHandoffIdle();
  await settle();

  // Exactly one owner-scoped roster record holds the edit; no cloud write at
  // all is attributed to either owner for the deferred payload.
  expect(rawRosterNotes()).toBe(marker);
  const deferredKeys = Object.keys(localStorage)
    .filter((key) => key.includes('character.deferredPublication'));
  expect(deferredKeys).toHaveLength(1);
  const deferred = JSON.parse(localStorage.getItem(deferredKeys[0]));
  expect(deferred.characterIds).toEqual(['c-a']);
  expect(cloudWrites().filter((write) => write.notes === marker)).toEqual([]);
});

test('F2: failed preservation fails closed, is reported honestly and retries to success', async () => {
  await setupOwnerAWithActiveCharacter();
  const marker = 'A UNSENT CHARACTER failed-preservation';
  useCharacterStore.getState().updateLore('notes', marker);
  updateDoc.mockClear();

  const originalSetItem = Storage.prototype.setItem;
  const refusal = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (String(value).includes(marker)) {
      throw new DOMException('Independent authored-payload write failure', 'QuotaExceededError');
    }
    return originalSetItem.call(this, key, value);
  });

  setAuth({ uid: 'u-b' });
  setLiveFirebaseUser('u-b');
  coordinateAuthPrincipalChange({ user: { uid: 'u-b' } });
  await settle();

  // Fail closed: B must not activate while the only copy of A's edit is unsafe.
  const gate = getBootstrapGateState();
  expect(gate.scope.scopeId).toBe('u-a');
  expect(gate.handoffPending).toBe(true);
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().getActiveCharacter()).toBeNull();

  const status = getHandoffStatus();
  expect(status.lastResult?.blocked).toBe(true);
  expect(status.lastResult?.failures?.some((failure) =>
    failure.participantId === 'scoped-store:characterStore' &&
    failure.hook === 'stopNewWork')).toBe(true);
  expect(getRetainedCharacterHandoffCandidate()?.ownerScopeId).toBe('u-a');
  expect(getRetainedCharacterHandoffCandidate()?.characters[0].lore.notes).toBe(marker);
  expect(cloudWrites().filter((write) => write.userId === 'u-b')).toEqual([]);

  // Storage heals; the retry preserves the retained candidate and only then
  // allows destination activation.
  refusal.mockRestore();
  retryPendingHandoff();
  await whenHandoffIdle();
  await settle();
  expect(getBootstrapGateState().scope.scopeId).toBe('u-b');
  expect(getBootstrapGateState().handoffPending).toBe(false);
  expect(rawRosterNotes()).toBe(marker);

  // Returning to A restores the exact unsent edit.
  setAuth({ uid: 'u-a' });
  setLiveFirebaseUser('u-a');
  coordinateAuthPrincipalChange({ user: { uid: 'u-a' } });
  await whenHandoffIdle();
  await settle();
  const restored = await useCharacterStore.getState().loadActiveCharacter();
  await settle();
  expect(restored?.lore?.notes).toBe(marker);
  expect(useCharacterStore.getState().lore.notes).toBe(marker);
});

test.each(['throw', 'reject'])('F2: %s from the Web Locks boundary fails closed through the real roster writer', async (failure) => {
  await setupOwnerAWithActiveCharacter();
  const marker = `A UNSENT CHARACTER lock-${failure}`;
  useCharacterStore.getState().updateLore('notes', marker);
  expect(typeof characterAutoSavePending).toBe('function');
  const request = navigator.locks.request;
  navigator.locks.request = () => {
    if (failure === 'throw') throw new Error('injected lock acquisition failure');
    return Promise.reject(new Error('injected async lock acquisition failure'));
  };
  try {
    setAuth({ uid: 'u-b' });
    setLiveFirebaseUser('u-b');
    coordinateAuthPrincipalChange({ user: { uid: 'u-b' } });
    await whenHandoffIdle();
    await settle();
    expect(getBootstrapGateState().scope.scopeId).toBe('u-a');
    expect(getBootstrapGateState().handoffPending).toBe(true);
    expect(getHandoffStatus().lastResult.blocked).toBe(true);
    expect(getHandoffStatus().lastResult.failures).toEqual(expect.arrayContaining([
      expect.objectContaining({ participantId: 'scoped-store:characterStore', hook: 'stopNewWork' })
    ]));
    expect(getRetainedCharacterHandoffCandidate()?.characters[0].lore.notes).toBe(marker);
    expect(useCharacterStore.getState().characters).toEqual([]);
    expect(useCharacterStore.getState().getActiveCharacter()).toBeNull();
    expect(cloudWrites().filter((write) => write.notes === marker)).toEqual([]);
  } finally {
    navigator.locks.request = request;
  }
  retryPendingHandoff();
  await whenHandoffIdle();
  await settle();
  expect(getBootstrapGateState().scope.scopeId).toBe('u-b');
  expect(rawRosterNotes()).toBe(marker);
  await switchOwner('u-a');
  await useCharacterStore.getState().loadActiveCharacter();
  expect(useCharacterStore.getState().lore.notes).toBe(marker);
});

test('same-UID generation change: pending edit is retained and restored after logout/login', async () => {
  await setupOwnerAWithActiveCharacter();
  const marker = 'A UNSENT CHARACTER generation-change';
  useCharacterStore.getState().updateLore('notes', marker);
  updateDoc.mockClear();

  setAuth(null);
  setLiveFirebaseUser(null);
  coordinateAuthPrincipalChange({ user: null });
  await whenHandoffIdle();
  await settle();
  expect(getBootstrapGateState().phase).toBe('signed-out');
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(rawRosterNotes()).toBe(marker);
  expect(cloudWrites()).toEqual([]);

  setAuth({ uid: 'u-a' });
  setLiveFirebaseUser('u-a');
  coordinateAuthPrincipalChange({ user: { uid: 'u-a' } });
  await whenHandoffIdle();
  await settle();
  const restored = await useCharacterStore.getState().loadActiveCharacter();
  await settle();
  expect(restored?.lore?.notes).toBe(marker);
  expect(useCharacterStore.getState().lore.notes).toBe(marker);
});

test('ordinary same-owner autosave still publishes to the cloud under the same owner', async () => {
  await setupOwnerAWithActiveCharacter();
  const marker = 'A UNSENT CHARACTER ordinary-save';
  useCharacterStore.getState().updateLore('notes', marker);
  updateDoc.mockClear();

  await useCharacterStore.getState().saveCurrentCharacter();
  await settle();

  const writes = cloudWrites().filter((write) => write.notes === marker);
  expect(writes.length).toBe(1);
  expect(writes[0].userId).toBe('u-a');
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe(marker);

  // The debounced path remains functional as well.
  const debounceMarker = 'A UNSENT CHARACTER debounced';
  useCharacterStore.getState().updateLore('notes', debounceMarker);
  await new Promise((resolve) => setTimeout(resolve, CHARACTER_AUTO_SAVE_DELAY + 60));
  await settle();
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe(debounceMarker);
});

async function switchOwner(uid) {
  setAuth(uid ? { uid } : null);
  setLiveFirebaseUser(uid);
  coordinateAuthPrincipalChange({ user: uid ? { uid } : null });
  await whenHandoffIdle();
  await settle();
}

// Delays only the external write/ACK. Store, service, gate, coordinator,
// scoped roster, marker and recovery implementations all remain production.
function holdCharacterWrite(notes, { ackOnly = false } = {}) {
  const update = updateDoc.getMockImplementation();
  const releases = [];
  updateDoc.mockImplementation((path, value) => {
    if (value?.lore?.notes !== notes) return update(path, value);
    const accepted = ackOnly ? update(path, value) : null;
    return new Promise((resolve, reject) => {
      releases.push(() => Promise.resolve(accepted || update(path, value)).then(resolve, reject));
    });
  });
  return releases;
}

test('late-normal-save: A ACK cannot reinstall a roster or upload A as B', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT late-normal-save';
  useCharacterStore.getState().updateLore('notes', notes);
  const releases = holdCharacterWrite(notes, { ackOnly: true });
  const saving = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(releases).toHaveLength(1);
  await switchOwner('u-b');
  expect(useCharacterStore.getState().characters).toEqual([]);
  releases[0]();
  await saving;
  await settle();
  expect(useCharacterStore.getState().characters).toEqual([]);
  expect(useCharacterStore.getState().getActiveCharacter()).toBeNull();
  expect(useCharacterStore.getState().currentCharacterId).toBeNull();
  await useCharacterStore.getState().setActiveCharacter('c-a');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(fsState.docs.get('characters/c-a').metadata.userId).toBe('u-a');
  expect(cloudWrites().some((write) => write.userId === 'u-b')).toBe(false);
});

test('same-uid-late-normal-save: old-generation ACK cannot replace newer work', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT same-uid-late-normal-save';
  useCharacterStore.getState().updateLore('notes', notes);
  const generation = getBootstrapGateState().accountGeneration;
  const releases = holdCharacterWrite(notes, { ackOnly: true });
  const saving = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(releases).toHaveLength(1);
  await switchOwner(null);
  await switchOwner('u-a');
  await useCharacterStore.getState().loadActiveCharacter();
  expect(getBootstrapGateState().accountGeneration).not.toBe(generation);
  useCharacterStore.getState().updateLore('notes', 'NEW GENERATION EDIT');
  const newerSave = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(rawRosterNotes()).toBe('NEW GENERATION EDIT');
  releases[0]();
  await Promise.all([saving, newerSave]);
  await settle();
  expect(useCharacterStore.getState().characters[0].lore.notes).toBe('NEW GENERATION EDIT');
  expect(useCharacterStore.getState().lore.notes).toBe('NEW GENERATION EDIT');
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe('NEW GENERATION EDIT');
});

test('deferred-newer-edit: old publication cannot land after a newer save or retire its marker', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT deferred-newer-edit';
  useCharacterStore.getState().updateLore('notes', notes);
  await switchOwner('u-b');
  const releases = holdCharacterWrite(notes);
  await switchOwner('u-a');
  expect(releases).toHaveLength(1);
  useCharacterStore.getState().loadCharacter('c-a');
  useCharacterStore.getState().updateLore('notes', 'NEWER OWNER EDIT');
  const saving = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(rawRosterNotes()).toBe('NEWER OWNER EDIT');
  // The newer local save is allowed; overlapping cloud replacement is not.
  expect(cloudWrites().filter((write) => write.notes === 'NEWER OWNER EDIT')).toEqual([]);
  expect(useCharacterStore.getState().characters[0].lore.notes).toBe('NEWER OWNER EDIT');
  expect(readCharacterDeferredPublication()).not.toBeNull();
  releases[0]();
  await saving;
  await settle();
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe('NEWER OWNER EDIT');
  expect(rawRosterNotes()).toBe('NEWER OWNER EDIT');
  await useCharacterStore.getState().loadCharacters();
  expect(useCharacterStore.getState().characters[0].lore.notes).toBe('NEWER OWNER EDIT');
});

test('stale-owner-marker-clear: A completion leaves B and A recovery markers untouched', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT stale-owner-marker-clear';
  useCharacterStore.getState().updateLore('notes', notes);
  await switchOwner('u-b');
  const releases = holdCharacterWrite(notes);
  await switchOwner('u-a');
  expect(releases).toHaveLength(1);
  await switchOwner('u-b');
  seedCloudCharacter('c-b', 'u-b', 'B HERO', 'B BASELINE');
  await useCharacterStore.getState().loadCharacters();
  await useCharacterStore.getState().setActiveCharacter('c-b');
  useCharacterStore.getState().updateLore('notes', 'B UNSENT');
  await switchOwner('u-c');
  const aKey = 'mythrill:p5:user:u-a:character.deferredPublication';
  const bKey = 'mythrill:p5:user:u-b:character.deferredPublication';
  const bReleases = holdCharacterWrite('B UNSENT');
  await switchOwner('u-b');
  const aMarker = localStorage.getItem(aKey);
  const bMarker = localStorage.getItem(bKey);
  expect(aMarker).not.toBeNull();
  expect(bMarker).not.toBeNull();
  releases[0]();
  await settle();
  expect(localStorage.getItem(bKey)).toBe(bMarker);
  expect(localStorage.getItem(aKey)).toBe(aMarker);
  expect(getBootstrapGateState().scope.scopeId).toBe('u-b');
  expect(rawRosterNotes('u-b')).toBe('B UNSENT');
  // Drain the boundary so this test leaves no pending production save.
  bReleases.forEach((release) => release());
  await settle();
});

test('marker-write-failure: required marker refusal blocks handoff and heals through retry', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT marker-write-failure';
  useCharacterStore.getState().updateLore('notes', notes);
  const setItem = Storage.prototype.setItem;
  const refusal = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (String(key).includes('character.deferredPublication')) {
      throw new DOMException('marker-only quota refusal', 'QuotaExceededError');
    }
    return setItem.call(this, key, value);
  });
  try {
    await switchOwner('u-b');
    expect(rawRosterNotes()).toBe(notes);
    expect(getHandoffStatus().lastResult.blocked).toBe(true);
    expect(getBootstrapGateState().scope.scopeId).toBe('u-a');
    expect(getRetainedCharacterHandoffCandidate()?.characters[0].lore.notes).toBe(notes);
    expect(useCharacterStore.getState().characters).toEqual([]);
  } finally {
    refusal.mockRestore();
  }
  retryPendingHandoff();
  await whenHandoffIdle();
  await settle();
  expect(getBootstrapGateState().scope.scopeId).toBe('u-b');
  await switchOwner('u-a');
  await useCharacterStore.getState().loadActiveCharacter();
  await settle();
  expect(useCharacterStore.getState().lore.notes).toBe(notes);
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe(notes);
});

test('deferred cloud failure retains the exact local source and marker until a healed retry', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT deferred-cloud-failure';
  useCharacterStore.getState().updateLore('notes', notes);
  await switchOwner('u-b');
  updateDoc.mockImplementation(async () => { throw new Error('controlled network unavailable'); });
  await switchOwner('u-a');
  expect(rawRosterNotes()).toBe(notes);
  expect(readCharacterDeferredPublication()).not.toBeNull();
  expect(useCharacterStore.getState().characters[0].lore.notes).toBe(notes);
  installFirestoreBehavior();
  await useCharacterStore.getState().loadCharacters();
  await settle();
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe(notes);
  expect(readCharacterDeferredPublication()).toBeNull();
});

test('deferred ACK and subsequent load cannot consume a newer not-yet-saved working edit', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A UNSENT deferred-authored-edit';
  useCharacterStore.getState().updateLore('notes', notes);
  await switchOwner('u-b');
  const releases = holdCharacterWrite(notes);
  await switchOwner('u-a');
  expect(releases).toHaveLength(1);
  useCharacterStore.getState().loadCharacter('c-a');
  useCharacterStore.getState().updateLore('notes', 'NEWER UNSAVED EDIT');
  const marker = readCharacterDeferredPublication();
  releases[0]();
  await settle();
  expect(readCharacterDeferredPublication()).toEqual(marker);
  await useCharacterStore.getState().loadActiveCharacter();
  expect(useCharacterStore.getState().lore.notes).toBe('NEWER UNSAVED EDIT');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe('NEWER UNSAVED EDIT');
});

test('queued successor revalidates its owner after waiting and remains recoverable on return', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A FIRST queued-owner-change';
  useCharacterStore.getState().updateLore('notes', notes);
  const releases = holdCharacterWrite(notes, { ackOnly: true });
  const first = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(releases).toHaveLength(1);
  useCharacterStore.getState().updateLore('notes', 'A NEWER QUEUED EDIT');
  const newer = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(rawRosterNotes()).toBe('A NEWER QUEUED EDIT');
  await switchOwner('u-b');
  releases[0]();
  await Promise.all([first, newer]);
  await settle();
  expect(cloudWrites().filter((write) => write.notes === 'A NEWER QUEUED EDIT')).toEqual([]);
  expect(useCharacterStore.getState().characters).toEqual([]);
  await switchOwner('u-a');
  await useCharacterStore.getState().loadActiveCharacter();
  await settle();
  expect(useCharacterStore.getState().lore.notes).toBe('A NEWER QUEUED EDIT');
  expect(fsState.docs.get('characters/c-a').lore.notes).toBe('A NEWER QUEUED EDIT');
});

test('same-owner marker replacement survives the old ACK until its own exact revision confirms', async () => {
  await setupOwnerAWithActiveCharacter();
  const notes = 'A OLD marker-replacement';
  useCharacterStore.getState().updateLore('notes', notes);
  const oldReleases = holdCharacterWrite(notes, { ackOnly: true });
  const oldSave = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  expect(oldReleases).toHaveLength(1);
  const oldMarker = readCharacterDeferredPublication();
  const newerReleases = holdCharacterWrite('A NEW marker-replacement', { ackOnly: true });
  useCharacterStore.getState().updateLore('notes', 'A NEW marker-replacement');
  const newerSave = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  const newerMarker = readCharacterDeferredPublication();
  expect(newerMarker.revision).toBeGreaterThan(oldMarker.revision);
  oldReleases[0]();
  await oldSave;
  await settle();
  expect(newerReleases).toHaveLength(1);
  expect(readCharacterDeferredPublication()).toEqual(newerMarker);
  newerReleases[0]();
  await newerSave;
  expect(readCharacterDeferredPublication()).toBeNull();
  expect(rawRosterNotes()).toBe('A NEW marker-replacement');
});

test('a new handoff candidate cannot reuse an earlier nothing-to-preserve outcome', async () => {
  await setupOwnerAWithActiveCharacter();
  expect((await ensureCharacterHandoffPreserved()).status).toBe('NOTHING_TO_PRESERVE');
  useCharacterStore.getState().updateLore('notes', 'NEW CANDIDATE AFTER NO-OP');
  await switchOwner('u-b');
  expect(rawRosterNotes()).toBe('NEW CANDIDATE AFTER NO-OP');
  await switchOwner('u-a');
  await useCharacterStore.getState().loadActiveCharacter();
  expect(useCharacterStore.getState().lore.notes).toBe('NEW CANDIDATE AFTER NO-OP');
});

test('default empty projection notifications cannot reserve a hold ahead of B authored work', async () => {
  // The real store template has this display name, not the empty fixture name.
  useCharacterStore.setState({ name: 'Character Name' });
  await setupOwnerAWithActiveCharacter();
  useCharacterStore.getState().updateLore('notes', 'A DEFAULT TEMPLATE EDIT');
  await switchOwner('u-b');
  await switchOwner('u-a');
  await switchOwner('u-b');
  seedCloudCharacter('c-b', 'u-b', 'B HERO', 'B BASELINE');
  await useCharacterStore.getState().loadCharacters();
  await useCharacterStore.getState().setActiveCharacter('c-b');
  useCharacterStore.getState().updateLore('notes', 'B DEFAULT TEMPLATE UNSENT');
  await switchOwner('u-c');
  expect(rawRosterNotes('u-b')).toBe('B DEFAULT TEMPLATE UNSENT');
  await switchOwner('u-b');
  await useCharacterStore.getState().loadActiveCharacter();
  expect(useCharacterStore.getState().lore.notes).toBe('B DEFAULT TEMPLATE UNSENT');
});
