/**
 * Enchanting Recipes
 * 
 * Recipes for enchanting items and creating magical materials
 */

export const ENCHANTING_RECIPES = [
  {
    id: 'arcane-dust-recipe',
    name: 'Arcane Dust',
    profession: 'enchanting',
    description: 'Ground beneath Inscriptor sigil-glyphs etched into the mortar. Grind magical materials into fine arcane dust.',
    requiredLevel: 0,
    resultItemId: 'arcane-dust',
    resultQuantity: 2,
    materials: [
      { itemId: 'focus-crystal', quantity: 1 }
    ],
    craftingTime: 4000,
    experienceGained: 1,
    category: 'materials'
  },
  {
    id: 'rune-ink-recipe',
    name: 'Rune Ink',
    profession: 'enchanting',
    description: 'Mixed as Neth contract-ink on a cold-iron stylus. Create special ink infused with arcane energy for drawing runes.',
    requiredLevel: 1,
    resultItemId: 'rune-ink',
    resultQuantity: 1,
    materials: [
      { itemId: 'arcane-dust', quantity: 2 },
      { itemId: 'distilled-water', quantity: 1 }
    ],
    craftingTime: 6000,
    experienceGained: 2,
    category: 'materials'
  },
  {
    id: 'imprint-shard-recipe',
    name: 'Imprint Shard',
    profession: 'enchanting',
    description: 'Scribed under Astril constellation-runes for celestial imprint. Prepare a crystal shard to hold magical imprints.',
    requiredLevel: 1,
    resultItemId: 'imprint-shard',
    resultQuantity: 1,
    materials: [
      { itemId: 'focus-crystal', quantity: 1 },
      { itemId: 'arcane-dust', quantity: 1 }
    ],
    craftingTime: 5000,
    experienceGained: 2,
    category: 'materials'
  },
  {
    id: 'binding-scroll-recipe',
    name: 'Binding Scroll',
    profession: 'enchanting',
    description: 'Sealed with Wyrd-glyph binding to hold fast the pact. Prepare a scroll for binding enchantments to items.',
    requiredLevel: 2,
    resultItemId: 'binding-scroll',
    resultQuantity: 1,
    materials: [
      { itemId: 'fine-weave-cloth', quantity: 1 },
      { itemId: 'rune-ink', quantity: 1 },
      { itemId: 'sigil-chalk', quantity: 1 }
    ],
    craftingTime: 8000,
    experienceGained: 3,
    category: 'scrolls'
  }
];

