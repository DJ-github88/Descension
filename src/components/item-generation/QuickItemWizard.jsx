import React, { useState, useEffect } from 'react';
import { ITEM_TYPES, QUALITY_TYPES, EQUIPMENT_SLOTS } from './itemConstants';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const callOpenAI = async (prompt, temperature = 0.7) => {
    if (!OPENAI_API_KEY) {
        console.error('OpenAI API key not found');
        throw new Error('OpenAI API key not configured');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a creative fantasy item description writer. Your descriptions should be vivid, engaging, and match the requested tone (funny or serious). For funny descriptions, use clever puns and humorous references while still describing the item's properties. Keep descriptions concise but memorable."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: temperature,
                max_tokens: 150,
                presence_penalty: 0.5,
                frequency_penalty: 0.5
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API Error:', error);
            throw new Error(error.error?.message || 'API call failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
};

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

const generateBaseStats = (quality) => {
    // Base stat ranges by quality
    const statRanges = {
        poor: { min: 1, max: 2 },
        common: { min: 1, max: 3 },
        uncommon: { min: 2, max: 4 },
        rare: { min: 3, max: 5 },
        epic: { min: 4, max: 6 },
        legendary: { min: 5, max: 8 }
    };

    const range = statRanges[quality];
    const stats = {};

    // Generate 1-3 random stats
    const numStats = Math.floor(Math.random() * 3) + 1;
    const possibleStats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    
    for (let i = 0; i < numStats; i++) {
        if (possibleStats.length === 0) break;
        const statIndex = Math.floor(Math.random() * possibleStats.length);
        const stat = possibleStats.splice(statIndex, 1)[0];
        stats[stat] = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    return stats;
};

const generateCombatStats = (type, quality, powerScale = 1) => {
    // Combat stat ranges by quality
    const baseCombatRanges = {
        poor: {
            damage: { min: 1, max: 2 },
            critChance: { min: 1, max: 2 },
            critDamage: { min: 5, max: 10 },
            armorClass: { min: 1, max: 2 }
        },
        common: {
            damage: { min: 1, max: 3 },
            critChance: { min: 2, max: 3 },
            critDamage: { min: 10, max: 15 },
            armorClass: { min: 2, max: 3 }
        },
        uncommon: {
            damage: { min: 2, max: 4 },
            critChance: { min: 2, max: 4 },
            critDamage: { min: 15, max: 20 },
            armorClass: { min: 3, max: 4 }
        },
        rare: {
            damage: { min: 3, max: 5 },
            critChance: { min: 3, max: 5 },
            critDamage: { min: 20, max: 30 },
            armorClass: { min: 4, max: 5 }
        },
        epic: {
            damage: { min: 4, max: 6 },
            critChance: { min: 4, max: 6 },
            critDamage: { min: 25, max: 40 },
            armorClass: { min: 5, max: 6 }
        },
        legendary: {
            damage: { min: 5, max: 8 },
            critChance: { min: 5, max: 8 },
            critDamage: { min: 35, max: 50 },
            armorClass: { min: 6, max: 8 }
        }
    };

    // Adjust ranges based on power scale
    const combatRanges = {
        poor: {
            damage: adjustRangeByPowerScale(baseCombatRanges.poor.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.poor.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.poor.critDamage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.poor.armorClass, powerScale)
        },
        common: {
            damage: adjustRangeByPowerScale(baseCombatRanges.common.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.common.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.common.critDamage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.common.armorClass, powerScale)
        },
        uncommon: {
            damage: adjustRangeByPowerScale(baseCombatRanges.uncommon.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.uncommon.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.uncommon.critDamage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.uncommon.armorClass, powerScale)
        },
        rare: {
            damage: adjustRangeByPowerScale(baseCombatRanges.rare.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.rare.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.rare.critDamage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.rare.armorClass, powerScale)
        },
        epic: {
            damage: adjustRangeByPowerScale(baseCombatRanges.epic.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.epic.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.epic.critDamage, powerScale),
            armorClass: adjustRangeByPowerScale(baseCombatRanges.epic.armorClass, powerScale)
        },
        legendary: {
            damage: adjustRangeByPowerScale(baseCombatRanges.legendary.damage, powerScale),
            critChance: adjustRangeByPowerScale(baseCombatRanges.legendary.critChance, powerScale),
            critDamage: adjustRangeByPowerScale(baseCombatRanges.legendary.critDamage, powerScale),
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

    // Add 1-2 random common stats
    const numCommonStats = Math.floor(Math.random() * 2) + 1;
    const selectedCommonStats = shuffle(Object.keys(commonStats)).slice(0, numCommonStats);
    selectedCommonStats.forEach(stat => {
        stats[stat] = commonStats[stat]();
    });

    switch (type) {
        case 'weapon':
            stats.critChance = Math.floor(Math.random() * (range.critChance.max - range.critChance.min + 1)) + range.critChance.min;
            stats.critDamage = Math.floor(Math.random() * (range.critDamage.max - range.critDamage.min + 1)) + range.critDamage.min;
            
            // Add weapon-specific damage type
            const extraDamageType = getRandomElement(['piercingDamage', 'bludgeoningDamage', 'slashingDamage']);
            stats[extraDamageType] = Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min;
            break;

        case 'armor':
            stats.armorClass = Math.floor(Math.random() * (range.armorClass.max - range.armorClass.min + 1)) + range.armorClass.min;
            stats.maxHealth = Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min;
            
            // Add random resistance
            const resistanceType = getRandomElement(['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder']);
            stats[`${resistanceType}Resistance`] = Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min;
            break;

        case 'accessory':
            // Accessories get an extra common stat
            const extraStat = shuffle(Object.keys(commonStats))[0];
            stats[extraStat] = commonStats[extraStat]();
            break;

        case 'consumable':
            if (Math.random() < 0.5) {
                stats.healthRestore = Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min;
            } else {
                stats.manaRestore = Math.floor(Math.random() * (range.damage.max - range.damage.min + 1)) + range.damage.min;
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

const generateWeaponStats = (quality) => {
    const multiplier = QUALITY_MULTIPLIERS[quality];
    const diceTypes = [4, 6, 8, 10, 12];
    const diceCount = Math.max(1, Math.floor(getRandomInt(1, 2) * multiplier));
    const diceType = diceTypes[Math.floor(Math.random() * diceTypes.length)];
    const bonusDamage = Math.floor(getRandomInt(1, 4) * multiplier);
    const damageType = getRandomElement(['slashing', 'piercing', 'bludgeoning']);
    const bonusDamageType = getRandomElement(['fire', 'cold', 'lightning', 'acid', 'force', 'necrotic', 'radiant', 'poison', 'psychic', 'thunder']);

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

        const description = await callOpenAI(prompt, 0.8);
        if (!description) {
            throw new Error('Failed to generate description');
        }
        return description.trim();
    } catch (error) {
        console.error('Error generating AI description:', error);
        return generateDescription(itemData.type, itemData.quality, itemData.name);
    }
};

const generateAIStats = async (type, quality, userPrompt) => {
    const requestedStats = {};
    
    try {
        // Process the user prompt for specific stat requests
        const words = userPrompt.toLowerCase().split(' ');
        for (const stat of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
            const modifier = getStatModifierFromPrompt(words, stat);
            if (modifier !== 1) {
                const baseValue = Math.floor(3 * QUALITY_MULTIPLIERS[quality]);
                requestedStats[stat] = Math.max(1, Math.floor(baseValue * modifier));
            }
        }

        return {
            ...generateBaseStats(quality),
            ...requestedStats,
            ...generateCombatStats(type, quality)
        };
    } catch (error) {
        console.error('Error generating AI stats:', error);
        return {
            ...generateBaseStats(quality),
            ...requestedStats,
            ...generateCombatStats(type, quality)
        };
    }
};

const getStatModifierFromPrompt = (words, stat) => {
    const statKeywords = {
        strength: ['strength', 'str', 'powerful'],
        constitution: ['constitution', 'con', 'sturdy', 'tough'],
        dexterity: ['dexterity', 'dex', 'agile'],
        intelligence: ['intelligence', 'int', 'smart'],
        wisdom: ['wisdom', 'wis'],
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
                dexterity: ['dexterity', 'dex', 'agile'],
                intelligence: ['intelligence', 'int', 'smart'],
                wisdom: ['wisdom', 'wis'],
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
                    const weaponTypes = ['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'SPEAR'];
                    for (const wType of weaponTypes) {
                        if (lowerPrompt.includes(wType.toLowerCase())) {
                            subtype = wType;
                            break;
                        }
                    }
                    if (!subtype) subtype = getRandomElement(['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'SPEAR']);
                } else {
                    if (Math.random() < 0.7) {
                        const weaponSlot = 'ONE_HANDED';
                        const hand = 'MAIN_HAND';
                    } else {
                        const weaponSlot = 'TWO_HANDED';
                    }
                    subtype = getRandomElement(['STAFF', 'SWORD', 'AXE', 'MACE', 'DAGGER', 'SPEAR']);
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
                baseStats: generateBaseStats(quality),
                combatStats: generateCombatStats(type, quality, powerScale),
                weaponStats: type === 'weapon' ? generateWeaponStats(quality) : null
            };
            description = generateDescription(type, quality, name);
        }

        return {
            id: initialData?.id || Date.now().toString(),
            type,
            quality,
            subtype,
            slots,
            name,
            description,
            icon: ITEM_TYPES[type]?.icon || 'inv_misc_questionmark',
            ...stats,
            utilityStats: type === 'consumable' ? generateConsumableStats() : null
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
