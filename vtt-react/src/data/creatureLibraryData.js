// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

// Library version - increment this to force store updates
export const CREATURE_LIBRARY_VERSION = '2.0.0';

export const LIBRARY_CREATURES = [
  {
    "id": "gareth-ironhand-merchant",
    "name": "Gareth Ironhand",
    "description": "A stout dwarven blacksmith with calloused hands and a keen eye for quality. Gareth runs \"The Forged Path,\" a well-stocked armory specializing in weapons and armor. His prices are fair, and he pays well for quality metalwork.",
    "type": CREATURE_TYPES.HUMANOID,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "dwarf",
      "merchant",
      "shopkeeper",
      "blacksmith",
      "friendly"
    ],
    "tokenIcon": "inv_misc_head_dwarf_01",
    "tokenBorder": "#CD7F32",
    "stats": {
      "strength": 16,
      "agility": 10,
      "constitution": 17,
      "intelligence": 13,
      "spirit": 12,
      "charisma": 14,
      "maxHp": 95,
      "currentHp": 95,
      "maxMana": 25,
      "currentMana": 25,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 1,
      "speed": 25,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "blight": "resistant"
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "merchant-appraisal",
        "name": "Merchant's Eye",
        "description": "Gareth can instantly appraise the value of any weapon or armor with uncanny accuracy.",
        "type": CREATURE_TYPES.SPECIAL,
        "uses": "unlimited"
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 50,
          "max": 150
        },
        "silver": {
          "min": 100,
          "max": 300
        },
        "copper": {
          "min": 200,
          "max": 500
        }
      },
      "items": []
    },
    "isShopkeeper": true,
    "shopInventory": {
      "shopName": "The Forged Path",
      "shopDescription": "A warm forge with weapons and armor lining the walls. The sound of hammering echoes from the back, and the smell of hot metal fills the air. Gareth stands behind a counter, ready to trade.",
      "restockOnLongRest": true,
      "buyRates": {
        "default": 25,
        "categories": {
          "weapon": 60,
          "consumable": 30,
          "accessory": 35,
          "container": 40,
          "miscellaneous": 45
        }
      },
      "items": [
        {
          "itemId": "ironweep",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "wanderers-edge",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "soulthirst",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "shattermourn",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 2
        },
        {
          "itemId": "grave-axe",
          "customPrice": {
            "gold": 0,
            "silver": 7,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "iron-judgment",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "hunters-whisper",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 2
        },
        {
          "itemId": "gnarled-sorrow",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 2
        },
        {
          "itemId": "weathered-hide",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "rusted-sorrow",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "stiff-resolve",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "chain-of-burden",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "open-palms",
          "customPrice": {
            "gold": 0,
            "silver": 4,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "stiffened-grip",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "travelers-tread",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "smithing-hammer",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "tongs",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "iron-ingot",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 20
        },
        {
          "itemId": "copper-ingot",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 25
        },
        {
          "itemId": "leather-straps",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 30
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.317Z",
    "lastModified": "2026-06-06T20:28:54.317Z"
  },
  {
    "id": "lyra-moonwhisper-merchant",
    "name": "Lyra Moonwhisper",
    "description": "An elegant elven alchemist with silver hair and knowing eyes. Lyra runs \"The Moonlit Apothecary,\" a shop filled with bubbling potions, rare herbs, and magical elixirs. She specializes in consumables and alchemical supplies.",
    "type": CREATURE_TYPES.HUMANOID,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "elf",
      "merchant",
      "shopkeeper",
      "alchemist",
      "mysterious"
    ],
    "tokenIcon": "inv_misc_head_elf_02",
    "tokenBorder": "#9370DB",
    "stats": {
      "strength": 8,
      "agility": 14,
      "constitution": 12,
      "intelligence": 18,
      "spirit": 16,
      "charisma": 15,
      "maxHp": 70,
      "currentHp": 70,
      "maxMana": 100,
      "currentMana": 100,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 3,
      "speed": 30,
      "flying": 0,
      "swimming": 15,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "blight": "immune"
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "alchemist-knowledge",
        "name": "Alchemist's Knowledge",
        "description": "Lyra can identify any potion or alchemical substance instantly.",
        "type": CREATURE_TYPES.SPECIAL,
        "uses": "unlimited"
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 30,
          "max": 100
        },
        "silver": {
          "min": 50,
          "max": 200
        },
        "copper": {
          "min": 100,
          "max": 400
        }
      },
      "items": []
    },
    "isShopkeeper": true,
    "shopInventory": {
      "shopName": "The Moonlit Apothecary",
      "shopDescription": "A dimly lit shop filled with shelves of glowing bottles, dried herbs hanging from the ceiling, and the scent of exotic ingredients. Lyra moves gracefully between bubbling cauldrons and glass vials.",
      "restockOnLongRest": true,
      "buyRates": {
        "default": 20,
        "categories": {
          "weapon": 25,
          "consumable": 70,
          "accessory": 50,
          "container": 45,
          "miscellaneous": 60
        }
      },
      "items": [
        {
          "itemId": "crimson-tears",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 15
        },
        {
          "itemId": "blood-remembrance",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 10
        },
        {
          "itemId": "desperate-draught",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 12
        },
        {
          "itemId": "azure-sorrow",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 15
        },
        {
          "itemId": "spirit-whisper",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 10
        },
        {
          "itemId": "madness-brew",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 8
        },
        {
          "itemId": "strength-of-sorrow",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 6
        },
        {
          "itemId": "hastening-regret",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 8
        },
        {
          "itemId": "mind-fog",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 6
        },
        {
          "itemId": "endurance-iron",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 7
        },
        {
          "itemId": "hardtack-sorrow",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 30
        },
        {
          "itemId": "travelers-fare",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 20
        },
        {
          "itemId": "stew-of-memories",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 12
        },
        {
          "itemId": "scroll-of-haste",
          "customPrice": {
            "gold": 0,
            "silver": 12,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "scroll-of-fortitude",
          "customPrice": {
            "gold": 0,
            "silver": 12,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "distilled-water",
          "customPrice": {
            "gold": 0,
            "silver": 1,
            "copper": 0
          },
          "quantity": 50
        },
        {
          "itemId": "alcohol-base",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 40
        },
        {
          "itemId": "glass-vial",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 30
        },
        {
          "itemId": "fire-essence",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 15
        },
        {
          "itemId": "frost-essence",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 15
        },
        {
          "itemId": "vital-essence",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 12
        },
        {
          "itemId": "fieldleaf",
          "customPrice": {
            "gold": 0,
            "silver": 1,
            "copper": 0
          },
          "quantity": 40
        },
        {
          "itemId": "bitterroot",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 30
        },
        {
          "itemId": "sunblossom",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 25
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "thaddeus-quickcoin-merchant",
    "name": "Thaddeus Quickcoin",
    "description": "A portly halfling merchant with a wide smile and quick fingers. Thaddeus runs \"Quickcoin's Emporium,\" a general store that seems to have everything. From containers to accessories, tools to materials, if you need it, Thaddeus probably has it.",
    "type": CREATURE_TYPES.HUMANOID,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "halfling",
      "merchant",
      "shopkeeper",
      "trader",
      "friendly"
    ],
    "tokenIcon": "inv_misc_head_human_01",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 10,
      "agility": 15,
      "constitution": 12,
      "intelligence": 14,
      "spirit": 13,
      "charisma": 16,
      "maxHp": 65,
      "currentHp": 65,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 3,
      "speed": 25,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 0
    },
    "resistances": {},
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "merchant-haggle",
        "name": "Merchant's Haggle",
        "description": "Thaddeus is skilled at negotiation and can get better deals.",
        "type": CREATURE_TYPES.SPECIAL,
        "uses": "unlimited"
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 20,
          "max": 80
        },
        "silver": {
          "min": 50,
          "max": 150
        },
        "copper": {
          "min": 100,
          "max": 300
        }
      },
      "items": []
    },
    "isShopkeeper": true,
    "shopInventory": {
      "shopName": "Quickcoin's Emporium",
      "shopDescription": "A cluttered but organized shop filled with shelves, barrels, and crates. Thaddeus moves quickly between items, always ready to make a deal. The shop has a warm, welcoming atmosphere.",
      "restockOnLongRest": true,
      "buyRates": {
        "default": 35,
        "categories": {
          "weapon": 40,
          "consumable": 45,
          "accessory": 50,
          "container": 55,
          "miscellaneous": 50
        }
      },
      "items": [
        {
          "itemId": "satchel",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 10
        },
        {
          "itemId": "reinforced-crate",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "alchemy-case",
          "customPrice": {
            "gold": 0,
            "silver": 15,
            "copper": 0
          },
          "quantity": 3
        },
        {
          "itemId": "tool-kit",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "the-burden",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 8
        },
        {
          "itemId": "hastening-regret",
          "customPrice": {
            "gold": 0,
            "silver": 8,
            "copper": 0
          },
          "quantity": 6
        },
        {
          "itemId": "endurance-iron",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "madness-whisper",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 6
        },
        {
          "itemId": "blood-pact",
          "customPrice": {
            "gold": 0,
            "silver": 12,
            "copper": 0
          },
          "quantity": 4
        },
        {
          "itemId": "silent-focus",
          "customPrice": {
            "gold": 0,
            "silver": 10,
            "copper": 0
          },
          "quantity": 5
        },
        {
          "itemId": "gathering-pickaxe",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 8
        },
        {
          "itemId": "herbalists-knife",
          "customPrice": {
            "gold": 0,
            "silver": 4,
            "copper": 0
          },
          "quantity": 10
        },
        {
          "itemId": "gathering-sickle",
          "customPrice": {
            "gold": 0,
            "silver": 4,
            "copper": 0
          },
          "quantity": 10
        },
        {
          "itemId": "skinning-knife",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 8
        },
        {
          "itemId": "sewing-needle",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 12
        },
        {
          "itemId": "mortar-pestle",
          "customPrice": {
            "gold": 0,
            "silver": 6,
            "copper": 0
          },
          "quantity": 6
        },
        {
          "itemId": "red-copper",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 30
        },
        {
          "itemId": "grey-tin",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 25
        },
        {
          "itemId": "bog-iron",
          "customPrice": {
            "gold": 0,
            "silver": 4,
            "copper": 0
          },
          "quantity": 20
        },
        {
          "itemId": "rough-stone",
          "customPrice": {
            "gold": 0,
            "silver": 1,
            "copper": 0
          },
          "quantity": 50
        },
        {
          "itemId": "linen-fiber",
          "customPrice": {
            "gold": 0,
            "silver": 1,
            "copper": 0
          },
          "quantity": 40
        },
        {
          "itemId": "wool-thread",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 35
        },
        {
          "itemId": "hemp-cord",
          "customPrice": {
            "gold": 0,
            "silver": 2,
            "copper": 0
          },
          "quantity": 30
        },
        {
          "itemId": "light-hide",
          "customPrice": {
            "gold": 0,
            "silver": 3,
            "copper": 0
          },
          "quantity": 25
        },
        {
          "itemId": "thick-hide",
          "customPrice": {
            "gold": 0,
            "silver": 5,
            "copper": 0
          },
          "quantity": 20
        },
        {
          "itemId": "beast-sinew",
          "customPrice": {
            "gold": 0,
            "silver": 4,
            "copper": 0
          },
          "quantity": 22
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "vetch",
    "name": "Vetch",
    "description": "A small woodland spirit shaped by the natural game trails of the Frostwood Reach. A quick, scurrying sprite made of twigs and dry leaves. It runs ahead of travelers, mimicking animal trails to guide them safely through the fog.",
    "type": CREATURE_TYPES.ABERRATION,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "aberration",
      "frostwood",
      "wyrd-creature",
      "path",
      "fog"
    ],
    "tokenIcon": "Bestiary/vetch",
    "tokenBorder": "#696969",
    "stats": {
      "strength": 4,
      "agility": 18,
      "constitution": 8,
      "intelligence": 6,
      "spirit": 10,
      "charisma": 6,
      "maxHp": 20,
      "currentHp": 20,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 60,
      "flying": 0,
      "swimming": 20,
      "sightRange": 30,
      "darkvision": 0
    },
    "resistances": {
      "wyrd": 75
    },
    "vulnerabilities": {
      "physical": 100
    },
    "abilities": [
      {
        "id": "vetch_fog_dash",
        "name": "Fog-Dash",
        "description": "Scurries at incredible speed, vanishing into the mist and reappearing behind enemies.",
        "level": 1,
        "spellType": "ENCHANTMENT",
        "icon": "ability_rogue_sprint",
        "effectTypes": [
          "buff",
          "utility"
        ],
        "tags": [
          "fey",
          "fog",
          "movement"
        ],
        "flavorText": "It does not run. The fog simply carries it where it wishes to go.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self",
          "rangeDistance": 0,
          "targetRestrictions": [
            "self"
          ],
          "requiresLineOfSight": false
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "fog_speed",
              "name": "Fog Swiftness",
              "description": "The Vetch becomes one with the mist, moving with supernatural speed.",
              "mechanicsText": "Gain +6 Agility and +30 speed for 1 round.",
              "statModifier": {
                "stat": "agility",
                "magnitude": 6,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "resourceCost": {
          "actionPoints": 1
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "vetch_memory_burst",
        "name": "Memory-Burst",
        "description": "If crushed, releases a burst of stolen memories that overwhelm nearby minds with the pain of every path it ever suggested.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_soulleech",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "wyrd",
          "aoe",
          "death-trigger"
        ],
        "flavorText": "Every path it showed. Every traveler it misled. All remembered at once.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 15
          }
        },
        "damageConfig": {
          "formula": "2d6 + spirit",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 13,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "memory_overwhelm",
              "name": "Stunned",
              "description": "Overwhelmed by stolen memories.",
              "mechanicsText": "Stunned for 1 round on failed Spirit DC 13 save."
            }
          ]
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "vetch_death_burst",
                "category": "health",
                "name": "On Death",
                "parameters": {
                  "perspective": "self",
                  "percentage": 0,
                  "comparison": "less_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "REACTIVE",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 99
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 1
        },
        "silver": {
          "min": 3,
          "max": 10
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "fieldleaf",
          "dropChance": 25,
          "quantity": {
            "min": 1,
            "max": 2
          }
        },
        {
          "itemId": "wooden-haft",
          "dropChance": 20,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "moot",
    "name": "Gloomwood Warden",
    "description": "Born from the ancient treaties sworn between the first human settlers and the forest spirits. A majestic, moss-draped elk whose antlers are hung with old stone tablets and copper keys. It stands at the edges of sacred groves, turning back intruders with a low warning call.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "fey",
      "frostwood",
      "wyrd-creature",
      "judge",
      "lawbringer"
    ],
    "tokenIcon": "Bestiary/moot",
    "tokenBorder": "#C0C0C0",
    "stats": {
      "strength": 14,
      "agility": 12,
      "constitution": 16,
      "intelligence": 16,
      "spirit": 14,
      "charisma": 18,
      "maxHp": 110,
      "currentHp": 110,
      "maxMana": 40,
      "currentMana": 40,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 15,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "wyrd": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "id": "moot_gavel_strike",
        "name": "Gavel Strike",
        "description": "Brings down its rusted iron gavel, forcing the target to confess guilt or suffer the penalty.",
        "level": 3,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_shieldbreak",
        "effectTypes": [
          "damage",
          "control",
          "debuff"
        ],
        "tags": [
          "physical",
          "law",
          "melee"
        ],
        "flavorText": "The gavel falls. Silence follows. Then the screaming.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 10,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d8 + 4",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "moderate",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 15,
          "saveType": "charisma",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "guilty_confession",
              "name": "Silenced",
              "description": "Overwhelmed by legal guilt, unable to speak or cast verbal spells.",
              "mechanicsText": "Silenced for 2 rounds on failed Charisma DC 15 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 1
        }
      },
      {
        "id": "moot_recite_charges",
        "name": "Recite the Charges",
        "description": "Reads from its parchment-body, invoking ancient legal language that wounds the mind and stuns the guilty.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "cone",
          "stun"
        ],
        "flavorText": "\"Article Seven, Clause Twelve: The Accused SHALL remain silent.\"",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true,
          "aoeShape": "cone",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "3d6",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "intelligence",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "legal_stun",
              "name": "Stunned",
              "description": "Mind overwhelmed by centuries of legal precedent.",
              "mechanicsText": "Stunned for 1 round on failed Intelligence DC 14 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "moot_contempt_of_court",
        "name": "Contempt of Court",
        "description": "Summons spectral juror-figures that restrain the accused and strip their defenses.",
        "level": 4,
        "spellType": "CONJURATION",
        "icon": "spell_shadow_grasp",
        "effectTypes": [
          "summoning",
          "control",
          "debuff"
        ],
        "tags": [
          "summon",
          "restrain",
          "law"
        ],
        "flavorText": "A jury of the condemned materializes to deliver their verdict.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "summoningConfig": {
          "creatureType": "spectral",
          "creatures": [
            {
              "id": "spectral_juror",
              "name": "Spectral Juror",
              "description": "A ghostly figure wrapped in legal parchment, wielding chains of binding.",
              "size": CREATURE_SIZES.MEDIUM,
              "type": CREATURE_TYPES.UNDEAD,
              "tokenIcon": "spell_shadow_grasp",
              "stats": {
                "maxHp": 15,
                "maxMana": 0
              },
              "config": {
                "quantity": 3,
                "duration": 3,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 30,
                "abilities": "Grapples target, dealing 1d4 psychic per round. Can be destroyed."
              }
            }
          ],
          "duration": 3,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 30,
          "controlType": "autonomous",
          "maxSummons": 6
        },
        "controlConfig": {
          "controlType": "restraint",
          "strength": "moderate",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "juror_restraint",
              "name": "Restrained",
              "description": "Bound by spectral chains of legal obligation.",
              "mechanicsText": "Restrained for 2 rounds on failed Strength DC 14 save."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "defense_stripped",
              "name": "Defense Stripped",
              "description": "Jurors strip armor and awareness from the accused.",
              "mechanicsText": "-4 Agility for 2 rounds.",
              "statusEffect": {
                "penaltyType": "disadvantage",
                "affectedSkills": [
                  "agility"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "agility",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 4
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 5,
          "max": 20
        },
        "silver": {
          "min": 15,
          "max": 50
        },
        "copper": {
          "min": 30,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "iron-ingot",
          "dropChance": 35,
          "quantity": {
            "min": 1,
            "max": 2
          }
        },
        {
          "itemId": "wooden-haft",
          "dropChance": 30,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "gallows-wood",
    "name": "Gloomwood Treant",
    "description": "An ancient ironwood tree that has absorbed the thick mist and mineral runoff of the mountains. A massive, gnarled tree with weeping, vine-like branches that hang low to the ground. It reacts defensively to loud noises and fire, sweeping its heavy vines to ensnare trespassers.",
    "type": CREATURE_TYPES.PLANT,
    "size": CREATURE_SIZES.HUGE,
    "tags": [
      "plant",
      "frostwood",
      "wyrd-creature",
      "guardian",
      "boss",
      "briaran"
    ],
    "tokenIcon": "Bestiary/gallows-wood",
    "tokenBorder": "#4A3728",
    "stats": {
      "strength": 20,
      "agility": 6,
      "constitution": 20,
      "intelligence": 10,
      "spirit": 16,
      "charisma": 12,
      "maxHp": 220,
      "currentHp": 220,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": -1,
      "speed": 0,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 0
    },
    "resistances": {
      "physical": 50,
      "blight": "immune",
      "wyrd": 75
    },
    "vulnerabilities": {
      "ember": 100,
      "ember": 50
    },
    "abilities": [
      {
        "id": "gallows_drop",
        "name": "Gallows Drop",
        "description": "A noose-vine snakes down and hoists the target into the canopy, strangling the life from them.",
        "level": 4,
        "spellType": "EVOCATION",
        "icon": "spell_nature_stranglevines",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "physical",
          "restraint",
          "ranged"
        ],
        "flavorText": "The noose finds you before you find the noose.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 30,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d10 + 5",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restraint",
          "strength": "strong",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "agility",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "noose_hoist",
              "name": "Restrained & Choking",
              "description": "Hoisted into the canopy by a living noose-vine.",
              "mechanicsText": "Restrained for 2 rounds on failed Agility DC 16 save. Takes 1d4 bludgeoning at start of each turn."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      },
      {
        "id": "gallows_root_surge",
        "name": "Root Surge",
        "description": "Massive roots erupt from the ground, battering everything nearby and knocking creatures prone.",
        "level": 5,
        "spellType": "CONJURATION",
        "icon": "spell_nature_earthquake",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "physical",
          "area",
          "knockdown"
        ],
        "flavorText": "The ground remembers every hanging. The roots remember the weight.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "4d8",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "forcedMovement",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 15,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "root_prone",
              "name": "Prone",
              "description": "Knocked flat by erupting roots.",
              "mechanicsText": "Prone for 1 round on failed Strength DC 15 save."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "root_slow",
              "name": "Entangled",
              "description": "Roots wrap around legs, slowing movement.",
              "mechanicsText": "-10 speed for 1 round.",
              "statusEffect": {
                "penaltyType": "restrained",
                "affectedSkills": [
                  "agility"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "agility",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true,
          "saveDC": 15,
          "saveType": "agility",
          "saveOutcome": "half_damage"
        },
        "resourceCost": {
          "actionPoints": 5
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "gallows_bark_sentence",
        "name": "Bark Sentence",
        "description": "The faces in the bark scream the condemned's last words, filling all nearby minds with dread.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_soulleech",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "fear",
          "area"
        ],
        "flavorText": "\"I didn't do it.\" / \"Please.\" / \"I forgive you.\" â€” the bark remembers them all.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "fear",
              "description": "Heads: Faces whisper the target's own last words. Frightened for 2 rounds."
            },
            "tails": {
              "effect": "damage",
              "description": "Tails: Faces scream in unison. Deal 3d8 additional psychic damage."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 1
            },
            "outcomeTiers": [
              {
                "condition": "heads",
                "name": "Whispered Words",
                "damage": "0",
                "fear": true,
                "fearDuration": 2
              },
              {
                "condition": "tails",
                "name": "Screaming Faces",
                "damage": "3d8 psychic",
                "fear": false
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 40
          }
        },
        "damageConfig": {
          "formula": "3d8",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "COINS",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "moderate",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "bark_fear",
              "name": "Frightened",
              "description": "Paralyzed by the screams of the condemned.",
              "mechanicsText": "Frightened for 2 rounds on failed Spirit DC 16 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 4
        }
      },
      {
        "id": "gallows_briaran_hardening",
        "name": "Briaran Hardening",
        "description": "The ironwood bark hardens into iron density, absorbing punishment and growing thorns that damage attackers.",
        "level": 2,
        "spellType": "ENCHANTMENT",
        "icon": "ability_druid_barkskin",
        "effectTypes": [
          "buff",
          "damage"
        ],
        "tags": [
          "armor",
          "thorns",
          "self"
        ],
        "flavorText": "The bark remembers being ironwood before it was gallows.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self",
          "rangeDistance": 0,
          "targetRestrictions": [
            "self"
          ],
          "requiresLineOfSight": false
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "ironwood_bark",
              "name": "Ironwood Bark",
              "description": "Bark hardens to iron density.",
              "mechanicsText": "+4 Armor for 3 rounds. Melee attackers take 1d6 piercing.",
              "statModifier": {
                "stat": "armor",
                "magnitude": 4,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 3,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": true
        },
        "damageConfig": {
          "formula": "1d6",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "AUTOMATIC"
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "thorns_reflect",
                "category": "damage",
                "name": "When Hit By Melee",
                "parameters": {
                  "damage_type": "melee",
                  "min_damage": 1,
                  "target_entity": "self",
                  "range": 5,
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "REACTIVE",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 5
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 15,
          "max": 60
        },
        "silver": {
          "min": 50,
          "max": 150
        },
        "copper": {
          "min": 100,
          "max": 300
        }
      },
      "items": [
        {
          "itemId": "wooden-haft",
          "dropChance": 55,
          "quantity": {
            "min": 5,
            "max": 10
          }
        },
        {
          "itemId": "bitterroot",
          "dropChance": 40,
          "quantity": {
            "min": 3,
            "max": 6
          }
        },
        {
          "itemId": "fieldleaf",
          "dropChance": 45,
          "quantity": {
            "min": 4,
            "max": 8
          }
        },
        {
          "itemId": "rough-stone",
          "dropChance": 20,
          "quantity": {
            "min": 2,
            "max": 5
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "kjarn",
    "name": "Glacial Golem",
    "description": "An ancient construct carved from glacial runic stone and packed ice. A massive elemental of stone and blue ice that patrols old ruins, acting as a tireless guardian.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "elemental",
      "nordhalla",
      "wyrd-creature",
      "rime",
      "rime"
    ],
    "tokenIcon": "Bestiary/kjarn",
    "tokenBorder": "#87CEEB",
    "stats": {
      "strength": 2,
      "agility": 16,
      "constitution": 14,
      "intelligence": 2,
      "spirit": 8,
      "charisma": 2,
      "maxHp": 15,
      "currentHp": 15,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 20,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "physical": 75
    },
    "vulnerabilities": {
      "ember": 100
    },
    "abilities": [
      {
        "id": "kjarn_cold_drain",
        "name": "Cold Drain",
        "description": "Attaches to a warm creature and siphons body heat, leaving frost-flowers on their skin.",
        "level": 1,
        "spellType": "EVOCATION",
        "icon": "spell_frost_frostarmor",
        "effectTypes": [
          "damage",
          "debuff",
          "healing"
        ],
        "tags": [
          "rime",
          "drain",
          "melee"
        ],
        "flavorText": "It does not bite. It simply makes you colder than you have ever been.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "1d4",
          "damageTypes": [
            "rime"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "DICE",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "frost_bite_weakness",
              "name": "Frost-Bitten",
              "description": "Body temperature drops, weakening constitution.",
              "mechanicsText": "-1 Constitution for 2 rounds.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "constitution"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "constitution",
              "magnitude": -1,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "healingConfig": {
          "formula": "1d4",
          "healingType": "direct",
          "resolution": "AUTOMATIC"
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "kjarn_frost_trail",
        "name": "Frost-Trail",
        "description": "Leaves a trail of razor-frost-flowers that slow and cut anything that follows.",
        "level": 1,
        "spellType": "CONJURATION",
        "icon": "spell_nature_slow",
        "effectTypes": [
          "control",
          "damage"
        ],
        "tags": [
          "rime",
          "area",
          "slow"
        ],
        "flavorText": "Where it walks, winter blooms.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "line",
          "aoeParameters": {
            "length": 20,
            "width": 5
          }
        },
        "damageConfig": {
          "formula": "1d4",
          "damageTypes": [
            "rime",
            "physical"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "mild",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 12,
          "saveType": "agility",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "frost_flower_slow",
              "name": "Slowed",
              "description": "Razor-frost flowers cut at ankles and slow movement.",
              "mechanicsText": "Speed halved for 2 rounds on failed Agility DC 12 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 1
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 2,
          "max": 8
        },
        "copper": {
          "min": 5,
          "max": 15
        }
      },
      "items": [
        {
          "itemId": "rough-stone",
          "dropChance": 30,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "huld",
    "name": "Fjord Troll",
    "description": "A standard mountain troll species native to the northern peaks. A thick-skinned, mossy troll that blends into rocky hillsides. It is territorial but keeps to its caves unless provoked.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "nordhalla",
      "wyrd-creature",
      "rune-keeper",
      "guardian"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#B8860B",
    "stats": {
      "strength": 16,
      "agility": 10,
      "constitution": 18,
      "intelligence": 14,
      "spirit": 16,
      "charisma": 6,
      "maxHp": 130,
      "currentHp": 130,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 0,
      "speed": 20,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 120
    },
    "resistances": {
      "rime": 100,
      "wyrd": 50
    },
    "vulnerabilities": {
      "ember": 75
    },
    "abilities": [
      {
        "id": "huld_archive_pulse",
        "name": "Archive Pulse",
        "description": "Emits a burst of Archive memory that burns neural pathways. Fail and be stunned â€” succeed and the Huld absorbs your knowledge.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "spell_arcane_arcane01",
        "effectTypes": [
          "damage",
          "control",
          "buff"
        ],
        "tags": [
          "wyrd",
          "cone",
          "stun"
        ],
        "flavorText": "You see every trial ever held. Your mind was not built for this.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true,
          "aoeShape": "cone",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "3d6 + intelligence",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 15,
          "saveType": "intelligence",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "archive_overload",
              "name": "Stunned",
              "description": "Neural pathways burned by Archive memory.",
              "mechanicsText": "Stunned for 1 round on failed Intelligence DC 15 save."
            }
          ]
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "knowledge_absorbed",
              "name": "Knowledge Absorbed",
              "description": "The Huld absorbs a fragment of the target's knowledge.",
              "mechanicsText": "On successful enemy save, Huld gains +2 Intelligence for 1 round.",
              "statModifier": {
                "stat": "intelligence",
                "magnitude": 2,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "huld_rune_lock",
        "name": "Rune-Lock",
        "description": "Brass bands unwrap from its body and clamp around the target, freezing them in place with micro-runes.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_grasp",
        "effectTypes": [
          "control",
          "debuff"
        ],
        "tags": [
          "paralysis",
          "rune",
          "ranged"
        ],
        "flavorText": "The runes remember every binding they ever enforced.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "agility",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "rune_paralysis",
              "name": "Paralyzed",
              "description": "Brass bands and micro-runes lock every joint.",
              "mechanicsText": "Paralyzed for 1 round on failed Agility DC 16 save."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "rune_suppression",
              "name": "Rune Suppression",
              "description": "Runes dampen magical ability.",
              "mechanicsText": "-4 Spirit for 1 round.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "spirit"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "spirit",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "huld_bone_shatter",
        "name": "Bone-Shatter Slam",
        "description": "A devastating blow with rune-carved bone limbs that can shatter armor.",
        "level": 3,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_shieldbreak",
        "effectTypes": [
          "damage",
          "debuff"
        ],
        "tags": [
          "physical",
          "armor-break",
          "melee"
        ],
        "flavorText": "The bone remembers being whole. It takes that memory out on your ribs.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 10,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d10 + 5",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "armor_cracked",
              "name": "Armor Cracked",
              "description": "Runes shatter on impact, weakening the target's defenses.",
              "mechanicsText": "On critical hit: -4 Armor for 2 rounds.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "armor"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "armor",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 8,
          "max": 30
        },
        "silver": {
          "min": 20,
          "max": 60
        },
        "copper": {
          "min": 40,
          "max": 120
        }
      },
      "items": [
        {
          "itemId": "iron-ingot",
          "dropChance": 40,
          "quantity": {
            "min": 1,
            "max": 3
          }
        },
        {
          "itemId": "rough-stone",
          "dropChance": 30,
          "quantity": {
            "min": 2,
            "max": 5
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "skrei",
    "name": "Snow Eagle",
    "description": "A large, white-feathered eagle native to the high fjords. A majestic raptor that hunts mountain goats and small game, nesting high on sheer cliffs.",
    "type": CREATURE_TYPES.UNDEAD,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "undead",
      "nordhalla",
      "wyrd-creature",
      "drowned",
      "fjord"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 18,
      "agility": 8,
      "constitution": 20,
      "intelligence": 6,
      "spirit": 4,
      "charisma": 2,
      "maxHp": 200,
      "currentHp": 200,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": -2,
      "speed": 20,
      "flying": 0,
      "swimming": 40,
      "sightRange": 30,
      "darkvision": 60
    },
    "resistances": {
      "rime": 100,
      "physical": 100,
      "physical": 100
    },
    "vulnerabilities": {
      "physical": 75,
      "ember": 50
    },
    "abilities": [
      {
        "id": "skrei_hauling_grip",
        "name": "Hauling Grip",
        "description": "Bone-crushing hands seize the target and drag them toward the nearest water. Barnacles tear flesh on contact.",
        "level": 3,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_cleave",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "rime",
          "grapple",
          "melee"
        ],
        "flavorText": "It drags with the patience of a tide.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d8 + 5",
          "damageTypes": [
            "rime",
            "physical"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "forcedMovement",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 15,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "drag_to_water",
              "name": "Grappled & Dragged",
              "description": "Bone-crushing grip drags target 15 ft toward nearest water source.",
              "mechanicsText": "Grappled and dragged 15 ft on failed Strength DC 15 save."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "barnacle_wounds",
              "name": "Barnacle Lacerations",
              "description": "Barnacle-encrusted hands leave bleeding gashes.",
              "mechanicsText": "-2 Armor for 2 rounds from barnacle damage.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "armor"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "armor",
              "magnitude": -2,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "skrei_cold_aura",
        "name": "Fjord-Freeze Aura",
        "description": "The air around the Skrei drops to killing temperature. Frost crystallizes on every surface.",
        "level": 1,
        "spellType": "PASSIVE",
        "icon": "spell_frost_frostarmor",
        "effectTypes": [
          "damage",
          "debuff"
        ],
        "tags": [
          "rime",
          "aura",
          "passive"
        ],
        "flavorText": "Water freezes. Breath freezes. Blood freezes.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 10
          }
        },
        "damageConfig": {
          "formula": "1d6",
          "damageTypes": [
            "rime"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "deep_cold_slow",
              "name": "Deep Cold",
              "description": "Extreme cold slows all movement.",
              "mechanicsText": "-10 speed while within aura.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "speed"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "speed",
              "magnitude": -10,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 0,
          "durationType": "instant",
          "durationUnit": "instant",
          "canBeDispelled": false
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "fjord_freeze_passive",
                "category": "health",
                "name": "Always Active",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "skrei_death_rattle",
        "name": "Death Rattle",
        "description": "When killed, releases a scream in the voice of the person it once was. Those who hear it are frozen with grief.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_raisedead",
        "effectTypes": [
          "damage",
          "control",
          "aoe",
          "summoning"
        ],
        "tags": [
          "wyrd",
          "death-trigger",
          "fear",
          "summon"
        ],
        "flavorText": "\"I remember being warm.\" â€” the last word of every Skrei.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "fear",
              "description": "Heads: The voice is someone the listener loved. Frightened for 2 rounds."
            },
            "tails": {
              "effect": "drown",
              "description": "Tails: The voice drags listeners toward death. Restrained for 1 round."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 1
            },
            "outcomeTiers": [
              {
                "condition": "heads",
                "name": "Loved Voice",
                "fear": true,
                "fearDuration": 2
              },
              {
                "condition": "tails",
                "name": "Drowning Call",
                "restrain": true,
                "restrainDuration": 1
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "2d6",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "COINS",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": true
        },
        "summoningConfig": {
          "creatureType": "undead",
          "creatures": [
            {
              "id": "drowned_echo",
              "name": "Drowned Echo",
              "description": "A spectral remnant of the person the Skrei once was.",
              "size": CREATURE_SIZES.MEDIUM,
              "type": CREATURE_TYPES.UNDEAD,
              "tokenIcon": "spell_shadow_raisedead",
              "stats": {
                "maxHp": 20,
                "maxMana": 0
              },
              "config": {
                "quantity": 2,
                "duration": 3,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 20,
                "abilities": "Deals 1d6 cold damage on touch. Fades after 3 rounds."
              }
            }
          ],
          "duration": 3,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 20,
          "controlType": "autonomous",
          "maxSummons": 4
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "skrei_death_scream",
                "category": "health",
                "name": "On Death",
                "parameters": {
                  "perspective": "self",
                  "percentage": 0,
                  "comparison": "less_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "REACTIVE",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 99
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 10,
          "max": 40
        },
        "silver": {
          "min": 30,
          "max": 100
        },
        "copper": {
          "min": 60,
          "max": 200
        }
      },
      "items": [
        {
          "itemId": "bone-plates",
          "dropChance": 40,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "ground-bone",
          "dropChance": 35,
          "quantity": {
            "min": 2,
            "max": 5
          }
        },
        {
          "itemId": "bog-iron",
          "dropChance": 20,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "ashwen",
    "name": "Ash Hound",
    "description": "A standard canine species native to the warm basalt flats. A quick, fire-resistant hound with smoldering fur that hunts in small packs.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "elemental",
      "sundale",
      "wyrd-creature",
      "lava",
      "basalt"
    ],
    "tokenIcon": "Bestiary/ashwen",
    "tokenBorder": "#FF8C00",
    "stats": {
      "strength": 0,
      "agility": 6,
      "constitution": 18,
      "intelligence": 2,
      "spirit": 4,
      "charisma": 2,
      "maxHp": 30,
      "currentHp": 30,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 1,
      "currentActionPoints": 1,
      "initiative": -4,
      "speed": 10,
      "flying": 0,
      "swimming": 0,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "ember": 100,
      "physical": 100
    },
    "vulnerabilities": {
      "rime": 100,
      "rime": 100
    },
    "abilities": [
      {
        "id": "ashwen_molten_contact",
        "name": "Molten Contact",
        "description": "Any creature that touches the Ashwen takes fire damage from its superheated basalt surface. The heat lingers.",
        "level": 1,
        "spellType": "PASSIVE",
        "icon": "spell_fire_fire",
        "effectTypes": [
          "damage"
        ],
        "tags": [
          "ember",
          "aura",
          "passive"
        ],
        "flavorText": "A fragment of the Shyr that forgot it was supposed to be stone.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 5
          }
        },
        "damageConfig": {
          "formula": "1d8",
          "damageTypes": [
            "ember"
          ],
          "damageType": "direct",
          "elementType": "ember",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false,
          "dotConfig": {
            "enabled": true,
            "damagePerTick": "1d4",
            "damageTypes": [
              "ember"
            ],
            "tickFrequency": "round",
            "duration": 2,
            "canStack": true,
            "maxStacks": 3
          }
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "ashwen_heat_passive",
                "category": "health",
                "name": "Always Active",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 1,
          "max": 4
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "ember-ore",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 2
          }
        },
        {
          "itemId": "rough-stone",
          "dropChance": 35,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "nekh",
    "name": "Fire Beetle",
    "description": "A giant beetle species feeding on sulfuric minerals. A slow, heavily-armored insect with a glowing shell that lives near hot vents.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "construct",
      "sundale",
      "wyrd-creature",
      "clay",
      "servant",
      "solvarn"
    ],
    "tokenIcon": "Bestiary/nekh",
    "tokenBorder": "#DEB887",
    "stats": {
      "strength": 16,
      "agility": 8,
      "constitution": 16,
      "intelligence": 4,
      "spirit": 2,
      "charisma": 4,
      "maxHp": 75,
      "currentHp": 75,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 0,
      "speed": 20,
      "flying": 0,
      "swimming": 0,
      "sightRange": 30,
      "darkvision": 0
    },
    "resistances": {
      "blight": "immune",
      "wyrd": "immune",
      "blight": "immune"
    },
    "vulnerabilities": {
      "physical": 50
    },
    "abilities": [
      {
        "id": "nekh_sweeping_strike",
        "name": "Sweeping Strike",
        "description": "A wide clay-arm swing that sends enemies sprawling and cracks their armor.",
        "level": 2,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_cleave",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "physical",
          "knockdown",
          "melee"
        ],
        "flavorText": "It sweeps because it was told to. It has never been told to stop.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "melee",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true,
          "aoeShape": "cone",
          "aoeParameters": {
            "radius": 10
          }
        },
        "damageConfig": {
          "formula": "1d8 + 3",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "mild",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 12,
          "saveType": "agility",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "clay_sweep",
              "name": "Prone",
              "description": "Swept off feet by the clay arm.",
              "mechanicsText": "Prone for 1 round on failed Agility DC 12 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "nekh_guardian_protocol",
        "name": "Guardian Protocol",
        "description": "Enters a protective rage when it witnesses a container being opened or a sacred boundary crossed.",
        "level": 2,
        "spellType": "ENCHANTMENT",
        "icon": "ability_warrior_battleshout",
        "effectTypes": [
          "buff",
          "debuff"
        ],
        "tags": [
          "rage",
          "self",
          "trigger"
        ],
        "flavorText": "The tomb has been violated. The guardian remembers its oath.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self",
          "rangeDistance": 0,
          "targetRestrictions": [
            "self"
          ],
          "requiresLineOfSight": false
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "tomb_guardian_rage",
              "name": "Guardian's Wrath",
              "description": "Ancient funerary programming activates.",
              "mechanicsText": "+4 Strength and +2 Strength for 3 rounds. Armor drops as plates dislocate.",
              "statModifier": {
                "stat": "strength",
                "magnitude": 6,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 3,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": true
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "plates_dislocated",
              "name": "Plates Dislocated",
              "description": "Clay plates shift and dislocate from rage.",
              "mechanicsText": "-4 Armor for 3 rounds.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "armor"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "armor",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 3,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "container_violated",
                "category": "health",
                "name": "When Sacred Container Opened",
                "parameters": {
                  "perspective": "ally",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": true
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 5
        }
      },
      {
        "id": "nekh_ash_cloud",
        "name": "Ash Cloud",
        "description": "Compressed ash bursts from its joints in a choking cloud, blinding and suffocating.",
        "level": 2,
        "spellType": "EVOCATION",
        "icon": "spell_nature_nullifydisease",
        "effectTypes": [
          "control",
          "damage"
        ],
        "tags": [
          "blind",
          "area",
          "ash"
        ],
        "flavorText": "The dead do not need to breathe. You do.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 15
          }
        },
        "damageConfig": {
          "formula": "1d4",
          "damageTypes": [
            "blight"
          ],
          "damageType": "direct",
          "elementType": "blight",
          "resolution": "DICE",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "mild",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 12,
          "saveType": "constitution",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "ash_blindness",
              "name": "Blinded",
              "description": "Choking ash fills eyes and lungs.",
              "mechanicsText": "Blinded for 1 round on failed Constitution DC 12 save."
            }
          ]
        },
        "summoningConfig": {
          "creatureType": "construct",
          "creatures": [
            {
              "id": "scarab_swarm",
              "name": "Scarab Swarm",
              "description": "Tiny clay scarabs that scatter from the Nekh's joints.",
              "size": CREATURE_SIZES.TINY,
              "type": CREATURE_TYPES.CONSTRUCT,
              "tokenIcon": "ability_creature_poison_01",
              "stats": {
                "maxHp": 5,
                "maxMana": 0
              },
              "config": {
                "quantity": 8,
                "duration": 2,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 15,
                "abilities": "Swarm to target, dealing 1d4 piercing per round. Easily crushed."
              }
            }
          ],
          "duration": 2,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 15,
          "controlType": "autonomous",
          "maxSummons": 16
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 2,
          "max": 10
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 20,
          "max": 60
        }
      },
      "items": [
        {
          "itemId": "clay-shard",
          "dropChance": 55,
          "quantity": {
            "min": 3,
            "max": 6
          }
        },
        {
          "itemId": "rough-stone",
          "dropChance": 30,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "emberveil",
    "name": "Magma Salamander",
    "description": "A large amphibian thriving in high geothermal heat. A thick-skinned lizard that swims through magma pools and feeds on basalt coal.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "elemental",
      "sundale",
      "wyrd-creature",
      "ember",
      "sol",
      "boss"
    ],
    "tokenIcon": "Bestiary/emberveil",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 14,
      "agility": 16,
      "constitution": 16,
      "intelligence": 18,
      "spirit": 20,
      "charisma": 20,
      "maxHp": 250,
      "currentHp": 250,
      "maxMana": 60,
      "currentMana": 60,
      "maxActionPoints": 6,
      "currentActionPoints": 6,
      "initiative": 4,
      "speed": 30,
      "flying": 20,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 120
    },
    "resistances": {
      "ember": 100,
      "rime": 100,
      "ember": 100,
      "physical": 25
    },
    "vulnerabilities": {
      "blight": 75,
      "blight": 75
    },
    "abilities": [
      {
        "id": "emberveil_molten_weep",
        "name": "Molten Weep",
        "description": "Weeps tears of molten glass that burn through armor and sear flesh. The glass hardens into shrapnel.",
        "level": 4,
        "spellType": "EVOCATION",
        "icon": "spell_fire_firebolt",
        "effectTypes": [
          "damage",
          "debuff"
        ],
        "tags": [
          "ember",
          "ranged",
          "burn"
        ],
        "flavorText": "Its tears are beautiful. Its tears are everything you loved, burning.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 30,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "3d10",
          "damageTypes": [
            "ember",
            "physical"
          ],
          "damageType": "direct",
          "elementType": "ember",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "moderate",
          "duration": 3,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "constitution",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "molten_glass_burn",
              "name": "Burning",
              "description": "Molten glass adheres to skin and armor.",
              "mechanicsText": "Burning for 3 rounds on failed Constitution DC 16 save. 1d4 fire per round."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "glass_armor_melt",
              "name": "Glass-Encrusted",
              "description": "Hardened glass shrapnel restricts movement.",
              "mechanicsText": "-2 Agility for 2 rounds.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "agility"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "agility",
              "magnitude": -2,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "emberveil_solbrand_echo",
        "name": "Solbrand Echo",
        "description": "Releases the brilliance of a dying sun in all directions. The light reveals truths and burns lies.",
        "level": 6,
        "spellType": "EVOCATION",
        "icon": "spell_fire_fireball",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "ember",
          "area",
          "blind"
        ],
        "flavorText": "Sol's last gift. It does not ask permission to shine.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 60
          }
        },
        "damageConfig": {
          "formula": "4d8 + spirit",
          "damageTypes": [
            "ember"
          ],
          "damageType": "direct",
          "elementType": "ember",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 18,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "solar_blindness",
              "name": "Blinded",
              "description": "The brilliance of a dying sun sears retinas.",
              "mechanicsText": "Blinded for 1 round on failed Spirit DC 18 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "emberveil_form_shift",
        "name": "Form Shift",
        "description": "Shifts between four forms based on what the viewer expects. Each form grants different combat bonuses.",
        "level": 5,
        "spellType": "ENCHANTMENT",
        "icon": "ability_druid_wildshape",
        "effectTypes": [
          "buff",
          "transformation"
        ],
        "tags": [
          "shapechange",
          "self",
          "adaptive"
        ],
        "flavorText": "It becomes what you fear. What you desire. What you deserve.",
        "resolution": "CARDS",
        "specialMechanics": {
          "gamblingGame": {
            "gameType": "card_draw",
            "resolution": "CARDS",
            "rules": {
              "flipCount": 0,
              "diceCount": 0,
              "dieType": 0,
              "diceType": "d20",
              "durationHours": 1
            },
            "outcomeTiers": [
              {
                "condition": "ALL_RED",
                "name": "Serpent Form",
                "description": "Reach extends to 15 ft, +4 Agility. All melee attacks gain +1d6 poison."
              },
              {
                "condition": "ALL_BLACK",
                "name": "Fire-Pillar Form",
                "description": "All AoE abilities gain +2d6 fire damage. Immune to physical damage for 1 round."
              },
              {
                "condition": "PAIR",
                "name": "Lion Form",
                "description": "+6 Strength, all melee damage increased by 50%. Gain 20 temp HP."
              },
              {
                "condition": "ANY",
                "name": "Humanoid Form",
                "description": "+4 Charisma, all ranged attacks gain +1d8 radiant. Can cast one additional spell this round."
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self",
          "rangeDistance": 0,
          "targetRestrictions": [
            "self"
          ],
          "requiresLineOfSight": false
        },
        "transformationConfig": {
          "transformationType": "physical",
          "targetType": "self",
          "duration": 1,
          "durationUnit": "rounds",
          "power": "major",
          "newForm": "Emberveil Shift",
          "description": "The Emberveil shifts between humanoid, serpent, lion, and fire-pillar forms.",
          "concentration": false,
          "grantedAbilities": [
            {
              "id": "form_bonus",
              "name": "Form Bonus",
              "description": "Grants different stat bonuses and damage types based on card draw."
            }
          ]
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "emberveil_adaptation",
              "name": "Adaptive Form",
              "description": "Form depends on the card drawn.",
              "mechanicsText": "Draw a card: ALL_RED = Serpent, ALL_BLACK = Fire-Pillar, PAIR = Lion, ANY = Humanoid.",
              "statModifier": {
                "stat": "charisma",
                "magnitude": 4,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": true
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 1,
          "max": 4
        },
        "gold": {
          "min": 20,
          "max": 80
        },
        "silver": {
          "min": 50,
          "max": 200
        },
        "copper": {
          "min": 100,
          "max": 400
        }
      },
      "items": [
        {
          "itemId": "ember-ore",
          "dropChance": 55,
          "quantity": {
            "min": 4,
            "max": 8
          }
        },
        {
          "itemId": "sun-gold",
          "dropChance": 35,
          "quantity": {
            "min": 2,
            "max": 5
          }
        },
        {
          "itemId": "fire-essence",
          "dropChance": 100,
          "quantity": {
            "min": 3,
            "max": 6
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "orun",
    "name": "Deep Sea Jellyfish",
    "description": "A large jellyfish native to the deep trenches. A floating, glowing jellyfish that drifts with the ocean currents.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "elemental",
      "iceheart",
      "wyrd-creature",
      "crystal",
      "star",
      "celestial"
    ],
    "tokenIcon": "Bestiary/orun",
    "tokenBorder": "#9370DB",
    "stats": {
      "strength": 0,
      "agility": 0,
      "constitution": 20,
      "intelligence": 18,
      "spirit": 20,
      "charisma": 14,
      "maxHp": 5,
      "currentHp": 5,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 0,
      "currentActionPoints": 0,
      "initiative": 0,
      "speed": 0,
      "flying": 0,
      "swimming": 10,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "ember": 100,
      "physical": 100,
      "ember": 50
    },
    "vulnerabilities": {
      "physical": 100,
      "storm": 100
    },
    "abilities": [
      {
        "id": "orun_stellar_vision",
        "name": "Stellar Vision",
        "description": "Touching the Orun forces a vision of the pre-Dimming sky â€” beautiful and devastating.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "ability_priest_leapoffaith",
        "effectTypes": [
          "damage",
          "control",
          "buff"
        ],
        "tags": [
          "wyrd",
          "vision",
          "touch"
        ],
        "flavorText": "You see the sky as it was. You understand why the gods wept.",
        "resolution": "CARDS",
        "specialMechanics": {
          "gamblingGame": {
            "gameType": "card_draw",
            "resolution": "CARDS",
            "rules": {
              "flipCount": 0,
              "diceCount": 0,
              "dieType": 0,
              "diceType": "d20",
              "durationHours": 1
            },
            "outcomeTiers": [
              {
                "condition": "ROYAL_FLUSH",
                "name": "God's Last Word",
                "description": "Vision of the complete pre-Dimming sky. Stunned for 2 rounds, 4d6 psychic.",
                "damage": "4d6 psychic",
                "stunDuration": 2
              },
              {
                "condition": "STRAIGHT_FLUSH",
                "name": "Star Memory",
                "description": "Beautiful star-chart vision. Stunned for 1 round, 3d6 psychic.",
                "damage": "3d6 psychic",
                "stunDuration": 1
              },
              {
                "condition": "PAIR",
                "name": "Flicker",
                "description": "Brief glimpse. 1d6 psychic damage only.",
                "damage": "1d6 psychic",
                "stunDuration": 0
              },
              {
                "condition": "ANY",
                "name": "Dim Echo",
                "description": "The crystal hums but reveals nothing. No effect on the viewer; +2 Intelligence to the Orun for 1 round.",
                "damage": "0",
                "stunDuration": 0
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "rangeDistance": 5,
          "targetRestrictions": [
            "any",
            "creature"
          ],
          "requiresLineOfSight": false
        },
        "damageConfig": {
          "formula": "2d6",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "CARDS",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": true
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "vision_shared",
              "name": "Shared Knowledge",
              "description": "On a successful save, the Orun absorbs a fragment of the viewer's mind.",
              "mechanicsText": "+2 Intelligence for 1 round.",
              "statModifier": {
                "stat": "intelligence",
                "magnitude": 2,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "orun_touch_passive",
                "category": "health",
                "name": "On Touch",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 20
        },
        "silver": {
          "min": 10,
          "max": 40
        },
        "copper": {
          "min": 20,
          "max": 60
        }
      },
      "items": [
        {
          "itemId": "focus-crystal",
          "dropChance": 55,
          "quantity": {
            "min": 1,
            "max": 2
          }
        },
        {
          "itemId": "sun-gold",
          "dropChance": 35,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "thalass",
    "name": "Sea Golem",
    "description": "A massive stone construct built to guard deep sea portals. A stone guardian covered in coral and barnacles that patrols the ocean floor.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "iceheart",
      "wyrd-creature",
      "sea-spirit",
      "song",
      "storm"
    ],
    "tokenIcon": "Bestiary/thalass",
    "tokenBorder": "#20B2AA",
    "stats": {
      "strength": 14,
      "agility": 16,
      "constitution": 14,
      "intelligence": 12,
      "spirit": 18,
      "charisma": 16,
      "maxHp": 100,
      "currentHp": 100,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 60,
      "sightRange": 60,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "blight": 100,
      "blight": 50
    },
    "vulnerabilities": {
      "ember": 75,
      "ember": 50
    },
    "abilities": [
      {
        "id": "thalass_wave_break",
        "name": "Wave-Break",
        "description": "A mass of water shaped like a fist slams into the target with the force of a storm surge.",
        "level": 3,
        "spellType": "EVOCATION",
        "icon": "ability_druid_lacerate",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "physical",
          "water",
          "melee"
        ],
        "flavorText": "The ocean does not punch. It simply arrives.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 15,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d8 + 4",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "water",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "knockbackConfig": {
          "distance": 10
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "thalass_undertow",
        "name": "Undertow",
        "description": "An invisible current seizes the target and drags them toward the Thalass.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "spell_nature_stranglevines",
        "effectTypes": [
          "control"
        ],
        "tags": [
          "grapple",
          "ranged",
          "water"
        ],
        "flavorText": "The water remembers you. It wants you back.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "grapple_strong",
              "description": "Heads: Undertow drags target 20 ft and restrains for 2 rounds."
            },
            "tails": {
              "effect": "grapple_weak",
              "description": "Tails: Undertow slows target by 15 ft for 1 round."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 1
            },
            "outcomeTiers": [
              {
                "condition": "heads",
                "name": "Riptide",
                "dragDistance": 20,
                "restrain": true,
                "restrainDuration": 2
              },
              {
                "condition": "tails",
                "name": "Undercurrent",
                "slowAmount": 15,
                "slowDuration": 1
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "controlConfig": {
          "controlType": "restraint",
          "strength": "moderate",
          "duration": 2,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "ocean_grapple",
              "name": "Restrained",
              "description": "Seized by an invisible undertow.",
              "mechanicsText": "Restrained and dragged 20 ft on failed Strength DC 14 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      },
      {
        "id": "thalass_stormsong",
        "name": "Stormsong",
        "description": "Produces the ghost of the sea's old harmonic frequencies, overwhelming minds with the sound of a world without silence.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "sonic",
          "area"
        ],
        "flavorText": "Before the Dimming, the sea sang. This is the last verse.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "2d6 + spirit",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "sea_confusion",
              "name": "Confused",
              "description": "The old harmonics rewrite thought patterns.",
              "mechanicsText": "Confused for 1 round on failed Spirit DC 14 save."
            }
          ]
        },
        "summoningConfig": {
          "creatureType": "elemental",
          "creatures": [
            {
              "id": "tide_marrow",
              "name": "Tide Marrow",
              "description": "A small elemental of compressed wave-energy.",
              "size": CREATURE_SIZES.SMALL,
              "type": CREATURE_TYPES.ELEMENTAL,
              "tokenIcon": "spell_shadow_drain",
              "stats": {
                "maxHp": 10,
                "maxMana": 0
              },
              "config": {
                "quantity": 2,
                "duration": 3,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 30,
                "abilities": "Deals 1d6 bludgeoning per round and pushes targets 5 ft."
              }
            }
          ],
          "duration": 3,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 30,
          "controlType": "autonomous",
          "maxSummons": 4
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 20
        },
        "silver": {
          "min": 15,
          "max": 50
        },
        "copper": {
          "min": 30,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "bone-plates",
          "dropChance": 30,
          "quantity": {
            "min": 1,
            "max": 3
          }
        },
        {
          "itemId": "water-essence",
          "dropChance": 25,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
    {
    "id": "pelagos",
    "name": "Pelagos",
    "description": "A sleek, hound-like sea hunter with smooth indigo-green shark skin, webbed paws, a shark tail, and glowing whiskers that sense vibrations in freezing currents.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "beast",
      "iceheart",
      "wyrd-creature",
      "hound",
      "bioluminescent",
      "guardian"
    ],
    "tokenIcon": "Bestiary/pelagos",
    "tokenBorder": "#00CED1",
    "stats": {
      "strength": 14,
      "agility": 18,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 12,
      "charisma": 12,
      "maxHp": 85,
      "currentHp": 85,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 50,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 100,
      "physical": 50,
      "physical": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Bioluminescent Flash",
        "description": "Emits a sharp flash of light from its eyes, blinding a target.",
        "type": "spell",
        "spellType": "EVOCATION",
        "level": 2,
        "icon": "spell_holy_mindvision",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
              "condition": "blinded",
              "duration": 1
            }
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 3
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "glowing-whisker",
          "dropChance": 30,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-11T20:20:00Z",
    "lastModified": "2026-06-11T20:20:00Z"
  },
  {
    "id": "qalpa",
    "name": "Cliff Guardian",
    "description": "A stone gargoyle carved to guard mountain passages. A winged gargoyle that sits motionless on peaks, warning travelers of blizzards.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "construct",
      "cragjaw",
      "wyrd-creature",
      "mining",
      "scavenger"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#8B4513",
    "stats": {
      "strength": 12,
      "agility": 14,
      "constitution": 16,
      "intelligence": 4,
      "spirit": 6,
      "charisma": 2,
      "maxHp": 40,
      "currentHp": 40,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 1,
      "speed": 25,
      "flying": 0,
      "swimming": 0,
      "sightRange": 30,
      "darkvision": 60
    },
    "resistances": {
      "ember": 100,
      "blight": 100
    },
    "vulnerabilities": {
      "rime": 50,
      "rime": 50
    },
    "abilities": [
      {
        "id": "qalpa_claw_chisel",
        "name": "Claw-Chisel",
        "description": "Limb-blades of shattered mining chisels slash with surgical precision. Shards embed in the wound.",
        "level": 1,
        "spellType": "EVOCATION",
        "icon": "ability_creature_poison_01",
        "effectTypes": [
          "damage"
        ],
        "tags": [
          "physical",
          "melee",
          "mining"
        ],
        "flavorText": "The chisels remember the veins they opened. They open yours.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "1d6 + 3",
          "damageTypes": [
            "physical"
          ],
          "damageType": "direct",
          "elementType": "physical",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false,
          "dotConfig": {
            "enabled": true,
            "damagePerTick": "1",
            "damageTypes": [
              "physical"
            ],
            "tickFrequency": "round",
            "duration": 3,
            "canStack": true,
            "maxStacks": 3
          }
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "qalpa_furnace_breath",
        "name": "Furnace-Breath",
        "description": "The chest-furnace overpressurizes and vents superheated air in a narrow cone of killing heat.",
        "level": 2,
        "spellType": "EVOCATION",
        "icon": "spell_fire_fire",
        "effectTypes": [
          "damage",
          "debuff",
          "aoe"
        ],
        "tags": [
          "ember",
          "cone",
          "breath"
        ],
        "flavorText": "The furnace burns what it was built to burn: darkness, coal, and flesh.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true,
          "aoeShape": "cone",
          "aoeParameters": {
            "radius": 15
          }
        },
        "damageConfig": {
          "formula": "1d8 + 2",
          "damageTypes": [
            "ember"
          ],
          "damageType": "direct",
          "elementType": "ember",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "heat_stroke",
              "name": "Heat Exhaustion",
              "description": "Superheated air causes disorientation.",
              "mechanicsText": "-2 Agility for 2 rounds.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "agility"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "agility",
              "magnitude": -2,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true,
          "saveDC": 12,
          "saveType": "agility",
          "saveOutcome": "half_damage"
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 1,
          "max": 5
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "iron-ingot",
          "dropChance": 35,
          "quantity": {
            "min": 1,
            "max": 3
          }
        },
        {
          "itemId": "copper-ingot",
          "dropChance": 30,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "ember-ore",
          "dropChance": 15,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "kintsu",
    "name": "Stone Gargoyle",
    "description": "A massive stone bird guarding the high Cols. A bird construct that watches the valleys from above.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "cragjaw",
      "wyrd-creature",
      "bridge",
      "name",
      "bone"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#F5DEB3",
    "stats": {
      "strength": 10,
      "agility": 18,
      "constitution": 14,
      "intelligence": 14,
      "spirit": 18,
      "charisma": 16,
      "maxHp": 90,
      "currentHp": 90,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 40,
      "flying": 20,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 100,
      "rime": 50
    },
    "vulnerabilities": {
      "ember": 75
    },
    "abilities": [
      {
        "id": "kintsu_name_toll",
        "name": "Name-Toll",
        "description": "Forces the target to forget their own name for three days. The toll is always paid â€” the only question is how much.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "debuff",
          "control"
        ],
        "tags": [
          "wyrd",
          "charisma",
          "fate"
        ],
        "flavorText": "It does not steal your name. You hand it over, thinking it was a fair trade.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "name_lost_full",
              "description": "Heads: The name is taken completely. -6 Charisma for 6 rounds."
            },
            "tails": {
              "effect": "name_lost_partial",
              "description": "Tails: A fragment of the name is taken. -3 Charisma for 3 rounds."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 2
            },
            "outcomeTiers": [
              {
                "condition": "ALL_HEADS",
                "name": "Full Name Taken",
                "charismaPenalty": -8,
                "duration": 8,
                "stunned": true
              },
              {
                "condition": "MAJORITY_HEADS",
                "name": "Name Fades",
                "charismaPenalty": -6,
                "duration": 6
              },
              {
                "condition": "EQUAL_SPLIT",
                "name": "Name Slips",
                "charismaPenalty": -3,
                "duration": 3
              },
              {
                "condition": "ALL_TAILS",
                "name": "Toll Waived",
                "charismaPenalty": 0,
                "duration": 0,
                "description": "The Kintsu blinks and says nothing. No effect."
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "name_erasure",
              "name": "Nameless",
              "description": "Without a name, identity unravels.",
              "mechanicsText": "Charisma reduced based on coin flip. Duration scales with result.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "charisma"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "charisma",
              "magnitude": -6,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 6,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true,
          "saveDC": 14,
          "saveType": "spirit",
          "saveOutcome": "negates"
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "kintsu_bone_light_shift",
        "name": "Bone-Light Shift",
        "description": "The Kintsu dissolves into bone-reflected light and reforms at any point on the same Ancestor-Span.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "ability_rogue_shadowstep",
        "effectTypes": [
          "utility",
          "buff"
        ],
        "tags": [
          "teleport",
          "self",
          "bone"
        ],
        "flavorText": "It does not move. Light simply arrives where it was always going.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self",
          "rangeDistance": 0,
          "targetRestrictions": [
            "self"
          ],
          "requiresLineOfSight": false
        },
        "buffConfig": {
          "buffType": "combatAdvantage",
          "effects": [
            {
              "id": "bone_light_ward",
              "name": "Bone-Light Form",
              "description": "Partially dissolved into light, harder to hit.",
              "mechanicsText": "+4 Armor and +4 Agility for 1 round after teleporting.",
              "statModifier": {
                "stat": "agility",
                "magnitude": 4,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": true
        },
        "utilityConfig": {
          "utilityType": "movement",
          "selectedEffects": [
            {
              "id": "bone_teleport",
              "name": "Bone-Light Teleport",
              "description": "Dissolves into bone-reflected light and reforms up to 60 ft away on the same bone-span."
            }
          ],
          "duration": 0,
          "durationUnit": "instant",
          "concentration": false,
          "range": 60
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 1
        }
      },
      {
        "id": "kintsu_memory_flash",
        "name": "Memory Flash",
        "description": "Releases fragmented memories of every crossing it has witnessed. Each memory carries the emotional weight of a life.",
        "level": 3,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_soulleech",
        "effectTypes": [
          "damage",
          "control",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "area",
          "confusion"
        ],
        "flavorText": "Every name it collected. Every face that crossed. All at once.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 15
          }
        },
        "damageConfig": {
          "formula": "2d6 + charisma",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "memory_flood",
              "name": "Confused",
              "description": "Drowning in centuries of crossing-memories.",
              "mechanicsText": "Confused for 1 round on failed Spirit DC 14 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 2
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 4
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 20
        },
        "silver": {
          "min": 15,
          "max": 50
        },
        "copper": {
          "min": 30,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "bone-plates",
          "dropChance": 35,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "wooden-haft",
          "dropChance": 25,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.319Z",
    "lastModified": "2026-06-06T20:28:54.319Z"
  },
  {
    "id": "tarn",
    "name": "Thunderbird",
    "description": "A large eagle that channels electrical storms through its wings. A majestic bird nesting on lightning-struck peaks.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "fey",
      "cragjaw",
      "wyrd-creature",
      "oracle",
      "pool",
      "boss"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#2F4F4F",
    "stats": {
      "strength": 16,
      "agility": 0,
      "constitution": 18,
      "intelligence": 14,
      "spirit": 20,
      "charisma": 16,
      "maxHp": 180,
      "currentHp": 180,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 0,
      "speed": 0,
      "flying": 0,
      "swimming": 0,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "physical": 50,
      "wyrd": 75
    },
    "vulnerabilities": {
      "ember": 100
    },
    "abilities": [
      {
        "id": "tarn_water_tendrils",
        "name": "Water-Tendrils",
        "description": "Tendrils of ink-black water snake out and grapple nearby creatures, pulling them toward the pool.",
        "level": 4,
        "spellType": "EVOCATION",
        "icon": "spell_nature_stranglevines",
        "effectTypes": [
          "control",
          "damage"
        ],
        "tags": [
          "grapple",
          "ranged",
          "water"
        ],
        "flavorText": "The water is patient. It has always been patient.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "1d8",
          "damageTypes": [
            "rime",
            "blight"
          ],
          "damageType": "direct",
          "elementType": "blight",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restraint",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "black_water_grapple",
              "name": "Grappled",
              "description": "Ink-black water tendrils wrap around limbs and pull toward the pool.",
              "mechanicsText": "Restrained for 1 round on failed Strength DC 16 save. Pulled 10 ft toward pool."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 1
        }
      },
      {
        "id": "tarn_visions_aura",
        "name": "Visions Aura",
        "description": "Creatures near the pool glimpse their future self. Those who reject the vision become prisoners of the pool.",
        "level": 4,
        "spellType": "ENCHANTMENT",
        "icon": "ability_priest_leapoffaith",
        "effectTypes": [
          "damage",
          "control",
          "buff",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "vision",
          "area",
          "passive"
        ],
        "flavorText": "Your future self looks back at you with terrible pity.",
        "resolution": "CARDS",
        "specialMechanics": {
          "gamblingGame": {
            "gameType": "card_draw",
            "resolution": "CARDS",
            "rules": {
              "flipCount": 0,
              "diceCount": 0,
              "dieType": 0,
              "diceType": "d20",
              "durationHours": 1
            },
            "outcomeTiers": [
              {
                "condition": "ROYAL_FLUSH",
                "name": "Perfect Future",
                "description": "The vision is wondrous. Target gains +4 Intelligence and +4 Spirit for 2 rounds. No save needed.",
                "buff": true,
                "buffStat": "intelligence",
                "buffMagnitude": 4
              },
              {
                "condition": "STRAIGHT_FLUSH",
                "name": "Acceptable Future",
                "description": "The vision is bearable. Target takes 1d4 psychic but gains +2 Intelligence for 1 round.",
                "damage": "1d4 psychic",
                "buff": true,
                "buffStat": "intelligence",
                "buffMagnitude": 2
              },
              {
                "condition": "THREE_KIND",
                "name": "Troubled Future",
                "description": "The vision is distressing. 1d6 psychic, DC 14 Spirit save or confused for 1 round.",
                "damage": "1d6 psychic",
                "confuseChance": 50
              },
              {
                "condition": "ANY",
                "name": "Unbearable Future",
                "description": "The target rejects the vision. 1d4 psychic and paralyzed for 1 round on failed DC 14 Spirit save.",
                "damage": "1d4 psychic",
                "paralyzeChance": 75
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 60
          }
        },
        "damageConfig": {
          "formula": "1d4",
          "damageTypes": [
            "wyrd"
          ],
          "damageType": "direct",
          "elementType": "wyrd",
          "resolution": "CARDS",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": true
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "future_knowledge",
              "name": "Future Sight",
              "description": "Seeing the future sharpens the mind.",
              "mechanicsText": "+2 Intelligence for 1 round on successful Spirit save.",
              "statModifier": {
                "stat": "intelligence",
                "magnitude": 2,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "rejected_future",
              "name": "Paralyzed",
              "description": "Frozen by the terror of their own future.",
              "mechanicsText": "Paralyzed for 1 round on failed Spirit DC 14 save."
            }
          ]
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "tarn_vision_passive",
                "category": "health",
                "name": "Always Active",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "tarn_dissolve",
        "name": "Dissolve",
        "description": "Creatures submerged in the pool for too long begin to dissolve, their identity draining into the black water.",
        "level": 3,
        "spellType": "PASSIVE",
        "icon": "spell_shadow_soulleech",
        "effectTypes": [
          "damage",
          "debuff"
        ],
        "tags": [
          "blight",
          "passive",
          "drain"
        ],
        "flavorText": "The pool does not kill. It forgets you, and without memory, you simply stop.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 15
          }
        },
        "damageConfig": {
          "formula": "2d8",
          "damageTypes": [
            "blight"
          ],
          "damageType": "direct",
          "elementType": "blight",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "identity_drain",
              "name": "Dissolving",
              "description": "Identity drains into the black water.",
              "mechanicsText": "-1 to all stats per round while submerged. Cumulative.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "all"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "all",
              "magnitude": -1,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 99,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": false
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "AND",
            "compoundTriggers": [
              {
                "id": "tarn_dissolve_condition",
                "category": "health",
                "name": "While Target Restrained in Pool",
                "parameters": {
                  "perspective": "enemy",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 3,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 2
        },
        "gold": {
          "min": 10,
          "max": 40
        },
        "silver": {
          "min": 30,
          "max": 100
        },
        "copper": {
          "min": 60,
          "max": 200
        }
      },
      "items": [
        {
          "itemId": "water-essence",
          "dropChance": 100,
          "quantity": {
            "min": 3,
            "max": 6
          }
        },
        {
          "itemId": "focus-crystal",
          "dropChance": 30,
          "quantity": {
            "min": 1,
            "max": 2
          }
        },
        {
          "itemId": "rough-stone",
          "dropChance": 25,
          "quantity": {
            "min": 3,
            "max": 8
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "nokhor",
    "name": "Steppe Falcon",
    "description": "A trained falcon used by nomadic clans. A swift raptor hunting rodents in the steppe.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "fey",
      "sundrift",
      "wyrd-creature",
      "warmth",
      "comfort"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#DAA520",
    "stats": {
      "strength": 2,
      "agility": 16,
      "constitution": 8,
      "intelligence": 8,
      "spirit": 16,
      "charisma": 18,
      "maxHp": 10,
      "currentHp": 10,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 2,
      "currentActionPoints": 2,
      "initiative": 4,
      "speed": 40,
      "flying": 0,
      "swimming": 0,
      "sightRange": 30,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "physical": 100
    },
    "vulnerabilities": {
      "ember": 100,
      "ember": 100
    },
    "abilities": [
      {
        "id": "nokhor_comforting_pur",
        "name": "Comforting Pur",
        "description": "Its warmth radiates outward, healing allies and lulling enemies into forgetting why they came.",
        "level": 1,
        "spellType": "PASSIVE",
        "icon": "ability_priest_renew",
        "effectTypes": [
          "healing",
          "control"
        ],
        "tags": [
          "healing",
          "charm",
          "aura",
          "passive"
        ],
        "flavorText": "Stay. Rest. You have been traveling so long. You can stay forever.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "ally",
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 20
          }
        },
        "healingConfig": {
          "formula": "1d4 + 1",
          "healingType": "direct",
          "resolution": "AUTOMATIC",
          "hasHotEffect": true,
          "hotFormula": "1",
          "hotDuration": 1,
          "hotTickType": "round"
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "mild",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 12,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "warmth_charm",
              "name": "Charmed",
              "description": "The warmth makes you want to stay.",
              "mechanicsText": "Charmed for 1 round on failed Spirit DC 12 save. -5 speed on success."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "contentment_laziness",
              "name": "Content",
              "description": "Even on a successful save, the warmth saps urgency.",
              "mechanicsText": "-5 speed for 1 round.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "speed"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "speed",
              "magnitude": -5,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "nokhor_warmth_passive",
                "category": "health",
                "name": "Always Active",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 3,
          "max": 10
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "fieldleaf",
          "dropChance": 45,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "bitterroot",
          "dropChance": 25,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "unzag",
    "name": "Steppe Lynx",
    "description": "A large wildcat native to the open tundra. A quiet, spotted cat that hunts in the tall grass.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.GARGANTUAN,
    "tags": [
      "elemental",
      "sundrift",
      "wyrd-creature",
      "sky",
      "starless",
      "blight"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#191970",
    "stats": {
      "strength": 0,
      "agility": 10,
      "constitution": 18,
      "intelligence": 14,
      "spirit": 20,
      "charisma": 14,
      "maxHp": 150,
      "currentHp": 150,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 0,
      "speed": 10,
      "flying": 120,
      "swimming": 0,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "physical": 100,
      "wyrd": 50
    },
    "vulnerabilities": {
      "ember": 75,
      "ember": 50
    },
    "abilities": [
      {
        "id": "unzag_sky_fault",
        "name": "Sky-Fault",
        "description": "Its shadow on the ground freezes everything it touches, creating a zone of absolute cold and darkness.",
        "level": 4,
        "spellType": "PASSIVE",
        "icon": "spell_frost_frostarmor",
        "effectTypes": [
          "damage",
          "debuff",
          "aoe"
        ],
        "tags": [
          "rime",
          "blight",
          "area",
          "passive"
        ],
        "flavorText": "Where the last star went dark, the sky remembers the wound.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 60
          }
        },
        "damageConfig": {
          "formula": "2d6",
          "damageTypes": [
            "rime"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "sky_fault_darkness",
              "name": "Darkness Penalty",
              "description": "The shadow-zone saps all warmth and light.",
              "mechanicsText": "-4 Spirit and -2 sightRange while within the fault zone.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "spirit"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "spirit",
              "magnitude": -4,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 0,
          "durationType": "instant",
          "durationUnit": "instant",
          "canBeDispelled": false
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "unzag_shadow_passive",
                "category": "health",
                "name": "Always Active While Flying",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "unzag_star_hunger",
        "name": "Star-Hunger",
        "description": "Forces creatures to stare upward into the void where the last star died. The emptiness is paralyzing.",
        "level": 5,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "control",
          "buff",
          "aoe"
        ],
        "tags": [
          "paralyze",
          "blight",
          "area"
        ],
        "flavorText": "Look up. See what isn't there. See what will never be there again.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "void_paralyze",
              "description": "Heads: The void stares back. Paralyzed for 1 round, no save."
            },
            "tails": {
              "effect": "void_frighten",
              "description": "Tails: The void whispers. Frightened for 1 round on failed Spirit DC 16."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 3
            },
            "outcomeTiers": [
              {
                "condition": "ALL_HEADS",
                "name": "Star Swallowed",
                "description": "Complete void absorption. Paralyzed for 2 rounds, drained of 2d6 Spirit.",
                "paralyzeDuration": 2,
                "spiritDrain": "2d6"
              },
              {
                "condition": "MAJORITY_HEADS",
                "name": "Void Gaze",
                "description": "The void locks eyes. Paralyzed for 1 round, no save.",
                "paralyzeDuration": 1
              },
              {
                "condition": "MAJORITY_TAILS",
                "name": "Star Echo",
                "description": "A faint star-glimmer. +2 Spirit for 1 round instead.",
                "buff": true,
                "spiritBonus": 2
              },
              {
                "condition": "ALL_TAILS",
                "name": "Star Remembered",
                "description": "The star briefly returns. All allies in range gain +4 Spirit for 1 round.",
                "buff": true,
                "spiritBonus": 4,
                "aoeBuff": true
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 40
          }
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "void_absorption",
              "name": "Void-Fed",
              "description": "The Unzag grows stronger from the emptiness.",
              "mechanicsText": "+2 Spirit for 1 round on successful enemy save.",
              "statModifier": {
                "stat": "spirit",
                "magnitude": 2,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "void_paralysis",
              "name": "Paralyzed",
              "description": "Frozen by the weight of the absent star.",
              "mechanicsText": "Paralyzed for 1 round on failed Spirit DC 16 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 2
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 20
        },
        "silver": {
          "min": 15,
          "max": 50
        },
        "copper": {
          "min": 30,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "arcane-dust",
          "dropChance": 30,
          "quantity": {
            "min": 1,
            "max": 3
          }
        },
        {
          "itemId": "focus-crystal",
          "dropChance": 20,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "zud",
    "name": "Steppe Mammoth",
    "description": "A massive woolly mammoth migrating across the plains. A huge, peaceful herbivore with long tusks and thick fur.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.HUGE,
    "tags": [
      "monstrosity",
      "sundrift",
      "wyrd-creature",
      "winter",
      "herd",
      "boss"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#FFFAFA",
    "stats": {
      "strength": 22,
      "agility": 6,
      "constitution": 22,
      "intelligence": 4,
      "spirit": 12,
      "charisma": 2,
      "maxHp": 250,
      "currentHp": 250,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": -2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "rime": 100,
      "blight": 100,
      "wyrd": 100,
      "physical": 100,
      "physical": 100
    },
    "vulnerabilities": {
      "ember": 100,
      "physical": 75
    },
    "abilities": [
      {
        "id": "zud_blizzard_body",
        "name": "Blizzard Body",
        "description": "The Zud's massive form engulfs everything in its path, freezing flesh to bone on contact.",
        "level": 5,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_cleave",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "rime",
          "melee",
          "crush"
        ],
        "flavorText": "It does not chase you. Winter simply arrives where you stand.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "melee",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "cone",
          "aoeParameters": {
            "radius": 10
          }
        },
        "damageConfig": {
          "formula": "3d10 + 6",
          "damageTypes": [
            "rime",
            "physical"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 2.5,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "restraint",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "strength",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "frozen_mass",
              "name": "Restrained",
              "description": "Frozen in place by compressed bone and blizzard-force wind.",
              "mechanicsText": "Restrained for 1 round on failed Strength DC 16 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 3
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "zud_herd_memory",
        "name": "Herd-Memory",
        "description": "The Zud speaks with the frozen voices of every creature it has consumed. Their last words echo with devastating force.",
        "level": 5,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "control",
          "damage",
          "aoe",
          "summoning"
        ],
        "tags": [
          "wyrd",
          "fear",
          "area",
          "summon"
        ],
        "flavorText": "\"I was warm once.\" \"My children...\" \"Don't look back.\" â€” a chorus of the consumed.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "fear_storm",
              "description": "Heads: The voices form into a howling blizzard of grief. Frightened for 2 rounds."
            },
            "tails": {
              "effect": "memory_bomb",
              "description": "Tails: A single voice screams its last word. 3d6 psychic damage in a cone."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 1
            },
            "outcomeTiers": [
              {
                "condition": "heads",
                "name": "Chorus of Grief",
                "fear": true,
                "fearDuration": 2
              },
              {
                "condition": "tails",
                "name": "Last Word",
                "damage": "3d6 psychic",
                "aoeShape": "cone",
                "aoeSize": 30
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 60
          }
        },
        "summoningConfig": {
          "creatureType": "undead",
          "creatures": [
            {
              "id": "frozen_echo",
              "name": "Frozen Echo",
              "description": "A spectral figure made of compressed snow and bone, endlessly repeating its last words.",
              "size": CREATURE_SIZES.MEDIUM,
              "type": CREATURE_TYPES.UNDEAD,
              "tokenIcon": "spell_frost_frost",
              "stats": {
                "maxHp": 15,
                "maxMana": 0
              },
              "config": {
                "quantity": 4,
                "duration": 3,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 30,
                "abilities": "Charges nearest creature, dealing 1d8 cold damage. Immune to cold."
              }
            }
          ],
          "duration": 3,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 30,
          "controlType": "autonomous",
          "maxSummons": 8
        },
        "controlConfig": {
          "controlType": "restriction",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "spirit",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "herd_fear",
              "name": "Frightened",
              "description": "Frozen by the chorus of the dead.",
              "mechanicsText": "Frightened for 1 round on failed Spirit DC 14 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "zud_whiteout",
        "name": "Whiteout",
        "description": "The Zud generates a blinding wall of white that reduces visibility to nothing and chills the air to killing temperature.",
        "level": 3,
        "spellType": "PASSIVE",
        "icon": "spell_nature_slow",
        "effectTypes": [
          "control",
          "debuff",
          "aoe"
        ],
        "tags": [
          "blind",
          "rime",
          "area",
          "passive"
        ],
        "flavorText": "You cannot see winter. But winter sees you.",
        "resolution": "AUTOMATIC",
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 30
          }
        },
        "damageConfig": {
          "formula": "1d4",
          "damageTypes": [
            "rime"
          ],
          "damageType": "direct",
          "elementType": "rime",
          "resolution": "AUTOMATIC",
          "canCrit": false,
          "critMultiplier": 2,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "mild",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 14,
          "saveType": "intelligence",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "whiteout_blind",
              "name": "Blinded",
              "description": "Total whiteout. Cannot see anything.",
              "mechanicsText": "Blinded for 1 round on failed Intelligence DC 14 save."
            }
          ]
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "frost_slow",
              "name": "Frozen Movement",
              "description": "Extreme cold slows everything to a crawl.",
              "mechanicsText": "-6 Agility for 2 rounds within the whiteout zone.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "agility"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "agility",
              "magnitude": -6,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 2,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "triggerConfig": {
          "global": {
            "enabled": true,
            "logicType": "OR",
            "compoundTriggers": [
              {
                "id": "zud_whiteout_passive",
                "category": "health",
                "name": "Always Active",
                "parameters": {
                  "perspective": "self",
                  "percentage": 100,
                  "comparison": "greater_than",
                  "triggerChance": 100
                }
              }
            ]
          },
          "triggerRole": {
            "mode": "CONDITIONAL",
            "activationDelay": 0,
            "requiresLOS": false
          }
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 2
        },
        "gold": {
          "min": 10,
          "max": 40
        },
        "silver": {
          "min": 30,
          "max": 100
        },
        "copper": {
          "min": 60,
          "max": 200
        }
      },
      "items": [
        {
          "itemId": "wooden-haft",
          "dropChance": 35,
          "quantity": {
            "min": 3,
            "max": 8
          }
        },
        {
          "itemId": "bitterroot",
          "dropChance": 25,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "fieldleaf",
          "dropChance": 30,
          "quantity": {
            "min": 4,
            "max": 8
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "morok",
    "name": "Bog Hag",
    "description": "A reclusive hag living in the deep peat bogs. An old woman who brews moss remedies in the swamp.",
    "type": CREATURE_TYPES.UNDEAD,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "undead",
      "bryngloom",
      "wyrd-creature",
      "darkness",
      "blight"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#0A0A0A",
    "stats": {
      "strength": 0,
      "agility": 6,
      "constitution": 0,
      "intelligence": 4,
      "spirit": 8,
      "charisma": 2,
      "maxHp": 1,
      "currentHp": 1,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 1,
      "currentActionPoints": 1,
      "initiative": 2,
      "speed": 15,
      "flying": 0,
      "swimming": 0,
      "sightRange": 0,
      "darkvision": 0
    },
    "resistances": {
      "physical": 100,
      "rime": 100,
      "blight": 100,
      "wyrd": 100
    },
    "vulnerabilities": {
      "ember": 200,
      "ember": 200
    },
    "abilities": [
      {
        "id": "morok_stain",
        "name": "Morok-Stain",
        "description": "Touching the Morok leaves a dark patch on the skin that spreads, blurring the line between living and dead.",
        "level": 2,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_grasp",
        "effectTypes": [
          "damage",
          "debuff"
        ],
        "tags": [
          "blight",
          "drain",
          "touch"
        ],
        "flavorText": "The stain does not heal. It simply waits for you to forget it was new.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "touch",
          "rangeDistance": 5,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "2d6",
          "damageTypes": [
            "blight"
          ],
          "damageType": "direct",
          "elementType": "blight",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": true
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "death_stain",
              "name": "Morok-Stain",
              "description": "A spreading darkness that erodes vitality.",
              "mechanicsText": "-3 Spirit for 24 rounds. Stacks up to 3 times.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "spirit",
                  "constitution"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "spirit",
              "magnitude": -3,
              "magnitudeType": "flat"
            },
            {
              "stat": "constitution",
              "magnitude": -1,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 24,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": false,
          "saveDC": 14,
          "saveType": "constitution",
          "saveOutcome": "negates"
        },
        "resourceCost": {
          "actionPoints": 0
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 3,
          "max": 10
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "ground-bone",
          "dropChance": 25,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
      {
    "id": "vatra",
    "name": "Vatra",
    "description": "A tiny, scurrying wood sprite with mossy swamp hair that nests in hollow trees. It carries a highly prized, warm glowing sap and communicates in wooden clicks.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "fey",
      "bryngloom",
      "wyrd-creature",
      "woodland",
      "sprite",
      "scurry"
    ],
    "tokenIcon": "Bestiary/vatra",
    "tokenBorder": "#00FF00",
    "stats": {
      "strength": 6,
      "agility": 18,
      "constitution": 10,
      "intelligence": 12,
      "spirit": 14,
      "charisma": 12,
      "maxHp": 45,
      "currentHp": 45,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 40,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "blight": 50,
      "blight": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Scurry",
        "description": "Moves rapidly without triggering opportunity attacks.",
        "type": "spell",
        "spellType": "CONJURATION",
        "level": 1,
        "icon": "spell_nature_strengthofearth",
        "range": 50,
        "actionPointCost": 1,
        "cooldown": 1
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 1
        },
        "silver": {
          "min": 2,
          "max": 8
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "warm-gold-sap",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-11T20:22:00Z",
    "lastModified": "2026-06-11T20:22:00Z"
  },
  {
    "id": "vyraj",
    "name": "Swamp Hydra",
    "description": "A multi-headed marsh serpent guarding ancient ruins. A giant reptile that defends the deep peat gates.",
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "fiend",
      "bryngloom",
      "wyrd-creature",
      "law",
      "paradox",
      "boss"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#4B0082",
    "stats": {
      "strength": 18,
      "agility": 14,
      "constitution": 22,
      "intelligence": 20,
      "spirit": 18,
      "charisma": 16,
      "maxHp": 300,
      "currentHp": 300,
      "maxMana": 60,
      "currentMana": 60,
      "maxActionPoints": 6,
      "currentActionPoints": 6,
      "initiative": 4,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 120
    },
    "resistances": {
      "physical": 75,
      "wyrd": 100,
      "blight": 50
    },
    "vulnerabilities": {
      "ember": 75,
      "blight": 75
    },
    "abilities": [
      {
        "id": "vyraj_clause_strike",
        "name": "Clause-Strike",
        "description": "An impact of pure legal force that strikes with the weight of every violated contract in history.",
        "level": 5,
        "spellType": "EVOCATION",
        "icon": "ability_warrior_shieldbreak",
        "effectTypes": [
          "damage",
          "control"
        ],
        "tags": [
          "storm",
          "stun",
          "melee"
        ],
        "flavorText": "You have broken terms you never agreed to. The penalty is retroactive.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "melee",
          "rangeDistance": 10,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "damageConfig": {
          "formula": "3d10 + 6",
          "damageTypes": [
            "storm"
          ],
          "damageType": "direct",
          "elementType": "storm",
          "resolution": "DICE",
          "canCrit": true,
          "critMultiplier": 3,
          "critDiceOnly": false
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "moderate",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 18,
          "saveType": "constitution",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "clause_stun",
              "name": "Stunned",
              "description": "Staggered by the weight of violated terms.",
              "mechanicsText": "Stunned for 1 round on failed Constitution DC 18 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        }
      },
      {
        "id": "vyraj_paradox_field",
        "name": "Paradox Field",
        "description": "Creates a zone where logic breaks down â€” coordination becomes impossible and agreements are unmade.",
        "level": 6,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_silence",
        "effectTypes": [
          "control",
          "debuff",
          "aoe"
        ],
        "tags": [
          "wyrd",
          "area",
          "confuse",
          "paradox"
        ],
        "flavorText": "In this zone, A equals not-A. Every agreement you have ever made is unmade.",
        "resolution": "COINS",
        "specialMechanics": {
          "coinFlip": {
            "heads": {
              "effect": "logic_break",
              "description": "Heads: Complete paradox. Target confused for 2 rounds AND -4 Charisma."
            },
            "tails": {
              "effect": "agreement_unmade",
              "description": "Tails: One buff or enchantment on the target is dispelled. -3 Charisma for 1 round."
            }
          },
          "gamblingGame": {
            "gameType": "coin_flip",
            "resolution": "COINS",
            "rules": {
              "flipCount": 2
            },
            "outcomeTiers": [
              {
                "condition": "ALL_HEADS",
                "name": "Total Paradox",
                "description": "Reality fractures. All targets confused for 2 rounds. All buffs in zone dispelled.",
                "confuseDuration": 2,
                "dispelAll": true
              },
              {
                "condition": "MAJORITY_HEADS",
                "name": "Logic Failure",
                "description": "Confused for 1 round and -4 Charisma for 2 rounds.",
                "confuseDuration": 1,
                "charismaDrain": 4
              },
              {
                "condition": "MAJORITY_TAILS",
                "name": "Agreement Broken",
                "description": "One random buff dispelled per target. -3 Charisma for 1 round.",
                "dispelOne": true,
                "charismaDrain": 3
              },
              {
                "condition": "ALL_TAILS",
                "name": "The Clause Holds",
                "description": "The paradox fails to manifest. No effect."
              }
            ]
          }
        },
        "targetingConfig": {
          "targetingType": "area",
          "rangeType": "self_centered",
          "rangeDistance": 0,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": false,
          "aoeShape": "circle",
          "aoeParameters": {
            "radius": 30
          }
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "paradox_charisma",
              "name": "Identity Eroded",
              "description": "The paradox erodes sense of self.",
              "mechanicsText": "-3 Charisma for 1 round on successful save.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "charisma"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "charisma",
              "magnitude": -3,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 1,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": true
        },
        "controlConfig": {
          "controlType": "incapacitation",
          "strength": "strong",
          "duration": 1,
          "durationUnit": "rounds",
          "saveDC": 16,
          "saveType": "intelligence",
          "savingThrow": true,
          "saveOutcome": "negates",
          "effects": [
            {
              "id": "paradox_confusion",
              "name": "Confused",
              "description": "Logic itself breaks down in the field.",
              "mechanicsText": "Confused for 1 round on failed Intelligence DC 16 save."
            }
          ]
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 3
        }
      },
      {
        "id": "vyraj_devour_agreement",
        "name": "Devour Agreement",
        "description": "Consumes a buff, magical effect, or tactical advantage from the target. The devoured contract fuels the Vyraj.",
        "level": 6,
        "spellType": "ENCHANTMENT",
        "icon": "spell_shadow_soulleech",
        "effectTypes": [
          "debuff",
          "buff",
          "summoning"
        ],
        "tags": [
          "dispel",
          "drain",
          "ranged"
        ],
        "flavorText": "It eats the terms you agreed to. Without them, you are less than you were.",
        "resolution": "DICE",
        "targetingConfig": {
          "targetingType": "single",
          "rangeType": "ranged",
          "rangeDistance": 20,
          "targetRestrictions": [
            "enemy",
            "creature"
          ],
          "requiresLineOfSight": true
        },
        "debuffConfig": {
          "debuffType": "statReduction",
          "effects": [
            {
              "id": "agreement_consumed",
              "name": "Terms Violated",
              "description": "Every contract the target relied on is eaten.",
              "mechanicsText": "-2 to all stats for 3 rounds. Dispel one buff.",
              "statusEffect": {
                "penaltyType": "flat_penalty",
                "affectedStats": [
                  "all"
                ]
              }
            }
          ],
          "statPenalties": [
            {
              "stat": "strength",
              "magnitude": -2,
              "magnitudeType": "flat"
            },
            {
              "stat": "agility",
              "magnitude": -2,
              "magnitudeType": "flat"
            },
            {
              "stat": "constitution",
              "magnitude": -2,
              "magnitudeType": "flat"
            },
            {
              "stat": "intelligence",
              "magnitude": -2,
              "magnitudeType": "flat"
            },
            {
              "stat": "spirit",
              "magnitude": -2,
              "magnitudeType": "flat"
            },
            {
              "stat": "charisma",
              "magnitude": -2,
              "magnitudeType": "flat"
            }
          ],
          "durationValue": 3,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "canBeDispelled": false,
          "saveDC": 18,
          "saveType": "spirit",
          "saveOutcome": "negates"
        },
        "buffConfig": {
          "buffType": "statEnhancement",
          "effects": [
            {
              "id": "contract_fed",
              "name": "Contract-Absorbed",
              "description": "The Vyraj grows stronger from the devoured agreement.",
              "mechanicsText": "+2 Strength and +2 Intelligence for 3 rounds.",
              "statModifier": {
                "stat": "strength",
                "magnitude": 2,
                "magnitudeType": "flat"
              }
            }
          ],
          "durationValue": 3,
          "durationType": "rounds",
          "durationUnit": "rounds",
          "concentrationRequired": false,
          "canBeDispelled": false
        },
        "summoningConfig": {
          "creatureType": "fiend",
          "creatures": [
            {
              "id": "paradox_clause",
              "name": "Paradox Clause",
              "description": "A floating fragment of consumed contract that attacks independently.",
              "size": CREATURE_SIZES.SMALL,
              "type": CREATURE_TYPES.FIEND,
              "tokenIcon": "spell_shadow_soulleech",
              "stats": {
                "maxHp": 20,
                "maxMana": 0
              },
              "config": {
                "quantity": 2,
                "duration": 3,
                "durationUnit": "rounds",
                "hasDuration": true,
                "concentration": false,
                "controlType": "autonomous",
                "controlRange": 20,
                "abilities": "Attacks nearest creature for 1d8 force damage. Dispel one buff on hit."
              }
            }
          ],
          "duration": 3,
          "durationUnit": "rounds",
          "hasDuration": true,
          "concentration": false,
          "controlRange": 20,
          "controlType": "autonomous",
          "maxSummons": 4
        },
        "resourceCost": {
          "actionPoints": 4
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 4
        }
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 2,
          "max": 8
        },
        "gold": {
          "min": 30,
          "max": 100
        },
        "silver": {
          "min": 80,
          "max": 250
        },
        "copper": {
          "min": 200,
          "max": 500
        }
      },
      "items": [
        {
          "itemId": "arcane-dust",
          "dropChance": 55,
          "quantity": {
            "min": 4,
            "max": 8
          }
        },
        {
          "itemId": "soul-fragment",
          "dropChance": 30,
          "quantity": {
            "min": 2,
            "max": 4
          }
        },
        {
          "itemId": "shadow-residue",
          "dropChance": 20,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "pooka",
    "name": "Pooka",
    "description": "A wild fey creature of Celtic-Grimm folklore. A mischievous shapeshifting sprite that takes the form of a sleek black pony or a wild hare. It enjoys leading travelers on wild, fast chases through the woods but avoids causing direct harm.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "frostwood",
      "wyrd-creature",
      "shapeshifter",
      "briar"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#DAA520",
    "stats": {
      "strength": 14,
      "agility": 18,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 14,
      "charisma": 14,
      "maxHp": 80,
      "currentHp": 80,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 50,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "wyrd": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Lure of the Briar",
        "description": "Forces a target to climb on its back or follow it into difficult terrain.",
        "type": CREATURE_TYPES.SPELL,
        "spellType": "ENCHANTMENT",
        "level": 3,
        "icon": "spell_shadow_mindsteal",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": CREATURE_TYPES.SAVE,
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": CREATURE_TYPES.CONDITION,
              "condition": "charmed",
              "duration": 2
            }
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 2,
          "max": 8
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 20,
          "max": 50
        }
      },
      "items": []
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "tatzelwurm",
    "name": "Tatzelwurm",
    "description": "A cat-headed serpentine drake inhabiting deep crevasses. A rare serpentine dragon that hunts alpine rodents. It is venomous but reclusive.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "beast",
      "nordhalla",
      "wyrd-creature",
      "serpent",
      "rime"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 12,
      "agility": 16,
      "constitution": 14,
      "intelligence": 6,
      "spirit": 10,
      "charisma": 4,
      "maxHp": 90,
      "currentHp": 90,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 35,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 100,
      "blight": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Poisonous Breath",
        "description": "Exhales a freezing, poisonous cone of air.",
        "type": CREATURE_TYPES.SPELL,
        "spellType": "CONJURATION",
        "level": 3,
        "icon": "spell_frost_frostbrand",
        "range": 15,
        "actionPointCost": 3,
        "cooldown": 2,
        "effects": [
          {
            "type": CREATURE_TYPES.DAMAGE,
            "damageType": "rime",
            "formula": "2d6"
          },
          {
            "type": CREATURE_TYPES.DAMAGE,
            "damageType": "blight",
            "formula": "1d6"
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 1,
          "max": 5
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "tatzelwurm-gallstone",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "ba-spirit",
    "name": "Ba-Spirit",
    "description": "A traditional Egyptian/Mesopotamian bird-spirit watching over ruined sun altars. A bird with a human head that sits on ancient pillars, emitting warm light.",
    "type": CREATURE_TYPES.UNDEAD,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "undead",
      "sundale",
      "wyrd-creature",
      "spirit",
      "solvarn"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 4,
      "agility": 14,
      "constitution": 10,
      "intelligence": 12,
      "spirit": 16,
      "charisma": 14,
      "maxHp": 30,
      "currentHp": 30,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 3,
      "speed": 15,
      "flying": 30,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "ember": 100,
      "blight": 100
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Mournful Hymn",
        "description": "Fills targets with deep sorrow, causing disadvantage on attack rolls.",
        "type": CREATURE_TYPES.SPELL,
        "spellType": "ENCHANTMENT",
        "level": 1,
        "icon": "spell_holy_powerwordshield",
        "range": 60,
        "actionPointCost": 2,
        "cooldown": 2,
        "effects": [
          {
            "type": CREATURE_TYPES.SAVE,
            "attribute": "spirit",
            "dc": 12,
            "onFail": {
              "type": CREATURE_TYPES.CONDITION,
              "condition": "slowed",
              "duration": 2
            }
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 2,
          "max": 8
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "golden-ash",
          "dropChance": 70,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "yemoja-sentinel",
    "name": "Yemoja Sentinel",
    "description": "A construct of sea shell and coral reefs embodying the protective spirit of the deep. A large shell-construct that protects coral beds from predators.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "construct",
      "iceheart",
      "wyrd-creature",
      "coral",
      "sentinel"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#00CED1",
    "stats": {
      "strength": 20,
      "agility": 10,
      "constitution": 18,
      "intelligence": 10,
      "spirit": 14,
      "charisma": 10,
      "maxHp": 160,
      "currentHp": 160,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 1,
      "speed": 20,
      "flying": 0,
      "swimming": 30,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 50,
      "rime": 50
    },
    "vulnerabilities": {
      "storm": 50
    },
    "abilities": [
      {
        "name": "Coral Fist",
        "description": "Deals heavy bludgeoning damage and inflicts bleeding.",
        "type": CREATURE_TYPES.MELEE,
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 2,
          "diceType": 10,
          "bonus": 6,
          "damageType": "physical"
        },
        "range": 10,
        "actionPointCost": 2,
        "cooldown": 0
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 1,
          "max": 3
        },
        "gold": {
          "min": 20,
          "max": 50
        },
        "silver": {
          "min": 50,
          "max": 100
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "bioluminescent-gem",
          "dropChance": 40,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "kamaitachi",
    "name": "Kama-Itachi",
    "description": "A fast, weasel-like yokai riding the glacial winds. A swift weasel with razor claws that slashes glacial drafts.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "monstrosity",
      "cragjaw",
      "wyrd-creature",
      "wind",
      "sickle"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#8A2BE2",
    "stats": {
      "strength": 10,
      "agility": 20,
      "constitution": 12,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 6,
      "maxHp": 100,
      "currentHp": 100,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 4,
      "speed": 50,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Sickle Strike",
        "description": "Slashes with razor-sharp copper claws, causing bleeding.",
        "type": CREATURE_TYPES.MELEE,
        "icon": "ability_ghoulfrenzy",
        "damage": {
          "diceCount": 2,
          "diceType": 8,
          "bonus": 4,
          "damageType": "physical"
        },
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 0
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 5,
          "max": 15
        },
        "silver": {
          "min": 15,
          "max": 40
        },
        "copper": {
          "min": 30,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "copper-sickle-claw",
          "dropChance": 60,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "qilin",
    "name": "Steppe Qilin",
    "description": "A draconic deer covered in starry golden scales. A peaceful protector seen only during winter migrations.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "fey",
      "sundrift",
      "wyrd-creature",
      "starlight",
      "guardian"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 16,
      "agility": 18,
      "constitution": 16,
      "intelligence": 14,
      "spirit": 20,
      "charisma": 18,
      "maxHp": 180,
      "currentHp": 180,
      "maxMana": 60,
      "currentMana": 60,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 3,
      "speed": 45,
      "flying": 0,
      "swimming": 0,
      "sightRange": 120,
      "darkvision": 120
    },
    "resistances": {
      "ember": 100,
      "rime": 100
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Starry Breath",
        "description": "Exhales radiant starry light that blinds enemies.",
        "type": CREATURE_TYPES.SPELL,
        "spellType": "EVOCATION",
        "level": 5,
        "icon": "spell_holy_mindvision",
        "range": 30,
        "actionPointCost": 3,
        "cooldown": 2,
        "effects": [
          {
            "type": CREATURE_TYPES.DAMAGE,
            "damageType": "ember",
            "formula": "4d8"
          },
          {
            "type": CREATURE_TYPES.SAVE,
            "attribute": "spirit",
            "dc": 15,
            "onFail": {
              "type": CREATURE_TYPES.CONDITION,
              "condition": "blinded",
              "duration": 1
            }
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 2,
          "max": 5
        },
        "gold": {
          "min": 30,
          "max": 80
        },
        "silver": {
          "min": 100,
          "max": 200
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "qilin-golden-scale",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "leshy",
    "name": "Leshy Shepherd",
    "description": "A mossy forest warden keeping the balance of life. A large peat-wood guardian who shepherds the wild beasts.",
    "type": CREATURE_TYPES.PLANT,
    "size": CREATURE_SIZES.HUGE,
    "tags": [
      "plant",
      "bryngloom",
      "wyrd-creature",
      "woodland",
      "guardian"
    ],
    "tokenIcon": "Bestiary/placeholder",
    "tokenBorder": "#008000",
    "stats": {
      "strength": 20,
      "agility": 10,
      "constitution": 20,
      "intelligence": 12,
      "spirit": 16,
      "charisma": 10,
      "maxHp": 200,
      "currentHp": 200,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 1,
      "speed": 25,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 50
    },
    "vulnerabilities": {
      "ember": 100
    },
    "abilities": [
      {
        "name": "Peat-Wood Club",
        "description": "Strikes with a massive wooden club.",
        "type": CREATURE_TYPES.MELEE,
        "icon": "ability_warrior_decisivestrike",
        "damage": {
          "diceCount": 3,
          "diceType": 8,
          "bonus": 6,
          "damageType": "physical"
        },
        "range": 15,
        "actionPointCost": 2,
        "cooldown": 0
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 1,
          "max": 2
        },
        "gold": {
          "min": 15,
          "max": 40
        },
        "silver": {
          "min": 40,
          "max": 80
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "glowing-peat-flower",
          "dropChance": 40,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.320Z",
    "lastModified": "2026-06-06T20:28:54.320Z"
  },
  {
    "id": "udu",
    "name": "Udu",
    "description": "A soot-sweeping desert rodent seeking geothermal warmth. It is covered in soft, dusty ash-colored fur and has a basalt horn and smoldering tail.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "beast",
      "sundale",
      "wyrd-creature",
      "soot",
      "hearth",
      "imp"
    ],
    "tokenIcon": "Bestiary/udu",
    "tokenBorder": "#FF8C00",
    "stats": {
      "strength": 4,
      "agility": 16,
      "constitution": 10,
      "intelligence": 6,
      "spirit": 12,
      "charisma": 10,
      "maxHp": 25,
      "currentHp": 25,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "ember": 50
    },
    "vulnerabilities": {
      "rime": 50
    },
    "abilities": [
      {
        "name": "Soot Cloud",
        "description": "Kicks up a cloud of ash to blind nearby creatures.",
        "type": "spell",
        "spellType": "CONJURATION",
        "level": 1,
        "icon": "spell_shadow_mindsteal",
        "range": 10,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 12,
            "onFail": {
              "type": "CONDITION",
              "condition": "blinded",
              "duration": 1
            }
          }
        ]
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "sulfur-salt",
          "dropChance": 40,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-11T20:00:00Z",
    "lastModified": "2026-06-11T20:00:00Z"
  },
  {
    "id": "skerry",
    "name": "Skerry",
    "description": "A stout, greedy, dwarf-like water sprite that repairs or sabotages ships along the frozen fjord coasts, obsessed with salvaging sunken gold and copper.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "fey",
      "nordhalla",
      "wyrd-creature",
      "dwarf",
      "shipwright",
      "greedy"
    ],
    "tokenIcon": "Bestiary/skerry",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 16,
      "agility": 12,
      "constitution": 16,
      "intelligence": 12,
      "spirit": 14,
      "charisma": 8,
      "maxHp": 120,
      "currentHp": 120,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 25,
      "flying": 0,
      "swimming": 30,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 100,
      "physical": 25
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Rivet Hammer",
        "description": "Strikes with a heavy iron mallet, ignoring partial armor.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 2,
          "diceType": 8,
          "bonus": 4,
          "damageType": "physical"
        },
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 0
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 2,
          "max": 10
        },
        "silver": {
          "min": 10,
          "max": 40
        },
        "copper": {
          "min": 20,
          "max": 80
        }
      },
      "items": [
        {
          "itemId": "salvaged-copper",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-11T20:15:00Z",
    "lastModified": "2026-06-11T20:15:00Z"
  }
];

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

