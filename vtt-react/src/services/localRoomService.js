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
   * Get all local rooms
   */
  getLocalRooms() {
    return this.rooms.map(room => ({
      ...room,
      isLocal: true,
      userRole: 'gm', // Local rooms are always GM mode
      members: [room.characterName],
      lastActivity: { seconds: new Date(room.lastActivity).getTime() / 1000 }
    }));
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
      localStorage.setItem(stateKey, JSON.stringify({
        ...gameState,
        lastSaved: new Date().toISOString()
      }));
      
      // Update room activity
      this.updateRoomActivity(roomId);
      
      console.log('💾 Local room state saved:', roomId);
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

// Export individual functions for convenience
export const {
  createLocalRoom,
  getLocalRooms,
  getLocalRoom,
  deleteLocalRoom,
  saveRoomState,
  loadRoomState,
  prepareRoomForConversion,
  markRoomAsConverted,
  getRoomStats
} = localRoomService;
