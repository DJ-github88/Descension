/**
 * Engineering Recipes
 * 
 * Recipes for crafting mechanical devices and tools
 */

export const ENGINEERING_RECIPES = [
  {
    id: 'tool-kit-recipe',
    name: 'Tool Kit',
    profession: 'engineering',
    description: 'Assemble a basic toolkit with essential crafting tools.',
    requiredLevel: 1,
    resultItemId: 'tool-kit',
    resultQuantity: 1,
    materials: [
      { itemId: 'metal-rivets', quantity: 5 },
      { itemId: 'leather-straps', quantity: 3 },
      { itemId: 'binding-wire', quantity: 2 }
    ],
    craftingTime: 10000,
    experienceGained: 3,
    category: 'tools'
  }
];

