/**
 * Skill Point Allocation System
 * 
 * Defines the cost structure for upgrading skills during character creation
 * and the total points available based on character choices.
 */

// Cost to upgrade from one rank to the next (cumulative)
// Example: To go from Untrained to Adept costs 1 + 2 + 3 + 4 = 10 points total
export const SKILL_RANK_UPGRADE_COSTS = {
    UNTRAINED_TO_NOVICE: 1,      // First upgrade: 1 point
    NOVICE_TO_TRAINED: 2,        // Second upgrade: 2 points
    TRAINED_TO_APPRENTICE: 3,    // Third upgrade: 3 points
    APPRENTICE_TO_ADEPT: 4,      // Fourth upgrade: 4 points
    ADEPT_TO_EXPERT: 5,          // Fifth upgrade: 5 points
    EXPERT_TO_MASTER: 6          // Sixth upgrade: 6 points
};

// Total cost to reach each rank from Untrained
export const TOTAL_COST_TO_RANK = {
    UNTRAINED: 0,
    NOVICE: 1,
    TRAINED: 3,      // 1 + 2
    APPRENTICE: 6,   // 1 + 2 + 3
    ADEPT: 10,       // 1 + 2 + 3 + 4
    EXPERT: 15,      // 1 + 2 + 3 + 4 + 5
    MASTER: 21       // 1 + 2 + 3 + 4 + 5 + 6
};

// Base skill points available to all characters
export const BASE_SKILL_POINTS = 15;

// Additional points from various sources
export const SKILL_POINT_BONUSES = {
    // Intelligence modifier bonus (per point of INT modifier)
    INTELLIGENCE_MODIFIER_MULTIPLIER: 2,
    
    // Background bonuses (some backgrounds grant extra skill points)
    BACKGROUNDS: {
        'Sage': 3,
        'Scholar': 3,
        'Artisan': 2,
        'Merchant': 2,
        'Noble': 2,
        'Soldier': 1,
        'Sailor': 1,
        'Criminal': 1
        // Others default to 0
    },
    
    // Race bonuses (some races are naturally more skilled)
    RACES: {
        'Human': 2,      // Humans are versatile
        'Half-Elf': 2,   // Half-elves are adaptable
        'Gnome': 1       // Gnomes are curious
        // Others default to 0
    }
};

/**
 * Calculate total skill points available for a character
 * @param {Object} characterData - Character data from wizard context
 * @returns {number} Total skill points available
 */
export function calculateTotalSkillPoints(characterData) {
    let total = BASE_SKILL_POINTS;
    
    // Add intelligence modifier bonus
    const intModifier = Math.floor((characterData.finalStats?.intelligence || 10) - 10) / 2;
    total += Math.max(0, intModifier * SKILL_POINT_BONUSES.INTELLIGENCE_MODIFIER_MULTIPLIER);
    
    // Add background bonus
    const backgroundBonus = SKILL_POINT_BONUSES.BACKGROUNDS[characterData.background] || 0;
    total += backgroundBonus;
    
    // Add race bonus
    const raceBonus = SKILL_POINT_BONUSES.RACES[characterData.race] || 0;
    total += raceBonus;
    
    return Math.floor(total);
}

/**
 * Get the next rank after the current one
 * @param {string} currentRank - Current skill rank
 * @returns {string|null} Next rank or null if already at max
 */
export function getNextRank(currentRank) {
    const ranks = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER'];
    const currentIndex = ranks.indexOf(currentRank);
    
    if (currentIndex === -1 || currentIndex === ranks.length - 1) {
        return null;
    }
    
    return ranks[currentIndex + 1];
}

/**
 * Get the previous rank before the current one
 * @param {string} currentRank - Current skill rank
 * @returns {string|null} Previous rank or null if already at minimum
 */
export function getPreviousRank(currentRank) {
    const ranks = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER'];
    const currentIndex = ranks.indexOf(currentRank);
    
    if (currentIndex <= 0) {
        return null;
    }
    
    return ranks[currentIndex - 1];
}

/**
 * Get the cost to upgrade from current rank to next rank
 * @param {string} currentRank - Current skill rank
 * @returns {number} Cost in skill points, or 0 if can't upgrade
 */
export function getUpgradeCost(currentRank) {
    const costMap = {
        'UNTRAINED': SKILL_RANK_UPGRADE_COSTS.UNTRAINED_TO_NOVICE,
        'NOVICE': SKILL_RANK_UPGRADE_COSTS.NOVICE_TO_TRAINED,
        'TRAINED': SKILL_RANK_UPGRADE_COSTS.TRAINED_TO_APPRENTICE,
        'APPRENTICE': SKILL_RANK_UPGRADE_COSTS.APPRENTICE_TO_ADEPT,
        'ADEPT': SKILL_RANK_UPGRADE_COSTS.ADEPT_TO_EXPERT,
        'EXPERT': SKILL_RANK_UPGRADE_COSTS.EXPERT_TO_MASTER,
        'MASTER': 0
    };
    
    return costMap[currentRank] || 0;
}

/**
 * Get the refund amount for downgrading from current rank
 * @param {string} currentRank - Current skill rank
 * @returns {number} Refund in skill points, or 0 if can't downgrade
 */
export function getDowngradeRefund(currentRank) {
    const refundMap = {
        'UNTRAINED': 0,
        'NOVICE': SKILL_RANK_UPGRADE_COSTS.UNTRAINED_TO_NOVICE,
        'TRAINED': SKILL_RANK_UPGRADE_COSTS.NOVICE_TO_TRAINED,
        'APPRENTICE': SKILL_RANK_UPGRADE_COSTS.TRAINED_TO_APPRENTICE,
        'ADEPT': SKILL_RANK_UPGRADE_COSTS.APPRENTICE_TO_ADEPT,
        'EXPERT': SKILL_RANK_UPGRADE_COSTS.ADEPT_TO_EXPERT,
        'MASTER': SKILL_RANK_UPGRADE_COSTS.EXPERT_TO_MASTER
    };
    
    return refundMap[currentRank] || 0;
}

/**
 * Calculate total points spent on skill ranks
 * @param {Object} skillRanks - Object mapping skill IDs to rank names
 * @returns {number} Total points spent
 */
export function calculatePointsSpent(skillRanks) {
    let total = 0;
    
    for (const skillId in skillRanks) {
        const rank = skillRanks[skillId];
        total += TOTAL_COST_TO_RANK[rank] || 0;
    }
    
    return total;
}

/**
 * Validate if a skill can be upgraded
 * @param {string} currentRank - Current skill rank
 * @param {number} availablePoints - Available skill points
 * @returns {boolean} True if upgrade is possible
 */
export function canUpgradeSkill(currentRank, availablePoints) {
    if (currentRank === 'MASTER') return false;
    
    const cost = getUpgradeCost(currentRank);
    return availablePoints >= cost;
}

