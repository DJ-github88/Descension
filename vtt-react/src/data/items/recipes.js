/**
 * Recipe Items
 * 
 * Converts recipes into items that appear in the item library
 * These are recipe scrolls that can be viewed and learned
 */

import { ALL_RECIPES } from '../recipes/index.js';

// Convert recipes to items for the library
export const RECIPE_ITEMS = ALL_RECIPES.map(recipe => {
  // Determine quality based on required level
  let quality = 'common';
  if (recipe.requiredLevel >= 5) quality = 'epic';
  else if (recipe.requiredLevel >= 3) quality = 'rare';
  else if (recipe.requiredLevel >= 1) quality = 'uncommon';

  return {
    id: `${recipe.id}-scroll`,
    name: `Recipe: ${recipe.name}`,
    type: 'recipe',
    quality: quality,
    description: recipe.description, // Use recipe description directly - tooltip will show profession/level separately
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: {
      gold: 0,
      silver: Math.max(1, Math.floor(recipe.requiredLevel * 2.5)),
      copper: 50
    },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    // Recipe-specific properties
    recipeId: recipe.id,
    requiredProfession: recipe.profession,
    requiredLevel: recipe.requiredLevel,
    itemLevel: (recipe.requiredLevel * 10) + 10,
    isConsumable: true,
    bindOnPickup: false,
    unique: false
  };
});

