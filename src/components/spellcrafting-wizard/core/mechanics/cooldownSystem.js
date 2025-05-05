/**
 * Cooldown Management System
 * 
 * A comprehensive system for tracking and managing spell cooldowns
 * based on the cooldown types defined in cooldownTypes.js
 */

import { COOLDOWN_TYPES, COOLDOWN_MODIFIERS, COOLDOWN_CATEGORIES, CooldownUtils } from '../data/cooldownTypes.js';

// ====================================================
// COOLDOWN STATES - Track the current status of cooldowns
// ====================================================
export const COOLDOWN_STATES = {
  READY: 'ready',           // Spell is available for use
  ON_COOLDOWN: 'cooldown',  // Spell is fully on cooldown
  PARTIAL: 'partial',       // Some charges available (for charge-based)
  CONDITIONAL: 'conditional' // Ready under specific conditions
};

// ====================================================
// COOLDOWN CATEGORY TYPES - For organizing related cooldowns
// ====================================================
export const COOLDOWN_CATEGORY_TYPES = {
  SHARED: 'shared',       // Spells that share cooldowns (can't use any if one is used)
  CATEGORY: 'category',   // Spells of same type with category-based limitations
  GLOBAL: 'global',       // Affects all spell usage (global cooldown)
  INDEPENDENT: 'independent' // No interaction with other cooldowns
};

// Internal cooldown tracking system
const _cooldowns = {
  active: {},           // Currently active cooldowns
  shared: {},           // Shared cooldown groups
  categoryLimits: {},   // Category-based cooldown limitations
  globalCooldown: 0,    // Global cooldown timer
  charges: {},          // Charge-based cooldown tracking
  history: {},          // History of cooldown usage
  turnBased: {},        // Turn-based cooldowns
  shortRest: {},        // Short rest cooldowns
  longRest: {},         // Long rest cooldowns
  realTime: {},         // Real-time cooldowns
  conditional: {},      // Conditional cooldowns 
  diceBased: {},        // Dice-based cooldowns
  encounter: {}         // Encounter cooldowns
};

// ====================================================
// COOLDOWN TRACKING FUNCTIONS
// ====================================================

/**
 * Initialize a cooldown for a spell
 */
export function initializeSpellCooldown(spellId, cooldownTypeId, duration, options = {}) {
  const currentTime = Date.now();
  const cooldownTypeInfo = COOLDOWN_TYPES.find(type => type.id === cooldownTypeId);
  
  if (!cooldownTypeInfo) {
    console.error(`Cooldown type '${cooldownTypeId}' not found`);
    return null;
  }
  
  // Get cooldown category from type
  const cooldownCategoryId = options.category || findCooldownCategory(cooldownTypeId);
  const categoryInfo = cooldownCategoryId ? 
    COOLDOWN_CATEGORIES.find(cat => cat.id === cooldownCategoryId) : null;
  
  // Create the cooldown object
  const cooldown = {
    id: spellId,
    type: cooldownTypeId,
    typeInfo: cooldownTypeInfo,
    baseDuration: duration || cooldownTypeInfo.defaultValue,
    startTime: currentTime,
    category: cooldownCategoryId,
    categoryInfo: categoryInfo,
    tags: options.tags || []
  };
  
  // Store the cooldown
  _cooldowns.active[spellId] = cooldown;
  
  // Handle specific cooldown types
  switch (cooldownTypeId) {
    case 'turn_based':
      _cooldowns.turnBased[spellId] = {
        remainingTurns: duration || cooldownTypeInfo.defaultValue,
        totalTurns: duration || cooldownTypeInfo.defaultValue
      };
      break;
      
    case 'charge_based':
      const maxCharges = options.maxCharges || cooldownTypeInfo.defaultValue;
      if (!_cooldowns.charges[spellId]) {
        _cooldowns.charges[spellId] = {
          current: maxCharges - 1, // Use one charge
          max: maxCharges,
          rechargeTime: currentTime + (duration || cooldownTypeInfo.chargeRegenTime) * 1000,
          rechargeRate: duration || cooldownTypeInfo.chargeRegenTime,
          chargeProgress: 0
        };
      } else {
        _cooldowns.charges[spellId].current = 
          Math.max(0, _cooldowns.charges[spellId].current - 1);
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      const uses = options.uses || cooldownTypeInfo.defaultValue;
      _cooldowns[cooldownTypeId === 'short_rest' ? 'shortRest' : 'longRest'][spellId] = {
        remainingUses: uses - 1,
        maxUses: uses
      };
      break;
      
    case 'real_time':
      _cooldowns.realTime[spellId] = {
        endTime: currentTime + (duration || cooldownTypeInfo.defaultValue) * 1000,
        duration: duration || cooldownTypeInfo.defaultValue
      };
      break;
      
    case 'conditional':
      _cooldowns.conditional[spellId] = {
        condition: options.condition || null,
        conditionDescription: options.conditionDescription || 'Special condition'
      };
      break;
      
    case 'dice_based':
      _cooldowns.diceBased[spellId] = {
        dice: options.dice || cooldownTypeInfo.defaultValue,
        threshold: options.threshold || cooldownTypeInfo.rechargeThreshold,
        isReady: false
      };
      break;
      
    case 'encounter':
      _cooldowns.encounter[spellId] = {
        remainingUses: (options.uses || cooldownTypeInfo.defaultValue) - 1,
        maxUses: options.uses || cooldownTypeInfo.defaultValue
      };
      break;
  }
  
  // Record in history
  if (!_cooldowns.history[spellId]) {
    _cooldowns.history[spellId] = [];
  }
  _cooldowns.history[spellId].push({
    timestamp: currentTime,
    type: cooldownTypeId,
    duration: duration || cooldownTypeInfo.defaultValue
  });

  // Trigger cooldown start event
  onCooldownStart(spellId);
  
  return cooldown;
}

/**
 * Check the remaining cooldown time for a spell
 */
export function checkCooldownRemaining(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) return 0;
  
  const currentTime = Date.now();
  
  switch (cooldown.type) {
    case 'turn_based':
      if (_cooldowns.turnBased[spellId]) {
        return _cooldowns.turnBased[spellId].remainingTurns;
      }
      break;
      
    case 'charge_based':
      if (_cooldowns.charges[spellId]) {
        const charges = _cooldowns.charges[spellId];
        
        // If we have charges, there's no waiting cooldown
        if (charges.current > 0) {
          return 0;
        }
        
        // Otherwise return time until next charge
        return Math.max(0, (charges.rechargeTime - currentTime) / 1000);
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      const restType = cooldown.type === 'short_rest' ? 'shortRest' : 'longRest';
      if (_cooldowns[restType][spellId]) {
        return _cooldowns[restType][spellId].remainingUses <= 0 ? 1 : 0;
      }
      break;
      
    case 'real_time':
      if (_cooldowns.realTime[spellId]) {
        return Math.max(0, (_cooldowns.realTime[spellId].endTime - currentTime) / 1000);
      }
      break;
      
    case 'conditional':
      // For conditional cooldowns, we evaluate the condition
      return evaluateCondition(spellId) ? 0 : 1;
      
    case 'dice_based':
      if (_cooldowns.diceBased[spellId]) {
        return _cooldowns.diceBased[spellId].isReady ? 0 : 1;
      }
      break;
      
    case 'encounter':
      if (_cooldowns.encounter[spellId]) {
        return _cooldowns.encounter[spellId].remainingUses <= 0 ? 1 : 0;
      }
      break;
  }
  
  return 0;
}

/**
 * Check if a spell is currently on cooldown
 */
export function isCooldownActive(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) return false;
  
  switch (cooldown.type) {
    case 'turn_based':
      return _cooldowns.turnBased[spellId]?.remainingTurns > 0;
      
    case 'charge_based':
      return _cooldowns.charges[spellId]?.current === 0;
      
    case 'short_rest':
    case 'long_rest':
      const restType = cooldown.type === 'short_rest' ? 'shortRest' : 'longRest';
      return _cooldowns[restType][spellId]?.remainingUses <= 0;
      
    case 'real_time':
      return Date.now() < _cooldowns.realTime[spellId]?.endTime;
      
    case 'conditional':
      return !evaluateCondition(spellId);
      
    case 'dice_based':
      return !_cooldowns.diceBased[spellId]?.isReady;
      
    case 'encounter':
      return _cooldowns.encounter[spellId]?.remainingUses <= 0;
  }
  
  return false;
}

/**
 * Apply cooldown reduction to a spell
 */
export function reduceCooldown(spellId, amount, options = {}) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) return false;
  
  const currentTime = Date.now();
  let wasReduced = false;
  
  switch (cooldown.type) {
    case 'turn_based':
      if (_cooldowns.turnBased[spellId]) {
        const original = _cooldowns.turnBased[spellId].remainingTurns;
        _cooldowns.turnBased[spellId].remainingTurns = 
          Math.max(0, _cooldowns.turnBased[spellId].remainingTurns - amount);
        
        wasReduced = original !== _cooldowns.turnBased[spellId].remainingTurns;
        
        // Check if cooldown is now complete
        if (_cooldowns.turnBased[spellId].remainingTurns <= 0) {
          delete _cooldowns.turnBased[spellId];
          delete _cooldowns.active[spellId];
          onCooldownEnd(spellId);
        }
      }
      break;
      
    case 'charge_based':
      if (_cooldowns.charges[spellId]) {
        const charges = _cooldowns.charges[spellId];
        if (charges.current < charges.max) {
          // Reduce recharge time
          const originalTime = charges.rechargeTime;
          charges.rechargeTime = Math.max(currentTime, charges.rechargeTime - (amount * 1000));
          
          // Add progress to charge regeneration
          if (options.addProgress) {
            charges.chargeProgress += amount;
            if (charges.chargeProgress >= charges.rechargeRate) {
              addCooldownCharge(spellId);
            }
          }
          
          wasReduced = originalTime !== charges.rechargeTime;
        }
      }
      break;
      
    case 'real_time':
      if (_cooldowns.realTime[spellId]) {
        const originalEnd = _cooldowns.realTime[spellId].endTime;
        _cooldowns.realTime[spellId].endTime = 
          Math.max(currentTime, _cooldowns.realTime[spellId].endTime - (amount * 1000));
        
        wasReduced = originalEnd !== _cooldowns.realTime[spellId].endTime;
        
        // Check if cooldown is now complete
        if (_cooldowns.realTime[spellId].endTime <= currentTime) {
          delete _cooldowns.realTime[spellId];
          delete _cooldowns.active[spellId];
          onCooldownEnd(spellId);
        }
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      // These types typically don't support reduction unless explicitly enabled
      if (options.allowRestReduction) {
        const restType = cooldown.type === 'short_rest' ? 'shortRest' : 'longRest';
        if (_cooldowns[restType][spellId]) {
          const original = _cooldowns[restType][spellId].remainingUses;
          _cooldowns[restType][spellId].remainingUses = 
            Math.min(_cooldowns[restType][spellId].maxUses, _cooldowns[restType][spellId].remainingUses + amount);
          
          wasReduced = original !== _cooldowns[restType][spellId].remainingUses;
        }
      }
      break;
      
    case 'dice_based':
      // Dice-based cooldowns typically would reset on a successful roll
      // but we can force them to become ready
      if (options.forceDiceReady && _cooldowns.diceBased[spellId]) {
        _cooldowns.diceBased[spellId].isReady = true;
        wasReduced = true;
      }
      break;
      
    case 'encounter':
      // These typically don't support reduction unless explicitly enabled
      if (options.allowEncounterReduction) {
        if (_cooldowns.encounter[spellId]) {
          const original = _cooldowns.encounter[spellId].remainingUses;
          _cooldowns.encounter[spellId].remainingUses = 
            Math.min(_cooldowns.encounter[spellId].maxUses, _cooldowns.encounter[spellId].remainingUses + amount);
          
          wasReduced = original !== _cooldowns.encounter[spellId].remainingUses;
        }
      }
      break;
  }
  
  if (wasReduced) {
    onCooldownReduced(spellId, amount);
  }
  
  return wasReduced;
}

/**
 * Force reset a cooldown
 */
export function resetCooldown(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) return false;
  
  switch (cooldown.type) {
    case 'turn_based':
      delete _cooldowns.turnBased[spellId];
      break;
      
    case 'charge_based':
      if (_cooldowns.charges[spellId]) {
        _cooldowns.charges[spellId].current = _cooldowns.charges[spellId].max;
        _cooldowns.charges[spellId].rechargeTime = 0;
        _cooldowns.charges[spellId].chargeProgress = 0;
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      const restType = cooldown.type === 'short_rest' ? 'shortRest' : 'longRest';
      if (_cooldowns[restType][spellId]) {
        _cooldowns[restType][spellId].remainingUses = _cooldowns[restType][spellId].maxUses;
      }
      break;
      
    case 'real_time':
      delete _cooldowns.realTime[spellId];
      break;
      
    case 'conditional':
      // No specific reset for conditional cooldowns
      break;
      
    case 'dice_based':
      if (_cooldowns.diceBased[spellId]) {
        _cooldowns.diceBased[spellId].isReady = true;
      }
      break;
      
    case 'encounter':
      if (_cooldowns.encounter[spellId]) {
        _cooldowns.encounter[spellId].remainingUses = _cooldowns.encounter[spellId].maxUses;
      }
      break;
  }
  
  // Keep the active reference but mark as reset
  cooldown.isReset = true;
  
  // Trigger cooldown end event
  onCooldownEnd(spellId);
  
  return true;
}

/**
 * Reset the cooldown to its full duration
 */
export function refreshCooldown(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) return false;
  
  const currentTime = Date.now();
  
  switch (cooldown.type) {
    case 'turn_based':
      if (_cooldowns.turnBased[spellId]) {
        _cooldowns.turnBased[spellId].remainingTurns = _cooldowns.turnBased[spellId].totalTurns;
      }
      break;
      
    case 'real_time':
      if (_cooldowns.realTime[spellId]) {
        _cooldowns.realTime[spellId].endTime = currentTime + _cooldowns.realTime[spellId].duration * 1000;
      }
      break;
      
    case 'charge_based':
      // For charge-based, refreshing typically means resetting the charge regeneration timer
      if (_cooldowns.charges[spellId]) {
        _cooldowns.charges[spellId].rechargeTime = 
          currentTime + _cooldowns.charges[spellId].rechargeRate * 1000;
        _cooldowns.charges[spellId].chargeProgress = 0;
      }
      break;
      
    case 'dice_based':
      // For dice-based, mark as not ready
      if (_cooldowns.diceBased[spellId]) {
        _cooldowns.diceBased[spellId].isReady = false;
      }
      break;
      
    // For other types, refreshing doesn't make as much sense
    default:
      return false;
  }
  
  // Update cooldown start time
  cooldown.startTime = currentTime;
  
  return true;
}

/**
 * Add a charge to charge-based cooldowns
 */
export function addCooldownCharge(spellId) {
  const cooldown = _cooldowns.active[spellId];
  
  // Only applicable to charge-based cooldowns
  if (!cooldown || cooldown.type !== 'charge_based' || !_cooldowns.charges[spellId]) {
    return false;
  }
  
  const charges = _cooldowns.charges[spellId];
  const currentTime = Date.now();
  
  // Don't exceed max charges
  if (charges.current < charges.max) {
    charges.current += 1;
    
    // If we still have charges to gain, set the next recharge time
    if (charges.current < charges.max) {
      charges.rechargeTime = currentTime + (charges.rechargeRate * 1000);
      charges.chargeProgress = 0;
    } else {
      charges.rechargeTime = 0;
      charges.chargeProgress = 0;
    }
    
    // Trigger charge gained event
    onChargeGained(spellId);
    
    return true;
  }
  
  return false;
}

// ====================================================
// COOLDOWN CALCULATION FUNCTIONS
// ====================================================

/**
 * Calculate the base cooldown for a spell from its properties
 */
export function calculateBaseCooldown(spell) {
  // Base case - use the spell's defined cooldown
  if (!spell || typeof spell.cooldown !== 'number') {
    return 0;
  }
  
  let baseCooldown = spell.cooldown;
  
  // Apply any baseline modifiers from spell properties
  if (spell.cooldownModifiers) {
    if (spell.cooldownModifiers.flat) {
      baseCooldown += spell.cooldownModifiers.flat;
    }
    
    if (spell.cooldownModifiers.percentage) {
      baseCooldown *= (1 + spell.cooldownModifiers.percentage / 100);
    }
  }
  
  // Apply talent-based or equipment-based cooldown reductions
  // This would typically come from a character or talent system
  // baseCooldown = applyTalentModifiers(baseCooldown, spell.id);
  // baseCooldown = applyEquipmentModifiers(baseCooldown, spell.id);
  
  return Math.max(0, baseCooldown); // Ensure non-negative
}

/**
 * Modify cooldown based on haste (reduces cooldown)
 */
export function applyHasteToCooldown(cooldown, hasteValue) {
  if (hasteValue <= 0) {
    return cooldown;
  }
  
  // Haste typically divides the cooldown
  // A haste value of 30% (0.3) would make cooldowns 30% faster
  return cooldown / (1 + hasteValue);
}

/**
 * Apply flat or percentage cooldown reductions
 */
export function applyCooldownReduction(cooldown, reductionValue, isPercentage = false) {
  if (isPercentage) {
    // Percentage reduction (e.g., 20% cooldown reduction)
    return cooldown * (1 - reductionValue / 100);
  } else {
    // Flat reduction (e.g., reduce by 5 seconds)
    return Math.max(0, cooldown - reductionValue);
  }
}

/**
 * Handle calculations for charge-based cooldowns
 */
export function calculateCharges(baseCooldown, maxCharges, rechargeRate = null) {
  return {
    baseCooldown,
    maxCharges: maxCharges || 1,
    rechargeRate: rechargeRate || baseCooldown,
    currentCharges: maxCharges || 1
  };
}

/**
 * Calculate when a cooldown will end
 */
export function predictCooldownEnd(cooldown, currentTime = Date.now()) {
  if (!cooldown) {
    return currentTime;
  }
  
  return cooldown.endTime || currentTime;
}

// ====================================================
// COOLDOWN EVENTS
// ====================================================

/**
 * Triggered when a cooldown begins
 */
export function onCooldownStart(spellId) {
  // Implement any actions that should occur when a cooldown starts
  console.log(`Cooldown started for spell: ${spellId}`);
  
  // This would typically dispatch events to other systems
  // dispatchEvent('cooldown:start', { spellId, timestamp: Date.now() });
}

/**
 * Triggered when a cooldown expires
 */
export function onCooldownEnd(spellId) {
  // Implement any actions that should occur when a cooldown ends
  console.log(`Cooldown ended for spell: ${spellId}`);
  
  // This would typically dispatch events to other systems
  // dispatchEvent('cooldown:end', { spellId, timestamp: Date.now() });
}

/**
 * Triggered when a cooldown is reduced
 */
export function onCooldownReduced(spellId, amount) {
  // Implement any actions that should occur when a cooldown is reduced
  console.log(`Cooldown reduced for spell: ${spellId} by ${amount} seconds`);
  
  // This would typically dispatch events to other systems
  // dispatchEvent('cooldown:reduced', { spellId, amount, timestamp: Date.now() });
}

/**
 * Triggered when a charge is gained for charge-based cooldowns
 */
export function onChargeGained(spellId) {
  // Implement any actions that should occur when a charge is gained
  console.log(`Charge gained for spell: ${spellId}`);
  
  // This would typically dispatch events to other systems
  // dispatchEvent('cooldown:charge_gained', { spellId, timestamp: Date.now() });
}

// ====================================================
// VISUALIZATION UTILITIES
// ====================================================

/**
 * Format cooldown time for display
 */
export function formatCooldownTime(seconds) {
  if (seconds <= 0) {
    return 'Ready';
  }
  
  // For very short cooldowns, show with decimal precision
  if (seconds < 1) {
    return `${(seconds * 10) / 10}s`;
  }
  
  // For cooldowns under a minute
  if (seconds < 60) {
    return `${Math.ceil(seconds)}s`;
  }
  
  // For cooldowns under an hour
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  // For very long cooldowns
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
}

/**
 * Get percentage of cooldown elapsed
 */
export function getCooldownProgressPercentage(spellId) {
  const cooldown = _cooldowns.active[spellId];
  
  if (!cooldown) {
    return 100; // No cooldown = 100% ready
  }
  
  const currentTime = Date.now();
  const totalDuration = cooldown.endTime - cooldown.startTime;
  const elapsed = currentTime - cooldown.startTime;
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

/**
 * Get data for UI representation of cooldown
 */
export function getCooldownVisualState(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown) {
    return {
      id: spellId,
      state: COOLDOWN_STATES.READY,
      remainingTime: 0,
      formattedTime: 'Ready',
      progress: 100,
      isActive: false
    };
  }
  
  const currentTime = Date.now();
  const remainingTime = checkCooldownRemaining(spellId);
  const isActive = isCooldownActive(spellId);
  let state = COOLDOWN_STATES.READY;
  let progress = 100;
  let uiType = cooldown.typeInfo?.uiRepresentation || {};
  let visualData = {};
  
  if (isActive) {
    state = COOLDOWN_STATES.ON_COOLDOWN;
    progress = getCooldownProgressPercentage(spellId);
  }
  
  // Add type-specific UI data
  switch (cooldown.type) {
    case 'turn_based':
      visualData.turns = {
        remaining: _cooldowns.turnBased[spellId]?.remainingTurns || 0,
        total: _cooldowns.turnBased[spellId]?.totalTurns || 0
      };
      break;
      
    case 'charge_based':
      if (_cooldowns.charges[spellId]) {
        visualData.charges = {
          current: _cooldowns.charges[spellId].current,
          max: _cooldowns.charges[spellId].max,
          rechargeProgress: _cooldowns.charges[spellId].chargeProgress,
          rechargeRate: _cooldowns.charges[spellId].rechargeRate
        };
        
        if (visualData.charges.current > 0 && visualData.charges.current < visualData.charges.max) {
          state = COOLDOWN_STATES.PARTIAL;
        }
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      const restType = cooldown.type === 'short_rest' ? 'shortRest' : 'longRest';
      if (_cooldowns[restType][spellId]) {
        visualData.rest = {
          uses: _cooldowns[restType][spellId].remainingUses,
          maxUses: _cooldowns[restType][spellId].maxUses,
          type: cooldown.type.replace('_', ' ')
        };
      }
      break;
      
    case 'real_time':
      if (_cooldowns.realTime[spellId]) {
        visualData.timer = {
          remaining: Math.max(0, (_cooldowns.realTime[spellId].endTime - currentTime) / 1000),
          total: _cooldowns.realTime[spellId].duration
        };
      }
      break;
      
    case 'conditional':
      if (_cooldowns.conditional[spellId]) {
        state = evaluateCondition(spellId) ? COOLDOWN_STATES.READY : COOLDOWN_STATES.CONDITIONAL;
        visualData.condition = {
          description: _cooldowns.conditional[spellId].conditionDescription,
          isMet: evaluateCondition(spellId)
        };
      }
      break;
      
    case 'dice_based':
      if (_cooldowns.diceBased[spellId]) {
        visualData.dice = {
          notation: _cooldowns.diceBased[spellId].dice,
          threshold: _cooldowns.diceBased[spellId].threshold,
          isReady: _cooldowns.diceBased[spellId].isReady
        };
      }
      break;
      
    case 'encounter':
      if (_cooldowns.encounter[spellId]) {
        visualData.encounter = {
          uses: _cooldowns.encounter[spellId].remainingUses,
          maxUses: _cooldowns.encounter[spellId].maxUses
        };
      }
      break;
  }
  
  return {
    id: spellId,
    state,
    remainingTime,
    formattedTime: formatCooldownTime(remainingTime),
    progress,
    isActive,
    type: cooldown.type,
    uiType,
    visualData
  };
}

/**
 * Create detailed tooltip for a cooldown
 */
export function generateCooldownTooltip(spellId) {
  const cooldownState = getCooldownVisualState(spellId);
  const cooldown = _cooldowns.active[spellId];
  
  if (!cooldown) {
    return 'Ready to use';
  }
  
  let tooltipText = '';
  
  // Get cooldown type information
  const typeInfo = cooldown.typeInfo || 
    COOLDOWN_TYPES.find(type => type.id === cooldown.type);
  
  // Add type-specific tooltip content
  switch (cooldown.type) {
    case 'turn_based':
      if (cooldownState.state === COOLDOWN_STATES.READY) {
        tooltipText = 'Ready to use';
      } else {
        tooltipText = `On cooldown: ${cooldownState.visualData.turns.remaining} turns remaining`;
      }
      break;
      
    case 'charge_based':
      if (cooldownState.visualData.charges) {
        tooltipText = `${cooldownState.visualData.charges.current}/${cooldownState.visualData.charges.max} charges available\n`;
        
        if (cooldownState.visualData.charges.current < cooldownState.visualData.charges.max) {
          if (cooldownState.visualData.charges.rechargeProgress > 0) {
            tooltipText += `Charge progress: ${cooldownState.visualData.charges.rechargeProgress}/${cooldownState.visualData.charges.rechargeRate} turns\n`;
          }
          tooltipText += `Next charge in: ${cooldownState.formattedTime}`;
        }
      }
      break;
      
    case 'short_rest':
    case 'long_rest':
      if (cooldownState.visualData.rest) {
        tooltipText = `${cooldownState.visualData.rest.uses}/${cooldownState.visualData.rest.maxUses} uses remaining\n`;
        tooltipText += `Recharges on ${cooldownState.visualData.rest.type}`;
      }
      break;
      
    case 'real_time':
      if (cooldownState.state === COOLDOWN_STATES.READY) {
        tooltipText = 'Ready to use';
      } else if (cooldownState.visualData.timer) {
        tooltipText = `On cooldown: ${cooldownState.formattedTime} remaining`;
      }
      break;
      
    case 'conditional':
      if (cooldownState.visualData.condition) {
        if (cooldownState.visualData.condition.isMet) {
          tooltipText = 'Ready to use';
        } else {
          tooltipText = `Condition required: ${cooldownState.visualData.condition.description}`;
        }
      }
      break;
      
    case 'dice_based':
      if (cooldownState.visualData.dice) {
        if (cooldownState.visualData.dice.isReady) {
          tooltipText = 'Ready to use';
        } else {
          tooltipText = `Requires dice roll (${cooldownState.visualData.dice.notation}) ≥ ${cooldownState.visualData.dice.threshold} to recharge`;
        }
      }
      break;
      
    case 'encounter':
      if (cooldownState.visualData.encounter) {
        tooltipText = `${cooldownState.visualData.encounter.uses}/${cooldownState.visualData.encounter.maxUses} uses remaining\n`;
        tooltipText += 'Recharges after encounter';
      }
      break;
      
    default:
      if (cooldownState.state === COOLDOWN_STATES.READY) {
        tooltipText = 'Ready to use';
      } else {
        tooltipText = `On cooldown: ${cooldownState.formattedTime} remaining`;
      }
  }
  
  // Add cooldown description if available
  if (typeInfo && typeInfo.description) {
    tooltipText += `\n\n${typeInfo.description}`;
  }
  
  // Add cooldown history if relevant
  if (_cooldowns.history[spellId] && _cooldowns.history[spellId].length > 0) {
    const lastUsed = _cooldowns.history[spellId][_cooldowns.history[spellId].length - 1];
    const timeSinceLast = (Date.now() - lastUsed.timestamp) / 1000;
    
    tooltipText += `\n\nLast used: ${formatCooldownTime(timeSinceLast)} ago`;
  }
  
  return tooltipText;
}

// ====================================================
// HELPER FUNCTIONS
// ====================================================

/**
 * Find associated cooldown category for a cooldown type
 */
function findCooldownCategory(cooldownTypeId) {
  // Look for a category that typically applies to this type
  const globalCategory = COOLDOWN_CATEGORIES.find(cat => cat.id === 'global');
  
  // For elemental types or defensive types, try to find matching categories
  // This is just an example - would need to be customized based on actual game mechanics
  return null;
}

/**
 * Evaluate a conditional cooldown
 */
function evaluateCondition(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown || cooldown.type !== 'conditional' || !_cooldowns.conditional[spellId]) {
    return false;
  }
  
  const condition = _cooldowns.conditional[spellId].condition;
  if (!condition) {
    return true; // No condition means it's available
  }
  
  // If condition is a function, execute it with current game state
  if (typeof condition === 'function') {
    return condition(getGameState());
  }
  
  return false;
}

/**
 * Get current game state (would integrate with game state system)
 */
function getGameState() {
  // This would integrate with the game's state management
  // For now, return a simple object
  return {
    currentTime: Date.now(),
    // Other game state properties would go here
  };
}

/**
 * Roll dice for dice-based cooldowns
 */
function rollForCooldown(spellId) {
  const cooldown = _cooldowns.active[spellId];
  if (!cooldown || cooldown.type !== 'dice_based' || !_cooldowns.diceBased[spellId]) {
    return false;
  }
  
  const diceInfo = _cooldowns.diceBased[spellId];
  
  // Use the CooldownUtils to roll dice
  let rollResult = 1;
  
  // If dice notation is valid
  if (typeof diceInfo.dice === 'string') {
    // Assuming CooldownUtils has access to dice rolling functionality
    rollResult = CooldownUtils.calculateActualCooldown(diceInfo.dice, 'dice_based');
  }
  
  // Check if roll meets or exceeds threshold
  const success = rollResult >= diceInfo.threshold;
  
  if (success) {
    // Mark cooldown as ready
    diceInfo.isReady = true;
    return true;
  }
  
  return false;
}

/**
 * Process cooldowns after turn or round
 */
export function processTurnBasedCooldowns() {
  // Process all turn-based cooldowns
  for (const spellId in _cooldowns.turnBased) {
    const turnData = _cooldowns.turnBased[spellId];
    
    // Reduce remaining turns
    turnData.remainingTurns = Math.max(0, turnData.remainingTurns - 1);
    
    // If cooldown has expired, remove it
    if (turnData.remainingTurns <= 0) {
      delete _cooldowns.turnBased[spellId];
      delete _cooldowns.active[spellId];
      onCooldownEnd(spellId);
    }
  }
  
  // Process charge-based cooldowns (add progress)
  for (const spellId in _cooldowns.charges) {
    const chargeData = _cooldowns.charges[spellId];
    const cooldown = _cooldowns.active[spellId];
    
    // Only process if this is a turn-based charge regeneration
    if (cooldown && cooldown.type === 'charge_based' && chargeData.current < chargeData.max) {
      chargeData.chargeProgress += 1;
      
      // If enough progress, add a charge
      if (chargeData.chargeProgress >= chargeData.rechargeRate) {
        addCooldownCharge(spellId);
      }
    }
  }
  
  // Process dice-based cooldowns (roll for recharge)
  for (const spellId in _cooldowns.diceBased) {
    if (!_cooldowns.diceBased[spellId].isReady) {
      rollForCooldown(spellId);
    }
  }
}

// ====================================================
// USAGE EXAMPLES
// ====================================================

/*
// Example: Initialize a basic cooldown
const fireball = initializeSpellCooldown('fireball', COOLDOWN_TYPES.STANDARD, 8);

// Example: Check if a spell is on cooldown
if (!isCooldownActive('fireball')) {
  // Cast the spell...
  initializeSpellCooldown('fireball', COOLDOWN_TYPES.STANDARD, 8);
}

// Example: Charge-based cooldown
const blink = initializeSpellCooldown('blink', COOLDOWN_TYPES.CHARGES, 15);
// Use second charge
if (_cooldowns.charges['blink'].current > 0) {
  _cooldowns.charges['blink'].current -= 1;
}

// Example: Show cooldown in UI
const cooldownVisualData = getCooldownVisualState('fireball');
renderCooldownUI(cooldownVisualData);

// Example: Apply cooldown reduction
reduceCooldown('fireball', 3); // Reduce by 3 seconds
*/

/**
 * Process rest events for cooldowns
 */
export function handleRest(restType) {
  if (!['short', 'long', 'encounter'].includes(restType)) {
    return false;
  }
  
  // Process cooldowns based on rest type
  for (const spellId in _cooldowns.active) {
    const cooldown = _cooldowns.active[spellId];
    if (!cooldown || !cooldown.typeInfo) continue;
    
    const resetsOnRest = cooldown.typeInfo.resetsOnRest;
    
    // Check if this cooldown type resets on this rest type
    const shouldReset = 
      (restType === 'short' && (resetsOnRest === 'short' || resetsOnRest === 'long')) ||
      (restType === 'long' && (resetsOnRest === 'long')) ||
      (restType === 'encounter' && (resetsOnRest === 'encounter'));
    
    if (shouldReset) {
      resetCooldown(spellId);
    } else if (resetsOnRest === 'partial' && restType === 'short') {
      // For partial resets (e.g., gain 1 charge on short rest)
      if (cooldown.type === 'charge_based') {
        addCooldownCharge(spellId);
      }
    }
  }
  
  return true;
}

// Export main API
export default {
  // Core cooldown functions
  initializeSpellCooldown,
  checkCooldownRemaining,
  isCooldownActive,
  reduceCooldown,
  resetCooldown,
  refreshCooldown,
  addCooldownCharge,
  
  // Cooldown management functions
  processTurnBasedCooldowns,
  handleRest,
  
  // Calculation utilities
  calculateBaseCooldown,
  applyHasteToCooldown,
  applyCooldownReduction,
  calculateCharges,
  predictCooldownEnd,
  
  // Visualization utilities
  formatCooldownTime,
  getCooldownProgressPercentage,
  getCooldownVisualState,
  generateCooldownTooltip,
  
  // Constants
  COOLDOWN_STATES,
  COOLDOWN_CATEGORY_TYPES
};