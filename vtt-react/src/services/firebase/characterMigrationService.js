/**
 * Character Data Migration Service
 * 
 * This service handles migration of character data from localStorage to Firebase
 * and manages data format updates between versions.
 */

import characterPersistenceService from './characterPersistenceService';

// Migration version tracking
const MIGRATION_VERSION = '1.0.0';
const MIGRATION_KEY = 'mythrill-migration-status';

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
      const status = localStorage.getItem(MIGRATION_KEY);
      return status ? JSON.parse(status) : {
        version: '0.0.0',
        lastMigration: null,
        migratedCharacters: [],
        failedMigrations: []
      };
    } catch (error) {
      console.error('Error loading migration status:', error);
      return {
        version: '0.0.0',
        lastMigration: null,
        migratedCharacters: [],
        failedMigrations: []
      };
    }
  }

  /**
   * Save migration status to localStorage
   */
  saveMigrationStatus() {
    try {
      localStorage.setItem(MIGRATION_KEY, JSON.stringify(this.migrationStatus));
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
   * Get characters from localStorage
   */
  getLocalStorageCharacters() {
    try {
      const savedCharacters = localStorage.getItem('mythrill-characters');
      return savedCharacters ? JSON.parse(savedCharacters) : [];
    } catch (error) {
      console.error('Error loading characters from localStorage:', error);
      return [];
    }
  }

  /**
   * Migrate a single character to Firebase
   */
  async migrateCharacter(character, userId) {
    try {
      console.log(`🔄 Migrating character: ${character.name} (${character.id})`);

      // Transform character data to ensure compatibility
      const migratedCharacter = this.transformCharacterData(character);

      // Create character in Firebase
      const characterId = await characterPersistenceService.createCharacter(migratedCharacter, userId);
      
      // Update migration status
      this.migrationStatus.migratedCharacters.push(character.id);
      
      console.log(`✅ Character migrated successfully: ${character.name} (${characterId})`);
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
      console.log('✅ No characters need migration');
      return { success: true, migrated: 0, failed: 0 };
    }

    console.log(`🔄 Starting migration of ${unmigrated.length} characters...`);

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

    console.log(`✅ Migration completed: ${results.migrated} successful, ${results.failed} failed`);
    return results;
  }

  /**
   * Create backup of localStorage data before migration
   */
  createBackup() {
    try {
      const characters = this.getLocalStorageCharacters();
      const backup = {
        characters,
        timestamp: new Date().toISOString(),
        version: MIGRATION_VERSION
      };

      const backupKey = `mythrill-backup-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      console.log(`✅ Backup created: ${backupKey}`);
      return backupKey;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  }

  /**
   * Restore from backup
   */
  restoreFromBackup(backupKey) {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('Backup not found');
      }

      const backup = JSON.parse(backupData);
      localStorage.setItem('mythrill-characters', JSON.stringify(backup.characters));
      
      console.log(`✅ Restored from backup: ${backupKey}`);
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      throw new Error('Failed to restore from backup');
    }
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
    console.log('✅ Migration status reset');
  }

  /**
   * Clean up old localStorage data after successful migration
   */
  cleanupAfterMigration() {
    try {
      // Only clean up if all characters have been successfully migrated
      const summary = this.getMigrationSummary();
      
      if (summary.isComplete && summary.failedCount === 0) {
        // Keep a final backup before cleanup
        const backupKey = this.createBackup();
        
        // Clear the characters from localStorage
        localStorage.removeItem('mythrill-characters');
        localStorage.removeItem('mythrill-active-character');
        
        console.log(`✅ localStorage cleaned up. Backup available at: ${backupKey}`);
        return true;
      } else {
        console.warn('⚠️ Cannot cleanup: migration not complete or has failures');
        return false;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      return false;
    }
  }
}

// Export singleton instance
const characterMigrationService = new CharacterMigrationService();
export default characterMigrationService;
