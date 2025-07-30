import React, { useState, useEffect, useCallback } from 'react';
import { ITEM_TYPES, QUALITY_TYPES } from './itemConstants';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { getIconUrl } from './wowIcons';
import ItemTooltip from './ItemTooltip';
import ItemIconSelector from './ItemIconSelector';
import '../../styles/enhanced-quick-item-wizard.css';

// Weapon slots and hand options
const WEAPON_SLOTS = {
    ONE_HANDED: {
        name: 'One-Handed',
        description: 'Weapons that can be wielded in one hand'
    },
    TWO_HANDED: {
        name: 'Two-Handed',
        description: 'Weapons that require both hands to wield'
    },
    RANGED: {
        name: 'Ranged',
        description: 'Weapons that attack from a distance'
    }
};

const HAND_OPTIONS = {
    MAIN_HAND: {
        name: 'Main Hand',
        description: 'Primary weapon hand'
    },
    OFF_HAND: {
        name: 'Off Hand',
        description: 'Secondary weapon hand'
    },
    ONE_HAND: {
        name: 'One Hand',
        description: 'Can be used in either hand'
    }
};

// Armor slot options
const ARMOR_SLOTS = {
    head: { name: 'Head' },
    shoulders: { name: 'Shoulders' },
    chest: { name: 'Chest' },
    wrists: { name: 'Wrists' },
    hands: { name: 'Hands' },
    waist: { name: 'Waist' },
    legs: { name: 'Legs' },
    feet: { name: 'Feet' },
    offHand: { name: 'Off Hand (Shield)' }
};

// Item subtypes - defined locally since it's not exported from itemConstants
const ITEM_SUBTYPES = {
    weapon: {
        // One-Handed Weapons
        SWORD: {
            name: 'Sword',
            slot: 'ONE_HANDED',
            defaultHand: 'ONE_HAND',
            damageType: 'slashing'
        },
        AXE: {
            name: 'Axe',
            slot: 'ONE_HANDED',
            defaultHand: 'ONE_HAND',
            damageType: 'slashing'
        },
        MACE: {
            name: 'Mace',
            slot: 'ONE_HANDED',
            defaultHand: 'ONE_HAND',
            damageType: 'bludgeoning'
        },
        DAGGER: {
            name: 'Dagger',
            slot: 'ONE_HANDED',
            defaultHand: 'ONE_HAND',
            damageType: 'piercing'
        },

        // Two-Handed Weapons
        GREATSWORD: {
            name: 'Greatsword',
            slot: 'TWO_HANDED',
            damageType: 'slashing'
        },
        GREATAXE: {
            name: 'Greataxe',
            slot: 'TWO_HANDED',
            damageType: 'slashing'
        },
        MAUL: {
            name: 'Maul',
            slot: 'TWO_HANDED',
            damageType: 'bludgeoning'
        },
        STAFF: {
            name: 'Staff',
            slot: 'TWO_HANDED',
            damageType: 'bludgeoning'
        },
        POLEARM: {
            name: 'Polearm',
            slot: 'TWO_HANDED',
            damageType: 'piercing'
        },

        // Ranged Weapons
        BOW: {
            name: 'Bow',
            slot: 'RANGED',
            damageType: 'piercing'
        },
        CROSSBOW: {
            name: 'Crossbow',
            slot: 'RANGED',
            damageType: 'piercing'
        },
        THROWN: {
            name: 'Thrown Weapon',
            slot: 'RANGED',
            damageType: 'piercing'
        },
        WAND: {
            name: 'Wand',
            slot: 'RANGED',
            damageType: 'force'
        }
    },
    armor: {
        CLOTH: { name: 'Cloth' },
        LEATHER: { name: 'Leather' },
        MAIL: { name: 'Mail' },
        PLATE: { name: 'Plate' },
        SHIELD: { name: 'Shield' }
    },
    accessory: {
        RING: { name: 'Ring' },
        NECKLACE: { name: 'Necklace' },
        TRINKET: { name: 'Trinket' },
        CLOAK: { name: 'Cloak' },
        BELT: { name: 'Belt' }
    },
    consumable: {
        POTION: { name: 'Potion' },
        SCROLL: { name: 'Scroll' },
        FOOD: { name: 'Food' },
        ELIXIR: { name: 'Elixir' },
        BANDAGE: { name: 'Bandage' }
    },
    miscellaneous: {
        QUEST: { name: 'Quest Item' },
        REAGENT: { name: 'Reagent' },
        CRAFTING: { name: 'Crafting Material' },
        TRADE_GOODS: { name: 'Trade Goods' },
        KEY: { name: 'Key' },
        JUNK: { name: 'Junk' }
    },
    container: {
        CHEST: { name: 'Chest' },
        BAG: { name: 'Bag' },
        POUCH: { name: 'Pouch' },
        BARREL: { name: 'Barrel' },
        CRATE: { name: 'Crate' },
        SACK: { name: 'Sack' }
    },
    currency: {
        HANDFUL_OF_COINS: { name: 'Handful of Coins' },
        SMALL_POUCH: { name: 'Small Pouch of Coins' },
        MODEST_SUM: { name: 'Modest Sum' },
        COIN_PURSE: { name: 'Coin Purse' },
        HEAVY_PURSE: { name: 'Heavy Purse' },
        TREASURE_HOARD: { name: 'Treasure Hoard' }
    }
};

// Damage types with colors
const DAMAGE_TYPES = {
    bludgeoning: { name: 'Bludgeoning', color: '#cccccc' },
    piercing: { name: 'Piercing', color: '#dddddd' },
    slashing: { name: 'Slashing', color: '#eeeeee' },
    fire: { name: 'Fire', color: '#ff4400' },
    cold: { name: 'Cold', color: '#3399ff' },
    lightning: { name: 'Lightning', color: '#ffff00' },
    acid: { name: 'Acid', color: '#00ff00' },
    force: { name: 'Force', color: '#ff66ff' },
    necrotic: { name: 'Necrotic', color: '#660066' },
    radiant: { name: 'Radiant', color: '#ffff99' },
    poison: { name: 'Poison', color: '#00ff00' },
    psychic: { name: 'Psychic', color: '#ff00ff' },
    thunder: { name: 'Thunder', color: '#0066ff' }
};

// Duration types
const DURATION_TYPES = {
    ROUNDS: { name: 'Rounds', description: 'Effect lasts for a number of combat rounds' },
    MINUTES: { name: 'Minutes', description: 'Effect lasts for a number of minutes' }
};

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

// Rarity levels in order
const RARITY_LEVELS = ['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];

// Prefixes for item names
const PREFIXES = {
    weapon: ['Mighty', 'Sharp', 'Brutal', 'Savage', 'Fierce'],
    armor: ['Sturdy', 'Reinforced', 'Protective', 'Impenetrable', 'Stalwart'],
    accessory: ['Mystical', 'Enchanted', 'Arcane', 'Magical', 'Ethereal'],
    consumable: ['Potent', 'Effective', 'Powerful', 'Concentrated', 'Pure'],
    miscellaneous: ['Curious', 'Unusual', 'Strange', 'Peculiar', 'Odd']
};

// Suffixes for item names
const SUFFIXES = {
    weapon: ['of Power', 'of Destruction', 'of the Beast', 'of the Warrior', 'of Slaying'],
    armor: ['of Defense', 'of Protection', 'of Warding', 'of the Shield', 'of the Guardian'],
    accessory: ['of Magic', 'of Mystery', 'of the Arcane', 'of Power', 'of Energy'],
    consumable: ['of Restoration', 'of Healing', 'of Recovery', 'of Mending', 'of Vigor'],
    miscellaneous: ['of Wonder', 'of Secrets', 'of Mystery', 'of the Unknown', 'of Curiosity']
};

// Helper function to get a random element from an array
const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to determine if an item type should have stat generation sliders
const shouldShowStatSliders = (type) => {
    return !['miscellaneous', 'container', 'currency'].includes(type);
};

// Helper function to determine if an item type should have advanced options
const shouldShowAdvancedOptions = (type) => {
    return !['miscellaneous', 'container', 'currency'].includes(type);
};

// Generate item name
const generateItemName = (type, subtype, quality, weaponSlot, weaponHand, armorMaterial, armorSlot) => {
    const prefix = getRandomElement(PREFIXES[type] || PREFIXES.miscellaneous);
    const suffix = getRandomElement(SUFFIXES[type] || SUFFIXES.miscellaneous);

    // Get base name from subtype if available
    let baseName = '';
    if (subtype && ITEM_SUBTYPES[type] && ITEM_SUBTYPES[type][subtype]) {
        baseName = ITEM_SUBTYPES[type][subtype].name || '';
    }

    // If no subtype name, use type name
    if (!baseName) {
        baseName = type === 'miscellaneous' ? 'Trinket' : ITEM_TYPES[type].name;
    }

    // For weapons, add slot/hand info if available
    if (type === 'weapon' && weaponSlot) {
        let slotInfo = '';

        if (weaponSlot === 'TWO_HANDED') {
            slotInfo = 'Two-Handed';
        } else if (weaponSlot === 'RANGED') {
            slotInfo = 'Ranged';
        } else if (weaponSlot === 'ONE_HANDED' && weaponHand) {
            if (weaponHand === 'MAIN_HAND') {
                slotInfo = 'Main Hand';
            } else if (weaponHand === 'OFF_HAND') {
                slotInfo = 'Off Hand';
            }
        }

        // Add slot info to name if available
        if (slotInfo) {
            return `${prefix} ${slotInfo} ${baseName} ${suffix}`;
        }
    }

    // For armor, add material and slot info
    if (type === 'armor' && subtype && armorSlot) {
        const materialName = ITEM_SUBTYPES.armor[subtype]?.name || subtype.toLowerCase();
        const slotName = ARMOR_SLOTS[armorSlot]?.name || armorSlot;

        // Handle shield special case
        if (subtype === 'SHIELD' || armorSlot === 'offHand') {
            return `${prefix} ${materialName} Shield ${suffix}`;
        } else {
            return `${prefix} ${materialName} ${slotName} ${suffix}`;
        }
    }

    return `${prefix} ${baseName} ${suffix}`;
};

// Generate item description
const generateItemDescription = (type, subtype, quality) => {
    const descriptions = {
        weapon: [
            'A finely crafted weapon that feels perfectly balanced in your hand.',
            'This weapon has seen many battles, but remains in excellent condition.',
            'The craftsmanship of this weapon is remarkable, with intricate details along its surface.'
        ],
        armor: [
            'This armor provides excellent protection without sacrificing mobility.',
            'Sturdy armor that has been well-maintained and reinforced at key points.',
            'The design of this armor suggests it was made for someone of great importance.'
        ],
        accessory: [
            'This accessory seems to pulse with a faint magical energy.',
            'A beautifully crafted accessory that draws attention wherever it goes.',
            'There\'s something special about this accessory that you can\'t quite place.'
        ],
        consumable: [
            'The contents swirl with vibrant colors and give off a pleasant aroma.',
            'This appears to be a high-quality consumable made with rare ingredients.',
            'You can feel the potency of this item even before using it.'
        ],
        miscellaneous: [
            'An unusual item with no immediately obvious purpose.',
            'This curious object seems to have some significance, though it\'s unclear what.',
            'There must be a reason someone would keep such an odd trinket.'
        ]
    };

    return getRandomElement(descriptions[type] || descriptions.miscellaneous);
};

const EnhancedQuickItemWizard = ({ onComplete, onCancel, initialData, onRarityChange }) => {
    // State for item properties
    const [type, setType] = useState(initialData?.type || 'weapon');
    const [subtype, setSubtype] = useState(() => {
        if (initialData?.subtype) return initialData.subtype;
        // Set default subtype based on type
        const defaultType = initialData?.type || 'weapon';
        if (ITEM_SUBTYPES[defaultType]) {
            return Object.keys(ITEM_SUBTYPES[defaultType])[0];
        }
        return '';
    });
    const [powerLevel, setPowerLevel] = useState(0.5); // 0.1 to 1.0
    const [rarityLevel, setRarityLevel] = useState(2); // Index in RARITY_LEVELS (0-6)
    const [complexity, setComplexity] = useState(0.3); // 0.1 to 1.0
    const [isGenerating, setIsGenerating] = useState(false);

    // State for weapon properties
    const [weaponSlot, setWeaponSlot] = useState('ONE_HANDED');
    const [weaponHand, setWeaponHand] = useState('ONE_HAND');

    // State for armor properties
    const [armorSlot, setArmorSlot] = useState('chest');

    // Additional state for consumables
    const [durationType, setDurationType] = useState('ROUNDS');
    const [durationValue, setDurationValue] = useState(3);

    // Additional state for resistances and damage types
    const [selectedDamageType, setSelectedDamageType] = useState('');
    const [includeResistances, setIncludeResistances] = useState(false);
    const [includeSpellPower, setIncludeSpellPower] = useState(false);

    // Additional state for advanced stats
    const [includeHealthMana, setIncludeHealthMana] = useState(false);
    const [includeRegen, setIncludeRegen] = useState(false);
    const [includeHealingPower, setIncludeHealingPower] = useState(false);


    // Specialized item options
    const [miscOptions, setMiscOptions] = useState({
        // Quest options
        questGiver: '',
        questObjectives: '',
        requiredLevel: 1,
        timeLimit: 0,
        questChain: '',

        // Reagent options
        reagentType: 'herb',
        magicType: 'fire',
        reagentState: 'raw',
        requiredFor: '',
        quantityPerUse: 1,
        preservationMethod: 'fresh',
        magicalProperties: '',
        source: '',

        // Crafting options
        materialType: 'metal',
        professions: [],
        gatheringMethod: 'mining',
        recipes: '',
        sourceLocations: '',
        specialProperties: '',

        // Trade goods options
        tradeCategory: 'textiles',
        origin: '',
        demandLevel: 'moderate',
        qualityGrade: 'standard',
        merchantNotes: '',

        // Key options
        unlocks: '',
        location: '',
        securityLevel: 'low',
        oneTimeUse: false,
        specialInstructions: '',

        // Junk options
        junkType: 'debris',
        condition: 'poor',
        origin: '',
        estimatedValue: ''
    });

    const [containerOptions, setContainerOptions] = useState({
        rows: 4,
        cols: 6,
        isLocked: false,
        lockType: 'none',
        lockDC: 10,
        fillPercentage: 0,
        itemQuality: 'common',
        itemTypes: {
            weapons: false,
            armor: false,
            accessories: false,
            consumables: true,
            miscellaneous: true,
            currency: true
        }
    });

    const [currencyOptions, setCurrencyOptions] = useState({
        gold: 0,
        silver: 5,
        copper: 0,
        purseType: 'COIN_PURSE',
        isRandomized: false,
        randomVariance: 20 // percentage variance for randomization
    });

    // State for flat vs percentage toggles
    const [healthManaFlat, setHealthManaFlat] = useState(false);
    const [regenFlat, setRegenFlat] = useState(true);
    const [healingPowerFlat, setHealingPowerFlat] = useState(false);
    const [spellPowerFlat, setSpellPowerFlat] = useState(true);

    // State for preview item
    const [previewItem, setPreviewItem] = useState(null);

    // State for icon selection
    const [selectedIcon, setSelectedIcon] = useState('');
    const [showIconSelector, setShowIconSelector] = useState(false);

    // Generate items for container filling
    const generateContainerItems = useCallback((containerOpts) => {
        if (!containerOpts.fillPercentage || containerOpts.fillPercentage === 0) {
            return [];
        }

        const totalSlots = containerOpts.rows * containerOpts.cols;
        const itemsToGenerate = Math.ceil((totalSlots * containerOpts.fillPercentage) / 100);
        const generatedItems = [];

        // Get enabled item types and map to singular forms
        const typeMapping = {
            'weapons': 'weapon',
            'armor': 'armor',
            'accessories': 'accessory',
            'consumables': 'consumable',
            'miscellaneous': 'miscellaneous',
            'currency': 'currency'
        };

        const enabledTypes = Object.entries(containerOpts.itemTypes)
            .filter(([type, enabled]) => enabled)
            .map(([type]) => typeMapping[type])
            .filter(type => type); // Remove any undefined mappings

        if (enabledTypes.length === 0) {
            return [];
        }

        // Track occupied positions
        const occupiedPositions = new Set();

        for (let i = 0; i < itemsToGenerate; i++) {
            // Select random item type from enabled types
            const randomType = enabledTypes[getRandomInt(0, enabledTypes.length - 1)];

            // Generate a simple item
            const itemId = `container_item_${Date.now()}_${i}`;

            // Select appropriate subtype based on item type
            let itemSubtype = '';
            if (randomType === 'weapon') {
                const weaponSubtypes = ['SWORD', 'DAGGER', 'AXE', 'MACE', 'STAFF', 'BOW'];
                itemSubtype = weaponSubtypes[getRandomInt(0, weaponSubtypes.length - 1)];
            } else if (randomType === 'armor') {
                const armorSubtypes = ['LEATHER', 'CHAIN', 'PLATE', 'CLOTH'];
                itemSubtype = armorSubtypes[getRandomInt(0, armorSubtypes.length - 1)];
            } else if (randomType === 'accessory') {
                const accessorySubtypes = ['RING', 'NECKLACE', 'TRINKET'];
                itemSubtype = accessorySubtypes[getRandomInt(0, accessorySubtypes.length - 1)];
            } else if (randomType === 'consumable') {
                const consumableSubtypes = ['POTION', 'SCROLL', 'FOOD'];
                itemSubtype = consumableSubtypes[getRandomInt(0, consumableSubtypes.length - 1)];
            } else if (randomType === 'miscellaneous') {
                const miscSubtypes = ['REAGENT', 'GEM', 'KEY'];
                itemSubtype = miscSubtypes[getRandomInt(0, miscSubtypes.length - 1)];
            } else if (randomType === 'currency') {
                itemSubtype = 'COINS';
            }

            // Generate item dimensions based on type
            let itemWidth = 1;
            let itemHeight = 1;

            if (randomType === 'weapon') {
                // Weapons can be 1x2, 1x3, or 2x1
                const weaponSizes = [
                    { width: 1, height: 2 }, // Sword, dagger
                    { width: 1, height: 3 }, // Staff, polearm
                    { width: 2, height: 1 }, // Bow, crossbow
                    { width: 1, height: 1 }  // Small weapons
                ];
                const size = weaponSizes[getRandomInt(0, weaponSizes.length - 1)];
                itemWidth = size.width;
                itemHeight = size.height;
            } else if (randomType === 'armor') {
                // Armor can be 2x2, 2x3, or 1x2
                const armorSizes = [
                    { width: 2, height: 2 }, // Chest armor
                    { width: 2, height: 3 }, // Large armor
                    { width: 1, height: 2 }, // Boots, gloves
                    { width: 1, height: 1 }  // Small armor pieces
                ];
                const size = armorSizes[getRandomInt(0, armorSizes.length - 1)];
                itemWidth = size.width;
                itemHeight = size.height;
            } else if (randomType === 'consumable') {
                // Consumables are usually small
                itemWidth = 1;
                itemHeight = 1;
            } else if (randomType === 'accessory') {
                // Accessories are small
                itemWidth = 1;
                itemHeight = 1;
            } else {
                // Miscellaneous and currency items
                itemWidth = 1;
                itemHeight = 1;
            }

            // Calculate power multiplier for all item types that need it
            const qualityMultiplier = QUALITY_MULTIPLIERS[containerOpts.itemQuality] || 1;
            const powerLevel = getRandomInt(3, 8) / 10; // Random power level between 0.3-0.8
            const powerMultiplier = powerLevel * qualityMultiplier;

            // Generate basic item properties
            const item = {
                id: itemId,
                name: generateItemName(randomType, itemSubtype, containerOpts.itemQuality),
                quality: containerOpts.itemQuality,
                description: generateItemDescription(randomType, itemSubtype, containerOpts.itemQuality),
                type: randomType,
                subtype: itemSubtype,
                iconId: getRandomIconForType(randomType, itemSubtype),
                imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${getRandomIconForType(randomType, itemSubtype)}.jpg`,
                value: (() => {
                    // Calculate base value based on power and quality
                    const baseValue = Math.max(1, Math.floor(powerMultiplier * getRandomInt(5, 25)));

                    // Convert to gold/silver/copper
                    const gold = Math.floor(baseValue / 100);
                    const remaining = baseValue % 100;
                    const silver = Math.floor(remaining / 10);
                    const copper = remaining % 10;

                    return {
                        gold: gold,
                        silver: silver,
                        copper: copper || (gold === 0 && silver === 0 ? 1 : 0) // Ensure at least 1 copper if no other value
                    };
                })(),
                width: itemWidth,
                height: itemHeight,
                rotation: 0,
                stackable: randomType === 'consumable' || randomType === 'miscellaneous' || randomType === 'currency',
                maxStackSize: randomType === 'consumable' || randomType === 'miscellaneous' || randomType === 'currency' ? 5 : 1
            };

            // Generate stats for items that should have them
            if (randomType === 'weapon' || randomType === 'armor' || randomType === 'accessory') {

                // Generate base stats
                const baseStats = {};
                const possibleStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
                const numStats = getRandomInt(1, 3); // 1-3 stats per item

                for (let s = 0; s < numStats; s++) {
                    if (possibleStats.length > 0) {
                        const randomIndex = getRandomInt(0, possibleStats.length - 1);
                        const stat = possibleStats.splice(randomIndex, 1)[0];
                        baseStats[stat] = {
                            value: Math.max(1, Math.floor(powerMultiplier * getRandomInt(2, 6))),
                            isPercentage: false
                        };
                    }
                }

                // Add type-specific stats
                if (randomType === 'weapon') {
                    // Add weapon damage with proper dice notation
                    const damageTypes = ['slashing', 'piercing', 'bludgeoning'];
                    const damageType = damageTypes[getRandomInt(0, damageTypes.length - 1)];

                    // Generate dice damage based on weapon size and power
                    let diceCount = 1;
                    let diceType = 4;

                    if (itemWidth === 2 || itemHeight === 3) {
                        // Two-handed weapons get better dice
                        if (powerLevel < 0.4) {
                            diceCount = 1;
                            diceType = 8;
                        } else if (powerLevel < 0.7) {
                            diceCount = 1;
                            diceType = 10;
                        } else {
                            diceCount = 2;
                            diceType = 6;
                        }
                    } else {
                        // One-handed weapons
                        if (powerLevel < 0.4) {
                            diceCount = 1;
                            diceType = 4;
                        } else if (powerLevel < 0.7) {
                            diceCount = 1;
                            diceType = 6;
                        } else {
                            diceCount = 1;
                            diceType = 8;
                        }
                    }

                    const damageBonus = Math.floor(powerMultiplier * getRandomInt(0, 3));

                    // Add bonus damage type for higher quality items
                    let bonusDamageType = null;
                    if (containerOpts.itemQuality !== 'poor' && containerOpts.itemQuality !== 'common' && damageBonus > 0) {
                        const bonusDamageTypes = ['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder'];
                        bonusDamageType = bonusDamageTypes[getRandomInt(0, bonusDamageTypes.length - 1)];
                    }

                    item.weaponStats = {
                        baseDamage: {
                            diceCount: diceCount,
                            diceType: diceType, // Already a number now
                            damageType: damageType,
                            bonusDamage: damageBonus,
                            bonusDamageType: bonusDamageType,
                            display: {
                                base: `${diceCount}d${diceType}`, // Clean format
                                type: damageType,
                                bonus: damageBonus > 0 ? damageBonus : null,
                                bonusType: bonusDamageType
                            }
                        }
                    };

                    // Set weapon slots
                    if (itemWidth === 2 || itemHeight === 3) {
                        item.slots = ['mainHand']; // Two-handed weapons only go in main hand
                        item.weaponSlot = 'TWO_HANDED';
                    } else {
                        item.slots = ['mainHand', 'offHand']; // One-handed weapons can go in either hand
                        item.weaponSlot = 'ONE_HANDED';
                        item.hand = 'ONE_HAND';
                    }
                } else if (randomType === 'armor') {
                    // Add armor class
                    item.armorClass = Math.max(1, Math.floor(powerMultiplier * getRandomInt(3, 8)));

                    // Set armor slots based on item size and type
                    let armorSlot = 'chest'; // default
                    if (itemWidth === 2 && itemHeight === 3) {
                        armorSlot = 'chest'; // Large armor pieces
                    } else if (itemWidth === 2 && itemHeight === 2) {
                        armorSlot = 'chest'; // Medium armor pieces
                    } else if (itemWidth === 1 && itemHeight === 2) {
                        const smallSlots = ['legs', 'feet', 'hands'];
                        armorSlot = smallSlots[getRandomInt(0, smallSlots.length - 1)];
                    } else {
                        const allSlots = ['head', 'chest', 'legs', 'feet', 'hands'];
                        armorSlot = allSlots[getRandomInt(0, allSlots.length - 1)];
                    }
                    item.slots = [armorSlot];

                    // Store the armor slot for name generation
                    item.armorSlot = armorSlot;
                } else if (randomType === 'accessory') {
                    // Set accessory slots based on subtype
                    let accessorySlot = 'trinket';
                    if (itemSubtype === 'RING') {
                        accessorySlot = 'finger';
                    } else if (itemSubtype === 'NECKLACE') {
                        accessorySlot = 'neck';
                    } else if (itemSubtype === 'TRINKET') {
                        accessorySlot = 'trinket';
                    }
                    item.slots = [accessorySlot];
                }

                // Add base stats to item
                if (Object.keys(baseStats).length > 0) {
                    item.baseStats = baseStats;
                }
            }

            // Add currency-specific properties
            if (randomType === 'currency') {
                const coinValue = getRandomInt(1, 20);
                item.currencyValue = {
                    gold: Math.floor(coinValue / 10),
                    silver: Math.floor((coinValue % 10) / 2),
                    copper: coinValue % 2
                };
                item.isCurrency = true;
            }

            // Add consumable-specific properties
            if (randomType === 'consumable') {
                // Add immediate use effects based on subtype
                const combatStats = {};
                const utilityStats = {};

                if (itemSubtype === 'POTION' || !itemSubtype) {
                    // Potions primarily restore health
                    combatStats.healthRestore = {
                        value: Math.max(10, Math.floor(powerMultiplier * getRandomInt(15, 35))),
                        isPercentage: false
                    };
                    // 30% chance for mana restore too
                    if (Math.random() < 0.3) {
                        combatStats.manaRestore = {
                            value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 20))),
                            isPercentage: false
                        };
                    }
                } else if (itemSubtype === 'ELIXIR') {
                    // Elixirs primarily restore mana
                    combatStats.manaRestore = {
                        value: Math.max(10, Math.floor(powerMultiplier * getRandomInt(15, 30))),
                        isPercentage: false
                    };
                    // 30% chance for health restore too
                    if (Math.random() < 0.3) {
                        combatStats.healthRestore = {
                            value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 20))),
                            isPercentage: false
                        };
                    }
                } else if (itemSubtype === 'FOOD') {
                    // Food restores both but smaller amounts
                    combatStats.healthRestore = {
                        value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 18))),
                        isPercentage: false
                    };
                    combatStats.manaRestore = {
                        value: Math.max(3, Math.floor(powerMultiplier * getRandomInt(5, 12))),
                        isPercentage: false
                    };
                } else {
                    // Default fallback (SCROLL, etc.)
                    combatStats.healthRestore = {
                        value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(10, 25))),
                        isPercentage: false
                    };
                }

                // Add duration for consumables
                utilityStats.duration = {
                    type: 'ROUNDS',
                    value: getRandomInt(3, 10)
                };

                // Add the stats to the item
                item.combatStats = combatStats;
                item.utilityStats = utilityStats;

                // Add use effects for proper tooltip display
                item.useEffects = {
                    onUse: true,
                    effects: []
                };

                // Add health/mana restore effects
                if (combatStats.healthRestore) {
                    item.useEffects.effects.push({
                        type: 'HEAL',
                        value: combatStats.healthRestore.value,
                        isPercentage: combatStats.healthRestore.isPercentage,
                        description: `Restores ${combatStats.healthRestore.value}${combatStats.healthRestore.isPercentage ? '%' : ''} health.`
                    });
                }

                if (combatStats.manaRestore) {
                    item.useEffects.effects.push({
                        type: 'MANA_RESTORE',
                        value: combatStats.manaRestore.value,
                        isPercentage: combatStats.manaRestore.isPercentage,
                        description: `Restores ${combatStats.manaRestore.value}${combatStats.manaRestore.isPercentage ? '%' : ''} mana.`
                    });
                }

                // Add duration info
                if (utilityStats.duration) {
                    item.useEffects.duration = {
                        type: utilityStats.duration.type,
                        value: utilityStats.duration.value
                    };
                }

                item.isConsumable = true;
                item.charges = 1; // Single use
            }

            // Find a valid position for the item
            let position = null;
            let attempts = 0;
            const maxAttempts = totalSlots * 2;

            while (!position && attempts < maxAttempts) {
                const row = getRandomInt(0, containerOpts.rows - itemHeight);
                const col = getRandomInt(0, containerOpts.cols - itemWidth);

                // Check if all cells for this item are free
                let canPlace = true;
                for (let r = 0; r < itemHeight; r++) {
                    for (let c = 0; c < itemWidth; c++) {
                        const posKey = `${row + r}-${col + c}`;
                        if (occupiedPositions.has(posKey)) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (!canPlace) break;
                }

                if (canPlace) {
                    position = { row, col };
                    // Mark all cells as occupied
                    for (let r = 0; r < itemHeight; r++) {
                        for (let c = 0; c < itemWidth; c++) {
                            const posKey = `${row + r}-${col + c}`;
                            occupiedPositions.add(posKey);
                        }
                    }
                }
                attempts++;
            }

            if (position) {
                item.position = position;
                generatedItems.push(item);
            }
        }

        return generatedItems;
    }, []);

    // Helper function to get random icon for item type
    const getRandomIconForType = (type, subtype) => {
        const iconMaps = {
            weapon: ['inv_sword_04', 'inv_axe_09', 'inv_hammer_05', 'inv_staff_13'],
            armor: ['inv_chest_leather_01', 'inv_helmet_03', 'inv_boots_05', 'inv_gauntlets_04'],
            accessory: ['inv_jewelry_ring_01', 'inv_jewelry_necklace_01', 'inv_misc_gem_01'],
            consumable: ['inv_potion_54', 'inv_potion_81', 'inv_scroll_03', 'inv_misc_food_15'],
            miscellaneous: ['inv_misc_herb_01', 'inv_misc_gem_variety_01', 'inv_misc_key_01'],
            currency: ['inv_misc_coin_01', 'inv_misc_coin_02', 'inv_misc_coin_16']
        };

        const icons = iconMaps[type] || ['inv_misc_questionmark'];
        return icons[getRandomInt(0, icons.length - 1)];
    };

    // Generate a preview item whenever settings change
    const generatePreviewItem = useCallback(() => {
        console.log('Generating preview item...');
        const quality = RARITY_LEVELS[rarityLevel];
        const itemSubtype = subtype || (ITEM_SUBTYPES[type] ? Object.keys(ITEM_SUBTYPES[type])[0] : '');

        // Generate item name and description
        let name = generateItemName(type, itemSubtype, quality, weaponSlot, weaponHand, null, armorSlot);

        // Special name handling for currency
        if (type === 'currency') {
            let gold = currencyOptions.gold;
            let silver = currencyOptions.silver;
            let copper = currencyOptions.copper;

            // Apply randomization if enabled
            if (currencyOptions.isRandomized) {
                const variance = currencyOptions.randomVariance / 100;
                gold = Math.max(0, Math.floor(gold * (1 + (Math.random() - 0.5) * 2 * variance)));
                silver = Math.max(0, Math.floor(silver * (1 + (Math.random() - 0.5) * 2 * variance)));
                copper = Math.max(0, Math.floor(copper * (1 + (Math.random() - 0.5) * 2 * variance)));
            }

            let displayName = '';
            if (gold > 0) displayName += `${gold}g `;
            if (silver > 0) displayName += `${silver}s `;
            if (copper > 0) displayName += `${copper}c`;
            name = displayName.trim() || '1c';
        }

        const description = generateItemDescription(type, itemSubtype, quality);

        // Generate item icon based on type and subtype, or use selected icon
        const iconId = selectedIcon || ITEM_TYPES[type]?.icon || 'inv_misc_questionmark';

        // Calculate stats based on power level and quality
        const powerMultiplier = powerLevel * QUALITY_MULTIPLIERS[quality];

        // Generate base stats
        const baseStats = {};

        // Skip stat generation for specialized item types or when power level is at minimum
        const shouldGenerateStats = !['miscellaneous', 'container', 'currency'].includes(type) && powerLevel > 0.1;

        if (shouldGenerateStats) {
            const possibleStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];

            // Number of stats based on complexity
            const numStats = Math.max(1, Math.floor(complexity * 4));

            // Randomly select stats
            const selectedStats = [];
            for (let i = 0; i < numStats && i < possibleStats.length; i++) {
                const randomIndex = getRandomInt(0, possibleStats.length - 1 - i);
                const stat = possibleStats.splice(randomIndex, 1)[0];
                selectedStats.push(stat);
            }

            // Assign values to selected stats
            selectedStats.forEach(stat => {
                baseStats[stat] = {
                    value: Math.max(1, Math.floor(powerMultiplier * getRandomInt(1, 5))),
                    isPercentage: false
                };
            });
        }

        // Generate combat stats
        const combatStats = {};

        // Add armor if it's armor type
        if (type === 'armor') {
            combatStats.armorClass = {
                value: Math.max(1, Math.floor(powerMultiplier * getRandomInt(5, 15))),
                isPercentage: false
            };
        }

        // Add slots for armor
        let slots = [];
        if (type === 'armor') {
            // Use the selected armor slot, or handle shield special case
            if (itemSubtype === 'SHIELD' || armorSlot === 'offHand') {
                slots = ['offHand'];
            } else {
                slots = [armorSlot];
            }
        } else if (type === 'accessory') {
            switch (itemSubtype) {
                case 'RING':
                    slots = ['finger'];
                    break;
                case 'NECKLACE':
                    slots = ['neck'];
                    break;
                case 'TRINKET':
                    slots = ['trinket'];
                    break;
                case 'CLOAK':
                    slots = ['back'];
                    break;
                case 'BELT':
                    slots = ['waist'];
                    break;
                default:
                    slots = ['trinket'];
            }
        } else if (type === 'weapon') {
            // Use the explicitly selected weapon slot and hand options
            if (weaponSlot === 'TWO_HANDED') {
                // Two-handed weapons only go in main hand slot
                slots = ['mainHand'];
            } else if (weaponSlot === 'RANGED') {
                // Ranged weapons
                slots = ['ranged'];
            } else if (weaponSlot === 'ONE_HANDED') {
                // One-handed weapons
                if (weaponHand === 'MAIN_HAND') {
                    slots = ['mainHand'];
                } else if (weaponHand === 'OFF_HAND') {
                    slots = ['offHand'];
                } else if (weaponHand === 'ONE_HAND') {
                    // ONE_HAND can go in either hand
                    slots = ['mainHand', 'offHand'];
                } else {
                    // Default to main hand if no hand specified
                    slots = ['mainHand'];
                }
            } else {
                // If no weapon slot is selected, get default from subtype
                const subtypeInfo = itemSubtype ? ITEM_SUBTYPES.weapon[itemSubtype] : null;

                if (subtypeInfo) {
                    if (subtypeInfo.slot === 'TWO_HANDED') {
                        slots = ['mainHand'];
                    } else if (subtypeInfo.slot === 'RANGED') {
                        slots = ['ranged'];
                    } else if (subtypeInfo.slot === 'ONE_HANDED') {
                        if (subtypeInfo.defaultHand === 'MAIN_HAND') {
                            slots = ['mainHand'];
                        } else if (subtypeInfo.defaultHand === 'OFF_HAND') {
                            slots = ['offHand'];
                        } else {
                            slots = ['mainHand', 'offHand'];
                        }
                    } else {
                        slots = ['mainHand'];
                    }
                } else {
                    // Default to main hand if no specific info
                    slots = ['mainHand'];
                }
            }
        }

        // Add damage if it's a weapon
        let weaponStats = null;
        if (type === 'weapon') {
            // Generate dice damage based on weapon type and power
            let diceCount = 1;
            let diceType = 'd4';

            // Scale dice with power and rarity
            if (powerLevel < 0.3) {
                diceCount = 1;
                diceType = 'd4';
            } else if (powerLevel < 0.6) {
                diceCount = 1;
                diceType = 'd6';
            } else if (powerLevel < 0.8) {
                diceCount = 1;
                diceType = 'd8';
            } else if (powerLevel < 0.9) {
                diceCount = 2;
                diceType = 'd6';
            } else {
                diceCount = 2;
                diceType = 'd8';
            }

            // Determine physical damage type based on weapon subtype
            let physicalDamageType = 'slashing'; // default

            // If user has selected a specific damage type, use that
            if (selectedDamageType) {
                physicalDamageType = selectedDamageType;
            }
            // Otherwise get damage type from the subtype definition if available
            else if (itemSubtype && ITEM_SUBTYPES.weapon[itemSubtype]?.damageType) {
                physicalDamageType = ITEM_SUBTYPES.weapon[itemSubtype].damageType;
            }
            // Fallback to default damage types based on weapon category
            else {
                switch (weaponSlot) {
                    case 'ONE_HANDED':
                        physicalDamageType = 'slashing'; // Default for one-handed
                        break;
                    case 'TWO_HANDED':
                        physicalDamageType = 'slashing'; // Default for two-handed
                        break;
                    case 'RANGED':
                        physicalDamageType = 'piercing'; // Default for ranged
                        break;
                    default:
                        physicalDamageType = getRandomElement(['slashing', 'piercing', 'bludgeoning']);
                }
            }

            // Adjust based on weapon type
            if (itemSubtype === 'DAGGER') {
                diceType = 'd4';
            } else if (itemSubtype === 'STAFF' || itemSubtype === 'POLEARM') {
                if (diceType === 'd4') diceType = 'd6';
                if (diceType === 'd6') diceType = 'd8';
            }

            // Determine bonus damage type
            // 70% chance to be the same as main damage, 30% chance to be a different type
            const bonusDamageType = Math.random() < 0.7
                ? (selectedDamageType || physicalDamageType)
                : getRandomElement(Object.keys(DAMAGE_TYPES).filter(type =>
                    type !== (selectedDamageType || physicalDamageType)));

            weaponStats = {
                damageType: selectedDamageType || physicalDamageType,
                damageMin: Math.max(1, Math.floor(powerMultiplier * getRandomInt(1, 3))),
                damageMax: Math.max(2, Math.floor(powerMultiplier * getRandomInt(4, 8))),

                baseDamage: {
                    diceCount: diceCount,
                    diceType: diceType,
                    damageType: selectedDamageType || physicalDamageType,
                    bonusDamage: Math.floor(powerMultiplier * 2),
                    bonusDamageType: bonusDamageType
                }
            };
        }

        // Add additional combat stats based on complexity and user selections
        // Skip combat stats for specialized item types or when power level is at minimum
        if (!shouldGenerateStats) {
            // No combat stats for specialized items or zero power level
        }

        // Add max health/mana bonus if enabled or high complexity (only for stat-generating items)
        if (shouldGenerateStats && (includeHealthMana || complexity > 0.6)) {
            combatStats.maxHealth = {
                value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(5, 20))),
                isPercentage: !healthManaFlat
            };

            combatStats.maxMana = {
                value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(5, 15))),
                isPercentage: !healthManaFlat
            };
        }

        // Add health/mana regen if enabled or high complexity (only for stat-generating items)
        if (shouldGenerateStats && (includeRegen || complexity > 0.7)) {
            combatStats.healthRegen = {
                value: Math.max(1, Math.floor(powerMultiplier * getRandomInt(1, 3))),
                isPercentage: !regenFlat
            };

            combatStats.manaRegen = {
                value: Math.max(1, Math.floor(powerMultiplier * getRandomInt(1, 3))),
                isPercentage: !regenFlat
            };
        }

        // Add healing power if enabled or high complexity (only for stat-generating items)
        if (shouldGenerateStats && (includeHealingPower || complexity > 0.7)) {
            combatStats.healingPower = {
                value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(5, 15))),
                isPercentage: !healingPowerFlat
            };
        }



        // Add resistances if enabled (only for stat-generating items)
        if (shouldGenerateStats && includeResistances) {
            combatStats.resistances = {};
            // Add 1-3 resistances based on complexity
            const numResistances = Math.max(1, Math.floor(complexity * 3));
            const possibleResistances = [...Object.keys(DAMAGE_TYPES)];

            for (let i = 0; i < numResistances && possibleResistances.length > 0; i++) {
                const randomIndex = getRandomInt(0, possibleResistances.length - 1);
                const resistanceType = possibleResistances.splice(randomIndex, 1)[0];

                combatStats.resistances[resistanceType] = {
                    value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(5, 20))),
                    isPercentage: true,
                    resistant: true
                };
            }
        }

        // Add spell power if enabled (only for stat-generating items)
        if (shouldGenerateStats && includeSpellPower) {
            combatStats.spellDamage = {
                types: {}
            };

            // Add 1-2 spell damage types based on complexity
            const numSpellTypes = Math.max(1, Math.floor(complexity * 2));
            const possibleSpellTypes = [...Object.keys(DAMAGE_TYPES)];

            for (let i = 0; i < numSpellTypes && possibleSpellTypes.length > 0; i++) {
                const randomIndex = getRandomInt(0, possibleSpellTypes.length - 1);
                const spellType = possibleSpellTypes.splice(randomIndex, 1)[0];

                combatStats.spellDamage.types[spellType] = {
                    value: Math.max(2, Math.floor(powerMultiplier * getRandomInt(2, 10))),
                    isPercentage: !spellPowerFlat
                };
            }
        }

        // Add health/mana restore for consumables
        if (type === 'consumable') {
            // Always give consumables immediate effects based on subtype
            if (itemSubtype === 'POTION' || !itemSubtype) {
                // Potions primarily restore health
                combatStats.healthRestore = {
                    value: Math.max(10, Math.floor(powerMultiplier * getRandomInt(15, 35))),
                    isPercentage: false
                };
                // 30% chance for mana restore too
                if (Math.random() < 0.3) {
                    combatStats.manaRestore = {
                        value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 20))),
                        isPercentage: false
                    };
                }
            } else if (itemSubtype === 'ELIXIR') {
                // Elixirs primarily restore mana
                combatStats.manaRestore = {
                    value: Math.max(10, Math.floor(powerMultiplier * getRandomInt(15, 30))),
                    isPercentage: false
                };
                // 30% chance for health restore too
                if (Math.random() < 0.3) {
                    combatStats.healthRestore = {
                        value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 20))),
                        isPercentage: false
                    };
                }
            } else if (itemSubtype === 'FOOD') {
                // Food restores both but smaller amounts
                combatStats.healthRestore = {
                    value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(8, 18))),
                    isPercentage: false
                };
                combatStats.manaRestore = {
                    value: Math.max(3, Math.floor(powerMultiplier * getRandomInt(5, 12))),
                    isPercentage: false
                };
            } else {
                // Default fallback (SCROLL, etc.)
                combatStats.healthRestore = {
                    value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(10, 25))),
                    isPercentage: false
                };
            }
        }

        // Generate utility stats
        const utilityStats = {};

        // Add duration for consumables
        if (type === 'consumable') {
            utilityStats.duration = {
                type: durationType,
                value: durationValue
            };
        }

        // Add movement speed based on complexity (only for stat-generating items)
        if (shouldGenerateStats && complexity > 0.5 && Math.random() < 0.3) {
            utilityStats.movementSpeed = {
                value: Math.max(5, Math.floor(powerMultiplier * getRandomInt(5, 15))),
                isPercentage: true
            };
        }

        // Add carrying capacity for containers or accessories
        if ((type === 'container' || type === 'accessory') && complexity > 0.7) {
            utilityStats.carryingCapacity = {
                enabled: true,
                slots: Math.max(1, Math.floor(powerMultiplier * getRandomInt(1, 4)))
            };
        }

        // Create the preview item
        const item = {
            id: 'preview',
            name,
            quality,
            description,
            type,
            subtype: itemSubtype,
            iconId,
            baseStats,
            combatStats,
            weaponStats,
            utilityStats,
            slots, // Add equipment slots
            // Add weapon slot and hand information for weapons
            ...(type === 'weapon' ? {
                weaponSlot: weaponSlot,
                hand: weaponHand
            } : {}),
            value: (() => {
                // Calculate base value based on power and rarity
                const baseValue = Math.max(1, Math.floor(powerMultiplier * rarityLevel * 10));

                // Convert to gold/silver/copper
                const gold = Math.floor(baseValue / 100);
                const remaining = baseValue % 100;
                const silver = Math.floor(remaining / 10);
                const copper = remaining % 10;

                return {
                    gold: gold,
                    silver: silver,
                    copper: copper || (gold === 0 && silver === 0 ? 1 : 0) // Ensure at least 1 copper if no other value
                };
            })(),
            // Add stackable property for consumables and miscellaneous items
            ...(type === 'consumable' || type === 'miscellaneous' ? {
                stackable: true,
                maxStackSize: 5
            } : {}),

            // Add specialized properties based on item type
            ...(type === 'miscellaneous' && itemSubtype === 'QUEST' ? {
                questGiver: miscOptions.questGiver || 'Unknown',
                questObjectives: miscOptions.questObjectives || 'Bring this item to its rightful owner.',
                requiredLevel: miscOptions.requiredLevel,
                timeLimit: miscOptions.timeLimit,
                questChain: miscOptions.questChain
            } : {}),

            ...(type === 'miscellaneous' && itemSubtype === 'REAGENT' ? {
                reagentType: miscOptions.reagentType,
                magicType: miscOptions.magicType,
                reagentState: miscOptions.reagentState,
                requiredFor: miscOptions.requiredFor || 'Various magical concoctions',
                quantityPerUse: miscOptions.quantityPerUse,
                preservationMethod: miscOptions.preservationMethod,
                magicalProperties: miscOptions.magicalProperties,
                source: miscOptions.source
            } : {}),

            ...(type === 'miscellaneous' && itemSubtype === 'CRAFTING' ? {
                materialType: miscOptions.materialType,
                professions: miscOptions.professions,
                gatheringMethod: miscOptions.gatheringMethod,
                recipes: miscOptions.recipes,
                sourceLocations: miscOptions.sourceLocations,
                specialProperties: miscOptions.specialProperties
            } : {}),

            ...(type === 'miscellaneous' && itemSubtype === 'TRADE_GOODS' ? {
                tradeCategory: miscOptions.tradeCategory,
                origin: miscOptions.origin,
                demandLevel: miscOptions.demandLevel,
                qualityGrade: miscOptions.qualityGrade,
                merchantNotes: miscOptions.merchantNotes
            } : {}),

            ...(type === 'miscellaneous' && itemSubtype === 'KEY' ? {
                unlocks: miscOptions.unlocks,
                location: miscOptions.location,
                securityLevel: miscOptions.securityLevel,
                oneTimeUse: miscOptions.oneTimeUse,
                specialInstructions: miscOptions.specialInstructions
            } : {}),

            ...(type === 'miscellaneous' && itemSubtype === 'JUNK' ? {
                junkType: miscOptions.junkType,
                condition: miscOptions.condition,
                origin: miscOptions.origin,
                estimatedValue: miscOptions.estimatedValue
            } : {}),

            ...(type === 'container' ? {
                containerProperties: {
                    gridSize: {
                        rows: containerOptions.rows,
                        cols: containerOptions.cols
                    },
                    items: generateContainerItems(containerOptions),
                    isLocked: containerOptions.isLocked,
                    lockType: containerOptions.lockType,
                    lockDC: containerOptions.lockDC,
                    lockCode: '',
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
                    }
                }
            } : {}),

            ...(type === 'currency' ? {
                currencyType: currencyOptions.gold > 0 ? 'gold' : (currencyOptions.silver > 0 ? 'silver' : 'copper'),
                currencyValue: {
                    gold: currencyOptions.gold,
                    silver: currencyOptions.silver,
                    copper: currencyOptions.copper
                },
                isCurrency: true,
                purseType: currencyOptions.purseType,
                isRandomized: currencyOptions.isRandomized,
                randomVariance: currencyOptions.randomVariance
            } : {})
        };

        // Debug log for weapon slot and hand
        if (type === 'weapon') {
            console.log('Preview Item Weapon Info:', {
                weaponSlot,
                hand: weaponHand,
                itemWeaponSlot: item.weaponSlot,
                itemHand: item.hand
            });
        }

        // Add equip effects for better tooltip formatting
        if (Object.keys(baseStats).length > 0 ||
            (combatStats && Object.keys(combatStats).length > 0) ||
            (utilityStats && Object.keys(utilityStats).length > 0)) {

            item.equipEffects = {
                onEquip: true,
                effects: []
            };

            // Format base stats for tooltip
            Object.keys(baseStats).forEach(stat => {
                const value = baseStats[stat].value;
                const isPercentage = baseStats[stat].isPercentage;

                item.equipEffects.effects.push({
                    type: 'STAT_BONUS',
                    stat: stat,
                    value: value,
                    isPercentage: isPercentage,
                    description: `Increases ${stat} by ${value}${isPercentage ? '%' : ''}.`
                });
            });

            // Format combat stats for tooltip
            if (combatStats) {
                // Handle resistances
                if (combatStats.resistances) {
                    Object.keys(combatStats.resistances).forEach(resistType => {
                        const value = combatStats.resistances[resistType].value;

                        item.equipEffects.effects.push({
                            type: 'RESISTANCE',
                            damageType: resistType,
                            value: value,
                            isPercentage: true,
                            description: `Reduces ${resistType} damage taken by ${value}%.`
                        });
                    });
                }

                // Handle spell damage
                if (combatStats.spellDamage && combatStats.spellDamage.types) {
                    Object.keys(combatStats.spellDamage.types).forEach(spellType => {
                        const value = combatStats.spellDamage.types[spellType].value;
                        const isPercentage = combatStats.spellDamage.types[spellType].isPercentage;

                        item.equipEffects.effects.push({
                            type: 'SPELL_DAMAGE',
                            damageType: spellType,
                            value: value,
                            isPercentage: isPercentage,
                            description: `Increases ${spellType} spell damage by ${value}${isPercentage ? '%' : ''}.`
                        });
                    });
                }

                // Handle other combat stats
                // Initiative stat removed as it's not used in the character sheet system

                if (combatStats.maxHealth) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'maxHealth',
                        value: combatStats.maxHealth.value,
                        isPercentage: combatStats.maxHealth.isPercentage,
                        description: `Increases maximum health by ${combatStats.maxHealth.value}${combatStats.maxHealth.isPercentage ? '%' : ''}.`
                    });
                }

                if (combatStats.maxMana) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'maxMana',
                        value: combatStats.maxMana.value,
                        isPercentage: combatStats.maxMana.isPercentage,
                        description: `Increases maximum mana by ${combatStats.maxMana.value}${combatStats.maxMana.isPercentage ? '%' : ''}.`
                    });
                }

                if (combatStats.healthRegen) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'healthRegen',
                        value: combatStats.healthRegen.value,
                        isPercentage: combatStats.healthRegen.isPercentage,
                        description: `Increases health regeneration by ${combatStats.healthRegen.value}${combatStats.healthRegen.isPercentage ? '%' : ''} per round.`
                    });
                }

                if (combatStats.manaRegen) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'manaRegen',
                        value: combatStats.manaRegen.value,
                        isPercentage: combatStats.manaRegen.isPercentage,
                        description: `Increases mana regeneration by ${combatStats.manaRegen.value}${combatStats.manaRegen.isPercentage ? '%' : ''} per round.`
                    });
                }

                if (combatStats.healingPower) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'healingPower',
                        value: combatStats.healingPower.value,
                        isPercentage: combatStats.healingPower.isPercentage,
                        description: `Increases healing power by ${combatStats.healingPower.value}${combatStats.healingPower.isPercentage ? '%' : ''}.`
                    });
                }


            }

            // Format utility stats for tooltip
            if (utilityStats) {
                if (utilityStats.movementSpeed) {
                    item.equipEffects.effects.push({
                        type: 'STAT_BONUS',
                        stat: 'movementSpeed',
                        value: utilityStats.movementSpeed.value,
                        isPercentage: utilityStats.movementSpeed.isPercentage,
                        description: `Increases movement speed by ${utilityStats.movementSpeed.value}${utilityStats.movementSpeed.isPercentage ? '%' : ''}.`
                    });
                }

                if (utilityStats.carryingCapacity && utilityStats.carryingCapacity.enabled) {
                    item.equipEffects.effects.push({
                        type: 'INVENTORY_BONUS',
                        slots: utilityStats.carryingCapacity.slots,
                        description: `Adds ${utilityStats.carryingCapacity.slots} additional inventory slots.`
                    });
                }
            }
        }

        // Add use effects for consumables
        if (type === 'consumable') {
            item.useEffects = {
                onUse: true,
                effects: []
            };

            // Add health/mana restore effects
            if (combatStats.healthRestore) {
                item.useEffects.effects.push({
                    type: 'HEAL',
                    value: combatStats.healthRestore.value,
                    isPercentage: combatStats.healthRestore.isPercentage,
                    description: `Restores ${combatStats.healthRestore.value}${combatStats.healthRestore.isPercentage ? '%' : ''} health.`
                });
            }

            if (combatStats.manaRestore) {
                item.useEffects.effects.push({
                    type: 'MANA_RESTORE',
                    value: combatStats.manaRestore.value,
                    isPercentage: combatStats.manaRestore.isPercentage,
                    description: `Restores ${combatStats.manaRestore.value}${combatStats.manaRestore.isPercentage ? '%' : ''} mana.`
                });
            }

            // Add duration info
            if (utilityStats.duration) {
                item.useEffects.duration = {
                    type: utilityStats.duration.type,
                    value: utilityStats.duration.value
                };
            }
        }

        console.log('Setting preview item:', item);
        setPreviewItem(item);
    }, [
        type,
        subtype,
        powerLevel,
        rarityLevel,
        complexity,
        durationType,
        durationValue,
        selectedDamageType,
        includeResistances,
        includeSpellPower,
        includeHealthMana,
        includeRegen,
        includeHealingPower,

        weaponSlot,
        weaponHand,
        healthManaFlat,
        regenFlat,
        healingPowerFlat,
        spellPowerFlat,
        miscOptions,
        containerOptions,
        currencyOptions
    ]);

    // Update weapon slot and hand when subtype changes, but only on initial selection
    useEffect(() => {
        if (type === 'weapon' && subtype) {
            const weaponInfo = ITEM_SUBTYPES.weapon[subtype];
            if (weaponInfo) {
                // Only update if the user hasn't explicitly selected a slot/hand
                // or if the subtype has changed
                setWeaponSlot(prevSlot => {
                    // If user has already selected a slot, keep it
                    if (prevSlot && prevSlot !== '') {
                        return prevSlot;
                    }
                    return weaponInfo.slot || 'ONE_HANDED';
                });

                setWeaponHand(prevHand => {
                    // If user has already selected a hand, keep it
                    if (prevHand && prevHand !== '') {
                        return prevHand;
                    }
                    return weaponInfo.defaultHand || 'ONE_HAND';
                });

                // Force immediate preview update
                setTimeout(() => generatePreviewItem(), 0);
            }
        }
    }, [type, subtype, generatePreviewItem]);

    // Generate initial preview on mount
    useEffect(() => {
        console.log('Initial mount - generating preview with:', { type, subtype, rarityLevel, powerLevel });
        generatePreviewItem();
    }, [generatePreviewItem]);

    // Update preview when settings change
    useEffect(() => {
        generatePreviewItem();
    }, [
        type,
        subtype,
        powerLevel,
        rarityLevel,
        complexity,
        durationType,
        durationValue,
        selectedDamageType,
        includeResistances,
        includeSpellPower,
        includeHealthMana,
        includeRegen,
        includeHealingPower,

        weaponSlot,
        weaponHand,
        armorSlot,
        healthManaFlat,
        regenFlat,
        healingPowerFlat,
        spellPowerFlat,
        miscOptions,
        containerOptions,
        currencyOptions,
        selectedIcon,
        generatePreviewItem
    ]);

    // Handle shield special case
    useEffect(() => {
        if (subtype === 'SHIELD') {
            setArmorSlot('offHand');
        }
    }, [subtype]);

    // Notify parent of rarity changes for modal styling
    useEffect(() => {
        if (onRarityChange) {
            const currentRarity = RARITY_LEVELS[rarityLevel];
            const rarityColors = RARITY_COLORS[currentRarity];
            onRarityChange({
                rarity: currentRarity,
                colors: rarityColors
            });
        }
    }, [rarityLevel, onRarityChange]);

    // Generate a random ID
    const generateRandomId = () => {
        return 'item_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    // Handle generate button click
    const handleGenerate = () => {
        setIsGenerating(true);
        try {
            // Use the current preview item as the basis for the final item
            const finalItem = {
                ...previewItem,
                id: initialData?.id || generateRandomId()
            };
            onComplete(finalItem);
        } catch (error) {
            console.error('Error generating item:', error);
            alert('Failed to generate item. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="enhanced-quick-item-wizard">
            <h2>Quick Item Generator</h2>

            <div className="wizard-content">
                <div className="settings-panel">
                    <div className="form-group">
                        <label>Item Type</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                const newType = e.target.value;
                                setType(newType);
                                // Set default subtype for the new type
                                if (ITEM_SUBTYPES[newType]) {
                                    setSubtype(Object.keys(ITEM_SUBTYPES[newType])[0]);
                                } else {
                                    setSubtype('');
                                }
                            }}
                        >
                            {Object.keys(ITEM_TYPES).map((itemType) => (
                                <option key={itemType} value={itemType}>
                                    {ITEM_TYPES[itemType].name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {ITEM_SUBTYPES[type] && (
                        <div className="form-group">
                            <label>Subtype</label>
                            <select
                                value={subtype}
                                onChange={(e) => setSubtype(e.target.value)}
                            >
                                <option value="">Random</option>
                                {Object.keys(ITEM_SUBTYPES[type]).map((subType) => (
                                    <option key={subType} value={subType}>
                                        {ITEM_SUBTYPES[type][subType].name || ITEM_SUBTYPES[type][subType]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Icon Selection */}
                    <div className="form-group">
                        <label>Item Icon</label>
                        <div className="icon-selection-container">
                            <div className="current-icon-display" onClick={() => setShowIconSelector(true)}>
                                <img
                                    src={getIconUrl(selectedIcon || ITEM_TYPES[type]?.icon || 'inv_misc_questionmark')}
                                    alt="Item Icon"
                                    className="current-icon-image"
                                    onError={(e) => {
                                        e.target.src = getIconUrl('inv_misc_questionmark');
                                    }}
                                />
                                <div className="icon-change-overlay">
                                    <span>Click to Change</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="icon-select-button"
                                onClick={() => setShowIconSelector(true)}
                            >
                                Choose Icon
                            </button>
                            {selectedIcon && (
                                <button
                                    type="button"
                                    className="icon-reset-button"
                                    onClick={() => setSelectedIcon('')}
                                    title="Reset to default icon"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {type === 'armor' && (
                        <div className="form-group">
                            <label>Armor Slot</label>
                            <select
                                value={armorSlot}
                                onChange={(e) => setArmorSlot(e.target.value)}
                                disabled={subtype === 'SHIELD'}
                            >
                                {Object.keys(ARMOR_SLOTS).map((slot) => (
                                    <option key={slot} value={slot}>
                                        {ARMOR_SLOTS[slot].name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Only show stat generation sliders for items that can have stats */}
                    {shouldShowStatSliders(type) && (
                        <>
                            <div className="form-group">
                                <label>Power Level: {Math.round(powerLevel * 100)}%</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={powerLevel}
                                        onChange={(e) => setPowerLevel(parseFloat(e.target.value))}
                                        className="power-slider"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Rarity: {QUALITY_TYPES[RARITY_LEVELS[rarityLevel]].name}</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="6"
                                        step="1"
                                        value={rarityLevel}
                                        onChange={(e) => setRarityLevel(parseInt(e.target.value))}
                                        className="rarity-slider"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Complexity: {Math.round(complexity * 100)}%</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={complexity}
                                        onChange={(e) => setComplexity(parseFloat(e.target.value))}
                                        className="complexity-slider"
                                    />
                                </div>
                            </div>

                            {/* Advanced options - compact design right below complexity */}
                            {shouldShowAdvancedOptions(type) && (
                                <div className="form-group advanced-options-compact">
                                    <label>Advanced Options</label>
                                    <div className="advanced-options-grid">
                                        <div className="advanced-option-item">
                                            <label className="checkbox-label-compact">
                                                <input
                                                    type="checkbox"
                                                    checked={includeResistances}
                                                    onChange={(e) => setIncludeResistances(e.target.checked)}
                                                />
                                                <span>Resistances</span>
                                            </label>
                                        </div>

                                        <div className="advanced-option-item">
                                            <label className="checkbox-label-compact">
                                                <input
                                                    type="checkbox"
                                                    checked={includeSpellPower}
                                                    onChange={(e) => setIncludeSpellPower(e.target.checked)}
                                                />
                                                <span>Spell Power</span>
                                            </label>
                                            {includeSpellPower && (
                                                <div className="sub-option-toggle">
                                                    <button
                                                        className={`mini-toggle ${spellPowerFlat ? 'active' : ''}`}
                                                        onClick={() => setSpellPowerFlat(true)}
                                                        title="Flat spell power bonus"
                                                    >
                                                        Flat
                                                    </button>
                                                    <button
                                                        className={`mini-toggle ${!spellPowerFlat ? 'active' : ''}`}
                                                        onClick={() => setSpellPowerFlat(false)}
                                                        title="Percentage spell power bonus"
                                                    >
                                                        %
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="advanced-option-item">
                                            <label className="checkbox-label-compact">
                                                <input
                                                    type="checkbox"
                                                    checked={includeHealthMana}
                                                    onChange={(e) => setIncludeHealthMana(e.target.checked)}
                                                />
                                                <span>Health/Mana</span>
                                            </label>
                                            {includeHealthMana && (
                                                <div className="sub-option-toggle">
                                                    <button
                                                        className={`mini-toggle ${healthManaFlat ? 'active' : ''}`}
                                                        onClick={() => setHealthManaFlat(true)}
                                                        title="Flat health/mana bonus"
                                                    >
                                                        Flat
                                                    </button>
                                                    <button
                                                        className={`mini-toggle ${!healthManaFlat ? 'active' : ''}`}
                                                        onClick={() => setHealthManaFlat(false)}
                                                        title="Percentage health/mana bonus"
                                                    >
                                                        %
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="advanced-option-item">
                                            <label className="checkbox-label-compact">
                                                <input
                                                    type="checkbox"
                                                    checked={includeRegen}
                                                    onChange={(e) => setIncludeRegen(e.target.checked)}
                                                />
                                                <span>Regeneration</span>
                                            </label>
                                            {includeRegen && (
                                                <div className="sub-option-toggle">
                                                    <button
                                                        className={`mini-toggle ${regenFlat ? 'active' : ''}`}
                                                        onClick={() => setRegenFlat(true)}
                                                        title="Flat regeneration bonus"
                                                    >
                                                        Flat
                                                    </button>
                                                    <button
                                                        className={`mini-toggle ${!regenFlat ? 'active' : ''}`}
                                                        onClick={() => setRegenFlat(false)}
                                                        title="Percentage regeneration bonus"
                                                    >
                                                        %
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="advanced-option-item">
                                            <label className="checkbox-label-compact">
                                                <input
                                                    type="checkbox"
                                                    checked={includeHealingPower}
                                                    onChange={(e) => setIncludeHealingPower(e.target.checked)}
                                                />
                                                <span>Healing Power</span>
                                            </label>
                                            {includeHealingPower && (
                                                <div className="sub-option-toggle">
                                                    <button
                                                        className={`mini-toggle ${healingPowerFlat ? 'active' : ''}`}
                                                        onClick={() => setHealingPowerFlat(true)}
                                                        title="Flat healing power bonus"
                                                    >
                                                        Flat
                                                    </button>
                                                    <button
                                                        className={`mini-toggle ${!healingPowerFlat ? 'active' : ''}`}
                                                        onClick={() => setHealingPowerFlat(false)}
                                                        title="Percentage healing power bonus"
                                                    >
                                                        %
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Type-specific controls */}
                    {type === 'consumable' && (
                        <div className="form-section">
                            <h4>Consumable Settings</h4>

                            <div className="form-group">
                                <label>Duration Type</label>
                                <div className="button-toggle-group">
                                    <button
                                        className={`toggle-button ${durationType === 'ROUNDS' ? 'active' : ''}`}
                                        onClick={() => setDurationType('ROUNDS')}
                                    >
                                        Rounds
                                    </button>
                                    <button
                                        className={`toggle-button ${durationType === 'MINUTES' ? 'active' : ''}`}
                                        onClick={() => setDurationType('MINUTES')}
                                    >
                                        Minutes
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Duration: {durationValue} {durationType === 'ROUNDS' ? 'rounds' : 'minutes'}</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max={durationType === 'ROUNDS' ? 10 : 60}
                                        step="1"
                                        value={durationValue}
                                        onChange={(e) => setDurationValue(parseInt(e.target.value))}
                                        className="duration-slider"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {type === 'weapon' && (
                        <div className="form-section">
                            <h4>Weapon Settings</h4>

                            <div className="form-group">
                                <label>Weapon Slot</label>
                                <div className="button-toggle-group">
                                    {Object.entries(WEAPON_SLOTS).map(([slot, data], index) => (
                                        <button
                                            key={slot}
                                            className={`toggle-button ${weaponSlot === slot ? 'active' : ''}`}
                                            onClick={() => {
                                                // Set the weapon slot
                                                setWeaponSlot(slot);

                                                // Reset hand if changing from one-handed to another type
                                                if (slot !== 'ONE_HANDED') {
                                                    // For TWO_HANDED and RANGED, we don't need a hand value
                                                    setWeaponHand('');
                                                } else {
                                                    // For ONE_HANDED, always set a default hand if not already set
                                                    // or if coming from a non-ONE_HANDED slot
                                                    if (!weaponHand || weaponSlot !== 'ONE_HANDED') {
                                                        setWeaponHand('MAIN_HAND');
                                                    }
                                                }

                                                // Force immediate preview update
                                                setTimeout(() => generatePreviewItem(), 0);
                                            }}
                                            style={{
                                                borderRadius: index === 0 ? '3px 0 0 3px' : index === Object.entries(WEAPON_SLOTS).length - 1 ? '0 3px 3px 0' : '0',
                                                borderRight: index < Object.entries(WEAPON_SLOTS).length - 1 ? 'none' : '1px solid #444'
                                            }}
                                        >
                                            {data.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {weaponSlot === 'ONE_HANDED' && (
                                <div className="form-group">
                                    <label>Hand Option</label>
                                    <div className="button-toggle-group">
                                        {Object.entries(HAND_OPTIONS).map(([hand, data], index) => (
                                            <button
                                                key={hand}
                                                className={`toggle-button ${weaponHand === hand ? 'active' : ''}`}
                                                onClick={() => {
                                                    // Set the weapon hand
                                                    setWeaponHand(hand);

                                                    // Force immediate preview update
                                                    setTimeout(() => generatePreviewItem(), 0);
                                                }}
                                                style={{
                                                    borderRadius: index === 0 ? '3px 0 0 3px' : index === Object.entries(HAND_OPTIONS).length - 1 ? '0 3px 3px 0' : '0',
                                                    borderRight: index < Object.entries(HAND_OPTIONS).length - 1 ? 'none' : '1px solid #444'
                                                }}
                                            >
                                                {data.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Damage Type (Optional)</label>
                                <select
                                    value={selectedDamageType}
                                    onChange={(e) => setSelectedDamageType(e.target.value)}
                                    style={{
                                        color: selectedDamageType ? DAMAGE_TYPES[selectedDamageType]?.color || '#ffffff' : '#ffffff'
                                    }}
                                >
                                    <option value="">Auto (Based on Weapon Type)</option>
                                    <optgroup label="Physical">
                                        <option
                                            value="slashing"
                                            style={{ color: DAMAGE_TYPES.slashing.color }}
                                        >
                                            Slashing
                                        </option>
                                        <option
                                            value="piercing"
                                            style={{ color: DAMAGE_TYPES.piercing.color }}
                                        >
                                            Piercing
                                        </option>
                                        <option
                                            value="bludgeoning"
                                            style={{ color: DAMAGE_TYPES.bludgeoning.color }}
                                        >
                                            Bludgeoning
                                        </option>
                                    </optgroup>
                                    <optgroup label="Magical">
                                        {Object.keys(DAMAGE_TYPES)
                                            .filter(type => !['slashing', 'piercing', 'bludgeoning'].includes(type))
                                            .map((damageType) => (
                                                <option
                                                    key={damageType}
                                                    value={damageType}
                                                    style={{
                                                        color: DAMAGE_TYPES[damageType].color
                                                    }}
                                                >
                                                    {DAMAGE_TYPES[damageType].name}
                                                </option>
                                            ))
                                        }
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Miscellaneous item settings */}
                    {type === 'miscellaneous' && (
                        <div className="form-section">
                            <h4>Miscellaneous Item Settings</h4>

                            {subtype === 'QUEST' && (
                                <>
                                    <div className="form-group">
                                        <label>Quest Giver</label>
                                        <input
                                            type="text"
                                            value={miscOptions.questGiver}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, questGiver: e.target.value }))}
                                            placeholder="Enter quest giver name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Quest Objectives</label>
                                        <textarea
                                            value={miscOptions.questObjectives}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, questObjectives: e.target.value }))}
                                            placeholder="Describe what needs to be done with this item"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Required Level: {miscOptions.requiredLevel}</label>
                                        <div className="slider-container">
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                step="1"
                                                value={miscOptions.requiredLevel}
                                                onChange={(e) => setMiscOptions(prev => ({ ...prev, requiredLevel: parseInt(e.target.value) }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Time Limit (hours, 0 = no limit): {miscOptions.timeLimit}</label>
                                        <div className="slider-container">
                                            <input
                                                type="range"
                                                min="0"
                                                max="72"
                                                step="1"
                                                value={miscOptions.timeLimit}
                                                onChange={(e) => setMiscOptions(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Quest Chain</label>
                                        <input
                                            type="text"
                                            value={miscOptions.questChain}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, questChain: e.target.value }))}
                                            placeholder="Part of which quest chain? (optional)"
                                        />
                                    </div>
                                </>
                            )}

                            {subtype === 'REAGENT' && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(160, 82, 45, 0.1) 100%)',
                                    border: '2px solid rgba(139, 69, 19, 0.3)',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <h5 style={{
                                            color: '#d4af37',
                                            margin: '0',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}>
                                            Reagent Properties
                                        </h5>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const reagentTypes = ['herb', 'mineral', 'crystal', 'essence', 'extract', 'powder', 'oil'];
                                                const magicTypes = ['fire', 'cold', 'lightning', 'acid', 'poison', 'necrotic', 'radiant', 'psychic', 'thunder', 'force'];
                                                const states = ['raw', 'refined', 'processed', 'pure', 'distilled'];
                                                const preservationMethods = ['fresh', 'dried', 'powdered', 'distilled', 'crystallized', 'preserved'];

                                                const randomReagent = {
                                                    reagentType: reagentTypes[Math.floor(Math.random() * reagentTypes.length)],
                                                    magicType: magicTypes[Math.floor(Math.random() * magicTypes.length)],
                                                    reagentState: states[Math.floor(Math.random() * states.length)],
                                                    quantityPerUse: Math.floor(Math.random() * 5) + 1,
                                                    preservationMethod: preservationMethods[Math.floor(Math.random() * preservationMethods.length)],
                                                    requiredFor: 'Various magical concoctions and spells',
                                                    magicalProperties: 'Contains potent magical energies',
                                                    source: 'Found in mystical locations'
                                                };

                                                setMiscOptions(prev => ({ ...prev, ...randomReagent }));
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                                                border: '1px solid #d4af37',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🎲 Randomize
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Reagent Type</label>
                                        <select
                                            value={miscOptions.reagentType}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, reagentType: e.target.value }))}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <option value="herb">Herb</option>
                                            <option value="mineral">Mineral</option>
                                            <option value="crystal">Crystal</option>
                                            <option value="essence">Essence</option>
                                            <option value="extract">Extract</option>
                                            <option value="powder">Powder</option>
                                            <option value="oil">Oil</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Magic Type (D&D Damage Types)</label>
                                        <select
                                            value={miscOptions.magicType}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, magicType: e.target.value }))}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <option value="fire">Fire</option>
                                            <option value="cold">Cold</option>
                                            <option value="lightning">Lightning</option>
                                            <option value="acid">Acid</option>
                                            <option value="poison">Poison</option>
                                            <option value="necrotic">Necrotic</option>
                                            <option value="radiant">Radiant</option>
                                            <option value="psychic">Psychic</option>
                                            <option value="thunder">Thunder</option>
                                            <option value="force">Force</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Reagent State</label>
                                        <select
                                            value={miscOptions.reagentState}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, reagentState: e.target.value }))}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <option value="raw">Raw</option>
                                            <option value="refined">Refined</option>
                                            <option value="processed">Processed</option>
                                            <option value="pure">Pure</option>
                                            <option value="distilled">Distilled</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Required For</label>
                                        <input
                                            type="text"
                                            value={miscOptions.requiredFor}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, requiredFor: e.target.value }))}
                                            placeholder="What spells or rituals use this reagent?"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px',
                                                padding: '8px'
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>
                                            Quantity Per Use: <span style={{ color: '#d4af37' }}>{miscOptions.quantityPerUse}</span>
                                        </label>
                                        <div className="slider-container">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                value={miscOptions.quantityPerUse}
                                                onChange={(e) => setMiscOptions(prev => ({ ...prev, quantityPerUse: parseInt(e.target.value) }))}
                                                style={{
                                                    background: 'rgba(212, 175, 55, 0.3)',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Preservation Method</label>
                                        <select
                                            value={miscOptions.preservationMethod}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, preservationMethod: e.target.value }))}
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <option value="fresh">Fresh</option>
                                            <option value="dried">Dried</option>
                                            <option value="powdered">Powdered</option>
                                            <option value="distilled">Distilled</option>
                                            <option value="crystallized">Crystallized</option>
                                            <option value="preserved">Magically Preserved</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Magical Properties</label>
                                        <textarea
                                            value={miscOptions.magicalProperties}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, magicalProperties: e.target.value }))}
                                            placeholder="Describe any special magical properties"
                                            rows="2"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ color: '#f4e4bc', fontWeight: 'bold' }}>Source Location</label>
                                        <input
                                            type="text"
                                            value={miscOptions.source}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, source: e.target.value }))}
                                            placeholder="Where can this reagent be found?"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(212, 175, 55, 0.5)',
                                                color: '#fff',
                                                borderRadius: '4px',
                                                padding: '8px'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {subtype === 'CRAFTING' && (
                                <>
                                    <div className="form-group">
                                        <label>Material Type</label>
                                        <select
                                            value={miscOptions.materialType}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, materialType: e.target.value }))}
                                        >
                                            <option value="metal">Metal</option>
                                            <option value="wood">Wood</option>
                                            <option value="cloth">Cloth</option>
                                            <option value="leather">Leather</option>
                                            <option value="stone">Stone</option>
                                            <option value="gem">Gem</option>
                                            <option value="bone">Bone</option>
                                            <option value="hide">Hide</option>
                                            <option value="herb">Herb</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Required Professions</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '5px' }}>
                                            {['Alchemy', 'Blacksmithing', 'Leatherworking', 'Tailoring', 'Engineering', 'Enchanting', 'Jewelcrafting', 'Inscription'].map((profession) => (
                                                <label key={profession} className="checkbox-label" style={{ fontSize: '12px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={miscOptions.professions.includes(profession)}
                                                        onChange={(e) => {
                                                            const professions = miscOptions.professions || [];
                                                            if (e.target.checked) {
                                                                setMiscOptions(prev => ({
                                                                    ...prev,
                                                                    professions: [...professions, profession]
                                                                }));
                                                            } else {
                                                                setMiscOptions(prev => ({
                                                                    ...prev,
                                                                    professions: professions.filter(p => p !== profession)
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    {profession}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Gathering Method</label>
                                        <select
                                            value={miscOptions.gatheringMethod}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, gatheringMethod: e.target.value }))}
                                        >
                                            <option value="mining">Mining</option>
                                            <option value="herbalism">Herbalism</option>
                                            <option value="skinning">Skinning</option>
                                            <option value="logging">Logging</option>
                                            <option value="scavenging">Scavenging</option>
                                            <option value="fishing">Fishing</option>
                                            <option value="quarrying">Quarrying</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Used in Recipes</label>
                                        <input
                                            type="text"
                                            value={miscOptions.recipes}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, recipes: e.target.value }))}
                                            placeholder="What can be crafted with this material?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Source Locations</label>
                                        <input
                                            type="text"
                                            value={miscOptions.sourceLocations}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, sourceLocations: e.target.value }))}
                                            placeholder="Where can this material be found?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Special Properties</label>
                                        <textarea
                                            value={miscOptions.specialProperties}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, specialProperties: e.target.value }))}
                                            placeholder="Any special properties or characteristics"
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}

                            {subtype === 'TRADE_GOODS' && (
                                <>
                                    <div className="form-group">
                                        <label>Trade Category</label>
                                        <select
                                            value={miscOptions.tradeCategory}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, tradeCategory: e.target.value }))}
                                        >
                                            <option value="textiles">Textiles</option>
                                            <option value="spices">Spices</option>
                                            <option value="metals">Precious Metals</option>
                                            <option value="gems">Gemstones</option>
                                            <option value="food">Food & Beverages</option>
                                            <option value="art">Art & Artifacts</option>
                                            <option value="exotic">Exotic Goods</option>
                                            <option value="luxury">Luxury Items</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Origin</label>
                                        <input
                                            type="text"
                                            value={miscOptions.origin}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, origin: e.target.value }))}
                                            placeholder="Where does this trade good come from?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Demand Level</label>
                                        <select
                                            value={miscOptions.demandLevel}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, demandLevel: e.target.value }))}
                                        >
                                            <option value="low">Low Demand</option>
                                            <option value="moderate">Moderate Demand</option>
                                            <option value="high">High Demand</option>
                                            <option value="very_high">Very High Demand</option>
                                            <option value="extreme">Extreme Demand</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Quality Grade</label>
                                        <select
                                            value={miscOptions.qualityGrade}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, qualityGrade: e.target.value }))}
                                        >
                                            <option value="poor">Poor</option>
                                            <option value="standard">Standard</option>
                                            <option value="fine">Fine</option>
                                            <option value="superior">Superior</option>
                                            <option value="exquisite">Exquisite</option>
                                            <option value="masterwork">Masterwork</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Merchant Notes</label>
                                        <textarea
                                            value={miscOptions.merchantNotes}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, merchantNotes: e.target.value }))}
                                            placeholder="What do merchants say about this item?"
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}

                            {subtype === 'KEY' && (
                                <>
                                    <div className="form-group">
                                        <label>Unlocks</label>
                                        <input
                                            type="text"
                                            value={miscOptions.unlocks}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, unlocks: e.target.value }))}
                                            placeholder="What does this key unlock?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            value={miscOptions.location}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, location: e.target.value }))}
                                            placeholder="Where is the lock located?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Security Level</label>
                                        <select
                                            value={miscOptions.securityLevel}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, securityLevel: e.target.value }))}
                                        >
                                            <option value="low">Low Security</option>
                                            <option value="moderate">Moderate Security</option>
                                            <option value="high">High Security</option>
                                            <option value="maximum">Maximum Security</option>
                                            <option value="magical">Magical Security</option>
                                        </select>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={miscOptions.oneTimeUse}
                                                onChange={(e) => setMiscOptions(prev => ({ ...prev, oneTimeUse: e.target.checked }))}
                                            />
                                            Single Use Only
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Special Instructions</label>
                                        <textarea
                                            value={miscOptions.specialInstructions}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, specialInstructions: e.target.value }))}
                                            placeholder="Any special instructions for using this key"
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}

                            {subtype === 'JUNK' && (
                                <>
                                    <div className="form-group">
                                        <label>Junk Type</label>
                                        <select
                                            value={miscOptions.junkType}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, junkType: e.target.value }))}
                                        >
                                            <option value="debris">Debris</option>
                                            <option value="scrap">Scrap</option>
                                            <option value="refuse">Refuse</option>
                                            <option value="remnant">Remnant</option>
                                            <option value="fragment">Fragment</option>
                                            <option value="waste">Waste</option>
                                            <option value="broken_item">Broken Item</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Condition</label>
                                        <select
                                            value={miscOptions.condition}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, condition: e.target.value }))}
                                        >
                                            <option value="poor">Poor</option>
                                            <option value="damaged">Damaged</option>
                                            <option value="worn">Worn</option>
                                            <option value="broken">Broken</option>
                                            <option value="ruined">Ruined</option>
                                            <option value="salvageable">Salvageable</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Origin</label>
                                        <input
                                            type="text"
                                            value={miscOptions.origin}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, origin: e.target.value }))}
                                            placeholder="Where did this junk come from?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Estimated Value</label>
                                        <input
                                            type="text"
                                            value={miscOptions.estimatedValue}
                                            onChange={(e) => setMiscOptions(prev => ({ ...prev, estimatedValue: e.target.value }))}
                                            placeholder="What might this be worth to someone?"
                                        />
                                    </div>
                                </>
                            )}

                            {!subtype && (
                                <div style={{ padding: '10px', background: 'rgba(122, 59, 46, 0.1)', borderRadius: '6px', marginBottom: '15px' }}>
                                    <p style={{ margin: '0', fontSize: '14px', color: '#7a3b2e' }}>
                                        Please select a subtype to configure specific properties for this miscellaneous item.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Container item settings */}
                    {type === 'container' && (
                        <div className="form-section">
                            <h4>Container Settings</h4>

                            <div className="form-group">
                                <label>Grid Size</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', color: '#888' }}>Rows: {containerOptions.rows}</label>
                                        <input
                                            type="range"
                                            min="2"
                                            max="8"
                                            step="1"
                                            value={containerOptions.rows}
                                            onChange={(e) => setContainerOptions(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', color: '#888' }}>Columns: {containerOptions.cols}</label>
                                        <input
                                            type="range"
                                            min="2"
                                            max="10"
                                            step="1"
                                            value={containerOptions.cols}
                                            onChange={(e) => setContainerOptions(prev => ({ ...prev, cols: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                                    Total slots: {containerOptions.rows * containerOptions.cols}
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={containerOptions.isLocked}
                                        onChange={(e) => setContainerOptions(prev => ({ ...prev, isLocked: e.target.checked }))}
                                    />
                                    Container is Locked
                                </label>
                            </div>

                            {containerOptions.isLocked && (
                                <>
                                    <div className="form-group">
                                        <label>Lock Type</label>
                                        <select
                                            value={containerOptions.lockType}
                                            onChange={(e) => setContainerOptions(prev => ({ ...prev, lockType: e.target.value }))}
                                        >
                                            <option value="none">No Lock</option>
                                            <option value="key">Key Required</option>
                                            <option value="combination">Combination Lock</option>
                                            <option value="magic">Magical Lock</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Lock Difficulty (DC): {containerOptions.lockDC}</label>
                                        <div className="slider-container">
                                            <input
                                                type="range"
                                                min="5"
                                                max="25"
                                                step="1"
                                                value={containerOptions.lockDC}
                                                onChange={(e) => setContainerOptions(prev => ({ ...prev, lockDC: parseInt(e.target.value) }))}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Fill Percentage: {containerOptions.fillPercentage}%</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={containerOptions.fillPercentage}
                                        onChange={(e) => setContainerOptions(prev => ({ ...prev, fillPercentage: parseInt(e.target.value) }))}
                                    />
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                                    {containerOptions.fillPercentage === 0 ? 'Empty container' :
                                     `Pre-filled with ${Math.ceil((containerOptions.rows * containerOptions.cols * containerOptions.fillPercentage) / 100)} items`}
                                </div>
                            </div>

                            {containerOptions.fillPercentage > 0 && (
                                <>
                                    <div className="form-group">
                                        <label>Item Quality</label>
                                        <select
                                            value={containerOptions.itemQuality}
                                            onChange={(e) => setContainerOptions(prev => ({ ...prev, itemQuality: e.target.value }))}
                                        >
                                            {RARITY_LEVELS.map(quality => (
                                                <option key={quality} value={quality}>
                                                    {QUALITY_TYPES[quality].name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Item Types to Include</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '5px' }}>
                                            {Object.entries(containerOptions.itemTypes).map(([itemType, enabled]) => (
                                                <label key={itemType} className="checkbox-label" style={{ fontSize: '12px' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={enabled}
                                                        onChange={(e) => setContainerOptions(prev => ({
                                                            ...prev,
                                                            itemTypes: {
                                                                ...prev.itemTypes,
                                                                [itemType]: e.target.checked
                                                            }
                                                        }))}
                                                    />
                                                    {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Currency item settings */}
                    {type === 'currency' && (
                        <div className="form-section">
                            <h4>Currency Settings</h4>

                            <div className="form-group">
                                <label>Purse Type</label>
                                <select
                                    value={currencyOptions.purseType}
                                    onChange={(e) => setCurrencyOptions(prev => ({ ...prev, purseType: e.target.value }))}
                                >
                                    {Object.entries(ITEM_SUBTYPES.currency).map(([key, data]) => (
                                        <option key={key} value={key}>
                                            {data.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Gold: {currencyOptions.gold}</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={currencyOptions.gold}
                                        onChange={(e) => setCurrencyOptions(prev => ({ ...prev, gold: parseInt(e.target.value) }))}
                                        className="currency-slider gold"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Silver: {currencyOptions.silver}</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={currencyOptions.silver}
                                        onChange={(e) => setCurrencyOptions(prev => ({ ...prev, silver: parseInt(e.target.value) }))}
                                        className="currency-slider silver"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Copper: {currencyOptions.copper}</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={currencyOptions.copper}
                                        onChange={(e) => setCurrencyOptions(prev => ({ ...prev, copper: parseInt(e.target.value) }))}
                                        className="currency-slider copper"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{
                                    color: '#d4af37',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    Total Value: {currencyOptions.gold}g {currencyOptions.silver}s {currencyOptions.copper}c
                                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '10px' }}>
                                        ({currencyOptions.gold * 100 + currencyOptions.silver * 10 + currencyOptions.copper} copper total)
                                    </span>
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={currencyOptions.isRandomized}
                                        onChange={(e) => setCurrencyOptions(prev => ({ ...prev, isRandomized: e.target.checked }))}
                                    />
                                    Randomize amounts when generated
                                </label>
                            </div>

                            {currencyOptions.isRandomized && (
                                <div className="form-group">
                                    <label>Random Variance: ±{currencyOptions.randomVariance}%</label>
                                    <div className="slider-container">
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            step="5"
                                            value={currencyOptions.randomVariance}
                                            onChange={(e) => setCurrencyOptions(prev => ({ ...prev, randomVariance: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                                        Each coin type will vary by ±{currencyOptions.randomVariance}% when the item is generated
                                    </div>
                                </div>
                            )}

                            <div style={{ padding: '10px', background: 'rgba(122, 59, 46, 0.1)', borderRadius: '6px', marginTop: '15px' }}>
                                <p style={{ margin: '0', fontSize: '14px', color: '#7a3b2e' }}>
                                    Configure individual coin amounts for precise control over currency items.
                                    Use randomization for varied loot drops.
                                </p>
                            </div>
                        </div>
                    )}


                </div>

                <div className="preview-panel">
                    <h3>Item Preview</h3>
                    <div className="tooltip-preview">
                        {previewItem ? (
                            <ItemTooltip item={previewItem} />
                        ) : (
                            <div style={{ color: '#888', fontStyle: 'italic' }}>
                                No preview available
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

            {/* Icon Selector Modal */}
            {showIconSelector && (
                <ItemIconSelector
                    onSelect={(iconId) => {
                        setSelectedIcon(iconId);
                        setShowIconSelector(false);
                    }}
                    onClose={() => setShowIconSelector(false)}
                    currentIcon={selectedIcon || ITEM_TYPES[type]?.icon || 'inv_misc_questionmark'}
                    itemType={type}
                />
            )}
        </div>
    );
};

export default EnhancedQuickItemWizard;
