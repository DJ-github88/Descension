/**
 * Dice System - Core mechanics for dice notation parsing and manipulation
 * 
 * This module provides comprehensive utilities for working with dice notation,
 * including parsing, validation, statistical analysis, and special dice mechanics
 * like advantage/disadvantage, exploding dice, and critical dice.
 */

// =====================================================================
// CONSTANTS AND TYPES
// =====================================================================

/**
 * Standard dice types and validation utilities
 */
export const DICE_TYPES = {
    standard: [4, 6, 8, 10, 12, 20, 100],
    isStandard: (sides) => DICE_TYPES.standard.includes(Number(sides)),
    isValid: (sides) => Number.isInteger(Number(sides)) && Number(sides) >= 2
  };
  
  /**
   * Roll modes for special dice mechanics
   */
  export const ROLL_MODES = {
    NORMAL: 'normal',
    ADVANTAGE: 'advantage',
    DISADVANTAGE: 'disadvantage',
    EXPLODING: 'exploding',
    CRITICAL: 'critical'
  };
  
  // =====================================================================
  // CORE PARSING FUNCTIONS
  // =====================================================================
  
  /**
   * Parse dice notation into components
   */
  export function parseDiceNotation(notation) {
    if (!notation || typeof notation !== 'string') {
      return null;
    }
  
    // Clean the notation by removing whitespace
    const cleanNotation = notation.replace(/\s+/g, '');
    
    // Handle complex expressions with operators and parentheses
    if (/[\+\-\*\/\(\)]/.test(cleanNotation)) {
      return parseComplexDiceExpression(cleanNotation);
    }
    
    // Basic dice notation pattern: XdY or XdY+Z or XdYkZ (keep highest Z)
    const basicPattern = /^(\d+)d(\d+)(k(\d+))?([+-]\d+)?$/i;
    const matches = cleanNotation.match(basicPattern);
    
    if (!matches) {
      return null;
    }
    
    const count = parseInt(matches[1], 10);
    const sides = parseInt(matches[2], 10);
    const keepHighest = matches[3] ? parseInt(matches[4], 10) : null;
    const modifier = matches[5] ? parseInt(matches[5], 10) : 0;
    
    return {
      count,
      sides,
      keepHighest,
      modifier,
      type: 'basic',
      original: notation
    };
  }
  
  /**
   * Parse complex dice expressions with operators and parentheses
   */
  function parseComplexDiceExpression(notation) {
    try {
      // Split the expression into tokens
      const tokens = tokenizeDiceExpression(notation);
      
      // Parse the tokens into an abstract syntax tree
      const ast = parseTokensToAST(tokens);
      
      return {
        type: 'complex',
        ast,
        original: notation
      };
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Tokenize a dice expression
   */
  function tokenizeDiceExpression(expression) {
    const tokenRegex = /(\d+d\d+k?\d*)|(\d+)|([+\-*/()])/g;
    const tokens = [];
    let match;
    
    while ((match = tokenRegex.exec(expression)) !== null) {
      if (match[1]) { // Dice notation
        tokens.push({ type: 'dice', value: match[1] });
      } else if (match[2]) { // Number
        tokens.push({ type: 'number', value: parseInt(match[2], 10) });
      } else if (match[3]) { // Operator or parenthesis
        tokens.push({ type: 'operator', value: match[3] });
      }
    }
    
    return tokens;
  }
  
  /**
   * Parse tokens into an abstract syntax tree (AST)
   */
  function parseTokensToAST(tokens) {
    // Shunting yard algorithm to convert infix to postfix notation
    const outputQueue = [];
    const operatorStack = [];
    
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2
    };
    
    for (const token of tokens) {
      if (token.type === 'dice' || token.type === 'number') {
        outputQueue.push(token);
      } else if (token.type === 'operator') {
        if (token.value === '(') {
          operatorStack.push(token);
        } else if (token.value === ')') {
          while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].value !== '(') {
            outputQueue.push(operatorStack.pop());
          }
          // Discard the left parenthesis
          operatorStack.pop();
        } else {
          while (
            operatorStack.length > 0 &&
            operatorStack[operatorStack.length - 1].value !== '(' &&
            precedence[operatorStack[operatorStack.length - 1].value] >= precedence[token.value]
          ) {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
        }
      }
    }
    
    // Pop any remaining operators from the stack to the output queue
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop());
    }
    
    // Build the AST from the postfix notation
    const astStack = [];
    
    for (const token of outputQueue) {
      if (token.type === 'dice' || token.type === 'number') {
        astStack.push(token);
      } else if (token.type === 'operator') {
        const right = astStack.pop();
        const left = astStack.pop();
        astStack.push({
          type: 'operation',
          operator: token.value,
          left,
          right
        });
      }
    }
    
    return astStack[0];
  }
  
  /**
   * Validate dice notation
   */
  export function isValidDiceNotation(notation) {
    if (!notation || typeof notation !== 'string') {
      return false;
    }
    
    // Clean the notation
    const cleanNotation = notation.replace(/\s+/g, '');
    
    // Handle complex expressions
    if (/[\+\-\*\/\(\)]/.test(cleanNotation)) {
      try {
        const tokens = tokenizeDiceExpression(cleanNotation);
        parseTokensToAST(tokens);
        return true;
      } catch (error) {
        return false;
      }
    }
    
    // Basic dice patterns
    const basicPattern = /^(\d+)d(\d+)(k(\d+))?([+-]\d+)?$/i;
    const matches = cleanNotation.match(basicPattern);
    
    if (!matches) {
      return false;
    }
    
    const count = parseInt(matches[1], 10);
    const sides = parseInt(matches[2], 10);
    const keepHighest = matches[3] ? parseInt(matches[4], 10) : null;
    
    // Validate dice count and sides
    if (count <= 0 || sides <= 1) {
      return false;
    }
    
    // Validate keep highest if present
    if (keepHighest !== null && (keepHighest <= 0 || keepHighest > count)) {
      return false;
    }
    
    return true;
  }
  
  // =====================================================================
  // STATISTICAL CALCULATION FUNCTIONS
  // =====================================================================
  
  /**
   * Get the minimum possible roll for a dice notation
   */
  export function getMinRoll(notation) {
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      return null;
    }
    
    if (parsed.type === 'complex') {
      return calculateMinForAST(parsed.ast);
    }
    
    const { count, keepHighest, modifier } = parsed;
    
    // If keeping highest N dice, min roll is 1 * number of kept dice
    const effectiveCount = keepHighest !== null ? keepHighest : count;
    
    return effectiveCount + modifier;
  }
  
  /**
   * Calculate minimum value for an AST
   */
  function calculateMinForAST(ast) {
    if (ast.type === 'number') {
      return ast.value;
    }
    
    if (ast.type === 'dice') {
      const parsed = parseDiceNotation(ast.value);
      return parsed ? getMinRoll(ast.value) : 0;
    }
    
    if (ast.type === 'operation') {
      const leftMin = calculateMinForAST(ast.left);
      const rightMin = calculateMinForAST(ast.right);
      
      switch (ast.operator) {
        case '+': return leftMin + rightMin;
        case '-': return leftMin - rightMin;
        case '*': return leftMin * rightMin;
        case '/': return Math.floor(leftMin / rightMin);
        default: return 0;
      }
    }
    
    return 0;
  }
  
  /**
   * Get the maximum possible roll for a dice notation
   */
  export function getMaxRoll(notation) {
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      return null;
    }
    
    if (parsed.type === 'complex') {
      return calculateMaxForAST(parsed.ast);
    }
    
    const { count, sides, keepHighest, modifier } = parsed;
    
    // If keeping highest N dice, max roll is sides * number of kept dice
    const effectiveCount = keepHighest !== null ? keepHighest : count;
    
    return effectiveCount * sides + modifier;
  }
  
  /**
   * Calculate maximum value for an AST
   */
  function calculateMaxForAST(ast) {
    if (ast.type === 'number') {
      return ast.value;
    }
    
    if (ast.type === 'dice') {
      const parsed = parseDiceNotation(ast.value);
      return parsed ? getMaxRoll(ast.value) : 0;
    }
    
    if (ast.type === 'operation') {
      const leftMax = calculateMaxForAST(ast.left);
      const rightMax = calculateMaxForAST(ast.right);
      
      switch (ast.operator) {
        case '+': return leftMax + rightMax;
        case '-': return leftMax - rightMax;
        case '*': return leftMax * rightMax;
        case '/': return Math.floor(leftMax / rightMax);
        default: return 0;
      }
    }
    
    return 0;
  }
  
  /**
   * Get the average roll for a dice notation
   */
  export function getAverageRoll(notation) {
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      return null;
    }
    
    if (parsed.type === 'complex') {
      return calculateAverageForAST(parsed.ast);
    }
    
    const { count, sides, keepHighest, modifier } = parsed;
    
    if (keepHighest !== null) {
      // For keep highest calculations, we need to use probability distributions
      return calculateKeepHighestAverage(count, sides, keepHighest) + modifier;
    }
    
    // For regular dice, average of a dX is (X+1)/2
    return count * (sides + 1) / 2 + modifier;
  }
  
  /**
   * Calculate average value for an AST
   */
  function calculateAverageForAST(ast) {
    if (ast.type === 'number') {
      return ast.value;
    }
    
    if (ast.type === 'dice') {
      const parsed = parseDiceNotation(ast.value);
      return parsed ? getAverageRoll(ast.value) : 0;
    }
    
    if (ast.type === 'operation') {
      const leftAvg = calculateAverageForAST(ast.left);
      const rightAvg = calculateAverageForAST(ast.right);
      
      switch (ast.operator) {
        case '+': return leftAvg + rightAvg;
        case '-': return leftAvg - rightAvg;
        case '*': return leftAvg * rightAvg;
        case '/': return leftAvg / rightAvg;
        default: return 0;
      }
    }
    
    return 0;
  }
  
  /**
   * Calculate average for keep highest dice
   */
  function calculateKeepHighestAverage(diceCount, sides, keep) {
    // This is a simplified approximation - a true calculation requires probability distributions
    // For simple cases, we can use this approximation
    if (keep >= diceCount) {
      return diceCount * (sides + 1) / 2;
    }
  
    // Approximate the expected value of keeping highest k out of n dice
    const singleDieAvg = (sides + 1) / 2;
    const adjustment = (diceCount - keep) * (singleDieAvg - sides * keep / (diceCount + 1)) / diceCount;
    
    return keep * (singleDieAvg + adjustment);
  }
  
  // =====================================================================
  // ROLL FUNCTIONS WITH SPECIAL MECHANICS
  // =====================================================================
  
  /**
   * Simulate a dice roll based on notation
   */
  export function rollDice(notation, options = {}) {
    const {
      mode = ROLL_MODES.NORMAL,
      criticalThreshold = null,
      criticalMultiplier = 2,
      explodeLimit = 1000, // Prevent infinite explosions
    } = options;
    
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      throw new Error(`Invalid dice notation: ${notation}`);
    }
    
    let result;
    
    switch (mode) {
      case ROLL_MODES.ADVANTAGE:
        result = rollWithAdvantage(parsed);
        break;
      case ROLL_MODES.DISADVANTAGE:
        result = rollWithDisadvantage(parsed);
        break;
      case ROLL_MODES.EXPLODING:
        result = rollExplodingDice(parsed, explodeLimit);
        break;
      case ROLL_MODES.CRITICAL:
        result = rollCriticalDice(parsed, criticalThreshold, criticalMultiplier);
        break;
      case ROLL_MODES.NORMAL:
      default:
        result = performBasicRoll(parsed);
        break;
    }
    
    return {
      notation,
      mode,
      total: result.total,
      rolls: result.rolls,
      modifier: parsed.type === 'basic' ? parsed.modifier : 0,
      details: result.details || {}
    };
  }
  
  /**
   * Perform a basic dice roll
   */
  function performBasicRoll(parsed) {
    if (parsed.type === 'complex') {
      return evaluateComplexRoll(parsed.ast);
    }
    
    const { count, sides, keepHighest, modifier } = parsed;
    
    // Roll the dice
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    // Keep highest if specified
    let usedRolls = [...rolls];
    if (keepHighest !== null) {
      usedRolls = [...rolls].sort((a, b) => b - a).slice(0, keepHighest);
    }
    
    // Sum the rolls and add modifier
    const total = usedRolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    return {
      total,
      rolls,
      usedRolls,
      keptHighest: keepHighest !== null
    };
  }
  
  /**
   * Evaluate a complex roll (expression with operators)
   */
  function evaluateComplexRoll(ast) {
    if (ast.type === 'number') {
      return {
        total: ast.value,
        rolls: [],
        details: { type: 'constant', value: ast.value }
      };
    }
    
    if (ast.type === 'dice') {
      const diceRoll = rollDice(ast.value);
      return {
        total: diceRoll.total,
        rolls: diceRoll.rolls,
        details: { type: 'dice', notation: ast.value, roll: diceRoll }
      };
    }
    
    if (ast.type === 'operation') {
      const left = evaluateComplexRoll(ast.left);
      const right = evaluateComplexRoll(ast.right);
      
      let total;
      switch (ast.operator) {
        case '+': total = left.total + right.total; break;
        case '-': total = left.total - right.total; break;
        case '*': total = left.total * right.total; break;
        case '/': total = Math.floor(left.total / right.total); break;
        default: total = 0;
      }
      
      return {
        total,
        rolls: [...left.rolls, ...right.rolls],
        details: {
          type: 'operation',
          operator: ast.operator,
          left: left.details,
          right: right.details
        }
      };
    }
    
    return { total: 0, rolls: [] };
  }
  
  /**
   * Roll with advantage (roll twice, take higher result)
   */
  function rollWithAdvantage(parsed) {
    const roll1 = performBasicRoll(parsed);
    const roll2 = performBasicRoll(parsed);
    
    const useFirst = roll1.total >= roll2.total;
    
    return {
      total: useFirst ? roll1.total : roll2.total,
      rolls: [roll1.rolls, roll2.rolls],
      details: {
        type: 'advantage',
        roll1,
        roll2,
        selected: useFirst ? 1 : 2
      }
    };
  }
  
  /**
   * Roll with disadvantage (roll twice, take lower result)
   */
  function rollWithDisadvantage(parsed) {
    const roll1 = performBasicRoll(parsed);
    const roll2 = performBasicRoll(parsed);
    
    const useFirst = roll1.total <= roll2.total;
    
    return {
      total: useFirst ? roll1.total : roll2.total,
      rolls: [roll1.rolls, roll2.rolls],
      details: {
        type: 'disadvantage',
        roll1,
        roll2,
        selected: useFirst ? 1 : 2
      }
    };
  }
  
  /**
   * Roll exploding dice (reroll max values and add)
   */
  function rollExplodingDice(parsed, explodeLimit) {
    if (parsed.type === 'complex') {
      // For complex expressions, fallback to normal roll
      return evaluateComplexRoll(parsed.ast);
    }
    
    const { count, sides, modifier } = parsed;
    const allRolls = [];
    const explosions = [];
    
    // Initial rolls
    for (let i = 0; i < count; i++) {
      const initialRoll = Math.floor(Math.random() * sides) + 1;
      allRolls.push(initialRoll);
      
      // Handle explosions for each die
      if (initialRoll === sides) {
        let currentRoll = initialRoll;
        let explosionChain = [initialRoll];
        let explosionCount = 0;
        
        while (currentRoll === sides && explosionCount < explodeLimit) {
          currentRoll = Math.floor(Math.random() * sides) + 1;
          explosionChain.push(currentRoll);
          allRolls.push(currentRoll);
          explosionCount++;
        }
        
        explosions.push({
          dieIndex: i,
          chain: explosionChain,
          total: explosionChain.reduce((sum, roll) => sum + roll, 0)
        });
      }
    }
    
    const total = allRolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    return {
      total,
      rolls: allRolls,
      details: {
        type: 'exploding',
        explosions,
        modifier
      }
    };
  }
  
  /**
   * Roll with critical hit rules
   */
  function rollCriticalDice(parsed, threshold, multiplier) {
    if (parsed.type === 'complex') {
      // For complex expressions, fallback to normal roll with manual check
      const result = evaluateComplexRoll(parsed.ast);
      const max = getMaxRoll(parsed.original);
      
      const criticalThreshold = threshold !== null ? threshold : max;
      const isCritical = result.total >= criticalThreshold;
      
      if (isCritical) {
        return {
          total: result.total * multiplier,
          rolls: result.rolls,
          details: {
            type: 'critical',
            originalRoll: result,
            multiplier,
            isCritical: true
          }
        };
      }
      
      return {
        ...result,
        details: {
          ...result.details,
          type: 'critical',
          isCritical: false
        }
      };
    }
    
    const { count, sides, modifier } = parsed;
    
    // Roll the dice
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    // Check for critical hit
    const criticalThreshold = threshold !== null ? threshold : sides;
    const hasCritical = rolls.some(roll => roll >= criticalThreshold);
    
    // Sum the rolls
    const normalTotal = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    
    // Apply critical multiplier if applicable
    const total = hasCritical ? normalTotal * multiplier : normalTotal;
    
    return {
      total,
      rolls,
      details: {
        type: 'critical',
        threshold: criticalThreshold,
        multiplier,
        isCritical: hasCritical,
        normalTotal
      }
    };
  }
  
  // =====================================================================
  // DICE VISUALIZATION UTILITIES
  // =====================================================================
  
  /**
   * Generate probability distribution for a dice notation
   */
  export function getProbabilityDistribution(notation) {
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      return null;
    }
    
    // For complex expressions, use Monte Carlo simulation
    if (parsed.type === 'complex') {
      return getDistributionViaMonteCarlo(notation);
    }
    
    const { count, sides, keepHighest, modifier } = parsed;
    
    // Simple case: single die
    if (count === 1 && !keepHighest) {
      const distribution = {};
      for (let i = 1; i <= sides; i++) {
        distribution[i + modifier] = 1 / sides;
      }
      return {
        distribution,
        min: 1 + modifier,
        max: sides + modifier,
        mean: (sides + 1) / 2 + modifier
      };
    }
    
    // Multiple dice without keep highest
    if (!keepHighest) {
      return getDistributionForMultipleDice(count, sides, modifier);
    }
    
    // Keep highest dice - use Monte Carlo for approximation
    return getDistributionForKeepHighest(count, sides, keepHighest, modifier);
  }
  
  /**
   * Get distribution for multiple dice (exact calculation)
   */
  function getDistributionForMultipleDice(count, sides, modifier) {
    // Initialize distribution with single die
    let distribution = {};
    for (let i = 1; i <= sides; i++) {
      distribution[i] = 1 / sides;
    }
    
    // Add more dice using convolution
    for (let d = 1; d < count; d++) {
      const newDistribution = {};
      for (const [sum1, prob1] of Object.entries(distribution)) {
        for (let i = 1; i <= sides; i++) {
          const newSum = parseInt(sum1) + i;
          newDistribution[newSum] = (newDistribution[newSum] || 0) + prob1 * (1 / sides);
        }
      }
      distribution = newDistribution;
    }
    
    // Apply modifier
    if (modifier !== 0) {
      const shiftedDistribution = {};
      for (const [sum, prob] of Object.entries(distribution)) {
        shiftedDistribution[parseInt(sum) + modifier] = prob;
      }
      distribution = shiftedDistribution;
    }
    
    // Calculate statistics
    const outcomes = Object.keys(distribution).map(x => parseInt(x));
    const min = Math.min(...outcomes);
    const max = Math.max(...outcomes);
    const mean = Object.entries(distribution).reduce(
      (sum, [outcome, prob]) => sum + parseInt(outcome) * prob, 0
    );
    
    return {
      distribution,
      min,
      max,
      mean
    };
  }
  
  /**
   * Get distribution for keep highest dice using Monte Carlo
   */
  function getDistributionForKeepHighest(count, sides, keep, modifier) {
    const trials = 100000;
    const results = {};
    
    for (let i = 0; i < trials; i++) {
      // Roll the dice
      const rolls = [];
      for (let j = 0; j < count; j++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      
      // Keep highest N dice
      rolls.sort((a, b) => b - a);
      const keptRolls = rolls.slice(0, keep);
      
      // Sum and apply modifier
      const sum = keptRolls.reduce((total, roll) => total + roll, 0) + modifier;
      
      // Record the result
      results[sum] = (results[sum] || 0) + 1;
    }
    
    // Convert to probabilities
    const distribution = {};
    for (const [outcome, frequency] of Object.entries(results)) {
      distribution[outcome] = frequency / trials;
    }
    
    // Calculate statistics
    const outcomes = Object.keys(distribution).map(x => parseInt(x));
    const min = Math.min(...outcomes);
    const max = Math.max(...outcomes);
    const mean = Object.entries(distribution).reduce(
      (sum, [outcome, prob]) => sum + parseInt(outcome) * prob, 0
    );
    
    return {
      distribution,
      min,
      max,
      mean,
      isApproximation: true
    };
  }
  
  /**
   * Get distribution via Monte Carlo simulation (for complex expressions)
   */
  function getDistributionViaMonteCarlo(notation) {
    const trials = 100000;
    const results = {};
    
    for (let i = 0; i < trials; i++) {
      const roll = rollDice(notation);
      const outcome = roll.total;
      
      results[outcome] = (results[outcome] || 0) + 1;
    }
    
    // Convert to probabilities
    const distribution = {};
    for (const [outcome, frequency] of Object.entries(results)) {
      distribution[outcome] = frequency / trials;
    }
    
    // Calculate statistics
    const outcomes = Object.keys(distribution).map(x => parseInt(x));
    const min = Math.min(...outcomes);
    const max = Math.max(...outcomes);
    const mean = Object.entries(distribution).reduce(
      (sum, [outcome, prob]) => sum + parseInt(outcome) * prob, 0
    );
    
    return {
      distribution,
      min,
      max,
      mean,
      isApproximation: true
    };
  }
  
  /**
   * Generate data for visualizing dice roll probability
   */
  export function getDiceVisualizationData(notation) {
    const distribution = getProbabilityDistribution(notation);
    
    if (!distribution) {
      return null;
    }
    
    // Transform for visualization
    const data = Object.entries(distribution.distribution).map(([outcome, probability]) => ({
      outcome: parseInt(outcome),
      probability,
      percentage: probability * 100,
      count: Math.round(probability * 36) // For creating simple ASCII visualizations
    }));
    
    // Sort by outcome
    data.sort((a, b) => a.outcome - b.outcome);
    
    return {
      data,
      statistics: {
        min: distribution.min,
        max: distribution.max,
        mean: distribution.mean,
        median: calculateMedian(distribution.distribution),
        mode: calculateMode(distribution.distribution),
        isApproximation: distribution.isApproximation
      }
    };
  }
  
  /**
   * Calculate the median from a probability distribution
   */
  function calculateMedian(distribution) {
    const outcomes = Object.keys(distribution).map(x => parseInt(x)).sort((a, b) => a - b);
    
    if (outcomes.length === 0) return 0;
    
    // Build a cumulative distribution
    let cumulativeProb = 0;
    for (const outcome of outcomes) {
      cumulativeProb += distribution[outcome];
      if (cumulativeProb >= 0.5) return outcome;
    }
    
    return outcomes[Math.floor(outcomes.length / 2)];
  }
  
  /**
   * Calculate the mode from a probability distribution
   */
  function calculateMode(distribution) {
    let mode = 0;
    let maxProb = 0;
    
    for (const [outcome, prob] of Object.entries(distribution)) {
      if (prob > maxProb) {
        maxProb = prob;
        mode = parseInt(outcome);
      }
    }
    
    return mode;
  }
  
  /**
   * Create a simple ASCII visualization of dice probability
   */
  export function createAsciiDiceChart(notation) {
    const vizData = getDiceVisualizationData(notation);
    
    if (!vizData) {
      return null;
    }
    
    const { data, statistics } = vizData;
    
    // Create the chart
    let chart = `Probability Distribution for ${notation}\n`;
    chart += `Min: ${statistics.min}, Max: ${statistics.max}, Mean: ${statistics.mean.toFixed(2)}\n\n`;
    
    const maxPercentage = Math.max(...data.map(d => d.percentage));
    const scale = 40 / maxPercentage; // Scale to fit in 40 chars width
    
    for (const point of data) {
      const barLength = Math.round(point.percentage * scale);
      const bar = '#'.repeat(barLength);
      chart += `${point.outcome.toString().padStart(3)}: ${'█'.repeat(barLength)} ${point.percentage.toFixed(2)}%\n`;
    }
    
    return chart;
  }
  
  // =====================================================================
  // DICE SUGGESTIONS AND DESCRIPTIONS
  // =====================================================================
  
  /**
   * Get suggested dice notation based on target average
   */
  export function getSuggestedDiceNotation(targetAverage, options = {}) {
    const {
      preferStandardDice = true,
      maxDiceCount = 10,
      allowModifiers = true,
      targetVariance = 'medium', // 'low', 'medium', 'high'
    } = options;
    
    // Variance preferences affect dice size and count
    let preferredDiceSizes;
    let preferredDiceCounts;
    
    switch (targetVariance) {
      case 'low':
        preferredDiceSizes = [4, 6, 8];
        preferredDiceCounts = [3, 4, 5, 6];
        break;
      case 'high':
        preferredDiceSizes = [10, 12, 20];
        preferredDiceCounts = [1, 2, 3];
        break;
      case 'medium':
      default:
        preferredDiceSizes = [6, 8, 10];
        preferredDiceCounts = [2, 3, 4];
        break;
    }
    
    let bestSuggestion = null;
    let bestDifference = Infinity;
    
    // Try different combinations of dice count and sides
    for (const sides of preferStandardDice ? preferredDiceSizes : [4, 6, 8, 10, 12, 20]) {
      for (let count = 1; count <= maxDiceCount; count++) {
        const avgWithoutModifier = count * (sides + 1) / 2;
        
        if (allowModifiers) {
          const neededModifier = Math.round(targetAverage - avgWithoutModifier);
          const avg = avgWithoutModifier + neededModifier;
          const difference = Math.abs(targetAverage - avg);
          
          if (difference < bestDifference) {
            bestDifference = difference;
            bestSuggestion = {
              notation: `${count}d${sides}${neededModifier >= 0 ? '+' + neededModifier : neededModifier}`,
              average: avg,
              count,
              sides,
              modifier: neededModifier
            };
          }
        } else {
          const difference = Math.abs(targetAverage - avgWithoutModifier);
          
          if (difference < bestDifference) {
            bestDifference = difference;
            bestSuggestion = {
              notation: `${count}d${sides}`,
              average: avgWithoutModifier,
              count,
              sides,
              modifier: 0
            };
          }
        }
      }
    }
    
    return bestSuggestion;
  }
  
  /**
   * Get human-readable description of dice notation
   */
  export function getDiceDescription(notation, options = {}) {
    const {
      includeAverage = true,
      includeRange = true,
      verboseDescription = false
    } = options;
    
    const parsed = parseDiceNotation(notation);
    
    if (!parsed) {
      return 'Invalid dice notation';
    }
    
    let description = '';
    
    if (parsed.type === 'complex') {
      description = `Complex dice expression: ${notation}`;
    } else {
      const { count, sides, keepHighest, modifier } = parsed;
      
      description = `${count} ${count === 1 ? 'die' : 'dice'} with ${sides} sides`;
      
      if (keepHighest !== null) {
        description += `, keeping the highest ${keepHighest}`;
      }
      
      if (modifier !== 0) {
        description += ` ${modifier > 0 ? 'plus' : 'minus'} ${Math.abs(modifier)}`;
      }
    }
    
    if (includeRange) {
      const min = getMinRoll(notation);
      const max = getMaxRoll(notation);
      description += ` (range: ${min} to ${max})`;
    }
    
    if (includeAverage) {
      const avg = getAverageRoll(notation);
      description += ` (average: ${avg.toFixed(1)})`;
    }
    
    if (verboseDescription && parsed.type !== 'complex') {
      description += getVerboseDiceDescription(parsed);
    }
    
    return description;
  }
  
  /**
   * Get a verbose description for basic dice notation
   */
  function getVerboseDiceDescription(parsed) {
    const { count, sides, keepHighest, modifier } = parsed;
    
    let description = '\n\nThis means rolling ';
    
    if (count === 1) {
      description += `a single ${sides}-sided die`;
    } else {
      description += `${count} ${sides}-sided dice`;
    }
    
    if (keepHighest !== null) {
      description += ` and only counting the highest ${keepHighest} ${keepHighest === 1 ? 'result' : 'results'}`;
    }
    
    if (modifier !== 0) {
      description += ` then ${modifier > 0 ? 'adding' : 'subtracting'} ${Math.abs(modifier)}`;
    }
    
    description += '.';
    
    // Add probability information
    const min = getMinRoll(parsed.original);
    const max = getMaxRoll(parsed.original);
    const avg = getAverageRoll(parsed.original);
    
    description += `\n\nThe minimum possible roll is ${min}.`;
    description += `\nThe maximum possible roll is ${max}.`;
    description += `\nThe average roll is ${avg.toFixed(2)}.`;
    
    return description;
  }
  
  // =====================================================================
  // SPECIAL EFFECT DICE CALCULATIONS
  // =====================================================================
  
  /**
   * Calculate damage for chained effects (like chain lightning)
   */
  export function calculateChainedDamage(baseNotation, options = {}) {
    const {
      targets = 3,
      falloffType = 'percentage', // 'percentage', 'fixed', 'dice'
      falloffRate = 25, // percentage, fixed amount, or dice reduction
      minimumDamage = null
    } = options;
    
    const results = [];
    let currentNotation = baseNotation;
    
    for (let i = 0; i < targets; i++) {
      const current = {
        target: i + 1,
        notation: currentNotation,
        average: getAverageRoll(currentNotation),
        min: getMinRoll(currentNotation),
        max: getMaxRoll(currentNotation)
      };
      
      results.push(current);
      
      // Calculate falloff for next target
      if (i < targets - 1) {
        const parsed = parseDiceNotation(currentNotation);
        
        if (parsed && parsed.type !== 'complex') {
          let { count, sides, modifier } = parsed;
          
          if (falloffType === 'percentage') {
            const reduction = Math.floor(count * (falloffRate / 100));
            count = Math.max(1, count - reduction);
            modifier = Math.floor(modifier * (1 - falloffRate / 100));
          } else if (falloffType === 'fixed') {
            count = Math.max(1, count - falloffRate);
          } else if (falloffType === 'dice') {
            count = Math.max(1, count - 1);
          }
          
          currentNotation = `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`;
        } else {
          // For complex expressions, apply a percentage reduction to the average
          const currentAvg = getAverageRoll(currentNotation);
          const reducedAvg = currentAvg * (1 - falloffRate / 100);
          
          // If we have a minimum damage threshold
          if (minimumDamage !== null && reducedAvg < minimumDamage) {
            const suggestedNotation = getSuggestedDiceNotation(minimumDamage);
            currentNotation = suggestedNotation.notation;
          } else {
            const suggestedNotation = getSuggestedDiceNotation(reducedAvg);
            currentNotation = suggestedNotation.notation;
          }
        }
      }
    }
    
    return {
      baseNotation,
      chainedTargets: targets,
      falloffType,
      falloffRate,
      results,
      totalAverage: results.reduce((sum, result) => sum + result.average, 0)
    };
  }
  
  /**
   * Calculate critical hit damage
   */
  export function calculateCriticalDamage(baseNotation, options = {}) {
    const {
      criticalMultiplier = 2,
      criticalDiceOnly = false, // if true, only dice are doubled, not modifiers
      extraDice = '', // additional dice on crits, e.g. '2d6'
      maxDiceCount = 20
    } = options;
    
    const parsed = parseDiceNotation(baseNotation);
    
    if (!parsed) {
      return null;
    }
    
    let criticalNotation;
    let normalAverage = getAverageRoll(baseNotation);
    let criticalAverage;
    
    if (parsed.type !== 'complex') {
      let { count, sides, modifier } = parsed;
      
      if (criticalDiceOnly) {
        // Double only the dice, not the modifier
        const newCount = Math.min(maxDiceCount, Math.floor(count * criticalMultiplier));
        criticalNotation = `${newCount}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`;
      } else {
        // Double everything
        criticalNotation = `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`;
        criticalAverage = normalAverage * criticalMultiplier;
      }
      
      // Add extra dice if specified
      if (extraDice) {
        criticalNotation += `+${extraDice}`;
        const extraAverage = getAverageRoll(extraDice);
        if (!criticalAverage) {
          criticalAverage = getAverageRoll(criticalNotation);
        } else {
          criticalAverage += extraAverage;
        }
      } else if (!criticalAverage) {
        criticalAverage = getAverageRoll(criticalNotation);
      }
    } else {
      // For complex expressions, simply multiply the average
      criticalAverage = normalAverage * criticalMultiplier;
      criticalNotation = `(${baseNotation}) × ${criticalMultiplier}`;
      
      // Add extra dice if specified
      if (extraDice) {
        criticalNotation += ` + ${extraDice}`;
        const extraAverage = getAverageRoll(extraDice);
        criticalAverage += extraAverage;
      }
    }
    
    return {
      baseNotation,
      criticalNotation,
      normalAverage,
      criticalAverage,
      damageIncrease: criticalAverage - normalAverage,
      percentageIncrease: ((criticalAverage / normalAverage) - 1) * 100
    };
  }
  
  /**
   * Calculate DoT (Damage over Time) or HoT (Healing over Time) effects
   */
  export function calculateDotDamage(baseNotation, options = {}) {
    const {
      duration = 3, // number of ticks
      tickMultiplier = 1, // damage multiplier per tick
      scalingType = 'flat', // 'flat', 'increasing', 'decreasing', 'frontloaded', 'backloaded'
      initialMultiplier = 1, // for frontloaded/backloaded
      finalMultiplier = 1, // for frontloaded/backloaded
      dotType = 'damage' // 'damage' or 'healing'
    } = options;
    
    const baseAverage = getAverageRoll(baseNotation);
    const results = [];
    let totalAverage = 0;
    
    for (let i = 0; i < duration; i++) {
      let currentMultiplier;
      
      switch (scalingType) {
        case 'increasing':
          currentMultiplier = tickMultiplier * (1 + i * 0.5);
          break;
        case 'decreasing':
          currentMultiplier = tickMultiplier * (1 - i * 0.2);
          break;
        case 'frontloaded':
          // Start high, gradually decrease
          currentMultiplier = initialMultiplier - ((initialMultiplier - finalMultiplier) * (i / (duration - 1)));
          break;
        case 'backloaded':
          // Start low, gradually increase
          currentMultiplier = initialMultiplier + ((finalMultiplier - initialMultiplier) * (i / (duration - 1)));
          break;
        case 'flat':
        default:
          currentMultiplier = tickMultiplier;
          break;
      }
      
      // Ensure multiplier doesn't go below 0
      currentMultiplier = Math.max(0, currentMultiplier);
      
      const tickAverage = baseAverage * currentMultiplier;
      totalAverage += tickAverage;
      
      results.push({
        tick: i + 1,
        multiplier: currentMultiplier,
        average: tickAverage
      });
    }
    
    return {
      baseNotation,
      dotType,
      duration,
      scalingType,
      results,
      totalAverage,
      averagePerTick: totalAverage / duration
    };
  }
  
  // =====================================================================
  // DICE BUILDER CLASS
  // =====================================================================
  
  /**
   * DiceBuilder class for chaining dice operations
   */
  export class DiceBuilder {
    /**
     * Create a new DiceBuilder
     */
    constructor(notation) {
      this.notation = notation || '';
      this.reset();
    }
    
    /**
     * Reset the builder to initial state
     */
    reset() {
      this.count = 0;
      this.sides = 0;
      this.modifier = 0;
      this.keepHighest = null;
      return this;
    }
    
    /**
     * Parse existing notation into this builder
     */
    parse(notation) {
      const parsed = parseDiceNotation(notation);
      
      if (parsed && parsed.type !== 'complex') {
        this.count = parsed.count;
        this.sides = parsed.sides;
        this.modifier = parsed.modifier;
        this.keepHighest = parsed.keepHighest;
        this.notation = notation;
      } else {
        this.notation = notation;
      }
      
      return this;
    }
    
    /**
     * Set basic dice (e.g., 3d6)
     */
    dice(count, sides) {
      this.count = count;
      this.sides = sides;
      this.modifier = 0;
      this.keepHighest = null;
      this.notation = `${count}d${sides}`;
      return this;
    }
    
    /**
     * Add dice to the current notation
     */
    addDice(count, sides) {
      if (this.notation) {
        this.notation = `${this.notation} + ${count}d${sides}`;
      } else {
        this.notation = `${count}d${sides}`;
      }
      return this;
    }
    
    /**
     * Multiply the current notation by a factor
     */
    multiply(factor) {
      if (this.notation) {
        this.notation = `(${this.notation}) * ${factor}`;
      }
      return this;
    }
    
    /**
     * Add a value to the current notation
     */
    add(value) {
      if (this.notation) {
        this.notation = `${this.notation} + ${value}`;
      } else {
        this.notation = `${value}`;
      }
      return this;
    }
    
    /**
     * Subtract a value from the current notation
     */
    subtract(value) {
      if (this.notation) {
        this.notation = `${this.notation} - ${value}`;
      } else {
        this.notation = `-${value}`;
      }
      return this;
    }
    
    /**
     * Set to keep only the highest N dice
     */
    keepHighestDice(keep) {
      if (this.count && this.sides) {
        this.keepHighest = keep;
        this.notation = `${this.count}d${this.sides}k${keep}${this.modifier !== 0 ? (this.modifier > 0 ? '+' + this.modifier : this.modifier) : ''}`;
      }
      return this;
    }
    
    /**
     * Set advantage mode (roll twice, take higher)
     */
    withAdvantage() {
      if (this.notation) {
        this.notation = `advantage(${this.notation})`;
      }
      return this;
    }
    
    /**
     * Set disadvantage mode (roll twice, take lower)
     */
    withDisadvantage() {
      if (this.notation) {
        this.notation = `disadvantage(${this.notation})`;
      }
      return this;
    }
    
    /**
     * Set exploding dice mode
     */
    exploding() {
      if (this.count && this.sides) {
        this.notation = `${this.count}d${this.sides}!${this.modifier !== 0 ? (this.modifier > 0 ? '+' + this.modifier : this.modifier) : ''}`;
      }
      return this;
    }
    
    /**
     * Get the current dice notation
     */
    getNotation() {
      return this.notation;
    }
    
    /**
     * Get the average roll for the current notation
     */
    getAverage() {
      return getAverageRoll(this.notation);
    }
    
    /**
     * Get the minimum roll for the current notation
     */
    getMinRoll() {
      return getMinRoll(this.notation);
    }
    
    /**
     * Get the maximum roll for the current notation
     */
    getMaxRoll() {
      return getMaxRoll(this.notation);
    }
    
    /**
     * Get a human-readable description of the current notation
     */
    getDescription(options = {}) {
      return getDiceDescription(this.notation, options);
    }
    
    /**
     * Calculate critical damage for the current notation
     */
    getCriticalDamage(options = {}) {
      return calculateCriticalDamage(this.notation, options);
    }
    
    /**
     * Calculate DoT damage for the current notation
     */
    getDotDamage(options = {}) {
      return calculateDotDamage(this.notation, options);
    }
    
    /**
     * Calculate chained damage for the current notation
     */
    getChainedDamage(options = {}) {
      return calculateChainedDamage(this.notation, options);
    }
    
    /**
     * Get probability distribution for the current notation
     */
    getProbabilityDistribution() {
      return getProbabilityDistribution(this.notation);
    }
    
    /**
     * Get visualization data for the current notation
     */
    getVisualizationData() {
      return getDiceVisualizationData(this.notation);
    }
    
    /**
     * Simulate a roll of the current notation
     */
    roll(options = {}) {
      return rollDice(this.notation, options);
    }
  }
  
  // =====================================================================
  // EXPORTED HELPER FUNCTIONS
  // =====================================================================
  
  /**
   * Format a dice roll value with options
   */
  export function formatRoll(value, options = {}) {
    const { 
      showSign = false,
      decimals = 0
    } = options;
    
    if (typeof value !== 'number') {
      return 'N/A';
    }
    
    const formatted = value.toFixed(decimals);
    return showSign && value > 0 ? `+${formatted}` : formatted;
  }
  
  /**
   * Get a color for a damage type
   */
  export function getDamageTypeColor(damageType) {
    const colors = {
      fire: '#FF4500',
      cold: '#87CEEB',
      lightning: '#FFD700',
      thunder: '#9370DB',
      acid: '#32CD32',
      poison: '#8F9779',
      necrotic: '#702963',
      radiant: '#FFFACD',
      force: '#B0E0E6',
      psychic: '#FF69B4',
      bludgeoning: '#8B4513',
      piercing: '#A9A9A9',
      slashing: '#A9A9A9',
      healing: '#7CFC00',
      arcane: '#9966CC',
      chaos: '#FF00FF',
      void: '#000000'
    };
    
    return colors[damageType] || '#FFFFFF';
  }
  
  /**
   * Get a difficulty assessment based on an average roll
   */
  export function getDifficultyAssessment(average, scale = 'standard') {
    // Different scales for different game systems
    const scales = {
      standard: [
        { threshold: 5, label: 'Very Easy', description: 'Almost guaranteed success' },
        { threshold: 10, label: 'Easy', description: 'Most characters should succeed' },
        { threshold: 15, label: 'Medium', description: 'Moderately skilled characters will usually succeed' },
        { threshold: 20, label: 'Hard', description: 'Challenging even for skilled characters' },
        { threshold: 25, label: 'Very Hard', description: 'Only the most skilled have a chance' },
        { threshold: 30, label: 'Nearly Impossible', description: 'Success requires exceptional rolls and bonuses' }
      ],
      combat: [
        { threshold: 10, label: 'Minor', description: 'Scratch damage' },
        { threshold: 20, label: 'Moderate', description: 'Significant but not threatening' },
        { threshold: 30, label: 'Heavy', description: 'Considerable damage that threatens weaker enemies' },
        { threshold: 40, label: 'Severe', description: 'Potentially deadly to normal characters' },
        { threshold: 60, label: 'Extreme', description: 'Deadly even to resilient characters' },
        { threshold: 80, label: 'Catastrophic', description: 'Few creatures can survive this' }
      ]
    };
    
    const scaleToUse = scales[scale] || scales.standard;
    
    for (let i = 0; i < scaleToUse.length; i++) {
      if (average < scaleToUse[i].threshold) {
        return scaleToUse[i];
      }
    }
    
    // If above all thresholds
    return {
      threshold: Infinity,
      label: 'Legendary',
      description: 'Beyond normal limits'
    };
  }
  
  /**
   * Compare two dice notations statistically
   */
  export function compareDiceNotations(notation1, notation2) {
    const avg1 = getAverageRoll(notation1);
    const avg2 = getAverageRoll(notation2);
    
    const min1 = getMinRoll(notation1);
    const min2 = getMinRoll(notation2);
    
    const max1 = getMaxRoll(notation1);
    const max2 = getMaxRoll(notation2);
    
    const range1 = max1 - min1;
    const range2 = max2 - min2;
    
    return {
      averageDifference: avg2 - avg1,
      averageRatio: avg2 / avg1,
      minDifference: min2 - min1,
      maxDifference: max2 - max1,
      rangeDifference: range2 - range1,
      rangeRatio: range2 / range1,
      isStrictlyBetter: min2 >= min1 && avg2 > avg1 && max2 > max1,
      isStrictlyWorse: min2 <= min1 && avg2 < avg1 && max2 < max1,
      hasBetterAverage: avg2 > avg1,
      hasHigherMaximum: max2 > max1,
      hasHigherMinimum: min2 > min1,
      hasGreaterRange: range2 > range1
    };
  }
  
  /**
   * Create a dice calculator factory with custom configuration
   */
  export function createDiceCalculator(config = {}) {
    const {
      allowCustomDice = true,
      maxDiceCount = 100,
      maxSides = 1000,
      includeAdvancedFunctions = true,
      defaultNotation = '1d20',
      formatOptions = {}
    } = config;
    
    return {
      builder: new DiceBuilder(defaultNotation),
      
      parse: (notation) => parseDiceNotation(notation),
      
      validate: (notation) => isValidDiceNotation(notation),
      
      average: (notation) => getAverageRoll(notation),
      
      min: (notation) => getMinRoll(notation),
      
      max: (notation) => getMaxRoll(notation),
      
      roll: (notation, options) => rollDice(notation, options),
      
      format: (notation) => notation,
      
      describe: (notation, options = {}) => getDiceDescription(notation, options),
      
      suggest: (average, options = {}) => getSuggestedDiceNotation(average, options),
      
      criticalDamage: (notation, options = {}) => calculateCriticalDamage(notation, options),
      
      dotDamage: (notation, options = {}) => calculateDotDamage(notation, options),
      
      chainedDamage: (notation, options = {}) => calculateChainedDamage(notation, options),
      
      compare: (notation1, notation2) => compareDiceNotations(notation1, notation2),
      
      validateInput: function(input) {
        // Validate user input for dice calculator
        const { count, sides } = input;
        
        if (!Number.isInteger(count) || count <= 0 || count > maxDiceCount) {
          return {
            valid: false,
            error: `Dice count must be between 1 and ${maxDiceCount}`
          };
        }
        
        if (!Number.isInteger(sides) || sides <= 1 || sides > maxSides) {
          return {
            valid: false,
            error: `Dice sides must be between 2 and ${maxSides}`
          };
        }
        
        if (!allowCustomDice && !DICE_TYPES.isStandard(sides)) {
          return {
            valid: false,
            error: 'Only standard dice (d4, d6, d8, d10, d12, d20, d100) are allowed'
          };
        }
        
        return { valid: true };
      },
      
      getDifficultyAssessment: (average, scale) => getDifficultyAssessment(average, scale),
      
      getProbabilityDistribution: (notation) => getProbabilityDistribution(notation),
      
      getVisualizationData: (notation) => getDiceVisualizationData(notation)
    };
  }
  
  // =====================================================================
  // MATH FUNCTIONS FOR COMPLEX FORMULAS
  // =====================================================================
  
  /**
   * Mathematical functions for dice formulas
   */
  export const MATH_FUNCTIONS = {
    floor: {
      fn: Math.floor,
      description: 'Rounds down to the nearest integer'
    },
    ceil: {
      fn: Math.ceil,
      description: 'Rounds up to the nearest integer'
    },
    round: {
      fn: Math.round,
      description: 'Rounds to the nearest integer'
    },
    min: {
      fn: Math.min,
      description: 'Returns the smallest of the provided values'
    },
    max: {
      fn: Math.max,
      description: 'Returns the largest of the provided values'
    },
    abs: {
      fn: Math.abs,
      description: 'Returns the absolute value'
    },
    avg: {
      fn: (...args) => args.reduce((sum, val) => sum + val, 0) / args.length,
      description: 'Returns the average of the provided values'
    },
    sum: {
      fn: (...args) => args.reduce((sum, val) => sum + val, 0),
      description: 'Returns the sum of the provided values'
    },
    pow: {
      fn: Math.pow,
      description: 'Raises the first value to the power of the second value'
    }
  };