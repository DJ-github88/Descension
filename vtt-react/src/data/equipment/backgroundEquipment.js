/**
 * Background-Specific Starting Equipment
 * 
 * Items that are only available to specific character backgrounds.
 */

// ===== EMBERSPIRE PILGRIM =====
export const EMBERSPIRE_PILGRIM_ITEMS = [
    {
        id: 'acolyte-prayer-book',
        name: 'Acolyte\'s Prayer Book',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A well-worn prayer book from your time in the temple.',
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['emberspirePilgrim']
        }
    },
    
    {
        id: 'acolyte-incense',
        name: 'Incense Sticks (10)',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Sacred incense used in religious ceremonies. Creates a calming aura when burned.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
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
            backgrounds: ['emberspirePilgrim']
        }
    },
    
    {
        id: 'acolyte-vestments',
        name: 'Acolyte Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Simple religious robes marking you as an acolyte.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['emberspirePilgrim']
        }
    }
];

// ===== SHYR RUNNER =====
export const SHYR_RUNNER_ITEMS = [
    {
        id: 'criminal-crowbar',
        name: 'Crowbar',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A sturdy crowbar. Useful for breaking and entering.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['shyrRunner']
        }
    },
    
    {
        id: 'criminal-dark-cloak',
        name: 'Dark Common Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Dark, nondescript clothing perfect for blending into shadows.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['shyrRunner']
        }
    },
    
    {
        id: 'criminal-thieves-tools',
        name: 'Thieves\' Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A complete set of tools for picking locks and disabling traps.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['shyrRunner']
        }
    },

    {
        id: 'criminal-lockpicks',
        name: 'Lockpicks (5)',
        type: 'consumable',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A set of five delicate lockpicks for opening locks. Each use has a chance to break.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 2, silver: 5, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['shyrRunner']
        }
    }
];

// ===== LEDGER KEEPER =====
export const LEDGER_KEEPER_ITEMS = [
    {
        id: 'folk-hero-artisan-tools',
        name: 'Artisan\'s Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools from your trade before you became a hero.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 5,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['ledgerKeeper']
        }
    },

    {
        id: 'folk-hero-shovel',
        name: 'Shovel',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A simple shovel. Reminds you of your humble origins.',
        iconId: 'Misc/Profession Resources/Tools/shovel',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['ledgerKeeper']
        }
    },
    
    {
        id: 'folk-hero-common-clothes',
        name: 'Common Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Simple, practical clothing of the common folk.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['ledgerKeeper']
        }
    },

    {
        id: 'folk-hero-travel-rations',
        name: 'Travel Rations (3 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Simple preserved food suitable for travel and hard work. Restores vitality when consumed.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            backgrounds: ['ledgerKeeper']
        }
    }
];

// ===== BLOODLINE HEIR =====
export const BLOODLINE_HEIR_ITEMS = [
    {
        id: 'noble-signet-ring',
        name: 'Signet Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring bearing your family crest. Proof of your noble lineage.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['bloodlineHeir']
        }
    },
    
    {
        id: 'noble-fine-clothes',
        name: 'Fine Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Expensive, well-tailored clothing befitting nobility.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['bloodlineHeir']
        }
    },
    
    {
        id: 'noble-scroll-of-pedigree',
        name: 'Scroll of Pedigree',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A scroll documenting your noble lineage.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['bloodlineHeir']
        }
    },

    {
        id: 'noble-perfume',
        name: 'Perfume (vial)',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'uncommon',
        description: 'A vial of expensive, elegant perfume worn by nobility. Enhances social presence when applied.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
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
            backgrounds: ['bloodlineHeir']
        }
    }
];

// ===== SYNOD ACADEMIC =====
export const SYNOD_ACADEMIC_ITEMS = [
    {
        id: 'sage-research-journal',
        name: 'Research Journal',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A journal filled with your research notes and observations.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['synodAcademic']
        }
    },

    {
        id: 'sage-ink-and-quill',
        name: 'Ink and Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A bottle of ink and a quill for writing.',
        iconId: 'Misc/Books/book-scroll-pinned-text-thumbtack',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['synodAcademic']
        }
    },
    
    {
        id: 'sage-scholars-robes',
        name: 'Scholar\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Comfortable robes worn by scholars and researchers.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['synodAcademic']
        }
    },

    {
        id: 'sage-extra-parchment',
        name: 'Extra Parchment (5 sheets)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Additional parchment sheets for research and note-taking. Can be used to create scrolls.',
        iconId: 'Misc/Books/book-scroll-unrolled-textured-markings',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            backgrounds: ['synodAcademic']
        }
    }
];

// ===== SUMPS VETERAN =====
export const SUMPS_VETERAN_ITEMS = [
    {
        id: 'soldier-military-insignia',
        name: 'Military Insignia',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'An insignia from your military unit.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['sumpsVeteran']
        }
    },
    
    {
        id: 'soldier-playing-cards',
        name: 'Playing Card Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A deck of cards for passing time in camp.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 0, silver: 50, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['sumpsVeteran']
        }
    },
    
    {
        id: 'soldier-uniform',
        name: 'Military Uniform',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Your old military uniform. Still fits.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['sumpsVeteran']
        }
    },

    {
        id: 'soldier-military-rations',
        name: 'Military Rations (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Preserved military rations designed to last in harsh conditions. Sustains warriors when consumed.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            backgrounds: ['sumpsVeteran']
        }
    }
];

// ===== GLOOMWAY TRADER =====
export const GLOOMWAY_TRADER_ITEMS = [
    {
        id: 'merchant-scale',
        name: 'Merchant\'s Scale',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A precise balance scale used for weighing goods and measuring value.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['gloomwayTrader']
        }
    },

    {
        id: 'merchant-sample-goods',
        name: 'Sample Goods',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A collection of small, valuable samples used to demonstrate merchandise to potential buyers.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['gloomwayTrader']
        }
    },

    {
        id: 'merchant-ledger',
        name: 'Ledger',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A leather-bound book for recording transactions, debts, and business dealings.',
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['gloomwayTrader']
        }
    }
];

// ===== SHANTY RAT =====
export const SHANTY_RAT_ITEMS = [
    {
        id: 'urchin-small-knife',
        name: 'Small Knife',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A small, sharp knife useful for cutting and self-defense on the streets.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
                damageType: 'physical'
            }
        },
        availableFor: {
            backgrounds: ['shantyRat']
        }
    },

    {
        id: 'urchin-city-map',
        name: 'Map of Home City',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A detailed map of your home city, showing hidden alleys, shortcuts, and safe hiding spots.',
        iconId: 'Misc/Books/book-treasure-map-island',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['shantyRat']
        }
    },

    {
        id: 'urchin-pet-mouse',
        name: 'Pet Mouse',
        type: 'miscellaneous',
        subtype: 'PET',
        quality: 'common',
        description: 'A small mouse that has become your loyal companion from your street days.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['shantyRat']
        }
    },

    {
        id: 'urchin-parents-token',
        name: 'Token of Parents',
        type: 'miscellaneous',
        subtype: 'SENTIMENTAL',
        quality: 'common',
        description: 'A small token or keepsake that reminds you of your lost parents.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['shantyRat']
        }
    }
];

// ===== MERROW SAILOR =====
export const MERROW_SAILOR_ITEMS = [
    {
        id: 'sailor-belaying-pin',
        name: 'Belaying Pin',
        type: 'weapon',
        subtype: 'CLUB',
        quality: 'common',
        description: 'A stout wooden pin used to secure ropes on sailing ships. Can be used as an improvised weapon.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
                damageType: 'physical'
            }
        },
        availableFor: {
            backgrounds: ['merrowSailor']
        }
    },

    {
        id: 'sailor-silk-rope',
        name: 'Silk Rope (50 feet)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A coil of fine silk rope, strong yet lightweight, perfect for climbing and sailing maneuvers.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['merrowSailor']
        }
    },

    {
        id: 'sailor-lucky-charm',
        name: 'Lucky Charm',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A small charm or trinket believed to bring good fortune at sea.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 1, isPercentage: false } // +1 Spirit (represents luck/morale)
        },
        availableFor: {
            backgrounds: ['merrowSailor']
        }
    }
];

// ===== PEAK TRACKER =====
export const PEAK_TRACKER_ITEMS = [
    {
        id: 'outlander-hunting-trap',
        name: 'Hunting Trap',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A steel trap for catching game.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 25,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['peakTracker']
        }
    },

    {
        id: 'outlander-animal-trophy',
        name: 'Animal Trophy',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A trophy from an animal you hunted in the wilds.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            backgrounds: ['peakTracker']
        }
    },
    
    {
        id: 'outlander-travelers-clothes',
        name: 'Traveler\'s Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Rugged clothing designed for wilderness travel.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['peakTracker']
        }
    },

    {
        id: 'outlander-waterskin',
        name: 'Waterskin',
        type: 'consumable',
        subtype: 'LIQUID',
        quality: 'common',
        description: 'A leather waterskin for carrying water in the wilderness. Refreshes travelers when drunk.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            backgrounds: ['peakTracker']
        }
    }
];

// ===== DEBT NEGOTIATOR =====
export const DEBT_NEGOTIATOR_ITEMS = [
    {
        id: 'charlatan-weighted-dice',
        name: 'Weighted Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Dice that are subtly weighted to favor certain outcomes.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['debtNegotiator']
        }
    },

    {
        id: 'charlatan-forgery-kit',
        name: 'Forgery Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Tools for creating convincing forgeries of documents and seals.',
        iconId: 'Container/Bag/brown-satchel-buckle-strap',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['debtNegotiator']
        }
    },
    
    {
        id: 'charlatan-fine-clothes',
        name: 'Charlatan\'s Fine Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Flashy clothes designed to impress and deceive.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['debtNegotiator']
        }
    },

    {
        id: 'charlatan-costume-accessories',
        name: 'Disguise Accessories',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'Various small items for creating convincing disguises and false identities. Enhances deception when used.',
        iconId: 'Container/Bag/brown-satchel-messenger',
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
            backgrounds: ['debtNegotiator']
        }
    }
];

// ===== FROST CHANTER =====
export const FROST_CHANTER_ITEMS = [
    {
        id: 'entertainer-musical-instrument',
        name: 'Musical Instrument',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A musical instrument of your choice, used to entertain audiences and perform.',
        iconId: 'Instruments/Drum/drum-brown-band',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['frostChanter']
        }
    },

    {
        id: 'entertainer-favor-admirer',
        name: 'Favor of Admirer',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A letter or token from an admirer that can be traded for favors in settlements.',
        iconId: 'Misc/Books/book-folded-letter-envelope',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['frostChanter']
        }
    },

    {
        id: 'entertainer-costume',
        name: 'Entertainer\'s Costume',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Colorful, flamboyant clothing designed for performances.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['frostChanter']
        }
    },

    {
        id: 'entertainer-theatrical-makeup',
        name: 'Theatrical Makeup',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'Colorful makeup and face paint for theatrical performances. Enhances presence when applied.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            backgrounds: ['frostChanter']
        }
    }
];

// ===== HUSH SURVIVOR =====
export const HUSH_SURVIVOR_ITEMS = [
    {
        id: 'hermit-herbalism-kit',
        name: 'Herbalism Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools for identifying and harvesting herbs, plants, and natural remedies.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hushSurvivor']
        }
    },

    {
        id: 'hermit-scroll-case',
        name: 'Scroll Case with Spiritual Writings',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A case containing scrolls of spiritual writings and meditations from your time in seclusion.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hushSurvivor']
        }
    },

    {
        id: 'hermit-winter-blanket',
        name: 'Winter Blanket',
        type: 'miscellaneous',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'A thick, warm blanket suitable for cold weather and outdoor survival.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['hushSurvivor']
        }
    },

    {
        id: 'hermit-trail-rations',
        name: 'Trail Rations (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Dried and preserved food suitable for long periods without fresh supplies. Sustains the solitary when consumed.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
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
            spirit: { value: 1, isPercentage: false } // +1 Spirit (represents the solitary sustenance)
        },
        availableFor: {
            backgrounds: ['hushSurvivor']
        }
    }
];

// ===== MONOLITH HUNTER =====
export const MONOLITH_HUNTER_ITEMS = [
    {
        id: 'scholar-bottle-ink',
        name: 'Bottle of Ink',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'A bottle of high-quality ink for writing and research.',
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    },

    {
        id: 'scholar-quill',
        name: 'Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A fine writing quill for precise scholarly work.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    },

    {
        id: 'scholar-parchment',
        name: 'Parchment (10 sheets)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Ten sheets of high-quality parchment for writing and research.',
        iconId: 'Misc/Books/book-scroll-unrolled-textured-markings',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    },

    {
        id: 'scholar-academic-robes',
        name: 'Academic Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Formal robes worn by scholars and academics, with pockets for writing materials.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    },

    {
        id: 'scholar-research-notes',
        name: 'Research Notes',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A collection of your research notes and scholarly findings.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_BACKGROUND_EQUIPMENT = [
    ...EMBERSPIRE_PILGRIM_ITEMS,
    ...SHYR_RUNNER_ITEMS,
    ...LEDGER_KEEPER_ITEMS,
    ...GLOOMWAY_TRADER_ITEMS,
    ...BLOODLINE_HEIR_ITEMS,
    ...SYNOD_ACADEMIC_ITEMS,
    ...MERROW_SAILOR_ITEMS,
    ...SUMPS_VETERAN_ITEMS,
    ...SHANTY_RAT_ITEMS,
    ...PEAK_TRACKER_ITEMS,
    ...DEBT_NEGOTIATOR_ITEMS,
    ...FROST_CHANTER_ITEMS,
    ...HUSH_SURVIVOR_ITEMS,
    ...MONOLITH_HUNTER_ITEMS,

    // ===== CUSTOM BACKGROUND ITEMS =====

    // VESSEL ITEMS
    {
        id: 'mystic-crystal-focus',
        name: 'Stelequarts Lens',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A ground and polished Stelequarts crystal that refracts starlight into focused resonance patterns, used to commune with your Astril constellation-spirit.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    {
        id: 'mystic-tome-mysteries',
        name: 'Astril Concordance',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A star-chart tome mapping the celestial resonances between your dual consciousness and your Astril constellation-spirit.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    {
        id: 'mystic-incense-candles',
        name: 'Throat-Singing Cords',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Resonant fiber cords tuned to harmonic frequencies, used in throat-singing meditations to align with your constellation-spirit.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    {
        id: 'mystic-ritual-pouch',
        name: 'Star-Glow Component Pouch',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A lined pouch for holding crystal shards and resonance components used in celestial communion.',
        iconId: 'Container/Pouch/beige-tied-pouch',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 2, cols: 2 },
            items: []
        },
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    {
        id: 'mystic-travelers-robes',
        name: 'Crystal-Pattern Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Soft robes woven with subtle Stelequarts thread, the crystal-skin patterns shimmering faintly with stored starlight.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    // BOUND ITEMS
    {
        id: 'zealot-holy-symbol',
        name: 'Keeper\'s Clause-Scroll',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A tightly wound scroll bearing your sworn Keeper\'s oath, sealed with bog-iron ink.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['bound']
        }
    },

    {
        id: 'zealot-prayer-beads',
        name: 'Memory-Glass Beads',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A strand of small memory-glass beads, each one holding a fragment of a sworn oath or Neth contract term.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['bound']
        }
    },

    {
        id: 'zealot-ceremonial-weapon',
        name: 'Contract-Sealed Mace',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A bog-iron mace engraved with Neth contract-clauses, its surface sealed with Keeper\'s devotional marks.',
        iconId: 'Weapons/Mace/mace-wooden-club-brown-primitive',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'physical'
            }
        },
        availableFor: {
            backgrounds: ['bound']
        }
    },

    {
        id: 'zealot-religious-vestments',
        name: 'Contract-Sealed Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Formal vestments inscribed with Neth contract-seals and Keeper oaths in bog-iron ink.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['bound']
        }
    },

    // UNSEEN ITEMS
    {
        id: 'trickster-thieves-tools',
        name: 'Veil-Bypass Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Precision tools favored by Drun outcasts for bypassing locks and wards undetected.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    {
        id: 'trickster-disguise-kit',
        name: 'Mimir Shifting Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A kit of memory-crystal pigments and sculpting compounds used by Mimir shape-shifters to alter appearance.',
        iconId: 'Container/Bag/brown-satchel-messenger',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    {
        id: 'trickster-fine-clothes',
        name: 'Unlit Courtier\'s Garb',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Elegant, nondescript clothing woven with Unlit veil-fibers, designed to blur the wearer\'s outline.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    {
        id: 'trickster-fake-signet-ring',
        name: 'False Signet Ring',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A finely crafted false signet ring, used by Unlit agents to impersonate officials across the Veil.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    {
        id: 'trickster-marked-cards',
        name: 'Drun Cipher-Tiles',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A set of gaming tiles with Drun outcast cipher-marks, readable only by those trained in Unlit patterns.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    // SCARRED ITEMS
    {
        id: 'harrow-memento-loss',
        name: 'Vat-Glass Shard',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A jagged shard of vat-glass carried as a reminder of the breaking. Its edges still hold a faint resonance.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['scarred']
        }
    },

    {
        id: 'harrow-weathered-cloak',
        name: 'Wind-Leather Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A cloak of weathered wind-leather, scarred by Wyrd-storms but still offering solid protection.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 3,
        armorSlot: 'BACK',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['scarred']
        }
    },

    {
        id: 'harrow-survival-gear',
        name: 'Wyrd-Survivor\'s Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Essential survival gear assembled by a Wyrd-survivor: a blade, tinderbox, and dried rations in a vat-glass-lined pouch.',
        iconId: 'Container/Bag/brown-backpack-simple',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['scarred']
        }
    },

    {
        id: 'harrow-herbalism-kit',
        name: 'Scar-Tissue Salve Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A kit of salves and unguents made from Wyrd-scar tissue extractions, useful for treating Over-Sung ailments.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['scarred']
        }
    },

    {
        id: 'harrow-worn-clothes',
        name: 'Vat-Breaker\'s Wraps',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Well-worn wraps and layers typical of Vat-Breakers, patched with scavenged vat-glass fiber.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['scarred']
        }
    },

    // ARCHIVE_SWORN ITEMS
    {
        id: 'arcanist-spellbook',
        name: 'Canopy-Ledger',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A thick Canopy-Ledger bound in preservative wax, its pages inscribed with Frozen Archive catalog entries.',
        iconId: 'Misc/Books/book-open-teal-swirl-cream-pages',
        value: { platinum: 0, gold: 50, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    {
        id: 'arcanist-component-pouch',
        name: 'Memory-Glass Tablet Pouch',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A padded pouch for carrying inscribed memory-glass tablets used in Archive research and cataloging.',
        iconId: 'Container/Pouch/beige-tied-pouch',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 2, cols: 2 },
            items: []
        },
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    {
        id: 'arcanist-ink-quill',
        name: 'Canopy-Quill and Bog-Iron Ink',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A canopy-quill and pot of archival bog-iron ink, standard-issue for Frozen Archive scribes.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    {
        id: 'arcanist-scholarly-robes',
        name: 'Archive-Sworn Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Preservative-waxed robes marked with Frozen Archive sigils, fitted with pockets for memory-glass tablets.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    {
        id: 'arcanist-reading-glasses',
        name: 'Archive-Access Lenses',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'Ground memory-glass lenses that reveal hidden Archive catalog-marks and inscribed references.',
        iconId: 'Armor/Head/head-brown-tan-banded-helmet',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    // INDEBTED ITEMS
    {
        id: 'hexer-cursed-trinket',
        name: 'Keth-Amar Cursed Trinket',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'uncommon',
        description: 'A trinket bound with Keth-Amar dark-bargain resonance, still pulsing with the creditor\'s claim.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['indebted']
        }
    },

    {
        id: 'hexer-ritual-dagger',
        name: 'Scathrach Ritual Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A ceremonial dagger etched with Scathrach bargain-glyphs, used to seal dark deals in bog-iron ink.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
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
                damageType: 'physical'
            }
        },
        availableFor: {
            backgrounds: ['indebted']
        }
    },

    {
        id: 'hexer-dark-tome',
        name: 'Creditor\'s Ledger',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A ledger of outstanding debts and dark bargains, its pages written in bog-iron ink that shifts when read.',
        iconId: 'Misc/Books/book-fiery-demonic-face-cover',
        value: { platinum: 0, gold: 30, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['indebted']
        }
    },

    {
        id: 'hexer-hooded-cloak',
        name: 'Bargain-Sealed Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A hooded cloak stitched with Keth-Amar contract-seals, its fabric darkened by repeated exposure to bargain-rituals.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 3,
        armorSlot: 'BACK',
        armorStats: {
            armor: 10
        },
        availableFor: {
            backgrounds: ['indebted']
        }
    },

    {
        id: 'hexer-strange-liquid',
        name: 'Vial of Scathrach Bog-Iron Ink',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A vial of Scathrach-refined bog-iron ink, used to inscribe new bargains or alter existing debts.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['indebted']
        }
    },

    // FROSTBORN ITEMS
    {
        id: 'reaver-battle-worn-weapon',
        name: 'Glacier-Tempered Greatsword',
        type: 'weapon',
        subtype: 'GREATSWORD',
        quality: 'common',
        description: 'A greatsword tempered in glacier ice by Bloodhammer smiths, its blade bearing frost-crack patterns from the process.',
        iconId: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt-simple',
        value: { platinum: 0, gold: 50, silver: 0, copper: 0 },
        weight: 6,
        width: 1,
        height: 4,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 2,
                diceType: 6,
                damageType: 'physical'
            }
        },
        availableFor: {
            backgrounds: ['frostborn']
        }
    },

    {
        id: 'reaver-trophy',
        name: 'Nordhalla Trophy',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A trophy taken from a worthy foe, displayed in the Skald tradition of Nordhalla.',
        iconId: 'Misc/Monster Parts/Skull',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['frostborn']
        }
    },

    {
        id: 'reaver-studded-leather',
        name: 'Heavy Wind-Leather Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Heavy wind-leather armor reinforced with frost-cracked rivets, standard Bloodhammer battle-wear.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 45, silver: 0, copper: 0 },
        weight: 13,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 12
        },
        availableFor: {
            backgrounds: ['frostborn']
        }
    },

    {
        id: 'reaver-whetstone',
        name: 'Frost-Cracked Whetstone',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A frost-cracked whetstone from Nordhalla peaks, ideal for maintaining glacier-tempered edges.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['frostborn']
        }
    },

    // WAYFARER ITEMS
    {
        id: 'mercenary-military-insignia',
        name: 'Toll-Token of Service',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A carved toll-token proving completed service along the Ancestor-Span toll-ways.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['wayfarer']
        }
    },

    {
        id: 'mercenary-service-contract',
        name: 'Throat-Sung Cord-Record',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A fiber-cord record of completed contracts, encoded in throat-sung knot-patterns readable by Ordan nomads.',
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['wayfarer']
        }
    },

    {
        id: 'mercenary-gaming-set',
        name: 'Waystation Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Bone dice carved with Ancestor-Span waymarks, used for wagering at waystations along the toll-roads.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['wayfarer']
        }
    },

    {
        id: 'mercenary-maintenance-kit',
        name: 'Wayfarer\'s Maintenance Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A compact kit of Ordan-made tools for maintaining weapons and gear on the Ancestor-Span roads.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['wayfarer']
        }
    },

    // THRESHOLD_WATCHER ITEMS
    {
        id: 'sentinel-guardian-badge',
        name: 'Muren Guardian\'s Badge',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A badge of Spellguard authority forged in Muren, marking you as a threshold guardian.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['threshold_watcher']
        }
    },

    {
        id: 'sentinel-signal-horn',
        name: 'Muren Signal Horn',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A fortress-grade signal horn used by Muren Spellguard to coordinate threshold defenses.',
        iconId: 'Instruments/Horn/horn-curved-segmented',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['threshold_watcher']
        }
    },

    {
        id: 'sentinel-chain-mail',
        name: 'Fexric-Reforged Chain',
        type: 'armor',
        subtype: 'MAIL',
        quality: 'common',
        description: 'Chain mail reforged with Fexric steel by Muren armorers, interlocking links providing Spellguard-standard protection.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 75, silver: 0, copper: 0 },
        weight: 55,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armor: 16
        },
        availableFor: {
            backgrounds: ['threshold_watcher']
        }
    },

    {
        id: 'sentinel-rope',
        name: 'Fiber-Cord Rope (50 feet)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: '50 feet of braided fiber-cord rope, standard issue for Muren Spellguard patrol and rescue operations.',
        iconId: 'Misc/Books/book-brown-teal-question-mark',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 10,
        width: 1,
        height: 3,
        availableFor: {
            backgrounds: ['threshold_watcher']
        }
    },

    // Currency pouches for backgrounds that include gold amounts
    {
        id: 'acolyte-currency-pouch',
        name: 'Temple Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A blessed temple pouch containing 15 gold pieces. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['emberspirePilgrim']
        }
    },

    // Custom background currency pouches
    {
        id: 'mystic-currency-pouch',
        name: 'Vessel Pouch with 20g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A star-glow-lined pouch containing 20 gold pieces from celestial dealings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['vessel']
        }
    },

    {
        id: 'zealot-currency-pouch',
        name: 'Bound Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A contract-sealed pouch containing 15 gold pieces from Keeper offerings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['bound']
        }
    },

    {
        id: 'trickster-currency-pouch',
        name: 'Unlit Pouch with 25g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A cunningly concealed pouch containing 25 gold pieces from Unlit schemes. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['unseen']
        }
    },

    {
        id: 'harrow-currency-pouch',
        name: 'Scarred Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A vat-glass-reinforced pouch containing 10 gold pieces from hard-earned survival. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['scarred']
        }
    },

    {
        id: 'arcanist-currency-pouch',
        name: 'Archive Pouch with 30g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A wax-sealed pouch containing 30 gold pieces from Frozen Archive stipends. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 30, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['archive_sworn']
        }
    },

    {
        id: 'hexer-currency-pouch',
        name: 'Indebted Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A bargain-sealed pouch containing 15 gold pieces from dark dealings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['indebted']
        }
    },

    {
        id: 'reaver-currency-pouch',
        name: 'Frostborn Pouch with 20g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A frost-cracked pouch containing 20 gold pieces from Bloodhammer work. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['frostborn']
        }
    },

    {
        id: 'mercenary-currency-pouch',
        name: 'Wayfarer Pouch with 25g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A cord-bound pouch containing 25 gold pieces from Ancestor-Span toll-work. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 1, cols: 1 },
            items: []
        },
        availableFor: {
            backgrounds: ['wayfarer']
        }
    },

    {
        id: 'sentinel-currency-pouch',
        name: 'Threshold Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A Muren-stamped pouch containing 15 gold pieces from Spellguard duties. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['threshold_watcher']
        }
    },

    {
        id: 'criminal-currency-pouch',
        name: 'Ill-gotten Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 15 gold pieces from past criminal exploits. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['shyrRunner']
        }
    },

    {
        id: 'folk-hero-currency-pouch',
        name: 'Humble Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A simple pouch containing 10 gold pieces from humble savings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['ledgerKeeper']
        }
    },

    {
        id: 'sage-currency-pouch',
        name: 'Scholarly Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 10 gold pieces from scholarly earnings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['synodAcademic']
        }
    },

    {
        id: 'soldier-currency-pouch',
        name: 'Military Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing 10 gold pieces from military pay and savings. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['sumpsVeteran']
        }
    },

    {
        id: 'sailor-currency-pouch',
        name: 'Seafarer Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A weathered pouch containing 10 gold pieces from seafaring adventures. Can be sold for its full value.',
        iconId: 'Container/Pouch/brown-tied-pouch',
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
            backgrounds: ['merrowSailor']
        }
    }

];

