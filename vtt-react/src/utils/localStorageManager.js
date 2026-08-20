/**
 * LocalStorage Manager
 * 
 * Handles localStorage quota management, emergency cleanups,
 * and seamless in-memory fallback to prevent storage quota exceeded errors.
 */

class LocalStorageManager {
  constructor() {
    this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit (conservative browser estimate)
    this.cleanupThreshold = 0.75; // Clean up when 75% full
    this.fallbackStore = new Map();
  }

  /**
   * Get current localStorage usage in bytes
   */
  getCurrentUsage() {
    let total = 0;
    if (typeof localStorage === 'undefined') return total;
    try {
      for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const val = localStorage[key];
          total += (val ? val.length : 0) + (key ? key.length : 0);
        }
      }
    } catch (_) {}
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
    if (typeof localStorage === 'undefined') return 0;
    const backupKeys = [];
    
    try {
      for (let key in localStorage) {
        if (key.startsWith('mythrill-backup-')) {
          const timestamp = this.extractTimestampFromBackupKey(key);
          if (timestamp) {
            backupKeys.push({ key, timestamp });
          } else {
            backupKeys.push({ key, timestamp: 0 });
          }
        }
      }

      backupKeys.sort((a, b) => a.timestamp - b.timestamp);

      let removedCount = 0;
      backupKeys.forEach(backup => {
        try {
          localStorage.removeItem(backup.key);
          removedCount++;
        } catch (_) {}
      });

      return removedCount;
    } catch (_) {
      return 0;
    }
  }

  /**
   * Clean up temporary and non-essential caches
   */
  cleanupTempData() {
    if (typeof localStorage === 'undefined') return 0;
    let count = 0;
    const disposablePrefixes = [
      'mythrill-temp-',
      'mythrill-cache-',
      'mythrill-debug-',
      'mythrill_subregion_',
      'mythrill_regional_',
      'mythrill_map_',
      'mythrill_location_',
      'mythrill-deleted-spells',
      'spellcrafting_history',
      'item_creator_recent',
      'mapMaking',
      'character_draft_',
      'room-data-',
      'mythrill-guest-joined-rooms'
    ];

    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (disposablePrefixes.some(prefix => key.startsWith(prefix))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          count++;
        } catch (_) {}
      });
    } catch (_) {}

    return count;
  }

  /**
   * Perform standard cleanup
   */
  performCleanup() {
    const backupsRemoved = this.cleanupOldBackups();
    const tempDataRemoved = this.cleanupTempData();
    return { backupsRemoved, tempDataRemoved };
  }

  /**
   * Remove large base64 image data from character to keep payload lightweight
   */
  removeCharacterImages(character) {
    if (!character || typeof character !== 'object') return character;
    const cleaned = { ...character };

    if (cleaned.lore && typeof cleaned.lore === 'object') {
      const charImg = cleaned.lore.characterImage;
      if (typeof charImg === 'string' && charImg.startsWith('data:image')) {
        cleaned.lore = {
          ...cleaned.lore,
          characterImage: null,
          imageTransformations: null
        };
      }
    }

    if (cleaned.tokenSettings && typeof cleaned.tokenSettings === 'object') {
      const icon = cleaned.tokenSettings.customIcon;
      if (typeof icon === 'string' && icon.startsWith('data:image')) {
        cleaned.tokenSettings = {
          ...cleaned.tokenSettings,
          customIcon: null
        };
      }
    }

    return cleaned;
  }

  /**
   * Aggressive Emergency Cleanup: frees up maximum space when QuotaExceededError is hit
   */
  performEmergencyCleanup() {
    if (typeof localStorage === 'undefined') return 0;
    let totalRemoved = 0;

    // 1. Remove all disposable, temporary, map, and backup keys
    this.cleanupTempData();
    this.cleanupOldBackups();

    // 2. Protect critical identity keys
    const criticalKeys = new Set([
      'mythrill-characters',
      'mythrill-guest-characters',
      'mythrill-active-character',
      'mythrill_user',
      'auth_token',
      'userId',
      'currentUserId'
    ]);

    // 3. Compress existing character lists by stripping base64 images
    ['mythrill-characters', 'mythrill-guest-characters'].forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const stripped = parsed.map(c => this.removeCharacterImages(c));
            try {
              localStorage.setItem(key, JSON.stringify(stripped));
            } catch (_) {}
          }
        }
      } catch (_) {}
    });

    // 4. If still under pressure, sort all non-critical keys by byte size and purge largest
    try {
      const entries = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || criticalKeys.has(key)) continue;
        const val = localStorage.getItem(key);
        entries.push({ key, size: (val ? val.length : 0) });
      }

      entries.sort((a, b) => b.size - a.size);

      // Remove largest non-critical keys
      for (const entry of entries) {
        try {
          localStorage.removeItem(entry.key);
          totalRemoved++;
          if (!this.isApproachingQuota()) break;
        } catch (_) {}
      }
    } catch (_) {}

    return totalRemoved;
  }

  /**
   * Safe setItem with automatic cleanup and robust in-memory fallback
   */
  safeSetItem(key, value) {
    // Keep in memory fallback store in sync
    this.fallbackStore.set(key, value);

    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { success: true, isFallback: true };
    }

    try {
      if (this.isApproachingQuota()) {
        this.performCleanup();
      }

      localStorage.setItem(key, value);
      return { success: true };
    } catch (error) {
      if (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014 ||
        (typeof error.message === 'string' && error.message.toLowerCase().includes('quota'))
      ) {
        console.warn('⚠️ LocalStorage quota exceeded, running emergency cleanup...');
        this.performEmergencyCleanup();

        try {
          localStorage.setItem(key, value);
          return { success: true };
        } catch (retryError) {
          console.warn('⚠️ Storage quota still exceeded after cleanup. Saved safely to in-memory fallback:', retryError.message);
          return {
            success: true,
            isFallback: true,
            error: 'Storage quota exceeded (preserved in session memory)'
          };
        }
      }

      console.warn(`LocalStorage write error on key "${key}":`, error.message);
      return { success: true, isFallback: true, error: error.message };
    }
  }

  /**
   * Safe getItem with seamless in-memory fallback
   */
  safeGetItem(key) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return this.fallbackStore.get(key) || null;
    }

    try {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined) {
        return val;
      }
    } catch (e) {
      console.warn(`LocalStorage read error for key "${key}":`, e.message);
    }

    return this.fallbackStore.get(key) || null;
  }

  /**
   * Safe removeItem with memory fallback cleanup
   */
  safeRemoveItem(key) {
    this.fallbackStore.delete(key);
    if (typeof localStorage === 'undefined') return true;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Extract timestamp from backup key
   */
  extractTimestampFromBackupKey(key) {
    const match = key.match(/mythrill-backup-.*-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Extract character ID from backup key
   */
  extractCharacterIdFromBackupKey(key) {
    const match = key.match(/mythrill-backup-(.+)-\d+$/);
    return match ? match[1] : 'unknown';
  }

  /**
   * Clear all development data
   */
  clearAllData() {
    this.fallbackStore.clear();
    if (typeof localStorage === 'undefined') return 0;
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mythrill-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      return keysToRemove.length;
    } catch (_) {
      return 0;
    }
  }
}

// Singleton instance
const localStorageManager = new LocalStorageManager();

if (typeof window !== 'undefined') {
  window.localStorageManager = localStorageManager;
}

export default localStorageManager;
