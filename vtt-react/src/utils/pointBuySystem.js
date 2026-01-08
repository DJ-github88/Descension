/**
 * Point-Buy Stat Allocation System
 *
 * Implements a D&D 5e inspired point-buy system for character creation
 * with customizable point pools based on background selection.
 */

import { getCustomBackgroundStartingPoints } from '../data/customBackgroundData';
import { getPathStartingPoints } from '../data/pathData';

// Base point-buy configuration
export const POINT_BUY_CONFIG = {
    // Base stats start at 5 for gritty vibe
    BASE_STAT_VALUE: 5,

    // Maximum stat value before racial modifiers
    MAX_STAT_VALUE: 15,

    // Minimum stat value
    MIN_STAT_VALUE: 5,

    // Reduced base point pool for gritty feel
    BASE_POINT_POOL: 15,
    
    // Point costs for each stat level (adjusted for base 5)
    POINT_COSTS: {
        5: 0,   // Base value costs 0 points
        6: 1,   // +1 costs 1 point
        7: 2,   // +2 costs 2 points total
        8: 3,   // +3 costs 3 points total
        9: 4,   // +4 costs 4 points total
        10: 5,  // +5 costs 5 points total
        11: 7,  // +6 costs 7 points total (premium cost)
        12: 9,  // +7 costs 9 points total (premium cost)
        13: 12, // +8 costs 12 points total (premium cost)
        14: 15, // +9 costs 15 points total (premium cost)
        15: 19  // +10 costs 19 points total (premium cost)
    }
};

// The six ability scores in our system
export const ABILITY_SCORES = [
    {
        id: 'strength',
        name: 'Strength',
        shortName: 'STR',
        description: 'Physical power and muscle. Affects melee damage, carrying capacity, and athletic feats.',
        icon: 'fas fa-fist-raised'
    },
    {
        id: 'agility',
        name: 'Agility',
        shortName: 'AGI',
        description: 'Speed, reflexes, and agility. Affects ranged attacks, stealth, and initiative.',
        icon: 'fas fa-running'
    },
    {
        id: 'constitution',
        name: 'Constitution',
        shortName: 'CON',
        description: 'Health and stamina. Affects hit points, endurance, and resistance to disease.',
        icon: 'fas fa-heart'
    },
    {
        id: 'intelligence',
        name: 'Intelligence',
        shortName: 'INT',
        description: 'Reasoning ability and memory. Affects spell power, skill points, and knowledge.',
        icon: 'fas fa-brain'
    },
    {
        id: 'spirit',
        name: 'Spirit',
        shortName: 'SPR',
        description: 'Willpower and intuition. Affects mana, divine magic, and mental resistance.',
        icon: 'fas fa-dove'
    },
    {
        id: 'charisma',
        name: 'Charisma',
        shortName: 'CHA',
        description: 'Force of personality and leadership. Affects social interactions and some magic.',
        icon: 'fas fa-star'
    }
];

/**
 * Calculate the point cost for a given stat value
 */
export const getStatPointCost = (statValue) => {
    return POINT_BUY_CONFIG.POINT_COSTS[statValue] || 0;
};

/**
 * Calculate total points spent on all stats
 */
export const calculateTotalPointsSpent = (stats) => {
    return ABILITY_SCORES.reduce((total, ability) => {
        const statValue = stats[ability.id] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
        return total + getStatPointCost(statValue);
    }, 0);
};

/**
 * Calculate available points based on race, subrace, background, and path bonuses
 */
export const calculateAvailablePoints = (stats, bonuses = {}) => {
    const { race = 0, subrace = 0, background = 0, path = 0 } = bonuses;
    const totalPool = POINT_BUY_CONFIG.BASE_POINT_POOL + race + subrace + background + path;
    const spent = calculateTotalPointsSpent(stats);
    return totalPool - spent;
};

/**
 * Check if a stat can be increased
 */
export const canIncreaseStat = (stats, statId, bonuses = {}) => {
    const currentValue = stats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;

    // Check if at maximum
    if (currentValue >= POINT_BUY_CONFIG.MAX_STAT_VALUE) {
        return false;
    }

    // Check if we have enough points
    const newValue = currentValue + 1;
    const currentCost = getStatPointCost(currentValue);
    const newCost = getStatPointCost(newValue);
    const additionalCost = newCost - currentCost;

    const availablePoints = calculateAvailablePoints(stats, bonuses);

    return availablePoints >= additionalCost;
};

/**
 * Check if a stat can be decreased
 */
export const canDecreaseStat = (stats, statId) => {
    const currentValue = stats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
    return currentValue > POINT_BUY_CONFIG.MIN_STAT_VALUE;
};

/**
 * Increase a stat by 1 if possible
 */
export const increaseStat = (stats, statId, bonuses = {}) => {
    if (!canIncreaseStat(stats, statId, bonuses)) {
        return stats;
    }

    const currentValue = stats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
    return {
        ...stats,
        [statId]: currentValue + 1
    };
};

/**
 * Decrease a stat by 1 if possible
 */
export const decreaseStat = (stats, statId) => {
    if (!canDecreaseStat(stats, statId)) {
        return stats;
    }
    
    const currentValue = stats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
    return {
        ...stats,
        [statId]: currentValue - 1
    };
};

/**
 * Apply racial modifiers to base stats
 */
export const applyRacialModifiers = (baseStats, racialModifiers) => {
    const modifiedStats = { ...baseStats };
    
    Object.keys(racialModifiers).forEach(statId => {
        if (modifiedStats[statId] !== undefined) {
            modifiedStats[statId] = (modifiedStats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE) + racialModifiers[statId];
        }
    });
    
    return modifiedStats;
};

/**
 * Apply background stat modifiers to base stats
 */
export const applyBackgroundModifiers = (baseStats, backgroundModifiers) => {
    const modifiedStats = { ...baseStats };
    
    Object.keys(backgroundModifiers).forEach(statId => {
        if (modifiedStats[statId] !== undefined) {
            modifiedStats[statId] = (modifiedStats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE) + backgroundModifiers[statId];
        }
    });
    
    return modifiedStats;
};

/**
 * Calculate final stats with all modifiers applied
 */
export const calculateFinalStats = (baseStats, racialModifiers = {}, backgroundModifiers = {}) => {
    // Start with base stats
    let finalStats = { ...baseStats };
    
    // Apply racial modifiers
    finalStats = applyRacialModifiers(finalStats, racialModifiers);
    
    // Apply background modifiers
    finalStats = applyBackgroundModifiers(finalStats, backgroundModifiers);
    
    return finalStats;
};

/**
 * Get default stat array (all stats at base value)
 */
export const getDefaultStats = () => {
    const defaultStats = {};
    ABILITY_SCORES.forEach(ability => {
        defaultStats[ability.id] = POINT_BUY_CONFIG.BASE_STAT_VALUE;
    });
    return defaultStats;
};

/**
 * Validate that stats are within legal bounds
 */
export const validateStats = (stats, bonuses = {}) => {
    const errors = [];

    // Check each stat is within bounds
    ABILITY_SCORES.forEach(ability => {
        const value = stats[ability.id] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
        if (value < POINT_BUY_CONFIG.MIN_STAT_VALUE) {
            errors.push(`${ability.name} cannot be below ${POINT_BUY_CONFIG.MIN_STAT_VALUE}`);
        }
        if (value > POINT_BUY_CONFIG.MAX_STAT_VALUE) {
            errors.push(`${ability.name} cannot be above ${POINT_BUY_CONFIG.MAX_STAT_VALUE}`);
        }
    });

    // Check point allocation
    const availablePoints = calculateAvailablePoints(stats, bonuses);
    if (availablePoints < 0) {
        errors.push(`You have spent ${Math.abs(availablePoints)} too many points`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Calculate D&D-style ability modifier from stat value
 */
export const calculateAbilityModifier = (statValue) => {
    return Math.floor((statValue - 10) / 2);
};

/**
 * Get bonus points from race selection
 */
export const getRaceBonusPoints = (raceId) => {
    // Races that provide bonus points (can be expanded based on lore)
    const raceBonuses = {
        'nordmark': 1, // Nordmark get +1 point for their resilience and survival skills
        'human': 2, // Humans get +2 points for their adaptability and ambition
        'elf': 1, // Elves get +1 point for their long lifespan and magical affinity
        'dwarf': 1, // Dwarves get +1 point for their craftsmanship and endurance
        'halfling': 1, // Halflings get +1 point for their luck and resourcefulness
        'halfelf': 1, // Half-elves get +1 point for their versatility
        'halforc': 0, // Half-orcs start with standard points
        'tiefling': 1, // Tieflings get +1 point for their infernal heritage
        'dragonborn': 0, // Dragonborn start with standard points
        'gnome': 2, // Gnomes get +2 points for their intelligence and ingenuity
    };
    return raceBonuses[raceId] || 0;
};

/**
 * Get bonus points from subrace selection
 */
export const getSubraceBonusPoints = (raceId, subraceId) => {
    // Subraces that provide bonus points (can be expanded based on lore)
    const subraceBonuses = {
        // Nordmark subraces
        'nordmark_berserker': 1, // Bloodhammer get +1 point for their martial prowess
        'nordmark_runekeeper': 1, // Rune-Keepers get +1 point for their magical knowledge
        'nordmark_frostbound': 1, // Frostbound get +1 point for their survival expertise

        // Human subraces
        'human_variant': 1, // Variant humans get +1 point for their flexible nature

        // Elf subraces
        'elf_high': 1, // High elves get +1 point for their magical prowess
        'elf_wood': 1, // Wood elves get +1 point for their natural connection
        'elf_dark': 1, // Dark elves get +1 point for their cunning

        // Dwarf subraces
        'dwarf_hill': 1, // Hill dwarves get +1 point for their resilience
        'dwarf_mountain': 1, // Mountain dwarves get +1 point for their strength

        // Halfling subraces
        'halfling_lightfoot': 1, // Lightfoot halflings get +1 point for their stealth
        'halfling_stout': 1, // Stout halflings get +1 point for their hardiness

        // Gnome subraces
        'gnome_forest': 1, // Forest gnomes get +1 point for their natural magic
        'gnome_rock': 1, // Rock gnomes get +1 point for their inventions

        // Tiefling subraces
        'tiefling_variant': 1, // Variant tieflings get +1 point for their adaptability
    };
    return subraceBonuses[`${raceId}_${subraceId}`] || 0;
};

/**
 * Get all available bonus points from character choices
 */
export const getTotalBonusPoints = (characterData) => {
    const raceBonus = getRaceBonusPoints(characterData.race);
    const subraceBonus = getSubraceBonusPoints(characterData.race, characterData.subrace);
    const backgroundBonus = characterData.background ?
        getCustomBackgroundStartingPoints(characterData.background) : 0;
    const pathBonus = characterData.path ?
        getPathStartingPoints(characterData.path) : 0;

    return {
        race: raceBonus,
        subrace: subraceBonus,
        background: backgroundBonus,
        path: pathBonus,
        total: raceBonus + subraceBonus + backgroundBonus + pathBonus
    };
};

/**
 * Get stat breakdown for display
 */
export const getStatBreakdown = (baseStats, racialModifiers = {}, backgroundModifiers = {}, pathModifiers = {}) => {
    const breakdown = {};

    ABILITY_SCORES.forEach(ability => {
        const statId = ability.id;
        const base = baseStats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
        const racial = racialModifiers[statId] || 0;
        const background = backgroundModifiers[statId] || 0;
        const path = pathModifiers[statId] || 0;
        const final = base + racial + background + path;

        breakdown[statId] = {
            base,
            racial,
            background,
            path,
            final,
            modifier: calculateAbilityModifier(final),
            pointCost: getStatPointCost(base)
        };
    });

    return breakdown;
};
