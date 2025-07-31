/**
 * Resolution Mechanics - Central import point for all resolution systems
 * This file consolidates exports from the individual resolution system files
 */

// Import from dice system
import {
  parseDiceNotation,
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  getDiceVisualizationData,
  DICE_TYPES,
  MATH_FUNCTIONS
} from './diceSystem';

// Import from card system
import {
  CARD_SUITS,
  TAROT_SUITS,
  TAROT_MAJOR_ARCANA,
  createDeck,
  drawCards,
  calculateSpellDamage,
  interpretTarotCard
} from './cardSystem';

// Import from coin system
import {
  flipCoin,
  flipMultipleCoins,
  COIN_SIDES,
  interpretCoinResult
} from './coinSystem';

// Import from combo system
import {
  COMBO_POINT_TYPES,
  generateComboPoints,
  calculateComboDamage,
  getComboEffectiveness
} from './comboSystem';

// Resolution Types constants
export const RESOLUTION_TYPES = {
  DICE: 'DICE',
  CARDS: 'CARDS',
  COINS: 'COINS',
  CARD: 'card',
  COIN: 'coin',
  COMBO: 'combo'
};

// Card patterns for rollable tables
export const CARD_PATTERNS = {
  ANY: 'ANY',
  PAIR: 'PAIR',
  TWO_PAIR: 'TWO_PAIR',
  THREE_KIND: 'THREE_KIND',
  STRAIGHT: 'STRAIGHT',
  FLUSH: 'FLUSH',
  FULL_HOUSE: 'FULL_HOUSE',
  FOUR_KIND: 'FOUR_KIND',
  STRAIGHT_FLUSH: 'STRAIGHT_FLUSH',
  ROYAL_FLUSH: 'ROYAL_FLUSH',
  ALL_RED: 'ALL_RED',
  ALL_BLACK: 'ALL_BLACK',
  ALL_FACE: 'ALL_FACE'
};

// Coin patterns for rollable tables
export const COIN_PATTERNS = {
  ANY: 'ANY',
  ALL_HEADS: 'ALL_HEADS',
  ALL_TAILS: 'ALL_TAILS',
  MAJORITY_HEADS: 'MAJORITY_HEADS',
  MAJORITY_TAILS: 'MAJORITY_TAILS',
  EQUAL_SPLIT: 'EQUAL_SPLIT',
  ALTERNATING: 'ALTERNATING'
};

// Dice presets for different effects
export const DICE_PRESETS = {
  // Damage
  MINOR_DAMAGE: '1d6',
  MODERATE_DAMAGE: '2d6',
  MAJOR_DAMAGE: '3d6+2',

  // Healing
  MINOR_HEALING: '1d4+1',
  MODERATE_HEALING: '2d4+2',
  MAJOR_HEALING: '3d4+3',

  // Utility
  WEAK_EFFECT: '1d4',
  STANDARD_EFFECT: '1d6',
  STRONG_EFFECT: '1d8'
};

/**
 * Returns appropriate dice notation for a given effect
 * @param {string} effectType - Type of effect
 * @param {object} options - Configuration options
 * @returns {string} - Dice notation
 */
export const getDiceForEffect = (effectType, options = {}) => {
  const { power = 'moderate' } = options;

  switch (effectType) {
    case 'damage':
      return power === 'minor' ? DICE_PRESETS.MINOR_DAMAGE :
             power === 'major' ? DICE_PRESETS.MAJOR_DAMAGE :
             DICE_PRESETS.MODERATE_DAMAGE;

    case 'healing':
      return power === 'minor' ? DICE_PRESETS.MINOR_HEALING :
             power === 'major' ? DICE_PRESETS.MAJOR_HEALING :
             DICE_PRESETS.MODERATE_HEALING;

    default:
      return power === 'minor' ? DICE_PRESETS.WEAK_EFFECT :
             power === 'major' ? DICE_PRESETS.STRONG_EFFECT :
             DICE_PRESETS.STANDARD_EFFECT;
  }
};

/**
 * Scales dice based on spell level
 * @param {string} baseDice - Base dice notation
 * @param {number} level - Spell level
 * @returns {string} - Scaled dice notation
 */
export const getScaledDice = (baseDice, level) => {
  if (!baseDice || level <= 1) return baseDice;

  // Simple scaling mechanism - add dice or modifiers based on level
  const scalingFactor = Math.floor((level - 1) / 2);

  if (baseDice.includes('d')) {
    const [count, rest] = baseDice.split('d');
    let newCount = parseInt(count) + scalingFactor;
    return `${newCount}d${rest}`;
  }

  return baseDice;
};

/**
 * Gets a description of dice for an effect
 * @param {string} diceNotation - Dice notation
 * @returns {string} - Description
 */
export const getEffectDiceDescription = (diceNotation) => {
  if (!diceNotation) return 'No effect';

  const min = getMinRoll(diceNotation);
  const max = getMaxRoll(diceNotation);
  const avg = getAverageRoll(diceNotation);

  return `${diceNotation} (Min: ${min}, Max: ${max}, Avg: ${avg.toFixed(1)})`;
};

/**
 * Returns available resolution mechanics for a given effect type
 * @param {string} effectType - Type of effect
 * @returns {Array} - Array of resolution type ids
 */
export const getAvailableResolutionsForEffectType = (effectType) => {
  // Default to all resolution types
  if (!effectType) return Object.values(RESOLUTION_TYPES);

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
      return [RESOLUTION_TYPES.DICE, RESOLUTION_TYPES.CARD, RESOLUTION_TYPES.COIN, RESOLUTION_TYPES.COMBO];
    default:
      return Object.values(RESOLUTION_TYPES);
  }
};

/**
 * Returns the component name for a given resolution type
 * @param {string} resolutionType - Resolution type id
 * @returns {string} - Component name
 */
export const getResolutionConfigComponent = (resolutionType) => {
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return 'DiceCalculator';
    case RESOLUTION_TYPES.CARD:
      return 'CardSelector';
    case RESOLUTION_TYPES.COIN:
      return 'CoinFlipConfig';
    case RESOLUTION_TYPES.COMBO:
      return 'ComboPointConfig';
    default:
      return null;
  }
};

/**
 * Returns the display name for a resolution type
 * @param {string} resolutionType - Resolution type id
 * @returns {string} - Display name
 */
export const getResolutionTypeName = (resolutionType) => {
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return 'Dice Roll';
    case RESOLUTION_TYPES.CARD:
      return 'Card Draw';
    case RESOLUTION_TYPES.COIN:
      return 'Coin Flip';
    case RESOLUTION_TYPES.COMBO:
      return 'Combo Points';
    default:
      return 'Unknown Resolution';
  }
};

/**
 * Returns the description for a resolution type
 * @param {string} resolutionType - Resolution type id
 * @returns {string} - Description
 */
export const getResolutionTypeDescription = (resolutionType) => {
  switch (resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return 'Resolve effects using dice rolls with various combinations';
    case RESOLUTION_TYPES.CARD:
      return 'Draw cards to determine effect outcomes';
    case RESOLUTION_TYPES.COIN:
      return 'Flip coins for binary or probabilistic outcomes';
    case RESOLUTION_TYPES.COMBO:
      return 'Build up combo points for enhanced effects';
    default:
      return '';
  }
};

// Re-export all imported functions
export {
  // Dice system
  parseDiceNotation,
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  getDiceVisualizationData,
  DICE_TYPES,
  MATH_FUNCTIONS,

  // Card system
  CARD_SUITS,
  TAROT_SUITS,
  TAROT_MAJOR_ARCANA,
  createDeck,
  drawCards,
  calculateSpellDamage,
  interpretTarotCard,

  // Coin system
  flipCoin,
  flipMultipleCoins,
  COIN_SIDES,
  interpretCoinResult,

  // Combo system
  COMBO_POINT_TYPES,
  generateComboPoints,
  calculateComboDamage,
  getComboEffectiveness,

  // Rollable Table functions will be defined below
};

// Resolve a dice roll for rollable tables
export function resolveDiceRoll(diceType, entries) {
  // Simulate a dice roll
  const max = diceType === 'd100' ? 100 : parseInt(diceType.substring(1));
  const roll = Math.floor(Math.random() * max) + 1;

  // Find the matching entry
  const matchingEntry = entries.find(entry =>
    roll >= entry.range.min && roll <= entry.range.max
  );

  return {
    roll,
    entry: matchingEntry || null
  };
}

// Resolve a card draw for rollable tables
export function resolveCardDraw(cardCount, entries) {
  // Simulate drawing cards
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  // Create a deck
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Draw cards
  const drawnCards = deck.slice(0, cardCount);

  // Determine the pattern
  const pattern = determineCardPattern(drawnCards);

  // Find the matching entry
  const matchingEntry = entries.find(entry => entry.cardPattern === pattern);

  return {
    cards: drawnCards,
    pattern,
    entry: matchingEntry || null
  };
}

// Determine the pattern of drawn cards
function determineCardPattern(cards) {
  // This is a simplified implementation
  // In a real implementation, you would check for pairs, straights, flushes, etc.

  // Check if all cards are red
  const allRed = cards.every(card => card.suit === 'hearts' || card.suit === 'diamonds');
  if (allRed) return CARD_PATTERNS.ALL_RED;

  // Check if all cards are black
  const allBlack = cards.every(card => card.suit === 'clubs' || card.suit === 'spades');
  if (allBlack) return CARD_PATTERNS.ALL_BLACK;

  // Check if all cards are face cards
  const allFace = cards.every(card => ['J', 'Q', 'K'].includes(card.value));
  if (allFace) return CARD_PATTERNS.ALL_FACE;

  // Check for flush (all same suit)
  const firstSuit = cards[0].suit;
  const isFlush = cards.every(card => card.suit === firstSuit);
  if (isFlush) return CARD_PATTERNS.FLUSH;

  // Count occurrences of each value
  const valueCounts = {};
  for (const card of cards) {
    valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
  }

  // Check for four of a kind
  if (Object.values(valueCounts).includes(4)) return CARD_PATTERNS.FOUR_KIND;

  // Check for full house (three of a kind and a pair)
  if (Object.values(valueCounts).includes(3) && Object.values(valueCounts).includes(2)) {
    return CARD_PATTERNS.FULL_HOUSE;
  }

  // Check for three of a kind
  if (Object.values(valueCounts).includes(3)) return CARD_PATTERNS.THREE_KIND;

  // Check for two pair
  if (Object.values(valueCounts).filter(count => count === 2).length === 2) {
    return CARD_PATTERNS.TWO_PAIR;
  }

  // Check for pair
  if (Object.values(valueCounts).includes(2)) return CARD_PATTERNS.PAIR;

  // Default to ANY
  return CARD_PATTERNS.ANY;
}

// Resolve a coin flip for rollable tables
export function resolveCoinFlip(coinCount, entries) {
  // Simulate flipping coins
  const flips = Array.from({ length: coinCount }, () => Math.random() < 0.5 ? 'heads' : 'tails');

  // Count heads and tails
  const headsCount = flips.filter(flip => flip === 'heads').length;
  const tailsCount = flips.filter(flip => flip === 'tails').length;

  // Determine the pattern
  let pattern;

  if (headsCount === coinCount) {
    pattern = COIN_PATTERNS.ALL_HEADS;
  } else if (tailsCount === coinCount) {
    pattern = COIN_PATTERNS.ALL_TAILS;
  } else if (headsCount > tailsCount) {
    pattern = COIN_PATTERNS.MAJORITY_HEADS;
  } else if (tailsCount > headsCount) {
    pattern = COIN_PATTERNS.MAJORITY_TAILS;
  } else if (headsCount === tailsCount) {
    pattern = COIN_PATTERNS.EQUAL_SPLIT;
  } else {
    pattern = COIN_PATTERNS.ANY;
  }

  // Check for alternating pattern
  let isAlternating = true;
  for (let i = 1; i < flips.length; i++) {
    if (flips[i] === flips[i - 1]) {
      isAlternating = false;
      break;
    }
  }

  if (isAlternating && flips.length > 1) {
    pattern = COIN_PATTERNS.ALTERNATING;
  }

  // Find the matching entry
  const matchingEntry = entries.find(entry => entry.coinPattern === pattern);

  return {
    flips,
    pattern,
    entry: matchingEntry || null
  };
}

// Resolve a rollable table based on its resolution type
export function resolveRollableTable(table) {
  if (!table || !table.entries || table.entries.length === 0) {
    return { error: 'Invalid table or no entries' };
  }

  switch (table.resolutionType) {
    case RESOLUTION_TYPES.DICE:
      return resolveDiceRoll(table.resolutionConfig.diceType, table.entries);

    case RESOLUTION_TYPES.CARDS:
      return resolveCardDraw(table.resolutionConfig.cardCount, table.entries);

    case RESOLUTION_TYPES.COINS:
      return resolveCoinFlip(table.resolutionConfig.coinCount, table.entries);

    default:
      return { error: 'Invalid resolution type' };
  }
}
