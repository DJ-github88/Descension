// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

export const LIBRARY_CREATURES = [
  {
    id: 'thorin-blackforge-merchant',
    name: 'Thorin Blackforge',
    description: 'A stout dwarven merchant with a magnificent braided beard and keen eyes for quality goods. Thorin runs the finest smithy and general store in the region, offering everything from masterwork weapons to healing potions. His shop, "The Anvil & Coin," is renowned for fair prices and exceptional craftsmanship.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['dwarf', 'merchant', 'shopkeeper', 'blacksmith', 'friendly'],
    tokenIcon: 'inv_misc_head_dwarf_01',
    tokenBorder: '#FFD700',
    stats: {
      strength: 14,
      agility: 10,
      constitution: 16,
      intelligence: 13,
      spirit: 12,
      charisma: 15,
      maxHp: 85,
      currentHp: 85,
      maxMana: 30,
      currentMana: 30,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 16,
      initiative: 2,
      speed: 25,
      flying: 0,
      swimming: 10,
      sightRange: 60,
      darkvision: 60,
      proficiencyBonus: 3,
      skills: {
        insight: 'proficient',
        persuasion: 'expert',
        smithsTools: 'expert',
        history: 'proficient'
      }
    },
    resistances: {
      poison: 'resistant'
    },
    vulnerabilities: {},
    abilities: [
      {
        id: 'merchant-appraisal',
        name: 'Merchant\'s Eye',
        description: 'Thorin can instantly appraise the value of any item with uncanny accuracy.',
        type: 'passive',
        uses: 'unlimited'
      },
      {
        id: 'dwarven-resilience',
        name: 'Dwarven Resilience',
        description: 'Advantage on saving throws against poison, and resistance to poison damage.',
        type: 'passive',
        uses: 'unlimited'
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 50, max: 200 },
        silver: { min: 100, max: 500 },
        copper: { min: 200, max: 800 }
      },
      items: [
        { itemId: 'smithing-hammer', dropChance: 25 },
        { itemId: 'merchant-ledger', dropChance: 50 },
        { itemId: 'gold-ring', dropChance: 15 }
      ]
    },
    isShopkeeper: true,
    shopInventory: {
      shopName: 'The Anvil & Coin',
      shopDescription: 'A warm, well-lit shop filled with the sound of hammering from the forge in the back. Weapons and armor line the walls, while shelves hold potions, tools, and adventuring supplies. The smell of hot metal and coal fills the air.',
      restockOnLongRest: true,
      buyRates: {
        default: 25, // Very low default for unlisted items
        categories: {
          weapon: 65,        // Pays excellent rates for weapons (his specialty)
          armor: 60,         // Great rate for armor (also his specialty)
          consumable: 35,    // Moderate rate for consumables
          accessory: 40,     // Decent rate for accessories
          container: 45,     // Good rate for containers
          miscellaneous: 50  // Good rate for misc items (includes crafting materials)
        }
      },
      items: [
        // Weapons
        { itemId: 'iron-shortsword', customPrice: { gold: 3, silver: 0, copper: 0 }, quantity: 3 },
        { itemId: 'steel-longsword', customPrice: { gold: 8, silver: 0, copper: 0 }, quantity: 2 },
        { itemId: 'iron-dagger', customPrice: { gold: 1, silver: 50, copper: 0 }, quantity: 5 },
        { itemId: 'rusty-dagger', customPrice: { gold: 0, silver: 75, copper: 0 }, quantity: 3 },
        { itemId: 'iron-mace', customPrice: { gold: 5, silver: 0, copper: 0 }, quantity: 2 },

        // Armor
        { itemId: 'leather-armor', customPrice: { gold: 8, silver: 0, copper: 0 }, quantity: 4 },
        { itemId: 'studded-leather-armor', customPrice: { gold: 15, silver: 0, copper: 0 }, quantity: 2 },

        // Consumables
        { itemId: 'minor-healing-potion', customPrice: { gold: 0, silver: 50, copper: 0 }, quantity: 12 },
        { itemId: 'mana-potion', customPrice: { gold: 0, silver: 75, copper: 0 }, quantity: 8 },
        { itemId: 'stamina-potion', customPrice: { gold: 0, silver: 60, copper: 0 }, quantity: 6 },

        // Tools & Supplies
        { itemId: 'rope-coil', customPrice: { gold: 0, silver: 20, copper: 0 }, quantity: 6 },
        { itemId: 'healing-kit', customPrice: { gold: 1, silver: 0, copper: 0 }, quantity: 4 },

        // Containers
        { itemId: 'leather-pouch', customPrice: { gold: 0, silver: 50, copper: 0 }, quantity: 8 },

        // Jewelry & Accessories
        { itemId: 'copper-ring', customPrice: { gold: 8, silver: 0, copper: 0 }, quantity: 2 },
        { itemId: 'pearl-string', customPrice: { gold: 12, silver: 0, copper: 0 }, quantity: 1 },

        // Crafting Materials
        { itemId: 'iron-ore', customPrice: { gold: 0, silver: 50, copper: 0 }, quantity: 15 },
        { itemId: 'leather-strips', customPrice: { gold: 0, silver: 10, copper: 0 }, quantity: 20 },
        { itemId: 'linen-cloth', customPrice: { gold: 0, silver: 5, copper: 0 }, quantity: 25 },

        // Trade Goods
        { itemId: 'exotic-spices', customPrice: { gold: 2, silver: 50, copper: 0 }, quantity: 3 }
      ]
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },
  {
    id: 'snicksnack-prankster',
    name: 'Snicksnack the Prankster',
    description: 'A mischievous goblin known for replacing weapons with rubber chickens. His pranks are legendary among the goblin tribes, and even the most hardened warriors fear becoming the target of his tricks.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'trickster', 'annoying', 'prankster'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#4CAF50',
    stats: {
      strength: 8,
      agility: 14,
      constitution: 10,
      intelligence: 12,
      spirit: 8,
      charisma: 13,
      maxHp: 35,
      currentHp: 35,
      maxMana: 20,
      currentMana: 20,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armor: 13,
      initiative: 3,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '1',
      skills: {
        stealth: 'proficient',
        sleightOfHand: 'expert',
        acrobatics: 'proficient'
      }
    },
    resistances: {
      poison: 'resistant'
    },
    vulnerabilities: {
      fire: 'exposed'
    },
    abilities: [
      {
        name: 'Dagger Stab',
        description: 'A quick stab with a rusty dagger.',
        type: 'melee',
        icon: 'ability_rogue_daggersofexpertise',
        damage: {
          diceCount: 1,
          diceType: 4,
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
            formula: '1d4+2'
          }
        ]
      },
      {
        name: 'Rubber Chicken Swap',
        description: 'Snicksnack attempts to replace an enemy\'s weapon with a rubber chicken, temporarily disarming them.',
        type: 'special',
        icon: 'inv_misc_food_chicken_drumstick_01',
        range: 15,
        actionPointCost: 3,
        cooldown: 3,
        effects: [
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 13,
            onFail: {
              type: 'CONDITION',
              condition: 'disarmed',
              duration: 2
            }
          }
        ]
      },
      {
        name: 'Smoke Bomb',
        description: 'Throws a smoke bomb that creates a cloud of obscuring smoke, allowing Snicksnack to hide or escape.',
        type: 'special',
        icon: 'spell_shadow_shadowfury',
        range: 20,
        actionPointCost: 3,
        cooldown: 4,
        effects: [
          {
            type: 'AREA',
            shape: 'circle',
            size: 15
          },
          {
            type: 'CONDITION',
            condition: 'blinded',
            duration: 1,
            save: {
              attribute: 'constitution',
              dc: 12
            }
          },
          {
            type: 'SPECIAL',
            description: 'Snicksnack can take the Hide action for 0 action points.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 1, max: 3 },
        silver: { min: 5, max: 15 },
        copper: { min: 10, max: 30 }
      },
      items: [
        {
          itemId: 'goblin-rusty-dagger',
          dropChance: 75,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'goblin-ear',
          dropChance: 90,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'leather-scraps',
          dropChance: 60,
          quantity: { min: 1, max: 3 }
        },
        {
          name: "Rubber Chicken",
          type: "trinket",
          quality: "common",
          dropChance: 90,
          iconId: "inv_misc_food_chicken_drumstick_01",
          quantity: { min: 1, max: 3 },
          description: "A squeaky rubber chicken that makes an annoying noise when squeezed."
        },
        {
          name: "Prankster's Dagger",
          type: "weapon",
          subtype: "dagger",
          quality: "uncommon",
          dropChance: 40,
          iconId: "inv_weapon_shortblade_05",
          quantity: { min: 1, max: 1 },
          description: "A well-balanced dagger with a hidden compartment in the hilt that can spray water."
        },
        {
          name: "Smoke Bomb",
          type: "consumable",
          quality: "common",
          dropChance: 75,
          iconId: "spell_shadow_shadowfury",
          quantity: { min: 1, max: 2 },
          description: "A small clay ball that creates a cloud of smoke when thrown."
        }
      ]
    }
  },
  {
    id: 'gigglegut-explosive',
    name: 'Gigglegut the Explosive',
    description: 'A pyromaniac goblin who laughs maniacally when things go boom. His eyebrows are permanently singed, and his clothing is covered in scorch marks from countless "experiments."',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'explosive', 'unstable', 'pyromaniac'],
    tokenIcon: 'inv_misc_bomb_05',
    tokenBorder: '#FF5722',
    stats: {
      strength: 7,
      agility: 15,
      constitution: 9,
      intelligence: 11,
      spirit: 6,
      charisma: 10,
      maxHp: 30,
      currentHp: 30,
      maxMana: 15,
      currentMana: 15,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 12,
      initiative: 4,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '2',
      skills: {
        investigation: 'proficient',
        perception: 'expert'
      }
    },
    resistances: {
      fire: 'resistant'
    },
    vulnerabilities: {
      cold: 'exposed'
    },
    abilities: [
      {
        name: 'Bomb Toss',
        description: 'Gigglegut throws a small explosive device that explodes on impact.',
        type: 'ranged',
        icon: 'inv_misc_bomb_02',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 0,
          damageType: 'fire'
        },
        range: 30,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '2d6'
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 10
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 13,
            success: 'half'
          }
        ]
      },
      {
        name: 'Sticky Bomb',
        description: 'Gigglegut throws a bomb that sticks to the target, exploding after a short delay.',
        type: 'ranged',
        icon: 'inv_misc_bomb_04',
        damage: {
          diceCount: 3,
          diceType: 6,
          bonus: 0,
          damageType: 'fire'
        },
        range: 20,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '3d6',
            delay: 1
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 14,
            onFail: {
              type: 'CONDITION',
              condition: 'restrained',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Maniacal Laughter',
        description: 'Gigglegut breaks into uncontrollable laughter, unnerving nearby enemies.',
        type: 'special',
        icon: 'ability_laughingskull',
        range: 15,
        actionPointCost: 2,
        cooldown: 4,
        effects: [
          {
            type: 'SAVE',
            attribute: 'spirit',
            dc: 12,
            onFail: {
              type: 'CONDITION',
              condition: 'frightened',
              duration: 1
            }
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 15
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 2, max: 5 },
        silver: { min: 10, max: 20 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'goblin-ear',
          dropChance: 100,
          quantity: { min: 1, max: 2 }
        },
        {
          itemId: 'healing-herb',
          dropChance: 50,
          quantity: { min: 1, max: 2 }
        },
        {
          name: "Unstable Bomb",
          type: "consumable",
          quality: "uncommon",
          dropChance: 80,
          iconId: "inv_misc_bomb_02",
          quantity: { min: 1, max: 3 },
          description: "A volatile explosive that deals 3d6 fire damage in a 10-foot radius. Agility save DC 13 for half damage."
        },
        {
          name: "Fireproof Gloves",
          type: "armor",
          subtype: "hands",
          quality: "uncommon",
          dropChance: 45,
          iconId: "inv_gauntlets_04",
          quantity: { min: 1, max: 1 },
          description: "Thick leather gloves that provide resistance to fire damage."
        },
        {
          name: "Explosive Powder",
          type: "material",
          quality: "common",
          dropChance: 90,
          iconId: "inv_misc_dust_01",
          quantity: { min: 2, max: 5 },
          description: "A volatile powder used in crafting explosives."
        }
      ]
    }
  },
  {
    id: 'wobblestick-unbalanced',
    name: 'Wobblestick the Unbalanced',
    description: 'A goblin shaman who can never quite get his spells right. His staff is crooked, his robes are mismatched, and his spells often have unexpected side effects that surprise both enemies and allies.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'shaman', 'clumsy', 'spellcaster'],
    tokenIcon: 'inv_staff_13',
    tokenBorder: '#2196F3',
    stats: {
      strength: 6,
      agility: 10,
      constitution: 8,
      intelligence: 14,
      spirit: 12,
      charisma: 9,
      maxHp: 25,
      currentHp: 25,
      maxMana: 40,
      currentMana: 40,
      maxActionPoints: 3,
      currentActionPoints: 3,
      armor: 11,
      initiative: 2,
      speed: 25,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '2'
    },
    resistances: {
      force: 'resistant',
      psychic: 'immune'
    },
    vulnerabilities: {
      bludgeoning: 'vulnerable',
      thunder: 'exposed'
    },
    abilities: [
      {
        name: 'Wobbling Bolt',
        description: 'Wobblestick fires an unstable bolt of magical energy that zigzags unpredictably.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 2,
        icon: 'spell_arcane_arcane01',
        damage: {
          diceCount: 2,
          diceType: 8,
          bonus: 0,
          damageType: 'arcane'
        },
        range: 60,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'arcane',
            formula: '2d8'
          },
          {
            type: 'SPECIAL',
            description: 'On a natural 1 attack roll, the bolt hits a random target within 20 feet of the original target.'
          }
        ]
      },
      {
        name: 'Chaotic Polymorph',
        description: 'Wobblestick attempts to transform the target into a harmless creature, but the spell is unpredictable.',
        type: 'spell',
        spellType: 'TRANSMUTATION',
        level: 3,
        icon: 'spell_nature_polymorph',
        range: 30,
        actionPointCost: 3,
        cooldown: 4,
        effects: [
          {
            type: 'SAVE',
            attribute: 'spirit',
            dc: 14,
            onFail: {
              type: 'CONDITION',
              condition: 'polymorphed',
              duration: 2
            }
          },
          {
            type: 'SPECIAL',
            description: 'Roll 1d6: 1-3: Target becomes a chicken, 4-5: Target becomes a frog, 6: Target becomes a sheep.'
          }
        ]
      },
      {
        name: 'Healing Mishap',
        description: 'Wobblestick attempts to heal an ally, but the spell has unpredictable side effects.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 2,
        icon: 'spell_holy_healingaura',
        range: 30,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'HEALING',
            formula: '2d8+2',
            target: 'ally'
          },
          {
            type: 'SPECIAL',
            description: 'Roll 1d6: 1: Target also gains 10 temporary HP, 2: Target glows brightly for 1 minute, 3: Target floats 1 foot off the ground for 1 minute, 4: Target\'s voice becomes high-pitched for 1 minute, 5: Target\'s hair changes color, 6: Target hiccups uncontrollably for 1 minute.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 3, max: 8 },
        silver: { min: 5, max: 15 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'mana-crystal-shard',
          dropChance: 75,
          quantity: { min: 1, max: 2 }
        },
        {
          itemId: 'healing-herb',
          dropChance: 100,
          quantity: { min: 2, max: 4 }
        },
        {
          name: "Wobblestick's Staff",
          type: "weapon",
          subtype: "staff",
          quality: "uncommon",
          dropChance: 60,
          iconId: "inv_staff_13",
          quantity: { min: 1, max: 1 },
          description: "A crooked staff that enhances spellcasting but occasionally causes spells to have minor random effects."
        },
        {
          name: "Potion of Random Effect",
          type: "consumable",
          subtype: "potion",
          quality: "uncommon",
          dropChance: 75,
          iconId: "inv_potion_27",
          quantity: { min: 1, max: 3 },
          description: "A swirling potion that produces a different magical effect each time it's consumed."
        },
        {
          name: "Chaotic Spellbook",
          type: "quest",
          quality: "rare",
          dropChance: 40,
          iconId: "inv_misc_book_07",
          quantity: { min: 1, max: 1 },
          description: "A spellbook filled with hastily scribbled notes and unpredictable magical formulas."
        },
        {
          name: "Unstable Mana Crystal",
          type: "material",
          quality: "uncommon",
          dropChance: 80,
          iconId: "inv_misc_gem_sapphire_02",
          quantity: { min: 1, max: 3 },
          description: "A crystal that pulses with chaotic magical energy, useful for crafting unpredictable magical items."
        }
      ]
    }
  },
  {
    id: 'grubfingers-collector',
    name: 'Grubfingers the Collector',
    description: 'A goblin who hoards shiny objects and useless trinkets. His pockets are always bulging with random items, and he can often be found sorting through his collection, muttering "my precious" to particularly shiny baubles.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'hoarder', 'greedy', 'collector'],
    tokenIcon: 'inv_misc_gem_pearl_03',
    tokenBorder: '#FFC107',
    stats: {
      strength: 9,
      agility: 13,
      constitution: 11,
      intelligence: 10,
      spirit: 7,
      charisma: 8,
      maxHp: 40,
      currentHp: 40,
      maxMana: 10,
      currentMana: 10,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armor: 14,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '1'
    },
    resistances: {
      poison: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Dagger Slash',
        description: 'Grubfingers slashes with a surprisingly sharp dagger.',
        type: 'melee',
        icon: 'inv_weapon_shortblade_01',
        damage: {
          diceCount: 1,
          diceType: 6,
          bonus: 1,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 2,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d6+1'
          }
        ]
      },
      {
        name: 'Pocket Sand',
        description: 'Grubfingers throws sand from his pockets into an enemy\'s eyes.',
        type: 'special',
        icon: 'inv_misc_dust_02',
        range: 10,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'SAVE',
            attribute: 'constitution',
            dc: 12,
            onFail: {
              type: 'CONDITION',
              condition: 'blinded',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Trinket Toss',
        description: 'Grubfingers throws a random trinket from his collection, causing unpredictable effects.',
        type: 'ranged',
        icon: 'inv_misc_gem_variety_01',
        range: 20,
        actionPointCost: 3,
        cooldown: 4,
        effects: [
          {
            type: 'SPECIAL',
            description: 'Roll 1d6: 1: Deals 2d4 bludgeoning damage, 2: Creates a cloud of smoke in a 10-foot radius, 3: Makes a loud noise, forcing a DC 12 Spirit save or be frightened for 1 round, 4: Releases a foul odor, forcing a DC 12 Constitution save or be poisoned for 1 round, 5: Explodes in a flash of light, forcing a DC 12 Agility save or be blinded for 1 round, 6: Bounces harmlessly off the target.'
          }
        ]
      },
      {
        name: 'Magpie Instinct',
        description: 'Grubfingers has an uncanny ability to spot valuable items and quickly snatch them.',
        type: 'special',
        icon: 'ability_rogue_pickpocket',
        range: 5,
        actionPointCost: 2,
        cooldown: 5,
        effects: [
          {
            type: 'SPECIAL',
            description: 'Grubfingers attempts to steal a small item from the target. The target must make a DC 14 Perception check to notice.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 5, max: 15 },
        silver: { min: 20, max: 50 },
        copper: { min: 50, max: 100 }
      },
      items: [
        {
          name: "Grubfingers' Collection",
          type: "container",
          quality: "uncommon",
          dropChance: 100,
          iconId: "inv_box_03",
          quantity: { min: 1, max: 1 },
          description: "A small sack filled with various trinkets and shiny objects collected by Grubfingers.",
          containerContents: [
            {
              name: "Assorted Gems",
              type: "material",
              quality: "uncommon",
              iconId: "inv_misc_gem_variety_01",
              quantity: { min: 2, max: 5 },
              description: "A collection of small, semi-precious gems."
            },
            {
              name: "Silver Locket",
              type: "accessory",
              subtype: "necklace",
              quality: "uncommon",
              iconId: "inv_jewelry_necklace_07",
              quantity: { min: 1, max: 1 },
              description: "A tarnished silver locket containing a small portrait of a human woman."
            },
            {
              name: "Stolen Coins",
              type: "currency",
              quality: "common",
              iconId: "inv_misc_coin_02",
              value: { gold: 10, silver: 25 },
              description: "A small pile of coins stolen from unfortunate travelers."
            }
          ]
        },
        {
          name: "Magpie's Dagger",
          type: "weapon",
          subtype: "dagger",
          quality: "uncommon",
          dropChance: 60,
          iconId: "inv_weapon_shortblade_02",
          quantity: { min: 1, max: 1 },
          description: "A dagger with a hilt decorated with small shiny stones. It seems to guide its wielder toward valuable objects."
        },
        {
          name: "Shiny Trinket",
          type: "trinket",
          quality: "common",
          dropChance: 90,
          iconId: "inv_misc_gem_pearl_03",
          quantity: { min: 2, max: 6 },
          description: "A random shiny object with no practical value but might be worth something to the right collector."
        }
      ]
    }
  },
  {
    id: 'frostbite-yeti',
    name: 'Frostbite the Yeti',
    description: 'A massive, white-furred yeti with ice crystals forming on its fur. Its breath freezes in the air, and its footsteps leave frost patterns on the ground. Despite its fearsome appearance, it has a curious and somewhat playful nature.',
    type: CREATURE_TYPES.MONSTROSITY,
    size: CREATURE_SIZES.LARGE,
    tags: ['yeti', 'ice', 'mountain', 'beast'],
    tokenIcon: 'inv_misc_head_wendigo_01',
    tokenBorder: '#00BFFF',
    stats: {
      strength: 18,
      agility: 13,
      constitution: 16,
      intelligence: 8,
      spirit: 12,
      charisma: 7,
      maxHp: 115,
      currentHp: 115,
      maxMana: 30,
      currentMana: 30,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 15,
      initiative: 1,
      speed: 40,
      flying: 0,
      swimming: 20,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '5',
      experiencePoints: 1800
    },
    resistances: {
      frost: 75,
      physical: 25
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Crushing Hug',
        description: 'Frostbite grabs a creature and squeezes it in a bone-crushing embrace.',
        type: 'melee',
        icon: 'ability_warrior_warbringer',
        damage: {
          diceCount: 2,
          diceType: 8,
          bonus: 4,
          damageType: 'bludgeoning'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '2d8+4'
          },
          {
            type: 'SAVE',
            attribute: 'strength',
            dc: 15,
            onFail: {
              type: 'CONDITION',
              condition: 'grappled',
              duration: 2
            }
          }
        ]
      },
      {
        name: 'Frost Breath',
        description: 'Frostbite exhales a cone of freezing air, potentially freezing creatures in place.',
        type: 'special',
        icon: 'spell_frost_arcticwinds',
        damage: {
          diceCount: 3,
          diceType: 6,
          bonus: 0,
          damageType: 'frost'
        },
        range: 15,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'frost',
            formula: '3d6'
          },
          {
            type: 'SAVE',
            attribute: 'constitution',
            dc: 14,
            success: 'half',
            onFail: {
              type: 'CONDITION',
              condition: 'restrained',
              duration: 1
            }
          },
          {
            type: 'AREA',
            shape: 'cone',
            size: 15
          }
        ]
      },
      {
        name: 'Snow Camouflage',
        description: 'Frostbite blends into snowy terrain, becoming nearly invisible.',
        type: 'special',
        icon: 'ability_stealth',
        range: 0,
        actionPointCost: 2,
        cooldown: 4,
        effects: [
          {
            type: 'CONDITION',
            condition: 'invisible',
            duration: 2,
            special: 'Only works in snowy terrain. Ends if Frostbite attacks or moves more than 10 feet.'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 10, max: 30 },
        silver: { min: 50, max: 100 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'wolf-pelt',
          dropChance: 100,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'wolf-fang',
          dropChance: 75,
          quantity: { min: 2, max: 5 }
        },
        {
          name: "Yeti Fur",
          type: "material",
          quality: "uncommon",
          dropChance: 100,
          iconId: "inv_misc_pelt_wolf_01",
          quantity: { min: 2, max: 5 },
          description: "Thick, white fur that provides excellent insulation against cold."
        },
        {
          name: "Frost Essence",
          type: "material",
          quality: "rare",
          dropChance: 60,
          iconId: "spell_frost_frostbolt02",
          quantity: { min: 1, max: 3 },
          description: "A crystalline essence that radiates cold, useful for crafting frost-based items."
        },
        {
          name: "Yeti Claw",
          type: "material",
          quality: "uncommon",
          dropChance: 75,
          iconId: "inv_misc_bone_06",
          quantity: { min: 1, max: 4 },
          description: "A large, sharp claw that can be crafted into weapons or tools."
        },
        {
          name: "Frozen Heart",
          type: "quest",
          quality: "rare",
          dropChance: 25,
          iconId: "inv_misc_gem_crystal_01",
          quantity: { min: 1, max: 1 },
          description: "A heart of pure ice that never melts, sought after by alchemists and mages."
        }
      ]
    }
  },
  {
    id: 'thornroot-treant',
    name: 'Thornroot the Treant',
    description: 'An ancient treant with bark as hard as stone and branches covered in vicious thorns. Moss and small flowering plants grow from its body, and birds nest in its branches. Despite its fearsome appearance, it is a guardian of the forest and only attacks those who threaten its domain.',
    type: CREATURE_TYPES.PLANT,
    size: CREATURE_SIZES.HUGE,
    tags: ['treant', 'forest', 'guardian', 'ancient'],
    tokenIcon: 'ability_druid_treeoflife',
    tokenBorder: '#228B22',
    stats: {
      strength: 20,
      agility: 8,
      constitution: 18,
      intelligence: 12,
      spirit: 16,
      charisma: 12,
      maxHp: 200,
      currentHp: 200,
      maxMana: 60,
      currentMana: 60,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armor: 18,
      initiative: 0,
      speed: 20,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 0,
      challengeRating: '8',
      experiencePoints: 3900
    },
    resistances: {
      physical: 50,
      nature: 75
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        name: 'Slam',
        description: 'Thornroot slams its massive branch-like arms into enemies.',
        type: 'melee',
        icon: 'ability_warrior_shieldbreak',
        damage: {
          diceCount: 3,
          diceType: 8,
          bonus: 5,
          damageType: 'bludgeoning'
        },
        range: 10,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '3d8+5'
          },
          {
            type: 'SAVE',
            attribute: 'strength',
            dc: 16,
            onFail: {
              type: 'CONDITION',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Thorn Spray',
        description: 'Thornroot launches a spray of razor-sharp thorns in a wide arc.',
        type: 'ranged',
        icon: 'inv_misc_thornnecklace',
        damage: {
          diceCount: 4,
          diceType: 6,
          bonus: 0,
          damageType: 'piercing'
        },
        range: 30,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'piercing',
            formula: '4d6'
          },
          {
            type: 'AREA',
            shape: 'cone',
            size: 30
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 15,
            success: 'half'
          }
        ]
      },
      {
        name: 'Entangling Roots',
        description: 'Thornroot causes roots to burst from the ground, entangling creatures in the area.',
        type: 'spell',
        spellType: 'TRANSMUTATION',
        level: 4,
        icon: 'spell_nature_stranglevines',
        range: 60,
        actionPointCost: 3,
        cooldown: 4,
        effects: [
          {
            type: 'SAVE',
            attribute: 'strength',
            dc: 15,
            onFail: {
              type: 'CONDITION',
              condition: 'restrained',
              duration: 3
            }
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 20
          }
        ]
      },
      {
        name: 'Regeneration',
        description: 'Thornroot draws upon the energy of the forest to heal its wounds.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 3,
        icon: 'ability_druid_flourish',
        range: 0,
        actionPointCost: 3,
        cooldown: 5,
        effects: [
          {
            type: 'HEALING',
            formula: '4d8+5',
            target: 'self'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 50, max: 100 },
        silver: { min: 100, max: 200 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          name: "Ancient Heartwood",
          type: "material",
          quality: "rare",
          dropChance: 100,
          iconId: "inv_misc_herb_01",
          quantity: { min: 2, max: 4 },
          description: "Wood from the heart of an ancient treant, prized by craftsmen for its durability and magical properties."
        },
        {
          name: "Thornroot Seed",
          type: "quest",
          quality: "epic",
          dropChance: 20,
          iconId: "inv_misc_food_wheat_01",
          quantity: { min: 1, max: 1 },
          description: "A seed from an ancient treant that pulses with natural energy. Could grow into a new treant if planted in the right conditions."
        },
        {
          name: "Staff of the Forest Guardian",
          type: "weapon",
          subtype: "staff",
          quality: "rare",
          dropChance: 40,
          iconId: "inv_staff_2h_draenorquest_b_01",
          quantity: { min: 1, max: 1 },
          baseStats: { spirit: 2 },
          weaponStats: {
            baseDamage: {
              diceCount: 1,
              diceType: 6,
              damageType: "nature",
              bonusDamage: 0
            }
          },
          description: "A staff made from the branch of an ancient treant, imbued with nature magic."
        },
        {
          name: "Vial of Sap",
          type: "consumable",
          subtype: "potion",
          quality: "uncommon",
          dropChance: 75,
          iconId: "inv_potion_35",
          quantity: { min: 1, max: 3 },
          description: "A vial of golden sap that heals 2d8+2 hit points when consumed."
        }
      ]
    }
  },
  {
    id: 'shadowfang-dire-wolf',
    name: 'Shadowfang the Dire Wolf',
    description: 'A massive black wolf with glowing red eyes and shadowy mist emanating from its fur. Its howl chills the blood, and its bite seems to drain the very life from its victims. Shadowfang leads a pack of smaller shadow wolves and is rumored to be blessed by dark powers.',
    type: CREATURE_TYPES.BEAST,
    size: CREATURE_SIZES.LARGE,
    tags: ['wolf', 'shadow', 'alpha', 'predator'],
    tokenIcon: 'ability_mount_blackdirewolf',
    tokenBorder: '#4B0082',
    stats: {
      strength: 17,
      agility: 15,
      constitution: 15,
      intelligence: 6,
      spirit: 12,
      charisma: 10,
      maxHp: 90,
      currentHp: 90,
      maxMana: 20,
      currentMana: 20,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 14,
      initiative: 3,
      speed: 50,
      flying: 0,
      swimming: 20,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '4',
      experiencePoints: 1100
    },
    resistances: {
      shadow: 50,
      physical: 25
    },
    vulnerabilities: {
      holy: 25
    },
    abilities: [
      {
        name: 'Shadow Bite',
        description: 'Shadowfang bites with jaws infused with shadow energy, draining life force.',
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
            type: 'DAMAGE',
            damageType: 'shadow',
            formula: '1d6'
          },
          {
            type: 'HEALING',
            formula: '1d6',
            target: 'self'
          }
        ]
      },
      {
        name: 'Pounce',
        description: 'Shadowfang leaps at a target, knocking them prone if they fail to dodge.',
        type: 'melee',
        icon: 'ability_hunter_pet_wolf',
        damage: {
          diceCount: 2,
          diceType: 8,
          bonus: 3,
          damageType: 'bludgeoning'
        },
        range: 20,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '2d8+3'
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 15,
            onFail: {
              type: 'CONDITION',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      },
      {
        name: 'Howl of Terror',
        description: 'Shadowfang lets out a bone-chilling howl that strikes fear into the hearts of enemies.',
        type: 'special',
        icon: 'ability_warrior_warcry',
        range: 30,
        actionPointCost: 3,
        cooldown: 5,
        effects: [
          {
            type: 'SAVE',
            attribute: 'spirit',
            dc: 14,
            onFail: {
              type: 'CONDITION',
              condition: 'frightened',
              duration: 2
            }
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 30
          }
        ]
      },
      {
        name: 'Shadow Meld',
        description: 'Shadowfang melts into the shadows, becoming difficult to detect.',
        type: 'special',
        icon: 'ability_rogue_shadowstep',
        range: 0,
        actionPointCost: 2,
        cooldown: 4,
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'stealth',
            value: 10,
            duration: 3
          },
          {
            type: 'RESISTANCE',
            damageTypes: ['physical'],
            value: 25,
            duration: 3
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 5, max: 15 },
        silver: { min: 20, max: 50 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'ancient-heartwood',
          dropChance: 100,
          quantity: { min: 2, max: 4 }
        },
        {
          itemId: 'thornroot-seed',
          dropChance: 20,
          quantity: { min: 1, max: 1 }
        },
        {
          name: "Shadowfang Pelt",
          type: "material",
          quality: "rare",
          dropChance: 100,
          iconId: "inv_misc_pelt_wolf_ruin_black",
          quantity: { min: 1, max: 1 },
          description: "A pitch-black pelt that seems to absorb light. Occasionally emits wisps of shadow energy."
        },
        {
          name: "Shadow Essence",
          type: "material",
          quality: "rare",
          dropChance: 50,
          iconId: "spell_shadow_haunting",
          quantity: { min: 1, max: 3 },
          description: "A swirling dark essence that can be used to craft shadow-infused items."
        },
        {
          name: "Dire Wolf Fang",
          type: "material",
          quality: "uncommon",
          dropChance: 80,
          iconId: "inv_misc_bone_09",
          quantity: { min: 2, max: 5 },
          description: "A large, sharp fang from a dire wolf, useful for crafting weapons and jewelry."
        },
        {
          name: "Cloak of Shadows",
          type: "armor",
          subtype: "back",
          quality: "rare",
          dropChance: 30,
          iconId: "inv_misc_cape_20",
          quantity: { min: 1, max: 1 },
          baseStats: { agility: 1 },
          armorStats: {
            armor: 1,
            type: "light"
          },
          description: "A cloak made from the pelt of a shadow wolf that grants the wearer enhanced stealth abilities."
        }
      ]
    }
  },
  {
    id: 'grommash-orc-warlord',
    name: 'Grommash the Orc Warlord',
    description: 'A battle-hardened orc warlord with scars covering his green skin. His eyes burn with a fierce determination and his massive axe has claimed countless lives.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['orc', 'warlord', 'warrior', 'leader'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#8B0000',
    stats: {
      strength: 18,
      agility: 14,
      constitution: 16,
      intelligence: 12,
      spirit: 11,
      charisma: 16,
      maxHp: 150,
      currentHp: 150,
      maxMana: 30,
      currentMana: 30,
      maxActionPoints: 6,
      currentActionPoints: 6,
      armor: 17,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '5',
      experiencePoints: 1800,
      proficiencyBonus: 3,
      savingThrows: {
        strength: true,
        constitution: true
      },
      skills: {
        athletics: 'proficient',
        intimidation: 'expert',
        perception: 'proficient'
      }
    },
    resistances: {
      poison: 25,
      physical: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Cleave',
        description: 'A powerful swing that can hit multiple enemies.',
        type: 'melee',
        icon: 'ability_warrior_cleave',
        damage: {
          diceCount: 2,
          diceType: 8,
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
            formula: '2d8+4'
          },
          {
            type: 'AREA',
            shape: 'cone',
            size: 10
          }
        ]
      },
      {
        name: 'Battle Command',
        description: 'Grommash lets out a mighty war cry, inspiring his allies to fight harder.',
        type: 'special',
        icon: 'ability_warrior_battleshout',
        range: 30,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'BUFF',
            target: 'allies',
            stat: 'strength',
            value: 2,
            duration: 3
          }
        ]
      },
      {
        name: 'Bloodthirst',
        description: 'A frenzied attack that heals Grommash for a portion of the damage dealt.',
        type: 'melee',
        icon: 'spell_nature_bloodlust',
        damage: {
          diceCount: 1,
          diceType: 12,
          bonus: 4,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 4,
        cooldown: 2,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d12+4'
          },
          {
            type: 'HEALING',
            formula: '1d6+2',
            target: 'self'
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 15, max: 30 },
        silver: { min: 20, max: 50 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'orcish-greataxe',
          dropChance: 85,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'warlord-trophy-necklace',
          dropChance: 70,
          quantity: { min: 1, max: 1 }
        },
        {
          name: "Grommash's Battle Axe",
          type: "weapon",
          subtype: "axe",
          quality: "rare",
          dropChance: 100,
          iconId: "inv_axe_09",
          quantity: { min: 1, max: 1 },
          baseStats: { strength: 2 },
          weaponStats: {
            baseDamage: {
              diceCount: 1,
              diceType: 12,
              damageType: "slashing",
              bonusDamage: 0
            }
          },
          description: "A massive battle axe with orcish runes etched into the blade."
        },
        {
          name: "Warlord's Medallion",
          type: "accessory",
          subtype: "necklace",
          quality: "uncommon",
          dropChance: 75,
          iconId: "inv_jewelry_necklace_21",
          quantity: { min: 1, max: 1 },
          baseStats: { charisma: 1, constitution: 1 },
          description: "A medallion signifying leadership among the orc clans."
        },
        {
          name: "Potion of Orcish Strength",
          type: "consumable",
          subtype: "potion",
          quality: "uncommon",
          dropChance: 50,
          iconId: "inv_potion_44",
          quantity: { min: 1, max: 2 },
          utilityStats: {
            duration: { value: 1, type: "HOUR" },
            effect: "Increases strength by 2 for 1 hour."
          },
          description: "A bubbling green potion that temporarily grants orcish strength."
        }
      ]
    }
  },
  {
    id: 'lyra-elven-archmage',
    name: 'Lyra the Elven Archmage',
    description: 'An ancient elven mage with silver hair and piercing blue eyes. Her robes shimmer with arcane energy, and she moves with the grace of centuries of experience.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['elf', 'mage', 'archmage', 'spellcaster'],
    tokenIcon: 'inv_staff_13',
    tokenBorder: '#4169E1',
    stats: {
      strength: 9,
      agility: 16,
      constitution: 12,
      intelligence: 20,
      spirit: 15,
      charisma: 16,
      maxHp: 120,
      currentHp: 120,
      maxMana: 150,
      currentMana: 150,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 15,
      initiative: 3,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '12',
      experiencePoints: 8400,
      proficiencyBonus: 4,
      savingThrows: {
        intelligence: true,
        spirit: true,
        charisma: true
      },
      skills: {
        arcana: 'expert',
        history: 'proficient',
        insight: 'proficient',
        perception: 'proficient'
      }
    },
    resistances: {
      fire: 25,
      frost: 25,
      arcane: 50
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Arcane Blast',
        description: 'A powerful blast of pure arcane energy.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 5,
        icon: 'spell_arcane_blast',
        damage: {
          diceCount: 4,
          diceType: 10,
          bonus: 5,
          damageType: 'arcane'
        },
        range: 60,
        actionPointCost: 3,
        cooldown: 0,
        castingConfig: {
          castTime: '1 action'
        },
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'arcane',
            formula: '4d10+5'
          }
        ]
      },
      {
        name: 'Time Warp',
        description: 'Lyra bends the fabric of time, allowing herself to take an additional action.',
        type: 'spell',
        spellType: 'TRANSMUTATION',
        level: 7,
        icon: 'ability_mage_timewarp',
        range: 0,
        actionPointCost: 4,
        cooldown: 5,
        castingConfig: {
          castTime: '1 action'
        },
        effects: [
          {
            type: 'SPECIAL',
            description: 'Grants an additional action this turn.'
          }
        ]
      },
      {
        name: 'Prismatic Shield',
        description: 'A shimmering shield of magical energy that protects against all types of damage.',
        type: 'spell',
        spellType: 'ABJURATION',
        level: 6,
        icon: 'spell_holy_magicalsentry',
        range: 0,
        actionPointCost: 3,
        cooldown: 3,
        castingConfig: {
          castTime: '1 action'
        },
        durationConfig: {
          duration: 3,
          durationType: 'ROUNDS'
        },
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'armor',
            value: 5,
            duration: 3
          },
          {
            type: 'RESISTANCE',
            damageTypes: ['fire', 'frost', 'arcane', 'shadow', 'holy'],
            value: 25,
            duration: 3
          }
        ]
      },
      {
        name: 'Chain Lightning',
        description: 'A bolt of lightning that arcs from one target to another.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 6,
        icon: 'spell_nature_chainlightning',
        damage: {
          diceCount: 3,
          diceType: 10,
          bonus: 0,
          damageType: 'nature'
        },
        range: 50,
        actionPointCost: 4,
        cooldown: 2,
        castingConfig: {
          castTime: '1 action'
        },
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'nature',
            formula: '3d10'
          },
          {
            type: 'CHAIN',
            targets: 3,
            reduction: 0.5
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 50, max: 100 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'staff-of-the-archmage',
          dropChance: 50,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'archmages-spellbook',
          dropChance: 75,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'arcane-focus-crystal',
          dropChance: 90,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'mage-robe',
          dropChance: 80,
          quantity: { min: 1, max: 1 }
        },
        {
          name: "Staff of the Archmage",
          type: "weapon",
          subtype: "staff",
          quality: "epic",
          dropChance: 100,
          iconId: "inv_staff_17",
          quantity: { min: 1, max: 1 },
          baseStats: { intelligence: 3, spirit: 2 },
          weaponStats: {
            baseDamage: {
              diceCount: 1,
              diceType: 6,
              damageType: "arcane",
              bonusDamage: 0
            }
          },
          combatStats: {
            spellDamage: {
              types: {
                arcane: { value: 5 },
                fire: { value: 3 },
                frost: { value: 3 }
              }
            }
          },
          description: "An ancient staff crackling with arcane energy, passed down through generations of elven archmages."
        },
        {
          name: "Archmage's Spellbook",
          type: "quest",
          quality: "rare",
          dropChance: 100,
          iconId: "inv_misc_book_09",
          quantity: { min: 1, max: 1 },
          description: "A spellbook containing powerful arcane secrets and forgotten spells."
        },
        {
          name: "Mana Crystal",
          type: "material",
          quality: "uncommon",
          dropChance: 75,
          iconId: "inv_enchant_shardbrilliantsmall",
          quantity: { min: 2, max: 5 },
          description: "A crystal infused with pure mana energy, used in crafting magical items."
        },
        {
          name: "Elixir of Greater Intellect",
          type: "consumable",
          subtype: "elixir",
          quality: "rare",
          dropChance: 50,
          iconId: "inv_potion_91",
          quantity: { min: 1, max: 2 },
          utilityStats: {
            duration: { value: 1, type: "HOUR" },
            effect: "Increases intelligence by 3 for 1 hour."
          },
          description: "A shimmering blue elixir that temporarily enhances mental acuity."
        }
      ]
    }
  },
  {
    id: 'goblin-warrior',
    name: 'Goblin Warrior',
    description: 'A small, nimble goblin armed with crude weapons and a mischievous grin.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.SMALL,
    tags: ['goblin', 'warrior', 'evil'],
    tokenIcon: 'inv_misc_head_orc_01',
    tokenBorder: '#4CAF50',
    stats: {
      strength: 8,
      agility: 14,
      constitution: 10,
      intelligence: 8,
      spirit: 8,
      charisma: 8,
      maxHp: 35,
      currentHp: 35,
      maxMana: 10,
      currentMana: 10,
      maxActionPoints: 4,
      currentActionPoints: 4,
      armor: 13,
      initiative: 2,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60
    },
    resistances: {
      poison: 50
    },
    vulnerabilities: {
      fire: 50
    },
    abilities: [
      {
        id: 'goblin-stab',
        name: 'Stab',
        description: 'A quick stab with a rusty dagger.',
        damage: '1d6+2',
        damageType: 'piercing',
        apCost: 2
      },
      {
        id: 'goblin-flee',
        name: 'Nimble Escape',
        description: 'The goblin can take the Disengage or Hide action for only 1 action point on each of its turns.',
        apCost: 1
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 0, max: 2 },
        silver: { min: 0, max: 10 },
        copper: { min: 5, max: 20 }
      },
      items: [
        {
          itemId: 'goblin-rusty-dagger',
          dropChance: 75,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'goblin-ear',
          dropChance: 90,
          quantity: { min: 1, max: 2 }
        }
      ]
    }
  },
  {
    id: 'dire-wolf',
    name: 'Dire Wolf',
    description: 'A massive wolf with matted fur and glowing eyes. It stands nearly as tall as a human.',
    type: CREATURE_TYPES.BEAST,
    size: CREATURE_SIZES.LARGE,
    tags: ['wolf', 'predator'],
    tokenIcon: 'ability_mount_whitetiger',
    tokenBorder: '#795548',
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
      armor: 14,
      initiative: 2,
      speed: 50,
      flying: 0,
      swimming: 20,
      sightRange: 60,
      darkvision: 30
    },
    resistances: {
      cold: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        id: 'wolf-bite',
        name: 'Bite',
        description: 'A powerful bite that can knock enemies prone.',
        damage: '2d6+3',
        damageType: 'piercing',
        apCost: 3,
        effects: [
          {
            type: 'save',
            attribute: 'strength',
            dc: 13,
            onFail: {
              type: 'condition',
              condition: 'prone',
              duration: 1
            }
          }
        ]
      },
      {
        id: 'wolf-howl',
        name: 'Terrifying Howl',
        description: 'A bone-chilling howl that strikes fear into nearby enemies.',
        apCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'save',
            attribute: 'spirit',
            dc: 12,
            onFail: {
              type: 'condition',
              condition: 'frightened',
              duration: 2
            }
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 0, max: 0 },
        silver: { min: 0, max: 0 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'wolf-pelt',
          dropChance: 100,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'wolf-fang',
          dropChance: 75,
          quantity: { min: 1, max: 4 }
        }
      ]
    }
  },
  {
    id: 'thorgrim-dwarf-runesmith',
    name: 'Thorgrim the Dwarf Runesmith',
    description: 'A stout dwarf with a braided beard adorned with golden rings. His arms are covered in glowing runes, and he carries a massive runic hammer.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['dwarf', 'runesmith', 'craftsman', 'warrior'],
    tokenIcon: 'inv_hammer_19',
    tokenBorder: '#CD7F32',
    stats: {
      strength: 16,
      agility: 10,
      constitution: 18,
      intelligence: 14,
      spirit: 13,
      charisma: 10,
      maxHp: 180,
      currentHp: 180,
      maxMana: 40,
      currentMana: 40,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 18,
      initiative: 1,
      speed: 25,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 120,
      challengeRating: '7',
      experiencePoints: 2900,
      proficiencyBonus: 3,
      savingThrows: {
        strength: true,
        constitution: true
      },
      skills: {
        athletics: 'proficient',
        history: 'proficient',
        arcana: 'proficient',
        perception: 'proficient'
      }
    },
    resistances: {
      fire: 25,
      poison: 50,
      physical: 25
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Runic Hammer',
        description: 'A powerful blow with a hammer inscribed with ancient dwarven runes.',
        type: 'melee',
        icon: 'inv_hammer_19',
        damage: {
          diceCount: 2,
          diceType: 6,
          bonus: 3,
          damageType: 'bludgeoning'
        },
        range: 5,
        actionPointCost: 3,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'bludgeoning',
            formula: '2d6+3'
          }
        ]
      },
      {
        name: 'Rune of Shielding',
        description: 'Thorgrim activates a defensive rune, creating a barrier of magical force.',
        type: 'special',
        icon: 'spell_holy_sealofprotection',
        range: 0,
        actionPointCost: 2,
        cooldown: 3,
        effects: [
          {
            type: 'BUFF',
            target: 'self',
            stat: 'armor',
            value: 3,
            duration: 3
          },
          {
            type: 'RESISTANCE',
            damageTypes: ['physical', 'fire', 'frost', 'arcane'],
            value: 25,
            duration: 3
          }
        ]
      },
      {
        name: 'Rune of Flame',
        description: 'Thorgrim slams his hammer down, activating a fire rune that explodes outward.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 4,
        icon: 'spell_fire_rune',
        damage: {
          diceCount: 3,
          diceType: 8,
          bonus: 0,
          damageType: 'fire'
        },
        range: 15,
        actionPointCost: 4,
        cooldown: 2,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'fire',
            formula: '3d8'
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 15
          }
        ]
      },
      {
        name: 'Ancestral Resilience',
        description: 'Thorgrim calls upon the strength of his ancestors to heal his wounds.',
        type: 'special',
        icon: 'spell_holy_healingaura',
        range: 0,
        actionPointCost: 3,
        cooldown: 4,
        effects: [
          {
            type: 'HEALING',
            formula: '3d8+5',
            target: 'self'
          },
          {
            type: 'BUFF',
            target: 'self',
            stat: 'constitution',
            value: 2,
            duration: 2
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 25, max: 50 },
        silver: { min: 50, max: 100 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'dwarven-hammer',
          dropChance: 80,
          quantity: { min: 1, max: 1 }
        },
        {
          itemId: 'dwarven-ale',
          dropChance: 90,
          quantity: { min: 1, max: 2 }
        },
        {
          itemId: 'iron-ingot',
          dropChance: 60,
          quantity: { min: 1, max: 3 }
        },
        {
          name: "Runesmith's Hammer",
          type: "weapon",
          subtype: "hammer",
          quality: "rare",
          dropChance: 100,
          iconId: "inv_hammer_19",
          quantity: { min: 1, max: 1 },
          baseStats: { strength: 2 },
          weaponStats: {
            baseDamage: {
              diceCount: 1,
              diceType: 10,
              damageType: "bludgeoning",
              bonusDamage: 0
            }
          },
          description: "A masterfully crafted dwarven hammer inscribed with ancient runes of power."
        },
        {
          name: "Dwarven Plate Armor",
          type: "armor",
          subtype: "plate",
          quality: "rare",
          dropChance: 75,
          iconId: "inv_chest_plate04",
          quantity: { min: 1, max: 1 },
          baseStats: { constitution: 1 },
          armorStats: {
            armor: 18,
            type: "heavy"
          },
          description: "Finely crafted plate armor made by dwarven smiths, adorned with runic patterns."
        },
        {
          name: "Runestone",
          type: "material",
          quality: "uncommon",
          dropChance: 100,
          iconId: "inv_misc_rune_01",
          quantity: { min: 2, max: 5 },
          description: "A stone inscribed with dwarven runes, used in crafting magical items."
        },
        {
          name: "Dwarven Ale",
          type: "consumable",
          subtype: "drink",
          quality: "uncommon",
          dropChance: 50,
          iconId: "inv_drink_08",
          quantity: { min: 1, max: 3 },
          utilityStats: {
            duration: { value: 10, type: "MINUTE" },
            effect: "Increases constitution by 2 and grants resistance to poison for 10 minutes."
          },
          description: "A potent dwarven brew that fortifies the body and spirit."
        }
      ]
    }
  },
  {
    id: 'nightscale-dragon-wyrmling',
    name: 'Nightscale the Dragon Wyrmling',
    description: 'A young black dragon with glistening scales and acid dripping from its fangs. Though small for a dragon, its malevolence is already evident in its glowing yellow eyes.',
    type: CREATURE_TYPES.DRAGON,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['dragon', 'black', 'wyrmling', 'acid'],
    tokenIcon: 'inv_misc_head_dragon_black',
    tokenBorder: '#32CD32',
    stats: {
      strength: 15,
      agility: 14,
      constitution: 15,
      intelligence: 12,
      spirit: 11,
      charisma: 15,
      maxHp: 100,
      currentHp: 100,
      maxMana: 60,
      currentMana: 60,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 17,
      initiative: 2,
      speed: 30,
      flying: 60,
      swimming: 30,
      sightRange: 60,
      darkvision: 120,
      challengeRating: '4',
      experiencePoints: 1100,
      proficiencyBonus: 2,
      savingThrows: {
        agility: true,
        constitution: true,
        charisma: true
      },
      skills: {
        perception: 'proficient',
        stealth: 'proficient',
        intimidation: 'proficient'
      }
    },
    resistances: {
      poison: 100
    },
    vulnerabilities: {},
    abilities: [
      {
        name: 'Bite',
        description: 'A vicious bite with sharp teeth.',
        type: 'melee',
        icon: 'ability_racial_cannibalize',
        damage: {
          diceCount: 1,
          diceType: 10,
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
            formula: '1d10+2'
          },
          {
            type: 'DAMAGE',
            damageType: 'poison',
            formula: '1d4'
          }
        ]
      },
      {
        name: 'Claw',
        description: 'A slash with sharp claws.',
        type: 'melee',
        icon: 'ability_druid_lacerate',
        damage: {
          diceCount: 1,
          diceType: 6,
          bonus: 2,
          damageType: 'slashing'
        },
        range: 5,
        actionPointCost: 1,
        cooldown: 0,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'slashing',
            formula: '1d6+2'
          }
        ]
      },
      {
        name: 'Acid Breath',
        description: 'The dragon exhales a line of caustic acid.',
        type: 'spell',
        spellType: 'EVOCATION',
        level: 3,
        icon: 'spell_nature_acid_01',
        damage: {
          diceCount: 5,
          diceType: 8,
          bonus: 0,
          damageType: 'poison'
        },
        range: 30,
        actionPointCost: 4,
        cooldown: 3,
        effects: [
          {
            type: 'DAMAGE',
            damageType: 'poison',
            formula: '5d8'
          },
          {
            type: 'SAVE',
            attribute: 'agility',
            dc: 13,
            success: 'half'
          },
          {
            type: 'AREA',
            shape: 'line',
            size: 30,
            width: 5
          }
        ]
      },
      {
        name: 'Frightful Presence',
        description: 'The dragon exudes an aura of terror, frightening nearby creatures.',
        type: 'special',
        icon: 'ability_warrior_warcry',
        range: 30,
        actionPointCost: 3,
        cooldown: 5,
        effects: [
          {
            type: 'SAVE',
            attribute: 'spirit',
            dc: 13,
            onFail: {
              type: 'CONDITION',
              condition: 'frightened',
              duration: 3
            }
          },
          {
            type: 'AREA',
            shape: 'circle',
            size: 30
          }
        ]
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 20, max: 50 },
        silver: { min: 50, max: 100 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          itemId: 'dragon-scale',
          dropChance: 100,
          quantity: { min: 2, max: 5 }
        },
        {
          itemId: 'dragon-tooth',
          dropChance: 75,
          quantity: { min: 1, max: 3 }
        },
        {
          name: "Acid Gland",
          type: "material",
          quality: "rare",
          dropChance: 50,
          iconId: "inv_potion_24",
          quantity: { min: 1, max: 1 },
          description: "A gland that produces corrosive acid, useful for alchemy."
        },
        {
          name: "Nightscale's Hoard",
          type: "container",
          quality: "uncommon",
          dropChance: 100,
          iconId: "inv_box_01",
          quantity: { min: 1, max: 1 },
          description: "A small collection of treasures gathered by the young dragon.",
          containerContents: [
            {
              name: "Acid-Etched Amulet",
              type: "accessory",
              subtype: "necklace",
              quality: "rare",
              iconId: "inv_jewelry_necklace_11",
              baseStats: { constitution: 1 },
              resistances: { poison: 25 },
              description: "An amulet etched with acid, granting resistance to poison."
            },
            {
              name: "Stolen Coins",
              type: "currency",
              quality: "common",
              iconId: "inv_misc_coin_02",
              value: { gold: 50 },
              description: "A small pile of gold coins stolen from unfortunate travelers."
            }
          ]
        }
      ]
    }
  },
  {
    id: 'fire-elemental',
    name: 'Fire Elemental',
    description: 'A swirling vortex of flame and smoke in a vaguely humanoid shape.',
    type: CREATURE_TYPES.ELEMENTAL,
    size: CREATURE_SIZES.LARGE,
    tags: ['fire', 'elemental'],
    tokenIcon: 'spell_fire_fire',
    tokenBorder: '#FF5722',
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
      armor: 15,
      initiative: 3,
      speed: 50,
      flying: 0,
      swimming: 0,
      sightRange: 60,
      darkvision: 60,
      challengeRating: '5',
      experiencePoints: 1800,
      proficiencyBonus: 3,
      savingThrows: {
        agility: true,
        constitution: true
      },
      skills: {
        acrobatics: 'proficient'
      }
    },
    resistances: {
      fire: 100, // Immune
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
        gold: { min: 5, max: 15 },
        silver: { min: 10, max: 30 },
        copper: { min: 20, max: 50 }
      },
      items: [
        {
          itemId: 'essence-of-fire',
          dropChance: 100,
          quantity: { min: 1, max: 3 }
        },
        {
          itemId: 'fire-crystal',
          dropChance: 25,
          quantity: { min: 1, max: 1 }
        },
        {
          name: "Ember Cloth",
          type: "material",
          quality: "uncommon",
          dropChance: 50,
          iconId: "inv_fabric_netherweave_bolt",
          quantity: { min: 1, max: 2 },
          description: "A piece of cloth that never cools, constantly glowing with heat."
        }
      ]
    }
  },

  // === ADDITIONAL SHOPKEEPER ===
  {
    id: 'madame-zelara-mystic-merchant',
    name: 'Madame Zelara',
    description: 'A mysterious elven sorceress with silver hair and piercing violet eyes. Zelara deals in magical artifacts, exotic potions, and forbidden knowledge from her dimly lit shop "The Arcane Emporium." Her prices are steep, but her goods are genuine and powerful. She has a particular interest in cursed items and dark magic.',
    type: CREATURE_TYPES.HUMANOID,
    size: CREATURE_SIZES.MEDIUM,
    tags: ['elf', 'merchant', 'shopkeeper', 'sorceress', 'mysterious', 'magical'],
    tokenIcon: 'inv_misc_head_elf_02',
    tokenBorder: '#9932CC',
    stats: {
      strength: 8,
      agility: 14,
      constitution: 12,
      intelligence: 18,
      spirit: 16,
      charisma: 15,
      maxHp: 65,
      currentHp: 65,
      maxMana: 120,
      currentMana: 120,
      maxActionPoints: 5,
      currentActionPoints: 5,
      armor: 13,
      initiative: 3,
      speed: 30,
      flying: 0,
      swimming: 15,
      sightRange: 60,
      darkvision: 60,
      criticalChance: 8,
      criticalMultiplier: 2
    },
    resistances: {
      arcane: 25,
      shadow: 15
    },
    vulnerabilities: {
      holy: 10
    },
    abilities: [
      {
        id: 'arcane-missile',
        name: 'Arcane Missile',
        description: 'Launches a bolt of pure magical energy at a target.',
        damage: '2d6+4',
        damageType: 'arcane',
        apCost: 3,
        range: 60
      },
      {
        id: 'detect-magic',
        name: 'Detect Magic',
        description: 'Senses magical auras within 30 feet.',
        apCost: 1,
        range: 30
      },
      {
        id: 'dispel-magic',
        name: 'Dispel Magic',
        description: 'Attempts to remove magical effects from a target.',
        apCost: 4,
        range: 30
      }
    ],
    lootTable: {
      currency: {
        gold: { min: 25, max: 75 },
        silver: { min: 50, max: 150 },
        copper: { min: 0, max: 0 }
      },
      items: [
        {
          name: "Spell Component Pouch",
          type: "container",
          quality: "uncommon",
          dropChance: 100,
          iconId: "inv_misc_bag_08",
          quantity: { min: 1, max: 1 },
          description: "A pouch containing various magical components and reagents."
        },
        {
          name: "Arcane Crystal",
          type: "reagent",
          quality: "rare",
          dropChance: 75,
          iconId: "inv_misc_gem_crystal_02",
          quantity: { min: 1, max: 3 },
          description: "A crystal infused with pure magical energy."
        },
        {
          name: "Scroll of Identify",
          type: "consumable",
          quality: "uncommon",
          dropChance: 60,
          iconId: "inv_scroll_03",
          quantity: { min: 1, max: 2 },
          description: "A scroll that reveals the magical properties of items."
        }
      ]
    },
    isShopkeeper: true,
    shopInventory: {
      shopName: 'The Arcane Emporium',
      shopDescription: 'A mysterious shop filled with floating candles, bubbling cauldrons, and shelves lined with glowing bottles. The air shimmers with magical energy, and strange whispers can be heard from the darker corners. Madame Zelara specializes in magical items, exotic potions, and forbidden artifacts.',
      restockOnLongRest: true,
      buyRates: {
        default: 20, // Low default for mundane items
        categories: {
          weapon: 30,        // Low rate for weapons (not her specialty)
          armor: 25,         // Very low rate for armor (not her specialty)
          consumable: 75,    // Excellent rate for potions and scrolls (her specialty)
          accessory: 80,     // Premium rate for magical accessories (her specialty)
          container: 55,     // Good rate for magical containers
          miscellaneous: 65  // Great rate for misc magical items (includes reagents, crystals)
        }
      },
      items: [
        // Magical Potions
        {
          itemId: 'devils-bargain-potion',
          quantity: 2,
          customPrice: { gold: 3, silver: 0, copper: 0 }
        },
        {
          itemId: 'necromancers-elixir',
          quantity: 1,
          customPrice: { gold: 15, silver: 0, copper: 0 }
        },
        {
          itemId: 'bottled-nightmare',
          quantity: 3,
          customPrice: { gold: 4, silver: 0, copper: 0 }
        },
        {
          itemId: 'time-distortion-crystal',
          quantity: 1,
          customPrice: { gold: 20, silver: 0, copper: 0 }
        },
        {
          itemId: 'phoenix-feather',
          quantity: 1,
          customPrice: { gold: 75, silver: 0, copper: 0 }
        },
        // Cursed Items
        {
          itemId: 'cursed-blade-of-sorrow',
          quantity: 1,
          customPrice: { gold: 12, silver: 0, copper: 0 }
        },
        {
          itemId: 'armor-of-the-damned',
          quantity: 1,
          customPrice: { gold: 25, silver: 0, copper: 0 }
        },
        {
          itemId: 'ring-of-greed',
          quantity: 2,
          customPrice: { gold: 6, silver: 0, copper: 0 }
        },
        {
          itemId: 'amulet-of-the-void',
          quantity: 1,
          customPrice: { gold: 12, silver: 0, copper: 0 }
        },
        // Exotic Items
        {
          itemId: 'memory-crystal',
          quantity: 2,
          customPrice: { gold: 18, silver: 0, copper: 0 }
        },
        {
          itemId: 'soul-jar',
          quantity: 1,
          customPrice: { gold: 150, silver: 0, copper: 0 }
        },
        {
          itemId: 'luck-coin',
          quantity: 3,
          customPrice: { gold: 2, silver: 0, copper: 0 }
        },
        {
          itemId: 'bag-of-devouring',
          quantity: 1,
          customPrice: { gold: 8, silver: 0, copper: 0 }
        },
        {
          itemId: 'truth-seeking-compass',
          quantity: 1,
          customPrice: { gold: 7, silver: 0, copper: 0 }
        },
        // Reagents and Materials
        {
          itemId: 'void-crystal',
          quantity: 5,
          customPrice: { gold: 4, silver: 0, copper: 0 }
        },
        {
          itemId: 'dragon-scale',
          quantity: 2,
          customPrice: { gold: 20, silver: 0, copper: 0 }
        },
        {
          itemId: 'unicorn-hair',
          quantity: 1,
          customPrice: { gold: 75, silver: 0, copper: 0 }
        }
      ]
    }
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
