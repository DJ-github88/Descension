/**
 * Background-Specific Starting Equipment
 * 
 * Items that are only available to specific character backgrounds.
 */

// ===== ACOLYTE =====
export const ACOLYTE_ITEMS = [
    {
        id: 'acolyte-prayer-book',
        name: 'Acolyte\'s Prayer Book',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A well-worn prayer book from your time in the temple.',
        iconId: 'inv_misc_book_02',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['acolyte']
        }
    },
    
    {
        id: 'acolyte-incense',
        name: 'Incense Sticks (10)',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Sacred incense used in religious ceremonies.',
        iconId: 'inv_misc_herb_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['acolyte']
        }
    },
    
    {
        id: 'acolyte-vestments',
        name: 'Acolyte Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Simple religious robes marking you as an acolyte.',
        iconId: 'inv_chest_cloth_03',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['acolyte']
        }
    }
];

// ===== CRIMINAL =====
export const CRIMINAL_ITEMS = [
    {
        id: 'criminal-crowbar',
        name: 'Crowbar',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A sturdy crowbar. Useful for breaking and entering.',
        iconId: 'inv_misc_wrench_01',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['criminal']
        }
    },
    
    {
        id: 'criminal-dark-cloak',
        name: 'Dark Common Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Dark, nondescript clothing perfect for blending into shadows.',
        iconId: 'inv_chest_cloth_25',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
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
            backgrounds: ['criminal']
        }
    },
    
    {
        id: 'criminal-thieves-tools',
        name: 'Thieves\' Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A complete set of tools for picking locks and disabling traps.',
        iconId: 'inv_misc_key_04',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['criminal']
        }
    }
];

// ===== FOLK HERO =====
export const FOLK_HERO_ITEMS = [
    {
        id: 'folk-hero-artisan-tools',
        name: 'Artisan\'s Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools from your trade before you became a hero.',
        iconId: 'inv_misc_enggizmos_20',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 5,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['folkHero']
        }
    },

    {
        id: 'folk-hero-shovel',
        name: 'Shovel',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A simple shovel. Reminds you of your humble origins.',
        iconId: 'inv_misc_shovel_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['folkHero']
        }
    },
    
    {
        id: 'folk-hero-common-clothes',
        name: 'Common Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Simple, practical clothing of the common folk.',
        iconId: 'inv_shirt_07',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['folkHero']
        }
    }
];

// ===== NOBLE =====
export const NOBLE_ITEMS = [
    {
        id: 'noble-signet-ring',
        name: 'Signet Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring bearing your family crest. Proof of your noble lineage.',
        iconId: 'inv_jewelry_ring_14',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['noble']
        }
    },
    
    {
        id: 'noble-fine-clothes',
        name: 'Fine Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Expensive, well-tailored clothing befitting nobility.',
        iconId: 'inv_chest_cloth_45',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['noble']
        }
    },
    
    {
        id: 'noble-scroll-of-pedigree',
        name: 'Scroll of Pedigree',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A scroll documenting your noble lineage.',
        iconId: 'inv_scroll_06',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['noble']
        }
    }
];

// ===== SAGE =====
export const SAGE_ITEMS = [
    {
        id: 'sage-research-journal',
        name: 'Research Journal',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A journal filled with your research notes and observations.',
        iconId: 'inv_misc_book_08',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['sage']
        }
    },

    {
        id: 'sage-ink-and-quill',
        name: 'Ink and Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A bottle of ink and a quill for writing.',
        iconId: 'inv_misc_note_01',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['sage']
        }
    },
    
    {
        id: 'sage-scholars-robes',
        name: 'Scholar\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Comfortable robes worn by scholars and researchers.',
        iconId: 'inv_chest_cloth_07',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['sage']
        }
    }
];

// ===== SOLDIER =====
export const SOLDIER_ITEMS = [
    {
        id: 'soldier-military-insignia',
        name: 'Military Insignia',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'An insignia from your military unit.',
        iconId: 'inv_jewelry_talisman_06',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['soldier']
        }
    },
    
    {
        id: 'soldier-playing-cards',
        name: 'Playing Card Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A deck of cards for passing time in camp.',
        iconId: 'inv_misc_ticket_tarot_02',
        value: { platinum: 0, gold: 0, silver: 50, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['soldier']
        }
    },
    
    {
        id: 'soldier-uniform',
        name: 'Military Uniform',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Your old military uniform. Still fits.',
        iconId: 'inv_chest_cloth_12',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['soldier']
        }
    }
];

// ===== OUTLANDER =====
export const OUTLANDER_ITEMS = [
    {
        id: 'outlander-hunting-trap',
        name: 'Hunting Trap',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A steel trap for catching game.',
        iconId: 'inv_misc_enggizmos_27',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 25,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['outlander']
        }
    },

    {
        id: 'outlander-animal-trophy',
        name: 'Animal Trophy',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A trophy from an animal you hunted in the wilds.',
        iconId: 'inv_misc_pelt_bear_03',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        tradeCategory: 'trophies',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            backgrounds: ['outlander']
        }
    },
    
    {
        id: 'outlander-travelers-clothes',
        name: 'Traveler\'s Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Rugged clothing designed for wilderness travel.',
        iconId: 'inv_chest_leather_03',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['outlander']
        }
    }
];

// ===== CHARLATAN =====
export const CHARLATAN_ITEMS = [
    {
        id: 'charlatan-weighted-dice',
        name: 'Weighted Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Dice that are subtly weighted to favor certain outcomes.',
        iconId: 'inv_misc_dice_02',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['charlatan']
        }
    },

    {
        id: 'charlatan-forgery-kit',
        name: 'Forgery Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Tools for creating convincing forgeries of documents and seals.',
        iconId: 'inv_misc_bag_13',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['charlatan']
        }
    },
    
    {
        id: 'charlatan-fine-clothes',
        name: 'Charlatan\'s Fine Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Flashy clothes designed to impress and deceive.',
        iconId: 'inv_chest_cloth_23',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['charlatan']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_BACKGROUND_EQUIPMENT = [
    ...ACOLYTE_ITEMS,
    ...CRIMINAL_ITEMS,
    ...FOLK_HERO_ITEMS,
    ...NOBLE_ITEMS,
    ...SAGE_ITEMS,
    ...SOLDIER_ITEMS,
    ...OUTLANDER_ITEMS,
    ...CHARLATAN_ITEMS
];

