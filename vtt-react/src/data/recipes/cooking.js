/**
 * Cooking Recipes
 * 
 * Recipes for preparing food and meals
 */

export const COOKING_RECIPES = [
  {
    id: 'dried-rations-recipe',
    name: 'Dried Rations',
    profession: 'cooking',
    description: 'Preserve and dry food for long-term storage.',
    requiredLevel: 0,
    resultItemId: 'dried-rations',
    resultQuantity: 3,
    materials: [
      { itemId: 'fresh-meat', quantity: 1 },
      { itemId: 'preserving-salt', quantity: 1 }
    ],
    craftingTime: 5000,
    experienceGained: 1,
    category: 'preservation'
  },
  {
    id: 'spice-blend-recipe',
    name: 'Spice Blend',
    profession: 'cooking',
    description: 'Blend various spices for enhanced flavor.',
    requiredLevel: 1,
    resultItemId: 'spice-blend',
    resultQuantity: 1,
    materials: [
      { itemId: 'bitterroot', quantity: 2 },
      { itemId: 'crystallized-salt', quantity: 1 }
    ],
    craftingTime: 4000,
    experienceGained: 2,
    category: 'seasoning'
  },
  {
    id: 'cooked-meal-recipe',
    name: 'Cooked Meal',
    profession: 'cooking',
    description: 'Prepare a hearty cooked meal from fresh ingredients.',
    requiredLevel: 1,
    resultItemId: 'cooked-meal',
    resultQuantity: 1,
    materials: [
      { itemId: 'fresh-meat', quantity: 1 },
      { itemId: 'root-vegetables', quantity: 2 },
      { itemId: 'spice-blend', quantity: 1 }
    ],
    craftingTime: 8000,
    experienceGained: 3,
    category: 'meals'
  }
];

