// Loot Item Utilities
// Utility functions for processing loot items in creature loot tables

import { getLootItemById } from '../data/lootItemsData';
import useItemStore from '../store/itemStore';

/**
 * Process a creature's loot table to replace itemId references with actual item data
 * @param {Object} creature - The creature object with a lootTable
 * @param {Object} itemStore - Optional item store state to use for lookups
 * @returns {Object} - The creature with processed loot items
 */
export const processCreatureLoot = (creature, itemStore = null) => {
  if (!creature || !creature.lootTable || !creature.lootTable.items) {
    return creature;
  }

  // Get the store state and check if it's ready
  const storeState = itemStore || useItemStore.getState();
  const itemsArray = Array.isArray(storeState.items) ? storeState.items : [];

  // If the store isn't ready (no items), return the creature unprocessed
  // This prevents console spam during initial load
  if (itemsArray.length === 0) {
    return creature;
  }

  // Create a deep copy of the creature to avoid modifying the original
  const processedCreature = { ...creature };
  
  // Process each loot item
  processedCreature.lootTable = {
    ...creature.lootTable,
    items: creature.lootTable.items.map(item => {
      // If the item already has all properties, process quantity and return it
      if (!item.itemId && item.name && item.type && item.iconId) {
        // Convert quantity object to actual number for inline items too
        let processedQuantity = item.quantity || 1;
        if (typeof processedQuantity === 'object' && processedQuantity.min !== undefined && processedQuantity.max !== undefined) {
          processedQuantity = Math.floor(Math.random() * (processedQuantity.max - processedQuantity.min + 1)) + processedQuantity.min;
        }

        return {
          ...item,
          // Ensure inline items have a proper ID
          id: item.id || `inline_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          quantity: processedQuantity,
          // Ensure required inventory properties
          width: item.width || 1,
          height: item.height || 1,
          stackable: item.stackable !== undefined ? item.stackable : (item.type === 'material' || item.type === 'miscellaneous'),
          maxStackSize: item.maxStackSize || (item.stackable !== false ? 10 : 1),
          weight: item.weight || 0.1
        };
      }

      // If the item has an itemId, look up the item data
      if (item.itemId) {
        // Use the pre-validated items array from above
        const mainLibraryItem = itemsArray.find(i => i && i.id === item.itemId);

        if (mainLibraryItem) {
          // Convert quantity object to actual number for loot processing
          let processedQuantity = item.quantity || { min: 1, max: 1 };
          if (typeof processedQuantity === 'object' && processedQuantity.min !== undefined && processedQuantity.max !== undefined) {
            processedQuantity = Math.floor(Math.random() * (processedQuantity.max - processedQuantity.min + 1)) + processedQuantity.min;
          }

          return {
            ...mainLibraryItem,
            id: mainLibraryItem.id,
            dropChance: item.dropChance || 100,
            quantity: processedQuantity
          };
        }

        // Fallback to loot items data for backwards compatibility
        const lootItem = getLootItemById(item.itemId);
        if (lootItem) {
          // Convert quantity object to actual number for loot processing
          let processedQuantity = item.quantity || { min: 1, max: 1 };
          if (typeof processedQuantity === 'object' && processedQuantity.min !== undefined && processedQuantity.max !== undefined) {
            processedQuantity = Math.floor(Math.random() * (processedQuantity.max - processedQuantity.min + 1)) + processedQuantity.min;
          }

          // Add missing properties that are required for inventory
          return {
            ...lootItem,
            id: lootItem.id,
            dropChance: item.dropChance || 100,
            quantity: processedQuantity,
            // Add missing inventory properties with sensible defaults
            width: lootItem.width || 1,
            height: lootItem.height || 1,
            stackable: lootItem.stackable !== undefined ? lootItem.stackable : (lootItem.type === 'material' || lootItem.type === 'miscellaneous'),
            maxStackSize: lootItem.maxStackSize || (lootItem.stackable !== false ? 10 : 1),
            weight: lootItem.weight || 0.1
          };
        }
      }

      // Fallback for items not found in the item store
      // This should be rare now that all creature loot items are in the main item store
      if (item.itemId) {
        console.info(`Creating fallback for loot item '${item.itemId}' - item not found in store. Consider adding this item to the main item library.`);
      } else {
        console.warn('Malformed loot item found (no itemId and missing required properties), creating fallback:', item);
      }

      return {
        id: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        name: item.name || (item.itemId ? `Missing Item: ${item.itemId}` : 'Unknown Item'),
        type: item.type || 'miscellaneous',
        quality: item.quality || 'common',
        description: item.description || (item.itemId ? `This item (${item.itemId}) could not be loaded from the item library.` : 'A mysterious item.'),
        iconId: item.iconId || 'inv_misc_questionmark',
        quantity: 1,
        dropChance: item.dropChance || 100,
        width: 1,
        height: 1,
        stackable: false,
        maxStackSize: 1,
        weight: 0.1
      };
    })
  };
  
  return processedCreature;
};

/**
 * Process an array of creatures to replace itemId references with actual item data
 * @param {Array} creatures - Array of creature objects
 * @param {Object} itemStore - Optional item store state to use for lookups
 * @returns {Array} - Array of creatures with processed loot items
 */
export const processCreaturesLoot = (creatures, itemStore = null) => {
  if (!Array.isArray(creatures)) {
    return [];
  }

  return creatures.map(creature => processCreatureLoot(creature, itemStore));
};
