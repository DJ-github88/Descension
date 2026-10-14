/**
 * Creature drops: Cragjaw Peaks
 *
 * Reagents, trophies and gear dropped by Cragjaw Peaks creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const CRAGJAW_PEAKS_DROPS = [
  {
    "id": "gold-ore-vein",
    "name": "Sulfur-Veined Gold Ore",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A coal-black chunk of ore with gold running through it like veins. A gaki will not share. Blacksmithing and jewelcrafting reagent; smelts into sun-gold.",
    "iconId": "Misc/Profession Resources/Mining/resource-gold-ore-rocky-cluster",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Ore",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Raw"
  },
  {
    "id": "gaki-starving-claw",
    "name": "Gaki Starving-Claw",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A coal-black claw with an unreasonable hunger for rust and ore. Blacksmithing: a scrapping tool.",
    "iconId": "Misc/Monster Parts/Claws/claw-green-two-pronged-talons",
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
    "materialType": "Claw",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "copper-weasel-claw",
    "name": "Copper Weasel-Claw",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A sickle-shaped copper claw. Sharp enough to part a hair from a head. Blacksmithing: an easy copper alloy.",
    "iconId": "Misc/Monster Parts/Claws/claw-segmented-fiery-black-orange",
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
    "materialType": "Metal",
    "professions": [
      "Blacksmithing",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "wind-gale-tail-blade",
    "name": "Wind-Gale Tail-Blade",
    "type": "weapon",
    "subtype": "SICKLE",
    "quality": "rare",
    "description": "A sickle-tail blade that sings in a breeze. It lands cuts you did not see coming.",
    "iconId": "Weapons/Sickles/sickle-fire-curved-blade-orange-yellow-red-handle",
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
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "agility": {
        "value": 2,
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
            "formula": "1d4",
            "damageType": "wind",
            "isDot": false,
            "targetType": "target",
            "areaRadius": 0
          }
        }
      }
    }
  },
  {
    "id": "cloud-feather",
    "name": "Storm-Cat Cloud-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A grey feather of cloud-wing that crackles faintly with static. Tailoring and enchanting: a storm-ward lining.",
    "iconId": "Misc/Profession Resources/Archaeology/resource-necklace-charms-feathers-bone",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 20
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
    "id": "kcoa-lightning-whisker",
    "name": "Lightning-Whisker",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A cat-whisker still crackling with lightning. Hold it very lightly. Alchemy and enchanting reagent for lightning effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-bubbles",
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
    "materialType": "Hair",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "lightning",
    "reagentState": "Pure"
  },
  {
    "id": "wind-copper-shards",
    "name": "Wind-Copper Shards",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Light, coppery shards that ring in a breeze. Blacksmithing and engineering: lightweight alloy filings.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-metallic-ingot-trapezoidal-bronze",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 46
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
    "gatheringMethod": "mining"
  },
  {
    "id": "tengu-voice-mimic-feather",
    "name": "Voice-Mimic Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A raven wing-feather that mimics the last voice it heard. Tailoring and enchanting: sound-casting thread.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-golden-swirling-entity-feathers-crest",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "frozen-star-crystal",
    "name": "Frozen Star-Crystal",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A starlight-eyed crystal from a snowstorm spirit, rimed in frost that never melts. Enchanting and alchemy reagent for frost spells.",
    "iconId": "Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny",
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
    "materialType": "Crystal",
    "professions": [
      "Enchanting",
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "frost",
    "reagentState": "Pure"
  },
  {
    "id": "storm-crow-stolen-voice",
    "name": "Stolen Voice-Quill",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A crow quill that holds a stolen voice. It cannot stop talking. Enchanting reagent for voice glyphs.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/purple-feather-quill",
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
    "materialType": "Feather",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wind",
    "reagentState": "Raw"
  },
  {
    "id": "storm-crow-feather",
    "name": "Storm-Crow Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A glossy black crow feather that echoes human voices. Fletching.",
    "iconId": "Armor/Leggings/leggings-wings-leaf-wood-brown-tan-beige-layered-feathers",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "boiler-tick-shell",
    "name": "Boiler-Tick Shell",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A heat-drained beetle shell. Cold to the touch. Engineering: pipe insulation.",
    "iconId": "Misc/Monster Parts/monster-part-eggshell-broken-golden-green-patterns",
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
    "materialType": "Chitin",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "stolen-steam-pearl",
    "name": "Stolen Steam-Pearl",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A pearl of condensed steam stolen from the pipeline. Alchemy and engineering: a pressure-reagent.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-figure-martial-arts-teal-pants",
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
    "materialType": "Steam",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Raw"
  },
  {
    "id": "sump-scrab-bowl",
    "name": "Glowing Sump-Bowl",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "The glowing bowl-shaped crest of a sump-scrab. It keeps water warm for hours.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-golden-bowl-basin-metallic-shiny",
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
    "tradeCategory": "curios",
    "origin": "Cragjaw Peaks",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "kappa-bowl-water",
    "name": "Kappa Bowl-Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "The glowing water from a kappa's head-bowl. It will not spill unless you bow. Alchemy reagent for strength tonics.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-classic-bottle",
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
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "water",
    "reagentState": "Pure"
  },
  {
    "id": "river-stone-hurl",
    "name": "River-Stone",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A smooth river stone a kappa has taken to throwing. Masonry.",
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
    "materialType": "Stone",
    "professions": [
      "Masonry"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "kitsune-fox-fire",
    "name": "Bottled Fox-Fire",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A blue flame in a glass vial. It shows you the face of someone you trust. Alchemy and enchanting reagent for illusions.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-pouch-bag-trapezoidal-light-beige-pale-orange-dark-closure-loop",
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
    "materialType": "Fire",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "fey",
    "reagentState": "Pure"
  },
  {
    "id": "kitsune-white-tail",
    "name": "Kitsune White Tail-Tuft",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A white tail-tuft that looks different to everyone who touches it. Tailoring and enchanting: weaves illusion-thread.",
    "iconId": "Misc/Profession Resources/Cooking/animal-hide-pelt-stretched-brown-golden",
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
    "materialType": "Hair",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "tsuchinoko-glacier-scale",
    "name": "Tsuchinoko Glacier-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A glacier-blue scale from a fat, winged serpent. Leatherworking.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-cluster-green-scales-leaves",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "sake-breath-flask",
    "name": "Sake-Breath Flask",
    "type": "consumable",
    "subtype": "DRINK",
    "quality": "uncommon",
    "description": "A flask of potent liquor the tsuchinoko will trade secrets for.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-vial-cylindrical-horizontal-gradient-red-orange-yellow-beige-cap",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "healthRestore": 4
    },
    "baseStats": {
      "charisma": {
        "value": 1,
        "isPercentage": false,
        "duration": 300
      },
      "agility": {
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
    "id": "faceless-wrap",
    "name": "Faceless Wrap",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A blank cloth where a face should be. Tailoring: a blank-weave lining.",
    "iconId": "Misc/Profession Resources/Tailoring/Buttons",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "stolen-span-fat",
    "name": "Rendered Span-Fat",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Body fat rendered to seal cracks in the bone Spans. Engineering and cooking: a stable sealant.",
    "iconId": "Misc/Profession Resources/Cooking/Food/Other/dinner-plate-meal",
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
    "materialType": "Fat",
    "professions": [
      "Engineering",
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "ice-ogre-club-core",
    "name": "Petrified Ice Club-Core",
    "type": "weapon",
    "subtype": "MAUL",
    "quality": "rare",
    "description": "A club of petrified ice, still cold. It hits like a landslide.",
    "iconId": "Weapons/Warhammer/warhammer-fire-explosive-yellow-orange-red",
    "value": {
      "gold": 0,
      "silver": 9,
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
        "diceType": "d10",
        "damageType": "frost",
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
            "damageType": "cold",
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
    "id": "tribute-ore-chunk",
    "name": "Tribute Ore-Chunk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Raw ore left as tribute. An ogre prefers copper. Blacksmithing: raw ore.",
    "iconId": "Misc/Profession Resources/Mining/resource-ore-chunk-teal-brown-patches",
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
    "materialType": "Ore",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "jorogumo-gold-silk",
    "name": "Gold-Silk Skein",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A skein of gold-and-silver spider silk, woven by a spider-woman for her gown. Tailoring: the finest thread in the Peaks.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-golden-brown-thread-twine",
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
    "materialType": "Silk",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "needle-fang",
    "name": "Jorogumo Needle-Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A needle-thin fang that drained a miner of his mineral-rich blood. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-teeth-cluster-sharp-yellowish-orange",
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
    "materialType": "Tooth",
    "professions": [
      "Jewelcrafting",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "kodama-quartz-eye",
    "name": "Kodama Quartz-Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A small quartz eye. It echoes in a cavern. Enchanting reagent for echo glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-dark-sphere-blue-crystal-shards-orbiting",
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
    "materialType": "Crystal",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Raw"
  },
  {
    "id": "mountain-echo-snow",
    "name": "Echo-Snow",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Snow that echoes your voice back a second later. Alchemy and enchanting reagent for sound.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-tag-pouch-light-brown-beige-dark-brown-loop-handle",
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
    "materialType": "Snow",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "frost",
    "reagentState": "Raw"
  },
  {
    "id": "nurikabe-cliff-block",
    "name": "Living Cliff-Block",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A squared block of living cliff. It mutters when you ignore it. Masonry: a self-settling building block.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
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
    "materialType": "Stone",
    "professions": [
      "Masonry"
    ],
    "gatheringMethod": "quarrying"
  },
  {
    "id": "nurikabe-copper-sand",
    "name": "Copper-Disruption Sand",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "Copper sand that disturbs a living wall. A pinch freezes it in place. Alchemy and masonry reagent for disruption.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-hashtag-bone-pretzel-cross-light-brown-beige-dark-mark-top-right",
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
    "materialType": "Sand",
    "professions": [
      "Alchemy",
      "Masonry"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "earth",
    "reagentState": "Processed"
  },
  {
    "id": "nue-black-cloud",
    "name": "Bottled Nightmare-Cloud",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A black storm-cloud in a vial. It smells of warm, humid fear. Alchemy reagent for nightmare draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-pants-overalls-olive-green-beige-upper-golden-glow",
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
    "materialType": "Air",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "nue-chimera-hide",
    "name": "Chimera Patch-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A patchwork of monkey, tiger and raccoon-dog hide, all stitched. Leatherworking.",
    "iconId": "Misc/Monster Parts/Hide/hide-rolled-dark-teal-scaly",
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
    "materialType": "Hide",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "kasha-blue-flame",
    "name": "Kasha Blue-Flame Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A blue-white ember from a corpse-thief cat. It lights without heat. Alchemy and enchanting: a cold-fire reagent.",
    "iconId": "Weapons/Swords/sword-fire-red-blade-golden-guard-teal-gems",
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
    "materialType": "Fire",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "kasha-funeral-miniature",
    "name": "Funeral Miniature",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A tiny magical figurine left in place of a stolen corpse. It brings luck to the worthy.",
    "iconId": "Container/Vase/pot-vase-brown-beige-bulbous",
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
    "tradeCategory": "charms",
    "origin": "Cragjaw Peaks",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "tanuki-stone-carving",
    "name": "Tanuki Stone Carving",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A round little stone carving that brings fortune to friends of a tanuki.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
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
    "tradeCategory": "charms",
    "origin": "Cragjaw Peaks",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "tanuki-leaf-hat",
    "name": "Tanuki Leaf-Hat",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A green leaf that turns into a hat, or a coin, or a regret. Alchemy and cooking herb.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/autumn-maple-leaf_1",
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
    "materialType": "Leaf",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "ushioni-sulfur-web",
    "name": "Ushioni Sulfur-Web",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A sulfur-smelling web, sticky and heat-resistant. Tailoring and engineering: heat-proof cordage.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp",
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
    "materialType": "Silk",
    "professions": [
      "Tailoring",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "ushioni-bull-horn",
    "name": "Ushioni Bull-Horn",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A Wyrd-touched bull horn, volcanic in sheen. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Horns/horn-golden-brassy-curved",
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
    "id": "baku-nightmare-ink",
    "name": "Baku Nightmare-Ink",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "The digested ink of a thousand devoured nightmares. It numbs terror. Alchemy reagent for calm and courage.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-snail-enclosed-shell-beige-body-head-stalk-brown-eye",
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
    "materialType": "Ink",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "baku-glowing-hide",
    "name": "Baku Glowing-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A pale, softly glowing hide. Nightmares do not come near it. Leatherworking and tailoring: dream-ward linings.",
    "iconId": "Misc/Monster Parts/Hide/hide-fragment-teal-textured-severed",
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
    "materialType": "Hide",
    "professions": [
      "Leatherworking",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nekomata-twin-tail",
    "name": "Nekomata Tail-Fur",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A storm-grey tail-tuft that crackles in a blizzard. Tailoring.",
    "iconId": "Misc/Profession Resources/Cooking/animal-hide-rug-boar-tusks-splayed-limbs",
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
    "gatheringMethod": "skinning"
  },
  {
    "id": "nekomata-static-whisker",
    "name": "Static Whisker",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "A twin-tail whisker that carries static. Alchemy and engineering.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-elongated",
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
    "materialType": "Hair",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "lightning",
    "reagentState": "Raw"
  },
  {
    "id": "futakuchi-second-mouth-lock",
    "name": "Second-Mouth Lock",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A lock of hair that grew over a hungry second mouth.",
    "iconId": "Misc/Monster Parts/Cut off hair",
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
    "origin": "Cragjaw Peaks",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "devoured-ration-crumb",
    "name": "Devoured Ration-Crumb",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "common",
    "description": "Crumbs of a ration devoured whole by something hungry.",
    "iconId": "Misc/Profession Resources/Cooking/animal-banana-overripe-brown-peel",
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
    "junkType": "food",
    "condition": "worn"
  },
  {
    "id": "wanyudo-soul-wheel-spoke",
    "name": "Soul-Wheel Spoke",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A blue-fire spoke from a wheel of screaming faces. Enchanting: a soul-binding core.",
    "iconId": "Weapons/Chakram/chakram-simple-ring-brown",
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
    "materialType": "Fire",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "cold-fire-cinder",
    "name": "Cold-Fire Cinder",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A cinder of blue-white fire that gives off cold. Alchemy reagent for cold-fire effects.",
    "iconId": "Misc/Profession Resources/Gems/resource-fire-crystal-gem-orange-red-beige",
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
    "materialType": "Fire",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "frost",
    "reagentState": "Raw"
  },
  {
    "id": "tsuchigumo-gem-eye",
    "name": "Tsuchigumo Gem-Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A cut gemstone from a spider of living stone. Its facets glitter with a false wealth. Jewelcrafting and enchanting reagent for illusion of wealth.",
    "iconId": "Misc/Profession Resources/Gems/resource-fiery-crystal-cluster-shards-orange-yellow",
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
    "materialType": "Gem",
    "professions": [
      "Jewelcrafting",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Pure"
  },
  {
    "id": "molten-gold-silk",
    "name": "Molten-Gold Silk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Spider silk spun from molten gold, still warm. Tailoring and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-golden-brown-thread-twine",
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
    "materialType": "Silk",
    "professions": [
      "Tailoring",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "akaname-copper-tongue",
    "name": "Akaname Copper-Tongue",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long copper-skinned tongue that licks pipes clean. Alchemy and engineering: a self-cleaning brush.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-golden-yellow-furry-red-orange-tail",
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
    "materialType": "Flesh",
    "professions": [
      "Engineering",
      "Alchemy"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "inugami-hair-collar",
    "name": "Inugami Hair-Collar",
    "type": "accessory",
    "subtype": "NECKLACE",
    "quality": "epic",
    "description": "A hound-collar of human hair that binds a blue-lit spirit to a family.",
    "iconId": "Armor/Neck/fiery-orb-amulet",
    "value": {
      "gold": 0,
      "silver": 39,
      "copper": 0
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
        "value": 2,
        "isPercentage": false
      }
    }
  },
  {
    "id": "blue-hound-fur",
    "name": "Blue-Lit Hound Fur",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Spectral blue fur that glows in the dark. Tailoring and enchanting.",
    "iconId": "Misc/Profession Resources/Cooking/animal-hide-rug-boar-tusks-splayed-limbs",
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
    "materialType": "Fur",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "ittan-embroidery-scrap",
    "name": "Ittan-Momen Embroidery",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A strip of living embroidered cloth that squirms in the hand. Tailoring: a living lining.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-folded-light-brown-material",
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
    "id": "chasm-message-ribbon",
    "name": "Chasm-Message Ribbon",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A ribbon that carries a message across a chasm, once.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-orange-yellow-striped-ribbon",
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
    "origin": "Cragjaw Peaks",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  }
];
