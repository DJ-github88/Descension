/**
 * Character Data Migration Service
 * 
 * This service handles migration of character data from localStorage to Firebase
 * and manages data format updates between versions.
 */

import characterPersistenceService from './characterPersistenceService';
import { createScopedNativeFamily } from '../../persistence/scopedNativeFamily';

// Migration version tracking
const MIGRATION_VERSION = '1.0.0';
const MIGRATION_KEY = 'mythrill-migration-status';

// Wave B closure: migration status is verified-owner scoped private metadata.
// The retired global key is quarantined once per owner, never adopted.
const migrationStatusFamily = createScopedNativeFamily({
  familyId: 'character.migrationStatus',
  legacyKeys: [MIGRATION_KEY]
});

const EMPTY_MIGRATION_STATUS = Object.freeze({
  version: '0.0.0',
  lastMigration: null,
  migratedCharacters: [],
  failedMigrations: []
});

/**
 * Character Migration Service Class
 */
class CharacterMigrationService {
  constructor() {
    this.migrationStatus = this.loadMigrationStatus();
  }

  /**
   * Load migration status from localStorage
   */
  loadMigrationStatus() {
    try {
      const status = migrationStatusFamily.load(['status']);
      return status && typeof status === 'object' ? status : { ...EMPTY_MIGRATION_STATUS };
    } catch (error) {
      console.error('Error loading migration status:', error);
      return { ...EMPTY_MIGRATION_STATUS };
    }
  }

  /**
   * Save migration status to verified-owner scoped storage
   */
  saveMigrationStatus() {
    try {
      migrationStatusFamily.save(this.migrationStatus, ['status']);
    } catch (error) {
      console.error('Error saving migration status:', error);
    }
  }

  /**
   * Check if migration is needed
   */
  isMigrationNeeded() {
    // Check if we have localStorage characters that haven't been migrated
    const localCharacters = this.getLocalStorageCharacters();
    const unmigrated = localCharacters.filter(char => 
      !this.migrationStatus.migratedCharacters.includes(char.id)
    );
    
    return unmigrated.length > 0 || this.migrationStatus.version !== MIGRATION_VERSION;
  }

  /**
   * Get characters from the retired global roster key.
   *
   * Wave B closure: the legacy global roster is unknown-owner data. There is no
   * ownership proof, so it is preserved untouched but never auto-adopted or
   * auto-migrated for whichever account happens to be signed in. Returning an
   * empty list makes every migration decision a no-op while the raw source
   * stays recoverable on disk.
   */
  getLocalStorageCharacters() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('mythrill-characters') !== null) {
        console.warn(
          '⚠️ Legacy global character roster detected. It is preserved but not auto-migrated (unknown owner).'
        );
      }
    } catch (_error) {
      // fail safe
    }
    return [];
  }

  /**
   * Migrate a single character to Firebase
   */
  async migrateCharacter(character, userId) {
    try {
      // Transform character data to ensure compatibility
      const migratedCharacter = this.transformCharacterData(character);

      // Create character in Firebase
      const characterId = await characterPersistenceService.createCharacter(migratedCharacter, userId);

      // Update migration status
      this.migrationStatus.migratedCharacters.push(character.id);

      return { success: true, characterId };

    } catch (error) {
      console.error(`❌ Failed to migrate character ${character.name}:`, error);
      
      // Track failed migration
      this.migrationStatus.failedMigrations.push({
        characterId: character.id,
        characterName: character.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Transform character data to ensure compatibility with Firebase structure
   */
  transformCharacterData(character) {
    return {
      id: character.id,
      name: character.name || 'Unnamed Character',
      race: character.race || '',
      subrace: character.subrace || '',
      class: character.class || 'Fighter',
      level: character.level || 1,
      alignment: character.alignment || 'Neutral Good',
      exhaustionLevel: character.exhaustionLevel || 0,
      
      // Ensure stats structure
      stats: {
        strength: character.stats?.strength || 10,
        agility: character.stats?.agility || 10,
        constitution: character.stats?.constitution || 10,
        intelligence: character.stats?.intelligence || 10,
        spirit: character.stats?.spirit || 10,
        charisma: character.stats?.charisma || 10
      },
      
      // Ensure resources structure
      resources: {
        health: character.health || character.resources?.health || { current: 100, max: 100 },
        mana: character.mana || character.resources?.mana || { current: 50, max: 50 },
        actionPoints: character.actionPoints || character.resources?.actionPoints || { current: 3, max: 3 }
      },
      
      // Ensure inventory structure
      inventory: {
        items: character.inventory?.items || character.items || [],
        currency: character.inventory?.currency || character.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
        encumbranceState: character.inventory?.encumbranceState || 'normal'
      },
      
      // Ensure equipment structure
      equipment: {
        weapon: character.equipment?.weapon || null,
        armor: character.equipment?.armor || null,
        shield: character.equipment?.shield || null,
        accessories: character.equipment?.accessories || []
      },
      
      // Ensure other fields
      spells: character.spells || [],
      experience: character.experience || 0,
      lore: character.lore || {},
      
      // Preserve timestamps
      createdAt: character.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Migrate all characters for a user
   */
  async migrateAllCharacters(userId) {
    if (!userId) {
      throw new Error('User ID is required for migration');
    }

    const localCharacters = this.getLocalStorageCharacters();
    const unmigrated = localCharacters.filter(char => 
      !this.migrationStatus.migratedCharacters.includes(char.id)
    );

    if (unmigrated.length === 0) {
      return { success: true, migrated: 0, failed: 0 };
    }

    const results = {
      success: true,
      migrated: 0,
      failed: 0,
      errors: []
    };

    for (const character of unmigrated) {
      const result = await this.migrateCharacter(character, userId);
      
      if (result.success) {
        results.migrated++;
      } else {
        results.failed++;
        results.errors.push({
          characterName: character.name,
          error: result.error
        });
      }
    }

    // Update migration status
    this.migrationStatus.version = MIGRATION_VERSION;
    this.migrationStatus.lastMigration = new Date().toISOString();
    this.saveMigrationStatus();

    if (results.failed > 0) {
      results.success = false;
    }

    return results;
  }

  /**
   * Legacy migration backup.
   *
   * Wave B closure: duplicating unknown-owner legacy data into the active
   * owner's scope would be an automatic cross-account adoption, and the raw
   * legacy records are already the recoverable copy. No copy is created.
   * @returns {null}
   */
  createBackup() {
    console.warn('⚠️ Legacy migration backup refused: unknown-owner source is preserved in place.');
    return null;
  }

  /**
   * Restore from a legacy migration backup.
   *
   * Wave B closure: writing the retired global roster key would be an active
   * global private writer and could adopt another account's characters.
   */
  restoreFromBackup(backupKey) {
    void backupKey;
    throw new Error('Legacy global character restore is retired; the raw source is preserved but never auto-adopted.');
  }

  /**
   * Get migration summary
   */
  getMigrationSummary() {
    const localCharacters = this.getLocalStorageCharacters();
    const totalCharacters = localCharacters.length;
    const migratedCount = this.migrationStatus.migratedCharacters.length;
    const failedCount = this.migrationStatus.failedMigrations.length;
    const pendingCount = totalCharacters - migratedCount;

    return {
      totalCharacters,
      migratedCount,
      failedCount,
      pendingCount,
      isComplete: pendingCount === 0,
      lastMigration: this.migrationStatus.lastMigration,
      version: this.migrationStatus.version,
      failedMigrations: this.migrationStatus.failedMigrations
    };
  }

  /**
   * Reset migration status (for testing or re-migration)
   */
  resetMigrationStatus() {
    this.migrationStatus = {
      version: '0.0.0',
      lastMigration: null,
      migratedCharacters: [],
      failedMigrations: []
    };
    this.saveMigrationStatus();
  }

  /**
   * Legacy migration cleanup.
   *
   * Wave B closure: the retired global roster/active-character keys are the
   * sole recovery copies for an unknown owner. Cleanup never deletes them.
   * @returns {false}
   */
  cleanupAfterMigration() {
    console.warn('⚠️ Legacy migration cleanup refused: the global source is the last recoverable copy.');
    return false;
  }
}

// Export singleton instance
const characterMigrationService = new CharacterMigrationService();
export default characterMigrationService;
