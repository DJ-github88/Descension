import React, { useState, useEffect } from 'react';
import { ITEM_TYPES, QUALITY_TYPES, EQUIPMENT_SLOTS, CURRENCY_TYPES } from './itemConstants';
import { WEAPON_SUBTYPES } from './weaponTypes';

// Quality multipliers for stats
const QUALITY_MULTIPLIERS = {
    poor: 0.5,
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 2.5,
    legendary: 3,
    artifact: 4
};

// Base value multipliers for item quality
const QUALITY_VALUE_MULTIPLIERS = {
    poor: 0.1,     // 0-10 copper
    common: 0.5,    // 5-50 copper
    uncommon: 2,    // 20-200 copper or 2-20 silver
    rare: 10,       // 1-10 silver
    epic: 50,       // 5-50 silver or 0.5-5 gold
    legendary: 200, // 2-20 gold
    artifact: 1000  // 10-100 gold
};

// Power scale options
const POWER_SCALE_OPTIONS = [
    { value: 0.25, label: 'Very Weak' },
    { value: 0.5, label: 'Weak' },
    { value: 0.75, label: 'Slightly Weak' },
    { value: 1, label: 'Normal' },
    { value: 1.25, label: 'Slightly Strong' },
    { value: 1.5, label: 'Strong' },
    { value: 2, label: 'Very Strong' }
];

// Item subtypes
const ITEM_SUBTYPES = {
    weapon: {
        SWORD: 'Sword',
        AXE: 'Axe',
        MACE: 'Mace',
        DAGGER: 'Dagger',
        STAFF: 'Staff',
        POLEARM: 'Polearm',
        BOW: 'Bow',
        CROSSBOW: 'Crossbow',
        WAND: 'Wand'
    },
    armor: {
        CLOTH: 'Cloth',
        LEATHER: 'Leather',
        MAIL: 'Mail',
        PLATE: 'Plate',
        SHIELD: 'Shield'
    },
    accessory: {
        RING: 'Ring',
        NECKLACE: 'Necklace',
        TRINKET: 'Trinket',
        CLOAK: 'Cloak',
        BELT: 'Belt'
    },
    consumable: {
        POTION: 'Potion',
        SCROLL: 'Scroll',
        FOOD: 'Food',
        ELIXIR: 'Elixir',
        BANDAGE: 'Bandage'
    },
    miscellaneous: {
        QUEST: 'Quest Item',
        REAGENT: 'Reagent',
        CRAFTING: 'Crafting Material',
        TRADE_GOODS: 'Trade Goods',
        KEY: 'Key',
        JUNK: 'Junk'
    },
    currency: {
        HANDFUL_OF_COINS: 'Handful of Coins',
        SMALL_POUCH: 'Small Pouch of Coins',
        MODEST_SUM: 'Modest Sum',
        MERCHANT_PURSE: 'Merchant\'s Purse',
        ADVENTURER_EARNINGS: 'Adventurer\'s Earnings',
        NOBLE_PAYMENT: 'Noble\'s Payment',
        ROYAL_BOUNTY: 'Royal Bounty'
    }
};

// Helper functions
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomProperty = (obj) => {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
};

// Calculate item value based on quality and power scale
const calculateItemValue = (quality, powerScale = 1) => {
    // Base value based on quality and power scale
    const baseValue = Math.floor(getRandomInt(10, 100) * QUALITY_VALUE_MULTIPLIERS[quality] * powerScale);

    // Convert to gold/silver/copper
    const gold = Math.floor(baseValue / 100);
    const remainder = baseValue - (gold * 100);
    const silver = Math.floor(remainder / 10);
    const copper = Math.floor(remainder % 10);

    return {
        gold,
        silver,
        copper: copper || (gold === 0 && silver === 0 ? 1 : 0) // Ensure at least 1 copper if no other value
    };
};

// Generate item name based on type and quality
const generateItemName = (type, subtype, quality, options = {}) => {
    const prefixes = {
        poor: ['Broken', 'Damaged', 'Worn', 'Tattered', 'Rusty'],
        common: ['Simple', 'Basic', 'Standard', 'Plain', 'Ordinary'],
        uncommon: ['Fine', 'Quality', 'Sturdy', 'Reliable', 'Solid'],
        rare: ['Superior', 'Exceptional', 'Excellent', 'Remarkable', 'Impressive'],
        epic: ['Magnificent', 'Glorious', 'Majestic', 'Splendid', 'Exquisite'],
        legendary: ['Legendary', 'Mythical', 'Ancient', 'Fabled', 'Storied'],
        artifact: ['Divine', 'Celestial', 'Transcendent', 'Godly', 'Immortal']
    };

    // Special handling for containers
    if (type === 'container') {
        const containerNames = {
            poor: ['Worn', 'Tattered', 'Rusty', 'Damaged', 'Broken'],
            common: ['Simple', 'Basic', 'Standard', 'Plain', 'Ordinary'],
            uncommon: ['Fine', 'Quality', 'Sturdy', 'Reliable', 'Solid'],
            rare: ['Superior', 'Exceptional', 'Excellent', 'Remarkable', 'Impressive'],
            epic: ['Magnificent', 'Glorious', 'Majestic', 'Splendid', 'Exquisite'],
            legendary: ['Legendary', 'Mythical', 'Ancient', 'Fabled', 'Storied'],
            artifact: ['Divine', 'Celestial', 'Transcendent', 'Godly', 'Immortal']
        };

        const containerTypes = {
            SMALL: ['Pouch', 'Satchel', 'Purse', 'Wallet', 'Bag'],
            MEDIUM: ['Backpack', 'Knapsack', 'Rucksack', 'Haversack', 'Pack'],
            LARGE: ['Chest', 'Trunk', 'Coffer', 'Strongbox', 'Crate'],
            EXTRA_LARGE: ['Large Chest', 'Massive Trunk', 'Great Coffer', 'Huge Strongbox', 'Enormous Crate']
        };

        const prefix = getRandomElement(containerNames[quality]);
        const containerSizeValue = options.containerSize || 'MEDIUM';
        const suffix = getRandomElement(containerTypes[containerSizeValue] || ['Container']);

        return `${prefix} ${suffix}`;
    }

    // For other item types
    const subtypeNames = subtype && ITEM_SUBTYPES[type] ? ITEM_SUBTYPES[type][subtype] || ITEM_TYPES[type].name : ITEM_TYPES[type].name;
    const prefix = getRandomElement(prefixes[quality]);

    return `${prefix} ${subtypeNames}`;
};

// Generate item description based on type and quality
const generateItemDescription = (type, subtype, quality) => {
    const descriptions = {
        weapon: {
            poor: 'A damaged weapon that has seen better days.',
            common: 'A simple weapon of average craftsmanship.',
            uncommon: 'A well-crafted weapon with good balance.',
            rare: 'A superior weapon crafted by a master smith.',
            epic: 'A magnificent weapon of exceptional quality.',
            legendary: 'A legendary weapon with a storied history.',
            artifact: 'A divine weapon of immense power.'
        },
        armor: {
            poor: 'A damaged piece of armor with little protection.',
            common: 'A simple piece of armor offering basic protection.',
            uncommon: 'A well-crafted piece of armor with good protection.',
            rare: 'A superior piece of armor crafted by a master smith.',
            epic: 'A magnificent piece of armor of exceptional quality.',
            legendary: 'A legendary piece of armor with a storied history.',
            artifact: 'A divine piece of armor of immense power.'
        },
        accessory: {
            poor: 'A damaged accessory with little value.',
            common: 'A simple accessory of average craftsmanship.',
            uncommon: 'A well-crafted accessory with good quality.',
            rare: 'A superior accessory crafted by a master jeweler.',
            epic: 'A magnificent accessory of exceptional quality.',
            legendary: 'A legendary accessory with a storied history.',
            artifact: 'A divine accessory of immense power.'
        },
        consumable: {
            poor: 'A questionable consumable of dubious quality.',
            common: 'A simple consumable of average quality.',
            uncommon: 'A well-crafted consumable with good potency.',
            rare: 'A superior consumable crafted by a master alchemist.',
            epic: 'A magnificent consumable of exceptional potency.',
            legendary: 'A legendary consumable with miraculous effects.',
            artifact: 'A divine consumable of immense power.'
        },
        miscellaneous: {
            poor: 'A damaged item with little value.',
            common: 'A simple item of average quality.',
            uncommon: 'A well-crafted item with good quality.',
            rare: 'A superior item of remarkable quality.',
            epic: 'A magnificent item of exceptional quality.',
            legendary: 'A legendary item with a storied history.',
            artifact: 'A divine item of immense significance.'
        },
        currency: {
            poor: 'A few coins of little value.',
            common: 'A small amount of currency.',
            uncommon: 'A modest sum of currency.',
            rare: 'A substantial amount of currency.',
            epic: 'A significant amount of currency.',
            legendary: 'A fortune in currency.',
            artifact: 'An immense treasure of currency.'
        },
        container: {
            poor: 'A worn container that has seen better days.',
            common: 'A simple container of average craftsmanship.',
            uncommon: 'A well-crafted container with good durability.',
            rare: 'A superior container crafted by a master artisan.',
            epic: 'A magnificent container of exceptional quality.',
            legendary: 'A legendary container with a storied history.',
            artifact: 'A divine container of immense significance.'
        }
    };

    return descriptions[type][quality];
};

// Generate item stats based on type, quality, and power scale
const generateItemStats = (type, subtype, quality, powerScale) => {
    const multiplier = QUALITY_MULTIPLIERS[quality] * powerScale;

    // Base stats
    const baseStats = {};
    const possibleStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];

    // Determine number of stats based on quality and power scale
    const maxStats = Math.max(1, Math.min(6, Math.floor(multiplier * 2)));
    const numStats = getRandomInt(1, maxStats);

    // Generate random stats
    for (let i = 0; i < numStats; i++) {
        const stat = getRandomElement(possibleStats);
        const value = Math.max(1, Math.floor(multiplier * getRandomInt(1, 3)));

        baseStats[stat] = {
            value,
            isPercentage: false
        };

        // Remove the stat from possible stats to avoid duplicates
        possibleStats.splice(possibleStats.indexOf(stat), 1);
        if (possibleStats.length === 0) break;
    }

    return baseStats;
};

// Generate combat stats based on type, quality, and power scale
const generateCombatStats = (type, subtype, quality, powerScale) => {
    const multiplier = QUALITY_MULTIPLIERS[quality] * powerScale;
    const combatStats = {};

    // Common combat stats
    if (type === 'weapon') {
        // Weapons can have additional damage bonuses
        if (quality !== 'poor' && (quality !== 'common' || Math.random() < 0.5)) {
            combatStats.damage = {
                value: Math.max(1, Math.floor(multiplier * getRandomInt(1, 3))),
                isPercentage: false
            };
        }
    } else if (type === 'armor') {
        // Add armor class for armor
        combatStats.armorClass = {
            value: Math.max(1, Math.floor(multiplier * getRandomInt(1, 5))),
            isPercentage: false
        };

        // Add resistances for higher quality armor
        if (quality !== 'poor' && quality !== 'common') {
            const resistanceTypes = ['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder'];
            const resistanceType = getRandomElement(resistanceTypes);

            combatStats.resistances = {
                [resistanceType]: {
                    value: Math.max(1, Math.floor(multiplier * getRandomInt(1, 5))),
                    isPercentage: false
                }
            };
        }
    }

    return combatStats;
};

// Generate weapon stats based on quality and power scale
const generateWeaponStats = (subtype, quality, powerScale) => {
    const multiplier = QUALITY_MULTIPLIERS[quality] * powerScale;
    const diceTypes = [4, 6, 8, 10, 12];

    // Determine dice count and type based on quality and power scale
    let diceCount = Math.max(1, Math.min(4, Math.floor(multiplier)));
    let diceTypeIndex = Math.min(4, Math.floor(multiplier * 2));
    let diceType = diceTypes[diceTypeIndex];

    // Determine damage type based on weapon subtype
    let damageType = 'slashing';
    if (subtype === 'DAGGER' || subtype === 'SPEAR' || subtype === 'ARROW') {
        damageType = 'piercing';
    } else if (subtype === 'MACE' || subtype === 'STAFF') {
        damageType = 'bludgeoning';
    }

    // Add bonus damage for higher quality weapons
    let bonusDamage = 0;
    let bonusDamageType = null;

    if (quality !== 'poor' && quality !== 'common') {
        bonusDamage = Math.max(1, Math.floor(multiplier));

        // Add bonus damage type for rare and above
        if (quality !== 'uncommon') {
            const damageTypes = ['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder'];
            bonusDamageType = getRandomElement(damageTypes);
        }
    }

    return {
        baseDamage: {
            diceCount,
            diceType,
            damageType,
            bonusDamage,
            bonusDamageType,
            display: {
                base: `${diceCount}d${diceType}`,
                type: damageType,
                bonus: bonusDamage > 0 ? bonusDamage : null,
                bonusType: bonusDamageType
            }
        }
    };
};

// Generate item dimensions based on type and subtype
const generateItemDimensions = (type, subtype, options = {}) => {
    // Default dimensions
    let width = 1;
    let height = 1;

    // Adjust dimensions based on item type and subtype
    switch (type) {
        case 'weapon':
            if (subtype === 'GREATSWORD') {
                // Two-handed sword
                width = 2;
                height = 4;
            } else if (subtype === 'GREATAXE' || subtype === 'POLEARM') {
                // Other two-handed weapons
                width = 2;
                height = 4;
            } else if (subtype === 'STAFF') {
                // Staves are long but thin
                width = 1;
                height = 4;
            } else if (subtype === 'SWORD') {
                // One-handed sword - match the item wizard
                width = 1;
                height = 3;
            } else if (subtype === 'AXE' || subtype === 'MACE') {
                // Other one-handed weapons
                width = 1;
                height = 2;
            } else if (subtype === 'DAGGER') {
                // Daggers are small
                width = 1;
                height = 1;
            } else if (subtype === 'BOW' || subtype === 'CROSSBOW') {
                // Bows are wider
                width = 2;
                height = 3;
            } else if (subtype === 'WAND') {
                // Wands are small
                width = 1;
                height = 1;
            }
            break;
        case 'armor':
            if (subtype === 'PLATE' || subtype === 'MAIL') {
                width = 2;
                height = 2;
            } else if (subtype === 'LEATHER') {
                width = 1;
                height = 2;
            } else if (subtype === 'SHIELD') {
                width = 2;
                height = 2;
            } else if (subtype === 'CLOTH') {
                width = 1;
                height = 2;
            }
            break;
        case 'accessory':
            if (subtype === 'RING') {
                // Rings are small and square
                width = 1;
                height = 1;
            } else if (subtype === 'NECKLACE') {
                // Necklaces are small but slightly taller
                width = 1;
                height = 1;
            } else if (subtype === 'TRINKET') {
                // Trinkets are small
                width = 1;
                height = 1;
            } else if (subtype === 'CLOAK') {
                // Cloaks are larger
                width = 2;
                height = 2;
            } else if (subtype === 'BELT') {
                // Belts are wide but short
                width = 2;
                height = 1;
            }
            break;
        case 'consumable':
            // All consumables are small
            width = 1;
            height = 1;
            break;
        case 'miscellaneous':
            // Most miscellaneous items are small
            width = 1;
            height = 1;
            break;
        case 'container':
            // Adjust container dimensions based on size
            if (options.containerSize) {
                switch (options.containerSize) {
                    case 'SMALL':
                        width = 1;
                        height = 1;
                        break;
                    case 'MEDIUM':
                        width = 2;
                        height = 2;
                        break;
                    case 'LARGE':
                        width = 2;
                        height = 3;
                        break;
                    case 'EXTRA_LARGE':
                        width = 3;
                        height = 3;
                        break;
                    default:
                        width = 2;
                        height = 2;
                }
            } else {
                width = 2;
                height = 2;
            }
            break;
    }

    return { width, height };
};

// Generate random items for a container
const generateContainerItems = (containerQuality, containerSize, fillLevel, includeCurrency, powerScale) => {
    const items = [];
    const { rows, cols } = CONTAINER_SIZES[containerSize];
    const totalCells = rows * cols;
    const fillPercentage = CONTAINER_FILL_LEVELS[fillLevel].fillPercentage;

    // Calculate how many cells to fill based on fill percentage
    const cellsToFill = Math.floor(totalCells * (fillPercentage / 100));

    // Add currency if requested, even for empty containers
    if (includeCurrency) {
        try {
            const currencyItem = generateCurrencyForContainer(containerQuality, powerScale || 1);
            // Place currency in the top-left corner
            currencyItem.position = { row: 0, col: 0 };
            items.push(currencyItem);
        } catch (error) {
            console.error('Error generating currency for container:', error);
        }
    }

    // If we don't need to fill any cells or only need currency, return early
    if (cellsToFill === 0 || (fillLevel === 'EMPTY' && includeCurrency)) {
        return items;
    }

    try {
        // Determine item quality distribution based on container quality
        const qualityDistribution = getQualityDistribution(containerQuality);

        // Determine item type distribution
        const itemTypes = ['weapon', 'armor', 'accessory', 'consumable', 'miscellaneous'];

        // Generate items until we reach the desired fill level
        let currentCellsFilled = includeCurrency ? 1 : 0; // Account for currency if included
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loops

        while (currentCellsFilled < cellsToFill && attempts < maxAttempts) {
            attempts++;

            try {
                // Select random item type
                const itemType = getRandomElement(itemTypes);

                // Make sure ITEM_SUBTYPES[itemType] exists
                if (!ITEM_SUBTYPES[itemType]) {
                    console.error(`No subtypes found for item type: ${itemType}`);
                    continue;
                }

                // Select random subtype for the chosen item type
                const itemSubtype = itemType === 'weapon'
                    ? getRandomProperty(WEAPON_SUBTYPES)
                    : getRandomProperty(ITEM_SUBTYPES[itemType]);

                // Select quality based on distribution
                const itemQuality = selectQualityFromDistribution(qualityDistribution);

                // Generate the item
                const item = generateBasicItem(itemType, itemSubtype, itemQuality, powerScale || 1);

                // Calculate item dimensions with proper sizing
                const dimensions = generateItemDimensions(itemType, itemSubtype);

                // Check if item would fit in the container
                if (dimensions.width * dimensions.height + currentCellsFilled <= cellsToFill) {
                    // Find a valid position for the item
                    const position = findValidPosition(items, rows, cols, dimensions.width, dimensions.height);

                    if (position) {
                        // Add position to the item
                        item.position = position;

                        // Add the item to the container
                        items.push(item);

                        // Update cells filled
                        currentCellsFilled += dimensions.width * dimensions.height;
                    }
                }
            } catch (error) {
                console.error('Error generating item for container:', error);
            }
        }
    } catch (error) {
        console.error('Error in generateContainerItems:', error);
    }

    return items;
};

// Icon mappings for different item types and subtypes
const ITEM_ICON_MAPPINGS = {
    weapon: {
        SWORD: ['inv_sword_04', 'inv_sword_23', 'inv_sword_34', 'inv_sword_39', 'inv_sword_27', 'inv_sword_31', 'inv_sword_15'],
        AXE: ['inv_axe_01', 'inv_axe_09', 'inv_axe_17', 'inv_throwingaxe_01', 'inv_axe_11', 'inv_axe_22'],
        MACE: ['inv_mace_01', 'inv_mace_06', 'inv_hammer_16', 'inv_mace_13', 'inv_hammer_20', 'inv_mace_21'],
        DAGGER: ['inv_weapon_shortblade_01', 'inv_weapon_shortblade_05', 'inv_weapon_shortblade_15', 'inv_weapon_shortblade_21'],
        STAFF: ['inv_staff_07', 'inv_staff_20', 'inv_staff_31', 'inv_staff_14', 'inv_staff_51', 'inv_staff_40'],
        POLEARM: ['inv_spear_01', 'inv_spear_06', 'inv_spear_08', 'inv_spear_03'],
        BOW: ['inv_weapon_bow_07', 'inv_weapon_bow_02', 'inv_weapon_bow_11', 'inv_weapon_bow_05', 'inv_weapon_bow_08'],
        CROSSBOW: ['inv_weapon_crossbow_02', 'inv_weapon_crossbow_01', 'inv_weapon_crossbow_03', 'inv_weapon_crossbow_10'],
        WAND: ['inv_wand_01', 'inv_wand_02', 'inv_wand_07', 'inv_wand_08', 'inv_wand_12']
    },
    armor: {
        CLOTH: ['inv_chest_cloth_01', 'inv_chest_cloth_23', 'inv_chest_cloth_21', 'inv_chest_cloth_50', 'inv_chest_cloth_12'],
        LEATHER: ['inv_chest_leather_01', 'inv_chest_leather_08', 'inv_chest_leather_06', 'inv_chest_leather_09', 'inv_chest_leather_03'],
        MAIL: ['inv_chest_chain', 'inv_chest_chain_05', 'inv_chest_chain_12', 'inv_chest_chain_15', 'inv_chest_chain_11'],
        PLATE: ['inv_chest_plate04', 'inv_chest_plate03', 'inv_chest_plate02', 'inv_chest_plate01', 'inv_chest_plate16'],
        SHIELD: ['inv_shield_04', 'inv_shield_06', 'inv_shield_14', 'inv_shield_20', 'inv_shield_30']
    },
    accessory: {
        RING: ['inv_jewelry_ring_01', 'inv_jewelry_ring_03', 'inv_jewelry_ring_05', 'inv_jewelry_ring_27', 'inv_jewelry_ring_23'],
        NECKLACE: ['inv_jewelry_necklace_01', 'inv_jewelry_necklace_07', 'inv_jewelry_necklace_13', 'inv_jewelry_necklace_21'],
        TRINKET: ['inv_jewelry_talisman_01', 'inv_misc_idol_02', 'inv_misc_orb_01', 'inv_jewelry_trinket_01'],
        CLOAK: ['inv_misc_cape_01', 'inv_misc_cape_02', 'inv_misc_cape_18', 'inv_misc_cape_20', 'inv_misc_cape_11'],
        BELT: ['inv_belt_04', 'inv_belt_13', 'inv_belt_16', 'inv_belt_24', 'inv_belt_28']
    },
    consumable: {
        POTION: ['inv_potion_51', 'inv_potion_52', 'inv_potion_54', 'inv_potion_35', 'inv_potion_21', 'inv_potion_162'],
        SCROLL: ['inv_scroll_02', 'inv_scroll_03', 'inv_scroll_06', 'inv_scroll_11'],
        FOOD: ['inv_misc_food_15', 'inv_misc_food_23', 'inv_misc_food_14', 'inv_misc_food_60'],
        ELIXIR: ['inv_potion_27', 'inv_potion_28', 'inv_potion_39', 'inv_potion_41', 'inv_potion_47'],
        BANDAGE: ['inv_misc_bandage_15', 'inv_misc_bandage_16', 'inv_misc_bandage_17', 'inv_misc_bandage_18']
    },
    miscellaneous: {
        QUEST: ['inv_misc_note_01', 'inv_misc_book_08', 'inv_misc_book_02', 'inv_misc_book_09', 'inv_misc_questionmark'],
        REAGENT: ['inv_misc_herb_01', 'inv_misc_herb_02', 'inv_misc_herb_03', 'inv_misc_herb_07', 'inv_misc_dust_01'],
        CRAFTING: ['inv_misc_leatherscrap_01', 'inv_ingot_03', 'inv_fabric_wool_01', 'inv_misc_gem_01', 'inv_misc_gem_03'],
        TRADE_GOODS: ['inv_misc_gem_variety_01', 'inv_misc_pelt_wolf_01', 'inv_misc_bone_01', 'inv_misc_coin_08'],
        KEY: ['inv_misc_key_01', 'inv_misc_key_02', 'inv_misc_key_03', 'inv_misc_key_10', 'inv_misc_key_13'],
        JUNK: ['inv_misc_bone_01', 'inv_misc_dust_02', 'inv_misc_coin_05', 'inv_misc_food_19', 'inv_misc_gem_bloodstone_01']
    }
};

// Get a random icon for a specific item type and subtype
const getItemIcon = (type, subtype) => {
    // If we have specific icons for this type and subtype, use one of those
    if (ITEM_ICON_MAPPINGS[type] && ITEM_ICON_MAPPINGS[type][subtype]) {
        const icons = ITEM_ICON_MAPPINGS[type][subtype];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    // Otherwise, fall back to the default icon for the type
    return ITEM_TYPES[type]?.icon || 'inv_misc_gem_01';
};

// Generate a basic item for container contents
const generateBasicItem = (type, subtype, quality, powerScale) => {
    // Generate item name and description
    const name = generateItemName(type, subtype, quality);
    const description = generateItemDescription(type, subtype, quality);

    // Generate item icon based on type and subtype
    const iconId = getItemIcon(type, subtype);

    // Generate item dimensions with proper sizing
    const dimensions = generateItemDimensions(type, subtype);

    // Generate item value
    const value = calculateItemValue(quality, powerScale);

    // Initialize stats and slots
    let baseStats = {};
    let combatStats = {};
    let weaponStats = null;
    let slots = [];

    // Handle different item types
    if (type === 'weapon') {
        // Weapons get combat stats and weapon stats
        baseStats = generateItemStats(type, subtype, quality, powerScale);
        combatStats = generateCombatStats(type, subtype, quality, powerScale);
        weaponStats = generateWeaponStats(subtype, quality, powerScale);

        // Set appropriate weapon slot based on WEAPON_SUBTYPES data
        const weaponData = WEAPON_SUBTYPES[subtype];
        if (weaponData) {
            if (weaponData.slot === 'TWO_HANDED') {
                slots = ['twoHand'];
            } else if (weaponData.slot === 'RANGED') {
                slots = ['ranged'];
            } else {
                slots = ['mainHand']; // One-handed weapons
            }
        } else {
            // Fallback for unknown subtypes
            slots = ['mainHand'];
        }
    } else if (type === 'armor') {
        // Armor gets combat stats with armor class
        baseStats = generateItemStats(type, subtype, quality, powerScale);
        combatStats = generateCombatStats(type, subtype, quality, powerScale);

        // Set appropriate armor slot
        if (subtype === 'SHIELD') {
            slots = ['offHand'];
        } else if (subtype === 'CLOTH' || subtype === 'LEATHER' || subtype === 'MAIL' || subtype === 'PLATE') {
            slots = ['chest'];
        }
    } else if (type === 'accessory') {
        // Accessories get base stats but no combat stats
        baseStats = generateItemStats(type, subtype, quality, powerScale);

        // Set appropriate accessory slot
        if (subtype === 'RING') {
            slots = ['finger'];
        } else if (subtype === 'NECKLACE') {
            slots = ['neck'];
        } else if (subtype === 'TRINKET') {
            slots = ['trinket'];
        } else if (subtype === 'CLOAK') {
            slots = ['back'];
        } else if (subtype === 'BELT') {
            slots = ['waist'];
        }
    } else if (type === 'consumable') {
        // Consumables get health or mana restore effects
        if (Math.random() < 0.5) {
            combatStats.healthRestore = {
                value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 5))),
                isPercentage: false
            };
        } else {
            combatStats.manaRestore = {
                value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 5))),
                isPercentage: false
            };
        }

        // Add specific effects based on consumable type
        if (subtype === 'POTION') {
            // Potions have stronger instant effects
            if (combatStats.healthRestore) {
                combatStats.healthRestore.value *= 2;
            } else if (combatStats.manaRestore) {
                combatStats.manaRestore.value *= 2;
            }
        } else if (subtype === 'ELIXIR') {
            // Elixirs give stat boosts
            const statToBoost = getRandomElement(['strength', 'agility', 'constitution', 'intelligence', 'spirit']);
            baseStats[statToBoost] = {
                value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 3))),
                isPercentage: false
            };
        } else if (subtype === 'FOOD') {
            // Food gives health over time
            combatStats.healthRestore = {
                value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(2, 6))),
                isPercentage: false
            };
        }
    } else if (type === 'miscellaneous') {
        // Miscellaneous items don't get combat stats
        if (subtype === 'QUEST') {
            // Quest items have special properties
            return {
                id: crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: type,
                subtype: subtype,
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                questGiver: 'Unknown',
                questObjectives: 'Bring this item to its rightful owner.',
                timeLimit: 0,
                requiredLevel: Math.floor(powerScale * 5)
            };
        } else if (subtype === 'REAGENT' || subtype === 'CRAFTING' || subtype === 'TRADE_GOODS') {
            // Crafting materials don't have stats
            return {
                id: crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: type,
                subtype: subtype,
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                stackable: true,
                maxStackSize: 5
            };
        } else if (subtype === 'KEY') {
            // Keys don't have stats
            return {
                id: crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: type,
                subtype: subtype,
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                keyType: 'door',
                keyId: crypto.randomUUID().substring(0, 8)
            };
        } else if (subtype === 'JUNK') {
            // Junk items don't have stats
            return {
                id: crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: type,
                subtype: subtype,
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                sellPrice: Math.floor(value.copper + (value.silver * 10) + (value.gold * 100)) / 2
            };
        }
    }

    // Return the generated item with all necessary properties
    return {
        id: crypto.randomUUID(),
        name: name,
        quality: quality,
        description: description,
        type: type,
        subtype: subtype,

        // For weapons
        ...(type === 'weapon' && {
            weaponSlot: WEAPON_SUBTYPES[subtype]?.slot || 'ONE_HANDED',
            hand: WEAPON_SUBTYPES[subtype]?.slot === 'RANGED' ? 'RANGED' : 'MAIN_HAND',
            weaponStats: weaponStats
        }),

        // Armor class directly at top level for display
        armorClass: combatStats?.armorClass?.value || 0,

        // Slots
        slots: slots,

        // Stats - only include if they have values
        ...(Object.keys(baseStats).length > 0 && { baseStats }),
        ...(Object.keys(combatStats).length > 0 && { combatStats }),

        // Value
        value: value,

        // Appearance
        iconId: iconId,
        imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,

        // Item dimensions for inventory grid
        width: dimensions.width,
        height: dimensions.height,
        rotation: 0,

        // Add stackable property for consumables, miscellaneous, and material items only
        ...((type === 'consumable' || type === 'miscellaneous' || type === 'material') && {
            stackable: true,
            maxStackSize: 5
        }),
        // Explicitly set other items as non-stackable
        ...((type !== 'consumable' && type !== 'miscellaneous' && type !== 'material') && {
            stackable: false
        })
    };
};

// Generate currency item for container
const generateCurrencyForContainer = (containerQuality, powerScale) => {
    // Select a currency type based on container quality
    let currencyKey;

    switch (containerQuality) {
        case 'poor':
        case 'common':
            currencyKey = getRandomElement(['HANDFUL_OF_COINS', 'SMALL_POUCH']);
            break;
        case 'uncommon':
            currencyKey = getRandomElement(['SMALL_POUCH', 'MODEST_SUM']);
            break;
        case 'rare':
            currencyKey = getRandomElement(['MODEST_SUM', 'MERCHANT_PURSE']);
            break;
        case 'epic':
            currencyKey = getRandomElement(['MERCHANT_PURSE', 'ADVENTURER_EARNINGS']);
            break;
        case 'legendary':
            currencyKey = getRandomElement(['ADVENTURER_EARNINGS', 'NOBLE_PAYMENT']);
            break;
        case 'artifact':
            currencyKey = getRandomElement(['NOBLE_PAYMENT', 'ROYAL_BOUNTY']);
            break;
        default:
            currencyKey = 'MODEST_SUM';
    }

    const currencyInfo = CURRENCY_TYPES[currencyKey];

    // Calculate currency value based on power scale and quality
    let currencyValue = Math.max(1, Math.floor(currencyInfo.value * powerScale * QUALITY_MULTIPLIERS[containerQuality]));

    // Determine the display name based on quality
    let displayName = currencyInfo.name;
    if (containerQuality === 'poor') {
        displayName = `Meager ${currencyInfo.name}`;
    } else if (containerQuality === 'uncommon') {
        displayName = `Generous ${currencyInfo.name}`;
    } else if (containerQuality === 'rare') {
        displayName = `Abundant ${currencyInfo.name}`;
    } else if (containerQuality === 'epic') {
        displayName = `Exceptional ${currencyInfo.name}`;
    } else if (containerQuality === 'legendary') {
        displayName = `Legendary ${currencyInfo.name}`;
    } else if (containerQuality === 'artifact') {
        displayName = `Mythical ${currencyInfo.name}`;
    }

    // Calculate the actual currency values
    const value = {
        gold: 0,
        silver: 0,
        copper: 0
    };

    if (currencyInfo.valueDisplay) {
        // Use the predefined value display if available
        const baseMultiplier = powerScale * QUALITY_MULTIPLIERS[containerQuality];

        if (currencyInfo.valueDisplay.gold) {
            value.gold = Math.max(1, Math.floor(currencyInfo.valueDisplay.gold * baseMultiplier));
        }
        if (currencyInfo.valueDisplay.silver) {
            value.silver = Math.max(1, Math.floor(currencyInfo.valueDisplay.silver * baseMultiplier));
        }
        if (currencyInfo.valueDisplay.copper) {
            value.copper = Math.max(1, Math.floor(currencyInfo.valueDisplay.copper * baseMultiplier));
        }
    } else {
        // Fall back to the old method if valueDisplay is not defined
        value[currencyInfo.type] = currencyValue;
    }

    return {
        id: crypto.randomUUID(),
        name: displayName,
        quality: containerQuality,
        description: currencyInfo.description,
        type: 'currency',
        subtype: currencyKey,
        iconId: currencyInfo.icon,
        imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${currencyInfo.icon}.jpg`,
        currencyType: currencyInfo.type,
        currencyValue: currencyValue,
        isCurrency: true,
        value: value,
        width: 1,
        height: 1,
        rotation: 0,
        position: { row: 0, col: 0 } // Default position, will be updated later
    };
};

// Find a valid position for an item in a container grid
const findValidPosition = (existingItems, rows, cols, itemWidth, itemHeight) => {
    // Create a grid representation to track occupied cells
    const grid = Array(rows).fill().map(() => Array(cols).fill(false));

    // Mark occupied cells
    existingItems.forEach(item => {
        if (item.position) {
            const { row, col } = item.position;
            const width = item.width || 1;
            const height = item.height || 1;

            for (let r = row; r < row + height && r < rows; r++) {
                for (let c = col; c < col + width && c < cols; c++) {
                    if (r >= 0 && c >= 0) {
                        grid[r][c] = true;
                    }
                }
            }
        }
    });

    // Find a valid position
    for (let row = 0; row <= rows - itemHeight; row++) {
        for (let col = 0; col <= cols - itemWidth; col++) {
            let isValid = true;

            // Check if all cells are available
            for (let r = row; r < row + itemHeight; r++) {
                for (let c = col; c < col + itemWidth; c++) {
                    if (grid[r][c]) {
                        isValid = false;
                        break;
                    }
                }
                if (!isValid) break;
            }

            if (isValid) {
                return { row, col };
            }
        }
    }

    return null; // No valid position found
};

// Get quality distribution based on container quality
const getQualityDistribution = (containerQuality) => {
    switch (containerQuality) {
        case 'poor':
            return { poor: 70, common: 30 };
        case 'common':
            return { poor: 30, common: 60, uncommon: 10 };
        case 'uncommon':
            return { poor: 10, common: 50, uncommon: 35, rare: 5 };
        case 'rare':
            return { common: 30, uncommon: 50, rare: 18, epic: 2 };
        case 'epic':
            return { uncommon: 20, rare: 50, epic: 28, legendary: 2 };
        case 'legendary':
            return { rare: 20, epic: 50, legendary: 28, artifact: 2 };
        case 'artifact':
            return { epic: 10, legendary: 60, artifact: 30 };
        default:
            return { common: 60, uncommon: 30, rare: 10 };
    }
};

// Select a quality based on distribution
const selectQualityFromDistribution = (distribution) => {
    const rand = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const [quality, probability] of Object.entries(distribution)) {
        cumulativeProbability += probability;
        if (rand <= cumulativeProbability) {
            return quality;
        }
    }

    // Default fallback
    return 'common';
};

// Container size presets
const CONTAINER_SIZES = {
    SMALL: { name: 'Small', rows: 3, cols: 4 },
    MEDIUM: { name: 'Medium', rows: 4, cols: 6 },
    LARGE: { name: 'Large', rows: 5, cols: 8 },
    EXTRA_LARGE: { name: 'Extra Large', rows: 6, cols: 10 }
};

// Container fill level presets
const CONTAINER_FILL_LEVELS = {
    EMPTY: { name: 'Empty', fillPercentage: 0 },
    FEW_ITEMS: { name: 'Few Items', fillPercentage: 20 },
    HALF_FULL: { name: 'Half Full', fillPercentage: 50 },
    MOSTLY_FULL: { name: 'Mostly Full', fillPercentage: 75 },
    FULL: { name: 'Full', fillPercentage: 90 }
};

// Main component
const NewQuickItemWizard = ({ onComplete, onCancel, initialData }) => {
    // State
    const [type, setType] = useState(initialData?.type || 'weapon');
    const [subtype, setSubtype] = useState(initialData?.subtype || '');
    const [quality, setQuality] = useState(initialData?.quality || 'common');
    const [powerScale, setPowerScale] = useState(1); // Default to "Normal"
    const [isGenerating, setIsGenerating] = useState(false);

    // Container-specific state
    const [containerSize, setContainerSize] = useState('MEDIUM');
    const [containerFillLevel, setContainerFillLevel] = useState('FEW_ITEMS');
    const [includeCurrency, setIncludeCurrency] = useState(true);

    // Handle type change
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        setSubtype(''); // Reset subtype when type changes
    };

    // Handle generate button click
    const handleGenerate = () => {
        setIsGenerating(true);

        try {
            // Generate item based on selected options
            const newItem = generateItem(type, subtype, quality, powerScale);
            onComplete(newItem);
        } catch (error) {
            console.error('Error generating item:', error);

            // More detailed error message for debugging
            if (error.stack) {
                console.error('Error stack:', error.stack);
            }

            // Show a more helpful error message
            if (type === 'container') {
                alert('Failed to generate container. Please try a different size or fill level.');
            } else {
                alert('Failed to generate item. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Generate item
    const generateItem = (type, subtype, quality, powerScale) => {
        // If no subtype is selected and this is not a container, pick a random one
        const itemSubtype = type === 'container' ? '' : (subtype || (type === 'weapon' ? getRandomProperty(WEAPON_SUBTYPES) : getRandomProperty(ITEM_SUBTYPES[type])));

        // Generate item name and description
        const nameOptions = type === 'container' ? { containerSize } : {};
        const name = generateItemName(type, itemSubtype, quality, nameOptions);
        const description = generateItemDescription(type, itemSubtype, quality);

        // Generate item icon based on type and subtype
        const iconId = getItemIcon(type, itemSubtype);

        // Generate item dimensions
        const dimensionOptions = type === 'container' ? { containerSize } : {};
        const dimensions = generateItemDimensions(type, itemSubtype, dimensionOptions);

        // Generate item value
        const value = calculateItemValue(quality, powerScale);

        // Generate item stats based on type
        let baseStats = {};
        let combatStats = {};
        let weaponStats = null;
        let slots = [];

        // Special handling for currency items
        if (type === 'currency') {
            // Get a random currency preset if no specific subtype is selected
            const currencyKey = itemSubtype || getRandomProperty(CURRENCY_TYPES);
            const currencyInfo = CURRENCY_TYPES[currencyKey];

            // Calculate currency value based on power scale and quality
            let currencyValue = Math.max(1, Math.floor(currencyInfo.value * powerScale * QUALITY_MULTIPLIERS[quality]));

            // Determine the display name based on quality
            let displayName = currencyInfo.name;
            if (quality === 'poor') {
                displayName = `Meager ${currencyInfo.name}`;
            } else if (quality === 'uncommon') {
                displayName = `Generous ${currencyInfo.name}`;
            } else if (quality === 'rare') {
                displayName = `Abundant ${currencyInfo.name}`;
            } else if (quality === 'epic') {
                displayName = `Exceptional ${currencyInfo.name}`;
            } else if (quality === 'legendary') {
                displayName = `Legendary ${currencyInfo.name}`;
            } else if (quality === 'artifact') {
                displayName = `Mythical ${currencyInfo.name}`;
            }

            // Calculate the actual currency values based on the type and value
            const value = {
                gold: 0,
                silver: 0,
                copper: 0
            };

            if (currencyInfo.valueDisplay) {
                // Use the predefined value display if available
                const baseMultiplier = powerScale * QUALITY_MULTIPLIERS[quality];

                if (currencyInfo.valueDisplay.gold) {
                    value.gold = Math.max(1, Math.floor(currencyInfo.valueDisplay.gold * baseMultiplier));
                }
                if (currencyInfo.valueDisplay.silver) {
                    value.silver = Math.max(1, Math.floor(currencyInfo.valueDisplay.silver * baseMultiplier));
                }
                if (currencyInfo.valueDisplay.copper) {
                    value.copper = Math.max(1, Math.floor(currencyInfo.valueDisplay.copper * baseMultiplier));
                }
            } else {
                // Fall back to the old method if valueDisplay is not defined
                value[currencyInfo.type] = currencyValue;
            }

            return {
                id: initialData?.id || crypto.randomUUID(),
                name: displayName,
                quality: quality,
                description: currencyInfo.description,
                type: 'currency',
                subtype: currencyKey,
                iconId: currencyInfo.icon,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${currencyInfo.icon}.jpg`,
                currencyType: currencyInfo.type,
                currencyValue: currencyValue,
                isCurrency: true,
                value: value,
                width: 1,
                height: 1,
                rotation: 0
            };
        }

        // Special handling for miscellaneous items
        if (type === 'miscellaneous') {
            // Special handling for quest items
            if (itemSubtype === 'QUEST') {
                return {
                    id: initialData?.id || crypto.randomUUID(),
                    name: name,
                    quality: quality,
                    description: description,
                    type: type,
                    subtype: itemSubtype,
                    iconId: iconId,
                    imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                    value: value,
                    width: dimensions.width,
                    height: dimensions.height,
                    rotation: 0,
                    questGiver: 'Unknown',
                    questObjectives: 'Bring this item to its rightful owner.',
                    timeLimit: 0,
                    requiredLevel: Math.floor(powerScale * 5)
                };
            } else if (itemSubtype === 'REAGENT' || itemSubtype === 'CRAFTING' || itemSubtype === 'TRADE_GOODS') {
                // Crafting materials don't have stats
                return {
                    id: initialData?.id || crypto.randomUUID(),
                    name: name,
                    quality: quality,
                    description: description,
                    type: type,
                    subtype: itemSubtype,
                    iconId: iconId,
                    imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                    value: value,
                    width: dimensions.width,
                    height: dimensions.height,
                    rotation: 0,
                    stackable: true,
                    maxStackSize: 5
                };
            } else if (itemSubtype === 'KEY') {
                // Keys don't have stats
                return {
                    id: initialData?.id || crypto.randomUUID(),
                    name: name,
                    quality: quality,
                    description: description,
                    type: type,
                    subtype: itemSubtype,
                    iconId: iconId,
                    imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                    value: value,
                    width: dimensions.width,
                    height: dimensions.height,
                    rotation: 0,
                    keyType: 'door',
                    keyId: crypto.randomUUID().substring(0, 8)
                };
            } else if (itemSubtype === 'JUNK') {
                // Junk items don't have stats
                return {
                    id: initialData?.id || crypto.randomUUID(),
                    name: name,
                    quality: quality,
                    description: description,
                    type: type,
                    subtype: itemSubtype,
                    iconId: iconId,
                    imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                    value: value,
                    width: dimensions.width,
                    height: dimensions.height,
                    rotation: 0,
                    sellPrice: Math.floor(value.copper + (value.silver * 10) + (value.gold * 100)) / 2
                };
            }

            // Default for other miscellaneous items
            return {
                id: initialData?.id || crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: type,
                subtype: itemSubtype,
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0
            };
        }

        // Special handling for container items
        if (type === 'container') {
            // Use the selected container size
            const containerSizeConfig = CONTAINER_SIZES[containerSize];
            const containerRows = containerSizeConfig.rows;
            const containerCols = containerSizeConfig.cols;

            // Generate items for the container based on fill level
            const containerItems = generateContainerItems(
                quality,
                containerSize,
                containerFillLevel,
                includeCurrency,
                powerScale
            );

            // Select an appropriate icon based on container size and quality
            let iconId = 'inv_misc_bag_08';

            if (containerSize === 'SMALL') {
                iconId = 'inv_misc_bag_10';
            } else if (containerSize === 'MEDIUM') {
                iconId = 'inv_misc_bag_08';
            } else if (containerSize === 'LARGE') {
                iconId = 'inv_box_01';
            } else if (containerSize === 'EXTRA_LARGE') {
                iconId = 'inv_box_03';
            }

            // For higher quality containers, use better looking icons
            if (quality === 'epic' || quality === 'legendary' || quality === 'artifact') {
                if (containerSize === 'SMALL') {
                    iconId = 'inv_misc_bag_19';
                } else if (containerSize === 'MEDIUM') {
                    iconId = 'inv_misc_bag_17';
                } else if (containerSize === 'LARGE') {
                    iconId = 'inv_box_02';
                } else if (containerSize === 'EXTRA_LARGE') {
                    iconId = 'inv_box_04';
                }
            }

            return {
                id: initialData?.id || crypto.randomUUID(),
                name: name,
                quality: quality,
                description: description,
                type: 'container',
                iconId: iconId,
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,
                value: value,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                containerProperties: {
                    isLocked: false,
                    lockType: 'none',
                    lockDC: 10,
                    lockCode: '',
                    gridSize: {
                        rows: containerRows,
                        cols: containerCols
                    },
                    items: containerItems,
                    flavorText: '',
                    maxAttempts: 3,
                    failureAction: 'none',
                    failureActionDetails: {
                        removeItems: false,
                        removePercentage: 50,
                        destroyContainer: false,
                        triggerTrap: false,
                        trapDetails: '',
                        transformIntoCreature: false,
                        creatureType: ''
                    },
                    hasHadItems: containerItems.length > 0 // Set this flag to prevent sample items from appearing
                }
            };
        }

        // Generate stats for other item types
        baseStats = generateItemStats(type, itemSubtype, quality, powerScale);
        combatStats = generateCombatStats(type, itemSubtype, quality, powerScale);

        // Generate weapon stats for weapons
        if (type === 'weapon') {
            weaponStats = generateWeaponStats(itemSubtype, quality, powerScale);
            slots = ['mainHand'];
        }

        // Generate slots for armor
        if (type === 'armor') {
            if (itemSubtype === 'SHIELD') {
                slots = ['offHand'];
            } else {
                slots = ['chest'];
            }
        }

        // Generate slots for accessories
        if (type === 'accessory') {
            if (itemSubtype === 'RING') {
                slots = ['finger'];
            } else if (itemSubtype === 'NECKLACE') {
                slots = ['neck'];
            } else if (itemSubtype === 'TRINKET') {
                slots = ['trinket'];
            } else if (itemSubtype === 'CLOAK') {
                slots = ['back'];
            } else if (itemSubtype === 'BELT') {
                slots = ['waist'];
            }
        }

        // Special handling for consumables
        if (type === 'consumable') {
            // Add health or mana restore effects if not already present
            if (!combatStats.healthRestore && !combatStats.manaRestore) {
                if (Math.random() < 0.5) {
                    combatStats.healthRestore = {
                        value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 5))),
                        isPercentage: false
                    };
                } else {
                    combatStats.manaRestore = {
                        value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 5))),
                        isPercentage: false
                    };
                }
            }

            // Add specific effects based on consumable type
            if (itemSubtype === 'POTION') {
                // Potions have stronger instant effects
                if (combatStats.healthRestore) {
                    combatStats.healthRestore.value *= 2;
                } else if (combatStats.manaRestore) {
                    combatStats.manaRestore.value *= 2;
                }
            } else if (itemSubtype === 'ELIXIR') {
                // Elixirs give stat boosts
                const statToBoost = getRandomElement(['strength', 'agility', 'constitution', 'intelligence', 'spirit']);
                baseStats[statToBoost] = {
                    value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(1, 3))),
                    isPercentage: false
                };
            } else if (itemSubtype === 'FOOD') {
                // Food gives health over time
                combatStats.healthRestore = {
                    value: Math.max(1, Math.floor(powerScale * QUALITY_MULTIPLIERS[quality] * getRandomInt(2, 6))),
                    isPercentage: false
                };
            }
        }

        // Return the generated item
        return {
            id: initialData?.id || crypto.randomUUID(),
            name: name,
            quality: quality,
            description: description,
            type: type,
            subtype: itemSubtype,

            // For weapons
            ...(type === 'weapon' && {
                weaponSlot: WEAPON_SUBTYPES[itemSubtype]?.slot || 'ONE_HANDED',
                hand: WEAPON_SUBTYPES[itemSubtype]?.slot === 'RANGED' ? 'RANGED' : 'MAIN_HAND',
                weaponStats: weaponStats
            }),

            // Armor class directly at top level for display
            armorClass: combatStats?.armorClass?.value || 0,

            // Slots
            slots: slots,

            // Stats - only include if they have values
            ...(Object.keys(baseStats).length > 0 && { baseStats }),
            ...(Object.keys(combatStats).length > 0 && { combatStats }),

            // Value
            value: value,

            // Appearance
            iconId: iconId,
            imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`,

            // Item dimensions for inventory grid
            width: dimensions.width,
            height: dimensions.height,
            rotation: 0,

            // Add stackable property for consumables, miscellaneous, and material items only
            ...((type === 'consumable' || type === 'miscellaneous' || type === 'material') && {
                stackable: true,
                maxStackSize: 5
            }),
            // Explicitly set other items as non-stackable
            ...((type !== 'consumable' && type !== 'miscellaneous') && {
                stackable: false
            })
        };
    };

    return (
        <div className="quick-item-wizard">
            <h2>{initialData ? 'Edit Item' : 'Quick Item Generator'}</h2>

            <div className="form-group">
                <label>Item Type</label>
                <select value={type} onChange={handleTypeChange}>
                    {Object.keys(ITEM_TYPES).map(itemType => (
                        <option key={itemType} value={itemType}>{ITEM_TYPES[itemType].name}</option>
                    ))}
                </select>
            </div>

            {type !== 'container' && (
                <div className="form-group">
                    <label>Item Subtype</label>
                    <select value={subtype} onChange={(e) => setSubtype(e.target.value)}>
                        <option value="">Random</option>
                        {type === 'weapon' ? (
                            // For weapons, show all weapon subtypes grouped by slot
                            Object.entries(WEAPON_SUBTYPES).map(([value, data]) => (
                                <option key={value} value={value}>{data.name} ({data.slot.replace('_', ' ')})</option>
                            ))
                        ) : (
                            // For other item types, use the original logic
                            Object.entries(ITEM_SUBTYPES[type] || {}).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))
                        )}
                    </select>
                </div>
            )}

            <div className="form-group">
                <label>Quality</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                    {Object.keys(QUALITY_TYPES).map(q => (
                        <option key={q} value={q}>{QUALITY_TYPES[q].name}</option>
                    ))}
                </select>
            </div>

            {type !== 'container' && (
                <div className="form-group">
                    <label>Power Scale: {POWER_SCALE_OPTIONS.find(opt => opt.value === powerScale)?.label}</label>
                    <select value={powerScale} onChange={(e) => setPowerScale(parseFloat(e.target.value))}>
                        {POWER_SCALE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Container-specific options */}
            {type === 'container' && (
                <div className="container-options">
                    <h3>Container Options</h3>

                    <div className="form-group">
                        <label>Container Size</label>
                        <select value={containerSize} onChange={(e) => setContainerSize(e.target.value)}>
                            {Object.entries(CONTAINER_SIZES).map(([key, value]) => (
                                <option key={key} value={key}>{value.name} ({value.rows}x{value.cols})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Fill Level</label>
                        <select value={containerFillLevel} onChange={(e) => setContainerFillLevel(e.target.value)}>
                            {Object.entries(CONTAINER_FILL_LEVELS).map(([key, value]) => (
                                <option key={key} value={key}>{value.name} ({value.fillPercentage}%)</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Include Currency</label>
                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={includeCurrency}
                                onChange={(e) => setIncludeCurrency(e.target.checked)}
                                id="include-currency"
                            />
                            <label htmlFor="include-currency">Add coins to container</label>
                        </div>
                    </div>
                </div>
            )}

            <div className="button-group">
                <button
                    className="primary-button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate'}
                </button>
                <button className="secondary-button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewQuickItemWizard;
