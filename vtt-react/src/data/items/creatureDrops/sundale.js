/**
 * Creature drops: Sundale
 *
 * Reagents, trophies and gear dropped by Sundale creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const SUNDALE_DROPS = [
  {
    "id": "sirrush-scale",
    "name": "Sirrush Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A horn-ridged scale from a Sundale dragon-serpent. Warm from the sun, even at midnight. Leatherworking and blacksmithing: sun-hardened plating.",
    "iconId": "Misc/Profession Resources/Alchemy/Red/red-potion-mermaid-aquatic-creature-reclining-diagonal-human-upper-body-light-peachy-beige-skin-dark-brown-hair-top-vibrant-red-tail-fish-like-bright-yellow-gold-pixel-accents-scales-belt-waist-hip-area-darker-red-maroon-shading-fin-like-structure",
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
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "sirrush-talon",
    "name": "Sirrush Eagle-Talon",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "An eagle-talon the length of a hand, striated gold. Blacksmithing and jewelcrafting: a weapon-edge core.",
    "iconId": "Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons",
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
    "materialType": "Claw",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "clay-shards",
    "name": "Scorched Clay Shards",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Soot-blackened potsherds, still warm. Wyrd-ash clings to them. Masonry: grog for fireclay and kiln-liners.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 14
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Clay",
    "professions": [
      "Masonry"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "ember-spit-coal",
    "name": "Ember-Spit Coal",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A coal spat out by an ember-jar spirit. It warms the hand and never burns it. Alchemy and blacksmithing: a self-lighting ember.",
    "iconId": "Misc/Profession Resources/Gems/resource-fire-crystal-gem-orange-red-beige",
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
    "materialType": "Ember",
    "professions": [
      "Alchemy",
      "Blacksmithing"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Raw"
  },
  {
    "id": "spotted-hide",
    "name": "Spotted Canyon-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A sleek spotted hide from a basalt-canyon hunter. Supple and surprisingly quiet. Leatherworking: light armour and quivers.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-jagged",
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
    "id": "serpopard-neck-tendon",
    "name": "Serpopard Neck-Tendon",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long supple tendon from a serpentine neck. Used for bowstrings and snares. Leatherworking and engineering: strong cordage.",
    "iconId": "Misc/Monster Parts/monster-part-flesh-raw-chunk-orange-brown",
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
    "materialType": "Sinew",
    "professions": [
      "Leatherworking",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "basalt-stone",
    "name": "Basalt Slab",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A dense black basalt slab with runic scratches. Masonry: tomb-grade building stone.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
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
    "materialType": "Stone",
    "professions": [
      "Masonry"
    ],
    "gatheringMethod": "quarrying"
  },
  {
    "id": "lamassu-crown-fragment",
    "name": "Lamassu Crown-Fragment",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A shard of the stone crown from a tomb sentinel. It still keeps a tiny measure of the oath it was carved with. Enchanting reagent for guardian wards.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-ingot-light-beige-golden",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Stone",
    "professions": [
      "Enchanting",
      "Masonry"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Pure"
  },
  {
    "id": "wing-stone-pinion",
    "name": "Wing-Stone Pinion",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A stone feather the size of a shield. It carries a long memory of flight. Blacksmithing: a flight-ward core.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-green-yellow-wings-leaves-v-shape",
    "value": {
      "gold": 0,
      "silver": 36,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Stone",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "terracotta-shards",
    "name": "Lapis-Glazed Terracotta Shards",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Terracotta shards still glazed with lapis blue. Masonry and jewelcrafting: lapis-flecked inlay.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
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
    "materialType": "Clay",
    "professions": [
      "Masonry",
      "Jewelcrafting"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "ushabti-sickle-sword",
    "name": "Ushabti Sickle-Sword",
    "type": "weapon",
    "subtype": "SICKLE",
    "quality": "uncommon",
    "description": "A bronze sickle-sword in a tomb servant's grip. It was made to cut grain, and to guard the dead.",
    "iconId": "Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple",
    "value": {
      "gold": 0,
      "silver": 5,
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
        "diceType": "d6",
        "damageType": "slicing",
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
    "id": "tomb-servant-seal",
    "name": "Tomb-Servant Seal",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A lapis-stamped seal marking a servant's promise to guard a tomb through the long night.",
    "iconId": "Currency/red-coin-crescent",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Sundale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "pazuzu-ash-wind",
    "name": "Bottled Ash-Wind",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A stoppered vial of volcanic wind and compressed ash. It howls to be let out. Alchemy and enchanting reagent for wind and ash effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-chicken-drumstick-cooked-beige-orange-dark-bone",
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
    "materialType": "Air",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wind",
    "reagentState": "Pure"
  },
  {
    "id": "basalt-scorpion-sting",
    "name": "Basalt Scorpion-Sting",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A hollow basalt barb that leaks a dark venom. Alchemy reagent for venom brews.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-battery-power-cell-beige-casing-green-fill-brown-terminal",
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
    "materialType": "Venom",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "nature",
    "reagentState": "Raw"
  },
  {
    "id": "caldera-black-glass",
    "name": "Caldera Black-Glass",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A shard of black volcanic glass, still warm in the glow of its birth. Blacksmithing and jewelcrafting: a keen glass edge.",
    "iconId": "Misc/Profession Resources/Mining/Icon15",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 50
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Glass",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "tyrant-molten-fang",
    "name": "Molten Tyrant-Fang",
    "type": "weapon",
    "subtype": "SWORD",
    "quality": "epic",
    "description": "A fang of black glass, orange at its core. The grip is pumice, deliberately.",
    "iconId": "Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt-simple",
    "value": {
      "gold": 0,
      "silver": 42,
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
        "diceType": "d10",
        "damageType": "ember",
        "bonusDamage": 3
      }
    },
    "baseStats": {
      "strength": {
        "value": 2,
        "isPercentage": false
      },
      "constitution": {
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
        "diceThreshold": 17,
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
            "formula": "1d8",
            "damageType": "ember",
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
    "id": "anzu-obsidian-talon",
    "name": "Anzu Obsidian Talon",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A sharp obsidian talon with a rune scratched in it. Blacksmithing: an obsidian edge.",
    "iconId": "Misc/Monster Parts/Claws/claw-segmented-fiery-black-orange",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Obsidian",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "anzu-storm-feather",
    "name": "Anzu Ash-Storm Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long ash-grey feather that carries static. Fletching and tailoring; shocks lightly.",
    "iconId": "Armor/Leggings/leggings-wings-leaf-wood-brown-tan-beige-layered-feathers",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "basalt-gate-key",
    "name": "Basalt Gate-Key",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A scorpion-guard's test: only a true answer unlocks it.",
    "iconId": "Misc/Profession Resources/Blacksmithing/Bronze Key",
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
    "tradeCategory": "curios",
    "origin": "Sundale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "scorpion-man-pincer",
    "name": "Scorpion-Man Pincer",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A basalt pincer with a gold-flecked inner edge. Blacksmithing: a crushing jaw-plate.",
    "iconId": "Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Chitin",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "ammit-judging-heart",
    "name": "Smoldering Judge-Heart",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A cinder-black heart that has weighed a thousand souls and found most wanting. Alchemy and enchanting reagent for judgment.",
    "iconId": "Misc/Monster Parts/Organs/organ-heart-human-red-orange-beige-vessels",
    "value": {
      "gold": 0,
      "silver": 38,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Organ",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Organ",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "ammit-croc-tooth",
    "name": "Ammit Crocodile-Tooth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A scorched crocodile tooth, ridged and sharp. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-necklace-teeth-golden-dark-strap",
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
    "materialType": "Tooth",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "copper-weeping-tear",
    "name": "Copper Weeping-Tear",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A copper-green tear from a hippo-demoness. It stains whatever it falls on. Alchemy and enchanting: copper-based tinctures.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Copper",
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
    "id": "donkey-shriek-reed",
    "name": "Shriek-Reed",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A hollow reed that shrieks in the wind like a donkey-demon. Instrument-crafting.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/bundle-dried-reeds-wheat-stalks",
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
    "materialType": "Reed",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bes-tambourine",
    "name": "Bes's Tambourine",
    "type": "weapon",
    "subtype": "MACE",
    "quality": "uncommon",
    "description": "A clay-and-basalt tambourine. A mock-grimace is painted on its skin.",
    "iconId": "Instruments/Drum/drum-banded-stripes",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 40
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
        "diceType": "d4",
        "damageType": "smashing",
        "bonusDamage": 1
      }
    },
    "baseStats": {
      "charisma": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "nursery-guard-charm",
    "name": "Nursery-Guard Charm",
    "type": "accessory",
    "subtype": "AMULET",
    "quality": "rare",
    "description": "A tiny clay-and-basalt charm that makes children giggle in their sleep.",
    "iconId": "Armor/Neck/magical-staff-pendant",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 20
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
      "constitution": {
        "value": 1,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "ifrit-coal-heart",
    "name": "Ifrit Coal-Heart",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A white-hot lump of coal that never cools. Solari smiths will pay a king's ransom. Blacksmithing and enchanting: a forge-heart for legendary work.",
    "iconId": "Misc/Profession Resources/Gems/resource-fire-crystal-gem-orange-red-beige",
    "value": {
      "gold": 0,
      "silver": 39,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Coal",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "cobra-hood-ember",
    "name": "Cobra-Hood Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A glowing cinder from the flame-cobra hood of an ifrit. Alchemy reagent for fire elixirs.",
    "iconId": "Weapons/Swords/sword-fire-red-blade-golden-guard-teal-gems",
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
    "materialType": "Ember",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Raw"
  },
  {
    "id": "ghul-ash-bone",
    "name": "Ghul Ash-Bone",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A conical bone of compacted ash. Its green glow remembers heat that is no longer there. Alchemy and enchanting reagent for heat-memory draughts.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey",
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
    "materialType": "Bone",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "shadow",
    "reagentState": "Raw"
  },
  {
    "id": "ghul-green-ember",
    "name": "Ghul Green-Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A green ember that drains warmth from the hand that holds it. Enchanting reagent: a heat-draining core.",
    "iconId": "Misc/Profession Resources/Gems/resource-three-crystal-shards-blue-teal-beige",
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
    "materialType": "Ember",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "gugalanna-obsidian-horn",
    "name": "Gugalanna Obsidian Horn",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A glossy obsidian horn with a white triangle painted on it. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-green-crystal-totem-braided-root-thorns",
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
    "materialType": "Horn",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "cooling-magma-clump",
    "name": "Cooling Magma Clump",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A clump of cooling magma, orange cracks fading to black. Blacksmithing: a slow-burn fuel.",
    "iconId": "Misc/Profession Resources/Mining/resource-three-fragments-lava-ember-red-orange",
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
    "materialType": "Stone",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "peri-wing-powder",
    "name": "Peri Wing-Powder",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "Opalescent powder shaken from a peri's wings. A pinch warms a cold room for a day. Alchemy and enchanting reagent for thermal effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-scroll-rolled-diagonal-light-beige-pale-orange-brown-stick-rod",
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
    "materialType": "Dust",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "daeva-lie-shadow",
    "name": "Daeva Lie-Shadow",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A bottled shadow of a lie. It whispers false answers and refuses honest questions. Alchemy reagent for trickery draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-star-five-pointed-beige-green-split-sprout",
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
    "materialType": "Shadow",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "daeva-jackal-fang",
    "name": "Daeva Jackal-Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A curved jackal tooth, black at the root. Jewelcrafting and leatherworking.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-teeth-cluster-sharp-yellowish-orange",
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
    "materialType": "Tooth",
    "professions": [
      "Jewelcrafting",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "simurgh-healing-feather",
    "name": "Simurgh Healing-Feather",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A copper-wire-barbed feather that mends a wound at a touch. Alchemy reagent: the finest healing base in Sundale.",
    "iconId": "Misc/Monster Parts/Feathers/monster-part-feathers-pair-blue-iridescent",
    "value": {
      "gold": 0,
      "silver": 41,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Feather",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "nature",
    "reagentState": "Pure"
  },
  {
    "id": "simurgh-copper-mane",
    "name": "Simurgh Copper-Mane",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A coil of copper-wire mane that rings when struck. Blacksmithing and engineering: fine copper wire.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bundle-metallic-rods-wires",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 80
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
    "gatheringMethod": "rare"
  },
  {
    "id": "azi-venom-gland",
    "name": "Azi Venom-Gland",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "One of three venom glands, each a different poison. Handle them with great care. Alchemy reagent for three-poison brews.",
    "iconId": "Misc/Monster Parts/Organs/monster-part-gland-tear-drop-yellow-orange",
    "value": {
      "gold": 0,
      "silver": 38,
      "copper": 0
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
    "gatheringMethod": "rare",
    "reagentType": "Organ",
    "magicType": "nature",
    "reagentState": "Raw"
  },
  {
    "id": "azi-obsidian-hide",
    "name": "Azi Obsidian-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A plate of green-black obsidian hide, nearly impervious to lava. Leatherworking and blacksmithing: lava-ward plating.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-textured",
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
    "materialType": "Hide",
    "professions": [
      "Leatherworking",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "edimmu-sulfur-wisp",
    "name": "Edimmu Sulfur-Wisp",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A sulfurous wisp in a glass bead, shivering with the memory of heat. Alchemy reagent for fire and fever draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-shovel-diagonal-light-tan-beige-blade-dark-brown-handle-d-grip",
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
    "materialType": "Sulfur",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "fire",
    "reagentState": "Raw"
  },
  {
    "id": "edimmu-afterimage-glass",
    "name": "Afterimage Glass",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A transparent shard in which a stranger's face still lingers. Enchanting reagent for echo and copy glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-purple-crystal-cluster-wand-shard",
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
    "materialType": "Glass",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "asag-weeping-pumice",
    "name": "Asag Weeping-Pumice",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A chunk of pumice that weeps tiny threads of lava. Masonry and blacksmithing: a heat-source for kilns.",
    "iconId": "Misc/Profession Resources/Mining/resource-three-fragments-lava-ember-red-orange",
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
    "materialType": "Stone",
    "professions": [
      "Masonry",
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "asag-boil-stone",
    "name": "Asag Boil-Stone",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A palm-sized stone that boils any water that touches it. Alchemy and cooking: a water-boiling core.",
    "iconId": "Misc/Profession Resources/Gems/resource-geode-fossil-brown-beige-orange-outline",
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
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "nisroch-wedjat-eye",
    "name": "Nisroch Wedjat-Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A golden falcon's eye that sees further than any lens. Enchanting and jewelcrafting: a true-sight lens.",
    "iconId": "Misc/Monster Parts/Organs/organ-eye-pink-iris-bloodshot",
    "value": {
      "gold": 0,
      "silver": 37,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Organ",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "light",
    "reagentState": "Pure"
  },
  {
    "id": "nisroch-bronze-talon",
    "name": "Nisroch Bronze-Talon",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A bronze-gold falcon talon, sharp and hot. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Claws/claw-segmented-fiery-black-orange",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 10
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Claw",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "abzu-glyph-water",
    "name": "Abzu Glyph-Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A flask of glowing water where cuneiform and hieroglyphs drift like fish. Enchanting and alchemy reagent for coolant and glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape-cork",
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
    "materialType": "Water",
    "professions": [
      "Enchanting",
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "water",
    "reagentState": "Pure"
  },
  {
    "id": "abzu-cooling-shard",
    "name": "Cooling Vault-Shard",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A cool shard of vault-stone that stays damp. Alchemy reagent for cooling draughts.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Stone",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Crystal",
    "magicType": "water",
    "reagentState": "Raw"
  },
  {
    "id": "kur-underworld-rune",
    "name": "Kur-Rune Fragment",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A fragment of the bottomless fissure's red runes. It murmurs with the voices of the dead. Enchanting reagent for underworld glyphs.",
    "iconId": "Misc/Profession Resources/Enchanting/resource-dark-brown-slab-pink-rune-inverted-v",
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
    "materialType": "Stone",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "kur-murmuring-ash",
    "name": "Murmuring Ash",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Black ash that whispers a name when stirred. Alchemy reagent for necromantic brews.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-pouch-bag-teardrop-pear-light-orange-beige-dark-knot-loop",
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
    "materialType": "Ash",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "shadow",
    "reagentState": "Raw"
  },
  {
    "id": "mushussu-horn-nub",
    "name": "Mushussu Horn-Nub",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A small blunt horn nub with a pale, fertile sheen. Cooking and alchemy: a growth tonic.",
    "iconId": "Misc/Monster Parts/Horns/horn-crescent-beige-segmented",
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
    "materialType": "Horn",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "mushussu-life-breath",
    "name": "Mushussu Life-Breath",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A bottled breath that doubles a crop's yield, once. Alchemy reagent for growth elixirs.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-blob-parchment-treasure-map-light-orange-beige-dark-shovel-pickaxe",
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
    "materialType": "Air",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "nature",
    "reagentState": "Pure"
  },
  {
    "id": "cinder-liar-ash",
    "name": "Liar-Cinder",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Burning ash from a caldera-child, smelling of someone's guilt. Alchemy reagent for truth-draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-sphere-bomb-potion-round-two-tone-light-creamy-yellow-pale-orange-upper-two-thirds-dark-reddish-orange-amber-lower-one-third-sharp-horizontal-line-dark-brown-stem-fuse-lighter-brown-tip",
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
    "materialType": "Ash",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "fire",
    "reagentState": "Raw"
  },
  {
    "id": "ash-oracle-soot-seer-veil",
    "name": "Soot-Seer Veil",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A faceless veil of volcanic ash woven into cloth. Prophecies cling to it. Tailoring and enchanting: weaves a veil of ash.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "oracle-ash-prophecy",
    "name": "Ash-Prophecy Flake",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A flake of grey ash with a prophecy written in it. Alchemy and enchanting reagent for divination.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-scroll-rolled-diagonal-light-beige-pale-orange-brown-stick-rod",
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
    "materialType": "Ash",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "arcane",
    "reagentState": "Raw"
  },
  {
    "id": "husque-void-leak",
    "name": "Husque Void-Leak",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A shard of absolute void that leaks the Sun-Eater's hunger. It must be kept in lead. Enchanting reagent: a gravity-distorting core.",
    "iconId": "Misc/Profession Resources/Gems/resource-dark-sphere-blue-crystal-shards-orbiting",
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
    "materialType": "Void",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "void",
    "reagentState": "Pure"
  },
  {
    "id": "breach-silhouette-cloth",
    "name": "Breach-Silhouette Cloth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A cloth with a silhouette of nothing woven into it. Tailoring: weaves a void-lined cloak.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-purple-rolled-fabric-silk",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  }
];
