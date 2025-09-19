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

    console.log(`🧹 Cleaned up ${removedCount} old character backups`);
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
    console.log(`🧹 Cleaned up ${tempKeys.length} temporary data entries`);
    return tempKeys.length;
  }

  /**
   * Perform comprehensive cleanup
   */
  performCleanup() {
    console.log('🧹 Starting localStorage cleanup...');
    console.log(`📊 Current usage: ${this.getUsagePercentage().toFixed(1)}%`);

    const backupsRemoved = this.cleanupOldBackups();
    const tempDataRemoved = this.cleanupTempData();

    console.log(`📊 Usage after cleanup: ${this.getUsagePercentage().toFixed(1)}%`);
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
        
        // Emergency cleanup
        this.performCleanup();
        
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
}

// Create singleton instance
const localStorageManager = new LocalStorageManager();

export default localStorageManager;
