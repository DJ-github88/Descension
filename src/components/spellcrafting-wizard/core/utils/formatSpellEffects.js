/**
 * Utility function to format spell effects for display in the LibraryStyleSpellCard component
 */

import { formatFormulaToPlainEnglish } from '../../components/common/SpellCardUtils';



/**
 * Format damage effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted damage effects
 */
export const formatDamageEffects = (spell) => {
  if (!spell) return [];

  const effects = [];
  const damageTypes = [];

  // Add the school from typeConfig if available
  if (spell.typeConfig?.school) {
    damageTypes.push(spell.typeConfig.school);
  }

  // Add additional damage types if available
  if (spell.typeConfig?.secondaryElement) {
    damageTypes.push(spell.typeConfig.secondaryElement);
  }

  // Check for direct damage
  if (spell.primaryDamage || (spell.effectType === 'damage' && spell.formula) || spell.damageConfig?.formula) {
    // Format damage types with proper capitalization
    let damageTypeText = '';
    if (damageTypes.length > 0) {
      damageTypeText = ' ' + damageTypes.map(type => {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }).join(' & ') + ' damage';
    }

    // Check for specific named spells that should use coin mechanics
    if ((spell.name && (
          spell.name.toLowerCase().includes('fortune frost') ||
          spell.name.toLowerCase().includes('coin toss') ||
          spell.name.toLowerCase().includes('lucky strike') ||
          spell.name.toLowerCase().includes('gambler') ||
          spell.name.toLowerCase().includes('fate')
        )) ||
        (spell.id === 'fortune_frost') ||
        // Only use coin mechanics if explicitly configured
        (spell.resolution === 'COINS' && spell.coinConfig)) {
      const flipCount = spell.coinConfig?.flipCount || 5;
      const formula = spell.coinConfig?.formula || 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)';

      // Convert technical formula to plain English
      const plainEnglish = formatFormulaToPlainEnglish(formula, 'damage');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="coin-formula">Flip ${flipCount} coins: ${plainEnglish}${damageTypeText}</span>`);
    }
    // Check for specific named spells that should use card mechanics
    else if ((spell.name && (
               spell.name.toLowerCase().includes('arcane gambit') ||
               spell.name.toLowerCase().includes('card') ||
               spell.name.toLowerCase().includes('deck') ||
               spell.name.toLowerCase().includes('dealer') ||
               spell.name.toLowerCase().includes('joker')
             )) ||
             (spell.id === 'arcane_gambit' || spell.id === 'wqcsbdql' || spell.id === 'nature-card-growth') ||
             // Only use card mechanics if explicitly configured
             (spell.resolution === 'CARDS' && spell.cardConfig)) {
      const drawCount = spell.cardConfig?.drawCount || 4;
      const formula = spell.cardConfig?.formula || spell.damageConfig?.formula || 'card values + face cards × 5';

      // Convert technical formula to plain English
      const plainEnglish = formatFormulaToPlainEnglish(formula, 'damage');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="card-formula">Draw ${drawCount} cards: ${plainEnglish}${damageTypeText}</span>`);
    }
    // Standard dice-based damage - only if spell actually has damage
    else if (spell.effectTypes?.includes('damage')) {
      const damageAmount = spell.damageConfig?.formula ||
                          spell.primaryDamage?.dice ||
                          spell.diceConfig?.formula ||
                          spell.formula;
      if (damageAmount) {
        // Apply formatting if it's a formula with technical variables
        const formattedDamageAmount = spell.damageConfig?.formula ?
          formatFormulaToPlainEnglish(damageAmount, 'damage') : damageAmount;
        effects.push(`${formattedDamageAmount}${damageTypeText}`);
      }
    }
  }

  // Check for DoT damage
  if (spell.isDot || spell.hasDotEffect) {
    // Format damage types with proper capitalization
    let damageTypeText = '';
    if (damageTypes.length > 0) {
      damageTypeText = ' ' + damageTypes.map(type => {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }).join(' & ') + ' damage';
    }

    const duration = spell.dotDuration || 3;
    const dotTick = spell.dotTick || '1d4';
    effects.push(`${dotTick} over ${duration} rounds${damageTypeText}`);
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

  // Check for direct healing
  if (spell.healing || (spell.effectType === 'healing' && spell.formula) || spell.healingConfig?.formula) {
    // Check for specific named spells that should use coin mechanics for healing
    if ((spell.name && (
          spell.name.toLowerCase().includes('fortune frost') ||
          spell.name.toLowerCase().includes('lucky heal') ||
          spell.name.toLowerCase().includes('coin blessing') ||
          spell.name.toLowerCase().includes('fate mend')
        )) ||
        (spell.id === 'fortune_frost') ||
        // Only use coin mechanics if explicitly configured
        (spell.resolution === 'COINS' && spell.healingCoinConfig)) {
      const flipCount = spell.healingCoinConfig?.flipCount || 5;
      const formula = spell.healingCoinConfig?.formula || 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)';

      // Convert technical formula to plain English
      const plainEnglish = formatFormulaToPlainEnglish(formula, 'healing');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="coin-formula">Flip ${flipCount} coins: ${plainEnglish}</span>`);
    }
    // Check for specific named spells that should use card mechanics for healing
    else if ((spell.name && (
               spell.name.toLowerCase().includes('arcane gambit') ||
               spell.name.toLowerCase().includes('card') ||
               spell.name.toLowerCase().includes('deck') ||
               spell.name.toLowerCase().includes('dealer') ||
               spell.name.toLowerCase().includes('joker') ||
               spell.name.toLowerCase().includes('ace of hearts')
             )) ||
             (spell.id === 'arcane_gambit' || spell.id === 'wqcsbdql' || spell.id === 'nature-card-growth') ||
             // Only use card mechanics if explicitly configured
             (spell.resolution === 'CARDS' && spell.healingCardConfig)) {
      const drawCount = spell.healingCardConfig?.drawCount || 3;
      const formula = spell.healingCardConfig?.formula || spell.healingConfig?.formula || 'CARD_VALUE + FACE_CARD_COUNT * 3';

      // Convert technical formula to plain English
      const plainEnglish = formatFormulaToPlainEnglish(formula, 'healing');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="card-formula">Draw ${drawCount} cards: ${plainEnglish}</span>`);
    }
    // Standard dice-based healing
    else {
      const healAmount = spell.healingConfig?.formula ||
                        spell.healing?.dice ||
                        spell.diceConfig?.formula ||
                        spell.formula ||
                        '6d6';
      // Apply formatting if it's a formula with technical variables
      const formattedHealAmount = spell.healingConfig?.formula ?
        formatFormulaToPlainEnglish(healAmount, 'healing') : healAmount;
      effects.push(`${formattedHealAmount}`);
    }
  }

  // Check for HoT
  if (spell.isHot || spell.hasHotEffect || spell.healingConfig?.hasHotEffect) {
    const duration = spell.healingConfig?.hotConfig?.duration || spell.hotDuration || 3;
    const hotTick = spell.healingConfig?.hotConfig?.tickFormula || spell.hotTick || '1d4';
    const formattedHotTick = formatFormulaToPlainEnglish(hotTick, 'healing');
    effects.push(`HoT: ${formattedHotTick} for ${duration} rounds`);
  }

  // Check for Shield
  if (spell.isShield || spell.hasShieldEffect) {
    const duration = spell.shieldDuration || 3;
    const shieldAmount = spell.shieldAmount || '2d6';
    const formattedShieldAmount = formatFormulaToPlainEnglish(shieldAmount, 'healing');
    effects.push(`${formattedShieldAmount} for ${duration} rounds`);
  }

  return effects;
};

/**
 * Format buff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted buff effects
 */
export const formatBuffEffects = (spell) => {
  if (!spell || !spell.buffConfig) return [];

  const effects = [];

  // Add stat modifiers if present
  if (spell.buffConfig.statModifiers && spell.buffConfig.statModifiers.length > 0) {
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

  return effects;
};

/**
 * Format debuff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted debuff effects
 */
export const formatDebuffEffects = (spell) => {
  if (!spell || !spell.debuffConfig) return [];

  const effects = [];

  // Helper function to format duration
  const formatDuration = () => {
    if (spell.debuffConfig.durationType === 'rest') {
      if (spell.debuffConfig.restType === 'short') {
        return 'until short rest';
      } else if (spell.debuffConfig.restType === 'long') {
        return 'until long rest';
      }
    } else if (spell.debuffConfig.durationType === 'permanent') {
      return spell.debuffConfig.canBeDispelled ? 'permanent (dispellable)' : 'permanent';
    } else if (spell.debuffConfig.durationType === 'time') {
      return `${spell.debuffConfig.durationValue || 1} ${spell.debuffConfig.durationUnit || 'minutes'}`;
    } else {
      return `${spell.debuffConfig.durationValue || spell.debuffConfig.duration || 3} ${spell.debuffConfig.durationUnit || 'rounds'}`;
    }
  };

  // Add stat penalties if present
  if (spell.debuffConfig.statPenalties && spell.debuffConfig.statPenalties.length > 0) {
    spell.debuffConfig.statPenalties.forEach(penalty => {
      const statName = penalty.name || 'Stat';
      let magnitude = penalty.magnitude || 2;

      // Handle dice formulas
      if (typeof magnitude === 'string' && magnitude.includes('d')) {
        const debuffEffect = `${magnitude} ${statName.toLowerCase()} decrease`;
        effects.push(`${statName}: ${debuffEffect}`);
      } else {
        const sign = magnitude >= 0 ? '' : '';
        const value = penalty.magnitudeType === 'percentage' ? `${sign}${magnitude}%` : `${sign}${magnitude}`;
        const debuffEffect = `${Math.abs(magnitude)}${penalty.magnitudeType === 'percentage' ? '%' : ''} ${statName.toLowerCase()} decrease`;
        effects.push(`${statName}: ${debuffEffect}`);
      }
    });
  }

  // Add status effects if present
  if (spell.debuffConfig.statusEffects && spell.debuffConfig.statusEffects.length > 0) {
    spell.debuffConfig.statusEffects.forEach(statusEffect => {
      let effectName = statusEffect.name || statusEffect.id;
      effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

      // Add level information if it's not 'moderate' (default)
      if (statusEffect.level && statusEffect.level !== 'moderate') {
        const levelMap = {
          'minor': 'Minor',
          'major': 'Major',
          'severe': 'Severe',
          'extreme': 'Extreme'
        };
        const levelDisplay = levelMap[statusEffect.level] || statusEffect.level;
        effectName = `${levelDisplay} ${effectName}`;
      }

      // Enhanced formatting for charmed effect
      if (statusEffect.id === 'charmed' || statusEffect.id === 'charm') {
        const charmType = statusEffect.charmType || statusEffect.option || 'friendly';
        const charmDescriptions = {
          'friendly': 'regards you as a friend but maintains free will',
          'dominated': 'must obey your commands without question',
          'infatuated': 'is devoted to you and will protect you at all costs'
        };

        let description = `${effectName} (${charmType}) - target ${charmDescriptions[charmType] || 'is charmed'}`;

        // Add restrictions based on configuration
        const restrictions = [];
        if (statusEffect.canAttackCharmer === false) {
          restrictions.push('cannot attack charmer');
        } else if (statusEffect.canAttackCharmer === true) {
          restrictions.push('can attack charmer');
        }

        if (statusEffect.canSelfHarm === false) {
          restrictions.push('cannot be commanded to self-harm');
        }

        if (statusEffect.retainsMemory === true) {
          restrictions.push('retains memory of actions');
        }

        if (restrictions.length > 0) {
          description += ` (${restrictions.join(', ')})`;
        }

        // Add command limitations
        if (statusEffect.commandComplexity) {
          const complexityMap = {
            'simple': 'simple commands only',
            'moderate': 'moderate complexity commands',
            'complex': 'complex commands allowed',
            'any': 'any commands allowed'
          };
          description += ` - ${complexityMap[statusEffect.commandComplexity]}`;
        }

        if (statusEffect.maxCommands && statusEffect.maxCommands > 1) {
          description += ` (max ${statusEffect.maxCommands} commands)`;
        }

        // Add save information - prioritize status effect's own saveDC, then debuff config
        const saveDC = statusEffect.saveDC || spell.debuffConfig.difficultyClass;
        if (saveDC) {
          const saveType = statusEffect.saveType || 'wisdom';
          description += ` - ${saveType.charAt(0).toUpperCase() + saveType.slice(1)} save DC ${saveDC}`;

          // Add save outcome information
          if (statusEffect.saveOutcome) {
            const outcomeMap = {
              'negates': 'negated on save',
              'halves_duration': 'duration halved on save',
              'ends_early': 'ends at end of turn on save',
              'partial_immunity': 'partial immunity on save',
              'reduces_level': 'level reduced on save'
            };
            description += ` (${outcomeMap[statusEffect.saveOutcome]})`;
          }

          // Add save trigger information
          if (statusEffect.saveTrigger) {
            const triggerMap = {
              'none': 'no additional saves',
              'harmful': 'save when given harmful command',
              'turn': 'save each turn',
              'damage': 'save when taking damage'
            };
            description += `, ${triggerMap[statusEffect.saveTrigger]}`;
          }
        }

        effects.push(description);
      } else {
        // General status effect formatting
        let description = effectName;

        // Add option information if available
        if (statusEffect.option && statusEffect.option !== 'basic') {
          const optionName = statusEffect.option.charAt(0).toUpperCase() + statusEffect.option.slice(1);
          description = `${description} (${optionName})`;
        }

        // Add save information for any status effect with save configuration
        const saveDC = statusEffect.saveDC || spell.debuffConfig.difficultyClass;
        if (saveDC && statusEffect.saveType && statusEffect.saveType !== 'none') {
          const saveType = statusEffect.saveType;
          description += ` - ${saveType.charAt(0).toUpperCase() + saveType.slice(1)} save DC ${saveDC}`;

          // Add save outcome information
          if (statusEffect.saveOutcome) {
            const outcomeMap = {
              'negates': 'negated on save',
              'halves_duration': 'duration halved on save',
              'ends_early': 'ends at end of turn on save',
              'partial_immunity': 'partial immunity on save',
              'reduces_level': 'level reduced on save'
            };
            description += ` (${outcomeMap[statusEffect.saveOutcome]})`;
          }

          // Add save frequency information
          if (statusEffect.saveFrequency && statusEffect.saveFrequency !== 'initial') {
            const frequencyMap = {
              'end_of_turn': 'save each turn',
              'when_damaged': 'save when damaged',
              'out_of_sight': 'save when out of sight',
              'ally_help': 'save when ally helps',
              'special_trigger': 'save on special trigger'
            };
            description += `, ${frequencyMap[statusEffect.saveFrequency]}`;
          }
        }

        effects.push(description);
      }
    });
  }

  // Add additional debuff information if effects exist
  if (effects.length > 0) {
    const duration = formatDuration();
    if (duration && duration !== '3 rounds') { // Don't show default duration
      effects.push(`Duration: ${duration}`);
    }

    // Add concentration requirement if applicable
    if (spell.debuffConfig.concentrationRequired) {
      effects.push('Requires Concentration');
    }

    // Add saving throw information
    if (spell.debuffConfig.savingThrow && spell.debuffConfig.difficultyClass) {
      const saveType = spell.debuffConfig.savingThrow.charAt(0).toUpperCase() + spell.debuffConfig.savingThrow.slice(1);

      // Format save outcome
      let outcomeText = 'negates';
      if (spell.debuffConfig.saveOutcome) {
        const outcomeMap = {
          'negates': 'negates',
          'halves_duration': 'halves duration',
          'halves_effects': 'halves effects',
          'reduces_level': 'reduces level'
        };
        outcomeText = outcomeMap[spell.debuffConfig.saveOutcome] || 'negates';
      }

      effects.push(`${saveType} save DC ${spell.debuffConfig.difficultyClass} ${outcomeText}`);
    }

    // Add stacking rule information
    if (spell.debuffConfig.stackingRule && spell.debuffConfig.stackingRule !== 'replace') {
      const stackingRules = {
        'selfStacking': 'Self-stacking',
        'cumulative': 'Cumulative',
        'progressive': 'Progressive',
        'diminishing': 'Diminishing returns'
      };
      const stackingName = stackingRules[spell.debuffConfig.stackingRule] || spell.debuffConfig.stackingRule;

      if (spell.debuffConfig.maxStacks && spell.debuffConfig.maxStacks > 1) {
        effects.push(`${stackingName} (max ${spell.debuffConfig.maxStacks} stacks)`);
      } else {
        effects.push(stackingName);
      }
    }

    // Add dispellable information for permanent effects
    if (spell.debuffConfig.durationType === 'permanent') {
      if (spell.debuffConfig.canBeDispelled === false) {
        effects.push('Cannot be dispelled');
      } else if (spell.debuffConfig.canBeDispelled === true) {
        effects.push('Can be dispelled');
      }
    }
  }

  return effects;
};

/**
 * Format utility effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted utility effects
 */
export const formatUtilityEffects = (spell) => {
  if (!spell || !spell.utilityConfig) return [];

  const effects = [];

  // Handle utilityConfig.effects array
  if (spell.utilityConfig.effects && Array.isArray(spell.utilityConfig.effects)) {
    spell.utilityConfig.effects.forEach(effect => {
      if (typeof effect === 'object' && effect.name && effect.description) {
        // Format the effect as a readable string
        let effectText = `${effect.name}: ${effect.description}`;

        // Add duration if available
        if (effect.duration) {
          const durationUnit = spell.utilityConfig.durationUnit || 'rounds';
          effectText += ` for ${effect.duration} ${durationUnit}`;
        }

        effects.push(effectText);
      } else if (typeof effect === 'string') {
        effects.push(effect);
      }
    });
  }

  // Handle selectedEffects array (new object format)
  if (spell.utilityConfig.selectedEffects && Array.isArray(spell.utilityConfig.selectedEffects)) {
    spell.utilityConfig.selectedEffects.forEach(effect => {
      if (typeof effect === 'object' && effect.name) {
        // Use custom name if available, otherwise use the effect name
        const effectName = effect.customName || effect.name;

        // Add duration if available
        const duration = spell.utilityConfig.duration || spell.utilityConfig.durationValue;
        const durationUnit = spell.utilityConfig.durationUnit || 'rounds';

        if (duration) {
          effects.push(`${effectName} for ${duration} ${durationUnit}`);
        } else {
          effects.push(effectName);
        }
      } else if (typeof effect === 'string') {
        // Legacy string format - convert snake_case to readable format
        const readableName = effect.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Add duration if available
        const duration = spell.utilityConfig.duration || spell.utilityConfig.durationValue;
        const durationUnit = spell.utilityConfig.durationUnit || 'rounds';

        if (duration) {
          effects.push(`${readableName} for ${duration} ${durationUnit}`);
        } else {
          effects.push(readableName);
        }
      }
    });
  }

  // Add difficulty class information
  if (spell.utilityConfig.difficultyClass) {
    effects.push(`DC ${spell.utilityConfig.difficultyClass}`);
  }

  // Add concentration requirement
  if (spell.utilityConfig.concentration) {
    effects.push('Requires Concentration');
  }

  // Add ability save information
  if (spell.utilityConfig.abilitySave) {
    const abilityMap = {
      'str': 'Strength',
      'agi': 'Agility',
      'int': 'Intelligence',
      'spi': 'Spirit',
      'cha': 'Charisma'
    };

    const abilityName = abilityMap[spell.utilityConfig.abilitySave] || spell.utilityConfig.abilitySave;
    effects.push(`${abilityName} Save`);
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
    utilityEffects: formatUtilityEffects(spell)
  };
};
