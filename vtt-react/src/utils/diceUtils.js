/**
 * Utility functions for handling dice notation and calculations
 */

/**
 * Parses a dice notation string (e.g., "2d6+3") into its components
 * 
 * @param {string} diceString - The dice notation string to parse
 * @returns {Object} Parsed dice components
 */
export const parseDiceString = (diceString) => {
    if (!diceString || typeof diceString !== 'string') {
      return {
        count: 0,
        sides: 0,
        modifier: 0,
        valid: false
      };
    }
    
    // Standardize string format (remove spaces, lowercase)
    const cleanedString = diceString.toLowerCase().replace(/\s/g, '');
    
    // Match common dice patterns
    // Groups: 1 = count, 2 = sides, 3 = modifier with sign
    const dicePattern = /^(\d+)d(\d+)(?:([-+]\d+))?$/;
    const matches = cleanedString.match(dicePattern);
    
    if (!matches) {
      // Check if it's just a flat number
      const flatNumber = parseInt(cleanedString);
      if (!isNaN(flatNumber)) {
        return {
          count: 0,
          sides: 0,
          modifier: flatNumber,
          valid: true,
          isFlat: true
        };
      }
      
      return {
        count: 0,
        sides: 0,
        modifier: 0,
        valid: false
      };
    }
    
    const count = parseInt(matches[1]);
    const sides = parseInt(matches[2]);
    const modifierString = matches[3] || '+0';
    const modifier = parseInt(modifierString);
    
    return {
      count,
      sides,
      modifier,
      valid: true,
      isFlat: false
    };
  };
  
  /**
   * Calculates the average result of a dice roll
   * 
   * @param {Object|string} dice - Dice object or dice string
   * @returns {number} Average result
   */
  export const calculateDiceAverage = (dice) => {
    const diceObj = typeof dice === 'string' ? parseDiceString(dice) : dice;
    
    if (!diceObj.valid) {
      return 0;
    }
    
    if (diceObj.isFlat) {
      return diceObj.modifier;
    }
    
    // Average of a die is (sides + 1) / 2
    const dieAverage = (diceObj.sides + 1) / 2;
    return (diceObj.count * dieAverage) + diceObj.modifier;
  };
  
  /**
   * Calculates the minimum result of a dice roll
   * 
   * @param {Object|string} dice - Dice object or dice string
   * @returns {number} Minimum result
   */
  export const calculateDiceMinimum = (dice) => {
    const diceObj = typeof dice === 'string' ? parseDiceString(dice) : dice;
    
    if (!diceObj.valid) {
      return 0;
    }
    
    if (diceObj.isFlat) {
      return diceObj.modifier;
    }
    
    return diceObj.count + diceObj.modifier;
  };
  
  /**
   * Calculates the maximum result of a dice roll
   * 
   * @param {Object|string} dice - Dice object or dice string
   * @returns {number} Maximum result
   */
  export const calculateDiceMaximum = (dice) => {
    const diceObj = typeof dice === 'string' ? parseDiceString(dice) : dice;
    
    if (!diceObj.valid) {
      return 0;
    }
    
    if (diceObj.isFlat) {
      return diceObj.modifier;
    }
    
    return (diceObj.count * diceObj.sides) + diceObj.modifier;
  };
  
  /**
   * Adds scaling to a dice string based on a level or other factor
   * 
   * @param {string} baseFormula - Base dice formula
   * @param {string} scalingFormula - Formula for how dice scales per level
   * @param {number} level - Level or other scaling factor
   * @returns {string} Scaled dice formula
   */
  export const applyScaling = (baseFormula, scalingFormula, level) => {
    if (!baseFormula || !scalingFormula || level <= 0) {
      return baseFormula || '';
    }
    
    const baseObj = parseDiceString(baseFormula);
    const scalingObj = parseDiceString(scalingFormula);
    
    if (!baseObj.valid || !scalingObj.valid) {
      return baseFormula;
    }
    
    // Scale each component
    const scaledCount = baseObj.count + (scalingObj.count * level);
    const scaledModifier = baseObj.modifier + (scalingObj.modifier * level);
    
    // Return scaled formula
    let result = '';
    
    if (scaledCount > 0) {
      result = `${scaledCount}d${baseObj.sides}`;
    }
    
    if (scaledModifier !== 0) {
      const sign = scaledModifier > 0 ? '+' : '';
      result += `${sign}${scaledModifier}`;
    }
    
    return result || '0';
  };
  
  /**
   * Simulates rolling dice
   * 
   * @param {Object|string} dice - Dice object or dice string
   * @returns {Object} Roll result with total and individual dice
   */
  export const rollDice = (dice) => {
    const diceObj = typeof dice === 'string' ? parseDiceString(dice) : dice;
    
    if (!diceObj.valid) {
      return {
        total: 0,
        dice: [],
        modifier: 0,
        valid: false
      };
    }
    
    if (diceObj.isFlat) {
      return {
        total: diceObj.modifier,
        dice: [],
        modifier: diceObj.modifier,
        valid: true
      };
    }
    
    const rolls = [];
    let total = 0;
    
    // Roll each die
    for (let i = 0; i < diceObj.count; i++) {
      const roll = Math.floor(Math.random() * diceObj.sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    // Add modifier
    total += diceObj.modifier;
    
    return {
      total,
      dice: rolls,
      modifier: diceObj.modifier,
      valid: true
    };
  };
  
  /**
   * Formats a parsed dice object back into a string
   * 
   * @param {Object} diceObj - Parsed dice object
   * @returns {string} Formatted dice string
   */
  export const formatDiceString = (diceObj) => {
    if (!diceObj || !diceObj.valid) {
      return '0';
    }
    
    if (diceObj.isFlat) {
      return diceObj.modifier.toString();
    }
    
    let result = `${diceObj.count}d${diceObj.sides}`;
    
    if (diceObj.modifier !== 0) {
      const sign = diceObj.modifier > 0 ? '+' : '';
      result += `${sign}${diceObj.modifier}`;
    }
    
    return result;
  };
  
  /**
   * Parses a proc chance dice notation (e.g., "d10:9-10" for 20% chance)
   * 
   * @param {string} procString - The proc notation to parse
   * @returns {Object} Parsed proc data
   */
  export const parseProcString = (procString) => {
    if (!procString || typeof procString !== 'string') {
      return {
        dice: 'd100',
        threshold: 100,
        chance: 100,
        valid: false
      };
    }
    
    // Clean string
    const cleaned = procString.toLowerCase().replace(/\s/g, '');
    
    // Match proc pattern: d{sides}:{threshold} or d{sides}:{min}-{max}
    const singlePattern = /^d(\d+):(\d+)$/;
    const rangePattern = /^d(\d+):(\d+)-(\d+)$/;
    
    let sides = 0;
    let minThreshold = 0;
    let maxThreshold = 0;
    
    const singleMatch = cleaned.match(singlePattern);
    const rangeMatch = cleaned.match(rangePattern);
    
    if (singleMatch) {
      sides = parseInt(singleMatch[1]);
      minThreshold = parseInt(singleMatch[2]);
      maxThreshold = minThreshold;
    } else if (rangeMatch) {
      sides = parseInt(rangeMatch[1]);
      minThreshold = parseInt(rangeMatch[2]);
      maxThreshold = parseInt(rangeMatch[3]);
    } else {
      // Try to parse as just a percentage
      const percentMatch = cleaned.match(/^(\d+)%$/);
      
      if (percentMatch) {
        const percent = parseInt(percentMatch[1]);
        return {
          dice: 'd100',
          sides: 100,
          minThreshold: 100 - percent + 1,
          maxThreshold: 100,
          chance: percent,
          valid: true
        };
      }
      
      // If all else fails, try parsing as a flat number (assume percentage)
      const flatPercent = parseInt(cleaned);
      if (!isNaN(flatPercent)) {
        return {
          dice: 'd100',
          sides: 100,
          minThreshold: 100 - flatPercent + 1,
          maxThreshold: 100,
          chance: flatPercent,
          valid: true
        };
      }
      
      return {
        dice: 'd100',
        sides: 100,
        minThreshold: 100,
        maxThreshold: 100,
        chance: 100,
        valid: false
      };
    }
    
    // Calculate chance percentage
    const successCases = maxThreshold - minThreshold + 1;
    const chance = (successCases / sides) * 100;
    
    return {
      dice: `d${sides}`,
      sides,
      minThreshold,
      maxThreshold,
      chance,
      valid: true
    };
  };
  
  /**
   * Formats a proc chance into a display string
   * 
   * @param {number} chance - Percentage chance (0-100)
   * @returns {string} Formatted string with dice notation
   */
  export const formatProcChance = (chance) => {
    if (typeof chance !== 'number' || chance <= 0 || chance > 100) {
      return '100% chance';
    }
    
    if (chance === 100) {
      return '100% chance';
    }
    
    // For even percentages, use d100
    if (chance % 1 === 0) {
      const threshold = 100 - chance + 1;
      return `${chance}% chance [roll d100: ${threshold}-100=proc]`;
    }
    
    // For other percentages, find a die that can represent it accurately
    const commonDice = [4, 6, 8, 10, 12, 20, 100];
    
    for (const sides of commonDice) {
      const exactSides = 100 / chance;
      
      if (exactSides === sides || (sides % exactSides === 0)) {
        const threshold = sides - Math.floor((chance / 100) * sides) + 1;
        return `${chance}% chance [roll d${sides}: ${threshold}-${sides}=proc]`;
      }
    }
    
    // Default to d100
    const threshold = Math.ceil(100 - chance + 1);
    return `${chance}% chance [roll d100: ${threshold}-100=proc]`;
  };
  
  /**
   * Simulates a proc chance roll
   * 
   * @param {number} chance - Percentage chance (0-100)
   * @returns {boolean} Whether the proc triggered
   */
  export const rollProc = (chance) => {
    if (typeof chance !== 'number' || chance <= 0) {
      return false;
    }
    
    if (chance >= 100) {
      return true;
    }
    
    const roll = Math.random() * 100;
    return roll < chance;
  };
  
  /**
   * Builds a complete dice string with proc chance
   * 
   * @param {string} diceFormula - Base dice formula (e.g., "2d6+3")
   * @param {number} procChance - Chance for the effect to trigger (0-100)
   * @returns {string} Formatted string with dice and proc
   */
  export const buildDiceWithProc = (diceFormula, procChance) => {
    if (!diceFormula) {
      return '';
    }
    
    if (!procChance || procChance >= 100) {
      return diceFormula;
    }
    
    const procString = formatProcChance(procChance);
    return `${diceFormula} (${procString})`;
  };
  
  export default {
    parseDiceString,
    calculateDiceAverage,
    calculateDiceMinimum,
    calculateDiceMaximum,
    applyScaling,
    rollDice,
    formatDiceString,
    parseProcString,
    formatProcChance,
    rollProc,
    buildDiceWithProc
  };