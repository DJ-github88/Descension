/**
 * Weapons - All weapon items
 * 
 * Starter weapons with Dark Souls-esque philosophy:
 * - Weak but functional
 * - Tradeoffs and meaningful choices
 * - Some items have negative stats
 * - Dark, harsh aesthetic with soulful names
 */

export const WEAPONS = [
  // === ONE-HANDED SWORDS ===
  {
    id: 'ironweep',
    name: 'Ironweep',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'poor',
    description: 'A blade that has wept rust for years. Its edge is dulled by sorrow, but still remembers how to cut.',
    iconId: 'Weapons/Swords/sword-basic-serrated-tan-brown-simple',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'wanderers-edge',
    name: 'Wanderer\'s Edge',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'common',
    description: 'A shortsword that has traveled many roads. The leather grip is worn smooth by countless hands.',
    iconId: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 80,
    maxDurability: 80
  },
  {
    id: 'soulthirst',
    name: 'Soulthirst',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'common',
    description: 'A tarnished blade that hungers for life. Quick and deadly, it feeds on your essence with each strike.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === TWO-HANDED WEAPONS ===
  {
    id: 'shattermourn',
    name: 'Shattermourn',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'poor',
    description: 'A massive blade whose tip was broken in some forgotten battle. Too heavy for most, but devastating when it connects.',
    iconId: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'grave-axe',
    name: 'Grave Axe',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'common',
    description: 'A rough-hewn axe, more tool than weapon. Brutal and effective, it knows only one purpose: to cleave.',
    iconId: 'Weapons/Axe/rustic-axe-beige-blade',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 75,
    maxDurability: 75
  },
  {
    id: 'cleaver',
    name: 'Cleaver',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'poor',
    description: 'A crude axe, more suited for chopping wood than battle. Still, it can cut flesh if swung hard enough.',
    iconId: 'Weapons/Axe/rustic-axe-beige-blade',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'battle-axe',
    name: 'Battle Axe',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'common',
    description: 'A proper battle axe, balanced for combat. Its edge is sharp, and its weight carries through armor.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 90,
    maxDurability: 90
  },

  // === MACE & BLUNT ===
  {
    id: 'iron-judgment',
    name: 'Iron Judgment',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'common',
    description: 'A simple iron mace, heavy and unadorned. Reliable against armored foes, but slow to deliver its verdict.',
    iconId: 'Weapons/Mace/mace-spiked-club-brown-tan-rustic',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 90,
    maxDurability: 90
  },
  {
    id: 'bone-hunger',
    name: 'Bone Hunger',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'poor',
    description: 'A club fashioned from a large bone, still stained with old blood. Light but fragile, it remembers its purpose.',
    iconId: 'Weapons/Mace/mace-wooden-club-brown-primitive',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },

  // === RANGED WEAPONS ===
  {
    id: 'weeping-branch',
    name: 'Weeping Branch',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'poor',
    description: 'A crude bow carved from a single branch. Unreliable, but better than nothing when death comes from afar.',
    iconId: 'Weapons/Bows/bow-simple-brown-tan-grip',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      strength: { value: -1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'hunters-whisper',
    name: 'Hunter\'s Whisper',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'common',
    description: 'A well-worn hunting bow. Simple but effective, it speaks the language of the hunt in silence.',
    iconId: 'Weapons/Bows/bow-simple-brown-wrapped-grip',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 80,
    maxDurability: 80
  },

  // === STAFFS & MAGIC ===
  {
    id: 'gnarled-sorrow',
    name: 'Gnarled Sorrow',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'common',
    description: 'A twisted staff that pulses with weak magic. Channels power, but the magic comes at a cost to the soul.',
    iconId: 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 70,
    maxDurability: 70
  },
  {
    id: 'fractured-dream',
    name: 'Fractured Dream',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'poor',
    description: 'A broken wand, its core fractured. Still channels magic, but unpredictably, like a dream half-remembered.',
    iconId: 'Weapons/Wand/wand-wooden-dark-brown-segmented',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 30,
    maxDurability: 30
  },

  // === OFF-HAND WEAPONS ===
  {
    id: 'parrying-blade',
    name: 'Parrying Blade',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'poor',
    description: 'A small, worn dagger designed for defense. Its edge is dull, but it remembers how to deflect.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'ONE_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      armorClass: { value: 1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'warding-dagger',
    name: 'Warding Dagger',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'common',
    description: 'A defensive blade, its guard worn smooth by countless parries. Quick to deflect, slow to kill.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'ONE_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      armorClass: { value: 2, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },
  {
    id: 'small-buckler',
    name: 'Small Buckler',
    type: 'weapon',
    subtype: 'SHIELD',
    quality: 'poor',
    description: 'A tiny shield, barely more than a plate. Offers minimal protection, but doesn\'t weigh down the arm.',
    iconId: 'Weapons/Shields/shield-wooden-round-brown-beige-boss',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      armorClass: { value: 1, isPercentage: false }
    },
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'iron-buckler',
    name: 'Iron Buckler',
    type: 'weapon',
    subtype: 'SHIELD',
    quality: 'common',
    description: 'A small iron shield, dented but serviceable. Good for deflecting, but heavy for its size.',
    iconId: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 1
      }
    },
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      armorClass: { value: 2, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'tattered-tome',
    name: 'Tattered Tome',
    type: 'weapon',
    subtype: 'TOME',
    quality: 'poor',
    description: 'A worn book, its pages yellowed and torn. Still channels weak magic, but the knowledge within is fragmented.',
    iconId: 'Misc/Books/book-brown-fire-symbol-runes',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'force',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'ancient-tome',
    name: 'Ancient Tome',
    type: 'weapon',
    subtype: 'TOME',
    quality: 'common',
    description: 'An old book bound in leather, its pages filled with forgotten knowledge. Channels magic with purpose.',
    iconId: 'Misc/Books/book-brown-green-rune-bookmark',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'dim-orb',
    name: 'Dim Orb',
    type: 'weapon',
    subtype: 'SPHERE',
    quality: 'poor',
    description: 'A cracked crystal orb, its light barely visible. Still channels magic, but weakly, like a dying ember.',
    iconId: 'Currency/blue-orb-gem',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'force',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'glowing-orb',
    name: 'Glowing Orb',
    type: 'weapon',
    subtype: 'SPHERE',
    quality: 'common',
    description: 'A crystal orb that pulses with magical energy. Channels power, but the magic comes at a cost.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'weathered-totem',
    name: 'Weathered Totem',
    type: 'weapon',
    subtype: 'TOTEM',
    quality: 'poor',
    description: 'A small wooden totem, worn smooth by weather and time. Channels nature magic weakly, like a whisper.',
    iconId: 'Misc/Profession Resources/Herbs and Plants/resource-green-crystal-totem-segmented-brown-bands',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'nature',
        bonusDamage: 0
      }
    },
    baseStats: {
      spirit: { value: 1, isPercentage: false },
      intelligence: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          nature: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'carved-totem',
    name: 'Carved Totem',
    type: 'weapon',
    subtype: 'TOTEM',
    quality: 'common',
    description: 'A wooden totem carved with symbols of nature. Channels the power of the wild, but the connection is fragile.',
    iconId: 'Misc/Profession Resources/Herbs and Plants/resource-green-crystal-totem-braided-root-thorns',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'nature',
        bonusDamage: 1
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          nature: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'crude-idol',
    name: 'Crude Idol',
    type: 'weapon',
    subtype: 'IDOL',
    quality: 'poor',
    description: 'A roughly carved stone idol, barely recognizable. Channels divine power weakly, like a prayer half-remembered.',
    iconId: 'Misc/Profession Resources/Archaeology/resource-bone-charm-three-protrusions',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'radiant',
        bonusDamage: 0
      }
    },
    baseStats: {
      spirit: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          holy: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'sacred-idol',
    name: 'Sacred Idol',
    type: 'weapon',
    subtype: 'IDOL',
    quality: 'common',
    description: 'A carved idol that radiates divine presence. Channels holy power, but the connection demands faith.',
    iconId: 'Misc/Profession Resources/Enchanting/resource-circular-medallion-four-faces-trees-golden-frame',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['offHand'],
    weaponSlot: 'OFF_HAND',
    hand: 'OFF_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'radiant',
        bonusDamage: 1
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          holy: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 55,
    maxDurability: 55
  },

  // === INSTRUMENTS ===
  {
    id: 'weathered-harp',
    name: 'Weathered Harp',
    type: 'weapon',
    subtype: 'HARP',
    quality: 'poor',
    description: 'A worn harp with broken strings. Still channels magic, but the music it makes is sorrowful and weak.',
    iconId: 'Instruments/Harp/harp-brown-beige-strings',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'force',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'travelers-lute',
    name: 'Traveler\'s Lute',
    type: 'weapon',
    subtype: 'LUTE',
    quality: 'common',
    description: 'A well-worn lute that has traveled many roads. Its strings remember countless songs, and it channels magic with purpose.',
    iconId: 'Instruments/Lute/lute-orange-golden-octagonal',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'broken-flute',
    name: 'Broken Flute',
    type: 'weapon',
    subtype: 'FLUTE',
    quality: 'poor',
    description: 'A cracked wooden flute, its notes discordant. Still channels magic, but weakly, like a breath half-held.',
    iconId: 'Instruments/Flute/flute-brown-orange-ends',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'force',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 30,
    maxDurability: 30
  },
  {
    id: 'war-drum',
    name: 'War Drum',
    type: 'weapon',
    subtype: 'DRUM',
    quality: 'common',
    description: 'A heavy drum that beats with the rhythm of battle. Channels power through rhythm, but the magic comes at a cost.',
    iconId: 'Instruments/Drum/drum-banded-stripes',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      intelligence: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 70,
    maxDurability: 70
  },
  {
    id: 'hunters-horn',
    name: 'Hunter\'s Horn',
    type: 'weapon',
    subtype: 'HORN',
    quality: 'common',
    description: 'A curved horn that calls to the wild. Channels nature magic through its call, but the connection is fragile.',
    iconId: 'Instruments/Horn/horn-curved-segmented',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          nature: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'weathered-violin',
    name: 'Weathered Violin',
    type: 'weapon',
    subtype: 'VIOLIN',
    quality: 'common',
    description: 'A violin with worn strings and a cracked body. Still plays, but the music it makes is melancholic and weak.',
    iconId: 'Instruments/Violin/violin-brown-f-holes-bow',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'travelers-guitar',
    name: 'Traveler\'s Guitar',
    type: 'weapon',
    subtype: 'GUITAR',
    quality: 'common',
    description: 'A simple guitar, well-worn but serviceable. Its strings remember many songs, and it channels magic with purpose.',
    iconId: 'Instruments/Guitar/guitar-ukulele-beige-octagonal',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'force',
        bonusDamage: 1
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 60,
    maxDurability: 60
  },

  // === RAPIERS ===
  {
    id: 'rusty-rapier',
    name: 'Rusty Rapier',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'poor',
    description: 'A tarnished rapier, its point bent from countless duels. Still remembers the art of the thrust, but barely.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      strength: { value: -1, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'duelists-thorn',
    name: 'Duelist\'s Thorn',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'common',
    description: 'A well-balanced rapier, its blade worn smooth by countless thrusts. Quick and precise, like a thorn that never forgets.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 75,
    maxDurability: 75
  },

  // === KATANAS ===
  {
    id: 'chipped-katana',
    name: 'Chipped Katana',
    type: 'weapon',
    subtype: 'KATANA',
    quality: 'poor',
    description: 'A katana with a chipped edge, its blade dulled by countless battles. Still cuts, but the steel remembers its failures.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      strength: { value: -1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'wandering-blade',
    name: 'Wandering Blade',
    type: 'weapon',
    subtype: 'KATANA',
    quality: 'common',
    description: 'A curved katana that has traveled many roads. Its edge is sharp, and it remembers the way of the warrior.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === SABERS ===
  {
    id: 'tarnished-saber',
    name: 'Tarnished Saber',
    type: 'weapon',
    subtype: 'SABER',
    quality: 'poor',
    description: 'A single-edged saber, its blade tarnished and its edge dulled. Still remembers how to slash, but weakly.',
    iconId: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'cavalry-saber',
    name: 'Cavalry Saber',
    type: 'weapon',
    subtype: 'SABER',
    quality: 'common',
    description: 'A curved saber designed for mounted combat. Its edge is sharp, and it remembers the charge of battle.',
    iconId: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === SICKLES ===
  {
    id: 'rusty-sickle',
    name: 'Rusty Sickle',
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'poor',
    description: 'A farming tool turned weapon, its blade rusted and its edge dulled. Better than nothing, but barely.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'harvesters-curse',
    name: 'Harvester\'s Curse',
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'common',
    description: 'A curved sickle, its blade sharpened for battle. Once harvested crops, now harvests souls.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },

  // === FLAILS ===
  {
    id: 'broken-chain',
    name: 'Broken Chain',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'poor',
    description: 'A flail with a broken chain, its weighted head barely attached. Unreliable, but still dangerous when it connects.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 45,
    maxDurability: 45
  },
  {
    id: 'iron-thresher',
    name: 'Iron Thresher',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'common',
    description: 'A heavy flail with an iron chain and spiked head. Devastating when it strikes, but slow to swing.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },

  // === FIST WEAPONS ===
  {
    id: 'crude-claws',
    name: 'Crude Claws',
    type: 'weapon',
    subtype: 'FIST_WEAPON',
    quality: 'poor',
    description: 'Rough metal claws strapped to the hands. Uncomfortable and barely functional, but better than bare fists.',
    iconId: 'Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'iron-talons',
    name: 'Iron Talons',
    type: 'weapon',
    subtype: 'FIST_WEAPON',
    quality: 'common',
    description: 'Sharp iron claws that extend from the fingers. Quick and deadly, they remember how to rend flesh.',
    iconId: 'Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },

  // === CROSSBOWS ===
  {
    id: 'cracked-crossbow',
    name: 'Cracked Crossbow',
    type: 'weapon',
    subtype: 'CROSSBOW',
    quality: 'poor',
    description: 'A crossbow with a cracked stock, its string frayed. Unreliable, but still better than nothing at range.',
    iconId: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      strength: { value: -1, isPercentage: false }
    },
    durability: 45,
    maxDurability: 45
  },
  {
    id: 'hunters-crossbow',
    name: 'Hunter\'s Crossbow',
    type: 'weapon',
    subtype: 'CROSSBOW',
    quality: 'common',
    description: 'A well-maintained crossbow, its mechanism smooth and reliable. Simple but effective, it speaks the language of precision.',
    iconId: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 75,
    maxDurability: 75
  },

  // === THROWN WEAPONS ===
  {
    id: 'throwing-axe',
    name: 'Throwing Axe',
    type: 'weapon',
    subtype: 'THROWN',
    quality: 'common',
    description: 'A small axe balanced for throwing. Quick to throw, but once thrown, it must be retrieved.',
    iconId: 'Weapons/Throwing Axe/throwing-axe-brown-handle-beige-blade-standard',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'weathered-boomerang',
    name: 'Weathered Boomerang',
    type: 'weapon',
    subtype: 'BOOMERANG',
    quality: 'common',
    description: 'A curved throwing weapon, worn smooth by countless throws. Returns to the thrower, but sometimes the return is uncertain.',
    iconId: 'Weapons/Boomerang/boomerang-brown-tapered-tip',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'chipped-chakram',
    name: 'Chipped Chakram',
    type: 'weapon',
    subtype: 'CHAKRAM',
    quality: 'poor',
    description: 'A circular throwing weapon with a chipped edge. Still cuts, but the steel remembers when it was whole.',
    iconId: 'Weapons/Chakram/chakram-broken-open-spiky',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'shuriken',
    name: 'Shuriken',
    type: 'weapon',
    subtype: 'SHURIKEN',
    quality: 'common',
    description: 'A small concealed throwing weapon. Quick to throw, but once thrown, it must be retrieved.',
    iconId: 'Weapons/Shuriken/shuriken-diamond-teal-red-orange-yellow-arrows-four-points',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'piercing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 45,
    maxDurability: 45
  },
  {
    id: 'dart',
    name: 'Dart',
    type: 'weapon',
    subtype: 'DART',
    quality: 'poor',
    description: 'A small projectile weapon, its tip dulled. Better than nothing, but barely.',
    iconId: 'Weapons/Dart/dart-broom-orange-yellow-bristles-brown-handle',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 30,
    maxDurability: 30
  },

  // === BLOWGUNS ===
  {
    id: 'crude-blowgun',
    name: 'Crude Blowgun',
    type: 'weapon',
    subtype: 'BLOWGUN',
    quality: 'poor',
    description: 'A simple wooden tube, barely functional. Unreliable, but better than nothing when death comes from afar.',
    iconId: 'Weapons/Blowgun/blowgun-wooden-stick-simple',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd3',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    durability: 35,
    maxDurability: 35
  },
  {
    id: 'hunters-blowgun',
    name: 'Hunter\'s Blowgun',
    type: 'weapon',
    subtype: 'BLOWGUN',
    quality: 'common',
    description: 'A well-crafted blowgun, its tube smooth and reliable. Silent and deadly, it speaks the language of the hunt.',
    iconId: 'Weapons/Blowgun/blowgun-wooden-stick-simple',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },

  // === SLINGS ===
  {
    id: 'frayed-sling',
    name: 'Frayed Sling',
    type: 'weapon',
    subtype: 'SLING',
    quality: 'poor',
    description: 'A simple sling, its leather frayed and weak. Unreliable, but better than nothing when death comes from afar.',
    iconId: 'Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 30,
    maxDurability: 30
  },
  {
    id: 'shepherds-sling',
    name: 'Shepherd\'s Sling',
    type: 'weapon',
    subtype: 'SLING',
    quality: 'common',
    description: 'A well-worn sling, its leather supple from use. Simple but effective, it remembers countless throws.',
    iconId: 'Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },

  // === HALBERDS ===
  {
    id: 'weathered-halberd',
    name: 'Weathered Halberd',
    type: 'weapon',
    subtype: 'HALBERD',
    quality: 'poor',
    description: 'A halberd with a chipped axe blade and bent spike. Too heavy for most, but devastating when it connects.',
    iconId: 'Weapons/Halberd/halberd-axe-blade-spike-hammer-rear',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'polearm-of-burden',
    name: 'Polearm of Burden',
    type: 'weapon',
    subtype: 'HALBERD',
    quality: 'common',
    description: 'A heavy halberd combining axe blade and spear point. Excellent reach, but weighs heavily on both body and spirit.',
    iconId: 'Weapons/Halberd/halberd-axe-blade-spike-hammer-rear',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd10',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 80,
    maxDurability: 80
  },

  // === SCYTHES ===
  {
    id: 'rusty-scythe',
    name: 'Rusty Scythe',
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'poor',
    description: 'A farming tool turned weapon, its blade rusted and its handle splintered. Still reaps, but now it reaps souls.',
    iconId: 'Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'reapers-tool',
    name: 'Reaper\'s Tool',
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'common',
    description: 'A long curved blade on a pole, its edge sharpened for battle. Deadly in skilled hands, it remembers the harvest.',
    iconId: 'Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === JOUSTING SPEARS ===
  {
    id: 'splintered-lance',
    name: 'Splintered Lance',
    type: 'weapon',
    subtype: 'JOUSTING_SPEAR',
    quality: 'poor',
    description: 'A jousting spear with a splintered shaft, its tip bent. Too heavy for most, but devastating when it connects.',
    iconId: 'Weapons/Jousting Spear/jousting-spear-sword-brown-beige-golden-metallic',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'piercing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 55,
    maxDurability: 55
  },
  {
    id: 'knights-lance',
    name: 'Knight\'s Lance',
    type: 'weapon',
    subtype: 'JOUSTING_SPEAR',
    quality: 'common',
    description: 'A long lance designed for mounted combat. Excellent reach, but requires both hands and a steady mount.',
    iconId: 'Weapons/Jousting Spear/jousting-spear-sword-brown-beige-golden-metallic',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd10',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 75,
    maxDurability: 75
  },

  // === DOUBLE-SIDED SWORDS ===
  {
    id: 'broken-staff-blade',
    name: 'Broken Staff-Blade',
    type: 'weapon',
    subtype: 'DOUBLE_SIDED_SWORD',
    quality: 'poor',
    description: 'A double-sided sword with one blade broken. Too heavy for most, but still dangerous when it connects.',
    iconId: 'Weapons/Double-sided Swords/double-sided-sword-beige-blades-brown-shaft_1',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'twin-blade',
    name: 'Twin Blade',
    type: 'weapon',
    subtype: 'DOUBLE_SIDED_SWORD',
    quality: 'common',
    description: 'A sword with blades on both ends. Deadly in skilled hands, but requires mastery to wield safely.',
    iconId: 'Weapons/Double-sided Swords/double-sided-sword-beige-blades-brown-shaft_1',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 70,
    maxDurability: 70
  },

  // === WARHAMMERS ===
  {
    id: 'crude-maul',
    name: 'Crude Maul',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'poor',
    description: 'A massive hammer, more tool than weapon. Brutal and effective, it knows only one purpose: to crush.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 0
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    durability: 65,
    maxDurability: 65
  },
  {
    id: 'iron-judgment',
    name: 'Iron Judgment',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'common',
    description: 'A massive hammer that crushes armor and bone. Too heavy for most, but devastating when it connects.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 85,
    maxDurability: 85
  },

  // === UNCOMMON WEAPONS WITH EFFECTS ===
  {
    id: 'flamebrand',
    name: 'Flamebrand',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'uncommon',
    description: 'A sword that burns with inner fire. Its blade glows with heat, and sometimes that heat lashes out at your enemies.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'fire',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          fire: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 100,
    maxDurability: 100
  },
  {
    id: 'frostbite',
    name: 'Frostbite',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'uncommon',
    description: 'A dagger that chills to the bone. Its edge is always cold, and sometimes that cold freezes your enemies in place.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 1,
            saveDC: 13,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 90,
    maxDurability: 90
  },
  {
    id: 'thunderstrike',
    name: 'Thunderstrike',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'uncommon',
    description: 'A mace that crackles with lightning. When it strikes, sometimes the thunder follows, shocking your enemies.',
    iconId: 'Weapons/Mace/mace-spiked-club-brown-tan-rustic',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    combatStats: {
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
      },
      spellDamage: {
        types: {
          lightning: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 110,
    maxDurability: 110
  },
  {
    id: 'venomstrike',
    name: 'Venomstrike',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'uncommon',
    description: 'A dagger coated in poison. Its edge drips with venom, and sometimes that venom seeps into your enemies\' wounds.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 23,
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
            formula: '1d4',
            damageType: 'poison',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          poison: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 85,
    maxDurability: 85
  },
  {
    id: 'soulreaper',
    name: 'Soulreaper',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'uncommon',
    description: 'A massive blade that hungers for souls. When it strikes, sometimes it drains the life from your enemies, feeding you.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            healingFormula: '1d6',
            isHot: false,
            hotDuration: 3,
            hotTickFrequency: 'round',
            grantsTempHP: false,
            targetType: 'self',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          necrotic: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 120,
    maxDurability: 120
  },

  // === RARE WEAPONS WITH EFFECTS ===
  {
    id: 'stormcaller',
    name: 'Stormcaller',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'rare',
    description: 'A staff that channels the fury of storms. Lightning crackles along its length, and sometimes that lightning strikes your enemies.',
    iconId: 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 5
      }
    },
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
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
          lightning: { value: 5, isPercentage: false },
          arcane: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 150,
    maxDurability: 150
  },
  {
    id: 'shadowblade',
    name: 'Shadowblade',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A blade that seems to drink the light. It moves like shadow, and sometimes that shadow disorients your enemies.',
    iconId: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 5
      }
    },
    baseStats: {
      agility: { value: 4, isPercentage: false },
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 18,
        cardProcRule: 'specific_suit',
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
            saveDC: 15,
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 130,
    maxDurability: 130
  },
  {
    id: 'bonecrusher',
    name: 'Bonecrusher',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'rare',
    description: 'A massive hammer that shatters bone. When it strikes, sometimes it stuns your enemies, leaving them reeling.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['stun'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 1,
            saveDC: 15,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 160,
    maxDurability: 160
  },
  {
    id: 'windwhisper',
    name: 'Windwhisper',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'rare',
    description: 'A bow that sings with the wind. Its arrows fly true, and sometimes the wind itself guides them to strike with precision.',
    iconId: 'Weapons/Bows/bow-simple-brown-wrapped-grip',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'piercing',
        bonusDamage: 5
      }
    },
    baseStats: {
      agility: { value: 4, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 12.5,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'debuff',
          effectConfig: {
            statModifier: { stat: 'speed', magnitude: 10, magnitudeType: 'flat' },
            durationValue: 2,
            durationType: 'rounds',
            saveDC: 14,
            saveType: 'constitution',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          force: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 140,
    maxDurability: 140
  },

  // === EPIC WEAPONS WITH POWERFUL EFFECTS ===
  {
    id: 'inferno-blade',
    name: 'Inferno Blade',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'epic',
    description: 'A massive blade wreathed in eternal flame. When it strikes, the inferno follows, burning and stunning your enemies.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 8
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 15,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning', 'stun'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'fire',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          fire: { value: 8, isPercentage: false }
        }
      }
    },
    durability: 200,
    maxDurability: 200
  },
  {
    id: 'voidreaver',
    name: 'Voidreaver',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'epic',
    description: 'A dagger that cuts through reality itself. When it strikes, it sometimes tears at your enemies\' souls, causing fear and draining their life.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 8
      }
    },
    baseStats: {
      agility: { value: 6, isPercentage: false },
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
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
            saveDC: 17,
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 7, isPercentage: false },
          necrotic: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 180,
    maxDurability: 180
  },
  {
    id: 'stormbreaker',
    name: 'Stormbreaker',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'epic',
    description: 'A massive axe that calls down storms. When it strikes, lightning follows, shocking and knocking back your enemies.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 12, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 8
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 35,
        diceThreshold: 14,
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
            formula: '2d8',
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
          lightning: { value: 8, isPercentage: false }
        }
      }
    },
    durability: 220,
    maxDurability: 220
  },
  {
    id: 'icebreaker',
    name: 'Icebreaker',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'epic',
    description: 'A massive blade forged from eternal ice. When it strikes, it freezes your enemies solid, leaving them vulnerable.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 8
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 15,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['freeze', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 2,
            saveDC: 17,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 8, isPercentage: false }
        }
      }
    },
    durability: 200,
    maxDurability: 200
  },
  {
    id: 'disarmor',
    name: 'Disarmor',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'rare',
    description: 'An elegant rapier that seems to find weaknesses. When it strikes, it sometimes disarms your enemies, leaving them vulnerable.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 5
      }
    },
    baseStats: {
      agility: { value: 5, isPercentage: false },
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['disarm'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'disarm',
            controlDuration: 1,
            saveDC: 15,
            saveType: 'strength',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 130,
    maxDurability: 130
  },
  {
    id: 'venomfang',
    name: 'Venomfang',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'rare',
    description: 'A dagger that drips with deadly poison. When it strikes, the venom burns through your enemies, leaving them weakened.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 5
      }
    },
    baseStats: {
      agility: { value: 4, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 30,
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
            formula: '1d8',
            damageType: 'poison',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          poison: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 100,
    maxDurability: 100
  },
  {
    id: 'dueling-rapier',
    name: 'Dueling Rapier',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'uncommon',
    description: 'An elegant rapier designed for dueling. Quick and precise, it finds gaps in armor with ease.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'piercing',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 95,
    maxDurability: 95
  },
  {
    id: 'honor-blade',
    name: 'Honor Blade',
    type: 'weapon',
    subtype: 'KATANA',
    quality: 'uncommon',
    description: 'A katana forged with honor and precision. Its edge is razor-sharp, and it moves like water.',
    iconId: 'Weapons/Katana/katana-curved-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    durability: 95,
    maxDurability: 95
  },
  {
    id: 'cavalry-saber',
    name: 'Cavalry Saber',
    type: 'weapon',
    subtype: 'SABER',
    quality: 'uncommon',
    description: 'A curved saber designed for mounted combat. Its blade is weighted for slashing, perfect for cutting down enemies.',
    iconId: 'Weapons/Saber/saber-curved-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    durability: 95,
    maxDurability: 95
  },
  {
    id: 'harvest-sickle',
    name: 'Harvest Sickle',
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'uncommon',
    description: 'A sickle that has harvested both crops and lives. Its curved blade is sharp, designed for quick, precise cuts.',
    iconId: 'Weapons/Sickle/sickle-curved-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false }
    },
    durability: 85,
    maxDurability: 85
  },
  {
    id: 'chain-flail',
    name: 'Chain Flail',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'uncommon',
    description: 'A flail with a chain connecting the handle to the head. Unpredictable in motion, it strikes from unexpected angles.',
    iconId: 'Weapons/Flail/flail-spiked-ball-chain-brown-handle',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    durability: 90,
    maxDurability: 90
  },
  {
    id: 'iron-fist',
    name: 'Iron Fist',
    type: 'weapon',
    subtype: 'FIST_WEAPON',
    quality: 'uncommon',
    description: 'A metal gauntlet designed for unarmed combat. It turns your fists into weapons, allowing you to strike with metal.',
    iconId: 'Weapons/Fist Weapon/fist-weapon-gauntlet-brown-leather-metal',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    durability: 80,
    maxDurability: 80
  },
  {
    id: 'arcane-staff',
    name: 'Arcane Staff',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'uncommon',
    description: 'A staff imbued with arcane energy. It channels magic, making spells more potent and easier to cast.',
    iconId: 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'bludgeoning',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 110,
    maxDurability: 110
  },
  {
    id: 'wand-of-flame',
    name: 'Wand of Flame',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'uncommon',
    description: 'A wand that crackles with fire. It enhances fire magic and can channel flames through its tip.',
    iconId: 'Weapons/Wand/wand-wooden-golden-tip-brown-handle',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          fire: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 70,
    maxDurability: 70
  },
  {
    id: 'wand-of-frost',
    name: 'Wand of Frost',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'uncommon',
    description: 'A wand that radiates cold. It enhances ice magic and can channel frost through its tip.',
    iconId: 'Weapons/Wand/wand-wooden-golden-tip-brown-handle',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 2
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 70,
    maxDurability: 70
  },
  {
    id: 'throwing-axe',
    name: 'Throwing Axe',
    type: 'weapon',
    subtype: 'THROWN',
    quality: 'common',
    description: 'A small axe designed for throwing. Balanced for flight, it can be thrown accurately at enemies.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'slashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 50,
    maxDurability: 50
  },
  {
    id: 'throwing-dagger',
    name: 'Throwing Dagger',
    type: 'weapon',
    subtype: 'THROWN',
    quality: 'common',
    description: 'A dagger balanced for throwing. Quick and deadly, it can be thrown with precision.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 40,
    maxDurability: 40
  },
  {
    id: 'poison-blowgun',
    name: 'Poison Blowgun',
    type: 'weapon',
    subtype: 'BLOWGUN',
    quality: 'uncommon',
    description: 'A blowgun designed for poison darts. Silent and deadly, it can take down enemies without alerting others.',
    iconId: 'Weapons/Blowgun/blowgun-wooden-tube-brown-simple',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'piercing',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          poison: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 80,
    maxDurability: 80
  },
  {
    id: 'sling-stone',
    name: 'Sling Stone',
    type: 'weapon',
    subtype: 'SLING',
    quality: 'common',
    description: 'A simple sling for hurling stones. Basic but effective, it can strike enemies from a distance.',
    iconId: 'Weapons/Sling/sling-leather-brown-simple',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'bludgeoning',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 60,
    maxDurability: 60
  },
  {
    id: 'war-spear',
    name: 'War Spear',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'common',
    description: 'A long spear designed for warfare. Its reach is its greatest advantage, keeping enemies at bay.',
    iconId: 'Weapons/Spear/spear-wooden-shaft-bronze-tip',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'piercing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    durability: 90,
    maxDurability: 90
  },
  {
    id: 'pike',
    name: 'Pike',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'common',
    description: 'A long pike, longer than most spears. Its extreme reach makes it deadly in formation, but unwieldy alone.',
    iconId: 'Weapons/Spear/spear-wooden-shaft-bronze-tip',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'piercing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 100,
    maxDurability: 100
  },
  {
    id: 'glaive',
    name: 'Glaive',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'uncommon',
    description: 'A glaive with a curved blade on a long pole. Versatile and deadly, it can both slash and thrust.',
    iconId: 'Weapons/Halberd/halberd-wooden-shaft-bronze-blade',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    durability: 110,
    maxDurability: 110
  },
  {
    id: 'executioners-axe',
    name: 'Executioner\'s Axe',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'uncommon',
    description: 'A massive axe designed for executions. Its heavy blade can cleave through bone and armor with ease.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 120,
    maxDurability: 120
  },
  {
    id: 'berserker-axe',
    name: 'Berserker Axe',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'uncommon',
    description: 'A massive axe that seems to hunger for battle. Its weight is brutal, designed for crushing through defenses.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'slashing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 120,
    maxDurability: 120
  },
  {
    id: 'battle-halberd',
    name: 'Battle Halberd',
    type: 'weapon',
    subtype: 'HALBERD',
    quality: 'uncommon',
    description: 'A halberd designed for battle. Its combination of axe, spear, and hook makes it versatile in combat.',
    iconId: 'Weapons/Halberd/halberd-wooden-shaft-bronze-blade',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd10',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: 0, isPercentage: false }
    },
    durability: 110,
    maxDurability: 110
  },
  {
    id: 'reapers-scythe',
    name: 'Reaper\'s Scythe',
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'uncommon',
    description: 'A scythe that has reaped both crops and lives. Its curved blade is sharp, designed for sweeping strikes.',
    iconId: 'Weapons/Scythe/scythe-curved-blade-wooden-shaft',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slashing',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    durability: 100,
    maxDurability: 100
  }
];
