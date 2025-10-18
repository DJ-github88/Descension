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
    }
];

// Combine all Infernal Path items
export const INFERNAL_PATH_ITEMS = [
    ...PYROFIEND_ITEMS,
    ...MINSTREL_ITEMS,
    ...CHRONARCH_ITEMS,
    ...CHAOS_WEAVER_ITEMS,
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
            classes: ['Death Caller']
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
            classes: ['Death Caller']
        }
    }
];

export const ZEALOT_PATH_ITEMS = [
    ...MARTYR_ITEMS,
    ...FALSE_PROPHET_ITEMS,
    ...FACTIONIST_ITEMS,
    ...PLAGUEBRINGER_ITEMS,
    ...DEATH_CALLER_ITEMS
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
    }
];

export const SENTINEL_PATH_ITEMS = [
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

// Primalist is already in Mercenary path, so Harrow needs other classes
export const HARROW_PATH_ITEMS = [
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

