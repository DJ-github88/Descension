/**
 * Creature drops: Frostwood Reach
 *
 * Reagents, trophies and gear dropped by Frostwood Reach creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const FROSTWOOD_REACH_DROPS = [
  {
    "id": "memory-silt",
    "name": "Memory-Silt",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Pale silt left behind where the memory-fog settles. Fogbound travelers swear it smells of a half-remembered kitchen. Alchemy reagent: the base of recall draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-shovel-light-brown-tan-dark-brown-grip-end",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Silt",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "forgotten-letter",
    "name": "Forgotten Letter",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "common",
    "description": "A wax-sealed letter that never reached its reader. The seal is Seelie, the handwriting is not.",
    "iconId": "Misc/Books/book-folded-letter-envelope",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "swamp-slime",
    "name": "Peat-Pool Slime",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Cold, clinging slime scraped from a silt-leech. It dissolves rust and takes the sting out of a blister. Alchemy reagent for salves and solvents.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-squat-rounded-widened-neck-beige",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 22
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Slime",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "neutral",
    "reagentState": "Raw"
  },
  {
    "id": "silt-leech-gland",
    "name": "Silt-Leech Gland",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A vibration-sensitive gland from the blind silt-serpent. It still twitches when someone walks nearby. Alchemy reagent: sharpens senses in tracking tonics.",
    "iconId": "Misc/Monster Parts/monster-part-glands-golden-cluster-brown-base",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 50
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Gland",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Organ",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "ironwood-bark",
    "name": "Ironwood Bark",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Plated bark from the Frostwood ironwoods, dense enough to turn a hatchet. Blacksmithing and engineering use it for hafts, hilts and shield cores.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-rod-textured-strip-wooden",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Wood",
    "professions": [
      "Blacksmithing",
      "Engineering"
    ],
    "gatheringMethod": "harvesting"
  },
  {
    "id": "feather-skull-fragment",
    "name": "Feather-Skull Fragment",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A shard of the hollow bird-skull a grimmstalk wears for a face, still stuffed with black down. Leatherworking and enchanting component; muffles footsteps.",
    "iconId": "Misc/Monster Parts/Bones/bone-bird-skull-profile-beige-beak",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Bone",
    "professions": [
      "Leatherworking",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "canopy-down",
    "name": "Canopy Down",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Soft black feathers shed by the forest canopy-walkers. Fletching and padding.",
    "iconId": "Weapons/Shuriken/shuriken-four-bladed-x-shape-orange-yellow-feathers",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 24
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "braided-horsehair-necklace",
    "name": "Braided Horsehair Necklace",
    "type": "accessory",
    "subtype": "NECKLACE",
    "quality": "uncommon",
    "description": "A pony-hair cord the pooka leaves on the gates of those it has decided to like. It is surprisingly hard to lose.",
    "iconId": "Armor/Neck/magical-staff-pendant",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "neck"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "agility": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "pooka-hoofshoe",
    "name": "Pooka Hoofshoe",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A shoe too small for any pony, warm as a pocket. Farriers nail it above the stable door to keep manes from knotting.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-bent-u-shape-horseshoe-diagonal-yellow-orange-red-thick-cap-dark-tip-pointed-end",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Frostwood Reach",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "fey-antler-shards",
    "name": "Fey Antler Shards",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Gilt-tipped antler splinters from a wolpertinger. They shed faint pollen. Jewelcrafting and enchanting inlay.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-gnarled-branched-antler",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 28
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Bone",
    "professions": [
      "Jewelcrafting",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "wolpertinger-pinion",
    "name": "Wolpertinger Pinion",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A pheasant-wing feather no longer than a thumb, light enough to float on a breath. Tailoring: lightens cloaks and quivers.",
    "iconId": "Misc/Monster Parts/Feathers/feather-fiery-orange-red-yellow",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "peat-ink",
    "name": "Peat-Ink",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A dark, mossy ink that keeps a record even in damp. A schratling spits it onto anything worth writing down. Enchanting reagent: the base of fogproof rune ink.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-pants-overalls-olive-green-beige-upper-golden-glow",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 10
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Ink",
    "professions": [
      "Enchanting",
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "wyrd",
    "reagentState": "Processed"
  },
  {
    "id": "moss-quill",
    "name": "Moss-Quill",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A crow quill grown over with soft green moss. The nib never dries. Scribes and enchanters favour it for fine glyph work.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/purple-feather-quill",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 36
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Feather",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "alraune-root-hair",
    "name": "Mandrake Root-Hair",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Pale root-hair from a screaming root-child. It twitches when you hum. Alchemy reagent; a pinch dulls pain and sound.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-golden-brown-bulb-red-roots-green-leaves",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 70
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Root",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "herbalism",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "cracked-porcelain-face",
    "name": "Cracked Porcelain Face",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A porcelain doll mask split down the middle. Behind the crack, something that looks like bark is still growing.",
    "iconId": "Misc/Monster Parts/Bones/bone-bird-skull-profile-beige-beak",
    "value": {
      "gold": 0,
      "silver": 6,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "nightmare-dust",
    "name": "Nightmare Dust",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Grey dust that settles on a sleeper after a bad night. It is cold to the touch and weighs more than it should. Alchemy reagent for sleep and dream draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-bottle-classic-bulbous-light-creamy-yellow-off-white-brown-stopper-band",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Dust",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "river-shroud-cloth",
    "name": "River-Crossing Shroud",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A pale cloth that smells of wet stone. It has been used to wash a thousand memories out of someone. Tailoring and enchanting: weaves dreamwarded cloth.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp",
    "value": {
      "gold": 0,
      "silver": 7,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Cloth",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "petrified-bark-knot",
    "name": "Petrified Bark Knot",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A knot of ironwood turned to stone, rapped three times by a knocker before it could go in a pocket. Engineering: strikes true as a hammer-face.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-shovel-wooden-handle-spade-blade",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Wood",
    "professions": [
      "Engineering",
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "knocker-tap-hammer",
    "name": "Knocker's Tap-Hammer",
    "type": "weapon",
    "subtype": "MAUL",
    "quality": "uncommon",
    "description": "A small mining hammer that taps in rhythm of its own accord. Tunnel walls near it go quiet.",
    "iconId": "Weapons/Warhammer/warhammer-pickaxe-dark-handle-light-head",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 80
    },
    "stackable": false,
    "width": 1,
    "height": 2,
    "rotation": 0,
    "slots": [
      "mainHand",
      "offHand"
    ],
    "weaponSlot": "ONE_HANDED",
    "hand": "MAIN_HAND",
    "weaponStats": {
      "baseDamage": {
        "diceCount": 1,
        "diceType": "d6",
        "damageType": "smashing",
        "bonusDamage": 1
      }
    },
    "baseStats": {
      "strength": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "withered-ironwood-leaf",
    "name": "Withered Ironwood Leaf",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A brittle leaf that rustles like a growling hound. Alchemy and cooking herb; keeps hounds off a trail.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/oak-leaf-autumn-gradient",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 26
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Leaf",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "hound-whistle-bone",
    "name": "Hound-Whistle Bone",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A hollow bone that whistles a three-note bark when blown. Dogs will not look at you while you carry it.",
    "iconId": "Misc/Monster Parts/Bones/bone-spiral-white-conical-ridged",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 10
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Frostwood Reach",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "nuckel-sinew",
    "name": "Nuckelavee Sinew",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Raw, wet muscle fibre that never fully dries. Strong enough to string a siege bow. Leatherworking and engineering: heavy-duty cordage.",
    "iconId": "Misc/Monster Parts/monster-part-flesh-chunk-brown-purplish-base",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Sinew",
    "professions": [
      "Leatherworking",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "peat-horror-hoofshoe",
    "name": "Peat-Horror Hoofshoe",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "epic",
    "description": "A horseshoe of black iron that never fits the same hoof twice. Warm and faintly wet.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-bent-u-shape-horseshoe-diagonal-yellow-orange-red-thick-cap-dark-tip-pointed-end",
    "value": {
      "gold": 0,
      "silver": 32,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Frostwood Reach",
    "demandLevel": "High",
    "qualityGrade": "Masterwork"
  },
  {
    "id": "mossy-fur-scrap",
    "name": "Mossy Fur Scrap",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Goat-hair fur grown over with fresh moss. It keeps the rain off and keeps its own colour. Tailoring and leatherworking lining.",
    "iconId": "Misc/Monster Parts/Hide/hide-rolled-dark-teal-scaly",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 32
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fur",
    "professions": [
      "Tailoring",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "blood-milk-vial",
    "name": "Blood-Milk Vial",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A warm vial of the moss maiden's milk. It restores strength, and it takes a year from your memory in return. Alchemy reagent: strongest vitality base in the Frostwood.",
    "iconId": "Misc/Profession Resources/Alchemy/Red/red-potion-vibrant-glow",
    "value": {
      "gold": 0,
      "silver": 7,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Liquid",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "ironwood-splinter-shield",
    "name": "Ironwood Splinter Shield",
    "type": "armor",
    "subtype": "SHIELD",
    "quality": "uncommon",
    "description": "A one-armed giant's buckler, hacked from a single ironwood plank. It rings when truth is told near it.",
    "iconId": "Weapons/Shields/shield-wooden-round-beige-worn-claw-mark",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 20
    },
    "stackable": false,
    "width": 2,
    "height": 3,
    "rotation": 0,
    "slots": [
      "offHand"
    ],
    "baseStats": {
      "constitution": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8",
    "shape": {
      "type": "custom",
      "width": 2,
      "height": 3,
      "cells": [
        [
          true,
          true
        ],
        [
          true,
          true
        ],
        [
          true,
          false
        ]
      ]
    }
  },
  {
    "id": "fachan-truth-stone",
    "name": "Truth-Anchor Stone",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A small flat stone the fachan hands to those who answer honestly. It stays still when you lie. Enchanting reagent for oath-binding glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-crystal-shards-teal-beige-faceted",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Stone",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "forget-mead-flask",
    "name": "Flask of Forget-Mead",
    "type": "consumable",
    "subtype": "DRINK",
    "quality": "uncommon",
    "description": "Honeyed mead fermented from lost memories. One sip and last Tuesday goes quiet.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-x-shaped-four-pointed-star-light-orange-beige-dark-mark-top-right",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "healthRestore": 3
    },
    "baseStats": {
      "spirit": {
        "value": 1,
        "isPercentage": false,
        "duration": 300
      },
      "intelligence": {
        "value": -1,
        "isPercentage": false,
        "duration": 300
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 5
      }
    }
  },
  {
    "id": "cask-cork-tooth",
    "name": "Cask-Cork Tooth",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "common",
    "description": "A little gap-toothed cork a cellar sprite tucks in a cheek. Smells wonderfully of oak.",
    "iconId": "Weapons/Shields/shield-heater-brown-beige-skull-fangs-teeth",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 12
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "junkType": "trinket",
    "condition": "worn"
  },
  {
    "id": "compounded-peat-clod",
    "name": "Compounded Peat Clod",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Dense, dark peat packed with the history of a household. It burns slowly and smells of remembered suppers. Fuel for forges and kilns; smoulders for hours.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-roots-wood-moss-covered-beige-green-three",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Peat",
    "professions": [
      "Blacksmithing",
      "Cooking"
    ],
    "gatheringMethod": "harvesting"
  },
  {
    "id": "hearth-ledger-scrap",
    "name": "Hearth-Ledger Scrap",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "poor",
    "description": "A torn page of someone's family ledger, drained of ink.",
    "iconId": "Misc/Books/book-torn-parchment-gibberish-text",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 6
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "junkType": "paper",
    "condition": "worn"
  },
  {
    "id": "shroud-remnant",
    "name": "Shroud Remnant",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A scrap of dissolved-journal shroud, pages and fabric still pulped together. It rustles like a whisper. Tailoring and enchanting: weaves spirit-touched cloth.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-twine",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Cloth",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "banshee-tear-glass",
    "name": "Banshee Tear-Glass",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A clear bead formed where the wailing ended. It holds the last sound the dying elder made. Enchanting reagent for sound-ward glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-magenta-faceted-teardrop-gem",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Glass",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "raven-pinion-black",
    "name": "Memory-Raven Pinion",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A black pinion from the swarm of executed thoughts. Its shaft is hollow and cold. Fletching and quill-crafting.",
    "iconId": "Armor/Leggings/leggings-wings-leaf-wood-brown-tan-beige-layered-feathers",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Feather",
    "professions": [
      "Enchanting",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "spectral-feather-ash",
    "name": "Feather-Ash",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Ash left when a swarm raven is struck down. It flutters back into a shape if you breathe on it. Alchemy and enchanting reagent.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-chicken-wing-l-v-shape-light-brown-tan-dark-bone-joint-top-right",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 34
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Ash",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "hunt-archive-page",
    "name": "Archive-Page of the Hunt",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A page torn from a recorded history by wild-hunt riders. Its subject is somebody who is no longer remembered.",
    "iconId": "Misc/Books/book-torn-parchment-gibberish-text",
    "value": {
      "gold": 0,
      "silver": 11,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "hunt-rider-spur",
    "name": "Wild-Rider's Spur",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A silver spur that chimes when the hunt rides close.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-dark-metallic-hook-curved",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "peat-pool-dew",
    "name": "Peat-Pool Dew",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Dew shaken from a fuath's hair, tasting of mud and a song you almost knew. Alchemy solvent for memory extracts.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-diagonal-tilted_1",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Liquid",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "root-garden-seed",
    "name": "Root-Garden Seed",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Seeds from a grogoch's hoard: carrots, turnips and one that hums. Cooking and alchemy.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-seeds-nuts-three-almond-brown-beige",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 18
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Seed",
    "professions": [
      "Cooking",
      "Alchemy"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "secret-toll-token",
    "name": "Secret-Toll Token",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A wooden token a grogoch hands to those who paid a secret to pass. Each one keeps the secret.",
    "iconId": "Currency/brown-coin-pouch",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "winter-distaff",
    "name": "Winter-Crone's Distaff",
    "type": "weapon",
    "subtype": "STAFF",
    "quality": "epic",
    "description": "A bone-tipped distaff that spins the fog into thread. Strikes with a soft cold that numbs thought.",
    "iconId": "Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details",
    "value": {
      "gold": 0,
      "silver": 38,
      "copper": 0
    },
    "stackable": false,
    "width": 1,
    "height": 2,
    "rotation": 0,
    "slots": [
      "mainHand"
    ],
    "weaponSlot": "TWO_HANDED",
    "hand": "TWO_HAND",
    "weaponStats": {
      "baseDamage": {
        "diceCount": 1,
        "diceType": "d6",
        "damageType": "rime",
        "bonusDamage": 3
      }
    },
    "baseStats": {
      "spirit": {
        "value": 2,
        "isPercentage": false
      },
      "intelligence": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8",
    "combatStats": {
      "onHitEffects": {
        "enabled": true,
        "procType": "dice",
        "procChance": 20,
        "diceThreshold": 18,
        "cardProcRule": "face_cards",
        "coinProcRule": "all_heads",
        "coinCount": 3,
        "procSuit": "hearts",
        "spellEffect": null,
        "customEffects": [],
        "useRollableTable": false,
        "effect": {
          "effectType": "damage",
          "effectConfig": {
            "formula": "1d6",
            "damageType": "rime",
            "isDot": true,
            "targetType": "target",
            "areaRadius": 0,
            "dotDuration": 2,
            "dotTickFrequency": "round"
          }
        }
      }
    }
  },
  {
    "id": "spun-fog-thread",
    "name": "Spun Fog-Thread",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Thread spun from the memory-fog itself. It fades the moment it is forgotten. Tailoring: a thread for veils and dreamweave.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-rolled-green-fabric-material",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Thread",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "dullahan-lantern-wick",
    "name": "Dullahan Lantern Wick",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A wick of hair taken from the headless rider's lamp. It burns with a pale flame that names the next person to die. Enchanting reagent for sight-of-doom glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Red/red-potion-horizontal-line",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Wick",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "fog-steed-bridle",
    "name": "Fog-Steed Bridle",
    "type": "accessory",
    "subtype": "TRINKET",
    "quality": "epic",
    "description": "A black bridle that never stays still. Whoever wears it is never lost, and slowly forgets they were ever somewhere else.",
    "iconId": "Armor/Waist/shield-emblem-red-gold-belt",
    "value": {
      "gold": 0,
      "silver": 42,
      "copper": 0
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "trinket"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "agility": {
        "value": 2,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "moss-touched-fang",
    "name": "Moss-Touched Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A fang grown through with green moss. Hounds will not bite what carries it. Leatherworking and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-orange-creature-mouth-teeth-spikes",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Tooth",
    "professions": [
      "Leatherworking",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "green-hound-pelt",
    "name": "Green-Hound Pelt",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A thick green pelt that muffles every footstep. Leatherworking: prized for fogwalker cloaks.",
    "iconId": "Misc/Monster Parts/Hide/hide-fragment-yellowish-brown-dried",
    "value": {
      "gold": 0,
      "silver": 7,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fur",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "pixie-dust-pinch",
    "name": "Pixie-Dust Pinch",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A pinch of faintly glowing wing-dust. It never quite settles. Alchemy and enchanting reagent.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-amphora-jug-two-handled-light-orange-beige-dark-opening-stopper",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Dust",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "moth-wing-scale",
    "name": "Moth-Wing Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A powdery wing-scale that glows in several shifting colours. Tailoring dye and fine inlay.",
    "iconId": "Misc/Monster Parts/Wings/wing-fragment-pink-membrane",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Scale",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "red-moss-cap",
    "name": "Red-Moss Cap",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "A crimson cap of moss worn by a waldschrat. It sparks when struck. Alchemy and engineering: a mild spark reagent.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-mushroom-red-cap-spotted-beige-stem",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 28
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fungus",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "herbalism",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "riddle-rune-slate",
    "name": "Riddle-Rune Slate",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A palm-sized slate scratched with a historical riddle. Solving it is said to open the way.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "oathless-fetter",
    "name": "Oathless Fetter",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A thin iron fetter that tightens a little each time its wearer breaks a promise.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-chain-metallic-bronze-links",
    "value": {
      "gold": 0,
      "silver": 10,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Frostwood Reach",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "gambrel-rib-splinter",
    "name": "Gambrel Rib-Splinter",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long hollow bone, spindly and impossibly light. Engineering: a spring-steel substitute.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-gnarled-branched-antler",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Bone",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "revel-puppet-limb",
    "name": "Revel Puppet-Limb",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A jointed wooden arm from the phantom revel, still twitching to a faint tune. Engineering: a fine spring-hinge joint.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-bar-stick-wooden-stripe",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 50
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Wood",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "revel-dance-bell",
    "name": "Revel Dance-Bell",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A tiny golden bell that rings only to music nobody else can hear.",
    "iconId": "Currency/golden-bell-clapper",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Frostwood Reach",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  }
];
