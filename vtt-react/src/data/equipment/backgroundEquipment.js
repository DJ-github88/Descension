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
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Blacksmithing/blacksmith-hammer-tool',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Lockpicking/lockpick-set-tools',
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
        iconId: 'Misc/Profession Resources/Lockpicking/lockpick-set-tools',
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
        iconId: 'Misc/Profession Resources/Engineering/engineering-toolbox',
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
        iconId: 'Weapons/Shovel/shovel-basic-wooden-handle-iron-blade',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Cooking/food-rations-preserved',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
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
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
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
        iconId: 'Misc/Books/book-scroll-pinned-text-thumbtack',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Books/book-scroll-unrolled-textured-markings',
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
        iconId: 'Armor/Neck/neck-simple-pendant',
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
        iconId: 'Misc/Profession Resources/Entertainment/playing-cards-deck',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Cooking/food-rations-preserved',
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
        iconId: 'Misc/Profession Resources/Merchant/merchant-scale-balance',
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
        iconId: 'Container/Pouch/brown-tied-pouch',
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
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
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
        iconId: 'Weapons/Throwing Knife/throwing-knife-basic',
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
        iconId: 'Misc/Books/book-treasure-map-island',
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
        iconId: 'Misc/Monster Parts/creature-small-mouse',
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
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
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
        iconId: 'Misc/Profession Resources/Blacksmithing/blacksmith-hammer-tool',
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
        iconId: 'Misc/Profession Resources/Tailoring/silk-fabric-roll',
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
        iconId: 'Armor/Neck/neck-simple-pendant',
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
        iconId: 'Misc/Profession Resources/Trapping/hunting-trap-metal',
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
        iconId: 'Misc/Monster Parts/pelt-bear-fur',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Cooking/waterskin-leather',
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
        iconId: 'Misc/Profession Resources/Entertainment/dice-weighted',
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
        iconId: 'Container/Bag/brown-satchel-buckle-strap',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Instruments/Drum/drum-hand-basic',
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
        iconId: 'Misc/Books/book-folded-letter-envelope',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Profession Resources/Cosmetics/makeup-paint-kit',
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
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
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
        iconId: 'Misc/Books/book-scroll-case-spiritual',
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
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
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
        iconId: 'Misc/Profession Resources/Cooking/food-rations-preserved',
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
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
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
        iconId: 'Misc/Profession Resources/Inscription/quill-pen-feather',
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
        iconId: 'Misc/Books/book-scroll-unrolled-textured-markings',
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
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
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
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
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

    // ===== CUSTOM BACKGROUND ITEMS =====

    // MYSTIC ITEMS
    {
        id: 'mystic-crystal-focus',
        name: 'Crystal Focus',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A polished crystal used to focus arcane energies and aid in mystical rituals.',
        iconId: 'Misc/Profession Resources/Enchanting/crystal-focus-arcane',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['mystic']
        }
    },

    {
        id: 'mystic-tome-mysteries',
        name: 'Tome of Mysteries',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'An ancient tome containing mystical knowledge and arcane secrets.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['mystic']
        }
    },

    {
        id: 'mystic-incense-candles',
        name: 'Incense and Candles',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Sacred incense and candles used in mystical rituals and meditation.',
        iconId: 'Misc/Profession Resources/Religious/candle-wax-lit',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            backgrounds: ['mystic']
        }
    },

    {
        id: 'mystic-ritual-pouch',
        name: 'Ritual Components Pouch',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing various mystical components for rituals and spellcasting.',
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
            backgrounds: ['mystic']
        }
    },

    {
        id: 'mystic-travelers-robes',
        name: 'Traveler\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Comfortable robes designed for long journeys, with pockets for mystical components.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['mystic']
        }
    },

    // ZEALOT ITEMS
    {
        id: 'zealot-holy-symbol',
        name: 'Holy Symbol',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A sacred symbol representing your divine faith and devotion.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['zealot']
        }
    },

    {
        id: 'zealot-prayer-beads',
        name: 'Prayer Beads',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A string of beads used to count prayers and maintain focus during devotion.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['zealot']
        }
    },

    {
        id: 'zealot-ceremonial-weapon',
        name: 'Ceremonial Weapon',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A beautifully crafted ceremonial weapon, more symbolic than practical.',
        iconId: 'Weapons/Mace/mace-basic-ceremonial',
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
                damageType: 'bludgeoning'
            }
        },
        availableFor: {
            backgrounds: ['zealot']
        }
    },

    {
        id: 'zealot-religious-vestments',
        name: 'Religious Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Formal religious clothing worn during ceremonies and worship.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['zealot']
        }
    },

    // TRICKSTER ITEMS
    {
        id: 'trickster-thieves-tools',
        name: 'Thieves\' Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A set of lockpicks and tools for bypassing locks and traps.',
        iconId: 'Misc/Profession Resources/Blacksmithing/blacksmith-hammer-tool',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['trickster']
        }
    },

    {
        id: 'trickster-disguise-kit',
        name: 'Disguise Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Cosmetics and accessories for creating disguises and altering appearance.',
        iconId: 'Container/Bag/brown-satchel-messenger',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['trickster']
        }
    },

    {
        id: 'trickster-fine-clothes',
        name: 'Set of Fine Clothes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Elegant clothing suitable for social occasions and deception.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['trickster']
        }
    },

    {
        id: 'trickster-fake-signet-ring',
        name: 'Signet Ring (Fake)',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A convincing fake signet ring for impersonating nobility or officials.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['trickster']
        }
    },

    {
        id: 'trickster-marked-cards',
        name: 'Deck of Marked Cards',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A deck of playing cards with subtle markings for cheating at games.',
        iconId: 'Misc/Profession Resources/Entertainment/playing-cards-deck',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['trickster']
        }
    },

    // HARROW ITEMS
    {
        id: 'harrow-memento-loss',
        name: 'Memento of Loss',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A personal item that reminds you of someone or something you lost.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['harrow']
        }
    },

    {
        id: 'harrow-weathered-cloak',
        name: 'Weathered Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A durable cloak that has seen better days but provides good protection from the elements.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 3,
        armorSlot: 'BACK',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['harrow']
        }
    },

    {
        id: 'harrow-survival-gear',
        name: 'Survival Gear',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Basic gear for surviving in the wilderness, including a knife and tinderbox.',
        iconId: 'Container/Bag/brown-backpack-simple',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['harrow']
        }
    },

    {
        id: 'harrow-herbalism-kit',
        name: 'Herbalism Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools for identifying and collecting herbs, useful for survival and healing.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['harrow']
        }
    },

    {
        id: 'harrow-worn-clothes',
        name: 'Common Clothes (Worn)',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Simple, well-worn clothing suitable for everyday wear.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['harrow']
        }
    },

    // ARCANIST ITEMS
    {
        id: 'arcanist-spellbook',
        name: 'Spellbook',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A leather-bound book containing arcane spells and magical knowledge.',
        iconId: 'Misc/Books/book-open-teal-swirl-cream-pages',
        value: { platinum: 0, gold: 50, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['arcanist']
        }
    },

    {
        id: 'arcanist-component-pouch',
        name: 'Component Pouch',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A pouch containing various spell components for casting spells.',
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
            backgrounds: ['arcanist']
        }
    },

    {
        id: 'arcanist-ink-quill',
        name: 'Ink and Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Writing implements for transcribing spells and magical research.',
        iconId: 'Misc/Profession Resources/Inscription/quill-pen-feather',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['arcanist']
        }
    },

    {
        id: 'arcanist-scholarly-robes',
        name: 'Scholarly Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Comfortable robes designed for study and magical research.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['arcanist']
        }
    },

    {
        id: 'arcanist-reading-glasses',
        name: 'Reading Glasses',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'Specialized glasses for reading ancient texts and spellbooks.',
        iconId: 'Armor/Head/head-reading-glasses',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['arcanist']
        }
    },

    // HEXER ITEMS
    {
        id: 'hexer-cursed-trinket',
        name: 'Cursed Trinket',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'uncommon',
        description: 'A mysterious trinket imbued with dark magical energies.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['hexer']
        }
    },

    {
        id: 'hexer-ritual-dagger',
        name: 'Ritual Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A ceremonial dagger used in dark rituals and hexes.',
        iconId: 'Weapons/Throwing Knife/throwing-knife-ritual',
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
                damageType: 'piercing'
            }
        },
        availableFor: {
            backgrounds: ['hexer']
        }
    },

    {
        id: 'hexer-dark-tome',
        name: 'Dark Tome',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A forbidden book containing knowledge of curses and dark magic.',
        iconId: 'Misc/Books/book-fiery-demonic-face-cover',
        value: { platinum: 0, gold: 30, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['hexer']
        }
    },

    {
        id: 'hexer-hooded-cloak',
        name: 'Hooded Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A dark cloak with a hood, perfect for concealing identity and dark dealings.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 3,
        armorSlot: 'BACK',
        armorStats: {
            armorClass: 10
        },
        availableFor: {
            backgrounds: ['hexer']
        }
    },

    {
        id: 'hexer-strange-liquid',
        name: 'Vial of Strange Liquid',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A mysterious potion with unknown properties, possibly magical in nature.',
        iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            backgrounds: ['hexer']
        }
    },

    // REAVER ITEMS
    {
        id: 'reaver-battle-worn-weapon',
        name: 'Battle-worn Weapon',
        type: 'weapon',
        subtype: 'GREATSWORD',
        quality: 'common',
        description: 'A heavily used weapon that has seen many battles and bears the scars to prove it.',
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
                damageType: 'slashing'
            }
        },
        availableFor: {
            backgrounds: ['reaver']
        }
    },

    {
        id: 'reaver-trophy',
        name: 'Trophy from Defeated Foe',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A grisly trophy taken from a defeated enemy, a reminder of past victories.',
        iconId: 'Misc/Monster Parts/bone-trophy-skull',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['reaver']
        }
    },

    {
        id: 'reaver-studded-leather',
        name: 'Studded Leather Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Reinforced leather armor with metal studs for added protection.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 45, silver: 0, copper: 0 },
        weight: 13,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 12
        },
        availableFor: {
            backgrounds: ['reaver']
        }
    },

    {
        id: 'reaver-whetstone',
        name: 'Whetstone',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A stone used for sharpening weapons and maintaining their deadly edge.',
        iconId: 'Misc/Profession Resources/Blacksmithing/whetstone-sharpening',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['reaver']
        }
    },

    // MERCENARY ITEMS
    {
        id: 'mercenary-military-insignia',
        name: 'Military Insignia',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'A badge or insignia showing your service in mercenary companies.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['mercenary']
        }
    },

    {
        id: 'mercenary-service-contract',
        name: 'Contract of Service',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Official documents proving your mercenary status and completed contracts.',
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['mercenary']
        }
    },

    {
        id: 'mercenary-gaming-set',
        name: 'Gaming Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Dice or cards used for gambling, a common pastime among mercenaries.',
        iconId: 'Misc/Profession Resources/Entertainment/dice-standard',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['mercenary']
        }
    },

    {
        id: 'mercenary-maintenance-kit',
        name: 'Weapon Maintenance Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Tools and supplies for maintaining and repairing weapons and armor.',
        iconId: 'Misc/Profession Resources/Blacksmithing/blacksmith-hammer-tool',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['mercenary']
        }
    },

    // SENTINEL ITEMS
    {
        id: 'sentinel-guardian-badge',
        name: 'Guardian\'s Badge',
        type: 'miscellaneous',
        subtype: 'ACCESSORY',
        quality: 'common',
        description: 'An official badge signifying your status as a guardian or sentinel.',
        iconId: 'Armor/Neck/neck-simple-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['sentinel']
        }
    },

    {
        id: 'sentinel-signal-horn',
        name: 'Signal Horn',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A horn used to signal allies, raise alarms, or coordinate defensive actions.',
        iconId: 'Instruments/Horn/horn-signal-brass',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['sentinel']
        }
    },

    {
        id: 'sentinel-chain-mail',
        name: 'Chain Mail',
        type: 'armor',
        subtype: 'MAIL',
        quality: 'common',
        description: 'Flexible metal armor made of interlocking chains, providing good protection.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 75, silver: 0, copper: 0 },
        weight: 55,
        width: 2,
        height: 3,
        armorSlot: 'CHEST',
        armorStats: {
            armorClass: 16
        },
        availableFor: {
            backgrounds: ['sentinel']
        }
    },

    {
        id: 'sentinel-rope',
        name: 'Rope (50 feet)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A sturdy hemp rope, 50 feet long, useful for climbing, securing, or rescue operations.',
        iconId: 'Misc/Profession Resources/Camping/rope-hempen-50ft',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 10,
        width: 1,
        height: 3,
        availableFor: {
            backgrounds: ['sentinel']
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
            backgrounds: ['acolyte']
        }
    },

    // Custom background currency pouches
    {
        id: 'mystic-currency-pouch',
        name: 'Mystic Pouch with 20g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A mystical pouch containing 20 gold pieces from arcane dealings. Can be sold for its full value.',
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
            backgrounds: ['mystic']
        }
    },

    {
        id: 'zealot-currency-pouch',
        name: 'Zealot Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A blessed pouch containing 15 gold pieces from religious offerings. Can be sold for its full value.',
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
            backgrounds: ['zealot']
        }
    },

    {
        id: 'trickster-currency-pouch',
        name: 'Trickster Pouch with 25g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A cunningly concealed pouch containing 25 gold pieces from various schemes. Can be sold for its full value.',
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
            backgrounds: ['trickster']
        }
    },

    {
        id: 'harrow-currency-pouch',
        name: 'Harrow Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A worn pouch containing 10 gold pieces from hard-earned survival. Can be sold for its full value.',
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
            backgrounds: ['harrow']
        }
    },

    {
        id: 'arcanist-currency-pouch',
        name: 'Arcanist Pouch with 30g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A scholarly pouch containing 30 gold pieces from magical research and teaching. Can be sold for its full value.',
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
            backgrounds: ['arcanist']
        }
    },

    {
        id: 'hexer-currency-pouch',
        name: 'Hexer Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A mysterious pouch containing 15 gold pieces from dark dealings. Can be sold for its full value.',
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
            backgrounds: ['hexer']
        }
    },

    {
        id: 'reaver-currency-pouch',
        name: 'Reaver Pouch with 20g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A battle-scarred pouch containing 20 gold pieces from mercenary work. Can be sold for its full value.',
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
            backgrounds: ['reaver']
        }
    },

    {
        id: 'mercenary-currency-pouch',
        name: 'Mercenary Pouch with 25g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A well-used pouch containing 25 gold pieces from mercenary contracts. Can be sold for its full value.',
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
            backgrounds: ['mercenary']
        }
    },

    {
        id: 'sentinel-currency-pouch',
        name: 'Sentinel Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A sturdy pouch containing 15 gold pieces from guardian duties. Can be sold for its full value.',
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
            backgrounds: ['sentinel']
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
            backgrounds: ['sailor']
        }
    }

];

