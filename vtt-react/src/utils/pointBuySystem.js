/**
 * Point-Buy Stat Allocation System
 * 
 * Implements a D&D 5e inspired point-buy system for character creation
 * with customizable point pools based on background selection.
 */

// Base point-buy configuration
export const POINT_BUY_CONFIG = {
    // Base stats start at 8
    BASE_STAT_VALUE: 8,
    
    // Maximum stat value before racial modifiers
    MAX_STAT_VALUE: 15,
    
    // Minimum stat value
    MIN_STAT_VALUE: 8,
    
    // Base point pool (standard D&D 5e)
    BASE_POINT_POOL: 27,
    
    // Point costs for each stat level
    POINT_COSTS: {
        8: 0,   // Base value costs 0 points
        9: 1,   // +1 costs 1 point
        10: 2,  // +2 costs 2 points total
        11: 3,  // +3 costs 3 points total
        12: 4,  // +4 costs 4 points total
        13: 5,  // +5 costs 5 points total
        14: 7,  // +6 costs 7 points total (premium cost)
        15: 9   // +7 costs 9 points total (premium cost)
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
        description: 'Speed, reflexes, and dexterity. Affects ranged attacks, stealth, and initiative.',
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
 * Calculate available points based on background and total spent
 */
export const calculateAvailablePoints = (stats, backgroundStartingPoints = 0) => {
    const totalPool = POINT_BUY_CONFIG.BASE_POINT_POOL + backgroundStartingPoints;
    const spent = calculateTotalPointsSpent(stats);
    return totalPool - spent;
};

/**
 * Check if a stat can be increased
 */
export const canIncreaseStat = (stats, statId, backgroundStartingPoints = 0) => {
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
    
    const availablePoints = calculateAvailablePoints(stats, backgroundStartingPoints);
    
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
export const increaseStat = (stats, statId, backgroundStartingPoints = 0) => {
    if (!canIncreaseStat(stats, statId, backgroundStartingPoints)) {
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
export const validateStats = (stats, backgroundStartingPoints = 0) => {
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
    const availablePoints = calculateAvailablePoints(stats, backgroundStartingPoints);
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
 * Get stat breakdown for display
 */
export const getStatBreakdown = (baseStats, racialModifiers = {}, backgroundModifiers = {}) => {
    const breakdown = {};
    
    ABILITY_SCORES.forEach(ability => {
        const statId = ability.id;
        const base = baseStats[statId] || POINT_BUY_CONFIG.BASE_STAT_VALUE;
        const racial = racialModifiers[statId] || 0;
        const background = backgroundModifiers[statId] || 0;
        const final = base + racial + background;
        
        breakdown[statId] = {
            base,
            racial,
            background,
            final,
            modifier: calculateAbilityModifier(final),
            pointCost: getStatPointCost(base)
        };
    });
    
    return breakdown;
};
