// core/mechanics/castTimeSystem.js

import { getDurationTypeById } from '../data/durationTypes';
import { getEffectTypeById } from '../data/effectTypes';
import { findStatusEffectById } from '../data/statusEffects';
import { SPELL_TYPES } from './spellTypeSystem';
import { TURN_PHASES, calculateTurnsRemaining, getNextTurnFor, isSameTurn } from './turnSequenceSystem';
import { calculateActionPoints } from './resourceManager';
import { DiceBuilder } from './diceSystem';

/**
 * Cast Time System
 * 
 * Handles mechanics for spells that require casting time, including:
 * - Managing different types of cast times (immediate, next turn, X turns)
 * - Handling spell interruptions
 * - Calculating partial effects when casting is interrupted
 * - Integration with turn sequences and resource management
 */

// =====================================================================
// CAST TIME MECHANICS DEFINITION
// =====================================================================

export const CAST_TIME_MECHANICS = {
  // Cast time types
  CAST_TIME_TYPES: {
    IMMEDIATE: {
      id: 'IMMEDIATE',
      name: 'Immediate',
      description: 'Completes on the current turn',
      turnDelay: 0,
      phaseToComplete: TURN_PHASES.ACTION,
      interruptionRisk: 'none',
      actionPointModifier: 0
    },
    NEXT_TURN: {
      id: 'NEXT_TURN',
      name: 'Next Turn',
      description: 'Completes at the start of caster\'s next turn',
      turnDelay: 1,
      phaseToComplete: TURN_PHASES.START,
      interruptionRisk: 'high',
      actionPointModifier: -1
    },
    X_TURNS: {
      id: 'X_TURNS',
      name: 'Multiple Turns',
      description: 'Requires X full turns to complete',
      turnDelay: 'variable',
      phaseToComplete: TURN_PHASES.START,
      interruptionRisk: 'very_high',
      actionPointModifier: -2
    },
    END_OF_ROUND: {
      id: 'END_OF_ROUND',
      name: 'End of Round',
      description: 'Completes at the end of the current round',
      turnDelay: 'variable',
      phaseToComplete: TURN_PHASES.END,
      interruptionRisk: 'high',
      actionPointModifier: -1
    },
    REAL_TIME: {
      id: 'REAL_TIME',
      name: 'Real Time',
      description: 'Based on real time rather than turns',
      turnDelay: 'not_applicable',
      phaseToComplete: 'any',
      interruptionRisk: 'medium',
      actionPointModifier: 0
    }
  },

  // Interruption mechanics
  INTERRUPTION_TYPES: {
    DAMAGE: {
      id: 'DAMAGE',
      name: 'Damage',
      description: 'Taking damage may interrupt casting (with save)',
      saveDC: 'damage_based',
      defaultSave: 'constitution',
      baseChance: 50
    },
    STATUS: {
      id: 'STATUS',
      name: 'Status Effect',
      description: 'Certain status effects automatically interrupt',
      automaticInterruption: true,
      interruptingStatuses: ['stunned', 'paralyzed', 'silenced', 'confused', 'feared', 'charmed']
    },
    MOVEMENT: {
      id: 'MOVEMENT',
      name: 'Movement',
      description: 'Moving may interrupt (depends on spell)',
      interruptionRules: 'spell_defined',
      defaultInterruptionChance: 100,
      exemptMovementTypes: ['forced', 'teleport']
    },
    CONCENTRATION_BREAK: {
      id: 'CONCENTRATION_BREAK',
      name: 'Concentration Break',
      description: 'Failed concentration check interrupts',
      usesConcentrationMechanics: true,
      concentrationAttribute: 'wisdom'
    }
  },

  // Save mechanics for avoiding interruption
  SAVE_MECHANICS: {
    DC_CALCULATION: {
      damage: (damage, spellLevel) => {
        return Math.max(10, Math.floor(damage / 2) + 10);
      },
      status: (statusEffect, spellLevel) => {
        const effect = findStatusEffectById(statusEffect, false);
        return effect ? 10 + (effect.actionPointCost * 2) : 15;
      },
      movement: (distance, spellLevel) => {
        return 10 + Math.floor(distance / 5);
      },
      concentration: (source, magnitude, spellLevel) => {
        return Math.max(10, magnitude + 10);
      }
    },
    ATTRIBUTE_BONUSES: {
      damage: ['constitution', 'wisdom'],
      status: ['wisdom', 'charisma'],
      movement: ['dexterity', 'wisdom'],
      concentration: ['wisdom', 'intelligence']
    },
    SPELL_LEVEL_FACTORS: {
      baseBonusPerLevel: 1,
      maxLevelBonus: 5,
      selfControlledSpells: true
    }
  },

  // Conditions that prevent interruption
  INTERRUPTION_IMMUNITY: {
    STATUSES: ['uninterruptible', 'iron_will', 'perfect_concentration'],
    ITEM_EFFECTS: ['amulet_of_focus', 'gloves_of_stability', 'rune_of_protection'],
    CLASS_FEATURES: {
      'war_caster': 'advantage_on_concentration',
      'battle_mage': 'immunity_to_damage_interruption',
      'mental_fortress': 'immunity_to_mental_interruption'
    },
    SPELL_SPECIFIC: 'defined_in_spell_config'
  },

  // Partial casting effects
  COMPLETION_THRESHOLDS: {
    NONE: 0,
    MINOR: 33,
    MODERATE: 66,
    MAJOR: 90,
    COMPLETE: 100
  },
  
  EFFECT_SCALING: {
    damage: (baseDamage, completionPercentage) => {
      return Math.floor(baseDamage * (completionPercentage / 100));
    },
    healing: (baseHealing, completionPercentage) => {
      return Math.floor(baseHealing * (completionPercentage / 100));
    },
    duration: (baseDuration, completionPercentage) => {
      return Math.max(1, Math.floor(baseDuration * (completionPercentage / 100)));
    },
    area: (baseArea, completionPercentage) => {
      return Math.max(5, Math.floor(baseArea * (completionPercentage / 100)));
    }
  },

  RESOURCE_REFUND: {
    action_points: (originalCost, completionPercentage) => {
      if (completionPercentage < 10) return originalCost;
      if (completionPercentage < 33) return Math.ceil(originalCost * 0.75);
      if (completionPercentage < 66) return Math.ceil(originalCost * 0.5);
      if (completionPercentage < 90) return Math.ceil(originalCost * 0.25);
      return 0;
    },
    mana: (originalCost, completionPercentage) => {
      if (completionPercentage < 10) return originalCost;
      if (completionPercentage < 33) return Math.ceil(originalCost * 0.66);
      if (completionPercentage < 66) return Math.ceil(originalCost * 0.33);
      return 0;
    },
    cooldown_modification: (originalCooldown, completionPercentage) => {
      if (completionPercentage < 33) return Math.ceil(originalCooldown * 0.5);
      if (completionPercentage < 66) return Math.ceil(originalCooldown * 0.75);
      return originalCooldown;
    }
  },

  // Cast time modifiers
  HASTE_EFFECTS: {
    status_effects: {
      'haste': 0.5, // 50% reduction
      'quickened': 0.25, // 25% reduction
      'time_warp': 0.75 // 75% reduction
    },
    class_features: {
      'rapid_casting': 0.2,
      'battle_trance': 0.3,
      'magical_efficiency': 0.15
    },
    item_effects: {
      'chronos_shard': 0.2,
      'quickening_rune': 0.3,
      'time_warping_focus': 0.25
    }
  },

  SLOW_EFFECTS: {
    status_effects: {
      'slowed': 1.5, // 50% increase
      'encumbered': 1.25, // 25% increase
      'time_locked': 2.0 // 100% increase
    },
    environmental_effects: {
      'magical_interference': 1.2,
      'gravitational_anomaly': 1.3,
      'temporal_distortion': 1.5
    }
  },

  ENVIRONMENT_FACTORS: {
    'ley_line': 0.8, // 20% reduction
    'dead_magic_zone': 1.5, // 50% increase
    'chaos_zone': 'random', // Random between 0.5 and 1.5
    'elemental_harmony': (spellElementType) => {
      // Returns 0.8 if spell element matches environment
      return spellElementType ? 0.8 : 1.0;
    }
  },

  ITEM_BONUSES: {
    'casting_rod': 0.9,
    'focus_crystal': 0.85,
    'spell_thread_gloves': 0.9,
    'arcane_catalyst': (spellLevel) => {
      return Math.max(0.7, 1.0 - (spellLevel * 0.05));
    }
  }
};

// =====================================================================
// CORE CAST TIME FUNCTIONS
// =====================================================================

export function initiateCasting(spellConfig, casterState) {
  // Get the cast time type
  const castTimeType = spellConfig.castTimeType || CAST_TIME_MECHANICS.CAST_TIME_TYPES.IMMEDIATE;
  
  // Calculate base cast time in turns
  let castTimeTurns = 0;
  if (castTimeType.id === 'X_TURNS') {
    castTimeTurns = spellConfig.castTime || 1;
  } else if (castTimeType.id === 'NEXT_TURN') {
    castTimeTurns = 1;
  }
  
  // Apply cast time modifiers
  const modifiedCastTime = applyCastTimeModifiers(castTimeTurns, castTimeType, spellConfig, casterState);
  
  // Create the cast state object
  const castState = {
    spellId: spellConfig.id,
    spellConfig: spellConfig,
    casterId: casterState.id,
    casterState: { ...casterState },
    castTimeType: castTimeType.id,
    originalCastTime: castTimeTurns,
    modifiedCastTime: modifiedCastTime,
    progress: 0,
    progressPercentage: 0,
    startTurn: casterState.currentTurn,
    completionTurn: estimateCastCompletion(
      { castTimeType: castTimeType.id, modifiedCastTime }, 
      casterState.currentTurn
    ),
    interruptionResistance: calculateInterruptionResistance(spellConfig, casterState),
    resourcesCommitted: {
      actionPoints: calculateActionPoints(spellConfig),
      mana: spellConfig.manaCost || 0,
      otherResources: spellConfig.resourceCosts || {}
    },
    visualEffects: spellConfig.castingVisuals || [],
    status: 'casting',
    interruptible: spellConfig.interruptible !== false
  };
  
  // Commit resources if needed
  if (spellConfig.commitResourcesOnStart) {
    // Resource commitment would be handled here
    // This would call out to the resource manager
  }
  
  return castState;
}

export function progressCastTime(castState, turnData) {
  // Don't progress if already completed or interrupted
  if (castState.status !== 'casting') {
    return castState;
  }

  // Make a copy to avoid mutating the original
  const updatedCastState = { ...castState };
  
  // Handle different cast time types
  switch (castState.castTimeType) {
    case 'IMMEDIATE':
      // Immediate spells are completed in the same turn
      updatedCastState.progress = updatedCastState.modifiedCastTime;
      updatedCastState.progressPercentage = 100;
      updatedCastState.status = 'ready_to_complete';
      break;
      
    case 'NEXT_TURN':
      // Check if this is the caster's next turn
      if (isSameTurn(turnData, updatedCastState.completionTurn)) {
        updatedCastState.progress = updatedCastState.modifiedCastTime;
        updatedCastState.progressPercentage = 100;
        updatedCastState.status = 'ready_to_complete';
      } else {
        // Not completed yet
        updateProgressPercentage(updatedCastState, turnData);
      }
      break;
      
    case 'X_TURNS':
      // Update progress based on turns passed
      const turnsRemaining = calculateTurnsRemaining(
        updatedCastState.modifiedCastTime, 
        updatedCastState.startTurn, 
        turnData
      );
      
      const turnsPassed = updatedCastState.modifiedCastTime - turnsRemaining;
      updatedCastState.progress = turnsPassed;
      
      // Calculate percentage
      updatedCastState.progressPercentage = Math.min(
        100, 
        Math.floor((turnsPassed / updatedCastState.modifiedCastTime) * 100)
      );
      
      // Check if casting is complete
      if (turnsRemaining <= 0) {
        updatedCastState.status = 'ready_to_complete';
        updatedCastState.progressPercentage = 100;
      }
      break;
      
    case 'END_OF_ROUND':
      // Check if this is the end of the round
      if (turnData.phase === TURN_PHASES.END && turnData.isLastInRound) {
        updatedCastState.progress = updatedCastState.modifiedCastTime;
        updatedCastState.progressPercentage = 100;
        updatedCastState.status = 'ready_to_complete';
      } else {
        // Calculate percentage based on position in round
        updateProgressPercentage(updatedCastState, turnData);
      }
      break;
      
    case 'REAL_TIME':
      // For real-time casting, check elapsed time
      const elapsedMs = Date.now() - updatedCastState.startTimeMs;
      const totalMs = updatedCastState.modifiedCastTime * 1000; // Convert to ms
      
      updatedCastState.progress = elapsedMs / 1000; // Convert to seconds
      updatedCastState.progressPercentage = Math.min(100, Math.floor((elapsedMs / totalMs) * 100));
      
      if (elapsedMs >= totalMs) {
        updatedCastState.status = 'ready_to_complete';
      }
      break;
  }
  
  return updatedCastState;
}

export function checkInterruption(castState, interruptionType, magnitude) {
  // Don't check interruption if not interruptible or already completed
  if (!castState.interruptible || castState.status !== 'casting') {
    return { interrupted: false, reason: 'not_interruptible_or_not_casting' };
  }
  
  // Make sure interruptionType is valid
  if (!CAST_TIME_MECHANICS.INTERRUPTION_TYPES[interruptionType]) {
    return { interrupted: false, reason: 'invalid_interruption_type' };
  }
  
  // Check for immunity
  if (hasInterruptionImmunity(castState, interruptionType)) {
    return { interrupted: false, reason: 'interruption_immunity' };
  }
  
  // Handle different interruption types
  switch (interruptionType) {
    case 'DAMAGE':
      const damageDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.damage(magnitude, castState.spellConfig.level);
      return checkSaveVsInterruption(castState, 'damage', damageDC, magnitude);
      
    case 'STATUS':
      // Some status effects automatically interrupt
      if (CAST_TIME_MECHANICS.INTERRUPTION_TYPES.STATUS.interruptingStatuses.includes(magnitude)) {
        return { 
          interrupted: true, 
          reason: `status_effect_${magnitude}`,
          save: { automatic: true, required: false } 
        };
      }
      const statusDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.status(magnitude, castState.spellConfig.level);
      return checkSaveVsInterruption(castState, 'status', statusDC, magnitude);
      
    case 'MOVEMENT':
      // Some spells are automatically interrupted by movement
      if (castState.spellConfig.interruptedByMovement) {
        // Check if this movement type is exempt
        if (CAST_TIME_MECHANICS.INTERRUPTION_TYPES.MOVEMENT.exemptMovementTypes.includes(magnitude)) {
          return { interrupted: false, reason: 'exempt_movement_type' };
        }
        return { 
          interrupted: true, 
          reason: 'movement',
          save: { automatic: true, required: false } 
        };
      }
      // Otherwise, use movement DC
      const movementDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.movement(magnitude, castState.spellConfig.level);
      return checkSaveVsInterruption(castState, 'movement', movementDC, magnitude);
      
    case 'CONCENTRATION_BREAK':
      const concentrationDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.concentration(
        magnitude.source || 'unknown',
        magnitude.value || 10,
        castState.spellConfig.level
      );
      return checkSaveVsInterruption(castState, 'concentration', concentrationDC, magnitude);
  }
  
  return { interrupted: false, reason: 'unhandled_interruption_type' };
}

export function completeCasting(castState, gameState) {
  // Ensure casting is ready to complete
  if (castState.status !== 'ready_to_complete') {
    return {
      completed: false,
      reason: `invalid_status_${castState.status}`
    };
  }
  
  // Create result object
  const result = {
    completed: true,
    castState: castState,
    spell: castState.spellConfig,
    caster: gameState.entities[castState.casterId],
    effects: [],
    resourcesConsumed: {},
    timeToComplete: castState.progress
  };
  
  // Add effects based on spell config
  for (const effectType of castState.spellConfig.effectTypes || []) {
    const effect = getEffectTypeById(effectType);
    if (effect) {
      result.effects.push({
        type: effectType,
        targets: resolveTargets(castState.spellConfig, gameState),
        magnitude: 100, // Full magnitude
        data: castState.spellConfig[`${effectType}Config`] || {}
      });
    }
  }
  
  // Consume resources if not already committed
  if (!castState.spellConfig.commitResourcesOnStart) {
    result.resourcesConsumed = {
      actionPoints: castState.resourcesCommitted.actionPoints,
      mana: castState.resourcesCommitted.mana,
      otherResources: castState.resourcesCommitted.otherResources
    };
  }
  
  // Update the cast state
  const updatedCastState = {
    ...castState,
    status: 'completed',
    completionTime: gameState.currentTime,
    finalEffects: result.effects
  };
  
  return {
    ...result,
    castState: updatedCastState
  };
}

export function handleInterruption(castState, interruptionReason, gameState) {
  // Create a copy to avoid mutation
  const updatedCastState = {
    ...castState,
    status: 'interrupted',
    interruptedBy: interruptionReason,
    interruptionTime: gameState.currentTime
  };
  
  // Calculate completion percentage
  const completionPercentage = updatedCastState.progressPercentage || 0;
  
  // Determine partial effects
  const partialEffects = [];
  if (completionPercentage > 0 && castState.spellConfig.allowPartialEffects) {
    for (const effectType of castState.spellConfig.effectTypes || []) {
      const partialEffect = calculatePartialEffect(
        {
          type: effectType,
          config: castState.spellConfig[`${effectType}Config`] || {}
        },
        completionPercentage
      );
      
      if (partialEffect) {
        partialEffects.push({
          type: effectType,
          targets: resolveTargets(castState.spellConfig, gameState),
          magnitude: partialEffect.magnitude,
          data: partialEffect.data
        });
      }
    }
  }
  
  // Calculate resource refund
  const refund = determineResourceRefund(castState, interruptionReason);
  
  // Update cooldown if applicable
  let cooldownModification = null;
  if (castState.spellConfig.cooldown) {
    cooldownModification = {
      originalCooldown: castState.spellConfig.cooldown,
      modifiedCooldown: CAST_TIME_MECHANICS.RESOURCE_REFUND.cooldown_modification(
        castState.spellConfig.cooldown,
        completionPercentage
      )
    };
  }
  
  return {
    interrupted: true,
    castState: updatedCastState,
    completionPercentage,
    partialEffects,
    resourceRefund: refund,
    cooldownModification
  };
}

export function calculatePartialEffect(spellEffect, completionPercentage) {
  // No partial effect if percentage is too low
  if (completionPercentage < CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS.MINOR) {
    return null;
  }
  
  // Get the effect scaling function
  const scalingFn = CAST_TIME_MECHANICS.EFFECT_SCALING[spellEffect.type];
  if (!scalingFn) {
    // Default scaling: linear with percentage
    return {
      magnitude: completionPercentage,
      data: spellEffect.config
    };
  }
  
  // Calculate scaled values for each property
  const scaledData = {};
  for (const [key, value] of Object.entries(spellEffect.config)) {
    if (typeof value === 'number') {
      // Scale numerical values
      scaledData[key] = scalingFn(value, completionPercentage);
    } else if (key === 'diceNotation' && typeof value === 'string') {
      // Handle dice notation
      const estimatedValue = estimateDiceValue(value);
      const scaledValue = scalingFn(estimatedValue, completionPercentage);
      // Generate a new dice notation with similar average
      scaledData[key] = generateDiceNotationForValue(scaledValue, value);
    } else {
      // Copy non-scaled properties
      scaledData[key] = value;
    }
  }
  
  return {
    magnitude: completionPercentage,
    data: scaledData
  };
}

export function determineResourceRefund(castState, interruptionReason) {
  const completionPercentage = castState.progressPercentage || 0;
  
  // Create refund object
  const refund = {};
  
  // Calculate action point refund
  if (castState.resourcesCommitted.actionPoints > 0) {
    refund.actionPoints = CAST_TIME_MECHANICS.RESOURCE_REFUND.action_points(
      castState.resourcesCommitted.actionPoints,
      completionPercentage
    );
  }
  
  // Calculate mana refund
  if (castState.resourcesCommitted.mana > 0) {
    refund.mana = CAST_TIME_MECHANICS.RESOURCE_REFUND.mana(
      castState.resourcesCommitted.mana,
      completionPercentage
    );
  }
  
  // Handle other resources
  if (castState.resourcesCommitted.otherResources) {
    refund.otherResources = {};
    for (const [resource, amount] of Object.entries(castState.resourcesCommitted.otherResources)) {
      // Use mana refund formula for other resources by default
      refund.otherResources[resource] = CAST_TIME_MECHANICS.RESOURCE_REFUND.mana(
        amount,
        completionPercentage
      );
    }
  }
  
  return refund;
}

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

export function estimateCastCompletion(castState, turnState) {
  // Handle different cast time types
  switch (castState.castTimeType) {
    case 'IMMEDIATE':
      return { ...turnState }; // Same turn
      
    case 'NEXT_TURN':
      return getNextTurnFor(turnState.characterId, turnState);
      
    case 'X_TURNS':
      // Clone the turn
      let targetTurn = { ...turnState };
      
      // Advance by the number of turns required
      for (let i = 0; i < castState.modifiedCastTime; i++) {
        targetTurn = getNextTurnFor(targetTurn.characterId, targetTurn);
      }
      
      return targetTurn;
      
    case 'END_OF_ROUND':
      // Create an end-of-round turn
      return {
        ...turnState,
        phase: TURN_PHASES.END,
        isLastInRound: true
      };
      
    case 'REAL_TIME':
      // For real-time, return estimated completion time
      const completionTime = Date.now() + (castState.modifiedCastTime * 1000);
      return {
        ...turnState,
        estimatedCompletionTime: completionTime
      };
  }
  
  return { ...turnState }; // Default fallback
}

export function describeCastTimeMechanics(castConfig) {
  // Get cast time type details
  const castTimeType = CAST_TIME_MECHANICS.CAST_TIME_TYPES[castConfig.castTimeType || 'IMMEDIATE'];
  
  // Build a human-readable description
  let description = castTimeType.description;
  
  // Add cast time turns for X_TURNS
  if (castTimeType.id === 'X_TURNS' && castConfig.castTime) {
    description = description.replace('X', castConfig.castTime);
  }
  
  // Add info about interruption
  if (castConfig.interruptible !== false) {
    description += ` Can be interrupted by ${getInterruptionDescription(castConfig)}.`;
  } else {
    description += " Cannot be interrupted.";
  }
  
  // Add info about partial effects
  if (castConfig.allowPartialEffects) {
    description += " Partial effects may occur if interrupted.";
  }
  
  // Add any special modifiers
  const modifiers = getCastTimeModifiers(castConfig);
  if (modifiers.length > 0) {
    description += ` Affected by: ${modifiers.join(', ')}.`;
  }
  
  return description;
}

export function visualizeCastProgress(castState) {
  const completionPercentage = castState.progressPercentage || 0;
  
  // Create a visualization object with multiple formats
  return {
    percentage: completionPercentage,
    barSegments: Math.ceil(completionPercentage / 10), // 0-10 segments
    description: getCastProgressDescription(completionPercentage),
    remainingTurns: castState.modifiedCastTime - castState.progress,
    visualEffects: getProgressVisualEffects(castState, completionPercentage),
    thresholdReached: getCompletionThreshold(completionPercentage),
    completionTime: estimateCastCompletion(castState, castState.startTurn)
  };
}

export function listActiveCastings(casterState) {
  return casterState.activeCastings || [];
}

export function modifyCastParameters(castState, modifications) {
  // Create a new cast state to avoid mutating the original
  const updatedCastState = { ...castState };
  
  // Apply cast time modifications
  if (modifications.castTime) {
    // Calculate new cast time
    const newCastTime = calculateModifiedCastTime(
      updatedCastState.modifiedCastTime,
      modifications.castTime
    );
    
    // Update cast time and recalculate progress percentage
    updatedCastState.modifiedCastTime = newCastTime;
    updatedCastState.progressPercentage = Math.min(
      100,
      Math.floor((updatedCastState.progress / newCastTime) * 100)
    );
    
    // Update completion turn
    updatedCastState.completionTurn = estimateCastCompletion(
      { castTimeType: updatedCastState.castTimeType, modifiedCastTime: newCastTime },
      updatedCastState.startTurn
    );
  }
  
  // Apply interruptibility modifications
  if (modifications.interruptible !== undefined) {
    updatedCastState.interruptible = modifications.interruptible;
  }
  
  // Apply interruption resistance modifications
  if (modifications.interruptionResistance) {
    updatedCastState.interruptionResistance = {
      ...updatedCastState.interruptionResistance,
      ...modifications.interruptionResistance
    };
  }
  
  // Apply visual effects modifications
  if (modifications.visualEffects) {
    updatedCastState.visualEffects = [
      ...updatedCastState.visualEffects,
      ...modifications.visualEffects
    ];
  }
  
  return updatedCastState;
}

export function getInterruptionChance(castState, interruptionType, magnitude) {
  // Check for immunity
  if (hasInterruptionImmunity(castState, interruptionType)) {
    return 0; // 0% chance - immune
  }
  
  // Calculate base chance based on interruption type
  let baseChance = 0;
  switch (interruptionType) {
    case 'DAMAGE':
      // Higher magnitude (damage) increases chance
      const baseDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.damage(magnitude, castState.spellConfig.level);
      baseChance = calculateInterruptionProbability(castState, 'damage', baseDC);
      break;
      
    case 'STATUS':
      // Some statuses auto-interrupt
      if (CAST_TIME_MECHANICS.INTERRUPTION_TYPES.STATUS.interruptingStatuses.includes(magnitude)) {
        return 100; // 100% chance - automatic
      }
      const statusDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.status(magnitude, castState.spellConfig.level);
      baseChance = calculateInterruptionProbability(castState, 'status', statusDC);
      break;
      
    case 'MOVEMENT':
      // Some spells are automatically interrupted
      if (castState.spellConfig.interruptedByMovement) {
        // Check if movement type is exempt
        if (CAST_TIME_MECHANICS.INTERRUPTION_TYPES.MOVEMENT.exemptMovementTypes.includes(magnitude)) {
          return 0; // Exempt movement type
        }
        return 100; // 100% chance - automatic
      }
      const movementDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.movement(magnitude, castState.spellConfig.level);
      baseChance = calculateInterruptionProbability(castState, 'movement', movementDC);
      break;
      
    case 'CONCENTRATION_BREAK':
      const concentrationDC = CAST_TIME_MECHANICS.SAVE_MECHANICS.DC_CALCULATION.concentration(
        magnitude.source || 'unknown',
        magnitude.value || 10,
        castState.spellConfig.level
      );
      baseChance = calculateInterruptionProbability(castState, 'concentration', concentrationDC);
      break;
  }
  
  // Apply resistance modifiers
  if (castState.interruptionResistance && castState.interruptionResistance[interruptionType.toLowerCase()]) {
    baseChance = Math.max(0, baseChance - castState.interruptionResistance[interruptionType.toLowerCase()]);
  }
  
  return baseChance;
}

// =====================================================================
// INTEGRATION FUNCTIONS
// =====================================================================

export function synchronizeWithTurnSequence(castState, turnState) {
  // Update the cast state based on current turn information
  const updatedCastState = progressCastTime(castState, turnState);
  
  // Check if casting should complete this turn
  if (updatedCastState.status === 'ready_to_complete') {
    // Completion would be handled by the turn sequence system
    return {
      ...updatedCastState,
      readyToComplete: true,
      completionPhase: CAST_TIME_MECHANICS.CAST_TIME_TYPES[updatedCastState.castTimeType].phaseToComplete
    };
  }
  
  // Check for turn-start triggers
  if (turnState.phase === TURN_PHASES.START) {
    // Handle any start-of-turn effects on casting
  }
  
  // Check for turn-end triggers
  if (turnState.phase === TURN_PHASES.END) {
    // Handle any end-of-turn effects on casting
  }
  
  return updatedCastState;
}

export function applyInterruptionModifiers(baseSave, casterState) {
  let modifiedSave = { ...baseSave };
  
  // Apply caster attribute bonuses
  if (baseSave.attribute && casterState.attributes) {
    const attributeBonus = Math.floor((casterState.attributes[baseSave.attribute] - 10) / 2);
    modifiedSave.bonus = (modifiedSave.bonus || 0) + attributeBonus;
  }
  
  // Apply proficiency if applicable
  if (baseSave.usesProficiency && casterState.proficiencyBonus) {
    modifiedSave.bonus = (modifiedSave.bonus || 0) + casterState.proficiencyBonus;
  }
  
  // Apply class features
  if (casterState.features) {
    for (const [feature, effect] of Object.entries(CAST_TIME_MECHANICS.INTERRUPTION_IMMUNITY.CLASS_FEATURES)) {
      if (casterState.features.includes(feature)) {
        if (effect === 'advantage_on_concentration') {
          modifiedSave.hasAdvantage = true;
        }
      }
    }
  }
  
  // Apply status effect modifiers
  if (casterState.statusEffects) {
    // Check for advantage-granting statuses
    const advantageStatuses = ['focused', 'iron_will', 'unshakable'];
    if (advantageStatuses.some(status => casterState.statusEffects.includes(status))) {
      modifiedSave.hasAdvantage = true;
    }
    
    // Check for disadvantage-causing statuses
    const disadvantageStatuses = ['distracted', 'confused', 'fatigued'];
    if (disadvantageStatuses.some(status => casterState.statusEffects.includes(status))) {
      modifiedSave.hasDisadvantage = true;
    }
  }
  
  return modifiedSave;
}

export function integrateWithStatusEffects(castState, statusState) {
  const updatedCastState = { ...castState };
  
  // Check for positive status effects that help casting
  for (const status of statusState.positiveEffects || []) {
    // Haste effects
    if (CAST_TIME_MECHANICS.HASTE_EFFECTS.status_effects[status.id]) {
      const hasteModifier = CAST_TIME_MECHANICS.HASTE_EFFECTS.status_effects[status.id];
      updatedCastState.modifiedCastTime = calculateModifiedCastTime(
        updatedCastState.modifiedCastTime,
        hasteModifier
      );
    }
    
    // Concentration-improving effects
    if (status.id === 'focused' || status.id === 'clarity') {
      updatedCastState.interruptionResistance = {
        ...updatedCastState.interruptionResistance,
        concentration: (updatedCastState.interruptionResistance.concentration || 0) + 20
      };
    }
  }
  
  // Check for negative status effects that hinder casting
  for (const status of statusState.negativeEffects || []) {
    // Slow effects
    if (CAST_TIME_MECHANICS.SLOW_EFFECTS.status_effects[status.id]) {
      const slowModifier = CAST_TIME_MECHANICS.SLOW_EFFECTS.status_effects[status.id];
      updatedCastState.modifiedCastTime = calculateModifiedCastTime(
        updatedCastState.modifiedCastTime,
        slowModifier
      );
    }
    
    // Check for interrupting status effects
    if (CAST_TIME_MECHANICS.INTERRUPTION_TYPES.STATUS.interruptingStatuses.includes(status.id)) {
      updatedCastState.interruptChance = {
        ...updatedCastState.interruptChance,
        status: 100 // 100% chance of interruption
      };
    }
  }
  
  return updatedCastState;
}

export function calculateResourceAllocation(castState, turnData) {
  // Calculate resources needed for this turn of casting
  const resourcesThisTurn = {};
  
  // For most cast types, resources are allocated at the start
  if (castState.spellConfig.continuousManaConsumption) {
    // Calculate partial mana cost for this turn
    const manaPerTurn = castState.resourcesCommitted.mana / castState.originalCastTime;
    resourcesThisTurn.mana = Math.ceil(manaPerTurn);
  }
  
  // Calculate any sustain costs
  if (castState.spellConfig.sustainCost && castState.progress > 0) {
    for (const [resource, value] of Object.entries(castState.spellConfig.sustainCost)) {
      resourcesThisTurn[resource] = value;
    }
  }
  
  return resourcesThisTurn;
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

// Apply cast time modifiers from various sources
function applyCastTimeModifiers(baseCastTime, castTimeType, spellConfig, casterState) {
  // No modifications for immediate spells
  if (castTimeType.id === 'IMMEDIATE' || baseCastTime === 0) {
    return 0;
  }
  
  // Start with the base cast time
  let modifiedTime = baseCastTime;
  let modifiers = 1.0; // Multiplicative modifier
  
  // Apply haste effects from status
  if (casterState.statusEffects) {
    for (const status of casterState.statusEffects) {
      if (CAST_TIME_MECHANICS.HASTE_EFFECTS.status_effects[status]) {
        modifiers *= CAST_TIME_MECHANICS.HASTE_EFFECTS.status_effects[status];
      } else if (CAST_TIME_MECHANICS.SLOW_EFFECTS.status_effects[status]) {
        modifiers *= CAST_TIME_MECHANICS.SLOW_EFFECTS.status_effects[status];
      }
    }
  }
  
  // Apply class feature modifiers
  if (casterState.features) {
    for (const feature of casterState.features) {
      if (CAST_TIME_MECHANICS.HASTE_EFFECTS.class_features[feature]) {
        modifiers *= CAST_TIME_MECHANICS.HASTE_EFFECTS.class_features[feature];
      }
    }
  }
  
  // Apply item modifiers
  if (casterState.equipment) {
    for (const [slot, item] of Object.entries(casterState.equipment)) {
      if (item && CAST_TIME_MECHANICS.ITEM_BONUSES[item.id]) {
        const bonus = CAST_TIME_MECHANICS.ITEM_BONUSES[item.id];
        if (typeof bonus === 'function') {
          modifiers *= bonus(spellConfig.level || 1);
        } else {
          modifiers *= bonus;
        }
      }
    }
  }
  
  // Apply environmental factors
  if (casterState.environment) {
    const environmentEffect = CAST_TIME_MECHANICS.ENVIRONMENT_FACTORS[casterState.environment];
    if (environmentEffect) {
      if (typeof environmentEffect === 'function') {
        modifiers *= environmentEffect(spellConfig.element);
      } else if (environmentEffect === 'random') {
        // Random between 0.5 and 1.5
        modifiers *= 0.5 + Math.random();
      } else {
        modifiers *= environmentEffect;
      }
    }
  }
  
  // Calculate final modified time
  modifiedTime = Math.max(0, Math.ceil(modifiedTime * modifiers));
  
  return modifiedTime;
}

// Calculate resistance to interruption
function calculateInterruptionResistance(spellConfig, casterState) {
  const resistance = {
    damage: 0,
    status: 0,
    movement: 0,
    concentration: 0
  };
  
  // Add spell level bonus
  if (spellConfig.level) {
    const levelBonus = Math.min(
      CAST_TIME_MECHANICS.SAVE_MECHANICS.SPELL_LEVEL_FACTORS.maxLevelBonus,
      spellConfig.level * CAST_TIME_MECHANICS.SAVE_MECHANICS.SPELL_LEVEL_FACTORS.baseBonusPerLevel
    );
    
    resistance.damage += levelBonus;
    resistance.status += levelBonus;
    resistance.concentration += levelBonus;
  }
  
  // Add caster attribute bonuses
  if (casterState.attributes) {
    // Constitution helps resist damage
    if (casterState.attributes.constitution) {
      const conBonus = Math.floor((casterState.attributes.constitution - 10) / 2);
      resistance.damage += conBonus;
    }
    
    // Wisdom helps with concentration
    if (casterState.attributes.wisdom) {
      const wisBonus = Math.floor((casterState.attributes.wisdom - 10) / 2);
      resistance.concentration += wisBonus;
    }
  }
  
  // Add specific spell resistance
  if (spellConfig.interruptionResistance) {
    for (const [type, value] of Object.entries(spellConfig.interruptionResistance)) {
      if (resistance[type] !== undefined) {
        resistance[type] += value;
      }
    }
  }
  
  return resistance;
}

// Check if a caster has immunity to a type of interruption
function hasInterruptionImmunity(castState, interruptionType) {
  const type = interruptionType.toLowerCase();
  
  // Check for status effect immunity
  if (castState.casterState.statusEffects) {
    const immunityStatuses = CAST_TIME_MECHANICS.INTERRUPTION_IMMUNITY.STATUSES;
    if (castState.casterState.statusEffects.some(status => immunityStatuses.includes(status))) {
      return true;
    }
  }
  
  // Check for item effect immunity
  if (castState.casterState.equipment) {
    const immunityItems = CAST_TIME_MECHANICS.INTERRUPTION_IMMUNITY.ITEM_EFFECTS;
    for (const item of Object.values(castState.casterState.equipment)) {
      if (item && immunityItems.includes(item.id)) {
        return true;
      }
    }
  }
  
  // Check for class feature immunity
  if (castState.casterState.features) {
    for (const [feature, effect] of Object.entries(CAST_TIME_MECHANICS.INTERRUPTION_IMMUNITY.CLASS_FEATURES)) {
      if (castState.casterState.features.includes(feature)) {
        // Special case for specific immunity types
        if (effect === `immunity_to_${type}_interruption`) {
          return true;
        }
      }
    }
  }
  
  // Check for spell-specific immunity
  if (castState.spellConfig.immuneToInterruption) {
    if (castState.spellConfig.immuneToInterruption === true || 
        (Array.isArray(castState.spellConfig.immuneToInterruption) && 
         castState.spellConfig.immuneToInterruption.includes(type))) {
      return true;
    }
  }
  
  return false;
}

// Check save vs interruption
function checkSaveVsInterruption(castState, saveType, DC, magnitude) {
  // Check for automatic success
  if (hasInterruptionImmunity(castState, saveType.toUpperCase())) {
    return { 
      interrupted: false, 
      reason: 'immune_to_interruption',
      save: { automatic: true, succeeded: true, DC }
    };
  }
  
  // Get attribute used for save
  const attributes = CAST_TIME_MECHANICS.SAVE_MECHANICS.ATTRIBUTE_BONUSES[saveType];
  const primaryAttribute = attributes[0];
  
  // Calculate save bonus
  let saveBonus = 0;
  if (castState.casterState.attributes && castState.casterState.attributes[primaryAttribute]) {
    saveBonus += Math.floor((castState.casterState.attributes[primaryAttribute] - 10) / 2);
  }
  
  // Add interruption resistance
  if (castState.interruptionResistance && castState.interruptionResistance[saveType]) {
    saveBonus += castState.interruptionResistance[saveType];
  }
  
  // Add spell level bonus if applicable
  if (CAST_TIME_MECHANICS.SAVE_MECHANICS.SPELL_LEVEL_FACTORS.selfControlledSpells && 
      castState.spellConfig.level) {
    saveBonus += Math.min(
      CAST_TIME_MECHANICS.SAVE_MECHANICS.SPELL_LEVEL_FACTORS.maxLevelBonus,
      castState.spellConfig.level
    );
  }
  
  // Roll the save
  const rollResult = rollSave(saveBonus, DC, castState.casterState.advantage || false);
  
  return {
    interrupted: !rollResult.success,
    reason: rollResult.success ? 'save_succeeded' : `failed_${saveType}_save`,
    save: {
      type: saveType,
      attribute: primaryAttribute,
      DC,
      bonus: saveBonus,
      roll: rollResult.roll,
      total: rollResult.total,
      succeeded: rollResult.success
    }
  };
}

// Roll a save
function rollSave(bonus, DC, hasAdvantage = false) {
  // Use the dice system
  const roll = DiceBuilder.rollDice('1d20', {
    mode: hasAdvantage ? 'advantage' : 'normal'
  });
  
  const total = roll.total + bonus;
  
  return {
    roll: roll.total,
    bonus,
    total,
    success: total >= DC
  };
}

// Calculate probability of interruption
function calculateInterruptionProbability(castState, saveType, DC) {
  // Get attribute used for save
  const attributes = CAST_TIME_MECHANICS.SAVE_MECHANICS.ATTRIBUTE_BONUSES[saveType];
  const primaryAttribute = attributes[0];
  
  // Calculate save bonus
  let saveBonus = 0;
  if (castState.casterState.attributes && castState.casterState.attributes[primaryAttribute]) {
    saveBonus += Math.floor((castState.casterState.attributes[primaryAttribute] - 10) / 2);
  }
  
  // Add interruption resistance
  if (castState.interruptionResistance && castState.interruptionResistance[saveType]) {
    saveBonus += castState.interruptionResistance[saveType];
  }
  
  // Calculate probability
  const targetRoll = DC - saveBonus;
  
  // Calculate basic probability (chance of rolling less than target)
  let probability = Math.min(100, Math.max(0, (targetRoll - 1) * 5));
  
  // Adjust for advantage/disadvantage
  if (castState.casterState.advantage) {
    // With advantage, probability is squared
    probability = (probability / 100) * (probability / 100) * 100;
  } else if (castState.casterState.disadvantage) {
    // With disadvantage, chance of failure increases
    probability = 100 - ((100 - probability) / 100) * ((100 - probability) / 100) * 100;
  }
  
  return Math.round(probability);
}

// Update progress percentage based on turn data
function updateProgressPercentage(castState, turnData) {
  switch (castState.castTimeType) {
    case 'NEXT_TURN':
      // For next turn, it's binary - either not started (0%) or waiting for next turn
      castState.progressPercentage = 50;
      break;
      
    case 'X_TURNS':
      // Progress based on turns passed
      const turnsRemaining = calculateTurnsRemaining(
        castState.modifiedCastTime, 
        castState.startTurn, 
        turnData
      );
      const turnsPassed = castState.modifiedCastTime - turnsRemaining;
      castState.progressPercentage = Math.min(
        99, // Cap at 99% until ready_to_complete
        Math.floor((turnsPassed / castState.modifiedCastTime) * 100)
      );
      break;
      
    case 'END_OF_ROUND':
      // Progress based on position in initiative order
      if (turnData.initiativePosition && turnData.initiativeTotal) {
        castState.progressPercentage = Math.min(
          99,
          Math.floor((turnData.initiativePosition / turnData.initiativeTotal) * 100)
        );
      } else {
        castState.progressPercentage = 50; // Default if no initiative data
      }
      break;
      
    case 'REAL_TIME':
      // For real-time, calculated in progressCastTime
      break;
  }
}

// Get a modified cast time based on a modifier
function calculateModifiedCastTime(currentCastTime, modifier) {
  if (typeof modifier === 'number') {
    // Additive modifier
    return Math.max(0, currentCastTime + modifier);
  } else {
    // Multiplicative modifier
    return Math.max(0, Math.ceil(currentCastTime * modifier));
  }
}

// Estimate the value of a dice notation
function estimateDiceValue(diceNotation) {
  try {
    const match = diceNotation.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (match) {
      const diceCount = parseInt(match[1]);
      const diceSides = parseInt(match[2]);
      const modifier = match[3] ? parseInt(match[3]) : 0;
      
      // Average value of a die is (sides + 1) / 2
      const averageDieValue = (diceSides + 1) / 2;
      return (diceCount * averageDieValue) + modifier;
    }
  } catch (error) {
    // Default value if parsing fails
    return 10;
  }
  
  // Default value if no match
  return 10;
}

// Generate a dice notation that approximates a value
function generateDiceNotationForValue(value, originalNotation) {
  // Parse original notation for structure
  const match = originalNotation.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) {
    // Fallback if original doesn't match pattern
    if (value <= 3) return '1d6';
    if (value <= 6) return '1d12';
    if (value <= 10) return '2d8';
    if (value <= 15) return '2d12+2';
    if (value <= 20) return '4d8';
    return `${Math.ceil(value / 5)}d10`;
  }
  
  const origDiceCount = parseInt(match[1]);
  const origDiceSides = parseInt(match[2]);
  const origModifier = match[3] ? parseInt(match[3]) : 0;
  
  // Try to maintain similar structure
  const avgDieValue = (origDiceSides + 1) / 2;
  const targetDiceCount = Math.max(1, Math.floor(value / avgDieValue));
  
  // Adjust modifier to hit target value
  const diceTotal = targetDiceCount * avgDieValue;
  const newModifier = Math.round(value - diceTotal);
  
  // Generate new notation
  let newNotation = `${targetDiceCount}d${origDiceSides}`;
  if (newModifier !== 0) {
    newNotation += newModifier > 0 ? `+${newModifier}` : newModifier;
  }
  
  return newNotation;
}

// Get cast progress description
function getCastProgressDescription(percentage) {
  if (percentage < 1) return "Not started";
  if (percentage < 25) return "Just begun";
  if (percentage < 50) return "In progress";
  if (percentage < 75) return "Halfway there";
  if (percentage < 90) return "Almost complete";
  if (percentage < 100) return "Nearly finished";
  return "Complete";
}

// Get progress visual effects
function getProgressVisualEffects(castState, percentage) {
  const baseEffects = castState.visualEffects || [];
  const progressEffects = [];
  
  // Add effects based on progress
  if (percentage >= 25) {
    progressEffects.push({
      type: 'channeling',
      intensity: percentage / 100,
      color: castState.spellConfig.element === 'fire' ? 'red' : 
             castState.spellConfig.element === 'ice' ? 'blue' : 
             castState.spellConfig.element === 'nature' ? 'green' : 
             'purple'
    });
  }
  
  if (percentage >= 50) {
    progressEffects.push({
      type: 'particles',
      intensity: (percentage - 50) / 50,
      frequency: Math.min(1, (percentage - 50) / 100)
    });
  }
  
  if (percentage >= 75) {
    progressEffects.push({
      type: 'glow',
      intensity: (percentage - 75) / 25,
      radius: Math.floor(percentage / 10)
    });
  }
  
  return [...baseEffects, ...progressEffects];
}

// Get the highest completion threshold reached
function getCompletionThreshold(percentage) {
  const thresholds = CAST_TIME_MECHANICS.COMPLETION_THRESHOLDS;
  
  if (percentage >= thresholds.COMPLETE) return 'COMPLETE';
  if (percentage >= thresholds.MAJOR) return 'MAJOR';
  if (percentage >= thresholds.MODERATE) return 'MODERATE';
  if (percentage >= thresholds.MINOR) return 'MINOR';
  return 'NONE';
}

// Get interruption description
function getInterruptionDescription(castConfig) {
  if (!castConfig.interruptible) return "nothing";
  
  const interruptionSources = [];
  
  // Add specific interruption sources
  if (castConfig.interruptedByDamage !== false) {
    interruptionSources.push("damage");
  }
  
  if (castConfig.interruptedByMovement) {
    interruptionSources.push("movement");
  }
  
  if (castConfig.interruptedByStatus !== false) {
    interruptionSources.push("status effects");
  }
  
  if (interruptionSources.length === 0) {
    return "standard interruption sources";
  }
  
  return interruptionSources.join(", ");
}

// Get cast time modifiers
function getCastTimeModifiers(castConfig) {
  const modifiers = [];
  
  if (castConfig.hasteEffects) {
    modifiers.push("haste effects");
  }
  
  if (castConfig.environmentalFactors) {
    modifiers.push("environmental factors");
  }
  
  if (castConfig.itemBonuses) {
    modifiers.push("equipment bonuses");
  }
  
  return modifiers;
}

// Resolve targets based on targeting config
function resolveTargets(spellConfig, gameState) {
  // Implementation depends on targeting system
  if (!spellConfig.targetingConfig) {
    return [];
  }
  
  // Simple placeholder implementation
  return [
    { id: 'target1', type: 'character' }
  ];
}