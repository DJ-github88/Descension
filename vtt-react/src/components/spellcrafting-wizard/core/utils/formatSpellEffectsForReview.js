/**
 * Utility functions to format spell effects for display in the LibraryStyleSpellCard component
 * These functions are extracted from the Step10Review component to ensure consistent formatting
 */

import { formatFormulaToPlainEnglish } from '../../components/common/SpellCardUtils';

// Helper function to extract damage type from resistance stat name
const extractDamageTypeFromResistanceName = (resistanceName) => {
  if (!resistanceName) return 'damage';

  const name = resistanceName.toLowerCase();
  if (name.includes('fire')) return 'fire';
  if (name.includes('cold') || name.includes('frost')) return 'cold';
  if (name.includes('lightning') || name.includes('electric')) return 'lightning';
  if (name.includes('acid')) return 'acid';
  if (name.includes('poison')) return 'poison';
  if (name.includes('necrotic')) return 'necrotic';
  if (name.includes('radiant')) return 'radiant';
  if (name.includes('psychic')) return 'psychic';
  if (name.includes('thunder')) return 'thunder';
  if (name.includes('force')) return 'force';
  if (name.includes('physical')) return 'physical';
  if (name.includes('slashing')) return 'slashing';
  if (name.includes('piercing')) return 'piercing';
  if (name.includes('bludgeoning')) return 'bludgeoning';
  return 'damage';
};

// Helper function to get thematic resistance descriptions
const getThematicResistanceDescription = (resistanceLevel, damageType) => {
  const thematicDescriptions = {
    highly_resistant: {
      fire: 'Flame Barrier (takes 25% fire damage)',
      cold: 'Frost Barrier (takes 25% cold damage)',
      lightning: 'Storm Barrier (takes 25% lightning damage)',
      acid: 'Acid Barrier (takes 25% acid damage)',
      poison: 'Toxin Barrier (takes 25% poison damage)',
      necrotic: 'Death Barrier (takes 25% necrotic damage)',
      radiant: 'Light Barrier (takes 25% radiant damage)',
      psychic: 'Mind Barrier (takes 25% psychic damage)',
      thunder: 'Sound Barrier (takes 25% thunder damage)',
      force: 'Force Barrier (takes 25% force damage)',
      physical: 'Adamant Skin (takes 25% physical damage)',
      slashing: 'Cut Barrier (takes 25% slashing damage)',
      piercing: 'Pierce Barrier (takes 25% piercing damage)',
      bludgeoning: 'Crush Barrier (takes 25% bludgeoning damage)',
      'all damage': 'Full Barrier (takes 25% damage)',
      damage: 'Highly Resistant (takes 25% damage)'
    },
    resistant: {
      fire: 'Flame Ward (takes half fire damage)',
      cold: 'Frost Ward (takes half cold damage)',
      lightning: 'Storm Ward (takes half lightning damage)',
      acid: 'Acid Ward (takes half acid damage)',
      poison: 'Toxin Ward (takes half poison damage)',
      necrotic: 'Death Ward (takes half necrotic damage)',
      radiant: 'Light Ward (takes half radiant damage)',
      psychic: 'Mind Ward (takes half psychic damage)',
      thunder: 'Sound Ward (takes half thunder damage)',
      force: 'Force Ward (takes half force damage)',
      physical: 'Iron Skin (takes half physical damage)',
      slashing: 'Cut Ward (takes half slashing damage)',
      piercing: 'Pierce Ward (takes half piercing damage)',
      bludgeoning: 'Crush Ward (takes half bludgeoning damage)',
      'all damage': 'Full Ward (takes half damage)',
      damage: 'Resistant (takes half damage)'
    },
    guarded: {
      fire: 'Flame Guard (takes 75% fire damage)',
      cold: 'Frost Guard (takes 75% cold damage)',
      lightning: 'Storm Guard (takes 75% lightning damage)',
      acid: 'Acid Guard (takes 75% acid damage)',
      poison: 'Toxin Guard (takes 75% poison damage)',
      necrotic: 'Death Guard (takes 75% necrotic damage)',
      radiant: 'Light Guard (takes 75% radiant damage)',
      psychic: 'Mind Guard (takes 75% psychic damage)',
      thunder: 'Sound Guard (takes 75% thunder damage)',
      force: 'Force Guard (takes 75% force damage)',
      physical: 'Hardened Skin (takes 75% physical damage)',
      slashing: 'Cut Guard (takes 75% slashing damage)',
      piercing: 'Pierce Guard (takes 75% piercing damage)',
      bludgeoning: 'Crush Guard (takes 75% bludgeoning damage)',
      'all damage': 'Full Guard (takes 75% damage)',
      damage: 'Guarded (takes 75% damage)'
    },
    immune: {
      fire: 'Flame Immunity (takes no fire damage)',
      cold: 'Frost Immunity (takes no cold damage)',
      lightning: 'Storm Immunity (takes no lightning damage)',
      acid: 'Acid Immunity (takes no acid damage)',
      poison: 'Toxin Immunity (takes no poison damage)',
      necrotic: 'Death Immunity (takes no necrotic damage)',
      radiant: 'Light Immunity (takes no radiant damage)',
      psychic: 'Mind Immunity (takes no psychic damage)',
      thunder: 'Sound Immunity (takes no thunder damage)',
      force: 'Force Immunity (takes no force damage)',
      physical: 'Physical Immunity (takes no physical damage)',
      slashing: 'Cut Immunity (takes no slashing damage)',
      piercing: 'Pierce Immunity (takes no piercing damage)',
      bludgeoning: 'Crush Immunity (takes no bludgeoning damage)',
      'all damage': 'Full Immunity (takes no damage)',
      damage: 'Immune (takes no damage)'
    },
    susceptible: {
      fire: 'Flame Weakness (takes 125% fire damage)',
      cold: 'Frost Weakness (takes 125% cold damage)',
      lightning: 'Storm Weakness (takes 125% lightning damage)',
      acid: 'Acid Weakness (takes 125% acid damage)',
      poison: 'Toxin Weakness (takes 125% poison damage)',
      necrotic: 'Death Weakness (takes 125% necrotic damage)',
      radiant: 'Light Weakness (takes 125% radiant damage)',
      psychic: 'Mind Weakness (takes 125% psychic damage)',
      thunder: 'Sound Weakness (takes 125% thunder damage)',
      force: 'Force Weakness (takes 125% force damage)',
      physical: 'Soft Skin (takes 125% physical damage)',
      slashing: 'Cut Weakness (takes 125% slashing damage)',
      piercing: 'Pierce Weakness (takes 125% piercing damage)',
      bludgeoning: 'Crush Weakness (takes 125% bludgeoning damage)',
      'all damage': 'Full Weakness (takes 125% damage)',
      damage: 'Susceptible (takes 125% damage)'
    },
    exposed: {
      fire: 'Flame Exposure (takes 150% fire damage)',
      cold: 'Frost Exposure (takes 150% cold damage)',
      lightning: 'Storm Exposure (takes 150% lightning damage)',
      acid: 'Acid Exposure (takes 150% acid damage)',
      poison: 'Toxin Exposure (takes 150% poison damage)',
      necrotic: 'Death Exposure (takes 150% necrotic damage)',
      radiant: 'Light Exposure (takes 150% radiant damage)',
      psychic: 'Mind Exposure (takes 150% psychic damage)',
      thunder: 'Sound Exposure (takes 150% thunder damage)',
      force: 'Force Exposure (takes 150% force damage)',
      physical: 'Tender Flesh (takes 150% physical damage)',
      slashing: 'Cut Exposure (takes 150% slashing damage)',
      piercing: 'Pierce Exposure (takes 150% piercing damage)',
      bludgeoning: 'Crush Exposure (takes 150% bludgeoning damage)',
      'all damage': 'Full Exposure (takes 150% damage)',
      damage: 'Exposed (takes 150% damage)'
    },
    vulnerable: {
      fire: 'Flame Curse (takes double fire damage)',
      cold: 'Frost Curse (takes double cold damage)',
      lightning: 'Storm Curse (takes double lightning damage)',
      acid: 'Acid Curse (takes double acid damage)',
      poison: 'Toxin Curse (takes double poison damage)',
      necrotic: 'Death Curse (takes double necrotic damage)',
      radiant: 'Light Curse (takes double radiant damage)',
      psychic: 'Mind Curse (takes double psychic damage)',
      thunder: 'Sound Curse (takes double thunder damage)',
      force: 'Force Curse (takes double force damage)',
      physical: 'Brittle Bones (takes double physical damage)',
      slashing: 'Cut Curse (takes double slashing damage)',
      piercing: 'Pierce Curse (takes double piercing damage)',
      bludgeoning: 'Crush Curse (takes double bludgeoning damage)',
      'all damage': 'Full Curse (takes double damage)',
      damage: 'Vulnerable (takes double damage)'
    }
  };

  return thematicDescriptions[resistanceLevel]?.[damageType] ||
         thematicDescriptions[resistanceLevel]?.damage ||
         resistanceLevel;
};

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

  // Get saving throw information if available
  let savingThrowInfo = '';
  let savingThrowType = '';
  let dc = 15;
  let partialEffect = '';

  try {
    if (spell.damageConfig?.savingThrow) {
      // Handle multiple savingThrow formats: string, boolean, or object
      let saveType;
      let saveSuccess = null;

      if (typeof spell.damageConfig.savingThrow === 'string') {
        // If savingThrow is a string, use it as the save type
        saveType = spell.damageConfig.savingThrow;
      } else if (typeof spell.damageConfig.savingThrow === 'object' && spell.damageConfig.savingThrow.enabled) {
        // If savingThrow is an object with enabled: true
        saveType = spell.damageConfig.savingThrow.attribute || 'agility';
        saveSuccess = spell.damageConfig.savingThrow.onSuccess;
        dc = spell.damageConfig.savingThrow.difficulty || spell.damageConfig.difficultyClass || 15;
      } else {
        // If savingThrow is boolean/object, use savingThrowType
        saveType = spell.damageConfig.savingThrowType || 'agility';
      }

      // Convert dexterity to agility and wisdom to spirit
      if (saveType.toLowerCase() === 'dexterity') saveType = 'agility';
      if (saveType.toLowerCase() === 'wisdom') saveType = 'spirit';

      savingThrowType = saveType.toUpperCase();
      if (!dc) dc = spell.damageConfig.difficultyClass || 15;

      // Create a special format for saving throws that will be displayed with a badge
      // Don't include the "DC X ABILITY" part in the text since it will be shown in the badge
      savingThrowInfo = `<span class="saving-throw-placeholder"></span>`;

      // Add partial effect information if available
      if (spell.damageConfig.partialEffect || saveSuccess) {
        // Use the formula directly
        if (spell.damageConfig.directDamageFormula && spell.damageConfig.dotDamageFormula &&
            (spell.damageConfig.hasDotEffect || spell.damageConfig.damageType === 'dot')) {
          // If we have both direct and DoT damage formulas
          partialEffect = `(${spell.damageConfig.directDamageFormula} on successful save)`;
        } else if (spell.damageConfig.directDamageFormula) {
          // If we only have direct damage formula
          partialEffect = `(${spell.damageConfig.directDamageFormula} on successful save)`;
        } else if (spell.damageConfig.dotDamageFormula &&
                  (spell.damageConfig.hasDotEffect || spell.damageConfig.damageType === 'dot')) {
          // If we only have DoT damage formula
          partialEffect = `(${spell.damageConfig.dotDamageFormula} on successful save)`;
        } else if (spell.damageConfig.partialEffectFormula) {
          // Fallback to the combined formula
          partialEffect = `(${spell.damageConfig.partialEffectFormula} on successful save)`;
        } else if (spell.damageConfig.partialEffectType === 'half' || spell.damageConfig.partialEffect === 'half_damage' || saveSuccess === 'half_damage') {
          partialEffect = '(Half damage on successful save)';
        } else if (spell.damageConfig.partialEffectType === 'quarter') {
          partialEffect = '(Quarter damage on successful save)';
        } else if (spell.damageConfig.partialEffectType === 'none') {
          partialEffect = '(No damage on successful save)';
        } else {
          // Default fallback
          partialEffect = '(Half damage on successful save)';
        }

        if (partialEffect) {
          savingThrowInfo += ` ${partialEffect}`;
        }
      } else {
        // If no partial effect is specified, default to half damage
        savingThrowInfo += ' (Half damage on successful save)';
      }
    }
  } catch (error) {
    console.error("Error getting damage saving throw info:", error);
  }

  // Check for direct damage - only if spell actually has damage configuration
  const hasValidDamage = spell.primaryDamage ||
                         (spell.effectType === 'damage' && (spell.formula || spell.damageConfig?.formula)) ||
                         spell.damageConfig?.formula ||
                         spell.diceConfig?.formula;

  if (hasValidDamage) {
    // Get the primary damage type with proper capitalization
    const primaryType = damageTypes.length > 0 ?
                      damageTypes[0].charAt(0).toUpperCase() + damageTypes[0].slice(1) :
                      'Physical';

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

      // Add a special CSS class identifier for styling
      const formattedFormula = formatFormulaToPlainEnglish(formula, 'damage');
      effects.push(`<span class="coin-formula">Flip ${flipCount} coins: ${formattedFormula}</span>`);
    }
    // Check for specific named spells that should use card mechanics
    else if ((spell.name && (
               spell.name.toLowerCase().includes('arcane gambit') ||
               spell.name.toLowerCase().includes('card') ||
               spell.name.toLowerCase().includes('deck') ||
               spell.name.toLowerCase().includes('dealer') ||
               spell.name.toLowerCase().includes('joker')
             )) ||
             (spell.id === 'arcane_gambit' || spell.id === 'wqcsbdql') ||
             // Only use card mechanics if explicitly configured
             (spell.resolution === 'CARDS' && spell.cardConfig)) {
      const drawCount = spell.cardConfig?.drawCount || 4;
      const formula = spell.cardConfig?.formula || 'card values + face cards × 5';

      // Convert technical formula to readable text
      const readableFormula = formatFormulaToPlainEnglish(formula, 'damage');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="card-formula">Draw ${drawCount} cards: ${readableFormula}</span>`);
    }
    // Standard dice-based damage
    else {
      // Get formula from all possible sources, but only if they exist
      const damageAmount = spell.damageConfig?.formula ||
                          spell.primaryDamage?.dice ||
                          spell.diceConfig?.formula ||
                          spell.formula;

      // Only add damage effect if we have a valid formula
      if (damageAmount && damageAmount !== '0d6' && damageAmount !== '0' && damageAmount.trim() !== '') {
        // Add flat damage if available
        const flatDamage = spell.primaryDamage?.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';

        // Create a more visually appealing format for the damage effect
        effects.push(`${damageAmount}${flatDamage} ${primaryType} damage`);
      }
    }
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

  // Add saving throw information as a separate entry if available
  if (savingThrowInfo) {
    // Make sure this is always the last entry for better display
    effects.push(savingThrowInfo);
  } else if (spell.damageConfig?.savingThrow) {
    // Fallback if savingThrowInfo wasn't set but savingThrow is enabled
    let saveType;
    if (typeof spell.damageConfig.savingThrow === 'string') {
      // If savingThrow is a string, use it as the save type
      saveType = spell.damageConfig.savingThrow;
    } else {
      // If savingThrow is boolean/object, use savingThrowType
      saveType = spell.damageConfig.savingThrowType || 'agility';
    }

    if (saveType.toLowerCase() === 'dexterity') saveType = 'agility';
    if (saveType.toLowerCase() === 'wisdom') saveType = 'spirit';

    const dc = spell.damageConfig.difficultyClass || 15;
    let savingThrowText = `<span class="saving-throw-placeholder"></span>`;

    // Add partial effect information if available
    if (spell.damageConfig.partialEffect || spell.damageConfig.partialEffectType || spell.damageConfig.partialEffectFormula) {
      if (spell.damageConfig.partialEffectType === 'half' || spell.damageConfig.partialEffect === 'half_damage') {
        savingThrowText += ' (Half damage on successful save)';
      } else if (spell.damageConfig.partialEffectType === 'quarter') {
        savingThrowText += ' (Quarter damage on successful save)';
      } else if (spell.damageConfig.partialEffectType === 'none') {
        savingThrowText += ' (No damage on successful save)';
      } else if (spell.damageConfig.partialEffectFormula) {
        savingThrowText += ` (${spell.damageConfig.partialEffectFormula} on successful save)`;
      } else {
        savingThrowText += ' (Half damage on successful save)';
      }
    } else {
      // Default to half damage if no partial effect is specified
      savingThrowText += ' (Half damage on successful save)';
    }

    effects.push(savingThrowText);
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

  // Check for direct healing - only if spell actually has healing configuration
  const hasValidHealing = spell.healing ||
                         (spell.effectType === 'healing' && (spell.formula || spell.healingConfig?.formula)) ||
                         (spell.effectTypes && spell.effectTypes.includes('healing') && spell.healingConfig?.formula) ||
                         spell.healingConfig?.formula ||
                         spell.diceConfig?.formula;

  if (hasValidHealing) {
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

      // Add a special CSS class identifier for styling
      effects.push(`<span class="coin-formula">Flip ${flipCount} coins: ${formula}</span>`);
    }
    // Check for specific named spells that should use card mechanics for healing
    else if ((spell.name && (
               spell.name.toLowerCase().includes('arcane gambit') ||
               spell.name.toLowerCase().includes('card heal') ||
               spell.name.toLowerCase().includes('deck of life') ||
               spell.name.toLowerCase().includes('royal healing') ||
               spell.name.toLowerCase().includes('ace of hearts')
             )) ||
             (spell.id === 'arcane_gambit' || spell.id === 'wqcsbdql') ||
             // Only use card mechanics if explicitly configured
             (spell.resolution === 'CARDS' && spell.healingCardConfig)) {
      const drawCount = spell.healingCardConfig?.drawCount || 3;
      const formula = spell.healingCardConfig?.formula || 'card values + face cards × 3';

      // Convert technical formula to readable text
      const readableFormula = formatFormulaToPlainEnglish(formula, 'damage');

      // Add a special CSS class identifier for styling
      effects.push(`<span class="card-formula">Draw ${drawCount} cards: ${readableFormula}</span>`);
    }
    // Standard dice-based healing
    else {
      // Get formula from all possible sources, but only if they exist
      const healAmount = spell.healingConfig?.formula ||
                        spell.healing?.dice ||
                        spell.diceConfig?.formula ||
                        spell.formula;

      // Only add healing effect if we have a valid formula
      if (healAmount && healAmount !== '0d6' && healAmount !== '0' && healAmount.trim() !== '') {
        // Add flat healing if available
        const flatHealing = spell.healing?.flat > 0 ? ` + ${spell.healing.flat}` : '';

        effects.push(`${healAmount}${flatHealing} healing`);
      }
    }
  }

  // Check for HoT
  if (spell.isHot || spell.hasHotEffect || spell.healingConfig?.hasHotEffect) {
    // Get duration from all possible sources
    const duration = spell.healingConfig?.hotConfig?.duration ||
                    spell.hotDuration ||
                    3;

    // Get tick formula from all possible sources
    let hotTick = spell.healingConfig?.hotConfig?.tickFormula ||
                  spell.hotTick ||
                  '1d4';

    // Convert technical formula to readable text
    let readableHotTick = formatFormulaToPlainEnglish(hotTick, 'healing');

    // Capitalize first letter if not already
    readableHotTick = readableHotTick.charAt(0).toUpperCase() + readableHotTick.slice(1);

    // Show as HoT with proper formatting
    effects.push(`HoT: ${readableHotTick} for ${duration} rounds`);
  }

  // Check for Shield
  if (spell.isShield || spell.hasShieldEffect) {
    const duration = spell.shieldDuration || 3;
    const shieldAmount = spell.shieldAmount || '2d6';
    effects.push(`${isNatureHealing ? 'Nature' : 'Holy'} Absorption Shield: ${shieldAmount} for ${duration} rounds`);
  }

  // Check for critical healing effects
  const criticalConfig = spell.healingConfig?.criticalConfig || spell.criticalConfig;
  if (criticalConfig?.enabled && (spell.effectType === 'healing' || spell.effectTypes?.includes('healing'))) {
    if (criticalConfig.useRollableTable && spell.rollableTable) {
      effects.push(criticalConfig.displayText || `On Critical: Roll on ${spell.rollableTable.name} table (${spell.rollableTable.diceType})`);
    } else if (criticalConfig.critMultiplier) {
      effects.push(`On Critical: ${criticalConfig.critMultiplier}x healing`);
    }
  }

  // Check for chance on heal effects
  const chanceConfig = spell.healingConfig?.chanceOnHitConfig || spell.chanceOnHitConfig;
  if (chanceConfig?.enabled && (spell.effectType === 'healing' || spell.effectTypes?.includes('healing'))) {
    let procText = '';

    if (chanceConfig.procType === 'dice') {
      const chance = Math.round(((21 - chanceConfig.diceThreshold) / 20) * 100);
      procText = `${chance}% chance on heal`;
    } else if (chanceConfig.procType === 'cards') {
      procText = `On ${chanceConfig.cardProcRule} cards`;
    } else if (chanceConfig.procType === 'coins') {
      procText = `On ${chanceConfig.coinProcRule} (${chanceConfig.coinCount} coins)`;
    }

    if (procText && chanceConfig.spellEffect) {
      effects.push(`${procText}: Trigger spell effect`);
    } else if (procText && chanceConfig.customEffects?.length > 0) {
      effects.push(`${procText}: ${chanceConfig.customEffects.join(', ')}`);
    }
  }

  // Check for progressive HoT
  if (spell.healingConfig?.isProgressiveHot && spell.healingConfig?.hotProgressiveStages?.length > 0) {
    const stages = spell.healingConfig.hotProgressiveStages;
    const tickType = spell.healingConfig.hotTickType || 'round';
    const unitLabel = tickType === 'round' ? 'Round' : tickType === 'turn' ? 'Turn' : tickType.charAt(0).toUpperCase() + tickType.slice(1);

    const progressiveText = stages
      .map(stage => `${unitLabel} ${stage.turn}: ${stage.formula}`)
      .join(' → ');

    effects.push(`Progressive HoT: ${progressiveText}`);
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
        // Check if this is a resistance stat
        const statName = (modifier.name || modifier.id || '').toLowerCase();
        const isResistanceStat = modifier.category === 'resistance' ||
                                statName.includes('resistance') ||
                                statName.includes('resist') ||
                                statName.includes('fire') ||
                                statName.includes('cold') ||
                                statName.includes('lightning') ||
                                statName.includes('acid') ||
                                statName.includes('poison') ||
                                statName.includes('necrotic') ||
                                statName.includes('radiant') ||
                                statName.includes('psychic') ||
                                statName.includes('thunder') ||
                                statName.includes('force') ||
                                statName.includes('slashing') ||
                                statName.includes('piercing') ||
                                statName.includes('bludgeoning') ||
                                statName.includes('physical');

        let effectName, buffEffect;

        if (isResistanceStat) {
          // Handle resistance stats with thematic descriptions
          const percentage = Math.round(parseFloat(modifier.magnitude) || 0);
          const damageType = extractDamageTypeFromResistanceName(modifier.name || modifier.id);

          if (percentage === 0) {
            buffEffect = getThematicResistanceDescription('immune', damageType);
          } else if (percentage === 25) {
            buffEffect = getThematicResistanceDescription('highly_resistant', damageType);
          } else if (percentage === 50) {
            buffEffect = getThematicResistanceDescription('resistant', damageType);
          } else if (percentage === 75) {
            buffEffect = getThematicResistanceDescription('guarded', damageType);
          } else if (percentage === 125) {
            buffEffect = getThematicResistanceDescription('susceptible', damageType);
          } else if (percentage === 150) {
            buffEffect = getThematicResistanceDescription('exposed', damageType);
          } else if (percentage === 200) {
            buffEffect = getThematicResistanceDescription('vulnerable', damageType);
          } else {
            // Fallback for other percentages
            if (percentage > 100) {
              buffEffect = `Increased ${damageType} vulnerability (${percentage}% damage)`;
            } else {
              buffEffect = `${damageType.charAt(0).toUpperCase() + damageType.slice(1)} resistance (${percentage}% damage)`;
            }
          }
          effectName = modifier.name || 'Resistance';
        } else {
          // Handle regular stats with generic formatting
          effectName = `${modifier.name || 'Stat'} Boost`;
          buffEffect = `${modifier.magnitude || 2}${modifier.magnitudeType === 'percentage' ? '%' : ''} ${modifier.name || 'stat'} increase`;
        }

        // Don't include duration in each effect, it will be added as a separate entry
        effects.push(`${effectName}: ${buffEffect}`);
      });
    }

    // Add buff duration as a separate entry
    if (effects.length > 0 && spell.buffConfig?.duration) {
      // Format the duration based on the type
      let durationText = '';
      if (spell.buffConfig.durationType === 'rest') {
        if (spell.buffConfig.restType === 'short') {
          durationText = 'until short rest';
        } else if (spell.buffConfig.restType === 'long') {
          durationText = 'until long rest';
        } else {
          durationText = 'until rest';
        }
      } else if (spell.buffConfig.durationType === 'permanent') {
        durationText = 'permanent';
      } else {
        const durationUnit = spell.buffConfig.durationUnit || 'rounds';
        durationText = `${spell.buffConfig.duration} ${durationUnit}`;
      }

      // Add duration as a separate entry
      if (durationText) {
        effects.push(`Duration: ${durationText}`);
      }
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

  // Get saving throw information if available
  let savingThrowInfo = '';
  let savingThrowType = '';
  let dc = 15;
  let partialEffect = '';

  try {
    if (spell.debuffConfig?.savingThrow) {
      // Convert dexterity to agility and wisdom to spirit
      let saveType = spell.debuffConfig.savingThrowType || 'constitution';
      if (saveType.toLowerCase() === 'dexterity') saveType = 'agility';
      if (saveType.toLowerCase() === 'wisdom') saveType = 'spirit';

      savingThrowType = saveType.toUpperCase();
      dc = spell.debuffConfig.difficultyClass || 15;
      savingThrowInfo = `DC ${dc} ${savingThrowType} saving throw`;

      // Add save outcome information if available
      if (spell.debuffConfig.saveOutcome) {
        const outcomeMap = {
          'negates': 'negated on save',
          'halves_duration': 'duration halved on save',
          'halves_effects': 'effects halved on save',
          'reduces_level': 'level reduced on save'
        };
        const outcomeText = outcomeMap[spell.debuffConfig.saveOutcome] || 'negated on save';
        savingThrowInfo += ` (${outcomeText})`;
      } else if (spell.debuffConfig.partialEffect) {
        partialEffect = spell.debuffConfig.partialEffectDescription || 'Half effect on successful save';
        savingThrowInfo += ` (${partialEffect})`;
      }
    }
  } catch (error) {
    console.error("Error getting debuff saving throw info:", error);
  }

  // Get duration if available
  let durationText = '';
  try {
    if (spell.debuffConfig?.duration) {
      // Format the duration based on the type
      if (spell.debuffConfig.durationType === 'rest') {
        if (spell.debuffConfig.restType === 'short') {
          durationText = 'until short rest';
        } else if (spell.debuffConfig.restType === 'long') {
          durationText = 'until long rest';
        } else {
          durationText = 'until rest';
        }
      } else if (spell.debuffConfig.durationType === 'permanent') {
        durationText = 'permanent';
      } else {
        const durationUnit = spell.debuffConfig.durationUnit || 'rounds';
        durationText = `${spell.debuffConfig.duration} ${durationUnit}`;
      }
    }
  } catch (error) {
    console.error("Error getting debuff duration info:", error);
    durationText = '3 rounds'; // Default fallback
  }

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
        // Handle movement speed reduction specifically
        if (penalty.stat === 'movement_speed' || penalty.name?.toLowerCase() === 'movement speed') {
          const value = penalty.value || penalty.magnitude || 5;
          // Make sure value is a valid number
          if (!isNaN(value)) {
            // Ensure we don't add a negative sign if the value is already negative
            const formattedValue = value < 0 ? Math.abs(value) : value;
            effects.push(`Movement Speed: -${formattedValue}${penalty.isPercentage || penalty.magnitudeType === 'percentage' ? '%' : ' ft'}`);
          } else {
            effects.push(`Movement Speed: -5 ft`); // Default value if NaN
          }
          return;
        }

        // Handle both name and stat properties for other stats
        const statName = penalty.name ||
                        (penalty.stat ? penalty.stat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Movement Speed');

        // Handle both value and magnitude properties
        let value;
        if (penalty.value !== undefined && !isNaN(penalty.value)) {
          // Ensure we don't add a negative sign if the value is already negative
          const formattedValue = Math.abs(penalty.value);
          value = penalty.isPercentage ? `${formattedValue}%` : formattedValue;
          effects.push(`${statName}: -${value}`);
        } else if (penalty.magnitude !== undefined && !isNaN(penalty.magnitude)) {
          // Ensure we don't add a negative sign if the value is already negative
          const formattedValue = Math.abs(penalty.magnitude);
          value = penalty.magnitudeType === 'percentage' ? `${formattedValue}%` : formattedValue;
          effects.push(`${statName}: -${value}`);
        } else {
          // Default value if neither is present or if they're NaN
          effects.push(`${statName}: -2`);
        }
      });
    }

    // Add duration to each effect without adding saving throw to each one
    if (durationText && !effects.some(e => e.includes('for '))) {
      // Add the duration to each effect that doesn't already have one
      const effectsWithDuration = effects.map(effect => {
        if (!effect.includes('for ')) {
          return `${effect} for ${durationText}`;
        }
        return effect;
      });

      // Replace the effects array with the updated one
      effects.length = 0;
      effectsWithDuration.forEach(effect => effects.push(effect));
    }

    // Add saving throw information as a separate entry if available
    if (savingThrowInfo) {
      effects.push(savingThrowInfo);
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

  // Get saving throw information if available
  let savingThrowInfo = '';
  let savingThrowType = '';
  let dc = 15;

  try {
    if (spell.controlConfig?.savingThrow) {
      // Convert dexterity to agility and wisdom to spirit
      let saveType = spell.controlConfig.savingThrowType || 'strength';
      if (saveType.toLowerCase() === 'dexterity') saveType = 'agility';
      if (saveType.toLowerCase() === 'wisdom') saveType = 'spirit';

      savingThrowType = saveType.toUpperCase();
      dc = spell.controlConfig.difficultyClass || 15;
      savingThrowInfo = `DC ${dc} ${savingThrowType} saving throw`;
    }
  } catch (error) {
    console.error("Error getting saving throw info:", error);
  }

  // Get duration if available
  let durationText = '';
  try {
    if (spell.controlConfig?.duration) {
      // Format the duration based on the type
      if (spell.controlConfig.durationType === 'rest') {
        if (spell.controlConfig.restType === 'short') {
          durationText = 'until short rest';
        } else if (spell.controlConfig.restType === 'long') {
          durationText = 'until long rest';
        } else {
          durationText = 'until rest';
        }
      } else if (spell.controlConfig.durationType === 'permanent') {
        durationText = 'permanent';
      } else {
        const durationUnit = spell.controlConfig.durationUnit || 'rounds';
        durationText = `${spell.controlConfig.duration} ${durationUnit}`;
      }
    }
  } catch (error) {
    console.error("Error getting duration info:", error);
    durationText = '3 rounds'; // Default fallback
  }

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
        // Handle both string and object formats
        if (typeof effect === 'string') {
          // Format specific control effects with better descriptions
          if (effect.toLowerCase() === 'immobilized') {
            effects.push(`Immobilized: Target cannot move`);
          } else if (effect.toLowerCase() === 'restrained') {
            effects.push(`Restrained: Target has disadvantage on attacks and Agility saving throws`);
          } else if (effect.toLowerCase() === 'stunned') {
            effects.push(`Stunned: Target cannot take actions or reactions`);
          } else if (effect.toLowerCase() === 'prone') {
            effects.push(`Prone: Target is knocked to the ground`);
          } else if (effect.toLowerCase() === 'blinded') {
            effects.push(`Blinded: Target cannot see and automatically fails sight-based checks`);
          } else {
            // Default formatting for other effects
            const effectName = effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            effects.push(`${effectName}: Target is ${effect.toLowerCase()}`);
          }
        } else if (typeof effect === 'object' && (effect.type || effect.name)) {
          // Get the effect name from either 'type' or 'name' property
          const effectName = effect.type || effect.name;
          const effectDescription = effect.description || 'Target is affected';

          // Format specific control effect types with better descriptions
          if (effectName.toLowerCase() === 'immobilized') {
            effects.push(`Immobilized: ${effect.description || 'Target cannot move'}`);
          } else if (effectName.toLowerCase() === 'restrained') {
            effects.push(`Restrained: ${effect.description || 'Target has disadvantage on attacks and Agility saving throws'}`);
          } else if (effectName.toLowerCase() === 'stunned') {
            effects.push(`Stunned: ${effect.description || 'Target cannot take actions or reactions'}`);
          } else if (effectName.toLowerCase() === 'prone') {
            effects.push(`Prone: ${effect.description || 'Target is knocked to the ground'}`);
          } else if (effectName.toLowerCase() === 'blinded') {
            effects.push(`Blinded: ${effect.description || 'Target cannot see and automatically fails sight-based checks'}`);
          } else {
            // For other effects like "Animal Form", use the name and description directly
            let formattedEffect = `${effectName}: ${effectDescription}`;

            // Add duration if available on the individual effect
            if (effect.duration) {
              const effectDurationUnit = effect.durationUnit || 'seconds';
              formattedEffect += ` (${effect.duration} ${effectDurationUnit})`;
            }

            effects.push(formattedEffect);
          }
        }
      });
    }

    // Check for direct controlEffects array (legacy format)
    if (spell.controlEffects && spell.controlEffects.length > 0) {
      spell.controlEffects.forEach(effect => {
        // Handle both object and string formats
        if (typeof effect === 'object') {
          // Format object-based control effect
          if (effect.type) {
            // Format specific control effect types with better descriptions
            if (effect.type.toLowerCase() === 'immobilized') {
              effects.push(`Immobilized: ${effect.description || 'Target cannot move'}`);
            } else if (effect.type.toLowerCase() === 'restrained') {
              effects.push(`Restrained: ${effect.description || 'Target has disadvantage on attacks and Agility saving throws'}`);
            } else if (effect.type.toLowerCase() === 'stunned') {
              effects.push(`Stunned: ${effect.description || 'Target cannot take actions or reactions'}`);
            } else {
              effects.push(`${effect.type}: ${effect.description || 'Target is affected'}`);
            }
          }
          // We don't add separate saving throw entries anymore
        } else if (typeof effect === 'string') {
          // Format specific string control effects
          if (effect.toLowerCase().includes('immobilized')) {
            effects.push(`Immobilized: Target cannot move`);
          } else if (effect.toLowerCase().includes('restrained')) {
            effects.push(`Restrained: Target has disadvantage on attacks and Agility saving throws`);
          } else if (effect.toLowerCase().includes('stunned')) {
            effects.push(`Stunned: Target cannot take actions or reactions`);
          } else {
            effects.push(effect);
          }
        }
      });
    }

    // Add duration as a separate entry
    if (durationText) {
      effects.push(`Duration: ${durationText}`);
    }

    // Add saving throw information as a separate entry if available
    if (savingThrowInfo) {
      // Add the saving throw info
      effects.push(savingThrowInfo);
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

  // Include detailed information about the channeling effects
  if (spell.channelingConfig) {
    // Add channeling type
    if (spell.channelingConfig.type) {
      const channelType = spell.channelingConfig.type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      effects.push(`Channel Type: ${channelType}`);
    }

    // Add max duration
    if (spell.channelingConfig.maxDuration) {
      effects.push(`Max Duration: ${spell.channelingConfig.maxDuration} ${spell.channelingConfig.durationUnit || 'rounds'}`);
    }

    // Add resource cost
    if (spell.channelingConfig.costValue && spell.channelingConfig.costType) {
      effects.push(`Cost: ${spell.channelingConfig.costValue} ${spell.channelingConfig.costType} per ${
        spell.channelingConfig.costTrigger === 'per_second' ? 'second' :
        spell.channelingConfig.costTrigger === 'per_turn' ? 'turn' : 'round'
      }`);
    }

    // Add concentration check if applicable
    if (spell.channelingConfig.requiresConcentration) {
      const dc = spell.channelingConfig.concentrationDC || 10;
      effects.push(`Requires Concentration: DC ${dc} ${spell.channelingConfig.concentrationType || 'Constitution'} check when taking damage`);
    }

    // Add per-round formulas for damage
    if (spell.channelingConfig.perRoundFormulas?.damage &&
        Array.isArray(spell.channelingConfig.perRoundFormulas.damage) &&
        spell.channelingConfig.perRoundFormulas.damage.length > 0) {

      // Determine damage type
      const damageType = spell.damageTypes && spell.damageTypes.length > 0 ?
                        spell.damageTypes[0].charAt(0).toUpperCase() + spell.damageTypes[0].slice(1) :
                        'Physical';

      // Add header for damage scaling
      effects.push(`${damageType} Damage Scaling:`);

      // Add each round's formula
      spell.channelingConfig.perRoundFormulas.damage.forEach((formula, index) => {
        effects.push(`  Round ${index + 1}: ${formula}`);
      });
    }

    // Add per-round formulas for healing
    if (spell.channelingConfig.perRoundFormulas?.healing &&
        Array.isArray(spell.channelingConfig.perRoundFormulas.healing) &&
        spell.channelingConfig.perRoundFormulas.healing.length > 0) {

      // Determine if this is Nature or Holy healing
      const isNatureHealing = (spell.school && spell.school.toLowerCase() === 'nature') ||
                             (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

      // Add header for healing scaling
      effects.push(`${isNatureHealing ? 'Nature' : 'Holy'} Healing Scaling:`);

      // Add each round's formula
      spell.channelingConfig.perRoundFormulas.healing.forEach((formula, index) => {
        effects.push(`  Round ${index + 1}: ${formula}`);
      });
    }

    // Add per-round formulas for DoT
    if (spell.channelingConfig.perRoundFormulas?.dot_damage &&
        Array.isArray(spell.channelingConfig.perRoundFormulas.dot_damage) &&
        spell.channelingConfig.perRoundFormulas.dot_damage.length > 0) {

      // Determine damage type
      const damageType = spell.damageTypes && spell.damageTypes.length > 0 ?
                        spell.damageTypes[0].charAt(0).toUpperCase() + spell.damageTypes[0].slice(1) :
                        'Physical';

      // Add header for DoT scaling
      effects.push(`${damageType} DoT Scaling:`);

      // Add each round's formula
      spell.channelingConfig.perRoundFormulas.dot_damage.forEach((formula, index) => {
        effects.push(`  Round ${index + 1}: ${formula}`);
      });
    }

    // Add per-round formulas for HoT
    if (spell.channelingConfig.perRoundFormulas?.hot_healing &&
        Array.isArray(spell.channelingConfig.perRoundFormulas.hot_healing) &&
        spell.channelingConfig.perRoundFormulas.hot_healing.length > 0) {

      // Determine if this is Nature or Holy healing
      const isNatureHealing = (spell.school && spell.school.toLowerCase() === 'nature') ||
                             (spell.damageTypes && spell.damageTypes.some(type => type.toLowerCase() === 'nature'));

      // Add header for HoT scaling
      effects.push(`${isNatureHealing ? 'Nature' : 'Holy'} HoT Scaling:`);

      // Add each round's formula
      spell.channelingConfig.perRoundFormulas.hot_healing.forEach((formula, index) => {
        effects.push(`  Round ${index + 1}: ${formula}`);
      });
    }

    // Add movement restrictions if applicable
    if (spell.channelingConfig.movementRestriction) {
      const restriction = spell.channelingConfig.movementRestriction;
      if (restriction === 'none') {
        effects.push('Movement: Unrestricted');
      } else if (restriction === 'reduced') {
        const reduction = spell.channelingConfig.movementReductionAmount || 50;
        effects.push(`Movement: Reduced by ${reduction}%`);
      } else if (restriction === 'stationary') {
        effects.push('Movement: Cannot move while channeling');
      }
    }

    // Add interruption effects if applicable
    if (spell.channelingConfig.interruptionEffect) {
      effects.push(`On Interruption: ${spell.channelingConfig.interruptionEffect}`);
    }

    // Add completion effects if applicable
    if (spell.channelingConfig.completionEffect) {
      effects.push(`On Completion: ${spell.channelingConfig.completionEffect}`);
    }
  }

  return effects;
};

/**
 * Ensure all items in an array are strings, filtering out any objects
 * @param {Array} effects - Array of effects that should be strings
 * @param {string} effectType - Type of effect for logging
 * @returns {Array} - Array containing only strings
 */
const ensureStringArray = (effects, effectType) => {
  if (!Array.isArray(effects)) {
    return [];
  }

  return effects.filter(effect => {
    if (typeof effect === 'string') {
      return true;
    } else {
      // Try to convert object to string if it has useful properties
      if (typeof effect === 'object' && effect !== null) {
        if (effect.type && effect.formula) {
          return false; // Skip objects that look like config objects
        }
        if (effect.name && effect.description) {
          // Convert to string format
          return true;
        }
      }
      return false;
    }
  }).map(effect => {
    if (typeof effect === 'object' && effect.name && effect.description) {
      return `${effect.name}: ${effect.description}`;
    }
    return effect;
  });
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

  // Handle selectedEffects array
  if (spell.utilityConfig.selectedEffects && Array.isArray(spell.utilityConfig.selectedEffects)) {
    spell.utilityConfig.selectedEffects.forEach(effectName => {
      if (typeof effectName === 'string') {
        // Convert snake_case to readable format
        const readableName = effectName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

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

  // Handle utilityEffects array (from spell state)
  if (spell.utilityConfig.utilityEffects && Array.isArray(spell.utilityConfig.utilityEffects)) {
    spell.utilityConfig.utilityEffects.forEach(effect => {
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

  return effects;
};

/**
 * Format all effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Object} - Formatted effects
 */
export const formatAllEffects = (spell) => {
  try {
    const rawEffects = {
      damageEffects: formatDamageEffects(spell),
      healingEffects: formatHealingEffects(spell),
      buffEffects: formatBuffEffects(spell),
      debuffEffects: formatDebuffEffects(spell),
      controlEffects: formatControlEffects(spell),
      procEffects: formatProcEffects(spell),
      criticalEffects: formatCriticalEffects(spell),
      channelingEffects: formatChannelingEffects(spell),
      utilityEffects: formatUtilityEffects(spell)
    };

    // Ensure all effects arrays contain only strings
    return {
      damageEffects: ensureStringArray(rawEffects.damageEffects, 'damage'),
      healingEffects: ensureStringArray(rawEffects.healingEffects, 'healing'),
      buffEffects: ensureStringArray(rawEffects.buffEffects, 'buff'),
      debuffEffects: ensureStringArray(rawEffects.debuffEffects, 'debuff'),
      controlEffects: ensureStringArray(rawEffects.controlEffects, 'control'),
      procEffects: ensureStringArray(rawEffects.procEffects, 'proc'),
      criticalEffects: ensureStringArray(rawEffects.criticalEffects, 'critical'),
      channelingEffects: ensureStringArray(rawEffects.channelingEffects, 'channeling'),
      utilityEffects: ensureStringArray(rawEffects.utilityEffects, 'utility')
    };
  } catch (error) {
    console.error('Error formatting spell effects:', error);
    return {
      damageEffects: [],
      healingEffects: [],
      buffEffects: [],
      debuffEffects: [],
      controlEffects: [],
      procEffects: [],
      criticalEffects: [],
      channelingEffects: [],
      utilityEffects: []
    };
  }
};
