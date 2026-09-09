import { DiceRoll, DiceRoller } from '@dice-roller/rpg-dice-roller';

/**
 * Utility functions for handling dice notation and calculations
 */

/**
 * Parses a dice notation string (e.g., "2d6+3", "4d6kh3", "1d20ro<2") into its components
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
    
    if (matches) {
      const count = parseInt(matches[1]);
      const sides = parseInt(matches[2]);
      const modifierString = matches[3] || '+0';
      const modifier = parseInt(modifierString);
      
      return {
        count,
        sides,
        modifier,
        valid: true,
        isFlat: false,
        formula: cleanedString
      };
    }
    
    // Check if it's just a flat number
    const flatNumber = parseInt(cleanedString);
    if (!isNaN(flatNumber) && String(flatNumber) === cleanedString) {
      return {
        count: 0,
        sides: 0,
        modifier: flatNumber,
        valid: true,
        isFlat: true,
        formula: cleanedString
      };
    }
    
    // Advanced RPG Dice Notation (4d6kh3, exploding, compound rolls, math expressions)
    try {
      const roll = new DiceRoll(cleanedString);
      let firstCount = 1;
      let firstSides = 20;
      for (const item of roll.rolls) {
        if (item && item.die) {
          firstCount = item.die.quantity || 1;
          firstSides = item.die.sides || 20;
          break;
        }
      }
      return {
        count: firstCount,
        sides: firstSides,
        modifier: 0,
        valid: true,
        isFlat: false,
        isAdvanced: true,
        formula: cleanedString,
        rollInstance: roll
      };
    } catch (e) {
      return {
        count: 0,
        sides: 0,
        modifier: 0,
        valid: false
      };
    }
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
    if (!dice) {
      return {
        total: 0,
        dice: [],
        modifier: 0,
        valid: false
      };
    }

    if (typeof dice === 'object' && dice.isFlat) {
      return {
        total: dice.modifier || 0,
        dice: [],
        modifier: dice.modifier || 0,
        valid: true
      };
    }

    let formula = '';
    if (typeof dice === 'string') {
      formula = dice.trim();
    } else if (typeof dice === 'object' && dice.valid) {
      if (dice.formula) {
        formula = dice.formula;
      } else {
        formula = `${dice.count}d${dice.sides}${dice.modifier ? (dice.modifier > 0 ? '+' + dice.modifier : dice.modifier) : ''}`;
      }
    }

    if (!formula) {
      return {
        total: 0,
        dice: [],
        modifier: 0,
        valid: false
      };
    }

    const flatNumber = Number(formula);
    if (!isNaN(flatNumber) && String(flatNumber) === formula) {
      return {
        total: flatNumber,
        dice: [],
        modifier: flatNumber,
        valid: true
      };
    }

    try {
      const roll = new DiceRoll(formula);
      const individualDice = [];
      for (const item of roll.rolls) {
        if (item && Array.isArray(item.rolls)) {
          for (const d of item.rolls) {
            if (d && typeof d.value === 'number') {
              individualDice.push(d.value);
            }
          }
        }
      }

      return {
        total: roll.total,
        dice: individualDice,
        modifier: 0,
        breakdown: roll.output,
        valid: true,
        rollInstance: roll
      };
    } catch (err) {
      const diceObj = typeof dice === 'string' ? parseDiceString(dice) : dice;
      if (!diceObj || !diceObj.valid) {
        return { total: 0, dice: [], modifier: 0, valid: false };
      }
      const rolls = [];
      let total = 0;
      for (let i = 0; i < (diceObj.count || 0); i++) {
        const roll = Math.floor(Math.random() * diceObj.sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      total += (diceObj.modifier || 0);
      return { total, dice: rolls, modifier: diceObj.modifier || 0, valid: true };
    }
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
  
  const diceUtils = {
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
    buildDiceWithProc,
    DiceRoll,
    DiceRoller
  };
  export { DiceRoll, DiceRoller };
  export default diceUtils;