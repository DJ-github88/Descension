// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

// Library version - increment this to force store updates
export const CREATURE_LIBRARY_VERSION = '2.5.0';

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
      "maxHp": 120,
      "currentHp": 120,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 1,
      "speed": 25,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 10
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "merchant-appraisal",
        "name": "Merchant Appraisal",
        "description": "Appraises metalwork instantly, determining its exact value and craftsmanship.",
        "level": 1,
        "spellType": "DIVINATION",
        "icon": "inv_misc_gem_pearl_04",
        "actionPointCost": 1,
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
          "max": 20
        },
        "silver": {
          "min": 20,
          "max": 100
        },
        "copper": {
          "min": 100,
          "max": 500
        }
      },
      "items": [
        {
          "itemId": "iron-ingot",
          "dropChance": 100,
          "quantity": {
            "min": 2,
            "max": 6
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "lyra-moonwhisper-merchant",
    "name": "Lyra Moonwhisper",
    "description": "An elegant elven alchemist surrounded by the sweet scent of crushed herbs and bubbling potions. Lyra operates \"The Astral Elixir,\" a shop stocked with vials of glowing liquids. She is soft-spoken but possesses vast botanical knowledge.",
    "type": CREATURE_TYPES.HUMANOID,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "elf",
      "merchant",
      "alchemist",
      "herbalist",
      "friendly"
    ],
    "tokenIcon": "inv_misc_head_elf_01",
    "tokenBorder": "#DDA0DD",
    "stats": {
      "strength": 9,
      "agility": 14,
      "constitution": 11,
      "intelligence": 18,
      "spirit": 15,
      "charisma": 16,
      "maxHp": 85,
      "currentHp": 85,
      "maxMana": 100,
      "currentMana": 100,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "blight": 25
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "alchemist-knowledge",
        "name": "Alchemist Knowledge",
        "description": "Identifies potions and herbs by smell or touch.",
        "level": 1,
        "spellType": "DIVINATION",
        "icon": "inv_potion_93",
        "actionPointCost": 1,
        "cooldown": 0
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
          "max": 30
        },
        "silver": {
          "min": 40,
          "max": 120
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "minor-healing-potion",
          "dropChance": 100,
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
    "id": "thaddeus-quickcoin-merchant",
    "name": "Thaddeus Quickcoin",
    "description": "A shrewd human merchant clad in fine silks, his fingers adorned with gold rings. Thaddeus operates a general store, buying and selling everything from rations to rare trinkets. He loves gold and will haggle fiercely for a profit.",
    "type": CREATURE_TYPES.HUMANOID,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "human",
      "merchant",
      "trader",
      "shopkeeper",
      "friendly"
    ],
    "tokenIcon": "inv_misc_bag_07",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 10,
      "agility": 12,
      "constitution": 12,
      "intelligence": 14,
      "spirit": 13,
      "charisma": 18,
      "maxHp": 90,
      "currentHp": 90,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 0
    },
    "resistances": {
      "wyrd": 15
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "id": "merchant-haggle",
        "name": "Merchant Haggle",
        "description": "Applies discount or premium based on a successful charisma check.",
        "level": 1,
        "spellType": "ENCHANTMENT",
        "icon": "inv_misc_coin_02",
        "actionPointCost": 1,
        "cooldown": 0
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 2
        },
        "gold": {
          "min": 20,
          "max": 50
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
          "itemId": "silk-cloth",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-06T20:28:54.318Z",
    "lastModified": "2026-06-06T20:28:54.318Z"
  },
  {
    "id": "gref",
    "name": "Gref",
    "description": "A small, stooped goblin-like memory collector that trades lost keys and trinkets for travelers' memories.",
    "origin": "In the world of Mythrill, the Frostwood Reach was once the heartland of the Seelie Accord, a pact between ancient human settlers and the Fair Folk who wandered the twilight borders between waking and dream. When the Wyrd corruption seeped through the world's fractures, it twisted the memory-keeping traditions of the Seelie into something bittersweet. Gref is one of the many 'twilight merchants' born from this corruption—spirits that once guided lost travelers to safety, now cursed to collect fragments of mortal memory to sustain their own fading existence. In Frostwood Reach, where the sun rarely pierces the perpetual mist, the locals leave small offerings of copper and old keys at crossroads, hoping to appease the memory-merchants rather than face the empty silence of forgetting.",
    "nature": "A small, stooped goblin-like creature no taller than a child, dressed in tattered canvas that was once a shepherd's cloak. Its skin is the color of dried birch bark, and its eyes are milky white with no visible pupils—yet it sees perfectly well in the twilight gloom. Gref pushes a squeaking wooden barrow filled with rusted keys, old letters sealed with wax, and iron trinkets that once belonged to forgotten travelers. It speaks in a soft, whispering sigh that sounds like wind through autumn leaves, and it avoids physical conflict entirely, preferring to vanish into the mist when threatened.",
    "habitat": "Gref roams the misty crossroads and forest paths of the Frostwood Reach at twilight, especially near the ancient trade routes that connect the small villages of Drunhold and the Grimmwood. It is drawn to places where strong emotions have been felt—graveyards, abandoned campsites, and the thresholds of homes where someone has recently departed. The locals know that if Gref appears at your door, it means someone in the household has forgotten something important, and the spirit has come to trade it back.",
    "depth": "Gref is entirely peaceful, but its existence is a tragic one. It only seeks to return lost objects to those who can recall their significance, feeding on the emotional energy of the recalled memory. Without these memories, Gref and its kind would fade into the mist forever, becoming nothing more than the whispers that travelers sometimes hear on the wind. The memory-merchants are a reminder that in the Frostwood, even forgetting has a price, and the Wyrd corruption has turned something once beautiful into a cycle of gentle exploitation.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "fey",
      "frostwood",
      "wyrd-creature",
      "merchant",
      "goblin"
    ],
    "tokenIcon": "Bestiary/gref",
    "tokenBorder": "#CD7F32",
    "stats": {
      "strength": 8,
      "agility": 14,
      "constitution": 10,
      "intelligence": 12,
      "spirit": 14,
      "charisma": 16,
      "maxHp": 40,
      "currentHp": 40,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "wyrd": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Memory Trade",
        "description": "Forces a target to make a Spirit save or forget a minor detail, giving Gref full evasion.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "level": 2,
        "icon": "spell_shadow_mindsteal",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "min": 1,
          "max": 4
        },
        "silver": {
          "min": 10,
          "max": 25
        },
        "copper": {
          "min": 20,
          "max": 50
        }
      },
      "items": [
        {
          "itemId": "rusty-key",
          "dropChance": 80,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "oillipheist",
    "name": "Oilliph\u00e9ist",
    "description": "A blind, segmented swamp eel-serpent made of river-silt and rotting green moss, hunting vibrations in peat-pools.",
    "origin": "The Oillipheist is a creature born from the fusion of ancient Irish water-dragon myths and the cold reality of the Frostwood Reach's peat-bogs. In the Age of the First Fae, the great serpents of the Oillipheist kind were guardians of sacred rivers, their scales gleaming with the light of the setting sun. When the Wyrd broke the world's boundaries, the Frostwood's endless cold and darkness twisted these noble guardians into blind, segmented eels that lurk in the stagnant pools, their once-magnificent forms reduced to something primal and hungering. The Drun fishermen speak of the 'silt-serpents' as cursed spirits of those who drowned in the bogs during the Long Winter, their bodies fused with the peat and moss to become something that is neither living nor dead.",
    "nature": "A blind, segmented eel-serpent approximately six feet long, its body composed of river-silt, rotting green moss, and the fossilized remains of ancient bog-plants. It lacks eyes entirely, navigating by sensing vibrations and blood-heat through the water with specialized sensory organs along its flanks. Its mouth is a circular maw ringed with tiny, needle-like teeth that can grip with the strength of a spring-trap. When submerged, it is nearly invisible, its silt-colored body blending perfectly with the dark peat-water. The creature emits a low, thrumming vibration that can be felt through the soles of boots before it strikes.",
    "habitat": "The Oillipheist haunts the stagnant peat-pools and boggy rivers of the Frostwood Reach, particularly in the Siltmire Flats where the ancient peat has turned the water into a thick, black soup. It prefers pools where the water is deep enough to hide its full length but shallow enough to trap prey. During the rare warm months, the serpents become sluggish and retreat to the deepest pools, but in the winter they grow aggressive, driven by the need to store fat for the long cold.",
    "depth": "They are simple, instinct-driven predators that keep the swamp waters free of bloated carcasses, feeding on anything that disturbs their pool. The Wyrd's corruption did not grant them malice, only hunger. Some scholars believe that the Oillipheist's blindness is a mercy—that if they could see the world they now inhabit, they would die of sorrow. The silt that makes up their bodies is the same silt that preserves the bodies of ancient warriors in the bogs, and there are tales of serpents that have swallowed bones whole, carrying the memories of the dead in their bellies.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "monstrosity",
      "frostwood",
      "wyrd-creature",
      "swamp",
      "eel"
    ],
    "tokenIcon": "Bestiary/oillipheist",
    "tokenBorder": "#2E8B57",
    "stats": {
      "strength": 12,
      "agility": 16,
      "constitution": 14,
      "intelligence": 4,
      "spirit": 12,
      "charisma": 4,
      "maxHp": 75,
      "currentHp": 75,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 25,
      "flying": 0,
      "swimming": 40,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Silt Grasp",
        "description": "Grapples target and drags them into the water.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 1,
          "diceType": 8,
          "bonus": 3,
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
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 1
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
          "itemId": "swamp-slime",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "grimmstalk",
    "name": "Grimmstalk",
    "description": "A tall, wood-plated dryad with a hollow bird-skull head filled with black feathers that moves through the forest canopy.",
    "origin": "The Grimmstalks are the forest's grief given form. In the deep history of the Frostwood Reach, before the first human axe touched the ironwood trees, the forest was home to a race of dryads who sang to the trees and kept them healthy through the long winters. When the Wyrd descended, the forest's pain at the loss of so many trees to logging and the relentless cold coalesced into the Grimmstalks—dark, wood-plated guardians who carry the skulls of the birds that once nested in the highest branches. They are not the dryads of old, but something born from the forest's desire for vengeance and protection. The loggers of Frostwood call them 'the hollow watchers' and know that to cut a tree marked with a Grimmstalk's sigil is to invite death from above.",
    "nature": "A tall, wood-plated humanoid sprite standing nearly seven feet tall, its bark-like plates fitting together like natural armor. Its head is a hollow bird-skull, inside which beats a mass of dark, rustling black feathers that create a sound like dry leaves in a windstorm. The plates of its body are made of ironwood bark, harder than steel and etched with the natural runes of the forest. It moves silently through the high canopy, its long limbs allowing it to swing between branches with the grace of an ape. When it speaks, the sound is a hollow, wind-like whistling made by forcing air through its skull-head, a warning to woodcutters before it attacks.",
    "habitat": "The Grimmstalks dwell exclusively in the highest branches of the oldest ironwood and pine trees in the Frostwood Reach, particularly in the Grimmwood Proper where the trees have stood for ten thousand years. They never touch the ground if they can avoid it, and their territory is marked by small piles of bird bones at the base of the trees they guard. They are most active during the spring, when the sap runs and the trees are most vulnerable to cutting, and during the autumn, when the falling leaves make the forest floor noisy enough to mask their approach.",
    "depth": "A strict and reclusive forest protector, the Grimmstalk is not evil but uncompromising. It communicates with the forest through the roots of the trees, feeling the pain of every cut and the joy of every new growth. The black feathers inside its skull are said to be the spirits of the birds that once sang in the forest's canopy, and when a Grimmstalk dies, the feathers scatter to the wind, carrying the forest's song to new trees. The Wyrd's corruption gave the forest a voice of anger, but the Grimmstalks remember the songs of joy, and some say that if the forest is ever healed, they will sing again.",
    "type": CREATURE_TYPES.PLANT,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "plant",
      "frostwood",
      "wyrd-creature",
      "dryad",
      "guardian"
    ],
    "tokenIcon": "Bestiary/grimmstalk",
    "tokenBorder": "#556B2F",
    "stats": {
      "strength": 16,
      "agility": 18,
      "constitution": 14,
      "intelligence": 10,
      "spirit": 14,
      "charisma": 8,
      "maxHp": 140,
      "currentHp": 140,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 4,
      "speed": 35,
      "flying": 0,
      "swimming": 0,
      "sightRange": 90,
      "darkvision": 90
    },
    "resistances": {
      "physical": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Skull Stare",
        "description": "Forces a target to make a Spirit save or be paralyzed with fear.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "level": 4,
        "icon": "spell_holy_mindvision",
        "range": 40,
        "actionPointCost": 2,
        "cooldown": 2,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "slowed",
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
          "max": 1
        },
        "gold": {
          "min": 10,
          "max": 25
        },
        "silver": {
          "min": 20,
          "max": 50
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "ironwood-bark",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "pooka",
    "name": "Pooka",
    "description": "A sleek charcoal fey hare with hooves and human-like eyes that can shapeshift into a wild pony to escape.",
    "origin": "The Pooka is a creature as old as the paths of the Frostwood Reach itself. In the time before the Wyrd, when the Fair Folk walked openly among mortals, the Pooka were the guardians of the hedgerows and wild places, spirits of the untamed land that delighted in playing harmless pranks on travelers. The corruption of the Wyrd did not change their nature, but it did sharpen their sense of irony—now, the Pooka's tricks often carry a lesson, a warning, or a test of character. The farmers of the Frostwood know that a Pooka in the field means the harvest will be unpredictable, and they leave bowls of milk at the field's edge to ensure the spirit's goodwill. The Pooka is a reminder that even in a world of corruption, some things remain playful and free.",
    "nature": "A sleek, charcoal-grey fey creature resembling a large hare with long, deer-like ears that can rotate independently to catch sounds from any direction. Its eyes are human-like, gleaming with intelligence and a hint of mischief, and its legs end in tiny hooves that make a soft clicking sound on stone. It can shift into a small wild pony at will, a form it uses to offer rides to travelers before bolting wildly and dropping them in peat-pools or briar patches. Its fur is always slightly damp, even in the driest weather, and it smells of crushed clover and rain.",
    "habitat": "Pookas inhabit the brambles, forest paths, and country lane hedges of the Frostwood Reach, particularly in the borderlands between the cultivated fields and the wild forest. They are drawn to places where the wild and the tame meet—abandoned orchards, overgrown hedgerows, and the edges of villages where the cobblestones give way to dirt. They are most active during the twilight hours and on moonless nights, when their dark fur makes them nearly invisible.",
    "depth": "Pookas are not inherently malicious, but they love causing confusion. They often offer rides to travelers, only to run wildly and drop them in peat-pools, teaching the lesson that one should not trust every friendly offer. The Pooka's tricks are never fatal, but they are always humiliating. Some sages believe that the Pooka is testing the character of mortals, separating the humble from the proud, and that those who laugh at their misfortune are blessed with good luck for the rest of their journey.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "fey",
      "frostwood",
      "wyrd-creature",
      "shapeshifter",
      "trickster"
    ],
    "tokenIcon": "Bestiary/pooka",
    "tokenBorder": "#8FBC8F",
    "stats": {
      "strength": 10,
      "agility": 18,
      "constitution": 12,
      "intelligence": 12,
      "spirit": 16,
      "charisma": 14,
      "maxHp": 70,
      "currentHp": 70,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 45,
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
        "name": "Shift Form",
        "description": "Shapeshifts into a fey pony to double its speed.",
        "type": "spell",
        "spellType": "TRANSMUTATION",
        "level": 2,
        "icon": "spell_nature_strengthofearth",
        "range": 5,
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
          "min": 1,
          "max": 3
        },
        "silver": {
          "min": 10,
          "max": 20
        },
        "copper": {
          "min": 15,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "braided-horsehair-necklace",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T16:10:00Z",
    "lastModified": "2026-06-12T16:10:00Z"
  },
  {
    "id": "skerry",
    "name": "Skerry",
    "description": "A stout, greedy, dwarf-like water sprite that repairs or sabotages ships along the frozen fjord coasts, obsessed with salvaging sunken gold and copper.",
    "origin": "The Skerry is a creature born from the greed of the sea and the cold of the Nordhalla fjords. In the Age of the Norse Kings, the water dwarves were the guardians of sunken treasure, spirits who ensured that the wealth of the sea was distributed according to the will of the gods. When the Wyrd broke the world, the Skerries were twisted into creatures of insatiable greed, their natural love of beauty and craftsmanship turned into an obsession with hoarding salvaged metal and gold. The sailors of Nordhalla have learned to respect the Skerries, leaving copper coins at the water's edge as a tax for safe passage, but they also fear them, for a Skerry cheated of its due will sink a ship as easily as it will repair one.",
    "nature": "A stout, broad water-sprite with waterlogged blue-grey skin that looks like wet oak. It wears a coat of salvaged sailcloth and copper sheeting, its seams stitched with kelp-fiber. Its webbed fingers end in chisel-like claws of copper, and its eyes are the color of deep water, always scanning for the glint of metal. The Skerry is highly skilled in shipbuilding, able to listen to the stresses in a ship's hull and identify the exact point of weakness. It demands silver or gold for its repairs, and if cheated, it will actively sabotage the vessel, loosening rivets and rotting timber from the inside.",
    "habitat": "The Skerry inhabits the frozen bays, ice-locked docks, and sunken shipwrecks of Nordhalla, particularly in the Sunken Fjord where the wreck of the ancient fleet lies beneath the ice. It is most active during the spring thaw, when the ice breaks and the wrecks are exposed, and during the winter storms, when ships are most likely to need repairs. The Skerries have a complex social structure based on hoard size, and the Skerry with the largest hoard is considered the king of the local waters.",
    "depth": "Sailors and shipwrights in Nordhalla keep respect the Skerries. They throw copper coins into the icy water before docking, as the cost of a clean repair is far cheaper than a sudden hull breach in the freezing open sea. The Skerry's greed is not natural—it is a curse of the Wyrd, a corruption of the water dwarf's natural love of beauty into an obsession with possession. Some sailors say that the Skerries are trying to build something from the salvaged metal, something that will allow them to return to the sea's depths and escape the cold forever.",
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
  },
  {
    "id": "nachtkrapp",
    "name": "Nachtkrapp",
    "description": "A massive, pitch-black soot-raven with a bone-head that steals fire coals and oil lamps to warm its high chimneys nests.",
    "origin": "The Nachtkrapp is a creature of the dark and the cold, born from the soot and smoke of the Nordhalla longhouses. In the Age of the Skalds, the Nachtkrapp was a bird of warning, a spirit that appeared before the fires to carry away the bad luck of the household. The Wyrd's corruption did not change its nature, but it did make it larger and more desperate, for the creature now feeds on heat itself, stealing burning coals and oil lamps to keep its nests warm. The Skalds believe that the Nachtkrapp still carries away bad luck, but that it now demands payment in the form of heat, and that a household that cannot keep its fires burning will be cursed with misfortune.",
    "nature": "A massive, pitch-black raven with a wingspan of eight feet, its wings perpetually covered in coal-dust and soot. Its head is a solid white bone skull, the eye sockets glowing with a faint, ember-like light. The creature behaves like a magpie, but instead of shiny metal, it steals burning coals, oil lamps, and warm ash. It is a domestic pest in northern keeps, but it is also a creature of habit, and it will return to the same chimney night after night, building its nest in the warm soot until the chimney is blocked and the longhouse fills with smoke.",
    "habitat": "The Nachtkrapp nests in the high chimney stacks, volcanic vents, and longhouse roof peaks of Nordhalla, particularly in the capital city of Skaldheim where the longhouses burn day and night. It is most active during the winter, when the fires are burning the brightest and the heat is most needed, and during the volcanic eruptions that occasionally shake the northern peaks. The Nachtkrapp's nest is a massive structure of soot and cinders, warm enough to hatch eggs even in the deepest winter.",
    "depth": "A domestic pest in northern keeps. While they steal precious fuel, Skalds believe they carry away domestic bad luck with the soot they scavenge, and leave small trays of tallow outside to pacify them. The Nachtkrapp's skull-head is a mystery to scholars—some say it is the skull of the first Nachtkrapp, worn by every generation as a reminder of the creature's origin. Others say that the skull is a mask, and that beneath it, the Nachtkrapp is a creature of pure fire, its true form too bright for mortal eyes to see.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "beast",
      "nordhalla",
      "wyrd-creature",
      "raven",
      "coal",
      "imp"
    ],
    "tokenIcon": "Bestiary/nachtkrapp",
    "tokenBorder": "#2F4F4F",
    "stats": {
      "strength": 10,
      "agility": 16,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 14,
      "charisma": 8,
      "maxHp": 70,
      "currentHp": 70,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 3,
      "speed": 15,
      "flying": 50,
      "swimming": 0,
      "sightRange": 80,
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
        "name": "Ash Cloud",
        "description": "Spreads a blinding wave of ash from its wings.",
        "type": "spell",
        "spellType": "CONJURATION",
        "level": 2,
        "icon": "spell_shadow_mindsteal",
        "range": 15,
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
          "max": 1
        },
        "silver": {
          "min": 4,
          "max": 10
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "soot-feather",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "glacier_gremlin",
    "name": "Glacier Gremlin",
    "description": "A tiny, blind glacier gremlin with cracked blue-ice skin that licks frozen runic stones to feed on mana.",
    "origin": "The Glacier Gremlin is a creature of the ice and the runes, born from the intersection of Alpine legends and the cold magic of Nordhalla. In the Age of the Rune-Singers, the ice was alive with spirits, small creatures that absorbed the magic of the runic stones and used it to sustain themselves. The Wyrd's corruption did not change their nature, but it did make them more desperate, for the runic stones are now few and the competition for their mana is fierce. The Glacier Gremlins are the scavengers of the ice, small creatures that lick the frozen stones to feed on the last traces of magic. The Skalds consider them pests, but they also know that the gremlins are drawn to the most powerful runes, and that their presence is a sign of ancient magic.",
    "nature": "A small, hunched gremlin about a foot tall, with skin made of cracked, translucent blue ice that shows the faint glow of the mana it has absorbed. It is blind and mouthless, using a long, icy tongue to lick the cold runic stones and absorb their power. The creature's body is constantly cold, and it leaves a trail of frost wherever it goes. They are harmless individually, but they are highly annoying, freezing boots to the ice and jamming sled runners with their cold touch. When threatened, they emit a high-pitched whistle that can shatter ice crystals.",
    "habitat": "The Glacier Gremlin inhabits the glacial cols, runic ruins, and ice sheets of Nordhalla, particularly in the Rune-Cleft Glacier where the ancient rune-singers carved their spells into the ice. It is drawn to high concentrations of runic magic, and it is most active during the dark winter months, when the aurora borealis charges the runic stones with additional power. The gremlins are territorial, and fights between rival bands over the best stones are common.",
    "depth": "They are simple elemental pests that are drawn to high concentrations of runic magic. Hunters clear them out of sled paths using torches, but the Skald scholars study them, believing that their icy tongues hold the secret to preserving the runic stones from the decay of time. The Glacier Gremlin's blindness is a blessing, for the runic stones are often too bright for mortal eyes to look upon, and the creature's ice-skin is a natural shield against the stones' radiation.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "fey",
      "nordhalla",
      "wyrd-creature",
      "ice",
      "imp",
      "mana"
    ],
    "tokenIcon": "Bestiary/glacier_gremlin",
    "tokenBorder": "#AFEEEE",
    "stats": {
      "strength": 8,
      "agility": 14,
      "constitution": 10,
      "intelligence": 8,
      "spirit": 10,
      "charisma": 6,
      "maxHp": 35,
      "currentHp": 35,
      "maxMana": 40,
      "currentMana": 40,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 2,
      "speed": 25,
      "flying": 0,
      "swimming": 0,
      "sightRange": 40,
      "darkvision": 40
    },
    "resistances": {
      "rime": 100
    },
    "vulnerabilities": {
      "ember": 100
    },
    "abilities": [
      {
        "name": "Frost Lick",
        "description": "Licks target, halving their movement speed on a failed Constitution save.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 1,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 12,
            "onFail": {
              "type": "CONDITION",
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
          "max": 0
        },
        "silver": {
          "min": 2,
          "max": 6
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "glacier-ice-shard",
          "dropChance": 70,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "nokk_stallion",
    "name": "Nokk Stallion",
    "description": "A ghostly stallion formed of river-mist and cold water that lures travelers onto its back in Nordhalla.",
    "origin": "The Nokk Stallion is a creature of the water and the mist, born from the ancient Norse legends of the Bäckahästen, the water spirit that lures the unwary to their doom. In Nordhalla, where the rivers are cold and the waterfalls are tall, the Nokk Stallions are the guardians of the waterways, spirits that protect the rivers from pollution and overfishing. The Wyrd's corruption has twisted their protective nature into something predatory, and they now lure travelers into the water not to save the river, but to feed their own hunger for the warmth of living bodies. The Nordhalla fishermen know the signs of a Nokk's presence—a mist that rises from the water even on a clear day, and the sound of hooves on stone where no horse should be.",
    "nature": "A ghostly stallion composed entirely of swirling grey river-mist, cold water droplets, and floating river-kelp. Its eyes glow like pale swamp lanterns, and its hooves make no sound on the stones, though they leave a trail of frost wherever they touch. The creature stands near deep pools and waterfalls, offering rides to travelers with a gentle whinny and a bow of its head. When a rider mounts, the Nokk's body becomes solid and cold, and it carries the victim into the deepest part of the water, where it dissolves back into mist, leaving the rider to drown.",
    "habitat": "The Nokk Stallion haunts the deep rivers, cold waterfalls, and misty lakes of Nordhalla, particularly in the Veilwater Falls where the river drops three hundred feet into a pool that is said to be bottomless. It is most active during the early morning, when the mist is thickest and the water is coldest, and during the autumn rains, when the rivers are swollen and the currents are strong. The Nokk is territorial, and each stretch of river is guarded by a single stallion that will fight to the death to protect its domain.",
    "depth": "Territorial and deceptive spirits. While dangerous, they can be pacified by playing a stringed instrument or offering a clean silver coin to the water. The Nokk's mist-body is a mystery to scholars—some say it is the spirit of a horse that drowned in the river, others that it is a manifestation of the water itself, given form by the Wyrd's corruption. The silver coin is said to remind the Nokk of the sun, which it has not seen since it was bound to the water.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "nordhalla",
      "water",
      "mist",
      "horse"
    ],
    "tokenIcon": "Bestiary/nokk_stallion",
    "tokenBorder": "#5F9EA0",
    "stats": {
      "strength": 14,
      "agility": 16,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 14,
      "charisma": 14,
      "maxHp": 90,
      "currentHp": 90,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 45,
      "flying": 0,
      "swimming": 45,
      "sightRange": 80,
      "darkvision": 120
    },
    "resistances": {
      "rime": 100
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Mist Lure",
        "description": "Seduces and charms targets, dragging them toward water.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "icon": "ability_physical_taunt",
        "range": 40,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "min": 1,
          "max": 5
        },
        "silver": {
          "min": 10,
          "max": 20
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "river-kelp",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "sirrush",
    "name": "Sirrush",
    "description": "A slender, quadrupedal dragon with feline front paws, eagle claws, and a horned, serpentine head from Sundale.",
    "origin": "The Sirrush is a creature of the ancient world, born from the Babylonian myths of the Mušḫuššu, the dragon-serpent that guarded the gates of the gods. In Sundale, where the desert sands cover the ruins of ten thousand years, the Sirrush is a rare and sacred beast, a guardian of the ancient temples and the secrets they hold. The Wyrd's corruption did not change the Sirrush's nature, but it did make it more solitary, for the creature now sees all mortals as potential thieves, and it guards its treasures with a ferocity that is legendary. The nomads of Sundale believe that the Sirrush is the reincarnation of the ancient kings, and that to kill one is to bring a curse upon ten generations.",
    "nature": "A slender, quadrupedal dragon with feline front paws, eagle-claw hind legs, and a long scaled neck ending in a horned, serpentine head. Its scales are a dusty ochre-yellow that matches the desert sands, and it has a single, straight crown-horn that glows with a faint, golden light. The Sirrush moves with the grace of a lion and the speed of a falcon, and its eyes are the color of ancient bronze, wise and wary. It is intelligent enough to recognize peaceful intentions, but it will aggressively hunt those who desecrate ancient structures.",
    "habitat": "The Sirrush dwells in the desert ruins, basalt arches, and sandy dunes of Sundale, particularly in the Valley of the Forgotten Kings where the ancient temples lie buried beneath the sand. It is most active during the dawn and dusk, when the heat is bearable and the light is golden, and during the rare rainstorms that turn the desert into a brief, blooming paradise. The Sirrush's lair is always near a source of water, for the creature is a symbol of life in the desert, and it guards the water as fiercely as it guards the ruins.",
    "depth": "Regarded as sacred guardians by local nomads. They are intelligent enough to recognize peaceful intentions but will aggressively hunt those who desecrate ancient structures. The Sirrush's crown-horn is said to be the key to the greatest temple in Sundale, a place where the gods once walked among mortals, and many have died seeking to take it. The nomads believe that the Sirrush is the last of the old guardians, and that when it dies, the desert will swallow the last of the ancient world.",
    "type": CREATURE_TYPES.DRAGON,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "dragon",
      "dragon",
      "serpent",
      "horned"
    ],
    "tokenIcon": "Bestiary/sirrush",
    "tokenBorder": "#DAA520",
    "stats": {
      "strength": 14,
      "agility": 18,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 16,
      "charisma": 12,
      "maxHp": 110,
      "currentHp": 110,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 45,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 120
    },
    "resistances": {
      "ember": 50
    },
    "vulnerabilities": {
      "rime": 25
    },
    "abilities": [
      {
        "name": "Crown Strike",
        "description": "A piercing strike with its crown horn that ignores physical armor.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 0,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d8+3"
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
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "sirrush-scale",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "aswad",
    "name": "Aswad",
    "description": "A wisp-like ember spirit nesting in a cracked, soot-blackened clay jar that spits coals when disturbed.",
    "origin": "The Aswad is a creature of the hearth and the fire, born from the Mesopotamian myths of the furnace-demons and the Zoroastrian preservation of fire. In Sundale, where the desert is cold at night and the fires burn day and night, the Aswads are the spirits of the hearth, small creatures that live in the embers and keep the fires burning. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all water as a threat, and it will attack anyone who tries to extinguish its fire. The shepherds and miners of Sundale carry embers in clay jars, and when the embers wake, they know that the Aswad has chosen to protect them.",
    "nature": "A tiny wisp residing inside a soot-blackened, cracked earthenware jar. Inside is a single, large glowing charcoal ember that acts as its eye, and it walks on small, twig-like clay legs that stick out of the bottom of the pot. The creature eats ash and soot to sustain its fire, and it emits a soft, crackling sound that is comforting to those who know it. It is harmless and cute, but it will aggressively spit embers if its jar is struck or water is thrown on it, and its rage is a terrible thing to behold.",
    "habitat": "The Aswad lives in the kitchen stoves, basalt furnaces, and ash heaps of Sundale, particularly in the nomad camps where the fires burn day and night. It is drawn to places where the fire is strong and the ash is plentiful, and it is most active during the cold desert nights, when the fire is most needed. The Aswad's jar is its home and its body, and it will defend it with its life, for without the jar, the creature is just a wisp of smoke.",
    "depth": "A harmless and cute hearth-companion. They keep stoves hot and chimneys clear, but will aggressively spit embers if their jar is struck or water is thrown on them. The Aswad's ember-eye is said to see the true nature of those who look into it, and some sages use the creatures to test the character of strangers. The Wyrd's corruption has made the Aswad more protective, but it has not dimmed its warmth, and a home with an Aswad is a home that is never cold.",
    "type": CREATURE_TYPES.ELEMENTAL,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "elemental",
      "sundale",
      "wyrd-creature",
      "jar",
      "fire",
      "hearth"
    ],
    "tokenIcon": "Bestiary/aswad",
    "tokenBorder": "#E9967A",
    "stats": {
      "strength": 4,
      "agility": 14,
      "constitution": 12,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 8,
      "maxHp": 30,
      "currentHp": 30,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 2,
      "speed": 20,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "ember": 100
    },
    "vulnerabilities": {
      "rime": 50
    },
    "abilities": [
      {
        "name": "Ember Spit",
        "description": "Spits a small glowing hot coal at a target.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 1,
          "diceType": 6,
          "bonus": 0,
          "damageType": "ember"
        },
        "range": 20,
        "actionPointCost": 1,
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
          "min": 0,
          "max": 1
        },
        "silver": {
          "min": 2,
          "max": 6
        },
        "copper": {
          "min": 5,
          "max": 20
        }
      },
      "items": [
        {
          "itemId": "clay-shards",
          "dropChance": 80,
          "quantity": {
            "min": 1,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "serpopard",
    "name": "Serpopard",
    "description": "A sleek desert leopard with a long serpentine neck that lunges at prey from the basalt canyon walls.",
    "origin": "The Serpopard is a creature of the desert shadows, born from the ancient Egyptian and Mesopotamian art that depicted feline beasts with serpentine necks. In Sundale, where the basalt canyons are deep and the sun is merciless, the Serpopards are the apex predators of the rocky wastes, creatures that have evolved to hunt in the narrow spaces between the cliffs. The Wyrd's corruption did not change their nature, but it did make them more cunning, for the creature now understands the value of ambush, and it will wait for days for the perfect moment to strike. The desert traders know the signs of a Serpopard's territory—scratches on the canyon walls, and the bones of its prey arranged in patterns that are almost artistic.",
    "nature": "A sleek, spotted desert leopard with a neck as long and flexible as a python, its head an elegant blend of feline grace and reptilian features. The creature's scales are the color of the desert rocks, and its eyes are vertical slits that glow with a faint, golden light. It moves with a silent, undulating sway, coiling its long neck before lunging from the shadows with the speed of a striking snake. The Serpopard is a solitary hunter, and it is fiercely territorial, marking its domain with the bones of its prey.",
    "habitat": "The Serpopard inhabits the basalt canyons, rocky ravines, and volcanic cliffs of Sundale, particularly in the Serpent's Spine where the canyons are narrow and the shadows are deep. It is most active during the dawn and dusk, when the light is low and the prey is active, and during the rare sandstorms that reduce visibility to zero. The Serpopard's lair is always in the highest, most inaccessible part of the canyon, and it is said to be a nest of bones and treasure, the remains of a thousand years of hunting.",
    "depth": "Lethal, solitary predators. They hunt by coiling around high basalt arches and lunging down on travelers, wrapping their long necks around the prey to crush them. The Serpopard's serpentine neck is a marvel of evolution, a combination of the leopard's strength and the snake's flexibility, and it is said that the creature can squeeze with enough force to crush stone. The Wyrd's corruption has made the Serpopard more cunning, but it has not changed its essential nature—it is a hunter, and the desert is its kingdom.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "beast",
      "sundale",
      "feline",
      "predator",
      "canyon"
    ],
    "tokenIcon": "Bestiary/serpopard",
    "tokenBorder": "#D2691E",
    "stats": {
      "strength": 16,
      "agility": 16,
      "constitution": 14,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 8,
      "maxHp": 130,
      "currentHp": 130,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 2,
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
      "rime": 25
    },
    "abilities": [
      {
        "name": "Serpentine Lunge",
        "description": "Strikes from afar with its long neck, wrapping and grappling the target.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 15,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d8+4"
          },
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "grappled",
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
          "max": 0
        },
        "silver": {
          "min": 0,
          "max": 0
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "spotted-hide",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "lamassu",
    "name": "Lamassu",
    "description": "A majestic stone sentinel with the body of a winged bull and a crowned human face, guarding tomb thresholds.",
    "origin": "The Lamassu is a creature of the ancient world, born from the Mesopotamian mythology of the protective deities that guarded the gates of the gods. In Sundale, where the temples are ancient and the seals are strong, the Lamassus are the last guardians of the old world, creatures that have stood watch for ten thousand years. The Wyrd's corruption did not change their nature, but it did make them more suspicious, for the creature now sees all who approach as potential thieves, and it will not open the gate until it is satisfied that the visitor is worthy. The scholars of Sundale study the Lamassus, trying to learn the secrets of their construction, for the creatures are made of a stone that is harder than any known material, and their runes are written in a language that has been dead for millennia.",
    "nature": "A majestic sentinel carved from volcanic basalt, featuring the body of a bull, massive eagle wings, and a crowned, bearded human face. Runic gold mortar glows in its stone joints, and its eyes are carved from a gemstone that shines with a faint, golden light. The creature stands silent at tomb doors, speaking in a low, resonant rumble that can be felt in the bones of those who hear it. It is bound to a specific location, and it cannot move more than a hundred feet from the gate it guards. The Lamassu is a creature of law and order, and it will negotiate with travelers who show knowledge of the old ways, but it will destroy any who try to force the gate.",
    "habitat": "The Lamassu stands at the ancient stone entrances, basalt temples, and sacred vaults of Sundale, particularly in the Temple of the Forgotten Gods where the greatest treasures of the old world are hidden. It is active at all times, for the creature does not sleep, and it is most dangerous during the full moon, when the runes on its body glow with a light that is blinding to mortal eyes. The Lamassu's presence is a sign that the temple is still sealed, and that the treasures within are still safe.",
    "depth": "Sacred, lawful constructs bound to protect the seals of ancient tombs. They will negotiate with travelers who show deep knowledge of historical runes or carry a royal seal. The Lamassu's gold mortar is a mystery to alchemists, for it is harder than any known metal and it glows with a light that is not fire. Some scholars believe that the mortar is made of the same material as the sun, and that the Lamassu is a piece of the sky, brought down to guard the earth.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "construct",
      "sundale",
      "winged-bull",
      "stone",
      "temple"
    ],
    "tokenIcon": "Bestiary/lamassu",
    "tokenBorder": "#FFD700",
    "stats": {
      "strength": 18,
      "agility": 10,
      "constitution": 16,
      "intelligence": 12,
      "spirit": 16,
      "charisma": 14,
      "maxHp": 150,
      "currentHp": 150,
      "maxMana": 40,
      "currentMana": 40,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 1,
      "speed": 25,
      "flying": 25,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 50,
      "ember": 50
    },
    "vulnerabilities": {
      "blight": 25
    },
    "abilities": [
      {
        "name": "Runic Stomp",
        "description": "Crushes the earth, dealing heavy damage and stunning targets.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 10,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d8+5"
          },
          {
            "type": "SAVE",
            "attribute": "constitution",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "stunned",
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
          "max": 1
        },
        "gold": {
          "min": 10,
          "max": 20
        },
        "silver": {
          "min": 0,
          "max": 0
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "basalt-stone",
          "dropChance": 100,
          "quantity": {
            "min": 2,
            "max": 4
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "pelagos",
    "name": "Pelagos",
    "description": "A sleek, hound-like sea hunter with smooth indigo-green shark skin, webbed paws, a shark tail, and glowing whiskers that sense vibrations in freezing currents.",
    "origin": "The Pelagos is a creature of the sea and the sky, born from the fusion of Yoruba maritime tales and the Greek legends of the Hippocampus. In the Iceheart Sea, where the waters are cold and the reefs are treacherous, the Pelagos are the guardians of the deep, creatures that were created to protect the treasures of the sea from those who would steal them. The Wyrd's corruption did not change their nature, but it did make them more fierce, for the creature now sees all who enter the water as potential thieves, and it will attack any who disturb the peace of the deep. The coastal fishers of the Iceheart Sea have learned to respect the Pelagos, and they will not fish in the waters where the creatures are known to hunt.",
    "nature": "A sleek hound resembling a greyhound but covered in smooth, rubbery shark skin with deep indigo and sea-foam green countershading. It has webbed paws, a dolphin-like dorsal fin, and a powerful shark tail that propels it through the water with incredible speed. Its chin features soft, glowing sensory whiskers that detect movement under freezing waters, and its eyes emit a soft green bioluminescence that can be seen from a hundred feet away. The Pelagos is intelligent enough to be trained, and it is fiercely loyal to those who earn its trust.",
    "habitat": "The Pelagos inhabits the coastal reefs, ice shelves, and kelp forests of the Iceheart Sea, particularly in the Myrathil Reef where the waters are warmest and the fish are most plentiful. It is most active during the dawn and dusk, when the light is low and the prey is active, and during the spring migration, when the whales pass through the Iceheart Sea and the Pelagos follows them. The creature's den is always near a source of fresh water, for the Pelagos is a creature of both sea and land, and it needs to drink as well as swim.",
    "depth": "Highly intelligent and trainable companions. Coastal fishers and Deep-Born divers domesticate them to guide ships through rocky shoals, retrieve dropped anchors, and alert crews to low-frequency underwater vibrations. The Pelagos' bioluminescence is a mystery to scholars, for it is not the cold light of the deep, but the warm light of the surface, and some believe that the creature is a bridge between the two worlds, a creature that belongs to neither and both.",
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
    "id": "egbere",
    "name": "Egbere",
    "description": "A small amphibious humanoid that carries a woven kelp mat and cries like a lost child to lure ships onto reefs.",
    "origin": "The Egbere is a creature of the sea and the sorrow, born from the Yoruba legends of the small, crying spirits that carry magical mats. In the Iceheart Sea, where the waves are cold and the rocks are sharp, the Egbere are the spirits of the drowned, creatures that were once children who perished in the sea and were transformed by the Wyrd into something that is both pitiful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more desperate, for the creature now cries not for itself, but for the living, and its tears are a lure that draws the unwary to their doom. The sailors of the Iceheart Sea know the sound of the Egbere's cry, and they will cover their ears when they hear it, for the creature's voice is a siren song that cannot be resisted.",
    "nature": "A small, amphibious humanoid with skin covered in wet scales and seaweed, sitting on coastal rocks or in dark caves, holding a small woven kelp mat on its head. It emits a loud, mournful crying sound that sounds like a lost child, and its eyes are large and black, reflecting the light of the moon. If a sailor attempts to rescue it, the Egbere attempts to steal their iron tools, using a blinding wave of salt water to escape. The creature is not evil, but it is hungry, and it will do whatever it takes to survive.",
    "habitat": "The Egbere inhabits the sea caves, rocky shoals, and reef borders of the Iceheart Sea, particularly in the Weeping Rocks where the waves crash against the shore with a sound like crying. It is most active during the stormy season, when the waves are high and the ships are most likely to be wrecked, and during the full moon, when the light is bright and the creature's eyes are most visible. The Egbere's cave is always near a source of fresh water, for the creature is a creature of both sea and land, and it needs to drink as well as swim.",
    "depth": "They are greedy beach-scavengers. The woven mat they carry is magically water-resistant; if stolen, it can be sold for a high price to shipwrights. The Egbere's mat is a mystery to scholars, for it is woven from a seaweed that does not exist in any known catalog, and some believe that the creature weaves the mats from its own hair, a process that takes a hundred years and is the creature's only purpose in life.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "fey",
      "iceheart",
      "wyrd-creature",
      "swamp",
      "siren"
    ],
    "tokenIcon": "Bestiary/egbere",
    "tokenBorder": "#20B2AA",
    "stats": {
      "strength": 8,
      "agility": 16,
      "constitution": 12,
      "intelligence": 10,
      "spirit": 12,
      "charisma": 14,
      "maxHp": 65,
      "currentHp": 65,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 2,
      "speed": 20,
      "flying": 0,
      "swimming": 40,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 50,
      "physical": 25
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Crying Call",
        "description": "Forces targets to make a Spirit save or be compelled to move closer.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "level": 2,
        "icon": "spell_holy_mindvision",
        "range": 60,
        "actionPointCost": 2,
        "cooldown": 2,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "min": 1,
          "max": 3
        },
        "silver": {
          "min": 10,
          "max": 20
        },
        "copper": {
          "min": 15,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "woven-kelp-mat",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "scylla_crab",
    "name": "Scylla-Crab",
    "description": "A massive crab with a shell of volcanic glass and frozen sea-spray that guards Iceheart ice floes.",
    "origin": "The Scylla-Crab is a creature of the deep and the dark, born from the maritime myths of Scylla and the northern tales of giant crustaceans. In the Iceheart Sea, where the waters are cold and the volcanic vents are hot, the Scylla-Crabs are the guardians of the deep, creatures that have evolved to survive in the most extreme environments. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its ice sheet. The fishermen of the Iceheart Sea know the signs of a Scylla-Crab's presence—a field of ice that is too smooth, and the absence of any other life.",
    "nature": "A giant crustacean with a shell made of dark, jagged volcanic glass (obsidian) and frozen sea-spray, its body the size of a small boat. It has massive, asymmetrical claws capable of cutting wooden hulls or crushing ice sheets, and its eyes line the rim of its shell like small, glowing blue beads. The creature moves with a slow, deliberate pace, but it can strike with incredible speed, and its claws are sharp enough to cut through steel. The Scylla-Crab is a creature of instinct, and it will defend its territory to the death.",
    "habitat": "The Scylla-Crab inhabits the ice sheets, glacier walls, and volcanic vents of the Iceheart Sea, particularly in the Obsidian Flats where the volcanic vents are most active and the ice is thickest. It is most active during the winter, when the ice is thickest and the creature's territory is most secure, and during the volcanic eruptions, when the vents are active and the water is warm. The Scylla-Crab's lair is always near a source of heat, for the creature is a creature of both fire and ice, and it needs the warmth to survive.",
    "depth": "Highly aggressive, territorial predators. They defend their ice sheets fiercely, striking instantly at any vessel or explorer that draws near. The Scylla-Crab's obsidian shell is a mystery to alchemists, for it is harder than any known material and it does not melt. Some scholars believe that the shell is made of the same material as the volcanic vents, and that the creature is a piece of the earth's fire, brought up to guard the ice.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "beast",
      "iceheart",
      "crab",
      "crustacean",
      "obsidian"
    ],
    "tokenIcon": "Bestiary/scylla_crab",
    "tokenBorder": "#1E90FF",
    "stats": {
      "strength": 18,
      "agility": 12,
      "constitution": 18,
      "intelligence": 6,
      "spirit": 12,
      "charisma": 4,
      "maxHp": 140,
      "currentHp": 140,
      "maxMana": 0,
      "currentMana": 0,
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
      "ember": 50
    },
    "vulnerabilities": {
      "storm": 25
    },
    "abilities": [
      {
        "name": "Obsidian Claw",
        "description": "A devastating clamp that ignores armor protection.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 10,
        "actionPointCost": 2,
        "cooldown": 0,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d8+5"
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
          "max": 0
        },
        "silver": {
          "min": 2,
          "max": 10
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "obsidian-shell-shard",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "draugr_helmsman",
    "name": "Draugr Helmsman",
    "description": "A sea-drenched undead mariner fused to a rotting ship wheel, guarding sunken wrecks in the Iceheart Sea.",
    "origin": "The Draugr Helmsman is a creature of the sea and the dead, born from the Norse maritime tales of the undead sailors who guard their sunken ships. In the Iceheart Sea, where the waters are cold and the wrecks are many, the Draugr Helmsmans are the spirits of the drowned, creatures that have been bound to their ships by the force of their own greed. The Wyrd's corruption did not change their nature, but it did make them more vengeful, for the creature now sees all who approach its wreck as thieves, and it will attack any who try to salvage its cargo. The divers of the Iceheart Sea know the signs of a Draugr's presence—a ship that is too well preserved, and the sound of a helmsman's whistle in the depths.",
    "nature": "A sea-drenched, blue-skinned undead sailor whose hands are fused to the rotting wood of a ship's helm wheel, its body draped in frozen blue kelp, barnacles, and rotting ropes. Its eyes glow with a chilling frost-light, and it speaks in a hollow, wind-swept whistle that can be heard through the water. The creature is bound to its ship, and it cannot move more than a hundred feet from the wreck. It is a creature of tragedy, and its rage is a thing of terrible beauty, for it is the rage of a man who died for his cargo and will not rest until it is safe.",
    "habitat": "The Draugr Helmsman haunts the shipwrecks, frozen bays, and ice floes of the Iceheart Sea, particularly in the Graveyard of the North where the wrecks of a thousand ships lie beneath the ice. It is most active during the winter, when the ice is thickest and the wrecks are most accessible, and during the storms, when the waves are high and the ships are most likely to sink. The Draugr's presence is a sign that the wreck is still sealed, and that the cargo within is still guarded.",
    "depth": "Tragic, vengeful spirits bound to their sunken ships. They protect the cargo they died carrying, dragging salvage divers down into the freezing deep. The Draugr's frost-light is a mystery to scholars, for it is not the cold light of the dead, but the warm light of the living, and some believe that the creature is not truly dead, but suspended between life and death, a guardian that will never rest.",
    "type": CREATURE_TYPES.UNDEAD,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "undead",
      "iceheart",
      "maritime",
      "pirate",
      "ghost-ship"
    ],
    "tokenIcon": "Bestiary/draugr_helmsman",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 16,
      "agility": 12,
      "constitution": 16,
      "intelligence": 8,
      "spirit": 14,
      "charisma": 6,
      "maxHp": 110,
      "currentHp": 110,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 25,
      "flying": 0,
      "swimming": 25,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 100,
      "blight": 100
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Sea-Salt Curse",
        "description": "Fills a target's lungs with water on a failed Spirit save.",
        "type": "spell",
        "spellType": "NECROMANCY",
        "icon": "ability_mage_fireball",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "1d8"
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
          "max": 50
        }
      },
      "items": [
        {
          "itemId": "rotting-wood-helm",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "gaki",
    "name": "Gaki",
    "description": "A coal-black mountain ghoul with a third chest-arm and glowing gold veins that feeds on sulfur and gold ore in deep mine shafts.",
    "origin": "The Gaki is a creature of the earth and the greed, born from the fusion of Incan and Japanese mythology, the spirits of the hungry dead who were cursed to roam the earth in search of sustenance. In the Cragjaw Peaks, where the mines are deep and the gold is plentiful, the Gakis are the spirits of the miners who died in the darkness, their greed turning them into something that is both human and monster. The Wyrd's corruption did not change their nature, but it did make them more terrible, for the creature now sees all who enter its territory as prey, and it will attack any who come near its hoard. The miners of the Cragjaw Peaks know the signs of a Gaki's presence—a mine that is too quiet, and the smell of sulfur in the air.",
    "nature": "A coal-black bipedal humanoid sprite with a third arm growing from its chest and skin patterned by glowing yellow veins of mineral gold. It has long, pick-like stone claws and a stone jaw for crushing ore, and it haunts the dark mines, aggressively hunting miners to steal their jewelry, coins, and mineral-rich blood. The creature is a thing of terrible beauty, and its glowing veins are a sign of the gold that flows through its body. The Gaki is a creature of hunger, and it will eat anything that contains gold, including the flesh of its prey.",
    "habitat": "The Gaki inhabits the deep mine shafts, sulfur caverns, and volcanic veins of the Cragjaw Peaks, particularly in the Gold-Cleft Mine where the veins are thickest and the miners are most numerous. It is most active during the night, when the mines are dark and the workers are few, and during the volcanic eruptions, when the sulfur is thick and the air is poison. The Gaki's lair is always near the richest vein, and it is said to be a nest of gold and bones, the remains of a thousand years of mining.",
    "depth": "Territorial and cruel miners' nightmares. Miners mark boundaries with runic warding stakes to prevent them from entering active mine layers. The Gaki's gold veins are a mystery to alchemists, for they are made of a gold that is purer than any known metal, and some believe that the creature's body is a natural smelter, a living furnace that turns ore into gold.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "monstrosity",
      "cragjaw",
      "wyrd-creature",
      "gold",
      "scavenger",
      "darkness"
    ],
    "tokenIcon": "Bestiary/gaki",
    "tokenBorder": "#DAA520",
    "stats": {
      "strength": 16,
      "agility": 14,
      "constitution": 16,
      "intelligence": 10,
      "spirit": 12,
      "charisma": 6,
      "maxHp": 150,
      "currentHp": 150,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 120
    },
    "resistances": {
      "physical": 50,
      "ember": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Gold Drain",
        "description": "Drains stats from targets based on the amount of gold carried on a failed Spirit save.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
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
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "gold-ore-vein",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "kamaitachi",
    "name": "Kamaitachi",
    "description": "A swift mountain weasel with sickle-like copper claws and tail that rides wind drafts to slice targets.",
    "origin": "The Kamaitachi is a creature of the wind and the blade, born from the Japanese legends of the sickle-cut wind weasel. In the Cragjaw Peaks, where the wind is strong and the mountains are tall, the Kamaitachis are the spirits of the storm, creatures that have been twisted by the Wyrd into something that is both beautiful and deadly. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as prey, and it will attack any who come near its nest. The miners of the Cragjaw Peaks know the signs of a Kamaitachi's presence—a wind that cuts like a knife, and the sound of weasel-like laughter in the air.",
    "nature": "A sleek, long-bodied weasel about three feet long, with fur that mimics the grey color of cold slate. Its front claws and long tail are flat, sharp, copper-like blades, and it moves with blinding speed, riding mountain drafts and pipeline updrafts, slicing travelers before they even notice its presence. The creature is a thing of terrible grace, and its blades are sharper than any known metal. The Kamaitachi is a creature of the wind, and it is most active during the stormy season, when the winds are strong and the air is charged with electricity.",
    "habitat": "The Kamaitachi inhabits the vertical mines, pipeline rifts, and high girders of the Cragjaw Peaks, particularly in the Wind-Cleft Pass where the drafts are strongest and the updrafts are most reliable. It is most active during the stormy season, when the winds are strong and the air is charged with electricity, and during the spring, when the snow melts and the air is warm. The Kamaitachi's nest is always near a source of wind, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "They hunt birds and smaller rodents along vertical shafts. Miners listen for their sharp whistling calls, which signal high winds and impending cuts. The Kamaitachi's copper blades are a mystery to alchemists, for they are made of a copper that is harder than any known metal, and some believe that the creature's blades are a natural alloy, a living forge that turns copper into steel.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "monstrosity",
      "cragjaw",
      "wyrd-creature",
      "weasel",
      "wind",
      "slashing"
    ],
    "tokenIcon": "Bestiary/kamaitachi",
    "tokenBorder": "#8B0000",
    "stats": {
      "strength": 8,
      "agility": 18,
      "constitution": 12,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 8,
      "maxHp": 80,
      "currentHp": 80,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 45,
      "flying": 0,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 60
    },
    "resistances": {
      "physical": 25
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Sickle Cut",
        "description": "Slashes target with sharp sickle tail.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 2,
          "diceType": 6,
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
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "copper-weasel-claw",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "kcoa",
    "name": "Kcoa",
    "description": "An Andean wildcat weather spirit with grey cloud wings that flashes lightning from its eyes.",
    "origin": "The Kcoa is a creature of the storm and the sky, born from the Incan mythology of the cat-like weather spirits that dwell in the clouds. In the Cragjaw Peaks, where the mountains are tall and the storms are fierce, the Kcoas are the spirits of the weather, creatures that have been twisted by the Wyrd into something that is both beautiful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more unpredictable, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its cloud. The mountain guides of the Cragjaw Peaks know the signs of a Kcoa's presence—a storm that appears from nowhere, and the sound of a cat's scream in the thunder.",
    "nature": "A large wildcat-like spirit with wings made of grey storm clouds and rain, its fur dark grey and constantly dripping water. Its eyes flash with bright yellow lightning, and it can release hail from its ears when enraged. The creature is a thing of terrible beauty, and its cloud-wings are a sign of the storm that follows it. The Kcoa is a creature of the sky, and it is most active during the stormy season, when the clouds are thick and the air is charged with electricity.",
    "habitat": "The Kcoa inhabits the highest peaks, storm clouds, and volcanic vents of the Cragjaw Peaks, particularly in the Storm-Crown Peak where the clouds are thickest and the lightning is most frequent. It is most active during the stormy season, when the clouds are thick and the air is charged with electricity, and during the volcanic eruptions, when the ash is thick and the air is poison. The Kcoa's nest is always in the clouds, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Weather spirits that represent the volatile climate of the peaks. Mountain guides make food offerings to Kcoa spirits before crossing high passes to ensure clear weather. The Kcoa's cloud-wings are a mystery to scholars, for they are made of a cloud that does not exist in any known catalog, and some believe that the creature's wings are a natural storm, a living cloud that follows the creature wherever it goes.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "cragjaw",
      "storm",
      "cat",
      "lightning"
    ],
    "tokenIcon": "Bestiary/kcoa",
    "tokenBorder": "#708090",
    "stats": {
      "strength": 12,
      "agility": 18,
      "constitution": 12,
      "intelligence": 8,
      "spirit": 16,
      "charisma": 10,
      "maxHp": 95,
      "currentHp": 95,
      "maxMana": 40,
      "currentMana": 40,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 35,
      "flying": 35,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 120
    },
    "resistances": {
      "storm": 100,
      "rime": 50
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Hail Rain",
        "description": "Fires a flurry of cold hail in an area.",
        "type": "spell",
        "spellType": "EVOCATION",
        "icon": "ability_mage_fireball",
        "range": 40,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d6"
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
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "cloud-feather",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T19:40:00Z",
    "lastModified": "2026-06-12T19:40:00Z"
  },
  {
    "id": "tengu_scout",
    "name": "Tengu Scout",
    "description": "A raven-winged peak Yokai sprite with obsidian eyes that leaps between pipeline scaffolds and carries a wind-copper staff.",
    "origin": "The Tengu Scout is a creature of the mountain and the wind, born from the Japanese legends of the winged mountain protectors. In the Cragjaw Peaks, where the pipelines are tall and the bridges are narrow, the Tengu Scouts are the guardians of the heights, creatures that have been twisted by the Wyrd into something that is both protective and territorial. The Wyrd's corruption did not change their nature, but it did make them more suspicious, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its nest. The Fexric engineers of the Cragjaw Peaks know the signs of a Tengu's presence—a wind that blows from nowhere, and the sound of a bird's cry in the air.",
    "nature": "A small, raven-winged humanoid sprite with a long bird-beak and glossy eyes like mountain obsidian. It is highly agile, leaping between pipelines and girders, carrying a wind-copper staff that hums with the energy of the mountain. It is defensive and gathers copper and shiny minerals, and it will attack any who come near its nest. The Tengu Scout is a creature of the wind, and it is most active during the stormy season, when the winds are strong and the air is charged with electricity.",
    "habitat": "The Tengu Scout inhabits the pipeline scaffolds, high mountain bridges, and mine entries of the Cragjaw Peaks, particularly in the Fexric Pipeline where the scaffolds are tallest and the bridges are narrowest. It is most active during the stormy season, when the winds are strong and the air is charged with electricity, and during the spring, when the snow melts and the air is warm. The Tengu's nest is always near a source of wind, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Highly defensive scouts. They keep watch over pipeline corridors, alerting mine holds of any invaders by letting out a sharp, bird-like cry. The Tengu's wind-copper staff is a mystery to alchemists, for it is made of a copper that is harder than any known metal, and some believe that the creature's staff is a natural alloy, a living forge that turns copper into steel.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.SMALL,
    "tags": [
      "fey",
      "cragjaw",
      "wyrd-creature",
      "yokai",
      "scout",
      "wind"
    ],
    "tokenIcon": "Bestiary/tengu_scout",
    "tokenBorder": "#4A0E4E",
    "stats": {
      "strength": 8,
      "agility": 18,
      "constitution": 10,
      "intelligence": 12,
      "spirit": 14,
      "charisma": 10,
      "maxHp": 55,
      "currentHp": 55,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 35,
      "flying": 45,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 80
    },
    "resistances": {
      "physical": 25
    },
    "vulnerabilities": {
      "rime": 50
    },
    "abilities": [
      {
        "name": "Wind-Copper strike",
        "description": "Strikes with a copper staff, slowing targets on failed agility save.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 1,
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
          "min": 0,
          "max": 1
        },
        "silver": {
          "min": 3,
          "max": 10
        },
        "copper": {
          "min": 10,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "wind-copper-shards",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T16:10:00Z",
    "lastModified": "2026-06-12T16:10:00Z"
  },
  {
    "id": "mogwai",
    "name": "Mogwai",
    "description": "A small, mischievous grass sprite with cat-like ears and a grassy tail. It startles horses, braids manes, and hides in the tall steppe grass.",
    "origin": "The Mogwai is a creature of the grass and the rain, born from the Chinese legends of the mischievous rain sprites and the nomadic steppe tales. In Sundrift Vale, where the grass is tall and the horses are many, the Mogwais are the spirits of the grass, creatures that have been twisted by the Wyrd into something that is both playful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more mischievous, for the creature now sees all who enter its territory as a source of amusement, and it will play pranks on any who come near its nest. The nomads of Sundrift Vale know the signs of a Mogwai's presence—a horse that is spooked for no reason, and the sound of pebbles clicking in the grass.",
    "nature": "A small, fuzzy, cat-sized grass sprite with a round face, tufted wildcat ears, and a bushy tail made of woven steppe grass. Its pale, dead-grass yellow fur camouflages it perfectly in the open plains, and it is highly mischievous, clicking pebbles to startle horses and stealing horse-hair to braid into its necklaces. The creature is a thing of terrible cuteness, and its pranks are harmless but annoying. The Mogwai is a creature of the grass, and it is most active during the spring, when the grass is tallest and the horses are most active.",
    "habitat": "The Mogwai inhabits the open steppe and grasslands of Sundrift Vale, particularly in the Horse-Plain where the grass is tallest and the horses are most numerous. It is most active during the spring, when the grass is tallest and the horses are most active, and during the summer, when the sun is warm and the air is filled with the sound of insects. The Mogwai's nest is always in the grass, and it is said to be a place of terrible beauty, filled with the braids of a thousand horses.",
    "depth": "They are grassland tricksters that feed on steppe rodents. While mostly harmless, they are a nuisance to the nomadic clans because their pebble-clicking can cause whole horse herds to stampede in the dark. The Mogwai's braids are a mystery to scholars, for they are woven from a grass that does not exist in any known catalog, and some believe that the creature's braids are a natural art, a living tapestry that tells the story of the steppe.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "fey",
      "sundrift",
      "wyrd-creature",
      "grasslands",
      "trickster",
      "imp"
    ],
    "tokenIcon": "Bestiary/mogwai",
    "tokenBorder": "#32CD32",
    "stats": {
      "strength": 6,
      "agility": 16,
      "constitution": 10,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 12,
      "maxHp": 30,
      "currentHp": 30,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 25
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Startle Herd",
        "description": "Claps hands to spook mounts, forcing a Spirit saving throw.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "level": 1,
        "icon": "spell_shadow_mindsteal",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 12,
            "onFail": {
              "type": "CONDITION",
              "condition": "frightened",
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
          "itemId": "horse-hair-braid",
          "dropChance": 40,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:15:00Z",
    "lastModified": "2026-06-12T08:15:00Z"
  },
  {
    "id": "olgoi_khorkhoi",
    "name": "Olgoi-Khorkhoi",
    "description": "A thick, crimson sand worm from Mongolian steppe sands that spits corrosive acid and electrical discharge.",
    "origin": "The Olgoi-Khorkhoi is a creature of the sand and the death, born from the Mongolian legends of the giant sand worm that kills from a distance. In Sundrift Vale, where the sand is deep and the sun is merciless, the Olgoi-Khorkhois are the apex predators of the desert, creatures that have been twisted by the Wyrd into something that is both terrifying and unstoppable. The Wyrd's corruption did not change their nature, but it did make them more cunning, for the creature now sees all who enter its territory as prey, and it will wait for days for the perfect moment to strike. The nomads of Sundrift Vale know the signs of an Olgoi-Khorkhoi's presence—a patch of sand that is too smooth, and the absence of any other life.",
    "nature": "A thick, sausage-like crimson worm, about five feet long, covered in smooth, blood-red skin with no visible head or tail, only a circular, tooth-lined maw that opens at one end. The creature moves by burrowing through the steppe sands, popping up to attack with a speed that is terrifying. The Olgoi-Khorkhoi is a thing of terrible hunger, and its maw is large enough to swallow a man whole. The creature is a creature of the sand, and it is most active during the summer, when the sand is hot and the prey is thirsty.",
    "habitat": "The Olgoi-Khorkhoi inhabits the sandy dunes, dry grasslands, and rocky valleys of Sundrift Vale, particularly in the Red-Sand Desert where the sand is deepest and the sun is hottest. It is most active during the summer, when the sand is hot and the prey is thirsty, and during the spring, when the sand is warm and the air is filled with the sound of insects. The Olgoi-Khorkhoi's lair is always beneath the sand, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Terrifying, subterranean predators that hunt by sensing vibrations. Nomads avoid dry sand patches where the worms are known to nest. The Olgoi-Khorkhoi's blood-red skin is a mystery to alchemists, for it is made of a substance that is harder than any known material, and some believe that the creature's skin is a natural armor, a living shield that protects it from the heat of the sand.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "beast",
      "sundrift",
      "worm",
      "acid",
      "lightning"
    ],
    "tokenIcon": "Bestiary/olgoi_khorkhoi",
    "tokenBorder": "#A52A2A",
    "stats": {
      "strength": 14,
      "agility": 14,
      "constitution": 16,
      "intelligence": 4,
      "spirit": 14,
      "charisma": 4,
      "maxHp": 120,
      "currentHp": 120,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "storm": 50,
      "blight": 50
    },
    "vulnerabilities": {
      "rime": 25
    },
    "abilities": [
      {
        "name": "Acid Spit",
        "description": "Spits corrosive acid at a distance.",
        "type": "spell",
        "spellType": "EVOCATION",
        "icon": "ability_mage_fireball",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d6"
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
          "max": 0
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
          "itemId": "acid-gland",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "yalbagan",
    "name": "Yalbagan",
    "description": "A ten-foot green-scaled snake with three heads that mimics tall steppe grass to ambush travelers.",
    "origin": "The Yalbagan is a creature of the grass and the venom, born from the Siberian and Turkic mythology of the multi-headed dragon-serpent. In Sundrift Vale, where the grass is tall and the snakes are many, the Yalbagans are the apex predators of the steppe, creatures that have been twisted by the Wyrd into something that is both terrifying and cunning. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as prey, and it will attack any who come near its nest. The nomads of Sundrift Vale know the signs of a Yalbagan's presence—a waterhole that is too quiet, and the sound of scales rustling in the grass.",
    "nature": "A long, green-and-yellow scaled serpent about ten feet long, with three distinct heads that sway in unison. The creature lies coiled in the tall dead grass of the steppe, mimicking grass movement to lure rodents and mounts. The three heads strike independently and coordinate their attacks with absolute precision. The Yalbagan is a thing of terrible hunger, and its venom is strong enough to kill a horse in seconds. The creature is a creature of the grass, and it is most active during the summer, when the grass is tallest and the prey is most active.",
    "habitat": "The Yalbagan inhabits the open steppe, tall grass beds, and waterholes of Sundrift Vale, particularly in the Three-Head Pass where the grass is tallest and the waterholes are most plentiful. It is most active during the summer, when the grass is tallest and the prey is most active, and during the spring, when the grass is green and the air is filled with the sound of insects. The Yalbagan's nest is always near a waterhole, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "A dangerous apex predator of the steppe. The Ordan nomads travel in tight groups and keep fires burning at night to prevent them from slipping into their corrals. The Yalbagan's three heads are a mystery to scholars, for they are controlled by a single brain, and some believe that the creature's heads are a natural adaptation, a living weapon that allows it to attack from multiple directions at once.",
    "type": CREATURE_TYPES.BEAST,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "beast",
      "sundrift",
      "wyrd-creature",
      "snake",
      "multiheaded",
      "stealth"
    ],
    "tokenIcon": "Bestiary/yalbagan",
    "tokenBorder": "#32CD32",
    "stats": {
      "strength": 18,
      "agility": 14,
      "constitution": 16,
      "intelligence": 6,
      "spirit": 12,
      "charisma": 6,
      "maxHp": 160,
      "currentHp": 160,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 2,
      "speed": 35,
      "flying": 0,
      "swimming": 10,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "rime": 50
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Triple Bite",
        "description": "Attacks three times, once with each head.",
        "type": "melee",
        "icon": "ability_ghoulfrenzy",
        "damage": {
          "diceCount": 1,
          "diceType": 10,
          "bonus": 4,
          "damageType": "physical"
        },
        "range": 5,
        "actionPointCost": 3,
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
      "items": [
        {
          "itemId": "snake-venom-gland",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "qilin",
    "name": "Qilin",
    "description": "A slender deer-like fey creature covered in blue scales with a single starlight horn and tufted wildcat tail.",
    "origin": "The Qilin is a creature of the stars and the steppe, born from the Chinese and Siberian legends of the sacred deer that protects the innocent. In Sundrift Vale, where the stars are bright and the grass is endless, the Qilins are the guardians of the steppe, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more elusive, for the creature now sees all who approach as a potential threat, and it will only appear to those of pure spirit. The nomads of Sundrift Vale know the signs of a Qilin's presence—a star that falls from the sky, and the sound of a deer's call in the night.",
    "nature": "A slender deer-like fey creature covered in iridescent blue scales, with a single, warm-glowing horn on its forehead and a tufted wildcat tail. The creature walks silently, its hooves leaving glowing trail footprints in the tall grass, and it only appears to those of pure spirit. The Qilin is a thing of terrible beauty, and its horn is said to be the key to the gates of heaven. The creature is a creature of the stars, and it is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos.",
    "habitat": "The Qilin inhabits the deep steppe, starry valleys, and ancient mounds of Sundrift Vale, particularly in the Star-Field where the grass is tallest and the stars are brightest. It is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos, and during the spring, when the grass is green and the air is filled with the sound of insects. The Qilin's nest is always in the stars, and it is said to be a place of terrible beauty, filled with the light of a thousand suns.",
    "depth": "Highly intelligent and peaceful guardians. They protect migration routes and ancestor mounds, actively fleeing or neutralizing hunters who threaten the herds. The Qilin's starry horn is a mystery to scholars, for it is made of a substance that does not exist in any known catalog, and some believe that the creature's horn is a natural star, a living light that guides the innocent to safety.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "sundrift",
      "wyrd-creature",
      "starry",
      "deer",
      "protector"
    ],
    "tokenIcon": "Bestiary/qilin",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 12,
      "agility": 16,
      "constitution": 14,
      "intelligence": 14,
      "spirit": 18,
      "charisma": 16,
      "maxHp": 100,
      "currentHp": 100,
      "maxMana": 40,
      "currentMana": 40,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 10,
      "sightRange": 80,
      "darkvision": 80
    },
    "resistances": {
      "wyrd": 100,
      "ember": 100
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Starry Path",
        "description": "Creates a lane of starlight, speed-buffing allies and granting save advantages.",
        "type": "spell",
        "spellType": "CONJURATION",
        "level": 3,
        "icon": "spell_holy_mindvision",
        "range": 30,
        "actionPointCost": 3,
        "cooldown": 2
      }
    ],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 1
        },
        "gold": {
          "min": 3,
          "max": 10
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "starry-horn-shard",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T16:10:00Z",
    "lastModified": "2026-06-12T16:10:00Z"
  },
  {
    "id": "vila",
    "name": "Vila",
    "description": "An ethereal Slavic woodland nymph who rides storm-winds and protects the ancient willow rings of Bryngloom.",
    "origin": "The Vila is a creature of the wind and the forest, born from the Slavic legends of the forest and mountain nymphs that dance in rings and control storm-winds. In the Bryngloom Forest, where the trees are ancient and the wind is strong, the Vilas are the guardians of the old growth, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more fierce, for the creature now sees all who enter its forest as a potential threat, and it will attack any who come near its trees. The woodcutters of the Bryngloom Forest know the signs of a Vila's presence—a wind that blows from nowhere, and the sound of a woman's song in the trees.",
    "nature": "An ethereal, beautiful humanoid sprite with long, floating pale-green hair and a dress of woven willow leaves. She moves by floating above the ground and is often surrounded by a swirling draft of autumn leaves. She is generally peaceful but fierce if her forest is harmed. The Vila is a creature of the wind, and she is most active during the spring, when the leaves are new and the air is filled with the sound of birds. The creature's hair is said to be made of the same material as the wind, and her dress is a living thing that changes with the seasons.",
    "habitat": "The Vila inhabits the fairy rings, ancient willow groves, and misty clearings of the Bryngloom Forest, particularly in the Willow-Ring Grove where the trees are oldest and the wind is strongest. She is most active during the spring, when the leaves are new and the air is filled with the sound of birds, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Vila's nest is always in the trees, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Ethereal guardians of the old growth. They will aid lost travelers who speak respectfully but will curse those who hunt for sport or cut healthy timber. The Vila's willow-leaf dress is a mystery to scholars, for it is made of a material that does not exist in any known catalog, and some believe that the creature's dress is a natural adaptation, a living camouflage that allows her to blend in with the forest.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "bryngloom",
      "nymph",
      "wind",
      "spellcaster"
    ],
    "tokenIcon": "Bestiary/vila",
    "tokenBorder": "#20B2AA",
    "stats": {
      "strength": 8,
      "agility": 18,
      "constitution": 10,
      "intelligence": 14,
      "spirit": 16,
      "charisma": 18,
      "maxHp": 85,
      "currentHp": 85,
      "maxMana": 50,
      "currentMana": 50,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 4,
      "speed": 35,
      "flying": 35,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 60
    },
    "resistances": {
      "wyrd": 50
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Whirlwind",
        "description": "Conjures a swirling wind that blows enemies back.",
        "type": "spell",
        "spellType": "EVOCATION",
        "icon": "ability_mage_fireball",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d6"
          },
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 15
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "willow-veil",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T19:40:00Z",
    "lastModified": "2026-06-12T19:40:00Z"
  },
  {
    "id": "vodyan",
    "name": "Vodyan",
    "description": "A green-skinned peat-water pool sprite that drags down trespassers who pollute or disturb its stagnant water.",
    "origin": "The Vodyan is a creature of the water and the mud, born from the Slavic legends of the grumpy swamp and pool water spirits. In the Bryngloom Forest, where the water is stagnant and the mud is deep, the Vodyans are the guardians of the pools, creatures that have been twisted by the Wyrd into something that is both grumpy and territorial. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its pool as a potential threat, and it will attack any who come near its water. The villagers of the Bryngloom Forest know the signs of a Vodyan's presence—a pool that is too still, and the smell of sulfur in the air.",
    "nature": "A hunched, green-skinned pool sprite made of wet peat-mud and gnarled wood, wearing a cloak of hanging moss and weeds. It has bulbous eyes and webbed hands, and it speaks in a wet, bubbling gurgle that is difficult to understand. The creature is grumpy and territorial, but it possesses deep knowledge of swamp remedies and will trade with travelers who show respect. The Vodyan is a creature of the water, and it is most active during the spring, when the rain is heavy and the pools are full.",
    "habitat": "The Vodyan inhabits the stagnant peat-pools, deep bogs, and mossy swamp wells of the Bryngloom Forest, particularly in the Mud-Deep Bog where the water is darkest and the mud is deepest. It is most active during the spring, when the rain is heavy and the pools are full, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Vodyan's nest is always beneath the water, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Reclusive and territorial, but will trade remedies with travelers who show respect and present rare mosses or swamp secrets. The Vodyan's moss-cloak is a mystery to scholars, for it is made of a moss that does not exist in any known catalog, and some believe that the creature's cloak is a natural adaptation, a living camouflage that allows it to blend in with the swamp.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "bryngloom",
      "wyrd-creature",
      "swamp",
      "pool",
      "troll"
    ],
    "tokenIcon": "Bestiary/vodyan",
    "tokenBorder": "#2E8B57",
    "stats": {
      "strength": 10,
      "agility": 12,
      "constitution": 14,
      "intelligence": 16,
      "spirit": 14,
      "charisma": 8,
      "maxHp": 80,
      "currentHp": 80,
      "maxMana": 30,
      "currentMana": 30,
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
      "blight": 100
    },
    "vulnerabilities": {
      "ember": 50
    },
    "abilities": [
      {
        "name": "Pool Drag",
        "description": "Attempts to pull target into deep peat water.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "damage": {
          "diceCount": 1,
          "diceType": 8,
          "bonus": 2,
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
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 2
        },
        "silver": {
          "min": 5,
          "max": 10
        },
        "copper": {
          "min": 10,
          "max": 30
        }
      },
      "items": [
        {
          "itemId": "bog-moss-remedy",
          "dropChance": 60,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T08:25:00Z",
    "lastModified": "2026-06-12T08:25:00Z"
  },
  {
    "id": "bukavac",
    "name": "Bukavac",
    "description": "A terrifying six-legged swamp beast with curved horns that deafens prey with a screech before dragging them under.",
    "origin": "The Bukavac is a creature of the swamp and the scream, born from the Slavic legends of the horned swamp monsters that strangle people and animals. In the Bryngloom Forest, where the water is stagnant and the mud is deep, the Bukavacs are the apex predators of the swamp, creatures that have been twisted by the Wyrd into something that is both terrifying and cunning. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its swamp as prey, and it will attack any who come near its lair. The villagers of the Bryngloom Forest know the signs of a Bukavac's presence—a scream that echoes through the swamp, and the absence of any other life.",
    "nature": "A large, six-legged reptilian beast with a body covered in slime-glistening black scales, long curved horns, and webbed claws. The creature remains submerged in mud, and rises to emit a deafening scream that disorients prey before dragging them down. The Bukavac is a thing of terrible hunger, and its scream is loud enough to shatter eardrums. The creature is a creature of the swamp, and it is most active during the night, when the water is dark and the prey is sleeping.",
    "habitat": "The Bukavac inhabits the peat-pools, swamp channels, and stagnant marshlands of the Bryngloom Forest, particularly in the Scream-Deep Marsh where the water is darkest and the mud is deepest. It is most active during the night, when the water is dark and the prey is sleeping, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Bukavac's lair is always beneath the mud, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Savage, ambush predators of the deep bogs. They hide beneath the stagnant peat-water, emitting a scream that sounds like a drowning child to lure prey close. The Bukavac's scream is a mystery to scholars, for it is louder than any known animal, and some believe that the creature's scream is a natural weapon, a living sound that can stun prey from a distance.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.LARGE,
    "tags": [
      "monstrosity",
      "bryngloom",
      "swamp",
      "six-legged",
      "screamer"
    ],
    "tokenIcon": "Bestiary/bukavac",
    "tokenBorder": "#2E8B57",
    "stats": {
      "strength": 18,
      "agility": 12,
      "constitution": 16,
      "intelligence": 6,
      "spirit": 12,
      "charisma": 4,
      "maxHp": 150,
      "currentHp": 150,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 5,
      "currentActionPoints": 5,
      "initiative": 2,
      "speed": 25,
      "flying": 0,
      "swimming": 35,
      "sightRange": 60,
      "darkvision": 80
    },
    "resistances": {
      "rime": 50,
      "blight": 50
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Deafening Screech",
        "description": "Emits a sonic scream that disorients targets.",
        "type": "spell",
        "spellType": "EVOCATION",
        "icon": "ability_physical_taunt",
        "range": 20,
        "actionPointCost": 2,
        "cooldown": 2,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "slowed",
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
          "max": 0
        },
        "silver": {
          "min": 5,
          "max": 20
        },
        "copper": {
          "min": 10,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "screamer-horn",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-12T19:40:00Z",
    "lastModified": "2026-06-12T19:40:00Z"
  },
  {
    "id": "hut_ling",
    "name": "Hut-ling",
    "description": "An animated treasure chest walking on two scaly chicken legs that protects swamp relics in Bryngloom.",
    "origin": "The Hut-ling is a creature of the forest and the witch, born from the Slavic tales of the animated treasure chests that protect the witch's hoard. In the Bryngloom Forest, where the witches are many and the treasure is hidden, the Hut-lings are the guardians of the witch's hoard, creatures that have been created by the Wyrd to serve as the witch's eyes and ears. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all who approach its treasure as a potential thief, and it will attack any who come near its chest. The treasure hunters of the Bryngloom Forest know the signs of a Hut-ling's presence—a chest that walks on chicken legs, and the sound of a witch's laughter in the air.",
    "nature": "An animated treasure chest made of dark swamp-oak, held together by runic iron bands, walking on two massive, scaly bird-like legs. The creature is highly protective of its contents and will run away or kick aggressively if approached. The Hut-ling is a thing of terrible cuteness, and its chicken legs are fast enough to outrun a horse. The creature is a creature of the witch, and it is most active during the night, when the witch is sleeping and the treasure is unguarded.",
    "habitat": "The Hut-ling inhabits the deep marshes, forest clearings, and ruins of the Bryngloom Forest, particularly in the Witch's Hollow where the witches are most numerous and the treasure is most hidden. It is most active during the night, when the witch is sleeping and the treasure is unguarded, and during the spring, when the grass is green and the air is filled with the sound of insects. The Hut-ling's nest is always near the witch's lair, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Comical yet dangerous constructs. They are bound to a master (usually a forest witch) and will only allow their master to open them without detonating the runic lock. The Hut-ling's runic lock is a mystery to scholars, for it is made of a rune that does not exist in any known catalog, and some believe that the creature's lock is a natural adaptation, a living defense that protects the witch's treasure from thieves.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "construct",
      "bryngloom",
      "chest",
      "animated",
      "chicken-legs"
    ],
    "tokenIcon": "Bestiary/hut_ling",
    "tokenBorder": "#8B4513",
    "stats": {
      "strength": 12,
      "agility": 16,
      "constitution": 14,
      "intelligence": 6,
      "spirit": 12,
      "charisma": 6,
      "maxHp": 95,
      "currentHp": 95,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 40,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 25
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Talon Kick",
        "description": "Kicks with bird-like claws, potentially knocking targets prone.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 0,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d6+3"
          },
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
              "condition": "prone",
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
          "min": 5,
          "max": 15
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 50,
          "max": 100
        }
      },
      "items": [
        {
          "itemId": "hag-relic",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "wolpertinger",
    "name": "Wolpertinger",
    "description": "A small golden fey hare with pheasant wings and roe deer antlers that glides through Frostwood.",
    "origin": "The Wolpertinger is a creature of the Alpine highlands, born from the mingling of fey magic and the harsh reality of mountain life. In the Frostwood Reach, where the alpine forests meet the perpetual mist, the Wolpertingers are the spirits of the forest's lost children—creatures that are too small to be predators and too magical to be prey. The old hunters of the Reach tell stories of the Wolpertinger as a messenger of the mountain gods, a creature that appears to those who are lost in the fog to guide them back to the path. The Wyrd's corruption has made them shy and elusive, but it has not dimmed their curiosity. A Wolpertinger that visits a camp is considered a sign of good fortune, though the creature will almost certainly steal something small as a souvenir.",
    "nature": "A small fey creature resembling a golden-furred hare, but possessing tiny roe deer antlers on its forehead and colorful pheasant wings on its back. Its fur is the color of autumn leaves, and its eyes are large and amber, reflecting light like a cat's. Highly elusive and mischievous, it uses its wings for short gliding leaps to escape predators, and its antlers contain traces of fey mana that can be used in alchemical preparations. It is known to steal small items from campfires—buttons, coins, and pieces of string—taking them back to its nest in the high pine branches.",
    "habitat": "The Wolpertinger lives in the alpine pine forests and misty mossy logs of the Frostwood Reach, particularly in the high elevations where the air is thin and the fog never clears. It builds its nests in the hollows of ancient pines, lining them with stolen trinkets and the soft needles of the forest floor. It is most active during the early morning, when the mist is thickest and the forest is quiet, and it can often be seen sitting on a mossy log, preening its wings with its tiny paws.",
    "depth": "Shy and generally harmless, but highly prized by alchemists for their antlers, which contain traces of fey mana. The Wolpertinger's nests are said to be treasure troves of lost items, and some hunters seek them out not to kill the creature, but to trade with it. The Wyrd's corruption has made the Wolpertinger more cautious, but it has also given the creature a strange wisdom—some say that if you can catch a Wolpertinger and hold it gently, it will whisper a secret of the forest in your ear.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.TINY,
    "tags": [
      "fey",
      "frostwood",
      "hare",
      "winged",
      "antlers"
    ],
    "tokenIcon": "Bestiary/wolpertinger",
    "tokenBorder": "#DAA520",
    "stats": {
      "strength": 4,
      "agility": 18,
      "constitution": 10,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 12,
      "maxHp": 30,
      "currentHp": 30,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 4,
      "speed": 40,
      "flying": 20,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "wyrd": 25
    },
    "vulnerabilities": {
      "physical": 10
    },
    "abilities": [],
    "lootTable": {
      "currency": {
        "platinum": {
          "min": 0,
          "max": 0
        },
        "gold": {
          "min": 0,
          "max": 0
        },
        "silver": {
          "min": 1,
          "max": 5
        },
        "copper": {
          "min": 5,
          "max": 15
        }
      },
      "items": [
        {
          "itemId": "fey-antler-shards",
          "dropChance": 50,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "huldra",
    "name": "Huldra",
    "description": "A seductive forest nymph with a cow's tail and a hollow tree-back that charms woodcutters in Nordhalla.",
    "origin": "The Huldra is a creature of the deep forest and the lonely heart, born from the Scandinavian legends of the forest spirits that seduce the unwary. In Nordhalla, where the pine forests are ancient and the winters are long, the Huldras are the spirits of the trees that have been cut, the forest's grief given form. The Wyrd's corruption has twisted their protective nature into something predatory, and they now lure woodcutters and miners into the forest not to protect them, but to bind them to the forest's will. The Nordhalla woodcutters know the signs of a Huldra's presence—a beautiful song on the wind, and the smell of pine needles where no pine trees grow.",
    "nature": "A beautiful woodland spirit that appears as a young maiden with long golden hair and eyes the color of forest pools. She hides a cow's tail beneath her skirts, and her back is completely hollow like a rotting tree, a feature that is only visible when she turns away. She moves with the grace of a dancer, and her voice is a soft, melodic song that can charm the most hardened warrior. She is drawn to lonely woodcutters and miners, offering them comfort and warmth in the cold forest, but her embrace is a trap, and those who succumb to her are never seen again.",
    "habitat": "The Huldra inhabits the ancient pine groves, forest springs, and mining paths of Nordhalla, particularly in the Deepwood where the trees have stood for ten thousand years. She is most active during the winter, when the cold drives travelers to seek warmth, and during the spring, when the sap runs and the forest is most alive. The Huldra's territory is marked by small shrines of stones and pine cones, offerings left by those who have escaped her embrace.",
    "depth": "Reclusive spirits of the deep forest. They are generally peaceful if their trees are respected but will curse woodcutters who cut ancient sacred groves. The Huldra's hollow back is a symbol of her nature—she is empty inside, a vessel for the forest's grief, and those who fill her with their love are consumed by it. Some scholars believe that the Huldra was once a mortal woman who loved the forest so deeply that she became one with it, and that her curse is to seek that love forever, never finding it.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "nordhalla",
      "nymph",
      "forest",
      "charm"
    ],
    "tokenIcon": "Bestiary/huldra",
    "tokenBorder": "#32CD32",
    "stats": {
      "strength": 16,
      "agility": 14,
      "constitution": 12,
      "intelligence": 12,
      "spirit": 14,
      "charisma": 18,
      "maxHp": 90,
      "currentHp": 90,
      "maxMana": 30,
      "currentMana": 30,
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
      "physical": 25
    },
    "vulnerabilities": {},
    "abilities": [
      {
        "name": "Seductive Song",
        "description": "Charms a target and forces them to walk toward her.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "icon": "ability_physical_taunt",
        "range": 30,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "max": 1
        },
        "gold": {
          "min": 2,
          "max": 8
        },
        "silver": {
          "min": 10,
          "max": 20
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "huldra-wood-bark",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "ushabti_guard",
    "name": "Ushabti Guard",
    "description": "A terracotta construct decorated in lapis lazuli carrying a sickle-sword to defend Sundale tombs.",
    "origin": "The Ushabti Guard is a creature of the afterlife and the earth, born from the ancient Egyptian funerary practices of the Ushabti, the servant figurines that were placed in tombs to serve the dead in the next world. In Sundale, where the tombs are ancient and the dead are powerful, the Ushabti Guards are the last servants of the old kings, creatures that have been waiting for ten thousand years to fulfill their purpose. The Wyrd's corruption did not change their nature, but it did make them more vigilant, for the creature now sees all who enter the tomb as potential thieves, and it will attack any who disturb the sleep of the dead. The tomb robbers of Sundale fear the Ushabti Guards, for they are relentless, and they cannot be bribed or reasoned with.",
    "nature": "A life-sized terracotta construct painted with patterns of blue lapis lazuli and gold leaf, its body stiff and its movements grinding like stone on stone. It carries a heavy clay sickle-sword (khopesh) and moves with the precision of a clockwork mechanism, its eyes painted with a glaze that seems to follow the viewer. The creature is bound to a specific tomb chamber, and it stands motionless until the seal is broken, at which point it activates and begins its patrol. The Ushabti Guard is a mindless construct, but it is also a thing of terrible beauty, and some scholars study the creatures to learn the secrets of the old art.",
    "habitat": "The Ushabti Guard stands in the tomb vaults, basalt corridors, and treasure chambers of Sundale, particularly in the Pyramid of the Eternal Sun where the greatest of the old kings are buried. It is active only when the tomb is disturbed, and it is most dangerous during the new moon, when the darkness is deepest and the dead are closest to the world of the living. The Ushabti's presence is a sign that the tomb is still sealed, and that the treasures within are still guarded.",
    "depth": "Mindless construct servants built to protect and maintain the tomb. They follow simple verbal commands left by their creators thousands of years ago. The Ushabti's lapis lazuli paint is a mystery to alchemists, for it is brighter than any modern pigment and it does not fade. Some scholars believe that the paint is made of the same material as the sky, and that the Ushabti is a piece of the heavens, brought down to serve the earth.",
    "type": CREATURE_TYPES.CONSTRUCT,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "construct",
      "sundale",
      "terracotta",
      "tomb",
      "guard"
    ],
    "tokenIcon": "Bestiary/ushabti_guard",
    "tokenBorder": "#4682B4",
    "stats": {
      "strength": 14,
      "agility": 10,
      "constitution": 16,
      "intelligence": 4,
      "spirit": 10,
      "charisma": 4,
      "maxHp": 100,
      "currentHp": 100,
      "maxMana": 0,
      "currentMana": 0,
      "maxActionPoints": 3,
      "currentActionPoints": 3,
      "initiative": 1,
      "speed": 25,
      "flying": 0,
      "swimming": 0,
      "sightRange": 60,
      "darkvision": 60
    },
    "resistances": {
      "physical": 50,
      "ember": 100
    },
    "vulnerabilities": {
      "physical": 25
    },
    "abilities": [
      {
        "name": "Sickle Slash",
        "description": "Slashes with its khopesh, potentially dealing bleed damage.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 0,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d6+3"
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
          "max": 0
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 50,
          "max": 150
        }
      },
      "items": [
        {
          "itemId": "terracotta-shards",
          "dropChance": 100,
          "quantity": {
            "min": 2,
            "max": 5
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "qalupalik",
    "name": "Qalupalik",
    "description": "An amphibious scaly sea-humanoid that snatch travelers from ice-wells in the Iceheart Sea.",
    "origin": "The Qalupalik is a creature of the ice and the dark, born from the Inuit mythology of the humanoid sea creatures that carry away children. In the Iceheart Sea, where the ice is thick and the water is cold, the Qalupaliks are the spirits of the frozen, creatures that have been twisted by the Wyrd into something that is both pitiful and terrifying. The Wyrd's corruption did not change their nature, but it did make them more predatory, for the creature now sees all who approach the ice as prey, and it will drag any who come near into the water. The parents of the Iceheart Sea know the signs of a Qalupalik's presence—a humming song on the wind, and the absence of any children.",
    "nature": "An amphibious, scaly humanoid sprite with dark green skin and long, slimy hair that smells of sulfur. It wears a large seal-skin parka with an oversized hood (amautik) on its back, and it hides beneath ice cracks, waiting to grab travelers and drag them down. The creature is stealthy and patient, and it can wait for hours beneath the ice, its only movement the slow rise and fall of its breathing. The Qalupalik is a creature of the dark, and it is most active during the long winter nights, when the ice is thickest and the children are most likely to wander.",
    "habitat": "The Qalupalik inhabits the frozen ocean shores, glacier fissures, and ice wells of the Iceheart Sea, particularly in the Child's End where the ice is thin and the water is deep. It is most active during the winter, when the ice is thickest and the children are most likely to wander, and during the spring thaw, when the ice cracks and the creature can reach through. The Qalupalik's lair is always beneath the ice, in a cave that is warm and dry, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Stealthy, solitary hunters. They use a low, humming song to lure unwary children and travelers close to the ice cracks, dragging them down to live in their sub-glacial caves. The Qalupalik's amautik is a mystery to scholars, for it is made of a seal-skin that does not exist in any known catalog, and some believe that the creature skinned the seals itself, a process that takes a hundred years and is the creature's only purpose in life.",
    "type": CREATURE_TYPES.MONSTROSITY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "monstrosity",
      "iceheart",
      "sea",
      "amphibious",
      "snatcher"
    ],
    "tokenIcon": "Bestiary/qalupalik",
    "tokenBorder": "#2E8B57",
    "stats": {
      "strength": 12,
      "agility": 16,
      "constitution": 12,
      "intelligence": 8,
      "spirit": 12,
      "charisma": 6,
      "maxHp": 85,
      "currentHp": 85,
      "maxMana": 10,
      "currentMana": 10,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 30,
      "flying": 0,
      "swimming": 40,
      "sightRange": 60,
      "darkvision": 80
    },
    "resistances": {
      "rime": 100
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Amautik Snatch",
        "description": "Attempts to pull a target into its fur-parka hood to restrain them.",
        "type": "melee",
        "icon": "ability_physical_taunt",
        "range": 5,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "agility",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
              "condition": "grappled",
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
          "max": 0
        },
        "silver": {
          "min": 5,
          "max": 15
        },
        "copper": {
          "min": 10,
          "max": 40
        }
      },
      "items": [
        {
          "itemId": "seal-skin-scrap",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 2
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "yuki_onna",
    "name": "Yuki-Onna",
    "description": "An ethereal snowstorm spirit with starlight eyes that freezes mountain explorers in Cragjaw Peaks.",
    "origin": "The Yuki-Onna is a creature of the snow and the cold, born from the Japanese legends of the snow woman who appears in blizzards to freeze travelers. In the Cragjaw Peaks, where the snow is deep and the wind is fierce, the Yuki-Onnas are the spirits of the winter, creatures that have been twisted by the Wyrd into something that is both beautiful and deadly. The Wyrd's corruption did not change their nature, but it did make them more cruel, for the creature now sees all who enter its territory as prey, and it will freeze any who come near its storm. The mountain guides of the Cragjaw Peaks know the signs of a Yuki-Onna's presence—a snowstorm that appears from nowhere, and the sound of a woman's voice in the wind.",
    "nature": "A beautiful, ethereal woman with pale blue skin, long black hair, and eyes like frozen stars. She wears a long white kimono that leaves no footprints in the snow, and she floats slightly above the drifts, accompanied by a freezing wind. The creature is a thing of terrible beauty, and her frost-breath is cold enough to freeze a man in seconds. The Yuki-Onna is a creature of the snow, and she is most active during the winter, when the snow is deepest and the wind is strongest.",
    "habitat": "The Yuki-Onna inhabits the snowy peaks, glacier cols, and high passes of the Cragjaw Peaks, particularly in the Frost-Crown Pass where the snow is deepest and the wind is strongest. She is most active during the winter, when the snow is deepest and the wind is strongest, and during the spring, when the snow melts and the air is warm. The Yuki-Onna's lair is always in the snow, and it is said to be a place of terrible beauty, filled with the frozen bodies of her prey.",
    "depth": "Volatile winter spirits. They represent the beautiful but deadly nature of high mountain blizzards. They will sometimes spare travelers who display great courage or tell a beautiful story. The Yuki-Onna's frost-breath is a mystery to scholars, for it is colder than any known substance, and some believe that her breath is made of the same material as the stars, a living cold that freezes the soul as well as the body.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "cragjaw",
      "specter",
      "frost",
      "blizzard"
    ],
    "tokenIcon": "Bestiary/yuki_onna",
    "tokenBorder": "#B0C4DE",
    "stats": {
      "strength": 10,
      "agility": 16,
      "constitution": 12,
      "intelligence": 14,
      "spirit": 16,
      "charisma": 16,
      "maxHp": 110,
      "currentHp": 110,
      "maxMana": 60,
      "currentMana": 60,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 3,
      "speed": 35,
      "flying": 35,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 120
    },
    "resistances": {
      "rime": 100
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Frost Breath",
        "description": "Spews a blizzard wind that freezes and restrains targets.",
        "type": "spell",
        "spellType": "EVOCATION",
        "icon": "ability_mage_fireball",
        "range": 15,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "DAMAGE",
            "value": "2d8"
          },
          {
            "type": "SAVE",
            "attribute": "constitution",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "slowed",
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
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 15
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "frozen-star-crystal",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "bixie",
    "name": "Bixie",
    "description": "A jade-scaled winged celestial lion chimera that protects ancient steppe shrines in Sundrift.",
    "origin": "The Bixie is a creature of the sky and the stone, born from the Chinese legends of the winged celestial chimera that wards off evil spirits. In Sundrift Vale, where the steppe is wide and the sky is endless, the Bixies are the guardians of the ancient mounds, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all who approach the mounds as a potential threat, and it will attack any who come near the graves. The nomads of Sundrift Vale know the signs of a Bixie's presence—a wind that blows from nowhere, and the sound of a lion's roar in the night.",
    "nature": "A winged, lion-like celestial beast covered in jade-green, stone-like scales, with two curved horns on its forehead and bird-like wings. The creature is a protective spirit that guards nomadic burial mounds and ruins from corruption, and it is a thing of terrible beauty. The Bixie is a creature of the sky, and it is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos. The creature's scales are harder than any known metal, and its wings are said to be able to create a wind that can blow away evil spirits.",
    "habitat": "The Bixie inhabits the steppe mounds, ancient stone ruins, and sacred hills of Sundrift Vale, particularly in the Jade-Hill Mound where the grass is tallest and the mounds are oldest. It is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos, and during the spring, when the grass is green and the air is filled with the sound of insects. The Bixie's nest is always in the mounds, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "Benevolent and noble guardians. They will actively protect peaceful travelers and nomads from undead or shadow spirits, but will attack grave-robbers instantly. The Bixie's jade scales are a mystery to alchemists, for they are made of a substance that does not exist in any known catalog, and some believe that the creature's scales are a natural armor, a living shield that protects it from the evil spirits that it guards against.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "sundrift",
      "lion",
      "celestial",
      "guardian"
    ],
    "tokenIcon": "Bestiary/bixie",
    "tokenBorder": "#32CD32",
    "stats": {
      "strength": 16,
      "agility": 14,
      "constitution": 14,
      "intelligence": 10,
      "spirit": 16,
      "charisma": 12,
      "maxHp": 115,
      "currentHp": 115,
      "maxMana": 20,
      "currentMana": 20,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 35,
      "flying": 35,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 120
    },
    "resistances": {
      "wyrd": 100
    },
    "vulnerabilities": {
      "blight": 25
    },
    "abilities": [
      {
        "name": "Ward Roar",
        "description": "Emits a sacred roar that terrifies evil spirits.",
        "type": "spell",
        "spellType": "CONJURATION",
        "icon": "ability_physical_taunt",
        "range": 20,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 13,
            "onFail": {
              "type": "CONDITION",
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
          "max": 1
        },
        "gold": {
          "min": 5,
          "max": 15
        },
        "silver": {
          "min": 10,
          "max": 30
        },
        "copper": {
          "min": 0,
          "max": 0
        }
      },
      "items": [
        {
          "itemId": "jade-stone-scales",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 3
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
  },
  {
    "id": "likho",
    "name": "Likho",
    "description": "A gaunt Slavic hag with a single large eye on her forehead that clings to travelers' backs to curse them.",
    "origin": "The Likho is a creature of the misfortune and the curse, born from the Slavic legends of the personification of evil fate and bad luck. In the Bryngloom Forest, where the shadows are deep and the luck is bad, the Likhos are the spirits of misfortune, creatures that have been twisted by the Wyrd into something that is both pitiful and terrifying. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as a source of bad luck, and it will cling to any who come near its lair. The villagers of the Bryngloom Forest know the signs of a Likho's presence—a series of terrible accidents, and the feeling of a heavy weight on their back.",
    "nature": "A tall, gaunt, skeletal hag with pale, grey skin and a single, large bloodshot eye in the center of her forehead. She wears tattered black rags and moves silently through the dark undergrowth, her presence marked by a sudden chill and the smell of rotting leaves. The creature represents bad luck, cursing those she encounters with a series of terrible accidents that can lead to death. The Likho is a creature of the shadow, and she is most active during the night, when the darkness is deepest and the luck is at its worst.",
    "habitat": "The Likho inhabits the damp caves, deep forest hollows, and abandoned cabins of the Bryngloom Forest, particularly in the Misfortune Hollow where the shadows are deepest and the luck is at its worst. She is most active during the night, when the darkness is deepest and the luck is at its worst, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Likho's lair is always in the dark, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
    "depth": "A physical embodiment of bad luck. Once she targets a victim, she clings to their back, draining their hope and bringing constant misfortune until she is driven off with hot iron. The Likho's single eye is a mystery to scholars, for it is said to see the future, and some believe that the creature's eye is a natural adaptation, a living oracle that allows her to see the bad luck that she brings.",
    "type": CREATURE_TYPES.FEY,
    "size": CREATURE_SIZES.MEDIUM,
    "tags": [
      "fey",
      "bryngloom",
      "hag",
      "curse",
      "misfortune"
    ],
    "tokenIcon": "Bestiary/likho",
    "tokenBorder": "#4B0082",
    "stats": {
      "strength": 12,
      "agility": 14,
      "constitution": 16,
      "intelligence": 12,
      "spirit": 16,
      "charisma": 4,
      "maxHp": 130,
      "currentHp": 130,
      "maxMana": 30,
      "currentMana": 30,
      "maxActionPoints": 4,
      "currentActionPoints": 4,
      "initiative": 2,
      "speed": 30,
      "flying": 0,
      "swimming": 0,
      "sightRange": 80,
      "darkvision": 80
    },
    "resistances": {
      "wyrd": 50
    },
    "vulnerabilities": {
      "ember": 25
    },
    "abilities": [
      {
        "name": "Gaze of Misfortune",
        "description": "Inflicts a curse of misfortune on a target's next rolls on a failed Spirit save.",
        "type": "spell",
        "spellType": "ENCHANTMENT",
        "icon": "ability_physical_taunt",
        "range": 40,
        "actionPointCost": 2,
        "cooldown": 1,
        "effects": [
          {
            "type": "SAVE",
            "attribute": "spirit",
            "dc": 14,
            "onFail": {
              "type": "CONDITION",
              "condition": "slowed",
              "duration": 3
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
          "min": 1,
          "max": 5
        },
        "silver": {
          "min": 5,
          "max": 20
        },
        "copper": {
          "min": 100,
          "max": 300
        }
      },
      "items": [
        {
          "itemId": "hag-cooking-pot",
          "dropChance": 100,
          "quantity": {
            "min": 1,
            "max": 1
          }
        }
      ]
    },
    "dateCreated": "2026-06-13T12:00:00Z",
    "lastModified": "2026-06-13T12:00:00Z"
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
