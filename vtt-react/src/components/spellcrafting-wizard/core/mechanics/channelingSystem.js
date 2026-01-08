// core/mechanics/channelingSystem.js

/**
 * Channeling System
 * 
 * Provides a comprehensive implementation for spells that are maintained over time,
 * including concentration checks, ticking effects, and break handling.
 */

import { POSITIVE_STATUS_EFFECTS, NEGATIVE_STATUS_EFFECTS, isImmuneToStatusEffect } from '../data/statusEffects';
import { DURATION_TYPES, calculateDurationTime } from '../data/durationTypes';
import { EFFECT_TYPES, calculateEffectActionPointCost } from '../data/effectTypes';
import { SPELL_TYPES } from './spellTypeSystem';
import { TURN_PHASES, processTurnStartEffects, processTurnEndEffects } from './turnSequenceSystem';
import { calculateActionPoints, calculateManaCost, applyResourceModifiers } from './resourceManager';
import { rollDice, ROLL_MODES } from './diceSystem';

// ===========================================================================
// CHANNELING MECHANICS CONSTANTS
// ===========================================================================

/**
 * Core channeling mechanics definitions and configuration
 */
export const CHANNELING_MECHANICS = {
  // Concentration checks
  concentration: {
    BASE_CONCENTRATION_DC: 10,
    DAMAGE_DC_MODIFIER: (damage) => Math.max(10, Math.floor(damage / 2)),
    STATUS_EFFECT_MODIFIERS: {
      stunned: { breaks: true, reason: 'Stunned breaks concentration automatically' },
      paralyzed: { breaks: true, reason: 'Paralyzed breaks concentration automatically' },
      unconscious: { breaks: true, reason: 'Unconscious breaks concentration automatically' },
      frightened: { modifier: -2, reason: 'Frightened makes concentration more difficult' },
      poisoned: { modifier: -2, reason: 'Poisoned makes concentration more difficult' },
      silenced: { conditional: (spell) => spell.hasVerbalComponent, reason: 'Silenced breaks verbal spells' }
    },
    ATTRIBUTE_BONUSES: {
      constitution: { formula: (value) => Math.floor((value - 10) / 2) },
      willpower: { formula: (value) => Math.floor((value - 10) / 2) },
      intelligence: { spellCondition: (spell) => spell.school === 'arcane', formula: (value) => Math.floor((value - 14) / 2) }
    }
  },
  
  // Channel ticks
  ticks: {
    TICK_FREQUENCIES: {
      PER_TURN: { id: 'per_turn', name: 'Per Turn', description: 'Effect occurs once on the caster\'s turn' },
      START_OF_TURN: { id: 'start_of_turn', name: 'Start of Turn', description: 'Effect occurs at the start of the caster\'s turn' },
      END_OF_TURN: { id: 'end_of_turn', name: 'End of Turn', description: 'Effect occurs at the end of the caster\'s turn' },
      CONTINUOUS: { id: 'continuous', name: 'Continuous', description: 'Effect is constantly active without distinct ticks' },
      CUSTOM: { id: 'custom', name: 'Custom', description: 'Effect timing is determined by custom events' }
    },
    TICK_SCALING: {
      CONSISTENT: { id: 'consistent', name: 'Consistent', description: 'Same effect magnitude on every tick' },
      INCREASING: { id: 'increasing', name: 'Increasing', description: 'Effect grows stronger with each tick', formula: (base, tick, maxTicks) => base * (1 + (tick * 0.2)) },
      DECREASING: { id: 'decreasing', name: 'Decreasing', description: 'Effect weakens with each tick', formula: (base, tick, maxTicks) => base * (1 - (tick * 0.15)) },
      FLUCTUATING: { id: 'fluctuating', name: 'Fluctuating', description: 'Effect varies based on pattern', formula: (base, tick, maxTicks) => base * (1 + Math.sin(tick / maxTicks * Math.PI) * 0.5) },
      FRONTLOADED: { id: 'frontloaded', name: 'Frontloaded', description: 'Stronger at beginning, weaker later', formula: (base, tick, maxTicks) => base * (1.5 - (tick / maxTicks)) },
      BACKLOADED: { id: 'backloaded', name: 'Backloaded', description: 'Weaker at beginning, stronger later', formula: (base, tick, maxTicks) => base * (0.7 + (tick / maxTicks)) }
    },
    MAX_CHANNEL_DURATION: {
      // By spell level, in turns
      0: 3,
      1: 5,
      2: 8,
      3: 10,
      4: 15,
      5: 20,
      6: 30,
      7: 60,
      8: 120,
      9: 240
    }
  },
  
  // Break effects
  breaks: {
    BREAK_EFFECT_TYPES: {
      NONE: { id: 'none', name: 'None', description: 'Channel simply ends with no additional effects' },
      PARTIAL: { id: 'partial', name: 'Partial', description: 'Partial effect is applied based on channel duration so far' },
      BACKLASH: { id: 'backlash', name: 'Backlash', description: 'Breaking concentration causes negative effects on the caster' },
      CONTROLLABLE: { id: 'controllable', name: 'Controllable', description: 'Caster can control what happens when the channel ends' }
    },
    RESOURCE_REFUND: {
      NONE: { id: 'none', name: 'None', description: 'No resources are refunded when channel breaks' },
      PARTIAL: { id: 'partial', name: 'Partial', description: 'Some resources are refunded based on remaining duration', formula: (cost, elapsed, total) => Math.floor(cost * (1 - (elapsed / total)) * 0.5) },
      FULL: { id: 'full', name: 'Full', description: 'All resources are refunded (rare, special ability)' }
    }
  }
};

// ===========================================================================
// CORE CHANNELING FUNCTIONS
// ===========================================================================

/**
 * Initialize a new channeled spell
 */
export function initializeChannel(spellConfig, casterState) {
  // Validate the spell is channelable
  if (!spellConfig.durationConfig || spellConfig.durationConfig.durationType !== 'concentration') {
    throw new Error('Cannot initialize channel: Spell does not have concentration duration');
  }
  
  // Determine channel duration
  const maxDuration = getMaxChannelDuration(spellConfig.level || 0, casterState);
  const requestedDuration = spellConfig.durationConfig.durationValue || maxDuration;
  const duration = Math.min(maxDuration, requestedDuration);
  
  // Set up scaling configuration
  const scalingType = spellConfig.channelConfig?.scalingType || 'consistent';
  
  // Configure tick frequency
  const tickFrequency = spellConfig.channelConfig?.tickFrequency || 'end_of_turn';
  
  // Configure break effects
  const breakEffectType = spellConfig.channelConfig?.breakEffectType || 'none';
  const resourceRefundType = spellConfig.channelConfig?.resourceRefundType || 'none';
  
  // Track resources used
  const resources = {
    actionPoints: calculateActionPoints(spellConfig),
    mana: calculateManaCost(spellConfig),
    other: spellConfig.resourceOptions || {}
  };

  // Create the channel state object
  const channelState = {
    id: `channel_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    spellId: spellConfig.id,
    spellName: spellConfig.name,
    caster: casterState.id,
    startTime: Date.now(),
    
    // Duration tracking
    maxDuration: duration,
    currentDuration: 0,
    remainingDuration: duration,
    
    // Tick configuration
    tickFrequency,
    ticksProcessed: 0,
    nextTickTime: null,
    
    // Effect scaling
    scalingType,
    baseEffects: extractBaseEffects(spellConfig),
    
    // Break handling
    breakEffectType,
    resourceRefundType,
    
    // Resource tracking
    resources,
    
    // Target tracking
    targets: spellConfig.targetingConfig?.targets || [],
    
    // Status
    active: true,
    requiresConcentrationCheck: false,
    concentrationDC: CHANNELING_MECHANICS.concentration.BASE_CONCENTRATION_DC,
    
    // Spell config reference (for advanced integration)
    spellConfig: { ...spellConfig }
  };
  
  // Initialize next tick time
  channelState.nextTickTime = getChannelTickTiming(channelState, {
    currentTurn: { phase: TURN_PHASES.ACTION },
    currentTimestamp: Date.now()
  });
  
  return channelState;
}

/**
 * Process a channel tick and apply effects
 */
export function processTick(channelState, tickType, gameState) {
  // Skip if channel is not active
  if (!channelState.active) {
    return { processed: false, reason: 'Channel is not active' };
  }
  
  // Check if this is the right type of tick for this channel
  if (channelState.tickFrequency !== tickType && tickType !== 'forced') {
    return { processed: false, reason: 'Wrong tick type' };
  }
  
  // Get the caster state
  const casterState = gameState.entities[channelState.caster];
  
  // Check if caster can maintain channel
  const canMaintain = canMaintainChannel(casterState, channelState);
  if (!canMaintain.can) {
    return breakChannel(channelState, canMaintain.reason, gameState);
  }
  
  // Increment duration and tick counts
  channelState.currentDuration++;
  channelState.remainingDuration--;
  channelState.ticksProcessed++;
  
  // Calculate effects for this tick
  const tickEffects = calculateChannelEffects(
    channelState.baseEffects,
    channelState.ticksProcessed,
    channelState.maxDuration,
    channelState.scalingType
  );
  
  // Apply effects to targets
  const appliedEffects = applyChannelEffects(tickEffects, channelState.targets, gameState);
  
  // Calculate resource drain if any
  const resourceDrain = calculateResourceDrain(channelState, tickType);
  if (resourceDrain) {
    // Apply the resource costs
    applyResourceCosts(casterState, resourceDrain);
  }
  
  // Update next tick time
  channelState.nextTickTime = getChannelTickTiming(channelState, gameState);
  
  // Check if channel should end due to duration
  if (channelState.remainingDuration <= 0) {
    return breakChannel(channelState, 'duration_expired', gameState);
  }
  
  // Return the result of processing the tick
  return {
    processed: true,
    tickNumber: channelState.ticksProcessed,
    effects: appliedEffects,
    resourceDrain,
    remainingDuration: channelState.remainingDuration
  };
}

/**
 * Check if concentration is maintained
 */
export function checkConcentration(channelState, damageAmount, statusEffects = []) {
  // Check for auto-breaking status effects
  for (const status of statusEffects) {
    const effectModifier = CHANNELING_MECHANICS.concentration.STATUS_EFFECT_MODIFIERS[status];
    if (effectModifier && effectModifier.breaks) {
      return {
        maintained: false,
        reason: effectModifier.reason,
        autoFail: true
      };
    }
  }
  
  // Calculate the concentration DC
  let concentrationDC = CHANNELING_MECHANICS.concentration.BASE_CONCENTRATION_DC;
  
  // Adjust DC based on damage
  if (damageAmount > 0) {
    const damageDC = CHANNELING_MECHANICS.concentration.DAMAGE_DC_MODIFIER(damageAmount);
    concentrationDC = Math.max(concentrationDC, damageDC);
  }
  
  // Store the DC for reference
  channelState.concentrationDC = concentrationDC;
  channelState.requiresConcentrationCheck = true;
  
  // This function returns the criteria for the check but doesn't actually perform it
  // The actual roll would be handled when integrating with the game state
  return {
    maintained: true, // Default assumption, actual check comes later
    dc: concentrationDC,
    damageAmount,
    statusEffects
  };
}

/**
 * Handle a channel breaking
 */
export function breakChannel(channelState, breakReason, gameState) {
  // Mark the channel as inactive
  channelState.active = false;
  channelState.breakReason = breakReason;
  channelState.breakTime = Date.now();
  
  let breakEffect = null;
  
  // Handle break effects based on configuration
  switch (channelState.breakEffectType) {
    case 'partial':
      // Apply a partial effect based on how long the channel was maintained
      const completionRatio = channelState.currentDuration / channelState.maxDuration;
      breakEffect = applyPartialBreakEffect(channelState, completionRatio, gameState);
      break;
      
    case 'backlash':
      // Apply negative effects to the caster
      breakEffect = applyBacklashEffect(channelState, breakReason, gameState);
      break;
      
    case 'controllable':
      // Apply controlled break effect (if caster ended voluntarily)
      if (breakReason === 'voluntary') {
        breakEffect = applyControlledBreakEffect(channelState, gameState);
      }
      break;
  }
  
  // Calculate resource refund
  const refund = determineResourceRefund(channelState, breakReason);
  
  // Apply the refund if applicable
  if (refund && refund.amount > 0) {
    const casterState = gameState.entities[channelState.caster];
    applyResourceRefund(casterState, refund);
  }
  
  return {
    broken: true,
    reason: breakReason,
    effect: breakEffect,
    refund
  };
}

/**
 * Calculate effects based on channel progress and scaling type
 */
export function calculateChannelEffects(baseEffects, currentTick, maxTicks, scalingType) {
  // Get the scaling formula for this scaling type
  const scalingConfig = CHANNELING_MECHANICS.ticks.TICK_SCALING[scalingType.toUpperCase()];
  if (!scalingConfig) {
    // Default to consistent if scaling type not found
    return { ...baseEffects };
  }
  
  const scaledEffects = {};
  
  // Apply scaling to each effect
  for (const [effectType, effectValue] of Object.entries(baseEffects)) {
    if (typeof effectValue === 'number') {
      // Apply scaling formula to numeric effects
      scaledEffects[effectType] = scalingConfig.formula(effectValue, currentTick, maxTicks);
    } else if (typeof effectValue === 'string' && effectValue.includes('d')) {
      // Handle dice notation by adjusting the modifier or dice count
      try {
        // Parse the dice notation to adjust
        const match = effectValue.match(/(\d+)d(\d+)([+-]\d+)?/);
        if (match) {
          const diceCount = parseInt(match[1]);
          const diceSides = parseInt(match[2]);
          const modifier = match[3] ? parseInt(match[3]) : 0;
          
          // Scale the dice count or modifier based on the scaling formula
          const scaleFactor = scalingConfig.formula(1, currentTick, maxTicks);
          const scaledCount = Math.max(1, Math.round(diceCount * scaleFactor));
          const scaledModifier = Math.round(modifier * scaleFactor);
          
          scaledEffects[effectType] = `${scaledCount}d${diceSides}${scaledModifier >= 0 ? '+' + scaledModifier : scaledModifier}`;
        } else {
          // Fallback if parsing fails
          scaledEffects[effectType] = effectValue;
        }
      } catch (e) {
        // If dice parsing fails, just use the original value
        scaledEffects[effectType] = effectValue;
      }
    } else {
      // Non-numeric, non-dice effects are copied as-is
      scaledEffects[effectType] = effectValue;
    }
  }
  
  return scaledEffects;
}

/**
 * Calculate resource refund when a channel breaks
 */
export function determineResourceRefund(channelState, breakReason) {
  // Get the refund configuration
  const refundType = channelState.resourceRefundType;
  const refundConfig = CHANNELING_MECHANICS.breaks.RESOURCE_REFUND[refundType.toUpperCase()];
  
  if (!refundConfig) {
    return null;
  }
  
  // For full refunds (rare special cases)
  if (refundType === 'full') {
    return {
      actionPoints: channelState.resources.actionPoints,
      mana: channelState.resources.mana,
      other: { ...channelState.resources.other }
    };
  }
  
  // For partial refunds
  if (refundType === 'partial') {
    const elapsed = channelState.currentDuration;
    const total = channelState.maxDuration;
    
    // Only refund if broken early
    if (elapsed >= total || breakReason === 'duration_expired') {
      return null;
    }
    
    // Calculate refund amounts
    const actionPointRefund = refundConfig.formula(
      channelState.resources.actionPoints,
      elapsed,
      total
    );
    
    const manaRefund = refundConfig.formula(
      channelState.resources.mana,
      elapsed,
      total
    );
    
    return {
      actionPoints: Math.floor(actionPointRefund),
      mana: Math.floor(manaRefund),
      amount: Math.floor(actionPointRefund + manaRefund) // For easy checking
    };
  }
  
  // Default: no refund
  return null;
}

/**
 * Check if caster can continue to maintain the channel
 */
export function canMaintainChannel(casterState, channelState) {
  // Check if caster is still alive
  if (!casterState || casterState.health <= 0) {
    return { can: false, reason: 'caster_dead' };
  }
  
  // Check for disabling effects on the caster
  if (casterState.statusEffects) {
    for (const effect of casterState.statusEffects) {
      const effectModifier = CHANNELING_MECHANICS.concentration.STATUS_EFFECT_MODIFIERS[effect];
      if (effectModifier && effectModifier.breaks) {
        return { can: false, reason: 'disabling_status', statusEffect: effect };
      }
    }
  }
  
  // Check if caster has resources for upkeep if required
  const resourceDrain = calculateResourceDrain(channelState, 'check');
  if (resourceDrain) {
    if (resourceDrain.actionPoints && casterState.actionPoints < resourceDrain.actionPoints) {
      return { can: false, reason: 'insufficient_action_points' };
    }
    
    if (resourceDrain.mana && casterState.mana < resourceDrain.mana) {
      return { can: false, reason: 'insufficient_mana' };
    }
  }
  
  // Check if the caster still meets spell requirements
  // This would be more specific to the game's magic system
  
  return { can: true };
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

/**
 * Calculate maximum possible channel duration
 */
export function getMaxChannelDuration(spellLevel, casterState) {
  // Get base duration from spell level
  const baseDuration = CHANNELING_MECHANICS.ticks.MAX_CHANNEL_DURATION[spellLevel] || 
                    CHANNELING_MECHANICS.ticks.MAX_CHANNEL_DURATION[0];
  
  // Apply caster bonuses from attributes or abilities
  let bonusDuration = 0;
  
  if (casterState) {
    // Example: Add bonus based on mental attributes
    if (casterState.attributes) {
      // Bonus from intelligence (for arcane casters)
      if (casterState.castingType === 'arcane' && casterState.attributes.intelligence) {
        bonusDuration += Math.floor((casterState.attributes.intelligence - 10) / 2);
      }
      
      // Bonus from spirit (for divine casters)
      if (casterState.castingType === 'divine' && casterState.attributes.spirit) {
        bonusDuration += Math.floor((casterState.attributes.spirit - 10) / 2);
      }
    }
    
    // Apply bonuses from talents or abilities
    if (casterState.talents && casterState.talents.includes('extended_concentration')) {
      bonusDuration += 2; // Example: +2 rounds from a talent
    }
  }
  
  return baseDuration + bonusDuration;
}

/**
 * Generate human-readable description of channeling behavior
 */
export function describeChannelingMechanics(channelConfig) {
  const tickFrequency = channelConfig.tickFrequency || 'end_of_turn';
  const scalingType = channelConfig.scalingType || 'consistent';
  const breakEffectType = channelConfig.breakEffectType || 'none';
  const resourceRefundType = channelConfig.resourceRefundType || 'none';
  
  // Get config objects
  const tickFrequencyConfig = CHANNELING_MECHANICS.ticks.TICK_FREQUENCIES[tickFrequency.toUpperCase()];
  const scalingConfig = CHANNELING_MECHANICS.ticks.TICK_SCALING[scalingType.toUpperCase()];
  const breakEffectConfig = CHANNELING_MECHANICS.breaks.BREAK_EFFECT_TYPES[breakEffectType.toUpperCase()];
  const resourceRefundConfig = CHANNELING_MECHANICS.breaks.RESOURCE_REFUND[resourceRefundType.toUpperCase()];
  
  // Build description
  let description = `This channeled spell `;
  
  // Tick frequency
  if (tickFrequencyConfig) {
    description += `activates ${tickFrequencyConfig.description.toLowerCase()}. `;
  } else {
    description += `activates regularly during the channel. `;
  }
  
  // Scaling
  if (scalingConfig) {
    description += `Effects ${scalingConfig.description.toLowerCase()}. `;
  }
  
  // Break effect
  if (breakEffectConfig) {
    description += `If concentration breaks, ${breakEffectConfig.description.toLowerCase()}. `;
  }
  
  // Resource refund
  if (resourceRefundConfig) {
    description += `When the channel ends, ${resourceRefundConfig.description.toLowerCase()}.`;
  }
  
  return description;
}

/**
 * Generate data for UI visualization of channel progress
 */
export function visualizeChannelProgression(channelConfig) {
  // Extract relevant configuration
  const maxDuration = channelConfig.maxDuration || 3;
  const scalingType = channelConfig.scalingType || 'consistent';
  const baseEffects = channelConfig.baseEffects || { damage: 10 };
  
  // Generate data points for visualization
  const dataPoints = [];
  
  for (let tick = 1; tick <= maxDuration; tick++) {
    const effects = calculateChannelEffects(
      baseEffects,
      tick,
      maxDuration,
      scalingType
    );
    
    // Create a data point for this tick
    dataPoints.push({
      tick,
      effects,
      relativeStrength: calculateRelativeStrength(effects, baseEffects)
    });
  }
  
  // Calculate visual properties for the UI
  const visualProperties = {
    scalingTypeName: CHANNELING_MECHANICS.ticks.TICK_SCALING[scalingType.toUpperCase()]?.name || 'Consistent',
    maxEffect: Math.max(...dataPoints.map(dp => dp.relativeStrength)),
    minEffect: Math.min(...dataPoints.map(dp => dp.relativeStrength)),
    trendDescription: getTrendDescription(scalingType),
    colorGradient: getColorGradientForScaling(scalingType)
  };
  
  return {
    dataPoints,
    visualProperties
  };
}

/**
 * Calculate when the next channel tick will occur
 */
export function getChannelTickTiming(channelConfig, gameState) {
  const tickFrequency = channelConfig.tickFrequency || 'end_of_turn';
  
  // For real-time systems with timestamps
  if (gameState.currentTimestamp) {
    switch (tickFrequency) {
      case 'continuous':
        // Continuous effects don't have ticks
        return null;
        
      case 'per_turn':
      case 'start_of_turn':
      case 'end_of_turn':
        // Calculate next turn time based on game state
        // This will depend on the game's turn timing system
        return gameState.estimatedNextTurnTime;
        
      case 'custom':
        // For custom ticks, the game state would need to provide the timing
        return gameState.customTickTime || null;
        
      default:
        // Default to next game update
        return gameState.currentTimestamp + gameState.updateInterval;
    }
  }
  
  // For turn-based systems
  if (gameState.currentTurn) {
    const currentTurn = gameState.currentTurn;
    
    switch (tickFrequency) {
      case 'start_of_turn':
        if (currentTurn.phase === TURN_PHASES.START) {
          // Current phase is already start of turn, so next tick is next turn
          return { turnIndex: currentTurn.index + 1, phase: TURN_PHASES.START };
        }
        // Otherwise, next tick is start of next turn
        return { turnIndex: currentTurn.index + 1, phase: TURN_PHASES.START };
        
      case 'end_of_turn':
        if (currentTurn.phase === TURN_PHASES.END) {
          // Current phase is already end of turn, so next tick is end of next turn
          return { turnIndex: currentTurn.index + 1, phase: TURN_PHASES.END };
        }
        // Current phase is before end of turn, so next tick is end of current turn
        return { turnIndex: currentTurn.index, phase: TURN_PHASES.END };
        
      case 'per_turn':
        // Ticks once per turn (typically during action phase)
        return { turnIndex: currentTurn.index + 1, phase: TURN_PHASES.ACTION };
        
      default:
        // Default to end of current turn
        return { turnIndex: currentTurn.index, phase: TURN_PHASES.END };
    }
  }
  
  // Fallback for unknown game state format
  return null;
}

/**
 * Get all currently channeled effects for a caster
 */
export function listActiveChanneledEffects(casterState) {
  if (!casterState.channeledSpells || !Array.isArray(casterState.channeledSpells)) {
    return [];
  }
  
  // Filter out inactive channels
  const activeChannels = casterState.channeledSpells.filter(channel => channel.active);
  
  // Format into a useful structure
  return activeChannels.map(channel => ({
    id: channel.id,
    spellName: channel.spellName,
    spellId: channel.spellId,
    currentDuration: channel.currentDuration,
    remainingDuration: channel.remainingDuration,
    ticksProcessed: channel.ticksProcessed,
    nextTickTime: channel.nextTickTime,
    targets: channel.targets,
    baseEffects: channel.baseEffects,
    requiresConcentrationCheck: channel.requiresConcentrationCheck,
    concentrationDC: channel.concentrationDC
  }));
}

/**
 * Modify an ongoing channel (extend/reduce duration, change effects)
 */
export function modifyChannelParameters(channelState, modifications) {
  // Create a copy of the channel state to modify
  const modifiedState = { ...channelState };
  
  // Apply duration modifications
  if (modifications.durationChange) {
    modifiedState.remainingDuration += modifications.durationChange;
    modifiedState.maxDuration += modifications.durationChange;
  }
  
  // Set absolute duration (overrides relative change)
  if (modifications.newDuration !== undefined) {
    modifiedState.remainingDuration = modifications.newDuration;
    modifiedState.maxDuration = modifiedState.currentDuration + modifications.newDuration;
  }
  
  // Apply effect strength modifications
  if (modifications.effectModifiers) {
    modifiedState.baseEffects = { ...modifiedState.baseEffects };
    
    for (const [effectType, modifier] of Object.entries(modifications.effectModifiers)) {
      if (modifiedState.baseEffects[effectType] !== undefined) {
        // If the effect is a number, apply the modifier directly
        if (typeof modifiedState.baseEffects[effectType] === 'number') {
          modifiedState.baseEffects[effectType] *= modifier;
        }
        // If the effect is a dice notation, try to modify it
        else if (typeof modifiedState.baseEffects[effectType] === 'string' && 
                modifiedState.baseEffects[effectType].includes('d')) {
          // This would need a more robust dice notation parser
          // For now, we'll just note that it would modify the dice
          console.log(`Would modify dice notation: ${modifiedState.baseEffects[effectType]} with multiplier ${modifier}`);
        }
      }
    }
  }
  
  // Replace base effects entirely
  if (modifications.newBaseEffects) {
    modifiedState.baseEffects = { ...modifications.newBaseEffects };
  }
  
  // Change scaling type
  if (modifications.newScalingType) {
    modifiedState.scalingType = modifications.newScalingType;
  }
  
  // Change tick frequency
  if (modifications.newTickFrequency) {
    modifiedState.tickFrequency = modifications.newTickFrequency;
  }
  
  // Update targets
  if (modifications.newTargets) {
    modifiedState.targets = [...modifications.newTargets];
  }
  
  // Add targets
  if (modifications.addTargets) {
    modifiedState.targets = [...modifiedState.targets, ...modifications.addTargets];
  }
  
  // Remove targets
  if (modifications.removeTargets) {
    modifiedState.targets = modifiedState.targets.filter(
      target => !modifications.removeTargets.includes(target)
    );
  }
  
  return modifiedState;
}

// ===========================================================================
// INTEGRATION WITH OTHER SYSTEMS
// ===========================================================================

/**
 * Ensure channel ticks align with turn sequence
 */
export function synchronizeWithTurnSequence(channelState, turnState) {
  // Skip if channel is not active
  if (!channelState.active) {
    return channelState;
  }
  
  const tickFrequency = channelState.tickFrequency;
  const currentPhase = turnState.phase;
  const isChannelerTurn = turnState.characterId === channelState.caster;
  
  // Determine if this turn phase should trigger a tick
  let shouldTick = false;
  
  if (isChannelerTurn) {
    switch (tickFrequency) {
      case 'start_of_turn':
        shouldTick = currentPhase === TURN_PHASES.START;
        break;
        
      case 'end_of_turn':
        shouldTick = currentPhase === TURN_PHASES.END;
        break;
        
      case 'per_turn':
        shouldTick = currentPhase === TURN_PHASES.ACTION;
        break;
        
      case 'continuous':
        // Continuous effects apply throughout the turn
        // No specific tick, but might need to update effects
        break;
    }
  }
  
  // Update the next tick time based on turn state
  const updatedState = { ...channelState };
  updatedState.nextTickTime = getChannelTickTiming({ tickFrequency }, { currentTurn: turnState });
  
  return {
    channelState: updatedState,
    shouldTick,
    tickType: tickFrequency
  };
}

/**
 * Apply all bonuses to concentration checks
 */
export function applyConcentrationModifiers(baseCheck, casterState) {
  let totalModifier = 0;
  
  // Apply attribute bonuses
  if (casterState.attributes) {
    // Constitution bonus (primary for concentration)
    if (casterState.attributes.constitution) {
      const conBonus = CHANNELING_MECHANICS.concentration.ATTRIBUTE_BONUSES.constitution.formula(
        casterState.attributes.constitution
      );
      totalModifier += conBonus;
    }
    
    // Willpower bonus (if applicable)
    if (casterState.attributes.willpower) {
      const willBonus = CHANNELING_MECHANICS.concentration.ATTRIBUTE_BONUSES.willpower.formula(
        casterState.attributes.willpower
      );
      totalModifier += willBonus;
    }
    
    // Intelligence bonus (for arcane casters)
    if (casterState.castingType === 'arcane' && casterState.attributes.intelligence) {
      const intBonus = CHANNELING_MECHANICS.concentration.ATTRIBUTE_BONUSES.intelligence.formula(
        casterState.attributes.intelligence
      );
      totalModifier += intBonus;
    }
  }
  
  // Apply status effect modifiers
  if (casterState.statusEffects) {
    for (const effect of casterState.statusEffects) {
      const statusModifier = CHANNELING_MECHANICS.concentration.STATUS_EFFECT_MODIFIERS[effect];
      if (statusModifier && statusModifier.modifier) {
        totalModifier += statusModifier.modifier;
      }
    }
  }
  
  // Apply skill proficiency (if applicable)
  if (casterState.skills && casterState.skills.concentration) {
    totalModifier += casterState.skills.concentration;
  }
  
  // Apply talent bonuses
  if (casterState.talents) {
    if (casterState.talents.includes('concentration_master')) {
      totalModifier += 2;
    }
    if (casterState.talents.includes('unbreakable_focus')) {
      totalModifier += 3;
    }
  }
  
  // Apply temporary bonuses
  if (casterState.temporaryBonuses && casterState.temporaryBonuses.concentration) {
    totalModifier += casterState.temporaryBonuses.concentration;
  }
  
  // Return the modified check
  return {
    ...baseCheck,
    modifier: totalModifier,
    totalDC: baseCheck.dc,
    effectiveBonus: totalModifier
  };
}

/**
 * Handle interaction with status effects
 */
export function integrateWithStatusEffects(channelState, statusState) {
  // Status effects can modify the channel in several ways:
  // 1. Break concentration
  // 2. Modify effect strength
  // 3. Change duration
  
  const modifications = {};
  const breakingEffects = [];
  
  // Check for breaking effects
  for (const effect of statusState.effects) {
    const effectModifier = CHANNELING_MECHANICS.concentration.STATUS_EFFECT_MODIFIERS[effect.id];
    
    if (effectModifier) {
      if (effectModifier.breaks) {
        breakingEffects.push({
          effect: effect.id,
          reason: effectModifier.reason
        });
      } else if (effectModifier.modifier) {
        // This would be applied in concentration checks
      }
    }
    
    // Check for effects that modify channel behavior
    switch (effect.id) {
      case 'empowered':
        // Example: Empowered increases effect strength
        modifications.effectModifiers = {
          damage: 1.2,
          healing: 1.2
        };
        break;
        
      case 'extended_duration':
        // Example: Extended Duration increases remaining duration
        modifications.durationChange = 2;
        break;
        
      case 'weakened':
        // Example: Weakened decreases effect strength
        modifications.effectModifiers = {
          damage: 0.7,
          healing: 0.7
        };
        break;
        
      case 'unstable_magic':
        // Example: Unstable Magic changes scaling type
        modifications.newScalingType = 'fluctuating';
        break;
    }
  }
  
  return {
    shouldBreak: breakingEffects.length > 0,
    breakingEffects,
    modifications,
    modifiedState: Object.keys(modifications).length > 0 ? 
                   modifyChannelParameters(channelState, modifications) : 
                   channelState
  };
}

/**
 * Calculate ongoing resource costs for maintained channels
 */
export function calculateResourceDrain(channelState, tickType) {
  // Skip if no resource drain is configured
  if (!channelState.spellConfig.resourceOptions || !channelState.spellConfig.resourceOptions.upkeep) {
    return null;
  }
  
  const upkeepConfig = channelState.spellConfig.resourceOptions.upkeep;
  
  // Different tick types might have different resource costs
  switch (tickType) {
    case 'start_of_turn':
      return upkeepConfig.startOfTurn || null;
      
    case 'end_of_turn':
      return upkeepConfig.endOfTurn || null;
      
    case 'per_turn':
      return upkeepConfig.perTurn || null;
      
    case 'continuous':
      // For continuous effects, might drain resources over time
      // Could be calculated based on time passed
      return upkeepConfig.continuous || null;
      
    case 'check':
      // Just checking if resources would be sufficient
      // Return the highest possible upkeep cost
      const costs = [
        upkeepConfig.startOfTurn,
        upkeepConfig.endOfTurn, 
        upkeepConfig.perTurn,
        upkeepConfig.continuous
      ].filter(cost => cost);
      
      if (costs.length === 0) {
        return null;
      }
      
      // Find the highest action point and mana costs
      const maxAP = Math.max(...costs.map(cost => cost.actionPoints || 0));
      const maxMana = Math.max(...costs.map(cost => cost.mana || 0));
      
      return {
        actionPoints: maxAP,
        mana: maxMana
      };
  }
  
  return null;
}

// ===========================================================================
// HELPER FUNCTIONS
// ===========================================================================

/**
 * Extract base effects from spell configuration
 */
function extractBaseEffects(spellConfig) {
  const baseEffects = {};
  
  // Extract damage effects
  if (spellConfig.damageConfig) {
    baseEffects.damage = spellConfig.damageConfig.diceNotation || 
                      spellConfig.damageConfig.damageAmount || 0;
    baseEffects.damageType = spellConfig.damageConfig.damageType;
  }
  
  // Extract healing effects
  if (spellConfig.healingConfig) {
    baseEffects.healing = spellConfig.healingConfig.diceNotation || 
                       spellConfig.healingConfig.healingAmount || 0;
  }
  
  // Extract status effect application
  if (spellConfig.statusConfig) {
    baseEffects.statusEffects = spellConfig.statusConfig.effects || [];
    baseEffects.statusDuration = spellConfig.statusConfig.duration || 1;
    baseEffects.statusPotency = spellConfig.statusConfig.potency || 1;
  }
  
  // Extract other custom effects
  if (spellConfig.channelConfig && spellConfig.channelConfig.customEffects) {
    Object.assign(baseEffects, spellConfig.channelConfig.customEffects);
  }
  
  return baseEffects;
}

/**
 * Apply channel effects to targets
 */
function applyChannelEffects(effects, targets, gameState) {
  // This would integrate with the game's effect system
  const appliedEffects = [];
  
  // Process each target
  for (const targetId of targets) {
    const target = gameState.entities[targetId];
    
    if (!target) {
      appliedEffects.push({
        targetId,
        success: false,
        reason: 'target_not_found'
      });
      continue;
    }
    
    // Apply damage effects
    if (effects.damage) {
      let damageAmount;
      
      // Handle dice notation
      if (typeof effects.damage === 'string' && effects.damage.includes('d')) {
        // Roll the dice
        const damageRoll = rollDice(effects.damage);
        damageAmount = damageRoll.total;
      } else {
        damageAmount = effects.damage;
      }
      
      const damageResult = applyDamageToTarget(target, damageAmount, effects.damageType);
      
      appliedEffects.push({
        targetId,
        type: 'damage',
        amount: damageResult.finalDamage,
        damageType: effects.damageType,
        success: true
      });
    }
    
    // Apply healing effects
    if (effects.healing) {
      let healingAmount;
      
      // Handle dice notation
      if (typeof effects.healing === 'string' && effects.healing.includes('d')) {
        // Roll the dice
        const healingRoll = rollDice(effects.healing);
        healingAmount = healingRoll.total;
      } else {
        healingAmount = effects.healing;
      }
      
      const healingResult = applyHealingToTarget(target, healingAmount);
      
      appliedEffects.push({
        targetId,
        type: 'healing',
        amount: healingResult.finalHealing,
        success: true
      });
    }
    
    // Apply status effects
    if (effects.statusEffects && effects.statusEffects.length > 0) {
      for (const statusEffect of effects.statusEffects) {
        const statusResult = applyStatusEffectToTarget(
          target, 
          statusEffect, 
          effects.statusDuration, 
          effects.statusPotency
        );
        
        appliedEffects.push({
          targetId,
          type: 'status',
          statusEffect,
          duration: effects.statusDuration,
          potency: effects.statusPotency,
          success: statusResult.success,
          reason: statusResult.reason
        });
      }
    }
  }
  
  return appliedEffects;
}

/**
 * Apply damage to a target
 */
function applyDamageToTarget(target, amount, damageType) {
  // This would integrate with the game's damage system
  return { finalDamage: amount };
}

/**
 * Apply healing to a target
 */
function applyHealingToTarget(target, amount) {
  // This would integrate with the game's healing system
  return { finalHealing: amount };
}

/**
 * Apply a status effect to a target
 */
function applyStatusEffectToTarget(target, statusEffect, duration, potency) {
  // This would integrate with the game's status effect system
  return { success: true };
}

/**
 * Apply resource costs to a caster
 */
function applyResourceCosts(casterState, costs) {
  // This would integrate with the game's resource system
  if (costs.actionPoints) {
    casterState.actionPoints = Math.max(0, casterState.actionPoints - costs.actionPoints);
  }
  
  if (costs.mana) {
    casterState.mana = Math.max(0, casterState.mana - costs.mana);
  }
}

/**
 * Apply resource refund to a caster
 */
function applyResourceRefund(casterState, refund) {
  // This would integrate with the game's resource system
  if (refund.actionPoints) {
    casterState.actionPoints += refund.actionPoints;
  }
  
  if (refund.mana) {
    casterState.mana += refund.mana;
  }
}

/**
 * Apply partial break effect when channel ends early
 */
function applyPartialBreakEffect(channelState, completionRatio, gameState) {
  // Calculate reduced effects based on how long the channel lasted
  const partialEffects = {};
  
  for (const [effectType, effectValue] of Object.entries(channelState.baseEffects)) {
    if (typeof effectValue === 'number') {
      partialEffects[effectType] = effectValue * completionRatio;
    } else if (typeof effectValue === 'string' && effectValue.includes('d')) {
      // For dice notation, attempt to adjust
      try {
        const match = effectValue.match(/(\d+)d(\d+)([+-]\d+)?/);
        if (match) {
          const diceCount = parseInt(match[1]);
          const diceSides = parseInt(match[2]);
          const modifier = match[3] ? parseInt(match[3]) : 0;
          
          const adjustedCount = Math.max(1, Math.round(diceCount * completionRatio));
          const adjustedModifier = Math.round(modifier * completionRatio);
          
          partialEffects[effectType] = `${adjustedCount}d${diceSides}${adjustedModifier >= 0 ? '+' + adjustedModifier : adjustedModifier}`;
        } else {
          partialEffects[effectType] = effectValue;
        }
      } catch (e) {
        partialEffects[effectType] = effectValue;
      }
    } else {
      partialEffects[effectType] = effectValue;
    }
  }
  
  // Apply the partial effects
  return applyChannelEffects(partialEffects, channelState.targets, gameState);
}

/**
 * Apply backlash effect when channel breaks
 */
function applyBacklashEffect(channelState, breakReason, gameState) {
  // No backlash for voluntary breaks
  if (breakReason === 'voluntary') {
    return null;
  }
  
  // Get the caster
  const caster = gameState.entities[channelState.caster];
  
  if (!caster) {
    return null;
  }
  
  // Define backlash effects based on spell power and break reason
  let backlashEffects = {};
  
  // Calculate spell power
  const spellPower = estimateSpellPower(channelState.baseEffects);
  
  // Different backlash based on break reason
  switch (breakReason) {
    case 'disabling_status':
      // Mental shock from being disabled while channeling
      backlashEffects.damage = Math.floor(spellPower * 0.3);
      backlashEffects.damageType = 'psychic';
      break;
      
    case 'interrupted':
      // Energy backlash from spell interruption
      backlashEffects.damage = Math.floor(spellPower * 0.2);
      backlashEffects.damageType = 'arcane';
      backlashEffects.statusEffects = ['dazed'];
      backlashEffects.statusDuration = 1;
      break;
      
    case 'concentration_failed':
      // Loss of control from failed concentration
      backlashEffects.damage = Math.floor(spellPower * 0.1);
      backlashEffects.damageType = 'force';
      break;
      
    default:
      // Generic minor backlash
      backlashEffects.damage = Math.floor(spellPower * 0.1);
      backlashEffects.damageType = 'arcane';
  }
  
  // Apply the backlash effects to the caster
  return applyChannelEffects(backlashEffects, [channelState.caster], gameState);
}

/**
 * Apply controlled break effect when channel ends voluntarily
 */
function applyControlledBreakEffect(channelState, gameState) {
  // Check if the spell has a defined controlled break effect
  if (!channelState.spellConfig.channelConfig || !channelState.spellConfig.channelConfig.controlledBreakEffect) {
    return null;
  }
  
  const breakEffectConfig = channelState.spellConfig.channelConfig.controlledBreakEffect;
  
  // Apply the controlled break effect
  return applyChannelEffects(breakEffectConfig, channelState.targets, gameState);
}

/**
 * Estimate spell power from its effects
 */
function estimateSpellPower(effects) {
  let totalPower = 0;
  
  // Sum up contributions from different effect types
  if (effects.damage) {
    if (typeof effects.damage === 'number') {
      totalPower += effects.damage;
    } else if (typeof effects.damage === 'string' && effects.damage.includes('d')) {
      // Estimate average damage from dice notation
      const match = effects.damage.match(/(\d+)d(\d+)([+-]\d+)?/);
      if (match) {
        const diceCount = parseInt(match[1]);
        const diceSides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;
        
        // Average value of a die is (sides + 1) / 2
        totalPower += diceCount * ((diceSides + 1) / 2) + modifier;
      }
    }
  }
  
  if (effects.healing) {
    if (typeof effects.healing === 'number') {
      totalPower += effects.healing;
    } else if (typeof effects.healing === 'string' && effects.healing.includes('d')) {
      // Estimate average healing from dice notation
      const match = effects.healing.match(/(\d+)d(\d+)([+-]\d+)?/);
      if (match) {
        const diceCount = parseInt(match[1]);
        const diceSides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;
        
        totalPower += diceCount * ((diceSides + 1) / 2) + modifier;
      }
    }
  }
  
  // Status effects contribute to power
  if (effects.statusEffects && effects.statusEffects.length > 0) {
    totalPower += effects.statusEffects.length * 5;
    
    if (effects.statusPotency) {
      totalPower += effects.statusPotency * 2;
    }
  }
  
  return totalPower;
}

/**
 * Calculate relative strength compared to base effects
 */
function calculateRelativeStrength(effects, baseEffects) {
  // For simplicity, we'll focus on damage or healing as the primary measure
  if (effects.damage && baseEffects.damage) {
    if (typeof effects.damage === 'number' && typeof baseEffects.damage === 'number') {
      return effects.damage / baseEffects.damage;
    }
  }
  
  if (effects.healing && baseEffects.healing) {
    if (typeof effects.healing === 'number' && typeof baseEffects.healing === 'number') {
      return effects.healing / baseEffects.healing;
    }
  }
  
  // Default to 1.0 (same strength)
  return 1.0;
}

/**
 * Get trend description for scaling type
 */
function getTrendDescription(scalingType) {
  switch (scalingType.toLowerCase()) {
    case 'increasing':
      return 'Effect grows stronger over time';
      
    case 'decreasing':
      return 'Effect weakens over time';
      
    case 'fluctuating':
      return 'Effect strength fluctuates in a wave pattern';
      
    case 'frontloaded':
      return 'Effect is strongest at the beginning';
      
    case 'backloaded':
      return 'Effect is strongest at the end';
      
    case 'consistent':
    default:
      return 'Effect maintains consistent strength';
  }
}

/**
 * Get color gradient for visualization based on scaling type
 */
function getColorGradientForScaling(scalingType) {
  switch (scalingType.toLowerCase()) {
    case 'increasing':
      return ['#87CEFA', '#4169E1', '#0000CD', '#00008B']; // Light to dark blue
      
    case 'decreasing':
      return ['#00008B', '#0000CD', '#4169E1', '#87CEFA']; // Dark to light blue
      
    case 'fluctuating':
      return ['#4169E1', '#9370DB', '#4169E1', '#9370DB']; // Blue and purple alternating
      
    case 'frontloaded':
      return ['#FF0000', '#FF4500', '#FFA500', '#FFFF00']; // Red to yellow
      
    case 'backloaded':
      return ['#FFFF00', '#FFA500', '#FF4500', '#FF0000']; // Yellow to red
      
    case 'consistent':
    default:
      return ['#4CAF50', '#4CAF50', '#4CAF50', '#4CAF50']; // Consistent green
  }
}