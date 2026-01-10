/**
 * Migration utility to convert creature icons from ability icons to proper creature icons
 * This fixes creatures that have ability icon paths (e.g., "combat/beast-paw-claws") 
 * and converts them to creature icons based on their type
 */

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
 * @param {Function} updateCreature - Function to update a creature (from store)
 * @param {Array} creatures - Array of all creatures
 * @returns {Object} - Migration results
 */
export const migrateCreatureIcons = (updateCreature, creatures) => {
  let migrated = 0;
  let skipped = 0;
  const errors = [];

  creatures.forEach(creature => {
    try {
      const currentIcon = creature.tokenIcon;
      const newIcon = convertToCreatureIcon(currentIcon, creature.type);

      // Only update if the icon actually changed
      if (currentIcon !== newIcon) {
        updateCreature(creature.id, { tokenIcon: newIcon });
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
    total: creatures.length
  };
};

/**
 * Run migration on app startup
 * This should be called from the app initialization
 */
export const runCreatureIconMigration = () => {
  // Dynamically import both stores - creatureStore for data, gameStore for updateCreature method
  Promise.all([
    import('../store/creatureStore'),
    import('../store/gameStore')
  ]).then(([{ default: useCreatureStore }, { default: useGameStore }]) => {
    const creatureState = useCreatureStore.getState();
    const gameState = useGameStore.getState();

    // Get creatures from creatureStore (library reference)
    const creatures = creatureState.creatures || [];

    if (creatures.length === 0) {
      console.log('[Icon Migration] No creatures to migrate');
      return;
    }

    // Use updateCreature from gameStore (where the method exists)
    const updateCreature = gameState.updateCreature;

    if (typeof updateCreature !== 'function') {
      console.warn('[Icon Migration] updateCreature method not available, skipping migration');
      return;
    }

    console.log(`[Icon Migration] Starting migration for ${creatures.length} creatures...`);
    const results = migrateCreatureIcons(updateCreature, creatures);

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

