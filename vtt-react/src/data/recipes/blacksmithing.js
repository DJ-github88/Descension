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
    description: 'Smelted in Schratling ironwood-bark forges that burn low and slow. Smelt red copper ore into a usable copper ingot.',
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
    description: 'Forged from Waste-Solari bog-iron drawn cold from the marshes. Smelt bog iron ore into a usable iron ingot.',
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
    description: 'Hammered out in Emberspire crucibles tended by Sol\'s Breath smiths. Craft small metal rivets from copper ingots.',
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
    id: 'weapon-blank-recipe',
    name: 'Weapon Blank',
    profession: 'blacksmithing',
    description: 'A Waste-Solari-forged blade blank, born of bog-iron and border feud. Forge a basic weapon blank ready for finishing.',
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
  }
];

