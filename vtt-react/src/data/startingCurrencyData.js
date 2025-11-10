/**
 * Starting Currency Data Module
 *
 * Defines starting currency amounts for character creation based on:
 * - Background (primary determinant)
 * - Path (modifier/bonus)
 *
 * Currency system: 100 copper = 1 silver, 100 silver = 1 gold, 100 gold = 1 platinum
 */

// Base starting currency by background
export const BACKGROUND_STARTING_CURRENCY = {
    acolyte: {
        platinum: 0,
        gold: 15,
        silver: 0,
        copper: 0,
        description: 'Modest temple stipend for basic needs'
    },
    
    criminal: {
        platinum: 0,
        gold: 20,
        silver: 0,
        copper: 0,
        description: 'Ill-gotten gains from past exploits'
    },
    
    folkHero: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Humble savings from common folk'
    },
    
    noble: {
        platinum: 0,
        gold: 50,
        silver: 0,
        copper: 0,
        description: 'Generous family allowance'
    },
    
    sage: {
        platinum: 0,
        gold: 18,
        silver: 0,
        copper: 0,
        description: 'Earnings from scholarly pursuits'
    },
    
    soldier: {
        platinum: 0,
        gold: 12,
        silver: 0,
        copper: 0,
        description: 'Military pay and saved wages'
    },
    
    outlander: {
        platinum: 0,
        gold: 8,
        silver: 0,
        copper: 0,
        description: 'Meager funds from wilderness survival'
    },
    
    charlatan: {
        platinum: 0,
        gold: 25,
        silver: 0,
        copper: 0,
        description: 'Profits from successful cons'
    }
};

// Path-based currency modifiers (added to background base)
export const PATH_CURRENCY_MODIFIERS = {
    mystic: {
        platinum: 0,
        gold: 5,
        silver: 0,
        copper: 0,
        description: 'Mystical insights lead to profitable opportunities'
    },
    
    zealot: {
        platinum: 0,
        gold: 3,
        silver: 0,
        copper: 0,
        description: 'Donations from the faithful'
    },
    
    trickster: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Extra funds from clever schemes'
    },
    
    harrow: {
        platinum: 0,
        gold: 2,
        silver: 0,
        copper: 0,
        description: 'Modest gains from hunting bounties'
    },
    
    arcanist: {
        platinum: 0,
        gold: 7,
        silver: 0,
        copper: 0,
        description: 'Arcane research grants and stipends'
    },
    
    hexer: {
        platinum: 0,
        gold: 4,
        silver: 0,
        copper: 0,
        description: 'Payment for curse removal services'
    },
    
    reaver: {
        platinum: 0,
        gold: 6,
        silver: 0,
        copper: 0,
        description: 'Spoils from past battles'
    },
    
    mercenary: {
        platinum: 0,
        gold: 8,
        silver: 0,
        copper: 0,
        description: 'Earnings from contract work'
    },
    
    sentinel: {
        platinum: 0,
        gold: 5,
        silver: 0,
        copper: 0,
        description: 'Guard duty wages and bonuses'
    }
};

/**
 * Calculate total starting currency for a character
 * @param {string} background - Character's background ID
 * @param {string} path - Character's path ID
 * @returns {Object} Total starting currency { platinum, gold, silver, copper }
 */
export const calculateStartingCurrency = (background, path) => {
    const baseCurrency = BACKGROUND_STARTING_CURRENCY[background] || {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0
    };

    const pathModifier = PATH_CURRENCY_MODIFIERS[path] || {
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: 0
    };

    // Combine base and modifier currency
    const totalCurrency = {
        platinum: (baseCurrency.platinum || 0) + (pathModifier.platinum || 0),
        gold: (baseCurrency.gold || 0) + (pathModifier.gold || 0),
        silver: (baseCurrency.silver || 0) + (pathModifier.silver || 0),
        copper: (baseCurrency.copper || 0) + (pathModifier.copper || 0)
    };

    // Auto-convert upward (100 copper = 1 silver, etc.)
    return convertCurrencyUpward(totalCurrency);
};

/**
 * Convert currency upward (copper -> silver -> gold -> platinum)
 * @param {Object} currency - Currency object
 * @returns {Object} Converted currency
 */
export const convertCurrencyUpward = (currency) => {
    let { platinum = 0, gold = 0, silver = 0, copper = 0 } = currency;
    
    // Convert copper to silver (100 copper = 1 silver)
    if (copper >= 100) {
        const newSilver = Math.floor(copper / 100);
        silver += newSilver;
        copper = copper % 100;
    }
    
    // Convert silver to gold (100 silver = 1 gold)
    if (silver >= 100) {
        const newGold = Math.floor(silver / 100);
        gold += newGold;
        silver = silver % 100;
    }
    
    // Convert gold to platinum (100 gold = 1 platinum)
    if (gold >= 100) {
        const newPlatinum = Math.floor(gold / 100);
        platinum += newPlatinum;
        gold = gold % 100;
    }
    
    return { platinum, gold, silver, copper };
};

/**
 * Calculate total value in copper for comparison
 * @param {Object} currency - Currency object
 * @returns {number} Total value in copper
 */
export const calculateTotalCopper = (currency) => {
    return (
        (currency.platinum || 0) * 1000000 +
        (currency.gold || 0) * 10000 +
        (currency.silver || 0) * 100 +
        (currency.copper || 0)
    );
};

/**
 * Subtract currency (for purchases)
 * @param {Object} currentCurrency - Current currency
 * @param {Object} cost - Cost to subtract
 * @returns {Object|null} New currency or null if insufficient funds
 */
export const subtractCurrency = (currentCurrency, cost) => {
    const currentCopper = calculateTotalCopper(currentCurrency);
    const costCopper = calculateTotalCopper(cost);
    
    if (currentCopper < costCopper) {
        return null; // Insufficient funds
    }
    
    const remainingCopper = currentCopper - costCopper;
    
    // Convert back to currency object
    return {
        platinum: Math.floor(remainingCopper / 1000000),
        gold: Math.floor((remainingCopper % 1000000) / 10000),
        silver: Math.floor((remainingCopper % 10000) / 100),
        copper: remainingCopper % 100
    };
};

/**
 * Add currency (for refunds)
 * @param {Object} currentCurrency - Current currency
 * @param {Object} refund - Amount to add
 * @returns {Object} New currency
 */
export const addCurrency = (currentCurrency, refund) => {
    const totalCurrency = {
        platinum: (currentCurrency.platinum || 0) + (refund.platinum || 0),
        gold: (currentCurrency.gold || 0) + (refund.gold || 0),
        silver: (currentCurrency.silver || 0) + (refund.silver || 0),
        copper: (currentCurrency.copper || 0) + (refund.copper || 0)
    };
    
    return convertCurrencyUpward(totalCurrency);
};

/**
 * Format currency for display
 * @param {Object} currency - Currency object
 * @returns {string} Formatted string (e.g., "25g 50s 25c")
 */
export const formatCurrency = (currency) => {
    // Handle null/undefined currency
    if (!currency) {
        return '0c';
    }

    const parts = [];

    if (currency.platinum > 0) {
        parts.push(`${currency.platinum}p`);
    }
    if (currency.gold > 0) {
        parts.push(`${currency.gold}g`);
    }
    if (currency.silver > 0) {
        parts.push(`${currency.silver}s`);
    }
    if (currency.copper > 0 || parts.length === 0) {
        parts.push(`${currency.copper}c`);
    }

    return parts.join(' ');
};

