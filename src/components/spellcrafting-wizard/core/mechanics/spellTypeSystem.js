// core/mechanics/spellTypeSystem.js

/**
 * Spell Type System
 *
 * Defines the fundamental categories and behaviors of different spells,
 * with emphasis on turn sequencing, cast times, and reactions.
 */

// Main spell type definitions
const SPELL_TYPES = {
    ACTION: {
      id: 'action',
      name: 'Action Spell',
      description: 'Standard or cast-time abilities used on your turn',
      icon: 'action-icon',
      actionPointCost: 1,
      allowedEffects: ['damage', 'heal', 'buff', 'debuff', 'utility'],
      allowedTargeting: ['single', 'area', 'self', 'multi'],
      allowedDurations: ['instant', 'timed', 'permanent'],

      // Enhanced cast time mechanics
      castTime: 0, // Default: instant cast (0 turns)
      castTimeType: 'IMMEDIATE', // Default: resolves immediately
      interruptible: true, // Can be interrupted by default
      castingVisibility: true, // Visible to others by default
      partialEffectOnInterrupt: null, // No partial effect by default
      scalingWithCastTime: null, // No scaling by default
      continueCastingOnTurnEnd: false, // Doesn't continue when turn ends by default
    },

    CHANNELED: {
      id: 'channeled',
      name: 'Channeled Spell',
      description: 'Maintained effects requiring concentration',
      icon: 'channeled-icon',
      actionPointCost: 2,
      allowedEffects: ['damage', 'heal', 'buff', 'debuff', 'control', 'utility'],
      allowedTargeting: ['single', 'area', 'self', 'multi'],
      allowedDurations: ['maintained', 'concentration'],

      // Enhanced channeled properties
      maxChannelDuration: 3, // Default: 3 turns
      tickFrequency: 'END_OF_TURN', // Default: effect occurs at end of your turn
      concentrationDC: 10, // Base difficulty to maintain when damaged
      breakEffects: null, // What happens when concentration breaks
    },

    PASSIVE: {
      id: 'passive',
      name: 'Passive Ability',
      description: 'Always-on or toggled effects',
      icon: 'passive-icon',
      actionPointCost: 0,
      allowedEffects: ['buff', 'utility', 'reactive'],
      allowedTargeting: ['self', 'aura'],
      allowedDurations: ['permanent', 'conditional'],

      // Enhanced passive properties
      toggleable: false, // Not toggleable by default
      resourceDrain: null, // No ongoing cost by default
      triggeredEffects: null, // No triggered effects by default
      passiveConditions: null, // No specific conditions by default
    },

    REACTION: {
      id: 'reaction',
      name: 'Reaction Ability',
      description: 'Abilities used outside your turn in response to triggers',
      icon: 'reaction-icon',
      actionPointCost: 1,
      allowedEffects: ['counter', 'interrupt', 'defensive', 'utility'],
      allowedTargeting: ['single', 'self', 'area'],
      allowedDurations: ['instant', 'timed'],

      // Enhanced reaction properties
      triggerType: null, // Must be defined for each reaction
      availabilityType: 'ALWAYS', // Available whenever conditions are met by default
      reactionWindow: 'immediate', // How long the opportunity exists
      preparationCost: 0, // No preparation cost by default
      usesPerTurn: 1, // Limited to one use per turn by default
      turnPhaseRestriction: null, // No phase restriction by default
    },

    TRAP: {
      id: 'trap',
      name: 'Trap Spell',
      description: 'Placed effects that activate when triggered by specific conditions',
      icon: 'trap-icon',
      actionPointCost: 2,
      allowedEffects: ['damage', 'debuff', 'control', 'utility'],
      allowedTargeting: ['area', 'single'],
      allowedDurations: ['timed', 'permanent', 'conditional'],

      // Trap-specific properties
      placementTime: 1, // Default: 1 turn to place
      detectionDC: 15, // Default difficulty to detect
      disarmDC: 15, // Default difficulty to disarm
      triggerType: null, // Must be defined for each trap
      visibility: 'hidden', // Default: hidden from view
      trapDuration: 'permanent', // How long the trap remains active
      maxTriggers: 1, // Default: single-use trap
      areaOfEffect: null, // Area affected when triggered
      resetTime: null // Time to reset after triggering (null = no reset)
    },

    STATE: {
      id: 'state',
      name: 'State Spell',
      description: 'Always-present spells that activate when specific conditions are met',
      icon: 'state-icon',
      actionPointCost: 0, // No action cost to trigger as it's automatic
      allowedEffects: ['damage', 'heal', 'buff', 'debuff', 'utility'],
      allowedTargeting: ['self', 'single', 'area'],
      allowedDurations: ['permanent', 'conditional', 'timed'],
    },

    ZONE: {
      id: 'zone',
      name: 'Zone Spell',
      description: 'Creates a persistent area that applies effects to targets within it',
      icon: 'zone-icon',
      actionPointCost: 2,
      allowedEffects: ['damage', 'healing', 'buff', 'debuff', 'control', 'utility'],
      allowedTargeting: ['area', 'self_centered'],
      allowedDurations: ['timed', 'concentration', 'permanent'],

      // Zone-specific properties
      zoneDuration: 60, // Default duration value for how long the zone persists
      zoneDurationUnit: 'seconds', // Unit for zone duration (seconds, minutes, hours, days, weeks, rounds, turns)
      leaveTrail: false, // Whether the zone leaves a trail as it moves
      trailDuration: 3, // Default duration for how long each trail segment remains active
      trailDurationUnit: 'rounds' // Unit for trail duration (seconds, minutes, hours, days, weeks, rounds, turns)
    },

    STATE: {
      id: 'state',
      name: 'State Spell',
      description: 'Always-present spells that activate when specific conditions are met',
      icon: 'state-icon',
      actionPointCost: 0, // No action cost to trigger as it's automatic
      allowedEffects: ['damage', 'heal', 'buff', 'debuff', 'utility'],
      allowedTargeting: ['self', 'single', 'area'],
      allowedDurations: ['permanent', 'conditional', 'timed'],

      // State-specific properties
      activationCondition: null, // Must be defined for each state spell
      cooldownAfterTrigger: 0, // Default: no cooldown between triggers
      maxTriggers: -1, // Default: unlimited triggers
      resourceThreshold: null, // Resource-based activation threshold
      stateVisibility: 'visible', // Whether the state is visible to others
      deactivationCondition: null, // Condition to deactivate the state
      triggerPriority: 'normal' // Priority in the trigger queue
    }
  };

  // Create a spell with the specified type
  function createSpell(type, config = {}) {
    if (!SPELL_TYPES[type]) {
      throw new Error(`Invalid spell type: ${type}`);
    }

    // Start with the base properties of the spell type
    const baseSpell = { ...SPELL_TYPES[type] };

    // Override with provided config
    return { ...baseSpell, ...config };
  }

  // Validate if a spell configuration is valid for its type
  function validateSpellConfig(spell) {
    const type = Object.keys(SPELL_TYPES).find(t => SPELL_TYPES[t].id === spell.id);

    if (!type) {
      return { valid: false, errors: ['Invalid spell type'] };
    }

    const errors = [];

    // Check if the effect type is allowed
    if (spell.effect && !SPELL_TYPES[type].allowedEffects.includes(spell.effect)) {
      errors.push(`Effect type "${spell.effect}" not allowed for ${type} spells`);
    }

    // Check if the targeting type is allowed
    if (spell.targeting && !SPELL_TYPES[type].allowedTargeting.includes(spell.targeting)) {
      errors.push(`Targeting type "${spell.targeting}" not allowed for ${type} spells`);
    }

    // Check if the duration type is allowed
    if (spell.duration && !SPELL_TYPES[type].allowedDurations.includes(spell.duration)) {
      errors.push(`Duration type "${spell.duration}" not allowed for ${type} spells`);
    }

    // Specific validations for ACTION spells
    if (type === 'ACTION') {
      if (spell.castTime < 0) {
        errors.push('Cast time cannot be negative');
      }

      if (spell.castTimeType && !['IMMEDIATE', 'NEXT_TURN', 'X_TURNS', 'END_OF_ROUND'].includes(spell.castTimeType)) {
        errors.push(`Invalid cast time type: ${spell.castTimeType}`);
      }
    }

    // Specific validations for CHANNELED spells
    if (type === 'CHANNELED') {
      if (spell.maxChannelDuration <= 0) {
        errors.push('Channel duration must be positive');
      }

      if (spell.tickFrequency && !['START_OF_TURN', 'END_OF_TURN', 'EVERY_TURN', 'CONTINUOUS'].includes(spell.tickFrequency)) {
        errors.push(`Invalid tick frequency: ${spell.tickFrequency}`);
      }
    }

    // Specific validations for REACTION spells
    if (type === 'REACTION') {
      if (!spell.triggerType) {
        errors.push('Reaction spells must define a trigger type');
      }

      if (spell.availabilityType && !['ALWAYS', 'PREPARED', 'LIMITED'].includes(spell.availabilityType)) {
        errors.push(`Invalid availability type: ${spell.availabilityType}`);
      }
    }

    // Specific validations for TRAP spells
    if (type === 'TRAP') {
      if (!spell.triggerType) {
        errors.push('Trap spells must define a trigger type');
      }

      if (spell.placementTime < 0) {
        errors.push('Placement time cannot be negative');
      }

      if (spell.maxTriggers <= 0) {
        errors.push('Maximum triggers must be positive');
      }

      if (spell.visibility && !['hidden', 'visible', 'magical'].includes(spell.visibility)) {
        errors.push(`Invalid visibility type: ${spell.visibility}`);
      }

      if (spell.trapDuration && !['timed', 'permanent', 'conditional'].includes(spell.trapDuration)) {
        errors.push(`Invalid trap duration type: ${spell.trapDuration}`);
      }
    }

    // Specific validations for STATE spells
    if (type === 'STATE') {
      if (!spell.activationCondition) {
        errors.push('State spells must define an activation condition');
      }

      if (spell.cooldownAfterTrigger < 0) {
        errors.push('Cooldown after trigger cannot be negative');
      }

      if (spell.stateVisibility && !['visible', 'hidden', 'self_only'].includes(spell.stateVisibility)) {
        errors.push(`Invalid state visibility type: ${spell.stateVisibility}`);
      }

      if (spell.triggerPriority && !['high', 'normal', 'low'].includes(spell.triggerPriority)) {
        errors.push(`Invalid trigger priority: ${spell.triggerPriority}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get example spells for each type
  function getExampleSpells() {
    return {
      action: {
        fireball: createSpell('ACTION', {
          name: 'Fireball',
          description: 'Launches a ball of fire that explodes on impact',
          castTime: 1,
          castTimeType: 'NEXT_TURN',
          effect: 'damage',
          targeting: 'area',
          duration: 'instant',
          interruptible: true,
          scalingWithCastTime: { damage: 1.5 } // 50% more damage if fully cast
        }),

        quickHeal: createSpell('ACTION', {
          name: 'Quick Heal',
          description: 'Instantly heals a target',
          castTime: 0, // Instant cast
          effect: 'heal',
          targeting: 'single',
          duration: 'instant'
        })
      },

      channeled: {
        arcaneBeam: createSpell('CHANNELED', {
          name: 'Arcane Beam',
          description: 'Channel a continuous beam of arcane energy',
          maxChannelDuration: 3,
          tickFrequency: 'CONTINUOUS',
          effect: 'damage',
          targeting: 'single',
          concentrationDC: 12,
          breakEffects: { damage: 0.5 } // Deal 50% damage when broken
        })
      },

      passive: {
        toughSkin: createSpell('PASSIVE', {
          name: 'Tough Skin',
          description: 'Passively reduces physical damage taken',
          effect: 'buff',
          targeting: 'self',
          duration: 'permanent'
        })
      },

      reaction: {
        counterSpell: createSpell('REACTION', {
          name: 'Counterspell',
          description: 'Interrupt an enemy casting a spell',
          triggerType: 'enemy_spell_cast',
          availabilityType: 'PREPARED',
          preparationCost: 1,
          effect: 'counter',
          targeting: 'single',
          duration: 'instant'
        })
      },

      trap: {
        fireTrap: createSpell('TRAP', {
          name: 'Fire Trap',
          description: 'A hidden trap that erupts in flames when triggered',
          triggerType: 'proximity',
          effect: 'damage',
          targeting: 'area',
          duration: 'instant',
          detectionDC: 14,
          disarmDC: 16,
          maxTriggers: 1,
          visibility: 'hidden'
        }),

        alarmTrap: createSpell('TRAP', {
          name: 'Alarm Trap',
          description: 'Alerts you when an intruder enters the area',
          triggerType: 'proximity',
          effect: 'utility',
          targeting: 'area',
          duration: 'permanent',
          detectionDC: 18,
          disarmDC: 12,
          maxTriggers: -1, // Unlimited triggers
          visibility: 'magical'
        })
      },

      state: {
        lastStand: createSpell('STATE', {
          name: 'Last Stand',
          description: 'When health falls below 25%, gain temporary damage reduction',
          activationCondition: 'health_threshold',
          resourceThreshold: { resource: 'health', threshold: 25, comparison: 'below' },
          effect: 'buff',
          targeting: 'self',
          duration: 'timed',
          cooldownAfterTrigger: 60, // 60 second cooldown
          maxTriggers: 1, // Once per combat
          stateVisibility: 'visible'
        }),

        manaShield: createSpell('STATE', {
          name: 'Mana Shield',
          description: 'When taking damage, convert a portion to mana cost instead',
          activationCondition: 'damage_taken',
          effect: 'utility',
          targeting: 'self',
          duration: 'permanent',
          cooldownAfterTrigger: 0, // No cooldown
          maxTriggers: -1, // Unlimited triggers
          stateVisibility: 'visible',
          deactivationCondition: 'mana_depleted'
        })
      }
    };
  }

  // Export the spell type system
  export {
    SPELL_TYPES,
    createSpell,
    validateSpellConfig,
    getExampleSpells
  };