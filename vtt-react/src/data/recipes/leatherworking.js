/**
 * Leatherworking Recipes
 * 
 * Recipes for crafting leather armor and leather goods
 */

export const LEATHERWORKING_RECIPES = [
  {
    id: 'hardened-leather-recipe',
    name: 'Hardened Leather',
    profession: 'leatherworking',
    description: 'Treat and harden leather for use in armor.',
    requiredLevel: 1,
    resultItemId: 'hardened-leather',
    resultQuantity: 1,
    materials: [
      { itemId: 'thick-hide', quantity: 2 },
      { itemId: 'resin-glue', quantity: 1 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'leather'
  },
  {
    id: 'beast-sinew-recipe',
    name: 'Beast Sinew',
    profession: 'leatherworking',
    description: 'Extract and prepare sinew from animal hides.',
    requiredLevel: 0,
    resultItemId: 'beast-sinew',
    resultQuantity: 2,
    materials: [
      { itemId: 'thick-hide', quantity: 1 }
    ],
    craftingTime: 3000,
    experienceGained: 1,
    category: 'processing'
  },
  {
    id: 'leather-straps-recipe',
    name: 'Leather Straps',
    profession: 'leatherworking',
    description: 'Cut leather into straps for binding and securing.',
    requiredLevel: 0,
    resultItemId: 'leather-straps',
    resultQuantity: 5,
    materials: [
      { itemId: 'light-hide', quantity: 1 }
    ],
    craftingTime: 4000,
    experienceGained: 1,
    category: 'components'
  }
];

