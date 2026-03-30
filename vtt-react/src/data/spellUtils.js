/**
 * Utility functions for spell calculations and formatting
 */

/**
 * Parse a dice string into component parts
 * @param {string} diceString - Dice notation like "2d6+3" or "1d20"
 * @returns {object} The parsed dice information
 */
export const parseDiceString = (diceString) => {
    if (!diceString || diceString.trim() === '') {
      return { valid: false, count: 0, sides: 0, modifier: 0 };
    }
  
    // Check for standard dice notation pattern: XdY+Z or XdY-Z
    const diceRegex = /^(\d+)d(\d+)(?:([-+])(\d+))?$/i;
    const match = diceString.match(diceRegex);
    
    if (!match) {
      return { valid: false, count: 0, sides: 0, modifier: 0 };
    }
    
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    let modifier = 0;
    
    if (match[3] && match[4]) {
      modifier = parseInt(match[4]);
      if (match[3] === '-') {
        modifier = -modifier;
      }
    }
    
    return {
      valid: true,
      count,
      sides,
      modifier
    };
  };
  
  /**
   * Calculate the average result of a dice roll
   * @param {object} parsedDice - The parsed dice object from parseDiceString
   * @returns {number} The average roll result
   */
  export const calculateDiceAverage = (parsedDice) => {
    if (!parsedDice.valid) {
      return 0;
    }
    
    // The average roll of a die is (sides + 1) / 2
    const averageDie = (parsedDice.sides + 1) / 2;
    return (parsedDice.count * averageDie) + parsedDice.modifier;
  };
  
  /**
   * Format a dice string for display
   * @param {string} diceString - The dice notation to format
   * @returns {string} Formatted dice string
   */
  export const formatDiceString = (diceString) => {
    const parsed = parseDiceString(diceString);
    
    if (!parsed.valid) {
      return diceString;
    }
    
    let result = `${parsed.count}d${parsed.sides}`;
    
    if (parsed.modifier > 0) {
      result += `+${parsed.modifier}`;
    } else if (parsed.modifier < 0) {
      result += `${parsed.modifier}`;
    }
    
    return result;
  };
  
  /**
   * Format proc chance for display
   * @param {number} chance - The percentage chance (0-100)
   * @returns {string} Formatted description
   */
  export const formatProcChance = (chance) => {
    if (chance >= 100) {
      return 'Always occurs';
    } else if (chance <= 0) {
      return 'Never occurs';
    }
    
    const diceRange = Math.floor(101 - chance);
    return `Has a ${chance}% chance to occur (d100 roll of ${diceRange}-100)`;
  };
  
  /**
   * Calculate DoT or HoT total damage/healing
   * @param {string} tickDice - The dice for each tick
   * @param {number} duration - Number of ticks
   * @returns {object} Min, max, and average total values
   */
  export const calculateOverTimeEffect = (tickDice, duration) => {
    const parsed = parseDiceString(tickDice);
    
    if (!parsed.valid || duration <= 0) {
      return { min: 0, max: 0, average: 0 };
    }
    
    const minPerTick = parsed.count + parsed.modifier; // Minimum is 1 per die
    const maxPerTick = (parsed.count * parsed.sides) + parsed.modifier;
    const avgPerTick = calculateDiceAverage(parsed);
    
    return {
      min: minPerTick * duration,
      max: maxPerTick * duration,
      average: avgPerTick * duration
    };
  };
  
  /**
   * Calculate spell scaling based on level or attribute
   * @param {object} baseDamage - The base damage object
   * @param {object} scaling - Scaling information
   * @param {number} level - Character level
   * @returns {object} Scaled damage values
   */
  export const calculateScaledDamage = (baseDamage, scaling, level) => {
    if (!baseDamage || !scaling || !level) {
      return baseDamage;
    }
    
    // Simple scaling for demonstration
    // In a real system, this would parse scaling formulas
    const scaledDamage = { ...baseDamage };
    
    if (scaling.type === 'level') {
      // Example: "+1d4 per 2 levels"
      const levelDivider = scaling.perLevel || 1;
      const bonusLevels = Math.floor(level / levelDivider);
      
      if (scaling.bonusDice) {
        const bonusDice = parseDiceString(scaling.bonusDice);
        if (bonusDice.valid) {
          scaledDamage.min += (bonusDice.count * bonusLevels);
          scaledDamage.max += (bonusDice.count * bonusDice.sides * bonusLevels);
          scaledDamage.average += (calculateDiceAverage(bonusDice) * bonusLevels);
        }
      }
      
      if (scaling.flatBonus) {
        const totalBonus = scaling.flatBonus * bonusLevels;
        scaledDamage.min += totalBonus;
        scaledDamage.max += totalBonus;
        scaledDamage.average += totalBonus;
      }
    }
    
    return scaledDamage;
  };
  
  /**
   * Calculate resource cost with scaling
   * @param {object} baseCost - Base resource cost
   * @param {string} scalingType - Type of scaling
   * @param {number} level - Character level
   * @returns {number} The final resource cost
   */
  export const calculateResourceCost = (baseCost, scalingType, level) => {
    if (!baseCost || !baseCost.baseAmount) {
      return 0;
    }
    
    let finalCost = baseCost.baseAmount;
    
    if (scalingType === 'scaling' && baseCost.scalingAmount) {
      const levelCost = baseCost.scalingAmount * (level - 1);
      finalCost += levelCost;
    }
    
    return Math.max(0, Math.round(finalCost));
  };
  
  /**
   * Generate a unique spell ID
   * @param {string} name - Spell name
   * @returns {string} Unique spell ID
   */
  export const generateSpellId = (name) => {
    const cleanName = (name || 'spell').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    
    return `${cleanName}_${timestamp}_${randomStr}`;
  };
  
  /**
   * Convert cooldown to standard format
   * @param {number} value - Cooldown value
   * @param {string} unit - Cooldown unit
   * @returns {object} Standardized cooldown
   */
  export const standardizeCooldown = (value, unit) => {
    if (!value || value <= 0) {
      return { seconds: 0 };
    }
    
    switch (unit) {
      case 'seconds':
        return { seconds: value };
      case 'rounds':
        return { seconds: value * 6 }; // Assuming 6 seconds per round
      case 'minutes':
        return { seconds: value * 60 };
      case 'hours':
        return { seconds: value * 3600 };
      default:
        return { seconds: value };
    }
  };
  
  /**
   * Format cooldown for display
   * @param {object} cooldown - Cooldown information
   * @returns {string} Formatted cooldown string
   */
  export const formatCooldown = (cooldown) => {
    if (!cooldown || cooldown.seconds === 0) {
      return 'No cooldown';
    }
    
    const { seconds } = cooldown;
    
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSecs = seconds % 60;
      return remainingSecs > 0 ? `${minutes}m ${remainingSecs}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };
  
  /**
   * Check if spell is valid and ready to be saved
   * @param {object} spellData - Complete spell data
   * @returns {object} Validation result with status and messages
   */
  export const validateSpell = (spellData) => {
    const errors = [];
    
    // Check required fields
    if (!spellData.name || spellData.name.trim() === '') {
      errors.push('Spell name is required');
    }
    
    if (!spellData.description || spellData.description.trim() === '') {
      errors.push('Spell description is required');
    }
    
    if (!spellData.source) {
      errors.push('Spell source (class or monster) is required');
    } else if (spellData.source === 'class' && !spellData.class) {
      errors.push('Class selection is required for class spells');
    } else if (spellData.source === 'monster' && !spellData.monsterType) {
      errors.push('Monster type is required for monster abilities');
    }
    
    if (!spellData.spellType) {
      errors.push('Spell type is required');
    }
    
    if (!spellData.category) {
      errors.push('Spell category is required');
    }
    
    if (spellData.category === 'damage' && (!spellData.damageTypes || spellData.damageTypes.length === 0)) {
      errors.push('Damage spells require at least one damage type');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Convert stored spell data to game-ready format
   * @param {object} spellData - Raw spell data from form
   * @returns {object} Game-ready spell data
   */
  export const prepareSpellForGame = (spellData) => {
    const gameData = {
      id: spellData.id || generateSpellId(spellData.name),
      name: spellData.name,
      description: spellData.description,
      type: spellData.spellType,
      source: spellData.source,
      sourceDetails: spellData.source === 'class' ? spellData.class : spellData.monsterType,
      category: spellData.category,
      targeting: {
        type: spellData.targetingMode,
        range: spellData.range || 0,
        aoe: spellData.targetingMode === 'aoe' ? {
          shape: spellData.aoeShape,
          size: spellData.aoeSize
        } : null
      },
      castTime: {
        type: spellData.castTimeType,
        value: spellData.castTimeValue || 0,
        channelMax: spellData.channelMaxTime || 0
      },
      cooldown: {
        category: spellData.cooldownCategory,
        value: spellData.cooldownValue || 0,
        unit: spellData.cooldownUnit || 'seconds',
        triggersGCD: spellData.triggersGlobalCooldown
      },
      resources: Object.entries(spellData.resourceCosts || {})
        .filter(([_, cost]) => cost.baseAmount > 0)
        .reduce((acc, [resource, cost]) => {
          acc[resource] = {
            base: cost.baseAmount,
            scaling: cost.scalingFormula || null,
            type: resource === 'health' ? cost.costType || 'flat' : 'flat'
          };
          return acc;
        }, {}),
      effects: {
        damage: spellData.primaryDamage ? {
          dice: spellData.primaryDamage.dice || null,
          flat: spellData.primaryDamage.flat || 0,
          types: spellData.damageTypes || [],
          isDot: spellData.isDot || false,
          dotDuration: spellData.dotDuration || 0,
          dotTick: spellData.dotTick || null,
          procChance: spellData.primaryDamage.procChance || 100
        } : null,
        healing: spellData.healing ? {
          dice: spellData.healing.dice || null,
          flat: spellData.healing.flat || 0,
          isHoT: spellData.healing.isHoT || false,
          hotDuration: spellData.healing.hotDuration || 0,
          hotTick: spellData.healing.hotTick || null
        } : null,
        buffs: spellData.buffs || [],
        debuffs: spellData.debuffs || [],
        triggers: {
          onHit: spellData.onHitTriggers || [],
          onDamage: spellData.onDamageTriggers || []
        },
        auras: spellData.auraEffects || []
      },
      visuals: {
        theme: spellData.visualTheme,
        effect: spellData.visualEffect,
        sound: spellData.soundCategory,
        timing: spellData.animationTiming,
        description: spellData.effectDescription,
        soundDescription: spellData.soundDescription,
        animationDescription: spellData.animationDescription,
        customColors: spellData.useCustomColors ? spellData.customColors : null
      },
      meta: {
        complexity: spellData.complexity || 'intermediate',
        tags: spellData.tags || [],
        interruptible: spellData.interruptible !== false,
        usableWhileMoving: spellData.usableWhileMoving !== false,
        requiresLoS: spellData.requiresLoS !== false,
        hasTravelTime: spellData.hasTravelTime || false,
        projectileSpeed: spellData.projectileSpeed || 0,
        notes: spellData.customNotes || '',
        createdAt: spellData.createdAt || new Date().toISOString()
      }
    };
    
    return gameData;
  };