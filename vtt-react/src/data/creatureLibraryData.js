// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

// Library version - increment this to force store updates
export const CREATURE_LIBRARY_VERSION = '2.0.0';

export const LIBRARY_CREATURES = [
  // ============================================
  // MERCHANTS
  // ============================================
  
  // Weapons & Armor Merchant
  {
    id: 'gareth-ironhand-merchant',
    name: 'Gareth Ironhand',
    description: 'A stout dwarven blacksmith with calloused hands and a keen eye for quality. Gareth runs "The Forged Path," a well-stocked armory specializing in weapons and armor. His prices are fair, and he pays well for quality metalwork.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['dwarf', 'merchant', 'shopkeeper', 'blacksmith', 'friendly'],
    tokenIcon: 'inv_misc_head_dwarf_01',
    tokenBorder: '#CD7F32',
    stats: {
      strength: 16,
      agility: 10,
      constitution: 17,
      intelligence: 13,
      spirit: 12,
      charisma: 14,
      maxHp: 95,
      currentHp: 95,
      maxMana: 25,
      currentMana: 25,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 16,
      initiative: 1,
      speed: 25,
      flying: 0,
      swimming: 10,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 'resistant'
    },
    vulnerabilities: {},
    abilities: [
      {
        id: 'merchant-appraisal',
        name: 'Merchant\'s Eye',
        description: 'Gareth can instantly appraise the value of any weapon or armor with uncanny accuracy.',
        type: 'special',
        uses: 'unlimited'
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 50, max: 150 },
        silver: { min: 100, max: 300 },
        copper: { min: 200, max: 500 }
      },
      items: []
    },
    isShopkeeper: true,
    shopInventory: {
      shopName: 'The Forged Path',
      shopDescription: 'A warm forge with weapons and armor lining the walls. The sound of hammering echoes from the back, and the smell of hot metal fills the air. Gareth stands behind a counter, ready to trade.',
      restockOnLongRest: true,
      buyRates: {
        default: 25,
        categories: {
          weapon: 60,
          armor: 55,
          consumable: 30,
          accessory: 35,
          container: 40,
          miscellaneous: 45
        }
      },
      items: [
        // Weapons
        { itemId: 'ironweep', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 5 },
        { itemId: 'wanderers-edge', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 3 },
        { itemId: 'soulthirst', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 4 },
        { itemId: 'shattermourn', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 2 },
        { itemId: 'grave-axe', customPrice: { gold: 0, silver: 7, copper: 0 }, quantity: 3 },
        { itemId: 'iron-judgment', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 3 },
        { itemId: 'hunters-whisper', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 2 },
        { itemId: 'gnarled-sorrow', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 2 },
        // Armor
        { itemId: 'weathered-hide', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 4 },
        { itemId: 'rusted-sorrow', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 3 },
        { itemId: 'stiff-resolve', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 4 },
        { itemId: 'chain-of-burden', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 3 },
        { itemId: 'open-palms', customPrice: { gold: 0, silver: 4, copper: 0 }, quantity: 5 },
        { itemId: 'stiffened-grip', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 4 },
        { itemId: 'travelers-tread', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 4 },
        // Tools
        { itemId: 'smithing-hammer', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 3 },
        { itemId: 'tongs', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 4 },
        // Crafting Materials
        { itemId: 'iron-ingot', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 20 },
        { itemId: 'copper-ingot', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 25 },
        { itemId: 'leather-straps', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 30 }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Consumables & Alchemy Merchant
  {
    id: 'lyra-moonwhisper-merchant',
    name: 'Lyra Moonwhisper',
    description: 'An elegant elven alchemist with silver hair and knowing eyes. Lyra runs "The Moonlit Apothecary," a shop filled with bubbling potions, rare herbs, and magical elixirs. She specializes in consumables and alchemical supplies.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['elf', 'merchant', 'shopkeeper', 'alchemist', 'mysterious'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#9370DB',
    stats: {
      strength: 8,
      agility: 14,
      constitution: 12,
      intelligence: 18,
      spirit: 16,
      charisma: 15,
      maxHp: 70,
      currentHp: 70,
      maxMana: 100,
      currentMana: 100,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 13,
      initiative: 3,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 'immune'
    },
    vulnerabilities: {},
    abilities: [
      {
        id: 'alchemist-knowledge',
        name: 'Alchemist\'s Knowledge',
        description: 'Lyra can identify any potion or alchemical substance instantly.',
        type: 'special',
        uses: 'unlimited'
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 30, max: 100 },
        silver: { min: 50, max: 200 },
        copper: { min: 100, max: 400 }
      },
      items: []
    },
    isShopkeeper: true,
    shopInventory: {
      shopName: 'The Moonlit Apothecary',
      shopDescription: 'A dimly lit shop filled with shelves of glowing bottles, dried herbs hanging from the ceiling, and the scent of exotic ingredients. Lyra moves gracefully between bubbling cauldrons and glass vials.',
      restockOnLongRest: true,
      buyRates: {
        default: 20,
        categories: {
          weapon: 25,
          armor: 25,
          consumable: 70,
          accessory: 50,
          container: 45,
          miscellaneous: 60
        }
      },
      items: [
        // Healing Potions
        { itemId: 'crimson-tears', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 15 },
        { itemId: 'blood-remembrance', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 10 },
        { itemId: 'desperate-draught', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 12 },
        // Mana Potions
        { itemId: 'azure-sorrow', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 15 },
        { itemId: 'spirit-whisper', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 10 },
        { itemId: 'madness-brew', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 8 },
        // Buff Potions
        { itemId: 'strength-of-sorrow', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 6 },
        { itemId: 'hastening-regret', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 8 },
        { itemId: 'mind-fog', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 6 },
        { itemId: 'endurance-iron', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 7 },
        // Food
        { itemId: 'hardtack-sorrow', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 30 },
        { itemId: 'travelers-fare', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 20 },
        { itemId: 'stew-of-memories', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 12 },
        // Scrolls
        { itemId: 'scroll-of-haste', customPrice: { gold: 0, silver: 12, copper: 0 }, quantity: 5 },
        { itemId: 'scroll-of-fortitude', customPrice: { gold: 0, silver: 12, copper: 0 }, quantity: 5 },
        // Alchemy Supplies
        { itemId: 'distilled-water', customPrice: { gold: 0, silver: 1, copper: 0 }, quantity: 50 },
        { itemId: 'alcohol-base', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 40 },
        { itemId: 'glass-vial', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 30 },
        { itemId: 'fire-essence', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 15 },
        { itemId: 'frost-essence', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 15 },
        { itemId: 'vital-essence', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 12 },
        // Herbs
        { itemId: 'fieldleaf', customPrice: { gold: 0, silver: 1, copper: 0 }, quantity: 40 },
        { itemId: 'bitterroot', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 30 },
        { itemId: 'sunblossom', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 25 }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // General Goods Merchant
  {
    id: 'thaddeus-quickcoin-merchant',
    name: 'Thaddeus Quickcoin',
    description: 'A portly halfling merchant with a wide smile and quick fingers. Thaddeus runs "Quickcoin\'s Emporium," a general store that seems to have everything. From containers to accessories, tools to materials, if you need it, Thaddeus probably has it.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['halfling', 'merchant', 'shopkeeper', 'trader', 'friendly'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#FFD700',
    stats: {
      strength: 10,
      agility: 15,
      constitution: 12,
      intelligence: 14,
      spirit: 13,
      charisma: 16,
      maxHp: 65,
      currentHp: 65,
      maxMana: 20,
      currentMana: 20,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 13,
      initiative: 3,
      speed: 25,
      flying: 0,
      swimming: 10,
      sightRange: 60,
      darkvision: 0
    },
    resistances: {},
    vulnerabilities: {},
    abilities: [
      {
        id: 'merchant-haggle',
        name: 'Merchant\'s Haggle',
        description: 'Thaddeus is skilled at negotiation and can get better deals.',
        type: 'special',
        uses: 'unlimited'
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 20, max: 80 },
        silver: { min: 50, max: 150 },
        copper: { min: 100, max: 300 }
      },
      items: []
    },
    isShopkeeper: true,
    shopInventory: {
      shopName: 'Quickcoin\'s Emporium',
      shopDescription: 'A cluttered but organized shop filled with shelves, barrels, and crates. Thaddeus moves quickly between items, always ready to make a deal. The shop has a warm, welcoming atmosphere.',
      restockOnLongRest: true,
      buyRates: {
        default: 35,
        categories: {
          weapon: 40,
          armor: 40,
          consumable: 45,
          accessory: 50,
          container: 55,
          miscellaneous: 50
        }
      },
      items: [
        // Containers
        { itemId: 'satchel', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 10 },
        { itemId: 'reinforced-crate', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 5 },
        { itemId: 'alchemy-case', customPrice: { gold: 0, silver: 15, copper: 0 }, quantity: 3 },
        { itemId: 'tool-kit', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 5 },
        // Accessories
        { itemId: 'the-burden', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 8 },
        { itemId: 'hastening-regret', customPrice: { gold: 0, silver: 8, copper: 0 }, quantity: 6 },
        { itemId: 'endurance-iron', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 5 },
        { itemId: 'madness-whisper', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 6 },
        { itemId: 'blood-pact', customPrice: { gold: 0, silver: 12, copper: 0 }, quantity: 4 },
        { itemId: 'silent-focus', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 5 },
        // Tools
        { itemId: 'gathering-pickaxe', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 8 },
        { itemId: 'herbalists-knife', customPrice: { gold: 0, silver: 4, copper: 0 }, quantity: 10 },
        { itemId: 'gathering-sickle', customPrice: { gold: 0, silver: 4, copper: 0 }, quantity: 10 },
        { itemId: 'skinning-knife', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 8 },
        { itemId: 'sewing-needle', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 12 },
        { itemId: 'mortar-pestle', customPrice: { gold: 0, silver: 6, copper: 0 }, quantity: 6 },
        // Crafting Materials - Mining
        { itemId: 'red-copper', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 30 },
        { itemId: 'grey-tin', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 25 },
        { itemId: 'bog-iron', customPrice: { gold: 0, silver: 4, copper: 0 }, quantity: 20 },
        { itemId: 'rough-stone', customPrice: { gold: 0, silver: 1, copper: 0 }, quantity: 50 },
        // Crafting Materials - Textiles
        { itemId: 'linen-fiber', customPrice: { gold: 0, silver: 1, copper: 0 }, quantity: 40 },
        { itemId: 'wool-thread', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 35 },
        { itemId: 'hemp-cord', customPrice: { gold: 0, silver: 2, copper: 0 }, quantity: 30 },
        // Crafting Materials - Skins
        { itemId: 'light-hide', customPrice: { gold: 0, silver: 3, copper: 0 }, quantity: 25 },
        { itemId: 'thick-hide', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 20 },
        { itemId: 'beast-sinew', customPrice: { gold: 0, silver: 4, copper: 0 }, quantity: 22 }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // HUMANOIDS
  // ============================================

  // Human Warrior
  {
    id: 'veteran-guard',
    name: 'Veteran Guard',
    description: 'A battle-hardened human guard with scars and a determined expression. Wears worn but serviceable armor and carries a reliable blade.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['human', 'warrior', 'guard', 'soldier'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#8B4513',
    stats: {
      strength: 15,
      agility: 12,
      constitution: 14,
      intelligence: 10,
      spirit: 11,
      charisma: 10,
      maxHp: 65,
      currentHp: 65,
      maxMana: 15,
      currentMana: 15,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 15,
      initiative: 1,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 0
    },
    resistances: {},
    vulnerabilities: {},
    abilities: [
      {
        name: 'Sword Strike',
        description: 'A basic sword attack.',
        type: 'melee',
        icon: 'ability_warrior_cleave',
        damage: {
          diceCount: 1,
          diceType: 8,
          bonus: 3,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d8+3'
          }
        ]
      },
      {
        name: 'Shield Bash',
        description: 'Bashes with shield, potentially knocking enemy prone.',
        type: 'melee',
        icon: 'ability_warrior_shieldbash',
        damage: {
          diceCount: 1,
          diceType: 4,
          bonus: 2,
          damageType: 'bludgeoning'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 2,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '1d4+2'
          },
          {
            type: 'SAVE',
            attribute: 'strength',
            dc: 13,
            onFail: {
              type: 'CONDITION',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 2, max: 8 },
        silver: { min: 10, max: 25 },
        copper: { min: 20, max: 50 }
      },
      items: [
        { itemId: 'wanderers-edge', dropChance: 40, quantity: { min: 1, max: 1 } },
        { itemId: 'weathered-hide', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'crimson-tears', dropChance: 50, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Orc Berserker
  {
    id: 'orc-berserker',
    name: 'Orc Berserker',
    description: 'A massive orc warrior with bulging muscles and a bloodthirsty grin. Wields a massive axe and fights with reckless abandon.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['orc', 'warrior', 'berserker', 'aggressive'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#8B0000',
    stats: {
      strength: 18,
      agility: 13,
      constitution: 16,
      intelligence: 8,
      spirit: 10,
      charisma: 9,
      maxHp: 85,
      currentHp: 85,
      maxMana: 10,
      currentMana: 10,
      maxActionPoints: 6,
      currentActionPoints: 6,
      armorClass: 14,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      physical: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Axe Cleave',
        description: 'A powerful cleaving attack with a greataxe.',
        type: 'melee',
        icon: 'ability_warrior_cleave',
        damage: {
          diceCount: 1,
          diceType: 12,
          bonus: 4,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d12+4'
          }
        ]
      },
      {
        name: 'Rage',
        description: 'Enters a berserker rage, increasing damage but reducing defense.',
        type: 'special',
        icon: 'spell_nature_bloodlust',
        range: 0,
        actionPointCost: 2,
        cooldown: 4,
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'strength',
            value: 3,
            duration: 3
          },
          {
            type: 'DEBUFF',
            target: 'self',
            stat: 'armor',
            value: -2,
            duration: 3
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 3, max: 12 },
        silver: { min: 15, max: 40 },
        copper: { min: 30, max: 80 }
      },
      items: [
        { itemId: 'grave-axe', dropChance: 60, quantity: { min: 1, max: 1 } },
        { itemId: 'rusted-sorrow', dropChance: 40, quantity: { min: 1, max: 1 } },
        { itemId: 'blood-remembrance', dropChance: 30, quantity: { min: 1, max: 1 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Elven Archer
  {
    id: 'elven-archer',
    name: 'Elven Archer',
    description: 'A graceful elven archer with keen eyes and steady hands. Moves silently through the forest, striking from a distance.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['elf', 'ranger', 'archer', 'stealthy'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#228B22',
    stats: {
      strength: 12,
      agility: 17,
      constitution: 13,
      intelligence: 14,
      spirit: 15,
      charisma: 13,
      maxHp: 55,
      currentHp: 55,
      maxMana: 30,
      currentMana: 30,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 14,
      initiative: 4,
      speed: 35,
      flying: 0,
      swimming: 20,
      sightRange: 90,
      darkvision: 60
    },
    resistances: {
      charm: 'immune'
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Precise Shot',
        description: 'A well-aimed arrow that deals extra damage.',
        type: 'ranged',
        icon: 'ability_hunter_aimedshot',
        damage: {
          diceCount: 1,
          diceType: 8,
          bonus: 4,
          damageType: 'piercing'
        },
        range: 60,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '1d8+4'
          }
        ]
      },
      {
        name: 'Multi-Shot',
        description: 'Fires multiple arrows at nearby targets.',
        type: 'ranged',
        icon: 'ability_hunter_multishot',
        damage: {
          diceCount: 1,
          diceType: 6,
          bonus: 3,
          damageType: 'piercing'
        },
        range: 50,
        actionPointCost: 3,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '1d6+3'
          },
          {
            type: 'AREA',
            shape: 'cone',
            size: 30
          }
        ]
      },
      {
        name: 'Hide',
        description: 'Moves into cover, becoming harder to detect.',
        type: 'special',
        icon: 'ability_stealth',
        range: 0,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'stealth',
            value: 10,
            duration: 2
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 2, max: 10 },
        silver: { min: 10, max: 30 },
        copper: { min: 20, max: 60 }
      },
      items: [
        { itemId: 'hunters-whisper', dropChance: 50, quantity: { min: 1, max: 1 } },
        { itemId: 'threadbare-sorrow', dropChance: 40, quantity: { min: 1, max: 1 } },
        { itemId: 'azure-sorrow', dropChance: 45, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Goblin Rogue
  {
    id: 'goblin-rogue',
    name: 'Goblin Rogue',
    description: 'A small, sneaky goblin with quick fingers and a cruel smile. Prefers to strike from the shadows and retreat quickly.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'rogue', 'sneaky', 'cowardly'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#4CAF50',
    stats: {
      strength: 8,
      agility: 16,
      constitution: 10,
      intelligence: 11,
      spirit: 8,
      charisma: 9,
      maxHp: 35,
      currentHp: 35,
      maxMana: 15,
      currentMana: 15,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 14,
      initiative: 4,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {},
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Dagger Stab',
        description: 'A quick stab with a dagger, dealing extra damage if the target is surprised.',
        type: 'melee',
        icon: 'ability_rogue_daggersofexpertise',
        damage: {
          diceCount: 1,
          diceType: 4,
          bonus: 3,
          damageType: 'piercing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '1d4+3'
          }
        ]
      },
      {
        name: 'Backstab',
        description: 'A devastating attack from behind.',
        type: 'melee',
        icon: 'ability_rogue_backstab',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 3,
          damageType: 'piercing'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '2d6+3'
          }
        ]
      },
      {
        name: 'Disengage',
        description: 'Quickly moves away from danger without provoking attacks.',
        type: 'special',
        icon: 'ability_rogue_feint',
        range: 0,
        actionPointCost: 1,
        cooldown: 0,
        effects: [
          {
            type: 'SPECIAL',
            description: 'Can move up to speed without provoking opportunity attacks.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 1, max: 4 },
        silver: { min: 5, max: 15 },
        copper: { min: 10, max: 30 }
      },
      items: [
        { itemId: 'soulthirst', dropChance: 45, quantity: { min: 1, max: 1 } },
        { itemId: 'tattered-memories', dropChance: 50, quantity: { min: 1, max: 1 } },
        { itemId: 'crimson-tears', dropChance: 40, quantity: { min: 1, max: 1 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Human Mage
  {
    id: 'human-mage',
    name: 'Human Mage',
    description: 'A robed human mage with a staff and arcane symbols. Channels magical energy to cast destructive spells.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['human', 'mage', 'spellcaster', 'arcane'],
    tokenIcon: 'inv_staff_13',
    tokenBorder: '#4169E1',
    stats: {
      strength: 8,
      agility: 12,
      constitution: 11,
      intelligence: 17,
      spirit: 15,
      charisma: 13,
      maxHp: 50,
      currentHp: 50,
      maxMana: 80,
      currentMana: 80,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armorClass: 12,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 0
    },
    resistances: {
      arcane: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Magic Missile',
        description: 'Launches bolts of force energy that always hit.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 1,
        icon: 'spell_arcane_arcane01',
        damage: {
          diceCount: 1,
          diceType: 4,
          bonus: 1,
          damageType: 'force'
        },
        range: 60,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'force',
            formula: '1d4+1'
          }
        ]
      },
      {
        name: 'Firebolt',
        description: 'A bolt of fire that ignites flammable objects.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 1,
        icon: 'spell_fire_firebolt',
        damage: {
          diceCount: 1,
          diceType: 10,
          bonus: 0,
          damageType: 'fire'
        },
        range: 60,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '1d10'
          }
        ]
      },
      {
        name: 'Mage Armor',
        description: 'Creates a protective magical barrier.',
        type: 'spell',
        spellType: 'ABJURATION',
        level: 1,
        icon: 'spell_holy_magicalsentry',
        range: 0,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'armor',
            value: 3,
            duration: 8
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 3, max: 12 },
        silver: { min: 10, max: 30 },
        copper: { min: 20, max: 60 }
      },
      items: [
        { itemId: 'gnarled-sorrow', dropChance: 50, quantity: { min: 1, max: 1 } },
        { itemId: 'threadbare-sorrow', dropChance: 40, quantity: { min: 1, max: 1 } },
        { itemId: 'azure-sorrow', dropChance: 55, quantity: { min: 1, max: 3 } },
        { itemId: 'arcane-dust', dropChance: 60, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // BEASTS
  // ============================================

  // Dire Wolf
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    description: 'A massive wolf with matted fur and glowing eyes. Stands nearly as tall as a human and hunts in packs.',
    type: CREATURE_TYPES.BEAST,
    size: CREATURE_SIZES.LARGE,
    tags: ['wolf', 'predator', 'pack', 'beast'],
    tokenIcon: 'ability_mount_whitetiger',
    tokenBorder: '#696969',
    stats: {
      strength: 17,
      agility: 15,
      constitution: 15,
      intelligence: 3,
      spirit: 12,
      charisma: 7,
      maxHp: 75,
      currentHp: 75,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 14,
      initiative: 2,
      speed: 50,
      flying: 0,
      swimming: 20,
      sightRange: 60,
      darkvision: 30
    },
    resistances: {},
    vulnerabilities: {},
    abilities: [
      {
        name: 'Bite',
        description: 'A powerful bite that can knock enemies prone.',
        type: 'melee',
        icon: 'ability_druid_ferociousbite',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 3,
          damageType: 'piercing'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '2d6+3'
          },
          {
            type: 'SAVE',
            attribute: 'strength',
            dc: 13,
            onFail: {
              type: 'CONDITION',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Pack Tactics',
        description: 'Has advantage on attack rolls if an ally is within 5 feet of the target.',
        type: 'special',
        icon: 'ability_hunter_pet_wolf',
        range: 0,
        actionPointCost: 0,
        cooldown: 0,
        effects: [
          {
            type: 'SPECIAL',
            description: 'Advantage on attack rolls when an ally is within 5 feet of the target.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 0 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: [
        { itemId: 'light-hide', dropChance: 100, quantity: { min: 1, max: 2 } },
        { itemId: 'thick-hide', dropChance: 60, quantity: { min: 1, max: 1 } },
        { itemId: 'beast-sinew', dropChance: 70, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Giant Spider
  {
    id: 'giant-spider',
    name: 'Giant Spider',
    description: 'A massive arachnid with eight glowing eyes and venomous fangs. Spins webs to trap prey.',
    type: CREATURE_TYPES.BEAST,
    size: CREATURE_SIZES.LARGE,
    tags: ['spider', 'venomous', 'web', 'beast'],
    tokenIcon: 'inv_misc_head_dragon_black',
    tokenBorder: '#8B0000',
    stats: {
      strength: 14,
      agility: 16,
      constitution: 12,
      intelligence: 2,
      spirit: 10,
      charisma: 4,
      maxHp: 50,
      currentHp: 50,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 14,
      initiative: 3,
      speed: 30,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {},
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Bite',
        description: 'A venomous bite that poisons the target.',
        type: 'melee',
        icon: 'ability_creature_poison_01',
        damage: {
          diceCount: 1,
          diceType: 8,
          bonus: 2,
          damageType: 'piercing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '1d8+2'
          },
          {
            type: 'DAMAGE',
            damageType: 'poison',
            formula: '2d8'
          },
          {
            type: 'SAVE',
            attribute: 'constitution',
            dc: 11,
            onFail: {
              type: 'CONDITION',
              condition: 'poisoned',
              duration: 3
            }
          }
        ]
      },
      {
        name: 'Web',
        description: 'Shoots a web that restrains the target.',
        type: 'ranged',
        icon: 'spell_nature_web',
        range: 30,
        actionPointCost: 3,
        cooldown: 2,
        effects: [
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 12,
            onFail: {
              type: 'CONDITION',
              condition: 'restrained',
              duration: 2
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 0 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: [
        { itemId: 'light-hide', dropChance: 80, quantity: { min: 1, max: 2 } },
        { itemId: 'beast-sinew', dropChance: 60, quantity: { min: 1, max: 1 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // UNDEAD
  // ============================================

  // Skeleton Warrior
  {
    id: 'skeleton-warrior',
    name: 'Skeleton Warrior',
    description: 'An animated skeleton clad in rusted armor, wielding a notched blade. Its empty eye sockets glow with an eerie light.',
    type: CREATURE_TYPES.UNDEAD,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['skeleton', 'undead', 'warrior', 'mindless'],
    tokenIcon: 'inv_misc_bone_skull_01',
    tokenBorder: '#C0C0C0',
    stats: {
      strength: 14,
      agility: 12,
      constitution: 15,
      intelligence: 6,
      spirit: 8,
      charisma: 5,
      maxHp: 45,
      currentHp: 45,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armorClass: 13,
      initiative: 1,
      speed: 30,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 'immune',
      physical: 25
    },
    vulnerabilities: {
      bludgeoning: 50
    },
    abilities: [
      {
        name: 'Sword Slash',
        description: 'A basic sword attack.',
        type: 'melee',
        icon: 'ability_warrior_cleave',
        damage: {
          diceCount: 1,
          diceType: 6,
          bonus: 2,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d6+2'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 1, max: 5 },
        silver: { min: 5, max: 15 },
        copper: { min: 10, max: 30 }
      },
      items: [
        { itemId: 'ironweep', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'bone-plates', dropChance: 70, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Zombie
  {
    id: 'zombie',
    name: 'Zombie',
    description: 'A shambling corpse with rotting flesh and vacant eyes. Moves slowly but is relentless in its pursuit.',
    type: CREATURE_TYPES.UNDEAD,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['zombie', 'undead', 'slow', 'mindless'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#556B2F',
    stats: {
      strength: 13,
      agility: 6,
      constitution: 16,
      intelligence: 3,
      spirit: 6,
      charisma: 5,
      maxHp: 55,
      currentHp: 55,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 3,
      currentActionPoints: 3,
      armorClass: 8,
      initiative: -2,
      speed: 20,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 'immune'
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Slam',
        description: 'A clumsy but powerful slam attack.',
        type: 'melee',
        icon: 'ability_warrior_shieldbreak',
        damage: {
          diceCount: 1,
          diceType: 6,
          bonus: 1,
          damageType: 'bludgeoning'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '1d6+1'
          }
        ]
      },
      {
        name: 'Undead Fortitude',
        description: 'If reduced to 0 HP, makes a constitution save to stay at 1 HP instead.',
        type: 'special',
        icon: 'spell_shadow_raisedead',
        range: 0,
        actionPointCost: 0,
        cooldown: 0,
        effects: [
          {
            type: 'SPECIAL',
            description: 'When reduced to 0 HP, makes a DC 5 + damage taken Constitution save. On success, drops to 1 HP instead.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 2 },
        silver: { min: 2, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        { itemId: 'bone-plates', dropChance: 50, quantity: { min: 1, max: 1 } },
        { itemId: 'ground-bone', dropChance: 40, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // ELEMENTALS
  // ============================================

  // Fire Elemental
  {
    id: 'fire-elemental',
    name: 'Fire Elemental',
    description: 'A swirling vortex of flame and smoke in a vaguely humanoid shape. Radiates intense heat and leaves scorched ground in its wake.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.LARGE,
    tags: ['fire', 'elemental', 'burning', 'magical'],
    tokenIcon: 'spell_fire_fire',
    tokenBorder: '#FF4500',
    stats: {
      strength: 10,
      agility: 17,
      constitution: 16,
      intelligence: 6,
      spirit: 10,
      charisma: 7,
      maxHp: 120,
      currentHp: 120,
      maxMana: 50,
      currentMana: 50,
      maxActionPoints: 6,
      currentActionPoints: 6,
      armorClass: 15,
      initiative: 3,
      speed: 50,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      fire: 100,
      physical: 50
    },
    vulnerabilities: {
      water: 100,
      frost: 50
    },
    abilities: [
      {
        name: 'Touch of Flame',
        description: 'A burning touch that ignites flammable objects.',
        type: 'melee',
        icon: 'spell_fire_fireball',
        damage: {
          diceCount: 2,
          diceType: 8,
          bonus: 3,
          damageType: 'fire'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '2d8+3'
          },
          {
            type: 'CONDITION',
            condition: 'burning',
            duration: 2,
            damageFormula: '1d6'
          }
        ]
      },
      {
        name: 'Fire Nova',
        description: 'An explosion of flame that damages all nearby creatures.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 4,
        icon: 'spell_fire_soulburn',
        damage: {
          diceCount: 4,
          diceType: 6,
          bonus: 0,
          damageType: 'fire'
        },
        range: 0,
        actionPointCost: 5,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '4d6'
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 15
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 15,
            success: 'half'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 5, max: 15 },
        silver: { min: 10, max: 30 },
        copper: { min: 20, max: 50 }
      },
      items: [
        { itemId: 'fire-essence', dropChance: 100, quantity: { min: 2, max: 4 } },
        { itemId: 'ember-ore', dropChance: 40, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // DRAGONS
  // ============================================

  // Young Red Dragon
  {
    id: 'young-red-dragon',
    name: 'Young Red Dragon',
    description: 'A young but already formidable red dragon with gleaming scales and eyes that burn with avarice. Breathes fire and hoards treasure.',
    type: CREATURE_TYPES.DRAGON,
    size: CREATURE_SIZES.LARGE,
    tags: ['dragon', 'red', 'fire', 'greedy'],
    tokenIcon: 'inv_misc_head_dragon_red',
    tokenBorder: '#DC143C',
    stats: {
      strength: 19,
      agility: 10,
      constitution: 17,
      intelligence: 14,
      spirit: 13,
      charisma: 15,
      maxHp: 178,
      currentHp: 178,
      maxMana: 60,
      currentMana: 60,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 18,
      initiative: 0,
      speed: 40,
      flying: 80,
      swimming: 40,
      sightRange: 60,
      darkvision: 120
    },
    resistances: {
      fire: 100
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Bite',
        description: 'A vicious bite with sharp teeth.',
        type: 'melee',
        icon: 'ability_racial_cannibalize',
        damage: {
          diceCount: 2,
          diceType: 10,
          bonus: 5,
          damageType: 'piercing'
        },
        range: 10,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '2d10+5'
          }
        ]
      },
      {
        name: 'Claw',
        description: 'A slash with sharp claws.',
        type: 'melee',
        icon: 'ability_druid_lacerate',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 5,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '2d6+5'
          }
        ]
      },
      {
        name: 'Fire Breath',
        description: 'The dragon exhales a cone of fire.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 6,
        icon: 'spell_fire_fireball',
        damage: {
          diceCount: 6,
          diceType: 6,
          bonus: 0,
          damageType: 'fire'
        },
        range: 30,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '6d6'
          },
          {
            type: 'AREA',
            shape: 'cone',
            size: 30
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 16,
            success: 'half'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 50, max: 200 },
        silver: { min: 100, max: 400 },
        copper: { min: 200, max: 800 }
      },
      items: [
        { itemId: 'drake-scale', dropChance: 100, quantity: { min: 3, max: 6 } },
        { itemId: 'fire-essence', dropChance: 80, quantity: { min: 2, max: 5 } },
        { itemId: 'sun-gold', dropChance: 60, quantity: { min: 1, max: 3 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // CONSTRUCTS
  // ============================================

  // Stone Golem
  {
    id: 'stone-golem',
    name: 'Stone Golem',
    description: 'A massive construct of stone and magic, animated to serve as a guardian. Moves slowly but hits with devastating force.',
    type: CREATURE_TYPES.CONSTRUCT,
    size: CREATURE_SIZES.LARGE,
    tags: ['golem', 'construct', 'guardian', 'slow'],
    tokenIcon: 'inv_misc_head_dwarf_01',
    tokenBorder: '#708090',
    stats: {
      strength: 20,
      agility: 9,
      constitution: 20,
      intelligence: 3,
      spirit: 11,
      charisma: 1,
      maxHp: 178,
      currentHp: 178,
      maxMana: 0,
      currentMana: 0,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armorClass: 17,
      initiative: -1,
      speed: 30,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      physical: 50,
      poison: 'immune',
      psychic: 'immune'
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Slam',
        description: 'A powerful slam attack with stone fists.',
        type: 'melee',
        icon: 'ability_warrior_shieldbreak',
        damage: {
          diceCount: 2,
          diceType: 8,
          bonus: 6,
          damageType: 'bludgeoning'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '2d8+6'
          }
        ]
      },
      {
        name: 'Slow',
        description: 'The golem\'s presence slows nearby creatures.',
        type: 'special',
        icon: 'spell_nature_slow',
        range: 10,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'AREA',
            shape: 'circle',
            size: 10
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 15,
            onFail: {
              type: 'DEBUFF',
              target: 'enemies',
              stat: 'speed',
              value: -10,
              duration: 2
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 10, max: 30 },
        silver: { min: 20, max: 60 },
        copper: { min: 40, max: 120 }
      },
      items: [
        { itemId: 'rough-stone', dropChance: 100, quantity: { min: 5, max: 10 } },
        { itemId: 'cut-granite', dropChance: 70, quantity: { min: 2, max: 5 } },
        { itemId: 'focus-crystal', dropChance: 50, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // PLANTS
  // ============================================

  // Treant
  {
    id: 'treant',
    name: 'Treant',
    description: 'An ancient tree that has awakened to sentience. Moves slowly but is incredibly durable, protecting the forest with its massive limbs.',
    type: CREATURE_TYPES.PLANT,
    size: CREATURE_SIZES.HUGE,
    tags: ['treant', 'plant', 'forest', 'guardian'],
    tokenIcon: 'ability_druid_treeoflife',
    tokenBorder: '#228B22',
    stats: {
      strength: 23,
      agility: 8,
      constitution: 21,
      intelligence: 12,
      spirit: 16,
      charisma: 12,
      maxHp: 138,
      currentHp: 138,
      maxMana: 50,
      currentMana: 50,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armorClass: 16,
      initiative: -1,
      speed: 30,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 0
    },
    resistances: {
      physical: 50,
      bludgeoning: 25
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Slam',
        description: 'Slams with massive branch-like arms.',
        type: 'melee',
        icon: 'ability_warrior_shieldbreak',
        damage: {
          diceCount: 3,
          diceType: 6,
          bonus: 6,
          damageType: 'bludgeoning'
        },
        range: 10,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '3d6+6'
          }
        ]
      },
      {
        name: 'Rock Throw',
        description: 'Hurls a large rock at a distant target.',
        type: 'ranged',
        icon: 'spell_nature_earthquake',
        damage: {
          diceCount: 4,
          diceType: 6,
          bonus: 0,
          damageType: 'bludgeoning'
        },
        range: 60,
        actionPointCost: 3,
        cooldown: 2,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '4d6'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 5, max: 20 },
        silver: { min: 10, max: 40 },
        copper: { min: 20, max: 80 }
      },
      items: [
        { itemId: 'wooden-haft', dropChance: 100, quantity: { min: 3, max: 6 } },
        { itemId: 'fieldleaf', dropChance: 80, quantity: { min: 5, max: 10 } },
        { itemId: 'bitterroot', dropChance: 70, quantity: { min: 3, max: 7 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // FIENDS
  // ============================================

  // Imp
  {
    id: 'imp',
    name: 'Imp',
    description: 'A small, malicious fiend with leathery wings and a barbed tail. Prefers to attack from range with magic and poison.',
    type: CREATURE_TYPES.FIEND,
    size: CREATURE_SIZES.TINY,
    tags: ['imp', 'fiend', 'devil', 'flying'],
    tokenIcon: 'inv_misc_head_dragon_black',
    tokenBorder: '#8B0000',
    stats: {
      strength: 6,
      agility: 17,
      constitution: 13,
      intelligence: 11,
      spirit: 12,
      charisma: 14,
      maxHp: 20,
      currentHp: 20,
      maxMana: 30,
      currentMana: 30,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 13,
      initiative: 3,
      speed: 20,
      flying: 40,
      swimming: 0,
      sightRange: 60,
      darkvision: 120
    },
    resistances: {
      fire: 50,
      poison: 'immune'
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Sting',
        description: 'A poisonous sting from the imp\'s tail.',
        type: 'melee',
        icon: 'ability_creature_poison_01',
        damage: {
          diceCount: 1,
          diceType: 4,
          bonus: 1,
          damageType: 'piercing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '1d4+1'
          },
          {
            type: 'DAMAGE',
            damageType: 'poison',
            formula: '3d6'
          },
          {
            type: 'SAVE',
            attribute: 'constitution',
            dc: 11,
            success: 'half'
          }
        ]
      },
      {
        name: 'Invisibility',
        description: 'The imp magically turns invisible until it attacks or uses an ability.',
        type: 'spell',
        spellType: 'ILLUSION',
        level: 2,
        icon: 'ability_rogue_shadowstep',
        range: 0,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'CONDITION',
            condition: 'invisible',
            duration: 3
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 1, max: 5 },
        silver: { min: 5, max: 15 },
        copper: { min: 10, max: 30 }
      },
      items: [
        { itemId: 'shadow-residue', dropChance: 60, quantity: { min: 1, max: 2 } },
        { itemId: 'arcane-ash', dropChance: 50, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // ABERRATIONS
  // ============================================

  // Mind Flayer
  {
    id: 'mind-flayer',
    name: 'Mind Flayer',
    description: 'A terrifying aberration with a squid-like head and psionic powers. Feeds on the brains of intelligent creatures.',
    type: CREATURE_TYPES.ABERRATION,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['mind-flayer', 'aberration', 'psionic', 'intelligent'],
    tokenIcon: 'inv_misc_head_dragon_black',
    tokenBorder: '#9370DB',
    stats: {
      strength: 11,
      agility: 12,
      constitution: 12,
      intelligence: 19,
      spirit: 17,
      charisma: 17,
      maxHp: 71,
      currentHp: 71,
      maxMana: 100,
      currentMana: 100,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armorClass: 15,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 0,
      sightRange: 120,
      darkvision: 120
    },
    resistances: {
      psychic: 50
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Tentacles',
        description: 'Grasps with tentacles, dealing psychic damage.',
        type: 'melee',
        icon: 'ability_creature_poison_01',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 0,
          damageType: 'psychic'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'psychic',
            formula: '2d6'
          },
          {
            type: 'SAVE',
            attribute: 'intelligence',
            dc: 15,
            onFail: {
              type: 'CONDITION',
              condition: 'stunned',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Mind Blast',
        description: 'A cone of psionic energy that stuns creatures.',
        type: 'spell',
        spellType: 'ENCHANTMENT',
        level: 5,
        icon: 'spell_shadow_soulleech',
        range: 0,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'AREA',
            shape: 'cone',
            size: 30
          },
          {
            type: 'SAVE',
            attribute: 'intelligence',
            dc: 15,
            onFail: {
              type: 'CONDITION',
              condition: 'stunned',
              duration: 2
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 10, max: 30 },
        silver: { min: 20, max: 60 },
        copper: { min: 40, max: 120 }
      },
      items: [
        { itemId: 'soul-fragment', dropChance: 80, quantity: { min: 2, max: 4 } },
        { itemId: 'arcane-dust', dropChance: 70, quantity: { min: 3, max: 6 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  }
];

// Function to get a creature by ID
export const getCreatureById = (id) => {
  return LIBRARY_CREATURES.find(creature => creature.id === id);
};

// Function to search creatures by name or tags
export const searchCreatures = (query) => {
  const lowerQuery = query.toLowerCase();
  return LIBRARY_CREATURES.filter(creature =>
    creature.name.toLowerCase().includes(lowerQuery) ||
    creature.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Function to filter creatures by type
export const filterCreaturesByType = (type) => {
  return LIBRARY_CREATURES.filter(creature => creature.type === type);
};

// Function to filter creatures by size
export const filterCreaturesBySize = (size) => {
  return LIBRARY_CREATURES.filter(creature => creature.size === size);
};

