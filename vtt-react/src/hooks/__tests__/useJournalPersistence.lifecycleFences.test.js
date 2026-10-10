/**
 * Focused P5-02 / P5-03 / P5-04 journal lifecycle regressions.
 *
 * These reproduce Sol's independently witnessed production sequences:
 *
 *  - P5-02: returning owner A's unsent (dirty) journal is overwritten by an
 *    older cloud hydration; working state and the scoped local record lose it.
 *  - P5-03: a delayed A save completion flips the live B account's journal
 *    status to `saved` (and on failure posts B an error status/notification).
 *  - P5-04: a read that began with no valid owner guard is accepted after the
 *    same-UID account generation changed (fail-open guard).
 *
 * The real shareableStore, scoped storage engine, bootstrap gate, handoff
 * coordinator, persistence-status store and notification store are used. Only
 * the Firebase persistence boundary (persistenceService) and the auth store
 * are controlled doubles.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useJournalPersistence } from '../useJournalPersistence';
import persistenceService from '../../services/firebase/persistenceService';
import journalService from '../../services/firebase/journalService';
import useAuthStore from '../../store/authStore';
import useShareableStore from '../../store/shareableStore';
import {
  activatePrivateScope,
  clearToSignedOut,
  getBootstrapGateState,
  resetBootstrapGateForTests
} from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';
import { getScopedStoreEngine } from '../../persistence/scopedStoreStorage';
import { whenHandoffIdle } from '../../persistence/authBootstrapGateBinding';
import {
  coordinateAuthPrincipalChange,
  registerHandoffParticipant,
  resetHandoffCoordinatorForTests,
  unregisterHandoffParticipant
} from '../../persistence/handoff/accountHandoffCoordinator';

jest.mock('../../services/firebase/persistenceService', () => ({
  __esModule: true,
  default: { loadJournal: jest.fn(), saveJournal: jest.fn() }
}));

// The production shareableStore hydrates the journal through journalService
// (not through the hook's persistenceService), so the store continuation under
// test is held at its real external boundary.
jest.mock('../../services/firebase/journalService', () => ({
  __esModule: true,
  default: { loadJournal: jest.fn(), saveJournal: jest.fn() }
}));

jest.mock('../../store/authStore', () => {
  const { create } = require('zustand');
  const useAuthStore = create(() => ({ user: null }));
  return { __esModule: true, default: useAuthStore };
});

const A = createUserScope('user-a');
const B = createUserScope('user-b');
const A_JOURNAL_KEY = 'mythrill:p5:user:user-a:journal.shareable';

const EMPTY_JOURNAL = {
  playerKnowledge: [],
  playerNotes: [],
  journalFolders: [],
  knowledgeBoards: [],
  knowledgeOrbs: [],
  knowledgeConnections: [],
  currentFolderId: null,
  currentBoardId: null
};

const witnessJournal = () => ({
  ...EMPTY_JOURNAL,
  playerNotes: [{ id: 'witness', title: 'GENERATION WITNESS' }]
});

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

const flushMicrotasks = async (count = 6) => {
  for (let i = 0; i < count; i += 1) await Promise.resolve();
};

const resetShareableStore = () => {
  useShareableStore.setState({
    ...EMPTY_JOURNAL,
    masterBoardBackground: null,
    shareables: []
  });
};

const installLocks = () => {
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, options, callback) {
        const cb = typeof options === 'function' ? options : callback;
        const run = (tails.get(name) || Promise.resolve()).then(() => cb({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
};

beforeEach(() => {
  resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests();
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
  installLocks();
  useAuthStore.setState({ user: null });
  resetShareableStore();
  getScopedStoreEngine('journal.shareable').__resetBaselines();
});

describe('P5-02 — returning owner keeps unsent journal against an older cloud read', () => {
  it('a delayed older cloud hydration cannot overwrite A\u2019s restored dirty journal or scoped record', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });

    const engine = getScopedStoreEngine('journal.shareable');

    // Owner A authors unsent work that is preserved locally (dirty envelope).
    useShareableStore.getState().addNote('A BEFORE HANDOFF UNSENT', 'authored before account handoff');
    await engine.__flush();
    expect(engine.__isDirty()).toBe(true);

    // A -> B -> A handoff with the production reset + rehydrate sequence.
    act(() => {
      activatePrivateScope(B);
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
    });
    act(() => {
      resetShareableStore();
    });
    act(() => {
      activatePrivateScope(A);
      useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    });
    await act(async () => {
      await useShareableStore.persist.rehydrate();
    });

    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .toContain('A BEFORE HANDOFF UNSENT');

    // An older cloud document (without the unsent note) resolves afterwards.
    persistenceService.loadJournal.mockResolvedValue({
      ...EMPTY_JOURNAL,
      playerNotes: [{ id: 'cloud-old', title: 'A CLOUD NOTE OLDER' }]
    });
    persistenceService.saveJournal.mockResolvedValue({ success: true });

    const { unmount } = renderHook(() => useJournalPersistence());
    await waitFor(() => expect(persistenceService.loadJournal).toHaveBeenCalledWith('user-a'));
    await act(async () => { await flushMicrotasks(); });
    await engine.__flush();

    const titles = useShareableStore.getState().playerNotes.map((n) => n.title);
    expect(titles).toContain('A BEFORE HANDOFF UNSENT');
    expect(titles).not.toContain('A CLOUD NOTE OLDER');

    // The authored local record survives; no recovery loss, no false save.
    expect(localStorage.getItem(A_JOURNAL_KEY)).toContain('A BEFORE HANDOFF UNSENT');
    expect(engine.__isDirty()).toBe(true);
    unmount();
  });

  it('normal clean hydration still applies the owner\u2019s cloud journal', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue({
      ...EMPTY_JOURNAL,
      playerNotes: [{ id: 'cloud', title: 'CLEAN CLOUD NOTE' }]
    });

    const { unmount } = renderHook(() => useJournalPersistence());
    await waitFor(() => expect(persistenceService.loadJournal).toHaveBeenCalledWith('user-a'));
    await act(async () => { await flushMicrotasks(); });

    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .toContain('CLEAN CLOUD NOTE');
    unmount();
  });

  it('a missing/failed cloud read leaves existing working journal untouched', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    resetShareableStore();
    useShareableStore.setState({ playerNotes: [{ id: 'kept', title: 'KEPT NOTE' }] });
    persistenceService.loadJournal.mockResolvedValue(null);

    const { unmount } = renderHook(() => useJournalPersistence());
    await waitFor(() => expect(persistenceService.loadJournal).toHaveBeenCalledWith('user-a'));
    await act(async () => { await flushMicrotasks(); });

    expect(useShareableStore.getState().playerNotes.map((n) => n.title)).toEqual(['KEPT NOTE']);
    unmount();
  });
});

describe('P5-02 — provider/store journal hydration cannot overwrite a newer unsent edit', () => {
  it('the actual store hydration continuation refuses an older cloud result after a mid-read edit', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    const engine = getScopedStoreEngine('journal.shareable');

    // Clean local baseline: this is the exact state the provider's hydration
    // loop sees before it starts the store's cloud read.
    useShareableStore.getState().addNote('OLDER CLOUD JOURNAL', 'baseline authored earlier');
    await engine.__flush();
    await engine.__confirmSynced();
    expect(engine.__isDirty()).toBe(false);

    const held = deferred();
    journalService.loadJournal.mockReturnValue(held.promise);
    const loading = useShareableStore.getState().hydrateFromCloud('user-a');
    await act(async () => { await flushMicrotasks(); });
    expect(journalService.loadJournal).toHaveBeenCalledWith('user-a');

    // A newer unsent edit lands while the older cloud read is still pending.
    useShareableStore.getState().addNote('NEW UNSENT DURING READ', 'authored mid-read');
    await engine.__flush();
    expect(engine.__isDirty()).toBe(true);
    const durableBefore = localStorage.getItem(A_JOURNAL_KEY);

    let applied;
    await act(async () => {
      held.resolve({
        ...EMPTY_JOURNAL,
        playerNotes: [{ id: 'cloud-old', title: 'OLDER CLOUD JOURNAL' }]
      });
      applied = await loading;
      await flushMicrotasks();
    });
    await engine.__flush();

    // Refused, never presented as a successful cloud apply, and the newer
    // authored work survives in working memory and in the scoped record.
    expect(applied).toBe(false);
    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .toContain('NEW UNSENT DURING READ');
    expect(engine.__isDirty()).toBe(true);
    const durableAfter = localStorage.getItem(A_JOURNAL_KEY);
    expect(durableAfter).toContain('NEW UNSENT DURING READ');
    expect(durableAfter).toBe(durableBefore);
  });

  it('a clean store hydration with no intervening edit still applies the owner cloud journal', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    const held = deferred();
    journalService.loadJournal.mockReturnValue(held.promise);

    const loading = useShareableStore.getState().hydrateFromCloud('user-a');
    await act(async () => { await flushMicrotasks(); });

    let applied;
    await act(async () => {
      held.resolve({
        ...EMPTY_JOURNAL,
        playerNotes: [{ id: 'cloud', title: 'STORE CLEAN CLOUD NOTE' }]
      });
      applied = await loading;
      await flushMicrotasks();
    });

    expect(applied).toBe(true);
    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .toContain('STORE CLEAN CLOUD NOTE');
  });
});

describe('P5-03 — old save continuations never mutate the new account', () => {
  it('a delayed A success cannot change live B\u2019s journal status to saved', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);

    const pendingSave = deferred();
    persistenceService.saveJournal.mockReturnValue(pendingSave.promise);

    const usePersistenceStatusStore = require('../../store/persistenceStatusStore').default;
    usePersistenceStatusStore.getState().clearStatus('journal');

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let saving;
    await act(async () => {
      saving = result.current.saveJournal({ playerNotes: [{ id: 'a-note', title: 'A UNSENT' }] });
      await Promise.resolve();
    });
    expect(usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');

    // A -> B account switch while A's persistence continuation is held.
    await act(async () => {
      clearToSignedOut();
      activatePrivateScope(B);
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
    });

    let returned;
    await act(async () => {
      pendingSave.resolve({ success: true, userId: 'user-a', size: 128 });
      returned = await saving;
    });

    // The legitimate A-owned result is preserved for the caller...
    expect(returned).toEqual({ success: true, userId: 'user-a', size: 128 });
    // ...but B's journal status is not told A's work was saved.
    expect(usePersistenceStatusStore.getState().statuses.journal.status).not.toBe('saved');
    unmount();
  });

  it('a delayed A failure cannot set live B\u2019s error status or notification', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);

    const pendingSave = deferred();
    persistenceService.saveJournal.mockReturnValue(pendingSave.promise);

    const usePersistenceStatusStore = require('../../store/persistenceStatusStore').default;
    const useNotificationStore = require('../../store/notificationStore').default;
    usePersistenceStatusStore.getState().clearStatus('journal');
    useNotificationStore.getState().clearAll();

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let saving;
    await act(async () => {
      saving = result.current.saveJournal({ playerNotes: [{ id: 'a-note', title: 'A UNSENT' }] });
      await Promise.resolve();
    });

    await act(async () => {
      clearToSignedOut();
      activatePrivateScope(B);
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
    });

    let returned;
    await act(async () => {
      pendingSave.resolve({ success: false, error: 'network-down' });
      returned = await saving;
    });

    expect(returned.success).toBe(false);
    expect(usePersistenceStatusStore.getState().statuses.journal.status).not.toBe('error');
    expect(useNotificationStore.getState().notifications
      .some((n) => n.title === 'Journal save failed')).toBe(false);
    unmount();
  });

  it('a delayed A thrown failure cannot post an error notification under B', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);

    const pendingSave = deferred();
    persistenceService.saveJournal.mockReturnValue(pendingSave.promise);

    const useNotificationStore = require('../../store/notificationStore').default;
    useNotificationStore.getState().clearAll();

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let saving;
    await act(async () => {
      saving = result.current.saveJournal({ playerNotes: [{ id: 'a-note', title: 'A UNSENT' }] });
      await Promise.resolve();
    });

    await act(async () => {
      clearToSignedOut();
      activatePrivateScope(B);
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
    });

    let returned;
    await act(async () => {
      pendingSave.reject(new Error('transport exploded'));
      returned = await saving;
    });

    expect(returned.success).toBe(false);
    expect(useNotificationStore.getState().notifications
      .some((n) => n.title === 'Journal save failed')).toBe(false);
    unmount();
  });

  it('normal same-owner save success still updates the shared status', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);
    persistenceService.saveJournal.mockResolvedValue({ success: true, userId: 'user-a' });

    const usePersistenceStatusStore = require('../../store/persistenceStatusStore').default;
    usePersistenceStatusStore.getState().clearStatus('journal');

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let returned;
    await act(async () => {
      returned = await result.current.saveJournal({ playerNotes: [] });
    });

    expect(returned.success).toBe(true);
    expect(usePersistenceStatusStore.getState().statuses.journal.status).toBe('saved');
    unmount();
  });

  it('normal same-owner save failure still reports error status and notification', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);
    persistenceService.saveJournal.mockResolvedValue({ success: false, error: 'denied' });

    const usePersistenceStatusStore = require('../../store/persistenceStatusStore').default;
    const useNotificationStore = require('../../store/notificationStore').default;
    usePersistenceStatusStore.getState().clearStatus('journal');
    useNotificationStore.getState().clearAll();

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    await act(async () => {
      await result.current.saveJournal({ playerNotes: [] });
    });

    expect(usePersistenceStatusStore.getState().statuses.journal.status).toBe('error');
    expect(useNotificationStore.getState().notifications
      .some((n) => n.title === 'Journal save failed')).toBe(true);
    unmount();
  });
});

describe('P5-03 — save completion during coordinator preservation never mutates live B', () => {
  const setupPreservation = async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    persistenceService.loadJournal.mockResolvedValue(null);

    const engine = getScopedStoreEngine('journal.shareable');
    useShareableStore.getState().addNote('A PRESERVED WORK', 'A-owned work kept during handoff');
    await engine.__flush();

    const pendingSave = deferred();
    persistenceService.saveJournal.mockReturnValue(pendingSave.promise);

    const usePersistenceStatusStore = require('../../store/persistenceStatusStore').default;
    const useNotificationStore = require('../../store/notificationStore').default;
    usePersistenceStatusStore.getState().clearStatus('journal');
    useNotificationStore.getState().clearAll();

    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let saving;
    await act(async () => {
      saving = result.current.saveJournal({ playerNotes: [{ id: 'a-note', title: 'A SAVE PAYLOAD' }] });
      await Promise.resolve();
    });
    expect(usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');

    // Live principal becomes B, but the coordinator's stopNewWork preservation
    // latch keeps the old A scope/generation current (the exact interval the
    // independent witness holds).
    const latch = deferred();
    registerHandoffParticipant({
      id: 'test-preservation-latch',
      stopNewWork: () => latch.promise
    });
    await act(async () => {
      useAuthStore.setState({ user: { uid: 'user-b', email: 'b@test' } });
      coordinateAuthPrincipalChange({ user: { uid: 'user-b', email: 'b@test' } });
      await flushMicrotasks();
    });

    const gateDuring = getBootstrapGateState();
    expect(gateDuring.scope.scopeId).toBe('user-a');
    expect(gateDuring.handoffPending).toBe(true);
    expect(useAuthStore.getState().user.uid).toBe('user-b');

    return {
      engine,
      latch,
      pendingSave,
      saving,
      unmount,
      usePersistenceStatusStore,
      useNotificationStore,
      gateDuring
    };
  };

  it('a delayed A success under live B keeps B status and A result separate', async () => {
    const ctx = await setupPreservation();

    let returned;
    await act(async () => {
      ctx.pendingSave.resolve({ success: true, userId: 'user-a', size: 96 });
      returned = await ctx.saving;
    });

    // A's legitimate result is preserved for its caller...
    expect(returned).toEqual({ success: true, userId: 'user-a', size: 96 });
    // ...but B's shared journal status is not told A's work was saved.
    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');

    await act(async () => {
      ctx.latch.resolve({ ok: true });
      await whenHandoffIdle();
      await flushMicrotasks();
    });

    const gateAfter = getBootstrapGateState();
    expect(gateAfter.scope.scopeId).toBe('user-b');
    expect(gateAfter.accountGeneration).toBeGreaterThan(ctx.gateDuring.accountGeneration);
    expect(gateAfter.handoffPending).toBe(false);
    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');
    expect(localStorage.getItem(A_JOURNAL_KEY)).toContain('A PRESERVED WORK');
    ctx.unmount();
  });

  it('a delayed A returned failure under live B does not change B status or notify', async () => {
    const ctx = await setupPreservation();

    let returned;
    await act(async () => {
      ctx.pendingSave.resolve({ success: false, error: 'controlled write denial' });
      returned = await ctx.saving;
    });

    expect(returned.success).toBe(false);
    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');
    expect(ctx.useNotificationStore.getState().notifications).toEqual([]);

    await act(async () => {
      ctx.latch.resolve({ ok: true });
      await whenHandoffIdle();
      await flushMicrotasks();
    });

    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');
    expect(localStorage.getItem(A_JOURNAL_KEY)).toContain('A PRESERVED WORK');
    ctx.unmount();
  });

  it('a delayed A thrown failure under live B does not change B status or notify', async () => {
    const ctx = await setupPreservation();

    let returned;
    await act(async () => {
      ctx.pendingSave.reject(new Error('transport exploded'));
      returned = await ctx.saving;
    });

    expect(returned.success).toBe(false);
    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');
    expect(ctx.useNotificationStore.getState().notifications).toEqual([]);

    await act(async () => {
      ctx.latch.resolve({ ok: true });
      await whenHandoffIdle();
      await flushMicrotasks();
    });

    expect(ctx.usePersistenceStatusStore.getState().statuses.journal.status).toBe('saving');
    expect(localStorage.getItem(A_JOURNAL_KEY)).toContain('A PRESERVED WORK');
    ctx.unmount();
  });
});

describe('P5-04 — a missing owner guard never authorizes journal application', () => {
  it('a read begun with no active owner scope is rejected after the same-UID generation advances', async () => {
    // Start from an active A session, then fail a handoff so the gate holds
    // with NO active scope (Sol\u2019s generation-5 loading state).
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    registerHandoffParticipant({
      id: 'regression-reset-fault',
      resetProjection: () => ({ ok: false, reason: 'controlled-reset-failure' })
    });
    coordinateAuthPrincipalChange({ user: { uid: 'user-b', email: 'b@test' } });
    unregisterHandoffParticipant('regression-reset-fault');

    const held = getBootstrapGateState();
    expect(held.scope).toBeNull();
    const startedGeneration = held.accountGeneration;

    const heldReads = [];
    persistenceService.loadJournal.mockImplementation(() => {
      const read = deferred();
      heldReads.push(read);
      return read.promise;
    });

    // The hook\u2019s own load effect and this explicit call both begin while no
    // valid owner guard exists.
    const { result, unmount } = renderHook(() => useJournalPersistence());
    await act(async () => { await flushMicrotasks(); });

    let manualPromise;
    act(() => {
      manualPromise = result.current.loadJournal();
    });

    // Same-UID logout → login while the reads are held: generation advances.
    act(() => {
      clearToSignedOut();
      activatePrivateScope(A);
    });
    expect(getBootstrapGateState().accountGeneration).toBeGreaterThan(startedGeneration);

    let manualResult;
    await act(async () => {
      heldReads.forEach((read) => read.resolve(witnessJournal()));
      manualResult = await manualPromise;
    });

    // No read result may be applied, and no read should even be issued with a
    // missing owner guard.
    expect(manualResult.success).toBe(false);
    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .not.toContain('GENERATION WITNESS');
    expect(persistenceService.loadJournal).not.toHaveBeenCalled();
    unmount();
  });

  it('an in-flight read started under the active same-UID scope is refused after logout/login', async () => {
    activatePrivateScope(A);
    useAuthStore.setState({ user: { uid: 'user-a', email: 'a@test' } });
    const read = deferred();
    persistenceService.loadJournal.mockReturnValue(read.promise);

    const { unmount } = renderHook(() => useJournalPersistence());
    await waitFor(() => expect(persistenceService.loadJournal).toHaveBeenCalledWith('user-a'));

    act(() => {
      clearToSignedOut();
      activatePrivateScope(A);
    });

    await act(async () => {
      read.resolve(witnessJournal());
      await flushMicrotasks();
    });

    expect(useShareableStore.getState().playerNotes.map((n) => n.title))
      .not.toContain('GENERATION WITNESS');
    unmount();
  });
});
