/**
 * Dice Calculation Utilities
 * 
 * Comprehensive utilities for dice notation parsing, validation, calculation,
 * and special dice-based effect calculations for the action point-based spell system.
 */

// =====================================================================
// CORE DICE SYSTEM
// =====================================================================

const DICE_TYPES = {
  standard: [4, 6, 8, 10, 12, 20, 100],
  isStandard: (sides) => DICE_TYPES.standard.includes(Number(sides)),
  isValid: (sides) => Number.isInteger(Number(sides)) && Number(sides) >= 2
};

// =====================================================================
// DICE NOTATION PARSING
// =====================================================================

/**
 * Parse dice notation into components
 */
function parseDiceNotation(notation) {
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
function isValidDiceNotation(notation) {
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
// STATISTICAL CALCULATIONS
// =====================================================================

/**
 * Get the minimum possible roll for a dice notation
 */
function getMinRoll(notation) {
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
function getMaxRoll(notation) {
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
function getAverageRoll(notation) {
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

/**
 * Calculate average for complex dice expressions including keep/drop mechanics
 */
function calculateComplexDiceAverage(notation) {
  // If it's a simple notation, use the standard function
  if (!notation.includes('k') && !notation.includes('d') && !notation.includes('(')) {
    return getAverageRoll(notation);
  }
  
  const parsed = parseDiceNotation(notation);
  
  if (!parsed) {
    return null;
  }
  
  // Handle complex expression like (2d6+3)*(1d4+1)
  if (parsed.type === 'complex') {
    return calculateAverageForAST(parsed.ast);
  }
  
  return getAverageRoll(notation);
}

// =====================================================================
// DICE SUGGESTIONS AND DESCRIPTIONS
// =====================================================================

/**
 * Get suggested dice notation based on target average
 */
function getSuggestedDiceNotation(targetAverage, options = {}) {
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
function getDiceDescription(notation, options = {}) {
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
function calculateChainedDamage(baseNotation, options = {}) {
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
function calculateCriticalDamage(baseNotation, options = {}) {
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
function calculateDotDamage(baseNotation, options = {}) {
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
class DiceBuilder {
  constructor(notation) {
    this.notation = notation || '';
    this.reset();
  }
  
  reset() {
    this.count = 0;
    this.sides = 0;
    this.modifier = 0;
    this.keepHighest = null;
    return this;
  }
  
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
  
  dice(count, sides) {
    this.count = count;
    this.sides = sides;
    this.modifier = 0;
    this.keepHighest = null;
    this.notation = `${count}d${sides}`;
    return this;
  }
  
  addDice(count, sides) {
    if (this.notation) {
      this.notation = `${this.notation} + ${count}d${sides}`;
    } else {
      this.notation = `${count}d${sides}`;
    }
    return this;
  }
  
  multiply(factor) {
    if (this.notation) {
      this.notation = `(${this.notation}) * ${factor}`;
    }
    return this;
  }
  
  add(value) {
    if (this.notation) {
      this.notation = `${this.notation} + ${value}`;
    } else {
      this.notation = `${value}`;
    }
    return this;
  }
  
  subtract(value) {
    if (this.notation) {
      this.notation = `${this.notation} - ${value}`;
    } else {
      this.notation = `-${value}`;
    }
    return this;
  }
  
  keepHighestDice(keep) {
    if (this.count && this.sides) {
      this.keepHighest = keep;
      this.notation = `${this.count}d${this.sides}k${keep}${this.modifier !== 0 ? (this.modifier > 0 ? '+' + this.modifier : this.modifier) : ''}`;
    }
    return this;
  }
  
  getNotation() {
    return this.notation;
  }
  
  getAverage() {
    return getAverageRoll(this.notation);
  }
  
  getMinRoll() {
    return getMinRoll(this.notation);
  }
  
  getMaxRoll() {
    return getMaxRoll(this.notation);
  }
  
  getDescription(options = {}) {
    return getDiceDescription(this.notation, options);
  }
  
  getCriticalDamage(options = {}) {
    return calculateCriticalDamage(this.notation, options);
  }
  
  getDotDamage(options = {}) {
    return calculateDotDamage(this.notation, options);
  }
  
  getChainedDamage(options = {}) {
    return calculateChainedDamage(this.notation, options);
  }
}

// =====================================================================
// DICE HELPER UTILITIES
// =====================================================================

const DiceHelpers = {
  /**
   * Format a dice roll value
   */
  formatRoll: (value, options = {}) => {
    const { 
      showSign = false,
      decimals = 0
    } = options;
    
    if (typeof value !== 'number') {
      return 'N/A';
    }
    
    const formatted = value.toFixed(decimals);
    return showSign && value > 0 ? `+${formatted}` : formatted;
  },
  
  /**
   * Get a damage type color based on the type
   */
  getDamageTypeColor: (damageType) => {
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
      chaos: '#FF00FF',
      void: '#000000'
    };
    
    return colors[damageType] || '#FFFFFF';
  },
  
  /**
   * Create a visual dice representation for UI
   */
  createDiceVisual: (notation, options = {}) => {
    const { 
      showValues = true,
      size = 'medium', // 'small', 'medium', 'large'
      colorScheme = 'default' // 'default', 'monochrome', 'colorful'
    } = options;
    
    const parsed = parseDiceNotation(notation);
    
    if (!parsed || parsed.type === 'complex') {
      return {
        html: `<div class="dice-visual dice-complex">${notation}</div>`,
        svg: null,
        cssClasses: ['dice-visual', 'dice-complex']
      };
    }
    
    const sizeClass = `dice-${size}`;
    let diceHtml = '';
    
    // Generate dice elements
    for (let i = 0; i < parsed.count; i++) {
      diceHtml += `<div class="dice d${parsed.sides} ${colorScheme}">${showValues ? `d${parsed.sides}` : ''}</div>`;
    }
    
    // Add modifier if present
    if (parsed.modifier !== 0) {
      diceHtml += `<div class="dice-modifier">${parsed.modifier > 0 ? '+' + parsed.modifier : parsed.modifier}</div>`;
    }
    
    return {
      html: `<div class="dice-visual ${sizeClass}">${diceHtml}</div>`,
      svg: null, // Would generate SVG representation here if needed
      cssClasses: ['dice-visual', sizeClass]
    };
  },
  
  /**
   * Get a difficulty assessment based on an average roll
   */
  getDifficultyAssessment: (average, scale = 'standard') => {
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
  },
  
  /**
   * Format a dice notation for display
   */
  formatDiceNotation: (notation, options = {}) => {
    const {
      useSymbols = false,
      useColors = false,
      customDiceSymbols = {}
    } = options;
    
    if (!notation) return '';
    
    if (useSymbols) {
      // Replace dice notation with symbols
      return notation.replace(/(\d+)d(\d+)/g, (match, count, sides) => {
        const symbol = customDiceSymbols[`d${sides}`] || `d${sides}`;
        return `${count}${symbol}`;
      });
    }
    
    if (useColors) {
      // Colorize the dice notation parts
      return notation.replace(/(\d+)d(\d+)/g, '<span class="dice-count">$1</span><span class="dice-symbol">d</span><span class="dice-sides">$2</span>')
        .replace(/([+-])(\d+)/g, '<span class="dice-modifier-symbol">$1</span><span class="dice-modifier-value">$2</span>');
    }
    
    return notation;
  },
  
  /**
   * Compare two dice notations statistically
   */
  compareDiceNotations: (notation1, notation2) => {
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
  },
  
  /**
   * Convert between different dice systems
   */
  convertDiceSystem: (notation, sourceSystem, targetSystem) => {
    const systems = {
      'd20': { base: 20, scaling: 1 },
      'd100': { base: 100, scaling: 5 },
      'd6pool': { base: 6, scaling: 1/3 }
    };
    
    if (!systems[sourceSystem] || !systems[targetSystem]) {
      return notation;
    }
    
    const source = systems[sourceSystem];
    const target = systems[targetSystem];
    
    const parsed = parseDiceNotation(notation);
    
    if (!parsed || parsed.type === 'complex') {
      return notation;
    }
    
    // Calculate the average
    const average = getAverageRoll(notation);
    
    // Scale to the new system
    const scaleFactor = target.scaling / source.scaling;
    const targetAverage = average * scaleFactor;
    
    // Get a suggested notation for the target system
    const suggestion = getSuggestedDiceNotation(targetAverage, {
      preferStandardDice: true,
      maxDiceCount: 10
    });
    
    return suggestion ? suggestion.notation : notation;
  }
};

// =====================================================================
// DICE CALCULATOR FACTORY
// =====================================================================

/**
 * Create a dice calculator with custom configuration for UI components
 */
function createDiceCalculator(config = {}) {
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
    
    roll: function(notation) {
      // Simple roll simulator for testing
      const parsed = parseDiceNotation(notation);
      
      if (!parsed) {
        return null;
      }
      
      if (parsed.type === 'complex') {
        // For complex expressions, approximate with average +/- 20%
        const avg = getAverageRoll(notation);
        const variance = avg * 0.2;
        return Math.round(avg + (Math.random() * variance * 2 - variance));
      }
      
      const { count, sides, keepHighest, modifier } = parsed;
      
      // Roll the dice
      const rolls = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      
      // Keep highest if specified
      if (keepHighest !== null) {
        rolls.sort((a, b) => b - a);
        rolls.splice(keepHighest);
      }
      
      // Sum the rolls and add modifier
      return rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    },
    
    format: (notation) => DiceHelpers.formatDiceNotation(notation, formatOptions),
    
    describe: (notation, options = {}) => getDiceDescription(notation, options),
    
    suggest: (average, options = {}) => getSuggestedDiceNotation(average, options),
    
    criticalDamage: (notation, options = {}) => calculateCriticalDamage(notation, options),
    
    dotDamage: (notation, options = {}) => calculateDotDamage(notation, options),
    
    chainedDamage: (notation, options = {}) => calculateChainedDamage(notation, options),
    
    compare: (notation1, notation2) => DiceHelpers.compareDiceNotations(notation1, notation2),
    
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
    
    createVisual: (notation, options = {}) => DiceHelpers.createDiceVisual(notation, options),
    
    getDifficultyAssessment: (average, scale) => DiceHelpers.getDifficultyAssessment(average, scale),
    
    convertSystem: (notation, from, to) => includeAdvancedFunctions ? 
      DiceHelpers.convertDiceSystem(notation, from, to) : notation
  };
}

// =====================================================================
// EXPORTS
// =====================================================================

export {
  DICE_TYPES,
  parseDiceNotation,
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  calculateComplexDiceAverage,
  getSuggestedDiceNotation,
  getDiceDescription,
  calculateChainedDamage,
  calculateCriticalDamage,
  calculateDotDamage,
  DiceBuilder,
  DiceHelpers,
  createDiceCalculator
};