/**
 * Starting Currency Data Module
 *
 * Defines starting currency amounts for character creation based on:
 * - Background (primary determinant)
 * - Path (modifier/bonus)
 *
 * Currency system: 100 copper = 1 silver, 100 silver = 1 gold, 100 gold = 1 platinum
 */

import { BACKGROUND_DATA } from './backgroundData';

// Base starting currency by background
export const BACKGROUND_STARTING_CURRENCY = {
    acolyte: {
        platinum: 0,
        gold: 15,
        silver: 0,
        copper: 0,
        description: 'Temple-keep alms from Solbrand-tenders. Modest temple stipend for basic needs'
    },
    
    criminal: {
        platinum: 0,
        gold: 20,
        silver: 0,
        copper: 0,
        description: 'Neth back-alley pact-coins, still warm from the last hand that held them. Ill-gotten gains from past exploits'
    },
    
    folkHero: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Coppers pressed into a Tessen road-tavern\'s palm by grateful commoners. Humble savings from common folk'
    },
    
    noble: {
        platinum: 0,
        gold: 50,
        silver: 0,
        copper: 0,
        description: 'Thalren house-leadger silver, sealed with the family\'s sigil-ring. Generous family allowance'
    },
    
    sage: {
        platinum: 0,
        gold: 18,
        silver: 0,
        copper: 0,
        description: 'Stipend from the Frozen Archive\'s chained-scribe desks. Earnings from scholarly pursuits'
    },
    
    soldier: {
        platinum: 0,
        gold: 12,
        silver: 0,
        copper: 0,
        description: 'Thrask border-ranger pay-pouches, ledger-stamped at the Greymark garrison. Military pay and saved wages'
    },
    
    outlander: {
        platinum: 0,
        gold: 8,
        silver: 0,
        copper: 0,
        description: 'A pouch of bog-iron scraps bartered along the Vel-Keth Bayou trails. Meager funds from wilderness survival'
    },
    
    charlatan: {
        platinum: 0,
        gold: 25,
        silver: 0,
        copper: 0,
        description: 'Sleight-of-hand winnings from Atropolis market-marks. Profits from successful cons'
    },
    
    entertainer: {
        platinum: 0,
        gold: 15,
        silver: 0,
        copper: 0,
        description: 'Revel Sylvan applause-coin, tossed from gallery nets. Tips from appreciative audiences'
    },
    
    guildArtisan: {
        platinum: 0,
        gold: 15,
        silver: 0,
        copper: 0,
        description: 'Morren guild-stamped marks from the wagon-fort markets. Earnings from guild craft sales'
    },
    
    hermit: {
        platinum: 0,
        gold: 5,
        silver: 0,
        copper: 0,
        description: 'A few coppers hoarded against the Frostwood fog. Humble savings from isolation'
    },
    
    sailor: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Salt-caked shares from the Merrowport docks. Wages from merchant ship voyages'
    },
    
    merchant: {
        platinum: 0,
        gold: 25,
        silver: 0,
        copper: 0,
        description: 'Morren caravan-trade silver, bound for the holding markets. Starting trade capital'
    },
    
    urchin: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'A rag-bound roll of stolen coppers hidden in a wall-crack. Hidden stash from streets'
    },
    
    scholar: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Frozen Archive ink-stained stipend chits. Academic stipend'
    }
};

// Calling (Class) starting gold modifiers
export const CLASS_STARTING_CURRENCY = {
    'Arcanoneer': { gold: 15 },
    'Berserker': { gold: 10 },
    'Shaper': { gold: 13 },
    'Harbinger': { gold: 11 },
    'Chronarch': { gold: 15 },
    'Inquisitor': { gold: 10 },
    'Revenant': { gold: 11 },
    'False Prophet': { gold: 20 },
    'Apex': { gold: 12 },
    'Animist': { gold: 12 },
    'Lunarch': { gold: 12 },
    'Martyr': { gold: 8 },
    'Minstrel': { gold: 15 },
    'Plaguebringer': { gold: 12 },
    'Pyrofiend': { gold: 12 },
    'Spellguard': { gold: 15 },
    'Toxicologist': { gold: 15 },
    'Warden': { gold: 12 },
    'Augur': { gold: 15 },
};

// Subrace/Heritage starting gold modifiers
export const SUBRACE_STARTING_CURRENCY = {
    shore_myrathil: { gold: 10 },
    deep_myrathil: { gold: 15 },
    brook_myrathil: { gold: 12 },
    trueborn_briaran: { gold: 5 },
    shorn_briaran: { gold: 8 },
    korr_emberth: { gold: 5 },
    thrask_emberth: { gold: 10 },
    kethrin_fexric: { gold: 5 },
    drall_fexric: { gold: 8 },
    morgh_groven: { gold: 8 },
    ithran_groven: { gold: 12 },
    masked_mimir: { gold: 12 },
    woven_mimir: { gold: 10 },
    unwoven_mimir: { gold: 8 },
    velun_neth: { gold: 10 },
    kessen_neth: { gold: 8 },
    drun_neth: { gold: 5 },
    vashir_astril: { gold: 12 },
    silath_astril: { gold: 10 },
    clean_vreken: { gold: 15 },
    marked_vreken: { gold: 5 },
    thalren_human: { gold: 10 },
    skald_human: { gold: 8 },
    tessen_human: { gold: 12 },
    solvarn_human: { gold: 20 },
    merryn_human: { gold: 10 },
    ordan_human: { gold: 8 },
    morren_human: { gold: 12 }
};

// Parent race backup starting gold
export const RACE_STARTING_CURRENCY = {
    myrathil: { gold: 10 },
    mimir: { gold: 10 },
    briaran: { gold: 5 },
    groven: { gold: 8 },
    emberth: { gold: 5 },
    vreken: { gold: 10 },
neth: { gold: 8 },
    astril: { gold: 10 },
    fexrick: { gold: 5 },
    human: { gold: 10 }
};

// Path-based currency modifiers (added to background base)
export const PATH_CURRENCY_MODIFIERS = {
    mystic: {
        platinum: 0,
        gold: 5,
        silver: 0,
        copper: 0,
        description: 'Astril constellation-readings paid in hush-coin. Mystical insights lead to profitable opportunities'
    },
    
    zealot: {
        platinum: 0,
        gold: 3,
        silver: 0,
        copper: 0,
        description: 'Sundale congregation-offerings left at Solbrand shrines. Donations from the faithful'
    },
    
    trickster: {
        platinum: 0,
        gold: 10,
        silver: 0,
        copper: 0,
        description: 'Neth contract-house kickbacks from fine-print clauses. Extra funds from clever schemes'
    },
    
    harrow: {
        platinum: 0,
        gold: 2,
        silver: 0,
        copper: 0,
        description: 'Schratling bounty-tokens collected from the Scribe-Sentinels. Modest gains from hunting bounties'
    },
    
    arcanist: {
        platinum: 0,
        gold: 7,
        silver: 0,
        copper: 0,
        description: 'Inscriptor guild grants stamped with cold-iron sigils. Arcane research grants and stipends'
    },
    
    hexer: {
        platinum: 0,
        gold: 4,
        silver: 0,
        copper: 0,
        description: 'Coppers paid to lift Plaguebringer hexes from bog-folk cattle. Payment for curse removal services'
    },
    
    reaver: {
        platinum: 0,
        gold: 6,
        silver: 0,
        copper: 0,
        description: 'Thrask battlefield-scavenged coin-pouches from the fallen. Spoils from past battles'
    },
    
    mercenary: {
        platinum: 0,
        gold: 8,
        silver: 0,
        copper: 0,
        description: 'Sundale ward-guard pay-chits for wall-and-patrol duty. Earnings from contract work'
    },
    
    sentinel: {
        platinum: 0,
        gold: 5,
        silver: 0,
        copper: 0,
        description: 'Scribe-Sentinel chain-of-office pay, ledger-stamped and sure. Guard duty wages and bonuses'
    }
};

/**
 * Calculate total starting currency for a character
 * @param {string} background - Character's background ID
 * @param {string} path - Character's path ID
 * @param {string} className - Character's Calling class name
 * @param {string} raceId - Character's heritage race ID
 * @param {string} subraceId - Character's heritage subrace ID
 * @returns {Object} Total starting currency { platinum, gold, silver, copper }
 */
export const calculateStartingCurrency = (background, path, className, raceId, subraceId) => {
    // Source of truth: backgroundData.js entries
    const bgData = BACKGROUND_DATA[background];
    const baseCurrency = bgData?.startingCurrency || BACKGROUND_STARTING_CURRENCY[background] || {
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

    // Normalize class name: strip specialization suffix (e.g., 'Martyr (Ironclad)' -> 'Martyr')
    const baseClass = (className || '').replace(/\s*\(.*?\)\s*$/, '');
    const classModifier = CLASS_STARTING_CURRENCY[baseClass] || {
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: 0
    };

    const subraceModifier = SUBRACE_STARTING_CURRENCY[subraceId] || RACE_STARTING_CURRENCY[raceId] || {
        platinum: 0,
        gold: 0,
        silver: 0,
        copper: 0
    };

    // Combine base, path, class, and subrace currency
    const totalCurrency = {
        platinum: (baseCurrency.platinum || 0) + (pathModifier.platinum || 0) + (classModifier.platinum || 0) + (subraceModifier.platinum || 0),
        gold: (baseCurrency.gold || 0) + (pathModifier.gold || 0) + (classModifier.gold || 0) + (subraceModifier.gold || 0),
        silver: (baseCurrency.silver || 0) + (pathModifier.silver || 0) + (classModifier.silver || 0) + (subraceModifier.silver || 0),
        copper: (baseCurrency.copper || 0) + (pathModifier.copper || 0) + (classModifier.copper || 0) + (subraceModifier.copper || 0)
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

