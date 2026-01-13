// Local Room Service - Manages offline/local rooms using localStorage
import { v4 as uuidv4 } from 'uuid';
import roomStateService from './roomStateService';
import campaignService from './campaignService';
import { validateRoomName } from '../utils/validationUtils';

// Performance Optimization: Eagerly import stores to avoid lag during auto-save
import useGameStore from '../store/gameStore';
import useCreatureStore from '../store/creatureStore';
import useGridItemStore from '../store/gridItemStore';
import useLevelEditorStore from '../store/levelEditorStore';
import useCharacterStore from '../store/characterStore';

const LOCAL_ROOMS_KEY = 'mythrill_local_rooms';
const LOCAL_ROOM_STATE_PREFIX = 'mythrill_local_room_state_';

/**
 * Local Room Service for offline gameplay
 * Stores rooms and game state in localStorage
 */
class LocalRoomService {
  constructor() {
    this.rooms = this.loadRooms();
  }

  /**
   * Load all local rooms from localStorage
   */
  loadRooms() {
    try {
      const stored = localStorage.getItem(LOCAL_ROOMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading local rooms:', error);
      return [];
    }
  }

  /**
   * Save rooms to localStorage
   */
  saveRooms() {
    try {
      localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(this.rooms));
    } catch (error) {
      console.error('Error saving local rooms:', error);
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some browser data or delete unused rooms.');
      }
      throw error;
    }
  }

  /**
   * Create a new local room with unique ID and campaign association
   */
  createLocalRoom(roomData) {
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
    // Always reload from localStorage to ensure we have the latest data
    // This is important when localStorage is cleared (e.g., guest login)
    this.rooms = this.loadRooms();

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
    // Always reload from localStorage to ensure we have the latest data
    this.rooms = this.loadRooms();
    return this.rooms.find(room => room.id === roomId);
  }

  /**
   * Delete a local room
   */
  deleteLocalRoom(roomId) {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    this.saveRooms();

    // Also delete the room state
    try {
      localStorage.removeItem(`${LOCAL_ROOM_STATE_PREFIX}${roomId}`);
    } catch (error) {
      console.error('Error deleting room state:', error);
    }

  }

  /**
   * Update room data
   */
  updateLocalRoom(roomId, updates) {
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
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.lastActivity = new Date().toISOString();
      this.saveRooms();
    }
  }

  /**
   * Save game state for a local room
   */
  saveRoomState(roomId, gameState) {
    try {
      const stateKey = `${LOCAL_ROOM_STATE_PREFIX}${roomId}`;

      // Ensure we preserve background data properly
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

      localStorage.setItem(stateKey, JSON.stringify(stateToSave));

      // Update room activity
      this.updateRoomActivity(roomId);

    } catch (error) {
      console.error('Error saving room state:', error);
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some browser data or delete unused rooms.');
      }
      throw error;
    }
  }

  /**
   * Load game state for a local room
   */
  loadRoomState(roomId) {
    try {
      const stateKey = `${LOCAL_ROOM_STATE_PREFIX}${roomId}`;
      const stored = localStorage.getItem(stateKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading room state:', error);
      return null;
    }
  }

  /**
   * Convert local room to multiplayer room data
   */
  prepareRoomForConversion(roomId) {
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
        // The creature library should remain global and not be saved per room
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

        // Map data - include background data here too for compatibility
        mapData: {
          cameraPosition: { x: gameState.cameraX || 0, y: gameState.cameraY || 0 },
          zoomLevel: gameState.zoomLevel || 1.0,
          backgrounds: gameState.backgrounds || [],
          activeBackgroundId: gameState.activeBackgroundId || null
        },

        // Level editor data - comprehensive collection
        levelEditor: {
          terrainData: levelEditorState.terrainData || {},
          environmentalObjects: levelEditorState.environmentalObjects || [],
          lightSources: levelEditorState.lightSources || {},
          wallData: levelEditorState.wallData || {},
          dndElements: levelEditorState.dndElements || [],
          fogOfWarData: levelEditorState.fogOfWarData || {},
          drawingPaths: levelEditorState.drawingPaths || [],
          drawingLayers: levelEditorState.drawingLayers || []
        },

        // Combat state
        combat: {
          isActive: false // Local rooms don't persist combat state
        }
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
   * Auto-save current game state for active local room
   * This should be called whenever game state changes
   */
  async autoSaveCurrentRoom() {
    const currentRoomId = localStorage.getItem('selectedLocalRoomId');
    if (!currentRoomId || !localStorage.getItem('isLocalRoom')) {
      return; // Not in a local room
    }

    try {
      // Note: roomStateService and campaignService are already imported at the top

      // Get room to find campaign ID
      const room = this.getLocalRoom(currentRoomId);
      const campaignId = room?.campaignId || campaignService.getCurrentCampaignId();

      // Collect room state
      const roomState = await roomStateService.collectRoomState();

      // Save room state
      roomStateService.saveRoomState(currentRoomId, campaignId, roomState);

      // Also save to local room service for backward compatibility
      const currentGameState = await this.collectCurrentGameState();
      this.saveRoomState(currentRoomId, currentGameState);

      // Save player-specific state if character is active
      try {
        const activeCharacter = useCharacterStore.getState().activeCharacter;
        if (activeCharacter) {
          const playerState = await roomStateService.collectPlayerState(activeCharacter.id);
          roomStateService.savePlayerState(currentRoomId, activeCharacter.id, playerState);
        }
      } catch (error) {
        console.warn('Could not save player state:', error);
      }
    } catch (error) {
      console.error('Error in autoSaveCurrentRoom:', error);
    }
  }

  /**
   * Get room statistics
   */
  getRoomStats() {
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

// Force save function that bypasses all loading checks
export const forceSaveCurrentRoom = async () => {
  const roomId = localStorage.getItem('selectedLocalRoomId');
  if (!roomId) {
    return;
  }

  try {
    // Get current game state from all stores
    const currentGameState = await localRoomService.collectCurrentGameState();

    // Use the same save method as regular auto-save
    localRoomService.saveRoomState(roomId, currentGameState);

  } catch (error) {
    console.error('❌ Error in force save:', error);
  }
};

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
