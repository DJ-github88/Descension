// Loot Items Data
// This file contains definitions for items referenced by itemId in creature loot tables

/**
 * Loot items referenced by itemId in creature loot tables
 * These items are used in creature loot tables with the itemId property
 */
export const LOOT_ITEMS = [
  // Goblin Warrior items
  {
    id: 'rusty-dagger',
    name: 'Rusty Dagger',
    type: 'weapon',
    subtype: 'dagger',
    quality: 'poor',
    iconId: 'inv_weapon_shortblade_01',
    description: 'A crude, rusty dagger used by goblins. The blade is dull and pitted.',
    value: { silver: 2, copper: 50 },
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'piercing',
        bonusDamage: 0
      }
    }
  },
  {
    id: 'goblin-ear',
    name: 'Goblin Ear',
    type: 'miscellaneous',
    subtype: 'trophy',
    quality: 'common',
    iconId: 'inv_misc_ear_human_01',
    description: 'A severed goblin ear. Some bounty collectors pay for these as proof of kills.',
    value: { silver: 1 }
  },

  // Dire Wolf items
  {
    id: 'wolf-pelt',
    name: 'Wolf Pelt',
    type: 'material',
    subtype: 'hide',
    quality: 'common',
    iconId: 'inv_misc_pelt_wolf_01',
    description: 'A thick wolf pelt that could be used for crafting warm clothing or armor.',
    value: { silver: 15 }
  },
  {
    id: 'wolf-fang',
    name: 'Wolf Fang',
    type: 'material',
    subtype: 'bone',
    quality: 'common',
    iconId: 'inv_misc_bone_01',
    description: 'A sharp wolf fang that could be used for crafting jewelry or as a component in certain rituals.',
    value: { silver: 5 }
  },

  // Fire Elemental items
  {
    id: 'essence-of-fire',
    name: 'Essence of Fire',
    type: 'material',
    subtype: 'elemental',
    quality: 'uncommon',
    iconId: 'spell_fire_volcano',
    description: 'A swirling essence of pure fire energy, used in crafting fire-based items and fire damage enchantments.',
    value: { silver: 50 }
  },
  {
    id: 'fire-crystal',
    name: 'Fire Crystal',
    type: 'material',
    subtype: 'gem',
    quality: 'rare',
    iconId: 'inv_misc_gem_ruby_01',
    description: 'A crystal that pulses with the energy of fire. Highly sought after by enchanters for powerful fire-based magical items.',
    value: { gold: 5 }
  },

  // Staff of the Archmage
  {
    id: 'staff-of-the-archmage',
    name: 'Staff of the Archmage',
    type: 'weapon',
    subtype: 'staff',
    quality: 'epic',
    iconId: 'inv_staff_13',
    description: 'An ancient staff crackling with arcane energy, passed down through generations of elven archmages.',
    value: { gold: 10, silver: 0 },
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'arcane',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: 3,
      spirit: 2
    }
  },

  // Archmage's Spellbook
  {
    id: 'archmages-spellbook',
    name: "Archmage's Spellbook",
    type: 'quest',
    subtype: 'book',
    quality: 'rare',
    iconId: 'inv_misc_book_09',
    description: 'A leather-bound spellbook containing powerful arcane knowledge. The pages shimmer with magical energy.',
    value: { gold: 5 }
  },

  // Dwarf Defender items
  {
    id: 'dwarven-hammer',
    name: 'Dwarven War Hammer',
    type: 'weapon',
    subtype: 'hammer',
    quality: 'uncommon',
    iconId: 'inv_hammer_16',
    description: 'A finely crafted dwarven war hammer with runes etched into the head.',
    value: { gold: 3, silver: 50 },
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: 1
    }
  },
  {
    id: 'dwarven-ale',
    name: 'Dwarven Ale',
    type: 'consumable',
    subtype: 'drink',
    quality: 'uncommon',
    iconId: 'inv_drink_08',
    description: 'A potent brew that grants temporary courage and strength.',
    value: { silver: 25 },
    combatStats: {
      healthRestore: 5
    },
    baseStats: {
      strength: 1,
      constitution: 1
    },
    utilityStats: {
      duration: {
        value: 10,
        type: 'MINUTES'
      }
    }
  },

  // Young Dragon items
  {
    id: 'dragon-scale',
    name: 'Dragon Scale',
    type: 'material',
    subtype: 'scale',
    quality: 'rare',
    iconId: 'inv_misc_monsterscales_17',
    description: 'A scale from a young dragon, valuable for crafting armor. When properly treated and enchanted, items made with these scales can provide resistance to acid damage.',
    value: { gold: 2, silver: 50 }
  },
  {
    id: 'dragon-tooth',
    name: 'Dragon Tooth',
    type: 'material',
    subtype: 'bone',
    quality: 'rare',
    iconId: 'inv_misc_bone_06',
    description: 'A sharp dragon tooth that could be crafted into a dagger or arrowhead. Weapons made with dragon teeth are known for their exceptional sharpness and durability.',
    value: { gold: 1, silver: 75 }
  },

  // Ancient Treant items
  {
    id: 'ancient-heartwood',
    name: 'Ancient Heartwood',
    type: 'material',
    subtype: 'wood',
    quality: 'rare',
    iconId: 'inv_misc_herb_01',
    description: 'Wood from the heart of an ancient treant, prized by craftsmen for its durability and magical properties. Staves and wands made from this wood are known to enhance nature magic.',
    value: { gold: 3, silver: 50 }
  },
  {
    id: 'thornroot-seed',
    name: 'Thornroot Seed',
    type: 'quest',
    subtype: 'reagent',
    quality: 'epic',
    iconId: 'inv_misc_food_wheat_01',
    description: 'A seed from an ancient treant that pulses with natural energy. Could grow into a new treant if planted in the right conditions.',
    value: { gold: 15 }
  },

  // Orc Warlord items
  {
    id: 'orcish-greataxe',
    name: 'Orcish Greataxe',
    type: 'weapon',
    subtype: 'axe',
    quality: 'uncommon',
    iconId: 'inv_axe_09',
    description: 'A massive, crude axe wielded by an orc warlord. Despite its rough appearance, it is surprisingly well-balanced.',
    value: { gold: 4, silver: 25 },
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    width: 2,
    height: 4,
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 12,
        damageType: 'slashing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: 2
    }
  },
  {
    id: 'warlord-trophy-necklace',
    name: 'Warlord Trophy Necklace',
    type: 'accessory',
    subtype: 'necklace',
    quality: 'uncommon',
    iconId: 'inv_jewelry_necklace_19',
    description: 'A necklace made from the teeth and small bones of defeated enemies.',
    value: { gold: 1, silver: 50 },
    slots: ['neck'],
    width: 1,
    height: 1,
    baseStats: {
      strength: 1,
      charisma: -1
    }
  },

  // Archmage items
  {
    id: 'arcane-focus-crystal',
    name: 'Arcane Focus Crystal',
    type: 'accessory',
    subtype: 'focus',
    quality: 'rare',
    iconId: 'inv_misc_gem_crystal_02',
    description: 'A crystal used by powerful mages to focus their arcane energies.',
    value: { gold: 7, silver: 50 },
    baseStats: {
      intelligence: 2
    }
  },
  {
    id: 'mage-robe',
    name: 'Mage Robe',
    type: 'armor',
    subtype: 'cloth',
    quality: 'uncommon',
    iconId: 'inv_chest_cloth_51',
    description: 'A robe worn by a powerful archmage, imbued with magical energies.',
    value: { gold: 5 },
    baseStats: {
      intelligence: 1,
      spirit: 1
    },
    armorClass: 3
  },

  // Frost Giant items
  {
    id: 'giant-frost-axe',
    name: 'Giant Frost Axe',
    type: 'weapon',
    subtype: 'axe',
    quality: 'rare',
    iconId: 'inv_axe_11',
    description: 'An enormous axe wielded by a frost giant. The blade is perpetually coated in a thin layer of frost.',
    value: { gold: 12, silver: 50 },
    weaponStats: {
      baseDamage: {
        diceCount: 3,
        diceType: 6,
        damageType: 'slashing',
        bonusDamage: 4,
        bonusDamageType: 'frost'
      }
    },
    baseStats: {
      strength: 3
    }
  },
  {
    id: 'frost-giant-heart',
    name: 'Frost Giant Heart',
    type: 'quest',
    subtype: 'organ',
    quality: 'epic',
    iconId: 'inv_misc_organ_03',
    description: 'The still-frozen heart of a frost giant. It pulses with cold energy and never seems to thaw. Sought after by powerful alchemists and wizards for frost-based magical research.',
    value: { gold: 25 }
  },

  // Other common items
  {
    id: 'healing-herb',
    name: 'Healing Herb',
    type: 'consumable',
    subtype: 'herb',
    quality: 'common',
    iconId: 'inv_misc_herb_08',
    description: 'A common herb with mild healing properties.',
    value: { silver: 5 },
    combatStats: {
      healthRestore: 10
    }
  },
  {
    id: 'mana-crystal-shard',
    name: 'Mana Crystal Shard',
    type: 'material',
    subtype: 'crystal',
    quality: 'uncommon',
    iconId: 'inv_misc_gem_sapphire_02',
    description: 'A small shard of crystal that contains magical energy. Used in crafting magical items and enchantments that enhance spellcasting abilities.',
    value: { silver: 25 }
  },
  {
    id: 'leather-scraps',
    name: 'Leather Scraps',
    type: 'material',
    subtype: 'leather',
    quality: 'common',
    iconId: 'inv_misc_leatherscrap_07',
    description: 'Scraps of leather that could be used for crafting.',
    value: { copper: 25 }
  },
  {
    id: 'iron-ingot',
    name: 'Iron Ingot',
    type: 'material',
    subtype: 'metal',
    quality: 'common',
    iconId: 'inv_ingot_iron',
    description: 'A standard iron ingot used in blacksmithing.',
    value: { silver: 10 }
  }
];

/**
 * Get a loot item by ID
 * @param {string} id - The ID of the item to retrieve
 * @returns {Object|null} - The item object or null if not found
 */
export const getLootItemById = (id) => {
  return LOOT_ITEMS.find(item => item.id === id) || null;
};

/**
 * Search loot items by name or type
 * @param {string} query - The search query
 * @returns {Array} - Array of matching loot items
 */
export const searchLootItems = (query) => {
  const lowerQuery = query.toLowerCase();
  return LOOT_ITEMS.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.type.toLowerCase().includes(lowerQuery) ||
    (item.subtype && item.subtype.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Filter loot items by type
 * @param {string} type - The item type to filter by
 * @returns {Array} - Array of filtered loot items
 */
export const filterLootItemsByType = (type) => {
  return LOOT_ITEMS.filter(item => item.type === type);
};

/**
 * Filter loot items by quality
 * @param {string} quality - The item quality to filter by
 * @returns {Array} - Array of filtered loot items
 */
export const filterLootItemsByQuality = (quality) => {
  return LOOT_ITEMS.filter(item => item.quality === quality);
};

/**
 * Get all loot items
 * @returns {Array} - Array of all loot items
 */
export const getAllLootItems = () => {
  return [...LOOT_ITEMS];
};
