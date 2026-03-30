/**
 * Blacksmithing Recipes
 * 
 * Recipes for crafting weapons, armor, and metal items
 */

export const BLACKSMITHING_RECIPES = [
  {
    id: 'copper-ingot-recipe',
    name: 'Copper Ingot',
    profession: 'blacksmithing',
    description: 'Smelt red copper ore into a usable copper ingot.',
    requiredLevel: 0,
    resultItemId: 'copper-ingot',
    resultQuantity: 1,
    materials: [
      { itemId: 'red-copper', quantity: 2 }
    ],
    craftingTime: 5000,
    experienceGained: 1,
    category: 'smelting'
  },
  {
    id: 'iron-ingot-recipe',
    name: 'Iron Ingot',
    profession: 'blacksmithing',
    description: 'Smelt bog iron ore into a usable iron ingot.',
    requiredLevel: 1,
    resultItemId: 'iron-ingot',
    resultQuantity: 1,
    materials: [
      { itemId: 'bog-iron', quantity: 2 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'smelting'
  },
  {
    id: 'metal-rivets-recipe',
    name: 'Metal Rivets',
    profession: 'blacksmithing',
    description: 'Craft small metal rivets from copper ingots.',
    requiredLevel: 0,
    resultItemId: 'metal-rivets',
    resultQuantity: 10,
    materials: [
      { itemId: 'copper-ingot', quantity: 1 }
    ],
    craftingTime: 3000,
    experienceGained: 1,
    category: 'components'
  },
  {
    id: 'binding-wire-recipe',
    name: 'Binding Wire',
    profession: 'blacksmithing',
    description: 'Draw fine wire from metal ingots for binding components.',
    requiredLevel: 1,
    resultItemId: 'binding-wire',
    resultQuantity: 20,
    materials: [
      { itemId: 'copper-ingot', quantity: 1 }
    ],
    craftingTime: 4000,
    experienceGained: 2,
    category: 'components'
  },
  {
    id: 'weapon-blank-recipe',
    name: 'Weapon Blank',
    profession: 'blacksmithing',
    description: 'Forge a basic weapon blank ready for finishing.',
    requiredLevel: 2,
    resultItemId: 'weapon-blank',
    resultQuantity: 1,
    materials: [
      { itemId: 'iron-ingot', quantity: 2 },
      { itemId: 'metal-rivets', quantity: 3 }
    ],
    craftingTime: 15000,
    experienceGained: 5,
    category: 'weapons'
  },
  {
    id: 'armor-frame-recipe',
    name: 'Armor Frame',
    profession: 'blacksmithing',
    description: 'Craft a basic armor frame ready for plating.',
    requiredLevel: 2,
    resultItemId: 'armor-frame',
    resultQuantity: 1,
    materials: [
      { itemId: 'iron-ingot', quantity: 3 },
      { itemId: 'metal-rivets', quantity: 5 }
    ],
    craftingTime: 18000,
    experienceGained: 5,
    category: 'armor'
  }
];

