// Local Room Service - Manages offline/local rooms using scoped storage
//
// Project 5 Wave B (S5.2): rooms and room state live in verified-owner scoped
// storage. Every save captures its destination (scope + account generation +
// room id + draft identity) BEFORE collecting working state and revalidates
// afterwards, so a room switch during collection can never write Room Y's
// state into Room X. Legacy global keys are recovery sources only: never
// adopted, never overwritten, never deleted by this service.
import roomStateService from './roomStateService';
import campaignService from './campaignService';
import { validateRoomName } from '../utils/validationUtils';
import {
  resolveActiveScope,
  captureConsumerContext,
  isConsumerContextCurrent,
  loadScopedDraft,
  saveScopedDraft,
  clearScopedNative,
  ensureLegacySourceQuarantine
} from '../persistence/scopedConsumer';
import { buildScopedKey } from '../persistence/keyFormat';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';

// Performance Optimization: Stores are now imported dynamically inside methods to avoid circular dependencies

const LEGACY_LOCAL_ROOMS_KEY = 'mythrill_local_rooms';
const LEGACY_LOCAL_ROOM_STATE_PREFIX = 'mythrill_local_room_state_';
const REGISTRY_FAMILY = 'localRoom.registry';
const STATE_FAMILY = 'localRoom.statePrimary';
const PLAYER_STATE_FAMILY = 'localRoom.playerState';

const clone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return value;
  }
};

/**
 * Local Room Service for offline gameplay.
 * Scoped rooms + captured-destination room-state saves.
 */
class LocalRoomService {
 constructor() {
  this.rooms = [];
  this.registryRevision = null;
  this.registryDraftId = null;
  this.scopeKey = null;
  this.quarantinedScopes = new Set();
  this.pendingPersist = Promise.resolve({ status: 'IDLE' });
  this.pendingStatePersist = Promise.resolve({ status: 'IDLE' });
  this.roomStateBaselines = new Map(); // roomId -> { revision, draftId }
  this.roomStateCache = new Map(); // roomId -> state (session cache)
 }

 _currentScopeKey() {
  const scope = resolveActiveScope();
  if (!scope) return null;
  return `${scope.scopeKind}:${scope.scopeId}:${getBootstrapGateState().accountGeneration}`;
 }

 _ensureLoaded() {
  const scopeKey = this._currentScopeKey();
  if (scopeKey !== this.scopeKey) {
   this.scopeKey = scopeKey;
   this.rooms = [];
   this.registryRevision = null;
   this.registryDraftId = null;
   this.roomStateBaselines = new Map();
   this.roomStateCache = new Map();
   if (scopeKey) this.loadRooms();
  }
 }

 /**
  * Load all local rooms for the active verified owner. Legacy global rooms
  * are quarantined (preserved) but never adopted.
  */
 loadRooms() {
  const scopeKey = this._currentScopeKey();
  if (scopeKey !== this.scopeKey) {
   this._ensureLoaded();
   return this.rooms;
  }
  const scope = resolveActiveScope();
  if (!scope) {
   this.rooms = [];
   return this.rooms;
  }
  this._quarantineLegacyOnce(scope);

  const read = loadScopedDraft({ familyId: REGISTRY_FAMILY });
  if (read.status === 'OK') {
   this.rooms = Array.isArray(read.payload) ? read.payload : [];
   this.registryRevision = read.localRevision;
   this.registryDraftId = read.draftId;
  } else {
   this.rooms = [];
   this.registryRevision = null;
   this.registryDraftId = null;
  }
  return this.rooms;
 }

 _quarantineLegacyOnce(scope) {
  const scopeKey = `${scope.scopeKind}:${scope.scopeId}`;
  if (this.quarantinedScopes.has(scopeKey)) return;
  this.quarantinedScopes.add(scopeKey);
  try {
   if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_LOCAL_ROOMS_KEY) !== null) {
    ensureLegacySourceQuarantine({
     legacyKey: LEGACY_LOCAL_ROOMS_KEY,
     familyId: REGISTRY_FAMILY,
     scope
    });
   }
  } catch (_error) {
   // best-effort preservation; legacy source stays untouched either way
  }
 }

 /**
  * Persist the room registry through scoped coordination.
  */
 async _persistRegistry() {
  const captured = captureConsumerContext();
  if (!captured.ok) {
   return { status: 'NO_ACTIVE_SCOPE', reason: captured.reason };
  }
  const payload = clone(this.rooms);
  const result = await saveScopedDraft({
   familyId: REGISTRY_FAMILY,
   payload,
   expectedRevision: this.registryRevision,
   expectedDraftId: this.registryDraftId
  });
  if (result.status === 'OK' || result.status === 'FORKED') {
   this.registryRevision = result.newRevision ?? 1;
   this.registryDraftId = result.draftId;
  } else if (result.status === 'STALE_REVISION') {
   // A newer registry exists (another tab): adopt it, keep the loser in
   // memory as an unsaved conflict candidate rather than overwriting.
   this.loadRooms();
  }
  return result;
 }

 saveRooms() {
  this.pendingPersist = this._persistRegistry();
  this.pendingPersist.catch(() => {});
  return this.pendingPersist;
 }

 flushPersistence() {
  return Promise.all([this.pendingPersist, this.pendingStatePersist]).then((results) => results[0]);
 }

 /**
  * Create a new local room with unique ID and campaign association
  */
 createLocalRoom(roomData) {
  this._ensureLoaded();
  // Validate room name
  const nameValidation = validateRoomName(roomData.name || 'Untitled Local Room');
  if (!nameValidation.isValid) {
   throw new Error(`Invalid room name: ${nameValidation.errors.join(', ')}`);
  }

  // Generate unique room ID using roomStateService
  const roomId = roomStateService.generateRoomId();
  const campaignId = roomData.campaignId || campaignService.getCurrentCampaignId();

  const room = {
   id: roomId,
   name: nameValidation.sanitized,
   description: roomData.description || '',
   type: 'local',
   campaignId: campaignId, // Associate with campaign
   createdAt: new Date().toISOString(),
   lastActivity: new Date().toISOString(),
   characterId: roomData.characterId || null,
   characterName: roomData.characterName || 'Unknown Character',
   gameState: {
    // Initialize empty game state
    creatures: [],
    tokens: [],
    backgrounds: [],
    inventory: { droppedItems: {} },
    combat: { isActive: false },
    mapData: {
     cameraPosition: { x: 0, y: 0 },
     zoomLevel: 1.0
    }
   },
   settings: {
    autoSave: true,
    difficulty: 'normal',
    allowConversion: true
   }
  };

  // Add room to array first (before any save operations)
  this.rooms.push(room);

  try {
   // Save operations - these will throw if they fail
   this.saveRooms();
   this.saveRoomState(roomId, room.gameState);

   // Associate room with campaign (may also throw if save fails)
   if (campaignId) {
    try {
     campaignService.addRoomToCampaign(campaignId, roomId);
    } catch (campaignError) {
     // If campaign association fails, remove the room from array and re-throw
     this.rooms = this.rooms.filter(r => r.id !== roomId);
     try {
      this.saveRooms();
     } catch (cleanupError) {
      console.error('Error during cleanup after failed campaign association:', cleanupError);
     }
     throw campaignError;
    }
   }

   return room;
  } catch (error) {
   // If any part of creation fails, remove the room from array
   this.rooms = this.rooms.filter(r => r.id !== roomId);
   // Try to save the cleaned state, but don't fail if this also fails
   try {
    this.saveRooms();
   } catch (cleanupError) {
    console.error('Error during cleanup after failed room creation:', cleanupError);
   }
   throw error;
  }
 }

 /**
  * Get all local rooms with their current game state
  */
 getLocalRooms() {
  this._ensureLoaded();

  return this.rooms.map(room => {
   // Load the actual saved game state for preview
   const savedGameState = this.loadRoomState(room.id);

   return {
    ...room,
    // Use saved game state if available, otherwise fall back to initial state
    gameState: savedGameState || room.gameState,
    isLocal: true,
    userRole: 'gm', // Local rooms are always GM mode
    members: [room.characterName],
    lastActivity: { seconds: new Date(room.lastActivity).getTime() / 1000 }
   };
  });
 }

 /**
  * Get a specific local room
  */
 getLocalRoom(roomId) {
  this._ensureLoaded();
  return this.rooms.find(room => room.id === roomId);
 }

 /**
  * Delete a local room (explicit user deletion; scoped keys only)
  */
 deleteLocalRoom(roomId) {
  this._ensureLoaded();
  this.rooms = this.rooms.filter(room => room.id !== roomId);
  this.saveRooms();

  // Remove the scoped room state (never the legacy recovery key).
  try {
   clearScopedNative({ familyId: STATE_FAMILY, locator: [roomId] });
  } catch (error) {
   console.error('Error deleting room state:', error);
  }
  this.roomStateBaselines.delete(roomId);
  this.roomStateCache.delete(roomId);
 }

 /**
  * Update room data
  */
 updateLocalRoom(roomId, updates) {
  this._ensureLoaded();
  const roomIndex = this.rooms.findIndex(r => r.id === roomId);
  if (roomIndex !== -1) {
   this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...updates };
   this.saveRooms();
  } else {
   throw new Error('Room not found');
  }
 }

 /**
  * Update room activity timestamp
  */
 updateRoomActivity(roomId) {
  this._ensureLoaded();
  const room = this.rooms.find(r => r.id === roomId);
  if (room) {
   room.lastActivity = new Date().toISOString();
   this.saveRooms();
  }
 }

 /**
  * Save game state for a local room. Updates the session cache immediately and
  * queues a captured-context scoped write with predecessor identity.
  */
 saveRoomState(roomId, gameState) {
  const stateToSave = {
   ...gameState,
   // Ensure backgrounds are properly saved
   backgrounds: gameState.backgrounds || [],
   activeBackgroundId: gameState.activeBackgroundId || null,
   // Legacy background support
   backgroundImage: gameState.backgroundImage || null,
   backgroundImageUrl: gameState.backgroundImageUrl || '',
   lastSaved: new Date().toISOString()
  };
  this.roomStateCache.set(roomId, stateToSave);

  const baseline = this.roomStateBaselines.get(roomId) || { revision: null, draftId: null };
  const pending = saveScopedDraft({
   familyId: STATE_FAMILY,
   locator: [roomId],
   payload: stateToSave,
   expectedRevision: baseline.revision,
   expectedDraftId: baseline.draftId
  }).then((result) => {
   if (result.status === 'OK' || result.status === 'FORKED') {
    this.roomStateBaselines.set(roomId, {
     revision: result.newRevision ?? 1,
     draftId: result.draftId
    });
   } else if (result.status === 'STALE_REVISION') {
    // Another tab wrote this room state; keep our cached candidate and do not
    // overwrite the winner. S8 resolves the divergence.
    this.roomStateBaselines.set(roomId, {
     revision: result.currentRevision ?? null,
     draftId: result.currentDraftId ?? null
    });
   }
   return result;
  });
  this.pendingStatePersist = pending;
  pending.catch(() => {});
  return pending;
 }

 /**
  * Load game state for a local room (scoped only; legacy keys are recovery
  * sources and are never read automatically).
  */
 loadRoomState(roomId) {
  if (this.roomStateCache.has(roomId)) {
   return this.roomStateCache.get(roomId);
  }
  const read = loadScopedDraft({ familyId: STATE_FAMILY, locator: [roomId] });
  if (read.status === 'OK') {
   this.roomStateBaselines.set(roomId, { revision: read.localRevision, draftId: read.draftId });
   this.roomStateCache.set(roomId, read.payload);
   return read.payload;
  }
  return null;
 }

 /**
  * Save the per-player restore snapshot for a room (scoped).
  */
 savePlayerStateScoped(roomId, characterId, playerState) {
  return saveScopedDraft({
   familyId: PLAYER_STATE_FAMILY,
   locator: [roomId, characterId],
   payload: {
    roomId,
    characterId,
    ...playerState,
    lastSaved: new Date().toISOString()
   },
   expectedRevision: null,
   expectedDraftId: null
  });
 }

 /**
  * Load the per-player restore snapshot for a room (scoped only).
  */
 loadPlayerStateScoped(roomId, characterId) {
  const read = loadScopedDraft({ familyId: PLAYER_STATE_FAMILY, locator: [roomId, characterId] });
  return read.status === 'OK' ? read.payload : null;
 }

 /**
  * Convert local room to multiplayer room data
  */
 prepareRoomForConversion(roomId) {
  this._ensureLoaded();
  const room = this.getLocalRoom(roomId);
  const gameState = this.loadRoomState(roomId);

  if (!room) {
   throw new Error('Local room not found');
  }

  return {
   name: room.name,
   description: room.description || 'Converted from local room',
   gameState: gameState || room.gameState,
   originalRoomId: roomId
  };
 }

 /**
  * Mark local room as converted (but keep for reference)
  */
 markRoomAsConverted(roomId, multiplayerRoomId) {
  this._ensureLoaded();
  const room = this.rooms.find(r => r.id === roomId);
  if (room) {
   room.convertedTo = multiplayerRoomId;
   room.isConverted = true;
   room.lastActivity = new Date().toISOString();
   this.saveRooms();
  }
 }

 /**
  * Collect current game state from all stores
  */
 async collectCurrentGameState() {
  try {
   const useGameStore = require('../store/gameStore').default;
   const useCreatureStore = require('../store/creatureStore').default;
   const useGridItemStore = require('../store/gridItemStore').default;
   const useLevelEditorStore = require('../store/levelEditorStore').default;

   const gameState = useGameStore.getState();
   const creatureState = useCreatureStore.getState();
   const gridItemState = useGridItemStore.getState();
   const levelEditorState = useLevelEditorStore.getState();

   return {
    // Background system - ensure all background data is captured
    backgrounds: gameState.backgrounds || [],
    activeBackgroundId: gameState.activeBackgroundId || null,
    backgroundImage: gameState.backgroundImage || null,
    backgroundImageUrl: gameState.backgroundImageUrl || '',

    // FIXED: Save tokens (placed creatures) instead of global creature library
    tokens: creatureState.tokens || [], // Room-specific placed creature tokens

    // Grid items (dropped items on the map)
    gridItems: gridItemState.gridItems || [],
    // Also save in legacy format for backwards compatibility
    inventory: {
     droppedItems: gridItemState.gridItems?.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
     }, {}) || {}
    },

    // Map data
    mapData: {
     cameraPosition: { x: gameState.cameraX || 0, y: gameState.cameraY || 0 },
     zoomLevel: gameState.zoomLevel || 1.0,
     backgrounds: gameState.backgrounds || [],
     activeBackgroundId: gameState.activeBackgroundId || null
    },

    // Level editor data - complete collection
    levelEditor: {
     terrainData: levelEditorState.terrainData || {},
     environmentalObjects: levelEditorState.environmentalObjects || [],
     wallData: levelEditorState.wallData || {},
     dndElements: levelEditorState.dndElements || [],
     fogOfWarData: levelEditorState.fogOfWarData || {},
     fogOfWarPaths: levelEditorState.fogOfWarPaths || [],
     fogErasePaths: levelEditorState.fogErasePaths || [],
     drawingPaths: levelEditorState.drawingPaths || [],
     drawingLayers: levelEditorState.drawingLayers || [],
     lightSources: levelEditorState.lightSources || {}
    },
    combat: { isActive: false }
   };
  } catch (error) {
   console.error('Error collecting game state:', error);
   // Return minimal state if there's an error
   return {
    backgrounds: [],
    tokens: [],
    inventory: { droppedItems: {} },
    mapData: { cameraPosition: { x: 0, y: 0 }, zoomLevel: 1.0 },
    levelEditor: {},
    combat: { isActive: false }
   };
  }
 }

 /**
  * Capture the exact save destination for the active local room.
  */
 _captureDestination() {
  this._ensureLoaded();
  const captured = captureConsumerContext();
  if (!captured.ok) return { ok: false, reason: captured.reason };
  const roomId = typeof localStorage !== 'undefined' ? localStorage.getItem('selectedLocalRoomId') : null;
  if (!roomId || !localStorage.getItem('isLocalRoom')) {
   return { ok: false, reason: 'not-in-local-room' };
  }
  return {
   ok: true,
   roomId,
   context: captured.context,
   scopeKey: this._currentScopeKey()
  };
 }

 /**
  * True while the destination is still exactly what we captured: same scope,
  * same generation, same active local room.
  */
 _destinationStillCurrent(destination) {
  if (!destination || !destination.ok) return false;
  if (this._currentScopeKey() !== destination.scopeKey) return false;
  if (!isConsumerContextCurrent(destination.context)) return false;
  const activeRoomId = typeof localStorage !== 'undefined' ? localStorage.getItem('selectedLocalRoomId') : null;
  return activeRoomId === destination.roomId;
 }

 /**
  * Auto-save current game state for active local room.
  * Captures the destination before collection and revalidates after every
  * await; a superseded collection is discarded, never written to another
  * room or account.
  */
 async autoSaveCurrentRoom() {
  const destination = this._captureDestination();
  if (!destination.ok) return { status: 'SUPERSEDED', reason: destination.reason };

  try {
   // Get room to find campaign ID
   const room = this.getLocalRoom(destination.roomId);
   const campaignId = room?.campaignId || campaignService.getCurrentCampaignId();

   // Collect room state (may take time)
   const roomState = await roomStateService.collectRoomState();
   if (!this._destinationStillCurrent(destination)) {
    return { status: 'SUPERSEDED', reason: 'destination-changed-during-collection' };
   }

   // Save room state (scoped) under the captured destination.
   this.saveRoomState(destination.roomId, roomState);
   this.updateRoomActivity(destination.roomId);
   if (campaignId) {
    try {
     campaignService.addRoomToCampaign(campaignId, destination.roomId);
    } catch (_error) {
     // campaign association is best-effort here
    }
   }

   // Also collect the local-room working state.
   const currentGameState = await this.collectCurrentGameState();
   if (!this._destinationStillCurrent(destination)) {
    return { status: 'SUPERSEDED', reason: 'destination-changed-during-collection' };
   }
   this.saveRoomState(destination.roomId, currentGameState);

   // Save player-specific state if character is active.
   try {
    const useCharacterStore = require('../store/characterStore').default;
    const activeCharacter = useCharacterStore.getState().activeCharacter || useCharacterStore.getState().getActiveCharacter?.();
    if (activeCharacter) {
     const characterId = activeCharacter.id;
     const playerState = await roomStateService.collectPlayerState(characterId, destination.roomId);
     if (!this._destinationStillCurrent(destination)) {
      return { status: 'SUPERSEDED', reason: 'destination-changed-during-collection' };
     }
     const activeNow = useCharacterStore.getState().activeCharacter || useCharacterStore.getState().getActiveCharacter?.();
     if (!activeNow || activeNow.id !== characterId) {
      return { status: 'SUPERSEDED', reason: 'active-character-changed' };
     }
     const savedPlayer = await this.savePlayerStateScoped(destination.roomId, characterId, playerState);
     if (!['OK', 'FORKED'].includes(savedPlayer.status)) return { status: 'SUPERSEDED', reason: 'player-snapshot-not-preserved' };
    }
   } catch (error) {
    console.warn('Could not save player state:', error);
   }
   return { status: 'OK', roomId: destination.roomId };
  } catch (error) {
   console.error('Error in autoSaveCurrentRoom:', error);
   return { status: 'FAILED', reason: error?.message || 'save-failed' };
  }
 }

 /**
  * Get room statistics
  */
 getRoomStats() {
  this._ensureLoaded();
  const totalRooms = this.rooms.length;
  const activeRooms = this.rooms.filter(room => !room.isConverted).length;
  const convertedRooms = this.rooms.filter(room => room.isConverted).length;

  return {
   total: totalRooms,
   active: activeRooms,
   converted: convertedRooms
  };
 }
}

// Create singleton instance
const localRoomService = new LocalRoomService();

export default localRoomService;

// Force save function that bypasses all loading checks but still captures and
// revalidates its destination.
export const forceSaveCurrentRoom = async () => {
 const destination = localRoomService._captureDestination();
 if (!destination.ok) {
  return { status: 'SUPERSEDED', reason: destination.reason };
 }

 try {
  // Get current game state from all stores
  const currentGameState = await localRoomService.collectCurrentGameState();
  if (!localRoomService._destinationStillCurrent(destination)) {
   return { status: 'SUPERSEDED', reason: 'destination-changed-during-collection' };
  }

  // Use the same save method as regular auto-save
  return await localRoomService.saveRoomState(destination.roomId, currentGameState);
 } catch (error) {
  console.error('❌ Error in force save:', error);
  return { status: 'FAILED', reason: error?.message || 'save-failed' };
 }
};

/** Test-only reset of the singleton working state. */
export function resetLocalRoomServiceForTests() {
 localRoomService.rooms = [];
 localRoomService.registryRevision = null;
 localRoomService.registryDraftId = null;
 localRoomService.scopeKey = null;
 localRoomService.quarantinedScopes = new Set();
 localRoomService.pendingPersist = Promise.resolve({ status: 'IDLE' });
 localRoomService.pendingStatePersist = Promise.resolve({ status: 'IDLE' });
 localRoomService.roomStateBaselines = new Map();
 localRoomService.roomStateCache = new Map();
}

// Export individual functions for convenience
export const {
 createLocalRoom,
 getLocalRooms,
 getLocalRoom,
 deleteLocalRoom,
 saveRoomState,
 loadRoomState,
 autoSaveCurrentRoom,
 collectCurrentGameState,
 prepareRoomForConversion,
 markRoomAsConverted,
 getRoomStats
} = localRoomService;
