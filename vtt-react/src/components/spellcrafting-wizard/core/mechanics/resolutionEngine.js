/**
 * Unified Resolution Engine
 * Consolidates all resolution mechanics (dice, cards, coins, combo points)
 * into a single cohesive system with standardized interfaces
 */

// Import element data for formula generation
import { getDamageTypeById } from '../data/damageTypes';

// Basic resolution types
export const RESOLUTION_TYPES = {
  DICE: 'dice',
  CARD: 'card',
  COIN: 'coin',
  COMBO: 'combo'
};

// Resolution type display names
export const RESOLUTION_NAMES = {
  [RESOLUTION_TYPES.DICE]: 'Dice Roll',
  [RESOLUTION_TYPES.CARD]: 'Card Draw',
  [RESOLUTION_TYPES.COIN]: 'Coin Flip',
  [RESOLUTION_TYPES.COMBO]: 'Combo Points'
};

// Resolution type descriptions
export const RESOLUTION_DESCRIPTIONS = {
  [RESOLUTION_TYPES.DICE]: 'Traditional dice-based resolution using dice notation like 2d6+4',
  [RESOLUTION_TYPES.CARD]: 'Resolution based on drawing cards from a deck',
  [RESOLUTION_TYPES.COIN]: 'Resolution based on coin flips and probability',
  [RESOLUTION_TYPES.COMBO]: 'Resolution based on accumulating and spending combo points'
};

// Resolution icons (for WoW-style UI)
export const RESOLUTION_ICONS = {
  [RESOLUTION_TYPES.DICE]: 'inv_misc_dice_02',
  [RESOLUTION_TYPES.CARD]: 'inv_misc_ticket_tarot_deck_01',
  [RESOLUTION_TYPES.COIN]: 'inv_misc_coin_16',
  [RESOLUTION_TYPES.COMBO]: 'ability_rogue_quickrecovery'
};

// Unified variable registry for all resolution types
export const RESOLUTION_VARIABLES = {
  // Common variables available in all resolution types
  COMMON: [
    { name: 'INT', description: 'Intelligence stat' },
    { name: 'SPR', description: 'Spirit stat' },
    { name: 'STR', description: 'Strength stat' },
    { name: 'AGI', description: 'Agility stat' },
    { name: 'CON', description: 'Constitution stat' },
    { name: 'LEVEL', description: 'Character level' },
    { name: 'ROUND', description: 'Current round number (for DoTs)' },
    { name: 'ROUNDS_LEFT', description: 'Rounds remaining in effect' }
  ],
  
  // Dice-specific variables
  [RESOLUTION_TYPES.DICE]: [
    { name: 'ROLL_TOTAL', description: 'Total value of dice roll' },
    { name: 'DICE_COUNT', description: 'Number of dice rolled' },
    { name: 'MAX_POSSIBLE', description: 'Maximum possible roll value' },
    { name: 'MIN_POSSIBLE', description: 'Minimum possible roll value' },
    { name: 'CRITICAL', description: '1 if roll is a critical, 0 otherwise' }
  ],
  
  // Card-specific variables
  [RESOLUTION_TYPES.CARD]: [
    { name: 'CARD_VALUE', description: 'Numerical value of card (1-13)' },
    { name: 'CARD_COUNT', description: 'Number of cards drawn' },
    { name: 'FACE_CARD_COUNT', description: 'Number of face cards drawn' },
    { name: 'SAME_SUIT_COUNT', description: 'Number of cards of the same suit' },
    { name: 'PAIR_COUNT', description: 'Number of pairs in the hand' },
    { name: 'THREE_KIND_COUNT', description: 'Number of three-of-a-kinds' },
    { name: 'FLUSH_COUNT', description: '1 if hand has a flush, 0 otherwise' }
  ],
  
  // Coin-specific variables
  [RESOLUTION_TYPES.COIN]: [
    { name: 'HEADS_COUNT', description: 'Number of heads flipped' },
    { name: 'TAILS_COUNT', description: 'Number of tails flipped' },
    { name: 'TOTAL_FLIPS', description: 'Total number of coins flipped' },
    { name: 'HEADS_RATIO', description: 'Ratio of heads to total flips (0-1)' },
    { name: 'ALL_HEADS', description: '1 if all flips are heads, 0 otherwise' },
    { name: 'ALL_TAILS', description: '1 if all flips are tails, 0 otherwise' }
  ],
  
  // Combo-specific variables
  [RESOLUTION_TYPES.COMBO]: [
    { name: 'COMBO_POINTS', description: 'Current number of combo points' },
    { name: 'MAX_COMBO', description: '1 if at maximum combo points, 0 otherwise' },
    { name: 'COMBO_MULTIPLIER', description: 'Damage multiplier based on combo points' },
    { name: 'COMBO_STREAK', description: 'Number of consecutive successful combos' }
  ]
};

/**
 * Get all available variables for a resolution type
 * @param {string} resolutionType - Type of resolution
 * @returns {Array} - Array of variable objects with name and description
 */
export const getVariablesForResolutionType = (resolutionType) => {
  if (!resolutionType || !RESOLUTION_TYPES[resolutionType]) {
    return RESOLUTION_VARIABLES.COMMON;
  }
  
  return [
    ...RESOLUTION_VARIABLES.COMMON,
    ...RESOLUTION_VARIABLES[resolutionType]
  ];
};

/**
 * Get default formula for any resolution type
 * @param {string} resolutionType - Type of resolution
 * @param {string} element - Element code for damage (e.g., 'fire', 'frost')
 * @returns {string} - Default formula string
 */
export const getDefaultFormula = (resolutionType, element) => {
  const elementCode = element?.toUpperCase() || 'INT';
  
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return `2d6 + ${elementCode}`;
    case RESOLUTION_TYPES.CARD:
      return `CARD_VALUE + FACE_CARD_COUNT * 3 + ${elementCode}`;
    case RESOLUTION_TYPES.COIN:
      return `HEADS_COUNT * 8 + ${elementCode}`;
    case RESOLUTION_TYPES.COMBO:
      return `COMBO_POINTS * 5 + ${elementCode}`;
    default:
      return `2d6 + ${elementCode}`;
  }
};

/**
 * Get default DoT formula for any resolution type
 * @param {string} resolutionType - Type of resolution
 * @param {string} element - Element code for damage (e.g., 'fire', 'frost')
 * @returns {string} - Default DoT formula string
 */
export const getDefaultDotFormula = (resolutionType, element) => {
  const elementCode = element?.toUpperCase() || 'INT';
  
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return `1d4 + ${elementCode}/2`;
    case RESOLUTION_TYPES.CARD:
      return `CARD_VALUE/2 + FACE_CARD_COUNT * 2 + ${elementCode}/2`;
    case RESOLUTION_TYPES.COIN:
      return `HEADS_COUNT * 3 + ${elementCode}/2`;
    case RESOLUTION_TYPES.COMBO:
      return `COMBO_POINTS * 1.5 + ${elementCode}/2`;
    default:
      return `1d4 + ${elementCode}/2`;
  }
};

/**
 * Generate formula examples for a resolution type
 * @param {string} resolutionType - Type of resolution
 * @param {string} element - Element code
 * @returns {Array} - Array of formula example objects
 */
export const getFormulaExamples = (resolutionType, element) => {
  const elementCode = element?.toUpperCase() || 'INT';
  const examples = [];
  
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      examples.push(
        {
          name: 'Basic Attack',
          formula: `2d6 + ${elementCode}`,
          description: 'Reliable damage with primary element scaling'
        },
        {
          name: 'Power Attack',
          formula: `3d8 + ${elementCode} * 1.5`,
          description: 'High damage, high variance with stronger element scaling'
        },
        {
          name: 'Quick Strike',
          formula: `1d10 + ${elementCode} * 2`,
          description: 'Fast attack with powerful element scaling'
        },
        {
          name: 'Critical Strike',
          formula: `4d6 + ${elementCode}`,
          description: 'Multiple dice for critical hits with element scaling'
        }
      );
      break;
    case RESOLUTION_TYPES.CARD:
      examples.push(
        {
          name: 'Card Strike',
          formula: `CARD_VALUE + ${elementCode}`,
          description: 'Basic damage based on the numerical value of the card'
        },
        {
          name: 'Royal Assault',
          formula: `CARD_VALUE * 2 + FACE_CARD_COUNT * 5 + ${elementCode}`,
          description: 'Double damage with bonus for face cards'
        },
        {
          name: 'Suit Synergy',
          formula: `CARD_VALUE + SAME_SUIT_COUNT * 8 + ${elementCode}`,
          description: 'Bonus damage when drawing cards of the same suit'
        },
        {
          name: 'Combo Strike',
          formula: `CARD_COUNT * 6 + ${elementCode} * (FACE_CARD_COUNT > 0 ? 2 : 1)`,
          description: 'Scales with number of cards, with element boost from face cards'
        },
        {
          name: 'Poker Power',
          formula: `(PAIR_COUNT * 5) + (THREE_KIND_COUNT * 10) + (FLUSH_COUNT * 15) + ${elementCode}`,
          description: 'Damage based on poker hand combinations'
        }
      );
      break;
    case RESOLUTION_TYPES.COIN:
      examples.push(
        {
          name: 'Fortune Strike',
          formula: `HEADS_COUNT * 8 + ${elementCode}`,
          description: 'Damage based on successful coin flips'
        },
        {
          name: 'Risk Reward',
          formula: `HEADS_COUNT * 12 + TAILS_COUNT * 3 + ${elementCode}`,
          description: 'High damage on heads, reduced damage on tails'
        },
        {
          name: 'Gambler\'s Strike',
          formula: `(TOTAL_FLIPS * 3) + (HEADS_COUNT * 5) + ${elementCode}`,
          description: 'Base damage plus bonus for successful flips'
        },
        {
          name: 'All or Nothing',
          formula: `ALL_HEADS ? 25 + ${elementCode} * 2 : HEADS_COUNT * 4 + ${elementCode}`,
          description: 'Massive damage if all coins are heads, otherwise moderate'
        }
      );
      break;
    case RESOLUTION_TYPES.COMBO:
      examples.push(
        {
          name: 'Combo Strike',
          formula: `COMBO_POINTS * 5 + ${elementCode}`,
          description: 'Damage scales with combo points'
        },
        {
          name: 'Finishing Move',
          formula: `COMBO_POINTS * 8 + ${elementCode} * (COMBO_POINTS > 3 ? 2 : 1)`,
          description: 'Powerful finisher that scales with combo points'
        },
        {
          name: 'Full Combo',
          formula: `MAX_COMBO ? 25 + ${elementCode} * 2 : COMBO_POINTS * 4 + ${elementCode}`,
          description: 'Massive damage at max combo points'
        },
        {
          name: 'Progressive Strike',
          formula: `COMBO_POINTS * (COMBO_POINTS + 2) + ${elementCode}`,
          description: 'Exponentially scaling damage with combo points'
        }
      );
      break;
    default:
      examples.push(
        {
          name: 'Basic Attack',
          formula: `2d6 + ${elementCode}`,
          description: 'Default attack formula'
        }
      );
  }
  
  return examples;
};

/**
 * Generate DoT formula examples for a resolution type
 * @param {string} resolutionType - Type of resolution
 * @param {string} element - Element code
 * @returns {Array} - Array of DoT formula example objects
 */
export const getDotFormulaExamples = (resolutionType, element) => {
  const elementCode = element?.toUpperCase() || 'INT';
  const examples = [];
  
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      examples.push(
        {
          name: 'Burning',
          formula: `1d6 + ${elementCode}/2`,
          description: 'Standard damage over time'
        },
        {
          name: 'Poison',
          formula: `1d4 + ${elementCode}`,
          description: 'Potent DoT with stat scaling'
        },
        {
          name: 'Bleeding',
          formula: `1d3 + ROUND`,
          description: 'Escalating damage over time'
        }
      );
      break;
    case RESOLUTION_TYPES.CARD:
      examples.push(
        {
          name: 'Card Burn',
          formula: `CARD_VALUE / 2 + ${elementCode}/2`,
          description: 'DoT based on card value'
        },
        {
          name: 'Royal Affliction',
          formula: `FACE_CARD_COUNT * 4 + ${elementCode}/2`,
          description: 'Powerful DoT scaling with face cards drawn'
        },
        {
          name: 'Suit Damage',
          formula: `SAME_SUIT_COUNT * 5 + ROUND`,
          description: 'Escalating DoT that scales with matching suits'
        },
        {
          name: 'Cascading Damage',
          formula: `(CARD_COUNT * 2) + (ROUND * CARD_VALUE/4)`,
          description: 'DoT that becomes stronger over time'
        }
      );
      break;
    case RESOLUTION_TYPES.COIN:
      examples.push(
        {
          name: 'Lucky Burn',
          formula: `HEADS_COUNT * 3 + ${elementCode}/2`,
          description: 'DoT based on lucky coin flips'
        },
        {
          name: 'Gambling Poison',
          formula: `(HEADS_COUNT > TAILS_COUNT) ? 8 + ${elementCode} : 3 + ${elementCode}/2`,
          description: 'Strong DoT if more heads than tails'
        },
        {
          name: 'Probability Wave',
          formula: `HEADS_COUNT * 2 + ROUND * (HEADS_RATIO > 0.5 ? 2 : 1)`,
          description: 'DoT that scales with time and success rate'
        }
      );
      break;
    case RESOLUTION_TYPES.COMBO:
      examples.push(
        {
          name: 'Combo Bleed',
          formula: `COMBO_POINTS * 2 + ${elementCode}/2`,
          description: 'DoT based on combo points'
        },
        {
          name: 'Building Pressure',
          formula: `COMBO_POINTS + ROUND * 2`,
          description: 'DoT that increases with time'
        },
        {
          name: 'Deep Wounds',
          formula: `(COMBO_POINTS * (MAX_COMBO ? 3 : 1.5)) + ${elementCode}/2`,
          description: "DoT that's stronger with max combo points"
        }
      );
      break;
    default:
      examples.push(
        {
          name: 'Basic DoT',
          formula: `1d4 + ${elementCode}/2`,
          description: 'Default DoT formula'
        }
      );
  }
  
  return examples;
};

/**
 * Parse dice notation and calculate statistics
 * @param {string} diceNotation - Dice notation (e.g., "2d6+3")
 * @returns {object} - Dice statistics
 */
export const parseDiceNotation = (diceNotation) => {
  if (!diceNotation || typeof diceNotation !== 'string') {
    return null;
  }

  // Basic dice pattern: XdY+Z or XdY-Z
  const dicePattern = /(\d+)d(\d+)(?:([-+])(\d+))?/i;
  const match = diceNotation.match(dicePattern);

  if (!match) {
    return null;
  }

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] && match[4] ? (match[3] === '+' ? 1 : -1) * parseInt(match[4], 10) : 0;

  // Calculate statistics
  const min = count + modifier;
  const max = count * sides + modifier;
  const average = count * (sides + 1) / 2 + modifier;

  return {
    count,
    sides,
    modifier,
    min,
    max,
    average
  };
};

/**
 * Evaluate a formula with variables specific to a resolution type
 * @param {string} formula - Formula to evaluate
 * @param {object} variables - Variables to substitute
 * @returns {number} - Result of formula evaluation
 */
export const evaluateFormula = (formula, variables = {}) => {
  try {
    if (!formula) return 0;
    
    // Handle dice notation (e.g., "2d6+3")
    const diceStats = parseDiceNotation(formula);
    if (diceStats) {
      return diceStats.average;
    }
    
    // Replace variables with their values
    let processedFormula = formula.replace(/\b([A-Z_][A-Z0-9_]*)\b/gi, (match) => {
      return variables[match] !== undefined ? variables[match] : 0;
    });
    
    // Safety check - only allow basic math operations
    if (!/^[0-9\s\+\-\*\/\(\)\.\?\:\>\<\=\&\|]+$/.test(processedFormula)) {
      throw new Error("Invalid characters in formula");
    }
    
    // Use Function constructor for evaluation (safer than eval)
    // Note: This is still not completely safe for untrusted input
    return Function(`"use strict"; return (${processedFormula})`)();
  } catch (error) {
    console.error("Error evaluating formula:", error);
    return 0;
  }
};

/**
 * Get available resolution types for an effect type
 * @param {string} effectType - Type of effect (damage, healing, etc.)
 * @returns {Array} - Available resolution types
 */
export const getAvailableResolutionTypes = (effectType) => {
  // For testing purposes, return all types
  return Object.values(RESOLUTION_TYPES);
  
  /* When going to production, uncomment this for proper filtering:
  if (!effectType) {
    return Object.values(RESOLUTION_TYPES);
  }
  
  switch (effectType) {
    case 'damage':
      return [RESOLUTION_TYPES.DICE, RESOLUTION_TYPES.CARD, RESOLUTION_TYPES.COMBO];
    case 'healing':
      return [RESOLUTION_TYPES.DICE, RESOLUTION_TYPES.CARD];
    case 'buff':
    case 'debuff':
      return [RESOLUTION_TYPES.DICE, RESOLUTION_TYPES.CARD, RESOLUTION_TYPES.COIN];
    case 'utility':
      return [RESOLUTION_TYPES.DICE, RESOLUTION_TYPES.COIN];
    case 'control':
    case 'summoning':
    case 'transformation':
      return Object.values(RESOLUTION_TYPES);
    default:
      return Object.values(RESOLUTION_TYPES);
  }
  */
};

export default {
  RESOLUTION_TYPES,
  RESOLUTION_NAMES,
  RESOLUTION_DESCRIPTIONS,
  RESOLUTION_ICONS,
  RESOLUTION_VARIABLES,
  getVariablesForResolutionType,
  getDefaultFormula,
  getDefaultDotFormula,
  getFormulaExamples,
  getDotFormulaExamples,
  parseDiceNotation,
  evaluateFormula,
  getAvailableResolutionTypes
};
