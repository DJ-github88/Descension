/**
 * Background-Specific Starting Equipment
 * 
 * Items that are only available to specific character backgrounds.
 */

// ===== EMBERSPIRE PILGRIM =====
export const EMBERSPIRE_PILGRIM_ITEMS = [
    {
        id: 'acolyte-prayer-book',
        name: 'Sol\'s Breath Prayer-Leaf',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A palm-leaf of fire-resistant parchment inscribed with Sol\'s Breath vigils, worn smooth by a thousand dawn-prayers.',
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
        description: 'Cones of dried caldera-pine resin. Burned at dawn to catch the Sol\'s Breath last warmth; the smoke carries prayers into the deep.',
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
        description: 'A robe of Sundale ash-grey wool worn by Sol\'s Breath pilgrims on the Emberspire circuit.',
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
        description: 'A chained kit of quill, peat-ink, and binding-wax. The tools of a Tallyn ledger-keeper whose journal is their legal identity.',
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
        name: 'Lineage Weave-Strip',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A strip cut from your house lineage-weave, naming your line three generations back. Required at the Greymark gate.',
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
        description: 'A codex of Synod Hold issue, its pages ruled for cross-referencing across seven archives.',
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
        description: 'The dark scholar-robe of Synod Hold, pockets weighted for carrying rolled charts.',
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
        name: 'Athien Contract-Scale',
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
                damageType: 'stabbing'
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
                damageType: 'smashing'
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

// ===== NEGOTIATOR =====
export const DEBT_NEGOTIATOR_ITEMS = [
    {
        id: 'charlatan-weighted-dice',
        name: 'Loaded Bone-Dice',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Bone dice weighted with bog-iron filings. The Athien contract-houses check for these; the Riven carry three sets.',
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
        name: 'Athien Pact-Robe',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A Athien pact-robe of silvered silk, cut to impress and to obscure exactly which clause you are about to invoke.',
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
        description: 'Small pots of Mimir face-shift pigment and Riven veil-powder, for becoming someone the contract does not name.',
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
        combatStats: {
            manaRestore: { value: 10, isPercentage: false } // Restores 10 Mana when consumed
        },
        baseStats: {
            spirit: { value: 1, isPercentage: false } // Calms the nerves, +1 Spirit for the duration
        },
        utilityStats: {
            duration: { type: 'MINUTES', value: 5 } // Effect lasts 5 minutes
        },
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

export const FORGE_WRIGHT_ITEMS = [
    {
        id: 'forgeWright-smith-s-hammer',
        name: 'Smith\'s hammer',
        type: 'weapon',
        subtype: 'CLUB',
        quality: 'common',
        description: 'A balanced forge-hammer, its head worn to the exact weight your teacher favored. Metal remembers every strike it has made.',
        iconId: 'Misc/Profession Resources/Tools/claw-hammer',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['forgeWright']
        }
    },

    {
        id: 'forgeWright-forge-apron',
        name: 'Forge-apron',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Scorched leather apron stitched with guild-marks. It smells of quench-water and refuses to catch fire.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['forgeWright']
        }
    },

    {
        id: 'forgeWright-metal-sample-kit',
        name: 'Metal-sample kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A folding wallet of tested alloys, each labeled by ring and temper. Reading it is faster than testing a new ingot.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['forgeWright']
        }
    },

    {
        id: 'forgeWright-guild-letter-of-introduction',
        name: 'Guild letter of introduction',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A sealed letter that names you to any forge of your guild. Most doors open; some close.',
        iconId: 'Misc/Books/book-folded-letter-envelope',
        value: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['forgeWright']
        }
    }
];

export const GROVE_WARDEN_ITEMS = [
    {
        id: 'groveWarden-ghost-metal-warden-s-token',
        name: 'Ghost-metal warden\'s token',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A cold-worked disc of ghost-metal that dims near broken promises. The fae recognize it; most others cannot see it at all.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['groveWarden']
        }
    },

    {
        id: 'groveWarden-thorn-pruning-blade',
        name: 'Thorn-pruning blade',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A curved blade kept sharp enough to prune thorn-vines and defend the grove. The sap has stained it green.',
        iconId: 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['groveWarden']
        }
    },

    {
        id: 'groveWarden-moonlit-grove-route-cord',
        name: 'Moonlit-grove route-cord',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Knotted cord marking paths that only appear by moonlight. Untie a knot and the path forgets you.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['groveWarden']
        }
    },

    {
        id: 'groveWarden-fae-contract-tally-notched-bone',
        name: 'Fae-contract tally (notched bone)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'uncommon',
        description: 'A notched bone recording every promise the grove has witnessed. Each notch is a debt someone still owes.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['groveWarden']
        }
    },

    {
        id: 'groveWarden-traveler-s-clothes',
        name: 'Traveler\'s clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Practical layers for the mist-choked Reach, dyed in muted greens.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['groveWarden']
        }
    }
];

export const MASK_WARDEN_ITEMS = [
    {
        id: 'maskWarden-storm-glass-signal-whistle',
        name: 'Storm-glass signal-whistle',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A carved whistle whose note carries through fog. The Mimir watch-roads use its call; the Hunters have learned to fear it.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['maskWarden']
        }
    },

    {
        id: 'maskWarden-fog-spider-silk-rope-50ft',
        name: 'Fog-spider silk rope (50ft)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Rope spun from fog-spider silk: light, silent, and impossible to freeze solid.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['maskWarden']
        }
    },

    {
        id: 'maskWarden-spore-trail-reading-kit',
        name: 'Spore-trail reading kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Powders and a lens for reading spore-trails the mist leaves behind. Reveals what passed, and how long ago.',
        iconId: 'Misc/Profession Resources/Tools/satchel-pouch-brown-golden-buckle',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['maskWarden']
        }
    },

    {
        id: 'maskWarden-recovered-mask-shard-provenance-unknown',
        name: 'Recovered mask-shard (provenance unknown)',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A fragment of a Mimir relic recovered from a Hunter. It is warm to the touch, and you have never learned whose it was.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['maskWarden']
        }
    },

    {
        id: 'maskWarden-warded-traveler-s-cloak',
        name: 'Warded traveler\'s cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A cloak stitched with ward-knots that resist the mist and the eyes that hunt in it.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['maskWarden']
        }
    }
];

export const VAULT_SCHOLAR_ITEMS = [
    {
        id: 'vaultScholar-copper-plate-codex-water-damaged-for-cau',
        name: 'Copper-plate codex (water-damaged for Alchemite, pristine for Brasskin)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'uncommon',
        description: 'Guild knowledge on copper plates. Brasskin scholars keep it pristine; Alchemite scholars keep it working.',
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['vaultScholar']
        }
    },

    {
        id: 'vaultScholar-tinker-s-toolkit',
        name: 'Tinker\'s toolkit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Spanners, gear-pullers, and a calibration rule for any mechanism you can reach.',
        iconId: 'Misc/Profession Resources/Tools/claw-hammer',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['vaultScholar']
        }
    },

    {
        id: 'vaultScholar-blueprint-fragment-pages-3',
        name: 'Blueprint fragment-pages (3)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'Three pages of a design the guild would rather you had not memorized.',
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['vaultScholar']
        }
    },

    {
        id: 'vaultScholar-vault-pass-token-expired-or-forged',
        name: 'Vault-pass token (expired or forged)',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A stamped token that once opened a guild vault. The expiry is a technicality you have learned to argue.',
        iconId: 'Misc/Profession Resources/Cooking/plate-coin-octagonal-copper-token',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['vaultScholar']
        }
    },

    {
        id: 'vaultScholar-workman-s-clothes',
        name: 'Workman\'s clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Heavy cloth that sheds sparks and hides grease stains.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['vaultScholar']
        }
    }
];

export const HERD_GUARDIAN_ITEMS = [
    {
        id: 'herdGuardian-herder-s-staff-ironwood-core',
        name: 'Herder\'s staff (ironwood core)',
        type: 'weapon',
        subtype: 'CLUB',
        quality: 'common',
        description: 'A tall ironwood staff, both walking aid and weapon. The herd answers its tap before your voice.',
        iconId: 'Weapons/Mace/mace-wooden-club-brown-primitive',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 4,
        width: 1,
        height: 3,
        availableFor: {
            backgrounds: ['herdGuardian']
        }
    },

    {
        id: 'herdGuardian-whistle-braided-cord-10ft',
        name: 'Whistle-braided cord (10ft)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A braided cord that whistles in the wind; its pitch tells you where the herd has drifted.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['herdGuardian']
        }
    },

    {
        id: 'herdGuardian-winter-wraps-lined-with-shag-ox-wool',
        name: 'Winter-wraps (lined with shag-ox wool)',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Wool-lined wraps that keep the steppe wind off your skin.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 8, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['herdGuardian']
        }
    },

    {
        id: 'herdGuardian-trail-biscuits-7-days-rations',
        name: 'Trail-biscuits (7 days rations)',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Hard, dense travel-biscuits. They taste of the steppe and last through a blizzard.',
        iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 7,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['herdGuardian']
        }
    },

    {
        id: 'herdGuardian-herd-branding-iron',
        name: 'Herd-branding iron',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A branding iron that marks new calves into the family line. The herd remembers its shape.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-dark-metallic-hook-curved',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['herdGuardian']
        }
    }
];

export const STARBOUND_SCHOLAR_ITEMS = [
    {
        id: 'starboundScholar-memory-glass-shard-echo-lineage-encoded',
        name: 'Memory-glass shard (echo-lineage encoded)',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A shard of memory-glass carrying a fragment of an Astril echo-lineage. It hums when the bearer is calm.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['starboundScholar']
        }
    },

    {
        id: 'starboundScholar-crystal-resonance-bowl',
        name: 'Crystal resonance bowl',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A crystal bowl used to calibrate a host’s resonance. Struck correctly, it rings with a dead world’s note.',
        iconId: 'Misc/Profession Resources/Cooking/pot-lidded-dome-brownish-beige',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['starboundScholar']
        }
    },

    {
        id: 'starboundScholar-celestial-chart-bone-etched',
        name: 'Celestial chart (bone-etched)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A chart etched on bone, mapping the frequencies of a star that no longer exists.',
        iconId: 'Misc/Books/book-scroll-unrolled-textured-markings',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 2,
        height: 1,
        availableFor: {
            backgrounds: ['starboundScholar']
        }
    },

    {
        id: 'starboundScholar-synod-vestments',
        name: 'Synod vestments',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Layered vestments marking your rank within the Synod hierarchy.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['starboundScholar']
        }
    },

    {
        id: 'starboundScholar-ritual-incense-3-sticks',
        name: 'Ritual incense (3 sticks)',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Incense burned to steady a host during resonance work. The smoke carries the echo gently.',
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['starboundScholar']
        }
    }
];

export const DEEP_CURRENT_GUIDE_ITEMS = [
    {
        id: 'deepCurrentGuide-depth-pressure-gauge-myrathil-crafted',
        name: 'Depth-pressure gauge (Myrathil-crafted)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A Myrathil gauge that reads pressure as a color, not a number. It tells you when the deep is about to change.',
        iconId: 'Misc/Profession Resources/Engineering/resource-compass-divider-drafting-tool',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['deepCurrentGuide']
        }
    },

    {
        id: 'deepCurrentGuide-bioluminescent-lure-stone',
        name: 'Bioluminescent lure-stone',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A stone that glows when submerged, drawing the curious and warning the wise.',
        iconId: 'Armor/Neck/spiky-teal-gem-pendant',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['deepCurrentGuide']
        }
    },

    {
        id: 'deepCurrentGuide-cold-waxed-rope-silk-core-50ft',
        name: 'Cold-waxed rope (silk-core, 50ft)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Rope waxed against freezing water, with a silk core that does not stiffen in the cold.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 1, silver: 0, copper: 0 },
        weight: 5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['deepCurrentGuide']
        }
    },

    {
        id: 'deepCurrentGuide-waterproof-satchel',
        name: 'Waterproof satchel',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A sealed satchel that keeps cargo dry at any depth. It has never leaked.',
        iconId: 'Container/Bag/brown-satchel-buckle-strap',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        containerProperties: { isLocked: false, gridSize: { rows: 2, cols: 2 }, items: [] },
        availableFor: {
            backgrounds: ['deepCurrentGuide']
        }
    },

    {
        id: 'deepCurrentGuide-coral-needle-tool',
        name: 'Coral-needle tool',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A fine coral needle for splicing lines and repairing pressure gear.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['deepCurrentGuide']
        }
    }
];

export const FOG_READER_ITEMS = [
    {
        id: 'fogReader-fog-ward-compass-needle-follows-memory-c',
        name: 'Fog-ward compass (needle follows memory-currents)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A compass whose needle follows memory-currents instead of north. In the Frostwood, that is the only true direction.',
        iconId: 'Misc/Profession Resources/Engineering/resource-compass-divider-drafting-tool',
        value: { platinum: 0, gold: 12, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['fogReader']
        }
    },

    {
        id: 'fogReader-fog-spider-silk-trail-cord-30ft',
        name: 'Fog-spider silk trail-cord (30ft)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Silent silk cord laid behind you so you can find your way back through erased ground.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 2, copper: 0 },
        weight: 3,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['fogReader']
        }
    },

    {
        id: 'fogReader-soot-resin-ink-stick-marks-visible-in-fo',
        name: 'Soot-resin ink stick (marks visible in fog)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'An ink stick whose marks stay visible through the fog, for a while.',
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
        value: { platinum: 0, gold: 0, silver: 3, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['fogReader']
        }
    },

    {
        id: 'fogReader-breath-filtering-veil',
        name: 'Breath-filtering veil',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A veil that filters the worst of the fog’s spores and the memories it carries.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['fogReader']
        }
    },

    {
        id: 'fogReader-frostwood-traveler-s-cloak',
        name: 'Frostwood traveler\'s cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A heavy cloak that sheds fog and frost alike.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['fogReader']
        }
    }
];

export const KEEP_WARDEN_ITEMS = [
    {
        id: 'keepWarden-brass-watch-bell-kept-silent',
        name: 'Brass watch-bell (kept silent)',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'common',
        description: 'A brass watch-bell, muted so it rings only for you. Its pattern is the keep’s whole language of alarm.',
        iconId: 'Instruments/Drum/drum-brown-band',
        value: { platinum: 0, gold: 0, silver: 3, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['keepWarden']
        }
    },

    {
        id: 'keepWarden-frost-pipe-pressure-gauge',
        name: 'Frost-pipe pressure gauge',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A gauge that reads the frost-thick in the keep’s pipes. The needle creeping past the red line is the sound of a wall about to fail.',
        iconId: 'Misc/Profession Resources/Engineering/resource-compass-divider-drafting-tool',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['keepWarden']
        }
    },

    {
        id: 'keepWarden-sealed-keep-signet',
        name: 'Sealed keep-signet',
        type: 'accessory',
        subtype: 'RING',
        quality: 'uncommon',
        description: 'A signet that opens and seals the keep’s controlled gates. Losing it is a career-ending, possibly fatal, mistake.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['keepWarden']
        }
    },

    {
        id: 'keepWarden-wax-ration-tally',
        name: 'Wax ration tally',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A wax tablet tallying the keep’s stores against the winter. The numbers are always a little short.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['keepWarden']
        }
    },

    {
        id: 'keepWarden-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Plain layered clothes meant to be worn under a dozen others.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['keepWarden']
        }
    }
];

export const SPAN_BUILDER_ITEMS = [
    {
        id: 'spanBuilder-span-reader-s-resonance-rod',
        name: 'Span-reader\'s resonance rod',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'A bone rod that rings when struck against a span, telling you how many winters the crossing has left.',
        iconId: 'Weapons/Mace/mace-wooden-club-brown-primitive',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 3,
        availableFor: {
            backgrounds: ['spanBuilder']
        }
    },

    {
        id: 'spanBuilder-bone-mason-s-chisel-and-clamps',
        name: 'Bone-mason\'s chisel and clamps',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Chisels and clamps for mending calcified bone-work without cracking the span.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['spanBuilder']
        }
    },

    {
        id: 'spanBuilder-load-cord-knotted-tally',
        name: 'Load-cord (knotted tally)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A cord knotted to record the safe load of every span on your route.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['spanBuilder']
        }
    },

    {
        id: 'spanBuilder-harness-and-grapnel',
        name: 'Harness and grapnel',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A harness and grapnel for working the underside of a span. The fall is always one mistake away.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-dark-metallic-hook-curved',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 3,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['spanBuilder']
        }
    },

    {
        id: 'spanBuilder-traveler-s-clothes',
        name: 'Traveler\'s clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Sturdy clothes built for wind and stone.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['spanBuilder']
        }
    }
];

export const CONTRACT_CLERK_ITEMS = [
    {
        id: 'contractClerk-sealed-filing-quill',
        name: 'Sealed filing-quill',
        type: 'miscellaneous',
        subtype: 'WRITING',
        quality: 'uncommon',
        description: 'A quill sealed to your signature alone. A clause filed with it is filed as you.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['contractClerk']
        }
    },

    {
        id: 'contractClerk-bog-iron-inkpot-first-contract-grade',
        name: 'Bog-iron inkpot (First Contract grade)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Ink of bog-iron, the grade Morvane accepts. Cheaper ink is how clauses get lost.',
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
        value: { platinum: 0, gold: 6, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['contractClerk']
        }
    },

    {
        id: 'contractClerk-notary-s-ledger-water-stained',
        name: 'Notary\'s ledger (water-stained)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A working ledger of clauses you have filed. The water-stains are older than you and never quite dry.',
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['contractClerk']
        }
    },

    {
        id: 'contractClerk-memory-glass-reading-lens',
        name: 'Memory-glass reading lens',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A lens for reading the memory-glass panels of the Heart-Vault. It shows what a clause actually said, not what it says now.',
        iconId: 'Armor/Finger/finger-simple-teal-diamond-ring',
        value: { platinum: 0, gold: 10, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['contractClerk']
        }
    },

    {
        id: 'contractClerk-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Plain ink-stained clothes, cut for long hours at a lectern.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['contractClerk']
        }
    }
];

export const OBLIGATION_BROKER_ITEMS = [
    {
        id: 'obligationBroker-obligation-web-tally-knotted-cord',
        name: 'Obligation-web tally (knotted cord)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A knotted cord mapping the obligations you hold. Cut a knot and a debt changes hands.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['obligationBroker']
        }
    },

    {
        id: 'obligationBroker-set-of-marked-fate-coins',
        name: 'Set of marked fate-coins',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'Coins marked to track which way a fate-thread is leaning. They are never wrong, only late.',
        iconId: 'Misc/Profession Resources/Cooking/plate-coin-octagonal-copper-token',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['obligationBroker']
        }
    },

    {
        id: 'obligationBroker-registry-writ-loan-against-a-future',
        name: 'Registry writ (loan against a future)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A writ lending against a future that has not happened yet. The interest is measured in years of your life.',
        iconId: 'Misc/Books/book-scroll-pinned-text-thumbtack',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['obligationBroker']
        }
    },

    {
        id: 'obligationBroker-debt-knife-ceremonial',
        name: 'Debt-knife (ceremonial)',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A ceremonial knife used to cut a knot rather than a throat. In the right hands, both.',
        iconId: 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['obligationBroker']
        }
    },

    {
        id: 'obligationBroker-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Quiet clothes for a trade done in the seams of the law.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['obligationBroker']
        }
    }
];

export const GREYMARK_ARCHIVIST_ITEMS = [
    {
        id: 'greymarkArchivist-waxed-lineage-tapestry-swatch',
        name: 'Waxed lineage-tapestry swatch',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'uncommon',
        description: 'A waxed swatch of the lineage-tapestries carrying a family’s names. It is proof the fog cannot erase.',
        iconId: 'Misc/Books/book-bundle-papers-tied-string',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 0.5,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['greymarkArchivist']
        }
    },

    {
        id: 'greymarkArchivist-archivist-s-recording-quill',
        name: 'Archivist\'s recording quill',
        type: 'miscellaneous',
        subtype: 'WRITING',
        quality: 'uncommon',
        description: 'A quill that records a name as it is spoken. What it writes, Greymark keeps.',
        iconId: 'Misc/Books/book-open-quill-pen-cream-pages',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['greymarkArchivist']
        }
    },

    {
        id: 'greymarkArchivist-bog-iron-inkpot-record-grade',
        name: 'Bog-iron inkpot (record grade)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'Ink that does not fade, for records meant to outlast the fog.',
        iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle',
        value: { platinum: 0, gold: 4, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['greymarkArchivist']
        }
    },

    {
        id: 'greymarkArchivist-index-cord-knotted-name-tally',
        name: 'Index-cord (knotted name tally)',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'common',
        description: 'A cord knotted to index the names you have memorized. Recite a knot and the lineage unfolds.',
        iconId: 'Misc/Profession Resources/Tailoring/resource-coiled-brown-rope-hemp',
        value: { platinum: 0, gold: 0, silver: 1, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['greymarkArchivist']
        }
    },

    {
        id: 'greymarkArchivist-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Ink-stained clothes worn thin by long nights of copying.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['greymarkArchivist']
        }
    }
];

export const PRIVATEER_ITEMS = [
    {
        id: 'privateer-water-stained-letter-of-marque',
        name: 'Water-stained letter-of-marque',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'uncommon',
        description: 'A commission authorizing you to take what the Board cannot protect. One clause is quietly forged.',
        iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['privateer']
        }
    },

    {
        id: 'privateer-prize-share-ledger-tattoo-inked',
        name: 'Prize-share ledger (tattoo-inked)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A ledger recording every crewmate’s share of every prize. The ink matches the tattoos on their arms.',
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['privateer']
        }
    },

    {
        id: 'privateer-boarding-axe',
        name: 'Boarding axe',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A short boarding axe for cutting rigging and repelling boarders. It has done both, often in the same minute.',
        iconId: 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['privateer']
        }
    },

    {
        id: 'privateer-storm-lane-chart',
        name: 'Storm-lane chart',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A chart of the storm-lanes that hide a raid. The Board has a copy; yours is newer.',
        iconId: 'Misc/Books/book-treasure-map-island',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 1,
        width: 2,
        height: 1,
        availableFor: {
            backgrounds: ['privateer']
        }
    },

    {
        id: 'privateer-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Salt-stiff clothes that have seen more decks than beds.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['privateer']
        }
    }
];

export const NAMELESS_ITEMS = [
    {
        id: 'nameless-borrowed-identity-papers',
        name: 'Borrowed identity papers',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'uncommon',
        description: 'Papers in a name that is not yours, good enough to pass a bored clerk and no one else.',
        iconId: 'Misc/Books/book-folded-letter-envelope',
        value: { platinum: 0, gold: 5, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['nameless']
        }
    },

    {
        id: 'nameless-forgery-kit',
        name: 'Forgery kit',
        type: 'miscellaneous',
        subtype: 'TOOL',
        quality: 'uncommon',
        description: 'Seals, inks, and a steady hand for making a name exist on paper. The most valuable thing you own.',
        iconId: 'Misc/Profession Resources/Tools/satchel-pouch-brown-golden-buckle',
        value: { platinum: 0, gold: 15, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['nameless']
        }
    },

    {
        id: 'nameless-severance-token-null-iron',
        name: 'Severance token (null-iron)',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A null-iron token marking a soul struck from the First Contract. The Registry cannot read it; neither can Morvane.',
        iconId: 'Misc/Profession Resources/Blacksmithing/resource-three-dark-nails-metallic',
        value: { platinum: 0, gold: 3, silver: 0, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['nameless']
        }
    },

    {
        id: 'nameless-peat-hooded-cloak',
        name: 'Peat-hooded cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A peat-dyed cloak that hides a face no ledger remembers.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 2,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['nameless']
        }
    },

    {
        id: 'nameless-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Unremarkable clothes for someone who cannot afford to be remembered.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['nameless']
        }
    }
];

export const CRYPT_KEEPER_ITEMS = [
    {
        id: 'cryptKeeper-ancestral-light-lantern',
        name: 'Ancestral-light lantern',
        type: 'accessory',
        subtype: 'TRINKET',
        quality: 'uncommon',
        description: 'A lantern housing a cultured ancestral glow. It lights a crypt the way the dead prefer: softly, and without judgment.',
        iconId: 'Misc/Profession Resources/Cooking/pot-lidded-dome-brownish-beige',
        value: { platinum: 0, gold: 8, silver: 0, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        availableFor: {
            backgrounds: ['cryptKeeper']
        }
    },

    {
        id: 'cryptKeeper-crypt-row-ledger-bark-bound',
        name: 'Crypt-row ledger (bark-bound)',
        type: 'miscellaneous',
        subtype: 'DOCUMENT',
        quality: 'common',
        description: 'A bark-bound ledger of every light in your rows, and which have gone dark.',
        iconId: 'Misc/Books/book-brown-red-emblem-clasp',
        value: { platinum: 0, gold: 2, silver: 0, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['cryptKeeper']
        }
    },

    {
        id: 'cryptKeeper-root-veil-warding-salts',
        name: 'Root-Veil warding salts',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'Salts that seal a crypt row against the Root-Veil. Use sparingly; the Veil notices.',
        iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-armor-chest-piece-butterfly-x-shaped-beige-green-yellow-band',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['cryptKeeper']
        }
    },

    {
        id: 'cryptKeeper-funeral-veil',
        name: 'Funeral veil',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A mourning veil worn while tending the dead. It doubles as a filter against spores.',
        iconId: 'Armor/Cloak/cloak-simple-brown-cape',
        value: { platinum: 0, gold: 0, silver: 3, copper: 0 },
        weight: 1,
        width: 1,
        height: 1,
        availableFor: {
            backgrounds: ['cryptKeeper']
        }
    },

    {
        id: 'cryptKeeper-common-clothes',
        name: 'Common clothes',
        type: 'armor',
        subtype: 'CLOTHING',
        quality: 'common',
        description: 'Dark, practical clothes that do not show crypt-damp.',
        iconId: 'Armor/Chest/chest-simple-tan-tunic',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 1,
        width: 2,
        height: 2,
        availableFor: {
            backgrounds: ['cryptKeeper']
        }
    }
];

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
    ...FORGE_WRIGHT_ITEMS,
    ...GROVE_WARDEN_ITEMS,
    ...MASK_WARDEN_ITEMS,
    ...VAULT_SCHOLAR_ITEMS,
    ...HERD_GUARDIAN_ITEMS,
    ...STARBOUND_SCHOLAR_ITEMS,
    ...DEEP_CURRENT_GUIDE_ITEMS,
    ...FOG_READER_ITEMS,
    ...KEEP_WARDEN_ITEMS,
    ...SPAN_BUILDER_ITEMS,
    ...CONTRACT_CLERK_ITEMS,
    ...OBLIGATION_BROKER_ITEMS,
    ...GREYMARK_ARCHIVIST_ITEMS,
    ...PRIVATEER_ITEMS,
    ...NAMELESS_ITEMS,
    ...CRYPT_KEEPER_ITEMS,

    // ===== BACKGROUND CURRENCY POUCHES =====
    {
        id: 'acolyte-currency-pouch',
        name: 'Temple Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A Sol\'s Breath-sealed pouch containing 15 gold pieces from the Dawn Vigil offering-box. Can be sold for its full value.',
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

    {
        id: 'criminal-currency-pouch',
        name: 'Ill-gotten Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A basalt-dusted pouch containing 15 gold pieces from Shyr Cartel runs. Can be sold for its full value.',
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
        description: 'A fog-grey pouch containing 10 gold pieces from Tallyn ledger-stipends. Can be sold for its full value.',
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
        description: 'A crystal-threaded pouch containing 10 gold pieces from Synod Hold research grants. Can be sold for its full value.',
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
        description: 'A campaign-stamped pouch containing 10 gold pieces from Bloodhammer sump-pay. Can be sold for its full value.',
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
        description: 'A salt-stained pouch containing 10 gold pieces from Iceheart trade-shares. Can be sold for its full value.',
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
    },

    {
        id: 'chasm-delver-currency-pouch',
        name: 'Chasm-Dweller Pouch with 10g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A heat-sealed pouch containing 10 gold pieces from deep-vent maintenance stipends. Can be sold for its full value.',
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
            backgrounds: ['chasmDelver']
        }
    },

    {
        id: 'brine-trader-currency-pouch',
        name: 'Syndicate Pouch with 15g',
        type: 'miscellaneous',
        subtype: 'CONTAINER',
        quality: 'common',
        description: 'A Brine-Bond sealed pouch containing 15 gold pieces from coastal trade margins. Can be sold for its full value.',
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
            backgrounds: ['brineTrader']
        }
    }

];

