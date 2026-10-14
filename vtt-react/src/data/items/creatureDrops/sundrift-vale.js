/**
 * Creature drops: Sundrift Vale
 *
 * Reagents, trophies and gear dropped by Sundrift Vale creatures.
 * Each id is referenced by a creature lootTable in public/data/creatures.json.
 */

export const SUNDRIFT_VALE_DROPS = [
  {
    "id": "acid-gland",
    "name": "Death-Worm Acid-Gland",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A swollen gland from a steppe death worm. It sloshes with corrosive acid. Alchemy reagent: a base for corrosives and etching.",
    "iconId": "Misc/Monster Parts/monster-part-glands-golden-cluster-brown-base",
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
    "materialType": "Gland",
    "professions": [
      "Alchemy",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Organ",
    "magicType": "nature",
    "reagentState": "Raw"
  },
  {
    "id": "death-worm-spark-scale",
    "name": "Death-Worm Spark-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A crimson scale that crackles with the worm's electrical discharge. Engineering: a self-charging plate.",
    "iconId": "Misc/Monster Parts/Scales/scale-fragment-teal-blue-bumps",
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
      "Engineering",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "snake-venom-gland",
    "name": "Three-Headed Venom-Gland",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A venom gland from one of three snake-heads. Each head makes a different poison. Alchemy reagent for venoms and antivenoms.",
    "iconId": "Misc/Monster Parts/Organs/monster-part-gland-tear-drop-yellow-orange",
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
    "materialType": "Gland",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Organ",
    "magicType": "nature",
    "reagentState": "Raw"
  },
  {
    "id": "grass-mimic-skin",
    "name": "Grass-Mimic Skin",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A snakeskin that matches the tall steppe-grass colour at any distance. Leatherworking: a camouflage hide.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-jagged",
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
    "materialType": "Skin",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "starry-horn-shard",
    "name": "Starry Horn-Shard",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A shard of a qilin's single starlight horn. It glows quietly in dark places. Enchanting and alchemy reagent for light and blessing.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-two-intertwined-golden-roots-horns",
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
      "Enchanting",
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "light",
    "reagentState": "Pure"
  },
  {
    "id": "qilin-blue-scale",
    "name": "Qilin Blue-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A blue scale from a deer-like fey. It is warm and smells of grass. Leatherworking and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-blue-scales-cluster-patch",
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
    "materialType": "Scale",
    "professions": [
      "Leatherworking",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "horse-hair-braid",
    "name": "Mane-Braid",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A tight little braid of horse-mane, knotted by a mischievous sprite. Tailoring: a braid cord.",
    "iconId": "Misc/Monster Parts/Cut off hair",
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
    "materialType": "Hair",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "mogwai-grass-tail",
    "name": "Grass-Sprite Tail",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A little grassy tail that rustles when you leave a room. Alchemy and cooking.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/fern-frond-diagonal",
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
    "materialType": "Plant",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "jade-stone-scales",
    "name": "Jade Scales",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Heavy jade scales from a winged shrine-guardian. Cold and cut like gems. Jewelcrafting and blacksmithing.",
    "iconId": "Misc/Monster Parts/Scales/scale-golden-ridged-bean-shaped",
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
    "materialType": "Jade",
    "professions": [
      "Jewelcrafting",
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "bixie-wing-sweep-feather",
    "name": "Bixie Wing-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A jade-scaled wing feather from a celestial lion-chimera. Tailoring and enchanting.",
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
    "id": "almas-silent-fur",
    "name": "Almas Silent-Fur",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Shaggy hominid fur that muffles sound. Tailoring: sound-ward linings.",
    "iconId": "Misc/Monster Parts/Hide/hide-piece-dark-brown-textured",
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
    "materialType": "Fur",
    "professions": [
      "Tailoring",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "almas-root-club-chip",
    "name": "Root-Club Chip",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "A chip of a hominid's root-club. Woodworking.",
    "iconId": "Misc/Profession Resources/Woodworking/resource-bundle-wood-bones-light-beige",
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
    "materialType": "Wood",
    "professions": [
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "tulpar-star-hoof",
    "name": "Tulpar Star-Hoof",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A hoof-shard patterned like a lost constellation. Enchanting and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Horns/horn-golden-curved-polished",
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
    "materialType": "Hoof",
    "professions": [
      "Enchanting",
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "tulpar-sky-memory-mane",
    "name": "Sky-Memory Mane",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Mane-hair that shows an old night sky. Tailoring and enchanting.",
    "iconId": "Misc/Monster Parts/Cut off hair",
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
    "materialType": "Hair",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "erlik-ancestral-bone-throne-chip",
    "name": "Throne-Bone Chip",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A chip of the ancestral bone-throne of an underworld lord. It weighs debts. Enchanting reagent for judgment and debt glyphs.",
    "iconId": "Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged",
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
    "materialType": "Bone",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "half-bone-hand",
    "name": "Half-Bone Hand",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A hand that is half bone and half flesh. It weighs more with every debt owed.",
    "iconId": "Misc/Monster Parts/Bones/bone-hand-skeletal-reach-gesture",
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
    "tradeCategory": "curios",
    "origin": "Sundrift Vale",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "burkhan-breathing-grass",
    "name": "Breathing Grass",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A tuft of steppe-grass that breathes rhythmically. Alchemy and cooking herb.",
    "iconId": "Misc/Profession Resources/Herbs and Plants/bundle-dried-reeds-wheat-stalks",
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
    "materialType": "Plant",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "herbalism"
  },
  {
    "id": "burkhan-wind-ribbon",
    "name": "Burkhan Wind-Ribbon",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A prayer ribbon that moves without wind.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-orange-yellow-striped-ribbon",
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
    "tradeCategory": "charms",
    "origin": "Sundrift Vale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "nian-iron-horn",
    "name": "Nian Iron-Horn",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A rust-red iron horn from a stampeding beast. Blacksmithing.",
    "iconId": "Weapons/Shields/shield-elongated-brown-bone-horns-ribbed-red-gem",
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
      "Blacksmithing"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "nian-red-fur",
    "name": "Nian Red-Fur",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Rust-red fur that smells of dark-season dread. Leatherworking and tailoring.",
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
    "materialType": "Fur",
    "professions": [
      "Leatherworking",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "jiangshi-paper-talisman",
    "name": "Jiangshi Paper-Talisman",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "The paper talisman that drives a hopping corpse. It still hums with unfinished business. Enchanting reagent for command glyphs.",
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
    "materialType": "Paper",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Powder",
    "magicType": "wyrd",
    "reagentState": "Raw"
  },
  {
    "id": "hopping-riding-sash",
    "name": "Hopping Riding-Sash",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A faded riding sash from a hopping corpse. Tailoring.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-orange-yellow-striped-ribbon",
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
    "materialType": "Cloth",
    "professions": [
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "taotie-hungry-jaw",
    "name": "Taotie Hungry-Jaw",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A section of jaw from a creature that is mostly jaws. Blacksmithing: a devouring-ward core.",
    "iconId": "Misc/Profession Resources/Fishing/fish-skeleton-bones-teal",
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
    "materialType": "Bone",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "spiral-tooth",
    "name": "Spiral Tooth",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A long spiral tooth, ridged like a drill. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-necklace-teeth-golden-dark-strap",
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
    "materialType": "Tooth",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "baize-nine-eye",
    "name": "Bai Ze's Ninth Eye",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "The ninth eye of an oracle-ox that remembers every creature in the world. Enchanting reagent for knowledge glyphs.",
    "iconId": "Misc/Monster Parts/Organs/organ-eyeball-optic-nerve-teal-iris-beige-sclera",
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
    "materialType": "Organ",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "arcane",
    "reagentState": "Pure"
  },
  {
    "id": "baize-crown-horn",
    "name": "Bai Ze Crown-Horn",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A shard of horn from an oracle's crown. Jewelcrafting and enchanting.",
    "iconId": "Misc/Monster Parts/Horns/horn-crescent-beige-segmented",
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
      "Jewelcrafting",
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "zilant-resonance-feather",
    "name": "Zilant Resonance-Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A wing feather that hums a note when struck. Instrument-crafting and enchanting.",
    "iconId": "Armor/Leggings/leggings-wings-leaf-wood-brown-tan-beige-layered-feathers",
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
    "materialType": "Feather",
    "professions": [
      "Enchanting",
      "Engineering"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "zilant-rooster-comb",
    "name": "Zilant Rooster-Comb",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A red rooster-comb from a winged serpent-dragon. Cooking and alchemy.",
    "iconId": "Misc/Monster Parts/Organs/organ-tissue-pair-brown-reddish-brown-lumpy",
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
    "materialType": "Organ",
    "professions": [
      "Alchemy",
      "Cooking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "susulu-healing-spring-water",
    "name": "Healing Spring-Water",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A flask of rare steppe spring water. It heals small things and purifies large ones. Alchemy reagent: a healing base.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-bulbous-bright-blue-glow",
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
    "id": "river-dragonling-scale",
    "name": "River-Dragonling Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A shiny scale from a tiny purifying river-dragon. Alchemy and jewelcrafting.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-blue-scales-cluster-patch",
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
    "materialType": "Scale",
    "professions": [
      "Alchemy",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "dijiang-crimson-sac",
    "name": "Dijiang Crimson-Sac",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A crimson sac that sings in harmony when squeezed. Alchemy reagent for order and calm.",
    "iconId": "Misc/Monster Parts/Organs/organ-flesh-chunk-brown-lumpy",
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
    "materialType": "Organ",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "skinning",
    "reagentType": "Organ",
    "magicType": "order",
    "reagentState": "Raw"
  },
  {
    "id": "chaos-drum-skin",
    "name": "Chaos-Drum Skin",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A taut skin that confuses anyone who hears it drummed. Instrument-crafting.",
    "iconId": "Misc/Monster Parts/Hide/hide-fragment-teal-textured-severed",
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
    "materialType": "Skin",
    "professions": [
      "Engineering",
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "fenghuang-plume",
    "name": "Fenghuang Plume",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A plume of elemental colours. Harmony follows whoever carries it. Tailoring and enchanting: the finest feather on the steppe.",
    "iconId": "Misc/Monster Parts/Feathers/monster-part-feathers-pair-blue-iridescent",
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
    "id": "migration-calendar-bead",
    "name": "Migration-Calendar Bead",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A bead that tells the seasons, brighter in harmonious company.",
    "iconId": "Currency/red-coin-crescent",
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
    "tradeCategory": "charms",
    "origin": "Sundrift Vale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "qiongqi-boar-tusk",
    "name": "Qiongqi Boar-Tusk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A curved boar tusk from a winged tiger. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Horns/monster-part-horns-cluster-golden-brown-conical",
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
    "materialType": "Tusk",
    "professions": [
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "blood-furred-tiger-pelt",
    "name": "Blood-Furred Tiger-Pelt",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A tattered blood-furred pelt that bristles near the virtuous. Leatherworking.",
    "iconId": "Misc/Monster Parts/Hide/hide-fragment-teal-textured-severed",
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
    "materialType": "Fur",
    "professions": [
      "Leatherworking"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "zhenniao-acid-tear",
    "name": "Zhenniao Acid-Tear",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "An acidic tear from a toxic vulture. It rots the land it touches. Alchemy reagent for corrosives and blights.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-pouch-bag-triangular-flap-green-bottom",
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
    "magicType": "nature",
    "reagentState": "Pure"
  },
  {
    "id": "oil-slick-feather",
    "name": "Oil-Slick Feather",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "A feather with a rainbow oil-slick shine. Stains everything. Alchemy and tailoring.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-golden-swirling-entity-feathers-crest",
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
    "materialType": "Feather",
    "professions": [
      "Alchemy",
      "Tailoring"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "ubagan-crystal-fist",
    "name": "Ubagan Crystal-Fist",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A crystal fist that bends light into a rainbow. Jewelcrafting and enchanting.",
    "iconId": "Misc/Profession Resources/Gems/resource-green-faceted-gem-crystal",
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
    "materialType": "Crystal",
    "professions": [
      "Jewelcrafting",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "aquifer-mud",
    "name": "Aquifer-Mud",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Cool mud from an underground aquifer. It remembers where water is. Masonry and alchemy.",
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
    "materialType": "Mud",
    "professions": [
      "Masonry",
      "Alchemy"
    ],
    "gatheringMethod": "mining"
  },
  {
    "id": "qoraigarash-gem-scale",
    "name": "Qoraigarash Gem-Scale",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A semi-precious stone scale from a lake dragon. Jewelcrafting.",
    "iconId": "Misc/Profession Resources/Gems/resource-teal-crystal-bronze-base",
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
    "materialType": "Gem",
    "professions": [
      "Jewelcrafting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "storm-raising-pearl",
    "name": "Storm-Raising Pearl",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "rare",
    "description": "A pearl that clouds over just before a storm. Alchemy and enchanting reagent for storm effects.",
    "iconId": "Misc/Profession Resources/Gems/resource-light-blue-pearl-grey-casing",
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
    "materialType": "Pearl",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Crystal",
    "magicType": "lightning",
    "reagentState": "Pure"
  },
  {
    "id": "ajina-entropy-shadow",
    "name": "Ajina Entropy-Shadow",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "epic",
    "description": "A shadow torn from a creature of absolute darkness. It rots whatever it lies on. Alchemy and enchanting reagent for rot and entropy.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-orb-flask-round-beige-upper-green-lower-brown-stopper-tag",
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
    "materialType": "Shadow",
    "professions": [
      "Alchemy",
      "Enchanting"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "shadow",
    "reagentState": "Pure"
  },
  {
    "id": "independent-mouth-fang",
    "name": "Independent-Mouth Fang",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "A fang from one of the shadow's many mouths. It keeps biting. Blacksmithing and jewelcrafting.",
    "iconId": "Misc/Monster Parts/Teeth/monster-part-necklace-teeth-golden-dark-strap",
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
      "Blacksmithing",
      "Jewelcrafting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "lu-wu-season-claw",
    "name": "Season-Controller Claw",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A tiger claw that tracks the seasons. It warms in spring and rimes in winter. Blacksmithing and enchanting.",
    "iconId": "Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons",
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
    "materialType": "Claw",
    "professions": [
      "Blacksmithing",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "lu-wu-human-face-mask",
    "name": "Nine-Face Mask",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "legendary",
    "description": "One of nine human faces. It wears a different expression each time you look.",
    "iconId": "Armor/Neck/fiery-skull-mask-pendant",
    "value": {
      "gold": 0,
      "silver": 90,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "tradeCategory": "curios",
    "origin": "Sundrift Vale",
    "demandLevel": "High",
    "qualityGrade": "Masterwork"
  },
  {
    "id": "bura-dust-devil",
    "name": "Bura Dust-Devil",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A tiny dust-devil in a vial. It nibbles at shelter-corners. Alchemy reagent for wind effects.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-dress-tunic-light-orange-peach-dark-neckline-hanger",
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
    "materialType": "Air",
    "professions": [
      "Alchemy"
    ],
    "gatheringMethod": "rare",
    "reagentType": "Essence",
    "magicType": "wind",
    "reagentState": "Raw"
  },
  {
    "id": "broken-oath-wind-knot",
    "name": "Broken-Oath Wind-Knot",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A knot of wind tied around a broken oath. Pull at your own risk.",
    "iconId": "Currency/brown-coin-pouch",
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
    "origin": "Sundrift Vale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  },
  {
    "id": "tengri-star-thread",
    "name": "Tengri Star-Thread",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "epic",
    "description": "A thread of fate from a six-inch guide of starlight. Tailoring and enchanting: a fate-thread.",
    "iconId": "Misc/Profession Resources/Tailoring/resource-spool-golden-brown-thread-twine",
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
    "materialType": "Thread",
    "professions": [
      "Tailoring",
      "Enchanting"
    ],
    "gatheringMethod": "rare"
  },
  {
    "id": "lien-debt-scroll",
    "name": "Lien's Debt-Scroll",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A scroll recording an unpaid debt. The creditor is not who it first appears.",
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
    "tradeCategory": "curios",
    "origin": "Sundrift Vale",
    "demandLevel": "High",
    "qualityGrade": "Fine"
  },
  {
    "id": "unpaid-promise-wrap",
    "name": "Unpaid-Promise Wrapping",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "common",
    "description": "Scroll-paper wrappings stamped with unpaid promises. Enchanting: ritual paper.",
    "iconId": "Misc/Books/book-scroll-rolled-red-wax-seal",
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
    "materialType": "Paper",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "skinning"
  },
  {
    "id": "story-eater-star-crumb",
    "name": "Star-Story Crumb",
    "type": "miscellaneous",
    "subtype": "REAGENT",
    "quality": "uncommon",
    "description": "A star-story eaten before it could be told. It tastes of light. Alchemy reagent for memory and storytelling draughts.",
    "iconId": "Misc/Profession Resources/Alchemy/Empty/empty-potion-vial-elongated-rectangular-tapered-pale-yellow-cream-brown-cap-loop",
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
    "id": "sere-khan-trial-gavel",
    "name": "Steppe-Adjudicator's Gavel",
    "type": "weapon",
    "subtype": "MACE",
    "quality": "epic",
    "description": "A bone gavel that sentences by ancestral compact. It rings when truth is told.",
    "iconId": "Weapons/Warhammer/warhammer-mace-spiked-metallic-gray-brown",
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
        "diceType": "d8",
        "damageType": "smashing",
        "bonusDamage": 3
      }
    },
    "baseStats": {
      "strength": {
        "value": 1,
        "isPercentage": false
      },
      "spirit": {
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
            "damageType": "shadow",
            "isDot": false,
            "targetType": "target",
            "areaRadius": 0
          }
        }
      }
    }
  },
  {
    "id": "skeletal-judge-bridle",
    "name": "Skeletal Judge's Bridle",
    "type": "miscellaneous",
    "subtype": "TRADE_GOODS",
    "quality": "rare",
    "description": "A bridle of bones that rattles with ancestral verdicts.",
    "iconId": "Misc/Profession Resources/Blacksmithing/resource-chain-metallic-bronze-links",
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
    "origin": "Sundrift Vale",
    "demandLevel": "Medium",
    "qualityGrade": "Fine"
  }
];
