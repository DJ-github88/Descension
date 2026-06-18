/**
 * Starting Equipment Data Module
 *
 * Comprehensive library of items available during character creation.
 * Items are filtered based on character's class, race, subrace, path, and background.
 *
 * Item availability system:
 * - universal: Available to all characters
 * - class-specific: Only available to certain classes
 * - race-specific: Only available to certain races
 * - path-specific: Only available to certain paths
 * - background-specific: Only available to certain backgrounds
 */

import { ALL_CLASS_EQUIPMENT } from './equipment/classEquipment';
import { ALL_RACE_EQUIPMENT } from './equipment/raceEquipment';
import { ALL_BACKGROUND_EQUIPMENT } from './equipment/backgroundEquipment';

// ===== UNIVERSAL ITEMS - Available to All Characters =====

export const UNIVERSAL_STARTING_ITEMS = [
    // Basic Weapons
    {
        id: 'starter-dagger',
        name: 'Bog-Iron Shank',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A crude shank of bog-iron. The fog clings to it, and the cold with it.',
        iconId: 'inv_weapon_shortblade_05',
        value: { platinum: 0, gold: 1, silver: 75, copper: 50 },
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
            universal: true
        }
    },

    {
        id: 'starter-shortsword',
        name: 'Wayfarer Gladius',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'An ironwood-hilted gladius, worn smooth by long roads across the Reach.',
        iconId: 'inv_sword_04',
        value: { platinum: 0, gold: 4, silver: 50, copper: 0 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
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
            universal: true
        }
    },

    {
        id: 'starter-quarterstaff',
        name: 'Ironwood Cane',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'common',
        description: 'A length of dense ironwood. Favored by scribes and pact-mages who walk the fog-lines.',
        iconId: 'inv_staff_13',
        value: { platinum: 0, gold: 0, silver: 80, copper: 25 },
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
        availableFor: {
            universal: true
        }
    },
    
    // Basic Armor
    {
        id: 'starter-leather-armor',
        name: 'Bog-Tanned Jerkin',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Boiled in peat-acid, this jerkin protects without slowing the wearer. Smokes faintly in the damp.',
        iconId: 'inv_chest_leather_01',
        value: { platinum: 0, gold: 7, silver: 25, copper: 75 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 2, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-padded-armor',
        name: 'Fog-Weave Wraps',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Quilted rough wool treated against the damp. The cheapest defense against a cold that bites through plain cloth.',
        iconId: 'inv_chest_cloth_01',
        value: { platinum: 0, gold: 4, silver: 60, copper: 0 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },
    
    // Containers
    {
        id: 'starter-backpack',
        name: 'Ironwood Frame-Pack',
        type: 'container',
        subtype: 'BACKPACK',
        quality: 'common',
        description: 'A bog-preserved ironwood frame-pack, built to carry a ledger and a life across the Reach.',
        iconId: 'inv_misc_bag_08',
        value: { platinum: 0, gold: 1, silver: 85, copper: 50 },
        weight: 5,
        width: 2,
        height: 2,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 4, cols: 4 },
            items: []
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-belt-pouch',
        name: 'Scribe Belt-Pouch',
        type: 'container',
        subtype: 'POUCH',
        quality: 'common',
        description: 'A small peat-tanned pouch that hooks to the belt. Most carry their name-ledger in it.',
        iconId: 'inv_misc_bag_10',
        value: { platinum: 0, gold: 0, silver: 45, copper: 75 },
        weight: 1,
        width: 1,
        height: 1,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 2, cols: 2 },
            items: []
        },
        availableFor: {
            universal: true
        }
    },
    
    // Consumables
    {
        id: 'starter-health-potion',
        name: 'Peat-Tincture',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A vial of dark, peat-filtered tincture. Numbs pain and knits flesh, modestly. Tastes of bog and iron.',
        iconId: 'inv_potion_51',
        value: { platinum: 0, gold: 4, silver: 75, copper: 25 },
        weight: 0.5,
        combatStats: {
            healthRestore: { value: 25, isPercentage: false }
        },
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-rations',
        name: 'Ironwood Waybread',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Dense, resinous waybread of pine-nut and tallow. A thumb-sized piece lasts a day on the trail.',
        iconId: 'inv_misc_food_wheat_01',
        value: { platinum: 0, gold: 0, silver: 5, copper: 0 },
        weight: 0.5,
        combatStats: {
            healthRestore: { value: 15, isPercentage: false }
        },
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 20,
        availableFor: {
            universal: true
        }
    },
    
    {
        id: 'starter-waterskin',
        name: 'Bog-Skin Flask',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A waxed leather flask. Holds a day of water, or something stronger to keep the cold out.',
        iconId: 'inv_drink_05',
        value: { platinum: 0, gold: 0, silver: 18, copper: 50 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-torch',
        name: 'Pitch-Pine Torch',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A pitch-soaked torch. Burns an hour in the fog, the only warm light for a mile.',
        iconId: 'inv_misc_torch_01',
        value: { platinum: 0, gold: 0, silver: 8, copper: 75 },
        weight: 1,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: true,
        maxStackSize: 20,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-rope',
        name: 'Ironwood-Bast Cord',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Braided cord of ironwood-bast fiber. Sturdy enough to haul a body from a bog-shaft.',
        iconId: 'inv_misc_rope_01',
        value: { platinum: 0, gold: 0, silver: 1, copper: 90 },
        weight: 0.2,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 100,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-bedroll',
        name: 'Frost-Wool Roll',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A roll of frost-wool felted against the cold. Sleep in the open is dangerous; this makes it less so.',
        iconId: 'inv_misc_pelt_14',
        value: { platinum: 0, gold: 0, silver: 90, copper: 0 },
        weight: 7,
        width: 2,
        height: 1,
        rotation: 0,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },
    
    // Accessories
    {
        id: 'starter-simple-ring',
        name: 'Ledger-Band',
        type: 'accessory',
        subtype: 'RING',
        quality: 'common',
        description: 'A plain iron band etched with a lineage-mark. Some swear it steadies the constitution.',
        iconId: 'inv_jewelry_ring_01',
        value: { platinum: 0, gold: 0, silver: 75, copper: 50 },
        weight: 0.1,
        width: 1,
        height: 1,
        slots: ['ring1', 'ring2'],
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    // Additional Weapons
    {
        id: 'starter-handaxe',
        name: 'Wood-Ward Hatchet',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A one-handed ironwood hatchet, balanced to throw. Splits skulls as readily as firewood.',
        iconId: 'inv_axe_02',
        value: { platinum: 0, gold: 2, silver: 80, copper: 25 },
        weight: 2,
        width: 1,
        height: 2,
        slots: ['mainHand', 'offHand'],
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
            universal: true
        }
    },

    {
        id: 'starter-mace',
        name: 'Cold-Iron Mace',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A blunt mace of cold-iron. The Wyrd flinches from its touch; armor does not.',
        iconId: 'inv_mace_01',
        value: { platinum: 0, gold: 3, silver: 65, copper: 0 },
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
                damageType: 'physical'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-spear',
        name: 'Ironwood Spear',
        type: 'weapon',
        subtype: 'POLEARM',
        quality: 'common',
        description: 'A seven-foot ironwood haft tipped with bog-iron. Reach is life in the fog.',
        iconId: 'inv_spear_01',
        value: { platinum: 0, gold: 2, silver: 90, copper: 50 },
        weight: 3,
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
            universal: true
        }
    },

    {
        id: 'starter-crossbow',
        name: 'Fog-Lock Bow',
        type: 'weapon',
        subtype: 'CROSSBOW',
        quality: 'common',
        description: 'A crank-drawn crossbow. Slower than a bow, but reliable when the fog hides your target.',
        iconId: 'inv_weapon_crossbow_01',
        value: { platinum: 0, gold: 5, silver: 50, copper: 75 },
        weight: 5,
        width: 2,
        height: 2,
        slots: ['mainHand'],
        weaponSlot: 'TWO_HANDED',
        hand: 'TWO_HAND',
        weaponStats: {
            baseDamage: {
                diceCount: 1,
                diceType: 8,
                damageType: 'physical'
            }
        },
        availableFor: {
            universal: true
        }
    },

    // Additional Armor
    {
        id: 'starter-hide-armor',
        name: 'Frost-Bear Mantle',
        type: 'armor',
        subtype: 'MEDIUM',
        quality: 'common',
        description: 'A crude mantle of thick frost-bear pelt. Reeks of the kill, but turns a claw.',
        iconId: 'inv_chest_leather_04',
        value: { platinum: 0, gold: 5, silver: 40, copper: 50 },
        weight: 12,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 3, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-chain-shirt',
        name: 'Bog-Forged Hauberk',
        type: 'armor',
        subtype: 'MEDIUM',
        quality: 'common',
        description: 'Interlocking ironwood-rings over peat-tanned backing. Heavy, but the bog-forged links do not rust.',
        iconId: 'inv_chest_chain_01',
        value: { platinum: 0, gold: 9, silver: 25, copper: 0 },
        weight: 20,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 4, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-shield',
        name: 'Ironwood Targe',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'common',
        description: 'A banded ironwood shield. The wood of the Reach does not splinter easily.',
        iconId: 'inv_shield_01',
        value: { platinum: 0, gold: 4, silver: 80, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        slots: ['offHand'],
        armor: 2,
        baseStats: {
            constitution: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    // Additional Consumables
    {
        id: 'starter-antitoxin',
        name: 'Hush-Antidote Phial',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A phial of bitter moss-ash distillate. Holds hush-spores and bog-venoms at bay for an hour.',
        iconId: 'inv_potion_20',
        value: { platinum: 0, gold: 4, silver: 60, copper: 50 },
        weight: 0.5,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 3,
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-oil-flask',
        name: 'Bog-Oil Flask',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'A flask of thick bog-oil. Fuels a lantern, or greases a terrible death when lit and thrown.',
        iconId: 'inv_potion_04',
        value: { platinum: 0, gold: 0, silver: 8, copper: 25 },
        weight: 1,
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        availableFor: {
            universal: true
        }
    },

    // Additional Miscellaneous
    {
        id: 'starter-tinderbox',
        name: 'Pyre-Tin',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Flint, bog-steel, and dried moss-tinder in a tin. Fire is life in a world that wants you cold.',
        iconId: 'inv_misc_box_01',
        value: { platinum: 0, gold: 0, silver: 45, copper: 80 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-grappling-hook',
        name: 'Bog-Iron Grapple',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A three-pronged bog-iron hook. Climbing out of a peat-shaft is a skill, not a hope.',
        iconId: 'inv_misc_hook_01',
        value: { platinum: 0, gold: 1, silver: 85, copper: 0 },
        weight: 4,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-healers-kit',
        name: 'Field-Suture Kit',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A peat-tanned roll of moss-lint, bone-splints, and cold-water salves. Ten uses before the moss dries out.',
        iconId: 'inv_misc_bag_14',
        value: { platinum: 0, gold: 4, silver: 70, copper: 25 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'medical',
        origin: 'Local',
        demandLevel: 'High',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-manacles',
        name: 'Cold-Iron Shackles',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Cold-iron shackles for prisoners, or the Wyrd-touched. Comes with a key.',
        iconId: 'inv_misc_key_05',
        value: { platinum: 0, gold: 1, silver: 90, copper: 50 },
        weight: 6,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-spellbook-blank',
        name: 'Blank Ledger-Grimoire',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A bog-preserved book of blank vellum. For recording spells, oaths, or the names of the dead.',
        iconId: 'inv_misc_book_01',
        value: { platinum: 0, gold: 9, silver: 50, copper: 0 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'scholarly',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Camping & Survival Gear
    {
        id: 'starter-tent',
        name: 'Frost-Wool Pavilion',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A two-soul tent of waxed frost-wool. Shelter enough to outlast a bog-storm.',
        iconId: 'inv_misc_pelt_13',
        value: { platinum: 0, gold: 1, silver: 85, copper: 75 },
        weight: 20,
        width: 3,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-blanket',
        name: 'Frost-Wool Blanket',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A thick frost-wool blanket. The difference between waking and freezing in the small hours.',
        iconId: 'inv_misc_pelt_11',
        value: { platinum: 0, gold: 0, silver: 45, copper: 50 },
        weight: 3,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-mess-kit',
        name: 'Trail-Mess Tin',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A tin box with cup, plate, and ironwood spoon. Hot food is morale on the peat.',
        iconId: 'inv_misc_food_99',
        value: { platinum: 0, gold: 0, silver: 18, copper: 25 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-cooking-pot',
        name: 'Bog-Iron Pot',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A sturdy bog-iron pot for boiling waybread or rendering tallow over camp-coals.',
        iconId: 'inv_misc_cauldron_01',
        value: { platinum: 0, gold: 1, silver: 75, copper: 50 },
        weight: 10,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-fishing-tackle',
        name: 'Iceheart Tackle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'An ironwood rod, braided sinew-line, and bone hooks. The Iceheart keeps giving, if you wait.',
        iconId: 'inv_fishingpole_01',
        value: { platinum: 0, gold: 0, silver: 95, copper: 0 },
        weight: 4,
        width: 1,
        height: 3,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Tools & Equipment
    {
        id: 'starter-hammer',
        name: 'Ironwood Mallet',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A one-handed mallet for pitons and tent-stakes. Doubles as a bludgeon in a pinch.',
        iconId: 'inv_hammer_01',
        value: { platinum: 0, gold: 0, silver: 95, copper: 25 },
        weight: 3,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-piton',
        name: 'Bog-Iron Piton',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A bog-iron spike. The only thing between you and the bottom of a crevasse.',
        iconId: 'inv_misc_nail_01',
        value: { platinum: 0, gold: 0, silver: 4, copper: 50 },
        weight: 0.25,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 50,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-crowbar',
        name: 'Bog-Iron Prise',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A bog-iron crowbar. Pries doors, crates, and the occasional sealed barrow.',
        iconId: 'inv_misc_wrench_01',
        value: { platinum: 0, gold: 1, silver: 85, copper: 0 },
        weight: 5,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-lantern',
        name: 'Hooded Bog-Lantern',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A hooded iron lantern. Burns six hours on a pint of bog-oil; the shutters save the wick in wind.',
        iconId: 'inv_misc_lantern_01',
        value: { platinum: 0, gold: 4, silver: 75, copper: 50 },
        weight: 2,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-oil-flask',
        name: 'Lantern Bog-Oil',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A pint of bog-oil for lanterns. Can also be lit and thrown in a pinch.',
        iconId: 'inv_potion_03',
        value: { platinum: 0, gold: 0, silver: 9, copper: 50 },
        weight: 1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Writing & Scholarly Supplies
    {
        id: 'starter-ink-pen',
        name: 'Quill-Stylus',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A quill-stylus for ledger-work. Scribe-sentinels carry three; the fog takes the first two.',
        iconId: 'inv_feather_12',
        value: { platinum: 0, gold: 0, silver: 1, copper: 75 },
        weight: 0.1,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 10,
        tradeCategory: 'scholarly',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-ink-bottle',
        name: 'Peat-Ink Bottle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small bottle of black peat-ink. Resists damp where common ink would run.',
        iconId: 'inv_potion_01',
        value: { platinum: 0, gold: 0, silver: 9, copper: 25 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        tradeCategory: 'scholarly',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-parchment',
        name: 'Ledger-Vellum',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A sheet of bog-cured vellum. Holds ink through fog and frost alike.',
        iconId: 'inv_scroll_03',
        value: { platinum: 0, gold: 0, silver: 1, copper: 85 },
        weight: 0.05,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 100,
        tradeCategory: 'scholarly',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-journal',
        name: 'Chain-Bound Journal',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A blank journal, chain-bound so it cannot be lost. In the Reach, your journal is your legal identity.',
        iconId: 'inv_misc_book_05',
        value: { platinum: 0, gold: 2, silver: 40, copper: 75 },
        weight: 1,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'scholarly',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Adventuring Gear
    {
        id: 'starter-mirror',
        name: 'Polished Talsite',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A hand-sized polished talsite plate. Reflects poorly, survives drops, and sees around fog-corners.',
        iconId: 'inv_misc_gem_pearl_05',
        value: { platinum: 0, gold: 4, silver: 85, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-chain',
        name: 'Cold-Iron Chain',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Cold-iron links, sold by the foot. Holds prisoners, anchors traps, and turns the Wyrd.',
        iconId: 'inv_misc_chain_01',
        value: { platinum: 0, gold: 0, silver: 47, copper: 50 },
        weight: 1,
        width: 2,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 50,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-spyglass',
        name: 'Fog-Glass',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'uncommon',
        description: 'A brass fog-glass. Cuts a mile of fog down to a hundred yards, on a clear hour.',
        iconId: 'inv_misc_spyglass_01',
        value: { platinum: 0, gold: 95, silver: 50, copper: 0 },
        weight: 1,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Fine',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-compass',
        name: 'Ledger-Compass',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple magnetic compass. In the Reach, some trust these more than their own fog-eaten memory.',
        iconId: 'inv_misc_pocketwatch_01',
        value: { platinum: 0, gold: 24, silver: 75, copper: 50 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: false,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Clothing & Accessories
    {
        id: 'starter-cloak',
        name: 'Wayfarer Fog-Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A heavy waxed cloak of fog-grey wool. Turns rain, dulls the wind, and hides the wearer at a distance.',
        iconId: 'inv_misc_cape_01',
        value: { platinum: 0, gold: 0, silver: 95, copper: 50 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-boots',
        name: 'Bog-Walker Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'High peat-tanned boots with ironwood soles. The mud of the Reach has swallowed lesser footwear.',
        iconId: 'inv_boots_cloth_01',
        value: { platinum: 0, gold: 1, silver: 40, copper: 75 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['feet'],
        combatStats: {
            armor: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-gloves',
        name: 'Scribe Work-Gloves',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Simple peat-tanned gloves. Protect the hands that hold the quill and the blade alike.',
        iconId: 'inv_gauntlets_04',
        value: { platinum: 0, gold: 0, silver: 75, copper: 25 },
        weight: 1,
        width: 1,
        height: 1,
        slots: ['hands'],
        availableFor: {
            universal: true
        }
    },

    // Musical Instruments
    {
        id: 'starter-flute',
        name: 'Bone Flute',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple flute carved from frost-elk bone. Minstrel-work, or just a tune against the silence.',
        iconId: 'inv_misc_flute_01',
        value: { platinum: 0, gold: 1, silver: 85, copper: 50 },
        weight: 1,
        width: 1,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'entertainment',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-drum',
        name: 'Hide Frame-Drum',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small one-handed frame-drum of frost-bear hide. March-cadence and war-signal, in one.',
        iconId: 'inv_misc_drum_01',
        value: { platinum: 0, gold: 5, silver: 75, copper: 0 },
        weight: 3,
        width: 2,
        height: 2,
        rotation: 0,
        stackable: false,
        tradeCategory: 'entertainment',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    // Miscellaneous Useful Items
    {
        id: 'starter-bell',
        name: 'Cold-Iron Bell',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small cold-iron bell. An alarm, or a ward; the Wyrd dislikes its tone.',
        iconId: 'inv_misc_bell_01',
        value: { platinum: 0, gold: 0, silver: 95, copper: 0 },
        weight: 0.5,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 5,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-candle',
        name: 'Tallow Candle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A tallow candle. Burns an hour. Cheaper than a torch, dimmer, and useless in wind.',
        iconId: 'inv_misc_candle_01',
        value: { platinum: 0, gold: 0, silver: 0, copper: 95 },
        weight: 0.05,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 100,
        tradeCategory: 'camping',
        origin: 'Local',
        demandLevel: 'Moderate',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-chalk',
        name: 'Bog-Chalk',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A stick of pale bog-chalk for marking stone. Scribe-sentinels mark every turning; the fog unmarks the rest.',
        iconId: 'inv_stone_15',
        value: { platinum: 0, gold: 0, silver: 0, copper: 10 },
        weight: 0.05,
        width: 1,
        height: 1,
        rotation: 0,
        stackable: true,
        maxStackSize: 100,
        tradeCategory: 'tools',
        origin: 'Local',
        demandLevel: 'Low',
        qualityGrade: 'Standard',
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-sack',
        name: 'Peat-Sack',
        type: 'container',
        subtype: 'BAG',
        quality: 'common',
        description: 'A large rough-woven sack of bog-hemp. Carries loose salvage, or a body, if it comes to that.',
        iconId: 'inv_misc_bag_15',
        value: { platinum: 0, gold: 0, silver: 1, copper: 50 },
        weight: 0.5,
        width: 2,
        height: 2,
        containerProperties: {
            isLocked: false,
            gridSize: { rows: 3, cols: 3 },
            items: []
        },
        availableFor: {
            universal: true
        }
    }
];

// Export the main library combining all equipment sources
export const STARTING_EQUIPMENT_LIBRARY = [
    ...UNIVERSAL_STARTING_ITEMS,
    ...ALL_CLASS_EQUIPMENT,
    ...ALL_RACE_EQUIPMENT,
    ...ALL_BACKGROUND_EQUIPMENT
];

/**
 * Get all items available for a character based on their selections
 * @param {Object} characterData - Character's selections (class, race, subrace, path, background)
 * @returns {Array} Filtered array of available items
 */
export const getAvailableStartingItems = (characterData) => {
    const { class: charClass, race, subrace, path, background } = characterData;

    return STARTING_EQUIPMENT_LIBRARY.filter(item => {
        const availability = item.availableFor;

        // Universal items are always available
        if (availability.universal) {
            return true;
        }

        // Check class availability
        if (availability.classes && !availability.classes.includes(charClass)) {
            return false;
        }

        // Check race availability
        if (availability.races && !availability.races.includes(race)) {
            return false;
        }

        // Check subrace availability
        if (availability.subraces && !availability.subraces.includes(subrace)) {
            return false;
        }

        // Check path availability
        if (availability.paths && !availability.paths.includes(path)) {
            return false;
        }

        // Check background availability
        if (availability.backgrounds && !availability.backgrounds.includes(background)) {
            return false;
        }

        return true;
    });
};

/**
 * Get items organized by category for display
 * @param {Object} characterData - Character's selections
 * @returns {Object} Items organized by type
 */
export const getItemsByCategory = (characterData) => {
    const availableItems = getAvailableStartingItems(characterData);

    return {
        weapons: availableItems.filter(item => item.type === 'weapon'),
        armor: availableItems.filter(item => item.type === 'armor'),
        accessories: availableItems.filter(item => item.type === 'accessory'),
        containers: availableItems.filter(item => item.type === 'container'),
        consumables: availableItems.filter(item => item.type === 'consumable'),
        miscellaneous: availableItems.filter(item => item.type === 'miscellaneous')
    };
};

/**
 * Get equipment preview for a specific selection
 * Shows what items will be unlocked by choosing a particular option
 * @param {string} selectionType - Type of selection ('class', 'race', 'subrace', 'path', 'background')
 * @param {string} selectionValue - The specific value (e.g., 'Pyrofiend', 'human', etc.)
 * @returns {Object} Preview data with count, categories, and examples
 */
export const getEquipmentPreview = (selectionType, selectionValue) => {
    if (!selectionValue) {
        return { count: 0, categories: {}, examples: [] };
    }

    // Combine all equipment arrays directly to avoid circular dependency
    const allEquipment = [
        ...UNIVERSAL_STARTING_ITEMS,
        ...ALL_CLASS_EQUIPMENT,
        ...ALL_RACE_EQUIPMENT,
        ...ALL_BACKGROUND_EQUIPMENT
    ];

    // Filter items that match this specific selection
    const matchingItems = allEquipment.filter(item => {
        const availability = item.availableFor;

        // Skip universal items (they're always available)
        if (availability.universal) {
            return false;
        }

        // Check if this selection unlocks the item
        switch (selectionType) {
            case 'class':
                return availability.classes && availability.classes.includes(selectionValue);
            case 'race':
                return availability.races && availability.races.includes(selectionValue);
            case 'subrace':
                return availability.subraces && availability.subraces.includes(selectionValue);
            case 'path':
                return availability.paths && availability.paths.includes(selectionValue);
            case 'background':
                return availability.backgrounds && availability.backgrounds.includes(selectionValue);
            default:
                return false;
        }
    });

    // Organize by category
    const categories = {
        weapons: matchingItems.filter(item => item.type === 'weapon').length,
        armor: matchingItems.filter(item => item.type === 'armor').length,
        accessories: matchingItems.filter(item => item.type === 'accessory').length,
        containers: matchingItems.filter(item => item.type === 'container').length,
        consumables: matchingItems.filter(item => item.type === 'consumable').length,
        miscellaneous: matchingItems.filter(item => item.type === 'miscellaneous').length
    };

    // Get a few example items (up to 3)
    const examples = matchingItems.slice(0, 3).map(item => item.name);

    return {
        count: matchingItems.length,
        categories,
        examples
    };
};

