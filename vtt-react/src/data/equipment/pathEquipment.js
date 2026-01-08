/**
 * Path-Specific Starting Equipment
 * 
 * Items that are only available to specific character paths.
 * These are path-wide items, not class-specific.
 */

// ===== MYSTIC PATH =====
export const MYSTIC_PATH_ITEMS = [
    {
        id: 'mystic-crystal-focus',
        name: 'Mystic Crystal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A glowing crystal that enhances mystical abilities.',
        iconId: 'inv_misc_gem_crystal_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['mystic']
        }
    },
    
    {
        id: 'mystic-meditation-beads',
        name: 'Meditation Beads',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'common',
        description: 'Prayer beads used for meditation and focusing mystical energy.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['mystic']
        }
    }
];

// ===== ZEALOT PATH =====
export const ZEALOT_PATH_ITEMS = [
    {
        id: 'zealot-holy-symbol',
        name: 'Zealot\'s Holy Symbol',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A holy symbol representing your zealous devotion.',
        iconId: 'inv_jewelry_talisman_05',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            paths: ['zealot']
        }
    },
    
    {
        id: 'zealot-prayer-book',
        name: 'Book of Devotions',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A book of prayers and devotional texts.',
        iconId: 'inv_misc_book_05',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['zealot']
        }
    }
];

// ===== TRICKSTER PATH =====
export const TRICKSTER_PATH_ITEMS = [
    {
        id: 'trickster-lockpicks',
        name: 'Masterwork Lockpicks',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A set of finely crafted lockpicks. Essential for any trickster.',
        iconId: 'inv_misc_key_03',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['trickster']
        }
    },

    {
        id: 'trickster-disguise-kit',
        name: 'Disguise Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A kit containing makeup, wigs, and accessories for disguises.',
        iconId: 'inv_misc_bag_15',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['trickster']
        }
    }
];

// ===== HARROW PATH =====
export const HARROW_PATH_ITEMS = [
    {
        id: 'harrow-hunting-knife',
        name: 'Hunter\'s Knife',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A versatile knife for hunting, skinning, and survival.',
        iconId: 'inv_weapon_shortblade_07',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
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
                damageType: 'slashing'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['harrow']
        }
    },
    
    {
        id: 'harrow-survival-kit',
        name: 'Wilderness Survival Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Essential tools for surviving in the wilderness.',
        iconId: 'inv_misc_bag_12',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['harrow']
        }
    }
];

// ===== ARCANIST PATH =====
export const ARCANIST_PATH_ITEMS = [
    {
        id: 'arcanist-spell-components',
        name: 'Arcane Component Pouch',
        type: 'container',
        subtype: 'POUCH',
        quality: 'common',
        description: 'A pouch containing various spell components and reagents.',
        iconId: 'inv_misc_bag_09',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 2, cols: 2 },
            items: []
        },
        availableFor: {
            paths: ['arcanist']
        }
    },
    
    {
        id: 'arcanist-arcane-focus',
        name: 'Arcane Focus',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystalline focus for channeling arcane energy.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            paths: ['arcanist']
        }
    }
];

// ===== HEXER PATH =====
export const HEXER_PATH_ITEMS = [
    {
        id: 'hexer-curse-doll',
        name: 'Curse Doll',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A small doll used for channeling hexes and curses.',
        iconId: 'inv_misc_bone_humanskull_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['hexer']
        }
    },

    {
        id: 'hexer-dark-grimoire',
        name: 'Grimoire of Hexes',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A dark tome containing knowledge of curses and hexes.',
        iconId: 'inv_misc_book_13',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['hexer']
        }
    }
];

// ===== REAVER PATH =====
export const REAVER_PATH_ITEMS = [
    {
        id: 'reaver-battle-standard',
        name: 'Battle Standard',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A tattered battle standard from past conflicts.',
        iconId: 'inv_bannerpvp_01',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 3,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['reaver']
        }
    },

    {
        id: 'reaver-whetstone',
        name: 'Warrior\'s Whetstone',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A whetstone for keeping your weapons sharp.',
        iconId: 'inv_stone_02',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['reaver']
        }
    }
];

// ===== MERCENARY PATH =====
export const MERCENARY_PATH_ITEMS = [
    {
        id: 'mercenary-contract',
        name: 'Mercenary Contract',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A blank contract for mercenary work. Proof of your profession.',
        iconId: 'inv_scroll_03',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['mercenary']
        }
    },
    
    {
        id: 'mercenary-coin-purse',
        name: 'Heavy Coin Purse',
        type: 'container',
        subtype: 'POUCH',
        quality: 'common',
        description: 'A sturdy coin purse for storing your earnings.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 2, cols: 2 },
            items: []
        },
        availableFor: {
            paths: ['mercenary']
        }
    }
];

// ===== SENTINEL PATH =====
export const SENTINEL_PATH_ITEMS = [
    {
        id: 'sentinel-guard-insignia',
        name: 'Guard Insignia',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'An insignia marking you as a protector and guardian.',
        iconId: 'inv_jewelry_talisman_08',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['sentinel']
        }
    },
    
    {
        id: 'sentinel-oath-scroll',
        name: 'Oath Scroll',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A scroll containing the oaths and codes of the sentinel.',
        iconId: 'inv_scroll_05',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['sentinel']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_PATH_EQUIPMENT = [
    ...MYSTIC_PATH_ITEMS,
    ...ZEALOT_PATH_ITEMS,
    ...TRICKSTER_PATH_ITEMS,
    ...HARROW_PATH_ITEMS,
    ...ARCANIST_PATH_ITEMS,
    ...HEXER_PATH_ITEMS,
    ...REAVER_PATH_ITEMS,
    ...MERCENARY_PATH_ITEMS,
    ...SENTINEL_PATH_ITEMS
];

