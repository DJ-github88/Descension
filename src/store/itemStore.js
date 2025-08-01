import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Constants
export const BASE_CATEGORY = {
    id: 'all-items',
    name: 'All Items',
    parentId: null,
    icon: 'inv_misc_bag_10',
    isBaseCategory: true
};

// Item types
export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  CONSUMABLE: 'consumable',
  CONTAINER: 'container',
  MISCELLANEOUS: 'miscellaneous',
  CURRENCY: 'currency'
};

// Item rarities
export const ITEM_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact'
};

// Version for comprehensive items (increment when items change)
const COMPREHENSIVE_ITEMS_VERSION = 1;

// Comprehensive Pathfinder/D&D-themed item library
const COMPREHENSIVE_ITEMS = [
  // === WEAPONS - SWORDS ===

  // Poor Quality Swords
  {
    id: 'rusty-shortsword',
    name: 'Rusty Shortsword',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'poor',
    description: 'A corroded shortsword with rust eating away at its blade. The edge is dull and the grip is worn smooth.',
    iconId: 'inv_sword_04',
    value: { gold: 0, silver: 74, copper: 83 },
    weight: 2,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'slashing'
      }
    },
    width: 1,
    height: 2
  },
  {
    id: 'chipped-longsword',
    name: 'Chipped Longsword',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'poor',
    description: 'A longsword with several chips along its edge. Despite its condition, it still holds some semblance of its former glory.',
    iconId: 'inv_sword_04',
    value: { gold: 0, silver: 98, copper: 47 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'slashing'
      }
    },
    width: 1,
    height: 3
  },

  // Common Quality Swords
  {
    id: 'iron-shortsword',
    name: 'Iron Shortsword',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'common',
    description: 'A well-crafted iron shortsword with a keen edge. Reliable and balanced, perfect for a beginning warrior.',
    iconId: 'inv_sword_04',
    value: { gold: 2, silver: 87, copper: 65 },
    weight: 2,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 2
  },
  {
    id: 'steel-longsword',
    name: 'Steel Longsword',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'common',
    description: 'A finely forged steel longsword with excellent balance. The blade gleams with a sharp, deadly edge.',
    iconId: 'inv_sword_04',
    value: { gold: 7, silver: 64, copper: 29 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    width: 1,
    height: 3
  },
  {
    id: 'masterwork-rapier',
    name: 'Masterwork Rapier',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'common',
    description: 'An elegant rapier with a thin, flexible blade designed for precise thrusting attacks. Favored by duelists and nobles.',
    iconId: 'inv_sword_17',
    value: { gold: 11, silver: 59, copper: 84 },
    weight: 2,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'piercing'
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    width: 1,
    height: 3
  },

  // Uncommon Quality Swords
  {
    id: 'enchanted-scimitar',
    name: 'Enchanted Scimitar',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'uncommon',
    description: 'A curved scimitar with minor enchantments that make the blade shimmer with magical energy. Light and deadly.',
    iconId: 'inv_sword_27',
    value: { gold: 24, silver: 37, copper: 92 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'slashing',
        bonusDamage: 1,
        bonusDamageType: 'force'
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 3
  },

  // Rare Quality Swords
  {
    id: 'flamberge-of-valor',
    name: 'Flamberge of Valor',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A magnificent two-handed sword with a wavy blade that seems to burn with inner fire. The crossguard is shaped like phoenix wings.',
    iconId: 'inv_sword_27',
    value: { gold: 83, silver: 74, copper: 26 },
    weight: 6,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 6,
        damageType: 'slashing',
        bonusDamage: 2,
        bonusDamageType: 'fire'
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        fire: { value: 10, isPercentage: false }
      }
    },
    width: 1,
    height: 4
  },

  // === WEAPONS - AXES ===

  // Poor Quality Axes
  {
    id: 'rusty-hatchet',
    name: 'Rusty Hatchet',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'poor',
    description: 'A small, rusted hatchet with a chipped blade. More suited for chopping kindling than combat.',
    iconId: 'inv_axe_09',
    value: { gold: 0, silver: 49, copper: 72 },
    weight: 2,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'slashing'
      }
    },
    width: 1,
    height: 2
  },

  // Common Quality Axes
  {
    id: 'iron-battleaxe',
    name: 'Iron Battleaxe',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'common',
    description: 'A well-balanced iron battleaxe with a sharp, crescent-shaped blade. Effective against both armor and flesh.',
    iconId: 'inv_axe_09',
    value: { gold: 5, silver: 73, copper: 91 },
    weight: 4,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    width: 1,
    height: 3
  },
  {
    id: 'woodcutters-axe',
    name: "Woodcutter's Axe",
    type: 'weapon',
    subtype: 'AXE',
    quality: 'common',
    description: 'A practical axe designed for felling trees, but equally effective in combat. The handle is worn smooth from years of use.',
    iconId: 'inv_axe_09',
    value: { gold: 3, silver: 82, copper: 56 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 2
  },

  // Uncommon Quality Axes
  {
    id: 'steel-greataxe',
    name: 'Steel Greataxe',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'uncommon',
    description: 'A massive two-handed axe with a double-bladed head. Requires great strength to wield but delivers devastating blows.',
    iconId: 'inv_axe_09',
    value: { gold: 34, silver: 18, copper: 67 },
    weight: 8,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 12,
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false }
    },
    width: 2,
    height: 4
  },

  // === WEAPONS - MACES & HAMMERS ===

  // Poor Quality Maces
  {
    id: 'cracked-club',
    name: 'Cracked Club',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'poor',
    description: 'A simple wooden club with visible cracks running along its length. Better than bare fists, but not by much.',
    iconId: 'inv_mace_01',
    value: { gold: 0, silver: 24, copper: 68 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'bludgeoning'
      }
    },
    width: 1,
    height: 2
  },

  // Common Quality Maces
  {
    id: 'iron-mace',
    name: 'Iron Mace',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'common',
    description: 'A solid iron mace with a flanged head designed to crush armor and bone alike.',
    iconId: 'inv_mace_01',
    value: { gold: 4, silver: 76, copper: 34 },
    weight: 4,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'bludgeoning'
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 2
  },
  {
    id: 'steel-warhammer',
    name: 'Steel Warhammer',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'common',
    description: 'A heavy steel warhammer with a brutal spiked head. Favored by those who prefer to crush their enemies.',
    iconId: 'inv_hammer_01',
    value: { gold: 7, silver: 91, copper: 52 },
    weight: 5,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'bludgeoning'
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    width: 1,
    height: 3
  },

  // === WEAPONS - DAGGERS ===

  // Poor Quality Daggers
  {
    id: 'rusty-dagger',
    name: 'Rusty Dagger',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'poor',
    description: 'A small, corroded dagger with a pitted blade. The rust makes it more likely to cause infection than clean cuts.',
    iconId: 'inv_weapon_shortblade_01',
    value: { gold: 0, silver: 49, copper: 85 },
    weight: 1,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 3,
        damageType: 'piercing'
      }
    },
    width: 1,
    height: 1
  },

  // Common Quality Daggers
  {
    id: 'iron-dagger',
    name: 'Iron Dagger',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'common',
    description: 'A well-crafted iron dagger with a sharp point and keen edge. Perfect for quick, precise strikes.',
    iconId: 'inv_weapon_shortblade_01',
    value: { gold: 1, silver: 87, copper: 43 },
    weight: 1,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'piercing'
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 1
  },

  // === WEAPONS - BOWS ===

  // Common Quality Bows
  {
    id: 'hunting-bow',
    name: 'Hunting Bow',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'common',
    description: 'A simple yew bow used by hunters to bring down game. Well-crafted and reliable for its purpose.',
    iconId: 'inv_weapon_bow_08',
    value: { gold: 4, silver: 68, copper: 92 },
    weight: 2,
    slots: ['ranged'],
    hand: 'RANGED',
    weaponSlot: 'ONE_HANDED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'piercing'
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    width: 2,
    height: 3
  },
  {
    id: 'composite-longbow',
    name: 'Composite Longbow',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'common',
    description: 'A longbow made from multiple layers of wood and horn, providing superior power and accuracy.',
    iconId: 'inv_weapon_bow_08',
    value: { gold: 11, silver: 82, copper: 45 },
    weight: 3,
    slots: ['ranged'],
    hand: 'RANGED',
    weaponSlot: 'ONE_HANDED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'piercing'
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    width: 2,
    height: 4
  },

  // === ARMOR - CLOTH ===

  // Poor Quality Cloth Armor
  {
    id: 'tattered-robe',
    name: 'Tattered Robe',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'A worn and patched cloth robe that has seen better days. Provides minimal protection but allows for unrestricted movement.',
    iconId: 'inv_chest_cloth_07',
    value: { gold: 0, silver: 94, copper: 76 },
    weight: 1,
    slots: ['chest'],
    combatStats: {
      armorClass: { value: 1, isPercentage: false }
    },
    width: 2,
    height: 2
  },

  // Common Quality Cloth Armor
  {
    id: 'apprentice-robe',
    name: 'Apprentice Robe',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A simple cloth robe worn by apprentice mages and scholars. Comfortable and allows for easy spellcasting.',
    iconId: 'inv_chest_cloth_07',
    value: { gold: 2, silver: 84, copper: 67 },
    weight: 1,
    slots: ['chest'],
    combatStats: {
      armorClass: { value: 1, isPercentage: false },
      maxMana: { value: 10, isPercentage: false }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    width: 2,
    height: 2
  },
  {
    id: 'scholars-robes',
    name: "Scholar's Robes",
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'Fine robes worn by learned scholars and court mages. The fabric is embroidered with arcane symbols.',
    iconId: 'inv_chest_cloth_07',
    value: { gold: 8, silver: 0, copper: 0 },
    weight: 2,
    slots: ['chest'],
    combatStats: {
      armorClass: { value: 2, isPercentage: false },
      maxMana: { value: 15, isPercentage: false }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    width: 2,
    height: 3
  },

  // === ARMOR - LEATHER ===

  // Poor Quality Leather Armor
  {
    id: 'cracked-leather-vest',
    name: 'Cracked Leather Vest',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'poor',
    description: 'A leather vest with visible cracks and worn patches. Offers some protection but is clearly past its prime.',
    iconId: 'inv_chest_leather_01',
    value: { gold: 2, silver: 0, copper: 0 },
    weight: 3,
    slots: ['chest'],
    combatStats: {
      armorClass: { value: 2, isPercentage: false }
    },
    width: 2,
    height: 2
  },

  // Common Quality Leather Armor
  {
    id: 'leather-armor',
    name: 'Leather Armor',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Well-crafted leather armor that provides good protection while maintaining flexibility and stealth.',
    iconId: 'inv_chest_leather_01',
    value: { gold: 5, silver: 0, copper: 0 },
    weight: 4,
    slots: ['chest'],
    combatStats: {
      armorClass: { value: 3, isPercentage: false }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    width: 2,
    height: 2
  },

  // === CONSUMABLES - POTIONS ===

  // Common Quality Potions
  {
    id: 'minor-healing-potion',
    name: 'Minor Healing Potion',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A small vial of ruby-red liquid that restores a modest amount of health when consumed.',
    iconId: 'inv_potion_51',
    value: { gold: 2, silver: 0, copper: 0 },
    weight: 0.2,
    combatStats: {
      healthRestore: { value: 25, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1
  },
  {
    id: 'mana-potion',
    name: 'Minor Mana Potion',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A small vial of shimmering blue liquid that restores magical energy when consumed.',
    iconId: 'inv_potion_76',
    value: { gold: 2, silver: 25, copper: 0 },
    weight: 0.2,
    combatStats: {
      manaRestore: { value: 30, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'mana'
  },
  {
    id: 'poison-vial',
    name: 'Poison Vial',
    type: 'consumable',
    subtype: 'POISON',
    quality: 'uncommon',
    description: 'A dangerous vial of concentrated poison. Can be applied to weapons or used to harm enemies.',
    iconId: 'inv_potion_17',
    value: { gold: 8, silver: 0, copper: 0 },
    weight: 0.1,
    combatStats: {
      poisonDamage: { value: 15, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1
  },

  // === ACCESSORIES - RINGS ===

  {
    id: 'copper-ring',
    name: 'Copper Ring',
    type: 'accessory',
    subtype: 'RING',
    quality: 'common',
    description: 'A simple copper ring with a small gemstone. Provides a minor magical enhancement.',
    iconId: 'inv_jewelry_ring_03',
    value: { gold: 8, silver: 0, copper: 0 },
    weight: 0.1,
    slots: ['ring1', 'ring2'],
    baseStats: {
      constitution: { value: 1, isPercentage: false }
    },
    width: 1,
    height: 1
  },

  // === TRADE GOODS - ORES ===

  {
    id: 'copper-ore',
    name: 'Copper Ore',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'poor',
    description: 'A chunk of raw copper ore with a distinctive reddish-brown color. Can be smelted into copper bars.',
    iconId: 'inv_ore_copper_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_ore_copper_01.jpg',
    value: { gold: 0, silver: 0, copper: 15 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'metals',
    origin: 'Local',
    demandLevel: 'Moderate',
    qualityGrade: 'Standard'
  },
  {
    id: 'iron-ore',
    name: 'Iron Ore',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'common',
    description: 'A chunk of iron ore with a metallic sheen. Essential for creating stronger weapons and armor.',
    iconId: 'inv_ore_iron_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_ore_iron_01.jpg',
    value: { gold: 0, silver: 0, copper: 25 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'metals',
    origin: 'Local',
    demandLevel: 'High',
    qualityGrade: 'Fine'
  },

  // === TRADE GOODS - CLOTH ===

  {
    id: 'linen-cloth',
    name: 'Linen Cloth',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'poor',
    description: 'A piece of rough linen cloth. Useful for bandages, simple crafting, or basic clothing.',
    iconId: 'inv_fabric_linen_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_fabric_linen_01.jpg',
    value: { gold: 0, silver: 1, copper: 33 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'textiles',
    origin: 'Local',
    demandLevel: 'Low',
    qualityGrade: 'Standard'
  },
  {
    id: 'wool-cloth',
    name: 'Wool Cloth',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'common',
    description: 'Soft wool cloth that can be woven into warm garments or used for various crafting purposes.',
    iconId: 'inv_fabric_wool_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_fabric_wool_01.jpg',
    value: { gold: 0, silver: 2, copper: 75 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'textiles',
    origin: 'Local',
    demandLevel: 'Moderate',
    qualityGrade: 'Fine'
  },

  // === TRADE GOODS - GEMS ===

  {
    id: 'rough-stone',
    name: 'Rough Stone',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'poor',
    description: 'A rough piece of stone that could be cut and polished by a skilled jeweler.',
    iconId: 'inv_misc_gem_stone_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_stone_01.jpg',
    value: { gold: 0, silver: 0, copper: 25 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Stone',
    professions: ['Masonry', 'Jewelcrafting'],
    gatheringMethod: 'quarrying'
  },
  {
    id: 'malachite',
    name: 'Malachite',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'A beautiful green gemstone with swirling patterns. Prized by jewelers and enchanters alike.',
    iconId: 'inv_misc_gem_emerald_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_emerald_02.jpg',
    value: { gold: 0, silver: 8, copper: 50 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Gem',
    professions: ['Jewelcrafting', 'Enchanting'],
    gatheringMethod: 'mining'
  },

  // === CONTAINERS ===

  {
    id: 'leather-pouch',
    name: 'Leather Pouch',
    type: 'container',
    subtype: 'POUCH',
    quality: 'common',
    description: 'A small leather pouch perfect for storing coins and small items.',
    iconId: 'inv_misc_bag_10',
    weight: 1,
    width: 1,
    height: 1,
    containerProperties: {
      gridSize: { rows: 3, cols: 3 },
      items: [],
      isLocked: false,
      lockType: 'none',
      lockDC: 0,
      lockCode: '',
      flavorText: '',
      maxAttempts: 3,
      failureAction: 'none',
      failureActionDetails: {
        removeItems: false,
        removePercentage: 50,
        destroyContainer: false,
        triggerTrap: false,
        trapDetails: '',
        transformIntoCreature: false,
        creatureType: ''
      }
    }
  },

  // === STAVES & WANDS ===

  {
    id: 'apprentice-staff',
    name: 'Apprentice Staff',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'common',
    description: 'A simple wooden staff topped with a small crystal. Perfect for beginning spellcasters to focus their magical energies.',
    iconId: 'inv_staff_01',
    value: { gold: 6, silver: 0, copper: 0 },
    weight: 3,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 4,
        damageType: 'bludgeoning'
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      maxMana: { value: 20, isPercentage: false }
    },
    width: 1,
    height: 4
  },

  // === FOOD & DRINK ===

  {
    id: 'travelers-bread',
    name: "Traveler's Bread",
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'common',
    description: 'A hearty loaf of bread that stays fresh for weeks. A staple food for adventurers on long journeys.',
    iconId: 'inv_misc_food_15',
    value: { gold: 0, silver: 5, copper: 0 },
    weight: 0.5,
    combatStats: {
      healthRestore: { value: 10, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1
  },
  {
    id: 'ale-mug',
    name: 'Mug of Ale',
    type: 'consumable',
    subtype: 'DRINK',
    quality: 'common',
    description: 'A frothy mug of ale that warms the spirit and bolsters courage. Popular in taverns across the realm.',
    iconId: 'inv_drink_05',
    value: { gold: 0, silver: 2, copper: 0 },
    weight: 0.3,
    baseStats: {
      constitution: { value: 1, isPercentage: false, duration: 300 }
    },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1
  },

  // === SCROLLS ===

  {
    id: 'scroll-of-healing',
    name: 'Scroll of Healing',
    type: 'consumable',
    subtype: 'SCROLL',
    quality: 'uncommon',
    description: 'A magical scroll inscribed with healing runes. When read aloud, it channels divine energy to mend wounds.',
    iconId: 'inv_scroll_03',
    value: { gold: 11, silver: 73, copper: 18 },
    weight: 0.1,
    combatStats: {
      healthRestore: { value: 50, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1
  },

  // === TOOLS ===

  {
    id: 'smiths-hammer',
    name: "Smith's Hammer",
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'A well-balanced hammer used by blacksmiths to forge weapons and armor. Essential for any metalworking.',
    iconId: 'inv_hammer_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_hammer_01.jpg',
    value: { gold: 1, silver: 2, copper: 0 },
    width: 1,
    height: 2,
    rotation: 0
  },
  {
    id: 'rope-coil',
    name: 'Coil of Rope',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'Fifty feet of sturdy hemp rope. Invaluable for climbing, binding, and countless other adventuring needs.',
    iconId: 'inv_misc_rope_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_rope_01.jpg',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 2,
    height: 2,
    rotation: 0
  },

  // Additional Crafting Materials
  {
    id: 'silk-cloth',
    name: 'Silk Cloth',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'Fine silk cloth that shimmers in the light. Highly prized by tailors for creating elegant garments.',
    iconId: 'inv_fabric_silk_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_fabric_silk_02.jpg',
    value: { gold: 0, silver: 4, copper: 25 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Cloth',
    professions: ['Tailoring', 'Enchanting'],
    gatheringMethod: 'harvesting'
  },
  {
    id: 'steel-ingot',
    name: 'Steel Ingot',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'A refined steel ingot, harder and more durable than iron. Essential for crafting superior weapons and armor.',
    iconId: 'inv_ingot_steel',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_ingot_steel.jpg',
    value: { gold: 0, silver: 7, copper: 50 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Metal',
    professions: ['Blacksmithing', 'Engineering'],
    gatheringMethod: 'smelting'
  },
  {
    id: 'hardwood-lumber',
    name: 'Hardwood Lumber',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'Sturdy hardwood planks, perfect for construction and fine carpentry work.',
    iconId: 'inv_misc_wood_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_wood_01.jpg',
    value: { gold: 0, silver: 1, copper: 80 },
    stackable: true,
    maxStackSize: 5,
    width: 2,
    height: 1,
    rotation: 0,
    materialType: 'Wood',
    professions: ['Carpentry', 'Engineering'],
    gatheringMethod: 'logging'
  },
  {
    id: 'leather-strips',
    name: 'Leather Strips',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'Thin strips of cured leather, useful for binding and reinforcing equipment.',
    iconId: 'inv_misc_leatherscrap_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_leatherscrap_02.jpg',
    value: { gold: 0, silver: 0, copper: 45 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Leather',
    professions: ['Leatherworking', 'Tailoring'],
    gatheringMethod: 'skinning'
  },

  // Additional Trade Goods
  {
    id: 'exotic-spices',
    name: 'Exotic Spices',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'rare',
    description: 'A collection of rare spices from distant lands. Highly valued by chefs and alchemists alike.',
    iconId: 'inv_misc_food_15',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_15.jpg',
    value: { gold: 2, silver: 3, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    tradeCategory: 'consumables',
    origin: 'Exotic',
    demandLevel: 'Very High',
    qualityGrade: 'Premium'
  },
  {
    id: 'fine-wine',
    name: 'Fine Wine',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'uncommon',
    description: 'A bottle of aged wine from the finest vineyards. Popular among nobles and merchants.',
    iconId: 'inv_drink_wine_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_drink_wine_01.jpg',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: true,
    maxStackSize: 3,
    width: 1,
    height: 2,
    rotation: 0,
    tradeCategory: 'luxury',
    origin: 'Regional',
    demandLevel: 'High',
    qualityGrade: 'Fine'
  },

  // Additional Reagents
  {
    id: 'dragon-scale',
    name: 'Dragon Scale',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'epic',
    description: 'A shimmering scale from an ancient dragon. Radiates powerful magical energy.',
    iconId: 'inv_misc_monsterscales_15',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_monsterscales_15.jpg',
    value: { gold: 14, silver: 67, copper: 53 },
    stackable: true,
    maxStackSize: 3,
    width: 1,
    height: 1,
    rotation: 0,
    reagentType: 'Scale',
    magicType: 'fire',
    reagentState: 'Pure',
    requiredFor: 'High-level enchantments and dragon magic'
  },
  {
    id: 'unicorn-hair',
    name: 'Unicorn Hair',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'legendary',
    description: 'A single strand of hair from a unicorn\'s mane. Incredibly rare and potent for holy magic.',
    iconId: 'inv_misc_herb_11',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_11.jpg',
    value: { gold: 49, silver: 28, copper: 91 },
    stackable: true,
    maxStackSize: 1,
    width: 1,
    height: 1,
    rotation: 0,
    reagentType: 'Essence',
    magicType: 'holy',
    reagentState: 'Pure',
    requiredFor: 'Divine magic and purification rituals'
  },
  {
    id: 'void-crystal',
    name: 'Void Crystal',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'rare',
    description: 'A dark crystal that seems to absorb light. Contains concentrated shadow magic.',
    iconId: 'inv_enchant_voidcrystal',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_voidcrystal.jpg',
    value: { gold: 3, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    reagentType: 'Crystal',
    magicType: 'shadow',
    reagentState: 'Refined',
    requiredFor: 'Shadow magic and necromancy'
  },

  // Additional Tools
  {
    id: 'lockpicks',
    name: 'Thieves\' Tools',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'A set of finely crafted lockpicks and tools for the discerning rogue.',
    iconId: 'inv_misc_key_03',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_key_03.jpg',
    value: { gold: 0, silver: 12, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0
  },
  {
    id: 'magnifying-glass',
    name: 'Magnifying Glass',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'uncommon',
    description: 'A crystal lens that magnifies small details. Useful for examining clues and fine work.',
    iconId: 'inv_misc_spyglass_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
    value: { gold: 0, silver: 15, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0
  },
  {
    id: 'healing-kit',
    name: 'Healer\'s Kit',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'A leather pouch containing bandages, herbs, and basic medical supplies.',
    iconId: 'inv_misc_bag_cenarionherbbag',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_cenarionherbbag.jpg',
    value: { gold: 0, silver: 8, copper: 50 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0
  },

  // Additional Quest Items
  {
    id: 'ancient-tome',
    name: 'Ancient Tome of Secrets',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'rare',
    description: 'A weathered book filled with arcane knowledge. The pages seem to whisper ancient secrets.',
    iconId: 'inv_misc_book_11',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    questGiver: 'Archmage Valdris',
    questObjectives: 'Decipher the ancient runes and unlock the tome\'s secrets',
    requiredLevel: 15,
    timeLimit: null
  },
  {
    id: 'royal-seal',
    name: 'Royal Seal of Approval',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'epic',
    description: 'An ornate golden seal bearing the royal coat of arms. Grants official authority.',
    iconId: 'inv_jewelry_ring_15',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_15.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questGiver: 'King Aldric',
    questObjectives: 'Present the seal to the Guild Master to gain official recognition',
    requiredLevel: 20,
    timeLimit: null
  },
  {
    id: 'mysterious-artifact',
    name: 'Mysterious Artifact',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'legendary',
    description: 'An otherworldly object that pulses with unknown energy. Its purpose remains a mystery.',
    iconId: 'inv_misc_orb_05',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_orb_05.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questGiver: 'Scholar Theron',
    questObjectives: 'Research the artifact\'s origin and discover its true power',
    requiredLevel: 25,
    timeLimit: null
  },

  // Additional Junk Items
  {
    id: 'bent-spoon',
    name: 'Bent Spoon',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A simple eating utensil that has seen better days. Might be worth a few coppers to the right person.',
    iconId: 'inv_misc_fork&knife',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_fork&knife.jpg',
    value: { gold: 0, silver: 0, copper: 3 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    condition: 'worn',
    origin: 'tavern',
    rarity: 'common'
  },
  {
    id: 'cracked-pottery',
    name: 'Cracked Pottery Shard',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A fragment of what was once a beautiful ceramic vessel. Now just decorative debris.',
    iconId: 'inv_misc_pottery_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pottery_01.jpg',
    value: { gold: 0, silver: 0, copper: 1 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    condition: 'broken',
    origin: 'ruins',
    rarity: 'abundant'
  },
  {
    id: 'old-boot',
    name: 'Worn Leather Boot',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A single boot that has walked many miles. Its partner is long lost.',
    iconId: 'inv_boots_cloth_03',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_cloth_03.jpg',
    value: { gold: 0, silver: 0, copper: 5 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 2,
    rotation: 0,
    condition: 'weathered',
    origin: 'roadside',
    rarity: 'uncommon'
  },

  // === QUEST ITEMS ===

  {
    id: 'ancient-tome-shadows',
    name: 'Ancient Tome of Shadows',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'rare',
    description: 'A leather-bound tome filled with arcane symbols and forgotten knowledge. The pages seem to whisper secrets of the past.',
    iconId: 'inv_misc_book_08',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_08.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 2,
    rotation: 0,
    questGiver: 'Archmage Valdris',
    questObjectives: 'Return this tome to the Grand Library in Mythrill City.',
    timeLimit: 0,
    requiredLevel: 5
  },
  {
    id: 'crystal-shard',
    name: 'Corrupted Crystal Shard',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'uncommon',
    description: 'A jagged crystal shard pulsing with dark energy. It feels cold to the touch and seems to absorb light around it.',
    iconId: 'inv_misc_gem_bloodstone_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_bloodstone_01.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    questGiver: 'Captain Thorne',
    questObjectives: 'Investigate the source of corruption in the Whispering Woods.',
    timeLimit: 0,
    requiredLevel: 3
  },
  {
    id: 'sealed-letter',
    name: 'Sealed Royal Decree',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common',
    description: 'An official letter bearing the royal seal. The wax is still warm, suggesting urgent importance.',
    iconId: 'inv_misc_note_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_01.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    questGiver: 'Royal Messenger',
    questObjectives: 'Deliver this decree to Lord Commander Aldric at the northern outpost.',
    timeLimit: 3600,
    requiredLevel: 1
  },
  {
    id: 'ancient-dragon-scale',
    name: 'Ancient Dragon Scale',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'epic',
    description: 'A massive scale from an ancient dragon, still warm to the touch. Runes of power are etched along its surface.',
    iconId: 'inv_misc_monsterscales_15',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_monsterscales_15.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 2,
    height: 2,
    rotation: 0,
    questGiver: 'Elder Sage Miriel',
    questObjectives: 'Use this scale to forge the legendary Dragonbane weapon.',
    timeLimit: 0,
    requiredLevel: 15
  },

  // === REAGENTS ===

  {
    id: 'moonwell-water',
    name: 'Moonwell Water',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'uncommon',
    description: 'Pure water blessed by moonlight, shimmering with ethereal energy. Essential for many magical rituals.',
    iconId: 'inv_potion_83',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_83.jpg',
    value: { gold: 0, silver: 5, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    reagentType: 'Essence',
    magicType: 'nature',
    reagentState: 'Pure',
    requiredFor: 'Healing and purification rituals'
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'rare',
    description: 'A brilliant feather that glows with inner fire. Said to retain the phoenix\'s power of rebirth.',
    iconId: 'inv_feather_16',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_feather_16.jpg',
    value: { gold: 2, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    reagentType: 'Feather',
    magicType: 'fire',
    reagentState: 'Raw',
    requiredFor: 'Resurrection and fire magic'
  },
  {
    id: 'shadow-essence',
    name: 'Essence of Shadow',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'uncommon',
    description: 'A dark, swirling essence captured from the shadow realm. Useful in necromantic and illusion magic.',
    iconId: 'inv_misc_dust_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dust_02.jpg',
    value: { gold: 0, silver: 8, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    reagentType: 'Essence',
    magicType: 'shadow',
    reagentState: 'Refined',
    requiredFor: 'Necromancy and illusion spells'
  },

  // === CRAFTING MATERIALS ===

  {
    id: 'dragonhide-leather',
    name: 'Dragonhide Leather',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'rare',
    description: 'Tough leather from a dragon\'s hide, nearly impervious to fire and magic. Prized by master leatherworkers.',
    iconId: 'inv_misc_leatherscrap_08',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_leatherscrap_08.jpg',
    value: { gold: 5, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    materialType: 'Leather',
    professions: ['Leatherworking'],
    gatheringMethod: 'skinning'
  },
  {
    id: 'mithril-ingot',
    name: 'Mithril Ingot',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'A refined ingot of mithril, lighter than steel but stronger than iron. Essential for crafting fine weapons and armor.',
    iconId: 'inv_ingot_mithril',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_ingot_mithril.jpg',
    value: { gold: 1, silver: 5, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    materialType: 'Metal',
    professions: ['Blacksmithing'],
    gatheringMethod: 'mining'
  },
  {
    id: 'enchanted-thread',
    name: 'Enchanted Thread',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'Silken thread infused with magical energy, glowing faintly with arcane power. Used in creating magical garments.',
    iconId: 'inv_fabric_silk_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_fabric_silk_02.jpg',
    value: { gold: 0, silver: 15, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    materialType: 'Cloth',
    professions: ['Tailoring'],
    gatheringMethod: 'harvesting'
  },
  {
    id: 'crystal-dust',
    name: 'Powdered Crystal',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'Fine crystal dust that sparkles in the light. Used as a component in various enchantments and alchemical recipes.',
    iconId: 'inv_misc_dust_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dust_01.jpg',
    value: { gold: 0, silver: 3, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    materialType: 'Crystal',
    professions: ['Enchanting'],
    gatheringMethod: 'mining'
  },
  {
    id: 'hardened-wood',
    name: 'Ironbark Wood',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'Wood from the ancient ironbark trees, as hard as metal but retaining the flexibility of living wood.',
    iconId: 'inv_misc_wood_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_wood_01.jpg',
    value: { gold: 0, silver: 8, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    materialType: 'Wood',
    professions: ['Carpentry'],
    gatheringMethod: 'logging'
  },

  // === TRADE GOODS & VALUABLES ===

  {
    id: 'sapphire-gem',
    name: 'Flawless Sapphire',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'rare',
    description: 'A perfectly cut sapphire that catches and reflects light beautifully. Highly valued by nobles and merchants.',
    iconId: 'inv_misc_gem_sapphire_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_sapphire_02.jpg',
    value: { gold: 8, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    tradeCategory: 'gems',
    origin: 'Imported',
    demandLevel: 'High',
    qualityGrade: 'Superior'
  },
  {
    id: 'exotic-spice-blend',
    name: 'Exotic Spice Blend',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'uncommon',
    description: 'A rare blend of spices from distant lands, prized by chefs and alchemists alike for their unique properties.',
    iconId: 'inv_misc_food_15',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_15.jpg',
    value: { gold: 2, silver: 5, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    tradeCategory: 'spices',
    origin: 'Exotic',
    demandLevel: 'Very High',
    qualityGrade: 'Fine'
  },
  {
    id: 'silk-fabric',
    name: 'Shimmerweave Silk',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'uncommon',
    description: 'Luxurious silk that seems to shimmer with its own light. Highly sought after for creating fine garments.',
    iconId: 'inv_fabric_silk_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_fabric_silk_01.jpg',
    value: { gold: 1, silver: 2, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    tradeCategory: 'textiles',
    origin: 'Imported',
    demandLevel: 'High',
    qualityGrade: 'Fine'
  },
  {
    id: 'pearl-string',
    name: 'String of Pearls',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'rare',
    description: 'A necklace of perfectly matched pearls from the deep ocean. A symbol of wealth and status.',
    iconId: 'inv_jewelry_necklace_03',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_03.jpg',
    value: { gold: 11, silver: 94, copper: 76 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    tradeCategory: 'luxury',
    origin: 'Exotic',
    demandLevel: 'Very High',
    qualityGrade: 'Exceptional'
  },
  {
    id: 'amber-fossil',
    name: 'Ancient Amber',
    type: 'miscellaneous',
    subtype: 'TRADE_GOODS',
    quality: 'uncommon',
    description: 'A piece of ancient amber containing a perfectly preserved insect from ages past. Valued by scholars and collectors.',
    iconId: 'inv_misc_gem_amber_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_amber_01.jpg',
    value: { gold: 3, silver: 5, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    stackable: true,
    maxStackSize: 5,
    tradeCategory: 'art',
    origin: 'Local',
    demandLevel: 'Moderate',
    qualityGrade: 'Superior'
  },

  // === KEYS ===

  {
    id: 'dungeon-master-key',
    name: 'Dungeon Master Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'rare',
    description: 'An ornate key made of blackened steel, inscribed with ancient runes. Opens the deepest chambers of forgotten dungeons.',
    iconId: 'inv_misc_key_10',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_key_10.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'door',
    keyId: 'DUNGEON01',
    unlocks: 'Ancient Dungeon Chambers',
    location: 'Forgotten Depths',
    securityLevel: 'master'
  },
  {
    id: 'crystal-chamber-key',
    name: 'Crystal Chamber Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'uncommon',
    description: 'A translucent key that glows with inner light. Used to access the crystal chambers beneath the mage tower.',
    iconId: 'inv_misc_key_13',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_key_13.jpg',
    value: { gold: 0, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'door',
    keyId: 'CRYSTAL01',
    unlocks: 'Crystal Chambers',
    location: 'Mage Tower Basement',
    securityLevel: 'advanced'
  },
  {
    id: 'rusty-gate-key',
    name: 'Rusty Gate Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'common',
    description: 'An old, rusty key that looks like it hasn\'t been used in years. Might open some forgotten gate or door.',
    iconId: 'inv_misc_key_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_key_01.jpg',
    value: { gold: 0, silver: 1, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'door',
    keyId: 'GATERUST',
    unlocks: 'Old Iron Gate',
    location: 'Abandoned Courtyard',
    securityLevel: 'basic'
  },

  // === ADDITIONAL TOOLS ===

  {
    id: 'thieves-tools',
    name: 'Thieves\' Tools',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'uncommon',
    description: 'A set of finely crafted lockpicks and tools for the discerning rogue. Includes tension wrenches and picks of various sizes.',
    iconId: 'inv_misc_bag_09',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_09.jpg',
    value: { gold: 5, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0
  },
  {
    id: 'alchemist-kit',
    name: 'Portable Alchemy Kit',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'uncommon',
    description: 'A compact set of vials, burners, and measuring tools for brewing potions on the go. Essential for any traveling alchemist.',
    iconId: 'trade_alchemy',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
    value: { gold: 8, silver: 0, copper: 0 },
    width: 2,
    height: 2,
    rotation: 0
  },
  {
    id: 'scholars-magnifying-glass',
    name: 'Scholar\'s Magnifying Glass',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'common',
    description: 'A high-quality magnifying glass with a polished brass handle. Perfect for examining fine details and small text.',
    iconId: 'inv_misc_spyglass_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
    value: { gold: 2, silver: 0, copper: 0 },
    width: 1,
    height: 1,
    rotation: 0
  },

  // === JUNK ITEMS ===

  {
    id: 'broken-sword-hilt',
    name: 'Broken Sword Hilt',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'The remains of what was once a fine sword. The blade is long gone, leaving only a tarnished hilt.',
    iconId: 'inv_sword_04',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
    value: { gold: 0, silver: 0, copper: 15 },
    weight: 0.8,
    width: 1,
    height: 2,
    rotation: 0,
    junkType: 'Remains',
    condition: 'Broken',
    origin: 'Battlefield',
    estimatedValue: 'Negligible'
  },
  {
    id: 'tattered-banner',
    name: 'Tattered War Banner',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A faded and torn banner from some forgotten battle. The heraldry is barely visible through the damage.',
    iconId: 'inv_banner_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_banner_02.jpg',
    value: { gold: 0, silver: 0, copper: 25 },
    weight: 0.5,
    width: 1,
    height: 2,
    rotation: 0,
    junkType: 'Fragment',
    condition: 'Tattered',
    origin: 'Abandoned',
    estimatedValue: 'Negligible'
  },
  {
    id: 'cracked-clay-pot',
    name: 'Cracked Clay Pot',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A simple clay pot with several cracks running through it. No longer suitable for holding liquids.',
    iconId: 'inv_misc_food_19',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_19.jpg',
    value: { gold: 0, silver: 0, copper: 5 },
    weight: 1.2,
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    junkType: 'Debris',
    condition: 'Damaged',
    origin: 'Discarded',
    estimatedValue: 'Negligible'
  },
  {
    id: 'moldy-cheese',
    name: 'Moldy Cheese Wheel',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A wheel of cheese that has seen much better days. Green mold covers most of its surface.',
    iconId: 'inv_misc_food_12',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_12.jpg',
    value: { gold: 0, silver: 0, copper: 2 },
    weight: 2,
    width: 1,
    height: 1,
    rotation: 0,
    junkType: 'Refuse',
    condition: 'Ruined',
    origin: 'Discarded',
    estimatedValue: 'Negligible'
  },
  {
    id: 'bent-silver-spoon',
    name: 'Bent Silver Spoon',
    type: 'miscellaneous',
    subtype: 'JUNK',
    quality: 'poor',
    description: 'A once-elegant silver spoon that has been badly bent out of shape. Still has some tarnished silver value.',
    iconId: 'inv_misc_fork&knife',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_fork&knife.jpg',
    value: { gold: 0, silver: 0, copper: 35 },
    weight: 0.1,
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    junkType: 'Scrap',
    condition: 'Worn',
    origin: 'Salvaged',
    estimatedValue: 'Negligible'
  },

  // === ADDITIONAL DIVERSE ITEMS ===

  // === CURSED WEAPONS ===
  {
    id: 'cursed-blade-of-sorrow',
    name: 'Cursed Blade of Sorrow',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A wickedly sharp blade that whispers dark thoughts to its wielder. Powerful but dangerous to use.',
    iconId: 'inv_sword_62',
    value: { gold: 8, silver: 45, copper: 0 },
    weight: 3,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 10,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      charisma: { value: -2, isPercentage: false } // Negative effect
    },
    width: 1,
    height: 3
  },
  {
    id: 'berserkers-axe',
    name: 'Berserker\'s Bloodthirsty Axe',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'uncommon',
    description: 'An axe that grows stronger with each kill, but makes the wielder increasingly reckless in combat.',
    iconId: 'inv_axe_09',
    value: { gold: 3, silver: 78, copper: 25 },
    weight: 4,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 8,
        damageType: 'slashing'
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: -1, isPercentage: false } // Negative effect
    },
    width: 1,
    height: 3
  },

  // === TAINTED CONSUMABLES ===
  {
    id: 'devils-bargain-potion',
    name: 'Devil\'s Bargain Potion',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'rare',
    description: 'A crimson potion that grants incredible power at a terrible cost. The devil always collects his due.',
    iconId: 'inv_potion_24',
    value: { gold: 2, silver: 15, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'buff',
        stat: 'strength',
        amount: 8,
        duration: 1800 // 30 minutes
      },
      {
        type: 'debuff',
        stat: 'spirit',
        amount: -4,
        duration: 3600 // 1 hour - longer than the buff
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'liquid-courage',
    name: 'Liquid Courage',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A strong alcoholic brew that bolsters confidence but impairs judgment. Popular among tavern brawlers.',
    iconId: 'inv_drink_05',
    value: { gold: 0, silver: 45, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'buff',
        stat: 'charisma',
        amount: 3,
        duration: 600 // 10 minutes
      },
      {
        type: 'debuff',
        stat: 'intelligence',
        amount: -2,
        duration: 1200 // 20 minutes
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'necromancers-elixir',
    name: 'Necromancer\'s Elixir',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'epic',
    description: 'A vile black concoction that grants power over death magic, but slowly corrupts the soul of the drinker.',
    iconId: 'inv_potion_83',
    value: { gold: 12, silver: 0, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'buff',
        stat: 'intelligence',
        amount: 6,
        duration: 3600 // 1 hour
      },
      {
        type: 'debuff',
        stat: 'charisma',
        amount: -3,
        duration: 7200 // 2 hours
      },
      {
        type: 'special',
        description: 'Grants access to necromancy spells but marks the user as evil'
      }
    ],
    width: 1,
    height: 1
  },

  // === EXOTIC FOODS WITH EFFECTS ===
  {
    id: 'spiced-dragon-meat',
    name: 'Spiced Dragon Meat',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'legendary',
    description: 'Tender dragon flesh seasoned with rare spices. Grants fire resistance but makes you glow with inner flame.',
    iconId: 'inv_misc_food_meat_cooked_02',
    value: { gold: 25, silver: 0, copper: 0 },
    weight: 1,
    effects: [
      {
        type: 'resistance',
        damageType: 'fire',
        amount: 50,
        duration: 7200 // 2 hours
      },
      {
        type: 'special',
        description: 'Character glows with fire, making stealth impossible'
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'mushroom-of-madness',
    name: 'Mushroom of Madness',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'rare',
    description: 'A psychedelic fungus that enhances perception but causes vivid hallucinations. Handle with extreme care.',
    iconId: 'inv_mushroom_11',
    value: { gold: 1, silver: 80, copper: 0 },
    weight: 0.1,
    effects: [
      {
        type: 'buff',
        stat: 'spirit',
        amount: 5,
        duration: 1800 // 30 minutes
      },
      {
        type: 'debuff',
        stat: 'intelligence',
        amount: -3,
        duration: 3600 // 1 hour
      },
      {
        type: 'special',
        description: 'Random hallucinations may cause confusion in combat'
      }
    ],
    width: 1,
    height: 1
  },

  // === CURSED ARMOR ===
  {
    id: 'armor-of-the-damned',
    name: 'Armor of the Damned',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'Black plate armor that offers excellent protection but slowly drains the wearer\'s life force.',
    iconId: 'inv_chest_plate_15',
    value: { gold: 18, silver: 50, copper: 0 },
    weight: 45,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 5, isPercentage: false },
      spirit: { value: -3, isPercentage: false } // Negative effect
    },
    armorClass: 18,
    width: 2,
    height: 3
  },
  {
    id: 'cloak-of-shadows',
    name: 'Cloak of Shadows',
    type: 'armor',
    subtype: 'CLOAK',
    quality: 'rare',
    description: 'A dark cloak that grants stealth abilities but makes the wearer vulnerable to light-based attacks.',
    iconId: 'inv_misc_cape_18',
    value: { gold: 6, silver: 25, copper: 0 },
    weight: 2,
    slots: ['back'],
    baseStats: {
      agility: { value: 4, isPercentage: false }
    },
    resistances: {
      shadow: 25
    },
    vulnerabilities: {
      holy: 25 // Negative effect
    },
    width: 2,
    height: 2
  },

  // === CURSED ACCESSORIES ===
  {
    id: 'ring-of-greed',
    name: 'Ring of Greed',
    type: 'accessory',
    subtype: 'RING',
    quality: 'uncommon',
    description: 'A golden ring that increases wealth gained but makes the wearer compulsively greedy and untrustworthy.',
    iconId: 'inv_jewelry_ring_14',
    value: { gold: 4, silver: 0, copper: 0 },
    weight: 0.1,
    slots: ['ring1', 'ring2'],
    baseStats: {
      charisma: { value: -2, isPercentage: false } // Negative effect
    },
    effects: [
      {
        type: 'special',
        description: 'Increases gold found by 25% but causes compulsive behavior'
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'ring-of-cold',
    name: 'Ring of Cold',
    type: 'accessory',
    subtype: 'RING',
    quality: 'rare',
    description: 'A crystalline ring that grants immunity to cold damage but weakens the wearer\'s constitution.',
    iconId: 'inv_jewelry_ring_27',
    value: { gold: 12, silver: 50, copper: 0 },
    weight: 0.1,
    slots: ['ring1', 'ring2'],
    baseStats: {
      constitution: { value: -10, isPercentage: false } // Negative effect as mentioned
    },
    resistances: {
      cold: 0 // 0% means immunity (100% resistance)
    },
    width: 1,
    height: 1
  },
  {
    id: 'amulet-of-the-void',
    name: 'Amulet of the Void',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'A dark crystal pendant that enhances magical power but slowly corrupts the wearer\'s soul.',
    iconId: 'inv_jewelry_necklace_12',
    value: { gold: 8, silver: 75, copper: 0 },
    weight: 0.5,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: -2, isPercentage: false } // Negative effect
    },
    width: 1,
    height: 1
  },

  // === EXOTIC CONSUMABLES ===
  {
    id: 'phoenix-feather-scroll',
    name: 'Phoenix Feather Scroll',
    type: 'consumable',
    subtype: 'SCROLL',
    quality: 'legendary',
    description: 'A brilliant feather that resurrects the user upon death, but burns away their memories of the past day.',
    iconId: 'inv_feather_16',
    value: { gold: 50, silver: 0, copper: 0 },
    weight: 0.1,
    effects: [
      {
        type: 'special',
        description: 'Automatic resurrection on death, but lose 1 day of memories'
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'time-distortion-crystal',
    name: 'Time Distortion Crystal',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'epic',
    description: 'A shimmering crystal that allows the user to act twice in one turn, but ages them rapidly.',
    iconId: 'inv_misc_gem_crystal_02',
    value: { gold: 15, silver: 0, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'special',
        description: 'Gain an extra turn this round, but age 1 year instantly'
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'bottled-nightmare',
    name: 'Bottled Nightmare',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'rare',
    description: 'A swirling black potion that can be thrown to terrify enemies, but haunts the user with bad dreams.',
    iconId: 'inv_potion_20',
    value: { gold: 3, silver: 50, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'area_effect',
        description: 'Causes fear in all enemies within 10 feet'
      },
      {
        type: 'debuff',
        stat: 'spirit',
        amount: -1,
        duration: 86400 // 24 hours
      }
    ],
    width: 1,
    height: 1
  },

  // === POOR QUALITY ITEMS WITH DRAWBACKS ===
  {
    id: 'rusty-chain-mail',
    name: 'Rusty Chain Mail',
    type: 'armor',
    subtype: 'CHAIN',
    quality: 'poor',
    description: 'Old chain mail that\'s more rust than metal. Provides minimal protection and is prone to breaking.',
    iconId: 'inv_chest_chain_03',
    value: { gold: 0, silver: 85, copper: 0 },
    weight: 25,
    slots: ['chest'],
    baseStats: {
      agility: { value: -1, isPercentage: false } // Negative effect
    },
    armorClass: 12,
    width: 2,
    height: 3
  },
  {
    id: 'cracked-leather-boots',
    name: 'Cracked Leather Boots',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'poor',
    description: 'Well-worn boots with holes in the soles. Better than nothing, but not by much.',
    iconId: 'inv_boots_05',
    value: { gold: 0, silver: 15, copper: 0 },
    weight: 2,
    slots: ['feet'],
    baseStats: {
      constitution: { value: -1, isPercentage: false } // Negative effect from cold/wet feet
    },
    armorClass: 1,
    width: 2,
    height: 1
  },

  // === EXOTIC CONTAINERS ===
  {
    id: 'bag-of-devouring',
    name: 'Bag of Devouring',
    type: 'container',
    subtype: 'BAG',
    quality: 'rare',
    description: 'A seemingly normal bag that occasionally eats items placed inside it. Use with extreme caution.',
    iconId: 'inv_misc_bag_10_black',
    value: { gold: 5, silver: 0, copper: 0 },
    weight: 2,
    containerSize: { width: 4, height: 4 },
    effects: [
      {
        type: 'special',
        description: '5% chance per day that a random item disappears'
      }
    ],
    width: 2,
    height: 2
  },
  {
    id: 'alchemists-satchel',
    name: 'Alchemist\'s Satchel',
    type: 'container',
    subtype: 'SATCHEL',
    quality: 'uncommon',
    description: 'A specialized bag that keeps alchemical ingredients fresh but occasionally causes minor explosions.',
    iconId: 'inv_misc_bag_cenarionherbbag',
    value: { gold: 3, silver: 25, copper: 0 },
    weight: 1,
    containerSize: { width: 3, height: 3 },
    effects: [
      {
        type: 'special',
        description: 'Preserves reagents but 1% chance of minor explosion when opened'
      }
    ],
    width: 2,
    height: 2
  },

  // === MAGICAL TOOLS ===
  {
    id: 'cursed-pickaxe',
    name: 'Cursed Pickaxe of Endless Labor',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'uncommon',
    description: 'A pickaxe that never dulls and mines twice as fast, but compels the user to work without rest.',
    iconId: 'inv_pick_02',
    value: { gold: 2, silver: 50, copper: 0 },
    weight: 8,
    effects: [
      {
        type: 'special',
        description: 'Double mining speed but user cannot rest while holding it'
      }
    ],
    width: 1,
    height: 3
  },
  {
    id: 'truth-seeking-compass',
    name: 'Truth-Seeking Compass',
    type: 'miscellaneous',
    subtype: 'TOOL',
    quality: 'rare',
    description: 'A compass that points toward the nearest lie instead of north. Useful for interrogations.',
    iconId: 'inv_misc_compass_01',
    value: { gold: 4, silver: 75, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'special',
        description: 'Points toward the nearest person who has lied in the past hour'
      }
    ],
    width: 1,
    height: 1
  },

  // === EXOTIC MISCELLANEOUS ITEMS ===
  {
    id: 'memory-crystal',
    name: 'Memory Crystal',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'epic',
    description: 'A crystal that can store and replay memories. Highly sought after by scholars and spies.',
    iconId: 'inv_misc_gem_crystal_01',
    value: { gold: 12, silver: 0, copper: 0 },
    weight: 1,
    effects: [
      {
        type: 'special',
        description: 'Can record and replay up to 1 hour of memories'
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'soul-jar',
    name: 'Soul Jar',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'legendary',
    description: 'A dark vessel capable of trapping souls. Extremely dangerous and illegal in most civilized lands.',
    iconId: 'inv_misc_urn_01',
    value: { gold: 100, silver: 0, copper: 0 },
    weight: 3,
    effects: [
      {
        type: 'special',
        description: 'Can trap the soul of a dying creature within 10 feet'
      }
    ],
    width: 1,
    height: 2
  },
  {
    id: 'luck-coin',
    name: 'Two-Faced Luck Coin',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'rare',
    description: 'A coin that brings incredible luck when it lands on heads, but terrible misfortune on tails.',
    iconId: 'inv_misc_coin_01',
    value: { gold: 1, silver: 0, copper: 0 },
    weight: 0.1,
    effects: [
      {
        type: 'special',
        description: 'When flipped: 50% chance for great luck, 50% chance for bad luck for 1 hour'
      }
    ],
    width: 1,
    height: 1
  },

  // === COMMON ITEMS WITH MINOR DRAWBACKS ===
  {
    id: 'noisy-leather-armor',
    name: 'Noisy Leather Armor',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Decent leather armor that creaks loudly with every movement. Not ideal for stealth.',
    iconId: 'inv_chest_leather_06',
    value: { gold: 1, silver: 25, copper: 0 },
    weight: 10,
    slots: ['chest'],
    baseStats: {
      agility: { value: -1, isPercentage: false } // Negative effect for stealth
    },
    armorClass: 11,
    width: 2,
    height: 3
  },
  {
    id: 'heavy-iron-shield',
    name: 'Heavy Iron Shield',
    type: 'armor',
    subtype: 'SHIELD',
    quality: 'common',
    description: 'A sturdy iron shield that provides good protection but is exhausting to carry for long periods.',
    iconId: 'inv_shield_09',
    value: { gold: 1, silver: 50, copper: 0 },
    weight: 15,
    slots: ['offHand'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false } // Negative effect from weight
    },
    armorClass: 2,
    width: 2,
    height: 2
  },

  // === LEGENDARY WEAPONS ===
  {
    id: 'dragonslayer-greatsword',
    name: 'Dragonslayer Greatsword',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'legendary',
    description: 'A massive two-handed sword forged from dragon bone and meteoric steel. Its blade burns with eternal dragonfire.',
    iconId: 'inv_sword_50',
    value: { gold: 75, silver: 0, copper: 0 },
    weight: 8,
    slots: ['mainHand', 'offHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 8,
        damageType: 'slashing'
      },
      additionalDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'fire'
      }
    },
    baseStats: {
      strength: { value: 6, isPercentage: false },
      constitution: { value: 3, isPercentage: false }
    },
    resistances: {
      fire: 50
    },
    width: 1,
    height: 4
  },
  {
    id: 'staff-of-the-archmage',
    name: 'Staff of the Archmage',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'legendary',
    description: 'An ancient staff topped with a crystal that contains the essence of a fallen star. Pulses with immense magical power.',
    iconId: 'inv_staff_13',
    value: { gold: 100, silver: 0, copper: 0 },
    weight: 4,
    slots: ['mainHand'],
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 6,
        damageType: 'force'
      }
    },
    baseStats: {
      intelligence: { value: 8, isPercentage: false },
      spirit: { value: 5, isPercentage: false }
    },
    effects: [
      {
        type: 'special',
        description: 'All spells cost 25% less mana and deal 50% more damage'
      }
    ],
    width: 1,
    height: 4
  },

  // === EPIC ARMOR ===
  {
    id: 'robes-of-the-void-walker',
    name: 'Robes of the Void Walker',
    type: 'armor',
    subtype: 'ROBE',
    quality: 'epic',
    description: 'Dark robes woven from shadow itself. The wearer can step between dimensions but risks being lost in the void.',
    iconId: 'inv_chest_cloth_17',
    value: { gold: 35, silver: 0, copper: 0 },
    weight: 3,
    slots: ['chest'],
    baseStats: {
      intelligence: { value: 6, isPercentage: false },
      spirit: { value: 4, isPercentage: false },
      constitution: { value: -2, isPercentage: false } // Negative effect
    },
    resistances: {
      shadow: 75,
      force: 25
    },
    vulnerabilities: {
      holy: 25
    },
    effects: [
      {
        type: 'special',
        description: 'Can teleport 30 feet once per combat, but 5% chance to be lost in void for 1 round'
      }
    ],
    armorClass: 13,
    width: 2,
    height: 3
  },

  // === EXOTIC CONSUMABLES ===
  {
    id: 'elixir-of-giant-strength',
    name: 'Elixir of Giant Strength',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'epic',
    description: 'A thick, golden potion that grants the strength of a hill giant for a short time, but leaves the user exhausted.',
    iconId: 'inv_potion_61',
    value: { gold: 8, silver: 0, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'buff',
        stat: 'strength',
        amount: 10,
        duration: 600 // 10 minutes
      },
      {
        type: 'debuff',
        stat: 'constitution',
        amount: -3,
        duration: 3600 // 1 hour after effect ends
      }
    ],
    width: 1,
    height: 1
  },
  {
    id: 'potion-of-true-sight',
    name: 'Potion of True Sight',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'rare',
    description: 'A clear potion that reveals all illusions and hidden things, but shows truths the drinker may not want to see.',
    iconId: 'inv_potion_109',
    value: { gold: 5, silver: 50, copper: 0 },
    weight: 0.5,
    effects: [
      {
        type: 'special',
        description: 'See through all illusions and detect invisible creatures for 1 hour'
      },
      {
        type: 'debuff',
        stat: 'charisma',
        amount: -2,
        duration: 7200 // 2 hours - seeing too much truth
      }
    ],
    width: 1,
    height: 1
  },

  // === RARE ACCESSORIES ===
  {
    id: 'crown-of-the-mad-king',
    name: 'Crown of the Mad King',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'legendary',
    description: 'A golden crown that grants incredible charisma and leadership abilities, but slowly drives the wearer insane.',
    iconId: 'inv_crown_02',
    value: { gold: 200, silver: 0, copper: 0 },
    weight: 2,
    slots: ['neck'],
    baseStats: {
      charisma: { value: 8, isPercentage: false },
      intelligence: { value: -1, isPercentage: false } // Gradual madness
    },
    effects: [
      {
        type: 'special',
        description: 'All NPCs treat you as royalty, but gain 1 madness point per day worn'
      }
    ],
    width: 2,
    height: 1
  },

  // === UTILITY ITEMS ===
  {
    id: 'portable-hole',
    name: 'Portable Hole',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'rare',
    description: 'A circular piece of cloth that opens into an extradimensional space. Extremely useful but dangerous if misused.',
    iconId: 'inv_misc_bag_27',
    value: { gold: 25, silver: 0, copper: 0 },
    weight: 0.1,
    effects: [
      {
        type: 'special',
        description: 'Creates a 10-foot deep hole that can store up to 1000 pounds'
      }
    ],
    width: 1,
    height: 1
  },

  // === ALCHEMY MATERIALS ===

  // Herbs
  {
    id: 'silverleaf',
    name: 'Silverleaf',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'common',
    description: 'A delicate herb with silver-tinted leaves. Essential for many basic alchemical preparations.',
    iconId: 'inv_misc_herb_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_01.jpg',
    value: { gold: 0, silver: 0, copper: 15 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Herb',
    professions: ['Alchemy'],
    gatheringMethod: 'herbalism',
    reagentType: 'Herb',
    magicType: 'nature',
    reagentState: 'Raw'
  },
  {
    id: 'peacebloom',
    name: 'Peacebloom',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'common',
    description: 'A gentle white flower that grows in peaceful areas. Its petals have natural healing properties.',
    iconId: 'inv_misc_flower_02',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_flower_02.jpg',
    value: { gold: 0, silver: 0, copper: 12 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Herb',
    professions: ['Alchemy'],
    gatheringMethod: 'herbalism',
    reagentType: 'Herb',
    magicType: 'nature',
    reagentState: 'Raw'
  },
  {
    id: 'mageroyal',
    name: 'Mageroyal',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'common',
    description: 'A purple flower that thrums with magical energy. Highly sought after by alchemists for mana potions.',
    iconId: 'inv_misc_herb_03',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_03.jpg',
    value: { gold: 0, silver: 0, copper: 18 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Herb',
    professions: ['Alchemy'],
    gatheringMethod: 'herbalism',
    reagentType: 'Herb',
    magicType: 'force',
    reagentState: 'Raw'
  },
  {
    id: 'earthroot',
    name: 'Earthroot',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'common',
    description: 'A hardy root that grows deep underground. Its earthy essence provides stability and fortification.',
    iconId: 'inv_misc_root_01',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_root_01.jpg',
    value: { gold: 0, silver: 0, copper: 22 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Herb',
    professions: ['Alchemy'],
    gatheringMethod: 'herbalism',
    reagentType: 'Root',
    magicType: 'earth',
    reagentState: 'Raw'
  },

  // Vials and Containers
  {
    id: 'empty-vial',
    name: 'Empty Vial',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'A small glass vial perfect for storing potions and elixirs. Essential for any alchemist.',
    iconId: 'inv_potion_51',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_51.jpg',
    value: { gold: 0, silver: 0, copper: 5 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Glass',
    professions: ['Alchemy'],
    gatheringMethod: 'crafting'
  },
  {
    id: 'crystal-vial',
    name: 'Crystal Vial',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'uncommon',
    description: 'A beautifully crafted crystal vial that enhances the potency of stored potions. Used for higher-tier alchemical creations.',
    iconId: 'inv_potion_83',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_83.jpg',
    value: { gold: 0, silver: 2, copper: 50 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Crystal',
    professions: ['Alchemy'],
    gatheringMethod: 'crafting'
  },
  {
    id: 'distilled-water',
    name: 'Distilled Water',
    type: 'miscellaneous',
    subtype: 'CRAFTING',
    quality: 'common',
    description: 'Pure, distilled water free of impurities. Essential for creating stable alchemical solutions.',
    iconId: 'inv_potion_97',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_97.jpg',
    value: { gold: 0, silver: 0, copper: 3 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    materialType: 'Liquid',
    professions: ['Alchemy'],
    gatheringMethod: 'vendor'
  },
  {
    id: 'alchemical-catalyst',
    name: 'Alchemical Catalyst',
    type: 'miscellaneous',
    subtype: 'REAGENT',
    quality: 'uncommon',
    description: 'A rare crystalline powder that accelerates alchemical reactions. Required for advanced potion brewing.',
    iconId: 'inv_misc_powder_purple',
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_powder_purple.jpg',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    reagentType: 'Catalyst',
    reagentState: 'Crystalline',
    requiredFor: 'Advanced potion brewing',
    materialType: 'Powder',
    professions: ['Alchemy'],
    gatheringMethod: 'rare'
  },

  // === ALCHEMY PRODUCTS ===

  {
    id: 'elixir-of-fortitude',
    name: 'Elixir of Fortitude',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'uncommon',
    description: 'A potent elixir that temporarily increases constitution and maximum health. The effects last for one hour.',
    iconId: 'inv_potion_43',
    value: { gold: 0, silver: 8, copper: 0 },
    weight: 0.2,
    baseStats: {
      constitution: { value: 3, isPercentage: false, duration: 3600 }
    },
    combatStats: {
      maxHealth: { value: 25, isPercentage: false, duration: 3600 }
    },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'enhancement'
  },
  {
    id: 'greater-healing-potion',
    name: 'Greater Healing Potion',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'uncommon',
    description: 'A potent vial of ruby-red liquid that restores a significant amount of health when consumed.',
    iconId: 'inv_potion_54',
    value: { gold: 0, silver: 4, copper: 0 },
    weight: 0.2,
    combatStats: {
      healthRestore: { value: 75, isPercentage: false }
    },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'healing'
  },
  {
    id: 'elixir-of-agility',
    name: 'Elixir of Agility',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'rare',
    description: 'An elixir that temporarily increases agility and movement speed. The effects last for one hour.',
    iconId: 'inv_potion_95',
    value: { gold: 0, silver: 12, copper: 0 },
    weight: 0.2,
    baseStats: {
      agility: { value: 4, isPercentage: false, duration: 3600 }
    },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'enhancement'
  },
  {
    id: 'poison-antidote',
    name: 'Poison Antidote',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'uncommon',
    description: 'A remedy that neutralizes most common poisons and provides temporary immunity.',
    iconId: 'inv_potion_17',
    value: { gold: 0, silver: 3, copper: 0 },
    weight: 0.2,
    effects: [
      {
        type: 'cure',
        condition: 'poison'
      },
      {
        type: 'immunity',
        condition: 'poison',
        duration: 1800 // 30 minutes
      }
    ],
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'utility'
  },
  {
    id: 'elixir-of-intellect',
    name: 'Elixir of Intellect',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'epic',
    description: 'An elixir that temporarily increases intelligence and magical power. The effects last for one hour.',
    iconId: 'inv_potion_09',
    value: { gold: 0, silver: 20, copper: 0 },
    weight: 0.2,
    baseStats: {
      intelligence: { value: 5, isPercentage: false, duration: 3600 }
    },
    combatStats: {
      spellPower: { value: 15, isPercentage: false, duration: 3600 }
    },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    craftedBy: 'alchemy',
    potionType: 'enhancement'
  },

  // === RECIPE SCROLLS ===

  {
    id: 'minor-healing-potion-recipe-scroll',
    name: 'Recipe: Minor Healing Potion',
    type: 'miscellaneous',
    subtype: 'recipe',
    quality: 'uncommon',
    description: 'A scroll containing the formula for brewing Minor Healing Potions. Right-click to learn.',
    iconId: 'inv_scroll_03',
    value: { gold: 0, silver: 1, copper: 50 },
    width: 1,
    height: 1,
    maxStackSize: 1,
    isConsumable: true,
    recipeId: 'minor-healing-potion-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 0,
    itemLevel: 10,
    bindOnPickup: false,
    unique: false
  },
  {
    id: 'minor-mana-potion-recipe-scroll',
    name: 'Recipe: Minor Mana Potion',
    type: 'miscellaneous',
    subtype: 'recipe',
    quality: 'uncommon',
    description: 'A scroll containing the formula for brewing Minor Mana Potions. Right-click to learn.',
    iconId: 'inv_scroll_03',
    value: { gold: 0, silver: 2, copper: 50 },
    width: 1,
    height: 1,
    maxStackSize: 1,
    isConsumable: true,
    recipeId: 'minor-mana-potion-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 1,
    itemLevel: 20,
    bindOnPickup: false,
    unique: false
  },
  {
    id: 'elixir-of-fortitude-recipe-scroll',
    name: 'Recipe: Elixir of Fortitude',
    type: 'miscellaneous',
    subtype: 'recipe',
    quality: 'uncommon',
    description: 'A scroll containing the formula for brewing Elixirs of Fortitude. Right-click to learn.',
    iconId: 'inv_scroll_03',
    value: { gold: 0, silver: 7, copper: 50 },
    width: 1,
    height: 1,
    maxStackSize: 1,
    isConsumable: true,
    recipeId: 'elixir-of-fortitude-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 2,
    itemLevel: 40,
    bindOnPickup: false,
    unique: false
  },

  // === RECIPE SCROLLS ===

  {
    id: 'recipe-greater-healing-potion',
    name: 'Recipe: Greater Healing Potion',
    type: 'miscellaneous',
    subtype: 'RECIPE',
    quality: 'uncommon',
    description: 'A scroll containing the formula for brewing Greater Healing Potions. Right-click to learn.',
    iconId: 'inv_scroll_03',
    value: { gold: 0, silver: 25, copper: 0 },
    weight: 0.1,
    stackable: false,
    width: 1,
    height: 1,
    recipeId: 'greater-healing-potion-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 2,
    consumable: true,
    onUse: 'learnRecipe'
  },
  {
    id: 'recipe-elixir-of-agility',
    name: 'Recipe: Elixir of Agility',
    type: 'miscellaneous',
    subtype: 'RECIPE',
    quality: 'rare',
    description: 'A scroll containing the formula for brewing Elixirs of Agility. Right-click to learn.',
    iconId: 'inv_scroll_05',
    value: { gold: 1, silver: 0, copper: 0 },
    weight: 0.1,
    stackable: false,
    width: 1,
    height: 1,
    recipeId: 'elixir-of-agility-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 3,
    consumable: true,
    onUse: 'learnRecipe'
  },
  {
    id: 'recipe-poison-antidote',
    name: 'Recipe: Poison Antidote',
    type: 'miscellaneous',
    subtype: 'RECIPE',
    quality: 'uncommon',
    description: 'A scroll containing the formula for brewing Poison Antidotes. Right-click to learn.',
    iconId: 'inv_scroll_03',
    value: { gold: 0, silver: 30, copper: 0 },
    weight: 0.1,
    stackable: false,
    width: 1,
    height: 1,
    recipeId: 'poison-antidote-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 2,
    consumable: true,
    onUse: 'learnRecipe'
  },
  {
    id: 'recipe-elixir-of-intellect',
    name: 'Recipe: Elixir of Intellect',
    type: 'miscellaneous',
    subtype: 'RECIPE',
    quality: 'epic',
    description: 'A scroll containing the formula for brewing Elixirs of Intellect. Right-click to learn.',
    iconId: 'inv_scroll_06',
    value: { gold: 2, silver: 0, copper: 0 },
    weight: 0.1,
    stackable: false,
    width: 1,
    height: 1,
    recipeId: 'elixir-of-intellect-recipe',
    requiredProfession: 'alchemy',
    requiredLevel: 4,
    consumable: true,
    onUse: 'learnRecipe'
  }
];

// Define comprehensive categories for organizing items
const COMPREHENSIVE_CATEGORIES = [
  BASE_CATEGORY,

  // Main Weapons Category
  {
    id: 'weapons',
    name: 'Weapons',
    icon: 'inv_sword_04',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'weapons-swords',
    name: 'Swords',
    icon: 'inv_sword_04',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-axes',
    name: 'Axes',
    icon: 'inv_axe_09',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-maces',
    name: 'Maces & Hammers',
    icon: 'inv_mace_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-daggers',
    name: 'Daggers',
    icon: 'inv_weapon_shortblade_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-bows',
    name: 'Bows & Crossbows',
    icon: 'inv_weapon_bow_08',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-staves',
    name: 'Staves & Wands',
    icon: 'inv_staff_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-polearms',
    name: 'Polearms',
    icon: 'inv_spear_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },

  // Main Armor Category
  {
    id: 'armor',
    name: 'Armor',
    icon: 'inv_chest_plate06',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'armor-cloth',
    name: 'Cloth Armor',
    icon: 'inv_chest_cloth_07',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-leather',
    name: 'Leather Armor',
    icon: 'inv_chest_leather_01',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-mail',
    name: 'Mail Armor',
    icon: 'inv_chest_chain_15',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-plate',
    name: 'Plate Armor',
    icon: 'inv_chest_plate06',
    isBaseCategory: false,
    parentId: 'armor'
  },

  // Accessories Category
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'inv_jewelry_ring_03',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'accessories-rings',
    name: 'Rings',
    icon: 'inv_jewelry_ring_03',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-amulets',
    name: 'Amulets & Necklaces',
    icon: 'inv_jewelry_necklace_03',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-trinkets',
    name: 'Trinkets',
    icon: 'inv_misc_orb_01',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-cloaks',
    name: 'Cloaks',
    icon: 'inv_misc_cape_02',
    isBaseCategory: false,
    parentId: 'accessories'
  },

  // Consumables Category
  {
    id: 'consumables',
    name: 'Consumables',
    icon: 'inv_potion_51',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'consumables-potions',
    name: 'Potions',
    icon: 'inv_potion_51',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-food',
    name: 'Food & Drink',
    icon: 'inv_misc_food_15',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-scrolls',
    name: 'Scrolls',
    icon: 'inv_scroll_03',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-poisons',
    name: 'Poisons',
    icon: 'inv_potion_17',
    isBaseCategory: false,
    parentId: 'consumables'
  },

  // Tools Category
  {
    id: 'tools',
    name: 'Tools & Equipment',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'tools-crafting',
    name: 'Crafting Tools',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: 'tools'
  },
  {
    id: 'tools-adventuring',
    name: 'Adventuring Gear',
    icon: 'inv_misc_rope_01',
    isBaseCategory: false,
    parentId: 'tools'
  },

  // Trade Goods Category
  {
    id: 'trade-goods',
    name: 'Trade Goods',
    icon: 'inv_ore_copper_01',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'trade-goods-ores',
    name: 'Ores & Metals',
    icon: 'inv_ore_copper_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-gems',
    name: 'Gems & Stones',
    icon: 'inv_misc_gem_emerald_02',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-cloth',
    name: 'Cloth & Leather',
    icon: 'inv_fabric_linen_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-reagents',
    name: 'Reagents & Herbs',
    icon: 'inv_misc_herb_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },

  // Containers Category
  {
    id: 'containers',
    name: 'Containers',
    icon: 'inv_box_01',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'containers-bags',
    name: 'Bags & Pouches',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: 'containers'
  },
  {
    id: 'containers-chests',
    name: 'Chests & Boxes',
    icon: 'inv_box_01',
    isBaseCategory: false,
    parentId: 'containers'
  }
];

// Function to categorize items with comprehensive categories
const categorizeItems = (items) => {
  const itemCategories = {};

  items.forEach(item => {
    const categories = [BASE_CATEGORY.id]; // Always include base category

    // Add specific categories based on item type and subtype
    switch (item.type) {
      case 'weapon':
        categories.push('weapons');
        // Add subcategory based on weapon subtype
        switch (item.subtype) {
          case 'SWORD':
          case 'GREATSWORD':
            categories.push('weapons-swords');
            break;
          case 'AXE':
          case 'GREATAXE':
            categories.push('weapons-axes');
            break;
          case 'MACE':
          case 'MAUL':
            categories.push('weapons-maces');
            break;
          case 'DAGGER':
            categories.push('weapons-daggers');
            break;
          case 'BOW':
          case 'CROSSBOW':
            categories.push('weapons-bows');
            break;
          case 'STAFF':
          case 'WAND':
            categories.push('weapons-staves');
            break;
          case 'POLEARM':
          case 'SPEAR':
            categories.push('weapons-polearms');
            break;
        }
        break;
      case 'armor':
        categories.push('armor');
        // Add subcategory based on armor subtype
        switch (item.subtype) {
          case 'CLOTH':
          case 'CHEST':
            if (item.slots && item.slots.includes('chest') && item.name.toLowerCase().includes('robe')) {
              categories.push('armor-cloth');
            } else if (item.slots && item.slots.includes('chest')) {
              categories.push('armor-cloth');
            }
            break;
          case 'LEATHER':
            categories.push('armor-leather');
            break;
          case 'MAIL':
            categories.push('armor-mail');
            break;
          case 'PLATE':
            categories.push('armor-plate');
            break;
          case 'RING':
            categories.push('accessories', 'accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories', 'accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories', 'accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories', 'accessories-cloaks');
            break;
        }
        break;
      case 'consumable':
        categories.push('consumables');
        switch (item.subtype) {
          case 'POTION':
            if (item.name.toLowerCase().includes('poison')) {
              categories.push('consumables-poisons');
            } else {
              categories.push('consumables-potions');
            }
            break;
          case 'FOOD':
          case 'DRINK':
            categories.push('consumables-food');
            break;
          case 'SCROLL':
            categories.push('consumables-scrolls');
            break;
          case 'POISON':
            categories.push('consumables-poisons');
            break;
        }
        break;
      case 'accessory':
        categories.push('accessories');
        // Add subcategory based on accessory subtype
        switch (item.subtype) {
          case 'RING':
            categories.push('accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories-cloaks');
            break;
          case 'CROWN':
          case 'BELT':
            // Add these to general accessories for now
            break;
        }
        break;
      case 'container':
        categories.push('containers');
        switch (item.subtype) {
          case 'BAG':
          case 'POUCH':
            categories.push('containers-bags');
            break;
          case 'CHEST':
          case 'BOX':
            categories.push('containers-chests');
            break;
          default:
            categories.push('containers-chests');
            break;
        }
        break;
      case 'miscellaneous':
        switch (item.subtype) {
          case 'TRADE_GOODS':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('ore') || item.name.toLowerCase().includes('metal')) {
              categories.push('trade-goods-ores');
            } else if (item.name.toLowerCase().includes('cloth') || item.name.toLowerCase().includes('leather')) {
              categories.push('trade-goods-cloth');
            } else if (item.name.toLowerCase().includes('herb') || item.name.toLowerCase().includes('reagent')) {
              categories.push('trade-goods-reagents');
            }
            break;
          case 'CRAFTING':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('gem') || item.name.toLowerCase().includes('stone')) {
              categories.push('trade-goods-gems');
            }
            break;
          case 'TOOL':
            categories.push('tools');
            if (item.name.toLowerCase().includes('craft')) {
              categories.push('tools-crafting');
            } else {
              categories.push('tools-adventuring');
            }
            break;
        }
        break;
    }

    itemCategories[item.id] = categories;
  });

  return itemCategories;
};

const useItemStore = create(
    persist(
        (set, get) => ({
            // View state
            activeView: 'library', // 'library' or 'generation'

            // Item Library state
            items: [...COMPREHENSIVE_ITEMS],
            categories: [...COMPREHENSIVE_CATEGORIES], // Initialize with comprehensive categories
            itemCategories: categorizeItems(COMPREHENSIVE_ITEMS), // Properly categorize items
            selectedItem: null,
            selectedCategory: BASE_CATEGORY.id, // Initialize with base category selected
            openContainers: new Set(), // Track which containers are open
            itemsVersion: COMPREHENSIVE_ITEMS_VERSION, // Track version for auto-updates

            // Item Generation state
            drawMode: false,
            editMode: false,
            selectedTiles: [], // Store as array for persistence
            previewItem: null,

            // Actions
            setActiveView: (view) => set({ activeView: view }),

            // Force reset to comprehensive items (clears localStorage)
            resetToComprehensiveItems: () => {
                // Clear localStorage for this store
                localStorage.removeItem('item-store');

                // Reset to comprehensive items
                set({
                    items: [...COMPREHENSIVE_ITEMS],
                    categories: [...COMPREHENSIVE_CATEGORIES],
                    itemCategories: categorizeItems(COMPREHENSIVE_ITEMS),
                    selectedItem: null,
                    selectedCategory: BASE_CATEGORY.id,
                    openContainers: new Set(),
                    activeView: 'library',
                    drawMode: false,
                    editMode: false,
                    selectedTiles: [],
                    previewItem: null,
                    itemsVersion: COMPREHENSIVE_ITEMS_VERSION
                });

                // Store reset to comprehensive items
            },

            // Category actions
            addCategory: (categoryData) => set(state => {
                const newCategory = {
                    id: Date.now().toString(),
                    name: categoryData.name,
                    parentId: categoryData.parentId,
                    icon: categoryData.icon
                };
                return {
                    categories: [...state.categories, newCategory]
                };
            }),

            editCategory: (categoryId, updates) => set(state => ({
                categories: state.categories.map(c =>
                    c.id === categoryId && !c.isBaseCategory
                        ? { ...c, ...updates }
                        : c
                )
            })),

            deleteCategory: (categoryId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't delete base categories

                // Move items from deleted category to base category
                const newItemCategories = { ...state.itemCategories };
                Object.entries(state.itemCategories).forEach(([itemId, catId]) => {
                    if (catId === categoryId) {
                        newItemCategories[itemId] = BASE_CATEGORY.id;
                    }
                });

                return {
                    categories: state.categories.filter(c => c.id !== categoryId),
                    itemCategories: newItemCategories
                };
            }),

            moveCategory: (categoryId, newParentId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't move base categories

                return {
                    categories: state.categories.map(c =>
                        c.id === categoryId ? { ...c, parentId: newParentId } : c
                    )
                };
            }),

            selectCategory: (categoryId) => set({ selectedCategory: categoryId }),

            // Item actions
            addItem: (item, categories = null) => set(state => {
                const newItem = {
                    id: item.id || Date.now().toString(),
                    ...item
                };

                // Always ensure BASE_CATEGORY.id is included
                const categorySet = new Set([BASE_CATEGORY.id]);

                // Add additional categories if provided
                if (Array.isArray(categories)) {
                    categories.forEach(catId => {
                        if (catId) {
                            categorySet.add(catId);
                        }
                    });
                } else if (categories) {
                    categorySet.add(categories);
                }

                // Create new itemCategories state with the updated categories
                const newItemCategories = {
                    ...state.itemCategories,
                    [newItem.id]: Array.from(categorySet) // Convert Set to Array
                };

                return {
                    items: [...state.items, newItem],
                    itemCategories: newItemCategories
                };
            }),

            updateItem: (itemId, updates) => set(state => {
                const itemIndex = state.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return state;

                const updatedItems = [...state.items];
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };

                return {
                    items: updatedItems,
                    selectedItem: state.selectedItem?.id === itemId ? updatedItems[itemIndex] : state.selectedItem
                };
            }),

            removeItem: (itemId) => set(state => {
                console.log('Removing item with ID:', itemId);

                // Remove the item from items array
                const newItems = state.items.filter(item => item.id !== itemId);
                console.log('Items before removal:', state.items.length, 'Items after removal:', newItems.length);

                // Remove the item from itemCategories
                const newItemCategories = { ...state.itemCategories };
                delete newItemCategories[itemId];

                // If this was the selected item, clear the selection
                const newSelectedItem = state.selectedItem?.id === itemId ? null : state.selectedItem;

                const newState = {
                    items: newItems,
                    itemCategories: newItemCategories,
                    selectedItem: newSelectedItem,
                    itemsVersion: state.itemsVersion // Maintain the version to prevent reset
                };

                console.log('New state after item removal:', newState);
                return newState;
            }),

            moveItem: (itemId, categoryId) => set(state => ({
                itemCategories: {
                    ...state.itemCategories,
                    [itemId]: categoryId === BASE_CATEGORY.id ? [BASE_CATEGORY.id] : [BASE_CATEGORY.id, categoryId]
                }
            })),

            selectItem: (item) => set({ selectedItem: item }),

            toggleContainerOpen: (containerId) => set(state => {
                // Ensure openContainers is a Set
                const currentOpenContainers = state.openContainers instanceof Set
                    ? state.openContainers
                    : new Set(Array.isArray(state.openContainers) ? state.openContainers : []);

                // Create a new Set to avoid mutating the original
                const newOpenContainers = new Set(currentOpenContainers);

                // Toggle the container state
                if (newOpenContainers.has(containerId)) {
                    newOpenContainers.delete(containerId);
                } else {
                    newOpenContainers.add(containerId);
                }

                return { openContainers: newOpenContainers };
            }),

            // Item Generation actions
            toggleDrawMode: () => set(state => ({
                drawMode: !state.drawMode,
                selectedTiles: [] // Reset tiles when toggling draw mode
            })),

            toggleEditMode: () => set(state => ({
                editMode: !state.editMode,
                selectedTiles: [] // Reset tiles when toggling edit mode
            })),

            addSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                if (!currentTiles.includes(tileKey)) {
                    return { selectedTiles: [...currentTiles, tileKey] };
                }
                return state;
            }),

            removeSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                return {
                    selectedTiles: currentTiles.filter(t => t !== tileKey)
                };
            }),

            clearSelectedTiles: () => set({ selectedTiles: [] }),

            setPreviewItem: (item) => set({ previewItem: item }),

            generateItem: (item) => set(state => {
                const newItem = {
                    ...item,
                    id: Date.now().toString(),
                    selectedTiles: [...state.selectedTiles] // Store copy of selected tiles
                };

                return {
                    items: [...state.items, newItem],
                    selectedTiles: [], // Clear selected tiles after generating item
                    previewItem: null
                };
            }),


        }),
        {
            name: 'item-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;

                    try {
                        // Parse the stored data
                        const parsed = JSON.parse(str);

                        // Check version and reset if outdated
                        if (!parsed.state || !parsed.state.itemsVersion || parsed.state.itemsVersion < COMPREHENSIVE_ITEMS_VERSION) {
                            console.log('Item store version outdated or missing, resetting to comprehensive items');
                            console.log('Stored version:', parsed.state?.itemsVersion, 'Required version:', COMPREHENSIVE_ITEMS_VERSION);
                            localStorage.removeItem(name);
                            return null; // This will trigger default initialization
                        }

                        // Convert arrays back to Sets for specific properties
                        if (parsed.state && parsed.state.openContainers) {
                            // Ensure openContainers is a Set
                            parsed.state.openContainers = new Set(parsed.state.openContainers);
                        }

                        console.log('Successfully loaded item store from localStorage');
                        return parsed;
                    } catch (error) {
                        console.error('Error parsing item store from localStorage:', error);
                        localStorage.removeItem(name);
                        return null;
                    }
                },
                setItem: (name, value) => {
                    try {
                        // Convert Sets to arrays for storage
                        const serialized = {
                            ...value,
                            state: {
                                ...value.state,
                                openContainers: Array.from(value.state.openContainers || []),
                                selectedTiles: Array.from(value.state.selectedTiles || [])
                            }
                        };
                        console.log('Saving item store to localStorage, items count:', value.state.items?.length);
                        localStorage.setItem(name, JSON.stringify(serialized));
                    } catch (error) {
                        console.error('Error saving item store to localStorage:', error);
                    }
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);

export default useItemStore;
