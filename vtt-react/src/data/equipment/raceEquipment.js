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

// Hrym base items
export const HRYM_BASE_ITEMS = [
    {
        id: 'hrym-frost-gloves',
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
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['hrym']
        }
    },

    {
        id: 'hrym-winter-boots',
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
            races: ['hrym']
        }
    }
];

// Myrathil base items
export const MYRATHIL_BASE_ITEMS = [
    {
        id: 'myrathil-kelp-weave',
        name: 'Kelp-Weave Body Wrap',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Living kelp-fiber fabric cultivated in submerged gardens. Tightens when wet and breathes when dry.',
        iconId: 'inv_chest_cloth_03',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 1,
        width: 2,
        height: 1,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['myrathil']
        }
    },

    {
        id: 'myrathil-tide-charm',
        name: 'Tide-Charm Necklace',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'common',
        description: 'Braided kelp-rope and sea-glass polished by the same shore that spawned its wearer. A Myrathil can always feel which direction the nearest coast lies while wearing their charm.',
        iconId: 'inv_jewelry_necklace_11',
        value: { platinum: 0, gold: 3, silver: 85, copper: 25 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['myrathil']
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
            armor: { value: 1, isPercentage: false }
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
            armor: { value: 1, isPercentage: false }
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
            armor: { value: 1, isPercentage: false }
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

// Ferrick base items
export const FERRICK_BASE_ITEMS = [
    {
        id: 'ferrick-scavenger-gloves',
        name: 'Scrap-Handed Gloves',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Reinforced leather gloves with metal tips for handling scrap safely.',
        iconId: 'inv_gauntlets_10',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            dexterity: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['ferrick']
        }
    },

    {
        id: 'ferrick-toolbelt',
        name: 'Tinker\'s Toolbelt',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'A belt covered in pouches and tools for any salvage situation.',
        iconId: 'inv_belt_05',
        value: { platinum: 0, gold: 4, silver: 75, copper: 50 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            races: ['ferrick']
        }
    }
];

// ===== SUBRACE ITEMS (1 extra per subrace) =====

// Hrym subrace items
export const HRYM_SUBRACE_ITEMS = [
    {
        id: 'bloodhammer-war-horn',
        name: 'Bloodhammer War Horn',
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
            subraces: ['bloodhammer_hrym']
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
            armor: { value: 4, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['frostbound_hrym']
        }
    },

    {
        id: 'runekeeper-rune-staff',
        name: 'Runekeeper\'s Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff inscribed with ancient runes that glow with mystical energy.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 10, silver: 85, copper: 50 },
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
            wisdom: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['runekeeper_hrym']
        }
    }
];

// Myrathil subrace items
export const MYRATHIL_SUBRACE_ITEMS = [
    {
        id: 'breakers-sea-glass-torc',
        name: 'Breakers\' Sea-Glass Torc',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A torc of woven salvage-silk set with sea-glass that shifts color with atmospheric pressure — a Breakers-Born trader\'s most trusted negotiation tool.',
        iconId: 'inv_jewelry_necklace_18',
        value: { platinum: 0, gold: 8, silver: 75, copper: 50 },
        weight: 0.3,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            charisma: { value: 2, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['breaker_myrathil']
        }
    },

    {
        id: 'deepborn-abyss-pearl',
        name: 'Deep-Born Abyss Pearl',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A pearl harvested from the deepest trench-gardens, cold to the touch even on land. Deep-Born mystics use it as a focus for the low hum — it resonates faintly when the abyss is listening.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['deep_myrathil']
        }
    },

    {
        id: 'riverfed-cartographer-kit',
        name: 'River-Fed Cartographer\'s Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A waterproofed leather case containing parchment, ink pressed from coastal minerals, and a compass that points toward the nearest river-mouth rather than north. Carried by every River-Fed who walks inland.',
        iconId: 'inv_misc_enggizmos_27',
        value: { platinum: 0, gold: 7, silver: 50, copper: 75 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['river_myrathil']
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
    },
    {
        id: 'silverblood-vial',
        name: 'Silverblood Vial',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'rare',
        description: 'A vial of crystallized mirror-blood harvested from a willing Glass-Eaten elder. Restores 2 max HP lost to Shard Exhalation and reduces 1 Fracture stack.',
        iconId: 'inv_potion_72',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        stackable: true,
        maxStack: 5,
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['glass_mimir']
        }
    },
    {
        id: 'salt-pouch-reinforced',
        name: 'Void-Sealed Salt Pouch',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A pouch of salt stitched into void-resistant leather. Grants advantage on saves against salt-based vulnerability triggers. The Hollow carry these as others carry holy symbols — protection from their own weakness.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 6, silver: 50, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['hollow_mimir']
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
            armor: { value: 2, isPercentage: false }
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
            armor: { value: 3, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['morgh_groven']
        }
    },
    {
        id: 'ithran-woven-boots',
        name: 'Span-Weaver Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Woven lichen-fiber boots that provide stability on bridge-spans and sheer stone surfaces.',
        iconId: 'inv_boots_06',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 3,
        width: 2,
        height: 1,
        slots: ['feet'],
        baseStats: {
            dexterity: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['ithran_groven']
        }
    },
    {
        id: 'ithran-bone-staff',
        name: 'Ancestor Bone Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff bound with the preserved bones of ancestors, used for bone-reading rituals and spirit communion.',
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
            subraces: ['ithran_groven']
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
            subraces: ['korr_emberth']
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
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['thrask_emberth']
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
            subraces: ['korr_emberth']
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
            armor: { value: 1, isPercentage: false }
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
    },
    {
        id: 'hollow-bone-plating',
        name: 'Erupting Bone Harness',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'A harness designed to accommodate and weaponize the Hollow-Vein\'s involuntary bone growths, channeling erupting bone plates into crude natural armor.',
        iconId: 'inv_chest_leather_10',
        value: { platinum: 0, gold: 10, silver: 50, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['hollow_vreken']
        }
    },
    {
        id: 'bloodgiven-copper-talisman',
        name: 'Copper Fang Talisman',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A talisman of annealed copper shaped into a fang, worn close to the throat. It amplifies the Blood-Given\'s siphoning curse at the cost of deepening the hunger.',
        iconId: 'inv_jewelry_necklace_18',
        value: { platinum: 0, gold: 11, silver: 25, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['neck'],
        combatStats: {
            mana: { value: 5, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['bloodgiven_vreken']
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
    },
    {
        id: 'wraith-shadow-cloak',
        name: 'Wraith\'s Shadow Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak that phases between material and shadow, granting partial incorporeality.',
        iconId: 'inv_misc_cape_20',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 1,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            dexterity: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['wraith_morthel']
        }
    }
];

// Astren subrace items
export const ASTREN_SUBRACE_ITEMS = [
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
    },
    {
        id: 'starmapped-star-chart',
        name: 'Constellation Star Chart',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A scroll that maps the ever-shifting constellations, revealing patterns of fate.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            wisdom: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['starmapped_astren']
        }
    }
];

// Ferrick subrace items
export const FERRICK_SUBRACE_ITEMS = [
    {
        id: 'scrapwright-toolkit',
        name: 'Scrapwright\'s Toolkit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A comprehensive toolkit for disassembling and rebuilding anything mechanical.',
        iconId: 'inv_misc_enggizmos_27',
        value: { platinum: 0, gold: 7, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['scrapwright_ferrick']
        }
    },
    {
        id: 'bonesmith-iron-knuckles',
        name: 'Bonesmith\'s Iron Knuckles',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'Metal-reinforced knuckle guards that make unarmed strikes devastating.',
        iconId: 'inv_gauntlets_08',
        value: { platinum: 0, gold: 8, silver: 50, copper: 75 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['hands'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['bonesmith_ferrick']
        }
    }
];

// Human subrace items
export const HUMAN_SUBRACE_ITEMS = [
    {
        id: 'imperial-commanders-signet',
        name: 'Commander\'s Signet',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A heavy iron signet bearing the crest of an Imperial command. Worn by officers who have earned their rank through blood and politics in equal measure.',
        iconId: 'inv_jewelry_ring_05',
        value: { platinum: 0, gold: 8, silver: 75, copper: 50 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['imperial_human']
        }
    },
    {
        id: 'hearthorn-calloused-gauntlets',
        name: 'Calloused Gauntlets',
        type: 'armor',
        subtype: 'HANDS',
        quality: 'common',
        description: 'Thick leather gloves stained with decades of honest labor. The leather has been replaced so many times that nothing of the original remains — but the calluses inside are irreplaceable.',
        iconId: 'inv_gauntlets_31',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 1.5,
        width: 1,
        height: 1,
        slots: ['hands'],
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['hearthorn_human']
        }
    },
    {
        id: 'paleborn-veilband',
        name: 'Ashring Veilband',
        type: 'accessory',
        subtype: 'HEAD',
        quality: 'uncommon',
        description: 'A thin band of crystallized ley-resonance worn across the eyes. It dulls the Pale-Born\'s overwhelming sight in dense magical areas — and dimly glows in the presence of enchantments.',
        iconId: 'inv_jewelry_necklace_11',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['head'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            subraces: ['paleborn_human']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_RACE_EQUIPMENT = [
    ...HUMAN_BASE_ITEMS,
    ...HRYM_BASE_ITEMS,
    ...MYRATHIL_BASE_ITEMS,
    ...MIMIR_BASE_ITEMS,
    ...BRIARAN_BASE_ITEMS,
    ...GROVEN_BASE_ITEMS,
    ...EMBERTH_BASE_ITEMS,
    ...VREKEN_BASE_ITEMS,
    ...MORTHEL_BASE_ITEMS,
    ...ASTREN_BASE_ITEMS,
    ...FERRICK_BASE_ITEMS,
    ...HRYM_SUBRACE_ITEMS,
    ...MYRATHIL_SUBRACE_ITEMS,
    ...MIMIR_SUBRACE_ITEMS,
    ...BRIARAN_SUBRACE_ITEMS,
    ...GROVEN_SUBRACE_ITEMS,
    ...EMBERTH_SUBRACE_ITEMS,
    ...VREKEN_SUBRACE_ITEMS,
    ...MORTHEL_SUBRACE_ITEMS,
    ...ASTREN_SUBRACE_ITEMS,
    ...FERRICK_SUBRACE_ITEMS,
    ...HUMAN_SUBRACE_ITEMS
];
