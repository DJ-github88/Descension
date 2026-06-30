/**
 * Background-Specific Starting Equipment
 * 
 * Items that are only available to specific character backgrounds.
 */

// ===== EMBERSPIRE PILGRIM =====
export const EMBERSPIRE_PILGRIM_ITEMS = [
    {
        id: 'acolyte-prayer-book',
        name: 'Solbrand Prayer-Leaf',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A palm-leaf of fire-resistant parchment inscribed with Solbrand vigils, worn smooth by a thousand dawn-prayers.',
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
        name: 'Caldera Resin-Cones (10)',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Cones of dried caldera-pine resin. Burned at dawn to catch the Solbrand last warmth; the smoke carries prayers into the deep.',
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
        name: 'Pilgrim Ash-Robe',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A robe of Sundale ash-grey wool worn by Solbrand pilgrims on the Emberspire circuit.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                ember: { level: 75, multiplier: 0.75, label: 'Ember Guard', color: '#B34625' }
            }
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
        name: 'Shyr Obsidian-Pry',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A bog-iron pry-bar wrapped in caldera-cloth. Standard issue for a Shyr runner working the obsidian-trade crevices.',
        iconId: 'Misc/Profession Resources/Tools/claw-hammer',
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
        name: 'Basalt-Dust Wraps',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Dark, nondescript wraps stained grey with Shyr basalt-dust. Blends into the caldera-shadow at a distance.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                physical: { level: 85, multiplier: 0.85, label: 'Caldera Blend', color: '#6E6E6E' }
            }
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
        name: 'Crevice-Tools',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A rolled kit of obsidian-edged picks and bog-iron probes for working the Shyr trade-crevices and the locks that guard them.',
        iconId: 'Misc/Profession Resources/Tools/satchel-pouch-brown-golden-buckle',
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
        name: 'Obsidian Splint-Locks (5)',
        type: 'consumable',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Five splinters of Shyr obsidian, each honed to a different ward. Brittle, but silent.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
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
        name: 'Scribe-Sentinel Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A chained kit of quill, peat-ink, and binding-wax. The tools of a Thalren ledger-keeper whose journal is their legal identity.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
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
        name: 'Barrow-Spade',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A short ironwood spade for the mist-barrows. Mistbarrow archivists petition for these every thaw.',
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
        name: 'Fog-Weave Habit',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A simple habit of fog-grey wool, standard for the Frostwood ledger-wards.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                rime: { level: 85, multiplier: 0.85, label: 'Rime Guard', color: '#2C5F7C' }
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['ledgerKeeper']
        }
    },

    {
        id: 'folk-hero-travel-rations',
        name: 'Ironwood Waybread (3 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Resinous waybread of pine-nut and tallow. Dense enough to survive the fog, plain enough to eat cold.',
        iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
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
        name: 'House Signet-Band',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A signet-band bearing your house crest, stamped in bog-iron. Proof of lineage, sealed in wax and memory.',
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
        name: 'House-Mantle',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'uncommon',
        description: 'A well-tailored mantle in your house colors, cut for the High Hearth and the petitioners line.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                physical: { level: 90, multiplier: 0.90, label: 'House Ward', color: '#6E6E6E' }
            }
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
        name: 'Lineage Tapestry-Strip',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A strip cut from your house great-tapestry, naming your line three generations back. Required at the Greymark gate.',
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
        name: 'Memory-Blossom Oil (vial)',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'uncommon',
        description: 'A vial of oil distilled from the memory-blossoms of the Reach. Lingers, and steadies the presence.',
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
        name: 'Synod Research Codex',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A codex of Synod-Hold issue, its pages ruled for cross-referencing across seven archives.',
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
        name: 'Archive Quill and Peat-Ink',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A bone-quill and a bottle of peat-ink that resists the damp of the deeper stacks.',
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
        name: 'Synod Scholar-Robe',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'The dark scholar-robe of Synod-Hold, pockets weighted for carrying rolled charts.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                rime: { level: 85, multiplier: 0.85, label: 'Vault Coat', color: '#2C5F7C' }
            }
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
        name: 'Ledger-Vellum Sheets (5)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Five sheets of bog-cured vellum that hold ink through fog and frost.',
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
        name: 'Sumps Campaign-Token',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A punched bog-iron token from your Sumps campaign. Some veterans still salute it.',
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
        name: 'Bone Campaign-Cards',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A worn deck of bone cards, used to settle debts and read fortunes in the ranks.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
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
        name: 'Sumps Issue-Wraps',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A patched set of Sumps-issue wraps, scarred by vat-glass and Wyrd-storm. Still fits.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                storm: { level: 85, multiplier: 0.85, label: 'Storm Guard', color: '#7E8E9F' }
            }
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
        name: 'Campaign Waybread (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Ironwood waybread pressed for the Sumps campaigns. Survives anything, tastes like nothing.',
        iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
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
        name: 'Neth Contract-Scale',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A precise bog-iron balance used to weigh memory-glass and verify contract-coin against forgery.',
        iconId: 'Misc/Profession Resources/Engineering/resource-compass-divider-drafting-tool',
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
        name: 'Memory-Glass Samples',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A velvet-lined case of small memory-glass chips, the standard Gloomway trader demonstration set.',
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
        name: 'Trade-Ledger',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A chain-bound ledger for recording contracts, debts, and the slow erosion of trust along the Gloomway.',
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
        name: 'Shanty Shiv',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A sharpened ironwood sliver, wrapped in rag. The first tool of anyone raised in the Over-Shanty hanging-slums.',
        iconId: 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown',
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
        name: 'Over-Shanty Sewer-Map',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A charcoal map of the Atropolis underside: which ropes hold, which drops kill, which gates can be bribed.',
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
        name: 'Bog-Sparrow',
        type: 'miscellaneous',
        subtype: 'PET',
        quality: 'common',
        description: 'A half-tame bog-sparrow that roosts in your collar. Eats the spiders, warns of the damp-rot.',
        iconId: 'Misc/Profession Resources/Cooking/animal-sparrow-bird-brown-mosaic-yellow-eye',
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
        name: 'Faded Name-Slip',
        type: 'miscellaneous',
        subtype: 'SENTIMENTAL',
        quality: 'common',
        description: 'A scrap of vellum with a parent name on it, the ink half-eaten by the fog. You cannot read it anymore, but you keep it.',
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
        name: 'Merrow Belaying-Peg',
        type: 'weapon',
        subtype: 'CLUB',
        quality: 'common',
        description: 'A stout ironwood peg for securing dock-line. Heavy enough to settle a tavern dispute.',
        iconId: 'Weapons/Mace/mace-wooden-club-brown-primitive',
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
        name: 'Salt-Sinew Line (50 ft)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Fifty feet of braided salt-sinew line. Holds in freezing spray where hempen rope would snap.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
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
        name: 'Salt-Luck Charm',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A Merryn salt-luck charm: a glass float, a knot, and a coin from a ship that came back. Kept close.',
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
        name: 'Cragjaw Snare-Trap',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A steel-cable snare for the peak-goats and worse that browse the Cragjaw ledges.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-dark-metallic-hook-curved',
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
        name: 'Peak Beast-Trophy',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A horn or pelt taken from a Cragjaw beast. Marks you as someone who feeds a hold, not drains it.',
        iconId: 'Misc/Monster Parts/Horns/horn-curved-brown-orange-segmented',
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
        name: 'Cragshaw Climb-Wraps',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Reinforced wraps of wind-leather and ironwood-bast, cut for vertical travel.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                physical: { level: 85, multiplier: 0.85, label: 'Climb-Reinforced', color: '#6E6E6E' }
            }
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
        name: 'Bog-Skin Flask',
        type: 'consumable',
        subtype: 'LIQUID',
        quality: 'common',
        description: 'A waxed flask that holds a day of meltwater from the glacier-runs.',
        iconId: 'Misc/Profession Resources/Cooking/pot-lidded-dome-brownish-beige',
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
        name: 'Loaded Bone-Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Bone dice weighted with bog-iron filings. The Neth contract-houses check for these; the Drun carry three sets.',
        iconId: 'Misc/Profession Resources/Cooking/plate-coin-octagonal-copper-token',
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
        name: 'Contract Forgery-Kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A roll of bog-iron styluses, wax-mix, and bleached vellum for replicating a contract-seal. Highly illegal in Atropolis.',
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
        name: 'Velun Pact-Robe',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A Velun Neth pact-robe of silvered silk, cut to impress and to obscure exactly which clause you are about to invoke.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            resistances: {
                storm: { level: 85, multiplier: 0.85, label: 'Storm Guard', color: '#7E8E9F' }
            }
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
        name: 'Face-Shift Compounds',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'Small pots of Mimir face-shift pigment and Drun veil-powder, for becoming someone the contract does not name.',
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
        name: 'Skald Throat-Harp',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A bone-frame throat-harp of Skald make, played against the sternum to carry over the glacier-wind.',
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
        name: 'Skald Favor-Token',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A carved favor-token from a saga-listener. Redeemable for a meal, a night, or a name-mention in an ongoing saga.',
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
        name: 'Saga-Vestments',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'The heavy fur-and-ironwood vestments of a Skald saga-keeper, marked with the knots of three bloodlines.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 4,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        combatStats: {
            resistances: {
                rime: { level: 85, multiplier: 0.85, label: 'Rime Guard', color: '#2C5F7C' }
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            charisma: { value: 1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['frostChanter']
        }
    },

    {
        id: 'entertainer-theatrical-makeup',
        name: 'Rime-Paint',
        type: 'consumable',
        subtype: 'COSMETIC',
        quality: 'common',
        description: 'A pot of Skald rime-paint, used to mark the saga-characters across the chanter face and hands.',
        iconId: 'Misc/Profession Resources/Cooking/pot-creamy-substance',
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
        name: 'Mycelium-testing kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A kit of bog-moss, ghost-mycelium tongs, and cold-water stills for working the fungal-deeps without breathing the hush.',
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
        id: 'hermit-herbal-sedatives',
        name: 'Herbal sedatives (3 doses)',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'Pungent herbal pastes that soothe the nervous system, used to stave off the twitching and anxiety of the hush.',
        iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-armor-chest-piece-butterfly-x-shaped-beige-green-yellow-band',
        value: { platinum: 0, gold: 1, silver: 50, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 3,
        availableFor: {
            backgrounds: ['hushSurvivor']
        }
    },

    {
        id: 'hermit-scroll-case',
        name: 'Sealed journal',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A leather-bound journal sealed with black resin wax, containing records of life before the hush.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
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
        name: 'Winter blanket',
        type: 'miscellaneous',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'A felted frost-wool wrap, the kind that sees a body through a bog-night when the trail goes dark.',
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
        name: 'Trail rations (5 days)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Dense bog-moss and tallow waybread. The hush takes appetite; this keeps the body fed when the mind forgets to eat.',
        iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
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
        name: 'Archive Ink-Bottle',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'A bottle of archival peat-ink, the kind that does not run when a Monolith vault weeps condensation.',
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
        name: 'Canopy-Quill',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A quill of ironwood-canopy fiber, standard-issue for Frozen Archive fieldwork.',
        iconId: 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft',
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
        name: 'Archive Vellum (10)',
        type: 'consumable',
        subtype: 'WRITING',
        quality: 'common',
        description: 'Ten sheets of bog-cured vellum ruled for Monolith-glyph transcription.',
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
        name: 'Monolith-Researcher Robe',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A preservative-waxed research robe, pockets fitted for lens, vellum, and a cold-iron ward.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        combatStats: {
            resistances: {
                rime: { level: 75, multiplier: 0.75, label: 'Rime Guard', color: '#2C5F7C' }
            }
        },
        baseStats: {
            intelligence: { value: 1, isPercentage: false },
            spirit: { value: 1, isPercentage: false },
            strength: { value: -1, isPercentage: false }
        },
        availableFor: {
            backgrounds: ['monolithHunter']
        }
    },

    {
        id: 'scholar-research-notes',
        name: 'Monolith Field-Notes',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A sheaf of field-notes: rubbing-copies of seven Monolith faces, and a list of the ones that screamed when read aloud.',
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
        iconId: 'Misc/Profession Resources/Enchanting/resource-blue-diamond-energy-core-vertical-device',
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
        iconId: 'Misc/Profession Resources/Tailoring/resource-spool-golden-brown-thread-twine',
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
        combatStats: {
            resistances: {
                storm: { level: 75, multiplier: 0.75, label: 'Storm Guard', color: '#7E8E9F' }
            }
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false },
            agility: { value: 1, isPercentage: false },
            strength: { value: -1, isPercentage: false }
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
        iconId: 'Misc/Profession Resources/Tools/satchel-pouch-brown-golden-buckle',
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
        iconId: 'Misc/Profession Resources/Cooking/plate-coin-octagonal-copper-token',
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
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
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
        iconId: 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown',
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
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-block-worn-cracked-brown',
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
        iconId: 'Misc/Profession Resources/Cooking/plate-coin-octagonal-copper-token',
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
        iconId: 'Misc/Profession Resources/Tools/satchel-pouch-brown-golden-buckle',
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
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
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

