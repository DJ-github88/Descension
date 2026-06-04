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
        { itemId: 'wanderers-edge', dropChance: 25, quantity: { min: 1, max: 1 } },
        { itemId: 'weathered-hide', dropChance: 20, quantity: { min: 1, max: 1 } },
        { itemId: 'crimson-tears', dropChance: 30, quantity: { min: 1, max: 2 } }
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
        { itemId: 'grave-axe', dropChance: 35, quantity: { min: 1, max: 1 } },
        { itemId: 'rusted-sorrow', dropChance: 25, quantity: { min: 1, max: 1 } },
        { itemId: 'blood-remembrance', dropChance: 15, quantity: { min: 1, max: 1 } }
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
        { itemId: 'hunters-whisper', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'threadbare-sorrow', dropChance: 25, quantity: { min: 1, max: 1 } },
        { itemId: 'azure-sorrow', dropChance: 25, quantity: { min: 1, max: 2 } }
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
        { itemId: 'soulthirst', dropChance: 25, quantity: { min: 1, max: 1 } },
        { itemId: 'tattered-memories', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'crimson-tears', dropChance: 20, quantity: { min: 1, max: 1 } }
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
        { itemId: 'gnarled-sorrow', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'threadbare-sorrow', dropChance: 20, quantity: { min: 1, max: 1 } },
        { itemId: 'azure-sorrow', dropChance: 25, quantity: { min: 1, max: 3 } },
        { itemId: 'arcane-dust', dropChance: 35, quantity: { min: 1, max: 2 } }
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
        { itemId: 'light-hide', dropChance: 55, quantity: { min: 1, max: 2 } },
        { itemId: 'thick-hide', dropChance: 25, quantity: { min: 1, max: 1 } },
        { itemId: 'beast-sinew', dropChance: 35, quantity: { min: 1, max: 2 } }
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
        { itemId: 'light-hide', dropChance: 45, quantity: { min: 1, max: 2 } },
        { itemId: 'beast-sinew', dropChance: 30, quantity: { min: 1, max: 1 } }
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
        { itemId: 'ironweep', dropChance: 20, quantity: { min: 1, max: 1 } },
        { itemId: 'bone-plates', dropChance: 40, quantity: { min: 1, max: 2 } }
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
        { itemId: 'bone-plates', dropChance: 30, quantity: { min: 1, max: 1 } },
        { itemId: 'ground-bone', dropChance: 25, quantity: { min: 1, max: 2 } }
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
        { itemId: 'ember-ore', dropChance: 25, quantity: { min: 1, max: 2 } }
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
        { itemId: 'fire-essence', dropChance: 45, quantity: { min: 2, max: 5 } },
        { itemId: 'sun-gold', dropChance: 25, quantity: { min: 1, max: 3 } }
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
        { itemId: 'rough-stone', dropChance: 55, quantity: { min: 5, max: 10 } },
        { itemId: 'cut-granite', dropChance: 35, quantity: { min: 2, max: 5 } },
        { itemId: 'focus-crystal', dropChance: 20, quantity: { min: 1, max: 2 } }
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
        { itemId: 'wooden-haft', dropChance: 55, quantity: { min: 3, max: 6 } },
        { itemId: 'fieldleaf', dropChance: 45, quantity: { min: 5, max: 10 } },
        { itemId: 'bitterroot', dropChance: 35, quantity: { min: 3, max: 7 } }
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
        { itemId: 'shadow-residue', dropChance: 35, quantity: { min: 1, max: 2 } },
        { itemId: 'arcane-ash', dropChance: 25, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — FROSTWOOD REACH
  // ============================================

  // Vetch
  {
    id: 'vetch',
    name: 'Vetch',
    description: 'A bundle of ironwood twigs wrapped in damp grey cloth, no larger than a cat. It scurries at the fog\'s edge, always visible just ahead, suggesting a path that leads somewhere — but never where you intended.',
    type: CREATURE_TYPES.ABERRATION,
    size: CREATURE_SIZES.TINY,
    tags: ['aberration', 'frostwood', 'wyrd-creature', 'path', 'fog'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#696969',
    stats: {
      strength: 4, agility: 18, constitution: 8,
      intelligence: 6, spirit: 10, charisma: 6,
      maxHp: 20, currentHp: 20,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 4,
      speed: 60, flying: 0, swimming: 20,
      sightRange: 30, darkvision: 0
    },
    resistances: { psychic: 75 },
    vulnerabilities: { bludgeoning: 100 },
    abilities: [
      {
        id: 'vetch_fog_dash',
        name: 'Fog-Dash',
        description: 'Scurries at incredible speed, vanishing into the mist and reappearing behind enemies.',
        level: 1,
        spellType: 'ENCHANTMENT',
        icon: 'ability_rogue_sprint',
        effectTypes: ['buff', 'utility'],
        tags: ['fey', 'fog', 'movement'],
        flavorText: 'It does not run. The fog simply carries it where it wishes to go.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self',
          rangeDistance: 0,
          targetRestrictions: ['self'],
          requiresLineOfSight: false
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'fog_speed',
              name: 'Fog Swiftness',
              description: 'The Vetch becomes one with the mist, moving with supernatural speed.',
              mechanicsText: 'Gain +6 Agility and +30 speed for 1 round.',
              statModifier: { stat: 'agility', magnitude: 6, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        resourceCost: { actionPoints: 1 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'vetch_memory_burst',
        name: 'Memory-Burst',
        description: 'If crushed, releases a burst of stolen memories that overwhelm nearby minds with the pain of every path it ever suggested.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_soulleech',
        effectTypes: ['damage', 'control'],
        tags: ['psychic', 'aoe', 'death-trigger'],
        flavorText: 'Every path it showed. Every traveler it misled. All remembered at once.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 15 }
        },
        damageConfig: {
          formula: '2d6 + spirit',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 13,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'memory_overwhelm',
              name: 'Stunned',
              description: 'Overwhelmed by stolen memories.',
              mechanicsText: 'Stunned for 1 round on failed Spirit DC 13 save.'
            }
          ]
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'vetch_death_burst',
                category: 'health',
                name: 'On Death',
                parameters: {
                  perspective: 'self',
                  percentage: 0,
                  comparison: 'less_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'REACTIVE',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 99 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 1 },
        silver: { min: 3, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        { itemId: 'fieldleaf', dropChance: 25, quantity: { min: 1, max: 2 } },
        { itemId: 'wooden-haft', dropChance: 20, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Moot
  {
    id: 'moot',
    name: 'Moot',
    description: 'A towering figure wrapped in fog-thick legal parchment, its face a rotating carousel of wooden gavel-masks. The collective memory of every trial, verdict, and sentence ever spoken in the Reach — given form by the Wyrd.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.LARGE,
    tags: ['fey', 'frostwood', 'wyrd-creature', 'judge', 'lawbringer'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#C0C0C0',
    stats: {
      strength: 14, agility: 12, constitution: 16,
      intelligence: 16, spirit: 14, charisma: 18,
      maxHp: 110, currentHp: 110,
      maxMana: 40, currentMana: 40,
      maxActionPoints: 5, currentActionPoints: 5, initiative: 2,
      speed: 30, flying: 0, swimming: 15,
      sightRange: 60, darkvision: 60
    },
    resistances: { psychic: 50 },
    vulnerabilities: { radiant: 50 },
    abilities: [
      {
        id: 'moot_gavel_strike',
        name: 'Gavel Strike',
        description: 'Brings down its rusted iron gavel, forcing the target to confess guilt or suffer the penalty.',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_shieldbreak',
        effectTypes: ['damage', 'control', 'debuff'],
        tags: ['bludgeoning', 'law', 'melee'],
        flavorText: 'The gavel falls. Silence follows. Then the screaming.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 10,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d8 + 4',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'moderate',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 15,
          saveType: 'charisma',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'guilty_confession',
              name: 'Silenced',
              description: 'Overwhelmed by legal guilt, unable to speak or cast verbal spells.',
              mechanicsText: 'Silenced for 2 rounds on failed Charisma DC 15 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 }
      },
      {
        id: 'moot_recite_charges',
        name: 'Recite the Charges',
        description: 'Reads from its parchment-body, invoking ancient legal language that wounds the mind and stuns the guilty.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['psychic', 'cone', 'stun'],
        flavorText: '"Article Seven, Clause Twelve: The Accused SHALL remain silent."',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true,
          aoeShape: 'cone',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '3d6',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'intelligence',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'legal_stun',
              name: 'Stunned',
              description: 'Mind overwhelmed by centuries of legal precedent.',
              mechanicsText: 'Stunned for 1 round on failed Intelligence DC 14 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'moot_contempt_of_court',
        name: 'Contempt of Court',
        description: 'Summons spectral juror-figures that restrain the accused and strip their defenses.',
        level: 4,
        spellType: 'CONJURATION',
        icon: 'spell_shadow_grasp',
        effectTypes: ['summoning', 'control', 'debuff'],
        tags: ['summon', 'restrain', 'law'],
        flavorText: 'A jury of the condemned materializes to deliver their verdict.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        summoningConfig: {
          creatureType: 'spectral',
          creatures: [
            {
              id: 'spectral_juror',
              name: 'Spectral Juror',
              description: 'A ghostly figure wrapped in legal parchment, wielding chains of binding.',
              size: 'Medium',
              type: 'undead',
              tokenIcon: 'spell_shadow_grasp',
              stats: { maxHp: 15, maxMana: 0 },
              config: {
                quantity: 3,
                duration: 3,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 30,
                abilities: 'Grapples target, dealing 1d4 psychic per round. Can be destroyed.'
              }
            }
          ],
          duration: 3,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 30,
          controlType: 'autonomous',
          maxSummons: 6
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'moderate',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'juror_restraint',
              name: 'Restrained',
              description: 'Bound by spectral chains of legal obligation.',
              mechanicsText: 'Restrained for 2 rounds on failed Strength DC 14 save.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'defense_stripped',
              name: 'Defense Stripped',
              description: 'Jurors strip armor and awareness from the accused.',
              mechanicsText: '-4 Agility for 2 rounds.',
              statusEffect: { penaltyType: 'disadvantage', affectedSkills: ['agility'] }
            }
          ],
          statPenalties: [
            { stat: 'agility', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 5, max: 20 },
        silver: { min: 15, max: 50 },
        copper: { min: 30, max: 100 }
      },
      items: [
        { itemId: 'iron-ingot', dropChance: 35, quantity: { min: 1, max: 2 } },
        { itemId: 'wooden-haft', dropChance: 30, quantity: { min: 2, max: 4 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Gallows-Wood
  {
    id: 'gallows-wood',
    name: 'Gallows-Wood',
    description: 'A cluster of ironwood trees whose branches fused into a ribcage-shaped canopy. Nooses of living vine hang from every branch, swaying without wind. Faces press against the bark from inside, mouths open and silent. The Briaran\'s deepest wound, given form.',
    type: CREATURE_TYPES.PLANT,
    size: CREATURE_SIZES.HUGE,
    tags: ['plant', 'frostwood', 'wyrd-creature', 'guardian', 'boss', 'briaran'],
    tokenIcon: 'ability_druid_treeoflife',
    tokenBorder: '#4A3728',
    stats: {
      strength: 20, agility: 6, constitution: 20,
      intelligence: 10, spirit: 16, charisma: 12,
      maxHp: 220, currentHp: 220,
      maxMana: 30, currentMana: 30,
      maxActionPoints: 5, currentActionPoints: 5, initiative: -1,
      speed: 0, flying: 0, swimming: 0,
      sightRange: 60, darkvision: 0
    },
    resistances: { physical: 50, poison: 'immune', psychic: 75 },
    vulnerabilities: { fire: 100, radiant: 50 },
    abilities: [
      {
        id: 'gallows_drop',
        name: 'Gallows Drop',
        description: 'A noose-vine snakes down and hoists the target into the canopy, strangling the life from them.',
        level: 4,
        spellType: 'EVOCATION',
        icon: 'spell_nature_stranglevines',
        effectTypes: ['damage', 'control'],
        tags: ['bludgeoning', 'restraint', 'ranged'],
        flavorText: 'The noose finds you before you find the noose.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d10 + 5',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'strong',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'agility',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'noose_hoist',
              name: 'Restrained & Choking',
              description: 'Hoisted into the canopy by a living noose-vine.',
              mechanicsText: 'Restrained for 2 rounds on failed Agility DC 16 save. Takes 1d4 bludgeoning at start of each turn.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      },
      {
        id: 'gallows_root_surge',
        name: 'Root Surge',
        description: 'Massive roots erupt from the ground, battering everything nearby and knocking creatures prone.',
        level: 5,
        spellType: 'CONJURATION',
        icon: 'spell_nature_earthquake',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['bludgeoning', 'area', 'knockdown'],
        flavorText: 'The ground remembers every hanging. The roots remember the weight.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '4d8',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'forcedMovement',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 15,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'root_prone',
              name: 'Prone',
              description: 'Knocked flat by erupting roots.',
              mechanicsText: 'Prone for 1 round on failed Strength DC 15 save.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'root_slow',
              name: 'Entangled',
              description: 'Roots wrap around legs, slowing movement.',
              mechanicsText: '-10 speed for 1 round.',
              statusEffect: { penaltyType: 'restrained', affectedSkills: ['agility'] }
            }
          ],
          statPenalties: [
            { stat: 'agility', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true,
          saveDC: 15,
          saveType: 'agility',
          saveOutcome: 'half_damage'
        },
        resourceCost: { actionPoints: 5 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'gallows_bark_sentence',
        name: 'Bark Sentence',
        description: 'The faces in the bark scream the condemned\'s last words, filling all nearby minds with dread.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_soulleech',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['psychic', 'fear', 'area'],
        flavorText: '"I didn\'t do it." / "Please." / "I forgive you." — the bark remembers them all.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'fear', description: 'Heads: Faces whisper the target\'s own last words. Frightened for 2 rounds.' },
            tails: { effect: 'damage', description: 'Tails: Faces scream in unison. Deal 3d8 additional psychic damage.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 1 },
            outcomeTiers: [
              { condition: 'heads', name: 'Whispered Words', damage: '0', fear: true, fearDuration: 2 },
              { condition: 'tails', name: 'Screaming Faces', damage: '3d8 psychic', fear: false }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 40 }
        },
        damageConfig: {
          formula: '3d8',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'COINS',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'moderate',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'bark_fear',
              name: 'Frightened',
              description: 'Paralyzed by the screams of the condemned.',
              mechanicsText: 'Frightened for 2 rounds on failed Spirit DC 16 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4 }
      },
      {
        id: 'gallows_briaran_hardening',
        name: 'Briaran Hardening',
        description: 'The ironwood bark hardens into iron density, absorbing punishment and growing thorns that damage attackers.',
        level: 2,
        spellType: 'ENCHANTMENT',
        icon: 'ability_druid_barkskin',
        effectTypes: ['buff', 'damage'],
        tags: ['armor', 'thorns', 'self'],
        flavorText: 'The bark remembers being ironwood before it was gallows.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self',
          rangeDistance: 0,
          targetRestrictions: ['self'],
          requiresLineOfSight: false
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'ironwood_bark',
              name: 'Ironwood Bark',
              description: 'Bark hardens to iron density.',
              mechanicsText: '+4 Armor for 3 rounds. Melee attackers take 1d6 piercing.',
              statModifier: { stat: 'armor', magnitude: 4, magnitudeType: 'flat' }
            }
          ],
          durationValue: 3,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: true
        },
        damageConfig: {
          formula: '1d6',
          damageTypes: ['piercing'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'AUTOMATIC'
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'thorns_reflect',
                category: 'damage',
                name: 'When Hit By Melee',
                parameters: {
                  damage_type: 'melee',
                  min_damage: 1,
                  target_entity: 'self',
                  range: 5,
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'REACTIVE',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 15, max: 60 },
        silver: { min: 50, max: 150 },
        copper: { min: 100, max: 300 }
      },
      items: [
        { itemId: 'wooden-haft', dropChance: 55, quantity: { min: 5, max: 10 } },
        { itemId: 'bitterroot', dropChance: 40, quantity: { min: 3, max: 6 } },
        { itemId: 'fieldleaf', dropChance: 45, quantity: { min: 4, max: 8 } },
        { itemId: 'rough-stone', dropChance: 20, quantity: { min: 2, max: 5 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — NORDHALLA
  // ============================================

  // Kjarn
  {
    id: 'kjarn',
    name: 'Kjarn',
    description: 'A cat-sized construct of frozen air and crystallized breath that skitters on ice-needle legs. It appears as a moving patch of intense cold. Where it walks, frost-flowers bloom on surfaces.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.TINY,
    tags: ['elemental', 'nordhalla', 'wyrd-creature', 'cold', 'frost'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#87CEEB',
    stats: {
      strength: 2, agility: 16, constitution: 14,
      intelligence: 2, spirit: 8, charisma: 2,
      maxHp: 15, currentHp: 15,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 4,
      speed: 30, flying: 0, swimming: 0,
      sightRange: 20, darkvision: 0
    },
    resistances: { cold: 100, physical: 75 },
    vulnerabilities: { fire: 100 },
    abilities: [
      {
        id: 'kjarn_cold_drain',
        name: 'Cold Drain',
        description: 'Attaches to a warm creature and siphons body heat, leaving frost-flowers on their skin.',
        level: 1,
        spellType: 'EVOCATION',
        icon: 'spell_frost_frostarmor',
        effectTypes: ['damage', 'debuff', 'healing'],
        tags: ['cold', 'drain', 'melee'],
        flavorText: 'It does not bite. It simply makes you colder than you have ever been.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'touch',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '1d4',
          damageTypes: ['cold'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'DICE',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'frost_bite_weakness',
              name: 'Frost-Bitten',
              description: 'Body temperature drops, weakening constitution.',
              mechanicsText: '-1 Constitution for 2 rounds.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['constitution'] }
            }
          ],
          statPenalties: [
            { stat: 'constitution', magnitude: -1, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        healingConfig: {
          formula: '1d4',
          healingType: 'direct',
          resolution: 'AUTOMATIC'
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'kjarn_frost_trail',
        name: 'Frost-Trail',
        description: 'Leaves a trail of razor-frost-flowers that slow and cut anything that follows.',
        level: 1,
        spellType: 'CONJURATION',
        icon: 'spell_nature_slow',
        effectTypes: ['control', 'damage'],
        tags: ['cold', 'area', 'slow'],
        flavorText: 'Where it walks, winter blooms.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'line',
          aoeParameters: { length: 20, width: 5 }
        },
        damageConfig: {
          formula: '1d4',
          damageTypes: ['cold', 'piercing'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'mild',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 12,
          saveType: 'agility',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'frost_flower_slow',
              name: 'Slowed',
              description: 'Razor-frost flowers cut at ankles and slow movement.',
              mechanicsText: 'Speed halved for 2 rounds on failed Agility DC 12 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 1 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 2 },
        silver: { min: 2, max: 8 },
        copper: { min: 5, max: 15 }
      },
      items: [
        { itemId: 'rough-stone', dropChance: 30, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Huld
  {
    id: 'huld',
    name: 'Huld',
    description: 'A tall figure wrapped in brass bands inscribed with glowing runes. Where skin should be, frost-white bone covered in micro-runes so dense they blur into silver. A Rune-Keeper who traded too many memories and became the Archive itself.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['fey', 'nordhalla', 'wyrd-creature', 'rune-keeper', 'guardian'],
    tokenIcon: 'inv_misc_head_dwarf_01',
    tokenBorder: '#B8860B',
    stats: {
      strength: 16, agility: 10, constitution: 18,
      intelligence: 14, spirit: 16, charisma: 6,
      maxHp: 130, currentHp: 130,
      maxMana: 20, currentMana: 20,
      maxActionPoints: 5, currentActionPoints: 5, initiative: 0,
      speed: 20, flying: 0, swimming: 0,
      sightRange: 60, darkvision: 120
    },
    resistances: { cold: 100, psychic: 50 },
    vulnerabilities: { fire: 75 },
    abilities: [
      {
        id: 'huld_archive_pulse',
        name: 'Archive Pulse',
        description: 'Emits a burst of Archive memory that burns neural pathways. Fail and be stunned — succeed and the Huld absorbs your knowledge.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_arcane_arcane01',
        effectTypes: ['damage', 'control', 'buff'],
        tags: ['psychic', 'cone', 'stun'],
        flavorText: 'You see every trial ever held. Your mind was not built for this.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true,
          aoeShape: 'cone',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '3d6 + intelligence',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 15,
          saveType: 'intelligence',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'archive_overload',
              name: 'Stunned',
              description: 'Neural pathways burned by Archive memory.',
              mechanicsText: 'Stunned for 1 round on failed Intelligence DC 15 save.'
            }
          ]
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'knowledge_absorbed',
              name: 'Knowledge Absorbed',
              description: 'The Huld absorbs a fragment of the target\'s knowledge.',
              mechanicsText: 'On successful enemy save, Huld gains +2 Intelligence for 1 round.',
              statModifier: { stat: 'intelligence', magnitude: 2, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'huld_rune_lock',
        name: 'Rune-Lock',
        description: 'Brass bands unwrap from its body and clamp around the target, freezing them in place with micro-runes.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_grasp',
        effectTypes: ['control', 'debuff'],
        tags: ['paralysis', 'rune', 'ranged'],
        flavorText: 'The runes remember every binding they ever enforced.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'agility',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'rune_paralysis',
              name: 'Paralyzed',
              description: 'Brass bands and micro-runes lock every joint.',
              mechanicsText: 'Paralyzed for 1 round on failed Agility DC 16 save.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'rune_suppression',
              name: 'Rune Suppression',
              description: 'Runes dampen magical ability.',
              mechanicsText: '-4 Spirit for 1 round.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['spirit'] }
            }
          ],
          statPenalties: [
            { stat: 'spirit', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'huld_bone_shatter',
        name: 'Bone-Shatter Slam',
        description: 'A devastating blow with rune-carved bone limbs that can shatter armor.',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_shieldbreak',
        effectTypes: ['damage', 'debuff'],
        tags: ['bludgeoning', 'armor-break', 'melee'],
        flavorText: 'The bone remembers being whole. It takes that memory out on your ribs.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 10,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d10 + 5',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'armor_cracked',
              name: 'Armor Cracked',
              description: 'Runes shatter on impact, weakening the target\'s defenses.',
              mechanicsText: 'On critical hit: -4 Armor for 2 rounds.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['armor'] }
            }
          ],
          statPenalties: [
            { stat: 'armor', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 8, max: 30 },
        silver: { min: 20, max: 60 },
        copper: { min: 40, max: 120 }
      },
      items: [
        { itemId: 'iron-ingot', dropChance: 40, quantity: { min: 1, max: 3 } },
        { itemId: 'rough-stone', dropChance: 30, quantity: { min: 2, max: 5 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Skrei
  {
    id: 'skrei',
    name: 'Skrei',
    description: 'Blue-fleshed humanoid figures crawling from the black fjords, their skin crystallized with barnacles and frost. They haul themselves from the water with mechanical precision, performing the burial ritual in reverse.',
    type: CREATURE_TYPES.UNDEAD,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['undead', 'nordhalla', 'wyrd-creature', 'drowned', 'fjord'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#4682B4',
    stats: {
      strength: 18, agility: 8, constitution: 20,
      intelligence: 6, spirit: 4, charisma: 2,
      maxHp: 200, currentHp: 200,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 5, currentActionPoints: 5, initiative: -2,
      speed: 20, flying: 0, swimming: 40,
      sightRange: 30, darkvision: 60
    },
    resistances: { cold: 100, piercing: 100, slashing: 100 },
    vulnerabilities: { bludgeoning: 75, fire: 50 },
    abilities: [
      {
        id: 'skrei_hauling_grip',
        name: 'Hauling Grip',
        description: 'Bone-crushing hands seize the target and drag them toward the nearest water. Barnacles tear flesh on contact.',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_cleave',
        effectTypes: ['damage', 'control'],
        tags: ['cold', 'grapple', 'melee'],
        flavorText: 'It drags with the patience of a tide.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d8 + 5',
          damageTypes: ['cold', 'piercing'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'forcedMovement',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 15,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'drag_to_water',
              name: 'Grappled & Dragged',
              description: 'Bone-crushing grip drags target 15 ft toward nearest water source.',
              mechanicsText: 'Grappled and dragged 15 ft on failed Strength DC 15 save.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'barnacle_wounds',
              name: 'Barnacle Lacerations',
              description: 'Barnacle-encrusted hands leave bleeding gashes.',
              mechanicsText: '-2 Armor for 2 rounds from barnacle damage.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['armor'] }
            }
          ],
          statPenalties: [
            { stat: 'armor', magnitude: -2, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'skrei_cold_aura',
        name: 'Fjord-Freeze Aura',
        description: 'The air around the Skrei drops to killing temperature. Frost crystallizes on every surface.',
        level: 1,
        spellType: 'EVOCATION',
        icon: 'spell_frost_frostarmor',
        effectTypes: ['damage', 'debuff'],
        tags: ['cold', 'aura', 'passive'],
        flavorText: 'Water freezes. Breath freezes. Blood freezes.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 10 }
        },
        damageConfig: {
          formula: '1d6',
          damageTypes: ['cold'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'deep_cold_slow',
              name: 'Deep Cold',
              description: 'Extreme cold slows all movement.',
              mechanicsText: '-10 speed while within aura.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['speed'] }
            }
          ],
          statPenalties: [
            { stat: 'speed', magnitude: -10, magnitudeType: 'flat' }
          ],
          durationValue: 0,
          durationType: 'instant',
          durationUnit: 'instant',
          canBeDispelled: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'fjord_freeze_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'skrei_death_rattle',
        name: 'Death Rattle',
        description: 'When killed, releases a scream in the voice of the person it once was. Those who hear it are frozen with grief.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_raisedead',
        effectTypes: ['damage', 'control', 'aoe', 'summoning'],
        tags: ['psychic', 'death-trigger', 'fear', 'summon'],
        flavorText: '"I remember being warm." — the last word of every Skrei.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'fear', description: 'Heads: The voice is someone the listener loved. Frightened for 2 rounds.' },
            tails: { effect: 'drown', description: 'Tails: The voice drags listeners toward death. Restrained for 1 round.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 1 },
            outcomeTiers: [
              { condition: 'heads', name: 'Loved Voice', fear: true, fearDuration: 2 },
              { condition: 'tails', name: 'Drowning Call', restrain: true, restrainDuration: 1 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '2d6',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'COINS',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: true
        },
        summoningConfig: {
          creatureType: 'undead',
          creatures: [
            {
              id: 'drowned_echo',
              name: 'Drowned Echo',
              description: 'A spectral remnant of the person the Skrei once was.',
              size: 'Medium',
              type: 'undead',
              tokenIcon: 'spell_shadow_raisedead',
              stats: { maxHp: 20, maxMana: 0 },
              config: {
                quantity: 2,
                duration: 3,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 20,
                abilities: 'Deals 1d6 cold damage on touch. Fades after 3 rounds.'
              }
            }
          ],
          duration: 3,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 20,
          controlType: 'autonomous',
          maxSummons: 4
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'skrei_death_scream',
                category: 'health',
                name: 'On Death',
                parameters: {
                  perspective: 'self',
                  percentage: 0,
                  comparison: 'less_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'REACTIVE',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 99 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 10, max: 40 },
        silver: { min: 30, max: 100 },
        copper: { min: 60, max: 200 }
      },
      items: [
        { itemId: 'bone-plates', dropChance: 40, quantity: { min: 2, max: 4 } },
        { itemId: 'ground-bone', dropChance: 35, quantity: { min: 2, max: 5 } },
        { itemId: 'bog-iron', dropChance: 20, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — SUNDALE
  // ============================================

  // Ashwen
  {
    id: 'ashwen',
    name: 'Ashwen',
    description: 'A finger-thin rivulet of dark, glassy basalt that flows uphill, glowing faintly orange at its core. A fragment of the Shyr that forgot it was supposed to be stone, seeking to rejoin a parent flow that no longer exists.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.TINY,
    tags: ['elemental', 'sundale', 'wyrd-creature', 'lava', 'basalt'],
    tokenIcon: 'spell_fire_fire',
    tokenBorder: '#FF8C00',
    stats: {
      strength: 0, agility: 6, constitution: 18,
      intelligence: 2, spirit: 4, charisma: 2,
      maxHp: 30, currentHp: 30,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 1, currentActionPoints: 1, initiative: -4,
      speed: 10, flying: 0, swimming: 0,
      sightRange: 0, darkvision: 0
    },
    resistances: { fire: 100, physical: 100 },
    vulnerabilities: { cold: 100, frost: 100 },
    abilities: [
      {
        id: 'ashwen_molten_contact',
        name: 'Molten Contact',
        description: 'Any creature that touches the Ashwen takes fire damage from its superheated basalt surface. The heat lingers.',
        level: 1,
        spellType: 'EVOCATION',
        icon: 'spell_fire_fire',
        effectTypes: ['damage'],
        tags: ['fire', 'aura', 'passive'],
        flavorText: 'A fragment of the Shyr that forgot it was supposed to be stone.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 5 }
        },
        damageConfig: {
          formula: '1d8',
          damageTypes: ['fire'],
          damageType: 'direct',
          elementType: 'fire',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false,
          dotConfig: {
            enabled: true,
            damagePerTick: '1d4',
            damageTypes: ['fire'],
            tickFrequency: 'round',
            duration: 2,
            canStack: true,
            maxStacks: 3
          }
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'ashwen_heat_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
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
        { itemId: 'ember-ore', dropChance: 50, quantity: { min: 1, max: 2 } },
        { itemId: 'rough-stone', dropChance: 35, quantity: { min: 2, max: 4 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Nekh
  {
    id: 'nekh',
    name: 'Nekh',
    description: 'A four-foot-tall humanoid of sun-baked clay, painted with faded Solvarn funerary symbols and gold-leaf eyes. A funerary servant that was never told to stop — it sweeps paths that no longer exist and guards tombs that have been looted a hundred times.',
    type: CREATURE_TYPES.CONSTRUCT,
    size: CREATURE_SIZES.SMALL,
    tags: ['construct', 'sundale', 'wyrd-creature', 'clay', 'servant', 'solvarn'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#DEB887',
    stats: {
      strength: 16, agility: 8, constitution: 16,
      intelligence: 4, spirit: 2, charisma: 4,
      maxHp: 75, currentHp: 75,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 0,
      speed: 20, flying: 0, swimming: 0,
      sightRange: 30, darkvision: 0
    },
    resistances: { poison: 'immune', psychic: 'immune', necrotic: 'immune' },
    vulnerabilities: { bludgeoning: 50 },
    abilities: [
      {
        id: 'nekh_sweeping_strike',
        name: 'Sweeping Strike',
        description: 'A wide clay-arm swing that sends enemies sprawling and cracks their armor.',
        level: 2,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_cleave',
        effectTypes: ['damage', 'control'],
        tags: ['bludgeoning', 'knockdown', 'melee'],
        flavorText: 'It sweeps because it was told to. It has never been told to stop.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true,
          aoeShape: 'cone',
          aoeParameters: { radius: 10 }
        },
        damageConfig: {
          formula: '1d8 + 3',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'mild',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 12,
          saveType: 'agility',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'clay_sweep',
              name: 'Prone',
              description: 'Swept off feet by the clay arm.',
              mechanicsText: 'Prone for 1 round on failed Agility DC 12 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'nekh_guardian_protocol',
        name: 'Guardian Protocol',
        description: 'Enters a protective rage when it witnesses a container being opened or a sacred boundary crossed.',
        level: 2,
        spellType: 'ENCHANTMENT',
        icon: 'ability_warrior_battleshout',
        effectTypes: ['buff', 'debuff'],
        tags: ['rage', 'self', 'trigger'],
        flavorText: 'The tomb has been violated. The guardian remembers its oath.',
        resolution: 'AUTOMATIC',
        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self',
          rangeDistance: 0,
          targetRestrictions: ['self'],
          requiresLineOfSight: false
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'tomb_guardian_rage',
              name: 'Guardian\'s Wrath',
              description: 'Ancient funerary programming activates.',
              mechanicsText: '+4 Strength and +2 Strength for 3 rounds. Armor drops as plates dislocate.',
              statModifier: { stat: 'strength', magnitude: 6, magnitudeType: 'flat' }
            }
          ],
          durationValue: 3,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: true
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'plates_dislocated',
              name: 'Plates Dislocated',
              description: 'Clay plates shift and dislocate from rage.',
              mechanicsText: '-4 Armor for 3 rounds.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['armor'] }
            }
          ],
          statPenalties: [
            { stat: 'armor', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 3,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'container_violated',
                category: 'health',
                name: 'When Sacred Container Opened',
                parameters: {
                  perspective: 'ally',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: true
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5 }
      },
      {
        id: 'nekh_ash_cloud',
        name: 'Ash Cloud',
        description: 'Compressed ash bursts from its joints in a choking cloud, blinding and suffocating.',
        level: 2,
        spellType: 'EVOCATION',
        icon: 'spell_nature_nullifydisease',
        effectTypes: ['control', 'damage'],
        tags: ['blind', 'area', 'ash'],
        flavorText: 'The dead do not need to breathe. You do.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 15 }
        },
        damageConfig: {
          formula: '1d4',
          damageTypes: ['necrotic'],
          damageType: 'direct',
          elementType: 'necrotic',
          resolution: 'DICE',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'mild',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 12,
          saveType: 'constitution',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'ash_blindness',
              name: 'Blinded',
              description: 'Choking ash fills eyes and lungs.',
              mechanicsText: 'Blinded for 1 round on failed Constitution DC 12 save.'
            }
          ]
        },
        summoningConfig: {
          creatureType: 'construct',
          creatures: [
            {
              id: 'scarab_swarm',
              name: 'Scarab Swarm',
              description: 'Tiny clay scarabs that scatter from the Nekh\'s joints.',
              size: 'Tiny',
              type: 'construct',
              tokenIcon: 'ability_creature_poison_01',
              stats: { maxHp: 5, maxMana: 0 },
              config: {
                quantity: 8,
                duration: 2,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 15,
                abilities: 'Swarm to target, dealing 1d4 piercing per round. Easily crushed.'
              }
            }
          ],
          duration: 2,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 15,
          controlType: 'autonomous',
          maxSummons: 16
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
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
        { itemId: 'clay-shard', dropChance: 55, quantity: { min: 3, max: 6 } },
        { itemId: 'rough-stone', dropChance: 30, quantity: { min: 2, max: 4 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Emberveil
  {
    id: 'emberveil',
    name: 'Emberveil',
    description: 'A gossamer sheet of living ember-light that shifts between forms — woman, lion, serpent, fire-pillar — depending on what the viewer expects. It radiates genuine warmth, weeps molten glass tears, and may be a fragment of Sol\'s consciousness or Keth-Amar\'s lure.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.LARGE,
    tags: ['elemental', 'sundale', 'wyrd-creature', 'ember', 'sol', 'boss'],
    tokenIcon: 'spell_fire_soulburn',
    tokenBorder: '#FFD700',
    stats: {
      strength: 14, agility: 16, constitution: 16,
      intelligence: 18, spirit: 20, charisma: 20,
      maxHp: 250, currentHp: 250,
      maxMana: 60, currentMana: 60,
      maxActionPoints: 6, currentActionPoints: 6, initiative: 4,
      speed: 30, flying: 20, swimming: 0,
      sightRange: 60, darkvision: 120
    },
    resistances: { fire: 100, cold: 100, radiant: 100, physical: 25 },
    vulnerabilities: { void: 75, shadow: 75 },
    abilities: [
      {
        id: 'emberveil_molten_weep',
        name: 'Molten Weep',
        description: 'Weeps tears of molten glass that burn through armor and sear flesh. The glass hardens into shrapnel.',
        level: 4,
        spellType: 'EVOCATION',
        icon: 'spell_fire_firebolt',
        effectTypes: ['damage', 'debuff'],
        tags: ['fire', 'ranged', 'burn'],
        flavorText: 'Its tears are beautiful. Its tears are everything you loved, burning.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 30,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '3d10',
          damageTypes: ['fire', 'piercing'],
          damageType: 'direct',
          elementType: 'fire',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'moderate',
          duration: 3,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'constitution',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'molten_glass_burn',
              name: 'Burning',
              description: 'Molten glass adheres to skin and armor.',
              mechanicsText: 'Burning for 3 rounds on failed Constitution DC 16 save. 1d4 fire per round.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'glass_armor_melt',
              name: 'Glass-Encrusted',
              description: 'Hardened glass shrapnel restricts movement.',
              mechanicsText: '-2 Agility for 2 rounds.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['agility'] }
            }
          ],
          statPenalties: [
            { stat: 'agility', magnitude: -2, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'emberveil_solbrand_echo',
        name: 'Solbrand Echo',
        description: 'Releases the brilliance of a dying sun in all directions. The light reveals truths and burns lies.',
        level: 6,
        spellType: 'EVOCATION',
        icon: 'spell_fire_fireball',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['radiant', 'area', 'blind'],
        flavorText: 'Sol\'s last gift. It does not ask permission to shine.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 60 }
        },
        damageConfig: {
          formula: '4d8 + spirit',
          damageTypes: ['radiant'],
          damageType: 'direct',
          elementType: 'radiant',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 18,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'solar_blindness',
              name: 'Blinded',
              description: 'The brilliance of a dying sun sears retinas.',
              mechanicsText: 'Blinded for 1 round on failed Spirit DC 18 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'emberveil_form_shift',
        name: 'Form Shift',
        description: 'Shifts between four forms based on what the viewer expects. Each form grants different combat bonuses.',
        level: 5,
        spellType: 'ENCHANTMENT',
        icon: 'ability_druid_wildshape',
        effectTypes: ['buff', 'transformation'],
        tags: ['shapechange', 'self', 'adaptive'],
        flavorText: 'It becomes what you fear. What you desire. What you deserve.',
        resolution: 'CARDS',
        specialMechanics: {
          gamblingGame: {
            gameType: 'card_draw',
            resolution: 'CARDS',
            rules: { flipCount: 0, diceCount: 0, dieType: 0, diceType: 'd20', durationHours: 1 },
            outcomeTiers: [
              { condition: 'ALL_RED', name: 'Serpent Form', description: 'Reach extends to 15 ft, +4 Agility. All melee attacks gain +1d6 poison.' },
              { condition: 'ALL_BLACK', name: 'Fire-Pillar Form', description: 'All AoE abilities gain +2d6 fire damage. Immune to physical damage for 1 round.' },
              { condition: 'PAIR', name: 'Lion Form', description: '+6 Strength, all melee damage increased by 50%. Gain 20 temp HP.' },
              { condition: 'ANY', name: 'Humanoid Form', description: '+4 Charisma, all ranged attacks gain +1d8 radiant. Can cast one additional spell this round.' }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self',
          rangeDistance: 0,
          targetRestrictions: ['self'],
          requiresLineOfSight: false
        },
        transformationConfig: {
          transformationType: 'physical',
          targetType: 'self',
          duration: 1,
          durationUnit: 'rounds',
          power: 'major',
          newForm: 'Emberveil Shift',
          description: 'The Emberveil shifts between humanoid, serpent, lion, and fire-pillar forms.',
          concentration: false,
          grantedAbilities: [
            { id: 'form_bonus', name: 'Form Bonus', description: 'Grants different stat bonuses and damage types based on card draw.' }
          ]
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'emberveil_adaptation',
              name: 'Adaptive Form',
              description: 'Form depends on the card drawn.',
              mechanicsText: 'Draw a card: ALL_RED = Serpent, ALL_BLACK = Fire-Pillar, PAIR = Lion, ANY = Humanoid.',
              statModifier: { stat: 'charisma', magnitude: 4, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: true
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 1, max: 4 },
        gold: { min: 20, max: 80 },
        silver: { min: 50, max: 200 },
        copper: { min: 100, max: 400 }
      },
      items: [
        { itemId: 'ember-ore', dropChance: 55, quantity: { min: 4, max: 8 } },
        { itemId: 'sun-gold', dropChance: 35, quantity: { min: 2, max: 5 } },
        { itemId: 'fire-essence', dropChance: 100, quantity: { min: 3, max: 6 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — ICEHEART SEA
  // ============================================

  // Orun
  {
    id: 'orun',
    name: 'Orun',
    description: 'A fist-sized crystal of celestial salt that glows with the last color of a dying star. It drifts on the currents, crystallizing sand into tiny star-shapes. The Myrathil call it the last word of a god who could not finish speaking.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.TINY,
    tags: ['elemental', 'iceheart', 'wyrd-creature', 'crystal', 'star', 'celestial'],
    tokenIcon: 'inv_misc_head_dragon_01',
    tokenBorder: '#9370DB',
    stats: {
      strength: 0, agility: 0, constitution: 20,
      intelligence: 18, spirit: 20, charisma: 14,
      maxHp: 5, currentHp: 5,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 0, currentActionPoints: 0, initiative: 0,
      speed: 0, flying: 0, swimming: 10,
      sightRange: 0, darkvision: 0
    },
    resistances: { cold: 100, fire: 100, physical: 100, radiant: 50 },
    vulnerabilities: { bludgeoning: 100, force: 100 },
    abilities: [
      {
        id: 'orun_stellar_vision',
        name: 'Stellar Vision',
        description: 'Touching the Orun forces a vision of the pre-Dimming sky — beautiful and devastating.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'ability_priest_leapoffaith',
        effectTypes: ['damage', 'control', 'buff'],
        tags: ['psychic', 'vision', 'touch'],
        flavorText: 'You see the sky as it was. You understand why the gods wept.',
        resolution: 'CARDS',
        specialMechanics: {
          gamblingGame: {
            gameType: 'card_draw',
            resolution: 'CARDS',
            rules: { flipCount: 0, diceCount: 0, dieType: 0, diceType: 'd20', durationHours: 1 },
            outcomeTiers: [
              { condition: 'ROYAL_FLUSH', name: 'God\'s Last Word', description: 'Vision of the complete pre-Dimming sky. Stunned for 2 rounds, 4d6 psychic.', damage: '4d6 psychic', stunDuration: 2 },
              { condition: 'STRAIGHT_FLUSH', name: 'Star Memory', description: 'Beautiful star-chart vision. Stunned for 1 round, 3d6 psychic.', damage: '3d6 psychic', stunDuration: 1 },
              { condition: 'PAIR', name: 'Flicker', description: 'Brief glimpse. 1d6 psychic damage only.', damage: '1d6 psychic', stunDuration: 0 },
              { condition: 'ANY', name: 'Dim Echo', description: 'The crystal hums but reveals nothing. No effect on the viewer; +2 Intelligence to the Orun for 1 round.', damage: '0', stunDuration: 0 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'touch',
          rangeDistance: 5,
          targetRestrictions: ['any', 'creature'],
          requiresLineOfSight: false
        },
        damageConfig: {
          formula: '2d6',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'CARDS',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: true
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'vision_shared',
              name: 'Shared Knowledge',
              description: 'On a successful save, the Orun absorbs a fragment of the viewer\'s mind.',
              mechanicsText: '+2 Intelligence for 1 round.',
              statModifier: { stat: 'intelligence', magnitude: 2, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'orun_touch_passive',
                category: 'health',
                name: 'On Touch',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 5, max: 20 },
        silver: { min: 10, max: 40 },
        copper: { min: 20, max: 60 }
      },
      items: [
        { itemId: 'focus-crystal', dropChance: 55, quantity: { min: 1, max: 2 } },
        { itemId: 'sun-gold', dropChance: 35, quantity: { min: 1, max: 3 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Thalass
  {
    id: 'thalass',
    name: 'Thalass',
    description: 'A figure of sea-foam and barnacle-crusted bone that rises from churning waves. Its face is a smooth oval of fossilized coral scored with lines where a mouth tried to form. It produces only the sound of waves breaking and is drawn to any music.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['fey', 'iceheart', 'wyrd-creature', 'sea-spirit', 'song', 'storm'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#20B2AA',
    stats: {
      strength: 14, agility: 16, constitution: 14,
      intelligence: 12, spirit: 18, charisma: 16,
      maxHp: 100, currentHp: 100,
      maxMana: 20, currentMana: 20,
      maxActionPoints: 5, currentActionPoints: 5, initiative: 3,
      speed: 40, flying: 0, swimming: 60,
      sightRange: 60, darkvision: 0
    },
    resistances: { cold: 100, poison: 100, necrotic: 50 },
    vulnerabilities: { fire: 75, radiant: 50 },
    abilities: [
      {
        id: 'thalass_wave_break',
        name: 'Wave-Break',
        description: 'A mass of water shaped like a fist slams into the target with the force of a storm surge.',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'ability_druid_lacerate',
        effectTypes: ['damage', 'control'],
        tags: ['bludgeoning', 'water', 'melee'],
        flavorText: 'The ocean does not punch. It simply arrives.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 15,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d8 + 4',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'water',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        knockbackConfig: { distance: 10 },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'thalass_undertow',
        name: 'Undertow',
        description: 'An invisible current seizes the target and drags them toward the Thalass.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_nature_stranglevines',
        effectTypes: ['control'],
        tags: ['grapple', 'ranged', 'water'],
        flavorText: 'The water remembers you. It wants you back.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'grapple_strong', description: 'Heads: Undertow drags target 20 ft and restrains for 2 rounds.' },
            tails: { effect: 'grapple_weak', description: 'Tails: Undertow slows target by 15 ft for 1 round.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 1 },
            outcomeTiers: [
              { condition: 'heads', name: 'Riptide', dragDistance: 20, restrain: true, restrainDuration: 2 },
              { condition: 'tails', name: 'Undercurrent', slowAmount: 15, slowDuration: 1 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'moderate',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'ocean_grapple',
              name: 'Restrained',
              description: 'Seized by an invisible undertow.',
              mechanicsText: 'Restrained and dragged 20 ft on failed Strength DC 14 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      },
      {
        id: 'thalass_stormsong',
        name: 'Stormsong',
        description: 'Produces the ghost of the sea\'s old harmonic frequencies, overwhelming minds with the sound of a world without silence.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['psychic', 'sonic', 'area'],
        flavorText: 'Before the Dimming, the sea sang. This is the last verse.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '2d6 + spirit',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'sea_confusion',
              name: 'Confused',
              description: 'The old harmonics rewrite thought patterns.',
              mechanicsText: 'Confused for 1 round on failed Spirit DC 14 save.'
            }
          ]
        },
        summoningConfig: {
          creatureType: 'elemental',
          creatures: [
            {
              id: 'tide_marrow',
              name: 'Tide Marrow',
              description: 'A small elemental of compressed wave-energy.',
              size: 'Small',
              type: 'elemental',
              tokenIcon: 'spell_shadow_drain',
              stats: { maxHp: 10, maxMana: 0 },
              config: {
                quantity: 2,
                duration: 3,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 30,
                abilities: 'Deals 1d6 bludgeoning per round and pushes targets 5 ft.'
              }
            }
          ],
          duration: 3,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 30,
          controlType: 'autonomous',
          maxSummons: 4
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 5, max: 20 },
        silver: { min: 15, max: 50 },
        copper: { min: 30, max: 100 }
      },
      items: [
        { itemId: 'bone-plates', dropChance: 30, quantity: { min: 1, max: 3 } },
        { itemId: 'water-essence', dropChance: 25, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Pelagos
  {
    id: 'pelagos',
    name: 'Pelagos',
    description: 'A self-contained ring of warm, impossibly calm water moving against the Iceheart\'s currents. A current that became conscious, carrying the debris of every ship it ever encountered and speaking in whale-song and old Merryn navigation chants.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.HUGE,
    tags: ['elemental', 'iceheart', 'wyrd-creature', 'current', 'ocean', 'boss'],
    tokenIcon: 'spell_shadow_drain',
    tokenBorder: '#00CED1',
    stats: {
      strength: 20, agility: 14, constitution: 20,
      intelligence: 14, spirit: 14, charisma: 12,
      maxHp: 300, currentHp: 300,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 2,
      speed: 20, flying: 0, swimming: 60,
      sightRange: 120, darkvision: 0
    },
    resistances: { cold: 100, physical: 75, piercing: 75, slashing: 75 },
    vulnerabilities: { fire: 100 },
    abilities: [
      {
        id: 'pelagos_shipbreaker',
        name: 'Shipbreaker',
        description: 'Forms a focused jet of water under immense pressure that shatters hulls and crushes bone.',
        level: 5,
        spellType: 'EVOCATION',
        icon: 'spell_nature_earthquake',
        effectTypes: ['damage', 'control'],
        tags: ['bludgeoning', 'ranged', 'heavy'],
        flavorText: 'It has broken a thousand ships. You are no different.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 60,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '4d12',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'water',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        knockbackConfig: { distance: 20 },
        controlConfig: {
          controlType: 'forcedMovement',
          strength: 'strong',
          duration: 0,
          durationUnit: 'instant',
          saveDC: 16,
          saveType: 'agility',
          savingThrow: true,
          saveOutcome: 'half_damage',
          effects: [
            {
              id: 'jet_push',
              name: 'Hurled Back',
              description: 'Launched backward by water pressure.',
              mechanicsText: 'Pushed 20 ft and knocked prone on failed Agility DC 16 save. Half damage on success.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      },
      {
        id: 'pelagos_warm_calm',
        name: 'Warm Calm',
        description: 'The water within the Pelagos ring radiates unnatural warmth, healing all living creatures within.',
        level: 2,
        spellType: 'ENCHANTMENT',
        icon: 'ability_druid_treeoflife',
        effectTypes: ['healing'],
        tags: ['healing', 'aura', 'passive'],
        flavorText: 'The only warm water in the Iceheart. Creatures gather near it and forget to leave.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['ally', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 }
        },
        healingConfig: {
          formula: '1d6',
          healingType: 'direct',
          resolution: 'AUTOMATIC',
          hasHotEffect: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'pelagos_warm_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'pelagos_undertow',
        name: 'Crushing Depths',
        description: 'Water-pressure within the ring increases exponentially, dragging hostile creatures down.',
        level: 5,
        spellType: 'EVOCATION',
        icon: 'spell_shadow_grasp',
        effectTypes: ['control', 'damage', 'aoe'],
        tags: ['grapple', 'crush', 'area'],
        flavorText: 'The depth does not care what you need to breathe.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 }
        },
        damageConfig: {
          formula: '2d10',
          damageTypes: ['bludgeoning'],
          damageType: 'direct',
          elementType: 'water',
          resolution: 'DICE',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false,
          dotConfig: {
            enabled: true,
            damagePerTick: '2d6',
            damageTypes: ['bludgeoning'],
            tickFrequency: 'round',
            duration: 3,
            canStack: false,
            maxStacks: 1
          }
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 18,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'depth_crush',
              name: 'Restrained & Crushing',
              description: 'Crushed by deep-water pressure.',
              mechanicsText: 'Restrained for 1 round on failed Strength DC 18 save. 2d6 bludgeoning per round while restrained.'
            }
          ]
        },
        summoningConfig: {
          creatureType: 'elemental',
          creatures: [
            {
              id: 'depth_current',
              name: 'Depth Current',
              description: 'A self-contained ring of crushing water.',
              size: 'Medium',
              type: 'elemental',
              tokenIcon: 'spell_shadow_drain',
              stats: { maxHp: 30, maxMana: 0 },
              config: {
                quantity: 1,
                duration: 4,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 30,
                abilities: 'Grapples one creature at a time. 2d10 bludgeoning per round while grappling.'
              }
            }
          ],
          duration: 4,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 30,
          controlType: 'autonomous',
          maxSummons: 2
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 1, max: 5 },
        gold: { min: 20, max: 80 },
        silver: { min: 60, max: 200 },
        copper: { min: 100, max: 400 }
      },
      items: [
        { itemId: 'water-essence', dropChance: 100, quantity: { min: 3, max: 6 } },
        { itemId: 'bone-plates', dropChance: 35, quantity: { min: 2, max: 5 } },
        { itemId: 'wooden-haft', dropChance: 40, quantity: { min: 3, max: 6 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — CRAGJAW PEAKS
  // ============================================

  // Qalpa
  {
    id: 'qalpa',
    name: 'Qalpa',
    description: 'A crab-like thing assembled from shattered Fexric mining tools, bound by geothermal heat and a small furnace burning in its chest. It eats darkness — coal, ash, soot, shadow — anything that has been burned.',
    type: CREATURE_TYPES.CONSTRUCT,
    size: CREATURE_SIZES.SMALL,
    tags: ['construct', 'cragjaw', 'wyrd-creature', 'mining', 'scavenger'],
    tokenIcon: 'inv_misc_head_dwarf_01',
    tokenBorder: '#8B4513',
    stats: {
      strength: 12, agility: 14, constitution: 16,
      intelligence: 4, spirit: 6, charisma: 2,
      maxHp: 40, currentHp: 40,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 1,
      speed: 25, flying: 0, swimming: 0,
      sightRange: 30, darkvision: 60
    },
    resistances: { fire: 100, poison: 100 },
    vulnerabilities: { cold: 50, frost: 50 },
    abilities: [
      {
        id: 'qalpa_claw_chisel',
        name: 'Claw-Chisel',
        description: 'Limb-blades of shattered mining chisels slash with surgical precision. Shards embed in the wound.',
        level: 1,
        spellType: 'EVOCATION',
        icon: 'ability_creature_poison_01',
        effectTypes: ['damage'],
        tags: ['piercing', 'melee', 'mining'],
        flavorText: 'The chisels remember the veins they opened. They open yours.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '1d6 + 3',
          damageTypes: ['piercing'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false,
          dotConfig: {
            enabled: true,
            damagePerTick: '1',
            damageTypes: ['piercing'],
            tickFrequency: 'round',
            duration: 3,
            canStack: true,
            maxStacks: 3
          }
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'qalpa_furnace_breath',
        name: 'Furnace-Breath',
        description: 'The chest-furnace overpressurizes and vents superheated air in a narrow cone of killing heat.',
        level: 2,
        spellType: 'EVOCATION',
        icon: 'spell_fire_fire',
        effectTypes: ['damage', 'debuff', 'aoe'],
        tags: ['fire', 'cone', 'breath'],
        flavorText: 'The furnace burns what it was built to burn: darkness, coal, and flesh.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true,
          aoeShape: 'cone',
          aoeParameters: { radius: 15 }
        },
        damageConfig: {
          formula: '1d8 + 2',
          damageTypes: ['fire'],
          damageType: 'direct',
          elementType: 'fire',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'heat_stroke',
              name: 'Heat Exhaustion',
              description: 'Superheated air causes disorientation.',
              mechanicsText: '-2 Agility for 2 rounds.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['agility'] }
            }
          ],
          statPenalties: [
            { stat: 'agility', magnitude: -2, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true,
          saveDC: 12,
          saveType: 'dexterity',
          saveOutcome: 'half_damage'
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
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
        { itemId: 'iron-ingot', dropChance: 35, quantity: { min: 1, max: 3 } },
        { itemId: 'copper-ingot', dropChance: 30, quantity: { min: 2, max: 4 } },
        { itemId: 'ember-ore', dropChance: 15, quantity: { min: 1, max: 1 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Kintsu
  {
    id: 'kintsu',
    name: 'Kintsu',
    description: 'A shimmering figure of bone-reflected light visible only on Ancestor-Spans. It stands at the midpoint and offers safe passage — the toll is your name, lost for three days.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['fey', 'cragjaw', 'wyrd-creature', 'bridge', 'name', 'bone'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#F5DEB3',
    stats: {
      strength: 10, agility: 18, constitution: 14,
      intelligence: 14, spirit: 18, charisma: 16,
      maxHp: 90, currentHp: 90,
      maxMana: 20, currentMana: 20,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 4,
      speed: 40, flying: 20, swimming: 0,
      sightRange: 60, darkvision: 60
    },
    resistances: { physical: 100, cold: 50 },
    vulnerabilities: { radiant: 75 },
    abilities: [
      {
        id: 'kintsu_name_toll',
        name: 'Name-Toll',
        description: 'Forces the target to forget their own name for three days. The toll is always paid — the only question is how much.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['debuff', 'control'],
        tags: ['psychic', 'charisma', 'fate'],
        flavorText: 'It does not steal your name. You hand it over, thinking it was a fair trade.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'name_lost_full', description: 'Heads: The name is taken completely. -6 Charisma for 6 rounds.' },
            tails: { effect: 'name_lost_partial', description: 'Tails: A fragment of the name is taken. -3 Charisma for 3 rounds.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 2 },
            outcomeTiers: [
              { condition: 'ALL_HEADS', name: 'Full Name Taken', charismaPenalty: -8, duration: 8, stunned: true },
              { condition: 'MAJORITY_HEADS', name: 'Name Fades', charismaPenalty: -6, duration: 6 },
              { condition: 'EQUAL_SPLIT', name: 'Name Slips', charismaPenalty: -3, duration: 3 },
              { condition: 'ALL_TAILS', name: 'Toll Waived', charismaPenalty: 0, duration: 0, description: 'The Kintsu blinks and says nothing. No effect.' }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'name_erasure',
              name: 'Nameless',
              description: 'Without a name, identity unravels.',
              mechanicsText: 'Charisma reduced based on coin flip. Duration scales with result.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['charisma'] }
            }
          ],
          statPenalties: [
            { stat: 'charisma', magnitude: -6, magnitudeType: 'flat' }
          ],
          durationValue: 6,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true,
          saveDC: 14,
          saveType: 'spirit',
          saveOutcome: 'negates'
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'kintsu_bone_light_shift',
        name: 'Bone-Light Shift',
        description: 'The Kintsu dissolves into bone-reflected light and reforms at any point on the same Ancestor-Span.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'ability_rogue_shadowstep',
        effectTypes: ['utility', 'buff'],
        tags: ['teleport', 'self', 'bone'],
        flavorText: 'It does not move. Light simply arrives where it was always going.',
        resolution: 'AUTOMATIC',
        targetingConfig: {
          targetingType: 'self',
          rangeType: 'self',
          rangeDistance: 0,
          targetRestrictions: ['self'],
          requiresLineOfSight: false
        },
        buffConfig: {
          buffType: 'combatAdvantage',
          effects: [
            {
              id: 'bone_light_ward',
              name: 'Bone-Light Form',
              description: 'Partially dissolved into light, harder to hit.',
              mechanicsText: '+4 Armor and +4 Agility for 1 round after teleporting.',
              statModifier: { stat: 'agility', magnitude: 4, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: true
        },
        utilityConfig: {
          utilityType: 'movement',
          selectedEffects: [
            {
              id: 'bone_teleport',
              name: 'Bone-Light Teleport',
              description: 'Dissolves into bone-reflected light and reforms up to 60 ft away on the same bone-span.'
            }
          ],
          duration: 0,
          durationUnit: 'instant',
          concentration: false,
          range: 60
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 }
      },
      {
        id: 'kintsu_memory_flash',
        name: 'Memory Flash',
        description: 'Releases fragmented memories of every crossing it has witnessed. Each memory carries the emotional weight of a life.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_soulleech',
        effectTypes: ['damage', 'control', 'aoe'],
        tags: ['psychic', 'area', 'confusion'],
        flavorText: 'Every name it collected. Every face that crossed. All at once.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 15 }
        },
        damageConfig: {
          formula: '2d6 + charisma',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'memory_flood',
              name: 'Confused',
              description: 'Drowning in centuries of crossing-memories.',
              mechanicsText: 'Confused for 1 round on failed Spirit DC 14 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 5, max: 20 },
        silver: { min: 15, max: 50 },
        copper: { min: 30, max: 100 }
      },
      items: [
        { itemId: 'bone-plates', dropChance: 35, quantity: { min: 2, max: 4 } },
        { itemId: 'wooden-haft', dropChance: 25, quantity: { min: 2, max: 4 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Tarn
  {
    id: 'tarn',
    name: 'Tarn',
    description: 'A perfectly circular pool of ink-black water in a snow-depression. Its surface reflects not the present but the future self of whoever looks in. Those who reject their vision become prisoners, pulled in to join every creature that could not accept their future.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.LARGE,
    tags: ['fey', 'cragjaw', 'wyrd-creature', 'oracle', 'pool', 'boss'],
    tokenIcon: 'spell_shadow_drain',
    tokenBorder: '#2F4F4F',
    stats: {
      strength: 16, agility: 0, constitution: 18,
      intelligence: 14, spirit: 20, charisma: 16,
      maxHp: 180, currentHp: 180,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: 0,
      speed: 0, flying: 0, swimming: 0,
      sightRange: 0, darkvision: 0
    },
    resistances: { cold: 100, physical: 50, psychic: 75 },
    vulnerabilities: { fire: 100 },
    abilities: [
      {
        id: 'tarn_water_tendrils',
        name: 'Water-Tendrils',
        description: 'Tendrils of ink-black water snake out and grapple nearby creatures, pulling them toward the pool.',
        level: 4,
        spellType: 'EVOCATION',
        icon: 'spell_nature_stranglevines',
        effectTypes: ['control', 'damage'],
        tags: ['grapple', 'ranged', 'water'],
        flavorText: 'The water is patient. It has always been patient.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '1d8',
          damageTypes: ['cold', 'necrotic'],
          damageType: 'direct',
          elementType: 'void',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'black_water_grapple',
              name: 'Grappled',
              description: 'Ink-black water tendrils wrap around limbs and pull toward the pool.',
              mechanicsText: 'Restrained for 1 round on failed Strength DC 16 save. Pulled 10 ft toward pool.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 1 }
      },
      {
        id: 'tarn_visions_aura',
        name: 'Visions Aura',
        description: 'Creatures near the pool glimpse their future self. Those who reject the vision become prisoners of the pool.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'ability_priest_leapoffaith',
        effectTypes: ['damage', 'control', 'buff', 'aoe'],
        tags: ['psychic', 'vision', 'area', 'passive'],
        flavorText: 'Your future self looks back at you with terrible pity.',
        resolution: 'CARDS',
        specialMechanics: {
          gamblingGame: {
            gameType: 'card_draw',
            resolution: 'CARDS',
            rules: { flipCount: 0, diceCount: 0, dieType: 0, diceType: 'd20', durationHours: 1 },
            outcomeTiers: [
              { condition: 'ROYAL_FLUSH', name: 'Perfect Future', description: 'The vision is wondrous. Target gains +4 Intelligence and +4 Spirit for 2 rounds. No save needed.', buff: true, buffStat: 'intelligence', buffMagnitude: 4 },
              { condition: 'STRAIGHT_FLUSH', name: 'Acceptable Future', description: 'The vision is bearable. Target takes 1d4 psychic but gains +2 Intelligence for 1 round.', damage: '1d4 psychic', buff: true, buffStat: 'intelligence', buffMagnitude: 2 },
              { condition: 'THREE_KIND', name: 'Troubled Future', description: 'The vision is distressing. 1d6 psychic, DC 14 Spirit save or confused for 1 round.', damage: '1d6 psychic', confuseChance: 50 },
              { condition: 'ANY', name: 'Unbearable Future', description: 'The target rejects the vision. 1d4 psychic and paralyzed for 1 round on failed DC 14 Spirit save.', damage: '1d4 psychic', paralyzeChance: 75 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 60 }
        },
        damageConfig: {
          formula: '1d4',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'CARDS',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: true
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'future_knowledge',
              name: 'Future Sight',
              description: 'Seeing the future sharpens the mind.',
              mechanicsText: '+2 Intelligence for 1 round on successful Spirit save.',
              statModifier: { stat: 'intelligence', magnitude: 2, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'rejected_future',
              name: 'Paralyzed',
              description: 'Frozen by the terror of their own future.',
              mechanicsText: 'Paralyzed for 1 round on failed Spirit DC 14 save.'
            }
          ]
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'tarn_vision_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'tarn_dissolve',
        name: 'Dissolve',
        description: 'Creatures submerged in the pool for too long begin to dissolve, their identity draining into the black water.',
        level: 3,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_soulleech',
        effectTypes: ['damage', 'debuff'],
        tags: ['necrotic', 'passive', 'drain'],
        flavorText: 'The pool does not kill. It forgets you, and without memory, you simply stop.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 15 }
        },
        damageConfig: {
          formula: '2d8',
          damageTypes: ['necrotic'],
          damageType: 'direct',
          elementType: 'necrotic',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'identity_drain',
              name: 'Dissolving',
              description: 'Identity drains into the black water.',
              mechanicsText: '-1 to all stats per round while submerged. Cumulative.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['all'] }
            }
          ],
          statPenalties: [
            { stat: 'all', magnitude: -1, magnitudeType: 'flat' }
          ],
          durationValue: 99,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'AND',
            compoundTriggers: [
              {
                id: 'tarn_dissolve_condition',
                category: 'health',
                name: 'While Target Restrained in Pool',
                parameters: {
                  perspective: 'enemy',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 3,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 2 },
        gold: { min: 10, max: 40 },
        silver: { min: 30, max: 100 },
        copper: { min: 60, max: 200 }
      },
      items: [
        { itemId: 'water-essence', dropChance: 100, quantity: { min: 3, max: 6 } },
        { itemId: 'focus-crystal', dropChance: 30, quantity: { min: 1, max: 2 } },
        { itemId: 'rough-stone', dropChance: 25, quantity: { min: 3, max: 8 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — SUNDRIFT VALE
  // ============================================

  // Nokhor
  {
    id: 'nokhor',
    name: 'Nokhor',
    description: 'A small golden-furred creature the size of a hare that glows with soft warmth. It appears at dawn near exhausted travelers, radiating genuine comfort. Stay near it too long and you forget why you were traveling.',
    type: CREATURE_TYPES.FEY,
    size: CREATURE_SIZES.TINY,
    tags: ['fey', 'sundrift', 'wyrd-creature', 'warmth', 'comfort'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#DAA520',
    stats: {
      strength: 2, agility: 16, constitution: 8,
      intelligence: 8, spirit: 16, charisma: 18,
      maxHp: 10, currentHp: 10,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 2, currentActionPoints: 2, initiative: 4,
      speed: 40, flying: 0, swimming: 0,
      sightRange: 30, darkvision: 0
    },
    resistances: { cold: 100, physical: 100 },
    vulnerabilities: { radiant: 100, fire: 100 },
    abilities: [
      {
        id: 'nokhor_comforting_pur',
        name: 'Comforting Pur',
        description: 'Its warmth radiates outward, healing allies and lulling enemies into forgetting why they came.',
        level: 1,
        spellType: 'ENCHANTMENT',
        icon: 'ability_priest_renew',
        effectTypes: ['healing', 'control'],
        tags: ['healing', 'charm', 'aura', 'passive'],
        flavorText: 'Stay. Rest. You have been traveling so long. You can stay forever.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['ally', 'enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 20 }
        },
        healingConfig: {
          formula: '1d4 + 1',
          healingType: 'direct',
          resolution: 'AUTOMATIC',
          hasHotEffect: true,
          hotFormula: '1',
          hotDuration: 1,
          hotTickType: 'round'
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'mild',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 12,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'warmth_charm',
              name: 'Charmed',
              description: 'The warmth makes you want to stay.',
              mechanicsText: 'Charmed for 1 round on failed Spirit DC 12 save. -5 speed on success.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'contentment_laziness',
              name: 'Content',
              description: 'Even on a successful save, the warmth saps urgency.',
              mechanicsText: '-5 speed for 1 round.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['speed'] }
            }
          ],
          statPenalties: [
            { stat: 'speed', magnitude: -5, magnitudeType: 'flat' }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'nokhor_warmth_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 2 },
        silver: { min: 3, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        { itemId: 'fieldleaf', dropChance: 45, quantity: { min: 2, max: 4 } },
        { itemId: 'bitterroot', dropChance: 25, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Unzag
  {
    id: 'unzag',
    name: 'Unzag',
    description: 'A massive silhouette darker than darkness, drifting across the starless sky. It is the fault where the last star went dark — the sky\'s scar, searching for the stars it was supposed to hold.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.GARGANTUAN,
    tags: ['elemental', 'sundrift', 'wyrd-creature', 'sky', 'starless', 'void'],
    tokenIcon: 'spell_shadow_drain',
    tokenBorder: '#191970',
    stats: {
      strength: 0, agility: 10, constitution: 18,
      intelligence: 14, spirit: 20, charisma: 14,
      maxHp: 150, currentHp: 150,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 3, currentActionPoints: 3, initiative: 0,
      speed: 10, flying: 120, swimming: 0,
      sightRange: 0, darkvision: 0
    },
    resistances: { cold: 100, physical: 100, psychic: 50 },
    vulnerabilities: { radiant: 75, fire: 50 },
    abilities: [
      {
        id: 'unzag_sky_fault',
        name: 'Sky-Fault',
        description: 'Its shadow on the ground freezes everything it touches, creating a zone of absolute cold and darkness.',
        level: 4,
        spellType: 'EVOCATION',
        icon: 'spell_frost_frostarmor',
        effectTypes: ['damage', 'debuff', 'aoe'],
        tags: ['cold', 'void', 'area', 'passive'],
        flavorText: 'Where the last star went dark, the sky remembers the wound.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 60 }
        },
        damageConfig: {
          formula: '2d6',
          damageTypes: ['cold'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'sky_fault_darkness',
              name: 'Darkness Penalty',
              description: 'The shadow-zone saps all warmth and light.',
              mechanicsText: '-4 Spirit and -2 sightRange while within the fault zone.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['spirit'] }
            }
          ],
          statPenalties: [
            { stat: 'spirit', magnitude: -4, magnitudeType: 'flat' }
          ],
          durationValue: 0,
          durationType: 'instant',
          durationUnit: 'instant',
          canBeDispelled: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'unzag_shadow_passive',
                category: 'health',
                name: 'Always Active While Flying',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'unzag_star_hunger',
        name: 'Star-Hunger',
        description: 'Forces creatures to stare upward into the void where the last star died. The emptiness is paralyzing.',
        level: 5,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['control', 'buff', 'aoe'],
        tags: ['paralyze', 'void', 'area'],
        flavorText: 'Look up. See what isn\'t there. See what will never be there again.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'void_paralyze', description: 'Heads: The void stares back. Paralyzed for 1 round, no save.' },
            tails: { effect: 'void_frighten', description: 'Tails: The void whispers. Frightened for 1 round on failed Spirit DC 16.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 3 },
            outcomeTiers: [
              { condition: 'ALL_HEADS', name: 'Star Swallowed', description: 'Complete void absorption. Paralyzed for 2 rounds, drained of 2d6 Spirit.', paralyzeDuration: 2, spiritDrain: '2d6' },
              { condition: 'MAJORITY_HEADS', name: 'Void Gaze', description: 'The void locks eyes. Paralyzed for 1 round, no save.', paralyzeDuration: 1 },
              { condition: 'MAJORITY_TAILS', name: 'Star Echo', description: 'A faint star-glimmer. +2 Spirit for 1 round instead.', buff: true, spiritBonus: 2 },
              { condition: 'ALL_TAILS', name: 'Star Remembered', description: 'The star briefly returns. All allies in range gain +4 Spirit for 1 round.', buff: true, spiritBonus: 4, aoeBuff: true }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 40 }
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'void_absorption',
              name: 'Void-Fed',
              description: 'The Unzag grows stronger from the emptiness.',
              mechanicsText: '+2 Spirit for 1 round on successful enemy save.',
              statModifier: { stat: 'spirit', magnitude: 2, magnitudeType: 'flat' }
            }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'void_paralysis',
              name: 'Paralyzed',
              description: 'Frozen by the weight of the absent star.',
              mechanicsText: 'Paralyzed for 1 round on failed Spirit DC 16 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 5, max: 20 },
        silver: { min: 15, max: 50 },
        copper: { min: 30, max: 100 }
      },
      items: [
        { itemId: 'arcane-dust', dropChance: 30, quantity: { min: 1, max: 3 } },
        { itemId: 'focus-crystal', dropChance: 20, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Zud
  {
    id: 'zud',
    name: 'Zud',
    description: 'A wall of frozen grass, compressed bone, and the silence of a steppe with no herds. Eight feet tall, forty feet wide, and moving with the inevitability of weather. It is winter that learned to walk.',
    type: CREATURE_TYPES.MONSTROSITY,
    size: CREATURE_SIZES.HUGE,
    tags: ['monstrosity', 'sundrift', 'wyrd-creature', 'winter', 'herd', 'boss'],
    tokenIcon: 'spell_frost_frost',
    tokenBorder: '#FFFAFA',
    stats: {
      strength: 22, agility: 6, constitution: 22,
      intelligence: 4, spirit: 12, charisma: 2,
      maxHp: 250, currentHp: 250,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 4, currentActionPoints: 4, initiative: -2,
      speed: 30, flying: 0, swimming: 0,
      sightRange: 0, darkvision: 0
    },
    resistances: { cold: 100, poison: 100, psychic: 100, piercing: 100, slashing: 100 },
    vulnerabilities: { fire: 100, bludgeoning: 75 },
    abilities: [
      {
        id: 'zud_blizzard_body',
        name: 'Blizzard Body',
        description: 'The Zud\'s massive form engulfs everything in its path, freezing flesh to bone on contact.',
        level: 5,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_cleave',
        effectTypes: ['damage', 'control'],
        tags: ['cold', 'melee', 'crush'],
        flavorText: 'It does not chase you. Winter simply arrives where you stand.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'melee',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'cone',
          aoeParameters: { radius: 10 }
        },
        damageConfig: {
          formula: '3d10 + 6',
          damageTypes: ['cold', 'bludgeoning'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2.5,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'strength',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'frozen_mass',
              name: 'Restrained',
              description: 'Frozen in place by compressed bone and blizzard-force wind.',
              mechanicsText: 'Restrained for 1 round on failed Strength DC 16 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'zud_herd_memory',
        name: 'Herd-Memory',
        description: 'The Zud speaks with the frozen voices of every creature it has consumed. Their last words echo with devastating force.',
        level: 5,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['control', 'damage', 'aoe', 'summoning'],
        tags: ['psychic', 'fear', 'area', 'summon'],
        flavorText: '"I was warm once." "My children..." "Don\'t look back." — a chorus of the consumed.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'fear_storm', description: 'Heads: The voices form into a howling blizzard of grief. Frightened for 2 rounds.' },
            tails: { effect: 'memory_bomb', description: 'Tails: A single voice screams its last word. 3d6 psychic damage in a cone.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 1 },
            outcomeTiers: [
              { condition: 'heads', name: 'Chorus of Grief', fear: true, fearDuration: 2 },
              { condition: 'tails', name: 'Last Word', damage: '3d6 psychic', aoeShape: 'cone', aoeSize: 30 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 60 }
        },
        summoningConfig: {
          creatureType: 'undead',
          creatures: [
            {
              id: 'frozen_echo',
              name: 'Frozen Echo',
              description: 'A spectral figure made of compressed snow and bone, endlessly repeating its last words.',
              size: 'Medium',
              type: 'undead',
              tokenIcon: 'spell_frost_frost',
              stats: { maxHp: 15, maxMana: 0 },
              config: {
                quantity: 4,
                duration: 3,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 30,
                abilities: 'Charges nearest creature, dealing 1d8 cold damage. Immune to cold.'
              }
            }
          ],
          duration: 3,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 30,
          controlType: 'autonomous',
          maxSummons: 8
        },
        controlConfig: {
          controlType: 'restriction',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'herd_fear',
              name: 'Frightened',
              description: 'Frozen by the chorus of the dead.',
              mechanicsText: 'Frightened for 1 round on failed Spirit DC 14 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'zud_whiteout',
        name: 'Whiteout',
        description: 'The Zud generates a blinding wall of white that reduces visibility to nothing and chills the air to killing temperature.',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'spell_nature_slow',
        effectTypes: ['control', 'debuff', 'aoe'],
        tags: ['blind', 'cold', 'area', 'passive'],
        flavorText: 'You cannot see winter. But winter sees you.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 30 }
        },
        damageConfig: {
          formula: '1d4',
          damageTypes: ['cold'],
          damageType: 'direct',
          elementType: 'cold',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'mild',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'intelligence',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'whiteout_blind',
              name: 'Blinded',
              description: 'Total whiteout. Cannot see anything.',
              mechanicsText: 'Blinded for 1 round on failed Intelligence DC 14 save.'
            }
          ]
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'frost_slow',
              name: 'Frozen Movement',
              description: 'Extreme cold slows everything to a crawl.',
              mechanicsText: '-6 Agility for 2 rounds within the whiteout zone.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['agility'] }
            }
          ],
          statPenalties: [
            { stat: 'agility', magnitude: -6, magnitudeType: 'flat' }
          ],
          durationValue: 2,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'zud_whiteout_passive',
                category: 'health',
                name: 'Always Active',
                parameters: {
                  perspective: 'self',
                  percentage: 100,
                  comparison: 'greater_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 2 },
        gold: { min: 10, max: 40 },
        silver: { min: 30, max: 100 },
        copper: { min: 60, max: 200 }
      },
      items: [
        { itemId: 'wooden-haft', dropChance: 35, quantity: { min: 3, max: 8 } },
        { itemId: 'bitterroot', dropChance: 25, quantity: { min: 2, max: 4 } },
        { itemId: 'fieldleaf', dropChance: 30, quantity: { min: 4, max: 8 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // ============================================
  // WYRD CREATURES — BRYNGLOOM FOREST
  // ============================================

  // Morok
  {
    id: 'morok',
    name: 'Morok',
    description: 'A shadow darker than the surrounding darkness, visible only against the faintest light. It moves like rot spreading through water and feeds on the distinction between living and dead.',
    type: CREATURE_TYPES.UNDEAD,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['undead', 'bryngloom', 'wyrd-creature', 'darkness', 'shadow'],
    tokenIcon: 'inv_misc_head_human_01',
    tokenBorder: '#0A0A0A',
    stats: {
      strength: 0, agility: 6, constitution: 0,
      intelligence: 4, spirit: 8, charisma: 2,
      maxHp: 1, currentHp: 1,
      maxMana: 0, currentMana: 0,
      maxActionPoints: 1, currentActionPoints: 1, initiative: 2,
      speed: 15, flying: 0, swimming: 0,
      sightRange: 0, darkvision: 0
    },
    resistances: { physical: 100, cold: 100, necrotic: 100, psychic: 100 },
    vulnerabilities: { radiant: 200, fire: 200 },
    abilities: [
      {
        id: 'morok_stain',
        name: 'Morok-Stain',
        description: 'Touching the Morok leaves a dark patch on the skin that spreads, blurring the line between living and dead.',
        level: 2,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_grasp',
        effectTypes: ['damage', 'debuff'],
        tags: ['necrotic', 'drain', 'touch'],
        flavorText: 'The stain does not heal. It simply waits for you to forget it was new.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'touch',
          rangeDistance: 5,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '2d6',
          damageTypes: ['necrotic'],
          damageType: 'direct',
          elementType: 'necrotic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: true
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'death_stain',
              name: 'Morok-Stain',
              description: 'A spreading darkness that erodes vitality.',
              mechanicsText: '-3 Spirit for 24 rounds. Stacks up to 3 times.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['spirit', 'constitution'] }
            }
          ],
          statPenalties: [
            { stat: 'spirit', magnitude: -3, magnitudeType: 'flat' },
            { stat: 'constitution', magnitude: -1, magnitudeType: 'flat' }
          ],
          durationValue: 24,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: false,
          saveDC: 14,
          saveType: 'constitution',
          saveOutcome: 'negates'
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 0 },
        gold: { min: 0, max: 2 },
        silver: { min: 3, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        { itemId: 'ground-bone', dropChance: 25, quantity: { min: 1, max: 2 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Vatra
  {
    id: 'vatra',
    name: 'Vatra',
    description: 'A silver-skinned figure wrapped in glowing fungal thread, walking through bogs asking everyone she meets: "May I borrow your name?" A Drun Neth who rewrote herself using dead names and fungal thread.',
    type: CREATURE_TYPES.UNDEAD,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['undead', 'bryngloom', 'wyrd-creature', 'neth', 'drun', 'names'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#C0C0C0',
    stats: {
      strength: 12, agility: 10, constitution: 16,
      intelligence: 14, spirit: 16, charisma: 14,
      maxHp: 80, currentHp: 80,
      maxMana: 20, currentMana: 20,
      maxActionPoints: 5, currentActionPoints: 5, initiative: 2,
      speed: 25, flying: 0, swimming: 20,
      sightRange: 40, darkvision: 60
    },
    resistances: { necrotic: 100, poison: 50 },
    vulnerabilities: { fire: 50, radiant: 50 },
    abilities: [
      {
        id: 'vatra_fungal_thread',
        name: 'Fungal Thread',
        description: 'A glowing thread extends and binds the target, draining vitality while asking: "May I borrow your name?"',
        level: 3,
        spellType: 'EVOCATION',
        icon: 'spell_nature_stranglevines',
        effectTypes: ['damage', 'control', 'debuff'],
        tags: ['piercing', 'grapple', 'ranged'],
        flavorText: '"May I borrow your name?" — the question is always the same. The answer never matters.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'name_weakened', description: 'Heads: Thread drains a fragment of identity. -2 Charisma for 2 rounds.' },
            tails: { effect: 'vitality_drain', description: 'Tails: Thread drains life force. 1d6 necrotic damage and -1 Constitution for 1 round.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 1 },
            outcomeTiers: [
              { condition: 'heads', name: 'Name Thread', charismaDrain: 2, charismaDuration: 2 },
              { condition: 'tails', name: 'Life Thread', damage: '1d6 necrotic', conDrain: 1 }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 10,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '1d8 + 3',
          damageTypes: ['piercing'],
          damageType: 'direct',
          elementType: 'physical',
          resolution: 'COINS',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'restraint',
          strength: 'moderate',
          duration: 2,
          durationUnit: 'rounds',
          saveDC: 14,
          saveType: 'spirit',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'fungal_restraint',
              name: 'Restrained',
              description: 'Bound by glowing fungal threads.',
              mechanicsText: 'Restrained for 2 rounds on failed Spirit DC 14 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 3 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'vatra_burning_regen',
        name: 'Burning Regeneration',
        description: 'When below half HP, fungal threads ignite with cold fire — healing her while searing everything nearby.',
        level: 4,
        spellType: 'EVOCATION',
        icon: 'spell_fire_fire',
        effectTypes: ['damage', 'healing', 'buff', 'aoe'],
        tags: ['fire', 'regen', 'passive', 'trigger'],
        flavorText: 'The fungus does not choose between growth and burning. It does both, always.',
        resolution: 'AUTOMATIC',
        spellType: 'PASSIVE',
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'ally', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 10 }
        },
        damageConfig: {
          formula: '1d6 + 2',
          damageTypes: ['fire'],
          damageType: 'direct',
          elementType: 'fire',
          resolution: 'AUTOMATIC',
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false
        },
        healingConfig: {
          formula: '2d6',
          healingType: 'direct',
          resolution: 'AUTOMATIC',
          hasHotEffect: true,
          hotFormula: '1d4',
          hotDuration: 3,
          hotTickType: 'round'
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'fungal_fortitude',
              name: 'Burning Fortitude',
              description: 'Ignited fungal threads harden into armor.',
              mechanicsText: '+4 Constitution while below half HP.',
              statModifier: { stat: 'constitution', magnitude: 4, magnitudeType: 'flat' }
            }
          ],
          durationValue: 99,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        triggerConfig: {
          global: {
            enabled: true,
            logicType: 'OR',
            compoundTriggers: [
              {
                id: 'vatra_below_half',
                category: 'health',
                name: 'Below Half HP',
                parameters: {
                  perspective: 'self',
                  percentage: 50,
                  comparison: 'less_than',
                  triggerChance: 100
                }
              }
            ]
          },
          triggerRole: {
            mode: 'CONDITIONAL',
            activationDelay: 0,
            requiresLOS: false
          }
        },
        resourceCost: { actionPoints: 0 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'vatra_name_question',
        name: 'Name-Question',
        description: '"May I borrow your name?" — those who answer yes lose their identity. Those who refuse take psychic damage from the rejection of hospitality.',
        level: 4,
        spellType: 'ENCHANTMENT',
        icon: 'ability_priest_leapoffaith',
        effectTypes: ['debuff', 'damage', 'summoning'],
        tags: ['psychic', 'identity', 'summon'],
        flavorText: 'Saying no to a Drun Neth is worse than saying yes. She remembers every refusal.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 10,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'identity_erased',
              name: 'Nameless',
              description: 'Your name is gone. Without it, who are you?',
              mechanicsText: '-8 Charisma for 6 rounds. Cannot be dispelled.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['charisma'] }
            }
          ],
          statPenalties: [
            { stat: 'charisma', magnitude: -8, magnitudeType: 'flat' }
          ],
          durationValue: 6,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: false,
          saveDC: 14,
          saveType: 'spirit',
          saveOutcome: 'negates'
        },
        damageConfig: {
          formula: '2d6',
          damageTypes: ['psychic'],
          damageType: 'direct',
          elementType: 'psychic',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 2,
          critDiceOnly: false
        },
        summoningConfig: {
          creatureType: 'undead',
          creatures: [
            {
              id: 'ash_child',
              name: 'Ash Child',
              description: 'A small figure of fungal thread and ash, wearing a stolen name.',
              size: 'Small',
              type: 'undead',
              tokenIcon: 'spell_fire_fire',
              stats: { maxHp: 10, maxMana: 0 },
              config: {
                quantity: 3,
                duration: 4,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 20,
                abilities: 'Seeks the named target, dealing 1d4 psychic damage per round. Ignores other creatures.'
              }
            }
          ],
          duration: 4,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 20,
          controlType: 'autonomous',
          maxSummons: 6
        },
        resourceCost: { actionPoints: 2 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 0, max: 1 },
        gold: { min: 5, max: 20 },
        silver: { min: 15, max: 50 },
        copper: { min: 30, max: 80 }
      },
      items: [
        { itemId: 'fieldleaf', dropChance: 35, quantity: { min: 2, max: 5 } },
        { itemId: 'bitterroot', dropChance: 25, quantity: { min: 1, max: 3 } },
        { itemId: 'wooden-haft', dropChance: 20, quantity: { min: 2, max: 4 } }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },

  // Vyraj
  {
    id: 'vyraj',
    name: 'Vyraj',
    description: 'A tall figure with backward-facing hands and mouths for eyes, each speaking a different clause of the last contract it consumed. It eats legal agreements and regurgitates paradoxes. The logical endpoint of all law.',
    type: CREATURE_TYPES.FIEND,
    size: CREATURE_SIZES.LARGE,
    tags: ['fiend', 'bryngloom', 'wyrd-creature', 'law', 'paradox', 'boss'],
    tokenIcon: 'inv_misc_head_dragon_red',
    tokenBorder: '#4B0082',
    stats: {
      strength: 18, agility: 14, constitution: 22,
      intelligence: 20, spirit: 18, charisma: 16,
      maxHp: 300, currentHp: 300,
      maxMana: 60, currentMana: 60,
      maxActionPoints: 6, currentActionPoints: 6, initiative: 4,
      speed: 30, flying: 0, swimming: 0,
      sightRange: 60, darkvision: 120
    },
    resistances: { physical: 75, psychic: 100, necrotic: 50 },
    vulnerabilities: { radiant: 75, void: 75 },
    abilities: [
      {
        id: 'vyraj_clause_strike',
        name: 'Clause-Strike',
        description: 'An impact of pure legal force that strikes with the weight of every violated contract in history.',
        level: 5,
        spellType: 'EVOCATION',
        icon: 'ability_warrior_shieldbreak',
        effectTypes: ['damage', 'control'],
        tags: ['force', 'stun', 'melee'],
        flavorText: 'You have broken terms you never agreed to. The penalty is retroactive.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'melee',
          rangeDistance: 10,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        damageConfig: {
          formula: '3d10 + 6',
          damageTypes: ['force'],
          damageType: 'direct',
          elementType: 'force',
          resolution: 'DICE',
          canCrit: true,
          critMultiplier: 3,
          critDiceOnly: false
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'moderate',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 18,
          saveType: 'constitution',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'clause_stun',
              name: 'Stunned',
              description: 'Staggered by the weight of violated terms.',
              mechanicsText: 'Stunned for 1 round on failed Constitution DC 18 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 }
      },
      {
        id: 'vyraj_paradox_field',
        name: 'Paradox Field',
        description: 'Creates a zone where logic breaks down — coordination becomes impossible and agreements are unmade.',
        level: 6,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_silence',
        effectTypes: ['control', 'debuff', 'aoe'],
        tags: ['psychic', 'area', 'confuse', 'paradox'],
        flavorText: 'In this zone, A equals not-A. Every agreement you have ever made is unmade.',
        resolution: 'COINS',
        specialMechanics: {
          coinFlip: {
            heads: { effect: 'logic_break', description: 'Heads: Complete paradox. Target confused for 2 rounds AND -4 Charisma.' },
            tails: { effect: 'agreement_unmade', description: 'Tails: One buff or enchantment on the target is dispelled. -3 Charisma for 1 round.' }
          },
          gamblingGame: {
            gameType: 'coin_flip',
            resolution: 'COINS',
            rules: { flipCount: 2 },
            outcomeTiers: [
              { condition: 'ALL_HEADS', name: 'Total Paradox', description: 'Reality fractures. All targets confused for 2 rounds. All buffs in zone dispelled.', confuseDuration: 2, dispelAll: true },
              { condition: 'MAJORITY_HEADS', name: 'Logic Failure', description: 'Confused for 1 round and -4 Charisma for 2 rounds.', confuseDuration: 1, charismaDrain: 4 },
              { condition: 'MAJORITY_TAILS', name: 'Agreement Broken', description: 'One random buff dispelled per target. -3 Charisma for 1 round.', dispelOne: true, charismaDrain: 3 },
              { condition: 'ALL_TAILS', name: 'The Clause Holds', description: 'The paradox fails to manifest. No effect.' }
            ]
          }
        },
        targetingConfig: {
          targetingType: 'area',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: false,
          aoeShape: 'circle',
          aoeParameters: { radius: 30 }
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'paradox_charisma',
              name: 'Identity Eroded',
              description: 'The paradox erodes sense of self.',
              mechanicsText: '-3 Charisma for 1 round on successful save.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['charisma'] }
            }
          ],
          statPenalties: [
            { stat: 'charisma', magnitude: -3, magnitudeType: 'flat' }
          ],
          durationValue: 1,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: true
        },
        controlConfig: {
          controlType: 'incapacitation',
          strength: 'strong',
          duration: 1,
          durationUnit: 'rounds',
          saveDC: 16,
          saveType: 'intelligence',
          savingThrow: true,
          saveOutcome: 'negates',
          effects: [
            {
              id: 'paradox_confusion',
              name: 'Confused',
              description: 'Logic itself breaks down in the field.',
              mechanicsText: 'Confused for 1 round on failed Intelligence DC 16 save.'
            }
          ]
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3 }
      },
      {
        id: 'vyraj_devour_agreement',
        name: 'Devour Agreement',
        description: 'Consumes a buff, magical effect, or tactical advantage from the target. The devoured contract fuels the Vyraj.',
        level: 6,
        spellType: 'ENCHANTMENT',
        icon: 'spell_shadow_soulleech',
        effectTypes: ['debuff', 'buff', 'summoning'],
        tags: ['dispel', 'drain', 'ranged'],
        flavorText: 'It eats the terms you agreed to. Without them, you are less than you were.',
        resolution: 'DICE',
        targetingConfig: {
          targetingType: 'single',
          rangeType: 'ranged',
          rangeDistance: 20,
          targetRestrictions: ['enemy', 'creature'],
          requiresLineOfSight: true
        },
        debuffConfig: {
          debuffType: 'statReduction',
          effects: [
            {
              id: 'agreement_consumed',
              name: 'Terms Violated',
              description: 'Every contract the target relied on is eaten.',
              mechanicsText: '-2 to all stats for 3 rounds. Dispel one buff.',
              statusEffect: { penaltyType: 'flat_penalty', affectedStats: ['all'] }
            }
          ],
          statPenalties: [
            { stat: 'strength', magnitude: -2, magnitudeType: 'flat' },
            { stat: 'agility', magnitude: -2, magnitudeType: 'flat' },
            { stat: 'constitution', magnitude: -2, magnitudeType: 'flat' },
            { stat: 'intelligence', magnitude: -2, magnitudeType: 'flat' },
            { stat: 'spirit', magnitude: -2, magnitudeType: 'flat' },
            { stat: 'charisma', magnitude: -2, magnitudeType: 'flat' }
          ],
          durationValue: 3,
          durationType: 'rounds',
          durationUnit: 'rounds',
          canBeDispelled: false,
          saveDC: 18,
          saveType: 'spirit',
          saveOutcome: 'negates'
        },
        buffConfig: {
          buffType: 'statEnhancement',
          effects: [
            {
              id: 'contract_fed',
              name: 'Contract-Absorbed',
              description: 'The Vyraj grows stronger from the devoured agreement.',
              mechanicsText: '+2 Strength and +2 Intelligence for 3 rounds.',
              statModifier: { stat: 'strength', magnitude: 2, magnitudeType: 'flat' }
            }
          ],
          durationValue: 3,
          durationType: 'rounds',
          durationUnit: 'rounds',
          concentrationRequired: false,
          canBeDispelled: false
        },
        summoningConfig: {
          creatureType: 'fiend',
          creatures: [
            {
              id: 'paradox_clause',
              name: 'Paradox Clause',
              description: 'A floating fragment of consumed contract that attacks independently.',
              size: 'Small',
              type: 'fiend',
              tokenIcon: 'spell_shadow_soulleech',
              stats: { maxHp: 20, maxMana: 0 },
              config: {
                quantity: 2,
                duration: 3,
                durationUnit: 'rounds',
                hasDuration: true,
                concentration: false,
                controlType: 'autonomous',
                controlRange: 20,
                abilities: 'Attacks nearest creature for 1d8 force damage. Dispel one buff on hit.'
              }
            }
          ],
          duration: 3,
          durationUnit: 'rounds',
          hasDuration: true,
          concentration: false,
          controlRange: 20,
          controlType: 'autonomous',
          maxSummons: 4
        },
        resourceCost: { actionPoints: 4 },
        cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4 }
      }
    ],
    lootTable: {
      currency: {
        platinum: { min: 2, max: 8 },
        gold: { min: 30, max: 100 },
        silver: { min: 80, max: 250 },
        copper: { min: 200, max: 500 }
      },
      items: [
        { itemId: 'arcane-dust', dropChance: 55, quantity: { min: 4, max: 8 } },
        { itemId: 'soul-fragment', dropChance: 30, quantity: { min: 2, max: 4 } },
        { itemId: 'shadow-residue', dropChance: 20, quantity: { min: 2, max: 4 } }
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
        { itemId: 'soul-fragment', dropChance: 35, quantity: { min: 2, max: 4 } },
        { itemId: 'arcane-dust', dropChance: 30, quantity: { min: 3, max: 6 } }
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

