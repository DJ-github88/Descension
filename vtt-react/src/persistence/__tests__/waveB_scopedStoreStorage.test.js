/**
 * Project 5 Wave B (S7.2) — scoped zustand store engine and journal handoff.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createScopedStoreStorage,
  registerScopedStoreHandoff
} from '../scopedStoreStorage';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import {
  coordinateAuthPrincipalChange,
  resetHandoffCoordinatorForTests,
  whenHandoffIdle
} from '../handoff/accountHandoffCoordinator';
import { createUserScope } from '../scopeModel';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { saveScopedDraft } from '../scopedConsumer';
import { parseP5ScopedKey } from '../keyFormat';

const A = createUserScope('user-a');
const B = createUserScope('user-b');
const FAMILY = 'library.items';

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

const flushTicks = async () => {
  for (let index = 0; index < 12; index += 1) await Promise.resolve();
};

function createScratchStore(storage) {
  return create(persist((set) => ({
    value: 'initial',
    setValue: (value) => set({ value })
  }), { name: 'scratch-shareable', storage }));
}

describe('Wave B S7 — scoped store engine', () => {
  let restoreLocks;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    resetHandoffCoordinatorForTests();
    restoreLocks = installFakeLocks(serializingLockManager());
  });

  afterEach(() => {
    restoreLocks();
    resetHandoffCoordinatorForTests();
  });

  it('no active scope: hydration is blocked and writes never reach storage', async () => {
    const storage = createScopedStoreStorage({ familyId: FAMILY });
    const store = createScratchStore(storage);
    clearToSignedOut();

    await store.persist.rehydrate();
    store.getState().setValue('A-data');
    await storage.__flush();

    expect(store.getState().value).toBe('A-data'); // in-memory only
    expect(Object.keys(localStorage).filter((key) => key.includes(FAMILY))).toEqual([]);
  });

  it('A writes persist to scoped storage; B hydrates its own empty namespace', async () => {
    const storage = createScopedStoreStorage({ familyId: FAMILY });
    const store = createScratchStore(storage);

    activatePrivateScope(A);
    await store.persist.rehydrate();
    store.getState().setValue('A-journal');
    await storage.__flush();

    const recordA = readScopedRecord({ familyId: FAMILY, scope: A });
    expect(recordA.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(recordA.value.payload.state.value).toBe('A-journal');

    clearToSignedOut();
    activatePrivateScope(B);
    // A fresh store under B reads only B's namespace; A's record is invisible.
    const storeB = createScratchStore(createScopedStoreStorage({ familyId: FAMILY }));
    await storeB.persist.rehydrate();
    expect(storeB.getState().value).toBe('initial');
    expect(readScopedRecord({ familyId: FAMILY, scope: B }).status).toBe(READ_STATUS.MISSING);
  });

  it('handoff resets A data before activation and rehydrates A on return', async () => {
    const storage = createScopedStoreStorage({ familyId: FAMILY });
    const store = createScratchStore(storage);
    registerScopedStoreHandoff({ familyId: FAMILY, store, storage, label: 'scratch' });

    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    await whenHandoffIdle();
    await flushTicks();
    store.getState().setValue('A-journal');
    await storage.__flush();
    expect(store.getState().value).toBe('A-journal');

    // A → B: in-memory data retired before B's scope is usable.
    coordinateAuthPrincipalChange({ user: { uid: 'user-b' } });
    await whenHandoffIdle();
    await flushTicks();
    expect(store.getState().value).toBe('initial');

    // B writes only B data.
    store.getState().setValue('B-journal');
    await storage.__flush();
    expect(readScopedRecord({ familyId: FAMILY, scope: A }).value.payload.state.value).toBe('A-journal');
    expect(readScopedRecord({ familyId: FAMILY, scope: B }).value.payload.state.value).toBe('B-journal');

    // Back to A: A's journal is recovered, never B's.
    coordinateAuthPrincipalChange({ user: { uid: 'user-a' } });
    await whenHandoffIdle();
    await flushTicks();
    expect(store.getState().value).toBe('A-journal');
  });

  it('a stale writer preserves the winner and forks its candidate', async () => {
    const storage = createScopedStoreStorage({ familyId: FAMILY });
    const store = createScratchStore(storage);

    activatePrivateScope(A);
    await store.persist.rehydrate();

    // Another tab writes the shared record.
    const other = await saveScopedDraft({ familyId: FAMILY, payload: { state: { value: 'other-tab' }, version: 0 } });
    expect(other.status).toBe('OK');

    // This tab starts from a stale baseline (as if it loaded before the other
    // write). B3: the engine must not publish the stale whole-document
    // snapshot over the winner; it preserves the candidate as a fork.
    store.getState().setValue('newer-edit');
    await storage.__flush();

    const record = readScopedRecord({ familyId: FAMILY, scope: A });
    expect(record.value.payload.state.value).toBe('other-tab');
    expect(record.value.localRevision).toBe(other.newRevision);

    // The stale candidate survives in a forked draft record.
    const forkValues = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== FAMILY || (parsed.segments || []).length === 0) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(key));
        if (raw && raw.payload && raw.payload.state && raw.payload.state.value) {
          forkValues.push(raw.payload.state.value);
        }
      } catch (_error) { /* ignore malformed */ }
    }
    expect(forkValues).toContain('newer-edit');
  });
});
