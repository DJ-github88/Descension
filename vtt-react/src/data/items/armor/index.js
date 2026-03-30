/**
 * Armor - All armor items
 * 
 * Starter armor with Dark Souls-esque philosophy:
 * - Basic protection with meaningful tradeoffs
 * - Some pieces have negative stats
 * - Light vs heavy choices
 * - Worn, tattered aesthetic with soulful names
 */

export const ARMOR = [
  // === CHEST ARMOR ===
  {
    id: 'threadbare-sorrow',
    name: 'Threadbare Sorrow',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'A tunic patched with memories. Offers little protection, but allows the soul to move freely.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 1,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 30,
    maxDurability: 30
  },
  {
    id: 'weathered-hide',
    name: 'Weathered Hide',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'A leather vest stiffened by countless seasons. Basic protection without hindering movement.',
    iconId: 'Armor/Chest/chest-barbarian-leather-tunic',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 3,
    baseStats: {
      agility: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'rusted-sorrow',
    name: 'Rusted Sorrow',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'common',
    description: 'A chainmail shirt whose rings weep rust. Heavy protection, but weighs down both body and spirit.',
    iconId: 'Armor/Chest/chest-segmented-brown-cuirass',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 5,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === LEG ARMOR ===
  {
    id: 'tattered-memories',
    name: 'Tattered Memories',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'Torn breeches that remember better days. Barely qualifies as clothing, let alone armor.',
    iconId: 'Armor/Leggings/leggings-simple-brown-pants',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['legs'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 20,
    maxDurability: 20
  },
  {
    id: 'stiff-resolve',
    name: 'Stiff Resolve',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Leather pants that have seen many battles. They remember each scar, each wound they failed to prevent.',
    iconId: 'Armor/Leggings/leggings-brown-waistband-pants',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['legs'],
    armorClass: 2,
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'chain-of-burden',
    name: 'Chain of Burden',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'common',
    description: 'Heavy chainmail leggings. Excellent protection, but each link weighs down the soul.',
    iconId: 'Armor/Leggings/leggings-vest-beige-tan-brown-red-segmented-plates',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['legs'],
    armorClass: 4,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },

  // === HEAD ARMOR ===
  {
    id: 'sun-faded-cap',
    name: 'Sun-Faded Cap',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'A simple cap bleached by countless days. Minimal protection, but keeps the harsh light at bay.',
    iconId: 'Armor/Head/head-beige-fedora-hat',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    armorClass: 0,
    baseStats: {},
    durability: 25,
    maxDurability: 25
  },
  {
    id: 'muffled-thoughts',
    name: 'Muffled Thoughts',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'A padded leather cap. Offers basic head protection, but slightly muffles the world around you.',
    iconId: 'Armor/Head/head-brown-fedora-hat',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    armorClass: 2,
    baseStats: {
      intelligence: { value: -1, isPercentage: false }
    },
    durability: 45,
    maxDurability: 45
  },
  {
    id: 'blinded-helm',
    name: 'Blinded Helm',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'An old iron helmet, its visor rusted shut. Good protection, but limits awareness of the world.',
    iconId: 'Armor/Head/head-rusty-worn-helmet',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    armorClass: 4,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      intelligence: { value: -2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },

  // === HAND ARMOR ===
  {
    id: 'open-palms',
    name: 'Open Palms',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'Tattered gloves with the fingertips cut away. Allows dexterity, but offers no protection from the world\'s cruelty.',
    iconId: 'Armor/Hands/hands-orange-cream-banded-glove',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['hands'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 20,
    maxDurability: 20
  },
  {
    id: 'stiffened-grip',
    name: 'Stiffened Grip',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Sturdy leather gloves. Good hand protection, but slightly reduces the fine touch needed for delicate work.',
    iconId: 'Armor/Hands/hands-fur-cuffed-brown-glove',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['hands'],
    armorClass: 2,
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'iron-fetters',
    name: 'Iron Fetters',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'Heavy iron gloves. Excellent protection, but makes precise movements difficult, like wearing chains.',
    iconId: 'Armor/Hands/hands-beige-armored-gauntlet',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['hands'],
    armorClass: 3,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === FOOT ARMOR ===
  {
    id: 'worn-path',
    name: 'Worn Path',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'Tattered boots with holes in the soles. Better than bare feet, but not by much. They remember every step.',
    iconId: 'Armor/Feet/feet-simple-tan-boot',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['feet'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 25,
    maxDurability: 25
  },
  {
    id: 'travelers-tread',
    name: 'Traveler\'s Tread',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Sturdy leather boots, well-worn but serviceable. They have walked many roads and remember each one.',
    iconId: 'Armor/Feet/feet-brown-laced-boot',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['feet'],
    armorClass: 2,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'anchor-greaves',
    name: 'Anchor Greaves',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'Heavy iron boots. Excellent foot protection, but makes running difficult, like anchors on your feet.',
    iconId: 'Armor/Feet/feet-rugged-brown-boot',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['feet'],
    armorClass: 4,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 75,
    maxDurability: 75
  },

  // === WRIST ARMOR ===
  {
    id: 'bare-wrists',
    name: 'Bare Wrists',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'Simple cloth wraps that offer no real protection. They remember the warmth of better days.',
    iconId: 'Armor/Wrist/worn-leather-bracer',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 15,
    maxDurability: 15
  },
  {
    id: 'leather-bindings',
    name: 'Leather Bindings',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Worn leather bracers that have seen many battles. Basic wrist protection without hindering movement.',
    iconId: 'Armor/Wrist/cylindrical-tube-bracer',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    armorClass: 1,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'chain-wraps',
    name: 'Chain Wraps',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'common',
    description: 'Heavy chainmail wristguards. Good protection, but the metal rings chafe and weigh down the arms.',
    iconId: 'Armor/Wrist/segmented-shell-bracer',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    armorClass: 2,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'iron-vambraces',
    name: 'Iron Vambraces',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'Solid iron wrist guards. Excellent protection, but makes fine movements difficult, like wearing shackles.',
    iconId: 'Armor/Wrist/winged-bracer',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    armorClass: 3,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },

  // === SHOULDER ARMOR ===
  {
    id: 'tattered-pads',
    name: 'Tattered Pads',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'Worn cloth shoulder pads, barely more than rags. They offer no protection, only the memory of comfort.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-rustic-leather-brown-tan-jagged-layered',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 20,
    maxDurability: 20
  },
  {
    id: 'weathered-pauldrons',
    name: 'Weathered Pauldrons',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'Leather shoulder guards stiffened by weather and wear. Basic protection that doesn\'t impede movement.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-segmented-brown-tan-cream-layered',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    armorClass: 2,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'chain-spaulders',
    name: 'Chain Spaulders',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'common',
    description: 'Heavy chainmail shoulder guards. Good protection, but each link adds weight to burdened shoulders.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-teal-brown-beige-ceremonial-symmetrical',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    armorClass: 3,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'iron-pauldrons',
    name: 'Iron Pauldrons',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'Massive iron shoulder plates. Excellent protection, but they weigh heavily, like carrying a burden on each shoulder.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-breastplate-beige-red-trim-segmented',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    armorClass: 4,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === WAIST ARMOR ===
  {
    id: 'frayed-cord',
    name: 'Frayed Cord',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'A simple rope belt, worn and frayed. Barely holds clothing together, let alone offers protection.',
    iconId: 'Armor/Waist/brown-rope-belt',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    armorClass: 0,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 15,
    maxDurability: 15
  },
  {
    id: 'travelers-belt',
    name: 'Traveler\'s Belt',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'common',
    description: 'A well-worn leather belt that has cinched many journeys. Basic protection and utility.',
    iconId: 'Armor/Waist/brown-leather-belt',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    armorClass: 1,
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 45,
    maxDurability: 45
  },
  {
    id: 'chain-girdle',
    name: 'Chain Girdle',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'common',
    description: 'A heavy chainmail belt. Good protection for the midsection, but the metal links dig into the waist.',
    iconId: 'Armor/Waist/brown-belt-buckle',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    armorClass: 2,
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'iron-girdle',
    name: 'Iron Girdle',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'common',
    description: 'A solid iron belt. Excellent protection, but constricts movement like a cage around the waist.',
    iconId: 'Armor/Waist/brown-belt-golden-buckle',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    armorClass: 3,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },

  // === SHIRTS (CLOTHING SLOT) ===
  {
    id: 'threadbare-undershirt',
    name: 'Threadbare Undershirt',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'poor',
    description: 'A simple undershirt, worn thin by countless washings. Offers no protection, only modesty.',
    iconId: 'Armor/Chest/chest-simple-tan-tunic',
    value: { gold: 0, silver: 0, copper: 50 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['shirt'],
    armorClass: 0,
    baseStats: {},
    durability: 10,
    maxDurability: 10
  },
  {
    id: 'simple-tunic',
    name: 'Simple Tunic',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A plain tunic, unadorned and functional. Worn beneath armor or alone for comfort.',
    iconId: 'Armor/Chest/chest-textured-beige-tunic',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['shirt'],
    armorClass: 0,
    baseStats: {},
    durability: 30,
    maxDurability: 30
  },
  {
    id: 'comfortable-undershirt',
    name: 'Comfortable Undershirt',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A well-made undershirt, soft and comfortable. Worn for comfort rather than protection.',
    iconId: 'Armor/Chest/chest-striped-beige-tunic',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['shirt'],
    armorClass: 0,
    baseStats: {},
    durability: 40,
    maxDurability: 40
  },

  // === TABARDS (CLOTHING SLOT) ===
  {
    id: 'plain-tabard',
    name: 'Plain Tabard',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A simple tabard, unmarked and unadorned. Worn over armor to display allegiance or simply for style.',
    iconId: 'Armor/Chest/chest-belted-brown-tunic',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['tabard'],
    armorClass: 0,
    baseStats: {},
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'guild-tabard',
    name: 'Guild Tabard',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A tabard bearing the colors and symbols of a guild. Worn with pride to show membership and allegiance.',
    iconId: 'Armor/Chest/chest-orange-gold-trimmed-tunic',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['tabard'],
    armorClass: 0,
    baseStats: {},
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'faction-tabard',
    name: 'Faction Tabard',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'common',
    description: 'A decorative tabard displaying faction colors and heraldry. Worn to show loyalty and identity.',
    iconId: 'Armor/Chest/chest-laced-red-tunic',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['tabard'],
    armorClass: 0,
    baseStats: {},
    durability: 45,
    maxDurability: 45
  },

  // === SHIELDS ===
  {
    id: 'shattered-ward',
    name: 'Shattered Ward',
    type: 'armor',
    subtype: 'SHIELD',
    quality: 'poor',
    description: 'A small shield, cracked and barely holding together. Still useful for deflecting blows, but barely.',
    iconId: 'Weapons/Shields/shield-wooden-round-brown-beige-boss',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['offHand'],
    armorClass: 1,
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'oaken-bulwark',
    name: 'Oaken Bulwark',
    type: 'armor',
    subtype: 'SHIELD',
    quality: 'common',
    description: 'A simple wooden shield, reinforced with iron bands. Basic but reliable protection, like an old friend.',
    iconId: 'Weapons/Shields/shield-wooden-heater-cross-beige-straps',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['offHand'],
    armorClass: 3,
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'iron-bastion',
    name: 'Iron Bastion',
    type: 'armor',
    subtype: 'SHIELD',
    quality: 'common',
    description: 'A heavy iron shield, dented and scarred. Excellent defense, but weighs heavily on both arm and spirit.',
    iconId: 'Weapons/Shields/shield-heater-brown-beige-red-cross-silver-boss-center',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['offHand'],
    armorClass: 5,
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    durability: 80,
    maxDurability: 80
  },

  // === UNCOMMON ARMOR WITH EFFECTS ===
  {
    id: 'flameguard',
    name: 'Flameguard',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'uncommon',
    description: 'Heavy plate armor that radiates heat. Sometimes, when struck, it lashes out with fire, burning your attackers.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 8,
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        fire: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'fire',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 120,
    maxDurability: 120
  },
  {
    id: 'shadowweave',
    name: 'Shadowweave',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'Dark cloth armor that seems to drink the light. Sometimes, when struck, it confuses your attackers with shadows.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 3,
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 18,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 1,
            saveDC: 14,
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 80,
    maxDurability: 80
  },
  {
    id: 'thunderplate',
    name: 'Thunderplate',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'uncommon',
    description: 'Chainmail that crackles with static. When struck, sometimes it shocks your attackers, leaving them stunned.',
    iconId: 'Armor/Chest/chest-segmented-brown-cuirass',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 7,
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        lightning: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 18,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'lightning',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 100,
    maxDurability: 100
  },

  // === RARE ARMOR WITH EFFECTS ===
  {
    id: 'soulward',
    name: 'Soulward',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'Ancient plate armor that protects both body and soul. When struck, it sometimes drains the life from your attackers, healing you.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 10,
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 4, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        necrotic: { value: 8, isPercentage: false },
        physical: { value: 3, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            healingFormula: '1d8',
            isHot: false,
            hotDuration: 3,
            hotTickFrequency: 'round',
            grantsTempHP: false,
            targetType: 'self',
            areaRadius: 0
          }
        }
      },
      maxHealth: { value: 20, isPercentage: false }
    },
    durability: 180,
    maxDurability: 180
  },
  {
    id: 'stormweaver',
    name: 'Stormweaver',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'rare',
    description: 'Enchanted cloth armor that channels the power of storms. When struck, it sometimes lashes out with lightning, shocking your attackers.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 5,
    baseStats: {
      intelligence: { value: 5, isPercentage: false },
      spirit: { value: 3, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        lightning: { value: 8, isPercentage: false },
        arcane: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'lightning',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          lightning: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 120,
    maxDurability: 120
  },

  // === EPIC ARMOR WITH POWERFUL EFFECTS ===
  {
    id: 'dragon-scale',
    name: 'Dragon Scale',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'Armor forged from dragon scales. When struck, it sometimes breathes fire, burning your attackers and healing you.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 12,
    baseStats: {
      strength: { value: 4, isPercentage: false },
      constitution: { value: 5, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        fire: { value: 15, isPercentage: false },
        physical: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'fire',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      maxHealth: { value: 30, isPercentage: false }
    },
    durability: 250,
    maxDurability: 250
  },
  {
    id: 'voidweave',
    name: 'Voidweave',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'epic',
    description: 'Cloth armor woven from shadow itself. When struck, it sometimes strikes fear into your attackers, making them flee.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 7,
    baseStats: {
      intelligence: { value: 6, isPercentage: false },
      spirit: { value: 4, isPercentage: false },
      agility: { value: 3, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 15, isPercentage: false },
        psychic: { value: 10, isPercentage: false },
        arcane: { value: 8, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 30,
        diceThreshold: 18,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 2,
            saveDC: 16,
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 5, isPercentage: false }
        }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'double_advantage',
          label: 'Double Advantage',
          description: 'Roll three times, take the highest result',
          color: '#2e7d32'
        }
      }
    },
    durability: 150,
    maxDurability: 150
  },
  {
    id: 'warded-plate',
    name: 'Warded Plate',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'Heavy plate armor inscribed with protective runes. Grants immunity to paralysis and advantage against being stunned.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 9,
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 4, isPercentage: false },
      agility: { value: -3, isPercentage: false }
    },
    combatStats: {
      resistances: {
        physical: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        paralyzed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        stunned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        restrained: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 140,
    maxDurability: 140
  },
  {
    id: 'mindguard-robe',
    name: 'Mindguard Robe',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'A robe woven with threads that protect the mind. Grants advantage against mental conditions.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    armorClass: 2,
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        charmed: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        frightened: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        confused: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 70,
    maxDurability: 70
  }
];
