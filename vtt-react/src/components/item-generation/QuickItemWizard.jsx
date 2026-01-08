import React, { useState, useEffect } from 'react';
import { ITEM_TYPES, QUALITY_TYPES, EQUIPMENT_SLOTS } from './itemConstants';

const PREFIXES = {
    weapon: ['Deadly', 'Savage', 'Cursed', 'Blessed', 'Ancient'],
    armor: ['Sturdy', 'Reinforced', 'Protective', 'Guardian', 'Warded'],
    accessory: ['Mystical', 'Enchanted', 'Ethereal', 'Arcane', 'Charmed'],
    consumable: ['Potent', 'Refined', 'Pure', 'Concentrated', 'Distilled'],
    miscellaneous: ['Curious', 'Strange', 'Mysterious', 'Peculiar', 'Odd']
};

const SUFFIXES = {
    weapon: ['of Power', 'of Destruction', 'of the Beast', 'of the Warrior', 'of Slaying'],
    armor: ['of Defense', 'of Protection', 'of Warding', 'of the Shield', 'of the Guardian'],
    accessory: ['of Magic', 'of Mystery', 'of the Arcane', 'of Power', 'of Energy'],
    consumable: ['of Restoration', 'of Healing', 'of Recovery', 'of Mending', 'of Vigor'],
    miscellaneous: ['of Wonder', 'of Secrets', 'of Mystery', 'of the Unknown', 'of Curiosity']
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

// Calculate item value based on quality and stats
const calculateItemValue = (quality, stats) => {
    // Base value based on quality
    const baseValue = Math.floor(getRandomInt(10, 100) * QUALITY_VALUE_MULTIPLIERS[quality]);

    // Count total stats
    let statCount = 0;
    let statSum = 0;

    // Count base stats
    if (stats.baseStats) {
        Object.values(stats.baseStats).forEach(stat => {
            if (typeof stat === 'object' && stat.value) {
                statCount++;
                statSum += stat.value;
            } else if (typeof stat === 'number') {
                statCount++;
                statSum += stat;
            }
        });
    }

    // Count combat stats
    if (stats.combatStats) {
        Object.entries(stats.combatStats).forEach(([key, stat]) => {
            if (key === 'resistances') {
                if (stat) {
                    // Count resistances
                    Object.values(stat).forEach(resistance => {
                        statCount++;
                        if (resistance.immune) {
                            statSum += 10; // Immune is worth more
                        } else if (resistance.resistant) {
                            statSum += 5;  // Resistant is worth more
                        } else if (resistance.value) {
                            statSum += resistance.value;
                        }
                    });
                }
            } else if (typeof stat === 'object' && stat.value) {
                statCount++;
                statSum += stat.value;
            } else if (typeof stat === 'number') {
                statCount++;
                statSum += stat;
            }
        });
    }

    // Add value for weapon stats
    if (stats.weaponStats && stats.weaponStats.baseDamage) {
        const damage = stats.weaponStats.baseDamage;
        statCount += 2;
        statSum += (damage.diceCount * ((damage.diceType || 6) / 2)) + (damage.bonusDamage || 0);
    }

    // Calculate final value
    let finalValue = baseValue + (statSum * statCount);

    // Convert to gold/silver/copper
    const gold = Math.floor(finalValue / 100);
    finalValue -= gold * 100;
    const silver = Math.floor(finalValue / 10);
    finalValue -= silver * 10;
    const copper = Math.floor(finalValue);

    return {
        gold,
        silver,
        copper: copper || (gold === 0 && silver === 0 ? 1 : 0) // Ensure at least 1 copper if no other value
    };
};

const DAMAGE_COLORS = {
    slashing: '#ff4400',
    piercing: '#ff8800',
    bludgeoning: '#cc8800'
};

const ITEM_TYPE_ICONS = {
    weapon: 'inv_sword_23',
    armor: 'inv_chest_plate04',
    accessory: 'inv_jewelry_ring_01',
    clothing: 'inv_shirt_01',
    consumable: 'inv_potion_01',
    miscellaneous: 'inv_misc_bag_07'
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const generateItemName = (type) => {
    const prefix = getRandomElement(PREFIXES[type] || PREFIXES.miscellaneous);
    const suffix = getRandomElement(SUFFIXES[type] || SUFFIXES.miscellaneous);
    const baseName = type === 'miscellaneous' ? 'Trinket' : ITEM_TYPES[type].name;
    return `${prefix} ${baseName} ${suffix}`;
};

const generateBaseStats = (quality, powerScale = 1) => {
    // Base stat ranges by quality - reduced values for more balanced items
    const statRanges = {
        poor: { min: 0, max: 1 },
        common: { min: 0, max: 2 },
        uncommon: { min: 1, max: 3 },
        rare: { min: 1, max: 4 },
        epic: { min: 2, max: 5 },
        legendary: { min: 3, max: 6 },
        artifact: { min: 4, max: 7 }
    };

    // Adjust ranges based on power scale
    const adjustedRange = {
        min: Math.floor(statRanges[quality].min * powerScale),
        max: Math.floor(statRanges[quality].max * powerScale)
    };

    const stats = {};

    // Determine number of stats based on power scale and quality
    // Lower power scale = fewer stats
    const maxStats = Math.max(1, Math.floor(3 * powerScale));
    const qualityFactor = ['poor', 'common'].includes(quality) ? 0.5 :
                         ['uncommon', 'rare'].includes(quality) ? 0.7 : 1;

    const numStats = Math.floor(Math.random() * (maxStats * qualityFactor)) + 1;

    // Sometimes generate items with no stats for common/poor quality
    if ((quality === 'poor' || quality === 'common') && Math.random() < 0.3) {
        return stats;
    }

    const possibleStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];

    for (let i = 0; i < numStats; i++) {
        if (possibleStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * possibleStats.length);
        const stat = possibleStats.splice(statIndex, 1)[0];

        // Format stats as objects with value and isPercentage properties
        // to match the ItemWizard format
        // Sometimes generate +0 stats for lower qualities
        const statValue = (quality === 'poor' || quality === 'common') && Math.random() < 0.2 ?
            0 : Math.floor(Math.random() * (adjustedRange.max - adjustedRange.min + 1)) + adjustedRange.min;

        if (statValue > 0) {
            stats[stat] = {
                value: statValue,
                isPercentage: false
            };
        }
    }

    return stats;
};

const generateCombatStats = (type, quality, powerScale = 1) => {
    // Combat stat ranges by quality
    const baseCombatRanges = {
        poor: {
            damage: { min: 1, max: 2 },
            armorClass: { min: 1, max: 2 }
        },
        common: {
            damage: { min: 1, max: 3 },
            armorClass: { min: 2, max: 3 }
        },
        uncommon: {
            damage: { min: 2, max: 4 },
            armorClass: { min: 3, max: 4 }
        },
        rare: {
            damage: { min: 3, max: 5 },
            armorClass: { min: 4, max: 5 }
        },
        epic: {
            damage: { min: 4, max: 6 },
            armorClass: { min: 5, max: 6 }
        },
        legendary: {
            damage: { min: 5, max: 8 },
            armorClass: { min: 6, max: 8 }
        }
    };

    // Adjust ranges based on power scale
    const combatRanges = {
        poor: {
            damage: adjustRangeByPowerScale(baseCombatRanges.poor.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.poor.armorClass, powerScale)
        },
        common: {
            damage: adjustRangeByPowerScale(baseCombatRanges.common.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.common.armorClass, powerScale)
        },
        uncommon: {
            damage: adjustRangeByPowerScale(baseCombatRanges.uncommon.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.uncommon.armorClass, powerScale)
        },
        rare: {
            damage: adjustRangeByPowerScale(baseCombatRanges.rare.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.rare.armorClass, powerScale)
        },
        epic: {
            damage: adjustRangeByPowerScale(baseCombatRanges.epic.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.epic.armorClass, powerScale)
        },
        legendary: {
            damage: adjustRangeByPowerScale(baseCombatRanges.legendary.damage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.legendary.armorClass, powerScale)
        }
    };

    const range = combatRanges[quality];
    const stats = {};

    // Common stats that can appear on any item type
    const commonStats = {
        maxHealth: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        maxMana: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        healthRegen: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        manaRegen: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        initiative: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        healingReceived: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        healingPower: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
        maxAP: () => Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min
    };

    // Determine number of common stats based on power scale and quality
    // Lower power scale = fewer stats
    const maxCommonStats = Math.max(1, Math.floor(2 * powerScale));
    const qualityFactor = ['poor', 'common'].includes(quality) ? 0.5 :
                         ['uncommon', 'rare'].includes(quality) ? 0.7 : 1;

    // Sometimes generate items with no common stats for common/poor quality
    if ((quality === 'poor' || quality === 'common') && Math.random() < 0.4) {
        // Skip adding common stats
    } else {
        const numCommonStats = Math.floor(Math.random() * (maxCommonStats * qualityFactor)) + 1;
        const selectedCommonStats = shuffle(Object.keys(commonStats)).slice(0, numCommonStats);
        selectedCommonStats.forEach(stat => {
            const statValue = commonStats[stat]();
            if (statValue > 0) {
                stats[stat] = {
                    value: statValue,
                    isPercentage: false
                };
            }
        });
    }

    switch (type) {
        case 'weapon':
            // Add weapon-specific damage type for uncommon and above
            if (quality !== 'poor' && (quality !== 'common' || Math.random() < 0.5)) {
                const extraDamageType = getRandomElement(['piercingDamage', 'bludgeoningDamage', 'slashingDamage']);
                stats[extraDamageType] = {
                    value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
                    isPercentage: false
                };
            }
            break;

        case 'armor':
            // Always add armor class
            stats.armorClass = {
                value: Math.floor(Math.random() * (range.armorClass.max - range.armorClass.min + 1)) + range.armorClass.min,
                isPercentage: false
            };

            // Add health bonus for uncommon and above
            if (quality !== 'poor' && (quality !== 'common' || Math.random() < 0.5)) {
                stats.maxHealth = {
                    value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
                    isPercentage: false
                };
            }

            // Add resistance for rare and above, or with a small chance for lower qualities
            if (['rare', 'epic', 'legendary', 'artifact'].includes(quality) || Math.random() < 0.3) {
                // Add random resistance
                const resistanceType = getRandomElement(['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos']);

                // Initialize resistances object if it doesn't exist
                if (!stats.resistances) {
                    stats.resistances = {};
                }

                // Add the resistance to the resistances object
                // Randomly choose between value-based resistance, resistant, or immune (for legendary+)
                const resistanceRoll = Math.random();

                if (quality === 'legendary' && resistanceRoll < 0.1) {
                    // 10% chance for legendary items to be immune
                    stats.resistances[resistanceType] = {
                        immune: true
                    };
                } else if (resistanceRoll < 0.3) {
                    // 30% chance to be resistant
                    stats.resistances[resistanceType] = {
                        resistant: true,
                        value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min
                    };
                } else {
                    // 70% chance for value-based resistance
                    stats.resistances[resistanceType] = {
                        value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
                        isPercentage: false
                    };
                }
            }
            break;

        case 'accessory':
            // Accessories get an extra common stat for uncommon and above
            if (quality !== 'poor' && (quality !== 'common' || Math.random() < 0.5)) {
                const extraStat = shuffle(Object.keys(commonStats))[0];
                const statValue = commonStats[extraStat]();
                if (statValue > 0) {
                    stats[extraStat] = {
                        value: statValue,
                        isPercentage: false
                    };
                }
            }
            break;

        case 'consumable':
            // Always add either health or mana restore
            if (Math.random() < 0.5) {
                stats.healthRestore = {
                    value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
                    isPercentage: false
                };
            } else {
                stats.manaRestore = {
                    value: Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min,
                    isPercentage: false
                };
            }
            break;
    }

    return stats;
};

const adjustRangeByPowerScale = (range, powerScale) => {
    return {
        min: Math.max(1, Math.floor(range.min * powerScale)),
        max: Math.max(1, Math.floor(range.max * powerScale))
    };
};

const generateWeaponStats = (quality, powerScale = 1) => {
    const multiplier = QUALITY_MULTIPLIERS[quality] * powerScale;
    const diceTypes = [4, 6, 8, 10, 12];

    // Adjust dice count based on quality and power scale
    let diceCount = 1;
    if (quality === 'poor') {
        diceCount = 1;
    } else if (quality === 'common') {
        diceCount = Math.random() < 0.7 ? 1 : 2;
    } else {
        diceCount = Math.max(1, Math.floor(getRandomInt(1, 2) * multiplier));
    }

    // Select dice type based on quality
    let diceTypeIndex;
    if (quality === 'poor') {
        diceTypeIndex = 0; // d4
    } else if (quality === 'common') {
        diceTypeIndex = Math.floor(Math.random() * 2); // d4 or d6
    } else if (quality === 'uncommon') {
        diceTypeIndex = Math.floor(Math.random() * 3); // d4, d6, or d8
    } else if (quality === 'rare') {
        diceTypeIndex = 1 + Math.floor(Math.random() * 3); // d6, d8, or d10
    } else {
        diceTypeIndex = 2 + Math.floor(Math.random() * 3); // d8, d10, or d12
    }

    const diceType = diceTypes[Math.min(diceTypeIndex, diceTypes.length - 1)];

    // Bonus damage is more likely on higher quality items
    let bonusDamage = 0;
    if (quality === 'poor') {
        bonusDamage = 0;
    } else if (quality === 'common') {
        bonusDamage = Math.random() < 0.3 ? 1 : 0;
    } else {
        bonusDamage = Math.floor(getRandomInt(0, 3) * multiplier);
    }

    const damageType = getRandomElement(['slashing', 'piercing', 'bludgeoning']);

    // Only add bonus damage type for uncommon and above
    let bonusDamageType = null;
    if (quality !== 'poor' && quality !== 'common' && bonusDamage > 0) {
        bonusDamageType = getRandomElement(['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'chaos']);
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

const generateConsumableStats = () => {
    const durations = [
        { value: 3, type: 'ROUNDS', display: '3 rounds' },
        { value: 5, type: 'ROUNDS', display: '5 rounds' },
        { value: 10, type: 'ROUNDS', display: '10 rounds' },
        { value: 1, type: 'MINUTES', display: '1 minute' },
        { value: 5, type: 'MINUTES', display: '5 minutes' },
        { value: 10, type: 'MINUTES', display: '10 minutes' },
        { value: 30, type: 'MINUTES', display: '30 minutes' },
        { value: 60, type: 'MINUTES', display: '1 hour' }
    ];

    return {
        duration: getRandomElement(durations)
    };
};

const generateDescription = (type, quality, name) => {
    const qualityDesc = QUALITY_TYPES[quality].name.toLowerCase();
    const descriptions = {
        weapon: [
            "A fearsome weapon that radiates power.",
            "Legends speak of this weapon's might.",
            "A perfectly balanced instrument of war."
        ],
        armor: [
            "Provides exceptional protection to its wearer.",
            "Masterfully crafted protective gear.",
            "Enchanted armor that adapts to its wearer."
        ],
        accessory: [
            "Imbued with mysterious magical properties.",
            "A powerful artifact of unknown origin.",
            "Channels magical energies with ease."
        ],
        consumable: [
            "Created using rare and exotic ingredients.",
            "The effects are both powerful and reliable.",
            "Carefully crafted by master alchemists."
        ],
        miscellaneous: [
            "An item of great importance.",
            "Its true purpose remains to be discovered.",
            "A curious artifact with unknown properties."
        ]
    };

    const baseDesc = getRandomElement(descriptions[type]);
    return `A ${qualityDesc} quality item. ${baseDesc}`;
};

const getThemeContext = (type, quality) => {
    const themes = {
        weapon: {
            common: 'Simple but reliable weapons crafted by local blacksmiths.',
            uncommon: 'Well-crafted weapons with minor enchantments.',
            rare: 'Masterwork weapons with powerful enchantments, often with historical significance.',
            epic: 'Legendary weapons wielded by heroes of old, infused with powerful magic.',
            legendary: 'Artifacts of immense power, often tied to gods or ancient civilizations.',
            artifact: 'World-shaping weapons of myth, capable of changing the course of history.'
        },
        armor: {
            common: 'Basic protective gear made by local craftsmen.',
            uncommon: 'Quality armor with defensive enchantments.',
            rare: 'Masterwork armor blessed with powerful protective magic.',
            epic: 'Ancient armor sets worn by legendary heroes.',
            legendary: 'Divine armor blessed by the gods themselves.',
            artifact: 'Mythical armor said to grant invulnerability to its wearer.'
        },
        accessory: {
            common: 'Simple trinkets with minor magical properties.',
            uncommon: 'Enchanted jewelry with beneficial effects.',
            rare: 'Powerful magical accessories with unique properties.',
            epic: 'Ancient relics with powerful enchantments.',
            legendary: 'Divine artifacts blessed with extraordinary power.',
            artifact: 'Reality-altering accessories of incredible power.'
        },
        consumable: {
            common: 'Basic potions and scrolls from local alchemists.',
            uncommon: 'Enhanced elixirs with reliable magical effects.',
            rare: 'Powerful concoctions with unique magical properties.',
            epic: 'Ancient recipes lost to time, with incredible effects.',
            legendary: 'Divine elixirs blessed by the gods.',
            artifact: 'Mythical substances capable of miraculous feats.'
        },
        miscellaneous: {
            common: 'Everyday items with slight magical properties.',
            uncommon: 'Curious magical items with interesting effects.',
            rare: 'Unique magical artifacts with mysterious powers.',
            epic: 'Ancient relics with powerful hidden abilities.',
            legendary: 'Divine objects of great significance.',
            artifact: 'Reality-bending items of incredible power.'
        }
    };

    return themes[type]?.[quality] || 'A magical item of mysterious origin.';
};

const generateAIDescription = async (itemData) => {
    try {
        // Extract key stats and features
        const damageInfo = itemData.weaponStats?.baseDamage;
        const damageStr = damageInfo ?
            `${damageInfo.diceCount}${damageInfo.diceType} ${damageInfo.damageType} damage + ${damageInfo.bonusDamage} ${damageInfo.bonusDamageType}` : '';

        const keyStats = Object.entries(itemData.baseStats)
            .filter(([_, stat]) => stat.value !== 0)
            .map(([name, stat]) => `${name}: ${stat.value}${stat.isPercentage ? '%' : ''}`);

        const isHumorous = itemData.userPrompt?.toLowerCase().includes('funny') ||
                          itemData.userPrompt?.toLowerCase().includes('hilarious');

        const prompt = `Create a ${isHumorous ? 'humorous' : 'serious'} description for this fantasy weapon:

WEAPON DETAILS:
Type: ${itemData.subtype.toLowerCase()}
Quality: ${itemData.quality}
Damage: ${damageStr}
Notable Stats: ${keyStats.join(', ') || 'none'}
Style: ${isHumorous ? 'Funny' : 'Serious'}
${itemData.userPrompt ? `Additional Requirements: ${itemData.userPrompt}` : ''}

${isHumorous ? `HUMOR REQUIREMENTS:
- Make clever puns about stabbing/piercing
- Include a humorous origin story
- Reference its size in a funny way
- Keep it light and playful while describing its capabilities

Example: "This surprisingly sharp letter opener was allegedly used by a particularly aggressive mail clerk to 'process' complaints a bit too literally. While small enough to hide in a stack of paperwork, it packs enough punch to make sure your point gets across... repeatedly."`
: `DESCRIPTION REQUIREMENTS:
- Describe its physical appearance and magical properties
- Include a brief but intriguing origin
- Reference its combat capabilities

Example: "A sleek dagger with a curved blade that gleams with a subtle blue sheen. Ancient runes along its surface pulse with magical energy, enhancing the wielder's agility and precision in combat."`}

Write a unique description in 2-3 sentences. Be creative and memorable, but stay under 100 words.`;

        // OpenAI integration removed - use built-in description generation
        return generateDescription(itemData.type, itemData.quality, itemData.name);
    } catch (error) {
        console.error('Error generating description:', error);
        return generateDescription(itemData.type, itemData.quality, itemData.name);
    }
};

const generateAIStats = async (type, quality, userPrompt) => {
    const requestedStats = {};

    try {
        // Process the user prompt for specific stat requests
        const words = userPrompt.toLowerCase().split(' ');
        for (const stat of ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma']) {
            const modifier = getStatModifierFromPrompt(words, stat);
            if (modifier !== 1) {
                const baseValue = Math.floor(3 * QUALITY_MULTIPLIERS[quality]);
                requestedStats[stat] = {
                    value: Math.max(1, Math.floor(baseValue * modifier)),
                    isPercentage: false
                };
            }
        }

        // Generate base stats and combat stats with proper formatting
        const baseStats = generateBaseStats(quality);
        const combatStats = generateCombatStats(type, quality);

        // Merge requested stats with base stats
        const mergedBaseStats = { ...baseStats };
        Object.entries(requestedStats).forEach(([stat, value]) => {
            if (['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].includes(stat)) {
                mergedBaseStats[stat] = value;
            }
        });

        return {
            ...mergedBaseStats,
            ...combatStats
        };
    } catch (error) {
        console.error('Error generating AI stats:', error);
        return {
            ...generateBaseStats(quality),
            ...generateCombatStats(type, quality)
        };
    }
};

const getStatModifierFromPrompt = (words, stat) => {
    const statKeywords = {
        strength: ['strength', 'str', 'powerful'],
        constitution: ['constitution', 'con', 'sturdy', 'tough'],
        agility: ['agility', 'agi', 'agile'],
        intelligence: ['intelligence', 'int', 'smart'],
        spirit: ['spirit', 'spi'],
        charisma: ['charisma', 'cha']
    };

    let modifier = 1;
    // Check for negative modifiers
    if (statKeywords[stat].some(kw => words.includes(`-${kw}`) || words.includes(`minus ${kw}`) || words.includes(`low ${kw}`))) {
        modifier = -1;
    }
    // Check for positive modifiers
    else if (statKeywords[stat].some(kw => words.includes(`+${kw}`) || words.includes(`high ${kw}`) || words.includes(`lots of ${kw}`))) {
        modifier = 2;
    }
    // Check for presence without modifier
    else if (statKeywords[stat].some(kw => words.includes(kw))) {
        modifier = 1.5;
    }

    return modifier;
};

const MISC_SUBTYPES = {
    QUEST: 'Quest Item',
    REAGENT: 'Reagent',
    CRAFTING: 'Crafting Material',
    TRADE_GOODS: 'Trade Goods',
    KEY: 'Key',
    JUNK: 'Junk'
};

const POWER_SCALE_MULTIPLIERS = {
    0.1: 'Very Weak',
    0.25: 'Weak',
    0.5: 'Slightly Weak',
    0.75: 'Normal',
    1: 'Slightly Strong',
    1.25: 'Strong',
    1.5: 'Very Strong'
};

const usesPowerScale = (type, subtype) => {
    if (type === 'miscellaneous') return false;
    return ['weapon', 'armor', 'accessory'].includes(type);
};

const QuickItemWizard = ({ onComplete, onCancel, initialData }) => {
    const [type, setType] = useState(initialData?.type || 'weapon');
    const [subtype, setSubtype] = useState(initialData?.subtype || '');
    const [quality, setQuality] = useState(initialData?.quality || 'common');
    const [powerScale, setPowerScale] = useState(0.75); // Default to "Normal"
    const [useAI, setUseAI] = useState(false);
    const [aiPrompt, setAiPrompt] = useState(initialData?.userPrompt || '');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const newItem = await generateItem(type, subtype, quality, useAI, aiPrompt, initialData, powerScale);
            onComplete(newItem);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateItem = async (type, subtype, quality, useAI, userPrompt, initialData, powerScale) => {
        let slots = initialData?.slots || [];
        let baseStats = initialData?.baseStats || {};
        let combatStats = initialData?.combatStats || {};
        let requestedStats = {};
        let weaponStats = initialData?.weaponStats || null;

        // Parse stats from prompt if AI is enabled
        if (useAI && userPrompt) {
            const lowerPrompt = userPrompt.toLowerCase();
            const statKeywords = {
                strength: ['strength', 'str', 'powerful'],
                constitution: ['constitution', 'con', 'sturdy', 'tough'],
                agility: ['agility', 'agi', 'agile'],
                intelligence: ['intelligence', 'int', 'smart'],
                spirit: ['spirit', 'spi'],
                charisma: ['charisma', 'cha']
            };

            // Check for stat modifiers
            for (const [stat, keywords] of Object.entries(statKeywords)) {
                let modifier = 1;
                // Check for negative modifiers
                if (keywords.some(kw => lowerPrompt.includes(`-${kw}`) || lowerPrompt.includes(`minus ${kw}`) || lowerPrompt.includes(`low ${kw}`))) {
                    modifier = -1;
                }
                // Check for positive modifiers
                else if (keywords.some(kw => lowerPrompt.includes(`+${kw}`) || lowerPrompt.includes(`high ${kw}`) || lowerPrompt.includes(`lots of ${kw}`))) {
                    modifier = 2;
                }
                // Check for presence without modifier
                else if (keywords.some(kw => lowerPrompt.includes(kw))) {
                    modifier = 1.5;
                }

                if (modifier !== 1) {
                    const baseValue = Math.floor(3 * QUALITY_MULTIPLIERS[quality]);
                    requestedStats[stat] = Math.max(1, Math.floor(baseValue * modifier));
                }
            }
        }

        switch (type) {
            case 'weapon':
                // Parse user preferences from prompt if available
                if (useAI && userPrompt) {
                    const lowerPrompt = userPrompt.toLowerCase();
                    if (lowerPrompt.includes('two-handed') || lowerPrompt.includes('2h') || lowerPrompt.includes('two handed')) {
                        const weaponSlot = 'TWO_HANDED';
                    } else if (lowerPrompt.includes('one-handed') || lowerPrompt.includes('1h') || lowerPrompt.includes('one handed')) {
                        const weaponSlot = 'ONE_HANDED';
                        const hand = 'MAIN_HAND';
                    } else {
                        if (Math.random() < 0.7) {
                            const weaponSlot = 'ONE_HANDED';
                            const hand = 'MAIN_HAND';
                        } else {
                            const weaponSlot = 'TWO_HANDED';
                        }
                    }

                    // Parse weapon type from prompt
                    const weaponTypes = ['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'POLEARM'];
                    for (const wType of weaponTypes) {
                        if (lowerPrompt.includes(wType.toLowerCase()) || (wType === 'POLEARM' && lowerPrompt.includes('spear'))) {
                            subtype = wType;
                            break;
                        }
                    }
                    if (!subtype) subtype = getRandomElement(['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'POLEARM']);
                } else {
                    if (Math.random() < 0.7) {
                        const weaponSlot = 'ONE_HANDED';
                        const hand = 'MAIN_HAND';
                    } else {
                        const weaponSlot = 'TWO_HANDED';
                    }
                    subtype = getRandomElement(['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'POLEARM']);
                }
                break;

            case 'armor':
                if (useAI && userPrompt) {
                    const lowerPrompt = userPrompt.toLowerCase();
                    // Parse armor type
                    if (lowerPrompt.includes('cloth')) subtype = 'CLOTH';
                    else if (lowerPrompt.includes('leather')) subtype = 'LEATHER';
                    else if (lowerPrompt.includes('mail')) subtype = 'MAIL';
                    else if (lowerPrompt.includes('plate')) subtype = 'PLATE';
                    else subtype = getRandomElement(['CLOTH', 'LEATHER', 'MAIL', 'PLATE']);

                    // Parse armor slot
                    if (lowerPrompt.includes('shield')) {
                        slots = ['off_hand'];
                        // Override subtype for shields
                        if (!lowerPrompt.includes('cloth') && !lowerPrompt.includes('leather')) {
                            subtype = getRandomElement(['MAIL', 'PLATE']);
                        }
                    } else {
                        const slotTypes = {
                            head: ['head', 'helmet', 'hood', 'crown', 'hat'],
                            chest: ['chest', 'body', 'torso', 'breastplate', 'armor'],
                            legs: ['legs', 'greaves', 'pants', 'leggings'],
                            feet: ['feet', 'boots', 'shoes', 'sandals'],
                            hands: ['hands', 'gloves', 'gauntlets', 'bracers'],
                            waist: ['waist', 'belt', 'girdle', 'sash']
                        };

                        let foundSlot = false;
                        for (const [slot, keywords] of Object.entries(slotTypes)) {
                            if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
                                slots = [slot];
                                foundSlot = true;
                                break;
                            }
                        }
                        if (!foundSlot) slots = [getRandomElement(['head', 'chest', 'legs', 'feet', 'hands', 'waist'])];
                    }

                    // Generate stats with AI and merge with requested stats
                    const stats = await generateAIStats(type, quality, userPrompt);
                    baseStats = stats.baseStats;
                    combatStats = stats.combatStats;
                } else {
                    subtype = getRandomElement(['CLOTH', 'LEATHER', 'MAIL', 'PLATE']);
                    slots = [getRandomElement(['head', 'chest', 'legs', 'feet', 'hands', 'waist'])];
                    baseStats = generateBaseStats(quality);
                    combatStats = generateCombatStats(type, quality, powerScale);
                }
                break;

            case 'accessory':
                if (useAI && userPrompt) {
                    const lowerPrompt = userPrompt.toLowerCase();
                    // Parse accessory type
                    if (lowerPrompt.includes('ring')) subtype = 'RING';
                    else if (lowerPrompt.includes('necklace') || lowerPrompt.includes('amulet')) subtype = 'NECKLACE';
                    else if (lowerPrompt.includes('trinket')) subtype = 'TRINKET';
                    else subtype = getRandomElement(['RING', 'NECKLACE', 'TRINKET']);
                    slots = [subtype.toLowerCase()];
                } else {
                    subtype = getRandomElement(['RING', 'NECKLACE', 'TRINKET']);
                    slots = [subtype.toLowerCase()];
                }
                break;

            case 'miscellaneous':
                let name = '';

                // Generate name based on type and subtype
                const subtypeNames = {
                    QUEST: ['Important', 'Ancient', 'Sacred', 'Lost', 'Mysterious'],
                    REAGENT: ['Rare', 'Potent', 'Pure', 'Mystical', 'Volatile'],
                    CRAFTING: ['Quality', 'Raw', 'Refined', 'Pristine', 'Exotic'],
                    TRADE_GOODS: ['Valuable', 'Imported', 'Sought-after', 'Premium', 'Fine'],
                    KEY: ['Ornate', 'Rusted', 'Golden', 'Crystal', 'Shadow'],
                    JUNK: ['Broken', 'Damaged', 'Worn', 'Tattered', 'Scrap']
                };
                const adjective = getRandomElement(subtypeNames[subtype] || ['Curious']);
                const subtypeBaseNames = {
                    QUEST: ['Artifact', 'Relic', 'Token', 'Fragment', 'Remnant'],
                    REAGENT: ['Essence', 'Crystal', 'Powder', 'Extract', 'Solution'],
                    CRAFTING: ['Material', 'Component', 'Resource', 'Element', 'Substance'],
                    TRADE_GOODS: ['Goods', 'Commodity', 'Merchandise', 'Wares', 'Product'],
                    KEY: ['Key', 'Keystone', 'Lock Pick', 'Passkey', 'Skeleton Key'],
                    JUNK: ['Item', 'Object', 'Thing', 'Piece', 'Remnant']
                };
                const baseName = getRandomElement(subtypeBaseNames[subtype] || ['Trinket']);
                name = `${adjective} ${baseName}`;

                // Return early if no subtype selected
                if (!subtype) {
                    throw new Error('Please select a subtype for miscellaneous items');
                }

                switch (subtype) {
                    case 'QUEST':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality,
                            questGiver: 'Unknown',
                            questObjectives: 'Bring this item to its rightful owner.',
                            timeLimit: 0,
                            description: generateDescription(type, quality, name)
                        };

                    case 'REAGENT':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality,
                            reagentType: getRandomElement(['Herb', 'Mineral', 'Crystal', 'Essence', 'Extract']),
                            magicType: getRandomElement(['fire', 'frost', 'arcane', 'nature', 'shadow']),
                            reagentState: getRandomElement(['Raw', 'Refined', 'Processed', 'Pure']),
                            requiredFor: 'Various magical concoctions',
                            description: generateDescription(type, quality, name)
                        };

                    case 'CRAFTING':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality,
                            materialType: getRandomElement(['Metal', 'Wood', 'Cloth', 'Leather', 'Stone']),
                            professions: [getRandomElement(['Blacksmithing', 'Carpentry', 'Leatherworking', 'Tailoring', 'Masonry'])],
                            gatheringMethod: getRandomElement(['Mining', 'Harvesting', 'Skinning', 'Scavenging']),
                            description: generateDescription(type, quality, name)
                        };

                    case 'TRADE_GOODS':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality,
                            tradeCategory: getRandomElement(['Textiles', 'Metals', 'Spices', 'Gems', 'Exotic']),
                            origin: getRandomElement(['Local', 'Imported', 'Exotic', 'Foreign', 'Unknown']),
                            demandLevel: getRandomElement(['Low', 'Moderate', 'High', 'Very High']),
                            qualityGrade: getRandomElement(['Standard', 'Fine', 'Superior', 'Exceptional']),
                            description: generateDescription(type, quality, name)
                        };

                    case 'KEY':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality,
                            keyType: getRandomElement(['Door', 'Chest', 'Gate', 'Safe', 'Special']),
                            unlocks: 'Unknown Lock',
                            location: 'Unknown',
                            securityLevel: getRandomElement(['Basic', 'Advanced', 'Complex', 'Master']),
                            oneTimeUse: Math.random() > 0.7,
                            description: generateDescription(type, quality, name)
                        };

                    case 'JUNK':
                        return {
                            id: crypto.randomUUID(),
                            name,
                            type,
                            subtype,
                            quality: 'poor',  // Junk is always poor quality
                            junkType: getRandomElement(['Scrap', 'Debris', 'Remains', 'Fragment', 'Refuse']),
                            condition: getRandomElement(['Broken', 'Damaged', 'Worn', 'Tattered', 'Ruined']),
                            origin: getRandomElement(['Unknown', 'Discarded', 'Abandoned', 'Salvaged']),
                            estimatedValue: 'Negligible',
                            description: generateDescription(type, 'poor', name)
                        };
                }
                break;
            default:
                slots = ['none'];
        }

        let stats;
        let description;
        const name = initialData?.name || type === 'miscellaneous' ? name : generateItemName(type);

        if (useAI) {
            // Generate AI stats and description using user prompt
            let customWeaponStats = null;
            if (type === 'weapon' && userPrompt) {
                // Parse damage dice from prompt
                const diceMatcher = /(\d+)d(\d+)/i;
                const diceMatch = userPrompt.match(diceMatcher);
                if (diceMatch) {
                    const [_, diceCount, diceType] = diceMatch;
                    customWeaponStats = generateWeaponStats(quality);
                    customWeaponStats.baseDamage.diceCount = parseInt(diceCount);
                    customWeaponStats.baseDamage.diceType = parseInt(diceType);
                    customWeaponStats.baseDamage.display.base = `${diceCount}d${diceType}`;
                }

                // Parse damage type preferences
                const damageTypes = ['acid', 'fire', 'cold', 'lightning', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder', 'toxic'];
                for (const type of damageTypes) {
                    if (userPrompt.toLowerCase().includes(type)) {
                        if (customWeaponStats) {
                            customWeaponStats.baseDamage.bonusDamageType = type === 'toxic' ? 'poison' : type;
                            customWeaponStats.baseDamage.bonusDamage = Math.max(1, Math.floor(QUALITY_MULTIPLIERS[quality]));
                        }
                        break;
                    }
                }
            }

            stats = {
                baseStats: generateBaseStats(quality),
                combatStats: await generateAIStats(type, quality, userPrompt),
                weaponStats: type === 'weapon' ? (customWeaponStats || generateWeaponStats(quality)) : null
            };

            // Adjust stats based on user preferences
            if (userPrompt) {
                const lowerPrompt = userPrompt.toLowerCase();
                if (lowerPrompt.includes('agility')) {
                    stats.baseStats.agility = Math.max(stats.baseStats.agility || 0,
                        Math.floor(3 * QUALITY_MULTIPLIERS[quality]));
                }
                // Add other stat preferences here
            }

            const itemData = {
                type,
                quality,
                name,
                userPrompt,
                ...stats
            };
            description = await generateAIDescription(itemData);
        } else {
            // Use regular generation
            stats = {
                baseStats: generateBaseStats(quality, powerScale),
                combatStats: generateCombatStats(type, quality, powerScale),
                weaponStats: type === 'weapon' ? generateWeaponStats(quality, powerScale) : null
            };
            description = generateDescription(type, quality, name);
        }

        // Format the item to match the ItemWizard format
        const iconId = ITEM_TYPES[type]?.icon || 'inv_misc_questionmark';

        // Generate appropriate dimensions based on item type
        const getItemDimensions = (itemType, itemSubtype) => {
            // Default dimensions
            let width = 1;
            let height = 1;

            // Adjust dimensions based on item type
            switch (itemType) {
                case 'weapon':
                    if (subtype === 'GREATSWORD' || subtype === 'GREATAXE' ||
                        subtype === 'MAUL' || subtype === 'POLEARM') {
                        // Two-handed weapons are longer and wider
                        width = 2;
                        height = 4;
                    } else if (subtype === 'STAFF') {
                        // Staves are long but thin
                        width = 1;
                        height = 4;
                    } else if (subtype === 'SWORD' || subtype === 'AXE' || subtype === 'MACE') {
                        // One-handed weapons are medium length
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
                    }
                    break;
                case 'armor':
                    if (subtype === 'PLATE') {
                        // Plate armor takes more space
                        width = 2;
                        height = 2;
                    } else if (subtype === 'MAIL') {
                        // Mail armor is slightly smaller
                        width = 2;
                        height = 2;
                    } else if (subtype === 'LEATHER') {
                        // Leather armor is more compact
                        width = 1;
                        height = 2;
                    } else if (subtype === 'CLOTH') {
                        // Cloth armor is the most compact
                        width = 1;
                        height = 1;
                    }
                    break;
                case 'container':
                    // Containers are larger
                    width = 2;
                    height = 2;
                    break;
                case 'consumable':
                    // Consumables are small
                    width = 1;
                    height = 1;
                    break;
                case 'miscellaneous':
                    // Misc items vary
                    if (itemSubtype === 'QUEST' || itemSubtype === 'KEY') {
                        width = 1;
                        height = 1;
                    } else if (itemSubtype === 'CRAFTING' || itemSubtype === 'TRADE_GOODS') {
                        width = 2;
                        height = 1;
                    }
                    break;
                default:
                    width = 1;
                    height = 1;
            }

            return { width, height };
        };

        // Get dimensions for this item
        const dimensions = getItemDimensions(type, subtype);

        return {
            id: initialData?.id || crypto.randomUUID(),
            name: name || 'Unnamed Item',
            quality: quality || 'common',
            description: description || '',
            type: type,
            subtype: subtype,

            // For weapons
            ...(type === 'weapon' && {
                weaponSlot: stats.weaponSlot || 'ONE_HANDED',
                hand: stats.hand || 'MAIN_HAND',
                weaponStats: stats.weaponStats
            }),

            // Armor class directly at top level for display
            armorClass: stats.combatStats?.armorClass?.value || 0,

            // Slots (important for display)
            slots: type === 'weapon' ?
                  [stats.weaponSlot || 'mainHand'] :
                  slots || [],

            // Base stats - ensure proper structure with values and isPercentage
            baseStats: Object.entries(stats.baseStats || {}).reduce((acc, [key, value]) => {
                acc[key] = typeof value === 'object' ? value : {
                    value: value,
                    isPercentage: false
                };
                return acc;
            }, {}),

            // Combat stats - ensure proper structure
            combatStats: Object.entries(stats.combatStats || {}).reduce((acc, [key, value]) => {
                if (key === 'resistances') {
                    acc[key] = value;
                } else {
                    acc[key] = typeof value === 'object' ? value : {
                        value: value,
                        isPercentage: false
                    };
                }
                return acc;
            }, {}),

            // Utility stats - ensure proper structure
            utilityStats: type === 'consumable' ? generateConsumableStats() : {},

            // Calculate item value based on quality and stats
            value: calculateItemValue(quality, {
                baseStats: stats.baseStats || {},
                combatStats: stats.combatStats || {},
                weaponStats: stats.weaponStats
            }),

            // Appearance
            iconId: iconId,
            imageUrl: null, // Use iconId with getIconUrl instead

            // Item dimensions for inventory grid
            width: dimensions.width,
            height: dimensions.height,
            rotation: 0 // Default rotation
        };
    };

    return (
        <div className="quick-item-wizard">
            <h2>{initialData ? 'Edit Item' : 'Create New Item'}</h2>

            <div className="form-group">
                <label>Item Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {Object.keys(ITEM_TYPES).map(type => (
                        <option key={type} value={type}>{ITEM_TYPES[type].name}</option>
                    ))}
                </select>
            </div>

            {type === 'miscellaneous' && (
                <div className="form-group">
                    <label>Item Subtype</label>
                    <select
                        value={subtype}
                        onChange={(e) => setSubtype(e.target.value)}
                    >
                        <option value="">Select a subtype...</option>
                        {Object.entries(MISC_SUBTYPES).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
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

            {usesPowerScale(type, subtype) && (
                <div className="form-group">
                    <label>Power Scale: {POWER_SCALE_MULTIPLIERS[powerScale]}</label>
                    <input
                        type="range"
                        min="0.1"
                        max="1.5"
                        step="0.15"
                        value={powerScale}
                        onChange={(e) => setPowerScale(parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>
            )}

            <div className="form-group">
                <div className="ai-toggle">
                    <input
                        type="checkbox"
                        id="useAI"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                    />
                    <label htmlFor="useAI">Use AI Generation</label>
                </div>

                {useAI && (
                    <div className="ai-prompt">
                        <textarea
                            placeholder="Enter your preferences (e.g., 'agility based weapon with toxic damage preferably 2d4')"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            rows={3}
                        />
                    </div>
                )}
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
        </div>
    );
};

export default QuickItemWizard;
