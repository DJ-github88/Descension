/**
 * Experience and Leveling Utilities
 * Handles XP calculations, level progression, and level-up logic
 */

// XP requirements table based on rulesData.js
// Format: [level, xpForThisLevel, totalXPRequired]
const XP_TABLE = [
    [1, 0, 0],
    [2, 300, 300],
    [3, 600, 900],
    [4, 1800, 2700],
    [5, 3800, 6500],
    [6, 5500, 12000],
    [7, 8000, 20000],
    [8, 11000, 31000],
    [9, 14000, 45000],
    [10, 19000, 64000],
    [11, 21000, 85000],
    [12, 25000, 110000],
    [13, 30000, 140000],
    [14, 35000, 175000],
    [15, 50000, 225000],
    [16, 60000, 285000],
    [17, 75000, 360000],
    [18, 90000, 450000],
    [19, 110000, 560000],
    [20, 120000, 680000]
];

/**
 * Get total XP required to reach a specific level
 * @param {number} level - Target level (1-20)
 * @returns {number} Total XP required
 */
export function getXPForLevel(level) {
    if (level < 1) return 0;
    if (level > 20) return XP_TABLE[XP_TABLE.length - 1][2];
    
    const entry = XP_TABLE.find(row => row[0] === level);
    return entry ? entry[2] : 0;
}

/**
 * Get the level for a given amount of XP
 * @param {number} xp - Current XP amount
 * @returns {number} Current level (1-20)
 */
export function getLevelFromXP(xp) {
    if (xp < 0) return 1;
    
    // Find the highest level where totalXP <= current XP
    for (let i = XP_TABLE.length - 1; i >= 0; i--) {
        if (xp >= XP_TABLE[i][2]) {
            return XP_TABLE[i][0];
        }
    }
    
    return 1;
}

/**
 * Get XP progress information for current level
 * @param {number} currentXP - Current XP amount
 * @returns {Object} Progress information
 */
export function getXPProgress(currentXP) {
    const currentLevel = getLevelFromXP(currentXP);
    const currentLevelXP = getXPForLevel(currentLevel);
    const nextLevelXP = getXPForLevel(currentLevel + 1);
    
    // XP needed for current level bracket
    const xpIntoLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    
    // Calculate percentage (0-100)
    const percentage = xpNeededForLevel > 0 
        ? Math.min(100, (xpIntoLevel / xpNeededForLevel) * 100)
        : 100;
    
    return {
        currentLevel,
        currentXP,
        currentLevelXP,
        nextLevelXP,
        xpIntoLevel,
        xpNeededForLevel,
        percentage,
        isMaxLevel: currentLevel >= 20
    };
}

/**
 * Check if XP gain results in level up
 * @param {number} oldXP - Previous XP amount
 * @param {number} newXP - New XP amount
 * @returns {Object} Level up information
 */
export function checkLevelUp(oldXP, newXP) {
    const oldLevel = getLevelFromXP(oldXP);
    const newLevel = getLevelFromXP(newXP);
    
    return {
        didLevelUp: newLevel > oldLevel,
        oldLevel,
        newLevel,
        levelsGained: newLevel - oldLevel
    };
}

/**
 * Format XP number with commas for display
 * @param {number} xp - XP amount
 * @returns {string} Formatted XP string
 */
export function formatXP(xp) {
    return xp.toLocaleString('en-US');
}

/**
 * Get XP segments for visual display (10 segments)
 * @param {number} percentage - Progress percentage (0-100)
 * @returns {Array<boolean>} Array of 10 booleans indicating filled segments
 */
export function getXPSegments(percentage) {
    const segments = [];
    const segmentSize = 10; // 10 segments = 10% each
    
    for (let i = 0; i < 10; i++) {
        const segmentThreshold = (i + 1) * segmentSize;
        segments.push(percentage >= segmentThreshold);
    }
    
    return segments;
}

/**
 * Calculate HP gain on level up (1d8 + CON modifier)
 * @param {number} constitutionScore - Constitution stat (10 = +0 modifier)
 * @returns {number} HP gained (minimum 1)
 */
export function calculateLevelUpHP(constitutionScore) {
    const conModifier = Math.floor((constitutionScore - 10) / 2);
    const roll = Math.floor(Math.random() * 8) + 1; // 1d8
    return Math.max(1, roll + conModifier);
}

/**
 * Get level up rewards
 * @param {number} newLevel - The level just reached
 * @returns {Object} Rewards for leveling up
 */
export function getLevelUpRewards(newLevel) {
    const rewards = {
        talentPoints: 1, // Always gain 1 talent point
        attributePoints: 0,
        specialFeatures: []
    };
    
    // Attribute improvements at levels 4, 8, 12, 16, 20
    if (newLevel % 4 === 0) {
        rewards.attributePoints = 2;
    }
    
    // Special features at certain levels
    if (newLevel === 5) {
        rewards.specialFeatures.push('Extra Attack');
    }
    if (newLevel === 10) {
        rewards.specialFeatures.push('Improved Critical');
    }
    if (newLevel === 15) {
        rewards.specialFeatures.push('Legendary Resistance');
    }
    if (newLevel === 20) {
        rewards.specialFeatures.push('Epic Boon');
    }
    
    return rewards;
}

