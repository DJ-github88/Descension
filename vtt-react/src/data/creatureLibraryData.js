// Creature Library Data
// This file contains sample data for the creature library

import { CREATURE_SIZES, CREATURE_TYPES } from '../store/creatureStore';

// Library version - increment this to force store updates
export const CREATURE_LIBRARY_VERSION = '2.6.0';

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
          "spellType": "ACTION",
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
          "spellType": "ACTION",
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
          "spellType": "ACTION",
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
        "maxHp": 75,
        "currentHp": 75,
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
          "spellType": "ACTION",
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
      "name": "Oilliph—ist",
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
        "maxHp": 380,
        "currentHp": 380,
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
        "maxHp": 250,
        "currentHp": 250,
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
          "spellType": "ACTION",
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
        "maxHp": 130,
        "currentHp": 130,
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
          "spellType": "ACTION",
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
        "maxHp": 265,
        "currentHp": 265,
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
        "maxHp": 220,
        "currentHp": 220,
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
          "spellType": "ACTION",
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
        "maxHp": 45,
        "currentHp": 45,
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
      "origin": "The Nokk Stallion is a creature of the water and the mist, born from the ancient Norse legends of the B—ckah—sten, the water spirit that lures the unwary to their doom. In Nordhalla, where the rivers are cold and the waterfalls are tall, the Nokk Stallions are the guardians of the waterways, spirits that protect the rivers from pollution and overfishing. The Wyrd's corruption has twisted their protective nature into something predatory, and they now lure travelers into the water not to save the river, but to feed their own hunger for the warmth of living bodies. The Nordhalla fishermen know the signs of a Nokk's presence—a mist that rises from the water even on a clear day, and the sound of hooves on stone where no horse should be.",
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
        "maxHp": 160,
        "currentHp": 160,
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
          "spellType": "ACTION",
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
      "origin": "The Sirrush is a creature of the ancient world, born from the Babylonian myths of the Mu—?u——u, the dragon-serpent that guarded the gates of the gods. In Sundale, where the desert sands cover the ruins of ten thousand years, the Sirrush is a rare and sacred beast, a guardian of the ancient temples and the secrets they hold. The Wyrd's corruption did not change the Sirrush's nature, but it did make it more solitary, for the creature now sees all mortals as potential thieves, and it guards its treasures with a ferocity that is legendary. The nomads of Sundale believe that the Sirrush is the reincarnation of the ancient kings, and that to kill one is to bring a curse upon ten generations.",
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
        "maxHp": 200,
        "currentHp": 200,
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
        "maxHp": 130,
        "currentHp": 130,
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
        "maxHp": 285,
        "currentHp": 285,
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
        "maxHp": 420,
        "currentHp": 420,
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
        "maxHp": 155,
        "currentHp": 155,
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
          "spellType": "ACTION",
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
        "maxHp": 130,
        "currentHp": 130,
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
          "spellType": "ACTION",
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
        "maxHp": 390,
        "currentHp": 390,
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
        "maxHp": 200,
        "currentHp": 200,
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
          "spellType": "ACTION",
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
        "maxHp": 270,
        "currentHp": 270,
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
        "maxHp": 145,
        "currentHp": 145,
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
        "maxHp": 170,
        "currentHp": 170,
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
          "spellType": "ACTION",
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
        "maxHp": 130,
        "currentHp": 130,
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
        "maxHp": 45,
        "currentHp": 45,
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
          "spellType": "ACTION",
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
        "maxHp": 380,
        "currentHp": 380,
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
          "spellType": "ACTION",
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
        "maxHp": 650,
        "currentHp": 650,
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
        "maxHp": 380,
        "currentHp": 380,
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
          "spellType": "ACTION",
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
        "maxHp": 155,
        "currentHp": 155,
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
          "spellType": "ACTION",
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
        "maxHp": 220,
        "currentHp": 220,
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
        "maxHp": 420,
        "currentHp": 420,
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
          "spellType": "ACTION",
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
        "maxHp": 170,
        "currentHp": 170,
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
        "maxHp": 45,
        "currentHp": 45,
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
        "maxHp": 160,
        "currentHp": 160,
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
          "spellType": "ACTION",
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
      "id": "ushabti",
      "name": "Ushabti",
      "description": "A terracotta construct decorated in lapis lazuli carrying a sickle-sword to defend Sundale tombs.",
      "origin": "The Ushabti is a creature of the afterlife and the earth, born from the ancient Egyptian funerary practices of the Ushabti, the servant figurines that were placed in tombs to serve the dead in the next world. In Sundale, where the tombs are ancient and the dead are powerful, the Ushabtis are the last servants of the old kings, creatures that have been waiting for ten thousand years to fulfill their purpose. The Wyrd's corruption did not change their nature, but it did make them more vigilant, for the creature now sees all who enter the tomb as potential thieves, and it will attack any who disturb the sleep of the dead. The tomb robbers of Sundale fear the Ushabtis, for they are relentless, and they cannot be bribed or reasoned with.",
      "nature": "A life-sized terracotta construct painted with patterns of blue lapis lazuli and gold leaf, its body stiff and its movements grinding like stone on stone. It carries a heavy clay sickle-sword (khopesh) and moves with the precision of a clockwork mechanism, its eyes painted with a glaze that seems to follow the viewer. The creature is bound to a specific tomb chamber, and it stands motionless until the seal is broken, at which point it activates and begins its patrol. The Ushabti is a mindless construct, but it is also a thing of terrible beauty, and some scholars study the creatures to learn the secrets of the old art.",
      "habitat": "The Ushabti stands in the tomb vaults, basalt corridors, and treasure chambers of Sundale, particularly in the Pyramid of the Eternal Sun where the greatest of the old kings are buried. It is active only when the tomb is disturbed, and it is most dangerous during the new moon, when the darkness is deepest and the dead are closest to the world of the living. The Ushabti's presence is a sign that the tomb is still sealed, and that the treasures within are still guarded.",
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
      "tokenIcon": "Bestiary/ushabti",
      "tokenBorder": "#4682B4",
      "stats": {
        "strength": 14,
        "agility": 10,
        "constitution": 16,
        "intelligence": 4,
        "spirit": 10,
        "charisma": 4,
        "maxHp": 180,
        "currentHp": 180,
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
        "maxHp": 155,
        "currentHp": 155,
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
        "maxHp": 200,
        "currentHp": 200,
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
          "spellType": "ACTION",
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
        "maxHp": 255,
        "currentHp": 255,
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
          "spellType": "ACTION",
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
        "maxHp": 235,
        "currentHp": 235,
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
          "spellType": "ACTION",
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
    },
    {
      "id": "schratling",
      "name": "Schratling",
      "description": "A knee-high forest sprite coated in moss and stained with peat-ink, obsessed with the physical act of writing.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "fey",
        "frostwood",
        "sprite",
        "moss",
        "scribe"
      ],
      "tokenIcon": "Bestiary/schratling",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 8,
        "agility": 14,
        "constitution": 10,
        "intelligence": 6,
        "spirit": 12,
        "charisma": 12,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 10,
        "currentMana": 10,
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
        "psychic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Peat-Ink Spit",
          "description": "Spits sticky dark ink that damages and causes minor memory loss.",
          "type": "ranged",
          "icon": "ability_mage_fireball",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
            },
            {
              "type": "SAVE",
              "attribute": "spirit",
              "dc": 12,
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
            "min": 2,
            "max": 10
          },
          "copper": {
            "min": 5,
            "max": 20
          }
        },
        "items": [
          {
            "itemId": "peat-ink",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 2
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Rooted in the ancient Germanic folklore of the Schrat—a reclusive, moss-clad tree-dweller—and the Celtic traditions of the helpful yet temperamental Brownie or Urisk, this sprite has found a strange sanctuary in the fog-choked woods of Frostwood Reach. While its folklore ancestors moved household items or worked in secret for a bowl of cream, this spirit is drawn to the written word, manifesting as a bizarre helper that haunts the margins of mortal records.",
      "nature": "Standing no taller than a child's knee, this hunched sprite is wrapped head-to-toe in living ironwood moss, its mottled grey-green skin resembling weathered bark with tiny mushrooms sprouting from its shoulders. It wears a makeshift loincloth stitched from stolen journal pages, whose memory-records are gradually weathered into illegibility. Its oversized, calloused hands are stained permanently with dark peat-ink, and its squashed, lichen-draped face is dominated by warm, amber eyes like old tallow candles that blink perpetually.",
      "habitat": "These elusive sprites make their homes in the damp, moss-draped hollows of the ironwood forests, occasionally wandering into the drafty cellars and quiet corners of Greymark's settlements.",
      "depth": "Driven by a strange, compulsive obsession, Schratlings sneak into Greymark homes at night to organize and rewrite journal entries in messy peat-ink scribbles; though they cannot read, they compulsively alter the family lineage-logs. In the deep woods, they weave shredded memory-glass into their hollow nests, creating pocket sanctuaries where the memory-draining fog cannot penetrate, drawing the desperate Unwoven Mimir who seek these nests to recall their lost lives. Adventurers often venture into the misty hollows following rumors of these creatures, hoping to recover their memory-glass nests or gather components for powerful wards."
    },
    {
      "id": "alraune",
      "name": "Alraune",
      "description": "A wooden child-doll with a cracked porcelain face and mandrake-root hair that mimics baby cries to lure prey.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "frostwood",
        "mandrake-changeling",
        "construct",
        "undead"
      ],
      "tokenIcon": "Bestiary/alraune",
      "tokenBorder": "#d90429",
      "stats": {
        "strength": 10,
        "agility": 16,
        "constitution": 16,
        "intelligence": 12,
        "spirit": 14,
        "charisma": 14,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "poison": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Sorrow-Cry",
          "description": "AoE 30 ft, DC 14 SPI save or targets are dazed by grief and must move toward the doll for 1 AP",
          "type": "spell",
          "icon": "spell_shadow_mindsteal",
          "range": 30,
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
            "min": 1,
            "max": 4
          },
          "silver": {
            "min": 5,
            "max": 15
          },
          "copper": {
            "min": 30,
            "max": 60
          }
        },
        "items": []
      },
      "dateCreated": "2026-06-14T10:00:00Z",
      "lastModified": "2026-06-14T10:00:00Z",
      "origin": "Formed from a Wyrd-corrupted fusion of the Celtic Changeling (the fairy double left in place of a stolen human child) and the Germanic Mandrake (the screaming root born from the blood of the hanged). It resides in the dark bogs of the Frostwood Reach.",
      "nature": "A life-sized wooden child's doll with a cracked, expressionless porcelain face. Gnarled mandrake roots sprout from its head like hair, and its hollow chest contains a pale blue wisp of light. It crawls on jointed limbs, weeping black ink from its empty eye sockets and mimicking the desperate cries of a human infant.",
      "habitat": "Damp bogs, hollow trees, and muddy crossroads in the Frostwood Reach.",
      "depth": "The Alraune mimics baby cries to lure parents and travelers. Mechanical quirk: it is terrified of raw salt. If a traveler scatters salt around themselves, the Changeling cannot approach within 10 feet. If fed a memory of deep grief, it becomes docile for 24 hours."
    },
    {
      "id": "drudehaunt",
      "name": "Drudehaunt",
      "description": "A spectral woman floating in the fog, bringing suffocating nightmares by night and washing away memories at river crossings by day.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "undead",
        "frostwood",
        "specter",
        "nightmare",
        "curse"
      ],
      "tokenIcon": "Bestiary/drudehaunt",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 8,
        "agility": 14,
        "constitution": 12,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 2,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 120
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Washbasin-Stare",
          "description": "Inflicts dread and nightmare visions on surrounding foes.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 15,
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
            "max": 1
          },
          "gold": {
            "min": 5,
            "max": 10
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
            "itemId": "nightmare-dust",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 2
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Born from the Germanic legends of the Drude, a nightmare spirit that paralyzes the sleeping, and the Celtic Bean Nighe, the ghostly washerwoman of death, the Drudehaunt embodies the tragic fate of bitter souls lost to the fog. In the setting of Frostwood Reach, they manifest as spectral omens who wash away the identities of the living.",
      "nature": "Appearing as a gaunt, hovering female silhouette, the Drudehaunt is wrapped in a shifting shawl of woven grey fog that continuously re-forms from the ambient mist, leaving her outlines blurred. She carries a translucent washbasin containing dark, memory-infused water, and her hollow-cheeked face features storm-filled grey eyes, with her mouth tightly sewn shut using spider-silk and bookbinder's thread.",
      "habitat": "These spirits hover near mist-shrouded river crossings and damp forest hollows by day, slipping into settlements and tents under the cover of night.",
      "depth": "At night, a Drudehaunt will rest heavily on the chests of sleeping scribes to consume their dreams, forcing them to relive every memory they have lost before draining new ones from their minds. By day, they wash the garments of the doomed in their ink-black basins; witnessing this act serves as a dire omen, ensuring the viewer will lose a precious memory within three days. Rumors of these spirits send waves of dread through Greymark, and adventurers are often tasked with banishing them or recovering their memory-water basins."
    },
    {
      "id": "koboldknock",
      "name": "Koboldknock",
      "description": "A barrel-chested mine sprite with skin like ironwood, guiding miners with rhythmic taps and guarding tunnels against the memory-fog.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "fey",
        "frostwood",
        "kobold",
        "miner",
        "hammer"
      ],
      "tokenIcon": "Bestiary/koboldknock",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 15,
        "currentMana": 15,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 120
      },
      "resistances": {
        "physical": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Rivet-Hammer",
          "description": "Strikes with a heavy mallet carved from a petrified tree knot.",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
            "min": 20,
            "max": 50
          }
        },
        "items": [
          {
            "itemId": "petrified-bark-knot",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 1
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "A creature born of the German Kobold and the Celtic Tommyknocker, this subterranean guardian dwells in the deep root-tunnels of the Frostwood. Representing the spirit of the earth, it rewards respectful miners and punishes those who dare mock its work.",
      "nature": "This two-foot-tall, barrel-chested humanoid possesses dark skin resembling polished ironwood heartwood, complete with dense grain rings. It carries a small mallet carved from a petrified wood knot, and its elongated fingers end in chisel-like nails that click rhythmically against the stone. Its craggy, bearded face has wide, yellow eyes that glow in the dark, and its grin reveals flat, stone teeth.",
      "habitat": "It dwells within the ironwood root-caverns and deep mine shafts beneath the Frostwood, far below the reach of the sun.",
      "depth": "Koboldknocks tap coded messages through the stone walls, guiding clever miners to rich veins of ironwood-heart, provided they leave a copper rivet as an offering at the vein's mouth. They also serve as vital wardens against the memory-fog, sensing its encroachment and hammering the cave walls to warn miners and seal off cracks before the mist can seep inside. When rumors of these spirits surface, miners seek to protect their territory, while others hire adventurers to gather their petrified mallets for their stabilizing properties."
    },
    {
      "id": "erlkings_hound",
      "name": "Erlking's Hound",
      "description": "A spectral, wolf-sized hound of wood and mist that herds forgetful travelers into the depths of the forest.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "fey",
        "frostwood",
        "hound",
        "wolf",
        "specter"
      ],
      "tokenIcon": "Bestiary/erlkings_hound",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 18,
        "constitution": 12,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 120
      },
      "resistances": {
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Bark-Shriek",
          "description": "Emits a sonic shriek that deafens and disorients prey.",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 15,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 13,
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
            "min": 2,
            "max": 8
          },
          "copper": {
            "min": 10,
            "max": 30
          }
        },
        "items": [
          {
            "itemId": "withered-ironwood-leaf",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 3
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Steeped in the Germanic ballads of the Erlking's spectral hunt and the Celtic legends of the Cu Sith, this phantom hound is a harbinger of doom. It runs at the vanguard of the Elven King's wild procession, seeking out those whose minds have been unraveled by the deep woods.",
      "nature": "This wolf-sized hound possesses a body formed from compressed autumn leaves, ironwood bark, and dark, rolling mist. It moves with a skittering, spider-like gait on elongated legs, its leaf-coat shifting and falling only to be reabsorbed, while a collar of thorn-vines clings tightly to its neck. Its fleshless muzzle is made of dark wood with green flames burning in its hollow eyes, and its jaw can unhinge to release a bark like a splitting tree.",
      "habitat": "It stalks the thickest fog-banks and deepest, untamed reaches of the ironwood forests, running where the memory-fog is dense.",
      "depth": "Targeting the scent of failing minds, these hounds run in packs to herd disoriented travelers deeper into the mist where they can be claimed by the Erlking's hunt. When a hound marks a target with three thunderous barks, their fate is sealed unless a Briaran ranger can bribe the beast with a memory sealed inside a glass vial. Local settlements frequently post bounties for these creatures, seeking their thorn-vines and glowing wood to forge protective charms."
    },
    {
      "id": "nuckelmist",
      "name": "Nuckelmist",
      "description": "A skinless centaur-like horror of muscle and peat-water that rots journals and physically erases paths from the forest.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "monstrosity",
        "frostwood",
        "centaur",
        "skinless",
        "blight"
      ],
      "tokenIcon": "Bestiary/nuckelmist",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 18,
        "intelligence": 6,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 685,
        "currentHp": 685,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 2,
        "speed": 40,
        "flying": 0,
        "swimming": 25,
        "sightRange": 80,
        "darkvision": 120
      },
      "resistances": {
        "cold": 100,
        "physical": 50,
        "poison": 100
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Trample",
          "description": "Charges forward, crushing targets beneath massive, heavy hooves.",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d10+5"
            },
            {
              "type": "CONDITION",
              "condition": "slowed",
              "duration": 1
            }
          ]
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
            "max": 30
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
            "itemId": "nuckel-sinew",
            "dropChance": 100,
            "quantity": {
              "min": 2,
              "max": 4
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "A horrific combination of the Celtic Nuckelavee, the skinless horse-rider fiend, and the Germanic Nebelgeist, a spirit of the blinding fog, the Nuckelmist is the ultimate dread of the Frostwood. Born of peat and decay, it represents the absolute dissolution of structure and direction.",
      "nature": "This towering centaur-like horror features a raw, muscled humanoid torso fused directly to a massive horse's back, both entirely devoid of skin so that glistening red muscle and black sinew are exposed. Veins of black peat-water pulse under its wet flesh, and its horse-half drags heavy hooves that leave trails of steaming, diseased soil, with yellow fog trailing where its mane and tail should be. The humanoid torso has a single, large head on an elongated neck, with one massive, bloodshot eye weeping black ink made of dissolved memories.",
      "habitat": "It appears only in the deepest fog-banks during heavy whiteouts, wandering the borders where the forest gives way to peat-bogs.",
      "depth": "The Nuckelmist is a blight upon the land; its presence rots wood, peels ironwood bark, and dissolves the pages of journals from fifty paces away. Rather than hunting creatures for flesh, it walks along established roads and absorbs their spatial memory, causing the paths to physically vanish into the overgrown wilderness. Scribes and merchants live in terror of this entity, often recruiting powerful adventurers to hunt the beast and harvest its ink-like tears for research."
    },
    {
      "id": "mossmaiden",
      "name": "Mossmaiden",
      "description": "A half-woman, half-goat guardian of the forest herds, offering vitality in exchange for years of forgotten service.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "fey",
        "frostwood",
        "nymph",
        "goat-legs",
        "camouflaged"
      ],
      "tokenIcon": "Bestiary/mossmaiden",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 12,
        "agility": 16,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 16,
        "maxHp": 155,
        "currentHp": 155,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 40,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Goat-Kick",
          "description": "Delivers a powerful back-kick that knocks targets back.",
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
            "itemId": "mossy-fur-scrap",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 2
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Drawing from the Moosfr—ulein of Germanic woodland lore and the Celtic Glaistig, the Mossmaiden is a dual-natured protector of the wild. She serves as both a gentle guide to lost travelers and a strict warden of the deep forest, balancing the preservation of nature with a thirst for mortal devotion.",
      "nature": "Lithe and graceful from the waist up, her upper body is covered in fine, velvet-soft moss that shifts from dark emerald in the wet seasons to a frosty white in the cold. Below, she possesses the muscular legs and cloven hooves of a grey-furred mountain goat. Her face is exceptionally beautiful, with birch-bark skin, high cheekbones, and pine-sap amber eyes with horizontal goat-pupils that glow in the dim mist beneath a crown of blooming ironwood flowers.",
      "habitat": "She resides in hidden, mist-draped groves and high meadows within the ironwood forests, following the seasonal movements of wild herds.",
      "depth": "As a herd warden, the Mossmaiden protects wild elk and moose from memory-fog pockets, ensuring they retain their migration routes. She occasionally approaches lonely woodsmen at twilight to offer them a cup of sweet milk, which grants incredible physical vitality but binds them to serve in her grove for seven forgotten years. Travelers seek her out for guidance, and adventurers are sometimes hired to obtain the rare ironwood flowers from her crown."
    },
    {
      "id": "fachanwatch",
      "name": "Fachanwatch",
      "description": "A two-legged, one-armed stone giant guarding mountain passes, demanding absolute truths to anchor the paths against the fog.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "monstrosity",
        "frostwood",
        "giant",
        "asymmetric",
        "guardian"
      ],
      "tokenIcon": "Bestiary/fachanwatch",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 18,
        "agility": 10,
        "constitution": 18,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 1,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50
      },
      "vulnerabilities": {
        "psychic": 25
      },
      "abilities": [
        {
          "name": "Ironwood-Club",
          "description": "Swings a massive petrified trunk, crushing and stunning targets.",
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
            "min": 0,
            "max": 0
          }
        },
        "items": [
          {
            "itemId": "ironwood-splinter-shield",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 1
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Inspired by the grotesque, single-limbed Fachan of Celtic myth and the mountain-guarding spirit R—bezahl of Germanic folklore, the Fachanwatch is a stoic arbiter of the high passes. It judges the character and honesty of those who walk the high roads, acting as a living boundary.",
      "nature": "This squat, eight-foot-tall giant possesses a deformed torso with exactly one single colossal arm growing directly from the center of its chest, balanced on two sturdy, elephantine legs. Its skin is a rough, granite-grey stone studded with ironwood splinters, and its central arm swings a petrified ironwood trunk as a club. Its face features one large agate-like eye centered above the arm, a curled leaf-like ear, and half a mouth with three stone teeth, from which it speaks in a resonant baritone.",
      "habitat": "It stands sentinel in the narrow, rocky passes and high mountain trails that wind through the Frostwood peaks.",
      "depth": "The Fachanwatch guards mountain passes, remaining motionless for decades and demanding a deep, personal truth from travelers before granting passage; those who lie are cast into the abyss. Its very presence acts as a spatial anchor that prevents the memory-fog from erasing trails, making them highly valued by road-builders who leave carved truth-stones to court their favor. Guilds often hire adventurers to negotiate with these giants or acquire fragments of their petrified clubs to stabilize trade paths."
    },
    {
      "id": "knockbrew",
      "name": "Knockbrew",
      "description": "A pot-bellied cellar sprite that ferments lost memories into forget-mead and prevents tavern casks from freezing.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "fey",
        "frostwood",
        "sprite",
        "cellar",
        "brewer"
      ],
      "tokenIcon": "Bestiary/knockbrew",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 6,
        "agility": 14,
        "constitution": 10,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 14,
        "maxHp": 45,
        "currentHp": 45,
        "maxMana": 5,
        "currentMana": 5,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "iron": 25
      },
      "abilities": [
        {
          "name": "Forget-Mead",
          "description": "Offers a drink that causes the target to lose memory of recent events.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
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
            "max": 10
          },
          "copper": {
            "min": 50,
            "max": 150
          }
        },
        "items": [
          {
            "itemId": "forget-mead-flask",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 1
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Born from the Germanic Weinschrat, a mischievous sprite of the vineyards, and the Celtic Clurichaun, the surly defender of wine cellars, the Knockbrew has adapted to the cold taverns of Frostwood Reach. It acts as both a protector of brewers and a distiller of the region's lost thoughts.",
      "nature": "This two-foot-tall, pot-bellied sprite features a flushed, cheerful face with rosy cheeks and bloodshot eyes that gleam with intelligence, and its grin reveals iron teeth filed to look like corks. It wears a leather apron stained with pine-tar and berry-juice, carries a cooper's hammer on its belt, and walks in curly-toed boots made from shaved journal-covers. A swollen, purple-veined nose dominates its face, and it is rarely seen without its tiny, self-filling metal cup.",
      "habitat": "It infests the damp, dark cellars of Greymark taverns and the deep fermentation chambers of frost-mead brewers.",
      "depth": "Knockbrews tend tavern cellars, keeping casks of pine-oil and frost-mead from spoiling or freezing in the brutal cold. They also gather the damp, fog-dissolved memories that settle in dark corners and ferment them into a potent, cloudy liquor known as forget-mead, which can erase hours of memory with a single sip. This brew is highly valued as an anesthetic by Unwoven Mimir, who frequently employ adventurers to track down elusive Knockbrews for their unique fermenting tools."
    },
    {
      "id": "moorboggle",
      "name": "Moorboggle",
      "description": "An amorphous, dog-sized parasite of peat and fog that infests homes to drain family history and drags enemies into sinkholes.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "fey",
        "frostwood",
        "swamp",
        "amorphous",
        "parasite"
      ],
      "tokenIcon": "Bestiary/moorboggle",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 12,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 6,
        "maxHp": 105,
        "currentHp": 105,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 2,
        "speed": 25,
        "flying": 0,
        "swimming": 20,
        "sightRange": 60,
        "darkvision": 80
      },
      "resistances": {
        "physical": 50,
        "cold": 25
      },
      "vulnerabilities": {
        "iron": 25
      },
      "abilities": [
        {
          "name": "Sinkhole",
          "description": "Opens a mud sinkhole that traps and swallows target into a bog pocket.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 10,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "SAVE",
              "attribute": "agility",
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
            "min": 50,
            "max": 100
          }
        },
        "items": [
          {
            "itemId": "compounded-peat-clod",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 3
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Drawing from the Germanic Boggart, a stubborn household pest, and the darker bog-dwelling Celtic P—ca, the Moorboggle is a parasitic spirit of the marshy borders. It attaches itself to mortal dwellings, thriving on the decay of family heritage and domestic peace.",
      "nature": "This dog-sized, amorphous mass of compressed peat and dark mist has no fixed shape, shifting easily between humanoid, beastly, and shadowy forms. It emits a strong sulfurous smell, and bits of swallowed debris like keys and journal-scraps float in its dark body, which features no face except for two yellow pinpoint eyes that can move anywhere. When speaking, a mouth opens like a wound in its surface, showing a throat filled with thick bog-mud.",
      "habitat": "It lives in the soggy bogs and peat-mires of the Frostwood, frequently creeping into nearby villages to infest human homes.",
      "depth": "Moorboggles act as household parasites, draining memory-energy from the inhabitants and causing their family journals to dissolve rapidly over the winter. If cornered, they can open sinkholes in the peat to drag their pursuers into subterranean bog-pockets where they are easily drowned. Homeowners hang cold-iron horseshoes above their doors to disrupt the creature's memory-draining abilities, and often hire adventurers to purge these persistent pests from their cellars."
    },
    {
      "id": "banshrond",
      "name": "Banshrond",
      "description": "A tall spectral woman in shrouds of dissolved journals whose wail heralds the total erasure of an elder's memory.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "undead",
        "frostwood",
        "specter",
        "keener",
        "curse"
      ],
      "tokenIcon": "Bestiary/banshrond",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 8,
        "agility": 14,
        "constitution": 12,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 16,
        "maxHp": 240,
        "currentHp": 240,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 120
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Memory-Keen",
          "description": "Keens a silent bone-shaking wail that drains memories in an area.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 60,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d6"
            },
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
            "max": 15
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
            "itemId": "shroud-remnant",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 2
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Born from the Celtic Banshee, whose wail foretells physical death, and the Germanic Hollergeist, which mimics familiar voices to lead travelers to their doom, the Banshrond is a phantom of mental dissolution. She wanders the margins of the forest, mourning the death of lineage and recollection.",
      "nature": "This impossibly tall, slender spirit appears draped in tattered fog-shrouds woven from the ghost-pages of dissolved journals, with faint, shifting text visible in the cloth. She stands at the forest edges, combing her ankle-length silver hair with a comb carved from a rib-bone as tears of liquid memory-glass fall and shatter at her feet. Her pale, drawn face features deep hollows around the eyes and a mouth frozen in a silent, screaming circle.",
      "habitat": "She haunts the quiet borders of fog-clearings and the outskirts of Greymark settlements.",
      "depth": "The Banshrond's wail foretells the complete erasure of an elder's memory within seven days, prompting families to desperately transcribe their lineage before all is lost. She carries a bone-comb that can part the memory-fog, which she will trade only for a genuine childhood memory to weave into her shroud. Scribes often employ adventurers to seek out these spirits to bargain for the comb or to prevent the memory-death of a vital elder."
    },
    {
      "id": "sluagh",
      "name": "Sluagh",
      "description": "A swirling vortex of spectral, memory-eating ravens formed from the final thoughts of the executed.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "gallow-swarm",
        "undead",
        "swarm"
      ],
      "tokenIcon": "Bestiary/sluagh",
      "tokenBorder": "#d90429",
      "stats": {
        "strength": 6,
        "agility": 16,
        "constitution": 12,
        "intelligence": 8,
        "spirit": 14,
        "charisma": 10,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 35,
        "flying": 35,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "wyrd": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Memory Peck",
          "description": "melee, +5 to hit, 2d6 psychic damage + DC 13 SPI save or target forgets their name, becoming dazed for 1 AP",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6"
            },
            {
              "type": "SAVE",
              "attribute": "spirit",
              "dc": 13,
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
            "min": 1,
            "max": 3
          },
          "silver": {
            "min": 5,
            "max": 10
          },
          "copper": {
            "min": 20,
            "max": 50
          }
        },
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Formed from the collective regrets and final memories of those executed at the Frostwood Reach crossroads. It represents the ultimate terror of losing one's identity to the Gallow-Wyrd.",
      "nature": "A swirling vortex of spectral ravens with glowing emerald eyes. Their wings sound like rustling parchment and clashing iron chains, and they drip dark, ink-like shadow vapor as they hunt.",
      "habitat": "Ancient crossroads, execution hills, and misty ravines in Frostwood Reach.",
      "depth": "The Sluagh circles gibbets and crossroads. It speaks in a chorus of whispered last confessions. Narrative quirk: it acts as a gatekeeper of secrets. If a traveler tells the swarm a dark secret they have never told anyone else, the swarm guides them safely through the fog. If they lie, the ravens descend to steal their tongue."
    },
    {
      "id": "fossegrim_ice",
      "name": "Fossegrim-Ice",
      "description": "A hauntingly beautiful water-spirit entombed in blue ice, whose frozen fiddle thaws the gears of ancient history while demanding a steep and scarce price from its desperate pupils.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "fey",
        "nordhalla",
        "ice",
        "fiddler",
        "clockwork"
      ],
      "tokenIcon": "Bestiary/fossegrim_ice",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 10,
        "agility": 16,
        "constitution": 12,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 18,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 80
      },
      "resistances": {
        "cold": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Ice-Fiddle",
          "description": "Plays music that compels targets to dance, leaving them helpless.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 30,
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
            "itemId": "ram-skull-fiddle-bow",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 1
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Fossegrim-Ice traces its origins to the legendary water-spirits of Norse folklore, who lured mortals to waterfalls with the promise of sublime musical mastery, mingled with the Alpine legends of the Barbegazi, the snowshoe-footed ice-dwarves who whistle warnings of cascading snow. In the frozen expanse of Nordhalla, this spirit has become a creature of absolute winter, bound to the silent cascades where the elements hold sway.",
      "nature": "Entombed within the blue ice of frozen waterfalls, the creature appears as a slender, translucent silhouette holding a fiddle carved from the bleached, frozen skull of a ram. Its body is composed of layered, cross-sectioned sheets of ice that transition through every shade of azure, terminating in massive, snowshoe-like feet that grant it the uncanny ability to glide over the thinnest drifts without fracturing the crust. Its face is a masterpiece of inhuman symmetry, carved with flawless precision, featuring eyes of solid, pale blue ice that look through frozen barriers as if they were nothing more than clear glass.",
      "habitat": "These glacial spirits reside amidst the frozen waterfalls, icy ravines, and sub-zero crevices that scar the stark terrain of Nordhalla.",
      "depth": "The Fossegrim-Ice plays a resonant, otherworldly music on its ram-skull fiddle, a specific frequency audible only to the Rime-Born Rune Keepers that temporarily thaws the intricate brass mechanisms of the Frozen Archive to prevent them from seizing forever. Once every century, the spirit offers to teach its art to a single mortal in exchange for a goat sacrificed at the foot of its waterfall; however, with Nordhalla's goats nearly extinct, this bargain often demands a memory instead. Disturbed concerts are met with swift violence, as the fierce Bloodhammer warriors guard these frozen musicians with religious fervor, viewing their songs as sacred, untouchable rites."
    },
    {
      "id": "marepress",
      "name": "Marepress",
      "description": "A dense, canine-sized shadow of absolute cold that settles upon the chests of sleepers, feeding on their violent nightmares and leaving trails of black ice.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "undead",
        "nordhalla",
        "shadow",
        "nightmare",
        "cold"
      ],
      "tokenIcon": "Bestiary/marepress",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 14,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 155,
        "currentHp": 155,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 100
      },
      "resistances": {
        "cold": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Nightmare-Crush",
          "description": "Sits on sleeping targets, draining their dreams to heal itself.",
          "type": "spell",
          "icon": "ability_physical_taunt",
          "range": 5,
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
            "itemId": "condensed-nightmare-frost",
            "dropChance": 100,
            "quantity": {
              "min": 1,
              "max": 1
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Born from the dark roots of the Norse Mara and the Alpine Alp or Trud, the Marepress is the literal weight of terror made manifest. It is a creature of nocturnal paralysis that rides the chests of the unwary, transforming the warmth of sleep into a freezing, suffocating prison of dreams.",
      "nature": "Appearing as a heavy, squat shape of compressed shadow and frost, this creature is about the size of a large dog yet carries the dense, crushing weight of stone. It moves as a concentrated pocket of absolute cold, crystallizing the air into fractal, branching frost patterns and leaving hoofprints of dark black ice wherever its heavy feet tread. It possesses no true face, only two pale, starlike eyes of freezing light that burn within the gloom, appearing in the nightmares of its victims as two distant stars in an infinite, crushing abyss.",
      "habitat": "The Marepress hunts in the dark corners of Nordhalla, lurking in drafts, cold bedchambers, and abandoned vaults.",
      "depth": "The Marepress feeds on the raw, emotional energy of terrors, showing a dangerous affinity for the vivid, blood-soaked dreams of sleeping Bloodhammer warriors whose ancestral rage fuels its appetite. Within the Frozen Archive, Rune Keepers have learned to harness this freezing presence, sealing the creatures inside heavy brass vessels to act as perpetual refrigeration units for fragile light-scrolls. Yet, this is a precarious containment; should one of these brass vessels fracture, the creature's nightmare-aura will flood the halls, plunging the keepers into madness and freezing their hearts."
    },
    {
      "id": "krampuskin",
      "name": "Krampuskin",
      "description": "A towering frost-giant punisher who hunts down oath-breakers with heavy chains, stuffing the wicked into a frost-stiffened sack to be frozen forever in mountain crevasses.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "monstrosity",
        "nordhalla",
        "giant",
        "ice",
        "chains"
      ],
      "tokenIcon": "Bestiary/krampuskin",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 18,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 10,
        "maxHp": 420,
        "currentHp": 420,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 2,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 80,
        "darkvision": 100
      },
      "resistances": {
        "cold": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Birch-Whip",
          "description": "Strikes from afar with birch branches, causing bleeding.",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 15,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 14,
              "onFail": {
                "type": "CONDITION",
                "condition": "slowed",
                "duration": 3
              }
            }
          ]
        },
        {
          "name": "Horn-Gore",
          "description": "Gores with heavy curved horns.",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
            "max": 2
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
            "itemId": "frozen-iron-chain-link",
            "dropChance": 100,
            "quantity": {
              "min": 2,
              "max": 5
            }
          }
        ]
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Krampuskin is born of Alpine winter folklore, drawing from the legendary Krampus, the horned punisher of the wicked, and the J—tunn of Norse mythology, the primordial frost-giants who embody the merciless, unyielding cold. In the lands of Nordhalla, this creature has become the ultimate enforcer of honor, tracking down those who have broken their sacred vows.",
      "nature": "Standing ten feet tall, this monstrous humanoid is covered in matted, frost-white fur over a massive body of blue-black ice. It drags a heavy chain of frozen iron links that rattle like fracturing glaciers, carrying a bundle of frozen birch branches in its clawed hands and a frost-stiffened burlap sack that writhes and whispers with the voices of its victims. Its face is a terrifying, bestial muzzle with teeth of yellowed ice, a long black tongue, and eyes that burn with a low, menacing orange flame.",
      "habitat": "This terrifying hunter roams the snowy tundra, mountain passes, and deep glacial crevasses of Nordhalla.",
      "depth": "Driven by an instinct to punish, the Krampuskin hunts those who have broken blood-oaths or deserted the shield-walls of Nordhalla, tracking its prey by the guilt in their hearts. Those caught are stuffed into its frozen sack and sealed alive inside deep glacier crevasses, preserved forever by ice that refuses to melt; Skald rangers occasionally discover the screaming, perfectly preserved faces of ancient traitors locked deep within mountain walls. The sound of its chains dragging through the snow serves as a grim warning to all who harbor secrets."
    },
    {
      "id": "wildejagd",
      "name": "Wildejagd",
      "description": "A spectral cloud of fused, wraith-like riders that raids archive towers to devour recorded histories and absorb fading minds.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "wildejagd",
        "undead"
      ],
      "tokenIcon": "Bestiary/wildejagd",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Page-Rain",
          "description": "2d6 slashing + DC 14 AGI or restrained by paper 1 round",
          "type": "ranged",
          "icon": "ability_physical_taunt",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Descending from the Celtic Sluagh, the host of the restless dead, and the Germanic Wild Hunt or W—tende Heer, this phantom ridership is a collective manifestation of the forgotten. It represents the ultimate terror of historical erasure, riding through the sky to claim the names of the living.",
      "nature": "This entity is a massive, undulating cloud composed of dozens of twisted, wraith-like riders fused together, moving in sudden, coordinated formations like a flock of starlings. It trails shreds of paper and ink droplets that fall like black snow, accompanied by the spectral sound of horse hooves echoing like slamming doors. Dozens of pale, screaming mouths open and close across its surface, each whispering the names of forgotten ancestors whose records were eaten by the fog.",
      "habitat": "It rides through the night skies during dense fog-storms, circling high above archive towers and fading settlements.",
      "depth": "The Wildejagd raids Greymark's archive towers, tearing down lineage-tapestries to consume the recorded history of entire bloodlines. They also circle those on the verge of total memory-collapse, waiting for their last thoughts to fade so they can absorb the empty shell of identity and add a new rider to their host. Scribes organize desperate hunts to protect their archives, hiring brave parties to retrieve the lost pages and components left in the ride's wake."
    },
    {
      "id": "fuath",
      "name": "Fuath",
      "description": "A translucent water spirit that lures travelers into peat pools by singing songs that recall their most precious memories.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "fuath",
        "elemental"
      ],
      "tokenIcon": "Bestiary/fuath",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 16,
        "maxHp": 90,
        "currentHp": 90,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [
        {
          "name": "Kelp-Grasp",
          "description": "+4 to hit, DC 13 AGI or grappled and pulled underwater",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Tracing its lineage to the Scottish Celtic Fuath and the Germanic Nixie, this water spirit is a personification of the deceptive depths. It feeds on the desperation of the forgetful, using their own lost identities as bait to lure them into the dark waters.",
      "nature": "This pale, slender figure appears to stand waist-deep in dark peat-pools, its body entirely translucent so that murky water and floating algae are visible through its skin. It is wrapped in a shimmering film of surface tension that reflects fog-light like oil on water, with long, kelp-like hair extending in all directions. While it seems beautiful from a distance, its features are fluid and constantly shifting, and its eyes are bottomless pools of dark water.",
      "habitat": "It waits in the stagnant peat-pools and boggy lakes that dot the lowlands of Frostwood Reach.",
      "depth": "The Fuath sings a resonant hum that echoes through the fog, bringing to mind the listener's most cherished, forgotten memories to draw them into the water. Once a victim wades in, the spirit dissolves into the pool, drowning the traveler and sinking their memories into the sediment where they compact into peat over centuries. Communities hire adventurers to search for these spirits to recover lost relatives or harvest their memory-infused water."
    },
    {
      "id": "grogoch",
      "name": "Grogoch",
      "description": "A hairy, haystack-like earth sprite that tends root gardens and guides travelers through safe tunnels in exchange for secrets.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "frostwood",
        "grogoch",
        "fey"
      ],
      "tokenIcon": "Bestiary/grogoch",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 10,
        "agility": 12,
        "constitution": 14,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Spade-Strike",
          "description": "+4 to hit, 1d6+2 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Derived from the Celtic Grogoch, a helpful yet reclusive hedge-spirit, and the Germanic Erdm—nnlein, the industrious little men of the earth, this creature is a master of the soil. It works in the dark beneath the forest floor, maintaining a hidden agricultural network that sustains the region's inhabitants.",
      "nature": "This three-foot-tall biped resembles a walking haystack, covered in dreadlocks of ironwood-moss and matted animal fur. Two short, muscular arms extend from its bulk, holding a small spade made from a sharpened elk shoulder-blade. Its face is almost entirely obscured by hair, showing only a broad nose and beady, black eyes, and its wide mouth is filled with flat, stone teeth.",
      "habitat": "It lives in clean, root-lined burrow systems dug beneath the ironwood forests, ventilated by small, hidden air vents.",
      "depth": "Grogochs cultivate vast gardens of edible ironwood-roots and frost-tubers, which serve as a crucial food supply for local villages. They also maintain a network of subterranean tunnels that allow travelers to bypass the memory-fog entirely, demanding a secret as payment for using these safe passages. Villages often hire adventurers to trade with them or protect their burrows from surface predators."
    },
    {
      "id": "cailleach",
      "name": "Cailleach",
      "description": "A towering winter crone who spins the memory-fog and judges the diligence of mortal record-keepers.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "cailleach",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/cailleach",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 16,
        "intelligence": 14,
        "spirit": 20,
        "charisma": 18,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "psychic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Distaff-Strike",
          "description": "reach 15 ft, +6 to hit, 2d8+4 bludgeoning",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "A manifestation of winter's severity and judgment, this entity is born from the Germanic winter goddess Perchta and the Gaelic winter hag Cailleach. In the Frostwood, she is the architect of the protective mist, enforcing the strict social contracts of House Thalreth.",
      "nature": "This twelve-foot-tall crone presents a shifting appearance: she seems a regal woman in a gown of frost-crystals and ironwood-silk to the diligent, but appears as a skeletal horror in peat-moss rags to the lazy. She carries an ironwood distaff to spin emotion-colored memory yarn, and her face features one piercing blue eye and one hollow, fog-filled socket, with a mouth that freezes the air when she smiles.",
      "habitat": "She wanders the highest, coldest ridges of the Frostwood during winter, descending into the valleys when the fog is thickest.",
      "depth": "Cailleachs spin the memory-fog from raw Wyrd-energy to defend the forest, encoding each strand of mist with a dissolved memory. During the deep winter, they visit Greymark homes to inspect family journals, rewarding diligent scribes with spools of memory-yarn that can restore lost thoughts, while stuffing the bellies of the negligent with straw as a stern warning. Scribes often send adventurers to locate her to seek her favor or harvest her shimmering memory-yarn."
    },
    {
      "id": "dullahan",
      "name": "Dullahan",
      "description": "A headless armored rider on a fog-steed that dissolves the identities of named targets and hunts oath-breakers.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "dullahan",
        "undead"
      ],
      "tokenIcon": "Bestiary/dullahan",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 14,
        "agility": 16,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 18,
        "charisma": 12,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 45,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Spine-Whip",
          "description": "reach 15 ft, +6 to hit, 2d6+4 slashing + DC 14 AGI or pulled 10 ft toward the rider",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Rooted in the Celtic myth of the Dullahan, the headless harbinger of death, and the Germanic legend of the kopflose Reiter who punishes broken oaths, the Dullahan is a relentless executioner. In the setting of Frostwood Reach, it enforces the sanctity of written vows and the preservation of identity.",
      "nature": "This tall, armored figure clad in blackened ironwood-plate rides a horse composed of compressed fog with a skull-like head. The rider is headless, with memory-mist escaping from its raw neck stump, and it carries its severed head—featuring a featureless, polished ironwood mask that reflects the observer's deepest fears—under one arm. A whip crafted from braided journal-cords hangs at its belt.",
      "habitat": "It haunts the ancient, fog-drowned crossroads and trade routes of the Frostwood at midnight.",
      "depth": "The Dullahan rides to crossroads to whisper a traveler's name, causing their defining memory to dissolve within a day, and actively hunts those who break written oaths recorded in Greymark's ledgers. It is particularly drawn to maskless Mimir, collecting their abandoned identities to fuel its own hollow existence. Local authorities post massive rewards for adventurers who can destroy the rider or retrieve its mirror-like ironwood mask."
    },
    {
      "id": "cusith",
      "name": "Cusith",
      "description": "A massive green-furred hound that hunts in the fog, using its barks to paralyze prey and feed on their fear.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "cusith",
        "beast"
      ],
      "tokenIcon": "Bestiary/cusith",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 18,
        "constitution": 14,
        "intelligence": 8,
        "spirit": 16,
        "charisma": 8,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 45,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Moss-Touch",
          "description": "+5 to hit, 2d6+3 cold damage",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Combining the spectral Celtic Cu Sith, whose barks signal doom, and the Germanic Schr—ttel, a clever forest predator, the Cusith is a terror of the twilight hours. It tracks its prey through the mist, feeding not on physical flesh but on the raw emotions of its victims.",
      "nature": "This massive hound stands shoulder-high to a mounted rider, its impossibly thin frame covered in dark green fur composed of living ironwood moss, with its rib-cage clearly visible. Its paws leave no trace on the forest floor, and a green glow leaks from its claws and teeth, while its long tail ends in a bioluminescent moss tuft. Its narrow muzzle unhinges to reveal backward-curving green bones for teeth, and its eyes are solid, pupilless emerald wells.",
      "habitat": "It hunts in packs throughout the deep, fog-veiled valleys and dark woods of the Frostwood.",
      "depth": "The Cusith hunts at dusk, using three distinct barks: the first paralyzes a traveler, the second erases their location memory, and the third compels them to walk into the fog's heart. Rather than killing, the hound feeds on the memory of fear, leaving its prey dazed but completely devoid of terror, which allows Briaran rangers to track the packs by locating these unnaturally fearless survivors. Adventurers are often sent to hunt these beasts to harvest their glowing moss or save lost travelers."
    },
    {
      "id": "pixie",
      "name": "Pixie",
      "description": "A hand-sized light sprite with moth wings, leading travelers through the fog with shifting colored paths.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "pixie",
        "undead"
      ],
      "tokenIcon": "Bestiary/pixie",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 4,
        "agility": 18,
        "constitution": 8,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 15,
        "currentMana": 15,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "A blend of the Celtic Pixie, which leads travelers astray or assists them for small offerings, and the Germanic Irrlicht, the deceptive Will-o'-the-Wisp of the peat-bogs, this glowing sprite is a constant companion of the fog. It represents both hope and deception, shifting its behavior on a whim.",
      "nature": "This hand-sized sprite is made of semi-transparent condensed fog-light and shaped like a tiny humanoid with delicate moth-wings. It pulses with a warm honey-colored glow and leaves a trail of phosphorescent spores that hang in the air, changing color from gold to blue or red depending on its mood. Its tiny, mouthless face is dominated by large, solid eyes of warm light through which it communicates.",
      "habitat": "It hovers over the damp marshes, peat-bogs, and low-lying paths of the Frostwood where the mist is thickest.",
      "depth": "Pixies guide lost travelers through the fog, leaving gold trails that lead to safety, blue trails that run in circles, or red trails that plunge into bogs or over cliffs. They reproduce by seeding spores into the memory-fog, where they grow by absorbing dissolved emotional memories, occasionally creating dense lantern-fogs that travelers can navigate if they understand the colors. Adventurers often seek them to collect their glow-spores for light-sources or mapping reagents."
    },
    {
      "id": "waldschrat",
      "name": "Waldschrat",
      "description": "A wiry wood sprite with a crimson moss cap that blocks forest paths with historical riddles and feeds on fear.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "frostwood",
        "waldschrat",
        "elemental"
      ],
      "tokenIcon": "Bestiary/waldschrat",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 18,
        "constitution": 10,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 45,
        "currentHp": 45,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Red-Cap-Spark",
          "description": "+4 to hit, 1d4 fire",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Waldschrat represents a merger of the Germanic Waldschrat, a hairy riddle-loving forest spirit, and the Celtic Far Darrig, the red-capped prankster. In the Frostwood, it is a playful yet dangerous manifestation of the forest's tangled history, testing the wit and courage of travelers.",
      "nature": "This three-foot-tall, wiry creature is formed of twisted ironwood-roots and bark, its body dominated by a bright crimson peaked cap of peat-moss. Its highly flexible limbs bend in impossible directions, and it carries a gnarled root-staff that rattles, releasing tiny red sparks when it is pleased. Its leathery, wrinkled face features a wide, lipless grin and mismatched red and green eyes that look in separate directions.",
      "habitat": "It makes its home along the narrow, overgrown paths and dense thickets of the ironwood forests.",
      "depth": "Waldschrats block pathways and demand that travelers solve riddles based on forgotten history, which require pure intuition to answer since the memories themselves have vanished. They also entertain themselves by playing frightening pranks, mimicking the voices of lost scribes, and feeding on the adrenaline of terrified travelers to power their glowing caps. Scribes and rangers frequently seek them out to solve historical mysteries or hire adventurers to drive them away from trade routes."
    },
    {
      "id": "klabatskerry",
      "name": "Klabatskerry",
      "description": "A small maritime sprite constructed from shipwrecks and frozen foam, compulsively repairing hulls while crying out warnings of impending icy doom.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "nordhalla",
        "klabatskerry",
        "undead"
      ],
      "tokenIcon": "Bestiary/klabatskerry",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 10,
        "agility": 16,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Mallet-Strike",
          "description": "+4 to hit, 1d6+2 bludgeoning",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Klabatskerry arises from maritime superstitions, blending the Norse and Alpine ship-sprite, the Klabautermann, who protects vessels but weeps on the deck of a doomed ship, with the tragic folklore of the Strandvasker—the unburied drowned whose remnants wash ashore. Born from the wreckage of lost vessels, these creatures are bound to the vessels of the freezing northern seas.",
      "nature": "This small figure is cobbled together from driftwood, frayed sail-cloth, and frozen sea-foam, with every component salvaged from a different doomed ship. Its hands are caulking mallets permanently fused to its wooden wrists, its red cap is stiffened by frost and stained with whale-oil, and a tarnished ship's bell is embedded in its chest, chiming softly at the approach of danger. Its face is carved like a miniature ship's figurehead with an exaggerated nose and wide grin, featuring eyes made of warm amber that flare with light when a storm draws near.",
      "habitat": "These wooden sprites inhabit the ice-choked docks, shipyards, and decks of seafaring vessels throughout Nordhalla.",
      "depth": "Lives in ship hulls. If given a bowl of sea-salt butter every Sunday, it hammers the wood to warn of structural leaks or oncoming storms. If neglected, it steals iron nails from the hull, causing the ship to slowly sink, and rings its chest-bell to attract sirens."
    },
    {
      "id": "perchtar",
      "name": "Perchtar",
      "description": "A mysterious, lockstep procession of masked winter spirits whose frozen faces judge the settlements they pass, cleansing the lands of corruption while rewarding the dutiful and terrorizing the negligent.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "perchtar",
        "undead"
      ],
      "tokenIcon": "Bestiary/perchtar",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 18,
        "intelligence": 10,
        "spirit": 20,
        "charisma": 12,
        "maxHp": 760,
        "currentHp": 760,
        "maxMana": 80,
        "currentMana": 80,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "physical": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Perchtar draws its essence from the Alpine winter parade of the Perchten during the Rauhn—chte, who drive out evil spirits while spreading terror, and the Norse —sg—rdsreia, or the Wild Hunt, which portends death and war as it storms across the dark sky. In Nordhalla, they manifest as a marching host that judges the moral fortitude of isolated settlements.",
      "nature": "This entity is a synchronized procession of dozens of masked figures moving in perfect, haunting lockstep. Each member carries a unique implement—bells, chains, brooms, pitchforks, or birch rods—and wears a mask of glacier-ice carved into either a beautiful countenance, the Sch—nperchten, or a hideous grin, the Schiachperchten. The masks themselves serve as their only faces, leaving trails of bell-prints and scorched snow behind them; the beautiful masks emit a soft warmth, while the hideous ones radiate a lethal cold, and any mask that cracks causes the spirit beneath to dissolve instantly into snow.",
      "habitat": "The procession moves along the valleys, frozen plains, and mountain passes of Nordhalla, particularly the Valley of Ymir.",
      "depth": "This winter sentinel stands outside cabins during blizzards. If the players have a warm fire, tidy beds, and have left a portion of bread on the window sill, the Perchtar taps the glass and leaves a piece of raw silver in their boots. If they are lazy, it rings its iron bells to cause nightmares."
    },
    {
      "id": "helhest",
      "name": "Helhest",
      "description": "A three-legged spectral steed of bone-white ice whose midnight gallop heralds death, yet whose life holds the glaciers of Nordhalla in place.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "helhest",
        "elemental"
      ],
      "tokenIcon": "Bestiary/helhest",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 50,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Three-Legged-Charge",
          "description": "+7 to hit, 2d8+5 bludgeoning + DC 15 AGI or trampled",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Helhest stems from the Norse Helhest, the three-legged steed of the underworld whose sighting portends plague, and the Alpine Schimmelreiter, the ghostly rider of winter storms who appears before catastrophic floods. Bound to the frozen valleys, it represents both a plague-bearing omen and a vital anchor to the landscape.",
      "nature": "This emaciated, spectral horse stands on three legs—two slender forelegs and a single massive hind leg fused from two. Its body is a bone-white mass of sun-bleached glacier-ice that shimmers with cold-fire, carrying a frozen leather saddle and featuring a mane of rigid, clattering icicles. Its head is a bare skull of yellowed ice with eye-sockets that burn with the pale, sickly green of an aurora filtered through heavy fog, and its single hind hoof strikes the ground with the hollow, heavy sound of a closing coffin-lid.",
      "habitat": "It thunders across the frozen fjords, windswept glacier faces, and ice-fields of Nordhalla.",
      "depth": "This three-legged ice horse only allows those who are 'halfway to death' (e.g., at less than 50% HP or carrying an undead curse) to mount it. If a healthy player rides it, they take cold damage each round. If paid a toll of a dead friend's fingerbone, the horse can run across ice and air, skipping hazardous terrain."
    },
    {
      "id": "myling",
      "name": "Myling",
      "description": "A heavy, floating infant spirit frozen in runic ice that clings to travelers, growing exponentially heavier until it is either melted by a warm hearth or crushes its victim.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "nordhalla",
        "myling",
        "undead"
      ],
      "tokenIcon": "Bestiary/myling",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 4,
        "agility": 10,
        "constitution": 10,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 80,
        "currentHp": 80,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 2,
        "currentActionPoints": 2,
        "initiative": 2,
        "speed": 0,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Myling originates from the Scandinavian Myling or Utburd, the vengeful spirit of an abandoned, unbaptized child that clings to travelers, and the Alpine Wechselbalg or changeling, which replaces a stolen child and becomes increasingly inhuman. It is born of grief and abandonment in the frozen wastes of Nordhalla, wandering as a freezing manifestation of unexpressed sorrow.",
      "nature": "Floating an inch above the snow, the creature appears as a tiny, withered infant encased in blue-white ice that, despite its small size, weighs hundreds of pounds. The outer shell is carved with scratched, glowing runes—a single name written repeatedly by a mother who could not name the child she left behind. Its face is locked in a frozen, silent cry with eyes squeezed shut and mouth wide open, though the eyes occasionally open to reveal an adult intelligence and a bottomless, ancient sorrow.",
      "habitat": "It wanders the snowy wilderness, the outskirts of isolated settlements, and the vicinity of nurseries during hard winters in Nordhalla.",
      "depth": "A child ghost that jumps onto a traveler's back and begs to be carried to a graveyard. As the traveler walks, the Myling becomes heavier and heavier (doubling in weight every 100 feet) until it crushes them, unless they can name the child or speak a holy prayer."
    },
    {
      "id": "jutul",
      "name": "Jutul",
      "description": "A sentient boulder of warm granite that blocks mountain passes, demanding tolls of raw iron to fuel its stony mass.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "nordhalla",
        "jutul",
        "construct"
      ],
      "tokenIcon": "Bestiary/jutul",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 8,
        "constitution": 20,
        "intelligence": 6,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 215,
        "currentHp": 215,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 20,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 75,
        "cold": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Roll-Attack",
          "description": "+6 to hit, 2d10+4 bludgeoning, DC 15 AGI or pinned",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d10+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Jutul is rooted in the Norse legends of trolls, who turn to stone when exposed to sunlight, and the Alpine Berggeist, the mountain-spirit who guides or misleads travelers in the heights. In the sunless, dimmed skies of Nordhalla, these creatures are no longer petrified by daylight, remaining active and alert.",
      "nature": "This creature resembles a massive boulder of grey granite shaped like a seated humanoid, completely indistinguishable from a normal glacial erratic when inert except for a faint warmth radiating from its core. When it stirs, joint-like cracks open across its rocky surface, and moss and lichen align in runic patterns. Its face has barely discernible features—a heavy brow-ridge, a broken nose, and a grim mouth—with its eyes appearing as deep depressions that burn with the warm glow of deep-earth amber.",
      "habitat": "They are found along high mountain passes, rocky valleys, and boulder-strewn slopes of Nordhalla.",
      "depth": "Jutuls sit motionless on trade routes for decades, only to animate and roll across paths when valuable caravans approach, demanding a toll of raw iron ore to absorb into their granite bodies. Because the dimmed sun no longer petrifies them, they pose a constant hazard to travelers, forcing Rune Keepers to utilize concentrated runic light to temporarily freeze the creatures back into inert stone and buy passage for convoys."
    },
    {
      "id": "lindwyrm",
      "name": "Lindwyrm",
      "description": "A serpentine predator with cat-like forelegs that tunnels through glaciers, devouring runic magic and thawing the ancient tombs it guards.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "lindwyrm",
        "construct"
      ],
      "tokenIcon": "Bestiary/lindwyrm",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 16,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Cat-Claw-Strike",
          "description": "+6 to hit, 2d6+4 slashing + 1d6 cold",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Lindwyrm descends from the Norse Lindworm, the wingless, two-legged serpentine dragon that guards burial mounds, and the Alpine Tatzelwurm, a half-feline, half-serpentine cryptid of the high forests. In Nordhalla, it is a creature that tunnels through the ice, drawn to the ancient power of the dead.",
      "nature": "It possesses a fifteen-foot serpentine body covered in overlapping, translucent ice-scales that refract light into shifting rainbows along its flanks. It moves on two muscular, cat-like forelegs tipped with pickaxe-claws of dense black ice, leaving glassy, trackless tunnels that refreeze instantly in its wake. Its face is a fusion of a feline skull and serpentine features, complete with horizontal-slit pupils, a dislocating jaw, and two backward-sweeping horns of spun frost-silk.",
      "habitat": "It makes its home in the permafrost, sub-glacial tunnels, and ancient burial mounds of Nordhalla.",
      "depth": "These beasts coil around the dead in glacier-tombs, paradoxically thawing the graves because they feed on the surrounding cold itself. They are also drawn to runic inscriptions, devouring carved rune-stones to absorb the bound mana within them; this makes them a critical threat to the Frozen Archive, where a single breaching Lindwyrm could consume centuries of recorded knowledge in a single feeding."
    },
    {
      "id": "nidhoggr",
      "name": "Nidhoggr",
      "description": "A warm, root-like serpentine worm that burrows under fortifications, gnawing away both stone foundations and the sacred runic vows of the clans.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "nidhoggr",
        "undead"
      ],
      "tokenIcon": "Bestiary/nidhoggr",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 18,
        "agility": 12,
        "constitution": 18,
        "intelligence": 6,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50,
        "cold": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Lamprey-Maw",
          "description": "reach 10 ft, +6 to hit, 2d8+4 piercing + DC 14 CON or bleeding 1d8/round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nidhoggr is inspired by the Norse N——h—ggr, the dragon that gnaws the roots of the World Tree, and the Alpine Schrat-Root, a subterranean spirit that undermines buildings. In Nordhalla, it is a blind, burrowing menace that feasts on foundations and magical pacts alike.",
      "nature": "This creature appears as a tangle of black, rope-thick coils that resemble petrified roots, covered in matte black scales that are warm to the touch. It has no distinct head, instead terminating in a circular, lamprey-like maw lined with rotating rings of translucent amber teeth that act as a boring machine. Each tooth is a fragment of a consumed rune, and the tunnels it leaves behind are filled with fine black ash that smells of burnt magical energy.",
      "habitat": "It tunnels deep beneath the frozen bedrock, keep foundations, and glacial vaults of Nordhalla.",
      "depth": "The Nidhoggr gnaws at the bedrock beneath keeps and the Frozen Archive, causing heavy stone walls to crack and eventually collapse. It is drawn to the magical energy of buried blood-oaths, devouring the runes of sworn vows and permanently stripping Bloodhammer warriors of the ancestral rage that defines their lineage."
    },
    {
      "id": "strandvasker",
      "name": "Strandvasker",
      "description": "A swollen, barnacle-encrusted drowned corpse that wails along the shoreline, mimicking lost loved ones to lure sailors into the freezing water.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "strandvasker",
        "undead"
      ],
      "tokenIcon": "Bestiary/strandvasker",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 14,
        "agility": 12,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "poison": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Rope-Grasp",
          "description": "+5 to hit, 2d6+3 bludgeoning + DC 13 AGI or pulled toward the water",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Strandvasker draws from the Norse Strandvasker, the spirit of a drowned sailor washed ashore seeking burial, and the Alpine Wassermann or Nix, a water-spirit that lures the living to drown. It represents the maritime tragedies of Nordhalla's icy waters.",
      "nature": "This creature appears as a swollen, blue-grey humanoid draped in frozen, salt-crusted rags, with barnacles clinging to its stiff joints and frozen seaweed hanging like brittle curtains. Salt-crystals form a rough armor over its torso, and its hands permanently clutch a frozen length of hemp rope. Its face is distorted by seawater and ice, and when it wails, its jaw dislocates to reveal a throat packed with black ice and glittering fish-bones.",
      "habitat": "It haunts the icy tidelines, rocky shorelines, and frozen fjords of Nordhalla.",
      "depth": "At dawn and dusk, the Strandvasker stands at the ice-edge, emitting a deep, foghorn-like call that mimics the voices of lost crewmates to lure the living to their doom. The only way to silence the wail is to grant the creature a proper sea-burial on a burning ship, a ritual so costly that many of these spirits are left to haunt the shores for centuries."
    },
    {
      "id": "landvaettir",
      "name": "Landvaettir",
      "description": "A colossal mountain guardian composed of living granite and snow, protecting its peaks from corruption but triggering avalanches at the sight of any dragon imagery.",
      "type": CREATURE_TYPES.DRAGON,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "landvaettir",
        "dragon"
      ],
      "tokenIcon": "Bestiary/landvaettir",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 10,
        "constitution": 20,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 450,
        "currentHp": 450,
        "maxMana": 40,
        "currentMana": 40,
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
        "physical": 75,
        "cold": 100
      },
      "vulnerabilities": {
        "acid": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Landv—ttir-Peak stems from the Norse Landv—ttir, protective spirits of the land who could be offended by hostiles, and the Alpine Salvanel, the wild guardians of mountain passes. In the high ridges of Nordhalla, these giants are the living embodiment of the mountains themselves.",
      "nature": "Standing fifteen to twenty feet tall, this humanoid is composed entirely of the mountain it inhabits, featuring granite skin, snow-white hair, and clothing made of living lichen. Its texture matches the local geology so perfectly that it is invisible when still, with bird-nests in its stone shoulders and mountain goats sheltered at its feet under a ring of clear sky. Its face is an ancient cliff-face with a brow like an overhang, a nose like a broken spire, and slow-blinking eyes of glacier-blue.",
      "habitat": "It resides on the high mountain peaks, cliff faces, and alpine passes of Nordhalla.",
      "depth": "The Landv—ttir-Peak acts as a regional barrier against Wyrd-corruption, keeping its mountain slopes completely free of anomalies and allowing Rune Keepers to map safe paths. However, they harbor a deep hatred for draconic symbols, triggering instant avalanches at the sight of dragon-prows or runes, an ancient prohibition that has banned dragon motifs from all Skald heraldry."
    },
    {
      "id": "vettir",
      "name": "Vettir",
      "description": "An invisible storm-spirit that shapes the howling winter winds, capable of carrying messages across the tundra or burying travelers in sudden blizzards.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "vettir",
        "elemental"
      ],
      "tokenIcon": "Bestiary/vettir",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 4,
        "agility": 20,
        "constitution": 10,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 10,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 5,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 100,
        "cold": 100
      },
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Derived from the Norse Vettir, wind-spirits that whisper through the cracks of longhouses, and the Alpine Windgeister or F—hn spirits that ride warm mountain winds, the Vettir is the living soul of the storm. It represents the fickle nature of the northern winds, shifting from quiet whispers to freezing gales.",
      "nature": "Completely invisible, this creature is felt only through its physical effects: sudden drops in temperature, swirling snow forming fleeting humanoid shapes, and whispered words carried on the wind. Its arrival is heralded by an eerie, total silence, and it leaves behind intricate runic spirals in the snow that vanish in seconds. On rare occasions, the storm-front itself coalesces into a massive face of snow, shifting from a screaming giant to a serene elder, or mirroring the face of the watcher.",
      "habitat": "It hunts the open tundra, high peaks, and windswept valleys of Nordhalla.",
      "depth": "The Vettir herds storms across the landscape, controlling the paths of blizzards and F—hn winds. Rune Keepers leave offerings of mead and dried cod at high wind-shrines to secure safe passage through their territory; while Skald commanders sometimes use the wind to whisper messages across great distances, the spirits are prone to mischief, altering the words or adding cryptic riddles."
    },
    {
      "id": "bergthrall",
      "name": "Bergthrall",
      "description": "A stone-skinned dwarven craftsman of the deep caverns who cuts flawless glacier-crystals, trading them for iron and blubber under the threat of petrifaction.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "bergthrall",
        "construct"
      ],
      "tokenIcon": "Bestiary/bergthrall",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 10,
        "constitution": 16,
        "intelligence": 14,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 80,
        "currentHp": 80,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Chisel-Hands",
          "description": "+4 to hit, 1d6+2 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Bergthrall is born of the Alpine Bergfolk, the gem-keeping mountain-dwellers, and the Norse Dvergr, the subterranean master-smiths who forged legendary treasures and feared the sunlight. In Nordhalla, they are the silent keepers of deep crystal veins, surviving in the absolute dark of the earth.",
      "nature": "This stocky, four-foot humanoid has skin of solid granite and a beard composed of braided copper wire and frozen quartz crystals. It wears a frost-stiffened leather apron with pockets overflowing with raw, flawlessly cut blue gemstones harvested from glacial veins. Its face is flat and craggy, with a massive nose, a tight mouth set in a permanent expression of professional assessment, and glowing copper-colored eyes that can see in total darkness.",
      "habitat": "They dwell in the deep crystal caverns and subterranean mines beneath the mountains of Nordhalla.",
      "depth": "The Bergthralls carve the unique glacier-crystals used by Rune Keepers to store fragile light-scrolls in the Frozen Archive, a technique that cannot be replicated. They refuse gold, trading these crystals only for refined iron and whale-blubber; their bargains are absolute, and any who attempt to cheat them are absorbed directly into the stone, transformed into new mineral veins."
    },
    {
      "id": "fenris",
      "name": "Fenris",
      "description": "A pony-sized wolf cub bound by a magical collar that hunts down oath-breakers, representing a fragment of the apocalyptic Fenrir.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "nordhalla",
        "fenris",
        "beast"
      ],
      "tokenIcon": "Bestiary/fenris",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 16,
        "agility": 18,
        "constitution": 14,
        "intelligence": 8,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 50,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Puppy-Bite",
          "description": "+6 to hit, 2d6+4 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Fenris is a juvenile manifestation of the Norse Fenrir, the apocalyptic wolf bound by the gods until Ragnar—k, mixed with the Alpine Barbegazi who navigate deep snow with ease. It embodies the restless, bound fury of the end times, hunting the frozen wastes of Nordhalla.",
      "nature": "Though only a pup, this creature is the size of a pony, with fur that shifts between frost-white and shadow-black and giant, shield-wide paws that glide over snow drifts. It wears a collar of braided silk ribbon that glows with the golden magic of Gleipnir, and its thick tail leaves a distinct drag-mark behind it. Its face displays a puppy's oversized ears and lolling tongue, but its eyes can suddenly flash with an ancient, predatory intelligence, turning from warm brown to molten gold when it senses an oath-breaker.",
      "habitat": "It hunts across the windswept tundra and frozen plains of Nordhalla.",
      "depth": "Driven by Fenrir's bound energy, the Fenris relentlessly tracks down those who break blood-oaths across the tundra; they cannot be slain, only temporarily appeased or distracted with fresh meat. The golden collar around its neck is a fragment of the legendary fetter Gleipnir, keeping it from growing to its full, world-ending size. Rune Keepers watch these creatures closely, for the removal of a collar would trigger a catastrophic growth that could tear Nordhalla apart."
    },
    {
      "id": "disir",
      "name": "Disir",
      "description": "A procession of silent, pale spectral matriarchs who judge households during winter, rewarding ancestral devotion and cursing the negligent with barrenness.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "disir",
        "fey"
      ],
      "tokenIcon": "Bestiary/disir",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 18,
        "charisma": 16,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "psychic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Hair-Grasp",
          "description": "reach 10 ft, +5 to hit, 2d6+3 cold",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Disir represents the Norse D—sir, female ancestral guardians honored during the D—sabl—t who bless or curse their descendants, and the Alpine Perchta's Retinue, who punish sloth and household neglect. They manifest during the deep winter to ensure ancestral traditions are upheld.",
      "nature": "This entity appears as a procession of tall, pale women in flowing white gowns who glide over the snow without leaving footprints. Each figure carries a ritual object—a distaff, a bloody spindle, a sheaf of wheat, or an iron knife—and holds a tallow candle that burns with a constant, unmeltable blue flame. They share identical, sorrowful faces with solid white, unblinking eyes, their mouths slightly parted to emit a continuous, low hum.",
      "habitat": "They travel between the longhouses and settlements of Nordhalla during the winter solstice.",
      "depth": "Visiting every longhouse during the winter celebrations, the wraiths bless families who honor their female ancestors with warmth and fertility. However, households that neglect their duties are struck by the Spindle-Curse, finding their yarn replaced with human hair and their spindles soaked in frozen blood, rendering the women of the house barren. Bloodhammer matriarchs view this curse as a threat far greater than any raiding army, going to extreme lengths to ensure their offerings are immaculate."
    },
    {
      "id": "valravn",
      "name": "Valravn",
      "description": "A menacing half-wolf, half-raven chimera that devours the hearts of the fallen, gaining dark intelligence and hunting wounded prey.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "valravn",
        "beast"
      ],
      "tokenIcon": "Bestiary/valravn",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 16,
        "agility": 16,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 155,
        "currentHp": 155,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 50,
        "swimming": 0,
        "sightRange": 120,
        "darkvision": 120
      },
      "resistances": {
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Valravn is born of the Danish/Norse folklore of the valravn—a raven that gains dark knowledge and powers after eating the flesh and heart of a fallen warrior on an unburied battlefield. In Nordhalla, it manifests as a half-wolf, half-raven beast feeding on the remains of battlefields.",
      "nature": "A wolf-sized hybrid with the powerful hindquarters, tail, and legs of a black wolf, transitioning into the feather-covered chest, wings, and head of a giant raven. It has a sharp obsidian beak and cold, glowing violet eyes that burn with dark magic.",
      "habitat": "It hunts the frozen crags, pine forests, and battlefields of Nordhalla, searching for the hearts of the fallen.",
      "depth": "The Valravn stalks the periphery of clan skirmishes in Nordhalla, waiting for the slaughter to end. It is said that by devouring the hearts of unburied kings, a Valravn can take the form of a knight or gain supreme wisdom. Skalds sing of warriors who made pacts with the birds, trading their firstborn children for victory in battle. The presence of a Valravn circling overhead is considered a grim omen of an impending massacre."
    },
    {
      "id": "kraken",
      "name": "Kraken",
      "description": "A colossal sub-glacial leviathan whose massive tentacles shatter ice sheets to drag entire fleets into the freezing depths.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "nordhalla",
        "kraken",
        "elemental"
      ],
      "tokenIcon": "Bestiary/kraken",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 22,
        "agility": 10,
        "constitution": 20,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 6,
        "maxHp": 450,
        "currentHp": 450,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 2,
        "speed": 10,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "physical": 50,
        "piercing": 50
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [
        {
          "name": "Tentacle-Slam",
          "description": "reach 30 ft, +7 to hit, 2d10+5 bludgeoning + DC 15 AGI or grappled",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d10+5"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 15,
              "onFail": {
                "type": "CONDITION",
                "condition": "slowed",
                "duration": 1
              }
            }
          ]
        },
        {
          "name": "Beak-Crush",
          "description": "only against grappled targets, 3d8+5 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+5"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kraken arises from the Norse Kraken, the legendary leviathan of the deep seas whose size rivaled islands, and the Alpine Seeschlange, the giant serpents reported to dwell in deep mountain lakes. It embodies the hidden horrors of the frozen northern waters, waiting beneath the thick sheets of ice.",
      "nature": "This creature manifests as enormous, semi-transparent tentacles as thick as longship masts, covered in barbed ice-suckers capable of crushing stone. Its skin reveals dark sub-glacial water pulsing through visible veins, highlighted by bioluminescent organs that glow in slow, rhythmic pulses. Its actual face is rarely seen, resting in deep fjord trenches, but when it surfaces, it reveals a massive parrot-like beak of black ice flanked by glowing indigo eyes the size of shields.",
      "habitat": "It lives in the deep fjord trenches, ice-covered seas, and coastal waters of Nordhalla.",
      "depth": "The Kraken is a dread destroyer of ships, attacking by shattering the thick surface ice from below and dragging vessels into the freezing waters before the crew can escape. When dormant, its massive back presses against the ice to form a dome that resembles a natural island; experienced Skald captains test these ice-islands by driving iron spikes deep into the frost, fleeing immediately if the wound bleeds dark water."
    },
    {
      "id": "marmennill",
      "name": "Marmennill",
      "description": "A small, glowing merman who plays enchanting melodies on a bone-harp, offering cryptic prophecies when captured with runic bait.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "marmennill",
        "elemental"
      ],
      "tokenIcon": "Bestiary/marmennill",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 16,
        "constitution": 10,
        "intelligence": 16,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [
        {
          "name": "Bone-Harp-Bash",
          "description": "+4 to hit, 1d4 bludgeoning — it is not a combat creature",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Marmennill stems from the Norse Marmennill, a prophetic merman captured by fishermen who answered questions in riddles, and the Norse and Alpine Nix or N—kki, water-spirits that lure victims to the deep with enchanted music. It represents the mystery and allure of the frozen northern fjords.",
      "nature": "This three-foot-tall humanoid has a fish-like lower body covered in iridescent, ice-blue scales and a lean, grey-skinned upper torso with webbed hands and a broad throat-sac. It wears a crooked crown of pale volcanic coral and carries a tiny harp made of fish-bone and strings of sea-ice, its scales casting a soft blue bioluminescence in the dark. Its face features wide, frog-like eyes of different blue shades that blink independently, a nose reduced to sealing slits, and an enormous, jointless grin packed with tiny, sharp teeth.",
      "habitat": "It dwells in the ice-locked fjords, coastal pools, and deep waters of Nordhalla.",
      "depth": "Fishermen can capture the Marmennill using lines baited with runic inscriptions, forcing it to answer three questions about the future; however, its replies are always framed in riddles so complex that Rune Keepers spend decades deciphering them before the creature dissolves back into sea-water. When free, they sit on submerged rocks and play bone-harps, creating melodies that induce a dreamlike state and draw listeners into the freezing waters, forcing Skald sentries to plug their ears with whale-blubber during the creature's mating season."
    },
    {
      "id": "havgammel",
      "name": "Havgammel",
      "description": "A shifting marine entity that oscillates between a beautiful mermaid and a terrifying frost serpent, blessing or cursing catches while guiding ships to safety or crushing them in ice.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "nordhalla",
        "havgammel",
        "elemental"
      ],
      "tokenIcon": "Bestiary/havgammel",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 14,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 16,
        "maxHp": 135,
        "currentHp": 135,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Havgammel is derived from the Norse Havfrue and Havmand, merfolk who grant prophecies or ruin fishing catches, and the Alpine Tatzelwurm-Ice variants, elemental beasts adapted to sub-zero temperatures. It is a creature of dual natures, reflecting the shifting and unpredictable dangers of the frozen ocean.",
      "nature": "This creature shifts instantaneously between two distinct forms depending on the observer's intent: a beautiful, pale woman with a seal-like lower body covered in deep blue-black scales, and a monstrous, serpentine beast with a cat-like head and a body of compressed frost and clicking, translucent ice-plates. In both forms, it wears a necklace of scrimshaw bone depicting scenes of drowning. Its face changes from a delicate, sea-green eyed porcelain beauty to a fanged, angular visage with pupilless white eyes that radiate absolute cold.",
      "habitat": "It resides in the deepest fjords, frozen bays, and ice-floe fields of Nordhalla.",
      "depth": "The Havgammel can bless fishermen with bountiful catches in exchange for a silver coin, but she will curse those who pollute or waste life, returning only nets of carved bones and solid ice. Her dual nature makes her an unpredictable force for sailors; in her mermaid guise, she guides lost vessels to safety, but in her serpentine form, she creates the very ice-floes that trap and crush them, leaving Skald captains to gamble their lives with every encounter."
    },
    {
      "id": "pazuzu",
      "name": "Pazuzu",
      "description": "A towering wind-demon of basalt and compressed ash, bearing the monstrous visage of ancient storm gods. It sweeps through the volcanic reaches of Sundale, scouring the land with ash-storms while paradoxically warding off corrupting plagues.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "pazuzu",
        "elemental"
      ],
      "tokenIcon": "Bestiary/pazuzu",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 16,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Lion-Claw",
          "description": "+7 to hit, 2d8+5 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            }
          ]
        },
        {
          "name": "Scorpion-Sting",
          "description": "reach 10 ft, DC 15 CON or poisoned: 2d6 poison/round for 3 rounds",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Pazuzu is a creature born of ancient chaos and volcanic fury, tracing its mythic lineage to the legendary wind-demons of Mesopotamian lore, whose king was a malevolent force that paradoxically protected humanity against plagues. Combined with this dual nature is the shadow of Sutekh, the Egyptian god of storms and desert storms, whose enigmatic Set Animal—characterized by its square ears and curved snout—manifests in the creature's hybrid form, anchoring its role as a chaotic warden of Sundale's scorched wastes.",
      "nature": "Standing eight feet tall, the Pazuzu is a terrifying sight, its winged, humanoid form crafted from the porous volcanic basalt of the Sundale plains, hot to the touch and black as soot. Four massive eagle-wings of compressed ash and superheated wind fold across its back, constantly shedding glowing embers as it moves. Its forearms terminate in fearsome lion-claws, its taloned feet grip the stone, and a segmented scorpion-tail curves menacingly from its spine, while a heavy amulet of hammered bronze hangs about its neck. Its face is a monstrous amalgamation of the Set Animal's long, narrow snout and a wide, grinning maw, crowned by erect, square ears and lit by the furious red glow of its eyes.",
      "habitat": "These wind-demons dwell within the thermal updrafts and jagged basalt cliffs of Sundale and the Emberspire terrain. They build their nests high on the precipices of volcanic calderas, riding the searing heat waves that rise from the boiling earth below.",
      "depth": "This four-winged gale-spirit refuses to fight anyone who speaks its true name backwards. It is obsessed with collecting coins from dead empires; it will exchange ancient secrets or redirect a sandstorm if paid in gold from a dynasty that no longer exists."
    },
    {
      "id": "tiamat",
      "name": "Tiamat",
      "description": "A multi-headed serpent of black glass and molten orange, swimming through the lava rivers of Emberspire. It seeks out heat and precious minerals, draining the warmth of the sun and leaving fields of razor-sharp obsidian in its wake.",
      "type": CREATURE_TYPES.DRAGON,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "tiamat",
        "dragon"
      ],
      "tokenIcon": "Bestiary/tiamat",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 22,
        "agility": 14,
        "constitution": 20,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 560,
        "currentHp": 560,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 75
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "In the blistering depths of the Sundale caldera, the Tiamat embodies the ancient mythic forces of primordial creation and destruction. Its lineage is tied to Tiamat, the Babylonian dragon-goddess of the salt sea and mother of monsters, and Apep, the Egyptian chaos-serpent that sought to devour the sun each night. Twisted by the reality-warping influence of the Wyrd, this beast serves as an eternal enemy of cosmic order, seeking to consume light and heat wherever it can find them.",
      "nature": "The Tiamat is a massive, multi-headed serpent whose obsidian scales are shot through with veins of glowing, molten orange, creating a shifting crust of cooling magma. Each of its serpentine heads branches from a central, muscular trunk, terminating in a unique jaw shape—some needle-toothed and narrow, others broad and crushing—all flanking a perpetually dripping, lamprey-like mouth. The creature's belly glows with the fierce heat of a forge, and as it slithers, it sheds scales that cool into fields of razor-sharp glass. Its heads are crowned with single, iris-less eyes like burning white coals, which spin and track independently to grant the beast a complete three-hundred-and-sixty-degree view of its surroundings.",
      "habitat": "These massive glass serpents make their home in the slow-flowing lava rivers and molten channels that radiate from Emberspire. They swim effortlessly through the superheated rock, completely at home in the deepest, most volcanic crevices of the region.",
      "depth": "Swimming through the subterranean magma currents, the Tiamat feeds on rare minerals and gold-trace veins, putting them in direct competition with the smiths of the Emberth clans. The Wyrd has amplified their mythic hunger, drawing them to the warmth of the Solbrand, which they will coil around and drain if left unchecked. Because of this, the Korr Emberth maintain a sleepless, heavily armed vigil at the Harath-Chamber to repel Tiamat incursions, though bold adventurers are often lured by rumors of these beasts to harvest their glass scales or the precious metals concentrated within their gullets."
    },
    {
      "id": "anzu",
      "name": "Anzu",
      "description": "A colossal storm-bird of ash-grey feathers and razor-sharp obsidian talons, obsessed with stealing runic inscriptions. It is a creature of cyclic rebirth that immolates itself in Emberspire's caldera to rise renewed.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundale",
        "anzu",
        "elemental"
      ],
      "tokenIcon": "Bestiary/anzu",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 20,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 310,
        "currentHp": 310,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 5,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Anzu is a legendary avian entity that combines the theft of cosmic order with the eternal cycle of creation. It draws its heritage from Anzu, the Mesopotamian storm-bird that stole the Tablet of Destinies, and the Bennu, the sacred Egyptian heron of Heliopolis who heralded rebirth and the renewal of the sun. In the ash-choked skies of Sundale, this great raptor represents both a thief of mortal legacy and an avatar of eternal return.",
      "nature": "With a wingspan stretching thirty feet, the Anzu is a majestic hybrid that blends the raw power of a hunting eagle with the slender grace of a heron. Its plumage is composed of ash-grey feathers that shimmer with heat-haze, their primary edges glowing with the orange light of a cooling lava flow. Its crown is adorned with a crest of golden, sun-bright feathers, and its legs terminate in razor-sharp obsidian talons that ignite dry tinder upon contact. Its face features a sharp, curved beak of yellowed bone and golden, hypnotic eyes that spin with a mesmerizing spiral, radiating a furnace-like heat to all who dare look upon them.",
      "habitat": "The Anzu builds its high, scorched nests upon the volcanic peaks and smoking crags of the Sundale and Emberspire terrain. These roosts are situated far above the ash clouds, where the birds can survey the volcanic wastes.",
      "depth": "A giant lion-headed storm bird that eats thunderbolts. If players use lightning magic near it, the Anzu flies down to inhale the spell, gaining health and speed. It can be distracted by throwing highly conductive copper rods away from the party."
    },
    {
      "id": "girtablilu",
      "name": "Girtablilu",
      "description": "A half-human, half-scorpion centauroid guardian with skin of hardened basalt and eyes of solid gold. It stands watch over ancient volcanic gates, testing travelers with riddles and offering a venom that can cure Wyrd-sickness.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "girtablilu",
        "fey"
      ],
      "tokenIcon": "Bestiary/girtablilu",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 12,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 75,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Pincer-Crush",
          "description": "+6 to hit, 2d8+5 bludgeoning + DC 15 STR or grappled",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "strength",
              "dc": 15,
              "onFail": {
                "type": "CONDITION",
                "condition": "slowed",
                "duration": 1
              }
            }
          ]
        },
        {
          "name": "Stinger-Venom",
          "description": "reach 15 ft, DC 16 CON — paradoxically, in small doses this venom CURES Wyrd-sickness; in large doses, it kills",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 16,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Girtablilu traces its origins to the legendary Mesopotamian scorpion-men who guarded the gates of the sun-god Shamash, whose terrifying gaze struck awe into mortals. Blended with this guardian aspect is the influence of Serket, the Egyptian scorpion-goddess of healing, whose priesthoods were renowned for neutralizing venoms. In Sundale, they stand as the sleepless sentinels of ancient vaults, holding the secrets of the sun.",
      "nature": "The Girtablilu possesses the powerful, bronzed torso of a human seamlessly joined to the segmented, multi-legged body of a desert scorpion. Its human upper body is bare and marked by ceremonial burn-scars, while the scorpion lower half is armored in overlapping plates of basalt and colored with the ochre hue of Sundale's dunes, ending in a massive black stinger the size of a tower-shield. Its face is noble and strongly defined, set with pupil-less eyes of solid gold that project an aura of divine, unyielding authority.",
      "habitat": "These ancient scorpion-folk reside in the dry, sun-scorched dunes and rocky thresholds of the Sundale and Emberspire regions. They are typically found standing motionless at the entrances of volcanic temples, caves, and ancient sanctuaries.",
      "depth": "Servants of eternal vigilance, the Girtablilus guard the thresholds of Korr sanctuaries, refusing passage to anyone who cannot answer their intricate riddles concerning the Solbrand or the history of the Dimming. Though their appearance is intimidating, their stinger contains a paradoxical venom that, in small doses, acts as the only known cure for the Wyrd-sickness that afflicts those exposed to the Emberspire breach. The Sun-Speakers of the Korr Emberth frequently trade rare, fragrant incenses with the Girtablilus to obtain this life-saving substance, while adventurers are often hired to negotiate with them or retrieve a sample of their venom from the wild."
    },
    {
      "id": "ammit",
      "name": "Ammit",
      "description": "A massive, smoldering hybrid of lion, hippopotamus, and crocodile that judges the souls of those who approach Emberspire. It devours the corrupt, erasing their very names and memory from the sacred stones.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "ammit",
        "beast"
      ],
      "tokenIcon": "Bestiary/ammit",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 20,
        "intelligence": 8,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 340,
        "currentHp": 340,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Crocodile-Bite",
          "description": "+7 to hit, 2d10+5 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d10+5"
            }
          ]
        },
        {
          "name": "Lion-Charge",
          "description": "+6 to hit, 2d6+4 bludgeoning + DC 15 AGI or knocked prone and pinned",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ammit is a terrifying composite beast whose origins lie in the dual myths of Egyptian and Mesopotamian judgment. It draws its nature from Ammit the Devourer, who ate the hearts of the unworthy in the Hall of Ma'at, and Humbaba, the monstrous guardian of the Cedar Forest whose face of entrails struck terror into the hearts of gods and men. In the volcanic depths of Sundale, it serves as the ultimate arbiter of truth and oath-keeping.",
      "nature": "Standing fifteen feet tall at the shoulder, the Ammit is a living furnace that constantly smolders and trails dark smoke from its patchwork hide. It has the muscular forequarters of a lion, the bulky hindquarters of a hippopotamus, and the scaled back of a crocodile covered in obsidian plates that clink together like chains. Its lion-mane is composed of low, flickering flames that burn without fuel, while its thick, grey hippopotamus hide is pocked with volcanic cysts. The creature's oversized crocodilian head features a jaw that opens to a ninety-degree angle, revealing three terrifying rows of teeth: lion-fangs, hippo-tusks, and crocodile-needles, all beneath two glowing, pure white eyes that look out with cold, absolute judgment.",
      "habitat": "The Ammit patrols the scorched approaches, narrow volcanic bridges, and inner chambers surrounding the Emberspire. It is never found far from these sacred gateways.",
      "depth": "Acting as a living barrier to the inner sanctums of Emberspire, the Ammit senses the moral weight of anyone who approaches, ignoring the pure of heart while savagely devouring those burdened by broken oaths or Wyrd-corruption. Those who fall to the beast suffer a fate worse than death; their souls are erased from existence, and their names vanish from the volcanic stone-records of the Emberth, undoing even the most permanent burn-mark inscriptions. This terrifying power makes them a symbol of ultimate dishonor among the Solvarn, and adventurers are warned to maintain impeccable honor when rumors speak of an Ammit blocking their path."
    },
    {
      "id": "lamashtu",
      "name": "Lamashtu",
      "description": "A horrific hippopotamus-demoness that prowls the edges of settlements to steal children, trapping them in her swollen belly. She is feared for her agonizing cries, yet she flees from the image of the Pazuzu.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "lamashtu",
        "elemental"
      ],
      "tokenIcon": "Bestiary/lamashtu",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 18,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 12,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Claw-Rake",
          "description": "+6 to hit, 2d6+4 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Lamashtu is a malevolent manifestation born from the dark, distorted myths of Mesopotamian and Egyptian folklore. It combines Lamashtu, the baby-snatching demoness who caused miscarriages and infant deaths, with Taweret, the fierce hippopotamus-goddess of childbirth who served as a protective but terrifying maternal force. The resulting aberration is a tragic, twisted predator that hunts the young of Sundale.",
      "nature": "Towering nine feet tall, this creature has the swollen, pregnant torso of a hippopotamus-woman, the powerful paws of a lioness, and the skull-like head of a donkey, with a ridge of crocodile-hide running down its spine. Its heavy, pendulous breasts leak molten copper that burns and pocks the basalt floor as it walks, and it clutches a rusted bronze comb and a clay whistle in its claws. Its distended belly is in constant, disturbing motion, and from within, the muffled screams of its victims can be heard. Its face is a bare donkey-skull with glowing, lamp-like eyes that weep liquid fire, containing a secondary human mouth inside its jaw that constantly speaks in a weeping, apologetic woman's voice.",
      "habitat": "The Lamashtu haunts the fringes of Solvarn settlements, volcanic ruins, and the ash-choked borderlands of the Sundale region. It moves under the cover of night, drawn by the sounds of domestic life.",
      "depth": "Driven by a twisted maternal instinct, the Lamashtu steals infants from their cradles and absorbs them into its hollow, swollen belly, where the children are kept alive in eternal, screaming torment. The only protection against this terror is the image of Pazuzu, which the demoness fears above all else; consequently, the Pazuzu is her natural enemy. Thrask parents carefully camp in the neutral zones between the territories of these two beasts, using the presence of the Pazuzu as a shield while hiring brave adventurers to hunt down local Lamashtus and free the trapped children before they are lost forever."
    },
    {
      "id": "bes",
      "name": "Bes",
      "description": "A stout, clay-and-basalt homunculus with a roaring lion's face, created by Emberth smiths to guard nurseries. It wards off evil through mock grimaces, loud tambourines, and protective lapis-lazuli sigils.",
      "type": CREATURE_TYPES.HUMANOID,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "bes",
        "humanoid"
      ],
      "tokenIcon": "Bestiary/bes",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 14,
        "constitution": 14,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 10,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Khopesh-Slash",
          "description": "+5 to hit, 1d8+3 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Crafted by the skilled hands of Emberth artisans, the Bes is a protective homunculus inspired by ancient protective spirits. Its form draws from Bes, the Egyptian dwarf-god of households who warded off evil with knives and music, and Ugallu, the Mesopotamian lion-headed 'Big Weather-Beast' who championed cosmic order. Together, these legends are fused into a loyal clay defender of the home.",
      "nature": "Standing only four feet tall, the Bes is a squat, muscular construct made of fired terracotta clay reinforced with basalt fibers. It wears a stylized crown of tall ostrich feathers and brandishes a curved khopesh-sword in one hand and a small bronze tambourine in the other. Its clay skin is painted with intricate sigils of blue lapis-lazuli that glow with a brilliant light when danger is near. Its face is a wide, comical lion's head with crossed eyes and a protruding tongue, designed to startle and amuse in equal measure.",
      "habitat": "These homunculi are stationed inside the stone hearths, door-lintels, and residential nurseries of Emberth strongholds and fortified outposts within Sundale. They remain motionless until activated.",
      "depth": "Bess serve as the ultimate line of defense for Emberth families, springing to life at the first sign of Wyrd-corruption or malevolent spirits. When activated, they create a chaotic din, beating their tambourines and swinging their khopesh swords, using their bizarre grimaces and laughter-inducing appearance to break hostile enchantments. If a nursery is breached, a Bes will fight until it is completely shattered, scattering protective, sigil-carved clay shards that ward the room against corruption. The Thrask and Korr Emberth hold these shattered fragments in high honor, often hiring adventurers to retrieve rare lapis-lazuli or basalt fibers to construct new guardians for their growing settlements."
    },
    {
      "id": "ifrit",
      "name": "Ifrit",
      "description": "A towering giant of white-hot coal and shifting flame, crowned with a cobra-like hood of fire. It works alongside Emberth smiths to shape molten stone, igniting intruders with a single, burning glare.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "ifrit",
        "elemental"
      ],
      "tokenIcon": "Bestiary/ifrit",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 420,
        "currentHp": 420,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ifrit is a majestic and terrifying elemental spirit born from the deep furnace of the world. Its origins are tied to the Ifrit of Mesopotamian and Islamic folklore—powerful jinn of smokeless fire who built underground cities—and Wadjet, the Egyptian cobra-goddess whose fiery eye could incinerate the enemies of cosmic order. In the volcanic heart of Emberspire, they are revered as living extensions of the sun's primordial will.",
      "nature": "Standing ten feet tall, the Ifrit is a winged giant composed entirely of white-hot charcoal and crackling, shifting flames. Its body is unstable, constantly shedding embers and pieces of blackened carbon to reveal the liquid, molten fire burning within. Its wings are fans of superheated, rippling air that distort the surrounding light, and its head is crowned by a wide, cobra-shaped hood of flame that flares outward in anger. Its face is a mask of hardened charcoal with shifting, serpentine features, dominated by two blinding white points of light that represent the destructive eye of Wadjet.",
      "habitat": "These fiery elementals live in the deepest volcanic chambers, active magma vents, and sacred smithies of the Emberspire terrain. They are rarely seen outside these superheated zones.",
      "depth": "The Ifrits are powerful allies to the Korr Emberth, using their bare hands to shape molten rock into forge-components that no mortal tools could hope to replicate. They guard their smithies with absolute ferocity, using a deadly gaze that can instantly ignite any flammable object within fifty paces. Thrask rangers learn to identify their territories by the wide rings of scorched, vitrified earth that surround their volcanic nests, and they often advise adventurers to tread carefully when seeking these elementals, whether to petition them for forge-work or to harvest their white-hot coal cores for legendary weapons."
    },
    {
      "id": "ghul",
      "name": "Ghul",
      "description": "A mysterious, conical figure of compacted ash and bone, sporting two glowing green eyes. It haunts volcanic ruins, draining the heat-memory from the stone and smiting intruders with invisible fire.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "ghul",
        "undead"
      ],
      "tokenIcon": "Bestiary/ghul",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ghul is a sinister spirit of the volcanic wastes, drawing its mythic origins from the ghuls of Mesopotamian folklore—undead shape-shifters that consumed the dead in ruined places—and Medjed, the mysterious, sheeted deity of the Egyptian Book of the Dead who smote enemies with unseen fire. Fused together by the static of the Wyrd, the Ghul acts as a silent, invisible sentinel of the dead.",
      "nature": "This creature appears as a four-foot-tall, conical cylinder of grey ash-dust fabric that resembles a shroud, with only two glowing, round green eyes visible beneath the hem. The fabric of the shroud is composed of compacted ash and pulverized bone held together by static electricity, and it leaves scorched footprints wherever its stubby feet step. It has no discernible face, but when it attacks, the ash-fabric splits vertically from top to bottom, revealing a roaring, white-hot furnace of fire within its hollow body.",
      "habitat": "Ghuls make their homes in the ash-choked tombs, ancient graveyards, and crumbling volcanic ruins that litter the outskirts of Emberspire and Sundale.",
      "depth": "Rather than feeding on flesh, Ghuls consume the residual warmth trapped within ancient structures, draining the thermal memory of long-lost civilizations until the stones are ice-cold to the touch. They possess the ability to turn completely invisible, leaving only the faint scent of burnt bone as a warning, and they launch devastating bolts of fire at intruders while hidden. To defeat them, adventurers must look for the single feature they cannot hide—their glowing, pale green eyes—making them a dangerous threat to those exploring the ruins, though their ash-dust shrouds are highly prized by alchemists for their fire-binding properties."
    },
    {
      "id": "gugalanna",
      "name": "Gugalanna",
      "description": "A colossal bull of cooling magma and obsidian, bearing a sacred white triangle on its forehead. It carves safe paths through the lava fields of the Shyr, its tongue concealing a scarab-mark that can purify poisoned waters.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundale",
        "gugalanna",
        "beast"
      ],
      "tokenIcon": "Bestiary/gugalanna",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 18,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 180,
        "currentHp": 180,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Gugalanna is a sacred beast of titanic proportions, reflecting the mythic union of Mesopotamian and Egyptian bull deities. It is named after the Gugalanna, the Sumerian Bull of Heaven whose breath dried rivers and cracked the earth, and Apis, the sacred Egyptian bull of Memphis who was worshipped as a living incarnation of Ptah. In the ash-deserts of Sundale, it represents both a destructive force of nature and a divine source of purification.",
      "nature": "Standing seven feet tall at the shoulder, the Gugalanna is a massive bull made of cooling magma, its dark, rocky crust cracking with every step to reveal the bright, molten orange beneath. Its horns curve forward like a pharaoh's crown, their tips glowing with white-hot heat, and its tail is a whipping cord of molten metal. A distinct, white triangle of cooled stone is visible on its forehead, and beneath its tongue sits a polished, scarab-shaped growth of black obsidian.",
      "habitat": "This volcanic bull roams the Shyr, the ninety-mile basalt scar of Sundale, and the jagged, shifting lava-fields surrounding Emberspire. It travels constantly, never staying in one place for long.",
      "depth": "The Gugalanna charges across the volcanic wasteland, its heavy hooves fracturing the cooling lava-roads and mapping out the safest paths through the shifting terrain. Thrask rangers track these herds to find stable passage through the lava-fields, utilizing the bull's instincts to survive. The obsidian scarab beneath the Gugalanna's tongue is highly sought after by alchemists and the Unwoven because it can instantly purify an entire cistern of Wyrd-tainted water, though the Korr Emberth view the slaughter of these bulls as a terrible sacrilege. Adventurers are often caught in the middle of these conflicting factions, hired either to protect the bulls or to harvest a scarab-mark to save a poisoned settlement."
    },
    {
      "id": "peri",
      "name": "Peri",
      "description": "A beautiful, hand-sized moth with opalescent wings and a golden, sun-like body. It rolls its wings into balls to compress thermal energy, creating eternal embers used by the Emberth.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "peri",
        "fey"
      ],
      "tokenIcon": "Bestiary/peri",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 2,
        "agility": 16,
        "constitution": 8,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 10,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 50,
        "radiant": 100
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Proboscis-Touch",
          "description": "+3 to hit, 1d4 radiant — heals 1d4 instead if target is allied",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Peri is a delicate spirit of light and renewal, drawing its essence from Persian and Egyptian mythologies. It is inspired by the Peri, the beautiful, winged fallen angels of Zoroastrian lore who seek repentance, and Khepri, the scarab-god of the rising sun who rolls the sun across the sky. In the volcanic gloom of Sundale, these moths are viewed as fragments of the sun-god Sol's own consciousness, striving to bring warmth back to the world.",
      "nature": "No larger than a human hand, the Peri is a creature of striking beauty, its opalescent wings shimmering with shifting, oil-like colors. Its body glows with the warm, golden light of a miniature sun, and its antennae are curved like the horns of a scarab beetle. The edges of its wings are inscribed with tiny Zoroastrian prayers written in glittering gold-dust, and when it rests, it curls its wings into a tight, glowing sphere. Its delicate face features two large, faceted eyes that reflect the observer's face as a youthful, idealized vision, and its mouth is a glass-like proboscis.",
      "habitat": "These radiant moths congregate in glowing clouds around the Solbrand and within the warm, protected chambers of Emberspire's temples.",
      "depth": "Peris are drawn to sources of intense heat, particularly the sacred bowl of the Solbrand, where they are carefully tended by the Sun-Speakers of the Korr. Imitating the scarab Khepri, the moths roll their wing-balls along the ground at sunrise, absorbing the ambient heat and compressing it into small, golden pearls known as sun-seeds. These pearls are highly valued by the Emberth, who plant them in cold hearthstones to generate a steady, smokeless flame that burns for an entire year. Adventurers are often hired to protect these delicate creatures from predators or to collect wild sun-seeds from the volcanic valleys."
    },
    {
      "id": "daeva",
      "name": "Daeva",
      "description": "A shadow-born jackal with a curved snout and inverted eyes, representing the dark lies of Angra Mainyu. It feeds on spoken truth and accelerates the corruption of the Wyrd wherever it nests.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "daeva",
        "elemental"
      ],
      "tokenIcon": "Bestiary/daeva",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 14,
        "agility": 18,
        "constitution": 14,
        "intelligence": 14,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 75,
        "cold": 50,
        "fire": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Chaos-Bite",
          "description": "+6 to hit, 2d6+4 necrotic",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Daeva is a malevolent entity born from the absolute negation of light and truth. Its lineage is tied to the Daevas of Zoroastrian mythology, the false gods of chaos and destruction who serve Angra Mainyu, and the Set Animal of Egypt, the mysterious beast representing chaos, discord, and the foreign desert. It exists as a living lie, manifesting in Sundale to corrupt the land.",
      "nature": "The Daeva has the lean, jackal-like body of a hunting canine, but its form is constructed of three-dimensional shadow that absorbs all light. Where light hits its body, it simply vanishes, leaving a silhouette with physical mass. Its tail is forked into two wispy tendrils of darkness, and its long, curved snout resembles a scimitar. Its face is dominated by inverted eyes—solid black whites and pupil-less, blinding white pupils—and a permanent, malicious grin that reveals rows of teeth shaped like tiny skulls.",
      "habitat": "These shadow beasts lurk in the dark volcanic caves, ruined temples, and ash-choked canyons of Sundale and the Emberspire region.",
      "depth": "The Daeva feeds upon spoken truth; every honest word spoken in its vicinity drains the speaker's vitality while strengthening the shade's physical form. Because the Korr Emberth practice the Vault-Breath—a discipline of sacred silence—the Daevas are starved near the temples but grow bloated and aggressive around the busy marketplaces. Their presence acts as a beacon for the Wyrd, tearing open reality-breaches and accelerating corruption, which prompts the Thrask rangers to hunt them down relentlessly. Adventurers are frequently employed to locate and destroy these beasts before their nests can trigger a catastrophic breach."
    },
    {
      "id": "simurgh",
      "name": "Simurgh",
      "description": "A colossal, wise hybrid of eagle and lion with ash-grey feathers and copper-wire mane. It nests on the rim of Emberspire, using its healing feathers to close wounds and its presence to calm the volcano.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "simurgh",
        "elemental"
      ],
      "tokenIcon": "Bestiary/simurgh",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 18,
        "intelligence": 16,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 405,
        "currentHp": 405,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Talon-Strike",
          "description": "+7 to hit, 2d8+5 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Simurgh is an ancient and benevolent protector, drawing its heritage from Persian and Egyptian mythic guardians. It represents the Simurgh, the legendary bird of wisdom that witnessed the destruction of three worlds and possessed infinite healing knowledge, and the Akhekhu, the Egyptian underworld griffon that guarded hidden thresholds. It stands as a sapient witness to the world before the Dimming, carrying the memory of lost ages.",
      "nature": "With a massive fifty-foot wingspan, the Simurgh combines the powerful body and hind-legs of a lion with the head, wings, and fore-talons of an eagle. Its plumage is a soft, volcanic ash-grey, with each feather bordered by a faint, glowing blue line. Its mane is made of fine copper-colored feathers that chime like bells in the wind, and the underside of its wings is inscribed with golden Zoroastrian fire-prayers that glow when it performs acts of healing. Its face is that of a noble eagle, with warm, bronze-colored beak and eyes containing concentric rings of gold, orange, and amber.",
      "habitat": "These giant griffons nest exclusively on the high, smoking rim of the Emberspire caldera, building massive structures out of woven ash and volcanic glass.",
      "depth": "The Simurgh is a sapient creature of immense wisdom, occasionally sharing ancient secrets of the pre-sundered world with those it deems worthy. Its feathers possess unparalleled healing properties, capable of sealing deep wounds and mending bones within hours of contact. Furthermore, the presence of these birds helps stabilize geothermal activity, reducing eruptions near their nesting sites. Because of this, Emberth law decrees that harming a Simurgh is a capital offense punishable by live immolation, and adventurers are often sent to the caldera rim to seek their counsel or plead for a single feather to save a dying leader."
    },
    {
      "id": "azi",
      "name": "Azi",
      "description": "A massive, three-headed crocodile of green-black obsidian that rules the lava rivers of Sundale. Each of its heads produces a distinct, lethal venom of fire, acid, or paralysis.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "azi",
        "elemental"
      ],
      "tokenIcon": "Bestiary/azi",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 20,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 6,
        "maxHp": 475,
        "currentHp": 475,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 75,
        "lightning": 50,
        "acid": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Tail-Whip",
          "description": "reach 15 ft, 2d6+4 bludgeoning + DC 15 AGI or knocked prone",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Azi is a terrifying apex predator of the lava streams, representing the destructive aspects of storm and river. It draws its origins from Azi Dahaka, the three-headed dragon-demon of Persian myth who was imprisoned beneath Mount Damavand, and Sobek, the Egyptian crocodile-god of the Nile who commanded both fertility and raw military might. It is the ultimate embodiment of volcanic terror in Sundale.",
      "nature": "Measuring twenty feet in length, the Azi is a colossal crocodile whose body is armored in thick, green-black obsidian scales that overlap like chainmail. Three distinct heads emerge from its single neck, and its tail is flattened and lined with razor-sharp obsidian blades. Liquid lava constantly drips from its teeth, and its belly scales glow with intense geothermal heat. Each of its three heads has a different eye color—red on the left, blue in the center, and green on the right—representing the unique elements they control.",
      "habitat": "These multi-headed beasts inhabit the deep, slow-moving lava channels and molten rivers that flow throughout Sundale and the Emberspire terrain.",
      "depth": "The Azi is the undisputed king of the lava rivers, hunting by submerging in the molten stone and launching surprise attacks with all three heads. Each head produces a different lethal substance—the left head spews fire that melts armor, the middle spits acid that dissolves flesh, and the right secretes a paralytic poison that freezes the nervous system. The scales of the beast are impervious to normal weapons, making them nearly impossible to kill, though alchemists will pay small fortunes to adventurers who manage to harvest the rare venoms from a specimen."
    },
    {
      "id": "edimmu",
      "name": "Edimmu",
      "description": "A wavering, translucent afterimage of a deceased soul that bonds to travelers, draining their energy. It causes nightmares and eventual combustion unless pacified with funerary offerings.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "edimmu",
        "undead"
      ],
      "tokenIcon": "Bestiary/edimmu",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 6,
        "agility": 14,
        "constitution": 10,
        "intelligence": 6,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50,
        "fire": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Edimmu is a tragic and vengeful phantom born from improper burials and sudden deaths. It is inspired by the Edimmu of Mesopotamian myth, the wind-borne ghosts of those who died violently and haunted the living with illness, and the Ka of Egyptian belief, the spiritual double of a person that required food and drink to remain at peace. It remains anchored to the mortal realm, seeking the offerings it was denied.",
      "nature": "Appearing as a translucent, featureless humanoid shape, the Edimmu resembles a heat-mirage that flickers in and out of the corner of the eye. It smells faintly of sulfur and dust, and the air around it shimmers with heat. In the volcanic glare of Sundale, it casts a shadow that does not match its visible form, and its featureless face occasionally flashes the screaming, burning visage of its former living self.",
      "habitat": "These phantoms haunt the ancient volcanic forges, abandoned mines, and ash-strewn ruins where people have met violent ends in Sundale and Emberspire.",
      "depth": "The Edimmu attaches itself to unsuspecting travelers who cross its death-site, slowly draining their life force to sustain its own presence. The victim suffers from terrible nightmares of fire and progressive fatigue, eventually culminating in spontaneous combustion. To prevent this, Emberth law dictates that any worker who dies in the forges must be buried with a burned piece of forge-equipment as an offering, which pacifies the spirit. Adventurers are often hired to lay these spirits to rest by delivering the proper items to their final resting places."
    },
    {
      "id": "asag",
      "name": "Asag",
      "description": "A massive, eight-foot boulder of living pumice and obsidian that continuously weeps lava. Its intense heat boils nearby water sources, and it communicates through seismic tremors.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "asag",
        "construct"
      ],
      "tokenIcon": "Bestiary/asag",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 8,
        "constitution": 22,
        "intelligence": 6,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 75,
        "piercing": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Obsidian-Fist",
          "description": "+6 to hit, 2d8+5 bludgeoning + 1d6 fire",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Asag is a massive elemental construct that embodies the boiling power of the earth. Its mythic roots lie in the Sumerian demon Asag, whose hideousness was so great that it boiled fish alive in rivers, and Geb, the Egyptian earth-god whose laughter shook the world. It is the living representation of Sundale's geological instability.",
      "nature": "Standing eight feet tall, the Asag is a hunched, humanoid mass of living volcanic rock composed of jagged obsidian and porous pumice. It constantly weeps molten lava from its joints and supports a tiny ecosystem of extremophile lichens in its stone crevices. Its face is a crude, geometric pattern of vents that glow with magma for eyes and a jagged crack that releases superheated gas for a mouth, changing expressions with geological slowness.",
      "habitat": "These stone behemoths are found in the active volcanic vents, geothermal valleys, and unstable rock formations of Sundale and Emberspire.",
      "depth": "The Asag radiates such extreme heat that any water source within thirty feet of it begins to boil, turning peaceful streams into scalding geysers. When threatened or agitated, the creature vibrates its massive body to generate localized earthquakes, communicating through these ground-shaking tremors. Emberth geologists have decoded parts of this seismic language, finding that rhythmic tremors indicate peace while sharp quakes signal aggression, and they often hire adventurers to redirect or soothe these giants when they wander too close to vital settlements."
    },
    {
      "id": "nisroch",
      "name": "Nisroch",
      "description": "A noble, golden-bronze falcon with one human-like eye and one glowing Wedjat eye. It patrols the skies above Emberspire, using beams of light to destroy Wyrd-essence.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "nisroch",
        "elemental"
      ],
      "tokenIcon": "Bestiary/nisroch",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 20,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 5,
        "speed": 10,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 50,
        "radiant": 100
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nisroch is a divine protector of the sky, combining agricultural abundance with protective kingship. Its heritage traces to Nisroch, the Mesopotamian eagle-headed deity associated with the sacred tree of life, and Horus, the Egyptian falcon-god whose all-seeing eye represented cosmic order and healing. It serves as the primary aerial defense against the encroaching darkness.",
      "nature": "The Nisroch is a large bird of prey with feathers of golden-bronze that resemble polished sun-metal, and a sharply hooked beak of bronze. Its right eye is that of a normal, sharp-sighted falcon, while its left eye is the glowing, blue-lit Wedjat—the Eye of Horus. It wears a small crown of lapis-lazuli beads on its head, and its gaze carries an unmistakable air of human-like intelligence and authority.",
      "habitat": "These sacred falcons patrol the high atmosphere and volcanic crags above the Emberspire caldera and the surrounding reaches of Sundale.",
      "depth": "Nisrochs scan the volcanic wastes for signs of Wyrd-corruption, using their Wedjat eyes to fire concentrated beams of light that burn away raw Wyrd-essence. They also serve as vital messengers between the Korr Sun-Speakers and the Thrask rangers, carrying gold-foil messages that only their divine eyes can read. Because of their sacred status, killing a Nisroch is a capital offense under Emberth law, and adventurers are often tasked with protecting their nests or rescuing injured falcons from the wild."
    },
    {
      "id": "abzu",
      "name": "Abzu",
      "description": "A sentient, circular pool of glowing water that contains ancient cuneiform and hieroglyphic glyphs. It acts as a cooling system for the volcanic vaults, trading forgotten secrets for blood.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "abzu",
        "elemental"
      ],
      "tokenIcon": "Bestiary/abzu",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 4,
        "agility": 10,
        "constitution": 20,
        "intelligence": 20,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 80,
        "currentMana": 80,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 0,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 100,
        "fire": 100,
        "poison": 100
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Abzu is a mysterious anomaly of freshwater and ancient magic, combining the primal water myths of Mesopotamia and Egypt. It represents the Abzu, the Sumerian underground freshwater ocean that was the source of all magic, and Nun, the Egyptian personification of the primordial waters of creation. It exists as a pocket of ancient, wise water in the middle of a dry desert.",
      "nature": "The Abzu has no physical, solid form; it is a perfectly circular pool of clear water, fifteen feet wide, that glows with a soft, bioluminescent blue-white light. Inside the water, ancient cuneiform and hieroglyphic glyphs swim like fish, holding the secrets of the past. When it wishes to speak, it shapes a serene, water-formed face on its surface, featuring eyes of vertigo-inducing depth.",
      "habitat": "This sentient pool is located within the deep, cavernous chambers and cooling tunnels beneath the Harath-Vault in the Emberspire region.",
      "depth": "The Abzu serves as a crucial repository of pre-Dimming knowledge, offering travelers forgotten secrets in exchange for a drop of their blood, which is added to its liquid archives. It also plays a vital physical role by cooling the geothermal channels beneath the Harath-Vault, preventing the volcanic forges from overheating. Korr engineers maintain these channels with religious devotion, and adventurers are sometimes sent to protect the pool's source or retrieve rare tablets to feed its thirst for knowledge."
    },
    {
      "id": "kur_pit",
      "name": "Kur-Pit",
      "description": "A circular, bottomless fissure covered in glowing red runes that murmurs with the voices of the dead. It is a portal to the underworld, briefly illuminated by the Solbrand during the annual vent-calm.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundale",
        "kur_pit",
        "fey"
      ],
      "tokenIcon": "Bestiary/kur_pit",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 0,
        "agility": 0,
        "constitution": 0,
        "intelligence": 16,
        "spirit": 20,
        "charisma": 10,
        "maxHp": 760,
        "currentHp": 760,
        "maxMana": 100,
        "currentMana": 100,
        "maxActionPoints": 0,
        "currentActionPoints": 0,
        "initiative": 0,
        "speed": 0,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "all": 100
      },
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kur-Pit is a breach in reality where the realms of the dead bleed into the land of the living. Its name is derived from Kur, the Sumerian underworld of no return, and Duat, the Egyptian labyrinthine realm of trials through which the sun traveled each night. It represents a physical manifestation of the dark, subterranean afterlife.",
      "nature": "The Kur-Pit is a perfectly circular, ten-foot-wide abyss that opens in the earth, its smooth walls covered in spiraling hieroglyphic and cuneiform warnings that glow with a dull red light. A constant, echoing murmur of dead voices rises from its depths, and the air above it shimmers with both heat and cold. It has no physical face, but from certain angles, the opening resembles a screaming mouth, with the glyphs acting as lips and the bottomless black as its throat.",
      "habitat": "These abyssal openings appear without warning in the volcanic fields and historical battlefields of Sundale and the Emberspire terrain.",
      "depth": "Kur-Pits open spontaneously near areas of great tragedy, trapping the souls of those who fall within the labyrinth of the underworld. During the annual vent-calm of Emberspire, the light of the Solbrand shines down the pit, momentarily revealing the path to the buried sun-god Sol. Scholars believe that navigating this dangerous path may be the only way to free Sol, but since no one has ever returned from a Kur-Pit, the theory remains untested, and adventurers are warned to avoid these areas unless they possess the courage to brave the land of no return."
    },
    {
      "id": "mushussu",
      "name": "Mushussu",
      "description": "A dog-sized, pale serpent-dragon with lion paws and eagle talons. It imprints on friendly creatures, using its fertility-blessed breath to double crop yields in ash-choked soil.",
      "type": CREATURE_TYPES.DRAGON,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "sundale",
        "mushussu",
        "dragon"
      ],
      "tokenIcon": "Bestiary/mushussu",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 16,
        "constitution": 10,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 14,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Nub-Horn-Bonk",
          "description": "+3 to hit, 1d4 bludgeoning — it is a baby",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Mushussu is a rare and gentle juvenile beast representing new life and creation. Its mythic origins combine the Mushhushshu, the Babylonian dragon-serpent of the Ishtar Gate, and Heket, the Egyptian frog-goddess of fertility and childbirth who breathed life into newborns. In the harsh, barren landscape of Sundale, it is welcomed as a harbinger of hope and fertility.",
      "nature": "The size of a large dog, the Mushussu has the long, scaled body of a serpent-dragon, with pale, translucent white scales that reveal its veins beneath. It walks on stubby lion paws in the front and small, underdeveloped eagle talons in the back, and its tail ends in a soft, wobbly stinger. Its face is a cute, rounded version of the adult Sirrush, with a small nub for a horn and large, curious gold eyes, and it communicates through soft, frog-like croaks.",
      "habitat": "These young dragons are found in the warm nesting grounds, rocky crevices, and agricultural borders of Sundale and Emberspire.",
      "depth": "Unlike their territorial parents, Mushussuren are highly affectionate and will imprint on the first friendly creature they meet, following them like a pet. They possess a magical breath that doubles the agricultural yield of any soil they visit, making them incredibly valuable to Thrask farmers who leave bowls of milk to attract them. The Korr tolerate their presence near settlements because the bond helps ensure that adult Sirrush will guard the villages, and adventurers are often hired to protect these juveniles or locate lost ones in the wild."
    },
    {
      "id": "mamiri",
      "name": "Mamiri",
      "description": "A creature of tragic and terrifying beauty, this sea-spirit lures sailors to their doom with an irresistible song.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "mamiri",
        "elemental"
      ],
      "tokenIcon": "Bestiary/mamiri",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 14,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 16,
        "charisma": 18,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "psychic": 25
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [
        {
          "name": "Kelp-Hair-Grasp",
          "description": "reach 10 ft, +5 to hit, 1d8+3 bludgeoning + DC 13 AGI or grappled",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The legend of the Mamiri echoes the ancient myths of Greece, where avian or piscine maidens sang from shores of bone to wreck passing vessels, blended with the West African Yoruba traditions of Mami Wata. In the freezing expanses of the Iceheart Sea, she manifests as a powerful, seductive water-spirit associated with immense wealth, fertility, and highly dangerous bargains. She demands absolute devotion from those who dare seek her favor, punishing any hint of betrayal with watery graves.",
      "nature": "Standing upon the jagged, frozen reefs, she appears from the waist up as a heartbreakingly beautiful woman with skin the deep indigo of abyssal waters and eyes the warm, horizontal-pupiled green of shallow sea-shallows. Instead of a fish's tail, her lower half dissolves into a churning column of sea-foam and dark kelp, which reaches out like grasping hands toward the shore. She wears a crown of sharp coral and cowrie shells, and around her neck hangs a jangling collar of gold coins harvested from the pockets of drowned sailors. Her long, black hair moves of its own accord, swaying through the spray as she sings with full lips that never cease their deadly, hypnotic melody.",
      "habitat": "These creatures reside in the freezing, iceberg-strewn waters of the Iceheart Sea, where they perch on semi-submerged rocks and jagged reef formations.",
      "depth": "She sits on freezing reefs and sings. She doesn't want gold; she demands 'warm memories.' To pass her reef safely, a player must let her touch their forehead and draw out one happy memory (e.g., their first kiss, a childhood birthday), which they then forget forever."
    },
    {
      "id": "charybdis",
      "name": "Charybdis",
      "description": "A terrifying vortex of dark water and spotted scales, this living whirlpool devours entire ships in narrow shipping lanes.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "charybdis",
        "elemental"
      ],
      "tokenIcon": "Bestiary/charybdis",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 20,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 505,
        "currentHp": 505,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 0,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "lightning": 25
      },
      "abilities": [
        {
          "name": "Lamprey-Throat",
          "description": "+7 to hit, 2d10+5 piercing + DC 15 STR or swallowed; swallowed targets take 4d6 acid per round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d10+5"
            },
            {
              "type": "SAVE",
              "attribute": "strength",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Charybdis is born of the Greek myth of the primordial whirlpool monster Charybdis, who swallowed the seas three times a day to drag ships to the deep, merged with the West African Congo legend of the Dingonek, a scaly, leopard-spotted water-beast. In the Iceheart Sea, she is a colossal, elemental force of destruction, a natural counterpart to other coastal terrors.",
      "nature": "This creature presents as a rotating mass of dark water and fragmented ice forty feet wide, hiding the shifting, massive form of a leopard-spotted serpentine body that is never visible as a whole. Shield-sized spotted scales flash momentarily at the vortex's edge before being dragged back down into the depths. The water within the maw is hot and stinks of sulfur and rotting fish, roaring like thunder as it feeds. At the deepest point of the whirlpool lies a circular, terrifying mouth lined with rotating rings of serrated, spotted scales like a lamprey's throat scaled to architectural proportions.",
      "habitat": "This creature anchors itself in the narrow shipping channels and treacherous straits between the ice-fields of the Iceheart Sea.",
      "depth": "A massive circular maw that swallows entire ships. Its gullet is a treasure trove of shipwrecked gold and ancient weapons. Players can cast a rope into its mouth to fish for loot, but if they pull too hard, they might be dragged in."
    },
    {
      "id": "ketos",
      "name": "Ketos",
      "description": "A primordial sea-monster of colossal scale, this tusked serpent guards the deepest rifts of the ocean floor.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "ketos",
        "beast"
      ],
      "tokenIcon": "Bestiary/ketos",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 24,
        "agility": 8,
        "constitution": 22,
        "intelligence": 18,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 700,
        "currentHp": 700,
        "maxMana": 80,
        "currentMana": 80,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 75,
        "psychic": 25
      },
      "vulnerabilities": {
        "psychic": 25
      },
      "abilities": [
        {
          "name": "Elephant-Tusk-Ram",
          "description": "reach 20 ft, +8 to hit, 3d8+6 bludgeoning; ships struck take structural damage equal to half the damage",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+6"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ketos draws its mythic lineage from the Greek Cetus, the colossal sea-monster sent to ravage Troy and slain by Heracles, combined with the South African legend of the Grootslang, a mistake of the gods that possessed the intellect of an elephant and the body of a serpent. In the setting, it exists as a titanic relic of creation that inhabits the darkest trenches.",
      "nature": "Spanning over two hundred feet in length, this leviathan combines the serpentine body of an ancient sea-dragon with the massive, tusked head of an elephant. Overlapping, whale-grey plates cover its immense body, which is underscored by bioluminescent organs pulsing with a deep blue light. Two thirty-foot tusks of yellowed ivory curve from its upper jaw, framing rowboat-sized eyes that are milky with cataracts. Its massive jaw hinges like a serpent's, and its colossal face bears an expression of ancient, bored contemplation.",
      "habitat": "This leviathan dwells in the dark, pressurized depths of the Treakous Oceanic Rift, coiling near the fragments of the Sundered Monolith.",
      "depth": "So massive that its back gathers ice and soil, looking like a small harbor island. It only submerges if it hears a whale's song; bards can play a whale-song on a shell flute to soothe it back to sleep, allowing ships to escape its wake."
    },
    {
      "id": "harpy",
      "name": "Harpy",
      "description": "A storm-riding terror with iron hook-feet and vulture wings, this avian hag snatches sailors from the rigging.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "harpy",
        "elemental"
      ],
      "tokenIcon": "Bestiary/harpy",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 18,
        "constitution": 12,
        "intelligence": 8,
        "spirit": 14,
        "charisma": 6,
        "maxHp": 135,
        "currentHp": 135,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 15,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Feather-Slash",
          "description": "+5 to hit, 1d8+3 slashing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Harpy traces its folklore roots to the Greek Harpy, the wind-spirit of divine punishment that stole souls and food, and the Ashanti Asanbosam, a forest-canopy vampire with iron teeth and hooked feet. In the Iceheart Sea, these creatures act as agents of localized tempests and scavengers of the masts.",
      "nature": "Having the wings, talons, and feathered torso of an oil-dark vulture, this creature possesses the gaunt, gray-skinned chest and face of a hag. Its feet are not talons but curved iron hooks that resemble grappling irons, dripping with freezing sea-water. The creature smells strongly of rotting fish, and its waterlogged feathers make its flight noisy and labored. Its hollow-cheeked face is dominated by furious, lightning-colored eyes and a wide mouth filled with filed iron teeth.",
      "habitat": "These creatures nest in the eyes of perpetual cyclones and perch in the sails, rigging, and masts of ships sailing the Iceheart Sea.",
      "depth": "Harpys attack ships by perching in the rigging, dangling upside-down to snatch crew members from the decks with their iron hook-feet. Once they grip a mast, they cannot be dislodged without breaking the wood or killing the creature outright. Sailors fear them as death-omens, yet also use them as navigation aids since they always fly toward the calmest exit-corridors of cyclones. A recent squall has left a merchant fleet stranded, and the crew is hiring mercenaries to clear the harpies from their masts."
    },
    {
      "id": "hippocampus",
      "name": "Hippocampus",
      "description": "A noble creature combining horse and serpent, this gentle elemental purifies waters and serves as a swift steed.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "hippocampus",
        "elemental"
      ],
      "tokenIcon": "Bestiary/hippocampus",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 16,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100
      },
      "vulnerabilities": {
        "poison": 25
      },
      "abilities": [
        {
          "name": "Hoof-Fin-Steer",
          "description": "+4 to hit, 1d6+2 bludgeoning",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Hippocampus is inspired by the Greek sea-horse that drew Poseidon's chariot, combined with the West African Sawa tradition of the Jengu, a water-spirit associated with healing, prophecy, and coastal boundaries. In this setting, they serve as the loyal mounts of the Myrathil.",
      "nature": "Appearing from the chest up as a powerful horse with an arched neck, intelligent eyes, and a flowing mane of kelp, the creature's lower body transitions into a serpentine, fish-scaled tail that coils through the water. Its coat matches the blue-green of coastal waters, countershaded pale underneath. The kelp mane is bioluminescent, glowing green in the deep, while its hooves are modified into steering fins. Its noble face features liquid eyes that change from calm blue to storm green or moonlit silver.",
      "habitat": "These creatures reside in the brackish estuaries, coastal harbors, and shallow shoreline waters of the Iceheart Sea.",
      "depth": "Capable of outpacing storm-currents, Hippocampuss are tamed by Myrathil divers to patrol the harbors of Merrowport. Their presence naturally purifies Wyrd-taint from coastal waters, protecting nearby settlements from water-borne diseases and plagues. They are drawn to the boundaries where fresh rivers meet the sea. A local keeper has reported that a wild Hippocampus has been spotted nearby, and the local temple is looking for adventurers to help guide it safely to a contaminated estuary."
    },
    {
      "id": "gorgon",
      "name": "Gorgon",
      "description": "An abyssal humanoid whose gaze crystallizes blood into stone, this creature shifts into a bioluminescent eel to hunt.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "gorgon",
        "construct"
      ],
      "tokenIcon": "Bestiary/gorgon",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 18,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 25,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "This creature combines the Greek Gorgon, whose hair of snakes and terrible face turned onlookers to stone, with the West African Ewe myth of the Adze, a vampiric firefly-spirit that drinks blood and shifts between insect and humanoid forms. In the deep sea, she is a dread entity of the trenches.",
      "nature": "She appears as a serpentine humanoid woman with skin the deep violet of the abyss and a lower body composed of coiling sea-serpents. Her hair is a writhing mass of tiny, glowing, bioluminescent eels that pulse in hypnotic, rhythmic patterns. Translucent scales cover her torso, revealing dark veins. Her face is frozen in an expression of eternal rage, dominated by solid, glowing green eyes that cause the blood of onlookers to crystallize with calcium. She carries a mirror of polished abalone.",
      "habitat": "This creature makes its home in the dark, freezing waters of the abyssal trenches within the Iceheart Sea.",
      "depth": "The petrifying gaze of the Gorgon leaves living statues of terror on the sea-floor, which are often animated by the Wyrd to plague shipping lanes. She can compress her body into a single, tiny bioluminescent eel to slip through fishing-nets and drain the blood of captured catches. To prevent this, sailors must inspect their catch with silver mirrors, which expose her disguise. Adventurers are being recruited to venture into the abyss to recover a petrified crew and destroy the Gorgon nesting near the trench."
    },
    {
      "id": "tokoloshe",
      "name": "Tokoloshe",
      "description": "A small, mischievous water-sprite with the lower body of an octopus, this bilge-pest turns invisible by holding a pebble.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "iceheart",
        "tokoloshe",
        "elemental"
      ],
      "tokenIcon": "Bestiary/tokoloshe",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 18,
        "constitution": 10,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 45,
        "currentHp": 45,
        "maxMana": 15,
        "currentMana": 15,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 25,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Long-Arm-Grab",
          "description": "+4 to hit, 1d4 bludgeoning + item theft",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tokoloshe is born of the Zulu legend of the Tokoloshe, a hairy, mischievous sprite that becomes invisible by swallowing a pebble and attacks sleeping children, merged with the Greek Nereids, though this creature is far more troublesome than its nymph cousins. In the Iceheart, it is a persistent shipboard nuisance.",
      "nature": "Standing only two feet tall, this gremlin-like creature possesses a hairy, wizened humanoid upper body and the lower half of an octopus. Its mottled green-and-brown skin blends perfectly with kelp and wet rock. Its face is a grotesque goblin mask with an elongated snout, large ears, and an enormous mouth stretching from ear to ear. Bright, beady eyes gleam with malicious glee as it carries a smooth, black pebble in its cheek to remain completely invisible.",
      "habitat": "These pests infest the dark cargo holds, wet bilges, and coastal kelp forests of the Iceheart Sea.",
      "depth": "Infesting ship bilges, Tokoloshes tangle rigging and sabotage compasses, causing navigation checks to fail unless banished by a Myrathil shaman using salt-water barriers and copper bells. At night, they creep into cabins to sit on sleeping children's chests and whisper nightmares, slowly draining their spirit. Raising beds with bricks keeps them out of reach. Recently, a merchant captain has reported a severe bilge infestation, and is looking for adventurers to perform the banishment ritual."
    },
    {
      "id": "lamia",
      "name": "Lamia",
      "description": "A mourning reef-dweller with impossibly long arms, this creature sings to lure sailors into her coral-plated coils.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "lamia",
        "beast"
      ],
      "tokenIcon": "Bestiary/lamia",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 16,
        "maxHp": 170,
        "currentHp": 170,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Reef-Grasp",
          "description": "+6 to hit, 2d6+4 slashing + DC 14 AGI or grappled and pulled from deck",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Lamia is derived from the Greek myth of Lamia, a grieving queen turned serpent-woman who devoured children, and the Ashanti Sasabonsam, a canopy-dwelling monster with long arms and iron claws. In the Iceheart Sea, she is a tragic creature warped by the Wyrd.",
      "nature": "She has the upper body of a beautiful, pale, and mourning woman, emerging from a massive serpentine tail covered in razor-sharp coral. Her arms are abnormally long, stretching twelve feet and ending in iron-hard, six-fingered claws. Her skin is covered in sucker-scars, and she weeps constant tears of pearl that dissolve into the ocean. Her grieving face features full lips that hide three rows of needle-like predator teeth.",
      "habitat": "These creatures stalk the shallow reef-channels, rocky sandbars, and narrow harbors of the Iceheart Sea.",
      "depth": "Positioning herself in narrow channels, the Lamia uses her long arms to pluck sailors—especially the young—from low decks. She sings a mournful lullaby that mimics a grieving mother, drawing those who have lost children to lean over the rails. The Myrathil pity her as a victim of the Wyrd's cruelty, leaving offerings of coral to buy safe passage. A rumor of a Lamia blocking a vital trade route has prompted local authorities to seek adventurers to either appease or slay her."
    },
    {
      "id": "empusa",
      "name": "Empusa",
      "description": "A shape-shifting elemental with a brass prosthetic leg, this creature drains the life of watch-keepers during storms.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "empusa",
        "elemental"
      ],
      "tokenIcon": "Bestiary/empusa",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 16,
        "constitution": 12,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 18,
        "maxHp": 240,
        "currentHp": 240,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "lightning": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Hammer-Skull-Staff",
          "description": "+6 to hit, 2d6+3 bludgeoning + 1d6 lightning",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "This creature derives from the Greek Empusa, a shape-shifting daughter of Hecate with one brass leg who seduced and drained sleeping men, and the Xhosa Impundulu, a vampiric lightning bird associated with storms. In the setting, she represents a storm-born curse.",
      "nature": "She appears as a beautiful woman in storm-grey robes, walking with an asymmetric click-thud due to her right leg of polished brass and her left leg of donkey-fur ending in a split hoof. She carries a staff topped with the skull of a hammer-headed heron, and lightning crackles from her fingers. While her left profile is stunningly beautiful, her right profile is a bare bird-skull wreathed in static discharge, shifting instantly depending on her mood.",
      "habitat": "These entities wander the storm-swept decks, rocky coasts, and frozen floes of the Iceheart Sea.",
      "depth": "The Empusa targets lone watch-keepers on night shift, using static-laced seduction to drain their vitality until they are desiccated husks. She is immortal; when slain, her essence transfers to a new host—always a grieving mother who lost a child to the sea. The only way to stop her is to strike a bargain rather than kill her. A local outpost has reported the mysterious deaths of several watch-keepers, and is seeking adventurers to investigate the clicks and thuds heard in the wind."
    },
    {
      "id": "telkhine",
      "name": "Telkhine",
      "description": "A seal-headed blacksmith of walrus-like bulk, this elemental forges weapons from deep-sea ice that never melt.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "telkhine",
        "elemental"
      ],
      "tokenIcon": "Bestiary/telkhine",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 16,
        "intelligence": 14,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Whale-Bone-Hammer",
          "description": "+6 to hit, 2d6+4 bludgeoning + DC 13 STR or stunned 1 round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "strength",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Telkhine is inspired by the Greek Telkhines, dog-headed, flipper-handed metalworkers cast into the sea for destructive magic, and the Congo River cryptid Mok—l—-mb—mb—. In the Iceheart Sea, they are covetous artisans of the cold.",
      "nature": "Weighing as much as a walrus, this squat four-foot humanoid has the dense slate-grey fur and head of a seal, but the webbed, calloused hands of a blacksmith. It carries a forge-hammer of whale-bone and ice that emits sparks of frost when struck. Its face features a coarse beard of steel-wool wire, and its red, forge-lit eyes are always calculating the value of nearby metals. It speaks in deep, guttural barks.",
      "habitat": "These elemental smiths reside in submerged caverns, volcanic vents, and icy shores of the Iceheart Sea.",
      "depth": "The Telkhine is the only creature capable of crafting weapons from deep-sea ice that never melt, demanding copper and whale-bone rather than gold as payment. They are obsessed with collecting rare alloys, often overturning small boats not to eat the crew, but to strip the nails, rivets, and hinges from the wood. A merchant guild is currently recruiting adventurers to negotiate with a Telkhine for a shipment of ice-blades, warning them to secure all metal fittings on their vessel."
    },
    {
      "id": "stymphalian",
      "name": "Stymphalian",
      "description": "A swarm of metallic-feathered birds that rain razor-sharp bronze plumage like daggers upon vessels.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "stymphalian",
        "beast"
      ],
      "tokenIcon": "Bestiary/stymphalian",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 8,
        "agility": 18,
        "constitution": 10,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 6,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 10,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50
      },
      "vulnerabilities": {
        "thunder": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Stymphalian is based on the Greek Stymphalian birds with bronze feathers, driven away by Heracles with rattles, and the Central African Kongamato, a pterosaur-like boat-overturner. In the Iceheart, they are aerial pests of the shipping lanes.",
      "nature": "This flock consists of eagle-sized predatory birds with bodies covered in metallic, razor-edged feathers of bronze and copper. Their underbellies are reddish-leathery, and their long, sharp beaks are made of actual bronze. Their pterosaur-like heads feature compound eyes that reflect light like hammered copper, maintaining a completely expressionless, hungry gaze.",
      "habitat": "These birds nest on the high rocky crags, frozen cliffs, and open skies above the Iceheart Sea.",
      "depth": "The flock attacks by flying in tight formations and shedding their metallic, barbed feathers like a rain of daggers capable of piercing armor. They overturn small boats to drive crew members into the water, allowing them to easily scoop up the fish that rise to the surface. Neth ships carry bronze rattles to simulate Heracles' ancient method of driving them off. A flock has recently nested near a vital strait, and local sailors are seeking adventurers equipped with loud instruments to clear the passage."
    },
    {
      "id": "nereid",
      "name": "Nereid",
      "description": "A benevolent spirit of compressed water and light, this fey rescues drowning sailors in the dark depths.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "nereid",
        "fey"
      ],
      "tokenIcon": "Bestiary/nereid",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 16,
        "charisma": 18,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 20,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "psychic": 50
      },
      "vulnerabilities": {
        "necrotic": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nereid is drawn from the Greek Nereids, benevolent sea-nymphs who aided sailors in distress, and Olokun—s Attendants in Yoruba mythology, who guard the treasures of the deep ocean. In the Iceheart, they are the rare saviors of the freezing waters.",
      "nature": "She appears as a luminous, translucent woman of serene, ageless beauty, composed of compressed water and light that glows blue-green. She rides a massive dolphin of the same luminous material, and a crown of phosphorescent pearls floats above her head. Her skin ripples with tidal patterns, and her large, glowing eyes contain the entire spectrum of ocean colors.",
      "habitat": "These spirits dwell in the deepest, darkest waters, abyssal rifts, and shipwrecks of the Iceheart Sea.",
      "depth": "The Nereid rescues drowning sailors, carrying them to the surface at the cost of her own energy, which forces her to rest for years afterward. She guards the abyssal debris-fields of sunken ships, and while the Deep-Born Myrathil treat her as sacred, she will withdraw the breath of the sea from any who disrespect her boundaries. Recently, a famous explorer's ship sank in her territory, and the family is seeking adventurers to politely request her aid in salvaging the ship's logbook."
    },
    {
      "id": "graeae",
      "name": "Graeae",
      "description": "Three ancient crones sharing a single obsidian eye, these sisters offer true prophecies in exchange for a tooth.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "iceheart",
        "graeae",
        "beast"
      ],
      "tokenIcon": "Bestiary/graeae",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 6,
        "agility": 10,
        "constitution": 12,
        "intelligence": 18,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 25,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Graeae originates from the Greek Graeae or Grey Sisters, who shared a single eye and tooth, and the Yoruba If— divination system read by Babalawos. In the Iceheart Sea, they are keepers of fate and cosmological patterns.",
      "nature": "These three frost-covered, ancient crones huddle together in tattered, ink-stained robes, passing a polished obsidian sphere between them. The crone holding the eye has a living, youth-shifting face, while the other two have empty, frozen sockets that weep frost. They carry divining chains made of copper and bone, and their forms shift to reflect the timelines they view.",
      "habitat": "These ancient sisters sit on the most remote and desolate icebergs in the far reaches of the Iceheart Sea.",
      "depth": "The sisters offer to answer questions about the future by casting seal-bones on the ice to read If— patterns. However, they demand a tooth from the questioner as payment; those who refuse are given a false prophecy that leads to their destruction. Neth merchants often seek them out to predict market trends, paying in valuable whale-teeth. A lost captain has reported seeing their iceberg, and scholars are looking for adventurers to consult the oracle about a looming storm."
    },
    {
      "id": "triton",
      "name": "Triton",
      "description": "A sovereign merman with a prehensile tentacle mane, this elemental controls the waves with a vibrating conch.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "triton",
        "elemental"
      ],
      "tokenIcon": "Bestiary/triton",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 16,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 270,
        "currentHp": 270,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "lightning": 50
      },
      "vulnerabilities": {
        "poison": 25
      },
      "abilities": [
        {
          "name": "Trident-Strike",
          "description": "+7 to hit, 2d8+5 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Triton draws from the Greek Triton, son of Poseidon who blew a conch to calm or raise the waves, and Olokun, the Yoruba deity of the deepest ocean. In this setting, he acts as a cosmic peacekeeper and ruler of the tides.",
      "nature": "A powerful merman with a muscular upper body and a coiled, deep-blue scaled tail, he carries a massive conch shell carved with geometric patterns that pulse with light. His skin is oceanic blue, and his hair consists of prehensile, bioluminescent tentacles. His angular face features horizontal, goat-like pupils that glow with deep indigo, carrying an expression of absolute sovereign authority.",
      "habitat": "These sovereigns patrol the open waters, tidal reefs, and deep trenches of the Iceheart Sea.",
      "depth": "The Triton's horn-call can alter the waves for a mile, which he uses to clear storm-swept shipping lanes in exchange for amber and copper offerings. He serves as a mediator between surface-dwellers and abyssal leviathans, using his horn to dampen the Sundered Monolith's resonance and prevent stampedes. The Deep-Born Myrathil revere him as the voice of Olokun. A trade guild is looking for adventurers to deliver a tribute of rare copper to his reef to secure safe passage for their fleet."
    },
    {
      "id": "nandi",
      "name": "Nandi",
      "description": "A ferocious, hyena-like sea-beast that hunts on ice-floes and crushes the skulls of its prey.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "iceheart",
        "nandi",
        "beast"
      ],
      "tokenIcon": "Bestiary/nandi",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 18,
        "intelligence": 6,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 275,
        "currentHp": 275,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Skull-Crush",
          "description": "+6 to hit, 2d8+5 bludgeoning + target DC 15 CON or stunned 1 round; specifically targets the head",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nandi is based on the East African Nandi Bear, a shaggy, brain-eating cryptid, and the Greek Ketos or sea-beast category of unnamed coast-terrorizing monsters. In the Iceheart Sea, it is a brutal predator of the ice.",
      "nature": "A massive, hyena-like beast adapted for the ocean, its sloping body is covered in a dense, oily, water-repellent hide. Its front flippers retain massive, raking claws, and a ruff of stiff, greasy bristles surrounds its neck to trap air. Its face features a broad muzzle with an immense bite-force, small eyes burning with predatory intelligence, and flattened, seal-like ears.",
      "habitat": "These beasts hunt along the drifting ice-floes, frozen coastlines, and open channels of the Iceheart Sea.",
      "depth": "Nandis hunt on ice-floes, stalking ice-fishing camps and using their claws to tear open shelters. They target the heads of their prey to consume the fat-rich brains, and they frequently follow whale migrations to scavenge carcasses. Whalers view them as a sign of nearby whales but must defend their catches from them. A local village has reported a pack of Nandis nesting nearby, and is hiring hunters to clear them before the winter freeze."
    },
    {
      "id": "popobawa",
      "name": "Popobawa",
      "description": "A shape-shifting shadow with a single bruised eye, this spirit inflicts night-terrors on sleeping crews.",
      "type": CREATURE_TYPES.HUMANOID,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "popobawa",
        "humanoid"
      ],
      "tokenIcon": "Bestiary/popobawa",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 18,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Popobawa is inspired by the Zanzibar Popobawa, a bat-winged, one-eyed spirit that attacks victims in their homes, and the Greek Empusa's shape-shifting, fear-exploiting nature. In the setting, it is a plague of ship cabins.",
      "nature": "Its form shifts constantly between a hunched dwarf, a bat-winged specter, and a formless shadow, leaving a trail of sulfur-smelling phosphorescent slime. Its only stable feature is a single bruised eye in the center of its mass. This eye gazes with a mocking intelligence, while the rest of its shifting body dissolves into black smoke before congealing into new shapes.",
      "habitat": "These spirits infiltrate the dark, cramped cabins and crew quarters of ships sailing the Iceheart Sea.",
      "depth": "The Popobawa slips into cabins to inflict severe night-terrors that exhaust sailors and cause them to collapse on watch. The creature psychically silences its victims, and it will return nightly until the victim publicly names it to another person. Captains enforce policies where crew members must describe their dreams at breakfast to break this silence. A vessel has recently arrived in port with a completely exhausted crew, and investigators are looking for adventurers to root out the spirit."
    },
    {
      "id": "abada",
      "name": "Abada",
      "description": "A shy, antelope-like narwhal with a glowing horn that neutralizes all poisons and purifies water.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "iceheart",
        "abada",
        "beast"
      ],
      "tokenIcon": "Bestiary/abada",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 10,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 16,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 40,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "poison": 100,
        "radiant": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Narwhal-Bonk",
          "description": "+4 to hit, 1d6+2 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Abada is based on the Central African Abada, a small unicorn-antelope whose horn serves as an antidote, and the Monoceros of Greek bestiaries, whose horn neutralizes toxins. In the Iceheart, it is a sacred purifier.",
      "nature": "A small, antelope-sized creature resembling a baby narwhal, its sleek body is covered in pearl-white fur, and its hooves are modified into webbed flippers. A single spiraling horn of pearlescent ivory juts from its forehead, glowing with warm, opalescent light. Its fawn-like face features oversized, rotating ears and enormous liquid eyes that project absolute innocence.",
      "habitat": "These gentle beasts reside in the shallow coral reefs, lagoons, and freshwater estuaries of the Iceheart Sea.",
      "depth": "The Abada's horn purifies any water or toxin it touches, making it a vital cure in Wyrd-taint-infested seas. They tend coral gardens, using their horns to carve channels that direct nutrients and keep reefs immune to decay. Although harvesting the horn is an act of ultimate sacrilege, it can purify a ship's water for a year. A group of poachers is rumored to be tracking an Abada, and local druids are seeking protectors to stop them."
    },
    {
      "id": "graia",
      "name": "Graia",
      "description": "A colorless, mathematical whirlpool that serves as a portal to the spirit-realm and distorts time.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "graia",
        "elemental"
      ],
      "tokenIcon": "Bestiary/graia",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 0,
        "agility": 0,
        "constitution": 0,
        "intelligence": 18,
        "spirit": 22,
        "charisma": 18,
        "maxHp": 215,
        "currentHp": 215,
        "maxMana": 100,
        "currentMana": 100,
        "maxActionPoints": 0,
        "currentActionPoints": 0,
        "initiative": 0,
        "speed": 0,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "all": 100
      },
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Graia is inspired by the Greek Graia or Grey Sea, a featureless mythical expanse sailed by the Argonauts, and Mami Wata's Whirlpool, a portal to the spirit world. In the setting, it is a localized temporal anomaly.",
      "nature": "This thirty-foot circular eddy rotates with mathematical precision, ringed by a halo of displaced foam. The water within the swirl is perfectly colorless and transparent, keeping fallen objects suspended without sinking. The air above remains unnaturally still. Staring into its depths reveals a face forming in the water—the observer's own face, aged and mouthing a silent question.",
      "habitat": "These stable eddies form in the open, desolate stretches of the Iceheart Sea.",
      "depth": "The swirl acts as a stable portal to the spirit-realm where binding bargains are struck with deep-spirits, making them highly prized by Neth contract-mages. Ships sailing through its center are transported through time rather than space, emerging aged by weeks or younger, as the swirl takes what it wants. A Neth mage is currently hiring a crew to navigate close to a known swirl to conduct a ritual, offering high rewards for the risk."
    },
    {
      "id": "ichthya",
      "name": "Ichthya",
      "description": "A scaled sea-centaur with a glowing trident, this volcanic blacksmith warns of Monolith instability.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "ichthya",
        "elemental"
      ],
      "tokenIcon": "Bestiary/ichthya",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 16,
        "intelligence": 14,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 200,
        "currentHp": 200,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "fire": 50
      },
      "vulnerabilities": {
        "poison": 25
      },
      "abilities": [
        {
          "name": "Trident-Strike",
          "description": "+6 to hit, 2d8+4 piercing + 1d6 fire from the red-hot tips",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+4"
            }
          ]
        },
        {
          "name": "Horse-Uppercut",
          "description": "+5 to hit, 2d6+3 bludgeoning",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ichthya is based on the Greek Ichthyocentaur, a wise sea-centaur, and Ogun's Forge-Beneath-Waves from Yoruba tradition. In the setting, they are volcanic artisans who keep the rhythm of the ocean.",
      "nature": "This creature has a muscular human torso, the scaled chest and forelegs of a draft-horse, and a powerful fish tail. It carries a massive iron trident marked by forge hammers and glowing red-hot at the tips. Its horse-section is bay-brown, and spark-scales line its flanks. Its weather-lined face has a salt-bleached beard and eyes that glow like wind-fanned coals.",
      "habitat": "These creatures make their homes around submarine volcanic vents, hot springs, and reef-slopes of the Iceheart Sea.",
      "depth": "Using volcanic vents as hearths, the Ichthya forge tridents and harpoons that never rust or break, gifting them only to worthy captains. By listening to wave-patterns, they can predict Sundered Monolith instability an hour before it happens, warning the Myrathil. Their agitation is a sure sign of danger. A Myrathil settlement has noticed their local forge-keeper growing restless, and is seeking adventurers to investigate the volcanic vents."
    },
    {
      "id": "brine",
      "name": "Brine",
      "description": "A floating orb of warm gold light containing smiling faces, this spirit guides ships to safety during storms.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "iceheart",
        "brine",
        "undead"
      ],
      "tokenIcon": "Bestiary/brine",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 4,
        "agility": 16,
        "constitution": 10,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 45,
        "currentHp": 45,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 0,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Brine is inspired by the Greek Lampeia, mysterious ocean-lights guiding or misleading sailors, and the Yoruba Osu, ancestor-lights representing the souls of the dead. In the setting, they are guiding spirits.",
      "nature": "A floating golden orb about the size of a human head, it hovers six inches above the water and rotates slowly, dropping glowing gold motes. The sphere is composed of compressed liquid gold, and viewing it closely reveals dozens of tiny, smiling, translucent faces pressed against the inner surface. Its warmth provides comfort in the freezing night.",
      "habitat": "These spirits hover near the coastal cliffs, harbor mouths, and open waters of the Iceheart Sea.",
      "depth": "True Brines are the souls of sailors who died heroically, appearing during storms to guide lost ships to safe coves. However, Wyrd-corrupted false lanterns exist, leading ships onto rocks; these can be identified by the screaming, terrified faces within, visible through silver mirrors. A local captain is planning a voyage through a storm-swept passage and is seeking adventurers to guide his ship using a true lantern."
    },
    {
      "id": "kappa",
      "name": "Kappa",
      "description": "A stone-shelled, turtle-like humanoid that guards geothermal pools, carrying a bowl of glowing water on its head and bound by an unbreakable code of politeness.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "cragjaw",
        "kappa",
        "elemental"
      ],
      "tokenIcon": "Bestiary/kappa",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 16,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "lightning": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Beak-Snap",
          "description": "+5 to hit, 1d6+3 piercing + DC 13 AGI or grappled, pulled into pool",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+3"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kappa traces its lineage to the ancient water-sprites of old folklore, which were said to carry a shallow bowl of life-giving water upon their crowns and possessed an eccentric obsession with cucumbers, politeness, and the extraction of mythical soul-organs. In the frozen peaks of this land, these roots intermingle with tales of the Yacuruna, the seductive and powerful water-people who dwell in the depths of rivers and lakes, occasionally drawing mortal mates down into their sub-aquatic realms to never return. Here, they have become geothermal sentinels, bound to the steaming waters that keep the freezing wilderness at bay.",
      "nature": "Standing roughly three feet tall, this humanoid creature possesses a rough, dark shell of volcanic basalt pitted with mineral deposits, suggesting a form birthed from both stone and water. Its crown bears a shallow depression filled with glowing blue water and ringed by tough mountain reeds, while its deceptively long, webbed limbs echo the anatomy of a frog. Its beaked, turtle-like face features round, obsidian-black eyes that blink with slow deliberation, and its mouth curves downward in a perpetual, judgmental frown as it clutches a pouch of smooth geothermal river-stones gathered from the holdfasts.",
      "habitat": "These stone-shelled sprites are found exclusively within the geothermal pools and steamy thermal corridors of the Cragjaw Peaks, where they cluster around volcanic vents.",
      "depth": "Bound by an absolute code of etiquette known as the bow-debt, the Kappa is compulsively polite; if a traveler bows deeply to it, the creature is forced to return the gesture, spilling its head-water and temporarily losing its power, a quirk Fexric engineers frequently exploit to slip past them along pipeline corridors. They guard the hot thermal pools of Frostmaw Holdfast with fierce devotion, ensuring the waters never freeze or run dry, which prompts the Kethrin guilds to leave costly offerings of imported cucumbers at pool-side shrines to appease them. Lately, rumors of a rogue Kappa spotted near key geothermal conduits have spread, prompting guild-masters to hire daring adventurers to retrieve rare components from the creature to secure the holdfast's heating systems."
    },
    {
      "id": "kitsune",
      "name": "Kitsune",
      "description": "A multi-tailed white fox of heart-breaking beauty that conjures deadly illusions and takes the shape of familiar faces to lead travelers astray.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "kitsune",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/kitsune",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 18,
        "constitution": 12,
        "intelligence": 16,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 50
      },
      "vulnerabilities": {
        "iron": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kitsune draws its lineage from the ancient shape-shifting fox-spirits of folklore, creatures of immense intellect that grow additional tails as they age and hold sway over illusions and human possession. In this mountain realm, their myth is laced with the legend of the Chullachaqui, a deceptive forest spirit that assumes the likeness of a familiar companion to lure unsuspecting travelers into the trackless wilds, betrayed only by a single deformed foot. They are guardians and tricksters in equal measure, haunting the high Spans and mining shafts of the peaks.",
      "nature": "The creature appears as a magnificent fox of mountain-snow white, its fur shot through with veins of mineral-blue and fanning out into multiple tails that glow with a faint, phosphorescent light. Its paws leave an erratic trail that alternates between vulpine prints, human steps, and the sharp hooves of a goat, though one hind paw always faces backward in a strange anatomical distortion. Its face possesses a heart-breaking beauty, with vast, crystalline eyes that reflect a viewer's deepest desires and an expression of infinite patience, though its human shape-shifted forms always carry the telltale backward foot.",
      "habitat": "They roam the high elevations and abandoned mining shafts of the Cragjaw Peaks, making their dens near the ancient stone bridges.",
      "depth": "Because of its backward-facing hind paw, any prints it leaves in the snow point in the opposite direction of its actual travel. It leads trackers into dead-ends. It is obsessed with riddles of direction and space, and will let travelers pass if they walk backward while speaking to it."
    },
    {
      "id": "tsuchinoko",
      "name": "Tsuchinoko",
      "description": "A fat, winged serpent of glacier-blue that leaps across high chasms, speaks in a slurred voice, and trades mountain secrets for strong liquor.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "cragjaw",
        "tsuchinoko",
        "elemental"
      ],
      "tokenIcon": "Bestiary/tsuchinoko",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 18,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 310,
        "currentHp": 310,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Club-Smash",
          "description": "+7 to hit, 2d8+5 bludgeoning + DC 15 CON or stunned 1 round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 15,
              "onFail": {
                "type": "CONDITION",
                "condition": "slowed",
                "duration": 1
              }
            }
          ]
        },
        {
          "name": "Iron-Maul",
          "description": "+6 to hit, 2d6+4 bludgeoning, ignores 4 points of physical armor",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tsuchinoko is born from the convergence of the legendary short, fat, jumping serpents of eastern folklore and the Amaru, the double-headed, winged dragon-serpents of Incan cosmology associated with deep waters and underground wisdom. In the high frozen mountains, this combination manifests as a stout, winged serpent that possesses a slurred, booming human voice and an insatiable craving for strong alcohol.",
      "nature": "Roughly five feet long but nearly two feet thick at its center, this stout serpent tapers sharply at both ends, covered in scales of glacier-ice blue with warm, copper-streaked belly-scales. A pair of small, bat-like wings sprouts from behind its neckless head, buzzing with the speed of a hummingbird's wings to lift its heavy body into the air. Its face is dominated by an absurdly wide, frog-like mouth with large cheeks for storing food or stolen liquor, and its half-lidded golden eyes look out with lazy amusement. It has a forked tongue like a snake.",
      "habitat": "This creature makes its home on the narrowest knife-edge ridges and high cliffs of the Cragjaw Peaks.",
      "depth": "A fat snake that rolls like a hoop by biting its own tail. It is a severe alcoholic: it can smell liquor from miles away and will bypass combat entirely to drink any alcohol the players carry, falling asleep and becoming a harmless, squishy pillow."
    },
    {
      "id": "nopperabo",
      "name": "Nopperabo",
      "description": "A faceless, cloaked figure that stands on mountain bridges, extracting body fat with needle-like fingers to seal the cracks in the bone Spans.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "nopperabo",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/nopperabo",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 10,
        "constitution": 10,
        "intelligence": 10,
        "spirit": 10,
        "charisma": 10,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {},
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nopperabo represents a chilling synthesis of the faceless spirits of Yokai lore, which terrify travelers by turning to reveal blank, featureless visages, and the Pishtaco, the pale-skinned bogeyman of Andean legend who drains the fat from human bodies. In the high bridges of this cold world, they embody a quiet, transactional horror, rendering the flesh of travelers into a commodity to preserve the setting's ancient structures.",
      "nature": "Appearing from behind as a normal traveler wrapped in a pale, hooded cloak, the creature reveals a smooth, featureless oval of pale skin with no eyes, nose, or mouth when it turns to face its prey. From beneath its heavy sleeves, it extends long, surgeon-precise fingers tipped with thin, hollow needles designed for extracting body fat without leaving a visible wound. A calm, measured, and chillingly reasonable voice projects directly from the flat plane of its blank face.",
      "habitat": "These faceless figures haunt the narrowest corridors and drafty Spans of the Cragjaw Peaks, standing like silent sentinels in the wind.",
      "depth": "Appears as an NPC players know. When it turns around, its face slides off like wet clay. It steals the faces of sleeping travelers; a player whose face is stolen cannot speak or cast verbal spells, and must track down the Nopperabo to retrieve their face."
    },
    {
      "id": "supayoni",
      "name": "Supayoni",
      "description": "A twelve-foot-tall ogre of blue glacier-ice that rules the deep mines, wielding a club of petrified ice and demanding tributes of raw ore.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "cragjaw",
        "supayoni",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/supayoni",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 10,
        "constitution": 10,
        "intelligence": 10,
        "spirit": 10,
        "charisma": 10,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {},
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Supayoni is born of the ancient ogre-demons of Yokai lore, who carry iron clubs to bring ruin and disaster, merged with Supay, the Incan lord of the underworld who rules the deep earth and the mineral veins beneath the mountains. They are massive, imposing figures of the peaks, representing both the violent fury of the elements and a stern, subterranean justice.",
      "nature": "Standing twelve feet tall, this massively muscled humanoid possesses skin the color of deep glacier-ice and two sharp, crystalline horns that sweep upward from its temples, emitting a low, subsonic hum of terror when it prepares to strike. It carries a heavy iron club, or kanabo, made of petrified ice harder than steel, and its broad, feral face features a fanged grin, crystalline teeth, and two glowing red eyes, supplemented by a third eye on its forehead that pierces absolute darkness.",
      "habitat": "They claim the deep, dark mine-shafts and ancient volcanic chambers beneath the Cragjaw Peaks as their personal domains.",
      "depth": "Acts as an arbiter in deep mines. It will allow miners and adventurers to harvest ore, but it demands an 'ore-tax' (10% of all gathered metal). If anyone tries to smuggle ore past it, its third eye glows and it uses its frozen club to shatter their metal armor into ice."
    },
    {
      "id": "jorogumo",
      "name": "Jorogumo",
      "description": "A spider-woman clad in webs of gold and silver who lures travelers on the mountain bridges to drain their mineral-rich blood.",
      "type": CREATURE_TYPES.DRAGON,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "jorogumo",
        "dragon"
      ],
      "tokenIcon": "Bestiary/jorogumo",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 18,
        "constitution": 14,
        "intelligence": 16,
        "spirit": 14,
        "charisma": 18,
        "maxHp": 650,
        "currentHp": 650,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "poison": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Needle-Fang",
          "description": "+6 to hit, 2d6+4 piercing + 2d6 poison",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The jorogumo represents the blending of the binding bride spider-spirits of folklore, who lure unsuspecting victims with their beauty, and Urcaguary, the Incan guardian of metals and jewels who watches over the earth's hidden treasures. This fusion yields a creature of deceptive grace and metallic corruption, guarding the richest veins in the mountains with webs of precious metal.",
      "nature": "From the front, the creature appears as a beautiful woman in a shimmering bridal gown of semi-transparent silk standing on the Spans, but from behind, she reveals the massive, metallic-chitin abdomen of a spider anchored by thick golden cables. Her gown is actually a sensory web containing trace amounts of gold and silver, and her exquisite human face conceals compound eyes and rows of needle-sharp spider fangs that are exposed only when she smiles.",
      "habitat": "She makes her home on the narrowest Ancestor-Spans and rich mineral chasms of the Cragjaw Peaks.",
      "depth": "She lures travelers by posing as a stranded maiden on the bridges, only to bind them in metallic-silk cables and hang them beneath the spans to drain their mineral-rich blood over several weeks. Because her webs are blessed by Urcaguary, they are laced with a corrosive poison that ruins excavation tools, forcing Fexric engineers to offer her precious gems in exchange for passage or access to the veins. Adventurers must tread carefully when searching for missing travelers, often facing the choice of fighting the creature or bargaining with precious jewels to free her captives."
    },
    {
      "id": "kodama",
      "name": "Kodama",
      "description": "A tiny spirit of stone and snow that echoes the voices of travelers and wails in sorrow when the mountain is damaged.",
      "type": CREATURE_TYPES.PLANT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "kodama",
        "plant"
      ],
      "tokenIcon": "Bestiary/kodama",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 4,
        "agility": 18,
        "constitution": 8,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 12,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 20,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "psychic": 100,
        "cold": 50
      },
      "vulnerabilities": {
        "physical": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kodama is born of the ancient tree-spirits who dwell in old-growth forests and speak in repeating whispers, combined with the Apus, the sacred mountain-spirits of Andean tradition that watch over valleys and receive offerings from those below. In the high peaks, they have become the animate voice of the mountain itself, bound to the stone and snow.",
      "nature": "Standing only a foot tall, this small humanoid figure appears sculpted from the mountain itself, with skin of grey granite, hair of white snow, and eyes of sparkling quartz. It leaves no footprints when it traverses the snowy crags and communicates solely by bouncing sound off the stone walls with impossible precision. Its face is a simple, child-like carving with quartz-bead eyes and an open, O-shaped mouth, conveying a warm but ancient sadness.",
      "habitat": "They dwell on the high wind-swept slopes and rocky ledges of the Cragjaw Peaks, where they blend seamlessly into the stone.",
      "depth": "These spirits repeat everything they hear after a delay of exactly one mountain-breath, creating a layered chorus that the Groven use as a natural communication network to bounce messages across wide valleys. They are deeply bound to the spirits of the peaks, wailing in mournful tones that drive listeners to tears whenever mining or Wyrd-corruption damages the stone. Engineers monitor their cries as a warning system for structural collapse, and adventurers are often sent to investigate when a Kodama's weeping signals a disaster deep in the mountains."
    },
    {
      "id": "nurikabe",
      "name": "Nurikabe",
      "description": "A living block of cliff-face that floats just above the ground, blocking and rearranging mountain paths overnight unless disrupted by copper.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "nurikabe",
        "construct"
      ],
      "tokenIcon": "Bestiary/nurikabe",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 8,
        "constitution": 20,
        "intelligence": 6,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 0,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 100,
        "cold": 50
      },
      "vulnerabilities": {
        "copper": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nurikabe combines the wall-spirits of Yokai folklore, which block paths with insurmountable, invisible barriers, and the ancient Tiwanaku stone-spirits said to rearrange massive monoliths under the cover of night. In the cold mountain passes, they manifest as living rock faces that shift and slide, altering the geography of the heights to baffle travelers.",
      "nature": "Appearing as a solid section of striated, snow-dusted cliff-face that has detached and positioned itself across a path, this creature matches the local geology perfectly. Only a tiny, quarter-inch gap between the bottom of the rock and the frozen ground betrays its floating, living nature, and it moves with slow, geological silence. It lacks a face, but a deep, slow breathing resonates from the cold stone if a traveler presses an ear against its surface.",
      "habitat": "They reside in the narrow mountain passes, paths, and canyon floors of the Cragjaw Peaks.",
      "depth": "These wall-spirits block mountain paths overnight, extending upwards and outwards if travelers attempt to climb or bypass them, leaving them completely impassable unless the base is tapped with a copper-tipped staff to disrupt their magnetic hold. During the night, they rearrange the geography of the peaks, turning familiar routes into dead ends and opening new passages, which makes Groven guides essential for safe travel. Adventurers are often hired to clear blocked trade routes by finding ways to coax these stubborn stone-spirits to step aside."
    },
    {
      "id": "nue",
      "name": "Nue",
      "description": "A churning black storm-cloud that brings humid heat, animal cries, and terrifying nightmares to punish those who mine too deep.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "nue",
        "beast"
      ],
      "tokenIcon": "Bestiary/nue",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 12,
        "agility": 18,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 25,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 100,
        "fire": 50,
        "physical": 75
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nue arises from the chimeric nightmare-monsters of Yokai legend, which bring sickness and dark dreams within a black mist, combined with Pachamama, the Incan earth-mother who nurtures and devours in equal measure. In the high peaks, the creature represents the earth's furious immune response, a living tempest sent to punish those who defile the stone.",
      "nature": "The creature manifests as a dense, churning storm-cloud of black-grey snow that moves against the wind, warm enough to melt the snow within it and create a pocket of humid, tropical air in the frozen mountains. Inside the churning mass, one can catch fleeting glimpses of monkey-jaws, tiger-claws, and serpentine coils, accompanied by a cacophony of animal cries. The cloud constantly projects angry, shifting animal faces that dissolve back into the dark mist.",
      "habitat": "This living storm drifts across the high peaks and valleys of the Cragjaw Peaks, drawn to sites of excavation and industrial mining.",
      "depth": "Enveloping mountain camps in its warm, humid darkness, the Nue inflicts shared, terrifying nightmares upon those trapped inside, leaving them exhausted and hallucinating for days. It is drawn to collapsed mines, excavation sites, and areas of heavy Wyrd-corruption, acting as Pachamama's wrath against the intrusive digging of the Kethrin guilds. When a Nue descends, miners flee, and adventurers are often contracted to clear the mist or find the deep-earth wounds that summoned it."
    },
    {
      "id": "kasha",
      "name": "Kasha",
      "description": "A lynx-sized cat of blue-white flame that steals corpses from funerals but leaves magical miniatures that bring prosperity to the worthy.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "cragjaw",
        "kasha",
        "undead"
      ],
      "tokenIcon": "Bestiary/kasha",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 12,
        "agility": 18,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 100,
        "cold": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Claw-Pounce",
          "description": "+5 to hit, 2d6+3 slashing + 1d6 fire",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kasha is born of the fiery corpse-stealing cats of Buddhist folklore, who descend during funerals to claim the bodies of the wicked, and Ekeko, the Andean god of abundance and fortune who brings prosperity through miniature offerings. In the cold mountain holdfasts, they are ambivalent judges, carrying the keys to both spiritual unrest and material wealth.",
      "nature": "This creature resembles a large, lynx-sized cat composed of living, blue-white flame that vaporizes snow into steam without producing smoke or ash. It wears a tiny harness on its back loaded with a bundle of miniature tools, weapons, and food items, all carved with meticulous detail. Its feline face displays a calculating intelligence, with sharp, golden-molten eyes that evaluate the worth of those it encounters.",
      "habitat": "They stalk the high ridges and snowy cemetery niches of the Cragjaw Peaks, often descending toward mortal settlements.",
      "depth": "Descending during Groven funeral processions, the Kasha attempts to steal the deceased from their bridge niches, leaving their spirits to wander as restless ghosts if the body is taken. However, drawing from Ekeko, the creature also leaves miniature representations of desperately needed items for households it deems worthy, which transform into real tools, food, or coal within seven days. Adventurers are often hired to guard funeral processions from their fiery raids or to seek out the nests of these fire-cats to retrieve the magical miniatures they carry."
    },
    {
      "id": "tanuki",
      "name": "Tanuki",
      "description": "A round, mischievous raccoon-dog trickster that demands songs and sake as toll, rewarding the friendly with fortune-bringing stone carvings.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "cragjaw",
        "tanuki",
        "construct"
      ],
      "tokenIcon": "Bestiary/tanuki",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 12,
        "charisma": 16,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tanuki is born of the shape-shifting, sake-loving raccoon-dog spirits of folklore, famed for their magical, shape-shifting pouches and sense of humor, merged with the Illas of Andean tradition—small stone or metal figurines that carry abundance energy to ensure rich finds in the mines. They are jovial tricksters of the spans, bringing good fortune to those who tolerate their games.",
      "nature": "It appears as a squat, round-bodied raccoon-dog with a belly that drags through the snow, wearing a cone-shaped hat of dried mountain-grass and carrying a flask of sake that never runs dry. It carries a magical, shape-shifting pouch that can produce any object, most often creating small stone illas that it arranges in patterns. Its wide, friendly face is marked by dark-rimmed eyes and a permanent, wide grin of pure mischief.",
      "habitat": "They frequent the Ancestor-Spans and main travel corridors of the Cragjaw Peaks, setting up camp on the busiest bridges.",
      "depth": "Disguised as Groven toll-collectors, they demand bizarre payments like riddles, songs, or drinks of sake, rewarding cooperative travelers with stone illas that bring good fortune and make their packs heavier, while turning the gear of the uncooperative into dry leaves. The Groven welcome their presence on the spans as a sign of favor, and miners actively seek them out to acquire the illas, which guide them to richer mineral veins. Adventurers may find themselves playing games of chance with a Tanuki to secure passage or retrieve a stolen piece of equipment transformed by its magic."
    },
    {
      "id": "ushioni",
      "name": "Ushioni",
      "description": "A massive, volcanic-plated spider with a demonic bull's head that webs geothermal vents and demands tribute to prevent freezing.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "cragjaw",
        "ushioni",
        "beast"
      ],
      "tokenIcon": "Bestiary/ushioni",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 18,
        "intelligence": 8,
        "spirit": 10,
        "charisma": 6,
        "maxHp": 405,
        "currentHp": 405,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "physical": 50,
        "poison": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Bull-Head-Slam",
          "description": "+6 to hit, 2d8+5 bludgeoning + DC 14 AGI or knocked prone",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ushioni is born of the spider-bodied, bull-headed ox-demons of eastern folklore, which trap prey in webs and breathe poison, combined with the Cherufe, the magma-monsters of Mapuche myth that demand sacrifices to prevent volcanic eruptions. They are terrifying forces of geothermal heat, occupying the deepest volcanic vents and holding nearby settlements hostage.",
      "nature": "This massive monster combines the body of a six-legged spider plated in rough volcanic stone with the head of a demonic bull bearing curved obsidian horns. Its breath is a yellow cloud of toxic sulfur gas, its cloven hooves leave deep impressions in stone, and its body radiates such intense heat that snow melts in a ten-foot circle around it. Deep obsidian sockets hold glowing red eyes, and steam vents constantly from its nostrils, framing a mouth filled with writhing, worm-like tendrils.",
      "habitat": "They make their lairs inside the active volcanic vents and deep geothermal chambers of the Cragjaw Peaks.",
      "depth": "Spinning webs of volcanic-glass silk across geothermal vents, the Ushioni traps unwary prey in the steam, suffocating them with its yellow sulfur breath before devouring them. It demands monthly tributes of refined ore from Fexric holdfasts, and if denied, it will physically block the geothermal pipes, freezing entire sections of Frostmaw Holdfast within hours. Holdfast leaders frequently hire seasoned adventurers to clear these pipe-blocking beasts or to harvest their valuable volcanic-glass silk."
    },
    {
      "id": "baku",
      "name": "Baku",
      "description": "A bear-sized chimera with an elephant's trunk and a glowing hide that devours nightmares and turns its home into a sacred sanctuary.",
      "type": CREATURE_TYPES.PLANT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "baku",
        "plant"
      ],
      "tokenIcon": "Bestiary/baku",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 14,
        "agility": 10,
        "constitution": 16,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 2,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 100,
        "cold": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Gentle-Nudge",
          "description": "+3 to hit, 1d4 bludgeoning — it is a peaceful creature",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Baku is born of the chimera-like dream-devourers of folklore, which possess elephantine trunks and tiger legs to consume the nightmares of mortals, merged with the concept of the Huaca, the sacred objects and beings of Incan tradition that contain extraordinary spiritual power. In the high peaks, they are treated as living sanctuaries, bringing peace and protection to the cold holdfasts.",
      "nature": "This creature is a bizarre composite, featuring an elephantine trunk, the thick grey skin folds of a rhinoceros, a cow-like tail, and short, sturdy tiger legs on a body the size of a large bear. Its hide glows with a soft, warm, golden luminescence that radiates an aura of absolute safety and calm, and its prehensile trunk constantly sniffs the air. Its large, soulful brown eyes convey ancient wisdom, and its trunk is delicate enough to pull abstract fears from the minds of sleepers.",
      "habitat": "They wander the residential corridors, workshops, and warm sleeping quarters of Frostmaw Holdfast in the Cragjaw Peaks.",
      "depth": "Prowling the sleeping quarters of the holdfast, the Baku uses its delicate trunk to extract and consume the nightmares of the inhabitants, leaving them to wake refreshed with no memory of their terrors. A section of the holdfast that plays host to a Baku becomes a sacred huaca, protected from Wyrd-corruption, violence, and supernatural threats, which leads Kethrin engineers to compete fiercely to house the creatures near their workshops. Adventurers are often tasked with protecting these sacred beasts from poachers or guiding a wild Baku into a nightmare-plagued community."
    },
    {
      "id": "nekomata",
      "name": "Nekomata",
      "description": "A storm-grey wildcat with two tails that crackle with lightning, using the static of blizzards to animate and control the frozen dead.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "nekomata",
        "undead"
      ],
      "tokenIcon": "Bestiary/nekomata",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 12,
        "agility": 18,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 8,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "lightning": 100,
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Tail-Slash",
          "description": "+5 to hit, 1d8+3 slashing + DC 13 CON or stunned 1 round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nekomata arises from the two-tailed cat-demons of Yokai lore, which raise the dead and control them like puppets, combined with the Kcoa, the powerful storm-cat spirits of Andean belief. In the freezing heights, this creature represents a dark storm-necromancer, using the static energy of the blizzards to animate the frozen dead.",
      "nature": "This large wildcat possesses a dark storm-grey coat and a tail that has split into two separate appendages, which crackle with static electricity and arc with lightning when the creature is agitated. Its eyes glow with a phosphorescent green corpse-light, and it wears a necklace of carved bone-charms taken from the bodies it has claimed. Its feline face has vertical slit pupils, and its mouth glows from within like a green necromantic furnace when opened.",
      "habitat": "It haunts the wind-swept ridges, high bluffs, and frozen crevasse fields of the Cragjaw Peaks.",
      "depth": "Operating during the worst mountain storms, the Nekomata uses the lightning's static charge to animate the frozen corpses of those lost in the blizzard, controlling their movements through the flicking of its twin tails. It sends these puppet-like dead marching toward mountain camps in eerie, lightning-lit processions, forcing the Groven to burn their dead to prevent them from being used as thralls. Adventurers are frequently hired to hunt these storm-cats down before a blizzard allows them to raise a small army of the frozen dead."
    },
    {
      "id": "futakuchi",
      "name": "Futakuchi",
      "description": "A gaunt woman with a hidden, ravenous mouth at the back of her head that secretly devours larders and embodies the hunger of the peaks.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "futakuchi",
        "elemental"
      ],
      "tokenIcon": "Bestiary/futakuchi",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 25,
        "cold": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Hair-Whip",
          "description": "reach 10 ft, +5 to hit, 1d8+3 slashing — the second mouth's hair strikes independently",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Futakuchi is born of the two-mouthed women of folklore, whose hidden, greedy secondary mouths consume massive amounts of food, combined with the Aiai-Maneco, the Andean spirits of insatiable hunger that leave entire communities destitute. In the survival-strained holdfasts, they represent the terrifying manifestation of greed and the dread of starvation.",
      "nature": "Appearing as a tall, gaunt woman with stringy, matted black hair and sunken eyes, she looks permanently malnourished, her hands shaped as if cradling an empty bowl. Hidden beneath the hair at the back of her skull is a second, lipless mouth filled with jagged teeth and a writhing tongue, which demands food in a guttural, independent voice. From the front, her face is haunted and full of shame, but the rear mouth grins and drools with predatory hunger.",
      "habitat": "They hide in the storage larders, food-vaults, and kitchens of Frostmaw Holdfast and other settlements in the Cragjaw Peaks.",
      "depth": "Infiltrating food stores under the guise of an ordinary worker, the Futakuchi consumes three times the rations of a normal person, using its hidden mouth at night to empty vaults of dried moss-bread, ram-meat, and whiteout-distillate. The second mouth is said to speak the insatiable hunger of the mountains, punishing greedy Kethrin guild-masters who extract too much wealth by leaving their larders bare. Adventurers are often brought in to quietly investigate disappearing food supplies and deal with the hidden consumer before the holdfast starves."
    },
    {
      "id": "wanyudo",
      "name": "Wanyudo",
      "description": "A massive, rolling wheel of blue-white fire and screaming faces that collects the souls of freezing travelers in mountain passes.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "wanyudo",
        "elemental"
      ],
      "tokenIcon": "Bestiary/wanyudo",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 18,
        "constitution": 16,
        "intelligence": 8,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 45,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "cold": 100,
        "physical": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Wanyudo is born of the flaming souls-wheels of folklore that roll through mountain passes to steal the spirits of onlookers, merged with the ceremonial sun-wheels of the Inti-Raymi festival. In the cold, sunless world, these sacred festival-wheels have been twisted by Wyrd-corruption, turning them into cold-burning engines of eternal torment.",
      "nature": "From a distance, the creature resembles a traveler's cart rolling through the blizzard with swaying lanterns, but up close, it reveals itself as a single, enormous wheel of blue-white flame and screaming, translucent faces. The wheel's rim is bound in cold-iron, and the fire it emits produces no heat, only a freezing cold that crystallizes the mountain air. The wheel is comprised of dozens of rotating, tormented faces, each crying out in silent agony as they cycle through the flames.",
      "habitat": "They roll through the high, wind-swept passes, switchbacks, and Span-corridors of the Cragjaw Peaks during blizzards.",
      "depth": "Cruising through the mountain passes during the worst winter storms, the Wanyudo targets freezing travelers, extracting the souls of anyone who looks directly at it to add to its burning rim while leaving behind frozen, wide-eyed corpses. It is particularly active during the season of the lost sun-festival, seeking warmth and light by consuming the vital essence of mortals. Adventurers are hired to clear passes haunted by these wheels, or to recover the cold-iron rim of a destroyed Wanyudo to forge cold-resistant artifacts."
    },
    {
      "id": "tsuchigumo",
      "name": "Tsuchigumo",
      "description": "A draft-horse-sized spider of solid stone and gems that spins webs of molten gold and uses illusions of wealth to trap miners.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "cragjaw",
        "tsuchigumo",
        "beast"
      ],
      "tokenIcon": "Bestiary/tsuchigumo",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 12,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "fire": 25,
        "cold": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Mandible-Clash",
          "description": "+6 to hit, 2d6+4 slashing + metallic venom that slows",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tsuchigumo represents the convergence of the ancient, illusion-weaving earth-spiders of Yokai lore, historically associated with rebellious mountain clans, and the metallic-serpent guardians of Urcaguary who protect the earth's treasures. Birthed from stone and precious ores, these massive arachnids guard the deepest veins of the mountains with webs of solid gold and illusions of wealth.",
      "nature": "This draft-horse-sized spider possesses a body of compressed granite, striated stone, and rich mineral veins, with jointed stone legs and an exposed geode carapace lined with sparkling crystals. It has eight gemstone eyes—ruby, emerald, sapphire, diamond, opal, topaz, amethyst, and garnet—that glow with internal fire, and its obsidian mandibles drip with metallic venom. It spins webs of shimmering, molten gold, silver, and copper threads that glow in the dark depths.",
      "habitat": "They dig their nests in the deepest mine shafts, underground caverns, and gem-rich fissures of the Cragjaw Peaks.",
      "depth": "Guarding the richest mineral veins with gold-silk webs, the Tsuchigumo secretes a metallic venom that crystallizes the blood of miners into mineral compounds if they touch the threads. It projects illusions of unguarded, glittering veins to lure miners into its webbed chambers, forcing Fexric holdfasts to flag suspicious veins as hazardous. Daring salvage-teams and adventurers risk their lives to hunt the creature or harvest its golden webs, which can fetch a fortune if extracted without triggering its stone-shattering wrath."
    },
    {
      "id": "akaname",
      "name": "Akaname",
      "description": "A copper-skinned sprite with a long tongue that cleans geothermal pipelines but deserts workshops that violate the laws of cleanliness.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "cragjaw",
        "akaname",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/akaname",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 8,
        "agility": 18,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "poison": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Tongue-Lash",
          "description": "reach 10 ft, +5 to hit, 1d4+2 slashing — the tongue is three feet long, prehensile, rough like a cat's",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d4+2"
            }
          ]
        },
        {
          "name": "Cleaning-Tool-Armament",
          "description": "+4 to hit, 1d6+1 slashing — uses brushes, scrapers, sponges as weapons",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+1"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Akaname is born from the filth-licking sprites of folklore, which clean neglected spaces with their long tongues, and the Tunche, the shape-shifting spirits of the wilderness that enforce sacred taboos and punish the disrespectful. In the highly industrial holdfasts, they are vital pipeline cleaners that double as strict enforcers of hygiene and respect for resources.",
      "nature": "Standing three feet tall, this red-skinned humanoid has a body the color of polished copper, which is warm to the touch, and a three-foot-long, cat-like tongue that it uses to scrape surfaces. It carries a neatly maintained collection of brushes, scrapers, and sponges, and its pointed face is dominated by large yellow eyes that scan every surface for dirt. It moves with wiry agility, slithering through narrow pipes and crevices with ease.",
      "habitat": "They reside within the industrial pipelines, steam vents, and workshops of Frostmaw Holdfast and the Cragjaw Peaks.",
      "depth": "Infesting the pipeline network, the Akaname cleans mineral scaling from the pipes, tripling the flow efficiency and prompting Kethrin engineers to design special access ports for them. However, drawing from the Tunche, they enforce strict taboos of cleanliness; if a workshop becomes too dirty or neglected, the spirits will abandon it, which is considered a catastrophic omen that precedes clogged pipes and machinery failures. Adventurers are often hired to locate and relocate these cleaning-sprites when a workshop suffers from their sudden, ominous departure."
    },
    {
      "id": "inugami",
      "name": "Inugami",
      "description": "A spectral, blue-lit hound bound to a family by a collar of human hair, serving as a fierce guardian and a guide to the afterlife.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "inugami",
        "fey"
      ],
      "tokenIcon": "Bestiary/inugami",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 10,
        "agility": 18,
        "constitution": 12,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 10,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "physical": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "iron": 25
      },
      "abilities": [
        {
          "name": "Loyalty-Fang",
          "description": "+5 to hit, 2d6+3 cold damage — spectral bite",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Inugami is born of the dog-spirits bound to mortal families through ancient, dark blood-rituals to act as loyal guardians and instruments of revenge, combined with the sacred afterlife-guide dogs of pre-Columbian tradition. In the Span-settlements, they are revered and feared spectral protectors, representing a bond that transcends life and strengthens the very foundations of their homes.",
      "nature": "This spectral hound appears as a shifting, translucent outline of cold-blue light, wearing a collar of braided human hair locks taken from members of the family it guards. It is always slightly out of focus, like a heat-mirage, and its paws leave no tracks, often flickering and teleporting short distances rather than walking. Its dog-face is highly intelligent and sorrowful, and it can project its image onto reflective surfaces to watch over its family from afar.",
      "habitat": "They dwell on the Ancestor-Spans and within the homes of the Groven families they protect in the Cragjaw Peaks.",
      "depth": "Bound to Groven families, the Inugami acts as an invisible sentinel, warning of threats on the Ancestor-Spans and hunting down anyone who harms its charges with ruthless efficiency. When a family member dies, the hound guides their soul through the dangerous spirit-paths of the peaks, and when the hound itself fades, its essence absorbs into the bones of the Span to strengthen the bridge. Adventurers must deal with these spectral guardians when attempting to settle disputes with bound Groven families or when trying to retrieve lost souls from the mountain passes."
    },
    {
      "id": "ittan",
      "name": "Ittan",
      "description": "A thirty-foot strip of living embroidered cloth that carries messages across mountain chasms and wraps around travelers to protect them from the cold.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "cragjaw",
        "ittan",
        "fey"
      ],
      "tokenIcon": "Bestiary/ittan",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 4,
        "agility": 16,
        "constitution": 10,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "psychic": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ittan is born of the flying cotton-cloth Yokai of folklore that wrap around the faces of travelers, combined with the sacred textile-spirits and living quipu documents of Andean tradition, which weave the spiritual essence of their makers into physical form. In the high bridges, they are living, flying records and guardians, acting as peaceful messengers and protectors of the vulnerable.",
      "nature": "This creature is a thirty-foot-long, two-foot-wide strip of white, slightly yellowed cotton cloth with frayed edges that floats through the air like a ribbon in water. The fabric is warm, smelling of llama-wool and mountain-herbs, and is embroidered with geometric Andean patterns and quipu-knots that shift when unobserved. It has no face, but the embroidery rearranges itself into readable words, warnings, or names that respond to the observer's deepest concerns.",
      "habitat": "They fly through the open skies, chasms, and Ancestor-Spans of the Cragjaw Peaks, nesting in high bridge arches.",
      "depth": "Serving as living messengers, Ittans carry spoken words whispered into their fabric across the chasms of the peaks, delivering secure and unforgeable communication between Groven communities. When threatened, the banner wraps around an attacker's face, putting them into a peaceful, day-long sleep, and it will wrap around exposed children to protect them from the deadly cold of the blizzards. Adventurers are sometimes sent to recover an Ittan carrying a vital historical message, or to seek their help in surviving a winter crossing."
    },
    {
      "id": "almas",
      "name": "Almas",
      "description": "A towering, shaggy hominid that silently watches the steppe migrations from distant ridges, preserving the lost memories of the sky.",
      "type": CREATURE_TYPES.PLANT,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "almas",
        "plant"
      ],
      "tokenIcon": "Bestiary/almas",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 14,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 0,
        "currentMana": 0,
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
        "fire": 25
      },
      "abilities": [
        {
          "name": "Root-Club",
          "description": "+5 to hit, 2d6+3 bludgeoning",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Almas is born of the high mountain gaps and windswept steppe, drawing its lineage from the legendary Almasty wildmen of the Caucasus and the quiet Xing-Xing of ancient bestiaries. Rather than the aggressive wildmen of western folklore, this creature represents a silent, observant lineage of tree-spirits that have taken ape-like shape. In the setting of the Sundrift Vale, they exist as quiet watchers, remnants of an older world who carry the burden of speech they choose never to utter.",
      "nature": "Standing seven feet tall, the Almas is a lean and wiry biped covered in dense, reddish-brown hair matted with dried steppe-grass and mud, perfectly adapted for running across open, unforgiving terrain. Its face exists in the space between ape and human, defined by a broad, flat nose, deep-set amber eyes under a brooding brow-ridge, and a mouth that seems perpetually on the verge of articulation. Enormous, snowshoe-like feet allow it to traverse soft steppe-soil without sinking, while a necklace of carved ancestor-bones and a gnarled root-club hint at a deep, primitive spirituality.",
      "habitat": "These brooding watchers reside in the windswept grasslands and rocky ridges of the Sundrift Vale, shifting their territory in parallel with the nomadic migrations.",
      "depth": "The Almas acts as the living memory of the Sundrift Vale, remembering centuries of clan migrations, ancestor-mound rituals, and the gradual, tragic erasure of the stars by House Ordavan. They watch the nomadic clans from the safety of the ridges, never directly interfering but occasionally leaving silent gifts—such as a slain predator, dry firewood, or a cairn marking a hidden water-source. The Astril believe these creatures preserve the very constellation-patterns that were traded away, making them prime targets for those seeking lost celestial knowledge or those tracking rumors of their rare presence."
    },
    {
      "id": "tulpar",
      "name": "Tulpar",
      "description": "A celestial, scaled horse whose wings and hide glow with the patterns of lost constellations, leading wild herds across the darkened steppe.",
      "type": CREATURE_TYPES.DRAGON,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "tulpar",
        "dragon"
      ],
      "tokenIcon": "Bestiary/tulpar",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 20,
        "constitution": 14,
        "intelligence": 14,
        "spirit": 18,
        "charisma": 16,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 5,
        "speed": 50,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 100,
        "radiant": 100
      },
      "vulnerabilities": {
        "psychic": 25
      },
      "abilities": [
        {
          "name": "Starry-Cantrip",
          "description": "+5 to hit, 1d8 radiant",
          "type": "ranged",
          "icon": "ability_physical_taunt",
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
            "min": 0,
            "max": 0
          }
        },
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tulpar descends from the winged steeds of Turkic myth and the celestial Longma, the dragon-horse that rose from sacred waters carrying the cosmic patterns on its back. In the Sundrift Vale, these creatures are physical manifestations of divine favor and the lost heavens, embodying the untamable spirit of the steppe.",
      "nature": "This magnificent, powerfully built steed is covered in iridescent scales that shift color with the winds, transitioning from pale gold under clouds to deep blue at night. A single spiraling horn of crystal projects from its forehead, and its folded, feathered wings glow with the light of forgotten stars, leaving trails of stardust when unfurled. Its noble face features large, intelligent eyes that mirror the lost night sky, and its hooves strike tiny, star-like sparks from the frozen ground as it runs.",
      "habitat": "The Tulpar roams the open plains and high plateaus of the Sundrift Vale, moving wherever the wild horse herds migrate.",
      "depth": "A celestial horse of starlight. It will run alongside travelers and defend them from wolves, but if anyone attempts to touch it with a rope or bridle, it instantly dissolves into stardust and teleports 10 miles away. It can only be ridden bareback while in mid-air."
    },
    {
      "id": "erlik",
      "name": "Erlik",
      "description": "A nine-foot-tall arbiter of the dead, half-flesh and half-bone, who sits upon a throne of ancestral remains to weigh the debts of the living and the departed.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "erlik",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/erlik",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 16,
        "spirit": 20,
        "charisma": 14,
        "maxHp": 450,
        "currentHp": 450,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "physical": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Bone-Strike",
          "description": "+7 to hit, 2d8+5 bludgeoning + DC 15 SPI or the target feels the weight of their unfulfilled debts, taking 2d6 psychic per round for 3 rounds",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+5"
            },
            {
              "type": "SAVE",
              "attribute": "spirit",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Erlik draws its terrifying authority from Erlik, the first man to die and ruler of the Turkic underworld, combined with Yanluo Wang, the bureaucratic judge of the Chinese courts of Diyu. In the Sundrift Vale, this entity represents the finality of mortal law, enforcing the cosmic balance of debts and oaths that bind the clans together.",
      "nature": "Seated upon a throne formed from the interwoven, resonant bones of the interred dead, this nine-foot-tall figure is divided down the middle: one half is warm, weathered human flesh, while the other is a bare, cold skeleton etched with glowing runes of judgment. It holds a set of scales containing a single feather of steppe-grass on one side and a heavy stone tablet on the other. Its face is similarly split, showing the stern, wise visage of an ancient khan beside a bare skull with an amber-glowing eye socket, speaking in a dual voice of living justice and skeletal finality.",
      "habitat": "It dwells deep within the central chambers of the largest Ancestor-Mounds scattered across the Sundrift Vale.",
      "depth": "Seated on its bone throne, it judges souls. It refuses to let anyone pass unless their group can balance its scales: they must place an item of sentimental value on one side that weighs exactly the same as their collective sins (measured by Erlik's magic)."
    },
    {
      "id": "burkhan_wind",
      "name": "Burkhan-Wind",
      "description": "A sacred localized spirit of wind and fertility, visible only as a rhythmic breathing in the steppe-grass and a shimmering in the air.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "burkhan_wind",
        "elemental"
      ],
      "tokenIcon": "Bestiary/burkhan_wind",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 8,
        "agility": 16,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "all": 50
      },
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Burkhan-Wind embodies the sacred mountain and river spirits of Mongolian shamanism combined with Feng Bo, the Chinese Earl of Wind who rides the gales. It represents the breathing pulse of the land, an elemental guardian that demands respect and offering rather than worship, maintaining the fragile equilibrium of the steppe's ecosystems.",
      "nature": "This entity is a presence rather than a physical body, first noticed as a circular clearing where the grass rhythmically bends inward and outward as if breathing, surrounding a shimmering column of air. At the center of this disturbance stands a sacred pole draped in blue silk khadag-scarves that never decay and mysteriously multiply. When it chooses to manifest, the wind gathers into the shifting, translucent shape of an old man riding a stag, his face a serene, continuously blurring swirl of moving air.",
      "habitat": "It is bound to specific sacred sites, ancient trees, and pure springs across the Sundrift Vale.",
      "depth": "The presence of a Burkhan-Wind fertilizes the surrounding soil, sweetens the water, and keeps the local herds healthy, prompting Ordan nomads to adjust their migrations to pass through these blessed circles. Shamans petition the wind for favorable weather and safe passage through the fog by tying new silk scarves to the pole and throat-singing sacred melodies. If the offering is accepted, the silks multiply, but if the spirit is offended or foresees doom, the scarves disintegrate, signaling to the clan that they must alter their path immediately."
    },
    {
      "id": "nian",
      "name": "Nian",
      "description": "A roaring, iron-horned beast of rust and red fur that stampedes in packs during the dark season, consuming everything in its path.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "nian",
        "elemental"
      ],
      "tokenIcon": "Bestiary/nian",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 10,
        "charisma": 8,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 45,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 100,
        "cold": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Horn-Gore",
          "description": "+6 to hit, 2d8+5 piercing + DC 14 CON or burned, 1d6 fire per round for 3 rounds",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Nian is born of the terrors of winter and the underworld, drawing its lineage from the crop-devouring Nian of Chinese legend and the iron-horned monstrosities that compose Erlik's underworld herds. It represents the raw, destructive hunger of the cold months, when resources are scarce and survival hangs by a thread.",
      "nature": "Standing six feet at the shoulder, this massive, boar-like beast is covered in coarse, blood-red fur, sporting a heavy mane braided with discordant, rusted bells and a single curved horn of oxidized iron. Its eyes burn with a furnace-red glow, and its cloven hooves leave smoldering prints in the earth. Its face is a terrifying hybrid of tusked boar and roaring lion, with a maw that stretches impossibly wide to reveal a throat filled with flickering embers.",
      "habitat": "These ravenous beasts roam the windswept grasslands of the Sundrift Vale, appearing primarily during the darkest, coldest periods of the year.",
      "depth": "Travelling in destructive herds, Nians target nomadic settlements, trampling yurts, scattering livestock, and devouring leather, winter food stores, and sacred ancestor-bone ornaments. The Ordan combat these terrors with loud noise, loud throat-singing, and bonfires, painting their sacred poles red to create a warding barrier that the beasts charge but cannot cross. Brave hunters sometimes track these herds to harvest their valuable iron horns or recover stolen clan relics from their bellies."
    },
    {
      "id": "jiangshi",
      "name": "Jiangshi",
      "description": "A frozen, hopping corpse draped in traditional riding gear, driven by a paper talisman to resolve unfinished ancestral business.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "jiangshi",
        "undead"
      ],
      "tokenIcon": "Bestiary/jiangshi",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 14,
        "agility": 16,
        "constitution": 14,
        "intelligence": 4,
        "spirit": 10,
        "charisma": 4,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "physical": 50,
        "poison": 100
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Qi-Drain",
          "description": "+5 to hit, 2d6+3 necrotic — drains life-force through touch; targets DC 13 CON or lose 1d4 CON for 24 hours",
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
              "attribute": "constitution",
              "dc": 13,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Jiangshi combines the Chinese hopping corpse that drains life-energy with the Ubagan, the restless subterranean spirit of Turkic lore. They are born when a nomad dies far from home, leaving their spirit unable to rest in the ancestor mounds until their final duties are fulfilled.",
      "nature": "This creature is a desiccated corpse frozen in a rigid, forward-reaching posture, moving across the steppe in mechanical five-foot hops. It wears its weathered funerary riding clothes, leather boots, and a fur hat, with its grey-black skin stretched tightly over bone. Its face is locked in a silent scream, with milky eyes containing a trapped, desperate intelligence, while a yellowed ritual paper talisman flutters continuously over its forehead.",
      "habitat": "They wander the open plains and migration routes of the Sundrift Vale, originating from ancient Ancestor-Mounds.",
      "depth": "This hopping corpse is completely blind and deaf but detects the breath of living creatures. If players hold their breath (requiring a Constitution check each round), the Jiangshi will hop right past them. If they breathe, it immediately attacks."
    },
    {
      "id": "taotie_gorge",
      "name": "Taotie-Gorge",
      "description": "An insatiable, fifteen-foot monstrosity that is almost entirely jaws, blending into the high grass to act as a living pit-trap for migrating herds.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "taotie_gorge",
        "elemental"
      ],
      "tokenIcon": "Bestiary/taotie_gorge",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 22,
        "agility": 12,
        "constitution": 20,
        "intelligence": 4,
        "spirit": 8,
        "charisma": 6,
        "maxHp": 685,
        "currentHp": 685,
        "maxMana": 0,
        "currentMana": 0,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 25,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 75,
        "cold": 25,
        "psychic": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Spiral-Teeth",
          "description": "+7 to hit, 3d8+5 piercing — concentric rings of teeth designed to strip flesh from bone with maximum efficiency",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+5"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Taotie-Gorge is the physical manifestation of insatiable greed and limitless consumption, blending the Chinese bronze-mask fiend Taotie with the Boq, the monstrous pack-hunting wolf-spirit of Turkic legend. It represents the terror of sudden, absolute erasure beneath the grass.",
      "nature": "This fifteen-foot creature is essentially a massive, walking maw supported by stubby, powerful legs, completely lacking a distinct head or tail. Its hide is the dull yellow of dried steppe-grass, rendering it invisible in the high plains. Within its yawning mouth are concentric, spiraling rings of needle-sharp teeth, and its vestigial, red-glowing eyes are buried deep within the gullet, expressing nothing but a permanent, ravenous hunger.",
      "habitat": "It hides within the tall grasses and narrow gorges of the Sundrift Vale.",
      "depth": "Taotie-Gorges bury themselves in the soil and open their mouths to form natural-looking pit-traps, swallowing entire sections of migrating Ordan herds. They hunt cooperatively in packs, lining up to create barriers of hidden maws, then emerging to run down the survivors with surprising speed. Nomads must set fire to the steppe-grass to reveal the buried mouths before the herd arrives. They frequently hire scouts to clear out the beasts before their herds pass through."
    },
    {
      "id": "baize",
      "name": "Baize",
      "description": "A wise, nine-eyed bovine oracle with a human face and a crown of horns, appearing as a herald of major shifts in the world.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "baize",
        "beast"
      ],
      "tokenIcon": "Bestiary/baize",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 12,
        "constitution": 14,
        "intelligence": 18,
        "spirit": 18,
        "charisma": 16,
        "maxHp": 220,
        "currentHp": 220,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "psychic": 100,
        "radiant": 50
      },
      "vulnerabilities": {
        "psychic": 25
      },
      "abilities": [
        {
          "name": "Nine-Eye-Gaze",
          "description": "each eye emits a different colored beam; +5 to hit, 1d6 of the eye's element",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Baize is derived from the Chinese Bai Ze, who detailed the nature of all spirits to the Yellow Emperor, and the Ayaas, the speaking wise-beasts of Mongolian folklore. It serves as a guardian of knowledge, keeping the ledger of the world's supernatural fauna.",
      "nature": "Resembling a large, yak-sized bovine with a coat of luminous, snow-white fur, this creature bears a crown of six crystalline horns and nine multi-colored eyes scattered across its flanks and head. Its face is remarkably human, featuring a gentle, knowing smile and deep brown eyes filled with compassion. As it walks, its hooves leave glowing prints that outline safe paths, while its nine eyes glow softly to cast a prismatic halo around its body.",
      "habitat": "It wanders the remote ridges and sacred valleys of the Sundrift Vale.",
      "depth": "The Baize acts as a living bestiary, speaking in a calm, measured voice to share its absolute knowledge of the Vale's creatures and their weaknesses. Its appearance is a rare omen that precedes major events like Wyrd-storms or shifts in the migration, with the alignment and colors of its blinking eyes serving as a complex divination system that shamans study. Nomads and scholars seek it out to decipher future trials or to obtain its guidance in navigating the dangerous ecosystem."
    },
    {
      "id": "zilant_wing",
      "name": "Zilant-Wing",
      "description": "A massive, winged serpent-dragon with a rooster's head, whose wings hum with a musical resonance that guides travelers through the starless nights.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "zilant_wing",
        "elemental"
      ],
      "tokenIcon": "Bestiary/zilant_wing",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 18,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 170,
        "currentHp": 170,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "fire": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Beak-Slam",
          "description": "+5 to hit, 2d6+3 piercing",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Zilant-Wing traces its ancestry to the winged serpent Zilant of Tatar lore, a guardian of cities, and the Teng dragon of Chinese myth that rides the clouds. In the Vale, it represents the protective aspect of the skies, patrolling the boundary between the living and the ancestral dead.",
      "nature": "This thirty-foot serpentine dragon is covered in golden-brown scales and propelled by forty-foot, leathery wings whose veins mimic Ordan throat-singing notation. It possesses a rooster-like head crowned with a crimson comb and wattles, with a sharp beak lined with bony plates instead of teeth. Its golden, round eyes burn with a predatory, avian focus tempered by a cold, reptilian intelligence.",
      "habitat": "It spends its life riding the high winds of the Sundrift Vale, nesting on the summits of the Ancestor-Mounds.",
      "depth": "As the Zilant-Wing glides on thermal currents, the wind rushing through its wings generates a unique, singing pitch that Ordan nomads use to navigate the darkened plains. They are revered as guardians of the Ancestor-Mounds, keeping grave-robbers and Wyrd-rot at bay and ensuring that no dead rise as Jiangshi. A Zilant nesting on a clan's mound is seen as the ultimate sign of ancestral favor, and their presence serves as a deterrent to rival raiders and predatory Qiongqi."
    },
    {
      "id": "susulu_spring",
      "name": "Susulu-Spring",
      "description": "A translucent, seven-foot-tall water spirit who guards the rare springs of the steppe and fosters tiny, purifying river-dragons.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "susulu_spring",
        "elemental"
      ],
      "tokenIcon": "Bestiary/susulu_spring",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 14,
        "agility": 14,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "cold": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Bull-Horn",
          "description": "+5 to hit, 2d6+4 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Susulu-Spring is born of the Su Iyeleri, the protective female water-spirits of Turkic folklore, and Longmu, the Chinese mother of dragons. She represents the nurturing and defensive aspects of water, guarding the lifeblood of the arid steppe.",
      "nature": "Appearing as a seven-foot-tall woman composed of semi-transparent, blue-green water, she wears a gown of woven river-weeds and duck feathers. Her hair flows outward like a continuous fountain, and tiny, golden-green dragon-shapes swim through her fluid limbs. Her face is usually a portrait of motherly warmth, with sandy-colored eyes and round cheeks, though it hardens into the slate-grey of a flash flood when her waters are threatened.",
      "habitat": "She is bound to the oases, deep wells, and freshwater springs of the Sundrift Vale.",
      "depth": "A Susulu-Spring ensures the purity and abundance of her water source, raising tiny dragons that swim through the aquifers to filter out toxins. The Ordan nomads bring their sick to her waters for healing, exchanging milk and silk for the life-extending liquid she guards. Harming her spring or polluting its waters invites a devastating curse of drought and disease, making the preservation of these sites a vital duty for travelers."
    },
    {
      "id": "dijiang_chaos",
      "name": "Dijiang-Chaos",
      "description": "A faceless, crimson sac with six legs and four wings that sings in beautiful harmonies, feeding on chaos to restore order to the land.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "dijiang_chaos",
        "elemental"
      ],
      "tokenIcon": "Bestiary/dijiang_chaos",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 16,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 265,
        "currentHp": 265,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 40,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "lightning": 100,
        "fire": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Chain-Serpent",
          "description": "+6 to hit, 2d8+4 lightning",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Dijiang-Chaos represents the primordial state of creation, drawing from the faceless, singing bag-spirit Dijiang of Chinese myth and the Bura, the wild, chaotic force of the Turkic steppes. It is a creature of raw, ungoverned natural law that exists outside conventional anatomy.",
      "nature": "This entity is a six-foot-wide crimson sac of warm, smooth tissue resembling exposed muscle, with six stubby legs and four membranous wings that beat in a steady hum. It has no head, face, or sensory organs, yet it is fully aware and communicative, dancing in complex mathematical patterns that leave geometric trails in the steppe-grass. Its lack of features is its most alien aspect, yet it projects a peaceful, throat-singing resonance.",
      "habitat": "It wanders the windswept plains and valleys of the Sundrift Vale, seeking areas recently scarred by storms or violence.",
      "depth": "Drawn to sites of recent chaos—such as ruined camps or Wyrd-shattered lands—the Dijiang-Chaos feeds on the residual energy of disorder before dancing to weave stabilizing runes into the ground. Its multi-tonal, harmonious song induces ego-dissolution in listeners, connecting them to the deep ecology of the steppe. Ordan shamans seek out these creatures to sit in their presence for spiritual visions, though their strange nature makes them a source of both wonder and alarm for travelers."
    },
    {
      "id": "fenghuang_migrate",
      "name": "Fenghuang-Migrate",
      "description": "A legendary, twenty-foot bird of elemental plumage whose arrival dictates the migration calendar and blesses harmonious communities.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "fenghuang_migrate",
        "elemental"
      ],
      "tokenIcon": "Bestiary/fenghuang_migrate",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "cold": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Fenghuang-Migrate merges the virtues of the Chinese phoenix Fenghuang, which heralds cosmic harmony, with the Mongolian Khongorzul sun-bird that flies ahead of the changing seasons. It serves as a living standard of moral and environmental balance, appearing only when the world is in alignment.",
      "nature": "This magnificent bird boasts a twenty-foot wingspan covered in elemental, color-banded feathers and a twelve-foot cascade of iridescent tail plumage. Its crest is a crown of cold, golden flame, and its noble face features a jade beak and prismatic, multi-colored eyes that project absolute serenity. When it takes flight, the air around it is perfumed with the scent of fresh rain, pine resin, and sweet steppe-grass.",
      "habitat": "It nests on the highest mountain peaks and flies across the skies of the Sundrift Vale.",
      "depth": "The Fenghuang-Migrate is an infallible harbinger of seasonal change, guiding the Ordan nomads' migrations as it travels. It only lands in settlements where perfect harmony and respect for elders are maintained, validating the clan's leadership and shedding a single feather capable of purifying water, curing illness, and warding off Wyrd-rot. Because these feathers are of immense spiritual and practical value, they are fiercely guarded, occasionally sparking conflicts between clans desperate for their blessing."
    },
    {
      "id": "qiongqi_scourge",
      "name": "Qiongqi-Scourge",
      "description": "A tattered, blood-furred winged tiger with boar tusks that preys upon the virtuous while protecting the wicked.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "qiongqi_scourge",
        "beast"
      ],
      "tokenIcon": "Bestiary/qiongqi_scourge",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 8,
        "agility": 18,
        "constitution": 10,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 8,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 10,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Vigilante-Peck",
          "description": "+4 to hit, 1d6+2 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+2"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Qiongqi-Scourge combines the Chinese fiend Qiongqi, which inverts human justice, with the Dalan-Turul, a horse-devouring raptor of Turkic creation myth. It represents the cruel caprice of the sky and the spiritual corruption that targets the innocent.",
      "nature": "This lion-sized beast is a grotesque fusion of tiger and eagle, featuring tattered, leathery wings and coarse fur the color of dried blood. Its body is covered in stripes that are actually thick battle scars, and a rattle of human finger-bones hangs around its neck. Its face is a malicious caricature of a tiger, split by a massive mouth, narrowed sulfur-yellow eyes, and curved, yellowed tusks that frame its flat snout.",
      "habitat": "It stalks the skies and rugged crags of the Sundrift Vale.",
      "depth": "Drawn to the moral state of mortals, the Qiongqi-Scourge actively harasses honest, industrious camps while leaving raiders and oath-breakers unmolested, forcing the Ordan to feign dishonesty for survival. It swoops down from the clouds to carry off prize stallions, devastating the nomads' herds. The only reliable defense against its cruelty is the territorial presence of a Zilant-Wing, which will drive the beast away, though adventurers are often contracted to hunt it down to save a targeted community."
    },
    {
      "id": "zhenniao_toxin",
      "name": "Zhenniao-Toxin",
      "description": "A toxic vulture-like bird whose oil-slick feathers and acidic tears rot the land, creating sterile dead-zones wherever it nests.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "zhenniao_toxin",
        "elemental"
      ],
      "tokenIcon": "Bestiary/zhenniao_toxin",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 18,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 135,
        "currentHp": 135,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50,
        "cold": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Breath-Steal",
          "description": "+5 to hit, 2d6+3 psychic — steals a breath, DC 14 CON or suffocating for 1 round",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Zhenniao-Toxin derives from the legendary Chinese poison-bird Zhenniao, whose very bathwaters brought death, and Umai, the Turkic death-spirit associated with silent, wind-borne venom. It embodies the invisible, creeping death that haunts the steppe.",
      "nature": "This vulture-like bird has an eight-foot wingspan of iridescent, purple-black feathers coated in a glistening, toxic oil that creates a dim purple haze in the air. Its massive, hooked beak drips a corrosive fluid that hisses upon contact with stone, and its talons burn scorch marks into rock. Its nightmarish face is dominated by spiny feathers and solid, featureless black eyes that constantly weep a thick purple venom.",
      "habitat": "It nests in isolated rocky spires and crags across the Sundrift Vale.",
      "depth": "The nesting sites of the Zhenniao-Toxin are marked by withered, purple-tinged grass and poisoned soil where no animal can drink or graze. Nomads harvest the bird's toxic tears and feathers using heavy leather protective suits, distilling them into lethal poisons that serve as both deterrents and tools in inter-clan blood feuds. While they are an ecological blight, the value of their venom makes them a lucrative, if incredibly hazardous, target for daring trackers."
    },
    {
      "id": "ubagan_crystal",
      "name": "Ubagan-Crystal",
      "description": "A towering, four-armed ape of living crystal that emerges from subterranean fissures, capable of shifting aquifers and refracting brilliant spectrums of light.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "ubagan_crystal",
        "construct"
      ],
      "tokenIcon": "Bestiary/ubagan_crystal",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 12,
        "constitution": 16,
        "intelligence": 6,
        "spirit": 12,
        "charisma": 6,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 25,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Mud-Grasp",
          "description": "+5 to hit, 2d6+3 bludgeoning + DC 13 AGI or grappled",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ubagan-Crystal draws its roots from the Ubagan subterranean spirits of Turkic lore and Wuzhiqi, the stone-headed water demon of Chinese legend. It represents the ancient geological secrets and the raw tectonic power hidden beneath the grass.",
      "nature": "This ten-foot-tall, four-armed ape-like creature is formed entirely of translucent crystal, exposing pulsing, mineral-rich veins within its core. Its body refracts light into brilliant rainbow spectrums, while its small, stone-like head resembles a carved gem. Its face features twin points of glowing Astril-light for eyes and a narrow seam that serves as a mouth, while its four hands end in chisel-like fingers capable of molding stone.",
      "habitat": "It resides in deep cave systems and subterranean fissures beneath the Sundrift Vale.",
      "depth": "Drawn to the surface by the Monolith's resonance and the constellation-light of the Astril, the Ubagan-Crystal is capable of rearranging underground water-channels, which can either secure a clan's water supply or dry up their wells overnight. Nomads use crystal-vibration rituals to communicate with them, offering rare gems to ensure the safety of their springs. Adventurers are often hired to negotiate with these tectonic giants or retrieve shards of their bodies to study their geological magic."
    },
    {
      "id": "qoraigarash",
      "name": "Qoraigarash",
      "description": "A forty-foot aquatic dragon covered in semi-precious stones, guarding the bottomless lakes and rising to summon fierce storms.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "qoraigarash",
        "construct"
      ],
      "tokenIcon": "Bestiary/qoraigarash",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 14,
        "constitution": 18,
        "intelligence": 12,
        "spirit": 14,
        "charisma": 10,
        "maxHp": 390,
        "currentHp": 390,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 50,
        "cold": 50,
        "lightning": 50
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Dragon-Bite",
          "description": "+6 to hit, 2d8+5 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Qoraigarash traces its origin to the Khyargas sea-monster of Mongolian folklore and the storm-generating Jiaolong water-dragon of China. It embodies the deep, unpredictable treasures and dangers of the steppe's subterranean water networks.",
      "nature": "This forty-foot serpentine dragon is covered in interlocking scales of jade, agate, carnelian, and turquoise, reflecting even the faintest light in a shimmering, rainbow pattern. It has a liquid crystal mane, antlers of polished white jade, and massive eyes like polished jade spheres that pierce the dark. Its elegant, ancient face and beard of thin crystalline filaments carry the quiet majesty of a creature that has witnessed millennia of history.",
      "habitat": "It dwells in the bottomless lakes and flooded cavern systems of the Sundrift Vale.",
      "depth": "The Qoraigarash sheds its precious gemstone-scales annually, prompting desperate Ordan divers to search the freezing lake beds to collect them for trade. When disturbed, it coils through the waters to create massive whirlpools that can drain surrounding marshes or trigger localized flash floods and storms. Nomads lower polished copper mirrors into the depths as offerings to soothe the dragon, while hunters seek them out for their legendary treasures or to avert aquatic disasters."
    },
    {
      "id": "ajina",
      "name": "Ajina",
      "description": "A towering entity of living shadow and absolute darkness that stalks the high steppe-grass, sowing nightmares and rot.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "ajina",
        "beast"
      ],
      "tokenIcon": "Bestiary/ajina",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 14,
        "agility": 18,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 16,
        "charisma": 12,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 75,
        "cold": 50,
        "psychic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Entropy-Wounds",
          "description": "+6 to hit, 2d6+3 necrotic — wounds fester with entropy, dealing 1d6 necrotic per round for 3 rounds",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Ajina is born of the hairy, traveler-hunting Albasti demon of Central Asian folklore combined with Hundun, the faceless Chinese embodiment of primordial chaos. She represents the terror of the dark, formless void that waits beyond the boundary of the campfire.",
      "nature": "This eight-foot-tall, towering figure is composed of light-absorbing darkness that seems perpetually on the verge of dissolution. Long shadow-appendages resembling pendulous breasts drape down, whispering in multiple soft voices, while her hair is a spreading pool of living darkness that decays the grass it touches. Her face shifts constantly between a beautiful woman, a bare skull, and an empty void, anchored only by twin eyes of absolute, gravity-like darkness.",
      "habitat": "She haunts the deepest, tallest grass fields and unlit hollows of the Sundrift Vale.",
      "depth": "Stalking the high steppe-grass, the Ajina strikes from the darkness with entropic claws that leave slow-festering wounds, dissolving back into shadow before she can be targeted. Survivors of her attacks are cursed with permanent, sanity-draining nightmares of the pre-cosmic void, though the Astril Unlit remain immune due to their lack of light. Travelers must take great care when traversing the high grasses, often hiring guides who know how to detect her whispering approach."
    },
    {
      "id": "lu_wu_mountain",
      "name": "Lu-Wu Mountain",
      "description": "A mammoth-sized tiger with nine human heads and a serpent's tail, governing the seasons and the migrations of the steppe.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "lu_wu_mountain",
        "beast"
      ],
      "tokenIcon": "Bestiary/lu_wu_mountain",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 22,
        "agility": 10,
        "constitution": 22,
        "intelligence": 18,
        "spirit": 20,
        "charisma": 14,
        "maxHp": 835,
        "currentHp": 835,
        "maxMana": 80,
        "currentMana": 80,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 2,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 75,
        "cold": 100,
        "fire": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Tiger-Claw",
          "description": "+8 to hit, 3d8+6 bludgeoning",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+6"
            }
          ]
        },
        {
          "name": "Serpent-Tail",
          "description": "reach 15 ft, +6 to hit, 2d6+4 bludgeoning + DC 15 CON or poisoned 3 rounds",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Lu-Wu Mountain combines the Chinese mountain-guardian Lu Wu of the Kunlun range with Kerey-Khan, the sovereign mountain spirit-lord of Mongolian myth. It represents the absolute authority of the peaks and the delicate balance of the seasons.",
      "nature": "This mammoth-sized beast features the amber-striped body of a great tiger, a thick serpent tail covered in chiming crystalline scales, and nine human heads clustered along its neck. Each head displays a distinct expression of human emotion—ranging from serene to furious, weeping to silent—symbolizing the nine aspects of mountain awareness. The primary central head is that of a white-bearded elder whose eyes burn with the light of molten gold.",
      "habitat": "It dwells in the highest, snow-draped peaks and rocky valleys of the Sundrift Vale.",
      "depth": "By turning its various heads toward the valleys, the Lu-Wu Mountain governs the micro-seasons of the Vale, dictating patterns of rain, wind, heat, or frost. It also holds dominion over the migrations of the great woolly herds, steering them away from clans that offend the land or overhunt. The Ordan appease this mighty arbiter through complex throat-sung hymns, and they will go to great lengths to prevent hunters from provoking the beast's wrath."
    },
    {
      "id": "bura_stormkin",
      "name": "Bura-Stormkin",
      "description": "A seven-foot-tall spirit of swirling dust and wind, drawn to broken oaths and capable of tearing down shelters with terrifying speed.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "sundrift",
        "bura_stormkin",
        "elemental"
      ],
      "tokenIcon": "Bestiary/bura_stormkin",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 14,
        "agility": 18,
        "constitution": 14,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 10,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 100,
        "cold": 50,
        "lightning": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Bura-Stormkin is the physical embodiment of the flesh-stripping steppe-winds of Turkic folklore and Feng Bo, the Chinese wind deity who delivers heavenly retribution. Twisted by the Wyrd, it serves as a relentless enforcer of mortal integrity and natural fury.",
      "nature": "Standing seven feet tall, this humanoid presence is composed entirely of compressed, spinning air and windswept debris like dead grass and pebbles. Its only solid part is a central, electric-blue heart of compressed air. Its face forms and dissolves constantly within the dust, hardening into the hollow-cheeked visage of an old man with eyes that are screaming circles of rushing air when it targets its prey.",
      "habitat": "It manifests during the fierce storms that sweep across the Sundrift Vale.",
      "depth": "Bura-Stormkin ride the steppe gales, dismantling yurts and shelters with surgical precision to leave victims exposed to the elements. They are drawn to the spiritual rot of broken promises, relentlessly pursuing oath-breakers across the plains until their word is fulfilled or they perish of exposure. Nomads must dig underground shelters to escape their wrath, and they will hire adventurers to appease or defeat these spirits when an oath-breaking crisis threatens the community."
    },
    {
      "id": "tengri_spark",
      "name": "Tengri-Spark",
      "description": "A tiny, six-inch guide of pure starlight, trailing a thread of fate that connects the world below to the lost stars.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "sundrift",
        "tengri_spark",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/tengri_spark",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 2,
        "agility": 20,
        "constitution": 6,
        "intelligence": 16,
        "spirit": 22,
        "charisma": 20,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 5,
        "speed": 10,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "radiant": 100,
        "psychic": 100,
        "fire": 50
      },
      "vulnerabilities": {
        "necrotic": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Tengri-Spark is a physical shard of the supreme Mongolian sky-god Tengri, combined with the fate-weaving authority of Dou Mu, the Chinese Mother of the Dipper. It represents the last remaining light of a sky that has been bargained away.",
      "nature": "This tiny, six-inch humanoid figure is composed of pure starlight, glowing with a warm, golden-white brilliance that can be seen across the dark steppe. Its body is formed from nine interlocking rings of light representing the stars of the Big Dipper, trailing a fine, silk-like thread from its back. Its featureless, glowing face is locked in a serene expression of absolute compassion and peace.",
      "habitat": "It wanders the vast, dark grasslands of the Sundrift Vale, appearing unpredictably.",
      "depth": "As a living fragment of the lost heavens, the Tengri-Spark appears to travelers in moments of utter despair, its light restoring hope and the will to live. The trailing thread connects it directly to the constellations that House Ordavan traded away, allowing shamans to read the alignment of the thread to divine destinies. The Astril hold these sparks in absolute reverence, defending them from any who would capture them or seek to exploit their celestial connection."
    },
    {
      "id": "leshara",
      "name": "Leshara",
      "description": "A towering guardian of the wood, the Leshara stands twelve feet tall, a living monument of bark, moss, and fungi bound with simian grace.",
      "type": CREATURE_TYPES.PLANT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "leshara",
        "plant"
      ],
      "tokenIcon": "Bestiary/leshara",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 16,
        "constitution": 18,
        "intelligence": 16,
        "spirit": 20,
        "charisma": 12,
        "maxHp": 330,
        "currentHp": 330,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 75,
        "lightning": 100,
        "fire": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Stone-Fling",
          "description": "+7 to hit, 3d8+5 bludgeoning — hurls blocks of quarried stone from the ground as siege weapons",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+5"
            }
          ]
        },
        {
          "name": "Thunderbolt-Fury",
          "description": "+6 to hit, 2d6+4 lightning, DC 14 AGI or knocked prone",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "agility",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Leshara shares the heritage of Slavic woodland lords who shift in size and lead travelers astray, combined with the intelligent, devoted Vanara of Vedic myth who once moved mountains and built bridges. In the setting of Mythrill, this ancient creature serves as both a loyal warden of the wild and a mischievous trickster, guarding the secrets of the deep forests from those who would exploit them.",
      "nature": "Standing twelve feet tall, this towering figure has a body composed of living wood, moss, and bark, with its left side coated in blue-green lichen and its right in red-tinged fungi. From its spine extends a long, prehensile tail ending in a cluster of roots, while its skin consists of bark that continuously grows and sheds, scattering leaves and flakes along its path. A beard woven of moss and peat-vine frames a wood-carved face with bushy eyebrows, piercing green eyes that reflect the entire forest ecosystem, a grin of polished stone teeth, and a third eye of amber pine-resin blinking slowly from its forehead, all while it carries a staff of living branch-wood that sprouts roots wherever it strikes.",
      "habitat": "This grand woodland entity resides in the deep, primeval reaches of the Bryngloom Forest terrain.",
      "depth": "Shifts trees and roots to make travelers walk in circles. The only way to break its illusion is to wear your coat inside-out and walk backward; this amuses the Leshara, who will laugh (sounding like rustling leaves) and reveal the true path."
    },
    {
      "id": "rusalka",
      "name": "Rusalka",
      "description": "A mesmerizing water-nymph of the bogs, the Rusalka lures the unwary with a melancholy smile and a comb carved of bone.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "rusalka",
        "elemental"
      ],
      "tokenIcon": "Bestiary/rusalka",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 16,
        "charisma": 12,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "cold": 50,
        "necrotic": 100,
        "psychic": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Shroud-Wrap",
          "description": "+5 to hit, 1d6+3 necrotic + DC 14 CON or paralyzed, wrapped in shroud",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Rusalka is born of the sorrow of drowned women in Slavic folklore, dangerous temptresses who lured men to watery graves, merged with the shape-shifting, divine Apsaras of Vedic myth who danced in celestial waters. In the misty Bryngloom Forest, they embody both the tragedy of untimely death and the mystical allure of watery transformation.",
      "nature": "Standing waist-deep in bog-pools, this six-foot-tall woman has skin the pale green of submerged moss and impossibly long duckweed-colored hair that floats in a perfect circle on the water. Her form is semi-translucent below the surface, revealing ancient bones, roots, and peat-layers underneath, while water drops fall continuously from her fingertips, each capturing a miniature image of drowning. Her heartbreakingly beautiful face is marked by high cheekbones, a melancholy smile, and large, bog-water eyes with vertical, reptilian pupils that contract when she spots her prey.",
      "habitat": "This mournful spirit dwells in the swampy pools of the Bryngloom Forest terrain.",
      "depth": "During the dry season, the Rusalka leaves her pool to dance in peat-clearings, casting a hypnotic lure that forces anyone who watches to join until their hearts burst, a compulsion that can only be broken by wearing one's clothes inside-out. Those who seek her out often do so for her bone-comb, which can untangle any physical or metaphorical knot, offering Neth contract-mages a way to resolve impossible legal disputes at the cost of a year of their memories. Adventurers may be hired to retrieve these memories or to hunt the creature down when reports of her deadly dances surface near local settlements."
    },
    {
      "id": "strigoi_canopy",
      "name": "Strigoi-Canopy",
      "description": "Hanging silently from the highest branches, the Strigoi-Canopy is a winged corpse-spirit that feeds on the life force of travelers.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "strigoi_canopy",
        "undead"
      ],
      "tokenIcon": "Bestiary/strigoi_canopy",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 22,
        "agility": 10,
        "constitution": 22,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 8,
        "maxHp": 395,
        "currentHp": 395,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 2,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 75,
        "cold": 50,
        "necrotic": 50
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Tree-Strike",
          "description": "+7 to hit, 2d8+6 bludgeoning — strikes with the force of a falling cedar",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+6"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Strigoi-Canopy arises from the Romanian Strigoi, a reanimated vampire and former sorcerer, combined with the Vetala of Hindu lore, which inhabited corpses and hung upside-down from trees to torment travelers with riddles. In the heights of Mythrill, this creature haunts the upper canopy, combining physical terror with ancient, dark intelligence.",
      "nature": "This desiccated humanoid hangs upside-down by its feet from branches, its skin the grey-white of birch-bark stretched over skeletal bone. Enormous, leathery wings fold against its arms, while its hands and feet end in elongated prehensile digits with hook-like claws. A faint green phosphorescence glows from its empty eye-sockets, and its jaw is dislocated to hide a long, uncoiling proboscis-like tongue, set in a face frozen in a grin of yellowed, crowded fangs.",
      "habitat": "This winged undead threat makes its home in the high branches of the Bryngloom Forest terrain.",
      "depth": "Dwelling in colonies high in the ironwoods, the Strigoi-Canopy drops onto travelers to drain their vitality, leaving victims as listless husks. If captured, this cunning spirit will answer questions of the past and future but only through riddle-stories; failure to solve them summons its pack, though Neth Kessen weavers often brave these encounters using probability-sight to unlock the Strigoi's dark knowledge. Adventurers may be hired to clear these canopy pests or retrieve components from their wings."
    },
    {
      "id": "domovoi",
      "name": "Domovoi",
      "description": "A two-foot-tall hairy guardian of the hearth, the Domovoi keeps careful watch over households and records the deeds of their inhabitants.",
      "type": CREATURE_TYPES.HUMANOID,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "domovoi",
        "humanoid"
      ],
      "tokenIcon": "Bestiary/domovoi",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 20,
        "agility": 12,
        "constitution": 20,
        "intelligence": 18,
        "spirit": 18,
        "charisma": 16,
        "maxHp": 350,
        "currentHp": 350,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 50,
        "lightning": 50,
        "radiant": 50
      },
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Domovoi is descended from the Slavic domestic spirit that guarded homes in exchange for offerings, merged with the Ganas of Vedic myth, Shiva's dwarfish, bureaucrat attendants who guarded sacred thresholds. In the Bryngloom, they watch over the dwellings of Mythrill, acting as cosmic auditors of those under their roof.",
      "nature": "Standing only two feet tall, this densely hairy humanoid looks like a living wool coat, with thick grey-brown fur covering its body except for its reptilian-scaled face, hands, and feet. It wears a tiny apron of Neth silver-thread and carries a miniature ledger of contract-tablets. Its face is that of a wrinkled old man on a child's body, complete with a magnificent mustache and bushy eyebrows that frame beady, watchful black eyes.",
      "habitat": "This protective house-spirit resides near Neth, Morren, and Vreken dwellings throughout the Bryngloom Forest terrain.",
      "depth": "A tiny household protector living under floorboards. If players stay in a house guarded by a Domovoi, they must follow its 'house rules' (e.g., no boots indoors, don't sweep after sunset). If they break a rule, the Domovoi hides their boots or spoils their rations. If respected, it polishes their weapons."
    },
    {
      "id": "kikimora",
      "name": "Kikimora",
      "description": "A gaunt, multi-fingered spirit who spins webs of illusion, the Kikimora tangles truth and contracts alike under the cover of night.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "kikimora",
        "fey"
      ],
      "tokenIcon": "Bestiary/kikimora",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 14,
        "agility": 16,
        "constitution": 14,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 155,
        "currentHp": 155,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "poison": 75,
        "cold": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Venom-Spray",
          "description": "+5 to hit, 2d6+3 poison, DC 14 CON or paralyzed 3 rounds",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+3"
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
        },
        {
          "name": "Scorpion-Tail",
          "description": "+5 to hit, 1d8+3 piercing + DC 14 CON or poisoned 1 round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d8+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Kikimora combines the Slavic Kikimora, a household spinner who nested behind stoves to tangle yarn and make mischief, with the Vedic concept of Jyotisha-Maya, the cosmic web of illusion that hides the unity of reality. In Mythrill's damp forests, she spins these illusions into physical threads that wrap around the minds and documents of mortals.",
      "nature": "Standing five feet tall, this gaunt woman has mottled bark-like skin and twelve-fingered hands tipped with spinning-hooks. She is surrounded by a web of near-invisible silk that only sparkles when catching moisture, and she wears a dress of woven spider-silk that shifts color with her mood. Her narrow, pinched face features a hooked nose, thin lips, and large, multi-faceted spider-like eyes, accompanied by a continuous tuneless humming that brings on deep drowsiness.",
      "habitat": "This elusive spinner makes her home in dark corners and households across the Bryngloom Forest terrain.",
      "depth": "She spins dust and cobwebs into beautiful garments. If a player wears one of her garments, they gain charisma but see the world through a shifting illusion, making friendly NPCs look like monsters. She will exchange these garments for a handful of silver needles."
    },
    {
      "id": "zmey_bog",
      "name": "Zmey-Bog",
      "description": "A massive three-headed dragon of the swamp, the Zmey-Bog hoards lost contracts and demands legal tribute from the canopy-dwellers.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "zmey_bog",
        "elemental"
      ],
      "tokenIcon": "Bestiary/zmey_bog",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "necrotic": 50,
        "cold": 50,
        "psychic": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Fever-Touch",
          "description": "+5 to hit, 1d6+3 necrotic + DC 14 CON or gain 1 level of exhaustion — the target feels the fever of its own death",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+3"
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
        },
        {
          "name": "Spirit-Drain",
          "description": "+5 to hit, 2d6+3 psychic — drains willpower, DC 14 CON or fatigued for 8 hours",
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Zmey-Bog merges the legendary three-headed, fire-breathing Slavic dragon Zmey Gorynych with the Makara, a composite Hindu sea-monster representing Varuna's watery domain. Anchored in the deep peat-marshes of Mythrill, this creature acts as an ancient guardian of sunken secrets and lost documents.",
      "nature": "This thirty-foot serpentine dragon features a body of mud-caked crocodile hide and fish scales, ending in a peacock-like tail capable of fanning poison-gas and iron claws forged of actual metal on its feet. Its three heads are colored red, green, and blue, breathing fire, poison, and water respectively. Each head has a unique disposition—feral, sly, and serene—yet all three share the same ancient golden eyes that remember everything with merciless clarity.",
      "habitat": "This swamp-dwelling beast hides in the deepest, muddiest pools of the Bryngloom Forest terrain.",
      "depth": "The Zmey-Bog hoards stolen legal documents, including Neth First Contract fragments and Vreken burial charters, in its inaccessible bog-pools. To prevent the dragon from tearing down the branch-walkways of Atropolis, the Neth are forced to pay a tribute of one contract-scroll per decade, presenting a rich target for adventurers hired to recover lost archives or defend the canopy city from the beast's wrath."
    },
    {
      "id": "zharptitsa_glow",
      "name": "Zharptitsa-Glow",
      "description": "A grand, luminescent sun-bird of the canopy, the Zharptitsa-Glow radiates warmth and a golden light that repels serpents.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "zharptitsa_glow",
        "elemental"
      ],
      "tokenIcon": "Bestiary/zharptitsa_glow",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 16,
        "constitution": 16,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 180,
        "currentHp": 180,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Bite-Force",
          "description": "+6 to hit, 2d8+5 piercing — jaw strength exceeds its size",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Zharptitsa-Glow draws its heritage from the Slavic Firebird, whose dazzling, glowing feathers illuminated the dark in classic fairy tales, and Garuda, the divine sun-bird of Vedic myth who served as Vishnu's mount and the eternal enemy of serpents. In Mythrill, it stands as a majestic beacon of warmth and light in the high branches.",
      "nature": "With a massive thirty-foot wingspan, this bird has plumage of gold, amber, and deep crimson that pulses with a warm, golden luminescence matching its heartbeat. Each of its feathers remains permanently luminescent for decades after being shed, and its body radiates comforting heat in a twenty-foot radius to cut through the damp cold of the forest. Its face is an eagle's of overwhelming majesty, featuring a hooked beak of polished gold and intense, star-like eyes that project a mixture of fierce authority and divine compassion.",
      "habitat": "This solar avian makes its nests in the high canopy of the Bryngloom Forest terrain.",
      "depth": "Serving as the primary source of light in the dark under-canopy, the Zharptitsa-Glow has its feathers harvested by the Vreken to illuminate their spires and crypts. The bird also acts as a natural Serpent-Slayer, repelling creatures like the Zmey-Bog and the Naga-Root, which leads the Neth to encourage their nesting near archives; however, the creature demands absolute silence, and any sound louder than a whisper will cause it to flee and shed its valuable feathers in panic, sparking high-stakes retrieval missions for adventurers."
    },
    {
      "id": "naga_root",
      "name": "Naga-Root",
      "description": "A massive half-human, half-serpent lord of the deep earth, the Naga-Root controls the life-giving waters that feed the roots of the forest.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "bryngloom",
        "naga_root",
        "elemental"
      ],
      "tokenIcon": "Bestiary/naga_root",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 24,
        "agility": 12,
        "constitution": 24,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 6,
        "maxHp": 440,
        "currentHp": 440,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 15,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "physical": 75,
        "cold": 100,
        "lightning": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Ocean-Maw",
          "description": "+8 to hit, 3d8+6 piercing — a single bite can swallow ships",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+6"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Naga-Root is inspired by the divine serpent-beings of Vedic mythology who guarded waters and subterranean treasures, combined with the deep earth-dwelling aspect of the Slavic dragon Zmey Gorynych. In Mythrill's depths, it acts as a primordial manager of the forest's hydrology and a keeper of buried secrets.",
      "nature": "This forty-foot-long serpent features a powerful humanoid torso and arms emerging from its coiled, scale-covered lower body, with scales the deep green of wet ironwood leaves. A cobra-like hood spreads permanently around its head like an elaborate headdress, topped by a crown of root-fiber and bog-iron, while its eight-digited hands are built for burrowing. Its face is a mix of human and serpent, marked by molten-gold eyes with vertical pupils and a jaw that unhinges to reveal fangs, set in a calm, regal expression.",
      "habitat": "This subterranean ruler crawls through the deepest root-systems of the Bryngloom Forest terrain.",
      "depth": "Ruling the underground as the Root-Lord, the Naga-Root dictates the flow of water through the forest's root-network, deciding which ironwood trees flourish and which wither. He is also the Water-Guardian of the subterranean rivers, requiring the Vreken to petition him with ancient relics and crypt treasures for water rights, judging them with a fair but merciless hand that adventurers might need to influence, bypass, or challenge if water conflicts arise."
    },
    {
      "id": "preta_hollow",
      "name": "Preta-Hollow",
      "description": "A skeletal, tragic specter of insatiable greed, the Preta-Hollow wanders the peat-clearings with a ballooning belly and a pinhole mouth.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "bryngloom",
        "preta_hollow",
        "undead"
      ],
      "tokenIcon": "Bestiary/preta_hollow",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 22,
        "agility": 14,
        "constitution": 20,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 6,
        "maxHp": 375,
        "currentHp": 375,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50,
        "cold": 50,
        "necrotic": 100
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Bone-Cruncher",
          "description": "+7 to hit, 3d8+5 piercing — crushes bones as easily as dry twigs",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "3d8+5"
            }
          ]
        },
        {
          "name": "Venom-Spit",
          "description": "+6 to hit, 2d6+4 poison, DC 15 CON or paralyzed 3 rounds",
          "type": "ranged",
          "icon": "ability_physical_taunt",
          "range": 30,
          "actionPointCost": 2,
          "cooldown": 1,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
            },
            {
              "type": "SAVE",
              "attribute": "constitution",
              "dc": 15,
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Cursed by the insatiable hunger of the Vedic Preta, who paid for their greed in life with bloated bellies and tiny mouths, and the restless Slavic Nav, souls trapped between life and death by violent endings, the Preta-Hollow represents the ultimate cost of unfulfilled obligations. In the setting of Mythrill, they are the tragic remnants of those who died in unresolved debt to the Neth.",
      "nature": "This skeletal humanoid is characterized by an enormously distended belly of translucent skin that holds nothing but absolute darkness, balanced on an impossibly thin neck that supports an oversized head. Its hands are skeletal with grasping fingers, and its body carries the dry, acidic scent of starvation. Its paper-thin skull-face is dominated by hollow eye-sockets burning with grey fire, and its tiny pinhole mouth twitches and gasps continuously in an expression of desperate, pathetic sadness.",
      "habitat": "These tragic spirits wander the misty clearings of the Bryngloom Forest terrain.",
      "depth": "Known as the Insatiable-Dead, Preta-Hollows are the spirits of debtors whose contracts were called by the Keeper of the Last Threshold before they could pay. Their presence acts as a Hunger-Inducer, inflicting painful, unsatisfiable hunger on anyone within twenty feet, rendering food useless. The only release for these spirits is for a living soul to pay off their contract-debts, a transaction that Neth Kessen weavers are willing to facilitate for a steep fee, providing a moral and financial dilemma for adventurers who encounter them or seek to retrieve components from their hollow forms."
    },
    {
      "id": "gamayun_seer",
      "name": "Gamayun-Seer",
      "description": "An oracle of twilight wings and a sorrowful voice, the Gamayun-Seer sings prophecies of the future that are as accurate as they are devastating.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.SMALL,
      "tags": [
        "bryngloom",
        "gamayun_seer",
        "beast"
      ],
      "tokenIcon": "Bestiary/gamayun_seer",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 18,
        "agility": 16,
        "constitution": 18,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 285,
        "currentHp": 285,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 35,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 50,
        "cold": 50,
        "necrotic": 75
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Chains-of-Garmr",
          "description": "+6 to hit, 2d8+4 piercing — each bite tears flesh and bone",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d8+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Gamayun-Seer stems from the prophetic bird of Slavic folklore who held absolute knowledge of past and future, combined with the Kinnara of Vedic mythology, celestial bird-bodied musicians who served as divine messengers. In Mythrill, she flies through the dark canopy, spinning fate into song.",
      "nature": "Having a fifteen-foot wingspan, this large bird possesses the head and upper torso of a beautiful woman, with blue-black twilight plumage that shimmers with bioluminescent fungal-light. She holds a small lute in her talons, playing melodies that can sway ironwood trees and still the waters, while her feathers are structure-bound memory-glass fragments containing visions of the future. Her sorrowful face features dark, time-spanning eyes and full lips that continuously shape prophecy under a heavily lined brow.",
      "habitat": "She roosts high in the branches of the Bryngloom Forest terrain.",
      "depth": "Serving as the Oracle-Bird, she sings complex, allegorical poems detailing the future from the high branches, which Neth Velun arcanists study extensively. Her shed feathers are harvested for their memory-glass prophecies and sold by the Vreken to Neth contract-mages to guide their decisions, though these fortunes always manifest in unexpected and devastating ways, creating opportunities for adventurers hired to retrieve a feather or decipher a riddle of fate."
    },
    {
      "id": "chort_thorn",
      "name": "Chort-Thorn",
      "description": "A horned, goat-legged trickster of the crossroads, the Chort-Thorn offers deceptive bargains and steals the likenesses of loved ones.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "chort_thorn",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/chort_thorn",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 16,
        "agility": 22,
        "constitution": 14,
        "intelligence": 12,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 200,
        "currentHp": 200,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 5,
        "speed": 20,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "physical": 100,
        "necrotic": 50,
        "cold": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Chort-Thorn is born from the Slavic Chort, a goat-like devil associated with crossroads and ironic bargains, and the shape-shifting Rakshasas of Vedic lore, demons who disrupted rituals and took the forms of relatives. In Mythrill's Bryngloom, this entity delights in tempting mortals and complicating their laws.",
      "nature": "Standing seven feet tall, this lean humanoid features goat-legs, curved black horns, and bark-like armor-plating studded with sharp thorns. Living, reaching thorn-vines wrap its body, and a lashing forked tail carries a barbed thorn at each tip, accompanied by the smell of rotting flowers and burnt offerings. Its face combines goat and demonic features, possessing a narrow muzzle, flat teeth, a beard of twisted vine, and solid red eyes that track multiple targets at once.",
      "habitat": "This devious trickster is found lurking at paths and crossroads within the Bryngloom Forest terrain.",
      "depth": "Acting as the Bargain-Devil, the Chort-Thorn offers deals that are technically fulfilled but always turn out ironically disastrous, making bargains with him a sign of desperation, especially for the pathologically honest Neth. He is also a Shape-Stealer who impersonates others to sow chaos, though he always retains a single physical tell like horns or goat-eyes, which Vreken guards are trained to detect. Adventurers might be hired when rumors spread of a Chort-Thorn in the area, or if they need to harvest a component from one."
    },
    {
      "id": "drekavac_wail",
      "name": "Drekavac-Wail",
      "description": "A shifting, screaming spirit of the unfulfilled dead, the Drekavac-Wail haunts the night with a voice that causes physical agony.",
      "type": CREATURE_TYPES.UNDEAD,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "drekavac_wail",
        "undead"
      ],
      "tokenIcon": "Bestiary/drekavac_wail",
      "tokenBorder": "#9b2226",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 16,
        "intelligence": 8,
        "spirit": 12,
        "charisma": 10,
        "maxHp": 160,
        "currentHp": 160,
        "maxMana": 20,
        "currentMana": 20,
        "maxActionPoints": 4,
        "currentActionPoints": 4,
        "initiative": 3,
        "speed": 40,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "fire": 75,
        "poison": 100,
        "cold": 25
      },
      "vulnerabilities": {
        "cold": 25
      },
      "abilities": [
        {
          "name": "Tusk-Gore",
          "description": "+5 to hit, 2d6+4 piercing",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Drekavac-Wail descends from the Slavic Drekavac, a screaming nocturnal horror born from the souls of the unbaptized, and the restless Vedic Bhut, ghosts trapped on earth by their unfulfilled desires. In the marshes of Mythrill, they represent the ultimate despair of unfinished business and broken contracts.",
      "nature": "Defying a stable description, this shape-shifting horror is witnessed as a gaunt humanoid with long limbs, a bird with tattered wings, or a multi-jointed beast. Its body appears as a semi-transparent, shimmering distortion of the air, defined by an enormous, screaming mouth that serves as its entire face—a black void ringed with teeth that look like fangs, feathers, or fingers, reflecting the viewer's death in its depths.",
      "habitat": "This screaming phantom wanders the dark, misty spaces of the Bryngloom Forest terrain.",
      "depth": "As the Night-Screamer, it fills the dark hours with a piercing wail that causes physical pain and heart failure in those who hear it, though the sleepless Neth are immune to its madness. These spirits are the Unfulfilled-Dead, Neth who faded without completing their contract unraveling, their cries expressing the agony of minds trapped between life and non-existence, which only a brave Kessen weaver can quiet by resolving the contract's final clauses. Adventurers may be drawn to investigate when rumors of a wailing spirit spread, or they may need to seek out the Drekavac-Wail to extract a rare component from its remains."
    },
    {
      "id": "bannik_vent",
      "name": "Bannik-Vent",
      "description": "A squat, steam-wreathed elemental of the heating shafts, the Bannik-Vent maintains the heat of the canopy and divines thermal shifts.",
      "type": CREATURE_TYPES.CONSTRUCT,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "bannik_vent",
        "construct"
      ],
      "tokenIcon": "Bestiary/bannik_vent",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 12,
        "agility": 12,
        "constitution": 14,
        "intelligence": 18,
        "spirit": 14,
        "charisma": 10,
        "maxHp": 145,
        "currentHp": 145,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 25,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "psychic": 50,
        "cold": 25
      },
      "vulnerabilities": {
        "fire": 25
      },
      "abilities": [
        {
          "name": "Gold-Touch",
          "description": "+5 to hit, 1d6+3 bludgeoning + DC 14 CON or petrified into gold for 1 round",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+3"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Bannik-Vent traces its lineage to the Slavic Bannik, the bathhouse-spirit who resided behind the sauna stove to pinch bathers and predict the future, combined with the dual creative and destructive aspects of Agni, the Vedic god of fire and divine messenger. In the elevated cities of Mythrill, they are industrial elementals bound to keep the frost at bay.",
      "nature": "Standing four feet tall, this squat, steam-wreathed figure is composed of compressed steam, peat-smoke, and heat-haze. Its hands leave scorch-marks on everything they touch, and it vents superheated steam from its nostrils while carrying a bundle of glowing peat-stones. Its broad, ruddy face is flushed with heat, featuring coal-colored eyes and a wide mouth, carrying the irritable expression of a creature that has been hot for too long.",
      "habitat": "This construct resides within the ventilation shafts of the heating systems in the Bryngloom Forest terrain.",
      "depth": "Living as a Vent-Dweller, the Bannik-Vent is critical to the survival of Atropolis, regulating the Neth's peat-fired heating network to prevent explosions or freezing. He is also a Stone-Diviner, throwing hot peat-stones to predict volcanic and geothermal activity for the Neth's builders, meaning an abandoned vent is a dire omen that adventurers may be recruited to investigate before the system fails, especially if they need a rare elemental component from the creature."
    },
    {
      "id": "psoglav_bone",
      "name": "Psoglav-Bone",
      "description": "An eight-legged predator with iron teeth and a single eye, the Psoglav-Bone stalks the bogs to feed on bone-calcium.",
      "type": CREATURE_TYPES.BEAST,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "psoglav_bone",
        "beast"
      ],
      "tokenIcon": "Bestiary/psoglav_bone",
      "tokenBorder": "#bc6c25",
      "stats": {
        "strength": 4,
        "agility": 20,
        "constitution": 4,
        "intelligence": 12,
        "spirit": 8,
        "charisma": 4,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 10,
        "currentMana": 10,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 5,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {},
      "vulnerabilities": {},
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Psoglav-Bone originates from the Slavic Psoglav, a dog-headed monster with iron teeth and a single eye that devoured travelers, merged with the Sharabha of Vedic myth, Shiva's eight-legged lion-bird avatar powerful enough to subdue demigods. In Mythrill, this beast is a terrifying, heavy-footed predator that bridges the gap between flesh and metal.",
      "nature": "This bull-sized, eight-legged beast combines a lion's body and feathered wings with a dog's head, featuring fangs made of actual corroded iron that grind together with a metallic shriek. Its eight limbs move in complex, spider-like patterns, and its face resembles a dog's skull dominated by a single, enormous forehead eye that glows with cold, blue-white light, set in a merciless grin of protruding iron fangs.",
      "habitat": "This bone-crunching predator hunts across the marshy ground of the Bryngloom Forest terrain.",
      "depth": "Known as the Bone-Eater, the Psoglav-Bone consumes skeletons to metabolize calcium into its iron fangs, leaving infested bogs entirely clear of bones. Its spider-like weight distribution makes it an Eight-Legged-Hunter capable of sprinting across soft peat-bogs where horses would sink, leaving behind telltale tracks of eight aligned prints marked with iron scrapings, presenting a tracking challenge for adventurers who are hired when reports of a sighting spread or when they need to harvest a component from the beast's skeletal form."
    },
    {
      "id": "vourdalak_debt",
      "name": "Vourdalak-Debt",
      "description": "A tragic revenant returned to its family, the Vourdalak-Debt drains the life of its loved ones to sustain its broken contract.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "vourdalak_debt",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/vourdalak_debt",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 14,
        "agility": 16,
        "constitution": 16,
        "intelligence": 10,
        "spirit": 14,
        "charisma": 6,
        "maxHp": 285,
        "currentHp": 285,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 4,
        "speed": 30,
        "flying": 0,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "necrotic": 100,
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "Cursed by the tragic fate of the Slavic Vourdalak, a vampire that targeted its own grieving family, and the madness-inducing Vedic Pishacha, a dark demon of the cremation grounds, the Vourdalak-Debt represents the horror of unresolved obligations. In Mythrill, they are the restless dead driven to sustain their false lives through the vitality of their kin.",
      "nature": "This figure appears almost exactly as it did in life but with too-pale skin, stiff movements, and a smile that is too wide, dressed in peat-stained burial clothes. Peat-black liquid flows through its visible, translucent veins, and it carries the cracked contract-tablet that recorded its debts in life. Its face is frozen in its final moment of terror or fading, though its eyes remain fully aware and screaming at the horror of its state.",
      "habitat": "This tragic revenant wanders the damp settlements within the Bryngloom Forest terrain.",
      "depth": "Known as the Debt-Revenant, the Vourdalak-Debt is returned to a half-life by the Keeper of the Last Threshold to complete its broken Neth or Morren contract, draining its family's life force to do so. It also acts as a Madness-Speaker, possessing blood relatives to speak secrets of contract loopholes and buried artifacts, making these encounters a desperate search for Neth weavers and adventurers seeking to free the family from the spirit's parasitic bond or to retrieve a component from it."
    },
    {
      "id": "mavka_willow",
      "name": "Mavka-Willow",
      "description": "A beautiful, leaf-clad dryad of the willows, the Mavka-Willow hides a hollow back and a mind-shattering secret.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "mavka_willow",
        "elemental"
      ],
      "tokenIcon": "Bestiary/mavka_willow",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 16,
        "constitution": 12,
        "intelligence": 14,
        "spirit": 16,
        "charisma": 14,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 40,
        "currentMana": 40,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 30,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "psychic": 75,
        "necrotic": 50
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Night-Kiss",
          "description": "+5 to hit, 1d6+3 psychic — a kiss from Nott inflicts vivid nightmares on the target; DC 14 SPI or gain 1 level of exhaustion",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "1d6+3"
            },
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Mavka-Willow draws from the Slavic Mavka, a forest spirit of a woman who died unnaturally, beautiful from the front but hollow-backed with visible organs, combined with the Hindu Yakshini, tree-spirits bound to sacred growth who could bless or curse travelers. In the woodlands of Mythrill, they represent the alluring, deceptive beauty of the wilderness.",
      "nature": "From the front, this spirit appears as a stunningly beautiful woman with pale-green leaf-like skin, willow-bark hair, and bare feet merging with the roots, wearing a dress of leaves sewn with spider-silk and smelling of willow-sap. From behind, she has no back or spine, but rather a hollow cavity filled with rustling leaves and wooden organs. Her exquisite face is marked by spring-green eyes and parted lips, carrying a heartbreakingly innocent expression.",
      "habitat": "This tree-bound nymph lives at the roots of ancient trees in the Bryngloom Forest terrain.",
      "depth": "Acting as a Tree-Bride, each Mavka-Willow is bound to a specific willow whose growth reflects her mood, which the Neth monitor as a living archive since the tree's rings store her memories. Her dangerous Hollow-Back Secret draws onlookers to walk around her, only to be driven mad by the sight of her hollow interior, though the Vreken have learned a funeral chant to force her to turn away. Adventurers might be hired to protect Neth researchers or to harvest components from the Mavka's sacred tree."
    },
    {
      "id": "alkonost",
      "name": "Alkonost",
      "description": "A beautiful bird of paradise whose heavenly song brings total joy at the cost of the listener's memories.",
      "type": CREATURE_TYPES.MONSTROSITY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "alkonost",
        "monstrosity"
      ],
      "tokenIcon": "Bestiary/alkonost",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 10,
        "agility": 14,
        "constitution": 12,
        "intelligence": 16,
        "spirit": 14,
        "charisma": 12,
        "maxHp": 130,
        "currentHp": 130,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 3,
        "speed": 30,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "psychic": 50,
        "necrotic": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Alkonost is derived from the Slavic Alkonost, a bird of paradise whose song brought total joy and oblivious peace, merged with the Hindu Gandharvas, celestial musicians who guarded sacred soma and inspired involuntary devotion. In Mythrill's damp canopy, she plays a divine melody that captures the light of dawn.",
      "nature": "Boasting a twenty-foot wingspan, this bird has the head, arms, and torso of a beautiful woman, with shifting rose, gold, violet, and blue plumage. She plays a divine lute that vibrates with the resonance of creation, weaving ribbons of golden light through the canopy while causing flowers to bloom on dead wood. Her face has perfect symmetry and glowing skin, with eyes holding the colors of the dawn and a beatific smile that has never known pain.",
      "habitat": "This celestial musician makes her home in the high branches of the Bryngloom Forest terrain.",
      "depth": "Known as the Joy-Singer, her song induces a state of euphoric oblivion, making it tempting to the contract-laden Neth. However, she is also a Memory-Thief, as every minute spent listening erases a year of the listener's past; these erased memories are stored in her dawn-colored feathers, which Vreken crypt-scholars seek to harvest for their secrets, offering a lucrative but highly dangerous task for adventurers who are hired when sightings are reported or when a specific component is needed."
    },
    {
      "id": "dziwozona_wild",
      "name": "Dziwozona-Wild",
      "description": "A grotesque water-woman who projects illusions of beauty, the Dziwozona-Wild targets families to swap children for ravenous changelings.",
      "type": CREATURE_TYPES.ELEMENTAL,
      "size": CREATURE_SIZES.LARGE,
      "tags": [
        "bryngloom",
        "dziwozona_wild",
        "elemental"
      ],
      "tokenIcon": "Bestiary/dziwozona_wild",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 18,
        "constitution": 8,
        "intelligence": 18,
        "spirit": 14,
        "charisma": 8,
        "maxHp": 75,
        "currentHp": 75,
        "maxMana": 30,
        "currentMana": 30,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 10,
        "flying": 30,
        "swimming": 30,
        "sightRange": 60,
        "darkvision": 0
      },
      "resistances": {
        "psychic": 75,
        "necrotic": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Dziwozona-Wild stems from the Polish Dziwozona, a wild, green-haired swamp-nymph who drowned men and swapped infants, and Putana, the Vedic demoness who posed as a wet-nurse to poison the baby Krishna. In Mythrill's wetlands, she represents the cruel archetype of the false-mother who preys on grief.",
      "nature": "Standing seven feet tall, this massive, barrel-chested woman has wild green hair dripping with bog-water and large breasts that leak a luminescent fluid. Her skin resembles waterlogged grey-green wood, with webbed hands and feet, and she carries a swaddled bundle of stolen memories wrapped in Neth silk. Her face is flat and frog-like, featuring nose-holes, a wide mouth, and small pig-like eyes, though she can project an illusion of beauty that can fool even Neth truth-sense.",
      "habitat": "This deceptive swamp-dweller resides in the pools and rivers of the Bryngloom Forest terrain.",
      "depth": "Acting as the False-Mother, she offers poisoned milk to grieving parents to put them into a permanent sleep before leaving a changeling of woven bog-grass in their place. Her actual amphibious offspring, the Substitute-Children, are left in human cradles and grow rapidly while devouring contract-paper, forcing Neth households to hunt these creatures down and retrieve their stolen kin before their archives are destroyed, providing a desperate hook for adventurers."
    },
    {
      "id": "upir_root",
      "name": "Upir-Root",
      "description": "An underground network of pulsing, parasitic tendrils, the Upir-Root drains the life of the forest and travelers above it.",
      "type": CREATURE_TYPES.FEY,
      "size": CREATURE_SIZES.MEDIUM,
      "tags": [
        "bryngloom",
        "upir_root",
        "fey"
      ],
      "tokenIcon": "Bestiary/upir_root",
      "tokenBorder": "#2d6a4f",
      "stats": {
        "strength": 18,
        "agility": 14,
        "constitution": 18,
        "intelligence": 16,
        "spirit": 18,
        "charisma": 14,
        "maxHp": 650,
        "currentHp": 650,
        "maxMana": 50,
        "currentMana": 50,
        "maxActionPoints": 5,
        "currentActionPoints": 5,
        "initiative": 3,
        "speed": 30,
        "flying": 0,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "necrotic": 100,
        "cold": 50,
        "physical": 25
      },
      "vulnerabilities": {
        "radiant": 25
      },
      "abilities": [
        {
          "name": "Life-Force-Drain",
          "description": "+6 to hit, 2d6+4 necrotic + DC 14 CON or lose 1d4 CON permanently",
          "type": "melee",
          "icon": "ability_physical_taunt",
          "range": 5,
          "actionPointCost": 2,
          "cooldown": 0,
          "effects": [
            {
              "type": "DAMAGE",
              "value": "2d6+4"
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Upir-Root draws from the ancient Slavic Upir, a blood-drinking vampire blamed for blighted fields and agricultural ruin, combined with the parasitic Vedic Bhuta, a restless spirit that anchored itself to the soil to drain the vitality of the living. In Mythrill's depths, it manifests as a literal blight upon the forest's hydrology.",
      "nature": "This creature appears as a skeletal, underground network of dark tendrils that spread from a central burial point, mimicking ironwood roots but pulsing with a slow heartbeat. Where they touch living roots, they leech nutrients to wither the tree above. At the center of the network, buried six feet deep, lies the original peat-preserved corpse with its eyes open, its mouth stretched in a silent scream, and root-tendrils sprouting from its mouth, eyes, and fingertips.",
      "habitat": "This parasitic entity spreads beneath the soil of the Bryngloom Forest terrain.",
      "depth": "Operating as a Root-Parasite, the Upir-Root drains the life force of everything within a fifty-foot radius, causing trees to yellow and inducing severe fatigue in Neth travelers walking above. As the primary Blight-Cause in the forest, these infestations are targeted by the Neth Velun using contract-rituals to legally release the spirit's attachments, though adventurers are often needed to locate the buried center of the network or protect the ritualists from the spirit's defensive tendrils, especially if a component from the core is required."
    },
    {
      "id": "sirin_song",
      "name": "Sirin-Song",
      "description": "A dark bird of twilight with a heart-breaking face, the Sirin-Song sings a melody of absolute melancholy that pulls listeners toward their final rest.",
      "type": CREATURE_TYPES.HUMANOID,
      "size": CREATURE_SIZES.TINY,
      "tags": [
        "bryngloom",
        "sirin_song",
        "humanoid"
      ],
      "tokenIcon": "Bestiary/sirin_song",
      "tokenBorder": "#7209b7",
      "stats": {
        "strength": 6,
        "agility": 16,
        "constitution": 10,
        "intelligence": 16,
        "spirit": 22,
        "charisma": 18,
        "maxHp": 380,
        "currentHp": 380,
        "maxMana": 60,
        "currentMana": 60,
        "maxActionPoints": 3,
        "currentActionPoints": 3,
        "initiative": 4,
        "speed": 10,
        "flying": 30,
        "swimming": 0,
        "sightRange": 60,
        "darkvision": 60
      },
      "resistances": {
        "radiant": 100,
        "psychic": 100,
        "necrotic": 25
      },
      "vulnerabilities": {
        "necrotic": 25
      },
      "abilities": [],
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
        "items": []
      },
      "dateCreated": "2026-06-13T18:00:00Z",
      "lastModified": "2026-06-13T18:00:00Z",
      "origin": "The Sirin-Song represents the dark Slavic Sirin, whose beautiful but sorrowful song led listeners to willingly cease living, combined with the Hindu Navagraha, the nine cosmic forces that dictate the path of destiny. In Mythrill's deepest forest, she acts as a tragic weaver of fate and a harbinger of the end.",
      "nature": "Having a twenty-foot wingspan, this bird-like entity has the head and upper torso of a gorgeous woman, with dark twilight plumage of indigo, violet, and black shot with silver threads. Her song projects ribbons of shadow that dim all light and drop the temperature, while she holds nine silver threads representing the aspects of fate. Her face is the most beautiful in the realm, permanently still with eyes closed to hide the overwhelming sight of all time, her lips constantly moving to hum her terrible, perfect song.",
      "habitat": "This mournful singer resides at the convergence of the bog and forest in the Bryngloom Forest terrain.",
      "depth": "Performing the Death-Song at the forest's deepest core, her voice is the sound of the Keeper of the Last Threshold, driving listeners to sit down and peacefully surrender to the swamp. As the Fate-Weaver, she manipulates nine threads representing elements like birth, contract, and dissolution to shape destinies, prompting the Neth to avoid her at all costs and providing a legendary challenge for any adventurers who dare seek her tears or seek to alter a predetermined doom, or if a sighting prompts a high-stakes investigation."
    }
];;;;

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
