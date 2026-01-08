/**
 * Jewelcrafting Recipes
 * 
 * Recipes for crafting jewelry and gem work
 */

export const JEWELCRAFTING_RECIPES = [
  {
    id: 'cut-gem-recipe',
    name: 'Cut Gem',
    profession: 'jewelcrafting',
    description: 'Cut and polish a rough gem into a usable jewel.',
    requiredLevel: 1,
    resultItemId: 'cut-gem',
    resultQuantity: 1,
    materials: [
      { itemId: 'rough-stone', quantity: 2 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'gems'
  }
];

