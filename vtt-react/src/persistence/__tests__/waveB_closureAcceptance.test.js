/**
 * Project 5 Wave B closure — T1–T12 acceptance matrix.
 *
 * Uses genuine production readers/writers (scoped persistence modules,
 * characterSyncService, characterBackupService, actionBarPersistenceService,
 * mapAnnotationService, libraryManager, subregionMaps) — not helper-only
 * simulations.
 */

import {
  activatePrivateScope,
  clearToSignedOut,
  resetBootstrapGateForTests
} from '../bootstrapPrivacyGate';
import { createUserScope } from '../scopeModel';
import {
  captureConsumerContext,
  loadScopedNative,
  saveScopedNative,
  saveScopedDraft
} from '../scopedConsumer';
import { getScopedStoreEngine } from '../scopedStoreStorage';
import {
  loadCustomSpells,
  saveCustomSpells,
  resetSpellLibraryScopedStorageForTests
} from '../spellLibraryScopedStorage';
import { createScopedNativeFamily } from '../scopedNativeFamily';
import {
  saveConversionTransfer,
  loadConversionTransfer,
  clearConversionTransfer,
  resetConversionTransferForTests
} from '../localRoomConversionScoped';
import { clearPendingJoinState } from '../handoff/socketPrincipalRetirement';
import { loadLibraryFromStorage } from '../../components/spellcrafting-wizard/core/utils/libraryManager';
import { getPrimaryStarterMap } from '../../data/subregionMaps';
import mapAnnotationService from '../../services/mapAnnotationService';
import actionBarPersistenceService from '../../services/actionBarPersistenceService';
import characterBackupService from '../../services/firebase/characterBackupService';
import characterSyncService from '../../services/firebase/characterSyncService';
// Import side effects: register the production persist engines.
import useItemStore from '../../store/itemStore';
import useSpellbookStore from '../../store/spellbookStore';
import useMapStore from '../../store/mapStore';

void useItemStore;
void useSpellbookStore;
void useMapStore;

const A = createUserScope('user-a');
const B = createUserScope('user-b');

const LEGACY_BACKUP_KEY = 'mythrill-backup-char-1-1111111111111';

/** Real account handoff shape: retire the current scope, then activate next. */
function switchTo(scope) {
  clearToSignedOut();
  activatePrivateScope(scope);
}

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

describe('Wave B closure — T1–T12 acceptance', () => {
  let restoreLocks;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetBootstrapGateForTests();
    resetSpellLibraryScopedStorageForTests();
    resetConversionTransferForTests();
    restoreLocks = installFakeLocks(serializingLockManager());
  });

  afterEach(() => {
    restoreLocks();
    jest.restoreAllMocks();
    characterSyncService.isOnline = true;
    characterBackupService.isConfigured = true;
  });

  it('T1: custom items/spells never appear under B and A recovers them', async () => {
    const itemsEngine = getScopedStoreEngine('library.items');
    expect(itemsEngine).toBeTruthy();

    activatePrivateScope(A);
    saveCustomSpells([{ id: 'a-spell', name: 'A Spark' }]);
    itemsEngine.setItem('item-store', { state: { customItems: [{ id: 'a-item' }] }, version: 0 });
    await itemsEngine.__flush();

    switchTo(B);
    expect(loadCustomSpells()).toEqual([]);
    expect(itemsEngine.getItem('item-store')).toBeNull();

    switchTo(A);
    expect(loadCustomSpells()).toEqual([{ id: 'a-spell', name: 'A Spark' }]);
    expect(itemsEngine.getItem('item-store')).toEqual({
      state: { customItems: [{ id: 'a-item' }] },
      version: 0
    });
  });

  it('T2: late spellbook callbacks cannot hydrate or write under a different account', async () => {
    const spellbookEngine = getScopedStoreEngine('library.spellbook');
    expect(spellbookEngine).toBeTruthy();

    activatePrivateScope(A);
    const staleContext = captureConsumerContext();
    expect(staleContext.ok).toBe(true);

    switchTo(B);
    const refused = await saveScopedDraft({
      familyId: 'library.spellbook',
      payload: { state: { leaked: true }, version: 0 },
      context: staleContext.context
    });
    expect(refused.status).toBe('CONTEXT_REFUSED');
    expect(spellbookEngine.getItem('spellbook-storage')).toBeNull();
  });

  it('T3: entity graph nodes, edges and faction layouts are owner-isolated', () => {
    const nodesFamily = createScopedNativeFamily({ familyId: 'graph.entitiesNodes', fallback: [] });
    const edgesFamily = createScopedNativeFamily({ familyId: 'graph.entitiesEdges', fallback: [] });
    const layoutFamily = createScopedNativeFamily({ familyId: 'graph.factionLayout' });

    activatePrivateScope(A);
    nodesFamily.save([{ id: 'a-node' }]);
    edgesFamily.save([{ id: 'a-edge' }]);
    layoutFamily.save({ f1: [10, 20] }, ['mythrill']);

    switchTo(B);
    expect(nodesFamily.load()).toEqual([]);
    expect(edgesFamily.load()).toEqual([]);
    expect(layoutFamily.load(['mythrill'])).toBeNull();

    switchTo(A);
    expect(nodesFamily.load()).toEqual([{ id: 'a-node' }]);
    expect(edgesFamily.load()).toEqual([{ id: 'a-edge' }]);
    expect(layoutFamily.load(['mythrill'])).toEqual({ f1: [10, 20] });
  });

  it('T4: map annotations, notes and authored geometry remain account-isolated', () => {
    const notesFamily = createScopedNativeFamily({ familyId: 'map.notes' });

    activatePrivateScope(A);
    mapAnnotationService.saveLocalPins('user-a', [{ id: 'pin-a' }]);
    mapAnnotationService.saveLocalAreas('user-a', [{ id: 'area-a' }]);
    notesFamily.save('A notes', ['notes']);

    switchTo(B);
    expect(mapAnnotationService.getLocalPins('user-a')).toEqual([]);
    expect(mapAnnotationService.getLocalAreas('user-a')).toEqual([]);
    expect(notesFamily.load(['notes'])).toBeNull();

    switchTo(A);
    expect(mapAnnotationService.getLocalPins('user-a')).toEqual([{ id: 'pin-a' }]);
    expect(mapAnnotationService.getLocalAreas('user-a')).toEqual([{ id: 'area-a' }]);
    expect(notesFamily.load(['notes'])).toBe('A notes');
  });

  it('T5: matching character/room ids cannot share action bars or hotkeys across owners', async () => {
    activatePrivateScope(A);
    actionBarPersistenceService.saveActionBarConfig('char-1', 'room-1', [{ id: 'slot-a' }]);
    actionBarPersistenceService.saveHotkeys('char-1', 'room-1', { 0: 'KEY_A' });

    const aSlots = await actionBarPersistenceService.loadActionBarConfig('char-1', 'room-1');
    expect(aSlots.map((slot) => slot.id)).toEqual(['slot-a']);
    expect(actionBarPersistenceService.loadHotkeys('char-1', 'room-1')).toEqual({ 0: 'KEY_A' });

    switchTo(B);
    expect(await actionBarPersistenceService.loadActionBarConfig('char-1', 'room-1')).toBeNull();
    expect(actionBarPersistenceService.loadHotkeys('char-1', 'room-1')).toBeNull();

    switchTo(A);
    const recoveredSlots = await actionBarPersistenceService.loadActionBarConfig('char-1', 'room-1');
    expect(recoveredSlots.map((slot) => slot.id)).toEqual(['slot-a']);
    expect(actionBarPersistenceService.loadHotkeys('char-1', 'room-1')).toEqual({ 0: 'KEY_A' });
  });

  it('T6: A offline queue cannot replay under B and A retains the pending source', () => {
    activatePrivateScope(A);
    characterSyncService.isOnline = false;
    characterSyncService.queueChange('char-1', 'update_character', { hp: 5 });
    expect(characterSyncService.loadOfflineChanges()).toHaveLength(1);

    switchTo(B);
    characterSyncService.isOnline = false;
    expect(characterSyncService.loadOfflineChanges()).toEqual([]);
    characterSyncService.queueChange('char-b', 'update_character', { hp: 9 });
    expect(characterSyncService.loadOfflineChanges()).toHaveLength(1);

    switchTo(A);
    expect(characterSyncService.loadOfflineChanges()).toHaveLength(1);
    expect(characterSyncService.loadOfflineChanges()[0].characterId).toBe('char-1');
  });

  it('T7: unknown-owner backup is preserved but never automatically adopted', async () => {
    const legacyBackup = {
      backupId: LEGACY_BACKUP_KEY,
      characterId: 'char-1',
      characterData: { name: 'A Secret', hp: 12 },
      backupReason: 'manual',
      createdAt: new Date().toISOString(),
      version: 'v1'
    };
    localStorage.setItem(LEGACY_BACKUP_KEY, JSON.stringify(legacyBackup));

    characterBackupService.isConfigured = false;
    activatePrivateScope(B);

    const listed = await characterBackupService.listBackups('char-1', 'user-b');
    expect(listed).toEqual([]);

    const restored = await characterBackupService.restoreFromBackup(LEGACY_BACKUP_KEY, 'char-1', 'user-b');
    expect(restored.success).toBe(false);

    // Raw unknown-owner source preserved exactly
    expect(localStorage.getItem(LEGACY_BACKUP_KEY)).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(LEGACY_BACKUP_KEY)).characterData.name).toBe('A Secret');
  });

  it('T8: account handoff retires private room/GM/conversion selectors', () => {
    localStorage.setItem('selectedRoomId', 'room-a');
    localStorage.setItem('isGMResume', 'true');
    localStorage.setItem('resumeRoomName', 'A Room');
    localStorage.setItem('isTestRoom', 'true');
    localStorage.setItem('isWorldBuilderMode', 'true');
    localStorage.setItem('autoCreateTestRoom', 'false');
    localStorage.setItem('lastJoinedRoom', 'room-a');
    localStorage.setItem('lastCreatedRoom', 'room-a');
    localStorage.setItem('roomDataChanged', 'true');
    localStorage.setItem('isLocalRoom', 'true');
    localStorage.setItem('selectedLocalRoomId', 'local-room-a');

    clearPendingJoinState();

    for (const key of [
      'selectedRoomId',
      'isGMResume',
      'resumeRoomName',
      'isTestRoom',
      'isWorldBuilderMode',
      'autoCreateTestRoom',
      'lastJoinedRoom',
      'lastCreatedRoom',
      'roomDataChanged',
      'isLocalRoom',
      'selectedLocalRoomId'
    ]) {
      expect(localStorage.getItem(key)).toBeNull();
    }

    // Conversion transfer is retained for its owner, invisible to B.
    activatePrivateScope(A);
    saveConversionTransfer({ name: 'A conversion', originalRoomId: 'local-1' });
    switchTo(B);
    expect(loadConversionTransfer()).toBeNull();
    switchTo(A);
    expect(loadConversionTransfer()).toEqual({ name: 'A conversion', originalRoomId: 'local-1' });
    clearConversionTransfer();
    expect(loadConversionTransfer()).toBeNull();
  });

  it('T9: late library/map/graph callbacks cannot write under B', async () => {
    const mapEngine = getScopedStoreEngine('core.mapWorking');
    expect(mapEngine).toBeTruthy();

    activatePrivateScope(A);
    saveCustomSpells([{ id: 'a-late' }]);
    const staleContext = captureConsumerContext();
    expect(staleContext.ok).toBe(true);

    switchTo(B);
    const accepted = characterSyncService.saveOfflineChanges(staleContext);
    expect(accepted).toBe(false);
    expect(characterSyncService.loadOfflineChanges()).toEqual([]);

    const refusedDraft = await saveScopedDraft({
      familyId: 'core.mapWorking',
      payload: { state: { leakedProjection: true }, version: 0 },
      context: staleContext.context
    });
    expect(refusedDraft.status).toBe('CONTEXT_REFUSED');
    expect(mapEngine.getItem('map-store')).toBeNull();
    expect(loadCustomSpells()).toEqual([]);
  });

  it('T10: malformed, unknown-owner and quota-failed sources remain recoverable', () => {
    localStorage.setItem('spell_library_data', '{not-json');
    activatePrivateScope(A);

    const defaults = loadLibraryFromStorage();
    expect(Array.isArray(defaults.spells)).toBe(true);
    expect(localStorage.getItem('spell_library_data')).toBe('{not-json');

    expect(actionBarPersistenceService.saveActionBarConfig('char-quota', 'room-1', [{ id: 'keep-me' }])).toBe(true);
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const saved = actionBarPersistenceService.saveActionBarConfig('char-quota', 'room-1', [{ id: 'should-fail' }]);
    setItemSpy.mockRestore();
    expect(saved).toBe(false);

    const configs = actionBarPersistenceService.getAllCharacterConfigs('char-quota');
    expect(configs['room-1'].actionSlots.map((slot) => slot.id)).toEqual(['keep-me']);
  });

  it('T11: public built-in spells and map defaults still initialize', () => {
    activatePrivateScope(A);

    const defaults = loadLibraryFromStorage();
    expect(Array.isArray(defaults.spells)).toBe(true);
    expect(defaults).toHaveProperty('categories');
    expect(defaults).toHaveProperty('filters');
    expect(defaults).toHaveProperty('sortOrder');

    const starter = getPrimaryStarterMap();
    expect(starter.isDefault).toBe(true);
    expect(starter.id).toBe('mythril');
    expect(typeof starter.image).toBe('string');
  });

  it('T12: previous core isolation and room-projection preservation still pass', async () => {
    const mapEngine = getScopedStoreEngine('core.mapWorking');
    expect(mapEngine).toBeTruthy();

    activatePrivateScope(A);
    mapEngine.__suspendWrites();
    mapEngine.setItem('map-store', { state: { roomProjection: true }, version: 0 });
    await mapEngine.__flush();
    expect(mapEngine.getItem('map-store')).toBeNull();

    mapEngine.__resumeWrites();
    mapEngine.setItem('map-store', { state: { authoredSandbox: true }, version: 0 });
    await mapEngine.__flush();
    expect(mapEngine.getItem('map-store')).toEqual({
      state: { authoredSandbox: true },
      version: 0
    });
  });
});
