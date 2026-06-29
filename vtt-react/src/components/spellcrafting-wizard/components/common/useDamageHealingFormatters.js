import { cleanFormula, normalizeSaveType } from './spellFormatterUtils';

const useDamageHealingFormatters = ({ spell, variant, enhanceFormulaDisplay }) => {

  const getDamageTypeSuffix = () => {
    // Get damage types for appending to formulas
    // Priority: use damageTypes array (from Step 1), then fallback to single damageType
    let damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    
    // If no array, try to get from typeConfig (Step 1)
    if (!damageTypesArray || damageTypesArray.length === 0) {
      damageTypesArray = [];
      if (spell.typeConfig?.school && spell.typeConfig.school.toLowerCase() !== 'physical') {
        damageTypesArray.push(spell.typeConfig.school);
      }
      if (spell.typeConfig?.secondaryElement) {
        damageTypesArray.push(spell.typeConfig.secondaryElement);
      }
    }
    
    // If still no array, try single damageType (for DoT spells, use elementType; for instant damage, use damageType)
    const singleDamageType = spell.damageConfig?.damageType ||
                  spell.effects?.damage?.instant?.type ||
                  null;

    // For DoT spells (damageType === 'dot'), use elementType for the suffix
    // For instant damage spells, use damageType
    const effectiveSingleType = singleDamageType === 'dot'
      ? (spell.damageConfig?.elementType || spell.effects?.damage?.dot?.type)
      : singleDamageType;

    // If we have an array, use it; otherwise use single type
    const effectiveDamageTypes = (damageTypesArray && damageTypesArray.length > 0) 
      ? damageTypesArray 
      : (effectiveSingleType ? [effectiveSingleType] : []);

    // Format damage type suffix - handle multiple types
    if (effectiveDamageTypes.length > 0) {
      const formattedTypes = effectiveDamageTypes
        .filter(type => type && type !== 'dot' && type !== 'physical' && type !== 'direct') // Filter out 'dot', 'physical', and 'direct' as they're not specific damage types
        .map(type => {
          // Capitalize first letter and handle special cases
          const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
          return capitalized;
        });
      
      if (formattedTypes.length > 0) {
        if (formattedTypes.length === 1) {
          return ` ${formattedTypes[0]} Damage`;
        } else {
          // Join with "and" for multiple types: "Cold and Lightning Damage"
          return ` ${formattedTypes.join(' and ')} Damage`;
        }
      }
    }
    return '';
  };

  // ===== CRITICAL HIT FORMATTING =====
  const formatCriticalHit = () => {
    const critConfig = spell.damageConfig?.criticalConfig || spell.healingConfig?.criticalConfig || spell.criticalConfig;
    if (!critConfig?.enabled) return null;

    if (critConfig.critOnlyEffect) {
      // Include special effects in effect-only mode
      const effects = critConfig.critEffects || [];
      if (effects.length > 0) {
        const effectNames = effects.map(effect => {
          // Format effect names nicely - convert underscores to spaces and capitalize each word
          return effect.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }).join(', ');
        return `Effect only: ${effectNames}`;
      }
      return 'Effect only on critical hit';
    }

    const { critType, critMultiplier, extraDice, cardCritRule, coinCritRule, coinCount,
            cardCritResolution, coinCritResolution, extraCardDraw, extraCoinFlips,
            explodingDice, explodingDiceType, critEffects } = critConfig;

    let critText = '';

    // Format based on resolution type
    if (critType === 'cards') {
      const rule = cardCritRule === 'face_cards' ? 'Face Cards (J,Q,K)' :
                   cardCritRule === 'aces' ? 'Aces' :
                   cardCritRule === 'specific_suit' ? 'Specific Suit' :
                   cardCritRule === 'red_cards' ? 'Red Cards' :
                   cardCritRule === 'black_cards' ? 'Black Cards' : 'Face Cards';

      if (cardCritResolution === 'draw_add') {
        critText = `${rule}: ${critMultiplier}x damage + draw ${extraCardDraw} extra cards`;
      } else if (cardCritResolution === 'multiply_value') {
        critText = `${rule}: multiply card values by ${critMultiplier}`;
      } else {
        critText = `${rule}: ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else if (critType === 'coins') {
      const rule = coinCritRule === 'all_heads' ? 'All Heads' :
                   coinCritRule === 'all_tails' ? 'All Tails' :
                   coinCritRule === 'sequence' ? 'Specific Sequence' :
                   coinCritRule === 'majority' ? 'Majority' : 'All Heads';

      if (coinCritResolution === 'flip_add') {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage + flip ${extraCoinFlips} extra coins`;
      } else if (coinCritResolution === 'multiply_value') {
        critText = `${rule} (${coinCount} coins): multiply heads by ${critMultiplier}`;
      } else {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else {
      // Dice-based critical
      critText = `Max roll: ${critMultiplier}x damage`;
      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    }

    // Add exploding dice information if enabled
    if (explodingDice) {
      const explodingText = explodingDiceType === 'reroll_add' ? 'exploding dice' :
                           explodingDiceType === 'double_value' ? 'double max values' :
                           explodingDiceType === 'add_max' ? 'add max on max' : 'exploding';
      critText += ` (${explodingText})`;
    }

    // Add special effects if any are selected
    if (critEffects && critEffects.length > 0) {
      const effectNames = critEffects.map(effect => {
        // Special handling for life_drain - show percentage if configured
        if (effect === 'life_drain' && critConfig.lifeDrainConfig) {
          const lifeDrainConfig = critConfig.lifeDrainConfig;
          if (lifeDrainConfig.percentage) {
            return `Life Drain (restores ${lifeDrainConfig.percentage}% of critical damage)`;
          } else if (lifeDrainConfig.formula) {
            return `Life Drain (restores ${lifeDrainConfig.formula} of critical damage)`;
          }
        }
        
        // Special handling for knockback - show distance if configured
        if (effect === 'knockback' || effect === 'push') {
          const knockbackConfig = critConfig.knockbackConfig || {};
          const distance = knockbackConfig.distance || knockbackConfig.pushDistance || 10;
          return `Knockback (target is pushed back ${distance} feet)`;
        }
        
        // Special handling for stun - show duration and save info if configured
        if (effect === 'stun' || effect === 'stunned') {
          const stunConfig = critConfig.stunConfig || {};
          const duration = stunConfig.duration || stunConfig.durationValue || 1;
          const durationUnit = stunConfig.durationUnit || stunConfig.durationType || 'round';
          const saveDC = stunConfig.saveDC || stunConfig.difficultyClass;
          const saveType = stunConfig.saveType || stunConfig.savingThrowType || 'constitution';
          
          let stunDetails = 'Stun (target cannot take actions or reactions';
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            stunDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            stunDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          stunDetails += ')';
          return stunDetails;
        }
        
        // Special handling for bleeding - show damage and duration if configured
        if (effect === 'bleeding' || effect === 'bleed') {
          const bleedingConfig = critConfig.bleedingConfig || {};
          const damagePerRound = bleedingConfig.damagePerRound || bleedingConfig.damage || '1d4';
          const duration = bleedingConfig.duration || bleedingConfig.durationValue || 2;
          const durationUnit = bleedingConfig.durationUnit || bleedingConfig.durationType || 'rounds';
          const saveDC = bleedingConfig.saveDC || bleedingConfig.difficultyClass;
          const saveType = bleedingConfig.saveType || bleedingConfig.savingThrowType || 'constitution';
          
          let bleedingDetails = `Bleeding (${damagePerRound} damage per round`;
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            bleedingDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            bleedingDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          bleedingDetails += ')';
          return bleedingDetails;
        }
        
        // Special handling for burning - show damage and duration if configured
        if (effect === 'burning' || effect === 'burn') {
          const burningConfig = critConfig.burningConfig || {};
          const damagePerRound = burningConfig.damagePerRound || burningConfig.damage || '1d6';
          const duration = burningConfig.duration || burningConfig.durationValue || 2;
          const durationUnit = burningConfig.durationUnit || burningConfig.durationType || 'rounds';
          const saveDC = burningConfig.saveDC || burningConfig.difficultyClass;
          const saveType = burningConfig.saveType || burningConfig.savingThrowType || 'constitution';
          
          let burningDetails = `Burning (${damagePerRound} fire damage per round`;
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            burningDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            burningDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          burningDetails += ')';
          return burningDetails;
        }
        
        // Special handling for disarm - show save info if configured
        if (effect === 'disarm' || effect === 'disarmed') {
          const disarmConfig = critConfig.disarmConfig || {};
          const saveDC = disarmConfig.saveDC || disarmConfig.difficultyClass;
          const saveType = disarmConfig.saveType || disarmConfig.savingThrowType || 'strength';
          
          if (saveDC) {
            return `Disarm (target drops their weapon, DC ${saveDC} ${saveType} save negates)`;
          }
          return 'Disarm (target drops their weapon)';
        }
        
        // Format effect names nicely - convert underscores to spaces and capitalize each word
        return effect.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }).join(', ');
      critText += ` + ${effectNames}`;
    }

    return critText;
  };

  // ===== STANDARDIZED SAVING THROW FORMATTING =====
  const formatSavingThrow = (config = null, effectType = 'damage') => {
    // Handle different config sources
    let saveConfig = config;
    if (!saveConfig) {
      saveConfig = spell.damageConfig?.savingThrowConfig ||
                   spell.debuffConfig ||
                   spell.controlConfig ||
                   spell.savingThrowConfig;
    }

    if (!saveConfig?.enabled && !saveConfig?.savingThrow && !saveConfig?.difficultyClass) return null;

    const isSavingThrowObject = saveConfig.savingThrow && typeof saveConfig.savingThrow === 'object';

    // Determine save type with fallbacks
    const saveType = saveConfig.savingThrowType ||
                     (isSavingThrowObject ? saveConfig.savingThrow.ability : saveConfig.savingThrow) ||
                     'constitution';

    const formattedSaveType = normalizeSaveType(saveType);
    
    const dc = (isSavingThrowObject ? saveConfig.savingThrow.difficultyClass : null) || 
               saveConfig.difficultyClass || 
               15;

    const saveOutcome = (isSavingThrowObject ? saveConfig.savingThrow.saveOutcome : null) ||
                        saveConfig.saveOutcome ||
                        null;

    // Determine save outcome based on effect type and config
    let outcomeText = '';
    if (saveConfig.partialEffect) {
      const formula = saveConfig.partialEffectFormula || 'damage/2';
      outcomeText = ` (${formula} on save)`;
    } else if (saveOutcome) {
      const outcomeMap = {
        'negates': 'negate',
        'halves_effects': 'halves',
        'halves': 'halves',
        'ends_early': 'ends next turn on save',
        'resists_commands': 'can resist commands on save',
        'broken': 'broken on save',
        'overcome': 'overcome on save',
        'half_damage': 'half damage',
        'no_effect': 'no effect',
        'damage_on_fail': 'damage on fail'
      };
      outcomeText = ` (${outcomeMap[saveOutcome] || 'negate'})`;
    } else {
      // Default outcomes based on effect type
      const defaultOutcomes = {
        'damage': 'negated on save',
        'debuff': 'negated on save',
        'control': 'negated on save',
        'status': 'overcome on save'
      };
      outcomeText = ` (${defaultOutcomes[effectType] || 'negated on save'})`;
    }

    return {
      formatted: `DC ${dc} ${formattedSaveType}${outcomeText}`,
      saveType: formattedSaveType,
      dc: dc,
      outcome: outcomeText.replace(/[()]/g, '').trim(),
      saveOutcome: saveOutcome
    };
  };
  const formatDamage = () => {
    if (!spell || !spell.damageConfig) return null;

    let damageText = '';
    let dotText = '';

    // Get damage types for appending to formulas
    // Priority: use damageTypes array (from Step 1), then fallback to single damageType
    let damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    
    // If no array, try to get from typeConfig (Step 1)
    if (!damageTypesArray || damageTypesArray.length === 0) {
      damageTypesArray = [];
      if (spell.typeConfig?.school && spell.typeConfig.school.toLowerCase() !== 'physical') {
        damageTypesArray.push(spell.typeConfig.school);
      }
      if (spell.typeConfig?.secondaryElement) {
        damageTypesArray.push(spell.typeConfig.secondaryElement);
      }
    }
    
    // If still no array, try single damageType (for DoT spells, use elementType; for instant damage, use damageType)
    const singleDamageType = spell.damageConfig?.damageType ||
                      spell.effects?.damage?.instant?.type ||
                      null;

    // For DoT spells (damageType === 'dot'), use elementType for the suffix
    // For instant damage spells, use damageType (but filter out 'direct' as it's not a specific damage type)
    const effectiveSingleType = singleDamageType === 'dot'
      ? (spell.damageConfig?.elementType || spell.effects?.damage?.dot?.type)
      : (singleDamageType && singleDamageType !== 'direct' ? singleDamageType : null);

    // If we have an array, use it; otherwise use single type
    const effectiveDamageTypes = (damageTypesArray && damageTypesArray.length > 0) 
      ? damageTypesArray 
      : (effectiveSingleType ? [effectiveSingleType] : []);

    // Format damage type suffix - handle multiple types
    let damageTypeSuffix = '';
    if (effectiveDamageTypes.length > 0) {
      const formattedTypes = effectiveDamageTypes
        .filter(type => type && type !== 'dot' && type !== 'physical') // Filter out 'dot' and 'physical' as they're not specific damage types
        .map(type => {
          // Capitalize first letter and handle special cases
          const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
          // Handle lightning -> Lightning (not "Storm" in damage context)
          return capitalized;
        });
      
      if (formattedTypes.length > 0) {
        if (formattedTypes.length === 1) {
          damageTypeSuffix = ` ${formattedTypes[0]} Damage`;
        } else {
          // Join with "and" for multiple types: "Cold and Lightning Damage"
          damageTypeSuffix = ` ${formattedTypes.join(' and ')} Damage`;
        }
      }
    }

    // Check if this is a pure DoT spell (no instant damage)
    // A spell is pure DoT if: damageType is 'dot' AND there's no instant damage formula
    const isPureDoT = spell.damageConfig?.damageType === 'dot' && !spell.damageConfig?.formula;

    // Only show instant damage if it's NOT a pure DoT spell
    if (!isPureDoT) {
      // Handle card/coin resolution display - always show for CARDS/COINS resolution
      if (spell.resolution === 'CARDS') {
          const cardConfig = spell.cardConfig || spell.damageConfig?.cardConfig;
          // Always show the draw count, even if it's the default (consistent with ExternalLivePreview)
          const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
          const formula = cardConfig?.formula || spell.damageConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Draw ${drawCount} cards: ${cleanedFormula}${damageTypeSuffix}`;
      } else if (spell.resolution === 'COINS') {
          const coinConfig = spell.coinConfig || spell.damageConfig?.coinConfig;
          // Always show the flip count, even if it's the default (consistent with ExternalLivePreview)
          const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
          const formula = coinConfig?.formula || spell.damageConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Flip ${flipCount} coins: ${cleanedFormula}${damageTypeSuffix}`;
      } else if (spell.resolution === 'DICE' && (spell.diceConfig?.formula || spell.damageConfig?.formula)) {
          const formula = spell.diceConfig?.formula || spell.damageConfig?.formula || '1d6 + intelligence';

          // Handle weapon-dependent spells that have addAttributeModifier flag
          let finalFormula = formula;
          if (spell.damageConfig?.weaponDependent && spell.damageConfig?.addAttributeModifier && spell.damageConfig?.attributeModifier) {
            // For weapon attacks, combine dice notation with attribute modifier
            const attributeName = spell.damageConfig.attributeModifier.charAt(0).toUpperCase() + spell.damageConfig.attributeModifier.slice(1);
            // Only add attribute if it's not already in the formula
            if (!formula.toLowerCase().includes(attributeName.toLowerCase()) && !formula.toLowerCase().includes(spell.damageConfig.attributeModifier.toLowerCase())) {
              finalFormula = `${formula} + ${attributeName}`;
            }
          }

          // Enhanced formula formatting - don't pass elementType if we have a specific damage type suffix
          const enhancedFormula = damageTypeSuffix ?
            cleanFormula(finalFormula) :
            enhanceFormulaDisplay(finalFormula, spell.damageConfig?.elementType);
          damageText = `${enhancedFormula}${damageTypeSuffix}`;
      } else if (spell.damageConfig?.formula) {
          // Handle weapon-dependent spells that have addAttributeModifier flag
          let finalFormula = spell.damageConfig.formula;
          if (spell.damageConfig?.weaponDependent && spell.damageConfig?.addAttributeModifier && spell.damageConfig?.attributeModifier) {
            // For weapon attacks, combine dice notation with attribute modifier
            const attributeName = spell.damageConfig.attributeModifier.charAt(0).toUpperCase() + spell.damageConfig.attributeModifier.slice(1);
            // Only add attribute if it's not already in the formula
            if (!finalFormula.toLowerCase().includes(attributeName.toLowerCase()) && !finalFormula.toLowerCase().includes(spell.damageConfig.attributeModifier.toLowerCase())) {
              finalFormula = `${finalFormula} + ${attributeName}`;
            }
          }
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = `${cleanFormula(finalFormula)}${damageTypeSuffix}`;
      } else if (spell.resolution === 'PROPHECY') {
          // Extract prophecy data
          const prophecyData = spell.prophecyConfig || 
                               (Array.isArray(spell.mechanicsConfig) ? 
                                spell.mechanicsConfig.find(m => m.system === 'PROPHECY')?.prophecy : 
                                spell.mechanicsConfig?.prophecy);
          
          if (prophecyData) {
            const rangeDice = prophecyData.rangeDice || ['d8', 'd6'];
            const resDie = prophecyData.resolutionDie || 'd6';
            const rangeText = Array.isArray(rangeDice) ? rangeDice.join('+') : rangeDice;
            damageText = `Prophecy (${rangeText} vs ${resDie})${damageTypeSuffix}`;
          } else {
            damageText = `Prophecy Resolution${damageTypeSuffix}`;
          }
      } else if (spell.primaryDamage?.dice) {
          const dice = spell.primaryDamage.dice;
          const flat = spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = `${cleanFormula(`${dice}${flat}`)}${damageTypeSuffix}`;
      }
    }

    // Handle DoT (Damage over Time)
    if (spell.damageConfig?.hasDotEffect || spell.damageConfig?.damageType === 'dot') {
      const duration = spell.damageConfig?.dotConfig?.duration || 3;
      const tickFrequency = spell.damageConfig?.dotConfig?.tickFrequency || 'round';

      // Format duration text
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

      // Check if this is progressive DoT
      const isProgressiveDot = spell.damageConfig?.dotConfig?.isProgressiveDot &&
                               spell.damageConfig?.dotConfig?.progressiveStages?.length > 0;

      if (isProgressiveDot) {
        // Format progressive DoT stages showing all formulas with arrows
        const stages = spell.damageConfig.dotConfig.progressiveStages;

        // Check if using card/coin resolution for progressive DoT
        const cardConfig = spell.cardConfig;
        const coinConfig = spell.coinConfig;

        if (stages.length === 1) {
          // Single stage - just show the formula with special effect if present
          const stage = stages[0];
          const cleanedFormula = cleanFormula(stage.formula);
          const effectText = stage.spellEffect ? ` (${stage.spellEffect})` : '';

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else {
            dotText = `${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          }
        } else {
          // Multiple stages - show all formulas with arrows and special effects
          const formulas = stages.map(stage => {
            const cleanedFormula = cleanFormula(stage.formula);

            // Add special effect if present
            if (stage.spellEffect) {
              return `${cleanedFormula} (${stage.spellEffect})`;
            }
            return cleanedFormula;
          });

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${formulas.join(' → ')} over ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${formulas.join(' → ')} over ${durationText}`;
          } else {
            dotText = `${formulas.join(' → ')} over ${durationText}`;
          }
        }
      } else if (spell.resolution === 'CARDS') {
        // Use dotConfig cardConfig if available, otherwise fall back to main cardConfig
        const cardConfig = spell.damageConfig?.dotConfig?.cardConfig || spell.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Draw ${drawCount} cards: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else if (spell.resolution === 'COINS') {
        // Use dotConfig coinConfig if available, otherwise fall back to main coinConfig
        const coinConfig = spell.damageConfig?.dotConfig?.coinConfig || spell.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Flip ${flipCount} coins: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else {
        // Standard dice-based DoT
        const dotFormula = spell.damageConfig?.dotConfig?.dotFormula || spell.damageConfig?.formula || '1d4 + intelligence/2';
        const cleanedDotFormula = cleanFormula(dotFormula);
        dotText = `${cleanedDotFormula}${damageTypeSuffix} per ${tickFrequency} for ${durationText}`;
      }
    }





    // Combine damage and DoT text intelligently
    let finalText = null;

    // Legacy damage + DoT combination logic for backwards compatibility
    if (damageText && dotText) {
      // Check if both use the same resolution method to avoid redundancy
      const bothUseCards = spell.resolution === 'CARDS' && damageText.includes('Draw') && dotText.includes('Draw');
      const bothUseCoins = spell.resolution === 'COINS' && damageText.includes('Flip') && dotText.includes('Flip');
      const bothUseDice = spell.resolution === 'DICE' || (!bothUseCards && !bothUseCoins);

      if (bothUseCards) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Draw (\d+) cards: (.+)/);
        const dotMatch = dotText.match(/Draw (\d+) cards: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCardCount, instantFormula] = instantMatch;
          const [, dotCardCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCardCount === dotCardCount) {
            finalText = `Draw ${instantCardCount} cards: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Draw ${instantCardCount} cards: ${instantFormula}`,
              dot: `Draw ${dotCardCount} cards: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else if (bothUseCoins) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Flip (\d+) coins: (.+)/);
        const dotMatch = dotText.match(/Flip (\d+) coins: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCoinCount, instantFormula] = instantMatch;
          const [, dotCoinCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCoinCount === dotCoinCount) {
            finalText = `Flip ${instantCoinCount} coins: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Flip ${instantCoinCount} coins: ${instantFormula}`,
              dot: `Flip ${dotCoinCount} coins: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else {
        // Different resolution methods or dice-based, show both on separate lines
        finalText = {
          instant: damageText,
          dot: dotText
        };
      }
    } else if (damageText) {
      finalText = damageText;
    } else if (dotText) {
      finalText = dotText;
    }

    // Return the formatted text - handle both string and object formats
    if (typeof finalText === 'object' && finalText !== null) {
      if (finalText.combined) {
        return finalText.combined;
      } else if (finalText.instant && finalText.dot) {
        return { instant: finalText.instant, dot: finalText.dot };
      }
    }

    // Debug logging for final result (commented out to avoid browser issues)
    // if (variant === 'wizard') {
    //   console.log('UnifiedSpellCard Final Damage Text:', {
    //     damageText,
    //     dotText,
    //     finalText,
    //     resolution: spell.resolution,
    //     cardConfig: spell.cardConfig,
    //     coinConfig: spell.coinConfig
    //   });
    // }

    // Return the final text (string case)
    return finalText;



    return finalText;
  };

  const formatHealing = () => {
    if (!spell) return null;

    // Use the main cleanFormula function defined above



    // Check for healingConfig-based healing first (new system)
    if (spell.healingConfig) {
      const healingType = spell.healingConfig.healingType;

      // Handle different healing types ('instant' is an alias for 'direct')
      if (healingType === 'direct' || healingType === 'instant') {
        // Direct healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.cardConfig?.formula) {
          const cardConfig = spell.healingConfig.cardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} Healing`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.coinConfig?.formula) {
          const coinConfig = spell.healingConfig.coinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} Healing`;
        } else if (spell.healingConfig.formula) {
          // Dice-based direct healing
          return `${cleanFormula(spell.healingConfig.formula)} Healing`;
        }
      } else if (healingType === 'hot') {
        // HoT healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.hotCardConfig?.formula) {
          const cardConfig = spell.healingConfig.hotCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Draw ${drawCount} cards: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.resolution === 'COINS' && spell.healingConfig.hotCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.hotCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Flip ${flipCount} coins: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.healingConfig.hotFormula) {
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`;
          }
        }
      } else if (healingType === 'shield') {
        // Shield healing - check resolution method
        const shieldDuration = spell.healingConfig.shieldDuration || 3;
        const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';
        const overflow = spell.healingConfig.shieldOverflow || 'dissipate';
        const breakBehavior = spell.healingConfig.shieldBreakBehavior || 'fade';

        let baseDescription = '';

        // Handle different resolution types for shield
        if (spell.resolution === 'CARDS' && spell.healingConfig.shieldCardConfig?.formula) {
          const cardConfig = spell.healingConfig.shieldCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          baseDescription = `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} absorption`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.shieldCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.shieldCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          baseDescription = `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} absorption`;
        } else if (spell.healingConfig.shieldFormula) {
          baseDescription = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption`;
        }

        if (baseDescription) {
          // Add duration
          baseDescription += ` for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

          // Add overflow behavior to description if it converts to healing
          if (overflow === 'convert_to_healing') {
            baseDescription += ' and converts to healing';
          }

          // Build bullet points for shield properties
          const shieldBullets = [];

          // Add damage type if not all types
          if (damageTypes !== 'all') {
            const typeText = damageTypes === 'physical' ? 'Physical' :
                            damageTypes === 'magical' ? 'Magical' :
                            damageTypes === 'ember' ? 'Fire' :
                            damageTypes === 'rime' ? 'Frost' :
                            damageTypes === 'storm' ? 'Lightning' :
                            damageTypes === 'arcane' ? 'Arcane' :
                            damageTypes === 'nature' ? 'Nature' :
                            damageTypes === 'blight' ? 'Necrotic' :
                            damageTypes === 'primal' ? 'Nature' :
                            damageTypes === 'wyrd' ? 'Psychic' :
                            damageTypes === 'divine' ? 'Radiant' :
                            damageTypes.charAt(0).toUpperCase() + damageTypes.slice(1);
            shieldBullets.push(`${typeText} only`);
          }

          // Add break behavior if not default
          if (breakBehavior === 'shatter') {
            shieldBullets.push('Shatters');
          } else if (breakBehavior === 'fade') {
            shieldBullets.push('Fades');
          }

          // Return the description and bullets as an object so we can handle them separately
          return {
            description: baseDescription,
            bullets: shieldBullets
          };
        }
      }
    }

    // Fallback to legacy healing system
    if (spell.healing) {
      // Check if healing uses card or coin resolution (legacy)
      if (spell.resolution === 'CARDS' && (spell.healingCardConfig?.formula || spell.healingConfig?.cardConfig?.formula)) {
        const cardConfig = spell.healingCardConfig || spell.healingConfig?.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
        const cleanedFormula = cleanFormula(formula);
        return `Draw ${drawCount} cards: ${cleanedFormula}`;
      } else if (spell.resolution === 'COINS' && (spell.healingCoinConfig?.formula || spell.healingConfig?.coinConfig?.formula)) {
        const coinConfig = spell.healingCoinConfig || spell.healingConfig?.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
        const cleanedFormula = cleanFormula(formula);
        return `Flip ${flipCount} coins: ${cleanedFormula}`;
      } else {
        // Standard dice-based healing (legacy)
        const dice = spell.healing.dice || '';
        const flat = spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : '';
        const healingFormula = `${dice}${flat}`;
        return cleanFormula(healingFormula);
      }
    }

    return null;
  };

  const formatCombinedHealing = () => {
    if (!spell?.healingConfig) return null;

    // Use the main cleanFormula function defined above

    const effects = [];

    // Check for additional HoT effect
    if (spell.healingConfig.hasHotEffect && spell.healingConfig.hotFormula) {
      const duration = spell.healingConfig.hotDuration || 3;
      const tickFrequency = spell.healingConfig.hotTickType || 'round';
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
      effects.push(`${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`);
    }

    // Check for additional shield effect
    if (spell.healingConfig.hasShieldEffect && spell.healingConfig.shieldFormula) {
      const shieldDuration = spell.healingConfig.shieldDuration || 3;
      const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';

      let shieldText = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

      // Add damage type absorption if not all types
      if (damageTypes !== 'all') {
        const typeText = damageTypes === 'physical' ? 'physical damage' :
                        damageTypes === 'magical' ? 'magical damage' :
                        damageTypes === 'ember' ? 'fire damage' :
                        damageTypes === 'rime' ? 'frost damage' :
                        damageTypes === 'storm' ? 'lightning damage' :
                        damageTypes === 'arcane' ? 'arcane damage' :
                        damageTypes === 'nature' ? 'nature damage' :
                        damageTypes === 'blight' ? 'poison damage' :
                        damageTypes === 'blight' ? 'necrotic damage' :
                        damageTypes === 'ember' ? 'radiant damage' :
                        damageTypes === 'arcane' ? 'force damage' :
                        damageTypes;
        shieldText += ` (${typeText} only)`;
      }

      effects.push(shieldText);
    }

    return effects.length > 0 ? effects.join('. ') : null;
  };



  const getDamageTypes = () => {
    if (!spell) return [];

    // Do not show damage types for Temporal Flux abilities (support/utility)
    if (spell.specialMechanics?.temporalFlux || spell.specialMechanics?.temporal_flux || spell.id?.endsWith('_flux')) {
      return [];
    }

    // Only show damage types if spell actually has damage configured
    // Also show if the user selected damage types in Step 1 (typeConfig)
    const hasDamageConfig = spell.damageConfig?.formula || spell.damageConfig?.damageType || spell.damageTypes?.length > 0;
    const hasDamageEffect = spell.effects?.damage?.instant?.formula || spell.effects?.damage?.dot?.formula;
    const hasDamageType = spell.effectTypes?.includes('damage');
    const hasTypeConfig = spell.typeConfig?.school || spell.typeConfig?.secondaryElement;
    
    // If spell has no damage configuration at all, don't infer damage types
    if (!hasDamageConfig && !hasDamageEffect && !hasDamageType && !hasTypeConfig) {
      return [];
    }

    // Use a Set to automatically handle duplicates
    const damageTypesSet = new Set();

    // Priority: typeConfig (Step 1 wizard) controls ORDER when present
    // typeConfig determines which type is primary (displayed first) and which is secondary
    if (spell.typeConfig?.school) {
      damageTypesSet.add(spell.typeConfig.school.toLowerCase().trim());
    }
    if (spell.typeConfig?.secondaryElement) {
      damageTypesSet.add(spell.typeConfig.secondaryElement.toLowerCase().trim());
    }

    // Add any types from damageTypes array that aren't already in the set
    // These fill in types from other sources without overriding typeConfig order
    const damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    if (damageTypesArray && Array.isArray(damageTypesArray) && damageTypesArray.length > 0) {
      damageTypesArray.forEach(type => {
        if (type && type.trim()) {
          damageTypesSet.add(type.toLowerCase().trim());
        }
      });
    }

    // Also check for singular damageType if no array found
    // Check damageConfig.damageType (e.g., 'physical', 'physical', 'physical')
    // Filter out 'direct' and 'dot' as they're not actual damage types
    if (damageTypesSet.size === 0 && spell.damageConfig?.damageType) {
      const damageType = spell.damageConfig.damageType;
      if (damageType && damageType.trim() && damageType.toLowerCase() !== 'direct' && damageType.toLowerCase() !== 'dot') {
        damageTypesSet.add(damageType.toLowerCase().trim());
      }
    }
    
    // Also check effects.damage.instant.type as fallback
    if (damageTypesSet.size === 0 && spell.effects?.damage?.instant?.type) {
      const damageType = spell.effects.damage.instant.type;
      if (damageType && damageType.trim()) {
        damageTypesSet.add(damageType.toLowerCase().trim());
      }
    }

    // Only add elementType if we don't have explicit damage types from typeConfig or damageTypes array
    if (damageTypesSet.size === 0) {
      if (spell.elementType && spell.elementType.trim()) {
        const elementType = spell.elementType.toLowerCase().trim();
        if (elementType !== 'physical') {
          damageTypesSet.add(elementType);
        }
      }

      if (spell.damageConfig?.elementType && spell.damageConfig.elementType.trim()) {
        const elementType = spell.damageConfig.elementType.toLowerCase().trim();
        if (elementType !== 'physical') {
          damageTypesSet.add(elementType);
        }
      }
    }

    // Only infer damage type from spell effects if we have damage configuration
    // Don't infer for pure healing/buff/utility spells
    if (damageTypesSet.size === 0 && hasDamageConfig) {
      // Check damage config for type hints
      if (spell.damageConfig?.formula) {
        const formula = spell.damageConfig.formula.toLowerCase();
        if (formula.includes('ember') || formula.includes('ember') || formula.includes('ember')) damageTypesSet.add('ember');
        else if (formula.includes('rime') || formula.includes('rime') || formula.includes('ice')) damageTypesSet.add('rime');
        else if (formula.includes('storm') || formula.includes('electric')) damageTypesSet.add('storm');
        else if (formula.includes('arcane')) damageTypesSet.add('arcane');
        else if (formula.includes('nature')) damageTypesSet.add('primal');
        else if (formula.includes('blight') || formula.includes('blight') || formula.includes('blight') || formula.includes('blight')) damageTypesSet.add('blight');
        else if (formula.includes('wyrd') || formula.includes('chaos')) damageTypesSet.add('wyrd');
      }

      // Only check spell name and description for type hints if we have damage config
      const spellText = `${spell.name || ''} ${spell.description || ''}`.toLowerCase();
      if (spellText.includes('divine') || spellText.includes('sacred') || spellText.includes('holy light')) damageTypesSet.add('divine');
      else if (spellText.includes('ember') || spellText.includes('flame') || spellText.includes('burn') || spellText.includes('ember') || spellText.includes('ember') || spellText.includes('light')) damageTypesSet.add('ember');
      else if (spellText.includes('rime') || spellText.includes('rime') || spellText.includes('ice')) damageTypesSet.add('rime');
      else if (spellText.includes('storm') || spellText.includes('electric')) damageTypesSet.add('storm');
      else if (spellText.includes('arcane')) damageTypesSet.add('arcane');
      else if (spellText.includes('nature') || spellText.includes('primal')) damageTypesSet.add('primal');
      else if (spellText.includes('blight') || spellText.includes('death') || spellText.includes('decay') || spellText.includes('blight') || spellText.includes('blight') || spellText.includes('venom') || spellText.includes('toxic') || spellText.includes('blight') || spellText.includes('blight')) damageTypesSet.add('blight');
      else if (spellText.includes('wyrd') || spellText.includes('mind') || spellText.includes('mental') || spellText.includes('chaos') || spellText.includes('chaotic') || spellText.includes('unpredictable') || spellText.includes('wyrd')) damageTypesSet.add('wyrd');

      // Check buff/debuff effects for damage type hints (only if we have damage)
      if (spell.buffConfig?.statusEffects) {
        spell.buffConfig?.statusEffects.forEach(effect => {
          const effectText = `${effect.name || ''} ${effect.description || ''}`.toLowerCase();
          if (effectText.includes('ember') || effectText.includes('ember') || effectText.includes('ember')) damageTypesSet.add('ember');
          else if (effectText.includes('blight') || effectText.includes('blight') || effectText.includes('blight')) damageTypesSet.add('blight');
        });
      }
    }

    // Valid damage types (normalize old types to new 8-type schema)
    const validDamageTypes = ['physical', 'ember', 'rime', 'storm', 'arcane', 'primal', 'blight', 'wyrd', 'divine',
                             'ember', 'rime', 'storm', 'arcane', 'storm', 'ember', 'nature',
                             'blight', 'blight', 'blight', 'blight', 'wyrd', 'chaos',
                             'physical', 'physical', 'physical',
                             'electric', 'ember', 'magical', 'rime', 'ice', 'blight', 'viscera'];

    // Normalize similar types to new 8-type schema
    const normalizedTypes = Array.from(damageTypesSet).map(type => {
      const legacyMap = {
        'ember': 'ember', 'ember': 'ember', 'ember': 'ember',
        'rime': 'rime', 'rime': 'rime', 'ice': 'rime',
        'storm': 'storm', 'arcane': 'arcane', 'electric': 'storm',
        'nature': 'primal', 'viscera': 'primal',
        'blight': 'blight', 'blight': 'blight', 'blight': 'blight', 'blight': 'blight', 'blight': 'blight',
        'wyrd': 'wyrd', 'chaos': 'wyrd',
        'physical': 'physical', 'physical': 'physical', 'physical': 'physical',
      };
      return legacyMap[type] || type;
    });

    // Filter valid types and remove duplicates again after normalization
    const finalTypes = [...new Set(normalizedTypes)]
      .filter(type => validDamageTypes.includes(type))
      .slice(0, 2); // Limit to 2 damage types for cleaner display

    return finalTypes;
  };

  const getSpellTags = () => {
    if (!spell) return [];

    const tags = [];

    // Add spell tags (only explicit tags, not auto-generated ones)
    if (spell.tags && Array.isArray(spell.tags)) {
      tags.push(...spell.tags);
    }

    // Add effect types as tags, but filter out unwanted ones
    if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
      const filteredEffectTypes = spell.effectTypes.filter(effectType => {
        // Filter out effect types that shouldn't be shown as tags
        const unwantedEffects = ['debuff']; // Add more here if needed
        return !unwantedEffects.includes(effectType.toLowerCase());
      });
      tags.push(...filteredEffectTypes);
    }

    return [...new Set(tags)].slice(0, 6); // Limit tags for space
  };

  // ===== BUFF/DEBUFF FORMATTING FUNCTIONS =====

  // Format status effect details based on configuration

  return {
    getDamageTypeSuffix,
    formatCriticalHit,
    formatSavingThrow,
    formatDamage,
    formatHealing,
    formatCombinedHealing,
    getDamageTypes,
    getSpellTags,
  };
};

export default useDamageHealingFormatters;