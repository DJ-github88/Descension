import { formatAoeShape, formatDurationText } from './spellFormatterUtils';

const useTargetingFormatters = ({ spell }) => {
  const formatCastTime = () => {
    if (!spell) return 'Instant';

    // Handle different casting time formats
    if (spell.actionType === 'channeled') return 'Channeled';
    if (spell.spellType === 'CHANNELED') return 'Channeled';
    if (spell.spellType === 'REACTION') return 'Reaction';
    if (spell.spellType === 'PASSIVE') return 'Passive';
    if (spell.spellType === 'TRAP') return 'Trap';
    if (spell.spellType === 'STATE') return 'State';
    if (spell.spellType === 'ZONE') return 'Zone';

    // Get cast time from typeConfig
    const castTime = spell.castTime ||
                    spell.castingTime ||
                    (spell.castingConfig && spell.castingConfig.castTime) ||
                    (spell.typeConfig && spell.typeConfig.castTime);

    if (castTime && castTime > 0) {
      const timeType = spell.typeConfig?.castTimeType || 'IMMEDIATE';
      if (timeType === 'IMMEDIATE') {
        return castTime === 1 ? '1 Turn' : `${castTime} Turns`;
      } else {
        return `${castTime} Turn${castTime > 1 ? 's' : ''} (${timeType.replace(/_/g, ' ').toLowerCase()})`;
      }
    }

    return 'Instant';
  };

  const formatRange = () => {
    if (!spell) return 'Self';

    // If in effect-specific targeting mode, don't show unified range in header
    // Individual effects will show their own range badges
    if (spell.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      // Show a generic indicator or nothing when using effect-specific targeting
      return 'Varies';
    }

    // Handle different range formats
    if (spell.targetingMode === 'self') return 'Self';
    if (spell.targetingConfig?.targetingType === 'self') return 'Self';

    const config = spell.targetingConfig;
    if (!config) {
      // Fallback to legacy range property
      const range = spell.range || 'Touch';
      if (typeof range === 'number') return `${range} ft`;
      return range;
    }

    // Format based on targeting configuration
    const { targetingType, rangeType, rangeDistance, aoeShape, aoeParameters, aoeType, aoeSize } = config;

    // Handle self-targeting
    if (targetingType === 'self') return 'Self';

    // Build range string based on range type
    let rangeStr = '';
    switch (rangeType) {
      case 'touch':
        rangeStr = 'Touch';
        break;
      case 'ranged':
        rangeStr = `${rangeDistance || 30} ft`;
        break;
      case 'sight':
        rangeStr = 'Sight';
        break;
      case 'unlimited':
        rangeStr = 'Unlimited';
        break;
      case 'self_centered':
        rangeStr = 'Self';
        break;
      case 'cone':
      case 'line':
        // For cone/line spells, the range is the length of the effect
        rangeStr = `${rangeDistance || aoeSize || 30} ft`;
        break;
      default:
        rangeStr = 'Touch';
    }

    // Add targeting type information for area effects
    // Support both aoeShape/aoeParameters (new) and aoeType/aoeSize (legacy)
    if (targetingType === 'area' || targetingType === 'ground' || targetingType === 'cone' || targetingType === 'line') {
      const shape = aoeShape || aoeType;
      const params = aoeParameters || (aoeSize ? { radius: aoeSize, length: aoeSize } : {});

      if (shape) {
        const shapeInfo = formatAoeShape(shape, params);
        if (shapeInfo) {
          // For line/cone effects, if rangeDistance equals the length, replace range with shape info instead of appending
          if ((shape === 'line' || shape === 'cone') && params.length && rangeDistance && 
              Math.abs(rangeDistance - params.length) < 1) {
            rangeStr = shapeInfo; // Replace range with shape info (e.g., "60ft line" instead of "60 ft (60ft line)")
          } else {
            rangeStr += ` (${shapeInfo})`;
          }
        }
      }
    } else if (targetingType === 'area' && aoeShape) {
      const shapeInfo = formatAoeShape(aoeShape, aoeParameters);
      if (shapeInfo) {
        // For line/cone effects, if rangeDistance equals the length, replace range with shape info
        if ((aoeShape === 'line' || aoeShape === 'cone') && aoeParameters?.length && rangeDistance && 
            Math.abs(rangeDistance - aoeParameters.length) < 1) {
          rangeStr = shapeInfo;
        } else {
          rangeStr += ` (${shapeInfo})`;
        }
      }
    } else if (targetingType === 'multi') {
      const maxTargets = config.maxTargets || 3;
      const selectionMethod = config.targetSelectionMethod || config.selectionMethod;
      if (selectionMethod && selectionMethod !== 'manual') {
        const methodName = selectionMethod === 'random' ? 'Random' :
                          selectionMethod === 'closest' || selectionMethod === 'nearest' ? 'Nearest' :
                          selectionMethod === 'furthest' || selectionMethod === 'farthest' ? 'Farthest' :
                          selectionMethod === 'lowest_health' ? 'Lowest HP' :
                          selectionMethod === 'highest_health' ? 'Highest HP' : '';
        rangeStr += ` (${maxTargets} ${methodName})`;
      } else {
        rangeStr += ` (${maxTargets} targets)`;
      }
    } else if (targetingType === 'chain') {
      rangeStr += ' (Chain)';
    }

    // Don't add propagation information to range since we have a separate propagation badge
    // This prevents duplication like "TOUCH + 20FT CHAIN" in range AND "CHAIN EFFECT X3, 20FT, 40%" in propagation

    return rangeStr;
  };

  // Format targeting/range info for individual effects
  const formatEffectTargeting = (effectType, effectSubType = null) => {
    // In unified mode, don't show targeting badges on individual effects
    // Unified targeting is shown in the header only
    if (spell?.targetingMode === 'unified') {
      return null;
    }
    
    // Only proceed if we're in effect-specific mode
    if (spell?.targetingMode !== 'effect') {
      return null;
    }
    
    let effectConfig = null;
    
    // First, try to get effect-specific targeting
    if (spell?.effectTargeting && spell.effectTargeting[effectType]) {
      const effectSpecificConfig = spell.effectTargeting[effectType];
      // Only use effect-specific config if it has actual targeting data
      // If it's an empty object (cleared), don't use it
      if (effectSpecificConfig && typeof effectSpecificConfig === 'object' && 
          (effectSpecificConfig.rangeType || effectSpecificConfig.targetingType || effectSpecificConfig.rangeDistance)) {
        effectConfig = effectSpecificConfig;
      }
    }
    
    // If still no config, return null
    if (!effectConfig || typeof effectConfig !== 'object') {
      return null;
    }
    
    // Return config if it has ANY targeting info (rangeType OR targetingType)
    // Don't require both - user might set range before targeting type
    if (!effectConfig.rangeType && !effectConfig.targetingType && !effectConfig.rangeDistance) {
      return null;
    }

    const { targetingType, rangeType, rangeDistance, aoeShape, aoeParameters, maxTargets, targetSelectionMethod, selectionMethod, targetRestrictions } = effectConfig;
    
    // Build range string - always show range if rangeType exists
    let rangeStr = '';
    if (rangeType) {
      switch (rangeType) {
        case 'touch':
          rangeStr = 'Touch';
          break;
        case 'ranged':
          rangeStr = `${rangeDistance || 30} ft`;
          break;
        case 'sight':
          rangeStr = 'Sight';
          break;
        case 'unlimited':
          rangeStr = 'Unlimited';
          break;
        case 'self_centered':
          rangeStr = 'Self';
          break;
        default:
          if (rangeDistance && rangeDistance > 0) {
            rangeStr = `${rangeDistance} ft`;
          } else {
            // Fallback: capitalize the rangeType
            rangeStr = rangeType.charAt(0).toUpperCase() + rangeType.slice(1);
          }
      }
    } else if (rangeDistance && rangeDistance > 0) {
      // If no rangeType but we have rangeDistance, show it
      rangeStr = `${rangeDistance} ft`;
    }

    // Add targeting type info
    let targetingInfo = '';
    if (targetingType === 'area' || targetingType === 'ground' || targetingType === 'cone' || targetingType === 'line') {
      const shape = aoeShape || effectConfig.aoeType;
      const params = aoeParameters || (effectConfig.aoeSize ? { radius: effectConfig.aoeSize, length: effectConfig.aoeSize } : {});
      
      // Always show area effect info if targeting type is area-based
      if (shape) {
        const shapeInfo = formatAoeShape(shape, params);
        if (shapeInfo && shapeInfo.trim() !== '') {
          targetingInfo = shapeInfo;
          
          // For line/cone effects, if rangeDistance equals the length, don't show redundant range
          if ((shape === 'line' || shape === 'cone') && params.length && rangeDistance && 
              Math.abs(rangeDistance - params.length) < 1) {
            // Suppress the range string since it's redundant with the line/cone length
            rangeStr = '';
          }
        } else {
          // If shape formatting failed, show generic area with shape name
          const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1).replace(/_/g, ' ');
          targetingInfo = `${shapeName} Area`;
        }
      } else {
        // No shape configured, show generic area effect
        if (targetingType === 'cone') {
          targetingInfo = 'Cone Area';
        } else if (targetingType === 'line') {
          targetingInfo = 'Line Area';
        } else {
          targetingInfo = 'Area Effect';
        }
      }
    } else if (targetingType === 'multi') {
      const method = targetSelectionMethod || selectionMethod;
      if (method && method !== 'manual') {
        const methodName = method === 'random' ? 'Random' :
                          method === 'closest' || method === 'nearest' ? 'Nearest' :
                          method === 'furthest' || method === 'farthest' ? 'Farthest' :
                          method === 'lowest_health' ? 'Lowest HP' :
                          method === 'highest_health' ? 'Highest HP' : '';
        targetingInfo = `${maxTargets || 3} ${methodName}`;
      } else {
        targetingInfo = `${maxTargets || 3} Targets`;
      }
    } else if (targetingType === 'chain') {
      targetingInfo = 'Chain Effect';
    } else if (targetingType === 'single') {
      const method = targetSelectionMethod || selectionMethod;
      if (method && method !== 'manual') {
        const methodName = method === 'random' ? 'Random' :
                          method === 'closest' || method === 'nearest' ? 'Nearest' :
                          method === 'furthest' || method === 'farthest' ? 'Farthest' :
                          method === 'lowest_health' ? 'Lowest HP' :
                          method === 'highest_health' ? 'Highest HP' : '';
        targetingInfo = `Single Target (${methodName})`;
      } else {
        targetingInfo = 'Single Target';
      }
    } else if (targetingType === 'self' || targetingType === 'self_centered') {
      targetingInfo = 'Self';
    } else if (rangeType === 'self_centered' && !targetingInfo) {
      // If range is self-centered but targetingType wasn't set, show Self
      targetingInfo = 'Self';
    }

    // Add target restrictions if they exist and are meaningful
    let restrictionsInfo = '';
    if (Array.isArray(targetRestrictions) && targetRestrictions.length > 0 && !targetRestrictions.includes('any')) {
      const restrictionNames = targetRestrictions.map(r => {
        return r === 'enemy' ? 'Enemies' :
               r === 'ally' ? 'Allies' :
               r === 'self' ? 'Self' :
               r === 'creature' ? 'Creatures' :
               r === 'object' ? 'Objects' :
               r.charAt(0).toUpperCase() + r.slice(1);
      });
      restrictionsInfo = restrictionNames.join(', ');
    }

    // Add propagation info if it exists (check both effect-specific and unified)
    let propagationInfo = '';
    const propagation = effectConfig.propagation || (spell?.targetingMode === 'unified' ? spell?.propagation : null);
    if (propagation && propagation.method && propagation.method !== 'none') {
      const { method, behavior, parameters } = propagation;
      
      // Define propagation method names
      const propagationMethods = {
        'chain': 'Chain Effect',
        'bounce': 'Bounce Effect',
        'seeking': 'Seeking Effect',
        'explosion': 'Explosion on Impact',
        'spreading': 'Spreading Effect',
        'forking': 'Forking Effect'
      };

      // Define behavior names
      const behaviorNames = {
        // Chain behaviors
        'nearest': 'Nearest',
        'farthest': 'Farthest',
        'random': 'Random',
        'lowest_health': 'Lowest HP',
        'highest_health': 'Highest HP',

        // Bounce behaviors
        'ricocheting': 'Ricocheting',
        'accelerating': 'Accelerating',
        'decelerating': 'Decelerating',

        // Seeking behaviors
        'aggressive': 'Aggressive',
        'opportunistic': 'Opportunistic',
        'thorough': 'Thorough',
        'prioritized': 'Prioritized',
        'intelligent': 'Intelligent',

        // Explosion behaviors
        'standard': 'Standard',
        'shaped': 'Shaped Charge',
        'delayed': 'Delayed',
        'chain_reaction': 'Chain Reaction',
        'elemental': 'Elemental',

        // Spreading behaviors
        'contagion': 'Contagion',
        'expanding': 'Expanding',
        'creeping': 'Creeping',
        'pulsing': 'Pulsing',
        'consuming': 'Consuming',

        // Forking behaviors
        'equal': 'Equal Split',
        'targeted': 'Targeted Split',
        'cascading': 'Cascading Split',
        'converging': 'Converging'
      };

      // Get method name, with fallback capitalization
      let methodName = propagationMethods[method];
      if (!methodName) {
        // Capitalize and format method name if not in map
        methodName = method.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' Effect';
      }
      
      // Build the result string
      let result = methodName;
      
      // Add behavior if present (show behavior prominently)
      if (behavior && behaviorNames[behavior]) {
        result = `${methodName} (${behaviorNames[behavior]})`;
      } else if (behavior) {
        // Fallback if behavior not in map
        const behaviorName = behavior.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        result = `${methodName} (${behaviorName})`;
      }
      
      // Add parameter information
      if (parameters) {
        const parts = [];
        if (method === 'chain' || method === 'bounce') {
          if (parameters.count) parts.push(`x${parameters.count}`);
          if (parameters.range) parts.push(`${parameters.range}ft`);
          if (parameters.decay && parameters.decay > 0) parts.push(`${parameters.decay}% decay`);
        } else if (method === 'seeking') {
          if (parameters.range) parts.push(`${parameters.range}ft`);
        } else if (method === 'explosion') {
          if (parameters.secondaryRadius) parts.push(`${parameters.secondaryRadius}ft radius`);
        } else if (method === 'spreading') {
          if (parameters.spreadRate) parts.push(`${parameters.spreadRate}ft/s`);
        } else if (method === 'forking') {
          if (parameters.forkCount) parts.push(`x${parameters.forkCount}`);
        }
        if (parts.length > 0) {
          result += ` - ${parts.join(', ')}`;
        }
      }
      
      propagationInfo = result;
    }

    // Only return if we have at least one piece of info to display
    if (!rangeStr && !targetingInfo && !restrictionsInfo && !propagationInfo) {
      return null;
    }

    return {
      range: rangeStr || null,
      targeting: targetingInfo || null,
      restrictions: restrictionsInfo || null,
      propagation: propagationInfo || null
    };
  };

  const formatTargetingType = () => {
    // If in effect-specific targeting mode, don't show unified targeting in header
    // Individual effects will show their own targeting badges
    if (spell?.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      return '';
    }

    if (!spell?.targetingConfig) return '';

    const {
      targetingType,
      maxTargets,
      selectionMethod,
      targetSelectionMethod,
      targetRestrictions
    } = spell.targetingConfig;

    let baseText = '';
    let methodText = '';
    let restrictionText = '';

    // Format base targeting type
    switch (targetingType) {
      case 'single':
        baseText = 'Single Target';
        break;
      case 'multi':
        const targets = maxTargets || 3;
        baseText = `${targets} Targets`;
        break;
      case 'area':
      case 'ground':
      case 'cone':
      case 'line':
        baseText = 'Area Effect';
        break;
      case 'chain':
        baseText = 'Chain Effect';
        break;
      case 'self_centered':
        // For self-centered effects, show as Self with restrictions
        baseText = 'Self';
        break;
      case 'self':
        // Don't show "Self" here since it's already shown in the range badge
        // This prevents duplicate "Self" badges
        return '';
      default:
        baseText = '';
    }

    // Format selection method for single/multi targets
    if ((targetingType === 'single' || targetingType === 'multi') &&
        (selectionMethod || targetSelectionMethod)) {
      const method = targetSelectionMethod || selectionMethod;
      switch (method) {
        case 'manual':
          methodText = 'Manual';
          break;
        case 'random':
          methodText = 'Random';
          break;
        case 'closest':
        case 'nearest':
          methodText = 'Nearest';
          break;
        case 'furthest':
        case 'farthest':
          methodText = 'Farthest';
          break;
        case 'lowest_health':
          methodText = 'Lowest HP';
          break;
        case 'highest_health':
          methodText = 'Highest HP';
          break;
        default:
          methodText = method;
      }
    }

    // Format target restrictions
    if (Array.isArray(targetRestrictions) && targetRestrictions.length > 0) {
      const restrictions = targetRestrictions.map(restriction => {
        switch (restriction) {
          case 'enemy':
            return 'Enemies';
          case 'ally':
            return 'Allies';
          case 'self':
            return 'Self';
          case 'object':
            return 'Objects';
          case 'creature':
            return 'Creatures';
          default:
            return restriction;
        }
      });

      if (restrictions.length === 1) {
        restrictionText = restrictions[0];
      } else if (restrictions.length === 2) {
        restrictionText = restrictions.join(' & ');
      } else {
        restrictionText = restrictions.slice(0, -1).join(', ') + ' & ' + restrictions[restrictions.length - 1];
      }
    }

    // Combine all parts
    let result = baseText;
    if (methodText && (targetingType === 'single' || targetingType === 'multi')) {
      result += ` (${methodText})`;
    }
    if (restrictionText && targetingType !== 'self') {
      result += baseText ? ` - ${restrictionText}` : restrictionText;
    }

    return result;
  };
  // ===== PROPAGATION FORMATTING =====

  const formatPropagation = () => {
    // If in effect-specific targeting mode, don't show unified propagation in header
    // Individual effects will show their own propagation badges
    if (spell?.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      return '';
    }
    
    if (!spell?.propagation || spell.propagation.method === 'none') {
      return '';
    }

    const { method, behavior, parameters } = spell.propagation;

    // Define propagation method names
    const propagationMethods = {
      'chain': 'Chain Effect',
      'bounce': 'Bounce Effect',
      'seeking': 'Seeking Effect',
      'explosion': 'Explosion on Impact',
      'spreading': 'Spreading Effect',
      'forking': 'Forking Effect'
    };

    // Define behavior names
    const behaviorNames = {
      // Chain behaviors
      'nearest': 'Nearest',
      'farthest': 'Farthest',
      'random': 'Random',
      'lowest_health': 'Lowest HP',
      'highest_health': 'Highest HP',

      // Bounce behaviors
      'ricocheting': 'Ricocheting',
      'accelerating': 'Accelerating',
      'decelerating': 'Decelerating',

      // Seeking behaviors
      'aggressive': 'Aggressive',
      'opportunistic': 'Opportunistic',
      'thorough': 'Thorough',
      'prioritized': 'Prioritized',
      'intelligent': 'Intelligent',

      // Explosion behaviors
      'standard': 'Standard',
      'shaped': 'Shaped Charge',
      'delayed': 'Delayed',
      'chain_reaction': 'Chain Reaction',
      'elemental': 'Elemental',

      // Spreading behaviors
      'contagion': 'Contagion',
      'expanding': 'Expanding',
      'creeping': 'Creeping',
      'pulsing': 'Pulsing',
      'consuming': 'Consuming',

      // Forking behaviors
      'equal': 'Equal Split',
      'targeted': 'Targeted Split',
      'cascading': 'Cascading Split',
      'converging': 'Converging'
    };

    let result = propagationMethods[method] || method;

    // Add parameter information in a cleaner format
    if (parameters) {
      const parts = [];

      if (method === 'chain' || method === 'bounce') {
        if (parameters.count) parts.push(`x${parameters.count}`);
        if (parameters.range) parts.push(`${parameters.range}ft`);
        if (parameters.decay && parameters.decay > 0) parts.push(`-${parameters.decay}%`);
      } else if (method === 'explosion') {
        if (parameters.secondaryRadius) parts.push(`${parameters.secondaryRadius}ft`);
      } else if (method === 'forking') {
        if (parameters.forkCount) parts.push(`x${parameters.forkCount}`);
      } else if (method === 'spreading') {
        if (parameters.spreadRate) parts.push(`${parameters.spreadRate}ft/s`);
      } else if (method === 'seeking') {
        if (parameters.range) parts.push(`${parameters.range}ft`);
      }

      if (parts.length > 0) {
        result += ` ${parts.join(' ')}`;
      }
    }

    // Add behavior in parentheses if there's space
    if (behavior && behaviorNames[behavior]) {
      const withBehavior = `${result} (${behaviorNames[behavior]})`;
      // Only add behavior if the total length is reasonable
      if (withBehavior.length <= 25) {
        result = withBehavior;
      }
    }

    return result;
  };

  const formatDuration = () => {
    if (!spell) return 'Instant';

    // Check for buff configuration duration first
    if (spell.effectTypes?.includes('buff') && spell.buffConfig) {
      const buffData = spell.buffConfig;
      const durationValue = buffData.durationValue || buffData.duration;

      if (durationValue && buffData.durationType !== 'instant') {
        let durationText = formatDurationText(durationValue, buffData.durationType, buffData.durationUnit, buffData.restType);

        // Add concentration requirement if applicable
        if (buffData.concentrationRequired) {
          durationText += ' (Concentration)';
        }

        // Add dispellable information for permanent effects
        if (buffData.durationType === 'permanent') {
          if (buffData.canBeDispelled === false) {
            durationText += ' (Cannot be dispelled)';
          } else if (buffData.canBeDispelled === true) {
            durationText += ' (Dispellable)';
          }
        }

        return durationText;
      }
    }

    // Check for debuff configuration duration
    if (spell.effectTypes?.includes('debuff') && spell.debuffConfig) {
      const debuffData = spell.debuffConfig;
      const durationValue = debuffData.durationValue || debuffData.duration;

      if (durationValue && debuffData.durationType !== 'instant') {
        return formatDurationText(durationValue, debuffData.durationType, debuffData.durationUnit, debuffData.restType);
      }
    }

    // Handle different duration formats
    if (spell.durationType === 'instant') return 'Instant';
    if (spell.durationType === 'permanent') {
      const dispellable = spell.canBeDispelled ? ' (Dispellable)' : '';
      return `Permanent${dispellable}`;
    }

    // Handle type-specific durations
    if (spell.spellType === 'CHANNELED' && spell.typeConfig) {
      const maxDuration = spell.typeConfig.maxChannelDuration || 3;
      const unit = spell.typeConfig.durationUnit || 'TURNS';
      return `Up to ${maxDuration} ${unit.toLowerCase()}`;
    }

    if (spell.spellType === 'ZONE' && spell.typeConfig) {
      const zoneDuration = spell.typeConfig.zoneDuration || 60;
      const unit = spell.typeConfig.zoneDurationUnit || 'seconds';
      return `${zoneDuration} ${unit}`;
    }

    // Check durationConfig
    if (spell.durationConfig?.durationType && spell.durationConfig.durationType !== 'instant') {
      const dv = spell.durationConfig.durationValue || spell.durationConfig.duration || 1;
      return formatDurationText(dv, spell.durationConfig.durationType, spell.durationConfig.durationUnit);
    }

    const duration = spell.duration ||
                     (spell.durationConfig && spell.durationConfig.duration) ||
                     (spell.typeConfig && spell.typeConfig.duration) ||
                     'Instant';

    return duration;
  };

  // Format cooldown from wizard cooldownConfig
  const formatCooldown = () => {
    if (!spell?.cooldownConfig) return null;

    const config = spell.cooldownConfig;
    const cooldownType = config.cooldownType || config.type;
    const cooldownValue = config.cooldownValue ?? config.value;

    switch (cooldownType) {
      case 'turn_based':
        if (!cooldownValue || cooldownValue === 0) return 'No cooldown';
        return `${cooldownValue} turn${cooldownValue > 1 ? 's' : ''}`;

      case 'short_rest':
        if (!cooldownValue || cooldownValue === 0) return 'No uses';
        return `${cooldownValue} use${cooldownValue > 1 ? 's' : ''}/short rest`;

      case 'long_rest':
        if (!cooldownValue || cooldownValue === 0) return 'No uses';
        return `${cooldownValue} use${cooldownValue > 1 ? 's' : ''}/long rest`;

      case 'charge_based':
        const charges = config.charges || 1;
        const recovery = config.recovery || 1;
        return `${charges} charge${charges > 1 ? 's' : ''} (${recovery} turn${recovery > 1 ? 's' : ''}/charge)`;

      case 'dice_based':
        return cooldownValue ? `${cooldownValue} cooldown` : 'Dice-based cooldown';

      default:
        if (cooldownType === 'none' || !cooldownType) {
          if (cooldownValue && cooldownValue > 0) return `${cooldownValue} turn${cooldownValue > 1 ? 's' : ''}`;
          return 'No cooldown';
        }
        return null;
    }
  };

  // Format type-specific configuration as subtle bullet points
  const formatTypeSpecificBullets = () => {
    if (!spell || !spell.typeConfig) return [];

    const bullets = [];
    const typeConfig = spell.typeConfig;

    switch (spell.spellType) {
      case 'CHANNELED':
        // Add duration as first bullet point for channeled spells
        const maxDuration = typeConfig.maxChannelDuration || 3;
        const unit = typeConfig.durationUnit || 'TURNS';
        bullets.push(`Up to ${maxDuration} ${unit.toLowerCase()}`);

        // Show interruption status
        if (typeConfig.interruptible !== undefined) {
          bullets.push(typeConfig.interruptible ? 'Can be interrupted' : 'Cannot be interrupted');
        }

        // Show movement restrictions
        if (typeConfig.movementAllowed !== undefined) {
          bullets.push(typeConfig.movementAllowed ? 'Can move while channeling' : 'Must stand still');
        }

        // Note: Resource cost frequency is now shown next to the resource costs, not as a separate bullet

        // Show concentration DC (including base DC 10)
        if (typeConfig.concentrationDC !== undefined) {
          bullets.push(`DC ${typeConfig.concentrationDC} ${typeConfig.dcType || 'Spirit'}`);
        }

        // Show tick frequency (including end of turn)
        if (typeConfig.tickFrequency) {
          bullets.push(`${typeConfig.tickFrequency.replace(/_/g, ' ').toLowerCase()}`);
        }

        if (typeConfig.breakEffect && typeConfig.breakEffect !== 'none') {
          bullets.push(`break: ${typeConfig.breakEffect}`);
        }

        // Show channeling stages (staged channeling)
        if (spell?.channelingConfig?.type === 'staged' && spell.channelingConfig.stages?.length > 0) {
          spell.channelingConfig.stages.forEach((stage, i) => {
            let stageText = stage.name || `Stage ${i + 1}`;
            if (stage.threshold) stageText += ` (${stage.threshold} turn${stage.threshold !== 1 ? 's' : ''})`;
            if (stage.effect || stage.description) stageText += `: ${stage.effect || stage.description}`;
            bullets.push(stageText);
          });
        }

        // Show power-up per-round scaling
        if (spell?.channelingConfig?.type === 'power_up' && spell.channelingConfig.perRoundFormulas) {
          const prf = spell.channelingConfig.perRoundFormulas;
          const keys = Object.keys(prf);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const rounds = prf[firstKey];
            if (Array.isArray(rounds) && rounds.length > 1) {
              const scaling = rounds.map(r => r.formula || r).join(' â†’ ');
              bullets.push(`Scaling: ${scaling}`);
            }
          }
        }

        // Show persistent aura/field info
        if (spell?.channelingConfig?.type === 'persistent') {
          const cc = spell.channelingConfig;
          if (cc.persistentRadius) bullets.push(`${cc.persistentRadius}ft radius aura`);
          if (cc.initialRadius && cc.maxRadius && cc.expansionRate) {
            bullets.push(`${cc.initialRadius}ft â†’ ${cc.maxRadius}ft (+${cc.expansionRate}ft/tick)`);
          }
        }
        break;

      case 'REACTION':
        // Show availability only if it's not the default "always available"
        if (typeConfig.availabilityType && typeConfig.availabilityType !== 'ALWAYS') {
          const availability = typeConfig.availabilityType.replace(/_/g, ' ').toLowerCase();
          bullets.push(availability);
        }

        // Show uses per turn if limited
        if (typeConfig.limitUsesPerTurn && typeConfig.usesPerTurn) {
          bullets.push(`${typeConfig.usesPerTurn}/turn`);
        }

        // Show reaction window if not immediate
        if (typeConfig.reactionWindow && typeConfig.reactionWindow !== 'immediate') {
          bullets.push(`${typeConfig.reactionWindow} window`);
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'TRAP':
        // Check both typeConfig and trapConfig for trap properties
        const trapConfig = spell.trapConfig || {};

        // Show placement time if more than 1 turn
        const placementTime = typeConfig.placementTime || trapConfig.placementTime;
        if (placementTime && placementTime > 1) {
          bullets.push(`${placementTime} turns to place`);
        }

        // Show visibility (default to "visible to all")
        const visibility = typeConfig.visibility || trapConfig.visibility || 'visible';
        if (visibility === 'hidden') {
          bullets.push('hidden');
        } else if (visibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        const cooldown = typeConfig.cooldownAfterTrigger !== undefined ? typeConfig.cooldownAfterTrigger : trapConfig.resetTime;
        if (cooldown !== undefined) {
          if (cooldown === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || trapConfig.cooldownUnit || 'seconds';
            bullets.push(`${cooldown} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        const maxTriggers = typeConfig.maxTriggers !== undefined ? typeConfig.maxTriggers : trapConfig.maxTriggers;
        if (maxTriggers !== undefined) {
          if (maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (maxTriggers === 1) {
            bullets.push('single use');
          } else if (maxTriggers > 1) {
            bullets.push(`max ${maxTriggers} triggers`);
          }
        }
        break;

      case 'ZONE':
        // Show zone duration
        if (typeConfig.zoneDuration) {
          const unit = typeConfig.zoneDurationUnit || 'seconds';
          bullets.push(`${typeConfig.zoneDuration} ${unit}`);
        }

        if (typeConfig.leaveTrail) {
          bullets.push('leaves trail');
          if (typeConfig.trailDuration) {
            bullets.push(`trail: ${typeConfig.trailDuration} ${typeConfig.trailDurationUnit || 'rounds'}`);
          }
        }
        break;

      case 'STATE':
        // Show visibility (default to "visible to all")
        const stateVisibility = typeConfig.stateVisibility || 'visible';
        if (stateVisibility === 'hidden') {
          bullets.push('hidden');
        } else if (stateVisibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'PASSIVE':
        // Toggleable is now displayed as part of the "Passive" tag, not as a bullet
        // No bullets for PASSIVE type
        break;

      case 'ACTION':
        // No bullets for ACTION type - removed to reduce header clutter
        break;
    }

    // Add propagation information as bullets (applies to all spell types)
    if (spell?.propagation && spell.propagation.method !== 'none') {
      const { method, behavior, parameters } = spell.propagation;

      // Add method-specific bullets
      switch (method) {
        case 'chain':
          if (parameters?.count) {
            bullets.push(`chains to ${parameters.count} targets`);
          }
          if (parameters?.decay && parameters.decay > 0) {
            bullets.push(`${parameters.decay}% decay per jump`);
          }
          break;

        case 'bounce':
          if (parameters?.count) {
            bullets.push(`bounces ${parameters.count} times`);
          }
          break;

        case 'explosion':
          // Don't add explosion bullet - it's already shown in the propagation badge
          break;

        case 'forking':
          if (parameters?.forkCount) {
            bullets.push(`splits into ${parameters.forkCount} forks`);
          }
          break;

        case 'spreading':
          if (parameters?.spreadRate) {
            bullets.push(`spreads at ${parameters.spreadRate}ft/s`);
          }
          break;

        case 'seeking':
          if (parameters?.range) {
            bullets.push(`seeks targets within ${parameters.range}ft`);
          }
          break;
      }

      // Add behavior-specific information
      if (behavior) {
        switch (behavior) {
          case 'nearest':
            bullets.push('targets nearest');
            break;
          case 'farthest':
            bullets.push('targets farthest');
            break;
          case 'random':
            bullets.push('targets randomly');
            break;
          case 'lowest_health':
            bullets.push('targets lowest HP');
            break;
          case 'highest_health':
            bullets.push('targets highest HP');
            break;
          case 'accelerating':
            bullets.push('accelerates with each bounce');
            break;
          case 'decelerating':
            bullets.push('slows with each bounce');
            break;
          case 'ricocheting':
            bullets.push('ricochets off surfaces');
            break;
        }
      }
    }

    return bullets;
  };

  return {
    formatCastTime,
    formatRange,
    formatEffectTargeting,
    formatTargetingType,
    formatPropagation,
    formatDuration,
    formatCooldown,
    formatTypeSpecificBullets,
  };
};

export default useTargetingFormatters;
