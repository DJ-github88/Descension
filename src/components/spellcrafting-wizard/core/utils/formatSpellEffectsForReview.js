/**
 * Utility functions to format spell effects for display in the LibraryStyleSpellCard component
 * These functions are extracted from the Step10Review component to ensure consistent formatting
 */

/**
 * Format damage effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted damage effects
 */
export const formatDamageEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Get damage types from all possible sources
  const damageTypes = [];

  // Add from damageTypes array
  if (spell.damageTypes && spell.damageTypes.length > 0) {
    spell.damageTypes.forEach(type => {
      if (!damageTypes.includes(type)) {
        damageTypes.push(type);
      }
    });
  }

  // Add the school from typeConfig if available
  if (spell.typeConfig?.school && !damageTypes.includes(spell.typeConfig.school)) {
    damageTypes.push(spell.typeConfig.school);
  }

  // Add from damageConfig if available
  if (spell.damageConfig?.elementType && !damageTypes.includes(spell.damageConfig.elementType)) {
    damageTypes.push(spell.damageConfig.elementType);
  }

  // Add additional damage types if available
  if (spell.typeConfig?.secondaryElement && !damageTypes.includes(spell.typeConfig.secondaryElement)) {
    damageTypes.push(spell.typeConfig.secondaryElement);
  }

  // Add from school if available and no other damage types found
  if (damageTypes.length === 0 && spell.school) {
    damageTypes.push(spell.school);
  }

  // Check for direct damage
  if (spell.primaryDamage || (spell.effectType === 'damage' && spell.formula) || spell.damageConfig?.formula) {
    // Get formula from all possible sources
    const damageAmount = spell.damageConfig?.formula ||
                        spell.primaryDamage?.dice ||
                        spell.diceConfig?.formula ||
                        spell.formula ||
                        '6d6';

    // Add flat damage if available
    const flatDamage = spell.primaryDamage?.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';

    // Get the primary damage type with proper capitalization
    const primaryType = damageTypes.length > 0 ?
                      damageTypes[0].charAt(0).toUpperCase() + damageTypes[0].slice(1) :
                      'Physical';

    // Create a more visually appealing format for the damage effect
    effects.push(`Direct ${primaryType} Damage: ${damageAmount}${flatDamage}`);
  }

  // Check for DoT damage
  if (spell.isDot || spell.hasDotEffect || spell.damageConfig?.hasDotEffect) {
    // Get duration from all possible sources
    const duration = spell.damageConfig?.dotConfig?.duration ||
                    spell.dotDuration ||
                    3;

    // Get tick formula from all possible sources
    const dotTick = spell.damageConfig?.dotConfig?.tickFormula ||
                   spell.dotTick ||
                   '1d4';

    // Get the primary damage type with proper capitalization
    const primaryType = damageTypes.length > 0 ?
                      damageTypes[0].charAt(0).toUpperCase() + damageTypes[0].slice(1) :
                      'Physical';

    // Use "DoT" instead of "dot" as requested in the memories
    effects.push(`${primaryType} DoT: ${dotTick} for ${duration} rounds`);
  }

  // Check for channeled damage - only add a summary, not the details
  if ((spell.spellType === 'CHANNELED' || spell.spellType === 'channeled') &&
      spell.channelingConfig?.perRoundFormulas?.damage) {
    const rounds = spell.channelingConfig.perRoundFormulas.damage;
    if (Array.isArray(rounds) && rounds.length > 0) {
      // Get the primary damage type with proper capitalization
      const primaryType = damageTypes.length > 0 ?
                        damageTypes[0].charAt(0).toUpperCase() + damageTypes[0].slice(1) :
                        'Physical';

      // Just add a summary, not the full details since they'll be in the channeling section
      effects.push(`Channeled ${primaryType} Damage: Scales over ${rounds.length} rounds`);
    }
  }

  return effects;
};

/**
 * Format healing effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted healing effects
 */
export const formatHealingEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Determine if this is Nature or Holy healing based on spell school or damage types
  const isNatureHealing =
    (spell.school && spell.school.toLowerCase() === 'nature') ||
    (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

  // Check for direct healing
  if (spell.healing || (spell.effectType === 'healing' && spell.formula) || spell.healingConfig?.formula) {
    // Get formula from all possible sources
    const healAmount = spell.healingConfig?.formula ||
                      spell.healing?.dice ||
                      spell.diceConfig?.formula ||
                      spell.formula ||
                      '6d6';

    // Add flat healing if available
    const flatHealing = spell.healing?.flat > 0 ? ` + ${spell.healing.flat}` : '';

    effects.push(`Direct ${isNatureHealing ? 'Nature' : 'Holy'} Healing: ${healAmount}${flatHealing}`);
  }

  // Check for HoT
  if (spell.isHot || spell.hasHotEffect || spell.healingConfig?.hasHotEffect) {
    // Get duration from all possible sources
    const duration = spell.healingConfig?.hotConfig?.duration ||
                    spell.hotDuration ||
                    3;

    // Get tick formula from all possible sources
    const hotTick = spell.healingConfig?.hotConfig?.tickFormula ||
                   spell.hotTick ||
                   '1d4';

    // Use "HoT" instead of "Time" as requested in the memories
    effects.push(`${isNatureHealing ? 'Nature' : 'Holy'} HoT: ${hotTick} for ${duration} rounds`);
  }

  // Check for Shield
  if (spell.isShield || spell.hasShieldEffect) {
    const duration = spell.shieldDuration || 3;
    const shieldAmount = spell.shieldAmount || '2d6';
    effects.push(`${isNatureHealing ? 'Nature' : 'Holy'} Absorption Shield: ${shieldAmount} for ${duration} rounds`);
  }

  // Check for critical healing effects
  if (spell.criticalConfig?.enabled && spell.effectType === 'healing') {
    if (spell.criticalConfig.useRollableTable && spell.rollableTable) {
      effects.push(spell.criticalConfig.displayText || `On Critical: Roll on ${spell.rollableTable.name} table (${spell.rollableTable.diceType})`);
    } else if (spell.criticalConfig.critMultiplier) {
      effects.push(`On Critical: ${spell.criticalConfig.critMultiplier}x healing`);
    }
  }

  // Check for channeled healing - only add a summary, not the details
  if ((spell.spellType === 'CHANNELED' || spell.spellType === 'channeled') &&
      spell.channelingConfig?.perRoundFormulas?.healing) {
    const rounds = spell.channelingConfig.perRoundFormulas.healing;
    if (Array.isArray(rounds) && rounds.length > 0) {
      // Just add a summary, not the full details since they'll be in the channeling section
      effects.push(`Channeled ${isNatureHealing ? 'Nature' : 'Holy'} Healing: Scales over ${rounds.length} rounds`);
    }
  }

  return effects;
};

/**
 * Format buff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted buff effects
 */
export const formatBuffEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Check if spell has buff effects
  if (spell.buffConfig || spell.effectTypes?.includes('buff')) {
    // Use displayEffects if available
    if (spell.buffConfig?.displayEffects && spell.buffConfig.displayEffects.length > 0) {
      spell.buffConfig.displayEffects.forEach(effect => {
        effects.push(`${effect.name}: ${effect.description}`);
      });
    }
    // Use statBonuses if available
    else if (spell.buffConfig?.statBonuses && spell.buffConfig.statBonuses.length > 0) {
      spell.buffConfig.statBonuses.forEach(bonus => {
        const value = bonus.isPercentage ? `${bonus.value}%` : bonus.value;
        const statName = bonus.stat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        effects.push(`${statName}: ${value > 0 ? '+' : ''}${value}`);
      });
    }
    // Use statModifiers if available
    else if (spell.buffConfig?.statModifiers && spell.buffConfig.statModifiers.length > 0) {
      spell.buffConfig.statModifiers.forEach(modifier => {
        const effectName = `${modifier.name || 'Stat'} Boost`;
        const buffEffect = `${modifier.magnitude || 2}${modifier.magnitudeType === 'percentage' ? '%' : ''} ${modifier.name || 'stat'} increase`;

        // Format duration
        let duration = '';
        if (spell.buffConfig.durationType === 'rest') {
          if (spell.buffConfig.restType === 'short') {
            duration = 'until short rest';
          } else if (spell.buffConfig.restType === 'long') {
            duration = 'until long rest';
          }
        } else if (spell.buffConfig.durationType === 'permanent') {
          duration = 'permanent';
        } else {
          duration = `${spell.buffConfig.durationValue || spell.buffConfig.duration || 3} ${spell.buffConfig.durationUnit || 'rounds'}`;
        }

        effects.push(`${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`);
      });
    }

    // Add buff duration if not already included
    if (effects.length > 0 && !effects[0].includes('for ') && spell.buffConfig?.duration) {
      const durationType = spell.buffConfig.durationType || 'rounds';
      effects.push(`Duration: ${spell.buffConfig.duration} ${durationType}`);
    }
  }

  return effects;
};

/**
 * Format debuff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted debuff effects
 */
export const formatDebuffEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Check if spell has debuff effects
  if (spell.debuffConfig || spell.effectTypes?.includes('debuff')) {
    // Use displayEffects if available
    if (spell.debuffConfig?.displayEffects && spell.debuffConfig.displayEffects.length > 0) {
      spell.debuffConfig.displayEffects.forEach(effect => {
        effects.push(`${effect.name}: ${effect.description}`);
      });
    }
    // Use statPenalties if available
    else if (spell.debuffConfig?.statPenalties && spell.debuffConfig.statPenalties.length > 0) {
      spell.debuffConfig.statPenalties.forEach(penalty => {
        const value = penalty.isPercentage ? `${penalty.value}%` : penalty.value;
        const statName = penalty.stat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        effects.push(`${statName}: ${value < 0 ? '' : '-'}${Math.abs(value)}`);
      });
    }
    // Use older format if available
    else if (spell.debuffConfig?.statPenalties && spell.debuffConfig.statPenalties.length > 0) {
      spell.debuffConfig.statPenalties.forEach(penalty => {
        const effectName = `${penalty.name || 'Stat'} Reduction`;
        const debuffEffect = `${penalty.magnitude || 2}${penalty.magnitudeType === 'percentage' ? '%' : ''} ${penalty.name || 'stat'} decrease`;

        // Format duration
        let duration = '';
        if (spell.debuffConfig.durationType === 'rest') {
          if (spell.debuffConfig.restType === 'short') {
            duration = 'until short rest';
          } else if (spell.debuffConfig.restType === 'long') {
            duration = 'until long rest';
          }
        } else if (spell.debuffConfig.durationType === 'permanent') {
          duration = 'permanent';
        } else {
          duration = `${spell.debuffConfig.durationValue || spell.debuffConfig.duration || 3} ${spell.debuffConfig.durationUnit || 'rounds'}`;
        }

        effects.push(`${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`);
      });
    }

    // Control effects are now handled separately in formatControlEffects

    // Add debuff duration if not already included
    if (effects.length > 0 && !effects[0].includes('for ') && spell.debuffConfig?.duration) {
      const durationType = spell.debuffConfig.durationType || 'rounds';
      effects.push(`Duration: ${spell.debuffConfig.duration} ${durationType}`);
    }
  }

  return effects;
};

/**
 * Format control effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted control effects
 */
export const formatControlEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Check if spell has control effects from controlConfig
  if (spell.controlConfig || spell.effectType === 'control' || spell.effectTypes?.includes('control')) {
    // Use displayEffects if available
    if (spell.controlConfig?.displayEffects && spell.controlConfig.displayEffects.length > 0) {
      spell.controlConfig.displayEffects.forEach(effect => {
        effects.push(`${effect.name}: ${effect.description}`);
      });
    }
    // Use effects array if available
    else if (spell.controlConfig?.effects && spell.controlConfig.effects.length > 0) {
      spell.controlConfig.effects.forEach(effect => {
        const effectName = effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        effects.push(`${effectName}: Target is ${effect.toLowerCase()}`);
      });
    }

    // Add control type if available
    if (spell.controlConfig?.controlType && !effects.some(e => e.includes(spell.controlConfig.controlType))) {
      const controlType = spell.controlConfig.controlType.charAt(0).toUpperCase() + spell.controlConfig.controlType.slice(1);
      effects.push(`Control Type: ${controlType}`);
    }

    // Add saving throw information if available
    if (spell.controlConfig?.savingThrow) {
      const savingThrowType = spell.controlConfig.savingThrowType?.toUpperCase() || 'STR';
      const dc = spell.controlConfig.difficultyClass || 15;
      effects.push(`Saving Throw: ${savingThrowType} DC ${dc}`);
    }

    // Add duration if available
    if (spell.controlConfig?.duration && !effects.some(e => e.includes('for '))) {
      const durationUnit = spell.controlConfig.durationUnit || 'rounds';
      effects.push(`Duration: ${spell.controlConfig.duration} ${durationUnit}`);
    }
  }

  // Check for direct controlEffects array (legacy format)
  if (spell.controlEffects && spell.controlEffects.length > 0) {
    spell.controlEffects.forEach(effect => {
      // Handle both object and string formats
      if (typeof effect === 'object') {
        // Format object-based control effect
        let formattedEffect = '';

        // Add type if available
        if (effect.type) {
          formattedEffect = `${effect.type}`;

          // Add description if available
          if (effect.description) {
            formattedEffect += `: ${effect.description}`;
          }
        }

        // Add saving throw if available
        if (effect.savingThrow) {
          if (formattedEffect) {
            formattedEffect += ` (${effect.savingThrow})`;
          } else {
            formattedEffect = effect.savingThrow;
          }
        }

        // Add duration if available and not already included
        if (effect.duration && !formattedEffect.includes('for ')) {
          formattedEffect += ` for ${effect.duration}`;
        }

        // Add distance if available
        if (effect.distance) {
          formattedEffect += ` - Distance: ${effect.distance}ft`;
        }

        // Add concentration if available
        if (effect.concentration) {
          formattedEffect += ` (${effect.concentration})`;
        }

        effects.push(formattedEffect);
      } else if (typeof effect === 'string') {
        // Handle string format for backward compatibility
        // Try to extract information from the string
        const parts = effect.split(':');
        const effectType = parts[0].trim();
        let details = parts.length > 1 ? parts.slice(1).join(':').trim() : '';

        // Extract duration if present
        let duration = '';
        if (details.includes('for')) {
          const durParts = details.split('for');
          details = durParts[0].trim();
          duration = durParts[1].trim();
        }

        let formattedEffect = effectType;
        if (details) {
          formattedEffect += `: ${details}`;
        }
        if (duration) {
          formattedEffect += ` for ${duration}`;
        }

        effects.push(formattedEffect);
      }
    });
  }

  return effects;
};

/**
 * Format chance-on-hit effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted chance-on-hit effects
 */
export const formatProcEffects = (spell) => {
  if (!spell) return [];

  const effects = [];

  // Check if spell has chance-on-hit effects
  // Only include proc effects if they're not going to be displayed
  // in the dedicated proc section (when useRollableTable is false)
  if (spell.procConfig?.enabled && !spell.procConfig.useRollableTable) {
    // Use displayText if available
    if (spell.procConfig.displayText) {
      effects.push(spell.procConfig.displayText);
    }
    // Otherwise, construct the text
    else {
      const procChance = spell.procConfig.procChance || 15;
      const effectType = spell.procConfig.effectType?.charAt(0).toUpperCase() + spell.procConfig.effectType?.slice(1) || 'Effect';
      const effectDetails = spell.procConfig.effectDetails || 'special effect';

      // Format the proc chance to show dice equivalent
      let diceDisplay = '';
      if (procChance === 100) {
        diceDisplay = 'Always triggers (100%)';
      } else if (spell.procConfig.procType === 'dice') {
        const diceType = 'd20';
        const threshold = Math.ceil(20 - (procChance / 100 * 20));
        diceDisplay = `Roll ${threshold}+ on ${diceType} (${procChance}%)`;
      } else if (spell.procConfig.procType === 'cards') {
        diceDisplay = `Card draw (${procChance}%)`;
      } else if (spell.procConfig.procType === 'coins') {
        diceDisplay = `Coin flip (${procChance}%)`;
      } else {
        // Default to d100
        const threshold = Math.ceil(100 - procChance + 1);
        diceDisplay = `Roll ${threshold}+ on d100 (${procChance}%)`;
      }

      // Only show in the effects section if not using a rollable table
      effects.push(`Chance on Hit: ${diceDisplay}: ${effectType} - ${effectDetails}`);
    }
  }

  return effects;
};

/**
 * Format critical hit effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted critical hit effects
 */
export const formatCriticalEffects = (spell) => {
  if (!spell || !spell.criticalConfig?.enabled) return [];

  const effects = [];

  // Only include critical hit effects if they're not going to be displayed
  // in the dedicated critical hit section (when useRollableTable is false)
  if (!spell.criticalConfig.useRollableTable) {
    // Use displayText if available
    if (spell.criticalConfig.displayText) {
      effects.push(spell.criticalConfig.displayText);
    }
    // Otherwise, construct the text
    else {
      const critMultiplier = spell.criticalConfig.critMultiplier || 2;
      const effectType = spell.effectType === 'damage' ? 'damage' :
                        spell.effectType === 'healing' ? 'healing' : 'effect';

      if (spell.criticalConfig.critEffects && spell.criticalConfig.critEffects.length > 0) {
        const critEffects = spell.criticalConfig.critEffects.map(effect => {
          return effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }).join(', ');
        effects.push(`On Critical: ${critMultiplier}x ${effectType} and ${critEffects}`);
      } else {
        effects.push(`On Critical: ${critMultiplier}x ${effectType}`);
      }
    }
  }

  return effects;
};

/**
 * Format channeling effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted channeling effects
 */
export const formatChannelingEffects = (spell) => {
  if (!spell || (spell.spellType !== 'CHANNELED' && spell.spellType !== 'channeled')) return [];

  const effects = [];

  // Only include basic information here, as the detailed channeling info
  // will be displayed in the dedicated channeling section
  if (spell.channelingConfig) {
    // Add channeling type
    if (spell.channelingConfig.type) {
      const channelType = spell.channelingConfig.type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      effects.push(`Channel Type: ${channelType}`);
    }

    // Add max duration if not shown elsewhere
    if (spell.channelingConfig.maxDuration && !effects.some(e => e.includes('Duration'))) {
      effects.push(`Duration: ${spell.channelingConfig.maxDuration} ${spell.channelingConfig.durationUnit || 'rounds'}`);
    }

    // Add resource cost if not shown elsewhere
    if (spell.channelingConfig.costValue && spell.channelingConfig.costType &&
        !effects.some(e => e.includes('Cost'))) {
      effects.push(`Cost: ${spell.channelingConfig.costValue} ${spell.channelingConfig.costType} per ${
        spell.channelingConfig.costTrigger === 'per_second' ? 'second' :
        spell.channelingConfig.costTrigger === 'per_turn' ? 'turn' : 'round'
      }`);
    }
  }

  return effects;
};

/**
 * Format all effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Object} - Formatted effects
 */
export const formatAllEffects = (spell) => {
  return {
    damageEffects: formatDamageEffects(spell),
    healingEffects: formatHealingEffects(spell),
    buffEffects: formatBuffEffects(spell),
    debuffEffects: formatDebuffEffects(spell),
    controlEffects: formatControlEffects(spell),
    procEffects: formatProcEffects(spell),
    criticalEffects: formatCriticalEffects(spell),
    channelingEffects: formatChannelingEffects(spell)
  };
};
