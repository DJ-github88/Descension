/**
 * LocalStorage Manager
 * 
 * Handles localStorage quota management and cleanup to prevent storage exceeded errors.
 */

class LocalStorageManager {
  constructor() {
    this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit (conservative estimate)
    this.cleanupThreshold = 0.8; // Clean up when 80% full
  }

  /**
   * Get current localStorage usage in bytes
   */
  getCurrentUsage() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Check if localStorage is approaching quota limit
   */
  isApproachingQuota() {
    const usage = this.getCurrentUsage();
    return usage > (this.maxStorageSize * this.cleanupThreshold);
  }

  /**
   * Get storage usage percentage
   */
  getUsagePercentage() {
    return (this.getCurrentUsage() / this.maxStorageSize) * 100;
  }

  /**
   * Clean up old backup data to free space
   */
  cleanupOldBackups() {
    const backupKeys = [];
    
    // Find all backup keys
    for (let key in localStorage) {
      if (key.startsWith('mythrill-backup-')) {
        const timestamp = this.extractTimestampFromBackupKey(key);
        if (timestamp) {
          backupKeys.push({ key, timestamp });
        }
      }
    }

    // Sort by timestamp (oldest first)
    backupKeys.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest backups (keep only last 5 per character)
    const characterBackups = {};
    backupKeys.forEach(backup => {
      const characterId = this.extractCharacterIdFromBackupKey(backup.key);
      if (!characterBackups[characterId]) {
        characterBackups[characterId] = [];
      }
      characterBackups[characterId].push(backup);
    });

    let removedCount = 0;
    Object.values(characterBackups).forEach(backups => {
      // Keep only the 5 most recent backups per character
      const toRemove = backups.slice(0, Math.max(0, backups.length - 5));
      toRemove.forEach(backup => {
        localStorage.removeItem(backup.key);
        removedCount++;
      });
    });

    return removedCount;
  }

  /**
   * Clean up old temporary data
   */
  cleanupTempData() {
    const tempKeys = [];
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    for (let key in localStorage) {
      if (key.startsWith('mythrill-temp-') || key.startsWith('mythrill-cache-')) {
        try {
          const data = JSON.parse(localStorage[key]);
          if (data.timestamp && data.timestamp < oneHourAgo) {
            tempKeys.push(key);
          }
        } catch (error) {
          // If we can't parse it, it's probably corrupted, remove it
          tempKeys.push(key);
        }
      }
    }

    tempKeys.forEach(key => localStorage.removeItem(key));

    return tempKeys.length;
  }

  /**
   * Perform comprehensive cleanup
   */
  performCleanup() {
    const backupsRemoved = this.cleanupOldBackups();
    const tempDataRemoved = this.cleanupTempData();

    return { backupsRemoved, tempDataRemoved };
  }

  /**
   * Safe localStorage setItem with quota management
   */
  safeSetItem(key, value) {
    try {
      // Check if we need cleanup before storing
      if (this.isApproachingQuota()) {
        console.warn('⚠️ localStorage approaching quota, performing cleanup...');
        this.performCleanup();
      }

      localStorage.setItem(key, value);
      return { success: true };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('❌ localStorage quota exceeded, attempting emergency cleanup...');

        // Emergency cleanup - more aggressive
        this.performEmergencyCleanup();

        try {
          localStorage.setItem(key, value);
          return { success: true };
        } catch (retryError) {
          console.error('❌ Failed to store data even after cleanup:', retryError);
          return {
            success: false,
            error: 'Storage quota exceeded. Please clear some browser data.'
          };
        }
      } else {
        console.error('❌ localStorage error:', error);
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * Remove image data from character to save space
   */
  removeCharacterImages(character) {
    const cleaned = { ...character };
    if (cleaned.lore) {
      cleaned.lore = {
        ...cleaned.lore,
        characterImage: null, // Remove base64 image data
        imageTransformations: null // Remove image transformations
      };
    }
    if (cleaned.tokenSettings) {
      cleaned.tokenSettings = {
        ...cleaned.tokenSettings,
        customIcon: null // Remove custom icon
      };
    }
    return cleaned;
  }

  /**
   * Emergency cleanup - more aggressive than regular cleanup
   */
  performEmergencyCleanup() {
    let totalRemoved = 0;
    const keysToRemove = [];
    
    // 1. Remove all backup, temp, and cache data
    for (let key in localStorage) {
      if (key.startsWith('mythrill-backup-') ||
          key.startsWith('mythrill-temp-') ||
          key.startsWith('mythrill-cache-') ||
          key.includes('spell') ||
          key.includes('item') ||
          key.includes('creature')) {
        keysToRemove.push(key);
      }
    }

    // Remove backup/temp keys immediately
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        totalRemoved++;
      } catch (e) {
        console.warn(`Failed to remove ${key}:`, e);
      }
    });
    keysToRemove.length = 0; // Clear array

    // 2. Compress character data by removing images and keeping only recent characters
    for (let key in localStorage) {
      if (key === 'mythrill-characters' || key === 'mythrill-guest-characters') {
        try {
          const data = JSON.parse(localStorage[key]);
          if (Array.isArray(data)) {
            // Remove images from all characters to save space
            const cleanedData = data.map(char => this.removeCharacterImages(char));
            
            // If still too many characters, keep only most recent 5
            let finalData = cleanedData;
            if (cleanedData.length > 5) {
              const sorted = [...cleanedData].sort((a, b) => {
                const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
                const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
                return bTime - aTime;
              });
              finalData = sorted.slice(0, 5);
            }
            
            // Try to save compressed data
            try {
              const compressedJson = JSON.stringify(finalData);
              localStorage.setItem(key, compressedJson);
            } catch (saveError) {
              // If still too large, remove oldest characters
              if (saveError.name === 'QuotaExceededError') {
                const minimalData = finalData.slice(0, 3).map(char => {
                  const minimal = { ...char };
                  // Remove even more data
                  delete minimal.inventory;
                  delete minimal.equipment;
                  delete minimal.spells;
                  return minimal;
                });
                localStorage.setItem(key, JSON.stringify(minimalData));
              }
            }
          }
        } catch (error) {
          // If we can't parse it, it might be corrupted - remove it
          console.warn(`⚠️ Corrupted character data in ${key}, removing...`);
          try {
            localStorage.removeItem(key);
            totalRemoved++;
          } catch (e) {
            console.error(`Failed to remove corrupted ${key}:`, e);
          }
        }
      }
    }

    // 3. Remove other large stores that might be taking up space
    const largeStoreKeys = ['mythrill-map', 'mythrill-game', 'mythrill-chat'];
    for (let key in localStorage) {
      if (largeStoreKeys.some(storeKey => key.includes(storeKey))) {
        // Try to compress these stores by removing old data
        try {
          const data = JSON.parse(localStorage[key]);
          if (data && typeof data === 'object') {
            // Remove old chat messages, old map history, etc.
            if (data.messages && Array.isArray(data.messages) && data.messages.length > 50) {
              data.messages = data.messages.slice(-50); // Keep only last 50 messages
              localStorage.setItem(key, JSON.stringify(data));
            }
            // Remove large map data
            if (data.maps && Array.isArray(data.maps)) {
              data.maps = data.maps.slice(-3); // Keep only last 3 maps
              localStorage.setItem(key, JSON.stringify(data));
            }
          }
        } catch (error) {
          // If we can't parse it, remove it
          try {
            localStorage.removeItem(key);
            totalRemoved++;
          } catch (e) {
            console.error(`Failed to remove ${key}:`, e);
          }
        }
      }
    }

    return totalRemoved;
  }

  /**
   * Extract timestamp from backup key
   */
  extractTimestampFromBackupKey(key) {
    const match = key.match(/mythrill-backup-.*-(\d+)$/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Extract character ID from backup key
   */
  extractCharacterIdFromBackupKey(key) {
    const match = key.match(/mythrill-backup-(.+)-\d+$/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    const usage = this.getCurrentUsage();
    const percentage = this.getUsagePercentage();

    let characterCount = 0;
    let backupCount = 0;
    let tempCount = 0;

    for (let key in localStorage) {
      if (key === 'mythrill-characters') characterCount++;
      else if (key.startsWith('mythrill-backup-')) backupCount++;
      else if (key.startsWith('mythrill-temp-') || key.startsWith('mythrill-cache-')) tempCount++;
    }

    return {
      totalUsage: usage,
      usagePercentage: percentage,
      characterData: characterCount,
      backups: backupCount,
      tempData: tempCount,
      isApproachingQuota: this.isApproachingQuota()
    };
  }

  /**
   * Clear all localStorage data (for development/testing)
   */
  clearAllData() {
    if (process.env.NODE_ENV === 'development') {
      const keysToRemove = [];
      for (let key in localStorage) {
        if (key.startsWith('mythrill-')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } else {
      console.warn('clearAllData only available in development mode');
      return 0;
    }
  }
}

// Create singleton instance
const localStorageManager = new LocalStorageManager();

// Expose to window for development debugging
if (process.env.NODE_ENV === 'development') {
  window.localStorageManager = localStorageManager;
}

export default localStorageManager;
