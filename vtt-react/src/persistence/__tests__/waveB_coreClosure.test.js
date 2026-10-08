/**
 * Project 5 Wave B core closure — map/chat/cooldown scoping, sandbox vs room
 * projection boundary and IndexedDB custom-map ownership (G-series).
 */

import useMapStore from '../../store/mapStore';
import useChatStore from '../../store/chatStore';
import useGameStore from '../../store/gameStore';
import {
  registerScopedStoreHandoff,
  getScopedStoreEngine
} from '../scopedStoreStorage';
import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import { createUserScope } from '../scopeModel';
import { readScopedRecord, READ_STATUS } from '../safeRead';
import { findQuarantineReceipt } from '../scopedConsumer';
import { fingerprintRawString } from '../preservation';
import { applyRoomSnapshot } from '../../services/silentRoomHydration';
import { exitRoomProjection, resetMapProjectionBoundaryForTests } from '../mapProjectionBoundary';
import {
  appendSavedMap,
  loadSavedMaps,
  resetMapSavedStorageForTests
} from '../mapSavedStorage';
import {
  saveCooldowns,
  loadCooldowns,
  resetCombatScopedStorageForTests
} from '../combatScopedStorage';

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

const ticks = async (count = 8) => {
  for (let index = 0; index < count; index += 1) await Promise.resolve();
};

let restoreLocks;
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  resetBootstrapGateForTests();
  resetMapSavedStorageForTests();
  resetCombatScopedStorageForTests();
  resetMapProjectionBoundaryForTests();
  restoreLocks = installFakeLocks(serializingLockManager());
});

afterEach(() => {
  restoreLocks();
});

describe('Wave B core closure — map working state', () => {
  it('map working state is owner-isolated: B never sees A, A recovers authored work', async () => {
    const reset = registerScopedStoreHandoff({ familyId: 'core.mapWorking', store: useMapStore, label: 'map-closure' });
    const engine = getScopedStoreEngine('core.mapWorking');
    const A = createUserScope('map-owner-a');
    const B = createUserScope('map-owner-b');

    activatePrivateScope(A);
    await useMapStore.persist.rehydrate();
    useMapStore.setState({ maps: [{ id: 'authored-a', name: 'A Sandbox' }], currentMapId: 'authored-a' });
    await engine.__flush();
    expect(useMapStore.getState().maps.some((map) => map.id === 'authored-a')).toBe(true);

    reset();
    clearToSignedOut();
    activatePrivateScope(B);
    await useMapStore.persist.rehydrate();
    expect(useMapStore.getState().maps.some((map) => map.id === 'authored-a')).toBe(false);

    reset();
    clearToSignedOut();
    activatePrivateScope(A);
    await useMapStore.persist.rehydrate();
    expect(useMapStore.getState().maps.some((map) => map.id === 'authored-a')).toBe(true);
  });

  it('legacy malformed map-store content is preserved and quarantined, never adopted', async () => {
    const malformedRaw = '{not-json';
    localStorage.setItem('map-store', malformedRaw);
    const A = createUserScope('map-malformed-a');

    activatePrivateScope(A);
    await useMapStore.persist.rehydrate();

    expect(localStorage.getItem('map-store')).toBe(malformedRaw);
    const fingerprint = fingerprintRawString(malformedRaw).value;
    expect(findQuarantineReceipt({
      scope: A,
      sourceKey: 'map-store',
      fingerprintValue: fingerprint
    })).not.toBeNull();
  });
});

describe('Wave B core closure — sandbox vs room projection', () => {
  it('room hydration never persists the server projection as an authored draft and exits restore the sandbox', async () => {
    const reset = registerScopedStoreHandoff({ familyId: 'core.mapWorking', store: useMapStore, label: 'map-projection' });
    const engine = getScopedStoreEngine('core.mapWorking');
    const A = createUserScope('projection-owner-a');

    activatePrivateScope(A);
    await useMapStore.persist.rehydrate();
    useMapStore.setState({ maps: [{ id: 'authored-sandbox', name: 'Authored Sandbox' }], currentMapId: 'authored-sandbox' });
    await engine.__flush();

    const authoredBefore = readScopedRecord({ familyId: 'core.mapWorking', scope: A });
    expect(authoredBefore.status).toBe(READ_STATUS.PRESENT_VALID);
    expect(authoredBefore.value.payload.state.maps.some((map) => map.id === 'authored-sandbox')).toBe(true);

    // Server room snapshot (production path).
    const result = applyRoomSnapshot({
      gameState: {
        maps: { 'room-map-1': { id: 'room-map-1', name: 'Room Map', terrainData: { t: 1 } } },
        defaultMapId: 'room-map-1'
      },
      activeMapId: 'room-map-1',
      scope: 'room'
    });
    expect(result.applied).toBe(true);
    expect(useMapStore.getState().maps.some((map) => map.id === 'room-map-1')).toBe(true);

    // A later projection change must still not become an authored write.
    useMapStore.setState({ currentMapId: 'room-map-1' });
    await engine.__flush();
    await ticks();
    const authoredAfter = readScopedRecord({ familyId: 'core.mapWorking', scope: A });
    expect(authoredAfter.raw).toBe(authoredBefore.raw);

    // Leaving the room restores the authored sandbox state.
    exitRoomProjection();
    await ticks();
    expect(useMapStore.getState().maps.some((map) => map.id === 'authored-sandbox')).toBe(true);
    expect(useMapStore.getState().maps.some((map) => map.id === 'room-map-1')).toBe(false);
    reset();
  });
});

describe('Wave B core closure — saved authored maps', () => {
  it('saved maps are owner-isolated and recoverable on return', async () => {
    const A = createUserScope('saved-owner-a');
    const B = createUserScope('saved-owner-b');

    activatePrivateScope(A);
    await appendSavedMap({ name: 'Map_A', data: { terrainData: { a: 1 } } });
    expect(loadSavedMaps().map((entry) => entry.name)).toEqual(['Map_A']);

    clearToSignedOut();
    activatePrivateScope(B);
    expect(loadSavedMaps()).toEqual([]);

    clearToSignedOut();
    activatePrivateScope(A);
    expect(loadSavedMaps().map((entry) => entry.name)).toEqual(['Map_A']);
  });

  it('a stale async save after handoff is refused without mutating the saved list', async () => {
    const A = createUserScope('saved-stale-a');
    const B = createUserScope('saved-stale-b');

    activatePrivateScope(A);
    await appendSavedMap({ name: 'Map_Base', data: {} });
    const before = readScopedRecord({ familyId: 'core.savedMaps', scope: A });

    // Block the lock so the next save is queued, then hand off.
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    restoreLocks();
    restoreLocks = installFakeLocks({
      request(name, optionsOrCallback, maybeCallback) {
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
        return gate.then(() => callback({ name }));
      }
    });

    const pending = appendSavedMap({ name: 'Map_Stale', data: {} });
    clearToSignedOut();
    activatePrivateScope(B);
    release();

    const result = await pending;
    expect(result.status).toBe('CONTEXT_REFUSED');
    const after = readScopedRecord({ familyId: 'core.savedMaps', scope: A });
    expect(after.raw).toBe(before.raw);
    expect(JSON.parse(after.raw).payload.length).toBe(1);
  });
});

describe('Wave B core closure — chat and cooldowns', () => {
  it('chat history is owner-isolated across handoff', async () => {
    const reset = registerScopedStoreHandoff({ familyId: 'core.chat', store: useChatStore, label: 'chat-closure' });
    const engine = getScopedStoreEngine('core.chat');
    const A = createUserScope('chat-owner-a');
    const B = createUserScope('chat-owner-b');

    activatePrivateScope(A);
    await useChatStore.persist.rehydrate();
    useChatStore.setState((state) => ({
      notifications: { ...state.notifications, social: [{ id: 'msg-a', content: 'A secret' }] }
    }));
    await engine.__flush();
    expect(useChatStore.getState().notifications.social.some((m) => m.id === 'msg-a')).toBe(true);

    reset();
    clearToSignedOut();
    activatePrivateScope(B);
    await useChatStore.persist.rehydrate();
    expect(useChatStore.getState().notifications.social.some((m) => m.id === 'msg-a')).toBe(false);
    expect(readScopedRecord({ familyId: 'core.chat', scope: B }).status).toBe(READ_STATUS.MISSING);

    reset();
    clearToSignedOut();
    activatePrivateScope(A);
    await useChatStore.persist.rehydrate();
    expect(useChatStore.getState().notifications.social.some((m) => m.id === 'msg-a')).toBe(true);
  });

  it('cooldowns are scoped by owner and room; legacy raw key is preserved and quarantined', () => {
    const legacyRaw = JSON.stringify({ 1: { cooldownType: 'turn_based' } });
    localStorage.setItem('gameStore-activeCooldowns', legacyRaw);

    const A = createUserScope('cd-owner-a');
    const B = createUserScope('cd-owner-b');

    activatePrivateScope(A);
    useGameStore.setState({ multiplayerRoom: { id: 'room-a' } });
    saveCooldowns('room-a', { 1: { cooldownType: 'turn_based', expiresAt: Date.now() + 60000 } });
    expect(loadCooldowns('room-a')).not.toBeNull();
    // A different room of the same owner must not see room-a's cooldowns.
    expect(loadCooldowns('room-b')).toBeNull();

    clearToSignedOut();
    activatePrivateScope(B);
    expect(loadCooldowns('room-a')).toBeNull();

    clearToSignedOut();
    activatePrivateScope(A);
    expect(loadCooldowns('room-a')).not.toBeNull();
    expect(localStorage.getItem('gameStore-activeCooldowns')).toBe(legacyRaw);
    const fingerprint = fingerprintRawString(legacyRaw).value;
    expect(findQuarantineReceipt({
      scope: A,
      sourceKey: 'gameStore-activeCooldowns',
      fingerprintValue: fingerprint
    })).not.toBeNull();
  });
});

describe('Wave B core closure — IndexedDB custom-map ownership', () => {
  /* eslint-disable global-require */
  it('unknown-owner custom maps are never adopted; owned saves are visible only to their owner', async () => {
    const legacyRecord = { id: 'legacy-custom', name: 'Legacy Map', image: 'full-image-bytes', regionId: 'region-z' };
    localStorage.setItem('mythrill_custom_subregion_maps', JSON.stringify({ 'legacy-custom': legacyRecord }));
    // Same module instance as the rest of the app: reload the mirror without
    // adopting anything into an owner scope.
    const maps = require('../../data/subregionMaps');
    maps.reloadCustomMapsFromMirror();

    const A = createUserScope('idb-owner-a');
    const B = createUserScope('idb-owner-b');

    // No active owner yet: nothing is exposed.
    expect(Object.keys(maps.getCustomMaps())).toEqual([]);
    expect(maps.getSubregionMap('legacy-custom')).toBeNull();

    activatePrivateScope(A);
    // Unknown-owner record is preserved but not adopted by A.
    expect(Object.keys(maps.getCustomMaps())).toEqual([]);
    expect(maps.getSubregionMap('legacy-custom')).toBeNull();
    expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('legacy-custom');

    // A saves a new custom map: owner-scoped reference makes it visible to A.
    await maps.saveCustomMap({ id: 'owned-map-a', name: 'A Map', image: 'full-a-image', regionId: 'region-a' });
    expect(Object.keys(maps.getCustomMaps())).toContain('owned-map-a');
    expect(maps.getSubregionMap('owned-map-a')).not.toBeNull();
    expect(maps.getSubregionMap('legacy-custom')).toBeNull();

    // B sees neither A's map nor the unknown-owner legacy record.
    clearToSignedOut();
    activatePrivateScope(B);
    expect(Object.keys(maps.getCustomMaps())).toEqual([]);
    expect(maps.getSubregionMap('owned-map-a')).toBeNull();

    // A returns and the full payload is still there (never placeholder-substituted).
    clearToSignedOut();
    activatePrivateScope(A);
    const recovered = maps.getSubregionMap('owned-map-a');
    expect(recovered.image).toBe('full-a-image');

    // Deleting an unknown-owner record is refused; the raw source survives.
    expect(await maps.deleteCustomMap('legacy-custom')).toBe(false);
    expect(localStorage.getItem('mythrill_custom_subregion_maps')).toContain('legacy-custom');

    // Deleting an owned record is allowed.
    expect(await maps.deleteCustomMap('owned-map-a')).toBe(true);
    expect(maps.getCustomMaps()['owned-map-a']).toBeUndefined();
  });
});
