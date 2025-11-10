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
        description: 'Sacred incense used in religious ceremonies. Creates a calming aura when burned.',
        iconId: 'inv_misc_herb_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        combatStats: {
            carryingCapacity: { slots: 0 } // No carrying capacity effect
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false } // +1 Spirit when burned (represents calming effect)
        },
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
    },

    {
        id: 'criminal-lockpicks',
        name: 'Lockpicks (5)',
        type: 'consumable',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A set of five delicate lockpicks for opening locks. Each use has a chance to break.',
        iconId: 'inv_misc_key_03',
        value: { platinum: 0, gold: 2, silver: 5, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
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
    },

    {
        id: 'folk-hero-travel-rations',
        name: 'Travel Rations (3 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Simple preserved food suitable for travel and hard work. Restores vitality when consumed.',
        iconId: 'inv_misc_food_08',
        value: { platinum: 0, gold: 1, silver: 5, copper: 0 },
        weight: 6,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        combatStats: {
            healthRestore: { value: 10, isPercentage: false } // Restores 10 HP when consumed
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
    },

    {
        id: 'noble-perfume',
        name: 'Perfume (vial)',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'uncommon',
        description: 'A vial of expensive, elegant perfume worn by nobility. Enhances social presence when applied.',
        iconId: 'inv_potion_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 3,
        baseStats: {
            charisma: { value: 1, isPercentage: false } // +1 Charisma when applied
        },
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
    },

    {
        id: 'sage-extra-parchment',
        name: 'Extra Parchment (5 sheets)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Additional parchment sheets for research and note-taking. Can be used to create scrolls.',
        iconId: 'inv_misc_note_05',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
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
    },

    {
        id: 'soldier-military-rations',
        name: 'Military Rations (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Preserved military rations designed to last in harsh conditions. Sustains warriors when consumed.',
        iconId: 'inv_misc_food_08',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 10,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        combatStats: {
            healthRestore: { value: 15, isPercentage: false } // Restores 15 HP when consumed
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false } // +1 Constitution (represents the sustaining effect)
        },
        availableFor: {
            backgrounds: ['soldier']
        }
    }
];

// ===== MERCHANT =====
export const MERCHANT_ITEMS = [
    {
        id: 'merchant-scale',
        name: 'Merchant\'s Scale',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A precise balance scale used for weighing goods and measuring value.',
        iconId: 'inv_misc_scale_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['merchant']
        }
    },

    {
        id: 'merchant-sample-goods',
        name: 'Sample Goods',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A collection of small, valuable samples used to demonstrate merchandise to potential buyers.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['merchant']
        }
    },

    {
        id: 'merchant-ledger',
        name: 'Ledger',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A leather-bound book for recording transactions, debts, and business dealings.',
        iconId: 'inv_misc_book_04',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['merchant']
        }
    }
];

// ===== URCHIN =====
export const URCHIN_ITEMS = [
    {
        id: 'urchin-small-knife',
        name: 'Small Knife',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A small, sharp knife useful for cutting and self-defense on the streets.',
        iconId: 'inv_weapon_shortblade_01',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
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
        availableFor: {
            backgrounds: ['urchin']
        }
    },

    {
        id: 'urchin-city-map',
        name: 'Map of Home City',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A detailed map of your home city, showing hidden alleys, shortcuts, and safe hiding spots.',
        iconId: 'inv_misc_map_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['urchin']
        }
    },

    {
        id: 'urchin-pet-mouse',
        name: 'Pet Mouse',
        type: 'miscellaneous',
        subtype: 'PET',
        quality: 'common',
        description: 'A small mouse that has become your loyal companion from your street days.',
        iconId: 'inv_pet_mouse',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['urchin']
        }
    },

    {
        id: 'urchin-parents-token',
        name: 'Token of Parents',
        type: 'miscellaneous',
        subtype: 'SENTIMENTAL',
        quality: 'common',
        description: 'A small token or keepsake that reminds you of your lost parents.',
        iconId: 'inv_jewelry_ring_03',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['urchin']
        }
    }
];

// ===== SAILOR =====
export const SAILOR_ITEMS = [
    {
        id: 'sailor-belaying-pin',
        name: 'Belaying Pin',
        type: 'weapon',
        subtype: 'CLUB',
        quality: 'common',
        description: 'A stout wooden pin used to secure ropes on sailing ships. Can be used as an improvised weapon.',
        iconId: 'inv_misc_wrench_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 4,
                damageType: 'bludgeoning'
            }
        },
        availableFor: {
            backgrounds: ['sailor']
        }
    },

    {
        id: 'sailor-silk-rope',
        name: 'Silk Rope (50 feet)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A coil of fine silk rope, strong yet lightweight, perfect for climbing and sailing maneuvers.',
        iconId: 'inv_fabric_silk_03',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['sailor']
        }
    },

    {
        id: 'sailor-lucky-charm',
        name: 'Lucky Charm',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A small charm or trinket believed to bring good fortune at sea.',
        iconId: 'inv_jewelry_talisman_05',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 1, isPercentage: false } // +1 Spirit (represents luck/morale)
        },
        availableFor: {
            backgrounds: ['sailor']
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
    },

    {
        id: 'outlander-waterskin',
        name: 'Waterskin',
        type: 'consumable',
        subtype: 'LIQUID',
        quality: 'common',
        description: 'A leather waterskin for carrying water in the wilderness. Refreshes travelers when drunk.',
        iconId: 'inv_drink_04',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 3,
        combatStats: {
            healthRestore: { value: 5, isPercentage: false } // Restores 5 HP when drunk
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
    },

    {
        id: 'charlatan-costume-accessories',
        name: 'Disguise Accessories',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'Various small items for creating convincing disguises and false identities. Enhances deception when used.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        baseStats: {
            charisma: { value: 1, isPercentage: false } // +1 Charisma when used for disguises
        },
        availableFor: {
            backgrounds: ['charlatan']
        }
    }
];

// ===== ENTERTAINER =====
export const ENTERTAINER_ITEMS = [
    {
        id: 'entertainer-musical-instrument',
        name: 'Musical Instrument',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A musical instrument of your choice, used to entertain audiences and perform.',
        iconId: 'inv_misc_drum_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['entertainer']
        }
    },

    {
        id: 'entertainer-favor-admirer',
        name: 'Favor of Admirer',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A letter or token from an admirer that can be traded for favors in settlements.',
        iconId: 'inv_letter_15',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['entertainer']
        }
    },

    {
        id: 'entertainer-costume',
        name: 'Entertainer\'s Costume',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Colorful, flamboyant clothing designed for performances.',
        iconId: 'inv_chest_cloth_67',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['entertainer']
        }
    },

    {
        id: 'entertainer-theatrical-makeup',
        name: 'Theatrical Makeup',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'Colorful makeup and face paint for theatrical performances. Enhances presence when applied.',
        iconId: 'inv_misc_pocketwatch_01',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 3,
        baseStats: {
            charisma: { value: 1, isPercentage: false } // +1 Charisma when applied
        },
        availableFor: {
            backgrounds: ['entertainer']
        }
    }
];

// ===== HERMIT =====
export const HERMIT_ITEMS = [
    {
        id: 'hermit-herbalism-kit',
        name: 'Herbalism Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools for identifying and harvesting herbs, plants, and natural remedies.',
        iconId: 'inv_misc_herb_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hermit']
        }
    },

    {
        id: 'hermit-scroll-case',
        name: 'Scroll Case with Spiritual Writings',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A case containing scrolls of spiritual writings and meditations from your time in seclusion.',
        iconId: 'inv_misc_book_11',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hermit']
        }
    },

    {
        id: 'hermit-winter-blanket',
        name: 'Winter Blanket',
        type: 'miscellaneous',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'A thick, warm blanket suitable for cold weather and outdoor survival.',
        iconId: 'inv_misc_cape_18',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hermit']
        }
    },

    {
        id: 'hermit-trail-rations',
        name: 'Trail Rations (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Dried and preserved food suitable for long periods without fresh supplies. Sustains the solitary when consumed.',
        iconId: 'inv_misc_food_08',
        value: { platinum: 0, gold: 2, silver: 5, copper: 0 },
        weight: 10,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        combatStats: {
            healthRestore: { value: 8, isPercentage: false } // Restores 8 HP when consumed
        },
        baseStats: {
            wisdom: { value: 1, isPercentage: false } // +1 Wisdom (represents the solitary sustenance)
        },
        availableFor: {
            backgrounds: ['hermit']
        }
    }
];

// ===== SCHOLAR =====
export const SCHOLAR_ITEMS = [
    {
        id: 'scholar-bottle-ink',
        name: 'Bottle of Ink',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'A bottle of high-quality ink for writing and research.',
        iconId: 'inv_potion_70',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['scholar']
        }
    },

    {
        id: 'scholar-quill',
        name: 'Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A fine writing quill for precise scholarly work.',
        iconId: 'inv_inscription_tradeskill01',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['scholar']
        }
    },

    {
        id: 'scholar-parchment',
        name: 'Parchment (10 sheets)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Ten sheets of high-quality parchment for writing and research.',
        iconId: 'inv_misc_note_05',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            backgrounds: ['scholar']
        }
    },

    {
        id: 'scholar-academic-robes',
        name: 'Academic Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Formal robes worn by scholars and academics, with pockets for writing materials.',
        iconId: 'inv_chest_cloth_25',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['scholar']
        }
    },

    {
        id: 'scholar-research-notes',
        name: 'Research Notes',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A collection of your research notes and scholarly findings.',
        iconId: 'inv_misc_book_08',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['scholar']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_BACKGROUND_EQUIPMENT = [
    ...ACOLYTE_ITEMS,
    ...CRIMINAL_ITEMS,
    ...FOLK_HERO_ITEMS,
    ...MERCHANT_ITEMS,
    ...NOBLE_ITEMS,
    ...SAGE_ITEMS,
    ...SAILOR_ITEMS,
    ...SOLDIER_ITEMS,
    ...URCHIN_ITEMS,
    ...OUTLANDER_ITEMS,
    ...CHARLATAN_ITEMS,
    ...ENTERTAINER_ITEMS,
    ...HERMIT_ITEMS,
    ...SCHOLAR_ITEMS,

    // Currency pouches for backgrounds that include gold amounts
    {
        id: 'acolyte-currency-pouch',
        name: 'Temple Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A blessed temple pouch containing 15 gold pieces. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['acolyte']
        }
    },

    {
        id: 'criminal-currency-pouch',
        name: 'Ill-gotten Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 15 gold pieces from past criminal exploits. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['criminal']
        }
    },

    {
        id: 'folk-hero-currency-pouch',
        name: 'Humble Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A simple pouch containing 10 gold pieces from humble savings. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['folkHero']
        }
    },

    {
        id: 'sage-currency-pouch',
        name: 'Scholarly Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 10 gold pieces from scholarly earnings. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['sage']
        }
    },

    {
        id: 'soldier-currency-pouch',
        name: 'Military Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 10 gold pieces from military pay and savings. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['soldier']
        }
    },

    {
        id: 'sailor-currency-pouch',
        name: 'Seafarer Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A weathered pouch containing 10 gold pieces from seafaring adventures. Can be sold for its full value.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['sailor']
        }
    }

];

