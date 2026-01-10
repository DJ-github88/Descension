
import { getDefaultCreatureIconByType } from './assetManager';

/**
 * Convert an icon ID to a proper creature icon path
 * @param {string} iconId - Current icon ID (may be ability icon path or WoW icon ID)
 * @param {string} creatureType - Creature type (humanoid, beast, etc.)
 * @returns {string} - Proper creature icon path
 */
export const convertToCreatureIcon = (iconId, creatureType) => {
  // If already a creature icon path (contains known creature folder), return as-is
  const creatureFolders = [
    'Dark Elf', 'Demon', 'Dwarf', 'Elves', 'Fairy', 'Halfling', 'Human',
    'Kobolds', 'Monsters', 'More Demons', 'More Elves', 'More Humans',
    'More Monsters', 'More Undead', 'Orc and Goblins', 'Pirates', 'Undead'
  ];

  if (iconId && iconId.includes('/')) {
    const firstSegment = iconId.split('/')[0];
    if (creatureFolders.some(folder => iconId.startsWith(folder + '/'))) {
      // Already a creature icon, return as-is
      return iconId;
    }
  }

  // If it's an ability icon path or WoW icon ID, convert to creature icon
  const abilityFolders = ['combat', 'defensive', 'magic', 'movement', 'social', 'utility'];
  if (iconId && iconId.includes('/') && abilityFolders.includes(iconId.split('/')[0])) {
    // It's an ability icon, convert to creature icon based on type
    return getDefaultCreatureIconByType(creatureType);
  }

  if (iconId && (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_'))) {
    // It's a WoW icon ID, convert to creature icon based on type
    return getDefaultCreatureIconByType(creatureType);
  }

  // If empty or unknown, use default based on type
  if (!iconId || iconId.trim() === '') {
    return getDefaultCreatureIconByType(creatureType);
  }

  // Unknown format, use default
  return getDefaultCreatureIconByType(creatureType);
};

/**
 * Migrate all creatures in the store to use proper creature icons
 * @param {Array} creatures - Array of all creatures
 * @returns {Object} - Migration results including updated creatures array
 */
export const migrateCreatureIcons = (creatures) => {
  let migrated = 0;
  let skipped = 0;
  const errors = [];

  // Create a copy of the array to modify
  const updatedCreatures = [...creatures];

  updatedCreatures.forEach((creature, index) => {
    try {
      const currentIcon = creature.tokenIcon;
      const newIcon = convertToCreatureIcon(currentIcon, creature.type);

      // Only update if the icon actually changed
      if (currentIcon !== newIcon) {
        updatedCreatures[index] = { ...creature, tokenIcon: newIcon };
        migrated++;
        console.log(`[Icon Migration] Updated ${creature.name}: ${currentIcon} → ${newIcon}`);
      } else {
        skipped++;
      }
    } catch (error) {
      errors.push({ creatureId: creature.id, creatureName: creature.name, error: error.message });
      console.error(`[Icon Migration] Error migrating ${creature.name}:`, error);
    }
  });

  return {
    migrated,
    skipped,
    errors,
    total: creatures.length,
    updatedCreatures
  };
};

/**
 * Run migration on app startup
 * This should be called from the app initialization
 */
export const runCreatureIconMigration = () => {
  // Dynamically import creatureStore to avoid circular dependencies
  import('../store/creatureStore').then(({ default: useCreatureStore }) => {
    const creatureState = useCreatureStore.getState();

    // Get creatures from creatureStore (library reference)
    const creatures = creatureState.creatures || [];

    if (creatures.length === 0) {
      console.log('[Icon Migration] No creatures to migrate');
      return;
    }

    console.log(`[Icon Migration] Starting migration for ${creatures.length} creatures...`);
    const results = migrateCreatureIcons(creatures);

    if (results.migrated > 0) {
      // Update the store with the new creatures array
      creatureState.setCreatures(results.updatedCreatures);
      console.log('[Icon Migration] Saved migrated creatures to store');
    }

    console.log('[Icon Migration] Complete:', {
      migrated: results.migrated,
      skipped: results.skipped,
      errors: results.errors.length,
      total: results.total
    });

    if (results.errors.length > 0) {
      console.warn('[Icon Migration] Errors:', results.errors);
    }
  }).catch(error => {
    console.error('[Icon Migration] Failed to run migration:', error);
  });
};
