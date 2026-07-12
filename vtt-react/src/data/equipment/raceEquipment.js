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
        name: 'Thalren Reach-Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A well-balanced longsword of Fog-Compact ironwood and bog-iron, standard issue for the lineage-keeps of House Thalren.',
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
                damageType: 'physical'
            }
        },
        availableFor: {
            races: ['human']
        }
    },

    {
        id: 'human-travelers-pack',
        name: 'Wayfarer Chain-Pack',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A practical ironwood-frame pack, chain-bound so it cannot be lost in the fog. Holds rope, waybread, and a soul\'s worth of ledgers.',
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
        name: 'Memory-Shard Signet',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A Mimir signet set with a fragment of memory-crystal. Worn faces flicker with borrowed recollections of forgotten lore.',
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
        name: 'Mask-Melder Component Sash',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A sash of face-stealers silk, its pouches lined with memory-crystal pigments and sculpting compounds for the Mimir mask-craft.',
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
        description: 'Bracers woven from living ironwood-vine by Briaran wardens of the Hollow-Court. The thorns grip when you clench your fist.',
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
        description: 'Boots laced with deep-root fiber that anchor a Briaran to the Frostwood floor. The grove remembers where you step.',
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
        description: 'Gauntlets of morgh-stone and bone-sinew, forged in the Cragjaw tradition. The ancestors grip does not slip.',
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
        description: 'A belt strung with Groven ancestor-bone charms that stitch flesh the way the bone-bridges stitch the peaks.',
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
        description: 'Bracers of Solbrand-tempered cloth that hold the Emberspires warmth against the frost. The faithful wear them at the vigil-fires.',
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
        description: 'Boots soled with Basalt-Shyr grit that grip where the caldera-glass runs molten. Forge-born Emberth feet do not slip.',
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
        description: 'Gloves of Root-Veil silk that drink the light the way the Hush-Bogs drink memory. A Vreken tool of the deep groves.',
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
        description: 'A cloak of ghost-mycelium weave that bends the eye away. The Clean Vreken wear these to walk where the spore-hush cannot follow.',
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

// Neth base items
export const NETH_BASE_ITEMS = [
    {
        id: 'neth-death-ring',
        name: 'Soul Echo Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A silver-leaf ring binding a fragment of the First Contract echo. Morvane sees through it, and the dead speak when the terms demand.',
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
            races: ['neth']
        }
    },

    {
        id: 'neth-grave-boots',
        name: 'Gravewalker Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Boots of Atropolis ironwood, silent on the contract-house floors. A Neth debt-collector walks where the dying cannot hear.',
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
            races: ['neth']
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
        description: 'A ring set with a memory-glass chip that hums when Lumia\'s echo stirs within an Astril bearer. The Synod issues these to every Astril host.',
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
            races: ['astril']
        }
    },

    {
        id: 'astren-moon-cloak',
        name: 'Lunar Mantle',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak of crystal-thread that refracts the light of dying stars. The Synod-Hold weavers stitch them for scholars who walk the Starfall Vale.',
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
            races: ['astril']
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
        description: 'Gauntlets of copper-plate reinforcement, standard issue for Fexric warren-workers who handle gear-assemblies behind the blast-doors.',
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
agility: { value: 1, isPercentage: false }
        },
        availableFor: {
            races: ['fexrick']
        }
    },

    {
        id: 'ferrick-toolbelt',
        name: 'Tinker\'s Toolbelt',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'A belt hung with the guild-vault tools a Fexric carries: calipers, pinion-keys, and fragment-page notes stitched into the lining.',
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
            races: ['fexrick']
        }
    }
];

// ===== SUBRACE ITEMS (1 extra per subrace) =====


// Myrathil subrace items
export const MYRATHIL_SUBRACE_ITEMS = [
    {
        id: 'shore-sea-glass-torc',
        name: 'Shore\'s Sea-Glass Torc',
        type: 'accessory',
        subtype: 'NECKLACE',
        quality: 'uncommon',
        description: 'A torc of woven salvage-silk set with sea-glass that shifts color with atmospheric pressure, a Shore trader\'s most trusted negotiation tool.',
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
            subraces: ['shore_myrathil']
        }
    },

    {
        id: 'deep-abyss-pearl',
        name: 'Deep Abyss Pearl',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A pearl harvested from the deepest trench-gardens, cold to the touch even on land. Deep mystics use it as a focus for the low hum, it resonates faintly when the abyss is listening.',
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
        id: 'brook-cartographer-kit',
        name: 'Brook Cartographer\'s Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A waterproofed leather case containing parchment, ink pressed from coastal minerals, and a compass that points toward the nearest river-mouth rather than north. Carried by every Brook who walks inland.',
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
            subraces: ['brook_myrathil']
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
        description: 'A cloak of fog-spider silk that holds the shape of whoever last wore a mask near it. A Masked tool of identity-craft.',
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
            subraces: ['masked_mimir']
        }
    },
    {
        id: 'broken-mind-lantern',
        name: 'Fractured Lantern',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A storm-glass lantern that reveals the spore-trails intruders leave. The Woven hang these from the Spire-Aeries.',
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
            subraces: ['woven_mimir']
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
            subraces: ['masked_mimir']
        }
    },
    {
        id: 'salt-pouch-reinforced',
        name: 'Silence-Sealed Salt Pouch',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A pouch of salt stitched into Silence-resistant leather. Grants advantage on saves against salt-based vulnerability triggers. The Hollow carry these as others carry sacred symbols, protection from their own weakness.',
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
            subraces: ['unwoven_mimir']
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
        description: 'A mirror of ghost-metal polish that shows the face beneath a Shorn Briarans borrowed name. The Hollow-Court trades in what it reveals.',
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
            subraces: ['shorn_briaran']
        }
    },
    {
        id: 'wild-thorn-armor',
        name: 'Wild Thorn Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'uncommon',
        description: 'Living thorn-plate grown from a Trueborn Briarans own skin. The Thorn-Fall records every wound it absorbs.',
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
            subraces: ['trueborn_briaran']
        }
    },
    {
        id: 'dusk-moon-blade',
        name: 'Dusk Moon Blade',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'uncommon',
        description: 'A ghost-metal blade forged in the moonlit groves. It remembers the Viridane counter-pact and cuts the faes enemies.',
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
                damageType: 'physical'
            }
        },
        baseStats: {
            agility: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['trueborn_briaran']
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
        description: 'A shield of morgh-stone from the Cragjaw peaks, carved with the ancestor-marks the Groven dead left on the bone-bridges.',
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
            agility: { value: 2, isPercentage: false }
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
                damageType: 'physical'
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
        description: 'A hammer tempered at Harath-Vault beneath the Emberspire. The Solbrands heat still lives in the striking-face.',
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
                damageType: 'physical'
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
        description: 'An ash-cloth cloak from the Thrask forges. The caldera-wind taught the weave to shed cinder and ember alike.',
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
        description: 'A Korr-forged blade quenched in Solbrand-light. The Dawn Vigil issues these to its most devoted sworn-swords.',
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
                damageType: 'physical'
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
        description: 'Gauntlets tipped with the calcified growths of a Marked Vrekens own bones. The Root-Veil marks its own.',
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
            subraces: ['marked_vreken']
        }
    },
    {
        id: 'penitent-cursed-ring',
        name: 'Penitent\'s Cursed Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A ring of Clean Vreken making, forged to suppress the fungal-heritage that strains against the surface. It steadies the spirit at the cost of the hunger beneath.',
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
            subraces: ['clean_vreken']
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
            subraces: ['clean_vreken']
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
            subraces: ['marked_vreken']
        }
    }
];

// Neth subrace items
export const NETH_SUBRACE_ITEMS = [
    {
        id: 'vault-keeper-seal',
        name: 'Vault Keeper\'s Seal',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A Kessen contract-seal stamped in bog-iron, authorizing the bearer to enter the deepest Atropolis vaults where the First Contract sleeps.',
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
            subraces: ['kessen_neth']
        }
    },
    {
        id: 'dust-scribe-quill',
        name: 'Dust Scribe\'s Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A Velun Neth quill that writes in silver-leaf ink, drafting contract-clauses so tight Morvane has never found a gap. The ink never dries.',
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
            subraces: ['velun_neth']
        }
    },
    {
        id: 'wraith-shadow-cloak',
        name: 'Wraith\'s Shadow Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A cloak of the Over-Shanty, woven from the legal nonexistence of the Drun. It wears the absence of a name.',
        iconId: 'inv_misc_cape_20',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 1,
        width: 2,
        height: 2,
        slots: ['back'],
        baseStats: {
            agility: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['drun_neth']
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
        description: 'A Silath crystal-veil that cages Lumian resonance behind mental discipline. The Submersion threshold recedes while it is worn.',
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
            subraces: ['silath_astril']
        }
    },
    {
        id: 'sunborn-radiant-crown',
        name: 'Sunborn Radiant Crown',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A Vashir crown that lets Lumia\'s echo burn bright and unchained. The host\'s chest glows like a captured star.',
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
            subraces: ['vashir_astril']
        }
    },
    {
        id: 'starmapped-star-chart',
        name: 'Constellation Star Chart',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A bone-etched chart of the Astril echo-lineages, mapping which signatures still resonate and which went dark at the Ordavan bargain.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 10, silver: 50, copper: 75 },
        weight: 0.5,
        width: 1,
        height: 1,
        slots: ['trinket1', 'trinket2'],
        baseStats: {
            intelligence: { value: 2, isPercentage: false },
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            subraces: ['vashir_astril', 'silath_astril']
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
        description: 'A Drall toolkit assembled from stolen guild-vault fragments. Every tool is improvised from half-understood blueprints, and most of them work.',
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
            subraces: ['drall_fexric']
        }
    },
    {
        id: 'bonesmith-iron-knuckles',
        name: 'Bonesmith\'s Iron Knuckles',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'uncommon',
        description: 'Kethrin-forged knuckle-guards stamped with a Master Craft-Guild seal. The guild-vaults teach that every mechanism, including a fist, benefits from reinforcement.',
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
            subraces: ['kethrin_fexric']
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
            subraces: ['thalren_human']
        }
    },
    {
        id: 'hearthorn-calloused-gauntlets',
        name: 'Calloused Gauntlets',
        type: 'armor',
        subtype: 'HANDS',
        quality: 'common',
        description: 'Thick leather gloves stained with decades of honest labor. The leather has been replaced so many times that nothing of the original remains, but the calluses inside are irreplaceable.',
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
            subraces: ['tessen_human']
        }
    },
    {
        id: 'paleborn-veilband',
        name: 'Ashring Veilband',
        type: 'accessory',
        subtype: 'HEAD',
        quality: 'uncommon',
        description: 'A thin band of crystallized ley-resonance worn across the eyes. It dulls the Pale-Born\'s overwhelming sight in dense magical areas, and dimly glows in the presence of enchantments.',
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
            subraces: ['merryn_human']
        }
    }
];

// ===== COMBINED EXPORT =====

export const ALL_RACE_EQUIPMENT = [
    ...HUMAN_BASE_ITEMS,
    ...MYRATHIL_BASE_ITEMS,
    ...MIMIR_BASE_ITEMS,
    ...BRIARAN_BASE_ITEMS,
    ...GROVEN_BASE_ITEMS,
    ...EMBERTH_BASE_ITEMS,
    ...VREKEN_BASE_ITEMS,
    ...NETH_BASE_ITEMS,
    ...ASTREN_BASE_ITEMS,
    ...FERRICK_BASE_ITEMS,
    ...MYRATHIL_SUBRACE_ITEMS,
    ...MIMIR_SUBRACE_ITEMS,
    ...BRIARAN_SUBRACE_ITEMS,
    ...GROVEN_SUBRACE_ITEMS,
    ...EMBERTH_SUBRACE_ITEMS,
    ...VREKEN_SUBRACE_ITEMS,
    ...NETH_SUBRACE_ITEMS,
    ...ASTREN_SUBRACE_ITEMS,
    ...FERRICK_SUBRACE_ITEMS,
    ...HUMAN_SUBRACE_ITEMS
];
