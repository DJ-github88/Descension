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
import { ALL_PATH_EQUIPMENT } from './equipment/pathEquipment';
import { ALL_BACKGROUND_EQUIPMENT } from './equipment/backgroundEquipment';

// ===== UNIVERSAL ITEMS - Available to All Characters =====

export const UNIVERSAL_STARTING_ITEMS = [
    // Basic Weapons
    {
        id: 'starter-dagger',
        name: 'Simple Dagger',
        type: 'weapon',
        subtype: 'DAGGER',
        quality: 'common',
        description: 'A basic iron dagger suitable for any adventurer. Simple but reliable.',
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
                damageType: 'piercing'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-shortsword',
        name: 'Iron Shortsword',
        type: 'weapon',
        subtype: 'SWORD',
        quality: 'common',
        description: 'A standard iron shortsword. Well-balanced and easy to wield.',
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
                damageType: 'slashing'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-quarterstaff',
        name: 'Wooden Quarterstaff',
        type: 'weapon',
        subtype: 'STAFF',
        quality: 'common',
        description: 'A simple wooden staff. Favored by travelers and spellcasters alike.',
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
                damageType: 'bludgeoning'
            }
        },
        availableFor: {
            universal: true
        }
    },
    
    // Basic Armor
    {
        id: 'starter-leather-armor',
        name: 'Leather Armor',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Basic leather armor offering light protection without hindering movement.',
        iconId: 'inv_chest_leather_01',
        value: { platinum: 0, gold: 7, silver: 25, copper: 75 },
        weight: 10,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 2, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-padded-armor',
        name: 'Padded Armor',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'Quilted layers of cloth and batting. The cheapest armor available.',
        iconId: 'inv_chest_cloth_01',
        value: { platinum: 0, gold: 4, silver: 60, copper: 0 },
        weight: 8,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },
    
    // Containers
    {
        id: 'starter-backpack',
        name: 'Leather Backpack',
        type: 'container',
        subtype: 'BACKPACK',
        quality: 'common',
        description: 'A sturdy leather backpack for carrying your adventuring gear.',
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
        name: 'Belt Pouch',
        type: 'container',
        subtype: 'POUCH',
        quality: 'common',
        description: 'A small leather pouch that attaches to your belt.',
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
        name: 'Minor Healing Potion',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A small vial of ruby-red liquid that restores a modest amount of health when consumed.',
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
        name: 'Trail Rations',
        type: 'consumable',
        subtype: 'FOOD',
        quality: 'common',
        description: 'Dried meat, hardtack, and preserved fruits. Enough for one day of travel.',
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
        name: 'Waterskin',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A leather waterskin that holds enough water for a day.',
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
        name: 'Torch',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A wooden torch. Burns for 1 hour and provides bright light.',
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
        name: 'Hempen Rope',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Sturdy hempen rope, sold by the foot.',
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
        name: 'Bedroll',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple bedroll for sleeping outdoors.',
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
        name: 'Simple Ring',
        type: 'accessory',
        subtype: 'RING',
        quality: 'common',
        description: 'A plain iron ring with a minor enchantment.',
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
        name: 'Hand Axe',
        type: 'weapon',
        subtype: 'AXE',
        quality: 'common',
        description: 'A simple one-handed axe. Can be thrown or used in melee.',
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
                damageType: 'slashing'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-mace',
        name: 'Simple Mace',
        type: 'weapon',
        subtype: 'MACE',
        quality: 'common',
        description: 'A basic mace. Effective against armored foes.',
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
                damageType: 'bludgeoning'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-spear',
        name: 'Simple Spear',
        type: 'weapon',
        subtype: 'POLEARM',
        quality: 'common',
        description: 'A basic spear with good reach. Can be thrown.',
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
                damageType: 'piercing'
            }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-crossbow',
        name: 'Light Crossbow',
        type: 'weapon',
        subtype: 'CROSSBOW',
        quality: 'common',
        description: 'A light crossbow. Easier to use than a bow but slower to reload.',
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
                damageType: 'piercing'
            }
        },
        availableFor: {
            universal: true
        }
    },

    // Additional Armor
    {
        id: 'starter-hide-armor',
        name: 'Hide Armor',
        type: 'armor',
        subtype: 'MEDIUM',
        quality: 'common',
        description: 'Crude armor made from thick furs and pelts.',
        iconId: 'inv_chest_leather_04',
        value: { platinum: 0, gold: 5, silver: 40, copper: 50 },
        weight: 12,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 3, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-chain-shirt',
        name: 'Chain Shirt',
        type: 'armor',
        subtype: 'MEDIUM',
        quality: 'common',
        description: 'A shirt made of interlocking metal rings.',
        iconId: 'inv_chest_chain_01',
        value: { platinum: 0, gold: 9, silver: 25, copper: 0 },
        weight: 20,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 4, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-shield',
        name: 'Wooden Shield',
        type: 'armor',
        subtype: 'SHIELD',
        quality: 'common',
        description: 'A simple wooden shield. Provides basic protection.',
        iconId: 'inv_shield_01',
        value: { platinum: 0, gold: 4, silver: 80, copper: 0 },
        weight: 6,
        width: 2,
        height: 2,
        slots: ['offHand'],
        armorClass: 2,
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
        name: 'Antitoxin Vial',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A vial that grants advantage against poison for 1 hour.',
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
        name: 'Oil Flask',
        type: 'consumable',
        subtype: 'UTILITY',
        quality: 'common',
        description: 'A flask of oil. Can be used as fuel or thrown as a weapon.',
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
        name: 'Tinderbox',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small container with flint, fire steel, and tinder for starting fires.',
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
        name: 'Grappling Hook',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A three-pronged hook attached to a rope. Useful for climbing.',
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
        name: 'Healer\'s Kit',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A leather pouch containing bandages, salves, and splints. Has 10 uses.',
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
        name: 'Manacles',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Iron manacles for restraining prisoners. Comes with a key.',
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
        name: 'Blank Spellbook',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A leather-bound book with blank pages for recording spells.',
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
        name: 'Two-Person Tent',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple canvas tent that provides shelter for two people.',
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
        name: 'Wool Blanket',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A thick wool blanket for warmth during cold nights.',
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
        name: 'Mess Kit',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A tin box containing a cup, plate, and simple utensils.',
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
        name: 'Iron Pot',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A sturdy iron pot for cooking meals over a campfire.',
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
        name: 'Fishing Tackle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A wooden rod, line, hooks, and lures for catching fish.',
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
        name: 'Hammer',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple hammer for driving pitons and tent stakes.',
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
        name: 'Iron Piton',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'An iron spike for securing ropes when climbing.',
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
        name: 'Crowbar',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'An iron bar for prying open doors and crates.',
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
        name: 'Hooded Lantern',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A metal lantern with shutters. Burns oil for 6 hours per pint.',
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
        name: 'Oil Flask',
        type: 'consumable',
        subtype: 'POTION',
        quality: 'common',
        description: 'A pint of oil for lanterns. Can also be thrown as a weapon.',
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
        name: 'Ink Pen',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A quill pen for writing.',
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
        name: 'Ink Bottle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small bottle of black ink.',
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
        name: 'Parchment',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A sheet of quality parchment for writing.',
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
        name: 'Leather Journal',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A blank journal for recording your adventures.',
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
        name: 'Steel Mirror',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A polished steel mirror. Useful for looking around corners.',
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
        name: 'Iron Chain',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'Sturdy iron chain, sold by the foot.',
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
        name: 'Spyglass',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'uncommon',
        description: 'A brass telescope for viewing distant objects.',
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
        name: 'Compass',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple compass for navigation.',
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
        name: 'Traveler\'s Cloak',
        type: 'armor',
        subtype: 'CLOTH',
        quality: 'common',
        description: 'A sturdy cloak that provides protection from the elements.',
        iconId: 'inv_misc_cape_01',
        value: { platinum: 0, gold: 0, silver: 95, copper: 50 },
        weight: 4,
        width: 2,
        height: 2,
        slots: ['chest'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-boots',
        name: 'Leather Boots',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Sturdy leather boots for long journeys.',
        iconId: 'inv_boots_cloth_01',
        value: { platinum: 0, gold: 1, silver: 40, copper: 75 },
        weight: 2,
        width: 2,
        height: 1,
        slots: ['feet'],
        combatStats: {
            armorClass: { value: 1, isPercentage: false }
        },
        availableFor: {
            universal: true
        }
    },

    {
        id: 'starter-gloves',
        name: 'Leather Gloves',
        type: 'armor',
        subtype: 'LEATHER',
        quality: 'common',
        description: 'Simple leather gloves for protection and grip.',
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
        name: 'Wooden Flute',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A simple wooden flute for playing music.',
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
        name: 'Hand Drum',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small drum that can be played with one hand.',
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
        name: 'Bell',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A small brass bell. Can be used as an alarm.',
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
        name: 'Candle',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A wax candle. Burns for 1 hour.',
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
        name: 'Chalk',
        type: 'miscellaneous',
        subtype: 'TRADE_GOODS',
        quality: 'common',
        description: 'A piece of chalk for marking surfaces.',
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
        name: 'Burlap Sack',
        type: 'container',
        subtype: 'BAG',
        quality: 'common',
        description: 'A large burlap sack for carrying loose items.',
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
    ...ALL_PATH_EQUIPMENT,
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
 * @param {string} selectionValue - The specific value (e.g., 'Pyrofiend', 'nordmark', etc.)
 * @returns {Object} Preview data with count, categories, and examples
 */
export const getEquipmentPreview = (selectionType, selectionValue) => {
    if (!selectionValue) {
        return { count: 0, categories: {}, examples: [] };
    }

    // Filter items that match this specific selection
    const matchingItems = STARTING_EQUIPMENT_LIBRARY.filter(item => {
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

