/**
 * Action Bar Persistence Service
 * Manages saving and loading action bar configurations per character per room
 */

const ACTION_BAR_STORAGE_PREFIX = 'mythrill-actionbar-';

class ActionBarPersistenceService {
  constructor() {
    this.cache = new Map(); // In-memory cache for performance
  }

  /**
   * Generate storage key for character-room combination
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID (or 'global' for default)
   * @returns {string} Storage key
   */
  getStorageKey(characterId, roomId = 'global') {
    return `${ACTION_BAR_STORAGE_PREFIX}${characterId}-${roomId}`;
  }

  /**
   * Save action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @param {Array} actionSlots - Array of action bar items
   * @returns {boolean} Success status
   */
  saveActionBarConfig(characterId, roomId, actionSlots) {
    if (!characterId || !actionSlots) {
      console.warn('Invalid parameters for saving action bar config');
      return false;
    }

    try {
      const storageKey = this.getStorageKey(characterId, roomId);
      const configData = {
        characterId,
        roomId,
        actionSlots: actionSlots.map(slot => {
          if (!slot) return null;
          
          // Store essential data only to reduce storage size
          return {
            id: slot.id,
            name: slot.name,
            type: slot.type,
            icon: slot.icon,
            originalItemId: slot.originalItemId,
            maxCooldown: slot.maxCooldown,
            cooldown: 0, // Reset cooldown on save
            rarity: slot.rarity,
            description: slot.description,
            // Store spell-specific data if it's a spell
            ...(slot.type === 'spell' && {
              spellData: {
                damage: slot.damage,
                manaCost: slot.manaCost,
                castTime: slot.castTime,
                range: slot.range,
                duration: slot.duration,
                school: slot.school,
                level: slot.level
              }
            })
          };
        }),
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };

      localStorage.setItem(storageKey, JSON.stringify(configData));
      
      // Update cache
      this.cache.set(storageKey, configData);
      
      console.log(`💾 Action bar saved for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error saving action bar config:', error);
      return false;
    }
  }

  /**
   * Load action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {Array|null} Action slots array or null if not found
   */
  loadActionBarConfig(characterId, roomId) {
    if (!characterId) {
      console.warn('Invalid character ID for loading action bar config');
      return null;
    }

    try {
      const storageKey = this.getStorageKey(characterId, roomId);
      
      // Check cache first
      if (this.cache.has(storageKey)) {
        const cached = this.cache.get(storageKey);
        console.log(`📋 Action bar loaded from cache for character ${characterId} in room ${roomId}`);
        return cached.actionSlots;
      }

      // Load from localStorage
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        // Try to load global config as fallback
        if (roomId !== 'global') {
          console.log(`🔄 No room-specific config found, trying global config for character ${characterId}`);
          return this.loadActionBarConfig(characterId, 'global');
        }
        return null;
      }

      const configData = JSON.parse(stored);
      
      // Validate data structure
      if (!configData.actionSlots || !Array.isArray(configData.actionSlots)) {
        console.warn('Invalid action bar config data structure');
        return null;
      }

      // Update cache
      this.cache.set(storageKey, configData);
      
      console.log(`📋 Action bar loaded for character ${characterId} in room ${roomId}`);
      return configData.actionSlots;
    } catch (error) {
      console.error('Error loading action bar config:', error);
      return null;
    }
  }

  /**
   * Copy action bar configuration from one room to another
   * @param {string} characterId - Character ID
   * @param {string} sourceRoomId - Source room ID
   * @param {string} targetRoomId - Target room ID
   * @returns {boolean} Success status
   */
  copyActionBarConfig(characterId, sourceRoomId, targetRoomId) {
    const sourceConfig = this.loadActionBarConfig(characterId, sourceRoomId);
    if (!sourceConfig) {
      console.warn(`No action bar config found for character ${characterId} in room ${sourceRoomId}`);
      return false;
    }

    return this.saveActionBarConfig(characterId, targetRoomId, sourceConfig);
  }

  /**
   * Delete action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  deleteActionBarConfig(characterId, roomId) {
    try {
      const storageKey = this.getStorageKey(characterId, roomId);
      localStorage.removeItem(storageKey);
      this.cache.delete(storageKey);
      
      console.log(`🗑️ Action bar config deleted for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error deleting action bar config:', error);
      return false;
    }
  }

  /**
   * Get all action bar configurations for a character
   * @param {string} characterId - Character ID
   * @returns {Object} Object with roomId as keys and configs as values
   */
  getAllCharacterConfigs(characterId) {
    const configs = {};
    const prefix = `${ACTION_BAR_STORAGE_PREFIX}${characterId}-`;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const roomId = key.substring(prefix.length);
          const configData = JSON.parse(localStorage.getItem(key));
          configs[roomId] = configData;
        }
      }
    } catch (error) {
      console.error('Error getting all character configs:', error);
    }
    
    return configs;
  }

  /**
   * Clean up old or invalid action bar configurations
   * @param {number} maxAge - Maximum age in days (default: 30)
   */
  cleanupOldConfigs(maxAge = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);
    
    try {
      const keysToDelete = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(ACTION_BAR_STORAGE_PREFIX)) {
          try {
            const configData = JSON.parse(localStorage.getItem(key));
            const lastSaved = new Date(configData.lastSaved);
            
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
        console.log(`🧹 Cleaned up ${keysToDelete.length} old action bar configurations`);
      }
    } catch (error) {
      console.error('Error cleaning up old configs:', error);
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    let totalConfigs = 0;
    let totalSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(ACTION_BAR_STORAGE_PREFIX)) {
          totalConfigs++;
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }
    
    return {
      totalConfigs,
      totalSize,
      averageSize: totalConfigs > 0 ? Math.round(totalSize / totalConfigs) : 0
    };
  }
}

// Create singleton instance
const actionBarPersistenceService = new ActionBarPersistenceService();

export default actionBarPersistenceService;
