/**
 * Character Sync Service
 * 
 * This service handles offline/online synchronization for character data,
 * conflict resolution, and ensures data consistency across devices.
 */

import characterPersistenceService from './characterPersistenceService';
import characterSessionService from './characterSessionService';

// Sync status tracking
const SYNC_STATUS_KEY = 'mythrill-sync-status';
const OFFLINE_CHANGES_KEY = 'mythrill-offline-changes';

/**
 * Character Sync Service Class
 */
class CharacterSyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = this.loadOfflineChanges();
    this.syncInProgress = false;
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Load offline changes from localStorage
   */
  loadOfflineChanges() {
    try {
      const changes = localStorage.getItem(OFFLINE_CHANGES_KEY);
      return changes ? JSON.parse(changes) : [];
    } catch (error) {
      console.error('Error loading offline changes:', error);
      return [];
    }
  }

  /**
   * Save offline changes to localStorage
   */
  saveOfflineChanges() {
    try {
      localStorage.setItem(OFFLINE_CHANGES_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving offline changes:', error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    try {
      const status = localStorage.getItem(SYNC_STATUS_KEY);
      return status ? JSON.parse(status) : {
        lastSync: null,
        pendingChanges: 0,
        conflictsResolved: 0,
        lastConflict: null
      };
    } catch (error) {
      return {
        lastSync: null,
        pendingChanges: 0,
        conflictsResolved: 0,
        lastConflict: null
      };
    }
  }

  /**
   * Update sync status
   */
  updateSyncStatus(updates) {
    try {
      const currentStatus = this.getSyncStatus();
      const newStatus = { ...currentStatus, ...updates };
      localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(newStatus));
    } catch (error) {
      console.error('Error updating sync status:', error);
    }
  }

  /**
   * Handle going online
   */
  async handleOnline() {
    console.log('🌐 Connection restored, starting sync...');
    this.isOnline = true;
    
    if (this.syncQueue.length > 0) {
      await this.syncOfflineChanges();
    }
  }

  /**
   * Handle going offline
   */
  handleOffline() {
    console.log('📴 Connection lost, switching to offline mode');
    this.isOnline = false;
  }

  /**
   * Queue a change for offline sync
   */
  queueChange(characterId, changeType, changeData) {
    const change = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      characterId,
      changeType,
      changeData,
      timestamp: new Date().toISOString(),
      synced: false
    };

    this.syncQueue.push(change);
    this.saveOfflineChanges();
    
    console.log(`📝 Queued offline change: ${changeType} for character ${characterId}`);

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.syncOfflineChanges();
    }
  }

  /**
   * Sync offline changes to Firebase
   */
  async syncOfflineChanges() {
    if (this.syncInProgress || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${this.syncQueue.length} offline changes...`);

    const results = {
      synced: 0,
      failed: 0,
      conflicts: 0
    };

    try {
      // Group changes by character for efficient processing
      const changesByCharacter = this.groupChangesByCharacter();

      for (const [characterId, changes] of Object.entries(changesByCharacter)) {
        try {
          await this.syncCharacterChanges(characterId, changes);
          results.synced += changes.length;
          
          // Mark changes as synced
          changes.forEach(change => {
            const queueIndex = this.syncQueue.findIndex(q => q.id === change.id);
            if (queueIndex !== -1) {
              this.syncQueue[queueIndex].synced = true;
            }
          });
        } catch (error) {
          console.error(`Failed to sync changes for character ${characterId}:`, error);
          results.failed += changes.length;
        }
      }

      // Remove synced changes from queue
      this.syncQueue = this.syncQueue.filter(change => !change.synced);
      this.saveOfflineChanges();

      // Update sync status
      this.updateSyncStatus({
        lastSync: new Date().toISOString(),
        pendingChanges: this.syncQueue.length
      });

      console.log(`✅ Sync completed: ${results.synced} synced, ${results.failed} failed, ${results.conflicts} conflicts`);

    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }

    return results;
  }

  /**
   * Group changes by character ID
   */
  groupChangesByCharacter() {
    const grouped = {};
    
    this.syncQueue.forEach(change => {
      if (!grouped[change.characterId]) {
        grouped[change.characterId] = [];
      }
      grouped[change.characterId].push(change);
    });

    return grouped;
  }

  /**
   * Sync changes for a specific character
   */
  async syncCharacterChanges(characterId, changes) {
    // Load current character data from Firebase
    const currentCharacter = await characterPersistenceService.loadCharacter(characterId);
    
    if (!currentCharacter) {
      throw new Error(`Character ${characterId} not found in Firebase`);
    }

    // Apply changes in chronological order
    const sortedChanges = changes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let updatedCharacter = { ...currentCharacter };

    for (const change of sortedChanges) {
      updatedCharacter = this.applyChange(updatedCharacter, change);
    }

    // Save updated character to Firebase
    await characterPersistenceService.saveCharacter(characterId, updatedCharacter);
    
    console.log(`✅ Synced ${changes.length} changes for character ${characterId}`);
  }

  /**
   * Apply a single change to character data
   */
  applyChange(character, change) {
    const { changeType, changeData } = change;

    switch (changeType) {
      case 'inventory_add':
        if (!character.inventory) character.inventory = { items: [], currency: {} };
        if (!character.inventory.items) character.inventory.items = [];
        character.inventory.items.push(changeData.item);
        break;

      case 'inventory_remove':
        if (character.inventory?.items) {
          character.inventory.items = character.inventory.items.filter(
            item => item.id !== changeData.itemId
          );
        }
        break;

      case 'inventory_modify':
        if (character.inventory?.items) {
          const itemIndex = character.inventory.items.findIndex(
            item => item.id === changeData.itemId
          );
          if (itemIndex !== -1) {
            character.inventory.items[itemIndex] = {
              ...character.inventory.items[itemIndex],
              ...changeData.changes
            };
          }
        }
        break;

      case 'currency_gain':
      case 'currency_spend':
        if (!character.inventory) character.inventory = { currency: {} };
        if (!character.inventory.currency) character.inventory.currency = {};
        
        Object.keys(changeData).forEach(currencyType => {
          const currentAmount = character.inventory.currency[currencyType] || 0;
          const changeAmount = changeData[currencyType];
          
          if (changeType === 'currency_gain') {
            character.inventory.currency[currencyType] = currentAmount + changeAmount;
          } else {
            character.inventory.currency[currencyType] = Math.max(0, currentAmount - changeAmount);
          }
        });
        break;

      case 'resource_change':
        if (!character.resources) character.resources = {};
        character.resources[changeData.type] = changeData.value;
        break;

      case 'stat_change':
        character[changeData.stat] = changeData.value;
        break;

      case 'experience_gain':
        character.experience = changeData.newTotal;
        break;

      default:
        console.warn(`Unknown change type: ${changeType}`);
    }

    // Update timestamp
    character.updatedAt = new Date().toISOString();
    
    return character;
  }

  /**
   * Force sync all pending changes
   */
  async forcSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    return await this.syncOfflineChanges();
  }

  /**
   * Get pending changes count
   */
  getPendingChangesCount() {
    return this.syncQueue.filter(change => !change.synced).length;
  }

  /**
   * Clear all pending changes (use with caution)
   */
  clearPendingChanges() {
    this.syncQueue = [];
    this.saveOfflineChanges();
    this.updateSyncStatus({ pendingChanges: 0 });
    console.log('✅ All pending changes cleared');
  }

  /**
   * Get sync summary
   */
  getSyncSummary() {
    const status = this.getSyncStatus();
    const pendingCount = this.getPendingChangesCount();
    
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingChanges: pendingCount,
      lastSync: status.lastSync,
      conflictsResolved: status.conflictsResolved,
      lastConflict: status.lastConflict
    };
  }
}

// Export singleton instance
const characterSyncService = new CharacterSyncService();
export default characterSyncService;
