/**
 * Items Index - Central export for all item types
 * 
 * This file imports and combines all items from their respective category files.
 * This modular structure prevents the main itemStore.js from becoming massive.
 *
 * Lore enrichment: All items are automatically enriched with lore connections
 * from itemLoreData.js, linking each item to the world's regions, factions,
 * events, and figures.
 */

// Import all item categories
import { ALL_WEAPONS, WEAPONS } from './weapons/index.js';
import { ALL_ARMOR, ARMOR } from './armor/index.js';
import { ALL_CONSUMABLES, CONSUMABLES } from './consumables/index.js';
import { ALL_ACCESSORIES, ACCESSORIES } from './accessories/index.js';
import { CONTAINERS } from './containers/index.js';
import { MISCELLANEOUS } from './miscellaneous/index.js';
import { RECIPE_ITEMS } from './recipes.js';
import { CURRENCY } from './currency/index.js';
import { enrichItemsWithLore } from './enrichItemsWithLore';

// Combine all items into a single array
const COMBINED_ITEMS = [
  ...ALL_WEAPONS,
  ...ALL_ARMOR,
  ...ALL_CONSUMABLES,
  ...ALL_ACCESSORIES,
  ...CONTAINERS,
  ...MISCELLANEOUS,
  ...RECIPE_ITEMS,
  ...CURRENCY
];

// Enrich all items with lore data
export const COMPREHENSIVE_ITEMS = enrichItemsWithLore(COMBINED_ITEMS);

// Export individual categories for use elsewhere if needed
export {
  WEAPONS,
  ALL_WEAPONS,
  ALL_ARMOR,
  ARMOR,
  ALL_CONSUMABLES,
  CONSUMABLES,
  ALL_ACCESSORIES,
  ACCESSORIES,
  CONTAINERS,
  MISCELLANEOUS,
  RECIPE_ITEMS,
  CURRENCY
};

