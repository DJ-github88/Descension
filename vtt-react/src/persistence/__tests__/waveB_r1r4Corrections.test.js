/**
 * P5 Wave B R1–R4 residual corrections — permanent regressions.
 *
 * Real production callers with controlled timing:
 *  R1 entity graph generation/owner rehydration (mounted component)
 *  R2 handoff preservation failure + immediate private isolation
 *  R3 queued stale snapshot cohorts across all three production engines
 *  R4 custom-map physical-ID collisions (IndexedDB + mirror + ownership)
 *
 * RED evidence for these scenarios was captured before the corrections
 * (13 failing / 1 passing); R4-5 (collision successor reuses the owner's
 * physical record) and R4-6 (canonical duplicate resolution) were captured
 * failing before the logical-ID correction. This suite now asserts the
 * corrected outcomes.
 */

const ROOT = 'D:/VTT/vtt-react/src';

jest.mock('D:/VTT/vtt-react/src/config/firebase', () => ({
  db: {}, isFirebaseConfigured: true, isDemoMode: false,
  auth: { currentUser: { uid: 'owner-a' } }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => args.slice(1).join('/')), getDoc: jest.fn(), setDoc: jest.fn(),
  collection: jest.fn(), addDoc: jest.fn(), getDocs: jest.fn(), query: jest.fn(), where: jest.fn(),
  orderBy: jest.fn(), limit: jest.fn(), deleteDoc: jest.fn(), onSnapshot: jest.fn(() => () => {})
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}) }));

const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };
const ticks = async () => { for (let i = 0; i < 16; i += 1) await Promise.resolve(); };

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
  const switchTo = (scope) => {
    require(`${ROOT}/config/firebase`).auth.currentUser = { uid: scope.scopeId };
    gate.clearToSignedOut();
    gate.activatePrivateScope(scope);
  };
  return { gate, A, B, switchTo };
}

const read = (familyId, scope, locator = []) =>
  require(`${ROOT}/persistence/safeRead`).readScopedRecord({ familyId, scope, locator });

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => {
  require('@testing-library/react/pure').cleanup();
  delete window.indexedDB;
});

/* ============================ R1 — ENTITY GRAPH ============================ */

async function graphSetup(readCloud) {
  jest.doMock('D:/VTT/vtt-react/src/services/firebase/entityGraphService', () => ({
    hydrateEntityGraph: readCloud,
    syncEntityGraph: jest.fn().mockResolvedValue(true)
  }));
  const h = harness();
  const React = require('react');
  const { render, act } = require('@testing-library/react/pure');
  const Graph = require(`${ROOT}/components/world/UniversalEntityGraph`).UniversalEntityGraph;
  const auth = require(`${ROOT}/store/authStore`).default;
  auth.setState({ user: { uid: 'owner-a' }, isAuthInitialized: true });
  await require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`).whenHandoffIdle();
  h.switchTo(h.A);
  const ui = render(React.createElement(Graph));
  await act(ticks);
  return { ...h, ui, auth, act };
}

function addGraphNode(ui, name) {
  const { fireEvent } = require('@testing-library/react/pure');
  fireEvent.click(ui.getByRole('button', { name: 'Add Entity' }));
  fireEvent.change(ui.getByPlaceholderText('e.g. Frost Elves, House of Dawn, Sunken Spires...'), { target: { value: name } });
  fireEvent.click(ui.getByText('+ Add to Web'));
}

test('R1-1 an old same-UID generation response cannot destroy the newer authored node', async () => {
  const pending = deferred();
  const readCloud = jest.fn(() => pending.promise);
  const { A, switchTo, ui, act } = await graphSetup(readCloud);

  // Same-UID relogin advances the P5 generation while the first read waits.
  await act(async () => { switchTo(A); await ticks(); });
  addGraphNode(ui, 'New-login authored node');
  await act(ticks);
  expect(read('graph.entitiesNodes', A).value.payload.some((n) => n.name === 'New-login authored node')).toBe(true);

  await act(async () => {
    pending.resolve({ customNodes: [{ id: 'old-cloud', name: 'Old-login cloud snapshot', type: 'lineage', regionId: 'frostwood-reach' }], customEdges: [] });
    await ticks();
  });
  const stored = read('graph.entitiesNodes', A).value.payload;
  expect(stored.some((n) => n.name === 'New-login authored node')).toBe(true);
  expect(stored.some((n) => n.name === 'Old-login cloud snapshot')).toBe(false);
});

test('R1-2 destination activation rehydrates B local graph and preserves it on edit', async () => {
  const { B, auth, switchTo, ui, act } = await graphSetup(jest.fn().mockResolvedValue({ customNodes: [], customEdges: [] }));
  const family = require(`${ROOT}/persistence/scopedNativeFamily`).createScopedNativeFamily({ familyId: 'graph.entitiesNodes' });
  switchTo(B);
  family.save([{ id: 'b-local', name: 'B retained local work', type: 'lineage', regionId: 'frostwood-reach' }]);
  switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));

  await act(async () => {
    switchTo(B);
    auth.setState({ user: { uid: 'owner-b' }, isAuthInitialized: true });
    await ticks();
  });
  // The destination's local draft is still intact before any edit.
  expect(read('graph.entitiesNodes', B).value.payload.some((n) => n.id === 'b-local')).toBe(true);

  addGraphNode(ui, 'B second node');
  await act(ticks);
  const stored = read('graph.entitiesNodes', B).value.payload;
  expect(stored.some((n) => n.id === 'b-local')).toBe(true);
  expect(stored.some((n) => n.name === 'B second node')).toBe(true);
});

test('R1-3 normal owner-authorized graph authoring still persists', async () => {
  jest.doMock('D:/VTT/vtt-react/src/services/firebase/entityGraphService', () => ({
    hydrateEntityGraph: jest.fn().mockResolvedValue({ customNodes: [], customEdges: [] }),
    syncEntityGraph: jest.fn().mockResolvedValue(true)
  }));
  const h = harness();
  const React = require('react');
  const { render, act } = require('@testing-library/react/pure');
  const Graph = require(`${ROOT}/components/world/UniversalEntityGraph`).UniversalEntityGraph;
  const auth = require(`${ROOT}/store/authStore`).default;
  auth.setState({ user: { uid: 'owner-a' }, isAuthInitialized: true });
  await require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`).whenHandoffIdle();
  h.switchTo(h.A);
  const ui = render(React.createElement(Graph));
  await act(ticks);
  addGraphNode(ui, 'Authorized A node');
  await act(ticks);
  expect(read('graph.entitiesNodes', h.A).value.payload.some((n) => n.name === 'Authorized A node')).toBe(true);
});

/* ========================= R2 — HANDOFF PRESERVATION ======================= */

test('R2-1 a failed pending preservation keeps the sole candidate, stays blocked and isolated', async () => {
  const { A, gate, switchTo } = harness();
  const store = require(`${ROOT}/store/inventoryStore`).default;
  const { registerScopedStoreHandoff, getScopedStoreEngine } = require(`${ROOT}/persistence/scopedStoreStorage`);
  const coordinator = require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`);
  switchTo(A);
  const engine = getScopedStoreEngine('core.inventory');
  registerScopedStoreHandoff({ familyId: 'core.inventory', store, label: 'r2-inventory' });
  store.setState({ items: [{ id: 'preserved-old' }] });
  await engine.__flush();

  const original = Storage.prototype.setItem;
  const quotaSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (String(key).includes(':core.inventory')) throw new Error('QuotaExceededError');
    return original.call(this, key, value);
  });
  store.setState({ items: [{ id: 'sole-unsaved-candidate' }] });
  require(`${ROOT}/config/firebase`).auth.currentUser = { uid: 'owner-b' };
  const transition = coordinator.coordinateAuthPrincipalChange({ user: { uid: 'owner-b' }, loading: false });
  if (transition.completion) await transition.completion;

  const status = coordinator.getHandoffStatus();
  expect(status.lastResult.blocked).toBe(true);
  // The only in-memory copy survives; the destructive reset did not run.
  expect(store.getState().items.some((i) => i.id === 'sole-unsaved-candidate')).toBe(true);
  // The candidate is retained for retry inside the engine.
  expect(engine.__hasRefusedCandidate()).toBe(true);
  // Private UI is isolated immediately and the old scope stays writable for retry.
  const gateState = gate.getBootstrapGateState();
  expect(gateState.handoffPending).toBe(true);
  expect(gateState.scope && gateState.scope.scopeId).toBe('owner-a');
  quotaSpy.mockRestore();
});

test('R2-2 a retry after the storage recovers preserves the candidate and completes', async () => {
  const { A, gate, switchTo } = harness();
  const store = require(`${ROOT}/store/inventoryStore`).default;
  const { registerScopedStoreHandoff, getScopedStoreEngine } = require(`${ROOT}/persistence/scopedStoreStorage`);
  const coordinator = require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`);
  switchTo(A);
  const engine = getScopedStoreEngine('core.inventory');
  registerScopedStoreHandoff({ familyId: 'core.inventory', store, label: 'r2-retry' });
  store.setState({ items: [{ id: 'preserved-old' }] });
  await engine.__flush();

  const original = Storage.prototype.setItem;
  const quotaSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (String(key).includes(':core.inventory')) throw new Error('QuotaExceededError');
    return original.call(this, key, value);
  });
  store.setState({ items: [{ id: 'retry-candidate' }] });
  require(`${ROOT}/config/firebase`).auth.currentUser = { uid: 'owner-b' };
  const first = coordinator.coordinateAuthPrincipalChange({ user: { uid: 'owner-b' }, loading: false });
  if (first.completion) await first.completion;
  expect(coordinator.getHandoffStatus().lastResult.blocked).toBe(true);

  quotaSpy.mockRestore();
  const retry = coordinator.retryPendingHandoff();
  if (retry.completion) await retry.completion;

  const result = coordinator.getHandoffStatus();
  expect(result.lastResult.blocked).toBe(false);
  expect(result.activeScope && result.activeScope.scopeId).toBe('owner-b');
  expect(gate.getBootstrapGateState().handoffPending).toBe(false);
  // The candidate was preserved durably under its originating owner.
  expect(read('core.inventory', A).value.payload.state.items.some((i) => i.id === 'retry-candidate')).toBe(true);
});

test('R2-3 a slow flush never exposes the old owner private projection', async () => {
  const { gate, A, switchTo } = harness();
  const store = require(`${ROOT}/store/inventoryStore`).default;
  const { registerScopedStoreHandoff } = require(`${ROOT}/persistence/scopedStoreStorage`);
  const coordinator = require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`);
  const React = require('react');
  const { render, act } = require('@testing-library/react/pure');
  const Boundary = require(`${ROOT}/persistence/PrivateProjectionBoundary`).default;
  switchTo(A);
  registerScopedStoreHandoff({ familyId: 'core.inventory', store, label: 'r2-slow' });

  const blocked = deferred();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: { request(name, opt, cb) { return blocked.promise.then(() => (typeof opt === 'function' ? opt : cb)({ name })); } }
  });
  store.setState({ items: [{ id: 'A private pending inventory' }] });
  function InventoryProjection() {
    return React.createElement('div', null, store((s) => s.items).map((i) => i.id).join(','));
  }
  const ui = render(React.createElement(Boundary, null, React.createElement(InventoryProjection)));

  let transition;
  require(`${ROOT}/config/firebase`).auth.currentUser = { uid: 'owner-b' };
  await act(async () => {
    transition = coordinator.coordinateAuthPrincipalChange({ user: { uid: 'owner-b' }, loading: false });
    await ticks();
  });
  // The flush is pending and the old scope is still active for preservation,
  // but the private UI is already isolated.
  expect(coordinator.getHandoffStatus().transitionPending).toBe(true);
  expect(gate.getBootstrapGateState().phase).toBe('active');
  expect(gate.getBootstrapGateState().handoffPending).toBe(true);
  expect(ui.queryByText('A private pending inventory')).toBeNull();

  await act(async () => {
    blocked.resolve();
    if (transition.completion) await transition.completion;
  });
  expect(coordinator.getHandoffStatus().lastResult.blocked).toBe(false);
  expect(gate.getBootstrapGateState().scope.scopeId).toBe('owner-b');
});

test('R2-4 an ordinary successful handoff still completes', async () => {
  const { A, gate, switchTo } = harness();
  const store = require(`${ROOT}/store/inventoryStore`).default;
  const { registerScopedStoreHandoff, getScopedStoreEngine } = require(`${ROOT}/persistence/scopedStoreStorage`);
  const coordinator = require(`${ROOT}/persistence/handoff/accountHandoffCoordinator`);
  switchTo(A);
  registerScopedStoreHandoff({ familyId: 'core.inventory', store, label: 'r2-normal' });
  store.setState({ items: [{ id: 'clean-handoff' }] });
  await getScopedStoreEngine('core.inventory').__flush();

  require(`${ROOT}/config/firebase`).auth.currentUser = { uid: 'owner-b' };
  const transition = coordinator.coordinateAuthPrincipalChange({ user: { uid: 'owner-b' }, loading: false });
  if (transition.completion) await transition.completion;

  const status = coordinator.getHandoffStatus();
  expect(status.lastResult.blocked).toBe(false);
  expect(status.activeScope && status.activeScope.scopeId).toBe('owner-b');
  expect(gate.getBootstrapGateState().handoffPending).toBe(false);
});

/* ========================= R3 — STALE SNAPSHOT COHORTS ===================== */

const forkPayloadsFor = (familyId, selector) => {
  const { parseP5ScopedKey } = require(`${ROOT}/persistence/keyFormat`);
  const payloads = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const parsed = parseP5ScopedKey(key);
    if (!parsed || parsed.familyId !== familyId || (parsed.segments || []).length === 0) continue;
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      const payload = raw && raw.payload;
      if (payload) payloads.push(selector ? selector(payload) : payload);
    } catch (_error) { /* ignore */ }
  }
  return payloads;
};

test('R3-1 two queued stale inventory snapshots keep the winner; a fresh save succeeds', async () => {
  const { A, switchTo } = harness();
  const store = require(`${ROOT}/store/inventoryStore`).default;
  const { createScopedStoreStorage, getScopedStoreEngine } = require(`${ROOT}/persistence/scopedStoreStorage`);
  switchTo(A);
  const engine = getScopedStoreEngine('core.inventory');
  store.setState({ items: [{ id: 'baseline' }] });
  await engine.__flush();

  const other = createScopedStoreStorage({ familyId: 'core.inventory' });
  other.getItem('inventory-storage');
  other.setItem('inventory-storage', { state: { items: [{ id: 'concurrent-winner' }] }, version: 0 });
  await other.__flush();

  store.setState({ items: [{ id: 'stale-one' }] });
  store.setState({ items: [{ id: 'stale-two' }] });
  await engine.__flush();

  expect(read('core.inventory', A).value.payload.state.items).toEqual([{ id: 'concurrent-winner' }]);
  const forks = forkPayloadsFor('core.inventory', (p) => p.state && p.state.items).flat();
  expect(forks.some((i) => i.id === 'stale-one')).toBe(true);
  expect(forks.some((i) => i.id === 'stale-two')).toBe(true);

  // Fresh authorized rehydration, then a legitimate successor save.
  engine.getItem('inventory-storage');
  store.setState({ items: [{ id: 'authorized-successor' }] });
  await engine.__flush();
  expect(read('core.inventory', A).value.payload.state.items).toEqual([{ id: 'authorized-successor' }]);
});

test('R3-2 two queued stale roster snapshots keep the winner; a fresh save succeeds', async () => {
  const { A } = harness();
  const roster = require(`${ROOT}/persistence/characterScopedStorage`);
  await roster.saveRoster(false, [{ id: 'baseline' }]);
  roster.loadRoster(false);
  const before = read('character.roster', A);
  await require(`${ROOT}/persistence/scopedConsumer`).saveScopedDraft({
    familyId: 'character.roster',
    payload: [{ id: 'concurrent-winner' }],
    expectedRevision: before.value.localRevision,
    expectedDraftId: before.value.draftId
  });
  await Promise.all([
    roster.saveRoster(false, [{ id: 'stale-one' }]),
    roster.saveRoster(false, [{ id: 'stale-two' }])
  ]);
  await ticks();

  expect(read('character.roster', A).value.payload).toEqual([{ id: 'concurrent-winner' }]);
  const forks = forkPayloadsFor('character.roster');
  expect(forks.some((list) => Array.isArray(list) && list.some((c) => c.id === 'stale-one'))).toBe(true);
  expect(forks.some((list) => Array.isArray(list) && list.some((c) => c.id === 'stale-two'))).toBe(true);

  roster.loadRoster(false);
  await roster.saveRoster(false, [{ id: 'authorized-successor' }]);
  await ticks();
  expect(read('character.roster', A).value.payload).toEqual([{ id: 'authorized-successor' }]);
});

test('R3-3 two queued stale saved-map snapshots keep the winner; a fresh save succeeds', async () => {
  const { A } = harness();
  const saved = require(`${ROOT}/persistence/mapSavedStorage`);
  await saved.saveSavedMaps([{ id: 'baseline' }]);
  saved.loadSavedMaps();
  const before = read('core.savedMaps', A);
  await require(`${ROOT}/persistence/scopedConsumer`).saveScopedDraft({
    familyId: 'core.savedMaps',
    payload: [{ id: 'concurrent-winner' }],
    expectedRevision: before.value.localRevision,
    expectedDraftId: before.value.draftId
  });
  await Promise.all([
    saved.saveSavedMaps([{ id: 'stale-one' }]),
    saved.saveSavedMaps([{ id: 'stale-two' }])
  ]);
  await ticks();

  expect(read('core.savedMaps', A).value.payload).toEqual([{ id: 'concurrent-winner' }]);
  const forks = forkPayloadsFor('core.savedMaps');
  expect(forks.some((list) => Array.isArray(list) && list.some((m) => m.id === 'stale-one'))).toBe(true);
  expect(forks.some((list) => Array.isArray(list) && list.some((m) => m.id === 'stale-two'))).toBe(true);

  saved.loadSavedMaps();
  await saved.saveSavedMaps([{ id: 'authorized-successor' }]);
  await ticks();
  expect(read('core.savedMaps', A).value.payload).toEqual([{ id: 'authorized-successor' }]);
});

/* ====================== R4 — CUSTOM-MAP PHYSICAL IDS ======================= */

function installControllableIdb() {
  const stored = new Map();
  const openings = [];
  const db = {
    transaction: () => {
      const tx = {
        oncomplete: null, onerror: null, onabort: null,
        objectStore: () => ({
          put(value) {
            stored.set(value.id, JSON.parse(JSON.stringify(value)));
            Promise.resolve().then(() => tx.oncomplete && tx.oncomplete());
          },
          delete(key) { stored.delete(key); },
          getAll() {
            const request = { result: [] };
            Promise.resolve().then(() => request.onsuccess && request.onsuccess());
            return request;
          }
        })
      };
      return tx;
    }
  };
  Object.defineProperty(window, 'indexedDB', {
    configurable: true,
    value: { open() { const request = {}; openings.push(request); return request; } }
  });
  const flushOpenings = () => {
    while (openings.length > 0) {
      const request = openings.shift();
      if (request.onsuccess) request.onsuccess({ target: { result: db } });
    }
  };
  return { stored, openings, db, flushOpenings };
}

test('R4-1 two owners with the same region id keep distinct recoverable images', async () => {
  const { A, B, switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  await ticks();
  const { stored, flushOpenings } = installControllableIdb();
  const regionId = 'frostwood-reach';

  switchTo(B);
  const savingB = maps.saveCustomMap({ id: regionId, regionId, name: 'B Region', image: 'B-full-image' });
  flushOpenings();
  await savingB;
  expect(maps.getCustomMaps()[regionId].image).toBe('B-full-image');

  switchTo(A);
  const savingA = maps.saveCustomMap({ id: regionId, regionId, name: 'A Region', image: 'A-full-image' });
  switchTo(B);
  flushOpenings();
  await savingA;

  // B's full image is byte-identical and B still enumerates only its own map.
  expect(stored.get(regionId).image).toBe('B-full-image');
  expect(maps.getCustomMaps()[regionId].image).toBe('B-full-image');
  expect(maps.getSubregionMap(regionId).name).toBe('B Region');
  const mirrorRaw = localStorage.getItem('mythrill_custom_subregion_maps');
  expect(mirrorRaw).toContain('B-full-image');
  expect(mirrorRaw).toContain('A-full-image');
  // A's record is recoverable but not exposed to B; the superseded save did
  // not grant ownership.
  const aRecord = [...stored.values()].find((r) => r.image === 'A-full-image');
  expect(aRecord).toBeTruthy();
  expect(aRecord.id).not.toBe(regionId);
  expect(Object.values(maps.getCustomMaps()).some((m) => m.image === 'A-full-image')).toBe(false);
  switchTo(A);
  expect(maps.getSubregionMap(regionId)).toBeNull();

  // A re-saves while verified: the record becomes owned and readable again.
  const resaving = maps.saveCustomMap({ id: regionId, regionId, name: 'A Region', image: 'A-full-image' });
  flushOpenings();
  await resaving;
  expect(maps.getSubregionMap(regionId).image).toBe('A-full-image');
});

test('R4-2 a placeholder fallback never crosses owner identity', async () => {
  const { B, switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  await ticks();
  const { stored, flushOpenings } = installControllableIdb();
  const regionId = 'frostwood-reach';
  const original = Storage.prototype.setItem;
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
    if (key === 'mythrill_custom_subregion_maps' && String(value).includes('data:image/')) throw new Error('QuotaExceededError');
    return original.call(this, key, value);
  });

  switchTo(B);
  const savingB = maps.saveCustomMap({ id: regionId, regionId, name: 'B Private Map', image: 'data:image/png;base64,BPRIVATE' });
  flushOpenings();
  await savingB;
  switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
  const savingA = maps.saveCustomMap({ id: regionId, regionId, name: 'A Private Map Name', description: 'A secret map notes', image: 'data:image/png;base64,APRIVATE' });
  switchTo(B);
  flushOpenings();
  await savingA;

  // Normal startup: mirror import while the full IndexedDB read is pending.
  Object.defineProperty(window, 'indexedDB', { configurable: true, value: { open() { return {}; } } });
  let visible;
  jest.isolateModules(() => {
    const startupGate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
    const startupMaps = require(`${ROOT}/data/subregionMaps`);
    require(`${ROOT}/config/firebase`).auth.currentUser = { uid: 'owner-b' };
    startupGate.activatePrivateScope(B);
    visible = startupMaps.getCustomMaps();
    expect(startupMaps.getSubregionMap(regionId).name).toBe('B Private Map');
  });
  expect(Object.values(visible).some((m) => m.name === 'A Private Map Name')).toBe(false);
  expect(Object.values(visible).some((m) => m.description === 'A secret map notes')).toBe(false);
  // The full A payload remains recoverable in IndexedDB.
  expect([...stored.values()].some((r) => r.image === 'data:image/png;base64,APRIVATE')).toBe(true);
});

test('R4-3 unknown-owner maps remain protected and recoverable', async () => {
  localStorage.setItem('mythrill_custom_subregion_maps', JSON.stringify({
    'legacy-custom': { id: 'legacy-custom', name: 'Legacy Map', image: 'legacy-bytes', regionId: 'region-z' }
  }));
  const { switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  await ticks();
  switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));
  expect(maps.getCustomMaps()['legacy-custom']).toBeUndefined();
  expect(await maps.deleteCustomMap('legacy-custom')).toBe(false);
  expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('legacy-bytes');
});

test('R4-5 collision then same-owner logical updates reuse one physical record; read and delete work', async () => {
  localStorage.setItem('mythrill_custom_subregion_maps', JSON.stringify({
    'legacy-custom': { id: 'legacy-custom', name: 'Legacy Map', image: 'legacy-bytes', regionId: 'region-z' }
  }));
  const { switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  await ticks();
  const { stored, flushOpenings } = installControllableIdb();
  const regionId = 'frostwood-reach';
  const scopeA = require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a');
  const scopeB = require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-b');

  switchTo(scopeB);
  const savingB = maps.saveCustomMap({ id: regionId, regionId, name: 'B Region', image: 'B-full-image' });
  flushOpenings();
  await savingB;
  const bRecordBefore = JSON.stringify(stored.get(regionId));

  switchTo(scopeA);
  const savingA1 = maps.saveCustomMap({ id: regionId, regionId, name: 'A Region', image: 'A-image-v1' });
  flushOpenings();
  const a1 = await savingA1;
  expect(a1).toBeTruthy();
  expect(a1.id).not.toBe(regionId);

  const savingA2 = maps.saveCustomMap({ id: regionId, regionId, name: 'A Region', image: 'A-image-v2' });
  flushOpenings();
  const a2 = await savingA2;
  // Repeated updates reuse the owner's one physical record (no endless IDs).
  expect(a2.id).toBe(a1.id);
  expect(maps.getSubregionMap(regionId).image).toBe('A-image-v2');
  expect(Object.values(maps.getCustomMaps()).some((m) => m.image === 'A-image-v2')).toBe(true);
  expect(Object.values(maps.getCustomMaps()).some((m) => m.image === 'A-image-v1')).toBe(false);

  const savingA3 = maps.saveCustomMap({ id: regionId, regionId, name: 'A Region', image: 'A-image-v3' });
  flushOpenings();
  const a3 = await savingA3;
  expect(a3.id).toBe(a1.id);
  expect(maps.getSubregionMap(regionId).image).toBe('A-image-v3');

  const deleting = maps.deleteCustomMap(regionId);
  flushOpenings();
  expect(await deleting).toBe(true);
  expect(maps.getSubregionMap(regionId)).toBeNull();
  expect(Object.values(maps.getCustomMaps())).toEqual([]);

  // B's original image stays byte-identical and is fully accessible again.
  switchTo(scopeB);
  const bRecord = maps.getSubregionMap(regionId);
  expect(bRecord.name).toBe('B Region');
  expect(bRecord.image).toBe('B-full-image');
  expect(JSON.stringify(stored.get(regionId))).toBe(bRecordBefore);
  // Unknown-owner records remain untouched recovery sources.
  expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('legacy-bytes');
});

test('R4-6 preserved owner duplicates resolve canonically and unpublish without destroying older bytes', async () => {
  const younger = 'dup-region::owner:user:owner-a:1700000000000';
  const elder = 'dup-region::owner:user:owner-a';
  localStorage.setItem('mythrill_custom_subregion_maps', JSON.stringify({
    [elder]: { id: elder, regionId: 'dup-region', name: 'Older Duplicate', image: 'older-bytes', updatedAt: '2026-01-01T00:00:00.000Z' },
    [younger]: { id: younger, regionId: 'dup-region', name: 'Newer Duplicate', image: 'newer-bytes', updatedAt: '2026-01-02T00:00:00.000Z' }
  }));
  const { switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  const ownership = require(`${ROOT}/persistence/customMapOwnership`);
  await ticks();
  const { stored, flushOpenings } = installControllableIdb();
  switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));

  const mirrored = JSON.parse(localStorage.getItem('mythrill_custom_subregion_maps'));
  stored.set(elder, mirrored[elder]);
  stored.set(younger, mirrored[younger]);
  ownership.recordCustomMapOwnership(elder, mirrored[elder]);
  ownership.recordCustomMapOwnership(younger, mirrored[younger]);

  // Canonical resolution: the newer referenced record, not the first result.
  expect(maps.getSubregionMap('dup-region').image).toBe('newer-bytes');
  expect(Object.values(maps.getCustomMaps()).map((m) => m.name)).toEqual(['Newer Duplicate']);

  // A subsequent save updates the canonical record in place.
  const updating = maps.saveCustomMap({ id: 'dup-region', regionId: 'dup-region', name: 'Updated Map', image: 'updated-bytes' });
  flushOpenings();
  const updated = await updating;
  expect(updated.id).toBe(younger);
  expect(maps.getSubregionMap('dup-region').image).toBe('updated-bytes');

  // Logical deletion removes the active map and unpublishes the older
  // duplicate without destroying the preserved payload.
  const deleting = maps.deleteCustomMap('dup-region');
  flushOpenings();
  expect(await deleting).toBe(true);
  expect(maps.getSubregionMap('dup-region')).toBeNull();
  expect(Object.values(maps.getCustomMaps())).toEqual([]);
  expect(ownership.isCustomMapOwned(elder, mirrored[elder])).toBe(false);
  expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('older-bytes');
  expect([...stored.values()].some((m) => m.image === 'older-bytes')).toBe(true);
  expect([...stored.values()].some((m) => m.image === 'updated-bytes')).toBe(false);
});

test('R4-4 same-owner custom-map save/read/update/delete works normally', async () => {
  const { switchTo } = harness();
  const maps = require(`${ROOT}/data/subregionMaps`);
  await ticks();
  const { stored, flushOpenings } = installControllableIdb();
  const regionId = 'owned-region';
  switchTo(require(`${ROOT}/persistence/scopeModel`).createUserScope('owner-a'));

  const first = maps.saveCustomMap({ id: regionId, regionId, name: 'Own Map', image: 'full-image' });
  flushOpenings();
  await first;
  expect(maps.getSubregionMap(regionId).name).toBe('Own Map');
  expect(stored.get(regionId).image).toBe('full-image');

  // Update under the same owner keeps the same physical identity.
  const updated = maps.saveCustomMap({ id: regionId, regionId, name: 'Own Map v2', image: 'full-image-v2' });
  flushOpenings();
  await updated;
  expect(maps.getSubregionMap(regionId).name).toBe('Own Map v2');
  expect(stored.get(regionId).image).toBe('full-image-v2');

  const deleting = maps.deleteCustomMap(regionId);
  flushOpenings();
  expect(await deleting).toBe(true);
  expect(maps.getCustomMaps()[regionId]).toBeUndefined();
});
