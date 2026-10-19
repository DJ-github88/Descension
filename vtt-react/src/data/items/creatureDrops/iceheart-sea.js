/**
 * Creature drops: Iceheart Sea
 *
 * Reagents, trophies and gear dropped by Iceheart Sea creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const ICEHEART_SEA_DROPS = [
  {
    "id": "glowing-whisker",
    "name": "Glowing Spume-Whisker",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A cold-lit whisker that hums when something moves in the water. Alchemy reagent for vibration-sense and tracking.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-orange-glow",
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
    "materialType": "Hair",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "pelagos-shark-hide",
    "name": "Pelagos Shark-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Smooth indigo-green hide with a faint scale grain. Leatherworking: waterproof light leather.",
    "iconId": "Misc/Monster Parts/Hide/hide-golden-yellow-rectangular-bumpy",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 48
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Hide",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "woven-kelp-mat",
    "name": "Woven Kelp Mat",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A tightly woven kelp mat that still smells of cold reef water. Tailoring: waterproof matting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-rolled-brown-leather-fabric",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 38
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fiber",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "egbere-lure-pearl",
    "name": "Crying Lure-Pearl",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A small pearl that cries like a lost child when dropped.",
    "iconId": "Misc/Profession Resources/Gems/resource-light-blue-pearl-grey-casing",
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
    "tradeCategory": "gems",
    "origin": "Iceheart Sea",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "obsidian-shell-shard",
    "name": "Obsidian Shell-Shard",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A volcanic-glass shard shed from a giant crab's shell. Blacksmithing and armour-crafting: a lightweight plate.",
    "iconId": "Misc/Monster Parts/monster-part-shell-fragment-grey-segmented",
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
    "materialType": "Shell",
    "professions": [
      "Blacksmithing",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "scylla-ice-cutter-claw",
    "name": "Ice-Cutter Claw",
    "type": "weapon",
    "subtype": "AXE",
    "quality": "rare",
    "description": "A crab-claw adze that cuts through floe-ice in a single stroke.",
    "iconId": "Weapons/Warhammer/warhammer-pickaxe-brown-beige-head",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 20
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
        "diceType": "d8",
        "damageType": "slicing",
        "bonusDamage": 2
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
    "id": "rotting-wood-helm",
    "name": "Rotting Helm-Wood",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "poor",
    "description": "A grey, barnacled plank of a ship's wheel, still marked with the helmsman's grip. Engineering: burns badly, grips well.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-bundle-wood-bones-light-beige",
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
    "materialType": "Wood",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "draugr-brine-coin",
    "name": "Brine-Crusted Coin",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "common",
    "description": "A coin crusted with brine. The face is worn almost smooth.",
    "iconId": "Currency/gold-coin-embossed",
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
    "junkType": "coin",
    "condition": "worn"
  },
  {
    "id": "helmsmans-wheel-spoke",
    "name": "Helmsman's Wheel-Spoke",
    "type": "weapon",
    "subtype": "STAFF",
    "quality": "rare",
    "description": "A spoke from a rotting ship's wheel. It hums with the helmsman's last order.",
    "iconId": "Armor/Neck/magical-staff-pendant",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 60
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
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "constitution": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "seal-skin-scrap",
    "name": "Seal-Skin Scrap",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A scrap of sleek seal-skin stolen by a child-snatcher. Leatherworking and tailoring: a waterproof lining.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-animal-hide-spotted-beige-brown-green-leaves",
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
    "materialType": "Hide",
    "professions": [
      "Leatherworking",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "qalupalik-amautik-strap",
    "name": "Amautik Strap",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A weathered strap that holds the amautik pouch, still warm. Leatherworking: a perfectly oiled strap.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-twine",
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
    "materialType": "Leather",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "siren-bone-comb",
    "name": "Siren's Bone Comb",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A comb of white bone that sings when run through damp hair.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Iceheart Sea",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "cowrie-crown-shell",
    "name": "Cowrie-Crown Shell",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A mother-of-pearl cowrie from a siren's crown. Jewelcrafting: pearly inlay.",
    "iconId": "Misc/Monster Parts/monster-part-eggshell-broken-golden-green-patterns",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Shell",
    "professions": [
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "maelstrom-spotted-scale",
    "name": "Maelstrom Spotted-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A whorl-patterned scale that spins slowly in water. Leatherworking: rippling armour scales.",
    "iconId": "Misc/Monster Parts/Scales/scale-golden-ridged-bean-shaped",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "maelstrom-heart-water",
    "name": "Maelstrom Heart-Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A flask of whirlpool-water that never stops turning. Alchemy reagent: the core of tidal draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-half-full",
    "value": {
      "gold": 0,
      "silver": 40,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Water",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "ketos-tusk-fragment",
    "name": "Ketos Tusk-Fragment",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A piece of the tusk of a primordial sea-monster. It resonates like a tuning fork. Blacksmithing and enchanting: a weapon core.",
    "iconId": "Misc/Monster Parts/Horns/horn-crescent-beige-segmented",
    "value": {
      "gold": 0,
      "silver": 43,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Tusk",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "ketos-blubber-oil",
    "name": "Ketos Blubber-Oil",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A cask-full of slow-burning blubber-oil from a deep-sea leviathan. Cooking and engineering: lamp oil that lasts weeks.",
    "iconId": "Misc/Profession Resources/Cooking/sword-blade-golden-bronze-single-edged",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fat",
    "professions": [
      "Cooking",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "harpy-iron-hook-foot",
    "name": "Harpy Iron Hook-Foot",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A single iron hook-foot with a sliver of rigging still in it. Blacksmithing and leatherworking.",
    "iconId": "Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Claw",
    "professions": [
      "Blacksmithing",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "harpy-vulture-feather",
    "name": "Harpy Vulture-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A coarse brown wing feather smelling of salt and storm. Fletching.",
    "iconId": "Weapons/Hoe/hoe-tomahawk-green-wrapped-red-feathers",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "stolen-sailors-trinket",
    "name": "Sailor's Stolen Trinket",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "common",
    "description": "A bone-handled trinket snatched from the rigging. Someone is missing it.",
    "iconId": "Currency/golden-chalice-red-wine",
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
    "tradeCategory": "curios",
    "origin": "Iceheart Sea",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "hippocampus-fin-silk",
    "name": "Hippocampus Fin-Silk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A silk-thin fin that purifies water as it dries. Alchemy and tailoring.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-folded-light-brown-material",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Fin",
    "professions": [
      "Alchemy",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "estuary-pure-water",
    "name": "Estuary Pure-Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "A vial of water with no taste at all. A hippocampus has blessed it. Alchemy reagent: a flawless distilled base.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-rounded-bulbous",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 44
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Water",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "gorgon-crystal-blood",
    "name": "Gorgon Crystal-Blood",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "Blood that crystallizes as it cools. A single drop turns a plant to stone. Alchemy reagent for petrifying draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-guitar-flying-v-diagonal-v-shaped-body-light-orange-tan-vibrant-orange-red-gradient-burst-flame-hot-spot-slender-neck-headstock",
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
    "materialType": "Blood",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "gorgon-eel-hair",
    "name": "Gorgon Eel-Hair",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A wriggling bioluminescent eel-lock. Tailoring and enchanting: a light-source thread.",
    "iconId": "Misc/Monster Parts/monster-part-tentacle-blue-bulbous-brown-end",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Hair",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "tokoloshe-pebble",
    "name": "Tokoloshe Pebble",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A grey pebble that makes the holder invisible if held in the mouth. Do not swallow.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
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
    "origin": "Iceheart Sea",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "bilge-sprite-scrapings",
    "name": "Bilge-Sprite Scrapings",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "poor",
    "description": "Slime scraped from a sprite's hide. Smells like the underside of a ship.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-fish-bass-leaping-curved-olive-green-beige-belly",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 5
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "junkType": "scrap",
    "condition": "worn"
  },
  {
    "id": "lamia-pearl-tear",
    "name": "Lamia Pearl-Tear",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A pearl formed from a reef-dweller's sorrow.",
    "iconId": "Misc/Profession Resources/Gems/resource-light-blue-pearl-grey-casing",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "gems",
    "origin": "Iceheart Sea",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "coral-plated-scale",
    "name": "Coral-Plated Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A hard scale with a coral veneer. Leatherworking: ornamental plating.",
    "iconId": "Misc/Monster Parts/Scales/scale-golden-ridged-bean-shaped",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Scale",
    "professions": [
      "Leatherworking",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "empusa-brass-leg",
    "name": "Empusa's Brass Leg",
    "type": "weapon",
    "subtype": "MACE",
    "quality": "epic",
    "description": "A brass prosthetic leg gone cold and wrong. It strikes in a limp, a swing nobody sees coming.",
    "iconId": "Weapons/Warhammer/warhammer-double-headed-fire-red-orange-yellow-teal-gem-center",
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
      "mainHand",
      "offHand"
    ],
    "weaponSlot": "ONE_HANDED",
    "hand": "MAIN_HAND",
    "weaponStats": {
      "baseDamage": {
        "diceCount": 1,
        "diceType": "d8",
        "damageType": "smashing",
        "bonusDamage": 3
      }
    },
    "baseStats": {
      "agility": {
        "value": 1,
        "isPercentage": false
      },
      "strength": {
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
            "damageType": "wyrd",
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
    "id": "storm-watch-charm",
    "name": "Watch-Keeper's Charm",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A small bell taken from a drained watch-keeper. It rings softly before a storm.",
    "iconId": "Currency/golden-bell-clapper",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "charms",
    "origin": "Iceheart Sea",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "telkhine-whalebone-hammer",
    "name": "Whale-Bone Hammer",
    "type": "weapon",
    "subtype": "MAUL",
    "quality": "rare",
    "description": "A hammer-head carved from a whale rib. It sings on every swing.",
    "iconId": "Weapons/Warhammer/warhammer-brown-tan-striking-face-orange-yellow-fire-enchanted-pommel",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 40
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
        "diceType": "d8",
        "damageType": "smashing",
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "strength": {
        "value": 2,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "deep-sea-ice-ingot",
    "name": "Deep-Sea Ice Ingot",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "An ingot of deep-sea ice that never melts. Blacksmiths of the Iceheart swear by it. Blacksmithing: forges unmelting frost-metal.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-split-blue-teal-beige-divider",
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
    "materialType": "Ice",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "bronze-plume-shard",
    "name": "Bronze Plume-Shard",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A bronze feather-shard, sharp as a dagger and ringing like a bell. Blacksmithing: easily forged into arrow-tips.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-ingot-brick-brown-orange",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Metal",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "stymphalian-bronze-quill",
    "name": "Bronze Quill",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A razor-edged bronze quill from the swarm. Arrow-tips and daggers.",
    "iconId": "Misc/Monster Parts/Feathers/monster-part-feathers-pair-blue-iridescent",
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
    "materialType": "Metal",
    "professions": [
      "Blacksmithing",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nereid-sea-light",
    "name": "Nereid Sea-Light",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "Compressed water and light in a vial. It glows brighter when the bearer is drowning. Alchemy reagent: breath draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/hand-holding-item-arrow",
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
    "materialType": "Light",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "graeae-obsidian-eye",
    "name": "Graeae Shared Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A glassy obsidian eye that sees what the three sisters see together. Enchanting reagent: a prophecy lens.",
    "iconId": "Misc/Monster Parts/Organs/organ-eye-monster-green-yellow",
    "value": {
      "gold": 0,
      "silver": 42,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Obsidian",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "arcane",
    "reagentState": "Pure"
  },
  {
    "id": "graeae-prophet-tooth",
    "name": "Graeae Prophet-Tooth",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A single tooth, shared between three crones. They will pay dearly for it.",
    "iconId": "Misc/Profession Resources/Archaeology/resource-necklace-bone-teeth-claws",
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
    "tradeCategory": "curios",
    "origin": "Iceheart Sea",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "triton-conch-horn",
    "name": "Triton's Conch Horn",
    "type": "weapon",
    "subtype": "HARP",
    "quality": "epic",
    "description": "A vibrating conch that calls the waves. The sound unmoors ships.",
    "iconId": "Instruments/Trumpet/trumpet-orange-brown-horn",
    "value": {
      "gold": 0,
      "silver": 39,
      "copper": 0
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
        "diceType": "d8",
        "damageType": "rime",
        "bonusDamage": 3
      }
    },
    "baseStats": {
      "charisma": {
        "value": 2,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "prehensile-mane-lock",
    "name": "Prehensile Mane-Lock",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A prehensile lock of sea-mane. It tightens when pulled. Leatherworking and tailoring.",
    "iconId": "Misc/Monster Parts/monster-part-tentacle-blue-bulbous-brown-end",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Hair",
    "professions": [
      "Tailoring",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nandi-hyena-pelt",
    "name": "Nandi Hyena-Pelt",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A coarse, ice-crusted hide with a bristling mane. Leatherworking: a bristling cloak.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-jagged",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Hide",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nandi-skull-crusher-tooth",
    "name": "Skull-Crusher Tooth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A heavy, blunt tooth. It has cracked more skulls than there are ice floes. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Teeth/tooth-molar-golden-white-roots",
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
    "materialType": "Tooth",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "popobawa-bruised-eye",
    "name": "Popobawa Bruised-Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A single bruised eye, still blinking in the dark. Alchemy reagent for fear draughts.",
    "iconId": "Misc/Monster Parts/Organs/organ-eye-pink-iris-bloodshot",
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
    "materialType": "Organ",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Organ",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "shame-silence-cloth",
    "name": "Silence-of-Shame Cloth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A cloth that muffles every sound, weighted with shame. Tailoring: silent cloth.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-brown-leather-boot-worn-stitched",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 70
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Cloth",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "abada-horn",
    "name": "Abada Narwhal-Horn",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A glowing narwhal horn that neutralises any poison it touches. Alchemy reagent: the master antidote.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-green-crystal-totem-braided-root-thorns",
    "value": {
      "gold": 0,
      "silver": 44,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Horn",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "reef-garden-spore",
    "name": "Reef-Garden Spore",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A spore of a small reef-garden. It blooms in saltwater. Cooking and alchemy.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-brown-spherical-fruit-nut-seed",
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
    "materialType": "Seed",
    "professions": [
      "Cooking",
      "Alchemy"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "graia-grey-water",
    "name": "Grey-Sea Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A colourless, mathematical water. It reflects the future for about a second. Alchemy and enchanting reagent for time effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-coin-pouch-medal-circular-oval-light-yellow-beige-dark-stopper-cap",
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
    "materialType": "Water",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "ichthya-wave-forge-ingot",
    "name": "Wave-Forge Ingot",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "An ingot of cold-forged sea-metal tempered by the tide. Blacksmithing: a tide-tempered alloy.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-split-blue-teal-beige-divider",
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
    "materialType": "Metal",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "ichthya-trident-tip",
    "name": "Glowing Trident-Tip",
    "type": "weapon",
    "subtype": "TRIDENT",
    "quality": "uncommon",
    "description": "A glowing trident-tip that warns of Monolith instability.",
    "iconId": "Weapons/Polearm/polearm-staff-mace-teal-spiky-fire-orange-red",
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
        "damageType": "stabbing",
        "bonusDamage": 2
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
    "id": "safe-harbor-light",
    "name": "Safe-Harbor Light",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A warm gold orb with a smiling face inside. Alchemy reagent for light and safety draughts.",
    "iconId": "Weapons/Swords/sword-fire-red-blade-golden-guard-teal-gems",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Light",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "sacred",
    "reagentState": "Raw"
  },
  {
    "id": "spume-memory-foam",
    "name": "Foam-Clot Memory",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A clot of glowing foam that replays a drowned sailor's scream. Enchanting reagent for echo glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-rectangular",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Foam",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "drowned-sailor-ice",
    "name": "Drowned Sailor's Ice",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A shard of ice with a face frozen inside. Enchanting inlay.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Ice",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "contract-ice-parchment",
    "name": "Ice-Parchment Contract",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A sentient contract of ice and parchment. It does not like being read twice.",
    "iconId": "Misc/Books/book-sealed-document-red-wax-string",
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
    "origin": "Iceheart Sea",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "runic-terms-seal",
    "name": "Runic Terms-Seal",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A runic seal that binds any vessel to its terms. Enchanting reagent: contract-binding glyphs.",
    "iconId": "Misc/Books/book-scroll-rolled-red-wax-seal",
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
    "materialType": "Wax",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Pure"
  }
];
