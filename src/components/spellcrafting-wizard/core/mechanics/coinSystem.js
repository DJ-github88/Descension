/**
 * Coin System - Implements coin flip mechanics for Gambler and Trickster classes
 * Handles various coin types with different probabilities and special effects
 */

// Define coin types
const COIN_TYPES = {
    STANDARD: {
      id: "standard",
      name: "Standard Coin",
      description: "A balanced coin with equal chance of heads or tails",
      icon: "coin_standard",
      sides: 2,
      weightDistribution: [0.5, 0.5], // Equal probability
      specialEffects: {}
    },
    WEIGHTED: {
      id: "weighted",
      name: "Weighted Coin",
      description: "A coin with customizable probability distribution",
      icon: "coin_weighted",
      sides: 2,
      weightDistribution: [0.7, 0.3], // Default is biased
      specialEffects: {
        "heads": { name: "Favorable Outcome", description: "The coin favors this side" },
        "tails": { name: "Unfavorable Outcome", description: "The coin is biased against this side" }
      }
    },
    MULTI_FACED: {
      id: "multi_faced",
      name: "Multi-faced Coin",
      description: "A special coin with multiple possible outcomes",
      icon: "coin_multi",
      sides: 6, // Like a die
      weightDistribution: [0.16, 0.16, 0.17, 0.17, 0.17, 0.17], // Nearly equal
      specialEffects: {}
    },
    CONDITIONAL: {
      id: "conditional",
      name: "Conditional Coin",
      description: "A coin whose probabilities change based on game state",
      icon: "coin_conditional",
      sides: 2,
      weightDistribution: [0.5, 0.5], // Base distribution, will be modified
      specialEffects: {
        "heads": { name: "Adaptive Favor", description: "Probability shifts based on game conditions" },
        "tails": { name: "Adaptive Disfavor", description: "Probability shifts based on game conditions" }
      }
    },
    LINKED: {
      id: "linked",
      name: "Linked Coins",
      description: "Multiple coins with relationships between their outcomes",
      icon: "coin_linked",
      sides: 2,
      weightDistribution: [0.5, 0.5],
      specialEffects: {
        "all_same": { name: "Synchronized", description: "All coins show the same face" },
        "alternating": { name: "Patterned", description: "Coins show an alternating pattern" }
      }
    }
  };

// Define coin sides
const COIN_SIDES = {
  HEADS: 0,
  TAILS: 1,
  EDGE: 2 // For multi-sided coins
};

// Core coin flip mechanics

/**
 * Performs a single coin flip
 */
function flipCoin(coinType) {
    const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (let i = 0; i < coin.sides; i++) {
      cumulativeProbability += coin.weightDistribution[i];
      if (random < cumulativeProbability) {
        return i; // Return the index of the outcome
      }
    }
    
    return coin.sides - 1; // Fallback to last side
}

/**
 * Interpret the result of a coin flip
 * @param {number} result - The numeric result from flipCoin
 * @param {string} coinType - Type of coin used
 * @returns {object} - Interpretation of the result
 */
function interpretCoinResult(result, coinType = 'STANDARD') {
  const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
  
  // Map numeric result to side name
  let sideName;
  if (result === 0) {
    sideName = 'heads';
  } else if (result === 1) {
    sideName = 'tails';
  } else {
    sideName = `side_${result + 1}`;
  }
  
  // Get special effect if any
  const effect = coin.specialEffects[sideName] || {
    name: `${sideName.charAt(0).toUpperCase() + sideName.slice(1)}`,
    description: `Standard ${sideName} outcome`
  };
  
  return {
    result,
    sideName,
    coinType,
    effect
  };
}

/**
 * Flips multiple coins of the same type
 */
function flipMultipleCoins(coinType, number) {
    const results = [];
    for (let i = 0; i < number; i++) {
      results.push(flipCoin(coinType));
    }
    return results;
}

/**
 * Calculate the probability of a desired outcome
 */
function calculateProbability(desiredOutcome, coinType, number) {
    const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
    
    if (typeof desiredOutcome === 'number') {
      // Probability of getting exactly this outcome on all flips
      return Math.pow(coin.weightDistribution[desiredOutcome], number);
    } else if (Array.isArray(desiredOutcome)) {
      // Probability of getting this specific sequence
      let probability = 1;
      for (let i = 0; i < number; i++) {
        if (i < desiredOutcome.length) {
          probability *= coin.weightDistribution[desiredOutcome[i]];
        }
      }
      return probability;
    }
    
    return 0; // Invalid input
}

/**
 * Apply weighted modifiers to the base weight distribution
 */
function applyWeightedModifiers(baseWeight, modifiers) {
    let result = [...baseWeight]; // Copy the base weights
    
    // Apply each modifier
    modifiers.forEach(modifier => {
      for (let i = 0; i < result.length; i++) {
        result[i] *= modifier[i] || 1; // If no modifier, use 1 (no change)
      }
    });
    
    // Normalize to ensure sum = 1
    const sum = result.reduce((a, b) => a + b, 0);
    return result.map(weight => weight / sum);
}

// Outcome interpretation functions

/**
 * Map flip results to effects
 */
function determineOutcomeEffect(flip, effectMap) {
    return effectMap[flip] || { name: "No Effect", description: "This outcome has no special effect" };
}

/**
 * Apply bonuses for specific patterns in a series of flips
 */
function applyBonusForSeries(flips, patternBonus) {
    let bonus = 0;
    
    // Check for consecutive same outcomes
    let streak = 1;
    for (let i = 1; i < flips.length; i++) {
      if (flips[i] === flips[i-1]) {
        streak++;
      } else {
        if (streak >= 3 && patternBonus.streak) {
          bonus += patternBonus.streak * (streak - 2); // Bonus starts at 3 in a row
        }
        streak = 1;
      }
    }
    
    // Check final streak
    if (streak >= 3 && patternBonus.streak) {
      bonus += patternBonus.streak * (streak - 2);
    }
    
    // Check for alternating pattern (0,1,0,1...)
    let alternating = true;
    for (let i = 2; i < flips.length; i++) {
      if (flips[i] !== flips[i-2]) {
        alternating = false;
        break;
      }
    }
    
    if (alternating && flips.length >= 4 && patternBonus.alternating) {
      bonus += patternBonus.alternating;
    }
    
    return bonus;
}

/**
 * Check for special combinations in a set of flips
 */
function checkForSpecialCombination(flips) {
    const combinations = {
      allSame: flips.every(flip => flip === flips[0]),
      alternating: flips.length >= 2 && flips.every((flip, index) => index % 2 === 0 ? flip === flips[0] : flip === flips[1]),
      majority: (() => {
        const counts = {};
        flips.forEach(flip => {
          counts[flip] = (counts[flip] || 0) + 1;
        });
        const max = Math.max(...Object.values(counts));
        return Object.keys(counts).find(key => counts[key] === max);
      })()
    };
    
    return combinations;
}

// Gambler mechanics

/**
 * Calculate streak bonuses based on previous flips
 */
function luckyStreak(previousFlips) {
    if (!previousFlips || previousFlips.length === 0) {
      return { active: false, bonus: 0 };
    }
    
    const lastOutcome = previousFlips[previousFlips.length - 1];
    let streak = 1;
    
    // Count consecutive same outcomes
    for (let i = previousFlips.length - 2; i >= 0; i--) {
      if (previousFlips[i] === lastOutcome) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      active: streak >= 3,
      bonus: Math.min(0.5, (streak - 1) * 0.1), // 10% per consecutive win, max 50%
      length: streak
    };
}

/**
 * Implement double-or-nothing mechanic
 */
function doubleOrNothing(currentValue, riskLevel) {
    // riskLevel affects chance of success (0.1 to 1.0)
    const successChance = Math.max(0.1, Math.min(0.5, riskLevel));
    const roll = Math.random();
    
    if (roll < successChance) {
      return { success: true, newValue: currentValue * 2 };
    } else {
      return { success: false, newValue: 0 };
    }
}

/**
 * Apply player's luck stat to coin outcomes
 */
function houseFavor(coinType, playerLuck) {
    const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
    const luckFactor = Math.max(-0.2, Math.min(0.2, playerLuck / 100));
    
    // Modify weight distribution based on luck
    // Positive luck increases first outcome (heads)
    const newDistribution = [...coin.weightDistribution];
    
    if (newDistribution.length >= 2) {
      // Increase or decrease odds of first outcome based on luck
      newDistribution[0] = Math.max(0.1, Math.min(0.9, newDistribution[0] + luckFactor));
      
      // Adjust other outcomes proportionally
      const remainingWeight = 1 - newDistribution[0];
      const originalRemainingWeight = coin.weightDistribution.slice(1).reduce((a, b) => a + b, 0);
      
      for (let i = 1; i < newDistribution.length; i++) {
        if (originalRemainingWeight > 0) {
          newDistribution[i] = (coin.weightDistribution[i] / originalRemainingWeight) * remainingWeight;
        } else {
          newDistribution[i] = remainingWeight / (newDistribution.length - 1);
        }
      }
    }
    
    return {
      ...coin,
      weightDistribution: newDistribution
    };
}

/**
 * Create a biased coin with preferred outcome
 */
function loadedCoin(coinType, bias) {
    const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
    const biasAmount = Math.max(0, Math.min(0.4, bias)); // Max 40% bias
    
    // Create a new weight distribution favoring the first outcome
    const newDistribution = [...coin.weightDistribution];
    
    if (bias >= 0) {
      // Bias towards first outcome
      newDistribution[0] = Math.min(0.9, newDistribution[0] + biasAmount);
    } else {
      // Bias towards second outcome
      newDistribution[0] = Math.max(0.1, newDistribution[0] - biasAmount);
    }
    
    // Adjust remaining weights proportionally
    const remainingWeight = 1 - newDistribution[0];
    const originalRemainingWeight = coin.weightDistribution.slice(1).reduce((a, b) => a + b, 0);
    
    for (let i = 1; i < newDistribution.length; i++) {
      if (originalRemainingWeight > 0) {
        newDistribution[i] = (coin.weightDistribution[i] / originalRemainingWeight) * remainingWeight;
      } else {
        newDistribution[i] = remainingWeight / (newDistribution.length - 1);
      }
    }
    
    return {
      ...coin,
      id: `${coin.id}_loaded`,
      name: `Loaded ${coin.name}`,
      description: `A biased version of the ${coin.name.toLowerCase()}`,
      weightDistribution: newDistribution
    };
}

// UI and feedback utilities

/**
 * Helper for animating coin flips in UI
 */
function animateCoinFlip(coinType) {
    // This would be implemented based on the game's UI system
    return {
      duration: 1000, // milliseconds
      rotations: 5,
      easing: "easeOutQuad",
      coinType: COIN_TYPES[coinType] || COIN_TYPES.STANDARD,
      sound: "coin_flip"
    };
}

/**
 * Generate readable odds description
 */
function describeCoinOdds(coinType, flips) {
    const coin = COIN_TYPES[coinType] || COIN_TYPES.STANDARD;
    
    if (flips === 1) {
      // Describe single flip odds
      const descriptions = [];
      for (let i = 0; i < coin.sides; i++) {
        const percentage = (coin.weightDistribution[i] * 100).toFixed(1);
        descriptions.push(`${percentage}% chance of outcome ${i}`);
      }
      return descriptions.join(", ");
    } else {
      // Describe multiple flip scenarios
      const sameOutcome = Math.pow(coin.weightDistribution[0], flips) * 100;
      const allDifferent = flips <= coin.sides ? 
        (Math.pow(coin.sides, flips) / Math.pow(coin.sides, flips)) * 100 : 0;
      
      return `${sameOutcome.toFixed(2)}% chance of all ${flips} coins showing the same face, ` +
             `${allDifferent.toFixed(2)}% chance of all different outcomes.`;
    }
}

/**
 * Suggest optimal strategy based on game state
 */
function suggestOptimalStrategy(gameState) {
    const { playerLuck, remainingFlips, currentValue } = gameState;
    
    // Calculate expected value for different strategies
    const strategies = [
      {
        name: "Conservative",
        description: "Use standard coins for consistent results",
        expectedValue: currentValue * 0.8 + playerLuck/100 * currentValue,
        risk: "Low",
        recommendedWhen: playerLuck < 0 || remainingFlips < 2
      },
      {
        name: "Balanced",
        description: "Mix standard and weighted coins for good risk/reward balance",
        expectedValue: currentValue * 1.2 + playerLuck/100 * currentValue * 1.5,
        risk: "Medium",
        recommendedWhen: playerLuck >= 0 && playerLuck < 50
      },
      {
        name: "Aggressive",
        description: "Use loaded coins and double-or-nothing for high rewards",
        expectedValue: currentValue * 1.6 + playerLuck/100 * currentValue * 2,
        risk: "High",
        recommendedWhen: playerLuck >= 50 && remainingFlips >= 3
      }
    ];
    
    // Find best strategy based on expected value
    strategies.sort((a, b) => b.expectedValue - a.expectedValue);
    
    return {
      bestStrategy: strategies[0],
      allStrategies: strategies,
      explanation: `Based on your luck stat (${playerLuck}) and remaining flips (${remainingFlips}), ` +
                   `the ${strategies[0].name} strategy is recommended.`
    };
}

// Example usage

/**
 * Example: Gambler's "Double Down" ability
 * 
 * This ability allows the Gambler to risk their current bonus for a chance
 * to double it. The player's luck stat affects the outcome.
 * 
 * function gambleDoubleDown(player, currentBonus) {
 *   const playerLuck = player.stats.luck;
 *   const riskLevel = 0.3 + (playerLuck / 200); // Base 30% + up to 25% from luck
 *   
 *   const result = doubleOrNothing(currentBonus, riskLevel);
 *   
 *   if (result.success) {
 *     // Success animation and apply doubled bonus
 *     animateCoinFlip("WEIGHTED");
 *     return { message: "Double bonus achieved!", bonus: result.newValue };
 *   } else {
 *     // Failure animation and lose bonus
 *     animateCoinFlip("WEIGHTED");
 *     return { message: "Bonus lost!", bonus: 0 };
 *   }
 * }
 * 
 * Example: Trickster's "Lucky Streak" passive
 * 
 * This passive ability gives the Trickster increasing power as they
 * get consecutive successful coin flips.
 * 
 * function applyLuckyStreakPassive(player, previousFlips) {
 *   const streak = luckyStreak(previousFlips);
 *   
 *   if (streak.active) {
 *     const bonusMultiplier = 1 + streak.bonus;
 *     player.applyStatusEffect({
 *       name: "Lucky Streak",
 *       icon: "streak_luck",
 *       duration: 2, // lasts for 2 turns
 *       effects: {
 *         damageMultiplier: bonusMultiplier,
 *         criticalChance: player.stats.criticalChance * bonusMultiplier
 *       },
 *       description: `On a streak of ${streak.length}! Damage and crit chance increased by ${(streak.bonus * 100).toFixed(0)}%`
 *     });
 *   }
 * }
 */

// Export all functions and constants
export {
  COIN_TYPES,
  COIN_SIDES,
  flipCoin,
  flipMultipleCoins,
  calculateProbability,
  applyWeightedModifiers,
  determineOutcomeEffect,
  applyBonusForSeries,
  checkForSpecialCombination,
  interpretCoinResult,
  luckyStreak,
  doubleOrNothing,
  houseFavor,
  loadedCoin,
  animateCoinFlip,
  describeCoinOdds,
  suggestOptimalStrategy
};