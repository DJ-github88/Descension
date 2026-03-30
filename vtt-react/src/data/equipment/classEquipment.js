/**
 * Class-Specific Starting Equipment
 * 
 * Items that are only available to specific character classes.
 * Organized by the 9 paths and their 3 classes each (27 total classes).
 */

// ===== INFERNAL PATH CLASSES =====

// Pyrofiend - Demonic fire wielder
export const PYROFIEND_ITEMS = [
    {
        id: 'pyrofiend-flame-staff',
        name: 'Smoldering Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A charred wooden staff that emanates heat. The tip glows faintly with ember-like light.',
        iconId: 'inv_staff_15',
        value: { platinum: 0, gold: 11, silver: 75, copper: 50 },
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
                damageType: 'fire'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Pyrofiend']
        }
    },
    
    {
        id: 'pyrofiend-infernal-tome',
        name: 'Infernal Grimoire',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A leather-bound tome with pages that feel warm to the touch. Contains basic fire incantations.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 7, silver: 60, copper: 75 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Pyrofiend']
        }
    },
    
    {
        id: 'pyrofiend-ash-robes',
        name: 'Ash-Stained Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Dark robes marked with ash and soot. Provides minimal protection but allows free movement.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 5, silver: 75, copper: 50 },
        weight: 4,
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
            classes: ['Pyrofiend']
        }
    },

    {
        id: 'pyrofiend-ember-dagger',
        name: 'Ember Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A dagger with a blade that glows like hot coals.',
        iconId: 'inv_weapon_shortblade_25',
        value: { platinum: 0, gold: 6, silver: 65, copper: 40 },
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
                damageType: 'fire'
            }
        },
        availableFor: {
            classes: ['Pyrofiend']
        }
    },

    {
        id: 'pyrofiend-sulfur-pouch',
        name: 'Sulfur Pouch',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A pouch containing sulfur and other combustible materials.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 2, silver: 80, copper: 50 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Pyrofiend']
        }
    },

    {
        id: 'pyrofiend-flame-amulet',
        name: 'Flame Amulet',
        type: 'accessory',
        subtype: 'AMULET',
        quality: 'uncommon',
        description: 'An amulet containing a perpetual flame, warm to the touch.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Pyrofiend']
        }
    }
];

// Minstrel - Musical spellcaster
export const MINSTREL_ITEMS = [
    {
        id: 'minstrel-lute',
        name: 'Traveler\'s Lute',
        type: 'weapon',
        subtype: 'INSTRUMENT',
        quality: 'uncommon',
        description: 'A well-crafted lute that can be used as both a musical instrument and a spellcasting focus.',
        iconId: 'inv_misc_drum_01',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
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
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Minstrel']
        }
    },
    
    {
        id: 'minstrel-songbook',
        name: 'Book of Ballads',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A collection of songs, ballads, and musical notation for spellcasting.',
        iconId: 'inv_misc_book_11',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Minstrel']
        }
    },
    
    {
        id: 'minstrel-performers-outfit',
        name: 'Performer\'s Outfit',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Colorful and eye-catching clothing designed to draw attention during performances.',
        iconId: 'inv_shirt_16',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
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
            classes: ['Minstrel']
        }
    },

    {
        id: 'minstrel-silver-rapier',
        name: 'Silver Rapier',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'An elegant rapier with a silver-plated blade, perfect for a performer.',
        iconId: 'inv_sword_39',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
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
            charisma: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Minstrel']
        }
    },

    {
        id: 'minstrel-tuning-fork',
        name: 'Enchanted Tuning Fork',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A tuning fork that resonates with magical frequencies.',
        iconId: 'inv_misc_fork_01',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Minstrel']
        }
    }
];

// Chronarch - Time manipulator
export const CHRONARCH_ITEMS = [
    {
        id: 'chronarch-temporal-staff',
        name: 'Temporal Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A crystalline staff that seems to shimmer and phase slightly out of sync with reality.',
        iconId: 'inv_staff_30',
        value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
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
                damageType: 'arcane'
            }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Chronarch']
        }
    },
    
    {
        id: 'chronarch-hourglass-pendant',
        name: 'Hourglass Pendant',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A small hourglass pendant that never seems to run out of sand.',
        iconId: 'inv_jewelry_necklace_03',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Chronarch']
        }
    },
    {
        id: 'chronarch-time-crystal',
        name: 'Time Crystal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystal that pulses with temporal energy, storing moments in time.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Chronarch']
        }
    },
    {
        id: 'chronarch-temporal-robes',
        name: 'Temporal Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes that seem to phase in and out of existence, never quite fully present.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Chronarch']
        }
    },
    {
        id: 'chronarch-pocket-watch',
        name: 'Pocket Watch of Chronos',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'An ornate pocket watch that can stop time for brief moments.',
        iconId: 'inv_misc_pocketwatch_01',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Chronarch']
        }
    }
];

// Chaos Weaver - Reality bender
export const CHAOS_WEAVER_ITEMS = [
    {
        id: 'chaos-weaver-entropy-wand',
        name: 'Wand of Entropy',
        type: 'weapon',
        subtype: 'WAND',
        quality: 'uncommon',
        description: 'A twisted wand that seems to change shape slightly when not being observed directly.',
        iconId: 'inv_wand_07',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'chaos'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Chaos Weaver']
        }
    },
    
    {
        id: 'chaos-weaver-probability-dice',
        name: 'Chaos Dice Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A set of dice that seem to land on different numbers each time you look at them.',
        iconId: 'inv_misc_dice_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Chaos Weaver']
        }
    },
    {
        id: 'chaos-weaver-shifting-robes',
        name: 'Shifting Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes that constantly shift colors and patterns, never appearing the same twice.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Chaos Weaver']
        }
    },
    {
        id: 'chaos-weaver-entropy-orb',
        name: 'Orb of Entropy',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A swirling orb of chaotic energy that pulses with unpredictable power.',
        iconId: 'inv_misc_orb_05',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Chaos Weaver']
        }
    },
    {
        id: 'chaos-weaver-reality-anchor',
        name: 'Reality Anchor',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A small device that helps stabilize chaotic magic effects.',
        iconId: 'inv_misc_enggizmos_19',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Chaos Weaver']
        }
    }
];

// Gambler - Fate manipulator
export const GAMBLER_ITEMS = [
    {
        id: 'gambler-lucky-coin',
        name: 'Lucky Coin',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A golden coin that always seems to land on the side you need.',
        iconId: 'inv_misc_coin_01',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Gambler']
        }
    },
    
    {
        id: 'gambler-card-deck',
        name: 'Fate Deck',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A deck of cards imbued with fate magic. Each card represents a different possibility.',
        iconId: 'inv_misc_ticket_tarot_01',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Gambler']
        }
    },
    
    {
        id: 'gambler-rapier',
        name: 'Duelist\'s Rapier',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A slender blade favored by gamblers and duelists.',
        iconId: 'inv_sword_39',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
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
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Gambler']
        }
    },
    {
        id: 'gambler-vest',
        name: 'Gambler\'s Vest',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A stylish vest with hidden pockets perfect for storing cards and coins.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Gambler']
        }
    },
    {
        id: 'gambler-loaded-dice',
        name: 'Loaded Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Dice weighted to favor certain outcomes, for when luck needs a push.',
        iconId: 'inv_misc_dice_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Gambler']
        }
    }
];

// Fate Weaver - Destiny manipulator using cards and threads
export const FATE_WEAVER_ITEMS = [
    {
        id: 'fate-weaver-thread-staff',
        name: 'Thread-Bound Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff wrapped in shimmering threads of destiny. The threads pulse with cosmic energy.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
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
                damageType: 'psychic'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-destiny-blade',
        name: 'Destiny Blade',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A blade that seems to cut through the threads of fate itself.',
        iconId: 'inv_weapon_shortblade_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
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
                damageType: 'psychic'
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-robes',
        name: 'Weaver\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Flowing robes woven with threads that shimmer with the colors of destiny.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-deck',
        name: 'Deck of Fate',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A mystical deck of cards that reveals and manipulates the threads of destiny.',
        iconId: 'inv_misc_ticket_tarot_01',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-thread-spool',
        name: 'Thread Spool',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A spool of golden thread that represents the threads of destiny you can weave.',
        iconId: 'inv_misc_spool_01',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-thread-trinket',
        name: 'Thread of Destiny',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A single golden thread that pulses with cosmic energy, representing your connection to fate.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Fate Weaver']
        }
    },
    {
        id: 'fate-weaver-fate-pendant',
        name: 'Fate Pendant',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A pendant shaped like a card, imbued with the power to glimpse future possibilities.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Fate Weaver']
        }
    }
];

// Combine all Infernal Path items
export const INFERNAL_PATH_ITEMS = [
    ...PYROFIEND_ITEMS,
    ...MINSTREL_ITEMS,
    ...CHRONARCH_ITEMS,
    ...CHAOS_WEAVER_ITEMS,
    ...FATE_WEAVER_ITEMS,
    ...GAMBLER_ITEMS
];

// ===== ZEALOT PATH CLASSES =====

// Martyr - Sacrifice-based holy warrior
export const MARTYR_ITEMS = [
    {
        id: 'martyr-sacred-mace',
        name: 'Sacred Mace',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'A blessed mace that glows faintly with divine light. Bears the symbol of sacrifice.',
        iconId: 'inv_mace_03',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 2,
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
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Martyr']
        }
    },

    {
        id: 'martyr-holy-symbol',
        name: 'Martyr\'s Holy Symbol',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A holy symbol depicting a figure in sacrifice. Radiates divine energy.',
        iconId: 'inv_jewelry_talisman_07',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Martyr']
        }
    },

    {
        id: 'martyr-sacrificial-blade',
        name: 'Sacrificial Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A curved blade etched with runes of sacrifice. Draws blood to fuel divine power.',
        iconId: 'inv_sword_04',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'radiant'
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        combatStats: {
            spellDamage: {
                radiant: { value: 15, isPercentage: true }
            }
        },
        availableFor: {
            classes: ['Martyr']
        }
    },

    {
        id: 'martyr-scarred-plate',
        name: 'Scarred Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Heavy plate armor covered in self-inflicted scars from years of ritual sacrifice.',
        iconId: 'inv_chest_plate_05',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 45,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 6, isPercentage: false },
            resistances: {
                necrotic: { value: 10, isPercentage: false }
            }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Martyr']
        }
    },

    {
        id: 'martyr-tome-suffering',
        name: 'Tome of Suffering',
        type: 'tool',
        subtype: 'BOOK',
        quality: 'rare',
        description: 'A leather-bound tome containing prayers of suffering and sacrifice. Grants insights into pain.',
        iconId: 'inv_misc_book_02',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['tool1', 'tool2'],
        combatStats: {
            carryingCapacity: { slots: 2 }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Martyr']
        }
    }
];

// Exorcist - Holy warrior banishing evil spirits
export const EXORCIST_ITEMS = [
    {
        id: 'exorcist-holy-symbol',
        name: 'Exorcist\'s Holy Symbol',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A blessed holy symbol that glows with divine light when near evil spirits.',
        iconId: 'inv_jewelry_talisman_07',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Exorcist']
        }
    },
    {
        id: 'exorcist-banishment-staff',
        name: 'Banishment Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff engraved with banishment runes, pulsing with holy energy.',
        iconId: 'inv_staff_18',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
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
                damageType: 'radiant'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Exorcist']
        }
    },
    {
        id: 'exorcist-holy-water',
        name: 'Vial of Holy Water',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Blessed water that burns evil creatures and purifies corruption.',
        iconId: 'inv_flask_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            classes: ['Exorcist']
        }
    },
    {
        id: 'exorcist-purification-robe',
        name: 'Purification Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'White robes embroidered with protective symbols against evil spirits.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Exorcist']
        }
    },
    {
        id: 'exorcist-warding-rings',
        name: 'Warding Rings',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'Silver rings engraved with protective runes that glow near evil.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Exorcist']
        }
    }
];

// Oracle - Seer with prophetic visions
export const ORACLE_ITEMS = [
    {
        id: 'oracle-divination-staff',
        name: 'Oracle\'s Divination Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff topped with a crystal sphere that reflects glimpses of the future.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
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
                damageType: 'psychic'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Oracle']
        }
    },
    {
        id: 'oracle-scrying-orb',
        name: 'Scrying Orb',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystal orb that swirls with visions of what is to come.',
        iconId: 'inv_misc_orb_05',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Oracle']
        }
    },
    {
        id: 'oracle-prophetic-robe',
        name: 'Prophetic Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Flowing robes covered in symbols and patterns that shift to reveal glimpses of the future.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Oracle']
        }
    },
    {
        id: 'oracle-tarot-deck',
        name: 'Oracle\'s Tarot Deck',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A deck of divination cards that reveal hidden truths and future possibilities.',
        iconId: 'inv_misc_ticket_tarot_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Oracle']
        }
    },
    {
        id: 'oracle-fate-necklace',
        name: 'Necklace of Fate',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A necklace with crystal beads that pulse with prophetic energy.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Oracle']
        }
    }
];

// False Prophet - Deception-based divine caster
export const FALSE_PROPHET_ITEMS = [
    {
        id: 'false-prophet-staff',
        name: 'Charlatan\'s Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'An ornate staff that appears more valuable than it actually is. Perfect for deception.',
        iconId: 'inv_staff_20',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
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
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['False Prophet']
        }
    },

    {
        id: 'false-prophet-fake-relic',
        name: 'Counterfeit Relic',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A convincing fake of a holy relic. Useful for gaining trust.',
        iconId: 'inv_jewelry_talisman_12',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['False Prophet']
        }
    },
    {
        id: 'false-prophet-deception-robe',
        name: 'Deception Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes that appear holy but are woven with threads of shadow and lies.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['False Prophet']
        }
    },
    {
        id: 'false-prophet-whisper-blade',
        name: 'Whisper Blade',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A hidden dagger perfect for eliminating those who see through your lies.',
        iconId: 'inv_weapon_shortblade_25',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
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
            charisma: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['False Prophet']
        }
    },
    {
        id: 'false-prophet-corruption-tome',
        name: 'Tome of Corruption',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book filled with false prophecies and corrupted scripture.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['False Prophet']
        }
    },
    {
        id: 'false-prophet-shadow-amulet',
        name: 'Shadow Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet that shrouds you in shadows, perfect for deception.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['False Prophet']
        }
    }
];

// Factionist - Faction influence manipulator
export const FACTIONIST_ITEMS = [
    {
        id: 'factionist-banner',
        name: 'Faction Banner',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A banner representing your chosen faction. Inspires allies and intimidates foes.',
        iconId: 'inv_bannerpvp_02',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 3,
        rotation: 0,
        stackable: false,
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Factionist']
        }
    },

    {
        id: 'factionist-longsword',
        name: 'Faction Longsword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A standard longsword bearing your faction\'s insignia.',
        iconId: 'inv_sword_27',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
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
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Factionist']
        }
    },
    {
        id: 'factionist-uniform',
        name: 'Faction Uniform',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Standard uniform bearing your faction\'s colors and insignia.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
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
            classes: ['Factionist']
        }
    },
    {
        id: 'factionist-seal-ring',
        name: 'Faction Seal Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring bearing your faction\'s seal, granting authority and influence.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Factionist']
        }
    },
    {
        id: 'factionist-medallion',
        name: 'Faction Medallion',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'common',
        description: 'A medallion that identifies you as a member of your faction.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Factionist']
        }
    }
];

// Plaguebringer - Disease and plague wielder
export const PLAGUEBRINGER_ITEMS = [
    {
        id: 'plaguebringer-plague-staff',
        name: 'Plague Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A gnarled staff that seems to ooze with disease. Handle with care.',
        iconId: 'inv_staff_25',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
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
                damageType: 'poison'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Plaguebringer']
        }
    },
    {
        id: 'plaguebringer-contaminated-robes',
        name: 'Contaminated Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Filthy robes that carry disease and plague spores.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Plaguebringer']
        }
    },
    {
        id: 'plaguebringer-plague-vial',
        name: 'Plague Vial',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A vial containing concentrated plague essence for spreading disease.',
        iconId: 'inv_flask_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            classes: ['Plaguebringer']
        }
    },
    {
        id: 'plaguebringer-pestilence-mask',
        name: 'Pestilence Mask',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A plague doctor\'s mask that protects from disease while spreading it.',
        iconId: 'inv_misc_head_dragon_01',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Plaguebringer']
        }
    },
    {
        id: 'plaguebringer-rotten-tome',
        name: 'Tome of Rot',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A decaying book containing recipes for creating and spreading plagues.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Plaguebringer']
        }
    }
];

// Lichborne - Undead spellcaster with phylactery power
export const LICHBORNE_ITEMS = [
    {
        id: 'lichborne-phylactery',
        name: 'Phylactery',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'rare',
        description: 'An ancient artifact containing your bound soul. Grants immortality and resurrection.',
        iconId: 'inv_jewelry_talisman_11',
        value: { platinum: 0, gold: 25, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 3, isPercentage: false },
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Lichborne']
        }
    },
    {
        id: 'lichborne-frost-staff',
        name: 'Frost Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff made of ice that never melts, pulsing with undead frost energy.',
        iconId: 'inv_staff_25',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
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
                damageType: 'frost'
            }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Lichborne']
        }
    },
    {
        id: 'lichborne-undead-robes',
        name: 'Undead Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Tattered robes that seem to move on their own, pulsating with necromantic energy.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Lichborne']
        }
    },
    {
        id: 'lichborne-soul-gem',
        name: 'Soul Gem',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A gem that captures and stores souls to power necromantic abilities.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Lichborne']
        }
    },
    {
        id: 'lichborne-necromantic-tome',
        name: 'Necromantic Tome',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'An ancient book bound in flesh, containing forbidden necromantic knowledge.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Lichborne']
        }
    }
];

// Death Caller - Necromancy and soul magic
export const DEATH_CALLER_ITEMS = [
    {
        id: 'death-caller-bone-wand',
        name: 'Bone Wand',
        type: 'weapon',
        subtype: 'WAND',
        quality: 'uncommon',
        description: 'A wand carved from bone, pulsing with necromantic energy.',
        iconId: 'inv_wand_11',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'necrotic'
            }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Deathcaller']
        }
    },

    {
        id: 'death-caller-soul-gem',
        name: 'Soul Gem',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A dark crystal that can store soul energy.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Deathcaller']
        }
    },
    {
        id: 'death-caller-necromancer-robes',
        name: 'Necromancer\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Dark robes adorned with bones and symbols of death.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Deathcaller']
        }
    },
    {
        id: 'death-caller-skull-amulet',
        name: 'Skull Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet made from a human skull, pulsing with dark energy.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Deathcaller']
        }
    },
    {
        id: 'death-caller-soul-catcher',
        name: 'Soul Catcher',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A mystical device used to capture and contain souls from the recently deceased.',
        iconId: 'inv_misc_enggizmos_19',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Deathcaller']
        }
    }
];

export const ZEALOT_PATH_ITEMS = [
    ...MARTYR_ITEMS,
    ...EXORCIST_ITEMS,
    ...FALSE_PROPHET_ITEMS,
    ...ORACLE_ITEMS,
    ...FACTIONIST_ITEMS
];

// ===== ARCANIST PATH CLASSES =====

// Spellguard - Ward-based protection caster
export const SPELLGUARD_ITEMS = [
    {
        id: 'spellguard-ward-staff',
        name: 'Warding Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff imbued with protective wards. Shimmers with defensive magic.',
        iconId: 'inv_staff_18',
        value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
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
                damageType: 'arcane'
            }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Spellguard']
        }
    },
    {
        id: 'spellguard-protective-robes',
        name: 'Protective Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes woven with protective wards that shimmer with defensive magic.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Spellguard']
        }
    },
    {
        id: 'spellguard-warding-amulet',
        name: 'Warding Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet that pulses with protective energy, deflecting hostile magic.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Spellguard']
        }
    },
    {
        id: 'spellguard-ward-stone',
        name: 'Ward Stone',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystal that stores ward charges for defensive spells.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Spellguard']
        }
    },
    {
        id: 'spellguard-protection-tome',
        name: 'Tome of Protection',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing defensive spells and ward formulas.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Spellguard']
        }
    }
];

// Inscriptor - Rune-based magic
export const INSCRIPTOR_ITEMS = [
    {
        id: 'inscriptor-rune-chisel',
        name: 'Runic Chisel',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'uncommon',
        description: 'A chisel used for carving magical runes. Can also be used as a weapon.',
        iconId: 'inv_weapon_shortblade_25',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
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
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Inscriptor']
        }
    },

    {
        id: 'inscriptor-rune-stones',
        name: 'Rune Stone Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A set of stones inscribed with powerful runes.',
        iconId: 'inv_stone_15',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Inscriptor']
        }
    },
    {
        id: 'inscriptor-runic-robes',
        name: 'Runic Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes covered in glowing runic patterns that enhance spell effects.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Inscriptor']
        }
    },
    {
        id: 'inscriptor-rune-pouch',
        name: 'Rune Pouch',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A pouch containing various runic materials and inks for inscribing.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Inscriptor']
        }
    },
    {
        id: 'inscriptor-glyph-amulet',
        name: 'Glyph Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet covered in active runes that pulse with arcane energy.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Inscriptor']
        }
    }
];

// Arcanophage - Magic absorption specialist
export const ARCANOPHAGE_ITEMS = [
    {
        id: 'arcanophage-absorption-orb',
        name: 'Absorption Orb',
        type: 'weapon',
        subtype: 'ORB',
        quality: 'uncommon',
        description: 'A crystalline orb that hungrily absorbs magical energy.',
        iconId: 'inv_misc_orb_05',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['offHand'],
        weaponSlot: 'OFF_HAND',
        hand: 'OFF_HAND',
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanophage']
        }
    },
    {
        id: 'arcanophage-magic-staff',
        name: 'Magic Absorption Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff that channels absorbed magic into powerful spells.',
        iconId: 'inv_staff_30',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
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
                damageType: 'arcane'
            }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanophage']
        }
    },
    {
        id: 'arcanophage-void-robes',
        name: 'Void Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes that seem to absorb light and magic, creating a void-like appearance.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanophage']
        }
    },
    {
        id: 'arcanophage-absorption-ring',
        name: 'Absorption Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that passively absorbs stray magical energy.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanophage']
        }
    },
    {
        id: 'arcanophage-magic-tome',
        name: 'Tome of Absorption',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing techniques for absorbing and redirecting magic.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Arcanophage']
        }
    }
];

// Witch Doctor - Spirit totem magic
export const WITCH_DOCTOR_ITEMS = [
    {
        id: 'witch-doctor-totem-staff',
        name: 'Totem Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff adorned with small totems and fetishes. Channels spirit energy.',
        iconId: 'inv_staff_29',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
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
                damageType: 'nature'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Witch Doctor']
        }
    },
    {
        id: 'witch-doctor-tribal-robes',
        name: 'Tribal Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Colorful robes decorated with feathers, bones, and spiritual symbols.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Witch Doctor']
        }
    },
    {
        id: 'witch-doctor-spirit-mask',
        name: 'Spirit Mask',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A ritual mask that allows communication with loa spirits.',
        iconId: 'inv_misc_head_dragon_01',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Witch Doctor']
        }
    },
    {
        id: 'witch-doctor-voodoo-doll',
        name: 'Voodoo Doll',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A doll used for curses and blessings, connecting you to spirits.',
        iconId: 'inv_misc_doll_01',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Witch Doctor']
        }
    },
    {
        id: 'witch-doctor-herb-pouch',
        name: 'Herb Pouch',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A pouch filled with various herbs and ingredients for spiritual rituals.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Witch Doctor']
        }
    }
];

// Formbender - Shapeshifting druid
export const FORMBENDER_ITEMS = [
    {
        id: 'formbender-primal-staff',
        name: 'Primal Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A living wooden staff that seems to grow and shift. Channels primal energy.',
        iconId: 'inv_staff_14',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
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
                damageType: 'nature'
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Formbender']
        }
    },

    {
        id: 'formbender-beast-fang-necklace',
        name: 'Beast Fang Necklace',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'common',
        description: 'A necklace made from the fangs of various beasts. Enhances primal connection.',
        iconId: 'inv_jewelry_necklace_15',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Formbender']
        }
    },
    {
        id: 'formbender-primal-leathers',
        name: 'Primal Leathers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Leather armor that stretches and adapts when you shapeshift.',
        iconId: 'inv_chest_leather_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Formbender']
        }
    },
    {
        id: 'formbender-beast-claw',
        name: 'Beast Claw',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A weapon shaped like a beast\'s claw, perfect for primal combat.',
        iconId: 'inv_weapon_shortblade_25',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
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
            classes: ['Formbender']
        }
    },
    {
        id: 'formbender-shape-totem',
        name: 'Shape Totem',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A totem that stores the essence of various animal forms.',
        iconId: 'inv_misc_bone_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Formbender']
        }
    }
];

export const ARCANIST_PATH_ITEMS = [
    ...SPELLGUARD_ITEMS,
    ...INSCRIPTOR_ITEMS,
    ...ARCANOPHAGE_ITEMS,
    ...WITCH_DOCTOR_ITEMS,
    ...FORMBENDER_ITEMS
];

// ===== REAVER PATH CLASSES =====

// Berserker - Rage-fueled warrior
export const BERSERKER_ITEMS = [
    {
        id: 'berserker-greataxe',
        name: 'Berserker\'s Greataxe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'uncommon',
        description: 'A massive two-handed axe designed for devastating strikes. Stained with battle.',
        iconId: 'inv_axe_09',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
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
            classes: ['Berserker']
        }
    },

    {
        id: 'berserker-hide-armor',
        name: 'Berserker Hide',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Thick hide armor that allows for mobility while providing protection.',
        iconId: 'inv_chest_leather_06',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 12,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 3, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Berserker']
        }
    },
    {
        id: 'berserker-rage-totem',
        name: 'Rage Totem',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A totem that channels your fury into physical power.',
        iconId: 'inv_misc_bone_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            strength: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Berserker']
        }
    },
    {
        id: 'berserker-battle-axe',
        name: 'Battle Axe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A one-handed axe perfect for dual-wielding when rage takes over.',
        iconId: 'inv_axe_09',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 2,
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
        baseStats: {
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Berserker']
        }
    },
    {
        id: 'berserker-war-paint',
        name: 'War Paint',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Paint used to mark yourself for battle, enhancing your rage.',
        iconId: 'inv_misc_paint_01',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Berserker']
        }
    }
];

// Dreadnaught - Fortress-style tank
export const DREADNAUGHT_ITEMS = [
    {
        id: 'dreadnaught-tower-shield',
        name: 'Tower Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'uncommon',
        description: 'A massive shield that can protect you and allies behind you.',
        iconId: 'inv_shield_06',
        value: { platinum: 0, gold: 18, silver: 0, copper: 0 },
        weight: 15,
        width: 2,
        height: 3,
        slots: ['offHand'],
        armor: 4,
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Dreadnaught']
        }
    },

    {
        id: 'dreadnaught-warhammer',
        name: 'Heavy Warhammer',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A one-handed warhammer for crushing foes.',
        iconId: 'inv_hammer_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
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
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Dreadnaught']
        }
    },
    {
        id: 'dreadnaught-fortress-plate',
        name: 'Fortress Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Heavy plate armor designed to make you an immovable fortress.',
        iconId: 'inv_chest_plate_03',
        value: { platinum: 0, gold: 20, silver: 0, copper: 0 },
        weight: 35,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 6, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 2, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Dreadnaught']
        }
    },
    {
        id: 'dreadnaught-bastion-helmet',
        name: 'Bastion Helmet',
        type: 'armor',
        subtype: 'HELMET',
        quality: 'common',
        description: 'A heavy helmet that provides maximum protection.',
        iconId: 'inv_helmet_plate_03',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 1,
        slots: ['head'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Dreadnaught']
        }
    },
    {
        id: 'dreadnaught-siege-ram',
        name: 'Siege Ram',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'A massive ramming weapon for breaking through enemy lines.',
        iconId: 'inv_hammer_13',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 8,
        width: 2,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 2,
                diceType: 6,
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            strength: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Dreadnaught']
        }
    }
];

// Titan - Gravity manipulation warrior
export const TITAN_ITEMS = [
    {
        id: 'titan-gravity-maul',
        name: 'Gravity Maul',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'A massive maul that seems impossibly heavy. Channels gravitational force.',
        iconId: 'inv_hammer_13',
        value: { platinum: 0, gold: 16, silver: 0, copper: 0 },
        weight: 10,
        width: 2,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 2,
                diceType: 6,
                damageType: 'bludgeoning'
            }
        },
        baseStats: {
            strength: { value: 3, isPercentage: false }
        },
        availableFor: {
            classes: ['Titan']
        }
    },
    {
        id: 'titan-gravity-plate',
        name: 'Gravity Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Heavy plate armor that manipulates gravity around you.',
        iconId: 'inv_chest_plate_03',
        value: { platinum: 0, gold: 18, silver: 0, copper: 0 },
        weight: 40,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 5, isPercentage: false }
        },
        baseStats: {
            strength: { value: 2, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Titan']
        }
    },
    {
        id: 'titan-gravity-core',
        name: 'Gravity Core',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A dark crystal that pulses with gravitational energy.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            strength: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Titan']
        }
    },
    {
        id: 'titan-strain-brace',
        name: 'Strain Brace',
        type: 'accessory',
        subtype: 'RING',
        quality: 'common',
        description: 'A ring that helps manage gravitational strain.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Titan']
        }
    },
    {
        id: 'titan-gravity-tome',
        name: 'Tome of Gravity',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing techniques for manipulating gravitational forces.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Titan']
        }
    }
];

export const REAVER_PATH_ITEMS = [
    ...BERSERKER_ITEMS,
    ...DREADNAUGHT_ITEMS,
    ...TITAN_ITEMS
];

// ===== MERCENARY PATH CLASSES =====

// Toxicologist - Poison and vial specialist
export const TOXICOLOGIST_ITEMS = [
    {
        id: 'toxicologist-poison-dagger',
        name: 'Envenomed Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'uncommon',
        description: 'A dagger with a hollow blade designed to deliver poison.',
        iconId: 'inv_weapon_shortblade_15',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
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
            agility: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Toxicologist']
        }
    },

    {
        id: 'toxicologist-vial-bandolier',
        name: 'Alchemist\'s Bandolier',
        type: 'accessory',
        subtype: 'BELT',
        quality: 'uncommon',
        description: 'A bandolier with slots for carrying vials and potions.',
        iconId: 'inv_belt_27',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['waist'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Toxicologist']
        }
    },
    {
        id: 'toxicologist-poison-robes',
        name: 'Poison-Resistant Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes treated to resist poison, allowing safe handling of toxic materials.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Toxicologist']
        }
    },
    {
        id: 'toxicologist-poison-vial',
        name: 'Poison Vial Set',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A set of empty vials ready to be filled with various poisons.',
        iconId: 'inv_flask_01',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        availableFor: {
            classes: ['Toxicologist']
        }
    },
    {
        id: 'toxicologist-alchemy-tome',
        name: 'Alchemy Tome',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing recipes for crafting various poisons and toxins.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Toxicologist']
        }
    },
    {
        id: 'toxicologist-toxic-ring',
        name: 'Toxic Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances your ability to craft and apply poisons.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Toxicologist']
        }
    }
];

// Covenbane - Anti-magic specialist
export const COVENBANE_ITEMS = [
    {
        id: 'covenbane-nullifying-blade',
        name: 'Nullifying Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A sword forged to disrupt magical energies.',
        iconId: 'inv_sword_48',
        value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
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
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Covenbane']
        }
    },
    {
        id: 'covenbane-anti-magic-armor',
        name: 'Anti-Magic Armor',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Armor enchanted to resist and nullify magical effects.',
        iconId: 'inv_chest_plate_03',
        value: { platinum: 0, gold: 16, silver: 0, copper: 0 },
        weight: 25,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 4, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Covenbane']
        }
    },
    {
        id: 'covenbane-hexbreaker-seal',
        name: 'Hexbreaker Seal',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances your ability to break magical hexes and curses.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Covenbane']
        }
    },
    {
        id: 'covenbane-witch-hunter-tome',
        name: 'Witch Hunter\'s Tome',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing techniques for hunting and neutralizing magic users.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Covenbane']
        }
    },
    {
        id: 'covenbane-null-amulet',
        name: 'Null Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet that creates a zone of magic suppression around you.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Covenbane']
        }
    }
];

// Bladedancer - Agility-based dual wielder
export const BLADEDANCER_ITEMS = [
    {
        id: 'bladedancer-twin-blades',
        name: 'Twin Dancing Blades',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A pair of lightweight curved blades perfect for swift strikes. Sold as a set.',
        iconId: 'inv_sword_39',
        value: { platinum: 0, gold: 16, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'DUAL_WIELD',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 6,
                damageType: 'slashing'
            }
        },
        baseStats: {
            agility: { value: 3, isPercentage: false }
        },
        availableFor: {
            classes: ['Bladedancer']
        }
    },

    {
        id: 'bladedancer-light-armor',
        name: 'Dancer\'s Leathers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Supple leather armor that doesn\'t restrict movement.',
        iconId: 'inv_chest_leather_08',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Bladedancer']
        }
    },
    {
        id: 'bladedancer-grace-ring',
        name: 'Ring of Grace',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that enhances your grace and precision in combat.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Bladedancer']
        }
    },
    {
        id: 'bladedancer-flourish-cloak',
        name: 'Flourish Cloak',
        type: 'armor',
        subtype: 'CLOAK',
        quality: 'common',
        description: 'A flowing cloak that enhances your elegant movements.',
        iconId: 'inv_misc_cape_06',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Bladedancer']
        }
    },
    {
        id: 'bladedancer-dance-manual',
        name: 'Dance Manual',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A manual containing combat techniques that blend dance and swordplay.',
        iconId: 'inv_misc_book_11',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Bladedancer']
        }
    }
];

// Arcanoneer - Arcane gunslinger
export const ARCANONEER_ITEMS = [
    {
        id: 'arcanoneer-arcane-pistol',
        name: 'Arcane Pistol',
        type: 'weapon',
        subtype: 'GUN',
        quality: 'uncommon',
        description: 'A magical firearm that shoots bolts of arcane energy instead of bullets.',
        iconId: 'inv_weapon_rifle_01',
        value: { platinum: 0, gold: 18, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'arcane'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            intelligence: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanoneer']
        }
    },
    {
        id: 'arcanoneer-magical-leathers',
        name: 'Magical Leathers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Light armor with pockets for arcane components and ammunition.',
        iconId: 'inv_chest_leather_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanoneer']
        }
    },
    {
        id: 'arcanoneer-arcane-ammo-pouch',
        name: 'Arcane Ammo Pouch',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A pouch containing magical crystals used as ammunition.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Arcanoneer']
        }
    },
    {
        id: 'arcanoneer-precision-sight',
        name: 'Precision Sight',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A magical sight that enhances your aim and accuracy.',
        iconId: 'inv_misc_enggizmos_19',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Arcanoneer']
        }
    },
    {
        id: 'arcanoneer-gunslinger-manual',
        name: 'Gunslinger\'s Manual',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A manual containing techniques for wielding arcane firearms.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 7, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Arcanoneer']
        }
    }
];

// Primalist - Elemental force wielder
export const PRIMALIST_ITEMS = [
    {
        id: 'primalist-elemental-staff',
        name: 'Elemental Staff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'uncommon',
        description: 'A staff that crackles with elemental energy - fire, ice, lightning, and earth.',
        iconId: 'inv_staff_23',
        value: { platinum: 0, gold: 13, silver: 0, copper: 0 },
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
                damageType: 'elemental'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Primalist']
        }
    },

    {
        id: 'primalist-natures-robes',
        name: 'Nature\'s Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Flowing robes woven from living vines and leaves that shift with the seasons.',
        iconId: 'inv_chest_cloth_18',
        value: { platinum: 0, gold: 18, silver: 0, copper: 0 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false },
            resistances: {
                fire: { value: 5, isPercentage: false },
                cold: { value: 5, isPercentage: false }
            }
        },
        baseStats: {
            wisdom: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Primalist']
        }
    },

    {
        id: 'primalist-totem-pouch',
        name: 'Totem Pouch',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A leather pouch containing carved elemental totems that resonate with primal forces.',
        iconId: 'inv_misc_bag_08',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        combatStats: {
            carryingCapacity: { slots: 3 }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Primalist']
        }
    },

    {
        id: 'primalist-totem-stone',
        name: 'Totem Stone',
        type: 'weapon',
        subtype: 'TOTEM',
        quality: 'rare',
        description: 'A sacred stone carved with elemental runes, used to channel primal magic.',
        iconId: 'inv_misc_stonetablet_01',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 1,
        slots: ['mainHand', 'offHand'],
        weaponSlot: 'ONE_HANDED',
        hand: 'ONE_HAND',
        combatStats: {
            spellDamage: {
                fire: { value: 10, isPercentage: true },
                cold: { value: 10, isPercentage: true },
                lightning: { value: 10, isPercentage: true }
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Primalist']
        },
        craftable: true
    },

    {
        id: 'primalist-elemental-crystal',
        name: 'Elemental Crystal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A multi-faceted crystal that shimmers with all four elemental colors.',
        iconId: 'inv_misc_gem_02',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Primalist']
        }
    }
];

export const MERCENARY_PATH_ITEMS = [
    ...TOXICOLOGIST_ITEMS,
    ...COVENBANE_ITEMS,
    ...BLADEDANCER_ITEMS,
    ...ARCANONEER_ITEMS,
    ...PRIMALIST_ITEMS
];

// ===== SENTINEL PATH CLASSES =====

// Lunarch - Lunar mage with phase-based energy
export const LUNARCH_ITEMS = [
    {
        id: 'lunarch-lunar-bow',
        name: 'Lunar Bow',
        type: 'weapon',
        subtype: 'BOW',
        quality: 'uncommon',
        description: 'A bow crafted from moonstone that glows with the power of lunar phases.',
        iconId: 'inv_weapon_bow_08',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
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
                damageType: 'radiant'
            }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Lunarch']
        }
    },
    {
        id: 'lunarch-moonstone-amulet',
        name: 'Moonstone Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet containing a piece of the moon itself, pulsing with lunar energy.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Lunarch']
        }
    },
    {
        id: 'lunarch-lunar-robes',
        name: 'Lunar Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Robes that shimmer like moonlight and shift with lunar phases.',
        iconId: 'inv_chest_cloth_17',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            intelligence: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Lunarch']
        }
    },
    {
        id: 'lunarch-phase-crystal',
        name: 'Phase Crystal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A crystal that tracks lunar phases and enhances lunar magic.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Lunarch']
        }
    },
    {
        id: 'lunarch-lunar-tome',
        name: 'Lunar Tome',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing lunar magic and phase-based techniques.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Lunarch']
        }
    }
];

// Huntress - Ranged tracker with quarry marks
export const HUNTRESS_ITEMS = [
    {
        id: 'huntress-shadow-glaive',
        name: 'Shadow Glaive',
        type: 'weapon',
        subtype: 'POLEARM',
        quality: 'uncommon',
        description: 'A deadly glaive that can chain strikes between multiple enemies, favored by hunters.',
        iconId: 'inv_spear_07',
        value: { platinum: 0, gold: 16, silver: 0, copper: 0 },
        weight: 6,
        width: 1,
        height: 3,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 10,
                damageType: 'slashing'
            }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Huntress']
        }
    },
    {
        id: 'huntress-tracking-gear',
        name: 'Tracker\'s Gear',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Light armor designed for tracking prey and remaining hidden.',
        iconId: 'inv_chest_leather_05',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Huntress']
        }
    },
    {
        id: 'huntress-tracking-kit',
        name: 'Tracking Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A kit containing tools for tracking and marking quarry.',
        iconId: 'inv_misc_bag_11',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Huntress']
        }
    },
    {
        id: 'huntress-prey-mark',
        name: 'Prey Mark',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A trinket that enhances your ability to mark and track targets.',
        iconId: 'inv_misc_enggizmos_19',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            agility: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Huntress']
        }
    },
    {
        id: 'huntress-ranger-manual',
        name: 'Ranger\'s Manual',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A manual containing tracking and hunting techniques.',
        iconId: 'inv_misc_book_11',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Huntress']
        }
    }
];

// Warden - Guardian protector
export const WARDEN_ITEMS = [
    {
        id: 'warden-guardian-spear',
        name: 'Guardian Spear',
        type: 'weapon',
        subtype: 'POLEARM',
        quality: 'uncommon',
        description: 'A sturdy spear designed for both offense and defense.',
        iconId: 'inv_spear_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 6,
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
            strength: { value: 1, isPercentage: false },
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Warden']
        }
    },

    {
        id: 'warden-chainmail',
        name: 'Warden\'s Chainmail',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'common',
        description: 'Well-maintained chainmail armor. Provides solid protection.',
        iconId: 'inv_chest_chain_03',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 20,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 4, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Warden']
        }
    },
    {
        id: 'warden-guardian-shield',
        name: 'Guardian Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'common',
        description: 'A shield designed to protect allies behind you.',
        iconId: 'inv_shield_06',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['offHand'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Warden']
        }
    },
    {
        id: 'warden-protection-amulet',
        name: 'Protection Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet that enhances your ability to protect allies.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            constitution: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Warden']
        }
    },
    {
        id: 'warden-barrier-stone',
        name: 'Barrier Stone',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A stone that stores barrier energy for protecting allies.',
        iconId: 'inv_misc_gem_azuredraenite_01',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            constitution: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Warden']
        }
    }
];

// Justicar - Holy avenger
export const JUSTICAR_ITEMS = [
    {
        id: 'justicar-holy-sword',
        name: 'Justicar\'s Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A blessed longsword that glows with righteous light.',
        iconId: 'inv_sword_62',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
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
                damageType: 'radiant'
            }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Justicar']
        }
    },

    {
        id: 'justicar-holy-shield',
        name: 'Shield of Faith',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'uncommon',
        description: 'A shield emblazoned with holy symbols.',
        iconId: 'inv_shield_09',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        slots: ['offHand'],
        armor: 2,
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Justicar']
        }
    },
    {
        id: 'justicar-holy-plate',
        name: 'Holy Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Plate armor blessed with divine protection.',
        iconId: 'inv_chest_plate_03',
        value: { platinum: 0, gold: 18, silver: 0, copper: 0 },
        weight: 30,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 5, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            spirit: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Justicar']
        }
    },
    {
        id: 'justicar-righteous-amulet',
        name: 'Righteous Amulet',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'An amulet that enhances your righteous judgment.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            spirit: { value: 2, isPercentage: false },
            strength: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Justicar']
        }
    },
    {
        id: 'justicar-holy-tome',
        name: 'Tome of Justice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing holy laws and techniques of judgment.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Justicar']
        }
    }
];

// Oathkeeper - Vow-bound warrior
export const OATHKEEPER_ITEMS = [
    {
        id: 'oathkeeper-oath-blade',
        name: 'Oathbound Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A sword bound by sacred oaths. Grows stronger with each vow kept.',
        iconId: 'inv_sword_50',
        value: { platinum: 0, gold: 14, silver: 0, copper: 0 },
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
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Oathkeeper']
        }
    },
    {
        id: 'oathkeeper-vow-plate',
        name: 'Vow Plate',
        type: 'armor',
        subtype: 'PLATE',
        quality: 'uncommon',
        description: 'Plate armor inscribed with sacred vows and oaths.',
        iconId: 'inv_chest_plate_03',
        value: { platinum: 0, gold: 17, silver: 0, copper: 0 },
        weight: 30,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 5, isPercentage: false }
        },
        baseStats: {
            strength: { value: 1, isPercentage: false },
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Oathkeeper']
        }
    },
    {
        id: 'oathkeeper-oath-ring',
        name: 'Oath Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring that binds you to your oaths and enhances their power.',
        iconId: 'inv_jewelry_ring_07',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            charisma: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            classes: ['Oathkeeper']
        }
    },
    {
        id: 'oathkeeper-vow-tome',
        name: 'Tome of Vows',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A book containing sacred oaths and vow-binding techniques.',
        iconId: 'inv_misc_book_09',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        availableFor: {
            classes: ['Oathkeeper']
        }
    },
    {
        id: 'oathkeeper-oath-seal',
        name: 'Oath Seal',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A seal that represents your bound oaths and enhances their power.',
        iconId: 'inv_jewelry_necklace_07',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['neck'],
        baseStats: {
            charisma: { value: 2, isPercentage: false }
        },
        availableFor: {
            classes: ['Oathkeeper']
        }
    }
];

export const SENTINEL_PATH_ITEMS = [
    ...LUNARCH_ITEMS,
    ...HUNTRESS_ITEMS,
    ...WARDEN_ITEMS,
    ...JUSTICAR_ITEMS,
    ...OATHKEEPER_ITEMS
];

// ===== HEXER PATH CLASSES =====

// Hexer path class items (generic for all hexer classes)
export const HEXER_PATH_ITEMS = [
    {
        id: 'hexer-cursed-dagger',
        name: 'Cursed Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'uncommon',
        description: 'A dagger imbued with dark curses. Whispers malevolently when drawn.',
        iconId: 'inv_weapon_shortblade_35',
        value: { platinum: 0, gold: 11, silver: 0, copper: 0 },
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
                damageType: 'necrotic'
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['hexer']
        }
    },

    {
        id: 'hexer-dark-robes',
        name: 'Hexer\'s Dark Robes',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'Black robes adorned with occult symbols. Emanates an aura of dread.',
        iconId: 'inv_chest_cloth_50',
        value: { platinum: 0, gold: 9, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['hexer']
        }
    }
];

// ===== HARROW PATH CLASSES =====

// Harrow Path Classes
export const HARROW_PATH_ITEMS = [
    ...LICHBORNE_ITEMS,
    ...PLAGUEBRINGER_ITEMS,
    ...DEATH_CALLER_ITEMS,
    {
        id: 'harrow-hunting-bow',
        name: 'Hunter\'s Bow',
        type: 'weapon',
        subtype: 'BOW',
        quality: 'common',
        description: 'A well-crafted hunting bow. Perfect for tracking prey in the wilderness.',
        iconId: 'inv_weapon_bow_08',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
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
            paths: ['harrow']
        }
    },

    {
        id: 'harrow-beast-companion-collar',
        name: 'Beast Companion Collar',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A leather collar for bonding with animal companions.',
        iconId: 'inv_misc_bone_09',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        availableFor: {
            paths: ['harrow']
        }
    },

    {
        id: 'harrow-tracker-leathers',
        name: 'Tracker\'s Leathers',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Light leather armor designed for wilderness tracking and hunting.',
        iconId: 'inv_chest_leather_05',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            paths: ['harrow']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_CLASS_EQUIPMENT = [
    ...INFERNAL_PATH_ITEMS,
    ...ZEALOT_PATH_ITEMS,
    ...ARCANIST_PATH_ITEMS,
    ...REAVER_PATH_ITEMS,
    ...MERCENARY_PATH_ITEMS,
    ...SENTINEL_PATH_ITEMS,
    ...HEXER_PATH_ITEMS,
    ...HARROW_PATH_ITEMS
];

