/**
 * Creature drops: Bryngloom Forest
 *
 * Reagents, trophies and gear dropped by Bryngloom Forest creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const BRYNGLOOM_FOREST_DROPS = [
  {
    "id": "willow-veil",
    "name": "Willow Veil",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A veil of living willow-fronds that sways to a wind no one else feels. Vila weave it for dancing. Tailoring and enchanting: weaves storm-light cloaks.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-rolled-green-fabric-material",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "vila-storm-dancer-feather",
    "name": "Storm-Dancer Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A feather that follows a wind-dance. Tailoring.",
    "iconId": "Misc/Monster Parts/Feathers/feather-fiery-orange-red-yellow",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bog-moss-remedy",
    "name": "Bog-Moss Remedy",
    "type": "consumable",
    "subtype": "POTION",
    "quality": "uncommon",
    "description": "A poultice of peat-pool moss that mends small wounds and soothes fever.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-organic-irregular-beige-tilted",
    "value": {
      "gold": 0,
      "silver": 1,
      "copper": 90
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "healthRestore": 12
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 1
      }
    }
  },
  {
    "id": "vodyan-stagnant-water",
    "name": "Stagnant-Pool Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "A vial of stagnant water. It is alive. Alchemy reagent for poison brews.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-orb-flask-round-beige-upper-green-lower-brown-stopper-tag",
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
    "materialType": "Water",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "screamer-horn",
    "name": "Screamer's Horn",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A curved swamp-screamer's horn. Blown, it deafens at fifty paces. Blacksmithing and instrument-crafting.",
    "iconId": "Misc/Monster Parts/Horns/horn-light-brown-wrapped-cord",
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
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bukavac-six-claw",
    "name": "Six-Claw Grasp-Tip",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "One of six sharp claws, with mud still drying in the grooves. Blacksmithing.",
    "iconId": "Misc/Monster Parts/Claws/claw-green-two-pronged-talons",
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
    "materialType": "Claw",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "hag-relic",
    "name": "Swamp Relic",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A swamp relic locked in a walking chest: a ring, a rotting tooth, a handful of bones.",
    "iconId": "Container/Chest/stone-block-chest",
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
    "tradeCategory": "curios",
    "origin": "Bryngloom Forest",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "chicken-leg-talon",
    "name": "Chicken-Leg Talon",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A scaly chicken-leg talon, sharp as a hatchet. Blacksmithing and leatherworking.",
    "iconId": "Misc/Monster Parts/Claws/claw-segmented-fiery-black-orange",
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
    "materialType": "Claw",
    "professions": [
      "Blacksmithing",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "hag-cooking-pot",
    "name": "Hag's Cooking Pot",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A blackened iron pot that simmers a stew of ill luck. It smells wonderful, which is the problem.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-golden-pot-jar-urn-honey",
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
    "tradeCategory": "curios",
    "origin": "Bryngloom Forest",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "one-eye-misfortune-lens",
    "name": "One-Eye Misfortune-Lens",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A single large eye lens that carries a hag's misfortune. Enchanting reagent for curse and luck glyphs.",
    "iconId": "Misc/Monster Parts/Organs/organ-eyeball-optic-nerve-teal-iris-beige-sclera",
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
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "leshara-heartwood",
    "name": "Leshara Heartwood",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "The living heartwood of a twelve-foot forest guardian. It still grows if watered. Woodworking, blacksmithing and enchanting: a living-wood core.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-plank-wooden-diagonal-knots",
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
    "materialType": "Wood",
    "professions": [
      "Engineering",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "forest-fungus-crown",
    "name": "Forest Fungus-Crown",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A bracket fungus grown on a forest guardian's brow. Alchemy and cooking.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-mushroom-red-cap-spotted-beige-stem",
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
    "materialType": "Fungus",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "herbalism",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "rusalka-bone-comb",
    "name": "Rusalka's Bone Comb",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A comb of bone. A rusalka's songs are in its teeth.",
    "iconId": "Misc/Monster Parts/Bones/monster-part-bones-fragments-pile-off-white",
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
    "tradeCategory": "charms",
    "origin": "Bryngloom Forest",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "bog-nymph-tear",
    "name": "Bog-Nymph Tear",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A melancholy tear shed by a bog-nymph. Alchemy reagent for sorrow draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/cyan-potion-bottle",
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
    "materialType": "Tear",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "strigoi-canopy-fang",
    "name": "Strigoi Canopy-Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A pale fang from a winged corpse-spirit. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-orange-creature-mouth-teeth-spikes",
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
    "materialType": "Tooth",
    "professions": [
      "Jewelcrafting",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "fever-touch-dust",
    "name": "Fever-Touch Dust",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "Red dust that gives a mild fever if breathed in. Alchemy reagent for fever and plague.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-creature-crustacean-insect-multi-limbed-segmented-irregular-organic-light-beige-yellow-head-top-right-dark-eye-antenna-horn-angular-spiky-protrusions-limbs-deep-reddish-orange-curved-claw-tail-bottom-left",
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
    "materialType": "Dust",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "blight",
    "reagentState": "Raw"
  },
  {
    "id": "domovoi-hearth-tuft",
    "name": "Domovoi Hearth-Tuft",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A hairy tuft from a two-foot hearth guardian. It smells of warm bread. Tailoring and cooking.",
    "iconId": "Misc/Monster Parts/Hide/hide-golden-yellow-rectangular-bumpy",
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
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "household-ledger-page",
    "name": "Household Ledger-Page",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A page from a hearth-spirit's record of the household's deeds.",
    "iconId": "Misc/Books/book-open-reddish-brown-pages",
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
    "origin": "Bryngloom Forest",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "kikimora-silk-tangle",
    "name": "Kikimora Silk-Tangle",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A tangle of spirit-silk that knots itself against a lie. Tailoring.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-twine",
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
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "mischief-spindle",
    "name": "Mischief Spindle",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A spindle that spins the wrong way at night. Tailoring and enchanting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-teal-green-thread-yarn",
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
    "materialType": "Wood",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "zmey-triple-scale",
    "name": "Zmey Triple-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A swamp-green scale from a three-headed dragon. Leatherworking and blacksmithing.",
    "iconId": "Misc/Monster Parts/Scales/scale-golden-ridged-bean-shaped",
    "value": {
      "gold": 0,
      "silver": 45,
      "copper": 0
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
    "gatheringMethod": "rare"
  },
  {
    "id": "lost-contract-fragment",
    "name": "Lost-Contract Fragment",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A fragment of a lost contract the dragon hoarded. The signature is faded.",
    "iconId": "Misc/Books/book-torn-parchment-gibberish-text",
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
    "origin": "Bryngloom Forest",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "firebird-glow-feather",
    "name": "Firebird Glow-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A luminous feather that repels serpents. It stays warm in the cold. Tailoring and enchanting.",
    "iconId": "Weapons/Hoe/hoe-tomahawk-green-wrapped-red-feathers",
    "value": {
      "gold": 0,
      "silver": 45,
      "copper": 0
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
    "gatheringMethod": "rare"
  },
  {
    "id": "canopy-warm-ember",
    "name": "Canopy Warm-Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A warm golden ember shed from a sun-bird. Alchemy reagent for warmth draughts.",
    "iconId": "Weapons/Sickles/sickle-bow-fire-red-orange-jagged-spiky-green-brown-grip-gems",
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
    "magicType": "ember",
    "reagentState": "Raw"
  },
  {
    "id": "naga-root-scale",
    "name": "Naga Root-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A scale from a half-serpent lord of the deep earth. It smells of rain. Leatherworking.",
    "iconId": "Misc/Monster Parts/Scales/monster-part-scales-cluster-teal-translucent",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "naga-water-venom",
    "name": "Naga Root-Venom",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A venom that turns roots to sap. Alchemy reagent for plant and venom brews.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-fish-bass-leaping-curved-olive-green-beige-belly",
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
    "materialType": "Venom",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "preta-hunger-bead",
    "name": "Preta Hunger-Bead",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A small bead from a hungry ghost's pinhole mouth. It consumes whatever it is placed near. Alchemy reagent for hunger draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-star-five-pointed-beige-green-split-sprout",
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
    "materialType": "Bead",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "hollow-greed-coin",
    "name": "Hollow Greed-Coin",
    "type": "miscellaneous",
    "subtype": "JUNK",
    "quality": "common",
    "description": "A coin as hollow as the ghost that held it.",
    "iconId": "Currency/gold-coin-embossed",
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
    "junkType": "coin",
    "condition": "worn"
  },
  {
    "id": "gamayun-prophetic-feather",
    "name": "Gamayun Prophecy-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A twilight feather that records a prophecy no one wants. Enchanting and tailoring: a prophecy-ward quill.",
    "iconId": "Misc/Monster Parts/Feathers/feather-fiery-orange-red-yellow",
    "value": {
      "gold": 0,
      "silver": 46,
      "copper": 0
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
    "gatheringMethod": "rare"
  },
  {
    "id": "gamayun-sorrow-song-vial",
    "name": "Sorrow-Song Vial",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A glass vial of a prophet's sorrowful song. Enchanting reagent for song-glyphs.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-tilted-bulbous",
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
    "id": "chort-cloven-hoof",
    "name": "Chort Cloven-Hoof",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A cloven hoof-shard from a crossroads trickster. Blacksmithing and leatherworking.",
    "iconId": "Misc/Monster Parts/Horns/horn-golden-brassy-curved",
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
    "materialType": "Hoof",
    "professions": [
      "Blacksmithing",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "crossroads-wager-token",
    "name": "Crossroads Wager-Token",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A wooden token that records a bargain. The terms are not always what you remember.",
    "iconId": "Currency/red-coin-c-pattern",
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
    "origin": "Bryngloom Forest",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "drekavra-claw-husk",
    "name": "Drekavra Claw-Husk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A raking claw from a screaming spirit. Whoever holds it hears its voice. Blacksmithing and enchanting.",
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
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "unfulfilled-dead-scream",
    "name": "Bottled Scream",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A bottled scream from a spirit of the unfulfilled dead. Enchanting reagent for sonic effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-shovel-diagonal-light-brown-tan-dark-grip-spade-blade",
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
    "materialType": "Sound",
    "professions": [
      "Enchanting",
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "bannik-soot-clump",
    "name": "Bannik Soot-Clump",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A clump of steam-wreathed soot from the heating shafts. Alchemy and engineering.",
    "iconId": "Misc/Profession Resources/Mining/resource-pile-nuggets-kernels-yellow-orange",
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
    "materialType": "Soot",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bathhouse-divining-ember",
    "name": "Bathhouse Divining-Ember",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "An ember that shows thermal shifts for a week. Alchemy and engineering reagent for heat-sensing.",
    "iconId": "Misc/Profession Resources/Gems/resource-fire-crystal-gem-orange-red-beige",
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
    "materialType": "Ember",
    "professions": [
      "Alchemy",
      "Engineering"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "ember",
    "reagentState": "Pure"
  },
  {
    "id": "psoglav-iron-tooth",
    "name": "Psoglav Iron-Tooth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "An iron tooth from an eight-legged bog-hunter. Blacksmithing.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-necklace-teeth-golden-dark-strap",
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
    "materialType": "Tooth",
    "professions": [
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bone-calcium-powder",
    "name": "Bone-Calcium Powder",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "common",
    "description": "Fine white powder from a bone-gorger. It sets teeth and bones. Alchemy and cooking.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-crescent-moon-figure-light-yellow-cream-dark-brown-sleeping-resting",
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
    "materialType": "Powder",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Powder",
    "magicType": "neutral",
    "reagentState": "Processed"
  },
  {
    "id": "vourdalak-kin-lock",
    "name": "Vourdalak Kin-Lock",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A lock of hair from a family the revenant could not let go. Tailoring.",
    "iconId": "Misc/Monster Parts/Cut off hair",
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
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "blood-debt-ledger",
    "name": "Blood-Debt Ledger",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A small ledger of a family's blood. Each entry is the same name.",
    "iconId": "Misc/Books/book-open-reddish-brown-pages",
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
    "origin": "Bryngloom Forest",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "mavka-willow-leaf",
    "name": "Mavka Willow-Leaf",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A willow leaf that hides a mind-shattering secret. Alchemy reagent for illusion draughts.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-autumn-maple-leaf-orange-yellow-green",
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
    "materialType": "Leaf",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "herbalism",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "hollow-back-bark",
    "name": "Hollow-Back Bark",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Bark from a dryad's hollow back. Woodworking.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-log-wood-grain-cut-end",
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
    "materialType": "Wood",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "alkonost-dawn-feather",
    "name": "Alkonost Dawn-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A feather of heavenly song. It leaves you feeling totally joyful and slightly vague. Tailoring and enchanting.",
    "iconId": "Weapons/Shuriken/shuriken-four-bladed-x-shape-orange-yellow-feathers",
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
    "materialType": "Feather",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "forgotten-joy-bead",
    "name": "Forgotten-Joy Bead",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A bead of joy. The memory it replaced is gone. Alchemy reagent for joy and memory draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-charm-key-figure-eight-infinity-two-loops-yellow-beige-top-orange-red-bottom-glow-dark-hole",
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
    "materialType": "Bead",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "sacred",
    "reagentState": "Raw"
  },
  {
    "id": "changeling-straw-doll",
    "name": "Changeling Straw-Doll",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "uncommon",
    "description": "A straw doll left in place of a swapped child.",
    "iconId": "Container/Pouch/tan-tied-sack",
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
    "origin": "Bryngloom Forest",
    "demandLevel": "Low",
    "qualityGrade": "Fine"
  },
  {
    "id": "thorn-whip-fibre",
    "name": "Thorn-Whip Fibre",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A tough, thorn-studded fibre. Tailoring and leatherworking.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/nature-roots-wood-moss-covered-beige-green-three",
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
    "materialType": "Plant",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "upir-root-tendril",
    "name": "Upir Root-Tendril",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A pulsing, parasitic tendril of a forest-draining network. It remains alive. Alchemy reagent for life-drain tonics.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/resource-ginger-turmeric-roots-orange-brown",
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
    "materialType": "Root",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Herb",
    "magicType": "primal",
    "reagentState": "Raw"
  },
  {
    "id": "forest-life-sap",
    "name": "Forest Life-Sap",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A red sap drawn from the forest. It strongly resembles blood. Alchemy reagent for vitality tonics.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-bomb-orb-spherical-two-section-orange-red-top-beige-cream-bottom-dark-fuse-stem-loop-tab",
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
    "materialType": "Sap",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "primal",
    "reagentState": "Pure"
  },
  {
    "id": "sirin-melancholy-feather",
    "name": "Sirin Melancholy-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A dark twilight feather. Its song is a pull toward rest. Enchanting and tailoring.",
    "iconId": "Weapons/Hoe/hoe-tomahawk-green-wrapped-red-feathers",
    "value": {
      "gold": 0,
      "silver": 46,
      "copper": 0
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
    "gatheringMethod": "rare"
  },
  {
    "id": "healing-tear-bead",
    "name": "Healing Tear-Bead",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A tear that heals as readily as it grieves. Alchemy reagent for healing draughts.",
    "iconId": "Misc/Profession Resources/Gems/resource-teardrop-water-ice-crystal-blue-beige",
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
    "materialType": "Tear",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Liquid",
    "magicType": "sacred",
    "reagentState": "Pure"
  },
  {
    "id": "bog-hag-lent-year",
    "name": "Bottled Lent Year",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A year of life sealed in a flask. Never read the contract. Alchemy reagent for lifespan tonics.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-bottle-teardrop-oval-asymmetrical-gradient-orange-red-yellow-beige-stopper",
    "value": {
      "gold": 0,
      "silver": 45,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Essence",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wyrd",
    "reagentState": "Pure"
  },
  {
    "id": "bog-moss-mantle",
    "name": "Bog-Moss Mantle",
    "type": "accessory",
    "subtype": "CLOAK",
    "quality": "rare",
    "description": "A thick mantle of living bog-moss. It keeps the wearer warm and slightly forgetful.",
    "iconId": "Armor/Cloak/cloak-brown-collared-cape",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 60
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "back"
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
    },
    "combatStats": {
      "resistances": {
        "rime": {
          "value": 2,
          "isPercentage": false
        }
      }
    }
  },
  {
    "id": "peat-preserved-contract",
    "name": "Peat-Preserved Contract",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A peat-preserved Athien contract with unmet terms.",
    "iconId": "Misc/Books/book-scroll-rolled-red-wax-seal",
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
    "tradeCategory": "curios",
    "origin": "Bryngloom Forest",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "debtors-iron-ring",
    "name": "Debtor's Iron Ring",
    "type": "accessory",
    "subtype": "RING",
    "quality": "uncommon",
    "description": "A heavy iron ring the debtor could not remove.",
    "iconId": "Armor/Finger/finger-recurve-bow-ring",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 20
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "finger"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "constitution": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "cycle-eater-husk",
    "name": "Cycle-Eater Husk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A grotesque husk of a worm-like aberration. Alchemy and blacksmithing.",
    "iconId": "Misc/Monster Parts/monster-part-eggshell-broken-golden-green-patterns",
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
    "materialType": "Chitin",
    "professions": [
      "Alchemy",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "reincarnation-mote",
    "name": "Reincarnation Mote",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A fragment of the forest's reincarnation cycle. Healing slows around it. Enchanting reagent for rebirth glyphs.",
    "iconId": "Misc/Profession Resources/Gems/resource-crystal-shard-purple-yellow-veins",
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
    "materialType": "Mote",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "wyrd",
    "reagentState": "Pure"
  }
];
