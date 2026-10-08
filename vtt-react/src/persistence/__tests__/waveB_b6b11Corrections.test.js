/**
 * P5 Wave B B6–B11 corrections — permanent regressions.
 *
 * Production-path tests for: the constrained versionless campaign upgrade
 * rule, scoped authored map geometry, custom-map IndexedDB ownership capture,
 * scoped room-state action bars, non-destructive conversion transfer
 * consumption, and scoped named filter presets.
 *
 * Controlled doubles are used only at the network/browser boundary
 * (firestore, auth, IndexedDB, roomService); storage engines, geometry
 * modules, room-state/action-bar services and the real components are the
 * production modules.
 */

const ROOT = 'D:/VTT/vtt-react/src';
const fsModule = require('fs');

jest.mock('D:/VTT/vtt-react/src/config/firebase', () => ({
  db: {}, isFirebaseConfigured: true, isDemoMode: false,
  auth: {
    currentUser: { uid: 'owner-a' },
    onAuthStateChanged: (cb) => { cb({ uid: 'owner-a', displayName: 'Owner A', email: 'a@example.com' }); return () => {}; }
  }
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

describe('B6 — constrained versionless campaign upgrade', () => {
  const rules = fsModule.readFileSync('D:/VTT/firestore.rules', 'utf8');

  it('B6-1 the campaign rule provides only a constrained legacy upgrade branch', () => {
    expect(rules).toContain('function validLegacyCampaignSource(data)');
    expect(rules).toContain('function validLegacyCampaignUpgrade()');
    // legacy source must not already carry a schema and must hold a campaign list
    expect(rules).toContain("!('schemaVersion' in data)");
    expect(rules).toContain('data.campaigns is list');
    // exact preservation of collection + selection, revision 1 only
    expect(rules).toContain('request.resource.data.cloudRevision == 1');
    expect(rules).toContain('request.resource.data.campaigns == resource.data.campaigns');
    expect(rules).toContain('request.resource.data.currentCampaignId == resource.data.currentCampaignId');
    // ordinary v1 CAS intact and no blanket worldbuilding write bypass
    expect(rules).toContain('request.resource.data.cloudEpoch == resource.data.cloudEpoch');
    expect(rules).toContain('request.resource.data.cloudRevision == resource.data.cloudRevision + 1');
    expect(rules).toContain("document != 'campaigns'");
    expect(rules).not.toContain('match /users/{userId}/worldbuilding/{document=**}');
  });

  it('B6-2 the client upgrade writes exactly the rule-accepted envelope', async () => {
    const { createCampaignCloudService } = require(`${ROOT}/services/campaignCloudService`);
    const writes = [];
    const legacyData = {
      campaigns: [{ id: 'legacy-campaign', name: 'Legacy' }],
      currentCampaignId: 'legacy-campaign'
    };
    const service = createCampaignCloudService({
      db: {},
      isFirebaseConfigured: true,
      firestore: {
        doc: (...args) => args.slice(1).join('/'),
        getDoc: jest.fn(),
        setDoc: jest.fn(),
        runTransaction: async (_db, cb) => cb({
          get: async () => ({ exists: () => true, data: () => legacyData }),
          set: (_ref, value) => { writes.push(value); }
        })
      }
    });
    const result = await service.upgradeLegacyCampaignCloud({ userId: 'owner-a', expectedFingerprint: null });
    expect(result.ok).toBe(true);
    expect(writes).toHaveLength(1);
    const envelope = writes[0];
    expect(Object.keys(envelope).sort()).toEqual([
      'campaigns', 'cloudEpoch', 'cloudRevision', 'currentCampaignId', 'schemaVersion', 'updatedAt'
    ]);
    expect(envelope.campaigns).toEqual(legacyData.campaigns);
    expect(envelope.currentCampaignId).toBe('legacy-campaign');
    expect(envelope.cloudRevision).toBe(1);
    expect(typeof envelope.cloudEpoch).toBe('string');
    expect(envelope.cloudEpoch.length).toBeGreaterThan(0);
    expect('unrelatedLegacyField' in envelope).toBe(false);
  });

  it('B6-3 the upgrade refuses documents that are already versioned', async () => {
    const { createCampaignCloudService } = require(`${ROOT}/services/campaignCloudService`);
    const service = createCampaignCloudService({
      db: {},
      isFirebaseConfigured: true,
      firestore: {
        doc: (...args) => args.slice(1).join('/'),
        getDoc: jest.fn(),
        setDoc: jest.fn(),
        runTransaction: async (_db, cb) => cb({
          get: async () => ({
            exists: () => true,
            data: () => ({ schemaVersion: 1, campaigns: [], currentCampaignId: null, cloudRevision: 2, cloudEpoch: 'epoch-x' })
          }),
          set: jest.fn()
        })
      }
    });
    const result = await service.upgradeLegacyCampaignCloud({ userId: 'owner-a', expectedFingerprint: null });
    expect(result.ok).toBe(false);
    expect(result.result).toBe('REFUSED');
  });
});

describe('B7 — private authored geometry', () => {
  it('B7-1 import-time initialization does not adopt unknown-owner global geometry', () => {
    const regionModule = require(`${ROOT}/data/regionPolygons`);
    const id = Object.keys(regionModule.REGION_POLYGONS)[0];
    const authoredPoints = [[123, 456], [321, 654], [111, 222]];
    const legacyRaw = JSON.stringify({ [id]: { points: authoredPoints, labelPosition: [123, 456] } });
    localStorage.setItem('mythrill_region_polygons', legacyRaw);

    require(`${ROOT}/components/world-map/WorldMapImmerse`);

    expect(regionModule.REGION_POLYGONS[id].points).not.toEqual(authoredPoints);
    expect(localStorage.getItem('mythrill_region_polygons')).toBe(legacyRaw);
  });

  it('B7-2 A authored geometry never hydrates under B and returns for A', async () => {
    const { A, B, switchTo } = harness();
    const geometry = require(`${ROOT}/data/geometryScopeHydration`);
    const { REGION_POLYGONS } = require(`${ROOT}/data/regionPolygons`);
    const id = Object.keys(REGION_POLYGONS)[0];
    const authoredPoints = [[10, 20], [30, 40], [50, 60]];

    switchTo(A);
    geometry.resetGeometryToPublicSeeds();
    REGION_POLYGONS[id].points = authoredPoints;
    REGION_POLYGONS[id].description = 'A authored description';
    expect((await geometry.persistAuthoredGeometry()).status).toBe('OK');
    expect(readRecord('map.geometryMixed', A).status).toBe('PRESENT_VALID');

    switchTo(B);
    geometry.hydrateGeometryForActiveOwner();
    expect(REGION_POLYGONS[id].points).not.toEqual(authoredPoints);
    expect(readRecord('map.geometryMixed', B).status).toBe('MISSING');

    // B edits and resets the map (authorized B-authored work).
    REGION_POLYGONS[id].points = [[1, 1], [2, 2], [3, 3]];
    await geometry.persistAuthoredGeometry();
    geometry.resetGeometryToPublicSeeds();
    await geometry.persistAuthoredGeometry();

    switchTo(A);
    geometry.hydrateGeometryForActiveOwner();
    expect(REGION_POLYGONS[id].points).toEqual(authoredPoints);
    expect(REGION_POLYGONS[id].description).toBe('A authored description');
  });

  it('B7-3 legacy global geometry is preserved and never destructively cleaned', () => {
    const regionModule = require(`${ROOT}/data/regionPolygons`);
    const id = Object.keys(regionModule.REGION_POLYGONS)[0];
    const legacyRaw = JSON.stringify({ [id]: { points: [[7, 7], [8, 8], [9, 9]], labelPosition: [7, 7] } });
    localStorage.setItem('mythrill_region_polygons', legacyRaw);
    localStorage.setItem('mythrill_drawn_geometry_version', 'some-old-version');

    require(`${ROOT}/components/world-map/WorldMapImmerse`);

    expect(localStorage.getItem('mythrill_region_polygons')).toBe(legacyRaw);
    expect(localStorage.getItem('mythrill_drawn_geometry_version')).toBe('some-old-version');
  });
});

describe('B8 — custom-map IndexedDB ownership race', () => {
  it('B8-1 a delayed A save never grants B ownership and stays recoverable', async () => {
    const { B, switchTo } = harness();
    const maps = require(`${ROOT}/data/subregionMaps`);
    await ticks();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });

    let pendingRequest;
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      value: { open() { pendingRequest = {}; return pendingRequest; } }
    });

    const saved = maps.saveCustomMap({ id: 'a-map', name: 'Private A Map', image: 'data:image/png;base64,AAAA' });
    switchTo(B);
    pendingRequest.onsuccess({ target: { result: { transaction: () => ({ objectStore: () => ({ put: () => {} }) }) } } });
    await saved;

    expect(maps.getCustomMaps()['a-map']).toBeUndefined();
    expect(maps.getSubregionMap('a-map')).toBeFalsy();
    expect(readRecord('map.subregionCache', B, ['a-map']).status).toBe('MISSING');
    // The raw payload remains recoverable in the shared mirror.
    expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('a-map');
    delete window.indexedDB;
  });

  it('B8-2 normal A-owned custom-map save, read and delete still work', async () => {
    const { switchTo } = harness();
    const dbStub = {
      transaction: () => ({ objectStore: () => ({ put: () => {}, getAll: () => ({ onsuccess: null }), delete: () => {} }) })
    };
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      value: {
        open() {
          const request = {};
          setTimeout(() => { if (request.onsuccess) request.onsuccess({ target: { result: dbStub } }); }, 0);
          return request;
        }
      }
    });
    const maps = require(`${ROOT}/data/subregionMaps`);
    await ticks();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });

    await maps.saveCustomMap({ id: 'own-map', name: 'Own Map', image: 'full-image' });
    expect(Object.keys(maps.getCustomMaps())).toContain('own-map');
    expect(maps.getSubregionMap('own-map').name).toBe('Own Map');
    expect(await maps.deleteCustomMap('own-map')).toBe(true);
    expect(maps.getCustomMaps()['own-map']).toBeUndefined();
    delete window.indexedDB;
  });

  it('B8-3 unknown-owner legacy maps remain protected', async () => {
    localStorage.setItem('mythrill_custom_subregion_maps', JSON.stringify({
      'legacy-custom': { id: 'legacy-custom', name: 'Legacy Map', image: 'legacy-image' }
    }));
    const { switchTo } = harness();
    const maps = require(`${ROOT}/data/subregionMaps`);
    await ticks();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });

    expect(maps.getCustomMaps()['legacy-custom']).toBeUndefined();
    expect(await maps.deleteCustomMap('legacy-custom')).toBe(false);
    expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('legacy-custom');
  });
});

describe('B9 — room-state action bars', () => {
  it('B9-1 A and B share a character id but never share layouts', async () => {
    const { A, B, switchTo } = harness();
    const roomState = require(`${ROOT}/services/roomStateService`).default;
    const fs = require('firebase/firestore');
    fs.getDoc.mockResolvedValue({ exists: () => false });

    switchTo(A);
    await roomState.applyPlayerState({ actionBar: [{ id: 'a-slot' }] }, 'shared-char');
    expect(readRecord('character.actionBar', A, ['shared-char', 'global']).status).toBe('PRESENT_VALID');
    expect(localStorage.getItem('mythrill-actionbar-shared-char')).toBeNull();

    switchTo(B);
    const collected = await roomState.collectPlayerState('shared-char');
    expect(collected.actionBar).toBeNull();
  });

  it('B9-2 same-owner room-state save and restore still work', async () => {
    const { switchTo } = harness();
    const roomState = require(`${ROOT}/services/roomStateService`).default;
    const fs = require('firebase/firestore');
    fs.getDoc.mockResolvedValue({ exists: () => false });
    const A = { scopeKind: 'user', scopeId: 'owner-a' };

    switchTo(A);
    await roomState.applyPlayerState({ actionBar: [{ id: 'slot-1' }, { id: 'slot-2' }] }, 'char-restore');
    const collected = await roomState.collectPlayerState('char-restore');
    expect(collected.actionBar.map((slot) => slot.id)).toEqual(['slot-1', 'slot-2']);
  });
});

describe('B10 — conversion transfer survives until consumed', () => {
  const mountLobby = async (socket) => {
    jest.doMock('D:/VTT/vtt-react/src/services/roomService', () => ({
      getUserRooms: jest.fn().mockResolvedValue([]),
      createPersistentRoom: jest.fn().mockResolvedValue('persist-1')
    }));
    const React = require('react');
    const { render, act } = require('@testing-library/react/pure');
    const { MemoryRouter } = require('react-router-dom');
    const Lobby = require(`${ROOT}/components/multiplayer/RoomLobby`).default;
    const character = require(`${ROOT}/store/characterStore`).default;
    const authStore = require(`${ROOT}/store/authStore`).default;
    character.setState({ characters: [{ id: 'c1', name: 'Hero' }], currentCharacterId: 'c1' });
    authStore.setState({ user: { uid: 'owner-a' } });
    let ui;
    await act(async () => {
      ui = render(React.createElement(MemoryRouter, null, React.createElement(Lobby, { socket })));
      await ticks();
    });
    return ui;
  };

  it('B10-1 mount and creation retain the source for S8 while emitting its game state', async () => {
    const { switchTo } = harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    conversion.saveConversionTransfer({
      name: 'Local Conversion', description: 'A draft',
      gameState: { privateMap: true }, originalRoomId: 'local-room'
    });

    const emit = jest.fn();
    const socket = { connected: true, id: 's1', emit, on: jest.fn(), once: jest.fn(), off: jest.fn() };
    const ui = await mountLobby(socket);

    expect(conversion.loadConversionTransfer()).not.toBeNull();

    const { fireEvent, act, cleanup } = require('@testing-library/react/pure');
    await act(async () => {
      fireEvent.click(ui.getByText(/Create Permanent Room/));
      await ticks();
      await ticks();
    });

    expect(emit).toHaveBeenCalledWith('create_room', expect.objectContaining({
      isConverted: true,
      gameState: expect.objectContaining({ privateMap: true })
    }));
    // A socket request is not durability confirmation and must not delete source.
    expect(conversion.loadConversionTransfer()).toEqual(expect.objectContaining({ originalRoomId: 'local-room', gameState: { privateMap: true } }));
    cleanup();
  });

  it('B10-2 an interrupted creation keeps the preserved transfer', async () => {
    const { switchTo } = harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    conversion.saveConversionTransfer({
      name: 'Interrupted Conversion', description: 'A draft',
      gameState: { privateMap: true }, originalRoomId: 'local-room'
    });

    const emit = jest.fn(() => { throw new Error('socket down'); });
    const socket = { connected: true, id: 's1', emit, on: jest.fn(), once: jest.fn(), off: jest.fn() };
    const ui = await mountLobby(socket);

    const { fireEvent, act, cleanup } = require('@testing-library/react/pure');
    await act(async () => {
      fireEvent.click(ui.getByText(/Create Permanent Room/));
      await ticks();
      await ticks();
    });

    expect(conversion.loadConversionTransfer()).not.toBeNull();
    cleanup();
  });

  it('B10-3 B cannot consume A preserved transfer', () => {
    const { switchTo } = harness();
    const conversion = require(`${ROOT}/persistence/localRoomConversionScoped`);
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    conversion.saveConversionTransfer({ name: 'A Conversion', originalRoomId: 'local-1' });
    switchTo({ scopeKind: 'user', scopeId: 'owner-b' });
    expect(conversion.loadConversionTransfer()).toBeNull();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    expect(conversion.loadConversionTransfer()).not.toBeNull();
  });
});

describe('B11 — private named filter presets', () => {
  const library = {
    filters: { query: 'A private query', categories: [] },
    categories: [], spells: [], sortOrder: { field: 'name', direction: 'asc' }
  };
  const renderFilters = () => {
    jest.doMock('D:/VTT/vtt-react/src/components/spellcrafting-wizard/context/SpellLibraryContext', () => ({
      useSpellLibrary: () => library,
      useSpellLibraryDispatch: () => jest.fn(),
      libraryActionCreators: {}
    }));
    const React = require('react');
    const { render } = require('@testing-library/react/pure');
    const Filters = require(`${ROOT}/components/spellcrafting-wizard/components/library/LibraryFilters`).default;
    return render(React.createElement(Filters));
  };

  it('B11-1 presets are owner-isolated across a live handoff and recover for A', async () => {
    const { switchTo } = harness();
    const { fireEvent, act, cleanup } = require('@testing-library/react/pure');
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const ui = renderFilters();

    fireEvent.click(ui.container.querySelector('.add-preset-btn'));
    fireEvent.change(ui.getByPlaceholderText('Preset name'), { target: { value: 'A Secret Plan' } });
    fireEvent.click(ui.getByText('Save'));
    expect(ui.getByText('A Secret Plan')).toBeTruthy();

    await act(async () => { switchTo({ scopeKind: 'user', scopeId: 'owner-b' }); await ticks(); });
    expect(ui.queryByText('A Secret Plan')).toBeNull();

    fireEvent.click(ui.container.querySelector('.add-preset-btn'));
    fireEvent.change(ui.getByPlaceholderText('Preset name'), { target: { value: 'B Plan' } });
    fireEvent.click(ui.getByText('Save'));
    expect(ui.getByText('B Plan')).toBeTruthy();

    await act(async () => { switchTo({ scopeKind: 'user', scopeId: 'owner-a' }); await ticks(); });
    expect(ui.getByText('A Secret Plan')).toBeTruthy();
    expect(ui.queryByText('B Plan')).toBeNull();
    cleanup();
  });

  it('B11-2 global legacy presets are preserved but never adopted', () => {
    const legacyRaw = JSON.stringify([{ id: 'legacy-1', name: 'Legacy Preset', filters: { query: 'legacy secret' } }]);
    localStorage.setItem('spellLibraryFilterPresets', legacyRaw);
    const { switchTo } = harness();
    switchTo({ scopeKind: 'user', scopeId: 'owner-a' });
    const ui = renderFilters();

    expect(ui.queryByText('Legacy Preset')).toBeNull();
    expect(localStorage.getItem('spellLibraryFilterPresets')).toBe(legacyRaw);
    const { cleanup } = require('@testing-library/react/pure');
    cleanup();
  });
});
