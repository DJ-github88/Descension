// Loot Item Utilities
// Utility functions for processing loot items in creature loot tables

import { getLootItemById } from '../data/lootItemsData';

/**
 * Process a creature's loot table to replace itemId references with actual item data
 * @param {Object} creature - The creature object with a lootTable
 * @returns {Object} - The creature with processed loot items
 */
export const processCreatureLoot = (creature) => {
  if (!creature || !creature.lootTable || !creature.lootTable.items) {
    return creature;
  }

  // Create a deep copy of the creature to avoid modifying the original
  const processedCreature = { ...creature };
  
  // Process each loot item
  processedCreature.lootTable = {
    ...creature.lootTable,
    items: creature.lootTable.items.map(item => {
      // If the item already has all properties, return it as is
      if (!item.itemId && item.name && item.type && item.iconId) {
        return item;
      }

      // If the item has an itemId, look up the item data
      if (item.itemId) {
        const lootItem = getLootItemById(item.itemId);
        
        // If the item is found, merge it with the loot table item
        if (lootItem) {
          return {
            ...lootItem,
            id: lootItem.id,
            dropChance: item.dropChance || 100,
            quantity: item.quantity || { min: 1, max: 1 }
          };
        }
      }
      
      // If the item is not found, return the original item
      return item;
    })
  };
  
  return processedCreature;
};

/**
 * Process an array of creatures to replace itemId references with actual item data
 * @param {Array} creatures - Array of creature objects
 * @returns {Array} - Array of creatures with processed loot items
 */
export const processCreaturesLoot = (creatures) => {
  if (!Array.isArray(creatures)) {
    return [];
  }
  
  return creatures.map(creature => processCreatureLoot(creature));
};
