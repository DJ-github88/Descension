/**
 * Spell Validator
 * 
 * Validates spell configurations, ensuring they are properly structured
 * and providing warnings about potential balance issues.
 */

import {
    EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES_DATA,
    TARGETING_TYPES,
    DURATION_TYPES,
    DAMAGE_TYPES,
    AOE_SHAPES,
    POSITIVE_STATUS_EFFECTS,
    NEGATIVE_STATUS_EFFECTS,
    COMBAT_STAT_MODIFIERS,
    UTILITY_EFFECT_TYPES,
    isValidDiceNotation
  } from '../../data/enhancedEffectSystemData';
  
  import { calculateTotalResources } from '../mechanics/resourceManager';
  
  /**
   * Validate a complete spell configuration
   */
  export function validateSpellConfig(config) {
    const errors = {};
    const warnings = {};
    
    // Validate basic required fields
    if (!config.name) {
      errors.name = 'Spell name is required';
    }
    
    if (!config.effectTypes || !Array.isArray(config.effectTypes) || config.effectTypes.length === 0) {
      errors.effectTypes = 'At least one effect type is required';
    } else {
      // Validate that all effect types are valid
      const invalidTypes = config.effectTypes.filter(type => !EFFECT_TYPES.some(et => et.id === type));
      if (invalidTypes.length > 0) {
        errors.effectTypes = `Invalid effect types: ${invalidTypes.join(', ')}`;
      }
    }
    
    // Validate level if present
    if (config.level !== undefined) {
      if (typeof config.level !== 'number' || config.level < 1 || config.level > 10) {
        errors.level = 'Level must be a number between 1 and 10';
      }
    }
    
    // Run specialized validation for each configuration section
    const effectsValidation = validateEffects(config);
    const targetingValidation = validateTargeting(config);
    const durationValidation = validateDuration(config);
    const resourceValidation = validateResources(config);
    
    // Merge all validation results
    Object.assign(errors, 
      effectsValidation.errors, 
      targetingValidation.errors, 
      durationValidation.errors, 
      resourceValidation.errors
    );
    
    Object.assign(warnings, 
      effectsValidation.warnings, 
      targetingValidation.warnings, 
      durationValidation.warnings, 
      resourceValidation.warnings
    );
    
    // Validate that effect types match their configurations
    validateTypeConsistency(config, errors, warnings);
    
    // Generate balance warnings
    const balanceWarnings = generateBalanceWarnings(config);
    Object.assign(warnings, balanceWarnings);
    
    return { 
      valid: Object.keys(errors).length === 0,
      errors,
      warnings,
      suggestions: suggestImprovements(config)
    };
  }
  
  /**
   * Validate effect-specific configurations
   */
  export function validateEffects(config) {
    const errors = {};
    const warnings = {};
    
    // Check if effect types are consistent with the provided configurations
    
    // Validate damage config if damage effect is present
    if (config.effectTypes && config.effectTypes.includes('damage')) {
      if (!config.damageConfig) {
        errors.damageConfig = 'Damage configuration is required for damage effects';
      } else {
        // Validate damage types
        if (!config.damageConfig.damageTypes || !Array.isArray(config.damageConfig.damageTypes) || config.damageConfig.damageTypes.length === 0) {
          errors.damageTypes = 'At least one damage type must be selected';
        } else {
          // Check that all damage types are valid
          const invalidDamageTypes = config.damageConfig.damageTypes.filter(
            type => !DAMAGE_TYPES.some(dt => dt.id === type)
          );
          if (invalidDamageTypes.length > 0) {
            errors.damageTypes = `Invalid damage types: ${invalidDamageTypes.join(', ')}`;
          }
        }
        
        // Validate damage dice notation
        if (!config.damageConfig.diceNotation) {
          errors.damageDice = 'Dice notation is required for damage amount';
        } else if (!isValidDiceNotation(config.damageConfig.diceNotation)) {
          errors.damageDice = 'Invalid dice notation format';
        }
        
        // Validate chain effect config if enabled
        if (config.damageConfig.useChainEffect) {
          if (!config.damageConfig.chainConfig) {
            errors.chainConfig = 'Chain configuration is required when chain effect is enabled';
          } else {
            if (config.damageConfig.chainConfig.targets === undefined || 
                config.damageConfig.chainConfig.targets < 1) {
              errors.chainTargets = 'Chain targets must be at least 1';
            }
            
            if (!config.damageConfig.chainConfig.falloffType) {
              errors.falloffType = 'Falloff type is required for chain effects';
            }
          }
        }
        
        // Validate critical effect config if enabled
        if (config.damageConfig.useCriticalEffect) {
          if (!config.damageConfig.criticalConfig) {
            errors.criticalConfig = 'Critical configuration is required when critical effect is enabled';
          } else {
            if (config.damageConfig.criticalConfig.criticalMultiplier === undefined || 
                config.damageConfig.criticalConfig.criticalMultiplier <= 0) {
              errors.criticalMultiplier = 'Critical multiplier must be greater than 0';
            }
            
            // Validate critical effects if any
            if (config.damageConfig.criticalConfig.effects) {
              const invalidCritEffects = config.damageConfig.criticalConfig.effects.filter(
                effect => !ENHANCED_EFFECT_TYPES_DATA.some(ce => ce.id === effect)
              );
              if (invalidCritEffects.length > 0) {
                errors.criticalEffects = `Invalid critical effects: ${invalidCritEffects.join(', ')}`;
              }
            }
          }
        }
      }
    }
    
    // Validate healing config if healing effect is present
    if (config.effectTypes && config.effectTypes.includes('healing')) {
      if (!config.healingConfig) {
        errors.healingConfig = 'Healing configuration is required for healing effects';
      } else {
        // Validate healing type
        if (!config.healingConfig.healingType) {
          errors.healingType = 'Healing type is required';
        }
        
        // Validate healing dice notation
        if (!config.healingConfig.diceNotation) {
          errors.healingDice = 'Dice notation is required for healing amount';
        } else if (!isValidDiceNotation(config.healingConfig.diceNotation)) {
          errors.healingDice = 'Invalid dice notation format';
        }
        
        // Validate absorption shield if enabled
        if (config.healingConfig.useAbsorptionShield) {
          if (!config.healingConfig.shieldConfig) {
            errors.shieldConfig = 'Shield configuration is required when absorption shield is enabled';
          } else {
            if (!config.healingConfig.shieldConfig.shieldType) {
              errors.shieldType = 'Shield type is required';
            } else {
              // Validate shield type is valid
              if (!ENHANCED_EFFECT_TYPES_DATA.some(st => st.id === config.healingConfig.shieldConfig.shieldType)) {
                errors.shieldType = 'Invalid shield type';
              }
            }
            
            if (!config.healingConfig.shieldConfig.shieldAmount) {
              errors.shieldAmount = 'Shield amount is required';
            } else if (!isValidDiceNotation(config.healingConfig.shieldConfig.shieldAmount)) {
              errors.shieldAmount = 'Invalid shield amount dice notation';
            }
          }
        }
      }
    }
    
    // Validate buff config if buff effect is present
    if (config.effectTypes && config.effectTypes.includes('buff')) {
      if (!config.buffConfig) {
        errors.buffConfig = 'Buff configuration is required for buff effects';
      } else {
        // Check that we have either stat modifiers or status effects
        const hasStatModifiers = config.buffConfig.statModifiers && 
                                Object.keys(config.buffConfig.statModifiers).length > 0;
        const hasStatusEffects = config.buffConfig.statusEffects && 
                                Array.isArray(config.buffConfig.statusEffects) && 
                                config.buffConfig.statusEffects.length > 0;
        
        if (!hasStatModifiers && !hasStatusEffects) {
          errors.buffEffects = 'Buff must have at least one stat modifier or status effect';
        }
        
        // Validate stat modifiers if present
        if (hasStatModifiers) {
          const invalidStats = Object.keys(config.buffConfig.statModifiers).filter(
            stat => !ENHANCED_EFFECT_TYPES_DATA.some(csm => csm.id === stat)
          );
          if (invalidStats.length > 0) {
            errors.buffStatModifiers = `Invalid stat modifiers: ${invalidStats.join(', ')}`;
          }
        }
        
        // Validate status effects if present
        if (hasStatusEffects) {
          const invalidEffects = config.buffConfig.statusEffects.filter(
            effect => !ENHANCED_EFFECT_TYPES_DATA.some(pse => pse.id === effect)
          );
          if (invalidEffects.length > 0) {
            errors.buffStatusEffects = `Invalid status effects: ${invalidEffects.join(', ')}`;
          }
          
          // Check if effect parameters are provided for effects that require them
          if (config.buffConfig.statusEffects.length > 0) {
            const missingParams = [];
            
            for (const effectId of config.buffConfig.statusEffects) {
              const effect = ENHANCED_EFFECT_TYPES_DATA.find(pse => pse.id === effectId);
              if (effect && effect.requiresParameters && 
                  (!config.buffConfig.effectParameters || !config.buffConfig.effectParameters[effectId])) {
                missingParams.push(effectId);
              }
            }
            
            if (missingParams.length > 0) {
              errors.buffParameters = `Missing required parameters for effects: ${missingParams.join(', ')}`;
            }
          }
        }
      }
    }
    
    // Validate debuff config if debuff effect is present
    if (config.effectTypes && config.effectTypes.includes('debuff')) {
      if (!config.debuffConfig) {
        errors.debuffConfig = 'Debuff configuration is required for debuff effects';
      } else {
        // Check that we have either stat modifiers or status effects
        const hasStatModifiers = config.debuffConfig.statModifiers && 
                                Object.keys(config.debuffConfig.statModifiers).length > 0;
        const hasStatusEffects = config.debuffConfig.statusEffects && 
                                Array.isArray(config.debuffConfig.statusEffects) && 
                                config.debuffConfig.statusEffects.length > 0;
        
        if (!hasStatModifiers && !hasStatusEffects) {
          errors.debuffEffects = 'Debuff must have at least one stat modifier or status effect';
        }
        
        // Validate stat modifiers if present
        if (hasStatModifiers) {
          const invalidStats = Object.keys(config.debuffConfig.statModifiers).filter(
            stat => !ENHANCED_EFFECT_TYPES_DATA.some(csm => csm.id === stat)
          );
          if (invalidStats.length > 0) {
            errors.debuffStatModifiers = `Invalid stat modifiers: ${invalidStats.join(', ')}`;
          }
        }
        
        // Validate status effects if present
        if (hasStatusEffects) {
          const invalidEffects = config.debuffConfig.statusEffects.filter(
            effect => !ENHANCED_EFFECT_TYPES_DATA.some(nse => nse.id === effect)
          );
          if (invalidEffects.length > 0) {
            errors.debuffStatusEffects = `Invalid status effects: ${invalidEffects.join(', ')}`;
          }
          
          // Check if effect parameters are provided for effects that require them
          if (config.debuffConfig.statusEffects.length > 0) {
            const missingParams = [];
            
            for (const effectId of config.debuffConfig.statusEffects) {
              const effect = ENHANCED_EFFECT_TYPES_DATA.find(nse => nse.id === effectId);
              if (effect && effect.requiresParameters && 
                  (!config.debuffConfig.effectParameters || !config.debuffConfig.effectParameters[effectId])) {
                missingParams.push(effectId);
              }
            }
            
            if (missingParams.length > 0) {
              errors.debuffParameters = `Missing required parameters for effects: ${missingParams.join(', ')}`;
            }
          }
        }
      }
    }
    
    // Validate utility config if utility effect is present
    if (config.effectTypes && config.effectTypes.includes('utility')) {
      if (!config.utilityConfig) {
        errors.utilityConfig = 'Utility configuration is required for utility effects';
      } else {
        // Validate utility type
        if (!config.utilityConfig.utilityType) {
          errors.utilityType = 'Utility type is required';
        } else {
          // Validate utility type is valid
          if (!ENHANCED_EFFECT_TYPES_DATA.some(ut => ut.id === config.utilityConfig.utilityType)) {
            errors.utilityType = 'Invalid utility type';
          } else {
            // Validate utility subtype
            if (!config.utilityConfig.utilitySubtype) {
              errors.utilitySubtype = 'Utility subtype is required';
            } else {
              // Validate utility subtype is valid for this type
              const utilityType = ENHANCED_EFFECT_TYPES_DATA.find(ut => ut.id === config.utilityConfig.utilityType);
              if (utilityType && !utilityType.subtypes.some(st => st.id === config.utilityConfig.utilitySubtype)) {
                errors.utilitySubtype = 'Invalid utility subtype for the selected utility type';
              }
              
              // Validate parameters if required
              if (utilityType) {
                const subtype = utilityType.subtypes.find(st => st.id === config.utilityConfig.utilitySubtype);
                if (subtype && subtype.parameters) {
                  const missingParams = [];
                  
                  for (const paramName of subtype.parameters) {
                    if (!config.utilityConfig.parameters || config.utilityConfig.parameters[paramName] === undefined) {
                      missingParams.push(paramName);
                    }
                  }
                  
                  if (missingParams.length > 0) {
                    errors.utilityParameters = `Missing required parameters: ${missingParams.join(', ')}`;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Validate persistent config if enabled
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      if (!config.persistentConfig.persistentType) {
        errors.persistentType = 'Persistent effect type is required';
      }
      
      if (!config.persistentConfig.tickFrequency) {
        errors.tickFrequency = 'Tick frequency is required for persistent effects';
      }
      
      // DOT/HOT validation
      if (config.persistentConfig.persistentType === 'dot' || config.persistentConfig.persistentType === 'hot') {
        if (!config.persistentConfig.tickDamage && !config.persistentConfig.tickHealing) {
          errors.tickEffect = 'Tick damage or healing amount is required for DOT/HOT effects';
        } else {
          // Validate tick damage/healing dice notation
          const tickValue = config.persistentConfig.tickDamage || config.persistentConfig.tickHealing;
          if (!isValidDiceNotation(tickValue)) {
            errors.tickEffect = 'Invalid tick effect dice notation';
          }
        }
      }
    }
    
    return { errors, warnings };
  }
  
  /**
   * Validate targeting configuration
   */
  export function validateTargeting(config) {
    const errors = {};
    const warnings = {};
    
    if (!config.targetingConfig) {
      errors.targetingConfig = 'Targeting configuration is required';
      return { errors, warnings };
    }
    
    // Validate targeting type
    if (!config.targetingConfig.targetingType) {
      errors.targetingType = 'Targeting type is required';
    } else {
      // Check if targeting type is valid
      if (!TARGETING_TYPES.some(tt => tt.id === config.targetingConfig.targetingType)) {
        errors.targetingType = 'Invalid targeting type';
      } else {
        // Targeting type specific validation
        switch (config.targetingConfig.targetingType) {
          case 'area':
            // Area targeting requires shape and size
            if (!config.targetingConfig.areaShape) {
              errors.areaShape = 'Area shape is required for area targeting';
            } else if (!AOE_SHAPES.some(shape => shape.id === config.targetingConfig.areaShape)) {
              errors.areaShape = 'Invalid area shape';
            }
            
            if (config.targetingConfig.areaSize === undefined || config.targetingConfig.areaSize <= 0) {
              errors.areaSize = 'Area size must be greater than 0';
            } else if (config.targetingConfig.areaSize > 100) {
              warnings.areaSize = 'Very large area size may cause balance issues';
            }
            break;
            
          case 'multi':
            // Multi-target requires target count
            if (config.targetingConfig.targetCount === undefined || config.targetingConfig.targetCount < 1) {
              errors.targetCount = 'Target count must be at least 1 for multi-targeting';
            } else if (config.targetingConfig.targetCount > 10) {
              warnings.targetCount = 'Very high target count may cause balance issues';
            }
            break;
            
          case 'self':
            // Self-targeting is incompatible with certain effect types
            if (config.effectTypes && config.effectTypes.includes('damage')) {
              warnings.selfDamage = 'Self-targeting damage effects are usually undesirable';
            }
            break;
        }
      }
    }
    
    // Check for inconsistencies between targeting and effects
    if (config.effectTypes && config.targetingConfig.targetingType) {
      // AOE healing is less common
      if (config.effectTypes.includes('healing') && config.targetingConfig.targetingType === 'area') {
        warnings.aoeHealing = 'Area of effect healing is unusual and may be difficult to use effectively';
      }
      
      // Self-targeting for certain effects is unusual
      if (config.targetingConfig.targetingType === 'self') {
        if (config.effectTypes.includes('control')) {
          warnings.selfControl = 'Self-targeting control effects are unusual';
        }
        if (config.effectTypes.includes('debuff')) {
          warnings.selfDebuff = 'Self-targeting debuff effects are usually undesirable';
        }
      }
    }
    
    return { errors, warnings };
  }
  
  /**
   * Validate duration configuration
   */
  export function validateDuration(config) {
    const errors = {};
    const warnings = {};
    
    if (!config.durationConfig) {
      errors.durationConfig = 'Duration configuration is required';
      return { errors, warnings };
    }
    
    // Validate duration type
    if (!config.durationConfig.durationType) {
      errors.durationType = 'Duration type is required';
    } else {
      // Check if duration type is valid
      if (!DURATION_TYPES.some(dt => dt.id === config.durationConfig.durationType)) {
        errors.durationType = 'Invalid duration type';
      } else {
        // Non-instant durations require a value
        if (config.durationConfig.durationType !== 'instant') {
          if (config.durationConfig.durationValue === undefined || config.durationConfig.durationValue <= 0) {
            errors.durationValue = 'Duration value must be greater than 0 for non-instant durations';
          } else {
            // Check for unusually long or short durations
            const durationType = config.durationConfig.durationType;
            const value = config.durationConfig.durationValue;
            
            if (durationType === 'rounds' && value > 20) {
              warnings.longDuration = 'Very long round duration may exceed most combat encounters';
            } else if (durationType === 'minutes' && value > 60) {
              warnings.longDuration = 'Very long minute duration may cause balance issues';
            } else if (durationType === 'hours' && value > 8) {
              warnings.longDuration = 'Very long hour duration extends beyond normal gameplay sessions';
            }
          }
        }
      }
    }
    
    // Check for concentration requirements
    if (config.durationConfig && config.durationConfig.requiresConcentration !== undefined) {
      if (typeof config.durationConfig.requiresConcentration !== 'boolean') {
        errors.concentration = 'Concentration requirement must be a boolean';
      } else if (config.durationConfig.requiresConcentration && config.durationConfig.durationType === 'instant') {
        errors.concentration = 'Instant effects cannot require concentration';
      }
    }
    
    // Check for inconsistencies between duration and effects
    if (config.effectTypes && config.durationConfig.durationType) {
      // Damage effects are usually instant
      if (config.effectTypes.includes('damage') && 
          config.durationConfig.durationType !== 'instant' && 
          !config.persistentConfig?.isPersistent) {
        warnings.nonInstantDamage = 'Non-instant damage effects are unusual unless configured as damage over time';
      }
      
      // Healing effects are usually instant
      if (config.effectTypes.includes('healing') && 
          config.durationConfig.durationType !== 'instant' && 
          !config.persistentConfig?.isPersistent &&
          !config.healingConfig?.useAbsorptionShield) {
        warnings.nonInstantHealing = 'Non-instant healing effects are unusual unless configured as healing over time or shields';
      }
    }
    
    return { errors, warnings };
  }
  
  /**
   * Validate resource configurations
   */
  export function validateResources(config) {
    const errors = {};
    const warnings = {};
    
    // Calculate expected resources
    const resources = calculateTotalResources(config);
    
    // Check for overridden resource costs
    if (config.resourceOptions) {
      // Action points override
      if (config.resourceOptions.actionPoints && config.resourceOptions.actionPoints.override !== undefined) {
        if (config.resourceOptions.actionPoints.override < 0) {
          errors.actionPoints = 'Action point cost cannot be negative';
        } else if (config.resourceOptions.actionPoints.override === 0) {
          warnings.freeActionPoints = 'Zero action point cost may cause balance issues';
        } else if (config.resourceOptions.actionPoints.override > 5) {
          warnings.highActionPoints = 'Very high action point cost may make the spell unusable';
        }
      }
      
      // Mana override
      if (config.resourceOptions.mana && config.resourceOptions.mana.override !== undefined) {
        if (config.resourceOptions.mana.override < 0) {
          errors.mana = 'Mana cost cannot be negative';
        } else if (config.resourceOptions.mana.override === 0 && resources.mana > 20) {
          warnings.freeMana = 'Zero mana cost for a powerful spell may cause balance issues';
        } else if (config.resourceOptions.mana.override > 100) {
          warnings.highMana = 'Very high mana cost may make the spell unusable';
        }
      }
      
      // Cooldown override
      if (config.resourceOptions.cooldown && config.resourceOptions.cooldown.override !== undefined) {
        if (config.resourceOptions.cooldown.override < 0) {
          errors.cooldown = 'Cooldown cannot be negative';
        } else if (config.resourceOptions.cooldown.override > 20) {
          warnings.longCooldown = 'Very long cooldown may make the spell rarely used';
        }
      }
      
      // Class resource validation
      if (config.resourceOptions.primaryClassResource) {
        const resourceType = config.resourceOptions.primaryClassResource;
        const validResourceTypes = [
          'rage', 'energy', 'focus', 'combo_points', 'soul_shards', 
          'holy_power', 'astral_power', 'chi'
        ];
        
        if (!validResourceTypes.includes(resourceType)) {
          errors.classResource = `Invalid class resource type: ${resourceType}`;
        }
      }
    }
    
    return { errors, warnings };
  }
  
  /**
   * Validate consistency between effect types and configurations
   */
  function validateTypeConsistency(config, errors, warnings) {
    if (!config.effectTypes || !Array.isArray(config.effectTypes)) {
      return;
    }
    
    // Check for missing configurations
    if (config.effectTypes.includes('damage') && !config.damageConfig) {
      errors.missingDamageConfig = 'Damage configuration is required when damage effect type is selected';
    }
    
    if (config.effectTypes.includes('healing') && !config.healingConfig) {
      errors.missingHealingConfig = 'Healing configuration is required when healing effect type is selected';
    }
    
    if (config.effectTypes.includes('buff') && !config.buffConfig) {
      errors.missingBuffConfig = 'Buff configuration is required when buff effect type is selected';
    }
    
    if (config.effectTypes.includes('debuff') && !config.debuffConfig) {
      errors.missingDebuffConfig = 'Debuff configuration is required when debuff effect type is selected';
    }
    
    if (config.effectTypes.includes('utility') && !config.utilityConfig) {
      errors.missingUtilityConfig = 'Utility configuration is required when utility effect type is selected';
    }
    
    // Check for extraneous configurations
    if (!config.effectTypes.includes('damage') && config.damageConfig) {
      warnings.unusedDamageConfig = 'Damage configuration exists but damage effect type is not selected';
    }
    
    if (!config.effectTypes.includes('healing') && config.healingConfig) {
      warnings.unusedHealingConfig = 'Healing configuration exists but healing effect type is not selected';
    }
    
    if (!config.effectTypes.includes('buff') && config.buffConfig) {
      warnings.unusedBuffConfig = 'Buff configuration exists but buff effect type is not selected';
    }
    
    if (!config.effectTypes.includes('debuff') && config.debuffConfig) {
      warnings.unusedDebuffConfig = 'Debuff configuration exists but debuff effect type is not selected';
    }
    
    if (!config.effectTypes.includes('utility') && config.utilityConfig) {
      warnings.unusedUtilityConfig = 'Utility configuration exists but utility effect type is not selected';
    }
  }
  
  /**
   * Generate warnings about potential balance issues
   */
  export function generateBalanceWarnings(config) {
    const warnings = {};
    
    // Level vs power balance checks
    if (config.level !== undefined && config.damageConfig && config.damageConfig.diceNotation) {
      // Estimate damage value
      const damageEstimate = estimateDiceValue(config.damageConfig.diceNotation);
      const expectedDamage = config.level * 5; // Simple heuristic: level * 5 damage
      
      if (damageEstimate > expectedDamage * 2) {
        warnings.highDamage = `Damage (est. ${Math.floor(damageEstimate)}) is much higher than expected (${expectedDamage}) for level ${config.level}`;
      } else if (damageEstimate < expectedDamage / 2) {
        warnings.lowDamage = `Damage (est. ${Math.floor(damageEstimate)}) is much lower than expected (${expectedDamage}) for level ${config.level}`;
      }
    }
    
    if (config.level !== undefined && config.healingConfig && config.healingConfig.diceNotation) {
      // Estimate healing value
      const healingEstimate = estimateDiceValue(config.healingConfig.diceNotation);
      const expectedHealing = config.level * 6; // Healing slightly higher than damage
      
      if (healingEstimate > expectedHealing * 2) {
        warnings.highHealing = `Healing (est. ${Math.floor(healingEstimate)}) is much higher than expected (${expectedHealing}) for level ${config.level}`;
      } else if (healingEstimate < expectedHealing / 2) {
        warnings.lowHealing = `Healing (est. ${Math.floor(healingEstimate)}) is much lower than expected (${expectedHealing}) for level ${config.level}`;
      }
    }
    
    // Check for multiple powerful effects combined
    if (config.effectTypes && config.effectTypes.length > 2) {
      // Check if combining damage with control or transformation
      if (config.effectTypes.includes('damage') && 
          (config.effectTypes.includes('control') || config.effectTypes.includes('transformation'))) {
        warnings.powerfulCombination = 'Combining damage with control or transformation effects may be too powerful';
      }
      
      // Check if combining healing with buffs and utility
      if (config.effectTypes.includes('healing') && 
          config.effectTypes.includes('buff') && 
          config.effectTypes.includes('utility')) {
        warnings.versatileCombination = 'Combining healing, buffs, and utility creates a very versatile spell that may overshadow others';
      }
    }
    
    // Check for AOE damage with control effects
    if (config.effectTypes && 
        config.effectTypes.includes('damage') && 
        config.effectTypes.includes('control') && 
        config.targetingConfig && 
        config.targetingConfig.targetingType === 'area') {
      warnings.aoeControlDamage = 'Area of effect damage combined with control effects may be too powerful';
    }
    
    // Check for unusual combinations
    if (config.effectTypes) {
      if (config.effectTypes.includes('buff') && config.effectTypes.includes('debuff')) {
        warnings.buffDebuffCombo = 'Combining buff and debuff effects in one spell is unusual';
      }
      
      if (config.effectTypes.includes('damage') && config.effectTypes.includes('healing')) {
        warnings.damageHealingCombo = 'Combining damage and healing effects in one spell is unusual';
      }
    }
    
    // Check for concentration requirements with instant effects
    if (config.durationConfig && 
        config.durationConfig.durationType === 'instant' && 
        config.durationConfig.requiresConcentration) {
      warnings.instantConcentration = 'Concentration requirement on instant effects makes no sense';
    }
    
    // Check for resource balance
    const resources = calculateTotalResources(config);
    
    // High action point cost
    if (resources.actionPoints > 3) {
      warnings.highActionPointCost = `High action point cost (${resources.actionPoints}) may limit spell usability`;
    }
    
    // High mana cost
    if (resources.mana > 50) {
      warnings.highManaCost = `High mana cost (${resources.mana}) may limit spell usability`;
    }
    
    // High cooldown
    if (resources.cooldown > 10) {
      warnings.highCooldown = `Long cooldown (${resources.cooldown} rounds) may make the spell rarely used`;
    }
    
    return warnings;
  }
  
  /**
   * Generate improvement suggestions for the spell
   */
  export function suggestImprovements(config) {
    const suggestions = [];
    
    // Missing description
    if (!config.description) {
      suggestions.push('Add a description to explain the spell\'s effects and flavor');
    }
    
    // Missing icon
    if (!config.icon) {
      suggestions.push('Add an icon to represent the spell visually');
    }
    
    // Single damage type
    if (config.damageConfig && 
        config.damageConfig.damageTypes && 
        config.damageConfig.damageTypes.length === 1) {
      suggestions.push('Consider adding a secondary damage type to make the spell more versatile');
    }
    
    // Basic damage without enhancement
    if (config.effectTypes && 
        config.effectTypes.includes('damage') && 
        config.damageConfig && 
        !config.damageConfig.useChainEffect && 
        !config.damageConfig.useCriticalEffect) {
      suggestions.push('Consider adding chain effects or critical enhancements to make the damage more interesting');
    }
    
    // Basic healing without enhancement
    if (config.effectTypes && 
        config.effectTypes.includes('healing') && 
        config.healingConfig && 
        !config.healingConfig.useAbsorptionShield) {
      suggestions.push('Consider adding an absorption shield to enhance the healing effect');
    }
    
    // Buff/Debuff with short duration
    if ((config.effectTypes && config.effectTypes.includes('buff') || config.effectTypes.includes('debuff')) && 
        config.durationConfig && 
        config.durationConfig.durationType === 'rounds' && 
        config.durationConfig.durationValue <= 3) {
      suggestions.push('Consider extending the duration for buff/debuff effects to increase their value');
    }
    
    // Damage or healing without persistent effects
    if ((config.effectTypes && config.effectTypes.includes('damage') || config.effectTypes.includes('healing')) && 
        (!config.persistentConfig || !config.persistentConfig.isPersistent)) {
      suggestions.push('Consider adding damage/healing over time effects for more total value');
    }
    
    // Single-target spells that could benefit from AOE
    if (config.targetingConfig && 
        config.targetingConfig.targetingType === 'single' && 
        config.effectTypes && 
        (config.effectTypes.includes('damage') || config.effectTypes.includes('control'))) {
      suggestions.push('Consider changing targeting to area effect for more tactical options');
    }
    
    // Self-targeting buffs that could benefit allies
    if (config.targetingConfig && 
        config.targetingConfig.targetingType === 'self' && 
        config.effectTypes && 
        config.effectTypes.includes('buff')) {
      suggestions.push('Consider changing targeting to allow buffing allies as well');
    }
    
    // Non-concentration long duration effects
    if (config.durationConfig && 
        config.durationConfig.durationType !== 'instant' && 
        config.durationConfig.durationValue > 5 && 
        !config.durationConfig.requiresConcentration) {
      suggestions.push('Consider adding concentration requirement for balance of long-duration effects');
    }
    
    return suggestions;
  }
  
  /**
   * Validate triggers in the spell configuration
   */
  export function validateTriggers(config) {
    const errors = {};
    const warnings = {};
    
    // Check persistent effect triggers
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      if (config.persistentConfig.persistentType === 'trigger' && !config.persistentConfig.triggerCondition) {
        errors.triggerCondition = 'Trigger condition is required for triggered persistent effects';
      }
    }
    
    // Check proc effects if present
    if (config.procConfig) {
      if (!config.procConfig.procType) {
        errors.procType = 'Proc type is required for proc effects';
      }
      
      if (!config.procConfig.procChance || config.procConfig.procChance <= 0 || config.procConfig.procChance > 100) {
        errors.procChance = 'Proc chance must be between 1 and 100';
      }
      
      if (!config.procConfig.effects || !Array.isArray(config.procConfig.effects) || config.procConfig.effects.length === 0) {
        errors.procEffects = 'At least one proc effect is required';
      }
    }
    
    return { errors, warnings };
  }
  
  // =====================================================================
  // HELPER FUNCTIONS
  // =====================================================================
  
  /**
   * Estimate the value of a dice notation
   */
  function estimateDiceValue(diceNotation) {
    // Simple parsing for common dice notations like "2d6+3"
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