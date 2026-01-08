/**
 * Masonry Recipes
 * 
 * Recipes for stonework and construction
 */

export const MASONRY_RECIPES = [
  {
    id: 'cut-granite-recipe',
    name: 'Cut Granite',
    profession: 'masonry',
    description: 'Cut rough stone into precise granite blocks.',
    requiredLevel: 1,
    resultItemId: 'cut-granite',
    resultQuantity: 1,
    materials: [
      { itemId: 'rough-stone', quantity: 3 }
    ],
    craftingTime: 8000,
    experienceGained: 2,
    category: 'stonework'
  },
  {
    id: 'slate-shards-recipe',
    name: 'Slate Shards',
    profession: 'masonry',
    description: 'Split stone into thin slate shards for roofing.',
    requiredLevel: 0,
    resultItemId: 'slate-shards',
    resultQuantity: 2,
    materials: [
      { itemId: 'rough-stone', quantity: 1 }
    ],
    craftingTime: 5000,
    experienceGained: 1,
    category: 'stonework'
  }
];

