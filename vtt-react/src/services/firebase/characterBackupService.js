/**
 * Character Backup and Recovery Service
 * 
 * This service handles automatic character data backups and recovery mechanisms
 * to prevent data loss and provide version history.
 */

import characterPersistenceService from './characterPersistenceService';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';
import { captureConsumerContext, captureOwnerGuard, isConsumerContextCurrent } from '../../persistence/scopedConsumer';
import {
  saveOwnerBackup,
  readOwnerBackup,
  removeOwnerBackup,
  listOwnerBackups,
  LEGACY_BACKUP_PREFIX
} from '../../persistence/characterBackupScopedStorage';

// Backup configuration
const BACKUP_COLLECTIONS = {
  CHARACTER_BACKUPS: 'character_backups'
};

const BACKUP_CONFIG = {
  MAX_BACKUPS_PER_CHARACTER: 10,
  BACKUP_INTERVAL_HOURS: 24,
  AUTO_BACKUP_ENABLED: true,
  BACKUP_ON_LEVEL_UP: true,
  BACKUP_ON_MAJOR_CHANGES: true
};

/**
 * Character Backup Service Class
 */
class CharacterBackupService {
  constructor() {
    this.isConfigured = isFirebaseConfigured;
    this.lastBackupTimes = new Map();
    this.autoBackupEnabled = BACKUP_CONFIG.AUTO_BACKUP_ENABLED;
  }

  /**
   * Create a backup of character data
   */
  async createBackup(characterId, userId, reason = 'manual', characterData = null) {
    // B1: fence the whole operation to the owner/generation that started it.
    // A failed cloud backup after handoff must never fall back into the new
    // account's local scope.
    const ownerGuard = captureOwnerGuard(userId);
    if (!ownerGuard.ok) {
      return { success: false, error: 'owner-context-changed' };
    }
    if (!this.isConfigured) {
      console.warn('Firebase not configured, cannot create backup');
      if (!ownerGuard.isCurrent()) return { success: false, error: 'owner-context-changed' };
      return this.createLocalBackup(characterId, characterData, reason);
    }

    try {
      // Load character data if not provided
      if (!characterData) {
        characterData = await characterPersistenceService.loadCharacter(characterId);
        if (!ownerGuard.isCurrent()) {
          return { success: false, error: 'owner-context-changed' };
        }
        if (!characterData) {
          throw new Error(`Character ${characterId} not found`);
        }
      }

      // Create backup document
      const backup = {
        characterId,
        userId,
        characterData: { ...characterData },
        backupReason: reason,
        createdAt: new Date().toISOString(),
        version: this.generateVersionNumber(),
        dataSize: JSON.stringify(characterData).length
      };

      // Save to Firebase
      // Sanitize backup data to remove undefined values
      const sanitizedBackup = sanitizeForFirestore(backup);

      const backupRef = await addDoc(collection(db, BACKUP_COLLECTIONS.CHARACTER_BACKUPS), sanitizedBackup);

      if (!ownerGuard.isCurrent()) {
        return { success: false, error: 'owner-context-changed' };
      }

      // Update last backup time
      this.lastBackupTimes.set(characterId, new Date());

      // Clean up old backups
      await this.cleanupOldBackups(characterId, userId);

      console.log(`✅ Character backup created: ${backupRef.id} (${reason})`);
      return {
        success: true,
        backupId: backupRef.id,
        version: backup.version,
        size: backup.dataSize
      };

    } catch (error) {
      console.error('Error creating backup:', error);

      // Fallback to local backup only while the originating owner is still
      // the active verified principal.
      if (!ownerGuard.isCurrent()) {
        return { success: false, error: 'owner-context-changed' };
      }
      return this.createLocalBackup(characterId, characterData, reason);
    }
  }

  /**
   * Create a local backup when Firebase is unavailable.
   *
   * Wave B closure: the backup belongs to the verified owner scope captured at
   * creation time. Guest backups stay in guest scope; a bare character id or
   * user id string is never ownership proof.
   */
  createLocalBackup(characterId, characterData, reason) {
    try {
      const context = captureConsumerContext();
      if (!context.ok) {
        return { success: false, error: 'no-active-owner-scope' };
      }

      const backupId = `${LEGACY_BACKUP_PREFIX}${characterId}-${Date.now()}`;
      const backup = {
        backupId,
        characterId,
        characterData,
        backupReason: reason,
        createdAt: new Date().toISOString(),
        version: this.generateVersionNumber(),
        isLocal: true
      };

      const saved = saveOwnerBackup(backup);
      if (saved.status !== 'OK') {
        return { success: false, error: saved.reason || saved.status };
      }

      console.log(`✅ Local character backup created for owner scope (${reason})`);
      return {
        success: true,
        backupId,
        version: backup.version,
        isLocal: true
      };

    } catch (error) {
      console.error('Error creating local backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List available backups for a character
   */
  async listBackups(characterId, userId) {
    if (!this.isConfigured) {
      return this.listLocalBackups(characterId);
    }

    try {
      const backupsQuery = query(
        collection(db, BACKUP_COLLECTIONS.CHARACTER_BACKUPS),
        where('characterId', '==', characterId),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(BACKUP_CONFIG.MAX_BACKUPS_PER_CHARACTER)
      );

      const snapshot = await getDocs(backupsQuery);
      const backups = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        backups.push({
          id: doc.id,
          characterId: data.characterId,
          backupReason: data.backupReason,
          createdAt: data.createdAt,
          version: data.version,
          dataSize: data.dataSize
        });
      });

      console.log(`📋 Found ${backups.length} backups for character ${characterId}`);
      return backups;

    } catch (error) {
      console.error('Error listing backups:', error);
      return this.listLocalBackups(characterId);
    }
  }

  /**
   * List local backups for the active verified owner.
   *
   * Legacy global `mythrill-backup-*` keys are preserved recovery sources but
   * are never listed or adopted for a new account.
   */
  listLocalBackups(characterId) {
    try {
      const records = listOwnerBackups();
      const backups = [];

      for (const { backup } of records) {
        if (!backup || typeof backup !== 'object') continue;
        if (backup.characterId !== characterId) continue;
        backups.push({
          id: backup.backupId,
          characterId: backup.characterId,
          backupReason: backup.backupReason,
          createdAt: backup.createdAt,
          version: backup.version,
          isLocal: true
        });
      }

      // Sort by creation date (newest first)
      backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log(`📋 Found ${backups.length} local backups for character ${characterId}`);
      return backups;

    } catch (error) {
      console.error('Error listing local backups:', error);
      return [];
    }
  }

  /**
   * Restore character from backup
   */
  async restoreFromBackup(backupId, characterId, userId) {
    try {
      // Wave B closure: capture the account generation at operation start; the
      // restore write must only land while that same owner is still active.
      const restoreContext = captureConsumerContext();
      if (!restoreContext.ok) {
        return { success: false, error: 'no-active-owner-scope' };
      }

      let backupData;

      if (backupId.startsWith(LEGACY_BACKUP_PREFIX)) {
        // Local backup from THIS verified owner. Legacy global backups are
        // unknown-owner sources: preserved, never auto-adopted.
        const backup = readOwnerBackup(backupId);
        if (!backup) {
          throw new Error('Local backup not found for the active account (legacy backups are preserved but not auto-adopted)');
        }
        if (backup.characterId && characterId && backup.characterId !== characterId) {
          throw new Error('Backup does not belong to the requested character');
        }
        backupData = backup;
      } else {
        // Firebase backup
        if (!this.isConfigured) {
          throw new Error('Firebase not configured');
        }

        const backupDoc = await getDocs(
          query(
            collection(db, BACKUP_COLLECTIONS.CHARACTER_BACKUPS),
            where('__name__', '==', backupId),
            where('userId', '==', userId)
          )
        );

        if (backupDoc.empty) {
          throw new Error('Backup not found or access denied');
        }

        backupData = backupDoc.docs[0].data();
      }

      // Create a new backup before restoring (safety measure)
      await this.createBackup(characterId, userId, 'pre_restore');

      // Fence the restore write to the owner that started the operation.
      if (!isConsumerContextCurrent(restoreContext.context)) {
        return { success: false, error: 'owner-context-changed' };
      }

      // Restore character data
      const restoredCharacter = {
        ...backupData.characterData,
        updatedAt: new Date().toISOString(),
        restoredFrom: {
          backupId,
          backupDate: backupData.createdAt,
          restoreDate: new Date().toISOString()
        }
      };

      // Save restored character
      await characterPersistenceService.saveCharacter(characterId, restoredCharacter);

      console.log(`✅ Character restored from backup: ${backupId}`);
      return {
        success: true,
        restoredCharacter,
        backupVersion: backupData.version
      };

    } catch (error) {
      console.error('Error restoring from backup:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if character needs automatic backup
   */
  shouldCreateAutoBackup(characterId, characterData) {
    if (!this.autoBackupEnabled) {
      return false;
    }

    const lastBackup = this.lastBackupTimes.get(characterId);
    const now = new Date();

    // Check time-based backup
    if (!lastBackup || (now - lastBackup) > (BACKUP_CONFIG.BACKUP_INTERVAL_HOURS * 60 * 60 * 1000)) {
      return { needed: true, reason: 'scheduled' };
    }

    // Check level-up backup
    if (BACKUP_CONFIG.BACKUP_ON_LEVEL_UP && this.isLevelUp(characterData)) {
      return { needed: true, reason: 'level_up' };
    }

    // Check major changes backup
    if (BACKUP_CONFIG.BACKUP_ON_MAJOR_CHANGES && this.hasMajorChanges(characterData)) {
      return { needed: true, reason: 'major_changes' };
    }

    return { needed: false };
  }

  /**
   * Automatically create backup if needed
   */
  async autoBackup(characterId, userId, characterData) {
    const backupCheck = this.shouldCreateAutoBackup(characterId, characterData);

    if (backupCheck.needed) {
      return await this.createBackup(characterId, userId, `auto_${backupCheck.reason}`, characterData);
    }

    return { success: true, skipped: true, reason: 'not_needed' };
  }

  /**
   * Clean up old backups to maintain storage limits
   */
  async cleanupOldBackups(characterId, userId) {
    if (!this.isConfigured) {
      return this.cleanupLocalBackups(characterId);
    }

    try {
      const backupsQuery = query(
        collection(db, BACKUP_COLLECTIONS.CHARACTER_BACKUPS),
        where('characterId', '==', characterId),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(backupsQuery);
      const backups = snapshot.docs;

      // Delete backups beyond the limit
      if (backups.length > BACKUP_CONFIG.MAX_BACKUPS_PER_CHARACTER) {
        const toDelete = backups.slice(BACKUP_CONFIG.MAX_BACKUPS_PER_CHARACTER);

        for (const backup of toDelete) {
          await deleteDoc(backup.ref);
        }

        console.log(`� - �️ Cleaned up ${toDelete.length} old backups for character ${characterId}`);
      }

    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  /**
   * Clean up old local backups for the active verified owner.
   * Only records inside the current owner scope are considered; legacy global
   * backups are never visited. The newest MAX are retained.
   */
  cleanupLocalBackups(characterId) {
    try {
      const records = listOwnerBackups()
        .filter(({ backup }) => backup && backup.characterId === characterId)
        .sort((a, b) => new Date(b.backup.createdAt) - new Date(a.backup.createdAt));

      if (records.length > BACKUP_CONFIG.MAX_BACKUPS_PER_CHARACTER) {
        const toDelete = records.slice(BACKUP_CONFIG.MAX_BACKUPS_PER_CHARACTER);

        toDelete.forEach(({ backup }) => {
          removeOwnerBackup(backup.backupId);
        });

        console.log(`🧹 Cleaned up ${toDelete.length} old local backups for character ${characterId}`);
      }

    } catch (error) {
      console.error('Error cleaning up local backups:', error);
    }
  }

  /**
   * Generate version number for backup
   */
  generateVersionNumber() {
    const now = new Date();
    return `v${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Check if character leveled up (simplified check)
   */
  isLevelUp(characterData) {
    // This would need to compare with previous character state
    // For now, we'll implement a simple check
    return false; // TODO: Implement proper level-up detection
  }

  /**
   * Check if character has major changes (simplified check)
   */
  hasMajorChanges(characterData) {
    // This would need to compare with previous character state
    // For now, we'll implement a simple check
    return false; // TODO: Implement proper major changes detection
  }

  /**
   * Get backup statistics
   */
  async getBackupStats(characterId, userId) {
    const backups = await this.listBackups(characterId, userId);

    return {
      totalBackups: backups.length,
      latestBackup: backups[0]?.createdAt || null,
      oldestBackup: backups[backups.length - 1]?.createdAt || null,
      totalSize: backups.reduce((sum, backup) => sum + (backup.dataSize || 0), 0),
      autoBackupEnabled: this.autoBackupEnabled
    };
  }

  /**
   * Enable/disable automatic backups
   */
  setAutoBackupEnabled(enabled) {
    this.autoBackupEnabled = enabled;
    console.log(`🔄 Auto backup ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Export singleton instance
const characterBackupService = new CharacterBackupService();
export default characterBackupService;
