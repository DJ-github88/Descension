/**
 * Level Editor Persistence Service
 * Manages saving and loading level editor data per room
 */

const LEVEL_EDITOR_STORAGE_PREFIX = 'mythrill-leveleditor-';

class LevelEditorPersistenceService {
  constructor() {
    this.cache = new Map(); // In-memory cache for performance
  }

  /**
   * Generate storage key for room-specific level editor data
   * @param {string} roomId - Room ID
   * @returns {string} Storage key
   */
  getStorageKey(roomId) {
    return `${LEVEL_EDITOR_STORAGE_PREFIX}${roomId}`;
  }

  /**
   * Save level editor state for a specific room
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
      const storageKey = this.getStorageKey(roomId);
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

      localStorage.setItem(storageKey, JSON.stringify(stateData));
      
      // Update cache
      this.cache.set(storageKey, stateData);
      
      console.log(`💾 Level editor state saved for room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error saving level editor state:', error);
      return false;
    }
  }

  /**
   * Load level editor state for a specific room
   * @param {string} roomId - Room ID
   * @returns {Object|null} Level editor state or null if not found
   */
  loadLevelEditorState(roomId) {
    if (!roomId) {
      console.warn('Invalid room ID for loading level editor state');
      return null;
    }

    try {
      const storageKey = this.getStorageKey(roomId);
      
      // Check cache first
      if (this.cache.has(storageKey)) {
        const cached = this.cache.get(storageKey);
        console.log(`📋 Level editor state loaded from cache for room ${roomId}`);
        return cached.levelEditorData;
      }

      // Load from localStorage
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        console.log(`📋 No level editor state found for room ${roomId}`);
        return null;
      }

      const stateData = JSON.parse(stored);
      
      // Validate data structure
      if (!stateData.levelEditorData) {
        console.warn('Invalid level editor state data structure');
        return null;
      }

      // Update cache
      this.cache.set(storageKey, stateData);
      
      console.log(`📋 Level editor state loaded for room ${roomId}`);
      return stateData.levelEditorData;
    } catch (error) {
      console.error('Error loading level editor state:', error);
      return null;
    }
  }

  /**
   * Delete level editor state for a specific room
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  deleteLevelEditorState(roomId) {
    try {
      const storageKey = this.getStorageKey(roomId);
      localStorage.removeItem(storageKey);
      this.cache.delete(storageKey);
      
      console.log(`🗑️ Level editor state deleted for room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error deleting level editor state:', error);
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
   * @returns {Object} Object with roomId as keys and states as values
   */
  getAllRoomStates() {
    const states = {};
    const prefix = LEVEL_EDITOR_STORAGE_PREFIX;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const roomId = key.substring(prefix.length);
          const stateData = JSON.parse(localStorage.getItem(key));
          states[roomId] = stateData;
        }
      }
    } catch (error) {
      console.error('Error getting all room states:', error);
    }
    
    return states;
  }

  /**
   * Clean up old or invalid level editor states
   * @param {number} maxAge - Maximum age in days (default: 30)
   */
  cleanupOldStates(maxAge = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);
    
    try {
      const keysToDelete = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LEVEL_EDITOR_STORAGE_PREFIX)) {
          try {
            const stateData = JSON.parse(localStorage.getItem(key));
            const lastSaved = new Date(stateData.lastSaved);
            
            if (lastSaved < cutoffDate) {
              keysToDelete.push(key);
            }
          } catch (parseError) {
            // Invalid data, mark for deletion
            keysToDelete.push(key);
          }
        }
      }
      
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
        this.cache.delete(key);
      });
      
      if (keysToDelete.length > 0) {
        console.log(`🧹 Cleaned up ${keysToDelete.length} old level editor states`);
      }
    } catch (error) {
      console.error('Error cleaning up old states:', error);
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    let totalStates = 0;
    let totalSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LEVEL_EDITOR_STORAGE_PREFIX)) {
          totalStates++;
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }
    
    return {
      totalStates,
      totalSize,
      averageSize: totalStates > 0 ? Math.round(totalSize / totalStates) : 0
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
