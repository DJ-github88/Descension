/**
 * Tailoring Recipes
 * 
 * Recipes for crafting cloth, fabrics, and textile items
 */

export const TAILORING_RECIPES = [
  {
    id: 'fine-weave-cloth-recipe',
    name: 'Fine Weave Cloth',
    profession: 'tailoring',
    description: 'Weave fine cloth from linen fiber.',
    requiredLevel: 0,
    resultItemId: 'fine-weave-cloth',
    resultQuantity: 1,
    materials: [
      { itemId: 'linen-fiber', quantity: 3 }
    ],
    craftingTime: 4000,
    experienceGained: 1,
    category: 'cloth'
  },
  {
    id: 'hardened-cloth-recipe',
    name: 'Hardened Cloth',
    profession: 'tailoring',
    description: 'Treat cloth to make it more durable and resistant.',
    requiredLevel: 1,
    resultItemId: 'hardened-cloth',
    resultQuantity: 1,
    materials: [
      { itemId: 'fine-weave-cloth', quantity: 2 },
      { itemId: 'resin-glue', quantity: 1 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'cloth'
  },
  {
    id: 'waxed-thread-recipe',
    name: 'Waxed Thread',
    profession: 'tailoring',
    description: 'Treat thread with wax for durability and water resistance.',
    requiredLevel: 0,
    resultItemId: 'waxed-thread',
    resultQuantity: 5,
    materials: [
      { itemId: 'wool-thread', quantity: 1 },
      { itemId: 'resin-glue', quantity: 1 }
    ],
    craftingTime: 3000,
    experienceGained: 1,
    category: 'thread'
  },
  {
    id: 'leather-straps-recipe',
    name: 'Leather Straps',
    profession: 'tailoring',
    description: 'Cut and prepare leather into straps for binding.',
    requiredLevel: 0,
    resultItemId: 'leather-straps',
    resultQuantity: 5,
    materials: [
      { itemId: 'light-hide', quantity: 1 }
    ],
    craftingTime: 4000,
    experienceGained: 1,
    category: 'leather'
  },
  {
    id: 'insulated-weave-recipe',
    name: 'Insulated Weave',
    profession: 'tailoring',
    description: 'Weave cloth with insulating properties.',
    requiredLevel: 2,
    resultItemId: 'insulated-weave',
    resultQuantity: 1,
    materials: [
      { itemId: 'wool-thread', quantity: 3 },
      { itemId: 'fine-weave-cloth', quantity: 1 }
    ],
    craftingTime: 8000,
    experienceGained: 3,
    category: 'cloth'
  }
];

