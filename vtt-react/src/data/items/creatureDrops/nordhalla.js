/**
 * Creature drops: Nordhalla
 *
 * Reagents, trophies and gear dropped by Nordhalla creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const NORDHALLA_DROPS = [
  {
    "id": "salvaged-copper",
    "name": "Salvaged Ship-Copper",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Green-crusted copper sheathing pried from a sunken hull. A skerry hoards it like gold. Blacksmithing: smelts into serviceable copper ingots.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-ingot-reddish-orange-golden-outline",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 45
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
    "id": "skerry-sunken-pearl",
    "name": "Sunken Greed-Pearl",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A perfect grey pearl the shipwright-sprite could not bear to melt. It feels heavier each time you check it.",
    "iconId": "Misc/Profession Resources/Gems/resource-light-blue-pearl-grey-casing",
    "value": {
      "gold": 0,
      "silver": 11,
      "copper": 50
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "gems",
    "origin": "Nordhalla",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "soot-feather",
    "name": "Soot-Raven Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A pitch-black feather that leaves a smear of cinders on the hand. Fletching; a pinch of soot makes a decent ash-ink.",
    "iconId": "Misc/Profession Resources/Archaeology/resource-necklace-charms-feathers-bone",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nachtkrapp-coal-bone",
    "name": "Coal-Snatcher's Skull Cap",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "The charcoal-black bone crown of a soot-raven. It stays warm in the hand for hours. Blacksmithing: a long-burning forge-fuel charm.",
    "iconId": "Misc/Monster Parts/Bones/bone-bird-skull-red-gem",
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
    "materialType": "Bone",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "glacier-ice-shard",
    "name": "Glacier Ice Shard",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "A shard of blue glacier-ice that does not melt in a warm hand. Alchemy reagent for frost resistance elixirs.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Ice",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "frost",
    "reagentState": "Raw"
  },
  {
    "id": "runic-lick-frost",
    "name": "Rune-Licked Frost",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Scraped from a runestone a glacier gremlin has been licking. The rune is slightly fainter. Enchanting reagent: strips and rewrites weak runes.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-tilted-beige",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Frost",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "frost",
    "reagentState": "Processed"
  },
  {
    "id": "river-kelp",
    "name": "River-Kelp",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Dripping green kelp from a water-horse's mane. It smells of cold rivers. Cooking and tailoring: a waterproof fibre.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-green-leaf-orange-brown-edges-veins",
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
    "materialType": "Plant",
    "professions": [
      "Cooking",
      "Tailoring"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "nokk-mist-bridle",
    "name": "Nokk's Mist-Bridle",
    "type": "accessory",
    "subtype": "TRINKET",
    "quality": "epic",
    "description": "A bridle of river-mist and wet leather. Riders who wear it can breathe underwater for a little while.",
    "iconId": "Armor/Waist/red-teal-square-belt",
    "value": {
      "gold": 0,
      "silver": 36,
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
        "value": 1,
        "isPercentage": false
      },
      "constitution": {
        "value": 1,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    },
    "combatStats": {
      "resistances": {
        "cold": {
          "value": 3,
          "isPercentage": false
        }
      }
    }
  },
  {
    "id": "ram-skull-fiddle-bow",
    "name": "Ram-Skull Fiddle-Bow",
    "type": "weapon",
    "subtype": "HARP",
    "quality": "rare",
    "description": "A fiddle-bow strung with ram-gut, its frog carved from a skull. It thaws what it touches.",
    "iconId": "Instruments/Trumpet/trumpet-bugle-brass-golden",
    "value": {
      "gold": 0,
      "silver": 15,
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
        "damageType": "frost",
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "charisma": {
        "value": 2,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "fossegrim-ice-rosin",
    "name": "Fossegrim Ice-Rosin",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Rosin made from fiddle-ice. A little on a bowstring makes any tune sound like a waterfall. Enchanting reagent for instrument glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-rounded-base",
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
    "materialType": "Resin",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "frost",
    "reagentState": "Processed"
  },
  {
    "id": "condensed-nightmare-frost",
    "name": "Condensed Nightmare-Frost",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Black frost that forms on the chest of a sleeper. A faint wrongness lingers near it. Alchemy reagent for sleep draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-half-full-light-blue-beige",
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
    "materialType": "Frost",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "shadow",
    "reagentState": "Raw"
  },
  {
    "id": "mare-hoofprint-ice",
    "name": "Mare's Hoofprint Ice",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A slab of black ice with a perfect hoofprint pressed into it. Masonry and enchanting inlay.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Ice",
    "professions": [
      "Masonry",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "frozen-iron-chain-link",
    "name": "Frozen Iron Chain-Link",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A heavy iron link frosted over by the punisher's chains. It never quite warms. Blacksmithing: forges into binding chains and fetters.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-chain-metallic-bronze-links",
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
    "materialType": "Metal",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "krampus-birch-switch",
    "name": "Punisher's Birch Switch",
    "type": "weapon",
    "subtype": "STAFF",
    "quality": "rare",
    "description": "A birch whip bound in iron. It leaves a mark only oath-breakers can see.",
    "iconId": "Weapons/Halberd/halberd-staff-fire-accents-beige-head",
    "value": {
      "gold": 0,
      "silver": 7,
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
            "damageType": "frost",
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
    "id": "drowned-fjord-rime",
    "name": "Drowned Fjord-Rime",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Blue-white rime from a skreika's skin. It numbs whatever it touches. Alchemy reagent for frostbite salves.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-diagonal-tilted-teal-two-thirds",
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
    "materialType": "Frost",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "frost",
    "reagentState": "Raw"
  },
  {
    "id": "frost-fever-vial",
    "name": "Vial of Frost-Fever",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A sealed vial of a skreika's breath. Alchemists dilute it for fevers, and its curse for travellers. Alchemy reagent for plague draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-diagonal-tilted-beige-glass-brown-stopper",
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
    "materialType": "Liquid",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "plague",
    "reagentState": "Raw"
  },
  {
    "id": "warmth-thief-husk",
    "name": "Warmth-Thief Husk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "The dry chitin of a hearth-parasite. Hot to hold even in a blizzard. Blacksmithing and cooking: an insulating liner.",
    "iconId": "Misc/Monster Parts/monster-part-shell-fragment-grey-segmented",
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
    "materialType": "Chitin",
    "professions": [
      "Blacksmithing",
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "stolen-hearth-ember",
    "name": "Stolen Hearth-Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A coal that has burned a whole winter with no fuel. Rimors stored warmth like a miser. Alchemy and blacksmithing: a self-feeding ember.",
    "iconId": "Weapons/Sickles/sickle-bow-fire-red-orange-jagged-spiky-green-brown-grip-gems",
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
    "materialType": "Ember",
    "professions": [
      "Alchemy",
      "Blacksmithing"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "fire",
    "reagentState": "Pure"
  },
  {
    "id": "glacier-echo-ice",
    "name": "Echoing Glacier-Ice",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Clear blue ice that repeats the last scream it heard, softly, when struck. Enchanting reagent for echo-ward glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Ice",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "frost",
    "reagentState": "Pure"
  },
  {
    "id": "stel-death-scream-shard",
    "name": "Death-Scream Shard",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A shard of ancient ice that plays a recording of a death. Better not to listen.",
    "iconId": "Misc/Profession Resources/Gems/resource-three-crystal-shards-blue-teal-beige",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Nordhalla",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "klabater-caulk-mallet",
    "name": "Klabater's Caulk-Mallet",
    "type": "weapon",
    "subtype": "MAUL",
    "quality": "uncommon",
    "description": "A tiny shipwright's mallet that always lands on the nail. Hull-planks tighten when it hits.",
    "iconId": "Weapons/Warhammer/warhammer-mace-spiked-bloody-beige-red",
    "value": {
      "gold": 0,
      "silver": 4,
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
    "id": "foam-sealed-tallow",
    "name": "Foam-Sealed Tallow",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Shipwrights' tallow frozen into waxy blocks. Seals a hull and greases a door. Blacksmithing and engineering: seals joints and hulls.",
    "iconId": "Misc/Profession Resources/Cooking/Food/Fruit/orange-peach",
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
    "materialType": "Fat",
    "professions": [
      "Engineering",
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "perchten-frozen-mask",
    "name": "Perchten Frozen Mask",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "epic",
    "description": "An ice mask carved with a stern, still face. It judges those who hold it for too long.",
    "iconId": "Currency/ice-crystal-skull",
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
    "tradeCategory": "curios",
    "origin": "Nordhalla",
    "demandLevel": "High",
    "qualityGrade": "Masterwork"
  },
  {
    "id": "procession-bell-chip",
    "name": "Procession Bell-Chip",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A chip from a frozen cow-bell carried in the winter procession. It rings only when something is amiss. Enchanting reagent for judgment-ward glyphs.",
    "iconId": "Currency/golden-bell-clapper",
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
    "materialType": "Metal",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "helhest-bone-hoof",
    "name": "Helhest's Third Hoof",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "The white-ice third leg of the death-horse. Hold it near a grave and it points at the sleeper below. Enchanting and blacksmithing: a death-warding core.",
    "iconId": "Misc/Monster Parts/Bones/monster-part-bones-shards-three-white-fragments",
    "value": {
      "gold": 0,
      "silver": 34,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Bone",
    "professions": [
      "Enchanting",
      "Blacksmithing"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "plague-hoof-chip",
    "name": "Plague-Hoof Chip",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A chip of frozen hoof that smells faintly of plague. Alchemy reagent for plague draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-double-spout-two-necks-beige-glass-brown-corks",
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
    "materialType": "Bone",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "plague",
    "reagentState": "Raw"
  },
  {
    "id": "myling-rune-ice",
    "name": "Burden-Rune Ice",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Ice stamped with the infant-spirit's runes. It weighs ten times what it should. Enchanting reagent for weight-glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 90
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
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "hearth-warmed-swaddle",
    "name": "Hearth-Warmed Swaddle",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A frozen scrap of swaddling cloth that thaws and relaxes when set by a hearth. Tailoring: a warm lining.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "jutul-granite-heart",
    "name": "Troll Granite-Heart",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A warm core of living granite. It hums when struck, and keeps humming. Blacksmithing and masonry: a heat-retaining core.",
    "iconId": "Misc/Profession Resources/Gems/resource-geode-fossil-brown-beige-orange-outline",
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
    "materialType": "Stone",
    "professions": [
      "Blacksmithing",
      "Masonry"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Raw"
  },
  {
    "id": "iron-toll-tithe",
    "name": "Iron Toll-Tithe",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A dented iron bar left as a toll. Trolls insist on the weight. Blacksmithing: iron stock.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-bar-ingot-light-beige-golden",
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
      "Blacksmithing"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "lindwyrm-glacier-scale",
    "name": "Lindwyrm Glacier-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A cold, pale scale thawed from a tunnelling glacier-worm. Stays frosty in a furnace. Leatherworking and blacksmithing: frost-ward plating.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-blue-scales-cluster-patch",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "lindwyrm-fang-sabre",
    "name": "Lindwyrm Fang-Sabre",
    "type": "weapon",
    "subtype": "SABER",
    "quality": "epic",
    "description": "A curved fang set in a bone hilt. It leaves a white scar that does not heal until the thaw.",
    "iconId": "Weapons/Swords/sword-fire-gradient-red-orange-yellow-teal-guard",
    "value": {
      "gold": 0,
      "silver": 36,
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
        "damageType": "slicing",
        "bonusDamage": 3
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
    "id": "root-worm-rune-bark",
    "name": "Root-Worm Rune-Bark",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Warm root-bark gnawed by a world-worm, covered in half-eaten oath-runes. Enchanting reagent for broken-oath glyphs.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-roots-wood-moss-covered-beige-green-three",
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
    "materialType": "Root",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Herb",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "foundation-gnaw-grit",
    "name": "Foundation-Gnaw Grit",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Pale grit left by a burrowing worm-gnaw. Masonry: a very fine stone aggregate.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-rocks-ore-rubble-brown",
    "value": {
      "gold": 0,
      "silver": 0,
      "copper": 25
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
    "gatheringMethod": "mining"
  },
  {
    "id": "strand-barnacle-crust",
    "name": "Strand Barnacle-Crust",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A salt-hard crust of barnacles off a drowned corpse. Lots of rope fibre in it. Tailoring and cooking: salt and fibre.",
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
    "materialType": "Shell",
    "professions": [
      "Cooking",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "drowned-sailor-purse",
    "name": "Drowned Sailor's Purse",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A waterlogged purse that still jingles. The coins inside are a decade out of date.",
    "iconId": "Container/Pouch/tan-tied-sack",
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
    "tradeCategory": "curios",
    "origin": "Nordhalla",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "landvaettir-granite-heart",
    "name": "Landvaettir Granite-Heart",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A fist-sized core of mountain granite shot through with snow-white crystal. Masonry and enchanting: a guardian-ward core.",
    "iconId": "Misc/Profession Resources/Gems/resource-geode-fossil-brown-beige-orange-outline",
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
    "materialType": "Stone",
    "professions": [
      "Masonry",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "earth",
    "reagentState": "Pure"
  },
  {
    "id": "avalanche-snow-crystal",
    "name": "Avalanche Snow-Crystal",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A snow-crystal that rings when you step too loudly. Avalanche-bait. Alchemy reagent for frost and sound.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Snow",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "frost",
    "reagentState": "Raw"
  },
  {
    "id": "vettir-storm-whisper",
    "name": "Bottled Storm-Whisper",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A stoppered vial of winter wind, with something faintly speaking inside. Alchemy and enchanting reagent for wind effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-classic-shape",
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
    "id": "glacier-crystal-cut",
    "name": "Flawless Glacier-Crystal",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A glacier-crystal cut by a bergthrall to a perfect facet. Not a single bubble. Jewelcrafting reagent: a clear lens-stone.",
    "iconId": "Misc/Profession Resources/Gems/resource-purple-crystal-cluster-wand-shard",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 50
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Crystal",
    "professions": [
      "Jewelcrafting",
      "Enchanting"
    ],
    "gatheringMethod": "mining",
    "reagentType": "Crystal",
    "magicType": "frost",
    "reagentState": "Processed"
  },
  {
    "id": "bergfolk-chisel",
    "name": "Bergfolk Chisel",
    "type": "weapon",
    "subtype": "DAGGER",
    "quality": "uncommon",
    "description": "A stone-cutter's chisel, tiny and ridiculously sharp.",
    "iconId": "Weapons/Hoe/hoe-pickaxe-dark-handle-light-head-pointed",
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
        "damageType": "stabbing",
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "agility": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "fenris-gleipnir-fibre",
    "name": "Gleipnir Fibre",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A thread from the binding of an apocalyptic wolf. It is neither strong nor light: it is exactly as strong as it needs to be. Tailoring and enchanting: bindings that hold anything.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-rolled-green-fabric-material",
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
    "materialType": "Thread",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "wolf-cub-fang",
    "name": "Bound Wolf-Cub Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A pony-sized cub's milk-fang. It still bites. Leatherworking and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-orange-creature-mouth-teeth-spikes",
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
    "materialType": "Tooth",
    "professions": [
      "Leatherworking",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "disir-spindle-whorl",
    "name": "Disir Spindle-Whorl",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A spindle whorl of pale bone, still wound with ancestral thread. Tailoring: weaves ancestral cloth.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-teal-green-thread-yarn",
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
    "materialType": "Bone",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "ancestral-hair-lock",
    "name": "Ancestral Hair-Lock",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A lock of silver hair, carefully curled. Ancestors do not like to be cut short of their dignity. Tailoring: a symbol of lineage.",
    "iconId": "Misc/Monster Parts/Cut off hair",
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
    "materialType": "Hair",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "valravn-heart-shard",
    "name": "Valravn Heart-Shard",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A shrivelled raven-wolf heart. Eating one grants intelligence and a bad conscience. Alchemy reagent for cunning draughts.",
    "iconId": "Misc/Monster Parts/Organs/organ-heart-human-red-orange-beige-vessels",
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
    "materialType": "Organ",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Organ",
    "magicType": "shadow",
    "reagentState": "Raw"
  },
  {
    "id": "valravn-wing-feather",
    "name": "Valravn Wing-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long black raven feather with a faint red glow at the root. Fletching: carries scent.",
    "iconId": "Misc/Monster Parts/Feathers/feather-single-blue-iridescent",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "kraken-tentacle-ice",
    "name": "Kraken Tentacle-Hide",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A thick, ridged tentacle hide that grips even when frozen. Leatherworking: grip-wraps and boots.",
    "iconId": "Misc/Monster Parts/monster-part-tentacle-blue-bulbous-brown-end",
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
    "materialType": "Hide",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "kraken-ink-vial",
    "name": "Kraken Ink-Vial",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "Black, icy ink that stays liquid at any temperature. Alchemy and enchanting reagent; the ink of dark runes.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-serpent-creature-wrapped-bone-shell-hole",
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
    "id": "kraken-beak-tip",
    "name": "Kraken Beak-Tip",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "The black chitin tip of an ice-breaking beak. Nothing is stronger, nothing is sharper. Blacksmithing: a weapon core.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged",
    "value": {
      "gold": 0,
      "silver": 35,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Chitin",
    "professions": [
      "Blacksmithing",
      "Engineering"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "merman-bone-harp-string",
    "name": "Bone-Harp String",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A silver string from a merman's harp. It sings when the sea is about to speak. Enchanting and instrument-crafting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-golden-brown-thread-twine",
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
    "materialType": "Gut",
    "professions": [
      "Enchanting",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "captured-melody-vial",
    "name": "Captured Melody Vial",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A glass vial with a tune humming inside, sulking at being kept. Enchanting reagent for song-glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-half-full",
    "value": {
      "gold": 0,
      "silver": 8,
      "copper": 30
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Sound",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "scrimshaw-necklace",
    "name": "Scrimshaw Necklace",
    "type": "accessory",
    "subtype": "NECKLACE",
    "quality": "uncommon",
    "description": "A scrimshaw pendant carved with the face of whichever form the wearer fears least.",
    "iconId": "Armor/Neck/fiery-orb-amulet",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 40
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
      "charisma": {
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
    "id": "serpent-scale-frost",
    "name": "Frost-Serpent Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A blue serpent scale with a frost-feather edge. Leatherworking and blacksmithing.",
    "iconId": "Misc/Monster Parts/Scales/scale-fragment-teal-blue-bumps",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "huldra-hollow-bark",
    "name": "Hollow-Back Bark",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Tree-bark from the hollow where a huldra's spine should be. It holds a faint warmth. Tailoring and woodworking: scented lining.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-block-wooden-isometric-grain",
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
    "materialType": "Wood",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "huldra-cow-tail-tuft",
    "name": "Huldra Tail-Tuft",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A cow-tail tuft that keeps flies away and woodcutters under a spell. Leatherworking: a fine brush fibre.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-jagged",
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
    "materialType": "Hair",
    "professions": [
      "Leatherworking",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  }
];
