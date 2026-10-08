/**
 * P5 Wave B B1–B5 corrections — permanent safe-outcome regressions.
 *
 * These exercise the actual production callers that permit delayed A
 * completions under B, queued-write loss during handoff, stale-writer
 * overwrites, native-authored source replacement, and destructive cloud
 * adoption/acknowledgment. Controlled service doubles are used only to hold
 * or fail network responses; storage engines, stores and services are the
 * real production modules.
 */

const ROOT = 'D:/VTT/vtt-react/src';

jest.mock('D:/VTT/vtt-react/src/config/firebase', () => ({
  db: {}, isFirebaseConfigured: true, isDemoMode: false,
  auth: { currentUser: { uid: 'owner-a' } }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => args.slice(1).join('/')),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn((...args) => args.slice(1).join('/')),
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

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};
const ticks = async () => { for (let i = 0; i < 14; i += 1) await Promise.resolve(); };

function harness() {
  const gate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
  const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
  const A = createUserScope('owner-a');
  const B = createUserScope('owner-b');
  gate.resetBootstrapGateForTests();
  gate.activatePrivateScope(A);
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, opt, cb) {
        const callback = typeof opt === 'function' ? opt : cb;
        const run = (tails.get(name) || Promise.resolve()).then(() => callback({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
  const switchTo = (scope) => { gate.clearToSignedOut(); gate.activatePrivateScope(scope); };
  return { gate, A, B, switchTo };
}

const readRecord = (familyId, scope, locator = []) => {
  const { readScopedRecord } = require(`${ROOT}/persistence/safeRead`);
  return readScopedRecord({ familyId, scope, locator });
};

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe('B1 — delayed async consumers reject A completion under B', () => {
  it('B1-1 campaign hydration cannot save A cloud data into B', async () => {
    const { B, switchTo } = harness();
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    const service = require(`${ROOT}/services/campaignService`).default;
    service.loadCampaigns();
    const pending = deferred();
    jest.spyOn(cloud, 'readCampaignCloudState').mockReturnValue(pending.promise);
    const request = service.hydrateFromCloud('owner-a');
    switchTo(B);
    service.loadCampaigns();
    pending.resolve({
      state: 'PRESENT_VALID',
      campaigns: [{ id: 'a-private-campaign', name: 'A Private' }],
      currentCampaignId: null,
      cloudRevision: 1,
      cloudEpoch: 'epoch-a'
    });
    await request;
    expect(readRecord('campaign.collection', B).status).toBe('MISSING');
    expect(service.getCampaigns()).toEqual([]);
  });

  it('B1-2 character roster load cannot install A characters under B', async () => {
    const { switchTo } = harness();
    const service = require(`${ROOT}/services/firebase/characterPersistenceService`).default;
    const { createCoreSlice } = require(`${ROOT}/store/characterSlices/coreSlice`);
    const { registerStore } = require(`${ROOT}/store/storeRegistry`);
    let authState = { user: { uid: 'owner-a' }, isAuthInitialized: true };
    registerStore('authStore', { getState: () => authState });
    let state = {};
    const set = (update) => {
      state = { ...state, ...(typeof update === 'function' ? update(state) : update) };
    };
    state = createCoreSlice(set, () => state);
    const pending = deferred();
    jest.spyOn(service, 'loadUserCharacters').mockReturnValue(pending.promise);
    service.isConfigured = true;
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const loading = state.loadCharacters();
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    authState = { user: { uid: 'owner-b' }, isAuthInitialized: true };
    pending.resolve([{ id: 'a-character', name: 'A Private Character' }]);
    await loading;
    expect(state.characters.some((c) => c.id === 'a-character')).toBe(false);
  });

  it('B1-3 spellbook cloud hydration cannot apply A spells under B', async () => {
    const { switchTo } = harness();
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-a' } } }));
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.getDoc.mockReturnValue(pending.promise);
    fs.setDoc.mockResolvedValue();
    const store = require(`${ROOT}/store/spellbookStore`).default;
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-b' } } }));
    pending.resolve({ exists: () => true, data: () => ({ spells: [{ id: 'a-private-cloud-spell' }], collections: [] }) });
    await ticks();
    expect(store.getState().spells.some((s) => s.id === 'a-private-cloud-spell')).toBe(false);
  });

  it('B1-4 delayed spellbook cloud save cannot write A edit into B local mirror', async () => {
    const { switchTo } = harness();
    const fs = require('firebase/firestore');
    fs.getDoc.mockResolvedValue({ exists: () => false });
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-a' } } }));
    const store = require(`${ROOT}/store/spellbookStore`).default;
    await ticks();
    const pending = deferred();
    fs.setDoc.mockReturnValue(pending.promise);
    store.getState().addSpell({ id: 'a-private-edit', name: 'A Private' });
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-b' } } }));
    pending.resolve();
    await ticks();
    const engine = require(`${ROOT}/persistence/scopedStoreStorage`).getScopedStoreEngine('library.spellbook');
    await engine.__flush();
    const record = engine.getItem('spellbook-storage');
    expect(record && record.state.spells.some((s) => s.id === 'a-private-edit')).toBeFalsy();
  });

  it('B1-5 late journal hydration cannot mutate or persist B state', async () => {
    const { B, switchTo } = harness();
    const journal = require(`${ROOT}/services/firebase/journalService`).default;
    const store = require(`${ROOT}/store/shareableStore`).default;
    const pending = deferred();
    jest.spyOn(journal, 'loadJournal').mockReturnValue(pending.promise);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const loading = store.getState().hydrateFromCloud('owner-a');
    await ticks();
    switchTo(B);
    pending.resolve({ playerNotes: [{ id: 'a-note', title: 'A Private Journal' }] });
    await loading;
    await ticks();
    expect(store.getState().playerNotes.some((n) => n.id === 'a-note')).toBe(false);
    expect(readRecord('journal.shareable', B).status).toBe('MISSING');
  });

  it('B1-6 late action-bar Firebase response cannot populate B', async () => {
    const { B, switchTo } = harness();
    const service = require(`${ROOT}/services/actionBarPersistenceService`).default;
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.getDoc.mockReturnValue(pending.promise);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-a' } } }));
    const loading = service.loadActionBarConfig('same-character', 'same-room');
    switchTo(B);
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-b' } } }));
    pending.resolve({ exists: () => true, data: () => ({ actionSlots: [{ id: 'a-secret-bar' }] }) });
    expect(await loading).toBeNull();
    expect(readRecord('character.actionBar', B, ['same-character', 'same-room']).status).toBe('MISSING');
  });

  it('B1-7 failed A cloud backup cannot fall back into B local scope', async () => {
    const { B, switchTo } = harness();
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.addDoc.mockReturnValue(pending.promise);
    const service = require(`${ROOT}/services/firebase/characterBackupService`).default;
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const creating = service.createBackup('same-char', 'owner-a', 'manual', { name: 'A Private Backup' });
    switchTo(B);
    pending.reject(new Error('permission-denied'));
    const result = await creating;
    expect(result.success).toBe(false);
    expect(service.listLocalBackups('same-char')).toHaveLength(0);
    expect(readRecord('character.backups', B).status).toBe('MISSING');
  });

  it('B1-8 mounted entity graph cannot upload A retained nodes to B cloud', async () => {
    const sync = jest.fn().mockResolvedValue(true);
    jest.doMock('D:/VTT/vtt-react/src/services/firebase/entityGraphService', () => ({
      hydrateEntityGraph: jest.fn().mockResolvedValue({ customNodes: [], customEdges: [] }),
      syncEntityGraph: sync
    }));
    const { A, B, switchTo } = harness();
    const React = require('react');
    const { render, cleanup, act } = require('@testing-library/react/pure');
    const Graph = require(`${ROOT}/components/world/UniversalEntityGraph`).UniversalEntityGraph;
    const auth = require(`${ROOT}/store/authStore`).default;
    const { createScopedNativeFamily } = require(`${ROOT}/persistence/scopedNativeFamily`);
    switchTo(A);
    auth.setState({ user: { uid: 'owner-a' }, isAuthInitialized: true });
    switchTo(A);
    createScopedNativeFamily({ familyId: 'graph.entitiesNodes' })
      .save([{ id: 'a-node', name: 'A Secret Node', type: 'custom', regionId: 'frostwood-reach' }]);
    const ui = render(React.createElement(Graph, {}));
    await act(ticks);
    await act(async () => {
      switchTo(B);
      auth.setState({ user: { uid: 'owner-b' }, isAuthInitialized: true });
      await ticks();
      if (ui) { /* keep mounted through the owner change */ }
    });
    const leaked = sync.mock.calls.some(
      ([uid, data]) => uid === 'owner-b' && Array.isArray(data.customNodes) && data.customNodes.some((n) => n.id === 'a-node')
    );
    expect(leaked).toBe(false);
    cleanup();
  });

  it('B1-9 delayed offline character write cannot land in B storage', async () => {
    const { switchTo } = harness();
    const offline = require(`${ROOT}/services/offlineService`);
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.getDoc.mockReturnValue(pending.promise);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const updating = offline.updateCharacterData('same-char', { hp: 15 }, 'owner-a');
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    pending.resolve({ exists: () => true, data: () => ({ id: 'same-char', name: 'A Private Offline Character' }) });
    await updating;
    // The crossing write must never create an offline cache record under B.
    expect(readRecord('offline.characters', { scopeKind: 'user', scopeId: 'owner-b' }).status).toBe('MISSING');
  });

  it('B1-10 offline replay cannot emit A queued work through B socket', async () => {
    const { switchTo } = harness();
    const offline = require(`${ROOT}/services/offlineService`);
    const presence = require(`${ROOT}/store/presenceStore`).default;
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    await offline.queueAction('chat_message', { content: 'A message one' }, 'owner-a');
    await offline.queueAction('chat_message', { content: 'A private message two' }, 'owner-a');
    const aEmit = jest.fn();
    const bEmit = jest.fn();
    presence.setState({ socket: { connected: true, emit: aEmit } });
    const syncing = offline.syncOfflineData('owner-a');
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    presence.setState({ socket: { connected: true, emit: bEmit } });
    await syncing;
    expect(bEmit).not.toHaveBeenCalledWith('chat_message', { content: 'A private message two' });
  });

  it('B1-11 same-UID spellbook relogin rejects the obsolete hydration response', async () => {
    const { switchTo } = harness();
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.getDoc.mockReturnValue(pending.promise);
    fs.setDoc.mockResolvedValue();
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-a' } } }));
    const store = require(`${ROOT}/store/spellbookStore`).default;
    const A = { scopeKind: 'user', scopeId: 'owner-a' };
    switchTo(A);
    store.setState({ spells: [{ id: 'new-login-work' }] });
    await ticks();
    pending.resolve({ exists: () => true, data: () => ({ spells: [{ id: 'obsolete-login-response' }], collections: [] }) });
    await ticks();
    expect(store.getState().spells).toEqual([{ id: 'new-login-work' }]);
  });
});

describe('B2 — handoff preserves queued writes', () => {
  it('B2-1 a queued edit is flushed under A before retirement instead of being lost', async () => {
    const { A } = harness();
    const store = require(`${ROOT}/store/inventoryStore`).default;
    const { registerScopedStoreHandoff, getScopedStoreEngine } = require(`${ROOT}/persistence/scopedStoreStorage`);
    const coordinator = require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`);
    registerScopedStoreHandoff({ familyId: 'core.inventory', store, label: 'b2-inventory' });
    store.setState({ items: [{ id: 'unsaved-just-before-logout' }] });
    const transition = coordinator.coordinateAuthPrincipalChange({ user: { uid: 'owner-b' }, loading: false });
    if (transition.completion) await transition.completion;
    await getScopedStoreEngine('core.inventory').__flush();
    const record = readRecord('core.inventory', A);
    expect(record.status).toBe('PRESENT_VALID');
    expect(record.value.payload.state.items.some((i) => i.id === 'unsaved-just-before-logout')).toBe(true);
    expect(coordinator.getHandoffStatus().lastResult.blocked).toBe(false);
  });
});

describe('B3 — stale writers must not overwrite concurrent winners', () => {
  it('B3-1 store engine keeps the winner and forks the stale whole-document snapshot', async () => {
    const { A } = harness();
    const { createScopedStoreStorage } = require(`${ROOT}/persistence/scopedStoreStorage`);
    const { parseP5ScopedKey } = require(`${ROOT}/persistence/keyFormat`);

    const first = createScopedStoreStorage({ familyId: 'core.inventory' });
    first.setItem('inventory-storage', { state: { items: [{ id: 'baseline' }] }, version: 0 });
    await first.__flush();

    const stale = createScopedStoreStorage({ familyId: 'core.inventory' });
    stale.getItem('inventory-storage');

    first.setItem('inventory-storage', { state: { items: [{ id: 'newer-other-tab' }] }, version: 0 });
    await first.__flush();

    stale.setItem('inventory-storage', { state: { items: [{ id: 'stale-tab' }] }, version: 0 });
    await stale.__flush();

    expect(readRecord('core.inventory', A).value.payload.state.items).toEqual([{ id: 'newer-other-tab' }]);

    const forkPayloads = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== 'core.inventory' || (parsed.segments || []).length === 0) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(key));
        if (raw && raw.payload && raw.payload.state && raw.payload.state.items) {
          forkPayloads.push(raw.payload.state.items);
        }
      } catch (_error) { /* ignore malformed */ }
    }
    expect(forkPayloads.some((items) => items.some((i) => i.id === 'stale-tab'))).toBe(true);
  });

  it('B3-2 character roster keeps the winner and preserves the stale candidate', async () => {
    const { A } = harness();
    const roster = require(`${ROOT}/persistence/characterScopedStorage`);
    const { saveScopedDraft } = require(`${ROOT}/persistence/scopedConsumer`);
    const { parseP5ScopedKey } = require(`${ROOT}/persistence/keyFormat`);

    roster.saveRoster(false, [{ id: 'initial' }]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    roster.loadRoster(false);

    const current = readRecord('character.roster', A);
    await saveScopedDraft({
      familyId: 'character.roster',
      payload: [{ id: 'other-tab-winner' }],
      expectedRevision: current.value.localRevision,
      expectedDraftId: current.value.draftId
    });

    roster.saveRoster(false, [{ id: 'stale-candidate' }]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(readRecord('character.roster', A).value.payload).toEqual([{ id: 'other-tab-winner' }]);

    const forkPayloads = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== 'character.roster' || (parsed.segments || []).length === 0) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(key));
        if (raw && Array.isArray(raw.payload)) forkPayloads.push(raw.payload);
      } catch (_error) { /* ignore malformed */ }
    }
    expect(forkPayloads.some((list) => list.some((c) => c.id === 'stale-candidate'))).toBe(true);
  });

  it('B3-3 saved maps keep the winner and preserve the stale candidate', async () => {
    const { A } = harness();
    const savedMaps = require(`${ROOT}/persistence/mapSavedStorage`);
    const { saveScopedDraft } = require(`${ROOT}/persistence/scopedConsumer`);
    const { parseP5ScopedKey } = require(`${ROOT}/persistence/keyFormat`);

    savedMaps.saveSavedMaps([{ id: 'initial-map' }]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    savedMaps.loadSavedMaps();

    const current = readRecord('core.savedMaps', A);
    await saveScopedDraft({
      familyId: 'core.savedMaps',
      payload: [{ id: 'other-tab-winner' }],
      expectedRevision: current.value.localRevision,
      expectedDraftId: current.value.draftId
    });

    savedMaps.saveSavedMaps([{ id: 'stale-candidate' }]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(readRecord('core.savedMaps', A).value.payload).toEqual([{ id: 'other-tab-winner' }]);

    const forkPayloads = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== 'core.savedMaps' || (parsed.segments || []).length === 0) continue;
      try {
        const raw = JSON.parse(localStorage.getItem(key));
        if (raw && Array.isArray(raw.payload)) forkPayloads.push(raw.payload);
      } catch (_error) { /* ignore malformed */ }
    }
    expect(forkPayloads.some((list) => list.some((m) => m.id === 'stale-candidate'))).toBe(true);
  });
});

describe('B4 — native authored families preserve unreadable sources', () => {
  it('B4-1 an ordinary authored save cannot erase a malformed scoped source', () => {
    const { A } = harness();
    const { buildScopedKey } = require(`${ROOT}/persistence/keyFormat`);
    const { createScopedNativeFamily } = require(`${ROOT}/persistence/scopedNativeFamily`);
    const key = buildScopedKey({ scope: A, familyId: 'library.customSpells' });
    localStorage.setItem(key, '{damaged-but-only-copy');
    const family = createScopedNativeFamily({ familyId: 'library.customSpells', fallback: [] });
    expect(family.load()).toEqual([]);
    const saved = family.save([{ id: 'new-spell' }]);
    expect(saved.status).toBe('OK');
    const recoveredCopyExists = Object.keys(localStorage).some((storageKey) => localStorage.getItem(storageKey) === '{damaged-but-only-copy');
    expect(recoveredCopyExists).toBe(true);
  });
});

describe('B5 — non-destructive cloud adoption and acknowledgment', () => {
  it('B5A failed divergence preservation keeps the local campaign instead of adopting cloud', async () => {
    const { switchTo } = harness();
    const cloud = require(`${ROOT}/services/campaignCloudService`).default;
    const service = require(`${ROOT}/services/campaignService`).default;
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const local = service.createCampaign({ name: 'Only Local Work' });
    await service.flushPersistence();
    jest.spyOn(cloud, 'readCampaignCloudState').mockResolvedValue({
      state: 'PRESENT_VALID',
      campaigns: [{ id: 'remote', name: 'Remote' }],
      currentCampaignId: null,
      cloudRevision: 7,
      cloudEpoch: 'epoch'
    });
    const original = Storage.prototype.setItem;
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (String(key).includes(':campaign.collection:')) throw new Error('QuotaExceededError');
      return original.call(this, key, value);
    });
    const hydrated = await service.hydrateFromCloud('owner-a');
    expect(hydrated).toBe(false);
    expect(service.getCampaigns().some((c) => c.id === local.id)).toBe(true);
  });

  it('B5B an edit made while book cloud hydration is pending is not overwritten', async () => {
    const { switchTo } = harness();
    const store = require(`${ROOT}/store/bookStore`).default;
    const engine = require(`${ROOT}/persistence/scopedStoreStorage`).getScopedStoreEngine('worldbuilding.books');
    const fs = require('firebase/firestore');
    const pending = deferred();
    fs.getDoc.mockReturnValue(pending.promise);
    fs.setDoc.mockResolvedValue();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const loading = store.getState().hydrateFromCloud('owner-a');
    store.getState().createBook({ title: 'Authored While Cloud Was Reading' });
    await engine.__flush();
    pending.resolve({ exists: () => true, data: () => ({ books: [], trashedBooks: [] }) });
    await loading;
    await engine.__flush();
    expect(store.getState().books.some((b) => b.title === 'Authored While Cloud Was Reading')).toBe(true);
  });

  it('B5C a failed journal save never masquerades as a successful acknowledgment', async () => {
    const { switchTo } = harness();
    const store = require(`${ROOT}/store/shareableStore`).default;
    const journal = require(`${ROOT}/services/firebase/journalService`).default;
    const engine = require(`${ROOT}/persistence/scopedStoreStorage`).getScopedStoreEngine('journal.shareable');
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    store.getState().addNote('Only Unsynced Note', 'Secret content');
    await engine.__flush();
    expect(engine.__isDirty()).toBe(true);
    jest.spyOn(journal, 'saveJournal').mockResolvedValue({ success: false, error: 'permission-denied' });
    const res = await store.getState().syncToCloud('owner-a');
    expect(res).toBe(false);
    // The PersistenceProvider acknowledgment predicate must not clear dirty on false.
    if (res !== false && engine && typeof engine.__confirmSynced === 'function') {
      await engine.__confirmSynced();
    }
    expect(engine.__isDirty()).toBe(true);
  });
});
