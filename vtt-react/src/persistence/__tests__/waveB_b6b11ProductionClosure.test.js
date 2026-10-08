/** Remaining B6-B11 production cases, added before their source corrections. */
const ROOT = 'D:/VTT/vtt-react/src';
jest.mock('../../config/firebase', () => ({
  db: {}, isFirebaseConfigured: true, isDemoMode: false,
  auth: { currentUser: { uid: 'owner-a' }, onAuthStateChanged: cb => {
    cb({ uid: 'owner-a', displayName: 'Owner A' }); return () => {};
  } }
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn((...args) => args.slice(1).join('/')), getDoc: jest.fn(), setDoc: jest.fn(),
  collection: jest.fn(), addDoc: jest.fn(), getDocs: jest.fn(), query: jest.fn(), where: jest.fn(),
  orderBy: jest.fn(), limit: jest.fn(), deleteDoc: jest.fn(), onSnapshot: jest.fn(() => () => {})
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn(() => () => {}) }));
const ticks = async () => { for (let i = 0; i < 16; i += 1) await Promise.resolve(); };
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function harness() {
  const gate = require('../bootstrapPrivacyGate');
  const { createUserScope } = require('../scopeModel');
  const A = createUserScope('owner-a'), B = createUserScope('owner-b');
  gate.resetBootstrapGateForTests();
  gate.activatePrivateScope(A);
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', { configurable: true, value: {
    request(name, options, callback) {
      const run = (tails.get(name) || Promise.resolve()).then(() => (typeof options === 'function' ? options : callback)({ name }));
      tails.set(name, run.catch(() => {})); return run;
    }
  } });
  const switchTo = scope => { gate.clearToSignedOut(); gate.activatePrivateScope(scope); };
  return { gate, A, B, switchTo };
}
beforeEach(() => { jest.restoreAllMocks(); jest.resetModules(); localStorage.clear(); sessionStorage.clear(); });
afterEach(() => {
  const { cleanup } = require('@testing-library/react/pure'); cleanup();
  delete window.indexedDB;
});

describe('B6 legacy source validation', () => {
  test.each([
    ['invalid selection', { campaigns: [], currentCampaignId: 42 }],
    ['unrecognized authored field', { campaigns: [], privateNotes: 'only recoverable source' }],
    ['partially versioned source', { campaigns: [], cloudRevision: 20 }]
  ])('B6 refuses %s without changing the source', async (_label, data) => {
    const { createCampaignCloudService, fingerprintCloudData } = require('../../services/campaignCloudService');
    const set = jest.fn();
    const service = createCampaignCloudService({ db: {}, isFirebaseConfigured: true, firestore: {
      doc: jest.fn(), runTransaction: async (_db, cb) => cb({
        get: async () => ({ exists: () => true, data: () => data }), set
      })
    } });
    const result = await service.upgradeLegacyCampaignCloud({ userId: 'owner-a', expectedFingerprint: fingerprintCloudData(data) });
    expect(result.ok).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });
});

test('B7 the real shared projection removes all authored-only fields on owner change', async () => {
  const { A, B, switchTo } = harness();
  const geometry = require('../../data/geometryScopeHydration');
  const { REGION_POLYGONS } = require('../../data/regionPolygons');
  const id = Object.keys(REGION_POLYGONS)[0];
  switchTo(A); geometry.hydrateGeometryForActiveOwner();
  REGION_POLYGONS[id].description = 'A private region description';
  REGION_POLYGONS[id].privateAnnotation = 'A secret layout detail';
  await geometry.persistAuthoredGeometry();
  switchTo(B); geometry.hydrateGeometryForActiveOwner();
  expect(REGION_POLYGONS[id]).toEqual(geometry.PUBLIC_SEEDS.regions[id]);
});

test('B7 a delayed real DevEditor confirmation cannot author geometry under B', () => {
  const { A, B, switchTo } = harness();
  const React = require('react'); const { render, fireEvent } = require('@testing-library/react/pure');
  const geometry = require('../../data/geometryScopeHydration');
  const { REGION_POLYGONS } = require('../../data/regionPolygons');
  const id = Object.keys(REGION_POLYGONS)[0];
  const Editor = require('../../components/world-map/DevEditor').default;
  switchTo(A); geometry.hydrateGeometryForActiveOwner();
  let confirm;
  const ui = render(React.createElement(Editor, {
    devMode: true, devTool: 'drawRegion', currentRegion: id, drawingPoints: [[1, 1], [2, 2], [3, 3]],
    setDrawingPoints: jest.fn(), setCurrentRegion: jest.fn(), setDevTool: jest.fn(),
    currentCampaign: null, activeMapId: 'mythril', cursorPos: { x: 0, y: 0 },
    showConfirm: (_message, callback) => { confirm = callback; }, onUpdate: jest.fn()
  }));
  const finish = ui.getByText(/Complete Boundary/);
  fireEvent.click(finish);
  expect(typeof confirm).toBe('function');
  switchTo(B); geometry.hydrateGeometryForActiveOwner();
  confirm();
  expect(REGION_POLYGONS[id]).toEqual(geometry.PUBLIC_SEEDS.regions[id]);
});

test('B9 real deferred room-state application cannot write A layout under B', async () => {
  const { A, B, switchTo } = harness();
  const room = require('../../services/roomStateService').default;
  require('firebase/firestore').setDoc.mockResolvedValue();
  switchTo(A);
  const applying = room.applyPlayerState({ actionBar: [{ id: 'private-a-slot' }] }, 'same-character', 'room-a');
  switchTo(B);
  await applying;
  const { readScopedRecord } = require('../safeRead');
  expect(readScopedRecord({ familyId: 'character.actionBar', scope: B, locator: ['same-character', 'global'] }).status).toBe('MISSING');
  expect(readScopedRecord({ familyId: 'character.actionBar', scope: B, locator: ['same-character', 'room-a'] }).status).toBe('MISSING');
});

test('B8 normal saves expose ownership only after the IndexedDB transaction commits', async () => {
  const { A, switchTo } = harness(); const maps = require('../../data/subregionMaps'); await ticks(); switchTo(A);
  let opening;
  const tx = { oncomplete: null, onabort: null, onerror: null, objectStore: () => ({ put: () => ({}) }) };
  Object.defineProperty(window, 'indexedDB', { configurable: true, value: { open: () => { opening = {}; return opening; } } });
  let settled = false;
  const save = maps.saveCustomMap({ id: 'committing-map', name: 'Commit Map', image: 'full-image' }).then(value => { settled = true; return value; });
  opening.onsuccess({ target: { result: { transaction: () => tx } } }); await ticks();
  expect(settled).toBe(false);
  expect(maps.getCustomMaps()['committing-map']).toBeUndefined();
  tx.oncomplete(); await save;
  expect(maps.getCustomMaps()['committing-map'].image).toBe('full-image');
});

test('B8 captures immutable nested payload before delayed database opening', async () => {
  const { A, switchTo } = harness(); const maps = require('../../data/subregionMaps'); await ticks(); switchTo(A);
  let opening;
  const put = jest.fn();
  Object.defineProperty(window, 'indexedDB', { configurable: true, value: { open: () => { opening = {}; return opening; } } });
  const payload = { id: 'immutable-map', image: 'full-image', subregions: [{ id: 'zone', points: [[1, 2]] }] };
  const save = maps.saveCustomMap(payload);
  payload.subregions[0].points[0][0] = 99;
  opening.onsuccess({ target: { result: { transaction: () => ({ objectStore: () => ({ put }) }) } } });
  await save;
  expect(put.mock.calls[0][0].subregions[0].points).toEqual([[1, 2]]);
});

test('B9 room-state collection validates verified owner rather than a stale auth-storage marker', async () => {
  const { B, switchTo } = harness();
  const room = require('../../services/roomStateService').default;
  const firestore = require('firebase/firestore');
  firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ actionSlots: [{ id: 'private-a-slot' }] }) });
  switchTo(B); localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { uid: 'owner-a' } } }));
  const collected = await room.collectPlayerState('same-character', 'room-b');
  expect(collected.actionBar).toBeNull();
  expect(firestore.getDoc).not.toHaveBeenCalled();
});

async function mountLobby(socket, creating = Promise.resolve('destination-room')) {
  jest.doMock('../../services/roomService', () => ({ getUserRooms: jest.fn().mockResolvedValue([]), createPersistentRoom: jest.fn(() => creating) }));
  const React = require('react'); const { render, act } = require('@testing-library/react/pure');
  const { MemoryRouter } = require('react-router-dom');
  const Lobby = require('../../components/multiplayer/RoomLobby').default;
  require('../../store/authStore').default.setState({ user: { uid: 'owner-a' }, isAuthInitialized: true, isAuthenticated: true });
  require('../../store/characterStore').default.setState({ characters: [{ id: 'char', name: 'Hero' }], currentCharacterId: 'char' });
  await require('../handoff/accountHandoffCoordinator').whenHandoffIdle();
  const gate = require('../bootstrapPrivacyGate');
  gate.clearToSignedOut(); gate.activatePrivateScope(require('../scopeModel').createUserScope('owner-a'));
  let ui;
  await act(async () => { ui = render(React.createElement(MemoryRouter, null, React.createElement(Lobby, { socket }))); await ticks(); });
  return ui;
}
const socketStub = () => ({ connected: true, id: 'socket-a', emit: jest.fn(), on: jest.fn(), once: jest.fn(), off: jest.fn() });

test('B10 an emitted creation request retains the transfer for S8 rather than deleting its source', async () => {
  const { A, switchTo } = harness();
  const transfer = require('../localRoomConversionScoped');
  switchTo(A); transfer.saveConversionTransfer({ name: 'A conversion', description: 'A draft', gameState: { secret: 'A map' }, originalRoomId: 'local-a' });
  const socket = socketStub(); const ui = await mountLobby(socket);
  expect(ui.getByText('Create Permanent Room').disabled).toBe(false);
  const { act, fireEvent } = require('@testing-library/react/pure');
  await act(async () => { fireEvent.click(ui.getByText('Create Permanent Room')); await ticks(); });
  expect(socket.emit).toHaveBeenCalledWith('create_room', expect.objectContaining({ isConverted: true, gameState: { secret: 'A map' } }));
  expect(transfer.loadConversionTransfer()).toEqual(expect.objectContaining({ originalRoomId: 'local-a', gameState: { secret: 'A map' } }));
});

test('B10 a handoff during room creation prevents a late converted emit and preserves A transfer', async () => {
  const { A, B, switchTo } = harness(); const transfer = require('../localRoomConversionScoped');
  switchTo(A); transfer.saveConversionTransfer({ name: 'A conversion', description: 'A draft', gameState: { secret: 'A map' }, originalRoomId: 'local-a' });
  const pending = deferred(), socket = socketStub(); const ui = await mountLobby(socket, pending.promise);
  const { act, fireEvent } = require('@testing-library/react/pure');
  await act(async () => { fireEvent.click(ui.getByText('Create Permanent Room')); await ticks(); });
  await act(async () => { switchTo(B); pending.resolve('destination-room'); await ticks(); });
  expect(socket.emit.mock.calls.filter(([event]) => event === 'create_room')).toHaveLength(0);
  expect(transfer.loadConversionTransfer()).toBeNull();
  switchTo(A); expect(transfer.loadConversionTransfer()).not.toBeNull();
});

test('B11 a live handoff retires an unsaved private preset-name draft too', async () => {
  jest.doMock('../../components/spellcrafting-wizard/context/SpellLibraryContext', () => ({
    useSpellLibrary: () => ({ filters: { query: '', categories: [] }, spells: [], categories: [], sortOrder: {} }),
    useSpellLibraryDispatch: () => jest.fn(), libraryActionCreators: {}
  }));
  const { A, B, switchTo } = harness(); const React = require('react');
  const { render, fireEvent, act } = require('@testing-library/react/pure');
  const Filters = require('../../components/spellcrafting-wizard/components/library/LibraryFilters').default;
  switchTo(A); const ui = render(React.createElement(Filters));
  fireEvent.click(ui.container.querySelector('.add-preset-btn'));
  fireEvent.change(ui.getByPlaceholderText('Preset name'), { target: { value: 'A private unsaved name' } });
  await act(async () => { switchTo(B); await ticks(); });
  const input = ui.queryByPlaceholderText('Preset name');
  expect(input ? input.value : '').toBe('');
});

test('B7 real DevEditor saves A boundary; B resets its own boundary; A recovers', async () => {
  const { A, B, switchTo } = harness();
  const React = require('react'); const { render, fireEvent } = require('@testing-library/react/pure');
  const geometry = require('../../data/geometryScopeHydration');
  const { flushGeometryWrites } = require('../mapGeometryScopedStorage');
  const { REGION_POLYGONS } = require('../../data/regionPolygons');
  const id = Object.keys(REGION_POLYGONS)[0];
  const Editor = require('../../components/world-map/DevEditor').default;
  const props = { devMode: true, devTool: 'drawRegion', currentRegion: id, drawingPoints: [[1, 1], [2, 2], [3, 3]],
    setDrawingPoints: jest.fn(), setCurrentRegion: jest.fn(), setDevTool: jest.fn(), activeMapId: 'mythril',
    cursorPos: { x: 0, y: 0 }, currentCampaign: null, showConfirm: (_text, callback) => callback(),
    // WorldMapImmerse's actual onUpdate persists the shared authored snapshot.
    onUpdate: () => geometry.persistAuthoredGeometry() };
  switchTo(A); geometry.hydrateGeometryForActiveOwner();
  REGION_POLYGONS[id].description = 'A private description';
  const ui = render(React.createElement(Editor, props));
  fireEvent.click(ui.getByText(/Complete Boundary/)); await flushGeometryWrites();
  switchTo(B); geometry.hydrateGeometryForActiveOwner();
  ui.rerender(React.createElement(Editor, props));
  fireEvent.click(ui.getByText(/Reset Code Default/)); await flushGeometryWrites();
  switchTo(A); geometry.hydrateGeometryForActiveOwner();
  expect(REGION_POLYGONS[id].points).toEqual([[1, 1], [2, 2], [3, 3]]);
  expect(REGION_POLYGONS[id].description).toBe('A private description');
});

test('B7 a malformed scoped geometry source cannot be replaced by a default snapshot', async () => {
  const { A } = harness(); const { buildScopedKey } = require('../keyFormat');
  const key = buildScopedKey({ scope: A, familyId: 'map.geometryMixed' });
  localStorage.setItem(key, '{only-recoverable-copy');
  const geometry = require('../../data/geometryScopeHydration');
  geometry.hydrateGeometryForActiveOwner();
  const saved = await geometry.persistAuthoredGeometry();
  expect(saved.status).not.toBe('OK');
  expect(localStorage.getItem(key)).toBe('{only-recoverable-copy');
});

test('B9 room resource identity separates authorized layouts for the same character', async () => {
  const { A, switchTo } = harness(); const room = require('../../services/roomStateService').default;
  require('firebase/firestore').getDoc.mockResolvedValue({ exists: () => false });
  require('firebase/firestore').setDoc.mockResolvedValue(); switchTo(A);
  await room.applyPlayerState({ actionBar: [{ id: 'room-one-slot' }] }, 'shared-character', 'room-one');
  await room.applyPlayerState({ actionBar: [{ id: 'room-two-slot' }] }, 'shared-character', 'room-two');
  expect((await room.collectPlayerState('shared-character', 'room-one')).actionBar[0].id).toBe('room-one-slot');
  expect((await room.collectPlayerState('shared-character', 'room-two')).actionBar[0].id).toBe('room-two-slot');
  expect(await room.applyPlayerState({ actionBar: { characterId: 'different', actionSlots: [] } }, 'shared-character', 'room-one')).toBe(false);
});

test('B10 a temporary conversion emits the preserved state and retains its source', async () => {
  const { A, switchTo } = harness(); const transfer = require('../localRoomConversionScoped');
  switchTo(A); transfer.saveConversionTransfer({ name: 'Temporary conversion', description: 'A draft', originalRoomId: 'local-a', gameState: { terrain: 'A' } });
  const socket = socketStub(); const ui = await mountLobby(socket);
  const { fireEvent } = require('@testing-library/react/pure'); fireEvent.click(ui.getByText('Create Temporary Room'));
  expect(socket.emit).toHaveBeenCalledWith('create_room', expect.objectContaining({ isConverted: true, gameState: { terrain: 'A' } }));
  expect(transfer.captureConversionTransfer()).toEqual(expect.objectContaining({ sourceDraftId: expect.any(String), sourceRoomId: 'local-a', payload: expect.any(Object) }));
});

test('B9 actual local-room autosave collects the active characters room-bound layout', async () => {
  const { A, switchTo } = harness();
  const local = require('../../services/localRoomService').default;
  const character = require('../../store/characterStore').default;
  const bars = require('../../services/actionBarPersistenceService').default;
  require('../../store/initStoreRegistry').initStoreRegistry();
  require('../../store/authStore').default.setState({ user: { uid: 'owner-a' }, isAuthInitialized: true });
  await require('../handoff/accountHandoffCoordinator').whenHandoffIdle();
  switchTo(A);
  character.setState({ characters: [{ id: 'char', name: 'Hero' }], currentCharacterId: 'char', activeCharacter: undefined });
  const room = local.createLocalRoom({ name: 'Local snapshot', characterId: 'char' });
  localStorage.setItem('selectedLocalRoomId', room.id); localStorage.setItem('isLocalRoom', 'true');
  require('firebase/firestore').getDoc.mockResolvedValue({ exists: () => false });
  bars.saveActionBarConfig('char', room.id, [{ id: 'authorized-room-slot' }]);
  const saved = await local.autoSaveCurrentRoom();
  expect(saved.status).toBe('OK');
  expect(local.loadPlayerStateScoped(room.id, 'char').actionBar[0].id).toBe('authorized-room-slot');
});
