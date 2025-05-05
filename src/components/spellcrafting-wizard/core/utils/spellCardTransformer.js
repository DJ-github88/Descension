/**
 * Utility function to transform spell data from the library format to the format expected by LibraryStyleSpellCard
 * This ensures consistent rendering between the library and review step
 */

/**
 * Transform a spell from the library format to the format expected by LibraryStyleSpellCard
 * @param {Object} spell - The spell object from the library
 * @returns {Object} - The transformed spell object
 */
export const transformSpellForCard = (spell) => {
  if (!spell) return null;

  // Create a deep copy to avoid modifying the original
  const transformedSpell = JSON.parse(JSON.stringify(spell));

  // Ensure all required properties exist
  transformedSpell.id = transformedSpell.id || 'unknown';
  transformedSpell.name = transformedSpell.name || 'Unnamed Spell';
  transformedSpell.description = transformedSpell.description || '';
  transformedSpell.level = transformedSpell.level || 1;
  transformedSpell.icon = transformedSpell.icon || transformedSpell.typeConfig?.icon || 'inv_misc_questionmark';
  transformedSpell.spellType = transformedSpell.spellType || 'ACTION';
  transformedSpell.effectType = transformedSpell.effectType || 'utility';

  // Ensure type configuration exists
  transformedSpell.typeConfig = transformedSpell.typeConfig || {};

  // Ensure casting information exists
  transformedSpell.castTime = transformedSpell.castTime || 'Instant';
  transformedSpell.range = transformedSpell.range || '30 ft';
  transformedSpell.rangeType = transformedSpell.rangeType || 'ranged';

  // Ensure targeting information exists
  transformedSpell.targetingMode = transformedSpell.targetingMode || 'single';
  transformedSpell.targetRestriction = transformedSpell.targetRestriction || null;
  transformedSpell.targetRestrictions = transformedSpell.targetRestrictions || [];
  transformedSpell.maxTargets = transformedSpell.maxTargets || 1;
  transformedSpell.selectionMethod = transformedSpell.selectionMethod || 'manual';
  transformedSpell.targetSelectionMethod = transformedSpell.targetSelectionMethod || transformedSpell.selectionMethod || 'manual';
  transformedSpell.rangeDistance = transformedSpell.rangeDistance || 30;

  // Ensure AOE information exists
  transformedSpell.aoeShape = transformedSpell.aoeShape || 'circle';
  transformedSpell.aoeSize = transformedSpell.aoeSize || 20;
  transformedSpell.aoeParameters = transformedSpell.aoeParameters || {};
  transformedSpell.movementBehavior = transformedSpell.movementBehavior || 'static';
  transformedSpell.targetingConfig = transformedSpell.targetingConfig || {};

  // Ensure propagation information exists
  if (!transformedSpell.propagation) {
    transformedSpell.propagation = {
      method: 'none',
      behavior: '',
      count: 0,
      range: 0,
      decay: 0,
      secondaryRadius: 0,
      spreadRate: 0,
      forkCount: 0,
      parameters: {}
    };
  }

  // Ensure damage/healing information exists
  if (!transformedSpell.primaryDamage && (transformedSpell.effectType === 'damage' || transformedSpell.damageTypes?.length > 0)) {
    // Check if we have a damageConfig with a formula
    if (transformedSpell.damageConfig?.formula) {
      const formula = transformedSpell.damageConfig.formula;
      const diceMatch = formula.match(/(\d+d\d+)/);
      const flatMatch = formula.match(/\+\s*(\d+)/);

      transformedSpell.primaryDamage = {
        dice: diceMatch ? diceMatch[1] : transformedSpell.formula || '6d6',
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    } else {
      transformedSpell.primaryDamage = {
        dice: transformedSpell.formula || '6d6',
        flat: 0
      };
    }
  }

  // Ensure damage over time configuration exists
  transformedSpell.isDot = transformedSpell.isDot || transformedSpell.damageConfig?.hasDotEffect || false;
  transformedSpell.hasDotEffect = transformedSpell.hasDotEffect || transformedSpell.damageConfig?.hasDotEffect || false;

  // If we have a damageConfig with dotConfig, use that information
  if (transformedSpell.damageConfig?.hasDotEffect && transformedSpell.damageConfig?.dotConfig) {
    transformedSpell.dotDuration = transformedSpell.damageConfig.dotConfig.duration || transformedSpell.dotDuration || 3;
    transformedSpell.dotTick = transformedSpell.damageConfig.dotConfig.tickFormula || transformedSpell.dotTick || '1d4';
    transformedSpell.dotTickType = transformedSpell.damageConfig.dotConfig.tickFrequency || transformedSpell.dotTickType || 'round';
    transformedSpell.dotApplication = transformedSpell.damageConfig.dotConfig.application || transformedSpell.dotApplication || 'start';
    transformedSpell.dotScalingType = transformedSpell.damageConfig.dotScalingType || transformedSpell.dotScalingType || 'flat';
  } else {
    transformedSpell.dotDuration = transformedSpell.dotDuration || 3;
    transformedSpell.dotTick = transformedSpell.dotTick || '1d4';
    transformedSpell.dotTickType = transformedSpell.dotTickType || 'round';
    transformedSpell.dotApplication = transformedSpell.dotApplication || 'start';
    transformedSpell.dotScalingType = transformedSpell.dotScalingType || 'flat';
  }

  // Ensure healing over time configuration exists
  transformedSpell.isHot = transformedSpell.isHot || transformedSpell.healingConfig?.hasHotEffect || false;
  transformedSpell.hasHotEffect = transformedSpell.hasHotEffect || transformedSpell.healingConfig?.hasHotEffect || false;

  // If we have a healingConfig with hotConfig, use that information
  if (transformedSpell.healingConfig?.hasHotEffect && transformedSpell.healingConfig?.hotConfig) {
    transformedSpell.hotDuration = transformedSpell.healingConfig.hotConfig.duration || transformedSpell.hotDuration || 3;
    transformedSpell.hotTick = transformedSpell.healingConfig.hotConfig.tickFormula || transformedSpell.hotTick || '1d4';
    transformedSpell.hotTickType = transformedSpell.healingConfig.hotConfig.tickFrequency || transformedSpell.hotTickType || 'round';
    transformedSpell.hotApplication = transformedSpell.healingConfig.hotConfig.application || transformedSpell.hotApplication || 'start';
    transformedSpell.hotScalingType = transformedSpell.healingConfig.hotScalingType || transformedSpell.hotScalingType || 'flat';
  } else {
    transformedSpell.hotDuration = transformedSpell.hotDuration || 3;
    transformedSpell.hotTick = transformedSpell.hotTick || '1d4';
    transformedSpell.hotTickType = transformedSpell.hotTickType || 'round';
    transformedSpell.hotApplication = transformedSpell.hotApplication || 'start';
    transformedSpell.hotScalingType = transformedSpell.hotScalingType || 'flat';
  }

  // Ensure shield configuration exists
  transformedSpell.isShield = transformedSpell.isShield || false;
  transformedSpell.hasShieldEffect = transformedSpell.hasShieldEffect || false;
  transformedSpell.shieldDuration = transformedSpell.shieldDuration || 3;
  transformedSpell.shieldAmount = transformedSpell.shieldAmount || '2d6';
  transformedSpell.shieldDamageTypes = transformedSpell.shieldDamageTypes || 'all';
  transformedSpell.shieldOverflow = transformedSpell.shieldOverflow || 'dissipate';
  transformedSpell.shieldBreakBehavior = transformedSpell.shieldBreakBehavior || 'fade';
  transformedSpell.shieldBreakEffect = transformedSpell.shieldBreakEffect || null;
  transformedSpell.shieldExpireEffect = transformedSpell.shieldExpireEffect || null;

  if (!transformedSpell.healing && transformedSpell.effectType === 'healing') {
    // Check if we have a healingConfig with a formula
    if (transformedSpell.healingConfig?.formula) {
      const formula = transformedSpell.healingConfig.formula;
      const diceMatch = formula.match(/(\d+d\d+)/);
      const flatMatch = formula.match(/\+\s*(\d+)/);

      transformedSpell.healing = {
        dice: diceMatch ? diceMatch[1] : transformedSpell.formula || '6d8',
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    } else {
      transformedSpell.healing = {
        dice: transformedSpell.formula || '6d8',
        flat: 0
      };
    }
  }

  // Ensure damage types exist
  transformedSpell.damageTypes = transformedSpell.damageTypes || [];

  // If we have a school in typeConfig but no damageTypes, add it
  if (transformedSpell.typeConfig?.school && transformedSpell.damageTypes.length === 0) {
    transformedSpell.damageTypes.push(transformedSpell.typeConfig.school);
  }

  // If we have a secondaryElement in typeConfig, add it to damageTypes
  if (transformedSpell.typeConfig?.secondaryElement &&
      !transformedSpell.damageTypes.includes(transformedSpell.typeConfig.secondaryElement)) {
    transformedSpell.damageTypes.push(transformedSpell.typeConfig.secondaryElement);
  }

  // Ensure resolution method exists
  transformedSpell.resolution = transformedSpell.resolution || 'DICE';
  transformedSpell.formula = transformedSpell.formula || '6d6';
  transformedSpell.diceConfig = transformedSpell.diceConfig || { formula: transformedSpell.formula || '6d6' };
  transformedSpell.cardConfig = transformedSpell.cardConfig || { drawCount: 3, formula: 'CARD_VALUE + FACE_CARD_COUNT * 5' };
  transformedSpell.coinConfig = transformedSpell.coinConfig || { flipCount: 5, formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)' };

  // Ensure healing-specific configurations for different resolution methods exist
  transformedSpell.healingCardConfig = transformedSpell.healingCardConfig || { drawCount: 3, formula: 'CARD_VALUE + FACE_CARD_COUNT * 3' };
  transformedSpell.healingCoinConfig = transformedSpell.healingCoinConfig || { flipCount: 5, formula: 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)' };

  // Ensure critical hit configuration exists
  if (!transformedSpell.criticalConfig) {
    transformedSpell.criticalConfig = {
      enabled: false,
      critType: transformedSpell.resolution?.toLowerCase() || 'dice',
      critMultiplier: 2,
      explodingDice: false,
      extraCardDraw: 2,
      extraCoinFlips: 3,
      spellEffect: null,
      useRollableTable: false,
      effectType: null,
      effectDetails: null,
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      immunityType: 'Damage',
      buffType: 'Stat Boost',
      debuffType: 'Stat Reduction',
      damageAmount: '2d6',
      damageType: 'Force',
      healAmount: '2d6',
      controlType: 'Stun'
    };
  }

  // Add displayText to criticalConfig if it doesn't exist
  if (transformedSpell.criticalConfig?.enabled && !transformedSpell.criticalConfig.displayText) {
    const critType = transformedSpell.effectType === 'damage' ? 'damage' :
                    transformedSpell.effectType === 'healing' ? 'healing' : 'effect';
    const critMultiplier = transformedSpell.criticalConfig.critMultiplier || 2;

    if (transformedSpell.criticalConfig.useRollableTable && transformedSpell.rollableTable) {
      transformedSpell.criticalConfig.displayText = `On Critical: ${critMultiplier}x ${critType} and roll on ${transformedSpell.rollableTable.name} table (${transformedSpell.rollableTable.diceType})`;
    } else if (transformedSpell.criticalConfig.critEffects && transformedSpell.criticalConfig.critEffects.length > 0) {
      const critEffects = transformedSpell.criticalConfig.critEffects.map(effect => {
        return effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }).join(', ');
      transformedSpell.criticalConfig.displayText = `On Critical: ${critMultiplier}x ${critType} and ${critEffects}`;
    } else {
      transformedSpell.criticalConfig.displayText = `On Critical: ${critMultiplier}x ${critType}`;
    }
  }

  // Ensure buff/debuff configuration exists
  transformedSpell.buffConfig = transformedSpell.buffConfig || null;
  transformedSpell.debuffConfig = transformedSpell.debuffConfig || null;

  // Ensure tags are properly formatted
  if (!transformedSpell.tags || !Array.isArray(transformedSpell.tags)) {
    transformedSpell.tags = [];
  }

  // Add tags based on spell properties
  if (transformedSpell.resolution === 'DICE' && !transformedSpell.tags.includes('dice-based')) {
    transformedSpell.tags.push('dice-based');
  }

  if (transformedSpell.resolution === 'CARDS' && !transformedSpell.tags.includes('card-based')) {
    transformedSpell.tags.push('card-based');
  }

  if (transformedSpell.resolution === 'COINS' && !transformedSpell.tags.includes('coin-based')) {
    transformedSpell.tags.push('coin-based');
  }

  // Add effect-based tags
  if (transformedSpell.effectType && !transformedSpell.tags.includes(transformedSpell.effectType)) {
    transformedSpell.tags.push(transformedSpell.effectType);
  }

  // Add spell type tags
  if (transformedSpell.spellType === 'CHANNELED' && !transformedSpell.tags.includes('channeled')) {
    transformedSpell.tags.push('channeled');
  }

  if (transformedSpell.spellType === 'PASSIVE' && !transformedSpell.tags.includes('passive')) {
    transformedSpell.tags.push('passive');
  }

  if (transformedSpell.spellType === 'REACTION' && !transformedSpell.tags.includes('reaction')) {
    transformedSpell.tags.push('reaction');
  }

  // Ensure resource configuration exists
  if (!transformedSpell.resourceCost) {
    transformedSpell.resourceCost = {
      mana: 25,
      actionPoints: 1,
      primaryResourceType: 'Mana',
      classResourceCost: 0,
      components: [],
      materialComponents: '',
      useFormulas: {},
      resourceFormulas: {},
      resourceValues: {}
    };
  }

  // Ensure cooldown configuration exists
  if (!transformedSpell.cooldownConfig) {
    transformedSpell.cooldownConfig = {
      type: 'turn_based',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  }

  // Ensure channeling configuration exists for channeled spells
  if ((transformedSpell.spellType === 'CHANNELED' || transformedSpell.spellType === 'channeled') && !transformedSpell.channelingConfig) {
    transformedSpell.channelingConfig = {
      type: 'power_up',
      maxDuration: 3,
      durationUnit: 'turns',
      interruptible: true,
      movementAllowed: false,
      costValue: 1,
      costType: 'mana',
      costTrigger: 'per_turn',
      perRoundFormulas: {},
      initialRadius: 5,
      maxRadius: 30,
      expansionRate: 5,
      maxDamageReduction: 50,
      persistentRadius: 10,
      persistentEffectType: 'aura',
      stages: []
    };
  }

  // Ensure chance on hit configuration exists
  if (!transformedSpell.procConfig) {
    transformedSpell.procConfig = {
      enabled: false,
      procType: transformedSpell.resolution?.toLowerCase() || 'dice',
      procChance: 15,
      diceThreshold: 18,
      cardProcRule: 'face_cards',
      coinProcRule: 'all_heads',
      coinCount: 3,
      spellEffect: null,
      useRollableTable: false,
      effectType: null,
      effectDetails: null,
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      immunityType: 'Damage',
      buffType: 'Stat Boost',
      debuffType: 'Stat Reduction',
      damageAmount: '2d6',
      damageType: 'Force',
      healAmount: '2d6',
      controlType: 'Stun',
      customEffects: []
    };
  }

  // Add displayText to procConfig if it doesn't exist
  if (transformedSpell.procConfig?.enabled && !transformedSpell.procConfig.displayText) {
    const procChance = transformedSpell.procConfig.procChance || 15;
    const effectType = transformedSpell.procConfig.effectType?.charAt(0).toUpperCase() + transformedSpell.procConfig.effectType?.slice(1) || 'Effect';
    const effectDetails = transformedSpell.procConfig.effectDetails || 'special effect';

    // Format the proc chance to show dice equivalent
    let diceDisplay = '';
    if (procChance === 100) {
      diceDisplay = 'Always triggers (100%)';
    } else if (transformedSpell.procConfig.procType === 'dice') {
      const diceType = 'd20';
      const threshold = Math.ceil(20 - (procChance / 100 * 20));
      diceDisplay = `Roll ${threshold}+ on ${diceType} (${procChance}%)`;
    } else if (transformedSpell.procConfig.procType === 'cards') {
      diceDisplay = `Card draw (${procChance}%)`;
    } else if (transformedSpell.procConfig.procType === 'coins') {
      diceDisplay = `Coin flip (${procChance}%)`;
    } else {
      // Default to d100
      const threshold = Math.ceil(100 - procChance + 1);
      diceDisplay = `Roll ${threshold}+ on d100 (${procChance}%)`;
    }

    if (transformedSpell.procConfig.useRollableTable && (transformedSpell.procRollableTable || transformedSpell.rollableTable)) {
      const table = transformedSpell.procRollableTable || transformedSpell.rollableTable;
      transformedSpell.procConfig.displayText = `Chance on Hit: ${diceDisplay}: Roll on ${table.name} table (${table.diceType})`;
    } else if (transformedSpell.procConfig.customEffects && transformedSpell.procConfig.customEffects.length > 0) {
      const customEffects = transformedSpell.procConfig.customEffects.map(effect => {
        return effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }).join(', ');
      transformedSpell.procConfig.displayText = `Chance on Hit: ${diceDisplay}: ${customEffects}`;
    } else {
      transformedSpell.procConfig.displayText = `Chance on Hit: ${diceDisplay}: ${effectType} - ${effectDetails}`;
    }
  }

  // Ensure trigger configuration exists
  if (!transformedSpell.triggerConfig) {
    transformedSpell.triggerConfig = {
      enabled: false,
      logicType: 'AND',
      compoundTriggers: [],
      effectTriggers: {},
      dotTrigger: null,
      hotTrigger: null
    };
  }

  return transformedSpell;
};

/**
 * Get the rollable table data from a spell
 * @param {Object} spell - The spell object
 * @returns {Object|null} - The rollable table data or null if not found
 */
export const getSpellRollableTable = (spell) => {
  if (!spell) return null;

  // Try to find the rollable table data in various locations
  return spell.rollableTable ||
         spell.rollTable ||
         spell.randomTable ||
         spell.randomEffectsTable ||
         spell.typeConfig?.rollableTable ||
         spell.effectConfig?.rollableTable ||
         spell.mechanicsConfig?.rollableTable ||
         spell.spellConfig?.rollableTable ||
         null;
};
