/**
 * Recipes Index - Central export for all profession recipes
 * 
 * This file imports and combines all recipes from their respective profession files.
 */

// Import all recipe categories
import { BLACKSMITHING_RECIPES } from './blacksmithing.js';
import { ALCHEMY_RECIPES } from './alchemy.js';
import { TAILORING_RECIPES } from './tailoring.js';
import { LEATHERWORKING_RECIPES } from './leatherworking.js';
import { COOKING_RECIPES } from './cooking.js';
import { ENCHANTING_RECIPES } from './enchanting.js';
import { ENGINEERING_RECIPES } from './engineering.js';
import { JEWELCRAFTING_RECIPES } from './jewelcrafting.js';
import { MASONRY_RECIPES } from './masonry.js';

// Combine all recipes into a single array
export const ALL_RECIPES = [
  ...BLACKSMITHING_RECIPES,
  ...ALCHEMY_RECIPES,
  ...TAILORING_RECIPES,
  ...LEATHERWORKING_RECIPES,
  ...COOKING_RECIPES,
  ...ENCHANTING_RECIPES,
  ...ENGINEERING_RECIPES,
  ...JEWELCRAFTING_RECIPES,
  ...MASONRY_RECIPES
];

// Export individual categories for use elsewhere if needed
export {
  BLACKSMITHING_RECIPES,
  ALCHEMY_RECIPES,
  TAILORING_RECIPES,
  LEATHERWORKING_RECIPES,
  COOKING_RECIPES,
  ENCHANTING_RECIPES,
  ENGINEERING_RECIPES,
  JEWELCRAFTING_RECIPES,
  MASONRY_RECIPES
};

