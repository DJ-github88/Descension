/**
 * Resolution System
 *
 * Provides comprehensive support for various resolution mechanics:
 * - Dice-based resolution (D&D, Pathfinder)
 * - Card-based resolution (custom)
 * - Coin-based resolution (custom)
 * - Fixed value resolution (WoW)
 */

// Resolution types
export const RESOLUTION_TYPES = {
  DICE: {
    id: 'DICE',
    name: 'Dice',
    description: 'Resolve effects using dice rolls',
    supportsCritical: true,
    supportsAdvantage: true,
    defaultFormula: '1d6',
    defaultCritThreshold: 20,
    defaultCritMultiplier: 2
  },
  CARDS: {
    id: 'CARDS',
    name: 'Cards',
    description: 'Resolve effects using card draws',
    supportsCritical: true,
    supportsAdvantage: false,
    defaultDrawCount: 3,
    defaultCritRule: 'face_cards'
  },
  COINS: {
    id: 'COINS',
    name: 'Coins',
    description: 'Resolve effects using coin flips',
    supportsCritical: true,
    supportsAdvantage: false,
    defaultFlipCount: 5,
    defaultCritRule: 'all_heads'
  },
  FIXED: {
    id: 'FIXED',
    name: 'Fixed Value',
    description: 'Resolve effects using fixed values with attribute scaling',
    supportsCritical: true,
    supportsAdvantage: false,
    defaultValue: 10,
    defaultScaling: 'linear'
  }
};

// Critical hit systems
export const CRITICAL_HIT_SYSTEMS = {
  // Dice-based critical hit system
  DICE: {
    id: 'dice_critical',
    name: 'Dice Critical Hits',
    description: 'Roll all damage dice twice and add them together',
    mechanics: {
      trigger: 'natural_20',
      effect: 'double_dice',
      additionalDice: false,
      multiplier: false,
      confirmationRoll: false,
      threatRange: {
        default: 20,
        expandable: true,
        maxExpansion: 18 // Down to 18-20
      }
    }
  },

  // Percentage-based critical hit system
  PERCENTAGE: {
    id: 'percentage_critical',
    name: 'Percentage Critical Hits',
    description: 'Chance-based critical hits that multiply damage',
    mechanics: {
      trigger: 'percentage_chance',
      effect: 'multiplier',
      additionalDice: false,
      multiplier: true,
      confirmationRoll: false,
      defaultChance: 5, // 5% base chance
      defaultMultiplier: 2
    }
  },

  // Card-based critical hit system
  CARDS: {
    id: 'card_critical',
    name: 'Card Critical Hits',
    description: 'Drawing face cards (J, Q, K) or Aces triggers critical hits',
    mechanics: {
      trigger: 'face_cards',
      effect: 'multiplier',
      additionalDice: false,
      multiplier: true,
      confirmationRoll: false,
      defaultMultiplier: 2
    }
  },

  // Coin-based critical hit system
  COINS: {
    id: 'coin_critical',
    name: 'Coin Critical Hits',
    description: 'Flipping all heads triggers a critical hit',
    mechanics: {
      trigger: 'all_heads',
      effect: 'multiplier',
      additionalDice: false,
      multiplier: true,
      confirmationRoll: false,
      defaultMultiplier: 2
    }
  },

  // Custom critical hit systems
  CUSTOM: {
    BRUTAL: {
      id: 'custom_brutal_critical',
      name: 'Brutal Critical',
      description: 'Add extra dice on critical hits',
      mechanics: {
        trigger: 'natural_20',
        effect: 'additional_dice',
        additionalDice: true,
        multiplier: false,
        confirmationRoll: false,
        threatRange: {
          default: 20,
          expandable: true,
          maxExpansion: 19 // Down to 19-20
        },
        defaultExtraDice: '1d6'
      }
    },
    PRECISION: {
      id: 'custom_precision_critical',
      name: 'Precision Critical',
      description: 'Add fixed bonus damage on critical hits',
      mechanics: {
        trigger: 'natural_20',
        effect: 'bonus_damage',
        additionalDice: false,
        multiplier: false,
        bonusDamage: true,
        confirmationRoll: false,
        threatRange: {
          default: 20,
          expandable: false
        },
        defaultBonus: 10
      }
    }
  }
};

/**
 * Get a resolution system by ID
 * @param {string} systemId - The ID of the system to retrieve
 * @returns {Object} The resolution system configuration
 */
export function getResolutionSystem(systemId) {
  return RESOLUTION_TYPES[systemId] || RESOLUTION_TYPES.DICE;
}

/**
 * Get a critical hit system by ID
 * @param {string} systemId - The ID of the system to retrieve
 * @returns {Object} The critical hit system configuration
 */
export function getCriticalHitSystem(systemId) {
  // Check main systems
  for (const gameSystem in CRITICAL_HIT_SYSTEMS) {
    if (CRITICAL_HIT_SYSTEMS[gameSystem].id === systemId) {
      return CRITICAL_HIT_SYSTEMS[gameSystem];
    }

    // Check nested systems
    if (typeof CRITICAL_HIT_SYSTEMS[gameSystem] === 'object') {
      for (const nestedSystem in CRITICAL_HIT_SYSTEMS[gameSystem]) {
        if (CRITICAL_HIT_SYSTEMS[gameSystem][nestedSystem]?.id === systemId) {
          return CRITICAL_HIT_SYSTEMS[gameSystem][nestedSystem];
        }
      }
    }
  }

  // Return default if not found
  return CRITICAL_HIT_SYSTEMS.DICE;
}

/**
 * Generate a default formula for a resolution type
 * @param {string} resolutionType - The type of resolution (DICE, CARDS, COINS, FIXED)
 * @param {Object} options - Additional options for formula generation
 * @returns {string} The generated formula
 */
export function generateDefaultFormula(resolutionType, options = {}) {
  const {
    spellLevel = 1,
    casterLevel = 1,
    primaryAttribute = 'INT',
    damageType = 'fire',
    isAoe = false,
    isSingleTarget = true,
    isDot = false
  } = options;

  switch (resolutionType) {
    case 'DICE':
      // Dice-based formulas
      if (isDot) {
        return `${spellLevel}d4 + ${primaryAttribute} per round`;
      } else if (isAoe) {
        return `${spellLevel}d6 + ${primaryAttribute}`;
      } else if (isSingleTarget) {
        return `${spellLevel}d8 + ${primaryAttribute}`;
      } else {
        return `${spellLevel}d6 + ${primaryAttribute}`;
      }

    case 'CARDS':
      // Card-based formulas
      return `CARD_VALUE + (FACE_CARDS * 5) + ${primaryAttribute}`;

    case 'COINS':
      // Coin-based formulas
      return `HEADS_COUNT * 5 + ${primaryAttribute}`;

    case 'FIXED':
      // Fixed-value formulas
      const baseDamage = 10 + (spellLevel * 5);
      const coefficient = 0.5 + (spellLevel * 0.1);
      return `${baseDamage} + (${coefficient} * ${primaryAttribute})`;

    default:
      return RESOLUTION_TYPES.DICE.defaultFormula;
  }
}

/**
 * Generate a critical hit configuration for a resolution type
 * @param {string} resolutionType - The type of resolution (DICE, CARDS, COINS, FIXED)
 * @returns {Object} The critical hit configuration
 */
export function generateCriticalConfig(resolutionType) {
  const baseConfig = {
    enabled: false,
    critType: resolutionType.toLowerCase()
  };

  switch (resolutionType) {
    case 'DICE':
      return {
        ...baseConfig,
        critThreshold: 20,
        critRange: 1,
        critMultiplier: 2,
        critDiceOnly: true,
        extraDice: ''
      };

    case 'PERCENTAGE':
      return {
        ...baseConfig,
        critChance: 5, // 5% base chance
        critMultiplier: 2,
        critDiceOnly: false
      };

    case 'CARDS':
      return {
        ...baseConfig,
        critCards: ['J', 'Q', 'K', 'A'],
        critMultiplier: 2
      };

    case 'COINS':
      return {
        ...baseConfig,
        critRule: 'all_heads',
        critMultiplier: 2
      };

    default:
      return {
        ...baseConfig,
        critThreshold: 20,
        critRange: 1,
        critMultiplier: 2
      };
  }
}

/**
 * Calculate damage based on a formula and resolution type
 * @param {string} formula - The damage formula
 * @param {string} resolutionType - The resolution type
 * @param {Object} options - Additional options for damage calculation
 * @returns {Object} The calculated damage result
 */
export function calculateDamage(formula, resolutionType, options = {}) {
  const {
    attributeValues = {},
    isCritical = false,
    criticalConfig = {},
    advantageType = 'none' // 'none', 'advantage', 'disadvantage'
  } = options;

  const result = {
    total: 0,
    rolls: [],
    formula: formula,
    isCritical: isCritical,
    resolutionType: resolutionType
  };

  switch (resolutionType) {
    case 'DICE':
      // Import the dice system for more advanced dice handling
      const { rollDice } = require('./diceSystem');

      // Use the dice system to handle the roll with all critical hit options
      const diceRollOptions = {
        mode: isCritical && criticalConfig.enabled ? 'critical' : 'normal',
        criticalThreshold: criticalConfig.critThreshold || 20,
        criticalMultiplier: criticalConfig.critMultiplier || 2,
        explodingDice: criticalConfig.explodingDice || false,
        explodingDiceType: criticalConfig.explodingDiceType || 'reroll_add',
        critDiceOnly: criticalConfig.critDiceOnly || false,
        extraDice: criticalConfig.extraDice || ''
      };

      // Roll the dice using the dice system
      const diceRoll = rollDice(formula, diceRollOptions);

      // Extract the results
      result.total = diceRoll.total;
      result.rolls = diceRoll.rolls;
      result.details = diceRoll.details;

      // Add attribute modifiers if they weren't already included in the formula
      const attrRegex = /\b([A-Z]{3,4})\b/g;
      let attrMatches = [...formula.matchAll(attrRegex)];

      let attrTotal = 0;
      for (const match of attrMatches) {
        const [_, attr] = match;
        if (attributeValues[attr]) {
          attrTotal += attributeValues[attr];
        }
      }

      // Add attribute total if there were any attributes
      if (attrTotal > 0) {
        result.total += attrTotal;
        result.attributeTotal = attrTotal;
      }
      break;

    case 'CARDS':
      // Parse card formula (e.g., "CARD_VALUE + (FACE_CARDS * 5) + INT")
      const cardCount = options.cardCount || 3;
      const cards = [];
      let cardTotal = 0;
      let faceCardCount = 0;

      // Draw cards
      const deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const faceCards = ['J', 'Q', 'K', 'A'];

      for (let i = 0; i < cardCount; i++) {
        const cardIndex = Math.floor(Math.random() * deck.length);
        const card = deck[cardIndex];
        cards.push(card);

        // Calculate card value
        let cardValue = 0;
        if (card === 'A') {
          cardValue = 11;
        } else if (card === 'K' || card === 'Q' || card === 'J') {
          cardValue = 10;
          faceCardCount++;
        } else {
          cardValue = parseInt(card);
        }

        cardTotal += cardValue;
      }

      // Add attribute modifiers
      let cardAttrTotal = 0;
      const cardAttrRegex = /\b([A-Z]{3,4})\b/g;
      let cardAttrMatches = [...formula.matchAll(cardAttrRegex)];

      for (const match of cardAttrMatches) {
        const [_, attr] = match;
        if (attributeValues[attr]) {
          cardAttrTotal += attributeValues[attr];
        }
      }

      // Calculate total
      result.total = cardTotal + (faceCardCount * 5) + cardAttrTotal;
      result.cards = cards;
      result.faceCardCount = faceCardCount;

      // Check for critical hit
      if (criticalConfig.enabled) {
        let isCritical = false;

        // Check based on critical rule
        if (criticalConfig.cardCritRule === 'face_cards') {
          isCritical = faceCardCount > 0;
        } else if (criticalConfig.cardCritRule === 'aces') {
          isCritical = cards.some(card => card === 'A');
        } else if (criticalConfig.cardCritRule === 'specific_suit') {
          const suitCards = cards.filter(card => card.endsWith(criticalConfig.critSuit));
          isCritical = suitCards.length > 0;
        } else if (criticalConfig.cardCritRule === 'red_cards') {
          const redCards = cards.filter(card => card.endsWith('hearts') || card.endsWith('diamonds'));
          isCritical = redCards.length > 0;
        } else if (criticalConfig.cardCritRule === 'black_cards') {
          const blackCards = cards.filter(card => card.endsWith('clubs') || card.endsWith('spades'));
          isCritical = blackCards.length > 0;
        } else if (criticalConfig.cardCritRule === 'pairs') {
          // Check for pairs
          const cardValues = cards.map(card => card.split('-')[0]);
          const valueCounts = {};
          cardValues.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
          });
          isCritical = Object.values(valueCounts).some(count => count >= 2);
        }

        if (isCritical) {
          result.isCritical = true;

          // Apply critical hit resolution based on configuration
          if (criticalConfig.cardCritResolution === 'draw_add') {
            // Draw additional cards and add their values
            const extraDrawCount = criticalConfig.extraCardDraw || 2;
            const extraCards = [];
            let extraCardTotal = 0;

            for (let i = 0; i < extraDrawCount; i++) {
              const card = `${Math.floor(Math.random() * 13) + 1}`;
              extraCards.push(card);

              let cardValue = 0;
              if (card === 'A') {
                cardValue = 11;
              } else if (card === 'K' || card === 'Q' || card === 'J') {
                cardValue = 10;
              } else {
                cardValue = parseInt(card);
              }

              extraCardTotal += cardValue;
            }

            result.extraCards = extraCards;
            result.extraCardTotal = extraCardTotal;
            result.total += extraCardTotal;
          }
          else if (criticalConfig.cardCritResolution === 'multiply_value') {
            // Multiply the card values by the critical multiplier
            const multiplier = criticalConfig.critMultiplier || 2;
            result.total = Math.floor(result.total * multiplier);
          }
          else if (criticalConfig.cardCritResolution === 'double_damage') {
            // Double the final damage
            result.total = result.total * 2;
          }
        }
      }
      break;

    case 'COINS':
      // Parse coin formula (e.g., "HEADS_COUNT * 5 + INT")
      const coinCount = options.coinCount || 5;
      const coins = [];
      let headsCount = 0;

      // Flip coins
      for (let i = 0; i < coinCount; i++) {
        const isHeads = Math.random() < 0.5;
        coins.push(isHeads ? 'H' : 'T');
        if (isHeads) {
          headsCount++;
        }
      }

      // Add attribute modifiers
      let coinAttrTotal = 0;
      const coinAttrRegex = /\b([A-Z]{3,4})\b/g;
      let coinAttrMatches = [...formula.matchAll(coinAttrRegex)];

      for (const match of coinAttrMatches) {
        const [_, attr] = match;
        if (attributeValues[attr]) {
          coinAttrTotal += attributeValues[attr];
        }
      }

      // Calculate total
      result.total = (headsCount * 5) + coinAttrTotal;
      result.coins = coins;
      result.headsCount = headsCount;

      // Check for critical hit
      if (criticalConfig.enabled) {
        let isCritical = false;

        // Check based on critical rule
        if (criticalConfig.coinCritRule === 'all_heads') {
          isCritical = headsCount === coinCount;
        } else if (criticalConfig.coinCritRule === 'all_tails') {
          isCritical = headsCount === 0;
        } else if (criticalConfig.coinCritRule === 'sequence') {
          // Check for alternating sequence (H,T,H,T or T,H,T,H)
          let isAlternating = true;
          for (let i = 1; i < coins.length; i++) {
            if (coins[i] === coins[i-1]) {
              isAlternating = false;
              break;
            }
          }
          isCritical = isAlternating;
        } else if (criticalConfig.coinCritRule === 'majority') {
          // More than half are heads
          isCritical = headsCount > coinCount / 2;
        }

        if (isCritical) {
          result.isCritical = true;

          // Apply critical hit resolution based on configuration
          if (criticalConfig.coinCritResolution === 'flip_add') {
            // Flip additional coins and add their values
            const extraFlipCount = criticalConfig.extraCoinFlips || 3;
            const extraCoins = [];
            let extraHeadsCount = 0;

            for (let i = 0; i < extraFlipCount; i++) {
              const isHeads = Math.random() < 0.5;
              extraCoins.push(isHeads ? 'H' : 'T');
              if (isHeads) {
                extraHeadsCount++;
              }
            }

            result.extraCoins = extraCoins;
            result.extraHeadsCount = extraHeadsCount;
            result.total += extraHeadsCount * 5; // Same value per head as regular flips
          }
          else if (criticalConfig.coinCritResolution === 'multiply_value') {
            // Multiply the coin values by the critical multiplier
            const multiplier = criticalConfig.critMultiplier || 2;
            result.total = Math.floor(result.total * multiplier);
          }
          else if (criticalConfig.coinCritResolution === 'double_damage') {
            // Double the final damage
            result.total = result.total * 2;
          }
        }
      }
      break;

    case 'FIXED':
      // Parse fixed formula (e.g., "10 + (0.5 * INT)")
      let fixedTotal = 0;

      // Extract base damage
      const baseMatch = formula.match(/^(\d+)/);
      if (baseMatch) {
        fixedTotal += parseInt(baseMatch[1]);
      }

      // Extract attribute scaling
      const scaleRegex = /\((\d+(\.\d+)?) \* ([A-Z]{3,4})\)/;
      const scaleMatch = formula.match(scaleRegex);

      if (scaleMatch) {
        const [_, coefficient, __, attr] = scaleMatch;
        if (attributeValues[attr]) {
          fixedTotal += parseFloat(coefficient) * attributeValues[attr];
        }
      }

      // Calculate total
      result.total = Math.floor(fixedTotal);

      // Apply critical hit multiplier
      if (isCritical && criticalConfig.enabled) {
        if (criticalConfig.critMultiplier) {
          result.total = Math.floor(result.total * criticalConfig.critMultiplier);
        }
      }
      break;

    default:
      result.total = 0;
  }

  return result;
}
