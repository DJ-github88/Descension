// Local Room Service - Manages offline/local rooms using localStorage
import { v4 as uuidv4 } from 'uuid';

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
    }
  }

  /**
   * Create a new local room
   */
  createLocalRoom(roomData) {
    const roomId = `local_${uuidv4()}`;
    const room = {
      id: roomId,
      name: roomData.name || 'Untitled Local Room',
      description: roomData.description || '',
      type: 'local',
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

    this.rooms.push(room);
    this.saveRooms();
    this.saveRoomState(roomId, room.gameState);

    console.log('✅ Local room created:', roomId);
    return room;
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

    console.log('🗑️ Local room deleted:', roomId);
  }

  /**
   * Update room data
   */
  updateLocalRoom(roomId, updates) {
    const roomIndex = this.rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...updates };
      this.saveRooms();
      console.log('✅ Local room updated:', roomId, updates);
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

      console.log('💾 Local room state saved:', roomId, 'with backgrounds:', stateToSave.backgrounds?.length || 0);
    } catch (error) {
      console.error('Error saving room state:', error);
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
      // Import stores dynamically to avoid circular dependencies
      const [gameStoreModule, creatureStoreModule, gridItemStoreModule, levelEditorStoreModule] = await Promise.all([
        import('../store/gameStore'),
        import('../store/creatureStore'),
        import('../store/gridItemStore'),
        import('../store/levelEditorStore')
      ]);

      const gameState = gameStoreModule.default.getState();
      const creatureState = creatureStoreModule.default.getState();
      const gridItemState = gridItemStoreModule.default.getState();
      const levelEditorState = levelEditorStoreModule.default.getState();

    return {
      // Background system - ensure all background data is captured
      backgrounds: gameState.backgrounds || [],
      activeBackgroundId: gameState.activeBackgroundId || null,
      backgroundImage: gameState.backgroundImage || null,
      backgroundImageUrl: gameState.backgroundImageUrl || '',

      // FIXED: Save tokens (placed creatures) instead of global creature library
      // The creature library should remain global and not be saved per room
      tokens: creatureState.tokens || [], // Room-specific placed creature tokens

      // Dropped items
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
      const currentGameState = await this.collectCurrentGameState();

      console.log('💾 Auto-saving local room with data:', {
        backgroundsCount: currentGameState.backgrounds.length,
        tokensCount: currentGameState.tokens.length,
        droppedItemsCount: Object.keys(currentGameState.inventory.droppedItems).length,
        activeBackgroundId: currentGameState.activeBackgroundId,
        hasBackgroundUrl: !!currentGameState.backgroundImageUrl,
        hasBackgroundImage: !!currentGameState.backgroundImage
      });

      // Debug: Log actual tokens being saved
      if (currentGameState.tokens && currentGameState.tokens.length > 0) {
        console.log('🎭 Tokens being saved:', currentGameState.tokens.map(t => ({ id: t.id, creatureId: t.creatureId, position: t.position })));
      } else {
        console.log('🎭 No tokens in creature store to save');
      }

      this.saveRoomState(currentRoomId, currentGameState);
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
    console.log('🚫 No local room selected for force save');
    return;
  }

  console.log('💪 Force saving room state for:', roomId);

  try {
    // Get current game state from all stores
    const currentGameState = await localRoomService.collectCurrentGameState();

    // Use the same save method as regular auto-save
    localRoomService.saveRoomState(roomId, currentGameState);

    console.log('✅ Force save completed for room:', roomId);
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
