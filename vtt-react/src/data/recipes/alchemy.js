/**
 * Alchemy Recipes
 * 
 * Recipes for crafting potions, elixirs, and alchemical items
 */

export const ALCHEMY_RECIPES = [
  {
    id: 'minor-healing-potion-recipe',
    name: 'Minor Healing Potion',
    profession: 'alchemy',
    description: 'Steeped in fester-mists gathered from Plaguebringer bogs to coax out vitality. A basic healing potion that restores a small amount of health.',
    requiredLevel: 0,
    resultItemId: 'minor-healing-potion',
    resultQuantity: 1,
    materials: [
      { itemId: 'fieldleaf', quantity: 2 },
      { itemId: 'bitterroot', quantity: 1 },
      { itemId: 'glass-vial', quantity: 1 },
      { itemId: 'distilled-water', quantity: 1 }
    ],
    craftingTime: 5000,
    experienceGained: 1,
    category: 'healing'
  },
  {
    id: 'frost-resistance-elixir-recipe',
    name: 'Frost Resistance Elixir',
    profession: 'alchemy',
    description: 'Distilled from hush-spore brews of the Vreken deep-crypts. An elixir that provides resistance to cold damage.',
    requiredLevel: 2,
    resultItemId: 'frost-resistance-elixir',
    resultQuantity: 1,
    materials: [
      { itemId: 'frostcap', quantity: 2 },
      { itemId: 'frost-essence', quantity: 1 },
      { itemId: 'reinforced-flask', quantity: 1 },
      { itemId: 'distilled-water', quantity: 1 }
    ],
    craftingTime: 8000,
    experienceGained: 3,
    category: 'resistance'
  },
  {
    id: 'fire-essence-recipe',
    name: 'Fire Essence',
    profession: 'alchemy',
    description: 'A memory-glass distillate refined under Toxicologist supervision. Extract concentrated fire essence from ember ore.',
    requiredLevel: 1,
    resultItemId: 'fire-essence',
    resultQuantity: 1,
    materials: [
      { itemId: 'ember-ore', quantity: 3 },
      { itemId: 'distilled-water', quantity: 1 },
      { itemId: 'glass-vial', quantity: 1 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'essences'
  },
  {
    id: 'vital-essence-recipe',
    name: 'Vital Essence',
    profession: 'alchemy',
    description: 'Drawn from bog-peat reagents dredged in Vel-Keth Bayou. Extract life energy essence from medicinal herbs.',
    requiredLevel: 2,
    resultItemId: 'vital-essence',
    resultQuantity: 1,
    materials: [
      { itemId: 'ashflower', quantity: 2 },
      { itemId: 'glowbulb', quantity: 1 },
      { itemId: 'distilled-water', quantity: 1 },
      { itemId: 'reinforced-flask', quantity: 1 }
    ],
    craftingTime: 7000,
    experienceGained: 3,
    category: 'essences'
  },
  {
    id: 'ground-bone-recipe',
    name: 'Ground Bone',
    profession: 'alchemy',
    description: 'A staple of the Toxicologist vial-shelves, ground in pestles of black glass. Grind bone into a fine powder for alchemical use.',
    requiredLevel: 0,
    resultItemId: 'ground-bone',
    resultQuantity: 2,
    materials: [
      { itemId: 'bone-plates', quantity: 1 }
    ],
    craftingTime: 3000,
    experienceGained: 1,
    category: 'processing'
  }
];

