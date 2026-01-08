/**
 * Race-Specific Starting Equipment
 * 
 * Items that are only available to specific races and subraces.
 * Organized by race and subrace.
 */

// ===== BASE RACE ITEMS (2 per race) =====

// Human base items
export const HUMAN_BASE_ITEMS = [
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
    }
];

// Nordmark base items
export const NORDMARK_BASE_ITEMS = [
    {
        id: 'nordmark-frost-gloves',
        name: 'Frostbite Gloves',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Gloves that resist cold and allow bare-handed combat in freezing conditions.',
        iconId: 'inv_gauntlets_02',
        value: { platinum: 0, gold: 5, silver: 75, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['nordmark']
        }
    },

    {
        id: 'nordmark-winter-boots',
        name: 'Snowtread Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Boots designed for traversing snow and ice with enhanced traction.',
        iconId: 'inv_boots_04',
        value: { platinum: 0, gold: 6, silver: 85, copper: 25 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['nordmark']
        }
    }
];

// Corvani base items
export const CORVANI_BASE_ITEMS = [
    {
        id: 'corvani-hunter-bracers',
        name: 'Eagle-eye Bracers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Bracers that enhance vision and provide protection for archers.',
        iconId: 'inv_bracer_05',
        value: { platinum: 0, gold: 8, silver: 50, copper: 75 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['wrists'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            races: ['corvani']
        }
    },

    {
        id: 'corvani-mountain-cloak',
        name: 'Highland Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A lightweight cloak that provides camouflage in mountainous terrain.',
        iconId: 'inv_misc_cape_17',
        value: { platinum: 0, gold: 5, silver: 75, copper: 25 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['corvani']
        }
    }
];

// Vheil base items
export const VHEIL_BASE_ITEMS = [
    {
        id: 'vveil-ethereal-gloves',
        name: 'Ethereal Gloves',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Gloves that allow brief phasing through solid objects.',
        iconId: 'inv_gauntlets_06',
        value: { platinum: 0, gold: 7, silver: 85, copper: 50 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['vheil']
        }
    },

    {
        id: 'vheil-spectral-boots',
        name: 'Spectral Boots',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Boots that make footsteps silent and allow brief ethereal steps.',
        iconId: 'inv_boots_05',
        value: { platinum: 0, gold: 8, silver: 60, copper: 40 },
        weight: 1,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['vheil']
        }
    }
];

// Mimir base items
export const MIMIR_BASE_ITEMS = [
    {
        id: 'mimir-knowledge-ring',
        name: 'Ring of Ancient Knowledge',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances memory and grants occasional flashes of forgotten lore.',
        iconId: 'inv_jewelry_ring_05',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['mimir']
        }
    },

    {
        id: 'mimir-scholar-belt',
        name: 'Scholar\'s Component Belt',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A belt with pouches containing various arcane components and writing materials.',
        iconId: 'inv_belt_03',
        value: { platinum: 0, gold: 4, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['mimir']
        }
    }
];

// Briaran base items
export const BRIARAN_BASE_ITEMS = [
    {
        id: 'briaran-nature-bracers',
        name: 'Bramble Bracers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Bracers woven from living vines that provide protection and natural camouflage.',
        iconId: 'inv_bracer_07',
        value: { platinum: 0, gold: 6, silver: 85, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['wrists'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['briaran']
        }
    },

    {
        id: 'briaran-root-boots',
        name: 'Rootbound Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Boots reinforced with flexible roots that provide stability in rough terrain.',
        iconId: 'inv_boots_06',
        value: { platinum: 0, gold: 5, silver: 75, copper: 25 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            races: ['briaran']
        }
    }
];

// Groven base items
export const GROVEN_BASE_ITEMS = [
    {
        id: 'groven-earth-gloves',
        name: 'Stonegrip Gloves',
        type: 'armor',
        subtype: 'MAIL',
        quality: 'common',
        description: 'Gloves reinforced with stone that provide enhanced grip and earth-based protection.',
        iconId: 'inv_gauntlets_04',
        value: { platinum: 0, gold: 6, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['groven']
        }
    },

    {
        id: 'groven-earth-belt',
        name: 'Earthmender Belt',
        type: 'armor',
        subtype: 'MAIL',
        quality: 'uncommon',
        description: 'A belt infused with earthen magic that helps mend wounds over time.',
        iconId: 'inv_belt_06',
        value: { platinum: 0, gold: 8, silver: 50, copper: 75 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['groven']
        }
    }
];

// Emberth base items
export const EMBERTH_BASE_ITEMS = [
    {
        id: 'emberth-flame-bracers',
        name: 'Ember Bracers',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Bracers that radiate warmth and protect against cold environments.',
        iconId: 'inv_bracer_02',
        value: { platinum: 0, gold: 8, silver: 75, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['wrists'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['emberth']
        }
    },

    {
        id: 'emberth-heat-boots',
        name: 'Firesoul Boots',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Boots that keep feet warm in cold conditions and provide traction on icy surfaces.',
        iconId: 'inv_boots_05',
        value: { platinum: 0, gold: 6, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            charisma: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['emberth']
        }
    }
];

// Vreken base items
export const VREKEN_BASE_ITEMS = [
    {
        id: 'vreken-shadow-gloves',
        name: 'Shadowsilk Gloves',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Gloves woven from shadow that allow manipulation of darkness.',
        iconId: 'inv_gauntlets_23',
        value: { platinum: 0, gold: 7, silver: 85, copper: 50 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['hands'],
        baseStats: {
            agility: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['vreken']
        }
    },

    {
        id: 'vreken-dark-cloak',
        name: 'Twilight Mantle',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak that blends with shadows and provides concealment in low light.',
        iconId: 'inv_misc_cape_21',
        value: { platinum: 0, gold: 9, silver: 60, copper: 40 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['vreken']
        }
    }
];

// Morthel base items
export const MORTHEL_BASE_ITEMS = [
    {
        id: 'morthel-death-ring',
        name: 'Soul Echo Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that allows brief glimpses of the recently departed.',
        iconId: 'inv_jewelry_ring_28',
        value: { platinum: 0, gold: 10, silver: 75, copper: 50 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['morthel']
        }
    },

    {
        id: 'morthel-grave-boots',
        name: 'Gravewalker Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Boots that make no sound on natural ground and allow silent movement.',
        iconId: 'inv_boots_08',
        value: { platinum: 0, gold: 8, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['morthel']
        }
    }
];

// Volketh base items
export const VOLKETH_BASE_ITEMS = [
    {
        id: 'volketh-beast-bracers',
        name: 'Beastfang Bracers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Bracers adorned with beast fangs that enhance physical strength.',
        iconId: 'inv_bracer_08',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['wrists'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            strength: { value: 2, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['volketh']
        }
    },

    {
        id: 'volketh-hunter-belt',
        name: 'Beasthunter Belt',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'A belt made from beast hide that provides carrying capacity and survival benefits.',
        iconId: 'inv_belt_04',
        value: { platinum: 0, gold: 6, silver: 85, copper: 50 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['volketh']
        }
    }
];

// Drennar base items
export const DRENNAR_BASE_ITEMS = [
    {
        id: 'drennar-sky-gloves',
        name: 'Windrider Gloves',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Gloves that allow brief control over wind currents.',
        iconId: 'inv_gauntlets_05',
        value: { platinum: 0, gold: 7, silver: 50, copper: 75 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['hands'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['drennar']
        }
    },

    {
        id: 'drennar-storm-boots',
        name: 'Thunderstep Boots',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Boots that allow brief levitation and reduce falling damage.',
        iconId: 'inv_boots_02',
        value: { platinum: 0, gold: 9, silver: 75, copper: 25 },
        weight: 1,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['drennar']
        }
    }
];

// Astren base items
export const ASTREN_BASE_ITEMS = [
    {
        id: 'astren-constellation-ring',
        name: 'Starweaver Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances magical abilities during nighttime.',
        iconId: 'inv_jewelry_ring_22',
        value: { platinum: 0, gold: 11, silver: 75, copper: 50 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            races: ['astren']
        }
    },

    {
        id: 'astren-moon-cloak',
        name: 'Lunar Mantle',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak that provides illumination in darkness and concealment under moonlight.',
        iconId: 'inv_misc_cape_14',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['astren']
        }
    }
];

// Grimheart base items
export const GRIMHEART_BASE_ITEMS = [
    {
        id: 'grimheart-stone-bracers',
        name: 'Stoneforged Bracers',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'common',
        description: 'Bracers reinforced with stone that provide protection and enhanced strength.',
        iconId: 'inv_bracer_04',
        value: { platinum: 0, gold: 7, silver: 50, copper: 75 },
        weight: 3,
        width: 1,
        height: 1,
        slots: ['wrists'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['grimheart']
        }
    },

    {
        id: 'grimheart-caver-belt',
        name: 'Deepdelver Belt',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'A sturdy belt with pouches for tools and enhanced carrying capacity.',
        iconId: 'inv_belt_02',
        value: { platinum: 0, gold: 5, silver: 85, copper: 25 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['grimheart']
        }
    }
];

// ===== SUBRACE ITEMS (1 extra per subrace) =====

// Vheil subrace items
export const VHEIL_SUBRACE_ITEMS = [
    {
        id: 'spirit-talker-charm',
        name: 'Spirit Echo Charm',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A charm that captures echoes of spirits and allows brief communion.',
        iconId: 'inv_jewelry_talisman_08',
        value: { platinum: 0, gold: 8, silver: 75, copper: 25 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['medium_vheil']
        }
    },
    {
        id: 'between-walker-veil',
        name: 'Veilwalker\'s Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak that allows brief phases through solid objects.',
        iconId: 'inv_misc_cape_16',
        value: { platinum: 0, gold: 9, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['walker_vheil']
        }
    }
];

// Mimir subrace items
export const MIMIR_SUBRACE_ITEMS = [
    {
        id: 'doppelganger-cloak',
        name: 'Shifting Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak that subtly shifts appearance to blend with surroundings.',
        iconId: 'inv_misc_cape_18',
        value: { platinum: 0, gold: 9, silver: 50, copper: 75 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['doppel_mimir']
        }
    },
    {
        id: 'broken-mind-lantern',
        name: 'Fractured Lantern',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A lantern that reveals hidden realities and illusions.',
        iconId: 'inv_misc_lantern_01',
        value: { platinum: 0, gold: 7, silver: 85, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['broken_mimir']
        }
    }
];

// Briaran subrace items
export const BRIARAN_SUBRACE_ITEMS = [
    {
        id: 'courtly-mirror',
        name: 'Courtly Mirror',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'An ornate hand mirror that enhances charisma and reveals hidden truths.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 8, silver: 75, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['courtly_briaran']
        }
    },
    {
        id: 'wild-thorn-armor',
        name: 'Wild Thorn Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Armor reinforced with living thorns that protect against natural threats.',
        iconId: 'inv_chest_leather_04',
        value: { platinum: 0, gold: 9, silver: 60, copper: 40 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['wild_briaran']
        }
    },
    {
        id: 'dusk-moon-blade',
        name: 'Dusk Moon Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A curved blade that glows faintly under moonlight.',
        iconId: 'inv_sword_39',
        value: { platinum: 0, gold: 10, silver: 85, copper: 25 },
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
                damageType: 'slashing'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['dusk_briaran']
        }
    }
];

// Groven subrace items
export const GROVEN_SUBRACE_ITEMS = [
    {
        id: 'guardian-earth-shield',
        name: 'Guardian Earth Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'uncommon',
        description: 'A heavy stone shield that provides exceptional protection.',
        iconId: 'inv_shield_06',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['offHand'],
        combatStats: {
            armorClass: { value: 3, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['guardian_groven']
        }
    },
    {
        id: 'wanderer-travel-boots',
        name: 'Wanderer\'s Earth Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Boots that provide stability and comfort during long journeys.',
        iconId: 'inv_boots_06',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['wanderer_groven']
        }
    },
    {
        id: 'shaman-spirit-staff',
        name: 'Spirit Stone Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff topped with a stone that channels earthen spirits.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 8, silver: 60, copper: 40 },
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
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['shaman_groven']
        }
    }
];

// Emberth subrace items
export const EMBERTH_SUBRACE_ITEMS = [
    {
        id: 'forgeborn-hammer',
        name: 'Forgeborn Hammer',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'A hammer forged in eternal flames that deals extra fire damage.',
        iconId: 'inv_hammer_05',
        value: { platinum: 0, gold: 10, silver: 75, copper: 25 },
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
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['forgeborn_emberth']
        }
    },
    {
        id: 'cinderborn-ash-cloak',
        name: 'Cinderborn Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak made of ash and embers that provides fire resistance.',
        iconId: 'inv_misc_cape_18',
        value: { platinum: 0, gold: 8, silver: 50, copper: 75 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['back'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['cinderborn_emberth']
        }
    },
    {
        id: 'warborn-flame-sword',
        name: 'Warborn Flame Sword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A sword wreathed in flames that burns enemies on hit.',
        iconId: 'inv_sword_48',
        value: { platinum: 0, gold: 12, silver: 50, copper: 75 },
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
            strength: { value: 1, isPercentage: false },
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['warborn_emberth']
        }
    }
];

// Vreken subrace items
export const VREKEN_SUBRACE_ITEMS = [
    {
        id: 'hunter-beast-claw',
        name: 'Beast Claw Gauntlets',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Gauntlets tipped with beast claws that enhance unarmed attacks.',
        iconId: 'inv_gauntlets_08',
        value: { platinum: 0, gold: 9, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['hunter_vreken']
        }
    },
    {
        id: 'penitent-cursed-ring',
        name: 'Penitent\'s Cursed Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances spiritual abilities but carries a curse.',
        iconId: 'inv_jewelry_ring_28',
        value: { platinum: 0, gold: 8, silver: 60, copper: 40 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['penitent_vreken']
        }
    }
];

// Morthel subrace items
export const MORTHEL_SUBRACE_ITEMS = [
    {
        id: 'vault-keeper-seal',
        name: 'Vault Keeper\'s Seal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A magical seal that enhances treasure detection and protection.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 9, silver: 50, copper: 75 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['hoarder_neth']
        }
    },
    {
        id: 'dust-scribe-quill',
        name: 'Dust Scribe\'s Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'An enchanted quill that never runs out of ink and preserves knowledge eternally.',
        iconId: 'inv_feather_12',
        value: { platinum: 0, gold: 7, silver: 85, copper: 25 },
        weight: 0.1,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['scholar_neth']
        }
    }
];

// Volketh subrace items
export const VOLKETH_SUBRACE_ITEMS = [
    {
        id: 'volketh-beast-tooth',
        name: 'Beastfang Necklace',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A necklace of beast teeth that grants limited beast communication.',
        iconId: 'inv_jewelry_necklace_11',
        value: { platinum: 0, gold: 7, silver: 50, copper: 25 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            charisma: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['thundercaller_volketh']
        }
    }
];

// Drennar subrace items
export const DRENNAR_SUBRACE_ITEMS = [
    {
        id: 'abyssal-pressure-armor',
        name: 'Abyssal Pressure Armor',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Heavy armor adapted for deep ocean pressures, providing exceptional protection underwater.',
        iconId: 'inv_chest_plate_10',
        value: { platinum: 0, gold: 15, silver: 25, copper: 50 },
        weight: 25,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 5, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['abyssal_drennar']
        }
    },
    {
        id: 'trench-current-boots',
        name: 'Trench Current Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Boots that allow swift movement through water currents and enhance swimming speed.',
        iconId: 'inv_boots_07',
        value: { platinum: 0, gold: 8, silver: 75, copper: 50 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            agility: { value: 2, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['trench_drennar']
        }
    },
    {
        id: 'twilight-glow-spear',
        name: 'Twilight Glow Spear',
        type: 'weapon',
        subtype: 'SPEAR',
        quality: 'uncommon',
        description: 'A spear that glows in deep darkness, illuminating underwater environments.',
        iconId: 'inv_spear_05',
        value: { platinum: 0, gold: 11, silver: 50, copper: 75 },
        weight: 3,
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
            spirit: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['twilight_drennar']
        }
    }
];

// Astren subrace items
export const ASTREN_SUBRACE_ITEMS = [
    {
        id: 'astren-moon-crystal',
        name: 'Mooncrystal Pendant',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A pendant that glows with lunar light and enhances night vision.',
        iconId: 'inv_jewelry_necklace_01',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['constellation_astren']
        }
    },
    {
        id: 'voidwalker-shadow-veil',
        name: 'Voidwalker\'s Shadow Veil',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A veil that bends light around the wearer, granting enhanced stealth in darkness.',
        iconId: 'inv_helmet_31',
        value: { platinum: 0, gold: 10, silver: 75, copper: 25 },
        weight: 1,
        width: 2,
        height: 1,
        slots: ['head'],
        baseStats: {
            agility: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['voidwalker_astren']
        }
    },
    {
        id: 'sunborn-radiant-crown',
        name: 'Sunborn Radiant Crown',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A crown that channels solar energy, enhancing charisma and providing light in darkness.',
        iconId: 'inv_crown_01',
        value: { platinum: 0, gold: 12, silver: 50, copper: 75 },
        weight: 1,
        width: 2,
        height: 1,
        slots: ['head'],
        baseStats: {
            charisma: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['sunborn_astren']
        }
    }
];

// Nordmark subrace items (1 extra per subrace)
export const NORDMARK_SUBRACE_ITEMS = [
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
        id: 'frostbound-ice-armor',
        name: 'Glacial Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Armor forged from enchanted ice that never melts, providing superior protection in cold environments.',
        iconId: 'inv_chest_plate_08',
        value: { platinum: 0, gold: 13, silver: 50, copper: 75 },
        weight: 20,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 4, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['icewalker_nordmark']
        }
    }
];

// ===== CORVANI =====
export const CORVANI_SUBRACE_ITEMS = [
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

// ===== GRIMHEART =====
export const GRIMHEART_SUBRACE_ITEMS = [
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
        id: 'warden-stone-shield',
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
    },

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
    }
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
    // Base race items (2 per race)
    ...HUMAN_BASE_ITEMS,
    ...NORDMARK_BASE_ITEMS,
    ...CORVANI_BASE_ITEMS,
    ...GRIMHEART_BASE_ITEMS,
    ...VHEIL_BASE_ITEMS,
    ...MIMIR_BASE_ITEMS,
    ...BRIARAN_BASE_ITEMS,
    ...GROVEN_BASE_ITEMS,
    ...EMBERTH_BASE_ITEMS,
    ...VREKEN_BASE_ITEMS,
    ...MORTHEL_BASE_ITEMS,
    ...VOLKETH_BASE_ITEMS,
    ...DRENNAR_BASE_ITEMS,
    ...ASTREN_BASE_ITEMS,

    // Subrace items (1 extra per subrace)
    ...NORDMARK_SUBRACE_ITEMS,
    ...CORVANI_SUBRACE_ITEMS,
    ...GRIMHEART_SUBRACE_ITEMS,
    ...VHEIL_SUBRACE_ITEMS,
    ...MIMIR_SUBRACE_ITEMS,
    ...BRIARAN_SUBRACE_ITEMS,
    ...GROVEN_SUBRACE_ITEMS,
    ...EMBERTH_SUBRACE_ITEMS,
    ...VREKEN_SUBRACE_ITEMS,
    ...MORTHEL_SUBRACE_ITEMS,
    ...VOLKETH_SUBRACE_ITEMS,
    ...DRENNAR_SUBRACE_ITEMS,
    ...ASTREN_SUBRACE_ITEMS,

    // Legacy items (keeping for compatibility)
    ...ELF_ITEMS,
    ...DWARF_ITEMS,
    ...HALFLING_ITEMS,
    ...ORC_ITEMS
];

