/**
 * Project 5 Wave B continuation — scoped consumers, handoff isolation,
 * revision-bound dirty acknowledgment, legacy quarantine and late-callback
 * fencing (G-series regressions).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDoc } from 'firebase/firestore';
import useBookStore from '../../store/bookStore';
import useDeityStore, { SEEDED_DEITIES } from '../../store/deityStore';
import useInventoryStore from '../../store/inventoryStore';
import useSpellStore from '../../store/spellStore';
import {
  createScopedStoreStorage,
  getScopedStoreEngine,
  registerScopedStoreHandoff
} from '../scopedStoreStorage';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import { createUserScope, guestScope } from '../scopeModel';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { findQuarantineReceipt } from '../scopedConsumer';
import { fingerprintRawString } from '../preservation';
import {
  loadRoster,
  saveRoster,
  loadActivePointer,
  saveActivePointer,
  resetCharacterScopedStorageState
} from '../characterScopedStorage';

jest.mock('../../config/firebase', () => ({ db: {}, isFirebaseConfigured: true, auth: null }));
jest.mock('firebase/firestore', () => ({ doc: jest.fn(), setDoc: jest.fn(), getDoc: jest.fn() }));

function installFakeLocks(manager) {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: manager });
  return () => {
    if (descriptor) {
      Object.defineProperty(navigator, 'locks', descriptor);
    } else {
      delete navigator.locks;
    }
  };
}

function serializingLockManager() {
  const tails = new Map();
  return {
    request(name, optionsOrCallback, maybeCallback) {
      const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
      const prior = tails.get(name) || Promise.resolve();
      const run = prior.then(() => callback({ name }));
      tails.set(name, run.catch(() => {}));
      return run;
    }
  };
}

const ticks = async (count = 6) => {
  for (let index = 0; index < count; index += 1) await Promise.resolve();
};

let restoreLocks;
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  resetBootstrapGateForTests();
  resetCharacterScopedStorageState();
  restoreLocks = installFakeLocks(serializingLockManager());
});

afterEach(() => {
  restoreLocks();
});

describe('Wave B continuation — worldbuilding scoped consumers', () => {
  it('import-time: legacy global data is never adopted; owner sees empty and raw source is quarantined', async () => {
    const legacyRaw = JSON.stringify({ state: { books: [{ id: 'legacy-book' }] }, version: 0 });
    localStorage.setItem('mythrill_books_storage', legacyRaw);

    // Module creation happened with no active scope: no legacy content loaded.
    const initialCount = useBookStore.getState().books.length;
    expect(useBookStore.getState().books.some((book) => book.id === 'legacy-book')).toBe(false);

    const A = createUserScope('owner-import-a');
    activatePrivateScope(A);
    await useBookStore.persist.rehydrate();

    expect(useBookStore.getState().books.some((book) => book.id === 'legacy-book')).toBe(false);
    expect(useBookStore.getState().books.length).toBe(initialCount);
    expect(localStorage.getItem('mythrill_books_storage')).toBe(legacyRaw);
    const fingerprint = fingerprintRawString(legacyRaw).value;
    expect(findQuarantineReceipt({
      scope: A,
      sourceKey: 'mythrill_books_storage',
      fingerprintValue: fingerprint
    })).not.toBeNull();
  });

  it('deity authored work is owner-isolated: B never sees A; returning A recovers it', async () => {
    useDeityStore.setState({ deities: SEEDED_DEITIES, removedSeedIds: [], lastCloudSyncAt: null });
    const reset = registerScopedStoreHandoff({
      familyId: 'worldbuilding.deities',
      store: useDeityStore,
      label: 'deities-test'
    });
    const engine = getScopedStoreEngine('worldbuilding.deities');
    const A = createUserScope('deity-owner-a');
    const B = createUserScope('deity-owner-b');

    activatePrivateScope(A);
    await useDeityStore.persist.rehydrate();
    useDeityStore.setState((state) => ({
      deities: [...state.deities, { id: 'deity-custom-a', name: 'Custom A', isCustom: true }]
    }));
    await engine.__flush();
    expect(useDeityStore.getState().getDeity('deity-custom-a')).not.toBeNull();

    // A → B
    reset();
    clearToSignedOut();
    activatePrivateScope(B);
    await useDeityStore.persist.rehydrate();
    expect(useDeityStore.getState().getDeity('deity-custom-a')).toBeNull();

    // B → A
    reset();
    clearToSignedOut();
    activatePrivateScope(A);
    await useDeityStore.persist.rehydrate();
    expect(useDeityStore.getState().getDeity('deity-custom-a')).not.toBeNull();
  });

  it('inventory working state is owner-isolated across handoff', async () => {
    useInventoryStore.setState({ items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' });
    const reset = registerScopedStoreHandoff({
      familyId: 'core.inventory',
      store: useInventoryStore,
      label: 'inventory-test'
    });
    const engine = getScopedStoreEngine('core.inventory');
    const A = createUserScope('inv-owner-a');
    const B = createUserScope('inv-owner-b');

    activatePrivateScope(A);
    await useInventoryStore.persist.rehydrate();
    useInventoryStore.setState({ items: [{ id: 'item-a', name: 'A Sword' }] });
    await engine.__flush();
    expect(useInventoryStore.getState().items.some((item) => item.id === 'item-a')).toBe(true);

    reset();
    clearToSignedOut();
    activatePrivateScope(B);
    await useInventoryStore.persist.rehydrate();
    expect(useInventoryStore.getState().items.some((item) => item.id === 'item-a')).toBe(false);

    reset();
    clearToSignedOut();
    activatePrivateScope(A);
    await useInventoryStore.persist.rehydrate();
    expect(useInventoryStore.getState().items.some((item) => item.id === 'item-a')).toBe(true);
  });

  it('spell library authored content is scoped (representative additional family)', async () => {
    useSpellStore.setState({ spells: [] });
    const reset = registerScopedStoreHandoff({
      familyId: 'library.spells',
      store: useSpellStore,
      label: 'spells-test'
    });
    const engine = getScopedStoreEngine('library.spells');
    const A = createUserScope('spell-owner-a');
    const B = createUserScope('spell-owner-b');

    activatePrivateScope(A);
    await useSpellStore.persist.rehydrate();
    useSpellStore.setState((state) => ({ spells: [...state.spells, { id: 'spell-a', name: 'A Spell' }] }));
    await engine.__flush();

    reset();
    clearToSignedOut();
    activatePrivateScope(B);
    await useSpellStore.persist.rehydrate();
    expect(useSpellStore.getState().spells.some((spell) => spell.id === 'spell-a')).toBe(false);
  });

  it('hydration does not write (no hydration-triggered save loop)', async () => {
    const A = createUserScope('loop-owner-a');
    activatePrivateScope(A);
    await useBookStore.persist.rehydrate();
    useBookStore.setState({ books: [{ id: 'loop-book' }] });
    const engine = getScopedStoreEngine('worldbuilding.books');
    await engine.__flush();
    const before = readScopedRecord({ familyId: 'worldbuilding.books', scope: A });

    await useBookStore.persist.rehydrate();
    await engine.__flush();
    const after = readScopedRecord({ familyId: 'worldbuilding.books', scope: A });
    expect(after.value.localRevision).toBe(before.value.localRevision);
    expect(after.raw).toBe(before.raw);
  });
});

describe('Wave B continuation — revision-bound dirty acknowledgment', () => {
  it('an N acknowledgment cannot clear a newer N+1 dirty edit', async () => {
    const storage = createScopedStoreStorage({ familyId: 'core.conditions' });
    const store = create(persist((set) => ({
      value: 'initial',
      setValue: (value) => set({ value })
    }), { name: 'scratch-conditions', storage }));

    const A = createUserScope('ack-owner-a');
    activatePrivateScope(A);
    await store.persist.rehydrate();

    store.getState().setValue('N');
    await storage.__flush();
    const revN = readScopedRecord({ familyId: 'core.conditions', scope: A }).value.localRevision;

    store.getState().setValue('N+1');
    await storage.__flush();
    const current = readScopedRecord({ familyId: 'core.conditions', scope: A });
    expect(current.value.localRevision).toBeGreaterThan(revN);
    expect(current.value.dirty).toBe(true);

    // Stale acknowledgment for N is refused.
    const staleConfirmed = await storage.__confirmSynced(revN);
    expect(staleConfirmed).toBe(false);
    expect(readScopedRecord({ familyId: 'core.conditions', scope: A }).value.dirty).toBe(true);

    // Acknowledging the exact current revision succeeds and clears dirty.
    const freshConfirmed = await storage.__confirmSynced(current.value.localRevision);
    expect(freshConfirmed).toBe(true);
    expect(readScopedRecord({ familyId: 'core.conditions', scope: A }).value.dirty).toBe(false);
  });
});

describe('Wave B continuation — late cloud callbacks', () => {
  it('a late A cloud hydration cannot mutate B state', async () => {
    const A = createUserScope('late-owner-a');
    const B = createUserScope('late-owner-b');

    activatePrivateScope(A);
    let resolveDoc;
    getDoc.mockImplementationOnce(() => new Promise((resolve) => { resolveDoc = resolve; }));

    const pending = useBookStore.getState().hydrateFromCloud('late-owner-a');
    // Account handoff happens while the cloud read is in flight.
    clearToSignedOut();
    activatePrivateScope(B);

    resolveDoc({
      exists: () => true,
      data: () => ({ books: [{ id: 'cloud-a-book', title: 'A cloud book' }] })
    });
    await pending;
    await ticks();

    expect(useBookStore.getState().books.some((book) => book.id === 'cloud-a-book')).toBe(false);
  });
});

describe('Wave B continuation — scoped character roster and pointer', () => {
  it('user A, user B and guest cannot cross-read roster or active pointer', async () => {
    const A = createUserScope('char-owner-a');
    const B = createUserScope('char-owner-b');

    activatePrivateScope(A);
    await saveRoster(false, [{ id: 'char-a', name: 'A Hero' }]);
    saveActivePointer('char-a');
    expect(loadRoster(false).map((c) => c.id)).toEqual(['char-a']);
    expect(loadActivePointer()).toBe('char-a');

    clearToSignedOut();
    activatePrivateScope(B);
    expect(loadRoster(false)).toBeNull();
    expect(loadActivePointer()).toBeNull();

    clearToSignedOut();
    activatePrivateScope(guestScope());
    expect(loadRoster(true)).toBeNull();
    expect(loadActivePointer()).toBeNull();
    await saveRoster(true, [{ id: 'char-guest', name: 'Guest Hero' }]);
    expect(loadRoster(true).map((c) => c.id)).toEqual(['char-guest']);

    // Users still see only their own roster.
    clearToSignedOut();
    activatePrivateScope(A);
    expect(loadRoster(false).map((c) => c.id)).toEqual(['char-a']);
  });

  it('legacy global roster is quarantined, never adopted', async () => {
    const legacyRaw = JSON.stringify([{ id: 'legacy-char', name: 'Legacy Hero' }]);
    localStorage.setItem('mythrill-characters', legacyRaw);
    const A = createUserScope('char-legacy-a');

    activatePrivateScope(A);
    const roster = loadRoster(false);

    expect(roster).toBeNull(); // no scoped record yet
    expect(localStorage.getItem('mythrill-characters')).toBe(legacyRaw);
    const fingerprint = fingerprintRawString(legacyRaw).value;
    expect(findQuarantineReceipt({
      scope: A,
      sourceKey: 'mythrill-characters',
      fingerprintValue: fingerprint
    })).not.toBeNull();
  });
});
