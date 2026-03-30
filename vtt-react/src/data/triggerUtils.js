/**
 * Utility functions for handling on-hit and on-damage trigger systems
 */

// Trigger types
export const TRIGGER_TYPES = {
    ON_HIT: 'onHit',             // Triggers when spell hits a target
    ON_DAMAGE: 'onDamage',       // Triggers when target takes damage
    ON_HEAL: 'onHeal',           // Triggers when target is healed
    ON_CAST: 'onCast',           // Triggers when spell is cast
    ON_CRIT: 'onCrit',           // Triggers on critical hit
    ON_KILL: 'onKill',           // Triggers when target is killed
    ON_APPLY_EFFECT: 'onApplyEffect', // Triggers when an effect is applied
    ON_REMOVE_EFFECT: 'onRemoveEffect', // Triggers when an effect is removed
    ON_DODGE: 'onDodge',         // Triggers when attack is dodged
    ON_BLOCK: 'onBlock',         // Triggers when attack is blocked
    ON_RESIST: 'onResist',       // Triggers when spell is resisted
    ON_INTERRUPT: 'onInterrupt'  // Triggers when spell is interrupted
  };
  
  // Trigger conditions (additional requirements for trigger activation)
  export const TRIGGER_CONDITIONS = {
    HEALTH_BELOW: 'healthBelow',         // Target health below percentage
    HEALTH_ABOVE: 'healthAbove',         // Target health above percentage
    TARGET_HAS_EFFECT: 'targetHasEffect', // Target has specific effect
    CASTER_HAS_EFFECT: 'casterHasEffect', // Caster has specific effect
    TARGET_IS_TYPE: 'targetIsType',      // Target is of specific type
    DAMAGE_TYPE_IS: 'damageTypeIs',      // Damage is of specific type
    RANDOM_CHANCE: 'randomChance',       // Random chance to trigger
    COMBO_POINTS: 'comboPoints',         // Requires combo points
    RESOURCE_ABOVE: 'resourceAbove',     // Resource above threshold
    RESOURCE_BELOW: 'resourceBelow',     // Resource below threshold
    IN_COMBAT: 'inCombat',               // Must be in combat
    OUT_OF_COMBAT: 'outOfCombat',        // Must be out of combat
    TIME_OF_DAY: 'timeOfDay'             // Specific game time of day
  };
  
  /**
   * Generate a unique ID for a trigger
   * @returns {string} Unique trigger ID
   */
  export const generateTriggerId = () => {
    return `trigger_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  
  /**
   * Create a new trigger
   * @param {string} type - Trigger type from TRIGGER_TYPES
   * @param {Object} options - Trigger options
   * @returns {Object} Trigger object
   */
  export const createTrigger = (type, options = {}) => {
    if (!Object.values(TRIGGER_TYPES).includes(type)) {
      console.error(`Invalid trigger type: ${type}`);
      return null;
    }
    
    return {
      id: options.id || generateTriggerId(),
      type,
      effect: options.effect || '',       // Effect description or action
      chance: options.chance ?? 100,      // Proc chance (0-100)
      duration: options.duration || 0,    // Duration in seconds (0 = instant)
      cooldown: options.cooldown || 0,    // Internal cooldown in seconds
      conditions: options.conditions || [],// Additional conditions for trigger
      value: options.value || null,       // Effect value/magnitude
      target: options.target || 'target', // target, caster, aoe, etc.
      stacks: options.stacks || 1,        // Number of stacks to apply
      icon: options.icon || null,         // Visual icon
      animation: options.animation || null // Visual effect
    };
  };
  
  /**
   * Check if a trigger's conditions are met
   * @param {Object} trigger - The trigger to check
   * @param {Object} context - Context information for condition evaluation
   * @returns {boolean} True if conditions are met
   */
  export const checkTriggerConditions = (trigger, context) => {
    if (!trigger.conditions || trigger.conditions.length === 0) {
      return true; // No conditions to check
    }
    
    // Check each condition
    for (const condition of trigger.conditions) {
      const { type, param, value } = condition;
      
      switch (type) {
        case TRIGGER_CONDITIONS.HEALTH_BELOW:
          if (!context.target || (context.target.health / context.target.maxHealth) * 100 > value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.HEALTH_ABOVE:
          if (!context.target || (context.target.health / context.target.maxHealth) * 100 < value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.TARGET_HAS_EFFECT:
          if (!context.target || !context.target.effects || 
              !context.target.effects.some(effect => effect.type === param)) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.CASTER_HAS_EFFECT:
          if (!context.caster || !context.caster.effects || 
              !context.caster.effects.some(effect => effect.type === param)) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.TARGET_IS_TYPE:
          if (!context.target || context.target.type !== param) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.DAMAGE_TYPE_IS:
          if (!context.damageType || context.damageType !== param) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.RANDOM_CHANCE:
          // Value is percentage chance
          if (Math.random() * 100 > value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.COMBO_POINTS:
          if (!context.caster || !context.caster.resources || 
              (context.caster.resources.comboPoints || 0) < value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.RESOURCE_ABOVE:
          if (!context.caster || !context.caster.resources || 
              (context.caster.resources[param] || 0) <= value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.RESOURCE_BELOW:
          if (!context.caster || !context.caster.resources || 
              (context.caster.resources[param] || 0) >= value) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.IN_COMBAT:
          if (!context.caster || !context.caster.inCombat) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.OUT_OF_COMBAT:
          if (!context.caster || context.caster.inCombat) {
            return false;
          }
          break;
          
        case TRIGGER_CONDITIONS.TIME_OF_DAY:
          if (!context.timeOfDay || context.timeOfDay !== param) {
            return false;
          }
          break;
          
        default:
          console.warn(`Unknown condition type: ${type}`);
          break;
      }
    }
    
    // All conditions passed
    return true;
  };
  
  /**
   * Check if a trigger can proc based on chance and conditions
   * @param {Object} trigger - The trigger to check
   * @param {Object} context - Contextual information for trigger
   * @returns {boolean} True if trigger should proc
   */
  export const canTriggerProc = (trigger, context) => {
    // Check if trigger is on cooldown
    if (trigger.lastProcTime && trigger.cooldown > 0) {
      const timeSinceLastProc = Date.now() - trigger.lastProcTime;
      if (timeSinceLastProc < trigger.cooldown * 1000) {
        return false;
      }
    }
    
    // Check proc chance
    const roll = Math.random() * 100;
    if (roll > trigger.chance) {
      return false;
    }
    
    // Check conditions
    return checkTriggerConditions(trigger, context);
  };
  
  /**
   * Process a trigger and generate its effects
   * @param {Object} trigger - The trigger being processed
   * @param {Object} context - Contextual information for trigger
   * @returns {Object} Trigger results including effects to apply
   */
  export const processTrigger = (trigger, context) => {
    if (!canTriggerProc(trigger, context)) {
      return { procced: false };
    }
    
    // Update last proc time for cooldown tracking
    const updatedTrigger = {
      ...trigger,
      lastProcTime: Date.now()
    };
    
    // Process trigger based on type
    const result = {
      procced: true,
      trigger: updatedTrigger,
      effects: []
    };
    
    // Determine target for the effect
    let targetEntity;
    switch (trigger.target) {
      case 'caster':
        targetEntity = context.caster;
        break;
      case 'target':
        targetEntity = context.target;
        break;
      case 'both':
        targetEntity = [context.caster, context.target];
        break;
      case 'aoe':
        targetEntity = context.aoeTargets || [];
        break;
      default:
        targetEntity = context.target;
    }
    
    // Add effect information
    if (typeof targetEntity === 'object' && !Array.isArray(targetEntity)) {
      // Single target
      result.effects.push({
        target: targetEntity,
        effect: trigger.effect,
        duration: trigger.duration,
        value: trigger.value,
        stacks: trigger.stacks
      });
    } else if (Array.isArray(targetEntity)) {
      // Multiple targets
      for (const target of targetEntity) {
        result.effects.push({
          target,
          effect: trigger.effect,
          duration: trigger.duration,
          value: trigger.value,
          stacks: trigger.stacks
        });
      }
    }
    
    return result;
  };
  
  /**
   * Process on-hit triggers for a spell
   * @param {Object} spell - The spell that hit
   * @param {Object} target - The target that was hit
   * @param {Object} caster - The entity that cast the spell
   * @param {Object} hitInfo - Information about the hit (damage, crit, etc)
   * @returns {Array} Array of trigger results
   */
  export const processOnHitTriggers = (spell, target, caster, hitInfo = {}) => {
    if (!spell || !spell.effects || !spell.effects.triggers || !spell.effects.triggers.onHit) {
      return [];
    }
    
    const context = {
      spell,
      target,
      caster,
      damageType: hitInfo.damageType,
      damage: hitInfo.damage,
      isCrit: hitInfo.isCrit,
      aoeTargets: hitInfo.aoeTargets
    };
    
    const results = [];
    
    for (const trigger of spell.effects.triggers.onHit) {
      const result = processTrigger(trigger, context);
      if (result.procced) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  /**
   * Process on-damage triggers for an entity
   * @param {Object} entity - The entity taking damage
   * @param {Object} source - The damage source
   * @param {Object} damageInfo - Information about the damage
   * @returns {Array} Array of trigger results
   */
  export const processOnDamageTriggers = (entity, source, damageInfo = {}) => {
    if (!entity || !entity.effects || !entity.effects.triggers || !entity.effects.triggers.onDamage) {
      return [];
    }
    
    const context = {
      target: entity,
      caster: entity, // For on-damage, the entity with the trigger is both target and "caster"
      source,
      damageType: damageInfo.damageType,
      damage: damageInfo.damage,
      isCrit: damageInfo.isCrit
    };
    
    const results = [];
    
    for (const trigger of entity.effects.triggers.onDamage) {
      const result = processTrigger(trigger, context);
      if (result.procced) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  /**
   * Process on-cast triggers for a spell
   * @param {Object} spell - The spell being cast
   * @param {Object} caster - The entity casting the spell
   * @param {Object} target - The target of the spell (if any)
   * @returns {Array} Array of trigger results
   */
  export const processOnCastTriggers = (spell, caster, target = null) => {
    if (!caster || !caster.effects || !caster.effects.triggers || !caster.effects.triggers.onCast) {
      return [];
    }
    
    const context = {
      spell,
      caster,
      target
    };
    
    const results = [];
    
    for (const trigger of caster.effects.triggers.onCast) {
      // Some on-cast triggers may be specific to certain spells
      if (trigger.spellId && trigger.spellId !== spell.id) {
        continue;
      }
      
      const result = processTrigger(trigger, context);
      if (result.procced) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  /**
   * Process on-heal triggers
   * @param {Object} spell - The healing spell
   * @param {Object} target - The target being healed
   * @param {Object} caster - The entity casting the heal
   * @param {Object} healInfo - Information about the healing
   * @returns {Array} Array of trigger results
   */
  export const processOnHealTriggers = (spell, target, caster, healInfo = {}) => {
    if (!spell || !spell.effects || !spell.effects.triggers || !spell.effects.triggers.onHeal) {
      return [];
    }
    
    const context = {
      spell,
      target,
      caster,
      healing: healInfo.amount,
      isCrit: healInfo.isCrit
    };
    
    const results = [];
    
    for (const trigger of spell.effects.triggers.onHeal) {
      const result = processTrigger(trigger, context);
      if (result.procced) {
        results.push(result);
      }
    }
    
    return results;
  };
  
  /**
   * Create a condition for a trigger
   * @param {string} type - Condition type from TRIGGER_CONDITIONS
   * @param {*} value - Threshold or comparison value
   * @param {string} [param] - Additional parameter for certain conditions
   * @returns {Object} Condition object
   */
  export const createTriggerCondition = (type, value, param = null) => {
    if (!Object.values(TRIGGER_CONDITIONS).includes(type)) {
      console.error(`Invalid trigger condition type: ${type}`);
      return null;
    }
    
    return {
      type,
      value,
      param
    };
  };
  
  /**
   * Format trigger chance description
   * @param {number} chance - Proc chance (0-100)
   * @returns {string} Formatted description
   */
  export const formatTriggerChance = (chance) => {
    if (chance >= 100) {
      return 'Always';
    } else if (chance <= 0) {
      return 'Never';
    }
    
    return `${chance}% chance`;
  };
  
  /**
   * Generate a readable description of a trigger
   * @param {Object} trigger - The trigger to describe
   * @returns {string} Human-readable description
   */
  export const generateTriggerDescription = (trigger) => {
    if (!trigger) return '';
    
    // Build the basic description
    let description = '';
    
    // Describe when it triggers
    const triggerTypeDescriptions = {
      [TRIGGER_TYPES.ON_HIT]: 'When this spell hits a target',
      [TRIGGER_TYPES.ON_DAMAGE]: 'When you take damage',
      [TRIGGER_TYPES.ON_HEAL]: 'When this spell heals a target',
      [TRIGGER_TYPES.ON_CAST]: 'When you cast this spell',
      [TRIGGER_TYPES.ON_CRIT]: 'When this spell critically hits',
      [TRIGGER_TYPES.ON_KILL]: 'When this spell kills a target',
      [TRIGGER_TYPES.ON_APPLY_EFFECT]: 'When an effect is applied',
      [TRIGGER_TYPES.ON_REMOVE_EFFECT]: 'When an effect is removed',
      [TRIGGER_TYPES.ON_DODGE]: 'When an attack is dodged',
      [TRIGGER_TYPES.ON_BLOCK]: 'When an attack is blocked',
      [TRIGGER_TYPES.ON_RESIST]: 'When this spell is resisted',
      [TRIGGER_TYPES.ON_INTERRUPT]: 'When this spell is interrupted'
    };
    
    description += triggerTypeDescriptions[trigger.type] || 'When triggered';
    
    // Add chance if not 100%
    if (trigger.chance < 100) {
      description += `, ${formatTriggerChance(trigger.chance)}`;
    }
    
    // Add main effect
    description += `: ${trigger.effect}`;
    
    // Add duration if not instant
    if (trigger.duration > 0) {
      description += ` for ${trigger.duration} ${trigger.duration === 1 ? 'second' : 'seconds'}`;
    }
    
    // Add target if not default
    if (trigger.target && trigger.target !== 'target') {
      const targetDescriptions = {
        'caster': 'to yourself',
        'both': 'to both you and the target',
        'aoe': 'to all targets in the area'
      };
      
      description += ` ${targetDescriptions[trigger.target] || `to the ${trigger.target}`}`;
    }
    
    // Add cooldown if any
    if (trigger.cooldown > 0) {
      description += ` (${trigger.cooldown}s cooldown)`;
    }
    
    return description;
  };
  
  /**
   * Validate a trigger for completeness and consistency
   * @param {Object} trigger - The trigger to validate
   * @returns {Object} Validation result with status and errors
   */
  export const validateTrigger = (trigger) => {
    const errors = [];
    
    if (!trigger) {
      return { valid: false, errors: ['No trigger provided'] };
    }
    
    // Check required fields
    if (!trigger.type) {
      errors.push('Trigger type is required');
    } else if (!Object.values(TRIGGER_TYPES).includes(trigger.type)) {
      errors.push(`Invalid trigger type: ${trigger.type}`);
    }
    
    if (!trigger.effect || trigger.effect.trim() === '') {
      errors.push('Trigger effect description is required');
    }
    
    // Validate numeric fields
    if (typeof trigger.chance !== 'number' || trigger.chance < 0 || trigger.chance > 100) {
      errors.push('Trigger chance must be a number between 0-100');
    }
    
    if (typeof trigger.duration !== 'number' || trigger.duration < 0) {
      errors.push('Trigger duration must be a non-negative number');
    }
    
    if (typeof trigger.cooldown !== 'number' || trigger.cooldown < 0) {
      errors.push('Trigger cooldown must be a non-negative number');
    }
    
    // Validate conditions if present
    if (trigger.conditions && Array.isArray(trigger.conditions)) {
      trigger.conditions.forEach((condition, index) => {
        if (!condition.type) {
          errors.push(`Condition #${index + 1} is missing a type`);
        } else if (!Object.values(TRIGGER_CONDITIONS).includes(condition.type)) {
          errors.push(`Condition #${index + 1} has invalid type: ${condition.type}`);
        }
        
        // Some conditions require parameters
        const paramRequiredConditions = [
          TRIGGER_CONDITIONS.TARGET_HAS_EFFECT,
          TRIGGER_CONDITIONS.CASTER_HAS_EFFECT,
          TRIGGER_CONDITIONS.TARGET_IS_TYPE,
          TRIGGER_CONDITIONS.DAMAGE_TYPE_IS,
          TRIGGER_CONDITIONS.RESOURCE_ABOVE,
          TRIGGER_CONDITIONS.RESOURCE_BELOW,
          TRIGGER_CONDITIONS.TIME_OF_DAY
        ];
        
        if (paramRequiredConditions.includes(condition.type) && !condition.param) {
          errors.push(`Condition #${index + 1} (${condition.type}) requires a parameter`);
        }
        
        // Some conditions require numeric values
        const numericValueConditions = [
          TRIGGER_CONDITIONS.HEALTH_BELOW,
          TRIGGER_CONDITIONS.HEALTH_ABOVE,
          TRIGGER_CONDITIONS.RANDOM_CHANCE,
          TRIGGER_CONDITIONS.COMBO_POINTS,
          TRIGGER_CONDITIONS.RESOURCE_ABOVE,
          TRIGGER_CONDITIONS.RESOURCE_BELOW
        ];
        
        if (numericValueConditions.includes(condition.type) && 
            (typeof condition.value !== 'number' || condition.value < 0)) {
          errors.push(`Condition #${index + 1} (${condition.type}) requires a non-negative numeric value`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };