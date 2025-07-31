// core/mechanics/turnSequenceSystem.js

/**
 * Turn Sequence System
 * 
 * Implements turn sequencing logic for abilities with emphasis
 * on cast times and reactions.
 */

// Define constants for turn phases
const TURN_PHASES = {
    START: 'start',
    ACTION: 'action',
    MOVE: 'move',
    END: 'end'
  };
  
  // Define a combat turn structure
  function defineTurnSequence() {
    return {
      phases: [
        TURN_PHASES.START,
        TURN_PHASES.ACTION,
        TURN_PHASES.MOVE, 
        TURN_PHASES.END
      ],
      phaseActions: {
        [TURN_PHASES.START]: ['processTurnStartEffects', 'resolvePendingCastTimeAbilities'],
        [TURN_PHASES.ACTION]: ['performAction', 'checkInterrupts'],
        [TURN_PHASES.MOVE]: ['performMovement', 'checkOpportunityActions'],
        [TURN_PHASES.END]: ['processTurnEndEffects', 'processChanneledEffects']
      },
      phaseRestrictions: {
        [TURN_PHASES.START]: { canUseActions: false, canMove: false },
        [TURN_PHASES.ACTION]: { canUseActions: true, canMove: false },
        [TURN_PHASES.MOVE]: { canUseActions: false, canMove: true },
        [TURN_PHASES.END]: { canUseActions: false, canMove: false }
      }
    };
  }
  
  // Create a turn identifier object
  function createTurnIdentifier(characterId, roundNumber, turnNumber) {
    return {
      characterId,
      roundNumber,
      turnNumber,
      fullId: `${roundNumber}-${turnNumber}-${characterId}`
    };
  }
  
  // Resolve abilities with cast times
  function resolveCastTimeAbility(spell, startTurn, currentTurn) {
    // Check if this ability should resolve on the current turn
    if (!shouldResolveOnTurn(spell, startTurn, currentTurn)) {
      return { resolved: false, status: 'pending' };
    }
    
    // Check for cast time type
    switch (spell.castTimeType) {
      case 'IMMEDIATE':
        // Should resolve immediately, which would have happened already
        console.warn('Immediate spell in cast time resolution queue', spell);
        return { resolved: true, status: 'error', error: 'Immediate spell in queue' };
        
      case 'NEXT_TURN':
        // Check if this is the caster's next turn
        if (isSameTurn(getNextTurnFor(startTurn.characterId, startTurn), currentTurn)) {
          return { resolved: true, status: 'success', effect: spell.effect };
        }
        return { resolved: false, status: 'pending' };
        
      case 'X_TURNS':
        // Check if enough turns have passed
        const turnsRemaining = calculateTurnsRemaining(spell.castTime, startTurn, currentTurn);
        if (turnsRemaining <= 0) {
          return { resolved: true, status: 'success', effect: spell.effect };
        }
        return { 
          resolved: false, 
          status: 'pending', 
          progress: {
            total: spell.castTime,
            remaining: turnsRemaining,
            percentComplete: Math.floor(((spell.castTime - turnsRemaining) / spell.castTime) * 100)
          }
        };
        
      case 'END_OF_ROUND':
        // Check if this is the end of the round
        if (currentTurn.phase === TURN_PHASES.END && isLastTurnInRound(currentTurn)) {
          return { resolved: true, status: 'success', effect: spell.effect };
        }
        return { resolved: false, status: 'pending' };
        
      default:
        return { 
          resolved: false, 
          status: 'error', 
          error: `Unknown cast time type: ${spell.castTimeType}` 
        };
    }
  }
  
  // Check if a spell should resolve on the current turn
  function shouldResolveOnTurn(spell, startTurn, currentTurn) {
    // Implementation depends on the spell type and cast time settings
    // This is a simplified check
    if (spell.castTimeType === 'IMMEDIATE') {
      return true;
    }
    
    if (spell.castTimeType === 'NEXT_TURN') {
      return isSameTurn(getNextTurnFor(startTurn.characterId, startTurn), currentTurn);
    }
    
    if (spell.castTimeType === 'X_TURNS') {
      return calculateTurnsRemaining(spell.castTime, startTurn, currentTurn) <= 0;
    }
    
    if (spell.castTimeType === 'END_OF_ROUND') {
      return currentTurn.phase === TURN_PHASES.END && isLastTurnInRound(currentTurn);
    }
    
    return false;
  }
  
  // Check if a reaction should trigger
  function checkReactionTriggers(event, availableReactions) {
    const triggeredReactions = [];
    
    // Filter reactions that should trigger on this event
    for (const reaction of availableReactions) {
      if (reaction.triggerType === event.type) {
        // Check if the reaction is available
        if (isReactionAvailable(reaction, event)) {
          triggeredReactions.push({
            reaction,
            event,
            priority: getReactionPriority(reaction)
          });
        }
      }
    }
    
    // Sort by priority (higher first)
    return triggeredReactions.sort((a, b) => b.priority - a.priority);
  }
  
  // Check if a reaction is available
  function isReactionAvailable(reaction, event) {
    switch (reaction.availabilityType) {
      case 'ALWAYS':
        return hasRequiredResources(reaction, event.character);
        
      case 'PREPARED':
        return reaction.prepared && hasRequiredResources(reaction, event.character);
        
      case 'LIMITED':
        return reaction.usesRemaining > 0 && hasRequiredResources(reaction, event.character);
        
      default:
        return false;
    }
  }
  
  // Check if character has resources for the reaction
  function hasRequiredResources(reaction, character) {
    // Implementation for resource check
    if (reaction.actionPointCost && character.actionPoints < reaction.actionPointCost) {
      return false;
    }
    
    if (reaction.usesPerTurn && character.reactionsUsedThisTurn >= reaction.usesPerTurn) {
      return false;
    }
    
    return true;
  }
  
  // Get the priority of a reaction (higher = triggers first)
  function getReactionPriority(reaction) {
    // Default implementation - can be customized based on game balance
    return reaction.priority || 0;
  }
  
  // Process effects that occur at turn end
  function processTurnEndEffects(characterState) {
    const effects = [];
    
    // Process ongoing effects
    for (const effect of characterState.activeEffects) {
      if (effect.tickFrequency === 'END_OF_TURN') {
        effects.push(processEffect(effect, characterState));
      }
    }
    
    // Process channeled spells
    for (const channel of characterState.channeledSpells) {
      if (channel.tickFrequency === 'END_OF_TURN') {
        effects.push(processChanneledEffect(channel, characterState));
      }
    }
    
    // Check for expired effects
    const expiredEffects = characterState.activeEffects.filter(effect => 
      effect.duration && effect.duration.type === 'timed' && 
      effect.duration.expiresOnTurnEnd && 
      effect.duration.turnsRemaining <= 0
    );
    
    return {
      processedEffects: effects,
      expiredEffects
    };
  }
  
  // Process effects that occur at turn start
  function processTurnStartEffects(characterState) {
    const effects = [];
    
    // Process ongoing effects
    for (const effect of characterState.activeEffects) {
      if (effect.tickFrequency === 'START_OF_TURN') {
        effects.push(processEffect(effect, characterState));
      }
    }
    
    // Process channeled spells
    for (const channel of characterState.channeledSpells) {
      if (channel.tickFrequency === 'START_OF_TURN') {
        effects.push(processChanneledEffect(channel, characterState));
      }
    }
    
    // Decrement duration for effects that tick down on turn start
    const updatedEffects = characterState.activeEffects.map(effect => {
      if (effect.duration && effect.duration.type === 'timed' && effect.duration.ticksOnTurnStart) {
        return {
          ...effect,
          duration: {
            ...effect.duration,
            turnsRemaining: Math.max(0, effect.duration.turnsRemaining - 1)
          }
        };
      }
      return effect;
    });
    
    // Check for expired effects
    const expiredEffects = updatedEffects.filter(effect => 
      effect.duration && effect.duration.type === 'timed' && 
      effect.duration.expiresOnTurnStart && 
      effect.duration.turnsRemaining <= 0
    );
    
    return {
      processedEffects: effects,
      updatedEffects: updatedEffects.filter(effect => !expiredEffects.includes(effect)),
      expiredEffects
    };
  }
  
  // Process a single effect
  function processEffect(effect, characterState) {
    // Implementation depends on effect system
    return {
      effect,
      result: `Processed ${effect.name}`
    };
  }
  
  // Process a channeled effect
  function processChanneledEffect(channel, characterState) {
    // Check if concentration is maintained
    if (channel.requiresConcentrationCheck) {
      const concentrationResult = checkConcentration(channel, characterState);
      if (!concentrationResult.maintained) {
        return {
          channel,
          maintained: false,
          breakEffect: channel.breakEffects ? processBreakEffect(channel, characterState) : null
        };
      }
    }
    
    // Apply the channeled effect
    return {
      channel,
      maintained: true,
      effect: `Applied ${channel.name} effect`
    };
  }
  
  // Check concentration for channeled spells
  function checkConcentration(channel, characterState) {
    // Implementation depends on game mechanics
    return { maintained: true };
  }
  
  // Process effect when concentration breaks
  function processBreakEffect(channel, characterState) {
    // Implementation depends on effect system
    return `Applied break effect for ${channel.name}`;
  }
  
  // Determine when an action would resolve
  function determineActionTiming(spell, roundState) {
    const currentTurn = roundState.currentTurn;
    
    // For instant casts
    if (spell.castTime === 0 || spell.castTimeType === 'IMMEDIATE') {
      return {
        timing: 'immediate',
        turn: currentTurn
      };
    }
    
    // For next turn casts
    if (spell.castTimeType === 'NEXT_TURN') {
      const nextTurn = getNextTurnFor(currentTurn.characterId, currentTurn);
      return {
        timing: 'next_turn',
        turn: nextTurn
      };
    }
    
    // For X turns casts
    if (spell.castTimeType === 'X_TURNS') {
      // Calculate the turn X turns from now
      let targetTurn = { ...currentTurn };
      for (let i = 0; i < spell.castTime; i++) {
        targetTurn = getNextTurnInCombat(targetTurn, roundState);
      }
      
      return {
        timing: 'after_x_turns',
        turn: targetTurn,
        turnsRemaining: spell.castTime
      };
    }
    
    // For end of round casts
    if (spell.castTimeType === 'END_OF_ROUND') {
      return {
        timing: 'end_of_round',
        roundNumber: currentTurn.roundNumber
      };
    }
    
    return {
      timing: 'unknown',
      error: `Unknown cast time type: ${spell.castTimeType}`
    };
  }
  
  // Combat timing utilities
  
  // Compare turn identifiers
  function isSameTurn(turn1, turn2) {
    return turn1.fullId === turn2.fullId;
  }
  
  // Calculate turns remaining for a cast time ability
  function calculateTurnsRemaining(castTime, startTurn, currentTurn) {
    // Implementation accounting for initiative order
    const turnsPassed = (currentTurn.roundNumber - startTurn.roundNumber) * 10 + 
                       (currentTurn.turnNumber - startTurn.turnNumber);
    return Math.max(0, castTime - turnsPassed);
  }
  
  // Get the next turn for a character
  function getNextTurnFor(characterId, currentTurn) {
    // Implementation depends on the initiative system
    return {
      characterId,
      roundNumber: currentTurn.roundNumber,
      turnNumber: currentTurn.turnNumber + 1,
      fullId: `${currentTurn.roundNumber}-${currentTurn.turnNumber + 1}-${characterId}`
    };
  }
  
  // Get the next turn in combat (for any character)
  function getNextTurnInCombat(currentTurn, roundState) {
    // Follow the initiative order
    const initiativeOrder = roundState.initiativeOrder;
    const currentIndex = initiativeOrder.findIndex(id => id === currentTurn.characterId);
    
    if (currentIndex < initiativeOrder.length - 1) {
      // Next character in the same round
      const nextCharacterId = initiativeOrder[currentIndex + 1];
      return {
        characterId: nextCharacterId,
        roundNumber: currentTurn.roundNumber,
        turnNumber: currentTurn.turnNumber + 1,
        fullId: `${currentTurn.roundNumber}-${currentTurn.turnNumber + 1}-${nextCharacterId}`
      };
    } else {
      // First character in the next round
      const firstCharacterId = initiativeOrder[0];
      return {
        characterId: firstCharacterId,
        roundNumber: currentTurn.roundNumber + 1,
        turnNumber: 1,
        fullId: `${currentTurn.roundNumber + 1}-1-${firstCharacterId}`
      };
    }
  }
  
  // Check if it's an enemy's turn
  function isEnemyTurn(currentTurn, characterId) {
    return currentTurn.characterId !== characterId;
  }
  
  // Check if this is the last turn in the current round
  function isLastTurnInRound(currentTurn, roundState) {
    const initiativeOrder = roundState.initiativeOrder;
    const currentIndex = initiativeOrder.findIndex(id => id === currentTurn.characterId);
    return currentIndex === initiativeOrder.length - 1;
  }
  
  // Interrupt a casting spell
  function interruptCastingSpell(castingSpell, caster, interruptSource) {
    // Check if the spell is interruptible
    if (!castingSpell.interruptible) {
      return {
        interrupted: false,
        reason: 'spell_not_interruptible'
      };
    }
    
    // Apply partial effect if applicable
    let partialEffect = null;
    if (castingSpell.partialEffectOnInterrupt) {
      partialEffect = applyPartialEffect(castingSpell, caster);
    }
    
    return {
      interrupted: true,
      partialEffect,
      interruptSource
    };
  }
  
  // Apply partial effect when a spell is interrupted
  function applyPartialEffect(castingSpell, caster) {
    // Implementation depends on effect system
    return {
      name: `Partial ${castingSpell.name}`,
      description: `Partial effect from interrupted ${castingSpell.name}`
    };
  }
  
  // Export the turn sequence system
  export {
    TURN_PHASES,
    defineTurnSequence,
    createTurnIdentifier,
    resolveCastTimeAbility,
    checkReactionTriggers,
    processTurnEndEffects,
    processTurnStartEffects,
    determineActionTiming,
    isSameTurn,
    calculateTurnsRemaining,
    getNextTurnFor,
    getNextTurnInCombat,
    isEnemyTurn,
    isLastTurnInRound,
    interruptCastingSpell
  };