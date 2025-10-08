/**
 * Race-Specific Starting Equipment
 * 
 * Items that are only available to specific races and subraces.
 * Organized by race and subrace.
 */

// ===== HUMAN =====
export const HUMAN_ITEMS = [
    {
        id: 'human-versatile-toolkit',
        name: 'Versatile Toolkit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A collection of tools reflecting human adaptability and ingenuity.',
        iconId: 'inv_misc_enggizmos_19',
        value: { platinum: 0, gold: 4, silver: 65, copper: 75 },
        weight: 5,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-longsword',
        name: 'Human Longsword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A well-balanced longsword representing human martial tradition.',
        iconId: 'inv_sword_04',
        value: { platinum: 0, gold: 7, silver: 25, copper: 50 },
        weight: 3,
        width: 1,
        height: 3,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'slashing'
            }
        },
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-chainmail',
        name: 'Human Chainmail',
        type: 'armor',
        subtype: 'MAIL',
        quality: 'common',
        description: 'Standard issue chainmail worn by human soldiers.',
        iconId: 'inv_chest_chain_03',
        value: { platinum: 0, gold: 11, silver: 75, copper: 25 },
        weight: 20,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 3, isPercentage: false }
        },
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-travelers-pack',
        name: 'Traveler\'s Pack',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A practical pack containing rope, rations, and basic supplies.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 2, silver: 85, copper: 75 },
        weight: 8,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-signet-ring',
        name: 'Family Signet Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'common',
        description: 'A ring bearing your family crest, proof of your lineage.',
        iconId: 'inv_jewelry_ring_14',
        value: { platinum: 0, gold: 3, silver: 50, copper: 25 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-crossbow',
        name: 'Light Crossbow',
        type: 'weapon',
        subtype: 'CROSSBOW',
        quality: 'common',
        description: 'A reliable crossbow favored by human hunters and guards.',
        iconId: 'inv_weapon_crossbow_07',
        value: { platinum: 0, gold: 8, silver: 60, copper: 40 },
        weight: 5,
        width: 2,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'piercing'
            }
        },
        availableFor: {
            races: ['human']
        }
    }
];

// ===== NORDMARK =====
export const BERSERKER_NORDMARK_ITEMS = [
    {
        id: 'berserker-greataxe',
        name: 'Berserker Greataxe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A massive two-handed axe forged in the frozen north. Favored by berserkers.',
        iconId: 'inv_axe_09',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 7,
        width: 2,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 12,
                damageType: 'slashing'
            }
        },
        baseStats: {
            strength: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['berserker_nordmark']
        }
    },

    {
        id: 'berserker-fur-armor',
        name: 'Berserker Fur Armor',
        type: 'armor',
        subtype: 'HIDE',
        quality: 'common',
        description: 'Heavy furs and hides worn by northern berserkers. Provides warmth and protection.',
        iconId: 'inv_chest_leather_08',
        value: { platinum: 0, gold: 7, silver: 50, copper: 75 },
        weight: 12,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['berserker_nordmark']
        }
    },

    {
        id: 'berserker-war-horn',
        name: 'War Horn of the North',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A carved horn that rallies allies and strikes fear into enemies.',
        iconId: 'inv_misc_horn_01',
        value: { platinum: 0, gold: 5, silver: 60, copper: 25 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['berserker_nordmark']
        }
    },

    {
        id: 'berserker-throwing-axe',
        name: 'Throwing Axe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A balanced throwing axe for ranged combat.',
        iconId: 'inv_axe_03',
        value: { platinum: 0, gold: 2, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'slashing'
            }
        },
        availableFor: {
            subraces: ['berserker_nordmark']
        }
    }
];

export const SKALD_NORDMARK_ITEMS = [
    {
        id: 'skald-runeblade',
        name: 'Skald\'s Runeblade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A sword etched with ancient runes that glow when sagas are sung.',
        iconId: 'inv_sword_27',
        value: { platinum: 0, gold: 10, silver: 85, copper: 50 },
        weight: 3,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'slashing'
            }
        },
        baseStats: {
            charisma: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['skald_nordmark']
        }
    },

    {
        id: 'skald-saga-tome',
        name: 'Tome of Ancient Sagas',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A leather-bound book containing the epic sagas of your people.',
        iconId: 'inv_misc_book_11',
        value: { platinum: 0, gold: 8, silver: 75, copper: 25 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['skald_nordmark']
        }
    }
];

export const NORDMARK_ITEMS = [
    ...BERSERKER_NORDMARK_ITEMS,
    ...SKALD_NORDMARK_ITEMS
];

// ===== CORVANI =====
export const ORACLE_CORVANI_ITEMS = [
    {
        id: 'oracle-divination-staff',
        name: 'Oracle\'s Divination Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff topped with a raven skull, used for channeling prophetic visions.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 11, silver: 50, copper: 75 },
        weight: 4,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['oracle_corvani']
        }
    },

    {
        id: 'oracle-raven-cloak',
        name: 'Raven Feather Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak woven with raven feathers that shimmer with otherworldly light.',
        iconId: 'inv_misc_cape_20',
        value: { platinum: 0, gold: 9, silver: 60, copper: 40 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['oracle_corvani']
        }
    },

    {
        id: 'oracle-scrying-orb',
        name: 'Scrying Orb',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystal orb that aids in divination and seeing distant places.',
        iconId: 'inv_misc_orb_01',
        value: { platinum: 0, gold: 7, silver: 80, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['oracle_corvani']
        }
    }
];

export const SCOUT_CORVANI_ITEMS = [
    {
        id: 'scout-shortbow',
        name: 'Scout\'s Shortbow',
        type: 'weapon',
        subtype: 'BOW',
        quality: 'common',
        description: 'A lightweight bow perfect for swift highland scouts.',
        iconId: 'inv_weapon_bow_08',
        value: { platinum: 0, gold: 7, silver: 65, copper: 35 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'piercing'
            }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['scout_corvani']
        }
    },

    {
        id: 'scout-leather-armor',
        name: 'Scout\'s Leather Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Light leather armor designed for speed and stealth.',
        iconId: 'inv_chest_leather_03',
        value: { platinum: 0, gold: 6, silver: 85, copper: 50 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['scout_corvani']
        }
    },

    {
        id: 'scout-messenger-bag',
        name: 'Messenger\'s Satchel',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A weatherproof bag for carrying messages and supplies.',
        iconId: 'inv_misc_bag_07',
        value: { platinum: 0, gold: 3, silver: 75, copper: 50 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            subraces: ['scout_corvani']
        }
    }
];

export const CORVANI_ITEMS = [
    ...ORACLE_CORVANI_ITEMS,
    ...SCOUT_CORVANI_ITEMS
];

// ===== GRIMHEART =====
export const DELVER_GRIMHEART_ITEMS = [
    {
        id: 'delver-mining-pick',
        name: 'Deep Delver\'s Pick',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A heavy mining pick that doubles as a formidable weapon.',
        iconId: 'inv_pick_02',
        value: { platinum: 0, gold: 7, silver: 60, copper: 40 },
        weight: 6,
        width: 2,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'piercing'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['delver_grimheart']
        }
    },

    {
        id: 'delver-stone-armor',
        name: 'Stone-Reinforced Armor',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Heavy armor reinforced with stone plates from the deep earth.',
        iconId: 'inv_chest_plate_06',
        value: { platinum: 0, gold: 14, silver: 75, copper: 50 },
        weight: 25,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 4, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['delver_grimheart']
        }
    },

    {
        id: 'delver-lantern',
        name: 'Deep Earth Lantern',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A sturdy lantern that never runs out of oil, fueled by earth magic.',
        iconId: 'inv_misc_lantern_01',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            subraces: ['delver_grimheart']
        }
    }
];

export const WARDEN_GRIMHEART_ITEMS = [
    {
        id: 'warden-warhammer',
        name: 'Warden\'s Warhammer',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A heavy warhammer used by grimheart wardens to protect their kin.',
        iconId: 'inv_hammer_05',
        value: { platinum: 0, gold: 8, silver: 75, copper: 25 },
        weight: 5,
        width: 2,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['warden_grimheart']
        }
    },

    {
        id: 'warden-shield',
        name: 'Stone Guardian Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'uncommon',
        description: 'A heavy shield carved from a single piece of stone.',
        iconId: 'inv_shield_06',
        value: { platinum: 0, gold: 10, silver: 60, copper: 50 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['offHand'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['warden_grimheart']
        }
    }
];

export const MOUNTAIN_DWARF_ITEMS = [
    {
        id: 'mountain-dwarf-battleaxe',
        name: 'Dwarven Battleaxe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A well-crafted battleaxe forged in the mountain halls.',
        iconId: 'inv_axe_06',
        value: { platinum: 0, gold: 8, silver: 80, copper: 50 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'slashing'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['mountaindwarf_grimheart']
        }
    },

    {
        id: 'mountain-dwarf-scale-mail',
        name: 'Dwarven Scale Mail',
        type: 'armor',
        subtype: 'SCALE',
        quality: 'common',
        description: 'Expertly crafted scale mail, a hallmark of dwarven smithing.',
        iconId: 'inv_chest_chain_07',
        value: { platinum: 0, gold: 11, silver: 65, copper: 75 },
        weight: 18,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 3, isPercentage: false }
        },
        availableFor: {
            subraces: ['mountaindwarf_grimheart']
        }
    }
];

export const GRIMHEART_ITEMS = [
    ...DELVER_GRIMHEART_ITEMS,
    ...WARDEN_GRIMHEART_ITEMS,
    ...MOUNTAIN_DWARF_ITEMS
];

// ===== ELF =====
export const HIGH_ELF_ITEMS = [
    {
        id: 'high-elf-spellbook',
        name: 'Elven Spellbook',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'An elegant spellbook written in flowing Elvish script.',
        iconId: 'inv_misc_book_07',
        value: { platinum: 0, gold: 9, silver: 50, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['highElf']
        }
    },

    {
        id: 'high-elf-rapier',
        name: 'Elven Rapier',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A graceful rapier forged with elven precision.',
        iconId: 'inv_sword_39',
        value: { platinum: 0, gold: 10, silver: 75, copper: 25 },
        weight: 2,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'piercing'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['highElf']
        }
    },

    {
        id: 'high-elf-robes',
        name: 'High Elf Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Elegant robes woven with arcane threads.',
        iconId: 'inv_chest_cloth_25',
        value: { platinum: 0, gold: 8, silver: 60, copper: 40 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['highElf']
        }
    }
];

export const WOOD_ELF_ITEMS = [
    {
        id: 'wood-elf-longbow',
        name: 'Elven Longbow',
        type: 'weapon',
        subtype: 'BOW',
        quality: 'uncommon',
        description: 'A finely crafted longbow made from ancient wood. Light and deadly accurate.',
        iconId: 'inv_weapon_bow_07',
        value: { platinum: 0, gold: 11, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'piercing'
            }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['woodElf']
        }
    },

    {
        id: 'wood-elf-quiver',
        name: 'Elven Quiver',
        type: 'container',
        subtype: 'QUIVER',
        quality: 'common',
        description: 'A leather quiver with 20 arrows, crafted in the elven style.',
        iconId: 'inv_misc_quiver_03',
        value: { platinum: 0, gold: 2, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            subraces: ['woodElf']
        }
    },

    {
        id: 'wood-elf-shortsword',
        name: 'Wood Elf Shortsword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A lightweight shortsword perfect for forest combat.',
        iconId: 'inv_sword_18',
        value: { platinum: 0, gold: 6, silver: 50, copper: 75 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'slashing'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['woodElf']
        }
    },

    {
        id: 'wood-elf-cloak',
        name: 'Forest Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A green cloak that helps you blend into forest surroundings.',
        iconId: 'inv_misc_cape_18',
        value: { platinum: 0, gold: 4, silver: 75, copper: 25 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['woodElf']
        }
    }
];

export const DARK_ELF_ITEMS = [
    {
        id: 'dark-elf-hand-crossbow',
        name: 'Drow Hand Crossbow',
        type: 'weapon',
        subtype: 'CROSSBOW',
        quality: 'uncommon',
        description: 'A compact hand crossbow favored by the drow. Can be poisoned.',
        iconId: 'inv_weapon_crossbow_04',
        value: { platinum: 0, gold: 10, silver: 60, copper: 50 },
        weight: 3,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'piercing'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['darkElf']
        }
    },

    {
        id: 'dark-elf-rapier',
        name: 'Drow Rapier',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A sleek rapier forged in the Underdark, light as shadow.',
        iconId: 'inv_sword_48',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'piercing'
            }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['darkElf']
        }
    },

    {
        id: 'dark-elf-armor',
        name: 'Drow Leather Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Black leather armor that seems to absorb light.',
        iconId: 'inv_chest_leather_09',
        value: { platinum: 0, gold: 11, silver: 50, copper: 75 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['darkElf']
        }
    },

    {
        id: 'dark-elf-poison-vial',
        name: 'Drow Poison Vial',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'uncommon',
        description: 'A vial of potent drow poison. Can be applied to weapons.',
        iconId: 'inv_potion_20',
        value: { platinum: 0, gold: 7, silver: 60, copper: 40 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStack: 5,
        availableFor: {
            subraces: ['darkElf']
        }
    }
];

export const ELF_ITEMS = [
    ...HIGH_ELF_ITEMS,
    ...WOOD_ELF_ITEMS,
    ...DARK_ELF_ITEMS
];

// ===== DWARF (HILL DWARF - separate from Grimheart) =====
export const HILL_DWARF_ITEMS = [
    {
        id: 'hill-dwarf-shield',
        name: 'Hill Dwarf Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'common',
        description: 'A sturdy shield bearing the crest of your hill clan.',
        iconId: 'inv_shield_04',
        value: { platinum: 0, gold: 7, silver: 75, copper: 50 },
        weight: 6,
        width: 2,
        height: 2,
        slots: ['offHand'],
        armorClass: 2,
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['hillDwarf']
        }
    }
];

export const DWARF_ITEMS = [
    ...HILL_DWARF_ITEMS
];

// ===== HALFLING =====
export const LIGHTFOOT_HALFLING_ITEMS = [
    {
        id: 'lightfoot-halfling-sling',
        name: 'Halfling Sling',
        type: 'weapon',
        subtype: 'SLING',
        quality: 'common',
        description: 'A simple but effective sling. Halflings are surprisingly accurate with these.',
        iconId: 'inv_misc_rope_01',
        value: { platinum: 0, gold: 1, silver: 75, copper: 50 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 4,
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['lightfootHalfling']
        }
    },

    {
        id: 'lightfoot-dagger',
        name: 'Lightfoot Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A small, nimble dagger perfect for quick strikes.',
        iconId: 'inv_weapon_shortblade_14',
        value: { platinum: 0, gold: 3, silver: 60, copper: 75 },
        weight: 1,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 4,
                damageType: 'piercing'
            }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['lightfootHalfling']
        }
    },

    {
        id: 'lightfoot-leather-vest',
        name: 'Lightfoot Leather Vest',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Lightweight leather armor that doesn\'t hinder movement.',
        iconId: 'inv_chest_leather_01',
        value: { platinum: 0, gold: 5, silver: 75, copper: 50 },
        weight: 5,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['lightfootHalfling']
        }
    },

    {
        id: 'lightfoot-lucky-charm',
        name: 'Lucky Halfling Charm',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A small charm said to bring good fortune to its bearer.',
        iconId: 'inv_jewelry_talisman_07',
        value: { platinum: 0, gold: 2, silver: 85, copper: 25 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['lightfootHalfling']
        }
    }
];

export const STOUT_HALFLING_ITEMS = [
    {
        id: 'stout-halfling-shortsword',
        name: 'Halfling Shortsword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A shortsword sized perfectly for halfling hands.',
        iconId: 'inv_sword_04',
        value: { platinum: 0, gold: 5, silver: 50, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'slashing'
            }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['stoutHalfling']
        }
    }
];

export const HALFLING_ITEMS = [
    ...LIGHTFOOT_HALFLING_ITEMS,
    ...STOUT_HALFLING_ITEMS
];

// ===== ORC =====
export const WAR_ORC_ITEMS = [
    {
        id: 'war-orc-greataxe',
        name: 'Orcish Greataxe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'uncommon',
        description: 'A massive axe forged in the war camps. Brutal and effective.',
        iconId: 'inv_axe_23',
        value: { platinum: 0, gold: 13, silver: 60, copper: 75 },
        weight: 7,
        width: 2,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 12,
                damageType: 'slashing'
            }
        },
        baseStats: {
            strength: { value: 3, isPercentage: false }
        },
        availableFor: {
            subraces: ['warOrc']
        }
    },

    {
        id: 'war-orc-hide-armor',
        name: 'Orcish Hide Armor',
        type: 'armor',
        subtype: 'HIDE',
        quality: 'common',
        description: 'Thick hide armor decorated with war trophies.',
        iconId: 'inv_chest_leather_06',
        value: { platinum: 0, gold: 9, silver: 50, copper: 75 },
        weight: 15,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['warOrc']
        }
    },

    {
        id: 'war-orc-javelin',
        name: 'Orcish Javelin',
        type: 'weapon',
        subtype: 'SPEAR',
        quality: 'common',
        description: 'A heavy javelin designed for throwing or melee combat.',
        iconId: 'inv_spear_04',
        value: { platinum: 0, gold: 4, silver: 75, copper: 50 },
        weight: 3,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'piercing'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['warOrc']
        }
    },

    {
        id: 'war-orc-war-paint',
        name: 'War Paint Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Ceremonial war paint used to intimidate enemies.',
        iconId: 'inv_misc_paint_01',
        value: { platinum: 0, gold: 1, silver: 85, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['warOrc']
        }
    }
];

export const ORC_ITEMS = [
    ...WAR_ORC_ITEMS
];

// ===== COMBINED EXPORT =====

export const ALL_RACE_EQUIPMENT = [
    ...HUMAN_ITEMS,
    ...NORDMARK_ITEMS,
    ...CORVANI_ITEMS,
    ...GRIMHEART_ITEMS,
    ...ELF_ITEMS,
    ...DWARF_ITEMS,
    ...HALFLING_ITEMS,
    ...ORC_ITEMS
];

