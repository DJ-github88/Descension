// Loot Items Data
// This file contains definitions for items referenced by itemId in creature loot tables

/**
 * Loot items referenced by itemId in creature loot tables
 * These items are used in creature loot tables with the itemId property
 */
export const LOOT_ITEMS = [
  // Goblin Warrior items - MOVED TO MAIN ITEM STORE
  // rusty-dagger and goblin-ear are now in the main item store with proper inventory properties

  // Dire Wolf items - MOVED TO MAIN ITEM STORE
  // wolf-pelt and wolf-fang are now in the main item store with proper inventory properties

  // Fire Elemental items - MOVED TO MAIN ITEM STORE
  // essence-of-fire is now in the main item store with proper inventory properties
  // fire-crystal is now in the main item store with proper inventory properties


  // Archmage's Spellbook
  {
    id: 'archmages-spellbook',
    name: "Archmage's Spellbook",
    type: 'quest',
    subtype: 'book',
    quality: 'rare',
    iconId: 'inv_misc_book_09',
    description: 'Rediscovered in the deep-ice chambers of Aldren Thalreth, where warming ice had begun to unseal its fore-edge. Legends say this tome contains a spell that once bent the fabric of time itself. A leather-bound spellbook containing powerful arcane knowledge. The pages shimmer with magical energy.',
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
    description: 'Pulled from the cooled obsidian of the Sundered Caldera, its haft still warm with the memory of a Solbrand ember. Forged in the heart of Mount Thunderpeak by Runelord Thrain, this hammer has crushed a thousand goblin skulls. A finely crafted dwarven war hammer with runes etched into the head.',
    value: { gold: 3, silver: 50 },
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'physical',
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
    description: 'Brewed in a Bryngloom stillhouse where ancestral spirits were said to whisper into the mash. Brewed from a secret recipe guarded by the Stonebeard clan for seven generations. A potent brew that grants temporary courage and strength.',
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
    description: 'The scale still carries a faint reality-bleed from the Sundered Monoliths, warm to the touch no matter the cold. This scale fell from a young wyrm during its first shedding beneath a blood moon. A scale from a young dragon, valuable for crafting armor. When properly treated and enchanted, items made with these scales can provide resistance to acid damage.',
    value: { gold: 2, silver: 50 }
  },
  {
    id: 'dragon-tooth',
    name: 'Dragon Tooth',
    type: 'material',
    subtype: 'bone',
    quality: 'rare',
    iconId: 'inv_misc_bone_06',
    description: 'Once sealed in obsidian alongside a Solbrand ember, the tooth still radiates a thin heat. Said to retain a fragment of the dragon\'s fiery soul, this tooth still hums with latent power. A sharp dragon tooth that could be crafted into a dagger or arrowhead. Weapons made with dragon teeth are known for their exceptional sharpness and durability.',
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
    description: 'The treant-spirits of Bryngloom are said to weep into memory-glass whenever one of their heartwood staves is cut. The treant this wood came from stood watch over the Eldwood Forest before the first elf spoke a word. Wood from the heart of an ancient treant, prized by craftsmen for its durability and magical properties. Staves and wands made from this wood are known to enhance nature magic.',
    value: { gold: 3, silver: 50 }
  },
  {
    id: 'thornroot-seed',
    name: 'Thornroot Seed',
    type: 'quest',
    subtype: 'reagent',
    quality: 'epic',
    iconId: 'inv_misc_food_wheat_01',
    description: 'Pulled from a bog-preserved pod dredged up by the fog-tides of Vel-Keth Bayou. Planted by a druid elder who foresaw the forest\'s need for a new guardian a millennium hence. A seed from an ancient treant that pulses with natural energy. Could grow into a new treant if planted in the right conditions.',
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
    description: 'The haft is bound in cold-iron wire that bites the Wyrd and refuses to lie about its kills. This axe was used by Warlord Krag to cleave a dwarven shield wall in two at the Battle of Iron Pass. A massive, crude axe wielded by an orc warlord. Despite its rough appearance, it is surprisingly well-balanced.',
    value: { gold: 4, silver: 25 },
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    width: 2,
    height: 4,
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 12,
        damageType: 'physical',
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
    description: 'Every tooth is named in a chained Neth Ledger-tome, where the oaths of the fallen are kept. Each tooth in this grisly necklace marks a chieftain who dared challenge Warlord Krag\'s rule. A necklace made from the teeth and small bones of defeated enemies.',
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
    description: 'Once an Anchor-stone of the Neth First Contract, the crystal still thrums with the weight of the original pact-fragment. This crystal was plucked from the heart of a dying star by an archmage of the Celestial Conclave. A crystal used by powerful mages to focus their arcane energies.',
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
    description: 'Stitched beneath Vreken crypt-light, the robe drank the unnatural silence of the hush-fog into every seam. Stitched with silver thread by the hand of Archmage Elara herself, this robe has witnessed a hundred arcane duels. A robe worn by a powerful archmage, imbued with magical energies.',
    value: { gold: 5 },
    baseStats: {
      intelligence: 1,
      spirit: 1
    },
    armor: 3
  },

  // Frost Giant items
  {
    id: 'giant-frost-axe',
    name: 'Giant Frost Axe',
    type: 'weapon',
    subtype: 'axe',
    quality: 'rare',
    iconId: 'inv_axe_11',
    description: 'Recovered from a Frozen Archive antechamber where warming ice had begun to reveal its haft. An enormous axe wielded by a frost giant. The blade is perpetually coated in a thin layer of frost.',
    value: { gold: 12, silver: 50 },
    weaponStats: {
      baseDamage: {
        diceCount: 3,
        diceType: 6,
        damageType: 'physical',
        bonusDamage: 4,
        bonusDamageType: 'rime'
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
    description: 'Aldren Thalreth himself catalogued this heart before the deep-ice chambers swallowed his notes. The still-frozen heart of a frost giant. It pulses with cold energy and never seems to thaw. Sought after by powerful alchemists and wizards for frost-based magical research.',
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
    description: 'Gathered at the edge of the Vel-Keth fog-tides, where the bog-mist keeps the leaves ever-fresh. A common herb with mild healing properties.',
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
    description: 'Prized from a Wyrd-bleed, where reality dents and fear-stuff given flesh leaves crystals behind. A small shard of crystal that contains magical energy. Used in crafting magical items and enchantments that enhance spellcasting abilities.',
    value: { silver: 25 }
  },
  {
    id: 'leather-scraps',
    name: 'Leather Scraps',
    type: 'material',
    subtype: 'leather',
    quality: 'common',
    iconId: 'inv_misc_leatherscrap_07',
    description: 'These scraps are bog-preserved relics of the Vel-Keth Bayou, soft and dark from the peat. Scraps of leather that could be used for crafting.',
    value: { copper: 25 }
  },
  {
    id: 'iron-ingot',
    name: 'Iron Ingot',
    type: 'material',
    subtype: 'metal',
    quality: 'common',
    iconId: 'inv_ingot_iron',
    description: 'This is cold-iron stock, said to bite the Wyrd and never to lie in the hand of a smith. A standard iron ingot used in blacksmithing.',
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
