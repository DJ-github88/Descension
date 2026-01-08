/**
 * Items Index - Central export for all item types
 * 
 * This file imports and combines all items from their respective category files.
 * This modular structure prevents the main itemStore.js from becoming massive.
 */

// Import all item categories
import { WEAPONS } from './weapons/index.js';
import { ARMOR } from './armor/index.js';
import { CONSUMABLES } from './consumables/index.js';
import { ACCESSORIES } from './accessories/index.js';
import { CONTAINERS } from './containers/index.js';
import { MISCELLANEOUS } from './miscellaneous/index.js';
import { RECIPE_ITEMS } from './recipes.js';
import { CURRENCY } from './currency/index.js';

// Combine all items into a single array
export const COMPREHENSIVE_ITEMS = [
  ...WEAPONS,
  ...ARMOR,
  ...CONSUMABLES,
  ...ACCESSORIES,
  ...CONTAINERS,
  ...MISCELLANEOUS,
  ...RECIPE_ITEMS,
  ...CURRENCY
];

// Export individual categories for use elsewhere if needed
export {
  WEAPONS,
  ARMOR,
  CONSUMABLES,
  ACCESSORIES,
  CONTAINERS,
  MISCELLANEOUS,
  RECIPE_ITEMS,
  CURRENCY
};

