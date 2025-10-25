/**
 * Level Editor Persistence Service
 * NOTE: This service no longer uses localStorage. All game state is now persisted
 * to the database via room gameState. This service is kept for API compatibility
 * but delegates to the database sync mechanisms.
 */

class LevelEditorPersistenceService {
  constructor() {
    this.cache = new Map(); // In-memory cache for performance
  }

  /**
   * Save level editor state for a specific room
   * NOTE: This now delegates to the database sync service instead of localStorage
   * @param {string} roomId - Room ID
   * @param {Object} levelEditorData - Level editor state data
   * @returns {boolean} Success status
   */
  saveLevelEditorState(roomId, levelEditorData) {
    if (!roomId || !levelEditorData) {
      console.warn('Invalid parameters for saving level editor state');
      return false;
    }

    try {
      // Store in memory cache only - actual persistence happens via database sync
      const stateData = {
        roomId,
        levelEditorData: {
          // Terrain and environment
          terrainData: levelEditorData.terrainData || {},
          environmentalObjects: levelEditorData.environmentalObjects || [],

          // Walls and structures
          wallData: levelEditorData.wallData || {},

          // D&D elements
          dndElements: levelEditorData.dndElements || [],

          // Fog of war
          fogOfWarData: levelEditorData.fogOfWarData || {},

          // Drawing system
          drawingPaths: levelEditorData.drawingPaths || [],
          drawingLayers: levelEditorData.drawingLayers || [],

          // Lighting system
          lightSources: levelEditorData.lightSources || {},

          // Grid and view settings
          gridSettings: {
            size: levelEditorData.gridSize || 50,
            offsetX: levelEditorData.gridOffsetX || 0,
            offsetY: levelEditorData.gridOffsetY || 0,
            color: levelEditorData.gridColor || 'rgba(212, 175, 55, 0.8)',
            thickness: levelEditorData.gridThickness || 2,
            visible: levelEditorData.showGridLines !== false
          },

          // Layer visibility settings
          layerVisibility: {
            terrain: levelEditorData.showTerrainLayer !== false,
            objects: levelEditorData.showObjectLayer !== false,
            walls: levelEditorData.showWallLayer !== false,
            dnd: levelEditorData.showDndLayer !== false,
            grid: levelEditorData.showGridLines !== false
          },

          // Tool settings
          toolSettings: {
            selectedTool: levelEditorData.selectedTool || 'select',
            brushSize: levelEditorData.brushSize || 1,
            activeLayer: levelEditorData.activeLayer || 'drawings'
          }
        },
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };

      // Update in-memory cache only
      this.cache.set(roomId, stateData);

      console.log(`💾 Level editor state cached for room ${roomId} (database sync handles persistence)`);
      return true;
    } catch (error) {
      console.error('Error caching level editor state:', error);
      return false;
    }
  }

  /**
   * Load level editor state for a specific room
   * NOTE: This now loads from in-memory cache only. Actual loading from database
   * happens via room sync mechanisms.
   * @param {string} roomId - Room ID
   * @returns {Object|null} Level editor state or null if not found
   */
  loadLevelEditorState(roomId) {
    if (!roomId) {
      console.warn('Invalid room ID for loading level editor state');
      return null;
    }

    try {
      // Check in-memory cache only
      if (this.cache.has(roomId)) {
        const cached = this.cache.get(roomId);
        console.log(`📋 Level editor state loaded from cache for room ${roomId}`);
        return cached.levelEditorData;
      }

      console.log(`📋 No cached level editor state for room ${roomId} (will load from database)`);
      return null;
    } catch (error) {
      console.error('Error loading level editor state from cache:', error);
      return null;
    }
  }

  /**
   * Delete level editor state for a specific room
   * NOTE: This now only clears the in-memory cache
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  deleteLevelEditorState(roomId) {
    try {
      this.cache.delete(roomId);
      console.log(`🗑️ Level editor state cache cleared for room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error clearing level editor state cache:', error);
      return false;
    }
  }

  /**
   * Copy level editor state from one room to another
   * @param {string} sourceRoomId - Source room ID
   * @param {string} targetRoomId - Target room ID
   * @returns {boolean} Success status
   */
  copyLevelEditorState(sourceRoomId, targetRoomId) {
    const sourceState = this.loadLevelEditorState(sourceRoomId);
    if (!sourceState) {
      console.warn(`No level editor state found for source room ${sourceRoomId}`);
      return false;
    }

    return this.saveLevelEditorState(targetRoomId, sourceState);
  }

  /**
   * Get all room states
   * NOTE: Returns cached states only
   * @returns {Object} Object with roomId as keys and states as values
   */
  getAllRoomStates() {
    const states = {};

    try {
      for (const [roomId, stateData] of this.cache.entries()) {
        states[roomId] = stateData;
      }
    } catch (error) {
      console.error('Error getting all room states:', error);
    }

    return states;
  }

  /**
   * Clean up old or invalid level editor states
   * NOTE: This is now a no-op since we don't use localStorage
   * @param {number} maxAge - Maximum age in days (default: 30)
   */
  cleanupOldStates(maxAge = 30) {
    console.log('cleanupOldStates is deprecated - state is now managed in database');
  }

  /**
   * Get storage usage statistics
   * NOTE: Returns cache statistics only
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    return {
      totalStates: this.cache.size,
      totalSize: 0, // Not tracked for in-memory cache
      averageSize: 0
    };
  }

  /**
   * Export level editor state for backup
   * @param {string} roomId - Room ID
   * @returns {Object|null} Exportable state data
   */
  exportState(roomId) {
    const state = this.loadLevelEditorState(roomId);
    if (!state) return null;

    return {
      roomId,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: state
    };
  }

  /**
   * Import level editor state from backup
   * @param {Object} exportData - Exported state data
   * @param {string} targetRoomId - Target room ID (optional, uses original if not provided)
   * @returns {boolean} Success status
   */
  importState(exportData, targetRoomId = null) {
    if (!exportData || !exportData.data) {
      console.warn('Invalid export data for import');
      return false;
    }

    const roomId = targetRoomId || exportData.roomId;
    return this.saveLevelEditorState(roomId, exportData.data);
  }
}

// Create singleton instance
const levelEditorPersistenceService = new LevelEditorPersistenceService();

export default levelEditorPersistenceService;
