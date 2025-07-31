/**
 * Resource Manager
 *
 * Handles calculation and management of spell resource costs including
 * action points, mana, cooldowns, and class-specific resources.
 */

import {
    EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES_DATA,
    TARGETING_TYPES,
    DURATION_TYPES,
    RESOURCE_INTERACTIONS,
    EnhancedEffectUtils
  } from '../../data/enhancedEffectSystemData';

  /**
   * Calculate action point cost for a spell
   */
  export function calculateActionPoints(spellConfig) {
    let apCost = 0;

    // Base cost from effect types
    for (const effectType of spellConfig.effectTypes) {
      const effect = ENHANCED_EFFECT_TYPES_DATA.find(e => e.id === effectType);
      if (effect) {
        apCost += effect.actionPointCost || 1;
      }
    }

    // Targeting modifier
    if (spellConfig.targetingConfig) {
      const targeting = TARGETING_TYPES.find(t => t.id === spellConfig.targetingConfig.targetingType);
      if (targeting) {
        apCost += targeting.actionPointModifier || 0;
      }

      // Area targeting costs extra based on size
      if (spellConfig.targetingConfig.targetingType === 'area' && spellConfig.targetingConfig.areaSize) {
        // +1 AP for every 30ft of area size beyond the first 10ft
        const extraSize = Math.max(0, spellConfig.targetingConfig.areaSize - 10);
        apCost += Math.floor(extraSize / 30);
      }

      // Multi-target costs extra based on target count
      if (spellConfig.targetingConfig.targetingType === 'multi' && spellConfig.targetingConfig.targetCount) {
        // +1 AP for every 3 targets beyond the first
        const extraTargets = Math.max(0, spellConfig.targetingConfig.targetCount - 1);
        apCost += Math.floor(extraTargets / 3);
      }
    }

    // Duration modifier
    if (spellConfig.durationConfig) {
      const duration = DURATION_TYPES.find(d => d.id === spellConfig.durationConfig.durationType);
      if (duration) {
        apCost += duration.actionPointModifier || 0;
      }

      // Concentration spells cost extra AP
      if (spellConfig.durationConfig.requiresConcentration) {
        apCost += 1;
      }
    }

    // Special effect modifiers
    if (spellConfig.damageConfig) {
      // Chain effects cost extra
      if (spellConfig.damageConfig.useChainEffect) {
        apCost += 2;
      }

      // Critical enhancements cost extra
      if (spellConfig.damageConfig.useCriticalEffect) {
        apCost += 1;
      }
    }

    if (spellConfig.healingConfig) {
      // Absorption shields cost extra
      if (spellConfig.healingConfig.useAbsorptionShield) {
        apCost += 2;
      }
    }

    // Level-based cost adjustments
    if (spellConfig.level) {
      // High level spells cost more
      if (spellConfig.level >= 7) {
        apCost += 1;
      }
      if (spellConfig.level >= 9) {
        apCost += 1;
      }
    }

    // Apply any special resource options
    if (spellConfig.resourceOptions && spellConfig.resourceOptions.actionPoints) {
      const options = spellConfig.resourceOptions.actionPoints;

      // Override with fixed cost if specified
      if (options.override !== undefined) {
        return options.override;
      }

      // Apply modifiers
      if (options.modifier) {
        apCost += options.modifier;
      }
    }

    // Persistent effects cost extra
    if (spellConfig.persistentConfig && spellConfig.persistentConfig.isPersistent) {
      apCost += 1;
    }

    // Minimum AP cost is 1
    return Math.max(1, apCost);
  }

  /**
   * Calculate mana cost for a spell
   */
  export function calculateManaCost(spellConfig) {
    let baseMana = 0;

    // Base cost from spell level or complexity
    if (spellConfig.level) {
      baseMana = spellConfig.level * 5;
    } else {
      // If no level, calculate based on effect types
      baseMana = spellConfig.effectTypes.length * 5;
    }

    // Effect type specific costs
    for (const effectType of spellConfig.effectTypes) {
      switch (effectType) {
        case 'damage':
          // Calculate based on damage dice
          if (spellConfig.damageConfig && spellConfig.damageConfig.diceNotation) {
            const diceEstimate = estimateDiceValue(spellConfig.damageConfig.diceNotation);
            baseMana += Math.floor(diceEstimate / 2);
          } else {
            baseMana += 5;
          }
          break;

        case 'healing':
          // Healing costs more mana than damage
          if (spellConfig.healingConfig && spellConfig.healingConfig.diceNotation) {
            const diceEstimate = estimateDiceValue(spellConfig.healingConfig.diceNotation);
            baseMana += Math.floor(diceEstimate * 0.75);
          } else {
            baseMana += 8;
          }
          break;

        case 'buff':
        case 'debuff':
          // Status effects scale with duration
          if (spellConfig.durationConfig && spellConfig.durationConfig.durationType !== 'instant') {
            const durationMultiplier = getDurationMultiplier(spellConfig.durationConfig);
            baseMana += 5 * durationMultiplier;
          } else {
            baseMana += 5;
          }
          break;

        case 'utility':
        case 'control':
        case 'summoning':
        case 'transformation':
          // Complex effects cost more
          baseMana += 10;
          break;
      }
    }

    // Special effect modifiers
    if (spellConfig.damageConfig) {
      // Chain effects cost extra mana
      if (spellConfig.damageConfig.useChainEffect) {
        baseMana += 15;

        // Additional mana per target
        if (spellConfig.damageConfig.chainConfig && spellConfig.damageConfig.chainConfig.targets) {
          baseMana += spellConfig.damageConfig.chainConfig.targets * 3;
        }
      }

      // Critical enhancements cost extra mana
      if (spellConfig.damageConfig.useCriticalEffect) {
        baseMana += 10;
      }
    }

    if (spellConfig.healingConfig) {
      // Absorption shields cost extra mana
      if (spellConfig.healingConfig.useAbsorptionShield) {
        baseMana += 15;
      }
    }

    // Targeting modifiers
    if (spellConfig.targetingConfig) {
      // Area targeting costs extra mana based on size
      if (spellConfig.targetingConfig.targetingType === 'area' && spellConfig.targetingConfig.areaSize) {
        // +5 mana for every 10ft of area size
        baseMana += Math.floor(spellConfig.targetingConfig.areaSize / 10) * 5;
      }

      // Multi-target costs extra mana per target
      if (spellConfig.targetingConfig.targetingType === 'multi' && spellConfig.targetingConfig.targetCount) {
        baseMana += spellConfig.targetingConfig.targetCount * 3;
      }
    }

    // Concentration spells cost extra mana
    if (spellConfig.durationConfig && spellConfig.durationConfig.requiresConcentration) {
      baseMana += 10;
    }

    // Persistent effects cost extra mana
    if (spellConfig.persistentConfig && spellConfig.persistentConfig.isPersistent) {
      baseMana += 15;

      // Duration-based scaling
      if (spellConfig.persistentConfig.tickDuration) {
        baseMana += spellConfig.persistentConfig.tickDuration * 5;
      }
    }

    // Apply any special resource options
    if (spellConfig.resourceOptions && spellConfig.resourceOptions.mana) {
      const options = spellConfig.resourceOptions.mana;

      // Override with fixed cost if specified
      if (options.override !== undefined) {
        return options.override;
      }

      // Apply modifiers
      if (options.modifier) {
        baseMana += options.modifier;
      }

      // Apply percentage modifier
      if (options.percentModifier) {
        baseMana = Math.floor(baseMana * (1 + options.percentModifier / 100));
      }
    }

    return Math.max(1, Math.floor(baseMana));
  }

  /**
   * Calculate cooldown for a spell in rounds
   */
  export function calculateCooldown(spellConfig) {
    let baseCooldown = 0;

    // Start with default cooldown based on effect types
    for (const effectType of spellConfig.effectTypes) {
      switch (effectType) {
        case 'damage':
          // Basic damage spells often have no cooldown
          break;

        case 'healing':
          // Minor healing without cooldown, major healing with cooldown
          if (spellConfig.healingConfig && spellConfig.healingConfig.diceNotation) {
            const healPower = estimateDiceValue(spellConfig.healingConfig.diceNotation);
            if (healPower > 20) {
              baseCooldown = Math.max(baseCooldown, 2);
            }
          }
          break;

        case 'buff':
        case 'debuff':
          // Status effects often have moderate cooldowns
          baseCooldown = Math.max(baseCooldown, 3);
          break;

        case 'utility':
        case 'control':
          // Utility and control effects have varying cooldowns
          baseCooldown = Math.max(baseCooldown, 2);
          break;

        case 'summoning':
        case 'transformation':
          // Powerful effects have long cooldowns
          baseCooldown = Math.max(baseCooldown, 5);
          break;
      }
    }

    // Adjust based on spell power and level
    if (spellConfig.level) {
      if (spellConfig.level >= 7) {
        baseCooldown += 2;
      } else if (spellConfig.level >= 5) {
        baseCooldown += 1;
      }
    }

    // Special effect adjustments
    if (spellConfig.damageConfig) {
      // Chain effects may increase cooldown
      if (spellConfig.damageConfig.useChainEffect) {
        baseCooldown += 1;
      }

      // Critical effects may increase cooldown
      if (spellConfig.damageConfig.useCriticalEffect &&
          spellConfig.damageConfig.criticalConfig &&
          spellConfig.damageConfig.criticalConfig.effects) {
        // More powerful critical effects add more cooldown
        baseCooldown += spellConfig.damageConfig.criticalConfig.effects.length;
      }
    }

    if (spellConfig.healingConfig) {
      // Absorption shields often have cooldowns
      if (spellConfig.healingConfig.useAbsorptionShield) {
        baseCooldown += 2;
      }
    }

    // Apply any specified cooldown overrides
    if (spellConfig.resourceOptions && spellConfig.resourceOptions.cooldown) {
      const options = spellConfig.resourceOptions.cooldown;

      // Override with fixed cooldown if specified
      if (options.override !== undefined) {
        return options.override;
      }

      // Apply modifiers
      if (options.modifier) {
        baseCooldown += options.modifier;
      }
    }

    return Math.max(0, baseCooldown);
  }

  /**
   * Calculate class-specific resource costs
   */
  export function calculateClassResourceCost(spellConfig, resourceType) {
    let cost = 0;

    switch (resourceType) {
      case 'rage':
        // Warrior-type resource, higher for offensive spells
        if (spellConfig.effectTypes.includes('damage')) {
          cost = 30;
        } else if (spellConfig.effectTypes.includes('buff')) {
          cost = 20;
        } else {
          cost = 10;
        }
        break;

      case 'energy':
        // Rogue-type resource, scales with speed and complexity
        cost = 40;
        if (spellConfig.durationConfig && spellConfig.durationConfig.durationType !== 'instant') {
          cost += 10;
        }
        break;

      case 'focus':
        // Hunter-type resource, scales with precision
        cost = 50;
        if (spellConfig.targetingConfig && spellConfig.targetingConfig.targetingType === 'single') {
          cost += 10;
        }
        break;

      case 'combo_points':
        // Accumulating resource, usually for powerful finishers
        if (spellConfig.level >= 7) {
          cost = 5;
        } else if (spellConfig.level >= 5) {
          cost = 4;
        } else if (spellConfig.level >= 3) {
          cost = 3;
        } else {
          cost = 2;
        }
        break;

      case 'soul_shards':
        // Warlock-type resource, higher for summoning and transformation
        if (spellConfig.effectTypes.includes('summoning')) {
          cost = 3;
        } else if (spellConfig.effectTypes.includes('transformation')) {
          cost = 2;
        } else {
          cost = 1;
        }
        break;

      case 'holy_power':
        // Paladin-type resource, scales with healing and protection
        if (spellConfig.effectTypes.includes('healing')) {
          cost = 3;
        } else if (spellConfig.healingConfig && spellConfig.healingConfig.useAbsorptionShield) {
          cost = 3;
        } else {
          cost = 2;
        }
        break;

      case 'astral_power':
        // Druid-type resource, higher for nature and transformation
        if (spellConfig.effectTypes.includes('transformation')) {
          cost = 60;
        } else {
          cost = 40;
        }
        break;

      default:
        cost = 0;
    }

    // Apply any resource-specific options
    if (spellConfig.resourceOptions && spellConfig.resourceOptions[resourceType]) {
      const options = spellConfig.resourceOptions[resourceType];

      // Override with fixed cost if specified
      if (options.override !== undefined) {
        return options.override;
      }

      // Apply modifiers
      if (options.modifier) {
        cost += options.modifier;
      }
    }

    return Math.max(0, cost);
  }

  /**
   * Scale a resource cost with effect power
   */
  export function scaleResourceWithEffect(resource, effectPower) {
    // Simple scaling formula: resource + (resource * effectPower / 100)
    return Math.floor(resource * (1 + effectPower / 100));
  }

  /**
   * Apply resource modifiers to a base cost
   */
  export function applyResourceModifiers(baseCost, modifiers) {
    let finalCost = baseCost;

    // Apply flat modifiers first
    if (modifiers.flat) {
      finalCost += modifiers.flat;
    }

    // Apply percentage modifiers
    if (modifiers.percent) {
      finalCost = Math.floor(finalCost * (1 + modifiers.percent / 100));
    }

    // Apply minimum cap
    if (modifiers.minimum !== undefined) {
      finalCost = Math.max(modifiers.minimum, finalCost);
    }

    // Apply maximum cap
    if (modifiers.maximum !== undefined) {
      finalCost = Math.min(modifiers.maximum, finalCost);
    }

    return finalCost;
  }

  /**
   * Convert from one resource type to another
   */
  export function convertResources(fromResource, toResource, amount) {
    // Conversion rates between different resource types
    const conversionRates = {
      'mana_to_health': 0.5,      // 1 mana = 0.5 health
      'health_to_mana': 2,        // 1 health = 2 mana
      'rage_to_mana': 0.25,       // 1 rage = 0.25 mana
      'mana_to_rage': 4,          // 1 mana = 4 rage
      'energy_to_mana': 0.5,      // 1 energy = 0.5 mana
      'mana_to_energy': 2,        // 1 mana = 2 energy
      'combo_points_to_mana': 10, // 1 combo point = 10 mana
      'soul_shards_to_mana': 15,  // 1 soul shard = 15 mana
    };

    const key = `${fromResource}_to_${toResource}`;

    if (conversionRates[key]) {
      return Math.floor(amount * conversionRates[key]);
    }

    // Default 1:1 conversion if no specific rate is defined
    return amount;
  }

  /**
   * Calculate health cost when using Life Tap mechanic
   */
  export function calculateLifeTapCost(manaCost) {
    // Life tap conversion rate: 1 health provides 2 mana
    // So to get manaCost mana, we need manaCost / 2 health
    return Math.ceil(manaCost / 2);
  }

  /**
   * Determine combo point cost or generation for a spell
   */
  export function determineComboPointCost(spellConfig) {
    // Generator abilities provide combo points
    if (spellConfig.resourceOptions && spellConfig.resourceOptions.comboPoints) {
      if (spellConfig.resourceOptions.comboPoints.generates) {
        return -spellConfig.resourceOptions.comboPoints.generates; // Negative means generation
      }

      if (spellConfig.resourceOptions.comboPoints.requires) {
        return spellConfig.resourceOptions.comboPoints.requires; // Positive means consumption
      }
    }

    // Default behavior based on effect types
    if (spellConfig.effectTypes.includes('damage')) {
      // Basic damage abilities often generate 1 combo point
      if (spellConfig.targetingConfig && spellConfig.targetingConfig.targetingType === 'single') {
        return -1; // Generate 1 combo point
      }
    }

    // Powerful effects often consume combo points
    if (spellConfig.level >= 5) {
      return 3; // Consume 3 combo points
    } else if (spellConfig.level >= 3) {
      return 2; // Consume 2 combo points
    }

    return 0; // No combo point interaction
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

  /**
   * Get a multiplier based on duration
   */
  function getDurationMultiplier(durationConfig) {
    if (!durationConfig || !durationConfig.durationType) {
      return 1;
    }

    switch (durationConfig.durationType) {
      case 'rounds':
        return Math.min(3, Math.max(1, durationConfig.durationValue / 3));
      case 'minutes':
        return Math.min(5, Math.max(1, durationConfig.durationValue / 2));
      case 'hours':
        return Math.min(10, Math.max(2, durationConfig.durationValue * 2));
      default:
        return 1;
    }
  }

  /**
   * Calculate total resources for a spell
   */
  export function calculateTotalResources(spellConfig) {
    const resources = {
      actionPoints: spellConfig.resourceCost?.actionPoints !== undefined ?
        spellConfig.resourceCost.actionPoints :
        calculateActionPoints(spellConfig),
      mana: calculateManaCost(spellConfig),
      cooldown: calculateCooldown(spellConfig),
      classResources: spellConfig.resourceOptions && spellConfig.resourceOptions.primaryClassResource ? {
        type: spellConfig.resourceOptions.primaryClassResource,
        cost: calculateClassResourceCost(spellConfig, spellConfig.resourceOptions.primaryClassResource)
      } : null
    };

    // Add additional resources from the resourceTypes array
    if (spellConfig.resourceCost?.resourceTypes && spellConfig.resourceCost.resourceTypes.length > 0) {
      resources.additionalResources = spellConfig.resourceCost.resourceTypes.map(resourceType => {
        // Skip the primary resource type as it's already included
        if (resourceType === spellConfig.resourceOptions?.primaryClassResource) {
          return null;
        }

        // Get the resource value or formula
        const useFormula = spellConfig.resourceCost.useFormulas?.[resourceType] || false;
        const value = useFormula
          ? spellConfig.resourceCost.resourceFormulas?.[resourceType] || ''
          : spellConfig.resourceCost.resourceValues?.[resourceType] ||
            (resourceType === 'mana' ? calculateManaCost(spellConfig) :
             calculateClassResourceCost(spellConfig, resourceType));

        return {
          type: resourceType,
          value: useFormula ? 0 : value, // Use 0 as placeholder for formula values
          useFormula: useFormula,
          formula: useFormula ? value : ''
        };
      }).filter(Boolean); // Remove null entries
    }

    return resources;
  }

  /**
   * Get resource requirement description text
   */
  export function getResourceDescription(spellConfig) {
    const resources = calculateTotalResources(spellConfig);
    let description = `Costs ${resources.actionPoints} action point${resources.actionPoints !== 1 ? 's' : ''}`;

    if (resources.mana > 0) {
      description += ` and ${resources.mana} mana`;
    }

    if (resources.classResources) {
      description += ` and ${resources.classResources.cost} ${resources.classResources.type}`;
    }

    // Add additional resources to the description
    if (resources.additionalResources && resources.additionalResources.length > 0) {
      resources.additionalResources.forEach(resource => {
        // Format the resource name nicely
        let resourceName = resource.type;
        try {
          // Convert snake_case to Title Case
          resourceName = resource.type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } catch (e) {
          console.warn('Error formatting resource name:', e);
        }

        if (resource.useFormula) {
          description += ` and ${resource.formula} ${resourceName}`;
        } else {
          description += ` and ${resource.value} ${resourceName}`;
        }
      });
    }

    if (resources.cooldown > 0) {
      description += `. Cooldown: ${resources.cooldown} round${resources.cooldown !== 1 ? 's' : ''}`;
    }

    return description + '.';
  }